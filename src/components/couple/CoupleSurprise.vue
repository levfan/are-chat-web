<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { coupleApi } from '@/api/couple'
import { useAuthStore } from '@/stores/auth'
import type { CoupleBoxVO, CoupleScratchVO } from '@/types'
import CoupleCollapsible from './CoupleCollapsible.vue'

/**
 * 刮刮乐与盲盒（保留卡 `couple-surprise`）：
 * 券每周自动发一张，由 TA 送、我刮开；只有送券人能点「已兑现」（兑现即 +5 分归送券人）。
 * 盒子里装着约定日子的惊喜，到日才打得开，且装盒的人不能自拆。
 */
const auth = useAuthStore()
const scratches = ref<CoupleScratchVO[]>([])
const boxes = ref<CoupleBoxVO[]>([])
const boxKind = ref<'whisper' | 'task'>('whisper')
const boxContent = ref('')
const boxDay = ref('')

const myCards = computed(() => scratches.value.filter((s) => s.fromUser !== auth.username))
const myBoxes = computed(() => boxes.value.filter((b) => b.fromUser !== auth.username))

async function refresh() {
  try {
    const [s, b] = await Promise.all([coupleApi.scratches(), coupleApi.boxes()])
    scratches.value = s ?? []
    boxes.value = b ?? []
  } catch {
    scratches.value = []
    boxes.value = []
  }
}

async function onScratch(id: string) {
  try {
    const card = await coupleApi.scratchCard(id)
    scratches.value = scratches.value.map((s) => (s.id === id ? card : s))
    ElMessage.success(`🎉 刮出来是：${card.prizeText || '一个惊喜'}`)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '刮不开')
  }
}

async function onRedeem(id: string) {
  try {
    const card = await coupleApi.redeemScratch(id)
    scratches.value = scratches.value.map((s) => (s.id === id ? card : s))
    ElMessage.success('✅ 兑现了，这 5 分记在你头上')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '核销失败')
  }
}

async function onCreateBox() {
  const c = boxContent.value.trim()
  if (!c) {
    ElMessage.warning('盒子里总得装点什么')
    return
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(boxDay.value)) {
    ElMessage.warning('开箱日写成 yyyy-MM-dd')
    return
  }
  try {
    const box = await coupleApi.createBox(boxKind.value, c, boxDay.value)
    boxes.value = [box, ...boxes.value]
    boxContent.value = ''
    ElMessage.success('📦 盒子封存好了，到日 TA 才能拆')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '装盒失败')
  }
}

async function onOpen(id: string) {
  try {
    const box = await coupleApi.openBox(id)
    boxes.value = boxes.value.map((b) => (b.id === id ? box : b))
    ElMessage.success('🎁 拆开了')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '拆不开')
  }
}

onMounted(refresh)
</script>

<template>
  <CoupleCollapsible testid="couple-surprise" :empty="!scratches.length && !boxes.length">
    <template #title>
      🎁 刮刮乐与盲盒 <span class="sub">每周拆一次，盒子留到有日子的那天</span>
    </template>

    <section>
      <h5 class="line-title">本周的券</h5>
      <ul v-if="myCards.length" class="list">
        <li v-for="s in myCards" :key="s.id" class="card" :data-testid="`couple-scratch-${s.id}`">
          <span v-if="!s.scratched" class="hidden" data-testid="couple-scratch-unknown">🩶 还没刮开</span>
          <b v-else class="prize" data-testid="couple-scratch-prize">{{ s.prizeText }}</b>
          <span class="from">来自 {{ s.fromUser }} · {{ s.weekKey }}</span>
          <el-button v-if="!s.scratched" type="primary" size="small"
                     :data-testid="`couple-scratch-scratch-${s.id}`" @click="onScratch(s.id)">刮开 ✨</el-button>
          <span v-else-if="s.redeemed" class="done" data-testid="couple-scratch-redeemed">已兑现</span>
        </li>
      </ul>
      <p v-else class="empty" data-testid="couple-scratch-empty">这周还没有 TA 送来的券</p>

      <ul v-if="scratches.filter((s) => s.fromUser === auth.username && !s.redeemed).length" class="list">
        <li v-for="s in scratches.filter((x) => x.fromUser === auth.username && !x.redeemed)" :key="`g-${s.id}`"
            class="card gave" :data-testid="`couple-scratch-gave-${s.id}`">
          <b class="prize">{{ s.prizeText || '（TA 还没刮）' }}</b>
          <span class="from">我送给 TA 的</span>
          <el-button v-if="s.scratched" link type="success" size="small"
                     :data-testid="`couple-scratch-redeem-${s.id}`" @click="onRedeem(s.id)">已兑现</el-button>
        </li>
      </ul>
    </section>

    <section>
      <h5 class="line-title">盲盒</h5>
      <ul v-if="boxes.length" class="list">
        <li v-for="b in boxes" :key="b.id" class="card" :data-testid="`couple-box-${b.id}`">
          <span v-if="b.content" class="prize" data-testid="couple-box-content">{{ b.content }}</span>
          <span v-else class="hidden">🔒 {{ b.opened ? '' : `${b.openDay} 才能拆` }}</span>
          <span class="from">{{ b.fromUser === auth.username ? '我装的' : 'TA 装的' }} · {{ b.kind === 'whisper' ? '一句悄悄' : '一个小任务' }}</span>
          <el-button v-if="b.canOpen && !b.opened" type="primary" size="small"
                     :data-testid="`couple-box-open-${b.id}`" @click="onOpen(b.id)">拆 🎁</el-button>
          <span v-else-if="b.opened" class="done">已拆</span>
        </li>
      </ul>
      <p v-else class="empty" data-testid="couple-box-none">还没有盒子</p>

      <div class="form">
        <el-radio-group v-model="boxKind" data-testid="couple-box-kind">
          <el-radio value="whisper">悄悄话</el-radio>
          <el-radio value="task">小任务</el-radio>
        </el-radio-group>
        <el-input v-model="boxContent" maxlength="200" placeholder="装进盒子里的话…" data-testid="couple-box-content-input" />
        <el-input v-model="boxDay" maxlength="10" placeholder="哪天开 yyyy-MM-dd" data-testid="couple-box-day" />
        <el-button type="primary" data-testid="couple-box-seal" @click="onCreateBox">封存 📦</el-button>
      </div>
    </section>
  </CoupleCollapsible>
</template>

<style scoped>
.sub { font-weight: normal; font-size: 12px; color: var(--im-muted, #909399); }
.line-title { margin: 8px 0 6px; font-size: 13px; color: #f56c6c; font-weight: 600; }
.list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.card { display: flex; gap: 8px; align-items: baseline; font-size: 13px; border-bottom: 1px dashed var(--im-border, #eee); padding: 4px 0; flex-wrap: wrap; }
.card.gave { opacity: 0.85; }
.prize { color: #f56c6c; }
.hidden { color: var(--im-muted, #909399); }
.from { font-size: 12px; color: var(--im-muted, #909399); }
.done { font-size: 12px; color: #67c23a; }
.empty { font-size: 13px; color: var(--im-muted, #909399); }
.form { margin-top: 10px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
</style>

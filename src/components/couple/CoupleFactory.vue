<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { factoryApi } from '@/api/couple'
import type { CoupleFyBoardVO } from '@/types'
import CoupleCollapsible from './CoupleCollapsible.vue'

/** 家务轮盘（保留卡 `couple-fy-spin`）：一转定分工，对方认账后干完的人才打得了勾。 */
const v = ref<CoupleFyBoardVO | null>(null)
const items = ref('')
const spinning = ref(false)

const hasSpin = computed(() => (v.value?.spins.length ?? 0) > 0)

async function refresh() {
  try {
    v.value = await factoryApi.fyBoard()
  } catch {
    v.value = null
  }
}

async function onSpin() {
  const raw = items.value.trim()
  if (!raw) {
    ElMessage.warning('把本周要干的活儿写几句，用逗号或顿号分开')
    return
  }
  spinning.value = true
  try {
    v.value = await factoryApi.fySpin(raw)
    ElMessage.success(v.value?.spinLine || '🎡 一转定分工，谁也别喊「凭什么是我」')
    items.value = ''
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '转不动了')
  } finally {
    spinning.value = false
  }
}

async function onConfirm(id: string) {
  try {
    v.value = await factoryApi.fySpinConfirm(id)
    ElMessage.success('✅ 认账了，等 TA 干完打勾')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '认账失败')
  }
}

async function onDone(id: string) {
  try {
    v.value = await factoryApi.fySpinDone(id)
    ElMessage.success('🧹 干完了，这格清空')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '打勾失败')
  }
}

onMounted(refresh)
</script>

<template>
  <CoupleCollapsible testid="couple-fy-spin" :empty="!v && !hasSpin">
    <template #title>
      🎡 家务轮盘 <span class="sub">一转定分工，干完打勾</span>
    </template>

    <p v-if="v?.spinLine" class="spin-line" data-testid="couple-fy-spin-line">{{ v.spinLine }}</p>

    <div v-if="v?.owed?.length" class="owed" data-testid="couple-fy-spin-owed">
      <span class="owed-title">前几周欠着的</span>
      <span v-for="(o, i) in v.owed" :key="i" class="owed-item" :data-testid="`couple-fy-spin-owed-${i}`">{{ o }}</span>
    </div>

    <ul v-if="hasSpin" class="spins">
      <li v-for="s in v?.spins" :key="s.id" class="spin" :class="{ 'is-done': s.done }"
          :data-testid="`couple-fy-spin-${s.id}`">
        <span class="item" :data-testid="`couple-fy-spin-item-${s.id}`">{{ s.item }}</span>
        <span class="who" :data-testid="`couple-fy-spin-who-${s.id}`">{{ s.mine ? '我来' : 'TA 来' }}</span>
        <span class="status" :data-testid="`couple-fy-spin-status-${s.id}`">
          {{ s.done ? '干完了' : s.confirmed ? '已认账' : '等认账' }}
        </span>
        <el-button v-if="!s.mine && !s.confirmed" link type="primary" size="small"
                   :data-testid="`couple-fy-spin-confirm-${s.id}`" @click="onConfirm(s.id)">认账</el-button>
        <el-button v-if="s.mine && s.confirmed && !s.done" link type="success" size="small"
                   :data-testid="`couple-fy-spin-done-${s.id}`" @click="onDone(s.id)">干完了</el-button>
      </li>
    </ul>
    <p v-else class="empty" data-testid="couple-fy-spin-closed">这周还没转</p>

    <div class="form">
      <el-input v-model="items" maxlength="200" placeholder="倒垃圾、擦桌子、洗碗…" data-testid="couple-fy-spin-items"
                @keyup.enter="onSpin" />
      <el-button type="primary" :loading="spinning" data-testid="couple-fy-spin-submit" @click="onSpin">
        转 🎡
      </el-button>
    </div>
    <p v-if="v?.day" class="week" data-testid="couple-fy-spin-day">本周（{{ v.week }}）· 服务端今天 {{ v.day }}</p>
  </CoupleCollapsible>
</template>

<style scoped>
.sub { font-weight: normal; font-size: 12px; color: var(--im-muted, #909399); }
.spin-line { margin: 0 0 8px; font-size: 13px; color: #d2691e; }
.owed { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin-bottom: 8px; font-size: 12px; }
.owed-title { color: var(--im-muted, #909399); }
.owed-item { background: rgba(210, 105, 30, 0.12); border-radius: 10px; padding: 2px 8px; }
.spins { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.spin { display: flex; align-items: center; gap: 10px; border-bottom: 1px dashed var(--im-border, #eee); padding: 6px 0; }
.spin.is-done .item { text-decoration: line-through; color: var(--im-muted, #909399); }
.spin .item { flex: 1; }
.spin .who { font-size: 12px; }
.spin .status { font-size: 12px; color: var(--im-muted, #909399); }
.empty { font-size: 13px; color: var(--im-muted, #909399); }
.form { margin-top: 10px; display: flex; gap: 8px; }
.week { margin-top: 8px; font-size: 12px; color: var(--im-muted, #909399); }
</style>

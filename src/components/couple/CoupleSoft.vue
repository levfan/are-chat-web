<template>
  <div class="soft" data-testid="couple-soft">
    <!-- F100 恋爱翻译器 -->
    <div class="card" data-testid="couple-translator">
      <h4 class="title">🪄 恋爱翻译器 <span class="sub">把 TA 的「言外之意」翻译出来</span></h4>
      <div class="translate-row">
        <el-input
          v-model="translateText"
          maxlength="30"
          placeholder="输入 TA 常说的话，比如：我没事 / 随便 / 哦"
          data-testid="couple-translator-input"
          @keyup.enter="onTranslate"
        />
        <el-button type="primary" data-testid="couple-translator-go" @click="onTranslate">翻译 🪄</el-button>
      </div>
      <div v-if="result" class="translate-result" data-testid="couple-translator-result">
        <p class="phrase">「{{ result.phrase }}」的真实含义：</p>
        <p class="subtext">{{ result.subtext }}</p>
        <p class="reply">💡 建议回应：{{ result.reply }}</p>
        <el-button size="small" type="primary" plain data-testid="couple-translator-copy" @click="onCopyReply">
          复制回应
        </el-button>
      </div>
    </div>

    <!-- F101 冷静角 -->
    <div class="card" data-testid="couple-cooldown">
      <h4 class="title">🧊 冷静角 <span class="sub">吵架先冷静 30 分钟，再各留一句软话</span></h4>
      <template v-if="activeCool">
        <div v-if="coolRemain > 0" class="cool-timing" data-testid="couple-cooldown-timing">
          <span class="cool-ico">🧊</span>
          <span>冷静中，还有 {{ Math.ceil(coolRemain / 60000) }} 分钟——先深呼吸，我们到点好好说</span>
        </div>
        <template v-else>
          <p class="cool-tip">冷静期结束啦！给 TA 留一句软话，就会自动和好 🕊️</p>
          <div v-if="!mySofted" class="soften-box">
            <el-input
              v-model="softDraft"
              maxlength="100"
              show-word-limit
              placeholder="一句软话，比如：抱抱，刚才是我语气不好"
              data-testid="couple-cooldown-soft-input"
            />
            <el-button type="success" data-testid="couple-cooldown-soft" @click="onSoften">留下软话 🕊️</el-button>
          </div>
          <p v-else class="cool-tip">我的软话已留好，等 TA 一句 💌</p>
          <p v-if="partnerSoft" class="soft-line">TA 说：「{{ partnerSoft }}」</p>
        </template>
      </template>
      <template v-else>
        <div class="cool-create">
          <el-input
            v-model="coolReason"
            maxlength="100"
            placeholder="想冷静一下的原因（可不填）"
            data-testid="couple-cooldown-reason"
          />
          <el-button type="warning" plain data-testid="couple-cooldown-start" @click="onStartCool">进冷静角 🧊</el-button>
        </div>
      </template>
      <div v-if="coolHistory.length" class="cool-history">
        <div v-for="c in coolHistory.slice(0, 3)" :key="c.id" class="cool-item">
          <span class="cool-day">{{ formatDay(c.created) }}</span>
          <span class="cool-softs">
            {{ c.softA || '…' }} × {{ c.softB || '…' }}
          </span>
          <el-tag type="success" size="small">和好 ✓</el-tag>
        </div>
      </div>
    </div>

    <!-- F107 道歉三部曲 -->
    <div class="card" data-testid="couple-apology">
      <h4 class="title">🙇 道歉三部曲 <span class="sub">好好道歉，是有勇气的浪漫</span></h4>
      <div class="apology-form">
        <el-input
          v-model="apologyWhat"
          maxlength="100"
          placeholder="① 我错了：错在什么事"
          data-testid="couple-apology-what"
        />
        <el-input
          v-model="apologyWhy"
          maxlength="100"
          placeholder="② 错在哪：让 TA 难受的点"
          data-testid="couple-apology-why"
        />
        <el-input
          v-model="apologyWill"
          maxlength="100"
          placeholder="③ 以后我会：具体的改变"
          data-testid="couple-apology-will"
        />
        <el-button type="primary" data-testid="couple-apology-send" @click="onSendApology">送出道歉 🙇</el-button>
      </div>
      <div v-if="couple.apologies.length" class="apology-list">
        <div v-for="a in couple.apologies.slice(0, 5)" :key="a.id" class="apology-item" :class="{ mine: a.fromUser === auth.username }">
          <div class="apology-head">
            <span class="apology-from">{{ a.fromUser === auth.username ? '我' : 'TA' }} 的道歉</span>
            <el-tag :type="a.status === 'ACCEPTED' ? 'success' : 'warning'" size="small">
              {{ a.status === 'ACCEPTED' ? '已收下 🫶' : '待收下' }}
            </el-tag>
            <el-button
              v-if="a.status === 'SENT' && a.fromUser !== auth.username"
              link
              type="primary"
              size="small"
              :data-testid="`couple-apology-accept-${a.id}`"
              @click="onAcceptApology(a.id)"
            >
              收下
            </el-button>
          </div>
          <p class="apology-line">我错了：{{ a.whatWrong }}</p>
          <p class="apology-line">错在哪：{{ a.whyWrong }}</p>
          <p class="apology-line">以后我会：{{ a.willDo }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useCoupleStore } from '@/stores/couple'
import { useAuthStore } from '@/stores/auth'
import type { CoupleCoolDownVO, CoupleTranslationVO } from '@/types'

const couple = useCoupleStore()
const auth = useAuthStore()

const translateText = ref('')
const result = ref<CoupleTranslationVO | null>(null)
const coolReason = ref('')
const softDraft = ref('')
const apologyWhat = ref('')
const apologyWhy = ref('')
const apologyWill = ref('')

const coolDowns = computed(() => couple.coolDowns)
const activeCool = computed(() => coolDowns.value.find((c) => c.status === 'ACTIVE') ?? null)
const coolRemain = ref(0)
let timer: number | undefined

const coolHistory = computed(() => couple.coolDowns.filter((c) => c.status === 'HEALED'))
const mySofted = computed(() => {
  const c = activeCool.value
  if (!c) return false
  return c.fromUser === auth.username ? !!c.softA || !!c.softB : !!c.softA && !!c.softB
})
const partnerSoft = computed(() => {
  const c = activeCool.value
  if (!c) return ''
  return c.fromUser === auth.username ? c.softB ?? '' : c.softA ?? ''
})

async function onTranslate() {
  if (!translateText.value.trim()) return
  try {
    result.value = await couple.translateText(translateText.value)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '翻译失败')
  }
}

async function onCopyReply() {
  if (!result.value) return
  try {
    await navigator.clipboard.writeText(result.value.reply)
    ElMessage.success('已复制，去私聊发给 TA 吧 💬')
  } catch {
    ElMessage.info('复制失败，手动长按复制一下～')
  }
}

async function onStartCool() {
  try {
    await couple.startCoolDown(coolReason.value || undefined)
    coolReason.value = ''
    ElMessage.info('已进冷静角，30 分钟后见 🧊')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '发起失败')
  }
}

async function onSoften() {
  const c = activeCool.value
  if (!c || !softDraft.value.trim()) return
  try {
    await couple.softenCool(c.id, softDraft.value)
    softDraft.value = ''
    ElMessage.success('软话已送到 🕊️')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '发送失败')
  }
}

async function onSendApology() {
  if (!apologyWhat.value.trim() || !apologyWhy.value.trim() || !apologyWill.value.trim()) {
    ElMessage.warning('三步都要认真写完哦')
    return
  }
  try {
    await couple.sendApology(apologyWhat.value, apologyWhy.value, apologyWill.value)
    apologyWhat.value = ''
    apologyWhy.value = ''
    apologyWill.value = ''
    ElMessage.success('道歉卡已送出 🙇')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '送出失败')
  }
}

async function onAcceptApology(id: string) {
  try {
    await couple.acceptApology(id)
    ElMessage.success('已收下，我们和好啦 🫶')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '操作失败')
  }
}

function formatDay(ts: number) {
  return new Date(ts).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
}

function tick() {
  const c = activeCool.value
  coolRemain.value = c ? Math.max(0, c.endAt - Date.now()) : 0
}

onMounted(() => {
  void couple.loadComm()
  tick()
  timer = window.setInterval(tick, 30_000)
})

onUnmounted(() => {
  if (timer) window.clearInterval(timer)
})
</script>

<style scoped>
.soft {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.card {
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 12px;
  padding: 14px;
}
.title {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 700;
}
.sub {
  margin-left: 6px;
  font-size: 12px;
  font-weight: 400;
  color: var(--im-muted, #8f959e);
}
.translate-row {
  display: flex;
  gap: 8px;
}
.translate-result {
  margin-top: 10px;
  padding: 10px;
  border-radius: 8px;
  background: var(--im-hover, #f5f7fa);
}
.translate-result .phrase {
  margin: 0 0 4px;
  font-size: 13px;
  font-weight: 700;
}
.translate-result .subtext {
  margin: 0 0 4px;
  font-size: 13px;
  color: var(--el-text-color-regular, #606266);
}
.translate-result .reply {
  margin: 0 0 8px;
  font-size: 13px;
  color: var(--el-color-primary, #409eff);
}
.cool-timing {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border-radius: 8px;
  background: var(--im-hover, #f5f7fa);
  font-size: 13px;
}
.cool-ico {
  font-size: 20px;
}
.cool-tip {
  margin: 0 0 8px;
  font-size: 13px;
  color: var(--el-text-color-regular, #606266);
}
.soften-box,
.cool-create {
  display: flex;
  gap: 8px;
}
.soft-line {
  margin: 8px 0 0;
  font-size: 13px;
  color: var(--el-color-success, #67c23a);
  font-weight: 700;
}
.cool-history {
  margin-top: 10px;
  border-top: 1px dashed var(--el-border-color-lighter, #ebeef5);
  padding-top: 8px;
}
.cool-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  margin-bottom: 6px;
}
.cool-day {
  color: var(--im-muted, #8f959e);
  flex-shrink: 0;
}
.cool-softs {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.apology-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
}
.apology-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.apology-item {
  padding: 10px;
  border-radius: 8px;
  background: var(--im-hover, #f5f7fa);
}
.apology-item.mine {
  background: var(--el-color-danger-light-9, #fef0f0);
}
.apology-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: 700;
}
.apology-line {
  margin: 2px 0;
  font-size: 13px;
}
</style>

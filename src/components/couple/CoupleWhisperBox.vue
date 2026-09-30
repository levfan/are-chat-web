<template>
  <div class="whisper-box" data-testid="couple-whisper-box">
    <!-- F67 匿名树洞 -->
    <div class="whisper-card" data-testid="couple-whisper">
      <h4 class="section-title">🕳️ 匿名树洞 <span class="sub">不敢开口的问题，投进这里</span></h4>
      <div class="ask-form">
        <el-input
          v-model="whisperQuestion"
          type="textarea"
          :rows="2"
          maxlength="200"
          show-word-limit
          placeholder="你想问又不敢问的问题…（TA 回答后自动揭晓是谁问的）"
          data-testid="couple-whisper-question"
        />
        <div class="ask-row">
          <el-switch v-model="anonymous" active-text="匿名投递" data-testid="couple-whisper-anon" />
          <el-button type="primary" :loading="asking" data-testid="couple-whisper-ask" @click="onAskWhisper">
            投进树洞 🕳️
          </el-button>
        </div>
      </div>
      <el-empty v-if="!couple.whispers.length" description="树洞还是空的——有什么想问 TA 又不好意思问的吗？" :image-size="56" />
      <div v-else class="whisper-list">
        <div
          v-for="w in couple.whispers"
          :key="w.id"
          class="whisper-item"
          :class="{ mine: w.mine }"
          :data-testid="`couple-whisper-${w.id}`"
        >
          <div class="whisper-head">
            <span class="asker" data-testid="couple-whisper-asker">
              {{ w.mine ? '我问的' : `来自「${w.askerLabel}」` }}
              <template v-if="w.anonymous && w.answer && !w.mine">（已揭晓）</template>
            </span>
            <span class="whisper-time">{{ shortTime(w.created) }}</span>
          </div>
          <p class="whisper-q" data-testid="couple-whisper-text">{{ w.question }}</p>
          <p v-if="w.answer" class="whisper-a" data-testid="couple-whisper-answer">TA 说：{{ w.answer }}</p>
          <div v-else-if="!w.mine" class="answer-row">
            <el-input
              v-model="answerDrafts[w.id]"
              maxlength="300"
              show-word-limit
              placeholder="认真回答，TA 会在收到时看到你是谁 👀"
              :data-testid="`couple-whisper-answer-input-${w.id}`"
              @keyup.enter="onAnswer(w.id)"
            />
            <el-button type="primary" size="small" data-testid="couple-whisper-answer-btn" @click="onAnswer(w.id)">
              回答
            </el-button>
          </div>
          <p v-else class="whisper-waiting">等待 TA 回答中… 回答后 TA 的身份会揭晓</p>
        </div>
      </div>
    </div>

    <!-- F69 情话储蓄罐 -->
    <div class="bank-card" data-testid="couple-love-bank">
      <h4 class="section-title">🏦 情话储蓄罐 <span class="sub">今天存下的情话，某个晚上变成利息</span></h4>
      <div class="bank-stats">
        <span>罐里还有 <b data-testid="couple-love-jar">{{ couple.loveBank?.inJar ?? 0 }}</b> 句</span>
        <span>已作为利息送达 <b>{{ couple.loveBank?.deliveredCount ?? 0 }}</b> 句</span>
      </div>
      <div class="deposit-row">
        <el-input
          v-model="loveDraft"
          maxlength="200"
          show-word-limit
          placeholder="存一句情话：比如 今天你笑起来的样子，我又多喜欢了你一点"
          data-testid="couple-love-input"
          @keyup.enter="onDeposit"
        />
        <el-button type="danger" :loading="depositing" data-testid="couple-love-deposit" @click="onDeposit">
          存进罐子 🏦
        </el-button>
      </div>
      <p class="bank-tip">TA 只会收到「你存了一句情话」的通知——具体内容，等某个晚上 21 点的利息揭晓 💸</p>
      <div v-if="couple.loveBank?.mine.length" class="bank-list">
        <div
          v-for="b in couple.loveBank.mine.slice(0, 8)"
          :key="b.id"
          class="bank-item"
          :class="{ delivered: b.delivered }"
          :data-testid="`couple-love-${b.id}`"
        >
          <p class="bank-content">{{ b.content }}</p>
          <el-tag :type="b.delivered ? 'success' : 'info'" size="small">
            {{ b.delivered ? '已送达 💸' : '在罐里发酵中…' }}
          </el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useCoupleStore } from '@/stores/couple'

const couple = useCoupleStore()

const whisperQuestion = ref('')
const anonymous = ref(true)
const asking = ref(false)
const answerDrafts = reactive<Record<string, string>>({})
const loveDraft = ref('')
const depositing = ref(false)

function shortTime(ts: number) {
  const d = new Date(ts)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

async function onAskWhisper() {
  const q = whisperQuestion.value.trim()
  if (!q) {
    ElMessage.warning('问题写好再投哦')
    return
  }
  asking.value = true
  try {
    await couple.askWhisper(q, anonymous.value)
    whisperQuestion.value = ''
    ElMessage.success('已投进树洞 🕳️')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '投递失败')
  } finally {
    asking.value = false
  }
}

async function onAnswer(id: string) {
  const a = (answerDrafts[id] ?? '').trim()
  if (!a) {
    ElMessage.warning('先写回答')
    return
  }
  try {
    await couple.answerWhisper(id, a)
    delete answerDrafts[id]
    ElMessage.success('已回答，提问人揭晓 👀')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '回答失败')
  }
}

async function onDeposit() {
  const text = loveDraft.value.trim()
  if (!text) {
    ElMessage.warning('情话写好再存')
    return
  }
  depositing.value = true
  try {
    await couple.depositLove(text)
    loveDraft.value = ''
    ElMessage.success('已存进罐子 🏦 静候利息日')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '存入失败')
  } finally {
    depositing.value = false
  }
}

onMounted(() => {
  void couple.loadWhisperBox()
})
</script>

<style scoped>
.whisper-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.section-title {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 700;
}
.sub {
  margin-left: 6px;
  font-size: 12px;
  font-weight: 400;
  color: var(--im-muted, #8f959e);
}
.whisper-card,
.bank-card {
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 12px;
  padding: 14px;
}
.ask-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}
.ask-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.whisper-list,
.bank-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
}
.whisper-item,
.bank-item {
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  padding: 10px 12px;
}
.whisper-item.mine {
  background: var(--el-fill-color-lighter, #fafafa);
}
.whisper-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.asker {
  font-size: 11px;
  font-weight: 700;
  color: var(--el-color-primary, #409eff);
}
.whisper-time {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.whisper-q {
  margin: 4px 0;
  font-size: 13px;
  font-weight: 600;
  word-break: break-all;
}
.whisper-a {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--el-color-success, #67c23a);
  word-break: break-all;
}
.whisper-waiting {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.answer-row {
  display: flex;
  gap: 8px;
  margin-top: 6px;
}
.bank-stats {
  display: flex;
  gap: 18px;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
  margin-bottom: 10px;
}
.bank-stats b {
  color: var(--el-color-danger, #f56c6c);
}
.deposit-row {
  display: flex;
  gap: 8px;
}
.bank-tip {
  margin: 8px 0;
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.bank-item {
  display: flex;
  align-items: center;
  gap: 10px;
}
.bank-item.delivered {
  opacity: 0.75;
}
.bank-content {
  flex: 1;
  margin: 0;
  font-size: 13px;
  word-break: break-all;
}
</style>

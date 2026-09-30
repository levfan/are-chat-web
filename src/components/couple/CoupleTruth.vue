<template>
  <div class="deep" data-testid="couple-deep">
    <!-- F66 真心话抽签 -->
    <div class="truth-card" data-testid="couple-truth">
      <h4 class="section-title">💬 今日真心话 <span class="sub">同一天同一题，双方都要答</span></h4>
      <p class="truth-question" data-testid="couple-truth-question">{{ couple.truthToday?.question ?? '加载中…' }}</p>
      <div class="truth-answers">
        <div class="truth-side">
          <span class="side-label">我的回答</span>
          <p v-if="myAnswer" class="answer-text" data-testid="couple-truth-mine">{{ myAnswer }}</p>
          <el-input
            v-else
            v-model="truthDraft"
            type="textarea"
            :rows="2"
            maxlength="200"
            show-word-limit
            placeholder="真心话时间：写下你真实的答案"
            data-testid="couple-truth-input"
          />
        </div>
        <div class="truth-side">
          <span class="side-label">TA 的回答</span>
          <p v-if="partnerAnswer" class="answer-text" data-testid="couple-truth-partner">{{ partnerAnswer }}</p>
          <p v-else class="answer-empty">TA 还没作答，交卷后会收到提醒 👀</p>
        </div>
      </div>
      <el-button
        v-if="!myAnswer"
        type="primary"
        :loading="answering"
        data-testid="couple-truth-submit"
        @click="onAnswerTruth"
      >
        交卷 💬
      </el-button>
      <el-button v-else link size="small" data-testid="couple-truth-edit" @click="editTruth">改答案</el-button>

      <div v-if="couple.truthHistory.length" class="truth-history">
        <h5 class="hist-title">往期真心话</h5>
        <div v-for="h in couple.truthHistory.slice(0, 5)" :key="h.day" class="hist-item" :data-testid="`couple-truth-hist-${h.day}`">
          <span class="hist-day">{{ h.day }} · {{ h.question }}</span>
          <p class="hist-pair">我：「{{ h.myAnswer }}」 / TA：「{{ h.partnerAnswer }}」</p>
        </div>
      </div>
    </div>

    <!-- F68 心灵感应 -->
    <div class="telepathy-card" data-testid="couple-telepathy">
      <h4 class="section-title">🧠 心灵感应 <span class="sub">不商量，各选各的，测同频</span></h4>
      <div class="telepathy-stats">
        <span>已测 <b>{{ couple.telepathy?.totalSettled ?? 0 }}</b> 轮</span>
        <span>感应成功 <b class="matched-num" data-testid="couple-telepathy-matched">{{ couple.telepathy?.matchedCount ?? 0 }}</b> 次</span>
        <span>今天还能玩 <b>{{ couple.telepathy?.roundsLeftToday ?? 3 }}</b> 轮</span>
      </div>

      <template v-if="couple.telepathy?.current">
        <div class="round-box" data-testid="couple-telepathy-current">
          <p class="round-question">{{ couple.telepathy.current.question }}</p>
          <div class="option-row">
            <button
              v-for="opt in couple.telepathy.current.options"
              :key="opt"
              type="button"
              class="option-btn"
              :data-testid="`couple-telepathy-opt`"
              @click="onAnswerTelepathy(opt)"
            >
              {{ opt }}
            </button>
          </div>
          <p class="round-hint">
            {{ myTelepathyAnswer ? `你已选「${myTelepathyAnswer}」，等 TA 交卷…` : '从选项里选一个，不许和 TA 商量！' }}
          </p>
        </div>
      </template>
      <template v-else>
        <el-button
          type="primary"
          round
          :disabled="(couple.telepathy?.roundsLeftToday ?? 3) <= 0"
          :loading="starting"
          data-testid="couple-telepathy-start"
          @click="onStartTelepathy"
        >
          {{ (couple.telepathy?.roundsLeftToday ?? 3) <= 0 ? '今天轮次用完啦' : '发起一轮心灵感应 🧠' }}
        </el-button>
      </template>

      <div v-if="couple.telepathy?.history.length" class="telepathy-history">
        <div
          v-for="r in couple.telepathy.history.slice(0, 6)"
          :key="r.id"
          class="hist-round"
          :class="{ matched: r.matched }"
          :data-testid="`couple-telepathy-hist-${r.id}`"
        >
          <span class="hist-q">{{ r.question }}</span>
          <span class="hist-a">{{ r.answerA }} × {{ r.answerB }}</span>
          <el-tag :type="r.matched ? 'success' : 'info'" size="small">{{ r.matched ? '感应成功 ✨' : '没对上' }}</el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useCoupleStore } from '@/stores/couple'

const auth = useAuthStore()
const couple = useCoupleStore()

const truthDraft = ref('')
const answering = ref(false)
const starting = ref(false)

const myAnswer = computed(() => couple.truthToday?.myAnswer ?? null)
const partnerAnswer = computed(() => couple.truthToday?.partnerAnswer ?? null)

const myTelepathyAnswer = computed(() => {
  const cur = couple.telepathy?.current
  if (!cur) return null
  return cur.answerA !== null && cur.answerB === null ? cur.answerA : cur.answerB !== null ? cur.answerB : null
})

async function onAnswerTruth() {
  const text = truthDraft.value.trim()
  if (!text) {
    ElMessage.warning('真心话要写真话哦')
    return
  }
  answering.value = true
  try {
    await couple.answerTruth(text)
    truthDraft.value = ''
    ElMessage.success('已交卷 💬 TA 会收到提醒')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '提交失败')
  } finally {
    answering.value = false
  }
}

function editTruth() {
  truthDraft.value = myAnswer.value ?? ''
  if (couple.truthToday) {
    couple.truthToday.myAnswer = null
  }
}

async function onStartTelepathy() {
  starting.value = true
  try {
    await couple.startTelepathy()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '发起失败')
  } finally {
    starting.value = false
  }
}

async function onAnswerTelepathy(opt: string) {
  try {
    const board = await couple.answerTelepathy(opt)
    if (!board.current) {
      ElMessage.success('本轮已揭晓，看看你们是否同频 🧠')
    }
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '作答失败')
  }
}

onMounted(() => {
  void couple.loadDeep()
})
</script>

<style scoped>
.deep {
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
.truth-card,
.telepathy-card {
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 12px;
  padding: 14px;
}
.truth-question {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 700;
  color: var(--el-color-danger, #f56c6c);
}
.truth-answers {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 10px;
}
@media (max-width: 720px) {
  .truth-answers {
    grid-template-columns: 1fr;
  }
}
.side-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--im-muted, #8f959e);
}
.answer-text {
  margin: 4px 0 0;
  font-size: 13px;
  white-space: pre-wrap;
  word-break: break-all;
}
.answer-empty {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.truth-history {
  margin-top: 12px;
  border-top: 1px dashed var(--el-border-color-lighter, #ebeef5);
  padding-top: 10px;
}
.hist-title {
  margin: 0 0 8px;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.hist-item {
  margin-bottom: 8px;
}
.hist-day {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.hist-pair {
  margin: 2px 0 0;
  font-size: 12px;
  word-break: break-all;
}
.telepathy-stats {
  display: flex;
  gap: 18px;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
  margin-bottom: 10px;
}
.telepathy-stats b {
  color: var(--el-color-danger, #f56c6c);
}
.round-box {
  border: 1px dashed var(--el-color-danger, #f56c6c);
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 10px;
}
.round-question {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 700;
}
.option-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.option-btn {
  border: 1px solid var(--el-color-danger, #f56c6c);
  color: var(--el-color-danger, #f56c6c);
  background: transparent;
  border-radius: 999px;
  padding: 6px 16px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
}
.option-btn:hover {
  background: var(--el-color-danger-light-9, #fef0f0);
}
.round-hint {
  margin: 10px 0 0;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.telepathy-history {
  margin-top: 12px;
  border-top: 1px dashed var(--el-border-color-lighter, #ebeef5);
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.hist-round {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
}
.hist-round.matched {
  color: var(--el-color-success, #67c23a);
}
.hist-q {
  flex: 1;
  min-width: 0;
  word-break: break-all;
}
.hist-a {
  color: var(--im-muted, #8f959e);
  flex-shrink: 0;
}
</style>

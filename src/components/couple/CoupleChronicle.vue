<template>
  <div class="chronicle" data-testid="couple-chronicle">
    <!-- F81 考古卡 -->
    <div class="card dig" data-testid="couple-archaeology">
      <h4 class="title">⛏️ 记忆考古 <span class="sub">在普通的一天里，挖出普通又珍贵的一天</span></h4>
      <template v-if="card">
        <div class="dig-card" data-testid="couple-archaeology-card">
          <div class="dig-meta">{{ card.day }} · {{ card.daysAgo }} 天前</div>
          <div class="dig-title">{{ card.title }}</div>
          <p class="dig-content">{{ card.content }}</p>
        </div>
      </template>
      <p v-else class="dig-hint">点一下铲子，看看时间的土层里埋着什么</p>
      <el-button type="warning" plain :loading="digging" data-testid="couple-archaeology-dig" @click="onDig">
        再挖一张 ⛏️
      </el-button>
    </div>

    <!-- F82 恋爱问答机 -->
    <div class="card quiz" data-testid="couple-quiz">
      <h4 class="title">🎰 恋爱问答机 <span class="sub">出题人是我们自己的日子</span></h4>
      <div v-if="!quizStarted">
        <el-button type="primary" data-testid="couple-quiz-start" @click="onStartQuiz">开始答题 🎰</el-button>
      </div>
      <div v-else class="quiz-list">
        <div v-for="(q, qi) in couple.quizQuestions" :key="q.key" class="quiz-item" :data-testid="`couple-quiz-${qi}`">
          <div class="quiz-question">{{ qi + 1 }}. {{ q.question }}</div>
          <div class="quiz-options">
            <el-button
              v-for="(opt, oi) in q.options"
              :key="oi"
              size="small"
              :type="quizPicks[qi] === undefined ? 'default' : pickType(qi, oi)"
              :data-testid="`couple-quiz-${qi}-opt-${oi}`"
              @click="onPick(qi, oi)"
            >
              {{ opt }}
            </el-button>
          </div>
        </div>
        <div v-if="quizDone" class="quiz-score" data-testid="couple-quiz-score">
          {{ quizScore === couple.quizQuestions.length ? '满分！你对我们的日子如数家珍 🏆' : `答对 ${quizScore}/${couple.quizQuestions.length} —— 有些日子要一起再过一遍啦 💞` }}
        </div>
        <el-button size="small" data-testid="couple-quiz-again" @click="onStartQuiz">换一批题</el-button>
      </div>
    </div>

    <!-- F80 恋爱编年史 -->
    <div class="card history" data-testid="couple-history">
      <h4 class="title">📜 恋爱编年史 <span class="sub">每一年都有自己的名字</span></h4>
      <el-empty v-if="!couple.chronicleYears.length" description="史册还是空白的——第一个「第一次」值得记录" :image-size="56" />
      <div v-for="year in couple.chronicleYears" :key="year.year" class="year-block">
        <div class="year-label" :data-testid="`couple-history-year-${year.year}`">{{ year.year }}</div>
        <div v-for="(e, i) in year.events" :key="year.year + i" class="event-row" :data-testid="`couple-history-event-${i}`">
          <span class="event-day">{{ e.day.substring(5) }}</span>
          <span class="event-icon">{{ e.icon }}</span>
          <span class="event-main">
            <span class="event-title">{{ e.title }}</span>
            <span v-if="e.detail" class="event-detail">{{ e.detail }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useCoupleStore } from '@/stores/couple'

const couple = useCoupleStore()

const card = computed(() => couple.archaeologyCard)
const digging = ref(false)
const quizStarted = ref(false)
const quizPicks = ref<Record<number, number>>({})

const quizDone = computed(
  () => couple.quizQuestions.length > 0 && Object.keys(quizPicks.value).length >= couple.quizQuestions.length,
)
const quizScore = computed(
  () =>
    couple.quizQuestions.filter((q, i) => quizPicks.value[i] === q.answerIndex).length,
)

async function onDig() {
  digging.value = true
  try {
    await couple.digArchaeology()
  } catch (e) {
    ElMessage.info(e instanceof Error ? e.message : '土层里还没有埋东西')
  } finally {
    digging.value = false
  }
}

async function onStartQuiz() {
  try {
    await couple.loadQuiz()
    quizPicks.value = {}
    quizStarted.value = true
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '出题失败')
  }
}

function pickType(qi: number, oi: number) {
  const answer = couple.quizQuestions[qi]?.answerIndex
  if (oi === answer) return 'success'
  if (quizPicks.value[qi] === oi) return 'danger'
  return 'default'
}

function onPick(qi: number, oi: number) {
  if (quizPicks.value[qi] !== undefined) return
  quizPicks.value = { ...quizPicks.value, [qi]: oi }
}

onMounted(() => {
  void couple.loadChronicle()
})
</script>

<style scoped>
.chronicle {
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
.dig-card {
  border: 1px dashed var(--el-color-warning, #e6a23c);
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 10px;
}
.dig-meta {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
  margin-bottom: 4px;
}
.dig-title {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 4px;
}
.dig-content {
  margin: 0;
  font-size: 13px;
  word-break: break-all;
}
.dig-hint {
  margin: 0 0 10px;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.quiz-item {
  margin-bottom: 12px;
}
.quiz-question {
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 6px;
}
.quiz-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.quiz-score {
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--el-color-danger, #f56c6c);
}
.year-block {
  margin-bottom: 14px;
}
.year-label {
  font-size: 15px;
  font-weight: 700;
  color: var(--el-color-danger, #f56c6c);
  margin-bottom: 6px;
}
.event-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 4px 0 4px 8px;
  border-left: 2px solid var(--el-border-color-lighter, #ebeef5);
}
.event-day {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
  min-width: 42px;
}
.event-main {
  display: flex;
  flex-direction: column;
}
.event-title {
  font-size: 13px;
  font-weight: 600;
}
.event-detail {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
  word-break: break-all;
}
</style>

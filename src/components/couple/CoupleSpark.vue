<template>
  <div class="couple-spark" data-testid="couple-spark">
    <!-- F176 默契仪表盘（testid 避开 CoupleTodayBoard 的 couple-dashboard） -->
    <div class="card" data-testid="couple-spark-dash">
      <h4 class="title">🎧 默契仪表盘 <span class="sub">默契不是玄学，是可以练习的</span></h4>
      <template v-if="dash">
        <div class="dash-row">
          <span class="dash-score" data-testid="couple-dash-score">{{ dash.score }}</span>
          <div class="dash-main">
            <el-progress :percentage="dash.score" :stroke-width="12" color="#f56c6c" />
            <p class="dash-label" data-testid="couple-dash-label">{{ dash.label }}</p>
          </div>
        </div>
        <p class="dash-detail" data-testid="couple-dash-detail">
          最快同频 {{ dash.bestMs != null ? dash.bestMs + 'ms' : '——' }} · 双答 {{ dash.whatIfBothDays }} 天 · 心动邮戳 {{ dash.heartDays }} 个 · 暗语 {{ dash.signals }} 条
        </p>
      </template>
    </div>

    <!-- F175 同频共振 -->
    <div class="card" data-testid="couple-tap">
      <h4 class="title">🤞 同频共振 <span class="sub">和 TA 在 10 秒内先后按键，差值越小越默契</span></h4>
      <el-button size="small" type="primary" :data-testid="`couple-tap-press`" @click="onTap">按下 🤞</el-button>
      <span v-if="tapNow" class="tap-result" data-testid="couple-tap-result">
        <template v-if="tapNow.diffMs != null">
          {{ tapNow.hit ? `同频成功！只差 ${tapNow.diffMs}ms` : `这次差 ${tapNow.diffMs}ms` }}
        </template>
        <template v-else>已按下，等 TA 在 10 秒内跟上…</template>
        <span v-if="tapNow.bestMs != null" class="tap-best">今日最佳 {{ tapNow.bestMs }}ms（{{ tapNow.hits }}/{{ tapNow.attempts }}）</span>
      </span>
      <div v-if="rank.length" class="rank-list" data-testid="couple-sync-rank">
        <span v-for="(r, i) in rank" :key="r.day" class="rank-item">
          {{ ['🥇', '🥈', '🥉'][i] ?? `#${i + 1}` }} {{ r.day.slice(5) }} · {{ r.bestMs }}ms
        </span>
      </div>
    </div>

    <!-- F170/F171 爱语测评与对照 -->
    <div class="card" data-testid="couple-lovelang">
      <h4 class="title">💗 爱语说明书 <span class="sub">爱要用对方的语言说，才不算白说</span></h4>
      <template v-if="quiz.length && !loveLangDone">
        <p v-for="(q, qi) in quiz" :key="qi" class="quiz-q" :data-testid="`couple-quiz-${qi}`">
          {{ qi + 1 }}. {{ q.question }}
          <span class="quiz-opts">
            <el-button size="small" plain :type="quizAnswers[qi] === 'A' ? 'primary' : 'default'" :data-testid="`couple-quiz-${qi}-a`" @click="pickQuiz(qi, 'A')">{{ q.optionA.text }}</el-button>
            <el-button size="small" plain :type="quizAnswers[qi] === 'B' ? 'primary' : 'default'" :data-testid="`couple-quiz-${qi}-b`" @click="pickQuiz(qi, 'B')">{{ q.optionB.text }}</el-button>
          </span>
        </p>
        <el-button size="small" type="primary" :disabled="quizAnswers.filter(Boolean).length < quiz.length" data-testid="couple-quiz-submit" @click="onSubmitLoveLang">
          交卷，生成我的爱语说明书 💗
        </el-button>
      </template>
      <template v-else-if="pair">
        <p class="pair-line" data-testid="couple-pair-line">
          我的主爱语：<b>{{ pair.myLang }}</b>（{{ pair.myTip }}）<br />
          TA 的主爱语：<b>{{ pair.partnerLang }}</b>（{{ pair.partnerTip }}）
        </p>
      </template>
      <template v-else-if="loveLangDone">
        <p class="pair-line">你的说明书出炉了，等 TA 也答完就能出对照卡 💗</p>
      </template>
      <el-button v-else size="small" plain data-testid="couple-quiz-load" @click="onLoadQuiz">开始 12 题测评</el-button>
    </div>

    <!-- F173 「如果」问答 -->
    <div class="card" data-testid="couple-whatif">
      <h4 class="title">🌌 「如果」问答 <span class="sub">今日一题：{{ whatIfQ?.question ?? '……' }}</span></h4>
      <div class="inline-form">
        <el-input v-model="whatIfDraft" maxlength="200" placeholder="大胆想（双答才互见）" data-testid="couple-whatif-input" />
        <el-button size="small" type="primary" data-testid="couple-whatif-answer" @click="onAnswerWhatIf">交卷 🌌</el-button>
      </div>
      <p v-if="whatIfQ?.mine" class="pair-line" data-testid="couple-whatif-mine">我的答案：{{ whatIfQ.mine.answer }}</p>
      <template v-if="whatIfQ?.bothAnswered">
        <p class="pair-line" data-testid="couple-whatif-partner">TA 的答案：{{ whatIfQ.partner?.answer }}</p>
        <el-tag size="small" type="warning" data-testid="couple-whatif-star">⭐ 今日默契之星：{{ whatIfQ.firstStar === 'me' ? '我' : 'TA' }}（先答者）</el-tag>
      </template>
    </div>

    <!-- F172 心动闪光 -->
    <div class="card" data-testid="couple-flash">
      <h4 class="title">⚡ 心动闪光 <span class="sub">突然软下来的那一瞬间，别让它溜走</span></h4>
      <div class="inline-form">
        <el-input v-model="flashDraft" maxlength="200" placeholder="刚刚那一秒，是因为…" data-testid="couple-flash-input" />
        <el-button size="small" type="primary" data-testid="couple-flash-add" @click="onAddFlash">存档 ⚡</el-button>
      </div>
      <p v-for="f in flashList" :key="f.id" class="flash-line" :data-testid="`couple-flash-${f.id}`">
        <span class="flash-by">{{ f.mine ? '我' : 'TA' }} 记的</span>{{ f.moment }}
      </p>
    </div>

    <!-- F174 动作暗语本 -->
    <div class="card" data-testid="couple-signal">
      <h4 class="title">🤝 动作暗语本 <span class="sub">人前不能说的话，都写在动作里</span></h4>
      <div class="inline-form">
        <el-input v-model="signalDraft" maxlength="50" placeholder="动作（捏三下手心）" style="max-width: 180px" data-testid="couple-signal-text" />
        <el-input v-model="meaningDraft" maxlength="100" placeholder="含义（我爱你，别怕）" data-testid="couple-signal-meaning" />
        <el-button size="small" type="primary" data-testid="couple-signal-add" @click="onAddSignal">约定 🤝</el-button>
      </div>
      <p v-for="s in signalList" :key="s.id" class="flash-line" :data-testid="`couple-signal-${s.id}`">
        <b>{{ s.signal }}</b> = 「{{ s.meaning }}」<span class="flash-by">{{ s.mine ? '（我约定）' : '（TA 约定）' }}</span>
      </p>
    </div>

    <!-- F177 心动日历 -->
    <div class="card" data-testid="couple-heartday">
      <h4 class="title">🗓️ 心动日历 <span class="sub">给今天盖一个心动邮戳</span></h4>
      <div class="stamp-row" data-testid="couple-heartday-stamps">
        <el-button size="small" plain data-testid="couple-heartday-1" @click="onStamp(1)">😐 平淡</el-button>
        <el-button size="small" plain type="warning" data-testid="couple-heartday-2" @click="onStamp(2)">😊 甜甜</el-button>
        <el-button size="small" plain type="danger" data-testid="couple-heartday-3" @click="onStamp(3)">😍 心动爆棚</el-button>
      </div>
      <div class="stamp-grid">
        <span v-for="h in heartDayList.slice(0, 31)" :key="h.id" class="stamp" :data-testid="`couple-stamp-${h.day}`">
          {{ ['', '😐', '😊', '😍'][h.level] }}{{ h.day.slice(5) }}
        </span>
      </div>
    </div>

    <!-- F179 默契周报 -->
    <div class="card" data-testid="couple-weekly">
      <h4 class="title">📮 默契周报</h4>
      <p v-if="weekly" class="pair-line" data-testid="couple-weekly-summary">{{ weekly.summary }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useCoupleStore } from '@/stores/couple'
import { coupleApi } from '@/api/couple'
import type { CoupleSparkQuizVO } from '@/types'

const couple = useCoupleStore()

const dash = computed(() => couple.sparkDash)
const tapNow = computed(() => couple.tapToday)
const rank = computed(() => couple.syncRankList)
const pair = computed(() => couple.loveLangPair)
const whatIfQ = computed(() => couple.whatIfQ)
const flashList = computed(() => couple.flashList)
const signalList = computed(() => couple.signalList)
const heartDayList = computed(() => couple.heartDayList)
const weekly = computed(() => couple.sparkWeekly)

const quiz = ref<CoupleSparkQuizVO[]>([])
const quizAnswers = ref<(string | null)[]>([])
const whatIfDraft = ref('')
const flashDraft = ref('')
const signalDraft = ref('')
const meaningDraft = ref('')

const loveLangDone = computed(() => couple.loveLang != null)

async function onLoadQuiz() {
  try {
    quiz.value = (await coupleApi.sparkQuiz()) ?? []
    quizAnswers.value = quiz.value.map(() => null)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '加载失败')
  }
}

function pickQuiz(index: number, option: 'A' | 'B') {
  quizAnswers.value[index] = option
}

async function onSubmitLoveLang() {
  const answers = quizAnswers.value.map((a) => a ?? '')
  try {
    await couple.submitLoveLang(answers)
    ElMessage.success('爱语说明书已生成 💗')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '提交失败')
  }
}

async function onTap() {
  try {
    await couple.tap()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '按键失败')
  }
}

async function onAnswerWhatIf() {
  if (!whatIfDraft.value.trim()) {
    ElMessage.warning('先写下你的「如果…」 🌈')
    return
  }
  try {
    await couple.answerWhatIf(whatIfDraft.value)
    whatIfDraft.value = ''
    ElMessage.success('已交卷 🌌')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '提交失败')
  }
}

async function onAddFlash() {
  if (!flashDraft.value.trim()) {
    ElMessage.warning('先想一句闪光的话再记下 ✨')
    return
  }
  try {
    await couple.addFlash(flashDraft.value)
    flashDraft.value = ''
    ElMessage.success('心动已存档 ⚡')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '保存失败')
  }
}

async function onAddSignal() {
  if (!signalDraft.value.trim() || !meaningDraft.value.trim()) {
    ElMessage.warning('动作和含义都要写哦')
    return
  }
  try {
    await couple.addSignal(signalDraft.value, meaningDraft.value)
    signalDraft.value = ''
    meaningDraft.value = ''
    ElMessage.success('暗语已约定 🤝')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '保存失败')
  }
}

async function onStamp(level: number) {
  try {
    await couple.markHeartDay(level)
    ElMessage.success('今天的邮戳盖好了 🗓️')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '盖章失败')
  }
}

onMounted(async () => {
  try {
    await couple.loadSpark()
  } catch {
    // 未建立空间等场景：静默
  }
})
</script>

<style scoped>
.couple-spark { display: flex; flex-direction: column; gap: 14px; }
.card { background: var(--im-panel-bg, #fff); border-radius: 10px; padding: 14px 16px; border: 1px solid var(--im-border, #ebeef5); }
.title { margin: 0 0 10px; font-size: 15px; color: var(--im-text, #303133); }
.sub { font-size: 12px; color: var(--im-muted, #909399); font-weight: normal; margin-left: 6px; }
.inline-form { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 8px; }
.inline-form .el-input { flex: 1; min-width: 160px; }
.dash-row { display: flex; align-items: center; gap: 12px; }
.dash-score { font-size: 30px; font-weight: bold; color: #f56c6c; }
.dash-main { flex: 1; }
.dash-label { margin: 2px 0 0; font-size: 13px; color: var(--im-text, #303133); }
.dash-detail { margin: 8px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.tap-result { margin-left: 10px; font-size: 13px; color: #f56c6c; }
.tap-best { margin-left: 8px; font-size: 12px; color: var(--im-muted, #909399); }
.rank-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
.rank-item { font-size: 12px; color: var(--im-muted, #909399); background: var(--im-bg, #fafafa); border-radius: 6px; padding: 2px 8px; }
.quiz-q { margin: 6px 0; font-size: 13px; color: var(--im-text, #303133); }
.quiz-opts { display: inline-flex; gap: 6px; margin-left: 8px; flex-wrap: wrap; }
.pair-line { margin: 6px 0; font-size: 13px; color: var(--im-text, #303133); line-height: 1.8; }
.flash-line { margin: 4px 0; font-size: 13px; color: var(--im-text, #303133); }
.flash-by { font-size: 11px; color: var(--im-muted, #909399); margin-right: 6px; }
.stamp-row { display: flex; gap: 8px; margin-bottom: 8px; }
.stamp-grid { display: flex; flex-wrap: wrap; gap: 6px; }
.stamp { font-size: 12px; color: var(--im-muted, #909399); background: var(--im-bg, #fafafa); border-radius: 6px; padding: 2px 8px; }
</style>

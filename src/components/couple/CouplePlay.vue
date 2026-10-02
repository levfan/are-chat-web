<template>
  <div class="couple-play" data-testid="couple-play">
    <!-- F132 / F137 / F133 今日抽签区 -->
    <div class="card draw-row" data-testid="couple-play-draw">
      <div class="draw-cell" data-testid="couple-heartbeat">
        <p class="draw-label">💗 今日心动概率</p>
        <template v-if="hb">
          <p class="draw-big"><b>{{ hb.score }}%</b></p>
          <p class="draw-tip">{{ hb.line }}</p>
        </template>
        <p v-else class="draw-tip">抽签中…</p>
      </div>
      <div class="draw-cell" data-testid="couple-weather">
        <p class="draw-label">🌤️ 今日恋爱天气</p>
        <template v-if="wt">
          <p class="draw-big">{{ wt.emoji }} {{ wt.name }}</p>
          <p class="draw-tip">{{ wt.tip }}</p>
        </template>
        <p v-else class="draw-tip">预报中…</p>
      </div>
      <div class="draw-cell" data-testid="couple-tarot">
        <p class="draw-label">🃏 今日塔罗</p>
        <template v-if="tr">
          <p class="draw-big">{{ tr.emoji }} {{ tr.name }}</p>
          <p class="draw-tip">{{ tr.message }}</p>
        </template>
        <p v-else class="draw-tip">洗牌中…</p>
      </div>
    </div>

    <!-- F139 骰子 -->
    <div class="card" data-testid="couple-dice">
      <h4 class="title">🎲 家务骰子 <span class="sub">谁洗碗，天说了算（纯本地，公平公正）</span></h4>
      <div class="dice-stage">
        <span class="dice-face" data-testid="couple-dice-face">{{ diceFace }}</span>
        <p class="dice-result" data-testid="couple-dice-result">{{ diceResult || '点击掷骰子，命运立刻揭晓' }}</p>
      </div>
      <el-button size="small" type="primary" data-testid="couple-dice-roll" @click="rollDice">掷 🎲</el-button>
    </div>

    <!-- F130 一百问 -->
    <div class="card" data-testid="couple-survey">
      <h4 class="title">📝 一百问 <span class="sub">答一题解锁 TA 的同题答案（{{ sv?.myCount ?? 0 }}/{{ sv?.total ?? 100 }}）</span></h4>
      <el-checkbox v-model="onlyUnanswered" label="只看未答的题" data-testid="couple-survey-filter" />
      <div class="survey-list">
        <div v-for="q in visibleQuestions" :key="q.no" class="survey-row" :data-testid="`couple-survey-${q.no}`">
          <span class="survey-no">{{ q.no }}</span>
          <div class="survey-body">
            <p class="survey-q">{{ q.text }}</p>
            <template v-if="q.myAnswer !== null && !editing(q.no)">
              <p class="survey-mine" @click="startEdit(q.no)">{{ q.myAnswer }}</p>
            </template>
            <template v-else>
              <div class="survey-form">
                <el-input
                  v-model="surveyDrafts[q.no]"
                  size="small"
                  maxlength="200"
                  :placeholder="q.myAnswer ?? '写下你的答案，解锁 TA 的'"
                  :data-testid="`couple-survey-input-${q.no}`"
                  @keyup.enter="onAnswerSurvey(q.no)"
                />
                <el-button size="small" type="primary" :data-testid="`couple-survey-save-${q.no}`" @click="onAnswerSurvey(q.no)">
                  提交
                </el-button>
              </div>
            </template>
            <p v-if="q.partnerAnswer" class="survey-partner" :data-testid="`couple-survey-partner-${q.no}`">TA：{{ q.partnerAnswer }}</p>
            <p v-else-if="q.partnerCount > 0" class="survey-locked">🔒 TA 已作答，你答这题即可解锁</p>
          </div>
        </div>
      </div>
    </div>

    <!-- F131 出题考TA -->
    <div class="card" data-testid="couple-quiz">
      <h4 class="title">🎯 出题考TA <span class="sub">看看 TA 有多懂你，判分权在你</span></h4>
      <el-input
        v-model="quizDraft"
        maxlength="200"
        show-word-limit
        placeholder="出题：我最喜欢的颜色是什么？"
        data-testid="couple-quiz-input"
        @keyup.enter="onMakeQuiz"
      />
      <el-button class="mt8" size="small" type="primary" data-testid="couple-quiz-make" @click="onMakeQuiz">出题 🎯</el-button>
      <div v-if="qz.length" class="quiz-list">
        <div v-for="q in qz" :key="q.id" class="quiz-item" :data-testid="`couple-quiz-${q.id}`">
          <span class="quiz-q">{{ q.mine ? '我出：' : 'TA 出：' }}{{ q.question }}</span>
          <el-tag v-if="q.verdict === 'RIGHT'" size="small" type="success">答对 🎉</el-tag>
          <el-tag v-else-if="q.verdict === 'WRONG'" size="small" type="danger">没答对 😅</el-tag>
          <el-tag v-else-if="q.status === 'ANSWERED'" size="small" type="warning">待判分</el-tag>
          <template v-if="!q.mine && q.status === 'OPEN'">
            <el-input
              v-model="quizAnswerDrafts[q.id]"
              size="small"
              maxlength="200"
              placeholder="写下你的答案"
              :data-testid="`couple-quiz-answer-${q.id}`"
            />
            <el-button size="small" type="success" plain :data-testid="`couple-quiz-submit-${q.id}`" @click="onAnswerQuiz(q.id)">交卷</el-button>
          </template>
          <template v-else-if="q.mine && q.status === 'ANSWERED'">
            <span class="quiz-answer">TA 答：{{ q.answerText }}</span>
            <el-button size="small" type="success" :data-testid="`couple-quiz-right-${q.id}`" @click="onJudgeQuiz(q.id, 'RIGHT')">对</el-button>
            <el-button size="small" type="danger" plain :data-testid="`couple-quiz-wrong-${q.id}`" @click="onJudgeQuiz(q.id, 'WRONG')">错</el-button>
          </template>
        </div>
      </div>
    </div>

    <!-- F134 世界情话课 -->
    <div class="card" data-testid="couple-lesson">
      <h4 class="title">🌏 世界情话课 <span class="sub">每天一课，学会说给 TA 听</span></h4>
      <template v-if="ls">
        <div class="lesson-today" data-testid="couple-lesson-today">
          <el-tag size="small">{{ ls.language }}</el-tag>
          <p class="lesson-word">「{{ ls.word }}」</p>
          <p class="lesson-meaning">{{ ls.meaning }}</p>
        </div>
      </template>
      <div class="lesson-form">
        <el-input v-model="loveWord" maxlength="100" placeholder="收藏一句自己的情话" data-testid="couple-loveword-input" />
        <el-input v-model="loveMeaning" maxlength="200" placeholder="含义（可空）" data-testid="couple-loveword-meaning" />
        <el-button size="small" type="primary" data-testid="couple-loveword-keep" @click="onCollectLoveWord">收藏 💘</el-button>
      </div>
      <div v-if="ls?.collected?.length" class="lesson-list">
        <p v-for="w in ls.collected" :key="w.id" class="lesson-kept" :data-testid="`couple-loveword-${w.id}`">
          💘 {{ w.word }}<span v-if="w.meaning"> —— {{ w.meaning }}</span>
        </p>
      </div>
    </div>

    <!-- F135 周末盲选 -->
    <div class="card" data-testid="couple-blind">
      <h4 class="title">🎁 周末盲选 <span class="sub">各写 3 个愿望，都交了自动配对开奖</span></h4>
      <div class="blind-form">
        <el-input v-model="blindDrafts[0]" maxlength="50" placeholder="愿望 1" data-testid="couple-blind-p1" />
        <el-input v-model="blindDrafts[1]" maxlength="50" placeholder="愿望 2" data-testid="couple-blind-p2" />
        <el-input v-model="blindDrafts[2]" maxlength="50" placeholder="愿望 3" data-testid="couple-blind-p3" />
        <el-button size="small" type="primary" data-testid="couple-blind-submit" @click="onSubmitBlind">
          {{ bl?.mine?.length ? '改投愿望' : '投进盲盒' }} 🎁
        </el-button>
      </div>
      <div v-if="bl?.settled" class="blind-plan" data-testid="couple-blind-plan">
        🎉 本周计划：「{{ bl.planMine }}」+「{{ bl.planPartner }}」
      </div>
      <p v-else-if="bl?.partnerSubmitted" class="blind-wait" data-testid="couple-blind-wait">TA 已投好盲盒，就差你三张了 🤞</p>
    </div>

    <!-- F136 情话Battle -->
    <div class="card" data-testid="couple-battle">
      <h4 class="title">💘 情话Battle <span class="sub">今天也为了「谁更会撩」较一把劲</span></h4>
      <template v-if="bt && bt.id">
        <div v-for="l in bt.lines" :key="l.id" class="battle-line" :data-testid="`couple-battle-line-${l.id}`">
          <span class="battle-content">{{ l.mine ? '我：' : 'TA：' }}「{{ l.content }}」</span>
          <el-button
            v-if="bt.status === 'FULL' && !bt.voted"
            size="small"
            type="warning"
            plain
            :data-testid="`couple-battle-vote-${l.fromUser}`"
            @click="onVoteBattle(l.fromUser)"
          >
            投它 🗳️
          </el-button>
        </div>
        <p v-if="bt.status === 'OPEN'" class="battle-wait">等你上场 💘</p>
        <p v-if="bt.status === 'FULL' && bt.voted" class="battle-wait" data-testid="couple-battle-wait">你已投票，等 TA 一锤定音 🗳️</p>
        <p v-if="bt.status === 'DONE' && bt.winner" class="battle-done" data-testid="couple-battle-winner">🏆 赢家：{{ bt.winner }}！输的人请喝奶茶。</p>
        <p v-else-if="bt.status === 'DONE'" class="battle-done" data-testid="couple-battle-winner">💞 平局！双倍甜，都是今天的冠军。</p>
        <el-input
          v-if="!myLine"
          v-model="battleDraft"
          maxlength="100"
          placeholder="写下你的参赛情话"
          class="mt8"
          data-testid="couple-battle-input"
          @keyup.enter="onJoinBattle"
        />
        <el-button v-if="!myLine && bt.status !== 'DONE'" class="mt8" size="small" type="primary" data-testid="couple-battle-join" @click="onJoinBattle">
          上场 💘
        </el-button>
      </template>
      <template v-else>
        <el-input
          v-model="battleDraft"
          maxlength="100"
          placeholder="写下你的参赛情话，开启今日 Battle"
          data-testid="couple-battle-input"
          @keyup.enter="onJoinBattle"
        />
        <el-button class="mt8" size="small" type="primary" data-testid="couple-battle-join" @click="onJoinBattle">
          开擂 💘
        </el-button>
      </template>
    </div>

    <!-- F138 抽象画 -->
    <div class="card" data-testid="couple-art">
      <h4 class="title">🎨 抽象画 <span class="sub">随机种子生成一幅画，送进你们的画廊</span></h4>
      <div class="art-form">
        <el-input v-model="artTitle" maxlength="50" placeholder="画作标题（无题也行）" data-testid="couple-art-title" />
        <el-button size="small" type="primary" data-testid="couple-art-create" @click="onCreateArt">作画 🎨</el-button>
      </div>
      <div v-if="at.length" class="art-grid">
        <div v-for="a in at" :key="a.id" class="art-item" :data-testid="`couple-art-${a.id}`">
          <div class="art-svg" v-html="artSvg(a.seed)"></div>
          <p class="art-title">《{{ a.title }}》<span class="art-by">{{ a.fromUser === me ? '我' : 'TA' }}</span></p>
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

const couple = useCoupleStore()
const auth = useAuthStore()
const me = computed(() => auth.username ?? '')

const sv = computed(() => couple.survey)
const qz = computed(() => couple.quizzes)
const ls = computed(() => couple.lesson)
const bl = computed(() => couple.blind)
const bt = computed(() => couple.battle)
const hb = computed(() => couple.heartbeat)
const wt = computed(() => couple.loveWeather)
const tr = computed(() => couple.tarot)
const at = computed(() => couple.arts)

// F130 一百问
const onlyUnanswered = ref(false)
const surveyDrafts = ref<Record<number, string>>({})
const editingNo = ref(0)
const surveyRows = computed(() => {
  const my = new Map((sv.value?.my ?? []).map((a) => [a.qNo, a.answer]))
  const partner = new Map((sv.value?.partnerUnlocked ?? []).map((a) => [a.qNo, a.answer]))
  const total = sv.value?.total ?? 100
  const rows: { no: number; text: string; myAnswer: string | null; partnerAnswer: string | null; partnerCount: number }[] = []
  for (let i = 1; i <= total; i++) {
    rows.push({ no: i, text: sv.value?.questions?.[i - 1] ?? '', myAnswer: my.get(i) ?? null, partnerAnswer: partner.get(i) ?? null, partnerCount: 0 })
  }
  return rows
})
const visibleQuestions = computed(() =>
  onlyUnanswered.value ? surveyRows.value.filter((r) => r.myAnswer === null) : surveyRows.value,
)
function startEdit(no: number) {
  editingNo.value = no
}
function editing(no: number) {
  return editingNo.value === no
}

// F131 出题考TA
const quizDraft = ref('')
const quizAnswerDrafts = ref<Record<string, string>>({})

// F134 世界情话课
const loveWord = ref('')
const loveMeaning = ref('')

// F135 周末盲选
const blindDrafts = ref<string[]>(['', '', ''])

// F136 情话Battle
const battleDraft = ref('')
const myLine = computed(() => bt.value?.lines.find((l) => l.mine) ?? null)

// F138 抽象画
const artTitle = ref('')

// F139 骰子（纯前端）
const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅']
const DICE_TASKS = [
  '谁先眨眼谁洗碗！',
  '今晚电影，输的人选片。',
  '由赢家决定明天早餐吃什么。',
  '输的人给对方按摩 5 分钟。',
  '赢的人点外卖，输的人下楼取。',
  '输的人说三句情话才能免洗碗。',
]
const diceFace = ref('🎲')
const diceResult = ref('')
function rollDice() {
  const i = Math.floor(Math.random() * 6)
  diceFace.value = DICE_FACES[i]
  diceResult.value = DICE_TASKS[i]
}

async function onAnswerSurvey(qNo: number) {
  const answer = (surveyDrafts.value[qNo] ?? '').trim()
  if (!answer) {
    ElMessage.warning('这题还没写答案呢，先答一句 🔓')
    return
  }
  try {
    await couple.answerSurvey(qNo, answer)
    surveyDrafts.value[qNo] = ''
    editingNo.value = 0
    ElMessage.success(`第 ${qNo} 题已答，TA 的同题答案解锁了 🔓`)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '提交失败')
  }
}

async function onMakeQuiz() {
  if (!quizDraft.value.trim()) {
    ElMessage.warning('出题先写题干 🎓')
    return
  }
  try {
    await couple.makeQuiz(quizDraft.value)
    quizDraft.value = ''
    ElMessage.success('题目已送出，坐等 TA 交卷 🎯')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '出题失败')
  }
}

async function onAnswerQuiz(id: string) {
  const answer = (quizAnswerDrafts.value[id] ?? '').trim()
  if (!answer) {
    ElMessage.warning('先写下你的答案再交卷 ✍️')
    return
  }
  try {
    await couple.answerQuiz(id, answer)
    quizAnswerDrafts.value[id] = ''
    ElMessage.success('交卷成功，等 TA 判分 ✍️')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '提交失败')
  }
}

async function onJudgeQuiz(id: string, verdict: 'RIGHT' | 'WRONG') {
  try {
    await couple.judgeQuiz(id, verdict)
    ElMessage.success(verdict === 'RIGHT' ? '判对！TA 很懂你 🎉' : '判错……让 TA 再抄一百遍 😅')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '判分失败')
  }
}

async function onCollectLoveWord() {
  if (!loveWord.value.trim()) {
    ElMessage.warning('情话课先写一句 📖')
    return
  }
  try {
    await couple.collectLoveWord(loveWord.value, loveMeaning.value.trim() || undefined)
    loveWord.value = ''
    loveMeaning.value = ''
    ElMessage.success('情话已入收藏夹 💘')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '收藏失败')
  }
}

async function onSubmitBlind() {
  const picks = blindDrafts.value.map((p) => p.trim()).filter(Boolean)
  try {
    await couple.submitBlindPick(picks)
    blindDrafts.value = ['', '', '']
    ElMessage.success('周末愿望已投进盲盒 🎁')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '提交失败')
  }
}

async function onJoinBattle() {
  if (!battleDraft.value.trim()) {
    ElMessage.warning('情话 Battle 先出一句 ⚔️')
    return
  }
  try {
    await couple.joinBattle(battleDraft.value)
    battleDraft.value = ''
    ElMessage.success('上场成功，坐等对方应战 💘')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '参赛失败')
  }
}

async function onVoteBattle(toUser: string) {
  try {
    await couple.voteBattle(toUser)
    ElMessage.success('投出心中最心动的一句 🗳️')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '投票失败')
  }
}

async function onCreateArt() {
  try {
    const seed = Math.floor(Math.random() * 100000)
    await couple.createArt(artTitle.value.trim() || '无题', seed)
    artTitle.value = ''
    ElMessage.success('画作已送进画廊 🎨')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '作画失败')
  }
}

/** F138 由种子确定性地生成一幅抽象画 SVG（同一 seed 永远同一幅）。 */
function floorMod(n: number, m: number): number {
  return ((n % m) + m) % m
}
function artSvg(seed: number): string {
  let s = floorMod(seed || 1, 2147483647) || 1
  const rnd = () => {
    s = (s * 48271) % 2147483647
    return s / 2147483647
  }
  const hue = Math.floor(rnd() * 360)
  let shapes = ''
  for (let i = 0; i < 6; i++) {
    const cx = Math.floor(rnd() * 120)
    const cy = Math.floor(rnd() * 90)
    const r = 8 + Math.floor(rnd() * 30)
    const h = (hue + Math.floor(rnd() * 120)) % 360
    shapes += `<circle cx='${cx}' cy='${cy}' r='${r}' fill='hsl(${h},70%,65%)' opacity='0.65'/>`
  }
  for (let i = 0; i < 3; i++) {
    const x = Math.floor(rnd() * 100)
    const y = Math.floor(rnd() * 70)
    const w = 15 + Math.floor(rnd() * 40)
    const h2 = (hue + 180 + Math.floor(rnd() * 90)) % 360
    shapes += `<rect x='${x}' y='${y}' width='${w}' height='8' rx='4' fill='hsl(${h2},60%,55%)' opacity='0.6' transform='rotate(${Math.floor(rnd() * 60 - 30)} ${x} ${y})'/>`
  }
  return `<svg viewBox='0 0 120 90' xmlns='http://www.w3.org/2000/svg'><rect width='120' height='90' rx='6' fill='hsl(${hue},30%,92%)'/>${shapes}</svg>`
}

onMounted(async () => {
  try {
    await couple.loadPlay()
  } catch {
    // 未建立空间等场景：静默
  }
})
</script>

<style scoped>
.couple-play { display: flex; flex-direction: column; gap: 14px; }
.card { background: var(--im-panel-bg, #fff); border-radius: 10px; padding: 14px 16px; border: 1px solid var(--im-border, #ebeef5); }
.title { margin: 0 0 10px; font-size: 15px; color: var(--im-text, #303133); }
.sub { font-size: 12px; color: var(--im-muted, #909399); font-weight: normal; margin-left: 6px; }
.mt8 { margin-top: 8px; }
.draw-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
.draw-cell { background: var(--im-bg, #fafafa); border-radius: 8px; padding: 10px 12px; }
.draw-label { margin: 0 0 6px; font-size: 12px; color: var(--im-muted, #909399); }
.draw-big { margin: 0 0 4px; font-size: 20px; color: #f56c6c; }
.draw-big b { font-size: 24px; }
.draw-tip { margin: 0; font-size: 12px; color: var(--im-text, #303133); line-height: 1.5; }
.dice-stage { display: flex; align-items: center; gap: 14px; margin-bottom: 8px; }
.dice-face { font-size: 40px; line-height: 1; }
.dice-result { margin: 0; font-size: 14px; color: var(--im-text, #303133); }
.survey-list { margin-top: 8px; max-height: 420px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; padding-right: 4px; }
.survey-row { display: flex; gap: 10px; align-items: flex-start; }
.survey-no { min-width: 28px; color: var(--im-muted, #909399); font-size: 12px; padding-top: 4px; }
.survey-body { flex: 1; }
.survey-q { margin: 0 0 4px; font-size: 13px; color: var(--im-text, #303133); }
.survey-mine { margin: 0 0 2px; font-size: 13px; color: #f56c6c; cursor: pointer; }
.survey-form { display: flex; gap: 6px; margin: 2px 0; }
.survey-partner { margin: 2px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.survey-locked { margin: 2px 0 0; font-size: 12px; color: var(--im-muted, #909399); opacity: 0.8; }
.quiz-list { margin-top: 10px; display: flex; flex-direction: column; gap: 8px; }
.quiz-item { display: flex; align-items: center; gap: 8px; font-size: 13px; flex-wrap: wrap; }
.quiz-q { color: var(--im-text, #303133); flex: 1; min-width: 160px; }
.quiz-answer { color: var(--im-muted, #909399); }
.lesson-today { background: var(--im-bg, #fafafa); border-radius: 8px; padding: 10px 12px; margin-bottom: 10px; }
.lesson-word { margin: 6px 0 4px; font-size: 16px; color: var(--im-text, #303133); }
.lesson-meaning { margin: 0; font-size: 13px; color: var(--im-muted, #909399); }
.lesson-form { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.lesson-form .el-input { flex: 1; min-width: 140px; }
.lesson-list { margin-top: 8px; display: flex; flex-direction: column; gap: 4px; }
.lesson-kept { margin: 0; font-size: 13px; color: var(--im-text, #303133); }
.blind-form { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.blind-form .el-input { width: 180px; }
.blind-plan { margin-top: 10px; font-size: 14px; color: #f56c6c; }
.blind-wait { margin: 10px 0 0; font-size: 13px; color: var(--im-muted, #909399); }
.battle-line { display: flex; align-items: center; gap: 8px; font-size: 13px; margin-bottom: 6px; }
.battle-content { color: var(--im-text, #303133); flex: 1; }
.battle-wait { margin: 4px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.battle-done { margin: 6px 0 0; font-size: 14px; color: #f56c6c; }
.art-form { display: flex; gap: 8px; align-items: center; margin-bottom: 10px; }
.art-form .el-input { max-width: 260px; }
.art-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; }
.art-item { background: var(--im-bg, #fafafa); border-radius: 8px; padding: 8px; }
.art-svg :deep(svg) { width: 100%; height: auto; display: block; border-radius: 6px; }
.art-title { margin: 6px 0 0; font-size: 12px; color: var(--im-text, #303133); }
.art-by { color: var(--im-muted, #909399); margin-left: 6px; }
</style>

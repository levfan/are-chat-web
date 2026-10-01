<template>
  <div class="fun-talk" data-testid="couple-fun-talk">
    <!-- F103 你比划我猜 -->
    <div class="card" data-testid="couple-guess">
      <h4 class="title">🙈 你比划我猜 <span class="sub">比划不能说，猜中才过瘾（每天 5 轮）</span></h4>
      <el-button
        v-if="!myDrawn && !partnerClued"
        type="primary"
        plain
        data-testid="couple-guess-start"
        @click="onStartGuess"
      >
        开一轮 🎲
      </el-button>
      <!-- 我是比划人：看我抽到的词 -->
      <div v-if="myDrawn" class="guess-describe">
        <p class="guess-word" data-testid="couple-guess-my-word">
          🔑 本轮词语：<b>{{ myDrawn.word }}</b>
        </p>
        <div class="clue-row">
          <el-input
            v-model="clueDraft"
            maxlength="100"
            show-word-limit
            placeholder="描述它（不能包含词语本身）：比如 辣辣的、涮着吃的"
            data-testid="couple-guess-clue"
            @keyup.enter="onClue"
          />
          <el-button type="primary" data-testid="couple-guess-clue-send" @click="onClue">出提示 🙉</el-button>
        </div>
      </div>
      <!-- TA 出了提示：我来猜 -->
      <div v-if="partnerClued" class="guess-answer">
        <p class="clue-show" data-testid="couple-guess-clue-show">
          💬 提示：「{{ partnerClued.clue }}」（已猜 {{ partnerClued.attempts }}/3 次）
        </p>
        <div class="clue-row">
          <el-input
            v-model="guessDraft"
            maxlength="30"
            placeholder="猜猜是什么词"
            data-testid="couple-guess-input"
            @keyup.enter="onGuess"
          />
          <el-button type="success" data-testid="couple-guess-submit" @click="onGuess">猜！🎉</el-button>
        </div>
      </div>
      <div v-if="settled.length" class="guess-hist">
        <div v-for="g in settled.slice(0, 4)" :key="g.id" class="guess-hist-item">
          <span class="guess-day">{{ g.day.slice(5) }}</span>
          <span class="guess-pair">{{ g.fromUser === auth.username ? '我' : 'TA' }} 比划 ·「{{ g.word }}」</span>
          <el-tag :type="g.status === 'HIT' ? 'success' : 'info'" size="small">
            {{ g.status === 'HIT' ? '猜中 ✓' : '没猜中' }}
          </el-tag>
        </div>
      </div>
    </div>

    <!-- F104 故事接龙 -->
    <div class="card" data-testid="couple-story">
      <h4 class="title">📖 故事接龙 <span class="sub">你一句我一句，我们的故事自己写</span></h4>
      <template v-for="s in couple.stories.slice(0, 3)" :key="s.chainId">
        <div class="story" :class="{ open: !s.finished }">
          <div class="story-lines">
            <p v-for="l in s.lines" :key="l.id" class="story-line">
              <span class="story-who">{{ l.byUser === auth.username ? '我' : 'TA' }}：</span>{{ l.content }}
            </p>
          </div>
          <div v-if="!s.finished" class="story-actions">
            <el-input
              v-if="canWrite(s)"
              v-model="storyDraft"
              maxlength="100"
              show-word-limit
              placeholder="接一句…"
              :data-testid="`couple-story-input-${s.chainId}`"
              @keyup.enter="onAddLine(s.chainId)"
            />
            <p v-else class="story-wait">轮到 TA 写啦，等 TA 一句 👀</p>
            <el-button
              v-if="canWrite(s)"
              type="primary"
              size="small"
              :data-testid="`couple-story-send-${s.chainId}`"
              @click="onAddLine(s.chainId)"
            >
              接上
            </el-button>
            <el-button size="small" plain :data-testid="`couple-story-finish-${s.chainId}`" @click="onFinish(s.chainId)">
              完结本篇
            </el-button>
          </div>
          <el-tag v-else type="success" size="small">已完结 📚</el-tag>
        </div>
      </template>
      <div v-if="canStartStory" class="story-new">
        <el-input
          v-model="storyStartDraft"
          maxlength="100"
          show-word-limit
          placeholder="开个新故事的第一句，比如：很久很久以前…"
          data-testid="couple-story-start-input"
        />
        <el-button type="primary" data-testid="couple-story-start" @click="onStartStory">开新篇 📖</el-button>
      </div>
    </div>

    <!-- F105 专属词典小考 -->
    <div class="card" data-testid="couple-dictquiz">
      <h4 class="title">🎓 专属词典小考 <span class="sub">TA 真的懂我们的词吗？</span></h4>
      <template v-if="quiz">
        <p class="quiz-word">「<b>{{ quiz.word }}</b>」在我们之间是什么意思？</p>
        <div class="quiz-options">
          <el-button
            v-for="(opt, i) in quiz.options"
            :key="i"
            class="quiz-opt"
            :type="quizPick === null ? 'default' : i === quiz.correctIndex ? 'success' : i === quizPick ? 'danger' : 'default'"
            :data-testid="`couple-dictquiz-opt-${i}`"
            @click="pickQuiz(i)"
          >
            {{ opt }}
          </el-button>
        </div>
        <p v-if="quizPick !== null" class="quiz-verdict" data-testid="couple-dictquiz-verdict">
          {{ quizPick === quiz.correctIndex ? '答对啦！这是刻进 DNA 的默契 🏆' : '答错啦～去词典复习一下，罚你抱 TA 十秒 🤗' }}
        </p>
      </template>
      <el-button size="small" plain data-testid="couple-dictquiz-load" @click="onLoadQuiz">出一题 🎓</el-button>
    </div>

    <!-- F106 情话合成器 -->
    <div class="card" data-testid="couple-sweetsynth">
      <h4 class="title">💌 情话合成器 <span class="sub">一键生成专属情话，复制去私聊</span></h4>
      <div class="sweet-row">
        <p class="sweet-line" data-testid="couple-sweetsynth-line">{{ couple.sweetLine || '点下面的按钮，摇一句甜的～' }}</p>
        <div class="sweet-actions">
          <el-button type="primary" data-testid="couple-sweetsynth-roll" @click="onRoll">摇一句 🎰</el-button>
          <el-button
            v-if="couple.sweetLine"
            data-testid="couple-sweetsynth-copy"
            @click="onCopySweet"
          >
            复制
          </el-button>
        </div>
      </div>
    </div>

    <!-- F109 晚安电台 -->
    <div class="card" data-testid="couple-radio">
      <h4 class="title">📻 晚安电台 <span class="sub">每晚一首我们的歌</span></h4>
      <template v-if="radio">
        <p v-if="radio.hasSong" class="radio-song" data-testid="couple-radio-song">
          🎵 今晚主题曲：《{{ radio.title }}》{{ radio.artist ? ` · ${radio.artist}` : '' }}
        </p>
        <p v-if="radio.hasSong && radio.reason" class="radio-reason">因为：{{ radio.reason }}</p>
        <p class="radio-line" data-testid="couple-radio-line">{{ radio.line }}</p>
      </template>
      <el-button size="small" plain data-testid="couple-radio-load" @click="onLoadRadio">打开电台 📻</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useCoupleStore } from '@/stores/couple'
import { useAuthStore } from '@/stores/auth'
import type { CoupleStoryChainVO } from '@/types'

const couple = useCoupleStore()
const auth = useAuthStore()

const clueDraft = ref('')
const guessDraft = ref('')
const storyDraft = ref('')
const storyStartDraft = ref('')
const quizPick = ref<number | null>(null)

const myDrawn = computed(() =>
  couple.guessRounds.find((g) => g.fromUser === auth.username && g.status === 'DRAWN') ?? null)
const partnerClued = computed(() =>
  couple.guessRounds.find((g) => g.fromUser !== auth.username && g.status === 'CLUED') ?? null)
const settled = computed(() => couple.guessRounds.filter((g) => g.status === 'HIT' || g.status === 'MISSED'))
const quiz = computed(() => couple.dictQuiz)
const radio = computed(() => couple.goodnightRadio)
const openStory = computed(() => couple.stories.find((s) => !s.finished) ?? null)
const canStartStory = computed(() => !openStory.value && couple.stories.length < 20)

function canWrite(s: CoupleStoryChainVO) {
  const last = s.lines[s.lines.length - 1]
  return last && last.byUser !== auth.username
}

async function onStartGuess() {
  try {
    await couple.startGuess()
    ElMessage.success('已抽词，去描述吧 🎲')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '开局失败')
  }
}

async function onClue() {
  const g = myDrawn.value
  if (!g || !clueDraft.value.trim()) return
  try {
    await couple.clueGuess(g.id, clueDraft.value)
    clueDraft.value = ''
    ElMessage.success('提示已送出 🙉')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '提示失败')
  }
}

async function onGuess() {
  const g = partnerClued.value
  if (!g || !guessDraft.value.trim()) return
  try {
    await couple.doGuess(g.id, guessDraft.value)
    guessDraft.value = ''
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '猜测失败')
  }
}

async function onStartStory() {
  if (!storyStartDraft.value.trim()) return
  try {
    await couple.startStory(storyStartDraft.value)
    storyStartDraft.value = ''
    ElMessage.success('新故事开篇啦 📖')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '开篇失败')
  }
}

async function onAddLine(chainId: string) {
  if (!storyDraft.value.trim()) return
  try {
    await couple.addStoryLine(chainId, storyDraft.value)
    storyDraft.value = ''
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '接龙失败')
  }
}

async function onFinish(chainId: string) {
  try {
    await couple.finishStory(chainId)
    ElMessage.success('本篇完结，可以开新篇啦 📚')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '完结失败')
  }
}

async function onLoadQuiz() {
  try {
    quizPick.value = null
    await couple.loadDictQuiz()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '出题失败')
  }
}

function pickQuiz(i: number) {
  if (quizPick.value === null) {
    quizPick.value = i
  }
}

async function onRoll() {
  try {
    await couple.rollSweet(Math.floor(Math.random() * 1_000_000))
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '生成失败')
  }
}

async function onCopySweet() {
  try {
    await navigator.clipboard.writeText(couple.sweetLine)
    ElMessage.success('已复制，去私聊发给 TA 💬')
  } catch {
    ElMessage.info('复制失败，手动复制一下～')
  }
}

async function onLoadRadio() {
  try {
    await couple.loadGoodnightRadio()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '电台打不开')
  }
}

onMounted(() => {
  void couple.loadComm()
})
</script>

<style scoped>
.fun-talk {
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
.guess-word {
  margin: 0 0 8px;
  font-size: 14px;
}
.guess-word b {
  color: var(--el-color-danger, #f56c6c);
}
.clue-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}
.guess-describe,
.guess-answer {
  margin-bottom: 10px;
}
.clue-show {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 700;
  color: var(--el-color-primary, #409eff);
}
.guess-hist {
  margin-top: 10px;
  border-top: 1px dashed var(--el-border-color-lighter, #ebeef5);
  padding-top: 8px;
}
.guess-hist-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  margin-bottom: 4px;
}
.guess-day {
  color: var(--im-muted, #8f959e);
  flex-shrink: 0;
}
.guess-pair {
  flex: 1;
  min-width: 0;
}
.story {
  padding: 10px;
  border-radius: 8px;
  background: var(--im-hover, #f5f7fa);
  margin-bottom: 8px;
}
.story-lines {
  margin-bottom: 8px;
}
.story-line {
  margin: 2px 0;
  font-size: 13px;
}
.story-who {
  font-weight: 700;
  color: var(--el-color-danger, #f56c6c);
}
.story-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}
.story-wait {
  margin: 0;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.story-new {
  display: flex;
  gap: 8px;
  margin-top: 6px;
}
.quiz-word {
  margin: 0 0 8px;
  font-size: 14px;
}
.quiz-word b {
  color: var(--el-color-danger, #f56c6c);
}
.quiz-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: stretch;
  margin-bottom: 8px;
}
.quiz-opt {
  margin: 0 !important;
  justify-content: flex-start;
}
.quiz-verdict {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: var(--el-color-success, #67c23a);
}
.sweet-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.sweet-line {
  margin: 0;
  padding: 10px;
  border-radius: 8px;
  background: var(--el-color-danger-light-9, #fef0f0);
  font-size: 14px;
  min-height: 20px;
}
.sweet-actions {
  display: flex;
  gap: 8px;
}
.radio-song {
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 700;
}
.radio-reason {
  margin: 0 0 4px;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.radio-line {
  margin: 0 0 8px;
  font-size: 13px;
  color: var(--el-text-color-regular, #606266);
}
</style>

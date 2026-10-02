<template>
  <div class="couple-coach" data-testid="couple-coach">
    <!-- F156 早安能量站 -->
    <div v-if="morning" class="card" data-testid="couple-morning">
      <h4 class="title">🌤️ 早安能量站 <span class="sub">今天的幸运色：{{ morning.luckyColor }}</span></h4>
      <p class="morning-greeting" data-testid="couple-morning-greeting">{{ morning.greeting }}</p>
      <p class="morning-lucky">🍀 今日幸运小事：{{ morning.luckyThing }}</p>
    </div>

    <!-- F150 21天习惯搭子 -->
    <div class="card" data-testid="couple-streak">
      <h4 class="title">🌱 21天习惯搭子 <span class="sub">TA 盯着的日子，总不好意思偷懒</span></h4>
      <div v-for="h in streakList" :key="h.id" class="streak-item" :data-testid="`couple-streak-${h.id}`">
        <span class="streak-title">{{ h.status === 'DONE' ? '🌳' : '🌱' }} {{ h.title }}</span>
        <span class="streak-by">{{ h.mine ? '我的习惯' : 'TA 的习惯' }}</span>
        <el-progress
          class="streak-progress"
          :percentage="Math.min(100, Math.round((h.doneDays / h.targetDays) * 100))"
          :status="h.status === 'DONE' ? 'success' : undefined"
        />
        <span class="streak-count">{{ h.doneDays }}/{{ h.targetDays }} 天</span>
        <el-tag v-if="h.status === 'DONE'" size="small" type="success">已达成</el-tag>
        <el-button
          v-else-if="h.mine && !h.doneToday"
          size="small" type="primary"
          :data-testid="`couple-streak-checkin-${h.id}`"
          @click="onCheckinStreak(h.id)"
        >
          今日打卡 ✅
        </el-button>
        <el-tag v-else-if="h.mine && h.doneToday" size="small">今日已打卡</el-tag>
      </div>
      <div v-if="!streakList.some((h) => h.mine && h.status === 'OPEN')" class="inline-form">
        <el-input v-model="streakTitle" maxlength="60" placeholder="立一个习惯（每天读书 30 分钟）" data-testid="couple-streak-title" />
        <el-input-number v-model="streakTarget" :min="3" :max="100" data-testid="couple-streak-target" />
        <el-button size="small" type="primary" data-testid="couple-streak-create" @click="onCreateStreak">开始挑战 🌱</el-button>
      </div>
    </div>

    <!-- F151 感恩便签墙 -->
    <div class="card" data-testid="couple-thanks">
      <h4 class="title">💌 感恩便签墙 <span class="sub">把「理所当然」写回「谢谢」</span></h4>
      <div class="inline-form">
        <el-input v-model="thanksDraft" maxlength="200" placeholder="今天谢谢 TA 什么？" data-testid="couple-thanks-input" @keyup.enter="onAddThanks" />
        <el-button size="small" type="primary" data-testid="couple-thanks-add" @click="onAddThanks">贴上去 💌</el-button>
      </div>
      <div class="note-wall">
        <p v-for="t in thanksList" :key="t.id" class="note-item" :data-testid="`couple-thanks-${t.id}`">
          {{ t.mine ? '我谢 TA' : 'TA 谢我' }}：{{ t.content }}
        </p>
      </div>
    </div>

    <!-- F152 情绪颗粒度日记 -->
    <div class="card" data-testid="couple-feel">
      <h4 class="title">🌤️ 情绪颗粒度日记 <span class="sub">把「不开心」说具体，情绪词汇量越大越少吵架</span></h4>
      <div class="feel-families">
        <div v-for="f in feelFamilies" :key="f.family" class="feel-family">
          <p class="feel-family-name">{{ f.emoji }} {{ f.family }}</p>
          <el-tag
            v-for="w in f.words"
            :key="w"
            size="small"
            class="feel-word"
            :type="feelToday?.mine?.word === w ? 'danger' : 'info'"
            :data-testid="`couple-feel-word-${w}`"
            @click="onPickFeelWord(w)"
          >
            {{ w }}
          </el-tag>
        </div>
      </div>
      <el-input v-model="feelNote" maxlength="200" placeholder="一句注脚（可空）" data-testid="couple-feel-note" />
      <div v-if="feelToday?.mine" class="feel-mine" data-testid="couple-feel-mine">
        我今天：<el-tag size="small" type="danger">{{ feelToday.mine.word }}</el-tag>（强度 {{ feelToday.mine.intensity }}/5）
      </div>
      <div v-if="feelToday?.partner" class="feel-partner" data-testid="couple-feel-partner">
        TA 今天：<el-tag size="small">{{ feelToday.partner.word }}</el-tag>
        <span v-if="feelToday.partner.note">「{{ feelToday.partner.note }}」</span>
        <span class="feel-tip">—— 去问问为什么吧，被关心的心情会被放大 🫶</span>
      </div>
    </div>

    <!-- F153 每周高光互评 -->
    <div class="card" data-testid="couple-week-star">
      <h4 class="title">⭐ 每周高光互评 <span class="sub">每周提名对方最闪光的瞬间</span></h4>
      <div class="inline-form">
        <el-input v-model="weekStarDraft" maxlength="200" placeholder="TA 这周的高光瞬间（主动做了早饭）" data-testid="couple-week-star-input" />
        <el-button size="small" type="primary" data-testid="couple-week-star-save" @click="onSaveWeekStar">提名 ⭐</el-button>
      </div>
      <p v-if="weekStar?.mine" class="star-line" data-testid="couple-week-star-mine">我提名 TA：{{ weekStar.mine.highlight }}</p>
      <p v-if="weekStar?.partner" class="star-line" data-testid="couple-week-star-partner">TA 提名我：{{ weekStar.partner.highlight }}</p>
    </div>

    <!-- F154 共读一分钟 -->
    <div class="card" data-testid="couple-read">
      <h4 class="title">📖 共读一分钟 <span class="sub">读同一段文字，是在精神里散步</span></h4>
      <p v-if="read" class="read-passage" data-testid="couple-read-passage">{{ read.passage }}</p>
      <div class="inline-form">
        <el-input v-model="readDraft" maxlength="200" placeholder="写一句今天的感想" data-testid="couple-read-input" />
        <el-button size="small" type="primary" data-testid="couple-read-save" @click="onSaveRead">记下来 📖</el-button>
      </div>
      <p v-if="read?.mine" class="read-line" data-testid="couple-read-mine">我的感想：{{ read.mine.thought }}</p>
      <p v-if="read?.partner" class="read-line" data-testid="couple-read-partner">TA 的感想：{{ read.partner.thought }}</p>
    </div>

    <!-- F155 拖延互助所 -->
    <div class="card" data-testid="couple-delay">
      <h4 class="title">🙈 拖延互助所 <span class="sub">成年人的自律，需要一个盯着你的爱人</span></h4>
      <div class="inline-form">
        <el-input v-model="delayTitle" maxlength="100" placeholder="拖着没做的那件事（去体检）" data-testid="couple-delay-input" />
        <el-button size="small" type="primary" data-testid="couple-delay-add" @click="onAddDelay">交出去 🙈</el-button>
      </div>
      <div v-for="d in delayList" :key="d.id" class="delay-item" :data-testid="`couple-delay-${d.id}`">
        <span class="delay-title">{{ d.status === 'DONE' ? '✅' : '⏰' }} {{ d.title }}</span>
        <span class="delay-by">{{ d.mine ? '我立的事' : 'TA 立的事' }}</span>
        <el-tag v-if="d.status === 'DONE'" size="small" type="success">完成！</el-tag>
        <template v-else>
          <span class="delay-nags">被催 {{ d.nagCount }} 次</span>
          <el-button v-if="!d.mine" size="small" type="warning" plain :data-testid="`couple-delay-nag-${d.id}`" @click="onNagDelay(d.id)">
            催 TA ⏰
          </el-button>
          <el-button v-else size="small" type="success" plain :data-testid="`couple-delay-done-${d.id}`" @click="onDoneDelay(d.id)">
            办完啦 🎉
          </el-button>
        </template>
      </div>
    </div>

    <!-- F157 情侣自习室（纯前端番茄钟） -->
    <div class="card" data-testid="couple-study">
      <h4 class="title">🧑‍🏫 情侣自习室 <span class="sub">25 分钟专注，TA 陪你一起学</span></h4>
      <div class="study-timer">
        <p class="study-clock" data-testid="couple-study-clock">{{ studyMinutes }}:{{ String(studySeconds).padStart(2, '0') }}</p>
        <el-button v-if="!studyRunning" size="small" type="primary" data-testid="couple-study-start" @click="startStudy">开始专注 🍅</el-button>
        <el-button v-else size="small" type="warning" plain data-testid="couple-study-stop" @click="stopStudy()">休息一下 ☕</el-button>
        <span class="study-rounds">已完成 {{ studyRounds }} 个番茄钟</span>
      </div>
      <p class="study-tip">{{ studyRunning ? '专注中：TA 也在另一头学习，不许摸鱼哦 👀' : '点开始，25 分钟后回来找 TA 报告进度' }}</p>
    </div>

    <!-- F158 优点存折 -->
    <div class="card" data-testid="couple-praise-bank">
      <h4 class="title">🏦 优点存折 <span class="sub">生气时先取三条利息，再决定要不要吵架</span></h4>
      <div class="inline-form">
        <el-input v-model="praiseDraft" maxlength="200" placeholder="存一个 TA 的优点（吵架从不翻旧账）" data-testid="couple-praise-input" />
        <el-input v-model="praiseScene" maxlength="60" placeholder="场景（吵架时读）" style="max-width: 140px" data-testid="couple-praise-scene" />
        <el-button size="small" type="primary" data-testid="couple-praise-add" @click="onAddPraise">存入 🏦</el-button>
      </div>
      <div class="note-wall">
        <p v-for="p in praiseList" :key="p.id" class="note-item" :data-testid="`couple-praise-${p.id}`">
          {{ p.mine ? '我存的' : 'TA 存的' }}：{{ p.content }}<span v-if="p.scene">（{{ p.scene }}）</span>
        </p>
      </div>
    </div>

    <!-- F159 成长年度关键词 -->
    <div class="card" data-testid="couple-year">
      <h4 class="title">🗓️ 成长年度关键词 <span class="sub">坚持力 / 感恩力 / 觉察力</span></h4>
      <el-button size="small" type="primary" plain data-testid="couple-year-load" @click="onLoadYear">
        生成 {{ currentYear }} 关键词 ✨
      </el-button>
      <div v-if="yearKeyword" class="year-result" data-testid="couple-year-result">
        <p class="year-word">{{ yearKeyword.keyword }}</p>
        <p class="year-summary">{{ yearKeyword.summary }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useCoupleStore } from '@/stores/couple'

const couple = useCoupleStore()

const morning = computed(() => couple.coachMorning)
const streakList = computed(() => couple.streaks)
const thanksList = computed(() => couple.thanksNotes)
const feelFamilies = computed(() => couple.coachFeelFamilies)
const feelToday = computed(() => couple.coachFeelToday)
const weekStar = computed(() => couple.coachWeekStar)
const read = computed(() => couple.coachRead)
const delayList = computed(() => couple.delayTasks)
const praiseList = computed(() => couple.praiseBankList)
const yearKeyword = computed(() => couple.coachYearKeyword)

const currentYear = new Date().getFullYear()

// 表单状态
const streakTitle = ref('')
const streakTarget = ref(21)
const thanksDraft = ref('')
const feelNote = ref('')
const weekStarDraft = ref('')
const readDraft = ref('')
const delayTitle = ref('')
const praiseDraft = ref('')
const praiseScene = ref('')

// F157 纯前端番茄钟
const studyMinutes = ref(25)
const studySeconds = ref(0)
const studyRunning = ref(false)
const studyRounds = ref(0)
let studyTimer: ReturnType<typeof setInterval> | null = null

function startStudy() {
  if (studyRunning.value) return
  studyMinutes.value = 25
  studySeconds.value = 0
  studyRunning.value = true
  studyTimer = setInterval(() => {
    if (studySeconds.value > 0) {
      studySeconds.value -= 1
      return
    }
    if (studyMinutes.value > 0) {
      studyMinutes.value -= 1
      studySeconds.value = 59
      return
    }
    stopStudy(true)
  }, 1000)
}

function stopStudy(finished = false) {
  if (studyTimer) {
    clearInterval(studyTimer)
    studyTimer = null
  }
  studyRunning.value = false
  if (finished) {
    studyRounds.value += 1
    ElMessage.success('🍅 一个番茄钟完成！去告诉 TA 你的进度吧')
  }
  studyMinutes.value = 25
  studySeconds.value = 0
}

onBeforeUnmount(() => {
  if (studyTimer) clearInterval(studyTimer)
})

async function onCreateStreak() {
  if (!streakTitle.value.trim()) {
    ElMessage.warning('先给习惯起个名字吧')
    return
  }
  try {
    await couple.createStreak(streakTitle.value, streakTarget.value)
    streakTitle.value = ''
    ElMessage.success('挑战开始，TA 会当你的监督员 🌱')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '创建失败')
  }
}

async function onCheckinStreak(id: string) {
  try {
    await couple.checkinStreak(id)
    ElMessage.success('打卡成功，离达成又近一天 ✅')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '打卡失败')
  }
}

async function onAddThanks() {
  if (!thanksDraft.value.trim()) {
    ElMessage.warning('感谢先写一句 🙏')
    return
  }
  try {
    await couple.addThanksNote(thanksDraft.value)
    thanksDraft.value = ''
    ElMessage.success('便签贴上墙啦 💌')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '保存失败')
  }
}

async function onPickFeelWord(word: string) {
  try {
    await couple.saveCoachFeel(word, 3, feelNote.value.trim() || undefined)
    feelNote.value = ''
    ElMessage.success('今天的心情已经记下 🌤️')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '保存失败')
  }
}

async function onSaveWeekStar() {
  if (!weekStarDraft.value.trim()) {
    ElMessage.warning('本周高光先写一句 🌟')
    return
  }
  try {
    await couple.saveCoachWeekStar(weekStarDraft.value)
    weekStarDraft.value = ''
    ElMessage.success('提名成功，等 TA 的高光回礼 ⭐')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '保存失败')
  }
}

async function onSaveRead() {
  if (!readDraft.value.trim()) {
    ElMessage.warning('共读先写一句 📚')
    return
  }
  try {
    await couple.saveCoachRead(readDraft.value)
    readDraft.value = ''
    ElMessage.success('感想已记录 📖')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '保存失败')
  }
}

async function onAddDelay() {
  if (!delayTitle.value.trim()) {
    ElMessage.warning('拖延的事先写一件 ⏰')
    return
  }
  try {
    await couple.addDelayTask(delayTitle.value)
    delayTitle.value = ''
    ElMessage.success('已交给 TA 监督，跑不掉了 🙈')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '登记失败')
  }
}

async function onNagDelay(id: string) {
  try {
    await couple.nagDelayTask(id)
    ElMessage.success('催办已送达 ⏰')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '催办失败')
  }
}

async function onDoneDelay(id: string) {
  try {
    await couple.doneDelayTask(id)
    ElMessage.success('撒花！拖延互助所 +1 战绩 🎉')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '操作失败')
  }
}

async function onAddPraise() {
  if (!praiseDraft.value.trim()) {
    ElMessage.warning('优点存折先写一条 🌟')
    return
  }
  try {
    await couple.addPraiseBankItem(praiseDraft.value, praiseScene.value.trim() || undefined)
    praiseDraft.value = ''
    praiseScene.value = ''
    ElMessage.success('已存入优点存折 🏦')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '保存失败')
  }
}

async function onLoadYear() {
  try {
    await couple.loadYearKeyword()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '生成失败')
  }
}

onMounted(async () => {
  try {
    await couple.loadCoach()
  } catch {
    // 未建立空间等场景：静默
  }
})
</script>

<style scoped>
.couple-coach { display: flex; flex-direction: column; gap: 14px; }
.card { background: var(--im-panel-bg, #fff); border-radius: 10px; padding: 14px 16px; border: 1px solid var(--im-border, #ebeef5); }
.title { margin: 0 0 10px; font-size: 15px; color: var(--im-text, #303133); }
.sub { font-size: 12px; color: var(--im-muted, #909399); font-weight: normal; margin-left: 6px; }
.inline-form { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-bottom: 8px; }
.inline-form .el-input { flex: 1; min-width: 160px; }
.morning-greeting { margin: 0 0 4px; font-size: 16px; color: #f56c6c; font-weight: bold; }
.morning-lucky { margin: 0; font-size: 13px; color: var(--im-muted, #909399); }
.streak-item { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 6px 0; border-bottom: 1px dashed var(--im-border, #ebeef5); }
.streak-item:last-of-type { border-bottom: none; }
.streak-title { color: var(--im-text, #303133); font-weight: bold; }
.streak-by { font-size: 12px; color: var(--im-muted, #909399); }
.streak-progress { flex: 1; min-width: 120px; }
.streak-count { font-size: 12px; color: var(--im-muted, #909399); }
.note-wall { display: flex; flex-direction: column; gap: 6px; margin-top: 6px; }
.note-item { margin: 0; font-size: 13px; color: var(--im-text, #303133); background: var(--im-bg, #fafafa); border-radius: 6px; padding: 6px 10px; }
.feel-families { display: flex; flex-direction: column; gap: 8px; margin-bottom: 8px; }
.feel-family-name { margin: 0 0 4px; font-size: 12px; color: var(--im-muted, #909399); }
.feel-word { margin: 0 6px 4px 0; cursor: pointer; }
.feel-word:hover { border-color: #f56c6c; color: #f56c6c; }
.feel-mine, .feel-partner { margin-top: 8px; font-size: 13px; color: var(--im-text, #303133); display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.feel-tip { color: var(--im-muted, #909399); font-size: 12px; }
.star-line, .read-line { margin: 4px 0; font-size: 13px; color: var(--im-text, #303133); }
.read-passage { margin: 0 0 8px; font-size: 14px; line-height: 1.8; color: var(--im-text, #303133); background: var(--im-bg, #fafafa); border-radius: 8px; padding: 10px 12px; }
.delay-item { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 6px 0; border-bottom: 1px dashed var(--im-border, #ebeef5); }
.delay-item:last-of-type { border-bottom: none; }
.delay-title { color: var(--im-text, #303133); font-weight: bold; }
.delay-by, .delay-nags { font-size: 12px; color: var(--im-muted, #909399); }
.study-timer { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.study-clock { margin: 0; font-size: 32px; font-weight: bold; color: #f56c6c; font-variant-numeric: tabular-nums; }
.study-rounds { font-size: 12px; color: var(--im-muted, #909399); }
.study-tip { margin: 6px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.year-result { margin-top: 8px; text-align: center; }
.year-word { margin: 0 0 4px; font-size: 24px; font-weight: bold; color: #f56c6c; }
.year-summary { margin: 0; font-size: 13px; color: var(--im-muted, #909399); }
</style>

<template>
  <div class="couple-distance" data-testid="couple-distance">
    <!-- F110 隔空牵手 -->
    <div class="card" data-testid="couple-handhold">
      <h4 class="title">🤝 隔空牵手 <span class="sub">一天一握，握紧不放</span></h4>
      <div class="hold-stage">
        <span class="hand" :class="{ lit: hh?.todayMine }">🖐️</span>
        <span class="hold-link">{{ hh?.todayBoth ? '牵住啦' : hh?.todayPartner ? 'TA 已伸手' : '还没牵手' }}</span>
        <span class="hand" :class="{ lit: hh?.todayPartner }">🤚</span>
      </div>
      <el-button
        type="primary"
        :disabled="hh?.todayMine"
        data-testid="couple-handhold-hold"
        @click="onHold"
      >
        {{ hh?.todayMine ? '今天已牵手' : '点亮今天的手' }}
      </el-button>
      <p v-if="hh" class="hold-total" data-testid="couple-handhold-total">
        已累计牵手 <b>{{ hh.totalDays }}</b> 天
      </p>
      <p v-if="hh?.milestone" class="milestone" data-testid="couple-handhold-milestone">{{ hh.milestone }}</p>
      <div v-if="hh?.recent?.length" class="hist">
        <el-tag v-for="d in hh.recent.slice(0, 6)" :key="d.id" size="small" type="info">
          {{ d.day.slice(5) }} {{ d.holdA && d.holdB ? '🤝' : '…' }}
        </el-tag>
      </div>
    </div>

    <!-- F111 双城时刻（复用 cityCard 数据，甜话点缀） -->
    <div v-if="cityCard" class="card" data-testid="couple-twin-time">
      <h4 class="title">🌆 双城时刻 <span class="sub">同一轮太阳，两个时区</span></h4>
      <p class="twin-line" data-testid="couple-twin-time-line">
        我这里 {{ myTime }} · {{ cityCard.partnerCity || 'TA 的城市' }} {{ partnerTime }}
        {{ partnerHour === null ? '' : twinLine }}
      </p>
    </div>

    <!-- F112 想念计量所 -->
    <div class="card" data-testid="couple-miss">
      <h4 class="title">💞 想念计量所 <span class="sub">今天想你了，想被同样想我的人看见</span></h4>
      <div class="hold-stage">
        <span class="hand" :class="{ lit: ms?.todayMine }">💗</span>
        <span class="hold-link">{{ ms?.todayBoth ? '双向奔赴！' : ms?.todayPartner ? 'TA 正在想你' : '思念待点亮' }}</span>
        <span class="hand" :class="{ lit: ms?.todayPartner }">💗</span>
      </div>
      <el-button
        type="danger"
        plain
        :disabled="ms?.todayMine"
        data-testid="couple-miss-light"
        @click="onLightMiss"
      >
        {{ ms?.todayMine ? '今天已想TA' : '点亮「今天想你了」' }}
      </el-button>
      <p v-if="ms" class="hold-total" data-testid="couple-miss-both-times">
        双向奔赴 <b>{{ ms.bothTimes }}</b> 次
      </p>
      <p v-if="ms?.milestone" class="milestone" data-testid="couple-miss-milestone">{{ ms.milestone }}</p>
    </div>

    <!-- F113 见面能量瓶 -->
    <div class="card" data-testid="couple-energy">
      <h4 class="title">🫙 见面能量瓶 <span class="sub">离上次见面越久越满，见面自动归零</span></h4>
      <template v-if="en">
        <el-progress
          :percentage="en.energy"
          :stroke-width="14"
          status="warning"
          data-testid="couple-energy-bar"
        />
        <p class="energy-line" data-testid="couple-energy-line">
          {{ en.daysSince === null ? en.line : `距上次见面 ${en.daysSince} 天 · ` + en.line }}
        </p>
      </template>
      <el-button v-else size="small" plain data-testid="couple-energy-load" @click="onLoadEnergy">看看能量 🫙</el-button>
    </div>

    <!-- F114 我们的作息表 -->
    <div class="card" data-testid="couple-routine">
      <h4 class="title">⏰ 我们的作息表 <span class="sub">重叠的时段，就是我们的时间</span></h4>
      <div class="routine-grid">
        <div class="routine-col">
          <p class="routine-label">我的作息</p>
          <el-time-picker v-model="myWake" format="HH:mm" placeholder="起床" class="routine-picker" data-testid="couple-routine-wake" />
          <el-time-picker v-model="myWorkStart" format="HH:mm" placeholder="上班/上课" class="routine-picker" data-testid="couple-routine-workstart" />
          <el-time-picker v-model="myWorkEnd" format="HH:mm" placeholder="下班/下课" class="routine-picker" data-testid="couple-routine-workend" />
          <el-time-picker v-model="mySleep" format="HH:mm" placeholder="睡觉" class="routine-picker" data-testid="couple-routine-sleep" />
          <el-button size="small" type="primary" plain data-testid="couple-routine-save" @click="onSaveRoutine">保存我的作息</el-button>
        </div>
        <div class="routine-col">
          <p class="routine-label">TA 的作息</p>
          <template v-if="rt?.partner">
            <p class="routine-readonly">🌅 {{ rt.partner.wakeTime }}</p>
            <p class="routine-readonly">💼 {{ rt.partner.workStart }} – {{ rt.partner.workEnd }}</p>
            <p class="routine-readonly">🌙 {{ rt.partner.sleepTime }}</p>
          </template>
          <p v-else class="routine-empty">TA 还没填哦，去提醒一下吧～</p>
        </div>
      </div>
      <div v-if="rt?.overlaps?.length" class="overlap-row" data-testid="couple-routine-overlaps">
        <el-tag v-for="(o, i) in rt.overlaps" :key="i" type="success" size="small">
          🫧 都有空：{{ o.start }} – {{ o.end }}
        </el-tag>
      </div>
    </div>

    <!-- F115 下次见面信 -->
    <div class="card" data-testid="couple-reunion-letter">
      <h4 class="title">✉️ 下次见面信 <span class="sub">见面打卡后才能拆</span></h4>
      <el-input
        v-model="letterDraft"
        type="textarea"
        :rows="2"
        maxlength="300"
        show-word-limit
        placeholder="写给见面那天的 TA……（见面记一笔后这封信才能拆）"
        data-testid="couple-letter-input"
      />
      <el-button
        class="mt8"
        size="small"
        type="primary"
        data-testid="couple-letter-send"
        @click="onWriteLetter"
      >
        封存这封信 💌
      </el-button>
      <div v-if="lt.length" class="letter-list">
        <div v-for="l in lt" :key="l.id" class="letter-item" data-testid="couple-letter-item">
          <span class="letter-from">{{ l.mine ? '我写的' : 'TA 写的' }}</span>
          <el-tag v-if="l.status === 'SEELED'" size="small" type="warning">未拆</el-tag>
          <el-tag v-else size="small" type="success">已拆</el-tag>
          <span v-if="l.content" class="letter-content">{{ l.content }}</span>
          <span v-else class="letter-content sealed">🔒 内容封存中，见面后拆开</span>
          <el-button
            v-if="l.canOpen"
            size="small"
            type="success"
            plain
            :data-testid="`couple-letter-open-${l.id}`"
            @click="onOpenLetter(l.id)"
          >
            拆信 🎉
          </el-button>
        </div>
      </div>
    </div>

    <!-- F116 云约会清单 -->
    <div class="card" data-testid="couple-cloud-date">
      <h4 class="title">☁️ 云约会清单 <span class="sub">距离隔开的是城市，隔不开的是一起做事</span></h4>
      <div class="idea-row">
        <el-tag
          v-for="idea in ideas"
          :key="idea"
          class="idea-tag"
          size="small"
          :data-testid="`couple-cloud-idea-${idea.slice(0, 4)}`"
          @click="onAddCloud(idea)"
        >
          + {{ idea.slice(0, 12) }}{{ idea.length > 12 ? '…' : '' }}
        </el-tag>
        <el-tag size="small" type="primary" data-testid="couple-cloud-idea-random" @click="onAddCloud()">🎲 灵感抽一个</el-tag>
      </div>
      <el-input
        v-model="cloudDraft"
        maxlength="100"
        placeholder="或者自己想一个（连麦看老照片？）"
        data-testid="couple-cloud-input"
        @keyup.enter="onAddCloud(cloudDraft)"
      />
      <div v-if="cd.length" class="cloud-list">
        <div v-for="c in cd" :key="c.id" class="cloud-item" data-testid="couple-cloud-item">
          <span class="cloud-item-text">{{ c.item }}</span>
          <template v-if="c.status === 'OPEN'">
            <el-button size="small" type="success" plain :data-testid="`couple-cloud-done-${c.id}`" @click="onDoneCloud(c.id)">
              完成 ✓
            </el-button>
          </template>
          <el-tag v-else size="small" type="success">已完成{{ c.doneNote ? '：' + c.doneNote : '' }}</el-tag>
        </div>
      </div>
    </div>

    <!-- F117 平安卡 -->
    <div class="card" data-testid="couple-safety">
      <h4 class="title">🛡️ 平安卡 <span class="sub">每一次出发与到达，都有人惦记</span></h4>
      <div class="safety-row">
        <el-button type="warning" plain data-testid="couple-safety-goout" @click="onPing('GO_OUT')">🚕 出发了</el-button>
        <el-button type="success" plain data-testid="couple-safety-arrive" @click="onPing('ARRIVE')">🏠 到家啦</el-button>
      </div>
      <el-input
        v-model="safetyNote"
        maxlength="100"
        placeholder="附带一句（车上人多，慢点开）"
        data-testid="couple-safety-note"
      />
      <div v-if="sf.length" class="safety-list">
        <div v-for="s in sf.slice(0, 5)" :key="s.id" class="safety-item" data-testid="couple-safety-item">
          <span>{{ s.kind === 'GO_OUT' ? '🚕' : '🏠' }}</span>
          <span class="safety-who">{{ s.fromUser === auth.username ? '我' : 'TA' }}</span>
          <span v-if="s.note" class="safety-note">{{ s.note }}</span>
          <span class="safety-time">{{ fmtTime(s.created) }}</span>
        </div>
      </div>
    </div>

    <!-- F118 见面日记 -->
    <div class="card" data-testid="couple-reunion-log">
      <h4 class="title">📅 见面日记 <span class="sub">每一次见面都值得记账</span></h4>
      <div class="reunion-row">
        <el-date-picker
          v-model="reunionDay"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="见面是哪天？"
          :disabled-date="(d: Date) => d.getTime() > Date.now()"
          data-testid="couple-reunion-day"
        />
        <el-input
          v-model="reunionNote"
          maxlength="200"
          placeholder="这次最难忘的瞬间（可空）"
          data-testid="couple-reunion-note"
        />
        <el-button type="primary" size="small" data-testid="couple-reunion-add" @click="onLogReunion">记一笔 ✍️</el-button>
      </div>
      <div v-if="rl.length" class="reunion-list">
        <div v-for="g in rl" :key="g.id" class="reunion-item" data-testid="couple-reunion-item">
          <span class="reunion-day">📆 {{ g.meetDay }}</span>
          <el-tag v-if="g.intervalDays !== null" size="small" type="info">隔了 {{ g.intervalDays }} 天</el-tag>
          <span v-if="g.note" class="reunion-note">{{ g.note }}</span>
        </div>
      </div>
    </div>

    <!-- F119 异地恋报告 -->
    <div class="card" data-testid="couple-distance-report">
      <h4 class="title">📊 异地恋报告 <span class="sub">距离从没拦住你们</span></h4>
      <template v-if="rp">
        <div class="report-grid">
          <div class="report-cell"><b data-testid="couple-report-days">{{ rp.totalDays }}</b><span>在一起天数</span></div>
          <div class="report-cell"><b data-testid="couple-report-meets">{{ rp.meetCount }}</b><span>见面次数</span></div>
          <div class="report-cell"><b data-testid="couple-report-avg">{{ rp.avgIntervalDays ?? '—' }}</b><span>平均间隔(天)</span></div>
          <div class="report-cell"><b data-testid="couple-report-miss">{{ rp.missBothDays }}</b><span>双向奔赴</span></div>
          <div class="report-cell"><b data-testid="couple-report-hold">{{ rp.handholdDays }}</b><span>牵手天数</span></div>
          <div class="report-cell"><b data-testid="couple-report-cloud">{{ rp.cloudDoneCount }}</b><span>云约会完成</span></div>
        </div>
        <p class="report-summary" data-testid="couple-report-summary">{{ rp.summary }}</p>
      </template>
      <el-button v-else size="small" plain data-testid="couple-report-load" @click="onLoadReport">生成报告 📊</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useCoupleStore } from '@/stores/couple'
import { useAuthStore } from '@/stores/auth'

const couple = useCoupleStore()
const auth = useAuthStore()

function pad(n: number) {
  return String(n).padStart(2, '0')
}

const hh = computed(() => couple.handhold)
const ms = computed(() => couple.missDaily)
const rt = computed(() => couple.routine)
const lt = computed(() => couple.reunionLetters)
const cd = computed(() => couple.cloudDates)
const sf = computed(() => couple.safeties)
const rl = computed(() => couple.reunionLogs)
const en = computed(() => couple.energy)
const rp = computed(() => couple.distanceReport)

const letterDraft = ref('')
const cloudDraft = ref('')
const safetyNote = ref('')
const reunionDay = ref('')
const reunionNote = ref('')
const myWake = ref<Date | null>(null)
const myWorkStart = ref<Date | null>(null)
const myWorkEnd = ref<Date | null>(null)
const mySleep = ref<Date | null>(null)

/** 云约会灵感（与后端灵感库一致的常用子集，点击即添加） */
const ideas = [
  '连麦看同一部电影',
  '视频一起吃晚饭',
  '同时听同一首歌',
  '连麦一起打游戏',
  '各自拍下当时的天空',
  '连线一起做饭',
  '睡前连麦读书',
  '互寄一封手写信',
]

/** 双城时刻：按对方当地时间挑一句甜话 */
const twinLine = computed(() => {
  const h = partnerHour.value
  if (h === null) return ''
  if (h >= 5 && h < 9) return '——TA 那边的太阳刚升起，替我道个早安 ☀️'
  if (h >= 9 && h < 12) return '——上午好呀，记得喝水 🥤'
  if (h >= 12 && h < 14) return '——午休了，眯一会儿别太累 🍚'
  if (h >= 14 && h < 18) return '——下午的阳光很好，想分享给你 🌤️'
  if (h >= 18 && h < 22) return '——晚上啦，晚饭吃了什么？🌆'
  return '——夜深了，早点睡，梦里见 🌙'
})
const cityCard = computed(() => couple.cityCard)
const myTime = computed(() => {
  const now = new Date()
  return `${pad(now.getHours())}:${pad(now.getMinutes())}`
})
const partnerTime = computed(() => {
  const diff = cityCard.value?.hoursDiff
  if (diff === null || diff === undefined) return ''
  const d = new Date(Date.now() + diff * 3600 * 1000)
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
})
const partnerHour = computed(() => {
  const diff = cityCard.value?.hoursDiff
  if (diff === null || diff === undefined) return null
  return (((new Date().getHours() + diff) % 24) + 24) % 24
})

function toHm(d: Date | null): string | null {
  if (!d) return null
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function fromHm(hm: string): Date {
  const [h, m] = hm.split(':').map(Number)
  const d = new Date()
  d.setHours(h, m, 0, 0)
  return d
}

function fillRoutineInputs() {
  const r = couple.routine?.mine
  if (!r) return
  myWake.value = fromHm(r.wakeTime)
  myWorkStart.value = fromHm(r.workStart)
  myWorkEnd.value = fromHm(r.workEnd)
  mySleep.value = fromHm(r.sleepTime)
}

function fmtTime(ms: number) {
  const d = new Date(ms)
  return `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

async function onHold() {
  try {
    await couple.holdHand()
    ElMessage.success('手牵上啦，今天也是贴贴的一天 🤝')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '牵手失败')
  }
}

async function onLightMiss() {
  try {
    await couple.lightMiss()
    ElMessage.success('已点亮「今天想你了」💗')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '点亮失败')
  }
}

async function onSaveRoutine() {
  const wake = toHm(myWake.value)
  const start = toHm(myWorkStart.value)
  const end = toHm(myWorkEnd.value)
  const sleep = toHm(mySleep.value)
  if (!wake || !start || !end || !sleep) {
    ElMessage.warning('四个时间都要填哦')
    return
  }
  try {
    await couple.saveRoutine(wake, start, end, sleep)
    ElMessage.success('作息已保存，我们的时间叠好了 ⏰')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '保存失败')
  }
}

async function onWriteLetter() {
  if (!letterDraft.value.trim()) return
  try {
    await couple.writeLetter(letterDraft.value)
    letterDraft.value = ''
    ElMessage.success('信已封存，见面那天记得拆 ✉️')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '写信失败')
  }
}

async function onOpenLetter(id: string) {
  try {
    await couple.openLetter(id)
    ElMessage.success('信拆开啦 💌')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '拆信失败')
  }
}

async function onAddCloud(item?: string) {
  const text = (item ?? cloudDraft.value).trim()
  cloudDraft.value = ''
  try {
    await couple.addCloudDate(text || undefined)
    ElMessage.success(text ? '云约会已加入清单 ☁️' : '从灵感库抽了一个 ☁️')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '添加失败')
  }
}

async function onDoneCloud(id: string) {
  try {
    await couple.doneCloudDate(id)
    ElMessage.success('云约会完成，又一起做了一件事 ✓')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '打卡失败')
  }
}

async function onPing(kind: string) {
  try {
    await couple.pingSafety(kind, safetyNote.value.trim() || undefined)
    safetyNote.value = ''
    ElMessage.success(kind === 'GO_OUT' ? '已报平安：出发啦 🚕' : '已报平安：到家啦 🏠')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '发送失败')
  }
}

async function onLogReunion() {
  if (!reunionDay.value) {
    ElMessage.warning('选一下见面日期')
    return
  }
  try {
    await couple.logReunion(reunionDay.value, reunionNote.value.trim() || undefined)
    reunionDay.value = ''
    reunionNote.value = ''
    ElMessage.success('见面日记 +1，能量瓶充满归零啦 📅')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '记录失败')
  }
}

async function onLoadEnergy() {
  try {
    await couple.loadDistance()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '加载失败')
  }
}

async function onLoadReport() {
  await onLoadEnergy()
}

onMounted(async () => {
  try {
    await couple.loadDistance()
    fillRoutineInputs()
  } catch {
    // 未建立空间等场景：静默
  }
})
</script>

<style scoped>
.couple-distance { display: flex; flex-direction: column; gap: 14px; }
.card { background: var(--im-panel-bg, #fff); border-radius: 10px; padding: 14px 16px; border: 1px solid var(--im-border, #ebeef5); }
.title { margin: 0 0 10px; font-size: 15px; color: var(--im-text, #303133); }
.sub { font-size: 12px; color: var(--im-muted, #909399); font-weight: normal; margin-left: 6px; }
.hold-stage { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
.hand { font-size: 26px; opacity: 0.35; filter: grayscale(1); transition: all 0.3s; }
.hand.lit { opacity: 1; filter: none; transform: scale(1.15); }
.hold-link { font-size: 13px; color: var(--im-muted, #909399); }
.hold-total { font-size: 13px; color: var(--im-text, #303133); margin: 8px 0 0; }
.milestone { font-size: 13px; color: #f56c6c; margin: 6px 0 0; }
.hist { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
.twin-line { margin: 0; font-size: 14px; color: var(--im-text, #303133); }
.energy-line { margin: 8px 0 0; font-size: 13px; color: var(--im-text, #303133); }
.routine-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.routine-label { font-size: 13px; font-weight: bold; margin: 0 0 6px; color: var(--im-text, #303133); }
.routine-picker { width: 100%; margin-bottom: 6px; }
.routine-readonly { margin: 0 0 6px; font-size: 13px; color: var(--im-text, #303133); }
.routine-empty { font-size: 12px; color: var(--im-muted, #909399); }
.overlap-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
.letter-list, .cloud-list, .safety-list, .reunion-list { margin-top: 10px; display: flex; flex-direction: column; gap: 6px; }
.letter-item { display: flex; align-items: center; gap: 8px; font-size: 13px; flex-wrap: wrap; }
.letter-from { color: var(--im-muted, #909399); min-width: 48px; }
.letter-content { color: var(--im-text, #303133); flex: 1; min-width: 120px; }
.letter-content.sealed { color: var(--im-muted, #909399); }
.idea-row { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
.idea-tag { cursor: pointer; }
.cloud-item { display: flex; align-items: center; gap: 8px; font-size: 13px; }
.cloud-item-text { flex: 1; color: var(--im-text, #303133); }
.safety-row { display: flex; gap: 10px; margin-bottom: 8px; }
.safety-item { display: flex; align-items: center; gap: 8px; font-size: 13px; }
.safety-who { color: var(--im-muted, #909399); }
.safety-note { color: var(--im-text, #303133); flex: 1; }
.safety-time { color: var(--im-muted, #909399); font-size: 12px; }
.reunion-row { display: flex; gap: 8px; flex-wrap: wrap; }
.reunion-item { display: flex; align-items: center; gap: 8px; font-size: 13px; flex-wrap: wrap; }
.reunion-day { color: var(--im-text, #303133); }
.reunion-note { color: var(--im-muted, #909399); }
.report-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.report-cell { text-align: center; padding: 8px 0; background: var(--im-bg, #fafafa); border-radius: 8px; }
.report-cell b { display: block; font-size: 18px; color: #f56c6c; }
.report-cell span { font-size: 12px; color: var(--im-muted, #909399); }
.report-summary { margin: 10px 0 0; font-size: 13px; color: var(--im-text, #303133); line-height: 1.6; }
.mt8 { margin-top: 8px; }
</style>

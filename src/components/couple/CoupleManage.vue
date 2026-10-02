<template>
  <div class="couple-manage" data-testid="couple-manage">
    <!-- F180 家庭会议 -->
    <div class="card" data-testid="couple-meeting">
      <h4 class="title">🪑 家庭会议 <span class="sub">一周一次，把话说在桌面上</span></h4>
      <div class="inline-form">
        <el-input v-model="topicDraft" maxlength="100" placeholder="这周想聊什么？（议题）" data-testid="couple-meeting-topic" />
        <el-date-picker
          v-model="followDayDraft"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="跟进日（可空）"
          style="width: 150px"
          data-testid="couple-meeting-follow"
        />
        <el-button size="small" type="primary" data-testid="couple-meeting-add" @click="onAddMeeting">开谈 🪑</el-button>
      </div>
      <p v-if="!openMeetings.length && !closedMeetings.length" class="empty-line">本周还没有议题，开一个吧 🪑</p>
      <div v-for="m in openMeetings" :key="m.id" class="item-block" :data-testid="`couple-meeting-${m.id}`">
        <p class="flash-line">
          <b>{{ m.topic }}</b>
          <span class="flash-by">{{ m.mine ? '我提的' : 'TA 提的' }} · 第 {{ m.week }} 周<span v-if="m.followDay"> · 跟进 {{ m.followDay.slice(5) }}</span></span>
        </p>
        <p v-if="m.decision" class="decision-line">结论：{{ m.decision }}</p>
        <div class="inline-form">
          <el-input v-model="decisionDrafts[m.id]" maxlength="200" placeholder="记个结论（谁做什么）" :data-testid="`couple-meeting-decision-input-${m.id}`" />
          <el-button size="small" plain :data-testid="`couple-meeting-decision-${m.id}`" @click="onDecideMeeting(m)">记结论</el-button>
          <el-button size="small" type="warning" plain :data-testid="`couple-meeting-close-${m.id}`" @click="onCloseMeeting(m)">散会 ✅</el-button>
        </div>
      </div>
      <p v-if="closedMeetings.length" class="closed-line" data-testid="couple-meeting-closed">
        已散会：
        <span v-for="m in closedMeetings" :key="m.id" class="closed-item">{{ m.topic }}<span v-if="m.decision">（{{ m.decision }}）</span></span>
      </p>
    </div>

    <!-- F181 本周主理人 -->
    <div class="card" data-testid="couple-host">
      <h4 class="title">👑 本周主理人 <span class="sub">一周一个人当家，说了算也干得了</span></h4>
      <template v-if="host">
        <p class="host-line" data-testid="couple-host-name">
          第 {{ host.week }} 周当家：<b>{{ host.mine ? '我 👑' : host.host }}</b>
        </p>
        <p class="host-plan" data-testid="couple-host-plan">{{ host.plan ? `本周小计划：${host.plan}` : '本周还没排小计划' }}</p>
        <div v-if="host.mine" class="inline-form">
          <el-input v-model="planDraft" maxlength="100" placeholder="这周安排点什么？（吃什么/去哪玩）" data-testid="couple-host-plan-input" />
          <el-button size="small" type="primary" data-testid="couple-host-plan-save" @click="onSaveHostPlan">排上 👑</el-button>
        </div>
        <p v-else class="empty-line">这周 TA 当家，等 TA 排计划就行～</p>
      </template>
      <p v-else class="empty-line">主理人还没轮值出来…</p>
    </div>

    <!-- F182 技能交换所 -->
    <div class="card" data-testid="couple-skill">
      <h4 class="title">🔧 技能交换所 <span class="sub">我教你做菜，你教我拍照，谁也不亏</span></h4>
      <div class="inline-form">
        <el-input v-model="teachDraft" maxlength="50" placeholder="我会的（包一顿饺子）" data-testid="couple-skill-teach" />
        <el-input v-model="learnDraft" maxlength="50" placeholder="想学的（修电脑）" data-testid="couple-skill-learn" />
        <el-button size="small" type="primary" data-testid="couple-skill-add" @click="onAddSkill">挂牌 🔧</el-button>
      </div>
      <p v-if="!skills.length" class="empty-line">还没有交换挂牌，各亮一手吧 🔧</p>
      <p v-for="s in skills" :key="s.id" class="flash-line" :data-testid="`couple-skill-${s.id}`">
        <b>{{ s.teach }}</b> ⇄ <b>{{ s.learn }}</b>
        <span class="flash-by">{{ s.mine ? '我挂的' : 'TA 挂的' }} · {{ skillStatusText[s.status] }}</span>
        <el-button v-if="s.status === 'OPEN' && !s.mine" size="small" plain :data-testid="`couple-skill-take-${s.id}`" @click="onTakeSkill(s)">接单 🙋</el-button>
        <el-button v-if="s.status === 'TAKEN'" size="small" type="success" plain :data-testid="`couple-skill-done-${s.id}`" @click="onDoneSkill(s)">学成了 🎓</el-button>
      </p>
    </div>

    <!-- F183 月度互评 -->
    <div class="card" data-testid="couple-monthly">
      <h4 class="title">🌙 月度互评 <span class="sub">这个月我给爱情打几星，TA 又怎么评我？</span></h4>
      <template v-if="month">
        <div v-if="!month.mine" class="inline-form" data-testid="couple-month-form">
          <span class="star-label">本月评星：</span>
          <el-rate v-model="starsDraft" :max="5" data-testid="couple-month-rate" />
          <el-input v-model="adviceDraft" maxlength="200" placeholder="想对 TA 说的一句改进建议（可空）" data-testid="couple-month-advice" />
          <el-button size="small" type="primary" data-testid="couple-month-submit" @click="onSaveMonthReview">提交 🌙</el-button>
        </div>
        <p v-else class="pair-line" data-testid="couple-month-mine">
          我的评星：<span class="stars">{{ '★'.repeat(month.mine.stars) }}{{ '☆'.repeat(5 - month.mine.stars) }}</span>
          <span v-if="month.mine.advice"> · {{ month.mine.advice }}</span>
        </p>
        <p v-if="month.bothDone && month.partner" class="pair-line" data-testid="couple-month-partner">
          TA 的评星：<span class="stars">{{ '★'.repeat(month.partner.stars) }}{{ '☆'.repeat(5 - month.partner.stars) }}</span>
          <span v-if="month.partner.advice"> · {{ month.partner.advice }}</span>
        </p>
        <p v-else class="empty-line" data-testid="couple-month-placeholder">互相评完才能看到 TA 的星 🌙</p>
      </template>
    </div>

    <!-- F184 家庭应急卡 -->
    <div class="card" data-testid="couple-emergency">
      <h4 class="title">🚨 家庭应急卡 <span class="sub">平时用不上，用时救大命</span></h4>
      <div class="textarea-form">
        <el-input v-model="contactsDraft" type="textarea" :rows="2" maxlength="300" placeholder="紧急联系人（爸妈电话、120…）" data-testid="couple-emergency-contacts" />
        <el-input v-model="keysDraft" type="textarea" :rows="2" maxlength="300" placeholder="钥匙备用存放点" data-testid="couple-emergency-keys" />
        <el-input v-model="medicineDraft" type="textarea" :rows="2" maxlength="300" placeholder="常用药放哪、过敏史" data-testid="couple-emergency-medicine" />
        <el-button size="small" type="primary" data-testid="couple-emergency-save" @click="onSaveEmergency">立卡 🚨</el-button>
      </div>
      <p v-if="!emergency.length" class="empty-line">还没有应急卡，趁平静时写下吧 🚨</p>
      <div v-for="(c, ci) in emergency" :key="ci" class="item-block" :data-testid="`couple-emergency-${ci}`">
        <p class="flash-line"><span class="flash-by">{{ c.mine ? '我立的' : 'TA 立的' }} · {{ fmtDate(c.updatedAt) }}</span></p>
        <p v-if="c.contacts" class="emergency-line">👤 {{ c.contacts }}</p>
        <p v-if="c.keysPlace" class="emergency-line">🔑 {{ c.keysPlace }}</p>
        <p v-if="c.medicine" class="emergency-line">💊 {{ c.medicine }}</p>
      </div>
    </div>

    <!-- F185 情侣存档点 -->
    <div class="card" data-testid="couple-snapshot">
      <h4 class="title">💾 情侣存档点 <span class="sub">每个月存一次档，回头看才知道走了多远</span></h4>
      <div class="inline-form">
        <el-input-number v-model="snapTempDraft" :min="0" :max="100" size="small" data-testid="couple-snapshot-temp" />
        <span class="star-label">恋爱温度</span>
        <el-input v-model="snapWorkDraft" maxlength="100" placeholder="工作近况一句话" data-testid="couple-snapshot-work" />
        <el-input v-model="snapHealthDraft" maxlength="100" placeholder="健康近况一句话" data-testid="couple-snapshot-health" />
        <el-button size="small" type="primary" data-testid="couple-snapshot-save" @click="onSaveSnapshot">存档 💾</el-button>
      </div>
      <p v-if="!snapshots.length" class="empty-line">还没有存档点，先存一个吧 💾</p>
      <p v-for="s in snapshots" :key="s.id" class="flash-line" :data-testid="`couple-snapshot-${s.id}`">
        <b>{{ s.month }}</b>
        <span class="flash-by">{{ s.mine ? '我存的' : 'TA 存的' }}</span>
        🌡️ {{ s.loveTemp }}°
        <template v-if="s.work"> · 工作：{{ s.work }}</template>
        <template v-if="s.health"> · 健康：{{ s.health }}</template>
      </p>
    </div>

    <!-- F186 家务积分市场 -->
    <div class="card" data-testid="couple-point">
      <h4 class="title">🧾 家务积分市场 <span class="sub">洗碗不是白洗的，是能换一场电影的</span></h4>
      <p v-if="points" class="point-balance" data-testid="couple-point-balance">
        当前余额：<b>{{ points.balance }}</b> 分 <span class="flash-by">（累计赚取 {{ points.totalEarned }} 分）</span>
      </p>
      <div class="reward-grid" data-testid="couple-point-rewards">
        <div v-for="r in points?.rewards ?? []" :key="r.code" class="reward-cell" :data-testid="`couple-point-reward-${r.code}`">
          <p class="reward-name">{{ r.emoji }} {{ r.name }}</p>
          <p class="reward-points">{{ r.points }} 分</p>
          <el-button size="small" :type="r.affordable ? 'primary' : 'default'" :plain="!r.affordable" :data-testid="`couple-point-redeem-${r.code}`" @click="onRedeem(r)">兑换 🎁</el-button>
        </div>
      </div>
      <div class="inline-form">
        <el-input v-model="earnItemDraft" maxlength="50" placeholder="干了什么？（拖地、倒垃圾…）" data-testid="couple-point-earn-item" />
        <el-input-number v-model="earnPointsDraft" :min="1" :max="50" size="small" data-testid="couple-point-earn-value" />
        <el-button size="small" type="primary" data-testid="couple-point-earn" @click="onEarnPoints">赚分 🧾</el-button>
      </div>
      <p v-if="!points?.history.length" class="empty-line">还没有流水，从一件小家务开始 🧾</p>
      <div v-if="points?.history.length" class="history-list" data-testid="couple-point-history">
        <p v-for="h in points.history.slice(0, 10)" :key="h.id" class="flash-line">
          <span class="flash-by">{{ h.mine ? '我' : 'TA' }} · {{ fmtDate(h.created) }}</span>
          {{ h.item }}
          <b :class="h.type === 'EARN' ? 'earn' : 'spend'">{{ h.type === 'EARN' ? '+' : '-' }}{{ h.points }}</b>
        </p>
      </div>
    </div>

    <!-- F187 五年计划双轨 -->
    <div class="card" data-testid="couple-fiveyear">
      <h4 class="title">🗺️ 五年计划双轨 <span class="sub">你的五年、我的五年、我们的五年</span></h4>
      <div class="inline-form">
        <el-select v-model="planTrackDraft" size="small" style="width: 130px" data-testid="couple-fiveyear-track">
          <el-option label="我的一半" value="MINE" />
          <el-option label="我们的一半" value="OURS" />
        </el-select>
        <el-input v-model="planContentDraft" maxlength="200" placeholder="五年后想成为什么？" data-testid="couple-fiveyear-content" />
        <el-button size="small" type="primary" data-testid="couple-fiveyear-add" @click="onAddPlan">立计划 🗺️</el-button>
      </div>
      <div class="track-cols">
        <div class="track-col" data-testid="couple-fiveyear-mine">
          <p class="track-head">🙋 我的五年</p>
          <p v-if="!minePlans.length" class="empty-line">还没立自己的五年</p>
          <p v-for="p in minePlans" :key="p.id" class="flash-line" :data-testid="`couple-plan-${p.id}`">
            {{ p.content }}
            <span class="flash-by">{{ p.mine ? '我立的' : 'TA 立的' }}</span>
            <el-tag v-if="p.done" size="small" type="success">已达成 🏁</el-tag>
            <el-button v-else size="small" plain :data-testid="`couple-plan-finish-${p.id}`" @click="onFinishPlan(p)">达成 🏁</el-button>
          </p>
        </div>
        <div class="track-col" data-testid="couple-fiveyear-ours">
          <p class="track-head">👫 我们的五年</p>
          <p v-if="!oursPlans.length" class="empty-line">还没立我们的一半</p>
          <p v-for="p in oursPlans" :key="p.id" class="flash-line" :data-testid="`couple-plan-${p.id}`">
            {{ p.content }}
            <span v-if="p.ownerUser" class="flash-by" :data-testid="`couple-plan-owner-${p.id}`">认领人：{{ p.ownerUser }}</span>
            <el-button v-else-if="!p.mine" size="small" type="primary" plain :data-testid="`couple-plan-claim-${p.id}`" @click="onClaimPlan(p)">认领我的一半 🙋</el-button>
            <el-tag v-if="p.done" size="small" type="success">已达成 🏁</el-tag>
            <el-button v-else-if="p.ownerUser" size="small" plain :data-testid="`couple-plan-finish-${p.id}`" @click="onFinishPlan(p)">达成 🏁</el-button>
          </p>
        </div>
      </div>
    </div>

    <!-- F188 纪念日策划案 -->
    <div class="card" data-testid="couple-annivplan">
      <h4 class="title">🎟️ 纪念日策划案 <span class="sub">惊喜不靠灵感，靠提前立项</span></h4>
      <div class="inline-form">
        <el-date-picker
          v-model="annivDayDraft"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="纪念日日期"
          style="width: 150px"
          data-testid="couple-annivplan-day"
        />
        <el-input v-model="annivTitleDraft" maxlength="50" placeholder="主题（在一起三周年）" data-testid="couple-annivplan-title" />
        <el-input v-model="annivIdeaDraft" maxlength="200" placeholder="初步点子" data-testid="couple-annivplan-idea" />
        <el-button size="small" type="primary" data-testid="couple-annivplan-add" @click="onAddAnnivPlan">立项 🎟️</el-button>
      </div>
      <p v-if="!annivPlans.length" class="empty-line">还没有策划案，下一个纪念日提前安排 🎟️</p>
      <p v-for="a in annivPlans" :key="a.id" class="flash-line" :data-testid="`couple-annivplan-${a.id}`">
        <b>{{ a.day.slice(5) }}</b> {{ a.title }}
        <span class="flash-by">{{ a.mine ? '我策划' : 'TA 策划' }}<template v-if="a.idea"> · {{ a.idea }}</template></span>
        <el-tag size="small" :type="annivStatusTag[a.status]">{{ annivStatusText[a.status] }}</el-tag>
        <el-button
          v-if="a.status !== 'DONE'"
          size="small"
          plain
          :type="a.status === 'LOCKED' ? 'success' : 'warning'"
          :data-testid="`couple-annivplan-advance-${a.id}`"
          @click="onAdvanceAnnivPlan(a)"
        >{{ a.status === 'IDEA' ? '定稿 📌' : '落地 🎉' }}</el-button>
      </p>
    </div>

    <!-- F189 经营周报 -->
    <div class="card" data-testid="couple-manage-weekly">
      <h4 class="title">📮 经营周报</h4>
      <p v-if="weekly" class="pair-line" data-testid="couple-manage-weekly-summary">{{ weekly.summary }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { manageApi } from '@/api/couple'
import type {
  CoupleManageAnnivPlanVO,
  CoupleManageEmergencyCardVO,
  CoupleManageFiveYearPlanVO,
  CoupleManageHostVO,
  CoupleManageMeetingVO,
  CoupleManageMonthBoardVO,
  CoupleManagePointAccountVO,
  CoupleManageSkillVO,
  CoupleManageSnapshotVO,
  CoupleManageWeeklyVO,
} from '@/types'

const meetings = ref<CoupleManageMeetingVO[]>([])
const host = ref<CoupleManageHostVO | null>(null)
const skills = ref<CoupleManageSkillVO[]>([])
const month = ref<CoupleManageMonthBoardVO | null>(null)
const emergency = ref<CoupleManageEmergencyCardVO[]>([])
const snapshots = ref<CoupleManageSnapshotVO[]>([])
const points = ref<CoupleManagePointAccountVO | null>(null)
const plans = ref<CoupleManageFiveYearPlanVO[]>([])
const annivPlans = ref<CoupleManageAnnivPlanVO[]>([])
const weekly = ref<CoupleManageWeeklyVO | null>(null)

const openMeetings = computed(() => meetings.value.filter((m) => !m.closed))
const closedMeetings = computed(() => meetings.value.filter((m) => m.closed))
const minePlans = computed(() => plans.value.filter((p) => p.track === 'MINE'))
const oursPlans = computed(() => plans.value.filter((p) => p.track === 'OURS'))

const skillStatusText: Record<CoupleManageSkillVO['status'], string> = {
  OPEN: '待接单',
  TAKEN: '交换中',
  DONE: '已完成 🎓',
}
const annivStatusText: Record<CoupleManageAnnivPlanVO['status'], string> = {
  IDEA: '点子',
  LOCKED: '已定稿',
  DONE: '已落地',
}
const annivStatusTag: Record<CoupleManageAnnivPlanVO['status'], 'info' | 'warning' | 'success'> = {
  IDEA: 'info',
  LOCKED: 'warning',
  DONE: 'success',
}

// ---- 草稿 ----
const topicDraft = ref('')
const followDayDraft = ref('')
const decisionDrafts = ref<Record<string, string>>({})
const planDraft = ref('')
const teachDraft = ref('')
const learnDraft = ref('')
const starsDraft = ref(0)
const adviceDraft = ref('')
const contactsDraft = ref('')
const keysDraft = ref('')
const medicineDraft = ref('')
const snapTempDraft = ref(80)
const snapWorkDraft = ref('')
const snapHealthDraft = ref('')
const earnItemDraft = ref('')
const earnPointsDraft = ref(5)
const planTrackDraft = ref<'MINE' | 'OURS'>('MINE')
const planContentDraft = ref('')
const annivDayDraft = ref('')
const annivTitleDraft = ref('')
const annivIdeaDraft = ref('')

function fmtDate(ts: number) {
  return new Date(ts).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
}

function onError(e: unknown, fallback: string) {
  ElMessage.error(e instanceof Error ? e.message : fallback)
}

// ---- F180 家庭会议 ----
async function onAddMeeting() {
  if (!topicDraft.value.trim()) {
    ElMessage.warning('先写个议题哦')
    return
  }
  try {
    meetings.value = (await manageApi.createMeeting(topicDraft.value.trim(), followDayDraft.value || null)) ?? []
    topicDraft.value = ''
    followDayDraft.value = ''
    ElMessage.success('议题已上桌 🪑')
  } catch (e) {
    onError(e, '提交失败')
  }
}

async function onDecideMeeting(m: CoupleManageMeetingVO) {
  const decision = (decisionDrafts.value[m.id] ?? '').trim() || m.decision
  if (!decision) {
    ElMessage.warning('结论写一句再记哦')
    return
  }
  try {
    meetings.value = (await manageApi.decideMeeting(m.id, decision)) ?? meetings.value
    decisionDrafts.value[m.id] = ''
    ElMessage.success('结论已记下 📝')
  } catch (e) {
    onError(e, '保存失败')
  }
}

async function onCloseMeeting(m: CoupleManageMeetingVO) {
  try {
    meetings.value = (await manageApi.closeMeeting(m.id)) ?? meetings.value
    ElMessage.success('议题散会 ✅')
  } catch (e) {
    onError(e, '关闭失败')
  }
}

// ---- F181 本周主理人 ----
async function onSaveHostPlan() {
  if (!planDraft.value.trim()) {
    ElMessage.warning('计划先写一句 🗓️')
    return
  }
  try {
    host.value = (await manageApi.saveHostPlan(planDraft.value.trim())) ?? host.value
    planDraft.value = ''
    ElMessage.success('本周计划排上了 👑')
  } catch (e) {
    onError(e, '保存失败')
  }
}

// ---- F182 技能交换所 ----
async function onAddSkill() {
  if (!teachDraft.value.trim() || !learnDraft.value.trim()) {
    ElMessage.warning('会什么、想学什么都要写哦')
    return
  }
  try {
    skills.value = (await manageApi.createSkill(teachDraft.value.trim(), learnDraft.value.trim())) ?? []
    teachDraft.value = ''
    learnDraft.value = ''
    ElMessage.success('交换已挂牌 🔧')
  } catch (e) {
    onError(e, '挂牌失败')
  }
}

async function onTakeSkill(s: CoupleManageSkillVO) {
  try {
    skills.value = (await manageApi.takeSkill(s.id)) ?? []
    ElMessage.success('接单成功，开始互相教学 🔧')
  } catch (e) {
    onError(e, '接单失败')
  }
}

async function onDoneSkill(s: CoupleManageSkillVO) {
  try {
    skills.value = (await manageApi.doneSkill(s.id)) ?? []
    ElMessage.success('技能交换完成 🎓')
  } catch (e) {
    onError(e, '操作失败')
  }
}

// ---- F183 月度互评 ----
async function onSaveMonthReview() {
  if (!starsDraft.value) {
    ElMessage.warning('先打个星哦 🌙')
    return
  }
  try {
    month.value = (await manageApi.saveMonthReview(starsDraft.value, adviceDraft.value.trim())) ?? month.value
    adviceDraft.value = ''
    ElMessage.success('本月评价已提交 🌙')
  } catch (e) {
    onError(e, '提交失败')
  }
}

// ---- F184 家庭应急卡 ----
async function onSaveEmergency() {
  if (!contactsDraft.value.trim() && !keysDraft.value.trim() && !medicineDraft.value.trim()) {
    ElMessage.warning('三项里至少填一项哦 🚨')
    return
  }
  try {
    emergency.value =
      (await manageApi.saveEmergencyCard({
        contacts: contactsDraft.value.trim(),
        keysPlace: keysDraft.value.trim(),
        medicine: medicineDraft.value.trim(),
      })) ?? []
    contactsDraft.value = ''
    keysDraft.value = ''
    medicineDraft.value = ''
    ElMessage.success('应急卡已立好 🚨')
  } catch (e) {
    onError(e, '保存失败')
  }
}

// ---- F185 情侣存档点 ----
async function onSaveSnapshot() {
  try {
    snapshots.value =
      (await manageApi.saveSnapshot({
        loveTemp: snapTempDraft.value ?? 0,
        work: snapWorkDraft.value.trim(),
        health: snapHealthDraft.value.trim(),
      })) ?? []
    snapWorkDraft.value = ''
    snapHealthDraft.value = ''
    ElMessage.success('本月已存档 💾')
  } catch (e) {
    onError(e, '存档失败')
  }
}

// ---- F186 家务积分市场 ----
async function onEarnPoints() {
  if (!earnItemDraft.value.trim()) {
    ElMessage.warning('先写干了什么家务')
    return
  }
  try {
    points.value =
      (await manageApi.earnPoints(earnItemDraft.value.trim(), earnPointsDraft.value ?? 5)) ?? points.value
    earnItemDraft.value = ''
    ElMessage.success(`入账 ${earnPointsDraft.value} 分 🧾`)
  } catch (e) {
    onError(e, '记账失败')
  }
}

async function onRedeem(r: CoupleManagePointAccountVO['rewards'][number]) {
  if (!r.affordable) {
    ElMessage.warning(`还差 ${r.points - (points.value?.balance ?? 0)} 分才能换「${r.name}」`)
    return
  }
  try {
    points.value = (await manageApi.redeemPoints(r.code)) ?? points.value
    ElMessage.success(`${r.emoji} 「${r.name}」兑换成功，记得兑现哦 🎁`)
  } catch (e) {
    onError(e, '兑换失败')
  }
}

// ---- F187 五年计划双轨 ----
async function onAddPlan() {
  if (!planContentDraft.value.trim()) {
    ElMessage.warning('策划案先写内容 📋')
    return
  }
  try {
    plans.value = (await manageApi.createFiveYearPlan(planTrackDraft.value, planContentDraft.value.trim())) ?? []
    planContentDraft.value = ''
    ElMessage.success('五年计划已立项 🗺️')
  } catch (e) {
    onError(e, '立项失败')
  }
}

async function onClaimPlan(p: CoupleManageFiveYearPlanVO) {
  try {
    plans.value = (await manageApi.claimFiveYearPlan(p.id)) ?? []
    ElMessage.success('已认领你的一半 🙋')
  } catch (e) {
    onError(e, '认领失败')
  }
}

async function onFinishPlan(p: CoupleManageFiveYearPlanVO) {
  try {
    plans.value = (await manageApi.finishFiveYearPlan(p.id)) ?? []
    ElMessage.success('达成！写进我们的故事里 🏁')
  } catch (e) {
    onError(e, '操作失败')
  }
}

// ---- F188 纪念日策划案 ----
async function onAddAnnivPlan() {
  if (!annivDayDraft.value || !annivTitleDraft.value.trim()) {
    ElMessage.warning('日期和主题都要填哦')
    return
  }
  try {
    annivPlans.value =
      (await manageApi.createAnnivPlan({
        day: annivDayDraft.value,
        title: annivTitleDraft.value.trim(),
        idea: annivIdeaDraft.value.trim(),
      })) ?? []
    annivDayDraft.value = ''
    annivTitleDraft.value = ''
    annivIdeaDraft.value = ''
    ElMessage.success('策划案已立项 🎟️')
  } catch (e) {
    onError(e, '立项失败')
  }
}

async function onAdvanceAnnivPlan(a: CoupleManageAnnivPlanVO) {
  try {
    annivPlans.value = (await manageApi.advanceAnnivPlan(a.id)) ?? []
    ElMessage.success(a.status === 'IDEA' ? '方案已定稿 📌' : '纪念日已落地执行 🎉')
  } catch (e) {
    onError(e, '推进失败')
  }
}

// ---- 初始加载 ----
async function safeLoad<T>(loader: () => Promise<T>, fallback: T): Promise<T> {
  try {
    const data = await loader()
    return data ?? fallback
  } catch {
    // 未建立空间等场景：静默
    return fallback
  }
}

onMounted(async () => {
  const [m, h, s, mo, e, sn, po, fp, ap, w] = await Promise.all([
    safeLoad(manageApi.meetings, []),
    safeLoad(manageApi.host, null),
    safeLoad(manageApi.skills, []),
    safeLoad(manageApi.monthReviews, null),
    safeLoad(manageApi.emergencyCards, []),
    safeLoad(manageApi.snapshots, []),
    safeLoad(manageApi.points, null),
    safeLoad(manageApi.fiveYearPlans, []),
    safeLoad(manageApi.annivPlans, []),
    safeLoad(manageApi.weekly, null),
  ])
  meetings.value = m
  host.value = h
  skills.value = s
  month.value = mo
  emergency.value = e
  snapshots.value = sn
  points.value = po
  plans.value = fp
  annivPlans.value = ap
  weekly.value = w
})
</script>

<style scoped>
.couple-manage { display: flex; flex-direction: column; gap: 14px; }
.card { background: var(--im-panel-bg, #fff); border-radius: 10px; padding: 14px 16px; border: 1px solid var(--im-border, #ebeef5); }
.title { margin: 0 0 10px; font-size: 15px; color: var(--im-text, #303133); }
.sub { font-size: 12px; color: var(--im-muted, #909399); font-weight: normal; margin-left: 6px; }
.inline-form { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 8px; }
.inline-form .el-input { flex: 1; min-width: 160px; }
.textarea-form { display: flex; flex-direction: column; gap: 8px; }
.item-block { margin-top: 6px; padding: 6px 8px; background: var(--im-bg, #fafafa); border-radius: 8px; }
.flash-line { margin: 4px 0; font-size: 13px; color: var(--im-text, #303133); }
.flash-by { font-size: 11px; color: var(--im-muted, #909399); margin-right: 6px; }
.decision-line { margin: 2px 0; font-size: 12px; color: #67c23a; }
.closed-line { margin: 8px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.closed-item { margin-right: 10px; }
.empty-line { margin: 8px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.host-line { margin: 4px 0; font-size: 14px; color: var(--im-text, #303133); }
.host-plan { margin: 2px 0; font-size: 13px; color: var(--im-text, #303133); }
.pair-line { margin: 6px 0; font-size: 13px; color: var(--im-text, #303133); line-height: 1.8; }
.stars { color: #e6a23c; letter-spacing: 2px; }
.star-label { font-size: 13px; color: var(--im-muted, #909399); }
.emergency-line { margin: 2px 0; font-size: 13px; color: var(--im-text, #303133); white-space: pre-wrap; }
.point-balance { margin: 4px 0; font-size: 14px; color: var(--im-text, #303133); }
.reward-grid { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 8px; }
.reward-cell { border: 1px dashed var(--im-border, #ebeef5); border-radius: 8px; padding: 8px 10px; text-align: center; min-width: 120px; }
.reward-name { margin: 0; font-size: 13px; color: var(--im-text, #303133); }
.reward-points { margin: 2px 0 6px; font-size: 12px; color: #e6a23c; }
.history-list { margin-top: 8px; }
.earn { color: #67c23a; }
.spend { color: #f56c6c; }
.track-cols { display: flex; gap: 14px; flex-wrap: wrap; margin-top: 8px; }
.track-col { flex: 1; min-width: 220px; }
.track-head { margin: 0 0 4px; font-size: 13px; font-weight: bold; color: var(--im-text, #303133); }
</style>

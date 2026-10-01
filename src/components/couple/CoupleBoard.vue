<template>
  <div class="couple-board" data-testid="couple-board">
    <!-- F240 部门与任命：给 TA 封官 + 本人盖章上任 -->
    <div class="card" data-testid="couple-bd-org">
      <h4 class="title">🖋️ 部门与任命 <span class="sub">「我们公司」今日就职：把偏爱写成任命书</span></h4>
      <template v-if="o">
        <p v-if="!o.roles.length" class="empty-line">编制还空着，先给 TA 封一个在家的职位？🖋️</p>
        <div class="role-list">
          <p v-for="r in o.roles" :key="r.id" class="role-line" :data-testid="`couple-bd-role-${r.id}`">
            <b class="role-title">{{ r.title }}</b>
            <span class="flash-by">{{ r.mine ? '我发起 🙋' : `来自 ${r.fromUser}` }} → 任命给 {{ r.toUser }}</span>
            <template v-if="r.appointed">
              <span class="office-badge" :data-testid="`couple-bd-role-done-${r.id}`">已上任 ✅</span>
            </template>
            <template v-else-if="!r.mine">
              <el-button size="small" type="primary" :data-testid="`couple-bd-appoint-${r.id}`" @click="onAppoint(r)">盖章上任 🖋️</el-button>
            </template>
            <span v-else class="wait-chip" :data-testid="`couple-bd-role-wait-${r.id}`">等 TA 亲手盖章</span>
          </p>
        </div>
        <div class="inline-form">
          <el-input v-model="roleDraft" maxlength="60" placeholder="封个什么职位（如财政部长 / 晚安总工程师）" data-testid="couple-bd-role-title" />
          <el-button size="small" type="primary" data-testid="couple-bd-role-submit" @click="onProposeRole">封官 🖋️</el-button>
        </div>
      </template>
      <p v-else class="empty-line">人事部还在建档…</p>
    </div>

    <!-- F241 董事会：议案表决 + 新议案 + 已决留痕 -->
    <div class="card" data-testid="couple-bd-board">
      <h4 class="title">🏛️ 董事会 <span class="sub">大事不开口吵，开庭审议、全票通过</span></h4>
      <template v-if="o">
        <p class="section-head">📌 在议议案</p>
        <p v-if="!pendingVotes.length" class="empty-line">董事会暂无议事，提交一件大事提案试试 🏛️</p>
        <div class="vote-list">
          <p v-for="v in pendingVotes" :key="v.id" class="vote-line" :data-testid="`couple-bd-pending-${v.id}`">
            <b>{{ v.title }}</b>
            <span class="flash-by">提案人：{{ v.mine ? '我 🙋' : v.proposer }}</span>
            <template v-if="v.canVote">
              <el-button size="small" type="success" :data-testid="`couple-bd-vote-pass-${v.id}`" @click="onDecide(v.id, true)">附议通过 ✅</el-button>
              <el-button size="small" type="danger" plain :data-testid="`couple-bd-vote-veto-${v.id}`" @click="onDecide(v.id, false)">一票否决 ✗</el-button>
            </template>
            <span v-else-if="v.mine" class="wait-chip" :data-testid="`couple-bd-vote-wait-${v.id}`">等 TA 表决中（自己的议案不能自己裁）</span>
          </p>
        </div>
        <div class="inline-form">
          <el-input v-model="voteDraft" maxlength="140" placeholder="议案写一件大事（如：下周末去看海）" data-testid="couple-bd-vote-title" />
          <el-button size="small" type="primary" data-testid="couple-bd-vote-submit" @click="onProposeVote">提交议案 🏛️</el-button>
        </div>
        <div class="scroll-box" data-testid="couple-bd-vote-history">
          <p class="section-head">🗂️ 已决留痕（{{ decidedVotes.length }}）</p>
          <p v-if="!decidedVotes.length" class="empty-line">决议簿还是空白页，等第一案落槌 🔨</p>
          <p v-for="v in decidedVotes" :key="v.id" class="vote-line is-decided" :data-testid="`couple-bd-vote-${v.id}`">
            <span :class="v.status === 'PASSED' ? 'pass-badge' : 'veto-badge'" :data-testid="`couple-bd-vote-status-${v.id}`">
              {{ v.status === 'PASSED' ? '全票通过 ✓' : '一票否决 ✗' }}
            </span>
            <b>{{ v.title }}</b>
            <span class="flash-by">{{ v.mine ? '我 🙋' : v.proposer }} 提案{{ v.vetoBy && v.status === 'VETOED' ? ` · ${v.vetoBy} 否决` : '' }}</span>
          </p>
        </div>
      </template>
      <p v-else class="empty-line">董事会还在开箱…</p>
    </div>

    <!-- F242 年度述职：本人提交/改写 + 双份互见 -->
    <div class="card" data-testid="couple-bd-report">
      <h4 class="title">📑 {{ o?.report.year ?? '今年' }} 年度述职 <span class="sub">像模像样地总结这一年，再立一个小目标</span></h4>
      <template v-if="o">
        <div class="report-mine" data-testid="couple-bd-report-mine">
          <p class="section-head">🙋 我的述职{{ o.report.mineReview ? '（写了还能改）' : '' }}</p>
          <el-input
            v-model="reviewDraft"
            type="textarea"
            :rows="3"
            maxlength="500"
            show-word-limit
            placeholder="这一年我们一起做成了什么？多写点也没关系"
            data-testid="couple-bd-report-review"
          />
          <el-input
            v-model="goalDraft"
            maxlength="200"
            placeholder="明年想达成什么小目标？（如：一起爬一次山）"
            class="goal-input"
            data-testid="couple-bd-report-goal"
          />
          <div class="inline-form report-submit">
            <el-button size="small" type="primary" data-testid="couple-bd-report-submit" @click="onReport">
              {{ o.report.mineReview ? '改写年度述职 ✍️' : '提交述职 📑' }}
            </el-button>
          </div>
        </div>
        <div class="report-partner" data-testid="couple-bd-report-partner">
          <p class="section-head">💕 TA 的述职</p>
          <template v-if="o.report.bothIn">
            <p class="report-text" data-testid="couple-bd-report-partner-review">「{{ o.report.partnerReview }}」</p>
            <p class="goal-line" data-testid="couple-bd-report-partner-goal">🎯 明年小目标：{{ o.report.partnerGoal }}</p>
            <p class="both-badge" data-testid="couple-bd-report-both">两份都交齐了，年度股东大会圆满结束 🎉</p>
          </template>
          <p v-else class="empty-line">TA 还没交这份述职——交齐两份才能互相看，先保密一年 🤫</p>
        </div>
      </template>
      <p v-else class="empty-line">述职模板还在打印…</p>
    </div>

    <!-- F244+F243 发薪日：感谢工资 + 当月记录 + 职级公示 -->
    <div class="card" data-testid="couple-bd-pay">
      <h4 class="title">💰 发薪日 <span class="sub">本月工资是「一句谢谢 + 5 积分」，一月一发</span></h4>
      <template v-if="o">
        <div v-if="o.salary.mineThanks" class="paid-box" data-testid="couple-bd-salary-paid">
          <p class="paid-line">🙋 我本月已发放：「{{ o.salary.mineThanks }}」</p>
          <p class="empty-line">感谢已到账，下个月再说一遍 🥰</p>
        </div>
        <div v-else class="inline-form">
          <el-input v-model="thanksDraft" maxlength="200" placeholder="谢谢 TA 这个月的哪一件小事？" data-testid="couple-bd-salary-thanks" />
          <el-button size="small" type="primary" data-testid="couple-bd-salary-submit" @click="onSalary">发工资啦 💰</el-button>
        </div>
        <p class="pay-status" data-testid="couple-bd-salary-status">
          <span class="sign-chip" :class="{ 'is-lit': !!o.salary.mineThanks }">{{ o.salary.mineThanks ? '✍️ 我已发放' : '我未发放' }}</span>
          <span class="sign-chip" :class="{ 'is-lit': !!o.salary.partnerThanks }">
            {{ o.salary.partnerThanks ? `💕 TA 已说：「${o.salary.partnerThanks}」` : 'TA 还没发薪' }}
          </span>
          <span v-if="o.salary.bothPaid" class="both-badge" data-testid="couple-bd-salary-both">双工资到账 {{ o.salary.month }} 🎉</span>
          <span class="flash-by">{{ o.salary.payDay ? `本月发薪日 ${o.salary.payDay} 号` : '本月还没人发薪' }} · 累计发薪 {{ o.salary.monthsPaid }} 个月</span>
        </p>
        <p class="section-head">📢 升职公示栏</p>
        <div class="member-list" data-testid="couple-bd-members">
          <p v-for="m in o.members" :key="m.user" class="member-line" :data-testid="`couple-bd-member-${m.user}`">
            <b class="member-rank">{{ m.rank }}</b>
            <span>{{ m.user === authMe ? '我 🙋' : `💕 ${m.user}` }}</span>
            <span v-if="m.titles.length" class="title-chip" :data-testid="`couple-bd-member-titles-${m.user}`">{{ m.titles.join('、') }}</span>
            <span class="flash-by" :data-testid="`couple-bd-member-next-${m.user}`">
              累计 {{ m.earned }} 分{{ m.nextRank && m.pointsToNext != null ? ` · 还差 ${m.pointsToNext} 分升「${m.nextRank}」` : ' · 已是最顶层合伙人 🏆' }}
            </span>
          </p>
        </div>
      </template>
      <p v-else class="empty-line">财务室还在点钞…</p>
    </div>

    <!-- F247+F245+F249+F248 例会与周报：签到双签 + 金点子 + 公司周报 + 名片 -->
    <div class="card" data-testid="couple-bd-weekly">
      <h4 class="title">⏰ 例会与周报 <span class="sub">每天 10 秒双签到开会，点子采纳转决议</span></h4>
      <template v-if="o">
        <div class="attend-row" data-testid="couple-bd-attend">
          <el-button
            size="small"
            type="primary"
            :disabled="o.attend.mineAttended"
            data-testid="couple-bd-attend-btn"
            @click="onAttend"
          >{{ o.attend.mineAttended ? '已签到 ✅' : '例会签到 ⏰' }}</el-button>
          <span class="sign-chip" :class="{ 'is-lit': o.attend.mineAttended }">{{ o.attend.mineAttended ? '我到了' : '我还未到' }}</span>
          <span class="sign-chip" :class="{ 'is-lit': o.attend.partnerAttended }" data-testid="couple-bd-attend-partner">
            {{ o.attend.partnerAttended ? 'TA 到了' : 'TA 还没来' }}
          </span>
          <p v-if="o.attend.convened" class="both-badge" data-testid="couple-bd-attend-convened">10 秒内双签到，今天的例会正式召开 🔔</p>
          <p v-else-if="o.attend.mineAttended && !o.attend.partnerAttended" class="wait-chip" data-testid="couple-bd-attend-wait">
            TA 还没来，等你一起敲钟（10 秒窗口内双签到才算开会）⏳
          </p>
        </div>
        <p class="section-head">💡 本周金点子箱</p>
        <div class="inline-form">
          <el-input v-model="ideaDraft" maxlength="140" placeholder="投一条一句话经营提案（如：周三固定奶茶日）" data-testid="couple-bd-idea-content" />
          <el-button size="small" type="primary" data-testid="couple-bd-idea-submit" @click="onIdea">投入点子 💡</el-button>
        </div>
        <p v-if="!o.ideas.length" class="empty-line">金点子箱还空着，第一条经营妙计由你来写 💡</p>
        <div class="idea-list">
          <p v-for="i in o.ideas" :key="i.id" class="idea-line" :data-testid="`couple-bd-idea-${i.id}`">
            <span class="flash-by">{{ i.mine ? '我 🙋' : `💕 ${i.fromUser}` }}</span>
            <b>{{ i.content }}</b>
            <template v-if="i.adopted">
              <span class="office-badge" :data-testid="`couple-bd-idea-done-${i.id}`">已转决议 ✅</span>
            </template>
            <el-button
              v-else-if="!i.mine"
              size="small"
              type="success"
              plain
              :data-testid="`couple-bd-idea-adopt-${i.id}`"
              @click="onAdoptIdea(i)"
            >采纳这个点子 💡</el-button>
            <span v-else class="wait-chip" :data-testid="`couple-bd-idea-wait-${i.id}`">等 TA 采纳</span>
          </p>
        </div>
        <div class="weekly-box" data-testid="couple-bd-weekly-summary">
          <p class="section-head">📊 {{ o.weekly.week }} 公司周报</p>
          <p class="weekly-line">本周新议案 <b data-testid="couple-bd-weekly-votes">{{ o.weekly.votes }}</b> 件 · 金点子 <b data-testid="couple-bd-weekly-ideas">{{ o.weekly.ideas }}</b> 条 · 全员赚分 <b data-testid="couple-bd-weekly-points">{{ o.weekly.pointsEarned }}</b> 分</p>
        </div>
        <div v-if="o.card.lines.length" class="card-box" data-testid="couple-bd-card">
          <p class="section-head">🪪 我们公司名片</p>
          <p v-for="(line, i) in o.card.lines" :key="i" class="card-line" :data-testid="`couple-bd-card-line-${i}`">{{ line }}</p>
        </div>
      </template>
      <p v-else class="empty-line">例会还在等人…</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { boardApi } from '@/api/couple'
import { useAuthStore } from '@/stores/auth'
import type { CoupleBdIdeaVO, CoupleBdOverviewVO, CoupleBdRoleVO, CoupleBdVoteVO } from '@/types'

const auth = useAuthStore()
const authMe = computed(() => auth.username)

const o = ref<CoupleBdOverviewVO | null>(null)

// ---- 草稿 ----
const roleDraft = ref('')
const voteDraft = ref('')
const reviewDraft = ref('')
const goalDraft = ref('')
const thanksDraft = ref('')
const ideaDraft = ref('')

/** F241 在议与已决分栏 */
const pendingVotes = computed<CoupleBdVoteVO[]>(() => o.value?.votes.filter((v) => v.status === 'PENDING') ?? [])
const decidedVotes = computed<CoupleBdVoteVO[]>(() => o.value?.votes.filter((v) => v.status !== 'PENDING') ?? [])

function onError(e: unknown, fallback: string) {
  ElMessage.error(e instanceof Error ? e.message : fallback)
}

/** 写接口统一返回整份 Overview：整体替换即全卡刷新 */
function refresh(data: CoupleBdOverviewVO | undefined | null) {
  if (data) o.value = data
}

// ---- F240 封官 / 盖章上任 ----
async function onProposeRole() {
  if (!roleDraft.value.trim()) {
    ElMessage.warning('职位叫什么好呢（如财政部长）🖋️')
    return
  }
  try {
    refresh(await boardApi.bdProposeRole(roleDraft.value.trim()))
    roleDraft.value = ''
    ElMessage.success('任命书已发出，就等 TA 盖章上任 🖋️')
  } catch (e) {
    onError(e, '封官失败')
  }
}

async function onAppoint(r: CoupleBdRoleVO) {
  try {
    refresh(await boardApi.bdAppoint(r.id))
    ElMessage.success(`「${r.title}」正式上任！以后请多关照 🤝`)
  } catch (e) {
    onError(e, '盖章失败')
  }
}

// ---- F241 议案 / 表决 ----
async function onProposeVote() {
  if (!voteDraft.value.trim()) {
    ElMessage.warning('议案写一件大事吧 🏛️')
    return
  }
  try {
    refresh(await boardApi.bdProposeVote(voteDraft.value.trim()))
    voteDraft.value = ''
    ElMessage.success('议案已提交董事会，等 TA 落槌 🏛️')
  } catch (e) {
    onError(e, '提交议案失败')
  }
}

async function onDecide(id: string, agree: boolean) {
  try {
    refresh(await boardApi.bdDecide(id, agree))
    ElMessage.success(agree ? '决议全票通过 ✓ 说到做到' : '已一票否决 ✗ 下次提案轻点')
  } catch (e) {
    onError(e, '表决失败')
  }
}

// ---- F242 年度述职（同年可改写） ----
async function onReport() {
  if (!reviewDraft.value.trim()) {
    ElMessage.warning('述职多写点也没关系 📑')
    return
  }
  if (!goalDraft.value.trim()) {
    ElMessage.warning('明年想达成什么小目标？🎯')
    return
  }
  try {
    refresh(await boardApi.bdReport(o.value?.report.year ?? '', reviewDraft.value.trim(), goalDraft.value.trim()))
    ElMessage.success('年度述职已归档，股东大会为你鼓掌 🎉')
  } catch (e) {
    onError(e, '提交述职失败')
  }
}

// ---- F244 发本月感谢工资 ----
async function onSalary() {
  if (!thanksDraft.value.trim()) {
    ElMessage.warning('本月工资是「一句谢谢」，别空着 💰')
    return
  }
  try {
    refresh(await boardApi.bdSalary(thanksDraft.value.trim()))
    thanksDraft.value = ''
    ElMessage.success('感谢工资发放成功，5 积分已入账 💰 明年也续约')
  } catch (e) {
    onError(e, '发薪失败')
  }
}

// ---- F245 金点子 / 采纳 ----
async function onIdea() {
  if (!ideaDraft.value.trim()) {
    ElMessage.warning('金点子就写一句话 💡')
    return
  }
  try {
    refresh(await boardApi.bdIdea(ideaDraft.value.trim()))
    ideaDraft.value = ''
    ElMessage.success('点子已入箱，等待被采纳发光 💡')
  } catch (e) {
    onError(e, '投点子失败')
  }
}

async function onAdoptIdea(i: CoupleBdIdeaVO) {
  try {
    refresh(await boardApi.bdAdoptIdea(i.id))
    ElMessage.success('好点子！已转成董事会议案，走表决流程 ✅')
  } catch (e) {
    onError(e, '采纳失败')
  }
}

// ---- F247 例会签到（10s 双签开会） ----
async function onAttend() {
  try {
    refresh(await boardApi.bdAttend())
    ElMessage.success('签到成功 ⏰ 今天的例会散会前记得说晚安')
  } catch (e) {
    onError(e, '签到失败')
  }
}

// ---- 初始加载：safeLoad 静默降级 ----
async function safeLoad<T>(loader: () => Promise<T>, fallback: T): Promise<T> {
  try {
    const data = await loader()
    return data ?? fallback
  } catch {
    // 未建立空间等场景：静默显示空态
    return fallback
  }
}

onMounted(async () => {
  const overview = await safeLoad(boardApi.bdOverview, null)
  o.value = overview
  if (overview) {
    // 回填我的述职，方便同年改写
    if (overview.report.mineReview) reviewDraft.value = overview.report.mineReview
    if (overview.report.mineGoal) goalDraft.value = overview.report.mineGoal
  }
})
</script>

<style scoped>
.couple-board { display: flex; flex-direction: column; gap: 14px; }
.card { background: var(--im-panel-bg, #fff); border-radius: 10px; padding: 14px 16px; border: 1px solid var(--im-border, #ebeef5); }
/* 主色：公司蓝（区别于粉红/#e6a23c/金红） */
.title { margin: 0 0 10px; font-size: 15px; color: #409eff; }
.sub { font-size: 12px; color: var(--im-muted, #909399); font-weight: normal; margin-left: 6px; }
.section-head { margin: 8px 0 4px; font-size: 13px; font-weight: bold; color: var(--im-text, #303133); }
.inline-form { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 8px; }
.inline-form .el-input { flex: 1; min-width: 160px; }
.goal-input { margin-top: 8px; }
.empty-line { margin: 8px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.flash-by { font-size: 11px; color: var(--im-muted, #909399); margin-right: 6px; }
/* 任命与议案条目 */
.role-list, .vote-list, .idea-list { margin-top: 4px; }
.role-line, .vote-line, .idea-line { margin: 4px 0; font-size: 13px; color: var(--im-text, #303133); display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.role-title { color: #409eff; }
.vote-line b, .idea-line b { color: var(--im-text, #303133); }
.vote-line.is-decided { opacity: 0.85; }
.office-badge { font-size: 11px; color: #67c23a; background: rgba(103, 194, 58, 0.12); padding: 1px 8px; border-radius: 10px; }
.pass-badge { font-size: 11px; color: #67c23a; background: rgba(103, 194, 58, 0.12); padding: 1px 8px; border-radius: 10px; }
.veto-badge { font-size: 11px; color: #f56c6c; background: rgba(245, 108, 108, 0.1); padding: 1px 8px; border-radius: 10px; }
.wait-chip { font-size: 12px; color: #e6a23c; }
.scroll-box { margin-top: 10px; padding-top: 8px; border-top: 1px dashed var(--im-border, #ebeef5); }
/* 述职 */
.report-mine { margin-bottom: 6px; }
.report-mine .el-textarea { margin-top: 4px; }
.report-text { margin: 4px 0; font-size: 13px; color: var(--im-text, #303133); background: var(--im-bg, #fafafa); border-radius: 8px; padding: 6px 10px; }
.goal-line { margin: 4px 0; font-size: 13px; color: #409eff; }
.report-partner { margin-top: 10px; padding-top: 8px; border-top: 1px dashed var(--im-border, #ebeef5); }
.report-submit { margin-top: 8px; }
.both-badge { font-size: 12px; color: #67c23a; font-weight: bold; }
/* 发薪与职级 */
.paid-box { margin-top: 4px; padding: 8px 10px; border-radius: 8px; background: rgba(103, 194, 58, 0.08); border: 1px solid rgba(103, 194, 58, 0.3); }
.paid-line { margin: 0; font-size: 13px; color: var(--im-text, #303133); }
.pay-status { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin: 8px 0 0; }
.sign-chip { font-size: 12px; color: var(--im-muted, #909399); padding: 2px 8px; border-radius: 6px; background: var(--im-bg, #fafafa); }
.sign-chip.is-lit { color: #67c23a; background: rgba(103, 194, 58, 0.1); }
.member-list { margin-top: 4px; }
.member-line { margin: 4px 0; font-size: 13px; color: var(--im-text, #303133); display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.member-rank { color: #409eff; }
.title-chip { font-size: 11px; color: #b8860b; background: rgba(212, 175, 55, 0.12); padding: 1px 8px; border-radius: 10px; }
/* 例会与周报 */
.attend-row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
.weekly-box { margin-top: 10px; padding: 8px 10px; border-radius: 8px; background: rgba(64, 158, 255, 0.06); border: 1px solid rgba(64, 158, 255, 0.25); }
.weekly-line { margin: 4px 0 0; font-size: 13px; color: var(--im-text, #303133); }
.weekly-line b { color: #409eff; }
.card-box { margin-top: 10px; padding: 8px 10px; border-radius: 8px; border: 1px dashed rgba(64, 158, 255, 0.45); background: var(--im-bg, #fafafa); }
.card-line { margin: 2px 0; font-size: 12px; color: var(--im-text, #303133); font-family: monospace; }
</style>

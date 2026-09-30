<template>
  <div class="couple-page">
    <!-- 未建立：指引建立 -->
    <CoupleSetup v-if="!couple.established" />

    <!-- 已建立：空间主页 -->
    <div v-else class="space-page" data-testid="couple-space">
      <!-- 头部：双方头像 + 在一起天数 + 关系操作（互道早安达成 → 当日专属背景自动点亮；否则用空间主题色） -->
      <el-card shadow="never" class="panel header-card" :class="{ themed: morningUnlocked }"
               :style="headerBackground">
        <div class="header-row">
          <div class="pair">
            <ImAvatar :name="auth.username" :size="52" halo online />
            <span class="heart">💖</span>
            <ImAvatar
              :name="couple.space!.partner.username"
              :label="couple.space!.partner.nickname"
              :color="couple.space!.partner.avatar"
              :size="52"
              :online="couple.space!.partner.online"
              halo
              data-testid="couple-partner-avatar"
            />
            <div class="pair-names">
              <span class="pair-name" data-testid="couple-partner-name">
                {{ couple.space!.partner.petName || couple.space!.partner.nickname }}
              </span>
              <span class="pair-username">
                @{{ couple.space!.partner.username }}
                <button
                  type="button"
                  class="pet-edit"
                  title="给 TA 起个专属爱称"
                  data-testid="couple-pet-edit"
                  @click="openPetEdit"
                >
                  🏷️ 爱称
                </button>
              </span>
            </div>
          </div>
          <div class="stats">
            <div class="stat">
              <span class="stat-num" data-testid="couple-days">{{ couple.space!.days }}</span>
              <span class="stat-label">在一起的天数</span>
            </div>
            <div class="stat">
              <span class="stat-num" data-testid="couple-header-streak">{{ couple.checkins?.streak ?? 0 }}</span>
              <span class="stat-label">连续互道晚安</span>
            </div>
            <div class="stat">
              <span class="stat-num" data-testid="couple-intimacy-score">{{ couple.intimacy?.score ?? 0 }}</span>
              <span class="stat-label">{{ couple.intimacy ? `${couple.intimacy.icon} ${couple.intimacy.title}` : '心动值' }}</span>
            </div>
          </div>
          <div class="header-actions">
            <el-badge :value="couple.notifyUnread" :hidden="couple.notifyUnread <= 0" :max="99">
              <el-button size="small" plain data-testid="couple-notify-bell" @click="openNotifies">
                🔔 通知
              </el-button>
            </el-badge>
            <el-button size="small" plain data-testid="couple-anniv-edit" @click="openAnnivEdit">
              <el-icon class="btn-ico"><EditPen /></el-icon>纪念日
            </el-button>
            <el-button size="small" type="danger" plain data-testid="couple-dissolve" @click="onDissolve">
              解除关系
            </el-button>
          </div>
        </div>
      </el-card>

      <!-- 主题解锁徽标条：早安点亮背景 / 晚安解锁贴纸 -->
      <div v-if="morningUnlocked || nightUnlocked" class="theme-banner" data-testid="couple-theme-banner">
        <span v-if="morningUnlocked">🌅 今日专属背景已点亮（{{ themeLabel }}）</span>
        <span v-if="nightUnlocked">🌙 今日专属贴纸 {{ themeStickers[0] }} {{ themeStickers[1] }} 已解锁</span>
      </div>

      <!-- F43 里程碑天数：今天是有意义的日子 -->
      <div v-if="milestone" class="milestone-banner" data-testid="couple-milestone-banner">
        🎉 今天是在一起第 <b>{{ milestone }}</b> 天！这个数字值得纪念 💕
      </div>

      <!-- F47 空间周年庆 -->
      <div v-if="spaceBirthday" class="milestone-banner space-birthday" data-testid="couple-space-birthday">
        🎂 我们的空间 <b>{{ spaceBirthday }}</b> 周岁啦！感谢有 TA 陪伴的每一天 🎈
      </div>

      <!-- 空间个性化：我们的宣言 + 装扮入口（宣言/主题/贴纸墙） -->
      <CoupleProfile />

      <!-- F95 今日看点：今天值得做的甜蜜小事 -->
      <CoupleTodayBoard @goto="(tab: string) => (activeTab = tab)" />

      <!-- F98 新手引导：首次进入空间的三步漫游 -->
      <el-dialog
        v-model="guideVisible"
        title="💝 欢迎来到你们的小天地"
        width="380px"
        data-testid="couple-guide-dialog"
      >
        <ol class="guide-list">
          <li>🫶 <b>每天贴贴打卡</b>——早安晚安、求抱抱、双人挑战，坚持就有心动值</li>
          <li>💌 <b>把心意藏起来</b>——时光胶囊、树洞、情话储蓄罐，惊喜要慢慢拆</li>
          <li>📜 <b>回忆都会被记住</b>——编年史、考古卡、热力日历，日子越攒越甜</li>
        </ol>
        <p class="anniv-tip">顶部页签随便逛，这条提示只出现一次～</p>
        <template #footer>
          <el-button type="primary" data-testid="couple-guide-done" @click="closeGuide">开始探索 💕</el-button>
        </template>
      </el-dialog>

      <!-- 逾期可爱提醒：全局常驻（不分页签），一键跳到约定页 -->
      <el-alert
        v-if="couple.overdueCount > 0"
        type="warning"
        :closable="false"
        class="overdue-alert"
        data-testid="couple-overdue-alert"
      >
        <template #title>
          <span class="overdue-line">
            😳 还有 {{ couple.overdueCount }} 件事你没做到哦~
            <el-button link type="primary" size="small" data-testid="couple-overdue-goto" @click="activeTab = 'promises'">
              去看看 →
            </el-button>
          </span>
        </template>
      </el-alert>

      <!-- 三大功能 -->
      <el-card shadow="never" class="panel">
        <el-tabs v-model="activeTab" class="couple-tabs">
          <el-tab-pane label="🫶 贴贴" name="bond" lazy>
            <div class="tab-stack">
              <CoupleBond />
              <CoupleGame />
            </div>
          </el-tab-pane>
          <el-tab-pane label="🤝 约定" name="promises">
            <div class="tab-stack">
              <CouplePromises />
              <CouplePact />
            </div>
          </el-tab-pane>
          <el-tab-pane label="🌅 小仪式" name="rituals" lazy>
            <div class="tab-stack">
              <CoupleRituals />
              <CoupleDaily />
              <CoupleTruth />
            </div>
          </el-tab-pane>
          <el-tab-pane label="🌱 养成" name="growth" lazy>
            <div class="tab-stack">
              <CoupleChallenge />
              <CoupleReadWatch />
              <CoupleWishBoard />
              <CoupleDict />
            </div>
          </el-tab-pane>
          <el-tab-pane label="🎁 惊喜" name="surprise" lazy>
            <div class="tab-stack">
              <CoupleSurprise />
              <CoupleGarden />
            </div>
          </el-tab-pane>
          <el-tab-pane :label="letterTabLabel" name="letters" lazy>
            <div class="tab-stack">
              <CoupleLetter />
              <CoupleWhisperBox />
              <CoupleCapsule />
              <CoupleKeepsake />
            </div>
          </el-tab-pane>
          <el-tab-pane label="💗 心情" name="mood" lazy>
            <CoupleMood />
          </el-tab-pane>
          <el-tab-pane label="🌈 关怀" name="care" lazy>
            <div class="tab-stack">
              <CoupleCare />
              <CoupleComfort />
              <CoupleMakeup />
            </div>
          </el-tab-pane>
          <el-tab-pane label="🗓️ 共享空间" name="shared" lazy>
            <div class="tab-stack">
              <CoupleCityCard />
              <CoupleCountdown />
              <CoupleLife />
              <CoupleShared />
              <CoupleFund />
            </div>
          </el-tab-pane>
          <el-tab-pane label="🏅 徽章" name="badges" lazy>
            <div class="tab-stack">
              <CoupleBadges />
              <CoupleReport />
              <CoupleAnniversaryReport />
              <CoupleHeatmap />
            </div>
          </el-tab-pane>
          <el-tab-pane label="📖 时光轴" name="timeline" lazy>
            <div class="tab-stack">
              <CoupleOnThisDay />
              <CoupleFirsts />
              <CoupleHeartMoments />
              <CoupleTimeline />
              <CoupleChronicle />
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <!-- 修改纪念日弹窗 -->
      <el-dialog v-model="annivEditVisible" title="在一起的纪念日" width="360px" draggable data-testid="couple-anniv-edit-dialog">
        <el-date-picker
          v-model="annivEditDate"
          type="date"
          placeholder="选择你们在一起的日子"
          value-format="YYYY-MM-DD"
          :disabled-date="(d: Date) => d.getTime() > Date.now()"
          class="anniv-picker"
          data-testid="couple-anniv-edit-date"
        />
        <p class="anniv-tip">用于计算「在一起的天数」，双方可见</p>
        <template #footer>
          <el-button @click="annivEditVisible = false">取消</el-button>
          <el-button type="primary" :loading="savingAnniv" data-testid="couple-anniv-edit-save" @click="onSaveAnniv">
            保存
          </el-button>
        </template>
      </el-dialog>

      <!-- F41 通知中心弹窗（F94 增加分类筛选） -->
      <el-dialog v-model="notifyVisible" title="🔔 空间动态通知" width="400px" draggable data-testid="couple-notify-dialog">
        <div class="notify-toolbar">
          <span class="notify-unread" data-testid="couple-notify-unread">{{ couple.notifyUnread }} 条未读</span>
          <el-button size="small" round data-testid="couple-notify-readall" @click="onReadAll">全部已读</el-button>
        </div>
        <div class="notify-filters" data-testid="couple-notify-filters">
          <el-check-tag
            v-for="f in NOTIFY_FILTERS"
            :key="f.key"
            :checked="notifyFilter === f.key"
            :data-testid="`couple-notify-filter-${f.key}`"
            @change="notifyFilter = f.key"
          >
            {{ f.label }}
          </el-check-tag>
        </div>
        <el-empty v-if="!filteredNotifies.length" description="这一类还没有动态～" :image-size="60" />
        <div v-else class="notify-list">
          <div
            v-for="n in filteredNotifies"
            :key="n.id"
            class="notify-item"
            :class="{ unread: !n.read }"
            :data-testid="`couple-notify-${n.event}`"
          >
            <span class="notify-dot">{{ n.read ? '·' : '🔵' }}</span>
            <div class="notify-body">
              <p class="notify-detail">{{ n.detail }}</p>
              <span class="notify-time">{{ formatNotifyTime(n.created) }} · {{ n.actor === 'system' ? '小助手' : 'TA' }}</span>
            </div>
          </div>
        </div>
      </el-dialog>

      <!-- 专属爱称弹窗 -->
      <el-dialog v-model="petEditVisible" title="给 TA 起个专属爱称" width="360px" draggable data-testid="couple-pet-dialog">
        <el-input
          v-model="petEditName"
          maxlength="30"
          show-word-limit
          :placeholder="`比如：宝宝、猪猪、${couple.space?.partner.nickname || '小可爱'}`"
          data-testid="couple-pet-name"
          @keyup.enter="onSavePet"
        />
        <p class="anniv-tip">只有你们俩能看到，空间里 TA 的名字会变成它；留空保存 = 清除爱称</p>
        <template #footer>
          <el-button @click="petEditVisible = false">取消</el-button>
          <el-button type="primary" :loading="savingPet" data-testid="couple-pet-save" @click="onSavePet">
            保存
          </el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { EditPen } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useCoupleStore } from '@/stores/couple'
import { todayBackground as getTodayBackground, todayStickers as getTodayStickers, todayThemeLabel } from '@/utils/coupleTheme'
import ImAvatar from '@/components/im/ImAvatar.vue'
import CoupleSetup from '@/components/couple/CoupleSetup.vue'
import CoupleBond from '@/components/couple/CoupleBond.vue'
import CouplePromises from '@/components/couple/CouplePromises.vue'
import CoupleRituals from '@/components/couple/CoupleRituals.vue'
import CoupleDaily from '@/components/couple/CoupleDaily.vue'
import CoupleCare from '@/components/couple/CoupleCare.vue'
import CoupleCapsule from '@/components/couple/CoupleCapsule.vue'
import CoupleCountdown from '@/components/couple/CoupleCountdown.vue'
import CoupleBadges from '@/components/couple/CoupleBadges.vue'
import CoupleOnThisDay from '@/components/couple/CoupleOnThisDay.vue'
import CoupleLife from '@/components/couple/CoupleLife.vue'
import CoupleProfile from '@/components/couple/CoupleProfile.vue'
import CoupleReport from '@/components/couple/CoupleReport.vue'
import CoupleGame from '@/components/couple/CoupleGame.vue'
import CoupleHeartMoments from '@/components/couple/CoupleHeartMoments.vue'
import CoupleFirsts from '@/components/couple/CoupleFirsts.vue'
import CoupleLetter from '@/components/couple/CoupleLetter.vue'
import CoupleMood from '@/components/couple/CoupleMood.vue'
import CoupleShared from '@/components/couple/CoupleShared.vue'
import CouplePact from '@/components/couple/CouplePact.vue'
import CoupleCityCard from '@/components/couple/CoupleCityCard.vue'
import CoupleFund from '@/components/couple/CoupleFund.vue'
import CoupleTimeline from '@/components/couple/CoupleTimeline.vue'
import CoupleChronicle from '@/components/couple/CoupleChronicle.vue'
import CoupleAnniversaryReport from '@/components/couple/CoupleAnniversaryReport.vue'
import CoupleKeepsake from '@/components/couple/CoupleKeepsake.vue'
import CoupleTodayBoard from '@/components/couple/CoupleTodayBoard.vue'
import CoupleHeatmap from '@/components/couple/CoupleHeatmap.vue'
import CoupleSurprise from '@/components/couple/CoupleSurprise.vue'
import CoupleGarden from '@/components/couple/CoupleGarden.vue'
import CoupleComfort from '@/components/couple/CoupleComfort.vue'
import CoupleMakeup from '@/components/couple/CoupleMakeup.vue'
import CoupleTruth from '@/components/couple/CoupleTruth.vue'
import CoupleWhisperBox from '@/components/couple/CoupleWhisperBox.vue'
import CoupleChallenge from '@/components/couple/CoupleChallenge.vue'
import CoupleReadWatch from '@/components/couple/CoupleReadWatch.vue'
import CoupleWishBoard from '@/components/couple/CoupleWishBoard.vue'
import CoupleDict from '@/components/couple/CoupleDict.vue'

const auth = useAuthStore()
const couple = useCoupleStore()
const route = useRoute()

const activeTab = ref('promises')
const annivEditVisible = ref(false)
const annivEditDate = ref<string | null>(null)
const savingAnniv = ref(false)
const petEditVisible = ref(false)
const petEditName = ref('')
const savingPet = ref(false)
/** F41 通知中心 */
const notifyVisible = ref(false)

/** F43 里程碑天数：命中 100/200/365/520/666/888/1000/1314/2000 时今天值得庆祝 */
const MILESTONE_DAYS = [100, 200, 365, 520, 666, 888, 1000, 1314, 2000]
const milestone = computed(() => {
  const days = couple.space?.days
  return days && MILESTONE_DAYS.includes(days) ? days : null
})

/** F47 空间周年庆：今天是空间建立的同月同日且满 1 年 */
const spaceBirthday = computed(() => {
  const created = couple.space?.created
  if (!created) return null
  const birth = new Date(created)
  const now = new Date()
  const years = now.getFullYear() - birth.getFullYear()
  if (years < 1) return null
  if (now.getMonth() === birth.getMonth() && now.getDate() === birth.getDate()) {
    return years
  }
  return null
})

function openNotifies() {
  void couple.loadNotifies()
  notifyVisible.value = true
}

/** F98 新手引导：每个浏览器只出现一次 */
const GUIDE_KEY = 'arechat_couple_guide_seen'
const guideVisible = ref(false)
onMounted(() => {
  if (!localStorage.getItem(GUIDE_KEY) && couple.space) {
    guideVisible.value = true
    localStorage.setItem(GUIDE_KEY, '1')
  }
})

function closeGuide() {
  guideVisible.value = false
}

/** F94 通知分类筛选 */
type NotifyFilter = 'all' | 'task' | 'emotion' | 'memory' | 'system'
const notifyFilter = ref<NotifyFilter>('all')
const NOTIFY_FILTERS: { key: NotifyFilter; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'task', label: '任务约定' },
  { key: 'emotion', label: '情绪贴贴' },
  { key: 'memory', label: '养成回忆' },
  { key: 'system', label: '系统提醒' },
]
const TASK_EVENTS = ['task-', 'promise-', 'pact-', 'countdown-', 'chore-', 'dateplan-', 'habit-']
const EMOTION_EVENTS = ['mood-', 'bond-', 'comfort', 'peace-', 'sorry-', 'praise-', 'reconcile', 'night-care', 'poke']
const MEMORY_EVENTS = ['challenge-', 'passbook', 'hundred-', 'wish-', 'travel-', 'nexttime-', 'read-', 'watch-', 'dict-', 'quote-', 'ticket-', 'song-', 'capsule-', 'truth-', 'whisper-', 'telepathy-', 'love-bank', 'scratch-', 'box-', 'garden-', 'rose-', 'treasure-', 'confession-', 'fortune-']
const filteredNotifies = computed(() => {
  if (notifyFilter.value === 'all') {
    return couple.notifies
  }
  const rules =
    notifyFilter.value === 'task' ? TASK_EVENTS
      : notifyFilter.value === 'emotion' ? EMOTION_EVENTS
        : notifyFilter.value === 'memory' ? MEMORY_EVENTS
          : ['birthday', 'milestone', 'notify-ignored']
  return couple.notifies.filter((n) => rules.some((prefix) => n.event.startsWith(prefix)))
})

async function onReadAll() {
  try {
    await couple.readAllNotifies()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '操作失败')
  }
}

function formatNotifyTime(at: number) {
  const d = new Date(at)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getMonth() + 1}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** 悄悄话 tab 标题：有可拆未拆的信时带数量红点 */
const letterTabLabel = computed(() =>
  couple.letterUnread > 0 ? `💌 悄悄话 ${couple.letterUnread}` : '💌 悄悄话',
)

/** 今日专属主题：双方互道早安/晚安达成后自动点亮（色板按天轮换，同一天双方同一款） */
const morningUnlocked = computed(() => !!couple.checkins?.me.morning && !!couple.checkins?.partner.morning)
const nightUnlocked = computed(() => !!couple.checkins?.me.night && !!couple.checkins?.partner.night)
const themeGradient = getTodayBackground()
const themeLabel = todayThemeLabel()
const themeStickers = getTodayStickers()

/** F27 空间主题：早安主题优先，否则应用双方选定的空间主题渐变 */
const THEME_GRADIENTS: Record<string, string> = {
  classic: 'linear-gradient(90deg, #fff0f0, #ffe3ec)',
  cherry: 'linear-gradient(90deg, #ffe8f3, #f8e6ff)',
  ocean: 'linear-gradient(90deg, #e6f7ff, #e3efff)',
  forest: 'linear-gradient(90deg, #e8f7ee, #f0f9e2)',
  night: 'linear-gradient(90deg, #313d5c, #4f4372)',
}
const headerBackground = computed(() => {
  if (morningUnlocked.value) {
    return { background: themeGradient }
  }
  const theme = couple.space?.theme ?? 'classic'
  return { background: THEME_GRADIENTS[theme] ?? THEME_GRADIENTS.classic }
})

function openAnnivEdit() {
  annivEditDate.value = couple.space?.anniversary ?? null
  annivEditVisible.value = true
}

function openPetEdit() {
  petEditName.value = couple.space?.partner.petName ?? ''
  petEditVisible.value = true
}

async function onSavePet() {
  savingPet.value = true
  try {
    const name = petEditName.value.trim()
    await couple.setPetName(name || null)
    ElMessage.success(name ? `爱称已更新：「${name}」🏷️` : '爱称已清除')
    petEditVisible.value = false
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '保存失败')
  } finally {
    savingPet.value = false
  }
}

async function onSaveAnniv() {
  if (!annivEditDate.value) {
    ElMessage.warning('选择一个日期')
    return
  }
  savingAnniv.value = true
  try {
    await couple.setAnniversary(annivEditDate.value)
    ElMessage.success('纪念日已更新 📅')
    annivEditVisible.value = false
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '保存失败')
  } finally {
    savingAnniv.value = false
  }
}

async function onDissolve() {
  try {
    await ElMessageBox.confirm(
      '解除后双方都无法再看到空间内容，且各自可以发起新邀请。确定解除情侣空间吗？',
      '解除情侣空间',
      { type: 'warning', confirmButtonText: '确定解除', cancelButtonText: '再想想' },
    )
    await couple.dissolve()
    ElMessage.warning('情侣空间已解除')
  } catch {
    // 用户取消
  }
}

onMounted(() => {
  // 聊天「记入约定」跳转：?tab=promises 直接定位到约定页
  const tab = typeof route.query.tab === 'string' ? route.query.tab : ''
  if (['bond', 'promises', 'rituals', 'surprise', 'letters', 'mood', 'care', 'shared', 'badges', 'timeline'].includes(tab)) {
    activeTab.value = tab
  }
  // MainLayout 已在登录后 init 过：这里兜底刷新总览（邀请状态可能变化）
  void couple.init()
  // 头部心动值 & 恋爱等级
  void couple.loadIntimacy()
})
</script>

<style scoped>
.couple-page {
  padding: 16px 20px 24px;
  max-width: 860px;
  margin: 0 auto;
}
@media (max-width: 768px) {
  .couple-page {
    padding: 12px 12px 20px;
  }
}
.panel {
  border-radius: 12px;
}
/* 早安达成：当日专属渐变作为头部背景（pastel 色系，内容保持可读） */
.header-card.themed {
  border: none;
}
.theme-banner {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  color: #ad4e00;
  background: linear-gradient(90deg, rgba(255, 236, 210, 0.9), rgba(255, 214, 227, 0.9));
}
/* 一个 tab 里并列多个功能块 */
.tab-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.overdue-alert {
  border-radius: 10px;
}
.overdue-line {
  font-weight: 600;
}
.panel + .panel,
.space-page {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.header-row {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
}
.pair {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 220px;
}
.heart {
  font-size: 20px;
}
.pair-names {
  display: flex;
  flex-direction: column;
  margin-left: 4px;
}
.pair-name {
  font-size: 16px;
  font-weight: 700;
}
.pair-username {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.pet-edit {
  margin-left: 6px;
  border: none;
  background: transparent;
  padding: 0;
  font-size: 11px;
  color: var(--im-muted, #8f959e);
  cursor: pointer;
}
.pet-edit:hover {
  color: var(--el-color-primary, #409eff);
}
.stats {
  display: flex;
  gap: 22px;
}
.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.stat-num {
  font-size: 22px;
  font-weight: 700;
  color: #f56c6c;
}
.stat-label {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.header-actions {
  display: flex;
  gap: 8px;
  margin-left: auto;
}
.btn-ico {
  margin-right: 2px;
}
.anniv-picker {
  width: 100%;
}
.anniv-tip {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
  margin: 8px 0 0;
}
/* F43 里程碑天数横幅 */
.milestone-banner {
  padding: 12px 16px;
  border-radius: 10px;
  background: linear-gradient(90deg, #fff0f0, #fff8e6);
  border: 1px solid #f8d3a3;
  font-size: 14px;
  font-weight: 600;
  color: #c45656;
  text-align: center;
}
.milestone-banner b {
  font-size: 18px;
  color: #f56c6c;
}
/* F41 通知中心 */
.notify-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}
/* F94 通知分类筛选条 */
.notify-filters {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}
.notify-unread {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.notify-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 320px;
  overflow-y: auto;
}
.notify-item {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 8px;
  background: var(--el-fill-color-lighter, #fafafa);
}
.notify-item.unread {
  background: #fff5f5;
}
.notify-dot {
  font-size: 10px;
  flex-shrink: 0;
}
.notify-body {
  min-width: 0;
}
.notify-detail {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  word-break: break-all;
}
.notify-time {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
</style>

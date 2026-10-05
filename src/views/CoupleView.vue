<template>
  <div class="couple-page">
    <!-- 未建立：指引建立 -->
    <CoupleSetup v-if="!couple.established" />

    <!-- 已建立：空间主页 -->
    <div v-else class="space-page" data-testid="couple-space">
      <!-- 头部：双方头像 + 在一起天数 + 今天问答与连击 + 心动值 + 关系操作（背景取空间主题色，连满 7 天换会长的动态背景） -->
      <el-card shadow="never" class="panel header-card themed"
               :class="{ 'bg-grown': bgStage > 0 }"
               :data-bg-stage="bgStage || undefined"
               :data-testid="bgStage > 0 ? 'couple-header-bg-stage' : undefined"
               :style="headerBackground">
        <!-- 连满 7 天，背景里长出这棵一起养的电子植物：解锁的档位越高，它长得越高 -->
        <span
          v-if="bgStage > 0"
          class="space-plant"
          aria-hidden="true"
          :data-testid="`couple-plant-stage-${bgStage}`"
        >{{ PLANT_STAGES[bgStage - 1] }}</span>
        <div class="header-row">
          <div class="pair">
            <ImAvatar :name="auth.username" :size="52" halo online :pendant="pendantEmoji" />
            <span class="heart">💖</span>
            <ImAvatar
              :name="couple.space!.partner.username"
              :label="couple.space!.partner.nickname"
              :color="couple.space!.partner.avatar"
              :size="52"
              :online="couple.space!.partner.online"
              halo
              :pendant="pendantEmoji"
              data-testid="couple-partner-avatar"
            />
            <div class="pair-names">
              <span
                class="pair-name"
                :class="{ 'couple-name-glow': titleGlowOn }"
                data-testid="couple-partner-name"
              >
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
              <!-- 连满 30 天才把恋爱等级称号挂到空间顶部；称号本身沿用心动值七级，不造第二套 -->
              <span
                v-if="titleBadge"
                class="love-title"
                data-testid="couple-love-title"
              >{{ titleBadge.icon }} {{ titleBadge.title }}</span>
            </div>
          </div>
          <div class="stats">
            <div class="stat">
              <span class="stat-num" data-testid="couple-days">{{ couple.space!.days }}</span>
              <span class="stat-label">在一起的天数</span>
            </div>
            <div class="stat">
              <!-- 这一格只读已加载好的问答位与看板连击，不为它多发一次请求；「—」是没拉到，不等于没答 -->
              <span
                class="stat-num today-line"
                data-testid="couple-header-today-question"
                :title="todayQuestionTitle"
              >{{ todayQuestionLine }}</span>
              <span class="stat-label">今天（一问 · 连续）</span>
            </div>
            <div class="stat">
              <span class="stat-num" data-testid="couple-intimacy-score">{{ couple.intimacy?.score ?? 0 }}</span>
              <span class="stat-label">{{ intimacyStatLabel }}</span>
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

      <!-- F98 新手引导：首次进入空间的三步漫游 -->
      <el-dialog
        v-model="guideVisible"
        title="💝 欢迎来到你们的小天地"
        width="380px"
        data-testid="couple-guide-dialog"
      >
        <ol class="guide-list">
          <li>🫶 <b>今天</b>——先答掉今天那一问，两个人都答完这一天就算打卡了</li>
          <li>🔥 <b>连续</b>——连着答完的天数攒成连续，满七天这屏会长出会动的背景，往后一档档还有爱称发光、挂件、称号</li>
          <li>🌟 <b>愿望清单</b>——想要的先记下来，对方能偷偷标「已准备」，许愿这一侧永远看不到</li>
          <li>🥚 <b>隐藏角落</b>——连续满 100 天，页签里会多出一个只给你们俩看的回顾页</li>
        </ol>
        <p class="anniv-tip">顶部页签随便逛，这条提示只出现一次～</p>
        <template #footer>
          <el-button type="primary" data-testid="couple-guide-done" @click="closeGuide">开始探索 💕</el-button>
        </template>
      </el-dialog>

      <!-- 四张卡三个页签：今天两张（一问 + 打卡）、愿望清单一张、隐藏角落满 100 天才出现 -->
      <el-card shadow="never" class="panel">
        <el-tabs v-model="activeTab" class="couple-tabs">
          <el-tab-pane label="🫶 今天" name="today">
            <TabExtras tab="today" />
            <div class="tab-stack">
              <CoupleQuestion />
              <CoupleStreak />
            </div>
          </el-tab-pane>
          <el-tab-pane label="🌟 愿望清单" name="wish" lazy>
            <TabExtras tab="wish" />
            <div class="tab-stack">
              <CoupleWish />
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="secretTabOpen" label="🥚 隐藏角落" name="secret" lazy>
            <div class="tab-stack">
              <CoupleMemory />
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
import { computed, defineComponent, h, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { EditPen } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useCoupleStore } from '@/stores/couple'
import ImAvatar from '@/components/im/ImAvatar.vue'
import CoupleSetup from '@/components/couple/CoupleSetup.vue'
import CoupleProfile from '@/components/couple/CoupleProfile.vue'
import CoupleStreak from '@/components/couple/CoupleStreak.vue'
import CoupleQuestion from '@/components/couple/CoupleQuestion.vue'
import CoupleWish from '@/components/couple/CoupleWish.vue'
import CoupleMemory from '@/components/couple/CoupleMemory.vue'
import { couplePendant } from '@/utils/coupleVisual'

const auth = useAuthStore()
const couple = useCoupleStore()
const route = useRoute()

const activeTab = ref('today')
const annivEditVisible = ref(false)
const annivEditDate = ref<string | null>(null)
const savingAnniv = ref(false)
const petEditVisible = ref(false)
const petEditName = ref('')
const savingPet = ref(false)
/** F41 通知中心 */
const notifyVisible = ref(false)

// ============ F208 页签首访气泡 ============
const TAB_TIPS: Record<string, string> = {
  today: '🫶 今天：答一答今天这一问，两个人都答完就算打卡一天，连上去就长解锁～',
  wish: '🌟 愿望清单：想要的先记下，对方可以偷偷标「已准备」——许愿的人这一侧永远看不到～',
}
const visibleTabTips = ref<Record<string, boolean>>({})

function maybeShowTabTip(tab: string) {
  if (!(tab in TAB_TIPS)) return
  if (!couple.established) return
  const key = `arechat_couple_tab_tip_${tab}`
  if (localStorage.getItem(key)) return
  try {
    localStorage.setItem(key, '1')
  } catch {
    // 隐私模式等写入失败不影响展示
  }
  visibleTabTips.value = { ...visibleTabTips.value, [tab]: true }
}

function closeTabTip(tab: string) {
  visibleTabTips.value = { ...visibleTabTips.value, [tab]: false }
}

watch(activeTab, (t) => maybeShowTabTip(t))

// 空间建立后：给首个可见页签（默认或路由直达）挂上首访提示
watch(
  () => couple.established,
  (v) => {
    if (!v) return
    maybeShowTabTip(activeTab.value)
  },
  { immediate: true },
)

/** 每个一级页签内容顶部：F208 首访提示条（F207 常用 chip 随收藏功能一起下线） */
const TabExtras = defineComponent({
  name: 'TabExtras',
  props: { tab: { type: String, required: true } },
  setup(props) {
    return () => {
      if (!visibleTabTips.value[props.tab]) return null
      return h('div', { class: 'tab-extras' }, [
        h('div', { class: 'tab-tip', 'data-testid': 'couple-tab-tip' }, [
          h('span', TAB_TIPS[props.tab]),
          h(
            'button',
            {
              type: 'button',
              class: 'tab-tip-close',
              'data-testid': 'couple-tab-tip-close',
              onClick: () => closeTabTip(props.tab),
            },
            '×',
          ),
        ]),
      ])
    }
  },
})

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

/** F94 通知分类筛选：分类按后端存活的 13 个情侣事件前缀重排（已下线卡片的那些前缀不再有条目） */
type NotifyFilter = 'all' | 'streak' | 'question' | 'wish' | 'space'
const notifyFilter = ref<NotifyFilter>('all')
const NOTIFY_FILTERS: { key: NotifyFilter; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'question', label: '每日一问' },
  { key: 'streak', label: '打卡解锁' },
  { key: 'wish', label: '愿望清单' },
  { key: 'space', label: '空间与日子' },
]
const RULES: Record<Exclude<NotifyFilter, 'all'>, string[]> = {
  question: ['question-'],
  streak: ['streak-'],
  wish: ['wish-'],
  space: ['invite', 'dissolved', 'space-themed', 'anniversary'],
}
const filteredNotifies = computed(() => {
  if (notifyFilter.value === 'all') {
    return couple.notifies
  }
  const rules = RULES[notifyFilter.value]
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

/**
 * 头部第二格：今天那一问答完没有 + 当前连续天数。
 *
 * 一律现读已经加载好的两块——`couple.question`（今天页签那张卡或 WS 拉回）与
 * `couple.streak`（登录后 init 顺带拉的看板），这一格自己不发请求。
 * 没拉到就是「—」，不等于「没答」，所以再挂一句 title 说清是哪种空态。
 */
const todayQuestionLine = computed(() => {
  const answered = couple.question ? (couple.question.answeredByMe ? '✅ 已答' : '○ 待答') : '—'
  const streak = couple.streak ? `连 ${couple.streak.currentStreak} 天` : '—'
  return `${answered} · ${streak}`
})

const todayQuestionTitle = computed(() => {
  const q = couple.question
  const s = couple.streak
  return [
    q
      ? `今天这一问：我${q.answeredByMe ? '已答' : '还没答'} · TA${q.answeredByPartner ? '已答' : '还没答'}`
      : '今天的每日一问还没拉到',
    s ? `当前连续 ${s.currentStreak} 天（两个人都答完当天那一问就算一天）` : '打卡看板还没拉到',
  ].join('；')
})

/** F27 空间主题：应用双方选定的空间主题渐变，没选过就走今日色板 */
const THEME_GRADIENTS: Record<string, string> = {
  classic: 'linear-gradient(90deg, #fff0f0, #ffe3ec)',
  cherry: 'linear-gradient(90deg, #ffe8f3, #f8e6ff)',
  ocean: 'linear-gradient(90deg, #e6f7ff, #e3efff)',
  forest: 'linear-gradient(90deg, #e8f7ee, #f0f9e2)',
  night: 'linear-gradient(90deg, #313d5c, #4f4372)',
}
const headerBackground = computed(() => {
  const theme = couple.space?.theme ?? 'classic'
  return { background: THEME_GRADIENTS[theme] ?? THEME_GRADIENTS.classic }
})

// ============ 连续互动打卡解锁的外观（判据一律来自后端 tiers，前端不自拼天数） ============

/** 植物四阶段：背景解锁时是种子，之后每多解锁一档往上长一格。 */
const PLANT_STAGES = ['🌱', '🌿', '🪴', '🌳'] as const

/** 已解锁档位数（easter-egg 本身不算成长，它是另一个页签）。 */
const unlockedCount = computed(() => couple.unlockedTierKeys.filter((k) => k !== 'easter-egg').length)

/** 背景只在连满 7 天之后生长，阶段 1-4；没解锁就是 0（不渲染植物）。 */
const bgStage = computed(() => {
  if (!couple.tierUnlocked('background')) return 0
  return Math.min(Math.max(unlockedCount.value - 1, 1), PLANT_STAGES.length)
})

/** 连满 30 天才把称号挂到顶部；称号内容沿用心动值七级，不另造一套。 */
const titleBadge = computed(() => {
  if (!couple.tierUnlocked('title') || !couple.intimacy) return null
  return { icon: couple.intimacy.icon, title: couple.intimacy.title }
})

/** 称号已经单独成徽章时，心动值那一格回到「心动值」，同一个词不在头部出现两次。 */
const intimacyStatLabel = computed(() => {
  if (!couple.intimacy || titleBadge.value) return '心动值'
  return `${couple.intimacy.icon} ${couple.intimacy.title}`
})

/** 连满 14 天，TA 的爱称开始发光（发光样式与聊天侧共用 style.css 的 .couple-name-glow）。 */
const titleGlowOn = computed(() => couple.tierUnlocked('nickname-glow'))

/**
 * 连满 21 天，头像边上挂一对联动小挂件。
 * 取法与聊天侧共用 `utils/coupleVisual` 的 couplePendant（按空间主题定款），
 * 免得同一个人聊天列表挂 🔗、进了空间挂 🫂。
 */
const pendantEmoji = computed(() =>
  couple.tierUnlocked('pendant') ? couplePendant(couple.space?.theme) : undefined,
)

/** 隐藏角落只在连满 100 天后存在（服务端同样有一道闸）。 */
const secretTabOpen = computed(() => couple.tierUnlocked('easter-egg'))

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
    // 爱称只有 PUT /api/couple/profile 这一条通道（独立的 bond/pet-name 随贴贴卡下线）：
    // 空串 = 清除，其余两个字段不传就是不改；改完由 store 重拉总览生效
    await couple.updateProfile({ petName: name || '' })
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

onMounted(async () => {
  // 深链直达：?tab=today|wish|secret 指定首屏页签，白名单外的值忽略
  const tab = typeof route.query.tab === 'string' ? route.query.tab : ''
  if (['today', 'wish'].includes(tab)) {
    activeTab.value = tab
  }
  // MainLayout 已在登录后 init 过：这里兜底刷新总览（邀请状态可能变化）
  await couple.init()
  if (tab === 'secret') {
    // 隐藏页签要先知道解没解锁；init 里那次 loadStreak 是不等待发出的，这里显式取一次
    await couple.loadStreak()
    if (secretTabOpen.value) activeTab.value = 'secret'
  }
  // 头部心动值 & 恋爱等级
  if (!couple.established) return
  void couple.loadIntimacy()
  // 头部第二格读的是 couple.question：落在 wish/secret 页签时今天那张卡没挂载，这里补一次。
  // 但要先看数据在不在——今天页签里卡片已经先请求过并落地了，再发一次就是白打一趟；
  // 它还在飞的时候 store 的并发去重会把两次调用合成一个请求。
  if (!couple.question) void couple.loadQuestion()
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
/* 连满 30 天：恋爱等级称号挂到空间顶部 */
.love-title {
  margin-top: 4px;
  align-self: flex-start;
  padding: 1px 8px;
  border-radius: 999px;
  border: 1px solid rgba(245, 108, 108, 0.35);
  background: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  font-weight: 600;
  color: #d24d5c;
}
/* 连满 7 天：背景开始缓慢流动，角落那棵一起养的植物随档位长高 */
.header-card.bg-grown {
  position: relative;
  overflow: hidden;
}
.header-card.bg-grown::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(115deg, transparent 35%, rgba(255, 255, 255, 0.22) 50%, transparent 65%);
  background-size: 250% 100%;
  animation: couple-bg-drift 14s linear infinite;
}
@keyframes couple-bg-drift {
  from {
    background-position: 120% 0;
  }
  to {
    background-position: -120% 0;
  }
}
.space-plant {
  position: absolute;
  right: 14px;
  bottom: 6px;
  z-index: 1;
  line-height: 1;
  transform-origin: bottom center;
  animation: couple-plant-sway 7s ease-in-out infinite;
}
.header-card[data-bg-stage='1'] .space-plant {
  font-size: 22px;
}
.header-card[data-bg-stage='2'] .space-plant {
  font-size: 30px;
}
.header-card[data-bg-stage='3'] .space-plant {
  font-size: 38px;
}
.header-card[data-bg-stage='4'] .space-plant {
  font-size: 46px;
}
@keyframes couple-plant-sway {
  0%,
  100% {
    transform: rotate(-2deg);
  }
  50% {
    transform: rotate(2deg);
  }
}
/* 动效一律给「减少动态效果」的用户关掉，称号与植物本身不受影响 */
@media (prefers-reduced-motion: reduce) {
  .header-card.bg-grown::after,
  .space-plant {
    animation: none;
  }
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
/* 第二格是一句话不是单个数字，字号收一档免得把头部三格挤散 */
.stat-num.today-line {
  font-size: 15px;
  white-space: nowrap;
}
.stat-label {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.header-actions {
  display: flex;
  gap: 8px;
  margin-left: auto;
  align-items: center;
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

<style>
/* F208 首访提示条（TabExtras 为局部渲染组件，scoped 触不到） */
.couple-page .tab-extras {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
}
.couple-page .tab-tip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
  background: var(--el-fill-color-lighter, #fafafa);
}
.couple-page .tab-tip-close {
  border: none;
  background: transparent;
  font-size: 14px;
  line-height: 1;
  color: var(--im-muted, #8f959e);
  cursor: pointer;
  padding: 2px 4px;
}
.couple-page .tab-tip-close:hover {
  color: #f56c6c;
}
</style>

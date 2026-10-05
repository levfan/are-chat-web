import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import { coupleApi, questionApi, streakApi } from '@/api/couple'
import type {
  CoupleInviteVO,
  CoupleOverview,
  CoupleIntimacyVO,
  CoupleNotifyVO,
  CoupleQuestionTodayVO,
  CoupleSpaceTheme,
  CoupleSpaceVO,
  CoupleStreakBoardVO,
} from '@/types'

/**
 * 情侣空间 store（v8 二轮裁剪后只剩「地基 + 两张要被别处读走的卡」的域）。
 *
 * 留在这里的：总览与邀请、心动值、通知中心、连续互动打卡看板（streak）、每日一问（question）。
 * streak / question 上 store 是有理由的——解锁态要被 ChatView 与 CoupleView 头部直接读走
 * （`tierUnlocked(key)`），卡片自己持有就变成两份真相；愿望清单与百日回顾由组件自持。
 * 已下线的域（心情日记 / 贴贴 / 求抱抱 / 情绪同步）不再留壳：后端既没有对应的端点，
 * 也没有 WS 生产者，留一个空 ref 只会让人以为还有数据。
 *
 * WS 推送（type=couple）由 im store 转成 `arechat:couple` 自定义事件，这里统一消费。
 */

/** 全局监听只绑一次：处理时动态解析当前活跃 pinia 的 store（多实例/测试场景安全） */
let globalListenerBound = false

function bindGlobalListener() {
  if (globalListenerBound) {
    return
  }
  globalListenerBound = true
  window.addEventListener('arechat:couple', ((event: Event) => {
    useCoupleStore().handleCoupleEvent(event)
  }) as EventListener)
}

export const useCoupleStore = defineStore('couple', () => {
  const overview = ref<CoupleOverview | null>(null)
  const intimacy = ref<CoupleIntimacyVO | null>(null)
  const streak = ref<CoupleStreakBoardVO | null>(null)
  const question = ref<CoupleQuestionTodayVO | null>(null)
  const notifies = ref<CoupleNotifyVO[]>([])
  const notifyUnread = ref(0)

  const space = computed<CoupleSpaceVO | null>(() => overview.value?.space ?? null)
  const established = computed(() => !!space.value)
  const incomingInvites = computed<CoupleInviteVO[]>(() => overview.value?.incoming ?? [])
  const outgoingInvites = computed<CoupleInviteVO[]>(() => overview.value?.outgoing ?? [])
  /** 已解锁的档位 key 列表：只从看板的 tiers 里筛，前端不再另存一份本地解锁标记 */
  const unlockedTierKeys = computed<string[]>(() =>
    (streak.value?.tiers ?? []).filter((t) => t.unlocked).map((t) => t.key),
  )

  function notify(title: string, message: string) {
    ElNotification({ title, message, duration: 8000, position: 'top-right' })
  }

  // ========== 总览与建立流程 ==========

  async function loadOverview() {
    overview.value = await coupleApi.overview()
  }

  async function init() {
    bindGlobalListener()
    try {
      await loadOverview()
    } catch {
      overview.value = null
    }
    // 解锁态跟着总览一起拉一次：ChatView 直接读 store 就知道气泡/昵称特效开没开，不必再发请求
    if (established.value) void loadStreak()
  }

  async function invite(username: string, message?: string) {
    await coupleApi.invite(username, message)
    ElMessage.success('邀请已送出，等 TA 点头 💕')
    await loadOverview()
  }

  async function acceptInvite(id: string) {
    await coupleApi.acceptInvite(id)
    ElMessage.success('从今天起，这里是我们两个人的小天地 🎉')
    await Promise.all([loadOverview(), loadIntimacy(), loadStreak()])
  }

  async function rejectInvite(id: string) {
    await coupleApi.rejectInvite(id)
    await loadOverview()
  }

  async function cancelInvite(id: string) {
    await coupleApi.cancelInvite(id)
    await loadOverview()
  }

  async function setAnniversary(date: string) {
    await coupleApi.setAnniversary(date)
    ElMessage.success('在一起的日子记下了 📅')
    await loadOverview()
  }

  /**
   * 空间个性化：宣言 / 主题 / 爱称都走同一个 `PUT /api/couple/profile`。
   * 独立的 pet-name 端点已随贴贴卡下线，爱称只有这一条通道——`null` 是不改该项，空串才是清除。
   *
   * 写接口原样返回整份 SpaceVO，所以直接并回总览那棵树，不必再发一次 overview；
   * space 是 computed，改它只能换掉整棵 overview。
   */
  async function updateProfile(body: {
    slogan?: string | null
    theme?: CoupleSpaceTheme | null
    petName?: string | null
  }) {
    const saved = await coupleApi.updateProfile(body)
    const tree = overview.value
    if (tree?.space) {
      overview.value = { ...tree, space: saved }
      return
    }
    await loadOverview()
  }

  async function dissolve() {
    await coupleApi.dissolve()
    reset()
    await loadOverview()
  }

  // ========== 心动值 ==========

  async function loadIntimacy() {
    try {
      intimacy.value = await coupleApi.intimacy()
    } catch {
      intimacy.value = null
    }
  }

  // ========== 连续互动打卡 / 每日一问 ==========

  /**
   * 同一份看板会被三处同时要点（登录后 init、进空间页的兜底刷新、卡片自己挂载），
   * 实测一次进页打中 3 次 GET /streak/board。这里把并发调用合并成一次请求，
   * 谁先发起谁负责，失败也照旧降级成 null。
   */
  let streakInFlight: Promise<void> | null = null

  async function loadStreak() {
    if (streakInFlight) return streakInFlight
    streakInFlight = (async () => {
      try {
        streak.value = await streakApi.streakBoard()
      } catch {
        streak.value = null
      }
    })().finally(() => {
      streakInFlight = null
    })
    return streakInFlight
  }

  /** 某一档解锁了没有：一律看板 tiers 说了算（没拉到看板就等于没解锁） */
  function tierUnlocked(key: string): boolean {
    return unlockedTierKeys.value.includes(key)
  }

  let questionInFlight: Promise<void> | null = null

  async function loadQuestion() {
    if (questionInFlight) return questionInFlight
    questionInFlight = (async () => {
      try {
        question.value = await questionApi.questionToday()
      } catch {
        question.value = null
      }
    })().finally(() => {
      questionInFlight = null
    })
    return questionInFlight
  }

  // ========== 通知中心 ==========

  async function loadNotifies() {
    try {
      const list = await coupleApi.notifyMine()
      notifies.value = list.items ?? []
      notifyUnread.value = list.unread ?? 0
    } catch {
      notifies.value = []
      notifyUnread.value = 0
    }
  }

  async function readAllNotifies() {
    await coupleApi.notifyReadAll()
    await loadNotifies()
  }

  // ========== WS 分发 ==========

  /** 处理一条情侣空间推送：弹提醒 + 按需刷新已加载的数据 */
  function handleCoupleEvent(event: Event) {
    const msg = (event as CustomEvent<{ event: string; username: string; detail: string }>).detail
    if (!msg?.event) {
      return
    }
    const e = msg.event
    // 建立流程三类：动的是总览本身，必须重拉
    if (e === 'invite' || e === 'invite-accepted' || e === 'invite-rejected') {
      notify('💕 情侣空间', msg.detail)
      void loadOverview()
      return
    }
    if (e === 'dissolved') {
      notify('😢 情侣空间解除', msg.detail)
      reset()
      void loadOverview()
      return
    }
    // 空间本体：日子改了、主题换了，重拉总览；倒数提醒由定时任务发，只弹提醒
    if (e === 'anniversary-updated') {
      notify('📅 我们的日子', msg.detail)
      void loadOverview()
      return
    }
    if (e === 'space-themed') {
      notify('✨ 小空间装扮', msg.detail)
      void loadOverview()
      return
    }
    if (e === 'anniversary-reminder') {
      notify('📅 我们的日子', msg.detail)
      void loadNotifies()
      return
    }
    // 爱称改的是 space.partner.petName（头部与聊天页都读它），后端在 updateProfile 里推这一条
    if (e === 'pet-name-changed') {
      notify('🏷️ 专属爱称', msg.detail)
      void loadOverview()
      return
    }
    // 连续互动打卡：答完今天问答就亮格，解锁动档位——看板/心动值/角标一起重拉
    if (e === 'streak-checkin' || e === 'streak-unlocked' || e === 'streak-makeup') {
      notify('🔥 连续互动', msg.detail)
      void loadStreak()
      void loadIntimacy()
      void loadNotifies()
      return
    }
    // 每日一问：定题与作答都只影响今天这一问（双方都答完时后端紧跟着推 streak-checkin）
    if (e === 'question-daily' || e === 'question-answered') {
      notify('💬 每日一问', msg.detail)
      void loadQuestion()
      void loadNotifies()
      return
    }
    // 愿望清单的看板由组件自持，这里只弹提醒并同步角标
    if (e === 'wish-added' || e === 'wish-fulfilled') {
      notify('🌟 愿望清单', msg.detail)
      void loadNotifies()
      return
    }
    // 其余事件（已下线卡片的老推送）不再认识：不发请求、不弹提醒
  }

  function reset() {
    overview.value = null
    intimacy.value = null
    streak.value = null
    question.value = null
    notifies.value = []
    notifyUnread.value = 0
  }

  return {
    overview,
    space,
    established,
    incomingInvites,
    outgoingInvites,
    unlockedTierKeys,
    intimacy,
    streak,
    question,
    notifies,
    notifyUnread,
    init,
    loadOverview,
    invite,
    acceptInvite,
    rejectInvite,
    cancelInvite,
    setAnniversary,
    updateProfile,
    dissolve,
    loadIntimacy,
    loadStreak,
    loadQuestion,
    tierUnlocked,
    loadNotifies,
    readAllNotifies,
    handleCoupleEvent,
    reset,
  }
})

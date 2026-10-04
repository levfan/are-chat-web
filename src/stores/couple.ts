import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import { coupleApi, questionApi, streakApi } from '@/api/couple'
import type {
  CoupleActionKind,
  CoupleActionVO,
  CoupleBondStatsVO,
  CoupleComfortBoardVO,
  CoupleComfortVO,
  CoupleInviteVO,
  CoupleMoodDayVO,
  CoupleMoodKind,
  CoupleMoodReactionKind,
  CoupleMoodReactionVO,
  CoupleMoodSyncVO,
  CoupleMoodVO,
  CoupleNotifyVO,
  CoupleQuestionTodayVO,
  CoupleSpaceTheme,
  CoupleSpaceVO,
  CoupleStreakBoardVO,
} from '@/types'

/**
 * 情侣空间 store（系统裁剪后只剩 10 张卡的域）。
 *
 * 保留在此的是「多个组件/头部共用、且要靠 WS 推送刷新」的数据：
 * 总览与邀请、心情日记、心动值、贴贴、求抱抱、通知中心，外加连续互动打卡看板与每日一问
 * （解锁态要被 ChatView 直接读走，档位在头部也要用，所以进 store 而不是组件自持）。
 * 其余六张卡（今晚饭桌/家务轮盘/加班预报/愿望券本/好事簿/刮刮乐盲盒）在组件内自持数据，
 * 写接口返回整份聚合 VO 直接整体替换，不进这里——沿用批次十七以后的既定做法，别把 store 再撑回去。
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
  const overview = ref<import('@/types').CoupleOverview | null>(null)
  const moods = ref<CoupleMoodDayVO[]>([])
  const moodReaction = ref<CoupleMoodReactionVO | null>(null)
  const intimacy = ref<import('@/types').CoupleIntimacyVO | null>(null)
  const bondActions = ref<CoupleActionVO[]>([])
  const bondStats = ref<CoupleBondStatsVO | null>(null)
  const comfortBoard = ref<CoupleComfortBoardVO | null>(null)
  const moodSync = ref<CoupleMoodSyncVO | null>(null)
  const streak = ref<CoupleStreakBoardVO | null>(null)
  const question = ref<CoupleQuestionTodayVO | null>(null)
  const notifies = ref<CoupleNotifyVO[]>([])
  const notifyUnread = ref(0)

  /** 已加载过的列表：WS 只刷新加载过的，没人看过就不发这次请求 */
  const loaded = ref<Record<'moods' | 'bond' | 'comfort', boolean>>({
    moods: false,
    bond: false,
    comfort: false,
  })

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

  async function updateProfile(body: { slogan?: string | null; theme?: CoupleSpaceTheme | null; stickers?: string | null }) {
    await coupleApi.updateProfile(body)
    await loadOverview()
  }

  async function dissolve() {
    await coupleApi.dissolve()
    reset()
    await loadOverview()
  }

  // ========== 心情日记 ==========

  async function loadMoods(days = 14) {
    loaded.value.moods = true
    moods.value = await coupleApi.moods(days)
  }

  async function saveMood(mood: CoupleMoodKind, note?: string) {
    const saved: CoupleMoodVO = await coupleApi.saveMood(mood, note)
    // 后端每人每天一条：改写今天那一行，不新增
    const day = saved.moodDay
    const idx = moods.value.findIndex((d) => d.day === day)
    const row = idx >= 0 ? moods.value[idx] : { day, mine: null, partner: null }
    const next: CoupleMoodDayVO = { ...row, mine: saved }
    if (idx >= 0) {
      moods.value = [next, ...moods.value.filter((d) => d.day !== day)]
    } else {
      moods.value = [next, ...moods.value]
    }
    if (overview.value) {
      overview.value = { ...overview.value, todayMine: saved }
    }
    void loadMoodReaction(day)
  }

  async function loadMoodReaction(day?: string) {
    try {
      moodReaction.value = await coupleApi.moodReactions(day)
    } catch {
      moodReaction.value = null
    }
  }

  async function reactMood(reaction: CoupleMoodReactionKind, day?: string) {
    moodReaction.value = await coupleApi.reactMood(reaction, day)
    ElMessage.success('回应送到了 🫶')
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

  // ========== 贴贴 ==========

  async function loadBond() {
    loaded.value.bond = true
    const [actions, stats] = await Promise.all([coupleApi.bondActions(), coupleApi.bondStats()])
    bondActions.value = actions
    bondStats.value = stats
  }

  async function sendAction(kind: CoupleActionKind) {
    bondStats.value = await coupleApi.sendAction(kind)
    await loadBond()
  }

  async function setPetName(name: string | null) {
    const saved = await coupleApi.setPetName(name)
    // space 是 overview 的派生值，改爱称要写回总览那棵树，不能直接给 computed 赋值
    if (overview.value?.space) {
      overview.value = {
        ...overview.value,
        space: { ...overview.value.space, partner: { ...overview.value.space.partner, petName: saved } },
      }
    }
    ElMessage.success(name ? `爱称改成了「${name}」🏷️` : '爱称已清空')
  }

  // ========== 求抱抱 ==========

  async function loadComfort() {
    loaded.value.comfort = true
    try {
      const [board, sync] = await Promise.all([coupleApi.comfortBoard(), coupleApi.moodSync()])
      comfortBoard.value = board
      moodSync.value = sync
    } catch {
      comfortBoard.value = null
      moodSync.value = null
    }
  }

  async function askComfort(feeling: string) {
    comfortBoard.value = await coupleApi.askComfort(feeling)
  }

  async function giveComfort(note: string) {
    await coupleApi.handleComfort(note)
    ElMessage.success('抱抱送出去了 🤗')
    await loadComfort()
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
    // 建立流程四类：动的是总览本身，必须重拉
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
    if (e === 'anniversary-updated' || e === 'anniversary-reminder' || e === 'space-themed') {
      notify('📅 我们的日子', msg.detail)
      void loadOverview()
      return
    }
    if (e === 'birthday-card' || e === 'birthday-eve') {
      notify('🎂 生日', msg.detail)
      void loadNotifies()
      return
    }
    // 心情与贴贴
    if (e === 'mood-changed') {
      if (loaded.value.moods) void loadMoods()
      void loadMoodReaction()
      void loadIntimacy()
      return
    }
    if (e === 'mood-reacted') {
      notify('🫶 心情回应', msg.detail)
      void loadMoodReaction()
      return
    }
    if (e === 'bond-action' || e === 'bond-milestone' || e === 'pet-name-changed') {
      if (e !== 'pet-name-changed') notify('🫶 贴贴', msg.detail)
      if (loaded.value.bond) void loadBond()
      void loadIntimacy()
      return
    }
    // 求抱抱
    if (e === 'comfort-sent' || e === 'comfort-given' || e === 'night-care') {
      notify('🫂 求抱抱', msg.detail)
      if (loaded.value.comfort) void loadComfort()
      return
    }
    // 连续互动打卡：补签动余额、解锁动档位，看板/心动值/角标一起重拉
    if (e === 'streak-checkin' || e === 'streak-unlocked' || e === 'streak-makeup') {
      notify('🔥 连续互动', msg.detail)
      void loadStreak()
      void loadIntimacy()
      void loadNotifies()
      return
    }
    // 每日一问：定题与作答都只影响今天这一问
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
    // 其余六张卡由组件自持数据，这里只弹提醒并同步心动值/通知角标
    const cardEvents = [
      'catch-safeword', 'catch-safeword-use', 'catch-safeword-reflect',
      'dine-ticket', 'dine-hit', 'factory-spin-open', 'factory-spin-confirm',
      'factory-spin-item-done', 'factory-spin-clear', 'quest-overtime', 'quest-lamp',
      'ceremony-coupon', 'ceremony-coupon-used', 'echo-deed-added', 'echo-deed-starred',
      'scratch-scratched', 'scratch-redeemed', 'box-received', 'box-opened', 'anniversaries-changed',
    ]
    if (cardEvents.includes(e)) {
      if (e !== 'anniversaries-changed') notify('💝 情侣空间', msg.detail)
      void loadIntimacy()
      void loadNotifies()
    }
  }

  function reset() {
    overview.value = null
    moods.value = []
    moodReaction.value = null
    intimacy.value = null
    bondActions.value = []
    bondStats.value = null
    comfortBoard.value = null
    moodSync.value = null
    streak.value = null
    question.value = null
    notifies.value = []
    notifyUnread.value = 0
    loaded.value = { moods: false, bond: false, comfort: false }
  }

  return {
    overview,
    space,
    established,
    incomingInvites,
    outgoingInvites,
    unlockedTierKeys,
    moods,
    moodReaction,
    intimacy,
    bondActions,
    bondStats,
    comfortBoard,
    moodSync,
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
    loadMoods,
    saveMood,
    loadMoodReaction,
    reactMood,
    loadIntimacy,
    loadStreak,
    loadQuestion,
    tierUnlocked,
    loadBond,
    sendAction,
    setPetName,
    loadComfort,
    askComfort,
    giveComfort,
    loadNotifies,
    readAllNotifies,
    handleCoupleEvent,
    reset,

  }
})

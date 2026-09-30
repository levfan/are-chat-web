import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { ElNotification } from 'element-plus'
import { coupleApi } from '@/api/couple'
import type {
  CoupleActionVO,
  CoupleAnniversaryVO,
  CoupleBadgeWallVO,
  CoupleBondStatsVO,
  CoupleCapsuleVO,
  CoupleCheckinKind,
  CoupleChoreVO,
  CoupleCipherVO,
  CoupleCityCardVO,
  CoupleCountdownVO,
  CoupleCycleCardVO,
  CoupleDataOverviewVO,
  CoupleDatePlanVO,
  CoupleExpenseCategory,
  CoupleExpenseMonthVO,
  CoupleFirstAidVO,
  CoupleFirstVO,
  CoupleFortuneVO,
  CoupleFundVO,
  CoupleHabitVO,
  CoupleHeatmapVO,
  CoupleIntimacyBoostVO,
  CoupleMoodCurveVO,
  CoupleTrafficLightVO,
  CoupleIntimacyVO,
  CoupleItemKind,
  CoupleItemVO,
  CoupleLetterVO,
  CoupleMoodDayVO,
  CoupleMoodKind,
  CoupleMoodReactionKind,
  CoupleMoodReactionVO,
  CoupleMonthlyReportVO,
  CoupleNotifyVO,
  CoupleOnThisDayEvent,
  CoupleOverview,
  CouplePactVO,
  CouplePraiseVO,
  CouplePromiseVO,
  CoupleQuestionHistoryVO,
  CoupleQuestionVO,
  CoupleReconcileVO,
  CoupleStoryVO,
  CoupleTacitStateVO,
  CoupleTaskVO,
  CoupleTimelineDay,
  CoupleWeatherVO,
  CoupleScratchVO,
  CoupleBoxVO,
  CoupleAlarmVO,
  CoupleMissBoardVO,
  CoupleTreasureVO,
  CoupleConfessionVO,
  CoupleGardenVO,
  CoupleRoseBoardVO,
  CoupleSlipBoardVO,
} from '@/types'

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

/**
 * 情侣空间 store：总览/邀请、双向约定、每日仪式、共享清单与日历。
 * WS 推送（type=couple）由 im store 转发为 arechat:couple 自定义事件，这里统一消费：
 * 弹出可爱提醒并按需刷新对应数据。
 */
export const useCoupleStore = defineStore('couple', () => {
  const overview = ref<CoupleOverview | null>(null)
  const promises = ref<CouplePromiseVO[]>([])
  const question = ref<CoupleQuestionVO | null>(null)
  const items = ref<CoupleItemVO[]>([])
  const anniversaries = ref<CoupleAnniversaryVO[]>([])
  const moods = ref<CoupleMoodDayVO[]>([])
  const timeline = ref<CoupleTimelineDay[]>([])
  const intimacy = ref<CoupleIntimacyVO | null>(null)
  const letters = ref<CoupleLetterVO[]>([])
  const questionHistory = ref<CoupleQuestionHistoryVO[]>([])
  const pacts = ref<CouplePactVO[]>([])
  const funds = ref<CoupleFundVO[]>([])
  const cityCard = ref<CoupleCityCardVO | null>(null)
  /** 贴贴统计与最近动作流 */
  const bondStats = ref<CoupleBondStatsVO | null>(null)
  const bondActions = ref<CoupleActionVO[]>([])
  /** 今天双方给彼此心情的回应 */
  const moodReaction = ref<CoupleMoodReactionVO | null>(null)
  /** 每日仪式升级：任务卡 / 默契 / 运势 / 晚安故事 */
  const task = ref<CoupleTaskVO | null>(null)
  const recentTasks = ref<CoupleTaskVO[]>([])
  const tacit = ref<CoupleTacitStateVO | null>(null)
  const tacitHistory = ref<import('@/types').CoupleTacitVO[]>([])
  const fortune = ref<CoupleFortuneVO | null>(null)
  const goodnightStory = ref<CoupleStoryVO | null>(null)
  /** 情绪关怀：天气 / 急救箱 / 和好卡 / 夸夸墙 / 生理期 */
  const weather = ref<CoupleWeatherVO | null>(null)
  const firstAid = ref<CoupleFirstAidVO | null>(null)
  const reconciles = ref<CoupleReconcileVO[]>([])
  const praises = ref<CouplePraiseVO[]>([])
  const cycleCard = ref<CoupleCycleCardVO | null>(null)
  /** 纪念与回忆：徽章 / 那年今天 / 胶囊 / 倒数日 */
  const badges = ref<CoupleBadgeWallVO | null>(null)
  const onThisDay = ref<CoupleOnThisDayEvent[]>([])
  const capsules = ref<CoupleCapsuleVO[]>([])
  const countdowns = ref<CoupleCountdownVO[]>([])
  /** 共同生活：记账 / 家务 / 约会 / 习惯 / 暗号 */
  const expenses = ref<CoupleExpenseMonthVO | null>(null)
  const chores = ref<CoupleChoreVO[]>([])
  const datePlans = ref<CoupleDatePlanVO[]>([])
  const habits = ref<CoupleHabitVO[]>([])
  const ciphers = ref<CoupleCipherVO[]>([])
  /** 月报与总览 */
  const monthlyReport = ref<CoupleMonthlyReportVO | null>(null)
  const dataOverview = ref<CoupleDataOverviewVO | null>(null)
  /** 恋爱游戏化 */
  const boost = ref<CoupleIntimacyBoostVO | null>(null)
  const heatmap = ref<CoupleHeatmapVO | null>(null)
  const moodCurve = ref<CoupleMoodCurveVO | null>(null)
  const trafficLight = ref<CoupleTrafficLightVO | null>(null)
  /** F41 通知中心 */
  const notifies = ref<CoupleNotifyVO[]>([])
  const notifyUnread = ref(0)
  /** F46 第一次清单 */
  const firsts = ref<CoupleFirstVO[]>([])
  /** F50-F59 惊喜与期待：刮刮乐 / 盲盒 / 闹钟 / 思念 / 藏宝图 / 告白 */
  const scratches = ref<CoupleScratchVO[]>([])
  const boxes = ref<CoupleBoxVO[]>([])
  const alarms = ref<CoupleAlarmVO[]>([])
  const missBoard = ref<CoupleMissBoardVO | null>(null)
  const treasures = ref<CoupleTreasureVO[]>([])
  const confessions = ref<CoupleConfessionVO[]>([])
  /** F54-F56 花园 / 玫瑰 / 幸运签 */
  const garden = ref<CoupleGardenVO | null>(null)
  const roseBoard = ref<CoupleRoseBoardVO | null>(null)
  const slipBoard = ref<CoupleSlipBoardVO | null>(null)
  /** 各分页数据是否已加载过：WS 事件只刷新已加载过的，避免无谓请求 */
  const loadedLists = ref({
    promises: false,
    question: false,
    items: false,
    anniversaries: false,
    moods: false,
    timeline: false,
    intimacy: false,
    letters: false,
    pacts: false,
    funds: false,
    cityCard: false,
    bond: false,
    ritual: false,
    care: false,
    memory: false,
    life: false,
    surprise: false,
    garden: false,
  })
  /** 聊天「记入约定」带入的草稿：CoupleView 打开承诺弹窗后清空 */
  const promiseDraft = ref<{ content: string; side: 'me' | 'partner' } | null>(null)

  const space = computed(() => overview.value?.space ?? null)
  const established = computed(() => !!space.value)
  /** 收到的全部待处理邀请（新→旧） */
  const incomingInvites = computed(() => overview.value?.incoming ?? [])
  /** 发出的全部待处理邀请（新→旧） */
  const outgoingInvites = computed(() => overview.value?.outgoing ?? [])
  /** 兼容别名：最新一条 */
  const incomingInvite = computed(() => incomingInvites.value[0] ?? null)
  const outgoingInvite = computed(() => outgoingInvites.value[0] ?? null)
  const checkins = computed(() => overview.value?.checkins ?? null)
  const overdueCount = computed(() => overview.value?.overdueCount ?? 0)
  /** 我可以拆但还没拆的悄悄话数（信箱 tab 红点） */
  const letterUnread = computed(() => overview.value?.letterUnread ?? 0)

  let loading = false

  async function loadOverview() {
    overview.value = await coupleApi.overview()
  }

  /** 登录后由 MainLayout 调用：绑定 WS 事件 + 拉取总览（含邀请红点） */
  async function init() {
    bindGlobalListener()
    if (loading) {
      return
    }
    loading = true
    try {
      await loadOverview()
    } catch {
      // 静默：未登录/网络异常不阻塞布局
    } finally {
      loading = false
    }
  }

  function reset() {
    overview.value = null
    promises.value = []
    question.value = null
    items.value = []
    anniversaries.value = []
    moods.value = []
    timeline.value = []
    intimacy.value = null
    letters.value = []
    questionHistory.value = []
    pacts.value = []
    funds.value = []
    cityCard.value = null
    bondStats.value = null
    bondActions.value = []
    moodReaction.value = null
    task.value = null
    recentTasks.value = []
    tacit.value = null
    tacitHistory.value = []
    fortune.value = null
    goodnightStory.value = null
    weather.value = null
    firstAid.value = null
    reconciles.value = []
    praises.value = []
    cycleCard.value = null
    badges.value = null
    onThisDay.value = []
    capsules.value = []
    countdowns.value = []
    expenses.value = null
    chores.value = []
    datePlans.value = []
    habits.value = []
    ciphers.value = []
    monthlyReport.value = null
    dataOverview.value = null
    boost.value = null
    heatmap.value = null
    moodCurve.value = null
    trafficLight.value = null
    notifies.value = []
    notifyUnread.value = 0
    firsts.value = []
    scratches.value = []
    boxes.value = []
    alarms.value = []
    missBoard.value = null
    treasures.value = []
    confessions.value = []
    garden.value = null
    roseBoard.value = null
    slipBoard.value = null
    loadedLists.value = {
      promises: false,
      question: false,
      items: false,
      anniversaries: false,
      moods: false,
      timeline: false,
      intimacy: false,
      letters: false,
      pacts: false,
      funds: false,
      cityCard: false,
      bond: false,
      ritual: false,
      care: false,
      memory: false,
      life: false,
      surprise: false,
      garden: false,
    }
    promiseDraft.value = null
  }

  // ---------- 建立流程 ----------

  async function invite(username: string, message?: string) {
    const vo = await coupleApi.invite(username, message)
    await loadOverview()
    return vo
  }

  async function acceptInvite(id: string) {
    const vo = await coupleApi.acceptInvite(id)
    await loadOverview()
    return vo
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
    const vo = await coupleApi.setAnniversary(date)
    if (overview.value) {
      overview.value.space = vo
    }
    return vo
  }

  async function dissolve() {
    await coupleApi.dissolve()
    reset()
    await loadOverview()
  }

  // ---------- 双向待办 / 约定 ----------

  async function loadPromises() {
    promises.value = (await coupleApi.promises()) ?? []
    loadedLists.value.promises = true
  }

  async function createPromise(side: 'me' | 'partner', content: string, dueAt?: number | null) {
    const vo = await coupleApi.createPromise(side, content, dueAt)
    await Promise.all([loadPromises(), loadOverview()])
    return vo
  }

  async function donePromise(id: string) {
    const vo = await coupleApi.donePromise(id)
    await Promise.all([loadPromises(), loadOverview()])
    return vo
  }

  async function undonePromise(id: string) {
    const vo = await coupleApi.undonePromise(id)
    await Promise.all([loadPromises(), loadOverview()])
    return vo
  }

  async function deletePromise(id: string) {
    await coupleApi.deletePromise(id)
    await Promise.all([loadPromises(), loadOverview()])
  }

  // ---------- 每日小仪式 ----------

  async function checkin(kind: CoupleCheckinKind) {
    const state = await coupleApi.checkin(kind)
    if (overview.value) {
      overview.value.checkins = state
    }
    return state
  }

  async function loadQuestion() {
    question.value = await coupleApi.question()
    loadedLists.value.question = true
  }

  async function answerQuestion(answer: string) {
    const vo = await coupleApi.answerQuestion(answer)
    question.value = vo
    return vo
  }

  // ---------- 共享空间 ----------

  async function loadItems() {
    items.value = (await coupleApi.items()) ?? []
    loadedLists.value.items = true
  }

  async function createItem(body: { kind: CoupleItemKind; title: string; note?: string; dueDate?: string | null }) {
    const vo = await coupleApi.createItem(body)
    await loadItems()
    return vo
  }

  async function updateItem(id: string, body: { title?: string; note?: string; dueDate?: string | null; done?: boolean }) {
    const vo = await coupleApi.updateItem(id, body)
    await loadItems()
    return vo
  }

  async function deleteItem(id: string) {
    await coupleApi.deleteItem(id)
    await loadItems()
  }

  async function loadAnniversaries() {
    anniversaries.value = (await coupleApi.anniversaries()) ?? []
    loadedLists.value.anniversaries = true
  }

  async function createAnniversary(body: { title: string; date: string; yearly: boolean }) {
    const vo = await coupleApi.createAnniversary(body)
    await loadAnniversaries()
    return vo
  }

  async function deleteAnniversary(id: string) {
    await coupleApi.deleteAnniversary(id)
    await loadAnniversaries()
  }

  // ---------- 心情日记 / 时光轴 / 心动值 ----------

  async function loadMoods() {
    moods.value = (await coupleApi.moods()) ?? []
    loadedLists.value.moods = true
  }

  /** 记录/修改今天的心情，保存后刷新列表与心动值 */
  async function saveMood(mood: CoupleMoodKind, note?: string) {
    const vo = await coupleApi.saveMood(mood, note)
    await loadMoods()
    if (loadedLists.value.intimacy) {
      void loadIntimacy()
    }
    return vo
  }

  async function loadTimeline() {
    timeline.value = (await coupleApi.timeline()) ?? []
    loadedLists.value.timeline = true
  }

  // ---------- F46 第一次清单 ----------

  async function loadFirsts() {
    firsts.value = (await coupleApi.listFirsts()) ?? []
    loadedLists.value.memory = true
  }

  async function loadIntimacy() {
    intimacy.value = await coupleApi.intimacy()
    loadedLists.value.intimacy = true
  }

  // ---------- 悄悄话信箱 / 一问历史 ----------

  async function loadLetters() {
    letters.value = (await coupleApi.letters()) ?? []
    loadedLists.value.letters = true
  }

  /** 写一封悄悄话（deliverAt 毫秒时间戳，空 = 立即可拆），保存后刷新列表与总览红点 */
  async function createLetter(content: string, deliverAt?: number | null) {
    const vo = await coupleApi.createLetter(content, deliverAt)
    await Promise.all([loadLetters(), loadOverview()])
    return vo
  }

  async function openLetter(id: string) {
    const vo = await coupleApi.openLetter(id)
    await Promise.all([loadLetters(), loadOverview()])
    return vo
  }

  async function deleteLetter(id: string) {
    await coupleApi.deleteLetter(id)
    await loadLetters()
  }

  async function loadQuestionHistory() {
    questionHistory.value = (await coupleApi.questionHistory()) ?? []
  }

  // ---------- 恋爱条约 / 异地恋助手 / 心愿基金 ----------

  async function loadPacts() {
    pacts.value = (await coupleApi.pacts()) ?? []
    loadedLists.value.pacts = true
  }

  async function createPact(content: string) {
    const vo = await coupleApi.createPact(content)
    await loadPacts()
    return vo
  }

  async function acceptPact(id: string) {
    const vo = await coupleApi.acceptPact(id)
    await loadPacts()
    return vo
  }

  async function deletePact(id: string) {
    await coupleApi.deletePact(id)
    await loadPacts()
  }

  async function loadCityCard() {
    cityCard.value = await coupleApi.cityCard()
    loadedLists.value.cityCard = true
  }

  async function setCity(city: string | null) {
    const vo = await coupleApi.setCity(city)
    cityCard.value = vo
    return vo
  }

  async function loadFunds() {
    funds.value = (await coupleApi.funds()) ?? []
    loadedLists.value.funds = true
  }

  async function createFund(title: string, targetAmount: number) {
    const vo = await coupleApi.createFund(title, targetAmount)
    await loadFunds()
    return vo
  }

  async function depositFund(id: string, amount: number, note?: string) {
    const vo = await coupleApi.depositFund(id, amount, note)
    await loadFunds()
    return vo
  }

  async function deleteFund(id: string) {
    await coupleApi.deleteFund(id)
    await loadFunds()
  }

  // ---------- 贴贴互动 ----------

  async function loadBond() {
    const [stats, actions, reaction] = await Promise.all([
      coupleApi.bondStats(),
      coupleApi.bondActions(),
      coupleApi.moodReactions(),
    ])
    bondStats.value = stats
    bondActions.value = actions ?? []
    moodReaction.value = reaction
    loadedLists.value.bond = true
  }

  /** 发送贴贴动作，返回最新统计（含今日双方动作数） */
  async function sendAction(kind: Parameters<typeof coupleApi.sendAction>[0]) {
    const stats = await coupleApi.sendAction(kind)
    bondStats.value = stats
    void coupleApi.bondActions().then((list) => {
      bondActions.value = list ?? []
    })
    return stats
  }

  /** 回应 TA 今天的心情 */
  async function reactMood(reaction: CoupleMoodReactionKind, day?: string) {
    const vo = await coupleApi.reactMood(reaction, day)
    moodReaction.value = vo
    return vo
  }

  async function loadMoodReaction(day?: string) {
    moodReaction.value = await coupleApi.moodReactions(day)
  }

  /** 给 TA 设置专属爱称（空串清除），同步总览里的 partner.petName */
  async function setPetName(name: string | null) {
    const nick = await coupleApi.setPetName(name)
    if (overview.value?.space) {
      overview.value.space.partner.petName = nick
    }
    return nick
  }

  // ---------- 每日仪式升级 ----------

  async function loadRitual() {
    const [t, tacitState, f, story] = await Promise.all([
      coupleApi.todayTask(),
      coupleApi.tacitState(),
      coupleApi.fortune(),
      coupleApi.goodnightStory(),
    ])
    task.value = t
    tacit.value = tacitState
    fortune.value = f
    goodnightStory.value = story
    loadedLists.value.ritual = true
  }

  async function loadRecentTasks() {
    recentTasks.value = (await coupleApi.recentTasks()) ?? []
  }

  async function doneTask() {
    const vo = await coupleApi.doneTask()
    task.value = vo
    void loadRecentTasks()
    return vo
  }

  async function startTacit() {
    const vo = await coupleApi.startTacit()
    if (tacit.value) {
      tacit.value.pending = vo
      tacit.value.totalCount += 1
    }
    return vo
  }

  async function answerTacit(answer: string) {
    const vo = await coupleApi.answerTacit(answer)
    await loadRitual()
    return vo
  }

  async function loadTacitHistory() {
    tacitHistory.value = (await coupleApi.tacitHistory()) ?? []
  }

  async function drawLoveWord() {
    return coupleApi.drawLoveWord()
  }

  // ---------- 情绪关怀 ----------

  async function loadCare() {
    const [w, aid, rec, prs, cyc] = await Promise.all([
      coupleApi.weather(),
      coupleApi.firstAid(),
      coupleApi.reconciles(),
      coupleApi.praises(),
      coupleApi.cycleCard(),
    ])
    weather.value = w
    firstAid.value = aid
    reconciles.value = rec ?? []
    praises.value = prs ?? []
    cycleCard.value = cyc
    loadedLists.value.care = true
  }

  async function sendReconcile(message: string, startAt?: number | null) {
    const vo = await coupleApi.sendReconcile(message, startAt)
    reconciles.value = (await coupleApi.reconciles()) ?? []
    return vo
  }

  async function acceptReconcile(id: string) {
    const vo = await coupleApi.acceptReconcile(id)
    reconciles.value = (await coupleApi.reconciles()) ?? []
    return vo
  }

  async function postPraise(content: string) {
    const vo = await coupleApi.postPraise(content)
    praises.value = (await coupleApi.praises()) ?? []
    return vo
  }

  async function receivePraise(id: string) {
    const vo = await coupleApi.receivePraise(id)
    praises.value = (await coupleApi.praises()) ?? []
    return vo
  }

  async function saveCycle(body: Parameters<typeof coupleApi.saveCycle>[0]) {
    const vo = await coupleApi.saveCycle(body)
    cycleCard.value = vo
    return vo
  }

  // ---------- 纪念与回忆 ----------

  async function loadBadges() {
    badges.value = await coupleApi.badges()
  }

  async function loadOnThisDay() {
    onThisDay.value = (await coupleApi.onThisDay()) ?? []
  }

  async function loadCapsules() {
    capsules.value = (await coupleApi.capsules()) ?? []
  }

  async function sealCapsule(content: string, openDay: string) {
    const vo = await coupleApi.sealCapsule(content, openDay)
    await loadCapsules()
    return vo
  }

  async function openCapsule(id: string) {
    const vo = await coupleApi.openCapsule(id)
    await loadCapsules()
    return vo
  }

  async function loadCountdowns() {
    countdowns.value = (await coupleApi.countdowns()) ?? []
  }

  async function addCountdown(title: string, targetDay: string, note?: string) {
    const vo = await coupleApi.addCountdown(title, targetDay, note)
    await loadCountdowns()
    return vo
  }

  async function doneCountdown(id: string, done: boolean) {
    const vo = await coupleApi.doneCountdown(id, done)
    await loadCountdowns()
    return vo
  }

  async function deleteCountdown(id: string) {
    await coupleApi.deleteCountdown(id)
    await loadCountdowns()
  }

  // ---------- 共同生活 ----------

  async function loadLife(month?: string) {
    const [exp, chs, plans, hbs, cph] = await Promise.all([
      coupleApi.monthExpenses(month),
      coupleApi.chores(),
      coupleApi.datePlans(),
      coupleApi.habits(),
      coupleApi.ciphers(),
    ])
    expenses.value = exp
    chores.value = chs ?? []
    datePlans.value = plans ?? []
    habits.value = hbs ?? []
    ciphers.value = cph ?? []
    loadedLists.value.life = true
  }

  async function addExpense(body: { amount: number; category: CoupleExpenseCategory; note?: string; spentDay?: string }) {
    await coupleApi.addExpense(body)
    expenses.value = await coupleApi.monthExpenses()
  }

  async function deleteExpense(id: string) {
    await coupleApi.deleteExpense(id)
    expenses.value = await coupleApi.monthExpenses()
  }

  async function addChore(title: string, rotate: 'SINGLE' | 'ALTERNATE') {
    const vo = await coupleApi.addChore(title, rotate)
    chores.value = (await coupleApi.chores()) ?? []
    return vo
  }

  async function doneChore(id: string) {
    const vo = await coupleApi.doneChore(id)
    chores.value = (await coupleApi.chores()) ?? []
    return vo
  }

  async function deleteChore(id: string) {
    await coupleApi.deleteChore(id)
    chores.value = (await coupleApi.chores()) ?? []
  }

  async function addDatePlan(body: { title: string; planDay: string; place?: string; items?: string }) {
    const vo = await coupleApi.addDatePlan(body)
    datePlans.value = (await coupleApi.datePlans()) ?? []
    return vo
  }

  async function doneDatePlan(id: string, done: boolean) {
    const vo = await coupleApi.doneDatePlan(id, done)
    datePlans.value = (await coupleApi.datePlans()) ?? []
    return vo
  }

  async function deleteDatePlan(id: string) {
    await coupleApi.deleteDatePlan(id)
    datePlans.value = (await coupleApi.datePlans()) ?? []
  }

  async function addHabit(title: string) {
    const vo = await coupleApi.addHabit(title)
    habits.value = (await coupleApi.habits()) ?? []
    return vo
  }

  async function checkinHabit(id: string) {
    const vo = await coupleApi.checkinHabit(id)
    habits.value = (await coupleApi.habits()) ?? []
    return vo
  }

  async function toggleHabit(id: string, active: boolean) {
    const vo = await coupleApi.toggleHabit(id, active)
    habits.value = (await coupleApi.habits()) ?? []
    return vo
  }

  async function deleteHabit(id: string) {
    await coupleApi.deleteHabit(id)
    habits.value = (await coupleApi.habits()) ?? []
  }

  async function addCipher(keyword: string, meaning: string) {
    const vo = await coupleApi.addCipher(keyword, meaning)
    ciphers.value = (await coupleApi.ciphers()) ?? []
    return vo
  }

  async function deleteCipher(id: string) {
    await coupleApi.deleteCipher(id)
    ciphers.value = (await coupleApi.ciphers()) ?? []
  }

  // ---------- 空间个性化 / 月报 ----------

  /** 更新宣言/主题/贴纸墙：本地同步 overview.space，避免整包刷新 */
  async function updateProfile(body: { slogan?: string | null; theme?: string | null; stickers?: string | null }) {
    const vo = await coupleApi.updateProfile(body)
    if (overview.value?.space) {
      overview.value = {
        ...overview.value,
        space: vo,
      }
    }
    return vo
  }

  /** 恋爱月报（默认当月） */
  async function loadMonthlyReport(month?: string) {
    monthlyReport.value = await coupleApi.monthlyReport(month)
  }

  /** 数据总览 */
  async function loadDataOverview() {
    dataOverview.value = await coupleApi.dataOverview()
  }

  // ---------- 恋爱游戏化 ----------

  /** 一次性加载：加成 + 热力图 + 心情曲线 + 红绿灯 */
  async function loadGame() {
    const [b, hm, mc, tl] = await Promise.all([
      coupleApi.boost(),
      coupleApi.heatmap(),
      coupleApi.moodCurve(),
      coupleApi.trafficLight(),
    ])
    boost.value = b
    heatmap.value = hm
    moodCurve.value = mc
    trafficLight.value = tl
  }

  // ---------- F41 通知中心 ----------

  async function loadNotifies() {
    const vo = await coupleApi.notifyMine()
    notifies.value = vo.items ?? []
    notifyUnread.value = vo.unread ?? 0
  }

  async function readAllNotifies() {
    await coupleApi.notifyReadAll()
    notifies.value = notifies.value.map((n) => ({ ...n, read: true }))
    notifyUnread.value = 0
  }

  // ---------- F46 第一次清单 ----------

  async function addFirst(title: string, firstDay: string, note?: string | null) {
    const vo = await coupleApi.addFirst(title, firstDay, note)
    await loadFirsts()
    return vo
  }

  async function removeFirst(id: string) {
    await coupleApi.removeFirst(id)
    firsts.value = firsts.value.filter((f) => f.id !== id)
  }

  // ---------- F50-F59 惊喜与期待 ----------

  /** 一次性加载惊喜板块（刮刮乐/盲盒/闹钟/思念/藏宝图/告白） */
  async function loadSurprise() {
    const [s, b, a, m, t, c] = await Promise.all([
      coupleApi.scratches(),
      coupleApi.boxes(),
      coupleApi.alarms(),
      coupleApi.missBoard(),
      coupleApi.treasures(),
      coupleApi.confessions(),
    ])
    scratches.value = s ?? []
    boxes.value = b ?? []
    alarms.value = a ?? []
    missBoard.value = m
    treasures.value = t ?? []
    confessions.value = c ?? []
    loadedLists.value.surprise = true
  }

  async function scratchCard(id: string) {
    const vo = await coupleApi.scratchCard(id)
    scratches.value = scratches.value.map((c) => (c.id === id ? { ...vo } : c))
    return vo
  }

  async function redeemScratch(id: string) {
    const vo = await coupleApi.redeemScratch(id)
    scratches.value = scratches.value.map((c) => (c.id === id ? { ...c, redeemed: vo.redeemed } : c))
    return vo
  }

  async function createBox(kind: 'whisper' | 'task', content: string, openDay: string) {
    const vo = await coupleApi.createBox(kind, content, openDay)
    await loadSurprise()
    return vo
  }

  async function openBox(id: string) {
    const vo = await coupleApi.openBox(id)
    await loadSurprise()
    return vo
  }

  async function createAlarm(message: string, fireAt: number) {
    const vo = await coupleApi.createAlarm(message, fireAt)
    alarms.value = [vo, ...alarms.value]
    return vo
  }

  async function cancelAlarm(id: string) {
    await coupleApi.cancelAlarm(id)
    alarms.value = alarms.value.filter((a) => a.id !== id)
  }

  async function sendMiss() {
    missBoard.value = await coupleApi.sendMiss()
  }

  async function createConfession(content: string, confessDay: string) {
    const vo = await coupleApi.createConfession(content, confessDay)
    await loadSurprise()
    return vo
  }

  async function deleteConfession(id: string) {
    await coupleApi.deleteConfession(id)
    confessions.value = confessions.value.filter((c) => c.id !== id)
  }

  async function createTreasure(taskText: string, prizeText: string) {
    const vo = await coupleApi.createTreasure(taskText, prizeText)
    await loadSurprise()
    return vo
  }

  async function completeTreasure(id: string) {
    const vo = await coupleApi.completeTreasure(id)
    await loadSurprise()
    return vo
  }

  // ---------- F54-F56 花园 / 玫瑰 / 幸运签 ----------

  async function loadGarden() {
    const [g, r, s] = await Promise.all([coupleApi.garden(), coupleApi.roseBoard(), coupleApi.slipBoard()])
    garden.value = g
    roseBoard.value = r
    slipBoard.value = s
    loadedLists.value.garden = true
  }

  async function waterGarden() {
    garden.value = await coupleApi.waterGarden()
  }

  async function sendRose(flowerKey: string) {
    roseBoard.value = await coupleApi.sendRose(flowerKey)
  }

  async function drawSlip() {
    slipBoard.value = await coupleApi.drawSlip()
  }

  // ---------- WS 推送消费 ----------

  function notify(title: string, message: string) {
    ElNotification({ title, message, duration: 8000, position: 'top-right' })
  }

  /** 处理一条情侣空间推送：弹提醒 + 按需刷新对应数据 */
  function handleCoupleEvent(event: Event) {
    const msg = (event as CustomEvent<{ event: string; username: string; detail: string }>).detail
    if (!msg?.event) {
      return
    }
    switch (msg.event) {
      case 'invite':
        notify('💕 情侣邀请', msg.detail)
        void loadOverview()
        break
      case 'invite-accepted':
        notify('🎉 情侣空间开启', msg.detail)
        void loadOverview()
        break
      case 'invite-rejected':
        notify('💔 邀请被婉拒', msg.detail)
        void loadOverview()
        break
      case 'dissolved':
        notify('😢 情侣空间解除', msg.detail)
        reset()
        void loadOverview()
        break
      case 'promise-created':
      case 'promise-done':
      case 'promise-undone':
      case 'promise-deleted':
      case 'promise-overdue':
        notify('💕 甜蜜约定', msg.detail)
        if (loadedLists.value.promises) {
          void loadPromises()
        }
        void loadOverview()
        break
      case 'checkin':
        notify('🌅 每日仪式', msg.detail)
        void loadOverview()
        break
      case 'ritual-unlocked':
        notify('🎉 仪式达成', msg.detail)
        void loadOverview()
        break
      case 'question-answered':
        notify('💬 今日一问', msg.detail)
        if (loadedLists.value.question) {
          void loadQuestion()
        }
        break
      case 'items-changed':
        notify('✨ 共享清单', msg.detail)
        if (loadedLists.value.items) {
          void loadItems()
        }
        break
      case 'anniversaries-changed':
      case 'anniversary-updated':
        notify('📅 共同日历', msg.detail)
        if (loadedLists.value.anniversaries) {
          void loadAnniversaries()
        }
        void loadOverview()
        break
      case 'mood-changed':
        notify('💗 心情日记', msg.detail)
        if (loadedLists.value.moods) {
          void loadMoods()
        }
        if (loadedLists.value.intimacy) {
          void loadIntimacy()
        }
        break
      case 'letter-created':
        notify('💌 悄悄话', msg.detail)
        void loadOverview()
        if (loadedLists.value.letters) {
          void loadLetters()
        }
        break
      case 'letter-opened':
        notify('💌 悄悄话', msg.detail)
        if (loadedLists.value.letters) {
          void loadLetters()
        }
        break
      case 'anniversary-reminder':
        notify('📅 纪念日提醒', msg.detail)
        break
      case 'pact-created':
      case 'pact-accepted':
      case 'pact-deleted':
        notify('🤝 恋爱条约', msg.detail)
        if (loadedLists.value.pacts) {
          void loadPacts()
        }
        break
      case 'fund-created':
      case 'fund-deposit':
      case 'fund-deleted':
        notify('💰 心愿基金', msg.detail)
        if (loadedLists.value.funds) {
          void loadFunds()
        }
        break
      case 'fund-reached':
        notify('🎉 心愿达成', msg.detail)
        if (loadedLists.value.funds) {
          void loadFunds()
        }
        break
      case 'city-changed':
        notify('📍 异地恋助手', msg.detail)
        if (loadedLists.value.cityCard) {
          void loadCityCard()
        }
        break
      case 'bond-action':
        notify('🫶 贴贴', msg.detail)
        if (loadedLists.value.bond) {
          void loadBond()
        }
        break
      case 'bond-milestone':
        notify('🎉 贴贴里程碑', msg.detail)
        if (loadedLists.value.bond) {
          void loadBond()
        }
        break
      case 'mood-reacted':
        notify('💗 心情回应', msg.detail)
        if (loadedLists.value.moods) {
          void loadMoods()
        }
        if (loadedLists.value.bond) {
          void loadBond()
        }
        break
      case 'pet-name-changed':
        notify('🏷️ 专属爱称', msg.detail)
        void loadOverview()
        break
      case 'task-done':
        notify('✅ 甜蜜任务', msg.detail)
        if (loadedLists.value.ritual) {
          void loadRitual()
          void loadRecentTasks()
        }
        break
      case 'tacit-started':
        notify('🎯 默契考验', msg.detail)
        if (loadedLists.value.ritual) {
          void loadRitual()
        }
        break
      case 'tacit-answered':
        notify('🎯 默契考验', msg.detail)
        if (loadedLists.value.ritual) {
          void loadRitual()
        }
        break
      case 'tacit-settled':
        notify(msg.detail.includes('心有灵犀') ? '🎉 心有灵犀' : '🎯 默契考验', msg.detail)
        if (loadedLists.value.ritual) {
          void loadRitual()
        }
        break
      case 'reconcile-sent':
        notify('🤍 和好卡', msg.detail)
        if (loadedLists.value.care) {
          void loadCare()
        }
        break
      case 'reconcile-accepted':
        notify('🤗 和好啦', msg.detail)
        if (loadedLists.value.care) {
          void loadCare()
        }
        break
      case 'praise-posted':
        notify('🌟 夸夸墙', msg.detail)
        if (loadedLists.value.care) {
          void loadCare()
        }
        break
      case 'praise-received':
        notify('🌟 夸夸墙', msg.detail)
        if (loadedLists.value.care) {
          void loadCare()
        }
        break
      case 'cycle-updated':
        notify('🌸 温柔模式', msg.detail)
        if (loadedLists.value.care) {
          void loadCare()
        }
        break
      case 'first-aid':
        notify('💧 情绪急救箱', msg.detail)
        if (loadedLists.value.care) {
          void loadCare()
        }
        break
      case 'capsule-sealed':
        notify('⏳ 时光胶囊', msg.detail)
        if (loadedLists.value.memory) {
          void loadCapsules()
        }
        break
      case 'capsule-opened':
        notify('⏳ 时光胶囊', msg.detail)
        if (loadedLists.value.memory) {
          void loadCapsules()
        }
        break
      case 'countdown-added':
        notify('⏳ 倒数日', msg.detail)
        if (loadedLists.value.memory) {
          void loadCountdowns()
        }
        break
      case 'countdown-done':
        notify('🎉 期待成真', msg.detail)
        if (loadedLists.value.memory) {
          void loadCountdowns()
        }
        if (loadedLists.value.timeline) {
          void loadTimeline()
        }
        break
      case 'countdown-reminder':
        notify('⏳ 倒数日提醒', msg.detail)
        if (loadedLists.value.memory) {
          void loadCountdowns()
        }
        break
      case 'chore-added':
      case 'chore-done':
        notify('🧹 家务轮值', msg.detail)
        if (loadedLists.value.life) {
          void coupleApi.chores().then((v) => (chores.value = v ?? []))
        }
        break
      case 'date-plan-added':
        notify('📝 约会规划', msg.detail)
        if (loadedLists.value.life) {
          void coupleApi.datePlans().then((v) => (datePlans.value = v ?? []))
        }
        break
      case 'date-plan-done':
        notify('💕 约会完成', msg.detail)
        if (loadedLists.value.life) {
          void coupleApi.datePlans().then((v) => (datePlans.value = v ?? []))
        }
        if (loadedLists.value.timeline) {
          void loadTimeline()
        }
        break
      case 'habit-added':
      case 'habit-checkin':
      case 'habit-both-done':
        notify('💪 双人习惯', msg.detail)
        if (loadedLists.value.life) {
          void coupleApi.habits().then((v) => (habits.value = v ?? []))
        }
        break
      case 'cipher-added':
        notify('🔑 暗号小本本', msg.detail)
        if (loadedLists.value.life) {
          void coupleApi.ciphers().then((v) => (ciphers.value = v ?? []))
        }
        break
      case 'space-themed':
        notify('✨ 空间个性化', msg.detail)
        void init()
        break
      case 'message-hearted':
        notify('💗 心动时刻', msg.detail)
        window.dispatchEvent(new CustomEvent('arechat:heart-changed'))
        break
      case 'message-unhearted':
        window.dispatchEvent(new CustomEvent('arechat:heart-changed'))
        break
      case 'first-added':
      case 'first-removed':
        notify('🧾 我们的第一次', msg.detail)
        if (loadedLists.value.memory) {
          void loadFirsts()
        }
        break
      case 'answer-reacted':
        notify('💬 一问互评', msg.detail)
        break
      case 'scratch-scratched':
      case 'scratch-redeemed':
        notify('🎟️ 爱情刮刮乐', msg.detail)
        if (loadedLists.value.surprise) {
          void loadSurprise()
        }
        break
      case 'box-received':
      case 'box-opened':
        notify('🎁 恋爱盲盒', msg.detail)
        if (loadedLists.value.surprise) {
          void loadSurprise()
        }
        break
      case 'alarm-fired':
        notify('⏰ 心动闹钟', msg.detail)
        if (loadedLists.value.surprise) {
          void loadSurprise()
        }
        break
      case 'miss-delivered':
        notify('📮 思念速递', msg.detail)
        if (loadedLists.value.surprise) {
          void loadSurprise()
        }
        break
      case 'treasure-sent':
      case 'treasure-done':
        notify('🗺️ 藏宝图', msg.detail)
        if (loadedLists.value.surprise) {
          void loadSurprise()
        }
        break
      case 'confession-kept':
      case 'confession-replay':
        notify('💌 告白重现', msg.detail)
        if (loadedLists.value.surprise) {
          void loadSurprise()
        }
        break
      case 'garden-watered':
      case 'garden-stageup':
      case 'garden-withered':
      case 'garden-revived':
        notify('🌱 爱情花园', msg.detail)
        if (loadedLists.value.garden) {
          void loadGarden()
        }
        break
      case 'rose-received':
        notify('🌹 每日玫瑰', msg.detail)
        if (loadedLists.value.garden) {
          void loadGarden()
        }
        break
      case 'slip-received':
        notify('🔮 幸运签', msg.detail)
        if (loadedLists.value.garden) {
          void loadGarden()
        }
        break
      case 'birthday-card':
        notify('🎂 生日彩蛋', msg.detail)
        break
      case 'notify-ignored':
        // 占位事件：仅计入通知未读
        break
      default:
        break
    }
    // F41 通知中心：任何情侣事件都计入未读（列表加载过才同步刷新）
    notifyUnread.value++
    if (notifies.value.length > 0) {
      void loadNotifies()
    }
  }

  return {
    overview,
    promises,
    question,
    items,
    anniversaries,
    moods,
    timeline,
    intimacy,
    letters,
    questionHistory,
    pacts,
    funds,
    cityCard,
    bondStats,
    bondActions,
    moodReaction,
    task,
    recentTasks,
    tacit,
    tacitHistory,
    fortune,
    goodnightStory,
    weather,
    firstAid,
    reconciles,
    praises,
    cycleCard,
    badges,
    onThisDay,
    capsules,
    countdowns,
    expenses,
    chores,
    datePlans,
    habits,
    ciphers,
    monthlyReport,
    dataOverview,
    boost,
    heatmap,
    moodCurve,
    trafficLight,
    notifies,
    notifyUnread,
    firsts,
    promiseDraft,
    space,
    established,
    incomingInvites,
    outgoingInvites,
    incomingInvite,
    outgoingInvite,
    checkins,
    overdueCount,
    letterUnread,
    init,
    reset,
    loadOverview,
    handleCoupleEvent,
    invite,
    acceptInvite,
    rejectInvite,
    cancelInvite,
    setAnniversary,
    dissolve,
    loadPromises,
    createPromise,
    donePromise,
    undonePromise,
    deletePromise,
    checkin,
    loadQuestion,
    answerQuestion,
    loadItems,
    createItem,
    updateItem,
    deleteItem,
    loadAnniversaries,
    createAnniversary,
    deleteAnniversary,
    loadMoods,
    saveMood,
    loadTimeline,
    loadIntimacy,
    loadLetters,
    createLetter,
    openLetter,
    deleteLetter,
    loadQuestionHistory,
    loadPacts,
    createPact,
    acceptPact,
    deletePact,
    loadCityCard,
    setCity,
    loadFunds,
    createFund,
    depositFund,
    deleteFund,
    loadBond,
    sendAction,
    reactMood,
    loadMoodReaction,
    setPetName,
    loadRitual,
    loadRecentTasks,
    doneTask,
    startTacit,
    answerTacit,
    loadTacitHistory,
    drawLoveWord,
    loadCare,
    sendReconcile,
    acceptReconcile,
    postPraise,
    receivePraise,
    saveCycle,
    loadBadges,
    loadOnThisDay,
    loadCapsules,
    sealCapsule,
    openCapsule,
    loadCountdowns,
    addCountdown,
    doneCountdown,
    deleteCountdown,
    loadLife,
    addExpense,
    deleteExpense,
    addChore,
    doneChore,
    deleteChore,
    addDatePlan,
    doneDatePlan,
    deleteDatePlan,
    addHabit,
    checkinHabit,
    toggleHabit,
    deleteHabit,
    addCipher,
    deleteCipher,
    updateProfile,
    loadMonthlyReport,
    loadDataOverview,
    loadGame,
    loadNotifies,
    readAllNotifies,
    loadFirsts,
    addFirst,
    removeFirst,
    scratches,
    boxes,
    alarms,
    missBoard,
    treasures,
    confessions,
    garden,
    roseBoard,
    slipBoard,
    loadSurprise,
    scratchCard,
    redeemScratch,
    createBox,
    openBox,
    createAlarm,
    cancelAlarm,
    sendMiss,
    createConfession,
    deleteConfession,
    createTreasure,
    completeTreasure,
    loadGarden,
    waterGarden,
    sendRose,
    drawSlip,
  }
})

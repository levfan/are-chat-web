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
  CoupleComfortBoardVO,
  CoupleMoodSyncVO,
  CouplePeaceDayVO,
  CoupleSorryTicketVO,
  CoupleTruthTodayVO,
  CoupleTruthHistoryVO,
  CoupleWhisperVO,
  CoupleTelepathyBoardVO,
  CoupleLoveBankBoardVO,
  CoupleChallengeBoardVO,
  CouplePassbookBoardVO,
  CoupleHundredVO,
  CoupleWishVO,
  CoupleTravelVO,
  CoupleNextTimeVO,
  CoupleReadPlanVO,
  CoupleWatchVO,
  CoupleDictVO,
  CoupleChronicleYearVO,
  CoupleArchaeologyCardVO,
  CoupleQuizQuestionVO,
  CoupleAnniversaryReportVO,
  CoupleBirthdayLookVO,
  CoupleQuoteVO,
  CoupleTicketVO,
  CoupleSongVO,
  CoupleTodayBoardVO,
  CoupleYearHeatmapVO,
  CoupleTranslationVO,
  CoupleCoolDownVO,
  CoupleRelayVO,
  CoupleGuessVO,
  CoupleStoryChainVO,
  CoupleDictQuizVO,
  CoupleApologyVO,
  CoupleFeelingVO,
  CoupleRadioVO,
  CoupleHandholdVO,
  CoupleMissDailyVO,
  CoupleRoutineVO,
  CoupleReunionLetterVO,
  CoupleCloudDateVO,
  CoupleSafetyVO,
  CoupleReunionLogVO,
  CoupleEnergyVO,
  CoupleDistanceReportVO,
  CoupleSecurityBoardVO,
  CoupleCheckupVO,
  CoupleDecadeVO,
  CoupleVisionVO,
  CoupleOathVO,
  CoupleTrustBoardVO,
  CoupleRingBoardVO,
  CoupleContractVO,
  CouplePetVO,
  CoupleSurveyVO,
  CoupleQuizVO,
  CoupleLessonVO,
  CoupleBlindVO,
  CoupleBattleVO,
  CoupleHeartbeatVO,
  CoupleLoveWeatherVO,
  CoupleTarotVO,
  CoupleArtVO,
  CoupleThemeSongVO,
  CoupleDreamVO,
  CoupleFoodNoteVO,
  CouplePartnerFactVO,
  CoupleSosVO,
  CoupleThreeVO,
  CoupleDailyPraiseVO,
  CoupleCustomBadgeVO,
  CoupleDashboardVO,
  CoupleHabitStreakVO,
  CoupleThanksVO,
  CoupleFeelFamilyVO,
  CoupleFeelVO,
  CoupleWeekStarVO,
  CoupleReadMinuteVO,
  CoupleDelayVO,
  CouplePraiseBankVO,
  CoupleMorningVO,
  CoupleYearKeywordVO,
  CouplePoemChainVO,
  CouplePoem3VO,
  CoupleMorningBoxVO,
  CoupleBottleVO,
  CoupleCipherNoteVO,
  CoupleSoulVO,
  CoupleJournalVO,
  CoupleLetterTemplateVO,
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
  /** F60/F63/F64 求抱抱 / 情绪同步率 */
  const comfortBoard = ref<CoupleComfortBoardVO | null>(null)
  const moodSync = ref<CoupleMoodSyncVO | null>(null)
  /** F61/F62 矛盾复盘 / 道歉券 */
  const peaceReviews = ref<CouplePeaceDayVO[]>([])
  const sorryTickets = ref<CoupleSorryTicketVO[]>([])
  /** F66/F68 真心话 / 心灵感应 */
  const truthToday = ref<CoupleTruthTodayVO | null>(null)
  const truthHistory = ref<CoupleTruthHistoryVO[]>([])
  const telepathy = ref<CoupleTelepathyBoardVO | null>(null)
  /** F67/F69 树洞 / 情话储蓄罐 */
  const whispers = ref<CoupleWhisperVO[]>([])
  const loveBank = ref<CoupleLoveBankBoardVO | null>(null)
  /** F70-F79 共同养成 */
  const challenge = ref<CoupleChallengeBoardVO | null>(null)
  const passbook = ref<CouplePassbookBoardVO | null>(null)
  const hundreds = ref<CoupleHundredVO[]>([])
  const wishes = ref<CoupleWishVO[]>([])
  const travels = ref<CoupleTravelVO[]>([])
  const nextTimes = ref<CoupleNextTimeVO[]>([])
  const readPlans = ref<CoupleReadPlanVO[]>([])
  const watchlist = ref<CoupleWatchVO[]>([])
  const dictWords = ref<CoupleDictVO[]>([])
  /** F80-F89 回忆资产 */
  const chronicleYears = ref<CoupleChronicleYearVO[]>([])
  const archaeologyCard = ref<CoupleArchaeologyCardVO | null>(null)
  const quizQuestions = ref<CoupleQuizQuestionVO[]>([])
  const anniversaryReport = ref<CoupleAnniversaryReportVO | null>(null)
  const birthdayLook = ref<CoupleBirthdayLookVO | null>(null)
  const quotes = ref<CoupleQuoteVO[]>([])
  const tickets = ref<CoupleTicketVO[]>([])
  const songs = ref<CoupleSongVO[]>([])
  /** F95/F96 体验优化 */
  const todayBoard = ref<CoupleTodayBoardVO | null>(null)
  const yearHeatmap = ref<CoupleYearHeatmapVO | null>(null)
  /** F100-F109 会说情话·沟通增强 */
  const commTranslation = ref<CoupleTranslationVO | null>(null)
  const coolDowns = ref<CoupleCoolDownVO[]>([])
  const relays = ref<CoupleRelayVO[]>([])
  const guessRounds = ref<CoupleGuessVO[]>([])
  const stories = ref<CoupleStoryChainVO[]>([])
  const dictQuiz = ref<CoupleDictQuizVO | null>(null)
  const sweetLine = ref<string>('')
  const apologies = ref<CoupleApologyVO[]>([])
  const feelings = ref<CoupleFeelingVO[]>([])
  const goodnightRadio = ref<CoupleRadioVO | null>(null)
  // 异地恋（F110-F119）
  const handhold = ref<CoupleHandholdVO | null>(null)
  const missDaily = ref<CoupleMissDailyVO | null>(null)
  const routine = ref<CoupleRoutineVO | null>(null)
  const reunionLetters = ref<CoupleReunionLetterVO[]>([])
  const cloudDates = ref<CoupleCloudDateVO[]>([])
  const safeties = ref<CoupleSafetyVO[]>([])
  const reunionLogs = ref<CoupleReunionLogVO[]>([])
  const energy = ref<CoupleEnergyVO | null>(null)
  const distanceReport = ref<CoupleDistanceReportVO | null>(null)
  // 确定感（F120-F129）
  const securityBoard = ref<CoupleSecurityBoardVO | null>(null)
  const checkup = ref<CoupleCheckupVO | null>(null)
  const decade = ref<CoupleDecadeVO | null>(null)
  const visions = ref<CoupleVisionVO[]>([])
  const oaths = ref<CoupleOathVO[]>([])
  const trustBoard = ref<CoupleTrustBoardVO | null>(null)
  const rings = ref<CoupleRingBoardVO | null>(null)
  const contracts = ref<CoupleContractVO[]>([])
  const pet = ref<CouplePetVO | null>(null)
  // 趣味游戏（F130-F139）
  const survey = ref<CoupleSurveyVO | null>(null)
  const quizzes = ref<CoupleQuizVO[]>([])
  const lesson = ref<CoupleLessonVO | null>(null)
  const blind = ref<CoupleBlindVO | null>(null)
  const battle = ref<CoupleBattleVO | null>(null)
  const heartbeat = ref<CoupleHeartbeatVO | null>(null)
  const loveWeather = ref<CoupleLoveWeatherVO | null>(null)
  const tarot = ref<CoupleTarotVO | null>(null)
  const arts = ref<CoupleArtVO[]>([])
  // 深度陪伴（F140-F149）
  const themeSong = ref<CoupleThemeSongVO | null>(null)
  const dreams = ref<CoupleDreamVO[]>([])
  const foods = ref<CoupleFoodNoteVO[]>([])
  const facts = ref<CouplePartnerFactVO[]>([])
  const soses = ref<CoupleSosVO[]>([])
  const three = ref<CoupleThreeVO | null>(null)
  const dailyPraise = ref<CoupleDailyPraiseVO | null>(null)
  const customBadges = ref<CoupleCustomBadgeVO[]>([])
  const dashboard = ref<CoupleDashboardVO | null>(null)
  // 成长系（F150-F159）
  const streaks = ref<CoupleHabitStreakVO[]>([])
  const thanksNotes = ref<CoupleThanksVO[]>([])
  const coachFeelFamilies = ref<CoupleFeelFamilyVO[]>([])
  const coachFeelToday = ref<CoupleFeelVO | null>(null)
  const coachWeekStar = ref<CoupleWeekStarVO | null>(null)
  const coachRead = ref<CoupleReadMinuteVO | null>(null)
  const delayTasks = ref<CoupleDelayVO[]>([])
  const praiseBankList = ref<CouplePraiseBankVO[]>([])
  const coachMorning = ref<CoupleMorningVO | null>(null)
  const coachYearKeyword = ref<CoupleYearKeywordVO | null>(null)
  // 文字浪漫（F160-F169）
  const poemChain = ref<CouplePoemChainVO | null>(null)
  const poems3 = ref<CouplePoem3VO[]>([])
  const morningBox = ref<CoupleMorningBoxVO | null>(null)
  const bottleList = ref<CoupleBottleVO[]>([])
  const cipherNoteList = ref<CoupleCipherNoteVO[]>([])
  const soulQ = ref<CoupleSoulVO | null>(null)
  const journalList = ref<CoupleJournalVO[]>([])
  const loveQuote = ref('')
  const letterTemplates = ref<CoupleLetterTemplateVO[]>([])
  const stickerList = ref<string[]>([])
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
    comfort: false,
    makeup: false,
    deep: false,
    whisper: false,
    growth: false,
    chronicle: false,
    keepsake: false,
    comm: false,
    distance: false,
    secure: false,
    play: false,
    dailyLife: false,
    coach: false,
    poem: false,
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
    comfortBoard.value = null
    moodSync.value = null
    peaceReviews.value = []
    sorryTickets.value = []
    truthToday.value = null
    truthHistory.value = []
    telepathy.value = null
    whispers.value = []
    loveBank.value = null
    challenge.value = null
    passbook.value = null
    hundreds.value = []
    wishes.value = []
    travels.value = []
    nextTimes.value = []
    readPlans.value = []
    watchlist.value = []
    dictWords.value = []
    chronicleYears.value = []
    archaeologyCard.value = null
    quizQuestions.value = []
    anniversaryReport.value = null
    birthdayLook.value = null
    quotes.value = []
    tickets.value = []
    songs.value = []
    todayBoard.value = null
    yearHeatmap.value = null
    commTranslation.value = null
    coolDowns.value = []
    relays.value = []
    guessRounds.value = []
    stories.value = []
    dictQuiz.value = null
    sweetLine.value = ''
    apologies.value = []
    feelings.value = []
    goodnightRadio.value = null
    handhold.value = null
    missDaily.value = null
    routine.value = null
    reunionLetters.value = []
    cloudDates.value = []
    safeties.value = []
    reunionLogs.value = []
    energy.value = null
    distanceReport.value = null
    securityBoard.value = null
    checkup.value = null
    decade.value = null
    visions.value = []
    oaths.value = []
    trustBoard.value = null
    rings.value = null
    contracts.value = []
    pet.value = null
    survey.value = null
    quizzes.value = []
    lesson.value = null
    blind.value = null
    battle.value = null
    heartbeat.value = null
    loveWeather.value = null
    tarot.value = null
    arts.value = []
    themeSong.value = null
    dreams.value = []
    foods.value = []
    facts.value = []
    soses.value = []
    three.value = null
    dailyPraise.value = null
    customBadges.value = []
    dashboard.value = null
    streaks.value = []
    thanksNotes.value = []
    coachFeelFamilies.value = []
    coachFeelToday.value = null
    coachWeekStar.value = null
    coachRead.value = null
    delayTasks.value = []
    praiseBankList.value = []
    coachMorning.value = null
    coachYearKeyword.value = null
    poemChain.value = null
    poems3.value = []
    morningBox.value = null
    bottleList.value = []
    cipherNoteList.value = []
    soulQ.value = null
    journalList.value = []
    loveQuote.value = ''
    letterTemplates.value = []
    stickerList.value = []
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
      comfort: false,
      makeup: false,
      deep: false,
      whisper: false,
      growth: false,
      chronicle: false,
      keepsake: false,
      comm: false,
      distance: false,
      secure: false,
      play: false,
      dailyLife: false,
      coach: false,
      poem: false,
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

  async function createAnniversary(body: { title: string; date: string; yearly: boolean; kind?: string }) {
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

  // ---------- F60-F69 懂我与被接住 ----------

  /** 求抱抱 + 情绪同步率 */
  async function loadComfort() {
    const [c, s] = await Promise.all([coupleApi.comfortBoard(), coupleApi.moodSync()])
    comfortBoard.value = c
    moodSync.value = s
    loadedLists.value.comfort = true
  }

  async function askComfort(feeling: string) {
    comfortBoard.value = await coupleApi.askComfort(feeling)
  }

  async function giveComfort(note: string) {
    const vo = await coupleApi.handleComfort(note)
    await loadComfort()
    return vo
  }

  /** 矛盾复盘 + 道歉券 */
  async function loadMakeup() {
    const [r, t] = await Promise.all([coupleApi.peaceReviews(), coupleApi.sorryTickets()])
    peaceReviews.value = r ?? []
    sorryTickets.value = t ?? []
    loadedLists.value.makeup = true
  }

  async function savePeaceReview(myPart: string, nextTime: string) {
    peaceReviews.value = (await coupleApi.savePeaceReview(myPart, nextTime)) ?? []
  }

  async function sendSorry(note: string) {
    sorryTickets.value = (await coupleApi.sendSorry(note)) ?? []
  }

  async function useSorry(id: string, usedNote?: string) {
    sorryTickets.value = (await coupleApi.useSorry(id, usedNote)) ?? []
  }

  /** 真心话 + 心灵感应 */
  async function loadDeep() {
    const [t, h, tp] = await Promise.all([coupleApi.truthToday(), coupleApi.truthHistory(), coupleApi.telepathyBoard()])
    truthToday.value = t
    truthHistory.value = h ?? []
    telepathy.value = tp
    loadedLists.value.deep = true
  }

  async function answerTruth(answer: string) {
    truthToday.value = await coupleApi.answerTruth(answer)
    truthHistory.value = (await coupleApi.truthHistory()) ?? []
    return truthToday.value
  }

  async function startTelepathy() {
    telepathy.value = await coupleApi.startTelepathy()
  }

  async function answerTelepathy(answer: string) {
    telepathy.value = await coupleApi.answerTelepathy(answer)
    return telepathy.value
  }

  /** 树洞 + 情话储蓄罐 */
  async function loadWhisperBox() {
    const [w, lb] = await Promise.all([coupleApi.whispers(), coupleApi.loveBank()])
    whispers.value = w ?? []
    loveBank.value = lb
    loadedLists.value.whisper = true
  }

  async function askWhisper(question: string, anonymous: boolean) {
    whispers.value = (await coupleApi.askWhisper(question, anonymous)) ?? []
  }

  async function answerWhisper(id: string, answer: string) {
    whispers.value = (await coupleApi.answerWhisper(id, answer)) ?? []
  }

  async function depositLove(content: string) {
    loveBank.value = await coupleApi.depositLove(content)
  }

  // ---------- F70-F79 共同养成 ----------

  /** 挑战 + 存折 + 百日 + 心愿 + 旅行 + 下次一定 + 共读 + 追剧 + 词典 */
  async function loadGrowth() {
    const [c, pb, hd, w, tv, nt, rp, wl, dw] = await Promise.all([
      coupleApi.challenge(),
      coupleApi.passbook(),
      coupleApi.hundreds(),
      coupleApi.wishes(),
      coupleApi.travels(),
      coupleApi.nextTimes(),
      coupleApi.readPlans(),
      coupleApi.watchlist(),
      coupleApi.dictWords(),
    ])
    challenge.value = c
    passbook.value = pb
    hundreds.value = hd ?? []
    wishes.value = w ?? []
    travels.value = tv ?? []
    nextTimes.value = nt ?? []
    readPlans.value = rp ?? []
    watchlist.value = wl ?? []
    dictWords.value = dw ?? []
    loadedLists.value.growth = true
  }

  async function checkChallenge() {
    challenge.value = await coupleApi.checkChallenge()
  }

  async function depositPassbook(content: string) {
    passbook.value = await coupleApi.depositPassbook(content)
  }

  async function createHundred(goal: string, startDay?: string) {
    hundreds.value = (await coupleApi.createHundred(goal, startDay)) ?? []
  }

  async function checkinHundred(id: string, note?: string) {
    hundreds.value = (await coupleApi.checkinHundred(id, note)) ?? []
  }

  async function breakHundred(id: string) {
    hundreds.value = (await coupleApi.breakHundred(id)) ?? []
  }

  async function makeWish(wish: string) {
    wishes.value = (await coupleApi.makeWish(wish)) ?? []
  }

  async function acceptWish(id: string) {
    wishes.value = (await coupleApi.acceptWish(id)) ?? []
  }

  async function fulfillWish(id: string, doneNote?: string) {
    wishes.value = (await coupleApi.fulfillWish(id, doneNote)) ?? []
  }

  async function addTravel(place: string, wantTodo?: string) {
    travels.value = (await coupleApi.addTravel(place, wantTodo)) ?? []
  }

  async function visitTravel(id: string, visitedNote?: string) {
    travels.value = (await coupleApi.visitTravel(id, visitedNote)) ?? []
  }

  async function addNextTime(content: string, byUser?: string) {
    nextTimes.value = (await coupleApi.addNextTime(content, byUser)) ?? []
  }

  async function nudgeNextTime(id: string) {
    nextTimes.value = (await coupleApi.nudgeNextTime(id)) ?? []
  }

  async function fulfillNextTime(id: string) {
    nextTimes.value = (await coupleApi.fulfillNextTime(id)) ?? []
  }

  async function createReadPlan(title: string, totalUnits: number, unitLabel: string) {
    readPlans.value = (await coupleApi.createReadPlan(title, totalUnits, unitLabel)) ?? []
  }

  async function reportReadProgress(id: string, unit: number, note?: string) {
    readPlans.value = (await coupleApi.reportReadProgress(id, unit, note)) ?? []
  }

  async function addWatch(title: string, totalUnit?: number) {
    watchlist.value = (await coupleApi.addWatch(title, totalUnit)) ?? []
  }

  async function updateWatch(id: string, currentUnit: number) {
    watchlist.value = (await coupleApi.updateWatch(id, currentUnit)) ?? []
  }

  async function addWord(word: string, meaning: string) {
    dictWords.value = (await coupleApi.addWord(word, meaning)) ?? []
  }

  async function removeWord(id: string) {
    dictWords.value = (await coupleApi.removeWord(id)) ?? []
  }

  // ---------- F80-F89 回忆资产 ----------

  /** 编年史 + 周年报告 + 生日回顾 */
  async function loadChronicle() {
    const [years, report] = await Promise.all([coupleApi.chronicle(), coupleApi.anniversaryReport()])
    chronicleYears.value = years ?? []
    anniversaryReport.value = report
    loadedLists.value.chronicle = true
  }

  async function digArchaeology() {
    archaeologyCard.value = await coupleApi.archaeology()
    return archaeologyCard.value
  }

  async function loadQuiz() {
    quizQuestions.value = (await coupleApi.quiz()) ?? []
    return quizQuestions.value
  }

  async function loadBirthdayLook() {
    birthdayLook.value = await coupleApi.birthdayLook()
    return birthdayLook.value
  }

  /** 语录册 + 票根 + 歌单 */
  async function loadKeepsake() {
    const [q, t, s] = await Promise.all([coupleApi.quotes(), coupleApi.tickets(), coupleApi.songs()])
    quotes.value = q ?? []
    tickets.value = t ?? []
    songs.value = s ?? []
    loadedLists.value.keepsake = true
  }

  async function saveQuote(content: string, context?: string) {
    quotes.value = (await coupleApi.saveQuote(content, context)) ?? []
  }

  async function removeQuote(id: string) {
    quotes.value = (await coupleApi.removeQuote(id)) ?? []
  }

  async function saveTicket(title: string, watchDay?: string, rating?: number, comment?: string) {
    tickets.value = (await coupleApi.saveTicket(title, watchDay, rating, comment)) ?? []
  }

  async function removeTicket(id: string) {
    tickets.value = (await coupleApi.removeTicket(id)) ?? []
  }

  async function saveSong(title: string, artist?: string, reason?: string) {
    songs.value = (await coupleApi.saveSong(title, artist, reason)) ?? []
  }

  async function removeSong(id: string) {
    songs.value = (await coupleApi.removeSong(id)) ?? []
  }

  // ---------- F95/F96 体验优化 ----------

  async function loadTodayBoard() {
    todayBoard.value = await coupleApi.todayBoard()
    return todayBoard.value
  }

  async function loadHeatmap(year?: number) {
    yearHeatmap.value = await coupleApi.yearHeatmap(year)
    return yearHeatmap.value
  }

  // ---------- F100-F109 会说情话·沟通增强 ----------

  /** 冷静角 + 接力棒 + 比划猜 + 故事 + 道歉卡 + 情绪词 */
  async function loadComm() {
    const [cd, rl, gs, st, ap, fw] = await Promise.all([
      coupleApi.coolDowns(),
      coupleApi.relays(),
      coupleApi.guesses(),
      coupleApi.stories(),
      coupleApi.apologies(),
      coupleApi.feelings(),
    ])
    coolDowns.value = cd ?? []
    relays.value = rl ?? []
    guessRounds.value = gs ?? []
    stories.value = st ?? []
    apologies.value = ap ?? []
    feelings.value = fw ?? []
    loadedLists.value.comm = true
  }

  async function translateText(text: string) {
    commTranslation.value = await coupleApi.translate(text)
    return commTranslation.value
  }

  async function startCoolDown(reason?: string) {
    coolDowns.value = (await coupleApi.startCoolDown(reason)) ?? []
  }

  async function softenCool(id: string, content: string) {
    coolDowns.value = (await coupleApi.softenCool(id, content)) ?? []
  }

  async function tossRelay(moodWord: string, moodEmoji?: string, note?: string) {
    relays.value = (await coupleApi.tossRelay(moodWord, moodEmoji, note)) ?? []
  }

  async function catchRelay(id: string, catchNote?: string, myMood?: string, myEmoji?: string, myNote?: string) {
    relays.value = (await coupleApi.catchRelay(id, catchNote, myMood, myEmoji, myNote)) ?? []
  }

  async function startGuess() {
    guessRounds.value = (await coupleApi.startGuess()) ?? []
  }

  async function clueGuess(id: string, clue: string) {
    guessRounds.value = (await coupleApi.clueGuess(id, clue)) ?? []
  }

  async function doGuess(id: string, word: string) {
    guessRounds.value = (await coupleApi.doGuess(id, word)) ?? []
  }

  async function startStory(content: string) {
    stories.value = (await coupleApi.startStory(content)) ?? []
  }

  async function addStoryLine(chainId: string, content: string) {
    stories.value = (await coupleApi.addStoryLine(chainId, content)) ?? []
  }

  async function finishStory(chainId: string) {
    stories.value = (await coupleApi.finishStory(chainId)) ?? []
  }

  async function loadDictQuiz() {
    dictQuiz.value = await coupleApi.dictQuiz()
    return dictQuiz.value
  }

  async function rollSweet(seed: number) {
    sweetLine.value = await coupleApi.synthSweet(seed)
    return sweetLine.value
  }

  async function sendApology(whatWrong: string, whyWrong: string, willDo: string) {
    apologies.value = (await coupleApi.sendApology(whatWrong, whyWrong, willDo)) ?? []
  }

  async function acceptApology(id: string) {
    apologies.value = (await coupleApi.acceptApology(id)) ?? []
  }

  async function saveFeeling(word: string, note?: string) {
    feelings.value = (await coupleApi.saveFeeling(word, note)) ?? []
  }

  async function loadGoodnightRadio() {
    goodnightRadio.value = await coupleApi.goodnightRadio()
    return goodnightRadio.value
  }

  // ---------- 异地恋（F110-F119） ----------

  async function loadDistance() {
    const [hh, ms, rt, lt, cd, sf, rl, en, rp] = await Promise.all([
      coupleApi.handhold(),
      coupleApi.miss(),
      coupleApi.routine(),
      coupleApi.reunionLetters(),
      coupleApi.cloudDates(),
      coupleApi.safeties(),
      coupleApi.reunions(),
      coupleApi.energy(),
      coupleApi.distanceReport(),
    ])
    handhold.value = hh
    missDaily.value = ms
    routine.value = rt
    reunionLetters.value = lt ?? []
    cloudDates.value = cd ?? []
    safeties.value = sf ?? []
    reunionLogs.value = rl ?? []
    energy.value = en
    distanceReport.value = rp
    loadedLists.value.distance = true
  }

  async function holdHand() {
    handhold.value = await coupleApi.holdHand()
  }

  async function lightMiss() {
    missDaily.value = await coupleApi.lightMiss()
  }

  async function saveRoutine(wakeTime: string, workStart: string, workEnd: string, sleepTime: string) {
    routine.value = await coupleApi.saveRoutine(wakeTime, workStart, workEnd, sleepTime)
  }

  async function writeLetter(content: string) {
    reunionLetters.value = (await coupleApi.writeLetter(content)) ?? []
  }

  async function openReunionLetter(id: string) {
    reunionLetters.value = (await coupleApi.openReunionLetter(id)) ?? []
  }

  async function addCloudDate(item?: string) {
    cloudDates.value = (await coupleApi.addCloudDate(item)) ?? []
  }

  async function doneCloudDate(id: string, note?: string) {
    cloudDates.value = (await coupleApi.doneCloudDate(id, note)) ?? []
  }

  async function pingSafety(kind: string, note?: string) {
    safeties.value = (await coupleApi.pingSafety(kind, note)) ?? []
  }

  async function logReunion(meetDay: string, note?: string) {
    reunionLogs.value = (await coupleApi.logReunion(meetDay, note)) ?? []
    energy.value = await coupleApi.energy()
    distanceReport.value = await coupleApi.distanceReport()
  }

  // ---------- 确定感与安全感（F120-F129） ----------

  async function loadSecure() {
    const [sec, chk, dec, vis, oth, trs, rng, ctr, pt] = await Promise.all([
      coupleApi.security(),
      coupleApi.checkup(),
      coupleApi.decade(),
      coupleApi.visions(),
      coupleApi.oaths(),
      coupleApi.trust(),
      coupleApi.rings(),
      coupleApi.contracts(),
      coupleApi.pet(),
    ])
    securityBoard.value = sec
    checkup.value = chk
    decade.value = dec
    visions.value = vis ?? []
    oaths.value = oth ?? []
    trustBoard.value = trs
    rings.value = rng
    contracts.value = ctr ?? []
    pet.value = pt
    loadedLists.value.secure = true
  }

  async function depositSecurity(content: string) {
    securityBoard.value = await coupleApi.depositSecurity(content)
  }

  async function acceptSecurity(id: string) {
    securityBoard.value = await coupleApi.acceptSecurity(id)
  }

  async function loadCheckup() {
    checkup.value = await coupleApi.checkup()
  }

  async function saveDecade(content: string) {
    decade.value = await coupleApi.saveDecade(content)
  }

  async function addVision(word: string, note?: string) {
    visions.value = (await coupleApi.addVision(word, note)) ?? []
  }

  async function makeOath(content: string) {
    oaths.value = (await coupleApi.makeOath(content)) ?? []
  }

  async function stampOath(id: string) {
    oaths.value = (await coupleApi.stampOath(id)) ?? []
  }

  async function depositTrust(reason?: string) {
    trustBoard.value = await coupleApi.depositTrust(reason)
  }

  async function loadRings() {
    rings.value = await coupleApi.rings()
  }

  async function makeContract(title: string, content?: string) {
    contracts.value = (await coupleApi.makeContract(title, content)) ?? []
  }

  async function checkContract(id: string) {
    contracts.value = (await coupleApi.checkContract(id)) ?? []
  }

  async function adoptPet(name: string, kind: string) {
    pet.value = await coupleApi.adoptPet(name, kind)
  }

  async function carePet() {
    pet.value = await coupleApi.carePet()
  }

  // ---------- 趣味游戏（F130-F139） ----------

  async function loadPlay() {
    const [sv, qz, ls, bd, bt, hb, lw, tr, at] = await Promise.all([
      coupleApi.survey(),
      coupleApi.quizzes(),
      coupleApi.loveLesson(),
      coupleApi.blindPick(),
      coupleApi.battle(),
      coupleApi.heartbeat(),
      coupleApi.loveWeather(),
      coupleApi.tarot(),
      coupleApi.arts(),
    ])
    survey.value = sv
    quizzes.value = qz ?? []
    lesson.value = ls
    blind.value = bd
    battle.value = bt
    heartbeat.value = hb
    loveWeather.value = lw
    tarot.value = tr
    arts.value = at ?? []
    loadedLists.value.play = true
  }

  async function answerSurvey(qNo: number, answer: string) {
    survey.value = await coupleApi.answerSurvey(qNo, answer)
  }

  async function makeQuiz(question: string) {
    quizzes.value = (await coupleApi.makeQuiz(question)) ?? []
  }

  async function answerQuiz(id: string, answer: string) {
    quizzes.value = (await coupleApi.answerQuiz(id, answer)) ?? []
  }

  async function judgeQuiz(id: string, verdict: 'RIGHT' | 'WRONG') {
    quizzes.value = (await coupleApi.judgeQuiz(id, verdict)) ?? []
  }

  async function collectLoveWord(word: string, meaning?: string) {
    lesson.value = await coupleApi.collectLoveWord(word, meaning)
  }

  async function submitBlindPick(picks: string[]) {
    blind.value = await coupleApi.submitBlindPick(picks)
  }

  async function joinBattle(content: string) {
    battle.value = await coupleApi.joinBattle(content)
  }

  async function voteBattle(toUser: string) {
    battle.value = await coupleApi.voteBattle(toUser)
  }

  async function createArt(title: string, seed: number) {
    arts.value = (await coupleApi.createArt(title, seed)) ?? []
  }

  // ---------- 深度陪伴（F140-F149） ----------

  async function loadDailyLife() {
    const [ts, dm, fd, ft, sos, th, pr, bd, db] = await Promise.all([
      coupleApi.themeSong(),
      coupleApi.dreams(),
      coupleApi.foods(),
      coupleApi.facts(),
      coupleApi.soses(),
      coupleApi.dailyThree(),
      coupleApi.dailyPraise(),
      coupleApi.customBadges(),
      coupleApi.dashboard(),
    ])
    themeSong.value = ts
    dreams.value = dm ?? []
    foods.value = fd ?? []
    facts.value = ft ?? []
    soses.value = sos ?? []
    three.value = th
    dailyPraise.value = pr
    customBadges.value = bd ?? []
    dashboard.value = db
    loadedLists.value.dailyLife = true
  }

  async function writeDream(content: string) {
    dreams.value = (await coupleApi.writeDream(content)) ?? []
  }

  async function addFood(shop: string, dish: string) {
    foods.value = (await coupleApi.addFood(shop, dish)) ?? []
  }

  async function checkinFood(id: string, rating?: number, comment?: string) {
    foods.value = (await coupleApi.checkinFood(id, rating, comment)) ?? []
  }

  async function addFact(kind: string, content: string) {
    facts.value = (await coupleApi.addFact(kind, content)) ?? []
  }

  async function pingSos(message?: string) {
    soses.value = (await coupleApi.pingSos(message)) ?? []
  }

  async function holdSos(id: string) {
    soses.value = (await coupleApi.holdSos(id)) ?? []
  }

  async function saveDailyThree(joy?: string, touched?: string, wantToSay?: string) {
    three.value = await coupleApi.saveDailyThree(joy, touched, wantToSay)
  }

  async function addBadge(title: string, condition?: string) {
    customBadges.value = (await coupleApi.addBadge(title, condition)) ?? []
  }

  async function issueBadge(id: string) {
    customBadges.value = (await coupleApi.issueBadge(id)) ?? []
  }

  async function loadDashboard() {
    dashboard.value = await coupleApi.dashboard()
  }

  // ---------- 成长系（F150-F159） ----------

  async function loadCoach() {
    const [st, th, ff, ft, ws, rd, dl, pb, mo] = await Promise.all([
      coupleApi.coachHabits(),
      coupleApi.thanks(),
      coupleApi.feelFamilies(),
      coupleApi.feelToday(),
      coupleApi.weekStar(),
      coupleApi.readMinute(),
      coupleApi.delays(),
      coupleApi.praiseBank(),
      coupleApi.morning(),
    ])
    streaks.value = st ?? []
    thanksNotes.value = th ?? []
    coachFeelFamilies.value = ff ?? []
    coachFeelToday.value = ft
    coachWeekStar.value = ws
    coachRead.value = rd
    delayTasks.value = dl ?? []
    praiseBankList.value = pb ?? []
    coachMorning.value = mo
    loadedLists.value.coach = true
  }

  async function createStreak(title: string, targetDays?: number) {
    streaks.value = (await coupleApi.coachCreateHabit(title, targetDays)) ?? []
  }

  async function checkinStreak(id: string) {
    streaks.value = (await coupleApi.coachCheckinHabit(id)) ?? []
  }

  async function addThanksNote(content: string) {
    thanksNotes.value = (await coupleApi.addThanks(content)) ?? []
  }

  async function saveCoachFeel(word: string, intensity?: number, note?: string) {
    coachFeelToday.value = await coupleApi.saveFeel(word, intensity, note)
  }

  async function saveCoachWeekStar(highlight: string) {
    coachWeekStar.value = await coupleApi.saveWeekStar(highlight)
  }

  async function saveCoachRead(thought: string) {
    coachRead.value = await coupleApi.saveReadMinute(thought)
  }

  async function addDelayTask(title: string, deadlineDay?: string) {
    delayTasks.value = (await coupleApi.addDelay(title, deadlineDay)) ?? []
  }

  async function nagDelayTask(id: string) {
    delayTasks.value = (await coupleApi.nagDelay(id)) ?? []
  }

  async function doneDelayTask(id: string) {
    delayTasks.value = (await coupleApi.doneDelay(id)) ?? []
  }

  async function addPraiseBankItem(content: string, scene?: string) {
    praiseBankList.value = (await coupleApi.addPraiseBank(content, scene)) ?? []
  }

  async function loadYearKeyword(year?: number) {
    coachYearKeyword.value = await coupleApi.yearKeyword(year)
  }

  // ---------- 文字浪漫（F160-F169） ----------

  async function loadPoem() {
    const [pc, p3, mn, bt, cp, sq, jr, qt, lt, sk] = await Promise.all([
      coupleApi.poemChain(),
      coupleApi.poems3(),
      coupleApi.morningNotes(),
      coupleApi.bottles(),
      coupleApi.cipherNotes(),
      coupleApi.soul(),
      coupleApi.journal(),
      coupleApi.quote(),
      coupleApi.letterTemplates(),
      coupleApi.stickers(),
    ])
    poemChain.value = pc
    poems3.value = p3 ?? []
    morningBox.value = mn
    bottleList.value = bt ?? []
    cipherNoteList.value = cp ?? []
    soulQ.value = sq
    journalList.value = jr ?? []
    loveQuote.value = qt ?? ''
    letterTemplates.value = lt ?? []
    stickerList.value = sk ?? []
    loadedLists.value.poem = true
  }

  async function addPoemLine(line: string) {
    poemChain.value = await coupleApi.addPoemLine(line)
  }

  async function addPoem3(line1: string, line2: string, line3: string) {
    poems3.value = (await coupleApi.addPoem3(line1, line2, line3)) ?? []
  }

  async function likePoem3Item(id: string) {
    poems3.value = (await coupleApi.likePoem3(id)) ?? []
  }

  async function sealMorningNote(content: string) {
    morningBox.value = await coupleApi.sealMorningNote(content)
  }

  async function readMorningNoteItem(id: string) {
    morningBox.value = await coupleApi.readMorningNote(id)
  }

  async function tossBottle(mood: string, content: string) {
    bottleList.value = (await coupleApi.tossBottle(mood, content)) ?? []
  }

  async function replyBottleItem(id: string, reply: string) {
    bottleList.value = (await coupleApi.replyBottle(id, reply)) ?? []
  }

  async function makeCipherNote(cipher: string, hint?: string) {
    cipherNoteList.value = (await coupleApi.makeCipherNote(cipher, hint)) ?? []
  }

  async function crackCipherNoteItem(id: string) {
    cipherNoteList.value = (await coupleApi.crackCipherNote(id)) ?? []
  }

  async function answerSoul(answer: string) {
    soulQ.value = await coupleApi.answerSoul(answer)
  }

  async function saveJournalPage(sticker: string, text: string) {
    journalList.value = (await coupleApi.saveJournal(sticker, text)) ?? []
  }

  async function reloadQuote() {
    loveQuote.value = (await coupleApi.quote()) ?? ''
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
      case 'comfort-sent':
      case 'comfort-given':
        notify('🫂 求抱抱', msg.detail)
        if (loadedLists.value.comfort) {
          void loadComfort()
        }
        break
      case 'night-care':
        notify('🌙 深夜陪伴', msg.detail)
        break
      case 'peace-review-kept':
      case 'peace-review-done':
      case 'sorry-received':
      case 'sorry-used':
        notify('🕊️ 和好锦囊', msg.detail)
        if (loadedLists.value.makeup) {
          void loadMakeup()
        }
        break
      case 'truth-answered':
        notify('💬 真心话', msg.detail)
        if (loadedLists.value.deep) {
          void loadDeep()
        }
        break
      case 'telepathy-started':
      case 'telepathy-answered':
      case 'telepathy-matched':
      case 'telepathy-diff':
        notify('🧠 心灵感应', msg.detail)
        if (loadedLists.value.deep) {
          void loadDeep()
        }
        break
      case 'whisper-asked':
      case 'whisper-answered':
        notify('🕳️ 匿名树洞', msg.detail)
        if (loadedLists.value.whisper) {
          void loadWhisperBox()
        }
        break
      case 'love-bank-deposit':
      case 'love-bank-interest':
        notify('🏦 情话储蓄罐', msg.detail)
        if (loadedLists.value.whisper) {
          void loadWhisperBox()
        }
        break
      case 'challenge-checked':
      case 'challenge-done':
        notify('🏆 双人挑战赛', msg.detail)
        if (loadedLists.value.growth) {
          void loadGrowth()
        }
        break
      case 'passbook-deposit':
        notify('💰 恋爱存折', msg.detail)
        if (loadedLists.value.growth) {
          void loadGrowth()
        }
        break
      case 'hundred-started':
      case 'hundred-checkin':
      case 'hundred-done':
      case 'hundred-broken':
        notify('🎯 百日之约', msg.detail)
        if (loadedLists.value.growth) {
          void loadGrowth()
        }
        break
      case 'wish-received':
      case 'wish-accepted':
      case 'wish-done':
        notify('🌠 心愿互换', msg.detail)
        if (loadedLists.value.growth) {
          void loadGrowth()
        }
        break
      case 'travel-added':
      case 'travel-visited':
        notify('🗺️ 旅行心愿地图', msg.detail)
        if (loadedLists.value.growth) {
          void loadGrowth()
        }
        break
      case 'nexttime-added':
      case 'nexttime-nudged':
      case 'nexttime-done':
        notify('📝 下次一定', msg.detail)
        if (loadedLists.value.growth) {
          void loadGrowth()
        }
        break
      case 'read-started':
      case 'read-progress':
      case 'read-finished':
        notify('📚 共读计划', msg.detail)
        if (loadedLists.value.growth) {
          void loadGrowth()
        }
        break
      case 'watch-added':
      case 'watch-updated':
      case 'watch-finished':
        notify('📺 追剧清单', msg.detail)
        if (loadedLists.value.growth) {
          void loadGrowth()
        }
        break
      case 'dict-added':
        notify('📖 恋爱词典', msg.detail)
        if (loadedLists.value.growth) {
          void loadGrowth()
        }
        break
      case 'quote-kept':
        notify('📔 甜蜜语录册', msg.detail)
        if (loadedLists.value.keepsake) {
          void loadKeepsake()
        }
        break
      case 'ticket-added':
        notify('🎫 电影票根墙', msg.detail)
        if (loadedLists.value.keepsake) {
          void loadKeepsake()
        }
        break
      case 'song-added':
        notify('🎵 我们的歌单', msg.detail)
        if (loadedLists.value.keepsake) {
          void loadKeepsake()
        }
        break
      case 'capsule-due':
        notify('⏰ 时光胶囊到期', msg.detail)
        break
      case 'cool-started':
      case 'cool-soften':
      case 'cool-healed':
        notify('🧊 冷静角', msg.detail)
        if (loadedLists.value.comm) {
          void coupleApi.coolDowns().then((v) => (coolDowns.value = v ?? []))
        }
        break
      case 'relay-tossed':
      case 'relay-caught':
        notify('🥎 情绪接力棒', msg.detail)
        if (loadedLists.value.comm) {
          void coupleApi.relays().then((v) => (relays.value = v ?? []))
        }
        break
      case 'guess-started':
      case 'guess-clued':
      case 'guess-wrong':
      case 'guess-hit':
      case 'guess-missed':
        notify('🙈 你比划我猜', msg.detail)
        if (loadedLists.value.comm) {
          void coupleApi.guesses().then((v) => (guessRounds.value = v ?? []))
        }
        break
      case 'story-line':
      case 'story-done':
        notify('📖 故事接龙', msg.detail)
        if (loadedLists.value.comm) {
          void coupleApi.stories().then((v) => (stories.value = v ?? []))
        }
        break
      case 'apology-sent':
      case 'apology-accepted':
        notify('🙇 道歉三部曲', msg.detail)
        if (loadedLists.value.comm) {
          void coupleApi.apologies().then((v) => (apologies.value = v ?? []))
        }
        break
      case 'feeling-word':
        notify('📖 情绪词汇', msg.detail)
        if (loadedLists.value.comm) {
          void coupleApi.feelings().then((v) => (feelings.value = v ?? []))
        }
        break
      case 'handhold-lit':
      case 'handhold-both':
        notify('🤝 隔空牵手', msg.detail)
        if (loadedLists.value.distance) {
          void coupleApi.handhold().then((v) => (handhold.value = v))
        }
        break
      case 'miss-lit':
      case 'miss-both':
        notify('💞 想念计量所', msg.detail)
        if (loadedLists.value.distance) {
          void coupleApi.miss().then((v) => (missDaily.value = v))
        }
        break
      case 'routine-updated':
        notify('⏰ 作息表', msg.detail)
        if (loadedLists.value.distance) {
          void coupleApi.routine().then((v) => (routine.value = v))
        }
        break
      case 'reunion-letter-sealed':
      case 'reunion-letter-opened':
        notify('✉️ 下次见面信', msg.detail)
        if (loadedLists.value.distance) {
          void coupleApi.reunionLetters().then((v) => (reunionLetters.value = v ?? []))
        }
        break
      case 'cloud-added':
      case 'cloud-done':
        notify('☁️ 云约会清单', msg.detail)
        if (loadedLists.value.distance) {
          void coupleApi.cloudDates().then((v) => (cloudDates.value = v ?? []))
        }
        break
      case 'safety-ping':
        notify('🛡️ 平安卡', msg.detail)
        if (loadedLists.value.distance) {
          void coupleApi.safeties().then((v) => (safeties.value = v ?? []))
        }
        break
      case 'reunion-logged':
        notify('📅 见面日记', msg.detail)
        if (loadedLists.value.distance) {
          void loadDistance()
        }
        break
      case 'security-deposit':
      case 'security-accepted':
        notify('🫙 安全感账户', msg.detail)
        if (loadedLists.value.secure) {
          void coupleApi.security().then((v) => (securityBoard.value = v))
        }
        break
      case 'decade-written':
      case 'decade-complete':
        notify('⏳ 十年之约', msg.detail)
        if (loadedLists.value.secure) {
          void coupleApi.decade().then((v) => (decade.value = v))
        }
        break
      case 'vision-added':
      case 'vision-resonate':
        notify('✨ 愿景板', msg.detail)
        if (loadedLists.value.secure) {
          void coupleApi.visions().then((v) => (visions.value = v ?? []))
        }
        break
      case 'oath-made':
      case 'oath-stamped':
      case 'oath-exhibited':
        notify('🖋️ 承诺博物馆', msg.detail)
        if (loadedLists.value.secure) {
          void coupleApi.oaths().then((v) => (oaths.value = v ?? []))
        }
        break
      case 'trust-deposit':
        notify('🪙 信任存折', msg.detail)
        if (loadedLists.value.secure) {
          void coupleApi.trust().then((v) => (trustBoard.value = v))
        }
        break
      case 'contract-made':
      case 'contract-checkin':
        notify('📜 双人契约', msg.detail)
        if (loadedLists.value.secure) {
          void coupleApi.contracts().then((v) => (contracts.value = v ?? []))
        }
        break
      case 'pet-adopted':
      case 'pet-cared':
        notify('🐾 守护兽', msg.detail)
        if (loadedLists.value.secure) {
          void coupleApi.pet().then((v) => (pet.value = v))
        }
        break
      case 'survey-answered':
        notify('📝 一百问', msg.detail)
        if (loadedLists.value.play) {
          void coupleApi.survey().then((v) => (survey.value = v))
        }
        break
      case 'quiz-made':
      case 'quiz-answered':
      case 'quiz-judged':
        notify('🎯 出题考TA', msg.detail)
        if (loadedLists.value.play) {
          void coupleApi.quizzes().then((v) => (quizzes.value = v ?? []))
        }
        break
      case 'love-word-kept':
        notify('💘 世界情话课', msg.detail)
        if (loadedLists.value.play) {
          void coupleApi.loveLesson().then((v) => (lesson.value = v))
        }
        break
      case 'blind-submitted':
      case 'blind-settled':
        notify('🎁 周末盲选', msg.detail)
        if (loadedLists.value.play) {
          void coupleApi.blindPick().then((v) => (blind.value = v))
        }
        break
      case 'battle-joined':
      case 'battle-full':
      case 'battle-voted':
      case 'battle-done':
        notify('💘 情话Battle', msg.detail)
        if (loadedLists.value.play) {
          void coupleApi.battle().then((v) => (battle.value = v))
        }
        break
      case 'art-added':
        notify('🎨 抽象画', msg.detail)
        if (loadedLists.value.play) {
          void coupleApi.arts().then((v) => (arts.value = v ?? []))
        }
        break
      case 'dream-written':
        notify('🌙 梦境手账', msg.detail)
        if (loadedLists.value.dailyLife) {
          void coupleApi.dreams().then((v) => (dreams.value = v ?? []))
        }
        break
      case 'food-added':
      case 'food-checkin':
        notify('🍜 美食地图', msg.detail)
        if (loadedLists.value.dailyLife) {
          void coupleApi.foods().then((v) => (foods.value = v ?? []))
        }
        break
      case 'fact-added':
        notify('📖 TA 使用手册', msg.detail)
        if (loadedLists.value.dailyLife) {
          void coupleApi.facts().then((v) => (facts.value = v ?? []))
        }
        break
      case 'sos-ping':
      case 'sos-held':
        notify('🆘 情绪 SOS', msg.detail)
        if (loadedLists.value.dailyLife) {
          void coupleApi.soses().then((v) => (soses.value = v ?? []))
        }
        break
      case 'three-saved':
      case 'three-both':
        notify('🌙 每日三问', msg.detail)
        if (loadedLists.value.dailyLife) {
          void coupleApi.dailyThree().then((v) => (three.value = v))
        }
        break
      case 'badge-added':
      case 'badge-issued':
        notify('🏅 自定义成就', msg.detail)
        if (loadedLists.value.dailyLife) {
          void coupleApi.customBadges().then((v) => (customBadges.value = v ?? []))
        }
        break
      case 'streak-started':
      case 'streak-checkin':
      case 'streak-done':
        notify('🌱 习惯搭子', msg.detail)
        if (loadedLists.value.coach) {
          void coupleApi.coachHabits().then((v) => (streaks.value = v ?? []))
        }
        break
      case 'thanks-note':
        notify('💌 感恩便签', msg.detail)
        if (loadedLists.value.coach) {
          void coupleApi.thanks().then((v) => (thanksNotes.value = v ?? []))
        }
        break
      case 'feel-logged':
        notify('🌤️ 情绪日记', msg.detail)
        if (loadedLists.value.coach) {
          void coupleApi.feelToday().then((v) => (coachFeelToday.value = v))
        }
        break
      case 'week-star-saved':
      case 'week-star-both':
        notify('⭐ 每周高光', msg.detail)
        if (loadedLists.value.coach) {
          void coupleApi.weekStar().then((v) => (coachWeekStar.value = v))
        }
        break
      case 'read-thought':
        notify('📖 共读一分钟', msg.detail)
        if (loadedLists.value.coach) {
          void coupleApi.readMinute().then((v) => (coachRead.value = v))
        }
        break
      case 'delay-added':
      case 'delay-nagged':
      case 'delay-done':
        notify('🙈 拖延互助所', msg.detail)
        if (loadedLists.value.coach) {
          void coupleApi.delays().then((v) => (delayTasks.value = v ?? []))
        }
        break
      case 'praise-bank-added':
        notify('🏦 优点存折', msg.detail)
        if (loadedLists.value.coach) {
          void coupleApi.praiseBank().then((v) => (praiseBankList.value = v ?? []))
        }
        break
      case 'poem-line':
      case 'poem-made':
      case 'poem-liked':
        notify('🖋️ 我们的诗', msg.detail)
        if (loadedLists.value.poem) {
          void coupleApi.poemChain().then((v) => (poemChain.value = v))
          void coupleApi.poems3().then((v) => (poems3.value = v ?? []))
        }
        break
      case 'morning-note-sealed':
      case 'morning-note-read':
        notify('🌙 醒来第一条', msg.detail)
        if (loadedLists.value.poem) {
          void coupleApi.morningNotes().then((v) => (morningBox.value = v))
        }
        break
      case 'bottle-tossed':
      case 'bottle-replied':
        notify('🌊 漂流瓶', msg.detail)
        if (loadedLists.value.poem) {
          void coupleApi.bottles().then((v) => (bottleList.value = v ?? []))
        }
        break
      case 'cipher-note-made':
      case 'cipher-note-cracked':
        notify('🔐 密码情书', msg.detail)
        if (loadedLists.value.poem) {
          void coupleApi.cipherNotes().then((v) => (cipherNoteList.value = v ?? []))
        }
        break
      case 'soul-answered':
      case 'soul-both':
        notify('🎁 灵魂一问', msg.detail)
        if (loadedLists.value.poem) {
          void coupleApi.soul().then((v) => (soulQ.value = v))
        }
        break
      case 'journal-updated':
        notify('📔 贴纸手账', msg.detail)
        if (loadedLists.value.poem) {
          void coupleApi.journal().then((v) => (journalList.value = v ?? []))
        }
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
    comfortBoard,
    moodSync,
    peaceReviews,
    sorryTickets,
    truthToday,
    truthHistory,
    telepathy,
    whispers,
    loveBank,
    loadComfort,
    askComfort,
    giveComfort,
    loadMakeup,
    savePeaceReview,
    sendSorry,
    useSorry,
    loadDeep,
    answerTruth,
    startTelepathy,
    answerTelepathy,
    loadWhisperBox,
    askWhisper,
    answerWhisper,
    depositLove,
    challenge,
    passbook,
    hundreds,
    wishes,
    travels,
    nextTimes,
    readPlans,
    watchlist,
    dictWords,
    chronicleYears,
    archaeologyCard,
    quizQuestions,
    anniversaryReport,
    birthdayLook,
    quotes,
    tickets,
    songs,
    todayBoard,
    yearHeatmap,
    loadGrowth,
    checkChallenge,
    depositPassbook,
    createHundred,
    checkinHundred,
    breakHundred,
    makeWish,
    acceptWish,
    fulfillWish,
    addTravel,
    visitTravel,
    addNextTime,
    nudgeNextTime,
    fulfillNextTime,
    createReadPlan,
    reportReadProgress,
    addWatch,
    updateWatch,
    addWord,
    removeWord,
    loadChronicle,
    digArchaeology,
    loadQuiz,
    loadBirthdayLook,
    loadKeepsake,
    saveQuote,
    removeQuote,
    saveTicket,
    removeTicket,
    saveSong,
    removeSong,
    loadTodayBoard,
    loadHeatmap,
    commTranslation,
    coolDowns,
    relays,
    guessRounds,
    stories,
    dictQuiz,
    sweetLine,
    apologies,
    feelings,
    goodnightRadio,
    handhold,
    missDaily,
    routine,
    reunionLetters,
    cloudDates,
    safeties,
    reunionLogs,
    energy,
    distanceReport,
    securityBoard,
    checkup,
    decade,
    visions,
    oaths,
    trustBoard,
    rings,
    contracts,
    pet,
    survey,
    quizzes,
    lesson,
    blind,
    battle,
    heartbeat,
    loveWeather,
    tarot,
    arts,
    themeSong,
    dreams,
    foods,
    facts,
    soses,
    three,
    dailyPraise,
    customBadges,
    dashboard,
    streaks,
    thanksNotes,
    coachFeelFamilies,
    coachFeelToday,
    coachWeekStar,
    coachRead,
    delayTasks,
    praiseBankList,
    coachMorning,
    coachYearKeyword,
    poemChain,
    poems3,
    morningBox,
    bottleList,
    cipherNoteList,
    soulQ,
    journalList,
    loveQuote,
    letterTemplates,
    stickerList,
    loadComm,
    translateText,
    startCoolDown,
    softenCool,
    tossRelay,
    catchRelay,
    startGuess,
    clueGuess,
    doGuess,
    startStory,
    addStoryLine,
    finishStory,
    loadDictQuiz,
    rollSweet,
    sendApology,
    acceptApology,
    saveFeeling,
    loadGoodnightRadio,
    loadDistance,
    holdHand,
    lightMiss,
    saveRoutine,
    writeLetter,
    openReunionLetter,
    addCloudDate,
    doneCloudDate,
    pingSafety,
    logReunion,
    loadSecure,
    depositSecurity,
    acceptSecurity,
    loadCheckup,
    saveDecade,
    addVision,
    makeOath,
    stampOath,
    depositTrust,
    loadRings,
    makeContract,
    checkContract,
    adoptPet,
    carePet,
    loadPlay,
    answerSurvey,
    makeQuiz,
    answerQuiz,
    judgeQuiz,
    collectLoveWord,
    submitBlindPick,
    joinBattle,
    voteBattle,
    createArt,
    loadDailyLife,
    writeDream,
    addFood,
    checkinFood,
    addFact,
    pingSos,
    holdSos,
    saveDailyThree,
    addBadge,
    issueBadge,
    loadDashboard,
    loadCoach,
    createStreak,
    checkinStreak,
    addThanksNote,
    saveCoachFeel,
    saveCoachWeekStar,
    saveCoachRead,
    addDelayTask,
    nagDelayTask,
    doneDelayTask,
    addPraiseBankItem,
    loadYearKeyword,
    loadPoem,
    addPoemLine,
    addPoem3,
    likePoem3Item,
    sealMorningNote,
    readMorningNoteItem,
    tossBottle,
    replyBottleItem,
    makeCipherNote,
    crackCipherNoteItem,
    answerSoul,
    saveJournalPage,
    reloadQuote,
  }
})

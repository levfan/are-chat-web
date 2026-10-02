import { http } from './http'
import type {
  CoupleActionKind,
  CoupleActionVO,
  CoupleAnniversaryVO,
  CoupleBadgeWallVO,
  CoupleBondStatsVO,
  CoupleCapsuleVO,
  CoupleCheckinStateVO,
  CoupleCheckinKind,
  CoupleAdminStatsVO,
  CoupleAnswerReactionVO,
  CoupleChoreVO,
  CoupleCityCardVO,
  CoupleCipherVO,
  CoupleCountdownVO,
  CoupleCycleCardVO,
  CoupleDataOverviewVO,
  CoupleDatePlanVO,
  CoupleExpenseCategory,
  CoupleExpenseMonthVO,
  CoupleExpenseVO,
  CoupleFirstAidVO,
  CoupleFirstVO,
  CoupleFortuneVO,
  CoupleFundVO,
  CoupleHabitVO,
  CoupleHeatmapVO,
  CoupleIntimacyBoostVO,
  CoupleIntimacyVO,
  CoupleInviteVO,
  CoupleItemVO,
  CoupleLetterVO,
  CoupleMoodCurveVO,
  CoupleMoodDayVO,
  CoupleMoodKind,
  CoupleMoodReactionKind,
  CoupleMoodReactionVO,
  CoupleMoodVO,
  CoupleOnThisDayEvent,
  CoupleOverview,
  CouplePactVO,
  CouplePraiseVO,
  CouplePromiseVO,
  CoupleQuestionHistoryVO,
  CoupleQuestionVO,
  CoupleMonthlyReportVO,
  CoupleNotifyListVO,
  CoupleRelationshipVO,
  CoupleReconcileVO,
  CoupleSpaceVO,
  CoupleStoryVO,
  CoupleTacitStateVO,
  CoupleTacitVO,
  CoupleTaskVO,
  CoupleTimelineDay,
  CoupleTrafficLightVO,
  CoupleWeatherVO,
  CoupleGardenVO,
  CoupleRoseBoardVO,
  CoupleScratchVO,
  CoupleBoxVO,
  CoupleAlarmVO,
  CoupleMissBoardVO,
  CoupleSlipBoardVO,
  CoupleTreasureVO,
  CoupleConfessionVO,
  CoupleComfortBoardVO,
  CoupleComfortVO,
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
  CoupleZodiacVO,
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
  CoupleMorningNoteVO,
  CoupleMorningBoxVO,
  CoupleBottleVO,
  CoupleCipherNoteVO,
  CoupleSoulVO,
  CoupleJournalVO,
  CoupleLetterTemplateVO,
  CoupleSparkQuizVO,
  CoupleLoveLangVO,
  CoupleLoveLangPairVO,
  CoupleFlashVO,
  CoupleWhatIfVO,
  CoupleSignalVO,
  CoupleTapResultVO,
  CoupleHeartDayVO,
  CoupleSyncRankVO,
  CoupleSparkDashboardVO,
  CoupleSparkWeeklyVO,
  CoupleManageMeetingVO,
  CoupleManageHostVO,
  CoupleManageSkillVO,
  CoupleManageMonthBoardVO,
  CoupleManageEmergencyCardVO,
  CoupleManageSnapshotVO,
  CoupleManagePointAccountVO,
  CoupleManageFiveYearPlanVO,
  CoupleManageAnnivPlanVO,
  CoupleManageWeeklyVO,
  CoupleMuseumAchievementVO,
  CoupleMuseumDndVO,
  CoupleMuseumDocSceneVO,
  CoupleMuseumExhibitVO,
  CoupleMuseumBookVO,
  CoupleMuseumGreetingVO,
  CoupleMuseumMirrorVO,
  CoupleMuseumRuleVO,
  CoupleMuseumSilverLineVO,
  CoupleMuseumWordVO,
  CoupleDineBoardVO,
  CoupleDineCartVO,
  CoupleDineDrinkVO,
  CoupleDineHomecookVO,
  CoupleDineNogoVO,
  CoupleDinePlanVO,
  CoupleDineRateVO,
  CoupleDineTicketVO,
  CoupleDineTodayVO,
  CoupleDineYearVO,
  CoupleCozyMonthlyVO,
  CoupleCozyTodayVO,
  CoupleCerChronicleVO,
  CoupleCerOverviewVO,
  CoupleBdOverviewVO,
  CoupleAlmTodayVO,
  CoupleAlmYearVO,
  CoupleAlmZodiacVO,
  CoupleLsTodayVO,
  CoupleLsToneKey,
  CoupleFyBoardVO,
  CoupleCxOverviewVO,
  CouplePostVO,
  CoupleTheaterVO,
  CoupleBodyVO,
  CoupleBodySnoreLevel,
  CoupleBodyPhase,
  CoupleBodyFitKind,
  CoupleBodyRedlineKind,
  CoupleBodyMedHow,
  CoupleRepairVO,
  CoupleWorldVO,
  CoupleWorldVisitSide,
  CoupleLegacyVO,
  CoupleLegacyItemKind,
  CoupleEchoVO,
  CoupleEchoCalendarDayVO,
  CoupleEchoYearlyVO,
  CouplePinVO,
} from '@/types'

/** 情侣空间接口：邀请建立 → 双向约定 → 每日小仪式 → 共享空间 */
export const coupleApi = {
  overview: () => http.get<CoupleOverview>('/api/couple/overview'),

  // ---------- 建立流程 ----------
  invite: (username: string, message?: string) =>
    http.postJson<CoupleInviteVO>('/api/couple/invites', { username, message: message ?? null }),
  acceptInvite: (id: string) => http.postJson<CoupleSpaceVO>(`/api/couple/invites/${id}/accept`, {}),
  rejectInvite: (id: string) => http.postJson<void>(`/api/couple/invites/${id}/reject`, {}),
  cancelInvite: (id: string) => http.delete<void>(`/api/couple/invites/${id}`),
  /** 在一起纪念日（yyyy-MM-dd） */
  setAnniversary: (date: string) => http.putJson<CoupleSpaceVO>('/api/couple/anniversary', { date }),
  dissolve: () => http.postJson<void>('/api/couple/dissolve', {}),

  // ---------- 双向待办 / 约定 ----------
  promises: () => http.get<CouplePromiseVO[]>('/api/couple/promises'),
  /** side=me 我答应 TA；side=partner TA 答应我。dueAt 毫秒时间戳（可空） */
  createPromise: (side: 'me' | 'partner', content: string, dueAt?: number | null) =>
    http.postJson<CouplePromiseVO>('/api/couple/promises', { side, content, dueAt: dueAt ?? null }),
  donePromise: (id: string) => http.postJson<CouplePromiseVO>(`/api/couple/promises/${id}/done`, {}),
  undonePromise: (id: string) => http.postJson<CouplePromiseVO>(`/api/couple/promises/${id}/undone`, {}),
  deletePromise: (id: string) => http.delete<void>(`/api/couple/promises/${id}`),

  // ---------- 每日小仪式 ----------
  checkin: (kind: CoupleCheckinKind) =>
    http.postJson<CoupleCheckinStateVO>('/api/couple/checkins', { kind }),
  question: () => http.get<CoupleQuestionVO>('/api/couple/question'),
  answerQuestion: (answer: string) =>
    http.postJson<CoupleQuestionVO>('/api/couple/question', { answer }),

  // ---------- 共享空间 ----------
  items: () => http.get<CoupleItemVO[]>('/api/couple/items'),
  createItem: (body: { kind: CoupleItemVO['kind']; title: string; note?: string; dueDate?: string | null }) =>
    http.postJson<CoupleItemVO>('/api/couple/items', { ...body, note: body.note ?? null, dueDate: body.dueDate ?? null }),
  updateItem: (id: string, body: { title?: string; note?: string; dueDate?: string | null; done?: boolean }) =>
    http.putJson<CoupleItemVO>(`/api/couple/items/${id}`, { ...body, dueDate: body.dueDate ?? null }),
  deleteItem: (id: string) => http.delete<void>(`/api/couple/items/${id}`),
  anniversaries: () => http.get<CoupleAnniversaryVO[]>('/api/couple/anniversaries'),
  createAnniversary: (body: { title: string; date: string; yearly: boolean; kind?: string }) =>
    http.postJson<CoupleAnniversaryVO>('/api/couple/anniversaries', body),
  deleteAnniversary: (id: string) => http.delete<void>(`/api/couple/anniversaries/${id}`),

  // ---------- 心情日记 ----------
  /** 记录/修改今天的心情（每人每天一条，重复提交视为修改） */
  saveMood: (mood: CoupleMoodKind, note?: string) =>
    http.postJson<CoupleMoodVO>('/api/couple/moods', { mood, note: note ?? null }),
  /** 双方最近 N 天的心情（1-90，默认 14），按日期新→旧 */
  moods: (days = 14) => http.get<CoupleMoodDayVO[]>(`/api/couple/moods?days=${days}`),

  // ---------- 恋爱时光轴 ----------
  /** 最近 N 天（1-90，默认 30）的「我们的故事」 */
  timeline: (days = 30) => http.get<CoupleTimelineDay[]>(`/api/couple/timeline?days=${days}`),

  // ---------- 心动值 & 恋爱等级 ----------
  intimacy: () => http.get<CoupleIntimacyVO>('/api/couple/intimacy'),

  // ---------- 悄悄话信箱 ----------
  /** 写一封悄悄话：deliverAt 空 = 立即可拆，非空 = 慢递（未来 7 天内，毫秒时间戳） */
  createLetter: (content: string, deliverAt?: number | null) =>
    http.postJson<CoupleLetterVO>('/api/couple/letters', { content, deliverAt: deliverAt ?? null }),
  /** 信箱列表（发件+收件，新→旧；未到期慢递对收件人隐藏内容） */
  letters: () => http.get<CoupleLetterVO[]>('/api/couple/letters'),
  openLetter: (id: string) => http.postJson<CoupleLetterVO>(`/api/couple/letters/${id}/open`, {}),
  deleteLetter: (id: string) => http.delete<void>(`/api/couple/letters/${id}`),

  // ---------- 今日一问历史 ----------
  /** 双方都回答过的一问存档（最近 N 天，1-90 默认 30，新→旧） */
  questionHistory: (days = 30) =>
    http.get<CoupleQuestionHistoryVO[]>(`/api/couple/questions/history?days=${days}`),

  // ---------- 恋爱条约 ----------
  createPact: (content: string) => http.postJson<CouplePactVO>('/api/couple/pacts', { content }),
  pacts: () => http.get<CouplePactVO[]>('/api/couple/pacts'),
  acceptPact: (id: string) => http.postJson<CouplePactVO>(`/api/couple/pacts/${id}/accept`, {}),
  deletePact: (id: string) => http.delete<void>(`/api/couple/pacts/${id}`),

  // ---------- 异地恋助手 ----------
  /** 设置/清空我的城市（清空传 null） */
  setCity: (city: string | null) => http.putJson<CoupleCityCardVO>('/api/couple/cities', { city }),
  cityCard: () => http.get<CoupleCityCardVO>('/api/couple/cities'),

  // ---------- 心愿基金 ----------
  /** 建一个共同存钱目标（targetAmount 单位：分） */
  createFund: (title: string, targetAmount: number) =>
    http.postJson<CoupleFundVO>('/api/couple/funds', { title, targetAmount }),
  funds: () => http.get<CoupleFundVO[]>('/api/couple/funds'),
  /** 存一笔钱（amount 单位：分） */
  depositFund: (id: string, amount: number, note?: string) =>
    http.postJson<CoupleFundVO>(`/api/couple/funds/${id}/deposits`, { amount, note: note ?? null }),
  deleteFund: (id: string) => http.delete<void>(`/api/couple/funds/${id}`),

  // ---------- 贴贴互动 ----------
  /** 发送一个贴贴动作（戳一戳/抱抱/亲亲/捏捏脸/蹭蹭/挠痒痒/在想你） */
  sendAction: (kind: CoupleActionKind) =>
    http.postJson<CoupleBondStatsVO>('/api/couple/bond/actions', { kind }),
  /** 最近动作流（新→旧，默认 50 条） */
  bondActions: (limit = 50) => http.get<CoupleActionVO[]>(`/api/couple/bond/actions?limit=${limit}`),
  /** 贴贴统计 */
  bondStats: () => http.get<CoupleBondStatsVO>('/api/couple/bond/stats'),
  /** 回应 TA 某天的心情（默认今天）：抱抱/亲亲/加油/摸摸头 */
  reactMood: (reaction: CoupleMoodReactionKind, day?: string) =>
    http.postJson<CoupleMoodReactionVO>('/api/couple/bond/mood-reactions', { day: day ?? null, reaction }),
  /** 某天（默认今天）双方给彼此心情的回应 */
  moodReactions: (day?: string) =>
    http.get<CoupleMoodReactionVO>(
      day ? `/api/couple/bond/mood-reactions?day=${day}` : '/api/couple/bond/mood-reactions',
    ),
  /** 给 TA 设置专属爱称（空串清除） */
  setPetName: (name: string | null) =>
    http.putJson<string | null>('/api/couple/bond/pet-name', { name: name ?? null }),

  // ---------- 每日仪式升级 ----------
  /** 今天的甜蜜任务卡（没有就生成；重复拉取同一张） */
  todayTask: () => http.get<CoupleTaskVO>('/api/couple/ritual/task'),
  /** 最近 14 天任务卡（双方，新→旧） */
  recentTasks: () => http.get<CoupleTaskVO[]>('/api/couple/ritual/tasks'),
  /** 打卡完成今天的任务 */
  doneTask: () => http.postJson<CoupleTaskVO>('/api/couple/ritual/task/done', {}),
  /** 默契大考验状态：进行中的一局 + 累计默契数 */
  tacitState: () => http.get<CoupleTacitStateVO>('/api/couple/ritual/tacit'),
  /** 发起一局默契考验 */
  startTacit: () => http.postJson<CoupleTacitVO>('/api/couple/ritual/tacit/start', {}),
  /** 提交默契答案（第二个人提交后立即结算） */
  answerTacit: (answer: string) =>
    http.postJson<CoupleTacitVO>('/api/couple/ritual/tacit/answer', { answer }),
  /** 默契历史（最近 20 局） */
  tacitHistory: () => http.get<CoupleTacitVO[]>('/api/couple/ritual/tacit/history'),
  /** 随机抽一句情话 */
  drawLoveWord: () => http.get<string>('/api/couple/ritual/love-word'),
  /** 今日恋爱运势 */
  fortune: () => http.get<CoupleFortuneVO>('/api/couple/ritual/fortune'),
  /** 今晚的晚安故事 */
  goodnightStory: () => http.get<CoupleStoryVO>('/api/couple/ritual/goodnight-story'),

  // ---------- 情绪关怀 ----------
  /** 今天双方的情绪天气 + 贴心提示 */
  weather: () => http.get<CoupleWeatherVO>('/api/couple/care/weather'),
  /** 情绪急救箱：TA 连续低落天数 + 今天怎么哄 TA */
  firstAid: () => http.get<CoupleFirstAidVO>('/api/couple/care/first-aid'),
  /** 递一张和好卡（startAt：这次别扭开始时间，可空） */
  sendReconcile: (message: string, startAt?: number | null) =>
    http.postJson<CoupleReconcileVO>('/api/couple/care/reconciles', { message, startAt: startAt ?? null }),
  reconciles: () => http.get<CoupleReconcileVO[]>('/api/couple/care/reconciles'),
  acceptReconcile: (id: string) =>
    http.postJson<CoupleReconcileVO>(`/api/couple/care/reconciles/${id}/accept`, {}),
  /** 贴一张夸夸卡 */
  postPraise: (content: string) =>
    http.postJson<CouplePraiseVO>('/api/couple/care/praises', { content }),
  praises: () => http.get<CouplePraiseVO[]>('/api/couple/care/praises'),
  receivePraise: (id: string) =>
    http.postJson<CouplePraiseVO>(`/api/couple/care/praises/${id}/receive`, {}),
  /** 生理期卡片（双方记录 + 预告） */
  cycleCard: () => http.get<CoupleCycleCardVO>('/api/couple/care/cycle'),
  /** 记录/修改我的生理期 */
  saveCycle: (body: { periodDay: string; cycleDays?: number; periodDays?: number; note?: string }) =>
    http.putJson<CoupleCycleCardVO>('/api/couple/care/cycle', {
      periodDay: body.periodDay,
      cycleDays: body.cycleDays ?? null,
      periodDays: body.periodDays ?? null,
      note: body.note ?? null,
    }),

  // ---------- 纪念与回忆 ----------
  /** 徽章墙：里程碑徽章 + 行为成就 */
  badges: () => http.get<CoupleBadgeWallVO>('/api/couple/memory/badges'),
  /** 那年今天：历史上同月同日发生的事 */
  onThisDay: () => http.get<CoupleOnThisDayEvent[]>('/api/couple/memory/on-this-day'),
  /** 封一枚时光胶囊（openDay：30~365 天后，yyyy-MM-dd） */
  sealCapsule: (content: string, openDay: string) =>
    http.postJson<CoupleCapsuleVO>('/api/couple/memory/capsules', { content, openDay }),
  capsules: () => http.get<CoupleCapsuleVO[]>('/api/couple/memory/capsules'),
  openCapsule: (id: string) =>
    http.postJson<CoupleCapsuleVO>(`/api/couple/memory/capsules/${id}/open`, {}),
  /** 新增倒数日 */
  addCountdown: (title: string, targetDay: string, note?: string) =>
    http.postJson<CoupleCountdownVO>('/api/couple/memory/countdowns', {
      title,
      targetDay,
      note: note ?? null,
    }),
  countdowns: () => http.get<CoupleCountdownVO[]>('/api/couple/memory/countdowns'),
  doneCountdown: (id: string, done: boolean) =>
    http.postJson<CoupleCountdownVO>(`/api/couple/memory/countdowns/${id}/done`, { done }),
  deleteCountdown: (id: string) => http.delete<void>(`/api/couple/memory/countdowns/${id}`),

  // ---------- 共同生活 ----------
  /** 记一笔开销（amount 单位：分） */
  addExpense: (body: { amount: number; category: CoupleExpenseCategory; note?: string; spentDay?: string }) =>
    http.postJson<CoupleExpenseVO>('/api/couple/life/expenses', {
      amount: body.amount,
      category: body.category,
      note: body.note ?? null,
      spentDay: body.spentDay ?? null,
    }),
  /** 某月账单（yyyy-MM，默认当月） */
  monthExpenses: (month?: string) =>
    http.get<CoupleExpenseMonthVO>(month ? `/api/couple/life/expenses?month=${month}` : '/api/couple/life/expenses'),
  deleteExpense: (id: string) => http.delete<void>(`/api/couple/life/expenses/${id}`),
  /** 添加家务（SINGLE 固定给我 / ALTERNATE 每次轮换） */
  addChore: (title: string, rotate: 'SINGLE' | 'ALTERNATE') =>
    http.postJson<CoupleChoreVO>('/api/couple/life/chores', { title, rotate }),
  chores: () => http.get<CoupleChoreVO[]>('/api/couple/life/chores'),
  doneChore: (id: string) => http.postJson<CoupleChoreVO>(`/api/couple/life/chores/${id}/done`, {}),
  deleteChore: (id: string) => http.delete<void>(`/api/couple/life/chores/${id}`),
  /** 计划一场约会 */
  addDatePlan: (body: { title: string; planDay: string; place?: string; items?: string }) =>
    http.postJson<CoupleDatePlanVO>('/api/couple/life/date-plans', {
      title: body.title,
      planDay: body.planDay,
      place: body.place ?? null,
      items: body.items ?? null,
    }),
  datePlans: () => http.get<CoupleDatePlanVO[]>('/api/couple/life/date-plans'),
  doneDatePlan: (id: string, done: boolean) =>
    http.postJson<CoupleDatePlanVO>(`/api/couple/life/date-plans/${id}/done`, { done }),
  deleteDatePlan: (id: string) => http.delete<void>(`/api/couple/life/date-plans/${id}`),
  /** 创建共同习惯 */
  addHabit: (title: string) => http.postJson<CoupleHabitVO>('/api/couple/life/habits', { title }),
  habits: () => http.get<CoupleHabitVO[]>('/api/couple/life/habits'),
  /** 今日打卡（幂等） */
  checkinHabit: (id: string) => http.postJson<CoupleHabitVO>(`/api/couple/life/habits/${id}/checkin`, {}),
  /** 结束/重启习惯 */
  toggleHabit: (id: string, active: boolean) =>
    http.postJson<CoupleHabitVO>(`/api/couple/life/habits/${id}/active`, { active }),
  deleteHabit: (id: string) => http.delete<void>(`/api/couple/life/habits/${id}`),
  /** 记一条暗号 */
  addCipher: (keyword: string, meaning: string) =>
    http.postJson<CoupleCipherVO>('/api/couple/life/ciphers', { keyword, meaning }),
  ciphers: () => http.get<CoupleCipherVO[]>('/api/couple/life/ciphers'),
  deleteCipher: (id: string) => http.delete<void>(`/api/couple/life/ciphers/${id}`),

  // ---------- 空间个性化 / 月报 ----------
  /** 更新空间个性化：宣言/主题/贴纸墙（传 null 表示不修改该项） */
  updateProfile: (body: { slogan?: string | null; theme?: string | null; stickers?: string | null }) =>
    http.putJson<CoupleSpaceVO>('/api/couple/profile', {
      slogan: body.slogan ?? null,
      theme: body.theme ?? null,
      stickers: body.stickers ?? null,
    }),
  /** 恋爱月报（yyyy-MM，默认当月） */
  monthlyReport: (month?: string) =>
    http.get<CoupleMonthlyReportVO>(month ? `/api/couple/memory/monthly-report?month=${month}` : '/api/couple/memory/monthly-report'),
  /** 数据总览 */
  dataOverview: () => http.get<CoupleDataOverviewVO>('/api/couple/memory/data-overview'),

  // ---------- 恋爱游戏化 ----------
  /** 今日心动加成（每天最多 20 点，24 点清零） */
  boost: () => http.get<CoupleIntimacyBoostVO>('/api/couple/game/boost'),
  /** 互动热力图（最近 12 周） */
  heatmap: () => http.get<CoupleHeatmapVO>('/api/couple/game/heatmap'),
  /** 心情曲线（最近 30 天） */
  moodCurve: () => http.get<CoupleMoodCurveVO>('/api/couple/game/mood-curve'),
  /** 恋爱红绿灯 */
  trafficLight: () => http.get<CoupleTrafficLightVO>('/api/couple/game/traffic-light'),

  // ---------- 通知中心 / 关系徽章 / 管理看板 ----------
  /** F41 我的最近 50 条通知 + 未读数 */
  notifyMine: () => http.get<CoupleNotifyListVO>('/api/couple/notify'),
  /** F41 全部标记已读 */
  notifyReadAll: () => http.postJson<void>('/api/couple/notify/read-all', {}),
  /** F44 恋爱中徽章：某人是否在恋爱中 + 天数（仅其好友可查） */
  relationshipOf: (username: string) =>
    http.get<CoupleRelationshipVO>(`/api/couple/relationship-of/${encodeURIComponent(username)}`),
  /** F45 管理看板：情侣空间运营统计（仅管理员） */
  adminCoupleStats: () => http.get<CoupleAdminStatsVO>('/api/couple/admin/stats'),

  // ---------- 第一次清单 / 一问互评 ----------
  /** F46 第一次清单：按发生日期升序 */
  listFirsts: () => http.get<CoupleFirstVO[]>('/api/couple/memory/firsts'),
  /** F46 记录一个「我们的第一次」 */
  addFirst: (title: string, firstDay: string, note?: string | null) =>
    http.postJson<CoupleFirstVO>('/api/couple/memory/firsts', { title, firstDay, note: note ?? null }),
  /** F46 删除一条第一次记录 */
  removeFirst: (id: string) => http.delete(`/api/couple/memory/firsts/${id}`),
  /** F48 对某天 TA 的回答点一个反应（每人每天一条，可改） */
  reactAnswer: (day: string, emoji: string) =>
    http.postJson<CoupleAnswerReactionVO[]>(`/api/couple/answers/${day}/react`, { emoji }),
  /** F48 某天双方对彼此回答的反应列表 */
  listAnswerReactions: (day: string) =>
    http.get<CoupleAnswerReactionVO[]>(`/api/couple/answers/${day}/reactions`),

  // ---------- 惊喜与期待（F50-F59） ----------
  /** F50 我的刮刮乐（自动补发本周的卡） */
  scratches: () => http.get<CoupleScratchVO[]>('/api/couple/surprise/scratches'),
  /** F50 刮开我的券 */
  scratchCard: (id: string) => http.postJson<CoupleScratchVO>(`/api/couple/surprise/scratches/${id}/scratch`, {}),
  /** F50 送券人核销 */
  redeemScratch: (id: string) => http.postJson<CoupleScratchVO>(`/api/couple/surprise/scratches/${id}/redeem`, {}),
  /** F51 盲盒列表 */
  boxes: () => http.get<CoupleBoxVO[]>('/api/couple/surprise/boxes'),
  /** F51 装一个盲盒（最早明天开箱） */
  createBox: (kind: 'whisper' | 'task', content: string, openDay: string) =>
    http.postJson<CoupleBoxVO>('/api/couple/surprise/boxes', { kind, content, openDay }),
  /** F51 开盲盒 */
  openBox: (id: string) => http.postJson<CoupleBoxVO>(`/api/couple/surprise/boxes/${id}/open`, {}),
  /** F52 我设的心动闹钟 */
  alarms: () => http.get<CoupleAlarmVO[]>('/api/couple/surprise/alarms'),
  /** F52 设一个心动闹钟（未来 24 小时内） */
  createAlarm: (message: string, fireAt: number) =>
    http.postJson<CoupleAlarmVO>('/api/couple/surprise/alarms', { message, fireAt }),
  /** F52 取消闹钟 */
  cancelAlarm: (id: string) => http.delete<void>(`/api/couple/surprise/alarms/${id}`),
  /** F53 思念速递看板 */
  missBoard: () => http.get<CoupleMissBoardVO>('/api/couple/surprise/misses'),
  /** F53 寄出一份思念（5~30 分钟随机送达） */
  sendMiss: () => http.postJson<CoupleMissBoardVO>('/api/couple/surprise/misses', {}),
  /** F57 告白存档列表 */
  confessions: () => http.get<CoupleConfessionVO[]>('/api/couple/surprise/confessions'),
  /** F57 收藏一段告白（每年今天自动重播） */
  createConfession: (content: string, confessDay: string) =>
    http.postJson<CoupleConfessionVO>('/api/couple/surprise/confessions', { content, confessDay }),
  /** F57 删除告白存档 */
  deleteConfession: (id: string) => http.delete<void>(`/api/couple/surprise/confessions/${id}`),
  /** F58 藏宝图列表 */
  treasures: () => http.get<CoupleTreasureVO[]>('/api/couple/surprise/treasures'),
  /** F58 埋一个宝藏 */
  createTreasure: (taskText: string, prizeText: string) =>
    http.postJson<CoupleTreasureVO>('/api/couple/surprise/treasures', { taskText, prizeText }),
  /** F58 完成任务挖宝 */
  completeTreasure: (id: string) => http.postJson<CoupleTreasureVO>(`/api/couple/surprise/treasures/${id}/done`, {}),

  // ---------- 爱情花园 / 玫瑰 / 幸运签（F54-F56） ----------
  /** F54 花园状态 */
  garden: () => http.get<CoupleGardenVO>('/api/couple/garden'),
  /** F54 浇水（每人每天一次） */
  waterGarden: () => http.postJson<CoupleGardenVO>('/api/couple/garden/water', {}),
  /** F55 玫瑰看板 */
  roseBoard: () => http.get<CoupleRoseBoardVO>('/api/couple/garden/roses'),
  /** F55 送一朵玫瑰（每天限 3 朵） */
  sendRose: (flowerKey: string) => http.postJson<CoupleRoseBoardVO>('/api/couple/garden/roses', { flowerKey }),
  /** F56 幸运签看板 */
  slipBoard: () => http.get<CoupleSlipBoardVO>('/api/couple/garden/slips'),
  /** F56 为 TA 抽一支今日幸运签 */
  drawSlip: () => http.postJson<CoupleSlipBoardVO>('/api/couple/garden/slips', {}),

  // ---------- 懂我与被接住（F60-F69） ----------
  /** F60 求抱抱看板 */
  comfortBoard: () => http.get<CoupleComfortBoardVO>('/api/couple/care/comfort'),
  /** F60 发出求抱抱 */
  askComfort: (feeling: string) => http.postJson<CoupleComfortBoardVO>('/api/couple/care/comfort', { feeling }),
  /** F60 TA 的安慰话术卡（按感受随机 3 张） */
  comfortCards: (feeling: string) => http.get<string[]>(`/api/couple/care/comfort/cards?feeling=${feeling}`),
  /** F60 回应 TA 的求抱抱 */
  handleComfort: (note: string) => http.postJson<CoupleComfortVO>('/api/couple/care/comfort/handle', { note }),
  /** F63 陪聊话题卡（随机 3 张） */
  chatTopics: () => http.get<string[]>('/api/couple/care/chat-topics'),
  /** F64 情绪同步率 */
  moodSync: () => http.get<CoupleMoodSyncVO>('/api/couple/care/mood-sync'),
  /** F61 复盘列表（按天聚合） */
  peaceReviews: () => http.get<CouplePeaceDayVO[]>('/api/couple/makeup/reviews'),
  /** F61 写今天的复盘 */
  savePeaceReview: (myPart: string, nextTime: string) =>
    http.postJson<CouplePeaceDayVO[]>('/api/couple/makeup/reviews', { myPart, nextTime }),
  /** F62 道歉券列表 */
  sorryTickets: () => http.get<CoupleSorryTicketVO[]>('/api/couple/makeup/sorry-tickets'),
  /** F62 递一张道歉券 */
  sendSorry: (note: string) => http.postJson<CoupleSorryTicketVO[]>('/api/couple/makeup/sorry-tickets', { note }),
  /** F62 收下道歉券 */
  useSorry: (id: string, usedNote?: string) =>
    http.postJson<CoupleSorryTicketVO[]>(`/api/couple/makeup/sorry-tickets/${id}/use`, { usedNote: usedNote ?? null }),
  /** F66 今天的真心话 */
  truthToday: () => http.get<CoupleTruthTodayVO>('/api/couple/talk/truth'),
  /** F66 回答今天的真心话 */
  answerTruth: (answer: string) => http.postJson<CoupleTruthTodayVO>('/api/couple/talk/truth', { answer }),
  /** F66 真心话存档 */
  truthHistory: () => http.get<CoupleTruthHistoryVO[]>('/api/couple/talk/truth/history'),
  /** F67 树洞列表 */
  whispers: () => http.get<CoupleWhisperVO[]>('/api/couple/talk/whispers'),
  /** F67 投一个问题进树洞 */
  askWhisper: (question: string, anonymous: boolean) =>
    http.postJson<CoupleWhisperVO[]>('/api/couple/talk/whispers', { question, anonymous }),
  /** F67 回答树洞提问 */
  answerWhisper: (id: string, answer: string) =>
    http.postJson<CoupleWhisperVO[]>(`/api/couple/talk/whispers/${id}/answer`, { answer }),
  /** F68 心灵感应板 */
  telepathyBoard: () => http.get<CoupleTelepathyBoardVO>('/api/couple/talk/telepathy'),
  /** F68 发起一轮心灵感应 */
  startTelepathy: () => http.postJson<CoupleTelepathyBoardVO>('/api/couple/talk/telepathy/start', {}),
  /** F68 心灵感应作答 */
  answerTelepathy: (answer: string) =>
    http.postJson<CoupleTelepathyBoardVO>('/api/couple/talk/telepathy/answer', { answer }),
  /** F69 我的情话储蓄罐 */
  loveBank: () => http.get<CoupleLoveBankBoardVO>('/api/couple/talk/love-bank'),
  /** F69 存一句情话 */
  depositLove: (content: string) => http.postJson<CoupleLoveBankBoardVO>('/api/couple/talk/love-bank', { content }),

  // ---------- 共同养成（F70-F79） ----------
  /** F70 今日挑战看板 */
  challenge: () => http.get<CoupleChallengeBoardVO>('/api/couple/growth/challenge'),
  /** F70 打卡今日挑战 */
  checkChallenge: () => http.postJson<CoupleChallengeBoardVO>('/api/couple/growth/challenge/check', {}),
  /** F71 恋爱存折看板 */
  passbook: () => http.get<CouplePassbookBoardVO>('/api/couple/growth/passbook'),
  /** F71 存一笔小事 */
  depositPassbook: (content: string) => http.postJson<CouplePassbookBoardVO>('/api/couple/growth/passbook', { content }),
  /** F72 百日之约列表 */
  hundreds: () => http.get<CoupleHundredVO[]>('/api/couple/growth/hundreds'),
  /** F72 发起百日之约 */
  createHundred: (goal: string, startDay?: string) =>
    http.postJson<CoupleHundredVO[]>('/api/couple/growth/hundreds', { goal, startDay: startDay ?? null }),
  /** F72 百日之约打卡 */
  checkinHundred: (id: string, note?: string) =>
    http.postJson<CoupleHundredVO[]>(`/api/couple/growth/hundreds/${id}/checkin`, { note: note ?? null }),
  /** F72 中止百日之约 */
  breakHundred: (id: string) => http.postJson<CoupleHundredVO[]>(`/api/couple/growth/hundreds/${id}/break`, {}),
  /** F77 星座配对（静态） */
  zodiacPair: (mine: string, partner: string) =>
    http.get<CoupleZodiacVO>(`/api/couple/growth/zodiac?mine=${mine}&partner=${partner}`),
  /** F73 心愿互换列表 */
  wishes: () => http.get<CoupleWishVO[]>('/api/couple/growth/wishes'),
  /** F73 许愿 */
  makeWish: (wish: string) => http.postJson<CoupleWishVO[]>('/api/couple/growth/wishes', { wish }),
  /** F73 接单 TA 的心愿（TA 接我的） */
  acceptWish: (id: string) => http.postJson<CoupleWishVO[]>(`/api/couple/growth/wishes/${id}/accept`, {}),
  /** F73 实现 TA 的心愿 */
  fulfillWish: (id: string, doneNote?: string) =>
    http.postJson<CoupleWishVO[]>(`/api/couple/growth/wishes/${id}/fulfill`, { doneNote: doneNote ?? null }),
  /** F75 旅行心愿地图 */
  travels: () => http.get<CoupleTravelVO[]>('/api/couple/growth/travels'),
  /** F75 添加旅行心愿 */
  addTravel: (place: string, wantTodo?: string) =>
    http.postJson<CoupleTravelVO[]>('/api/couple/growth/travels', { place, wantTodo: wantTodo ?? null }),
  /** F75 打卡去过 */
  visitTravel: (id: string, visitedNote?: string) =>
    http.postJson<CoupleTravelVO[]>(`/api/couple/growth/travels/${id}/visit`, { visitedNote: visitedNote ?? null }),
  /** F79 下次一定清单 */
  nextTimes: () => http.get<CoupleNextTimeVO[]>('/api/couple/growth/next-times'),
  /** F79 登记下次一定（byUser 空则记自己） */
  addNextTime: (content: string, byUser?: string) =>
    http.postJson<CoupleNextTimeVO[]>('/api/couple/growth/next-times', { content, byUser: byUser ?? null }),
  /** F79 催 TA 兑现 */
  nudgeNextTime: (id: string) => http.postJson<CoupleNextTimeVO[]>(`/api/couple/growth/next-times/${id}/nudge`, {}),
  /** F79 兑现我的承诺 */
  fulfillNextTime: (id: string) => http.postJson<CoupleNextTimeVO[]>(`/api/couple/growth/next-times/${id}/fulfill`, {}),
  /** F74 共读计划列表 */
  readPlans: () => http.get<CoupleReadPlanVO[]>('/api/couple/growth/read-plans'),
  /** F74 开共读计划 */
  createReadPlan: (title: string, totalUnits: number, unitLabel: string) =>
    http.postJson<CoupleReadPlanVO[]>('/api/couple/growth/read-plans', { title, totalUnits, unitLabel }),
  /** F74 上报进度 */
  reportReadProgress: (id: string, unit: number, note?: string) =>
    http.postJson<CoupleReadPlanVO[]>(`/api/couple/growth/read-plans/${id}/progress`, { unit, note: note ?? null }),
  /** F76 追剧清单 */
  watchlist: () => http.get<CoupleWatchVO[]>('/api/couple/growth/watchlist'),
  /** F76 加剧 */
  addWatch: (title: string, totalUnit?: number) =>
    http.postJson<CoupleWatchVO[]>('/api/couple/growth/watchlist', { title, totalUnit: totalUnit ?? null }),
  /** F76 更新共同进度 */
  updateWatch: (id: string, currentUnit: number) =>
    http.postJson<CoupleWatchVO[]>(`/api/couple/growth/watchlist/${id}/progress`, { currentUnit }),
  /** F78 恋爱词典 */
  dictWords: () => http.get<CoupleDictVO[]>('/api/couple/growth/dict'),
  /** F78 收录词条 */
  addWord: (word: string, meaning: string) =>
    http.postJson<CoupleDictVO[]>('/api/couple/growth/dict', { word, meaning }),
  /** F78 删除词条 */
  removeWord: (id: string) => http.delete<CoupleDictVO[]>(`/api/couple/growth/dict/${id}`),

  // ---------- 回忆资产（F80-F89） ----------
  /** F80 恋爱编年史（按年聚合） */
  chronicle: () => http.get<CoupleChronicleYearVO[]>('/api/couple/chronicle'),
  /** F81 考古卡（随机挖一张旧记录） */
  archaeology: () => http.get<CoupleArchaeologyCardVO>('/api/couple/chronicle/archaeology'),
  /** F82 恋爱问答机（真实数据出题） */
  quiz: () => http.get<CoupleQuizQuestionVO[]>('/api/couple/chronicle/quiz'),
  /** F85 周年报告 */
  anniversaryReport: () => http.get<CoupleAnniversaryReportVO>('/api/couple/chronicle/anniversary-report'),
  /** F86 生日回顾 */
  birthdayLook: () => http.get<CoupleBirthdayLookVO>('/api/couple/chronicle/birthday-look'),
  /** F83 语录册 */
  quotes: () => http.get<CoupleQuoteVO[]>('/api/couple/keepsake/quotes'),
  /** F83 收藏语录 */
  saveQuote: (content: string, context?: string) =>
    http.postJson<CoupleQuoteVO[]>('/api/couple/keepsake/quotes', { content, context: context ?? null }),
  /** F83 删除语录 */
  removeQuote: (id: string) => http.delete<CoupleQuoteVO[]>(`/api/couple/keepsake/quotes/${id}`),
  /** F88 票根墙 */
  tickets: () => http.get<CoupleTicketVO[]>('/api/couple/keepsake/tickets'),
  /** F88 存票根 */
  saveTicket: (title: string, watchDay?: string, rating?: number, comment?: string) =>
    http.postJson<CoupleTicketVO[]>('/api/couple/keepsake/tickets',
      { title, watchDay: watchDay ?? null, rating: rating ?? null, comment: comment ?? null }),
  /** F88 撕票根 */
  removeTicket: (id: string) => http.delete<CoupleTicketVO[]>(`/api/couple/keepsake/tickets/${id}`),
  /** F89 我们的歌单 */
  songs: () => http.get<CoupleSongVO[]>('/api/couple/keepsake/songs'),
  /** F89 收藏歌 */
  saveSong: (title: string, artist?: string, reason?: string) =>
    http.postJson<CoupleSongVO[]>('/api/couple/keepsake/songs',
      { title, artist: artist ?? null, reason: reason ?? null }),
  /** F89 移除歌 */
  removeSong: (id: string) => http.delete<CoupleSongVO[]>(`/api/couple/keepsake/songs/${id}`),

  // ---------- 体验与其它菜单（F90-F99） ----------
  /** F95 今日看点（今天值得做的甜蜜小事聚合） */
  todayBoard: () => http.get<CoupleTodayBoardVO>('/api/couple/today'),
  /** F96 年度热力日历（缺省当年） */
  yearHeatmap: (year?: number) =>
    http.get<CoupleYearHeatmapVO>(`/api/couple/today/heatmap${year ? `?year=${year}` : ''}`),

  // ---------- 会说情话·沟通增强（F100-F109） ----------
  /** F100 恋爱翻译器 */
  translate: (text: string) =>
    http.get<CoupleTranslationVO>(`/api/couple/comm/translate?text=${encodeURIComponent(text)}`),
  /** F101 冷静角列表 */
  coolDowns: () => http.get<CoupleCoolDownVO[]>('/api/couple/comm/cool-downs'),
  /** F101 发起冷静角 */
  startCoolDown: (reason?: string) =>
    http.postJson<CoupleCoolDownVO[]>('/api/couple/comm/cool-downs', { reason: reason ?? null }),
  /** F101 冷静期结束后留软话 */
  softenCool: (id: string, content: string) =>
    http.postJson<CoupleCoolDownVO[]>(`/api/couple/comm/cool-downs/${id}/soften`, { content }),
  /** F102 接力棒列表 */
  relays: () => http.get<CoupleRelayVO[]>('/api/couple/comm/relays'),
  /** F102 抛心情 */
  tossRelay: (moodWord: string, moodEmoji?: string, note?: string) =>
    http.postJson<CoupleRelayVO[]>('/api/couple/comm/relays',
      { moodWord, moodEmoji: moodEmoji ?? null, note: note ?? null }),
  /** F102 接住并回抛 */
  catchRelay: (id: string, catchNote?: string, myMood?: string, myEmoji?: string, myNote?: string) =>
    http.postJson<CoupleRelayVO[]>(`/api/couple/comm/relays/${id}/catch`,
      { catchNote: catchNote ?? null, myMood: myMood ?? null, myEmoji: myEmoji ?? null, myNote: myNote ?? null }),
  /** F103 比划猜对局 */
  guesses: () => http.get<CoupleGuessVO[]>('/api/couple/comm/guesses'),
  /** F103 开一轮 */
  startGuess: () => http.postJson<CoupleGuessVO[]>('/api/couple/comm/guesses', {}),
  /** F103 出提示 */
  clueGuess: (id: string, clue: string) =>
    http.postJson<CoupleGuessVO[]>(`/api/couple/comm/guesses/${id}/clue`, { clue }),
  /** F103 猜词 */
  doGuess: (id: string, word: string) =>
    http.postJson<CoupleGuessVO[]>(`/api/couple/comm/guesses/${id}/guess`, { word }),
  /** F104 故事列表 */
  stories: () => http.get<CoupleStoryChainVO[]>('/api/couple/comm/stories'),
  /** F104 开新故事 */
  startStory: (content: string) =>
    http.postJson<CoupleStoryChainVO[]>('/api/couple/comm/stories', { content }),
  /** F104 接一句 */
  addStoryLine: (chainId: string, content: string) =>
    http.postJson<CoupleStoryChainVO[]>(`/api/couple/comm/stories/${chainId}/lines`, { content }),
  /** F104 完结本篇 */
  finishStory: (chainId: string) =>
    http.postJson<CoupleStoryChainVO[]>(`/api/couple/comm/stories/${chainId}/finish`, {}),
  /** F105 词典小考出题 */
  dictQuiz: () => http.get<CoupleDictQuizVO>('/api/couple/comm/dict-quiz'),
  /** F106 情话合成 */
  synthSweet: (seed: number) =>
    http.get<string>(`/api/couple/comm/sweet-synth?seed=${seed}`),
  /** F107 道歉三部曲列表 */
  apologies: () => http.get<CoupleApologyVO[]>('/api/couple/comm/apologies'),
  /** F107 送出道歉 */
  sendApology: (whatWrong: string, whyWrong: string, willDo: string) =>
    http.postJson<CoupleApologyVO[]>('/api/couple/comm/apologies',
      { whatWrong, whyWrong, willDo }),
  /** F107 收下道歉 */
  acceptApology: (id: string) =>
    http.postJson<CoupleApologyVO[]>(`/api/couple/comm/apologies/${id}/accept`, {}),
  /** F108 情绪词汇列表 */
  feelings: () => http.get<CoupleFeelingVO[]>('/api/couple/comm/feelings'),
  /** F108 记录今天的心情词 */
  saveFeeling: (word: string, note?: string) =>
    http.postJson<CoupleFeelingVO[]>('/api/couple/comm/feelings', { word, note: note ?? null }),
  /** F109 晚安电台 */
  goodnightRadio: () => http.get<CoupleRadioVO>('/api/couple/comm/goodnight-radio'),

  // ============ 异地恋·时空同步（F110-F119） ============
  /** F110 隔空牵手看板 */
  handhold: () => http.get<CoupleHandholdVO>('/api/couple/distance/handhold'),
  /** F110 点亮今天的手 */
  holdHand: () => http.postJson<CoupleHandholdVO>('/api/couple/distance/handhold', {}),
  /** F112 想念计量所看板 */
  miss: () => http.get<CoupleMissDailyVO>('/api/couple/distance/miss'),
  /** F112 点亮「今天想你了」 */
  lightMiss: () => http.postJson<CoupleMissDailyVO>('/api/couple/distance/miss', {}),
  /** F114 作息表（含重叠时段） */
  routine: () => http.get<CoupleRoutineVO>('/api/couple/distance/routine'),
  /** F114 保存我的作息 */
  saveRoutine: (wakeTime: string, workStart: string, workEnd: string, sleepTime: string) =>
    http.postJson<CoupleRoutineVO>('/api/couple/distance/routine',
      { wakeTime, workStart, workEnd, sleepTime }),
  /** F115 见面信列表 */
  reunionLetters: () => http.get<CoupleReunionLetterVO[]>('/api/couple/distance/letters'),
  /** F115 写见面信 */
  writeLetter: (content: string) =>
    http.postJson<CoupleReunionLetterVO[]>('/api/couple/distance/letters', { content }),
  /** F115 拆信（见面后） */
  openReunionLetter: (id: string) =>
    http.postJson<CoupleReunionLetterVO[]>(`/api/couple/distance/letters/${id}/open`, {}),
  /** F116 云约会列表 */
  cloudDates: () => http.get<CoupleCloudDateVO[]>('/api/couple/distance/cloud-dates'),
  /** F116 加云约会（item 空则随机灵感） */
  addCloudDate: (item?: string) =>
    http.postJson<CoupleCloudDateVO[]>('/api/couple/distance/cloud-dates', { item: item ?? null }),
  /** F116 完成云约会 */
  doneCloudDate: (id: string, note?: string) =>
    http.postJson<CoupleCloudDateVO[]>(`/api/couple/distance/cloud-dates/${id}/done`, { note: note ?? null }),
  /** F117 平安卡列表 */
  safeties: () => http.get<CoupleSafetyVO[]>('/api/couple/distance/safeties'),
  /** F117 报平安（GO_OUT 出发 / ARRIVE 到家） */
  pingSafety: (kind: string, note?: string) =>
    http.postJson<CoupleSafetyVO[]>('/api/couple/distance/safeties', { kind, note: note ?? null }),
  /** F118 见面日记 */
  reunions: () => http.get<CoupleReunionLogVO[]>('/api/couple/distance/reunions'),
  /** F118 记一笔见面 */
  logReunion: (meetDay: string, note?: string) =>
    http.postJson<CoupleReunionLogVO[]>('/api/couple/distance/reunions', { meetDay, note: note ?? null }),
  /** F113 见面能量瓶 */
  energy: () => http.get<CoupleEnergyVO>('/api/couple/distance/energy'),
  /** F119 异地恋报告 */
  distanceReport: () => http.get<CoupleDistanceReportVO>('/api/couple/distance/report'),

  // ============ 确定感与安全感（F120-F129） ============
  /** F120 安全感账户 */
  security: () => http.get<CoupleSecurityBoardVO>('/api/couple/secure/security'),
  /** F120 存一句安心话 */
  depositSecurity: (content: string) =>
    http.postJson<CoupleSecurityBoardVO>('/api/couple/secure/security', { content }),
  /** F120 收下一句安心话 */
  acceptSecurity: (id: string) =>
    http.postJson<CoupleSecurityBoardVO>(`/api/couple/secure/security/${id}/accept`, {}),
  /** F121 恋爱体检 */
  checkup: () => http.get<CoupleCheckupVO>('/api/couple/secure/checkup'),
  /** F122 十年之约 */
  decade: () => http.get<CoupleDecadeVO>('/api/couple/secure/decade'),
  /** F122 写/改我的十年之约 */
  saveDecade: (content: string) =>
    http.postJson<CoupleDecadeVO>('/api/couple/secure/decade', { content }),
  /** F123 愿景板 */
  visions: () => http.get<CoupleVisionVO[]>('/api/couple/secure/visions'),
  /** F123 贴一张愿景卡 */
  addVision: (word: string, note?: string) =>
    http.postJson<CoupleVisionVO[]>('/api/couple/secure/visions', { word, note: note ?? null }),
  /** F124 承诺博物馆 */
  oaths: () => http.get<CoupleOathVO[]>('/api/couple/secure/oaths'),
  /** F124 立一份承诺 */
  makeOath: (content: string) =>
    http.postJson<CoupleOathVO[]>('/api/couple/secure/oaths', { content }),
  /** F124 盖章 */
  stampOath: (id: string) =>
    http.postJson<CoupleOathVO[]>(`/api/couple/secure/oaths/${id}/stamp`, {}),
  /** F125 信任存折 */
  trust: () => http.get<CoupleTrustBoardVO>('/api/couple/secure/trust'),
  /** F125 存一枚信任币（每天一枚） */
  depositTrust: (reason?: string) =>
    http.postJson<CoupleTrustBoardVO>('/api/couple/secure/trust', { reason: reason ?? null }),
  /** F126 恋爱年轮 */
  rings: () => http.get<CoupleRingBoardVO>('/api/couple/secure/rings'),
  /** F128 双人契约 */
  contracts: () => http.get<CoupleContractVO[]>('/api/couple/secure/contracts'),
  /** F128 立契约 */
  makeContract: (title: string, content?: string) =>
    http.postJson<CoupleContractVO[]>('/api/couple/secure/contracts', { title, content: content ?? null }),
  /** F128 契约打卡 */
  checkContract: (id: string) =>
    http.postJson<CoupleContractVO[]>(`/api/couple/secure/contracts/${id}/checkin`, {}),
  /** F129 守护兽 */
  pet: () => http.get<CouplePetVO | null>('/api/couple/secure/pet'),
  /** F129 领养守护兽 */
  adoptPet: (name: string, kind: string) =>
    http.postJson<CouplePetVO>('/api/couple/secure/pet', { name, kind }),
  /** F129 照料守护兽 */
  carePet: () => http.postJson<CouplePetVO>('/api/couple/secure/pet/care', {}),

  // ============ 趣味游戏（F130-F139） ============
  /** F130 一百问全景 */
  survey: () => http.get<CoupleSurveyVO>('/api/couple/play/survey'),
  /** F130 答一题（答完解锁 TA 同题） */
  answerSurvey: (qNo: number, answer: string) =>
    http.postJson<CoupleSurveyVO>('/api/couple/play/survey', { qNo, answer }),
  /** F131 出题考TA 列表 */
  quizzes: () => http.get<CoupleQuizVO[]>('/api/couple/play/quizzes'),
  /** F131 出一道题 */
  makeQuiz: (question: string) =>
    http.postJson<CoupleQuizVO[]>('/api/couple/play/quizzes', { question }),
  /** F131 对方作答 */
  answerQuiz: (id: string, answer: string) =>
    http.postJson<CoupleQuizVO[]>(`/api/couple/play/quizzes/${id}/answer`, { answer }),
  /** F131 出题人判分 */
  judgeQuiz: (id: string, verdict: 'RIGHT' | 'WRONG') =>
    http.postJson<CoupleQuizVO[]>(`/api/couple/play/quizzes/${id}/judge`, { verdict }),
  /** F132 今日心动概率 */
  heartbeat: () => http.get<CoupleHeartbeatVO>('/api/couple/play/heartbeat'),
  /** F133 今日塔罗 */
  tarot: () => http.get<CoupleTarotVO>('/api/couple/play/tarot'),
  /** F137 今日恋爱天气预报 */
  loveWeather: () => http.get<CoupleLoveWeatherVO>('/api/couple/play/weather'),
  /** F134 世界情话课（今日一课 + 收藏夹） */
  loveLesson: () => http.get<CoupleLessonVO>('/api/couple/play/love-lesson'),
  /** F134 收藏一句情话 */
  collectLoveWord: (word: string, meaning?: string) =>
    http.postJson<CoupleLessonVO>('/api/couple/play/love-words', { word, meaning: meaning ?? null }),
  /** F135 周末盲选 */
  blindPick: () => http.get<CoupleBlindVO>('/api/couple/play/blind'),
  /** F135 提交本周 3 个周末愿望 */
  submitBlindPick: (picks: string[]) =>
    http.postJson<CoupleBlindVO>('/api/couple/play/blind', { picks }),
  /** F136 今日情话 Battle */
  battle: () => http.get<CoupleBattleVO>('/api/couple/play/battle'),
  /** F136 参加今日 Battle */
  joinBattle: (content: string) =>
    http.postJson<CoupleBattleVO>('/api/couple/play/battle', { content }),
  /** F136 投票（场上两句任选其一） */
  voteBattle: (toUser: string) =>
    http.postJson<CoupleBattleVO>('/api/couple/play/battle/vote', { toUser }),
  /** F138 抽象画列表 */
  arts: () => http.get<CoupleArtVO[]>('/api/couple/play/arts'),
  /** F138 送一幅抽象画进画廊 */
  createArt: (title: string, seed: number) =>
    http.postJson<CoupleArtVO[]>('/api/couple/play/arts', { title, seed }),

  // ============ 深度陪伴（F140-F149） ============
  /** F140 今日主题曲 */
  themeSong: () => http.get<CoupleThemeSongVO>('/api/couple/daily-life/theme-song'),
  /** F141 梦境手账 */
  dreams: () => http.get<CoupleDreamVO[]>('/api/couple/daily-life/dreams'),
  /** F141 写下一个梦 */
  writeDream: (content: string) =>
    http.postJson<CoupleDreamVO[]>('/api/couple/daily-life/dreams', { content }),
  /** F142 美食地图 */
  foods: () => http.get<CoupleFoodNoteVO[]>('/api/couple/daily-life/foods'),
  /** F142 添加想吃的店 */
  addFood: (shop: string, dish: string) =>
    http.postJson<CoupleFoodNoteVO[]>('/api/couple/daily-life/foods', { shop, dish }),
  /** F142 打卡：吃过啦 */
  checkinFood: (id: string, rating?: number, comment?: string) =>
    http.postJson<CoupleFoodNoteVO[]>(`/api/couple/daily-life/foods/${id}/checkin`, {
      rating: rating ?? 5,
      comment: comment ?? null,
    }),
  /** F143 TA 使用手册 */
  facts: () => http.get<CouplePartnerFactVO[]>('/api/couple/daily-life/facts'),
  /** F143 补一页说明书 */
  addFact: (kind: string, content: string) =>
    http.postJson<CouplePartnerFactVO[]>('/api/couple/daily-life/facts', { kind, content }),
  /** F144 情绪 SOS 列表 */
  soses: () => http.get<CoupleSosVO[]>('/api/couple/daily-life/soses'),
  /** F144 一键求抱抱 */
  pingSos: (message?: string) =>
    http.postJson<CoupleSosVO[]>('/api/couple/daily-life/soses', { message: message ?? null }),
  /** F144 抱住：接住对方的 SOS */
  holdSos: (id: string) =>
    http.postJson<CoupleSosVO[]>(`/api/couple/daily-life/soses/${id}/hold`, {}),
  /** F145 每日三问 */
  dailyThree: () => http.get<CoupleThreeVO>('/api/couple/daily-life/three'),
  /** F145 提交/修改今日三问 */
  saveDailyThree: (joy?: string, touched?: string, wantToSay?: string) =>
    http.postJson<CoupleThreeVO>('/api/couple/daily-life/three', {
      joy: joy ?? null,
      touched: touched ?? null,
      wantToSay: wantToSay ?? null,
    }),
  /** F146 夸夸生成器 + F147 接头暗号 */
  dailyPraise: () => http.get<CoupleDailyPraiseVO>('/api/couple/daily-life/praise'),
  /** F148 自定义成就（与既有徽章墙 badges 撞名，改名 customBadges） */
  customBadges: () => http.get<CoupleCustomBadgeVO[]>('/api/couple/daily-life/badges'),
  /** F148 立一个成就 */
  addBadge: (title: string, condition?: string) =>
    http.postJson<CoupleCustomBadgeVO[]>('/api/couple/daily-life/badges', {
      title,
      condition: condition ?? null,
    }),
  /** F148 达成颁发双人证书 */
  issueBadge: (id: string) =>
    http.postJson<CoupleCustomBadgeVO[]>(`/api/couple/daily-life/badges/${id}/issue`, {}),
  /** F149 恋爱仪表盘 */
  dashboard: () => http.get<CoupleDashboardVO>('/api/couple/daily-life/dashboard'),

  // ============ 成长系（F150-F159） ============
  /** F150 习惯搭子列表（与双人习惯 habits 撞名，改 coachHabits） */
  coachHabits: () => http.get<CoupleHabitStreakVO[]>('/api/couple/coach/habits'),
  /** F150 立一个习惯 */
  coachCreateHabit: (title: string, targetDays?: number) =>
    http.postJson<CoupleHabitStreakVO[]>('/api/couple/coach/habits', {
      title,
      targetDays: targetDays ?? 21,
    }),
  /** F150 习惯打卡 */
  coachCheckinHabit: (id: string) =>
    http.postJson<CoupleHabitStreakVO[]>(`/api/couple/coach/habits/${id}/checkin`, {}),
  /** F151 感恩便签墙 */
  thanks: () => http.get<CoupleThanksVO[]>('/api/couple/coach/thanks'),
  /** F151 写感恩便签 */
  addThanks: (content: string) =>
    http.postJson<CoupleThanksVO[]>('/api/couple/coach/thanks', { content }),
  /** F152 情绪词表 */
  feelFamilies: () => http.get<CoupleFeelFamilyVO[]>('/api/couple/coach/feel-families'),
  /** F152 今日情绪日记 */
  feelToday: () => http.get<CoupleFeelVO>('/api/couple/coach/feel'),
  /** F152 记录今日情绪 */
  saveFeel: (word: string, intensity?: number, note?: string) =>
    http.postJson<CoupleFeelVO>('/api/couple/coach/feel', {
      word,
      intensity: intensity ?? 3,
      note: note ?? null,
    }),
  /** F153 本周高光互评 */
  weekStar: () => http.get<CoupleWeekStarVO>('/api/couple/coach/week-star'),
  /** F153 提名对方本周高光 */
  saveWeekStar: (highlight: string) =>
    http.postJson<CoupleWeekStarVO>('/api/couple/coach/week-star', { highlight }),
  /** F154 今日共读一分钟 */
  readMinute: () => http.get<CoupleReadMinuteVO>('/api/couple/coach/read-minute'),
  /** F154 写共读感想 */
  saveReadMinute: (thought: string) =>
    http.postJson<CoupleReadMinuteVO>('/api/couple/coach/read-minute', { thought }),
  /** F155 拖延互助所 */
  delays: () => http.get<CoupleDelayVO[]>('/api/couple/coach/delays'),
  /** F155 登记拖延的事 */
  addDelay: (title: string, deadlineDay?: string) =>
    http.postJson<CoupleDelayVO[]>('/api/couple/coach/delays', {
      title,
      deadlineDay: deadlineDay ?? null,
    }),
  /** F155 催办 */
  nagDelay: (id: string) =>
    http.postJson<CoupleDelayVO[]>(`/api/couple/coach/delays/${id}/nag`, {}),
  /** F155 宣布完成 */
  doneDelay: (id: string) =>
    http.postJson<CoupleDelayVO[]>(`/api/couple/coach/delays/${id}/done`, {}),
  /** F156 早安能量站 */
  morning: () => http.get<CoupleMorningVO>('/api/couple/coach/morning'),
  /** F158 优点存折 */
  praiseBank: () => http.get<CouplePraiseBankVO[]>('/api/couple/coach/praise-bank'),
  /** F158 存一条优点 */
  addPraiseBank: (content: string, scene?: string) =>
    http.postJson<CouplePraiseBankVO[]>('/api/couple/coach/praise-bank', {
      content,
      scene: scene ?? null,
    }),
  /** F159 成长年度关键词 */
  yearKeyword: (year?: number) =>
    http.get<CoupleYearKeywordVO>(
      year ? `/api/couple/coach/year-keyword?year=${year}` : '/api/couple/coach/year-keyword',
    ),

  // ============ 文字浪漫（F160-F169） ============
  /** F160 我们的诗 */
  poemChain: () => http.get<CouplePoemChainVO>('/api/couple/poem/chain'),
  /** F160 写今天这一句诗 */
  addPoemLine: (line: string) =>
    http.postJson<CouplePoemChainVO>('/api/couple/poem/chain', { line }),
  /** F161 三行情书列表 */
  poems3: () => http.get<CouplePoem3VO[]>('/api/couple/poem/3lines'),
  /** F161 写三行情书 */
  addPoem3: (line1: string, line2: string, line3: string) =>
    http.postJson<CouplePoem3VO[]>('/api/couple/poem/3lines', { line1, line2, line3 }),
  /** F161 点赞三行情书 */
  likePoem3: (id: string) =>
    http.postJson<CouplePoem3VO[]>(`/api/couple/poem/3lines/${id}/like`, {}),
  /** F162 醒来第一条信箱 */
  morningNotes: () => http.get<CoupleMorningBoxVO>('/api/couple/poem/morning-notes'),
  /** F162 睡前封一条 */
  sealMorningNote: (content: string) =>
    http.postJson<CoupleMorningBoxVO>('/api/couple/poem/morning-notes', { content }),
  /** F162 已读 */
  readMorningNote: (id: string) =>
    http.postJson<CoupleMorningBoxVO>(`/api/couple/poem/morning-notes/${id}/read`, {}),
  /** F163 漂流瓶列表 */
  bottles: () => http.get<CoupleBottleVO[]>('/api/couple/poem/bottles'),
  /** F163 扔漂流瓶 */
  tossBottle: (mood: string, content: string) =>
    http.postJson<CoupleBottleVO[]>('/api/couple/poem/bottles', { mood, content }),
  /** F163 回漂流瓶 */
  replyBottle: (id: string, reply: string) =>
    http.postJson<CoupleBottleVO[]>(`/api/couple/poem/bottles/${id}/reply`, { reply }),
  /** F164 密码情书列表（与暗号小本本 coupleCipher 撞名场景，这里走 cipherNote 前缀） */
  cipherNotes: () => http.get<CoupleCipherNoteVO[]>('/api/couple/poem/ciphers'),
  /** F164 写密码情书 */
  makeCipherNote: (cipher: string, hint?: string) =>
    http.postJson<CoupleCipherNoteVO[]>('/api/couple/poem/ciphers', {
      cipher,
      hint: hint ?? null,
    }),
  /** F164 解码上报 */
  crackCipherNote: (id: string) =>
    http.postJson<CoupleCipherNoteVO[]>(`/api/couple/poem/ciphers/${id}/crack`, {}),
  /** F165 今日灵魂一问 */
  soul: () => http.get<CoupleSoulVO>('/api/couple/poem/soul'),
  /** F165 回答灵魂一问 */
  answerSoul: (answer: string) =>
    http.postJson<CoupleSoulVO>('/api/couple/poem/soul', { answer }),
  /** F166 贴纸手账 */
  journal: () => http.get<CoupleJournalVO[]>('/api/couple/poem/journal'),
  /** F166 写手账 */
  saveJournal: (sticker: string, text: string) =>
    http.postJson<CoupleJournalVO[]>('/api/couple/poem/journal', { sticker, text }),
  /** F167 恋爱语录机 */
  quote: () => http.get<string>('/api/couple/poem/quote'),
  /** F168 情书模板库 */
  letterTemplates: () => http.get<CoupleLetterTemplateVO[]>('/api/couple/poem/letter-templates'),
  /** F169 手账贴纸库 */
  stickers: () => http.get<string[]>('/api/couple/poem/stickers'),

  // ============ 默契亲密（F170-F179） ============
  /** F170 爱语测评卷（静态） */
  sparkQuiz: () => http.get<CoupleSparkQuizVO[]>('/api/couple/spark/love-lang/quiz'),
  /** F170 提交爱语答卷 */
  submitLoveLang: (answers: string[]) =>
    http.postJson<CoupleLoveLangVO>('/api/couple/spark/love-lang', { answers }),
  /** F170 我的爱语结果 */
  myLoveLang: () => http.get<CoupleLoveLangVO>('/api/couple/spark/love-lang/mine'),
  /** F171 爱语对照卡 */
  loveLangPair: () => http.get<CoupleLoveLangPairVO>('/api/couple/spark/love-lang/pair'),
  /** F172 心动闪光列表 */
  flashes: () => http.get<CoupleFlashVO[]>('/api/couple/spark/flashes'),
  /** F172 速记心动 */
  addFlash: (moment: string) =>
    http.postJson<CoupleFlashVO[]>('/api/couple/spark/flashes', { moment }),
  /** F173 今日「如果」 */
  whatIf: () => http.get<CoupleWhatIfVO>('/api/couple/spark/what-if'),
  /** F173 回答「如果」 */
  answerWhatIf: (answer: string) =>
    http.postJson<CoupleWhatIfVO>('/api/couple/spark/what-if', { answer }),
  /** F174 动作暗语列表 */
  signals: () => http.get<CoupleSignalVO[]>('/api/couple/spark/signals'),
  /** F174 约定动作暗语 */
  addSignal: (signal: string, meaning: string) =>
    http.postJson<CoupleSignalVO[]>('/api/couple/spark/signals', { signal, meaning }),
  /** F175 按键（同频共振） */
  tap: () => http.postJson<CoupleTapResultVO>('/api/couple/spark/tap', {}),
  /** F175 今日按键状态 */
  tapToday: () => http.get<CoupleTapResultVO>('/api/couple/spark/tap/today'),
  /** F176 默契仪表盘 */
  sparkDashboard: () => http.get<CoupleSparkDashboardVO>('/api/couple/spark/dashboard'),
  /** F177 心动日历 */
  heartDays: () => http.get<CoupleHeartDayVO[]>('/api/couple/spark/heart-days'),
  /** F177 盖心动邮戳 */
  markHeartDay: (level: number) =>
    http.postJson<CoupleHeartDayVO[]>('/api/couple/spark/heart-days', { level }),
  /** F178 同频排行榜 */
  syncRank: () => http.get<CoupleSyncRankVO[]>('/api/couple/spark/sync-rank'),
  /** F179 默契周报 */
  sparkWeekly: () => http.get<CoupleSparkWeeklyVO>('/api/couple/spark/weekly'),
}

// ============ 生活经营（F180-F189） ============
export const manageApi = {
  /** F180 家庭会议：议题列表（新→旧） */
  meetings: () => http.get<CoupleManageMeetingVO[]>('/api/couple/manage/meetings'),
  /** F180 提出议题（followDay：后续跟进日 yyyy-MM-dd，可空） */
  createMeeting: (topic: string, followDay?: string | null) =>
    http.postJson<CoupleManageMeetingVO[]>('/api/couple/manage/meetings', {
      topic,
      followDay: followDay ?? null,
    }),
  /** F180 给议题记结论（可同时补跟进日） */
  decideMeeting: (id: string, decision: string, followDay?: string | null) =>
    http.postJson<CoupleManageMeetingVO[]>(`/api/couple/manage/meetings/${id}/decision`, {
      decision,
      followDay: followDay ?? null,
    }),
  /** F180 关闭议题 */
  closeMeeting: (id: string) =>
    http.postJson<CoupleManageMeetingVO[]>(`/api/couple/manage/meetings/${id}/close`, {}),

  /** F181 本周主理人（轮换当家） */
  host: () => http.get<CoupleManageHostVO>('/api/couple/manage/host'),
  /** F181 主理人排本周小计划 */
  saveHostPlan: (plan: string) =>
    http.postJson<CoupleManageHostVO>('/api/couple/manage/host/plan', { plan }),

  /** F182 技能交换所列表 */
  skills: () => http.get<CoupleManageSkillVO[]>('/api/couple/manage/skills'),
  /** F182 挂一个交换（我会 teach，想学 learn） */
  createSkill: (teach: string, learn: string) =>
    http.postJson<CoupleManageSkillVO[]>('/api/couple/manage/skills', { teach, learn }),
  /** F182 接单TA的交换 */
  takeSkill: (id: string) =>
    http.postJson<CoupleManageSkillVO[]>(`/api/couple/manage/skills/${id}/take`, {}),
  /** F182 标记交换完成 */
  doneSkill: (id: string) =>
    http.postJson<CoupleManageSkillVO[]>(`/api/couple/manage/skills/${id}/done`, {}),

  /** F183 月度互评看板（我/TA 两份评审 + 是否互评完成） */
  monthReviews: () => http.get<CoupleManageMonthBoardVO>('/api/couple/manage/month-reviews'),
  /** F183 提交/修改我的月度评审（stars 1-5） */
  saveMonthReview: (stars: number, advice: string) =>
    http.postJson<CoupleManageMonthBoardVO>('/api/couple/manage/month-reviews', { stars, advice }),

  /** F184 家庭应急卡列表 */
  emergencyCards: () => http.get<CoupleManageEmergencyCardVO[]>('/api/couple/manage/emergency-cards'),
  /** F184 保存我的应急卡（三字段至少填一项） */
  saveEmergencyCard: (body: { contacts: string; keysPlace: string; medicine: string }) =>
    http.postJson<CoupleManageEmergencyCardVO[]>('/api/couple/manage/emergency-card', body),

  /** F185 情侣存档点列表 */
  snapshots: () => http.get<CoupleManageSnapshotVO[]>('/api/couple/manage/snapshots'),
  /** F185 存一个档（loveTemp 0-100） */
  saveSnapshot: (body: { loveTemp: number; work: string; health: string }) =>
    http.postJson<CoupleManageSnapshotVO[]>('/api/couple/manage/snapshots', body),

  /** F186 家务积分账户（余额/奖励/流水） */
  points: () => http.get<CoupleManagePointAccountVO>('/api/couple/manage/points'),
  /** F186 赚积分（记一笔事项） */
  earnPoints: (item: string, points: number) =>
    http.postJson<CoupleManagePointAccountVO>('/api/couple/manage/points/earn', { item, points }),
  /** F186 兑换奖励 */
  redeemPoints: (rewardCode: string) =>
    http.postJson<CoupleManagePointAccountVO>('/api/couple/manage/points/redeem', { rewardCode }),

  /** F187 五年计划双轨列表 */
  fiveYearPlans: () => http.get<CoupleManageFiveYearPlanVO[]>('/api/couple/manage/five-year-plans'),
  /** F187 立一条计划（track：MINE 我的一半 / OURS 我们的一半） */
  createFiveYearPlan: (track: CoupleManageFiveYearPlanVO['track'], content: string) =>
    http.postJson<CoupleManageFiveYearPlanVO[]>('/api/couple/manage/five-year-plans', { track, content }),
  /** F187 认领 OURS 计划的我这一半 */
  claimFiveYearPlan: (id: string) =>
    http.postJson<CoupleManageFiveYearPlanVO[]>(`/api/couple/manage/five-year-plans/${id}/claim`, {}),
  /** F187 标记计划达成 */
  finishFiveYearPlan: (id: string) =>
    http.postJson<CoupleManageFiveYearPlanVO[]>(`/api/couple/manage/five-year-plans/${id}/finish`, {}),

  /** F188 纪念日策划案列表 */
  annivPlans: () => http.get<CoupleManageAnnivPlanVO[]>('/api/couple/manage/anniv-plans'),
  /** F188 提交策划案（day：yyyy-MM-dd） */
  createAnnivPlan: (body: { day: string; title: string; idea: string }) =>
    http.postJson<CoupleManageAnnivPlanVO[]>('/api/couple/manage/anniv-plans', body),
  /** F188 推进状态：IDEA→LOCKED→DONE */
  advanceAnnivPlan: (id: string) =>
    http.postJson<CoupleManageAnnivPlanVO[]>(`/api/couple/manage/anniv-plans/${id}/advance`, {}),

  /** F189 经营周报 */
  weekly: () => http.get<CoupleManageWeeklyVO>('/api/couple/manage/weekly'),
}

// ============ 时光博物馆（F190-F199） ============
export const museumApi = {
  /** F190 恋爱纪录片：场景列表（新→旧） */
  listScenes: () => http.get<CoupleMuseumDocSceneVO[]>('/api/couple/museum/scenes'),
  /** F190 提交一部三幕纪录片，返回最新全量列表 */
  createScene: (body: { title: string; actOne: string; actTwo: string; actThree: string }) =>
    http.postJson<CoupleMuseumDocSceneVO[]>('/api/couple/museum/scenes', body),

  /** F191 博物馆展品列表 */
  listExhibits: () => http.get<CoupleMuseumExhibitVO[]>('/api/couple/museum/exhibits'),
  /** F191 捐一件展品（obtainedDay：入手日期 yyyy-MM-dd，可空），返回最新全量列表 */
  createExhibit: (body: { name: string; story: string; obtainedDay?: string | null }) =>
    http.postJson<CoupleMuseumExhibitVO[]>('/api/couple/museum/exhibits', {
      name: body.name,
      story: body.story,
      obtainedDay: body.obtainedDay ?? null,
    }),

  /** F192 去年今日对比镜 */
  getLastYear: () => http.get<CoupleMuseumMirrorVO>('/api/couple/museum/last-year'),

  /** F193 银发情话机（今日一句） */
  getSilverLine: () => http.get<CoupleMuseumSilverLineVO>('/api/couple/museum/silver-line'),

  /** F194 恋爱高频词 */
  getWords: () => http.get<CoupleMuseumWordVO[]>('/api/couple/museum/words'),

  /** F195 隐藏成就墙（GET 自动解锁） */
  getAchievements: () => http.get<CoupleMuseumAchievementVO[]>('/api/couple/museum/achievements'),

  /** F196 家规宪法列表 */
  getRules: () => http.get<CoupleMuseumRuleVO[]>('/api/couple/museum/rules'),
  /** F196 立条款/修正案（kind=AMENDMENT 时 refId 指向被修正的已签字条款），返回最新全量列表 */
  createRule: (body: { kind: CoupleMuseumRuleVO['kind']; refId?: string | null; content: string }) =>
    http.postJson<CoupleMuseumRuleVO[]>('/api/couple/museum/rules', {
      kind: body.kind,
      refId: body.refId ?? null,
      content: body.content,
    }),
  /** F196 签字确认 TA 提出的条款，返回最新全量列表 */
  signRule: (id: string) => http.postJson<CoupleMuseumRuleVO[]>(`/api/couple/museum/rules/${id}/sign`, {}),

  /** F197 免打扰时段：双方当前设置 */
  getDnd: () => http.get<CoupleMuseumDndVO[]>('/api/couple/museum/dnd'),
  /** F197 保存我的免打扰时段（startTime/endTime 为 HH:mm），返回最新全量列表 */
  saveDnd: (body: { startTime: string; endTime: string; enabled: boolean }) =>
    http.postJson<CoupleMuseumDndVO[]>('/api/couple/museum/dnd', body),

  /** F199 年度记忆书 */
  getAnnualBook: () => http.get<CoupleMuseumBookVO>('/api/couple/museum/annual-book'),

  /** F197 今日问候条（叠加免打扰状态） */
  getGreeting: () => http.get<CoupleMuseumGreetingVO>('/api/couple/museum/greeting'),
}

// ============ 常用收藏（F207） ============
export const pinApi = {
  /** 双方收藏的功能卡 key（mine/partner 各 ≤6 个） */
  list: () => http.get<CouplePinVO>('/api/couple/pin'),
  /** 全量覆盖保存我的收藏（超过 6 个后端 400；无空间 404 由调用方静默） */
  save: (pins: string[]) => http.postJson<CouplePinVO>('/api/couple/pin', { pins }),
}

// ============ 两个人的饭桌（F210-F219） ============
export const diningApi = {
  /** F210 今日饭桌：双方饭票 + 撞菜命中 + 裁决 + 话题打卡状态 */
  dineToday: () => http.get<CoupleDineTodayVO>('/api/couple/dining/today'),
  /** F210 投/改今日饭票（每人每天一票，改票即覆盖），返回最新今日饭桌 */
  dineCastTicket: (dish: string, reason: string) =>
    http.postJson<CoupleDineTodayVO>('/api/couple/dining/ticket', { dish, reason }),
  /** F211 今日话题打卡（幂等），返回最新今日饭桌 */
  dineMarkTopic: () => http.postJson<CoupleDineTodayVO>('/api/couple/dining/topic/mark', {}),

  /** F215 餐厅星评流水（最新 30 条） */
  dineRates: () => http.get<CoupleDineRateVO[]>('/api/couple/dining/rates'),
  /** F215 记一笔星评（stars 后端钳 1-5），返回最新流水 */
  dineRate: (body: { day: string; dish: string; stars: number; comment: string }) =>
    http.postJson<CoupleDineRateVO[]>('/api/couple/dining/rate', body),

  /** F216 踩雷库列表 */
  dineNogos: () => http.get<CoupleDineNogoVO[]>('/api/couple/dining/nogos'),
  /** F216 添加踩雷（同名后端 400），返回最新列表 */
  dineAddNogo: (name: string, reason: string) =>
    http.postJson<CoupleDineNogoVO[]>('/api/couple/dining/nogo', { name, reason }),
  /** F216 删除踩雷（仅提议人可删，否则 400），返回最新列表 */
  dineRemoveNogo: (id: string) => http.delete<CoupleDineNogoVO[]>(`/api/couple/dining/nogo/${id}`),

  /** F212-F214 本周饭桌整板（周菜单 + 拿手菜 + 搭伙车） */
  dineBoard: () => http.get<CoupleDineBoardVO>('/api/couple/dining/board'),
  /** F212 排/擦本周某天菜单（day：本周内 yyyy-MM-dd；dish 空串=擦掉该格），返回整板 */
  dineSavePlan: (day: string, dish: string) =>
    http.postJson<CoupleDineBoardVO>('/api/couple/dining/plan', { day, dish }),
  /** F213 本周拿手菜 upsert（score 1-5），返回整板 */
  dineSaveHomecook: (dish: string, score: number) =>
    http.postJson<CoupleDineBoardVO>('/api/couple/dining/homecook', { dish, score }),
  /** F214 搭伙车加菜（qty 份数），返回整板 */
  dineCartAdd: (item: string, qty: number) =>
    http.postJson<CoupleDineBoardVO>('/api/couple/dining/cart', { item, qty }),
  /** F214 锁一份菜（双方各锁一次才 LOCKED），返回整板 */
  dineCartLock: (id: string) => http.postJson<CoupleDineBoardVO>(`/api/couple/dining/cart/${id}/lock`, {}),
  /** F214 撤掉本人未锁的菜，返回整板 */
  dineCartRemove: (id: string) => http.delete<CoupleDineBoardVO>(`/api/couple/dining/cart/${id}`),

  /** F219 点单机：按心情领今日一杯（mood 非法值后端兜底返回开心） */
  dineDrink: (mood: string) => http.get<CoupleDineDrinkVO>(`/api/couple/dining/drink?mood=${encodeURIComponent(mood)}`),

  /** F217 年度干饭账（year：yyyy） */
  dineYear: (year: string) => http.get<CoupleDineYearVO>(`/api/couple/dining/year?year=${encodeURIComponent(year)}`),
}

// ============ 体温同步·作息与健康（F220-F229） ============
export const cozyApi = {
  /** F220-F228 今日体温总览：熄灯/睡眠单/数羊/喝水/冷暖/熬夜卡/慢生活/对策本/抱抱一次拉齐 */
  cozyToday: () => http.get<CoupleCozyTodayVO>('/api/couple/cozy/today'),
  /** F220 道晚安点灯（每人一晚一次，atTime 可空），返回最新今日总览 */
  cozyLightout: (atTime?: string | null) =>
    http.postJson<CoupleCozyTodayVO>('/api/couple/cozy/lightout', { atTime: atTime ?? null }),
  /** F221 报昨夜睡眠自评（stars 后端钳 1-5，dream ≤70 字，本人当日可改），返回最新今日总览 */
  cozySleep: (day: string, stars: number, dream: string) =>
    http.postJson<CoupleCozyTodayVO>('/api/couple/cozy/sleep', { day, stars, dream }),
  /** F222 数一只羊（60s 窗口内累计，满 10 下成群；成群后再点不计数），返回最新今日总览 */
  cozySheep: () => http.postJson<CoupleCozyTodayVO>('/api/couple/cozy/sheep', {}),
  /** F223 干一杯水（我的杯数 +1，TA 的杯子亮一格），返回最新今日总览 */
  cozyWater: () => http.postJson<CoupleCozyTodayVO>('/api/couple/cozy/water', {}),
  /** F224 互报今日冷暖（city ≤30 字 / feel ≤10 字 / tempText ≤10 字，当日可改），返回最新今日总览 */
  cozyWeather: (city: string, feel: string, tempText: string) =>
    http.postJson<CoupleCozyTodayVO>('/api/couple/cozy/weather', { city, feel, tempText }),
  /** F224 对 TA 今日体感一键叮嘱添衣（同一人一天一次），返回最新今日总览 */
  cozyAdvise: () => http.postJson<CoupleCozyTodayVO>('/api/couple/cozy/weather/advise', {}),
  /** F225 递「早点睡」陪伴卡（一天一张，重复递幂等），返回最新今日总览 */
  cozyLatenight: () => http.postJson<CoupleCozyTodayVO>('/api/couple/cozy/latenight', {}),
  /** F226 提本周慢生活小事（≤70 字，可改），返回最新今日总览 */
  cozySlow: (thing: string) => http.postJson<CoupleCozyTodayVO>('/api/couple/cozy/slow', { thing }),
  /** F226 打卡我的慢生活小事（本周没提小事 400），返回最新今日总览 */
  cozySlowCheck: () => http.postJson<CoupleCozyTodayVO>('/api/couple/cozy/slow/check', {}),
  /** F227 登记/更新我的疼痛对策本（≤300 字），返回最新今日总览 */
  cozyRemedy: (body: string) => http.postJson<CoupleCozyTodayVO>('/api/couple/cozy/remedy', { body }),
  /** F227 一键按 TA 的对策执行并送达关怀（TA 没写对策本 400），返回最新今日总览 */
  cozyComfort: () => http.postJson<CoupleCozyTodayVO>('/api/couple/cozy/comfort', {}),
  /** F228 自报抱抱计数（cnt 后端钳 1-99，note ≤70 字），跨里程碑后端点亮，返回最新今日总览 */
  cozyHug: (cnt: number, note: string) =>
    http.postJson<CoupleCozyTodayVO>('/api/couple/cozy/hug', { cnt, note }),
  /** F229 月度安眠小结（month：yyyy-MM，缺省当月；体温同步指数 0-100） */
  cozyMonthly: (month?: string) =>
    http.get<CoupleCozyMonthlyVO>(month ? `/api/couple/cozy/monthly?month=${encodeURIComponent(month)}` : '/api/couple/cozy/monthly'),
}

// ============ 小日子·仪式感（F230-F239） ============
export const ceremonyApi = {
  /** F230-F239 今日仪式总览：黄历宜忌/小日子/催办/保险柜/续约/愿望券/体感/加冕一次拉齐 */
  cereOverview: () => http.get<CoupleCerOverviewVO>('/api/couple/ceremony/overview'),
  /** F237 小日子史册：一年一页的庆祝记录与感言（按 foundedId 懒加载） */
  cereChronicle: (foundedId: string) =>
    http.get<CoupleCerChronicleVO>(`/api/couple/ceremony/chronicle?foundedId=${encodeURIComponent(foundedId)}`),
  /** F230 新建小日子（起名+起始日+是否每年重复），返回整份总览 */
  cereAddFounded: (name: string, startDay: string, repeatYear: boolean) =>
    http.postJson<CoupleCerOverviewVO>('/api/couple/ceremony/founded', { name, startDay, repeatYear }),
  /** F230 删除小日子（连同过法卡与打卡），返回整份总览 */
  cereRemoveFounded: (id: string) =>
    http.postJson<CoupleCerOverviewVO>('/api/couple/ceremony/founded/remove', { id }),
  /** F232 写过法任务卡（每个小日子最多 3 条，超出后端 400），返回整份总览 */
  cereAddRitual: (foundedId: string, content: string) =>
    http.postJson<CoupleCerOverviewVO>('/api/couple/ceremony/ritual', { foundedId, content }),
  /** F232 划掉一条过法卡（连同它的打卡记录），返回整份总览 */
  cereRemoveRitual: (id: string) =>
    http.postJson<CoupleCerOverviewVO>('/api/couple/ceremony/ritual/remove', { id }),
  /** F233 庆祝打卡：给过法卡打勾（当日幂等），返回整份总览 */
  cereMark: (id: string) =>
    http.postJson<CoupleCerOverviewVO>('/api/couple/ceremony/mark', { id }),
  /** F234 交本月保费：夸 TA 一句（一人一月一句，可改写），返回整份总览 */
  cerePolicy: (quote: string) =>
    http.postJson<CoupleCerOverviewVO>('/api/couple/ceremony/policy', { quote }),
  /** F235 续约日签字「我还是选你」（非续约日后端 400 带剩余天数），返回整份总览 */
  cereRenew: (line: string) =>
    http.postJson<CoupleCerOverviewVO>('/api/couple/ceremony/renew', { line }),
  /** F236 发一张愿望券（券面自拟 ≤80 字），返回整份总览 */
  cereIssueCoupon: (title: string) =>
    http.postJson<CoupleCerOverviewVO>('/api/couple/ceremony/coupon', { title }),
  /** F236 核销一张愿望券（OPEN→USED，已核销再核 400），返回整份总览 */
  cereUseCoupon: (id: string) =>
    http.postJson<CoupleCerOverviewVO>('/api/couple/ceremony/coupon/use', { id }),
  /** F239 留一句「此刻感觉」（day 空=今天，一人一天一句可改写），返回整份总览 */
  cereRecap: (feeling: string, day?: string | null) =>
    http.postJson<CoupleCerOverviewVO>('/api/couple/ceremony/recap', { day: day ?? null, feeling }),
}

/** F240-F249 我们公司：头衔任命/董事会决议/年度述职/发薪日/金点子/例会签到/职级公示（方法统一 bd 前缀防撞名） */
export const boardApi = {
  /** F240-F249 我们公司总览：任命/议案/述职/发薪/点子/签到/职级/名片/周报一次拉齐 */
  bdOverview: () => http.get<CoupleBdOverviewVO>('/api/couple/board/overview'),
  /** F240 给 TA 封一个职位（每人待任命最多 2 个，超出后端 400），返回整份总览 */
  bdProposeRole: (title: string) =>
    http.postJson<CoupleBdOverviewVO>('/api/couple/board/role', { title }),
  /** F240 被任命者盖章上任（限本人，已生效再点后端 400），返回整份总览 */
  bdAppoint: (id: string) =>
    http.postJson<CoupleBdOverviewVO>('/api/couple/board/role/appoint', { id }),
  /** F241 提交一件董事会大事议案（待对方表决），返回整份总览 */
  bdProposeVote: (title: string) =>
    http.postJson<CoupleBdOverviewVO>('/api/couple/board/vote', { title }),
  /** F241 表决：agree=附议通过 / false=一票否决（提案人不能裁自己的案，后端 400），返回整份总览 */
  bdDecide: (id: string, agree: boolean) =>
    http.postJson<CoupleBdOverviewVO>('/api/couple/board/vote/decide', { id, agree }),
  /** F242 交年度述职+明年小目标（同年可改写；year 空=今年），返回整份总览 */
  bdReport: (year: string, review: string, goal: string) =>
    http.postJson<CoupleBdOverviewVO>('/api/couple/board/report', { year, review, goal }),
  /** F244 发本月感谢工资（一句感谢+5 积分入账，一月一次，重复后端 400），返回整份总览 */
  bdSalary: (thanks: string) =>
    http.postJson<CoupleBdOverviewVO>('/api/couple/board/salary', { thanks }),
  /** F245 往金点子箱投一条一句话经营提案，返回整份总览 */
  bdIdea: (content: string) =>
    http.postJson<CoupleBdOverviewVO>('/api/couple/board/idea', { content }),
  /** F245 采纳 TA 的金点子（自动生成决议走表决流程；自己的点子须对方采纳，后端 400），返回整份总览 */
  bdAdoptIdea: (id: string) =>
    http.postJson<CoupleBdOverviewVO>('/api/couple/board/idea/adopt', { id }),
  /** F247 例会一键签到（10 秒窗口内双签到=会议召开，每天一次），返回整份总览 */
  bdAttend: () =>
    http.postJson<CoupleBdOverviewVO>('/api/couple/board/attend', {}),
}

/** F250-F259 夫妻老黄历：节气跟风/过法/择吉日/节日家档/手账/长假愿望/放空日/生肖年运/一年小结（方法统一 alm 前缀防撞名） */
export const almanacApi = {
  /** F250-F259 今日岁时总览：节气/过法/吉日/家档/手账/长假/放空/农历换算一次拉齐 */
  almToday: () => http.get<CoupleAlmTodayVO>('/api/couple/almanac/today'),
  /** F250 节气当日一键跟风（非节气日/放空日/已跟过 后端 400 中文直透；note 晒的一句话 ≤140 字），返回整份总览 */
  almCheck: (note?: string) =>
    http.postJson<CoupleAlmTodayVO>('/api/couple/almanac/check', { note: note ?? '' }),
  /** F251 给某个节气写过法（每节气最多 2 条，超出后端 400），返回整份总览 */
  almRitualAdd: (term: string, content: string) =>
    http.postJson<CoupleAlmTodayVO>('/api/couple/almanac/ritual', { term, content }),
  /** F251 划掉一条过法（谁写的谁划，TA 写的后端 400），返回整份总览 */
  almRitualRemove: (id: string) =>
    http.postJson<CoupleAlmTodayVO>('/api/couple/almanac/ritual/remove', { id }),
  /** F251 节气当日给过法打勾（不在那天打后端 400；放空日挡打），返回整份总览 */
  almRitualMark: (id: string) =>
    http.postJson<CoupleAlmTodayVO>('/api/couple/almanac/ritual/mark', { id }),
  /** F252 为大事择吉日（须往未来挑，matter ≤60 字，后端出黄历点评），返回整份总览 */
  almLucky: (day: string, matter: string) =>
    http.postJson<CoupleAlmTodayVO>('/api/couple/almanac/lucky', { day, matter }),
  /** F252 吉日盖章（限对方发起的那条，自己择的日后端 400），返回整份总览 */
  almLuckyConfirm: (id: string) =>
    http.postJson<CoupleAlmTodayVO>('/api/couple/almanac/lucky/confirm', { id }),
  /** F254 写某节日今年的过法（可改写；festival 须是八个节日之一，plan ≤200 字），返回整份总览 */
  almFestival: (festival: string, year: string, plan: string) =>
    http.postJson<CoupleAlmTodayVO>('/api/couple/almanac/festival', { festival, year, plan }),
  /** F255 节气手账：给某节气记一件小事（本人可改写，≤140 字；year 空=今年），返回整份总览 */
  almNote: (term: string, year: string, text: string) =>
    http.postJson<CoupleAlmTodayVO>('/api/couple/almanac/note', { term, year, text }),
  /** F257 长假愿望：首写或补写（60 天内无长假后端 400；wish ≤200 字），返回整份总览 */
  almWish: (wish: string) =>
    http.postJson<CoupleAlmTodayVO>('/api/couple/almanac/wish', { wish }),
  /** F258 提报放空日（往未来放，一年最多 3 天，超出/重复后端 400），返回整份总览 */
  almNormal: (day: string) =>
    http.postJson<CoupleAlmTodayVO>('/api/couple/almanac/normal', { day }),
  /** F256 生肖年运：双方生肖 + 本年双人年运一句（读接口） */
  almZodiac: () => http.get<CoupleAlmZodiacVO>('/api/couple/almanac/zodiac'),
  /** F259 一年日子小结（year：yyyy，缺省今年；返回计数与节气长卷） */
  almYearly: (year?: string) =>
    http.get<CoupleAlmYearVO>(year ? `/api/couple/almanac/yearly?year=${encodeURIComponent(year)}` : '/api/couple/almanac/yearly'),
}

/**
 * F260-F269 倾听与发声（listenApi，基址 /api/couple/listen）
 * 除 lsToday 为读接口外，17 个 POST 写接口全部返回整份 TodayVO，前端整体替换即全卡刷新。
 * 业务规则由后端 400 中文 message 直透 ElMessage（在途时段唯一、说的人不能自确认、聊完才能打分、
 * 自己代笔不能自己定稿、本周只能出一题、自己的题不能自己答、开放日要在写信日之后、一天一封信、
 * 三行至少写一行、语气只有四种、休战旗在途仅一面且未到点不许表态等）。
 */
export const listenApi = {
  /** F260-F269 今日倾听台总览（含早想说惰性放行、休战到期结算；未建空间 404 前端静默降级） */
  lsToday: () => http.get<CoupleLsTodayVO>('/api/couple/listen/today'),
  /** F260 申请一个「只听我说」时段（topic ≤140 字；已有在途时段后端 400），返回整份总览 */
  lsRequestSlot: (topic: string) =>
    http.postJson<CoupleLsTodayVO>('/api/couple/listen/slot', { topic }),
  /** F260 倾听人确认开麦（说的人自己确认后端 400：耳朵是 TA 的），返回整份总览 */
  lsConfirmSlot: (id: string) =>
    http.postJson<CoupleLsTodayVO>('/api/couple/listen/slot/confirm', { id }),
  /** F260 聊完收场（任意一方点；TA 未确认开麦时后端 400），返回整份总览 */
  lsDoneSlot: (id: string) =>
    http.postJson<CoupleLsTodayVO>('/api/couple/listen/slot/done', { id }),
  /** F260 互评被听感 1-5 分（后端钳 1-5，说的人填 rateMine、听的人填 ratePartner，各打一次；note 仅说的人那份生效 ≤140 字；未聊完打分后端 400） */
  lsRateSlot: (id: string, score: number, note?: string) =>
    http.postJson<CoupleLsTodayVO>('/api/couple/listen/slot/rate', { id, score, note: note ?? '' }),
  /** F261 替 TA 写一句心里话（一人一份在途草稿，重复提交即覆盖，≤200 字），返回整份总览 */
  lsProxy: (content: string) =>
    http.postJson<CoupleLsTodayVO>('/api/couple/listen/proxy', { content }),
  /** F261 被代笔的人定稿（finalText 空=照念原句；自己代笔的自己定稿后端 400），返回整份总览 */
  lsProxyAdopt: (id: string, finalText: string) =>
    http.postJson<CoupleLsTodayVO>('/api/couple/listen/proxy/adopt', { id, finalText }),
  /** F262 误会倒带（topic ≤60 字，我当时以为/我猜你其实想 各 ≤200 字，两边至少写一边否则 400；同日同主题本人可改写），返回整份总览 */
  lsMisrewind: (topic: string, mine: string, theirs: string) =>
    http.postJson<CoupleLsTodayVO>('/api/couple/listen/misrewind', { topic, mine, theirs }),
  /** F263 本周抛出难住我的问题（≤140 字，一周只能一题，重复后端 400），返回整份总览 */
  lsStuck: (question: string) =>
    http.postJson<CoupleLsTodayVO>('/api/couple/listen/stuck', { question }),
  /** F263 答 TA 的题（≤200 字；自己的题自己答后端 400，答过再答幂等），返回整份总览 */
  lsStuckAnswer: (id: string, answer: string) =>
    http.postJson<CoupleLsTodayVO>('/api/couple/listen/stuck/answer', { id, answer }),
  /** F264 写换位信（以对方口吻写，≤500 字；openDay 空=默认 7 天后开放，须在写信日之后；一天一封信 400），返回整份总览 */
  lsLetter: (content: string, openDay: string) =>
    http.postJson<CoupleLsTodayVO>('/api/couple/listen/letter', { content, openDay: openDay || null }),
  /** F264 拆 TA 写给我的换位信（未到开放日/拆自己写的后端 400），返回整份总览 */
  lsLetterOpen: (id: string) =>
    http.postJson<CoupleLsTodayVO>('/api/couple/listen/letter/open', { id }),
  /** F265 封存一句早想说（≤200 字，队列按每 7 天自动放行一句），返回整份总览 */
  lsHold: (content: string) =>
    http.postJson<CoupleLsTodayVO>('/api/couple/listen/hold', { content }),
  /** F266 今日三行打卡（印象/谢/夸 各 ≤80 字，三行至少写一行否则 400；当日重复提交改写，连续 21 天后端解锁纪念），返回整份总览 */
  lsThree: (morning: string, thanks: string, praise: string) =>
    http.postJson<CoupleLsTodayVO>('/api/couple/listen/three', { morning, thanks, praise }),
  /** F267 自报今日语气（tone 仅 TIRED/BUSY/SAD/OKAY 四种，其它后端 400；note 补一句 ≤60 字；当日可改），返回整份总览 */
  lsTone: (tone: CoupleLsToneKey, note?: string) =>
    http.postJson<CoupleLsTodayVO>('/api/couple/listen/tone', { tone, note: note ?? '' }),
  /** F268 举休战旗（minutes 缺省 30，后端钳 10-120；在途已有一面时后端 400），返回整份总览 */
  lsTruce: (minutes?: number) =>
    http.postJson<CoupleLsTodayVO>('/api/couple/listen/truce', { minutes: minutes ?? null }),
  /** F268 到点表态：goOn=true 继续（各退一步再聊）/ false 算了（翻篇）；未到解冻时刻或没有在途旗后端 400，双人才收旗，返回整份总览 */
  lsTruceDecide: (goOn: boolean) =>
    http.postJson<CoupleLsTodayVO>('/api/couple/listen/truce/decide', { goOn }),
  /** F269 今日称呼「用过了」（一人一次幂等，双用过当日达成），返回整份总览 */
  lsNameUse: () => http.postJson<CoupleLsTodayVO>('/api/couple/listen/name/use', {}),
}

/**
 * F270-F279 二人制造厂（factoryApi，基址 /api/couple/factory）
 * 除 fyBoard 为读接口外，24 个 POST 写接口全部返回整份 BoardVO，前端整体替换即五卡刷新。
 * 业务规则由后端 400 中文 message 直透 ElMessage（一周一转、至少两项、自己的活自己认、没认账干完无效、
 * 清单谁登记谁划、快递不能自己接自己的单且谁领谁销单、叫醒词只能递 TA 定的且一天一张、
 * 提醒是对方做的事、吃没吃本人来报、一天只拍一次久坐、垫付金额须正的整数分、还钱的一方才按确认键、
 * 自己买的东西不用猜、猜心只有一次机会、只有买家能打分、TA 没猜不能打、家安六项必须勾齐等）。
 */
export const factoryApi = {
  /** F270-F279 本周车间总览（十卡一次拉齐；未建空间 404 前端静默降级） */
  fyBoard: () => http.get<CoupleFyBoardVO>('/api/couple/factory/board'),
  /** F270 一转定分工（逗号/顿号分隔事项，2-8 条、每条 ≤40 字且不可重复；本周已转过后端 400），返回整份总览 */
  fySpin: (items: string) =>
    http.postJson<CoupleFyBoardVO>('/api/couple/factory/spin', { items }),
  /** F270 给天选之人的任务认账（双签生效；自己行点自己后端 400「自己的活自己认」），返回整份总览 */
  fySpinConfirm: (id: string) =>
    http.postJson<CoupleFyBoardVO>('/api/couple/factory/spin/confirm', { id }),
  /** F270 天选之人干完打勾（非本人行/对方还没认账时后端 400），返回整份总览 */
  fySpinDone: (id: string) =>
    http.postJson<CoupleFyBoardVO>('/api/couple/factory/spin/done', { id }),
  /** F271 往超市清单加一项（name ≤60 字，qty ≤30 字可为空），返回整份总览 */
  fyShopAdd: (name: string, qty: string) =>
    http.postJson<CoupleFyBoardVO>('/api/couple/factory/shop', { name, qty }),
  /** F271 划掉清单一项（谁登记谁划，划 TA 点的后端 400），返回整份总览 */
  fyShopRemove: (id: string) =>
    http.postJson<CoupleFyBoardVO>('/api/couple/factory/shop/remove', { id }),
  /** F271 我买回来了（幂等；非登记人买回会推 TA 一条感谢），返回整份总览 */
  fyShopDone: (id: string) =>
    http.postJson<CoupleFyBoardVO>('/api/couple/factory/shop/done', { id }),
  /** F272 冰箱入库/补货（同名覆盖复活；item ≤60 字，expireDay 空串=不写赏味期，格式须 yyyy-MM-dd），返回整份总览 */
  fyStockAdd: (item: string, qty: string, expireDay: string) =>
    http.postJson<CoupleFyBoardVO>('/api/couple/factory/stock', { item, qty, expireDay }),
  /** F272 用完清掉（幂等；冰箱里没有这件后端 400），返回整份总览 */
  fyStockOut: (id: string) =>
    http.postJson<CoupleFyBoardVO>('/api/couple/factory/stock/out', { id }),
  /** F273 下一单求代拿（note 可空、≤60 字），返回整份总览 */
  fyParcelNew: (note: string) =>
    http.postJson<CoupleFyBoardVO>('/api/couple/factory/parcel', { note }),
  /** F273 接单侠认领（只能接 TA 的单，自己下自己接/已被认领后端 400），返回整份总览 */
  fyParcelGrab: (id: string) =>
    http.postJson<CoupleFyBoardVO>('/api/couple/factory/parcel/grab', { id }),
  /** F273 送达销单（谁领的单谁销单；成功自动进 2 积分感谢章），返回整份总览 */
  fyParcelDone: (id: string) =>
    http.postJson<CoupleFyBoardVO>('/api/couple/factory/parcel/done', { id }),
  /** F274 定本周叫醒词（≤60 字，同一人可改写覆盖），返回整份总览 */
  fyWakeSet: (content: string) =>
    http.postJson<CoupleFyBoardVO>('/api/couple/factory/wake', { content }),
  /** F274 递今日叫醒卡（只能递 TA 定的词；TA 没定词/今天已递过后端 400，无请求体），返回整份总览 */
  fyWakeGive: () =>
    http.postJson<CoupleFyBoardVO>('/api/couple/factory/wake/give', {}),
  /** F275 登记在服药物（name ≤40 字、times ≤60 字必填；同名在服中后端 400，停过则复活重置链），返回整份总览 */
  fyMedAdd: (name: string, times: string) =>
    http.postJson<CoupleFyBoardVO>('/api/couple/factory/med', { name, times }),
  /** F275 停服（本人说了算，给对方药点停后端 400），返回整份总览 */
  fyMedStop: (id: string) =>
    http.postJson<CoupleFyBoardVO>('/api/couple/factory/med/stop', { id }),
  /** F275 TA 点「提醒了」（一天一次幂等；自己的药自己提醒后端 400），返回整份总览 */
  fyMedRemind: (id: string) =>
    http.postJson<CoupleFyBoardVO>('/api/couple/factory/med/remind', { id }),
  /** F275 本人点「吃了」（一天一次幂等，连续日链 +1、断日重开；非本人报后端 400），返回整份总览 */
  fyMedTaken: (id: string) =>
    http.postJson<CoupleFyBoardVO>('/api/couple/factory/med/taken', { id }),
  /** F276 站起来拍一下（与 TA 间隔 ≤1 小时记同起；今天已拍过再拍后端 400，无请求体），返回整份总览 */
  fyStandup: () =>
    http.postJson<CoupleFyBoardVO>('/api/couple/factory/standup', {}),
  /** F277 记一笔垫付（item ≤60 字，amountCents 为正整数分且 ≤1 亿元，note ≤140 字可空），返回整份总览 */
  fyAdvanceAdd: (item: string, amountCents: number, note: string) =>
    http.postJson<CoupleFyBoardVO>('/api/couple/factory/advance', { item, amountCents, note }),
  /** F277 清账（欠款的一方按确认键，垫付人自己点后端 400；已还清幂等），返回整份总览 */
  fyAdvanceSettle: (id: string) =>
    http.postJson<CoupleFyBoardVO>('/api/couple/factory/advance/settle', { id }),
  /** F278 本周战利品上报（≤300 字，同一人可改写覆盖），返回整份总览 */
  fyGrocery: (items: string) =>
    http.postJson<CoupleFyBoardVO>('/api/couple/factory/grocery', { items }),
  /** F278 猜 TA 的采购动机（≤300 字；自己的单不用猜、猜过一次落子无悔，均后端 400），返回整份总览 */
  fyGroceryGuess: (id: string, guess: string) =>
    http.postJson<CoupleFyBoardVO>('/api/couple/factory/grocery/guess', { id, guess }),
  /** F279 采购方给 TA 的猜测打分 0-5（后端钳 0-5，打过一次幂等；不是买家/TA 还没猜后端 400），返回整份总览 */
  fyGroceryRate: (id: string, score: number) =>
    http.postJson<CoupleFyBoardVO>('/api/couple/factory/grocery/rate', { id, score }),
  /** F279 提交本月家安月检（六项齐全：GAS/WATER/ELEC/WINDOW/LOCK/FIRSTAID，逗号分隔；缺项后端 400，本月可改写），返回整份总览 */
  fyHomeCheck: (items: string) =>
    http.postJson<CoupleFyBoardVO>('/api/couple/factory/homecheck', { items }),
}

/**
 * F280-F289 我们百科（codexApi，基址 /api/couple/codex）
 * cxOverview 为唯一读接口；其余 15 个 POST 写接口全部返回整份 OverviewVO，前端整体替换即五卡刷新。
 * 业务规则由后端 400 中文 message 直透 ElMessage（词条名 ≤40 字且同名即修订、释义 ≤200 字、
 * 词条只有首建人能撤、默契综艺一天一期且词条不足 5 条不能开场、五答交过就不能再交、
 * 榜单类目须八个 key 之一且每类 ≤10 项每条 ≤60 字、猜测可改写但只有下注那次推 TA、
 * 外号 ≤40 字故事 ≤300 字同名即改写、出题题面 ≤140 字答案 ≤60 字且不可重复、
 * 只有被考人能作答且答错缓 7 天、足迹地名 ≤60 字年份须 yyyy 同名覆盖、
 * 第一眼 ≤200 字已互见或自己交满 3 次就不能再交、习惯 ≤60 字同人同习惯不重复登记、
 * 判案只能由被观察那位亲自判且只能「确实/冤枉」、口味对象 ≤60 字同人同对象可改写、
 * 人格八题每题只能选 1 或 2 且一年一报覆盖当年等）。
 */
export const codexApi = {
  /** F280-F289 我们百科总览（十个板块一次拉齐；未建空间 404 前端静默降级） */
  cxOverview: () => http.get<CoupleCxOverviewVO>('/api/couple/codex/overview'),
  /** F280 新建/修订词条（term ≤40 字、definition ≤200 字必填；同名即改释义并记修订人），返回整份总览 */
  cxEntrySave: (term: string, definition: string, origin: string, usageNote: string) =>
    http.postJson<CoupleCxOverviewVO>('/api/couple/codex/entry', { term, definition, origin, usageNote }),
  /** F280 撤掉一个词条（只有首建人能撤，撤 TA 首建的后端 400），返回整份总览 */
  cxEntryRemove: (id: string) =>
    http.postJson<CoupleCxOverviewVO>('/api/couple/codex/entry/remove', { id }),
  /** F281 开一期默契综艺（词条不足 5 条 / 今天已开过后端 400，无请求体），返回整份总览 */
  cxQuizStart: () =>
    http.postJson<CoupleCxOverviewVO>('/api/couple/codex/quiz/start', {}),
  /** F281 交本期五答（逗号分隔 5 条、每条 ≤40 字；没开场或已交过后端 400），返回整份总览 */
  cxQuizAnswer: (answers: string) =>
    http.postJson<CoupleCxOverviewVO>('/api/couple/codex/quiz/answer', { answers }),
  /** F282 更新本人的类目榜（category 须八个类目键之一，items 逗号分隔 ≤10 条每条 ≤60 字；首次上榜才推 TA 来猜），返回整份总览 */
  cxTopList: (category: string, items: string) =>
    http.postJson<CoupleCxOverviewVO>('/api/couple/codex/top/list', { category, items }),
  /** F282 猜 TA 的类目榜（可反复改写；只有第一次下注推 TA，双方榜与猜测齐了即揭榜），返回整份总览 */
  cxTopGuess: (category: string, items: string) =>
    http.postJson<CoupleCxOverviewVO>('/api/couple/codex/top/guess', { category, items }),
  /** F283 收录/修订外号小传（nickname ≤40 字、story ≤300 字必填，givenBy/occasion/firstUsedDay 可空；同名即改写），返回整份总览 */
  cxStory: (nickname: string, givenBy: string, occasion: string, story: string, firstUsedDay: string) =>
    http.postJson<CoupleCxOverviewVO>('/api/couple/codex/story', { nickname, givenBy, occasion, story, firstUsedDay }),
  /** F284 给 TA 出一道「你记得吗」（question ≤140 字、answer ≤60 字必填；同题出过后端 400），返回整份总览 */
  cxExamAsk: (question: string, answer: string) =>
    http.postJson<CoupleCxOverviewVO>('/api/couple/codex/exam', { question, answer }),
  /** F284 被考人作答（别人的题后端 400；答对即记档不可重答；答错缓 7 天才能补考），返回整份总览 */
  cxExamTry: (id: string, answer: string) =>
    http.postJson<CoupleCxOverviewVO>('/api/couple/codex/exam/try', { id, answer }),
  /** F285 登记/修订足迹（name ≤60 字必填，year 空串或 yyyy，happened 可空，rating 1-5 后端钳制缺省 5；同名即改写），返回整份总览 */
  cxPlace: (name: string, year: string, happened: string, rating: number) =>
    http.postJson<CoupleCxOverviewVO>('/api/couple/codex/place', { name, year, happened, rating }),
  /** F286 盲提交「我注意到你的那一刻」（moment ≤200 字必填；已互见或自己已交满 3 次后端 400），返回整份总览 */
  cxFirstLook: (moment: string) =>
    http.postJson<CoupleCxOverviewVO>('/api/couple/codex/firstlook', { moment }),
  /** F287 记下 TA 的一个小习惯（habit ≤60 字必填，tag 可空；同一人重复记同一条后端 400），返回整份总览 */
  cxHabitAdd: (habit: string, tag: string) =>
    http.postJson<CoupleCxOverviewVO>('/api/couple/codex/habit', { habit, tag }),
  /** F287 判案：确实/冤枉（verdict 仅 REAL|WRONG，其它后端 400；只能被观察的那位亲自判，已判过幂等返回），返回整份总览 */
  cxHabitVerdict: (id: string, verdict: string) =>
    http.postJson<CoupleCxOverviewVO>('/api/couple/codex/habit/verdict', { id, verdict }),
  /** F288 记一笔口味变迁（thing ≤60 字必填，beforeText/nowText 可空，shiftedDay 空串=今天且格式须 yyyy-MM-dd；同人同对象可改写），返回整份总览 */
  cxTaste: (thing: string, beforeText: string, nowText: string, shiftedDay: string) =>
    http.postJson<CoupleCxOverviewVO>('/api/couple/codex/taste', { thing, beforeText, nowText, shiftedDay }),
  /** F289 提交八题四维人格速测（answers=8 个 1/2 逗号分隔，缺一题或出现别的值后端 400；当年重测覆盖），返回整份总览 */
  cxType: (answers: string) =>
    http.postJson<CoupleCxOverviewVO>('/api/couple/codex/type', { answers }),
}

/**
 * F290-F299 明日邮局（postApi，基址 /api/couple/post）
 * postBox 为唯一读接口；其余 20 个 POST 写接口全部返回整份 PostVO，前端整体替换即五卡刷新。
 * 业务规则由后端 400 中文 message 直透 ElMessage（新年卡一年一张、已寄出的收不回笔、
 * 大事名 ≤40 字且同名即已在册、一件大事最多拆 12 步、谁立的大事谁才有资格鸽、
 * 改天上架 ≤5 件且自己不能接自己的架、排期日要在今天之后、没认领不能直接完成、
 * 梦想家版本年须 yyyy、退休档位只有 30/40/50、井答 ≤140 字、胶囊只寄往 1/2/3 年后且在途 ≤3 笔、
 * 自己写的那笔不归自己拆、解梦官不能审自己的案、一晚只投一案、盖章只能做梦人本人、
 * 往年愿望才可盖章、旗的期限必须放未来、旗是谁立的谁销等）。
 */
export const postApi = {
  /** F290-F299 明日邮局总览（十板块一次拉齐，读时后端惰性结算：新年卡到期放行 / 拍卖逾期下架 / 承诺逾期降额；未建空间 404 前端静默降级） */
  postBox: () => http.get<CouplePostVO>('/api/couple/post/box'),
  /** F290 写/改写今年的五年后新年卡（content ≤500 字，一年一张；已寄出再写后端 400），返回整份总览 */
  postOath: (content: string) =>
    http.postJson<CouplePostVO>('/api/couple/post/oath', { content }),
  /** F291 立一件人生大事（name ≤40 字必填，targetDay 空串=不定期限且格式须 yyyy-MM-dd，note ≤200 字可空；同名后端 400），返回整份总览 */
  postBucketAdd: (name: string, targetDay: string, note: string) =>
    http.postJson<CouplePostVO>('/api/couple/post/bucket', { name, targetDay, note }),
  /** F291 放弃一件大事（只有发起人能鸽，放弃后留档 GONE 不再下发；点 TA 立的后端 400），返回整份总览 */
  postBucketAbandon: (id: string) =>
    http.postJson<CouplePostVO>('/api/couple/post/bucket/abandon', { id }),
  /** F291 给大事拆一步（text ≤80 字必填；一件大事 ≤12 步，超出后端 400），返回整份总览 */
  postStepAdd: (bucketId: string, text: string) =>
    http.postJson<CouplePostVO>('/api/couple/post/bucket/step', { bucketId, text }),
  /** F291 给一步打勾（双方都可点：本人完成 / TA 补进展章；走完全部步骤后端把大事记为 DONE 并推双方），返回整份总览 */
  postStepDone: (id: string) =>
    http.postJson<CouplePostVO>('/api/couple/post/bucket/step/done', { id }),
  /** F292 把「改天一定」上拍（thing ≤80 字必填，在架 ≤5 件、7 天无人认领后端自动下架），返回整份总览 */
  postShelf: (thing: string) =>
    http.postJson<CouplePostVO>('/api/couple/post/shelf', { thing }),
  /** F292 认领 TA 的架并排期（scheduledDay 必填且要在今天之后、格式 yyyy-MM-dd；自己上的架自己接后端 400），返回整份总览 */
  postShelfTake: (id: string, scheduledDay: string) =>
    http.postJson<CouplePostVO>('/api/couple/post/shelf/take', { id, scheduledDay }),
  /** F292 做完销单（任一方都可点；还没认领的单直接完成后端 400。请求体沿用 TakeRequest，scheduledDay 传空串即可），返回整份总览 */
  postShelfDone: (id: string) =>
    http.postJson<CouplePostVO>('/api/couple/post/shelf/done', { id, scheduledDay: '' }),
  /** F293 交/改写某一版的「想象中的家」（year 空串=今年、格式须 yyyy；四字段各 ≤100 字可空），返回整份总览 */
  postHome: (year: string, rooms: string, windowView: string, smell: string, corner: string) =>
    http.postJson<CouplePostVO>('/api/couple/post/home', { year, rooms, windowView, smell, corner }),
  /** F294 写某一岁的退休计划（ageBand 仅 30/40/50，其它后端 400；text ≤200 字必填；同人同档可改写），返回整份总览 */
  postRetire: (ageBand: string, text: string) =>
    http.postJson<CouplePostVO>('/api/couple/post/retire', { ageBand, text }),
  /** F295 答本周井题（answer ≤140 字必填，本周可改写；题目由后端按周序从题库取），返回整份总览 */
  postWell: (answer: string) =>
    http.postJson<CouplePostVO>('/api/couple/post/well', { answer }),
  /** F296 封存一笔未来信给 TA（content ≤500 字必填，years 仅 1/2/3 年后；名下在途 ≥3 笔后端 400），返回整份总览 */
  postRelay: (content: string, years: number) =>
    http.postJson<CouplePostVO>('/api/couple/post/relay', { content, years }),
  /** F296 拆 TA 写给我的到期那笔（我写的自己拆后端 400；没到开启日后端 400 带日期），返回整份总览 */
  postRelayOpen: (id: string) =>
    http.postJson<CouplePostVO>('/api/couple/post/relay/open', { id }),
  /** F297 记一笔梦投稿解梦局（dream ≤300 字必填；一晚只投一案，重复后端 400），返回整份总览 */
  postDream: (dream: string) =>
    http.postJson<CouplePostVO>('/api/couple/post/dream', { dream }),
  /** F297 解梦官出点评（reading ≤300 字必填；审自己的案/这案已结后端 400），返回整份总览 */
  postDreamRead: (id: string, reading: string) =>
    http.postJson<CouplePostVO>('/api/couple/post/dream/read', { id, reading }),
  /** F298 做梦人盖章：good=true 解得灵 / false 胡说八道（非本人、还没点评后端 400，盖过幂等），返回整份总览 */
  postDreamJudge: (id: string, good: boolean) =>
    http.postJson<CouplePostVO>('/api/couple/post/dream/judge', { id, good }),
  /** F298 立/改某年的周年愿望（year 空串=今年、格式须 yyyy；wish ≤300 字必填；该年已盖过章后端 400），返回整份总览 */
  postWish: (year: string, wish: string) =>
    http.postJson<CouplePostVO>('/api/couple/post/wish', { year, wish }),
  /** F298 给往年愿望盖章：kept=true 圆上了 / false 鸽了（TA 的愿望、今年还没到期后端 400，盖过幂等），返回整份总览 */
  postWishVerdict: (id: string, kept: boolean) =>
    http.postJson<CouplePostVO>('/api/couple/post/wish/verdict', { id, kept }),
  /** F299 立一张未来信用卡的旗（promise ≤80 字必填，dueDay 须是未来日 yyyy-MM-dd 否则后端 400），返回整份总览 */
  postPromise: (promise: string, dueDay: string) =>
    http.postJson<CouplePostVO>('/api/couple/post/promise', { promise, dueDay }),
  /** F299 兑现销旗（只有立旗的本人能销，点 TA 的旗后端 400；逾期会被后端降额），返回整份总览 */
  postPromiseKeep: (id: string) =>
    http.postJson<CouplePostVO>('/api/couple/post/promise/keep', { id }),
}

/**
 * F300-F309 扮演剧场（theaterApi，基址 /api/couple/theater）
 * theaterToday 为唯一读接口；其余 16 个 POST 写接口全部返回整份 TheaterVO，前端整体替换即五卡刷新。
 * 业务规则由后端 400 中文 message 直透 ElMessage（演技分 1-5 且本人只能打一次、互换日记 ≤300 字、
 * 徒弟才能打卡且一周 ≤7 天、评语定级归师父本人且只有出师/留级两个章、侍奉不满 3 次不许出师、
 * 电话只有给一年后和给一年前两种去向且 ≤300 字、词条 ≤40 字同名即已在册、自己收的梗不能考自己、
 * 判卷归收录人且要 TA 先作答、提名证据 ≤140 字一人一天一次、家长题 ≤200 字、剧目名 ≤40 字角色名 ≤20 字
 * 单次角色日记 ≤200 字累计 ≤600 字、工单 ≤80 字、自己的单自己接不了、评分归顾客、只有 1-2 星差评能申诉一次等）。
 */
export const theaterApi = {
  /** F300-F309 今日剧场总览（身份签/日记/师徒/电话亭/黑话/奥斯卡/家长题/追剧/客服/颁奖礼一次拉齐，读时惰性结算到点的跨时空电话；未建空间 404 前端静默降级） */
  theaterToday: () => http.get<CoupleTheaterVO>('/api/couple/theater/today'),
  /** F300 日终给今天扮演的那个 TA 打演技分（score 1-5，越界后端 400；本人一天一次，打过再调幂等返回不覆盖） */
  theaterRate: (score: number) =>
    http.postJson<CoupleTheaterVO>('/api/couple/theater/role/rate', { score }),
  /** F301 以 TA 的身份写今天这一页（text ≤300 字必填，当日日本人可改写且改写不重推 TA） */
  theaterDiary: (text: string) =>
    http.postJson<CoupleTheaterVO>('/api/couple/theater/diary', { text }),
  /** F302 徒弟今日侍奉打卡（师父点了后端 400「这周你是师父」；一天一次，一周 ≤7 天），无请求体 */
  theaterServe: () =>
    http.postJson<CoupleTheaterVO>('/api/couple/theater/master/serve', {}),
  /** F302 师父写评语并定级（review ≤100 字可空，grade 只有 GRADUATED 出师 / REPEAT 留级；侍奉不满 3 次想出师后端 400，定过级不能再改） */
  theaterReview: (review: string, grade: string) =>
    http.postJson<CoupleTheaterVO>('/api/couple/theater/master/review', { review, grade }),
  /** F303 拨一通跨时空电话（kind=FUTURE 封存到一年后 / PAST 当场接通带杂音，其它后端 400；text ≤300 字必填） */
  theaterBooth: (kind: string, text: string) =>
    http.postJson<CoupleTheaterVO>('/api/couple/theater/booth', { kind, text }),
  /** F304 收录一条只有俩人懂的黑话（term ≤40 字、meaning ≤200 字必填，origin ≤200 字可空；同名后端 400「这个梗已经收进大全了」） */
  theaterRefAdd: (term: string, meaning: string, origin: string) =>
    http.postJson<CoupleTheaterVO>('/api/couple/theater/ref', { term, meaning, origin }),
  /** F304 抽查作答（按词条名交卷，answer ≤200 字；自己收录的词条考自己后端 400；重新作答会把已判的结果清空重判） */
  theaterRefQuiz: (term: string, answer: string) =>
    http.postJson<CoupleTheaterVO>('/api/couple/theater/ref/quiz', { term, answer }),
  /** F304 收录人判卷：right=true 记住了 / false 记岔了（不是收录人、或 TA 还没作答，后端 400） */
  theaterRefJudge: (term: string, right: boolean) =>
    http.postJson<CoupleTheaterVO>('/api/couple/theater/ref/judge', { term, right }),
  /** F305 递出今日奥斯卡提名（evidence ≤140 字必填；一人一天一次，重交即改写本人那张） */
  theaterAward: (evidence: string) =>
    http.postJson<CoupleTheaterVO>('/api/couple/theater/award', { evidence }),
  /** F306 作答今日家长题（answer ≤200 字必填，本人当天可改写；两份答卷齐了才互见） */
  theaterFamily: (answer: string) =>
    http.postJson<CoupleTheaterVO>('/api/couple/theater/family', { answer }),
  /** F307 认领角色并追更一段角色日记（work ≤40 字、roleName ≤20 字必填，entry ≤200 字可空；同人同剧即续写，累计 ≤600 字） */
  theaterMovie: (work: string, roleName: string, entry: string) =>
    http.postJson<CoupleTheaterVO>('/api/couple/theater/movie', { work, roleName, entry }),
  /** F307 我这一路剧终（work 必填；没在这部剧里认领过后端 400，双方都剧终才合成双视角剧本。请求体沿用 MovieRequest，另两个字段传空串） */
  theaterMovieFinish: (work: string) =>
    http.postJson<CoupleTheaterVO>('/api/couple/theater/movie/finish', { work, roleName: '', entry: '' }),
  /** F308 下一张服务工单（note ≤80 字必填，30 分钟内等客服响应） */
  theaterOrder: (note: string) =>
    http.postJson<CoupleTheaterVO>('/api/couple/theater/order', { note }),
  /** F308 客服接单响应（只有非下单人能接，自己的单自己接后端 400；已有人接过再点后端 400） */
  theaterOrderAnswer: (id: string) =>
    http.postJson<CoupleTheaterVO>('/api/couple/theater/order/answer', { id }),
  /** F308 顾客评分（score 1-5，越界后端 400；客服不能给自己打分，没人接单也不能评） */
  theaterOrderScore: (id: string, score: number) =>
    http.postJson<CoupleTheaterVO>('/api/couple/theater/order/score', { id, score }),
  /** F308 客服对差评申诉一次（appeal ≤80 字必填；顾客申诉后端 400，没评过或不是 1-2 星都 400） */
  theaterOrderAppeal: (id: string, appeal: string) =>
    http.postJson<CoupleTheaterVO>('/api/couple/theater/order/appeal', { id, appeal }),
}

/**
 * F310-F319 身体通知系统（bodyApi，基址 /api/couple/body）
 * bodyOverview 为唯一读接口；其余 20 个 POST 写接口全部返回整份 BodyVO，前端整体替换即五卡刷新。
 * 产品口径：后端只按「用户自设阈值」判断是否提醒，全链路不做医疗建议，前端同样只陪伴不判断。
 * 业务规则由后端 400 中文 message 直透 ElMessage（体征至少报一项且各项 ≤10 字、状态 ≤80 字、
 * 呼噜档位只有 NONE/TINY/MID/HEAVY、震感点评必填且 ≤60 字、周期阶段只有四种且不适 ≤60 字、
 * 照顾卡必填 ≤100 字且只能给 TA 标的那天递、营期 7-100 天且同名营只能开一个、破戒只有本人记且同日幂等（≤25 条）、
 * 安慰词只有陪绑方能说且 ≤140 字、结营要本人、运动项目五种且计数 0-9999、SOS 症状 ≤80 字且名下在途仅一条、
 * 自己发的 SOS 自己接不住、红线项 ≤30 字同名即在册、谁登记的谁才能划、体检一天一次、报告只有本人才 ≤140 字、
 * 身体账只有 STEADY/HARD/NONE 三档、回话只能给 TA 记过的那周、熄灯线须写成 HH:mm 等）。
 */
export const bodyApi = {
  /** F310-F319 身体总览（近 7 天体征与运动链、近 14 天周期、当周军令状、红线撞当日饭票；未建空间 404 前端静默降级） */
  bodyOverview: () => http.get<CoupleBodyVO>('/api/couple/body/overview'),
  /** F310 报今天的体征（temp/weight/sleepHours 三项至少填一项，全空后端 400；各项 ≤10 字、note ≤80 字；当日本人可改写，首报超自设线才推 TA） */
  bodyMetric: (temp: string, weight: string, sleepHours: string, tempLimit: string, sleepLimit: string, note: string) =>
    http.postJson<CoupleBodyVO>('/api/couple/body/metric', { temp, weight, sleepHours, tempLimit, sleepLimit, note }),
  /** F311 晨起自报呼噜档位（level 只有 NONE/TINY/MID/HEAVY，其它后端 400；当日本人可改） */
  bodySnore: (level: CoupleBodySnoreLevel) =>
    http.postJson<CoupleBodyVO>('/api/couple/body/snore', { level }),
  /** F311 给 TA 补一句震感点评（text 必填且 ≤60 字，空报后端 400「震感报告总得写一句」；写在对方那行上） */
  bodySnoreShake: (text: string) =>
    http.postJson<CoupleBodyVO>('/api/couple/body/snore/shake', { text }),
  /** F312 标记自己当天的周期阶段与不适（phase 四种之一否则 400，discomfort ≤60 字可空，day 空串=今天且格式须 yyyy-MM-dd；同日本人可改） */
  bodyCycle: (day: string, phase: CoupleBodyPhase, discomfort: string) =>
    http.postJson<CoupleBodyVO>('/api/couple/body/cycle', { day, phase, discomfort }),
  /** F312 递照顾卡（card 必填 ≤100 字；TA 那天没标后端 400「卡递过去也没人接」） */
  bodyCycleCare: (day: string, card: string) =>
    http.postJson<CoupleBodyVO>('/api/couple/body/cycle/care', { day, card }),
  /** F313 开一个互助营（name ≤40 字必填，targetDays 营期 7-100 天（缺省 21），startDay 空串=开今天；同名营后端 400） */
  bodyQuitStart: (name: string, targetDays: number, startDay: string) =>
    http.postJson<CoupleBodyVO>('/api/couple/body/quit', { name, targetDays, startDay }),
  /** F313 记一天破戒（只有本人能记，day 空串=今天；同一天重复点后端幂等直接返回；结过营的 400） */
  bodyQuitBroke: (id: string, day: string) =>
    http.postJson<CoupleBodyVO>('/api/couple/body/quit/broke', { id, day }),
  /** F313 陪绑方送安慰词（cheer ≤140 字必填；自己夸自己后端 400「安慰词是陪绑的人说的」） */
  bodyQuitCheer: (id: string, cheer: string) =>
    http.postJson<CoupleBodyVO>('/api/couple/body/quit/cheer', { id, cheer }),
  /** F313 本人宣布结营（满营期=DONE、提前收=GONE，由后端比较；点 TA 的营后端 400） */
  bodyQuitClose: (id: string) =>
    http.postJson<CoupleBodyVO>('/api/couple/body/quit/close', { id }),
  /** F314 报今天某项目的运动计数（kind 五种之一、count 0-9999，越界后端 400；两人 30 分钟内都报才算接上链） */
  bodyFit: (kind: CoupleBodyFitKind, count: number) =>
    http.postJson<CoupleBodyVO>('/api/couple/body/fit', { kind, count }),
  /** F315 一键不舒服（symptom ≤80 字必填，since 自由文本可空；名下在途已有一条后端 400） */
  bodySos: (symptom: string, since: string) =>
    http.postJson<CoupleBodyVO>('/api/couple/body/sos', { symptom, since }),
  /** F315 接住 TA 的不舒服（comfort 从后端下发的 options 里选一句，≤100 字；自己发的自己接、接过的再接后端 400） */
  bodySosHold: (id: string, comfort: string) =>
    http.postJson<CoupleBodyVO>('/api/couple/body/sos/hold', { id, comfort }),
  /** F316 登记忌口红线（item ≤30 字必填且同空间唯一，kind 只有 ALLERGY/AVOID（缺省 AVOID），note ≤60 字可空） */
  bodyRedlineAdd: (item: string, kind: CoupleBodyRedlineKind, note: string) =>
    http.postJson<CoupleBodyVO>('/api/couple/body/redline', { item, kind, note }),
  /** F316 划掉一条红线（谁登记的谁才能划，点 TA 的后端 400；划掉后当日撞饭票的提示行一起消失） */
  bodyRedlineRemove: (id: string) =>
    http.postJson<CoupleBodyVO>('/api/couple/body/redline/remove', { id }),
  /** F317 约一次体检（day 空串=今天且格式须 yyyy-MM-dd，item「查什么」≤60 字可空；本人一天一次，重复约后端 400） */
  bodyCheckup: (day: string, item: string) =>
    http.postJson<CoupleBodyVO>('/api/couple/body/checkup', { day, item }),
  /** F317 TA 虚拟陪同到场打卡（只有对方能到，自己的到场不算陪同；已到场再过一遍后端幂等返回） */
  bodyCheckupCompany: (id: string) =>
    http.postJson<CoupleBodyVO>('/api/couple/body/checkup/company', { id }),
  /** F317 检后一句话报告（report 必填 ≤140 字；只有体检本人能写，写完双方互见，状态转 REPORTED） */
  bodyCheckupReport: (id: string, report: string) =>
    http.postJson<CoupleBodyVO>('/api/couple/body/checkup/report', { id, report }),
  /** F318 记本周身体账（how 只有 STEADY/HARD/NONE 三档，note ≤140 字可空；自愿记、非医嘱；同周本人可改写） */
  bodyMed: (how: CoupleBodyMedHow, note: string) =>
    http.postJson<CoupleBodyVO>('/api/couple/body/med', { how, note }),
  /** F318 回 TA 一句陪伴话术（reply ≤140 字必填，week 空串=本周且须 yyyy-MM-dd；TA 那周没记后端 400） */
  bodyMedReply: (week: string, reply: string) =>
    http.postJson<CoupleBodyVO>('/api/couple/body/med/reply', { week, reply }),
  /** F319 签本周熄灯线（line 须写成 HH:mm 否则 400；本人可改自己那条，双签齐了后端才下发生效文案） */
  bodyOath: (line: string) =>
    http.postJson<CoupleBodyVO>('/api/couple/body/oath', { line }),
}

/**
 * F320-F329 修复车间（repairApi，基址 /api/couple/repair）
 * repairWorkshop 为唯一读接口（读时后端惰性结算：和好倒计时到点自动递台阶卡）；
 * 其余 23 个 POST 写接口全部返回整份 WorkshopVO（后端 RepairVO），前端整体替换即全卡刷新。
 * 业务规则由后端 400 中文 message 直透 ElMessage（冷冻 3-24h 且全局仅一单在冻、未到点签字 400「签了也不算数」、
 * 三问只有挂冷冻的人能答且双签+三问齐才复温、道歉信六要素自评至少三项且只有对方能验货、
 * 打回必填一句差在哪、重来卡每季一张且满意度 1-5 全季只打一次、重建计划档位只有 14/30、
 * 任务卡 ≤10 条各 ≤60 字、signed_days 双签才算一天签满自动 DONE、中止归开计划人、
 * 倒计时 10-60 分钟一天一轮、暂停/继续权只在对方、宣布和好掉修复礼盒、底线每人 3 格 ≤60 字、
 * 踩线记录只能踩线的人补、认错一天一次防刷、最感人只能被认错方标、礼盒任务本人完成才推 both、
 * 纪念碑一天一句本人补注不重推等）。
 */
export const repairApi = {
  /** F320-F329 修复车间总览（十板块一次拉齐，report 字段即 F325 冲突年报；未建空间 404 前端静默降级） */
  repairWorkshop: () => http.get<CoupleRepairVO>('/api/couple/repair/workshop'),
  /** F320 挂冷冻（hours 3-24 越界 400「别一冻一天」，reason ≤140 字可空；在冻再挂 400「还冻着呢」），返回整份总览 */
  repairFreeze: (hours: number, reason: string) =>
    http.postJson<CoupleRepairVO>('/api/couple/repair/freeze', { hours, reason }),
  /** F320 答解冻三问（slot 1-3，answer ≤140 字必填；只有挂冷冻的人能答「TA 在旁边看」，答 TA 的单/已复温 400），返回整份总览 */
  repairFreezeAsk: (id: string, slot: number, answer: string) =>
    http.postJson<CoupleRepairVO>('/api/couple/repair/freeze/ask', { id, slot, answer }),
  /** F320 签解冻（未到点 400 带剩余分钟文案；双签+三问齐才 THAWED，两人各掉一只修复礼盒并给提出人记 EARN「复温成功」8 分），返回整份总览 */
  repairFreezeSign: (id: string) =>
    http.postJson<CoupleRepairVO>('/api/couple/repair/freeze/sign', { id }),
  /** F321 交道歉信（letter ≤300 字必填，points=六要素码 CSV 逗号分隔，自评 <3 项 400「空口我错了不算道歉」），返回整份总览 */
  repairSorry: (letter: string, points: string) =>
    http.postJson<CoupleRepairVO>('/api/couple/repair/sorry', { letter, points }),
  /** F321 打回后重写（仅信主本人且仅 BACK 状态；重写回 VERIFY 清空旧批注等再验），返回整份总览 */
  repairSorryRewrite: (id: string, letter: string, points: string) =>
    http.postJson<CoupleRepairVO>('/api/couple/repair/sorry/rewrite', { id, letter, points }),
  /** F321 对方验货（pass=true 进陈列室推 both / false 打回且 verdict 必填「打回要写一句差在哪」；自己验自己 400），返回整份总览 */
  repairSorryVerify: (id: string, pass: boolean, verdict: string) =>
    http.postJson<CoupleRepairVO>('/api/couple/repair/sorry/verify', { id, pass, verdict }),
  /** F322 领这季重来卡（scene ≤140 字必填；每季一张，已用 400「下季再来」；未用同季可改写场景），返回整份总览 */
  repairRedo: (scene: string) =>
    http.postJson<CoupleRepairVO>('/api/couple/repair/redo', { scene }),
  /** F322 重放完成（replayNote ≤200 字必填「这次改说了什么」；没用过才能记，用过 400），返回整份总览 */
  repairRedoPlay: (replayNote: string) =>
    http.postJson<CoupleRepairVO>('/api/couple/repair/redo/play', { replayNote }),
  /** F322 打重放满意度（1-5 越界 400；还没重放/全季已有人打过 400），返回整份总览 */
  repairRedoRate: (satisfaction: number) =>
    http.postJson<CoupleRepairVO>('/api/couple/repair/redo/rate', { satisfaction }),
  /** F323 开重建计划（name ≤40 字同空间唯一、cause ≤140 字可空、targetDays 只有 14/30 两档、
   *  tasks 逗号/顿号/换行分隔 ≤10 条各 ≤60 字，空单 400「光立计划不干活没用」），返回整份总览 */
  repairRebuild: (name: string, cause: string, targetDays: number, tasks: string) =>
    http.postJson<CoupleRepairVO>('/api/couple/repair/rebuild', { name, cause, targetDays, tasks }),
  /** F323 每日双签（day 空串=今天且须 yyyy-MM-dd；记号成对才算一天，签满 targetDays 自动 DONE 推 both），返回整份总览 */
  repairRebuildSign: (id: string, day: string) =>
    http.postJson<CoupleRepairVO>('/api/couple/repair/rebuild/sign', { id, day }),
  /** F323 写周复盘（review ≤200 字必填；任一人可写可改），返回整份总览 */
  repairRebuildReview: (id: string, review: string) =>
    http.postJson<CoupleRepairVO>('/api/couple/repair/rebuild/review', { id, review }),
  /** F323 中止计划（谁开的计划谁才有资格中止，别人点 400；已签天数不清零留档），返回整份总览 */
  repairRebuildGiveup: (id: string) =>
    http.postJson<CoupleRepairVO>('/api/couple/repair/rebuild/giveup', { id }),
  /** F324 开冷战倒计时（minutes 10-60 越界 400「别把冷战排班」；一天一轮，重复 400「今天已经开过」），返回整份总览 */
  repairMakeup: (minutes: number) =>
    http.postJson<CoupleRepairVO>('/api/couple/repair/makeup', { minutes }),
  /** F324 对方按暂停/继续（pause=true 暂停 / false 继续；自己开的自己不能按、台阶已递 400「暂停没用了」），返回整份总览 */
  repairMakeupPause: (id: string, pause: boolean) =>
    http.postJson<CoupleRepairVO>('/api/couple/repair/makeup/pause', { id, pause }),
  /** F324 提前递台阶（RUNNING 中谁都能递；已递过 400「这轮台阶已经递过了」），返回整份总览 */
  repairMakeupOffer: (id: string) =>
    http.postJson<CoupleRepairVO>('/api/couple/repair/makeup/offer', { id }),
  /** F324 宣布和好（任一方可点；计时中先递台阶再 ENDED，给开倒计时的人掉一只修复礼盒），返回整份总览 */
  repairMakeupEnd: (id: string) =>
    http.postJson<CoupleRepairVO>('/api/couple/repair/makeup/end', { id }),
  /** F326 声明/改写底线（slot 1-3，text ≤60 字必填，sinceDay 空串=今天且须 yyyy-MM-dd；首立推 TA、改写不重推），返回整份总览 */
  repairBottom: (slot: number, text: string, sinceDay: string) =>
    http.postJson<CoupleRepairVO>('/api/couple/repair/bottom', { slot, text, sinceDay }),
  /** F326 踩线补红线记录（note ≤80 字必填「为什么没刹住」；只能踩线的人补，线主人自己点 400），返回整份总览 */
  repairBottomBreach: (id: string, note: string) =>
    http.postJson<CoupleRepairVO>('/api/couple/repair/bottom/breach', { id, note }),
  /** F327 认错（detail ≤140 字必填；一天一次防刷「别把认错刷成打卡」），返回整份总览 */
  repairAdmit: (detail: string) =>
    http.postJson<CoupleRepairVO>('/api/couple/repair/admit', { detail }),
  /** F327 标「最感人的一次认错」（只有被认错的那位能标，自己给自己发奖 400；已标幂等），返回整份总览 */
  repairAdmitTouch: (id: string) =>
    http.postJson<CoupleRepairVO>('/api/couple/repair/admit/touch', { id }),
  /** F328 完成礼盒补偿任务（只有盒主本人能点，TA 的任务 400「你只能等 TA 做完」；完成推 both），返回整份总览 */
  repairBoxDone: (id: string) =>
    http.postJson<CoupleRepairVO>('/api/couple/repair/box/done', { id }),
  /** F329 立纪念碑（line ≤140 字必填，一天一人一句；note「现在回看」≤80 字可空，本人补注只改 note 不重推），返回整份总览 */
  repairPeace: (line: string, note: string) =>
    http.postJson<CoupleRepairVO>('/api/couple/repair/peace', { line, note }),
}

/**
 * F330-F339 两家与朋友（worldApi，基址 /api/couple/world）
 * world 为唯一读接口（读时后端惰性结算：已见证的保证到期自动解除并给本人记一笔心动）；
 * 其余 21 个 POST 写接口全部返回整份 WorldVO（后端 WorldVO），前端整体替换即十卡刷新。
 * 业务规则由后端 400 中文 message 直透 ElMessage（攻略一天一人一次且前置任务 ≤8 条各 ≤60 字、
 * 自己写的攻略自己确认不算双确认、战报由写攻略的人交且 ≤200 字、送礼灵感「送谁」必填 ≤30 字且灵感 ≤80 字同名即已在册、
 * 自己登的灵感不能自己接单、只有接单的人能宣布买好、他观问卷只有 1-3 题且原话 ≤200 字、官宣一个月一张 ≤200 字、
 * 候选文案一天最多三条 ≤140 字且自己写的稿自己定不算选稿、城市名 ≤30 字行程 ≤8 条小包 ≤12 项、
 * 称谓同名即已在册 ≤20 字题面 ≤140 字、自己出的题考不了自己、保证 ≤140 字且到期日必须在以后、
 * 见证人与塌房举报人都必须是对方、塌房记录 ≤80 字必填、群聊素材 ≤200 字当日本人可改写、
 * 赔礼信正文 ≤300 字、自己审自己的信不算送达、打回必填一句改哪儿、只有被打回的信能重写等）。
 */
export const worldApi = {
  /** F330-F339 两家与朋友总览（十板块一次拉齐；未建空间 404 前端静默降级） */
  world: () => http.get<CoupleWorldVO>('/api/couple/world/world'),
  /** F330 写拜访攻略（day 空串=今天且须 yyyy-MM-dd，hostSide 只有 MINE/YOURS（其它 400「攻略只分「我家」和「你家」」），
   *  preps=前置任务卡逗号/顿号/换行分隔 ≤8 条各 ≤60 字，全空 400「至少写一条」；这天的攻略一人一天一份，写过 400），返回整份总览 */
  worldVisit: (day: string, hostSide: CoupleWorldVisitSide, preps: string) =>
    http.postJson<CoupleWorldVO>('/api/couple/world/visit', { day, hostSide, preps }),
  /** F330 确认攻略（⚠️ 只能对方确认，自己写的自己确认 400「自己写的攻略自己确认不算双确认」；已确认再点幂等返回），返回整份总览 */
  worldVisitConfirm: (id: string) =>
    http.postJson<CoupleWorldVO>('/api/couple/world/visit/confirm', { id }),
  /** F330 回访后交战报（report ≤200 字必填；⚠️ 由写攻略的人交，别人点 400「战报由写攻略的人交」；交完状态转 DONE），返回整份总览 */
  worldVisitReport: (id: string, report: string) =>
    http.postJson<CoupleWorldVO>('/api/couple/world/visit/report', { id, report }),
  /** F331 收一条送礼灵感（person「送谁」≤30 字必填、idea 灵感 ≤80 字必填且同空间唯一、budget/avoid ≤60 字可空），返回整份总览 */
  worldGift: (person: string, idea: string, budget: string, avoid: string) =>
    http.postJson<CoupleWorldVO>('/api/couple/world/gift', { person, idea, budget, avoid }),
  /** F331 接单代买（⚠️ 只能接对方的单，自己登的 400「不用自己接单，等 TA 帮你买」；已被接过再点 400「这单已经有人接了」），返回整份总览 */
  worldGiftTake: (id: string) =>
    http.postJson<CoupleWorldVO>('/api/couple/world/gift/take', { id }),
  /** F331 买回登记（⚠️ 只有接单的人能点，没接单/TA 接的 400「只有接单的人能宣布买好了」；已买过再点幂等返回），返回整份总览 */
  worldGiftBought: (id: string) =>
    http.postJson<CoupleWorldVO>('/api/couple/world/gift/bought', { id }),
  /** F332 线下问过朋友后回填一题（slot 1-3，越界 400「他观问卷只有 1-3 题」；answer 原话 ≤200 字必填，askedTo「问了谁」≤30 字可空；
   *  三题答齐后端才下发「他观」卡话术），返回整份总览 */
  worldFriendView: (slot: number, askedTo: string, answer: string) =>
    http.postJson<CoupleWorldVO>('/api/couple/world/friendView', { slot, askedTo, answer }),
  /** F333 发本月官宣卡（text ≤200 字必填；每月一张，本月已发 400「一个月一张」；成「官宣编年」倒序下发），返回整份总览 */
  worldDeclare: (text: string) =>
    http.postJson<CoupleWorldVO>('/api/couple/world/declare', { text }),
  /** F334 交一条候选文案（slot 1-3，越界 400「一天最多交三条候选」，text ≤140 字必填；同日同槽本人可改写，改写不重推），返回整份总览 */
  worldCaption: (slot: number, text: string) =>
    http.postJson<CoupleWorldVO>('/api/couple/world/caption', { slot, text }),
  /** F334 互评选稿（⚠️ 只有求稿的对方能定稿，自己选自己的 400「自己写的稿自己定不算互评选稿」；定稿写进百科词条），返回整份总览 */
  worldCaptionPick: (id: string) =>
    http.postJson<CoupleWorldVO>('/api/couple/world/caption/pick', { id }),
  /** F335 存/改一座城市的接待手册（city ≤30 字必填、arriveDay 空串=没定日且须 yyyy-MM-dd、itinerary 行程 ≤8 条各 ≤60 字、
   *  transport 交通 ≤140 字可空、packList 陪同小包 ≤12 项各 ≤60 字整单 ≤296 字可空；同城名即改写），返回整份总览 */
  worldCity: (city: string, arriveDay: string, itinerary: string, transport: string, packList: string) =>
    http.postJson<CoupleWorldVO>('/api/couple/world/city', { city, arriveDay, itinerary, transport, packList }),
  /** F336 出一条称谓考题（term 称谓 ≤20 字必填且同名即已在册、question 题面 ≤140 字必填、answer 标准答案 ≤80 字必填），返回整份总览 */
  worldRelative: (term: string, question: string, answer: string) =>
    http.postJson<CoupleWorldVO>('/api/couple/world/relative', { term, question, answer }),
  /** F336 作答称谓题（⚠️ 只有被考的人能答，自己出的题考不了自己 400；答错 wrongCount+1 并进「考前强化」，答对后端只回执不改动），返回整份总览 */
  worldRelativeTry: (id: string, answer: string) =>
    http.postJson<CoupleWorldVO>('/api/couple/world/relative/try', { id, answer }),
  /** F337 公开立一条保证（content「我保证不做…」≤140 字必填、dueDay 空串=30 天后且须 yyyy-MM-dd；
   *  到期日必须在以后否则 400「当天保证等于没保证」；同一句话自己立过 400），返回整份总览 */
  worldVow: (content: string, dueDay: string) =>
    http.postJson<CoupleWorldVO>('/api/couple/world/vow', { content, dueDay }),
  /** F337 TA 见证（⚠️ 见证人得是对方，自己见证 400；已见证再点幂等返回。到期时后端惰性结算：已见证才自动解除并记心动），返回整份总览 */
  worldVowWitness: (id: string) =>
    http.postJson<CoupleWorldVO>('/api/couple/world/vow/witness', { id }),
  /** F337 塌房记录（note 一句事实 ≤80 字必填；⚠️ 只能由对方举报，自己给自己记 400；已收尾的保证再记 400「这条保证已经收尾了」），返回整份总览 */
  worldVowBreak: (id: string, note: string) =>
    http.postJson<CoupleWorldVO>('/api/couple/world/vow/break', { id, note }),
  /** F338 交今天的一条群聊素材（line ≤200 字必填；本人当天可改写，改写不重推），返回整份总览 */
  worldGroup: (line: string) =>
    http.postJson<CoupleWorldVO>('/api/couple/world/group', { line }),
  /** F338 笑了对方那条（无请求体；两人都笑=今日素材双双通过，后端下发双人回执话术），返回整份总览 */
  worldGroupLaugh: () =>
    http.postJson<CoupleWorldVO>('/api/couple/world/group/laugh', {}),
  /** F339 写一封代 TA 送的赔礼信（toPerson 称谓 ≤30 字必填、reason 来龙去脉 ≤200 字可空、draft 正文 ≤300 字必填
   *  「长了没人听得进去」；写完就进 OPEN 等 TA 审阅），返回整份总览 */
  worldApology: (toPerson: string, reason: string, draft: string) =>
    http.postJson<CoupleWorldVO>('/api/couple/world/apology', { toPerson, reason, draft }),
  /** F339 TA 审阅（pass=true 通过即送达 / false 打回且 note 必填「打回要写一句改哪儿」；⚠️ 自己审自己的信 400「不算送达」；
   *  已审过再点 400「这封已经审过了」；note ≤140 字），返回整份总览 */
  worldApologyReview: (id: string, pass: boolean, note: string) =>
    http.postJson<CoupleWorldVO>('/api/couple/world/apology/review', { id, pass, note }),
  /** F339 被打回后重写（⚠️ 只有信主本人且只有 BACK 状态能改，别人点 400「信主本人才能改」、没打回点 400「只有被打回的信能重写」；
   *  draft ≤300 字必填，重写后回到 OPEN 等再审），返回整份总览 */
  worldApologyRewrite: (id: string, draft: string) =>
    http.postJson<CoupleWorldVO>('/api/couple/world/apology/rewrite', { id, draft }),
}

/**
 * F340-F349 传世系统（legacyApi，基址 /api/couple/legacy）
 * legacyVault 为唯一读接口（GET /vault?goal=：goal 只在这一个接口认，读时后端顺带惰性结算周年抽奖提醒——
 * 周年已过且本年没标记过就推双方 legacy-draw-remind，不建定时任务）；
 * 其余 12 个 POST 写接口（/ten /audit /speech /speech/rate /fx /fx/settle /brand /brand/confirm /review
 * /item /item/seal /draw）全部返回整份 LegacyVO（后端 CoupleLegacyService.LegacyVO），前端整体替换即十卡刷新。
 * 业务规则由后端 400 中文 message 直透 ElMessage（十问只有 1-10 题且每题 ≤140 字、年份须写成 yyyy、
 * 年审最想留/最想删各 ≤3 条各 ≤60 字且至少写一条、一句话 ≤140 字、发言稿 ≤600 字且重发即作废对方已打的分、
 * 评分卡只有 1-5 档且只能由对方打一年一次、汇率两档各 1-20、两人都报过汇率才结得了账且同年只结一次、
 * 品牌名 ≤30/slogan ≤60/简介 ≤300 且拟品牌的人自己确认不作数、传世条目名 ≤60 同名即已在册、
 * 类型只有 PLACE/PASSWORD/THING/WORD、说明 ≤200 字、封存要对方签字、抽奖每人一年一次等）；
 * 未建空间一律 404「还没有建立情侣空间，先邀请一位好友吧」，组件侧静默降级。
 */
export const legacyApi = {
  /** F340-F349 传世系统总览（十板块一次拉齐：tens 恒「今年+去年」两期、brand/draw/milestone/level 恒有值对象、
   *  auditCandidates 是 F341 年审候选（回忆资产系现有条目 ≤12 项）；goal 只影响 F343 倒推目标，
   *  越界后端静默回落 300（前端自己先挡）；未建空间 404 前端静默降级） */
  legacyVault: (goal?: number) =>
    http.get<CoupleLegacyVO>(goal ? `/api/couple/legacy/vault?goal=${goal}` : '/api/couple/legacy/vault'),
  /** F340 答年度十问的一格（year 空串=今年且须 yyyy，slot 1-10 越界 400「十问只有 1-10 题」，answer ≤140 字必填、
   *  换行被后端压成空格；本人可改写当格，答满 10 格才推 TA legacy-ten-done），返回整份总览 */
  legacyTen: (year: string, slot: number, answer: string) =>
    http.postJson<CoupleLegacyVO>('/api/couple/legacy/ten', { year, slot, answer }),
  /** F341 交记忆库年审（year 空串=今年且须 yyyy，keepThree/deleteThree 是逗号分隔 CSV——各 ≤3 条各 ≤60 字，
   *  超 3 条 400「最多 3 条」、两边全空 400「至少留一条」；note 一句话 ≤140 字；同年本人改卷不增行），返回整份总览 */
  legacyAudit: (year: string, keepThree: string, deleteThree: string, note: string) =>
    http.postJson<CoupleLegacyVO>('/api/couple/legacy/audit', { year, keepThree, deleteThree, note }),
  /** F342 发这年的发言稿（year 空串=今年且须 yyyy，text ≤600 字必填；本人可改写，⚠️ 重发会把对方已打的分作废
   *  并清批注），返回整份总览 */
  legacySpeech: (year: string, text: string) =>
    http.postJson<CoupleLegacyVO>('/api/couple/legacy/speech', { year, text }),
  /** F342 给对方这年的发言按评分卡打分（year 空串=今年，score 1-5 越界 400「评分卡只有 1-5 档」，note 评语 ≤140 字可空；
   *  ⚠️ 只有对方发的那篇能评：评自己这篇/TA 还没发 400「TA 还没发这年的言」、打过再点 400「这年的分已经打过了」），返回整份总览 */
  legacySpeechRate: (year: string, score: number, note: string) =>
    http.postJson<CoupleLegacyVO>('/api/couple/legacy/speech/rate', { year, score, note }),
  /** F344 报自己的恋爱汇率（kissToHug=1 亲亲换几个抱抱、hugToWord=1 抱抱换几句夸夸，两档各 1-20，
   *  越界 400「只能填 1-20」；uk(space,user) 本人可改写，两人都报过才结得了年末的账），返回整份总览 */
  legacyFx: (kissToHug: number, hugToWord: number) =>
    http.postJson<CoupleLegacyVO>('/api/couple/legacy/fx', { kissToHug, hugToWord }),
  /** F344 年末趣味结算（year 空串=今年；⚠️ 两人都没报过汇率 400「两人都报过汇率才结得了账」、
   *  同年结过再点 400「已经结算过了，明年重新开盘」；结算文案按操作人自己那份汇率生成），返回整份总览 */
  legacyFxSettle: (year: string) =>
    http.postJson<CoupleLegacyVO>('/api/couple/legacy/fx/settle', { year }),
  /** F345 建/改情侣品牌（name ≤30 字必填「关系叫什么名」，slogan ≤60 字、intro 产品简介 ≤300 字均可空；
   *  ⚠️ 任何改动都把 published 清零重走确认，且改完的人变成拟定人——确认权又回到对方手里），返回整份总览 */
  legacyBrand: (name: string, slogan: string, intro: string) =>
    http.postJson<CoupleLegacyVO>('/api/couple/legacy/brand', { name, slogan, intro }),
  /** F345 对方确认发布（无请求体；⚠️ 拟品牌的人自己确认 400「自己确认不作数」、还没品牌 400「还没有品牌可发布」；
   *  发布后 line 字段给 Bank 话术，重复确认幂等不重推），返回整份总览 */
  legacyBrandConfirm: () => http.postJson<CoupleLegacyVO>('/api/couple/legacy/brand/confirm', {}),
  /** F346 一键生成本年/某年的年度盘点（year 空串=去年且须 yyyy，越界 400「年份写成 yyyy」；
   *  正文数字全部来自真实表（台账/十问/年审/发言/清单），同年本人可重生覆盖），返回整份总览 */
  legacyReview: (year: string) => http.postJson<CoupleLegacyVO>('/api/couple/legacy/review', { year }),
  /** F347 登记一条传世条目（item 条目名 ≤60 字必填且同空间唯一「已经在清单上了」，kind 只有 PLACE/PASSWORD/THING/WORD
   *  四键（空串=THING）否则 400，detail 说明 ≤200 字可空；登记完就等对方加签），返回整份总览 */
  legacyItem: (item: string, kind: CoupleLegacyItemKind, detail: string) =>
    http.postJson<CoupleLegacyVO>('/api/couple/legacy/item', { item, kind, detail }),
  /** F347 对方加签封存（⚠️ 只有对方登记的未封存条目能签，自己签 400「封存要对方签字，自己签不封」、
   *  id 不在清单 400「这条不在清单上」；已封存再点幂等返回，封好的条目留在清单上不离开总览），返回整份总览 */
  legacyItemSeal: (id: string) => http.postJson<CoupleLegacyVO>('/api/couple/legacy/item/seal', { id }),
  /** F348 抽今年的奖（无请求体；每人一年一次，抽过再点 400「今年你已经抽过了，剩下的那次是 TA 的」；
   *  奖品从「你们本年家务积分台账里攒下的愿望条目」中按空间稳定取，今年一条都没攒过才回落后端 Bank 的 8 个固定迷你愿望位），返回整份总览 */
  legacyDraw: () => http.postJson<CoupleLegacyVO>('/api/couple/legacy/draw', {}),
}

/**
 * F350-F359 回音壁（echoApi，基址 /api/couple/echo）
 * echoVault 为读接口（GET /vault：读时后端惰性结算感谢慢递——open_day 到期即置已送达并推双方
 * echo-thanks-arrived，不建定时任务）；echoCalendar / echoYear 是 F353/F359 的按年懒读接口（不在这份聚合里）。
 * 其余 12 个 POST 写接口（/deed /deed/star /juice /juice/remove /refill /slow /highlight
 * /highlight/remove /receipt /battery /self /self/read）全部返回整份 EchoVO（后端 CoupleEchoService.EchoVO），
 * 前端整体替换即十卡刷新。
 * 业务规则由后端 400 中文 message 直透 ElMessage（好事 ≤80 字、日期须 yyyy-MM-dd、同日同内容不能重复记、
 * 「这条救过我」只有记录人本人能加星；鼓励语 ≤60 字且每人 ≤5 条、只能清自己罐子的纸条；
 * 补给每人每天一次；慢递 ≤100 字且在途每人 ≤3 封、寄出 7 天后送达；三行高光 40/80/80 字各自必填、每人 ≤12 条、
 * 只能整理自己的精选夹；回执那句须在你们自己的夸夸墙上（uk 幂等）；电量 want ≤40 字（level 后端钳 1-5、null 按 3 格）；
 * 给自己的信 ≤300 字且一人同时只封一封、没在途信时开读 400）；
 * 未建空间一律 404「还没有建立情侣空间，先邀请一位好友吧」，组件侧 safeLoad 静默降级。
 */
export const echoApi = {
  /** F350-F359 回音壁总览（十板块一次拉齐：deeds/partnerDeeds 各限最近 30 条、juices/highlights 两人合计、
   *  slowInFlight 按寄出日正序、slowArrived 只给最近 10 封、refill 未领取时是空包的今日态、
   *  selfLetter 没在途信时为 null；未建空间 404 前端静默降级） */
  echoVault: () => http.get<CoupleEchoVO>('/api/couple/echo/vault'),
  /** F350 记一件「TA 为我做的事」（content ≤80 字必填「好事总得写一句」，超 80 字 400；day 空串=今天且须
   *  yyyy-MM-dd 否则 400「日期写成 yyyy-MM-dd」；同日同人同内容重复 400「这条已经记过了」；新增推双方），返回整份总览 */
  echoDeed: (content: string, day: string) =>
    http.postJson<CoupleEchoVO>('/api/couple/echo/deed', { content, day }),
  /** F350 给证据点「这条救过我」（⚠️ 只有记录人本人能点：id 不在本空间 400「这条不在好事簿里」、
   *  点 TA 记的那条 400「只有记下这条的人能加星」；已加星再点幂等返回不重推），返回整份总览 */
  echoDeedStar: (id: string) => http.postJson<CoupleEchoVO>('/api/couple/echo/deed/star', { id }),
  /** F352 往自己罐里塞一张打气话（content ≤60 字必填「鼓励语总得写一句」，超 60 字 400；
   *  每人 ≤5 条，第 6 条 400「罐子装不下了」；槽位 idx 复用删掉的空格），返回整份总览 */
  echoJuice: (content: string) => http.postJson<CoupleEchoVO>('/api/couple/echo/juice', { content }),
  /** F352 清掉自己罐里的一张（⚠️ 只能删本人的：id 不在罐里 400「这张纸条不在罐子里」、
   *  删 TA 的 400「只能清自己罐子里的纸条」），返回整份总览 */
  echoJuiceRemove: (id: string) => http.postJson<CoupleEchoVO>('/api/couple/echo/juice/remove', { id }),
  /** F351 领今天的能量补给（无请求体；⚠️ 每人每天一次，领过再点 400「今天已经充过电了」；
   *  返回的 refill 才是拆开的补给包：我的证据随机 ≤3 条 + 双方鼓励语/高光各 1 条 + 顺带开读自己在途的信；
   *  领取推双方 echo-refilled——这就是「一键喊 TA」，后端没有单独的喊人接口），返回整份总览 */
  echoRefill: () => http.postJson<CoupleEchoVO>('/api/couple/echo/refill', {}),
  /** F354 寄一封感谢慢递（content ≤100 字必填「想谢的话总要写一句」，超 100 字 400；
   *  在途每人 ≤3 封，满了 400「路上还有 3 封」；送达日固定=寄出日+7 天，到日由任一读接口惰性结算），返回整份总览 */
  echoSlow: (content: string) => http.postJson<CoupleEchoVO>('/api/couple/echo/slow', { content }),
  /** F355 收藏一条三行高光（moment ≤40「高光发生在什么时候」/ did ≤80「TA 做了什么」/ feel ≤80「当时什么感觉」，
   *  三段各自必填各有各的 400 文案、超长各自 400；每人 ≤12 条，满了 400「精选夹满了」），返回整份总览 */
  echoHighlight: (moment: string, did: string, feel: string) =>
    http.postJson<CoupleEchoVO>('/api/couple/echo/highlight', { moment, did, feel }),
  /** F355 删掉自己精选夹里的一条（⚠️ 只能整理自己的：id 不在夹里 400「这条不在精选夹里」、
   *  删 TA 的 400「只能整理自己的精选夹」），返回整份总览 */
  echoHighlightRemove: (id: string) => http.postJson<CoupleEchoVO>('/api/couple/echo/highlight/remove', { id }),
  /** F356 给夸夸墙里夸我的某句点「收到」（quoteId 是 couple_praise 的 id：空或不在你们空间 400
   *  「这句话不在你们的夸夸墙上」；uk(space,quote_id,from_user) 幂等，重复点不重复记；
   *  回执只推给夸的人 echo-receipt-given，回执句从此进 F351 能量库），返回整份总览 */
  echoReceipt: (quoteId: string) => http.postJson<CoupleEchoVO>('/api/couple/echo/receipt', { quoteId }),
  /** F357 报今天的社交电量（level 1-5：后端把 null 当 3 格、越界静默钳到 1-5 不报错，故前端必须先要一次点选；
   *  want「今天想被怎样对待」≤40 字可空，超 40 字 400；本人当天可改写（upsert）；
   *  对方 ≤2 格时后端把 Bank 的「今晚轻轻的」提示挂在对方那格的 hint 上），返回整份总览 */
  echoBattery: (level: number, want: string) =>
    http.postJson<CoupleEchoVO>('/api/couple/echo/battery', { level, want }),
  /** F358 写一封给下次低落的自己（content ≤300 字必填「哪怕一句也行，写给低落的自己」，超 300 字 400；
   *  ⚠️ 一人同时只封一封，有在途信时 400「还有一封在等你」；写完不推对方——这封只归本人），返回整份总览 */
  echoSelf: (content: string) => http.postJson<CoupleEchoVO>('/api/couple/echo/self', { content }),
  /** F358 本人现在开读在途信（无请求体；⚠️ 没有在途信时 400「现在没有在途的信」；置 READ 后返回的 selfLetter
   *  才是刚拆开的那封，不推送给对方；读完就能再写一封），返回整份总览 */
  echoSelfRead: () => http.postJson<CoupleEchoVO>('/api/couple/echo/self/read', {}),
  /** F353 被爱日历（GET：year 空串=当年且须 yyyy 否则 400「年份写成 yyyy」；只返回有动静的日子——
   *  有新证据/被加星/有人领过补给，按天正序；读时同样惰性结算慢递） */
  echoCalendar: (year?: string) =>
    http.get<CoupleEchoCalendarDayVO[]>(year ? `/api/couple/echo/calendar?year=${year}` : '/api/couple/echo/calendar'),
  /** F359 回音壁年报（GET：year 同上；五项真实计数 deeds/starred/refills/slowArrived/receipts +
   *  后端 Bank 组好的 summary。⚠️ 这份是「另拉一个年份」用的懒读接口，当年的年报恒随总览 yearly 下发） */
  echoYear: (year?: string) =>
    http.get<CoupleEchoYearlyVO>(year ? `/api/couple/echo/year?year=${year}` : '/api/couple/echo/year'),
}

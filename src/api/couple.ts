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
  CoupleLsTodayVO,
  CoupleLsToneKey,
  CoupleFyBoardVO,
  CoupleCxOverviewVO,
  CoupleLegacyVO,
  CoupleLegacyItemKind,
  CoupleEchoVO,
  CoupleEchoCalendarDayVO,
  CoupleEchoYearlyVO,
  CoupleFocusTodayVO,
  CoupleFocusWeeklyVO,
  CoupleFocusYearlyVO,
  CoupleFocusDetoxKind,
  CoupleQuestVO,
  CoupleQuestWallVO,
  CoupleQuestBattleKind,
  CoupleQuestResult,
  CoupleQuestCareKind,
  CoupleCatchVO,
  CoupleCatchYearVO,
  CoupleCatchSensitiveKind,
  CoupleCatchProtocolMode,
  CoupleLaughVO,
  CoupleLaughWeekVO,
  CoupleLaughYearVO,
  CoupleLaughVerdict,
  CoupleLaughAttackKind,
  CoupleLaughTargetKind,
  CoupleLaughStyleCode,
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

/**
 * F360-F369 注意力保护区（focusApi，基址 /api/couple/focus）
 * 13 个映射 = 3 个 GET（/today /weekly /year）+ 10 个 POST（/night /slot/propose /slot/confirm
 * /queue /queue/read /meal /gaze /unplug /nudge /detox）。
 * GET /today 返回聚合 TodayVO，10 个 POST 写接口全部原样返回整份 TodayVO（后端 CoupleFocusService.TodayVO），
 * 前端整体替换即十卡刷新；/weekly（F367）与 /year（F369）是两个「点了按钮才懒读」的独立接口，不在这份聚合里。
 * 限流与错误码全部抄自后端 Service/实体常量（业务规则归后端，400 中文 message 直透 ElMessage）：
 * · F360 /night：minutes 后端 0-180 静默钳制（CoupleFocusNight.MINUTES_MIN/MAX，null 按 0），
 *   note ≤40 字（NOTE_MAX），超 40 字 400「一句话最多 40 字」；自己那列可改写（upsert），
 *   两列都非空才算点亮（bothLit 读时算）；只有一方报时后端把 Bank「还有一个人没报」挂在 night.hint 上。
 * · F361 /slot/propose：title 必填否则 400「总得写点什么，这段时间做什么」、≤60 字（TITLE_MAX）超了 400
 *   「「做什么」最多 60 字」；day 须 yyyy-MM-dd 否则 400「哪天写成 yyyy-MM-dd」，且必须落在本周
 *   （周一~周日，后端按服务端今天算）否则 400「时段要落在本周（… ~ …）」；hours 后端 1-6 静默钳制
 *   （HOURS_MIN/MAX，null 按 HOURS_DEFAULT=2）；一周只有一段，重新提议即改写并把确认清空。
 *   /slot/confirm：没人预约 400「这周还没有人预约专属时段」、提议人自己确认 400「自己写的时段不能自己确认，
 *   等 TA 点头」、已生效再点是幂等（直接返回整份 VO 不报错）。
 * · F362 /queue：content 必填否则 400「想说的那句话说一句」、≤80 字（CONTENT_MAX）超了 400「一句话最多 80 字」、
 *   我在途 ≥5 句（IN_FLIGHT_MAX）400「攒了 5 句了，等 TA 收一下吧」。
 *   ⚠️ GET /today 自己就会把 to_user=我 的留言批量置已读（Service.settleRead），所以 /queue/read 常常签收 0 条、
 *   不推 focus-queue-read；下发口径只有「TA 攒给我的」那一份队列。
 * · F363 /meal、F364 /gaze、F365 /unplug：无请求体、无业务错误——点自己那一格，后端只在 0→1 真的翻转时更新并
 *   在双点凑齐那一次推 focus-meal-both / focus-gaze-both / focus-unplug-both；重复点幂等（不 update 不推送）。
 * · F366 /nudge：note ≤40 字（NOTE_MAX）可空，超了 400「哨子上的话最多 40 字」；每人每天 2 张
 *   （DAILY_MAX），用完 400「今天的 2 张哨卡都用完了，再吹就唠叨了」；只推收卡人。
 * · F368 /detox：kind 只能是 AM 或 PM（KIND_AM/KIND_PM），否则 400「只能选 AM 或 PM」；一天一格，
 *   半天代号由先挂的人定，后应战的人传什么都不改写它；双报才推 focus-detox-done（否则首个应战推 started）。
 * · F369 /year：year 空串=当年且须 yyyy，否则 400「年份写成 yyyy」。
 * 未建空间一律 404「还没有建立情侣空间，先邀请一位好友吧」，组件侧 safeLoad 静默降级。
 */
export const focusApi = {
  /** F360-F369 今日注意力总览（GET /today：night 恒有值对象、slot/detoxKind 可 null、queue 只给 TA 攒给我的那些；
   *  ⚠️ 读时顺带把 to_user=我 的留言批量置已读（不推事件），所以 queueUnread 基本恒为 0；未建空间 404 前端静默降级） */
  focusToday: () => http.get<CoupleFocusTodayVO>('/api/couple/focus/today'),
  /** F360 报今晚放下手机陪 TA 的分钟数（minutes 后端 0-180 钳制、null 按 0；note ≤40 字超了 400；
   *  本人那列可反复改写，两人都报过当夜才点亮），返回整份总览 */
  focusNight: (minutes: number | null, note: string) =>
    http.postJson<CoupleFocusTodayVO>('/api/couple/focus/night', { minutes, note }),
  /** F361 预约本周的专属时段（title ≤60 字且必填、hours 后端 1-6 钳制缺省 2、day 须落在本周内否则 400；
   *  一周只有一段——已有行会被改写并把对方的确认清空），返回整份总览 */
  focusSlotPropose: (title: string, hours: number, day: string) =>
    http.postJson<CoupleFocusTodayVO>('/api/couple/focus/slot/propose', { title, hours, day }),
  /** F361 对方点头确认（无请求体；⚠️ 提议人自己确认 400「自己写的时段不能自己确认，等 TA 点头」、
   *  没人预约 400「这周还没有人预约专属时段」；已生效再点是幂等），返回整份总览 */
  focusSlotConfirm: () => http.postJson<CoupleFocusTodayVO>('/api/couple/focus/slot/confirm', {}),
  /** F362 把一句话攒进 TA 的队列（content ≤80 字必填「想说的那句话说一句」，超 80 字 400；
   *  我在途 ≤5 句，满了 400「攒了 5 句了，等 TA 收一下吧」；只推收件人），返回整份总览 */
  focusQueue: (content: string) => http.postJson<CoupleFocusTodayVO>('/api/couple/focus/queue', { content }),
  /** F362 一键收全部并回执已读（无请求体；本次真签收 0 条时后端不推 focus-queue-read——
   *  GET /today 早就读时结算过了，这条按钮更多是「补签 + 给 TA 一个回执」），返回整份总览 */
  focusQueueRead: () => http.postJson<CoupleFocusTodayVO>('/api/couple/focus/queue/read', {}),
  /** F363 饭桌手机倒扣打卡（无请求体；点自己那一格，双点=同桌成功推双方，重复点后端幂等不报错），返回整份总览 */
  focusMeal: () => http.postJson<CoupleFocusTodayVO>('/api/couple/focus/meal', {}),
  /** F364 对视十秒打卡（无请求体；双点点亮推双方，重复点幂等），返回整份总览 */
  focusGaze: () => http.postJson<CoupleFocusTodayVO>('/api/couple/focus/gaze', {}),
  /** F365 不插电半小时打卡（无请求体；双点算这晚成了，周连击由后端读时算，重复点幂等），返回整份总览 */
  focusUnplug: () => http.postJson<CoupleFocusTodayVO>('/api/couple/focus/unplug', {}),
  /** F366 递一张「回来啦」卡（note ≤40 字可空，超了 400「哨子上的话最多 40 字」；
   *  ⚠️ 每人每天 2 张，用完 400「今天的 2 张哨卡都用完了，再吹就唠叨了」；只推 TA），返回整份总览 */
  focusNudge: (note: string) => http.postJson<CoupleFocusTodayVO>('/api/couple/focus/nudge', { note }),
  /** F368 发起/应战半日无手机挑战（kind 只能 'AM' | 'PM'，否则 400「只能选 AM 或 PM」；一天一格，
   *  先挂的人定半天，后应战的人不改写它；双报才达成「清净半天」），返回整份总览 */
  focusDetox: (kind: CoupleFocusDetoxKind) => http.postJson<CoupleFocusTodayVO>('/api/couple/focus/detox', { kind }),
  /** F367 专注周报（GET：无参，周一锚聚合本周真实数字 + 后端 Bank 组好的 summary；
   *  ⚠️ 不在总览里，点按钮才懒读，失败直透 ElMessage.error，首次加载不自动拉） */
  focusWeekly: () => http.get<CoupleFocusWeeklyVO>('/api/couple/focus/weekly'),
  /** F369 注意力年报（GET：year 空串=当年且须 yyyy 否则 400「年份写成 yyyy」；
   *  hours 是后端 %.1f 换算的小时数字符串，topDay 空串=今年还没有最专注的一天） */
  focusYear: (year?: string) =>
    http.get<CoupleFocusYearlyVO>(year ? `/api/couple/focus/year?year=${year}` : '/api/couple/focus/year'),
}

/**
 * F370-F379 人生关卡（questApi，基址 /api/couple/quest）—— v7 最大一批：29 个映射 = 2 个 GET + 27 个 POST。
 * GET /board 是唯一的聚合读接口，27 个 POST 写接口全部原样返回整份 QuestVO（后端 CoupleQuestService.QuestVO），
 * 前端整体替换即十卡刷新；⚠️ GET /wall?year=（F378 成就墙）是「点按钮才懒读另一年」的独立读接口，
 * 不在这份聚合里（聚合里的 wall 恒是服务端当年那一份）。
 * 限流与错误码全部抄自后端 Service/实体常量（业务规则归后端，400 中文 message 直透 ElMessage）：
 * · F370 /battle：day 须 yyyy-MM-dd（400「关卡日写成 yyyy-MM-dd」）且不能早于服务端今天
 *   （400「关卡日是过去的日子啦，要打就挑今天或以后 ⚔️）；kind 只能 INTERVIEW/REPORT/DEFEND/TALK/CHECKUP/OTHER
 *   （400「关卡类型只能是面试/汇报/答辩/谈判/体检/其它」，空串后端兜成 OTHER）；name 必填
 *   （400「关卡总得有个名字，比如「述职答辩」」）且 ≤30（NAME_MAX，400「关卡名最多 30 字」）；fear ≤60
 *   （FEAR_MAX，400「怯场话最多 60 字」）；同人同日同名 uk 重复 400「这场已经挂过了，换个名字或换个日子 ⚔️」；
 *   在途每人 ≤3（IN_FLIGHT_MAX，400「在途的关卡最多 3 场，先打完再挂」）。
 *   /battle/remove：⚠️ 只有挂关人本人能撤（400「这场是 TA 的关卡，只有 TA 自己能撤 ⚔️」），
 *   已交过战报的关不能再撤（400「这一关已经报过战报了，留着当记录吧」）；id 找不到是 404
 *   「找不到这一场关卡，可能已经撤掉了 ⚔️」。
 * · F371 /report：battleId 必填；⚠️ 只有打这一关的人能交（400「这一关是 TA 打的，战报得 TA 来交 📣」）、
 *   一战一报（400「这一关已经交过战报了，一关一份」）；result 只能 WIN/LOSE/SURVIVE（400「战果只有三种…」）；
 *   feeling ≤60（FEELING_MAX，400「一句感受最多 60 字」）可空。报完这一关离开 battles 列表（prep 过滤）。
 *   /report/seal：⚠️ 章只能由「非交报人」盖（400「战报是自己交的，章要 TA 来盖 🎖️」），已盖再点是幂等
 *   （后端直接返回整份 VO 不报错不重推）；按战果自动定章名（WIN 庆功/SURVIVE 幸亏/LOSE 抱抱）。
 * · F372 /overtime：untilHour 后端 13-23 静默钳制（HOUR_MIN/MAX，null 按 HOUR_DEFAULT=20）；note ≤40
 *   （NOTE_MAX，400「一句说明最多 40 字」）可空；uk(space,day,user) 每人每天一行、本人当天可改写。
 *   /overtime/lamp：{id,text}；⚠️ 灯只能留给对方那行（400「灯是给加班的人留的，自己留不算 💡」）、
 *   text 必填（400「灯下想留的那句话写一句」）且 ≤60（LAMP_MAX，400「灯卡最多 60 字」）；
 *   id 找不到是 404「找不到今晚的加班预报，先让 TA 报一下 🌙」（明晚的灯要明晚再留）。
 * · F373 /nurse：symptom ≤60（SYMPTOM_MAX，400「症状一句话最多 60 字」）可空；⚠️ 生病的人自己开不了单
 *   （后端把 patient 恒定为「操作人的对方」），在途每人 ≤1（400「TA 的陪护单还在途，一张够了 🤒」）。
 *   /nurse/mark {nurseId,kind}：单关了 400「这张单已经关了，不用继续记了」、⚠️ 只有陪护人能代记
 *   （400「陪护单是 X 在陪，代记轮不到别人 💧」）、kind 只能 WATER/MED（400「只能记喝水或吃药两种」）、
 *   一天每种只记一次（400「今天的喝水/吃药已经记过啦」）。/nurse/message {nurseId,text}：只有陪护人写
 *   （400「病中留言是陪护人写的 ✍️」）、必填（400「留言写一句再存」）且 ≤80（MESSAGE_MAX）。
 *   /nurse/close：⚠️ 痊愈只能病人自己宣布（400「痊愈要病人自己说，陪护的人不能替 TA 宣布 🎉」），
 *   已关单再点是幂等（直接返回整份 VO）。
 * · F374 /pod：untilDay 须 yyyy-MM-dd 且严格晚于今天（400「出舱日要晚于今天，静音舱不能当天开了就关 🔇」）；
 *   一人同时只有一舱在途（400「你还在舱里，先出舱再进一次」）。/pod/cheer {id}：⚠️ 只有舱外的人能递
 *   （400「舱是 TA 进的，加油卡要从外面递进去 💪」）、TA 已出舱 400「TA 已经出舱了，加油卡改成长信吧 🔔」、
 *   一天一张（400「今天这张加油卡已经递过了，一天一张」，按 MMdd CSV 判）。/pod/out {id}：只有舱里的人自己出
 *   （400「舱里的人才能自己出舱 🔔」），已出舱再点是幂等。/pod/letter {id}：TA 还在舱里 400
 *   「TA 还在舱里，长信等出舱再写」、⚠️ 只有舱外那个人能标（400「长信是对面那个人写的，自己不能替 TA 打勾 ✉️」），
 *   标过再点是幂等。
 * · F375 /move/name {slot,name}：slot 只能 1-8（SLOT_MIN/MAX，400「区块位只有 1-8 格」）、name 必填
 *   （400「这块要装什么，写个名字」）且 ≤20（NAME_MAX），谁都能补/改写。/move/claim {slot}：⚠️ 对方已认领
 *   400「这一格 X 已经认领了，换一格吧 📦」，自己再点一次是松手（并把 done 清 0）。/move/boxes {slot,boxes}：
 *   只有认领人能填（400「这一格还没归你认领，数不了箱 📦」），boxes 后端 0-99 静默钳制（BOX_MAX，null 按 0）。
 *   /move/done {slot}：只有认领人能勾（400「谁认领的谁来勾完成 📦」），已勾再点是幂等。
 *   /move/night {day,note}：day 必填须 yyyy-MM-dd（400「第一晚是哪天写成 yyyy-MM-dd」）、note ≤60
 *   （NOTE_MAX，400「那一晚的一句话最多 60 字」）；⚠️ 后端只在「这一拍真的 0→1 翻转」时才写库，
 *   已经打过卡的那一方再送来的 note 会被静默丢掉（不 update），所以前端在 mineTicked 时就不再放输入口。
 * · F376 /valley：untilDay 须 yyyy-MM-dd 且与服务端今天的跨度只能 7-30 天（SPAN_MIN/MAX，400
 *   「通行证要挂 7-30 天，太短像赌气，太长像放弃 🌧️」）；在途每人 ≤1（400「你的通行证还在有效期内，不用重复开」）。
 *   /valley/care {id}：⚠️ 只有对方能递（400「通行证是 TA 开的，卡要从外面递进来 🧻」）、TA 已回升 400
 *   「TA 已经回升了，卡改天再递 🌤️」、一天一张（400「今天的卡已经递过了，一天一张」）。/valley/rise {id}：
 *   只有本人能定回升日（400「缓没缓过来只有 TA 自己说了算，别人不能替 TA 宣布 🌤️」），已回升幂等。
 * · F377 /win：content 必填（400「做成的一件小事写一句，比如「把简历改了」」）且 ≤40（CONTENT_MAX）；
 *   day 空串=今天、须 yyyy-MM-dd（400「日子写成 yyyy-MM-dd」）、不能是未来（400「小事要今天或以前做成了才算，
 *   先别预支 🏅」）；uk(space,day,user) 每人每天一条，改写不重推。/win/award {id}：⚠️ 只能颁对方的记录
 *   （400「小赢奖是颁给 TA 的，不能自颁 🏆」）且一人一周一颁（400「这周你已经颁过一次小赢奖了，下周再来」）。
 * · F379 /upcoming：day 须落在服务端今天起 60 天内（WINDOW_DAYS，400「关口只挂今天起 60 天之内的 🙋」）、
 *   title 必填（400「关口叫什么，写一句」）且 ≤30（TITLE_MAX）；同人同日同名 400「这个关口你已经挂过了」。
 *   /upcoming/attend {id}：⚠️ 只有非挂单人能点（400「到场要对方来说，自己给自己应援不算 🙋」），重复点幂等。
 *   /upcoming/remove {id}：只有挂单人能撤（400「这个关口是 TA 挂的，只有 TA 能撤」）。
 * · F378 /wall（GET：year 空串=当年且须 yyyy 否则 400「年份写成 yyyy」）：年度聚合，数字直接查原始表
 *   （不受 battles≤12/reports≤20/nurses≤6/pods≤8/wins≤21/upcoming≤20 的列表钳制）。
 * 未建空间一律 404「还没有建立情侣空间，先邀请一位好友吧」，组件侧 safeLoad 静默降级。
 */
export const questApi = {
  /** F370-F379 关卡总览（GET /board：十九个字段一次拉齐，⚠️ wall 恒是「服务端当年」那一份；
   *  myOvertime/partnerOvertime/myNurse/partnerNurse/myPod/partnerPod/moveNight/myValley/partnerValley
   *  没数据时为 null，其余字符串后端恒给空串；未建空间 404 前端静默降级） */
  questBoard: () => http.get<CoupleQuestVO>('/api/couple/quest/board'),
  /** F370 挂一场 Boss 战（day 今天或以后、kind 六白名单之一、name ≤30 必填、fear ≤60；
   *  同人同日同名 400、在途每人 ≤3 场），返回整份总览 */
  questBattle: (day: string, kind: CoupleQuestBattleKind, name: string, fear: string) =>
    http.postJson<CoupleQuestVO>('/api/couple/quest/battle', { day, kind, name, fear }),
  /** F370 撤掉自己挂的在途关卡（⚠️ 只有挂关人本人能撤，已交战报的不能再撤），返回整份总览 */
  questBattleRemove: (id: string) => http.postJson<CoupleQuestVO>('/api/couple/quest/battle/remove', { id }),
  /** F371 交出关战报（battleId 必填；⚠️ 只有打这一关的人能交、一战一报；result 只能
   *  'WIN'|'LOSE'|'SURVIVE'；feeling ≤60 字可空），返回整份总览 */
  questReport: (battleId: string, result: CoupleQuestResult, feeling: string) =>
    http.postJson<CoupleQuestVO>('/api/couple/quest/report', { battleId, result, feeling }),
  /** F371 对方按战果盖章（⚠️ 自己交的战报自己盖不了，章名由后端按战果定；已盖再点幂等不报错），返回整份总览 */
  questReportSeal: (id: string) => http.postJson<CoupleQuestVO>('/api/couple/quest/report/seal', { id }),
  /** F372 预报今晚忙到几点（untilHour 后端 13-23 静默钳制、null 按 20；note ≤40 字可空；
   *  每人每天一行、本人当天可改写），返回整份总览 */
  questOvertime: (untilHour: number | null, note: string) =>
    http.postJson<CoupleQuestVO>('/api/couple/quest/overtime', { untilHour, note }),
  /** F372 给对方留一张到家灯卡（id 是对方今晚那行预报的 id；⚠️ 只有对方能留、自己的行留不算，
   *  text 必填 ≤60 字；找不到那行是 404），返回整份总览 */
  questLamp: (id: string, text: string) => http.postJson<CoupleQuestVO>('/api/couple/quest/overtime/lamp', { id, text }),
  /** F373 为 TA 开生病陪护单（symptom ≤60 字可空；⚠️ 生病的人自己开不了，病人恒等于操作人的对方；
   *  在途每人 ≤1 张），返回整份总览 */
  questNurse: (symptom: string) => http.postJson<CoupleQuestVO>('/api/couple/quest/nurse', { symptom }),
  /** F373 陪护人代记一次喝水/吃药（kind 只能 'WATER'|'MED'；⚠️ 只有陪护人能记、一天每种只记一次、
   *  单关了不能再记），返回整份总览 */
  questNurseMark: (nurseId: string, kind: CoupleQuestCareKind) =>
    http.postJson<CoupleQuestVO>('/api/couple/quest/nurse/mark', { nurseId, kind }),
  /** F373 陪护人写/改病中留言（⚠️ 只有陪护人写；text 必填 ≤80 字；单关了 400），返回整份总览 */
  questNurseMessage: (nurseId: string, text: string) =>
    http.postJson<CoupleQuestVO>('/api/couple/quest/nurse/message', { nurseId, text }),
  /** F373 病人自己宣布痊愈关单（⚠️ 陪护人不能替 TA 宣布；已关单再点是幂等），返回整份总览 */
  questNurseClose: (id: string) => http.postJson<CoupleQuestVO>('/api/couple/quest/nurse/close', { id }),
  /** F374 宣布进静音舱（untilDay 须 yyyy-MM-dd 且严格晚于服务端今天；一人同时只有一舱在途），返回整份总览 */
  questPod: (untilDay: string) => http.postJson<CoupleQuestVO>('/api/couple/quest/pod', { untilDay }),
  /** F374 给舱里的人递一张加油卡（⚠️ 只有舱外的人能递、TA 出舱后不能再递、一天一张），返回整份总览 */
  questPodCheer: (id: string) => http.postJson<CoupleQuestVO>('/api/couple/quest/pod/cheer', { id }),
  /** F374 本人出舱（到点或提前都行；⚠️ 舱里的人才能自己出，已出舱再点幂等），返回整份总览 */
  questPodOut: (id: string) => http.postJson<CoupleQuestVO>('/api/couple/quest/pod/out', { id }),
  /** F374 对方标记「长信已补」（⚠️ 只有舱外那个人能标、TA 还在舱里时 400；标过再点幂等），返回整份总览 */
  questPodLetter: (id: string) => http.postJson<CoupleQuestVO>('/api/couple/quest/pod/letter', { id }),
  /** F375 给搬家区块起名（slot 只能 1-8；name 必填 ≤20 字；谁都能补，同名格子改写）），返回整份总览 */
  questMoveName: (slot: number, name: string) =>
    http.postJson<CoupleQuestVO>('/api/couple/quest/move/name', { slot, name }),
  /** F375 认领/松手某一格（⚠️ 对方已认领的格子 400；自己再点一次是松手并把「打包完成」清 0），返回整份总览 */
  questMoveClaim: (slot: number) => http.postJson<CoupleQuestVO>('/api/couple/quest/move/claim', { slot }),
  /** F375 记这一格打包了几箱（⚠️ 只有认领人能填；boxes 后端 0-99 静默钳制、null 按 0），返回整份总览 */
  questMoveBoxes: (slot: number, boxes: number | null) =>
    http.postJson<CoupleQuestVO>('/api/couple/quest/move/boxes', { slot, boxes }),
  /** F375 这一格打包完成（⚠️ 只有认领人能勾；已勾再点是幂等），返回整份总览 */
  questMoveDone: (slot: number) => http.postJson<CoupleQuestVO>('/api/couple/quest/move/done', { slot }),
  /** F375 新家第一晚打卡（day 必填须 yyyy-MM-dd、note ≤60 字可空；双人才算庆祝推双方；
   *  ⚠️ 后端只在 0→1 真翻转时写库，已打过卡那一方再送的 note 会被静默丢掉），返回整份总览 */
  questMoveNight: (day: string, note: string) =>
    http.postJson<CoupleQuestVO>('/api/couple/quest/move/night', { day, note }),
  /** F376 本人宣布进低谷（untilDay 与服务端今天的跨度只能 7-30 天；在途每人 ≤1 张），返回整份总览 */
  questValley: (untilDay: string) => http.postJson<CoupleQuestVO>('/api/couple/quest/valley', { untilDay }),
  /** F376 递一张「不说话也行」卡（⚠️ 只有对方能递、TA 已回升 400、一天一张），返回整份总览 */
  questValleyCare: (id: string) => http.postJson<CoupleQuestVO>('/api/couple/quest/valley/care', { id }),
  /** F376 本人宣布回升收尾（⚠️ 只有本人能定回升日；已回升再点是幂等），返回整份总览 */
  questValleyRise: (id: string) => http.postJson<CoupleQuestVO>('/api/couple/quest/valley/rise', { id }),
  /** F377 记今天做成的一件小事（content 必填 ≤40 字；day 空串=今天、不能是未来；每人每天一条，
   *  当天改写不重推），返回整份总览 */
  questWin: (content: string, day: string) => http.postJson<CoupleQuestVO>('/api/couple/quest/win', { content, day }),
  /** F377 互颁小赢奖（⚠️ 只能颁对方的记录、一人一周一颁），返回整份总览 */
  questWinAward: (id: string) => http.postJson<CoupleQuestVO>('/api/couple/quest/win/award', { id }),
  /** F379 挂一个未来 60 天内的关口（day 须 yyyy-MM-dd、title 必填 ≤30 字；同人同日同名 400），返回整份总览 */
  questUpcoming: (day: string, title: string) =>
    http.postJson<CoupleQuestVO>('/api/couple/quest/upcoming', { day, title }),
  /** F379 对方点「我会到场」（⚠️ 只有非挂单人能点；重复点幂等），返回整份总览 */
  questUpcomingAttend: (id: string) => http.postJson<CoupleQuestVO>('/api/couple/quest/upcoming/attend', { id }),
  /** F379 撤掉自己挂的关口（⚠️ 只有挂单人能撤），返回整份总览 */
  questUpcomingRemove: (id: string) => http.postJson<CoupleQuestVO>('/api/couple/quest/upcoming/remove', { id }),
  /** F378 关卡成就墙（GET：year 空串=当年且须 yyyy 否则 400「年份写成 yyyy」；数字全部直接查原始表，
   *  pods 那项是「静音舱+搬家打包完成」合计、awards 是「小赢奖+低谷卡」合计。
   *  ⚠️ 这是「点按钮才懒读另一年」的独立接口，不在总览聚合里，失败直透 ElMessage.error、首屏不自动拉 */
  questWall: (year?: string) =>
    http.get<CoupleQuestWallVO>(year ? `/api/couple/quest/wall?year=${year}` : '/api/couple/quest/wall'),
}

/**
 * F380-F389 聆听者（catchApi，基址 /api/couple/catch）：2 个 GET + 19 个 POST = 21 个映射。
 * GET /board 是唯一的聚合读接口，19 个 POST 写接口全部原样返回整份 CatchVO
 * （后端 CoupleCatchService.CatchVO，字段顺序见 types/index.ts 的 CoupleCatchVO），前端整体替换即十卡刷新；
 * ⚠️ GET /year?year=（F389 年报）是唯一不在聚合里的懒读接口（聚合里的 year 恒是服务端当年那一份）。
 * 限流与错误码全部抄自后端 CoupleCatchService 与 CoupleCatch* 实体常量
 * （业务规则归后端，400/404 中文 message 直透 ElMessage，前端只可更严不可更松）：
 * · F380 /wish：content 必填（400「TA 想要什么，先写一句」）且 ≤60（CONTENT_MAX，400「心愿最多 60 字」）；
 *   sourceDay 空串=今天、须 yyyy-MM-dd（400「出处日子写成 yyyy-MM-dd」）、不能是将来
 *   （400「出处日子不能是将来」）；scene ≤40（SCENE_MAX，400「场合最多 40 字」）；
 *   同一主人心愿文案查重（uk(space,owner,content)）400「这条心愿已经悄悄记过了 🤫」；
 *   格子按 PER_OWNER_MAX=12 计，⚠️ 减数是 findByOwner 的**全量**（含已兑现揭晓的），
 *   400「TA 的心愿本最多记 12 条，先兑现几条」这句文案与实现不符（兑现并不释放格子，见交付报告）。
 *   /wish/fulfill：⚠️ 只有记账人本人能勾（400「这条是 X 悄悄记的，只有 TA 能勾兑现 🎁」），
 *   已兑现再点是幂等（直接返回整份、不重推）；勾完写 revealed_at，这条立刻离开 myWishes、
 *   出现在对方的 revealedToMe 里（保密靠读时过滤，不靠前端）；id 找不到/跨空间 404「找不到这条心愿 🤫」。
 * · F381 /mine：topic 必填（400「哪件事一碰就吵，写个话题」）且 ≤30（TOPIC_MAX）、trip ≤60（TRIP_MAX）、
 *   safeWay ≤60（SAFE_MAX）；同话题（uk(space,from_user,topic)）400「这颗雷已经挂过了」；
 *   每人 ≤6 颗（PER_USER_MAX，400「一个人最多挂 6 颗雷，别把日子过成扫雷」）。
 *   /mine/ack：⚠️ 自己挂的不能自己盖（400「这颗雷是你自己挂的，知晓章要 TA 来盖 ✅」），重复盖幂等不重推；
 *   404「找不到这颗雷 💣」。/mine/avoid：⚠️ 只有对方能记（400「避雷的人是 TA，你自己绕开不算战绩 🛡️」）、
 *   必须先盖过知晓（400「先盖「已知晓」，再记这次绕过去了」）；⚠️ 后端**没有**每日上限，avoided 可无限累加。
 * · F382 /safeword：word 必填（400「暂停词总得有个词」）且 ≤20（WORD_MAX）、note ≤60（NOTE_MAX，
 *   400「用了之后希望最多 60 字」）；uk(space,from_user) 每人一行、再提交即改写。
 *   /safeword/use（⚠️ 无请求体，POST 传 {}）：还没约词 400「先约一个安全词，才喊得出口 🛑」、
 *   一天一人只记一次（uk(space,day,user)）400「今天已经记过一次暂停了，别把安全词用成口头禅」。
 *   /safeword/reflect {id,reflect}：⚠️ 只有喊停本人能补（400「那次是 TA 喊的停，复盘要 TA 自己写 📝」）、
 *   必填（400「复盘写一句：当时卡在哪、后来怎么接着聊的」）且 ≤60（REFLECT_MAX）；404「找不到那次暂停记录 🛑」。
 * · F383 /sensitive：day 必填须 yyyy-MM-dd（400「敏感日写成 yyyy-MM-dd」）、⚠️ 只能今天或将来
 *   （400「敏感日要提前标，过去的日子就让它过去 📌」）；kind 只能 PERIOD/CHECK/MEMORY/OTHER
 *   （400「类型只能是周期第一天/考核日/忌日纪念日/其它」，空串后端兜成 OTHER）；care ≤60（CARE_MAX）；
 *   同一主人同一天同一类（uk(space,owner,day,kind)）400「这一天的这一类已经标过了」；
 *   ⚠️ 主人恒等于操作人的对方（只能替 TA 标，标不了自己）。/sensitive/remove：⚠️ 只有代标的人能撤
 *   （400「这个敏感日是 TA 替你标的，要撤也让 TA 来撤 📌」）；404「找不到这个敏感日 📌」。
 * · F384 /thread：topic 必填（400「聊到哪儿的话题，写一句」）且 ≤40（TOPIC_MAX）、progress ≤60
 *   （PROGRESS_MAX）；⚠️ 查重只在在途 OPEN 里比（(space,from_user,topic) 不是唯一键，续完后同话题能再存），
 *   400「这个话题已经在线轴上了 🧵」；在途每人 ≤5（IN_FLIGHT_MAX，400「在途的话头最多 5 个，先聊完几个再存」）。
 *   /thread/done：⚠️ 只有存话头的人能销（400「这个话头是 TA 存的，让 TA 自己销档 ✂️」），已销幂等；
 *   404「找不到那个话头 🧵」。
 * · F385 /say：say 必填（400「嘴上常说的那句写下来」）且 ≤20（SAY_MAX）、means 必填
 *   （400「翻译结果得写，不然对方猜不到 🔤」）且 ≤60（MEANS_MAX）；同说辞（uk(space,from_user,say)）
 *   400「这条已经申报过了」；每人 ≤10 条（PER_USER_MAX，400「反话词条最多 10 条，先删几条」）。
 *   /say/remove：⚠️ 只有申报人本人能删（400「这份对照是 TA 本人申报的，对方不能改也不能删」）；
 *   404「找不到这条对照词条 🔤」。
 * · F386 /protocol：mode 只能 REASON/RANT/HUG/FOOD/SPACE 五个（400「五种里选一个：讲道理/陪骂/抱抱不说话/
 *   递吃的/别理我 🎧」，⚠️ 空串也走这条，不像 F383 的 kind 有兜底）、note ≤60（400「补充说明最多 60 字」）；
 *   uk(space,from_user) 每人一行可改写。
 * · F387 /topic：title 必填（400「想多聊的话题写一个」）且 ≤30（TITLE_MAX）；同人同名
 *   （uk(space,from_user,title)）400「这个话题已经许过了 💭」；⚠️ 后端没有许愿条数上限。
 *   /topic/take：⚠️ 自己许的题自己接不了（400「自己许的题不能自己接 📥」），非 PENDING 再点是幂等；
 *   404「找不到这一题 💭」。/topic/talk {id,reflect}：⚠️ 还没接单 400「这一题还没接单，聊不了」、
 *   只有接单人能勾（400「单是谁接的，谁来说「聊完了」」）、reflect 必填
 *   （400「聊完了总得留一句感想」）且 ≤60（REFLECT_MAX）；距接单超过 7 天（WEEK_MILLIS）落 overdue。
 * · F388 /daily：content 必填（400「今天想说的那句写下来 💬」）且 ≤40（CONTENT_MAX）；
 *   uk(space,day,user) 每人每天一行、当天可改写（只有首次那条推给对方，改写不重推）。
 * · F389 /year（GET：year 空串=当年、须 yyyy 否则 400「年份写成 yyyy」）：数字全部直查原始表，
 *   不受 myWishes≤24/mines≤12/uses≤20/sensitives≤12/threads≤12/says≤20/topics≤12/dailies≤14 的列表钳制。
 * 未建空间一律 404「还没有建立情侣空间，先邀请一位好友吧」，组件侧 safeLoad 静默降级。
 */
export const catchApi = {
  /** F380-F389 聆听者总览（GET /board：二十四个字段一次拉齐；⚠️ myWord/partnerWord/myProtocol/
   *  partnerProtocol/myToday/partnerToday 没数据时为 null，其余字符串后端恒给空串；未建空间 404 前端静默降级） */
  catchBoard: () => http.get<CoupleCatchVO>('/api/couple/catch/board'),
  /** F380 悄悄记一条 TA 随口说的心愿（content 必填 ≤60 字、sourceDay 空串=今天且不能是将来、scene ≤40 字；
   *  同主人同文案 400、格子按 12 条计且减数含已兑现；⚠️ 后端不推给对方，保密靠读时过滤），返回整份总览 */
  catchWish: (content: string, sourceDay: string, scene: string) =>
    http.postJson<CoupleCatchVO>('/api/couple/catch/wish', { content, sourceDay, scene }),
  /** F380 兑现登记（⚠️ 只有记账人本人能勾；勾完 revealed_at 落库、这条立刻离开 myWishes；已勾再点幂等），
   *  返回整份总览 */
  catchWishFulfill: (id: string) => http.postJson<CoupleCatchVO>('/api/couple/catch/wish/fulfill', { id }),
  /** F381 挂一颗雷（topic 必填 ≤30 字、trip ≤60 字、safeWay ≤60 字；同话题 400、每人 ≤6 颗），返回整份总览 */
  catchMine: (topic: string, trip: string, safeWay: string) =>
    http.postJson<CoupleCatchVO>('/api/couple/catch/mine', { topic, trip, safeWay }),
  /** F381 对方盖「已知晓」（⚠️ 自己挂的不能自己盖；重复盖幂等不重推），返回整份总览 */
  catchMineAck: (id: string) => http.postJson<CoupleCatchVO>('/api/couple/catch/mine/ack', { id }),
  /** F381 记一次成功避雷（⚠️ 只有对方能记、必须先盖过知晓；后端无每日上限），返回整份总览 */
  catchMineAvoid: (id: string) => http.postJson<CoupleCatchVO>('/api/couple/catch/mine/avoid', { id }),
  /** F382 约定/改写自己的安全词（word 必填 ≤20 字、note ≤60 字；每人一格 upsert），返回整份总览 */
  catchSafeword: (word: string, note: string) =>
    http.postJson<CoupleCatchVO>('/api/couple/catch/safeword', { word, note }),
  /** F382 喊了一次暂停（⚠️ 后端无请求体，传 {}；还没约词 400、一天一人只记一次），返回整份总览 */
  catchSafewordUse: () => http.postJson<CoupleCatchVO>('/api/couple/catch/safeword/use', {}),
  /** F382 给某次暂停补事后复盘（⚠️ 只有喊停本人能补；reflect 必填 ≤60 字），返回整份总览 */
  catchSafewordReflect: (id: string, reflect: string) =>
    http.postJson<CoupleCatchVO>('/api/couple/catch/safeword/reflect', { id, reflect }),
  /** F383 给 TA 标一个敏感日（day 必填须 yyyy-MM-dd 且只能今天或将来；kind 四白名单、空串后端兜 OTHER、
   *  care ≤60 字可空；⚠️ 主人恒是操作人的对方，标不了自己），返回整份总览 */
  catchSensitive: (day: string, kind: CoupleCatchSensitiveKind | '', care: string) =>
    http.postJson<CoupleCatchVO>('/api/couple/catch/sensitive', { day, kind, care }),
  /** F383 撤掉代标的一天（⚠️ 只有代标的人能撤，敏感日的主人自己撤不掉），返回整份总览 */
  catchSensitiveRemove: (id: string) => http.postJson<CoupleCatchVO>('/api/couple/catch/sensitive/remove', { id }),
  /** F384 存一个被打断的话头（topic 必填 ≤40 字、progress ≤60 字；在途同名 400、在途每人 ≤5 个），
   *  返回整份总览 */
  catchThread: (topic: string, progress: string) =>
    http.postJson<CoupleCatchVO>('/api/couple/catch/thread', { topic, progress }),
  /** F384 续完销档（⚠️ 只有存话头的人能销；已销幂等），返回整份总览 */
  catchThreadDone: (id: string) => http.postJson<CoupleCatchVO>('/api/couple/catch/thread/done', { id }),
  /** F385 申报一条口是心非（say 必填 ≤20 字、means 必填 ≤60 字；同说辞 400、每人 ≤10 条），返回整份总览 */
  catchSay: (say: string, means: string) => http.postJson<CoupleCatchVO>('/api/couple/catch/say', { say, means }),
  /** F385 删掉自己申报的词条（⚠️ 对方只能看，改不了也删不了），返回整份总览 */
  catchSayRemove: (id: string) => http.postJson<CoupleCatchVO>('/api/couple/catch/say/remove', { id }),
  /** F386 写/改「我难过时要的是」（mode 只能 REASON/RANT/HUG/FOOD/SPACE 五个、⚠️ 空串没有兜底直接 400；
   *  note ≤60 字可空；每人一格 upsert），返回整份总览 */
  catchProtocol: (mode: CoupleCatchProtocolMode, note: string) =>
    http.postJson<CoupleCatchVO>('/api/couple/catch/protocol', { mode, note }),
  /** F387 许一题「希望我们多聊 XX」（title 必填 ≤30 字；同人同名 400；后端无条数上限），返回整份总览 */
  catchTopic: (title: string) => http.postJson<CoupleCatchVO>('/api/couple/catch/topic', { title }),
  /** F387 接单（⚠️ 只有非许愿人能接；已接/已聊完再点是幂等），返回整份总览 */
  catchTopicTake: (id: string) => http.postJson<CoupleCatchVO>('/api/couple/catch/topic/take', { id }),
  /** F387 聊完并留一句感想（⚠️ 只有接单人能勾、reflect 必填 ≤60 字；距接单超 7 天后端落 overdue），
   *  返回整份总览 */
  catchTopicTalk: (id: string, reflect: string) =>
    http.postJson<CoupleCatchVO>('/api/couple/catch/topic/talk', { id, reflect }),
  /** F388 留今天想对 TA 说的一句（content 必填 ≤40 字；每人每天一行、当天可改写且改写不重推），
   *  返回整份总览 */
  catchDaily: (content: string) => http.postJson<CoupleCatchVO>('/api/couple/catch/daily', { content }),
  /** F389 聆听者年报（GET：year 空串=当年且须 yyyy 否则 400「年份写成 yyyy」；数字全部直查原始表，
   *  不受总览列表钳制，title/summary 是后端 Bank 整句。
   *  ⚠️ 这是「点按钮才懒读另一年」的独立接口，不在总览聚合里（聚合里的 year 恒是服务端当年那份），
   *  失败直透 ElMessage.error、首屏不自动拉 */
  catchYear: (year?: string) =>
    http.get<CoupleCatchYearVO>(year ? `/api/couple/catch/year?year=${year}` : '/api/couple/catch/year'),
}

/**
 * F390-F399 欢笑银行（laughApi，基址 /api/couple/laugh）：3 个 GET + 14 个 POST = 17 个映射。
 * GET /bank 是唯一的聚合读接口，14 个 POST 写接口全部原样返回整份 LaughVO
 * （后端 CoupleLaughService.LaughVO 十七个字段，顺序见 types/index.ts 的 CoupleLaughVO），前端整体替换即十卡刷新；
 * ⚠️ 与批次三十四不同：GET /week（F398）与 GET /year?year=（F399）**也各自在聚合里有一份**
 * （build() 每个写接口都重算 weekReport 与 year），这两个懒读接口只是「点按钮再要一次」的独立读口，
 * 结果另存一份 ref，不覆盖聚合、也不参与任何判定；失败直透 ElMessage.error、首屏不自动拉。
 * 限流与错误码全部抄自后端 CoupleLaughService 与 CoupleLaugh* 实体常量
 * （业务规则归后端，400/404 中文 message 直透 ElMessage，前端只可更严不可更松）：
 * · F390 /moment：day 空串=今天、须 yyyy-MM-dd（400「发生的日子写成 yyyy-MM-dd」）、不能是将来
 *   （400「笑点要是还没发生，就先别存 🤔」）；title 必填（400「这条笑点叫什么，起个名」）且 ≤30
 *   （TITLE_MAX，400「名字最多 30 字」）；culprit ≤20（CULPRIT_MAX，400「谁干的最多 20 字」）可空；
 *   scene ≤100（SCENE_MAX，400「现场还原最多 100 字」）可空；⚠️ funLevel 传 null 后端兜 3、
 *   越界静默钳到 1-5（LEVEL_MIN/LEVEL_MAX，**不报错**），前端要求必须先选；
 *   同人同「事发日」同名查重（按 equalsIgnoreCase，与 uk(space,day,from,title) 在 MariaDB *_ci 下的口径一致）
 *   400「这条笑点已经存过了」；同人同「事发日」≥3 条（PER_DAY_MAX）400「一天最多存 3 条，笑也要节制 😂」
 *   ⚠️ 减数用的是提交的那个 day 而不是今天，换着过去的日子提交就绕得过这句「每人每天 ≤3 条」的注释口径。
 *   /moment/witness {id,witness}：⚠️ 只有对方能补（400「证词要对方补——自己夸现场没意思 🎤」）、
 *   必填（400「现场证词写一句」）且 ≤100（WITNESS_MAX，400「证词最多 100 字」）、
 *   补过再补是 **400**「这条已经有人补过证词了」（不同于 heal/hit/taken 的幂等静默）；
 *   404「找不到这条笑点 😂」。
 * · F391 /daily：⚠️ 只有周轮换算出的值班人能交（400「今天轮不到你——X 才是值班喜剧人 🎪」），
 *   content 必填（400「今天打算用什么逗，写出来」）且 ≤100（CoupleLaughDaily.CONTENT_MAX，400「节目内容最多 100 字」）；
 *   一天一格 upsert：没判分前再交一次=改写（只有首次那次推 laugh-daily），判过之后再交 400
 *   「今天已经判过分了，节目就定格在这了」；⚠️ 聚合里没有任何「今天轮不轮到我」的布尔位
 *   （LaughVO 没有 dutyUser/onDutyMine，today 为 null 时只剩 rotationHint 那句文案），前端挡不住抢班。
 *   /daily/judge {id,verdict}：⚠️ 值班人自己不能判（400「自己逗的不能自己判，让 TA 来 🏅」）、
 *   verdict 只 HAPPY/FLAT/FAKE 三个（后端 toUpperCase，白名单外 400「只能判三种：真笑了 / 没笑 / 强撑的笑」）、
 *   已判过再点是**幂等静默**（直接返回整份、不重推）；404「找不到今天的节目单 🎪」。
 * · F392 /joke：content 必填（400「冷笑话总得先有个冷句」）且 ≤80（CONTENT_MAX，400「冷笑话最多 80 字」）；
 *   同人同内容**全历史**查重（uk(space,from_user,content)，equalsIgnoreCase）
 *   400「这条已经丢过一次了，冷笑话不许重播」；同人**今天** ≥3 条（PER_USER_DAY_MAX，
 *   400「今天已经丢了 3 条，够冷了 🧊」）。/joke/judge {id,frozen}：⚠️ 自己讲的不能自己判
 *   （400「自己讲的不能自己判冰 🧊」）、已判再判是 **400**「这条已经判过了，结冰榜不许翻案」（非幂等）；
 *   frozen 传 null 后端按 false；404「找不到这条冷笑话 🧊」。
 * · F393 /cringe：day 空串=今天、须 yyyy-MM-dd（400「社死的日子写成 yyyy-MM-dd」）、不能是将来
 *   （400「社死是过去发生的事，不能预约」）；content 必填（400「当时发生了什么，写下来」）且 ≤100
 *   （CONTENT_MAX，400「社死现场最多 100 字」）；同人同一天（uk(space,day,from_user)）
 *   400「那天已经交过一条了，一天一条 😖」。/cringe/heal {id}：⚠️ 只有对方能盖（400
 *   「抱抱章要 TA 盖，自己抱抱不算 🫂」）、重复盖幂等静默；404「找不到这条社死往事 😖」。
 *   ⚠️ turnedFunny/daysOld 是读时按 day 距今算的（满 HEAL_AFTER_DAYS=365 天才算转档），没有结算任务；
 *   满一年后 canHeal 仍是 true（后端没有「转档了就不许再盖」的规则）。
 * · F394 /attack：kind 白名单 PRAISE/MEME/MEMORY（400「突袭只有三种：一串夸奖 / 一个梗 / 一段回忆杀 💥」，
 *   ⚠️ 传空串后端兜成 PRAISE 不报错，前端要求先选一种）；content 必填（400「突袭内容写一句」）且 ≤100
 *   （CONTENT_MAX，400「突袭内容最多 100 字」）；每人每天一次（uk(space,from_user,day)，
 *   400「今天已经突袭过一次了，明天再来 💥」）。/attack/hit {id}：⚠️ 只有收方能盖（400
 *   「自己发的弹不能自己认 🎯」）、重复盖幂等静默；404「找不到这次突袭 💥」。
 *   ⚠️ 规格里 F394 的「月度中弹榜」后端没有任何 VO 字段（attacks 列表被 LIST_ATTACK=14 钳住、
 *   YearVO.hits 是当年），前端拿不到诚实的本月数，只做当年与逐条展示。
 * · F395 /guess {jokeId,predict}：一条梗每人一票（uk(space,joke_id,from_user)），再交=改写自己那一票，
 *   predict 传 null 后端按 false；⚠️ 后端**没有**归属校验（讲的人也能给自己那条投），界面只能吃
 *   JokeVO.canGuess=「还没判冰」这一位（判冰前两边都能投，F395 要双判一致）；⚠️ 一致/不一致都不推 WS 事件、也没有默契台账
 *   （Bank 的 guessTwinLine/guessDiffLine 全仓无调用点）；404「找不到这条冷笑话 🧊」。
 * · F396 /rx {targetKind,targetId,note}：targetKind 只 MOMENT/CRINGE/ATTACK（⚠️ 空串没有兜底，
 *   直接 400「处方只能指向笑点 / 社死往事 / 快乐突袭 💊」）；目标行必须是本空间的
 *   （400「处方指向的那条已经不在这儿了 💊」）；每人每天一张（uk(space,from_user,day)，
 *   400「今天的处方已经开过了，明天再复诊」）；note ≤60（NOTE_MAX，400「医嘱最多 60 字」）可空。
 *   /rx/taken {id}：⚠️ 只有收方能回执（400「药是给对方吃的，自己不能回执 ✅」）、重复回执幂等静默；
 *   404「找不到这张处方 💊」；⚠️ RxVO 没有 canTake 位，按钮只能由 mine+taken 两个服务端位推。
 * · F397 /style {aboutUser,style,note}：aboutUser 空串后端兜成**操作人自己**、不是两人之一 400
 *   「只能给你们俩评幽默风格 🎭」；style 只 PUN/COLD/SELF/ACTION/MIME 五个（后端 toUpperCase，白名单外
 *   400「类型只有五种：谐音梗 / 冷幽默 / 自嘲派 / 动作派 / 模仿派」）；note ≤60（NOTE_MAX，
 *   400「补一句最多 60 字」）可空；uk(space,about_user,rater) 再提交=改写，⚠️ 每次改写都推 laugh-style。
 * · GET /week：无参，周一锚（后端 weekStart(previousOrSame(MONDAY))），七个计数全是**两人合计**；
 *   ⚠️ WeekVO.week 与 fromDay 后端给同一个值。GET /year?year=：空=当年、须 yyyy 否则 400「年份写成 yyyy」；
 *   数字按**事发日**归年直查原始表，不受 moments≤20/jokes≤20/cringes≤14/attacks≤14/rxList≤10 钳制
 *   （guess 表没有 day 列，借被考那条冷笑话的发出日归年）。
 * 未建空间一律 404「还没有建立情侣空间，先邀请一位好友吧」，组件侧 safeLoad 静默降级。
 */
export const laughApi = {
  /** F390-F399 欢笑银行总览（GET /bank：十七个字段一次拉齐，含服务端本周 weekReport 与当年 year 两份榜单；
   *  ⚠️ today 今天没人交节目时为 null、RxVO.targetTitle 查不到目标行时为 null，其余字符串后端恒给空串；
   *  未建空间 404 前端静默降级） */
  laughBank: () => http.get<CoupleLaughVO>('/api/couple/laugh/bank'),
  /** F398 欢乐周报（GET /week：周一锚、七个计数两人合计、summary 是后端 Bank 整句。
   *  ⚠️ 聚合里已经带了一份 weekReport，这是「点按钮再懒读一次」的独立接口，失败直透 ElMessage.error、首屏不自动拉 */
  laughWeek: () => http.get<CoupleLaughWeekVO>('/api/couple/laugh/week'),
  /** F399 年度欢笑榜（GET /year?year=：year 空串=当年、须 yyyy 否则 400「年份写成 yyyy」；数字按事发日归年、
   *  直查原始表不受总览列表钳制，title/summary 是后端 Bank 整句。
   *  ⚠️ 聚合里的 year 恒是服务端当年那份，这是「点按钮才懒读另一年」的独立接口，失败直透、首屏不自动拉 */
  laughYear: (year?: string) =>
    http.get<CoupleLaughYearVO>(year ? `/api/couple/laugh/year?year=${year}` : '/api/couple/laugh/year'),
  /** F390 存一条笑点（day 空串=今天且不能是将来、title 必填 ≤30 字、culprit ≤20 字、scene ≤100 字、
   *  funLevel 1-5 且 ⚠️ 后端 null 兜 3/越界静默钳制；同人同事发日同名 400、同事发日 ≥3 条 400），返回整份总览 */
  laughMoment: (day: string, title: string, culprit: string, scene: string, funLevel: number) =>
    http.postJson<CoupleLaughVO>('/api/couple/laugh/moment', { day, title, culprit, scene, funLevel }),
  /** F390 对方补一份现场证词（⚠️ 只有对方能补、一条只补一次，补过再补是 400 不是幂等；witness 必填 ≤100 字），
   *  返回整份总览 */
  laughMomentWitness: (id: string, witness: string) =>
    http.postJson<CoupleLaughVO>('/api/couple/laugh/moment/witness', { id, witness }),
  /** F391 值班的人交今天的节目（⚠️ 轮不到你 400，聚合里没有「今天轮不轮到我」的位；content 必填 ≤100 字；
   *  判分前再交一次=改写，判过后 400），返回整份总览 */
  laughDaily: (content: string) => http.postJson<CoupleLaughVO>('/api/couple/laugh/daily', { content }),
  /** F391 对方判分（⚠️ 值班人自己不能判；verdict 只 HAPPY/FLAT/FAKE；已判过再点是幂等静默），返回整份总览 */
  laughDailyJudge: (id: string, verdict: CoupleLaughVerdict) =>
    http.postJson<CoupleLaughVO>('/api/couple/laugh/daily/judge', { id, verdict }),
  /** F392 丢一条冷笑话（content 必填 ≤80 字；同人同内容全历史查重、同人今天 ≥3 条 400），返回整份总览 */
  laughJoke: (content: string) => http.postJson<CoupleLaughVO>('/api/couple/laugh/joke', { content }),
  /** F392 对方判结没结冰（⚠️ 自己讲的不能自己判、已判再判 400「结冰榜不许翻案」非幂等；
   *  frozen 传 null 后端按 false），返回整份总览 */
  laughJokeJudge: (id: string, frozen: boolean) =>
    http.postJson<CoupleLaughVO>('/api/couple/laugh/joke/judge', { id, frozen }),
  /** F393 交一条社死往事（day 空串=今天且不能是将来、content 必填 ≤100 字；同人同一天只一条），返回整份总览 */
  laughCringe: (day: string, content: string) =>
    http.postJson<CoupleLaughVO>('/api/couple/laugh/cringe', { day, content }),
  /** F393 对方盖「抱抱你」章（⚠️ 只有对方能盖；重复盖幂等静默；满一年转档后仍可补盖），返回整份总览 */
  laughCringeHeal: (id: string) => http.postJson<CoupleLaughVO>('/api/couple/laugh/cringe/heal', { id }),
  /** F394 发动一次快乐突袭（kind 三白名单、⚠️ 空串后端兜 PRAISE 所以前端要求先选；content 必填 ≤100 字；
   *  每人每天一次），返回整份总览 */
  laughAttack: (kind: CoupleLaughAttackKind, content: string) =>
    http.postJson<CoupleLaughVO>('/api/couple/laugh/attack', { kind, content }),
  /** F394 收方「中弹」盖章（⚠️ 自己发的弹自己认不了；重复盖幂等静默），返回整份总览 */
  laughAttackHit: (id: string) => http.postJson<CoupleLaughVO>('/api/couple/laugh/attack/hit', { id }),
  /** F395 预判对方会不会笑（一条梗每人一票、再交=改写自己那一票、predict 传 null 后端按 false；
   *  界面闸门吃 JokeVO.canGuess（判过冰才收口，讲的人自己也投这一票）；一致不一致都不推事件、无默契台账），返回整份总览 */
  laughGuess: (jokeId: string, predict: boolean) =>
    http.postJson<CoupleLaughVO>('/api/couple/laugh/guess', { jokeId, predict }),
  /** F396 开一张大笑处方（targetKind 三白名单、⚠️ 空串没有兜底直接 400；targetId 必须是本空间的行否则 400；
   *  note ≤60 字可空；每人每天一张），返回整份总览 */
  laughRx: (targetKind: CoupleLaughTargetKind, targetId: string, note: string) =>
    http.postJson<CoupleLaughVO>('/api/couple/laugh/rx', { targetKind, targetId, note }),
  /** F396 收方回执「已服用」（⚠️ 只有对方能回执；重复回执幂等静默；RxVO 无 canTake 位，按 mine+taken 推），
   *  返回整份总览 */
  laughRxTaken: (id: string) => http.postJson<CoupleLaughVO>('/api/couple/laugh/rx/taken', { id }),
  /** F397 记一份幽默风格（aboutUser 只能是两人之一、⚠️ 空串后端兜成操作人自己；style 五白名单；
   *  note ≤60 字可空；「谁评谁」一格，再提交=改写且每次都推 laugh-style），返回整份总览 */
  laughStyle: (aboutUser: string, style: CoupleLaughStyleCode, note: string) =>
    http.postJson<CoupleLaughVO>('/api/couple/laugh/style', { aboutUser, style, note }),
}

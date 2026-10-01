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

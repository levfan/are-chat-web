import { http } from './http'
import type {
  CoupleActionKind,
  CoupleActionVO,
  CoupleAnniversaryVO,
  CoupleBondStatsVO,
  CoupleAdminStatsVO,
  CoupleIntimacyVO,
  CoupleInviteVO,
  CoupleMoodDayVO,
  CoupleMoodKind,
  CoupleMoodReactionKind,
  CoupleMoodReactionVO,
  CoupleMoodVO,
  CoupleOverview,
  CoupleNotifyListVO,
  CoupleRelationshipVO,
  CoupleSpaceVO,
  CoupleScratchVO,
  CoupleBoxVO,
  CoupleComfortBoardVO,
  CoupleComfortVO,
  CoupleMoodSyncVO,
  CoupleDineTodayVO,
  CoupleCerOverviewVO,
  CoupleFyBoardVO,
  CoupleEchoVO,
  CoupleQuestVO,
  CoupleCatchVO,
  CouplePinVO,
  CoupleStreakBoardVO,
  CoupleQuestionTodayVO,
  CoupleQuestionHistoryVO,
  CoupleWishBoardVO,
  CoupleMemoryVO,
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
  intimacy: () => http.get<CoupleIntimacyVO>('/api/couple/intimacy'),
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
  updateProfile: (body: { slogan?: string | null; theme?: string | null; stickers?: string | null }) =>
    http.putJson<CoupleSpaceVO>('/api/couple/profile', {
      slogan: body.slogan ?? null,
      theme: body.theme ?? null,
      stickers: body.stickers ?? null,
    }),
  notifyMine: () => http.get<CoupleNotifyListVO>('/api/couple/notify'),
  /** F41 全部标记已读 */
  notifyReadAll: () => http.postJson<void>('/api/couple/notify/read-all', {}),
  /** F44 恋爱中徽章：某人是否在恋爱中 + 天数（仅其好友可查） */
  relationshipOf: (username: string) =>
    http.get<CoupleRelationshipVO>(`/api/couple/relationship-of/${encodeURIComponent(username)}`),
  /** F45 管理看板：情侣空间运营统计（仅管理员） */
  adminCoupleStats: () => http.get<CoupleAdminStatsVO>('/api/couple/admin/stats'),
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
}

// ============ 小日子·仪式感（F230-F239） ============
export const ceremonyApi = {
  /** F230-F239 今日仪式总览：黄历宜忌/小日子/催办/保险柜/续约/愿望券/体感/加冕一次拉齐 */
  cereOverview: () => http.get<CoupleCerOverviewVO>('/api/couple/ceremony/overview'),
  cereIssueCoupon: (title: string) =>
    http.postJson<CoupleCerOverviewVO>('/api/couple/ceremony/coupon', { title }),
  /** F236 核销一张愿望券（OPEN→USED，已核销再核 400），返回整份总览 */
  cereUseCoupon: (id: string) =>
    http.postJson<CoupleCerOverviewVO>('/api/couple/ceremony/coupon/use', { id }),
}

/**
/**
 * 家务轮盘（保留卡 couple-fy-spin，factoryApi，基址 /api/couple/factory）：
 * 1 个 GET /board + 3 个 POST（/spin /spin/confirm /spin/done），写接口一律返回整份 BoardVO 前端整体替换。
 * 后端 400 中文直透：一周一转、2-8 条且每条 ≤40 字不可重复、自己的活自己认不了、没认账干完无效。
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
}

/**
/**
 * 好事簿（保留卡 couple-echo-deed，echoApi，基址 /api/couple/echo）：
 * 1 个 GET /vault + 2 个 POST（/deed /deed/star），写接口返回整份 EchoVO。
 * 记一笔给「被记的那位」+2 分、加星再 +1；同日同人同内容 400，加星按行幂等。
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
}

/**
/**
 * 加班预报与留灯（保留卡 couple-quest-overtime，questApi，基址 /api/couple/quest）：
 * 1 个 GET /board + 2 个 POST（/overtime /overtime/lamp），写接口返回整份 QuestVO。
 * untilHour 后端 13-23 静默钳制；灯卡只有对方能留（自己留 400），TA 没预报时留不了。
 */
export const questApi = {
  /** F370-F379 关卡总览（GET /board：十九个字段一次拉齐，⚠️ wall 恒是「服务端当年」那一份；
   *  myOvertime/partnerOvertime/myNurse/partnerNurse/myPod/partnerPod/moveNight/myValley/partnerValley
   *  没数据时为 null，其余字符串后端恒给空串；未建空间 404 前端静默降级） */
  questBoard: () => http.get<CoupleQuestVO>('/api/couple/quest/board'),
  questOvertime: (untilHour: number | null, note: string) =>
    http.postJson<CoupleQuestVO>('/api/couple/quest/overtime', { untilHour, note }),
  /** F372 给对方留一张到家灯卡（id 是对方今晚那行预报的 id；⚠️ 只有对方能留、自己的行留不算，
   *  text 必填 ≤60 字；找不到那行是 404），返回整份总览 */
  questLamp: (id: string, text: string) => http.postJson<CoupleQuestVO>('/api/couple/quest/overtime/lamp', { id, text }),
}

/**
/**
 * 安全词与暂停复盘（保留卡 couple-catch-safeword，catchApi，基址 /api/couple/catch）：
 * 1 个 GET /board + 3 个 POST（/safeword /safeword/use /safeword/reflect），写接口返回整份 CatchVO。
 * word 必填 ≤20、note ≤60，每人一行可改写；没约词喊停 400、一天一人只记一次；
 * 复盘只有喊停本人能补且必填 ≤60 字。usedTodayMine/usedTodayPartner 由后端下发（不再靠前端比 day）。
 */
export const catchApi = {
  /** F380-F389 聆听者总览（GET /board：二十四个字段一次拉齐；⚠️ myWord/partnerWord/myProtocol/
   *  partnerProtocol/myToday/partnerToday 没数据时为 null，其余字符串后端恒给空串；未建空间 404 前端静默降级） */
  catchBoard: () => http.get<CoupleCatchVO>('/api/couple/catch/board'),
  catchSafeword: (word: string, note: string) =>
    http.postJson<CoupleCatchVO>('/api/couple/catch/safeword', { word, note }),
  /** F382 喊了一次暂停（⚠️ 后端无请求体，传 {}；还没约词 400、一天一人只记一次），返回整份总览 */
  catchSafewordUse: () => http.postJson<CoupleCatchVO>('/api/couple/catch/safeword/use', {}),
  /** F382 给某次暂停补事后复盘（⚠️ 只有喊停本人能补；reflect 必填 ≤60 字），返回整份总览 */
  catchSafewordReflect: (id: string, reflect: string) =>
    http.postJson<CoupleCatchVO>('/api/couple/catch/safeword/reflect', { id, reflect }),
}

/**
 * 连续互动打卡与七档解锁（streakApi，基址 /api/couple/streak）：
 * 1 个 GET /board + 1 个 POST /makeup，写接口返回整份 StreakBoardVO 前端整体替换。
 * 打卡由「双方当天都有互动」后端自动结算，前端没有「点一下打卡」这个按钮；
 * 补签只补「昨天那格」（body 是 {day}），门槛三条件已由后端 canMakeup 位算好，前端不再自拼。
 */
export const streakApi = {
  /** 打卡看板（今天日期/连击/最长/已确认天数/七档进度/近 14 格打卡条/补签额度与余额） */
  streakBoard: () => http.get<CoupleStreakBoardVO>('/api/couple/streak/board'),
  /** 补签某一天（day 为 yyyy-MM-dd；扣心动值、本月额度用尽或余额不足后端 400），返回整份看板 */
  streakMakeup: (day: string) => http.postJson<CoupleStreakBoardVO>('/api/couple/streak/makeup', { day }),
}

/**
 * 每日一问（questionApi，基址 /api/couple/question）：
 * 1 个 GET /today + 1 个 POST /answer（都返回整份 TodayVO）+ 1 个 GET /history。
 * 题目由后端按天定题，两人各答各的；答完之前都看不到 TA 的答案，bothAnswered 才是解锁位。
 */
export const questionApi = {
  /** 今天这一问 + 我的作答 + 对方答案（双方都答了才下发） */
  questionToday: () => http.get<CoupleQuestionTodayVO>('/api/couple/question/today'),
  /** 答今天这一问（可改写自己的答案；超 answerMax 字后端 400），返回整份 TodayVO */
  questionAnswer: (answer: string) =>
    http.postJson<CoupleQuestionTodayVO>('/api/couple/question/answer', { answer }),
  /** 回看最近 N 天的一问一答（1-90，后端默认 14），按 day 倒序 */
  questionHistory: (days = 14) =>
    http.get<CoupleQuestionHistoryVO>(`/api/couple/question/history?days=${days}`),
}

/**
 * 愿望清单（wishApi，基址 /api/couple/wish）：1 个 GET /board + 6 个 POST，写接口一律返回整份
 * WishBoardVO 前端整体替换。可准备/可兑现这些闸门全在后端（preparableFlag/canFulfillFlag），
 * 前端照位渲染即可；条数超 limit、标题/备注超 titleMax/noteMax 都是后端 400 直透。
 */
export const wishApi = {
  /** 清单看板（open/prepared/fulfilled 三档 + 未完成数 + 上限与字数闸门） */
  wishBoard: () => http.get<CoupleWishBoardVO>('/api/couple/wish/board'),
  /** 许一条愿望（ownerUsername 是为谁许的；title 必填 ≤titleMax，note 可空） */
  wishAdd: (title: string, note: string | null, ownerUsername: string) =>
    http.postJson<CoupleWishBoardVO>('/api/couple/wish/add', { title, note, ownerUsername }),
  wishPrepare: (id: string) => http.postJson<CoupleWishBoardVO>('/api/couple/wish/prepare', { id }),
  wishUnprepare: (id: string) => http.postJson<CoupleWishBoardVO>('/api/couple/wish/unprepare', { id }),
  /** 兑现一条（只有被许的那位能点，后端 400 直透） */
  wishFulfill: (id: string) => http.postJson<CoupleWishBoardVO>('/api/couple/wish/fulfill', { id }),
  /** 改一条愿望的备注（note 可空串=清掉） */
  wishNote: (id: string, note: string | null) => http.postJson<CoupleWishBoardVO>('/api/couple/wish/note', { id, note }),
  wishRemove: (id: string) => http.postJson<CoupleWishBoardVO>('/api/couple/wish/remove', { id }),
}

/**
 * 百日隐藏回顾页（memoryApi，基址 /api/couple/memory）：只有 1 个 GET /page，整页一次拉齐。
 * 这份是只读聚合，没有写接口；unlockedDay 为 null 表示百日档还没达成（页面「还没到」态）。
 */
export const memoryApi = {
  memoryPage: () => http.get<CoupleMemoryVO>('/api/couple/memory/page'),
}

import { http } from './http'
import type {
  CoupleIntimacyVO,
  CoupleInviteVO,
  CoupleOverview,
  CoupleRelationshipVO,
  CoupleSpaceTheme,
  CoupleSpaceVO,
  CoupleStreakBoardVO,
  CoupleQuestionTodayVO,
  CoupleWishBoardVO,
  CouplePeriodBoardVO,
  CoupleIntimateBoardVO,
  CoupleCalendarVO,
  CoupleIntimateKind,
} from '@/types'

/**
 * 情侣空间接口：邀请建立 → 空间本体（日子/宣言/主题/爱称）→ 心动值 + 三张功能卡。
 *
 * 2026-10-05 二轮裁剪（后端 docs/adr/0010-couple-trim-to-v8-features.md）：产品只留 邀请建立空间 / 每日一问 /
 * 愿望清单 / 连续互动打卡+六档解锁 四件事，44 个端点与 30 个 WS 事件随之下线（70→25）；
 * 2026-10-20 四轮再删问答回看与愿望改备注（→20），随后新增经期记录 4 个端点（→24）、
 * 亲密记录 3 个端点（→27）与亲密日历整月读口 1 个端点（→28）。
 * 判据不变——本文件的每个方法都对应后端一个存活的 `@*Mapping`，别把已下线的端点再写回来。
 */
export const coupleApi = {
  overview: () => http.get<CoupleOverview>('/api/couple/overview'),

  // ---------- 建立流程与空间本体 ----------
  invite: (username: string, message?: string) =>
    http.postJson<CoupleInviteVO>('/api/couple/invites', { username, message: message ?? null }),
  acceptInvite: (id: string) => http.postJson<CoupleSpaceVO>(`/api/couple/invites/${id}/accept`, {}),
  rejectInvite: (id: string) => http.postJson<void>(`/api/couple/invites/${id}/reject`, {}),
  cancelInvite: (id: string) => http.delete<void>(`/api/couple/invites/${id}`),
  /** 在一起纪念日（yyyy-MM-dd）：唯一的日子，纪念日倒数提醒也按它算 */
  setAnniversary: (date: string) => http.putJson<CoupleSpaceVO>('/api/couple/anniversary', { date }),
  dissolve: () => http.postJson<void>('/api/couple/dissolve', {}),
  /**
   * 空间个性化：宣言 / 主题 / 给 TA 的爱称。
   * ⚠️ 爱称只有这一条通道（独立的 `PUT /couple/bond/pet-name` 已随贴贴卡下线），
   * 三个字段都是 null = 不改该项、空串 = 清除该项。
   */
  updateProfile: (body: { slogan?: string | null; theme?: CoupleSpaceTheme | null; petName?: string | null }) =>
    http.putJson<CoupleSpaceVO>('/api/couple/profile', {
      slogan: body.slogan ?? null,
      theme: body.theme ?? null,
      petName: body.petName ?? null,
    }),

  // ---------- 心动值与恋爱等级 ----------
  intimacy: () => http.get<CoupleIntimacyVO>('/api/couple/intimacy'),

  // ---------- 旁支读取 ----------
  /** F44 恋爱中徽章：某人是否在恋爱中 + 天数（仅其好友可查） */
  relationshipOf: (username: string) =>
    http.get<CoupleRelationshipVO>(`/api/couple/relationship-of/${encodeURIComponent(username)}`),
}

// ============ 连续互动打卡与六档解锁 ============

/**
 * 连续互动打卡与六档解锁（streakApi，基址 /api/couple/streak）：
 * 1 个 GET /board + 1 个 POST /makeup，写接口返回整份 StreakBoardVO 前端整体替换。
 * 打卡口径只有一条——**双方当天都答完每日一问**（贴贴卡下线后由 CoupleQuestionService 结算），
 * 前端没有「点一下打卡」这个按钮；补签门槛已由后端 canMakeup 位算好，前端不再自拼。
 * ⚠️ 补签不再花积分（台账随愿望券本一起删了），稀缺性只剩「7 天窗口 + 每自然月 3 次」。
 */
export const streakApi = {
  /** 打卡看板（今天日期/连击/最长/已确认天数/六档进度/近 21 格打卡条/补签窗口与本月额度） */
  streakBoard: () => http.get<CoupleStreakBoardVO>('/api/couple/streak/board'),
  /** 补签某一天（day 为 yyyy-MM-dd；超出 7 天窗口、本月满 3 次或那天已打卡，后端 400），返回整份看板 */
  streakMakeup: (day: string) => http.postJson<CoupleStreakBoardVO>('/api/couple/streak/makeup', { day }),
}

/**
 * 每日一问（questionApi，基址 /api/couple/question）：1 个 GET /today + 1 个 POST /answer。
 * 题目由后端按天定题，两人各答各的；答完之前都看不到 TA 的答案，bothAnswered 才是解锁位。
 */
export const questionApi = {
  /** 今天这一问 + 我的作答 + 对方答案（双方都答了才下发） */
  questionToday: () => http.get<CoupleQuestionTodayVO>('/api/couple/question/today'),
  /** 答今天这一问（可改写自己的答案；超 answerMax 字后端 400），返回整份 TodayVO */
  questionAnswer: (answer: string) =>
    http.postJson<CoupleQuestionTodayVO>('/api/couple/question/answer', { answer }),
}

/**
 * 愿望清单（wishApi，基址 /api/couple/wish）：1 个 GET /board + 5 个 POST，写接口一律返回整份
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
  wishRemove: (id: string) => http.postJson<CoupleWishBoardVO>('/api/couple/wish/remove', { id }),
}

/**
 * 经期记录（periodApi，基址 /api/couple/period）：1 个 GET /board + 3 个 POST，
 * 写接口一律返回整份 PeriodBoardVO 前端整体替换。
 * 平均周期与下次预计都由后端读时算好（averageCycleDays/predictedNextDay/daysUntilNext），
 * 前端只负责显示「按记录推算」，不自己数天数、也不做任何健康判断。
 */
export const periodApi = {
  /** 经期看板（全部记录 + 平均周期 + 下次预计） */
  periodBoard: () => http.get<CouplePeriodBoardVO>('/api/couple/period/board'),
  /** 记一个开始日（yyyy-MM-dd，不能是将来；同一天重复记后端 400） */
  periodAdd: (startDay: string) => http.postJson<CouplePeriodBoardVO>('/api/couple/period/add', { startDay }),
  /** 给还没结束的那次补上今天的结束日 */
  periodEnd: (id: string) => http.postJson<CouplePeriodBoardVO>('/api/couple/period/end', { id }),
  /** 删掉一条错记（双方都能删） */
  periodRemove: (id: string) => http.postJson<CouplePeriodBoardVO>('/api/couple/period/remove', { id }),
}

/**
 * 亲密记录（intimateApi，基址 /api/couple/intimate）：1 个 GET /board + 2 个 POST，
 * 写接口一律返回整份 IntimateBoardVO 前端整体替换。
 * EDGE=边缘亲昵、SEX=性生活，同一天允许多条；本月/累计次数全由后端算好，前端只显示。
 * 看板只有最近 30 条，翻不到历史月份——按月的日历视图另走下面的 calendarApi。
 * 这条链路没有 WS 事件——私密账本不因对方操作弹提醒。
 */
export const intimateApi = {
  /** 亲密看板（最近 30 条 + 最近一次 + 本月/累计次数） */
  intimateBoard: () => http.get<CoupleIntimateBoardVO>('/api/couple/intimate/board'),
  /** 记一笔（day=yyyy-MM-dd 且不能是将来；kind=EDGE|SEX；note 选填 ≤60 字） */
  intimateAdd: (day: string, kind: CoupleIntimateKind, note: string | null) =>
    http.postJson<CoupleIntimateBoardVO>('/api/couple/intimate/add', { day, kind, note }),
  /** 删掉一笔错记（双方都能删） */
  intimateRemove: (id: string) => http.postJson<CoupleIntimateBoardVO>('/api/couple/intimate/remove', { id }),
}

/**
 * 亲密日历（calendarApi，基址 /api/couple/calendar）：只有一个月度读口。
 * 后端把经期的覆盖日/开始日/结束日、预计下次与本月的亲密标记一次算齐——
 * 日历若自己去拼两张卡的看板，同一页会打两次 /period/board 并留下两份经期真相。
 */
export const calendarApi = {
  /** 整月日历；month=yyyy-MM，格式错后端 400，没建空间 404 */
  calendarMonth: (month: string) =>
    http.get<CoupleCalendarVO>(`/api/couple/calendar/month?month=${encodeURIComponent(month)}`),
}

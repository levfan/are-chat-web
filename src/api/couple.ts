import { http } from './http'
import type {
  CoupleAdminStatsVO,
  CoupleIntimacyVO,
  CoupleInviteVO,
  CoupleOverview,
  CoupleNotifyListVO,
  CoupleRelationshipVO,
  CoupleSpaceTheme,
  CoupleSpaceVO,
  CoupleStreakBoardVO,
  CoupleQuestionTodayVO,
  CoupleQuestionHistoryVO,
  CoupleWishBoardVO,
  CoupleMemoryVO,
} from '@/types'

/**
 * 情侣空间接口：邀请建立 → 空间本体（日子/宣言/主题/爱称）→ 心动值 + 四张功能卡。
 *
 * 2026-10-05 二轮裁剪（后端 docs/adr/0010-couple-trim-to-v8-features.md）：产品只留 邀请建立空间 / 每日一问 /
 * 愿望清单 / 连续互动打卡+七档解锁 四件事，44 个端点与 30 个 WS 事件随之下线（70→26、44→14）。
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

  // ---------- 通知中心 ----------
  notifyMine: () => http.get<CoupleNotifyListVO>('/api/couple/notify'),
  /** F41 全部标记已读 */
  notifyReadAll: () => http.postJson<void>('/api/couple/notify/read-all', {}),

  // ---------- 旁支读取 ----------
  /** F44 恋爱中徽章：某人是否在恋爱中 + 天数（仅其好友可查） */
  relationshipOf: (username: string) =>
    http.get<CoupleRelationshipVO>(`/api/couple/relationship-of/${encodeURIComponent(username)}`),
  /** F45 管理看板：情侣空间运营统计（仅管理员） */
  adminCoupleStats: () => http.get<CoupleAdminStatsVO>('/api/couple/admin/stats'),
}

// ============ 连续互动打卡与七档解锁 ============

/**
 * 连续互动打卡与七档解锁（streakApi，基址 /api/couple/streak）：
 * 1 个 GET /board + 1 个 POST /makeup，写接口返回整份 StreakBoardVO 前端整体替换。
 * 打卡口径只有一条——**双方当天都答完每日一问**（贴贴卡下线后由 CoupleQuestionService 结算），
 * 前端没有「点一下打卡」这个按钮；补签门槛已由后端 canMakeup 位算好，前端不再自拼。
 * ⚠️ 补签不再花积分（台账随愿望券本一起删了），稀缺性只剩「7 天窗口 + 每自然月 3 次」。
 */
export const streakApi = {
  /** 打卡看板（今天日期/连击/最长/已确认天数/七档进度/近 21 格打卡条/补签窗口与本月额度） */
  streakBoard: () => http.get<CoupleStreakBoardVO>('/api/couple/streak/board'),
  /** 补签某一天（day 为 yyyy-MM-dd；超出 7 天窗口、本月满 3 次或那天已打卡，后端 400），返回整份看板 */
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

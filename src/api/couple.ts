import { http } from './http'
import type {
  CoupleInviteVO,
  CoupleOverview,
  CoupleRelationshipVO,
  CoupleSpaceVO,
  CoupleCalendarVO,
  CoupleIntimateKind,
} from '@/types'

/**
 * 情侣空间接口：邀请建立 → 空间本体（在一起的日子）→ 亲密日历。
 *
 * 2026-10-20 三轮裁剪（用户指令「保留在一起天数、纪念日、日历记录，其它功能都不要了」）：
 * 每日一问、连续互动打卡与六档解锁、愿望清单三张卡连同它们供养的心动值、空间个性化
 * （宣言/主题/爱称）一起下线，couple 侧端点 26→14。
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
  /** 在一起纪念日（yyyy-MM-dd）：在一起天数与纪念日倒数提醒共同的起点 */
  setAnniversary: (date: string) => http.putJson<CoupleSpaceVO>('/api/couple/anniversary', { date }),
  dissolve: () => http.postJson<void>('/api/couple/dissolve', {}),

  // ---------- 旁支读取 ----------
  /** F44 恋爱中徽章：某人是否在恋爱中 + 天数（仅其好友可查） */
  relationshipOf: (username: string) =>
    http.get<CoupleRelationshipVO>(`/api/couple/relationship-of/${encodeURIComponent(username)}`),
}

/**
 * 经期记录的写口（periodApi，基址 /api/couple/period）：3 个 POST，都只回成功与否。
 * 展示数据统一由 calendarApi 的月历下发，写完由日历按当前可见月重拉一次；
 * 平均周期与下次预计都由后端读时算好，前端只显示「按记录推算」，不自己数天数、也不做任何健康判断。
 */
export const periodApi = {
  /** 记一个开始日（yyyy-MM-dd，不能是将来；同一天重复记后端 400） */
  periodAdd: (startDay: string) => http.postJson<void>('/api/couple/period/add', { startDay }),
  /** 给某次还没结束的经期补上今天的结束日（后端只认今天，历史区间改不了） */
  periodEnd: (id: string) => http.postJson<void>('/api/couple/period/end', { id }),
  /** 删掉一条错记（双方都能删） */
  periodRemove: (id: string) => http.postJson<void>('/api/couple/period/remove', { id }),
}

/**
 * 亲密记录的写口（intimateApi，基址 /api/couple/intimate）：2 个 POST，都只回成功与否。
 * EDGE=边缘亲昵、SEX=性生活，同一天允许多条；累计次数由后端算好，前端只显示。
 * 这条链路没有 WS 事件——私密账本不因对方操作弹提醒。
 */
export const intimateApi = {
  /** 记一笔（day=yyyy-MM-dd 且不能是将来；kind=EDGE|SEX；note 选填 ≤60 字） */
  intimateAdd: (day: string, kind: CoupleIntimateKind, note: string | null) =>
    http.postJson<void>('/api/couple/intimate/add', { day, kind, note }),
  /** 删掉一笔错记（双方都能删） */
  intimateRemove: (id: string) => http.postJson<void>('/api/couple/intimate/remove', { id }),
}

/**
 * 亲密日历（calendarApi，基址 /api/couple/calendar）：只有一个月度读口，也是唯一的记录入口。
 * 后端把经期的覆盖日/开始日/结束日、本月经期区间、周期统计与本月的亲密标记一次算齐，
 * 日历因此只需要这一个读口；写口（periodApi / intimateApi）都不回数据，写完重拉这里。
 */
export const calendarApi = {
  /** 整月日历；month=yyyy-MM，格式错后端 400，没建空间 404 */
  calendarMonth: (month: string) =>
    http.get<CoupleCalendarVO>(`/api/couple/calendar/month?month=${encodeURIComponent(month)}`),
}

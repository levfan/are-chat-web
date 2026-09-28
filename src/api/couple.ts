import { http } from './http'
import type {
  CoupleActionKind,
  CoupleActionVO,
  CoupleAnniversaryVO,
  CoupleBondStatsVO,
  CoupleCheckinStateVO,
  CoupleCheckinKind,
  CoupleCityCardVO,
  CoupleFundVO,
  CoupleIntimacyVO,
  CoupleInviteVO,
  CoupleItemVO,
  CoupleLetterVO,
  CoupleMoodDayVO,
  CoupleMoodKind,
  CoupleMoodReactionKind,
  CoupleMoodReactionVO,
  CoupleMoodVO,
  CoupleOverview,
  CouplePactVO,
  CouplePromiseVO,
  CoupleQuestionHistoryVO,
  CoupleQuestionVO,
  CoupleSpaceVO,
  CoupleTimelineDay,
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
  createAnniversary: (body: { title: string; date: string; yearly: boolean }) =>
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
}

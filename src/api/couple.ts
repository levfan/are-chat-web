import { http } from './http'
import type {
  CoupleAnniversaryVO,
  CoupleCheckinStateVO,
  CoupleCheckinKind,
  CoupleInviteVO,
  CoupleItemVO,
  CoupleOverview,
  CouplePromiseVO,
  CoupleQuestionVO,
  CoupleSpaceVO,
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
}

import { http } from './http'
import type {
  FriendRequestVO,
  FriendSuggestion,
  FriendVO,
  ImMessage,
  ImMsgType,
  ImStarVO,
  StatsVO,
  UserProfileVO,
} from '@/types'

function enc(value: string) {
  return encodeURIComponent(value)
}

export const friendApi = {
  list: () => http.get<FriendVO[]>('/api/friends'),
  /** 加好友联想：按输入返回候选用户名与已有关系 */
  suggest: (q: string) => http.get<FriendSuggestion[]>(`/api/friends/suggest?q=${enc(q)}`),
  apply: (username: string, message?: string) =>
    http.postJson<FriendRequestVO>('/api/friends/requests', { username, message: message ?? null }),
  incoming: () => http.get<FriendRequestVO[]>('/api/friends/requests/incoming'),
  outgoing: () => http.get<FriendRequestVO[]>('/api/friends/requests/outgoing'),
  accept: (id: string) => http.postJson<void>(`/api/friends/requests/${id}/accept`, {}),
  reject: (id: string) => http.postJson<void>(`/api/friends/requests/${id}/reject`, {}),
  update: (id: string, patch: { remark?: string; pinned?: boolean; muted?: boolean; tag?: string; blocked?: boolean }) =>
    http.putJson<void>(`/api/friends/${id}`, patch),
  remove: (id: string) => http.delete<void>(`/api/friends/${id}`),
}

export const messageApi = {
  history: (peer: string, before?: number, limit = 20) => {
    const params = new URLSearchParams()
    if (before) params.set('before', String(before))
    params.set('limit', String(limit))
    return http.get<ImMessage[]>(`/api/messages/${enc(peer)}?${params.toString()}`)
  },
  send: (peer: string, content: string, type: ImMsgType = 'text', replyToId?: string | null) =>
    http.postJson<ImMessage>(`/api/messages/${enc(peer)}`, { content, type, replyToId: replyToId ?? null }),
  markRead: (peer: string) => http.postJson<void>(`/api/messages/${enc(peer)}/read`, {}),
  recall: (msgId: string) => http.postJson<void>(`/api/messages/${enc(msgId)}/recall`, {}),
  search: (peer: string, q: string) => http.get<ImMessage[]>(`/api/messages/${enc(peer)}/search?q=${enc(q)}`),
  /** 56 导出当前会话全部消息（JSON） */
  exportConversation: (peer: string) => http.get<ImMessage[]>(`/api/messages/${enc(peer)}/export`),
  edit: (msgId: string, content: string) => http.putJson<ImMessage>(`/api/messages/${enc(msgId)}`, { content }),
  toggleReaction: (msgId: string, emoji: string) =>
    http.postJson<void>(`/api/messages/${enc(msgId)}/reactions`, { emoji }),
  toggleStar: (msgId: string) => http.postJson<void>(`/api/messages/${enc(msgId)}/star`, {}),
}

export const starsApi = {
  list: () => http.get<ImStarVO[]>('/api/stars'),
}

/** 55 会话统计 */
export const statsApi = {
  me: () => http.get<StatsVO>('/api/stats/me'),
}

export const profileApi = {
  me: () => http.get<UserProfileVO>('/api/profile'),
  of: (username: string) => http.get<UserProfileVO>(`/api/profile/${enc(username)}`),
  update: (patch: { nickname?: string; signature?: string; avatar?: string; presenceStatus?: string }) =>
    http.putJson<UserProfileVO>('/api/profile', patch),
}

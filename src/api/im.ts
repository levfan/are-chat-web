import { http } from './http'
import type {
  AttachmentVO,
  FriendBirthdayVO,
  FriendRequestVO,
  FriendSuggestion,
  FriendVO,
  GlobalSearchHit,
  ImMessage,
  ImMsgType,
  ImStarVO,
  PinVO,
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
  /** 81 全局消息搜索：跨会话搜文本消息 */
  searchGlobal: (q: string) => http.get<GlobalSearchHit[]>(`/api/messages/search/global?q=${enc(q)}`),
  /** 84 会话内置顶消息 */
  pin: (peer: string, msgId: string) => http.postJson<PinVO>(`/api/messages/${enc(peer)}/pin`, { msgId }),
  unpin: (peer: string) => http.delete<void>(`/api/messages/${enc(peer)}/pin`),
  currentPin: (peer: string) => http.get<PinVO | null>(`/api/messages/${enc(peer)}/pin`),
  /** 85 清空当前会话全部聊天记录（后端会删除双方消息） */
  clear: (peer: string) => http.delete<{ deleted: number }>(`/api/messages/${enc(peer)}`),
  /** 95 会话附件：type=image|file */
  attachments: (peer: string, type: 'image' | 'file' = 'image') =>
    http.get<AttachmentVO[]>(`/api/messages/${enc(peer)}/attachments?type=${type}`),
  /** F36 心动时刻标记/取消标记 */
  markHeart: (msgId: string, hearted: boolean) =>
    http.postJson<ImMessage>(`/api/messages/${enc(msgId)}/heart`, { hearted }),
  /** F36 心动时刻列表（peer 可选：限定与某人的会话） */
  heartMoments: (peer?: string) =>
    http.get<ImMessage[]>(peer ? `/api/messages/hearts?peer=${enc(peer)}` : '/api/messages/hearts'),
}

export const starsApi = {
  list: () => http.get<ImStarVO[]>('/api/stars'),
}

export const profileApi = {
  me: () => http.get<UserProfileVO>('/api/profile'),
  of: (username: string) => http.get<UserProfileVO>(`/api/profile/${enc(username)}`),
  update: (patch: { nickname?: string; signature?: string; avatar?: string; presenceStatus?: string; birthday?: string | null }) =>
    http.putJson<UserProfileVO>('/api/profile', patch),
  /** F42 好友生日列表（按今年剩余天数升序，今天生日的排最前） */
  friendsBirthdays: () => http.get<FriendBirthdayVO[]>('/api/profile/friends-birthdays'),
}

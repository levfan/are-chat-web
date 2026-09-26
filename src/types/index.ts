export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface LoginResult {
  username: string
  greeting: string
  /** 昵称（注册时与用户名一致，可在个人中心修改） */
  nickname?: string
  /** 脱敏手机号（138****0001） */
  phone?: string
  /** 53 登录会话信息：本次登录时间（/api/auth/me 返回） */
  loginAt?: number | null
  /** 53 服务器当前时间 */
  serverTime?: number | null
  /** 77 角色：USER / ADMIN（管理员可进入管理后台） */
  role?: 'USER' | 'ADMIN'
}

/** 77 注册申请提交结果：不再直接登录，等待管理员审批 */
export interface RegisterResult {
  applicationId: string
  username: string
  /** 注册时提交的昵称 */
  nickname?: string | null
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  hint: string
}

/** 77 注册审批进度 */
export interface ApplicationStatusVO {
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  rejectReason?: string | null
  created?: number | null
  reviewedAt?: number | null
}

// ============ 79 管理后台 ============

export interface AdminApplicationVO {
  id: string
  username: string
  /** 注册时填写的昵称（选填，不填则审批后与用户名一致） */
  nickname?: string | null
  phone: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  rejectReason?: string | null
  created: number
  reviewedAt?: number | null
  reviewedBy?: string | null
}

export interface AdminUserVO {
  username: string
  phone: string
  nickname?: string | null
  status: 'ACTIVE' | 'DISABLED' | 'CLOSED'
  role: 'USER' | 'ADMIN'
  created?: number | null
  lastLoginAt?: number | null
}

export interface AdminAuditVO {
  id: string
  actor: string
  action: string
  target: string
  detail: string
  created: number
}

/** 88 全站公告 */
export interface AnnouncementVO {
  id: string
  content: string
  createdBy: string
  created: number
  read: boolean
}

/** 88 管理端公告列表项（含 enabled 开关） */
export interface AdminAnnouncementVO {
  id: string
  content: string
  createdBy: string
  enabled: boolean
  created: number
}

/** 注册短信验证码（演示环境直接回显 devCode） */
export interface SmsResult {
  phone: string
  expiresInSeconds: number
  devCode: string
  hint: string
}

export interface UploadedFileInfo {
  id: string
  originalName: string
  contentType: string | null
  size: number
  sha256: string
  deduplicated: boolean
  downloadUrl: string
  uploadedAt: number | null
}

// ============ IM 好友/私聊 ============

/** 在线状态（用户资料里保存）：online 在线 / busy 忙碌 / away 离开 */
export type PresenceStatus = 'online' | 'busy' | 'away'

export interface FriendVO {
  id: string
  username: string
  /** 对方昵称（来自 user_profile），展示优先级：备注 > 昵称 > 用户名 */
  nickname?: string | null
  remark: string
  tag: string
  pinned: boolean
  muted: boolean
  blocked: boolean
  online: boolean
  status: PresenceStatus
  lastSeenAt: number | null
  unread: number
  lastMessage: MessagePreview | null
}

export interface MessagePreview {
  content: string
  msgType: string
  created: number
  fromMe: boolean
}

export interface FriendRequestVO {
  id: string
  fromUser: string
  toUser: string
  message: string
  status: string
  created: number
}

/** 加好友联想候选（/api/friends/suggest）：与当前用户的关系 */
export type FriendRelation = 'available' | 'friend' | 'pending-out' | 'pending-in'

export interface FriendSuggestion {
  username: string
  /** 脱敏手机号，便于同名时区分 */
  phone?: string
  relation: FriendRelation
}

export type ImMsgType = 'text' | 'image' | 'poke' | 'system' | 'card' | 'location' | 'file'
/** SENDING/FAILED 仅存在于本地：发送中 / 发送失败待重试 */
export type ImMsgStatus = 'SENT' | 'RECALLED' | 'FAILED' | 'SENDING'

/** 72 好友名片卡片消息的 content（JSON 字符串） */
export interface FriendCardPayload {
  username: string
  nickname: string
  signature: string
  avatar: string
}

/** 73 位置分享卡片消息的 content（JSON 字符串） */
export interface LocationPayload {
  name: string
  address: string
}

/** 82 文件消息的 content（JSON 字符串） */
export interface FilePayload {
  name: string
  size: number
  url: string
}

/** 81 全局消息搜索命中 */
export interface GlobalSearchHit {
  id: string
  peer: string
  content: string
  fromUser: string
  created: number
}

/** 84 会话内置顶消息 */
export interface PinVO {
  msgId: string
  createdBy: string
}

/** 95 会话附件条目 */
export interface AttachmentVO {
  id: string
  name: string
  size: number
  url: string
  fromUser: string
  created: number
}

/** 70 新消息浮动卡片条目 */
export interface ToastItem {
  id: number
  peer: string
  name: string
  body: string
  avatar: string
}

export interface ImReaction {
  username: string
  emoji: string
}

export interface ImMessage {
  id: string
  fromUser: string
  toUser: string
  content: string
  msgType: ImMsgType
  status: ImMsgStatus
  replyToId: string | null
  /** 我发出的消息是否已被对方读取（已读回执） */
  read?: boolean
  /** 发送后编辑过 */
  edited?: boolean
  /** 我是否收藏了这条消息 */
  starred?: boolean
  /** 消息表情回应 */
  reactions?: ImReaction[]
  created: number
}

/** 收藏夹条目 */
export interface ImStarVO {
  msgId: string
  peer: string
  content: string
  msgType: string
  status: string
  created: number
}

/** 57 全站在线信息 */
export interface OnlineVO {
  onlineCount: number
  users: string[]
}

/** 59 系统健康检查 */
export interface HealthVO {
  status: string
  uptimeSeconds: number
  onlineCount: number
  version: string
  serverTime: number
}

export interface UserProfileVO {
  username: string
  nickname: string
  signature: string
  avatar: string
  presenceStatus: PresenceStatus
}

/** 服务端通过 WebSocket 推送的 IM 事件 */
export type ImPushMessage =
  | { type: 'dm'; msgId: string; from: string; to: string; content: string; msgType: string; replyToId: string | null; edited?: boolean; created: number }
  | { type: 'typing'; from: string; to: string; typing: boolean }
  | { type: 'recall'; from: string; to: string; msgId: string }
  | { type: 'read'; reader: string; peer: string }
  | { type: 'reaction'; msgId: string; by: string; emoji: string; added: boolean; from: string; to: string }
  | { type: 'message-edit'; msgId: string; from: string; to: string; content: string }
  | { type: 'presence'; name: string; msg: string }
  | { type: 'friend-request'; username: string; requestId: string }
  | { type: 'friend-accepted'; username: string; requestId: string }
  | { type: 'friend-deleted'; username: string; requestId: string }
  /** 84 会话置顶变化（msgId 为空表示取消置顶） */
  | { type: 'pin'; peerA: string; peerB: string; msgId: string | null; pinned: boolean }
  /** 88 全站公告 */
  | { type: 'announcement'; announcementId: string; content: string }
  /** 78 管理员待办（新注册申请） */
  | { type: 'admin-pending'; pendingCount: number }
  /** 情侣空间事件（username 为动作发起方，接收方视角即「TA」） */
  | CouplePushMessage

export interface CouplePushMessage {
  type: 'couple'
  event: string
  username: string
  detail: string
}

// ============ 情侣空间 ============

/** 情侣邀请状态 */
export type CoupleInviteStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELED'

export interface CoupleInviteVO {
  id: string
  fromUser: string
  toUser: string
  message: string
  status: CoupleInviteStatus
  created: number
}

export interface CouplePartnerVO {
  username: string
  nickname: string
  avatar: string
  online: boolean
}

export interface CoupleSpaceVO {
  id: string
  partner: CouplePartnerVO
  created: number
  /** 在一起纪念日（yyyy-MM-dd，空则按 created 计算） */
  anniversary: string | null
  /** 在一起天数（建立当天 = 第 1 天） */
  days: number
}

export interface CoupleCheckinHalf {
  morning: boolean
  night: boolean
}

export interface CoupleCheckinStateVO {
  me: CoupleCheckinHalf
  partner: CoupleCheckinHalf
  /** 连续互道晚安天数 */
  streak: number
}

export interface CoupleOverview {
  space: CoupleSpaceVO | null
  /** 收到的全部待处理邀请（可能同时被多人邀请，新→旧） */
  incoming: CoupleInviteVO[]
  /** 发出的全部待处理邀请（新→旧） */
  outgoing: CoupleInviteVO[]
  checkins: CoupleCheckinStateVO | null
  /** 我还没兑现的逾期约定数（「还有 N 件事你没做到哦~」提醒条） */
  overdueCount: number
}

export interface CouplePromiseVO {
  id: string
  /** 承诺人（答应做事的一方） */
  promiser: string
  /** 受益人（被承诺的一方） */
  creditor: string
  content: string
  dueAt: number | null
  status: 'PENDING' | 'DONE'
  doneAt: number | null
  overdue: boolean
  created: number
}

export interface CoupleQuestionVO {
  day: string
  question: string
  myAnswer: string | null
  partnerAnswer: string | null
}

export type CoupleCheckinKind = 'MORNING' | 'NIGHT'
export type CoupleItemKind = 'MOVIE' | 'FOOD' | 'TRIP' | 'TODO'

export interface CoupleItemVO {
  id: string
  kind: CoupleItemKind
  title: string
  note: string
  dueDate: string | null
  done: boolean
  doneBy: string | null
  doneAt: number | null
  createdBy: string
  created: number
}

export interface CoupleAnniversaryVO {
  id: string
  title: string
  date: string
  yearly: boolean
  createdBy: string
  created: number
}

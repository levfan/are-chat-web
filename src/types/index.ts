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
  /** F36 心动时刻标记时间（毫秒，null/undefined = 未标记） */
  heartAt?: number | null
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
  /** F42 生日（yyyy-MM-dd 或 MM-dd，null = 未填写） */
  birthday?: string | null
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
  /** 我给 TA 起的专属爱称（空 = 没起，展示时回退昵称） */
  petName: string | null
}

export type CoupleSpaceTheme = 'classic' | 'cherry' | 'ocean' | 'forest' | 'night'

export interface CoupleSpaceVO {
  id: string
  partner: CouplePartnerVO
  created: number
  /** 在一起纪念日（yyyy-MM-dd，空则按 created 计算） */
  anniversary: string | null
  /** 在一起天数（建立当天 = 第 1 天） */
  days: number
  /** 我们的宣言（只有彼此懂的一句话，可空） */
  slogan: string | null
  /** 空间主题（classic/cherry/ocean/forest/night） */
  theme: CoupleSpaceTheme
  /** 贴纸墙佩戴的贴纸 key（逗号分隔，可空） */
  stickers: string | null
}

export interface CoupleCheckinHalf {
  morning: boolean
  night: boolean
}

export interface CoupleOverview {
  space: CoupleSpaceVO | null
  /** 收到的全部待处理邀请（可能同时被多人邀请，新→旧） */
  incoming: CoupleInviteVO[]
  /** 发出的全部待处理邀请（新→旧） */
  outgoing: CoupleInviteVO[]
  /** 今天我这边的心情（没记录为 null）——首页「TA 今天怎么样」的唯一即时信号 */
  todayMine: CoupleMoodVO | null
  /** 今天对方那边的心情（没记录为 null） */
  todayPartner: CoupleMoodVO | null
}
export type CoupleItemKind = 'MOVIE' | 'FOOD' | 'TRIP' | 'TODO'

export interface CoupleAnniversaryVO {
  id: string
  title: string
  date: string
  yearly: boolean
  /** F127 大日子类型：NORMAL / LOVE / FAMILY / FRIEND / WORK */
  kind: string
  createdBy: string
  created: number
}

// ============ 情侣空间：心情日记 / 时光轴 / 心动值 ============

/** 心情键（后端白名单，共 8 种） */
export type CoupleMoodKind = 'LOVE' | 'HAPPY' | 'CALM' | 'BUSY' | 'TIRED' | 'SICK' | 'SAD' | 'ANGRY'

export interface CoupleMoodVO {
  id: string
  username: string
  moodDay: string
  mood: CoupleMoodKind
  note: string
  /** 后端 record 的字段名是 createdAt（契约比对脚本抓出来的旧笔误，前端原先写成 created） */
  createdAt: number
  updatedAt: number | null
}

/** 一天里双方的心情（谁没记录就是 null） */
export interface CoupleMoodDayVO {
  day: string
  mine: CoupleMoodVO | null
  partner: CoupleMoodVO | null
}

/** 时光轴事件：type = space/ritual/question/promise/item/anniversary */
export interface CoupleTimelineEvent {
  type: 'space' | 'ritual' | 'question' | 'promise' | 'item' | 'anniversary'
  title: string
  detail: string
  byUser: string | null
  at: number | null
}

/** 心动值明细 */
/** 心动值明细：六项全部来自保留的 10 张卡（早晚安/每日一问/约定/清单 已随功能下线）。 */
export interface CoupleIntimacyBreakdown {
  moodDays: number
  bondDays: number
  deedCount: number
  lampCount: number
  reflectCount: number
  pointEarned: number
}

export interface CoupleIntimacyVO {
  score: number
  level: number
  title: string
  icon: string
  /** 下一等级所需分数，满级为 null */
  nextLevelAt: number | null
  /** 距下一级进度 0-100（满级=100） */
  levelProgress: number
  breakdown: CoupleIntimacyBreakdown
}

// ============ 情侣空间：悄悄话信箱 / 一问历史 ============

/** 信件状态 */
export type CoupleLetterStatus = 'SEALED' | 'OPENED'

export interface CoupleFundDepositVO {
  id: string
  username: string
  /** 金额（分） */
  amount: number
  note: string
  created: number
}

// ============ 情侣空间：贴贴互动 ============

/** 贴贴动作类型 */
export type CoupleActionKind =
  | 'POKE'
  | 'HUG'
  | 'KISS'
  | 'PAT'
  | 'NUZZLE'
  | 'TICKLE'
  | 'MISS'

export interface CoupleActionVO {
  id: string
  username: string
  kind: CoupleActionKind
  created: number
}

/** 单类贴贴动作统计 */
export interface CoupleKindStat {
  kind: CoupleActionKind
  emoji: string
  label: string
  total: number
  mine: number
  partner: number
  lastAt: number | null
}

export interface CoupleBondStatsVO {
  kinds: CoupleKindStat[]
  todayCount: number
  todayMine: number
  todayPartner: number
}

/** 心情回应类型 */
export type CoupleMoodReactionKind = 'HUG' | 'KISS' | 'CHEER' | 'PAT'

/** 某天双方给彼此心情的回应（谁还没回应就是 null） */
export interface CoupleMoodReactionVO {
  day: string
  myReaction: CoupleMoodReactionKind | null
  partnerReaction: CoupleMoodReactionKind | null
}

export interface CoupleTacitVO {
  id: string
  question: string
  myAnswer: string | null
  partnerAnswer: string | null
  /** WAITING 等对方 / MATCHED 默契一致 / MISS 不一致 */
  status: 'WAITING' | 'MATCHED' | 'MISS'
  created: number
  settledAt: number | null
}

/** 一侧的生理期记录（没记录就是 null） */
export interface CoupleCycleSideVO {
  username: string
  periodDay: string
  cycleDays: number
  periodDays: number
  note: string
  /** 下一次生理期开始日期（yyyy-MM-dd） */
  nextDate: string | null
  /** 距下次天数 */
  nextInDays: number | null
  inPeriod: boolean
}

// ============ 情侣空间：纪念与回忆 ============

/** 里程碑徽章（按在一起天数自动点亮） */
export interface CoupleBadgeVO {
  id: string
  title: string
  emoji: string
  targetDays: number
  achieved: boolean
  /** 0-100 */
  progress: number
}

/** 行为成就 */
export interface CoupleAchievementVO {
  id: string
  title: string
  desc: string
  emoji: string
  achieved: boolean
  current: number
  target: number
}

// ============ 情侣空间：共同生活 ============

export type CoupleExpenseCategory = 'FOOD' | 'TRANSPORT' | 'FUN' | 'HOME' | 'GIFT' | 'OTHER'

export interface CoupleExpenseVO {
  id: string
  username: string
  /** 金额（分） */
  amount: number
  category: CoupleExpenseCategory
  note: string
  spentDay: string
  created: number
}

// ============ 情侣空间：月报与总览 ============

/** 月报/总览里的单项统计 */
export interface CoupleReportItem {
  key: string
  label: string
  emoji: string
  value: number
  unit: string
}

// ============ 情侣空间：恋爱游戏化 ============

/** 今日心动加成单项 */
export interface CoupleBoostItem {
  key: string
  label: string
  emoji: string
  done: boolean
  bonus: number
  hint: string
}

/** 热力图单格：level 0-4 */
export interface CoupleHeatCell {
  day: string
  count: number
  level: number
}

/** 心情曲线单日：双方心情分 1-5（没记 = null） */
export interface CoupleMoodCurveDay {
  day: string
  mine: number | null
  partner: number | null
}

// ============ 情侣空间：通知中心 / 生日 / 关系徽章 / 管理看板 ============

/** F41 通知中心条目 */
export interface CoupleNotifyVO {
  id: string
  event: string
  /** 触发人（system = 定时任务） */
  actor: string | null
  detail: string
  read: boolean
  created: number
}

export interface CoupleNotifyListVO {
  items: CoupleNotifyVO[]
  unread: number
}

/** F42 好友生日条目：daysUntil 为今年生日的剩余天数（今天 = 0） */
export interface FriendBirthdayVO {
  username: string
  nickname: string
  birthday: string
  daysUntil: number
  today: boolean
}

/** F44 恋爱中徽章 */
export interface CoupleRelationshipVO {
  inRelationship: boolean
  days: number | null
  anniversary: string | null
}

/** F45 管理看板：情侣空间运营统计 */
export interface CoupleAdminStatsVO {
  activeSpaces: number
  dissolvedSpaces: number
  avgDays: number
  totalLetters: number
  totalActions: number
  totalPromisesDone: number
  totalCapsules: number
  spacesCreatedThisMonth: number
}

// ============ 情侣空间：惊喜与期待（F50-F59） ============

/** F50 爱情刮刮乐：每周一张来自 TA 的奖励券 */
export interface CoupleScratchVO {
  id: string
  weekKey: string
  fromUser: string
  prizeKind: string
  /** 未刮开时对收券人隐藏 */
  prizeText: string | null
  scratched: boolean
  redeemed: boolean
  scratchedAt: number | null
}

/** F51 恋爱盲盒 */
export interface CoupleBoxVO {
  id: string
  fromUser: string
  kind: 'whisper' | 'task'
  /** 未到开箱日且不是自己装的盒子，内容隐藏 */
  content: string | null
  openDay: string
  opened: boolean
  canOpen: boolean
  created: number
}

/** F53 思念速递单条 */
export interface CoupleMissVO {
  id: string
  deliverAt: number
  delivered: boolean
  deliveredAt: number | null
}

/** F55 玫瑰单条 */
export interface CoupleRoseVO {
  id: string
  fromUser: string
  flowerKey: string
  emoji: string
  word: string
  created: number
}

/** F56 幸运签单条 */
export interface CoupleSlipVO {
  id: string
  fromUser: string
  day: string
  level: string
  content: string
  created: number
}

// ============ 情侣空间：懂我与被接住（F60-F69） ============

/** F60 求抱抱条目 */
export interface CoupleComfortVO {
  id: string
  fromUser: string
  day: string
  feeling: string
  feelingLabel: string
  feelingEmoji: string
  handled: boolean
  handledNote: string | null
  handledAt: number | null
}

/** F60 求抱抱看板 */
export interface CoupleComfortBoardVO {
  mine: CoupleComfortVO | null
  partnerPending: CoupleComfortVO | null
  history: CoupleComfortVO[]
}

/** F64 情绪同步率 */
export interface CoupleMoodSyncVO {
  bothDays: number
  syncedDays: number
  syncRate: number
  todaySync: boolean
  todayMoodMine: string | null
  todayMoodPartner: string | null
  streak: number
}

/** F68 心灵感应单轮 */
export interface CoupleTelepathyRoundVO {
  id: string
  round: number
  question: string
  options: string[]
  answerA: string | null
  answerB: string | null
  settled: boolean
  matched: boolean
  mineStarted: boolean
}

/** F69 情话储蓄罐单条 */
export interface CoupleLoveBankVO {
  id: string
  content: string
  delivered: boolean
  deliveredAt: number | null
  created: number
}

// ============ 情侣空间：共同养成（F70-F79） ============

/** F70 单日挑战 */
export interface CoupleChallengeVO {
  day: string
  taskText: string
  doneMine: boolean
  donePartner: boolean
  bothDone: boolean
}

/** F71 存折流水 */
export interface CouplePassbookEntryVO {
  id: string
  fromUser: string
  day: string
  content: string
  mine: boolean
}

// ============ 情侣空间：回忆资产（F80-F89） ============

/** F80 编年史事件 */
export interface CoupleChronicleEvent {
  day: string
  type: string
  title: string
  detail: string
  icon: string
}

/** F85 报告条目 */
export interface CoupleReportItem {
  key: string
  label: string
  emoji: string
  value: number
  unit: string
}

/** F96 年度热力日历（单格） */
export interface CoupleHeatmapDayVO {
  day: string
  count: number
  level: number
}

/** F104 接龙句 */
export interface CoupleStoryLineVO {
  id: string
  chainId: string
  seq: number
  byUser: string
  content: string
  isFinal: boolean
  created: number
}

export interface CoupleRoutineOverlapVO {
  start: string
  end: string
}

// ============ 情侣空间·确定感与安全感（F120-F129） ============

export interface CoupleSecurityItemVO {
  id: string
  fromUser: string
  content: string
  status: 'DEPOSITED' | 'ACCEPTED'
  mine: boolean
  created: number
}

export interface CoupleCheckupItemVO {
  name: string
  score: number
  advice: string
}

export interface CoupleRingVO {
  year: number
  days: number
  events: number
}

// ============ 情侣空间·趣味游戏（F130-F139） ============

export interface CoupleSurveyAnswerVO {
  qNo: number
  answer: string
}

export interface CoupleLoveWordVO {
  id: string
  fromUser: string
  word: string
  meaning: string | null
  created: number
}

export interface CoupleBlindPickVO {
  id: string
  fromUser: string
  week: string
  picks: string
  created: number
}

export interface CoupleBattleLineVO {
  id: string
  fromUser: string
  mine: boolean
  content: string
}

export interface CoupleBattleRowVO {
  id: string
  day: string
  status: string
  winner: string | null
  created: number
}

export interface CoupleDailyThreeRowVO {
  id: string
  fromUser: string
  day: string
  joy: string | null
  touched: string | null
  wantToSay: string | null
  updatedAt: number
  created: number
}

export interface CoupleDashboardTodoVO {
  kind: string
  text: string
}

export interface CoupleDashboardMemoryVO {
  kind: string
  text: string
  created: number
}

export interface CoupleFeelRowVO {
  id: string
  fromUser: string
  day: string
  word: string
  intensity: number
  note: string | null
  updatedAt: number
  created: number
}

// ============ 情侣空间·文字浪漫（F160-F169） ============

export interface CouplePoemLineVO {
  id: string
  day: string
  fromUser: string
  mine: boolean
  line: string
  created: number
}

export interface CoupleMorningNoteVO {
  id: string
  fromUser: string
  mine: boolean
  content: string
  deliverDay: string
  arrived: boolean
  read: boolean
  created: number
}

export interface CoupleSoulRowVO {
  id: string
  fromUser: string
  day: string
  answer: string
  created: number
}

// ============ 情侣空间·默契亲密（F170-F179） ============

export interface CoupleLoveLangVO {
  fromUser: string
  mine: boolean
  scores: number[]
  primaryLang: string
  updatedAt: number
}

export interface CoupleWhatIfRowVO {
  id: string
  fromUser: string
  day: string
  answer: string
  created: number
}

// ============ 常用收藏（F207） ============

/** 双方收藏的功能卡 key 列表（≤6 个，key 为功能卡 data-testid） */
export interface CouplePinVO {
  mine: string[]
  partner: string[]
}

// ============ 两个人的饭桌（F210-F219） ============

/** F210 饭票：每人每天一票，改票即覆盖 */
export interface CoupleDineTicketVO {
  fromUser: string
  mine: boolean
  dish: string
  reason: string
}

/** 今日饭桌（保留卡 `couple-dine-today`）：双方饭票 + 撞菜命中 + 吃什么裁决。
 *  话题打卡/星评/踩雷/菜单/拿手菜/搭伙车/干饭账 随功能裁剪下线。 */
export interface CoupleDineTodayVO {
  day: string
  mine: CoupleDineTicketVO | null
  partner: CoupleDineTicketVO | null
  hit: boolean
  verdict: string | null
}

/** F212 本周饭桌菜单格（dish 空 = 该格是空的） */
export interface CoupleDinePlanVO {
  day: string
  dish: string
  updatedBy: string
  mineLastEdit: boolean
}

/** F213 本周拿手菜（按人 upsert，score 1-5） */
export interface CoupleDineHomecookVO {
  fromUser: string
  mine: boolean
  dish: string
  score: number
}

export type CoupleDineCartStatus = 'OPEN' | 'LOCKED'

/** F214 搭伙车条目（双方各锁一次才 LOCKED；仅本人且未锁可删） */
export interface CoupleDineCartVO {
  id: string
  fromUser: string
  mine: boolean
  item: string
  qty: number
  status: CoupleDineCartStatus
  locked: string[]
  canLock: boolean
}

/** F217 年度干饭账：最常点菜 top 项 */
export interface CoupleDineDishTopVO {
  dish: string
  times: number
  avgStars: number
}

// ============ 体温同步·作息与健康（F220-F229） ============

/** F220 晚安熄灯：双方今晚是否点灯 + 连续同熄灯天数 */
export interface CoupleCozyLightoutVO {
  mine: boolean
  partner: boolean
  streak: number
}

/** F221 昨夜睡眠自评单（stars 1-5，dream 为梦话可空串） */
export interface CoupleCozySleepVO {
  fromUser: string
  mine: boolean
  stars: number
  dream: string
}

/** F222 数羊房：60s 窗口内累计点按，满 10 下成群；elapsed 为成群用时毫秒（未成群为 null） */
export interface CoupleCozySheepVO {
  mineTaps: number
  partnerTaps: number
  mineDone: boolean
  partnerDone: boolean
  mineElapsedMs: number | null
  partnerElapsedMs: number | null
}

/** F223 喝水接力：双方今日杯数 + 轻提醒（TA 干了好几杯而我一杯没喝） */
export interface CoupleCozyWaterVO {
  mine: number
  partner: number
  nudge: boolean
}

/** F224 冷暖互报条目（advised=TA 是否已叮嘱过添衣） */
export interface CoupleCozyWeatherVO {
  fromUser: string
  mine: boolean
  city: string
  feel: string
  tempText: string
  advised: boolean
}

/** F225 熬夜守护：今天是否已递过「早点睡」陪伴卡 + 卡面文案 */
export interface CoupleCozyLatenightVO {
  sentToday: boolean
  card: string
}

/** F226 本周慢生活小事（doneDay 空串 = 还没打卡） */
export interface CoupleCozySlowVO {
  fromUser: string
  mine: boolean
  thing: string
  doneDay: string
}

/** F227 疼痛对策本条目（每人一本，随时可改） */
export interface CoupleCozyRemedyVO {
  forUser: string
  mine: boolean
  body: string
  updatedAt: number
}

/** F228 抱抱计量器（milestone=已达成的最近里程碑次数，未达成 null） */
export interface CoupleCozyHugVO {
  total: number
  today: number
  milestone: number | null
}

// ============ 小日子·仪式感（F230-F239） ============

/** F232 过法任务卡条目（markedToday=今天是否已打勾） */
export interface CoupleCerRitualVO {
  id: string
  foundedId: string
  content: string
  markedToday: boolean
}

/** F235 续约长卷上的一句话 */
export interface CoupleCerRenewLineVO {
  anchorDay: string
  fromUser: string
  mine: boolean
  line: string
}

/** F236 愿望券（status：OPEN 待核销 / USED 已兑现；ref 非空=保险柜里程碑 payout 券） */
export interface CoupleCerCouponVO {
  id: string
  title: string
  status: string
  ref: string
  issuer: string
  usedBy: string | null
  created: number | null
}

/** F239 当日体感「此刻感觉」一句话 */
export interface CoupleCerRecapVO {
  day: string
  fromUser: string
  mine: boolean
  feeling: string
}

/** F238 年度加冕 top 项（marks=当年打勾数） */
export interface CoupleCerCrownItemVO {
  name: string
  marks: number
}

/** 愿望券本总览（保留卡 `couple-cere-coupon`）：在途券 + 已核销券 + 本人积分余额。
 *  发券要扣积分，所以余额和单张成本必须一起下发；小日子/保险柜/续约/体感/史册/黄历已下线。 */
export interface CoupleCerOverviewVO {
  day: string
  couponsOpen: CoupleCerCouponVO[]
  couponsUsed: CoupleCerCouponVO[]
  myBalance: number
  couponCost: number
}

/** F237 小日子史册：一年一页 */
export interface CoupleCerChroniclePageVO {
  day: string
  marked: number
  ritualTotal: number
  feelings: CoupleCerRecapVO[]
}

// ============ 倾听与发声（F260-F269） ============

/** F260 想被听时段状态（OPEN 待 TA 确认 / CONFIRMED 已开麦 / DONE 聊完待互评 / CANCELLED 撤了） */
export type CoupleLsSlotStatus = 'OPEN' | 'CONFIRMED' | 'DONE' | 'CANCELLED'

/** F261 替我说的状态（DRAFT 在途草稿 / ADOPTED 已定稿） */
export type CoupleLsProxyStatus = 'DRAFT' | 'ADOPTED'

/** F264 换位信状态（SEALED 封存中 / OPENED 已拆开） */
export type CoupleLsLetterStatus = 'SEALED' | 'OPENED'

/** F265 早想说状态（HELD 还在队列里封存 / SENT 已放行说出） */
export type CoupleLsHoldStatus = 'HELD' | 'SENT'

/** F267 今日语气四种（后端只有这四个 key，其它值 400） */
export type CoupleLsToneKey = 'TIRED' | 'BUSY' | 'SAD' | 'OKAY'

/** F260 倾听时段（mine=我是说的人；confirmed=TA 已确认开麦；rateMine=说的人给的分、ratePartner=听的人给的分，未评为 null；note=本场话） */
export interface CoupleLsSlotVO {
  id: string
  day: string
  topic: string
  status: CoupleLsSlotStatus
  mine: boolean
  confirmed: boolean
  rateMine: number | null
  ratePartner: number | null
  note: string
}

/** F261 替我说（mine=我代笔的；status DRAFT 在途可覆盖；finalText/adoptedBy 仅定稿后非 null） */
export interface CoupleLsProxyVO {
  id: string
  content: string
  fromUser: string
  mine: boolean
  status: CoupleLsProxyStatus
  finalText: string | null
  adoptedBy: string | null
}

/** F262 误会倒带（同一天的同一主题双栏并排，mine* 是我那一份，partner* 是 TA 那一份，空串=那边还没写；both=两份齐了） */
export interface CoupleLsMisVO {
  day: string
  topic: string
  mineThought: string
  mineGuess: string
  partnerThought: string
  partnerGuess: string
  both: boolean
}

/** F263 本周卡壳一问（mine=我出的题；answer 未答为 null） */
export interface CoupleLsStuckVO {
  id: string
  question: string
  answer: string | null
  mine: boolean
  answered: boolean
}

/** F264 换位信（mine=我写的底稿可自阅；due=TA 写我的且已到开放日可拆；TA 未到期时 content 为「封存中，x 可见」提示语） */
export interface CoupleLsLetterVO {
  id: string
  day: string
  openDay: string
  status: CoupleLsLetterStatus
  mine: boolean
  due: boolean
  content: string
}

/** F265 早想说队列（mine=我封的；status SENT 时 sentAt 为放行时刻，HELD 时为 null） */
export interface CoupleLsHoldVO {
  id: string
  content: string
  fromUser: string
  mine: boolean
  status: CoupleLsHoldStatus
  openDay: string
  sentAt: number | null
}

/** F266 今日三行（morning/thanks/praise 是我今天写的三行，空串=没写；streak* 连续天数；badgeDays=纪念门槛 21） */
export interface CoupleLsThreeVO {
  morning: string
  thanks: string
  praise: string
  streakMine: number | null
  streakPartner: number | null
  badgeDays: number | null
}

/** F267 今日语气（label=中文语气名；line=给对方的翻译条，自己报的那条 line 为空串） */
export interface CoupleLsToneVO {
  fromUser: string
  tone: CoupleLsToneKey
  label: string
  line: string
  mine: boolean
}

/** F268 休战旗（raiser=举旗人；untilAt=解冻时刻毫秒；expired=已到期可表态；decideA/decideB=空间两位成员的表态 1 继续 / 0 算了 / null 没说，后端按 userA、userB 位下发故不区分我与 TA；ended=已收旗） */
export interface CoupleLsTruceVO {
  id: string
  raiser: string
  untilAt: number | null
  expired: boolean
  mine: boolean
  decideA: number | null
  decideB: number | null
  ended: boolean
}

/** F269 今日称呼日（usedMine/usedPartner=各喊过一次；done=双用过达成） */
export interface CoupleLsNameDayVO {
  day: string
  name: string
  usedMine: boolean
  usedPartner: boolean
  done: boolean
}

// ============ 二人制造厂（F270-F279） ============

/** F273 快递单状态（SENT 待领养 / GRABBED 有接单侠了 / DONE 已送达销单） */
export type CoupleFyParcelStatus = 'SENT' | 'GRABBED' | 'DONE'

/** F270 家务轮盘的一格任务（mine=这活派给我；confirmed=对方已认账；done=干完划线） */
export interface CoupleFySpinVO {
  id: string
  week: string
  item: string
  assignedUser: string
  mine: boolean
  confirmed: boolean
  done: boolean
}

/**
 * F270-F279 本周车间总览（十卡一次拉齐）。
 * 除 board 读接口外，24 个 POST 写接口全部返回整份 BoardVO，前端整体替换即五卡刷新；
 * shopChampion 空串=本月还没有生活委员，owed/expiring/checkMiss 为空数组=没有欠账/临期/漏检。
 */
/** 家务轮盘看板（保留卡 `couple-fy-spin`）：本周格子 + 前几周欠账 + 开场话术。
 *  采买/冰箱/快递/叫醒/服药/久坐/垫付/战利品/家安月检 随功能裁剪下线。 */
export interface CoupleFyBoardVO {
  day: string
  week: string
  spins: CoupleFySpinVO[]
  owed: string[]
  spinLine: string
}

// ============ 我们百科（F280-F289） ============

/** F280 百科词条一条（mine=我首建的，只有首建人可删；updatedBy 空串=没人改过，非空=那位修订过） */
export interface CoupleCxEntryVO {
  id: string
  term: string
  definition: string
  origin: string
  usageNote: string
  mine: boolean
  updatedBy: string
}

/**
 * F281 默契综艺一期（day=期号即日期；terms=本期五道填空题的题面）。
 * myAnswer/partnerAnswer 为逗号分隔的五答（空串=没交卷）；match 仅双交齐后非 null（x/5 命中数）。
 */
export interface CoupleCxQuizVO {
  day: string
  terms: string[]
  myAnswer: string
  partnerAnswer: string
  bothIn: boolean
  match: number | null
  comment: string
}

/**
 * F282 TOP10 互猜的一个类目行（八个类目恒定各一行，空数组=那位还没上榜）。
 * revealed=对方榜与我的猜测都齐了才揭榜；rematch=揭榜后我没猜中的「重新认识清单」话术行。
 */
export interface CoupleCxTopBoardVO {
  category: string
  label: string
  mine: string[]
  partner: string[]
  myGuess: string[]
  revealed: boolean
  rematch: string[]
}

/** F283 外号小传一条（givenBy/occasion/firstUsedDay 空串=没考据到） */
export interface CoupleCxStoryVO {
  id: string
  nickname: string
  givenBy: string
  occasion: string
  story: string
  firstUsedDay: string
  mine: boolean
}

/** F284 友情测验一道（mine=我出的题；toMe=考我的题，只有我能作答；verdict 空串=没答过，RIGHT|WRONG） */
export interface CoupleCxExamVO {
  id: string
  question: string
  quizzedUser: string
  mine: boolean
  toMe: boolean
  verdict: string
  lastTryDay: string
}

/** F285 足迹一处（year 空串=没写年份；rating 1-5，后端缺省给 5） */
export interface CoupleCxPlaceVO {
  id: string
  name: string
  year: string
  happened: string
  rating: number
  mine: boolean
}

/** F286 第一眼对视双盲（mine=我那份，partner=对方那份，互见或双方各满 3 次才下发；waiting=两份都交了但还没到互见条件） */
export interface CoupleCxFirstLookVO {
  mine: string
  partner: string
  revealed: boolean
  waiting: boolean
}

/** F287 习惯图鉴一条（mine=我记的 TA；observerUser=观察者；verdict 空串=被观察的那位还没判案，REAL=确实 / WRONG=冤枉） */
export interface CoupleCxHabitVO {
  id: string
  habit: string
  tag: string
  observerUser: string
  mine: boolean
  verdict: string
}

/** F288 口味变迁一笔（beforeText/nowText 空串=没写；shiftedDay=转折日 yyyy-MM-dd） */
export interface CoupleCxTasteVO {
  id: string
  thing: string
  beforeText: string
  nowText: string
  shiftedDay: string
  mine: boolean
}

/** F289 人格双报（year=年份；myKey/partnerKey 四位类型码，空串=那位今年还没报；diffLine=相同轴数解读；answers=我的八答原文） */
export interface CoupleCxTypeVO {
  year: string
  myKey: string
  partnerKey: string
  diffLine: string
  answers: string
}

// ============ 批次三十：传世系统（F340-F349，legacyApi / CoupleLegacy.vue） ============
// 字段与后端 CoupleLegacyService 的 11 个 record 逐一对齐；可空性按 Service 实际：
// 只有 SpeechVO.score 是 Java Integer 可为 null（没打分的发言），其余字符串后端一律给空串、
// 数字恒有值（MilestoneVO.estimateDays 用 -1 表示「近 30 天没有速率」）。

/** F347 传世条目类型（后端 CoupleLegacyItem.KINDS 四键，其它值后端 400） */
export type CoupleLegacyItemKind = 'PLACE' | 'PASSWORD' | 'THING' | 'WORD'

/** F347 传世条目状态（后端 CoupleLegacyItem.STATUS_OPEN/STATUS_SEALED：本人登记 OPEN，对方加签才 SEALED） */
export type CoupleLegacyItemStatus = 'OPEN' | 'SEALED'

/**
 * F340 年度十问的一期（后端恒定下发「今年 + 去年」两期供跨年对照）。
 * mine 字段后端写死 true（每期都是「我这一侧的视角」，TA 的答案在 partnerAnswers 里）；
 * myAnswers/partnerAnswers 恒 10 格、空串=那格没答；⚠️ partnerAnswers 由后端逐题钳制：
 * 我自己那一格没答之前，那一格的 TA 答案下发为空串（年度十问不是抄答案）。
 * bothDone=两人都答满 10 题（跨年 diff 视图的闸门）。
 */
export interface CoupleLegacyTenVO {
  year: string
  mine: boolean
  myAnswersJoined: string
  partnerAnswersJoined: string
  questions: string[]
  myAnswers: string[]
  partnerAnswers: string[]
  answeredCount: number
  bothDone: boolean
}

/** F341 记忆库年审的一份意见（keepThree/deleteThree 后端按逗号拆成数组，各 ≤3 条各 ≤60 字；
 *  submitted=这一年两人已交份数（1=还差 TA，2=双人都交齐）） */
export interface CoupleLegacyAuditVO {
  year: string
  mine: boolean
  keepThree: string[]
  deleteThree: string[]
  note: string
  submitted: number
}

/**
 * F342 年度发言稿的一条（score 为 null=对方还没打分；scoreNote=评语、ratedBy=打分人（空串=没人打）；
 *  ⚠️ canRate 由后端算好：只有对方发的那篇且还没打过分才 true，自己那篇永远评不了分）
 */
export interface CoupleLegacySpeechVO {
  year: string
  mine: boolean
  text: string
  score: number | null
  scoreNote: string
  ratedBy: string
  canRate: boolean
}

/**
 * F344 一人一条恋爱汇率（fromUser=报价的人，前端按 auth.username 比对谁是「我」；
 *  settledYear 空串=这年还没年末结算；settleLine 由后端 Bank 生成，settledYear 空时恒空串）
 */
export interface CoupleLegacyFxVO {
  fromUser: string
  kissToHug: number
  hugToWord: number
  settledYear: string
  settleLine: string
}

/** F345 情侣品牌（后端 uk(space) 单行，未建时 LegacyVO.brand 给全空串对象而非 null；
 *  mine=我是拟定人；published=对方确认过才 true；line=发布话术（Bank 生成，未发布为空串）） */
export interface CoupleLegacyBrandVO {
  name: string
  slogan: string
  intro: string
  published: boolean
  mine: boolean
  line: string
}

/** F346 我们的一年（一年一份、本人可重生覆盖；content 是后端用真数字组文的年度盘点正文） */
export interface CoupleLegacyReviewVO {
  year: string
  mine: boolean
  content: string
}

/** F347 传世清单的一条（status OPEN=还没封、SEALED=双签已封；signedBy 空串=没人加签；
 *  ⚠️ canSeal 由后端算好：只有对方登记的且未封存才 true，自己签不封） */
export interface CoupleLegacyItemVO {
  id: string
  item: string
  kind: CoupleLegacyItemKind
  detail: string
  mine: boolean
  status: CoupleLegacyItemStatus
  signedBy: string
  canSeal: boolean
}

/** F348 今年的周年抽奖箱（prizeMine/prizePartner 空串=那位还没抽；
 *  remindable=周年已过且我还没抽（后端读时惰性结算 notified 标记才 true）） */
export interface CoupleLegacyDrawVO {
  year: string
  prizeMine: string
  prizePartner: string
  drawnMine: boolean
  drawnPartner: boolean
  remindable: boolean
}

/**
 * F343 里程碑倒推（无表读时算：achieved=台账总笔数、last30=近 30 天笔数；
 * estimateDays=-1 表示近 30 天零互动算不出速率，此时 estimateDay 为空串、advice 是「先攒一周」文案）
 */
export interface CoupleLegacyMilestoneVO {
  goal: number
  achieved: number
  last30: number
  estimateDays: number
  estimateDay: string
  advice: string
}

/** F349 空间等级（无表读时算：total=台账笔数 + 传世系行数；level 1-99、title 与 line 全由后端 Bank 出） */
export interface CoupleLegacyLevelVO {
  level: number
  title: string
  total: number
  ledgerCount: number
  legacyCount: number
  line: string
}

// ============ 批次三十一：回音壁（F350-F359，echoApi / CoupleEcho.vue） ============
// 字段与后端 CoupleEchoService 的 11 个 record 逐一对齐（record 参数顺序 = wire 字段顺序）。
// 可空性按 Service 实际：只有 EchoVO.selfLetter 是对象可为 null（没有在途信时后端给 null），
// 其余字符串一律经 nz() 下发空串（toXxx 全走 nz）、数字/布尔恒有值（created 为 null 时后端给 0）。
// ⚠️ YearlyVO.year 是 Java int → number，不是字符串（和批次三十的 LegacyVO.year: string 不一样）。

/**
 * F350 好事簿的一条证据。mine=我是记录人（后端按 fromUser==当前用户算）；
 * deeds 是我记的「TA 为我做的事」，partnerDeeds 是 TA 记的「我为 TA 做的事」，两边各限最近 30 条（DEED_PAGE）。
 * starred=「这条救过我」加星，只有记录人本人能点（后端 400「只有记下这条的人能加星」，已加星幂等返回）。
 */
export interface CoupleEchoDeedVO {
  id: string
  fromUser: string
  mine: boolean
  content: string
  day: string
  starred: boolean
  created: number
}

/** F352 鼓励语罐的一张纸条（idx=罐子槽位 1-5，删掉后槽位复用；juices 是两人合计，按 mine 分罐，每人 ≤5 条） */
export interface CoupleEchoJuiceVO {
  id: string
  fromUser: string
  mine: boolean
  idx: number
  content: string
  created: number
}

/** F355 三行高光卡（moment=什么时候 ≤40 字 / did=TA 做了什么 ≤80 字 / feel=什么感觉 ≤80 字，每人 ≤12 条） */
export interface CoupleEchoHighlightVO {
  id: string
  fromUser: string
  mine: boolean
  moment: string
  did: string
  feel: string
  created: number
}

/** F358 给低落的自己的信的状态（后端 CoupleEchoSelfLetter.STATUS_SEALED/STATUS_READ） */
export type CoupleEchoSelfStatus = 'SEALED' | 'READ'

/**
 * F350-F359 回音壁总览（GET /api/couple/echo/vault 一次拉齐；12 个 POST 写接口全部返回整份 EchoVO，
 * 前端整体替换即十卡刷新）。⚠️ 只有 selfLetter 可 null（没在途信）；refill/yearly 是恒有值嵌套对象。
 * 被爱日历（F353）不在这份聚合里，走 GET /calendar?year= 懒领取。
 */
/** 好事簿看板（保留卡 `couple-echo-deed`）：我记的证据 + TA 记的证据 + 两侧条数。
 *  鼓励语罐/能量补给/慢递/高光/回执/电量/写给低落的自己/日历/年报 随功能裁剪下线。 */
export interface CoupleEchoVO {
  day: string
  deeds: CoupleEchoDeedVO[]
  partnerDeeds: CoupleEchoDeedVO[]
  mineCount: number
  partnerCount: number
}

// ============ 批次三十二：注意力保护区（F360-F369，focusApi / CoupleFocus.vue） ============
// 字段与后端 CoupleFocusService 的 6 个 record 逐一对齐（record 参数顺序 = wire 字段顺序）。
// 可空性按 Service 实际：
// · TodayVO.night 恒有值——没打卡行时 toNight() 给 NightVO(false,false,null,null,"","",false,0,"")，不是 null；
// · TodayVO.slot / TodayVO.detoxKind 才是真可空（这周没人预约 / 今天没挂排毒半天 → 后端给 null）；
// · NightVO.mineMinutes / partnerMinutes 是 Java Integer，没报的那一方给 null（报过 0 分钟也是 0 不是 null）；
// · 其余字符串一律经 nz() 下发空串，数字/布尔恒有值（created 为 null 时后端给 0）；
// · ⚠️ YearlyVO.year 是 Java int → number，WeeklyVO.week 是字符串 yyyy-MM-dd（周一锚），别抄错。
// ⚠️ 后端只下发「合计与双点态」，不下发 meal/gaze/detox 的「我这一格点没点」标志（只有 unplug 有 unplugMine），
//    组件用本地回执位兜住，重复点是后端幂等不报错的。

/**
 * F360 当夜专注打卡（双人列口径：_a 属 couple_space.userA、_b 属 userB，读哪一列由后端按 mine 算好）。
 * mineReported/partnerReported=那一方报没报（minutes 为 null 即没报）；bothLit=两列都非空才点亮（读时算）；
 * totalMinutes=两人报的分钟相加（没报的那方按 0 计）；
 * hint=没点亮时后端挂上来的 Bank「还有一个人没报，今晚的灯先留着一半 🕯️」，点亮或没人报时是空串。
 */
export interface CoupleFocusNightVO {
  mineReported: boolean
  partnerReported: boolean
  mineMinutes: number | null
  partnerMinutes: number | null
  mineNote: string
  partnerNote: string
  bothLit: boolean
  totalMinutes: number
  hint: string
}

/**
 * F362 攒下来的一句话。⚠️ TodayVO.queue 只下发 to_user=我 的留言（TA 攒给我的），
 * 所以我自己的那一份永远算不出 mine=true（后端 q.getFromUser().equals(me) 恒 false），也看不到我攒出去的几句。
 * read=TA 收过没有（read_at 非空）；created=毫秒，未下发时后端给 0。
 */
export interface CoupleFocusQueueVO {
  id: string
  fromUser: string
  mine: boolean
  content: string
  read: boolean
  created: number
}

/**
 * F361 本周专属时段（uk(space,week)，week=那周周一 yyyy-MM-dd；一周只有一段，重新提议即改写并清空确认）。
 * mine=我是提议人；confirmed=对方点过头（生效）。hours 后端 hoursOrDefault() 恒有值（缺省 2）。
 */
export interface CoupleFocusSlotVO {
  id: string
  week: string
  day: string
  title: string
  hours: number
  proposedBy: string
  mine: boolean
  confirmed: boolean
  created: number
}

// ============ 批次三十三：人生关卡（F370-F379，questApi / CoupleQuest.vue） ============
// 字段名与顺序与后端 CoupleQuestService 的 13 个 record 逐一对齐（record 参数顺序 = wire 字段顺序）。
// 可空口径（照后端 build()/toXxx() 源码，不是猜的）：QuestVO 里真可空只有
//   myOvertime / partnerOvertime（今晚那一方没预报）、myNurse / partnerNurse（没在途单）、
//   myPod / partnerPod（进过舱就有值，出舱后也在，见下方 PodVO 说明）、moveNight（从来没打过）、
//   myValley / partnerValley（没在途通行证）；wall 恒有值（当年零计数也给你一整份）。
// 其余字符串经后端 nz() 恒为空串（没写=空串而不是 null），数字/布尔恒有值，「没打过」一律给 0 或 false。

/** F370 关卡类型（后端 CoupleQuestBattle.KINDS 六个，白名单外 400「关卡类型只能是…」） */
export type CoupleQuestBattleKind = 'INTERVIEW' | 'REPORT' | 'DEFEND' | 'TALK' | 'CHECKUP' | 'OTHER'

/** F371 战果（后端 CoupleQuestReport.RESULTS；白名单外 400「战果只有三种」） */
export type CoupleQuestResult = 'WIN' | 'LOSE' | 'SURVIVE'

/** F373 代记种类（后端 CoupleQuestCareMark.KINDS，只有这两种） */
export type CoupleQuestCareKind = 'WATER' | 'MED'

/**
 * F372 今晚的加班预报（uk(space,day,user)，每人每天一行、本人当天可改写）。
 * untilHour 后端 13-23 钳制（null 按缺省 20）；lamp/lampBy=留的那句灯卡和留灯的人，没留是空串。
 */
export interface CoupleQuestOvertimeVO {
  id: string
  untilHour: number
  note: string
  mine: boolean
  lamp: string
  lampBy: string
}

/** F373 一次代记打卡（uk 是 nurse+day+kind+by_user，一天每种只记一次）。 */
export interface CoupleQuestCareMarkVO {
  day: string
  kind: CoupleQuestCareKind
  kindLabel: string
  byUser: string
  mine: boolean
}

/**
 * 关卡总览（GET /api/couple/quest/board 一次拉齐；27 个 POST 写接口全部原样返回整份 QuestVO，
 * 前端整体替换即十卡刷新）。⚠️ 唯一的例外是 GET /wall?year=：那是「点按钮才懒读另一份」的独立读接口，
 * 不进这份聚合（这份里的 wall 恒是服务端当年那一份）。
 * day=服务端今天 yyyy-MM-dd、weekStart=服务端那周的周一 yyyy-MM-dd ——
 * 所有倒数/是否本周的判定一律吃这两个字段，不吃本地时钟。
 */
/** 加班预报与留灯看板（保留卡 `couple-quest-overtime`）：双方今天那行 + 能不能留灯。
 *  关卡预告/出关战报/陪护单/静音舱/搬家/低谷/小胜利/关口预约/成就墙 随功能裁剪下线。 */
export interface CoupleQuestVO {
  day: string
  myOvertime: CoupleQuestOvertimeVO | null
  partnerOvertime: CoupleQuestOvertimeVO | null
  canLeaveLamp: boolean
}

// ============ 批次三十四：聆听者（F380-F389，catchApi / CoupleCatch.vue） ============
// ⚠️ 字段名、顺序与可空性逐字对齐后端 CoupleCatchService 的 12 个 record（record 参数顺序 = wire 字段顺序）。
// 字段名对不上只会表现为「卡片空白」，vue-tsc 与单测都照不出来——改后端或抄后端时务必逐字段再比一遍。
// 可空口径（读 build() 源码逐字段确认）：真可空只有 CatchVO 的 myWord / partnerWord / myProtocol /
// partnerProtocol / myToday / partnerToday 六个槽位（后端 `row == null ? null : ...`）；
// 其余字符串一律经 nz() 恒空串、int/long 恒有值（getCreated()/getAvoided() 为 null 时后端兜 0）。

/** F383 敏感日类型（后端 CoupleCatchSensitive.KINDS 四个；⚠️ 请求里传空串后端兜成 OTHER，不报错） */
export type CoupleCatchSensitiveKind = 'PERIOD' | 'CHECK' | 'MEMORY' | 'OTHER'

/** F386 聆听方式（后端 CoupleCatchProtocol.MODES 五个；白名单外 400「五种里选一个…」） */
export type CoupleCatchProtocolMode = 'REASON' | 'RANT' | 'HUG' | 'FOOD' | 'SPACE'

/** F387 话题状态（后端 CoupleCatchTopic.STATUS_PENDING/TAKEN/TALKED；⚠️ VO 不下发中文标签，前端只做文案镜像） */
export type CoupleCatchTopicStatus = 'PENDING' | 'TAKEN' | 'TALKED'

/**
 * F382 某一方的安全词（uk(space,from_user)，每人一格可改写，word ≤20、note ≤60）。
 * useCount=这个人**全历史**喊停次数（countBy 不限月份；⚠️ 规格 F382 说「月度统计」，月度数在
 * CatchVO.monthUses 且是两人合计，后端不下发分人的本月数）。
 * ⚠️ 后端不下发「我今天是否已经喊过」，前端只能从 uses（按 day 倒序、≤20 条）比对 mine+day===v.day。
 */
export interface CoupleCatchSafewordVO {
  id: string
  mine: boolean
  word: string
  note: string
  useCount: number
}

/**
 * F382 一次暂停使用（uk(space,day,user_name)，一天一人只记一次）。
 * word 取的是「喊的那个人当天的词」：我喊的用 myWord 的词、TA 喊的用 partnerWord 的词，
 * 那一方还没约词时后端给空串。reflect=事后复盘（空串=还没补，只有喊停本人能补）。
 */
export interface CoupleCatchUseVO {
  id: string
  day: string
  mine: boolean
  word: string
  reflect: string
}

/**
 * 聆听者总览（GET /api/couple/catch/board 一次拉齐；19 个 POST 写接口全部原样返回整份 CatchVO，
 * 前端整体替换即十卡刷新）。⚠️ 唯一的例外是 GET /year?year=：那是「点按钮才懒读另一年」的独立读接口，
 * 不进这份聚合（这份里的 year 恒是服务端当年那一份）。
 * day=服务端今天 yyyy-MM-dd、week=服务端那周的周一 yyyy-MM-dd ——
 * 所有倒数/本月/今日判定一律吃这两个字段，不吃本地时钟。
 * protocolHint/dailyHint 是后端 Bank 整句（dailyHint 空串=TA 今天写了或之前没写过）。
 * wishQuotaLeft=替 TA 记的格子还剩几个（⚠️ 后端的减数是 findByOwner 全量含已兑现，兑现并不释放格子）。
 * monthUses=本月两人合计喊停次数；sensitives 只给 day>=今天；myThreads/partnerThreads 只给 OPEN。
 */
/** 安全词看板（保留卡 `couple-catch-safeword`）：双方的词 + 暂停记录 + 本月合计 + 今天两人喊没喊。
 *  暗中心愿本/雷区/敏感日历/话头/反话/协议/话题池/今日一句话/年报 随功能裁剪下线。
 *  usedTodayMine/usedTodayPartner 是本轮补上的本人位（以前前端只能按 uses 列表自己比 day，判漏就界面说谎）。 */
export interface CoupleCatchVO {
  day: string
  week: string
  myWord: CoupleCatchSafewordVO | null
  partnerWord: CoupleCatchSafewordVO | null
  uses: CoupleCatchUseVO[]
  monthUses: number
  usedTodayMine: boolean
  usedTodayPartner: boolean
}

/**
 * F390 一条笑点（uk(space,day,from_user,title)，每人每个「事发日」≤3 条 CoupleLaughMoment.PER_DAY_MAX）。
 * mine=这条是我存的；witness/witnessBy 是对方补的现场证词（没补时都是空串，后端判「补没补」看 witness_by）；
 * witnessed=已有人补过；canWitness=后端算好的「不是我的 + 还没人补」——⚠️ 补证词这一位只可能给对方，
 * 所以我自己的行 canWitness 恒 false。
 */
export interface CoupleLaughMomentVO {
  id: string
  day: string
  mine: boolean
  title: string
  culprit: string
  scene: string
  funLevel: number
  witness: string
  witnessBy: string
  witnessed: boolean
  canWitness: boolean
}

/**
 * F391 某一天的节目单（uk(space,day) 一天一格，双人共写这一行；谁值班由后端按周轮换算，⚠️ 前端算不了）。
 * mineOwner=今天值班的是我；ownerUser=值班人用户名；verdict/verdictLabel 后端**不等判完就下发**（空串=还没判，
 * 判完互见靠的就是这两个字段恒定可见）；judged=已判分；canServe=值班人本人（判分前还能改写）；
 * canJudge=不是值班人 **且节目非空**（判分归对方）。
 */
export interface CoupleLaughDailyVO {
  id: string
  day: string
  mineOwner: boolean
  ownerUser: string
  content: string
  verdict: string
  verdictLabel: string
  judged: boolean
  canServe: boolean
  canJudge: boolean
}

/**
 * F392 一条冷笑话（uk(space,from_user,content) 一人一句只一行，每人每天 ≤3 条 PER_USER_DAY_MAX）。
 * ⚠️ frozen 是「判没判」之外的第二位：后端没判时也存 0，所以「没结冰」与「还没人判」都表现为 frozen=false，
 * 只能靠 judged 区分；judgedBy 空串=还没人判。
 * canJudge=对方讲的且还没判；canGuess=对方讲的（⚠️ 后端 guessJoke **没有**归属校验，这条闸门只有 VO 给得出）。
 */
export interface CoupleLaughJokeVO {
  id: string
  day: string
  mine: boolean
  content: string
  frozen: boolean
  judged: boolean
  judgedBy: string
  canJudge: boolean
  canGuess: boolean
}

/**
 * F393 一条社死往事（uk(space,day,from_user) 同人同社死日只一行）。
 * healed/healedBy=对方盖的「抱抱你」章；⚠️ turnedFunny 与 daysOld 是**读时按 day 距今算出来的**（满 365 天
 * CoupleLaughCringe.HEAL_AFTER_DAYS 才算转档，不落库、没有结算任务）；
 * canHeal=不是我的且还没盖章——⚠️ 满一年转档后这一位仍是 true（后端没有「转档了就不许再盖」的规则）。
 */
export interface CoupleLaughCringeVO {
  id: string
  day: string
  mine: boolean
  content: string
  healed: boolean
  healedBy: string
  turnedFunny: boolean
  daysOld: number
  canHeal: boolean
}

/** F394 一次快乐突袭（uk(space,from_user,day) 每人每天一发）。kindLabel 由后端 Bank 下发。 */
export interface CoupleLaughAttackVO {
  id: string
  day: string
  mine: boolean
  kind: string
  kindLabel: string
  content: string
  hit: boolean
  hitBy: string
  canHit: boolean
}

/**
 * F395 对某条冷笑话的预判（uk(space,joke_id,from_user) 一条梗每人一票，可改自己那一票）。
 * ⚠️ 后端只在 jokes 列表（≤20 条 LIST_JOKE）里逐条 map 出 GuessVO，所以 jokeId 一定能回查 v.jokes；
 * minePredicted/partnerPredicted=这一票我/TA 投过没有，predictsLaugh=投的是「TA 会笑」，
 * twin=两票齐了且一致，predictCount=这条收到几票（0/1/2）。⚠️ 后端**没有** day 列，归年借被考那条梗的发出日。
 */
export interface CoupleLaughGuessVO {
  jokeId: string
  minePredicted: boolean
  partnerPredicted: boolean
  predictsLaugh: boolean
  partnerPredictsLaugh: boolean
  twin: boolean
  predictCount: number
}

/**
 * F396 一张大笑处方（uk(space,from_user,day) 每人每天一张）。
 * targetKind/targetLabel=指向哪一类，targetId 指向本空间的行；
 * ⚠️ targetTitle 是这批唯一一个可空字符串：后端 `safeTargetTitle()` 没套 nz()，
 * 目标行查不到（跨空间/被删/targetId 空）时为 null。taken/takenBy=对方回执「已服用」（空串=还没服）。
 * ⚠️ RxVO **没有** canTake 位，「能不能点已服用」只能由 mine+taken 两个服务端位推。
 */
export interface CoupleLaughRxVO {
  id: string
  day: string
  mine: boolean
  targetKind: string
  targetLabel: string
  targetId: string
  targetTitle: string | null
  note: string
  taken: boolean
  takenBy: string
}

/**
 * F397 幽默风格一行（uk(space,about_user,rater) 「谁评谁」只一行，自评与互评各一行，可改写）。
 * mine=这一行是我评的（rater==我）；selfRated=这一行是本人给自己评的（aboutUser==rater，与「我」无关）。
 * styleLabel 由后端 Bank 下发。⚠️ 四格图鉴要拼「谁评谁」只能吃 aboutUser/rater 两个用户名。
 */
export interface CoupleLaughStyleVO {
  id: string
  aboutUser: string
  rater: string
  mine: boolean
  selfRated: boolean
  style: string
  styleLabel: string
  note: string
}

/**
 * F398 欢乐周报（周一锚，全部读时算）。week 与 fromDay 后端给的是**同一个值**（那周的周一）。
 * moments/served/happy/fake/frozen/hits/guesses 都是**两人合计**，不分你我；summary 是 Bank 整句。
 */
export interface CoupleLaughWeekVO {
  week: string
  fromDay: string
  toDay: string
  moments: number
  served: number
  happy: number
  fake: number
  frozen: number
  hits: number
  guesses: number
  summary: string
}

/**
 * F399 年度欢笑榜（⚠️ year 是 Java int → number，别抄批次二十五 post 的 string year）。
 * 数字全部直查原始表按**事发日**归年（guess 借被考冷笑话的发出日），不受 moments≤20/jokes≤20/cringes≤14/
 * attacks≤14/rxList≤10 的列表钳制；kingOfCold 是用户名或「还没人」，bestLine 可以是空串。
 * 称号与 summary 全在后端 Bank（yearTitle 按 moments*2+hits*2+happy+frozen 分五档）。
 */
export interface CoupleLaughYearVO {
  year: number
  moments: number
  laughs: number
  dailyDone: number
  happy: number
  frozen: number
  kingOfCold: string
  cringe: number
  cringeHealed: number
  turns: number
  attacks: number
  hits: number
  guessTwin: number
  rxTaken: number
  bestLine: string
  title: string
  summary: string
}

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
  /** 我可以拆但还没拆的悄悄话数（信箱 tab 红点） */
  letterUnread: number
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
  /** 今日主题（题库按主题分组轮换：重新认识彼此 / 爱情观与我们 / 深夜电台…） */
  topic: string
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
  created: number
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

export interface CoupleTimelineDay {
  day: string
  events: CoupleTimelineEvent[]
}

/** 心动值明细 */
export interface CoupleIntimacyBreakdown {
  morningDays: number
  nightDays: number
  questionDays: number
  promiseDone: number
  itemDone: number
  moodDays: number
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

export interface CoupleLetterVO {
  id: string
  /** 发件人用户名；收件人就是空间里的另一个人 */
  sender: string
  /**
   * 信件内容。未到点的慢递对收件人隐藏（null，前端显示 🔒）；
   * 发件人始终能看到自己写的内容
   */
  content: string | null
  /** 可拆封时间（毫秒，null = 立即可拆） */
  deliverAt: number | null
  status: CoupleLetterStatus
  openedAt: number | null
  /** true = 未到点的慢递（收件人还不能拆） */
  locked: boolean
  created: number
}

/** 今日一问历史（按天拼好的双方回答） */
export interface CoupleQuestionHistoryVO {
  day: string
  topic: string
  question: string
  myAnswer: string | null
  partnerAnswer: string | null
}

// ============ 情侣空间：恋爱条约 / 异地恋助手 / 心愿基金 ============

export interface CouplePactVO {
  id: string
  content: string
  proposedBy: string
  /** 盖章人用户名（空 = 待对方盖章） */
  acceptedBy: string | null
  acceptedAt: number | null
  /** true = 还没生效（对方提出的等我盖章） */
  pending: boolean
  /** true = 我提出的 */
  mine: boolean
  created: number
}

/** 异地恋卡片：任一方城市缺失或不在城市库时 hoursDiff/distanceKm 为 null */
export interface CoupleCityCardVO {
  myCity: string | null
  partnerCity: string | null
  hoursDiff: number | null
  distanceKm: number | null
  /** F39 对方城市 IANA 时区（不在城市库时为 null），前端据此显示对方当地时间 */
  partnerZoneId: string | null
}

export interface CoupleFundDepositVO {
  id: string
  username: string
  /** 金额（分） */
  amount: number
  note: string
  created: number
}

export interface CoupleFundVO {
  id: string
  title: string
  /** 目标金额（分） */
  targetAmount: number
  /** 已存金额（分） */
  savedAmount: number
  status: 'ACTIVE' | 'REACHED'
  reached: boolean
  /** 0-100（封顶） */
  progress: number
  createdBy: string
  deposits: CoupleFundDepositVO[]
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

// ============ 情侣空间：每日仪式升级 ============

export interface CoupleTaskVO {
  id: string
  day: string
  username: string
  content: string
  status: 'PENDING' | 'DONE'
  doneAt: number | null
  /** true = 我的任务卡（false = TA 的） */
  mine: boolean
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

export interface CoupleTacitStateVO {
  pending: CoupleTacitVO | null
  matchedCount: number
  totalCount: number
}

/** 今日恋爱运势签 */
export interface CoupleFortuneVO {
  day: string
  good: string
  bad: string
  lucky: string
  line: string
  /** 综合指数 60-99 */
  score: number
}

export interface CoupleStoryVO {
  day: string
  title: string
  content: string
}

// ============ 情侣空间：情绪关怀 ============

/** 情绪天气预报：今天双方的心情 + 贴心提示 */
export interface CoupleWeatherVO {
  myMood: CoupleMoodKind | null
  myEmoji: string
  partnerMood: CoupleMoodKind | null
  partnerEmoji: string
  tip: string
}

/** 情绪急救箱 */
export interface CoupleFirstAidVO {
  /** TA 最近连续低落天数 */
  negativeDays: number
  suggestion: string
  /** 连续 ≥2 天 = 需要关注 */
  urgent: boolean
}

export interface CoupleReconcileVO {
  id: string
  fromUser: string
  message: string
  /** 这次别扭开始时间（可空） */
  startAt: number | null
  status: 'SENT' | 'ACCEPTED'
  acceptedAt: number | null
  /** 和好耗时（小时，可空） */
  durationHours: number | null
  /** true = 我递的 */
  mine: boolean
  created: number
}

export interface CouplePraiseVO {
  id: string
  fromUser: string
  content: string
  status: 'POSTED' | 'RECEIVED'
  receivedAt: number | null
  mine: boolean
  created: number
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

export interface CoupleCycleCardVO {
  mine: CoupleCycleSideVO | null
  partner: CoupleCycleSideVO | null
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

export interface CoupleBadgeWallVO {
  milestones: CoupleBadgeVO[]
  achievements: CoupleAchievementVO[]
  achievedCount: number
  total: number
}

/** 那年今天事件 */
export interface CoupleOnThisDayEvent {
  day: string
  type: 'space' | 'ritual' | 'question' | 'promise' | 'item' | 'anniversary'
  title: string
  detail: string
  at: number | null
}

export interface CoupleCapsuleVO {
  id: string
  sender: string
  /** 未到期对收件人隐藏（null，前端显示 🔒） */
  content: string | null
  openDay: string
  status: 'SEALED' | 'OPENED'
  openedAt: number | null
  locked: boolean
  /** 距可开启天数 */
  remainDays: number
  mine: boolean
  created: number
}

export interface CoupleCountdownVO {
  id: string
  title: string
  targetDay: string
  note: string
  done: boolean
  doneAt: number | null
  /** 距目标日期天数（已过期为负） */
  daysLeft: number
  createdBy: string
  created: number
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

/** 月度账单汇总：明细 + 双方合计 + AA 差额提示 */
export interface CoupleExpenseMonthVO {
  month: string
  expenses: CoupleExpenseVO[]
  mineTotal: number
  partnerTotal: number
  total: number
  /** 双方差额（分，可空） */
  diff: number | null
  tip: string
}

export interface CoupleChoreVO {
  id: string
  title: string
  rotate: 'SINGLE' | 'ALTERNATE'
  /** 当前值日生用户名 */
  turn: string
  /** true = 该我做了 */
  myTurn: boolean
  doneCount: number
  lastDoneDay: string | null
  lastDoneBy: string | null
  created: number
}

export interface CoupleDatePlanVO {
  id: string
  title: string
  planDay: string
  place: string
  /** 想做的事（换行分隔） */
  items: string
  status: 'PLANNED' | 'DONE'
  doneAt: number | null
  createdBy: string
  created: number
}

export interface CoupleHabitVO {
  id: string
  title: string
  myToday: boolean
  partnerToday: boolean
  /** 双人连续打卡天数 */
  bothStreak: number
  /** 累计共同打卡天数 */
  totalDays: number
  createdBy: string
  created: number
}

export interface CoupleCipherVO {
  id: string
  keyword: string
  meaning: string
  createdBy: string
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

/** 恋爱月报：某个月双方互动盘点 */
export interface CoupleMonthlyReportVO {
  month: string
  items: CoupleReportItem[]
  /** 一句温柔总结 */
  summary: string
}

/** 数据总览：全部模块累计 */
export interface CoupleDataOverviewVO {
  daysTogether: number
  items: CoupleReportItem[]
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

/** F31 今日心动加成：每天最多 20 点，24 点清零 */
export interface CoupleIntimacyBoostVO {
  day: string
  items: CoupleBoostItem[]
  totalBonus: number
  cheer: string
}

/** 热力图单格：level 0-4 */
export interface CoupleHeatCell {
  day: string
  count: number
  level: number
}

/** F33 互动热力图：最近 12 周 */
export interface CoupleHeatmapVO {
  weeks: number
  cells: CoupleHeatCell[]
  maxCount: number
  activeDays: number
}

/** 心情曲线单日：双方心情分 1-5（没记 = null） */
export interface CoupleMoodCurveDay {
  day: string
  mine: number | null
  partner: number | null
}

/** F34 心情曲线 */
export interface CoupleMoodCurveVO {
  days: CoupleMoodCurveDay[]
  myAvg: number
  partnerAvg: number
}

/** F35 恋爱红绿灯：GREEN / YELLOW / RED */
export interface CoupleTrafficLightVO {
  light: 'GREEN' | 'YELLOW' | 'RED'
  title: string
  detail: string
  advice: string
  hoursSinceLast: number | null
  lastDay: string | null
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

/** F46 第一次清单条目 */
export interface CoupleFirstVO {
  id: string
  title: string
  firstDay: string
  note: string | null
  createdBy: string
  created: number
}

/** F48 一问互评条目 */
export interface CoupleAnswerReactionVO {
  fromUser: string
  emoji: string
  created: number
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

/** F52 心动闹钟 */
export interface CoupleAlarmVO {
  id: string
  message: string
  fireAt: number
  fired: boolean
  firedAt: number | null
}

/** F53 思念速递单条 */
export interface CoupleMissVO {
  id: string
  deliverAt: number
  delivered: boolean
  deliveredAt: number | null
}

/** F53 思念速递看板 */
export interface CoupleMissBoardVO {
  myTotal: number
  partnerTotal: number
  inTransit: number
  recent: CoupleMissVO[]
}

/** F54 爱情花园状态 */
export interface CoupleGardenVO {
  stage: number
  stageName: string
  emoji: string
  totalWater: number
  wateredTodayMe: boolean
  wateredTodayPartner: boolean
  withered: boolean
  revivedCount: number
  waterToNextStage: number
  daysSinceWater: number
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

/** F55 玫瑰看板 */
export interface CoupleRoseBoardVO {
  todayMine: number
  todayPartner: number
  remainingToday: number
  today: CoupleRoseVO[]
  recent: CoupleRoseVO[]
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

/** F56 幸运签看板 */
export interface CoupleSlipBoardVO {
  mySlipToday: CoupleSlipVO | null
  receivedToday: CoupleSlipVO | null
  recent: CoupleSlipVO[]
}

/** F57 告白重现 */
export interface CoupleConfessionVO {
  id: string
  content: string
  confessDay: string
  createdBy: string
  created: number
}

/** F58 藏宝图任务 */
export interface CoupleTreasureVO {
  id: string
  fromUser: string
  taskText: string
  /** 未揭晓时对挖宝人隐藏 */
  prizeText: string | null
  status: 'PENDING' | 'DONE'
  doneAt: number | null
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

/** F61 一天的复盘（双方各一份，齐了才是完整锦囊） */
export interface CouplePeaceDayVO {
  day: string
  mine: {
    id: string
    byUser: string
    day: string
    myPart: string
    nextTime: string
    created: number
  } | null
  partner: {
    id: string
    byUser: string
    day: string
    myPart: string
    nextTime: string
    created: number
  } | null
  complete: boolean
}

/** F62 道歉券 */
export interface CoupleSorryTicketVO {
  id: string
  fromUser: string
  note: string
  status: 'ACTIVE' | 'USED'
  usedNote: string | null
  usedAt: number | null
  created: number
}

/** F66 今天的真心话 */
export interface CoupleTruthTodayVO {
  day: string
  question: string
  myAnswer: string | null
  partnerAnswer: string | null
}

/** F66 真心话存档 */
export interface CoupleTruthHistoryVO {
  day: string
  question: string
  myAnswer: string | null
  partnerAnswer: string | null
}

/** F67 树洞提问 */
export interface CoupleWhisperVO {
  id: string
  question: string
  anonymous: boolean
  askerLabel: string
  answer: string | null
  answeredAt: number | null
  mine: boolean
  created: number
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

/** F68 心灵感应板 */
export interface CoupleTelepathyBoardVO {
  current: CoupleTelepathyRoundVO | null
  history: CoupleTelepathyRoundVO[]
  roundsLeftToday: number
  matchedCount: number
  totalSettled: number
}

/** F69 情话储蓄罐单条 */
export interface CoupleLoveBankVO {
  id: string
  content: string
  delivered: boolean
  deliveredAt: number | null
  created: number
}

/** F69 情话储蓄罐看板 */
export interface CoupleLoveBankBoardVO {
  inJar: number
  deliveredCount: number
  mine: CoupleLoveBankVO[]
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

/** F70 挑战看板 */
export interface CoupleChallengeBoardVO {
  today: CoupleChallengeVO | null
  history: CoupleChallengeVO[]
  wonCount: number
}

/** F71 存折流水 */
export interface CouplePassbookEntryVO {
  id: string
  fromUser: string
  day: string
  content: string
  mine: boolean
}

/** F71 恋爱存折看板 */
export interface CouplePassbookBoardVO {
  mineToday: CouplePassbookEntryVO | null
  partnerToday: CouplePassbookEntryVO | null
  myStreak: number
  milestone: string | null
  recent: CouplePassbookEntryVO[]
}

/** F72 百日之约 */
export interface CoupleHundredVO {
  id: string
  goal: string
  startDay: string
  status: 'ACTIVE' | 'DONE' | 'BROKEN'
  dayNumber: number
  bothCheckedDays: number
  todayCheckedMine: boolean
  todayCheckedPartner: boolean
}

/** F77 星座配对（静态） */
export interface CoupleZodiacVO {
  mine: string
  mineLabel: string
  partner: string
  partnerLabel: string
  score: number
  comment: string
}

/** F73 心愿互换 */
export interface CoupleWishVO {
  id: string
  fromUser: string
  wish: string
  status: 'PENDING' | 'ACCEPTED' | 'DONE'
  doneNote: string | null
  created: number
}

/** F75 旅行心愿 */
export interface CoupleTravelVO {
  id: string
  fromUser: string
  place: string
  wantTodo: string | null
  visited: boolean
  visitedNote: string | null
  created: number
}

/** F79 下次一定 */
export interface CoupleNextTimeVO {
  id: string
  fromUser: string
  content: string
  status: 'PENDING' | 'DONE'
  doneAt: number | null
  created: number
}

/** F74 共读计划 */
export interface CoupleReadPlanVO {
  id: string
  title: string
  totalUnits: number
  unitLabel: string
  status: 'READING' | 'FINISHED'
  myUnit: number | null
  partnerUnit: number | null
  myNote: string | null
  partnerNote: string | null
  created: number
}

/** F76 追剧清单 */
export interface CoupleWatchVO {
  id: string
  title: string
  currentUnit: number
  totalUnit: number | null
  updatedBy: string | null
  updatedByMine: boolean
  status: 'WATCHING' | 'DONE'
  created: number
}

/** F78 恋爱词典词条 */
export interface CoupleDictVO {
  id: string
  fromUser: string
  word: string
  meaning: string
  created: number
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

/** F80 编年史按年分组 */
export interface CoupleChronicleYearVO {
  year: string
  events: CoupleChronicleEvent[]
}

/** F81 考古卡 */
export interface CoupleArchaeologyCardVO {
  kind: string
  day: string
  daysAgo: number
  title: string
  content: string
}

/** F82 问答机单题 */
export interface CoupleQuizQuestionVO {
  key: string
  question: string
  options: string[]
  answerIndex: number
}

/** F85 报告条目 */
export interface CoupleReportItem {
  key: string
  label: string
  emoji: string
  value: number
  unit: string
}

/** F85 周年报告 */
export interface CoupleAnniversaryReportVO {
  anniversaryDay: string
  nthYear: number
  sinceDay: string
  items: CoupleReportItem[]
  summary: string
}

/** F86 生日回顾 */
export interface CoupleBirthdayLookVO {
  partner: string
  partnerLabel: string
  birthday: string
  events: CoupleChronicleEvent[]
}

/** F83 甜蜜语录 */
export interface CoupleQuoteVO {
  id: string
  fromUser: string
  content: string
  context: string | null
  created: number
}

/** F88 电影票根 */
export interface CoupleTicketVO {
  id: string
  fromUser: string
  title: string
  watchDay: string
  rating: number
  comment: string | null
  created: number
}

/** F89 我们的歌 */
export interface CoupleSongVO {
  id: string
  fromUser: string
  title: string
  artist: string | null
  reason: string | null
  created: number
}

// ============ 情侣空间：体验与其它菜单（F90-F99） ============

/** F95 今日看点 */
export interface CoupleTodayBoardVO {
  day: string
  challengeDone: boolean
  truthAnswered: boolean
  moodLogged: boolean
  passbookDeposited: boolean
  hundredChecked: boolean
  pactDayNumber: number | null
  nextCapsuleDay: string | null
  capsuleDaysLeft: number | null
}

/** F96 年度热力日历（单格） */
export interface CoupleHeatmapDayVO {
  day: string
  count: number
  level: number
}

/** F96 年度热力日历 */
export interface CoupleYearHeatmapVO {
  year: number
  days: CoupleHeatmapDayVO[]
  totalActive: number
}

// ============ 情侣空间：会说情话·沟通增强（F100-F109） ============

/** F100 恋爱翻译结果 */
export interface CoupleTranslationVO {
  phrase: string
  subtext: string
  reply: string
}

/** F101 冷静角 */
export interface CoupleCoolDownVO {
  id: string
  fromUser: string
  reason: string | null
  status: string
  endAt: number
  softA: string | null
  softB: string | null
  healedAt: number | null
  created: number
}

/** F102 情绪接力棒 */
export interface CoupleRelayVO {
  id: string
  fromUser: string
  moodWord: string
  moodEmoji: string | null
  note: string | null
  status: string
  catchNote: string | null
  caughtAt: number | null
  created: number
}

/** F103 比划猜对局 */
export interface CoupleGuessVO {
  id: string
  day: string
  fromUser: string
  word: string | null
  clue: string | null
  guess: string | null
  attempts: number
  status: string
  settledAt: number | null
  created: number
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

/** F104 故事接龙（链） */
export interface CoupleStoryChainVO {
  chainId: string
  lines: CoupleStoryLineVO[]
  finished: boolean
  updated: number
}

/** F105 词典小考题 */
export interface CoupleDictQuizVO {
  wordId: string
  word: string
  options: string[]
  correctIndex: number
}

/** F107 道歉三部曲 */
export interface CoupleApologyVO {
  id: string
  fromUser: string
  whatWrong: string
  whyWrong: string
  willDo: string
  status: string
  acceptedAt: number | null
  created: number
}

/** F108 情绪词汇 */
export interface CoupleFeelingVO {
  id: string
  fromUser: string
  day: string
  word: string
  note: string | null
  created: number
}

/** F109 晚安电台 */
export interface CoupleRadioVO {
  title: string | null
  artist: string | null
  reason: string | null
  line: string
  hasSong: boolean
}

// ============ 情侣空间·异地恋（F110-F119） ============

export interface CoupleHandholdVO {
  todayMine: boolean
  todayPartner: boolean
  todayBoth: boolean
  totalDays: number
  milestone: string | null
  recent: { id: string; day: string; holdA: number; holdB: number }[]
}

export interface CoupleMissDailyVO {
  todayMine: boolean
  todayPartner: boolean
  todayBoth: boolean
  bothTimes: number
  milestone: string | null
  recent: { id: string; day: string; missA: number; missB: number; bothAt: number | null }[]
}

export interface CoupleRoutineOverlapVO {
  start: string
  end: string
}

export interface CoupleRoutineVO {
  mine: { wakeTime: string; workStart: string; workEnd: string; sleepTime: string } | null
  partner: { wakeTime: string; workStart: string; workEnd: string; sleepTime: string } | null
  overlaps: CoupleRoutineOverlapVO[]
}

export interface CoupleReunionLetterVO {
  id: string
  fromUser: string
  mine: boolean
  status: 'SEELED' | 'OPENED'
  content: string | null
  openedAt: number | null
  canOpen: boolean
  created: number
}

export interface CoupleCloudDateVO {
  id: string
  fromUser: string
  item: string
  status: 'OPEN' | 'DONE'
  doneNote: string | null
  doneAt: number | null
  created: number
}

export interface CoupleSafetyVO {
  id: string
  fromUser: string
  kind: 'GO_OUT' | 'ARRIVE'
  note: string | null
  created: number
}

export interface CoupleReunionLogVO {
  id: string
  meetDay: string
  note: string | null
  byUser: string
  intervalDays: number | null
  created: number
}

export interface CoupleEnergyVO {
  daysSince: number | null
  energy: number
  line: string
}

export interface CoupleDistanceReportVO {
  totalDays: number
  meetCount: number
  avgIntervalDays: number | null
  missBothDays: number
  handholdDays: number
  cloudDoneCount: number
  sealedLetters: number
  summary: string
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

export interface CoupleSecurityBoardVO {
  balance: number
  recent: CoupleSecurityItemVO[]
}

export interface CoupleCheckupItemVO {
  name: string
  score: number
  advice: string
}

export interface CoupleCheckupVO {
  total: number
  level: string
  items: CoupleCheckupItemVO[]
}

export interface CoupleDecadeVO {
  mine: { content: string; created: number } | null
  partner: { content: string; created: number } | null
  complete: boolean
}

export interface CoupleVisionVO {
  id: string
  fromUser: string
  word: string
  note: string | null
  resonate: boolean
  mine: boolean
  created: number
}

export interface CoupleOathVO {
  id: string
  fromUser: string
  content: string
  stampMine: boolean
  stampPartner: boolean
  exhibited: boolean
  created: number
}

export interface CoupleTrustBoardVO {
  mineBalance: number
  partnerBalance: number
  recent: { id: string; fromUser: string; reason: string | null; created: number }[]
}

export interface CoupleRingVO {
  year: number
  days: number
  events: number
}

export interface CoupleRingBoardVO {
  years: number
  rings: CoupleRingVO[]
}

export interface CoupleContractVO {
  row: { id: string; title: string; content: string | null; countA: number; countB: number; created: number }
  myCount: number
  partnerCount: number
}

export interface CouplePetVO {
  id: string
  name: string
  kind: string
  careCount: number
  mood: string
  moodLine: string
  lastCareAt: number | null
  created: number
}

// ============ 情侣空间·趣味游戏（F130-F139） ============

export interface CoupleSurveyAnswerVO {
  qNo: number
  answer: string
}

export interface CoupleSurveyVO {
  total: number
  myCount: number
  partnerCount: number
  questions: string[]
  my: CoupleSurveyAnswerVO[]
  /** 只含我已作答题目的 TA 答案（答一题解锁一题） */
  partnerUnlocked: CoupleSurveyAnswerVO[]
}

export interface CoupleQuizVO {
  id: string
  fromUser: string
  mine: boolean
  question: string
  answerText: string | null
  status: 'OPEN' | 'ANSWERED' | 'JUDGED'
  verdict: 'RIGHT' | 'WRONG' | null
  created: number
}

export interface CoupleLoveWordVO {
  id: string
  fromUser: string
  word: string
  meaning: string | null
  created: number
}

export interface CoupleLessonVO {
  language: string
  word: string
  meaning: string
  collected: CoupleLoveWordVO[]
}

export interface CoupleBlindPickVO {
  id: string
  fromUser: string
  week: string
  picks: string
  created: number
}

export interface CoupleBlindVO {
  week: string
  mine: string[]
  partnerSubmitted: boolean
  planMine: string | null
  planPartner: string | null
  settled: boolean
  history: CoupleBlindPickVO[]
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

export interface CoupleBattleVO {
  id: string | null
  day: string
  status: 'OPEN' | 'FULL' | 'DONE'
  voted: boolean
  winner: string | null
  lines: CoupleBattleLineVO[]
  history: CoupleBattleRowVO[]
}

export interface CoupleHeartbeatVO {
  score: number
  line: string
}

/** F137 今日恋爱天气预报（与 F68 双人心情天气不同） */
export interface CoupleLoveWeatherVO {
  name: string
  emoji: string
  tip: string
}

export interface CoupleTarotVO {
  name: string
  emoji: string
  message: string
}

export interface CoupleArtVO {
  id: string
  fromUser: string
  title: string
  seed: number
  created: number
}

// ============ 情侣空间·深度陪伴（F140-F149） ============

export interface CoupleThemeSongVO {
  title: string
  artist: string
  reason: string
}

export interface CoupleDreamVO {
  id: string
  fromUser: string
  mine: boolean
  content: string
  created: number
}

export interface CoupleFoodNoteVO {
  id: string
  fromUser: string
  shop: string
  dish: string
  status: 'WANT' | 'EATEN'
  rating: number | null
  comment: string | null
  created: number
}

export interface CouplePartnerFactVO {
  id: string
  fromUser: string
  mine: boolean
  kind: 'TASTE' | 'NOGO' | 'FAV' | 'QUIRK'
  content: string
  created: number
}

export interface CoupleSosVO {
  id: string
  fromUser: string
  mine: boolean
  message: string | null
  status: 'SENT' | 'HELD'
  heldAt: number | null
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

export interface CoupleThreeVO {
  day: string
  mine: CoupleDailyThreeRowVO | null
  partner: CoupleDailyThreeRowVO | null
}

/** F146/F147：今日三条夸法 + 接头暗号（无表按日抽取） */
export interface CoupleDailyPraiseVO {
  praises: string[]
  codeword: string
}

export interface CoupleCustomBadgeVO {
  id: string
  fromUser: string
  title: string
  condition: string | null
  status: 'OPEN' | 'ISSUED'
  issuedAt: number | null
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

/** F149 恋爱仪表盘：今日甜蜜待办 + 近期回忆 */
export interface CoupleDashboardVO {
  todos: CoupleDashboardTodoVO[]
  memories: CoupleDashboardMemoryVO[]
}

// ============ 情侣空间·成长系（F150-F159） ============

export interface CoupleHabitStreakVO {
  id: string
  fromUser: string
  mine: boolean
  title: string
  targetDays: number
  doneDays: number
  doneToday: boolean
  status: 'OPEN' | 'DONE'
  doneAt: number | null
  created: number
}

export interface CoupleThanksVO {
  id: string
  fromUser: string
  mine: boolean
  content: string
  created: number
}

export interface CoupleFeelFamilyVO {
  family: string
  emoji: string
  words: string[]
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

export interface CoupleFeelVO {
  day: string
  mine: CoupleFeelRowVO | null
  partner: CoupleFeelRowVO | null
}

export interface CoupleWeekStarVO {
  week: string
  mine: { id: string; highlight: string; created: number } | null
  partner: { id: string; highlight: string; created: number } | null
}

export interface CoupleReadMinuteVO {
  day: string
  passage: string
  mine: { id: string; thought: string; created: number } | null
  partner: { id: string; thought: string; created: number } | null
}

export interface CoupleDelayVO {
  id: string
  fromUser: string
  mine: boolean
  title: string
  deadlineDay: string | null
  nagCount: number
  status: 'OPEN' | 'DONE'
  lastNagAt: number | null
  doneAt: number | null
  created: number
}

export interface CouplePraiseBankVO {
  id: string
  fromUser: string
  mine: boolean
  content: string
  scene: string | null
  created: number
}

export interface CoupleMorningVO {
  greeting: string
  luckyThing: string
  luckyColor: string
}

export interface CoupleYearKeywordVO {
  year: string
  keyword: string
  habitDays: number
  thanksCount: number
  feelCount: number
  summary: string
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

export interface CouplePoemChainVO {
  lines: CouplePoemLineVO[]
  todayWriter: string
  myTurn: boolean
  writtenToday: boolean
}

export interface CouplePoem3VO {
  id: string
  fromUser: string
  mine: boolean
  line1: string
  line2: string
  line3: string
  liked: boolean
  likedAt: number | null
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

export interface CoupleMorningBoxVO {
  mine: CoupleMorningNoteVO[]
  delivered: CoupleMorningNoteVO[]
}

export interface CoupleBottleVO {
  id: string
  fromUser: string
  mine: boolean
  mood: string
  content: string
  reply: string | null
  status: 'FLOATING' | 'REPLIED'
  repliedAt: number | null
  created: number
}

export interface CoupleCipherNoteVO {
  id: string
  fromUser: string
  mine: boolean
  cipher: string
  hint: string | null
  decodedBy: string | null
  decodedAt: number | null
  created: number
}

export interface CoupleSoulRowVO {
  id: string
  fromUser: string
  day: string
  answer: string
  created: number
}

export interface CoupleSoulVO {
  question: string
  mine: CoupleSoulRowVO | null
  partner: CoupleSoulRowVO | null
  bothAnswered: boolean
}

export interface CoupleJournalVO {
  id: string
  day: string
  fromUser: string
  mine: boolean
  sticker: string
  text: string
  updatedAt: number
  created: number
}

export interface CoupleLetterTemplateVO {
  title: string
  scene: string
  body: string
}

// ============ 情侣空间·默契亲密（F170-F179） ============

export interface CoupleSparkQuizOptionVO {
  text: string
  lang: string
}

export interface CoupleSparkQuizVO {
  question: string
  optionA: CoupleSparkQuizOptionVO
  optionB: CoupleSparkQuizOptionVO
}

export interface CoupleLoveLangVO {
  fromUser: string
  mine: boolean
  scores: number[]
  primaryLang: string
  updatedAt: number
}

export interface CoupleLoveLangPairVO {
  mine: CoupleLoveLangVO
  partner: CoupleLoveLangVO
  myLang: string
  partnerLang: string
  myTip: string
  partnerTip: string
}

export interface CoupleFlashVO {
  id: string
  fromUser: string
  mine: boolean
  moment: string
  created: number
}

export interface CoupleWhatIfRowVO {
  id: string
  fromUser: string
  day: string
  answer: string
  created: number
}

export interface CoupleWhatIfVO {
  day: string
  question: string
  mine: CoupleWhatIfRowVO | null
  partner: CoupleWhatIfRowVO | null
  bothAnswered: boolean
  firstStar: string | null
}

export interface CoupleSignalVO {
  id: string
  fromUser: string
  mine: boolean
  signal: string
  meaning: string
  created: number
}

export interface CoupleTapResultVO {
  diffMs: number | null
  hit: boolean
  bestMs: number | null
  attempts: number
  hits: number
}

export interface CoupleHeartDayVO {
  id: string
  day: string
  fromUser: string
  mine: boolean
  level: number
  updatedAt: number
}

export interface CoupleSyncRankVO {
  day: string
  bestMs: number
  attempts: number
  hits: number
}

export interface CoupleSparkDashboardVO {
  score: number
  label: string
  bestMs: number | null
  whatIfBothDays: number
  heartDays: number
  signals: number
}

export interface CoupleSparkWeeklyVO {
  whatIfBoth: number
  heartMarks: number
  syncAttempts: number
  summary: string
}

// ============ 情侣空间·生活经营（F180-F189） ============

export interface CoupleManageMeetingVO {
  id: string
  week: string
  topic: string
  decision: string
  followDay: string | null
  raisedBy: string
  mine: boolean
  closed: boolean
  created: number
}

export interface CoupleManageHostVO {
  week: string
  host: string
  mine: boolean
  plan: string
}

export type CoupleManageSkillStatus = 'OPEN' | 'TAKEN' | 'DONE'

export interface CoupleManageSkillVO {
  id: string
  fromUser: string
  mine: boolean
  teach: string
  learn: string
  status: CoupleManageSkillStatus
  created: number
}

export interface CoupleManageMonthReviewVO {
  id: string
  month: string
  fromUser: string
  mine: boolean
  stars: number
  advice: string
  updatedAt: number
}

export interface CoupleManageMonthBoardVO {
  month: string
  mine: CoupleManageMonthReviewVO | null
  partner: CoupleManageMonthReviewVO | null
  bothDone: boolean
}

export interface CoupleManageEmergencyCardVO {
  fromUser: string
  mine: boolean
  contacts: string
  keysPlace: string
  medicine: string
  updatedAt: number
}

export interface CoupleManageSnapshotVO {
  id: string
  month: string
  fromUser: string
  mine: boolean
  work: string
  health: string
  loveTemp: number
  updatedAt: number
}

export interface CoupleManageRewardVO {
  code: string
  name: string
  emoji: string
  points: number
  affordable: boolean
}

export type CoupleManagePointType = 'EARN' | 'SPEND'

export interface CoupleManagePointHistoryVO {
  id: string
  fromUser: string
  mine: boolean
  type: CoupleManagePointType
  item: string
  points: number
  created: number
}

export interface CoupleManagePointAccountVO {
  balance: number
  totalEarned: number
  rewards: CoupleManageRewardVO[]
  history: CoupleManagePointHistoryVO[]
}

export type CoupleManagePlanTrack = 'MINE' | 'OURS'

export interface CoupleManageFiveYearPlanVO {
  id: string
  track: CoupleManagePlanTrack
  fromUser: string
  mine: boolean
  content: string
  ownerUser: string | null
  done: boolean
  created: number
}

export type CoupleManageAnnivStatus = 'IDEA' | 'LOCKED' | 'DONE'

export interface CoupleManageAnnivPlanVO {
  id: string
  day: string
  title: string
  planner: string
  mine: boolean
  idea: string
  status: CoupleManageAnnivStatus
  updatedAt: number
}

export interface CoupleManageWeeklyVO {
  meetings: CoupleManageMeetingVO[]
  closedMeetings: CoupleManageMeetingVO[]
  earned: number
  spent: number
  host: CoupleManageHostVO | null
  summary: string
}

// ============ 情侣空间·时光博物馆（F190-F199） ============

export interface CoupleMuseumDocSceneVO {
  id: string
  title: string
  actOne: string
  actTwo: string
  actThree: string
  fromUser: string
  mine: boolean
  created: number
}

export interface CoupleMuseumExhibitVO {
  id: string
  name: string
  story: string
  obtainedDay: string | null
  fromUser: string
  mine: boolean
  created: number
}

export interface CoupleMuseumAchievementVO {
  code: string
  name: string
  emoji: string
  desc: string
  unlocked: boolean
  unlockedBy: string | null
  unlockedAt: number | null
}

export interface CoupleMuseumYearCounterVO {
  thanks: number
  journal: number
  flash: number
}

export interface CoupleMuseumMirrorVO {
  lastYearDay: string
  thisYearDay: string
  lastYear: CoupleMuseumYearCounterVO
  thisYear: CoupleMuseumYearCounterVO
  summary: string
}

export interface CoupleMuseumSilverLineVO {
  day: string
  line: string
}

export interface CoupleMuseumWordVO {
  word: string
  count: number
}

export type CoupleMuseumRuleKind = 'RULE' | 'AMENDMENT'

export interface CoupleMuseumRuleVO {
  id: string
  kind: CoupleMuseumRuleKind
  refId: string | null
  content: string
  proposedBy: string
  mine: boolean
  signed: boolean
  signedBy: string | null
  created: number
}

export interface CoupleMuseumDndVO {
  fromUser: string
  mine: boolean
  startTime: string
  endTime: string
  enabled: boolean
  updatedAt: number | null
}

export interface CoupleMuseumChapterVO {
  month: string
  title: string
  line: string
}

export interface CoupleMuseumBookVO {
  year: string
  chapters: CoupleMuseumChapterVO[]
}

/** F197 今日问候条（含静音时段标识） */
export interface CoupleMuseumGreetingVO {
  period?: string
  icon: string
  text: string
  daysTogether?: number
  quietNow: boolean
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

/** F210/F211 今日饭桌：双方饭票 + 撞菜命中 + 吃什么裁决 + 今日话题打卡 */
export interface CoupleDineTodayVO {
  day: string
  mine: CoupleDineTicketVO | null
  partner: CoupleDineTicketVO | null
  hit: boolean
  verdict: string | null
  topic: string
  topicMarked: boolean
}

/** F215 餐厅星评流水 */
export interface CoupleDineRateVO {
  id: string
  day: string
  dish: string
  stars: number
  comment: string
  fromUser: string
  mine: boolean
  created: number
}

/** F216 踩雷库条目（仅提议人可删） */
export interface CoupleDineNogoVO {
  id: string
  name: string
  reason: string
  fromUser: string
  mine: boolean
  created: number
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

/** F212-F214 本周饭桌整板（写接口均返回全量，前端整体替换） */
export interface CoupleDineBoardVO {
  week: string
  plans: CoupleDinePlanVO[]
  homecooks: CoupleDineHomecookVO[]
  cart: CoupleDineCartVO[]
}

/** F219 点单机：心情 5 选 1 → 今日一杯 */
export interface CoupleDineDrinkVO {
  mood: string
  emoji: string
  name: string
  note: string
}

/** F217 年度干饭账：最常点菜 top 项 */
export interface CoupleDineDishTopVO {
  dish: string
  times: number
  avgStars: number
}

/** F217 年度干饭账总览 */
export interface CoupleDineYearVO {
  year: string
  rateCount: number
  avgStars: number
  topDishes: CoupleDineDishTopVO[]
  nogoCount: number
  ticketCount: number
  plannedCount: number
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

/** F220-F228 今日体温总览（所有卡片一次拉齐，写接口均返回整份前端整体替换） */
export interface CoupleCozyTodayVO {
  day: string
  lightout: CoupleCozyLightoutVO
  sleeps: CoupleCozySleepVO[]
  sheep: CoupleCozySheepVO
  water: CoupleCozyWaterVO
  weathers: CoupleCozyWeatherVO[]
  latenight: CoupleCozyLatenightVO
  slows: CoupleCozySlowVO[]
  remedies: CoupleCozyRemedyVO[]
  hug: CoupleCozyHugVO
}

/** F229 月度安眠小结（index 为体温同步指数 0-100） */
export interface CoupleCozyMonthlyVO {
  month: string
  bothLitNights: number
  bestStreak: number
  sleepReports: number
  avgStars: number
  sheepDone: number
  cupsTotal: number
  index: number
}

// ============ 小日子·仪式感（F230-F239） ============

/** F232 过法任务卡条目（markedToday=今天是否已打勾） */
export interface CoupleCerRitualVO {
  id: string
  foundedId: string
  content: string
  markedToday: boolean
}

/** F230 我们的小日子（一次性日子过期后 nextDay/daysLeft/edition 为 null） */
export interface CoupleCerFoundedVO {
  id: string
  name: string
  startDay: string
  repeatYear: boolean
  nextDay: string | null
  daysLeft: number | null
  edition: number | null
  rituals: CoupleCerRitualVO[]
}

/** F231 老黄历统一倒数条目（kind：小日子/纪念日/倒数日） */
export interface CoupleCerAlmanacVO {
  kind: 'founded' | 'anniversary' | 'countdown'
  title: string
  day: string
  daysLeft: number
}

/** F234 爱情保险柜本月状态（mine/partner=本月双方互夸句，未交为 null） */
export interface CoupleCerPolicyVO {
  month: string
  mine: string | null
  partner: string | null
  paidMonths: number
  paidMilestones: number[]
  monthsToNext: number | null
}

/** F235 续约长卷上的一句话 */
export interface CoupleCerRenewLineVO {
  anchorDay: string
  fromUser: string
  mine: boolean
  line: string
}

/** F235 续约仪式状态（dueToday=今天正是续约日，可签字） */
export interface CoupleCerRenewVO {
  anchorDay: string
  dueToday: boolean
  mineSigned: boolean
  partnerSigned: boolean
  daysToNext: number
  scroll: CoupleCerRenewLineVO[]
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

/** F238 年度加冕（仅 520/跨年/元旦当天非 null） */
export interface CoupleCerCrownVO {
  year: number
  open: string
  top: CoupleCerCrownItemVO[]
}

/** F230-F239 今日仪式总览（所有写接口均返回整份，前端整体替换） */
export interface CoupleCerOverviewVO {
  day: string
  yi: string
  ji: string
  founded: CoupleCerFoundedVO[]
  almanac: CoupleCerAlmanacVO[]
  nudges: string[]
  policy: CoupleCerPolicyVO
  renew: CoupleCerRenewVO
  couponsOpen: CoupleCerCouponVO[]
  couponsUsed: CoupleCerCouponVO[]
  recapsToday: CoupleCerRecapVO[]
  recapsLastYear: CoupleCerRecapVO[]
  crown: CoupleCerCrownVO | null
}

/** F237 小日子史册：一年一页 */
export interface CoupleCerChroniclePageVO {
  day: string
  marked: number
  ritualTotal: number
  feelings: CoupleCerRecapVO[]
}

/** F237 小日子史册整卷 */
export interface CoupleCerChronicleVO {
  foundedId: string
  name: string
  pages: CoupleCerChroniclePageVO[]
}

// ============ 我们公司（F240-F249） ============

/** F240 头衔任命单（mine=我发起的封官；appointed=被任命者已盖章生效） */
export interface CoupleBdRoleVO {
  id: string
  fromUser: string
  toUser: string
  mine: boolean
  title: string
  appointed: boolean
}

/** F241 董事会议案（status：PENDING 在议 / PASSED 通过 / VETOED 否决；canVote=待表决且非提案人） */
export interface CoupleBdVoteVO {
  id: string
  title: string
  proposer: string
  mine: boolean
  status: 'PENDING' | 'PASSED' | 'VETOED' | string
  vetoBy: string | null
  created: number | null
  decidedAt: number | null
  canVote: boolean
}

/** F242 年度述职（对方一份仅双提交后可见，未交/不可见为 null） */
export interface CoupleBdReportVO {
  year: string
  mineReview: string | null
  mineGoal: string | null
  partnerReview: string | null
  partnerGoal: string | null
  bothIn: boolean
}

/** F244 发薪日本月状态（payDay=本月最早发薪日号，未发为 null；monthsPaid=累计发薪月数） */
export interface CoupleBdSalaryVO {
  month: string
  mineThanks: string | null
  partnerThanks: string | null
  bothPaid: boolean
  payDay: number | null
  monthsPaid: number
}

/** F245 金点子（adopted=已被采纳并转成 voteId 对应的董事会决议） */
export interface CoupleBdIdeaVO {
  id: string
  fromUser: string
  mine: boolean
  content: string
  adopted: boolean
  voteId: string | null
  created: number | null
}

/** F247 例会签到（convened=10 秒窗口内双签到、本次会议已召开） */
export interface CoupleBdAttendVO {
  day: string
  mineAttended: boolean
  partnerAttended: boolean
  convened: boolean
}

/** F243 成员职级档案（按积分台账累计赚分定档；已是最高职级时 nextRank/pointsToNext 为 null） */
export interface CoupleBdMemberVO {
  user: string
  titles: string[]
  earned: number
  rank: string
  nextRank: string | null
  pointsToNext: number | null
}

/** F248 公司名片（后端拼好的文字行） */
export interface CoupleBdCardVO {
  lines: string[]
}

/** F249 公司版经营周报（本周决议/点子/赚分） */
export interface CoupleBdWeeklyVO {
  week: string
  votes: number
  ideas: number
  pointsEarned: number
}

/** F240-F249 我们公司总览（所有写接口均返回整份，前端整体替换） */
export interface CoupleBdOverviewVO {
  day: string
  week: string
  roles: CoupleBdRoleVO[]
  votes: CoupleBdVoteVO[]
  report: CoupleBdReportVO
  salary: CoupleBdSalaryVO
  ideas: CoupleBdIdeaVO[]
  attend: CoupleBdAttendVO
  members: CoupleBdMemberVO[]
  card: CoupleBdCardVO
  weekly: CoupleBdWeeklyVO
}

// ============ 夫妻老黄历（F250-F259） ============

/** F250 节气当日跟风的人（mine=我点的；note=晒的那一句话，没写为空串） */
export interface CoupleAlmCheckUserVO {
  fromUser: string
  note: string
  mine: boolean
}

/** F250-F251 今日节气头牌（非节气日 term 为 null；下个节气无数据时 nextTerm/nextDays 为 null） */
export interface CoupleAlmTermTodayVO {
  term: string | null
  nextTerm: string | null
  nextDays: number | null
  todayChecks: CoupleAlmCheckUserVO[]
}

/** F251 节气过法卡（mine=我写的，只有我能划；lastDoneYear 空串=今年还没打勾） */
export interface CoupleAlmRitualVO {
  id: string
  term: string
  content: string
  mine: boolean
  lastDoneYear: string
}

/** F252 择吉日（mine=我择的日，等 TA 盖章；confirmed=双盖章已生效；comment=黄历点评） */
export interface CoupleAlmLuckyVO {
  id: string
  day: string
  matter: string
  comment: string
  mine: boolean
  confirmed: boolean
}

/** F254 节日家档（一天一节日的今年过法，mine/partner 双案互见，空串=没交卷） */
export interface CoupleAlmFestivalVO {
  key: string
  label: string
  day: string
  mine: string
  partner: string
}

/** F255 节气手账（一人一笔，本人可改写，空串=没写） */
export interface CoupleAlmNoteVO {
  term: string
  mine: string
  partner: string
}

/** F257 长假愿望（wish 为两段共写文本，空串=还没人写） */
export interface CoupleAlmHolidayVO {
  key: string
  name: string
  day: string
  daysLeft: number | null
  wish: string
  wishedBy: string
  appendedBy: string
}

/** F258 反仪式感放空日（today=今天正是放空日，当日挡打卡；days=今年已提报的日期） */
export interface CoupleAlmNormalVO {
  today: boolean
  days: string[]
}

/** F253 农历生日换算（lunarMd=mmdd 四位农历月日，nextSolars=未来对应公历日） */
export interface CoupleAlmLunarVO {
  id: string
  title: string
  lunarMd: string
  nextSolars: string[]
}

/** F250-F259 今日老黄历总览（除 zodiac/yearly 外全部写接口均返回整份，前端整体替换） */
export interface CoupleAlmTodayVO {
  day: string
  year: string
  term: CoupleAlmTermTodayVO
  rituals: CoupleAlmRitualVO[]
  lucky: CoupleAlmLuckyVO[]
  festivals: CoupleAlmFestivalVO[]
  notes: CoupleAlmNoteVO[]
  holiday: CoupleAlmHolidayVO | null
  normal: CoupleAlmNormalVO
  lunar: CoupleAlmLunarVO[]
}

/** F256 生肖年运（未填生日时后端给「未填生日」） */
export interface CoupleAlmZodiacVO {
  zodiacMine: string
  zodiacPartner: string
  fortune: string
}

/** F259 一年日子小结（计数 + 节气长卷 scroll） */
export interface CoupleAlmYearVO {
  year: string
  checksDone: number
  notesDone: number
  ritualsTotal: number
  ritualsDone: number
  luckyCount: number
  festivalPlans: number
  normalDays: number
  scroll: string[]
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

/** F260-F269 今日倾听台总览（slot/proxyDraft/truce/nameDay 可为 null；除 today 外全部写接口均返回整份，前端整体替换） */
export interface CoupleLsTodayVO {
  day: string
  week: string
  slot: CoupleLsSlotVO | null
  recentSlots: CoupleLsSlotVO[]
  proxyDraft: CoupleLsProxyVO | null
  adopted: CoupleLsProxyVO[]
  misrewinds: CoupleLsMisVO[]
  stuck: CoupleLsStuckVO[]
  letters: CoupleLsLetterVO[]
  holds: CoupleLsHoldVO[]
  nextHoldDay: string | null
  three: CoupleLsThreeVO
  tones: CoupleLsToneVO[]
  truce: CoupleLsTruceVO | null
  nameDay: CoupleLsNameDayVO | null
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

/** F271 采买清单一项（qty 是「两板鸡蛋」这类口语数量，空串=没写；doneBy 空串=还没人买回来） */
export interface CoupleFyShopVO {
  id: string
  name: string
  qty: string
  fromUser: string
  mine: boolean
  doneBy: string
}

/** F272 冰箱库存一件（expireDay 空串=没写赏味期；expiring=3 天内到期，行高亮提醒） */
export interface CoupleFyStockVO {
  id: string
  item: string
  qty: string
  expireDay: string
  mine: boolean
  expiring: boolean
}

/** F273 代拿快递一单（note 空串=没描述；grabber 空串=还没人领养） */
export interface CoupleFyParcelVO {
  id: string
  note: string
  fromUser: string
  mine: boolean
  status: CoupleFyParcelStatus
  grabber: string
}

/** F274 本周叫醒词一条（givenToday=今天这张卡已经递过了，一天一张） */
export interface CoupleFyWakeVO {
  fromUser: string
  content: string
  mine: boolean
  givenToday: boolean
}

/** F275 在服药物一条（remindedToday/takenToday=今天这一格是否已打；streak=连续链天数） */
export interface CoupleFyMedVO {
  id: string
  name: string
  times: string
  fromUser: string
  mine: boolean
  remindedToday: boolean
  takenToday: boolean
  streak: number
}

/** F276 久坐互拍状态（mineToday/partnerToday=今天各自拍过没；pairedToday=今日常规同起；weekPairedDays=本周同起天数） */
export interface CoupleFyStandVO {
  mineToday: boolean
  partnerToday: boolean
  pairedToday: boolean
  weekPairedDays: number
}

/** F277 垫付本一笔（mine=我垫的，欠款方是 TA；amountCents 单位分；daysOpen=挂了几天） */
export interface CoupleFyAdvanceVO {
  id: string
  item: string
  payerUser: string
  amountCents: number
  note: string
  mine: boolean
  daysOpen: number
}

/** F278 本周战利品一单（guess/guessBy 空串=TA 还没猜；score=null=我还没打分） */
export interface CoupleFyGroceryVO {
  id: string
  week: string
  fromUser: string
  mine: boolean
  items: string
  guess: string
  guessBy: string
  score: number | null
}

/** F279 家安月检本月双签（mine/partner 空串=那份没交，内容为逗号分隔的六项编码） */
export interface CoupleFyCheckVO {
  month: string
  mine: string
  partner: string
  bothIn: boolean
}

/**
 * F270-F279 本周车间总览（十卡一次拉齐）。
 * 除 board 读接口外，24 个 POST 写接口全部返回整份 BoardVO，前端整体替换即五卡刷新；
 * shopChampion 空串=本月还没有生活委员，owed/expiring/checkMiss 为空数组=没有欠账/临期/漏检。
 */
export interface CoupleFyBoardVO {
  day: string
  week: string
  month: string
  spins: CoupleFySpinVO[]
  owed: string[]
  spinLine: string
  shop: CoupleFyShopVO[]
  shopChampion: string
  stock: CoupleFyStockVO[]
  expiring: string[]
  parcels: CoupleFyParcelVO[]
  wake: CoupleFyWakeVO[]
  meds: CoupleFyMedVO[]
  stand: CoupleFyStandVO
  advances: CoupleFyAdvanceVO[]
  openTotalCents: number
  groceries: CoupleFyGroceryVO[]
  check: CoupleFyCheckVO
  checkMiss: string[]
}

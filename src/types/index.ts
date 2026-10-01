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

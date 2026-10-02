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

/**
 * F280-F289 我们百科总览（十个板块一次拉齐）。
 * 除 overview 读接口外，全部 POST 写接口都返回整份 OverviewVO，前端整体替换即五卡刷新；
 * todayQuiz=null 表示今天还没开场，type=null 表示今年两人都没报过人格。
 */
export interface CoupleCxOverviewVO {
  day: string
  entries: CoupleCxEntryVO[]
  todayQuiz: CoupleCxQuizVO | null
  history: CoupleCxQuizVO[]
  tops: CoupleCxTopBoardVO[]
  stories: CoupleCxStoryVO[]
  exams: CoupleCxExamVO[]
  places: CoupleCxPlaceVO[]
  firstLook: CoupleCxFirstLookVO
  habits: CoupleCxHabitVO[]
  tastes: CoupleCxTasteVO[]
  type: CoupleCxTypeVO | null
  entryCount: number
}

// ============ 明日邮局（F290-F299） ============

/** F291 人生大事状态（OPEN 进行中 / DONE 步骤走完 / GONE 发起人放下了；总览只下发 OPEN） */
export type CouplePostBucketStatus = 'OPEN' | 'DONE' | 'GONE'

/** F292 拍卖单状态（SHELF 在架等认领 / TAKEN 已认领并排了期 / DONE 真做了销单 / EXPIRED 7 天没人接落灰；总览只下发 SHELF 与 TAKEN） */
export type CouplePostSomedayStatus = 'SHELF' | 'TAKEN' | 'DONE' | 'EXPIRED'

/** F296 时光胶囊接龙状态（SEALED 封存中 / OPENED 已被拆开） */
export type CouplePostRelayStatus = 'SEALED' | 'OPENED'

/** F299 未来信用卡的旗状态（OPEN 立着 / KEPT 圆上了 / BROKEN 逾期没圆上；总览只下发 OPEN） */
export type CouplePostCreditStatus = 'OPEN' | 'KEPT' | 'BROKEN'

/**
 * F290 五年后新年卡一张（只下发我写的，一年一张）。
 * sent=已到 deliverDay 被后端放行寄出（再改写会 400「这张已经寄出去了」）；
 * partnerContent=TA 那年的卡，只有 TA 那张也寄出了才给正文，空串=还没到 / TA 没写。
 */
export interface CouplePostOathVO {
  id: string
  year: string
  content: string
  deliverDay: string
  mine: boolean
  sent: boolean
  partnerContent: string
}

/**
 * F291 大事拆的一步（seq 从 1 起；doneBy 空串=还没人打勾）。
 * ⚠️ 以后端源码为准：CouplePostService.StepVO 已定义但没有挂进 PostVO，BucketVO 只下发
 * doneSteps/totalSteps 两个计数，且 StepVO 本身不含 id，所以逐条打勾要等后端补下 steps（含 id）才能点亮；
 * 前端按「bucket.steps 有值就渲染行内打勾钮」实现，没下发时退化成进度条。
 */
export interface CouplePostStepVO {
  id?: string
  seq: number
  text: string
  done: boolean
  doneBy: string
}

/** F291 一件人生大事（mine=我立的，只有立的人能放弃；targetDay/note 空串=没写；status 见 CouplePostBucketStatus） */
export interface CouplePostBucketVO {
  id: string
  name: string
  targetDay: string
  note: string
  mine: boolean
  status: CouplePostBucketStatus
  doneSteps: number
  totalSteps: number
  steps?: CouplePostStepVO[]
}

/**
 * F292 拍卖货架上的一单（mine=我上的架，自己的架不能自己接；takenBy 空串=还没人接；scheduledDay 空串=没排期）。
 * daysLeft 双语义：SHELF=在架还剩几天（0=今天没人接就落灰下架），TAKEN=离排期日还有几天。
 */
export interface CouplePostSomedayVO {
  id: string
  thing: string
  mine: boolean
  status: CouplePostSomedayStatus
  takenBy: string
  scheduledDay: string
  daysLeft: number
}

/** F293 某一版「想象中的家」（只下发我的版本，partnerIn=TA 是否也交了同年版；四个字段空串=没填，各 ≤100 字；同年可改写） */
export interface CouplePostHomeVO {
  year: string
  rooms: string
  windowView: string
  smell: string
  corner: string
  mine: boolean
  partnerIn: boolean
}

/** F294 退休计划一档（ageBand 只有 30 / 40 / 50；mine/partner 空串=那位还没写；bothIn=双写完成可对照分歧） */
export interface CouplePostRetireVO {
  ageBand: string
  mine: string
  partner: string
  bothIn: boolean
}

/** F295 许愿井周问（week=本周周一 yyyy-MM-dd；myAnswer/partnerAnswer 空串=没答；bothIn=双答完成） */
export interface CouplePostWellVO {
  week: string
  question: string
  myAnswer: string
  partnerAnswer: string
  bothIn: boolean
}

/**
 * F296 时光胶囊接龙一笔（mine=我写的，我写的归 TA 拆；due=TA 写的且已到开启日，才给拆封钮）。
 * ⚠️ 以后端源码为准：RelayVO 不下发 content，所以拆封前后都看不到正文，要等后端补字段。
 */
export interface CouplePostRelayVO {
  id: string
  mine: boolean
  openDay: string
  status: CouplePostRelayStatus
  due: boolean
}

/** F297 解梦局一案（mine=我做的梦，只有做梦人能盖章；reading/readBy 空串=解梦官还没点评；good：null 没盖 / 1 解得灵 / 0 胡说八道） */
export interface CouplePostDreamVO {
  id: string
  day: string
  dream: string
  mine: boolean
  reading: string
  readBy: string
  good: number | null
}

/** F298 周年愿望一条（mine=我立的愿，只有本人能给自己盖章；verdict 空串=没盖，KEPT 圆上了 / PIGEON 鸽了；只有往年才可盖章） */
export interface CouplePostWishVO {
  id: string
  year: string
  wish: string
  mine: boolean
  verdict: string
}

/** F299 一张还立着的旗（总览只下发 OPEN；mine=我立的旗，只有我能销；daysLeft=离兑现期限还有几天） */
export interface CouplePostCreditVO {
  id: string
  promise: string
  dueDay: string
  mine: boolean
  status: CouplePostCreditStatus
  daysLeft: number
}

/** F299 未来信用卡额度条（tier=后端算好的档位文案；kept/broken=我名下兑现/逾期数；open=两人合计还立着的旗数） */
export interface CouplePostCreditLineVO {
  tier: string
  kept: number
  broken: number
  open: number
}

/**
 * F290-F299 明日邮局总览（GET /api/couple/post/box 一次拉齐；20 个 POST 写接口全部返回整份 PostVO，前端整体替换即五卡刷新）。
 * day/week/year 由后端下发（今天 / 本周周一 / 今年年份）；well 与 creditLine 恒有值；
 * wellYear=本年我的井答存档（带 TA 那份）；列表口径按后端：大事只给 OPEN、旗只给 OPEN、梦案最近 15 条、货架只给 SHELF/TAKEN。
 */
export interface CouplePostVO {
  day: string
  week: string
  year: string
  oaths: CouplePostOathVO[]
  buckets: CouplePostBucketVO[]
  somedays: CouplePostSomedayVO[]
  homes: CouplePostHomeVO[]
  retires: CouplePostRetireVO[]
  well: CouplePostWellVO
  wellYear: CouplePostWellVO[]
  relays: CouplePostRelayVO[]
  dreams: CouplePostDreamVO[]
  wishes: CouplePostWishVO[]
  credits: CouplePostCreditVO[]
  creditLine: CouplePostCreditLineVO
}

// ============ 扮演剧场（F300-F309） ============
// 字段逐一对齐后端 com.smart.chat.couple.CoupleTheaterService 的嵌套 record：
// 只有对应 Java Integer 的字段（RoleVO.myRate|partnerRate、TicketVO.score）可空，
// 其余字符串后端一律给空串（空串=没写 / 没答 / 没判 / 没定级）。

/** F303 跨时空电话去向：PAST 当场接通（带杂音彩蛋），FUTURE 封存到一年后 */
export type CoupleTheaterBoothKind = 'FUTURE' | 'PAST'

/** F303 电话状态：SEALED 封存中等开放日（读时到点由后端惰性结算成 SENT）/ SENT 已接通 */
export type CoupleTheaterBoothStatus = 'SEALED' | 'SENT'

/** F302 出师定级章：GRADUATED 出师 / REPEAT 留级（后端只认这两个，其它 400） */
export type CoupleTheaterGrade = 'GRADUATED' | 'REPEAT'

/** F307 双角色追剧状态（⚠️ 以后端源码为准：status 与 finished 都只在「两人都剧终」时才 FINISHED/true） */
export type CoupleTheaterMovieStatus = 'ONGOING' | 'FINISHED'

/** F308 工单状态机：OPEN 待接 → ANSWERED 已接 → RATED 已评 → APPEALED 客服申诉过 */
export type CoupleTheaterTicketStatus = 'OPEN' | 'ANSWERED' | 'RATED' | 'APPEALED'

/** F300 今日身份签（同空间同日同一身份；myRate/partnerRate：null=那位还没打分） */
export interface CoupleTheaterRoleVO {
  day: string
  roleName: string
  guide: string
  mineRated: boolean
  myRate: number | null
  partnerRate: number | null
  bothRated: boolean
}

/** F301 一天两页「作为对方的一天」（mine=我写的那页，可改写；partner 只在双齐时才下发，空串=还没双齐） */
export interface CoupleTheaterDiaryVO {
  day: string
  mine: string
  partner: string
  bothIn: boolean
}

/** F302 本周师徒日（iAmMaster=这周我是师父；serveTarget 后端常量 3；grade 空串=本周还没定级） */
export interface CoupleTheaterMasterVO {
  week: string
  masterUser: string
  apprenticeUser: string
  iAmMaster: boolean
  serveCount: number
  serveTarget: number
  servedToday: boolean
  canReview: boolean
  review: string
  grade: CoupleTheaterGrade | ''
}

/** F303 一通跨时空电话（daysLeft 仅 SEALED 有值=离开放日还剩几天；line 仅已接通时给杂音话术，封存中是空串） */
export interface CoupleTheaterBoothVO {
  id: string
  mine: boolean
  kind: CoupleTheaterBoothKind
  text: string
  openDay: string
  status: CoupleTheaterBoothStatus
  daysLeft: number
  line: string
}

/** F304 一条黑话词条（meaning/origin 空串=没写；quizBy 空串=没人作答；judged 空串=没判，否则 RIGHT|WRONG；canQuiz/canJudge 后端算好） */
export interface CoupleTheaterRefVO {
  id: string
  term: string
  meaning: string
  origin: string
  mine: boolean
  quizAnswer: string
  quizBy: string
  judged: string
  canQuiz: boolean
  canJudge: boolean
}

/** F305 一次今日奥斯卡提名（mine=我递的那张，一人一天一次、可改写证据；⚠️ AwardVO 无 id，行按 day+fromUser 定位） */
export interface CoupleTheaterAwardVO {
  day: string
  fromUser: string
  aboutUser: string
  evidence: string
  mine: boolean
  line: string
}

/** F306 今日家长题（myAnswer 空串=我没答；partnerAnswer 在双答前恒为空串，后端做了互见闸门） */
export interface CoupleTheaterFamilyVO {
  day: string
  question: string
  myAnswer: string
  partnerAnswer: string
  bothIn: boolean
}

/** F307 一部剧上的双角色线（myRole 空串=我还没认领；partnerDiary 只有双方都剧终才下发；bothClaimed=两人都认领了） */
export interface CoupleTheaterMovieVO {
  work: string
  myRole: string
  myDiary: string
  partnerRole: string
  partnerDiary: string
  status: CoupleTheaterMovieStatus
  bothClaimed: boolean
  finished: boolean
}

/** F308 一张服务工单（score null=顾客还没评；waitMinutes 仅 OPEN 有值=已等多久；canAnswer/canScore/canAppeal 全由后端算，前端不重复判定） */
export interface CoupleTheaterTicketVO {
  id: string
  note: string
  status: CoupleTheaterTicketStatus
  customerUser: string
  mineCustomer: boolean
  canAnswer: boolean
  canScore: boolean
  canAppeal: boolean
  onTime: boolean
  score: number | null
  appeal: string
  waitMinutes: number
}

/** F309 冷知识颁奖礼（后端读时聚合、无表：七项计数 + 当日奖项名与收尾话术） */
export interface CoupleTheaterGalaVO {
  day: string
  prize: string
  line: string
  nominations: number
  terms: number
  quizzed: number
  rights: number
  diaryDays: number
  onTimeOrders: number
  orders: number
}

/**
 * F300-F309 扮演剧场总览（GET /api/couple/theater/today 一次拉齐；16 个 POST 写接口全部返回整份 TheaterVO，
 * 前端整体替换即五卡刷新）。diaries/booths/refs/awards/movies/tickets 是**全量历史列表**（后端只按 created|day 倒序，
 * 不按状态过滤），master/role/family/gala 是恒有值的嵌套对象；本周口径由后端给（week=本周一）。
 */
export interface CoupleTheaterVO {
  day: string
  week: string
  role: CoupleTheaterRoleVO
  diaries: CoupleTheaterDiaryVO[]
  master: CoupleTheaterMasterVO
  booths: CoupleTheaterBoothVO[]
  refs: CoupleTheaterRefVO[]
  awards: CoupleTheaterAwardVO[]
  family: CoupleTheaterFamilyVO
  movies: CoupleTheaterMovieVO[]
  tickets: CoupleTheaterTicketVO[]
  gala: CoupleTheaterGalaVO
}

// ============ 身体通知系统（F310-F319） ============
// 字段逐一对齐后端 com.smart.chat.couple.CoupleBodyService 的嵌套 record：
// ⚠️ 本批 VO 里**没有任何 Java Integer/Long 包装类型**（全部是原生 int/long/boolean/String），
// 所以数字字段一律非空、不需要标 | null（对比批次二十六的 myRate/partnerRate）；
// 字符串字段后端一律给空串（空串=没报 / 没写 / 没人点评），分钟数与倒数日用 -1 表示「没发生」。
// 产品口径：后端只按用户自设阈值判断是否提醒，全链路无医疗建议，前端文案同样只说「我陪你做什么」。

/** F311 呼噜自报档位（后端 CoupleBodySnore.LEVELS 四档，其它值 400） */
export type CoupleBodySnoreLevel = 'NONE' | 'TINY' | 'MID' | 'HEAVY'

/** F312 周期阶段（后端 CoupleBodyCycle.PHASES；展示名走 phaseLabel，前端不自己翻译） */
export type CoupleBodyPhase = 'BEFORE' | 'MENSTRUATING' | 'AFTER' | 'OWULARE'

/** F313 互助营状态：OPEN 在营 / DONE 满天数结营 / GONE 提前收（后端按 campDays 与 targetDays 比较） */
export type CoupleBodyQuitStatus = 'OPEN' | 'DONE' | 'GONE'

/** F314 运动链项目（后端 CoupleBodyFit.KINDS 五种，其它值 400） */
export type CoupleBodyFitKind = 'PUSHUP' | 'SQUAT' | 'PLANK' | 'RUN' | 'STRETCH'

/** F315 身体不适 SOS 状态：SENT 在路上等接住 / HELD 已被接住 */
export type CoupleBodySosStatus = 'SENT' | 'HELD'

/** F316 忌口红线类型：ALLERGY 过敏（碰都不能碰）/ AVOID 忌口（后端缺省 AVOID） */
export type CoupleBodyRedlineKind = 'ALLERGY' | 'AVOID'

/** F317 体检状态（⚠️ 以后端源码为准：实体定义了 PLAN|ATTENDED|REPORTED 三态，但服务里只写 PLAN 与 REPORTED，虚拟陪同只翻 companion 标志） */
export type CoupleBodyCheckupStatus = 'PLAN' | 'ATTENDED' | 'REPORTED'

/** F318 本周身体账档位（后端 CoupleBodyMed.HOWS 三档，非医嘱、自愿记） */
export type CoupleBodyMedHow = 'STEADY' | 'HARD' | 'NONE'

/** F310 一天的体征行（近 7 天双发；mine=我报的那天那行；warn/warnText 只按**本人自设线**算，空串=没填该项） */
export interface CoupleBodyMetricVO {
  day: string
  mine: boolean
  temp: string
  weight: string
  sleepHours: string
  tempLimit: string
  sleepLimit: string
  note: string
  warn: boolean
  warnText: string
}

/** F311 今日呼噜双看板（myLevel/partnerLevel 空串=那位没报；myShake=我写出去的震感点评，partnerShake=TA 写给我的；iCanShake=TA 报了且我还没写；partnerScore=TA 档位换算的震感级数 0-3，NONE 与没报都是 0，要靠 partnerLevel 区分） */
export interface CoupleBodySnoreVO {
  day: string
  myLevel: CoupleBodySnoreLevel | ''
  partnerLevel: CoupleBodySnoreLevel | ''
  myShake: string
  partnerShake: string
  iCanShake: boolean
  partnerScore: number
}

/** F312 一天的周期标记（近 14 天双发；mine=我标的；phaseLabel 后端给中文；careCard 空串=还没人递卡；iCanCare=TA 标的且还没卡） */
export interface CoupleBodyCycleVO {
  day: string
  mine: boolean
  phase: CoupleBodyPhase | ''
  phaseLabel: string
  discomfort: string
  careCard: string
  careBy: string
  iCanCare: boolean
}

/** F313 一个互助营（mine=我开的营，破戒与结营只归本人；cheer 空串=陪绑的人还没说话；milestone 只在营龄满 7 的整数倍时非空） */
export interface CoupleBodyQuitVO {
  id: string
  name: string
  mine: boolean
  targetDays: number
  startDay: string
  campDays: number
  brokeCount: number
  cheer: string
  cheerBy: string
  status: CoupleBodyQuitStatus
  milestone: string
}

/** F314 一天一项目的运动链（近 7 天双发；minutesSincePartner=-1 表示 TA 今天没报，>=0 是距今几分钟；linked 由后端按 30 分钟窗口算） */
export interface CoupleBodyFitVO {
  day: string
  kind: CoupleBodyFitKind
  kindLabel: string
  myCount: number
  partnerCount: number
  linked: boolean
  partnerIn: boolean
  minutesSincePartner: number
}

/** F315 一条身体不适（options 由后端话术池下发；⚠️ 只有「我发的且还在路上」那条给空数组，其余情况一律给全量五句，前端只在 !mine && status==='SENT' 时渲染选项） */
export interface CoupleBodySosVO {
  id: string
  mine: boolean
  symptom: string
  since: string
  status: CoupleBodySosStatus
  comfort: string
  holdBy: string
  options: string[]
}

/** F316 一条忌口/过敏红线（kind ALLERGY|AVOID；note 空串=没写说明） */
export interface CoupleBodyRedlineVO {
  id: string
  item: string
  kind: CoupleBodyRedlineKind
  note: string
  mine: boolean
}

/** F316 红线撞上当日饭桌饭票的提示行（⚠️ 后端只下发撞上的项，没撞上就没有这一行） */
export interface CoupleBodyRedlineHitVO {
  item: string
  hits: number
  line: string
}

/** F317 一次体检约（daysLeft 可为负=已经过去了；companionLine 只在 TA 虚拟到场后非空；report 空串=检后还没交一句话） */
export interface CoupleBodyCheckupVO {
  id: string
  day: string
  mine: boolean
  item: string
  status: CoupleBodyCheckupStatus
  companioned: boolean
  report: string
  daysLeft: number
  iCanCompany: boolean
  companionLine: string
}

/** F318 一周的身体账（⚠️ MedVO 无 id，行按 week+mine 定位；how 后端实体默认空串，记过之后才是三档；iCanReply=TA 记了我还没回话） */
export interface CoupleBodyMedVO {
  week: string
  mine: boolean
  how: CoupleBodyMedHow | ''
  note: string
  reply: string
  replyBy: string
  iCanReply: boolean
}

/** F319 本周早睡军令状（myLine/partnerLine 空串=没签；line 违约率文案**只在双签后**才非空；违约数读 F220 晚安熄灯数据） */
export interface CoupleBodyOathVO {
  week: string
  myLine: string
  partnerLine: string
  mineSigned: boolean
  partnerSigned: boolean
  bothSigned: boolean
  myBreach: number
  myNights: number
  partnerBreach: number
  partnerNights: number
  line: string
}

/**
 * F310-F319 身体通知总览（GET /api/couple/body/overview 一次拉齐；20 个 POST 写接口全部返回整份 BodyVO，
 * 前端整体替换即五卡刷新）。day=今天、week=本周一；snore 与 oath 是**恒有值的嵌套对象**（后端 ensure* 惰性建行），
 * 其余全是列表：metrics 近 7 天双发、cycles 近 14 天双发、fits 近 7 天双发、quits/soss/redlines/checkups/meds 全量
 * （quits/soss/checkups 新→旧、redlines 登记先后升序、meds 约近 10 周升序，均不按状态过滤）。
 */
export interface CoupleBodyVO {
  day: string
  week: string
  metrics: CoupleBodyMetricVO[]
  snore: CoupleBodySnoreVO
  cycles: CoupleBodyCycleVO[]
  quits: CoupleBodyQuitVO[]
  fits: CoupleBodyFitVO[]
  soss: CoupleBodySosVO[]
  redlines: CoupleBodyRedlineVO[]
  redlineHits: CoupleBodyRedlineHitVO[]
  checkups: CoupleBodyCheckupVO[]
  meds: CoupleBodyMedVO[]
  oath: CoupleBodyOathVO
}

// ============ 修复车间（F320-F329） ============
// 字段逐一对齐后端 com.smart.chat.couple.CoupleRepairService 的嵌套 record（F320 冷冻/F321 道歉质检/
// F322 重来卡/F323 信任重建/F324 和好倒计时/F325 冲突年报/F326 底线卡/F327 我错了榜/F328 礼盒/F329 纪念碑）：
// ⚠️ 本批唯一的可空数字是 RedoVO.satisfaction（后端 Integer，全季还没人打分=null），其余数字全是原生
// int/long（minutesLeft/secondsLeft 未到点=正数、到点=0；计数类没发生=0），不给 null；
// 字符串空串=没写/没答/没人/没递台阶；current 与 makeup 是「在冻/今天开过」才有的嵌套对象，没有时后端整体给 null。

/** F320 冷冻单状态：FROZEN 在冻 / THAWED 已复温（双签 + 三问齐才转） */
export type CoupleRepairFreezeStatus = 'FROZEN' | 'THAWED'

/** F321 道歉质检状态：VERIFY 等对方验货 / PASSED 进陈列室 / BACK 已打回（只有 BACK 能重写） */
export type CoupleRepairSorryStatus = 'VERIFY' | 'PASSED' | 'BACK'

/** F323 信任重建计划状态：OPEN 进行中 / DONE 签满自动达成 / GIVENUP 开计划人中止 */
export type CoupleRepairPlanStatus = 'OPEN' | 'DONE' | 'GIVENUP'

/** F324 和好倒计时状态：RUNNING 计时中 / OFFERED 台阶已递（到点自动或提前递）/ ENDED 已宣布和好 */
export type CoupleRepairMakeupStatus = 'RUNNING' | 'OFFERED' | 'ENDED'

/** F328 修复礼盒状态：OPEN 待完成 / DONE 本人完成（完成才推 both） */
export type CoupleRepairBoxStatus = 'OPEN' | 'DONE'

/** F321 道歉六要素自评码（后端 CoupleSorryReview.POINTS，其它码 400；自评至少三项） */
export type CoupleRepairSorryPoint = 'FACT' | 'FEEL' | 'BLAME' | 'SORRY' | 'FIX' | 'ASK'

/** F320 一单冷冻（minutesLeft=距解冻还剩几分钟，未到点前是正数——后端规定「签了也不算数」；
 *  三问答案 answer1/2/3 空串=还没答，题干是后端 Bank 静态文案不下发；canSign=没复温且我还没签） */
export interface CoupleRepairFreezeVO {
  id: string
  day: string
  mine: boolean
  hours: number
  status: CoupleRepairFreezeStatus
  minutesLeft: number
  reason: string
  answer1: string
  answer2: string
  answer3: string
  signedMe: boolean
  signedPartner: boolean
  bothSigned: boolean
  questionsDone: boolean
  canSign: boolean
}

/** F321 一封道歉信（points=六要素自评码数组；verdict 空串=还没验过；canVerify=对方交的且还在 VERIFY，
 *  ⚠️ 只有对方能验货、自己验自己 400） */
export interface CoupleRepairSorryVO {
  id: string
  mine: boolean
  letter: string
  points: string[]
  status: CoupleRepairSorryStatus
  verdict: string
  verifiedBy: string
  canVerify: boolean
}

/** F322 这季的重来卡（satisfaction=null=还没打分；ratedBy 空串=全季没人打过、一人一次；
 *  canPlay=没重放过（没领卡时也给 true，领卡与改场景共用）；canRate=已重放且全季还没人打分） */
export interface CoupleRepairRedoVO {
  quarter: string
  mine: boolean
  scene: string
  used: boolean
  replayNote: string
  satisfaction: number | null
  ratedBy: string
  canPlay: boolean
  canRate: boolean
}

/** F323 一条每日任务卡（seq 从 1 起连续编号，后端把 CSV 拆好下发） */
export interface CoupleRepairTaskVO {
  seq: number
  text: string
}

/** F323 一个信任重建计划（signedCount=双人齐签的天数——单人签不算一天；dayNo=第几天且封顶 targetDays；
 *  targetDays 只有 14/30 两档；review 空串=还没写周复盘，任一人可写可改） */
export interface CoupleRepairRebuildVO {
  id: string
  name: string
  mine: boolean
  cause: string
  startDay: string
  targetDays: number
  tasks: CoupleRepairTaskVO[]
  signedCount: number
  dayNo: number
  review: string
  status: CoupleRepairPlanStatus
}

/** F324 一轮冷战倒计时（secondsLeft=距到点还剩几秒；pausedBy 空串=没被暂停、暂停/继续权只在对方；
 *  stepCard 空串=台阶还没递（到点自动递或提前递）；canToggle=TA 开的且还在计时；canEnd=还没宣布和好） */
export interface CoupleRepairMakeupVO {
  id: string
  day: string
  mine: boolean
  minutes: number
  status: CoupleRepairMakeupStatus
  secondsLeft: number
  paused: boolean
  pausedBy: string
  stepCard: string
  canToggle: boolean
  canEnd: boolean
}

/** F326 一条底线声明（slot 1-3 每人各三条；breachCount=被踩次数 0=没被踩过；canBreach=TA 立的线才能由
 *  踩线的人补红线记录，线主人自己点 400） */
export interface CoupleRepairBottomVO {
  id: string
  mine: boolean
  slot: number
  text: string
  sinceDay: string
  breachCount: number
  breachNote: string
  canBreach: boolean
}

/** F327 一条认错（aboutUser=向谁认错；touched=被标了「最感人」；canTouch=TA 认的且还没被标，
 *  ⚠️ 只有被认错的那位能标，自己给自己发奖 400） */
export interface CoupleRepairAdmitVO {
  id: string
  day: string
  mine: boolean
  aboutUser: string
  detail: string
  touched: boolean
  canTouch: boolean
}

/** F328 一个修复礼盒（解冻/宣布和好时掉落；doneLine 空串=还没完成，完成后由后端下发话术） */
export interface CoupleRepairBoxVO {
  id: string
  day: string
  mine: boolean
  task: string
  status: CoupleRepairBoxStatus
  doneLine: string
}

/** F329 一句纪念碑刻字（一天一人一句；note 空串=还没补「现在回看」注解，本人补注不重推） */
export interface CoupleRepairPeaceVO {
  id: string
  day: string
  mine: boolean
  line: string
  note: string
}

/** F325 冲突类型年报（无表读时聚合；avgThawHours=平均冷冻时长小时数四舍五入，一次没冻过=0；
 *  prize/summary 由后端 Bank 生成，本届没修过也有「空缺奖」文案） */
export interface CoupleRepairReportVO {
  year: string
  freezes: number
  thawed: number
  sorryIn: number
  passed: number
  backed: number
  admits: number
  touched: number
  redos: number
  boxesDone: number
  peaceLines: number
  reconciles: number
  reconcileAccepted: number
  avgThawHours: number
  prize: string
  summary: string
}

/**
 * F320-F329 修复车间总览（GET /api/couple/repair/workshop 一次拉齐；读时后端惰性结算：倒计时到点自动递台阶卡；
 * 23 个 POST 写接口全部返回整份 RepairVO，前端整体替换即全卡刷新）。current=在冻的那单（没有=null）、
 * makeup=今天那轮倒计时（没有=null）；freezes/sorries/rebuilds/makeups/bottoms/admits/boxes/peace 全是列表
 * （后端按 created|day 倒序带条数钳制，不按状态过滤——打回/中止/完成的行留在架上可回看）。
 */
export interface CoupleRepairVO {
  day: string
  quarter: string
  year: string
  freezes: CoupleRepairFreezeVO[]
  current: CoupleRepairFreezeVO | null
  sorries: CoupleRepairSorryVO[]
  redo: CoupleRepairRedoVO
  rebuilds: CoupleRepairRebuildVO[]
  makeup: CoupleRepairMakeupVO | null
  makeups: CoupleRepairMakeupVO[]
  bottoms: CoupleRepairBottomVO[]
  admits: CoupleRepairAdmitVO[]
  boxes: CoupleRepairBoxVO[]
  peace: CoupleRepairPeaceVO[]
  report: CoupleRepairReportVO
}

// ============ 批次二十九：两家与朋友（F330-F339，GET/POST /api/couple/world） ============
// 字段逐一对齐后端 com.smart.chat.couple.CoupleWorldService 的嵌套 record（F330 拜访攻略/F331 送礼互助池/
// F332 朋友视角问卷/F333 官宣日/F334 文案代写/F335 进城接待方案/F336 亲戚称呼册/F337 社会信用/
// F338 群聊记者/F339 代 TA 赔礼）。口径同批次二十八：后端字符串恒给空串（空串=没写/没交卷/没人接）、
// 数字恒有值（未设置给 -1 或 0，见各条注释）、可空对象整体可空（本批只有 packTemplate 之外的 group 是恒有值嵌套对象）。

/** F330 拜访方：MINE=我家 / YOURS=你家（其它值后端 400「攻略只分「我家」和「你家」」） */
export type CoupleWorldVisitSide = 'MINE' | 'YOURS'

/** F330 拜访攻略状态：OPEN 待回访 / DONE 战报已交 */
export type CoupleWorldVisitStatus = 'OPEN' | 'DONE'

/** F330 前置任务卡类别（后端按文案首词判定：以「雷区」开头=MINE、以「带」开头=BRING、其余=TALK） */
export type CoupleWorldPrepKind = 'BRING' | 'TALK' | 'MINE'

/** F331 送礼灵感状态：OPEN 在池子里等人接 / TAKEN 已被接单代买 / BOUGHT 买回登记完成 */
export type CoupleWorldGiftStatus = 'OPEN' | 'TAKEN' | 'BOUGHT'

/** F337 社会信用保证状态：OPEN 在保 / KEPT 到期自动解除（说到做到）/ BROKEN 塌房 */
export type CoupleWorldVowStatus = 'OPEN' | 'KEPT' | 'BROKEN'

/** F339 赔礼信状态：OPEN 等 TA 审阅 / SENT 审阅通过已送达 / BACK 被打回（只有 BACK 能重写） */
export type CoupleWorldApologyStatus = 'OPEN' | 'SENT' | 'BACK'

/** F330 一条前置任务卡（seq 从 1 起连续编号，后端把 CSV/顿号/换行拆好并按首词标类） */
export interface CoupleWorldPrepVO {
  seq: number
  text: string
  kind: CoupleWorldPrepKind
}

/** F330 一次拜访攻略（hostLabel=后端算好的「我家/你家」中文标签；report 空串=还没交战报；
 *  canConfirm=对方写的且还没双确认——⚠️ 自己写的自己确认后端 400） */
export interface CoupleWorldVisitVO {
  id: string
  day: string
  mine: boolean
  hostSide: CoupleWorldVisitSide | ''
  hostLabel: string
  preps: CoupleWorldPrepVO[]
  confirmed: boolean
  report: string
  status: CoupleWorldVisitStatus
  canConfirm: boolean
}

/** F331 一条送礼灵感（takerUser 空串=还没人接单；canTake=OPEN 且不是自己登的——⚠️ 自己领自己的后端 400） */
export interface CoupleWorldGiftVO {
  id: string
  person: string
  idea: string
  budget: string
  avoid: string
  mine: boolean
  takerUser: string
  status: CoupleWorldGiftStatus
  canTake: boolean
}

/** F332 他观问卷的一题（question 是后端 Bank 按空间稳定出的题面；answer 空串=还没线下问过回填；
 *  byUser 空串=没人回填过） */
export interface CoupleWorldViewVO {
  slot: number
  question: string
  askedTo: string
  answer: string
  byUser: string
  filled: boolean
}

/** F333 本月官宣卡（month=yyyy-MM，每月一张，后端按空间倒序下发历月） */
export interface CoupleWorldDeclareVO {
  month: string
  text: string
  mine: boolean
}

/** F334 一条候选文案（slot 1-3 每人每天三条；won=本日定稿的那条；
 *  ⚠️ 只有求稿的对方能选稿，自己写的自己定后端 400） */
export interface CoupleWorldCaptionVO {
  id: string
  day: string
  mine: boolean
  slot: number
  text: string
  won: boolean
}

/** F335 一座城市的接待手册（arriveDay 空串=没定到访日；daysLeft=距到访几天，没定日时后端给 -1；
 *  itinerary/packList 由后端拆成数组下发） */
export interface CoupleWorldCityVO {
  id: string
  city: string
  arriveDay: string
  mine: boolean
  itinerary: string[]
  transport: string
  packList: string[]
  daysLeft: number
}

/** F336 一道称谓考题（wrongCount=答错次数，>0 进「考前强化」；lastWrongDay 空串=还没答错过；
 *  canTry=对方出的题我才可答——自己出的题考不了自己，后端 400） */
export interface CoupleWorldRelativeVO {
  id: string
  term: string
  question: string
  answer: string
  mine: boolean
  wrongCount: number
  lastWrongDay: string
  canTry: boolean
}

/** F337 一条公开保证（witnessed=TA 已见证；daysLeft=距到期几天（读时后端惰性结算：到期且已见证自动转 KEPT 并记心动）；
 *  brokenNote 空串=没塌过房；canWitness/canBreak 都只归对方，自己见证/自己记塌房后端 400） */
export interface CoupleWorldVowVO {
  id: string
  content: string
  mine: boolean
  dueDay: string
  witnessed: boolean
  status: CoupleWorldVowStatus
  brokenNote: string
  daysLeft: number
  canWitness: boolean
  canBreak: boolean
}

/** F338 今日群聊素材（myLine/partnerLine 空串=那位还没交；line=后端 Bank 生成的回执话术；
 *  canWrite=我今天还没交才给提交口；canLaugh=双条齐了且我还没笑过） */
export interface CoupleWorldGroupVO {
  day: string
  myLine: string
  partnerLine: string
  iLaughed: boolean
  partnerLaughed: boolean
  bothLaughed: boolean
  line: string
  canWrite: boolean
  canLaugh: boolean
}

/** F339 一封代 TA 送的赔礼信（reviewNote 空串=还没审；template 非空只给信主本人，
 *  是后端 Bank 按信 id 稳定选出的开场模板；⚠️ 未经 TA 审阅通过就不算送达） */
export interface CoupleWorldApologyVO {
  id: string
  toPerson: string
  mine: boolean
  reason: string
  draft: string
  status: CoupleWorldApologyStatus
  reviewNote: string
  template: string
}

/**
 * F330-F339 两家与朋友总览（GET /api/couple/world 一次拉齐；16 个 POST 写接口全部返回整份 WorldVO，
 * 前端整体替换即十卡刷新）。读时后端做惰性结算：保证到期且已见证自动转 KEPT 并给本人记一笔心动。
 * visits/gifts/views/declares/captions/cities/relatives/vows/apologies 全是列表（后端按 created 倒序
 * 带条数钳制、不按状态过滤——已确认/已买回/已塌房的行都留在架上可回看）；views 恒定三行（1-3 题）、
 * group 是今日那一条恒有值嵌套对象；friendViewLine 空串=三题没答齐；packTemplate 是后端 Bank 的陪同小包模板。
 */
export interface CoupleWorldVO {
  day: string
  month: string
  visits: CoupleWorldVisitVO[]
  gifts: CoupleWorldGiftVO[]
  views: CoupleWorldViewVO[]
  friendViewLine: string
  declares: CoupleWorldDeclareVO[]
  captions: CoupleWorldCaptionVO[]
  cities: CoupleWorldCityVO[]
  relatives: CoupleWorldRelativeVO[]
  packTemplate: string[]
  vows: CoupleWorldVowVO[]
  group: CoupleWorldGroupVO
  apologies: CoupleWorldApologyVO[]
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

/**
 * F340-F349 传世系统总览（GET /api/couple/legacy/vault?goal= 一次拉齐；12 个 POST 写接口全部返回整份
 * LegacyVO，前端整体替换即十卡刷新）。⚠️ 后端只有 /vault 认 goal，12 个写接口一律按 DEFAULT_GOAL=300
 * 重算 milestone，所以写完 milestone.goal 会回到 300，要按自己的目标得再点一次倒推。
 * brand/draw/milestone/level 是恒有值嵌套对象（后端不会给 null），auditCandidates 是 F341 年审候选
 * （回忆资产系现有条目最多 12 项，形如「语录：xxx」）。
 */
export interface CoupleLegacyVO {
  day: string
  year: string
  tens: CoupleLegacyTenVO[]
  audits: CoupleLegacyAuditVO[]
  speeches: CoupleLegacySpeechVO[]
  fxes: CoupleLegacyFxVO[]
  brand: CoupleLegacyBrandVO
  reviews: CoupleLegacyReviewVO[]
  items: CoupleLegacyItemVO[]
  draw: CoupleLegacyDrawVO
  milestone: CoupleLegacyMilestoneVO
  level: CoupleLegacyLevelVO
  auditCandidates: string[]
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

/**
 * F354 感谢慢递的一封（后端 uk(space,from_user) 每行一条带 open_day）。
 * openDay=送达日（=寄出日 +7 天，DELIVER_AFTER_DAYS）；delivered=false 还在路上（每人 ≤3 封）。
 * 到日由读接口惰性结算（vault/calendar/year 任一读取都会结算并推双方 echo-thanks-arrived），无定时任务。
 */
export interface CoupleEchoSlowVO {
  id: string
  fromUser: string
  mine: boolean
  toUser: string
  content: string
  openDay: string
  delivered: boolean
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

/**
 * F356 夸夸回执（uk(space,quote_id,from_user) 幂等）。
 * quoteFrom/quoteContent 跨模块只读 couple_praise 回填，⚠️ 原句被删时后端给空串而不是整行剔除。
 */
export interface CoupleEchoReceiptVO {
  id: string
  quoteId: string
  quoteFrom: string
  quoteContent: string
  created: number
}

/**
 * F357 一天的电量格（uk(space,day,user)，本人当天可改写）。
 * level 1-5（后端钳制，null 按 3 格）；hint=对方 ≤2 格（LOW_LEVEL）时的「今晚轻轻的」Bank 提示行，
 * ⚠️ 只挂在对方那格上，我这一格恒空串。
 */
export interface CoupleEchoBatteryVO {
  fromUser: string
  mine: boolean
  level: number
  want: string
  hint: string
}

/** F358 给低落的自己的信的状态（后端 CoupleEchoSelfLetter.STATUS_SEALED/STATUS_READ） */
export type CoupleEchoSelfStatus = 'SEALED' | 'READ'

/** F358 给自己的信（一人同时一封在途；uk(space,from_user) 单行 status） */
export interface CoupleEchoSelfLetterVO {
  id: string
  content: string
  status: CoupleEchoSelfStatus
  created: number
}

/**
 * F351 能量补给包。⚠️ 两种形状同一份 VO：总览里是「今日态」——line/selfLetter 空串、三个列表空数组，
 * 只有 POST /refill 的返回里才装着拆开的内容（我的证据随机 ≤3 条 + 双方 juice/highlight 各 1 条 + 顺带开读的在途信）。
 * mineToday/partnerToday 是「今天有没有人领过」（每人每天一次，后端 400「今天已经充过电了」）。
 */
export interface CoupleEchoRefillVO {
  mineToday: boolean
  partnerToday: boolean
  deeds: CoupleEchoDeedVO[]
  juices: CoupleEchoJuiceVO[]
  highlights: CoupleEchoHighlightVO[]
  selfLetter: string
  line: string
}

/** F353 被爱日历的一天（后端只返回有动静的日子；deeds=当天双方记录数、starred=当天被加星数、refilled=当天有人领过补给） */
export interface CoupleEchoCalendarDayVO {
  day: string
  deeds: number
  starred: number
  refilled: boolean
}

/** F359 回音壁年报（五项计数全部来自真表，summary 是后端 Bank 组好的整句文案；year 是数字） */
export interface CoupleEchoYearlyVO {
  year: number
  deeds: number
  starred: number
  refills: number
  slowArrived: number
  receipts: number
  summary: string
}

/**
 * F350-F359 回音壁总览（GET /api/couple/echo/vault 一次拉齐；12 个 POST 写接口全部返回整份 EchoVO，
 * 前端整体替换即十卡刷新）。⚠️ 只有 selfLetter 可 null（没在途信）；refill/yearly 是恒有值嵌套对象。
 * 被爱日历（F353）不在这份聚合里，走 GET /calendar?year= 懒领取。
 */
export interface CoupleEchoVO {
  day: string
  deeds: CoupleEchoDeedVO[]
  partnerDeeds: CoupleEchoDeedVO[]
  juices: CoupleEchoJuiceVO[]
  refill: CoupleEchoRefillVO
  slowInFlight: CoupleEchoSlowVO[]
  slowArrived: CoupleEchoSlowVO[]
  highlights: CoupleEchoHighlightVO[]
  receipts: CoupleEchoReceiptVO[]
  battery: CoupleEchoBatteryVO[]
  selfLetter: CoupleEchoSelfLetterVO | null
  yearly: CoupleEchoYearlyVO
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

/**
 * F367 专注周报（GET /weekly，周一锚聚合，数字全部来自真实表）。
 * minutes=本周两人合计放下手机分钟；litNights=双报点亮的夜数；meals/gazes/unplugs=各自「双点」成功的天数；
 * slots=本周已确认的专属时段数；nudges=本周哨卡张数（两人合计）；unplugStreak=读时算的周连击；summary=后端 Bank 整句。
 */
export interface CoupleFocusWeeklyVO {
  week: string
  fromDay: string
  toDay: string
  minutes: number
  litNights: number
  meals: number
  gazes: number
  unplugs: number
  slots: number
  nudges: number
  unplugStreak: number
  summary: string
}

/**
 * F369 注意力年报（GET /year?year=，year 缺省当年）。
 * hours=把分钟换算成「为彼此放下的手机小时数」的字符串（后端 %.1f，如 "3.5"，不是数字）；
 * topDay=最专注的一天（没数据时后端给空串，Bank 那句「今年还长着呢」已经写进 summary 里）。
 */
export interface CoupleFocusYearlyVO {
  year: number
  minutes: number
  hours: string
  litNights: number
  meals: number
  gazes: number
  unplugs: number
  detox: number
  topDay: string
  topMinutes: number
  summary: string
}

/**
 * F360-F369 今日注意力总览（GET /api/couple/focus/today 一次拉齐；10 个 POST 写接口全部返回整份 TodayVO，
 * 前端整体替换即十卡刷新）。
 * meals/gazes 是「今天有几个人点了」的 0/1/2 计数（mealBoth/gazeBoth 才是双点成功）；
 * unplugMine=我今晚点没点、unplugBoth=两人都点了；unplugStreak=周连击（读时算）；
 * nudgesToday=今天两人一共递了几张哨卡、nudgeQuotaLeft=我今天还剩几张（每天 2 张）；
 * detoxBoth=今天这半天双报达成、detoxKind=今天挂的是 AM/PM（没挂为 null，先挂的人定，后应战的人不改写它）。
 * day=服务端今天 yyyy-MM-dd（组件里所有「本周/今天」判定与倒数一律吃它，不吃本地时钟）。
 */
export interface CoupleFocusTodayVO {
  day: string
  night: CoupleFocusNightVO
  queueUnread: number
  queue: CoupleFocusQueueVO[]
  slot: CoupleFocusSlotVO | null
  meals: number
  mealMine: boolean
  mealBoth: boolean
  gazes: number
  gazeMine: boolean
  gazeBoth: boolean
  unplugMine: boolean
  unplugBoth: boolean
  unplugStreak: number
  nudgesToday: number
  nudgeQuotaLeft: number
  detoxMine: boolean
  detoxBoth: boolean
  detoxKind: string | null
}

/** F368 半日无手机挑战的半天代号（后端 CoupleFocusDetox.KIND_AM/KIND_PM，只能这两个） */
export type CoupleFocusDetoxKind = 'AM' | 'PM'

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
 * F370 一关（在途或已打）。⚠️ QuestVO.battles 只下发 prep()=true 的在途关（报过战报的关离开这份列表，
 * 历史活在 reports 里），所以 prep 在这个列表里恒 true，别拿它当「还能不能撤」的二次判据。
 * daysLeft=服务端今天到关卡日还差几天（今天 0、已过为负，后端 daysBetween 原样给，不取绝对值）；
 * kindLabel 是后端 Bank 的中文（面试/汇报/答辩/谈判/体检/其它），created 毫秒、没下发时后端给 0。
 */
export interface CoupleQuestBattleVO {
  id: string
  day: string
  kind: CoupleQuestBattleKind
  kindLabel: string
  name: string
  fear: string
  mine: boolean
  prep: boolean
  daysLeft: number
  created: number
}

/**
 * F371 战报与盖章。mine=我是打这一关的人（后端按 battle.fromUser 判，不是按战报提交人判）；
 * sealed=对方盖过章，sealedBy 盖章人（没盖是空串）；sealLabel 按战果定的章名
 * （WIN「🏆 庆功章」/SURVIVE「🍀 幸亏章」/LOSE「🫂 抱抱章」，后端 Bank 下发）。
 * 一关一份战报，报完那一关就从 battles 里消失。
 */
export interface CoupleQuestReportVO {
  id: string
  battleId: string
  battleName: string
  result: CoupleQuestResult
  resultLabel: string
  feeling: string
  mine: boolean
  sealed: boolean
  sealedBy: string
  sealLabel: string
}

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
 * F373 陪护单。patientUser 生病的人 / carerUser 陪护的人（开单时 patient 恒等于「操作人的对方」，
 * 生病的人自己开不了）；mineAsCarer=我是陪护人；open=还在途（关单后为 false，行仍留在 nurses 里）。
 * days=陪了几天（在途按今天算、关单按 closeDay 算，后端 Math.max(1, …) 恒 ≥1）；
 * waterCount/medCount 是这张单累计的两种代记次数，marks 按打卡日升序。
 * ⚠️ QuestVO.myNurse=「我生病、TA 陪我」那张，partnerNurse=「TA 生病、我陪 TA」那张，都只给在途的。
 */
export interface CoupleQuestNurseVO {
  id: string
  patientUser: string
  carerUser: string
  mineAsCarer: boolean
  open: boolean
  openDay: string
  closeDay: string
  symptom: string
  message: string
  waterCount: number
  medCount: number
  days: number
  marks: CoupleQuestCareMarkVO[]
}

/**
 * F374 静音舱一行。in=还在舱里（出舱后为 false，行仍下发）；cheerCount=累计收到几张加油卡；
 * cheeredToday=我今天已经给这一舱递过一张了（后端按 MMdd CSV 判）；letterDone=对方标记过长信已补；
 * daysLeft 出舱倒数（⚠️ 后端只在 in=true 时给真实天数，出舱后恒 0）。
 * ⚠️ myPod/partnerPod 取的是「各自最近一次入舱」那一行（pods 按 startDay 降序取第一条），
 * 出过舱的人这里给的是那一行 OUT 记录而不是 null——判「还能不能再进舱」只能看 in。
 */
export interface CoupleQuestPodVO {
  id: string
  mine: boolean
  startDay: string
  untilDay: string
  in: boolean
  cheerCount: number
  cheeredToday: boolean
  letterDone: boolean
  daysLeft: number
}

/**
 * F375 搬家区块一格（uk(space,slot)，slot 1-8；moves 只给开过的格，八格看板要自己补齐）。
 * owner 认领人（空串=没人认领）、claimed=owner 非空、mine=我是认领人（后端直接 me.equals(owner)）。
 * 没开过的格在后端 requireMove 里点认领/记箱数会自动建行，name 给空串。
 */
export interface CoupleQuestMoveVO {
  id: string
  slot: number
  name: string
  owner: string
  mine: boolean
  claimed: boolean
  finished: boolean
  boxes: number
}

/**
 * F375 新家第一晚（uk(space,day)，双方共写一行，按 userA/userB 位打勾）。
 * mineTicked/partnerTicked 是服务端按 space.userA 位置算出来的真值 —— 双拍归因一律吃这两个位，
 * 不留本地「我按过没」的位；bothTicked=两人都点了才算庆祝；note 那句话只有点那一拍的人写的会落库。
 */
export interface CoupleQuestMoveNightVO {
  id: string
  day: string
  mineTicked: boolean
  partnerTicked: boolean
  bothTicked: boolean
  note: string
}

/**
 * F376 低谷通行证（后端按 from_user 记是谁开的，在途每人 ≤1）。
 * mine=这张是我开的；low=还在有效期内（回升后为 false，行仍下发）；careCount=累计收到几张
 * 「不说话也行」卡；caredToday=我今天已经给这张递过卡了；reviveDay 回升日（没回升空串）；
 * spanDays 挂了几天的口径 = 后端 daysBetween(openDay, untilDay)（宣布日到回升日的跨度）；
 * daysLeft=还剩几天（⚠️ 只在 low=true 时给真实值，回升后恒 0）。
 */
export interface CoupleQuestValleyVO {
  id: string
  mine: boolean
  openDay: string
  untilDay: string
  low: boolean
  careCount: number
  caredToday: boolean
  reviveDay: string
  spanDays: number
  daysLeft: number
}

/**
 * F377 小胜利一条（uk(space,day,user)，每人每天一条、当天改写不重推）。
 * canAward 是后端算好的「这条我可以颁奖」= 不是我的那条 && 是 TA 的（自己那条恒 false）；
 * awarded=已经颁过，awardedBy 颁奖人、awardDay 颁在哪天（没颁都是空串）。
 * ⚠️ wins 是两人合计、按日渐降序、只给最近 21 条。
 */
export interface CoupleQuestWinVO {
  id: string
  day: string
  mine: boolean
  content: string
  awardDay: string
  awardedBy: string
  awarded: boolean
  canAward: boolean
}

/** F379 下次关卡预约（uk(space,day,title)，⚠️ 查重是按「同人同日同名」，挂单人自己判重）。 */
export interface CoupleQuestUpcomingVO {
  id: string
  day: string
  title: string
  mine: boolean
  attendBy: string
  attended: boolean
  daysLeft: number
}

/**
 * F378 关卡成就墙（年度聚合，数字全部直接查原始表，不受列表钳制影响）。
 * year 是 Java int → number（不是字符串，别抄批次二十五的 string year）；
 * winRate=通关率整数百分比（reports 为 0 时后端给 0）；pods 这一项后端给的是
 * 「静音舱数 + 搬家区块打包完成数」的合计（wallOf 里 pods + movesDone）；
 * awards 同理是「小赢奖次数 + 低谷卡次数」的合计；title/summary 全是后端 Bank 整句。
 */
export interface CoupleQuestWallVO {
  year: number
  battles: number
  reports: number
  winRate: number
  nurseDays: number
  pods: number
  valleyDays: number
  awards: number
  attends: number
  title: string
  summary: string
}

/**
 * 关卡总览（GET /api/couple/quest/board 一次拉齐；27 个 POST 写接口全部原样返回整份 QuestVO，
 * 前端整体替换即十卡刷新）。⚠️ 唯一的例外是 GET /wall?year=：那是「点按钮才懒读另一份」的独立读接口，
 * 不进这份聚合（这份里的 wall 恒是服务端当年那一份）。
 * day=服务端今天 yyyy-MM-dd、weekStart=服务端那周的周一 yyyy-MM-dd ——
 * 所有倒数/是否本周的判定一律吃这两个字段，不吃本地时钟。
 */
export interface CoupleQuestVO {
  day: string
  weekStart: string
  battles: CoupleQuestBattleVO[]
  reports: CoupleQuestReportVO[]
  myOvertime: CoupleQuestOvertimeVO | null
  partnerOvertime: CoupleQuestOvertimeVO | null
  canLeaveLamp: boolean
  myNurse: CoupleQuestNurseVO | null
  partnerNurse: CoupleQuestNurseVO | null
  nurses: CoupleQuestNurseVO[]
  myPod: CoupleQuestPodVO | null
  partnerPod: CoupleQuestPodVO | null
  moves: CoupleQuestMoveVO[]
  moveBoxes: number
  moveNight: CoupleQuestMoveNightVO | null
  myValley: CoupleQuestValleyVO | null
  partnerValley: CoupleQuestValleyVO | null
  wins: CoupleQuestWinVO[]
  upcoming: CoupleQuestUpcomingVO[]
  wall: CoupleQuestWallVO
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
 * F380 暗中心愿一条（uk(space,owner,content)，每人替 TA 记 ≤12 条 CoupleCatchWish.PER_OWNER_MAX）。
 * ⚠️ 同一个 WishVO 形状装在两张列表里，语义相反：
 *   myWishes = 我替 TA 记的 && secret（后端 filter recorder==me && secret），这里 mine 恒 true；
 *   revealedToMe = TA 替我记的 && 已揭晓（filter !secret），这里 mine 恒 false。
 * 所以「能不能勾兑现」不能只看 mine，只能看这条出现在哪张列表里。
 * secret=还没揭晓；filled=已兑现登记；created 是毫秒时间戳（后端 null 兜 0 → 恒 number）。
 */
export interface CoupleCatchWishVO {
  id: string
  mine: boolean
  content: string
  sourceDay: string
  scene: string
  secret: boolean
  filled: boolean
  created: number
}

/**
 * F381 雷区一颗（uk(space,from_user,topic)，每人 ≤6 颗 CoupleCatchMine.PER_USER_MAX）。
 * mine=这颗是我挂的；acked=对方盖过「已知晓」；ackBy 是盖章人的用户名（没盖空串）；
 * avoided=成功绕开的累计次数（后端 getAvoided()==null 兜 0 → 恒 number，⚠️ 无每日上限、可无限刷）。
 */
export interface CoupleCatchMineVO {
  id: string
  mine: boolean
  topic: string
  trip: string
  safeWay: string
  acked: boolean
  ackBy: string
  avoided: number
}

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
 * F383 一个敏感日标注（uk(space,owner,day,kind)，只能标今天或将来；列表口径是 day>=服务端今天，
 * 过去的日子自动离开总览，不需要前端过滤）。
 * ⚠️ mineAsOwner=「这条的主人是我」，与批次里常见的 mine 语义相反方向的闸门：
 * 后端 removeSensitive 是 `if (me.equals(ownerUser)) throw` —— 只有代标的那位能撤，主人自己撤不掉。
 * daysLeft=距今天还有几天（后端 daysBetween 算）；remindTomorrow=明天是不是这一天（daysLeft===1）。
 */
export interface CoupleCatchSensitiveVO {
  id: string
  mineAsOwner: boolean
  ownerUser: string
  day: string
  kind: CoupleCatchSensitiveKind
  kindLabel: string
  care: string
  daysLeft: number
  remindTomorrow: boolean
}

/**
 * F384 一个话头存档（status OPEN/DONE，在途每人 ≤5 CoupleCatchThread.IN_FLIGHT_MAX；
 * ⚠️ DDL 只有普通索引 idx_catch_thread，(space,from_user,status) 不是唯一键，续完后同话题可以再存）。
 * open=还在途。⚠️ myThreads/partnerThreads 两张列表后端都按 STATUS_OPEN 查，所以这里的 open 恒 true，
 * 后端 finishThread 里 `!row.open()` 那条幂等分支前端永远走不到。
 */
export interface CoupleCatchThreadVO {
  id: string
  mine: boolean
  topic: string
  progress: string
  open: boolean
  created: number
}

/** F385 一条反话对照（uk(space,from_user,say)，每人 ≤10 条 CoupleCatchSay.PER_USER_MAX；只有申报人能删）。 */
export interface CoupleCatchSayVO {
  id: string
  mine: boolean
  say: string
  means: string
}

/**
 * F386 一方聆听方式（uk(space,from_user)，每人一格可改写）。
 * mode 是原始枚举、modeLabel 是后端 CoupleCatchBank.modeLabel 的中文（展示一律吃 label）。
 */
export interface CoupleCatchProtocolVO {
  id: string
  mine: boolean
  mode: CoupleCatchProtocolMode
  modeLabel: string
  note: string
}

/**
 * F387 一题话题许愿（uk(space,from_user,title)；⚠️ topics 是两人合计、含已聊完的，按日渐降序 ≤12 条）。
 * mine=这题是我许的；takenBy=接单人的用户名（没接空串）；
 * canTake=后端算好的「这题我能接」= PENDING && 不是我许的；canTalk=「我能勾聊完」= 接单人是我 && 状态 TAKEN；
 * overdue=聊完时是否已超过接单后一周（WEEK_MILLIS）；talkDay 聊完日、reflect 那一句感想（没聊完都空串）。
 */
export interface CoupleCatchTopicVO {
  id: string
  mine: boolean
  title: string
  status: CoupleCatchTopicStatus
  takenBy: string
  canTake: boolean
  canTalk: boolean
  overdue: boolean
  talkDay: string
  reflect: string
}

/**
 * F388 某一天的一句话（uk(space,day,user_name)，当天可改写）。
 * ⚠️ 三处复用同一个形状：CatchVO.myToday（null=我今天还没写，就是「我这一侧今天」的权威位）、
 * CatchVO.partnerToday（null=TA 今天还没写）、CatchVO.myHistory（我这方的历史 ≤14 条，
 * 后端从全空间列表里 filter userName==me 再 limit，所以是日渐降序的我的流水）。
 */
export interface CoupleCatchDailyVO {
  day: string
  content: string
  mine: boolean
}

/**
 * F389 聆听者年报（数字全部直查原始表，不受 myWishes≤24/mines≤12/uses≤20/…的列表钳制）。
 * ⚠️ year 是 Java int → number（不是字符串，别抄批次二十五 post 的 string year）。
 * wishes=空间内暗中心愿**总数**（不分类别/年份，后端 wishes.size()），fulfilled=揭晓时间落在这一年的；
 * mines=在册雷数、acked=已盖知晓章的、avoids=avoided 求和；uses=这一年喊停次数、
 * reflected=其中补了复盘的；threads=这一年存档数、finished=这一年销档数；
 * talked=这一年聊完的题数、onTime=其中没超时的；dailies=这一年留的一句话条数。
 * title/summary 全是后端 Bank 整句（称号按 fulfilled*3+avoids*2+talked*2+uses+dailies/10 定档）。
 */
export interface CoupleCatchYearVO {
  year: number
  wishes: number
  fulfilled: number
  mines: number
  acked: number
  avoids: number
  uses: number
  reflected: number
  sensitives: number
  threads: number
  finished: number
  says: number
  talked: number
  onTime: number
  dailies: number
  title: string
  summary: string
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
export interface CoupleCatchVO {
  day: string
  week: string
  myWishes: CoupleCatchWishVO[]
  revealedToMe: CoupleCatchWishVO[]
  wishQuotaLeft: number
  mines: CoupleCatchMineVO[]
  myWord: CoupleCatchSafewordVO | null
  partnerWord: CoupleCatchSafewordVO | null
  uses: CoupleCatchUseVO[]
  monthUses: number
  sensitives: CoupleCatchSensitiveVO[]
  myThreads: CoupleCatchThreadVO[]
  partnerThreads: CoupleCatchThreadVO[]
  mySays: CoupleCatchSayVO[]
  partnerSays: CoupleCatchSayVO[]
  myProtocol: CoupleCatchProtocolVO | null
  partnerProtocol: CoupleCatchProtocolVO | null
  protocolHint: string
  topics: CoupleCatchTopicVO[]
  myToday: CoupleCatchDailyVO | null
  partnerToday: CoupleCatchDailyVO | null
  dailyHint: string
  myHistory: CoupleCatchDailyVO[]
  year: CoupleCatchYearVO
}

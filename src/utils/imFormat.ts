/** IM 前端小工具：时间格式化与头像配色 */

/** 消息时间：今天显示 HH:mm，今年显示 MM-DD HH:mm，更早带年份 */
export function formatChatTime(created: number | null | undefined): string {
  if (!created) {
    return ''
  }
  const date = new Date(created)
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const hm = `${pad(date.getHours())}:${pad(date.getMinutes())}`
  const sameDay = date.toDateString() === now.toDateString()
  if (sameDay) {
    return hm
  }
  const sameYear = date.getFullYear() === now.getFullYear()
  const md = `${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
  return sameYear ? `${md} ${hm}` : `${date.getFullYear()}-${md} ${hm}`
}

/** 头像配色（8 个情侣风渐变，135° 柔光过渡；按用户名稳定取色，资料页可选 c0..c7） */
export const AVATAR_COLORS = [
  'linear-gradient(135deg, #fda7c4, #ec5f92)', // 樱花粉（默认，跟随主题强调色）
  'linear-gradient(135deg, #ffb199, #ff7e8a)', // 蜜桃
  'linear-gradient(135deg, #f9718f, #e0336d)', // 玫瑰
  'linear-gradient(135deg, #c58ff2, #9b6bd8)', // 薰衣草
  'linear-gradient(135deg, #ffc2d1, #ff8fab)', // 珊瑚粉
  'linear-gradient(135deg, #9ad7f0, #5eb6e4)', // 天空
  'linear-gradient(135deg, #a9e8c9, #67c998)', // 薄荷
  'linear-gradient(135deg, #ffd8a8, #ffab6b)', // 暖阳
]

/** 按用户名稳定取一个头像底色 */
export function avatarColorFor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

/** 是否为资料里保存的颜色档位（c0..c7）；旧数据（emoji 等）会回落到按名取色 */
export function isAvatarColorKey(value: string | null | undefined): boolean {
  return /^c[0-7]$/.test(value ?? '')
}

export function avatarColorByKey(value: string | null | undefined, name: string): string {
  if (isAvatarColorKey(value)) {
    return AVATAR_COLORS[Number((value as string)[1])]
  }
  return avatarColorFor(name)
}

/** 表情分组：聊天面板表情选择器按组展示（均为常见单码位表情，兼容各系统字体） */
export const EMOJI_GROUPS: { name: string; emojis: string[] }[] = [
  {
    name: '💗 情侣贴纸包',
    emojis: [
      '💖', '💘', '💝', '🫶', '😘', '💋', '🌹', '💌', '💍', '👩‍❤️‍👨', '🥂', '🍰',
      '🧸', '🐰', '🐻', '🐥', '🌷', '🌸', '⭐', '🌙', '☕', '🍫', '🎁', '🏠',
    ],
  },
  {
    name: '笑脸',
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃',
      '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜',
    ],
  },
  {
    name: '情绪',
    emojis: [
      '🤪', '🤨', '🧐', '🤓', '😎', '🥳', '😏', '😒', '😞', '😔', '😟', '😕',
      '🙁', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
    ],
  },
  {
    name: '状态',
    emojis: [
      '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐',
      '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪',
    ],
  },
  {
    name: '手势',
    emojis: [
      '👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉',
      '👆', '👇', '☝️', '👋', '🤚', '🖐', '✋', '🖖', '👏', '🙌', '🤲', '🫶',
    ],
  },
  {
    name: '人物',
    emojis: [
      '🙏', '💪', '🦾', '👊', '✊', '🤛', '🤜', '👀', '👄', '🧠', '🫀', '🦷',
      '👶', '🧒', '👦', '👧', '🧑', '👨', '👩', '🧓', '👮', '🕵', '💁', '🙇',
    ],
  },
  {
    name: '爱心',
    emojis: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕',
      '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✨', '⭐', '🌟', '💫',
    ],
  },
  {
    name: '庆祝',
    emojis: [
      '🎉', '🎊', '🎈', '🎁', '🎂', '🍰', '🧁', '🏆', '🥇', '🥈', '🥉', '🎯',
      '🎲', '🎮', '🎸', '🎤', '🎧', '🎬', '📷', '💡', '🔥', '💥', '🧨', '🎆',
    ],
  },
  {
    name: '动物',
    emojis: [
      '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮',
      '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦆', '🦉', '🦄', '🐝', '🦋', '🐢',
    ],
  },
  {
    name: '自然',
    emojis: [
      '🐬', '🐳', '🦈', '🐙', '🦀', '🐠', '🐟', '🌸', '💮', '🏵', '🌹', '🥀',
      '🌺', '🌻', '🌼', '🌷', '🌱', '🌲', '🌳', '🌴', '🌵', '🍀', '🍁', '🌍',
    ],
  },
  {
    name: '美食',
    emojis: [
      '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒',
      '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🥑', '🌽', '🥕', '🍞', '🧀', '🍗',
    ],
  },
  {
    name: '餐点',
    emojis: [
      '🌭', '🍔', '🍟', '🍕', '🌮', '🥗', '🍿', '🍦', '🍩', '🍪', '🍫', '🍬',
      '🍭', '🍜', '🍣', '🍱', '🥟', '🍤', '🍚', '🍛', '🥠', '🍢', '🍡', '🥮',
    ],
  },
  {
    name: '饮品',
    emojis: [
      '🧋', '🥤', '🍺', '🍻', '🥃', '🍸', '🍹', '🥛', '🍼', '🫖', '🍯', '🧂',
      '🥄', '🍴', '🍽', '🏺', '🥢', '☕', '🍵', '🧊', '🫙', '🛎', '🧉', '🧃',
    ],
  },
  {
    name: '出行',
    emojis: [
      '🚗', '🚕', '🚙', '🚌', '🏎', '🚓', '🚑', '🚒', '🚲', '🛵', '🚂', '✈️',
      '🛫', '🚀', '🛸', '⛵', '🚤', '🛳', '🗺', '🏝', '🏔', '🌋', '🗼', '🎡',
    ],
  },
  {
    name: '天气',
    emojis: [
      '☀️', '⛅', '☁️', '🌧', '⛈', '🌩', '🌨', '❄️', '☃️', '🌪', '🌫', '🌈',
      '🌊', '💧', '💨', '🌡', '⏰', '⌛', '📅', '📆', '🕐', '🌙', '🌛', '🌜',
    ],
  },
  {
    name: '物品',
    emojis: [
      '📱', '💻', '⌨️', '🖥', '🖱', '💾', '📞', '☎️', '📟', '📺', '📻', '🎙',
      '⏱', '🔋', '🔌', '💼', '📁', '📂', '📌', '✂️', '🔒', '🔑', '🔨', '🧰',
    ],
  },
  {
    name: '符号',
    emojis: [
      '✅', '❌', '❓', '❗', '⭕', '🚫', '⚠️', '♻️', '✖️', '➕', '➖', '➗',
      '💯', '🔱', '⚜️', '🔰', '♾', '🎰', '🀄', '🎴', '⚛️', '☢️', '☯️', '🆗',
    ],
  },
]

/** 最近在线：刚刚 / x 分钟前 / x 小时前 / x 天前 */
export function formatLastSeen(lastSeenAt: number | null | undefined, online: boolean): string {
  if (online) {
    return '在线'
  }
  if (!lastSeenAt) {
    return '离线'
  }
  const diff = Date.now() - lastSeenAt
  if (diff < 60_000) {
    return '刚刚在线'
  }
  if (diff < 3_600_000) {
    return `${Math.floor(diff / 60_000)} 分钟前在线`
  }
  if (diff < 86_400_000) {
    return `${Math.floor(diff / 3_600_000)} 小时前在线`
  }
  return `${Math.floor(diff / 86_400_000)} 天前在线`
}

/** 时间分隔线：今天 / 昨天 / M月D日 / YYYY年M月D日 */
export function formatDayLabel(ts: number): string {
  const date = new Date(ts)
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const dayDiff = Math.round((startOfDay(now) - startOfDay(date)) / 86_400_000)
  if (dayDiff === 0) {
    return '今天'
  }
  if (dayDiff === 1) {
    return '昨天'
  }
  const md = `${date.getMonth() + 1}月${date.getDate()}日`
  return date.getFullYear() === now.getFullYear() ? md : `${date.getFullYear()}年${md}`
}

// ---------- 47 消息内链接识别 ----------

export interface TextSegment {
  kind: 'text' | 'link'
  value: string
}

const URL_PATTERN = /https?:\/\/[^\s<>"'\u4e00-\u9fff]+/g

/** 把文本按 URL 切段：http/https 之外的都算普通文本（渲染时链接用 a 标签安全打开） */
export function parseLinks(text: string): TextSegment[] {
  if (!text) {
    return []
  }
  const segments: TextSegment[] = []
  let last = 0
  for (const match of text.matchAll(URL_PATTERN)) {
    const index = match.index ?? 0
    if (index > last) {
      segments.push({ kind: 'text', value: text.slice(last, index) })
    }
    segments.push({ kind: 'link', value: match[0] })
    last = index + match[0].length
  }
  if (last < text.length) {
    segments.push({ kind: 'text', value: text.slice(last) })
  }
  return segments
}

// ---------- 61 搜索关键词高亮 ----------

export interface HighlightSegment {
  text: string
  hit: boolean
}

/** 按关键词切分文本用于 <mark> 高亮；空关键词返回原文单段 */
export function highlightSegments(text: string, keyword: string): HighlightSegment[] {
  const kw = keyword.trim()
  if (!kw || !text) {
    return [{ text, hit: false }]
  }
  const lower = text.toLowerCase()
  const needle = kw.toLowerCase()
  const segments: HighlightSegment[] = []
  let last = 0
  let index = lower.indexOf(needle)
  while (index >= 0) {
    if (index > last) {
      segments.push({ text: text.slice(last, index), hit: false })
    }
    segments.push({ text: text.slice(index, index + needle.length), hit: true })
    last = index + needle.length
    index = lower.indexOf(needle, last)
  }
  if (last < text.length) {
    segments.push({ text: text.slice(last), hit: false })
  }
  return segments.length > 0 ? segments : [{ text, hit: false }]
}

// ---------- 43 在线状态徽标 ----------

/** presence 状态徽标文案：online 显示「在线」，busy/away 显示对应状态 */
export function presenceLabel(status: string | null | undefined, online: boolean): string {
  if (!online) {
    return formatLastSeen(null, false)
  }
  if (status === 'busy') {
    return '忙碌'
  }
  if (status === 'away') {
    return '离开'
  }
  return '在线'
}

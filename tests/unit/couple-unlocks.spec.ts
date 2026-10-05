import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ChatView from '@/views/ChatView.vue'
import ImAvatar from '@/components/im/ImAvatar.vue'
import EmojiPicker from '@/components/im/EmojiPicker.vue'
import { useAuthStore } from '@/stores/auth'
import { useCoupleStore } from '@/stores/couple'
import { useImStore } from '@/stores/im'
import { friendApi, messageApi, profileApi } from '@/api/im'
import {
  COUPLE_VISUAL_TIER,
  buildCoupleStickers,
  couplePendant,
  coupleStickerGroupName,
  coupleVisualOn,
  isStickerText,
} from '@/utils/coupleVisual'
import type {
  CoupleOverview,
  CoupleSpaceTheme,
  CoupleStreakBoardVO,
  CoupleStreakTierVO,
  FriendVO,
  ImMessage,
} from '@/types'

vi.mock('@/api/im', () => ({
  friendApi: {
    list: vi.fn(),
    suggest: vi.fn(),
    apply: vi.fn(),
    incoming: vi.fn(),
    outgoing: vi.fn(),
    accept: vi.fn(),
    reject: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
  messageApi: {
    history: vi.fn(),
    send: vi.fn(),
    markRead: vi.fn(),
    recall: vi.fn(),
    search: vi.fn(),
    edit: vi.fn(),
    toggleReaction: vi.fn(),
    toggleStar: vi.fn(),
    exportConversation: vi.fn(),
    searchGlobal: vi.fn(),
    pin: vi.fn(),
    unpin: vi.fn(),
    currentPin: vi.fn(),
    clear: vi.fn(),
    attachments: vi.fn(),
  },
  profileApi: {
    me: vi.fn(),
    update: vi.fn(),
    of: vi.fn(),
    friendsBirthdays: vi.fn(),
  },
  starsApi: { list: vi.fn() },
}))

vi.mock('@/api/files', () => ({
  filesApi: { upload: vi.fn(), list: vi.fn(), remove: vi.fn() },
}))

vi.mock('@/api/auth', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    smsCode: vi.fn(),
    registerStatus: vi.fn(),
    logout: vi.fn(),
    me: vi.fn(),
    changePassword: vi.fn(),
    deactivate: vi.fn(),
  },
  adminApi: {
    applications: vi.fn(),
    approve: vi.fn(),
    reject: vi.fn(),
    pendingCount: vi.fn(),
    users: vi.fn(),
    setUserStatus: vi.fn(),
    resetPassword: vi.fn(),
    audit: vi.fn(),
    announcements: vi.fn(),
    publishAnnouncement: vi.fn(),
    closeAnnouncement: vi.fn(),
  },
}))

const push = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push }),
  useRoute: () => ({ query: {} }),
}))

class FakeWebSocket {
  static OPEN = 1
  readyState = 1
  onopen: (() => void) | null = null
  onmessage: ((event: { data: string }) => void) | null = null
  onclose: (() => void) | null = null
  onerror: (() => void) | null = null
  send() {}
  close() {}
}

vi.stubGlobal('WebSocket', FakeWebSocket as unknown as typeof WebSocket)

const SELF = 'alice'
const PARTNER = 'bob'
const OTHER = 'carol'

/** 七档顺序与后端一致，测试里按需点亮其中几档 */
const TIER_PLAN: { key: string; days: number }[] = [
  { key: 'bubble', days: 3 },
  { key: 'background', days: 7 },
  { key: 'nickname-glow', days: 14 },
  { key: 'pendant', days: 21 },
  { key: 'title', days: 30 },
  { key: 'custom-emoji', days: 50 },
  { key: 'easter-egg', days: 100 },
]

function streakBoard(unlockedKeys: string[]): CoupleStreakBoardVO {
  const tiers: CoupleStreakTierVO[] = TIER_PLAN.map((t) => ({
    key: t.key,
    days: t.days,
    label: t.key,
    icon: '🔒',
    detail: '',
    unlocked: unlockedKeys.includes(t.key),
    unlockedDay: unlockedKeys.includes(t.key) ? '2026-10-01' : null,
  }))
  return {
    day: '2026-10-05',
    currentStreak: 0,
    longestStreak: unlockedKeys.length * 20,
    confirmedDays: 0,
    checkedToday: true,
    missedYesterday: false,
    lastCheckinDay: null,
    tiers,
    nextTierKey: null,
    nextTierLabel: null,
    daysToNext: 0,
    strip: [],
    makeupWindowDays: 7,
    makeupLeftThisMonth: 0,
    canMakeup: false,
  }
}

function overview(days: number, petName: string | null, theme: CoupleSpaceTheme): CoupleOverview {
  return {
    space: {
      id: 'space-1',
      partner: { username: PARTNER, nickname: '阿宝', avatar: '', online: true, petName },
      created: Date.now() - days * 86_400_000,
      anniversary: null,
      days,
      slogan: null,
      theme,
    },
    incoming: [],
    outgoing: [],
  }
}

function friend(partial: Partial<FriendVO>): FriendVO {
  return {
    id: partial.username ?? 'f',
    username: SELF,
    remark: '',
    tag: '',
    pinned: false,
    muted: false,
    blocked: false,
    online: true,
    status: 'online',
    lastSeenAt: null,
    unread: 0,
    lastMessage: null,
    ...partial,
  } as FriendVO
}

function message(partial: Partial<ImMessage>): ImMessage {
  return {
    id: partial.id ?? 'm1',
    fromUser: SELF,
    toUser: PARTNER,
    content: '在干嘛',
    msgType: 'text',
    status: 'SENT',
    replyToId: null,
    created: Date.now(),
    ...partial,
  } as ImMessage
}

/** 把情侣空间摆成指定状态：established / 解锁档位 / 爱称 / 天数 / 主题 */
function setupCouple(opts: {
  established?: boolean
  tiers?: string[]
  petName?: string | null
  days?: number
  theme?: CoupleSpaceTheme
}) {
  const couple = useCoupleStore()
  if (!opts.established) {
    couple.overview = null
    couple.streak = null
    return couple
  }
  couple.overview = overview(opts.days ?? 30, opts.petName ?? null, opts.theme ?? 'classic')
  couple.streak = streakBoard(opts.tiers ?? [])
  return couple
}

const FRIENDS = [friend({ username: PARTNER, nickname: '阿宝' }), friend({ username: OTHER, nickname: '小赵' })]

const MESSAGES = {
  [PARTNER]: [message({ id: 'p1' }), message({ id: 'p2', fromUser: PARTNER, content: '想你啦' })],
  [OTHER]: [message({ id: 'o1', toUser: OTHER })],
}

/** 打开与某人的一对一会话并挂载聊天页（onMounted 的 im.init 会拉好友列表，走 mock） */
async function mountChatView(peer: string) {
  vi.mocked(friendApi.list).mockResolvedValue(FRIENDS)
  const im = useImStore()
  // 会话与消息先摆好再挂载，避免挂载瞬间走「未选会话」的空态分支
  im.activePeer = peer
  im.messages = MESSAGES
  const wrapper = mount(ChatView, {
    global: {
      plugins: [pinia],
      // 空态分支里的 router-link（渲染函数开头就会 resolve，不装路由插件会刷警告）
      stubs: { RouterLink: { template: '<a><slot /></a>' } },
    },
  })
  await flushPromises()
  im.activePeer = peer
  im.messages = MESSAGES
  await flushPromises()
  return wrapper
}

const mockedFriendsList = vi.mocked(friendApi.list)

let pinia: ReturnType<typeof createPinia>

beforeEach(() => {
  vi.clearAllMocks()
  sessionStorage.clear()
  pinia = createPinia()
  setActivePinia(pinia)
  // jsdom 没有 Element.scrollTo，聊天页「滚到底」时会用到
  if (!HTMLElement.prototype.scrollTo) {
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', { value: () => {}, writable: true })
  }
  mockedFriendsList.mockResolvedValue([])
  vi.mocked(friendApi.incoming).mockResolvedValue([])
  vi.mocked(friendApi.outgoing).mockResolvedValue([])
  vi.mocked(profileApi.me).mockResolvedValue({
    username: SELF,
    nickname: '小舟',
    signature: '',
    avatar: 'c1',
    presenceStatus: 'online',
  })
  useAuthStore().username = SELF
})

// ============ 1. 双人挂件：ImAvatar 的 pendant 可选 prop ============

describe('双人挂件 pendant prop', () => {
  it('不传 pendant 时不渲染任何挂坠节点，头像结构与今天完全一致', () => {
    const wrapper = mount(ImAvatar, { props: { name: PARTNER, size: 40, online: true, halo: true } })
    expect(wrapper.find('[data-testid="avatar-pendant"]').exists()).toBe(false)
    expect(wrapper.find('.pendant').exists()).toBe(false)
    expect(wrapper.find('.avatar').classes()).toEqual(
      expect.arrayContaining(['avatar', 'halo', 'pulse']),
    )
  })

  it('传入挂件时渲染角标，且标注 aria-hidden（不靠它承载信息），halo 行为不变', () => {
    const wrapper = mount(ImAvatar, { props: { name: PARTNER, size: 40, online: true, halo: true, pendant: '🔗' } })
    const charm = wrapper.find('[data-testid="avatar-pendant"]')
    expect(charm.exists()).toBe(true)
    expect(charm.text()).toBe('🔗')
    expect(charm.attributes('aria-hidden')).toBe('true')
    expect(wrapper.find('.avatar').classes()).toContain('halo')
    expect(wrapper.find('.dot').exists()).toBe(true)
  })

  it('挂件字号随头像缩放，最小 9px（角标绝对定位，不改头像宽高）', () => {
    const small = mount(ImAvatar, { props: { name: PARTNER, size: 24, pendant: '🌸' } })
    const big = mount(ImAvatar, { props: { name: PARTNER, size: 72, pendant: '🌸' } })
    expect(small.find('.pendant').attributes('style')).toContain('font-size: 9px')
    expect(big.find('.pendant').attributes('style')).toContain('font-size: 24px')
    expect(big.find('.avatar').attributes('style')).toContain('width: 72px')
  })

  it('couplePendant 按空间主题挑选，未知主题回落链条', () => {
    expect(couplePendant('cherry')).toBe('🌸')
    expect(couplePendant('night')).toBe('🌙')
    expect(couplePendant(undefined)).toBe('🔗')
    expect(couplePendant('whatever')).toBe('🔗')
  })
})

// ============ 2. 门禁纯函数：档位在不在 + 是不是 TA ============

describe('coupleVisualOn 门禁', () => {
  it('未建立空间 / 未解锁 / 对象不是 TA / 没有会话对象，一律不生效', () => {
    const base = { established: true, unlocked: true, activePeer: PARTNER, partnerUsername: PARTNER }
    expect(coupleVisualOn(base)).toBe(true)
    expect(coupleVisualOn({ ...base, established: false })).toBe(false)
    expect(coupleVisualOn({ ...base, unlocked: false })).toBe(false)
    expect(coupleVisualOn({ ...base, activePeer: OTHER })).toBe(false)
    expect(coupleVisualOn({ ...base, activePeer: '' })).toBe(false)
    expect(coupleVisualOn({ ...base, partnerUsername: '' })).toBe(false)
  })
})

// ============ 3. ChatView：气泡属性 / 昵称特效 / 挂件，只在 TA 的会话里出现 ============

describe('ChatView 聊天侧解锁', () => {
  it('三档全解锁 + 正在和 TA 聊：气泡属性、glow 类、挂件、爱称一起到位', async () => {
    setupCouple({
      established: true,
      tiers: [COUPLE_VISUAL_TIER.bubble, COUPLE_VISUAL_TIER.nicknameGlow, COUPLE_VISUAL_TIER.pendant],
      petName: '宝宝',
      theme: 'cherry',
    })
    const wrapper = await mountChatView(PARTNER)
    expect(wrapper.find('[data-testid="dm-area"]').attributes('data-couple-bubble')).toBe('on')
    const title = wrapper.find('[data-testid="chat-title"]')
    expect(title.classes()).toContain('couple-name-glow')
    // 爱称作为「特效」的一部分出现，同时 title 仍给回真实展示名（不只靠特效传信息）
    expect(title.text()).toBe('宝宝')
    expect(title.attributes('title')).toBe('阿宝')
    expect(wrapper.find('[data-testid="avatar-pendant"]').exists()).toBe(true)
    // 会话列表里 TA 那一行有挂件与 glow，别人那行没有
    const rows = wrapper.findAll('[data-testid="conv-item"]')
    const partnerRow = rows.find((r) => r.attributes('data-username') === PARTNER)
    const otherRow = rows.find((r) => r.attributes('data-username') === OTHER)
    expect(partnerRow?.find('.pendant').exists()).toBe(true)
    expect(partnerRow?.find('.conv-name').classes()).toContain('couple-name-glow')
    expect(otherRow?.find('.pendant').exists()).toBe(false)
    expect(otherRow?.find('.conv-name').classes()).not.toContain('couple-name-glow')
  })

  it('一档都没解锁：没有 data-couple-bubble、没有 glow 类、没有挂件，会话头仍是原展示名', async () => {
    setupCouple({ established: true, tiers: [], petName: '宝宝' })
    const wrapper = await mountChatView(PARTNER)
    expect(wrapper.find('[data-testid="dm-area"]').attributes('data-couple-bubble')).toBeUndefined()
    expect(wrapper.find('[data-testid="chat-title"]').classes()).not.toContain('couple-name-glow')
    expect(wrapper.find('[data-testid="chat-title"]').text()).toBe('阿宝')
    expect(wrapper.find('.pendant').exists()).toBe(false)
  })

  it('解锁了但对象不是 TA（旁人视角）：气泡属性与特效都不出现', async () => {
    setupCouple({
      established: true,
      tiers: [COUPLE_VISUAL_TIER.bubble, COUPLE_VISUAL_TIER.nicknameGlow, COUPLE_VISUAL_TIER.pendant],
    })
    const wrapper = await mountChatView(OTHER)
    expect(wrapper.find('[data-testid="dm-area"]').attributes('data-couple-bubble')).toBeUndefined()
    expect(wrapper.find('[data-testid="chat-title"]').classes()).not.toContain('couple-name-glow')
    // 会话列表里只有 TA 那一行点亮
    const rows = wrapper.findAll('[data-testid="conv-item"]')
    const partnerRow = rows.find((r) => r.attributes('data-username') === PARTNER)
    expect(partnerRow?.find('.conv-name').classes()).toContain('couple-name-glow')
    expect(partnerRow?.find('.pendant').exists()).toBe(true)
    expect(
      rows.find((r) => r.attributes('data-username') === OTHER)?.find('.pendant').exists(),
    ).toBe(false)
  })

  it('没有情侣空间：一切照旧，消息内容也不受影响', async () => {
    setupCouple({ established: false })
    const wrapper = await mountChatView(PARTNER)
    expect(wrapper.find('[data-testid="dm-area"]').attributes('data-couple-bubble')).toBeUndefined()
    expect(wrapper.find('.pendant').exists()).toBe(false)
    expect(wrapper.find('[data-testid="chat-title"]').classes()).not.toContain('couple-name-glow')
    const bubbles = wrapper.findAll('[data-testid="dm-bubble"]')
    expect(bubbles).toHaveLength(2)
    expect(bubbles[1].text()).toBe('想你啦')
  })

  it('只解锁气泡时，昵称特效与挂件不会跟着出现（逐档独立）', async () => {
    setupCouple({ established: true, tiers: [COUPLE_VISUAL_TIER.bubble], petName: '宝宝' })
    const wrapper = await mountChatView(PARTNER)
    expect(wrapper.find('[data-testid="dm-area"]').attributes('data-couple-bubble')).toBe('on')
    expect(wrapper.find('[data-testid="chat-title"]').classes()).not.toContain('couple-name-glow')
    expect(wrapper.find('[data-testid="chat-title"]').text()).toBe('阿宝')
    expect(wrapper.find('.pendant').exists()).toBe(false)
  })
})

// ============ 4. 专属贴纸包：分组只在解锁后出现，内容纯 unicode ============

describe('专属贴纸包', () => {
  it('未解锁 custom-emoji：表情面板里没有我们的分组', () => {
    setupCouple({ established: true, tiers: [COUPLE_VISUAL_TIER.bubble] })
    const wrapper = mount(EmojiPicker)
    expect(wrapper.find('[data-emoji-group="couple-pack"]').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('我们的专属贴纸')
  })

  it('没有情侣空间：同样不会出现分组', () => {
    setupCouple({ established: false })
    const wrapper = mount(EmojiPicker)
    expect(wrapper.find('[data-emoji-group="couple-pack"]').exists()).toBe(false)
  })

  it('解锁后分组出现，格子里是可点的贴纸（点击照常走 select 事件）', async () => {
    setupCouple({ established: true, tiers: [COUPLE_VISUAL_TIER.customEmoji], theme: 'cherry', days: 66 })
    // 贴纸取的是「我的昵称 + TA 的昵称/爱称」首字
    useImStore().myProfile = {
      username: SELF,
      nickname: '小舟',
      signature: '',
      avatar: 'c1',
      presenceStatus: 'online',
    }
    const wrapper = mount(EmojiPicker)
    const cells = wrapper.findAll('[data-emoji-group="couple-pack"]')
    expect(cells.length).toBeGreaterThan(0)
    const pack = buildCoupleStickers({ meName: '小舟', partnerName: '阿宝', days: 66, theme: 'cherry' })
    expect(cells.map((c) => c.text())).toEqual(pack)
    expect(pack.some((s) => s.includes('第66天'))).toBe(true)
    await cells[0].trigger('click')
    expect(wrapper.emitted('select')?.[0]).toEqual([pack[0]])
  })

  it('生成器确定性：同输入同输出（顺序也一致）', () => {
    const seed = { meName: '小舟', partnerName: '阿宝', days: 100, theme: 'ocean' }
    expect(buildCoupleStickers(seed)).toEqual(buildCoupleStickers(seed))
    expect(buildCoupleStickers(seed)).toEqual(buildCoupleStickers({ ...seed }))
  })

  it('换个昵称 / 天数 / 主题就会得到不同的贴纸串', () => {
    const base = { meName: '小舟', partnerName: '阿宝', days: 50, theme: 'classic' }
    expect(buildCoupleStickers(base)).not.toEqual(buildCoupleStickers({ ...base, partnerName: '大鱼' }))
    expect(buildCoupleStickers(base)).not.toEqual(buildCoupleStickers({ ...base, meName: '阿舟' }))
    expect(buildCoupleStickers(base)).not.toEqual(buildCoupleStickers({ ...base, days: 51 }))
    expect(buildCoupleStickers(base)).not.toEqual(buildCoupleStickers({ ...base, theme: 'night' }))
  })

  it('产品红线：只有 unicode 文字，没有 URL / 标签 / 图片', () => {
    const pack = buildCoupleStickers({ meName: '小舟', partnerName: '阿宝', days: 88, theme: 'forest' })
    expect(pack.length).toBeGreaterThan(0)
    for (const sticker of pack) {
      expect(isStickerText(sticker)).toBe(true)
      expect(sticker).not.toMatch(/https?:|www\.|data:|\/\/|<|>|\\/i)
      expect(Array.from(sticker).length).toBeLessThanOrEqual(12)
    }
    // 脏输入也带不出 URL / 标签
    expect(
      buildCoupleStickers({ meName: 'http://a.com', partnerName: '<img src=x>', days: 3, theme: 'classic' }),
    ).toEqual(buildCoupleStickers({ meName: 'h', partnerName: '<', days: 3, theme: 'classic' }))
  })

  it('昵称缺失/天数为 0 时回落，不会生成空串', () => {
    const pack = buildCoupleStickers({ meName: '', partnerName: '   ', days: 0, theme: 'nope' })
    expect(pack.every((s) => isStickerText(s))).toBe(true)
    expect(pack.some((s) => s.includes('·'))).toBe(true)
    expect(pack.some((s) => s.includes('第1天'))).toBe(true)
  })

  it('分组标题带主题挂件色，未列主题回落 💞', () => {
    expect(coupleStickerGroupName('cherry')).toBe('🌸 我们的专属贴纸')
    expect(coupleStickerGroupName(null)).toBe('💞 我们的专属贴纸')
  })
})

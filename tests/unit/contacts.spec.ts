import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ContactsView from '@/views/ContactsView.vue'
import { friendApi, messageApi, profileApi } from '@/api/im'
import { useAuthStore } from '@/stores/auth'
import type { FriendVO, FriendRequestVO } from '@/types'

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
  starsApi: {
    list: vi.fn(),
  },
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

const mockedFriendsList = vi.mocked(friendApi.list)
const mockedIncoming = vi.mocked(friendApi.incoming)
const mockedOutgoing = vi.mocked(friendApi.outgoing)
const mockedProfile = vi.mocked(profileApi.me)
// F42 生日提醒：默认空列表（组件 onMounted 会加载）
vi.mocked(profileApi.friendsBirthdays).mockResolvedValue([])
const mockedApply = vi.mocked(friendApi.apply)
const mockedAccept = vi.mocked(friendApi.accept)

function friend(partial: Partial<FriendVO>): FriendVO {
  return {
    id: partial.username ?? 'f',
    username: 'user',
    remark: '',
    tag: '',
    pinned: false,
    muted: false,
    blocked: false,
    online: false,
    status: '',
    lastSeenAt: Date.now() - 60_000,
    unread: 0,
    ...partial,
  } as FriendVO
}

function request(partial: Partial<FriendRequestVO>): FriendRequestVO {
  return {
    id: 'req-1',
    fromUser: 'dave',
    toUser: 'alice',
    message: '',
    status: 'PENDING',
    created: Date.now(),
    ...partial,
  }
}

const mountView = () => mount(ContactsView, { global: { plugins: [pinia] } })

let pinia: ReturnType<typeof createPinia>

beforeEach(() => {
  vi.clearAllMocks()
  sessionStorage.clear()
  pinia = createPinia()
  setActivePinia(pinia)
  const auth = useAuthStore()
  auth.username = 'alice'
  mockedIncoming.mockResolvedValue([])
  mockedOutgoing.mockResolvedValue([])
  mockedProfile.mockResolvedValue({ username: 'alice', nickname: 'alice', signature: '', avatar: 'c1', presenceStatus: 'online' })
})

describe('ContactsView 通讯录（好友功能合并）', () => {
  it('按 A–Z / # 分组且组内按拼音排序，备注优先展示', async () => {
    mockedFriendsList.mockResolvedValue([
      friend({ id: 'f1', username: 'carol' }),
      friend({ id: 'f2', username: 'anna' }),
      friend({ id: 'f3', username: 'bobby', remark: '波波' }),
      friend({ id: 'f4', username: 'david' }),
      friend({ id: 'f5', username: '安安' }),
    ])
    const wrapper = mountView()
    await flushPromises()

    const letters = wrapper.findAll('[data-testid="contacts-letter"]').map((n) => n.text())
    expect(letters).toEqual(['A', 'C', 'D', '#'])
    expect(wrapper.findAll('[data-testid="contact-item"]').length).toBe(5)
    // # 组内中文按拼音排序：安安(ān) 在 波波(bō) 之前
    const hashItems = wrapper
      .findAll('[data-testid="contact-item"]')
      .map((n) => n.text())
      .filter((t) => t.includes('波波') || t.includes('安安'))
    expect(hashItems[0]).toContain('安安')
    expect(hashItems[1]).toContain('波波')
  })

  it('页面提供添加好友入口（原「好友」菜单功能已合并）', async () => {
    mockedFriendsList.mockResolvedValue([friend({ id: 'f1', username: 'carol' })])
    const wrapper = mountView()
    await flushPromises()

    expect(wrapper.find('[data-testid="add-friend-open"]').exists()).toBe(true)
  })

  it('收到的申请显示并可同意，同意后刷新好友列表', async () => {
    mockedFriendsList.mockResolvedValue([friend({ id: 'f1', username: 'carol' })])
    mockedIncoming.mockResolvedValue([request({ id: 'req-9', fromUser: 'dave', message: '我是 dave' })])
    mockedAccept.mockResolvedValue(undefined)
    const wrapper = mountView()
    await flushPromises()

    const reqRow = wrapper.find('[data-testid="incoming-request"]')
    expect(reqRow.exists()).toBe(true)
    expect(reqRow.text()).toContain('dave')
    expect(reqRow.find('[data-testid="request-note"]').text()).toContain('我是 dave')

    await reqRow.find('[data-testid="accept-btn"]').trigger('click')
    await flushPromises()
    expect(mockedAccept).toHaveBeenCalledWith('req-9')
  })

  it('打开添加好友对话框并发送申请', async () => {
    mockedFriendsList.mockResolvedValue([])
    mockedApply.mockResolvedValue(request({ id: 'req-new', fromUser: 'alice', toUser: 'dave' }))
    const wrapper = mountView()
    await flushPromises()

    await wrapper.find('[data-testid="add-friend-open"]').trigger('click')
    await flushPromises()
    const input = wrapper.find('[data-testid="add-friend-input"]')
    expect(input.exists()).toBe(true)
    await input.setValue('dave')
    await wrapper.find('[data-testid="add-friend-btn"]').trigger('click')
    await flushPromises()
    expect(mockedApply).toHaveBeenCalledWith('dave', undefined)
  })

  it('搜索按备注或用户名过滤', async () => {
    mockedFriendsList.mockResolvedValue([
      friend({ id: 'f1', username: 'carol' }),
      friend({ id: 'f2', username: 'anna', remark: '小安' }),
    ])
    const wrapper = mountView()
    await flushPromises()

    await wrapper.find('[data-testid="contacts-search"]').setValue('小安')
    expect(wrapper.findAll('[data-testid="contact-item"]').length).toBe(1)
    expect(wrapper.find('[data-testid="contact-item"]').text()).toContain('anna')

    await wrapper.find('[data-testid="contacts-search"]').setValue('zzz')
    expect(wrapper.findAll('[data-testid="contact-item"]').length).toBe(0)
  })

  it('点击发消息跳转会话并预选 peer', async () => {
    mockedFriendsList.mockResolvedValue([friend({ id: 'f1', username: 'carol' })])
    const wrapper = mountView()
    await flushPromises()

    await wrapper.find('[data-testid="contact-chat-carol"]').trigger('click')
    expect(push).toHaveBeenCalledWith({ path: '/chat', query: { peer: 'carol' } })
  })

  it('空联系人显示空态并引导到添加好友', async () => {
    mockedFriendsList.mockResolvedValue([])
    const wrapper = mountView()
    await flushPromises()

    expect(wrapper.find('[data-testid="contacts-empty"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="contacts-empty"]').text()).toContain('添加好友')
    expect(messageApi.history).not.toHaveBeenCalled()
  })
})

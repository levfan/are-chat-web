import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useImStore } from '@/stores/im'
import { friendApi, messageApi, profileApi } from '@/api/im'
import { filesApi } from '@/api/files'
import type { FriendVO, ImMessage } from '@/types'

vi.mock('@/api/im', () => ({
  friendApi: {
    list: vi.fn(),
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
  },
  profileApi: {
    me: vi.fn(),
    update: vi.fn(),
    of: vi.fn(),
  },
  starsApi: {
    list: vi.fn(),
  },
  statsApi: {
    me: vi.fn(),
  },
}))

vi.mock('@/api/files', () => ({
  filesApi: {
    upload: vi.fn(),
    list: vi.fn(),
    remove: vi.fn(),
  },
}))

const mockedFriendsList = vi.mocked(friendApi.list)
const mockedIncoming = vi.mocked(friendApi.incoming)
const mockedOutgoing = vi.mocked(friendApi.outgoing)
const mockedProfile = vi.mocked(profileApi.me)
const mockedHistory = vi.mocked(messageApi.history)
const mockedMarkRead = vi.mocked(messageApi.markRead)
const mockedSend = vi.mocked(messageApi.send)
const mockedUpload = vi.mocked(filesApi.upload)

const SELF = 'alice'
const PEER = 'bob'

class FakeWebSocket {
  static instances: FakeWebSocket[] = []
  static OPEN = 1
  readyState = 1
  onopen: (() => void) | null = null
  onmessage: ((event: { data: string }) => void) | null = null
  onclose: (() => void) | null = null
  onerror: (() => void) | null = null
  sent: string[] = []

  constructor() {
    FakeWebSocket.instances.push(this)
  }

  send(data: string) {
    this.sent.push(data)
  }

  close() {}

  /** 模拟服务端推送 */
  receive(payload: unknown) {
    this.onmessage?.({ data: JSON.stringify(payload) })
  }
}

vi.stubGlobal('WebSocket', FakeWebSocket as unknown as typeof WebSocket)

function makeFriend(overrides: Partial<FriendVO>): FriendVO {
  return {
    id: 'friend-1',
    username: PEER,
    remark: '',
    tag: '',
    pinned: false,
    muted: false,
    blocked: false,
    online: false,
    status: 'online',
    lastSeenAt: null,
    unread: 0,
    lastMessage: null,
    ...overrides,
  }
}

function textMessage(id: string, from: string, to: string, content: string): ImMessage {
  return {
    id,
    fromUser: from,
    toUser: to,
    content,
    msgType: 'text',
    status: 'SENT',
    replyToId: null,
    created: Date.now(),
  }
}

async function initStore(selfName = SELF) {
  const im = useImStore()
  mockedFriendsList.mockResolvedValue([makeFriend({})])
  mockedIncoming.mockResolvedValue([])
  mockedOutgoing.mockResolvedValue([])
  mockedProfile.mockResolvedValue({
    username: selfName,
    nickname: selfName,
    signature: '',
    avatar: '🐷',
    presenceStatus: 'online',
  })
  mockedMarkRead.mockResolvedValue(undefined)

  await im.init(selfName)
  FakeWebSocket.instances.at(-1)!.onopen?.()
  return im
}

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
  FakeWebSocket.instances = []
})

describe('im store', () => {
  it('init 加载好友/申请/资料并建立连接', async () => {
    const im = await initStore()

    expect(im.friends).toHaveLength(1)
    expect(im.myProfile?.avatar).toBe('🐷')
    expect(im.status).toBe('open')
  })

  it('openConversation 拉取历史并清零未读', async () => {
    const im = await initStore()
    im.friends[0].unread = 3
    const history = [
      textMessage('m1', PEER, SELF, '在吗'),
      textMessage('m2', SELF, PEER, '在的'),
    ]
    mockedHistory.mockResolvedValue(history)

    await im.openConversation(PEER)

    expect(im.activePeer).toBe(PEER)
    expect(im.activeMessages.map((m) => m.content)).toEqual(['在吗', '在的'])
    expect(im.friends[0].unread).toBe(0)
    expect(mockedMarkRead).toHaveBeenCalledWith(PEER)
  })

  it('非当前会话收到 dm 推送：未读 +1 且更新预览', async () => {
    const im = await initStore()
    const socket = FakeWebSocket.instances.at(-1)!
    const created = Date.now()

    socket.receive({
      type: 'dm',
      msgId: 'dm-1',
      from: PEER,
      to: SELF,
      content: '今晚吃什么',
      msgType: 'text',
      replyToId: null,
      created,
    })

    expect(im.friends[0].unread).toBe(1)
    expect(im.friends[0].lastMessage?.content).toBe('今晚吃什么')
    expect(im.messages[PEER]).toHaveLength(1)
    expect(mockedMarkRead).not.toHaveBeenCalled()
  })

  it('当前会话收到 dm 推送：自动已读', async () => {
    const im = await initStore()
    await im.openConversation(PEER)
    const socket = FakeWebSocket.instances.at(-1)!

    socket.receive({
      type: 'dm',
      msgId: 'dm-2',
      from: PEER,
      to: SELF,
      content: '吃火锅！',
      msgType: 'text',
      replyToId: null,
      created: Date.now(),
    })

    expect(im.friends[0].unread).toBe(0)
    expect(mockedMarkRead).toHaveBeenCalledWith(PEER)
    expect(im.activeMessages.at(-1)?.content).toBe('吃火锅！')
  })

  it('typing 推送驱动「正在输入」状态', async () => {
    const im = await initStore()
    const socket = FakeWebSocket.instances.at(-1)!

    socket.receive({ type: 'typing', from: PEER, to: SELF, typing: true })
    expect(im.typingFrom).toBe(PEER)

    socket.receive({ type: 'typing', from: PEER, to: SELF, typing: false })
    expect(im.typingFrom).toBe('')
  })

  it('recall 推送把消息标记为已撤回', async () => {
    const im = await initStore()
    im.messages[PEER] = [textMessage('dm-3', PEER, SELF, '说错话了')]
    const socket = FakeWebSocket.instances.at(-1)!

    socket.receive({ type: 'recall', from: PEER, to: SELF, msgId: 'dm-3' })

    expect(im.messages[PEER]![0].status).toBe('RECALLED')
  })

  it('presence 推送更新好友在线状态', async () => {
    const im = await initStore()
    const socket = FakeWebSocket.instances.at(-1)!

    socket.receive({ type: 'presence', name: PEER, msg: '1' })
    expect(im.friends[0].online).toBe(true)

    socket.receive({ type: 'presence', name: PEER, msg: '0' })
    expect(im.friends[0].online).toBe(false)
  })

  it('friend-request 推送会刷新申请列表', async () => {
    const im = await initStore()
    mockedIncoming.mockResolvedValue([
      { id: 'req-1', fromUser: PEER, toUser: SELF, message: '', status: 'PENDING', created: Date.now() },
    ])
    const socket = FakeWebSocket.instances.at(-1)!

    socket.receive({ type: 'friend-request', username: SELF, requestId: 'req-1' })
    await vi.waitFor(() => expect(im.incoming).toHaveLength(1))
  })

  it('sendText 落库返回后写入会话与预览', async () => {
    const im = await initStore()
    mockedHistory.mockResolvedValue([])
    await im.openConversation(PEER)
    const saved = textMessage('mine-1', SELF, PEER, '你好呀')
    mockedSend.mockResolvedValue(saved)

    await im.sendText(PEER, '你好呀')

    expect(mockedSend).toHaveBeenCalledWith(PEER, '你好呀', 'text', null)
    expect(im.activeMessages).toContainEqual(saved)
    expect(im.friends[0].lastMessage?.content).toBe('你好呀')
  })

  it('sendImage 先上传再把站内地址作为图片消息发送', async () => {
    const im = await initStore()
    mockedHistory.mockResolvedValue([])
    await im.openConversation(PEER)
    mockedUpload.mockResolvedValue({
      id: 'file-1',
      originalName: 'cat.png',
      contentType: 'image/png',
      size: 10,
      sha256: 'abc',
      deduplicated: false,
      downloadUrl: '/api/files/file-1/download',
      uploadedAt: Date.now(),
    })
    const saved = textMessage('img-1', SELF, PEER, '/api/files/file-1/download')
    saved.msgType = 'image'
    mockedSend.mockResolvedValue(saved)

    const file = new File(['x'], 'cat.png', { type: 'image/png' })
    await im.sendImage(PEER, file)

    expect(mockedUpload).toHaveBeenCalledWith(file)
    expect(mockedSend).toHaveBeenCalledWith(PEER, '/api/files/file-1/download', 'image', null)
    expect(im.activeMessages.at(-1)?.msgType).toBe('image')
  })

  it('发送失败留下 FAILED 消息，重试成功后替换', async () => {
    const im = await initStore()
    mockedHistory.mockResolvedValue([])
    await im.openConversation(PEER)
    mockedSend.mockRejectedValueOnce(new Error('网络炸了'))
    const saved = textMessage('ok-1', SELF, PEER, '再试一次')
    mockedSend.mockResolvedValue(saved)

    await expect(im.sendText(PEER, '再试一次')).rejects.toThrow('网络炸了')
    expect(im.activeMessages).toHaveLength(1)
    expect(im.activeMessages[0].status).toBe('FAILED')

    const retried = await im.retryMessage(im.activeMessages[0].id)
    expect(retried?.id).toBe('ok-1')
    expect(im.activeMessages).toHaveLength(1)
    expect(im.activeMessages[0].status).toBe('SENT')
  })

  it('免打扰会话的未读不计入总数', async () => {
    const im = await initStore()
    im.friends[0].unread = 5
    expect(im.totalUnread).toBe(5)

    // 开启免打扰后：总数清零，但会话内未读数字仍然保留
    im.friends[0].muted = true
    expect(im.totalUnread).toBe(0)
    expect(im.friends[0].unread).toBe(5)

    im.friends[0].muted = false
    expect(im.totalUnread).toBe(5)
  })

  it('dm 推送携带引用消息 id', async () => {
    const im = await initStore()
    const socket = FakeWebSocket.instances.at(-1)!

    socket.receive({
      type: 'dm',
      msgId: 'dm-quote',
      from: PEER,
      to: SELF,
      content: '回复你',
      msgType: 'text',
      replyToId: 'dm-0',
      created: Date.now(),
    })

    expect(im.messages[PEER]![0].replyToId).toBe('dm-0')
  })

  it('会话内搜索走接口并透传结果', async () => {
    const im = await initStore()
    const hit = textMessage('hit-1', PEER, SELF, '火锅')
    vi.mocked(messageApi.search).mockResolvedValue([hit])

    const results = await im.searchMessages(PEER, '火锅')

    expect(messageApi.search).toHaveBeenCalledWith(PEER, '火锅')
    expect(results).toEqual([hit])
    im.clearSearch()
    expect(im.searchResults).toHaveLength(0)
  })

  it('markAllRead 清零所有未读', async () => {
    const im = await initStore()
    im.friends[0].unread = 4

    await im.markAllRead()

    expect(mockedMarkRead).toHaveBeenCalledWith(PEER)
    expect(im.friends[0].unread).toBe(0)
  })

  it('好友操作失败时错误向上抛出', async () => {
    const im = await initStore()
    vi.mocked(friendApi.apply).mockRejectedValue(new Error('你们已经是好友了'))

    await expect(im.applyFriend(PEER)).rejects.toThrow('已经是好友')
  })
})

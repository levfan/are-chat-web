import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { friendApi, messageApi, profileApi } from '@/api/im'
import { adminApi } from '@/api/auth'
import { filesApi } from '@/api/files'
import { playMessageTone } from '@/utils/sound'
import { showNotification } from '@/utils/notify'
import { compressImageIfNeeded } from '@/utils/image'
import { isQuietNow } from '@/utils/settings'
import type {
  FilePayload,
  FriendCardPayload,
  FriendRequestVO,
  FriendVO,
  ImMessage,
  ImPushMessage,
  LocationPayload,
  PinVO,
  UserProfileVO,
} from '@/types'

/** 会话列表/通知/浮动卡片共用的预览文案 */
export function messagePreviewText(msgType: string, content: string): string {
  if (msgType === 'image') {
    return '[图片]'
  }
  if (msgType === 'file') {
    try {
      const file = JSON.parse(content) as FilePayload
      return `[文件] ${file.name}`
    } catch {
      return '[文件]'
    }
  }
  if (msgType === 'poke') {
    return content && content !== '[拍一拍]' ? `拍了拍你${content}` : '拍了拍你'
  }
  if (msgType === 'card') {
    try {
      const card = JSON.parse(content) as FriendCardPayload
      return `[名片] ${card.nickname || card.username}`
    } catch {
      return '[名片]'
    }
  }
  if (msgType === 'location') {
    try {
      const place = JSON.parse(content) as LocationPayload
      return `[位置] ${place.name}`
    } catch {
      return '[位置]'
    }
  }
  return content
}

function wsUrl(name: string) {
  const proto = location.protocol === 'https:' ? 'wss' : 'ws'
  return `${proto}://${location.host}/ws/chat/${encodeURIComponent(name)}`
}

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // 隐身模式等场景下忽略
  }
}

export const useImStore = defineStore('im', () => {
  const friends = ref<FriendVO[]>([])
  const incoming = ref<FriendRequestVO[]>([])
  const outgoing = ref<FriendRequestVO[]>([])
  const activePeer = ref('')
  const messages = ref<Record<string, ImMessage[]>>({})
  const typingFrom = ref('')
  const status = ref<'idle' | 'connecting' | 'open' | 'closed'>('idle')
  const selfName = ref('')
  const myProfile = ref<UserProfileVO | null>(null)
  const initialized = ref(false)

  // ---------- 会话草稿（31，localStorage 持久化） ----------
  const drafts = ref<Record<string, string>>((() => {
    try {
      return JSON.parse(safeGet('arechat.drafts') ?? '{}') as Record<string, string>
    } catch {
      return {}
    }
  })())

  function persistDrafts() {
    safeSet('arechat.drafts', JSON.stringify(drafts.value))
  }

  function setDraft(peer: string, text: string) {
    const trimmed = text ?? ''
    if (trimmed) {
      drafts.value[peer] = trimmed
    } else {
      delete drafts.value[peer]
    }
    persistDrafts()
  }

  function clearDraft(peer: string) {
    setDraft(peer, '')
  }

  let socket: WebSocket | null = null
  let heartTimer: number | null = null
  let typingHideTimer: number | null = null
  let reconnectTimer: number | null = null
  let reconnectAttempts = 0
  let manualClose = false
  let lastTypingSentAt = 0

  const activeFriend = computed(() => friends.value.find((f) => f.username === activePeer.value) ?? null)
  const activeMessages = computed(() => (activePeer.value ? messages.value[activePeer.value] ?? [] : []))
  /** 未读总数：免打扰的会话不计入侧边栏/标题红点，但会话内仍显示 */
  const totalUnread = computed(() =>
    friends.value.filter((f) => !f.muted).reduce((sum, f) => sum + f.unread, 0),
  )

  /**
   * 用户名 → 展示名（好友备注优先，其次对方昵称，最后回退用户名）。
   * 全站所有出现好友名称的地方（会话列表、聊天气泡、历史消息、搜索结果、
   * 输入中提示、通知等）都必须经过这里解析：备注/昵称是实时读 friends 的
   * 响应式取值，修改备注（updateFriend → loadFriends）或对方改昵称
   * （loadFriends 拉平）后所有界面连同已加载的历史消息会立即以新名称渲染。
   */
  function displayNameOf(username: string): string {
    if (!username) {
      return ''
    }
    const friend = friends.value.find((f) => f.username === username)
    return friend?.remark || friend?.nickname || username
  }

  // ---------- 数据加载 ----------

  async function loadFriends() {
    friends.value = await friendApi.list()
  }

  async function loadRequests() {
    const [inList, outList] = await Promise.all([friendApi.incoming(), friendApi.outgoing()])
    // 只保留待处理申请：已同意/已拒绝的不再展示（后端也只返回 PENDING，这里是双保险）
    incoming.value = inList.filter((r) => r.status === 'PENDING')
    outgoing.value = outList.filter((r) => r.status === 'PENDING')
  }

  async function loadProfile() {
    myProfile.value = await profileApi.me()
  }

  async function saveProfile(patch: { nickname?: string; signature?: string; avatar?: string; presenceStatus?: string }) {
    myProfile.value = await profileApi.update(patch)
  }

  /** 并发调用共用同一次初始化：MainLayout 与 ChatView 的 onMounted 会同时触发 */
  let initTask: Promise<void> | null = null
  let initUser = ''

  /** 进入 IM 首页时调用一次：加载好友/申请/资料并建立 WebSocket */
  async function init(username: string) {
    if (initialized.value && status.value === 'open' && selfName.value === username) {
      return
    }
    if (initTask && initUser === username) {
      return initTask
    }
    initUser = username
    initTask = (async () => {
      selfName.value = username
      await Promise.all([loadFriends(), loadRequests(), loadProfile()])
      connect()
      initialized.value = true
    })().finally(() => {
      initTask = null
    })
    return initTask
  }

  // ---------- 好友操作 ----------

  async function applyFriend(username: string, message?: string) {
    const vo = await friendApi.apply(username, message)
    await loadRequests()
    return vo
  }

  async function acceptRequest(id: string) {
    await friendApi.accept(id)
    // 处理完立刻从列表移除：徽标与按钮即时消失，不等重新拉取
    incoming.value = incoming.value.filter((r) => r.id !== id)
    await Promise.all([loadFriends(), loadRequests()])
  }

  async function rejectRequest(id: string) {
    await friendApi.reject(id)
    incoming.value = incoming.value.filter((r) => r.id !== id)
    await loadRequests()
  }

  async function updateFriend(id: string, patch: { remark?: string; pinned?: boolean; muted?: boolean; tag?: string; blocked?: boolean }) {
    await friendApi.update(id, patch)
    await loadFriends()
  }

  /** 50 一键全部已读：把所有有未读的会话标记已读 */
  async function markAllRead() {
    const targets = friends.value.filter((f) => f.unread > 0)
    await Promise.all(targets.map((f) => messageApi.markRead(f.username).catch(() => {})))
    for (const friend of targets) {
      friend.unread = 0
    }
    await loadFriends()
  }

  async function removeFriend(id: string) {
    const target = friends.value.find((f) => f.id === id)
    await friendApi.remove(id)
    if (target) {
      delete messages.value[target.username]
      if (activePeer.value === target.username) {
        activePeer.value = ''
      }
    }
    await loadFriends()
  }

  // ---------- 会话与消息 ----------

  function ensureMessages(peer: string): ImMessage[] {
    if (!messages.value[peer]) {
      messages.value[peer] = []
    }
    return messages.value[peer]
  }

  async function openConversation(peer: string) {
    activePeer.value = peer
    if (typingFrom.value) {
      typingFrom.value = ''
    }
    searchResults.value = []
    if (!messages.value[peer]) {
      messages.value[peer] = await messageApi.history(peer)
    }
    // 84 会话内置顶消息
    pinned.value = await messageApi.currentPin(peer).catch(() => null)
    // 记住上次会话（41）
    const friend = friends.value.find((f) => f.username === peer)
    if (friend) {
      safeSet('arechat.lastPeer', peer)
    }
    if (friend && friend.unread > 0) {
      friend.unread = 0
      messageApi.markRead(peer).catch(() => {})
    }
  }

  async function loadMoreHistory() {
    const peer = activePeer.value
    const list = messages.value[peer]
    if (!peer || !list || list.length === 0) {
      return []
    }
    const older = await messageApi.history(peer, list[0].created)
    if (older.length > 0) {
      messages.value[peer] = [...older, ...list]
    }
    return older
  }

  async function sendOutgoing(peer: string, content: string, type: ImMessage['msgType'], replyToId: string | null) {
    const local: ImMessage = {
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      fromUser: selfName.value,
      toUser: peer,
      content,
      msgType: type,
      status: 'SENDING',
      replyToId,
      created: Date.now(),
    }
    ensureMessages(peer).push(local)
    const friend = friends.value.find((f) => f.username === peer)
    if (friend) {
      friend.lastMessage = { content, msgType: type, created: local.created, fromMe: true }
    }
    clearDraft(peer)
    try {
      const saved = await messageApi.send(peer, content, type, replyToId)
      const list = ensureMessages(peer)
      const index = list.findIndex((m) => m.id === local.id)
      if (index >= 0) {
        list.splice(index, 1, saved)
      } else {
        list.push(saved)
      }
      if (friend) {
        friend.lastMessage = { content: saved.content, msgType: saved.msgType, created: saved.created, fromMe: true }
      }
      return saved
    } catch (e) {
      local.status = 'FAILED'
      throw e
    }
  }

  async function sendText(peer: string, content: string, opts: { replyToId?: string | null } = {}) {
    return sendOutgoing(peer, content, 'text', opts.replyToId ?? null)
  }

  /** 图片消息：90 超过 1.5MB 的图片先压缩再上传（SHA-256 去重），站内地址作为消息内容 */
  async function sendImage(peer: string, file: File) {
    const { blob, name } = await compressImageIfNeeded(file)
    const toUpload = blob === file ? file : new File([blob], name, { type: 'image/jpeg' })
    const uploaded = await filesApi.upload(toUpload)
    return sendOutgoing(peer, uploaded.downloadUrl, 'image', null)
  }

  /** 82 文件消息：任意类型文件（后端黑名单拦截可执行文件），content 为 JSON 卡片 */
  async function sendFile(peer: string, file: File) {
    const uploaded = await filesApi.upload(file)
    const payload: FilePayload = {
      name: uploaded.originalName,
      size: uploaded.size,
      url: uploaded.downloadUrl,
    }
    return sendOutgoing(peer, JSON.stringify(payload), 'file', null)
  }

  /** 67 拍一拍：可带自定义后缀（如「的小脑袋」），留空用默认文案 */
  async function sendPoke(peer: string, suffix = '') {
    return sendOutgoing(peer, suffix.slice(0, 100), 'poke', null)
  }

  /** 72 分享好友名片：content 为卡片 JSON */
  async function sendCard(peer: string, card: FriendCardPayload) {
    return sendOutgoing(peer, JSON.stringify(card), 'card', null)
  }

  /** 73 分享位置：content 为位置卡片 JSON */
  async function sendLocation(peer: string, place: LocationPayload) {
    return sendOutgoing(peer, JSON.stringify(place), 'location', null)
  }

  /** 重发失败消息：找到本地 FAILED 记录，原样重发并替换 */
  async function retryMessage(localId: string) {
    for (const [peer, list] of Object.entries(messages.value)) {
      const index = list.findIndex((m) => m.id === localId && m.status === 'FAILED')
      if (index < 0) {
        continue
      }
      const target = list[index]
      const saved = await messageApi.send(peer, target.content, target.msgType, target.replyToId)
      list.splice(index, 1, saved)
      const friend = friends.value.find((f) => f.username === peer)
      if (friend) {
        friend.lastMessage = { content: saved.content, msgType: saved.msgType, created: saved.created, fromMe: true }
      }
      return saved
    }
    return null
  }

  // ---------- 会话内搜索 ----------

  const searchResults = ref<ImMessage[]>([])

  async function searchMessages(peer: string, keyword: string) {
    searchResults.value = await messageApi.search(peer, keyword)
    return searchResults.value
  }

  function clearSearch() {
    searchResults.value = []
  }

  // ---------- 84 会话内置顶 ----------

  const pinned = ref<PinVO | null>(null)

  async function pinMessage(peer: string, msgId: string) {
    pinned.value = await messageApi.pin(peer, msgId)
  }

  async function unpinConversation(peer: string) {
    await messageApi.unpin(peer)
    pinned.value = null
  }

  // ---------- 85 清空聊天记录 / 95 附件 ----------

  /** 清空当前会话全部消息（后端删除双方记录），返回删除条数 */
  async function clearConversation(peer: string) {
    const result = await messageApi.clear(peer)
    delete messages.value[peer]
    pinned.value = null
    await loadFriends()
    return result.deleted
  }

  async function recallMessage(msgId: string) {
    await messageApi.recall(msgId)
    markRecalled(msgId)
    // 84 撤回的消息若是置顶消息则取消置顶
    if (pinned.value?.msgId === msgId) {
      const peer = activePeer.value
      if (peer) {
        messageApi.unpin(peer).catch(() => {})
      }
      pinned.value = null
    }
  }

  function markRecalled(msgId: string) {
    for (const list of Object.values(messages.value)) {
      const target = list.find((m) => m.id === msgId)
      if (target) {
        target.status = 'RECALLED'
      }
    }
  }

  // ---------- 回应 / 收藏 / 编辑 / 转发 ----------

  function findMessage(msgId: string): ImMessage | null {
    for (const list of Object.values(messages.value)) {
      const target = list.find((m) => m.id === msgId)
      if (target) {
        return target
      }
    }
    return null
  }

  /** 表情回应 toggle：乐观更新，失败回滚；服务端同时向双方广播 */
  async function toggleReaction(msgId: string, emoji: string) {
    const target = findMessage(msgId)
    if (!target) {
      return
    }
    const previous = target.reactions ?? []
    const index = previous.findIndex((r) => r.username === selfName.value && r.emoji === emoji)
    target.reactions =
      index >= 0
        ? [...previous.slice(0, index), ...previous.slice(index + 1)]
        : [...previous, { username: selfName.value, emoji }]
    try {
      await messageApi.toggleReaction(msgId, emoji)
    } catch (e) {
      target.reactions = previous
      throw e
    }
  }

  /** 收藏/取消收藏 toggle（乐观更新） */
  async function toggleStar(msgId: string) {
    const target = findMessage(msgId)
    if (!target) {
      return
    }
    const previous = target.starred ?? false
    target.starred = !previous
    try {
      await messageApi.toggleStar(msgId)
    } catch (e) {
      target.starred = previous
      throw e
    }
  }

  /** 编辑自己 2 分钟内的文本消息（乐观更新） */
  async function editMessage(msgId: string, content: string) {
    const target = findMessage(msgId)
    if (!target) {
      return
    }
    const previous = target.content
    const wasEdited = target.edited ?? false
    target.content = content
    target.edited = true
    try {
      await messageApi.edit(msgId, content)
    } catch (e) {
      target.content = previous
      target.edited = wasEdited
      throw e
    }
  }

  /** 转发：把既有消息原样发到另一个会话（文本/图片） */
  async function forwardMessage(peer: string, message: ImMessage) {
    return sendOutgoing(peer, message.content, message.msgType, null)
  }

  function sendTyping(peer: string, typing: boolean) {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return
    }
    const now = Date.now()
    if (typing && now - lastTypingSentAt < 2000) {
      return
    }
    lastTypingSentAt = typing ? now : 0
    socket.send(JSON.stringify({ type: 'typing', subject: peer, msg: typing ? '1' : '0' }))
  }

  // ---------- WebSocket ----------

  function onRawMessage(raw: string) {
    let msg: ImPushMessage
    try {
      msg = JSON.parse(raw) as ImPushMessage
    } catch {
      return
    }
    switch (msg.type) {
      case 'dm': {
        const peer = msg.from === selfName.value ? msg.to : msg.from
        const list = ensureMessages(peer)
        if (!list.some((m) => m.id === msg.msgId)) {
          list.push({
            id: msg.msgId,
            fromUser: msg.from,
            toUser: msg.to,
            content: msg.content,
            msgType: (msg.msgType ?? 'text') as ImMessage['msgType'],
            status: 'SENT',
            replyToId: msg.replyToId ?? null,
            edited: msg.edited ?? false,
            created: msg.created,
          })
        }
        const friend = friends.value.find((f) => f.username === peer)
        if (friend) {
          friend.lastMessage = {
            content: msg.content,
            msgType: msg.msgType,
            created: msg.created,
            fromMe: msg.from === selfName.value,
          }
          if (msg.from !== selfName.value) {
            if (peer === activePeer.value) {
              friend.unread = 0
              messageApi.markRead(peer).catch(() => {})
            } else {
              friend.unread++
              // 提示音：非当前会话、未免打扰、且不在免打扰时段（91）
              if (!friend.muted && !isQuietNow()) {
                playMessageTone()
              }
              const preview = messagePreviewText(msg.msgType, msg.content)
              // 70 浮动卡片：非当前会话来消息时右上角滑入
              window.dispatchEvent(
                new CustomEvent('arechat:toast', {
                  detail: {
                    peer,
                    name: displayNameOf(msg.from),
                    body: preview,
                    avatar: friend.username,
                    at: msg.created,
                  },
                }),
              )
              // 45 桌面通知：页面不可见时弹出，点击聚焦并跳转会话
              showNotification({
                title: displayNameOf(msg.from),
                body: preview,
                peer,
              })
            }
          }
        }
        return
      }
      case 'typing': {
        if (msg.from === selfName.value) {
          return
        }
        if (msg.typing === false) {
          typingFrom.value = ''
          return
        }
        typingFrom.value = msg.from
        if (typingHideTimer !== null) {
          clearTimeout(typingHideTimer)
        }
        typingHideTimer = window.setTimeout(() => {
          typingFrom.value = ''
        }, 4000)
        return
      }
      case 'recall': {
        markRecalled(msg.msgId)
        return
      }
      case 'read': {
        // 已读回执：reader 读完了与我的会话 → 我发的消息全部置为已读
        if (msg.peer !== selfName.value) {
          return
        }
        const list = messages.value[msg.reader]
        if (!list) {
          return
        }
        for (const message of list) {
          if (message.fromUser === selfName.value && message.status === 'SENT') {
            message.read = true
          }
        }
        return
      }
      case 'reaction': {
        const target = findMessage(msg.msgId)
        if (!target) {
          return
        }
        const current = target.reactions ?? []
        const index = current.findIndex((r) => r.username === msg.by && r.emoji === msg.emoji)
        if (!msg.added) {
          if (index >= 0) {
            target.reactions = [...current.slice(0, index), ...current.slice(index + 1)]
          }
        } else if (index < 0) {
          target.reactions = [...current, { username: msg.by, emoji: msg.emoji }]
          // 65 对方给我点了赞/心：飘心庆祝
          window.dispatchEvent(
            new CustomEvent('arechat:reaction', { detail: { msgId: msg.msgId, emoji: msg.emoji, by: msg.by } }),
          )
        }
        return
      }
      case 'message-edit': {
        const target = findMessage(msg.msgId)
        if (target) {
          target.content = msg.content
          target.edited = true
        }
        return
      }
      case 'presence': {
        const friend = friends.value.find((f) => f.username === msg.name)
        if (friend) {
          friend.online = msg.msg === '1'
        }
        return
      }
      case 'friend-request': {
        void loadRequests()
        return
      }
      case 'friend-accepted': {
        void loadFriends()
        void loadRequests()
        return
      }
      case 'friend-deleted': {
        if (activePeer.value === msg.username) {
          activePeer.value = ''
        }
        void loadFriends()
        return
      }
      case 'pin': {
        // 84 会话置顶变化（会话双方的另一端推过来）
        const peer = msg.peerA === selfName.value ? msg.peerB : msg.peerA
        if (peer === activePeer.value) {
          pinned.value = msg.pinned && msg.msgId ? { msgId: msg.msgId, createdBy: '' } : null
        }
        return
      }
      case 'announcement': {
        // 88 全站公告：广播给页面（MainLayout 铃铛亮红点 + 右上角浮卡提醒）
        window.dispatchEvent(
          new CustomEvent('arechat:announcement', {
            detail: { id: msg.announcementId, content: msg.content },
          }),
        )
        return
      }
      case 'admin-pending': {
        // 78 管理员待办：新注册申请提醒
        adminPending.value = msg.pendingCount
        return
      }
      case 'couple': {
        // 情侣空间事件：转发为页面事件，由 couple store 统一消费（提醒 + 刷新）
        window.dispatchEvent(
          new CustomEvent('arechat:couple', {
            detail: { event: msg.event, username: msg.username, detail: msg.detail },
          }),
        )
        return
      }
      default:
        return
    }
  }

  function startHeartbeat() {
    stopHeartbeat()
    heartTimer = window.setInterval(() => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'heart', ts: Date.now() }))
      }
    }, 25_000)
  }

  function stopHeartbeat() {
    if (heartTimer !== null) {
      clearInterval(heartTimer)
      heartTimer = null
    }
  }

  /** 46 断线自动重连：指数退避 1s/2s/4s/8s/16s/30s，最多 6 次 */
  const RECONNECT_DELAYS = [1_000, 2_000, 4_000, 8_000, 16_000, 30_000]

  function clearReconnectTimer() {
    if (reconnectTimer !== null) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
  }

  function scheduleReconnect() {
    if (manualClose || !selfName.value || reconnectTimer !== null) {
      return
    }
    if (reconnectAttempts >= RECONNECT_DELAYS.length) {
      status.value = 'closed'
      return
    }
    status.value = 'connecting'
    const delay = RECONNECT_DELAYS[reconnectAttempts]
    reconnectAttempts += 1
    reconnectTimer = window.setTimeout(() => {
      reconnectTimer = null
      if (!manualClose && selfName.value) {
        connect()
      }
    }, delay)
  }

  /** readyState 常量：0=CONNECTING 1=OPEN（避免依赖全局 WebSocket 常量，便于测试） */
  const WS_CONNECTING = 0
  const WS_OPEN = 1

  function connect() {
    // 已在连接/已连接时直接返回：重复建连会把握手中的 socket 掐断，
    // 表现为浏览器「closed before the connection is established」+ 代理 ECONNABORTED
    if (socket && (socket.readyState === WS_CONNECTING || socket.readyState === WS_OPEN)) {
      return
    }
    disconnect()
    status.value = 'connecting'
    socket = new WebSocket(wsUrl(selfName.value))
    socket.onopen = () => {
      status.value = 'open'
      reconnectAttempts = 0
      startHeartbeat()
      // 重连成功后拉平数据：好友未读/在线 + 当前会话补齐缺口
      void loadFriends()
      const peer = activePeer.value
      if (peer) {
        messageApi.history(peer).then((list) => {
          messages.value[peer] = list
        }).catch(() => {})
      }
    }
    socket.onmessage = (event) => onRawMessage(String(event.data))
    socket.onclose = () => {
      stopHeartbeat()
      scheduleReconnect()
    }
    socket.onerror = () => {
      stopHeartbeat()
    }
  }

  function disconnect() {
    manualClose = true
    clearReconnectTimer()
    stopHeartbeat()
    if (typingHideTimer !== null) {
      clearTimeout(typingHideTimer)
      typingHideTimer = null
    }
    if (socket) {
      socket.onclose = null
      socket.onerror = null
      try {
        socket.close()
      } catch {
        // 忽略关闭异常
      }
      socket = null
    }
    status.value = 'idle'
    manualClose = false
  }

  function reset() {
    disconnect()
    initialized.value = false
    reconnectAttempts = 0
    friends.value = []
    incoming.value = []
    outgoing.value = []
    messages.value = {}
    activePeer.value = ''
    typingFrom.value = ''
    searchResults.value = []
    myProfile.value = null
    pinned.value = null
    adminPending.value = 0
  }

  // ---------- 78/79 管理员待办 ----------

  const adminPending = ref(0)

  /** 登录后由管理员页面/布局调用：拉取待审批数量（WS 推送做实时增量） */
  async function refreshAdminPending() {
    try {
      adminPending.value = (await adminApi.pendingCount()).applications
    } catch {
      // 非管理员访问会 403：静默
    }
  }

  return {
    friends,
    incoming,
    outgoing,
    activePeer,
    messages,
    typingFrom,
    status,
    selfName,
    myProfile,
    searchResults,
    drafts,
    activeFriend,
    activeMessages,
    totalUnread,
    displayNameOf,
    pinned,
    adminPending,
    init,
    loadFriends,
    loadRequests,
    loadProfile,
    saveProfile,
    applyFriend,
    acceptRequest,
    rejectRequest,
    updateFriend,
    removeFriend,
    markAllRead,
    openConversation,
    loadMoreHistory,
    sendText,
    sendImage,
    sendFile,
    sendPoke,
    sendCard,
    sendLocation,
    retryMessage,
    recallMessage,
    searchMessages,
    clearSearch,
    sendTyping,
    setDraft,
    clearDraft,
    toggleReaction,
    toggleStar,
    editMessage,
    forwardMessage,
    pinMessage,
    unpinConversation,
    clearConversation,
    refreshAdminPending,
    disconnect,
    reset,
  }
})

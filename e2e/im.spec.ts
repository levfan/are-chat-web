import { expect, test, type Route, type WebSocketRoute } from '@playwright/test'

// IM 好友私聊端到端：全部 mock 后端 API 与 WebSocket，单页验证交互流
const SELF = 'alice'
const PEER = 'bob'

const friend = {
  id: 'f1',
  username: PEER,
  remark: '老友',
  pinned: false,
  muted: false,
  online: true,
  lastSeenAt: Date.now() - 300_000,
  unread: 2,
  lastMessage: { content: '在吗', msgType: 'text', created: Date.now(), fromMe: false },
}

const request = { id: 'req-9', fromUser: PEER, toUser: SELF, status: 'PENDING', created: Date.now() }

const history = [
  { id: 'h1', fromUser: PEER, toUser: SELF, content: '在吗', msgType: 'text', status: 'SENT', created: Date.now() - 60_000 },
  { id: 'h2', fromUser: SELF, toUser: PEER, content: '在的', msgType: 'text', status: 'SENT', created: Date.now() - 30_000 },
]

const profile = { username: SELF, nickname: SELF, signature: '爱聊天', avatar: '🐷' }

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('arechat.currentUser', 'alice'))
})

test.describe('IM 会话', () => {
  test('会话列表展示好友/未读，打开会话加载历史', async ({ page }) => {
    await page.routeWebSocket(/\/ws\/chat/, (ws) => {
      ws.onMessage((data) => {
        const msg = JSON.parse(String(data))
        if (msg.type === 'heart') {
          ws.send(JSON.stringify({ type: 'heart-ack', ts: Date.now() }))
        }
      })
    })
    await page.route('**/api/friends', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json;charset=UTF-8', body: JSON.stringify({ code: 0, message: 'ok', data: [friend] }) }),
    )
    await page.route('**/api/friends/requests/incoming', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json;charset=UTF-8', body: JSON.stringify({ code: 0, message: 'ok', data: [] }) }),
    )
    await page.route('**/api/friends/requests/outgoing', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json;charset=UTF-8', body: JSON.stringify({ code: 0, message: 'ok', data: [] }) }),
    )
    await page.route('**/api/profile', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json;charset=UTF-8', body: JSON.stringify({ code: 0, message: 'ok', data: profile }) }),
    )
    await page.route('**/api/messages/*?*', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json;charset=UTF-8', body: JSON.stringify({ code: 0, message: 'ok', data: history }) }),
    )

    await page.goto('/chat')
    await expect(page.getByTestId('conv-item')).toContainText('老友')
    await expect(page.getByTestId('unread-badge')).toHaveText('2')

    await page.getByTestId('conv-item').click()
    await expect(page.getByTestId('chat-title')).toHaveText('老友')
    await expect(page.getByTestId('dm-area')).toContainText('在吗')
    await expect(page.getByTestId('dm-area')).toContainText('在的')
    await expect(page.getByTestId('unread-badge')).toHaveCount(0)
  })

  test('输入并发送私聊消息', async ({ page }) => {
    const posts: Array<{ url: string; body: { content: string; type: string } }> = []
    await page.routeWebSocket(/\/ws\/chat/, (ws) => {
      ws.onMessage((data) => {
        const msg = JSON.parse(String(data))
        if (msg.type === 'heart') {
          ws.send(JSON.stringify({ type: 'heart-ack', ts: Date.now() }))
        }
      })
    })
    await page.route('**/api/friends', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json;charset=UTF-8', body: JSON.stringify({ code: 0, message: 'ok', data: [friend] }) }),
    )
    await page.route('**/api/friends/requests/*', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json;charset=UTF-8', body: JSON.stringify({ code: 0, message: 'ok', data: [] }) }),
    )
    await page.route('**/api/profile', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json;charset=UTF-8', body: JSON.stringify({ code: 0, message: 'ok', data: profile }) }),
    )
    await page.route('**/api/messages/*?*', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json;charset=UTF-8', body: JSON.stringify({ code: 0, message: 'ok', data: history }) }),
    )
    await page.route('**/api/messages/*', async (route: Route) => {
      if (route.request().method() === 'POST') {
        const body = route.request().postDataJSON() as { content: string; type: string }
        posts.push({ url: route.request().url(), body })
        await route.fulfill({
          status: 200,
          contentType: 'application/json;charset=UTF-8',
          body: JSON.stringify({
            code: 0,
            message: 'ok',
            data: { id: 'saved-1', fromUser: SELF, toUser: PEER, content: body.content, msgType: body.type, status: 'SENT', created: Date.now() },
          }),
        })
        return
      }
      await route.fallback()
    })

    await page.goto('/chat')
    await page.getByTestId('conv-item').click()
    await expect(page.getByTestId('chat-title')).toHaveText('老友')

    await page.getByTestId('dm-input').fill('今晚一起吃饭吗')
    await page.getByTestId('dm-send-btn').click()

    await expect(page.getByTestId('dm-area')).toContainText('今晚一起吃饭吗')
    expect(posts).toHaveLength(1)
    expect(posts[0].body.content).toBe('今晚一起吃饭吗')
    expect(posts[0].body.type).toBe('text')
  })

  test('ws 收到 dm 推送：未读红点与预览更新', async ({ page }) => {
    let server: WebSocketRoute | null = null
    await page.routeWebSocket(/\/ws\/chat/, (ws) => {
      server = ws
      ws.onMessage((data) => {
        const msg = JSON.parse(String(data))
        if (msg.type === 'heart') {
          ws.send(JSON.stringify({ type: 'heart-ack', ts: Date.now() }))
        }
      })
    })
    await page.route('**/api/friends', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json;charset=UTF-8', body: JSON.stringify({ code: 0, message: 'ok', data: [friend] }) }),
    )
    await page.route('**/api/friends/requests/*', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json;charset=UTF-8', body: JSON.stringify({ code: 0, message: 'ok', data: [] }) }),
    )
    await page.route('**/api/profile', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json;charset=UTF-8', body: JSON.stringify({ code: 0, message: 'ok', data: profile }) }),
    )

    await page.goto('/chat')
    await expect(page.getByTestId('conv-item')).toBeVisible()
    const wsServer = server as WebSocketRoute | null
    expect(wsServer).not.toBeNull()

    wsServer!.send(
      JSON.stringify({ type: 'dm', msgId: 'push-1', from: PEER, to: SELF, content: '快回我！', msgType: 'text', created: Date.now() }),
    )

    await expect(page.getByTestId('conv-item')).toContainText('快回我！')
    await expect(page.getByTestId('unread-badge')).toHaveText('3')
  })
})

test.describe('IM 好友', () => {
  test('好友页同意申请并展示好友', async ({ page }) => {
    const acceptPosts: string[] = []
    await page.routeWebSocket(/\/ws\/chat/, (ws) => {
      ws.onMessage((data) => {
        const msg = JSON.parse(String(data))
        if (msg.type === 'heart') {
          ws.send(JSON.stringify({ type: 'heart-ack', ts: Date.now() }))
        }
      })
    })
    await page.route('**/api/friends', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json;charset=UTF-8', body: JSON.stringify({ code: 0, message: 'ok', data: [friend] }) }),
    )
    await page.route('**/api/friends/requests/incoming', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json;charset=UTF-8', body: JSON.stringify({ code: 0, message: 'ok', data: [request] }) }),
    )
    await page.route('**/api/friends/requests/outgoing', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json;charset=UTF-8', body: JSON.stringify({ code: 0, message: 'ok', data: [] }) }),
    )
    await page.route('**/api/friends/requests/*/accept', async (route) => {
      acceptPosts.push(route.request().url())
      await route.fulfill({ status: 200, contentType: 'application/json;charset=UTF-8', body: JSON.stringify({ code: 0, message: 'ok', data: null }) })
    })
    await page.route('**/api/profile', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json;charset=UTF-8', body: JSON.stringify({ code: 0, message: 'ok', data: profile }) }),
    )

    await page.goto('/friends')
    await expect(page.getByTestId('incoming-request')).toContainText(PEER)
    await expect(page.getByTestId('friend-item')).toContainText('老友')

    await page.getByTestId('accept-btn').click()
    expect(acceptPosts).toHaveLength(1)
  })

  test('发起好友申请', async ({ page }) => {
    const applyPosts: Array<{ username: string }> = []
    await page.routeWebSocket(/\/ws\/chat/, (ws) => {
      ws.onMessage((data) => {
        const msg = JSON.parse(String(data))
        if (msg.type === 'heart') {
          ws.send(JSON.stringify({ type: 'heart-ack', ts: Date.now() }))
        }
      })
    })
    await page.route('**/api/friends', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json;charset=UTF-8', body: JSON.stringify({ code: 0, message: 'ok', data: [] }) }),
    )
    await page.route('**/api/friends/requests/incoming', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json;charset=UTF-8', body: JSON.stringify({ code: 0, message: 'ok', data: [] }) }),
    )
    await page.route('**/api/friends/requests/outgoing', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json;charset=UTF-8', body: JSON.stringify({ code: 0, message: 'ok', data: [] }) }),
    )
    await page.route('**/api/friends/requests', async (route) => {
      if (route.request().method() === 'POST') {
        applyPosts.push(route.request().postDataJSON() as { username: string })
        await route.fulfill({
          status: 200,
          contentType: 'application/json;charset=UTF-8',
          body: JSON.stringify({ code: 0, message: 'ok', data: request }),
        })
        return
      }
      await route.fallback()
    })
    await page.route('**/api/profile', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json;charset=UTF-8', body: JSON.stringify({ code: 0, message: 'ok', data: profile }) }),
    )

    await page.goto('/friends')
    await page.getByTestId('add-friend-open').click()
    await page.getByTestId('add-friend-input').fill(PEER)
    await page.getByTestId('add-friend-btn').click()

    expect(applyPosts).toHaveLength(1)
    expect(applyPosts[0].username).toBe(PEER)
  })
})

test.describe('IM 新功能（第二轮 10 项）', () => {
  /** 统一 mock 基础数据：好友/申请/资料/历史；返回 POST 捕获数组 */
  async function mockBase(page: import('@playwright/test').Page) {
    await page.routeWebSocket(/\/ws\/chat/, (ws) => {
      ws.onMessage((data) => {
        const msg = JSON.parse(String(data))
        if (msg.type === 'heart') {
          ws.send(JSON.stringify({ type: 'heart-ack', ts: Date.now() }))
        }
      })
    })
    await page.route('**/api/friends', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json;charset=UTF-8', body: JSON.stringify({ code: 0, message: 'ok', data: [friend] }) }),
    )
    await page.route('**/api/friends/requests/*', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json;charset=UTF-8', body: JSON.stringify({ code: 0, message: 'ok', data: [] }) }),
    )
    await page.route('**/api/profile', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json;charset=UTF-8', body: JSON.stringify({ code: 0, message: 'ok', data: profile }) }),
    )
    await page.route('**/api/messages/*?*', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json;charset=UTF-8', body: JSON.stringify({ code: 0, message: 'ok', data: history }) }),
    )
  }

  const pngBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64',
  )

  test('发送图片消息并渲染缩略图', async ({ page }) => {
    await mockBase(page)
    let uploads = 0
    const sendPosts: Array<{ content: string; type: string }> = []
    await page.route('**/api/files', async (route) => {
      uploads++
      await route.fulfill({
        status: 200,
        contentType: 'application/json;charset=UTF-8',
        body: JSON.stringify({
          code: 0,
          message: 'ok',
          data: {
            id: 'file-9',
            originalName: 'cat.png',
            contentType: 'image/png',
            size: pngBuffer.length,
            sha256: 'aa',
            deduplicated: false,
            downloadUrl: '/api/files/file-9/download',
            uploadedAt: Date.now(),
          },
        }),
      })
    })
    await page.route('**/api/messages/*', async (route) => {
      if (route.request().method() === 'POST') {
        const body = route.request().postDataJSON() as { content: string; type: string }
        sendPosts.push(body)
        await route.fulfill({
          status: 200,
          contentType: 'application/json;charset=UTF-8',
          body: JSON.stringify({
            code: 0,
            message: 'ok',
            data: { id: 'saved-img', fromUser: SELF, toUser: PEER, content: body.content, msgType: body.type, status: 'SENT', replyToId: null, created: Date.now() },
          }),
        })
        return
      }
      await route.fallback()
    })

    await page.goto('/chat')
    await page.getByTestId('conv-item').click()
    await expect(page.getByTestId('chat-title')).toHaveText('老友')
    await page.setInputFiles('[data-testid="image-input"]', { name: 'cat.png', mimeType: 'image/png', buffer: pngBuffer })

    // 等异步链完成：上传 → 发消息 → 气泡渲染
    await expect(page.getByTestId('dm-image')).toHaveCount(1)
    expect(uploads).toBe(1)
    expect(sendPosts).toHaveLength(1)
    expect(sendPosts[0].type).toBe('image')
    expect(sendPosts[0].content).toBe('/api/files/file-9/download')
  })

  test('会话内搜索聊天记录', async ({ page }) => {
    await mockBase(page)
    await page.route('**/api/messages/*/search*', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json;charset=UTF-8',
        body: JSON.stringify({ code: 0, message: 'ok', data: [history[0]] }),
      }),
    )

    await page.goto('/chat')
    await page.getByTestId('conv-item').click()
    await page.getByTestId('search-open-btn').click()
    await page.getByTestId('search-input').fill('在吗')
    await page.getByTestId('search-run-btn').click()

    await expect(page.getByTestId('search-hit')).toHaveCount(1)
    await expect(page.getByTestId('search-hit')).toContainText('在吗')
  })

  test('引用回复：请求携带 replyToId 并渲染引用块', async ({ page }) => {
    await mockBase(page)
    const sendPosts: Array<{ content: string; type: string; replyToId: string | null }> = []
    await page.route('**/api/messages/*', async (route) => {
      if (route.request().method() === 'POST') {
        const body = route.request().postDataJSON() as { content: string; type: string; replyToId: string | null }
        sendPosts.push(body)
        await route.fulfill({
          status: 200,
          contentType: 'application/json;charset=UTF-8',
          body: JSON.stringify({
            code: 0,
            message: 'ok',
            data: { id: 'saved-reply', fromUser: SELF, toUser: PEER, content: body.content, msgType: 'text', status: 'SENT', replyToId: body.replyToId, created: Date.now() },
          }),
        })
        return
      }
      await route.fallback()
    })

    await page.goto('/chat')
    await page.getByTestId('conv-item').click()
    await expect(page.getByTestId('chat-title')).toHaveText('老友')
    await expect(page.getByTestId('dm-bubble')).toHaveCount(2)

    // 引用对方第一条消息（h1）；按钮在行的 hover 操作区，不在气泡内部
    const firstRow = page.getByTestId('dm-row').first()
    await firstRow.getByTestId('reply-btn').dispatchEvent('click')
    await expect(page.getByTestId('reply-bar')).toBeVisible()

    await page.getByTestId('dm-input').fill('收到！')
    await page.getByTestId('dm-send-btn').click()

    await expect(page.getByTestId('dm-area')).toContainText('收到！')
    expect(sendPosts).toHaveLength(1)
    expect(sendPosts[0].replyToId).toBe('h1')
    await expect(page.getByTestId('quote-block').last()).toBeVisible()
  })
})

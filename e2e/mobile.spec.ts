import { expect, test, devices } from '@playwright/test'

// 手机浏览器适配回归：≤768px 单面板布局，气泡不再被会话列表挤成「一行一个字」
// iPhone 13 描述符默认 webkit，本机仅装了 Chromium：保留其移动仿真参数但用 Chromium 内核跑
test.use({ ...devices['iPhone 13'], browserName: 'chromium' })

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
  unread: 0,
  lastMessage: { content: '在吗', msgType: 'text', created: Date.now(), fromMe: false },
}

const profile = { username: SELF, nickname: SELF, signature: '爱聊天', avatar: '🐷' }

const LONG_TEXT =
  '这是一条足够长的消息：手机浏览器上聊天窗口必须占满整行，气泡里的中文才能横排展示，而不是被挤压成一行一个字的竖排效果。'

const history = [
  { id: 'h1', fromUser: PEER, toUser: SELF, content: LONG_TEXT, msgType: 'text', status: 'SENT', created: Date.now() - 60_000 },
  { id: 'h2', fromUser: PEER, toUser: SELF, content: '短消息', msgType: 'text', status: 'SENT', created: Date.now() - 30_000 },
]

async function mockIm(page: import('@playwright/test').Page) {
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
  await page.addInitScript(() => sessionStorage.setItem('arechat.currentUser', 'alice'))
}

test.describe('手机端适配（iPhone 视口）', () => {
  test('登录卡片在窄视口内完整展示', async ({ page }) => {
    await page.goto('/login')
    const card = page.locator('.login-card')
    const box = await card.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.x).toBeGreaterThanOrEqual(0)
    expect(box!.x + box!.width).toBeLessThanOrEqual(390)
    // 页面无横向滚动
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow).toBeLessThanOrEqual(1)
  })

  test('单面板布局：选会话进聊天窗，返回键回列表，气泡保持横排宽度', async ({ page }) => {
    await mockIm(page)
    await page.goto('/chat')

    // 未选会话：只显示会话列表，聊天窗（空态）不可见
    await expect(page.getByTestId('conv-item')).toContainText('老友')
    await expect(page.getByText('选择一位好友开始聊天')).toBeHidden()

    await page.getByTestId('conv-item').click()
    await expect(page.getByTestId('chat-title')).toHaveText('老友')
    // 聊天窗打开后，会话列表隐藏
    await expect(page.getByTestId('conv-item')).toBeHidden()

    // 核心回归：长文本气泡在手机视口下保有正常宽度（竖排字时宽度会 <40px）
    const bubble = page.locator('[data-testid="dm-bubble"]').first()
    await expect(bubble).toContainText('足够长的消息')
    const box = await bubble.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.width).toBeGreaterThan(150)

    // 无横向滚动
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow).toBeLessThanOrEqual(1)

    // 触屏没有 hover：点击气泡展开操作按钮（回应/引用…）
    const reactBtn = page.getByTestId('react-btn').first()
    await expect(reactBtn).toBeHidden()
    await bubble.click()
    await expect(reactBtn).toBeVisible()

    // 返回键回到会话列表
    await page.getByTestId('chat-back-btn').click()
    await expect(page.getByTestId('conv-item')).toBeVisible()
    await expect(page.getByTestId('chat-title')).toBeHidden()
  })
})

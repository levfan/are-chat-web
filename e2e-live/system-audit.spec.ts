import { expect, test, type Page } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

/**
 * 系统级巡检（非情侣空间页）：/chat /contacts /admin 逐按钮点，外加一条私信主流程。
 * 判定同情侣页：HTTP 5xx/404 或页面异常=error；点下去无请求无变化无弹窗无提示=dead。
 */
const OUT = process.env.AUDIT_OUT ?? path.resolve(process.cwd(), '.audit-live')
const DANGER = /解散|注销|删除账号|退出登录|清空全部|封禁|禁用|删除|重置密码|恢复出厂|移除|踢/
const MAX_CLICKS = Number(process.env.MAX_CLICKS || 40)

type Hit = { page: string; control: string; kind: 'error' | 'dead' | 'http'; detail: string; requests: string[] }
const hits: Hit[] = []
let current: { requests: string[]; consoleErrors: string[]; pageErrors: string[] } | null = null
let activePage = ''

function record(h: Hit) {
  hits.push(h)
  fs.appendFileSync(`${OUT}/system-audit.jsonl`, JSON.stringify(h) + '\n')
}

function attach(page: Page) {
  page.on('response', async (res) => {
    if (!current || !res.url().includes('/api/')) return
    const status = res.status()
    let body = ''
    if (status >= 400) body = (await res.text().catch(() => '')).slice(0, 160)
    current.requests.push(`${status} ${res.url().replace(/^https?:\/\/[^/]+/, '')}${body ? ' :: ' + body : ''}`)
  })
  page.on('console', (m) => {
    if (m.type() === 'error' && current) current.consoleErrors.push(m.text().slice(0, 240))
  })
  page.on('pageerror', (e) => {
    if (current) current.pageErrors.push(String(e).slice(0, 240))
  })
}

async function login(page: Page, account: string, password: string) {
  // 直接用页内请求换会话：page.request 与浏览器上下文共享 Cookie，比走 UI 稳
  await page.context().clearCookies()
  const res = await page.request.post('/api/auth/login', { data: { account, password } })
  const body = await res.json().catch(() => null)
  fs.appendFileSync(`${OUT}/system-audit.progress`, `${account} API 登录 code=${body?.code} ${body?.message || ''}\n`)
  await page.addInitScript((acc) => sessionStorage.setItem('arechat.currentUser', acc), account)
  await page.goto('/')
  await page.waitForTimeout(900)
  fs.appendFileSync(`${OUT}/system-audit.progress`, `${account} 落地 URL=${page.url()}\n`)
}

async function sweepMain(page: Page) {
  const buttons = page.locator('main button:not([disabled]):visible, .el-main button:not([disabled]):visible')
  const count = await buttons.count()
  fs.appendFileSync(`${OUT}/system-audit.progress`, `${activePage} 可见按钮 ${count}\n`)
  for (let i = 0; i < Math.min(count, MAX_CLICKS); i++) {
    const btn = buttons.nth(i)
    if (!(await btn.isVisible().catch(() => false))) continue
    const testidAttr = (await btn.getAttribute('data-testid').catch(() => null)) || ''
    const label = ((await btn.innerText().catch(() => '')).trim() || testidAttr || `#${i}`).trim()
    if (DANGER.test(label)) continue
    const before = await page.evaluate(() => document.querySelector('main')?.innerHTML || '').catch(() => '')
    const dialogsBefore = await page.locator('.el-dialog:visible, .el-message-box:visible').count()
    current = { requests: [], consoleErrors: [], pageErrors: [] }
    let clickError = ''
    await btn.click({ timeout: 2_000 }).catch((e) => {
      clickError = String(e.message).split('\n')[0]
    })
    await page.waitForTimeout(260)
    const after = await page.evaluate(() => document.querySelector('main')?.innerHTML || '').catch(() => '')
    const dialogsAfter = await page.locator('.el-dialog:visible, .el-message-box:visible').count()
    const toastCount = await page.locator('.el-message:visible, .el-notification:visible').count()
    const toasts = toastCount ? await page.locator('.el-message:visible, .el-notification:visible').allInnerTexts() : []
    const snap = current
    current = null

    const badHttp = snap.requests.filter((r) => /^(5\d\d|404)/.test(r))
    const softHttp = snap.requests.filter((r) => /^4\d\d/.test(r))
    const changed = after !== before || dialogsAfter !== dialogsBefore || toastCount > 0
    const base = { page: activePage, control: label, requests: snap.requests }
    if (snap.pageErrors.length || snap.consoleErrors.length || badHttp.length) {
      record({ ...base, kind: 'error', detail: [clickError, ...badHttp, ...snap.pageErrors, ...snap.consoleErrors].filter(Boolean).join(' | ') })
    } else if (clickError) {
      record({ ...base, kind: 'dead', detail: `点不动：${clickError}` })
    } else if (!changed && !snap.requests.length) {
      record({ ...base, kind: 'dead', detail: '无请求、无 DOM 变化、无弹窗、无提示' })
    } else if (softHttp.length) {
      record({ ...base, kind: 'http', detail: softHttp.join(' | ') + (toasts.length ? ` → 提示「${toasts.join(' / ').slice(0, 60)}」` : ' → 界面无提示') })
    }
    if (dialogsAfter > dialogsBefore) {
      await page.locator('.el-message-box__btns button').first().click({ timeout: 400 }).catch(() => {})
      await page.keyboard.press('Escape').catch(() => {})
      await page.locator('.el-dialog__headerbtn').last().click({ timeout: 400 }).catch(() => {})
    }
  }
}

test.describe('系统级巡检', () => {
  test.beforeEach(({ page }) => attach(page))

  test.afterAll(() => {
    const byKind = { error: [] as Hit[], dead: [] as Hit[], http: [] as Hit[] }
    for (const h of hits) byKind[h.kind].push(h)
    const lines = [`# 系统级巡检（/chat /contacts /admin）`, ``, `异常 ${byKind.error.length}，点了没反应 ${byKind.dead.length}，4xx ${byKind.http.length}`, ``]
    for (const k of ['error', 'dead', 'http'] as const) {
      lines.push(`## ${k}`)
      if (!byKind[k].length) lines.push('（无）')
      for (const h of byKind[k]) lines.push(`- **[${h.page}]「${h.control}」** ${h.detail.slice(0, 220)}`)
      lines.push('')
    }
    fs.writeFileSync(`${OUT}/system-audit.md`, lines.join('\n'))
    console.log(`系统级巡检：error=${byKind.error.length} dead=${byKind.dead.length} http=${byKind.http.length}`)
  })

  test('聊天页按钮全点 + 发一条私信', async ({ page }) => {
    activePage = 'chat'
    await login(page, process.env.AUDIT_ACCOUNT ?? 'alice', process.env.AUDIT_PASSWORD ?? '')
    await page.goto('/chat')
    await page.waitForTimeout(1_500)
    // 打开与 bob 的会话并发一条，验证 WS 与落库主流程
    const conv = page.getByTestId('conv-item')
    if (await conv.count()) {
      await conv.first().click().catch(() => {})
      await page.waitForTimeout(600)
    }
    const box = page.getByTestId('dm-input')
    if (await box.count()) {
      await box.fill('巡检：今天过得怎么样')
      await page.getByTestId('dm-send-btn').click().catch(() => {})
      await page.waitForTimeout(800)
      const bubbles = await page.getByTestId('dm-area').count()
      record(bubbles > 0 ? { page: activePage, control: '发送私信', kind: 'http', detail: `已发出，气泡区命中 ${bubbles}`, requests: [] } : { page: activePage, control: '发送私信', kind: 'dead', detail: '发送后消息没出现在气泡区', requests: [] })
    }
    await page.evaluate(() => window.scrollTo(0, 0))
    await sweepMain(page)
  })

  test('通讯录页按钮全点', async ({ page }) => {
    activePage = 'contacts'
    await login(page, process.env.AUDIT_ACCOUNT ?? 'alice', process.env.AUDIT_PASSWORD ?? '')
    await page.goto('/contacts')
    await page.waitForTimeout(1_200)
    await sweepMain(page)
  })

  test('后台页按钮全点（admin 账号）', async ({ page }) => {
    activePage = 'admin'
    await login(page, process.env.AUDIT_ADMIN ?? 'admin', process.env.AUDIT_ADMIN_PASSWORD ?? '')
    await page.goto('/admin')
    await page.waitForTimeout(1_500)
    if (!(await page.locator('main button').count())) {
      record({ page: activePage, control: '(整页)', kind: 'dead', detail: 'admin 登录后 /admin 无可交互元素', requests: [] })
      return
    }
    await sweepMain(page)
  })
})

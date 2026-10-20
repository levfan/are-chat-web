import { expect, test, type Locator, type Page } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

/**
 * 实时全链路巡检（情侣空间）：真实后端（不 mock），逐张卡把按钮点一遍，采集
 *  - error：HTTP 5xx/404、页面 JS 异常、控制台报错
 *  - dead ：点下去既没请求、DOM 没变、没弹窗、没提示（"点了没反应"）
 *  - http ：4xx（多为正常校验，留档看文案是否可见）
 * 每点一次立刻追加 live-audit.jsonl + 进度行，超时也不丢进度。
 *
 * 2026-10-20 三轮裁剪后情侣空间只剩一页（头部 + 一张亲密日历）：原来那份「卡注册表 + 11 个页签
 * + 子页签」的索引随 registry 一起删了，卡清单改成下面三张根，页面上不存在的那条自动跳过。
 */
const OUT = process.env.AUDIT_OUT ?? path.resolve(process.cwd(), '.audit-live')
const DANGER = /解散|注销|删除账号|退出登录|清空全部|恢复出厂|删除空间|分手|解除|拆掉|不要了/
const DANGER_TESTID = /dissolve|logout|deactivate|delete-account|destroy/
/** 破坏性接口在路由层挡掉，点到也不落库 */
const BLOCKED = ['**/api/couple/dissolve', '**/api/auth/logout', '**/api/auth/deactivate', '**/api/admin/users/**/status']
const MAX_CLICKS_PER_CARD = Number(process.env.MAX_CLICKS || 8)
/** FILL=1 时先把卡内输入框填上样本值，再点按钮——用来真走写入链路而不只是撞空态守卫 */
const FILL = process.env.FILL === '1'

/** 现役三张卡根：未建空间时的引导、建好后的头部、亲密日历 */
const CARD_ROOTS = ['couple-setup', 'couple-space', 'couple-calendar']
/** 只想验某一张时用：ONLY_KEY_RE=couple-calendar */
const KEY_RE = process.env.ONLY_KEY_RE ? new RegExp(process.env.ONLY_KEY_RE) : null

type Hit = {
  card: string
  control: string
  kind: 'error' | 'dead' | 'http'
  detail: string
  requests: string[]
}
const hits: Hit[] = []
const probed = new Set<string>()
let current: { requests: string[]; consoleErrors: string[]; pageErrors: string[] } | null = null

function record(hit: Hit) {
  hits.push(hit)
  fs.appendFileSync(`${OUT}/live-audit.jsonl`, JSON.stringify(hit) + '\n')
}

function progress(line: string) {
  fs.appendFileSync(`${OUT}/live-audit.progress`, line + '\n')
}

function sampleFor(placeholder: string) {
  if (/分钟|时长|天数|次数|几|小时/.test(placeholder)) return '10'
  if (/金额|价格|分数|分值|元/.test(placeholder)) return '20'
  if (/名字|称呼|昵称|标题|题目/.test(placeholder)) return '巡检样本'
  if (/年|yyyy/i.test(placeholder)) return '2026'
  if (/月/.test(placeholder)) return '6'
  return '巡检样本：今天也想你'
}

async function fillCardInputs(page: Page, card: Locator) {
  const inputs = card.locator('input:visible, textarea:visible')
  const n = Math.min(await inputs.count(), 8)
  for (let i = 0; i < n; i++) {
    const el = inputs.nth(i)
    const cls = (await el.getAttribute('class').catch(() => '')) || ''
    const type = (await el.getAttribute('type').catch(() => '')) || 'text'
    if (cls.includes('el-date') || type === 'date' || type === 'time' || el.getAttribute('readonly')) continue
    if ((await el.inputValue().catch(() => '')) !== '') continue
    await el.fill(sampleFor((await el.getAttribute('placeholder').catch(() => '')) || '')).catch(() => {})
  }
  await page.waitForTimeout(120)
}

function attachCollectors(page: Page) {
  page.on('response', async (res) => {
    if (!current || !res.url().includes('/api/')) return
    const status = res.status()
    let body = ''
    if (status >= 400) body = (await res.text().catch(() => '')).slice(0, 160)
    current.requests.push(`${status} ${res.url().replace(/^https?:\/\/[^/]+/, '')}${body ? ' :: ' + body : ''}`)
  })
  page.on('console', (msg) => {
    if (msg.type() === 'error' && current) current.consoleErrors.push(msg.text().slice(0, 240))
  })
  page.on('pageerror', (err) => {
    if (current) current.pageErrors.push(String(err).slice(0, 240))
  })
}

async function probeCard(page: Page, card: Locator, testid: string) {
  // 空态卡默认折叠（F205），折叠就点不开里面的按钮——先展开再探
  const cls = (await card.getAttribute('class').catch(() => '')) || ''
  if (cls.includes('is-collapsed')) {
    await card.locator(`[data-testid="couple-collapse-${testid}"]`).first().click({ timeout: 1_000 }).catch(() => {})
    await page.waitForTimeout(150)
  }
  const selector = 'button:not([disabled]):visible'
  const total = Math.min(await card.locator(selector).count(), MAX_CLICKS_PER_CARD)
  const disabled = await card.locator('button[disabled]:visible').count()
  progress(`${testid} buttons=${total} disabled=${disabled}`)
  for (let i = 0; i < total; i++) {
    const btn = card.locator(selector).nth(i)
    if (!(await btn.isVisible().catch(() => false))) continue
    const testidAttr = (await btn.getAttribute('data-testid').catch(() => null)) || ''
    const label = ((await btn.innerText().catch(() => '')).trim() || testidAttr || `#${i}`).trim()
    if (DANGER.test(label) || DANGER_TESTID.test(testidAttr)) continue

    const before = await card.evaluate((el) => el.innerHTML).catch(() => '')
    if (FILL) await fillCardInputs(page, card)
    const dialogsBefore = await page.locator('.el-dialog:visible, .el-message-box:visible').count()
    current = { requests: [], consoleErrors: [], pageErrors: [] }
    let clickError = ''
    await btn.click({ timeout: 2_000 }).catch((e) => {
      clickError = String(e.message).split('\n')[0]
    })
    await page.waitForTimeout(240)
    const after = await card.evaluate((el) => el.innerHTML).catch(() => '')
    const dialogsAfter = await page.locator('.el-dialog:visible, .el-message-box:visible').count()
    const toastCount = await page.locator('.el-message:visible, .el-notification:visible').count()
    const toasts = toastCount ? await page.locator('.el-message:visible, .el-notification:visible').allInnerTexts() : []
    const snap = current
    current = null

    const badHttp = snap.requests.filter((r) => /^(5\d\d|404)/.test(r))
    const softHttp = snap.requests.filter((r) => /^4\d\d/.test(r))
    const changed = after !== before || dialogsAfter !== dialogsBefore || toastCount > 0
    const base = { card: testid, control: label, requests: snap.requests }

    if (snap.pageErrors.length || snap.consoleErrors.length || badHttp.length) {
      record({
        ...base,
        kind: 'error',
        detail: [clickError, ...badHttp, ...snap.pageErrors, ...snap.consoleErrors].filter(Boolean).join(' | '),
      })
    } else if (clickError) {
      record({ ...base, kind: 'dead', detail: `点不动：${clickError}` })
    } else if (!changed && snap.requests.length === 0) {
      record({ ...base, kind: 'dead', detail: '无请求、无 DOM 变化、无弹窗、无提示' })
    } else if (softHttp.length) {
      record({
        ...base,
        kind: 'http',
        detail: softHttp.join(' | ') + (toasts.length ? ` → 提示「${toasts.join(' / ').slice(0, 60)}」` : ' → 界面无提示'),
      })
    }

    if (dialogsAfter > dialogsBefore) {
      // 确认框一律点「取消」：EP 按钮序是 取消→确定，点最后一个等于替人按了确定
      await page.locator('.el-message-box__btns button').first().click({ timeout: 400 }).catch(() => {})
      await page.keyboard.press('Escape').catch(() => {})
      await page.locator('.el-dialog__headerbtn').last().click({ timeout: 400 }).catch(() => {})
    }
  }
}

test.describe('实时巡检', () => {
  test.beforeEach(async ({ page }) => {
    attachCollectors(page)
    await page.addInitScript(() => sessionStorage.setItem('arechat.currentUser', 'alice'))
    for (const pattern of BLOCKED) {
      await page.route(pattern, (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json;charset=UTF-8',
          body: JSON.stringify({ code: 0, message: '巡检护栏：破坏性接口已拦截', data: null }),
        }),
      )
    }
  })

  test('情侣空间一页逐卡探测', async ({ page }) => {
    // 首屏加载期的接口错误不发生在点击窗口内，单开一个收集器兜住（否则整页空壳也查不出来）
    current = { requests: [], consoleErrors: [], pageErrors: [] }
    await page.goto('/couple')
    await expect(page.locator('[data-testid="couple-space"], [data-testid="couple-setup"]').first())
      .toBeVisible({ timeout: 20_000 })
    await page.waitForTimeout(1_000)
    const snap = current
    current = null
    const bad = snap.requests.filter((r) => /^[45]\d\d/.test(r))
    if (bad.length || snap.pageErrors.length || snap.consoleErrors.length) {
      record({
        card: '(整页加载)',
        control: '(首屏请求)',
        kind: 'error',
        detail: [...bad, ...snap.pageErrors, ...snap.consoleErrors].filter(Boolean).join(' | ').slice(0, 400),
        requests: snap.requests,
      })
    }

    for (const id of CARD_ROOTS) {
      if (KEY_RE && !KEY_RE.test(id)) continue
      const card = page.locator(`[data-testid="${id}"]`).first()
      if (!(await card.isVisible().catch(() => false))) {
        progress(`${id} 页面上不存在，跳过`)
        continue
      }
      probed.add(id)
      await probeCard(page, card, id)
    }
  })

  test.afterAll(() => {
    const byKind = { error: [] as Hit[], dead: [] as Hit[], http: [] as Hit[] }
    for (const h of hits) byKind[h.kind].push(h)
    const lines = [
      '# 实时巡检报告（真实后端 + 真账号，情侣空间一页）',
      ``,
      `实际点开探测 ${probed.size} 张；异常 ${byKind.error.length}，点了没反应 ${byKind.dead.length}，4xx ${byKind.http.length}`,
      ``,
    ]
    for (const kind of ['error', 'dead', 'http'] as const) {
      lines.push(`## ${kind === 'error' ? '异常（必须修）' : kind === 'dead' ? '点了没反应' : '4xx（看文案是否可见）'}`)
      if (!byKind[kind].length) lines.push('（无）')
      for (const h of byKind[kind]) lines.push(`- **[${h.card}] 「${h.control}」**  ${h.detail}`)
      lines.push('')
    }
    fs.writeFileSync(`${OUT}/live-audit.md`, lines.join('\n'))
    console.log(`巡检汇总：卡片 ${probed.size}，error=${byKind.error.length} dead=${byKind.dead.length} http=${byKind.http.length}`)
  })
})

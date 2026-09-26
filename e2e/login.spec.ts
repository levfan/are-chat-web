import { expect, test } from '@playwright/test'

test('未登录访问受保护页面跳转到登录页', async ({ page }) => {
  await page.goto('/contacts')
  await expect(page).toHaveURL(/\/login/)
})

test('密码错误时展示服务端提示', async ({ page }) => {
  await page.route('**/api/auth/login', (route) =>
    route.fulfill({
      status: 401,
      contentType: 'application/json;charset=UTF-8',
      body: JSON.stringify({ code: 401, message: '账号或密码不正确', data: null }),
    }),
  )
  await page.goto('/login')
  await page.getByTestId('login-input').fill('路人甲')
  await page.getByTestId('login-password').fill('wrong1234')
  await page.getByTestId('login-btn').click()
  await expect(page.getByTestId('login-error')).toContainText('账号或密码不正确')
})

test('登录成功进入消息页（77 注册改审批制后登录仍是唯一入口）', async ({ page }) => {
  await page.route('**/api/auth/login', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json;charset=UTF-8',
      body: JSON.stringify({
        code: 0,
        message: 'ok',
        data: { username: 'alice', nickname: 'alice', phone: '138****0001', role: 'USER', greeting: 'success:欢迎进入 are-chat！' },
      }),
    }),
  )
  await page.goto('/login')
  await page.getByTestId('login-input').fill('alice')
  await page.getByTestId('login-password').fill('arechat123')
  await page.getByTestId('login-btn').click()
  await expect(page).toHaveURL(/\/chat/)
  await expect(page.getByTestId('current-user')).toHaveText('alice')
})

test('77 注册提交后进入等待审批面板并可查询进度', async ({ page }) => {
  await page.route('**/api/auth/sms-code', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json;charset=UTF-8',
      body: JSON.stringify({
        code: 0,
        message: 'ok',
        data: { phone: '13911112222', expiresInSeconds: 300, devCode: '123456', hint: '演示环境直接回显' },
      }),
    }),
  )
  await page.route('**/api/auth/register', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json;charset=UTF-8',
      body: JSON.stringify({
        code: 0,
        message: 'ok',
        data: { applicationId: 'app-1', username: 'lisi', status: 'PENDING', hint: '注册申请已提交' },
      }),
    }),
  )
  await page.route('**/api/auth/register-status?account=lisi', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json;charset=UTF-8',
      body: JSON.stringify({
        code: 0,
        message: 'ok',
        data: { status: 'PENDING', rejectReason: null },
      }),
    }),
  )
  await page.goto('/login')
  await page.getByText('注册', { exact: true }).click()
  await page.getByTestId('register-phone').fill('13911112222')
  await page.getByTestId('register-username').fill('lisi')
  await page.getByTestId('register-password').fill('lisi12345')
  await page.getByTestId('send-code-btn').click()
  await expect(page.getByTestId('dev-code')).toContainText('123456')
  await page.getByTestId('register-btn').click()
  // 不再自动登录：停留在「等待审批」面板
  await expect(page.getByTestId('register-pending')).toContainText('申请已提交')
  await page.getByTestId('check-status-btn').click()
  await expect(page.getByTestId('register-status')).toContainText('管理员还没处理')
  // 登录页不含演示账号入口
  await expect(page.getByTestId('server-status')).toBeVisible()
})

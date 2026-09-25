import { expect, test } from '@playwright/test'

test('未登录访问受保护页面跳转到登录页', async ({ page }) => {
  await page.goto('/friends')
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

test('演示账号 alice 可以顺利进入', async ({ page }) => {
  await page.route('**/api/auth/login', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json;charset=UTF-8',
      body: JSON.stringify({
        code: 0,
        message: 'ok',
        data: { username: 'alice', nickname: 'alice', phone: '138****0001', greeting: 'success:欢迎进入 are-chat！' },
      }),
    }),
  )
  await page.goto('/login')
  await page.getByTestId('demo-alice').click()
  await page.getByTestId('login-btn').click()
  await expect(page).toHaveURL(/\/chat/)
  await expect(page.getByTestId('current-user')).toHaveText('alice')
})

test('手机号注册后可自动登录', async ({ page }) => {
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
        data: { username: 'lisi', nickname: 'lisi', phone: '139****2222', greeting: 'success:欢迎进入 are-chat！' },
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
  await expect(page).toHaveURL(/\/chat/)
  await expect(page.getByTestId('current-user')).toHaveText('lisi')
})

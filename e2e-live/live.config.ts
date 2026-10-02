import { defineConfig, devices } from '@playwright/test'
import path from 'node:path'
import fs from 'node:fs'

// 巡检产物目录（可用 AUDIT_OUT 覆盖）：globalSetup 登录态、json 报告、逐卡命中账本都落在这里
const OUT = process.env.AUDIT_OUT ?? path.resolve(process.cwd(), '.audit-live')
fs.mkdirSync(OUT, { recursive: true})

// 实时全链路巡检：连真实后端（8080 + H2），逐卡片逐按钮点击并采集异常
export default defineConfig({
  testDir: '.',
  timeout: 300_000,
  expect: { timeout: 4_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['json', { outputFile: path.join(OUT, 'pw-results.json') }]],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'off',
    screenshot: 'off',
    storageState: path.join(OUT, 'auth-alice.json'),
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  globalSetup: './global-login.ts',
})

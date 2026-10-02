import { request } from '@playwright/test'
import path from 'node:path'
import fs from 'node:fs'

const OUT = process.env.AUDIT_OUT ?? path.resolve(process.cwd(), '.audit-live')

// 用真实后端登录 alice，把会话 Cookie 存成 storageState 供巡检复用
export default async function globalLogin() {
  const ctx = await request.newContext({ baseURL: 'http://localhost:5173' })
  // 口令不入库：用 AUDIT_PASSWORD 传（本地巡检账号是建在本机 H2 文件库里的 fixture）
  const account = process.env.AUDIT_ACCOUNT ?? 'alice'
  const res = await ctx.post('/api/auth/login', {
    data: { account, password: process.env.AUDIT_PASSWORD ?? '' },
  })
  const body = await res.json().catch(() => null)
  if (body?.code !== 0) {
    throw new Error(`实时巡检登录失败（账号 ${account}）：HTTP ${res.status()} ${JSON.stringify(body)}；`
      + '先设 AUDIT_PASSWORD=<本地巡检账号口令>，且后端要用 H2 起（见 e2e-live/README.md）')
  }
  fs.mkdirSync(OUT, { recursive: true })
  await ctx.storageState({ path: path.join(OUT, 'auth-alice.json') })
}

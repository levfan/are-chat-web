import { http } from './http'
import type { LoginResult, SmsResult } from '@/types'

export interface RegisterPayload {
  phone: string
  username: string
  password: string
  code: string
}

export const authApi = {
  /** 登录：account 为手机号或用户名 */
  login: (account: string, password: string) =>
    http.postJson<LoginResult>('/api/auth/login', { account, password }),
  /** 获取注册验证码（演示环境会回显验证码） */
  smsCode: (phone: string) => http.postJson<SmsResult>('/api/auth/sms-code', { phone }),
  /** 手机号注册（成功即登录） */
  register: (payload: RegisterPayload) => http.postJson<LoginResult>('/api/auth/register', payload),
  logout: () => http.postJson<void>('/api/auth/logout', {}),
  me: () => http.get<LoginResult>('/api/auth/me'),
}

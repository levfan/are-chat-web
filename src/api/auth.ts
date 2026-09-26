import { http } from './http'
import type {
  AdminAnnouncementVO,
  AdminApplicationVO,
  AdminAuditVO,
  AdminUserVO,
  ApplicationStatusVO,
  LoginResult,
  RegisterResult,
  SmsResult,
} from '@/types'

export interface RegisterPayload {
  phone: string
  username: string
  /** 注册昵称（选填，不填审批通过后与用户名一致） */
  nickname?: string
  password: string
  code: string
}

export const authApi = {
  /** 登录：account 为手机号或用户名 */
  login: (account: string, password: string) =>
    http.postJson<LoginResult>('/api/auth/login', { account, password }),
  /** 获取注册验证码（演示环境会回显验证码） */
  smsCode: (phone: string) => http.postJson<SmsResult>('/api/auth/sms-code', { phone }),
  /** 77 注册：提交审批申请（不再直接登录，等待管理员审批） */
  register: (payload: RegisterPayload) => http.postJson<RegisterResult>('/api/auth/register', payload),
  /** 77 查询审批进度 */
  registerStatus: (account: string) =>
    http.get<ApplicationStatusVO>(`/api/auth/register-status?account=${encodeURIComponent(account)}`),
  logout: () => http.postJson<void>('/api/auth/logout', {}),
  me: () => http.get<LoginResult>('/api/auth/me'),
  /** 80 修改密码 */
  changePassword: (oldPassword: string, newPassword: string) =>
    http.putJson<void>('/api/auth/password', { oldPassword, newPassword }),
  /** 84 账号自助注销 */
  deactivate: (password: string) => http.postJson<void>('/api/auth/deactivate', { password }),
}

/** 79 管理后台接口（后端强制 ADMIN 角色） */
export const adminApi = {
  applications: (status?: string) =>
    http.get<AdminApplicationVO[]>(
      `/api/admin/applications${status ? `?status=${encodeURIComponent(status)}` : ''}`,
    ),
  approve: (id: string) => http.postJson<{ username: string; status: string }>(`/api/admin/applications/${id}/approve`, {}),
  reject: (id: string, reason: string) =>
    http.postJson<{ status: string }>(`/api/admin/applications/${id}/reject`, { reason }),
  pendingCount: () => http.get<{ applications: number }>('/api/admin/pending-count'),
  users: (q?: string) =>
    http.get<AdminUserVO[]>(`/api/admin/users${q ? `?q=${encodeURIComponent(q)}` : ''}`),
  setUserStatus: (username: string, active: boolean) =>
    http.postJson<void>(`/api/admin/users/${encodeURIComponent(username)}/status`, { active }),
  /** 重置密码：password 选填，填了则重置为指定密码，留空则由后端生成随机临时密码 */
  resetPassword: (username: string, password?: string) =>
    http.postJson<{ username: string; password: string }>(
      `/api/admin/users/${encodeURIComponent(username)}/reset-password`,
      { password: password ?? '' },
    ),
  audit: (limit = 100) => http.get<AdminAuditVO[]>(`/api/admin/audit?limit=${limit}`),
  announcements: () => http.get<AdminAnnouncementVO[]>(`/api/admin/announcements`),
  publishAnnouncement: (content: string) =>
    http.postJson<AdminAnnouncementVO>('/api/admin/announcements', { content }),
  closeAnnouncement: (id: string) => http.postJson<void>(`/api/admin/announcements/${id}/close`, {}),
}

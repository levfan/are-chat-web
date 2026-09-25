import type { ApiResponse } from '@/types'
import { CURRENT_USER_KEY } from '@/constants'

export class ApiError extends Error {
  readonly code: number

  constructor(code: number, message: string) {
    super(message)
    this.code = code
    this.name = 'ApiError'
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { credentials: 'same-origin', ...init })
  let body: ApiResponse<T> | null = null
  try {
    body = (await response.json()) as ApiResponse<T>
  } catch {
    body = null
  }
  if (!response.ok || !body || body.code !== 0) {
    if (body?.code === 401) {
      // 会话已失效，同步清理本地登录态
      sessionStorage.removeItem(CURRENT_USER_KEY)
    }
    throw new ApiError(body?.code ?? response.status, body?.message ?? `请求失败（HTTP ${response.status}）`)
  }
  return body.data
}

export const http = {
  get<T>(url: string): Promise<T> {
    return request<T>(url)
  },
  postJson<T>(url: string, data: unknown): Promise<T> {
    return request<T>(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  },
  putJson<T>(url: string, data: unknown): Promise<T> {
    return request<T>(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  },
  postForm<T>(url: string, form: FormData): Promise<T> {
    return request<T>(url, { method: 'POST', body: form })
  },
  delete<T>(url: string): Promise<T> {
    return request<T>(url, { method: 'DELETE' })
  },
}

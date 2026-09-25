import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, http } from '@/api/http'
import { CURRENT_USER_KEY } from '@/constants'

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
  })
}

afterEach(() => {
  vi.unstubAllGlobals()
  sessionStorage.clear()
})

describe('http client', () => {
  it('解析成功响应并返回 data', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ code: 0, message: 'ok', data: { hello: 1 } })))
    await expect(http.get('/api/x')).resolves.toEqual({ hello: 1 })
  })

  it('业务错误码抛 ApiError', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse({ code: 409, message: '这个名字已经有主了', data: null }, 409)),
    )
    await expect(http.get('/api/x')).rejects.toMatchObject({ code: 409, message: '这个名字已经有主了' })
  })

  it('401 时清理本地登录态', async () => {
    sessionStorage.setItem(CURRENT_USER_KEY, 'alice')
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse({ code: 401, message: '先去登录', data: null }, 401)),
    )
    await expect(http.get('/api/x')).rejects.toBeInstanceOf(ApiError)
    expect(sessionStorage.getItem(CURRENT_USER_KEY)).toBeNull()
  })

  it('非 JSON 响应给出兜底错误', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('boom', { status: 500 })))
    await expect(http.get('/api/x')).rejects.toMatchObject({ message: '请求失败（HTTP 500）' })
  })
})

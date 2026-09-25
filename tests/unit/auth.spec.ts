import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { CURRENT_USER_KEY } from '@/constants'
import { authApi } from '@/api/auth'

vi.mock('@/api/auth', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    smsCode: vi.fn(),
    logout: vi.fn(),
    me: vi.fn(),
  },
}))

const mockedLogin = vi.mocked(authApi.login)
const mockedLogout = vi.mocked(authApi.logout)

beforeEach(() => {
  setActivePinia(createPinia())
  sessionStorage.clear()
  vi.clearAllMocks()
})

describe('auth store', () => {
  it('登录成功写入本地登录态', async () => {
    mockedLogin.mockResolvedValue({ username: 'alice', greeting: 'success:欢迎进入are-chat！' })
    const auth = useAuthStore()
    expect(auth.isLoggedIn).toBe(false)

    await auth.login('alice', 'arechat123')

    expect(auth.isLoggedIn).toBe(true)
    expect(auth.username).toBe('alice')
    expect(sessionStorage.getItem(CURRENT_USER_KEY)).toBe('alice')
  })

  it('登录失败不写入登录态', async () => {
    mockedLogin.mockRejectedValue(new Error('给你一秒钟的时间重新思考！'))
    const auth = useAuthStore()

    await expect(auth.login('路人甲', 'wrong1234')).rejects.toThrow('重新思考')

    expect(auth.isLoggedIn).toBe(false)
    expect(sessionStorage.getItem(CURRENT_USER_KEY)).toBeNull()
  })

  it('退出时即使服务端失败也清理状态', async () => {
    mockedLogin.mockResolvedValue({ username: 'carol', greeting: 'ok' })
    mockedLogout.mockRejectedValue(new Error('session gone'))
    const auth = useAuthStore()
    await auth.login('carol', 'arechat123')

    await auth.logout()

    expect(auth.isLoggedIn).toBe(false)
    expect(sessionStorage.getItem(CURRENT_USER_KEY)).toBeNull()
  })
})

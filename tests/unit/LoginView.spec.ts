import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import LoginView from '@/views/LoginView.vue'
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

vi.mock('@/api/system', () => ({
  systemApi: {
    health: vi.fn().mockResolvedValue({
      status: 'UP',
      uptimeSeconds: 1,
      onlineCount: 0,
      version: '1.0.0',
      serverTime: Date.now(),
    }),
  },
  presenceApi: {
    online: vi.fn().mockResolvedValue({ onlineCount: 0, users: [] }),
  },
}))

const push = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push }),
  useRoute: () => ({ query: {} }),
}))

const mockedLogin = vi.mocked(authApi.login)

const mountView = () => mount(LoginView, { global: { plugins: [createPinia()] } })

/** 登录表单：按 testid 定位账号与密码输入框（radio 也是 input，不能按序号取） */
async function fillLogin(wrapper: ReturnType<typeof mountView>, account: string, password: string) {
  await wrapper.find('[data-testid="login-input"]').setValue(account)
  await wrapper.find('[data-testid="login-password"]').setValue(password)
}

beforeEach(() => {
  vi.clearAllMocks()
  sessionStorage.clear()
})

describe('LoginView', () => {
  it('账号为空时直接提示，不发请求', async () => {
    const wrapper = mountView()
    await wrapper.find('[data-testid="login-btn"]').trigger('click')
    expect(wrapper.find('[data-testid="login-error"]').text()).toContain('请输入手机号或用户名')
    expect(mockedLogin).not.toHaveBeenCalled()
  })

  it('登录成功跳转 home', async () => {
    mockedLogin.mockResolvedValue({ username: 'alice', greeting: 'success:欢迎进入 are-chat！' })
    const wrapper = mountView()
    await fillLogin(wrapper, 'alice', 'arechat123')
    await wrapper.find('[data-testid="login-btn"]').trigger('click')
    await flushPromises()
    expect(mockedLogin).toHaveBeenCalledWith('alice', 'arechat123')
    expect(push).toHaveBeenCalledWith('/chat')
  })

  it('登录失败展示后端提示', async () => {
    mockedLogin.mockRejectedValue(new Error('账号或密码不正确'))
    const wrapper = mountView()
    await fillLogin(wrapper, '路人甲', 'wrong1234')
    await wrapper.find('[data-testid="login-btn"]').trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-testid="login-error"]').text()).toContain('账号或密码不正确')
  })
})

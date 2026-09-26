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
    registerStatus: vi.fn(),
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

  it('77 注册提交后进入等待审批面板，查询进度显示待审批', async () => {
    const mockedRegister = vi.mocked(authApi.register)
    const mockedStatus = vi.mocked(authApi.registerStatus)
    mockedRegister.mockResolvedValue({
      applicationId: 'app-1',
      username: 'lisi',
      status: 'PENDING',
      hint: '注册申请已提交，等待管理员审批',
    })
    mockedStatus.mockResolvedValue({ status: 'PENDING', rejectReason: null })
    const wrapper = mountView()
    // 切到注册 tab（radio-button 的 input）
    const inputs = wrapper.findAll('input')
    const registerRadio = inputs.find((i) => (i.element as HTMLInputElement).value === 'register')
    await registerRadio?.setValue()
    await wrapper.find('[data-testid="register-phone"]').setValue('13911112222')
    await wrapper.find('[data-testid="register-username"]').setValue('lisi')
    await wrapper.find('[data-testid="register-nickname"]').setValue('李四')
    await wrapper.find('[data-testid="register-password"]').setValue('lisi12345')
    await wrapper.find('[data-testid="register-btn"]').trigger('click')
    await flushPromises()
    // 昵称随注册申请一起提交（选填字段，填了就原样上送）
    expect(mockedRegister).toHaveBeenCalledWith(
      expect.objectContaining({ username: 'lisi', nickname: '李四', password: 'lisi12345' }),
    )
    // 不再自动登录：停在审批面板
    expect(wrapper.find('[data-testid="register-pending"]').text()).toContain('申请已提交')
    // 查询进度
    await wrapper.find('[data-testid="check-status-btn"]').trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-testid="register-status"]').text()).toContain('管理员还没处理')
    expect(push).not.toHaveBeenCalled()
  })

  it('77 审批被拒绝时进度展示拒绝原因', async () => {
    const mockedRegister = vi.mocked(authApi.register)
    const mockedStatus = vi.mocked(authApi.registerStatus)
    mockedRegister.mockResolvedValue({
      applicationId: 'app-2',
      username: 'wangwu',
      status: 'PENDING',
      hint: '注册申请已提交，等待管理员审批',
    })
    mockedStatus.mockResolvedValue({ status: 'REJECTED', rejectReason: '信息不完整' })
    const wrapper = mountView()
    const inputs = wrapper.findAll('input')
    const registerRadio = inputs.find((i) => (i.element as HTMLInputElement).value === 'register')
    await registerRadio?.setValue()
    await wrapper.find('[data-testid="register-phone"]').setValue('13911113333')
    await wrapper.find('[data-testid="register-username"]').setValue('wangwu')
    await wrapper.find('[data-testid="register-password"]').setValue('wangwu123')
    await wrapper.find('[data-testid="register-btn"]').trigger('click')
    await flushPromises()
    await wrapper.find('[data-testid="check-status-btn"]').trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-testid="register-status"]').text()).toContain('信息不完整')
  })
})

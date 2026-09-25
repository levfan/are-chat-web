import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { authApi, type RegisterPayload } from '@/api/auth'
import { CURRENT_USER_KEY, CURRENT_USER_LOCAL_KEY } from '@/constants'

export const useAuthStore = defineStore('auth', () => {
  const username = ref(sessionStorage.getItem(CURRENT_USER_KEY) ?? '')
  /** 53 本次登录时间（毫秒时间戳，来自 /api/auth/me） */
  const loginAt = ref<number | null>(null)
  const isLoggedIn = computed(() => username.value.length > 0)

  /** 登录：手机号或用户名 + 密码 */
  async function login(account: string, password: string) {
    const result = await authApi.login(account, password)
    username.value = result.username
    sessionStorage.setItem(CURRENT_USER_KEY, result.username)
    // 58 写 localStorage 让其它标签页感知登录变化
    try {
      localStorage.setItem(CURRENT_USER_LOCAL_KEY, result.username)
    } catch {
      // 忽略
    }
    return result
  }

  /** 手机号注册：注册成功即登录（后端会建账号 + 资料行） */
  async function register(payload: RegisterPayload) {
    const result = await authApi.register(payload)
    username.value = result.username
    loginAt.value = result.loginAt ?? Date.now()
    sessionStorage.setItem(CURRENT_USER_KEY, result.username)
    try {
      localStorage.setItem(CURRENT_USER_LOCAL_KEY, result.username)
    } catch {
      // 忽略
    }
    return result
  }

  /** 53 会话信息校验：向服务端确认登录态并取本次登录时间。
   *  尽力而为：服务端不可达/401 都不打扰本地登录态（路由守卫负责未登录拦截）。 */
  async function verify() {
    if (!isLoggedIn.value) {
      return false
    }
    try {
      const me = await authApi.me()
      if (me.username && me.username !== username.value) {
        // 会话里是别人（极端情况）：以服务端为准
        username.value = me.username
        sessionStorage.setItem(CURRENT_USER_KEY, me.username)
      }
      loginAt.value = me.loginAt ?? null
      return true
    } catch {
      return false
    }
  }

  async function logout() {
    try {
      await authApi.logout()
    } catch {
      // 服务端会话可能已过期，忽略错误，本地状态照样清理
    }
    username.value = ''
    loginAt.value = null
    sessionStorage.removeItem(CURRENT_USER_KEY)
    try {
      // 58 其它标签页通过 storage 事件感知退出
      localStorage.setItem(CURRENT_USER_LOCAL_KEY, '')
      localStorage.removeItem(CURRENT_USER_LOCAL_KEY)
    } catch {
      // 忽略
    }
  }

  /** 仅清理本地登录态（58 多标签页同步用，不再请求服务端） */
  function clearLocal() {
    username.value = ''
    loginAt.value = null
    sessionStorage.removeItem(CURRENT_USER_KEY)
  }

  return { username, loginAt, isLoggedIn, login, register, logout, verify, clearLocal }
})

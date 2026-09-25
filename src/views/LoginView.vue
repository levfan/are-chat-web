<template>
  <div class="login-page">
    <div class="login-card">
      <div class="brand">
        <div class="brand-mark">A</div>
        <div class="brand-name">are-chat</div>
      </div>
      <p class="brand-sub">{{ mode === 'login' ? '登录后与好友保持联系' : '手机号注册，成为合法用户' }}</p>

      <el-radio-group v-model="mode" class="mode-tabs" data-testid="auth-mode">
        <el-radio-button value="login">登录</el-radio-button>
        <el-radio-button value="register">注册</el-radio-button>
      </el-radio-group>

      <!-- ============ 登录 ============ -->
      <template v-if="mode === 'login'">
        <el-input
          v-model="account"
          class="input"
          placeholder="手机号或用户名"
          size="large"
          data-testid="login-input"
          @keyup.enter="onLogin"
        />
        <el-input
          v-model="password"
          class="input"
          type="password"
          placeholder="密码"
          size="large"
          show-password
          data-testid="login-password"
          @keyup.enter="onLogin"
        />
        <el-button
          class="btn"
          type="primary"
          size="large"
          :loading="loading"
          data-testid="login-btn"
          @click="onLogin"
        >
          登 录
        </el-button>
      </template>

      <!-- ============ 注册 ============ -->
      <template v-else>
        <el-input
          v-model="regPhone"
          class="input"
          placeholder="手机号"
          size="large"
          maxlength="11"
          data-testid="register-phone"
        />
        <el-input
          v-model="regUsername"
          class="input"
          placeholder="用户名（3~20 位小写字母、数字、下划线）"
          size="large"
          data-testid="register-username"
        />
        <el-input
          v-model="regPassword"
          class="input"
          type="password"
          placeholder="密码（6~64 位，含字母和数字）"
          size="large"
          show-password
          data-testid="register-password"
        />
        <div class="code-row">
          <el-input
            v-model="regCode"
            placeholder="短信验证码"
            size="large"
            maxlength="6"
            data-testid="register-code"
            @keyup.enter="onRegister"
          />
          <el-button
            size="large"
            :disabled="countdown > 0"
            :loading="sendingCode"
            data-testid="send-code-btn"
            @click="onSendCode"
          >
            {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
          </el-button>
        </div>
        <p v-if="devCodeHint" class="dev-code" data-testid="dev-code">{{ devCodeHint }}</p>
        <el-button
          class="btn"
          type="primary"
          size="large"
          :loading="loading"
          data-testid="register-btn"
          @click="onRegister"
        >
          注册并登录
        </el-button>
      </template>

      <el-alert
        v-if="error"
        class="error"
        type="error"
        :title="error"
        :closable="false"
        data-testid="login-error"
      />

      <div class="hints">
        <span class="hint-label">演示账号</span>
        <el-tag
          v-for="demo in DEMO_ACCOUNTS"
          :key="demo.username"
          size="small"
          effect="plain"
          round
          class="hint-tag"
          :data-testid="`demo-${demo.username}`"
          @click="useDemo(demo.username)"
        >
          {{ demo.username }}
        </el-tag>
        <span class="hint-pwd">密码统一 {{ DEMO_PASSWORD }}</span>
      </div>

      <!-- 59 服务状态点 -->
      <div class="server-status" data-testid="server-status">
        <span class="status-dot" :class="healthStatus" />
        <span v-if="healthText" class="status-text">{{ healthText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api/auth'
import { systemApi } from '@/api/system'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

type Mode = 'login' | 'register'
const mode = ref<Mode>('login')

const account = ref('')
const password = ref('')

const regPhone = ref('')
const regUsername = ref('')
const regPassword = ref('')
const regCode = ref('')

const loading = ref(false)
const sendingCode = ref(false)
const error = ref('')
const devCodeHint = ref('')
const countdown = ref(0)
let countdownTimer: number | null = null

/** 演示账号：由后端播种（DemoUserSeeder），密码统一 */
const DEMO_PASSWORD = 'arechat123'
const DEMO_ACCOUNTS = [
  { username: 'alice', phone: '13800000001' },
  { username: 'bob', phone: '13800000002' },
  { username: 'carol', phone: '13800000003' },
]

function useDemo(username: string) {
  mode.value = 'login'
  account.value = username
  password.value = DEMO_PASSWORD
  error.value = ''
}

// 59 登录页展示服务端健康状态
const healthStatus = ref<'ok' | 'bad' | 'checking'>('checking')
const healthText = ref('')

onMounted(async () => {
  try {
    const health = await systemApi.health()
    healthStatus.value = health.status === 'UP' ? 'ok' : 'bad'
    healthText.value = `服务正常 · 在线 ${health.onlineCount} 人`
  } catch {
    healthStatus.value = 'bad'
    healthText.value = '服务暂不可用'
  }
})

onUnmounted(() => {
  if (countdownTimer !== null) {
    clearInterval(countdownTimer)
  }
})

async function onLogin() {
  if (!account.value.trim()) {
    error.value = '请输入手机号或用户名'
    return
  }
  if (!password.value) {
    error.value = '请输入密码'
    return
  }
  loading.value = true
  error.value = ''
  try {
    await auth.login(account.value.trim(), password.value)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/chat'
    router.push(redirect)
  } catch (e) {
    error.value = e instanceof Error ? e.message : '登录失败'
  } finally {
    loading.value = false
  }
}

async function onSendCode() {
  if (!/^1[3-9]\d{9}$/.test(regPhone.value.trim())) {
    error.value = '请输入正确的 11 位手机号'
    return
  }
  sendingCode.value = true
  error.value = ''
  try {
    const result = await authApi.smsCode(regPhone.value.trim())
    // 演示环境没有短信网关：验证码直接回显，顺手帮用户填上
    devCodeHint.value = `演示环境验证码：${result.devCode}（${result.hint}）`
    regCode.value = result.devCode
    startCountdown(60)
  } catch (e) {
    error.value = e instanceof Error ? e.message : '验证码获取失败'
  } finally {
    sendingCode.value = false
  }
}

function startCountdown(seconds: number) {
  countdown.value = seconds
  if (countdownTimer !== null) {
    clearInterval(countdownTimer)
  }
  countdownTimer = window.setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0 && countdownTimer !== null) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
  }, 1000)
}

async function onRegister() {
  loading.value = true
  error.value = ''
  try {
    await auth.register({
      phone: regPhone.value.trim(),
      username: regUsername.value.trim(),
      password: regPassword.value,
      code: regCode.value.trim(),
    })
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/chat'
    router.push(redirect)
  } catch (e) {
    error.value = e instanceof Error ? e.message : '注册失败'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--xx-bg, #f3f4f7);
}
.login-card {
  width: 400px;
  background: var(--im-panel, #fff);
  border: 1px solid var(--im-border, #e6e8eb);
  border-radius: 12px;
  box-shadow: var(--im-shadow, 0 8px 30px rgba(0, 0, 0, 0.08));
  padding: 32px;
  text-align: center;
}
.brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.brand-mark {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--xx-accent, #3370ff);
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}
.brand-name {
  font-size: 21px;
  font-weight: 700;
  letter-spacing: 0.5px;
}
.brand-sub {
  color: var(--im-muted, #8f959e);
  font-size: 13px;
  margin: 8px 0 18px;
}
.mode-tabs {
  margin-bottom: 16px;
}
.input {
  margin-bottom: 12px;
}
.code-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.code-row :deep(.el-input) {
  flex: 1;
}
.dev-code {
  margin: -2px 0 10px;
  font-size: 12px;
  color: var(--xx-accent, #3370ff);
  text-align: left;
}
.btn {
  width: 100%;
  border-radius: 8px;
}
.error {
  margin-top: 14px;
  text-align: left;
}
.hints {
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
}
.hint-label,
.hint-pwd {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.hint-tag {
  cursor: pointer;
}
.server-status {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #98a1b3;
}
.status-dot.ok {
  background: #34c77b;
}
.status-dot.bad {
  background: #f56c6c;
}
.status-dot.checking {
  background: #e6a23c;
}
.status-text {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
</style>

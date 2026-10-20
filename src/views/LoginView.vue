<template>
  <div class="login-page">
    <!-- 科技风底纹：冷色网格 + 节点微光 + 一条缓慢扫过的扫描线（纯 CSS，无资源依赖） -->
    <div class="grid-field" aria-hidden="true">
      <span class="scan-line" />
      <i v-for="n in LOGIN_NODES" :key="n.id" class="node" :style="n.style" />
    </div>
    <div class="login-card">
      <div class="brand">
        <div class="brand-mark">✦</div>
        <div class="brand-name">{{ APP_NAME }}<span class="brand-code">{{ APP_CODENAME }}</span></div>
      </div>
      <p class="brand-sub">{{ mode === 'login' ? '登录后接入通讯中枢' : '提交注册申请，管理员审批通过后即可登录' }}</p>
      <!-- 93 节日登录页文案：特别的日子说一句应景的话 -->
      <p v-if="festival" class="festival-line" data-testid="login-festival">
        {{ festival.emoji }} {{ festival.text }}
      </p>

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

      <!-- ============ 注册（77 审批制） ============ -->
      <template v-else-if="!submitted">
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
          v-model="regNickname"
          class="input"
          placeholder="昵称（必填，1~32 个字）"
          size="large"
          maxlength="32"
          data-testid="register-nickname"
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
          提交注册申请
        </el-button>
      </template>

      <!-- 77 申请已提交：等待管理员审批 + 进度查询 -->
      <template v-else>
        <el-result
          icon="success"
          title="申请已提交"
          :sub-title="`用户名 ${submittedName} 正在等待管理员审批，通过后即可用手机号/用户名 + 密码登录`"
          data-testid="register-pending"
        />
        <el-button class="btn" size="large" :loading="checkingStatus" data-testid="check-status-btn" @click="onCheckStatus">
          查询审批进度
        </el-button>
        <p v-if="statusText" class="status-line" data-testid="register-status">{{ statusText }}</p>
        <el-button link type="primary" @click="backToLogin">返回登录</el-button>
      </template>

      <el-alert
        v-if="error"
        class="error"
        type="error"
        :title="error"
        :closable="false"
        data-testid="login-error"
      />

      <!-- 59 服务状态点 -->
      <div class="server-status" data-testid="server-status">
        <span class="status-dot" :class="healthStatus" />
        <span v-if="healthText" class="status-text">{{ healthText }}</span>
      </div>

      <!-- 100 系统版本与构建时间：不参与交互，一眼确认部署版本 -->
      <p class="app-version" data-testid="app-version">{{ APP_NAME }} v{{ appVersion }} · 构建于 {{ buildTime }}</p>
    </div>

    <!-- 登录成功 → 进入系统之间的过渡遮罩：路由懒加载 + 首屏数据拉取有 1~2 秒，这期间给明确反馈 -->
    <transition name="entering-fade">
      <div v-if="entering" class="entering-mask" role="status" aria-live="polite" data-testid="login-success">
        <div class="entering-box">
          <span class="entering-icon" aria-hidden="true">✓</span>
          <p class="entering-title">登录成功</p>
          <p class="entering-sub">正在进入{{ APP_NAME }}…</p>
          <span class="entering-bar" aria-hidden="true" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api/auth'
import { systemApi } from '@/api/system'
import { APP_CODENAME, APP_NAME } from '@/constants'

const route = useRoute()

// 100 版本信息（vite.config.ts define 注入，随构建自动更新）
const appVersion = __APP_VERSION__
const buildTime = __BUILD_TIME__

/** 科技风登录页：底纹节点的位置/大小/呼吸节奏参数（纯装饰，不参与任何逻辑） */
const LOGIN_NODES = [
  { id: 1, style: { left: '7%', top: '18%', width: '7px', animationDelay: '0s' } },
  { id: 2, style: { left: '18%', top: '72%', width: '5px', animationDelay: '1.2s' } },
  { id: 3, style: { left: '33%', top: '31%', width: '6px', animationDelay: '2.4s' } },
  { id: 4, style: { left: '48%', top: '84%', width: '5px', animationDelay: '0.6s' } },
  { id: 5, style: { left: '63%', top: '12%', width: '7px', animationDelay: '1.8s' } },
  { id: 6, style: { left: '78%', top: '58%', width: '6px', animationDelay: '3s' } },
  { id: 7, style: { left: '91%', top: '26%', width: '5px', animationDelay: '2.1s' } },
]
const router = useRouter()
const auth = useAuthStore()

// 93 节日登录页文案：今天若是特别的日子，先说一句应景的话
const FESTIVAL_LINES: Record<string, { emoji: string; text: string }> = {
  '01-01': { emoji: '🎊', text: '新年第一天，先把要常联系的人加进列表' },
  '02-14': { emoji: '🌹', text: '今天适合把那句拖了很久的话说出口' },
  '03-08': { emoji: '🌷', text: '节日快乐，也别忘了把谢谢真的说出来' },
  '05-01': { emoji: '🌿', text: '假期快乐，休息也是正事' },
  '05-20': { emoji: '💬', text: '今天消息多，重要的那条先发出' },
  '06-01': { emoji: '🎈', text: '六一，给老朋友发一句没头没尾的问候' },
  '08-04': { emoji: '✨', text: '七夕，隔着多远也能把话送到' },
  '09-10': { emoji: '📖', text: '教师节快乐，谢谢那个把你教明白的人' },
  '10-01': { emoji: '🇨🇳', text: '长假出行，记得报个平安' },
  '11-11': { emoji: '📦', text: '双十一，先回完消息再下单' },
  '12-24': { emoji: '🍎', text: '平安夜，天冷早点回' },
  '12-25': { emoji: '🔔', text: '圣诞快乐，问候别攒到明年' },
  '12-31': { emoji: '🎆', text: '年末清一清未读，再开下一年' },
}
const festival = computed(() => {
  const now = new Date()
  const mmdd = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  return FESTIVAL_LINES[mmdd] ?? null
})

type Mode = 'login' | 'register'
const mode = ref<Mode>('login')

const account = ref('')
const password = ref('')

const regPhone = ref('')
const regUsername = ref('')
const regNickname = ref('')
const regPassword = ref('')
const regCode = ref('')

const loading = ref(false)
const sendingCode = ref(false)
const error = ref('')
const devCodeHint = ref('')
const countdown = ref(0)
let countdownTimer: number | null = null

/** 登录成功后的过渡态：为 true 时展示「登录成功，正在进入…」遮罩，直到路由跳转完成 */
const entering = ref(false)

// 77 审批流状态
const submitted = ref(false)
const submittedName = ref('')
const checkingStatus = ref(false)
const statusText = ref('')

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

/** 后端 greeting 形如 "success:欢迎进入天枢！"：去掉状态前缀后作为成功提示，取不到就退回兜底文案 */
function greetingText(greeting: string | undefined): string {
  const text = (greeting ?? '').replace(/^[a-zA-Z]+:/, '').trim()
  return text || '登录成功，正在进入…'
}

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
  let greeting = ''
  try {
    const result = await auth.login(account.value.trim(), password.value)
    greeting = result.greeting
  } catch (e) {
    error.value = e instanceof Error ? e.message : '登录失败'
    loading.value = false
    return
  }
  // 登录已成功：路由懒加载 + 聊天首屏数据拉取还要一会儿，先给出「登录成功」反馈再跳转
  entering.value = true
  ElMessage.success(greetingText(greeting))
  try {
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/chat'
    await router.push(redirect)
  } catch (e) {
    // 跳转失败（异常路由等）：收起遮罩并把原因显示在登录页，让用户能重试
    entering.value = false
    error.value = e instanceof Error ? e.message : '进入系统失败，请重试'
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
  // 昵称必填（与后端 RegistrationService 校验一致）
  if (!regNickname.value.trim()) {
    error.value = '请输入昵称（1~32 个字）'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const result = await authApi.register({
      phone: regPhone.value.trim(),
      username: regUsername.value.trim(),
      nickname: regNickname.value.trim(),
      password: regPassword.value,
      code: regCode.value.trim(),
    })
    // 77 提交成功进入「等待审批」面板
    submitted.value = true
    submittedName.value = result.username
    statusText.value = ''
  } catch (e) {
    error.value = e instanceof Error ? e.message : '注册申请提交失败'
  } finally {
    loading.value = false
  }
}

/** 77 查询审批进度 */
async function onCheckStatus() {
  if (!submittedName.value) {
    return
  }
  checkingStatus.value = true
  try {
    const status = await authApi.registerStatus(submittedName.value)
    if (status.status === 'PENDING') {
      statusText.value = '管理员还没处理，再等等吧～'
    } else if (status.status === 'APPROVED') {
      statusText.value = '审批已通过！返回用账号密码登录即可'
    } else {
      statusText.value = `申请被拒绝：${status.rejectReason || '未填写原因'}，可联系管理员后重新申请`
    }
  } catch (e) {
    statusText.value = e instanceof Error ? e.message : '查询失败'
  } finally {
    checkingStatus.value = false
  }
}

function backToLogin() {
  submitted.value = false
  mode.value = 'login'
  regCode.value = ''
  regPassword.value = ''
  statusText.value = ''
}
</script>

<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  /* 科技风：冷色渐变 + 一层细网格 */
  background: linear-gradient(160deg, #eef4fb 0%, #dfeaf6 46%, #e6f2fb 100%);
}
html.dark .login-page {
  background: linear-gradient(160deg, #060d18 0%, #0a1828 52%, #071020 100%);
}
/* 底纹层：网格线 + 呼吸节点 + 扫描线，全部 pointer-events:none，不抢任何交互 */
.grid-field {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  background-image: linear-gradient(rgba(14, 165, 233, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(14, 165, 233, 0.07) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: radial-gradient(120% 90% at 50% 45%, #000 30%, transparent 78%);
}
.node {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #38bdf8;
  box-shadow: 0 0 10px 2px rgba(56, 189, 248, 0.55);
  animation: login-node-pulse 4.5s ease-in-out infinite;
}
html.dark .node {
  background: #22d3ee;
  box-shadow: 0 0 12px 3px rgba(34, 211, 238, 0.45);
}
@keyframes login-node-pulse {
  0%,
  100% {
    opacity: 0.25;
    transform: scale(0.8);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.15);
  }
}
.scan-line {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(14, 165, 233, 0.5), transparent);
  animation: login-scan 9s linear infinite;
}
@keyframes login-scan {
  0% {
    transform: translateY(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh);
    opacity: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .node,
  .scan-line {
    animation: none;
  }
  .scan-line {
    opacity: 0.35;
  }
}
.login-card {
  /* 手机浏览器（~375px 视口）不横向溢出 */
  width: min(400px, calc(100vw - 24px));
  position: relative;
  z-index: 1;
  background: var(--im-panel, #fff);
  border: 1px solid var(--im-border, #dde6f0);
  border-radius: 12px;
  box-shadow: var(--im-shadow, 0 12px 40px rgba(15, 45, 85, 0.16));
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
  background: linear-gradient(135deg, #38bdf8, #0369a1);
  color: #fff;
  font-size: 19px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  box-shadow: 0 4px 14px rgba(3, 105, 161, 0.35);
}
.brand-name {
  font-size: 21px;
  font-weight: 700;
  letter-spacing: 1px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.15;
}
/* 英文代号：小字距拉开，当标识用 */
.brand-code {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 2.4px;
  color: var(--im-muted, #7b8ca1);
}
.brand-sub {
  color: var(--im-muted, #8f959e);
  font-size: 13px;
  margin: 8px 0 18px;
}
/* 93 节日登录页文案 */
.festival-line {
  margin: -14px 0 8px;
  font-size: 12px;
  font-weight: 600;
  color: #0b6fa8;
  background: linear-gradient(90deg, rgba(14, 165, 233, 0.12), rgba(34, 211, 238, 0.06));
  border-left: 2px solid #0ea5e9;
  border-radius: 6px;
  padding: 6px 10px;
  text-align: left;
}
html.dark .festival-line {
  color: #7dd3fc;
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
  color: var(--xx-accent, #0ea5e9);
  text-align: left;
}
.btn {
  width: 100%;
  border-radius: 12px;
}
.error {
  margin-top: 14px;
  text-align: left;
}
.status-line {
  margin: 6px 0 12px;
  font-size: 13px;
  color: var(--im-text-2, #51565f);
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
/* 100 版本信息 */
.app-version {
  margin: 14px 0 0;
  font-size: 11px;
  color: var(--im-muted, #8f959e);
  text-align: center;
  user-select: text;
}
/* 登录成功 → 进入系统之间的过渡遮罩（盖住登录卡片，避免「点了没反应」的错觉） */
.entering-mask {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 半透明 + 轻微模糊：既能看清「登录成功」，又能感觉到页面正在切换 */
  background: rgba(255, 250, 252, 0.82);
  backdrop-filter: blur(2px);
}
html.dark .entering-mask {
  background: rgba(24, 16, 22, 0.82);
}
.entering-box {
  text-align: center;
}
.entering-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #38bdf8, #0369a1);
  color: #fff;
  font-size: 28px;
  line-height: 1;
  box-shadow: 0 8px 20px rgba(3, 105, 161, 0.32);
  animation: login-entering-pop 0.36s ease-out;
}
.entering-title {
  margin: 14px 0 4px;
  font-size: 17px;
  font-weight: 700;
  color: var(--im-text, #14202e);
}
.entering-sub {
  margin: 0;
  font-size: 13px;
  color: var(--im-muted, #8f959e);
}
.entering-bar {
  display: block;
  width: 120px;
  height: 3px;
  margin: 16px auto 0;
  border-radius: 2px;
  overflow: hidden;
  background: rgba(233, 72, 127, 0.16);
}
.entering-bar::after {
  content: '';
  display: block;
  width: 40%;
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(90deg, #22d3ee, #0ea5e9);
  animation: login-entering-bar 1s ease-in-out infinite;
}
.entering-fade-enter-active {
  transition: opacity 0.18s ease-out;
}
.entering-fade-enter-from {
  opacity: 0;
}
@keyframes login-entering-pop {
  from {
    transform: scale(0.6);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
@keyframes login-entering-bar {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(250%);
  }
}
@media (prefers-reduced-motion: reduce) {
  .entering-icon {
    animation: none;
  }
  .entering-bar::after {
    animation: none;
    width: 100%;
  }
  .entering-fade-enter-active {
    transition: none;
  }
}
</style>

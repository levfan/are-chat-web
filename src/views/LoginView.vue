<template>
  <div class="login-page">
    <!-- 情侣风：背景飘浮爱心装饰（纯 CSS，无资源依赖） -->
    <div class="hearts-field" aria-hidden="true">
      <span v-for="h in LOGIN_HEARTS" :key="h.id" class="float-heart" :style="h.style">{{ h.char }}</span>
    </div>
    <div class="login-card">
      <div class="brand">
        <div class="brand-mark">⛵</div>
        <div class="brand-name">小帆船</div>
      </div>
      <p class="brand-sub">{{ mode === 'login' ? '登录后与心爱的人保持联系' : '提交注册申请，管理员审批通过后即可登录' }}</p>
      <!-- 93 节日登录页文案：特别的日子说应景的话 -->
      <p v-if="festival" class="festival-line" data-testid="login-festival">
        {{ festival.emoji }} {{ festival.text }}
      </p>
      <!-- F49 今日情话：每天换一句，登录页的小温柔 -->
      <p class="daily-love" data-testid="login-daily-love">💌 {{ todayLove }}</p>

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
      <p class="app-version" data-testid="app-version">小帆船 v{{ appVersion }} · 构建于 {{ buildTime }}</p>
    </div>

    <!-- 登录成功 → 进入系统之间的过渡遮罩：路由懒加载 + 首屏数据拉取有 1~2 秒，这期间给明确反馈 -->
    <transition name="entering-fade">
      <div v-if="entering" class="entering-mask" role="status" aria-live="polite" data-testid="login-success">
        <div class="entering-box">
          <span class="entering-icon" aria-hidden="true">✓</span>
          <p class="entering-title">登录成功</p>
          <p class="entering-sub">正在进入小帆船…</p>
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

const route = useRoute()

// 100 版本信息（vite.config.ts define 注入，随构建自动更新）
const appVersion = __APP_VERSION__
const buildTime = __BUILD_TIME__

/** 情侣风登录页：飘浮爱心装饰的位置/大小/节奏参数 */
const LOGIN_HEARTS = [
  { id: 1, char: '💕', style: { left: '8%', fontSize: '22px', animationDuration: '13s', animationDelay: '0s', opacity: 0.5 } },
  { id: 2, char: '💗', style: { left: '20%', fontSize: '15px', animationDuration: '17s', animationDelay: '3s', opacity: 0.4 } },
  { id: 3, char: '💖', style: { left: '36%', fontSize: '18px', animationDuration: '15s', animationDelay: '6s', opacity: 0.45 } },
  { id: 4, char: '💕', style: { left: '55%', fontSize: '14px', animationDuration: '19s', animationDelay: '1.5s', opacity: 0.4 } },
  { id: 5, char: '💗', style: { left: '72%', fontSize: '24px', animationDuration: '14s', animationDelay: '4.5s', opacity: 0.5 } },
  { id: 6, char: '✨', style: { left: '86%', fontSize: '16px', animationDuration: '18s', animationDelay: '8s', opacity: 0.45 } },
  { id: 7, char: '💕', style: { left: '93%', fontSize: '13px', animationDuration: '16s', animationDelay: '10s', opacity: 0.35 } },
]
const router = useRouter()
const auth = useAuthStore()

// ---------- F49 今日情话：按天轮换，登录页的小温柔 ----------
const LOVE_WORDS = [
  '想你的日子，连风都是甜的。',
  '世上温柔那么多，我只想给你一个人。',
  '今天也是爱你的一天，比昨天多一点。',
  '遇见你之后，人间忽然值得。',
  '我走过的路里，最想去的是你心里。',
  '月亮很亮，亮也没用，没用也亮；我喜欢你，喜欢也没用，没用也喜欢。',
  '余生请你指教，也请多关照我的小朋友脾气。',
  '你是我温暖的手套，冰凉的啤酒，带着阳光味道的衬衫。',
  '把星星揉碎，掺进晚安里给你。',
  '喜欢你不是三分钟热度，是蓄谋已久。',
]
const todayLove = LOVE_WORDS[Math.floor(Date.now() / 86400000) % LOVE_WORDS.length]

// 93 节日登录页文案：今天若是特别的日子，先说一句应景的话
const FESTIVAL_LINES: Record<string, { emoji: string; text: string }> = {
  '01-01': { emoji: '🎊', text: '新的一年，第一句早安也要说给同一个人听' },
  '02-14': { emoji: '🌹', text: '今天全世界都在帮我说那三个字' },
  '03-08': { emoji: '🌷', text: '她值得世界上所有的温柔，今天尤其' },
  '05-01': { emoji: '🌿', text: '假期快乐！最好的休息是和你待在一起' },
  '05-20': { emoji: '💗', text: '520，我 You，早就说过了，今天再大声一遍' },
  '06-01': { emoji: '🎈', text: '谁说大人不能过儿童节，在你面前我永远可以' },
  '08-04': { emoji: '✨', text: '今天银河帮忙传话：我想你了' },
  '09-10': { emoji: '📖', text: '谢师之后，也谢谢你教会我什么是爱' },
  '10-01': { emoji: '🇨🇳', text: '家和国都团圆的日子，别忘记说晚安' },
  '11-11': { emoji: '🛒', text: '别人过光棍节，我们过「一加一等于全世界」节' },
  '12-24': { emoji: '🎄', text: '今晚的苹果和月亮，都替我抱抱你' },
  '12-25': { emoji: '🔔', text: '圣诞老人没来没关系，我来了' },
  '12-31': { emoji: '🎆', text: '谢谢你陪我走完这一年，明年也请多指教' },
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

/** 后端 greeting 形如 "success:欢迎进入小帆船！"：去掉状态前缀后作为成功提示，取不到就退回兜底文案 */
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
  /* 情侣风：粉紫暖渐变背景 */
  background: linear-gradient(160deg, #ffeaf3 0%, #fdf0f6 42%, #f4ecfb 100%);
}
html.dark .login-page {
  background: linear-gradient(160deg, #1c1117 0%, #231522 48%, #1b1424 100%);
}
/* 飘浮爱心：从底部缓缓升到顶部，循环 */
.hearts-field {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
.float-heart {
  position: absolute;
  bottom: -40px;
  animation-name: login-heart-float;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  user-select: none;
}
@keyframes login-heart-float {
  0% {
    transform: translateY(0) rotate(-8deg);
  }
  50% {
    transform: translateY(-52vh) translateX(18px) rotate(10deg);
  }
  100% {
    transform: translateY(-110vh) translateX(-10px) rotate(-6deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .float-heart {
    animation: none;
    opacity: 0.25;
  }
}
.login-card {
  /* 手机浏览器（~375px 视口）不横向溢出 */
  width: min(400px, calc(100vw - 24px));
  background: var(--im-panel, #fff);
  border: 1px solid var(--im-border, #f0e3e9);
  border-radius: 20px;
  box-shadow: var(--im-shadow, 0 12px 40px rgba(180, 80, 120, 0.16));
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
  border-radius: 12px;
  background: linear-gradient(135deg, #ff9ec4, #e9487f);
  color: #fff;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  box-shadow: 0 4px 12px rgba(233, 72, 127, 0.35);
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
/* F49 今日情话 */
.daily-love {
  margin: -10px 0 14px;
  font-size: 12px;
  color: #c45656;
  background: linear-gradient(90deg, #fff0f0, #fff8e6);
  border-radius: 8px;
  padding: 6px 10px;
}
/* 93 节日登录页文案 */
.festival-line {
  margin: -14px 0 8px;
  font-size: 12px;
  font-weight: 600;
  color: #ad3b8e;
  background: linear-gradient(90deg, #fdeef9, #fdf3e6);
  border-radius: 8px;
  padding: 6px 10px;
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
  color: var(--xx-accent, #ec5f92);
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
  background: linear-gradient(135deg, #ff9ec4, #e9487f);
  color: #fff;
  font-size: 28px;
  line-height: 1;
  box-shadow: 0 8px 20px rgba(233, 72, 127, 0.32);
  animation: login-entering-pop 0.36s ease-out;
}
.entering-title {
  margin: 14px 0 4px;
  font-size: 17px;
  font-weight: 700;
  color: var(--im-text, #3a2e34);
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
  background: linear-gradient(90deg, #ff9ec4, #e9487f);
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

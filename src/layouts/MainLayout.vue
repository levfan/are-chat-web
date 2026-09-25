<template>
  <el-container class="shell">
    <aside class="rail">
      <div class="logo" title="are-chat">A</div>
      <nav class="nav">
        <el-tooltip content="消息" placement="right">
          <router-link to="/chat" class="nav-item" :class="{ active: route.path === '/chat' }">
            <el-icon :size="19"><ChatDotRound /></el-icon>
            <el-badge v-if="im.totalUnread > 0" :value="im.totalUnread" :max="99" class="nav-badge" />
          </router-link>
        </el-tooltip>
        <el-tooltip content="好友" placement="right">
          <router-link to="/friends" class="nav-item" :class="{ active: route.path === '/friends' }">
            <el-icon :size="19"><User /></el-icon>
            <el-badge
              v-if="im.incoming.length > 0"
              :value="im.incoming.length"
              :max="99"
              class="nav-badge"
              data-testid="nav-request-badge"
            />
          </router-link>
        </el-tooltip>
        <el-tooltip content="我的统计" placement="right">
          <button type="button" class="rail-btn nav-item-btn" data-testid="stats-open" @click="statsVisible = true">
            <el-icon :size="19"><TrendCharts /></el-icon>
          </button>
        </el-tooltip>
      </nav>
      <div class="rail-bottom">
        <!-- 46 连接状态点 -->
        <el-tooltip :content="statusText" placement="right">
          <span class="ws-dot" :class="im.status" data-testid="ws-status" />
        </el-tooltip>
        <!-- 57 全站在线人数 -->
        <el-tooltip content="当前在线人数" placement="right">
          <span class="online-count" data-testid="online-count">
            <el-icon :size="12"><UserFilled /></el-icon>{{ onlineCount }}
          </span>
        </el-tooltip>
        <!-- 43 我的 presence 状态快捷切换 -->
        <el-dropdown trigger="click" @command="onPresenceCommand">
          <button type="button" class="rail-btn" data-testid="presence-switch" :title="`我的状态：${myStatusLabel}`">
            <el-icon :size="17"><component :is="statusIcon" /></el-icon>
          </button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="opt in PRESENCE_OPTIONS"
                :key="opt.value"
                :command="opt.value"
                :data-testid="`presence-${opt.value}`"
              >
                {{ opt.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-tooltip
          :content="`主题：${themeMode === 'auto' ? '跟随系统' : themeMode === 'dark' ? '深色' : '浅色'}（点击切换）`"
          placement="right"
        >
          <button type="button" class="rail-btn" data-testid="theme-toggle" @click="onToggleTheme">
            <el-icon :size="17"><component :is="themeIcon" /></el-icon>
          </button>
        </el-tooltip>
        <button type="button" class="me" data-testid="profile-open" @click="profileVisible = true">
          <ImAvatar :name="auth.username" :color="im.myProfile?.avatar ?? undefined" :size="34" />
        </button>
        <span class="me-name" data-testid="current-user">{{ auth.username }}</span>
        <el-tooltip content="退出登录" placement="right">
          <button type="button" class="rail-btn" @click="onLogout">
            <el-icon :size="17"><SwitchButton /></el-icon>
          </button>
        </el-tooltip>
      </div>
    </aside>
    <el-main class="content">
      <router-view />
    </el-main>
  </el-container>
  <ProfileDialog v-model="profileVisible" />
  <StatsDialog v-model="statsVisible" />
  <!-- 70 新消息浮动卡片 -->
  <NewMessageToast :items="toasts" @open="onToastOpen" @close="dismissToast" />
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  AlarmClock,
  ChatDotRound,
  CircleCheck,
  Clock,
  Monitor,
  Moon,
  Sunny,
  SwitchButton,
  TrendCharts,
  User,
  UserFilled,
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { useImStore } from '@/stores/im'
import { presenceApi } from '@/api/system'
import { cycleTheme, getThemeMode, type ThemeMode } from '@/utils/theme'
import { accentColor, currentAccent } from '@/utils/settings'
import { updateFaviconBadge } from '@/utils/favicon'
import { CURRENT_USER_LOCAL_KEY } from '@/constants'
import ImAvatar from '@/components/im/ImAvatar.vue'
import ProfileDialog from '@/components/im/ProfileDialog.vue'
import StatsDialog from '@/components/im/StatsDialog.vue'
import NewMessageToast from '@/components/im/NewMessageToast.vue'
import type { ToastItem } from '@/types'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const im = useImStore()

const profileVisible = ref(false)
const statsVisible = ref(false)
const themeMode = ref<ThemeMode>(getThemeMode())
const onlineCount = ref(0)
let onlineTimer: number | null = null

const themeIcon = computed(() => ({ auto: Monitor, dark: Moon, light: Sunny })[themeMode.value])

// 43 presence 快捷切换
const PRESENCE_OPTIONS = [
  { value: 'online', label: '在线', icon: CircleCheck },
  { value: 'busy', label: '忙碌', icon: AlarmClock },
  { value: 'away', label: '离开', icon: Clock },
] as const

const myStatus = computed(() => im.myProfile?.presenceStatus ?? 'online')
const myStatusLabel = computed(
  () => PRESENCE_OPTIONS.find((o) => o.value === myStatus.value)?.label ?? '在线',
)
const statusIcon = computed(
  () => PRESENCE_OPTIONS.find((o) => o.value === myStatus.value)?.icon ?? CircleCheck,
)

async function onPresenceCommand(value: string) {
  if (value === myStatus.value) {
    return
  }
  try {
    await im.saveProfile({ presenceStatus: value })
  } catch {
    // 保存失败静默：状态仍以 myProfile 为准
  }
}

// 46 连接状态提示
const statusText = computed(
  () =>
    ({
      idle: '未连接',
      connecting: '连接中…',
      open: '已连接',
      closed: '连接已断开（请刷新重试）',
    })[im.status],
)

function onToggleTheme() {
  themeMode.value = cycleTheme()
}

// 浏览器标签页未读计数：(3) are-chat
watch(
  () => im.totalUnread,
  (count) => {
    document.title = count > 0 ? `(${count}) are-chat` : 'are-chat'
    // 42 favicon 未读角标（启用既有工具）
    updateFaviconBadge(count, accentColor(currentAccent()))
  },
)

// 登录用户名变化（重新登录）时重建 IM 连接
watch(
  () => auth.username,
  (name) => {
    if (name) {
      void im.init(name)
    }
  },
)

// 57 轮询全站在线人数
async function refreshOnlineCount() {
  if (!auth.isLoggedIn) {
    return
  }
  try {
    const data = await presenceApi.online()
    onlineCount.value = data.onlineCount
  } catch {
    // 静默：下次轮询再试
  }
}

// 58 多标签页登录态同步：其他标签页退出登录时本页自动跳回登录页
function onStorageChange(event: StorageEvent) {
  if (event.key === CURRENT_USER_LOCAL_KEY && !event.newValue && auth.isLoggedIn) {
    im.reset()
    auth.clearLocal()
    router.push('/login')
  }
}

// 45 点击桌面通知跳转会话
function onOpenPeer(event: Event) {
  const peer = (event as CustomEvent<string>).detail
  if (peer) {
    void router.push({ path: '/chat', query: { peer } })
  }
}

// 70 新消息浮动卡片：右上角滑入，5 秒自动消失，点击跳转会话
let toastSeq = 0
const toasts = ref<ToastItem[]>([])
const toastTimers = new Map<number, number>()

function onToastEvent(event: Event) {
  const detail = (event as CustomEvent<Omit<ToastItem, 'id'>>).detail
  if (!detail?.peer) {
    return
  }
  // 同一会话只保留最新一条
  const existing = toasts.value.find((t) => t.peer === detail.peer)
  if (existing) {
    existing.body = detail.body
    const timer = toastTimers.get(existing.id)
    if (timer) {
      clearTimeout(timer)
    }
    toastTimers.set(existing.id, window.setTimeout(() => dismissToast(existing.id), 5000))
    return
  }
  toastSeq += 1
  const item: ToastItem = { id: toastSeq, ...detail }
  toasts.value = [...toasts.value, item].slice(-3)
  toastTimers.set(item.id, window.setTimeout(() => dismissToast(item.id), 5000))
}

function dismissToast(id: number) {
  toasts.value = toasts.value.filter((t) => t.id !== id)
  const timer = toastTimers.get(id)
  if (timer) {
    clearTimeout(timer)
    toastTimers.delete(id)
  }
}

function onToastOpen(peer: string) {
  onOpenPeer(new CustomEvent('arechat:open-peer', { detail: peer }))
}

onMounted(() => {
  // 53 尽力刷新会话信息（登录时间等），失败不影响本地登录态
  void auth.verify()
  if (auth.isLoggedIn) {
    void im.init(auth.username)
    void refreshOnlineCount()
    onlineTimer = window.setInterval(() => refreshOnlineCount(), 60_000)
  }
  window.addEventListener('storage', onStorageChange)
  window.addEventListener('arechat:open-peer', onOpenPeer as EventListener)
  window.addEventListener('arechat:toast', onToastEvent as EventListener)
})

onUnmounted(() => {
  if (onlineTimer !== null) {
    clearInterval(onlineTimer)
  }
  for (const timer of toastTimers.values()) {
    clearTimeout(timer)
  }
  toastTimers.clear()
  window.removeEventListener('storage', onStorageChange)
  window.removeEventListener('arechat:open-peer', onOpenPeer as EventListener)
  window.removeEventListener('arechat:toast', onToastEvent as EventListener)
})

async function onLogout() {
  im.reset()
  await auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.shell {
  height: 100vh;
}
.rail {
  width: 60px;
  background: var(--im-rail, #1d222b);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 0;
  gap: 6px;
  flex-shrink: 0;
}
.logo {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: var(--xx-accent, #3370ff);
  color: #fff;
  font-size: 17px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  user-select: none;
}
.nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  align-items: center;
}
.nav-item {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: var(--im-rail-text, #9aa3b2);
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
}
.nav-item-btn {
  border: none;
  background: transparent;
  cursor: pointer;
}
.nav-item:hover {
  background: var(--im-rail-hover, rgba(255, 255, 255, 0.08));
  color: #fff;
}
.nav-item.active {
  background: var(--xx-accent, #3370ff);
  color: #fff;
}
.nav-badge {
  position: absolute;
  top: 1px;
  right: 1px;
}
.rail-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
/* 46 连接状态点 */
.ws-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #98a1b3;
}
.ws-dot.open {
  background: #34c77b;
}
.ws-dot.connecting {
  background: #e6a23c;
  animation: ws-blink 1s ease-in-out infinite;
}
.ws-dot.closed {
  background: #f56c6c;
}
@keyframes ws-blink {
  50% {
    opacity: 0.35;
  }
}
/* 57 在线人数 */
.online-count {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  color: var(--im-rail-text, #9aa3b2);
  font-size: 11px;
  user-select: none;
}
.rail-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--im-rail-text, #9aa3b2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.rail-btn:hover {
  background: var(--im-rail-hover, rgba(255, 255, 255, 0.08));
  color: #fff;
}
.me {
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  border-radius: 50%;
}
.me-name {
  color: var(--im-rail-text, #9aa3b2);
  font-size: 11px;
  max-width: 52px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}
.content {
  padding: 0;
  background: var(--im-bg, #f7f8fa);
  overflow: auto;
}
</style>

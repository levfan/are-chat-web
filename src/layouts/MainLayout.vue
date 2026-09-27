<template>
  <el-container class="shell">
    <aside class="rail">
      <!-- 99 顶部「我的」：头像 + 状态点 + 用户名，点击弹出聚合菜单（原 logo 位，个人中心/退出登录/状态切换收拢于此） -->
      <el-dropdown trigger="click" placement="right-start" class="me-dropdown" @command="onMeCommand">
        <button type="button" class="me-block" data-testid="me-menu" :title="`我的 · ${myStatusLabel}`">
          <span class="me-avatar-wrap">
            <ImAvatar :name="auth.username" :color="im.myProfile?.avatar ?? undefined" :size="36" :online="myStatus === 'online'" />
            <span v-if="myStatus !== 'online'" class="me-status" :class="`st-${myStatus}`" />
          </span>
          <span class="me-name" data-testid="current-user">{{ auth.username }}</span>
        </button>
        <template #dropdown>
          <el-dropdown-menu class="me-menu">
            <!-- 43 状态快切：从左下角按钮收拢进菜单，保留一键切换 -->
            <el-dropdown-item
              v-for="opt in PRESENCE_OPTIONS"
              :key="opt.value"
              :command="`status:${opt.value}`"
              :data-testid="`presence-${opt.value}`"
            >
              <el-icon :size="14"><component :is="opt.icon" /></el-icon>
              <span class="me-menu-label">{{ opt.label }}</span>
              <el-icon v-if="myStatus === opt.value" :size="14" class="me-menu-check"><Check /></el-icon>
            </el-dropdown-item>
            <el-dropdown-item divided command="profile" data-testid="me-profile">
              <el-icon :size="14"><User /></el-icon>
              <span class="me-menu-label">个人中心</span>
            </el-dropdown-item>
            <!-- 4 退出登录：低频危险操作收进菜单 + 二次确认，防误触 -->
            <el-dropdown-item divided command="logout" class="me-menu-danger" data-testid="me-logout">
              <el-icon :size="14"><SwitchButton /></el-icon>
              <span class="me-menu-label">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <nav class="nav">
        <el-tooltip content="消息" placement="right">
          <router-link to="/chat" class="nav-item" :class="{ active: route.path === '/chat' }">
            <el-icon :size="19"><ChatDotRound /></el-icon>
            <el-badge v-if="im.totalUnread > 0" :value="im.totalUnread" :max="99" class="nav-badge" />
          </router-link>
        </el-tooltip>
        <!-- 97 通讯录：联系人目录 + 添加好友/申请处理（原「好友」菜单已合并到这里） -->
        <el-tooltip content="通讯录" placement="right">
          <router-link to="/contacts" class="nav-item" :class="{ active: route.path === '/contacts' }" data-testid="nav-contacts">
            <el-icon :size="19"><Notebook /></el-icon>
            <el-badge
              v-if="im.incoming.length > 0"
              :value="im.incoming.length"
              :max="99"
              class="nav-badge"
              data-testid="nav-request-badge"
            />
          </router-link>
        </el-tooltip>
        <!-- 情侣空间：未建立时指引建立；收到的邀请显示数量红点 -->
        <el-tooltip :content="coupleTip" placement="right">
          <router-link to="/couple" class="nav-item" :class="{ active: route.path === '/couple' }" data-testid="nav-couple">
            <span class="nav-emoji">💕</span>
            <el-badge
              v-if="couple.incomingInvites.length > 0"
              :value="couple.incomingInvites.length"
              :max="9"
              class="nav-badge"
              data-testid="nav-couple-badge"
            />
          </router-link>
        </el-tooltip>
        <!-- 78/79 管理后台入口（仅管理员可见） -->
        <el-tooltip v-if="auth.isAdmin" :content="im.adminPending > 0 ? `管理后台（${im.adminPending} 条待审批）` : '管理后台'" placement="right">
          <router-link to="/admin" class="nav-item" :class="{ active: route.path === '/admin' }" data-testid="nav-admin">
            <el-icon :size="19"><Setting /></el-icon>
            <el-badge v-if="im.adminPending > 0" :value="im.adminPending" :max="99" class="nav-badge" data-testid="admin-pending-badge" />
          </router-link>
        </el-tooltip>
        <!-- 88 公告中心：铃铛 + 未读红点（原顶部横幅已移除，不再挤压内容区） -->
        <el-popover
          placement="right-start"
          :width="336"
          trigger="click"
          @show="announcePanelOpen = true"
          @hide="announcePanelOpen = false"
        >
          <template #reference>
            <button
              type="button"
              class="nav-item nav-item-btn"
              :class="{ active: announcePanelOpen }"
              data-testid="announcement-bell"
              title="公告"
            >
              <el-icon :size="19"><Bell /></el-icon>
              <span v-if="announcementUnread" class="bell-dot" data-testid="announcement-dot" />
            </button>
          </template>
          <div class="announce-panel" data-testid="announcement-panel">
            <div class="announce-panel-title">公告</div>
            <template v-if="announcement">
              <div class="announce-body" data-testid="announcement-content">{{ announcement.content }}</div>
              <div class="announce-meta">
                由 {{ announcement.createdBy || '管理员' }} 发布 · {{ formatTime(announcement.created) }}
              </div>
              <div class="announce-actions">
                <el-button
                  v-if="announcementUnread"
                  type="primary"
                  size="small"
                  data-testid="announcement-close"
                  @click="markAnnouncementRead"
                >
                  我知道了
                </el-button>
                <span v-else class="announce-done"><el-icon :size="13"><CircleCheck /></el-icon> 已读</span>
              </div>
            </template>
            <div v-else class="announce-empty">暂无公告</div>
          </div>
        </el-popover>
      </nav>
      <div class="rail-bottom">
        <!-- 46 连接状态点 -->
        <el-tooltip :content="statusText" placement="right">
          <span class="ws-dot" :class="im.status" data-testid="ws-status" />
        </el-tooltip>
        <!-- 57 在线人数：管理员看全站，普通用户看好友在线 -->
        <el-tooltip :content="onlineCountTip" placement="right">
          <span class="online-count" data-testid="online-count">
            <el-icon :size="12"><UserFilled /></el-icon>{{ onlineCount }}
          </span>
        </el-tooltip>
      </div>
    </aside>
    <el-main class="content">
      <router-view />
    </el-main>
  </el-container>
  <ProfileDialog v-model="profileVisible" />
  <!-- 70 新消息浮动卡片 -->
  <NewMessageToast :items="toasts" @open="onToastOpen" @close="dismissToast" />
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  AlarmClock,
  Bell,
  ChatDotRound,
  Check,
  CircleCheck,
  Clock,
  Notebook,
  Setting,
  SwitchButton,
  User,
  UserFilled,
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useImStore } from '@/stores/im'
import { useCoupleStore } from '@/stores/couple'
import { announcementApi, presenceApi } from '@/api/system'
import { accentColor, currentAccent } from '@/utils/settings'
import { updateFaviconBadge } from '@/utils/favicon'
import { formatTime } from '@/utils/format'
import { CURRENT_USER_LOCAL_KEY } from '@/constants'
import ImAvatar from '@/components/im/ImAvatar.vue'
import ProfileDialog from '@/components/im/ProfileDialog.vue'
import NewMessageToast from '@/components/im/NewMessageToast.vue'
import type { AnnouncementVO, ToastItem } from '@/types'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const im = useImStore()
const couple = useCoupleStore()

const profileVisible = ref(false)
const onlineCount = ref(0)
let onlineTimer: number | null = null

// 43 presence 快切（收拢进「我的」菜单）
const PRESENCE_OPTIONS = [
  { value: 'online', label: '在线', icon: CircleCheck },
  { value: 'busy', label: '忙碌', icon: AlarmClock },
  { value: 'away', label: '离开', icon: Clock },
] as const

const myStatus = computed(() => im.myProfile?.presenceStatus ?? 'online')
const myStatusLabel = computed(
  () => PRESENCE_OPTIONS.find((o) => o.value === myStatus.value)?.label ?? '在线',
)

// 57 在线人数：后端按角色下发（管理员=全站在线，普通用户=好友在线），这里只做提示文案
const onlineCountTip = computed(() => (auth.isAdmin ? '全站在线人数' : '好友在线人数'))
/** 情侣空间入口提示：有待处理邀请时给出数量 */
const coupleTip = computed(() =>
  couple.incomingInvites.length > 0
    ? `情侣空间（${couple.incomingInvites.length} 条待处理邀请）`
    : '情侣空间',
)

/** 「我的」菜单统一分发：状态快切 / 个人中心 / 退出登录 */
function onMeCommand(command: string | number | object) {
  const cmd = String(command)
  if (cmd.startsWith('status:')) {
    void onPresenceCommand(cmd.slice('status:'.length))
    return
  }
  if (cmd === 'profile') {
    profileVisible.value = true
    return
  }
  if (cmd === 'logout') {
    void confirmLogout()
  }
}

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
      void couple.init()
    } else {
      couple.reset()
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

// ---------- 88 全站公告：铃铛 + 公告中心弹层 ----------

const announcement = ref<AnnouncementVO | null>(null)
const announcePanelOpen = ref(false)
const announcementUnread = computed(() => !!announcement.value && !announcement.value.read)

async function loadAnnouncement() {
  if (!auth.isLoggedIn) {
    return
  }
  try {
    const current = await announcementApi.current()
    // 未读公告 → 铃铛亮红点；已读则只在弹层里可回看
    if (current) {
      announcement.value = current
    }
  } catch {
    // 静默
  }
}

/** 「我知道了」：服务端标记已读，红点随之消失 */
async function markAnnouncementRead() {
  if (!announcement.value) {
    return
  }
  try {
    await announcementApi.markRead(announcement.value.id)
    announcement.value = { ...announcement.value, read: true }
  } catch {
    // 静默：下次拉取仍会显示未读
  }
}

/** WS 推送的新公告：亮红点 + 右上角浮卡即时提醒一次 */
function onAnnouncementEvent(event: Event) {
  const detail = (event as CustomEvent<{ id: string; content: string }>).detail
  if (!detail) {
    return
  }
  announcement.value = { id: detail.id, content: detail.content, createdBy: '', created: Date.now(), read: false }
  ElNotification({
    title: '📢 全站公告',
    message: detail.content,
    duration: 10_000,
    position: 'top-right',
  })
  // 补拉一次，取发布人/时间等元信息
  void announcementApi
    .current()
    .then((current) => {
      if (current && current.id === detail.id) {
        announcement.value = current
      }
    })
    .catch(() => {})
}

// WS 重连成功后补拉公告：断线期间发布的公告不至于漏看
watch(
  () => im.status,
  (status) => {
    if (status === 'open' && auth.isLoggedIn) {
      void loadAnnouncement()
    }
  },
)

// ---------- 92 空闲自动离开 ----------

const IDLE_AWAY_MS = 5 * 60 * 1000
let idleTimer: number | null = null

function markActive() {
  if (!auth.isLoggedIn) {
    return
  }
  if (idleTimer !== null) {
    clearTimeout(idleTimer)
  }
  // 从「离开（自动）」恢复为在线：仅当当前是 away 才自动改回
  if ((im.myProfile?.presenceStatus ?? 'online') === 'away') {
    void im.saveProfile({ presenceStatus: 'online' }).catch(() => {})
  }
  idleTimer = window.setTimeout(() => {
    // 长时间无操作 → 自动离开
    if (auth.isLoggedIn && (im.myProfile?.presenceStatus ?? 'online') === 'online') {
      void im.saveProfile({ presenceStatus: 'away' }).catch(() => {})
    }
  }, IDLE_AWAY_MS)
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
    // 情侣空间：拉取总览（邀请红点）并绑定 WS 事件
    void couple.init()
    void refreshOnlineCount()
    onlineTimer = window.setInterval(() => refreshOnlineCount(), 60_000)
    // 78 管理员待办数量（非管理员静默 403）
    if (auth.isAdmin) {
      void im.refreshAdminPending()
    }
    // 88 拉取当前公告
    void loadAnnouncement()
    // 92 空闲检测启动
    markActive()
  }
  window.addEventListener('storage', onStorageChange)
  window.addEventListener('arechat:open-peer', onOpenPeer as EventListener)
  window.addEventListener('arechat:toast', onToastEvent as EventListener)
  // 88 WS 公告推送
  window.addEventListener('arechat:announcement', onAnnouncementEvent as EventListener)
  // 92 用户活动事件
  for (const evt of ['mousemove', 'keydown', 'click', 'touchstart']) {
    window.addEventListener(evt, onUserActivity, { passive: true })
  }
})

onUnmounted(() => {
  if (onlineTimer !== null) {
    clearInterval(onlineTimer)
  }
  if (idleTimer !== null) {
    clearTimeout(idleTimer)
  }
  for (const timer of toastTimers.values()) {
    clearTimeout(timer)
  }
  toastTimers.clear()
  window.removeEventListener('storage', onStorageChange)
  window.removeEventListener('arechat:open-peer', onOpenPeer as EventListener)
  window.removeEventListener('arechat:toast', onToastEvent as EventListener)
  window.removeEventListener('arechat:announcement', onAnnouncementEvent as EventListener)
  for (const evt of ['mousemove', 'keydown', 'click', 'touchstart']) {
    window.removeEventListener(evt, onUserActivity)
  }
})

/** 92 活动节流：1 分钟内重复活动不重置定时器 */
let lastActivity = 0
function onUserActivity() {
  const now = Date.now()
  if (now - lastActivity < 60_000) {
    return
  }
  lastActivity = now
  markActive()
}

/** 4 退出登录防误触：先弹确认框（展示账号名），确认后才真正退出 */
async function confirmLogout() {
  try {
    await ElMessageBox.confirm(`确定要退出账号「${auth.username}」吗？`, '退出登录', {
      confirmButtonText: '退出',
      cancelButtonText: '取消',
      type: 'warning',
    })
  } catch {
    return
  }
  im.reset()
  couple.reset()
  await auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.shell {
  height: 100vh;
  /* 手机浏览器地址栏收缩时跟随动态视口，避免底部被裁切 */
  height: 100dvh;
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
/* 99 顶部「我的」区块：替代原 logo 位，聚合状态/个人中心/退出登录 */
.me-dropdown {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
}
.me-block {
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border-radius: 10px;
  transition: background 0.15s;
}
.me-block:hover {
  background: var(--im-rail-hover, rgba(255, 255, 255, 0.08));
}
.me-avatar-wrap {
  position: relative;
  display: inline-flex;
}
.me-status {
  position: absolute;
  right: -1px;
  bottom: -1px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  border: 2px solid var(--im-rail, #1d222b);
}
.me-status.st-busy {
  background: #f56c6c;
}
.me-status.st-away {
  background: #e6a23c;
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
/* 情侣空间入口：无内置心形图标，用 emoji */
.nav-emoji {
  font-size: 18px;
  line-height: 1;
  user-select: none;
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
.me-name {
  color: var(--im-rail-text, #9aa3b2);
  font-size: 11px;
  max-width: 52px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}
/* 「我的」菜单内容排版 */
.me-menu-label {
  margin-left: 6px;
}
.me-menu-check {
  margin-left: auto;
  color: var(--el-color-success, #34c77b);
}
.me-menu-danger {
  color: var(--el-color-danger, #f56c6c) !important;
}
.content {
  padding: 0;
  background: var(--im-bg, #f7f8fa);
  overflow: auto;
  display: flex;
  flex-direction: column;
}
/* 88 公告铃铛未读点 */
.bell-dot {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f56c6c;
  box-shadow: 0 0 0 2px var(--im-rail, #1d222b);
}
/* 88 公告中心弹层（popover 内容由 body 挂载，但插槽内容带本组件作用域） */
.announce-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.announce-panel-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--im-text, #1f2329);
}
.announce-body {
  font-size: 13px;
  line-height: 1.7;
  color: var(--im-text, #1f2329);
  white-space: pre-wrap;
  word-break: break-word;
  background: var(--im-bg, #f7f8fa);
  border: 1px solid var(--im-border, #e6e8eb);
  border-radius: 8px;
  padding: 10px 12px;
}
.announce-meta {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.announce-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.announce-done {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.announce-empty {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
  text-align: center;
  padding: 8px 0;
}
</style>

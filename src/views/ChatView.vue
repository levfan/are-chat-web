<template>
  <div class="im-page" :class="{ 'peer-open': Boolean(im.activePeer) }">
    <!-- 左：会话列表 -->
    <aside class="conv-panel">
      <div class="conv-head">
        <span class="conv-title">消息</span>
        <el-badge v-if="im.totalUnread > 0" :value="im.totalUnread" :max="99" />
      </div>
      <el-input
        v-model="keyword"
        placeholder="搜索好友"
        clearable
        size="small"
        class="conv-search"
        :prefix-icon="Search"
      />
      <div class="conv-list" data-testid="conv-list">
        <div
          v-for="friend in filteredFriends"
          :key="friend.id"
          class="conv-item"
          :class="{ active: friend.username === im.activePeer }"
          :data-username="friend.username"
          data-testid="conv-item"
          @click="openConversation(friend.username)"
        >
          <ImAvatar
            :name="friend.username"
            :label="displayName(friend)"
            :online="friend.online"
            :size="40"
            :status="friend.status"
            halo
          />
          <div class="conv-main">
            <div class="conv-row">
              <span class="conv-name">{{ displayName(friend) }}</span>
              <el-icon v-if="friend.muted" :size="13" class="mute-ico" title="免打扰">
                <MuteNotification />
              </el-icon>
              <span class="conv-time">{{ formatChatTime(friend.lastMessage?.created) }}</span>
            </div>
            <div class="conv-row">
              <span class="conv-preview" :class="{ 'draft-preview': im.drafts[friend.username] }">
                {{ previewText(friend) }}
              </span>
              <el-badge
                v-if="friend.unread > 0"
                :value="friend.unread"
                :max="99"
                :type="friend.muted ? 'info' : 'danger'"
                class="unread"
                data-testid="unread-badge"
              />
            </div>
          </div>
        </div>
        <div v-if="filteredFriends.length === 0" class="conv-empty">
          <p>还没有好友</p>
          <el-button type="primary" size="small" @click="router.push('/contacts')">去通讯录添加</el-button>
        </div>
      </div>
    </aside>

    <!-- 右：聊天窗口 -->
    <section class="chat-panel">
      <template v-if="im.activePeer">
        <header class="chat-head">
          <!-- 手机端返回会话列表（桌面端由 CSS 隐藏） -->
          <button type="button" class="back-btn" data-testid="chat-back-btn" @click="closeMobileChat">
            <el-icon :size="18"><ArrowLeft /></el-icon>
          </button>
          <ImAvatar
            :name="im.activePeer"
            :label="displayPeerName"
            :online="im.activeFriend?.online"
            :size="36"
            :status="im.activeFriend?.status"
            halo
          />
          <div class="chat-title">
            <span
              class="chat-name"
              :title="displayPeerName"
              data-testid="chat-title"
            >{{ displayPeerName }}</span>
            <span class="chat-status" data-testid="peer-status">{{ peerStatusText }}</span>
          </div>

          <button type="button" class="head-btn" title="发送图片" data-testid="image-btn" @click="pickImage">
            <el-icon :size="17"><Picture /></el-icon>
          </button>
          <!-- 82 发送文件（任意类型，后端黑名单拦截可执行文件） -->
          <button type="button" class="head-btn" title="发送文件" data-testid="file-btn" @click="pickFile">
            <el-icon :size="17"><Paperclip /></el-icon>
          </button>
          <button type="button" class="head-btn" title="聊天记录搜索" data-testid="search-open-btn" @click="openSearch">
            <el-icon :size="17"><Search /></el-icon>
          </button>
          <el-dropdown trigger="click" @command="onMenuCommand">
            <button type="button" class="head-btn" data-testid="chat-menu-btn">
              <el-icon :size="17"><Setting /></el-icon>
            </button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="mute">
                  <el-icon><MuteNotification v-if="!im.activeFriend?.muted" /><Bell v-else /></el-icon>
                  {{ im.activeFriend?.muted ? '关闭免打扰' : '会话免打扰' }}
                </el-dropdown-item>
                <!-- 85 清空聊天记录 -->
                <el-dropdown-item command="clear-history">
                  <el-icon><Brush /></el-icon>清空聊天记录
                </el-dropdown-item>
                <el-dropdown-item command="block" divided>
                  <el-icon><CircleClose /></el-icon>{{ im.activeFriend?.blocked ? '解除拉黑' : '拉黑好友' }}
                </el-dropdown-item>
                <el-dropdown-item command="delete">
                  <el-icon><Delete /></el-icon>删除好友
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <input
            ref="imageInput"
            type="file"
            accept="image/*"
            hidden
            data-testid="image-input"
            @change="onImageChosen"
          />
          <input ref="fileInput" type="file" hidden data-testid="file-input" @change="onFileChosen" />
        </header>

        <!-- 84 会话内置顶消息横幅 -->
        <div v-if="im.pinned" class="pin-banner" data-testid="pin-banner">
          <el-icon :size="13"><TopRight /></el-icon>
          <span class="pin-text">置顶消息：{{ pinBrief }}</span>
          <el-button link size="small" type="primary" data-testid="pin-jump-btn" @click="jumpTo(im.pinned.msgId)">
            查看
          </el-button>
          <el-button link size="small" data-testid="pin-remove-btn" @click="onUnpinMessage">取消置顶</el-button>
        </div>

        <div
          ref="scrollBox"
          class="dm-area"
          data-testid="dm-area"
          @scroll="onScroll"
          @dragenter.prevent="onDragEnter"
          @dragover.prevent
          @dragleave.prevent="onDragLeave"
          @drop.prevent="onDrop"
        >
          <!-- 83 拖拽文件发送遮罩 -->
          <div v-if="dragOver" class="drop-overlay" data-testid="drop-overlay">
            <el-icon :size="34"><UploadFilled /></el-icon>
            <p>松开发送文件（图片走图片消息）</p>
          </div>
          <el-button
            v-if="canLoadMore"
            link
            size="small"
            class="load-more"
            :loading="loadingMore"
            @click="onLoadMore"
          >
            查看更早的消息
          </el-button>

          <template v-for="row in chatRows" :key="row.key">
            <div v-if="row.kind === 'sep'" class="day-sep" data-testid="day-sep">{{ row.label }}</div>
            <MessageBubble
              v-else
              :message="row.message"
              :self="row.message.fromUser === auth.username"
              :self-name="auth.username"
              :reply-target="replyTargetOf(row.message)"
              :highlight="highlightId === row.message.id"
              :pinned-msg-id="im.pinned?.msgId ?? null"
              @recall="onRecall"
              @reply="setReply"
              @retry="onRetry"
              @react="onReact"
              @forward="openForward"
              @edit="startEdit"
              @jump="jumpTo"
              @pin="onPinMessage"
              @unpin="onUnpinMessage"
            />
          </template>
        </div>

        <!-- 回到底部（35）：离开底部时显示，新消息计数 -->
        <transition name="fade">
          <button
            v-if="!atBottom"
            type="button"
            class="jump-btn"
            data-testid="jump-bottom-btn"
            @click="scrollToBottom(true)"
          >
            <el-icon :size="14"><Bottom /></el-icon>
            <span v-if="newBelow > 0" data-testid="new-below-count">{{ newBelow }} 条新消息</span>
          </button>
        </transition>

        <!-- 拉黑提示条（27） -->
        <div v-if="im.activeFriend?.blocked" class="block-banner" data-testid="block-banner">
          <span>你已拉黑该好友，解除后才能继续收发消息</span>
          <el-button link type="primary" size="small" data-testid="unblock-btn" @click="toggleBlock(false)">
            解除拉黑
          </el-button>
        </div>

        <!-- 聊天记录搜索浮层 -->
        <div v-if="searchVisible" class="search-layer" data-testid="search-layer">
          <div class="search-bar">
            <el-input
              ref="searchInput"
              v-model="searchKeyword"
              size="small"
              placeholder="在聊天记录中搜索"
              clearable
              data-testid="search-input"
              @keyup.enter="doSearch"
            />
            <el-button size="small" type="primary" data-testid="search-run-btn" @click="doSearch">搜索</el-button>
            <el-button size="small" data-testid="search-close-btn" @click="closeSearch">关闭</el-button>
          </div>
          <div class="search-results">
            <p v-if="searched && im.searchResults.length === 0" class="search-empty">没有找到相关消息</p>
            <div
              v-for="hit in im.searchResults"
              :key="hit.id"
              class="search-hit"
              data-testid="search-hit"
              @click="jumpToMessage(hit)"
            >
              <div class="hit-line">
                <span class="hit-from">{{ hit.fromUser === auth.username ? '我' : im.displayNameOf(hit.fromUser) }}</span>
                <span class="hit-time">{{ formatChatTime(hit.created) }}</span>
              </div>
              <span class="hit-content">
                <template v-for="(seg, index) in highlightSearch(hit)" :key="index">
                  <mark v-if="seg.hit" class="hit-mark">{{ seg.text }}</mark>
                  <template v-else>{{ seg.text }}</template>
                </template>
              </span>
            </div>
          </div>
        </div>

        <footer class="composer">
          <div v-if="replyTo" class="context-bar" data-testid="reply-bar">
            <span class="context-text">回复 {{ replyTo.fromUser === auth.username ? '我' : im.displayNameOf(replyTo.fromUser) }}：{{ replyBrief }}</span>
            <el-button link size="small" data-testid="reply-cancel-btn" @click="replyTo = null">
              <el-icon :size="13"><Close /></el-icon>
            </el-button>
          </div>
          <div v-if="editing" class="context-bar editing" data-testid="edit-bar">
            <span class="context-text">正在编辑：{{ editing.content }}</span>
            <el-button link size="small" data-testid="edit-cancel-btn" @click="cancelEdit">
              <el-icon :size="13"><Close /></el-icon>
            </el-button>
          </div>
          <div v-if="im.typingFrom" class="typing-hint" data-testid="typing-hint">
            {{ im.displayNameOf(im.typingFrom) }} 正在输入…
          </div>
          <div class="toolbar">
            <el-popover placement="top-start" :width="300" trigger="click">
              <template #reference>
                <button type="button" class="tool-btn" data-testid="emoji-btn" title="表情">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                    <circle cx="12" cy="12" r="9" />
                    <circle cx="9" cy="10" r="0.6" fill="currentColor" />
                    <circle cx="15" cy="10" r="0.6" fill="currentColor" />
                    <path d="M8.5 14.2c1 1.3 2.2 2 3.5 2s2.5-.7 3.5-2" />
                  </svg>
                </button>
              </template>
              <EmojiPicker @select="onPickEmoji" />
            </el-popover>
            <span class="tip">Enter 发送，Shift+Enter 换行，可粘贴/拖拽文件</span>
          </div>
          <el-input
            v-model="draft"
            type="textarea"
            :rows="2"
            resize="none"
            placeholder="输入消息"
            :disabled="Boolean(im.activeFriend?.blocked)"
            data-testid="dm-input"
            @keydown.enter="onEnter"
            @input="onTyping"
            @paste="onPaste"
          />
          <div class="composer-actions">
            <el-button
              type="primary"
              data-testid="dm-send-btn"
              :disabled="!draft.trim() || draft.length > 2000 || Boolean(im.activeFriend?.blocked)"
              @click="onSend"
            >
              {{ editing ? '保存' : '发送' }}
            </el-button>
          </div>
        </footer>
      </template>

      <div v-else class="chat-empty">
        <el-icon :size="46" class="empty-ico"><ChatDotRound /></el-icon>
        <p>选择一位好友开始聊天</p>
        <p class="empty-sub">还没有好友？去 <router-link to="/contacts">通讯录</router-link> 添加</p>
      </div>
    </section>

    <!-- 转发消息 -->
    <el-dialog v-model="forwardVisible" title="转发消息" width="360px" draggable>
      <div class="forward-body">
        <p class="forward-brief">{{ forwardBrief }}</p>
        <div class="forward-list">
          <label
            v-for="friend in forwardCandidates"
            :key="friend.id"
            class="forward-item"
            :class="{ picked: forwardChoice === friend.username }"
          >
            <ImAvatar :name="friend.username" :label="displayName(friend)" :size="30" />
            <span class="forward-name">{{ displayName(friend) }}</span>
            <el-radio v-model="forwardChoice" :value="friend.username" data-testid="forward-option">&nbsp;</el-radio>
          </label>
        </div>
      </div>
      <template #footer>
        <el-button @click="forwardVisible = false">取消</el-button>
        <el-button
          type="primary"
          :disabled="!forwardChoice"
          data-testid="forward-confirm-btn"
          @click="confirmForward"
        >
          发送
        </el-button>
      </template>
    </el-dialog>

    <!-- 95 附件图片预览灯箱 -->
    <ImageLightbox v-model="lightboxOpen" :src="lightboxUrl" />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { storeToRefs } from 'pinia'
import {
  ArrowLeft,
  Bell,
  Bottom,
  Brush,
  ChatDotRound,
  CircleClose,
  Close,
  Delete,
  FolderOpened,
  MuteNotification,
  Paperclip,
  Picture,
  Search,
  Setting,
  TopRight,
  UploadFilled,
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { messagePreviewText, useImStore } from '@/stores/im'
import { messageApi } from '@/api/im'
import { currentSendKey } from '@/utils/settings'
import { detectEffect, detectEggCommand, floatHearts, playEffect } from '@/utils/effects'
import { formatChatTime, formatDayLabel, formatLastSeen, highlightSegments } from '@/utils/imFormat'
import type { HighlightSegment } from '@/utils/imFormat'
import ImAvatar from '@/components/im/ImAvatar.vue'
import EmojiPicker from '@/components/im/EmojiPicker.vue'
import MessageBubble from '@/components/im/MessageBubble.vue'
import ImageLightbox from '@/components/im/ImageLightbox.vue'
import type { ImMessage } from '@/types'

const auth = useAuthStore()
const im = useImStore()
const route = useRoute()
const router = useRouter()
const { status } = storeToRefs(im)

const keyword = ref('')
const draft = ref('')
const loadingMore = ref(false)
const scrollBox = ref<HTMLElement | null>(null)
const replyTo = ref<ImMessage | null>(null)
const editing = ref<ImMessage | null>(null)
const imageInput = ref<HTMLInputElement | null>(null)
// 82 文件发送
const fileInput = ref<HTMLInputElement | null>(null)
// 83 拖拽发送
const dragOver = ref(false)
// 95 附件面板
const lightboxOpen = ref(false)
const lightboxUrl = ref('')

const searchVisible = ref(false)
const searchKeyword = ref('')
const searched = ref(false)
const searchInput = ref<{ focus: () => void } | null>(null)

// 35 回到底部：离开底部时显示悬浮按钮并累计新消息
const atBottom = ref(true)
const newBelow = ref(0)
// 36 搜索命中跳转高亮
const highlightId = ref('')

// 33 转发
const forwardVisible = ref(false)
const forwardChoice = ref('')
const forwardFrom = ref<ImMessage | null>(null)

const filteredFriends = computed(() => {
  const kw = keyword.value.trim()
  if (!kw) {
    return im.friends
  }
  return im.friends.filter(
    (f) => f.username.includes(kw) || f.remark.includes(kw) || (f.nickname ?? '').includes(kw),
  )
})

/** 展示名：备注 > 昵称 > 用户名 */
function displayName(friend: { username: string; nickname?: string | null; remark: string }) {
  return friend.remark || friend.nickname || friend.username
}

const displayPeerName = computed(() => {
  if (!im.activeFriend) {
    return im.activePeer
  }
  return im.activeFriend.remark || im.activeFriend.nickname || im.activeFriend.username
})

// ---------- 对方状态行 ----------

const peerStatusText = computed(() => {
  const friend = im.activeFriend
  if (friend?.online) {
    if (friend.status === 'busy') {
      return '忙碌'
    }
    if (friend.status === 'away') {
      return '离开'
    }
    return '在线'
  }
  return formatLastSeen(friend?.lastSeenAt, false)
})

function previewText(friend: (typeof im.friends)[number]) {
  // 31 会话草稿：优先显示草稿
  const d = im.drafts[friend.username]
  if (d) {
    return `草稿：${d}`
  }
  const last = friend.lastMessage
  if (!last) {
    return '暂无消息'
  }
  // 72/73 名片与位置卡片、图片、拍一拍统一走预览文案
  const text = messagePreviewText(last.msgType, last.content)
  if (last.msgType === 'poke') {
    // 拍一拍预览带对方展示名（备注优先）
    return last.fromMe ? `你${text}` : `${displayName(friend)} ${text}`
  }
  return last.fromMe && last.msgType === 'image' ? `[图片] ${text}` : text
}

// ---------- 时间分隔线 ----------

type ChatRow = { kind: 'sep'; key: string; label: string } | { kind: 'msg'; key: string; message: ImMessage }

const chatRows = computed<ChatRow[]>(() => {
  const rows: ChatRow[] = []
  let lastDay = ''
  for (const message of im.activeMessages) {
    const day = formatDayLabel(message.created)
    if (day !== lastDay) {
      rows.push({ kind: 'sep', key: `sep-${day}`, label: day })
      lastDay = day
    }
    rows.push({ kind: 'msg', key: message.id, message })
  }
  return rows
})

function replyTargetOf(message: ImMessage): ImMessage | null {
  if (!message.replyToId) {
    return null
  }
  return im.activeMessages.find((m) => m.id === message.replyToId) ?? null
}

// ---------- 会话操作 ----------

const canLoadMore = computed(() => im.activeMessages.length >= 20)

async function openConversation(peer: string) {
  await im.openConversation(peer)
  replyTo.value = null
  editing.value = null
  // 恢复该会话草稿（31）
  draft.value = im.drafts[peer] ?? ''
  atBottom.value = true
  newBelow.value = 0
  scrollToBottom()
}

/** 手机端：从聊天窗返回会话列表（桌面端按钮不可见） */
function closeMobileChat() {
  im.activePeer = ''
}

async function onLoadMore() {
  loadingMore.value = true
  try {
    await im.loadMoreHistory()
  } finally {
    loadingMore.value = false
  }
}

// ---------- 滚动：回到底部按钮（35） ----------

function onScroll() {
  const box = scrollBox.value
  if (!box) {
    return
  }
  const distance = box.scrollHeight - box.scrollTop - box.clientHeight
  const bottom = distance < 48
  atBottom.value = bottom
  if (bottom) {
    newBelow.value = 0
  }
}

function scrollToBottom(force = false) {
  void nextTick(() => {
    if (!scrollBox.value) {
      return
    }
    scrollBox.value.scrollTo({ top: scrollBox.value.scrollHeight })
    if (force) {
      atBottom.value = true
      newBelow.value = 0
    }
  })
}

watch(
  () => im.activeMessages.length,
  () => {
    const last = im.activeMessages[im.activeMessages.length - 1]
    // 自己发的消息总是滚到底；别人在我不在底部时发消息 → 计数
    if (last && last.fromUser === auth.username) {
      scrollToBottom(true)
    } else if (atBottom.value) {
      scrollToBottom()
    } else {
      newBelow.value += 1
    }
  },
)

// ---------- 搜索命中跳转（36）+ 引用定位（48） ----------

function jumpToMessage(hit: ImMessage) {
  jumpTo(hit.id)
}

/** 定位并高亮某条消息（搜索命中与引用块点击共用） */
function jumpTo(msgId: string) {
  const target = im.activeMessages.find((m) => m.id === msgId)
  if (!target) {
    ElMessage.warning('该消息不在已加载的记录中')
    return
  }
  searchVisible.value = false
  void nextTick(() => {
    const el = scrollBox.value?.querySelector(`[data-message-id="${msgId}"]`)
    if (el) {
      el.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  })
  highlightId.value = msgId
  window.setTimeout(() => {
    if (highlightId.value === msgId) {
      highlightId.value = ''
    }
  }, 1800)
}

/** 61 搜索结果关键词高亮分段 */
function highlightSearch(hit: ImMessage): HighlightSegment[] {
  const text = hit.msgType === 'image' ? '[图片]' : hit.status === 'RECALLED' ? '[已撤回]' : hit.content
  return highlightSegments(text, searched.value ? searchKeyword.value : '')
}

// ---------- 发送 ----------

function onPickEmoji(emoji: string) {
  draft.value += emoji
}

function onEnter(event: Event) {
  if (event instanceof KeyboardEvent) {
    // 52 发送快捷键策略：ctrl-enter 模式下 Enter 换行、Ctrl/Cmd+Enter 发送
    if (currentSendKey() === 'ctrl-enter') {
      if (!event.ctrlKey && !event.metaKey) {
        return
      }
    } else if (event.shiftKey) {
      return
    }
  }
  event.preventDefault()
  onSend()
}

let typingSent = false
function onTyping() {
  if (!typingSent && draft.value) {
    im.sendTyping(im.activePeer, true)
    typingSent = true
    window.setTimeout(() => {
      typingSent = false
    }, 2500)
  }
}

async function onSend() {
  const content = draft.value.trim()
  if (!content || !im.activePeer) {
    return
  }
  // 26 编辑模式：保存修改而不是发新消息
  if (editing.value) {
    try {
      await im.editMessage(editing.value.id, content)
      editing.value = null
      draft.value = ''
    } catch (e) {
      ElMessage.error(e instanceof Error ? e.message : '编辑失败')
    }
    return
  }
  try {
    // 91 消息彩蛋指令：整条消息命中 /抱抱 这类暗号时，发送彩蛋文案并放全屏特效
    const egg = detectEggCommand(content)
    const outgoing = egg ? egg.reply : content
    await im.sendText(im.activePeer, outgoing, { replyToId: replyTo.value?.id ?? null })
    draft.value = ''
    replyTo.value = null
    im.sendTyping(im.activePeer, false)
    if (egg) {
      playEffect(egg.kind)
    }
    // 66 关键词特效：生日快乐 / 新年快乐 / 下雪 / 爱你…
    const effect = detectEffect(outgoing)
    if (effect) {
      playEffect(effect)
    }
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '发送失败')
  }
}

function setReply(message: ImMessage) {
  replyTo.value = message
  editing.value = null
}

/** 26 进入编辑：内容回填输入框 */
function startEdit(message: ImMessage) {
  editing.value = message
  replyTo.value = null
  draft.value = message.content
}

function cancelEdit() {
  editing.value = null
  draft.value = ''
}

const replyBrief = computed(() => {
  if (!replyTo.value) {
    return ''
  }
  return replyTo.value.msgType === 'image' ? '[图片]' : replyTo.value.content
})

function pickImage() {
  imageInput.value?.click()
}

async function onImageChosen() {
  const file = imageInput.value?.files?.[0]
  if (file && im.activePeer) {
    await submitImage(file)
  }
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

/** 粘贴图片直接发送（剪贴板里的 image 文件）；83 粘贴普通文件走文件消息 */
function onPaste(event: ClipboardEvent) {
  const file = Array.from(event.clipboardData?.files ?? [])[0]
  if (file && im.activePeer) {
    event.preventDefault()
    if (file.type.startsWith('image/')) {
      void submitImage(file)
    } else {
      void submitFile(file)
    }
  }
}

async function submitImage(file: File) {
  if (!im.activePeer) {
    return
  }
  try {
    await im.sendImage(im.activePeer, file)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '图片发送失败')
  }
}

// ---------- 82 文件消息 ----------

function pickFile() {
  fileInput.value?.click()
}

async function onFileChosen() {
  const file = fileInput.value?.files?.[0]
  if (file && im.activePeer) {
    await submitFile(file)
  }
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

async function submitFile(file: File) {
  if (!im.activePeer) {
    return
  }
  if (file.size > 50 * 1024 * 1024) {
    ElMessage.warning('文件不能超过 50MB')
    return
  }
  try {
    await im.sendFile(im.activePeer, file)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '文件发送失败')
  }
}

// ---------- 83 拖拽文件发送 ----------

let dragDepth = 0

function onDragEnter() {
  dragDepth += 1
  dragOver.value = true
}

function onDragLeave() {
  dragDepth = Math.max(0, dragDepth - 1)
  if (dragDepth === 0) {
    dragOver.value = false
  }
}

async function onDrop(event: DragEvent) {
  dragDepth = 0
  dragOver.value = false
  const files = Array.from(event.dataTransfer?.files ?? [])
  if (files.length === 0 || !im.activePeer) {
    return
  }
  for (const file of files.slice(0, 5)) {
    if (file.type.startsWith('image/')) {
      await submitImage(file)
    } else {
      await submitFile(file)
    }
  }
}

function openImage(url: string) {
  lightboxUrl.value = url
  lightboxOpen.value = true
}

async function onRetry(localId: string) {
  try {
    await im.retryMessage(localId)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '重试失败')
  }
}

/** 96 撤回后回填输入框：文本消息撤回时把原文放回输入框，方便改了重发 */
async function onRecall(msgId: string) {
  const target = im.activeMessages.find((m) => m.id === msgId)
  try {
    await im.recallMessage(msgId)
    if (target && target.msgType === 'text' && target.content) {
      draft.value = draft.value ? `${draft.value}\n${target.content}` : target.content
      ElMessage.success('已撤回，原文已填回输入框，改一改再发吧')
    }
  } catch (e) {
    ElMessage.warning(e instanceof Error ? e.message : '撤回失败')
  }
}

// ---------- 84 会话内置顶 ----------

const pinBrief = computed(() => {
  const msg = im.activeMessages.find((m) => m.id === im.pinned?.msgId)
  if (msg) {
    return messagePreviewText(msg.msgType, msg.content)
  }
  return '该消息不在当前记录中'
})

async function onPinMessage(message: ImMessage) {
  try {
    await im.pinMessage(im.activePeer, message.id)
    ElMessage.success('已置顶该消息')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '置顶失败')
  }
}

async function onUnpinMessage() {
  try {
    await im.unpinConversation(im.activePeer)
    ElMessage.success('已取消置顶')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '操作失败')
  }
}

// ---------- 85 清空聊天记录 ----------

async function clearHistory() {
  const friend = im.activeFriend
  if (!friend || !im.activePeer) {
    return
  }
  try {
    await ElMessageBox.confirm(
      '将清空你们双方的聊天记录（含置顶），且不可恢复。确定继续？',
      '清空聊天记录',
      { confirmButtonText: '清空', cancelButtonText: '取消', type: 'warning' },
    )
  } catch {
    return
  }
  try {
    const deleted = await im.clearConversation(friend.username)
    ElMessage.success(`已清空 ${deleted} 条消息`)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '清空失败')
  }
}

// ---------- 回应 / 转发 ----------

async function onReact(emoji: string, message: ImMessage) {
  try {
    // 65 飘心：回应动画从该条消息的气泡上飘出
    const anchor = document.querySelector(`[data-message-id="${message.id}"] .bubble`)
    floatHearts(anchor, emoji)
    await im.toggleReaction(message.id, emoji)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '回应失败')
  }
}

const forwardCandidates = computed(() => im.friends.filter((f) => f.username !== im.activePeer))

const forwardBrief = computed(() => {
  const m = forwardFrom.value
  if (!m) {
    return ''
  }
  return m.msgType === 'image' ? '[图片]' : m.content
})

function openForward(message: ImMessage) {
  forwardFrom.value = message
  forwardChoice.value = ''
  forwardVisible.value = true
}

async function confirmForward() {
  const message = forwardFrom.value
  if (!message || !forwardChoice.value) {
    return
  }
  try {
    await im.forwardMessage(forwardChoice.value, message)
    forwardVisible.value = false
    const target = im.friends.find((f) => f.username === forwardChoice.value)
    ElMessage.success(`已转发给 ${target ? displayName(target) : forwardChoice.value}`)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '转发失败')
  }
}

// ---------- 拉黑 ----------

async function toggleBlock(blocked: boolean) {
  const friend = im.activeFriend
  if (!friend) {
    return
  }
  try {
    if (blocked) {
      await ElMessageBox.confirm(`拉黑 ${displayName(friend)} 后，双方都无法发送消息`, '拉黑好友', { type: 'warning' })
    }
    await im.updateFriend(friend.id, { blocked })
    ElMessage.success(blocked ? '已拉黑' : '已解除拉黑')
  } catch {
    // 用户取消
  }
}

// ---------- 聊天记录搜索 ----------

function openSearch() {
  searchVisible.value = true
  im.clearSearch()
  searched.value = false
}

function closeSearch() {
  searchVisible.value = false
  im.clearSearch()
}

async function doSearch() {
  const kw = searchKeyword.value.trim()
  if (!kw || !im.activePeer) {
    return
  }
  try {
    await im.searchMessages(im.activePeer, kw)
    searched.value = true
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '搜索失败')
  }
}

// ---------- 聊天窗菜单 ----------

async function onMenuCommand(command: string) {
  const friend = im.activeFriend
  if (!friend) {
    return
  }
  // 27 拉黑/解除拉黑（此前菜单缺分支，点击无响应）
  if (command === 'block') {
    await toggleBlock(!friend.blocked)
    return
  }
  // 85 清空聊天记录
  if (command === 'clear-history') {
    await clearHistory()
    return
  }
  if (command === 'mute') {
    await im.updateFriend(friend.id, { muted: !friend.muted })
    ElMessage.success(friend.muted ? '已关闭免打扰' : '已开启免打扰')
    return
  }
  if (command === 'delete') {
    try {
      await ElMessageBox.confirm(`删除好友 ${displayName(friend)}？`, '删除好友', { type: 'warning' })
      await im.removeFriend(friend.id)
      ElMessage.success('已删除')
    } catch {
      // 用户取消
    }
  }
}

// ---------- 65 对方回应的飘心 ----------

function onPeerReaction(event: Event) {
  const detail = (event as CustomEvent<{ msgId: string; emoji: string; by: string }>).detail
  if (!detail) {
    return
  }
  const anchor = document.querySelector(`[data-message-id="${detail.msgId}"] .bubble`)
  if (anchor) {
    floatHearts(anchor, detail.emoji)
  }
}

// ---------- 60 键盘快捷键：Esc 关闭浮层/取消状态，Ctrl+F 会话内搜索 ----------

function onGlobalKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    if (searchVisible.value) {
      closeSearch()
      return
    }
    if (editing.value) {
      cancelEdit()
      return
    }
    if (replyTo.value) {
      replyTo.value = null
    }
    return
  }
  if ((event.ctrlKey || event.metaKey) && (event.key === 'f' || event.key === 'F')) {
    // 仅在聊天窗激活时接管 Ctrl+F
    if (im.activePeer) {
      event.preventDefault()
      searchVisible.value = true
      im.clearSearch()
      searched.value = false
      void nextTick(() => searchInput.value?.focus())
    }
  }
}

watch(
  () => status.value,
  (value) => {
    if (value === 'closed') {
      ElMessage.warning('连接已断开，请刷新重试')
    }
  },
)

onMounted(async () => {
  window.addEventListener('keydown', onGlobalKeydown)
  // 65 对方给我回应时飘心
  window.addEventListener('arechat:reaction', onPeerReaction as EventListener)
  await im.init(auth.username)
  const peer = typeof route.query.peer === 'string' ? route.query.peer : ''
  if (peer && im.friends.some((f) => f.username === peer)) {
    await openConversation(peer)
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', onGlobalKeydown)
  window.removeEventListener('arechat:reaction', onPeerReaction as EventListener)
})
</script>

<style scoped>
.im-page {
  display: flex;
  height: 100vh;
  /* 手机浏览器动态视口（dvh），地址栏收起时不留空隙 */
  height: 100dvh;
  background: var(--im-bg, #f7f8fa);
}
/* ---- 左：会话列表 ---- */
.conv-panel {
  width: 288px;
  background: var(--im-panel, #fff);
  border-right: 1px solid var(--im-border, #e6e8eb);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}
.conv-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 10px;
}
.conv-title {
  font-size: 16px;
  font-weight: 600;
}
.conv-search {
  margin: 0 12px 8px;
}
.conv-list {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 8px;
}
.conv-item {
  display: flex;
  gap: 10px;
  padding: 10px 14px;
  cursor: pointer;
  align-items: center;
  border-left: 2px solid transparent;
  transition: background 0.12s ease;
}
.conv-item:hover {
  background: var(--im-hover, #f2f3f5);
}
.conv-item.active {
  background: var(--im-active, #eef3fe);
  border-left-color: var(--xx-accent, #0ea5e9);
}
.conv-main {
  flex: 1;
  min-width: 0;
}
.conv-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}
.conv-row + .conv-row {
  margin-top: 3px;
}
.conv-name {
  font-size: 14px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mute-ico {
  color: var(--im-faint, #b9bec7);
  flex-shrink: 0;
}
.conv-time {
  font-size: 11px;
  color: var(--im-faint, #b9bec7);
  flex-shrink: 0;
}
.conv-preview {
  flex: 1;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.unread {
  flex-shrink: 0;
}
.conv-empty {
  text-align: center;
  color: var(--im-muted, #8f959e);
  font-size: 13px;
  padding-top: 60px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}
/* ---- 右：聊天窗口 ---- */
.chat-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  position: relative;
}
.chat-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: var(--im-panel, #fff);
  border-bottom: 1px solid var(--im-border, #e6e8eb);
}
.chat-title {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}
.chat-name {
  font-size: 15px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.chat-status {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.head-btn {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 7px;
  background: transparent;
  color: var(--im-text-2, #51565f);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.12s ease, color 0.12s ease;
}
.head-btn:hover {
  background: var(--im-hover, #f2f3f5);
  color: var(--xx-accent, #0ea5e9);
}
.dm-area {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: var(--im-bg, #f7f8fa);
}
.day-sep {
  align-self: center;
  font-size: 11px;
  color: var(--im-muted, #8f959e);
  background: var(--im-center-bg, rgba(0, 0, 0, 0.05));
  padding: 2px 12px;
  border-radius: 10px;
}
.load-more {
  align-self: center;
  color: var(--im-muted, #8f959e);
}
/* ---- 84 置顶横幅 ---- */
.pin-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  background: var(--im-panel, #fff);
  border-bottom: 1px solid var(--im-border, #e6e8eb);
  font-size: 12px;
  color: var(--im-text-2, #51565f);
}
.pin-banner .el-icon {
  color: var(--xx-accent, #0ea5e9);
  flex-shrink: 0;
}
.pin-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* ---- 83 拖拽遮罩 ---- */
.drop-overlay {
  position: absolute;
  inset: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 2px dashed var(--xx-accent, #0ea5e9);
  border-radius: 12px;
  background: color-mix(in srgb, var(--xx-accent, #0ea5e9) 8%, transparent);
  color: var(--xx-accent, #0ea5e9);
  font-size: 14px;
  z-index: 15;
  pointer-events: none;
}
/* ---- 搜索浮层 ---- */
.search-layer {
  position: absolute;
  top: 58px;
  right: 18px;
  width: 380px;
  max-height: 60%;
  display: flex;
  flex-direction: column;
  background: var(--im-panel, #fff);
  border: 1px solid var(--im-border, #e6e8eb);
  border-radius: 10px;
  box-shadow: var(--im-shadow, 0 8px 30px rgba(0, 0, 0, 0.08));
  z-index: 20;
  overflow: hidden;
}
.search-bar {
  display: flex;
  gap: 6px;
  padding: 10px;
  border-bottom: 1px solid var(--im-border, #e6e8eb);
}
.search-bar .el-input {
  flex: 1;
}
.search-results {
  overflow-y: auto;
  padding: 6px 10px 10px;
}
.search-empty {
  text-align: center;
  color: var(--im-muted, #8f959e);
  font-size: 12px;
  padding: 16px 0;
}
.search-hit {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 8px 8px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
}
.search-hit:hover {
  background: var(--im-hover, #f2f3f5);
}
.hit-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.hit-from {
  font-size: 12px;
  color: var(--xx-accent, #0ea5e9);
  font-weight: 500;
}
.hit-content {
  color: var(--im-text-2, #51565f);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.hit-time {
  font-size: 11px;
  color: var(--im-faint, #b9bec7);
}
/* ---- 输入区 ---- */
.composer {
  background: var(--im-panel, #fff);
  border-top: 1px solid var(--im-border, #e6e8eb);
  padding: 8px 18px 12px;
}
.reply-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  background: var(--im-quote-bg, rgba(51, 112, 255, 0.06));
  border-left: 3px solid var(--xx-accent, #0ea5e9);
  border-radius: 6px;
  padding: 4px 10px;
  margin-bottom: 6px;
  font-size: 12px;
  color: var(--im-text-2, #51565f);
}
.reply-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.typing-hint {
  font-size: 12px;
  color: var(--el-color-success, #67c23a);
  margin-bottom: 4px;
}
.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.tool-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--im-muted, #8f959e);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.12s ease, color 0.12s ease;
}
.tool-btn:hover {
  background: var(--im-hover, #f2f3f5);
  color: var(--xx-accent, #0ea5e9);
}
/* F90 贴贴按钮里的小表情 */
.sticker-face {
  font-size: 16px;
  line-height: 1;
}
.tip {
  font-size: 11px;
  color: var(--im-faint, #b9bec7);
}
.composer-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  margin-top: 6px;
}
/* 61 搜索命中关键词 */
.hit-mark {
  background: var(--xx-accent-soft, rgba(51, 112, 255, 0.18));
  color: inherit;
  border-radius: 2px;
  padding: 0 1px;
}
/* ---- 空态 ---- */
.chat-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--im-muted, #8f959e);
  gap: 8px;
}
.empty-ico {
  color: var(--im-faint, #b9bec7);
}
.empty-sub {
  font-size: 13px;
}
.empty-sub a {
  color: var(--xx-accent, #0ea5e9);
  text-decoration: none;
}
.empty-sub a:hover {
  text-decoration: underline;
}
/* ============ 手机端适配（≤768px：单面板布局） ============ */
/* 返回按钮：桌面隐藏，触屏窄屏显示 */
.back-btn {
  display: none;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 7px;
  background: transparent;
  color: var(--im-text-2, #51565f);
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}
.back-btn:hover {
  background: var(--im-hover, #f2f3f5);
  color: var(--xx-accent, #0ea5e9);
}
@media (max-width: 768px) {
  /* 未选会话：只显示会话列表；选中后：只显示聊天窗 */
  .conv-panel {
    width: 100%;
    border-right: none;
  }
  .im-page.peer-open .conv-panel {
    display: none;
  }
  .im-page:not(.peer-open) .chat-panel {
    display: none;
  }
  .back-btn {
    display: flex;
  }
  .conv-head {
    padding: 12px 14px 8px;
  }
  .chat-head {
    padding: 8px 10px;
    gap: 7px;
  }
  .head-btn {
    width: 27px;
    height: 27px;
  }
  .dm-area {
    padding: 10px 12px;
    gap: 10px;
  }
  .composer {
    padding: 6px 10px 10px;
  }
  .toolbar {
    margin-bottom: 2px;
  }
  /* 键盘操作提示在手机上无意义，隐藏后工具行更紧凑 */
  .tip {
    display: none;
  }
  /* 聊天记录搜索浮层改为通栏 */
  .search-layer {
    top: 54px;
    left: 10px;
    right: 10px;
    width: auto;
  }
}
</style>

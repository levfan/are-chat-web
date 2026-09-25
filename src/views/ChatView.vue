<template>
  <div class="im-page">
    <!-- 左：会话列表 -->
    <aside class="conv-panel">
      <div class="conv-head">
        <span class="conv-title">消息</span>
        <el-badge v-if="im.totalUnread > 0" :value="im.totalUnread" :max="99" />
      </div>
      <!-- 44 分组筛选 + 50 只看未读/全部已读 -->
      <div class="conv-filters" data-testid="conv-filters">
        <button
          type="button"
          class="filter-chip"
          :class="{ active: activeTag === '' && !onlyUnread }"
          data-testid="filter-all"
          @click="selectFilter('')"
        >
          全部
        </button>
        <button
          type="button"
          class="filter-chip"
          :class="{ active: onlyUnread }"
          data-testid="filter-unread"
          @click="toggleUnreadFilter"
        >
          只看未读{{ unreadFriendsCount > 0 ? ` ${unreadFriendsCount}` : '' }}
        </button>
        <button
          v-for="tag in tagOptions"
          :key="tag"
          type="button"
          class="filter-chip"
          :class="{ active: activeTag === tag }"
          data-testid="filter-tag"
          @click="selectFilter(tag)"
        >
          {{ tag }}
        </button>
        <el-button
          v-if="unreadFriendsCount > 0"
          link
          type="primary"
          size="small"
          class="read-all"
          data-testid="mark-all-read"
          @click="onMarkAllRead"
        >
          全部已读
        </el-button>
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
          <ImAvatar :name="friend.username" :online="friend.online" :size="40" :status="friend.status" halo />
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
          <el-button type="primary" size="small" @click="router.push('/friends')">去添加好友</el-button>
        </div>
      </div>
    </aside>

    <!-- 右：聊天窗口 -->
    <section class="chat-panel">
      <template v-if="im.activePeer">
        <header class="chat-head">
          <ImAvatar :name="im.activePeer" :online="im.activeFriend?.online" :size="36" :status="im.activeFriend?.status" halo />
          <div class="chat-title">
            <span class="chat-name" data-testid="chat-title">{{ displayPeerName }}</span>
            <span class="chat-status" data-testid="peer-status">{{ peerStatusText }}</span>
          </div>

          <button type="button" class="head-btn" title="发送图片" data-testid="image-btn" @click="pickImage">
            <el-icon :size="17"><Picture /></el-icon>
          </button>
          <button type="button" class="head-btn" title="拍一拍" data-testid="poke-btn" @click="onPoke">
            <el-icon :size="17"><Pointer /></el-icon>
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
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>资料卡
                </el-dropdown-item>
                <el-dropdown-item command="mute">
                  <el-icon><MuteNotification v-if="!im.activeFriend?.muted" /><Bell v-else /></el-icon>
                  {{ im.activeFriend?.muted ? '关闭免打扰' : '会话免打扰' }}
                </el-dropdown-item>
                <el-dropdown-item command="pin">{{ im.activeFriend?.pinned ? '取消置顶' : '置顶会话' }}</el-dropdown-item>
                <el-dropdown-item command="remark">
                  <el-icon><EditPen /></el-icon>设置备注
                </el-dropdown-item>
                <el-dropdown-item command="stars">
                  <el-icon><Collection /></el-icon>收藏夹
                </el-dropdown-item>
                <el-dropdown-item command="export">
                  <el-icon><Download /></el-icon>导出聊天记录
                </el-dropdown-item>
                <el-dropdown-item command="export-json">
                  <el-icon><Document /></el-icon>导出 JSON（56）
                </el-dropdown-item>
                <el-dropdown-item command="share-card" divided>
                  <el-icon><Postcard /></el-icon>分享好友名片（72）
                </el-dropdown-item>
                <el-dropdown-item command="share-location">
                  <el-icon><LocationInformation /></el-icon>分享位置（73）
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
        </header>

        <div ref="scrollBox" class="dm-area" :class="`chat-bg-${chatBg}`" data-testid="dm-area" @scroll="onScroll">
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
              @recall="onRecall"
              @reply="setReply"
              @retry="onRetry"
              @react="onReact"
              @forward="openForward"
              @edit="startEdit"
              @star="onStar"
              @jump="jumpTo"
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
                <span class="hit-from">{{ hit.fromUser === auth.username ? '我' : hit.fromUser }}</span>
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
            <span class="context-text">回复 {{ replyTo.fromUser === auth.username ? '我' : replyTo.fromUser }}：{{ replyBrief }}</span>
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
            {{ im.typingFrom }} 正在输入…
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
            <el-popover placement="top-start" :width="220" trigger="click">
              <template #reference>
                <button type="button" class="tool-btn" title="快捷短语" data-testid="phrase-btn">
                  <el-icon :size="17"><Memo /></el-icon>
                </button>
              </template>
              <div class="phrase-list">
                <button
                  v-for="phrase in QUICK_PHRASES"
                  :key="phrase"
                  type="button"
                  class="phrase-item"
                  data-testid="phrase-item"
                  @click="onPickPhrase(phrase)"
                >
                  {{ phrase }}
                </button>
              </div>
            </el-popover>
            <span class="tip">Enter 发送，Shift+Enter 换行，可直接粘贴图片</span>
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
            <span
              class="char-count"
              :class="{ near: draft.length > 1800 }"
              data-testid="char-count"
            >
              {{ draft.length }}/2000
            </span>
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
        <p class="empty-sub">还没有好友？去 <router-link to="/friends">好友页</router-link> 添加</p>
      </div>
    </section>

    <!-- 资料卡 -->
    <el-dialog v-model="profileVisible" title="资料卡" width="360px">
      <div v-loading="profileLoading" class="profile-card" data-testid="profile-card">
        <template v-if="peerProfile">
          <ImAvatar :name="peerProfile.username" :color="peerProfile.avatar" :size="72" />
          <div class="card-name">{{ peerProfile.nickname }}</div>
          <div class="card-username">@{{ peerProfile.username }}</div>
          <div class="card-signature">{{ peerProfile.signature || '暂无签名' }}</div>
          <div class="card-meta">{{ peerStatusText }}</div>
        </template>
      </div>
    </el-dialog>

    <!-- 转发消息 -->
    <el-dialog v-model="forwardVisible" title="转发消息" width="360px">
      <div class="forward-body">
        <p class="forward-brief">{{ forwardBrief }}</p>
        <div class="forward-list">
          <label
            v-for="friend in forwardCandidates"
            :key="friend.id"
            class="forward-item"
            :class="{ picked: forwardChoice === friend.username }"
          >
            <ImAvatar :name="friend.username" :size="30" />
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

    <!-- 收藏夹 -->
    <el-dialog v-model="starsVisible" title="收藏夹" width="420px">
      <div v-loading="starsLoading" class="stars-body" data-testid="stars-list">
        <p v-if="!starsLoading && starList.length === 0" class="stars-empty">还没有收藏任何消息</p>
        <div v-for="star in starList" :key="star.msgId" class="star-item" data-testid="star-item">
          <div class="star-line">
            <span class="star-peer">{{ star.peer }}</span>
            <span class="star-time">{{ formatChatTime(star.created) }}</span>
          </div>
          <span class="star-content">
            {{ star.status === 'RECALLED' ? '[已撤回]' : star.msgType === 'image' ? '[图片]' : star.content }}
          </span>
        </div>
      </div>
    </el-dialog>

    <!-- 72 分享好友名片 -->
    <el-dialog v-model="cardVisible" title="分享好友名片" width="360px">
      <el-select v-model="cardTarget" placeholder="选择好友" style="width: 100%" data-testid="card-target">
        <el-option
          v-for="f in forwardCandidates"
          :key="f.id"
          :label="f.remark || f.username"
          :value="f.username"
        />
      </el-select>
      <p class="dialog-hint">名片会以卡片消息发送到当前会话</p>
      <template #footer>
        <el-button @click="cardVisible = false">取消</el-button>
        <el-button type="primary" :loading="cardLoading" data-testid="card-send" @click="confirmShareCard">
          发送名片
        </el-button>
      </template>
    </el-dialog>

    <!-- 73 分享位置 -->
    <el-dialog v-model="locationVisible" title="分享位置" width="380px">
      <div class="place-grid">
        <button
          v-for="p in PLACES"
          :key="p.name"
          type="button"
          class="place-chip"
          :class="{ active: locationPick === p.name }"
          data-testid="place-chip"
          @click="locationPick = p.name"
        >
          <span class="place-name">{{ p.name }}</span>
          <span class="place-addr">{{ p.address }}</span>
        </button>
      </div>
      <template #footer>
        <el-button @click="locationVisible = false">取消</el-button>
        <el-button type="primary" data-testid="location-send" @click="confirmShareLocation">
          发送位置
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { storeToRefs } from 'pinia'
import {
  Bell,
  Bottom,
  ChatDotRound,
  CircleClose,
  Close,
  Collection,
  Delete,
  Document,
  Download,
  EditPen,
  LocationInformation,
  Memo,
  MuteNotification,
  Picture,
  Pointer,
  Postcard,
  Search,
  Setting,
  User,
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { messagePreviewText, useImStore } from '@/stores/im'
import { messageApi, profileApi, starsApi } from '@/api/im'
import { currentBackground, currentPokeSuffix, currentSendKey } from '@/utils/settings'
import { detectEffect, floatHearts, playEffect } from '@/utils/effects'
import { formatChatTime, formatDayLabel, formatLastSeen, highlightSegments } from '@/utils/imFormat'
import type { HighlightSegment } from '@/utils/imFormat'
import ImAvatar from '@/components/im/ImAvatar.vue'
import EmojiPicker from '@/components/im/EmojiPicker.vue'
import MessageBubble from '@/components/im/MessageBubble.vue'
import type { ImMessage, ImStarVO, LocationPayload, UserProfileVO } from '@/types'

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

// 50 只看未读 + 44 分组筛选
const onlyUnread = ref(false)
const activeTag = ref('')

const searchVisible = ref(false)
const searchKeyword = ref('')
const searched = ref(false)
const searchInput = ref<{ focus: () => void } | null>(null)

const profileVisible = ref(false)
const profileLoading = ref(false)
const peerProfile = ref<UserProfileVO | null>(null)

// 35 回到底部：离开底部时显示悬浮按钮并累计新消息
const atBottom = ref(true)
const newBelow = ref(0)
// 36 搜索命中跳转高亮
const highlightId = ref('')

// 33 转发
const forwardVisible = ref(false)
const forwardChoice = ref('')
const forwardFrom = ref<ImMessage | null>(null)

// 24 收藏夹
const starsVisible = ref(false)
const starsLoading = ref(false)
const starList = ref<ImStarVO[]>([])

/** 38 快捷短语 */
const QUICK_PHRASES = ['收到', '好的，稍等', '辛苦了', '明天见', '没问题', '我再看一下']

/** 44 会话列表分组标签（来自好友资料里的 tag） */
const tagOptions = computed(() => {
  const tags = new Set<string>()
  for (const f of im.friends) {
    if (f.tag) {
      tags.add(f.tag)
    }
  }
  return [...tags].sort((a, b) => a.localeCompare(b))
})

const unreadFriendsCount = computed(() => im.friends.filter((f) => f.unread > 0).length)

function selectFilter(tag: string) {
  activeTag.value = tag
  onlyUnread.value = false
}

function toggleUnreadFilter() {
  onlyUnread.value = !onlyUnread.value
  if (onlyUnread.value) {
    activeTag.value = ''
  }
}

const filteredFriends = computed(() => {
  let list = im.friends
  if (onlyUnread.value) {
    list = list.filter((f) => f.unread > 0)
  } else if (activeTag.value) {
    list = list.filter((f) => f.tag === activeTag.value)
  }
  const kw = keyword.value.trim()
  if (!kw) {
    return list
  }
  return list.filter((f) => f.username.includes(kw) || f.remark.includes(kw))
})

function displayName(friend: { username: string; remark: string }) {
  return friend.remark || friend.username
}

const displayPeerName = computed(() => {
  if (!im.activeFriend) {
    return im.activePeer
  }
  return im.activeFriend.remark || im.activeFriend.username
})

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
    return last.fromMe ? `你${text}` : `${friend.username} ${text}`
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

/** 38 快捷短语：追加到输入框 */
function onPickPhrase(phrase: string) {
  draft.value = draft.value ? `${draft.value}${phrase}` : phrase
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
    await im.sendText(im.activePeer, content, { replyToId: replyTo.value?.id ?? null })
    draft.value = ''
    replyTo.value = null
    im.sendTyping(im.activePeer, false)
    // 66 关键词特效：生日快乐 / 新年快乐 / 下雪 / 爱你…
    const effect = detectEffect(content)
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

/** 粘贴图片直接发送（剪贴板里的 image 文件） */
function onPaste(event: ClipboardEvent) {
  const file = Array.from(event.clipboardData?.files ?? []).find((f) => f.type.startsWith('image/'))
  if (file && im.activePeer) {
    event.preventDefault()
    void submitImage(file)
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

async function onRetry(localId: string) {
  try {
    await im.retryMessage(localId)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '重试失败')
  }
}

// 67 拍一拍：带上个人自定义后缀（设置面板可改）
async function onPoke() {
  if (!im.activePeer) {
    return
  }
  try {
    await im.sendPoke(im.activePeer, currentPokeSuffix())
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '拍一拍失败')
  }
}

async function onRecall(msgId: string) {
  try {
    await im.recallMessage(msgId)
  } catch (e) {
    ElMessage.warning(e instanceof Error ? e.message : '撤回失败')
  }
}

// ---------- 回应 / 收藏 / 转发 ----------

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

async function onStar(message: ImMessage) {
  try {
    await im.toggleStar(message.id)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '收藏操作失败')
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
    ElMessage.success(`已转发给 ${forwardChoice.value}`)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '转发失败')
  }
}

async function onMarkAllRead() {
  try {
    await im.markAllRead()
    ElMessage.success('已全部标为已读')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '操作失败')
  }
}

// ---------- 收藏夹 / 导出 / 拉黑 ----------

async function openStars() {
  starsVisible.value = true
  starsLoading.value = true
  try {
    starList.value = await starsApi.list()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '收藏夹加载失败')
    starsVisible.value = false
  } finally {
    starsLoading.value = false
  }
}

/** 37 导出聊天记录为 .txt */
function exportHistory() {
  const peer = im.activePeer
  if (!peer) {
    return
  }
  const lines: string[] = [`与 ${peer} 的聊天记录（导出于 ${new Date().toLocaleString()}）`, '']
  for (const m of im.activeMessages) {
    const author = m.fromUser === auth.username ? '我' : m.fromUser
    const time = new Date(m.created).toLocaleString()
    const body =
      m.status === 'RECALLED'
        ? '[已撤回]'
        : m.msgType === 'image'
          ? '[图片]'
          : m.msgType === 'poke'
            ? '拍了拍对方'
            : m.content
    lines.push(`[${time}] ${author}: ${body}`)
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `与${peer}的聊天记录.txt`
  link.click()
  URL.revokeObjectURL(url)
}

/** 56 导出当前会话全部消息为 JSON（服务端全量，不止已加载分页） */
async function exportHistoryJson() {
  const peer = im.activePeer
  if (!peer) {
    return
  }
  try {
    const all = await messageApi.exportConversation(peer)
    const payload = {
      system: 'are-chat',
      peer,
      exportedAt: new Date().toISOString(),
      count: all.length,
      messages: all,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `与${peer}的聊天记录.json`
    link.click()
    URL.revokeObjectURL(url)
    ElMessage.success(`已导出 ${all.length} 条消息`)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '导出失败')
  }
}

async function toggleBlock(blocked: boolean) {
  const friend = im.activeFriend
  if (!friend) {
    return
  }
  try {
    if (blocked) {
      await ElMessageBox.confirm(`拉黑 ${friend.username} 后，双方都无法发送消息`, '拉黑好友', { type: 'warning' })
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
  if (command === 'export-json') {
    await exportHistoryJson()
    return
  }
  // 72 分享好友名片
  if (command === 'share-card') {
    cardTarget.value = forwardCandidates.value[0]?.username ?? ''
    cardVisible.value = true
    return
  }
  // 73 分享位置
  if (command === 'share-location') {
    locationPick.value = PLACES[0].name
    locationVisible.value = true
    return
  }
  if (command === 'profile') {
    profileVisible.value = true
    profileLoading.value = true
    peerProfile.value = null
    try {
      peerProfile.value = await profileApi.of(friend.username)
    } catch (e) {
      ElMessage.error(e instanceof Error ? e.message : '资料卡加载失败')
      profileVisible.value = false
    } finally {
      profileLoading.value = false
    }
    return
  }
  if (command === 'mute') {
    await im.updateFriend(friend.id, { muted: !friend.muted })
    ElMessage.success(friend.muted ? '已关闭免打扰' : '已开启免打扰')
    return
  }
  if (command === 'pin') {
    await im.updateFriend(friend.id, { pinned: !friend.pinned })
    return
  }
  if (command === 'remark') {
    try {
      const { value } = await ElMessageBox.prompt('设置备注名', '备注', {
        inputValue: friend.remark,
        inputPattern: /^.{0,32}$/,
        inputErrorMessage: '最长 32 个字',
      })
      await im.updateFriend(friend.id, { remark: value?.trim() ?? '' })
    } catch {
      // 用户取消
    }
    return
  }
  if (command === 'delete') {
    try {
      await ElMessageBox.confirm(`删除好友 ${friend.username}？`, '删除好友', { type: 'warning' })
      await im.removeFriend(friend.id)
      ElMessage.success('已删除')
    } catch {
      // 用户取消
    }
  }
}

// ---------- 72/73 名片 & 位置分享 ----------

const cardVisible = ref(false)
const cardTarget = ref('')
const cardLoading = ref(false)
const locationVisible = ref(false)
const locationPick = ref('')

const PLACES: LocationPayload[] = [
  { name: '北京·天安门广场', address: '北京市东城区东长安街' },
  { name: '上海·外滩', address: '上海市黄浦区中山东一路' },
  { name: '杭州·西湖断桥', address: '浙江省杭州市西湖区北山街' },
  { name: '深圳·腾讯滨海大厦', address: '广东省深圳市南山区科技园' },
  { name: '成都·宽窄巷子', address: '四川省成都市青羊区长顺上街' },
]

/** 72 发送好友名片：拉取资料后以 card 类型发出 */
async function confirmShareCard() {
  if (!im.activePeer || !cardTarget.value) {
    return
  }
  try {
    cardLoading.value = true
    const profile = await profileApi.of(cardTarget.value)
    await im.sendCard(im.activePeer, {
      username: profile.username,
      nickname: profile.nickname || profile.username,
      signature: profile.signature || '',
      avatar: profile.avatar || '',
    })
    cardVisible.value = false
    ElMessage.success('名片已发送')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '名片发送失败')
  } finally {
    cardLoading.value = false
  }
}

/** 73 发送位置卡片 */
async function confirmShareLocation() {
  if (!im.activePeer) {
    return
  }
  const place = PLACES.find((p) => p.name === locationPick.value) ?? PLACES[0]
  try {
    await im.sendLocation(im.activePeer, place)
    locationVisible.value = false
    ElMessage.success('位置已发送')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '位置发送失败')
  }
}

// ---------- 64/65 外观同步 & 对方回应的飘心 ----------

const chatBg = ref(currentBackground())

function syncAppearance() {
  chatBg.value = currentBackground()
}

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
  // 64 皮肤/背景在个人中心即时切换后同步到这里
  window.addEventListener('arechat:appearance', syncAppearance)
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
  window.removeEventListener('arechat:appearance', syncAppearance)
  window.removeEventListener('arechat:reaction', onPeerReaction as EventListener)
})
</script>

<style scoped>
.im-page {
  display: flex;
  height: 100vh;
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
  border-left-color: var(--xx-accent, #3370ff);
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
  color: var(--xx-accent, #3370ff);
}
.dm-area {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  /* 64 聊天背景由 .chat-bg-* 提供的 --chat-bg 决定 */
  background: var(--chat-bg, var(--im-bg, #f7f8fa));
  transition: background 0.25s ease;
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
  color: var(--xx-accent, #3370ff);
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
  border-left: 3px solid var(--xx-accent, #3370ff);
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
  color: var(--xx-accent, #3370ff);
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
/* 51 字数统计 */
.char-count {
  font-size: 11px;
  color: var(--im-faint, #b9bec7);
  user-select: none;
}
.char-count.near {
  color: var(--el-color-danger, #f56c6c);
}
/* ---- 44/50 会话筛选 ---- */
.conv-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0 16px 8px;
  align-items: center;
}
.filter-chip {
  border: 1px solid var(--im-border, #e6e8eb);
  background: var(--im-panel, #fff);
  color: var(--im-text-2, #51565f);
  font-size: 11px;
  padding: 2px 9px;
  border-radius: 999px;
  cursor: pointer;
  line-height: 16px;
}
.filter-chip.active {
  border-color: var(--xx-accent, #3370ff);
  color: var(--xx-accent, #3370ff);
  background: var(--xx-accent-soft, rgba(51, 112, 255, 0.08));
}
.read-all {
  margin-left: auto;
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
  color: var(--xx-accent, #3370ff);
  text-decoration: none;
}
.empty-sub a:hover {
  text-decoration: underline;
}
/* ---- 资料卡 ---- */
.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 0 4px;
  min-height: 180px;
}
.card-name {
  font-size: 18px;
  font-weight: 600;
}
.card-username {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.card-signature {
  font-size: 13px;
  color: var(--im-text-2, #51565f);
  text-align: center;
}
.card-meta {
  font-size: 12px;
  color: var(--xx-accent, #3370ff);
}

/* ---- 72/73 名片与位置分享 ---- */
.dialog-hint {
  margin: 10px 0 0;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.place-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.place-chip {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 9px 12px;
  border-radius: 10px;
  border: 1px solid var(--im-border, #e6e8eb);
  background: var(--im-panel, #fff);
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s, background 0.15s;
}
.place-chip:hover {
  border-color: var(--xx-accent, #3370ff);
}
.place-chip.active {
  border-color: var(--xx-accent, #3370ff);
  background: var(--xx-accent-soft, rgba(51, 112, 255, 0.1));
}
.place-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--im-text, #1f2329);
}
.place-addr {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
</style>

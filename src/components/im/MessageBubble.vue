<template>
  <!-- 系统消息 / 拍一拍 / 已撤回：居中灰字 -->
  <div
    v-if="centered"
    class="center-line"
    :class="{ 'poke-shake': message.msgType === 'poke' && message.status !== 'RECALLED' }"
    data-testid="dm-center"
  >{{ centerText }}</div>

  <div
    v-else
    class="row"
    :class="{ self, highlight, 'bubble-in': message.status !== 'RECALLED', 'actions-open': actionsOpen }"
    :data-message-id="message.id"
    data-testid="dm-row"
  >
    <ImAvatar :name="message.fromUser" :label="senderName" :size="34" />
    <div class="bubble-wrap">
      <div v-if="!self" class="meta">
        <span class="meta-name">{{ senderName }}</span>
        <span>{{ formatChatTime(message.created) }}</span>
        <span v-if="message.edited" class="meta-mark">已编辑</span>
        <el-icon v-if="message.starred" class="star-mark" :size="12" data-testid="starred-mark">
          <StarFilled />
        </el-icon>
      </div>
      <div class="bubble" data-testid="dm-bubble" @dblclick="onBubbleDblClick" @click="onBubbleTap">
        <!-- 引用块（48 点击定位原消息） -->
        <div
          v-if="message.replyToId"
          class="quote"
          data-testid="quote-block"
          title="点击定位原消息"
          @click.stop="emit('jump', message.replyToId)"
        >
          <span class="quote-text">{{ quoteText }}</span>
        </div>

        <!-- 图片消息（69 点击开灯箱，可缩放/旋转/下载） -->
        <div
          v-if="message.msgType === 'image' && (message.status === 'SENT' || message.status === 'SENDING')"
          class="image-wrap"
        >
          <el-image
            class="image"
            :src="message.content"
            fit="cover"
            data-testid="dm-image"
            @click="lightbox = message.status === 'SENT'"
          />
          <a
            v-if="message.status === 'SENT'"
            class="image-dl"
            :href="message.content"
            :download="true"
            target="_blank"
            title="下载图片"
            data-testid="image-download"
          >
            <el-icon :size="13"><Download /></el-icon>
          </a>
        </div>
        <!-- 82 文件消息卡片：图标 + 文件名 + 大小 + 下载 -->
        <div v-else-if="message.msgType === 'file'" class="file-msg" data-testid="dm-file">
          <el-icon :size="26" class="file-icon"><Document /></el-icon>
          <div class="file-body">
            <div class="file-name" :title="filePayload.name">{{ filePayload.name }}</div>
            <div class="file-size">{{ formatSize(filePayload.size) }}</div>
          </div>
          <a
            class="file-dl"
            :href="filePayload.url"
            :download="filePayload.name"
            title="下载文件"
            data-testid="file-download"
          >
            <el-icon :size="15"><Download /></el-icon>
          </a>
        </div>
        <!-- 72 好友名片卡片 -->
        <div v-else-if="message.msgType === 'card'" class="card-msg" data-testid="dm-card">
          <ImAvatar :name="card.username || message.fromUser" :size="40" />
          <div class="card-body">
            <div class="card-name">{{ card.nickname || card.username }}</div>
            <div class="card-sig">{{ card.signature || '这个人很懒，什么都没写' }}</div>
            <div class="card-user">@{{ card.username }}</div>
          </div>
          <span class="card-badge">名片</span>
        </div>
        <!-- 73 位置分享卡片 -->
        <div v-else-if="message.msgType === 'location'" class="loc-msg" data-testid="dm-location">
          <div class="loc-map"><span class="loc-pin">📍</span></div>
          <div class="loc-body">
            <div class="loc-name">{{ place.name }}</div>
            <div class="loc-addr">{{ place.address }}</div>
          </div>
        </div>
        <!-- 47 文本消息里的 URL 渲染为安全链接 -->
        <span v-else-if="linkSegments.length > 0" class="text">
          <template v-for="(seg, index) in linkSegments" :key="index">
            <a
              v-if="seg.kind === 'link'"
              class="text-link"
              :href="seg.value"
              target="_blank"
              rel="noopener noreferrer nofollow"
              data-testid="message-link"
            >{{ seg.value }}</a>
            <template v-else>{{ seg.value }}</template>
          </template>
        </span>
        <span v-else class="text">{{ message.content }}</span>
      </div>

      <!-- 表情回应 chips -->
      <div v-if="reactions.length > 0" class="reactions" data-testid="reaction-list">
        <button
          v-for="chip in reactions"
          :key="chip.emoji"
          class="reaction-chip"
          :class="{ mine: chip.mine }"
          :title="chip.names"
          data-testid="reaction-chip"
          @click="emit('react', chip.emoji, message)"
        >
          <span class="chip-emoji">{{ chip.emoji }}</span>
          <span v-if="chip.count > 1" class="chip-count">{{ chip.count }}</span>
        </button>
      </div>

      <!-- 我发的消息：发送中 / 失败重试 / 已读回执 -->
      <div v-if="self && message.status === 'SENDING'" class="sending" data-testid="sending-mark">
        <el-icon class="sending-spin" :size="12"><Loading /></el-icon>
        <span>发送中</span>
      </div>
      <div v-else-if="self && message.status === 'FAILED'" class="failed" data-testid="failed-mark">
        <el-icon :size="13"><WarningFilled /></el-icon>
        <span>发送失败</span>
        <el-button link type="primary" size="small" data-testid="retry-btn" @click="emit('retry', message.id)">
          重试
        </el-button>
      </div>
      <div v-else-if="self && canReceipt" class="receipt" data-testid="read-mark" :class="{ read: message.read }">
        {{ message.read ? '已读' : '未读' }}
        <span v-if="message.edited" class="meta-mark">已编辑</span>
        <el-icon v-if="message.starred" class="star-mark" :size="12" data-testid="starred-mark">
          <StarFilled />
        </el-icon>
      </div>
    </div>

    <!-- 74 hover 快捷表情条：一键回应 -->
    <div
      v-if="message.status === 'SENT'"
      class="quick-reacts"
      :class="{ self }"
      data-testid="quick-reacts"
    >
      <button
        v-for="emoji in REACTION_EMOJIS"
        :key="`quick-${emoji}`"
        class="quick-emoji"
        type="button"
        :title="`回应 ${emoji}`"
        @click="emit('react', emoji, message)"
      >{{ emoji }}</button>
    </div>

    <div class="hover-actions">
      <el-popover placement="top" :width="196" trigger="click" popper-class="react-popper">
        <template #reference>
          <button class="hover-btn" type="button" title="回应" data-testid="react-btn">回应</button>
        </template>
        <div class="react-grid">
          <button
            v-for="emoji in REACTION_EMOJIS"
            :key="emoji"
            class="react-option"
            type="button"
            data-testid="reaction-option"
            @click="emit('react', emoji, message)"
          >
            {{ emoji }}
          </button>
        </div>
      </el-popover>
      <button
        v-if="canReply"
        class="hover-btn"
        type="button"
        title="引用"
        data-testid="reply-btn"
        @click="emit('reply', message)"
      >
        引用
      </button>
      <button
        v-if="canForward"
        class="hover-btn"
        type="button"
        title="转发"
        data-testid="forward-btn"
        @click="emit('forward', message)"
      >
        转发
      </button>
      <button
        v-if="canEdit"
        class="hover-btn"
        type="button"
        title="编辑"
        data-testid="edit-btn"
        @click="emit('edit', message)"
      >
        编辑
      </button>
      <button
        v-if="canStar"
        class="hover-btn"
        type="button"
        :title="message.starred ? '取消收藏' : '收藏'"
        data-testid="star-btn"
        @click="emit('star', message)"
      >
        {{ message.starred ? '已收藏' : '收藏' }}
      </button>
      <!-- 84 会话内置顶/取消置顶（由父组件维护置顶状态） -->
      <button
        v-if="message.status === 'SENT' && pinnedMsgId !== message.id"
        class="hover-btn"
        type="button"
        title="置顶这条消息"
        data-testid="pin-btn"
        @click="emit('pin', message)"
      >
        置顶
      </button>
      <button
        v-if="pinnedMsgId === message.id"
        class="hover-btn"
        type="button"
        title="取消置顶"
        data-testid="unpin-btn"
        @click="emit('unpin')"
      >
        取消置顶
      </button>
      <!-- 情侣空间：把这句话记入约定（仅已建立空间时显示） -->
      <button
        v-if="canPromise"
        class="hover-btn"
        type="button"
        title="记入情侣约定"
        data-testid="promise-btn"
        @click="emit('promise', message)"
      >
        约定
      </button>
      <button
        v-if="canRecall"
        class="hover-btn danger"
        type="button"
        title="撤回"
        data-testid="recall-btn"
        @click="emit('recall', message.id)"
      >
        撤回
      </button>
    </div>
  </div>

  <!-- 69 图片灯箱：全屏查看（缩放 / 旋转 / 下载） -->
  <ImageLightbox v-model="lightbox" :src="message.content" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Document, Download, Loading, StarFilled, WarningFilled } from '@element-plus/icons-vue'
import type { FriendCardPayload, FilePayload, ImMessage, ImReaction, LocationPayload } from '@/types'
import { formatChatTime, parseLinks } from '@/utils/imFormat'
import { floatHearts } from '@/utils/effects'
import { useImStore } from '@/stores/im'
import { useCoupleStore } from '@/stores/couple'
import ImAvatar from './ImAvatar.vue'
import ImageLightbox from './ImageLightbox.vue'

/** 回应支持的表情（与后端 REACTION_EMOJIS 对齐） */
const REACTION_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🔥']

const props = withDefaults(
  defineProps<{
    message: ImMessage
    self: boolean
    /** 当前登录名（用于引用块里显示「我」） */
    selfName?: string
    /** 引用目标消息（在同会话已加载消息中查找） */
    replyTarget?: ImMessage | null
    /** 搜索跳转命中高亮 */
    highlight?: boolean
    now?: number
    /** 84 当前会话置顶消息 id（悬空时父组件自行兜底） */
    pinnedMsgId?: string | null
  }>(),
  { selfName: '', replyTarget: null, highlight: false, now: () => Date.now(), pinnedMsgId: null },
)

const emit = defineEmits<{
  recall: [msgId: string]
  reply: [message: ImMessage]
  retry: [localId: string]
  /** react 携带消息对象：父组件需要消息 id 才能 toggle 回应 */
  react: [emoji: string, message: ImMessage]
  forward: [message: ImMessage]
  edit: [message: ImMessage]
  star: [message: ImMessage]
  /** 84 置顶 / 取消置顶 */
  pin: [message: ImMessage]
  unpin: []
  /** 48 点击引用块：定位原消息 */
  jump: [msgId: string]
  /** 情侣空间：把这句话记入约定（谁说的就是谁的承诺） */
  promise: [message: ImMessage]
}>()

/** 发送者展示名：备注优先（im.displayNameOf 响应式解析，备注修改后历史消息即时换名） */
const im = useImStore()
const couple = useCoupleStore()
const senderName = computed(() => im.displayNameOf(props.message.fromUser))

/** 情侣约定入口：仅文本消息 + 已建立情侣空间时展示，避免无关打扰 */
const canPromise = computed(
  () => couple.established && props.message.status === 'SENT' && props.message.msgType === 'text',
)

const centered = computed(() => {
  if (props.message.status === 'RECALLED') {
    return true
  }
  return props.message.msgType === 'poke' || props.message.msgType === 'system'
})

/** 69 图片灯箱 */
const lightbox = ref(false)

/** 67 拍一拍自定义后缀（默认文案为 [拍一拍]，其余内容即自定义后缀） */
const pokeSuffix = computed(() => {
  const text = props.message.content ?? ''
  return text === '[拍一拍]' ? '' : text
})

/** 72 名片卡片内容（容错解析） */
const card = computed<Partial<FriendCardPayload>>(() => {
  try {
    return JSON.parse(props.message.content) as FriendCardPayload
  } catch {
    return {}
  }
})

/** 73 位置卡片内容（容错解析） */
const place = computed<Partial<LocationPayload>>(() => {
  try {
    return JSON.parse(props.message.content) as LocationPayload
  } catch {
    return {}
  }
})

/** 82 文件卡片内容（容错解析） */
const filePayload = computed<Partial<FilePayload>>(() => {
  try {
    return JSON.parse(props.message.content) as FilePayload
  } catch {
    return {}
  }
})

/** 82 文件大小人性化展示 */
function formatSize(size?: number): string {
  if (!size || size <= 0) {
    return ''
  }
  if (size < 1024) {
    return `${size} B`
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`
  }
  return `${(size / 1024 / 1024).toFixed(2)} MB`
}

const centerText = computed(() => {
  if (props.message.status === 'RECALLED') {
    return props.self ? '你撤回了一条消息' : `${senderName.value} 撤回了一条消息`
  }
  if (props.message.msgType === 'poke') {
    return props.self ? `你拍了拍对方${pokeSuffix.value}` : `${senderName.value} 拍了拍你${pokeSuffix.value}`
  }
  return props.message.content
})

const inWindow = computed(() => props.now - props.message.created <= 2 * 60 * 1000)
const canRecall = computed(
  () =>
    props.self &&
    props.message.status === 'SENT' &&
    (props.message.msgType === 'text' || props.message.msgType === 'image' || props.message.msgType === 'file') &&
    inWindow.value,
)
const canEdit = computed(
  () => props.self && props.message.status === 'SENT' && props.message.msgType === 'text' && inWindow.value,
)
const canReply = computed(
  () =>
    props.message.status === 'SENT' &&
    (props.message.msgType === 'text' || props.message.msgType === 'image' || props.message.msgType === 'file'),
)
const canForward = computed(
  () =>
    props.message.status === 'SENT' &&
    (props.message.msgType === 'text' || props.message.msgType === 'image' || props.message.msgType === 'file'),
)
const canStar = computed(
  () =>
    props.message.status === 'SENT' &&
    (props.message.msgType === 'text' || props.message.msgType === 'image' || props.message.msgType === 'file'),
)
const canReceipt = computed(
  () => props.message.msgType === 'text' || props.message.msgType === 'image' || props.message.msgType === 'file',
)

/** 47 链接识别：仅对未撤回的文本消息做 URL 切分 */
const linkSegments = computed(() => {
  if (props.message.msgType !== 'text' || props.message.status === 'RECALLED') {
    return []
  }
  return parseLinks(props.message.content).filter((seg) => seg.kind === 'link' || seg.value.length > 0)
})

/** 49 双击气泡快捷 👍（65 同时飘心） */
function onBubbleDblClick(event: MouseEvent) {
  if (props.message.status !== 'SENT') {
    return
  }
  floatHearts(event.currentTarget as Element, '👍')
  emit('react', '👍', props.message)
}

/**
 * 手机/触屏适配：没有 hover，操作按钮（回应/引用/撤回…）改为点击气泡展开/收起。
 * 桌面端仍走 hover 展示，这里不做任何事（jsdom/无 matchMedia 环境同样安全跳过）。
 */
const actionsOpen = ref(false)
function onBubbleTap() {
  const coarse = window.matchMedia?.('(hover: none)')?.matches
  if (coarse) {
    actionsOpen.value = !actionsOpen.value
  }
}

/** 聚合同名表情：emoji + 数量 + 是否包含我（tooltip 里的名字也按备注解析） */
const reactions = computed(() => {
  const list: ImReaction[] = props.message.reactions ?? []
  const grouped: { emoji: string; count: number; mine: boolean; names: string }[] = []
  for (const r of list) {
    const existing = grouped.find((g) => g.emoji === r.emoji)
    if (existing) {
      existing.count += 1
      existing.names += `、${im.displayNameOf(r.username)}`
      existing.mine = existing.mine || r.username === props.selfName
    } else {
      grouped.push({ emoji: r.emoji, count: 1, mine: r.username === props.selfName, names: im.displayNameOf(r.username) })
    }
  }
  return grouped
})

const quoteText = computed(() => {
  const target = props.replyTarget
  if (!target) {
    return '引用消息'
  }
  const brief =
    target.status === 'RECALLED'
      ? '[已撤回]'
      : target.msgType === 'image'
        ? '[图片]'
        : target.msgType === 'poke'
          ? '[拍一拍]'
          : target.content
  const author = target.fromUser === props.selfName ? '我' : im.displayNameOf(target.fromUser)
  return `${author}：${brief}`
})
</script>

<style scoped>
.center-line {
  align-self: center;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
  background: var(--im-center-bg, rgba(0, 0, 0, 0.05));
  padding: 3px 12px;
  border-radius: 10px;
}
.row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  max-width: 72%;
  border-radius: 10px;
  transition: background 0.3s ease;
}
.row.self {
  align-self: flex-end;
  flex-direction: row-reverse;
}
/* 搜索跳转命中高亮 */
.row.highlight {
  animation: row-flash 1.6s ease;
}
@keyframes row-flash {
  0%, 55% {
    background: var(--xx-accent-soft, rgba(51, 112, 255, 0.12));
  }
  100% {
    background: transparent;
  }
}
.bubble-wrap {
  min-width: 0;
}
.meta {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
  margin-bottom: 4px;
  align-items: center;
}
.meta-name {
  font-weight: 500;
  color: var(--im-text-2, #51565f);
}
.meta-mark {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.star-mark {
  color: var(--el-color-warning, #e6a23c);
}
.bubble {
  background: var(--im-bubble-peer, #fff);
  border: 1px solid var(--im-bubble-peer-border, #e6e8eb);
  border-radius: 3px 10px 10px 10px;
  padding: 8px 12px;
  font-size: var(--im-msg-font, 14px);
  line-height: 1.55;
  word-break: break-word;
}
.row.self .bubble {
  background: var(--im-bubble-gradient, var(--im-bubble-me, #ec5f92));
  border-color: transparent;
  color: var(--im-bubble-me-text, #fff);
  border-radius: 10px 3px 10px 10px;
}
.text {
  white-space: pre-wrap;
}
.text-link {
  color: inherit;
  text-decoration: underline;
  opacity: 0.85;
  word-break: break-all;
}
.text-link:hover {
  opacity: 1;
}
.quote {
  border-left: 3px solid var(--xx-accent, #ec5f92);
  background: var(--im-quote-bg, rgba(51, 112, 255, 0.06));
  border-radius: 4px;
  padding: 4px 8px;
  margin-bottom: 6px;
  max-width: 320px;
}
.quote-text {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.row.self .quote {
  border-left-color: rgba(255, 255, 255, 0.55);
  background: rgba(255, 255, 255, 0.14);
}
.row.self .quote-text {
  color: rgba(255, 255, 255, 0.82);
}
.image-wrap {
  position: relative;
}
.image {
  width: 200px;
  max-height: 240px;
  border-radius: 8px;
  display: block;
}
.image-dl {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: none;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
}
.image-wrap:hover .image-dl {
  display: flex;
}
.image-dl:hover {
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
}
.reactions {
  display: flex;
  gap: 4px;
  margin-top: 4px;
  flex-wrap: wrap;
}
.row.self .reactions {
  justify-content: flex-end;
}
.reaction-chip {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  border: 1px solid var(--im-bubble-peer-border, #e6e8eb);
  background: var(--im-bubble-peer, #fff);
  border-radius: 999px;
  padding: 1px 7px;
  font-size: 12px;
  line-height: 18px;
  cursor: pointer;
  color: var(--im-text-2, #51565f);
}
.reaction-chip.mine {
  border-color: var(--xx-accent, #ec5f92);
  background: var(--xx-accent-soft, rgba(51, 112, 255, 0.08));
}
.chip-count {
  font-size: 11px;
}
.sending {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
  justify-content: flex-end;
}
.sending-spin {
  animation: spin 0.9s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.failed {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  font-size: 12px;
  color: var(--el-color-danger, #f56c6c);
  justify-content: flex-end;
}
.receipt {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  font-size: 11px;
  color: var(--im-muted, #8f959e);
  justify-content: flex-end;
}
.receipt.read {
  color: var(--xx-accent, #ec5f92);
}
.hover-actions {
  display: flex;
  align-items: center;
  gap: 2px;
  opacity: 0;
  align-self: center;
  transition: opacity 0.12s ease;
}
.row:hover .hover-actions {
  opacity: 1;
}
.hover-btn {
  border: none;
  background: transparent;
  color: var(--im-muted, #8f959e);
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
}
.hover-btn:hover {
  color: var(--xx-accent, #ec5f92);
  background: var(--im-hover, #f2f3f5);
}
.hover-btn.danger:hover {
  color: var(--el-color-danger, #f56c6c);
}
.react-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 4px;
}
.react-option {
  border: none;
  background: transparent;
  font-size: 18px;
  line-height: 1;
  padding: 4px;
  border-radius: 6px;
  cursor: pointer;
}
.react-option:hover {
  background: var(--im-hover, #f2f3f5);
}

/* ============ 68 气泡入场动画 ============ */
.row.bubble-in {
  animation: bubble-in 0.26s ease-out both;
}
.center-line {
  animation: center-in 0.22s ease-out both;
}

/* ============ 74 hover 快捷表情条 ============ */
.quick-reacts {
  display: flex;
  align-items: center;
  gap: 2px;
  align-self: center;
  padding: 2px 4px;
  border-radius: 999px;
  background: var(--im-panel, #fff);
  border: 1px solid var(--im-border, #e6e8eb);
  box-shadow: var(--im-shadow, 0 8px 30px rgba(0, 0, 0, 0.08));
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 0.14s ease, transform 0.14s ease;
  pointer-events: none;
}
.row:hover .quick-reacts {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}
.quick-emoji {
  border: none;
  background: transparent;
  font-size: 16px;
  line-height: 1;
  padding: 3px 4px;
  border-radius: 999px;
  cursor: pointer;
}
.quick-emoji:hover {
  background: var(--im-hover, #f2f3f5);
  transform: scale(1.25);
}

/* ============ 72 好友名片卡片 ============ */
.card-msg {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 190px;
  padding: 10px 12px;
  border-radius: 10px;
  background: var(--im-panel, #fff);
  border: 1px solid var(--im-border, #e6e8eb);
}
.card-body {
  min-width: 0;
}
.card-name {
  font-weight: 600;
  color: var(--im-text, #1f2329);
  font-size: 14px;
}
.card-sig {
  color: var(--im-muted, #8f959e);
  font-size: 12px;
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 160px;
}
.card-user {
  color: var(--xx-accent, #ec5f92);
  font-size: 12px;
  margin-top: 3px;
}
.card-badge {
  position: absolute;
  top: 6px;
  right: 8px;
  font-size: 11px;
  color: var(--im-faint, #b9bec7);
}

/* ============ 82 文件消息卡片 ============ */
.file-msg {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 210px;
  padding: 10px 12px;
  border-radius: 10px;
  background: var(--im-panel, #fff);
  border: 1px solid var(--im-border, #e6e8eb);
}
.file-icon {
  color: var(--xx-accent, #ec5f92);
  flex-shrink: 0;
}
.file-body {
  min-width: 0;
  flex: 1;
}
.file-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--im-text, #1f2329);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.file-size {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
  margin-top: 2px;
}
.file-dl {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  color: var(--xx-accent, #ec5f92);
  flex-shrink: 0;
}
.file-dl:hover {
  background: var(--im-hover, #f2f3f5);
}

/* ============ 73 位置卡片 ============ */
.loc-msg {
  display: flex;
  align-items: stretch;
  gap: 0;
  min-width: 200px;
  border-radius: 10px;
  overflow: hidden;
  background: var(--im-panel, #fff);
  border: 1px solid var(--im-border, #e6e8eb);
}
.loc-map {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 74px;
  background: linear-gradient(135deg, #cfe3ff, #eaf2ff);
}
.loc-pin {
  font-size: 26px;
  animation: halo-pulse 2s ease-out infinite;
  --halo-color: var(--xx-accent, #ec5f92);
  border-radius: 50%;
}
.loc-body {
  padding: 9px 12px;
  min-width: 0;
}
.loc-name {
  font-weight: 600;
  color: var(--im-text, #1f2329);
  font-size: 14px;
}
.loc-addr {
  color: var(--im-muted, #8f959e);
  font-size: 12px;
  margin-top: 3px;
}

/* ============ 手机/触屏适配 ============ */
@media (hover: none) {
  /* 气泡行允许换行：操作按钮展开时换到气泡下一行，不再挤压气泡宽度 */
  .row {
    flex-wrap: wrap;
    max-width: 88%;
  }
  /* 没有 hover：操作按钮改为「点击气泡展开」 */
  .hover-actions {
    display: none;
  }
  .row.actions-open .hover-actions {
    order: 6;
    flex-basis: 100%;
    display: flex;
    justify-content: flex-start;
    opacity: 1;
    margin-top: 2px;
  }
  .row.self.actions-open .hover-actions {
    justify-content: flex-end;
  }
  /* hover 快捷表情条在触屏上无法触发，隐藏避免占位 */
  .quick-reacts {
    display: none;
  }
}

/* 窄屏下的图片/引用尺寸，避免撑破气泡 */
@media (max-width: 480px) {
  .image {
    width: 150px;
    max-height: 200px;
  }
  .quote {
    max-width: 200px;
  }
}
</style>

<template>
  <Teleport to="body">
    <div class="toast-stack" data-testid="toast-stack">
      <TransitionGroup name="toast">
        <div
          v-for="item in items"
          :key="item.id"
          class="toast-card"
          data-testid="msg-toast"
          @click="emit('open', item.peer)"
        >
          <ImAvatar :name="item.name" :size="34" />
          <div class="toast-body">
            <div class="toast-name">{{ item.name }}</div>
            <div class="toast-text">{{ item.body }}</div>
          </div>
          <button type="button" class="toast-close" title="忽略" @click.stop="emit('close', item.id)">✕</button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { ToastItem } from '@/types'
import ImAvatar from './ImAvatar.vue'

/** 70 新消息浮动卡片：右上角滑入，点击跳转会话 */
defineProps<{ items: ToastItem[] }>()
const emit = defineEmits<{ open: [peer: string]; close: [id: number] }>()
</script>

<style scoped>
.toast-stack {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 3950;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 268px;
}
.toast-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  background: var(--im-panel, #fff);
  border: 1px solid var(--im-border, #e6e8eb);
  box-shadow: var(--im-shadow, 0 8px 30px rgba(0, 0, 0, 0.14));
  cursor: pointer;
  animation: toast-in 0.22s ease-out both;
  transition: transform 0.15s ease;
}
.toast-card:hover {
  transform: translateX(-3px);
}
.toast-body {
  min-width: 0;
  flex: 1;
}
.toast-name {
  font-weight: 600;
  font-size: 13px;
  color: var(--im-text, #1f2329);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.toast-text {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 2px;
}
.toast-close {
  border: none;
  background: transparent;
  color: var(--im-faint, #b9bec7);
  cursor: pointer;
  font-size: 12px;
  padding: 2px 4px;
  border-radius: 6px;
}
.toast-close:hover {
  background: var(--im-hover, #f2f3f5);
  color: var(--im-text-2, #51565f);
}
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>

<template>
  <div class="emoji-picker" data-testid="emoji-picker">
    <template v-for="group in EMOJI_GROUPS" :key="group.name">
      <div class="emoji-group-name">{{ group.name }}</div>
      <div class="emoji-grid">
        <button
          v-for="emoji in group.emojis"
          :key="group.name + emoji"
          type="button"
          class="emoji-cell"
          @click="emit('select', emoji)"
        >
          {{ emoji }}
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { EMOJI_GROUPS } from '@/utils/imFormat'

const emit = defineEmits<{ select: [emoji: string] }>()
</script>

<style scoped>
/* 浮窗内容超高时内部滚动，绝不撑破 el-popover 边框 */
.emoji-picker {
  max-height: min(320px, 46vh);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 2px 4px;
}
.emoji-group-name {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
  margin: 8px 2px 4px;
  position: sticky;
  top: 0;
  background: var(--im-panel, #fff);
  z-index: 1;
}
/*
 * 关键修复：旧版 repeat(8, 1fr) 的 1fr 轨道最小宽度是内容宽度，
 * Windows 等系统 emoji 字形偏宽时 8 列总宽超过浮窗，最后一列会被挤出边框外。
 * auto-fill + minmax 保证轨道总宽永远 ≤ 容器宽度，列数随宽度自适应。
 */
.emoji-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(30px, 1fr));
  gap: 2px;
}
.emoji-cell {
  border: none;
  background: transparent;
  font-size: 20px;
  line-height: 1;
  padding: 4px;
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
}
.emoji-cell:hover {
  background: var(--im-hover, #f2f3f5);
}
</style>

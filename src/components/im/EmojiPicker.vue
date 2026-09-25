<template>
  <div class="emoji-picker">
    <button
      v-for="emoji in EMOJI_LIST"
      :key="emoji"
      type="button"
      class="emoji-cell"
      @click="emit('select', emoji)"
    >
      {{ emoji }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { EMOJI_LIST } from '@/utils/imFormat'

const emit = defineEmits<{ select: [emoji: string] }>()
</script>

<style scoped>
.emoji-picker {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 2px;
  padding: 6px;
}
.emoji-cell {
  border: none;
  background: transparent;
  font-size: 20px;
  line-height: 1;
  padding: 4px;
  border-radius: 8px;
  cursor: pointer;
}
.emoji-cell:hover {
  background: var(--im-hover, #f2f3f5);
}
</style>

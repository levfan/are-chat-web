<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div v-if="modelValue" class="lightbox-mask" data-testid="image-lightbox" @click.self="close">
        <div class="lightbox-toolbar">
          <button type="button" title="缩小" data-testid="lb-zoom-out" @click="zoom(-0.2)">－</button>
          <span class="zoom-text">{{ Math.round(scale * 100) }}%</span>
          <button type="button" title="放大" data-testid="lb-zoom-in" @click="zoom(0.2)">＋</button>
          <button type="button" title="左转" data-testid="lb-rotate-left" @click="rotate(-90)">⟲</button>
          <button type="button" title="右转" data-testid="lb-rotate-right" @click="rotate(90)">⟳</button>
          <button type="button" title="重置" data-testid="lb-reset" @click="reset">1:1</button>
          <a class="lb-download" :href="src" download target="_blank" title="下载原图" data-testid="lb-download">
            下载
          </a>
          <button type="button" title="关闭 (Esc)" data-testid="lb-close" @click="close">✕</button>
        </div>
        <img
          class="lightbox-img"
          :src="src"
          :style="{ transform: `scale(${scale}) rotate(${angle}deg)` }"
          alt="图片预览"
          @wheel.prevent="onWheel"
          @dblclick="reset"
        />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

/** 69 图片灯箱：缩放 / 旋转 / 下载，Esc 关闭，滚轮缩放，双击复位 */
const props = defineProps<{ modelValue: boolean; src: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const scale = ref(1)
const angle = ref(0)

const visible = computed(() => props.modelValue)

function close() {
  emit('update:modelValue', false)
}

function zoom(delta: number) {
  scale.value = Math.min(4, Math.max(0.3, Number((scale.value + delta).toFixed(2))))
}

function rotate(delta: number) {
  angle.value = (angle.value + delta) % 360
}

function reset() {
  scale.value = 1
  angle.value = 0
}

function onWheel(event: WheelEvent) {
  zoom(event.deltaY < 0 ? 0.15 : -0.15)
}

function onKeydown(event: KeyboardEvent) {
  if (!visible.value) {
    return
  }
  if (event.key === 'Escape') {
    close()
  } else if (event.key === '+' || event.key === '=') {
    zoom(0.2)
  } else if (event.key === '-') {
    zoom(-0.2)
  }
}

watch(visible, (open) => {
  if (open) {
    reset()
  }
})

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', onKeydown)
}
onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', onKeydown)
  }
})
</script>

<style scoped>
.lightbox-mask {
  position: fixed;
  inset: 0;
  z-index: 3900;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(8, 10, 14, 0.88);
  backdrop-filter: blur(4px);
}
.lightbox-img {
  max-width: 82vw;
  max-height: 78vh;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  transition: transform 0.18s ease;
  cursor: zoom-in;
}
.lightbox-toolbar {
  position: absolute;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  font-size: 13px;
}
.lightbox-toolbar button,
.lb-download {
  min-width: 30px;
  height: 28px;
  padding: 0 8px;
  border: none;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
  font-size: 13px;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.lightbox-toolbar button:hover,
.lb-download:hover {
  background: rgba(255, 255, 255, 0.28);
}
.zoom-text {
  min-width: 44px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.16s ease;
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>

<template>
  <div
    class="avatar"
    :class="{ halo: haloOn, pulse: online === true }"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
      background: bg,
      fontSize: `${size * 0.42}px`,
      '--halo-color': haloColor,
    }"
  >
    <span class="initial">{{ initial }}</span>
    <span v-if="online !== undefined" class="dot" :class="dotClass" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { avatarColorByKey } from '@/utils/imFormat'

const props = withDefaults(
  defineProps<{
    name: string
    /** 头像底色档位（c0..c7），缺省按用户名取色 */
    color?: string
    online?: boolean
    size?: number
    /** 71 在线状态：在线/忙碌/离开 —— 决定光环颜色 */
    status?: string
    /** 71 是否显示呼吸光环（列表/会话头使用） */
    halo?: boolean
  }>(),
  {
    color: '',
    online: undefined,
    size: 40,
    status: '',
    halo: false,
  },
)

const bg = computed(() => avatarColorByKey(props.color, props.name))
const initial = computed(() => props.name.trim().charAt(0).toUpperCase() || '?')

const statusValue = computed(() => props.status || (props.online ? 'online' : 'offline'))
const haloOn = computed(() => props.halo && props.online === true)
const haloColor = computed(
  () => ({ online: '#3fbf62', busy: '#e6a23c', away: '#9aa3b2' })[statusValue.value] ?? '#b5bac2',
)
const dotClass = computed(() => `s-${statusValue.value}`)
</script>

<style scoped>
.avatar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #fff;
  font-weight: 600;
  letter-spacing: 0;
  flex-shrink: 0;
  user-select: none;
}
/* 71 在线呼吸光环 */
.avatar.halo {
  box-shadow: 0 0 0 2px var(--halo-color, #3fbf62);
}
.avatar.halo.pulse {
  animation: halo-pulse 2.2s ease-out infinite;
}
.dot {
  position: absolute;
  right: -1px;
  bottom: -1px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #b5bac2;
  border: 2px solid var(--im-panel, #fff);
}
.dot.on,
.dot.s-online {
  background: #3fbf62;
}
.dot.s-busy {
  background: #e6a23c;
}
.dot.s-away {
  background: #9aa3b2;
}
</style>

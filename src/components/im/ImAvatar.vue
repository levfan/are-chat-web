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
    <!-- 情侣空间·双人挂件：不传 pendant 就一个节点也不渲染（全站头像共用本组件，默认零变化） -->
    <span
      v-if="pendant"
      class="pendant"
      :style="{ fontSize: `${pendantSize}px` }"
      aria-hidden="true"
      data-testid="avatar-pendant"
    >{{ pendant }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { avatarColorByKey } from '@/utils/imFormat'

const props = withDefaults(
  defineProps<{
    name: string
    /** 首字母覆盖：显示名（备注）与用户名不同时传入，颜色仍按 name 取值保持稳定 */
    label?: string
    /** 头像底色档位（c0..c7），缺省按用户名取色 */
    color?: string
    online?: boolean
    size?: number
    /** 71 在线状态：在线/忙碌/离开 —— 决定光环颜色 */
    status?: string
    /** 71 是否显示呼吸光环（列表/会话头使用） */
    halo?: boolean
    /** 情侣空间挂件档：一枚小挂坠（纯文字/emoji），空串 = 不渲染 */
    pendant?: string
  }>(),
  {
    label: '',
    color: '',
    online: undefined,
    size: 40,
    status: '',
    halo: false,
    pendant: '',
  },
)

const bg = computed(() => avatarColorByKey(props.color, props.name))
const initial = computed(() => (props.label || props.name).trim().charAt(0).toUpperCase() || '?')
/** 挂件随头像缩放，最小 9px 保证在 24px 头像上也看得清 */
const pendantSize = computed(() => Math.max(9, Math.round(props.size * 0.34)))

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
/* 情侣空间·双人挂件（pendant 档）：绝对定位角标，不参与布局，未解锁时根本不渲染 */
.pendant {
  position: absolute;
  top: -5px;
  right: -5px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  padding: 1px;
  border-radius: 50%;
  background: var(--im-panel, #fff);
  box-shadow: 0 0 0 1px var(--couple-bubble-ring, rgba(236, 95, 146, 0.3));
  animation: couple-pendant-sway 3.6s ease-in-out infinite;
  pointer-events: none;
}
@keyframes couple-pendant-sway {
  0%,
  100% {
    transform: rotate(-7deg);
  }
  50% {
    transform: rotate(7deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .pendant {
    animation: none;
  }
}
</style>

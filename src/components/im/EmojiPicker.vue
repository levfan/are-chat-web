<template>
  <div class="emoji-picker" data-testid="emoji-picker">
    <template v-for="group in groups" :key="group.name">
      <div class="emoji-group-name" :class="{ 'is-couple-pack': group.key === 'couple-pack' }">{{ group.name }}</div>
      <div class="emoji-grid">
        <button
          v-for="emoji in group.emojis"
          :key="group.name + emoji"
          type="button"
          class="emoji-cell"
          :data-emoji-group="group.key ?? 'im'"
          data-testid="emoji-cell"
          @click="emit('select', emoji)"
        >
          {{ emoji }}
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { EMOJI_GROUPS } from '@/utils/imFormat'
import { useAuthStore } from '@/stores/auth'
import { useImStore } from '@/stores/im'
import { useCoupleStore } from '@/stores/couple'
import { COUPLE_VISUAL_TIER, buildCoupleStickers, coupleStickerGroupName } from '@/utils/coupleVisual'

/** 分组：既有的是通用表情，最后一条可能是情侣专属贴纸包 */
interface EmojiGroup {
  name: string
  emojis: string[]
  key?: string
}

const emit = defineEmits<{ select: [emoji: string] }>()

const auth = useAuthStore()
const im = useImStore()
const couple = useCoupleStore()

/**
 * 专属贴纸包（custom-emoji 档）：没建立空间、或档位没解锁时返回空数组，
 * 分组压根不进列表——旁人看到的表情面板跟今天一模一样。
 * 贴纸全部由前端已有数据（双方昵称首字 / 在一起天数 / 空间主题）确定性拼出来，
 * 纯 unicode，不做图片上传。
 */
const couplePack = computed<EmojiGroup[]>(() => {
  const space = couple.space
  if (!couple.established || !space || !couple.tierUnlocked(COUPLE_VISUAL_TIER.customEmoji)) {
    return []
  }
  const emojis = buildCoupleStickers({
    meName: im.myProfile?.nickname || auth.username,
    partnerName: space.partner.petName || space.partner.nickname || space.partner.username,
    days: space.days,
    theme: space.theme,
  })
  return emojis.length > 0 ? [{ key: 'couple-pack', name: coupleStickerGroupName(space.theme), emojis }] : []
})

const groups = computed<EmojiGroup[]>(() => [...EMOJI_GROUPS, ...couplePack.value])
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
/* 专属贴纸包的分组标题带一点情侣强调色（无特效档时这条根本不会出现） */
.emoji-group-name.is-couple-pack {
  color: var(--couple-glow-a, var(--xx-accent, #ec5f92));
  font-weight: 600;
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

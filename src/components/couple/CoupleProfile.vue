<template>
  <div class="profile" data-testid="couple-profile">
    <!-- 宣言：没有则显示引导 -->
    <div class="slogan-box" data-testid="couple-slogan-box">
      <span class="slogan-quote">「</span>
      <span v-if="couple.space?.slogan" class="slogan" data-testid="couple-slogan-text">
        {{ couple.space.slogan }}
      </span>
      <span v-else class="slogan empty" data-testid="couple-slogan-empty">写下我们的宣言，只有彼此懂的那句话…</span>
      <span class="slogan-quote">」</span>
      <button type="button" class="edit-btn" data-testid="couple-profile-edit" @click="openEdit">✏️ 装扮</button>
    </div>

    <!-- 装扮弹窗：宣言 + 主题 + 贴纸墙 -->
    <el-dialog v-model="editVisible" title="装扮我们的小空间 ✨" width="420px" draggable data-testid="couple-profile-dialog">
      <div class="edit-section">
        <h5>💗 我们的宣言</h5>
        <el-input
          v-model="sloganDraft"
          maxlength="60"
          show-word-limit
          placeholder="比如：吵不散，骂不走，一辈子"
          data-testid="couple-slogan-input"
        />
      </div>

      <div class="edit-section">
        <h5>🎨 空间主题</h5>
        <div class="theme-grid">
          <button
            v-for="t in THEMES"
            :key="t.key"
            type="button"
            class="theme-item"
            :class="{ active: themeDraft === t.key }"
            :style="{ background: t.gradient }"
            :data-testid="`couple-theme-${t.key}`"
            @click="themeDraft = t.key"
          >
            {{ t.label }}
            <span v-if="themeDraft === t.key" class="check">✓</span>
          </button>
        </div>
      </div>

      <div class="edit-section">
        <h5>🧸 贴纸墙（选 {{ STICKER_MAX }} 枚展示）</h5>
        <div class="sticker-grid">
          <button
            v-for="s in STICKERS"
            :key="s.key"
            type="button"
            class="sticker-item"
            :class="{ active: picked.includes(s.key) }"
            :data-testid="`couple-sticker-${s.key}`"
            @click="toggleSticker(s.key)"
          >
            <span class="sticker-emoji">{{ s.emoji }}</span>
            <span class="sticker-label">{{ s.label }}</span>
          </button>
        </div>
      </div>

      <template #footer>
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" data-testid="couple-profile-save" @click="onSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useCoupleStore } from '@/stores/couple'
import type { CoupleSpaceTheme } from '@/types'

const STICKER_MAX = 6

const THEMES: { key: CoupleSpaceTheme; label: string; gradient: string }[] = [
  { key: 'classic', label: '经典粉', gradient: 'linear-gradient(90deg,#ffe3e3,#ffd6e7)' },
  { key: 'cherry', label: '樱花', gradient: 'linear-gradient(90deg,#ffe1f0,#f9d1ff)' },
  { key: 'ocean', label: '海盐', gradient: 'linear-gradient(90deg,#d3f3ff,#cfe8ff)' },
  { key: 'forest', label: '森绿', gradient: 'linear-gradient(90deg,#d9f2e0,#e8f5d0)' },
  { key: 'night', label: '星夜', gradient: 'linear-gradient(90deg,#2b3550,#4a3f6b)' },
]

const STICKERS: { key: string; emoji: string; label: string }[] = [
  { key: 'rocket', emoji: '🚀', label: '一起冲' },
  { key: 'cat', emoji: '🐱', label: '小猫咪' },
  { key: 'cake', emoji: '🎂', label: '甜度爆表' },
  { key: 'star', emoji: '⭐', label: '闪耀我们' },
  { key: 'rainbow', emoji: '🌈', label: '风雨之后' },
  { key: 'moon', emoji: '🌙', label: '晚安搭子' },
  { key: 'beer', emoji: '🍻', label: '干杯日常' },
  { key: 'shark', emoji: '🦈', label: '亲密凶猛' },
  { key: 'dog', emoji: '🐶', label: '忠诚搭档' },
  { key: 'ice', emoji: '🍦', label: '甜甜圈日' },
  { key: 'fire', emoji: '🔥', label: '热度不减' },
  { key: 'flower', emoji: '🌸', label: '常年花开' },
]

const couple = useCoupleStore()
const editVisible = ref(false)
const saving = ref(false)
const sloganDraft = ref('')
const themeDraft = ref<CoupleSpaceTheme>('classic')
const picked = ref<string[]>([])

function openEdit() {
  sloganDraft.value = couple.space?.slogan ?? ''
  themeDraft.value = couple.space?.theme ?? 'classic'
  picked.value = (couple.space?.stickers ?? '').split(',').filter(Boolean)
  editVisible.value = true
}

function toggleSticker(key: string) {
  const i = picked.value.indexOf(key)
  if (i >= 0) {
    picked.value.splice(i, 1)
  } else if (picked.value.length < STICKER_MAX) {
    picked.value.push(key)
  } else {
    ElMessage.warning(`最多佩戴 ${STICKER_MAX} 枚贴纸，先摘一枚吧`)
  }
}

async function onSave() {
  saving.value = true
  try {
    await couple.updateProfile({
      slogan: sloganDraft.value.trim(),
      theme: themeDraft.value,
      stickers: picked.value.join(','),
    })
    ElMessage.success('小空间装扮完成 ✨')
    editVisible.value = false
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '保存失败')
  } finally {
    saving.value = false
  }
}

watch(editVisible, () => {
  // 打开时初始化（openEdit 已做）；这里防御性跟随
})
</script>

<style scoped>
.profile {
  display: block;
}
.slogan-box {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 16px;
  border-radius: 10px;
  background: var(--el-fill-color-lighter, #fafafa);
  border: 1px dashed var(--el-border-color-lighter, #ebeef5);
}
.slogan-quote {
  font-size: 18px;
  font-weight: 700;
  color: #f56c6c;
}
.slogan {
  font-size: 14px;
  font-weight: 600;
  word-break: break-all;
}
.slogan.empty {
  color: var(--im-muted, #8f959e);
  font-weight: 400;
}
.edit-btn {
  margin-left: auto;
  border: none;
  background: transparent;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
  cursor: pointer;
  flex-shrink: 0;
}
.edit-btn:hover {
  color: var(--el-color-primary, #409eff);
}
.edit-section {
  margin-bottom: 16px;
}
.edit-section h5 {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 700;
}
.theme-grid {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.theme-item {
  position: relative;
  width: 72px;
  height: 44px;
  border-radius: 8px;
  border: 2px solid transparent;
  font-size: 12px;
  font-weight: 600;
  color: #6b4a4a;
  cursor: pointer;
}
.theme-item.active {
  border-color: var(--el-color-primary, #409eff);
}
.theme-item .check {
  position: absolute;
  right: 3px;
  top: 1px;
  font-size: 11px;
  color: var(--el-color-primary, #409eff);
}
.sticker-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}
.sticker-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 4px;
  border-radius: 8px;
  border: 2px solid transparent;
  background: var(--el-fill-color-lighter, #f5f7fa);
  cursor: pointer;
}
.sticker-item.active {
  border-color: #f56c6c;
  background: #fff5f5;
}
.sticker-emoji {
  font-size: 22px;
}
.sticker-label {
  font-size: 10px;
  color: var(--im-muted, #8f959e);
}
</style>

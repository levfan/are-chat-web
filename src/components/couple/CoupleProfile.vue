<template>
  <div class="profile" data-testid="couple-profile">
    <div class="slogan-box" data-testid="couple-slogan-box">
      <span class="slogan-quote">「</span>
      <span v-if="couple.space?.slogan" class="slogan" data-testid="couple-slogan-text">
        {{ couple.space.slogan }}
      </span>
      <span v-else class="slogan empty" data-testid="couple-slogan-empty">写下我们的宣言，只有彼此懂的那句话…</span>
      <span class="slogan-quote">」</span>
      <button type="button" class="edit-btn" data-testid="couple-profile-edit" @click="onEdit">✏️ 改宣言</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCoupleStore } from '@/stores/couple'

const couple = useCoupleStore()

async function onEdit() {
  let value: string
  try {
    const result = await ElMessageBox.prompt('写一句只有你们俩懂的话', '我们的宣言', {
      inputValue: couple.space?.slogan ?? '',
      inputPlaceholder: '比如：吵不散，骂不走，一辈子',
      inputValidator: (v: string) => (v ?? '').trim().length <= 60 || '最多 60 字',
      confirmButtonText: '保存',
      cancelButtonText: '取消',
    })
    value = result.value ?? ''
  } catch {
    return
  }
  try {
    // 空串 = 清除宣言（null 才是「不改该项」）
    await couple.updateProfile({ slogan: value.trim() })
    ElMessage.success('宣言已更新 ✨')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '保存失败')
  }
}
</script>

<style scoped>
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
</style>

<template>
  <div class="firsts" data-testid="couple-firsts">
    <div class="block-head">
      <h4 class="section-title">🧾 我们的第一次</h4>
      <el-button size="small" round type="primary" plain data-testid="couple-first-add" @click="openAdd">
        + 记一个第一次
      </el-button>
    </div>
    <p class="tip">第一次牵手、第一次旅行、第一次一起做饭……小小的第一次，攒成我们的故事。</p>
    <el-empty
      v-if="!couple.firsts.length"
      description="还没有记录，从「第一次见面」开始吧 🌱"
      :image-size="64"
      data-testid="couple-firsts-empty"
    />
    <div v-else class="first-list">
      <div v-for="f in couple.firsts" :key="f.id" class="first-card" :data-testid="`couple-first-${f.id}`">
        <div class="first-main">
          <p class="first-title">{{ f.title }}</p>
          <span v-if="f.note" class="first-note">{{ f.note }}</span>
        </div>
        <div class="first-side">
          <span class="first-day" data-testid="couple-first-day">{{ f.firstDay }}</span>
          <el-button link type="danger" size="small" :data-testid="`couple-first-del-${f.id}`" @click="onRemove(f)">删除</el-button>
        </div>
      </div>
    </div>

    <!-- 记录第一次弹窗 -->
    <el-dialog v-model="addVisible" title="记一个「我们的第一次」" width="380px" draggable data-testid="couple-first-dialog">
      <el-input
        v-model="draftTitle"
        maxlength="100"
        placeholder="第一次做了什么？（如 第一次一起看海）"
        data-testid="couple-first-title"
      />
      <el-date-picker
        v-model="draftDay"
        type="date"
        value-format="YYYY-MM-DD"
        placeholder="发生的日期"
        class="first-picker"
        data-testid="couple-first-day-input"
      />
      <el-input
        v-model="draftNote"
        type="textarea"
        :rows="2"
        maxlength="300"
        placeholder="当时的心情（可选）"
        data-testid="couple-first-note"
      />
      <template #footer>
        <el-button @click="addVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" data-testid="couple-first-save" @click="onSave">记下来</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCoupleStore } from '@/stores/couple'
import type { CoupleFirstVO } from '@/types'

const couple = useCoupleStore()

const addVisible = ref(false)
const draftTitle = ref('')
const draftDay = ref<string | null>(null)
const draftNote = ref('')
const saving = ref(false)

function openAdd() {
  draftTitle.value = ''
  draftDay.value = null
  draftNote.value = ''
  addVisible.value = true
}

async function onSave() {
  if (!draftTitle.value.trim() || !draftDay.value) {
    ElMessage.warning('写下做了什么，再选个日期吧')
    return
  }
  saving.value = true
  try {
    await couple.addFirst(draftTitle.value.trim(), draftDay.value, draftNote.value.trim() || null)
    ElMessage.success('已记下这个珍贵的第一次 ✨')
    addVisible.value = false
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '记录失败')
  } finally {
    saving.value = false
  }
}

async function onRemove(f: CoupleFirstVO) {
  try {
    await ElMessageBox.confirm(`删除「${f.title}」这条记录吗？`, '删除第一次', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '留下',
    })
    await couple.removeFirst(f.id)
  } catch {
    // 用户取消
  }
}
</script>

<style scoped>
.firsts {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.block-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.section-title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
}
.tip {
  margin: 0;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.first-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.first-card {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  padding: 10px 14px;
}
.first-main {
  flex: 1;
  min-width: 0;
}
.first-title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  word-break: break-all;
}
.first-note {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
  word-break: break-all;
}
.first-side {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.first-day {
  font-size: 12px;
  color: var(--el-color-primary, #409eff);
}
.first-picker {
  width: 100%;
  margin: 10px 0;
}
</style>

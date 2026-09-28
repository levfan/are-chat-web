<template>
  <div class="countdowns" data-testid="couple-countdowns">
    <!-- 新增倒数日 -->
    <div class="add-box">
      <h4 class="section-title">⏳ 期待中的日子</h4>
      <div class="add-row">
        <el-input
          v-model="title"
          maxlength="60"
          placeholder="期待的事：去看海 / TA 的生日惊喜…"
          data-testid="couple-countdown-title"
          @keyup.enter="onAdd"
        />
        <el-date-picker
          v-model="targetDay"
          type="date"
          placeholder="日期"
          value-format="YYYY-MM-DD"
          class="day-picker"
          :disabled-date="(d: Date) => d.getTime() < Date.now() - 86400000"
          data-testid="couple-countdown-day"
        />
        <el-button type="primary" :loading="adding" data-testid="couple-countdown-add" @click="onAdd">
          开始倒数
        </el-button>
      </div>
      <p class="tip">倒数 7/3/1 天和当天会自动提醒双方；实现后标记一下，存进回忆 ✨</p>
    </div>

    <el-empty
      v-if="!couple.countdowns.length"
      description="把下一个期待写下来，每天都有盼头 🎈"
      :image-size="70"
      data-testid="couple-countdowns-empty"
    />
    <div v-else class="countdown-list">
      <div
        v-for="c in couple.countdowns"
        :key="c.id"
        class="countdown-card"
        :class="{ done: c.done, urgent: !c.done && c.daysLeft <= 3 }"
        :data-testid="`couple-countdown-${c.id}`"
      >
        <div class="cd-left">
          <span class="cd-days" data-testid="couple-countdown-days">
            {{ c.done ? '🎉' : c.daysLeft > 0 ? c.daysLeft : '今天' }}
          </span>
          <span class="cd-unit">{{ c.done ? '已实现' : c.daysLeft > 0 ? '天后' : '' }}</span>
        </div>
        <div class="cd-body">
          <p class="cd-title" data-testid="couple-countdown-title-text">{{ c.title }}</p>
          <p class="cd-meta">{{ c.targetDay }}<template v-if="c.note"> · {{ c.note }}</template></p>
        </div>
        <div class="cd-actions">
          <el-button
            v-if="!c.done"
            size="small"
            round
            type="success"
            plain
            data-testid="couple-countdown-done"
            @click="onDone(c.id, true)"
          >
            实现啦 ✨
          </el-button>
          <el-button v-else size="small" round plain data-testid="couple-countdown-undone" @click="onDone(c.id, false)">
            恢复倒数
          </el-button>
          <el-button size="small" round type="danger" plain data-testid="couple-countdown-delete" @click="onDelete(c.id)">
            删除
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCoupleStore } from '@/stores/couple'

const couple = useCoupleStore()
const title = ref('')
const targetDay = ref('')
const adding = ref(false)

async function onAdd() {
  const text = title.value.trim()
  if (!text) {
    ElMessage.warning('先写下期待的事')
    return
  }
  if (!targetDay.value) {
    ElMessage.warning('选择一个目标日期')
    return
  }
  adding.value = true
  try {
    await couple.addCountdown(text, targetDay.value)
    title.value = ''
    targetDay.value = ''
    ElMessage.success('倒数开始！每天看一眼，期待又近一天 ⏳')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '添加失败')
  } finally {
    adding.value = false
  }
}

async function onDone(id: string, done: boolean) {
  try {
    await couple.doneCountdown(id, done)
    ElMessage.success(done ? '期待成真，已存进回忆 🎉' : '已恢复倒数')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '操作失败')
  }
}

async function onDelete(id: string) {
  try {
    await ElMessageBox.confirm('确定删除这个倒数日吗？', '删除倒数日', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '再想想',
    })
    await couple.deleteCountdown(id)
  } catch {
    // 用户取消
  }
}

onMounted(() => {
  void couple.loadCountdowns()
})
</script>

<style scoped>
.countdowns {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.section-title {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 700;
}
.add-box {
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  padding: 14px;
}
.add-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.day-picker {
  width: 140px;
}
.tip {
  margin: 8px 0 0;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.countdown-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.countdown-card {
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  padding: 10px 14px;
}
.countdown-card.done {
  opacity: 0.65;
  background: #f0f9eb;
}
.countdown-card.urgent {
  border-color: #f89898;
  background: #fff5f5;
}
.cd-left {
  display: flex;
  align-items: baseline;
  gap: 3px;
  min-width: 64px;
  justify-content: center;
}
.cd-days {
  font-size: 26px;
  font-weight: 700;
  color: #f56c6c;
}
.cd-unit {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.cd-body {
  flex: 1;
  min-width: 0;
}
.cd-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  word-break: break-all;
}
.cd-meta {
  margin: 2px 0 0;
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.cd-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}
</style>

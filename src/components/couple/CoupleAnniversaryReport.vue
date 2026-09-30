<template>
  <div class="report" data-testid="couple-anniv-report">
    <!-- F85 周年报告 -->
    <div class="card" data-testid="couple-report-year">
      <h4 class="title">🎂 周年报告 <span class="sub">这一年我们，值得一页纸</span></h4>
      <template v-if="couple.anniversaryReport">
        <div class="report-head">
          在一起第 <span class="nth">{{ couple.anniversaryReport.nthYear }}</span> 年
          <span class="since">（自 {{ couple.anniversaryReport.sinceDay }} 起）</span>
        </div>
        <div class="report-grid">
          <div v-for="item in couple.anniversaryReport.items" :key="item.key" class="report-cell" :data-testid="`couple-report-${item.key}`">
            <span class="cell-emoji">{{ item.emoji }}</span>
            <span class="cell-value">{{ item.value }}</span>
            <span class="cell-unit">{{ item.unit }}</span>
            <span class="cell-label">{{ item.label }}</span>
          </div>
        </div>
        <p class="summary" data-testid="couple-report-summary">{{ couple.anniversaryReport.summary }}</p>
      </template>
      <p v-else class="hint">报告还在路上，稍等一下 ⏳</p>
    </div>

    <!-- F86 生日回顾 -->
    <div class="card" data-testid="couple-birthday">
      <h4 class="title">🎈 生日回顾 <span class="sub">TA 生日那天，我们的历史</span></h4>
      <el-button size="small" :loading="loadingLook" data-testid="couple-birthday-load" @click="onLook">
        翻开 TA 的生日记忆
      </el-button>
      <div v-if="couple.birthdayLook" class="look" data-testid="couple-birthday-result">
        <div class="look-head">
          {{ couple.birthdayLook.partnerLabel }} 的生日是 {{ couple.birthdayLook.birthday }}
        </div>
        <el-empty v-if="!couple.birthdayLook.events.length" description="那天的记忆还是空白——今年一起补上" :image-size="48" />
        <div v-for="(e, i) in couple.birthdayLook.events" :key="i" class="look-row" :data-testid="`couple-birthday-event-${i}`">
          <span class="look-day">{{ e.day }}</span>
          <span>{{ e.icon }}</span>
          <span class="look-main">
            <span class="look-title">{{ e.title }}</span>
            <span v-if="e.detail" class="look-detail">{{ e.detail }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useCoupleStore } from '@/stores/couple'

const couple = useCoupleStore()
const loadingLook = ref(false)

async function onLook() {
  loadingLook.value = true
  try {
    await couple.loadBirthdayLook()
  } catch (e) {
    ElMessage.info(e instanceof Error ? e.message : '还没有可以回顾的生日记忆')
  } finally {
    loadingLook.value = false
  }
}

onMounted(() => {
  if (!couple.anniversaryReport) {
    void couple.loadChronicle()
  }
})
</script>

<style scoped>
.report {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.card {
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 12px;
  padding: 14px;
}
.title {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 700;
}
.sub {
  margin-left: 6px;
  font-size: 12px;
  font-weight: 400;
  color: var(--im-muted, #8f959e);
}
.report-head {
  font-size: 13px;
  margin-bottom: 10px;
}
.nth {
  font-size: 20px;
  font-weight: 700;
  color: var(--el-color-danger, #f56c6c);
}
.since {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.report-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 10px;
}
.report-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  padding: 10px 4px;
}
.cell-emoji {
  font-size: 18px;
}
.cell-value {
  font-size: 20px;
  font-weight: 700;
}
.cell-unit {
  font-size: 10px;
  color: var(--im-muted, #8f959e);
}
.cell-label {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.summary {
  margin: 0;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.hint {
  margin: 0;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.look {
  margin-top: 10px;
}
.look-head {
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 8px;
}
.look-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 4px 0 4px 8px;
  border-left: 2px solid var(--el-border-color-lighter, #ebeef5);
}
.look-day {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
  min-width: 78px;
}
.look-main {
  display: flex;
  flex-direction: column;
}
.look-title {
  font-size: 13px;
  font-weight: 600;
}
.look-detail {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
  word-break: break-all;
}
</style>

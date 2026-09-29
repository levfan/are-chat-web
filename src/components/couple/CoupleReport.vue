<template>
  <div class="report" data-testid="couple-report">
    <div class="report-head">
      <h4 class="section-title">📰 恋爱月报</h4>
      <el-date-picker
        v-model="month"
        type="month"
        value-format="YYYY-MM"
        :clearable="false"
        class="month-picker"
        data-testid="couple-report-month"
        @change="reload"
      />
    </div>

    <!-- F29 月报 -->
    <div v-if="couple.monthlyReport" class="report-body" data-testid="couple-report-body">
      <div class="stat-grid">
        <div
          v-for="item in couple.monthlyReport.items"
          :key="item.key"
          class="stat-cell"
          :data-testid="`couple-report-${item.key}`"
        >
          <span class="stat-emoji">{{ item.emoji }}</span>
          <span class="stat-value">{{ item.value }}<i class="stat-unit">{{ item.unit }}</i></span>
          <span class="stat-label">{{ item.label }}</span>
        </div>
      </div>
      <p class="summary" data-testid="couple-report-summary">{{ couple.monthlyReport.summary }}</p>
    </div>

    <!-- F30 数据总览 -->
    <h4 class="section-title mt">📊 恋爱数据总览</h4>
    <div v-if="couple.dataOverview" class="report-body" data-testid="couple-overview-body">
      <div class="days-line" data-testid="couple-overview-days">
        在一起 <b>{{ couple.dataOverview.daysTogether }}</b> 天，我们累计——
      </div>
      <div class="stat-grid">
        <div
          v-for="item in couple.dataOverview.items"
          :key="item.key"
          class="stat-cell"
          :data-testid="`couple-overview-${item.key}`"
        >
          <span class="stat-emoji">{{ item.emoji }}</span>
          <span class="stat-value">{{ item.value }}<i class="stat-unit">{{ item.unit }}</i></span>
          <span class="stat-label">{{ item.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useCoupleStore } from '@/stores/couple'

const couple = useCoupleStore()
const month = ref(new Date().toISOString().slice(0, 7))

function reload() {
  void couple.loadMonthlyReport(month.value)
  void couple.loadDataOverview()
}

onMounted(reload)
</script>

<style scoped>
.report {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.section-title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
}
.section-title.mt {
  margin-top: 8px;
}
.report-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.month-picker {
  width: 130px;
}
.report-body {
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  padding: 14px;
  background: linear-gradient(180deg, #fffdfd, #fff8f8);
}
.stat-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}
@media (max-width: 640px) {
  .stat-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
.stat-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 4px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.65);
}
.stat-emoji {
  font-size: 18px;
}
.stat-value {
  font-size: 16px;
  font-weight: 700;
  color: #f56c6c;
}
.stat-unit {
  font-style: normal;
  font-size: 10px;
  color: var(--im-muted, #8f959e);
  margin-left: 1px;
}
.stat-label {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.summary {
  margin: 10px 0 0;
  font-size: 13px;
  line-height: 1.7;
  text-align: center;
  color: #c45656;
}
.days-line {
  margin: 0 0 10px;
  font-size: 13px;
  color: var(--im-muted, #8f959e);
}
.days-line b {
  color: #f56c6c;
  font-size: 16px;
}
</style>

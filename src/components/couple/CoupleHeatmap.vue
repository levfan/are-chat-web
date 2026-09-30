<template>
  <div class="heatmap" data-testid="couple-heatmap">
    <h4 class="title">🔥 年度热力日历 <span class="sub">你们用心经营每一天的证明</span></h4>
    <div class="year-row">
      <el-radio-group v-model="year" size="small" data-testid="couple-heatmap-year" @change="onYear">
        <el-radio-button v-for="y in yearOptions" :key="y" :value="y">{{ y }} 年</el-radio-button>
      </el-radio-group>
      <span v-if="couple.yearHeatmap" class="active-count" data-testid="couple-heatmap-total">
        有互动的日子：{{ couple.yearHeatmap.totalActive }} 天
      </span>
    </div>
    <div v-if="couple.yearHeatmap" class="grid-scroll" data-testid="couple-heatmap-grid">
      <div class="grid">
        <div
          v-for="cell in couple.yearHeatmap.days"
          :key="cell.day"
          class="cell"
          :class="`lv${cell.level}`"
          :title="`${cell.day}：${cell.count} 次互动`"
          :data-testid="`couple-heatmap-cell-${cell.day}`"
        />
      </div>
    </div>
    <div class="legend">
      <span>少</span>
      <span class="cell lv0" /><span class="cell lv1" /><span class="cell lv2" /><span class="cell lv3" />
      <span>多</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useCoupleStore } from '@/stores/couple'

const couple = useCoupleStore()
const thisYear = new Date().getFullYear()
const year = ref(thisYear)
const yearOptions = [thisYear, thisYear - 1, thisYear - 2]

async function onYear(y: number | string | boolean | undefined) {
  await couple.loadHeatmap(Number(y))
}

onMounted(() => {
  void couple.loadHeatmap(year.value)
})
</script>

<style scoped>
.heatmap {
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
.year-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}
.active-count {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.grid-scroll {
  overflow-x: auto;
  padding-bottom: 4px;
}
.grid {
  display: grid;
  grid-template-rows: repeat(7, 12px);
  grid-auto-flow: column;
  grid-auto-columns: 12px;
  gap: 3px;
  min-width: max-content;
}
.cell {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background: var(--el-fill-color-light, #f0f2f5);
}
.cell.lv1 {
  background: #ffcdd2;
}
.cell.lv2 {
  background: #ef8a9b;
}
.cell.lv3 {
  background: var(--el-color-danger, #ec5f92);
}
.legend {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.legend .cell {
  width: 10px;
  height: 10px;
}
</style>

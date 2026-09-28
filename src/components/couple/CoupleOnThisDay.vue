<template>
  <div class="on-this-day" data-testid="couple-on-this-day">
    <h4 class="section-title">🕰️ 那年今天</h4>
    <el-empty
      v-if="!couple.onThisDay.length"
      description="历史上的今天还没有故事，继续创造吧 ☀️"
      :image-size="64"
      data-testid="couple-on-this-day-empty"
    />
    <div v-else class="event-list">
      <div v-for="(e, i) in couple.onThisDay" :key="`${e.day}-${i}`" class="event-card" :data-testid="`couple-otd-${e.type}`">
        <span class="event-year">{{ yearOf(e.day) }}</span>
        <div class="event-body">
          <p class="event-title">{{ e.title }}</p>
          <p v-if="e.detail" class="event-detail">{{ e.detail }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCoupleStore } from '@/stores/couple'

const couple = useCoupleStore()

function yearOf(day: string) {
  return day ? day.slice(0, 4) : ''
}

onMounted(() => {
  void couple.loadOnThisDay()
})
</script>

<style scoped>
.on-this-day {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.section-title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
}
.event-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.event-card {
  display: flex;
  align-items: baseline;
  gap: 10px;
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  padding: 10px 14px;
  background: linear-gradient(90deg, #fffdf5, #fff5f5);
}
.event-year {
  flex-shrink: 0;
  font-size: 15px;
  font-weight: 700;
  color: #c45656;
}
.event-body {
  min-width: 0;
}
.event-title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.6;
  word-break: break-all;
}
.event-detail {
  margin: 2px 0 0;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
  word-break: break-all;
}
</style>

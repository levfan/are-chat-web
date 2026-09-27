<template>
  <div class="timeline" data-testid="couple-timeline">
    <div class="timeline-head">
      <h4 class="section-title">📖 我们的故事</h4>
      <span class="timeline-sub">最近 30 天的甜蜜足迹，自动记录你们的一切</span>
    </div>

    <el-empty
      v-if="!couple.timeline.length && !loading"
      description="还没有故事，去打个卡、记个约定吧 💕"
      :image-size="80"
      data-testid="couple-timeline-empty"
    />

    <div v-for="day in couple.timeline" :key="day.day" class="day-group">
      <div class="day-label" :class="{ today: day.day === today }">
        {{ dayLabel(day.day) }}
      </div>
      <div class="event-list">
        <div v-for="(event, index) in day.events" :key="`${day.day}-${index}`" class="event-row">
          <span class="event-dot" :class="event.type">{{ TYPE_ICONS[event.type] ?? '💗' }}</span>
          <div class="event-main">
            <span class="event-title">
              <span v-if="event.byUser" class="event-who" :class="{ mine: event.byUser === auth.username }">
                {{ event.byUser === auth.username ? '我' : 'TA' }}
              </span>
              {{ event.title }}
            </span>
            <span v-if="event.detail" class="event-detail">{{ event.detail }}</span>
          </div>
          <span v-if="event.at" class="event-time">{{ timeLabel(event.at) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCoupleStore } from '@/stores/couple'

const TYPE_ICONS: Record<string, string> = {
  space: '💕',
  ritual: '🌅',
  question: '💬',
  promise: '🤝',
  item: '✅',
  anniversary: '🎊',
}

const auth = useAuthStore()
const couple = useCoupleStore()
const loading = ref(false)

const today = new Date().toLocaleDateString('sv-SE')

function dayLabel(day: string) {
  if (day === today) return '今天'
  const d = new Date(`${day}T00:00:00`)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  if (day === yesterday.toLocaleDateString('sv-SE')) return '昨天'
  const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()]
  return `${d.getMonth() + 1}月${d.getDate()}日 · ${week}`
}

function timeLabel(at: number) {
  const d = new Date(at)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

onMounted(async () => {
  loading.value = true
  try {
    await couple.loadTimeline()
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.timeline {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.timeline-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.section-title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
}
.timeline-sub {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.day-group {
  display: flex;
  gap: 12px;
}
.day-label {
  width: 92px;
  flex-shrink: 0;
  padding-top: 2px;
  font-size: 12px;
  font-weight: 700;
  color: var(--im-muted, #8f959e);
  text-align: right;
}
.day-label.today {
  color: var(--el-color-primary, #409eff);
}
@media (max-width: 640px) {
  .day-group {
    flex-direction: column;
    gap: 6px;
  }
  .day-label {
    width: auto;
    text-align: left;
  }
}
.event-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-left: 2px solid var(--el-border-color-lighter, #ebeef5);
  padding-left: 12px;
  margin-left: -2px;
}
.event-row {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: var(--el-fill-color-lighter, #fafafa);
  border-radius: 10px;
  padding: 10px 12px;
}
.event-dot {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border-radius: 50%;
  background: var(--el-color-primary-light-9, #ecf5ff);
}
.event-dot.anniversary {
  background: var(--el-color-danger-light-9, #fef0f0);
}
.event-dot.ritual {
  background: var(--el-color-warning-light-9, #fdf6ec);
}
.event-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.event-title {
  font-size: 13px;
  font-weight: 600;
  word-break: break-all;
}
.event-who {
  display: inline-block;
  margin-right: 4px;
  padding: 0 6px;
  font-size: 11px;
  border-radius: 8px;
  background: var(--el-color-primary-light-8, #d9ecff);
  color: var(--el-color-primary, #409eff);
}
.event-who.mine {
  background: var(--el-color-success-light-8, #e1f3d8);
  color: var(--el-color-success, #67c23a);
}
.event-detail {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
  word-break: break-all;
}
.event-time {
  flex-shrink: 0;
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
</style>

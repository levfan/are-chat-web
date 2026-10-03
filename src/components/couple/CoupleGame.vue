<template>
  <div class="game" data-testid="couple-game">
    <!-- F35 恋爱红绿灯 -->
    <div v-if="couple.trafficLight" class="light-box" :class="couple.trafficLight.light" data-testid="couple-traffic-light">
      <span class="light-dot">{{ couple.trafficLight.light === 'GREEN' ? '🟢' : couple.trafficLight.light === 'YELLOW' ? '🟡' : '🔴' }}</span>
      <div class="light-body">
        <p class="light-title" data-testid="couple-light-title">
          {{ couple.trafficLight.title }}
          <span class="light-detail">{{ couple.trafficLight.detail }}</span>
        </p>
        <p class="light-advice">{{ couple.trafficLight.advice }}</p>
      </div>
    </div>

    <!-- F31 今日心动加成 -->
    <div class="boost-box" data-testid="couple-boost">
      <div class="boost-head">
        <h4 class="section-title">⚡ 今日心动加成</h4>
        <span class="boost-total" data-testid="couple-boost-total">+{{ couple.boost?.totalBonus ?? 0 }} / 20</span>
      </div>
      <div class="boost-grid">
        <div
          v-for="item in couple.boost?.items ?? []"
          :key="item.key"
          class="boost-item"
          :class="{ done: item.done }"
          :data-testid="`couple-boost-${item.key}`"
        >
          <span class="boost-emoji">{{ item.done ? '✅' : item.emoji }}</span>
          <span class="boost-label">{{ item.label }}</span>
          <span class="boost-bonus">+{{ item.bonus }}</span>
        </div>
      </div>
      <p class="boost-cheer" data-testid="couple-boost-cheer">{{ couple.boost?.cheer }}</p>
    </div>

    <!-- F33 互动热力图 -->
    <div class="heat-box" data-testid="couple-game-heat">
      <div class="heat-head">
        <h4 class="section-title">🔥 互动热力图</h4>
        <span class="heat-meta">最近 12 周 · 有互动 {{ couple.heatmap?.activeDays ?? 0 }} 天</span>
      </div>
      <div class="heat-grid" data-testid="couple-heat-cells">
        <span
          v-for="cell in couple.heatmap?.cells ?? []"
          :key="cell.day"
          class="heat-cell"
          :class="`l${cell.level}`"
          :title="`${cell.day}：${cell.count} 次互动`"
        />
      </div>
      <div class="heat-legend">
        <span>少</span>
        <span class="heat-cell l0" /><span class="heat-cell l1" /><span class="heat-cell l2" /><span class="heat-cell l3" /><span class="heat-cell l4" />
        <span>多</span>
      </div>
    </div>

    <!-- F34 心情曲线 -->
    <div class="curve-box" data-testid="couple-mood-curve">
      <div class="heat-head">
        <h4 class="section-title">📈 心情曲线</h4>
        <span class="heat-meta">最近 30 天 · 我 {{ couple.moodCurve?.myAvg ?? '-' }} 分 / TA {{ couple.moodCurve?.partnerAvg ?? '-' }} 分</span>
      </div>
      <svg viewBox="0 0 300 100" class="curve-svg" preserveAspectRatio="none" data-testid="couple-curve-svg">
        <polyline :points="linePoints('mine')" fill="none" stroke="#f56c6c" stroke-width="1.6" />
        <polyline :points="linePoints('partner')" fill="none" stroke="#7ba7ff" stroke-width="1.6" stroke-dasharray="3 2" />
      </svg>
      <p class="curve-legend">💗 我　　💙 TA（1 分最低 5 分最高，没记录当天为空档）</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCoupleStore } from '@/stores/couple'

const couple = useCoupleStore()

/** 把 30 天心情分映射为 SVG 折线点 */
function linePoints(which: 'mine' | 'partner') {
  const days = couple.moodCurve?.days ?? []
  if (!days.length) {
    return ''
  }
  const step = 300 / Math.max(days.length - 1, 1)
  const points: string[] = []
  days.forEach((d, i) => {
    const v = which === 'mine' ? d.mine : d.partner
    if (v != null) {
      // 1 分 → y=92，5 分 → y=8
      const y = 92 - ((v - 1) / 4) * 84
      points.push(`${(i * step).toFixed(1)},${y.toFixed(1)}`)
    }
  })
  return points.join(' ')
}

onMounted(() => {
  void couple.loadGame()
})
</script>

<style scoped>
.game {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.section-title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
}
.light-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
}
.light-box.GREEN {
  background: #f0f9eb;
  border-color: #c2e7b0;
}
.light-box.YELLOW {
  background: #fdf6ec;
  border-color: #f3d19e;
}
.light-box.RED {
  background: #fef0f0;
  border-color: #fbc4c4;
}
.light-dot {
  font-size: 26px;
}
.light-body {
  flex: 1;
  min-width: 0;
}
.light-title {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
}
.light-detail {
  font-weight: 400;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
  margin-left: 6px;
}
.light-advice {
  margin: 3px 0 0;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.boost-box,
.heat-box,
.curve-box {
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  padding: 14px;
}
.boost-head,
.heat-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}
.boost-total {
  font-size: 14px;
  font-weight: 700;
  color: #f56c6c;
}
.boost-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}
@media (max-width: 640px) {
  .boost-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
.boost-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 4px;
  border-radius: 8px;
  background: var(--el-fill-color-lighter, #f5f7fa);
  opacity: 0.7;
}
.boost-item.done {
  opacity: 1;
  background: #fff5f5;
}
.boost-emoji {
  font-size: 18px;
}
.boost-label {
  font-size: 11px;
  font-weight: 600;
}
.boost-bonus {
  font-size: 10px;
  color: #f56c6c;
  font-weight: 700;
}
.boost-cheer {
  margin: 10px 0 0;
  font-size: 12px;
  text-align: center;
  color: var(--im-muted, #8f959e);
}
.heat-meta {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.heat-grid {
  display: grid;
  grid-template-rows: repeat(12, 12px);
  grid-auto-flow: column;
  grid-auto-columns: 12px;
  gap: 3px;
  overflow-x: auto;
  padding-bottom: 4px;
}
.heat-cell {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  display: inline-block;
}
.heat-cell.l0 {
  background: var(--el-fill-color-light, #f0f2f5);
}
.heat-cell.l1 {
  background: #ffd6d6;
}
.heat-cell.l2 {
  background: #ffb3b3;
}
.heat-cell.l3 {
  background: #f98a8a;
}
.heat-cell.l4 {
  background: #f56c6c;
}
.heat-legend {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  font-size: 10px;
  color: var(--im-muted, #8f959e);
}
.curve-svg {
  width: 100%;
  height: 90px;
  background: var(--el-fill-color-lighter, #fafafa);
  border-radius: 8px;
}
.curve-legend {
  margin: 6px 0 0;
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
</style>

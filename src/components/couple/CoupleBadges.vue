<template>
  <div class="badges" data-testid="couple-badges">
    <div class="badge-summary" data-testid="couple-badge-summary">
      <span class="sum-num">{{ couple.badges?.achievedCount ?? 0 }}</span>
      <span class="sum-label">/ {{ couple.badges?.total ?? 0 }} 枚徽章已点亮</span>
    </div>

    <!-- 里程碑徽章 -->
    <div class="badge-box" data-testid="couple-milestones">
      <h4 class="section-title">💍 在一起的里程碑</h4>
      <div class="milestone-grid">
        <div
          v-for="b in couple.badges?.milestones ?? []"
          :key="b.id"
          class="badge-card"
          :class="{ achieved: b.achieved }"
          :title="`${b.targetDays} 天`"
        >
          <span class="badge-emoji">{{ b.achieved ? b.emoji : '🔒' }}</span>
          <span class="badge-title">{{ b.title }}</span>
          <el-progress
            class="badge-progress"
            :percentage="b.progress"
            :stroke-width="5"
            :show-text="false"
            :color="PROGRESS_COLOR"
          />
          <span class="badge-sub">{{ b.achieved ? '已点亮 ✨' : `${b.targetDays} 天` }}</span>
        </div>
      </div>
    </div>

    <!-- 行为成就 -->
    <div class="badge-box" data-testid="couple-achievements">
      <h4 class="section-title">🏆 我们的成就</h4>
      <div class="achieve-grid">
        <div
          v-for="a in couple.badges?.achievements ?? []"
          :key="a.id"
          class="achieve-card"
          :class="{ achieved: a.achieved }"
          :data-testid="`couple-achieve-${a.id}`"
        >
          <div class="achieve-head">
            <span class="achieve-emoji">{{ a.achieved ? a.emoji : '🔒' }}</span>
            <span class="achieve-title">{{ a.title }}</span>
          </div>
          <span class="achieve-desc">{{ a.desc }}</span>
          <el-progress
            class="achieve-progress"
            :percentage="Math.min(100, Math.round((a.current / a.target) * 100))"
            :stroke-width="5"
            :show-text="false"
            :color="PROGRESS_COLOR"
          />
          <span class="achieve-sub">{{ a.current }} / {{ a.target }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCoupleStore } from '@/stores/couple'

const PROGRESS_COLOR = '#f56c6c'
const couple = useCoupleStore()

onMounted(() => {
  void couple.loadBadges()
})
</script>

<style scoped>
.badges {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.section-title {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 700;
}
.badge-box {
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  padding: 14px;
}
.badge-summary {
  display: flex;
  align-items: baseline;
  gap: 6px;
  padding: 12px 16px;
  border-radius: 10px;
  background: linear-gradient(90deg, #fff5f5, #fff0f6);
}
.sum-num {
  font-size: 26px;
  font-weight: 700;
  color: #f56c6c;
}
.sum-label {
  font-size: 13px;
  color: var(--im-muted, #8f959e);
}
.milestone-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}
@media (max-width: 640px) {
  .milestone-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
.badge-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 12px 6px;
  border-radius: 10px;
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  background: var(--el-fill-color-lighter, #fafafa);
  filter: grayscale(0.9);
  opacity: 0.75;
}
.badge-card.achieved {
  filter: none;
  opacity: 1;
  background: #fff5f5;
  border-color: #f89898;
}
.badge-emoji {
  font-size: 24px;
}
.badge-title {
  font-size: 11px;
  font-weight: 700;
}
.badge-progress {
  width: 100%;
}
.badge-sub {
  font-size: 10px;
  color: var(--im-muted, #8f959e);
}
.achieve-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
@media (max-width: 720px) {
  .achieve-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
.achieve-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  background: var(--el-fill-color-lighter, #fafafa);
}
.achieve-card.achieved {
  background: #fff5f5;
  border-color: #f89898;
}
.achieve-head {
  display: flex;
  align-items: center;
  gap: 6px;
}
.achieve-emoji {
  font-size: 18px;
}
.achieve-title {
  font-size: 12px;
  font-weight: 700;
}
.achieve-desc {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.achieve-progress {
  width: 100%;
}
.achieve-sub {
  font-size: 10px;
  color: var(--im-muted, #8f959e);
  text-align: right;
}
</style>

<template>
  <div class="garden-wrap" data-testid="couple-garden">
    <!-- F54 爱情花园 -->
    <div class="garden-card" :class="{ withered: couple.garden?.withered }" data-testid="couple-garden-card">
      <div class="garden-visual">
        <span class="garden-emoji" data-testid="couple-garden-emoji">{{ couple.garden?.emoji ?? '🌰' }}</span>
        <div class="garden-info">
          <p class="garden-name">
            爱情花园 · <b>{{ couple.garden?.stageName ?? '种子' }}</b>
            <span class="garden-stage">阶段 {{ couple.garden?.stage ?? 0 }}/6</span>
          </p>
          <p class="garden-desc" data-testid="couple-garden-desc">{{ gardenDesc }}</p>
        </div>
      </div>
      <el-progress
        :percentage="stagePercent"
        :stroke-width="10"
        :format="() => `${couple.garden?.totalWater ?? 0} 次浇水`"
        data-testid="couple-garden-progress"
      />
      <div class="garden-actions">
        <el-button
          type="primary"
          round
          :disabled="couple.garden?.withered ? false : (couple.garden?.wateredTodayMe ?? false)"
          :loading="watering"
          data-testid="couple-garden-water"
          @click="onWater"
        >
          {{ couple.garden?.withered ? '🚑 救救小树' : couple.garden?.wateredTodayMe ? '今天已浇水 💧' : '💧 浇水' }}
        </el-button>
        <span class="garden-partner">
          {{ couple.garden?.wateredTodayPartner ? 'TA 今天已经浇过啦 🌼' : 'TA 今天还没浇水哦' }}
        </span>
      </div>
      <p v-if="couple.garden?.withered" class="garden-alert" data-testid="couple-garden-withered">
        🥀 小树已经 {{ couple.garden.daysSinceWater }} 天没喝到水了，快浇水解救它！
      </p>
      <p v-else class="tip">
        每人每天浇一次水；浇满 7 次升一个阶段，从种子到繁茂要 49 天的坚持；3 天没人管它会蔫掉。
      </p>
    </div>

    <div class="garden-row">
      <!-- F55 每日玫瑰 -->
      <div class="half-card" data-testid="couple-roses">
        <h4 class="section-title">🌹 每日玫瑰</h4>
        <p class="tip">每天 3 朵，选一朵花送给 TA，花语随机附上。</p>
        <div class="flower-grid">
          <button
            v-for="f in flowers"
            :key="f.key"
            type="button"
            class="flower-btn"
            :disabled="sendingFlower !== null || remaining <= 0"
            :data-testid="`couple-rose-${f.key}`"
            @click="onSendRose(f.key)"
          >
            <span class="flower-emoji">{{ f.emoji }}</span>
            <span class="flower-name">{{ f.name }}</span>
          </button>
        </div>
        <div class="rose-remain" data-testid="couple-rose-remain">
          今天还能送 <b>{{ remaining }}</b> 朵 · TA 今天送了 {{ couple.roseBoard?.todayPartner ?? 0 }} 朵
        </div>
        <div v-if="todayRoses.length" class="rose-list">
          <div v-for="r in todayRoses" :key="r.id" class="rose-item">
            <span>{{ r.emoji }}</span>
            <span class="rose-word">{{ r.word }}</span>
            <span class="rose-from">{{ r.fromUser === auth.username ? '我送的' : 'TA 送的' }}</span>
          </div>
        </div>
      </div>

      <!-- F56 幸运签 -->
      <div class="half-card" data-testid="couple-slips">
        <h4 class="section-title">🔮 幸运签</h4>
        <p class="tip">每天可以为 TA 抽一支签，把好运寄过去（可重抽覆盖）。</p>
        <div class="slip-slot" data-testid="couple-slip-mine">
          <template v-if="couple.slipBoard?.mySlipToday">
            <el-tag :type="slipTagType(couple.slipBoard.mySlipToday.level)" size="small">
              {{ couple.slipBoard.mySlipToday.level }}
            </el-tag>
            <span class="slip-text">{{ couple.slipBoard.mySlipToday.content }}</span>
            <span class="slip-note">我抽给 TA 的</span>
          </template>
          <span v-else class="slip-empty">今天还没为 TA 抽签</span>
        </div>
        <div class="slip-slot" data-testid="couple-slip-received">
          <template v-if="couple.slipBoard?.receivedToday">
            <el-tag :type="slipTagType(couple.slipBoard.receivedToday.level)" size="small">
              {{ couple.slipBoard.receivedToday.level }}
            </el-tag>
            <span class="slip-text">{{ couple.slipBoard.receivedToday.content }}</span>
            <span class="slip-note">TA 抽给我的</span>
          </template>
          <span v-else class="slip-empty">今天 TA 还没为我抽签</span>
        </div>
        <el-button type="primary" round :loading="drawing" data-testid="couple-slip-draw" @click="onDrawSlip">
          🔮 为 TA 抽一支签
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useCoupleStore } from '@/stores/couple'
import type { CoupleRoseVO } from '@/types'

const auth = useAuthStore()
const couple = useCoupleStore()

const watering = ref(false)
const drawing = ref(false)
const sendingFlower = ref<string | null>(null)

const flowers = [
  { key: 'rose', emoji: '🌹', name: '玫瑰' },
  { key: 'tulip', emoji: '🌷', name: '郁金香' },
  { key: 'sunflower', emoji: '🌻', name: '向日葵' },
  { key: 'lily', emoji: '🤍', name: '百合' },
  { key: 'carnation', emoji: '🌸', name: '康乃馨' },
  { key: 'daisy', emoji: '🌼', name: '雏菊' },
  { key: 'lavender', emoji: '💜', name: '薰衣草' },
  { key: 'gypsophila', emoji: '✨', name: '满天星' },
]

const gardenDesc = computed(() => {
  const g = couple.garden
  if (!g) return '你们的花园还在开垦中…'
  if (g.withered) return '小树蔫蔫的，需要一次浇水的急救 🥀'
  if (g.stage >= 6) return '小树已经枝繁叶茂，这是你们一起浇出来的春天 🌳'
  if (g.waterToNextStage <= 3) return `再浇 ${g.waterToNextStage} 次水就能升级啦，冲呀 🌱`
  return `距离下一个阶段还要浇 ${g.waterToNextStage} 次水，急不来，慢慢来 💧`
})

const stagePercent = computed(() => {
  const g = couple.garden
  if (!g) return 0
  return Math.min(100, Math.round((g.totalWater / 49) * 100))
})

const remaining = computed(() => couple.roseBoard?.remainingToday ?? 3)
const todayRoses = computed(() => couple.roseBoard?.today ?? [])

function slipTagType(level: string) {
  if (level === '大吉' || level === '锦鲤') return 'success'
  if (level === '中吉') return 'primary'
  return 'info'
}

async function onWater() {
  watering.value = true
  try {
    await couple.waterGarden()
    ElMessage.success('浇好水啦 💧 小树咕咚咕咚喝饱了')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '浇水失败')
  } finally {
    watering.value = false
  }
}

async function onSendRose(key: string) {
  sendingFlower.value = key
  try {
    await couple.sendRose(key)
    ElMessage.success('花已送出 🌹 花语也一并寄到')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '送花失败')
  } finally {
    sendingFlower.value = null
  }
}

async function onDrawSlip() {
  drawing.value = true
  try {
    const board = couple.slipBoard
    await couple.drawSlip()
    const text = couple.slipBoard?.mySlipToday?.content ?? ''
    if (board?.mySlipToday) {
      ElMessage.success(`重新抽了一支：${text}`)
    } else {
      ElMessage.success(`抽到一支好签 🔮 ${text}`)
    }
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '抽签失败')
  } finally {
    drawing.value = false
  }
}

onMounted(() => {
  void couple.loadGarden()
})
</script>

<style scoped>
.garden-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.section-title {
  margin: 0 0 6px;
  font-size: 14px;
  font-weight: 700;
}
.tip {
  margin: 6px 0 0;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.garden-card {
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: linear-gradient(180deg, rgba(103, 194, 58, 0.06), transparent);
}
.garden-card.withered {
  background: linear-gradient(180deg, rgba(230, 162, 60, 0.1), transparent);
}
.garden-visual {
  display: flex;
  align-items: center;
  gap: 14px;
}
.garden-emoji {
  font-size: 44px;
  line-height: 1;
}
.garden-info {
  flex: 1;
  min-width: 0;
}
.garden-name {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
}
.garden-stage {
  margin-left: 8px;
  font-size: 11px;
  font-weight: 400;
  color: var(--im-muted, #8f959e);
}
.garden-desc {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.garden-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
.garden-partner {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.garden-alert {
  margin: 0;
  font-size: 12px;
  color: var(--el-color-warning, #e6a23c);
  font-weight: 600;
}
.garden-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
@media (max-width: 720px) {
  .garden-row {
    grid-template-columns: 1fr;
  }
}
.half-card {
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.flower-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}
.flower-btn {
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  background: transparent;
  border-radius: 10px;
  padding: 8px 4px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  transition: all 0.15s;
}
.flower-btn:hover:not(:disabled) {
  border-color: var(--el-color-danger, #f56c6c);
  transform: translateY(-1px);
}
.flower-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.flower-emoji {
  font-size: 20px;
}
.flower-name {
  font-size: 10px;
  color: var(--im-muted, #8f959e);
}
.rose-remain {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.rose-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.rose-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  border-bottom: 1px dashed var(--el-border-color-lighter, #ebeef5);
  padding-bottom: 6px;
}
.rose-word {
  flex: 1;
  color: var(--im-muted, #8f959e);
}
.rose-from {
  color: var(--el-color-danger, #f56c6c);
  font-weight: 600;
}
.slip-slot {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  border: 1px dashed var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  padding: 8px 10px;
}
.slip-text {
  flex: 1;
  font-size: 12px;
  word-break: break-all;
}
.slip-note {
  font-size: 10px;
  color: var(--im-muted, #8f959e);
  flex-shrink: 0;
}
.slip-empty {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
</style>

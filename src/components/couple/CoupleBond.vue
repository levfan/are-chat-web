<template>
  <div class="bond" data-testid="couple-bond">
    <!-- 动作宫格 -->
    <div class="action-box" data-testid="couple-bond-actions">
      <h4 class="section-title">🫶 贴贴 TA</h4>
      <div class="action-grid">
        <button
          v-for="a in ACTIONS"
          :key="a.kind"
          type="button"
          class="action-btn"
          :class="{ popping: popping === a.kind }"
          :data-testid="`couple-bond-${a.kind.toLowerCase()}`"
          @click="onSend(a.kind)"
        >
          <span class="action-emoji">{{ a.emoji }}</span>
          <span class="action-label">{{ a.label }}</span>
        </button>
      </div>
      <p class="action-tip">
        {{ couple.space?.partner.petName || couple.space?.partner.nickname || 'TA' }} 会实时收到推送哦～今天已经贴了
        <b class="hl">{{ couple.bondStats?.todayCount ?? 0 }}</b> 次（我 {{ couple.bondStats?.todayMine ?? 0 }} / TA
        {{ couple.bondStats?.todayPartner ?? 0 }}）
      </p>
    </div>

    <!-- 贴贴里程碑 -->
    <div class="milestone-box" data-testid="couple-bond-milestones">
      <h4 class="section-title">🎯 贴贴里程碑</h4>
      <div v-if="milestones.length" class="milestone-list">
        <div v-for="m in milestones" :key="m.kind" class="milestone-row">
          <span class="m-label">{{ m.emoji }} {{ m.label }}</span>
          <el-progress
            class="m-progress"
            :percentage="m.percent"
            :stroke-width="8"
            :show-text="false"
            :color="PROGRESS_COLOR"
          />
          <span class="m-text">
            {{ m.next ? `${m.total} / ${m.next} 次` : `已达成 ${m.total} 次 🎉` }}
          </span>
        </div>
      </div>
    </div>

    <!-- 累计统计 -->
    <div class="stat-box" data-testid="couple-bond-stats">
      <h4 class="section-title">📊 累计贴贴</h4>
      <div class="stat-grid">
        <div v-for="k in couple.bondStats?.kinds ?? []" :key="k.kind" class="stat-item" :title="lastText(k)">
          <span class="stat-emoji">{{ k.emoji }}</span>
          <span class="stat-num">{{ k.total }}</span>
          <span class="stat-label">{{ k.label }}</span>
        </div>
      </div>
    </div>

    <!-- 最近动作流 -->
    <div class="stream-box" data-testid="couple-bond-stream">
      <h4 class="section-title">🌸 最近的贴贴</h4>
      <el-empty
        v-if="!couple.bondActions.length"
        description="还没有贴贴记录，快去戳 TA 一下吧 👉"
        :image-size="70"
        data-testid="couple-bond-stream-empty"
      />
      <div v-else class="stream-list">
        <div v-for="a in couple.bondActions.slice(0, 20)" :key="a.id" class="stream-item">
          <span class="stream-emoji">{{ emojiOf(a.kind) }}</span>
          <span class="stream-text">
            {{ a.username === auth.username ? '我' : 'TA' }}
            {{ a.username === auth.username ? '给 TA 一个' : '给了我一个' }}「{{ labelOf(a.kind) }}」
          </span>
          <span class="stream-time">{{ formatTime(a.created) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useCoupleStore } from '@/stores/couple'
import type { CoupleActionKind, CoupleKindStat } from '@/types'

const ACTIONS: { kind: CoupleActionKind; emoji: string; label: string }[] = [
  { kind: 'HUG', emoji: '🤗', label: '抱抱' },
  { kind: 'KISS', emoji: '💋', label: '亲亲' },
  { kind: 'MISS', emoji: '💌', label: '在想你' },
  { kind: 'POKE', emoji: '👉', label: '戳一戳' },
  { kind: 'PAT', emoji: '🫳', label: '捏捏脸' },
  { kind: 'NUZZLE', emoji: '😚', label: '蹭蹭' },
  { kind: 'TICKLE', emoji: '🤭', label: '挠痒痒' },
]

const EMOJI_MAP = new Map(ACTIONS.map((a) => [a.kind, a.emoji]))
const LABEL_MAP = new Map(ACTIONS.map((a) => [a.kind, a.label]))

/** 里程碑阶梯 */
const STEPS = [1, 10, 50, 100, 520, 1314]
const PROGRESS_COLOR = '#f56c6c'

const auth = useAuthStore()
const couple = useCoupleStore()

/** 正在弹跳的动作（发送动画） */
const popping = ref<string | null>(null)

/** 抱抱/亲亲/想念三类里程碑进度 */
const milestones = computed(() => {
  const kinds = couple.bondStats?.kinds ?? []
  return kinds
    .filter((k) => k.kind === 'HUG' || k.kind === 'KISS' || k.kind === 'MISS')
    .map((k) => {
      const next = STEPS.find((s) => s > k.total) ?? null
      const prev = next ? (STEPS[STEPS.indexOf(next) - 1] ?? 0) : STEPS[STEPS.length - 1]
      const percent = next ? Math.min(100, Math.round(((k.total - prev) / (next - prev)) * 100)) : 100
      return { ...k, next, percent }
    })
})

function emojiOf(kind: CoupleActionKind) {
  return EMOJI_MAP.get(kind) ?? '💕'
}

function labelOf(kind: CoupleActionKind) {
  return LABEL_MAP.get(kind) ?? '贴贴'
}

function lastText(k: CoupleKindStat) {
  if (!k.lastAt) return '还没有记录'
  if (k.mine + k.partner === 0) return '还没有记录'
  return `我 ${k.mine} 次 · TA ${k.partner} 次`
}

function formatTime(at: number) {
  const d = new Date(at)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getMonth() + 1}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

async function onSend(kind: CoupleActionKind) {
  popping.value = kind
  setTimeout(() => (popping.value = null), 400)
  try {
    await couple.sendAction(kind)
    ElMessage.success(`已送达：${labelOf(kind)} ${emojiOf(kind)}`)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '发送失败')
  }
}

onMounted(() => {
  void couple.loadBond()
})
</script>

<style scoped>
.bond {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.section-title {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 700;
}
.action-box,
.milestone-box,
.stat-box,
.stream-box {
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  padding: 14px;
}
.action-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}
@media (max-width: 640px) {
  .action-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 10px 2px;
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 12px;
  background: transparent;
  cursor: pointer;
  transition:
    transform 0.15s,
    border-color 0.15s,
    background 0.15s;
}
.action-btn:hover {
  border-color: #f89898;
  background: #fff0f0;
}
.action-btn.popping {
  transform: scale(1.2) rotate(-6deg);
  border-color: #f56c6c;
  background: #fde2e2;
}
.action-emoji {
  font-size: 24px;
  line-height: 1.2;
}
.action-label {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.action-tip {
  margin: 10px 0 0;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.hl {
  color: #f56c6c;
  font-weight: 700;
}
.milestone-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.milestone-row + .milestone-row {
  margin-top: 8px;
}
.m-label {
  width: 76px;
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 600;
}
.m-progress {
  flex: 1;
}
.m-text {
  width: 110px;
  flex-shrink: 0;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
  text-align: right;
}
.stat-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}
@media (max-width: 640px) {
  .stat-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 2px;
  border-radius: 10px;
  background: var(--el-fill-color-lighter, #fafafa);
}
.stat-emoji {
  font-size: 18px;
}
.stat-num {
  font-size: 16px;
  font-weight: 700;
  color: #f56c6c;
}
.stat-label {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.stream-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 260px;
  overflow-y: auto;
}
.stream-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 8px;
  background: var(--el-fill-color-lighter, #fafafa);
}
.stream-emoji {
  font-size: 16px;
}
.stream-text {
  flex: 1;
  font-size: 13px;
}
.stream-time {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
</style>

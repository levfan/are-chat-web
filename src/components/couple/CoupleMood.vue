<template>
  <div class="mood" data-testid="couple-mood">
    <!-- 今天的心情 -->
    <div class="today-box" data-testid="couple-mood-today">
      <h4 class="section-title">💗 今天的心情</h4>
      <div class="mood-grid">
        <button
          v-for="m in MOODS"
          :key="m.key"
          type="button"
          class="mood-btn"
          :class="{ active: selected === m.key }"
          :data-testid="`couple-mood-${m.key.toLowerCase()}`"
          @click="selected = m.key"
        >
          <span class="mood-emoji">{{ m.emoji }}</span>
          <span class="mood-label">{{ m.label }}</span>
        </button>
      </div>
      <div class="note-row">
        <el-input
          v-model="note"
          maxlength="200"
          :placeholder="todaySaved ? '修改今天的一句话心情…' : '补充一句话心情（可空）…'"
          data-testid="couple-mood-note"
          @keyup.enter="onSave"
        />
        <el-button type="primary" :loading="saving" data-testid="couple-mood-save" @click="onSave">
          {{ todaySaved ? '更新' : '记下来' }}
        </el-button>
      </div>
      <p class="mood-tip">每天一条心情，双方互相可见；今天记过的直接改就行～</p>
    </div>

    <!-- 回应 TA 今天的心情 -->
    <div v-if="partnerToday" class="react-box" data-testid="couple-mood-reaction">
      <h4 class="section-title">
        🫶 回应 {{ couple.space?.partner.petName || couple.space?.partner.nickname || 'TA' }} 今天的心情
      </h4>
      <div class="react-row">
        <button
          v-for="r in REACTIONS"
          :key="r.key"
          type="button"
          class="react-btn"
          :class="{ active: couple.moodReaction?.myReaction === r.key }"
          :data-testid="`couple-mood-react-${r.key.toLowerCase()}`"
          @click="onReact(r.key)"
        >
          {{ r.emoji }} {{ r.label }}
        </button>
      </div>
      <p class="mood-tip">
        TA 给你的回应：<template v-if="couple.moodReaction?.partnerReaction">
          {{ reactionMeta(couple.moodReaction.partnerReaction).emoji }}
          {{ reactionMeta(couple.moodReaction.partnerReaction).label }}
        </template>
        <template v-else>还没有～</template>
      </p>
    </div>

    <!-- 最近 14 天双人心情条 -->
    <div class="strip-box" data-testid="couple-mood-strip">
      <h4 class="section-title">📈 最近 14 天</h4>
      <div class="strip-row">
        <span class="strip-owner">我</span>
        <div class="strip-cells">
          <span
            v-for="cell in strip"
            :key="`mine-${cell.day}`"
            class="strip-cell"
            :title="`${cell.day} ${cell.mine ? moodMeta(cell.mine.mood).label : '未记录'}`"
          >
            <template v-if="cell.mine">{{ moodMeta(cell.mine.mood).emoji }}</template>
            <template v-else><span class="cell-empty" /></template>
          </span>
        </div>
      </div>
      <div class="strip-row">
        <span class="strip-owner">TA</span>
        <div class="strip-cells">
          <span
            v-for="cell in strip"
            :key="`partner-${cell.day}`"
            class="strip-cell"
            :title="`${cell.day} ${cell.partner ? moodMeta(cell.partner.mood).label : '未记录'}`"
          >
            <template v-if="cell.partner">{{ moodMeta(cell.partner.mood).emoji }}</template>
            <template v-else><span class="cell-empty" /></template>
          </span>
        </div>
      </div>
      <p class="mood-tip">从左到右 = 从 14 天前到今天，点小表情可以看到那天的日期～</p>
    </div>

    <!-- 明细 -->
    <div v-if="couple.moods.length" class="detail-box" data-testid="couple-mood-detail">
      <h4 class="section-title">🗒️ 心情明细</h4>
      <div v-for="day in couple.moods" :key="day.day" class="detail-row">
        <span class="detail-day">{{ dayLabel(day.day) }}</span>
        <div class="detail-cards">
          <div class="detail-card" :class="{ filled: !!day.mine }">
            <span class="detail-owner">我</span>
            <span v-if="day.mine" class="detail-body">
              {{ moodMeta(day.mine.mood).emoji }} {{ day.mine.note || moodMeta(day.mine.mood).label }}
            </span>
            <span v-else class="detail-body empty">还没记录</span>
          </div>
          <div class="detail-card" :class="{ filled: !!day.partner }">
            <span class="detail-owner">TA</span>
            <span v-if="day.partner" class="detail-body">
              {{ moodMeta(day.partner.mood).emoji }} {{ day.partner.note || moodMeta(day.partner.mood).label }}
            </span>
            <span v-else class="detail-body empty">还没记录</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useCoupleStore } from '@/stores/couple'
import type { CoupleMoodKind, CoupleMoodReactionKind } from '@/types'

const MOODS: { key: CoupleMoodKind; emoji: string; label: string }[] = [
  { key: 'LOVE', emoji: '😍', label: '恋爱中' },
  { key: 'HAPPY', emoji: '😄', label: '开心' },
  { key: 'CALM', emoji: '😌', label: '平静' },
  { key: 'BUSY', emoji: '🤯', label: '好忙' },
  { key: 'TIRED', emoji: '😴', label: '累了' },
  { key: 'SICK', emoji: '🤒', label: '生病' },
  { key: 'SAD', emoji: '😢', label: '难过' },
  { key: 'ANGRY', emoji: '😠', label: '生气' },
]
const MOOD_MAP = new Map(MOODS.map((m) => [m.key, m]))

function moodMeta(mood: CoupleMoodKind) {
  return MOOD_MAP.get(mood) ?? { emoji: '💗', label: '心情' }
}

const couple = useCoupleStore()
const selected = ref<CoupleMoodKind>('LOVE')
const note = ref('')
const saving = ref(false)

const REACTIONS: { key: CoupleMoodReactionKind; emoji: string; label: string }[] = [
  { key: 'HUG', emoji: '🤗', label: '抱抱' },
  { key: 'KISS', emoji: '💋', label: '亲亲' },
  { key: 'CHEER', emoji: '💪', label: '加油' },
  { key: 'PAT', emoji: '🫶', label: '摸摸头' },
]
const REACTION_MAP = new Map(REACTIONS.map((r) => [r.key, r]))

function reactionMeta(reaction: CoupleMoodReactionKind) {
  return REACTION_MAP.get(reaction) ?? { emoji: '💕', label: '回应' }
}

/** TA 今天有没有记心情（记了才能回应） */
const partnerToday = computed(() => couple.moods.some((d) => d.day === today && d.partner))

async function onReact(reaction: CoupleMoodReactionKind) {
  try {
    await couple.reactMood(reaction)
    ElMessage.success(`已回应：${reactionMeta(reaction).label} ${reactionMeta(reaction).emoji}`)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '回应失败')
  }
}

const today = new Date().toLocaleDateString('sv-SE')

/** 今天的记录（保存过 = 已有今天的我的心情） */
const todaySaved = computed(() => couple.moods.some((d) => d.day === today && d.mine))

/** 连续 14 天（新→旧），与已记录数据对齐，没记录的日子留空 */
const strip = computed(() => {
  const byDay = new Map(couple.moods.map((d) => [d.day, d]))
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const day = d.toLocaleDateString('sv-SE')
    const record = byDay.get(day) ?? null
    return { day, mine: record?.mine ?? null, partner: record?.partner ?? null }
  })
})

function dayLabel(day: string) {
  if (day === today) return '今天'
  const d = new Date(`${day}T00:00:00`)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  if (day === yesterday.toLocaleDateString('sv-SE')) return '昨天'
  return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

async function onSave() {
  saving.value = true
  try {
    await couple.saveMood(selected.value, note.value.trim() || undefined)
    ElMessage.success('今天的心情记好啦 💗')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '保存失败')
  } finally {
    saving.value = false
  }
}

// 数据加载后：用今天的记录回填表单
watch(
  () => couple.moods,
  (list) => {
    const mine = list.find((d) => d.day === today)?.mine
    if (mine) {
      selected.value = mine.mood
      note.value = mine.note
    }
  },
  { immediate: true },
)

onMounted(() => {
  void couple.loadMoods()
})
</script>

<style scoped>
.mood {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.section-title {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 700;
}
.today-box,
.react-box,
.strip-box,
.detail-box {
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  padding: 14px;
}
.react-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.react-btn {
  padding: 8px 14px;
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 999px;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.15s;
}
.react-btn:hover {
  border-color: #f89898;
  background: #fff0f0;
}
.react-btn.active {
  border-color: #f56c6c;
  background: #fde2e2;
  font-weight: 600;
}
.mood-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 6px;
}
@media (max-width: 640px) {
  .mood-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
.mood-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 2px;
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  background: transparent;
  cursor: pointer;
  transition: all 0.15s;
}
.mood-btn:hover {
  border-color: var(--el-color-primary-light-5, #a0cfff);
}
.mood-btn.active {
  border-color: var(--el-color-primary, #409eff);
  background: var(--el-color-primary-light-9, #ecf5ff);
}
.mood-emoji {
  font-size: 22px;
  line-height: 1.2;
}
.mood-label {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.note-row {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
.mood-tip {
  margin: 8px 0 0;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.strip-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.strip-row + .strip-row {
  margin-top: 6px;
}
.strip-owner {
  width: 20px;
  font-size: 12px;
  font-weight: 700;
  color: var(--im-muted, #8f959e);
  text-align: center;
}
.strip-cells {
  display: grid;
  grid-template-columns: repeat(14, 1fr);
  gap: 2px;
  flex: 1;
}
.strip-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  font-size: 16px;
  border-radius: 6px;
  background: var(--el-fill-color-lighter, #fafafa);
}
.cell-empty {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--el-border-color, #dcdfe6);
}
.detail-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.detail-row + .detail-row {
  margin-top: 10px;
}
.detail-day {
  width: 44px;
  flex-shrink: 0;
  padding-top: 8px;
  font-size: 12px;
  font-weight: 700;
  color: var(--im-muted, #8f959e);
}
.detail-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  flex: 1;
}
@media (max-width: 640px) {
  .detail-cards {
    grid-template-columns: 1fr;
  }
}
.detail-card {
  display: flex;
  gap: 8px;
  align-items: baseline;
  border-radius: 8px;
  padding: 8px 10px;
  background: var(--el-fill-color-lighter, #fafafa);
}
.detail-card.filled {
  background: var(--el-color-primary-light-9, #ecf5ff);
}
.detail-owner {
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 700;
  color: var(--im-muted, #8f959e);
}
.detail-body {
  font-size: 13px;
  word-break: break-all;
}
.detail-body.empty {
  color: var(--im-muted, #8f959e);
}
</style>

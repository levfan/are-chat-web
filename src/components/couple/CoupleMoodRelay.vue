<template>
  <div class="mood-relay" data-testid="couple-mood-relay">
    <!-- F102 情绪接力棒 -->
    <div class="card" data-testid="couple-relay">
      <h4 class="title">🥎 情绪接力棒 <span class="sub">把心情抛给 TA，TA 接住再抛回来</span></h4>
      <div v-if="pendingRelay" class="relay-pending" data-testid="couple-relay-pending">
        <template v-if="pendingRelay.fromUser === auth.username">
          <p class="relay-line">
            {{ pendingRelay.moodEmoji }} 你的心情「{{ pendingRelay.moodWord }}」在路上，等 TA 接住～
          </p>
          <p v-if="pendingRelay.note" class="relay-note">{{ pendingRelay.note }}</p>
        </template>
        <template v-else>
          <p class="relay-line">
            {{ pendingRelay.moodEmoji }} TA 的心情是「{{ pendingRelay.moodWord }}」，快去接住！
          </p>
          <p v-if="pendingRelay.note" class="relay-note">{{ pendingRelay.note }}</p>
          <div class="catch-box">
            <el-input
              v-model="catchNote"
              maxlength="100"
              placeholder="回应一句：比如 抱抱，我在呢"
              data-testid="couple-relay-catch-note"
            />
            <el-input
              v-model="myMood"
              maxlength="20"
              placeholder="你的心情词（可选）"
              data-testid="couple-relay-my-mood"
            />
            <el-button type="primary" data-testid="couple-relay-catch" @click="onCatch">接住 TA 🫂</el-button>
          </div>
        </template>
      </div>
      <div v-else class="toss-box">
        <div class="toss-row">
          <el-input
            v-model="moodWord"
            maxlength="20"
            placeholder="用一个词形容现在的心情，比如 有点累"
            data-testid="couple-relay-word"
          />
          <el-select v-model="moodEmoji" class="emoji-pick" placeholder="😊" data-testid="couple-relay-emoji" clearable>
            <el-option v-for="e in EMOJIS" :key="e" :label="e" :value="e" />
          </el-select>
        </div>
        <el-input
          v-model="tossNote"
          maxlength="100"
          placeholder="想多说的一句（可不填）"
          data-testid="couple-relay-note"
        />
        <el-button type="primary" data-testid="couple-relay-toss" @click="onToss">抛给 TA 🥎</el-button>
      </div>
      <div v-if="relayHistory.length" class="relay-hist">
        <p class="hist-title">最近被接住的心情</p>
        <div v-for="r in relayHistory.slice(0, 5)" :key="r.id" class="relay-hist-item">
          <span class="relay-day">{{ formatDay(r.caughtAt ?? r.created) }}</span>
          <span class="relay-pair">
            {{ r.fromUser === auth.username ? '我' : 'TA' }}：「{{ r.moodWord }}」
            <template v-if="r.catchNote">→ TA 回应：{{ r.catchNote }}</template>
          </span>
        </div>
      </div>
    </div>

    <!-- F108 情绪词汇足迹 -->
    <div class="card" data-testid="couple-feeling">
      <h4 class="title">📖 情绪词汇足迹 <span class="sub">一天一个词，攒成我们的情绪星图</span></h4>
      <div class="feeling-form">
        <el-input
          v-model="feelingWord"
          maxlength="20"
          placeholder="今天用一个词形容，比如 被治愈"
          data-testid="couple-feeling-word"
          @keyup.enter="onSaveFeeling"
        />
        <el-input
          v-model="feelingNote"
          maxlength="100"
          placeholder="想多说的一句（可不填）"
          data-testid="couple-feeling-note"
        />
        <el-button type="primary" data-testid="couple-feeling-save" @click="onSaveFeeling">记下今天 📖</el-button>
      </div>
      <div v-if="wordCloud.length" class="cloud" data-testid="couple-feeling-cloud">
        <span
          v-for="w in wordCloud"
          :key="w.word"
          class="cloud-word"
          :style="{ fontSize: `${w.size}px`, opacity: w.opacity }"
        >
          {{ w.word }}
        </span>
      </div>
      <div v-if="couple.feelings.length" class="feeling-recent">
        <div v-for="f in couple.feelings.slice(0, 6)" :key="f.id" class="feeling-item">
          <span class="feeling-day">{{ f.day.slice(5) }}</span>
          <span class="feeling-who">{{ f.fromUser === auth.username ? '我' : 'TA' }}</span>
          <b class="feeling-word">{{ f.word }}</b>
          <span v-if="f.note" class="feeling-note">{{ f.note }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useCoupleStore } from '@/stores/couple'
import { useAuthStore } from '@/stores/auth'

const couple = useCoupleStore()
const auth = useAuthStore()

const EMOJIS = ['😊', '🥰', '🥺', '😤', '😭', '😴', '🤩', '😫', '🫠', '🤗']

const moodWord = ref('')
const moodEmoji = ref('')
const tossNote = ref('')
const catchNote = ref('')
const myMood = ref('')
const feelingWord = ref('')
const feelingNote = ref('')

const pendingRelay = computed(() => couple.relays.find((r) => r.status === 'PENDING') ?? null)
const relayHistory = computed(() => couple.relays.filter((r) => r.status === 'CAUGHT'))
const wordCloud = computed(() => {
  const counter = new Map<string, number>()
  for (const f of couple.feelings) {
    counter.set(f.word, (counter.get(f.word) ?? 0) + 1)
  }
  const max = Math.max(1, ...counter.values())
  return [...counter.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([word, count]) => ({
      word,
      size: 13 + Math.round((count / max) * 12),
      opacity: 0.55 + (count / max) * 0.45,
    }))
})

async function onToss() {
  if (!moodWord.value.trim()) {
    ElMessage.warning('先写下一个心情词吧')
    return
  }
  try {
    await couple.tossRelay(moodWord.value, moodEmoji.value || undefined, tossNote.value || undefined)
    moodWord.value = ''
    moodEmoji.value = ''
    tossNote.value = ''
    ElMessage.success('接力棒已抛出 🥎')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '抛出失败')
  }
}

async function onCatch() {
  const r = pendingRelay.value
  if (!r) return
  try {
    await couple.catchRelay(r.id, catchNote.value || undefined, myMood.value || undefined)
    catchNote.value = ''
    myMood.value = ''
    ElMessage.success('TA 的心情被你接住啦 🫂')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '接住失败')
  }
}

async function onSaveFeeling() {
  if (!feelingWord.value.trim()) {
    ElMessage.warning('用一个词形容下今天吧')
    return
  }
  try {
    await couple.saveFeeling(feelingWord.value, feelingNote.value || undefined)
    feelingWord.value = ''
    feelingNote.value = ''
    ElMessage.success('已记下今天 📖')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '记录失败')
  }
}

function formatDay(ts: number) {
  return new Date(ts).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
}

onMounted(() => {
  void couple.loadComm()
})
</script>

<style scoped>
.mood-relay {
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
.relay-pending {
  padding: 10px;
  border-radius: 8px;
  background: var(--el-color-warning-light-9, #fdf6ec);
}
.relay-line {
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 700;
}
.relay-note {
  margin: 0 0 8px;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.catch-box,
.toss-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}
.toss-row {
  display: flex;
  gap: 8px;
  width: 100%;
}
.emoji-pick {
  width: 90px;
}
.relay-hist {
  margin-top: 10px;
  border-top: 1px dashed var(--el-border-color-lighter, #ebeef5);
  padding-top: 8px;
}
.hist-title {
  margin: 0 0 6px;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.relay-hist-item {
  display: flex;
  gap: 8px;
  font-size: 12px;
  margin-bottom: 4px;
}
.relay-day {
  color: var(--im-muted, #8f959e);
  flex-shrink: 0;
}
.relay-pair {
  flex: 1;
  min-width: 0;
  word-break: break-all;
}
.feeling-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
}
.cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: baseline;
  padding: 10px;
  border-radius: 8px;
  background: var(--im-hover, #f5f7fa);
  margin-bottom: 10px;
}
.cloud-word {
  color: var(--el-color-danger, #f56c6c);
  font-weight: 700;
}
.feeling-recent {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.feeling-item {
  display: flex;
  gap: 8px;
  font-size: 12px;
  align-items: baseline;
}
.feeling-day {
  color: var(--im-muted, #8f959e);
  flex-shrink: 0;
}
.feeling-who {
  color: var(--im-muted, #8f959e);
}
.feeling-word {
  color: var(--el-color-danger, #f56c6c);
}
.feeling-note {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--el-text-color-regular, #606266);
}
</style>

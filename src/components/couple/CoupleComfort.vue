<template>
  <div class="comfort" data-testid="couple-comfort">
    <!-- F60 求抱抱 -->
    <div class="comfort-card" data-testid="couple-comfort-card">
      <h4 class="section-title">🫂 求抱抱 <span class="sub">一键告诉 TA「我现在需要安慰」</span></h4>
      <template v-if="couple.comfortBoard?.partnerPending">
        <div class="pending-box" data-testid="couple-comfort-pending">
          <p class="pending-line">
            {{ couple.comfortBoard.partnerPending.feelingEmoji }}
            TA 说 TA 现在有点<b>{{ couple.comfortBoard.partnerPending.feelingLabel }}</b>，快去接住 TA：
          </p>
          <div class="cards-row">
            <button
              v-for="w in comfortWords"
              :key="w"
              type="button"
              class="word-card"
              :data-testid="`couple-comfort-word`"
              @click="onGive(w)"
            >
              {{ w }}
            </button>
          </div>
          <div class="custom-row">
            <el-input
              v-model="customComfort"
              maxlength="100"
              placeholder="或者写一句你自己的话…"
              data-testid="couple-comfort-custom"
              @keyup.enter="onGive(customComfort)"
            />
            <el-button type="primary" data-testid="couple-comfort-send" @click="onGive(customComfort)">送出 🤗</el-button>
          </div>
          <el-button link size="small" data-testid="couple-comfort-refresh-cards" @click="loadCards(partnerFeeling)">
            🔄 换一批话术卡
          </el-button>
        </div>
      </template>
      <template v-else-if="couple.comfortBoard?.mine && !couple.comfortBoard.mine.handled">
        <div class="waiting" data-testid="couple-comfort-waiting">
          <span class="wait-emoji">{{ couple.comfortBoard.mine.feelingEmoji }}</span>
          <div class="wait-body">
            <p>你已发出今天的求抱抱（{{ couple.comfortBoard.mine.feelingLabel }}），等 TA 来接住你…</p>
            <p class="wait-tip">TA 会立刻收到提醒，别担心。</p>
          </div>
        </div>
      </template>
      <template v-else-if="couple.comfortBoard?.mine?.handled">
        <div class="given" data-testid="couple-comfort-given">
          🤗 TA 抱住了你：「{{ couple.comfortBoard.mine.handledNote }}」
        </div>
      </template>
      <template v-else>
        <p class="tip">今天还好吗？如果不太好，选一个最接近的感受，让 TA 来接住你：</p>
        <div class="feeling-row">
          <button
            v-for="f in feelings"
            :key="f.key"
            type="button"
            class="feeling-btn"
            :data-testid="`couple-comfort-feel-${f.key}`"
            @click="onAsk(f.key)"
          >
            <span class="feeling-emoji">{{ f.emoji }}</span>{{ f.label }}
          </button>
        </div>
      </template>
    </div>

    <div class="comfort-grid">
      <!-- F63 陪聊话题卡 -->
      <div class="half-card" data-testid="couple-topics">
        <h4 class="section-title">🎲 陪聊话题卡</h4>
        <p class="tip">低落时不知道聊什么？抽三张，从任意一张开始。</p>
        <div class="topic-list">
          <div v-for="(t, i) in topics" :key="i" class="topic-item">{{ t }}</div>
        </div>
        <el-button round size="small" :loading="topicLoading" data-testid="couple-topics-draw" @click="drawTopics">
          抽三张 🎲
        </el-button>
      </div>

      <!-- F64 情绪同步率 -->
      <div class="half-card" data-testid="couple-mood-sync">
        <h4 class="section-title">💗 情绪同步率</h4>
        <div class="sync-num" data-testid="couple-sync-rate">
          {{ couple.moodSync?.syncRate ?? 0 }}<span class="sync-unit">%</span>
        </div>
        <p class="sync-line">
          {{ syncLine }}
        </p>
        <p class="tip">在双方都记录过心情的日子里，心情一致的比例{{ (couple.moodSync?.streak ?? 0) > 1 ? `，已连续同步 ${couple.moodSync?.streak} 天` : '' }}。</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { coupleApi } from '@/api/couple'
import { useCoupleStore } from '@/stores/couple'

const couple = useCoupleStore()

const feelings = [
  { key: 'SAD', label: '难过', emoji: '😢' },
  { key: 'WRONGED', label: '委屈', emoji: '🥺' },
  { key: 'TIRED', label: '好累', emoji: '😮‍💨' },
  { key: 'ANXIOUS', label: '焦虑', emoji: '😖' },
  { key: 'EMO', label: 'emo', emoji: '🌧️' },
]

const comfortWords = ref<string[]>([])
const customComfort = ref('')
const topics = ref<string[]>([])
const topicLoading = ref(false)

const partnerFeeling = computed(() => couple.comfortBoard?.partnerPending?.feeling ?? 'SAD')

const syncLine = computed(() => {
  const s = couple.moodSync
  if (!s) return '记录心情后开始统计'
  if (s.bothDays === 0) return '双方都记录心情后，这里会告诉你我们有多同频'
  if (s.todaySync) return '今天心情一样！心灵电波对上了 📡'
  return `共同记录的 ${s.bothDays} 天里，有 ${s.syncedDays} 天心情一样`
})

async function loadCards(feeling: string) {
  try {
    comfortWords.value = (await coupleApi.comfortCards(feeling)) ?? []
  } catch {
    comfortWords.value = []
  }
}

async function onAsk(feeling: string) {
  try {
    await couple.askComfort(feeling)
    ElMessage.success('已发出 🫂 TA 马上就会收到，撑住，抱抱正在路上')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '发送失败')
  }
}

async function onGive(note: string) {
  const text = note?.trim()
  if (!text) {
    ElMessage.warning('写一句话，把抱抱送过去')
    return
  }
  try {
    await couple.giveComfort(text)
    customComfort.value = ''
    ElMessage.success('抱抱已送达 🤗')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '回应失败')
  }
}

async function drawTopics() {
  topicLoading.value = true
  try {
    topics.value = (await coupleApi.chatTopics()) ?? []
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '抽卡失败')
  } finally {
    topicLoading.value = false
  }
}

onMounted(() => {
  void couple.loadComfort()
  if (couple.comfortBoard?.partnerPending) {
    void loadCards(couple.comfortBoard.partnerPending.feeling)
  }
})

// 求抱抱看板异步到达后，若 TA 正在求抱抱，自动拉一次话术卡
watch(
  () => couple.comfortBoard?.partnerPending,
  (pending, old) => {
    if (pending && pending.id !== old?.id) {
      void loadCards(pending.feeling)
    }
  },
)
</script>

<style scoped>
.comfort {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.section-title {
  margin: 0 0 6px;
  font-size: 14px;
  font-weight: 700;
}
.sub {
  margin-left: 6px;
  font-size: 12px;
  font-weight: 400;
  color: var(--im-muted, #8f959e);
}
.tip {
  margin: 0 0 8px;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.comfort-card {
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 12px;
  padding: 14px;
}
.pending-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.pending-line {
  margin: 0;
  font-size: 13px;
}
.cards-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.word-card {
  border: 1px solid var(--el-color-danger, #f56c6c);
  color: var(--el-color-danger, #f56c6c);
  background: transparent;
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
}
.word-card:hover {
  background: var(--el-color-danger-light-9, #fef0f0);
}
.custom-row {
  display: flex;
  gap: 8px;
}
.waiting {
  display: flex;
  align-items: center;
  gap: 12px;
}
.wait-emoji {
  font-size: 26px;
}
.wait-body p {
  margin: 0;
  font-size: 13px;
}
.wait-tip {
  color: var(--im-muted, #8f959e);
  font-size: 12px;
}
.given {
  font-size: 13px;
  color: var(--el-color-success, #67c23a);
  font-weight: 600;
}
.feeling-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.feeling-btn {
  border: 1px solid var(--el-border-color, #dcdfe6);
  background: transparent;
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.15s;
}
.feeling-btn:hover {
  border-color: var(--el-color-danger, #f56c6c);
  color: var(--el-color-danger, #f56c6c);
}
.feeling-emoji {
  font-size: 15px;
}
.comfort-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
@media (max-width: 720px) {
  .comfort-grid {
    grid-template-columns: 1fr;
  }
}
.half-card {
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.topic-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 40px;
}
.topic-item {
  font-size: 12px;
  border-bottom: 1px dashed var(--el-border-color-lighter, #ebeef5);
  padding-bottom: 6px;
}
.sync-num {
  font-size: 34px;
  font-weight: 700;
  color: var(--el-color-danger, #f56c6c);
  line-height: 1;
}
.sync-unit {
  font-size: 16px;
}
.sync-line {
  margin: 0;
  font-size: 13px;
}
</style>

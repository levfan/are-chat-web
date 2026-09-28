<template>
  <div class="daily" data-testid="couple-daily">
    <!-- 甜蜜任务卡 -->
    <div class="task-box" data-testid="couple-task">
      <h4 class="section-title">🍬 今天的甜蜜任务</h4>
      <div v-if="couple.task" class="task-card" :class="{ done: couple.task.status === 'DONE' }">
        <p class="task-content" data-testid="couple-task-content">{{ couple.task.content }}</p>
        <div class="task-foot">
          <span v-if="couple.task.status === 'DONE'" class="task-done-chip" data-testid="couple-task-done-chip">
            ✅ 已完成打卡 {{ formatTime(couple.task.doneAt) }}
          </span>
          <el-button
            v-else
            type="primary"
            size="small"
            round
            data-testid="couple-task-done"
            @click="onDoneTask"
          >
            完成打卡 ✅
          </el-button>
        </div>
      </div>
      <p class="daily-tip">每天一张小任务，做完打个卡，TA 会收到推送～</p>
      <!-- 双方任务回顾 -->
      <div v-if="partnerTask" class="partner-task" data-testid="couple-task-partner">
        <span class="pt-label">TA 今天的任务</span>
        <span class="pt-content">
          {{ partnerTask.status === 'DONE' ? '✅ ' : '⏳ ' }}{{ partnerTask.content }}
        </span>
      </div>
    </div>

    <!-- 恋爱运势 -->
    <div v-if="couple.fortune" class="fortune-box" data-testid="couple-fortune">
      <div class="fortune-head">
        <h4 class="section-title">🔮 今日恋爱运势</h4>
        <span class="fortune-score" data-testid="couple-fortune-score">{{ couple.fortune.score }} 分</span>
      </div>
      <p class="fortune-line">{{ couple.fortune.line }}</p>
      <div class="fortune-rows">
        <span class="fortune-chip good">宜：{{ couple.fortune.good }}</span>
        <span class="fortune-chip bad">忌：{{ couple.fortune.bad }}</span>
        <span class="fortune-chip lucky">幸运物：{{ couple.fortune.lucky }}</span>
      </div>
      <p class="daily-tip">同一天你们抽到的是同一张签哦～</p>
    </div>

    <!-- 默契大考验 -->
    <div class="tacit-box" data-testid="couple-tacit">
      <div class="tacit-head">
        <h4 class="section-title">🎯 默契大考验</h4>
        <span class="tacit-stat" data-testid="couple-tacit-stat">
          心有灵犀 {{ couple.tacit?.matchedCount ?? 0 }} / {{ couple.tacit?.totalCount ?? 0 }} 局
        </span>
      </div>

      <!-- 进行中的一局 -->
      <template v-if="pending">
        <p class="tacit-question" data-testid="couple-tacit-question">{{ pending.question }}</p>
        <div class="tacit-answers">
          <div class="tacit-answer" :class="{ filled: !!pending.myAnswer }">
            <span class="ta-owner">我的答案</span>
            <span class="ta-body">{{ pending.myAnswer || '还没写…' }}</span>
          </div>
          <div class="tacit-answer" :class="{ filled: !!pending.partnerAnswer }">
            <span class="ta-owner">TA 的答案</span>
            <span class="ta-body">
              {{ pending.partnerAnswer || (pending.myAnswer ? '保密中，等 TA 提交～' : '等 TA 作答…') }}
            </span>
          </div>
        </div>
        <div v-if="!pending.myAnswer" class="tacit-input-row">
          <el-input
            v-model="tacitAnswer"
            maxlength="60"
            :placeholder="`写下你的答案（${pending.question.includes('？') ? '尽量一个词' : '一句话'}）`"
            data-testid="couple-tacit-input"
            @keyup.enter="onAnswerTacit"
          />
          <el-button type="primary" :loading="taciting" data-testid="couple-tacit-answer" @click="onAnswerTacit">
            提交答案
          </el-button>
        </div>
        <p v-else class="daily-tip">已提交！等 TA 也写下答案，就一起揭晓～</p>
      </template>

      <!-- 没有对局 -->
      <template v-else>
        <p class="daily-tip">同一道题，背对背作答，答案一致就是「心有灵犀」✨</p>
        <el-button type="warning" size="small" round data-testid="couple-tacit-start" @click="onStartTacit">
          发起一局考验 🎯
        </el-button>
      </template>

      <div class="tacit-foot">
        <el-button link type="primary" size="small" data-testid="couple-tacit-history-btn" @click="openTacitHistory">
          📜 默契历史
        </el-button>
      </div>
    </div>

    <!-- 默契历史弹窗 -->
    <el-dialog v-model="tacitHistoryVisible" title="🎯 默契历史" width="520px" draggable data-testid="couple-tacit-history-dialog">
      <el-empty v-if="!couple.tacitHistory.length" description="还没有对局记录，快发起第一局吧" :image-size="70" />
      <div v-else class="th-list">
        <div v-for="item in couple.tacitHistory" :key="item.id" class="th-item" :class="item.status.toLowerCase()">
          <p class="th-question">{{ item.question }}</p>
          <div class="th-answers">
            <span>我：{{ item.myAnswer ?? '—' }}</span>
            <span>TA：{{ item.partnerAnswer ?? '—' }}</span>
          </div>
          <span class="th-result">
            {{ item.status === 'MATCHED' ? '🎉 心有灵犀！' : item.status === 'MISS' ? '💭 这次不一样' : '⏳ 等待中' }}
          </span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useCoupleStore } from '@/stores/couple'

const couple = useCoupleStore()

const tacitAnswer = ref('')
const taciting = ref(false)
const tacitHistoryVisible = ref(false)

/** 进行中的一局 */
const pending = computed(() => couple.tacit?.pending ?? null)

/** TA 今天的任务卡 */
const partnerTask = computed(() => couple.recentTasks.find((t) => !t.mine && t.day === couple.task?.day) ?? null)

function formatTime(at: number | null) {
  if (!at) return ''
  const d = new Date(at)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

async function onDoneTask() {
  try {
    await couple.doneTask()
    ElMessage.success('任务完成！TA 会为你骄傲的 ✅')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '打卡失败')
  }
}

async function onStartTacit() {
  try {
    await couple.startTacit()
    ElMessage.success('考验已发起！快去告诉 TA 来答题 🎯')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '发起失败')
  }
}

async function onAnswerTacit() {
  const text = tacitAnswer.value.trim()
  if (!text) {
    ElMessage.warning('先写下你的答案')
    return
  }
  taciting.value = true
  try {
    const vo = await couple.answerTacit(text)
    tacitAnswer.value = ''
    if (vo.status === 'MATCHED') {
      ElMessage.success('答案一致！你们真是心有灵犀 🎉')
    } else if (vo.status === 'MISS') {
      ElMessage.info('这次答案不一样，去看看 TA 是怎么想的 💭')
    } else {
      ElMessage.success('已提交，等 TA 也写下答案 ⏳')
    }
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '提交失败')
  } finally {
    taciting.value = false
  }
}

async function openTacitHistory() {
  tacitHistoryVisible.value = true
  try {
    await couple.loadTacitHistory()
  } catch {
    // 弹窗里已有空态兜底
  }
}

onMounted(() => {
  void couple.loadRitual()
  void couple.loadRecentTasks()
})
</script>

<style scoped>
.daily {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.section-title {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 700;
}
.task-box,
.fortune-box,
.tacit-box {
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  padding: 14px;
}
.task-card {
  border-radius: 10px;
  padding: 12px 14px;
  background: linear-gradient(90deg, #fff5f5, #fff0f6);
  border: 1px dashed #f89898;
}
.task-card.done {
  background: #f7f8fa;
  border-color: var(--el-border-color-lighter, #ebeef5);
}
.task-content {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.6;
}
.task-foot {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
}
.task-done-chip {
  font-size: 12px;
  color: var(--el-color-success, #67c23a);
  font-weight: 600;
}
.partner-task {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  align-items: baseline;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.pt-label {
  flex-shrink: 0;
  font-weight: 700;
}
.pt-content {
  word-break: break-all;
}
.daily-tip {
  margin: 8px 0 0;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.fortune-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.fortune-score {
  font-size: 18px;
  font-weight: 700;
  color: #f56c6c;
}
.fortune-line {
  margin: 6px 0 10px;
  font-size: 14px;
  line-height: 1.6;
}
.fortune-rows {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.fortune-chip {
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 999px;
}
.fortune-chip.good {
  background: rgba(103, 194, 58, 0.12);
  color: #529b2e;
}
.fortune-chip.bad {
  background: rgba(245, 108, 108, 0.1);
  color: #c45656;
}
.fortune-chip.lucky {
  background: rgba(230, 162, 60, 0.12);
  color: #b88230;
}
.tacit-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tacit-stat {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.tacit-question {
  margin: 8px 0 10px;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.6;
}
.tacit-answers {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
@media (max-width: 640px) {
  .tacit-answers {
    grid-template-columns: 1fr;
  }
}
.tacit-answer {
  border-radius: 8px;
  padding: 8px 10px;
  background: var(--el-fill-color-lighter, #fafafa);
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 56px;
}
.tacit-answer.filled {
  background: rgba(245, 108, 108, 0.08);
}
.ta-owner {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.ta-body {
  font-size: 13px;
  word-break: break-all;
}
.tacit-input-row {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}
.tacit-foot {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}
.th-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 60vh;
  overflow-y: auto;
}
.th-item {
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  padding: 10px 12px;
}
.th-item.matched {
  border-color: #f89898;
  background: #fff5f5;
}
.th-question {
  margin: 0 0 6px;
  font-size: 13px;
  font-weight: 600;
}
.th-answers {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.th-result {
  display: inline-block;
  margin-top: 6px;
  font-size: 12px;
  font-weight: 600;
}
</style>

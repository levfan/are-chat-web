<template>
  <div class="challenge" data-testid="couple-challenge">
    <!-- F70 双人挑战赛 -->
    <div class="card" data-testid="couple-challenge-card">
      <h4 class="title">🏆 双人挑战赛 <span class="sub">每天一道小挑战，一起完成才算赢</span></h4>
      <template v-if="couple.challenge?.today">
        <p class="task" data-testid="couple-challenge-task">{{ couple.challenge.today.taskText }}</p>
        <div class="progress-row">
          <span class="who" data-testid="couple-challenge-mine">{{ couple.challenge.today.doneMine ? '✅ 我已完成' : '⬜ 我还没完成' }}</span>
          <span class="who">{{ couple.challenge.today.donePartner ? '✅ TA 已完成' : '⬜ TA 还没完成' }}</span>
        </div>
        <el-button
          v-if="!couple.challenge.today.doneMine"
          type="primary"
          data-testid="couple-challenge-check"
          @click="onCheckChallenge"
        >
          我完成啦 ⚡
        </el-button>
        <p v-else-if="!couple.challenge.today.bothDone" class="wait-tip">就差 TA 啦，去催催 TA 👀</p>
        <p v-else class="win-tip" data-testid="couple-challenge-won">🏆 今日挑战达成！已累计 {{ couple.challenge.wonCount }} 次共同胜利</p>
      </template>
      <div v-if="couple.challenge?.history.length" class="hist">
        <div v-for="h in couple.challenge.history.slice(0, 5)" :key="h.day" class="hist-item" :class="{ won: h.bothDone }">
          <span class="hist-day">{{ h.day.slice(5) }}</span>
          <span class="hist-task">{{ h.taskText }}</span>
          <el-tag :type="h.bothDone ? 'success' : 'info'" size="small">{{ h.bothDone ? '双赢 ✓' : '未完成' }}</el-tag>
        </div>
      </div>
    </div>

    <!-- F71 恋爱存折 -->
    <div class="card" data-testid="couple-passbook">
      <h4 class="title">💰 恋爱存折 <span class="sub">每天存一件为感情做的小事</span></h4>
      <div class="streak-row">
        <span class="streak-num" data-testid="couple-passbook-streak">{{ couple.passbook?.myStreak ?? 0 }}</span>
        <span class="streak-unit">天连续存款</span>
        <span v-if="couple.passbook?.milestone" class="milestone">{{ couple.passbook.milestone }}</span>
      </div>
      <div class="today-row">
        <div class="today-side">
          <span class="side-label">我的今日存款</span>
          <p v-if="couple.passbook?.mineToday" class="today-content">{{ couple.passbook.mineToday.content }}</p>
          <div v-else class="deposit-box">
            <el-input
              v-model="passbookDraft"
              maxlength="200"
              show-word-limit
              placeholder="今天为这段感情做的一件小事…"
              data-testid="couple-passbook-input"
              @keyup.enter="onDepositPassbook"
            />
            <el-button type="warning" data-testid="couple-passbook-deposit" @click="onDepositPassbook">存入 💰</el-button>
          </div>
        </div>
        <div class="today-side">
          <span class="side-label">TA 的今日存款</span>
          <p v-if="couple.passbook?.partnerToday" class="today-content">{{ couple.passbook.partnerToday.content }}</p>
          <p v-else class="empty-tip">TA 今天还没存，等 TA 一下下</p>
        </div>
      </div>
      <div v-if="couple.passbook?.recent.length" class="recent">
        <div v-for="p in couple.passbook.recent.slice(0, 6)" :key="p.id" class="recent-item">
          <span class="recent-day">{{ p.day.slice(5) }} · {{ p.mine ? '我' : 'TA' }}</span>
          <span class="recent-content">{{ p.content }}</span>
        </div>
      </div>
    </div>

    <!-- F72 百日之约 -->
    <div class="card" data-testid="couple-hundred">
      <h4 class="title">🎯 百日之约 <span class="sub">一起坚持 100 天</span></h4>
      <div v-if="!couple.hundreds.length" class="create-box">
        <el-input
          v-model="hundredGoal"
          maxlength="200"
          show-word-limit
          placeholder="百日目标：比如 一起早睡 100 天"
          data-testid="couple-hundred-goal"
        />
        <el-button type="primary" :loading="creatingHundred" data-testid="couple-hundred-create" @click="onCreateHundred">
          立约 🎯
        </el-button>
      </div>
      <div v-else class="hundred-list">
        <div
          v-for="h in couple.hundreds"
          :key="h.id"
          class="hundred-item"
          :class="h.status.toLowerCase()"
          :data-testid="`couple-hundred-${h.id}`"
        >
          <div class="hundred-head">
            <span class="hundred-goal">{{ h.goal }}</span>
            <el-tag :type="h.status === 'DONE' ? 'success' : h.status === 'BROKEN' ? 'info' : 'warning'" size="small">
              {{ h.status === 'DONE' ? '达成 🎉' : h.status === 'BROKEN' ? '已中止' : '进行中' }}
            </el-tag>
          </div>
          <el-progress
            :percentage="Math.round((h.bothCheckedDays / 100) * 100)"
            :stroke-width="10"
            :format="() => `${h.bothCheckedDays}/100`"
            data-testid="couple-hundred-progress"
          />
          <p class="hundred-meta">第 {{ h.dayNumber }} 天 · 双方都打卡 {{ h.bothCheckedDays }} 天</p>
          <div v-if="h.status === 'ACTIVE'" class="hundred-actions">
            <el-button
              v-if="!h.todayCheckedMine"
              type="success"
              size="small"
              round
              :data-testid="`couple-hundred-checkin-${h.id}`"
              @click="onCheckinHundred(h.id)"
            >
              今日打卡 📅
            </el-button>
            <span v-else class="checked-tip">今日已打卡 ✓{{ h.todayCheckedPartner ? '（TA 也打了）' : '，等 TA' }}</span>
            <el-button link size="small" type="danger" @click="onBreakHundred(h.id)">中止约定</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useCoupleStore } from '@/stores/couple'

const couple = useCoupleStore()

const passbookDraft = ref('')
const hundredGoal = ref('')
const creatingHundred = ref(false)

async function onCheckChallenge() {
  try {
    await couple.checkChallenge()
    ElMessage.success('打卡成功 ⚡')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '打卡失败')
  }
}

async function onDepositPassbook() {
  const text = passbookDraft.value.trim()
  if (!text) {
    ElMessage.warning('小事也要写下来才算存进去哦')
    return
  }
  try {
    await couple.depositPassbook(text)
    passbookDraft.value = ''
    ElMessage.success('已存入 💰')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '存款失败')
  }
}

async function onCreateHundred() {
  const goal = hundredGoal.value.trim()
  if (!goal) {
    ElMessage.warning('百日目标要写清楚')
    return
  }
  creatingHundred.value = true
  try {
    await couple.createHundred(goal)
    hundredGoal.value = ''
    ElMessage.success('百日之约已立 🎯')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '立约失败')
  } finally {
    creatingHundred.value = false
  }
}

async function onCheckinHundred(id: string) {
  try {
    await couple.checkinHundred(id)
    ElMessage.success('今日打卡成功 📅')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '打卡失败')
  }
}

async function onBreakHundred(id: string) {
  try {
    await couple.breakHundred(id)
    ElMessage.info('已中止——想坚持的事随时可以重新开始')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '操作失败')
  }
}

onMounted(() => {
  void couple.loadGrowth()
})
</script>

<style scoped>
.challenge {
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
.task {
  margin: 0 0 10px;
  font-size: 15px;
  font-weight: 700;
  color: var(--el-color-primary, #409eff);
}
.progress-row {
  display: flex;
  gap: 18px;
  margin-bottom: 10px;
}
.who {
  font-size: 13px;
}
.wait-tip {
  margin: 6px 0 0;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.win-tip {
  margin: 6px 0 0;
  font-size: 13px;
  color: var(--el-color-success, #67c23a);
  font-weight: 700;
}
.hist {
  margin-top: 12px;
  border-top: 1px dashed var(--el-border-color-lighter, #ebeef5);
  padding-top: 10px;
}
.hist-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  margin-bottom: 6px;
}
.hist-item.won {
  color: var(--el-color-success, #67c23a);
}
.hist-day {
  color: var(--im-muted, #8f959e);
  flex-shrink: 0;
}
.hist-task {
  flex: 1;
  min-width: 0;
  word-break: break-all;
}
.streak-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 10px;
}
.streak-num {
  font-size: 28px;
  font-weight: 700;
  color: var(--el-color-warning, #e6a23c);
}
.streak-unit {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.milestone {
  font-size: 12px;
  color: var(--el-color-success, #67c23a);
  font-weight: 700;
}
.today-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 10px;
}
@media (max-width: 720px) {
  .today-row {
    grid-template-columns: 1fr;
  }
}
.side-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--im-muted, #8f959e);
}
.today-content {
  margin: 4px 0 0;
  font-size: 13px;
  word-break: break-all;
}
.empty-tip {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.deposit-box {
  display: flex;
  gap: 8px;
  margin-top: 6px;
}
.recent {
  border-top: 1px dashed var(--el-border-color-lighter, #ebeef5);
  padding-top: 10px;
}
.recent-item {
  display: flex;
  gap: 10px;
  font-size: 12px;
  margin-bottom: 6px;
}
.recent-day {
  color: var(--im-muted, #8f959e);
  flex-shrink: 0;
}
.recent-content {
  word-break: break-all;
}
.create-box {
  display: flex;
  gap: 8px;
}
.hundred-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.hundred-item {
  border: 1px dashed var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  padding: 10px 12px;
}
.hundred-item.done {
  border-style: solid;
  background: var(--el-fill-color-lighter, #fafafa);
}
.hundred-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}
.hundred-goal {
  font-size: 13px;
  font-weight: 700;
  word-break: break-all;
}
.hundred-meta {
  margin: 6px 0;
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.hundred-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.checked-tip {
  font-size: 12px;
  color: var(--el-color-success, #67c23a);
}
</style>

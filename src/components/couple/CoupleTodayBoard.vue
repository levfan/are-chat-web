<template>
  <div class="today-board" data-testid="couple-today-board">
    <h4 class="title">📋 今日看点 <span class="sub">今天值得做的甜蜜小事，做完一项亮一项</span></h4>
    <div class="todo-grid">
      <button
        type="button"
        class="todo-cell"
        :class="{ done: couple.todayBoard?.challengeDone }"
        data-testid="couple-today-challenge"
        @click="go('growth')"
      >
        <span class="todo-emoji">{{ couple.todayBoard?.challengeDone ? '✅' : '🏁' }}</span>
        <span class="todo-label">双人挑战赛</span>
        <span class="todo-state">{{ couple.todayBoard?.challengeDone ? '已完成' : '待打卡' }}</span>
      </button>
      <button
        type="button"
        class="todo-cell"
        :class="{ done: couple.todayBoard?.truthAnswered }"
        data-testid="couple-today-truth"
        @click="go('rituals')"
      >
        <span class="todo-emoji">{{ couple.todayBoard?.truthAnswered ? '✅' : '💬' }}</span>
        <span class="todo-label">今日真心话</span>
        <span class="todo-state">{{ couple.todayBoard?.truthAnswered ? '已回答' : '待回答' }}</span>
      </button>
      <button
        type="button"
        class="todo-cell"
        :class="{ done: couple.todayBoard?.moodLogged }"
        data-testid="couple-today-mood"
        @click="go('mood')"
      >
        <span class="todo-emoji">{{ couple.todayBoard?.moodLogged ? '✅' : '🌦️' }}</span>
        <span class="todo-label">心情日记</span>
        <span class="todo-state">{{ couple.todayBoard?.moodLogged ? '已记录' : '待记录' }}</span>
      </button>
      <button
        type="button"
        class="todo-cell"
        :class="{ done: couple.todayBoard?.passbookDeposited }"
        data-testid="couple-today-passbook"
        @click="go('growth')"
      >
        <span class="todo-emoji">{{ couple.todayBoard?.passbookDeposited ? '✅' : '💰' }}</span>
        <span class="todo-label">恋爱存折</span>
        <span class="todo-state">{{ couple.todayBoard?.passbookDeposited ? '已存入' : '待存入' }}</span>
      </button>
      <button
        v-if="couple.todayBoard?.pactDayNumber"
        type="button"
        class="todo-cell"
        :class="{ done: couple.todayBoard?.hundredChecked }"
        data-testid="couple-today-pact"
        @click="go('growth')"
      >
        <span class="todo-emoji">{{ couple.todayBoard?.hundredChecked ? '✅' : '📅' }}</span>
        <span class="todo-label">百日之约</span>
        <span class="todo-state">{{ couple.todayBoard?.hundredChecked ? `第 ${couple.todayBoard.pactDayNumber} 天已打卡` : `第 ${couple.todayBoard.pactDayNumber} 天待打卡` }}</span>
      </button>
      <button
        v-if="couple.todayBoard?.nextCapsuleDay"
        type="button"
        class="todo-cell capsule"
        data-testid="couple-today-capsule"
        @click="go('letters')"
      >
        <span class="todo-emoji">⏳</span>
        <span class="todo-label">时光胶囊</span>
        <span class="todo-state">{{ couple.todayBoard.capsuleDaysLeft === 0 ? '今天开启！' : `${couple.todayBoard.capsuleDaysLeft} 天后开启` }}</span>
      </button>
    </div>

    <!-- F149 恋爱仪表盘：今日甜蜜待办 + 近期回忆 -->
    <div class="dash" data-testid="couple-dashboard">
      <template v-if="dash">
        <div v-if="dash.todos.length" class="dash-section" data-testid="couple-dashboard-todos">
          <p class="dash-title">⚡ 今日甜蜜待办</p>
          <p v-for="(t, i) in dash.todos" :key="i" class="dash-line">{{ t.text }}</p>
        </div>
        <div v-if="dash.memories.length" class="dash-section" data-testid="couple-dashboard-memories">
          <p class="dash-title">🎞️ 近期回忆一览</p>
          <p v-for="(m, i) in dash.memories" :key="i" class="dash-line">{{ m.text }}</p>
        </div>
        <p v-if="!dash.todos.length && !dash.memories.length" class="dash-line">今天没有待办，好好享受两人时光 ☁️</p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useCoupleStore } from '@/stores/couple'

const emit = defineEmits<{ (e: 'goto', tab: string): void }>()
const couple = useCoupleStore()
const dash = computed(() => couple.dashboard)

function go(tab: string) {
  emit('goto', tab)
}

onMounted(() => {
  void couple.loadTodayBoard()
  void couple.loadDashboard().catch(() => {
    // 未建立空间等场景：静默
  })
})
</script>

<style scoped>
.today-board {
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
.todo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 8px;
}
.todo-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  padding: 10px 4px;
  background: transparent;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}
.todo-cell:hover {
  border-color: var(--el-color-danger, #f56c6c);
}
.todo-cell.done {
  background: var(--el-color-success-light-9, #f0f9eb);
  border-color: var(--el-color-success-light-5, #b3e19d);
}
.todo-emoji {
  font-size: 18px;
}
.todo-label {
  font-size: 12px;
  font-weight: 600;
}
.todo-state {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.dash {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.dash-section {
  background: var(--el-fill-color-lighter, #fafafa);
  border-radius: 8px;
  padding: 8px 12px;
}
.dash-title {
  margin: 0 0 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--im-text, #303133);
}
.dash-line {
  margin: 2px 0;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
  line-height: 1.6;
}
</style>

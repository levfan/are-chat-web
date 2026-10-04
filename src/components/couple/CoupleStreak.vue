<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { streakApi } from '@/api/couple'
import { useCoupleStore } from '@/stores/couple'
import type { CoupleStreakTierVO } from '@/types'
import CoupleCollapsible from './CoupleCollapsible.vue'

/**
 * 连续互动打卡与七档解锁（卡根 `couple-streak`）。
 *
 * 打卡是后端按「双方当天都贴过」自动结算的，所以这张卡**没有**「点一下打卡」按钮，
 * 唯一的写口是补签；看板归 store（头部与 ChatView 要直接读解锁态），
 * 补签返回的整份看板原样替换 store 里那一份，本地不再留第二份真相。
 */
const couple = useCoupleStore()
const board = computed(() => couple.streak)
const making = ref(false)

/** 看板里今天（服务端 yyyy-MM-dd）的前一天：纯字符串算法，不吃本地时钟也不被时区带偏 */
function previousDay(day: string): string {
  const at = Date.parse(`${day}T00:00:00Z`)
  if (Number.isNaN(at)) {
    return ''
  }
  return new Date(at - 86_400_000).toISOString().slice(0, 10)
}

/** 还差几天：一律拿后端下发的当前连击去比档位天数，向下取 0 */
function daysLeft(tier: CoupleStreakTierVO): number {
  return Math.max(0, tier.days - (board.value?.currentStreak ?? 0))
}

async function onMakeup() {
  const v = board.value
  if (!v) {
    return
  }
  // 三道闸门（昨天真断了 / 本月有额度 / 余额够）后端已经合成一个 canMakeup 位，前端只照位放行
  if (!v.canMakeup) {
    ElMessage.warning('现在还不能补签——看看下面的额度与余额吧 🫧')
    return
  }
  if (!v.missedYesterday) {
    ElMessage.warning('昨天没断，这一格不用补 😌')
    return
  }
  const day = previousDay(v.day)
  if (!day) {
    ElMessage.warning('看板没给今天的日子，先收起再展开刷新一下')
    return
  }
  making.value = true
  try {
    couple.streak = await streakApi.streakMakeup(day)
    ElMessage.success(`✍️ 补上了 ${day}，花了 ${v.makeupCost} 分`)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '补签没成功')
  } finally {
    making.value = false
  }
}

onMounted(() => {
  // loadStreak 内部已 try/catch：未建空间或接口挂了都静默收起，不打扰
  if (couple.established) {
    void couple.loadStreak()
  }
})
</script>

<template>
  <CoupleCollapsible class="streak-card" testid="couple-streak" :empty="!board">
    <template #title>
      🔥 连续互动打卡 <span class="sub">贴一贴就自动算一天，断了能补</span>
    </template>

    <p v-if="board" class="counts" data-testid="couple-streak-count">
      当前连续 <b>{{ board.currentStreak }}</b> 天 · 最长 {{ board.longestStreak }} 天 · 累计确认 {{ board.confirmedDays }} 天
    </p>

    <p v-if="board" class="today" :class="{ lit: board.checkedToday }" data-testid="couple-streak-today">
      {{ board.checkedToday ? '✅ 今天这一格已经亮了，明儿见' : '🫧 今天还空着——不用找按钮，双方各贴一下它就自己亮了' }}
    </p>
    <p v-if="board?.lastCheckinDay" class="hint" data-testid="couple-streak-last">
      最近亮着的一天：{{ board.lastCheckinDay }}
    </p>

    <div v-if="board" class="strip" data-testid="couple-streak-strip">
      <span v-for="cell in board.strip" :key="cell.day" class="cell"
            :class="{ on: cell.checked, makeup: cell.makeupFlag, today: cell.todayFlag }"
            :title="`${cell.day}${cell.checked ? ' 已打卡' : ' 没打卡'}${cell.makeupFlag ? '（补签来的）' : ''}`"
            :data-testid="`couple-streak-cell-${cell.day}`">
        {{ cell.checked ? (cell.makeupFlag ? '✍️' : '🔥') : '·' }}
      </span>
    </div>

    <p v-if="board?.nextTierKey" class="next" data-testid="couple-streak-next">
      下一档「{{ board.nextTierLabel }}」还差 {{ board.daysToNext }} 天 🎈
    </p>

    <section v-if="board" class="tiers">
      <h5 class="line-title">🧱 七档解锁进度墙</h5>
      <ul class="tier-list">
        <li v-for="t in board.tiers" :key="t.key" class="tier" :class="{ locked: !t.unlocked }"
            :data-testid="`couple-streak-tier-${t.key}`">
          <span class="icon">{{ t.icon }}</span>
          <span class="tier-body">
            <b class="tier-label">{{ t.label }} <em class="days">{{ t.days }} 天</em></b>
            <em class="detail">{{ t.detail }}</em>
          </span>
          <span v-if="t.unlocked" class="ok" :data-testid="`couple-streak-tier-${t.key}-done`">
            {{ t.unlockedDay }} 解锁 🎉
          </span>
          <span v-else class="left" :data-testid="`couple-streak-tier-${t.key}-left`">还差 {{ daysLeft(t) }} 天</span>
        </li>
      </ul>
    </section>

    <div v-if="board" class="makeup">
      <el-button type="primary" plain :loading="making" :disabled="!board.canMakeup"
                 data-testid="couple-streak-makeup" @click="onMakeup">
        把昨天那一格补回来 ✍️
      </el-button>
      <span class="hint" data-testid="couple-streak-makeup-quota">
        补一次 {{ board.makeupCost }} 分 · 本月还能补 {{ board.makeupLeftThisMonth }} 次 · 我的余额 {{ board.balance }} 分
      </span>
      <span v-if="!board.canMakeup" class="hint off" data-testid="couple-streak-makeup-off">
        {{ board.missedYesterday ? '昨天断了，但额度或余额还不够补 🥲' : '昨天没断，这一格没什么可补的 😌' }}
      </span>
    </div>
  </CoupleCollapsible>
</template>

<style scoped>
.streak-card { --collapse-title-color: #d9480f; }
.sub { font-weight: normal; font-size: 12px; color: var(--im-muted, #909399); }
.counts { margin: 0 0 8px; font-size: 12px; color: var(--im-muted, #909399); }
.counts b { font-size: 16px; color: #d9480f; }
.today { margin: 0; font-size: 13px; color: var(--im-muted, #909399); }
.today.lit { color: #d9480f; }
.hint { font-size: 12px; color: var(--im-muted, #909399); }
.next { margin: 6px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.strip { margin-top: 8px; display: flex; flex-wrap: wrap; gap: 4px; }
.cell { width: 22px; height: 22px; border-radius: 6px; border: 1px dashed var(--im-border, #e6e8eb);
        display: inline-flex; align-items: center; justify-content: center; font-size: 12px;
        color: var(--im-muted, #909399); background: rgba(217, 72, 15, 0.04); }
.cell.on { border-style: solid; border-color: #d9480f; background: rgba(217, 72, 15, 0.12); }
.cell.makeup { border-color: #f3d19e; }
.cell.today { outline: 1px solid #d9480f; }
.tiers { margin-top: 10px; }
.line-title { margin: 0 0 6px; font-size: 13px; font-weight: 600; color: #d9480f; }
.tier-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.tier { display: flex; align-items: baseline; gap: 8px; font-size: 13px; flex-wrap: wrap;
        border-bottom: 1px dashed var(--im-border, #eee); padding-bottom: 4px; }
.tier.locked { opacity: 0.55; }
.tier .icon { font-size: 15px; }
.tier-body { display: flex; flex-direction: column; gap: 2px; flex: 1 1 200px; }
.tier-label { font-size: 13px; }
.tier-label .days { font-size: 11px; font-style: normal; color: var(--im-muted, #909399); margin-left: 4px; }
.tier .detail { font-size: 12px; font-style: normal; color: var(--im-muted, #909399); }
.tier .ok { font-size: 12px; color: #d9480f; }
.tier .left { font-size: 12px; color: var(--im-muted, #909399); }
.makeup { margin-top: 10px; display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.makeup .off { color: #c45656; }
</style>

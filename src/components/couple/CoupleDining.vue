<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { diningApi } from '@/api/couple'
import type { CoupleDineTodayVO } from '@/types'
import CoupleCollapsible from './CoupleCollapsible.vue'

/** 今晚饭桌（保留卡 `couple-dine-today`）：每人一票，吃什么由后端按票池稳定裁决。 */
const v = ref<CoupleDineTodayVO | null>(null)
const dish = ref('')
const reason = ref('')
const sending = ref(false)

async function refresh() {
  try {
    v.value = await diningApi.dineToday()
  } catch {
    // 未建空间 404：整卡静默收起，不打扰
    v.value = null
  }
}

async function onCast() {
  const d = dish.value.trim()
  if (!d) {
    ElMessage.warning('先写下今晚想吃什么呀 🍚')
    return
  }
  if (d.length > 30) {
    ElMessage.warning('菜名 30 字以内哦')
    return
  }
  sending.value = true
  try {
    v.value = await diningApi.dineCastTicket(d, reason.value.trim())
    ElMessage.success(v.value?.hit ? '🎯 撞菜了，今晚就吃它！' : '🎫 票已投出，等 TA 那一票')
    dish.value = ''
    reason.value = ''
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '投票失败')
  } finally {
    sending.value = false
  }
}

onMounted(refresh)
</script>

<template>
  <CoupleCollapsible testid="couple-dine-today" :empty="!v">
    <template #title>
      🍚 今晚饭桌 <span class="sub">每人投一票，撞上了就吃它</span>
    </template>

    <div class="tickets">
      <div class="ticket" :class="{ 'is-mine': v?.mine }" data-testid="couple-dine-ticket-mine">
        <span class="who">我的饭票</span>
        <b v-if="v?.mine" class="dish">{{ v.mine.dish }}</b>
        <span v-else class="empty">还没投</span>
        <em v-if="v?.mine?.reason" class="reason">{{ v.mine.reason }}</em>
      </div>
      <div class="ticket" data-testid="couple-dine-ticket-partner">
        <span class="who">TA 的饭票</span>
        <b v-if="v?.partner" class="dish">{{ v.partner.dish }}</b>
        <span v-else class="empty">还差 TA 一票</span>
        <em v-if="v?.partner?.reason" class="reason">{{ v.partner.reason }}</em>
      </div>
    </div>

    <p v-if="v?.hit" class="hit" data-testid="couple-dine-hit">🎯 你们投了同一道，这就是缘分饭桌！</p>

    <div class="verdict" data-testid="couple-dine-ticket-verdict">
      <span class="label">今晚吃</span>
      <b v-if="v?.verdict" class="answer">{{ v.verdict }}</b>
      <span v-else class="empty">两票都没投之前，裁决先空着</span>
    </div>

    <div class="cast">
      <el-input v-model="dish" maxlength="30" placeholder="今晚想吃什么…" data-testid="couple-dine-ticket-dish"
                @keyup.enter="onCast" />
      <el-input v-model="reason" maxlength="80" placeholder="为什么想吃的理由（可不填）"
                data-testid="couple-dine-ticket-reason" />
      <el-button type="primary" :loading="sending" data-testid="couple-dine-ticket-submit" @click="onCast">
        投这一票 🎫
      </el-button>
    </div>
  </CoupleCollapsible>
</template>

<style scoped>
.sub { font-weight: normal; font-size: 12px; color: var(--im-muted, #909399); }
.tickets { display: flex; gap: 10px; flex-wrap: wrap; }
.ticket { flex: 1 1 160px; border: 1px dashed #f56c6c; border-radius: 8px; padding: 8px 10px; display: flex; flex-direction: column; gap: 4px; }
.ticket.is-mine { background: rgba(245, 108, 108, 0.06); }
.who { font-size: 12px; color: var(--im-muted, #909399); }
.dish { font-size: 15px; }
.reason { font-size: 12px; color: var(--im-muted, #909399); font-style: normal; }
.empty { font-size: 13px; color: var(--im-muted, #909399); }
.hit { margin: 8px 0 0; color: #f56c6c; font-size: 13px; }
.verdict { margin-top: 10px; display: flex; align-items: baseline; gap: 8px; }
.verdict .label { font-size: 12px; color: var(--im-muted, #909399); }
.verdict .answer { font-size: 18px; color: #f56c6c; }
.cast { margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap; }
</style>

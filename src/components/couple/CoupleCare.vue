<template>
  <div class="care" data-testid="couple-care">
    <!-- 情绪天气预报 -->
    <div v-if="couple.weather" class="weather-box" data-testid="couple-weather">
      <h4 class="section-title">🌦️ 今天的情绪天气</h4>
      <div class="weather-row">
        <div class="weather-cell">
          <span class="weather-emoji">{{ couple.weather.myEmoji }}</span>
          <span class="weather-owner">我</span>
        </div>
        <span class="weather-heart">💞</span>
        <div class="weather-cell">
          <span class="weather-emoji">{{ couple.weather.partnerEmoji }}</span>
          <span class="weather-owner">TA</span>
        </div>
      </div>
      <p class="weather-tip" data-testid="couple-weather-tip">{{ couple.weather.tip }}</p>
    </div>

    <!-- 情绪急救箱 -->
    <div class="aid-box" :class="{ urgent: couple.firstAid?.urgent }" data-testid="couple-first-aid">
      <div class="aid-head">
        <h4 class="section-title">💧 情绪急救箱</h4>
        <span v-if="couple.firstAid?.urgent" class="aid-badge">TA 连续低落 {{ couple.firstAid.negativeDays }} 天</span>
        <span v-else class="aid-badge calm">状态平稳</span>
      </div>
      <p class="aid-suggestion">
        今天怎么哄 TA：<b>{{ couple.firstAid?.suggestion }}</b>
      </p>
      <p class="care-tip">低落时会第一时间提醒你；不讲道理，先共情。</p>
    </div>

    <!-- 和好卡 -->
    <div class="reconcile-box" data-testid="couple-reconcile">
      <h4 class="section-title">🤍 和好卡</h4>
      <div v-if="pendingReconcile && !pendingReconcile.mine" class="pending-card" data-testid="couple-reconcile-pending">
        <p class="pr-body">{{ pendingReconcile.message }}</p>
        <div class="pr-foot">
          <span class="pr-from">{{ partnerName }} 递来了一张和好卡</span>
          <el-button type="primary" size="small" round data-testid="couple-reconcile-accept" @click="onAcceptReconcile">
            抱一下，和好 🤗
          </el-button>
        </div>
      </div>
      <div v-else-if="pendingReconcile" class="pending-card sending">
        <p class="pr-body">{{ pendingReconcile.message }}</p>
        <p class="care-tip">和好卡已递出，等 {{ partnerName }} 接受～</p>
      </div>
      <div v-else class="compose-mini">
        <el-input
          v-model="reconcileMessage"
          maxlength="200"
          show-word-limit
          placeholder="吵完架先低头不丢人：写一句和好的话…"
          data-testid="couple-reconcile-input"
          @keyup.enter="onSendReconcile"
        />
        <el-button type="warning" :loading="reconciling" data-testid="couple-reconcile-send" @click="onSendReconcile">
          递出和好卡 🤍
        </el-button>
      </div>
      <!-- 和好历史 -->
      <div v-if="acceptedReconciles.length" class="mini-history">
        <div v-for="card in acceptedReconciles.slice(0, 5)" :key="card.id" class="mini-row">
          <span class="mini-day">{{ formatDay(card.acceptedAt) }}</span>
          <span class="mini-text">{{ card.mine ? '我' : 'TA' }}递的卡 · 和好{{ card.durationHours != null ? `（别扭了 ${card.durationHours} 小时）` : '' }}</span>
        </div>
        <p class="care-tip">你们已经和好 {{ acceptedReconciles.length }} 次，每次都好好的 ❤️</p>
      </div>
    </div>

    <!-- 夸夸墙 -->
    <div class="praise-box" data-testid="couple-praise">
      <h4 class="section-title">🌟 夸夸墙</h4>
      <div class="compose-mini">
        <el-input
          v-model="praiseContent"
          maxlength="200"
          show-word-limit
          placeholder="具体地夸一次，比如「今天你等我没催，特别暖」…"
          data-testid="couple-praise-input"
          @keyup.enter="onPostPraise"
        />
        <el-button type="primary" :loading="praising" data-testid="couple-praise-post" @click="onPostPraise">
          贴上墙
        </el-button>
      </div>
      <el-empty
        v-if="!couple.praises.length"
        description="墙上还空空的，夸夸 TA 吧——要具体哦"
        :image-size="64"
        data-testid="couple-praise-empty"
      />
      <div v-else class="praise-wall">
        <div
          v-for="p in couple.praises.slice(0, 12)"
          :key="p.id"
          class="praise-card"
          :class="{ mine: p.mine, received: p.status === 'RECEIVED' }"
        >
          <p class="pr-body" data-testid="couple-praise-content">{{ p.content }}</p>
          <div class="pr-foot">
            <span class="pr-from">{{ p.mine ? '我夸 TA' : `${partnerName} 夸我` }} · {{ formatDay(p.created) }}</span>
            <el-button
              v-if="!p.mine && p.status === 'POSTED'"
              type="primary"
              size="small"
              round
              data-testid="couple-praise-receive"
              @click="onReceivePraise(p)"
            >
              收到啦 💌
            </el-button>
            <span v-else-if="p.status === 'RECEIVED'" class="praise-state">已签收 ✅</span>
            <span v-else class="praise-state waiting">等签收</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 生理期关怀 -->
    <div class="cycle-box" data-testid="couple-cycle">
      <h4 class="section-title">🌸 生理期关怀</h4>
      <!-- 我的记录表单 -->
      <div class="cycle-form" data-testid="couple-cycle-form">
        <el-date-picker
          v-model="cycleForm.periodDay"
          type="date"
          placeholder="最近一次开始日期"
          value-format="YYYY-MM-DD"
          :disabled-date="(d: Date) => d.getTime() > Date.now()"
          class="cycle-picker"
          data-testid="couple-cycle-date"
        />
        <el-input-number v-model="cycleForm.cycleDays" :min="20" :max="45" size="small" controls-position="right" style="width: 110px" />
        <span class="cycle-unit">天/周期</span>
        <el-input-number v-model="cycleForm.periodDays" :min="1" :max="10" size="small" controls-position="right" style="width: 100px" />
        <span class="cycle-unit">天经期</span>
        <el-button type="primary" size="small" :loading="cycleSaving" data-testid="couple-cycle-save" @click="onSaveCycle">
          保存
        </el-button>
      </div>
      <el-input
        v-model="cycleForm.note"
        maxlength="100"
        placeholder="小备注（对方可见）：比如「这几天想喝热的」"
        size="small"
        style="margin-top: 8px"
        data-testid="couple-cycle-note"
      />
      <!-- 双方预告卡 -->
      <div class="cycle-cards">
        <div v-for="side in cycleSides" :key="side.username" class="cycle-card" :class="{ inPeriod: side.inPeriod }">
          <div class="cc-head">
            <span class="cc-owner">{{ side.isMine ? '我的' : `${partnerName}的` }}</span>
            <span v-if="side.inPeriod" class="cc-chip">🌸 特殊时期，温柔以待</span>
            <span v-else-if="side.nextInDays != null && side.nextInDays <= 3" class="cc-chip soon">⏳ 快到了</span>
          </div>
          <p class="cc-line">
            {{ side.nextDate ? `下次预计 ${side.nextDate}（还有 ${side.nextInDays} 天）` : '还没有记录' }}
          </p>
          <p v-if="side.note" class="cc-note">📝 {{ side.note }}</p>
        </div>
      </div>
      <p class="care-tip">只有你们俩可见；TA 的记录更新时会提醒你开启温柔模式。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useCoupleStore } from '@/stores/couple'
import type { CouplePraiseVO } from '@/types'

const couple = useCoupleStore()

const reconcileMessage = ref('')
const reconciling = ref(false)
const praiseContent = ref('')
const praising = ref(false)
const cycleSaving = ref(false)
const cycleForm = reactive({ periodDay: '', cycleDays: 28, periodDays: 5, note: '' })

const partnerName = computed(() => couple.space?.partner.petName || couple.space?.partner.nickname || 'TA')

/** 待接受的和好卡（最多一张在途） */
const pendingReconcile = computed(() => couple.reconciles.find((r) => r.status === 'SENT') ?? null)
const acceptedReconciles = computed(() => couple.reconciles.filter((r) => r.status === 'ACCEPTED'))

/** 双方生理期卡（我 + TA） */
const cycleSides = computed(() => {
  const sides = []
  if (couple.cycleCard?.mine) sides.push({ ...couple.cycleCard.mine, isMine: true })
  if (couple.cycleCard?.partner) sides.push({ ...couple.cycleCard.partner, isMine: false })
  return sides
})

function formatDay(at: number | null) {
  if (!at) return ''
  const d = new Date(at)
  return `${d.getMonth() + 1}-${String(d.getDate()).padStart(2, '0')}`
}

async function onSendReconcile() {
  const text = reconcileMessage.value.trim()
  if (!text) {
    ElMessage.warning('写一句和好的话吧')
    return
  }
  reconciling.value = true
  try {
    await couple.sendReconcile(text)
    reconcileMessage.value = ''
    ElMessage.success('和好卡已递出 🤍')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '递卡失败')
  } finally {
    reconciling.value = false
  }
}

async function onAcceptReconcile() {
  if (!pendingReconcile.value) return
  try {
    await couple.acceptReconcile(pendingReconcile.value.id)
    ElMessage.success('和好啦！抱一下 🤗')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '操作失败')
  }
}

async function onPostPraise() {
  const text = praiseContent.value.trim()
  if (!text) {
    ElMessage.warning('写点具体的好话吧')
    return
  }
  praising.value = true
  try {
    await couple.postPraise(text)
    praiseContent.value = ''
    ElMessage.success('夸夸卡已贴上墙 🌟')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '发布失败')
  } finally {
    praising.value = false
  }
}

async function onReceivePraise(p: CouplePraiseVO) {
  try {
    await couple.receivePraise(p.id)
    ElMessage.success('已签收这份欣赏 💌')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '操作失败')
  }
}

async function onSaveCycle() {
  if (!cycleForm.periodDay) {
    ElMessage.warning('先选择最近一次的开始日期')
    return
  }
  cycleSaving.value = true
  try {
    await couple.saveCycle({
      periodDay: cycleForm.periodDay,
      cycleDays: cycleForm.cycleDays,
      periodDays: cycleForm.periodDays,
      note: cycleForm.note.trim() || undefined,
    })
    ElMessage.success('生理期记录已保存 🌸')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '保存失败')
  } finally {
    cycleSaving.value = false
  }
}

// 已有记录时回填表单
function fillCycleForm() {
  const mine = couple.cycleCard?.mine
  if (mine) {
    cycleForm.periodDay = mine.periodDay
    cycleForm.cycleDays = mine.cycleDays
    cycleForm.periodDays = mine.periodDays
    cycleForm.note = mine.note
  }
}

onMounted(async () => {
  await couple.loadCare()
  fillCycleForm()
})
</script>

<style scoped>
.care {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.section-title {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 700;
}
.weather-box,
.aid-box,
.reconcile-box,
.praise-box,
.cycle-box {
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  padding: 14px;
}
.weather-row {
  display: flex;
  align-items: center;
  gap: 20px;
}
.weather-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.weather-emoji {
  font-size: 34px;
}
.weather-owner {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.weather-heart {
  font-size: 20px;
}
.weather-tip {
  margin: 10px 0 0;
  font-size: 13px;
  font-weight: 600;
  color: #c45656;
}
.aid-box.urgent {
  border-color: #f89898;
  background: #fff7f7;
}
.aid-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.aid-badge {
  font-size: 11px;
  padding: 2px 10px;
  border-radius: 999px;
  background: rgba(245, 108, 108, 0.12);
  color: #c45656;
  font-weight: 600;
}
.aid-badge.calm {
  background: rgba(103, 194, 58, 0.12);
  color: #529b2e;
}
.aid-suggestion {
  margin: 8px 0 0;
  font-size: 13px;
  line-height: 1.7;
}
.care-tip {
  margin: 8px 0 0;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.compose-mini {
  display: flex;
  gap: 8px;
}
.pending-card {
  border: 1px dashed #f89898;
  border-radius: 10px;
  padding: 12px 14px;
  background: #fffdf8;
}
.pending-card.sending {
  border-color: var(--el-border-color-lighter, #ebeef5);
  background: var(--el-fill-color-lighter, #fafafa);
}
.pr-body {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  word-break: break-all;
}
.pr-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
}
.pr-from {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.mini-history {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.mini-row {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.mini-day {
  flex-shrink: 0;
  font-weight: 600;
}
.mini-text {
  word-break: break-all;
}
.praise-wall {
  margin-top: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
@media (max-width: 640px) {
  .praise-wall {
    grid-template-columns: 1fr;
  }
}
.praise-card {
  border-radius: 10px;
  padding: 10px 12px;
  background: #fffbe6;
  border: 1px solid #f5dab1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.praise-card.mine {
  background: var(--el-fill-color-lighter, #fafafa);
  border-color: var(--el-border-color-lighter, #ebeef5);
}
.praise-card.received {
  background: #f0f9eb;
  border-color: #c2e7b0;
}
.praise-state {
  font-size: 11px;
  color: var(--el-color-success, #67c23a);
  font-weight: 600;
}
.praise-state.waiting {
  color: var(--el-color-info, #909399);
}
.cycle-form {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.cycle-picker {
  width: 150px;
}
.cycle-unit {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.cycle-cards {
  margin-top: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
@media (max-width: 640px) {
  .cycle-cards {
    grid-template-columns: 1fr;
  }
}
.cycle-card {
  border-radius: 10px;
  padding: 10px 12px;
  background: var(--el-fill-color-lighter, #fafafa);
}
.cycle-card.inPeriod {
  background: #fdf0f5;
  border: 1px solid #f8b8cb;
}
.cc-head {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.cc-owner {
  font-size: 12px;
  font-weight: 700;
}
.cc-chip {
  font-size: 11px;
  padding: 1px 8px;
  border-radius: 999px;
  background: rgba(245, 108, 108, 0.12);
  color: #c45656;
  font-weight: 600;
}
.cc-chip.soon {
  background: rgba(230, 162, 60, 0.14);
  color: #b88230;
}
.cc-line {
  margin: 6px 0 0;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.cc-note {
  margin: 4px 0 0;
  font-size: 12px;
  word-break: break-all;
}
</style>

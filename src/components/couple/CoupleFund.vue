<template>
  <div class="funds" data-testid="couple-funds">
    <div class="toolbar">
      <span class="section-hint">一起攒钱实现的小目标，双方都能往里存</span>
      <el-button type="primary" size="small" data-testid="couple-fund-add" @click="openCreate">
        <el-icon class="btn-ico"><Plus /></el-icon>立一个心愿
      </el-button>
    </div>

    <!-- 新建心愿 -->
    <div v-if="creating" class="create-box" data-testid="couple-fund-create">
      <el-input
        v-model="title"
        maxlength="60"
        placeholder="心愿名称，如「一起去北海道旅行」"
        data-testid="couple-fund-title"
      />
      <div class="create-row">
        <el-input-number
          v-model="targetYuan"
          :min="1"
          :max="99999999"
          :step="100"
          :controls="false"
          placeholder="目标金额（元）"
          class="target-input"
          data-testid="couple-fund-target"
        />
        <span class="yuan-unit">元</span>
        <el-button type="primary" :loading="saving" data-testid="couple-fund-save" @click="onCreate">
          发起
        </el-button>
      </div>
    </div>

    <el-empty
      v-if="!couple.funds.length"
      description="还没有共同心愿，一起攒钱干件大事吧 💰"
      :image-size="70"
      data-testid="couple-funds-empty"
    />
    <div v-else class="fund-list">
      <div
        v-for="fund in couple.funds"
        :key="fund.id"
        class="fund-card"
        :class="{ reached: fund.reached }"
        :data-testid="`couple-fund-${fund.id}`"
      >
        <div class="fund-head">
          <span class="fund-title" data-testid="couple-fund-title-text">
            {{ fund.reached ? '🎉' : '💛' }} {{ fund.title }}
          </span>
          <el-button link size="small" type="danger" @click="onDelete(fund)">移除</el-button>
        </div>
        <el-progress
          :percentage="fund.progress"
          :status="fund.reached ? 'success' : undefined"
          :stroke-width="10"
          data-testid="couple-fund-progress"
        />
        <div class="fund-amounts">
          <span class="fund-saved" data-testid="couple-fund-saved">{{ yuan(fund.savedAmount) }} 元</span>
          <span class="fund-target">/ {{ yuan(fund.targetAmount) }} 元</span>
          <span v-if="fund.reached" class="fund-reached">已达成！</span>
        </div>

        <!-- 存入记录 -->
        <div v-if="fund.deposits.length" class="deposit-list">
          <div v-for="dep in fund.deposits.slice(0, 5)" :key="dep.id" class="deposit-row">
            <span class="dep-who">{{ dep.username === auth.username ? '我' : 'TA' }}</span>
            <span class="dep-amount">+{{ yuan(dep.amount) }} 元</span>
            <span v-if="dep.note" class="dep-note">「{{ dep.note }}」</span>
            <span class="dep-time">{{ formatChatTime(dep.created) }}</span>
          </div>
          <div v-if="fund.deposits.length > 5" class="dep-more">还有 {{ fund.deposits.length - 5 }} 笔更早的存入…</div>
        </div>

        <el-button
          v-if="!fund.reached"
          type="primary"
          size="small"
          round
          plain
          data-testid="couple-fund-deposit"
          @click="openDeposit(fund)"
        >
          存一笔 💰
        </el-button>
      </div>
    </div>

    <!-- 存钱弹窗 -->
    <el-dialog v-model="depositVisible" :title="`往「${depositTarget?.title ?? ''}」存一笔`" width="380px" draggable>
      <div class="deposit-input-row">
        <el-input-number
          v-model="depositYuan"
          :min="0.01"
          :max="9999999"
          :step="10"
          :controls="false"
          placeholder="金额（元）"
          class="target-input"
          data-testid="couple-fund-deposit-amount"
        />
        <span class="yuan-unit">元</span>
      </div>
      <el-input
        v-model="depositNote"
        maxlength="100"
        placeholder="留言（可空），如「这个月省下的奶茶钱」"
        class="note-input"
        data-testid="couple-fund-deposit-note"
      />
      <template #footer>
        <el-button @click="depositVisible = false">取消</el-button>
        <el-button type="primary" :loading="depositing" data-testid="couple-fund-deposit-save" @click="onDeposit">
          存入
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { useCoupleStore } from '@/stores/couple'
import { formatChatTime } from '@/utils/imFormat'
import type { CoupleFundVO } from '@/types'

const auth = useAuthStore()
const couple = useCoupleStore()

const creating = ref(false)
const title = ref('')
const targetYuan = ref<number | undefined>(undefined)
const saving = ref(false)

const depositVisible = ref(false)
const depositTarget = ref<CoupleFundVO | null>(null)
const depositYuan = ref<number | undefined>(undefined)
const depositNote = ref('')
const depositing = ref(false)

/** 分 → 元字符串（去掉多余的 0） */
function yuan(cents: number): string {
  return String(Math.round(cents) / 100)
}

function openCreate() {
  creating.value = !creating.value
}

function openDeposit(fund: CoupleFundVO) {
  depositTarget.value = fund
  depositYuan.value = undefined
  depositNote.value = ''
  depositVisible.value = true
}

async function onCreate() {
  const name = title.value.trim()
  if (!name || !targetYuan.value || targetYuan.value <= 0) {
    ElMessage.warning('填好心愿名称和目标金额')
    return
  }
  saving.value = true
  try {
    await couple.createFund(name, Math.round(targetYuan.value * 100))
    title.value = ''
    targetYuan.value = undefined
    ElMessage.success('心愿已发起，一起攒钱吧 💰')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '创建失败')
  } finally {
    saving.value = false
  }
}

async function onDeposit() {
  if (!depositTarget.value || !depositYuan.value || depositYuan.value <= 0) {
    ElMessage.warning('先填存入金额')
    return
  }
  depositing.value = true
  try {
    await couple.depositFund(depositTarget.value.id, Math.round(depositYuan.value * 100), depositNote.value.trim() || undefined)
    depositVisible.value = false
    ElMessage.success('存好啦，离心愿又近了一步 💛')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '存入失败')
  } finally {
    depositing.value = false
  }
}

async function onDelete(fund: CoupleFundVO) {
  try {
    await couple.deleteFund(fund.id)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '操作失败')
  }
}

onMounted(() => {
  void couple.loadFunds()
})
</script>

<style scoped>
.funds {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.section-hint {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.create-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px dashed var(--el-border-color, #dcdfe6);
  border-radius: 10px;
  padding: 10px;
}
.create-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.target-input {
  width: 160px;
}
.yuan-unit {
  font-size: 13px;
  color: var(--im-muted, #8f959e);
}
.fund-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.fund-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  padding: 12px 14px;
}
.fund-card.reached {
  background: var(--el-color-success-light-9, #f0f9eb);
  border-color: var(--el-color-success-light-7, #e1f3d8);
}
.fund-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.fund-title {
  font-size: 14px;
  font-weight: 700;
  word-break: break-all;
}
.fund-amounts {
  display: flex;
  align-items: baseline;
  gap: 6px;
}
.fund-saved {
  font-size: 16px;
  font-weight: 700;
  color: var(--el-color-primary, #409eff);
}
.fund-target {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.fund-reached {
  font-size: 12px;
  font-weight: 700;
  color: var(--el-color-success, #67c23a);
}
.deposit-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-top: 1px dashed var(--el-border-color-lighter, #ebeef5);
  padding-top: 8px;
}
.deposit-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 12px;
}
.dep-who {
  flex-shrink: 0;
  font-weight: 700;
  color: var(--im-muted, #8f959e);
}
.dep-amount {
  flex-shrink: 0;
  color: var(--el-color-success, #67c23a);
  font-weight: 700;
}
.dep-note {
  flex: 1;
  color: var(--im-muted, #8f959e);
  word-break: break-all;
}
.dep-time {
  flex-shrink: 0;
  color: var(--im-muted, #8f959e);
}
.dep-more {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.deposit-input-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.note-input {
  width: 100%;
}
.btn-ico {
  margin-right: 2px;
}
</style>

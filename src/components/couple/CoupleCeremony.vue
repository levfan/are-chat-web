<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { ceremonyApi } from '@/api/couple'
import { useAuthStore } from '@/stores/auth'
import type { CoupleCerOverviewVO } from '@/types'
import CoupleCollapsible from './CoupleCollapsible.vue'

/** 愿望券本（保留卡 `couple-cere-coupon`）：花积分给 TA 造一个愿望，TA 说了算什么时候兑。 */
const auth = useAuthStore()
// CouponVO 不下发「这张是不是我发的」，按后端先例用本人用户名比对 issuer
const me = computed(() => auth.username)
const v = ref<CoupleCerOverviewVO | null>(null)
const title = ref('')
const showUsed = ref(false)
const sending = ref(false)

async function refresh() {
  try {
    v.value = await ceremonyApi.cereOverview()
  } catch {
    v.value = null
  }
}

async function onIssue() {
  const t = title.value.trim()
  if (!t) {
    ElMessage.warning('券面写点什么愿望吧')
    return
  }
  sending.value = true
  try {
    v.value = await ceremonyApi.cereIssueCoupon(t)
    ElMessage.success('🎟️ 券已送到 TA 那边')
    title.value = ''
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '发券失败')
  } finally {
    sending.value = false
  }
}

async function onUse(id: string) {
  try {
    v.value = await ceremonyApi.cereUseCoupon(id)
    ElMessage.success('✨ 愿望兑现了')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '核销失败')
  }
}

onMounted(refresh)
</script>

<template>
  <CoupleCollapsible testid="couple-cere-coupon" :empty="!v">
    <template #title>
      🎟️ 愿望券本 <span class="sub">攒的分，都花在 TA 身上</span>
    </template>

    <p v-if="v" class="balance" data-testid="couple-cere-coupon-balance">
      我的积分余额 {{ v.myBalance }} · 一张券 {{ v.couponCost }} 分
      <span v-if="v.myBalance < v.couponCost" class="short">（还不够，先去好事簿记一笔）</span>
    </p>

    <ul v-if="v?.couponsOpen?.length" class="list">
      <li v-for="c in v.couponsOpen" :key="c.id" class="coupon" :data-testid="`couple-cere-coupon-${c.id}`">
        <span class="title-text" data-testid="couple-cere-coupon-title">{{ c.title }}</span>
        <span class="issuer">{{ c.issuer === me ? '我发给 TA 的' : 'TA 发给我的' }}</span>
        <el-button v-if="c.issuer !== me" link type="primary" size="small"
                   :data-testid="`couple-cere-coupon-use-${c.id}`" @click="onUse(c.id)">兑现</el-button>
      </li>
    </ul>
    <p v-else-if="v" class="empty" data-testid="couple-cere-coupon-none">还没有在途的券</p>

    <div class="form">
      <el-input v-model="title" maxlength="80" placeholder="任意愿望一次 / 陪我去海边…" data-testid="couple-cere-coupon-text"
                @keyup.enter="onIssue" />
      <el-button type="primary" :loading="sending" data-testid="couple-cere-coupon-submit" @click="onIssue">
        发一张券 🎟️
      </el-button>
    </div>

    <template v-if="v?.couponsUsed?.length">
      <el-button link size="small" data-testid="couple-cere-coupon-used-toggle" @click="showUsed = !showUsed">
        {{ showUsed ? '收起' : '看' }}已核销（{{ v.couponsUsed.length }}）
      </el-button>
      <ul v-if="showUsed" class="list used">
        <li v-for="c in v.couponsUsed" :key="c.id" class="coupon done" :data-testid="`couple-cere-coupon-used-${c.id}`">
          <span class="title-text">{{ c.title }}</span>
          <span class="by">由 {{ c.usedBy }} 兑现</span>
        </li>
      </ul>
    </template>
  </CoupleCollapsible>
</template>

<style scoped>
.sub { font-weight: normal; font-size: 12px; color: var(--im-muted, #909399); }
.balance { margin: 0 0 8px; font-size: 13px; color: #b8860b; }
.short { font-size: 12px; color: var(--im-muted, #909399); }
.list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.coupon { display: flex; gap: 8px; align-items: baseline; font-size: 13px; border: 1px dashed #b8860b; border-radius: 8px; padding: 6px 10px; }
.coupon.done { border-style: solid; border-color: var(--im-border, #eee); opacity: 0.7; }
.coupon .title-text { flex: 1; }
.coupon .issuer, .coupon .by { font-size: 12px; color: var(--im-muted, #909399); }
.empty { font-size: 13px; color: var(--im-muted, #909399); }
.form { margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap; }
.used { margin-top: 6px; }
</style>

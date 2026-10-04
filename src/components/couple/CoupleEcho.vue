<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { echoApi } from '@/api/couple'
import type { CoupleEchoVO } from '@/types'
import CoupleCollapsible from './CoupleCollapsible.vue'

/** 好事簿（保留卡 `couple-echo-deed`）：记一件「TA 为我做的事」，攒下被爱的证据。 */
const v = ref<CoupleEchoVO | null>(null)
const content = ref('')
const day = ref('')
const sending = ref(false)

async function refresh() {
  try {
    v.value = await echoApi.echoVault()
  } catch {
    v.value = null
  }
}

async function onAdd() {
  const c = content.value.trim()
  if (!c) {
    ElMessage.warning('好事总得写一句')
    return
  }
  if (c.length > 80) {
    ElMessage.warning('一件好事最多 80 字')
    return
  }
  if (day.value && !/^\d{4}-\d{2}-\d{2}$/.test(day.value)) {
    ElMessage.warning('日期写成 yyyy-MM-dd')
    return
  }
  sending.value = true
  try {
    v.value = await echoApi.echoDeed(c, day.value.trim())
    ElMessage.success('📖 记下了，TA 也因此攒到 2 分')
    content.value = ''
    day.value = ''
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '记不上')
  } finally {
    sending.value = false
  }
}

async function onStar(id: string) {
  try {
    v.value = await echoApi.echoDeedStar(id)
    ElMessage.success('⭐ 这条救过我')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '加星失败')
  }
}

onMounted(refresh)
</script>

<template>
  <CoupleCollapsible testid="couple-echo-deed" :empty="!v">
    <template #title>
      📖 好事簿 <span class="sub">被爱的证据，越攒越多</span>
    </template>

    <p v-if="v" class="counts" data-testid="couple-echo-deed-count">
      我记下 TA 的好 {{ v.partnerCount }} 条 · TA 记下我的好 {{ v.mineCount }} 条
    </p>

    <section>
      <h5 class="line-title">TA 为我做的</h5>
      <ul v-if="v?.deeds?.length" class="list">
        <li v-for="d in v.deeds" :key="d.id" class="deed" :data-testid="`couple-echo-deed-${d.id}`">
          <span class="day">{{ d.day }}</span>
          <span class="text" data-testid="couple-echo-deed-content">{{ d.content }}</span>
          <el-button v-if="!d.starred" link type="warning" size="small"
                     :data-testid="`couple-echo-deed-star-${d.id}`" @click="onStar(d.id)">加星</el-button>
          <span v-else class="starred" data-testid="couple-echo-deed-starred">⭐ 救过我</span>
        </li>
      </ul>
      <p v-else-if="v" class="empty" data-testid="couple-echo-deed-empty">还没记过——今天有没有一件小事值得记一笔？</p>
    </section>

    <section>
      <h5 class="line-title">我替 TA 做过的（TA 记的）</h5>
      <ul v-if="v?.partnerDeeds?.length" class="list">
        <li v-for="d in v.partnerDeeds" :key="d.id" class="deed partner" :data-testid="`couple-echo-deed-p-${d.id}`">
          <span class="day">{{ d.day }}</span>
          <span class="text">{{ d.content }}</span>
          <span v-if="d.starred" class="starred">⭐</span>
        </li>
      </ul>
      <p v-else-if="v" class="empty" data-testid="couple-echo-deed-partner-empty">TA 还没记过</p>
    </section>

    <div class="form">
      <el-input v-model="content" maxlength="80" placeholder="下雨天绕路来接我…" data-testid="couple-echo-deed-input"
                @keyup.enter="onAdd" />
      <el-input v-model="day" maxlength="10" placeholder="哪一天（可不填=今天）" data-testid="couple-echo-deed-day"
                @keyup.enter="onAdd" />
      <el-button type="primary" :loading="sending" data-testid="couple-echo-deed-submit" @click="onAdd">
        记一笔 ✍️
      </el-button>
    </div>
  </CoupleCollapsible>
</template>

<style scoped>
.sub { font-weight: normal; font-size: 12px; color: var(--im-muted, #909399); }
.counts { margin: 0 0 8px; font-size: 12px; color: var(--im-muted, #909399); }
.line-title { margin: 8px 0 6px; font-size: 13px; color: #be185d; font-weight: 600; }
.list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.deed { display: flex; gap: 8px; align-items: baseline; font-size: 13px; border-bottom: 1px dashed var(--im-border, #eee); padding-bottom: 4px; }
.deed.partner .text { color: var(--im-muted, #909399); }
.deed .day { font-size: 12px; color: var(--im-muted, #909399); }
.deed .text { flex: 1; }
.starred { font-size: 12px; color: #e6a23c; }
.empty { font-size: 13px; color: var(--im-muted, #909399); }
.form { margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap; }
</style>

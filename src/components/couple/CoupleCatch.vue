<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { catchApi } from '@/api/couple'
import type { CoupleCatchVO } from '@/types'
import CoupleCollapsible from './CoupleCollapsible.vue'

/** 安全词与暂停复盘（保留卡 `couple-catch-safeword`）：吵架时有一个可以喊的停。 */
const v = ref<CoupleCatchVO | null>(null)
const word = ref('')
const note = ref('')
const reflectId = ref('')
const reflectText = ref('')

async function refresh() {
  try {
    v.value = await catchApi.catchBoard()
  } catch {
    v.value = null
  }
}

async function onSet() {
  const w = word.value.trim()
  if (!w) {
    ElMessage.warning('暂停词总得有个词')
    return
  }
  try {
    v.value = await catchApi.catchSafeword(w, note.value.trim())
    ElMessage.success('🛑 约好了，吵架时喊它不算认输')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '约定失败')
  }
}

async function onUse() {
  if (!v.value?.myWord) {
    ElMessage.warning('先约一个安全词，才喊得出口 🛑')
    return
  }
  if (v.value.usedTodayMine) {
    ElMessage.warning('今天已经记过一次暂停了，别把安全词用成口头禅')
    return
  }
  try {
    v.value = await catchApi.catchSafewordUse()
    ElMessage.success('喊停了。先去各自倒杯水 🥤')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '喊停失败')
  }
}

function startReflect(id: string) {
  reflectId.value = id
  reflectText.value = ''
}

async function onSubmitReflect() {
  const t = reflectText.value.trim()
  if (!t) {
    ElMessage.warning('复盘写一句：当时卡在哪、后来怎么接着聊的')
    return
  }
  try {
    v.value = await catchApi.catchSafewordReflect(reflectId.value, t)
    ElMessage.success('📝 记下了，下次就少吵一次')
    reflectId.value = ''
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '复盘没存上')
  }
}

onMounted(refresh)
</script>

<template>
  <CoupleCollapsible testid="couple-catch-safeword" :empty="!v">
    <template #title>
      🛑 安全词与暂停复盘 <span class="sub">喊停要留痕，事后补一句</span>
    </template>

    <div class="words">
      <div class="word" data-testid="couple-catch-word-mine">
        <span class="who">我的词</span>
        <template v-if="v?.myWord">
          <b class="text" data-testid="couple-catch-word-mine-text">{{ v.myWord.word }}</b>
          <em v-if="v.myWord.note" class="note" data-testid="couple-catch-word-mine-note">{{ v.myWord.note }}</em>
          <span class="count" data-testid="couple-catch-word-mine-count">喊过 {{ v.myWord.useCount }} 次</span>
        </template>
        <span v-else class="empty" data-testid="couple-catch-word-mine-none">还没约定</span>
      </div>
      <div class="word" data-testid="couple-catch-word-partner">
        <span class="who">TA 的词</span>
        <template v-if="v?.partnerWord">
          <b class="text" data-testid="couple-catch-word-partner-text">{{ v.partnerWord.word }}</b>
          <em v-if="v.partnerWord.note" class="note" data-testid="couple-catch-word-partner-note">{{ v.partnerWord.note }}</em>
          <span class="count">{{ v.partnerWord.useCount }} 次</span>
        </template>
        <span v-else class="empty" data-testid="couple-catch-word-partner-none">TA 还没约定</span>
      </div>
    </div>

    <div class="form">
      <el-input v-model="word" maxlength="20" placeholder="比如「暂停」「十分钟」" data-testid="couple-catch-word-text"
                @keyup.enter="onSet" />
      <el-input v-model="note" maxlength="60" placeholder="用了之后希望怎样（可不填）" data-testid="couple-catch-word-note"
                @keyup.enter="onSet" />
      <el-button data-testid="couple-catch-word-submit" @click="onSet">约定 🤝</el-button>
    </div>

    <div class="use-row">
      <el-button type="danger" plain :disabled="!v?.myWord || v?.usedTodayMine" data-testid="couple-catch-word-use"
                 @click="onUse">
        {{ v?.usedTodayMine ? '今天喊过了' : '我现在要暂停 🛑' }}
      </el-button>
      <span v-if="v?.usedTodayPartner" class="hint" data-testid="couple-catch-word-partner-wait">TA 今天喊过一次了</span>
      <span v-if="v" class="hint">本月两人合计 {{ v.monthUses }} 次</span>
    </div>

    <ul v-if="v?.uses?.length" class="uses">
      <li v-for="u in v.uses" :key="u.id" class="use" :data-testid="`couple-catch-use-${u.id}`">
        <span class="day">{{ u.day }}</span>
        <span class="who2">{{ u.mine ? '我' : 'TA' }}</span>
        <span class="word2">「{{ u.word }}」</span>
        <span v-if="u.reflect" class="reflect" data-testid="couple-catch-use-reflect">{{ u.reflect }}</span>
        <el-button v-else-if="u.mine" link type="primary" size="small"
                   :data-testid="`couple-catch-reflect-btn-${u.id}`" @click="startReflect(u.id)">补复盘</el-button>
        <span v-else class="hint">等 TA 自己补</span>
      </li>
    </ul>
    <p v-else-if="v" class="empty" data-testid="couple-catch-use-none">还没喊过停——挺好的，继续保持</p>

    <div v-if="reflectId" class="reflect-form">
      <el-input v-model="reflectText" maxlength="60" placeholder="当时卡在哪、后来怎么接着聊的"
                data-testid="couple-catch-reflect-input" @keyup.enter="onSubmitReflect" />
      <el-button type="primary" data-testid="couple-catch-reflect-submit" @click="onSubmitReflect">记下 📝</el-button>
    </div>
  </CoupleCollapsible>
</template>

<style scoped>
.sub { font-weight: normal; font-size: 12px; color: var(--im-muted, #909399); }
.words { display: flex; gap: 10px; flex-wrap: wrap; }
.word { flex: 1 1 170px; border: 1px dashed #9254de; border-radius: 8px; padding: 8px 10px; display: flex; flex-direction: column; gap: 4px; }
.who, .who2 { font-size: 12px; color: var(--im-muted, #909399); }
.text { font-size: 16px; color: #9254de; }
.note { font-size: 12px; font-style: normal; color: var(--im-muted, #909399); }
.count { font-size: 12px; color: var(--im-muted, #909399); }
.empty { font-size: 13px; color: var(--im-muted, #909399); }
.form { margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap; }
.use-row { margin-top: 10px; display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.hint { font-size: 12px; color: var(--im-muted, #909399); }
.uses { list-style: none; margin: 10px 0 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.use { display: flex; gap: 8px; align-items: baseline; font-size: 13px; border-bottom: 1px dashed var(--im-border, #eee); padding-bottom: 4px; flex-wrap: wrap; }
.word2 { color: #9254de; }
.reflect { color: var(--im-muted, #909399); }
.reflect-form { margin-top: 8px; display: flex; gap: 8px; }
</style>

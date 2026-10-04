<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { questApi } from '@/api/couple'
import type { CoupleQuestVO } from '@/types'
import CoupleCollapsible from './CoupleCollapsible.vue'

/** 加班预报与留灯（保留卡 `couple-quest-overtime`）：说一句忙到几点，灯只有对方能留。 */
const v = ref<CoupleQuestVO | null>(null)
const hour = ref('20')
const note = ref('')
const lampText = ref('')

async function refresh() {
  try {
    v.value = await questApi.questBoard()
  } catch {
    v.value = null
  }
}

async function onReport() {
  const h = Number(hour.value)
  if (!Number.isFinite(h)) {
    ElMessage.warning('写个钟点呀，比如 21')
    return
  }
  if (h < 13 || h > 23) {
    ElMessage.warning('钟点要在 13-23 之间')
    return
  }
  try {
    v.value = await questApi.questOvertime(h, note.value.trim())
    ElMessage.success('🌙 已经告诉 TA 了，别等饭')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '预报失败')
  }
}

async function onLamp() {
  const t = lampText.value.trim()
  if (!t) {
    ElMessage.warning('灯下想留的那句话写一句')
    return
  }
  if (!v.value?.partnerOvertime) {
    ElMessage.warning('TA 今晚没预报加班，这灯先别留')
    return
  }
  try {
    v.value = await questApi.questLamp(v.value.partnerOvertime.id, t)
    ElMessage.success('💡 灯留下了，TA 回来时屋里是亮的')
    lampText.value = ''
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '留灯失败')
  }
}

onMounted(refresh)
</script>

<template>
  <CoupleCollapsible testid="couple-quest-overtime" :empty="!v">
    <template #title>
      💡 加班预报与留灯 <span class="sub">说一句忙到几点，灯只有对方能留</span>
    </template>

    <div class="rows">
      <div class="row" data-testid="couple-quest-overtime-mine">
        <span class="who">我这边</span>
        <template v-if="v?.myOvertime">
          <b class="hour" :data-testid="`couple-quest-overtime-mine-hour`">忙到 {{ v.myOvertime.untilHour }} 点</b>
          <em v-if="v.myOvertime.note" class="note" data-testid="couple-quest-overtime-mine-note">{{ v.myOvertime.note }}</em>
          <span v-if="v.myOvertime.lamp" class="lamp" data-testid="couple-quest-overtime-my-lamp">
            TA 留的灯：{{ v.myOvertime.lamp }}
          </span>
        </template>
        <span v-else class="empty" data-testid="couple-quest-overtime-mine-none">今晚还没说</span>
      </div>

      <div class="row" data-testid="couple-quest-overtime-partner">
        <span class="who">TA 那边</span>
        <template v-if="v?.partnerOvertime">
          <b class="hour">{{ v.partnerOvertime.untilHour }} 点</b>
          <em v-if="v.partnerOvertime.note" class="note">{{ v.partnerOvertime.note }}</em>
          <span v-if="v.partnerOvertime.lamp" class="lamp" data-testid="couple-quest-lamp-lit">
            你已经留过灯：{{ v.partnerOvertime.lamp }}
          </span>
        </template>
        <span v-else class="empty" data-testid="couple-quest-overtime-partner-none">今晚没说</span>
      </div>
    </div>

    <div class="form">
      <el-input v-model="hour" maxlength="2" placeholder="20" data-testid="couple-quest-overtime-hour"
                @keyup.enter="onReport" />
      <el-input v-model="note" maxlength="40" placeholder="附一句（可不填）" data-testid="couple-quest-overtime-note"
                @keyup.enter="onReport" />
      <el-button type="primary" data-testid="couple-quest-overtime-submit" @click="onReport">报一声 🌙</el-button>
    </div>

    <div v-if="v" class="lamp-form">
      <el-input v-model="lampText" maxlength="60" placeholder="到家灯给你留着…" data-testid="couple-quest-lamp-text"
                :disabled="!v.canLeaveLamp" @keyup.enter="onLamp" />
      <el-button v-if="v.canLeaveLamp" type="warning" data-testid="couple-quest-lamp-submit" @click="onLamp">
        留一盏 💡
      </el-button>
      <span v-else-if="!v.partnerOvertime" class="hint" data-testid="couple-quest-lamp-norow">
        TA 今晚没预报加班，这灯先留着下次
      </span>
      <span v-else class="hint" data-testid="couple-quest-lamp-done">灯已经留过了，别重复点</span>
    </div>
  </CoupleCollapsible>
</template>

<style scoped>
.sub { font-weight: normal; font-size: 12px; color: var(--im-muted, #909399); }
.rows { display: flex; gap: 10px; flex-wrap: wrap; }
.row { flex: 1 1 180px; border: 1px dashed #e6a23c; border-radius: 8px; padding: 8px 10px; display: flex; flex-direction: column; gap: 4px; }
.who { font-size: 12px; color: var(--im-muted, #909399); }
.hour { font-size: 15px; color: #e6a23c; }
.note, .lamp { font-size: 12px; font-style: normal; color: var(--im-muted, #909399); }
.lamp { color: #e6a23c; }
.empty { font-size: 13px; color: var(--im-muted, #909399); }
.form, .lamp-form { margin-top: 10px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.hint { font-size: 12px; color: var(--im-muted, #909399); }
</style>

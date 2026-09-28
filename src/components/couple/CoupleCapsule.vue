<template>
  <div class="capsules" data-testid="couple-capsules">
    <!-- 封存胶囊 -->
    <div class="seal-box">
      <h4 class="section-title">⏳ 封一枚时光胶囊</h4>
      <el-input
        v-model="content"
        type="textarea"
        :rows="3"
        maxlength="500"
        show-word-limit
        placeholder="把现在的心情、约定或惊喜封进胶囊，30~365 天后的 TA 才能打开…"
        data-testid="couple-capsule-content"
      />
      <div class="seal-row">
        <el-date-picker
          v-model="openDay"
          type="date"
          placeholder="开启日期（30~365 天后）"
          value-format="YYYY-MM-DD"
          class="seal-picker"
          :disabled-date="disableDate"
          data-testid="couple-capsule-day"
        />
        <el-button type="primary" :loading="sealing" data-testid="couple-capsule-seal" @click="onSeal">
          封存 ⏳
        </el-button>
      </div>
      <p class="tip">到点前谁也打不开（包括自己）；TA 会收到「TA 封存了一枚时光胶囊」的推送。</p>
    </div>

    <!-- 胶囊列表 -->
    <el-empty
      v-if="!couple.capsules.length"
      description="还没有胶囊，封第一枚给未来的 TA 吧 🕰️"
      :image-size="70"
      data-testid="couple-capsules-empty"
    />
    <div v-else class="capsule-list">
      <div
        v-for="c in couple.capsules"
        :key="c.id"
        class="capsule-card"
        :class="{ mine: c.mine, opened: c.status === 'OPENED' }"
        :data-testid="`couple-capsule-${c.id}`"
      >
        <div class="head">
          <span class="dir">{{ c.mine ? '✍️ 我封存的' : '📬 TA 封给我的' }}</span>
          <span class="day">⏰ {{ c.openDay }} 开启</span>
        </div>
        <p v-if="c.content !== null" class="body" data-testid="couple-capsule-body">{{ c.content }}</p>
        <div v-else class="locked" data-testid="couple-capsule-locked">
          <span class="lock">🔒</span>
          <span>还有 {{ c.remainDays }} 天才能开启，先猜猜里面写了什么～</span>
        </div>
        <div class="foot">
          <span v-if="c.status === 'OPENED' && c.openedAt" class="state opened">
            {{ c.mine ? `TA 在 ${formatTime(c.openedAt)} 开启了` : `我在 ${formatTime(c.openedAt)} 开启了` }}
          </span>
          <span v-else-if="c.locked" class="state sealed">⏳ 封存中</span>
          <el-button
            v-else-if="!c.mine"
            type="primary"
            size="small"
            round
            data-testid="couple-capsule-open"
            @click="onOpen(c.id)"
          >
            开启胶囊 ✨
          </el-button>
          <span v-else class="state ready">待 TA 开启</span>
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
const content = ref('')
const openDay = ref('')
const sealing = ref(false)

function disableDate(d: Date) {
  const min = new Date()
  min.setDate(min.getDate() + 30)
  const max = new Date()
  max.setDate(max.getDate() + 365)
  return d.getTime() < min.setHours(0, 0, 0, 0) || d.getTime() > max.getTime()
}

function formatTime(at: number) {
  const d = new Date(at)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getMonth() + 1}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

async function onSeal() {
  const text = content.value.trim()
  if (!text) {
    ElMessage.warning('先写下想封存的话')
    return
  }
  if (!openDay.value) {
    ElMessage.warning('选择一个开启日期（30~365 天后）')
    return
  }
  sealing.value = true
  try {
    await couple.sealCapsule(text, openDay.value)
    content.value = ''
    openDay.value = ''
    ElMessage.success('胶囊已封存 ⏳ 到点才能打开，一起期待吧')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '封存失败')
  } finally {
    sealing.value = false
  }
}

async function onOpen(id: string) {
  try {
    await couple.openCapsule(id)
    ElMessage.success('胶囊开启啦 ✨')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '开启失败')
  }
}

onMounted(() => {
  void couple.loadCapsules()
})
</script>

<style scoped>
.capsules {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.section-title {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 700;
}
.seal-box {
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  padding: 14px;
}
.seal-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}
.seal-picker {
  width: 200px;
}
.tip {
  margin: 8px 0 0;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.capsule-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.capsule-card {
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  padding: 12px 14px;
}
.capsule-card.mine {
  background: var(--el-fill-color-lighter, #fafafa);
}
.capsule-card.opened {
  background: #f0f9eb;
  border-color: #c2e7b0;
}
.head {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}
.dir {
  font-size: 12px;
  font-weight: 700;
  color: var(--el-color-primary, #409eff);
}
.capsule-card.mine .dir {
  color: var(--el-color-success, #67c23a);
}
.day {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.body {
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-all;
}
.locked {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 8px;
  background: var(--el-fill-color-lighter, #f5f7fa);
  font-size: 13px;
  color: var(--im-muted, #8f959e);
}
.lock {
  font-size: 18px;
}
.foot {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
}
.state {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.state.opened {
  color: var(--el-color-success, #67c23a);
}
.state.ready {
  color: var(--el-color-warning, #e6a23c);
}
</style>

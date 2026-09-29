<template>
  <div class="city-card" data-testid="couple-city-card">
    <div class="block-head">
      <h4 class="section-title">📍 异地恋助手</h4>
      <el-button size="small" round data-testid="couple-city-edit" @click="openEdit">改我的城市</el-button>
    </div>

    <div class="city-grid">
      <div class="city-cell">
        <span class="city-owner">我</span>
        <span class="city-name" data-testid="couple-city-mine">{{ couple.cityCard?.myCity || '未设置' }}</span>
        <span class="city-clock">{{ myClock }}</span>
      </div>
      <div class="city-mid" data-testid="couple-city-metrics">
        <template v-if="couple.cityCard?.hoursDiff !== null && couple.cityCard?.hoursDiff !== undefined">
          <span class="mid-main">{{ hoursText }}</span>
          <span class="mid-sub">时差</span>
        </template>
        <template v-else>
          <span class="mid-heart">💞</span>
        </template>
        <template v-if="couple.cityCard?.distanceKm !== null && couple.cityCard?.distanceKm !== undefined">
          <span class="mid-main">{{ couple.cityCard!.distanceKm!.toLocaleString() }} km</span>
          <span class="mid-sub">相隔</span>
        </template>
      </div>
      <div class="city-cell">
        <span class="city-owner">TA</span>
        <span class="city-name" data-testid="couple-city-partner">{{ couple.cityCard?.partnerCity || '未设置' }}</span>
        <span class="city-clock" data-testid="couple-city-clock">{{ partnerClock || ' ' }}</span>
      </div>
    </div>

    <!-- F39 见面倒数：把「下次见面」变成一个正式的期待 -->
    <div class="meet-box">
      <template v-if="meetCountdown">
        <span class="meet-days" data-testid="couple-meet-days">{{ meetCountdown.daysLeft > 0 ? meetCountdown.daysLeft : '今天' }}</span>
        <span class="meet-label">距下次见面</span>
        <span class="meet-day">{{ meetCountdown.targetDay }}</span>
      </template>
      <template v-else>
        <span class="meet-label">还没约下次见面</span>
        <el-date-picker
          v-model="meetDay"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="哪天见面？"
          class="meet-picker"
          size="small"
          :disabled-date="(d: Date) => d.getTime() < Date.now() - 86400000"
          data-testid="couple-meet-day"
        />
        <el-button size="small" type="primary" round data-testid="couple-meet-add" @click="onAddMeet">开始倒数</el-button>
      </template>
    </div>

    <p class="city-tip">
      双方都填内置城市库里的城市（如「北京」「上海」「东京」「纽约」）就能看到时差与距离；填其他城市只展示文本。
    </p>

    <el-dialog v-model="editVisible" title="我所在的城市" width="360px" draggable data-testid="couple-city-dialog">
      <el-input
        v-model="cityInput"
        maxlength="20"
        placeholder="如：北京 / 上海 / 成都 / 东京 / 纽约…"
        data-testid="couple-city-input"
        @keyup.enter="onSave"
      />
      <template #footer>
        <el-button data-testid="couple-city-clear" @click="onClear">清空</el-button>
        <el-button type="primary" :loading="saving" data-testid="couple-city-save" @click="onSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useCoupleStore } from '@/stores/couple'

const couple = useCoupleStore()

const editVisible = ref(false)
const cityInput = ref('')
const saving = ref(false)

const hoursText = computed(() => {
  const diff = couple.cityCard?.hoursDiff
  if (diff === null || diff === undefined) return ''
  if (diff === 0) return '同时区'
  return diff > 0 ? `TA 比我快 ${diff} 小时` : `TA 比我慢 ${-diff} 小时`
})

// ---------- F39 对方当地时间（按城市库 IANA 时区实时显示） ----------
const now = ref(new Date())
let timer: ReturnType<typeof setInterval> | undefined

function clockIn(zoneId: string | null | undefined) {
  if (!zoneId) return ''
  try {
    const text = new Intl.DateTimeFormat('zh-CN', {
      timeZone: zoneId,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(now.value)
    return `🕐 ${text}`
  } catch {
    return ''
  }
}

const myClock = computed(() => clockIn(Intl.DateTimeFormat().resolvedOptions().timeZone))
const partnerClock = computed(() => clockIn(couple.cityCard?.partnerZoneId))

// ---------- F39 见面倒数：复用倒数日，标题固定为「下次见面」 ----------
const meetDay = ref('')
const meetCountdown = computed(() =>
  couple.countdowns.find((c) => !c.done && c.title.includes('见面')),
)

async function onAddMeet() {
  if (!meetDay.value) {
    ElMessage.warning('选一个见面日期')
    return
  }
  try {
    await couple.addCountdown('下次见面 🥺', meetDay.value, couple.cityCard?.partnerCity ?? undefined)
    meetDay.value = ''
    ElMessage.success('见面倒数开始！每一天都是期待 ⏳')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '添加失败')
  }
}

function openEdit() {
  cityInput.value = couple.cityCard?.myCity ?? ''
  editVisible.value = true
}

async function onSave() {
  const name = cityInput.value.trim()
  if (!name) {
    ElMessage.warning('填个城市名，或点「清空」')
    return
  }
  saving.value = true
  try {
    await couple.setCity(name)
    editVisible.value = false
    ElMessage.success('所在城市已更新 📍')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '保存失败')
  } finally {
    saving.value = false
  }
}

async function onClear() {
  saving.value = true
  try {
    await couple.setCity(null)
    editVisible.value = false
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '操作失败')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  void couple.loadCityCard()
  void couple.loadCountdowns()
  timer = setInterval(() => (now.value = new Date()), 30_000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.city-card {
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.city-clock {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
  min-height: 14px;
}
.meet-box {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding: 10px 12px;
  border-radius: 10px;
  background: linear-gradient(90deg, #fff5f5, #fffdf5);
}
.meet-days {
  font-size: 22px;
  font-weight: 700;
  color: #f56c6c;
}
.meet-label {
  font-size: 13px;
  font-weight: 600;
}
.meet-day {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.meet-picker {
  width: 130px;
}
.block-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.section-title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
}
.city-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 10px;
}
@media (max-width: 640px) {
  .city-grid {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .city-cell {
    align-items: center;
  }
  .city-mid {
    flex-direction: row;
    justify-content: center;
  }
}
.city-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.city-owner {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.city-name {
  font-size: 18px;
  font-weight: 700;
  word-break: break-all;
}
.city-mid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 0 10px;
}
.mid-heart {
  font-size: 20px;
}
.mid-main {
  font-size: 15px;
  font-weight: 700;
  color: var(--el-color-primary, #409eff);
  white-space: nowrap;
}
.mid-sub {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.city-tip {
  margin: 0;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
</style>

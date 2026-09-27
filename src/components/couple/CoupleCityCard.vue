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
      </div>
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
import { computed, onMounted, ref } from 'vue'
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

<template>
  <el-dialog v-model="visible" title="我的统计" width="360px">
    <div v-loading="loading" class="stats-body" data-testid="stats-dialog">
      <template v-if="stats">
        <div class="stat-row">
          <span class="stat-label">好友数</span>
          <span class="stat-value" data-testid="stat-friends">{{ stats.friends }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">发出的消息</span>
          <span class="stat-value" data-testid="stat-sent">{{ stats.sent }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">收到的消息</span>
          <span class="stat-value" data-testid="stat-received">{{ stats.received }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">收藏的消息</span>
          <span class="stat-value" data-testid="stat-stars">{{ stats.stars }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">最活跃好友</span>
          <span class="stat-value" data-testid="stat-active">
            {{ stats.mostActivePeer ? `${stats.mostActivePeer}（${stats.mostActiveCount} 条）` : '暂无' }}
          </span>
        </div>
      </template>
      <p v-else-if="!loading" class="stats-empty">暂时拿不到统计数据</p>
    </div>
    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { statsApi } from '@/api/im'
import type { StatsVO } from '@/types'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const visible = ref(props.modelValue)
const loading = ref(false)
const stats = ref<StatsVO | null>(null)

watch(
  () => props.modelValue,
  (value) => {
    visible.value = value
    if (value) {
      void load()
    }
  },
)
watch(visible, (value) => emit('update:modelValue', value))

async function load() {
  loading.value = true
  try {
    stats.value = await statsApi.me()
  } catch {
    stats.value = null
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.stats-body {
  min-height: 160px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 6px;
  border-radius: 8px;
}
.stat-row:hover {
  background: var(--im-hover, #f2f3f5);
}
.stat-label {
  color: var(--im-text-2, #51565f);
  font-size: 13px;
}
.stat-value {
  font-weight: 600;
  font-size: 14px;
}
.stats-empty {
  text-align: center;
  color: var(--im-muted, #8f959e);
  font-size: 13px;
}
</style>

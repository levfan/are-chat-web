<template>
  <el-dialog
    v-model="visible"
    title="全局搜索消息"
    width="560px"
    draggable
    class="global-search-dialog"
    @opened="onOpened"
  >
    <div class="search-row">
      <el-input
        ref="inputRef"
        v-model="keyword"
        placeholder="搜索所有会话中的消息（回车搜索）"
        clearable
        data-testid="global-search-input"
        @keyup.enter="onSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-button type="primary" :loading="loading" data-testid="global-search-btn" @click="onSearch">
        搜索
      </el-button>
    </div>
    <p class="search-hint">跨会话搜索全部文本消息，最多展示最近 50 条；点击结果跳转对应会话。</p>

    <div v-if="hits.length > 0" class="hit-list" data-testid="global-search-results">
      <button
        v-for="hit in hits"
        :key="hit.id"
        type="button"
        class="hit"
        data-testid="global-search-hit"
        @click="onOpen(hit.peer)"
      >
        <span class="hit-peer">{{ hit.fromUser === selfName ? '我 → ' : '' }}{{ displayNameOf(hit.peer) }}</span>
        <span class="hit-content">{{ hit.content }}</span>
        <span class="hit-time">{{ formatTime(hit.created) }}</span>
      </button>
    </div>
    <p v-else-if="searched" class="hit-empty" data-testid="global-search-empty">没有找到匹配的消息</p>
  </el-dialog>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { messageApi } from '@/api/im'
import { useImStore } from '@/stores/im'
import type { GlobalSearchHit } from '@/types'

const props = defineProps<{ modelValue: boolean; selfName: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; open: [peer: string] }>()

const im = useImStore()
/** 会话名按备注解析（备注修改后搜索结果同步换名） */
function displayNameOf(username: string): string {
  return im.displayNameOf(username)
}

const visible = ref(props.modelValue)
const keyword = ref('')
const hits = ref<GlobalSearchHit[]>([])
const loading = ref(false)
const searched = ref(false)
const inputRef = ref<{ focus: () => void } | null>(null)

watch(
  () => props.modelValue,
  (value) => {
    visible.value = value
    if (value) {
      // 每次打开重置为待搜索状态
      keyword.value = ''
      hits.value = []
      searched.value = false
    }
  },
)
watch(visible, (value) => emit('update:modelValue', value))

function formatTime(ts: number) {
  const date = new Date(ts)
  const today = new Date()
  const sameDay = date.toDateString() === today.toDateString()
  return sameDay
    ? date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function onOpened() {
  void nextTick(() => inputRef.value?.focus())
}

async function onSearch() {
  const q = keyword.value.trim()
  if (!q) {
    ElMessage.warning('请输入搜索关键字')
    return
  }
  loading.value = true
  try {
    hits.value = await messageApi.searchGlobal(q)
    searched.value = true
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '搜索失败')
  } finally {
    loading.value = false
  }
}

function onOpen(peer: string) {
  visible.value = false
  emit('open', peer)
}
</script>

<style scoped>
.search-row {
  display: flex;
  gap: 8px;
}
.search-hint {
  margin: 8px 0 10px;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.hit-list {
  max-height: 380px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.hit {
  display: grid;
  grid-template-columns: 110px 1fr auto;
  gap: 8px;
  align-items: center;
  text-align: left;
  border: none;
  background: transparent;
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
}
.hit:hover {
  background: var(--im-hover, #f2f3f5);
}
.hit-peer {
  font-weight: 600;
  font-size: 13px;
  color: var(--im-text, #1f2329);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.hit-content {
  font-size: 13px;
  color: var(--im-text-2, #51565f);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.hit-time {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.hit-empty {
  text-align: center;
  color: var(--im-muted, #8f959e);
  font-size: 13px;
  padding: 18px 0;
}
</style>

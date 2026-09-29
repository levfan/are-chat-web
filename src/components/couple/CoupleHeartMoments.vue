<template>
  <div class="hearts" data-testid="couple-heart-moments">
    <div class="block-head">
      <h4 class="section-title">💗 心动时刻</h4>
      <el-button size="small" round data-testid="couple-heart-refresh" @click="reload">刷新</el-button>
    </div>
    <p class="tip">在聊天里给某句话点「心动」，它就会出现在这里——那些让你们心头一颤的瞬间。</p>
    <el-empty
      v-if="!list.length"
      description="还没有心动时刻，去聊天里给一句话标记 💗 吧"
      :image-size="64"
      data-testid="couple-heart-empty"
    />
    <div v-else class="heart-list">
      <div v-for="m in list" :key="m.id" class="heart-card" :data-testid="`couple-heart-${m.id}`">
        <span class="heart-emoji">💗</span>
        <div class="heart-body">
          <p class="heart-content" data-testid="couple-heart-content">{{ m.content }}</p>
          <span class="heart-meta">
            {{ m.fromUser === me ? '我' : 'TA' }} 说的 · {{ formatDay(m.heartAt ?? m.created) }} 标记
          </span>
        </div>
        <el-button link type="danger" size="small" data-testid="couple-heart-remove" @click="onRemove(m.id)">移除</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { messageApi } from '@/api/im'
import { useAuthStore } from '@/stores/auth'
import type { ImMessage } from '@/types'

const auth = useAuthStore()
const me = ref('')
const list = ref<ImMessage[]>([])

function formatDay(at: number) {
  const d = new Date(at)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getMonth() + 1}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

async function reload() {
  list.value = (await messageApi.heartMoments()) ?? []
}

async function onRemove(msgId: string) {
  try {
    await ElMessageBox.confirm('把这条心动时刻移除吗？', '移除心动时刻', {
      type: 'warning',
      confirmButtonText: '移除',
      cancelButtonText: '留下',
    })
    await messageApi.markHeart(msgId, false)
    await reload()
  } catch {
    // 用户取消
  }
}

onMounted(async () => {
  me.value = auth.username
  await reload()
})
</script>

<style scoped>
.hearts {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.block-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.section-title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
}
.tip {
  margin: 0;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.heart-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.heart-card {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  padding: 10px 14px;
  background: linear-gradient(90deg, #fff5f8, #fffdfd);
}
.heart-emoji {
  font-size: 18px;
  flex-shrink: 0;
}
.heart-body {
  flex: 1;
  min-width: 0;
}
.heart-content {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  word-break: break-all;
  white-space: pre-wrap;
}
.heart-meta {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
</style>

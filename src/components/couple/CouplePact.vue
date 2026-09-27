<template>
  <div class="pacts" data-testid="couple-pacts">
    <div class="toolbar">
      <span class="section-hint">把「我们要一直…」变成双方盖章的甜蜜公约</span>
      <el-button type="primary" size="small" data-testid="couple-pact-add" @click="openCreate">
        <el-icon class="btn-ico"><Plus /></el-icon>提一条条约
      </el-button>
    </div>

    <el-input
      v-if="creating"
      v-model="content"
      maxlength="100"
      :placeholder="`如「吵架不过夜」「每周一次约会日」…`"
      class="create-input"
      data-testid="couple-pact-input"
      @keyup.enter="onCreate"
    >
      <template #append>
        <el-button :loading="saving" data-testid="couple-pact-save" @click="onCreate">提出</el-button>
      </template>
    </el-input>

    <el-empty
      v-if="!couple.pacts.length"
      description="还没有恋爱条约，立下你们的第一条公约吧 🤝"
      :image-size="70"
      data-testid="couple-pacts-empty"
    />
    <div v-else class="pact-list">
      <div
        v-for="pact in couple.pacts"
        :key="pact.id"
        class="pact-card"
        :class="{ accepted: !pact.pending }"
        :data-testid="`couple-pact-${pact.id}`"
      >
        <span class="pact-icon">{{ pact.pending ? '🖋️' : '📜' }}</span>
        <div class="pact-main">
          <span class="pact-content" data-testid="couple-pact-content">{{ pact.content }}</span>
          <span class="pact-meta">
            {{ pact.mine ? '我提出' : 'TA 提出' }} · {{ formatChatTime(pact.created) }}
            <template v-if="pact.pending">
              · <b class="pending-tag">{{ pact.mine ? '等 TA 盖章' : '等我盖章' }}</b>
            </template>
            <template v-else-if="pact.acceptedAt">
              · {{ pact.acceptedBy === auth.username ? '我' : 'TA' }}已盖章 {{ formatChatTime(pact.acceptedAt) }}
            </template>
          </span>
        </div>
        <div class="pact-actions">
          <el-button
            v-if="pact.pending && !pact.mine"
            type="primary"
            size="small"
            round
            data-testid="couple-pact-accept"
            @click="onAccept(pact)"
          >
            盖章生效 💕
          </el-button>
          <el-button link size="small" type="danger" @click="onDelete(pact)">移除</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { useCoupleStore } from '@/stores/couple'
import { formatChatTime } from '@/utils/imFormat'
import type { CouplePactVO } from '@/types'

const auth = useAuthStore()
const couple = useCoupleStore()

const creating = ref(false)
const content = ref('')
const saving = ref(false)

function openCreate() {
  creating.value = !creating.value
}

async function onCreate() {
  const text = content.value.trim()
  if (!text) {
    ElMessage.warning('先写下条约内容')
    return
  }
  saving.value = true
  try {
    await couple.createPact(text)
    content.value = ''
    ElMessage.success('条约已提出，等 TA 盖章生效 🖋️')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '提交失败')
  } finally {
    saving.value = false
  }
}

async function onAccept(pact: CouplePactVO) {
  try {
    await couple.acceptPact(pact.id)
    ElMessage.success('盖章成功，从今天起一起遵守 💕')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '操作失败')
  }
}

async function onDelete(pact: CouplePactVO) {
  try {
    await couple.deletePact(pact.id)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '操作失败')
  }
}

onMounted(() => {
  void couple.loadPacts()
})
</script>

<style scoped>
.pacts {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.section-hint {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.create-input {
  margin-bottom: 2px;
}
.pact-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.pact-card {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  padding: 10px 12px;
}
.pact-card.accepted {
  background: var(--el-color-success-light-9, #f0f9eb);
  border-color: var(--el-color-success-light-7, #e1f3d8);
}
.pact-icon {
  flex-shrink: 0;
  font-size: 18px;
}
.pact-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.pact-content {
  font-size: 14px;
  font-weight: 600;
  word-break: break-all;
}
.pact-meta {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.pending-tag {
  color: var(--el-color-warning, #e6a23c);
}
.pact-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}
.btn-ico {
  margin-right: 2px;
}
</style>

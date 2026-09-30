<template>
  <div class="read-watch" data-testid="couple-read-watch">
    <!-- F74 共读计划 -->
    <div class="card" data-testid="couple-read">
      <h4 class="title">📚 共读计划 <span class="sub">同一本书，各自翻页，一起到结局</span></h4>
      <div class="create-box">
        <el-input v-model="readTitle" maxlength="100" placeholder="书名/课名" data-testid="couple-read-title" />
        <el-input-number v-model="readTotal" :min="1" :max="100000" controls-position="right" data-testid="couple-read-total" />
        <el-select v-model="readLabel" style="width: 90px" data-testid="couple-read-label">
          <el-option label="章" value="章" />
          <el-option label="集" value="集" />
          <el-option label="课" value="课" />
        </el-select>
        <el-button type="primary" data-testid="couple-read-create" @click="onCreateRead">开一起读 📖</el-button>
      </div>
      <el-empty v-if="!couple.readPlans.length" description="找一本书一起读吧——进度条各自爬，方向一致" :image-size="56" />
      <div v-else class="plan-list">
        <div v-for="p in couple.readPlans" :key="p.id" class="plan-item" :data-testid="`couple-read-${p.id}`">
          <div class="plan-head">
            <span class="plan-title">{{ p.title }}</span>
            <el-tag :type="p.status === 'FINISHED' ? 'success' : 'warning'" size="small">
              {{ p.status === 'FINISHED' ? '已读完 🎉' : '共读中' }}
            </el-tag>
          </div>
          <div class="unit-row">
            <span class="unit-side">我：第 {{ p.myUnit ?? 0 }} {{ p.unitLabel }}</span>
            <el-progress
              class="unit-bar"
              :percentage="Math.round(((p.myUnit ?? 0) / p.totalUnits) * 100)"
              :stroke-width="8"
              :show-text="false"
            />
          </div>
          <div class="unit-row">
            <span class="unit-side">TA：第 {{ p.partnerUnit ?? 0 }} {{ p.unitLabel }}</span>
            <el-progress
              class="unit-bar"
              :percentage="Math.round(((p.partnerUnit ?? 0) / p.totalUnits) * 100)"
              :stroke-width="8"
              :show-text="false"
              status="success"
            />
          </div>
          <p v-if="p.partnerNote" class="note-line">TA 的感想：{{ p.partnerNote }}</p>
          <div v-if="p.status === 'READING'" class="report-row">
            <el-input-number v-model="reportUnits[p.id]" :min="0" :max="p.totalUnits" size="small" controls-position="right" :data-testid="`couple-read-unit-${p.id}`" />
            <el-button size="small" round :data-testid="`couple-read-report-${p.id}`" @click="onReportRead(p.id)">
              上报进度
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- F76 追剧清单 -->
    <div class="card" data-testid="couple-watch">
      <h4 class="title">📺 追剧清单 <span class="sub">遥控器一人一天</span></h4>
      <div class="create-box">
        <el-input v-model="watchTitle" maxlength="100" placeholder="剧名/片名" data-testid="couple-watch-title" />
        <el-input-number v-model="watchTotal" :min="1" :max="10000" placeholder="总集数" controls-position="right" data-testid="couple-watch-total" />
        <el-button type="primary" data-testid="couple-watch-add" @click="onAddWatch">加一部 🍿</el-button>
      </div>
      <el-empty v-if="!couple.watchlist.length" description="清单还是空的——把想一起追的都堆进来" :image-size="56" />
      <div v-else class="watch-list">
        <div v-for="w in couple.watchlist" :key="w.id" class="watch-item" :data-testid="`couple-watch-${w.id}`">
          <div class="watch-main">
            <span class="watch-title">{{ w.title }}</span>
            <span class="watch-progress" data-testid="couple-watch-progress">
              第 {{ w.currentUnit }}{{ w.totalUnit ? ` / ${w.totalUnit}` : '' }} 集
            </span>
            <el-tag :type="w.status === 'DONE' ? 'success' : 'warning'" size="small">
              {{ w.status === 'DONE' ? '追完 🎬' : '追剧中' }}
            </el-tag>
          </div>
          <p v-if="w.updatedBy" class="watch-meta">最后更新：{{ w.updatedByMine ? '我' : w.updatedBy }}</p>
          <div v-if="w.status === 'WATCHING'" class="watch-actions">
            <el-button size="small" round :data-testid="`couple-watch-next-${w.id}`" @click="onWatchNext(w.id, w.currentUnit)">
              看完一集 ✚
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useCoupleStore } from '@/stores/couple'

const couple = useCoupleStore()

const readTitle = ref('')
const readTotal = ref(10)
const readLabel = ref('章')
const reportUnits = reactive<Record<string, number>>({})
const watchTitle = ref('')
const watchTotal = ref<number | undefined>(undefined)

async function onCreateRead() {
  const title = readTitle.value.trim()
  if (!title) {
    ElMessage.warning('先写书名')
    return
  }
  try {
    await couple.createReadPlan(title, readTotal.value, readLabel.value)
    readTitle.value = ''
    ElMessage.success('共读计划已开始 📖')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '创建失败')
  }
}

async function onReportRead(id: string) {
  const unit = reportUnits[id]
  if (unit === undefined) {
    ElMessage.warning('先选读到第几章')
    return
  }
  try {
    await couple.reportReadProgress(id, unit)
    ElMessage.success('进度已上报 📖')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '上报失败')
  }
}

async function onAddWatch() {
  const title = watchTitle.value.trim()
  if (!title) {
    ElMessage.warning('先写剧名')
    return
  }
  try {
    await couple.addWatch(title, watchTotal.value)
    watchTitle.value = ''
    watchTotal.value = undefined
    ElMessage.success('已加入追剧清单 🍿')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '添加失败')
  }
}

async function onWatchNext(id: string, currentUnit: number) {
  try {
    await couple.updateWatch(id, currentUnit + 1)
    ElMessage.success('进度 +1 📺')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '更新失败')
  }
}

onMounted(() => {
  void couple.loadGrowth()
})
</script>

<style scoped>
.read-watch {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.card {
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 12px;
  padding: 14px;
}
.title {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 700;
}
.sub {
  margin-left: 6px;
  font-size: 12px;
  font-weight: 400;
  color: var(--im-muted, #8f959e);
}
.create-box {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
.plan-list,
.watch-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.plan-item,
.watch-item {
  border: 1px dashed var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  padding: 10px 12px;
}
.plan-head,
.watch-main {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}
.plan-title,
.watch-title {
  font-size: 13px;
  font-weight: 700;
  flex: 1;
  min-width: 0;
  word-break: break-all;
}
.watch-progress {
  font-size: 12px;
  color: var(--el-color-primary, #409eff);
  flex-shrink: 0;
}
.unit-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.unit-side {
  font-size: 12px;
  width: 96px;
  flex-shrink: 0;
}
.unit-bar {
  flex: 1;
}
.note-line {
  margin: 4px 0;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.report-row,
.watch-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  align-items: center;
}
.watch-meta {
  margin: 0 0 6px;
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
</style>

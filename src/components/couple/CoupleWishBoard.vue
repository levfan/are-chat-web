<template>
  <div class="wish-board" data-testid="couple-wish-board">
    <!-- F73 心愿互换 -->
    <div class="card" data-testid="couple-wishes">
      <h4 class="title">🌠 心愿互换 <span class="sub">我的小心愿交给 TA 实现</span></h4>
      <div class="form-row">
        <el-input
          v-model="wishDraft"
          maxlength="200"
          show-word-limit
          placeholder="许一个想让 TA 帮你实现的心愿…"
          data-testid="couple-wish-input"
          @keyup.enter="onMakeWish"
        />
        <el-button type="primary" data-testid="couple-wish-make" @click="onMakeWish">许愿 🌠</el-button>
      </div>
      <el-empty v-if="!couple.wishes.length" description="还没有心愿——说出来，让 TA 来接单" :image-size="56" />
      <div v-else class="item-list">
        <div v-for="w in couple.wishes" :key="w.id" class="wish-item" :data-testid="`couple-wish-${w.id}`">
          <div class="item-main">
            <span class="from">{{ w.fromUser === auth.username ? '我的心愿' : 'TA 的心愿' }}</span>
            <p class="content">{{ w.wish }}</p>
            <p v-if="w.doneNote" class="note">实现感言：「{{ w.doneNote }}」</p>
          </div>
          <el-tag v-if="w.status === 'DONE'" type="success" size="small">已实现 ✨</el-tag>
          <el-tag v-else-if="w.status === 'ACCEPTED'" type="warning" size="small">已接单 🙌</el-tag>
          <template v-else>
            <el-button
              v-if="w.fromUser !== auth.username"
              type="warning"
              size="small"
              round
              :data-testid="`couple-wish-accept-${w.id}`"
              @click="onAcceptWish(w.id)"
            >
              接单
            </el-button>
            <span v-else class="wait">等 TA 接单</span>
          </template>
          <el-button
            v-if="w.status === 'ACCEPTED' && w.fromUser !== auth.username"
            type="success"
            size="small"
            round
            :data-testid="`couple-wish-fulfill-${w.id}`"
            @click="onFulfillWish(w.id)"
          >
            实现啦
          </el-button>
        </div>
      </div>
    </div>

    <!-- F75 旅行心愿地图 -->
    <div class="card" data-testid="couple-travels">
      <h4 class="title">🗺️ 旅行心愿地图 <span class="sub">把「想去」一个个走成「去过」</span></h4>
      <div class="form-row">
        <el-input v-model="travelPlace" maxlength="100" placeholder="目的地" data-testid="couple-travel-place" />
        <el-input v-model="travelTodo" maxlength="200" placeholder="到了想做的事（可选）" data-testid="couple-travel-todo" />
        <el-button type="primary" data-testid="couple-travel-add" @click="onAddTravel">钉上地图 📌</el-button>
      </div>
      <el-empty v-if="!couple.travels.length" description="地图还是白的——第一个钉子想钉在哪？" :image-size="56" />
      <div v-else class="item-list">
        <div
          v-for="t in couple.travels"
          :key="t.id"
          class="travel-item"
          :class="{ visited: t.visited }"
          :data-testid="`couple-travel-${t.id}`"
        >
          <div class="item-main">
            <span class="place" data-testid="couple-travel-place-name">📍 {{ t.place }}</span>
            <p v-if="t.wantTodo" class="content">想去做：{{ t.wantTodo }}</p>
            <p v-if="t.visitedNote" class="note">打卡感想：「{{ t.visitedNote }}」</p>
          </div>
          <el-tag v-if="t.visited" type="success" size="small">去过啦 🧳</el-tag>
          <el-button v-else type="success" size="small" round :data-testid="`couple-travel-visit-${t.id}`" @click="onVisitTravel(t.id)">
            去过啦
          </el-button>
        </div>
      </div>
    </div>

    <!-- F79 下次一定清单 -->
    <div class="card" data-testid="couple-next-times">
      <h4 class="title">📝 下次一定清单 <span class="sub">随口的承诺，落单可催办</span></h4>
      <div class="form-row">
        <el-input
          v-model="nextTimeDraft"
          maxlength="200"
          show-word-limit
          placeholder="「下次一定」的内容…（记谁的选右边）"
          data-testid="couple-nexttime-input"
        />
        <el-select v-model="nextTimeOwner" style="width: 120px" data-testid="couple-nexttime-owner">
          <el-option label="记我的" value="mine" />
          <el-option label="记 TA 的" value="partner" />
        </el-select>
        <el-button type="warning" data-testid="couple-nexttime-add" @click="onAddNextTime">记下来 📝</el-button>
      </div>
      <el-empty v-if="!couple.nextTimes.length" description="还没有欠账——希望永远用不上，但需要时它就在" :image-size="56" />
      <div v-else class="item-list">
        <div v-for="n in couple.nextTimes" :key="n.id" class="nexttime-item" :data-testid="`couple-nexttime-${n.id}`">
          <div class="item-main">
            <span class="from">{{ n.fromUser === auth.username ? '我的承诺' : 'TA 的承诺' }}</span>
            <p class="content">{{ n.content }}</p>
          </div>
          <el-tag v-if="n.status === 'DONE'" type="success" size="small">已兑现 ✅</el-tag>
          <template v-else>
            <el-button
              v-if="n.fromUser !== auth.username"
              size="small"
              round
              type="danger"
              plain
              :data-testid="`couple-nexttime-nudge-${n.id}`"
              @click="onNudge(n.id)"
            >
              催一催 ⏰
            </el-button>
            <el-button
              v-else
              type="success"
              size="small"
              round
              :data-testid="`couple-nexttime-fulfill-${n.id}`"
              @click="onFulfillNextTime(n.id)"
            >
              兑现
            </el-button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useCoupleStore } from '@/stores/couple'

const auth = useAuthStore()
const couple = useCoupleStore()

const wishDraft = ref('')
const travelPlace = ref('')
const travelTodo = ref('')
const nextTimeDraft = ref('')
const nextTimeOwner = ref<'mine' | 'partner'>('mine')

async function onMakeWish() {
  const text = wishDraft.value.trim()
  if (!text) {
    ElMessage.warning('心愿写好再许')
    return
  }
  try {
    await couple.makeWish(text)
    wishDraft.value = ''
    ElMessage.success('心愿已许 🌠')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '许愿失败')
  }
}

async function onAcceptWish(id: string) {
  try {
    await couple.acceptWish(id)
    ElMessage.success('已接单 🙌')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '接单失败')
  }
}

async function onFulfillWish(id: string) {
  try {
    await couple.fulfillWish(id)
    ElMessage.success('心愿实现 ✨')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '操作失败')
  }
}

async function onAddTravel() {
  const place = travelPlace.value.trim()
  if (!place) {
    ElMessage.warning('目的地写一下')
    return
  }
  try {
    await couple.addTravel(place, travelTodo.value.trim() || undefined)
    travelPlace.value = ''
    travelTodo.value = ''
    ElMessage.success('已钉上地图 📌')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '添加失败')
  }
}

async function onVisitTravel(id: string) {
  try {
    await couple.visitTravel(id)
    ElMessage.success('打卡成功 🧳')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '打卡失败')
  }
}

async function onAddNextTime() {
  const text = nextTimeDraft.value.trim()
  if (!text) {
    ElMessage.warning('「下次一定」也要写清楚')
    return
  }
  try {
    const byUser = nextTimeOwner.value === 'partner' ? couple.space?.partner.username : undefined
    await couple.addNextTime(text, byUser)
    nextTimeDraft.value = ''
    ElMessage.success('已记下 📝')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '记录失败')
  }
}

async function onNudge(id: string) {
  try {
    await couple.nudgeNextTime(id)
    ElMessage.success('已催办 ⏰')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '催办失败')
  }
}

async function onFulfillNextTime(id: string) {
  try {
    await couple.fulfillNextTime(id)
    ElMessage.success('说到做到 ✅')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '兑现失败')
  }
}

onMounted(() => {
  void couple.loadGrowth()
})
</script>

<style scoped>
.wish-board {
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
.form-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
.item-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.wish-item,
.travel-item,
.nexttime-item {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  padding: 10px 12px;
}
.travel-item.visited {
  opacity: 0.75;
  background: var(--el-fill-color-lighter, #fafafa);
}
.item-main {
  flex: 1;
  min-width: 0;
}
.from {
  font-size: 11px;
  font-weight: 700;
  color: var(--el-color-primary, #409eff);
}
.place {
  font-size: 13px;
  font-weight: 700;
}
.content {
  margin: 2px 0;
  font-size: 13px;
  word-break: break-all;
}
.note {
  margin: 2px 0 0;
  font-size: 11px;
  color: var(--el-color-success, #67c23a);
}
.wait {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
  flex-shrink: 0;
}
</style>

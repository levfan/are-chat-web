<template>
  <div class="couple-dining" data-testid="couple-dining">
    <!-- F210/F211/F219 今晚饭桌 -->
    <div class="card" data-testid="couple-dine-today">
      <h4 class="title">🎫 今晚饭桌 <span class="sub">一人一票，撞上了就是缘分</span></h4>
      <template v-if="today">
        <div class="ticket-cols">
          <div class="ticket-col" data-testid="couple-dine-ticket-mine">
            <p class="ticket-head">🙋 我的饭票</p>
            <template v-if="today.mine">
              <p class="ticket-dish">{{ today.mine.dish }}</p>
              <p v-if="today.mine.reason" class="ticket-reason">理由：{{ today.mine.reason }}</p>
            </template>
            <p v-else class="empty-line">还没投，今晚吃什么由你定 🎫</p>
          </div>
          <div class="ticket-col" data-testid="couple-dine-ticket-partner">
            <p class="ticket-head">💕 TA 的饭票</p>
            <template v-if="today.partner">
              <p class="ticket-dish">{{ today.partner.dish }}</p>
              <p v-if="today.partner.reason" class="ticket-reason">理由：{{ today.partner.reason }}</p>
            </template>
            <p v-else class="empty-line">TA 还没投，催一催～</p>
          </div>
        </div>
        <p v-if="today.hit" class="hit-badge" data-testid="couple-dine-ticket-hit">🎯 撞菜了！今晚就它：{{ today.mine?.dish }}</p>
        <p v-if="today.verdict" class="verdict-line" data-testid="couple-dine-ticket-verdict">⚖️ 吃什么裁决：{{ today.verdict }}</p>
      </template>
      <p v-else class="empty-line">饭桌还没摆好…</p>
      <div class="inline-form">
        <el-input v-model="ticketDishDraft" maxlength="50" placeholder="今晚想吃什么？（菜名）" data-testid="couple-dine-ticket-dish" />
        <el-input v-model="ticketReasonDraft" maxlength="100" placeholder="理由（可空，比如「下雨天想吃热的」）" data-testid="couple-dine-ticket-reason" />
        <el-button size="small" type="primary" data-testid="couple-dine-ticket-submit" @click="onCastTicket">投饭票 🎫</el-button>
      </div>

      <div class="topic-block" data-testid="couple-dine-topic">
        <p class="topic-line">
          💬 今日话题：<b>{{ today?.topic || '话题还在路上…' }}</b>
          <el-button
            v-if="today"
            size="small"
            :type="today.topicMarked ? 'success' : 'primary'"
            :plain="!today.topicMarked"
            :disabled="today.topicMarked"
            data-testid="couple-dine-topic-mark"
            @click="onMarkTopic"
          >{{ today.topicMarked ? '已打卡 ✅' : '聊过了，打卡 💬' }}</el-button>
        </p>
      </div>

      <div class="drink-block" data-testid="couple-dine-drink">
        <p class="drink-head">🥤 点单机 <span class="sub">今天的心情，领一杯</span></p>
        <div class="drink-btns">
          <el-button
            v-for="m in DRINK_MOODS"
            :key="m"
            size="small"
            :type="drink?.mood === m ? 'primary' : 'default'"
            :plain="drink?.mood !== m"
            :data-testid="`couple-dine-drink-btn-${m}`"
            @click="onPickMood(m)"
          >{{ m }}</el-button>
        </div>
        <p v-if="drink" class="drink-result" data-testid="couple-dine-drink-result">
          {{ drink.emoji }} <b>{{ drink.name }}</b> <span class="flash-by">{{ drink.note }}</span>
        </p>
        <p v-else class="empty-line">选个心情，今日一杯替你安排 🥤</p>
      </div>
    </div>

    <!-- F212/F213/F214 本周饭桌 -->
    <div class="card" data-testid="couple-dine-week">
      <h4 class="title">🗓️ 本周饭桌 <span class="sub">把一周的菜排开，日子就有了盼头</span></h4>
      <template v-if="board">
        <div class="plan-grid" data-testid="couple-dine-plan-grid">
          <div
            v-for="(d, i) in weekDays"
            :key="d"
            class="plan-cell"
            :class="{ 'is-active': planDay === d, 'has-dish': !!planDishOf(d) }"
            :data-testid="`couple-dine-plan-cell-${d}`"
            @click="onPickPlanDay(d)"
          >
            <p class="plan-day">{{ WEEK_LABELS[i] }}</p>
            <p class="plan-day-sub">{{ d.slice(5) }}</p>
            <p class="plan-dish">{{ planDishOf(d) || '＋ 填菜' }}</p>
            <p v-if="planUpdatedBy(d)" class="flash-by">{{ planUpdatedBy(d) }}</p>
          </div>
        </div>
        <div v-if="planDay" class="inline-form" data-testid="couple-dine-plan-form">
          <span class="star-label">{{ planDay.slice(5) }}（{{ WEEK_LABELS[weekDays.indexOf(planDay)] }}）：</span>
          <el-input v-model="planDishDraft" maxlength="50" placeholder="这天吃什么？" data-testid="couple-dine-plan-dish" />
          <el-button size="small" type="primary" data-testid="couple-dine-plan-save" @click="onSavePlan">排上 🗓️</el-button>
          <el-button size="small" type="warning" plain data-testid="couple-dine-plan-clear" @click="onClearPlan">擦掉</el-button>
        </div>
        <p v-else class="empty-line">点一格，把那天安排上 🗓️</p>

        <div class="homecook-block" data-testid="couple-dine-homecook">
          <p class="section-head">👨‍🍳 本周拿手菜</p>
          <p v-if="!board.homecooks.length" class="empty-line">这周还没人亮手艺，来一道？👨‍🍳</p>
          <p v-for="h in board.homecooks" :key="h.fromUser" class="flash-line" :data-testid="`couple-dine-homecook-${h.fromUser}`">
            <b>{{ h.mine ? '我 👑' : h.fromUser }}</b>：{{ h.dish }}
            <span class="stars">{{ '★'.repeat(h.score) }}{{ '☆'.repeat(5 - h.score) }}</span>
          </p>
          <div class="inline-form">
            <el-input v-model="homecookDishDraft" maxlength="50" placeholder="我的拿手菜（比如：番茄炒蛋）" data-testid="couple-dine-homecook-dish" />
            <el-rate v-model="homecookScoreDraft" :max="5" data-testid="couple-dine-homecook-score" />
            <el-button size="small" type="primary" data-testid="couple-dine-homecook-save" @click="onSaveHomecook">端上桌 👨‍🍳</el-button>
          </div>
        </div>

        <div class="cart-block" data-testid="couple-dine-cart">
          <p class="section-head">🛒 搭伙车 <span class="sub">想一起买的东西，双方各按一次锁才上车</span></p>
          <div class="inline-form">
            <el-input v-model="cartItemDraft" maxlength="50" placeholder="要搭伙买什么？（鸡蛋、火锅底料…）" data-testid="couple-dine-cart-item" />
            <el-input-number v-model="cartQtyDraft" :min="1" :max="20" size="small" data-testid="couple-dine-cart-qty" />
            <el-button size="small" type="primary" data-testid="couple-dine-cart-add" @click="onCartAdd">加菜 🛒</el-button>
          </div>
          <p v-if="!board.cart.length" class="empty-line">车还空着，加点搭伙的吧 🛒</p>
          <p v-for="c in board.cart" :key="c.id" class="flash-line" :data-testid="`couple-dine-cart-${c.id}`">
            <b>{{ c.item }}</b> ×{{ c.qty }}
            <span class="flash-by">{{ c.mine ? '我加的' : `${c.fromUser} 加的` }}</span>
            <span v-if="c.status === 'LOCKED'" data-testid="couple-dine-cart-locked-icon">🔒 已上车</span>
            <span v-else-if="c.locked.length" class="flash-by" :data-testid="`couple-dine-cart-lockstate-${c.id}`">{{ c.locked.join('、') }} 已按锁</span>
            <el-button v-if="c.canLock" size="small" type="primary" plain :data-testid="`couple-dine-cart-lock-${c.id}`" @click="onCartLock(c)">按锁 🔒</el-button>
            <el-button v-if="c.mine && c.status === 'OPEN'" size="small" type="warning" plain :data-testid="`couple-dine-cart-del-${c.id}`" @click="onCartRemove(c)">撤掉</el-button>
          </p>
        </div>
      </template>
      <p v-else class="empty-line">本周饭桌还没摆好…</p>
    </div>

    <!-- F215/F216 我们的餐厅 -->
    <div class="card" data-testid="couple-dine-restaurant">
      <h4 class="title">📋 我们的餐厅 <span class="sub">吃过的都记一笔，踩过的雷一起躲</span></h4>
      <div class="inline-form">
        <el-date-picker
          v-model="rateDayDraft"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="吃的日子"
          style="width: 140px"
          data-testid="couple-dine-rate-day"
        />
        <el-input v-model="rateDishDraft" maxlength="50" placeholder="菜名（店名也算）" data-testid="couple-dine-rate-dish" />
        <span class="star-label">打星：</span>
        <el-rate v-model="rateStarsDraft" :max="5" data-testid="couple-dine-rate-stars" />
        <el-input v-model="rateCommentDraft" maxlength="200" placeholder="一句点评（可空）" data-testid="couple-dine-rate-comment" />
        <el-button size="small" type="primary" data-testid="couple-dine-rate-submit" @click="onAddRate">记一笔 ⭐</el-button>
      </div>
      <p v-if="!rates.length" class="empty-line">还没有星评流水，从今晚这顿开始 ⭐</p>
      <p v-for="r in rates" :key="r.id" class="flash-line" :data-testid="`couple-dine-rate-${r.id}`">
        <span class="flash-by">{{ r.day.slice(5) }} · {{ r.mine ? '我评的' : r.fromUser }}</span>
        <b>{{ r.dish }}</b>
        <span class="stars">{{ '★'.repeat(r.stars) }}{{ '☆'.repeat(5 - r.stars) }}</span>
        <span v-if="r.comment" class="rate-comment">「{{ r.comment }}」</span>
      </p>

      <div class="nogo-block" data-testid="couple-dine-nogo">
        <p class="section-head">💣 踩雷库 <span class="sub">难吃一次，永远拉黑</span></p>
        <div class="inline-form">
          <el-input v-model="nogoNameDraft" maxlength="50" placeholder="雷的名字（菜或店）" data-testid="couple-dine-nogo-name" />
          <el-input v-model="nogoReasonDraft" maxlength="100" placeholder="为什么雷（可空）" data-testid="couple-dine-nogo-reason" />
          <el-button size="small" type="primary" data-testid="couple-dine-nogo-add" @click="onAddNogo">拉黑 💣</el-button>
        </div>
        <p v-if="!nogos.length" class="empty-line">还没有雷，希望永远用不上 💣</p>
        <p v-for="n in nogos" :key="n.id" class="flash-line" :data-testid="`couple-dine-nogo-${n.id}`">
          <b>💣 {{ n.name }}</b>
          <span class="flash-by">{{ n.mine ? '我拉的' : `${n.fromUser} 拉的` }}<template v-if="n.reason"> · {{ n.reason }}</template></span>
          <el-button v-if="n.mine" size="small" type="warning" plain :data-testid="`couple-dine-nogo-del-${n.id}`" @click="onRemoveNogo(n)">解除拉黑</el-button>
        </p>
      </div>
    </div>

    <!-- F217 年度干饭账 -->
    <div class="card" data-testid="couple-dine-year">
      <h4 class="title">🧾 年度干饭账 <span class="sub">一年吃了多少，账本说得清</span></h4>
      <div class="inline-form">
        <span class="star-label">查哪年：</span>
        <el-select v-model="yearDraft" size="small" style="width: 110px" data-testid="couple-dine-year-select" @change="onLoadYear">
          <el-option v-for="y in yearOptions" :key="y" :label="`${y} 年`" :value="y" />
        </el-select>
      </div>
      <template v-if="year">
        <div class="year-stats" data-testid="couple-dine-year-stats">
          <p class="stat-line" data-testid="couple-dine-year-ratecount">⭐ 记了 <b>{{ year.rateCount }}</b> 笔星评</p>
          <p class="stat-line" data-testid="couple-dine-year-avgstars">🌟 平均 <b>{{ year.avgStars }}</b> 星</p>
          <p class="stat-line" data-testid="couple-dine-year-ticketcount">🎫 投了 <b>{{ year.ticketCount }}</b> 张饭票</p>
          <p class="stat-line" data-testid="couple-dine-year-plannedcount">🗓️ 排了 <b>{{ year.plannedCount }}</b> 天菜单</p>
          <p class="stat-line" data-testid="couple-dine-year-nogocount">💣 踩雷 <b>{{ year.nogoCount }}</b> 个</p>
        </div>
        <p class="section-head">🏆 {{ year.year }} 最常点</p>
        <p v-if="!year.topDishes.length" class="empty-line">还没有上榜菜，多记几笔星评 🏆</p>
        <p v-for="(t, i) in year.topDishes" :key="t.dish" class="flash-line" :data-testid="`couple-dine-year-top-${t.dish}`">
          <b>{{ i + 1 }}. {{ t.dish }}</b>
          <span class="flash-by">点了 {{ t.times }} 次 · 平均 {{ t.avgStars }} 星</span>
        </p>
      </template>
      <p v-else class="empty-line">账本还在装订…</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { diningApi } from '@/api/couple'
import type {
  CoupleDineBoardVO,
  CoupleDineCartVO,
  CoupleDineDrinkVO,
  CoupleDineNogoVO,
  CoupleDineRateVO,
  CoupleDineTodayVO,
  CoupleDineYearVO,
} from '@/types'

const today = ref<CoupleDineTodayVO | null>(null)
const board = ref<CoupleDineBoardVO | null>(null)
const rates = ref<CoupleDineRateVO[]>([])
const nogos = ref<CoupleDineNogoVO[]>([])
const year = ref<CoupleDineYearVO | null>(null)
const drink = ref<CoupleDineDrinkVO | null>(null)

const DRINK_MOODS = ['开心', '有点累', 'emo了', '想庆祝', '平平淡淡']
const WEEK_LABELS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

// ---- 草稿 ----
const ticketDishDraft = ref('')
const ticketReasonDraft = ref('')
const planDay = ref('')
const planDishDraft = ref('')
const homecookDishDraft = ref('')
const homecookScoreDraft = ref(0)
const cartItemDraft = ref('')
const cartQtyDraft = ref(1)
const rateDayDraft = ref(todayStr())
const rateDishDraft = ref('')
const rateStarsDraft = ref(0)
const rateCommentDraft = ref('')
const nogoNameDraft = ref('')
const nogoReasonDraft = ref('')
const yearDraft = ref(String(new Date().getFullYear()))
const yearOptions = Array.from({ length: 5 }, (_, i) => String(new Date().getFullYear() - i))

function todayStr() {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${dd}`
}

function onError(e: unknown, fallback: string) {
  ElMessage.error(e instanceof Error ? e.message : fallback)
}

// ---- 本周七天（以 board.week 周一为起点） ----
const weekDays = computed<string[]>(() => {
  const base = board.value?.week
  if (!base) return []
  return WEEK_LABELS.map((_, i) => {
    const d = new Date(`${base}T00:00:00`)
    d.setDate(d.getDate() + i)
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${d.getFullYear()}-${m}-${dd}`
  })
})

function planDishOf(day: string) {
  return board.value?.plans.find((p) => p.day === day)?.dish ?? ''
}
function planUpdatedBy(day: string) {
  const p = board.value?.plans.find((x) => x.day === day)
  if (!p?.dish) return ''
  return p.mineLastEdit ? '我排的' : `TA 排的（${p.updatedBy}）`
}

// ---- F210 今日饭桌 ----
watch(today, (t) => {
  if (t?.mine && !ticketDishDraft.value) {
    ticketDishDraft.value = t.mine.dish
    ticketReasonDraft.value = t.mine.reason
  }
})

async function onCastTicket() {
  if (!ticketDishDraft.value.trim()) {
    ElMessage.warning('先写想吃什么哦 🎫')
    return
  }
  try {
    today.value = (await diningApi.dineCastTicket(ticketDishDraft.value.trim(), ticketReasonDraft.value.trim())) ?? today.value
    ElMessage.success('饭票已投上，等 TA 撞菜 🎫')
  } catch (e) {
    onError(e, '投饭票失败')
  }
}

async function onMarkTopic() {
  try {
    today.value = (await diningApi.dineMarkTopic()) ?? today.value
    ElMessage.success('今日话题打卡 ✅')
  } catch (e) {
    onError(e, '打卡失败')
  }
}

// ---- F219 点单机 ----
async function onPickMood(mood: string) {
  try {
    drink.value = (await diningApi.dineDrink(mood)) ?? null
  } catch (e) {
    onError(e, '点单失败')
  }
}

// ---- F212 本周菜单 ----
function onPickPlanDay(day: string) {
  planDay.value = day
  planDishDraft.value = planDishOf(day)
}

async function onSavePlan() {
  if (!planDay.value) return
  try {
    board.value = (await diningApi.dineSavePlan(planDay.value, planDishDraft.value.trim())) ?? board.value
    ElMessage.success(planDishDraft.value.trim() ? '这天的菜排上了 🗓️' : '这格已清空')
  } catch (e) {
    onError(e, '排菜单失败')
  }
}

async function onClearPlan() {
  if (!planDay.value) return
  try {
    board.value = (await diningApi.dineSavePlan(planDay.value, '')) ?? board.value
    planDishDraft.value = ''
    ElMessage.success('这格擦掉啦 🧽')
  } catch (e) {
    onError(e, '擦除失败')
  }
}

// ---- F213 拿手菜 ----
async function onSaveHomecook() {
  if (!homecookDishDraft.value.trim()) {
    ElMessage.warning('先写拿手菜名字哦 👨‍🍳')
    return
  }
  try {
    board.value =
      (await diningApi.dineSaveHomecook(homecookDishDraft.value.trim(), homecookScoreDraft.value || 1)) ?? board.value
    homecookDishDraft.value = ''
    ElMessage.success('拿手菜已端上桌 👨‍🍳')
  } catch (e) {
    onError(e, '上菜失败')
  }
}

// ---- F214 搭伙车 ----
async function onCartAdd() {
  if (!cartItemDraft.value.trim()) {
    ElMessage.warning('先写要搭伙买什么 🛒')
    return
  }
  try {
    board.value = (await diningApi.dineCartAdd(cartItemDraft.value.trim(), cartQtyDraft.value ?? 1)) ?? board.value
    cartItemDraft.value = ''
    cartQtyDraft.value = 1
    ElMessage.success('已加进搭伙车 🛒')
  } catch (e) {
    onError(e, '加菜失败')
  }
}

async function onCartLock(c: CoupleDineCartVO) {
  try {
    board.value = (await diningApi.dineCartLock(c.id)) ?? board.value
    ElMessage.success('锁了一下！等 TA 也按锁就上车 🔒')
  } catch (e) {
    onError(e, '按锁失败')
  }
}

async function onCartRemove(c: CoupleDineCartVO) {
  try {
    board.value = (await diningApi.dineCartRemove(c.id)) ?? board.value
    ElMessage.success('已从搭伙车撤掉 🛒')
  } catch (e) {
    onError(e, '撤掉失败')
  }
}

// ---- F215 星评 ----
async function onAddRate() {
  if (!rateDayDraft.value || !rateDishDraft.value.trim()) {
    ElMessage.warning('日子和菜名都要填哦 ⭐')
    return
  }
  if (!rateStarsDraft.value) {
    ElMessage.warning('先打个星哦 ⭐')
    return
  }
  try {
    rates.value =
      (await diningApi.dineRate({
        day: rateDayDraft.value,
        dish: rateDishDraft.value.trim(),
        stars: rateStarsDraft.value,
        comment: rateCommentDraft.value.trim(),
      })) ?? []
    rateDishDraft.value = ''
    rateStarsDraft.value = 0
    rateCommentDraft.value = ''
    ElMessage.success('这顿已记账 ⭐')
  } catch (e) {
    onError(e, '记星评失败')
  }
}

// ---- F216 踩雷库 ----
async function onAddNogo() {
  if (!nogoNameDraft.value.trim()) {
    ElMessage.warning('先写雷的名字 💣')
    return
  }
  try {
    nogos.value = (await diningApi.dineAddNogo(nogoNameDraft.value.trim(), nogoReasonDraft.value.trim())) ?? []
    nogoNameDraft.value = ''
    nogoReasonDraft.value = ''
    ElMessage.success('已永久拉黑 💣')
  } catch (e) {
    onError(e, '拉黑失败')
  }
}

async function onRemoveNogo(n: CoupleDineNogoVO) {
  try {
    nogos.value = (await diningApi.dineRemoveNogo(n.id)) ?? []
    ElMessage.success('给这道菜一次改过自新的机会 🌱')
  } catch (e) {
    onError(e, '解除失败')
  }
}

// ---- F217 年度账 ----
async function onLoadYear() {
  try {
    year.value = (await diningApi.dineYear(yearDraft.value)) ?? year.value
  } catch (e) {
    onError(e, '查账失败')
  }
}

// ---- 初始加载：全部 safeLoad 静默降级 ----
async function safeLoad<T>(loader: () => Promise<T>, fallback: T): Promise<T> {
  try {
    const data = await loader()
    return data ?? fallback
  } catch {
    // 未建立空间等场景：静默显示空态
    return fallback
  }
}

onMounted(async () => {
  const [t, b, r, n, y] = await Promise.all([
    safeLoad(diningApi.dineToday, null),
    safeLoad(diningApi.dineBoard, null),
    safeLoad(diningApi.dineRates, []),
    safeLoad(diningApi.dineNogos, []),
    safeLoad(() => diningApi.dineYear(yearDraft.value), null),
  ])
  today.value = t
  board.value = b
  rates.value = r
  nogos.value = n
  year.value = y
})
</script>

<style scoped>
.couple-dining { display: flex; flex-direction: column; gap: 14px; }
.card { background: var(--im-panel-bg, #fff); border-radius: 10px; padding: 14px 16px; border: 1px solid var(--im-border, #ebeef5); }
.title { margin: 0 0 10px; font-size: 15px; color: var(--im-text, #303133); }
.sub { font-size: 12px; color: var(--im-muted, #909399); font-weight: normal; margin-left: 6px; }
.section-head { margin: 12px 0 4px; font-size: 13px; font-weight: bold; color: var(--im-text, #303133); }
.inline-form { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 8px; }
.inline-form .el-input { flex: 1; min-width: 160px; }
.flash-line { margin: 4px 0; font-size: 13px; color: var(--im-text, #303133); }
.flash-by { font-size: 11px; color: var(--im-muted, #909399); margin-right: 6px; }
.empty-line { margin: 8px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.stars { color: #e6a23c; letter-spacing: 2px; }
.star-label { font-size: 13px; color: var(--im-muted, #909399); }
.ticket-cols { display: flex; gap: 14px; flex-wrap: wrap; margin-top: 6px; }
.ticket-col { flex: 1; min-width: 200px; padding: 8px 10px; background: var(--im-bg, #fafafa); border-radius: 8px; }
.ticket-head { margin: 0 0 4px; font-size: 13px; font-weight: bold; color: var(--im-text, #303133); }
.ticket-dish { margin: 2px 0; font-size: 14px; color: #f56c6c; font-weight: bold; }
.ticket-reason { margin: 2px 0; font-size: 12px; color: var(--im-muted, #909399); }
.hit-badge { margin: 8px 0 0; font-size: 13px; color: #f56c6c; font-weight: bold; }
.verdict-line { margin: 6px 0 0; font-size: 13px; color: var(--im-text, #303133); }
.topic-block { margin-top: 10px; padding-top: 8px; border-top: 1px dashed var(--im-border, #ebeef5); }
.topic-line { margin: 4px 0; font-size: 13px; color: var(--im-text, #303133); }
.drink-block { margin-top: 10px; padding-top: 8px; border-top: 1px dashed var(--im-border, #ebeef5); }
.drink-head { margin: 0; font-size: 13px; font-weight: bold; color: var(--im-text, #303133); }
.drink-btns { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 6px; }
.drink-result { margin: 8px 0 0; font-size: 14px; color: #f56c6c; }
.plan-grid { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
.plan-cell { flex: 1; min-width: 90px; max-width: 140px; border: 1px dashed var(--im-border, #ebeef5); border-radius: 8px; padding: 6px 8px; cursor: pointer; text-align: center; }
.plan-cell.is-active { border-color: #f56c6c; background: rgba(245, 108, 108, 0.06); }
.plan-cell.has-dish .plan-dish { color: #f56c6c; font-weight: bold; }
.plan-day { margin: 0; font-size: 12px; font-weight: bold; color: var(--im-text, #303133); }
.plan-day-sub { margin: 0; font-size: 11px; color: var(--im-muted, #909399); }
.plan-dish { margin: 4px 0 0; font-size: 12px; color: var(--im-text, #303133); word-break: break-all; }
.homecook-block, .cart-block, .nogo-block { margin-top: 12px; padding-top: 8px; border-top: 1px dashed var(--im-border, #ebeef5); }
.rate-comment { font-size: 12px; color: var(--im-muted, #909399); }
.year-stats { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 6px; }
.stat-line { margin: 2px 0; font-size: 13px; color: var(--im-text, #303133); }
.stat-line b { color: #f56c6c; }
</style>

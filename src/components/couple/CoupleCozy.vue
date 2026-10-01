<template>
  <div class="couple-cozy" data-testid="couple-cozy">
    <!-- F220-F228 今日体温总览：十项小动作一屏照顾我们的作息 -->
    <CoupleCollapsible testid="couple-cozy-today">
      <template #title>🌡️ 今日体温同步 <span class="sub">「你睡了吗/冷不冷/喝水没」，都在这张小小的检查表里</span></template>

      <template v-if="today">
        <!-- F220 晚安同熄灯 -->
        <div class="sec" data-testid="couple-cozy-lightout">
          <p class="section-head">🌙 晚安同熄灯 <span class="sub">一人点亮一盏，今晚一起关灯</span></p>
          <div class="lamp-row">
            <span class="lamp" :class="{ 'is-lit': today.lightout.mine }" data-testid="couple-cozy-lightout-mine">
              {{ today.lightout.mine ? '💡 我熄灯了' : '🌑 我还没点' }}
            </span>
            <span class="lamp" :class="{ 'is-lit': today.lightout.partner }" data-testid="couple-cozy-lightout-partner">
              {{ today.lightout.partner ? '💡 TA 熄灯了' : '🌑 TA 还没点' }}
            </span>
            <span class="streak-line" data-testid="couple-cozy-lightout-streak">🔥 已连续 {{ today.lightout.streak }} 晚一起熄灯</span>
          </div>
          <el-button
            size="small"
            type="primary"
            :disabled="today.lightout.mine"
            data-testid="couple-cozy-lightout-btn"
            @click="onLightout"
          >{{ today.lightout.mine ? '今晚的灯已点好 ✅' : '道晚安，点灯 🌙' }}</el-button>
        </div>

        <!-- F221 昨夜睡眠报告单 -->
        <div class="sec" data-testid="couple-cozy-sleep">
          <p class="section-head">🛏️ 昨夜睡眠单 <span class="sub">早晨醒来报一报，TA 睡得香不香一眼知道</span></p>
          <p v-if="!today.sleeps.length" class="empty-line">今早还没人交睡眠单，先报一个？🛏️</p>
          <p v-for="s in today.sleeps" :key="s.fromUser" class="flash-line" :data-testid="`couple-cozy-sleep-${s.fromUser}`">
            <b>{{ s.mine ? '我 🙋' : s.fromUser }}</b>
            <span class="stars">{{ '★'.repeat(s.stars) }}{{ '☆'.repeat(5 - s.stars) }}</span>
            <span v-if="s.dream" class="dream-line">梦话：「{{ s.dream }}」</span>
          </p>
          <div class="inline-form">
            <el-date-picker
              v-model="sleepDayDraft"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="那一晚"
              style="width: 140px"
              data-testid="couple-cozy-sleep-day"
            />
            <span class="field-label">睡龄：</span>
            <el-rate v-model="sleepStarsDraft" :max="5" data-testid="couple-cozy-sleep-stars" />
            <el-input v-model="sleepDreamDraft" maxlength="70" placeholder="一句梦话（可空，比如「梦见一起逛夜市」）" data-testid="couple-cozy-sleep-dream" />
            <el-button size="small" type="primary" data-testid="couple-cozy-sleep-submit" @click="onReportSleep">交睡眠单 🛏️</el-button>
          </div>
        </div>

        <!-- F222 一起数羊 -->
        <div class="sec" data-testid="couple-cozy-sheep">
          <p class="section-head">🐑 一起数羊 <span class="sub">一分钟数满十只就成群，看谁先数睡着</span></p>
          <div class="sheep-row">
            <p class="flash-line" data-testid="couple-cozy-sheep-mine">
              🙋 我的羊群：<b>{{ today.sheep.mineTaps }}</b> / {{ SHEEP_TARGET }}
              <span v-if="today.sheep.mineDone" class="done-badge" data-testid="couple-cozy-sheep-mine-done">成群啦 🎉（用时 {{ secondsOf(today.sheep.mineElapsedMs) }}s）</span>
            </p>
            <p class="flash-line" data-testid="couple-cozy-sheep-partner">
              💕 TA 的羊群：<b>{{ today.sheep.partnerTaps }}</b> / {{ SHEEP_TARGET }}
              <span v-if="today.sheep.partnerDone" class="done-badge" data-testid="couple-cozy-sheep-partner-done">成群啦 🎉（用时 {{ secondsOf(today.sheep.partnerElapsedMs) }}s）</span>
            </p>
          </div>
          <el-button size="small" type="primary" :disabled="today.sheep.mineDone" data-testid="couple-cozy-sheep-btn" @click="onSheepTap">
            {{ today.sheep.mineDone ? '今晚这群羊数完啦 ✅' : '点一只羊 🐑' }}
          </el-button>
        </div>

        <!-- F223 喝水接力 -->
        <div class="sec" data-testid="couple-cozy-water">
          <p class="section-head">💧 喝水接力 <span class="sub">我干一杯，你的杯子就亮一格</span></p>
          <div class="cup-row">
            <span class="cup-line" data-testid="couple-cozy-water-mine">🙋 我喝了 <b>{{ today.water.mine }}</b> 杯</span>
            <span class="cup-line" data-testid="couple-cozy-water-partner">💕 TA 喝了 <b>{{ today.water.partner }}</b> 杯</span>
          </div>
          <p v-if="today.water.nudge" class="nudge-line" data-testid="couple-cozy-water-nudge">🥺 TA 的杯子都攒好几格了，你的还空着——起来喝一口嘛～</p>
          <el-button size="small" type="primary" data-testid="couple-cozy-water-btn" @click="onWater">干一杯 💧</el-button>
        </div>

        <!-- F224 冷暖互报 -->
        <div class="sec" data-testid="couple-cozy-weather">
          <p class="section-head">🌡️ 冷暖互报 <span class="sub">你在的城市几度，我这里就惦记几分</span></p>
          <p v-if="!today.weathers.length" class="empty-line">今天还没人报冷暖，先写一条？🌆</p>
          <p v-for="w in today.weathers" :key="w.fromUser" class="flash-line" :data-testid="`couple-cozy-weather-${w.fromUser}`">
            <b>{{ w.mine ? '我 🙋' : w.fromUser }}</b>：{{ w.city }} · {{ w.feel }}
            <span v-if="w.tempText" class="flash-by">{{ w.tempText }}</span>
            <template v-if="!w.mine">
              <span v-if="w.advised" class="done-badge" data-testid="couple-cozy-weather-advised-done">已叮嘱添衣 🧣</span>
              <el-button v-else size="small" type="primary" plain data-testid="couple-cozy-weather-advise" @click="onAdvise">叮嘱 TA 添衣 🧣</el-button>
            </template>
          </p>
          <div class="inline-form">
            <el-input v-model="weatherCityDraft" maxlength="30" placeholder="你在哪个城市？" style="max-width: 160px" data-testid="couple-cozy-weather-city" />
            <el-button
              v-for="f in WEATHER_FEELS"
              :key="f"
              size="small"
              :type="weatherFeelDraft === f ? 'primary' : 'default'"
              :plain="weatherFeelDraft !== f"
              :data-testid="`couple-cozy-weather-feel-${f}`"
              @click="weatherFeelDraft = f"
            >{{ f }}</el-button>
            <el-input v-model="weatherTempDraft" maxlength="10" placeholder="气温（如 12°C，可空）" style="max-width: 150px" data-testid="couple-cozy-weather-temp" />
            <el-button size="small" type="primary" data-testid="couple-cozy-weather-submit" @click="onWeather">报今日冷暖 🌡️</el-button>
          </div>
        </div>

        <!-- F225 熬夜守护 -->
        <div class="sec" data-testid="couple-cozy-latenight">
          <p class="section-head">🌌 熬夜守护 <span class="sub">深夜刷到 TA 还亮着，递一张「早点睡」</span></p>
          <p v-if="today.latenight.card" class="card-quote" data-testid="couple-cozy-latenight-card">「{{ today.latenight.card }}」</p>
          <el-button
            size="small"
            type="primary"
            :disabled="today.latenight.sentToday"
            data-testid="couple-cozy-latenight-btn"
            @click="onLatenight"
          >{{ today.latenight.sentToday ? '今天的陪伴卡已递出 ✅' : '递一张「早点睡」🌙' }}</el-button>
        </div>

        <!-- F226 周末慢生活 -->
        <div class="sec" data-testid="couple-cozy-slow">
          <p class="section-head">🐢 本周慢生活 <span class="sub">约一件什么都不赶的小事，周日见分晓</span></p>
          <p v-if="!today.slows.length" class="empty-line">这周还没人提小事，来一件？🐢</p>
          <p v-for="s in today.slows" :key="s.fromUser" class="flash-line" :data-testid="`couple-cozy-slow-${s.fromUser}`">
            <b>{{ s.mine ? '我 🙋' : s.fromUser }}</b>：{{ s.thing }}
            <span v-if="s.doneDay" class="done-badge" data-testid="couple-cozy-slow-done">已打卡 ✅（{{ s.doneDay.slice(5) }}）</span>
            <span v-else class="flash-by">还没打卡</span>
          </p>
          <div class="inline-form">
            <el-input v-model="slowThingDraft" maxlength="70" placeholder="这周想一起做什么不赶的事？（如：周日下午晒着太阳发呆）" data-testid="couple-cozy-slow-thing" />
            <el-button size="small" type="primary" data-testid="couple-cozy-slow-submit" @click="onSlow">提上 🐢</el-button>
            <el-button size="small" type="success" plain data-testid="couple-cozy-slow-check" @click="onSlowCheck">我的打卡 ✅</el-button>
          </div>
        </div>

        <!-- F227 疼痛对策本 -->
        <div class="sec" data-testid="couple-cozy-remedy">
          <p class="section-head">🤕 疼痛对策本 <span class="sub">写下你难受时的正确做法，TA 照着照顾你</span></p>
          <p v-if="!today.remedies.length" class="empty-line">对策本还是空的，先写一本？🤕</p>
          <div v-for="r in today.remedies" :key="r.forUser" class="flash-line" :data-testid="`couple-cozy-remedy-${r.forUser}`">
            <b>{{ r.mine ? '我的本子 🙋' : `TA 的本子 💕` }}</b>
            <p class="remedy-body">{{ r.body }}</p>
          </div>
          <div class="inline-form">
            <el-input v-model="remedyDraft" type="textarea" :rows="2" maxlength="300" placeholder="比如：胃疼→热水袋+小米粥，别说话让我躺会儿" data-testid="couple-cozy-remedy-body" />
            <el-button size="small" type="primary" data-testid="couple-cozy-remedy-save" @click="onRemedy">写好对策 📖</el-button>
            <el-button
              size="small"
              type="warning"
              plain
              :disabled="!partnerRemedy"
              data-testid="couple-cozy-comfort-btn"
              @click="onComfort"
            >按 TA 的对策执行 🤲</el-button>
          </div>
        </div>

        <!-- F228 抱抱计量器 -->
        <div class="sec" data-testid="couple-cozy-hug">
          <p class="section-head">🫂 隔空抱抱计量器 <span class="sub">见面抱了几次？记一笔，攒我们的抱抱罐</span></p>
          <div class="hug-row">
            <span class="hug-line" data-testid="couple-cozy-hug-total">累计 <b>{{ today.hug.total }}</b> 次</span>
            <span class="hug-line" data-testid="couple-cozy-hug-today">今天 <b>{{ today.hug.today }}</b> 次</span>
            <span v-if="today.hug.milestone" class="milestone-badge" data-testid="couple-cozy-hug-milestone">🏆 已破 {{ today.hug.milestone }} 次成就点亮</span>
          </div>
          <div class="inline-form">
            <el-input-number v-model="hugCntDraft" :min="1" :max="99" size="small" data-testid="couple-cozy-hug-cnt" />
            <el-input v-model="hugNoteDraft" maxlength="70" placeholder="一句备注（可空，比如「在车站抱了足足一分钟」）" data-testid="couple-cozy-hug-note" />
            <el-button size="small" type="primary" data-testid="couple-cozy-hug-btn" @click="onHug">记一次抱抱 🫂</el-button>
          </div>
        </div>
      </template>
      <p v-else class="empty-line">体温计还没夹好…</p>
    </CoupleCollapsible>

    <!-- F229 月度安眠小结 -->
    <CoupleCollapsible testid="couple-cozy-monthly" :empty="!!monthly && monthly.index === 0">
      <template #title>🌛 月度安眠小结 <span class="sub">这个月我们把日子过得安稳吗，指数说了算</span></template>
      <div class="inline-form">
        <span class="field-label">看哪月：</span>
        <el-date-picker
          v-model="monthDraft"
          type="month"
          value-format="YYYY-MM"
          placeholder="选择月份"
          style="width: 140px"
          data-testid="couple-cozy-month-select"
          @change="onLoadMonth"
        />
      </div>
      <template v-if="monthly">
        <div class="month-stats" data-testid="couple-cozy-month-stats">
          <p class="stat-line" data-testid="couple-cozy-month-lit">🌙 一起熄灯 <b>{{ monthly.bothLitNights }}</b> 晚</p>
          <p class="stat-line" data-testid="couple-cozy-month-streak">🔥 最长连击 <b>{{ monthly.bestStreak }}</b> 晚</p>
          <p class="stat-line" data-testid="couple-cozy-month-sleep">🛏️ 交了 <b>{{ monthly.sleepReports }}</b> 份睡眠单</p>
          <p class="stat-line" data-testid="couple-cozy-month-avgstars">⭐ 平均睡龄 <b>{{ monthly.avgStars }}</b> 星</p>
          <p class="stat-line" data-testid="couple-cozy-month-sheep">🐑 数完全群 <b>{{ monthly.sheepDone }}</b> 次</p>
          <p class="stat-line" data-testid="couple-cozy-month-cups">💧 合计喝水 <b>{{ monthly.cupsTotal }}</b> 杯</p>
        </div>
        <p class="index-line">
          🌡️ {{ monthly.month }} 体温同步指数
          <span class="index-num" data-testid="couple-cozy-month-index">{{ monthly.index }}</span> / 100
        </p>
        <el-progress
          :percentage="monthly.index"
          :stroke-width="12"
          color="#e6a23c"
          :show-info="false"
          data-testid="couple-cozy-month-progress"
        />
        <p v-if="monthly.index >= 80" class="index-comment" data-testid="couple-cozy-month-comment">这个月我们把彼此的日子照顾得很好，晚安都没落下 🥰</p>
      </template>
      <p v-else class="empty-line">小结还在汇总…</p>
    </CoupleCollapsible>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { cozyApi } from '@/api/couple'
import type { CoupleCozyMonthlyVO, CoupleCozyTodayVO } from '@/types'
import CoupleCollapsible from './CoupleCollapsible.vue'

const today = ref<CoupleCozyTodayVO | null>(null)
const monthly = ref<CoupleCozyMonthlyVO | null>(null)

/** 与后端 SHEEP_TARGET 对齐：一分钟数满 10 只成群 */
const SHEEP_TARGET = 10
/** 体感三选（与后端校验口径一致，≤10 字） */
const WEATHER_FEELS = ['冷', '暖', '刚好']

// ---- 草稿 ----
const sleepDayDraft = ref(todayStr())
const sleepStarsDraft = ref(0)
const sleepDreamDraft = ref('')
const weatherCityDraft = ref('')
const weatherFeelDraft = ref('')
const weatherTempDraft = ref('')
const slowThingDraft = ref('')
const remedyDraft = ref('')
const hugCntDraft = ref(1)
const hugNoteDraft = ref('')
const monthDraft = ref(new Date().toISOString().slice(0, 7))

function todayStr() {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${dd}`
}

function secondsOf(ms: number | null) {
  return ms == null ? 0 : Math.round(ms / 1000)
}

function onError(e: unknown, fallback: string) {
  ElMessage.error(e instanceof Error ? e.message : fallback)
}

/** TA 的疼痛对策本（有一本才能一键执行） */
const partnerRemedy = computed(() => today.value?.remedies.find((r) => !r.mine) ?? null)

// ---- 我的对策本回填（首次拉到或更新后同步草稿） ----
watch(today, (t) => {
  const mine = t?.remedies.find((r) => r.mine)
  if (mine && !remedyDraft.value) remedyDraft.value = mine.body
  const mySlow = t?.slows.find((s) => s.mine)
  if (mySlow && !slowThingDraft.value) slowThingDraft.value = mySlow.thing
  const myWeather = t?.weathers.find((w) => w.mine)
  if (myWeather) {
    if (!weatherCityDraft.value) weatherCityDraft.value = myWeather.city
    if (!weatherFeelDraft.value) weatherFeelDraft.value = myWeather.feel
    if (!weatherTempDraft.value) weatherTempDraft.value = myWeather.tempText
  }
})

// ---- F220 晚安同熄灯 ----
async function onLightout() {
  try {
    today.value = (await cozyApi.cozyLightout()) ?? today.value
    ElMessage.success('晚安灯点亮 🌙 就等 TA 那盏了')
  } catch (e) {
    onError(e, '点灯失败')
  }
}

// ---- F221 睡眠报告单 ----
async function onReportSleep() {
  if (!sleepDayDraft.value) {
    ElMessage.warning('先选那一晚哦 🛏️')
    return
  }
  try {
    today.value =
      (await cozyApi.cozySleep(sleepDayDraft.value, sleepStarsDraft.value || 5, sleepDreamDraft.value.trim())) ?? today.value
    sleepDreamDraft.value = ''
    ElMessage.success('睡眠单交上啦，TA 能看到咯 🛏️')
  } catch (e) {
    onError(e, '交睡眠单失败')
  }
}

// ---- F222 数羊房 ----
async function onSheepTap() {
  try {
    today.value = (await cozyApi.cozySheep()) ?? today.value
  } catch (e) {
    onError(e, '数羊失败')
  }
}

// ---- F223 喝水接力 ----
async function onWater() {
  try {
    today.value = (await cozyApi.cozyWater()) ?? today.value
    ElMessage.success('咕咚一口 💧 TA 的杯子又亮一格')
  } catch (e) {
    onError(e, '干杯失败')
  }
}

// ---- F224 冷暖互报 ----
async function onWeather() {
  if (!weatherCityDraft.value.trim() || !weatherFeelDraft.value) {
    ElMessage.warning('城市和体感都要填哦 🌡️')
    return
  }
  try {
    today.value =
      (await cozyApi.cozyWeather(weatherCityDraft.value.trim(), weatherFeelDraft.value, weatherTempDraft.value.trim())) ??
      today.value
    ElMessage.success('今日冷暖已互报 🌡️')
  } catch (e) {
    onError(e, '互报失败')
  }
}

async function onAdvise() {
  try {
    today.value = (await cozyApi.cozyAdvise()) ?? today.value
    ElMessage.success('叮嘱送达，土味关怀已发货 🧣')
  } catch (e) {
    onError(e, '叮嘱失败')
  }
}

// ---- F225 熬夜守护 ----
async function onLatenight() {
  try {
    today.value = (await cozyApi.cozyLatenight()) ?? today.value
    ElMessage.success('「早点睡」已递到 TA 手机里 🌙')
  } catch (e) {
    onError(e, '递卡失败')
  }
}

// ---- F226 慢生活 ----
async function onSlow() {
  if (!slowThingDraft.value.trim()) {
    ElMessage.warning('先写一件不赶的小事 🐢')
    return
  }
  try {
    today.value = (await cozyApi.cozySlow(slowThingDraft.value.trim())) ?? today.value
    ElMessage.success('这周的慢生活安排上了 🐢')
  } catch (e) {
    onError(e, '提小事失败')
  }
}

async function onSlowCheck() {
  try {
    today.value = (await cozyApi.cozySlowCheck()) ?? today.value
    ElMessage.success('慢生活打卡 ✅ 明天也不许赶')
  } catch (e) {
    onError(e, '打卡失败')
  }
}

// ---- F227 疼痛对策本 ----
async function onRemedy() {
  if (!remedyDraft.value.trim()) {
    ElMessage.warning('先写下你的正确做法 🤕')
    return
  }
  try {
    today.value = (await cozyApi.cozyRemedy(remedyDraft.value.trim())) ?? today.value
    ElMessage.success('对策本已收好，交给 TA 保管 📖')
  } catch (e) {
    onError(e, '登记对策失败')
  }
}

async function onComfort() {
  try {
    today.value = (await cozyApi.cozyComfort()) ?? today.value
    ElMessage.success('按 TA 的对策执行，关怀已送达 🤲')
  } catch (e) {
    onError(e, '执行对策失败')
  }
}

// ---- F228 抱抱计量器 ----
async function onHug() {
  try {
    today.value = (await cozyApi.cozyHug(hugCntDraft.value ?? 1, hugNoteDraft.value.trim())) ?? today.value
    hugNoteDraft.value = ''
    ElMessage.success('隔空抱抱已存档 🫂')
  } catch (e) {
    onError(e, '记抱抱失败')
  }
}

// ---- F229 月度安眠小结 ----
async function onLoadMonth() {
  try {
    monthly.value = (await cozyApi.cozyMonthly(monthDraft.value || undefined)) ?? monthly.value
  } catch (e) {
    onError(e, '查小结失败')
  }
}

// ---- 初始加载：safeLoad 静默降级 ----
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
  const [t, m] = await Promise.all([
    safeLoad(cozyApi.cozyToday, null),
    safeLoad(() => cozyApi.cozyMonthly(monthDraft.value), null),
  ])
  today.value = t
  monthly.value = m
})
</script>

<style scoped>
.couple-cozy { display: flex; flex-direction: column; gap: 14px; --collapse-title-color: var(--im-text, #303133); }
.card { background: var(--im-panel-bg, #fff); border-radius: 10px; padding: 14px 16px; border: 1px solid var(--im-border, #ebeef5); }
.sub { font-size: 12px; color: var(--im-muted, #909399); font-weight: normal; margin-left: 6px; }
.section-head { margin: 0 0 4px; font-size: 13px; font-weight: bold; color: var(--im-text, #303133); }
.sec { margin-top: 12px; padding-top: 10px; border-top: 1px dashed var(--im-border, #ebeef5); }
.sec:first-of-type { margin-top: 0; padding-top: 0; border-top: none; }
.inline-form { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 8px; }
.inline-form .el-input { flex: 1; min-width: 160px; }
.flash-line { margin: 4px 0; font-size: 13px; color: var(--im-text, #303133); }
.flash-by { font-size: 11px; color: var(--im-muted, #909399); margin-right: 6px; }
.empty-line { margin: 8px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.stars { color: #e6a23c; letter-spacing: 2px; }
.field-label { font-size: 13px; color: var(--im-muted, #909399); }
.done-badge { font-size: 12px; color: #67c23a; margin-left: 6px; }
.lamp-row { display: flex; gap: 14px; flex-wrap: wrap; align-items: center; }
.lamp { font-size: 13px; color: var(--im-muted, #909399); padding: 2px 8px; border-radius: 6px; background: var(--im-bg, #fafafa); }
.lamp.is-lit { color: #e6a23c; background: rgba(230, 162, 60, 0.1); }
.streak-line { font-size: 13px; color: var(--im-text, #303133); }
.dream-line { font-size: 12px; color: var(--im-muted, #909399); margin-left: 6px; }
.sheep-row, .cup-row, .hug-row { display: flex; gap: 16px; flex-wrap: wrap; }
.cup-line, .hug-line { margin: 4px 0; font-size: 13px; color: var(--im-text, #303133); }
.cup-line b, .hug-line b { color: #e6a23c; }
.nudge-line { margin: 6px 0 0; font-size: 13px; color: #e6a23c; }
.card-quote { margin: 6px 0; font-size: 13px; color: var(--im-text, #303133); background: var(--im-bg, #fafafa); border-radius: 8px; padding: 8px 10px; }
.remedy-body { margin: 2px 0 6px; font-size: 12px; color: var(--im-muted, #909399); white-space: pre-wrap; }
.milestone-badge { font-size: 13px; color: #e6a23c; font-weight: bold; }
.month-stats { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 6px; }
.stat-line { margin: 2px 0; font-size: 13px; color: var(--im-text, #303133); }
.stat-line b { color: #e6a23c; }
.index-line { margin: 10px 0 6px; font-size: 13px; color: var(--im-text, #303133); }
.index-num { font-size: 18px; font-weight: bold; color: #e6a23c; }
.index-comment { margin: 8px 0 0; font-size: 13px; color: #67c23a; }
</style>

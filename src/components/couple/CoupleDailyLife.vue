<template>
  <div class="couple-daily" data-testid="couple-daily-life">
    <!-- F140 / F146 / F147 今日抽签区 -->
    <div class="card" data-testid="couple-daily-draw">
      <h4 class="title">🎵 今日主题曲 <span class="sub">每天为你们抽一首 BGM</span></h4>
      <template v-if="song">
        <p class="song-title" data-testid="couple-song-title">《{{ song.title }}》 · {{ song.artist }}</p>
        <p class="song-reason">{{ song.reason }}</p>
      </template>
      <el-divider />
      <div class="praise-grid">
        <div class="praise-block" data-testid="couple-praise">
          <p class="praise-label">💌 今日夸夸（点右侧复制，去私聊夸 TA）</p>
          <p v-for="(p, i) in praises" :key="i" class="praise-line" :data-testid="`couple-praise-line-${i}`" @click="copyPraise(p)">
            「{{ p }}」 📋
          </p>
        </div>
        <div class="code-block" data-testid="couple-codeword">
          <p class="praise-label">🔑 今日接头暗号 <span class="sub">对上才给抱抱</span></p>
          <p class="codeword" data-testid="couple-codeword-text">「{{ codeword }}」</p>
        </div>
      </div>
    </div>

    <!-- F144 情绪 SOS -->
    <div class="card" data-testid="couple-sos">
      <h4 class="title">🆘 情绪 SOS <span class="sub">成年人的崩溃需要快捷键</span></h4>
      <el-input
        v-model="sosMessage"
        maxlength="100"
        show-word-limit
        placeholder="想多说的一句（可空）"
        data-testid="couple-sos-input"
      />
      <el-button class="mt8" size="small" type="danger" data-testid="couple-sos-ping" @click="onPingSos">
        现在就要抱抱 🫂
      </el-button>
      <div v-if="sosList.length" class="sos-list">
        <div v-for="s in sosList" :key="s.id" class="sos-item" :data-testid="`couple-sos-${s.id}`">
          <span class="sos-from">{{ s.mine ? '我的求抱抱' : 'TA 的求抱抱' }}</span>
          <span v-if="s.message" class="sos-msg">{{ s.message }}</span>
          <el-tag v-if="s.status === 'HELD'" size="small" type="success">已抱住 🫂</el-tag>
          <el-button v-else-if="!s.mine" size="small" type="primary" :data-testid="`couple-sos-hold-${s.id}`" @click="onHoldSos(s.id)">
            抱住 TA 🫂
          </el-button>
          <el-tag v-else size="small" type="warning">等 TA 接住…</el-tag>
        </div>
      </div>
    </div>

    <!-- F145 每日三问 -->
    <div class="card" data-testid="couple-three">
      <h4 class="title">🌙 每日三问 <span class="sub">睡前三分钟，把今天过成纪念</span></h4>
      <div class="three-form">
        <el-input v-model="threeJoy" maxlength="200" placeholder="今天最开心的事" data-testid="couple-three-joy" />
        <el-input v-model="threeTouched" maxlength="200" placeholder="今天最被感动的瞬间" data-testid="couple-three-touched" />
        <el-input v-model="threeSay" maxlength="200" placeholder="最想对 TA 说的一句话" data-testid="couple-three-say" />
        <el-button size="small" type="primary" data-testid="couple-three-save" @click="onSaveThree">
          {{ three?.mine ? '改答案' : '写下来' }} 🌙
        </el-button>
      </div>
      <div v-if="three?.partner" class="three-partner" data-testid="couple-three-partner">
        <p class="three-title">TA 的今天：</p>
        <p v-if="three.partner.joy">开心：{{ three.partner.joy }}</p>
        <p v-if="three.partner.touched">感动：{{ three.partner.touched }}</p>
        <p v-if="three.partner.wantToSay">想说：「{{ three.partner.wantToSay }}」</p>
      </div>
    </div>

    <!-- F141 梦境手账 -->
    <div class="card" data-testid="couple-dream">
      <h4 class="title">🌙 梦境手账 <span class="sub">梦到 TA 的话，醒来第一时间记下来</span></h4>
      <el-input
        v-model="dreamDraft"
        maxlength="500"
        show-word-limit
        placeholder="昨晚我梦见……"
        data-testid="couple-dream-input"
        @keyup.enter="onWriteDream"
      />
      <el-button class="mt8" size="small" type="primary" data-testid="couple-dream-save" @click="onWriteDream">记下这场梦 🌙</el-button>
      <div v-if="dreamList.length" class="dream-list">
        <p v-for="d in dreamList" :key="d.id" class="dream-item" :data-testid="`couple-dream-${d.id}`">
          {{ d.mine ? '我梦到' : 'TA 梦到' }}：{{ d.content }}
        </p>
      </div>
    </div>

    <!-- F142 美食地图 -->
    <div class="card" data-testid="couple-food">
      <h4 class="title">🍜 美食地图 <span class="sub">把「改天一起吃」变成一张张票根</span></h4>
      <div class="food-form">
        <el-input v-model="foodShop" maxlength="60" placeholder="店名" data-testid="couple-food-shop" />
        <el-input v-model="foodDish" maxlength="60" placeholder="招牌菜" data-testid="couple-food-dish" />
        <el-button size="small" type="primary" data-testid="couple-food-add" @click="onAddFood">想吃 🍜</el-button>
      </div>
      <div v-if="foodList.length" class="food-list">
        <div v-for="f in foodList" :key="f.id" class="food-item" :data-testid="`couple-food-${f.id}`">
          <span class="food-shop">{{ f.shop }}</span>
          <span class="food-dish">{{ f.dish }}</span>
          <el-rate v-if="f.status === 'EATEN' && f.rating" :model-value="f.rating" disabled size="small" />
          <el-tag v-if="f.status === 'EATEN'" size="small" type="success">已打卡</el-tag>
          <template v-else>
            <el-input v-model="foodComments[f.id]" size="small" maxlength="200" placeholder="吃后感（可空）" class="food-comment" />
            <el-button size="small" type="success" plain :data-testid="`couple-food-checkin-${f.id}`" @click="onCheckinFood(f.id)">
              打卡 🍽️
            </el-button>
          </template>
          <span v-if="f.comment" class="food-comment-text">{{ f.comment }}</span>
        </div>
      </div>
    </div>

    <!-- F143 TA 使用手册 -->
    <div class="card" data-testid="couple-fact">
      <h4 class="title">📖 TA 使用手册 <span class="sub">口味 / 雷区 / 心头好 / 小怪癖，互相补全</span></h4>
      <div class="fact-form">
        <el-select v-model="factKind" data-testid="couple-fact-kind" style="width: 120px">
          <el-option label="😋 口味" value="TASTE" />
          <el-option label="⚠️ 雷区" value="NOGO" />
          <el-option label="💖 心头好" value="FAV" />
          <el-option label="🤪 小怪癖" value="QUIRK" />
        </el-select>
        <el-input v-model="factContent" maxlength="200" placeholder="写一页关于 TA 的说明书" data-testid="couple-fact-input" />
        <el-button size="small" type="primary" data-testid="couple-fact-add" @click="onAddFact">记下来 📖</el-button>
      </div>
      <div v-if="factList.length" class="fact-list">
        <p v-for="f in factList" :key="f.id" class="fact-item" :data-testid="`couple-fact-${f.id}`">
          <el-tag size="small" :type="factTagType(f.kind)">{{ factLabel(f.kind) }}</el-tag>
          {{ f.content }}<span class="fact-by">（{{ f.mine ? '我写' : 'TA 写' }}）</span>
        </p>
      </div>
    </div>

    <!-- F148 自定义成就 -->
    <div class="card" data-testid="couple-custom-badge">
      <h4 class="title">🏅 自定义成就 <span class="sub">我们自己定义什么值得庆祝</span></h4>
      <div class="fact-form">
        <el-input v-model="badgeTitle" maxlength="50" placeholder="成就名（连吃七天早餐）" data-testid="couple-badge-title" />
        <el-input v-model="badgeCondition" maxlength="200" placeholder="达成条件（可空）" data-testid="couple-badge-condition" />
        <el-button size="small" type="primary" data-testid="couple-badge-add" @click="onAddBadge">立成就 🏅</el-button>
      </div>
      <div v-if="badgeList.length" class="fact-list">
        <div v-for="b in badgeList" :key="b.id" class="badge-item" :data-testid="`couple-badge-${b.id}`">
          <span class="badge-title">{{ b.status === 'ISSUED' ? '🎖️' : '🏅' }} {{ b.title }}</span>
          <span v-if="b.condition" class="badge-cond">{{ b.condition }}</span>
          <el-tag v-if="b.status === 'ISSUED'" size="small" type="success" data-testid="couple-badge-issued">已颁发</el-tag>
          <el-button v-else size="small" type="warning" plain :data-testid="`couple-badge-issue-${b.id}`" @click="onIssueBadge(b.id)">
            达成，颁证 🎖️
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useCoupleStore } from '@/stores/couple'

const couple = useCoupleStore()

const song = computed(() => couple.themeSong)
const praises = computed(() => couple.dailyPraise?.praises ?? [])
const codeword = computed(() => couple.dailyPraise?.codeword ?? '')
const sosList = computed(() => couple.soses)
const three = computed(() => couple.three)
const dreamList = computed(() => couple.dreams)
const foodList = computed(() => couple.foods)
const factList = computed(() => couple.facts)
const badgeList = computed(() => couple.customBadges)

// SOS
const sosMessage = ref('')
// 每日三问
const threeJoy = ref('')
const threeTouched = ref('')
const threeSay = ref('')
// 梦境
const dreamDraft = ref('')
// 美食
const foodShop = ref('')
const foodDish = ref('')
const foodComments = ref<Record<string, string>>({})
// 手册
const factKind = ref('TASTE')
const factContent = ref('')
// 成就
const badgeTitle = ref('')
const badgeCondition = ref('')

function factLabel(kind: string): string {
  switch (kind) {
    case 'TASTE': return '😋 口味'
    case 'NOGO': return '⚠️ 雷区'
    case 'FAV': return '💖 心头好'
    default: return '🤪 小怪癖'
  }
}
function factTagType(kind: string): 'success' | 'danger' | 'warning' | 'primary' {
  switch (kind) {
    case 'NOGO': return 'danger'
    case 'FAV': return 'success'
    case 'QUIRK': return 'warning'
    default: return 'primary'
  }
}

async function copyPraise(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('已复制，去私聊夸 TA 💌')
  } catch {
    ElMessage.info('复制失败，手动选中复制吧')
  }
}

async function onPingSos() {
  try {
    await couple.pingSos(sosMessage.value.trim() || undefined)
    sosMessage.value = ''
    ElMessage.success('求抱抱已发出，等 TA 赶来 🫂')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '发送失败')
  }
}

async function onHoldSos(id: string) {
  try {
    await couple.holdSos(id)
    ElMessage.success('抱住了，TA 现在是全世界最安全的人 🫂')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '操作失败')
  }
}

async function onSaveThree() {
  try {
    await couple.saveDailyThree(threeJoy.value.trim() || undefined, threeTouched.value.trim() || undefined, threeSay.value.trim() || undefined)
    threeJoy.value = ''
    threeTouched.value = ''
    threeSay.value = ''
    ElMessage.success('今日三问已写下 🌙')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '保存失败')
  }
}

async function onWriteDream() {
  if (!dreamDraft.value.trim()) {
    ElMessage.warning('梦先讲一句我才能接住 🌙')
    return
  }
  try {
    await couple.writeDream(dreamDraft.value)
    dreamDraft.value = ''
    ElMessage.success('这场梦已入账 🌙')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '保存失败')
  }
}

async function onAddFood() {
  if (!foodShop.value.trim() || !foodDish.value.trim()) {
    ElMessage.warning('店名和招牌菜都要写哦')
    return
  }
  try {
    await couple.addFood(foodShop.value, foodDish.value)
    foodShop.value = ''
    foodDish.value = ''
    ElMessage.success('已加入想吃清单 🍜')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '添加失败')
  }
}

async function onCheckinFood(id: string) {
  try {
    await couple.checkinFood(id, 5, foodComments.value[id]?.trim() || undefined)
    foodComments.value[id] = ''
    ElMessage.success('打卡成功，美食地图 +1 🍽️')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '打卡失败')
  }
}

async function onAddFact() {
  if (!factContent.value.trim()) {
    ElMessage.warning('TA 手册先写一条 📓')
    return
  }
  try {
    await couple.addFact(factKind.value, factContent.value)
    factContent.value = ''
    ElMessage.success('说明书又厚了一页 📖')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '添加失败')
  }
}

async function onAddBadge() {
  if (!badgeTitle.value.trim()) {
    ElMessage.warning('成就名先写一句 🏅')
    return
  }
  try {
    await couple.addBadge(badgeTitle.value, badgeCondition.value.trim() || undefined)
    badgeTitle.value = ''
    badgeCondition.value = ''
    ElMessage.success('成就已立，一起冲 🏅')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '添加失败')
  }
}

async function onIssueBadge(id: string) {
  try {
    await couple.issueBadge(id)
    ElMessage.success('双人证书已颁发 🎖️')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '颁发失败')
  }
}

onMounted(async () => {
  try {
    await couple.loadDailyLife()
  } catch {
    // 未建立空间等场景：静默
  }
})
</script>

<style scoped>
.couple-daily { display: flex; flex-direction: column; gap: 14px; }
.card { background: var(--im-panel-bg, #fff); border-radius: 10px; padding: 14px 16px; border: 1px solid var(--im-border, #ebeef5); }
.title { margin: 0 0 10px; font-size: 15px; color: var(--im-text, #303133); }
.sub { font-size: 12px; color: var(--im-muted, #909399); font-weight: normal; margin-left: 6px; }
.mt8 { margin-top: 8px; }
.song-title { margin: 0 0 4px; font-size: 17px; color: #f56c6c; font-weight: bold; }
.song-reason { margin: 0; font-size: 13px; color: var(--im-text, #303133); }
.praise-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 12px; }
.praise-block, .code-block { background: var(--im-bg, #fafafa); border-radius: 8px; padding: 10px 12px; }
.praise-label { margin: 0 0 6px; font-size: 12px; color: var(--im-muted, #909399); }
.praise-line { margin: 4px 0; font-size: 13px; color: var(--im-text, #303133); cursor: pointer; }
.praise-line:hover { color: #f56c6c; }
.codeword { margin: 0; font-size: 15px; color: #f56c6c; font-weight: bold; line-height: 1.6; }
.sos-list, .dream-list, .fact-list { margin-top: 10px; display: flex; flex-direction: column; gap: 6px; }
.sos-item { display: flex; align-items: center; gap: 8px; font-size: 13px; flex-wrap: wrap; }
.sos-from { color: var(--im-muted, #909399); min-width: 84px; }
.sos-msg { color: var(--im-text, #303133); flex: 1; }
.three-form { display: flex; flex-direction: column; gap: 8px; }
.three-partner { margin-top: 10px; background: var(--im-bg, #fafafa); border-radius: 8px; padding: 10px 12px; font-size: 13px; color: var(--im-text, #303133); }
.three-partner p { margin: 2px 0; }
.three-title { color: var(--im-muted, #909399) !important; font-weight: bold; }
.dream-item { margin: 0; font-size: 13px; color: var(--im-text, #303133); line-height: 1.6; }
.food-form, .fact-form { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-bottom: 8px; }
.food-form .el-input, .fact-form .el-input { flex: 1; min-width: 130px; }
.food-list { display: flex; flex-direction: column; gap: 8px; margin-top: 6px; }
.food-item { display: flex; align-items: center; gap: 8px; font-size: 13px; flex-wrap: wrap; }
.food-shop { color: var(--im-text, #303133); font-weight: bold; }
.food-dish { color: var(--im-muted, #909399); }
.food-comment { width: 150px; }
.food-comment-text { color: var(--im-muted, #909399); font-size: 12px; }
.fact-item { margin: 0; font-size: 13px; color: var(--im-text, #303133); display: flex; align-items: center; gap: 6px; }
.fact-by { color: var(--im-muted, #909399); font-size: 12px; }
.badge-item { display: flex; align-items: center; gap: 8px; font-size: 13px; flex-wrap: wrap; }
.badge-title { color: var(--im-text, #303133); font-weight: bold; }
.badge-cond { color: var(--im-muted, #909399); flex: 1; }
</style>

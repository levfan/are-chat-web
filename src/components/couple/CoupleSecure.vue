<template>
  <div class="couple-secure" data-testid="couple-secure">
    <!-- F120 安全感账户 -->
    <div class="card" data-testid="couple-security">
      <h4 class="title">🫙 安全感账户 <span class="sub">安心的话存起来，需要勇气的时候来取</span></h4>
      <p class="balance" data-testid="couple-security-balance">
        当前余额：<b>{{ sec?.balance ?? 0 }}</b> 句安心话
      </p>
      <el-input
        v-model="securityDraft"
        maxlength="200"
        show-word-limit
        placeholder="存一句让 TA 安心的话（有我在，别怕）"
        data-testid="couple-security-input"
        @keyup.enter="onDepositSecurity"
      />
      <el-button class="mt8" size="small" type="primary" data-testid="couple-security-deposit" @click="onDepositSecurity">
        存进去 🫙
      </el-button>
      <div v-if="sec?.recent?.length" class="sec-list">
        <div v-for="s in sec.recent.slice(0, 5)" :key="s.id" class="sec-item" data-testid="couple-security-item">
          <span class="sec-from">{{ s.mine ? '我存的' : 'TA 存的' }}</span>
          <span class="sec-content">「{{ s.content }}」</span>
          <el-tag v-if="s.status === 'ACCEPTED'" size="small" type="success">已收下</el-tag>
          <el-button v-else-if="!s.mine" size="small" type="success" plain :data-testid="`couple-security-accept-${s.id}`" @click="onAcceptSecurity(s.id)">
            收下 💗
          </el-button>
          <el-tag v-else size="small" type="info">等 TA 收下</el-tag>
        </div>
      </div>
    </div>

    <!-- F121 恋爱体检 -->
    <div class="card" data-testid="couple-checkup">
      <h4 class="title">🩺 恋爱体检 <span class="sub">定期看看我们的关系健康度</span></h4>
      <template v-if="chk">
        <p class="checkup-level" data-testid="couple-checkup-level">
          综合得分 <b>{{ chk.total }}</b> · {{ chk.level }}
        </p>
        <div v-for="item in chk.items" :key="item.name" class="checkup-item">
          <div class="checkup-head">
            <span>{{ item.name }}</span>
            <span class="checkup-score">{{ item.score }}</span>
          </div>
          <el-progress :percentage="item.score" :show-text="false" :stroke-width="8" />
          <p class="checkup-advice">{{ item.advice }}</p>
        </div>
      </template>
      <el-button v-else size="small" plain data-testid="couple-checkup-run" @click="onCheckup">开始体检 🩺</el-button>
    </div>

    <!-- F122 十年之约 -->
    <div class="card" data-testid="couple-decade">
      <h4 class="title">⏳ 十年之约 <span class="sub">十年很长，但说好了就是十年</span></h4>
      <div class="decade-grid">
        <div class="decade-cell" data-testid="couple-decade-mine">
          <p class="decade-label">我的十年后</p>
          <p class="decade-content">{{ dec?.mine?.content || '还没写……' }}</p>
        </div>
        <div class="decade-cell" data-testid="couple-decade-partner">
          <p class="decade-label">TA 的十年后</p>
          <p class="decade-content">{{ dec?.partner?.content || '等 TA 落笔……' }}</p>
        </div>
      </div>
      <el-input
        v-model="decadeDraft"
        maxlength="200"
        show-word-limit
        placeholder="十年后的我们……（写完可修改）"
        data-testid="couple-decade-input"
      />
      <el-button class="mt8" size="small" type="primary" data-testid="couple-decade-save" @click="onSaveDecade">
        {{ dec?.mine ? '改写十年之约' : '写下十年之约' }} ⏳
      </el-button>
      <p v-if="dec?.complete" class="decade-done" data-testid="couple-decade-complete">🎉 两句都写好了，这就是我们的十年。</p>
    </div>

    <!-- F123 愿景板 -->
    <div class="card" data-testid="couple-vision">
      <h4 class="title">✨ 愿景板 <span class="sub">写同一个词，就是共鸣</span></h4>
      <div class="vision-form">
        <el-input v-model="visionWord" maxlength="20" placeholder="一个词（海边小屋）" data-testid="couple-vision-word" />
        <el-input v-model="visionNote" maxlength="100" placeholder="想多说的一句（可空）" data-testid="couple-vision-note" />
        <el-button size="small" type="primary" data-testid="couple-vision-add" @click="onAddVision">贴上去 ✨</el-button>
      </div>
      <div v-if="vs.length" class="vision-list">
        <div v-for="v in vs" :key="v.id" class="vision-item" :class="{ resonate: v.resonate }" data-testid="couple-vision-item">
          <span class="vision-word">{{ v.word }}</span>
          <el-tag v-if="v.resonate" size="small" type="warning" data-testid="couple-vision-resonate">💞 共鸣</el-tag>
          <span class="vision-note">{{ v.note || '' }}</span>
          <span class="vision-from">{{ v.mine ? '我' : 'TA' }}</span>
        </div>
      </div>
    </div>

    <!-- F124 承诺博物馆 -->
    <div class="card" data-testid="couple-oath">
      <h4 class="title">🖋️ 承诺博物馆 <span class="sub">双方盖章的承诺，永久展出</span></h4>
      <el-input
        v-model="oathDraft"
        maxlength="200"
        show-word-limit
        placeholder="郑重写下一份承诺（吵架不过夜）"
        data-testid="couple-oath-input"
      />
      <el-button class="mt8" size="small" type="primary" data-testid="couple-oath-make" @click="onMakeOath">
        送进博物馆 🖋️
      </el-button>
      <div v-if="oth.length" class="oath-list">
        <div v-for="o in oth" :key="o.id" class="oath-item" :class="{ exhibited: o.exhibited }" data-testid="couple-oath-item">
          <span class="oath-content">「{{ o.content }}」</span>
          <span class="oath-stamps">
            <span :class="{ stamped: o.stampMine }" class="stamp">🔖 我</span>
            <span :class="{ stamped: o.stampPartner }" class="stamp">🔖 TA</span>
          </span>
          <el-tag v-if="o.exhibited" size="small" type="success" data-testid="couple-oath-exhibited">展出中 🏛️</el-tag>
          <el-button v-else size="small" type="warning" plain :data-testid="`couple-oath-stamp-${o.id}`" @click="onStampOath(o.id)">
            盖章
          </el-button>
        </div>
      </div>
    </div>

    <!-- F125 信任存折 -->
    <div class="card" data-testid="couple-trust">
      <h4 class="title">🪙 信任存折 <span class="sub">一枚一枚攒，攒成无条件的信任（每天一枚）</span></h4>
      <div class="trust-grid">
        <div class="trust-cell" data-testid="couple-trust-mine">
          <b>{{ trs?.mineBalance ?? 0 }}</b>
          <span>我攒到的信任</span>
        </div>
        <div class="trust-cell" data-testid="couple-trust-partner">
          <b>{{ trs?.partnerBalance ?? 0 }}</b>
          <span>TA 攒到的信任</span>
        </div>
      </div>
      <el-input
        v-model="trustReason"
        maxlength="100"
        placeholder="为什么值得信（说到做到，可空）"
        data-testid="couple-trust-reason"
      />
      <el-button class="mt8" size="small" type="primary" data-testid="couple-trust-deposit" @click="onDepositTrust">
        给 TA 存一枚 🪙
      </el-button>
    </div>

    <!-- F126 恋爱年轮 -->
    <div class="card" data-testid="couple-rings">
      <h4 class="title">🪵 恋爱年轮 <span class="sub">一年一圈，都是我们一起长的</span></h4>
      <template v-if="ring">
        <div v-for="r in ring.rings" :key="r.year" class="ring-item" data-testid="couple-ring-item">
          <span class="ring-year">{{ r.year }}</span>
          <span class="ring-days">第 {{ r.days }} 天</span>
          <el-tag v-if="r.events" size="small" type="warning">{{ r.events }} 件大日子</el-tag>
        </div>
      </template>
      <el-button v-else size="small" plain data-testid="couple-rings-load" @click="onLoadRings">看看年轮 🪵</el-button>
    </div>

    <!-- F128 双人契约 -->
    <div class="card" data-testid="couple-contract">
      <h4 class="title">📜 双人契约 <span class="sub">说好一起做的事，一次一次攒默契</span></h4>
      <div class="contract-form">
        <el-input v-model="contractTitle" maxlength="50" placeholder="契约名（每天说晚安）" data-testid="couple-contract-title" />
        <el-input v-model="contractContent" maxlength="200" placeholder="内容补充（可空）" data-testid="couple-contract-content" />
        <el-button size="small" type="primary" data-testid="couple-contract-make" @click="onMakeContract">立约 📜</el-button>
      </div>
      <div v-if="ctr.length" class="contract-list">
        <div v-for="c in ctr" :key="c.row.id" class="contract-item" data-testid="couple-contract-item">
          <span class="contract-title">{{ c.row.title }}</span>
          <span class="contract-counts">我 {{ c.myCount }} 次 · TA {{ c.partnerCount }} 次</span>
          <el-button size="small" type="success" plain :data-testid="`couple-contract-check-${c.row.id}`" @click="onCheckContract(c.row.id)">
            打卡 +1
          </el-button>
        </div>
      </div>
    </div>

    <!-- F129 守护兽 -->
    <div class="card" data-testid="couple-pet">
      <h4 class="title">🐾 守护兽 <span class="sub">你们的关系有了一只小兽看着</span></h4>
      <template v-if="pt">
        <div class="pet-stage">
          <span class="pet-avatar" data-testid="couple-pet-avatar">{{ petEmoji }}</span>
          <div class="pet-info">
            <p class="pet-name" data-testid="couple-pet-name">{{ pt.name }}</p>
            <p class="pet-mood" data-testid="couple-pet-mood">{{ moodLabel }}：{{ pt.moodLine }}</p>
            <p class="pet-care">已照料 {{ pt.careCount }} 次</p>
          </div>
        </div>
        <el-button size="small" type="primary" plain data-testid="couple-pet-care" @click="onCarePet">照料一下 🍼</el-button>
      </template>
      <template v-else>
        <div class="contract-form">
          <el-input v-model="petName" maxlength="20" placeholder="给守护兽起个名字" data-testid="couple-pet-name-input" />
          <el-select v-model="petKind" placeholder="种类" data-testid="couple-pet-kind" style="width: 120px">
            <el-option label="狐狸 🦊" value="FOX" />
            <el-option label="猫猫 🐱" value="CAT" />
            <el-option label="熊熊 🐻" value="BEAR" />
            <el-option label="兔兔 🐰" value="BUNNY" />
          </el-select>
          <el-button size="small" type="primary" data-testid="couple-pet-adopt" @click="onAdoptPet">领养 🐾</el-button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useCoupleStore } from '@/stores/couple'

const couple = useCoupleStore()

const sec = computed(() => couple.securityBoard)
const chk = computed(() => couple.checkup)
const dec = computed(() => couple.decade)
const vs = computed(() => couple.visions)
const oth = computed(() => couple.oaths)
const trs = computed(() => couple.trustBoard)
const ring = computed(() => couple.rings)
const ctr = computed(() => couple.contracts)
const pt = computed(() => couple.pet)

const securityDraft = ref('')
const decadeDraft = ref('')
const visionWord = ref('')
const visionNote = ref('')
const oathDraft = ref('')
const trustReason = ref('')
const contractTitle = ref('')
const contractContent = ref('')
const petName = ref('')
const petKind = ref('FOX')

const petEmoji = computed(() => {
  switch (pt.value?.kind) {
    case 'CAT': return '🐱'
    case 'BEAR': return '🐻'
    case 'BUNNY': return '🐰'
    default: return '🦊'
  }
})
const moodLabel = computed(() => {
  switch (pt.value?.mood) {
    case 'HAPPY': return '开心'
    case 'CALM': return '平静'
    case 'MISS': return '想念'
    default: return '蔫蔫'
  }
})

async function onDepositSecurity() {
  if (!securityDraft.value.trim()) {
    ElMessage.warning('安心话先写一句再存 🫙')
    return
  }
  try {
    await couple.depositSecurity(securityDraft.value)
    securityDraft.value = ''
    ElMessage.success('安心话已存入账户 🫙')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '存入失败')
  }
}

async function onAcceptSecurity(id: string) {
  try {
    await couple.acceptSecurity(id)
    ElMessage.success('已收下这句安心话，+1 底气 💗')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '收下失败')
  }
}

async function onCheckup() {
  try {
    await couple.loadCheckup()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '体检失败')
  }
}

async function onSaveDecade() {
  if (!decadeDraft.value.trim()) {
    ElMessage.warning('十年之约先写一句 ⏳')
    return
  }
  try {
    await couple.saveDecade(decadeDraft.value)
    decadeDraft.value = ''
    ElMessage.success('十年之约已写下 ⏳')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '保存失败')
  }
}

async function onAddVision() {
  if (!visionWord.value.trim()) {
    ElMessage.warning('愿景板要写一个词 ✨')
    return
  }
  try {
    await couple.addVision(visionWord.value, visionNote.value.trim() || undefined)
    visionWord.value = ''
    visionNote.value = ''
    ElMessage.success('愿景已贴上墙 ✨')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '添加失败')
  }
}

async function onMakeOath() {
  if (!oathDraft.value.trim()) {
    ElMessage.warning('承诺要写具体内容才能展出 🖋️')
    return
  }
  try {
    await couple.makeOath(oathDraft.value)
    oathDraft.value = ''
    ElMessage.success('承诺已送进博物馆，等双方盖章 🖋️')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '提交失败')
  }
}

async function onStampOath(id: string) {
  try {
    await couple.stampOath(id)
    ElMessage.success('盖章成功 🔖')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '盖章失败')
  }
}

async function onDepositTrust() {
  try {
    await couple.depositTrust(trustReason.value.trim() || undefined)
    trustReason.value = ''
    ElMessage.success('信任币已存入 TA 的存折 🪙')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '存入失败')
  }
}

async function onLoadRings() {
  try {
    await couple.loadRings()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '加载失败')
  }
}

async function onMakeContract() {
  if (!contractTitle.value.trim()) {
    ElMessage.warning('条约标题先写一句 📜')
    return
  }
  try {
    await couple.makeContract(contractTitle.value, contractContent.value.trim() || undefined)
    contractTitle.value = ''
    contractContent.value = ''
    ElMessage.success('契约已立下 📜')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '立约失败')
  }
}

async function onCheckContract(id: string) {
  try {
    await couple.checkContract(id)
    ElMessage.success('打卡 +1，默契又厚了一点 📜')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '打卡失败')
  }
}

async function onAdoptPet() {
  if (!petName.value.trim()) {
    ElMessage.warning('给守护兽起个名字吧 🐾')
    return
  }
  try {
    await couple.adoptPet(petName.value, petKind.value)
    ElMessage.success('守护兽已加入家庭 🐾')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '领养失败')
  }
}

async function onCarePet() {
  try {
    await couple.carePet()
    ElMessage.success('照料成功，它蹭了蹭你 🍼')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '照料失败')
  }
}

onMounted(async () => {
  try {
    await couple.loadSecure()
  } catch {
    // 未建立空间等场景：静默
  }
})
</script>

<style scoped>
.couple-secure { display: flex; flex-direction: column; gap: 14px; }
.card { background: var(--im-panel-bg, #fff); border-radius: 10px; padding: 14px 16px; border: 1px solid var(--im-border, #ebeef5); }
.title { margin: 0 0 10px; font-size: 15px; color: var(--im-text, #303133); }
.sub { font-size: 12px; color: var(--im-muted, #909399); font-weight: normal; margin-left: 6px; }
.balance { font-size: 14px; color: var(--im-text, #303133); margin: 0 0 8px; }
.balance b { color: #f56c6c; font-size: 18px; }
.sec-list, .oath-list, .vision-list, .contract-list { margin-top: 10px; display: flex; flex-direction: column; gap: 6px; }
.sec-item, .oath-item { display: flex; align-items: center; gap: 8px; font-size: 13px; flex-wrap: wrap; }
.sec-from { color: var(--im-muted, #909399); min-width: 48px; }
.sec-content, .oath-content { color: var(--im-text, #303133); flex: 1; min-width: 140px; }
.mt8 { margin-top: 8px; }
.checkup-level { font-size: 14px; color: var(--im-text, #303133); margin: 0 0 10px; }
.checkup-level b { color: #f56c6c; }
.checkup-item { margin-bottom: 10px; }
.checkup-head { display: flex; justify-content: space-between; font-size: 13px; color: var(--im-text, #303133); margin-bottom: 4px; }
.checkup-score { color: #f56c6c; font-weight: bold; }
.checkup-advice { margin: 4px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.decade-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
.decade-cell { background: var(--im-bg, #fafafa); border-radius: 8px; padding: 10px; }
.decade-label { margin: 0 0 4px; font-size: 12px; color: var(--im-muted, #909399); }
.decade-content { margin: 0; font-size: 13px; color: var(--im-text, #303133); line-height: 1.5; }
.decade-done { margin: 8px 0 0; font-size: 13px; color: #f56c6c; }
.vision-form, .contract-form { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.vision-form .el-input { flex: 1; min-width: 140px; }
.vision-item { display: flex; align-items: center; gap: 8px; font-size: 13px; padding: 6px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); }
.vision-item.resonate { background: #fdf0ec; }
.vision-word { font-weight: bold; color: #f56c6c; }
.vision-note { color: var(--im-muted, #909399); flex: 1; }
.vision-from { color: var(--im-muted, #909399); }
.oath-item { padding: 6px 0; }
.oath-item.exhibited { background: var(--im-bg, #fafafa); border-radius: 8px; padding: 8px 10px; }
.oath-stamps { display: flex; gap: 6px; }
.stamp { font-size: 12px; color: var(--im-muted, #909399); opacity: 0.5; }
.stamp.stamped { opacity: 1; color: #e6a23c; }
.trust-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
.trust-cell { text-align: center; background: var(--im-bg, #fafafa); border-radius: 8px; padding: 10px 0; }
.trust-cell b { display: block; font-size: 20px; color: #f56c6c; }
.trust-cell span { font-size: 12px; color: var(--im-muted, #909399); }
.ring-item { display: flex; align-items: center; gap: 10px; font-size: 13px; padding: 4px 0; }
.ring-year { font-weight: bold; color: var(--im-text, #303133); min-width: 44px; }
.ring-days { color: var(--im-muted, #909399); flex: 1; }
.contract-item { display: flex; align-items: center; gap: 10px; font-size: 13px; }
.contract-title { color: var(--im-text, #303133); flex: 1; }
.contract-counts { color: var(--im-muted, #909399); }
.pet-stage { display: flex; align-items: center; gap: 14px; margin-bottom: 10px; }
.pet-avatar { font-size: 42px; }
.pet-name { margin: 0; font-size: 15px; font-weight: bold; color: var(--im-text, #303133); }
.pet-mood { margin: 4px 0 0; font-size: 13px; color: var(--im-text, #303133); }
.pet-care { margin: 2px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
</style>

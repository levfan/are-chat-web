<template>
  <div class="couple-museum" data-testid="couple-museum">
    <!-- F190 恋爱纪录片 -->
    <div class="card" data-testid="couple-museum-scenes">
      <h4 class="title">🎬 恋爱纪录片 <span class="sub">我们的故事，值得一部三幕片</span></h4>
      <div class="textarea-form">
        <el-input v-model="sceneTitleDraft" maxlength="50" placeholder="片名（我们的秋天校园）" data-testid="couple-museum-scene-title" />
        <el-input v-model="actOneDraft" type="textarea" :rows="2" maxlength="300" placeholder="第一幕：怎么认识的" data-testid="couple-museum-scene-act1" />
        <el-input v-model="actTwoDraft" type="textarea" :rows="2" maxlength="300" placeholder="第二幕：怎么走到一起的" data-testid="couple-museum-scene-act2" />
        <el-input v-model="actThreeDraft" type="textarea" :rows="2" maxlength="300" placeholder="终幕：要往哪里去" data-testid="couple-museum-scene-act3" />
        <el-button size="small" type="primary" data-testid="couple-museum-scene-add" @click="onAddScene">杀青 🎬</el-button>
      </div>
      <p v-if="!scenes.length" class="empty-line">片库里还没有镜头，从相识那幕拍起吧 🎬</p>
      <div v-for="s in scenes" :key="s.id" class="item-block" :data-testid="`couple-museum-scene-${s.id}`">
        <p class="flash-line">
          <b>{{ s.title }}</b>
          <span class="flash-by">{{ s.mine ? '我执导' : 'TA 执导' }} · {{ fmtDate(s.created) }}</span>
        </p>
        <p class="act-line">第一幕：{{ s.actOne }}</p>
        <p class="act-line">第二幕：{{ s.actTwo }}</p>
        <p class="act-line">终幕：{{ s.actThree }}</p>
      </div>
    </div>

    <!-- F191 博物馆展品 -->
    <div class="card" data-testid="couple-museum-exhibits">
      <h4 class="title">🏛️ 博物馆展品 <span class="sub">每样纪念物都值得一份展签</span></h4>
      <div class="inline-form">
        <el-input v-model="exhibitNameDraft" maxlength="50" placeholder="展品名（第一张电影票根）" data-testid="couple-museum-exhibit-name" />
        <el-input v-model="exhibitStoryDraft" maxlength="200" placeholder="展品故事（为什么值得收进来）" data-testid="couple-museum-exhibit-story" />
        <el-date-picker
          v-model="exhibitDayDraft"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="入手日期（可空）"
          style="width: 150px"
          data-testid="couple-museum-exhibit-day"
        />
        <el-button size="small" type="primary" data-testid="couple-museum-exhibit-add" @click="onAddExhibit">入馆 🏛️</el-button>
      </div>
      <p v-if="!exhibits.length" class="empty-line">馆里还空着，回家翻翻有什么值得上架 🏛️</p>
      <div v-for="e in exhibits" :key="e.id" class="item-block" :data-testid="`couple-museum-exhibit-${e.id}`">
        <p class="flash-line">
          <b>{{ e.name }}</b>
          <span class="flash-by">{{ e.mine ? '我捐的' : 'TA 捐的' }}<template v-if="e.obtainedDay"> · 入手 {{ e.obtainedDay.slice(5) }}</template></span>
        </p>
        <p class="exhibit-story">{{ e.story }}</p>
      </div>
    </div>

    <!-- F192 去年今日对比镜 -->
    <div class="card" data-testid="couple-museum-mirror">
      <h4 class="title">🪞 去年今日对比镜 <span class="sub">去年今日与今年今日，看爱攒多了多少</span></h4>
      <template v-if="mirror">
        <p class="pair-line" data-testid="couple-museum-mirror-days">{{ mirror.lastYearDay }} ⇄ {{ mirror.thisYearDay }}</p>
        <div class="mirror-table" data-testid="couple-museum-mirror-table">
          <p class="mirror-row" data-testid="couple-museum-mirror-thanks">
            <span class="mirror-label">感谢便签</span><span>{{ mirror.lastYear.thanks }}</span><span class="mirror-arrow">→</span><span>{{ mirror.thisYear.thanks }}</span>
          </p>
          <p class="mirror-row" data-testid="couple-museum-mirror-journal">
            <span class="mirror-label">心情日记</span><span>{{ mirror.lastYear.journal }}</span><span class="mirror-arrow">→</span><span>{{ mirror.thisYear.journal }}</span>
          </p>
          <p class="mirror-row" data-testid="couple-museum-mirror-flash">
            <span class="mirror-label">闪光时刻</span><span>{{ mirror.lastYear.flash }}</span><span class="mirror-arrow">→</span><span>{{ mirror.thisYear.flash }}</span>
          </p>
        </div>
        <p class="summary-line" data-testid="couple-museum-mirror-summary">{{ mirror.summary }}</p>
      </template>
      <p v-else class="empty-line">镜子还没擦亮，晚点再来照照 🪞</p>
    </div>

    <!-- F193 银发情话机 -->
    <div class="card" data-testid="couple-museum-silver">
      <h4 class="title">👴👵 银发情话机 <span class="sub">从今天开始练，练到八十岁还说给对方听</span></h4>
      <p v-if="silver" class="silver-quote" data-testid="couple-museum-silver-line">「{{ silver.line }}」</p>
      <p v-else class="empty-line">情话机正在预热，明天来取一句 ☎️</p>
    </div>

    <!-- F194 恋爱高频词 -->
    <div class="card" data-testid="couple-museum-words">
      <h4 class="title">☁️ 恋爱高频词 <span class="sub">你们说得最多的词，就是爱的形状</span></h4>
      <div v-if="words.length" class="word-chips" data-testid="couple-museum-words-cloud">
        <span v-for="w in words" :key="w.word" class="word-chip" :data-testid="`couple-museum-word-${w.word}`">{{ w.word }} × {{ w.count }}</span>
      </div>
      <p v-else class="empty-line" data-testid="couple-museum-words-empty">多写点便签，词云会长出来</p>
    </div>

    <!-- F195 隐藏成就墙 -->
    <div class="card" data-testid="couple-museum-achievements">
      <h4 class="title">🏆 隐藏成就墙 <span class="sub">有些爱不必刻意，过着过着就到了</span></h4>
      <p v-if="!achievements.length" class="empty-line">成就还没点亮，继续过日子吧 🏆</p>
      <div class="badge-grid">
        <div
          v-for="a in achievements"
          :key="a.code"
          class="badge-cell"
          :class="{ locked: !a.unlocked }"
          :data-testid="`couple-museum-achievement-${a.code}`"
        >
          <p class="badge-face">{{ a.unlocked ? `${a.emoji} ${a.name}` : `🔒 ${a.name}` }}</p>
          <p class="badge-note" :data-testid="`couple-museum-achievement-note-${a.code}`">
            {{ a.unlocked ? `${a.unlockedBy} 于 ${fmtDate(a.unlockedAt ?? 0)} 解锁` : a.desc }}
          </p>
        </div>
      </div>
    </div>

    <!-- F196 家规宪法 -->
    <div class="card" data-testid="couple-museum-rules">
      <h4 class="title">📜 家规宪法 <span class="sub">规矩写下来才算数，推翻一条也要签字</span></h4>
      <div class="inline-form">
        <el-select v-model="ruleKindDraft" size="small" style="width: 110px" data-testid="couple-museum-rule-kind">
          <el-option label="条款" value="RULE" />
          <el-option label="修正案" value="AMENDMENT" />
        </el-select>
        <el-select
          v-if="ruleKindDraft === 'AMENDMENT'"
          v-model="ruleRefDraft"
          size="small"
          placeholder="修正哪一条"
          style="width: 190px"
          data-testid="couple-museum-rule-ref"
        >
          <el-option v-for="r in signedRules" :key="r.id" :label="r.content" :value="r.id" />
        </el-select>
        <el-input v-model="ruleContentDraft" maxlength="200" placeholder="把规矩写清楚" data-testid="couple-museum-rule-content" />
        <el-button size="small" type="primary" data-testid="couple-museum-rule-add" @click="onAddRule">立宪 📜</el-button>
      </div>
      <p v-if="!rules.length" class="empty-line">宪法还空着，第一条等你们落笔 📜</p>
      <div v-for="r in rules" :key="r.id" class="item-block" :data-testid="`couple-museum-rule-${r.id}`">
        <p class="flash-line">
          <el-tag size="small" :type="r.kind === 'RULE' ? 'primary' : 'warning'">{{ r.kind === 'RULE' ? '条款' : '修正案' }}</el-tag>
          {{ r.content }}
        </p>
        <p class="rule-meta">
          <span class="flash-by">{{ r.mine ? '我提的' : `${r.proposedBy} 提的` }}</span>
          <el-tag size="small" :type="r.signed ? 'success' : 'info'" :data-testid="`couple-museum-rule-state-${r.id}`">
            {{ r.signed ? `已签字${r.signedBy ? `（${r.signedBy}）` : ''}` : '待对方签字' }}
          </el-tag>
          <el-button
            v-if="!r.mine && !r.signed"
            size="small"
            type="primary"
            plain
            :data-testid="`couple-museum-rule-sign-${r.id}`"
            @click="onSignRule(r)"
          >签字 ✍️</el-button>
        </p>
      </div>
    </div>

    <!-- F197 免打扰时段 -->
    <div class="card" data-testid="couple-museum-dnd">
      <h4 class="title">🌙 免打扰时段 <span class="sub">静音时段内 TA 的提醒不弹窗，消息都在，只是不打扰</span></h4>
      <div class="inline-form">
        <el-input v-model="dndStartDraft" maxlength="5" placeholder="开始 HH:mm" style="width: 110px" data-testid="couple-museum-dnd-start" />
        <span class="mirror-label">至</span>
        <el-input v-model="dndEndDraft" maxlength="5" placeholder="结束 HH:mm" style="width: 110px" data-testid="couple-museum-dnd-end" />
        <el-switch v-model="dndEnabledDraft" data-testid="couple-museum-dnd-enabled" />
        <el-button size="small" type="primary" data-testid="couple-museum-dnd-save" @click="onSaveDnd">保存 🌙</el-button>
      </div>
      <p v-if="!dndList.length" class="empty-line">还没人设过安静时间，夜里太吵就约一段吧 🌙</p>
      <p v-for="(d, di) in dndList" :key="di" class="pair-line" :data-testid="`couple-museum-dnd-${di}`">
        <span class="flash-by">{{ d.mine ? '我的' : d.fromUser }}：</span>
        {{ d.startTime }} – {{ d.endTime }}
        <el-tag size="small" :type="d.enabled ? 'success' : 'info'">{{ d.enabled ? '开启中' : '已暂停' }}</el-tag>
      </p>
    </div>

    <!-- F199 年度记忆书 -->
    <div class="card" data-testid="couple-museum-book">
      <h4 class="title">📚 年度记忆书 <span class="sub">一年一本书，慢慢翻，页页都是你们</span></h4>
      <template v-if="book">
        <p class="book-year" data-testid="couple-museum-book-year">《{{ book.year }} 卷》</p>
        <p v-for="(c, ci) in book.chapters" :key="c.month" class="chapter-line" :data-testid="`couple-museum-book-chapter-${ci}`">
          <b>第 {{ ci + 1 }} 章 · {{ c.title }}</b>
          <span class="chapter-note">{{ c.month.slice(5) }}月</span>
          <span class="chapter-text">{{ c.line }}</span>
        </p>
      </template>
      <p v-else class="empty-line">今年的书还装帧中，落笔的就是你们 📚</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { museumApi } from '@/api/couple'
import { useCoupleStore } from '@/stores/couple'
import type {
  CoupleMuseumAchievementVO,
  CoupleMuseumBookVO,
  CoupleMuseumDndVO,
  CoupleMuseumDocSceneVO,
  CoupleMuseumExhibitVO,
  CoupleMuseumMirrorVO,
  CoupleMuseumRuleVO,
  CoupleMuseumSilverLineVO,
  CoupleMuseumWordVO,
} from '@/types'

const scenes = ref<CoupleMuseumDocSceneVO[]>([])
const exhibits = ref<CoupleMuseumExhibitVO[]>([])
const mirror = ref<CoupleMuseumMirrorVO | null>(null)
const silver = ref<CoupleMuseumSilverLineVO | null>(null)
const words = ref<CoupleMuseumWordVO[]>([])
const achievements = ref<CoupleMuseumAchievementVO[]>([])
const rules = ref<CoupleMuseumRuleVO[]>([])
const dndList = ref<CoupleMuseumDndVO[]>([])
const book = ref<CoupleMuseumBookVO | null>(null)

/** 已签字条款：修正案只能挂在这些上面 */
const signedRules = computed(() => rules.value.filter((r) => r.signed))

// ---- 草稿 ----
const sceneTitleDraft = ref('')
const actOneDraft = ref('')
const actTwoDraft = ref('')
const actThreeDraft = ref('')
const exhibitNameDraft = ref('')
const exhibitStoryDraft = ref('')
const exhibitDayDraft = ref('')
const ruleKindDraft = ref<CoupleMuseumRuleVO['kind']>('RULE')
const ruleRefDraft = ref('')
const ruleContentDraft = ref('')
const dndStartDraft = ref('23:00')
const dndEndDraft = ref('07:30')
const dndEnabledDraft = ref(true)

const HHMM = /^\d{2}:\d{2}$/

function fmtDate(ts: number) {
  return new Date(ts).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
}

function onError(e: unknown, fallback: string) {
  ElMessage.error(e instanceof Error ? e.message : fallback)
}

// ---- F190 恋爱纪录片 ----
async function onAddScene() {
  if (!sceneTitleDraft.value.trim() || !actOneDraft.value.trim() || !actTwoDraft.value.trim() || !actThreeDraft.value.trim()) {
    ElMessage.warning('片名和三幕都要写哦 🎬')
    return
  }
  try {
    scenes.value =
      (await museumApi.createScene({
        title: sceneTitleDraft.value.trim(),
        actOne: actOneDraft.value.trim(),
        actTwo: actTwoDraft.value.trim(),
        actThree: actThreeDraft.value.trim(),
      })) ?? []
    sceneTitleDraft.value = ''
    actOneDraft.value = ''
    actTwoDraft.value = ''
    actThreeDraft.value = ''
    ElMessage.success('纪录片已入馆 🎬')
  } catch (e) {
    onError(e, '提交失败')
  }
}

// ---- F191 博物馆展品 ----
async function onAddExhibit() {
  if (!exhibitNameDraft.value.trim() || !exhibitStoryDraft.value.trim()) {
    ElMessage.warning('展品名和故事都要写哦 🏛️')
    return
  }
  try {
    exhibits.value =
      (await museumApi.createExhibit({
        name: exhibitNameDraft.value.trim(),
        story: exhibitStoryDraft.value.trim(),
        obtainedDay: exhibitDayDraft.value || null,
      })) ?? []
    exhibitNameDraft.value = ''
    exhibitStoryDraft.value = ''
    exhibitDayDraft.value = ''
    ElMessage.success('展品已上架 🏛️')
  } catch (e) {
    onError(e, '入馆失败')
  }
}

// ---- F196 家规宪法 ----
async function onAddRule() {
  if (!ruleContentDraft.value.trim()) {
    ElMessage.warning('先把规矩写出来哦 📜')
    return
  }
  if (ruleKindDraft.value === 'AMENDMENT' && !ruleRefDraft.value) {
    ElMessage.warning('修正案要选一条已签字条款')
    return
  }
  try {
    rules.value =
      (await museumApi.createRule({
        kind: ruleKindDraft.value,
        refId: ruleKindDraft.value === 'AMENDMENT' ? ruleRefDraft.value : null,
        content: ruleContentDraft.value.trim(),
      })) ?? []
    ruleContentDraft.value = ''
    ruleRefDraft.value = ''
    ElMessage.success(ruleKindDraft.value === 'AMENDMENT' ? '修正案已提交 📜' : '条款已立宪 📜')
  } catch (e) {
    onError(e, '立宪失败')
  }
}

async function onSignRule(r: CoupleMuseumRuleVO) {
  try {
    rules.value = (await museumApi.signRule(r.id)) ?? rules.value
    ElMessage.success('签字生效，家规又硬了一分 ✍️')
  } catch (e) {
    onError(e, '签字失败')
  }
}

// ---- F197 免打扰时段 ----
async function onSaveDnd() {
  if (!HHMM.test(dndStartDraft.value) || !HHMM.test(dndEndDraft.value)) {
    ElMessage.warning('时间要写成 HH:mm 哦，比如 23:00')
    return
  }
  try {
    dndList.value =
      (await museumApi.saveDnd({
        startTime: dndStartDraft.value,
        endTime: dndEndDraft.value,
        enabled: dndEnabledDraft.value,
      })) ?? []
    void useCoupleStore().refreshDnd()
    ElMessage.success(dndEnabledDraft.value ? '免打扰时段已生效 🌙' : '免打扰已暂停 ☀️')
  } catch (e) {
    onError(e, '保存失败')
  }
}

// ---- 初始加载 ----
async function safeLoad<T>(loader: () => Promise<T>, fallback: T): Promise<T> {
  try {
    const data = await loader()
    return data ?? fallback
  } catch {
    // 未建立情侣空间等场景：静默降级，不报错不弹窗
    return fallback
  }
}

onMounted(async () => {
  const [sc, ex, mi, si, wd, ac, ru, dnd, bk] = await Promise.all([
    safeLoad(museumApi.listScenes, []),
    safeLoad(museumApi.listExhibits, []),
    safeLoad(museumApi.getLastYear, null),
    safeLoad(museumApi.getSilverLine, null),
    safeLoad(museumApi.getWords, []),
    safeLoad(museumApi.getAchievements, []),
    safeLoad(museumApi.getRules, []),
    safeLoad(museumApi.getDnd, []),
    safeLoad(museumApi.getAnnualBook, null),
  ])
  scenes.value = sc
  exhibits.value = ex
  mirror.value = mi
  silver.value = si
  words.value = wd
  achievements.value = ac
  rules.value = ru
  dndList.value = dnd
  book.value = bk
})
</script>

<style scoped>
.couple-museum { display: flex; flex-direction: column; gap: 14px; }
.card { background: var(--im-panel-bg, #fff); border-radius: 10px; padding: 14px 16px; border: 1px solid var(--im-border, #ebeef5); }
.title { margin: 0 0 10px; font-size: 15px; color: var(--im-text, #303133); }
.sub { font-size: 12px; color: var(--im-muted, #909399); font-weight: normal; margin-left: 6px; }
.inline-form { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 8px; }
.inline-form .el-input { flex: 1; min-width: 150px; }
.textarea-form { display: flex; flex-direction: column; gap: 8px; }
.item-block { margin-top: 6px; padding: 6px 8px; background: var(--im-bg, #fafafa); border-radius: 8px; }
.flash-line { margin: 4px 0; font-size: 13px; color: var(--im-text, #303133); }
.flash-by { font-size: 11px; color: var(--im-muted, #909399); margin-right: 6px; }
.act-line { margin: 2px 0; font-size: 12px; color: var(--im-text, #303133); white-space: pre-wrap; }
.exhibit-story { margin: 2px 0; font-size: 12px; color: var(--im-muted, #909399); white-space: pre-wrap; }
.empty-line { margin: 8px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.pair-line { margin: 6px 0; font-size: 13px; color: var(--im-text, #303133); line-height: 1.8; }
.mirror-table { display: flex; flex-direction: column; gap: 4px; margin-top: 6px; }
.mirror-row { margin: 0; display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--im-text, #303133); }
.mirror-label { width: 72px; color: var(--im-muted, #909399); font-size: 12px; }
.mirror-arrow { color: #f56c6c; }
.summary-line { margin: 8px 0 0; font-size: 13px; color: #f56c6c; }
.silver-quote { margin: 8px 0 0; font-size: 18px; line-height: 1.7; color: var(--im-text, #303133); padding: 10px 14px; border-left: 3px solid #f56c6c; background: var(--im-bg, #fafafa); border-radius: 0 8px 8px 0; }
.word-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; }
.word-chip { padding: 4px 12px; border-radius: 999px; background: rgba(245, 108, 108, 0.1); color: #f56c6c; font-size: 13px; }
.badge-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 8px; }
.badge-cell { border: 1px dashed var(--im-border, #ebeef5); border-radius: 8px; padding: 8px 10px; text-align: center; }
.badge-cell.locked { opacity: 0.6; }
.badge-face { margin: 0; font-size: 13px; color: var(--im-text, #303133); }
.badge-note { margin: 2px 0 0; font-size: 11px; color: var(--im-muted, #909399); }
.rule-meta { margin: 2px 0; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 12px; }
.book-year { margin: 4px 0; font-size: 15px; font-weight: bold; color: var(--im-text, #303133); }
.chapter-line { margin: 4px 0; font-size: 13px; color: var(--im-text, #303133); line-height: 1.8; }
.chapter-note { font-size: 11px; color: var(--im-muted, #909399); margin-left: 6px; }
.chapter-text { display: block; font-size: 12px; color: var(--im-muted, #909399); }
</style>

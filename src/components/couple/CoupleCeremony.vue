<template>
  <div class="couple-ceremony" data-testid="couple-ceremony">
    <!-- F231 黄历头牌卡：今日宜忌 + 统一倒数列表 + 催办条 -->
    <CoupleCollapsible testid="couple-cere-almanac">
      <template #title>🧧 今日老黄历 <span class="sub">「我们的日子」值得郑重对待</span></template>
      <template v-if="o">
        <div class="yi-ji">
          <p class="yi-line" data-testid="couple-cere-yi">宜 · {{ o.yi || '把小日子过得热气腾腾' }}</p>
          <p class="ji-line" data-testid="couple-cere-ji">忌 · {{ o.ji || '敷衍我们的仪式感' }}</p>
        </div>
        <p v-if="!o.almanac.length" class="empty-line">日历上还空着，先去建一个小日子吧 🧧</p>
        <div class="almanac-list">
          <p
            v-for="(a, i) in o.almanac"
            :key="`${a.kind}-${a.day}-${i}`"
            class="almanac-line"
            :data-testid="`couple-cere-almanac-item-${a.kind}-${i}`"
          >
            <span class="kind-badge" :class="`kind-${a.kind}`" data-testid="couple-cere-almanac-kind">{{ KIND_META[a.kind]?.label ?? a.kind }}</span>
            <b>{{ a.title }}</b>
            <span class="flash-by">{{ a.day.slice(5) }}</span>
            <span class="days-left">{{ a.daysLeft === 0 ? '就是今天 🎉' : `还有 ${a.daysLeft} 天` }}</span>
          </p>
        </div>
        <div v-if="o.nudges.length" class="nudge-box" data-testid="couple-cere-nudges">
          <p v-for="(n, i) in o.nudges" :key="i" class="nudge-line" :data-testid="`couple-cere-nudge-${i}`">🥺 {{ n }}</p>
        </div>
      </template>
      <p v-else class="empty-line">黄历还在印…</p>
    </CoupleCollapsible>

    <!-- F230/F232/F233/F237 小日子卡：建国纪念日 + 过法卡打勾 + 史册 -->
    <CoupleCollapsible testid="couple-cere-founded" :empty="!!o && !o.founded.length">
      <template #title>🎂 我们的小日子 <span class="sub">给属于我们的日子起个名，写怎么过、勾掉它</span></template>
      <template v-if="o">
        <p v-if="!o.founded.length" class="empty-line">还没有小日子，从今天起建国 🎂</p>
        <div v-for="f in o.founded" :key="f.id" class="founded-item" :data-testid="`couple-cere-founded-${f.id}`">
          <div class="founded-head">
            <b class="founded-name">{{ f.name }}</b>
            <span v-if="f.nextDay" class="founded-next" :data-testid="`couple-cere-founded-next-${f.id}`">
              {{ f.daysLeft === 0 ? '就是今天 🎉' : `下次 ${f.nextDay.slice(5)} · 还有 ${f.daysLeft} 天` }}
              <span v-if="f.edition != null" class="edition-badge">第 {{ f.edition }} 届</span>
            </span>
            <span v-else class="founded-next passed" :data-testid="`couple-cere-founded-next-${f.id}`">这一天已经翻篇，史册里留着呢</span>
            <span class="flash-by">起点 {{ f.startDay.slice(0, 4) }}{{ f.repeatYear ? ' · 年年过' : ' · 就一次' }}</span>
            <el-button size="small" plain :data-testid="`couple-cere-founded-open-${f.id}`" @click="toggleRituals(f.id)">
              {{ ritualOpen[f.id] ? '收起过法' : '展开过法' }} {{ f.rituals.filter((r) => r.markedToday).length }}/{{ f.rituals.length }} ✓
            </el-button>
            <el-button size="small" plain type="warning" :data-testid="`couple-cere-chronicle-open-${f.id}`" @click="toggleChronicle(f.id)">
              {{ chronicleOpen[f.id] ? '合上史册' : '翻史册 📜' }}
            </el-button>
            <el-button size="small" type="danger" plain :data-testid="`couple-cere-founded-del-${f.id}`" @click="onRemoveFounded(f)">删掉</el-button>
          </div>

          <!-- F232/F233 过法任务卡：逐条打勾、增删（≤3 条） -->
          <div v-if="ritualOpen[f.id]" class="ritual-box" :data-testid="`couple-cere-rituals-${f.id}`">
            <p v-if="!f.rituals.length" class="empty-line">还没写怎么过，先立一张过法卡？🎊</p>
            <p v-for="r in f.rituals" :key="r.id" class="ritual-line" :data-testid="`couple-cere-ritual-${r.id}`">
              <el-button
                size="small"
                :type="r.markedToday ? 'success' : 'primary'"
                :plain="!r.markedToday"
                :disabled="r.markedToday"
                :data-testid="`couple-cere-mark-${r.id}`"
                @click="onMark(r.id)"
              >{{ r.markedToday ? '勾啦 ✅' : '打过勾 ✓' }}</el-button>
              <span :class="{ 'is-done': r.markedToday }">{{ r.content }}</span>
              <el-button size="small" type="danger" plain :data-testid="`couple-cere-ritual-del-${r.id}`" @click="onRemoveRitual(r.id)">划掉</el-button>
            </p>
            <div v-if="f.rituals.length < RITUAL_MAX" class="inline-form">
              <el-input
                v-model="ritualDrafts[f.id]"
                maxlength="140"
                placeholder="这条日子怎么过？（如：下班路上买一支花）"
                :data-testid="`couple-cere-ritual-input-${f.id}`"
              />
              <el-button size="small" type="primary" :data-testid="`couple-cere-ritual-add-${f.id}`" @click="onAddRitual(f.id)">写上 🎊</el-button>
            </div>
            <p v-else class="empty-line">过法满 {{ RITUAL_MAX }} 条啦，贪多嚼不烂 🎊</p>
          </div>

          <!-- F237 史册：一年一页 -->
          <div v-if="chronicleOpen[f.id]" class="chronicle-box" :data-testid="`couple-cere-chronicle-${f.id}`">
            <p v-if="!chronicles[f.id]" class="empty-line">正在翻册子…</p>
            <p v-else-if="!chroniclePages(f.id).length" class="empty-line">史册还是空白页，从今年开始写 ✍️</p>
            <div
              v-for="p in chroniclePages(f.id)"
              :key="p.day"
              class="chronicle-page"
              :data-testid="`couple-cere-chronicle-page-${p.day}`"
            >
              <p class="chronicle-year">📜 {{ p.day.slice(0, 4) }} 年 · {{ p.day.slice(5) }} <span class="flash-by">过法勾了 {{ p.marked }}/{{ p.ritualTotal }}</span></p>
              <p v-for="(fc, i) in p.feelings" :key="i" class="chronicle-feel">
                <b>{{ fc.mine ? '我 🙋' : fc.fromUser }}</b>：「{{ fc.feeling }}」
              </p>
            </div>
          </div>
        </div>

        <!-- F230 新建小日子表单 -->
        <div class="inline-form founded-create" data-testid="couple-cere-founded-create">
          <el-input v-model="foundedNameDraft" maxlength="60" placeholder="给小日子起个名字（如：我们搬家纪念日）" style="max-width: 220px" data-testid="couple-cere-founded-name" />
          <el-date-picker
            v-model="foundedDayDraft"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="起始日"
            style="width: 140px"
            data-testid="couple-cere-founded-day"
          />
          <el-checkbox v-model="foundedRepeatDraft" data-testid="couple-cere-founded-repeat">每年重复</el-checkbox>
          <el-button size="small" type="primary" data-testid="couple-cere-founded-submit" @click="onAddFounded">建国 🎂</el-button>
        </div>
      </template>
      <p v-else class="empty-line">小日子还在册…</p>
    </CoupleCollapsible>

    <!-- F234/F235 保险柜 + 续约卡 -->
    <CoupleCollapsible testid="couple-cere-vault">
      <template #title>🔐 爱情保险柜 <span class="sub">每月互夸一句当保费，交齐了才生效</span></template>
      <template v-if="o">
        <div class="policy-quote">
          <p class="quote-line" data-testid="couple-cere-policy-mine">🙋 我交的保费：{{ o.policy.mine || '还没夸，TA 的好要大声说出来 💝' }}</p>
          <p class="quote-line" data-testid="couple-cere-policy-partner">💕 TA 交的保费：{{ o.policy.partner || 'TA 还没交，悄悄等一句夸奖' }}</p>
        </div>
        <div class="inline-form">
          <el-input v-model="policyDraft" maxlength="140" placeholder="本月夸 TA 的一句（写了还能改）" data-testid="couple-cere-policy-quote" />
          <el-button size="small" type="primary" data-testid="couple-cere-policy-submit" @click="onPolicy">{{ o.policy.mine ? '改写本月保费 ✍️' : '交本月保费 💝' }}</el-button>
        </div>
        <div class="milestone-row" data-testid="couple-cere-milestones">
          <span class="field-label">已交齐 <b data-testid="couple-cere-policy-paid">{{ o.policy.paidMonths }}</b> 个月：</span>
          <span
            v-for="m in POLICY_MILESTONES"
            :key="m"
            class="milestone-chip"
            :class="{ 'is-lit': o.policy.paidMilestones.includes(m) }"
            :data-testid="`couple-cere-milestone-${m}`"
          >{{ o.policy.paidMilestones.includes(m) ? '🎁' : '🔒' }} 满 {{ m }} 个月</span>
          <span v-if="o.policy.monthsToNext != null" class="flash-by" data-testid="couple-cere-policy-next">再交齐 {{ o.policy.monthsToNext }} 个月 payout 一张愿望券</span>
        </div>

        <div class="renew-block" data-testid="couple-cere-renew">
          <p class="section-head">🖋️ 续约仪式 <span class="sub">每 100 天和周年各一次，签一句「我还是选你」</span></p>
          <p v-if="o.renew.dueToday" class="renew-due" data-testid="couple-cere-renew-due">📅 今天就是续约日！双方都签才算又互相选了一次</p>
          <p v-else class="renew-count" data-testid="couple-cere-renew-countdown">下次续约在 {{ o.renew.anchorDay }} · 还有 {{ o.renew.daysToNext }} 天，先把话想好</p>
          <div class="sign-row">
            <span class="sign-chip" :class="{ 'is-lit': o.renew.mineSigned }" data-testid="couple-cere-renew-mine">{{ o.renew.mineSigned ? '✍️ 我签了' : '我还未签' }}</span>
            <span class="sign-chip" :class="{ 'is-lit': o.renew.partnerSigned }" data-testid="couple-cere-renew-partner">{{ o.renew.partnerSigned ? '✍️ TA 签了' : 'TA 还未签' }}</span>
          </div>
          <div v-if="o.renew.dueToday" class="inline-form">
            <el-input v-model="renewDraft" maxlength="140" placeholder="签一句真心话（如：下辈子也提前排队）" data-testid="couple-cere-renew-line" />
            <el-button size="small" type="primary" data-testid="couple-cere-renew-submit" @click="onRenew">签字续约 🖋️</el-button>
          </div>
          <div class="scroll-box" data-testid="couple-cere-renew-scroll">
            <p v-if="!o.renew.scroll.length" class="empty-line">长卷还是空的，等第一个续约日落笔 📜</p>
            <p v-for="(l, i) in o.renew.scroll" :key="`${l.anchorDay}-${l.fromUser}`" class="scroll-line" :data-testid="`couple-cere-renew-entry-${i}`">
              <span class="flash-by">{{ l.anchorDay }}</span>
              <b>{{ l.mine ? '我 🙋' : l.fromUser }}</b>：「{{ l.line }}」
            </p>
          </div>
        </div>
      </template>
      <p v-else class="empty-line">保险柜还在上锁…</p>
    </CoupleCollapsible>

    <!-- F236 愿望券本卡 -->
    <CoupleCollapsible testid="couple-cere-coupon" :empty="!!o && !o.couponsOpen.length && !o.couponsUsed.length">
      <template #title>🎫 愿望券本 <span class="sub">券面自拟，兑现一次撕一张</span></template>
      <template v-if="o">
        <div class="inline-form">
          <el-input v-model="couponDraft" maxlength="80" placeholder="写一张愿望券（如：无理由换我背你走一段）" data-testid="couple-cere-coupon-title" />
          <el-button size="small" type="primary" data-testid="couple-cere-coupon-submit" @click="onIssueCoupon">发券 🎫</el-button>
        </div>
        <p v-if="!o.couponsOpen.length" class="empty-line">券本里没有待兑现的愿望，发一张试试 🎫</p>
        <div class="coupon-list">
          <p v-for="c in o.couponsOpen" :key="c.id" class="coupon-line" :data-testid="`couple-cere-coupon-${c.id}`">
            <b>{{ c.title }}</b>
            <span class="flash-by">{{ c.issuer }} 发来{{ c.ref ? ' · 保险柜 payout 🎁' : '' }}</span>
            <el-button size="small" type="primary" plain :data-testid="`couple-cere-coupon-use-${c.id}`" @click="onUseCoupon(c.id)">兑现这张 🎉</el-button>
          </p>
        </div>
        <p class="used-toggle-line">
          <el-button size="small" plain data-testid="couple-cere-coupon-used-toggle" @click="usedOpen = !usedOpen">
            {{ usedOpen ? '收起' : '翻看' }}已兑现（{{ o.couponsUsed.length }}）{{ usedOpen ? ' ▲' : ' ▼' }}
          </el-button>
        </p>
        <div v-if="usedOpen" class="coupon-used" data-testid="couple-cere-coupon-used">
          <p v-if="!o.couponsUsed.length" class="empty-line">还没有兑现记录，愿望都排在路上</p>
          <p v-for="c in o.couponsUsed" :key="c.id" class="coupon-line is-used" :data-testid="`couple-cere-coupon-used-${c.id}`">
            <s>{{ c.title }}</s>
            <span class="flash-by">{{ c.usedBy ? `${c.usedBy} 兑现` : '已兑现' }} ✅</span>
          </p>
        </div>
      </template>
      <p v-else class="empty-line">券本还在装订…</p>
    </CoupleCollapsible>

    <!-- F239/F238 体感 + 加冕卡 -->
    <CoupleCollapsible testid="couple-cere-feel">
      <template #title>🫧 今日体感 <span class="sub">这一天的滋味，一人留一句</span></template>
      <template v-if="o">
        <div class="feel-quote">
          <p class="feel-line" data-testid="couple-cere-feel-mine">🙋 我的此刻：{{ mineRecap?.feeling || '还没写，此刻是什么滋味？' }}</p>
          <p class="feel-line" data-testid="couple-cere-feel-partner">💕 TA 的此刻：{{ partnerRecap?.feeling || 'TA 还没写，留一句引一引' }}</p>
        </div>
        <div v-if="o.recapsLastYear.length" class="lastyear-box" data-testid="couple-cere-feel-lastyear">
          <p class="section-head">🕰️ 去年今日对照</p>
          <p v-for="(r, i) in o.recapsLastYear" :key="i" class="feel-line flash-by" :data-testid="`couple-cere-feel-lastyear-${i}`">
            <b>{{ r.mine ? '我 🙋' : r.fromUser }}</b>（{{ r.day.slice(5) }}）：「{{ r.feeling }}」
          </p>
        </div>
        <div class="inline-form">
          <el-input v-model="feelingDraft" maxlength="140" placeholder="此刻感觉一句话（如：闹哄哄的，但心跳是安静的）" data-testid="couple-cere-feeling" />
          <el-button size="small" type="primary" data-testid="couple-cere-feeling-submit" @click="onRecap">记下此刻 🫧</el-button>
        </div>
        <div v-if="o.crown" class="crown-box" data-testid="couple-cere-crown">
          <p class="section-head">👑 {{ o.crown.year }} 年度加冕 <span class="sub">最热闹的小日子前三甲</span></p>
          <p class="crown-open" data-testid="couple-cere-crown-open">{{ o.crown.open }}</p>
          <p v-for="(t, i) in o.crown.top" :key="t.name" class="crown-item" :data-testid="`couple-cere-crown-item-${t.name}`">
            {{ CROWN_MEDALS[i] ?? '🏅' }} <b>{{ t.name }}</b> <span class="flash-by">勾了 {{ t.marks }} 次</span>
          </p>
        </div>
      </template>
      <p v-else class="empty-line">体感还在收集…</p>
    </CoupleCollapsible>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { ceremonyApi } from '@/api/couple'
import type { CoupleCerAlmanacVO, CoupleCerChronicleVO, CoupleCerFoundedVO, CoupleCerOverviewVO } from '@/types'
import CoupleCollapsible from './CoupleCollapsible.vue'

const o = ref<CoupleCerOverviewVO | null>(null)

/** 与后端 RITUAL_MAX 对齐：每个小日子最多 3 条过法 */
const RITUAL_MAX = 3
/** 与后端 POLICY_MILESTONES 对齐：交齐 3/6/12 个月自动 payout 愿望券 */
const POLICY_MILESTONES = [3, 6, 12]
/** F231 倒数列表 kind 徽标 */
const KIND_META: Record<CoupleCerAlmanacVO['kind'], { label: string }> = {
  founded: { label: '小日子' },
  anniversary: { label: '纪念日' },
  countdown: { label: '倒数日' },
}
/** F238 加冕三甲奖牌 */
const CROWN_MEDALS = ['🥇', '🥈', '🥉']

// ---- 展开态与史册懒加载 ----
const ritualOpen = reactive<Record<string, boolean>>({})
const chronicleOpen = reactive<Record<string, boolean>>({})
const chronicles = reactive<Record<string, CoupleCerChronicleVO | undefined>>({})

// ---- 草稿 ----
const foundedNameDraft = ref('')
const foundedDayDraft = ref(todayStr())
const foundedRepeatDraft = ref(true)
const ritualDrafts = reactive<Record<string, string>>({})
const policyDraft = ref('')
const renewDraft = ref('')
const couponDraft = ref('')
const feelingDraft = ref('')
const usedOpen = ref(false)

function todayStr() {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${dd}`
}

function onError(e: unknown, fallback: string) {
  ElMessage.error(e instanceof Error ? e.message : fallback)
}

/** 史册某小日子的一年一页列表（未加载/加载失败给空数组） */
function chroniclePages(foundedId: string) {
  return chronicles[foundedId]?.pages ?? []
}

/** 今日体感里我和 TA 各自的句子 */
const mineRecap = computed(() => o.value?.recapsToday.find((r) => r.mine) ?? null)
const partnerRecap = computed(() => o.value?.recapsToday.find((r) => !r.mine) ?? null)

function toggleRituals(foundedId: string) {
  ritualOpen[foundedId] = !ritualOpen[foundedId]
}

/** F237 史册：点开才拉，合上再开重新拉（保持最新） */
async function toggleChronicle(foundedId: string) {
  chronicleOpen[foundedId] = !chronicleOpen[foundedId]
  if (chronicleOpen[foundedId]) {
    try {
      chronicles[foundedId] = (await ceremonyApi.cereChronicle(foundedId)) ?? undefined
    } catch (e) {
      chronicles[foundedId] = undefined
      onError(e, '翻史册失败')
    }
  }
}

// ---- F230 新建/删除小日子 ----
async function onAddFounded() {
  if (!foundedNameDraft.value.trim()) {
    ElMessage.warning('先给小日子起个名字吧 🎂')
    return
  }
  if (!foundedDayDraft.value) {
    ElMessage.warning('起始日也得挑一个 📅')
    return
  }
  try {
    o.value =
      (await ceremonyApi.cereAddFounded(foundedNameDraft.value.trim(), foundedDayDraft.value, foundedRepeatDraft.value)) ?? o.value
    foundedNameDraft.value = ''
    ElMessage.success('小日子建国啦，以后年年都理直气壮地庆祝 🎂')
  } catch (e) {
    onError(e, '新建小日子失败')
  }
}

async function onRemoveFounded(f: CoupleCerFoundedVO) {
  try {
    o.value = (await ceremonyApi.cereRemoveFounded(f.id)) ?? o.value
    delete ritualOpen[f.id]
    delete chronicleOpen[f.id]
    delete chronicles[f.id]
    ElMessage.success(`「${f.name}」从日历上退册了，回忆还在史册里`)
  } catch (e) {
    onError(e, '删除小日子失败')
  }
}

// ---- F232 过法卡增删 ----
async function onAddRitual(foundedId: string) {
  const content = (ritualDrafts[foundedId] ?? '').trim()
  if (!content) {
    ElMessage.warning('庆祝方式写点具体的动作 🎊')
    return
  }
  try {
    o.value = (await ceremonyApi.cereAddRitual(foundedId, content)) ?? o.value
    ritualDrafts[foundedId] = ''
    ritualOpen[foundedId] = true
    ElMessage.success('过法卡写上啦，日子有章程了 🎊')
  } catch (e) {
    onError(e, '写过法卡失败')
  }
}

async function onRemoveRitual(id: string) {
  try {
    o.value = (await ceremonyApi.cereRemoveRitual(id)) ?? o.value
    ElMessage.success('这张过法卡划掉了')
  } catch (e) {
    onError(e, '划掉过法卡失败')
  }
}

// ---- F233 庆祝打卡（当日幂等） ----
async function onMark(id: string) {
  try {
    o.value = (await ceremonyApi.cereMark(id)) ?? o.value
    ElMessage.success('勾上啦 ✓ 这一天被认真对待了')
  } catch (e) {
    onError(e, '打勾失败')
  }
}

// ---- F234 交本月保费（夸 TA 一句，可改写） ----
async function onPolicy() {
  if (!policyDraft.value.trim()) {
    ElMessage.warning('保费是夸 TA 的一句话，别空着 💝')
    return
  }
  try {
    o.value = (await ceremonyApi.cerePolicy(policyDraft.value.trim())) ?? o.value
    ElMessage.success('本月保费交齐一半啦，好日子要一本万利 🔐')
  } catch (e) {
    onError(e, '交保费失败')
  }
}

// ---- F235 续约日签字 ----
async function onRenew() {
  if (!renewDraft.value.trim()) {
    ElMessage.warning('签一句真心话再落笔 🖋️')
    return
  }
  try {
    o.value = (await ceremonyApi.cereRenew(renewDraft.value.trim())) ?? o.value
    renewDraft.value = ''
    ElMessage.success('签好啦，下一个 100 天继续选你 🖋️')
  } catch (e) {
    // 非续约日提交：后端 400 带剩余天数，直接把 message 透出来
    onError(e, '签字失败')
  }
}

// ---- F236 发券 / 核销 ----
async function onIssueCoupon() {
  if (!couponDraft.value.trim()) {
    ElMessage.warning('券面写点什么愿望吧 🎫')
    return
  }
  try {
    o.value = (await ceremonyApi.cereIssueCoupon(couponDraft.value.trim())) ?? o.value
    couponDraft.value = ''
    ElMessage.success('愿望券发出去啦，等着被兑现 🎫')
  } catch (e) {
    onError(e, '发券失败')
  }
}

async function onUseCoupon(id: string) {
  try {
    o.value = (await ceremonyApi.cereUseCoupon(id)) ?? o.value
    ElMessage.success('愿望兑现 🎉 这张券完成了它的使命')
  } catch (e) {
    onError(e, '核销失败')
  }
}

// ---- F239 此刻感觉（day 空=今天） ----
async function onRecap() {
  if (!feelingDraft.value.trim()) {
    ElMessage.warning('此刻感觉写一句话吧 🫧')
    return
  }
  try {
    o.value = (await ceremonyApi.cereRecap(feelingDraft.value.trim())) ?? o.value
    feelingDraft.value = ''
    ElMessage.success('今天的滋味记下啦，明年今天来对照 🫧')
  } catch (e) {
    onError(e, '记体感失败')
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
  const overview = await safeLoad(ceremonyApi.cereOverview, null)
  o.value = overview
  if (overview) {
    // 回填我的本月保费与此刻感觉，方便改写
    if (overview.policy.mine) policyDraft.value = overview.policy.mine
    const mine = overview.recapsToday.find((r) => r.mine)
    if (mine) feelingDraft.value = mine.feeling
  }
})
</script>

<style scoped>
.couple-ceremony { display: flex; flex-direction: column; gap: 14px; --collapse-title-color: #c0392b; }
.card { background: var(--im-panel-bg, #fff); border-radius: 10px; padding: 14px 16px; border: 1px solid var(--im-border, #ebeef5); }
.sub { font-size: 12px; color: var(--im-muted, #909399); font-weight: normal; margin-left: 6px; }
.section-head { margin: 0 0 4px; font-size: 13px; font-weight: bold; color: var(--im-text, #303133); }
.inline-form { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 8px; }
.inline-form .el-input { flex: 1; min-width: 160px; }
.empty-line { margin: 8px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.flash-by { font-size: 11px; color: var(--im-muted, #909399); margin-right: 6px; }
.field-label { font-size: 13px; color: var(--im-muted, #909399); }
/* 黄历头牌：金红庆典感 */
.yi-ji { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 8px; }
.yi-line, .ji-line { margin: 0; font-size: 13px; padding: 6px 12px; border-radius: 8px; }
.yi-line { color: #b8860b; background: rgba(212, 175, 55, 0.12); border: 1px solid rgba(212, 175, 55, 0.4); }
.ji-line { color: #c0392b; background: rgba(192, 57, 43, 0.08); border: 1px solid rgba(192, 57, 43, 0.3); }
.almanac-list { margin-top: 4px; }
.almanac-line { margin: 4px 0; font-size: 13px; color: var(--im-text, #303133); display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.kind-badge { font-size: 11px; padding: 1px 8px; border-radius: 10px; color: #fff; }
.kind-founded { background: #c0392b; }
.kind-anniversary { background: #f56c6c; }
.kind-countdown { background: #b8860b; }
.days-left { font-size: 12px; color: #b8860b; font-weight: bold; }
.nudge-box { margin-top: 8px; padding: 8px 10px; border-radius: 8px; background: rgba(192, 57, 43, 0.06); }
.nudge-line { margin: 2px 0; font-size: 13px; color: #c0392b; }
/* 小日子 */
.founded-item { margin-top: 10px; padding-top: 8px; border-top: 1px dashed var(--im-border, #ebeef5); }
.founded-item:first-of-type { border-top: none; }
.founded-head { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.founded-name { color: #c0392b; font-size: 14px; }
.founded-next { font-size: 13px; color: var(--im-text, #303133); }
.founded-next.passed { color: var(--im-muted, #909399); }
.edition-badge { font-size: 11px; color: #b8860b; background: rgba(212, 175, 55, 0.12); padding: 1px 6px; border-radius: 8px; margin-left: 4px; }
.ritual-box { margin: 6px 0 0 12px; }
.ritual-line { margin: 4px 0; font-size: 13px; color: var(--im-text, #303133); display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.ritual-line .is-done { text-decoration: line-through; color: var(--im-muted, #909399); }
.chronicle-box { margin: 6px 0 0 12px; padding: 6px 10px; border-left: 3px solid #b8860b; background: var(--im-bg, #fafafa); border-radius: 0 8px 8px 0; }
.chronicle-page { margin-top: 6px; }
.chronicle-year { margin: 0; font-size: 13px; color: #b8860b; font-weight: bold; }
.chronicle-feel { margin: 2px 0 0 14px; font-size: 12px; color: var(--im-text, #303133); }
.founded-create { border-top: 1px dashed var(--im-border, #ebeef5); margin-top: 12px; padding-top: 10px; }
/* 保险柜与续约 */
.policy-quote { margin-bottom: 4px; }
.quote-line { margin: 4px 0; font-size: 13px; color: var(--im-text, #303133); background: var(--im-bg, #fafafa); border-radius: 8px; padding: 6px 10px; }
.milestone-row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin-top: 8px; }
.milestone-row b { color: #b8860b; }
.milestone-chip { font-size: 12px; color: var(--im-muted, #909399); padding: 2px 8px; border-radius: 10px; background: var(--im-bg, #fafafa); border: 1px solid var(--im-border, #ebeef5); }
.milestone-chip.is-lit { color: #b8860b; border-color: rgba(212, 175, 55, 0.5); background: rgba(212, 175, 55, 0.12); }
.renew-block { margin-top: 12px; padding-top: 10px; border-top: 1px dashed var(--im-border, #ebeef5); }
.renew-due { margin: 4px 0; font-size: 13px; color: #c0392b; font-weight: bold; }
.renew-count { margin: 4px 0; font-size: 13px; color: var(--im-muted, #909399); }
.sign-row { display: flex; gap: 10px; flex-wrap: wrap; margin: 4px 0; }
.sign-chip { font-size: 12px; color: var(--im-muted, #909399); padding: 2px 8px; border-radius: 6px; background: var(--im-bg, #fafafa); }
.sign-chip.is-lit { color: #67c23a; background: rgba(103, 194, 58, 0.1); }
.scroll-box { margin-top: 6px; }
.scroll-line { margin: 3px 0; font-size: 13px; color: var(--im-text, #303133); }
/* 愿望券 */
.coupon-list { margin-top: 4px; }
.coupon-line { margin: 5px 0; font-size: 13px; color: var(--im-text, #303133); display: flex; gap: 8px; align-items: center; flex-wrap: wrap; padding: 6px 10px; border: 1px dashed rgba(192, 57, 43, 0.35); border-radius: 8px; background: rgba(192, 57, 43, 0.04); }
.coupon-line b { color: #c0392b; }
.coupon-line.is-used { border-style: solid; opacity: 0.75; }
.used-toggle-line { margin: 8px 0 0; }
/* 体感与加冕 */
.feel-quote { margin-bottom: 4px; }
.feel-line { margin: 4px 0; font-size: 13px; color: var(--im-text, #303133); background: var(--im-bg, #fafafa); border-radius: 8px; padding: 6px 10px; }
.lastyear-box { margin-top: 8px; padding-top: 8px; border-top: 1px dashed var(--im-border, #ebeef5); }
.crown-box { margin-top: 12px; padding: 10px 12px; border-radius: 10px; background: linear-gradient(135deg, rgba(212, 175, 55, 0.14), rgba(192, 57, 43, 0.08)); border: 1px solid rgba(212, 175, 55, 0.45); }
.crown-open { margin: 4px 0; font-size: 13px; color: #b8860b; }
.crown-item { margin: 3px 0; font-size: 13px; color: var(--im-text, #303133); }
.crown-item b { color: #c0392b; }
</style>

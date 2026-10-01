<template>
  <div class="couple-almanac" data-testid="couple-almanac">
    <!-- F250 节气跟风 + F251 节气过法 + F255 节气手账：今日岁时头牌 -->
    <CoupleCollapsible testid="couple-alm-today">
      <template #title>🌿 今日节气 <span class="sub">跟着时令过日子——跟风不丢人，一起过才浪漫</span></template>
      <template v-if="t">
        <!-- F258 放空日今日态：挡打卡提示直接展示，不点按钮也知道今天不用打卡 -->
        <div v-if="t.normal.today" class="normal-box" data-testid="couple-alm-normal-today">
          <p class="normal-head">🛋️ 今日什么都不做</p>
          <p class="normal-line">这是我们俩约好的放空日——节气跟风、过法打勾今天一律挡下，仪式感请绕行 🚪</p>
        </div>

        <!-- 有节气日：跟风状态 + 双晒话 -->
        <template v-if="t.term.term">
          <p class="term-head">
            今日节气 <b class="term-name" data-testid="couple-alm-term">{{ t.term.term }}</b>
            <span class="ganzhi-chip" data-testid="couple-alm-day">{{ t.day }}</span>
          </p>
          <p class="check-status">
            <span v-if="myCheck" class="lit-chip" data-testid="couple-alm-check-mine">我跟风了 ✅</span>
            <span v-else class="dim-chip" data-testid="couple-alm-check-mine">我还没跟风</span>
            <span v-if="partnerCheck" class="lit-chip" data-testid="couple-alm-check-partner">TA 也跟风了 💕</span>
            <span v-else class="dim-chip" data-testid="couple-alm-check-partner">TA 还没跟风 ⏳</span>
            <span v-if="bothChecked" class="both-badge" data-testid="couple-alm-check-both">这个节气我们都在场 🎋</span>
          </p>
          <div v-if="t.term.todayChecks.length" class="note-wall" data-testid="couple-alm-check-notes">
            <p v-for="c in t.term.todayChecks" :key="c.fromUser" class="check-line" :data-testid="`couple-alm-check-note-${c.fromUser}`">
              <span class="who-chip">{{ c.mine ? '我 🙋' : '💕 TA' }}</span>
              <span class="check-text">{{ c.note || '没留话，但人到了 🌿' }}</span>
            </p>
          </div>
          <div v-if="!t.normal.today && !myCheck" class="inline-form">
            <el-input v-model="checkNote" maxlength="140" placeholder="跟风顺便晒一句（可不写）" data-testid="couple-alm-check-note" />
            <el-button size="small" type="primary" data-testid="couple-alm-check-btn" @click="onCheck">跟上 🌿</el-button>
          </div>
        </template>

        <!-- 非节气日：下个节气倒数 -->
        <template v-else>
          <p v-if="t.term.nextTerm" class="next-line" data-testid="couple-alm-next">
            今天不是节气日，那就等着——下个节气 <b>「{{ t.term.nextTerm }}」</b>
            <span class="count-chip" data-testid="couple-alm-next-days">还有 {{ t.term.nextDays ?? '—' }} 天 🌱</span>
          </p>
          <p v-else class="empty-line">日历上暂时找不到下个节气，先把今天过好 🌱</p>
        </template>

        <!-- F251 过法卡：节气当日逐条打勾 -->
        <div class="block">
          <p class="section-head">🧂 这个节气的过法（当天逐条打勾）</p>
          <p v-if="!t.rituals.length" class="empty-line">还没给节气定过法，先写一条最小的：吃什么、做什么、几点睡 🧂</p>
          <div class="ritual-list">
            <p v-for="r in t.rituals" :key="r.id" class="ritual-line" :class="{ 'is-done': done(r) }" :data-testid="`couple-alm-ritual-${r.id}`">
              <span class="done-chip" :data-testid="`couple-alm-ritual-done-${r.id}`">{{ done(r) ? '✅' : '⬜' }}</span>
              <b class="ritual-text">{{ r.content }}</b>
              <span class="who-chip">{{ r.mine ? '我写的 🙋' : '💕 TA 写的' }}</span>
              <template v-if="!t.normal.today">
                <el-button
                  v-if="!done(r)"
                  size="small"
                  type="success"
                  plain
                  :data-testid="`couple-alm-mark-${r.id}`"
                  @click="onMark(r)"
                >今天做到了 ✅</el-button>
              </template>
              <el-button
                v-if="r.mine"
                size="small"
                text
                type="danger"
                :data-testid="`couple-alm-ritual-del-${r.id}`"
                @click="onRemoveRitual(r)"
              >划掉</el-button>
            </p>
          </div>
          <div class="inline-form">
            <el-input v-model="ritualTerm" maxlength="4" placeholder="节气名（如 霜降）" style="max-width: 130px" data-testid="couple-alm-ritual-term" />
            <el-input v-model="ritualContent" maxlength="80" placeholder="这个节气我们怎么过（≤80 字）" data-testid="couple-alm-ritual-content" />
            <el-button size="small" type="primary" data-testid="couple-alm-ritual-submit" @click="onAddRitual">记进黄历 🧾</el-button>
          </div>
        </div>

        <!-- F255 节气手账：一年一本，一笔一件小事 -->
        <div class="block">
          <p class="section-head">📔 {{ t.year }} 年节气手账（一人一笔，本人可改写）</p>
          <p v-if="!t.notes.length" class="empty-line">手账还是新的，等第一个节气落笔 📔</p>
          <div class="note-list">
            <p v-for="n in t.notes" :key="n.term" class="note-line" :data-testid="`couple-alm-note-${n.term}`">
              <b class="note-term">{{ n.term }}</b>
              <span class="note-mine">{{ n.mine ? `我：${n.mine}` : '' }}</span>
              <span class="note-partner">{{ n.partner ? `TA：${n.partner}` : '' }}</span>
              <el-button size="small" text type="primary" :data-testid="`couple-alm-note-pick-${n.term}`" @click="pickNote(n)">
                {{ n.mine ? '改写 ✍️' : '补一笔 ✍️' }}
              </el-button>
            </p>
          </div>
          <div class="inline-form">
            <el-input v-model="noteTerm" maxlength="4" placeholder="节气名" style="max-width: 130px" data-testid="couple-alm-note-term" />
            <el-input v-model="noteText" maxlength="140" placeholder="这个节气发生的一件小事（≤140 字）" data-testid="couple-alm-note-text" />
            <el-button size="small" type="primary" data-testid="couple-alm-note-submit" @click="onNote">落笔 📔</el-button>
          </div>
        </div>
      </template>
      <p v-else class="empty-line">老黄历还在印刷坊里晾着…</p>
    </CoupleCollapsible>

    <!-- F252 择吉日 + F253 农历换算 -->
    <CoupleCollapsible testid="couple-alm-lucky" :empty="!!t && !t.lucky.length && !t.lunar.length">
      <template #title>🧧 择吉日 <span class="sub">大事不瞎定日子，我们自己翻黄历</span></template>
      <template v-if="t">
        <div class="inline-form">
          <el-date-picker
            v-model="luckyDay"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="挑哪天"
            style="width: 140px"
            data-testid="couple-alm-lucky-day"
          />
          <el-input v-model="luckyMatter" maxlength="60" placeholder="要办的喜事（如：领证 / 搬新家）" data-testid="couple-alm-lucky-matter" />
          <el-button size="small" type="primary" data-testid="couple-alm-lucky-submit" @click="onLucky">择这个日子 🧧</el-button>
        </div>
        <p v-if="!t.lucky.length" class="empty-line">近期还没有择好的吉日，挑一个把大事定下来 🧧</p>
        <div class="lucky-list">
          <p v-for="l in t.lucky" :key="l.id" class="lucky-line" :class="{ 'is-ok': l.confirmed }" :data-testid="`couple-alm-lucky-${l.id}`">
            <b class="lucky-day">{{ l.day }}</b>
            <span class="lucky-matter">{{ l.matter }}</span>
            <span class="who-chip">{{ l.mine ? '我择的 🙋' : '💕 TA 择的' }}</span>
            <span class="lucky-comment" :data-testid="`couple-alm-lucky-comment-${l.id}`">{{ l.comment }}</span>
            <span v-if="l.confirmed" class="both-badge" :data-testid="`couple-alm-lucky-ok-${l.id}`">双盖章 🤝</span>
            <el-button
              v-else-if="!l.mine"
              size="small"
              type="primary"
              plain
              :data-testid="`couple-alm-lucky-confirm-${l.id}`"
              @click="onLuckyConfirm(l)"
            >我盖章 🧧</el-button>
            <span v-else class="wait-chip" :data-testid="`couple-alm-lucky-wait-${l.id}`">等 TA 盖章确认 ⏳</span>
          </p>
        </div>
        <div class="block">
          <p class="section-head">🌙 农历生日换算（农历的记到农历，公历的顺便报一报）</p>
          <p v-if="!t.lunar.length" class="empty-line">还没有农历纪念日到换算台，去倒数日里加一个农历的吧 🌙</p>
          <div class="lunar-list">
            <p v-for="l in t.lunar" :key="l.id" class="lunar-line" :data-testid="`couple-alm-lunar-${l.id}`">
              <b>{{ l.title }}</b>
              <span class="lunar-md">农历 {{ lunarMdText(l.lunarMd) }}</span>
              <span class="solar-chip" :data-testid="`couple-alm-lunar-next-${l.id}`">{{ l.nextSolars.length ? `往后公历：${l.nextSolars.join('、')}` : '近两年没有对应的公历日' }}</span>
            </p>
          </div>
        </div>
      </template>
      <p v-else class="empty-line">吉日台账还在装订…</p>
    </CoupleCollapsible>

    <!-- F254 节日家档：八个节日各写一份过法，到日拆盲盒 -->
    <CoupleCollapsible testid="couple-alm-festival" :empty="!!t && !t.festivals.length">
      <template #title>🏮 节日家档 <span class="sub">八个节日各交一份卷子，到日互相拆盲盒</span></template>
      <template v-if="t">
        <p v-if="!t.festivals.length" class="empty-line">今年没有可归档的节日（周年月要先把纪念日填上）🏮</p>
        <div class="festival-list">
          <p v-for="f in t.festivals" :key="f.key" class="festival-line" :data-testid="`couple-alm-festival-${f.key}`">
            <b class="festival-label">{{ f.label }}</b>
            <span class="festival-day">{{ f.day }}</span>
            <span class="plan-text" :data-testid="`couple-alm-festival-mine-${f.key}`">{{ f.mine ? `我：${f.mine}` : '我：还没交卷' }}</span>
            <span class="plan-text is-partner" :data-testid="`couple-alm-festival-partner-${f.key}`">{{ f.partner ? `TA：${f.partner}` : 'TA：还没交卷' }}</span>
            <el-button size="small" text type="primary" :data-testid="`couple-alm-festival-pick-${f.key}`" @click="pickFestival(f)">
              {{ f.mine ? '改写我的方案 ✍️' : '交我的方案 ✍️' }}
            </el-button>
          </p>
        </div>
        <div class="festival-form" data-testid="couple-alm-festival-form">
          <p class="picked-line">正在写：<b data-testid="couple-alm-festival-picked">{{ pickedLabel }}</b></p>
          <div class="inline-form">
            <el-input v-model="festivalYear" maxlength="4" placeholder="年份 yyyy" style="max-width: 110px" data-testid="couple-alm-festival-year" />
            <el-input
              v-model="festivalPlan"
              type="textarea"
              :rows="2"
              maxlength="200"
              show-word-limit
              placeholder="这个节日我们怎么过（吃啥/去哪/几点，≤200 字）"
              data-testid="couple-alm-festival-plan"
            />
            <el-button size="small" type="primary" data-testid="couple-alm-festival-submit" @click="onFestival">归档 🏮</el-button>
          </div>
        </div>
      </template>
      <p v-else class="empty-line">节日档案柜还空着…</p>
    </CoupleCollapsible>

    <!-- F257 长假愿望：倒数 + 两人共写一段 -->
    <CoupleCollapsible testid="couple-alm-holiday">
      <template #title>🧳 长假愿望 <span class="sub">放假前先把「想一起干什么」写下来，别又躺三天</span></template>
      <template v-if="t">
        <template v-if="t.holiday">
          <p class="holiday-head" data-testid="couple-alm-holiday-name">
            <b>{{ t.holiday.name }}</b>
            <span class="festival-day">{{ t.holiday.day }}</span>
            <span class="count-chip" data-testid="couple-alm-holiday-count">还有 {{ t.holiday.daysLeft ?? '—' }} 天 🧳</span>
          </p>
          <div v-if="wishParts.length" class="wish-box" data-testid="couple-alm-holiday-wish">
            <p class="wish-line" data-testid="couple-alm-holiday-wish-first">
              <span class="who-chip">✍️ 首写：{{ t.holiday.wishedBy || '还没人写' }}</span>
              <span class="wish-text">{{ wishParts[0] }}</span>
            </p>
            <p v-if="wishParts.length > 1" class="wish-line" data-testid="couple-alm-holiday-wish-appended">
              <span class="who-chip">✍️ 补写：{{ t.holiday.appendedBy || 'TA' }}</span>
              <span class="wish-text">{{ wishParts[1] }}</span>
            </p>
            <p v-if="wishFull" class="both-badge" data-testid="couple-alm-holiday-wish-full">两段愿望都到位，行程收好等出发 🧳</p>
          </div>
          <p v-else class="empty-line">{{ t.holiday.name }} 的过法还空着，谁先写谁得意 ✍️</p>
          <div class="wish-form">
            <el-input
              v-model="wishDraft"
              type="textarea"
              :rows="2"
              maxlength="200"
              show-word-limit
              :placeholder="wishParts.length ? '再补一句（会接在 TA 那段后面）' : '这几天最想一起干的一件事'"
              data-testid="couple-alm-holiday-wish-input"
            />
            <div class="inline-form">
              <el-button size="small" type="primary" data-testid="couple-alm-holiday-submit" @click="onWish">
                {{ wishParts.length ? '补写一段 ✍️' : '写下愿望 ✍️' }}
              </el-button>
              <span v-if="!wishParts.length" class="flash-by">首写的人定调子，补写的人接话 👇</span>
            </div>
          </div>
        </template>
        <p v-else class="empty-line" data-testid="couple-alm-holiday-none">最近 60 天没有法定长假，先把普通日子过稳 🛋️</p>
      </template>
      <p v-else class="empty-line">假期日历还在贴…</p>
    </CoupleCollapsible>

    <!-- F256 生肖年运 + F259 一年小结 + F258 放空日提报 -->
    <CoupleCollapsible testid="couple-alm-year">
      <template #title>🐉 年运与小结 <span class="sub">生肖领一句年运，年底看看这一年过得怎么样</span></template>
      <template v-if="t">
        <div class="zodiac-box" data-testid="couple-alm-zodiac">
          <div class="inline-form">
            <el-button size="small" type="primary" plain :loading="zodiacLoading" data-testid="couple-alm-zodiac-btn" @click="onZodiac">
              {{ zodiac ? '换一年再看看 🐉' : '一键领生肖年运 🐉' }}
            </el-button>
            <span class="flash-by">生肖按双方生日算，没填生日会写「未填生日」</span>
          </div>
          <template v-if="zodiac">
            <p class="zodiac-line">
              <span class="zodiac-chip" data-testid="couple-alm-zodiac-mine">我：{{ zodiac.zodiacMine }}</span>
              <span class="zodiac-chip" data-testid="couple-alm-zodiac-partner">TA：{{ zodiac.zodiacPartner }}</span>
            </p>
            <p class="fortune-line" data-testid="couple-alm-zodiac-fortune">「{{ zodiac.fortune }}」</p>
          </template>
        </div>

        <div class="block">
          <p class="section-head">🧾 一年日子小结（长卷慢慢拉）</p>
          <div class="inline-form">
            <el-input v-model="yearlyYear" maxlength="4" placeholder="年份 yyyy" style="max-width: 110px" data-testid="couple-alm-year-input" />
            <el-button size="small" type="primary" plain :loading="yearlyLoading" data-testid="couple-alm-yearly-btn" @click="onYearly">拉开这一年的日子 🧧</el-button>
          </div>
          <template v-if="yearVo">
            <div class="year-stats" data-testid="couple-alm-yearly-stats">
              <span>{{ yearVo.year }} 年：跟风 <b data-testid="couple-alm-checks-done">{{ yearVo.checksDone }}</b> 个节气</span>
              <span>手账 <b data-testid="couple-alm-notes-done">{{ yearVo.notesDone }}</b> 笔</span>
              <span>过法打勾 <b data-testid="couple-alm-rituals-done">{{ yearVo.ritualsDone }}</b>/{{ yearVo.ritualsTotal }} 条</span>
              <span>吉日 <b data-testid="couple-alm-lucky-count">{{ yearVo.luckyCount }}</b> 个</span>
              <span>节日方案 <b data-testid="couple-alm-festival-count">{{ yearVo.festivalPlans }}</b> 份</span>
              <span>放空 <b data-testid="couple-alm-normal-count">{{ yearVo.normalDays }}</b> 天</span>
            </div>
            <div v-if="yearVo.scroll.length" class="scroll-box" data-testid="couple-alm-scroll">
              <p v-for="(line, i) in yearVo.scroll" :key="i" class="scroll-line" :data-testid="`couple-alm-scroll-${i}`">{{ line }}</p>
            </div>
            <p v-else class="empty-line">这一年的长卷还是白的——明年多跟几次风 🧧</p>
          </template>
          <p v-else class="empty-line">小结还没拉开，点上面的按钮试试 🧧</p>
        </div>

        <div class="block">
          <p class="section-head">🛋️ 放空日（一年最多 3 天「什么都不做」，当天挡一切打卡）</p>
          <p v-if="!t.normal.days.length" class="empty-line">今年还没给自己放过空，挑一天什么都不做 🛋️</p>
          <div class="normal-list">
            <p v-for="d in t.normal.days" :key="d" class="normal-line" :data-testid="`couple-alm-normal-${d}`">
              <span class="normal-chip">🛋️ {{ d }}</span>
              <span v-if="d === t.day" class="both-badge" :data-testid="`couple-alm-normal-today-${d}`">就是今天，谁也不许搞仪式感</span>
            </p>
          </div>
          <div class="inline-form">
            <el-date-picker
              v-model="normalDay"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="放空的日期"
              style="width: 140px"
              data-testid="couple-alm-normal-day"
            />
            <el-button size="small" type="primary" data-testid="couple-alm-normal-submit" @click="onNormal">这天什么都不做 🛋️</el-button>
          </div>
        </div>
      </template>
      <p v-else class="empty-line">年运签还在晾…</p>
    </CoupleCollapsible>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { almanacApi } from '@/api/couple'
import type { CoupleAlmFestivalVO, CoupleAlmNoteVO, CoupleAlmRitualVO, CoupleAlmTodayVO, CoupleAlmYearVO, CoupleAlmZodiacVO } from '@/types'
import CoupleCollapsible from './CoupleCollapsible.vue'

/** 整份今日老黄历（写接口全部返回整份，整体替换即全卡刷新） */
const t = ref<CoupleAlmTodayVO | null>(null)
/** F256 生肖年运 / F259 一年小结：两个读接口按需领取，不进总览 */
const zodiac = ref<CoupleAlmZodiacVO | null>(null)
const yearVo = ref<CoupleAlmYearVO | null>(null)
const zodiacLoading = ref(false)
const yearlyLoading = ref(false)

// ---- 草稿 ----
const checkNote = ref('')
const ritualTerm = ref('')
const ritualContent = ref('')
const noteTerm = ref('')
const noteText = ref('')
const luckyDay = ref('')
const luckyMatter = ref('')
const festivalKey = ref('')
const festivalYear = ref('')
const festivalPlan = ref('')
const wishDraft = ref('')
const normalDay = ref('')
const yearlyYear = ref('')

const myCheck = computed(() => t.value?.term.todayChecks.find((c) => c.mine) ?? null)
const partnerCheck = computed(() => t.value?.term.todayChecks.find((c) => !c.mine) ?? null)
const bothChecked = computed(() => !!myCheck.value && !!partnerCheck.value)

/** F257 长假愿望两段文本（后端用换行分隔符拼「首写 —— 补写」） */
const wishParts = computed<string[]>(() => {
  const raw = t.value?.holiday?.wish ?? ''
  if (!raw.trim()) return []
  return raw.split('\n——\n').map((s) => s.trim()).filter((s) => !!s)
})
const wishFull = computed(() => wishParts.value.length >= 2)

const pickedLabel = computed(() => {
  const f = t.value?.festivals.find((x) => x.key === festivalKey.value)
  return f ? `${f.label}（${f.day}）` : '先从上面的节日里点一个 ✍️'
})

/** 过法是否今年已打勾（lastDoneYear 空串=没打过） */
function done(r: CoupleAlmRitualVO): boolean {
  return !!r.lastDoneYear && r.lastDoneYear === t.value?.year
}

/** 农历 mmdd 四位 → 「月初几」式口语展示 */
function lunarMdText(md: string): string {
  if (!md || md.length !== 4) return md
  const monthNames = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊']
  const dayNames = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十']
  const mi = Number(md.slice(0, 2)) - 1
  const di = Number(md.slice(2))
  const month = monthNames[mi] ?? `${md.slice(0, 2)}`
  const day = di <= 10 ? dayNames[di - 1] : di <= 20 ? `十${['一', '二', '三', '四', '五', '六', '七', '八', '九', ''][di - 11]}` : di === 30 ? '三十' : `廿${['一', '二', '三', '四', '五', '六', '七', '八', '九', ''][di - 21]}`
  return `${month}月${day}`
}

function onError(e: unknown, fallback: string) {
  ElMessage.error(e instanceof Error ? e.message : fallback)
}

/** 写接口统一返回整份 TodayVO：整体替换即全卡刷新 */
function refresh(data: CoupleAlmTodayVO | undefined | null) {
  if (data) t.value = data
}

// ---- F250 节气跟风 ----
async function onCheck() {
  try {
    refresh(await almanacApi.almCheck(checkNote.value.trim()))
    checkNote.value = ''
    ElMessage.success('风跟上了，这个节气我们都在场 🌿')
  } catch (e) {
    onError(e, '跟风失败')
  }
}

// ---- F251 过法：写 / 划 / 打勾 ----
async function onAddRitual() {
  if (!ritualTerm.value.trim()) {
    ElMessage.warning('先说这是哪个节气的过法 🧂')
    return
  }
  if (!ritualContent.value.trim()) {
    ElMessage.warning('过法要写一句具体的，比如「煮梨汤」🧂')
    return
  }
  try {
    refresh(await almanacApi.almRitualAdd(ritualTerm.value.trim(), ritualContent.value.trim()))
    ritualContent.value = ''
    ElMessage.success('过法已记进黄历，到那天照做 ✅')
  } catch (e) {
    onError(e, '写过法失败')
  }
}

async function onRemoveRitual(r: CoupleAlmRitualVO) {
  try {
    refresh(await almanacApi.almRitualRemove(r.id))
    ElMessage.success('这条过法划掉了 🧾')
  } catch (e) {
    onError(e, '划掉失败')
  }
}

async function onMark(r: CoupleAlmRitualVO) {
  try {
    refresh(await almanacApi.almRitualMark(r.id))
    ElMessage.success(`「${r.content}」今天做到了 ✅`)
  } catch (e) {
    onError(e, '打卡失败')
  }
}

// ---- F255 节气手账 ----
function pickNote(n: CoupleAlmNoteVO) {
  noteTerm.value = n.term
  noteText.value = n.mine
}

async function onNote() {
  if (!noteTerm.value.trim()) {
    ElMessage.warning('手账要写在那个节气上，先填节气名 📔')
    return
  }
  if (!noteText.value.trim()) {
    ElMessage.warning('手账要写满一句，再小也是事 📔')
    return
  }
  try {
    refresh(await almanacApi.almNote(noteTerm.value.trim(), t.value?.year ?? '', noteText.value.trim()))
    noteText.value = ''
    ElMessage.success('落笔完成，这一年又厚了一页 📔')
  } catch (e) {
    onError(e, '写手账失败')
  }
}

// ---- F252 择吉日 / 盖章 ----
async function onLucky() {
  if (!luckyDay.value) {
    ElMessage.warning('先挑个日子 🧧')
    return
  }
  if (!luckyMatter.value.trim()) {
    ElMessage.warning('大事要写清楚，比如「领证」🧧')
    return
  }
  try {
    refresh(await almanacApi.almLucky(luckyDay.value, luckyMatter.value.trim()))
    luckyMatter.value = ''
    ElMessage.success('日子择好了，黄历点评已附上，等 TA 盖章 🧧')
  } catch (e) {
    onError(e, '择吉日失败')
  }
}

async function onLuckyConfirm(l: { id: string; matter: string }) {
  try {
    refresh(await almanacApi.almLuckyConfirm(l.id))
    ElMessage.success(`「${l.matter}」双盖章，到时谁都不许放鸽子 🤝`)
  } catch (e) {
    onError(e, '盖章失败')
  }
}

// ---- F254 节日家档 ----
function pickFestival(f: CoupleAlmFestivalVO) {
  festivalKey.value = f.key
  festivalYear.value = t.value?.year ?? ''
  festivalPlan.value = f.mine
}

async function onFestival() {
  if (!festivalKey.value) {
    ElMessage.warning('先从八个节日里点一个 🏮')
    return
  }
  if (!festivalPlan.value.trim()) {
    ElMessage.warning('过法要写，哪怕只是「在家吃火锅」🏮')
    return
  }
  try {
    refresh(await almanacApi.almFestival(festivalKey.value, festivalYear.value.trim(), festivalPlan.value.trim()))
    festivalPlan.value = ''
    ElMessage.success('方案已归档，到日拆盲盒 🎁')
  } catch (e) {
    onError(e, '归档方案失败')
  }
}

// ---- F257 长假愿望（首写/补写） ----
async function onWish() {
  if (!wishDraft.value.trim()) {
    ElMessage.warning('愿望写一件就够，别写成清单 🧳')
    return
  }
  try {
    refresh(await almanacApi.almWish(wishDraft.value.trim()))
    wishDraft.value = ''
    ElMessage.success('愿望已收下，假期有了盼头 🧳')
  } catch (e) {
    onError(e, '写愿望失败')
  }
}

// ---- F258 放空日提报 ----
async function onNormal() {
  if (!normalDay.value) {
    ElMessage.warning('先选一天来放空 🛋️')
    return
  }
  try {
    refresh(await almanacApi.almNormal(normalDay.value))
    normalDay.value = ''
    ElMessage.success('放空日已立案，那天谁也不许搞仪式感 🛋️')
  } catch (e) {
    onError(e, '提报失败')
  }
}

// ---- F256 生肖年运（读接口，单独领取） ----
async function onZodiac() {
  zodiacLoading.value = true
  try {
    zodiac.value = await almanacApi.almZodiac()
  } catch (e) {
    onError(e, '领年运失败')
  } finally {
    zodiacLoading.value = false
  }
}

// ---- F259 一年小结（读接口，单独领取） ----
async function onYearly() {
  yearlyLoading.value = true
  try {
    yearVo.value = await almanacApi.almYearly(yearlyYear.value.trim())
  } catch (e) {
    onError(e, '拉小结失败')
  } finally {
    yearlyLoading.value = false
  }
}

// ---- 初始加载：safeLoad 静默降级（未建空间等场景不报错） ----
async function safeLoad<T>(loader: () => Promise<T>, fallback: T): Promise<T> {
  try {
    const data = await loader()
    return data ?? fallback
  } catch {
    return fallback
  }
}

onMounted(async () => {
  const today = await safeLoad(almanacApi.almToday, null)
  t.value = today
  if (today) {
    ritualTerm.value = today.term.term ?? ''
    noteTerm.value = today.term.term ?? ''
    festivalYear.value = today.year
    yearlyYear.value = today.year
  }
})
</script>

<style scoped>
/* 主色：中国红 + 鎏金点缀（区别于粉红/#409eff 公司蓝/#e6a23c 暖橙/金红）；折叠卡标题色经 CSS 变量级联给 CoupleCollapsible */
.couple-almanac { display: flex; flex-direction: column; gap: 14px; --collapse-title-color: #d93a3a; }
.card { background: var(--im-panel-bg, #fff); border-radius: 10px; padding: 14px 16px; border: 1px solid var(--im-border, #ebeef5); }
.sub { font-size: 12px; color: var(--im-muted, #909399); font-weight: normal; margin-left: 6px; }
.section-head { margin: 10px 0 4px; font-size: 13px; font-weight: bold; color: #d93a3a; }
.block { margin-top: 10px; padding-top: 8px; border-top: 1px dashed var(--im-border, #ebeef5); }
.inline-form { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 8px; }
.inline-form .el-input { flex: 1; min-width: 160px; }
.empty-line { margin: 8px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.flash-by { font-size: 11px; color: var(--im-muted, #909399); }
.who-chip { font-size: 11px; color: var(--im-muted, #909399); }
/* 今日节气头牌 */
.term-head { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; margin: 2px 0 0; font-size: 13px; color: var(--im-text, #303133); }
.term-name { font-size: 20px; color: #d93a3a; letter-spacing: 1px; }
.ganzhi-chip { font-size: 11px; color: #b8860b; background: rgba(212, 175, 55, 0.14); padding: 1px 8px; border-radius: 10px; }
.check-status { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin: 6px 0 0; }
.lit-chip { font-size: 12px; color: #67c23a; background: rgba(103, 194, 58, 0.1); padding: 2px 8px; border-radius: 6px; }
.dim-chip { font-size: 12px; color: var(--im-muted, #909399); background: var(--im-bg, #fafafa); padding: 2px 8px; border-radius: 6px; }
.both-badge { font-size: 12px; color: #d93a3a; font-weight: bold; }
.note-wall { margin-top: 6px; }
.check-line { margin: 3px 0; font-size: 13px; color: var(--im-text, #303133); display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.check-text { background: var(--im-bg, #fafafa); border-radius: 8px; padding: 3px 10px; }
.next-line { margin: 2px 0 0; font-size: 14px; color: var(--im-text, #303133); display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.next-line b { color: #d93a3a; font-size: 16px; }
.count-chip { font-size: 12px; color: #b8860b; background: rgba(212, 175, 55, 0.14); padding: 2px 8px; border-radius: 10px; }
/* 放空日今日态 */
.normal-box { margin-bottom: 8px; padding: 10px 12px; border-radius: 10px; background: rgba(217, 58, 58, 0.06); border: 1px dashed rgba(217, 58, 58, 0.45); }
.normal-head { margin: 0; font-size: 15px; font-weight: bold; color: #d93a3a; }
.normal-line { margin: 4px 0 0; font-size: 12px; color: var(--im-text, #303133); }
/* 过法卡 */
.ritual-list { margin-top: 2px; }
.ritual-line { margin: 4px 0; font-size: 13px; color: var(--im-text, #303133); display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.ritual-line.is-done .ritual-text { text-decoration: line-through; color: var(--im-muted, #909399); }
.done-chip { font-size: 13px; }
.ritual-text { color: var(--im-text, #303133); }
/* 手账 */
.note-list { margin-top: 2px; }
.note-line { margin: 4px 0; font-size: 12px; color: var(--im-text, #303133); display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.note-term { color: #d93a3a; font-size: 13px; }
.note-mine { color: var(--im-text, #303133); }
.note-partner { color: #b8860b; }
/* 择吉日 */
.lucky-list { margin-top: 6px; }
.lucky-line { margin: 5px 0; font-size: 13px; color: var(--im-text, #303133); display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.lucky-line.is-ok { border-left: 3px solid #d93a3a; padding-left: 8px; }
.lucky-day { color: #d93a3a; }
.lucky-matter { font-weight: bold; }
.lucky-comment { font-size: 12px; color: #b8860b; background: rgba(212, 175, 55, 0.12); padding: 1px 8px; border-radius: 10px; }
.wait-chip { font-size: 12px; color: #e6a23c; }
.lunar-list { margin-top: 2px; }
.lunar-line { margin: 4px 0; font-size: 12px; color: var(--im-text, #303133); display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.lunar-md { color: #d93a3a; }
.solar-chip { font-size: 11px; color: var(--im-muted, #909399); }
/* 节日家档 */
.festival-list { margin-top: 2px; }
.festival-line { margin: 5px 0; font-size: 12px; color: var(--im-text, #303133); display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.festival-label { font-size: 13px; color: #d93a3a; }
.festival-day { font-size: 11px; color: #b8860b; background: rgba(212, 175, 55, 0.12); padding: 1px 8px; border-radius: 10px; }
.plan-text { font-size: 12px; color: var(--im-text, #303133); }
.plan-text.is-partner { color: #b8860b; }
.festival-form { margin-top: 8px; padding: 8px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); }
.picked-line { margin: 0; font-size: 12px; color: var(--im-muted, #909399); }
.picked-line b { color: #d93a3a; }
/* 长假愿望 */
.holiday-head { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; margin: 2px 0 0; font-size: 14px; color: var(--im-text, #303133); }
.holiday-head b { color: #d93a3a; }
.wish-box { margin-top: 8px; padding: 8px 10px; border-radius: 8px; background: rgba(217, 58, 58, 0.05); border: 1px solid rgba(217, 58, 58, 0.25); }
.wish-line { margin: 4px 0; font-size: 13px; color: var(--im-text, #303133); display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; }
.wish-text { white-space: pre-wrap; }
.wish-form { margin-top: 8px; }
/* 年运与小结 */
.zodiac-box { margin-top: 2px; }
.zodiac-line { display: flex; gap: 8px; flex-wrap: wrap; margin: 8px 0 0; }
.zodiac-chip { font-size: 12px; color: #d93a3a; background: rgba(217, 58, 58, 0.08); padding: 2px 8px; border-radius: 6px; }
.fortune-line { margin: 6px 0 0; font-size: 13px; color: #b8860b; }
.year-stats { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 8px; font-size: 12px; color: var(--im-text, #303133); }
.year-stats b { color: #d93a3a; font-size: 14px; }
.scroll-box { margin-top: 8px; padding: 8px 10px; border-radius: 8px; border: 1px dashed rgba(184, 134, 11, 0.5); background: var(--im-bg, #fafafa); }
.scroll-line { margin: 3px 0; font-size: 12px; color: var(--im-text, #303133); }
.normal-list { margin-top: 2px; }
.normal-line { margin: 4px 0; font-size: 12px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.normal-chip { color: #d93a3a; background: rgba(217, 58, 58, 0.08); padding: 2px 8px; border-radius: 6px; }
</style>

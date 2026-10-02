<template>
  <div class="couple-legacy" data-testid="couple-legacy">
    <!-- F340 年度十问：今年 + 去年两期，逐格作答；两人都答满 10 题才出跨年对照 -->
    <CoupleCollapsible testid="couple-legacy-ten" :empty="!v">
      <template #title>📜 年度十问 <span class="sub">每年固定的十问，两人各答一份。你答过的那一格才看得到 TA 那一格，答满了才有跨年对照</span></template>
      <template v-if="v">
        <div v-for="t in v.tens" :key="t.year" class="ten-year" :data-testid="`couple-legacy-ten-year-${t.year}`">
          <p class="row-head">
            <b class="ten-title">{{ t.year }} 年十问</b>
            <span class="count-chip" :data-testid="`couple-legacy-ten-count-${t.year}`">我已答 {{ t.answeredCount }}/{{ TEN_COUNT }}</span>
            <span v-if="t.bothDone" class="lit-chip" :data-testid="`couple-legacy-ten-both-${t.year}`">两份都答满了 ✔</span>
          </p>
          <div class="progress-bar"><i :data-testid="`couple-legacy-ten-bar-${t.year}`" :style="{ width: tenRatio(t) }" /></div>
          <p v-if="!t.answeredCount" class="empty-line" :data-testid="`couple-legacy-ten-empty-${t.year}`">这一期一题都还没答，先从第 1 题开始 ✍️</p>
          <p v-else-if="t.answeredCount === TEN_COUNT && !t.bothDone" class="wait-line" :data-testid="`couple-legacy-ten-partner-wait-${t.year}`">你这份答满了，就等 TA 那一份 🫱</p>
          <div v-for="(q, i) in t.questions" :key="q" class="ten-row" :data-testid="`couple-legacy-ten-row-${t.year}-${i + 1}`">
            <p class="ten-q" :data-testid="`couple-legacy-ten-q-${t.year}-${i + 1}`">{{ i + 1 }}. {{ q }}</p>
            <p v-if="t.myAnswers[i]" class="ten-mine" :data-testid="`couple-legacy-ten-mine-${t.year}-${i + 1}`">我：{{ t.myAnswers[i] }}</p>
            <p v-else class="wait-line" :data-testid="`couple-legacy-ten-mine-none-${t.year}-${i + 1}`">这一题我还没答 ✍️</p>
            <p v-if="t.partnerAnswers[i]" class="ten-partner" :data-testid="`couple-legacy-ten-partner-${t.year}-${i + 1}`">TA：{{ t.partnerAnswers[i] }}</p>
            <p v-else class="wait-line" :data-testid="`couple-legacy-ten-partner-hide-${t.year}-${i + 1}`">这一格答了才看得到 TA 的——年度十问不是抄答案 🙈</p>
            <div class="inline-form">
              <el-input
                v-model="tenDraft[`${t.year}-${i + 1}`]"
                :maxlength="ANSWER_MAX"
                show-word-limit
                :placeholder="`第 ${i + 1} 题（≤${ANSWER_MAX} 字，一行说完）`"
                :data-testid="`couple-legacy-ten-answer-${t.year}-${i + 1}`"
              />
              <el-button size="small" type="primary" :data-testid="`couple-legacy-ten-submit-${t.year}-${i + 1}`" @click="onTenAnswer(t.year, i + 1)">
                {{ t.myAnswers[i] ? '改这一答 ✏️' : '答这题 ✏️' }}
              </el-button>
            </div>
          </div>
          <!-- 跨年 diff：双人都答满才给看变化 -->
          <template v-if="t.bothDone && lastTenOf(t.year)">
            <p class="section-head">🔍 {{ t.year }} 对照 {{ lastTenOf(t.year)?.year }} 年（看我这题换了没有）</p>
            <div class="diff-grid">
              <p v-for="(q, i) in t.questions" :key="`d-${i}`" class="diff-item" :data-testid="`couple-legacy-ten-diff-${t.year}-${i + 1}`">
                {{ i + 1 }}. {{ diffLabel(t, i) }}
              </p>
            </div>
          </template>
          <p v-else-if="t.bothDone" class="paired-line" :data-testid="`couple-legacy-ten-diff-first-${t.year}`">
            两份都答满了 ✔ 这是最早的一期，明年此时才有得对照
          </p>
          <p v-else class="wait-line" :data-testid="`couple-legacy-ten-diff-wait-${t.year}`">
            两人各答满 {{ TEN_COUNT }} 题才出跨年对照，现在先把空着的那几格填上 📜
          </p>
        </div>
      </template>
      <p v-else class="empty-line">十问册子还没摊开……</p>
    </CoupleCollapsible>

    <!-- F341 记忆库年审：最想留/最想删各 ≤3 条，候选来自回忆资产系 -->
    <CoupleCollapsible testid="couple-legacy-audit" :empty="!hasAuditStuff">
      <template #title>🗄️ 记忆库年审 <span class="sub">一年检一次：最想留的和最想删的各挑 3 条，附一句话意见。只是归档意见，不动原资产</span></template>
      <template v-if="v">
        <p class="section-head">🗄️ 交这一年的年审（留 ≤{{ THREE_MAX }} 条 · 删 ≤{{ THREE_MAX }} 条）</p>
        <div class="inline-form">
          <el-input v-model="auditYear" :maxlength="YEAR_MAX" placeholder="年份（空=今年，yyyy）" data-testid="couple-legacy-audit-year" />
          <el-button size="small" type="primary" data-testid="couple-legacy-audit-submit" @click="onAudit">交这份年审 🗄️</el-button>
        </div>
        <div class="audit-cols">
          <el-input v-model="auditKeep" type="textarea" :rows="3" :placeholder="`最想留的，一行一条（≤${THREE_MAX} 条、每条 ≤${AUDIT_ITEM_MAX} 字）`" data-testid="couple-legacy-audit-keep" />
          <el-input v-model="auditDelete" type="textarea" :rows="3" :placeholder="`最想删的，一行一条（≤${THREE_MAX} 条、每条 ≤${AUDIT_ITEM_MAX} 字）`" data-testid="couple-legacy-audit-delete" />
        </div>
        <div class="inline-form">
          <el-input v-model="auditNote" :maxlength="NOTE_MAX" show-word-limit placeholder="一句话审计意见（≤{{ NOTE_MAX }} 字，可空）" data-testid="couple-legacy-audit-note" />
        </div>
        <p class="section-head">🧾 可以从这些现有条目里挑（点一下抄进框，不用凭空想）</p>
        <p v-if="!v.auditCandidates.length" class="empty-line" data-testid="couple-legacy-audit-cand-none">回忆资产还空着，语录册/票根墙/第一次清单攒几条之后再年审也行 🗄️</p>
        <div v-else class="cand-list">
          <div v-for="(c, i) in v.auditCandidates" :key="c" class="cand-row" :data-testid="`couple-legacy-audit-cand-${i}`">
            <span class="cand-text">{{ c }}</span>
            <el-button size="small" plain :data-testid="`couple-legacy-audit-cand-keep-${i}`" @click="onAuditPick(i, 'keep')">留 ⭐</el-button>
            <el-button size="small" plain :data-testid="`couple-legacy-audit-cand-del-${i}`" @click="onAuditPick(i, 'delete')">删 🗑️</el-button>
          </div>
        </div>

        <p class="section-head">📚 交过的年审</p>
        <p v-if="!v.audits.length" class="empty-line" data-testid="couple-legacy-audit-empty">还没交过年审，第一次年检从今天这份开始 🗄️</p>
        <div v-for="(a, i) in v.audits" :key="`${a.year}-${i}`" class="audit-row" :data-testid="`couple-legacy-audit-row-${i}`">
          <p class="row-head">
            <span class="day-chip" :data-testid="`couple-legacy-audit-year-text-${i}`">{{ a.year }} 年</span>
            <span class="who-chip" :data-testid="`couple-legacy-audit-who-${i}`">{{ a.mine ? '我交的 🙋' : '💕 TA 交的' }}</span>
            <span class="status-chip" :data-testid="`couple-legacy-audit-submitted-${i}`">这年已交 {{ a.submitted }}/{{ TWO_PEOPLE }} 份</span>
          </p>
          <p class="audit-line" :data-testid="`couple-legacy-audit-keep-text-${i}`">⭐ 最想留：{{ a.keepThree.length ? a.keepThree.join('；') : '（没写）' }}</p>
          <p class="audit-line" :data-testid="`couple-legacy-audit-delete-text-${i}`">🗑️ 最想删：{{ a.deleteThree.length ? a.deleteThree.join('；') : '（没写）' }}</p>
          <p v-if="a.note" class="paired-line" :data-testid="`couple-legacy-audit-note-text-${i}`">📝 意见：{{ a.note }}</p>
          <p v-if="a.submitted < TWO_PEOPLE" class="wait-line" :data-testid="`couple-legacy-audit-wait-${i}`">这年的年审还差 TA 那一份 🫱</p>
        </div>
      </template>
      <p v-else class="empty-line">年检台还没摆好……</p>
    </CoupleCollapsible>

    <!-- F342 续约发布会：各写发言稿，对方按评分卡打分（重发即作废已打的分） -->
    <CoupleCollapsible testid="couple-legacy-speech" :empty="!hasSpeech">
      <template #title>🎤 续约发布会 <span class="sub">年度「发布会」：各交一份发言稿，评分卡在对方手里——你这篇我评不了，我重发你之前的分就作废</span></template>
      <template v-if="v">
        <p class="section-head">🎤 交这一年的发言稿</p>
        <div class="inline-form">
          <el-input v-model="speechYear" :maxlength="YEAR_MAX" placeholder="年份（空=今年，yyyy）" data-testid="couple-legacy-speech-year" />
          <el-button size="small" type="primary" data-testid="couple-legacy-speech-submit" @click="onSpeech">
            {{ mySpeechOf(speechYearKey) ? '重发这年（TA 打的分作废）🎤' : '发布发言 🎤' }}
          </el-button>
        </div>
        <el-input v-model="speechText" type="textarea" :rows="3" :maxlength="SPEECH_MAX" show-word-limit placeholder="发言稿正文（≤{{ SPEECH_MAX }} 字，说具体的事，别写年终总结）" data-testid="couple-legacy-speech-text" />

        <p class="section-head">🗂️ 发布台</p>
        <p v-if="!v.speeches.length" class="empty-line" data-testid="couple-legacy-speech-empty">发言台上还空着，第一年先从「我具体要什么」写起 🎤</p>
        <div v-for="(s, i) in v.speeches" :key="`${s.year}-${i}`" class="speech-row" :class="{ 'is-rated': s.score != null }" :data-testid="`couple-legacy-speech-row-${i}`">
          <p class="row-head">
            <span class="day-chip" :data-testid="`couple-legacy-speech-year-text-${i}`">{{ s.year }} 年</span>
            <span class="who-chip" :data-testid="`couple-legacy-speech-who-${i}`">{{ s.mine ? '我发的 🙋' : '💕 TA 发的' }}</span>
            <span v-if="s.score != null" class="lit-chip" :data-testid="`couple-legacy-speech-score-${i}`">评分卡 {{ s.score }}/5{{ s.scoreNote ? `（${s.scoreNote}）` : '' }}</span>
            <span v-else class="status-chip" :data-testid="`couple-legacy-speech-unscored-${i}`">还没人打分 ⏳</span>
          </p>
          <p class="speech-text" :data-testid="`couple-legacy-speech-text-text-${i}`">{{ s.text }}</p>
          <p v-if="s.ratedBy" class="hint-line" :data-testid="`couple-legacy-speech-rated-by-${i}`">打分人：{{ s.ratedBy }}</p>
          <!-- 评分口只给对方的那篇（canRate 后端算好：非本人且未打过） -->
          <template v-if="s.canRate">
            <div class="inline-form">
              <span class="hint-line">按评分卡给 TA 这年打个分（1-5）：</span>
              <el-radio-group v-model="rateScore[s.year]" :data-testid="`couple-legacy-speech-rate-${i}`">
                <el-radio v-for="n in SCORE_STEPS" :key="n" :value="n" :data-testid="`couple-legacy-speech-rate-opt-${i}-${n}`">{{ n }} 分</el-radio>
              </el-radio-group>
            </div>
            <div class="inline-form">
              <el-input v-model="rateNote[s.year]" :maxlength="NOTE_MAX" show-word-limit placeholder="评语一句（≤{{ NOTE_MAX }} 字，可空）" :data-testid="`couple-legacy-speech-rate-note-${i}`" />
              <el-button size="small" type="primary" plain :data-testid="`couple-legacy-speech-rate-btn-${i}`" @click="onSpeechRate(s)">交评分卡 📝</el-button>
            </div>
          </template>
          <p v-else-if="s.mine && s.score == null" class="wait-line" :data-testid="`couple-legacy-speech-rate-wait-${i}`">评分权在 TA 手里——自己给自己打分不算发布会 🙅</p>
          <p v-else-if="!s.mine && s.score != null" class="paired-line" :data-testid="`couple-legacy-speech-rated-line-${i}`">这年的分你已经打过了，想改让 TA 重发一遍 🎤</p>
        </div>
      </template>
      <p v-else class="empty-line">话筒还没架起来……</p>
    </CoupleCollapsible>

    <!-- F343 里程碑倒推：输入目标次数，后端按近 30 天速率算达成日 -->
    <CoupleCollapsible testid="couple-legacy-milestone" :empty="!v">
      <template #title>🎯 里程碑倒推 <span class="sub">给个目标次数（比如 1000 次晚安），按近 30 天的实际速率算哪天攒得齐，再配一条提速建议</span></template>
      <template v-if="v">
        <div class="inline-form">
          <el-input v-model="msGoal" placeholder="目标次数（如 300）" data-testid="couple-legacy-ms-goal" />
          <el-button size="small" type="primary" data-testid="couple-legacy-ms-submit" @click="onMilestoneCalc">按这个目标倒推 🎯</el-button>
          <el-button size="small" plain data-testid="couple-legacy-ms-reset" @click="onMilestoneReset">回默认 {{ DEFAULT_GOAL }} 次 ↩️</el-button>
        </div>
        <p class="ms-head" :data-testid="`couple-legacy-ms-goal-text-${v.milestone.goal}`">
          目标 {{ v.milestone.goal }} 次 · 已达成 {{ v.milestone.achieved }} 笔 · 近 30 天 {{ v.milestone.last30 }} 笔
        </p>
        <div class="progress-bar"><i data-testid="couple-legacy-ms-bar" :style="{ width: msRatio }" /></div>
        <p v-if="v.milestone.estimateDays < 0" class="wait-line" data-testid="couple-legacy-ms-no-rate">
          近 30 天一笔互动都没记，速率算不出来——先攒一周再来倒推 🎯
        </p>
        <p v-else-if="v.milestone.achieved >= v.milestone.goal" class="paired-line" data-testid="couple-legacy-ms-done">
          这个目标已经达成啦 🎉 换个更大的数再倒推一次
        </p>
        <p v-else class="ms-estimate" data-testid="couple-legacy-ms-estimate">
          按当前速率约 {{ v.milestone.estimateDays }} 天后、{{ v.milestone.estimateDay }} 攒得齐 📅
        </p>
        <p class="ms-advice" data-testid="couple-legacy-ms-advice">{{ v.milestone.advice }}</p>
        <p class="hint-line" data-testid="couple-legacy-ms-note">
          倒推只在总览读取时按你填的目标算；写完别的功能后总览会回到默认 {{ DEFAULT_GOAL }} 次，按你的目标再点一次就行 🎯
        </p>
      </template>
      <p v-else class="empty-line">倒推尺还没找出来……</p>
    </CoupleCollapsible>

    <!-- F344 恋爱汇率：各报各的，两人都报过才结得了年末的账 -->
    <CoupleCollapsible testid="couple-legacy-fx" :empty="!hasFx">
      <template #title>💱 恋爱汇率 <span class="sub">1 个亲亲换几个抱抱、1 个抱抱换几句夸夸——各报各的价，两人都报过才结得了年末那笔趣味账</span></template>
      <template v-if="v">
        <p class="section-head">💱 报我的汇率（{{ FX_MIN }}-{{ FX_MAX }} 之间，本人可改写）</p>
        <div class="inline-form">
          <el-input v-model="fxKiss" placeholder="1 个亲亲 = 几个抱抱" data-testid="couple-legacy-fx-kiss" />
          <el-input v-model="fxHug" placeholder="1 个抱抱 = 几句夸夸" data-testid="couple-legacy-fx-hug" />
          <el-button size="small" type="primary" data-testid="couple-legacy-fx-submit" @click="onFx">报上这个汇率 💱</el-button>
        </div>
        <p class="fx-preview" data-testid="couple-legacy-fx-preview">{{ fxBigLine }}</p>

        <p class="section-head">🏦 挂牌价</p>
        <p v-if="!v.fxes.length" class="empty-line" data-testid="couple-legacy-fx-empty">还没人报价，先从「一个亲亲值几个抱抱」想起 💱</p>
        <div v-for="(f, i) in v.fxes" :key="`${f.fromUser}-${i}`" class="fx-row" :data-testid="`couple-legacy-fx-row-${i}`">
          <p class="row-head">
            <span class="who-chip" :data-testid="`couple-legacy-fx-who-${i}`">{{ f.fromUser === myName ? '我报的 🙋' : `💕 ${f.fromUser} 报的` }}</span>
            <span class="rate-chip" :data-testid="`couple-legacy-fx-rate-${i}`">1 亲亲 = {{ f.kissToHug }} 抱抱 = {{ f.kissToHug * f.hugToWord }} 句夸夸</span>
          </p>
        </div>

        <!-- 结算口：两人都报过才放开；已结算同年不能再结 -->
        <div class="block">
          <p v-if="fxSettledYear" class="fx-settled" data-testid="couple-legacy-fx-settled">{{ fxSettledYear }} 年已经结过账了，明年重新开盘 💱</p>
          <p v-if="fxSettleLine" class="fx-line" data-testid="couple-legacy-fx-settle-line">{{ fxSettleLine }}</p>
          <p v-if="fxSettledYear" class="hint-line" data-testid="couple-legacy-fx-settle-hint">
            已归档的结算文案只按当前挂牌价出数字，改汇率不会重开账，也不能再结第二次 🧾
          </p>
          <template v-else-if="v.fxes.length >= TWO_PEOPLE">
            <p class="section-head">🧾 年末结算</p>
            <div class="inline-form">
              <el-input v-model="fxSettleYear" :maxlength="YEAR_MAX" placeholder="结算年份（空=今年，yyyy）" data-testid="couple-legacy-fx-settle-year" />
              <el-button size="small" type="primary" data-testid="couple-legacy-fx-settle" @click="onFxSettle">结这一笔 🧾</el-button>
            </div>
          </template>
          <p v-else class="wait-line" data-testid="couple-legacy-fx-settle-wait">两人都报过汇率才结得了账，现在先等 TA 那份价 🫱</p>
        </div>
      </template>
      <p v-else class="empty-line">汇率牌还黑着……</p>
    </CoupleCollapsible>

    <!-- F345 情侣品牌：命名 + slogan + 产品简介，发布权在对方确认 -->
    <CoupleCollapsible testid="couple-legacy-brand" :empty="!hasBrand">
      <template #title>🏷️ 情侣品牌 <span class="sub">给这段关系起个名、写句 slogan 和「产品简介」。你拟的稿要对方确认才发布，发布后这个空间的头部就写着我们的名字</span></template>
      <template v-if="v">
        <p class="section-head">🏷️ 拟/改品牌（名字 ≤{{ BRAND_NAME_MAX }} 字 · slogan ≤{{ BRAND_SLOGAN_MAX }} 字 · 简介 ≤{{ BRAND_INTRO_MAX }} 字）</p>
        <div class="inline-form">
          <el-input v-model="brandName" :maxlength="BRAND_NAME_MAX" show-word-limit placeholder="关系叫什么名（如「两个饭桶」）" data-testid="couple-legacy-brand-name" />
          <el-input v-model="brandSlogan" :maxlength="BRAND_SLOGAN_MAX" placeholder="slogan 一句" data-testid="couple-legacy-brand-slogan" />
        </div>
        <el-input v-model="brandIntro" type="textarea" :rows="2" :maxlength="BRAND_INTRO_MAX" show-word-limit placeholder="产品简介：我们主营什么、供应给谁" data-testid="couple-legacy-brand-intro" />
        <div class="inline-form">
          <el-button size="small" type="primary" data-testid="couple-legacy-brand-submit" @click="onBrand">
            {{ v.brand.name ? '改这版并重走确认 🏷️' : '拟个品牌 🏷️' }}
          </el-button>
          <span class="hint-line">任何改动都会把「已发布」清零，确认权又回到对方手里</span>
        </div>

        <p class="section-head">📇 在册的品牌</p>
        <p v-if="!v.brand.name" class="empty-line" data-testid="couple-legacy-brand-empty">还没拟过品牌，先把名字定下来 🏷️</p>
        <template v-else>
          <div class="brand-card" :class="{ 'is-published': v.brand.published }" data-testid="couple-legacy-brand-card">
            <p class="row-head">
              <b class="brand-name" data-testid="couple-legacy-brand-name-text">{{ v.brand.name }}</b>
              <span class="who-chip" data-testid="couple-legacy-brand-who">{{ v.brand.mine ? '我拟的 🙋' : '💕 TA 拟的' }}</span>
              <span class="status-chip" data-testid="couple-legacy-brand-status">{{ v.brand.published ? '已发布 📢' : '待对方确认 ⏳' }}</span>
            </p>
            <p class="brand-slogan" data-testid="couple-legacy-brand-slogan-text">{{ v.brand.slogan || '（没写 slogan）' }}</p>
            <p class="brand-intro" data-testid="couple-legacy-brand-intro-text">{{ v.brand.intro || '（没写产品简介）' }}</p>
            <p v-if="v.brand.line" class="brand-line" data-testid="couple-legacy-brand-line">{{ v.brand.line }}</p>
            <!-- 发布后的空间头部样式（本批组件自持数据，头部实际挂载留给 store 批次） -->
            <div v-if="v.brand.published" class="brand-header" data-testid="couple-legacy-brand-header">
              <span class="brand-header-name">{{ v.brand.name }}</span>
              <span class="brand-header-slogan">{{ v.brand.slogan || '——' }}</span>
            </div>
            <div v-else class="inline-form">
              <el-button v-if="!v.brand.mine" size="small" type="primary" data-testid="couple-legacy-brand-confirm" @click="onBrandConfirm">确认发布，让品牌上头部 📢</el-button>
              <p v-else class="wait-line" data-testid="couple-legacy-brand-confirm-wait">你是拟定的人，自己确认不作数——等 TA 点发布 🙅</p>
            </div>
          </div>
        </template>
      </template>
      <p v-else class="empty-line">商标还没注册……</p>
    </CoupleCollapsible>

    <!-- F346 我们的一年：一键年度盘点，正文数字全来自真表 -->
    <CoupleCollapsible testid="couple-legacy-review" :empty="!hasReview">
      <template #title>📚 我们的一年 <span class="sub">一键把这一年聚合成年报：台账笔数、十问答数、年审份数、发言与已评分数、清单条数，全是真数字不是套话</span></template>
      <template v-if="v">
        <div class="inline-form">
          <el-input v-model="reviewYear" :maxlength="YEAR_MAX" placeholder="盘点哪一年（空=去年，yyyy）" data-testid="couple-legacy-review-year" />
          <el-button size="small" type="primary" data-testid="couple-legacy-review-submit" @click="onReview">一键盘点 📚</el-button>
        </div>
        <p v-if="!v.reviews.length" class="empty-line" data-testid="couple-legacy-review-empty">还没生成过年度盘点，先点一次「一键盘点」📚</p>
        <div v-for="(r, i) in v.reviews" :key="`${r.year}-${i}`" class="review-row" :data-testid="`couple-legacy-review-row-${i}`">
          <p class="row-head">
            <span class="day-chip" :data-testid="`couple-legacy-review-year-text-${i}`">{{ r.year }} 年</span>
            <span class="who-chip" :data-testid="`couple-legacy-review-who-${i}`">{{ r.mine ? '我盘的 🙋' : '💕 TA 盘的' }}</span>
            <el-button v-if="r.mine" size="small" plain :data-testid="`couple-legacy-review-again-${i}`" @click="onReviewAgain(r)">重算这一年 🔁</el-button>
            <span v-else class="wait-chip" :data-testid="`couple-legacy-review-lock-${i}`">这份是 TA 盘的，你要重算自己点上面的按钮 📚</span>
          </p>
          <p class="review-content" :data-testid="`couple-legacy-review-content-${i}`">{{ r.content }}</p>
        </div>
      </template>
      <p v-else class="empty-line">年报机还没开张……</p>
    </CoupleCollapsible>

    <!-- F347 传世清单：地点/口令类条目，双签才算封存 -->
    <CoupleCollapsible testid="couple-legacy-list" :empty="!hasItems">
      <template #title>🗝️ 传世清单 <span class="sub">「想留给你」的东西：一个地点、一句口令、一件东西、一句话。登记了不算数，对方加签才封存</span></template>
      <template v-if="v">
        <p class="section-head">🗝️ 登记一条（条目名 ≤{{ ITEM_MAX }} 字 · 说明 ≤{{ ITEM_DETAIL_MAX }} 字）</p>
        <div class="inline-form">
          <el-input v-model="itemName" :maxlength="ITEM_MAX" show-word-limit placeholder="留给 TA 的东西叫什么" data-testid="couple-legacy-list-item" />
          <el-select v-model="itemKind" class="kind-select" data-testid="couple-legacy-list-kind">
            <el-option v-for="k in ITEM_KINDS" :key="k.value" :label="k.label" :value="k.value" />
          </el-select>
          <el-button size="small" type="primary" data-testid="couple-legacy-list-submit" @click="onItem">登记上清单 🗝️</el-button>
        </div>
        <el-input v-model="itemDetail" type="textarea" :rows="2" :maxlength="ITEM_DETAIL_MAX" show-word-limit placeholder="说明：在哪儿/怎么用/为什么是它（≤{{ ITEM_DETAIL_MAX }} 字，可空）" data-testid="couple-legacy-list-detail" />

        <p class="section-head">📜 清单在册</p>
        <p v-if="!v.items.length" class="empty-line" data-testid="couple-legacy-list-empty">清单还空着，第一样值得传世的东西从今天登记 🗝️</p>
        <div v-for="it in v.items" :key="it.id" class="item-row" :class="{ 'is-sealed': it.status === 'SEALED' }" :data-testid="`couple-legacy-list-${it.id}`">
          <p class="row-head">
            <b class="item-name" :data-testid="`couple-legacy-list-item-text-${it.id}`">{{ it.item }}</b>
            <span class="kind-chip" :data-testid="`couple-legacy-list-kind-text-${it.id}`">{{ itemKindLabel(it.kind) }}</span>
            <span class="who-chip" :data-testid="`couple-legacy-list-who-${it.id}`">{{ it.mine ? '我登记的 🙋' : '💕 TA 登记的' }}</span>
            <span class="status-chip" :data-testid="`couple-legacy-list-status-${it.id}`">{{ it.status === 'SEALED' ? '已封存 🗝️' : '待加签 ⏳' }}</span>
          </p>
          <p v-if="it.detail" class="item-detail" :data-testid="`couple-legacy-list-detail-text-${it.id}`">{{ it.detail }}</p>
          <el-button v-if="it.canSeal" size="small" type="primary" plain :data-testid="`couple-legacy-list-seal-${it.id}`" @click="onItemSeal(it)">加签封存 🗝️</el-button>
          <p v-else-if="it.status === 'SEALED'" class="paired-line" :data-testid="`couple-legacy-list-sealed-${it.id}`">双签封存 ✔ 这条是留着以后救场的{{ it.signedBy ? `（加签：${it.signedBy}）` : '' }}</p>
          <p v-else class="wait-line" :data-testid="`couple-legacy-list-wait-${it.id}`">自己签不封——等 TA 加那一笔 🫱</p>
        </div>
      </template>
      <p v-else class="empty-line">钥匙串还没挂上……</p>
    </CoupleCollapsible>

    <!-- F348 周年抽奖箱：每人一年一次，奖池吃本年积分台账攒下的愿望条目（没攒过才回落 Bank 固定愿望位） -->
    <CoupleCollapsible testid="couple-legacy-draw" :empty="!v">
      <template #title>🎰 周年抽奖箱 <span class="sub">周年到了才开封：两人各抽一次，奖券不许退。奖池是这一年攒下来的迷你愿望位</span></template>
      <template v-if="v">
        <p class="draw-head" data-testid="couple-legacy-draw-year">{{ v.draw.year }} 年的抽奖箱</p>
        <p v-if="v.draw.remindable" class="draw-remind" data-testid="couple-legacy-draw-remind">周年到了：抽奖箱已开封，两人各抽一次，奖券不许退 🎰</p>
        <div class="inline-form">
          <el-button size="small" type="primary" :disabled="v.draw.drawnMine" data-testid="couple-legacy-draw-btn" @click="onDraw">
            {{ v.draw.drawnMine ? '今年我已经抽过了 🎰' : '抽一次 🎰' }}
          </el-button>
          <span class="hint-line">每人一年一次，剩下的那次归 TA</span>
        </div>
        <p v-if="v.draw.prizeMine" class="prize-line" data-testid="couple-legacy-draw-mine">🎁 我抽到：「{{ v.draw.prizeMine }}」</p>
        <p v-else class="wait-line" data-testid="couple-legacy-draw-mine-none">我那一次还没抽 ⏳</p>
        <p v-if="v.draw.prizePartner" class="prize-line" data-testid="couple-legacy-draw-partner">💕 TA 抽到：「{{ v.draw.prizePartner }}」</p>
        <p v-else class="wait-line" data-testid="couple-legacy-draw-partner-wait">TA 那一次还没抽——抽完这箱才算开过 🫱</p>
        <p v-if="v.draw.drawnMine && v.draw.drawnPartner" class="paired-line" data-testid="couple-legacy-draw-both">两人都抽过了 ✔ 这一年的奖就按这两张兑 🎫</p>
      </template>
      <p v-else class="empty-line">抽奖箱还锁着……</p>
    </CoupleCollapsible>

    <!-- F349 空间等级：读时计算，无表无缓存，称号与话术全由后端 Bank 出 -->
    <CoupleCollapsible testid="couple-legacy-level" :empty="!v">
      <template #title>🏆 空间等级 <span class="sub">1-99 级 + 年度称号，全按你们一起点出来的互动数读时算，不是买的</span></template>
      <template v-if="v">
        <p class="level-lv" data-testid="couple-legacy-level-lv">Lv.{{ v.level.level }} / {{ LEVEL_MAX }}</p>
        <p class="level-title" data-testid="couple-legacy-level-title">年度称号：{{ v.level.title }}</p>
        <div class="progress-bar"><i data-testid="couple-legacy-level-bar" :style="{ width: levelRatio }" /></div>
        <p class="level-total" data-testid="couple-legacy-level-total">
          累计 {{ v.level.total }} 笔（互动台账 {{ v.level.ledgerCount }} 笔 + 传世资产 {{ v.level.legacyCount }} 件）
        </p>
        <p class="level-line" data-testid="couple-legacy-level-line">{{ v.level.line }}</p>
        <div class="inline-form">
          <el-input v-model="msGoal" placeholder="目标次数（只影响倒推卡）" data-testid="couple-legacy-level-goal" />
          <el-button size="small" type="primary" plain data-testid="couple-legacy-level-refresh" @click="onLevelRefresh">重读一次等级 🏆</el-button>
        </div>
        <p v-if="v.level.level >= LEVEL_MAX" class="paired-line" data-testid="couple-legacy-level-max">已经顶到 Lv.{{ LEVEL_MAX }} 了，传世是真的传到了 🏆</p>
        <p v-else class="wait-line" data-testid="couple-legacy-level-wait">还差 {{ LEVEL_MAX - v.level.level }} 级到顶，接着攒 🏆</p>
      </template>
      <p v-else class="empty-line">等级牌还没擦出来……</p>
    </CoupleCollapsible>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { legacyApi } from '@/api/couple'
import type { CoupleLegacyItemKind, CoupleLegacyTenVO, CoupleLegacyReviewVO, CoupleLegacySpeechVO, CoupleLegacyVO } from '@/types'
import CoupleCollapsible from './CoupleCollapsible.vue'
import { useAuthStore } from '@/stores/auth'

/** 限长常量抄自后端 CoupleLegacyService（只用于输入框限长与前端闸门文案，业务判定一律留在后端 400 直透） */
const TEN_COUNT = 10
const ANSWER_MAX = 140
const THREE_MAX = 3
const AUDIT_ITEM_MAX = 60
const NOTE_MAX = 140
const SPEECH_MAX = 600
const SCORE_STEPS = [1, 2, 3, 4, 5]
const FX_MIN = 1
const FX_MAX = 20
const BRAND_NAME_MAX = 30
const BRAND_SLOGAN_MAX = 60
const BRAND_INTRO_MAX = 300
const ITEM_MAX = 60
const ITEM_DETAIL_MAX = 200
/** F343 后端 goal 有效区间：越界后端不报错而是静默回落 DEFAULT_GOAL，所以前端先挡下来给一句话 */
const GOAL_MIN = 10
const GOAL_MAX = 100000
const DEFAULT_GOAL = 300
const LEVEL_MAX = 99
const YEAR_MAX = 4
const TWO_PEOPLE = 2

/** F347 类型四键（后端 CoupleLegacyItem.KINDS，其它值 400「类型只有 PLACE/PASSWORD/THING/WORD」） */
const ITEM_KINDS: { value: CoupleLegacyItemKind; label: string }[] = [
  { value: 'THING', label: '一件东西 🎁' },
  { value: 'PLACE', label: '一个地点 📍' },
  { value: 'PASSWORD', label: '一句口令 🔑' },
  { value: 'WORD', label: '一句话 💬' },
]

function itemKindLabel(kind: CoupleLegacyItemKind): string {
  return ITEM_KINDS.find((k) => k.value === kind)?.label ?? kind
}

/** 整份传世系统总览（1 读 + 12 写全部返回整份 LegacyVO，整体替换即十卡刷新） */
const v = ref<CoupleLegacyVO | null>(null)
const auth = useAuthStore()
const myName = computed(() => auth.username ?? '')

// ---- 草稿：F340 十问（key = `${year}-${slot}`，刷新时按当期自己的答案回填） ----
const tenDraft = ref<Record<string, string>>({})
// ---- 草稿：F341 年审 ----
const auditYear = ref('')
const auditKeep = ref('')
const auditDelete = ref('')
const auditNote = ref('')
// ---- 草稿：F342 发言与评分卡 ----
const speechYear = ref('')
const speechText = ref('')
const rateScore = ref<Record<string, number>>({})
const rateNote = ref<Record<string, string>>({})
// ---- 草稿：F343 倒推目标 ----
const msGoal = ref(String(DEFAULT_GOAL))
// ---- 草稿：F344 汇率 ----
const fxKiss = ref('')
const fxHug = ref('')
const fxSettleYear = ref('')
// ---- 草稿：F345 品牌 ----
const brandName = ref('')
const brandSlogan = ref('')
const brandIntro = ref('')
// ---- 草稿：F346/F347 ----
const reviewYear = ref('')
const itemName = ref('')
const itemKind = ref<CoupleLegacyItemKind>('THING')
const itemDetail = ref('')

// ---- 派生 ----
/** 年审表单当前落笔的年份（输入空 = 后端按今年算） */
const speechYearKey = computed(() => speechYear.value.trim() || v.value?.year || '')
const hasAuditStuff = computed(() => !!v.value && (v.value.audits.length > 0 || v.value.auditCandidates.length > 0))
const hasSpeech = computed(() => !!v.value && v.value.speeches.length > 0)
const hasFx = computed(() => !!v.value && v.value.fxes.length > 0)
const hasBrand = computed(() => !!v.value && !!v.value.brand.name)
const hasReview = computed(() => !!v.value && v.value.reviews.length > 0)
const hasItems = computed(() => !!v.value && v.value.items.length > 0)

/** F344 表单实时预览（纯展示换算，后端仍按自己那份口径出结算文案） */
const fxBigLine = computed(() => {
  const k = toInt(fxKiss.value)
  const h = toInt(fxHug.value)
  if (!k || !h) return '填好两档汇率，这里就给你算出「1 亲亲 = 几句夸夸」💱'
  return `我的挂牌价：1 个亲亲 = ${k} 个抱抱 = ${k * h} 句夸夸 💱`
})

const fxSettledYear = computed(() => v.value?.fxes.find((f) => f.settledYear)?.settledYear ?? '')
const fxSettleLine = computed(() => v.value?.fxes.find((f) => f.settleLine)?.settleLine ?? '')

const msRatio = computed(() => {
  const m = v.value?.milestone
  if (!m || m.goal <= 0) return '0%'
  return `${Math.min(100, Math.round((m.achieved / m.goal) * 100))}%`
})

/** F349 进度条只画「Lv.几 / 99」，等级与称号一律吃后端结果，前端不复算门槛表 */
const levelRatio = computed(() => {
  const lv = v.value?.level?.level ?? 0
  return `${Math.min(100, Math.round((lv / LEVEL_MAX) * 100))}%`
})

function tenRatio(t: CoupleLegacyTenVO): string {
  return `${Math.round((t.answeredCount / TEN_COUNT) * 100)}%`
}

/** 这一期的上一年（后端只下发今年+去年，所以去年那期恒无对照） */
function lastTenOf(year: string): CoupleLegacyTenVO | null {
  return v.value?.tens.find((t) => Number(t.year) === Number(year) - 1) ?? null
}

function diffLabel(t: CoupleLegacyTenVO, i: number): string {
  const last = lastTenOf(t.year)
  const prev = last?.myAnswers?.[i] ?? ''
  if (!prev) return '往年这题没答过'
  return prev === (t.myAnswers[i] ?? '') ? '这题和往年一样' : '这题换了说法（有变化）'
}

function mySpeechOf(year: string): CoupleLegacySpeechVO | null {
  return v.value?.speeches.find((s) => s.mine && s.year === year) ?? null
}

function toInt(raw: string): number {
  const n = Number(raw.trim())
  return Number.isFinite(n) ? Math.trunc(n) : NaN
}

function splitItems(raw: string): string[] {
  return [...new Set(raw.split(/[\n,、]/).map((s) => s.trim()).filter(Boolean))]
}

function yearOk(year: string): boolean {
  return !year || /^\d{4}$/.test(year)
}

function onError(e: unknown, fallback: string) {
  // 后端 400/404 的中文 message 直接透传（例如「两人都报过汇率才结得了账」「封存要对方签字，自己签不封」）
  ElMessage.error(e instanceof Error ? e.message : fallback)
}

/**
 * 写接口统一返回整份 LegacyVO：整体替换即十卡刷新。
 * 替换后回填「本人当年可改写」的输入口（十问逐格 / 年审 / 发言 / 汇率 / 品牌），
 * 行内草稿（评分卡评语、封存）一律清空重填；倒推目标跟着返回口径走（后端写接口一律按 300 重算）。
 */
function refresh(data: CoupleLegacyVO | null | undefined) {
  if (!data) return
  v.value = data

  const draft: Record<string, string> = {}
  data.tens.forEach((t) => {
    t.myAnswers.forEach((a, i) => {
      draft[`${t.year}-${i + 1}`] = a
    })
  })
  tenDraft.value = draft

  const mineAudit = data.audits.find((a) => a.mine && a.year === data.year)
  auditKeep.value = mineAudit ? mineAudit.keepThree.join('\n') : ''
  auditDelete.value = mineAudit ? mineAudit.deleteThree.join('\n') : ''
  auditNote.value = mineAudit?.note ?? ''

  const mineSpeech = data.speeches.find((s) => s.mine && s.year === data.year)
  speechText.value = mineSpeech?.text ?? ''

  const mineFx = data.fxes.find((f) => f.fromUser === myName.value)
  fxKiss.value = mineFx ? String(mineFx.kissToHug) : ''
  fxHug.value = mineFx ? String(mineFx.hugToWord) : ''

  brandName.value = data.brand.name
  brandSlogan.value = data.brand.slogan
  brandIntro.value = data.brand.intro

  itemName.value = ''
  itemDetail.value = ''
  rateNote.value = {}
  msGoal.value = String(data.milestone.goal)
}

/** 总览读取（F343 的 goal 只在这一个接口认，倒推卡与等级卡都走它） */
async function loadVault(goal?: number) {
  try {
    refresh(await legacyApi.legacyVault(goal))
    return true
  } catch (e) {
    onError(e, '读传世总览失败')
    return false
  }
}

// ---- F340 年度十问 ----
async function onTenAnswer(year: string, slot: number) {
  const key = `${year}-${slot}`
  const answer = (tenDraft.value[key] ?? '').trim()
  if (!answer) {
    ElMessage.warning('这一题总得答一句，别空着 ✏️')
    return
  }
  if (answer.length > ANSWER_MAX) {
    ElMessage.warning(`每题最多 ${ANSWER_MAX} 字，一行说完 ✏️`)
    return
  }
  try {
    refresh(await legacyApi.legacyTen(year, slot, answer))
    ElMessage.success(`第 ${slot} 题存好了，${year} 年这份又近一格 📜`)
  } catch (e) {
    onError(e, '答题失败')
  }
}

// ---- F341 记忆库年审 ----
async function onAudit() {
  const year = auditYear.value.trim()
  if (!yearOk(year)) {
    ElMessage.warning('年份写成 yyyy 🗄️')
    return
  }
  const keeps = splitItems(auditKeep.value)
  const dels = splitItems(auditDelete.value)
  if (!keeps.length && !dels.length) {
    ElMessage.warning('至少留一条：要么想留要么想删 🗄️')
    return
  }
  if (keeps.length > THREE_MAX) {
    ElMessage.warning(`最想留最多 ${THREE_MAX} 条，留最想的那几条 🗄️`)
    return
  }
  if (dels.length > THREE_MAX) {
    ElMessage.warning(`最想删最多 ${THREE_MAX} 条，删也是个体力活 🗄️`)
    return
  }
  if ([...keeps, ...dels].some((t) => t.length > AUDIT_ITEM_MAX)) {
    ElMessage.warning(`每条最多 ${AUDIT_ITEM_MAX} 字，写短一点 🗄️`)
    return
  }
  const note = auditNote.value.trim()
  if (note.length > NOTE_MAX) {
    ElMessage.warning(`一句话意见最多 ${NOTE_MAX} 字 🗄️`)
    return
  }
  try {
    refresh(await legacyApi.legacyAudit(year, keeps.join(','), dels.join(','), note))
    auditNote.value = ''
    ElMessage.success('年审交上去了，等 TA 那份凑成一对 🗄️')
  } catch (e) {
    onError(e, '交年审失败')
  }
}

/** 年审候选：点「留/删」把现有条目抄进对应文本框（前端行为，不发请求） */
function onAuditPick(index: number, target: 'keep' | 'delete') {
  const cand = v.value?.auditCandidates[index] ?? ''
  if (!cand) {
    ElMessage.warning('这条候选刚不在了，重读一次总览再看 🗄️')
    return
  }
  const box = target === 'keep' ? auditKeep : auditDelete
  const items = splitItems(box.value)
  if (items.includes(cand)) {
    ElMessage.warning('这条已经在框里了 🗄️')
    return
  }
  if (items.length >= THREE_MAX) {
    ElMessage.warning(`最多挑 ${THREE_MAX} 条，先划掉一条再加 🗄️`)
    return
  }
  box.value = [...items, cand].join('\n')
  ElMessage.success(target === 'keep' ? '抄进「最想留」了 ⭐' : '抄进「最想删」了 🗑️')
}

// ---- F342 续约发布会 ----
async function onSpeech() {
  const year = speechYear.value.trim()
  if (!yearOk(year)) {
    ElMessage.warning('年份写成 yyyy 🎤')
    return
  }
  const text = speechText.value.trim()
  if (!text) {
    ElMessage.warning('发言稿总要说一句 🎤')
    return
  }
  if (text.length > SPEECH_MAX) {
    ElMessage.warning(`发言稿最多 ${SPEECH_MAX} 字，长了没人听得进去 🎤`)
    return
  }
  try {
    refresh(await legacyApi.legacySpeech(year, text))
    ElMessage.success('发出去了，等 TA 按评分卡打分 🎤')
  } catch (e) {
    onError(e, '发发言失败')
  }
}

async function onSpeechRate(s: CoupleLegacySpeechVO) {
  const score = rateScore.value[s.year] ?? 0
  if (score < 1 || score > 5) {
    ElMessage.warning('评分卡要先选一档（1-5）📝')
    return
  }
  const note = (rateNote.value[s.year] ?? '').trim()
  if (note.length > NOTE_MAX) {
    ElMessage.warning(`评语最多 ${NOTE_MAX} 字 📝`)
    return
  }
  try {
    refresh(await legacyApi.legacySpeechRate(s.year, score, note))
    delete rateScore.value[s.year]
    ElMessage.success(`这年给了 ${score} 分，TA 会看到 📝`)
  } catch (e) {
    onError(e, '交评分卡失败')
  }
}

// ---- F343 里程碑倒推 ----
async function onMilestoneCalc() {
  const goal = toInt(msGoal.value)
  if (!Number.isFinite(goal) || goal <= 0) {
    ElMessage.warning('目标次数得是个数字，比如 300 🎯')
    return
  }
  if (goal < GOAL_MIN || goal > GOAL_MAX) {
    ElMessage.warning(`目标次数只在 ${GOAL_MIN}-${GOAL_MAX} 之间倒推，别填太空的数 🎯`)
    return
  }
  if (await loadVault(goal)) ElMessage.success(`按 ${goal} 次倒推算好了 🎯`)
}

async function onMilestoneReset() {
  if (await loadVault()) ElMessage.success(`回到默认 ${DEFAULT_GOAL} 次 🎯`)
}

// ---- F344 恋爱汇率 ----
async function onFx() {
  const k = toInt(fxKiss.value)
  const h = toInt(fxHug.value)
  if (!Number.isFinite(k) || !Number.isFinite(h)) {
    ElMessage.warning('两档汇率都要填数字 💱')
    return
  }
  if (k < FX_MIN || k > FX_MAX || h < FX_MIN || h > FX_MAX) {
    ElMessage.warning(`汇率两档都只能填 ${FX_MIN}-${FX_MAX}，别把夸夸印成废纸 💱`)
    return
  }
  try {
    refresh(await legacyApi.legacyFx(k, h))
    ElMessage.success(`报好了：1 亲亲 = ${k} 抱抱 = ${k * h} 句夸夸 💱`)
  } catch (e) {
    onError(e, '报汇率失败')
  }
}

async function onFxSettle() {
  const year = fxSettleYear.value.trim()
  if (!yearOk(year)) {
    ElMessage.warning('年份写成 yyyy 🧾')
    return
  }
  try {
    refresh(await legacyApi.legacyFxSettle(year))
    ElMessage.success('这一年的账结完了，明年重新开盘 🧾')
  } catch (e) {
    onError(e, '年末结算失败')
  }
}

// ---- F345 情侣品牌 ----
async function onBrand() {
  const name = brandName.value.trim()
  if (!name) {
    ElMessage.warning('关系叫什么名，总得有个名 🏷️')
    return
  }
  if (name.length > BRAND_NAME_MAX) {
    ElMessage.warning(`名字最多 ${BRAND_NAME_MAX} 字 🏷️`)
    return
  }
  const slogan = brandSlogan.value.trim()
  if (slogan.length > BRAND_SLOGAN_MAX) {
    ElMessage.warning(`slogan 最多 ${BRAND_SLOGAN_MAX} 字 🏷️`)
    return
  }
  const intro = brandIntro.value.trim()
  if (intro.length > BRAND_INTRO_MAX) {
    ElMessage.warning(`产品简介最多 ${BRAND_INTRO_MAX} 字 🏷️`)
    return
  }
  try {
    refresh(await legacyApi.legacyBrand(name, slogan, intro))
    ElMessage.success('品牌拟好了，发布要对方确认 🏷️')
  } catch (e) {
    onError(e, '拟品牌失败')
  }
}

async function onBrandConfirm() {
  try {
    refresh(await legacyApi.legacyBrandConfirm())
    ElMessage.success('发布了，以后这个空间头部写着我们的名字 📢')
  } catch (e) {
    onError(e, '确认发布失败')
  }
}

// ---- F346 我们的一年 ----
async function onReview() {
  const year = reviewYear.value.trim()
  if (!yearOk(year)) {
    ElMessage.warning('年份写成 yyyy（空着就盘去年）📚')
    return
  }
  try {
    refresh(await legacyApi.legacyReview(year))
    ElMessage.success('年度盘点生成好了，数字全是你们自己攒的 📚')
  } catch (e) {
    onError(e, '生成盘点失败')
  }
}

async function onReviewAgain(r: CoupleLegacyReviewVO) {
  try {
    refresh(await legacyApi.legacyReview(r.year))
    ElMessage.success(`${r.year} 年重算完了 📚`)
  } catch (e) {
    onError(e, '重算盘点失败')
  }
}

// ---- F347 传世清单 ----
async function onItem() {
  const item = itemName.value.trim()
  if (!item) {
    ElMessage.warning('留给 TA 的东西叫什么，写出来 🗝️')
    return
  }
  if (item.length > ITEM_MAX) {
    ElMessage.warning(`条目名最多 ${ITEM_MAX} 字 🗝️`)
    return
  }
  const detail = itemDetail.value.trim()
  if (detail.length > ITEM_DETAIL_MAX) {
    ElMessage.warning(`说明最多 ${ITEM_DETAIL_MAX} 字 🗝️`)
    return
  }
  try {
    refresh(await legacyApi.legacyItem(item, itemKind.value, detail))
    ElMessage.success('登记上了，等 TA 加签才算封存 🗝️')
  } catch (e) {
    onError(e, '登记条目失败')
  }
}

async function onItemSeal(it: { id: string; item: string }) {
  try {
    refresh(await legacyApi.legacyItemSeal(it.id))
    ElMessage.success(`「${it.item}」封存好了 🗝️`)
  } catch (e) {
    onError(e, '加签封存失败')
  }
}

// ---- F348 周年抽奖箱 ----
async function onDraw() {
  if (v.value?.draw.drawnMine) {
    ElMessage.warning('今年你已经抽过了，剩下的那次是 TA 的 🎰')
    return
  }
  try {
    refresh(await legacyApi.legacyDraw())
    ElMessage.success('抽好了，奖券不许退 🎰')
  } catch (e) {
    onError(e, '抽奖失败')
  }
}

// ---- F349 空间等级（读时算，重读就是再拉一次总览） ----
async function onLevelRefresh() {
  const goal = toInt(msGoal.value)
  const useGoal = Number.isFinite(goal) && goal >= GOAL_MIN && goal <= GOAL_MAX ? goal : undefined
  if (await loadVault(useGoal)) ElMessage.success(`等级重读好了：Lv.${v.value?.level.level ?? 1} 🏆`)
}

// ---- 初始加载：safeLoad 静默降级（未建空间 404 不报错，十卡留空态文案） ----
async function safeLoad<T>(loader: () => Promise<T>, fallback: T): Promise<T> {
  try {
    const data = await loader()
    return data ?? fallback
  } catch {
    return fallback
  }
}

onMounted(async () => {
  const data = await safeLoad(() => legacyApi.legacyVault(), null)
  if (data) refresh(data)
})
</script>

<style scoped>
/* 主色墨玉绿 #065f46（传世系统讲的是「家底、青铜古玉、值得长期持有」，用沉下去的玉色压住这十张卡，
   不用粉红的甜；全仓 grep src/components/couple/*.vue 确认零占用：既有主色已用掉
   #f56c6c 粉红 / #67c23a 绿 / #16a34a 监护绿（亮翠绿，比本色浅且不同调）/ #e6a23c 安眠暖橙 /
   #d93a3a 中国红 / #c0392b 庆典朱红 / #b8860b 鎏金点缀 / #409eff 公司蓝 / #0284c7 修复天蓝 /
   #3f51b5 靛蓝 / #9254de 倾听紫 / #2c7a7b 考据墨青（浅一档的书卷青）/ #0d9488 剧幕青绿 /
   #d2691e 工坊橙棕 / #a0522d 人情茶褐，也不撞全局六套皮肤强调色与聊天气泡渐变端点
   （#ec5f92/#3370ff/#8b5cf6/#10b981/#f97316/#06b6d4/#7c3aed，见 src/style.css 与 utils/settings.ts）；
   本组件不写 .title 规则，折叠卡标题色一律经 --collapse-title-color 级联给 CoupleCollapsible */
.couple-legacy { display: flex; flex-direction: column; gap: 14px; --collapse-title-color: #065f46; }
.sub { font-size: 12px; color: var(--im-muted, #909399); font-weight: normal; margin-left: 6px; }
.section-head { margin: 10px 0 4px; font-size: 13px; font-weight: bold; color: #065f46; }
.block { margin-top: 12px; padding-top: 8px; border-top: 1px dashed var(--im-border, #ebeef5); }
.inline-form { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 8px; }
.inline-form .el-input { flex: 1; min-width: 150px; }
.row-head { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; margin: 0; }
.empty-line { margin: 8px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.hint-line { font-size: 12px; color: var(--im-muted, #909399); }
.wait-line { margin: 6px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.wait-chip { font-size: 12px; color: var(--im-muted, #909399); }
.who-chip { font-size: 11px; color: var(--im-muted, #909399); }
.day-chip, .status-chip, .kind-chip, .count-chip, .rate-chip { font-size: 11px; color: #065f46; background: rgba(6, 95, 70, 0.12); padding: 1px 8px; border-radius: 10px; }
.lit-chip { font-size: 12px; color: #b8860b; background: rgba(184, 134, 11, 0.12); padding: 2px 8px; border-radius: 6px; }
.paired-line { margin: 6px 0 0; font-size: 12px; color: #065f46; }
.progress-bar { height: 6px; border-radius: 4px; background: rgba(6, 95, 70, 0.15); overflow: hidden; margin: 4px 0 6px; }
.progress-bar i { display: block; height: 100%; background: #065f46; }
.kind-select { width: 132px; }
/* F340 十问 */
.ten-year { margin-top: 8px; padding: 9px 11px; border-radius: 8px; border-left: 3px solid #065f46; background: rgba(6, 95, 70, 0.05); }
.ten-title { color: #065f46; font-size: 14px; }
.ten-row { margin: 8px 0; padding: 7px 9px; border-radius: 8px; background: var(--im-bg, #fafafa); font-size: 13px; }
.ten-q { margin: 0; font-weight: bold; color: var(--im-text, #303133); }
.ten-mine { margin: 4px 0 0; color: #065f46; }
.ten-partner { margin: 4px 0 0; color: var(--im-text, #303133); }
.diff-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 4px 12px; }
.diff-item { margin: 0; font-size: 12px; color: var(--im-text, #303133); }
/* F341 年审 */
.audit-cols { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
.audit-cols .el-input { flex: 1; min-width: 200px; }
.cand-list { margin-top: 6px; display: flex; flex-direction: column; gap: 4px; }
.cand-row { display: flex; gap: 8px; align-items: center; font-size: 12px; }
.cand-text { color: var(--im-text, #303133); }
.audit-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid var(--im-border, #ebeef5); font-size: 13px; }
.audit-line { margin: 3px 0 0; color: var(--im-text, #303133); }
/* F342 发布会 */
.speech-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid var(--im-border, #ebeef5); font-size: 13px; }
.speech-row.is-rated { border-left-color: #065f46; }
.speech-text { margin: 3px 0 0; color: var(--im-text, #303133); }
/* F343 倒推 */
.ms-head { margin: 6px 0 0; font-size: 13px; color: #065f46; }
.ms-estimate { margin: 4px 0 0; font-size: 13px; color: #065f46; }
.ms-advice { margin: 6px 0 0; font-size: 13px; color: var(--im-text, #303133); }
/* F344 汇率 */
.fx-preview { margin: 6px 0 0; font-size: 13px; color: #065f46; }
.fx-row { margin: 6px 0; font-size: 13px; }
.fx-settled { margin: 4px 0 0; font-size: 12px; color: #b8860b; }
.fx-line { margin: 4px 0 0; font-size: 13px; color: #065f46; }
/* F345 品牌 */
.brand-card { margin-top: 8px; padding: 9px 11px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid var(--im-border, #ebeef5); font-size: 13px; }
.brand-card.is-published { border-left-color: #065f46; }
.brand-name { color: #065f46; font-size: 15px; }
.brand-slogan { margin: 4px 0 0; color: var(--im-text, #303133); }
.brand-intro { margin: 3px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.brand-line { margin: 6px 0 0; font-size: 12px; color: #065f46; }
.brand-header { margin-top: 8px; padding: 8px 10px; border-radius: 8px; display: flex; gap: 10px; align-items: baseline; background: rgba(6, 95, 70, 0.1); }
.brand-header-name { font-size: 15px; font-weight: bold; color: #065f46; }
.brand-header-slogan { font-size: 12px; color: var(--im-muted, #909399); }
/* F346 年度盘点 */
.review-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid #065f46; font-size: 13px; }
.review-content { margin: 4px 0 0; color: var(--im-text, #303133); }
/* F347 清单 */
.item-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid var(--im-border, #ebeef5); font-size: 13px; }
.item-row.is-sealed { border-left-color: #065f46; }
.item-name { color: #065f46; }
.item-detail { margin: 3px 0 0; color: var(--im-text, #303133); }
/* F348 抽奖 */
.draw-head { margin: 0 0 4px; font-size: 14px; font-weight: bold; color: #065f46; }
.draw-remind { margin: 6px 0 0; padding: 6px 10px; border-radius: 8px; font-size: 13px; color: #b8860b; background: rgba(184, 134, 11, 0.12); }
.prize-line { margin: 6px 0 0; font-size: 13px; color: #065f46; }
/* F349 等级 */
.level-lv { margin: 0; font-size: 18px; font-weight: bold; color: #065f46; }
.level-title { margin: 4px 0 0; font-size: 13px; color: #b8860b; }
.level-total { margin: 6px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.level-line { margin: 6px 0 0; font-size: 13px; color: var(--im-text, #303133); }
</style>

<template>
  <div class="couple-world" data-testid="couple-world">
    <!-- F330 拜访攻略：写前置任务卡（带什么/聊什么/雷区）→ 对方确认才算双确认 → 回访后由写攻略的人交战报 -->
    <CoupleCollapsible testid="couple-world-visit" :empty="!hasVisits">
      <template #title>🧧 拜访攻略 <span class="sub">回谁家前先立一张前置任务卡：带什么 / 聊什么 / 雷区。TA 确认了才算双确认，回访后由写攻略的人交战报</span></template>
      <template v-if="w">
        <p class="section-head">🧧 写一次拜访攻略（一天一人一份，任务卡 ≤{{ PREP_LIMIT }} 条）</p>
        <div class="inline-form">
          <el-input v-model="visitDay" :maxlength="DAY_MAX" placeholder="拜访日（空=今天，yyyy-MM-dd）" data-testid="couple-world-visit-day" />
          <el-select v-model="visitSide" class="side-select" data-testid="couple-world-visit-side">
            <el-option label="回我家" :value="'MINE'" />
            <el-option label="回你家" :value="'YOURS'" />
          </el-select>
          <el-button size="small" type="primary" data-testid="couple-world-visit-submit" @click="onVisitAdd">写好攻略 🧧</el-button>
        </div>
        <el-input
          v-model="visitPreps"
          type="textarea"
          :rows="3"
          :placeholder="`带什么 / 聊什么 / 雷区，一行一条（≤${PREP_LIMIT} 条、每条 ≤${PREP_MAX} 字；以「带」开头算带什么，以「雷区」开头算雷区）`"
          data-testid="couple-world-visit-preps"
        />
        <p v-if="!w.visits.length" class="empty-line">还没有拜访攻略，第一次见家长从写一张任务卡开始 🧧</p>
        <div
          v-for="v in w.visits"
          :key="v.id"
          class="visit-row"
          :class="{ 'is-paired': v.confirmed, 'is-done': v.status === 'DONE' }"
          :data-testid="`couple-world-visit-${v.id}`"
        >
          <p class="row-head">
            <span class="day-chip" :data-testid="`couple-world-visit-day-text-${v.id}`">{{ v.day }}</span>
            <span class="host-chip" :data-testid="`couple-world-visit-host-${v.id}`">{{ v.hostLabel }}</span>
            <span class="who-chip">{{ v.mine ? '我写的 🙋' : '💕 TA 写的' }}</span>
            <span class="status-chip" :data-testid="`couple-world-visit-status-${v.id}`">{{ visitStatusText(v) }}</span>
          </p>
          <p v-if="!v.preps.length" class="empty-line">这张卡还空着，一条任务都没写 🧧</p>
          <ul class="prep-list">
            <li v-for="p in v.preps" :key="p.seq" :data-testid="`couple-world-prep-${v.id}-${p.seq}`">
              <span class="prep-kind">{{ prepKindText(p.kind) }}</span>{{ p.text }}
            </li>
          </ul>
          <el-button
            v-if="v.canConfirm"
            size="small"
            type="primary"
            plain
            :data-testid="`couple-world-visit-confirm-${v.id}`"
            @click="onVisitConfirm(v)"
          >确认攻略，雷区我来记 🤝</el-button>
          <p v-else-if="v.mine && !v.confirmed" class="wait-line" :data-testid="`couple-world-visit-confirm-wait-${v.id}`">
            自己写的自己确认不算数，等 TA 点一下双确认 🤝
          </p>
          <p v-if="v.confirmed && !v.report" class="paired-line" :data-testid="`couple-world-visit-paired-${v.id}`">
            双确认通过 ✔ 到场那天互相救场的地方记得回来写一笔
          </p>
          <p v-if="v.report" class="report-line" :data-testid="`couple-world-visit-report-text-${v.id}`">📣 战报：{{ v.report }}</p>
          <div v-if="v.mine && v.confirmed && !v.report" class="inline-form">
            <el-input
              v-model="reportDraft[v.id]"
              :maxlength="REPORT_MAX"
              show-word-limit
              :placeholder="`回访后的战报（≤${REPORT_MAX} 字：哪句接住了、哪句差点翻车）`"
              :data-testid="`couple-world-visit-report-${v.id}`"
            />
            <el-button size="small" type="primary" plain :data-testid="`couple-world-visit-report-btn-${v.id}`" @click="onVisitReport(v)">交战报 📣</el-button>
          </div>
          <p v-else-if="!v.mine && v.status === 'OPEN'" class="wait-line" :data-testid="`couple-world-visit-report-lock-${v.id}`">
            战报归写攻略的那个人，你只负责补细节 📣
          </p>
        </div>
      </template>
      <p v-else class="empty-line">攻略板还没挂起来…</p>
    </CoupleCollapsible>

    <!-- F331 送礼互助池：收集 TA 亲友可能喜欢的东西 → 对方接单代买 → 买回登记 -->
    <CoupleCollapsible testid="couple-world-gift" :empty="!hasGifts">
      <template #title>🎁 送礼互助池 <span class="sub">「TA 妈喜欢啥」不必一个人猜——往池子里丢灵感，对方能接单代买，买回来销账。节日前排雷最管用</span></template>
      <template v-if="w">
        <p class="section-head">🎁 丢一条灵感进池子</p>
        <div class="inline-form">
          <el-input v-model="giftPerson" :maxlength="GIFT_PERSON_MAX" :placeholder="`送谁（称谓，≤${GIFT_PERSON_MAX} 字）`" data-testid="couple-world-gift-person" />
          <el-input v-model="giftIdea" :maxlength="GIFT_IDEA_MAX" show-word-limit :placeholder="`TA 可能喜欢什么（≤${GIFT_IDEA_MAX} 字）`" data-testid="couple-world-gift-idea" />
        </div>
        <div class="inline-form">
          <el-input v-model="giftBudget" :maxlength="GIFT_FIELD_MAX" :placeholder="`预算（≤${GIFT_FIELD_MAX} 字，可空）`" data-testid="couple-world-gift-budget" />
          <el-input v-model="giftAvoid" :maxlength="GIFT_FIELD_MAX" :placeholder="`雷点（≤${GIFT_FIELD_MAX} 字，可空）`" data-testid="couple-world-gift-avoid" />
          <el-button size="small" type="primary" data-testid="couple-world-gift-submit" @click="onGiftAdd">丢进池子 🎁</el-button>
        </div>
        <p v-if="!w.gifts.length" class="empty-line">池子还空着，先想一件给 TA 家里人的小东西 🎁</p>
        <div
          v-for="g in w.gifts"
          :key="g.id"
          class="gift-row"
          :class="{ 'is-bought': g.status === 'BOUGHT', 'is-taken': g.status === 'TAKEN' }"
          :data-testid="`couple-world-gift-${g.id}`"
        >
          <p class="row-head">
            <b class="gift-person" :data-testid="`couple-world-gift-person-text-${g.id}`">{{ g.person }}</b>
            <span class="who-chip">{{ g.mine ? '我登的 🙋' : '💕 TA 登的' }}</span>
            <span class="status-chip" :data-testid="`couple-world-gift-status-${g.id}`">{{ giftStatusText(g) }}</span>
          </p>
          <p class="gift-idea" :data-testid="`couple-world-gift-idea-text-${g.id}`">{{ g.idea }}</p>
          <p class="hint-line">
            <span v-if="g.budget" :data-testid="`couple-world-gift-budget-text-${g.id}`">预算：{{ g.budget }}</span>
            <span v-if="g.avoid" class="avoid-line" :data-testid="`couple-world-gift-avoid-text-${g.id}`">⚠️ 雷点：{{ g.avoid }}</span>
            <span v-if="!g.budget && !g.avoid">没写预算和雷点</span>
          </p>
          <p v-if="g.takerUser" class="taker-line" :data-testid="`couple-world-gift-taker-${g.id}`">接单的人：{{ g.takerUser === myName ? '我 ✔' : `💕 ${g.takerUser}` }}</p>
          <el-button
            v-if="g.canTake"
            size="small"
            type="primary"
            plain
            :data-testid="`couple-world-gift-take-${g.id}`"
            @click="onGiftTake(g)"
          >这单我接了 🛒</el-button>
          <el-button
            v-else-if="giftCanBought(g)"
            size="small"
            type="primary"
            :data-testid="`couple-world-gift-bought-${g.id}`"
            @click="onGiftBought(g)"
          >买回来了 ✔</el-button>
          <p v-else-if="g.status === 'OPEN' && g.mine" class="wait-line" :data-testid="`couple-world-gift-lock-${g.id}`">
            自己登的不用自己接单，等 TA 帮你买 🎁
          </p>
          <p v-else-if="g.status === 'TAKEN'" class="wait-line" :data-testid="`couple-world-gift-bought-wait-${g.id}`">
            这单被接单了，等买东西的人回来销账 🛒
          </p>
        </div>
      </template>
      <p v-else class="empty-line">送礼池还没放水…</p>
    </CoupleCollapsible>

    <!-- F332 朋友视角问卷：3 题「外人怎么看我们」，线下问过朋友后回填，三题齐了出他观卡 -->
    <CoupleCollapsible testid="couple-world-view">
      <template #title>🪞 朋友视角问卷 <span class="sub">三题「外人怎么看我们」——线下逮着共同朋友问一嘴，回来把原话抄进来。三题答齐才发他观卡</span></template>
      <template v-if="w">
        <p class="section-head">🪞 线下问过朋友后回填（一句原话就行）</p>
        <div v-for="v in w.views" :key="v.slot" class="view-row" :class="{ 'is-filled': v.filled }" :data-testid="`couple-world-view-${v.slot}`">
          <p class="row-head">
            <span class="slot-chip">第 {{ v.slot }} 题</span>
            <b class="view-question" :data-testid="`couple-world-view-question-${v.slot}`">{{ v.question }}</b>
            <span v-if="v.filled" class="status-chip" :data-testid="`couple-world-view-state-${v.slot}`">已回填 ✔</span>
            <span v-else class="status-chip" :data-testid="`couple-world-view-state-${v.slot}`">还空着 ⏳</span>
          </p>
          <p v-if="v.filled" class="view-answer" :data-testid="`couple-world-view-answer-text-${v.slot}`">
            「{{ v.answer }}」<span class="hint-line">（问了{{ v.askedTo || '谁没写' }} · 由{{ v.byUser || 'TA' }}回填）</span>
          </p>
          <div class="inline-form">
            <el-input v-model="viewAsked[slotKey(v.slot)]" :maxlength="VIEW_PERSON_MAX" placeholder="问了谁（可空）" :data-testid="`couple-world-view-asked-${v.slot}`" />
            <el-input
              v-model="viewAnswer[slotKey(v.slot)]"
              :maxlength="VIEW_ANSWER_MAX"
              show-word-limit
              :placeholder="`朋友的原话（≤${VIEW_ANSWER_MAX} 字）`"
              :data-testid="`couple-world-view-answer-${v.slot}`"
            />
            <el-button size="small" type="primary" plain :data-testid="`couple-world-view-submit-${v.slot}`" @click="onViewFill(v)">
              {{ v.filled ? '改写这题 🪞' : '回填这题 🪞' }}
            </el-button>
          </div>
        </div>
        <p v-if="w.friendViewLine" class="view-card" data-testid="couple-world-view-line">{{ w.friendViewLine }}</p>
        <p v-else class="wait-line" data-testid="couple-world-view-wait">
          三题还没答齐（已回填 {{ viewsFilled }}/{{ (w.views || []).length || 3 }}），齐了才出他观卡 🪞
        </p>
      </template>
      <p v-else class="empty-line">镜子还没擦干净…</p>
    </CoupleCollapsible>

    <!-- F333 官宣日：每月一张纯文字官宣卡，攒成官宣编年 -->
    <CoupleCollapsible testid="couple-world-declare">
      <template #title>📣 官宣日 <span class="sub">每月一张纯文字官宣卡，不必一次到位——每个月各写一句，攒成我们自己的官宣编年</span></template>
      <template v-if="w">
        <p class="section-head">📣 {{ w.month }} 的官宣卡（一个月一张）</p>
        <el-input
          v-model="declareText"
          type="textarea"
          :rows="2"
          :maxlength="DECLARE_MAX"
          show-word-limit
          :placeholder="`这个月想对外说的一句（≤${DECLARE_MAX} 字，纯文字）`"
          data-testid="couple-world-declare-text"
        />
        <div class="inline-form">
          <el-button size="small" type="primary" data-testid="couple-world-declare-submit" @click="onDeclare">
            {{ declaredThisMonth ? '本月已发，再点试试 📣' : '发本月官宣卡 📣' }}
          </el-button>
          <span v-if="declaredThisMonth" class="wait-line" data-testid="couple-world-declare-done">
            {{ w.month }} 这张已经发进编年了，一个月一张，下个月再写一句
          </span>
          <span v-else class="hint-line" data-testid="couple-world-declare-wait">本月还没人发，先写的这句就是这月的门面</span>
        </div>
        <p class="section-head">🗓️ 官宣编年（共 {{ w.declares.length }} 张）</p>
        <p v-if="!w.declares.length" class="empty-line">编年还是空的，第一张从今天这张开始 📣</p>
        <div
          v-for="d in w.declares"
          :key="d.month"
          class="declare-row"
          :class="{ 'is-current': d.month === w.month }"
          :data-testid="`couple-world-declare-${d.month}`"
        >
          <p class="row-head">
            <span class="day-chip" :data-testid="`couple-world-declare-month-${d.month}`">{{ d.month }}</span>
            <span class="who-chip">{{ d.mine ? '我发的 🙋' : '💕 TA 发的' }}</span>
            <span v-if="d.month === w.month" class="status-chip">本月 ✔</span>
          </p>
          <p class="declare-text" :data-testid="`couple-world-declare-text-${d.month}`">「{{ d.text }}」</p>
        </div>
      </template>
      <p v-else class="empty-line">话筒还没接通…</p>
    </CoupleCollapsible>

    <!-- F334 文案代写：各交 3 条候选互评选稿，定稿那条由后端写进我们百科 -->
    <CoupleCollapsible testid="couple-world-caption">
      <template #title>📝 文案代写 <span class="sub">TA 那条朋友圈不会写？各交三条候选互评选稿——自己不能定自己的稿，定稿那条自动进百科存着</span></template>
      <template v-if="w">
        <p class="section-head">📝 交我的三条候选（同日同条可改写，一人一天最多三稿）</p>
        <div v-for="slot in CAPTION_SLOTS" :key="slot" class="inline-form">
          <el-input
            v-model="captionDraft[slot]"
            :maxlength="CAPTION_MAX"
            show-word-limit
            :placeholder="`第 ${slot} 条候选（≤${CAPTION_MAX} 字）`"
            :data-testid="`couple-world-caption-input-${slot}`"
          />
          <el-button size="small" type="primary" plain :data-testid="`couple-world-caption-submit-${slot}`" @click="onCaptionSubmit(slot)">
            {{ myCaptionFilled(slot) ? `改写第 ${slot} 条` : `交第 ${slot} 条` }} 📝
          </el-button>
        </div>
        <p class="cap-stat" data-testid="couple-world-caption-mine-count">
          我今天交了 {{ myTodayCaptions.length }}/3 条 · TA 今天交了 {{ partnerTodayCaptions.length }}/3 条
        </p>
        <p v-if="partnerTodayCaptions.length" class="section-head">📝 今天互相的候选（只有对方写的稿才给选稿钮）</p>
        <p v-if="!todayCaptions.length" class="empty-line">今天还没有候选，谁先发一条朋友圈谁来求稿 📝</p>
        <div
          v-for="c in todayCaptions"
          :key="c.id"
          class="cap-row"
          :class="{ 'is-won': c.won }"
          :data-testid="`couple-world-caption-${c.id}`"
        >
          <p class="row-head">
            <span class="slot-chip" :data-testid="`couple-world-caption-slot-${c.id}`">第 {{ c.slot }} 条</span>
            <span class="who-chip">{{ c.mine ? '我写的 🙋' : '💕 TA 写的' }}</span>
            <span v-if="c.won" class="lit-chip" :data-testid="`couple-world-caption-won-${c.id}`">🏆 已定稿</span>
          </p>
          <p class="cap-text" :data-testid="`couple-world-caption-text-${c.id}`">「{{ c.text }}」</p>
          <el-button
            v-if="!c.mine && !c.won"
            size="small"
            type="primary"
            :data-testid="`couple-world-caption-pick-${c.id}`"
            @click="onCaptionPick(c)"
          >就用这条，定稿 🏆</el-button>
          <p v-else-if="c.mine" class="wait-line" :data-testid="`couple-world-caption-pick-lock-${c.id}`">
            自己写的稿自己定不算互评选稿，等 TA 来挑 📝
          </p>
        </div>
        <p v-if="!partnerTodayCaptions.length" class="wait-line" data-testid="couple-world-caption-partner-wait">
          TA 今天还没交稿，稿子得两个人都出才算互评 ⏳
        </p>
        <template v-if="wonHistory.length">
          <p class="section-head">🏆 定稿存档（已进百科）</p>
          <div v-for="c in wonHistory" :key="c.id" class="cap-row is-won" :data-testid="`couple-world-caption-done-${c.id}`">
            <p class="row-head">
              <span class="day-chip" :data-testid="`couple-world-caption-done-day-${c.id}`">{{ c.day }}</span>
              <span class="who-chip">作者：{{ c.mine ? '我 🙋' : '💕 TA' }}</span>
            </p>
            <p class="cap-text" :data-testid="`couple-world-caption-done-text-${c.id}`">「{{ c.text }}」</p>
          </div>
        </template>
      </template>
      <p v-else class="empty-line">代写台还没开门…</p>
    </CoupleCollapsible>

    <!-- F335 进城接待方案：行程 / 交通 / 陪同小包清单，存成接待手册 -->
    <CoupleCollapsible testid="couple-world-city">
      <template #title>🧳 进城接待方案 <span class="sub">TA 第一次来这座城：行程怎么排、怎么走、陪同小包装什么——写进接待手册，比临时慌强</span></template>
      <template v-if="w">
        <p class="section-head">🧳 {{ cityEditing ? `改「${cityEditing}」这本手册` : '新建一座城市的接待手册' }}（同城名即改写）</p>
        <div class="inline-form">
          <el-input v-model="cityName" :maxlength="CITY_MAX" :placeholder="`哪座城市（≤${CITY_MAX} 字）`" data-testid="couple-world-city-name" />
          <el-input v-model="cityDay" :maxlength="DAY_MAX" placeholder="到访日（可空，yyyy-MM-dd）" data-testid="couple-world-city-day" />
        </div>
        <el-input
          v-model="cityItinerary"
          type="textarea"
          :rows="2"
          :placeholder="`行程，一行一条（≤${ITIN_LIMIT} 条、每条 ≤${ITIN_ITEM_MAX} 字）`"
          data-testid="couple-world-city-itinerary"
        />
        <el-input v-model="cityTransport" :maxlength="CITY_TEXT_MAX" show-word-limit :placeholder="`交通（≤${CITY_TEXT_MAX} 字，怎么接、怎么走）`" data-testid="couple-world-city-transport" />
        <el-input
          v-model="cityPack"
          type="textarea"
          :rows="2"
          :placeholder="`陪同小包清单，一行一项（≤${PACK_LIMIT} 项、每条 ≤${ITIN_ITEM_MAX} 字，可空）`"
          data-testid="couple-world-city-pack"
        />
        <p class="pack-tpl" data-testid="couple-world-city-template">后端给的陪同小包模板，点一下就抄进清单：</p>
        <div class="chip-row">
          <button
            v-for="(t, i) in w.packTemplate"
            :key="`${t}-${i}`"
            type="button"
            class="tpl-chip"
            :data-testid="`couple-world-city-tpl-${i}`"
            @click="onPackTemplate(t)"
          >＋ {{ t }}</button>
        </div>
        <div class="inline-form">
          <el-button size="small" type="primary" data-testid="couple-world-city-submit" @click="onCitySave">存下这本手册 🧳</el-button>
          <el-button v-if="cityEditing" size="small" plain data-testid="couple-world-city-cancel" @click="resetCityForm">改完了，收起 ✋</el-button>
        </div>
        <p v-if="!w.cities.length" class="empty-line">还没有接待手册，TA 要来之前先排一本 🧳</p>
        <div v-for="c in w.cities" :key="c.id" class="city-row" :data-testid="`couple-world-city-${c.id}`">
          <p class="row-head">
            <b class="city-name" :data-testid="`couple-world-city-name-text-${c.id}`">{{ c.city }}</b>
            <span class="who-chip">{{ c.mine ? '我排的 🙋' : '💕 TA 排的' }}</span>
            <span class="day-chip" :data-testid="`couple-world-city-day-text-${c.id}`">{{ c.arriveDay || '没定到访日' }}</span>
            <span class="status-chip" :data-testid="`couple-world-city-count-${c.id}`">{{ cityCountText(c) }}</span>
          </p>
          <p v-if="!c.itinerary.length" class="empty-line">行程还空着，先排一天的路线 🧳</p>
          <ol class="city-list">
            <li v-for="(it, i) in c.itinerary" :key="`${it}-${i}`" :data-testid="`couple-world-city-itin-${c.id}-${i}`">{{ it }}</li>
          </ol>
          <p class="hint-line">
            <span :data-testid="`couple-world-city-transport-${c.id}`">交通：{{ c.transport || '没写' }}</span>
          </p>
          <p v-if="c.packList.length" class="pack-line">陪同小包：</p>
          <div v-if="c.packList.length" class="chip-row">
            <span v-for="(p, i) in c.packList" :key="`${p}-${i}`" class="pack-chip" :data-testid="`couple-world-city-pack-${c.id}-${i}`">{{ p }}</span>
          </div>
          <div class="inline-form">
            <el-button size="small" plain :data-testid="`couple-world-city-edit-${c.id}`" @click="onCityEdit(c)">改这本手册 ✏️</el-button>
          </div>
        </div>
      </template>
      <p v-else class="empty-line">接待手册印钞机没纸了…</p>
    </CoupleCollapsible>

    <!-- F336 亲戚称呼册：出题考对方，答错进考前强化 -->
    <CoupleCollapsible testid="couple-world-relative" :empty="!hasRelatives">
      <template #title>📖 亲戚称呼册 <span class="sub">「她姑姑的女儿该叫什么」——把称谓出一册互相考，答错的自动进考前强化清单</span></template>
      <template v-if="w">
        <p class="section-head">📖 出一条称谓考题（同名即已在册）</p>
        <div class="inline-form">
          <el-input v-model="relTerm" :maxlength="TERM_MAX" :placeholder="`称谓本体（≤${TERM_MAX} 字，如「舅舅的妻子」）`" data-testid="couple-world-relative-term" />
          <el-input v-model="relAnswer" :maxlength="REL_ANSWER_MAX" :placeholder="`标准答案（≤${REL_ANSWER_MAX} 字，如「舅妈」）`" data-testid="couple-world-relative-answer-text" />
        </div>
        <div class="inline-form">
          <el-input v-model="relQuestion" :maxlength="QNA_MAX" show-word-limit :placeholder="`题面怎么问（≤${QNA_MAX} 字）`" data-testid="couple-world-relative-question" />
          <el-button size="small" type="primary" data-testid="couple-world-relative-submit" @click="onRelativeAdd">收进称呼册 📖</el-button>
        </div>
        <p class="exam-bar" data-testid="couple-world-relative-exam">📌 考前强化清单：{{ examRows.length }} 题错过（下次见面前务必背下）</p>
        <p v-if="!w.relatives.length" class="empty-line">册子还空着，先出第一道「该叫什么」 📖</p>
        <div
          v-for="r in w.relatives"
          :key="r.id"
          class="rel-row"
          :class="{ 'is-exam': r.wrongCount > 0 }"
          :data-testid="`couple-world-relative-${r.id}`"
        >
          <p class="row-head">
            <b class="rel-term" :data-testid="`couple-world-relative-term-text-${r.id}`">{{ r.term }}</b>
            <span class="who-chip">{{ r.mine ? '我出的 🙋' : '💕 TA 出的' }}</span>
            <span v-if="r.wrongCount > 0" class="breach-chip" :data-testid="`couple-world-relative-wrong-${r.id}`">答错 {{ r.wrongCount }} 次{{ r.lastWrongDay ? ` · 最近 ${r.lastWrongDay}` : '' }}</span>
            <span v-else class="status-chip" :data-testid="`couple-world-relative-clean-${r.id}`">还没错过 ✔</span>
          </p>
          <p class="rel-question" :data-testid="`couple-world-relative-question-text-${r.id}`">{{ r.question }}</p>
          <p v-if="r.mine" class="hint-line" :data-testid="`couple-world-relative-std-${r.id}`">我出的题（标准答案：{{ r.answer }}），等 TA 来答 📖</p>
          <div v-else-if="r.canTry" class="inline-form">
            <el-input
              v-model="relTryDraft[r.id]"
              :maxlength="REL_ANSWER_MAX"
              placeholder="我该怎么称呼（写一个称呼）"
              :data-testid="`couple-world-relative-try-${r.id}`"
            />
            <el-button size="small" type="primary" plain :data-testid="`couple-world-relative-try-btn-${r.id}`" @click="onRelativeTry(r)">交卷 📖</el-button>
          </div>
          <p v-else class="wait-line" :data-testid="`couple-world-relative-try-lock-${r.id}`">自己出的题考不了自己，等 TA 来答 📖</p>
        </div>
      </template>
      <p v-else class="empty-line">称呼册还没立账…</p>
    </CoupleCollapsible>

    <!-- F337 社会信用：公开声明「我保证不做…」→ TA 见证 → 到期解除或塌房 -->
    <CoupleCollapsible testid="couple-world-credit" :empty="!hasVows">
      <template #title>🤝 社会信用 <span class="sub">「我保证不再…」说给一个人听不算数——公开立一条、TA 见证、到期自动解除。中途犯了就记一条塌房</span></template>
      <template v-if="w">
        <p class="section-head">🤝 公开立一条保证（每人各立，到期日必须在以后）</p>
        <el-input
          v-model="vowContent"
          type="textarea"
          :rows="2"
          :maxlength="VOW_MAX"
          show-word-limit
          :placeholder="`我保证不做…（≤${VOW_MAX} 字，要写清是什么）`"
          data-testid="couple-world-credit-content"
        />
        <div class="inline-form">
          <el-input v-model="vowDue" :maxlength="DAY_MAX" placeholder="到期日（空=30 天后，yyyy-MM-dd）" data-testid="couple-world-credit-due" />
          <el-button size="small" type="primary" data-testid="couple-world-credit-submit" @click="onVowAdd">公开立下 🤝</el-button>
        </div>
        <p class="credit-bar">
          🏦 社会信用：说到做到 {{ keptCount }} 条 · 在保 {{ openCount }} 条 · 塌房 {{ brokenCount }} 条
          <span class="hint-line" data-testid="couple-world-credit-stats">（到期且已见证的自动解除，后端给本人记一笔心动）</span>
        </p>
        <p v-if="!w.vows.length" class="empty-line">还没人立过保证，第一句先从小的说起 🤝</p>
        <div
          v-for="v in w.vows"
          :key="v.id"
          class="vow-row"
          :class="{ 'is-kept': v.status === 'KEPT', 'is-broken': v.status === 'BROKEN' }"
          :data-testid="`couple-world-credit-${v.id}`"
        >
          <p class="row-head">
            <b class="vow-content" :data-testid="`couple-world-credit-text-${v.id}`">「{{ v.content }}」</b>
            <span class="who-chip">{{ v.mine ? '我立的 🙋' : '💕 TA 立的' }}</span>
            <span class="status-chip" :data-testid="`couple-world-credit-status-${v.id}`">{{ vowStatusText(v) }}</span>
          </p>
          <p class="hint-line">
            <span :data-testid="`couple-world-credit-due-${v.id}`">到期 {{ v.dueDay }}</span> ·
            <span :data-testid="`couple-world-credit-days-${v.id}`">{{ vowDaysText(v) }}</span> ·
            <span :data-testid="`couple-world-credit-witnessed-${v.id}`">{{ v.witnessed ? 'TA 已见证 ✔' : '还没人见证' }}</span>
          </p>
          <p v-if="v.brokenNote" class="breach-line" :data-testid="`couple-world-credit-broken-${v.id}`">💔 塌房记录：{{ v.brokenNote }}</p>
          <div class="inline-form">
            <el-button
              v-if="v.canWitness"
              size="small"
              type="primary"
              :data-testid="`couple-world-credit-witness-${v.id}`"
              @click="onVowWitness(v)"
            >我来见证 🤝</el-button>
            <p v-else-if="v.mine && !v.witnessed && v.status === 'OPEN'" class="wait-line" :data-testid="`couple-world-credit-witness-wait-${v.id}`">
              见证人得是对方，自己见证不作数 🤝
            </p>
          </div>
          <div v-if="v.canBreak" class="inline-form">
            <el-input
              v-model="breakDraft[v.id]"
              :maxlength="BREAK_NOTE_MAX"
              :placeholder="`塌了：写一句事实（≤${BREAK_NOTE_MAX} 字）`"
              :data-testid="`couple-world-credit-break-note-${v.id}`"
            />
            <el-button size="small" type="warning" plain :data-testid="`couple-world-credit-break-${v.id}`" @click="onVowBreak(v)">记一笔塌房 💔</el-button>
          </div>
        </div>
      </template>
      <p v-else class="empty-line">信用所还没开门…</p>
    </CoupleCollapsible>

    <!-- F338 群聊记者：每日一条群里最好笑的素材互递，两人都笑=双双通过 -->
    <CoupleCollapsible testid="couple-world-group">
      <template #title>😂 群聊记者 <span class="sub">「今天群里最好笑的是我们…」每天各交一条素材互递，两个人都笑了这条才算通过</span></template>
      <template v-if="w">
        <p class="section-head">😂 {{ w.group.day }} 的素材（当日本人可改写）</p>
        <el-input
          v-model="groupLine"
          type="textarea"
          :rows="2"
          :maxlength="GROUP_MAX"
          show-word-limit
          :placeholder="`今天群里最好笑的一条（≤${GROUP_MAX} 字）`"
          data-testid="couple-world-group-line"
        />
        <div class="inline-form">
          <el-button size="small" type="primary" data-testid="couple-world-group-submit" @click="onGroupLine">
            {{ w.group.canWrite ? '交今天的素材 😂' : '改写我今天那条 😂' }}
          </el-button>
          <span class="who-chip" data-testid="couple-world-group-state">
            我：{{ w.group.myLine ? '已交 ✔' : '还没写' }} · TA：{{ w.group.partnerLine ? '已交 ✔' : '还没写' }}
          </span>
        </div>
        <p v-if="w.group.myLine" class="group-row mine" data-testid="couple-world-group-mine">我的那条：「{{ w.group.myLine }}」</p>
        <p v-else class="empty-line" data-testid="couple-world-group-mine-wait">今天还没交，第一条从你手上开始 😂</p>
        <p v-if="w.group.partnerLine" class="group-row partner" data-testid="couple-world-group-partner">TA 的那条：「{{ w.group.partnerLine }}」</p>
        <p v-else class="wait-line" data-testid="couple-world-group-partner-wait">等 TA 交那条，两条齐了才能互笑 ⏳</p>
        <div class="inline-form">
          <el-button
            v-if="w.group.canLaugh"
            size="small"
            type="primary"
            plain
            data-testid="couple-world-group-laugh"
            @click="onGroupLaugh"
          >我笑了，这条过了 😂</el-button>
          <span v-else-if="w.group.iLaughed" class="lit-chip" data-testid="couple-world-group-laughed">😂 我这条已经笑过了</span>
          <span v-else class="hint-line" data-testid="couple-world-group-laugh-wait">两条都交了才给笑 😂</span>
          <span v-if="w.group.partnerLaughed" class="status-chip" data-testid="couple-world-group-partner-laughed">💕 TA 也笑了</span>
          <span v-if="w.group.bothLaughed" class="lit-chip" data-testid="couple-world-group-both">🏆 双双通过，今日可称佳话</span>
        </div>
        <p v-if="w.group.line" class="group-receipt" data-testid="couple-world-group-receipt">{{ w.group.line }}</p>
      </template>
      <p v-else class="empty-line">记者证还没发…</p>
    </CoupleCollapsible>

    <!-- F339 代 TA 赔礼：写给 TA 亲友的赔礼信必须经 TA 审阅通过才算送达 -->
    <CoupleCollapsible testid="couple-world-apology" :empty="!hasApologies">
      <template #title>✉️ 代 TA 赔礼 <span class="sub">跟 TA 家里人闹了别扭，信你写、但递出去之前必须 TA 审阅——没通过就不算送达，打回就重写</span></template>
      <template v-if="w">
        <p class="section-head">✉️ 写一封给 TA 亲友的赔礼信</p>
        <div class="inline-form">
          <el-input v-model="apoTo" :maxlength="APO_TO_MAX" :placeholder="`写给谁（称谓，≤${APO_TO_MAX} 字）`" data-testid="couple-world-apology-to" />
          <el-input v-model="apoReason" :maxlength="APO_REASON_MAX" show-word-limit placeholder="来龙去脉（≤200 字，可空）" data-testid="couple-world-apology-reason" />
        </div>
        <el-input
          v-model="apoDraft"
          type="textarea"
          :rows="3"
          :maxlength="APO_DRAFT_MAX"
          show-word-limit
          :placeholder="`信正文（≤${APO_DRAFT_MAX} 字，长了没人听得进去）`"
          data-testid="couple-world-apology-draft"
        />
        <div class="inline-form">
          <el-button size="small" type="primary" data-testid="couple-world-apology-submit" @click="onApologyWrite">交给 TA 审阅 ✉️</el-button>
          <span class="hint-line" data-testid="couple-world-apology-tip">后端给信主本人配了一句开场模板，写信时可以照着起头</span>
        </div>
        <p v-if="!w.apologies.length" class="empty-line">还没写过赔礼信，希望这功能一直用不上 ✉️</p>
        <div
          v-for="a in w.apologies"
          :key="a.id"
          class="apo-row"
          :class="{ 'is-sent': a.status === 'SENT', 'is-back': a.status === 'BACK' }"
          :data-testid="`couple-world-apology-${a.id}`"
        >
          <p class="row-head">
            <b class="apo-to" :data-testid="`couple-world-apology-to-text-${a.id}`">致「{{ a.toPerson }}」</b>
            <span class="who-chip">{{ a.mine ? '我写的 🙋' : '💕 TA 写的' }}</span>
            <span class="status-chip" :data-testid="`couple-world-apology-status-${a.id}`">{{ apoStatusText(a) }}</span>
            <span v-if="a.status === 'SENT'" class="lit-chip" :data-testid="`couple-world-apology-sent-${a.id}`">✉️ 已送达</span>
          </p>
          <p v-if="a.reason" class="hint-line" :data-testid="`couple-world-apology-reason-text-${a.id}`">来龙去脉：{{ a.reason }}</p>
          <p class="apo-draft" :data-testid="`couple-world-apology-draft-text-${a.id}`">{{ a.draft }}</p>
          <p v-if="a.reviewNote" class="verdict-line" :data-testid="`couple-world-apology-note-${a.id}`">🪞 审阅意见：{{ a.reviewNote }}</p>
          <div v-if="a.mine && a.template" class="inline-form">
            <p class="tpl-line" :data-testid="`couple-world-apology-tpl-${a.id}`">后端给的开场：{{ a.template }}</p>
            <el-button v-if="a.status !== 'SENT'" size="small" plain :data-testid="`couple-world-apology-use-tpl-${a.id}`" @click="onApologyUseTemplate(a)">
              抄进我的草稿 📝
            </el-button>
          </div>
          <!-- TA 写的、还在 OPEN 的信才给我审阅（自己审自己后端 400「不算送达」） -->
          <template v-if="!a.mine && a.status === 'OPEN'">
            <div class="inline-form">
              <el-input
                v-model="reviewDraft[a.id]"
                :maxlength="REVIEW_NOTE_MAX"
                :placeholder="`审阅意见（≤${REVIEW_NOTE_MAX} 字，打回必填一句改哪儿）`"
                :data-testid="`couple-world-apology-review-note-${a.id}`"
              />
            </div>
            <div class="inline-form">
              <el-button size="small" type="primary" :data-testid="`couple-world-apology-pass-${a.id}`" @click="onApologyReview(a, true)">通过，替 TA 递出去 ✉️</el-button>
              <el-button size="small" type="warning" plain :data-testid="`couple-world-apology-back-${a.id}`" @click="onApologyReview(a, false)">打回重写 🙅</el-button>
            </div>
          </template>
          <p v-else-if="a.mine && a.status === 'OPEN'" class="wait-line" :data-testid="`couple-world-apology-wait-${a.id}`">
            信在 TA 手里等审阅——没通过之前不算送达 ⏳
          </p>
          <!-- 被打回的信只有本人能重写 -->
          <template v-else-if="a.mine && a.status === 'BACK'">
            <div class="inline-form">
              <el-input
                v-model="rewriteDraft[a.id]"
                type="textarea"
                :rows="2"
                :maxlength="APO_DRAFT_MAX"
                show-word-limit
                :placeholder="`按批注重写（≤${APO_DRAFT_MAX} 字）`"
                :data-testid="`couple-world-apology-rewrite-${a.id}`"
              />
            </div>
            <div class="inline-form">
              <el-button size="small" type="primary" plain :data-testid="`couple-world-apology-rewrite-btn-${a.id}`" @click="onApologyRewrite(a)">重写再交 ✉️</el-button>
            </div>
          </template>
          <p v-else-if="!a.mine && a.status === 'BACK'" class="wait-line" :data-testid="`couple-world-apology-rewrite-lock-${a.id}`">
            打回去了，信主本人才能改 🙅
          </p>
        </div>
      </template>
      <p v-else class="empty-line">邮局窗口还没开…</p>
    </CoupleCollapsible>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { worldApi } from '@/api/couple'
import type {
  CoupleWorldApologyVO,
  CoupleWorldCaptionVO,
  CoupleWorldCityVO,
  CoupleWorldGiftVO,
  CoupleWorldRelativeVO,
  CoupleWorldVisitSide,
  CoupleWorldVisitVO,
  CoupleWorldVO,
  CoupleWorldViewVO,
  CoupleWorldVowVO,
} from '@/types'
import CoupleCollapsible from './CoupleCollapsible.vue'
import { useAuthStore } from '@/stores/auth'

/** 限长常量抄自后端 CoupleWorldService（只用于输入框限长与提示文案，业务判定一律留在后端 400 直透） */
const PREP_MAX = 60
const PREP_LIMIT = 8
const REPORT_MAX = 200
const GIFT_PERSON_MAX = 30
const GIFT_IDEA_MAX = 80
const GIFT_FIELD_MAX = 60
const VIEW_ANSWER_MAX = 200
const VIEW_PERSON_MAX = 30
const DECLARE_MAX = 200
const CAPTION_MAX = 140
const CITY_MAX = 30
const ITIN_ITEM_MAX = 60
const ITIN_LIMIT = 8
const PACK_LIMIT = 12
const CITY_TEXT_MAX = 140
const TERM_MAX = 20
const QNA_MAX = 140
const REL_ANSWER_MAX = 80
const VOW_MAX = 140
const BREAK_NOTE_MAX = 80
const GROUP_MAX = 200
const APO_TO_MAX = 30
const APO_REASON_MAX = 200
const APO_DRAFT_MAX = 300
const REVIEW_NOTE_MAX = 140
const DAY_MAX = 10
/** F334 每人每天三条候选（后端 CoupleWorldCaption.SLOT_MAX=3，越界 400「一天最多交三条候选」） */
const CAPTION_SLOTS = [1, 2, 3] as const

/** 整份两家与朋友总览（1 读 + 21 写全部返回整份 WorldVO，整体替换即十卡刷新） */
const w = ref<CoupleWorldVO | null>(null)
const auth = useAuthStore()
const myName = computed(() => auth.username)

// ---- 草稿：F330 拜访攻略 ----
const visitDay = ref('')
const visitSide = ref<CoupleWorldVisitSide>('MINE')
const visitPreps = ref('')
const reportDraft = ref<Record<string, string>>({})
// ---- 草稿：F331 送礼互助池 ----
const giftPerson = ref('')
const giftIdea = ref('')
const giftBudget = ref('')
const giftAvoid = ref('')
// ---- 草稿：F332 他观问卷 ----
const viewAsked = ref<Record<string, string>>({})
const viewAnswer = ref<Record<string, string>>({})
// ---- 草稿：F333 官宣日 ----
const declareText = ref('')
// ---- 草稿：F334 文案代写 ----
const captionDraft = ref<Record<number, string>>({ 1: '', 2: '', 3: '' })
// ---- 草稿：F335 进城接待 ----
const cityName = ref('')
const cityDay = ref('')
const cityItinerary = ref('')
const cityTransport = ref('')
const cityPack = ref('')
const cityEditing = ref('')
// ---- 草稿：F336 亲戚称呼册 ----
const relTerm = ref('')
const relQuestion = ref('')
const relAnswer = ref('')
const relTryDraft = ref<Record<string, string>>({})
// ---- 草稿：F337 社会信用 ----
const vowContent = ref('')
const vowDue = ref('')
const breakDraft = ref<Record<string, string>>({})
// ---- 草稿：F338 群聊记者 ----
const groupLine = ref('')
// ---- 草稿：F339 代 TA 赔礼 ----
const apoTo = ref('')
const apoReason = ref('')
const apoDraft = ref('')
const reviewDraft = ref<Record<string, string>>({})
const rewriteDraft = ref<Record<string, string>>({})

// ---- 派生 ----
const hasVisits = computed(() => (w.value?.visits.length ?? 0) > 0)
const hasGifts = computed(() => (w.value?.gifts.length ?? 0) > 0)
const hasRelatives = computed(() => (w.value?.relatives.length ?? 0) > 0)
const hasVows = computed(() => (w.value?.vows.length ?? 0) > 0)
const hasApologies = computed(() => (w.value?.apologies.length ?? 0) > 0)
/** F332 三题都回填了才出他观卡 */
const viewsFilled = computed(() => (w.value?.views ?? []).filter((v) => v.filled).length)
/** F333 本月是否已经有人发过官宣卡（后端一月一张，前端先挡住重复提交口） */
const declaredThisMonth = computed(() => !!w.value && w.value.declares.some((d) => d.month === w.value?.month))
/** F334 今天的双人候选（选稿只在今天这拨里做） */
const todayCaptions = computed(() => (w.value?.captions ?? []).filter((c) => c.day === w.value?.day))
const myTodayCaptions = computed(() => todayCaptions.value.filter((c) => c.mine))
const partnerTodayCaptions = computed(() => todayCaptions.value.filter((c) => !c.mine))
const wonHistory = computed(() => (w.value?.captions ?? []).filter((c) => c.won && c.day !== w.value?.day))
/** F336 错题进考前强化（wrongCount>0，后端已把它排到最前） */
const examRows = computed(() => (w.value?.relatives ?? []).filter((r) => r.wrongCount > 0))
/** F337 社会信用三项计数 */
const keptCount = computed(() => (w.value?.vows ?? []).filter((v) => v.status === 'KEPT').length)
const openCount = computed(() => (w.value?.vows ?? []).filter((v) => v.status === 'OPEN').length)
const brokenCount = computed(() => (w.value?.vows ?? []).filter((v) => v.status === 'BROKEN').length)

const slotKey = (slot: number) => String(slot)

function prepKindText(kind: string): string {
  if (kind === 'BRING') return '🎒 带什么'
  if (kind === 'MINE') return '💣 雷区'
  return '💬 聊什么'
}

function visitStatusText(v: CoupleWorldVisitVO): string {
  if (v.status === 'DONE') return '战报已交 📣'
  return v.confirmed ? '双确认待到场 🧧' : '等 TA 双确认 ⏳'
}

function giftStatusText(g: CoupleWorldGiftVO): string {
  if (g.status === 'BOUGHT') return '买回来了 ✔'
  if (g.status === 'TAKEN') return '已接单代买 🛒'
  return '在池子里等人接 🎁'
}

/** 买回登记的钥匙在「接单的人」手里：后端不下发 iTook，按 takerUser 与本人用户名比（同批次二十的做法） */
function giftCanBought(g: CoupleWorldGiftVO): boolean {
  return g.status === 'TAKEN' && g.takerUser === myName.value
}

function cityCountText(c: CoupleWorldCityVO): string {
  if (c.daysLeft < 0) return '没定到访日 🧳'
  if (c.daysLeft === 0) return '今天就到 🧳'
  return `还有 ${c.daysLeft} 天 🧳`
}

function vowStatusText(v: CoupleWorldVowVO): string {
  if (v.status === 'KEPT') return '到期解除，说到做到 🏅'
  if (v.status === 'BROKEN') return '塌房了 💔'
  return v.witnessed ? '在保中，TA 已见证 🤝' : '在保中，等 TA 见证 ⏳'
}

function vowDaysText(v: CoupleWorldVowVO): string {
  if (v.status !== 'OPEN') return '已收尾'
  return v.daysLeft > 0 ? `还剩 ${v.daysLeft} 天` : '今天到期'
}

function apoStatusText(a: CoupleWorldApologyVO): string {
  if (a.status === 'SENT') return '审阅通过，已送达 ✉️'
  if (a.status === 'BACK') return '被打回，等重写 🙅'
  return a.mine ? '等 TA 审阅 ⏳' : '等你审阅 ✉️'
}

function myCaptionFilled(slot: number): boolean {
  return myTodayCaptions.value.some((c) => c.slot === slot)
}

function onError(e: unknown, fallback: string) {
  // 后端 400 的中文 message 直接透传（例如「自己写的稿自己定不算互评选稿」「到期日要在以后」）
  ElMessage.error(e instanceof Error ? e.message : fallback)
}

/**
 * 写接口统一返回整份 WorldVO：整体替换即十卡刷新。
 * 替换后把「本人当天可改写」的输入框回填一次（F334 三稿 / F338 今日素材），
 * 行内草稿（战报/审阅/塌房/重写/作答）按 id 定位，一律清空重填。
 */
function refresh(data: CoupleWorldVO | null | undefined) {
  if (!data) return
  w.value = data
  const drafts: Record<number, string> = { 1: '', 2: '', 3: '' }
  data.captions
    .filter((c) => c.mine && c.day === data.day)
    .forEach((c) => {
      drafts[c.slot] = c.text
    })
  captionDraft.value = drafts
  groupLine.value = data.group.myLine
}

// ---- F330 拜访攻略 ----
async function onVisitAdd() {
  const items = visitPreps.value.split(/\n|,|、/).map((t) => t.trim()).filter(Boolean)
  if (!items.length) {
    ElMessage.warning('至少写一条前置任务：带什么 / 聊什么 / 雷区 🧧')
    return
  }
  if (items.length > PREP_LIMIT) {
    ElMessage.warning(`任务卡最多 ${PREP_LIMIT} 条，先顾眼前 🧧`)
    return
  }
  try {
    refresh(await worldApi.worldVisit(visitDay.value.trim(), visitSide.value, items.join('\n')))
    visitDay.value = ''
    visitPreps.value = ''
    ElMessage.success('攻略写好了，等 TA 确认才算双确认 🧧')
  } catch (e) {
    onError(e, '写攻略失败')
  }
}

async function onVisitConfirm(v: CoupleWorldVisitVO) {
  try {
    refresh(await worldApi.worldVisitConfirm(v.id))
    ElMessage.success('确认了，雷区都提前标好了 🤝')
  } catch (e) {
    onError(e, '确认攻略失败')
  }
}

async function onVisitReport(v: CoupleWorldVisitVO) {
  const report = (reportDraft.value[v.id] ?? '').trim()
  if (!report) {
    ElMessage.warning('战报要写一句：哪句接住了、哪句差点翻车 📣')
    return
  }
  try {
    refresh(await worldApi.worldVisitReport(v.id, report))
    reportDraft.value = { ...reportDraft.value, [v.id]: '' }
    ElMessage.success('战报交上去了，这一趟算过去了 📣')
  } catch (e) {
    onError(e, '交战报失败')
  }
}

// ---- F331 送礼互助池 ----
async function onGiftAdd() {
  const person = giftPerson.value.trim()
  const idea = giftIdea.value.trim()
  if (!person) {
    ElMessage.warning('送谁要写清（称谓就行）🎁')
    return
  }
  if (!idea) {
    ElMessage.warning('灵感要写一句，空着池子接不住 🎁')
    return
  }
  try {
    refresh(await worldApi.worldGift(person, idea, giftBudget.value.trim(), giftAvoid.value.trim()))
    giftPerson.value = ''
    giftIdea.value = ''
    giftBudget.value = ''
    giftAvoid.value = ''
    ElMessage.success('丢进池子了，等 TA 接单 🎁')
  } catch (e) {
    onError(e, '收灵感失败')
  }
}

async function onGiftTake(g: CoupleWorldGiftVO) {
  try {
    refresh(await worldApi.worldGiftTake(g.id))
    ElMessage.success('接单了，这礼我替 TA 买 🛒')
  } catch (e) {
    onError(e, '接单失败')
  }
}

async function onGiftBought(g: CoupleWorldGiftVO) {
  try {
    refresh(await worldApi.worldGiftBought(g.id))
    ElMessage.success('买回来了，这单销账 ✔')
  } catch (e) {
    onError(e, '登记买回失败')
  }
}

// ---- F332 朋友视角问卷 ----
async function onViewFill(v: CoupleWorldViewVO) {
  const answer = (viewAnswer.value[slotKey(v.slot)] ?? '').trim()
  if (!answer) {
    ElMessage.warning('朋友的原话要写一句，别空着 🪞')
    return
  }
  try {
    refresh(await worldApi.worldFriendView(v.slot, (viewAsked.value[slotKey(v.slot)] ?? '').trim(), answer))
    viewAnswer.value = { ...viewAnswer.value, [slotKey(v.slot)]: '' }
    ElMessage.success(`第 ${v.slot} 题回填了，外人眼里的我们又多一行 🪞`)
  } catch (e) {
    onError(e, '回填他观失败')
  }
}

// ---- F333 官宣日 ----
async function onDeclare() {
  const text = declareText.value.trim()
  if (!text) {
    ElMessage.warning('这个月想对外说的那句，总得写出来 📣')
    return
  }
  try {
    refresh(await worldApi.worldDeclare(text))
    declareText.value = ''
    ElMessage.success('本月官宣卡发进编年了 📣')
  } catch (e) {
    onError(e, '发官宣卡失败')
  }
}

// ---- F334 文案代写 ----
async function onCaptionSubmit(slot: number) {
  const text = (captionDraft.value[slot] ?? '').trim()
  if (!text) {
    ElMessage.warning(`第 ${slot} 条候选还空着，写一句再交 📝`)
    return
  }
  try {
    refresh(await worldApi.worldCaption(slot, text))
    ElMessage.success(`第 ${slot} 条候选交上了，等 TA 来挑 📝`)
  } catch (e) {
    onError(e, '交候选失败')
  }
}

async function onCaptionPick(c: CoupleWorldCaptionVO) {
  try {
    refresh(await worldApi.worldCaptionPick(c.id))
    ElMessage.success('定稿了，这条以后在百科里能翻到 🏆')
  } catch (e) {
    onError(e, '选稿失败')
  }
}

// ---- F335 进城接待方案 ----
function resetCityForm() {
  cityEditing.value = ''
  cityName.value = ''
  cityDay.value = ''
  cityItinerary.value = ''
  cityTransport.value = ''
  cityPack.value = ''
}

function onPackTemplate(item: string) {
  const lines = cityPack.value.split(/\n|,|、/).map((t) => t.trim()).filter(Boolean)
  if (lines.length >= PACK_LIMIT) {
    ElMessage.warning(`小包最多 ${PACK_LIMIT} 项，带不动 🧳`)
    return
  }
  if (lines.includes(item)) {
    ElMessage.warning('这项已经在清单里了 🧳')
    return
  }
  lines.push(item)
  cityPack.value = lines.join('\n')
}

async function onCitySave() {
  const city = cityName.value.trim()
  if (!city) {
    ElMessage.warning('哪座城市得写出来 🧳')
    return
  }
  const itinerary = cityItinerary.value.split(/\n|,|、/).map((t) => t.trim()).filter(Boolean)
  if (!itinerary.length) {
    ElMessage.warning('行程至少排一条，别让人家到了再问去哪儿 🧳')
    return
  }
  if (itinerary.length > ITIN_LIMIT) {
    ElMessage.warning(`行程最多 ${ITIN_LIMIT} 条，排太满走不动 🧳`)
    return
  }
  try {
    refresh(await worldApi.worldCity(
      city,
      cityDay.value.trim(),
      itinerary.join('\n'),
      cityTransport.value.trim(),
      cityPack.value.split(/\n|,|、/).map((t) => t.trim()).filter(Boolean).join('\n'),
    ))
    resetCityForm()
    ElMessage.success(`${city} 的接待手册存好了，行程和小包清单都排上了 🧳`)
  } catch (e) {
    onError(e, '存接待手册失败')
  }
}

function onCityEdit(c: CoupleWorldCityVO) {
  cityEditing.value = c.city
  cityName.value = c.city
  cityDay.value = c.arriveDay
  cityItinerary.value = c.itinerary.join('\n')
  cityTransport.value = c.transport
  cityPack.value = c.packList.join('\n')
}

// ---- F336 亲戚称呼册 ----
async function onRelativeAdd() {
  const term = relTerm.value.trim()
  if (!term) {
    ElMessage.warning('称谓本体要写（如「舅舅的妻子」）📖')
    return
  }
  const question = relQuestion.value.trim()
  if (!question) {
    ElMessage.warning('题面要写一句，不然考什么 📖')
    return
  }
  const answer = relAnswer.value.trim()
  if (!answer) {
    ElMessage.warning('标准答案要写一个称呼 📖')
    return
  }
  try {
    refresh(await worldApi.worldRelative(term, question, answer))
    relTerm.value = ''
    relQuestion.value = ''
    relAnswer.value = ''
    ElMessage.success('上册了，等 TA 来答 📖')
  } catch (e) {
    onError(e, '出题失败')
  }
}

async function onRelativeTry(r: CoupleWorldRelativeVO) {
  const answer = (relTryDraft.value[r.id] ?? '').trim()
  if (!answer) {
    ElMessage.warning('答案要写一个称呼，别空着交卷 📖')
    return
  }
  try {
    refresh(await worldApi.worldRelativeTry(r.id, answer))
    relTryDraft.value = { ...relTryDraft.value, [r.id]: '' }
    ElMessage.success('交卷了，答没答对 TA 那边看得到 📖')
  } catch (e) {
    onError(e, '交卷失败')
  }
}

// ---- F337 社会信用 ----
async function onVowAdd() {
  const content = vowContent.value.trim()
  if (!content) {
    ElMessage.warning('保证不做什么都要写清 🤝')
    return
  }
  const dueDay = vowDue.value.trim()
  // 与后端同口径的前置提醒：到期日必须在以后（硬提交仍以 400 直透为准）
  if (dueDay && w.value && dueDay <= w.value.day) {
    ElMessage.warning('到期日要在以后，当天保证等于没保证 🤝')
    return
  }
  try {
    refresh(await worldApi.worldVow(content, dueDay))
    vowContent.value = ''
    vowDue.value = ''
    ElMessage.success('公开立下了，等 TA 见证 🤝')
  } catch (e) {
    onError(e, '立保证失败')
  }
}

async function onVowWitness(v: CoupleWorldVowVO) {
  try {
    refresh(await worldApi.worldVowWitness(v.id))
    ElMessage.success('见证完成，到期没犯就自动解除 🤝')
  } catch (e) {
    onError(e, '见证失败')
  }
}

async function onVowBreak(v: CoupleWorldVowVO) {
  const note = (breakDraft.value[v.id] ?? '').trim()
  if (!note) {
    ElMessage.warning('塌房要写一句事实，别只写「TA 又犯了」💔')
    return
  }
  try {
    refresh(await worldApi.worldVowBreak(v.id, note))
    breakDraft.value = { ...breakDraft.value, [v.id]: '' }
    ElMessage.success('记上了，留着当下次的前车 💔')
  } catch (e) {
    onError(e, '记塌房失败')
  }
}

// ---- F338 群聊记者 ----
async function onGroupLine() {
  const line = groupLine.value.trim()
  if (!line) {
    ElMessage.warning('今天群里最好笑的那条，得写出来 😂')
    return
  }
  try {
    refresh(await worldApi.worldGroup(line))
    ElMessage.success('素材交上去了，等 TA 那条 😂')
  } catch (e) {
    onError(e, '交素材失败')
  }
}

async function onGroupLaugh() {
  try {
    refresh(await worldApi.worldGroupLaugh())
    ElMessage.success('笑了，这条今天就算过了 😂')
  } catch (e) {
    onError(e, '笑失败')
  }
}

// ---- F339 代 TA 赔礼 ----
async function onApologyWrite() {
  const toPerson = apoTo.value.trim()
  if (!toPerson) {
    ElMessage.warning('写给谁（称谓）要写清 ✉️')
    return
  }
  const draft = apoDraft.value.trim()
  if (!draft) {
    ElMessage.warning('信正文要写，空信递不出去 ✉️')
    return
  }
  try {
    refresh(await worldApi.worldApology(toPerson, apoReason.value.trim(), draft))
    apoTo.value = ''
    apoReason.value = ''
    apoDraft.value = ''
    ElMessage.success('写好了，等 TA 审阅通过才算送达 ✉️')
  } catch (e) {
    onError(e, '写赔礼信失败')
  }
}

async function onApologyReview(a: CoupleWorldApologyVO, pass: boolean) {
  const note = (reviewDraft.value[a.id] ?? '').trim()
  if (!pass && !note) {
    // 与后端同口径的前置提醒：打回必填一句改哪儿（硬提交仍以 400 直透为准）
    ElMessage.warning('打回要写一句改哪儿 🙅')
    return
  }
  try {
    refresh(await worldApi.worldApologyReview(a.id, pass, note))
    reviewDraft.value = { ...reviewDraft.value, [a.id]: '' }
    ElMessage.success(pass ? '审阅通过，这封由你替 TA 递出去 ✉️' : '打回去了，等信主重写 🙅')
  } catch (e) {
    onError(e, '审阅失败')
  }
}

async function onApologyRewrite(a: CoupleWorldApologyVO) {
  const draft = (rewriteDraft.value[a.id] ?? '').trim()
  if (!draft) {
    ElMessage.warning('重写至少写正文，别空着再交 ✉️')
    return
  }
  try {
    refresh(await worldApi.worldApologyRewrite(a.id, draft))
    rewriteDraft.value = { ...rewriteDraft.value, [a.id]: '' }
    ElMessage.success('重写好了，再审一次 ✉️')
  } catch (e) {
    onError(e, '重写失败')
  }
}

function onApologyUseTemplate(a: CoupleWorldApologyVO) {
  apoTo.value = a.toPerson
  apoDraft.value = a.template
  ElMessage.success('开场抄进草稿了，接着写你自己的那句 ✉️')
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
  const data = await safeLoad(worldApi.world, null)
  if (data) refresh(data)
})
</script>

<style scoped>
/* 主色人情茶褐 #a0522d（牛皮纸请柬 + 走亲访友的茶色，「两家与朋友」这批讲的是人情往来，
   不是两个人的粉红；全仓 grep src/components/couple/*.vue 确认零占用：既有主色已用掉
   #f56c6c 粉红 / #67c23a 绿 / #16a34a 监护绿 / #e6a23c 安眠暖橙 / #d93a3a 中国红 / #c0392b 庆典朱红 /
   #b8860b 鎏金点缀 / #409eff 公司蓝 / #0284c7 天蓝 / #3f51b5 靛蓝 / #9254de 紫 / #2c7a7b 墨青 /
   #0d9488 剧幕青绿 / #d2691e 工坊橙棕（本色比它更暗更收，且不同屏不同调），
   也避开全局六套皮肤强调色与气泡渐变端点（#ec5f92/#3370ff/#8b5cf6/#10b981/#f97316/#06b6d4/#7c3aed，
   见 src/style.css 与 utils/settings.ts）；本组件不写 .title 规则，折叠卡标题色一律经
   --collapse-title-color 级联给 CoupleCollapsible */
.couple-world { display: flex; flex-direction: column; gap: 14px; --collapse-title-color: #a0522d; }
.sub { font-size: 12px; color: var(--im-muted, #909399); font-weight: normal; margin-left: 6px; }
.section-head { margin: 10px 0 4px; font-size: 13px; font-weight: bold; color: #a0522d; }
.inline-form { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 8px; }
.inline-form .el-input { flex: 1; min-width: 150px; }
.empty-line { margin: 8px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.hint-line { font-size: 12px; color: var(--im-muted, #909399); }
.wait-line { margin: 6px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.who-chip { font-size: 11px; color: var(--im-muted, #909399); }
.day-chip, .status-chip, .host-chip, .slot-chip { font-size: 11px; color: #a0522d; background: rgba(160, 82, 45, 0.12); padding: 1px 8px; border-radius: 10px; }
.lit-chip { font-size: 12px; color: #a0522d; background: rgba(160, 82, 45, 0.1); padding: 2px 8px; border-radius: 6px; }
.breach-chip { font-size: 11px; color: #d93a3a; background: rgba(217, 58, 58, 0.1); padding: 1px 8px; border-radius: 10px; }
.breach-line { margin: 4px 0 0; font-size: 12px; color: #d93a3a; }
.verdict-line { margin: 4px 0 0; font-size: 12px; color: #b8860b; }
.row-head { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; margin: 0; }
.side-select { width: 110px; }
/* F330 拜访攻略 */
.visit-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid var(--im-border, #ebeef5); font-size: 13px; }
.visit-row.is-paired { border-left-color: #a0522d; }
.visit-row.is-done { border-left-color: #b8860b; }
.prep-list { margin: 4px 0 0; padding-left: 18px; font-size: 13px; color: var(--im-text, #303133); }
.prep-kind { margin-right: 6px; font-size: 11px; color: #a0522d; }
.paired-line { margin: 4px 0 0; font-size: 12px; color: #a0522d; }
.report-line { margin: 4px 0 0; font-size: 13px; color: #b8860b; }
/* F331 送礼互助池 */
.gift-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid var(--im-border, #ebeef5); font-size: 13px; }
.gift-row.is-taken { border-left-color: #a0522d; }
.gift-row.is-bought { border-left-color: #b8860b; }
.gift-person { color: #a0522d; font-size: 14px; }
.gift-idea { margin: 3px 0 0; color: var(--im-text, #303133); }
.avoid-line { margin-right: 8px; color: #d93a3a; }
.taker-line { margin: 3px 0 0; font-size: 12px; color: #a0522d; }
/* F332 他观问卷 */
.view-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid var(--im-border, #ebeef5); font-size: 13px; }
.view-row.is-filled { border-left-color: #a0522d; }
.view-question { color: var(--im-text, #303133); }
.view-answer { margin: 4px 0 0; font-size: 13px; color: #a0522d; }
.view-card { margin: 10px 0 0; padding: 6px 10px; border-radius: 8px; font-size: 13px; color: #a0522d; background: rgba(160, 82, 45, 0.08); }
/* F333 官宣日 */
.declare-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid var(--im-border, #ebeef5); font-size: 13px; }
.declare-row.is-current { border-left-color: #a0522d; }
.declare-text { margin: 3px 0 0; color: var(--im-text, #303133); }
/* F334 文案代写 */
.cap-stat { margin: 8px 0 0; font-size: 12px; color: #a0522d; }
.cap-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid var(--im-border, #ebeef5); font-size: 13px; }
.cap-row.is-won { border-left-color: #b8860b; }
.cap-text { margin: 3px 0 0; color: var(--im-text, #303133); }
/* F335 进城接待 */
.city-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid #a0522d; font-size: 13px; }
.city-name { color: #a0522d; font-size: 14px; }
.city-list { margin: 4px 0 0; padding-left: 20px; color: var(--im-text, #303133); }
.pack-tpl { margin: 8px 0 0; font-size: 12px; color: #a0522d; }
.pack-line { margin: 6px 0 0; font-size: 12px; color: #a0522d; }
.chip-row { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 6px; }
.tpl-chip { border: 1px dashed #a0522d; background: transparent; color: #a0522d; font-size: 12px; padding: 2px 8px; border-radius: 12px; cursor: pointer; }
.tpl-chip:hover { background: rgba(160, 82, 45, 0.08); }
.pack-chip { font-size: 12px; color: #a0522d; background: rgba(160, 82, 45, 0.1); padding: 2px 8px; border-radius: 10px; }
/* F336 亲戚称呼册 */
.exam-bar { margin: 8px 0 0; font-size: 12px; color: #d93a3a; }
.rel-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid var(--im-border, #ebeef5); font-size: 13px; }
.rel-row.is-exam { border-left-color: #d93a3a; }
.rel-term { color: #a0522d; font-size: 14px; }
.rel-question { margin: 3px 0 0; color: var(--im-text, #303133); }
/* F337 社会信用 */
.credit-bar { margin: 8px 0 0; font-size: 12px; color: #a0522d; }
.vow-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid var(--im-border, #ebeef5); font-size: 13px; }
.vow-row.is-kept { border-left-color: #b8860b; }
.vow-row.is-broken { border-left-color: #d93a3a; }
.vow-content { color: var(--im-text, #303133); }
/* F338 群聊记者 */
.group-row { margin: 6px 0 0; padding: 6px 10px; border-radius: 8px; font-size: 13px; }
.group-row.mine { color: #a0522d; background: rgba(160, 82, 45, 0.08); }
.group-row.partner { color: var(--im-text, #303133); background: var(--im-bg, #fafafa); }
.group-receipt { margin: 8px 0 0; padding: 6px 10px; border-radius: 8px; font-size: 13px; color: #b8860b; background: rgba(184, 134, 11, 0.08); }
/* F339 代 TA 赔礼 */
.apo-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid var(--im-border, #ebeef5); font-size: 13px; }
.apo-row.is-sent { border-left-color: #b8860b; }
.apo-row.is-back { border-left-color: #d93a3a; }
.apo-to { color: #a0522d; font-size: 14px; }
.apo-draft { margin: 3px 0 0; white-space: pre-wrap; color: var(--im-text, #303133); }
.tpl-line { margin: 0; font-size: 12px; color: var(--im-muted, #909399); }
</style>

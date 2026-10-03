<template>
  <div class="couple-laugh" data-testid="couple-laugh">
    <!-- F390 笑点存档：笑到肚子疼的时刻按天记一笔，对方事后补一份「现场证词」 -->
    <CoupleCollapsible testid="couple-laugh-moment" :empty="!v">
      <template #title>😂 笑点存档 <span class="sub">把笑到肚子疼的那个时刻存下来：叫什么 + 谁干的 + 现场还原（≤{{ MOMENT_SCENE_MAX }} 字）+ 好笑度 1-5。证词只能由对方补，一条只补一次；同一个日子你最多存 {{ MOMENT_PER_DAY_MAX }} 条</span></template>
      <template v-if="v">
        <p class="section-head">😂 存一条今天想起来还想笑的事</p>
        <div class="inline-form">
          <el-input v-model="momentDay" :maxlength="DAY_LEN" placeholder="发生的日子（yyyy-MM-dd，空=今天）" data-testid="couple-laugh-moment-day" />
          <el-input v-model="momentTitle" :maxlength="MOMENT_TITLE_MAX" show-word-limit :placeholder="`这条笑点叫什么（≤${MOMENT_TITLE_MAX} 字）`" data-testid="couple-laugh-moment-title" />
          <el-input v-model="momentCulprit" :maxlength="MOMENT_CULPRIT_MAX" show-word-limit :placeholder="`谁干的（≤${MOMENT_CULPRIT_MAX} 字，可空）`" data-testid="couple-laugh-moment-culprit" />
        </div>
        <el-input v-model="momentScene" type="textarea" :rows="2" :maxlength="MOMENT_SCENE_MAX" show-word-limit :placeholder="`现场还原（≤${MOMENT_SCENE_MAX} 字，可空）`" data-testid="couple-laugh-moment-scene" />
        <div class="chip-row">
          <span class="pick-label">好笑度</span>
          <button
            v-for="lv in LEVELS"
            :key="lv"
            type="button"
            class="day-pick"
            :class="{ 'is-picked': funLevel === lv }"
            :data-testid="`couple-laugh-moment-level-${lv}`"
            @click="funLevel = lv"
          >
            {{ lv }} 分
          </button>
        </div>
        <el-button size="small" type="primary" data-testid="couple-laugh-moment-submit" @click="onMoment">存进笑点簿 😂</el-button>
        <p class="quota-line" data-testid="couple-laugh-moment-quota">我存过 {{ myMomentCount }} 条 · TA 存了 {{ partnerMomentCount }} 条（同一个日子每人最多 {{ MOMENT_PER_DAY_MAX }} 条，⚠️ 后端那句「一天最多存 3 条」数的是你填的那个事发日）</p>

        <p class="section-head">📖 笑点簿（新的在前，最多显示 {{ MOMENT_LIST_MAX }} 条）</p>
        <p v-if="!v.moments.length" class="empty-line" data-testid="couple-laugh-moment-none">笑点簿还空着——想起哪次笑到不行，就现在写下来 😂</p>
        <div v-for="m in v.moments" :key="m.id" class="row-card" :class="{ 'is-partner': !m.mine, 'is-lit': m.witnessed }" :data-testid="`couple-laugh-moment-${m.id}`">
          <p class="row-head">
            <span class="day-chip" :data-testid="`couple-laugh-moment-day-text-${m.id}`">{{ m.day }}</span>
            <span class="title-chip" :data-testid="`couple-laugh-moment-title-text-${m.id}`">{{ m.title }}</span>
            <span class="who-chip" :data-testid="`couple-laugh-moment-who-${m.id}`">{{ m.mine ? '我存的 🙋' : '💕 TA 存的' }}</span>
            <span class="level-chip" :data-testid="`couple-laugh-moment-level-text-${m.id}`">好笑度 {{ m.funLevel }}/5</span>
            <span v-if="m.witnessed" class="lit-chip" :data-testid="`couple-laugh-moment-witnessed-${m.id}`">双人认证 🎤</span>
          </p>
          <p v-if="m.culprit" class="row-meta"><span :data-testid="`couple-laugh-moment-culprit-${m.id}`">肇事者：{{ m.culprit }}</span></p>
          <p v-if="m.scene" class="row-quote" :data-testid="`couple-laugh-moment-scene-text-${m.id}`">现场：{{ m.scene }}</p>
          <p v-if="m.witness" class="row-quote" :data-testid="`couple-laugh-moment-witness-text-${m.id}`">证词（{{ m.witnessBy }}）：「{{ m.witness }}」</p>
          <div v-if="m.canWitness" class="inline-form">
            <el-input v-model="witnessDraft[m.id]" :maxlength="MOMENT_WITNESS_MAX" show-word-limit :placeholder="`补一句现场证词（≤${MOMENT_WITNESS_MAX} 字）`" :data-testid="`couple-laugh-moment-witness-input-${m.id}`" />
            <el-button size="small" plain :data-testid="`couple-laugh-moment-witness-btn-${m.id}`" @click="onWitness(m.id)">我作证 🎤</el-button>
          </div>
          <p v-else-if="m.mine && !m.witnessed" class="wait-line" :data-testid="`couple-laugh-moment-witness-wait-${m.id}`">证词要对方补——自己夸现场没意思 🎤</p>
        </div>
      </template>
      <p v-else class="empty-line">还没拿到欢笑银行总览……</p>
    </CoupleCollapsible>

    <!-- F391 每日一逗：按周轮换值班喜剧人，交节目归值班的人，判分归对方 -->
    <CoupleCollapsible testid="couple-laugh-daily" :empty="!v">
      <template #title>🎪 每日一逗 <span class="sub">每天一格，谁值班由后端按周轮换算出来（前端算不了）：值班的人交节目（≤{{ DAILY_CONTENT_MAX }} 字），判分归对方——真笑了 / 没笑 / 强撑的笑，判完两边都看得见</span></template>
      <template v-if="v">
        <p v-if="v.rotationHint" class="lit-line" data-testid="couple-laugh-daily-rotation">{{ v.rotationHint }}</p>
        <p class="section-head">🎪 上台交节目</p>
        <el-input v-model="dailyContent" type="textarea" :rows="2" :maxlength="DAILY_CONTENT_MAX" show-word-limit :placeholder="`今天打算用什么逗，写出来（≤${DAILY_CONTENT_MAX} 字）`" data-testid="couple-laugh-daily-content" />
        <el-button size="small" type="primary" data-testid="couple-laugh-daily-submit" @click="onDailyServe">
          {{ v.today && v.today.canServe && !v.today.judged ? '改写我今天的节目 🎪' : '交今天的节目 🎪' }}
        </el-button>

        <p class="section-head">📋 今天那一格</p>
        <div class="row-card" :class="{ 'is-lit': !!v.today && v.today.judged }" data-testid="couple-laugh-daily-today">
          <template v-if="v.today">
            <p class="row-head">
              <span class="day-chip" data-testid="couple-laugh-daily-day">{{ v.today.day }}</span>
              <span class="who-chip" data-testid="couple-laugh-daily-owner">{{ v.today.mineOwner ? '我今天值班 🙋' : '💕 TA 值班' }}</span>
              <span class="name-chip" data-testid="couple-laugh-daily-owner-name">{{ v.today.ownerUser }}</span>
              <span v-if="v.today.judged" class="verdict-chip" data-testid="couple-laugh-daily-verdict">{{ v.today.verdictLabel }}</span>
              <span v-else class="status-chip" data-testid="couple-laugh-daily-unjudged">还没判分</span>
            </p>
            <p class="row-quote" data-testid="couple-laugh-daily-content-text">节目：{{ v.today.content }}</p>
            <div v-if="v.today.canJudge" class="chip-row">
              <el-button v-for="v2 in VERDICT_OPTIONS" :key="v2.code" size="small" type="primary" plain :data-testid="`couple-laugh-daily-judge-${v2.code}`" @click="onDailyJudge(v2.code)">
                {{ v2.label }}
              </el-button>
            </div>
            <p v-else-if="v.today.mineOwner && !v.today.judged" class="wait-line" data-testid="couple-laugh-daily-judge-wait">自己逗的不能自己判，等 TA 来打分 🏅</p>
            <p v-else-if="v.today.judged" class="hint-line" data-testid="couple-laugh-daily-locked">判过分了，今天的节目就定格在这 🏅</p>
          </template>
          <p v-else class="empty-line" data-testid="couple-laugh-daily-none">今天还没人上台——上面那句「今天轮到谁」是后端给的，谁值班的交节目 🎪</p>
        </div>
      </template>
      <p v-else class="empty-line">今天的节目单还没开……</p>
    </CoupleCollapsible>

    <!-- F392 冷笑话结冰榜：互丢冷笑话，对方判结没结冰，一年冻最多的是冷场之王 -->
    <CoupleCollapsible testid="couple-laugh-joke" :empty="!v">
      <template #title>🧊 冷笑话结冰榜 <span class="sub">丢一条 ≤{{ JOKE_CONTENT_MAX }} 字的冷笑话，结没结冰由对方判（一条只判一次，翻不了案）。每人每天最多 {{ JOKE_PER_DAY_MAX }} 条、同一句不许重播；<span data-testid="couple-laugh-joke-frozen-total">累计结冰：我 {{ v ? v.myFrozen : 0 }} 条 · TA {{ v ? v.partnerFrozen : 0 }} 条</span>，年度冷场之王看这个数</span></template>
      <template v-if="v">
        <p class="section-head">🧊 丢一条过来</p>
        <div class="inline-form">
          <el-input v-model="jokeContent" :maxlength="JOKE_CONTENT_MAX" show-word-limit :placeholder="`冷笑话正文（≤${JOKE_CONTENT_MAX} 字）`" data-testid="couple-laugh-joke-input" />
          <el-button size="small" type="primary" data-testid="couple-laugh-joke-submit" @click="onJoke">丢过去 🧊</el-button>
        </div>
        <p class="quota-line" data-testid="couple-laugh-joke-quota">我今天已经丢了 {{ myJokeTodayCount }} / {{ JOKE_PER_DAY_MAX }} 条（总览只列最近 {{ JOKE_LIST_MAX }} 条）</p>

        <p class="section-head">🥶 结冰榜（新的在前）</p>
        <p v-if="!v.jokes.length" class="empty-line" data-testid="couple-laugh-joke-none">还没人丢冷笑话——先冻 TA 一次 🧊</p>
        <div v-for="j in v.jokes" :key="j.id" class="row-card" :class="{ 'is-partner': !j.mine, 'is-lit': j.judged && j.frozen }" :data-testid="`couple-laugh-joke-${j.id}`">
          <p class="row-head">
            <span class="day-chip" :data-testid="`couple-laugh-joke-day-${j.id}`">{{ j.day }}</span>
            <span class="who-chip" :data-testid="`couple-laugh-joke-who-${j.id}`">{{ j.mine ? '我讲的 🙋' : '💕 TA 讲的' }}</span>
            <span v-if="j.judged && j.frozen" class="lit-chip" :data-testid="`couple-laugh-joke-iced-${j.id}`">🧊 结冰（{{ j.judgedBy }}）</span>
            <span v-else-if="j.judged" class="clear-chip" :data-testid="`couple-laugh-joke-melt-${j.id}`">🔥 没结冰（{{ j.judgedBy }}）</span>
            <span v-else class="status-chip" :data-testid="`couple-laugh-joke-pending-${j.id}`">还没人判</span>
          </p>
          <p class="row-quote" :data-testid="`couple-laugh-joke-text-${j.id}`">「{{ j.content }}」</p>
          <div v-if="j.canJudge" class="chip-row">
            <el-button size="small" type="primary" plain :data-testid="`couple-laugh-joke-freeze-${j.id}`" @click="onJokeJudge(j.id, true)">判它结冰 🧊</el-button>
            <el-button size="small" plain :data-testid="`couple-laugh-joke-notfreeze-${j.id}`" @click="onJokeJudge(j.id, false)">这条没冰 🔥</el-button>
          </div>
          <p v-else-if="j.mine && !j.judged" class="wait-line" :data-testid="`couple-laugh-joke-judge-wait-${j.id}`">自己讲的不能自己判冰，等 TA 来判 🧊</p>
        </div>
      </template>
      <p v-else class="empty-line">结冰榜还空着……</p>
    </CoupleCollapsible>

    <!-- F393 社死往事（尴尬回收站）：交一条社死，对方盖抱抱章，满一年自动转成好笑的事 -->
    <CoupleCollapsible testid="couple-laugh-cringe" :empty="!v">
      <template #title>😖 社死往事 <span class="sub">把想钻地缝的那一刻写下来（≤{{ CRINGE_CONTENT_MAX }} 字，只能是已经发生过的日子），对方盖一个「抱抱你」的章。同一天每人只交一条；满 {{ CRINGE_HEAL_DAYS }} 天，读的时候它自己就变成「好笑的事了」——不用谁去结算</span></template>
      <template v-if="v">
        <p class="section-head">😖 交一条进回收站</p>
        <div class="inline-form">
          <el-input v-model="cringeDay" :maxlength="DAY_LEN" placeholder="社死的日子（yyyy-MM-dd，空=今天）" data-testid="couple-laugh-cringe-day" />
        </div>
        <el-input v-model="cringeContent" type="textarea" :rows="2" :maxlength="CRINGE_CONTENT_MAX" show-word-limit :placeholder="`当时发生了什么（≤${CRINGE_CONTENT_MAX} 字）`" data-testid="couple-laugh-cringe-content" />
        <el-button size="small" type="primary" data-testid="couple-laugh-cringe-submit" @click="onCringe">交进回收站 😖</el-button>

        <p class="section-head">🫂 回收站（新的在前，最多显示 {{ CRINGE_LIST_MAX }} 条；满一年的已经自己换了一副面孔）</p>
        <p class="quota-line" data-testid="couple-laugh-cringe-turned">全空间已经满一年、转成「好笑的事」的：{{ v.turnedFunny }} 条</p>
        <p v-if="!v.cringes.length" class="empty-line" data-testid="couple-laugh-cringe-none">还没有社死记录——没有人记得的日子，等于没社死 😖</p>
        <div v-for="c in v.cringes" :key="c.id" class="row-card" :class="{ 'is-partner': !c.mine, 'is-lit': c.healed || c.turnedFunny }" :data-testid="`couple-laugh-cringe-${c.id}`">
          <p class="row-head">
            <span class="day-chip" :data-testid="`couple-laugh-cringe-day-text-${c.id}`">{{ c.day }}</span>
            <span class="who-chip" :data-testid="`couple-laugh-cringe-who-${c.id}`">{{ c.mine ? '我的社死 🙋' : '💕 TA 的社死' }}</span>
            <span class="old-chip" :data-testid="`couple-laugh-cringe-old-${c.id}`">已经过去 {{ c.daysOld }} 天</span>
            <span v-if="c.healed" class="lit-chip" :data-testid="`couple-laugh-cringe-healed-${c.id}`">🫂 已盖抱抱章（{{ c.healedBy }}）</span>
          </p>
          <p class="row-quote" :data-testid="`couple-laugh-cringe-text-${c.id}`">{{ c.content }}</p>
          <p v-if="c.turnedFunny" class="lit-line" :data-testid="`couple-laugh-cringe-funny-${c.id}`">🎉 时间到账：这条满一年了，自动转成「好笑的事」。当时想钻地缝，现在只想重播。</p>
          <el-button v-if="c.canHeal" size="small" type="primary" plain :data-testid="`couple-laugh-cringe-heal-${c.id}`" @click="onCringeHeal(c.id)">抱抱 TA，盖章 🫂</el-button>
          <p v-else-if="c.mine && !c.healed" class="wait-line" :data-testid="`couple-laugh-cringe-heal-wait-${c.id}`">抱抱章要 TA 盖，自己抱抱不算 🫂</p>
        </div>
      </template>
      <p v-else class="empty-line">回收站还空着……</p>
    </CoupleCollapsible>

    <!-- F394 快乐突袭：一串夸奖 / 一个梗 / 一段回忆杀，对方举手中弹 -->
    <CoupleCollapsible testid="couple-laugh-attack" :empty="!v">
      <template #title>💥 快乐突袭 <span class="sub">突发一击：一串夸奖 / 一个梗 / 一段回忆杀（≤{{ ATTACK_CONTENT_MAX }} 字），对方「中弹」盖章。每人每天一发；中弹次数按年汇总在下面的年度笑榜里</span></template>
      <template v-if="v">
        <p class="section-head">💥 发一发</p>
        <div class="chip-row">
          <button
            v-for="k in ATTACK_OPTIONS"
            :key="k.code"
            type="button"
            class="day-pick"
            :class="{ 'is-picked': attackKind === k.code }"
            :data-testid="`couple-laugh-attack-kind-${k.code}`"
            @click="attackKind = k.code"
          >
            {{ k.label }}
          </button>
        </div>
        <div class="inline-form">
          <el-input v-model="attackContent" :maxlength="ATTACK_CONTENT_MAX" show-word-limit :placeholder="`突袭内容（≤${ATTACK_CONTENT_MAX} 字）`" data-testid="couple-laugh-attack-content" />
          <el-button size="small" type="primary" data-testid="couple-laugh-attack-submit" @click="onAttack">发出去 💥</el-button>
        </div>
        <p class="quota-line" data-testid="couple-laugh-attack-quota">
          {{ attackedToday ? '今天这一发已经打出去了，明天再来 💥' : `我今天还没发（每人每天一发），TA 今天${attackedByPartnerToday ? '已经发过一发 💥' : '还没发'}` }}
        </p>

        <p class="section-head">🎯 突袭流水（新的在前，最多显示 {{ ATTACK_LIST_MAX }} 条）</p>
        <p v-if="!v.attacks.length" class="empty-line" data-testid="couple-laugh-attack-none">还没人被突袭过——先夸 TA 一串 💥</p>
        <div v-for="a in v.attacks" :key="a.id" class="row-card" :class="{ 'is-partner': !a.mine, 'is-lit': a.hit }" :data-testid="`couple-laugh-attack-${a.id}`">
          <p class="row-head">
            <span class="day-chip" :data-testid="`couple-laugh-attack-day-${a.id}`">{{ a.day }}</span>
            <span class="kind-chip" :data-testid="`couple-laugh-attack-kind-text-${a.id}`">{{ a.kindLabel }}</span>
            <span class="who-chip" :data-testid="`couple-laugh-attack-who-${a.id}`">{{ a.mine ? '我发的 🙋' : '💕 TA 发的' }}</span>
            <span v-if="a.hit" class="lit-chip" :data-testid="`couple-laugh-attack-hit-${a.id}`">🎯 已中弹（{{ a.hitBy }}）</span>
          </p>
          <p class="row-quote" :data-testid="`couple-laugh-attack-text-${a.id}`">「{{ a.content }}」</p>
          <el-button v-if="a.canHit" size="small" type="primary" plain :data-testid="`couple-laugh-attack-hit-btn-${a.id}`" @click="onAttackHit(a.id)">我中弹了，举手认 🎯</el-button>
          <p v-else-if="a.mine && !a.hit" class="wait-line" :data-testid="`couple-laugh-attack-hit-wait-${a.id}`">自己发的弹不能自己认，等 TA 举手 🎯</p>
        </div>
      </template>
      <p v-else class="empty-line">还没收到突袭……</p>
    </CoupleCollapsible>

    <!-- F395 笑点预判（笑点默契考）：同一条冷笑话，两人各自预判 TA 会不会笑 -->
    <CoupleCollapsible testid="couple-laugh-guess" :empty="!v">
      <template #title>🔮 笑点预判 <span class="sub">同一条冷笑话，两个人各自预判「对方会不会笑」，两票一致就算默契。一条梗每人一票、自己那一票可以改；⚠️ 判冰结果后端一直下发，所以晚投的票不算盲考（见交付报告）</span></template>
      <template v-if="v">
        <p class="quota-line" data-testid="couple-laugh-guess-twin">已经预判一致的题数：{{ twinCount }} 题（总览只列最近 {{ JOKE_LIST_MAX }} 条冷笑话对应的票）</p>
        <p v-if="!guessRows.length" class="empty-line" data-testid="couple-laugh-guess-none">还没有可考的冷笑话——先丢一条过去 🧊</p>
        <div v-for="row in guessRows" :key="row.g.jokeId" class="row-card" :class="{ 'is-lit': row.g.twin }" :data-testid="`couple-laugh-guess-${row.g.jokeId}`">
          <p class="row-head">
            <span class="day-chip" :data-testid="`couple-laugh-guess-day-${row.g.jokeId}`">{{ row.joke ? row.joke.day : '' }}</span>
            <span class="who-chip" :data-testid="`couple-laugh-guess-teller-${row.g.jokeId}`">{{ row.joke ? (row.joke.mine ? '我讲的 🙋' : '💕 TA 讲的') : '' }}</span>
            <span class="status-chip" :data-testid="`couple-laugh-guess-count-${row.g.jokeId}`">已收到 {{ row.g.predictCount }} 票</span>
            <span v-if="row.g.twin" class="lit-chip" :data-testid="`couple-laugh-guess-twin-chip-${row.g.jokeId}`">🔮 两票一致</span>
          </p>
          <p class="row-quote" :data-testid="`couple-laugh-guess-joke-text-${row.g.jokeId}`">「{{ row.joke ? row.joke.content : '' }}」</p>
          <p class="row-meta">
            <span :data-testid="`couple-laugh-guess-mine-${row.g.jokeId}`">{{ guessSideText(row.g.minePredicted, row.g.predictsLaugh) }}</span>
            <span :data-testid="`couple-laugh-guess-partner-${row.g.jokeId}`">{{ guessSideText(row.g.partnerPredicted, row.g.partnerPredictsLaugh) }}</span>
          </p>
          <div v-if="row.joke && row.joke.canGuess" class="chip-row">
            <el-button size="small" type="primary" plain :data-testid="`couple-laugh-guess-yes-${row.g.jokeId}`" @click="onGuess(row.g.jokeId, true)">我预判 TA 会笑 😆</el-button>
            <el-button size="small" plain :data-testid="`couple-laugh-guess-no-${row.g.jokeId}`" @click="onGuess(row.g.jokeId, false)">我预判 TA 不笑 🧊</el-button>
          </div>
          <p v-else-if="row.joke" class="wait-line" :data-testid="`couple-laugh-guess-wait-${row.g.jokeId}`">这条已经判过冰了，答案都摆出来啦，再投就不算盲考了 🧊</p>
        </div>
      </template>
      <p v-else class="empty-line">还没有可考的梗……</p>
    </CoupleCollapsible>

    <!-- F396 大笑处方：对方低落时开一剂，指定翻哪条笑点/社死/突袭，对方回执已服用 -->
    <CoupleCollapsible testid="couple-laugh-rx" :empty="!v">
      <template #title>💊 大笑处方 <span class="sub">TA 低落的时候开一剂：指定翻某条笑点 / 某段社死 / 某次突袭（医嘱 ≤{{ RX_NOTE_MAX }} 字，可空），对方回执「已服用」。每人每天一张</span></template>
      <template v-if="v">
        <p class="section-head">💊 开一张</p>
        <div class="chip-row">
          <button
            v-for="k in RX_TARGET_OPTIONS"
            :key="k.code"
            type="button"
            class="day-pick"
            :class="{ 'is-picked': rxKind === k.code }"
            :data-testid="`couple-laugh-rx-kind-${k.code}`"
            @click="pickRxKind(k.code)"
          >
            {{ k.label }}
          </button>
        </div>
        <p v-if="!rxTargets.length" class="empty-line" :data-testid="`couple-laugh-rx-notarget-${rxKind}`">这一类还没有可翻的条目——先攒一条再说 💊</p>
        <div v-else class="chip-row">
          <button
            v-for="t in rxTargets"
            :key="t.id"
            type="button"
            class="day-pick"
            :class="{ 'is-picked': rxTargetId === t.id }"
            :data-testid="`couple-laugh-rx-pick-${t.id}`"
            @click="rxTargetId = t.id"
          >
            {{ t.day }} · {{ cut(t.title) }}{{ t.mine ? '（我存的）' : '（TA 存的）' }}
          </button>
        </div>
        <div class="inline-form">
          <el-input v-model="rxNote" :maxlength="RX_NOTE_MAX" show-word-limit :placeholder="`医嘱一句话（≤${RX_NOTE_MAX} 字，可空）`" data-testid="couple-laugh-rx-note" />
          <el-button size="small" type="primary" data-testid="couple-laugh-rx-submit" @click="onRx">开处方 💊</el-button>
        </div>
        <p class="quota-line" data-testid="couple-laugh-rx-quota">{{ rxTodayMine ? '今天的处方已经开过了，明天再复诊 💊' : '我今天还没开（每人每天一张）' }}</p>

        <p class="section-head">🧾 处方单（新的在前，最多显示 {{ RX_LIST_MAX }} 张）</p>
        <p v-if="!v.rxList.length" class="empty-line" data-testid="couple-laugh-rx-none">还没开过处方——TA 心情不好的那天再翻这一页 💊</p>
        <div v-for="r in v.rxList" :key="r.id" class="row-card" :class="{ 'is-partner': !r.mine, 'is-lit': r.taken }" :data-testid="`couple-laugh-rx-${r.id}`">
          <p class="row-head">
            <span class="day-chip" :data-testid="`couple-laugh-rx-day-${r.id}`">{{ r.day }}</span>
            <span class="kind-chip" :data-testid="`couple-laugh-rx-target-${r.id}`">翻 {{ r.targetLabel }}</span>
            <span class="who-chip" :data-testid="`couple-laugh-rx-who-${r.id}`">{{ r.mine ? '我开的 🙋' : '💕 TA 开的' }}</span>
            <span v-if="r.taken" class="lit-chip" :data-testid="`couple-laugh-rx-taken-${r.id}`">✅ 已服用（{{ r.takenBy }}）</span>
          </p>
          <p class="row-quote" :data-testid="`couple-laugh-rx-title-${r.id}`">{{ r.targetTitle === null ? '（指向的那条已经查不到了）' : `指向：${r.targetTitle}` }}</p>
          <p v-if="r.note" class="row-meta"><span :data-testid="`couple-laugh-rx-note-text-${r.id}`">医嘱：{{ r.note }}</span></p>
          <el-button v-if="!r.mine && !r.taken" size="small" type="primary" plain :data-testid="`couple-laugh-rx-take-${r.id}`" @click="onRxTaken(r.id)">我服了，笑出声 ✅</el-button>
          <p v-else-if="r.mine && !r.taken" class="wait-line" :data-testid="`couple-laugh-rx-take-wait-${r.id}`">药是给对方吃的，回执只能 TA 来点 ✅</p>
        </div>
      </template>
      <p v-else class="empty-line">还没有处方单……</p>
    </CoupleCollapsible>

    <!-- F397 幽默风格图鉴：自评一格、替对方评一格，差异才会给相处建议 -->
    <CoupleCollapsible testid="couple-laugh-style" :empty="!v">
      <template #title>🎭 幽默风格图鉴 <span class="sub">五种里挑一种：谐音梗 / 冷幽默 / 自嘲派 / 动作派 / 模仿派。自己评自己一格、再替对方评一格（补一句 ≤{{ STYLE_NOTE_MAX }} 字），「我以为的我」和「TA 眼里的我」对不上才给相处建议</span></template>
      <template v-if="v">
        <p class="section-head">🎭 填一格</p>
        <div class="chip-row">
          <button type="button" class="day-pick" :class="{ 'is-picked': styleAbout === 'me' }" data-testid="couple-laugh-style-about-me" @click="styleAbout = 'me'">评我自己（{{ myName || '我' }}）</button>
          <button type="button" class="day-pick" :class="{ 'is-picked': styleAbout === 'partner' }" data-testid="couple-laugh-style-about-partner" @click="styleAbout = 'partner'">评 TA{{ partnerName ? `（${partnerName}）` : '' }}</button>
        </div>
        <div class="chip-row">
          <button
            v-for="s in STYLE_OPTIONS"
            :key="s.code"
            type="button"
            class="day-pick"
            :class="{ 'is-picked': styleCode === s.code }"
            :data-testid="`couple-laugh-style-opt-${s.code}`"
            @click="styleCode = s.code"
          >
            {{ s.label }}
          </button>
        </div>
        <div class="inline-form">
          <el-input v-model="styleNote" :maxlength="STYLE_NOTE_MAX" show-word-limit :placeholder="`补一句（≤${STYLE_NOTE_MAX} 字，可空）`" data-testid="couple-laugh-style-note" />
          <el-button size="small" type="primary" data-testid="couple-laugh-style-submit" @click="onStyle">记下这一格 🎭</el-button>
        </div>
        <p class="hint-line" data-testid="couple-laugh-style-hint">{{ v.styleHint }}</p>

        <p class="section-head">🖼️ 图鉴四格（谁评谁各一行，可改写）</p>
        <p class="quota-line" data-testid="couple-laugh-style-quota">我评了 {{ myStyleCount }} 格 · TA 评了 {{ partnerStyleCount }} 格</p>
        <p v-if="!v.styles.length" class="empty-line" data-testid="couple-laugh-style-none">图鉴还空着——先给自己评一格 🎭</p>
        <div v-for="s in v.styles" :key="s.id" class="row-card" :class="{ 'is-partner': !s.mine, 'is-lit': s.selfRated }" :data-testid="`couple-laugh-style-${s.id}`">
          <p class="row-head">
            <span class="title-chip" :data-testid="`couple-laugh-style-label-${s.id}`">{{ s.styleLabel }}</span>
            <span class="who-chip" :data-testid="`couple-laugh-style-about-${s.id}`">{{ s.selfRated ? '本人自评 🙋' : '别人评的 💕' }}</span>
            <span class="name-chip" :data-testid="`couple-laugh-style-who-${s.id}`">评的是 {{ s.aboutUser }}，评的人 {{ s.rater }}</span>
          </p>
          <p v-if="s.note" class="row-quote" :data-testid="`couple-laugh-style-note-text-${s.id}`">{{ s.note }}</p>
        </div>
      </template>
      <p v-else class="empty-line">图鉴还是空的……</p>
    </CoupleCollapsible>

    <!-- F398 欢乐周报：周一锚七个计数 + Bank 整句（点按钮才懒读一次） -->
    <CoupleCollapsible testid="couple-laugh-week" :empty="!v">
      <template #title>📅 欢乐周报 <span class="sub">以服务端那个周一为锚（不吃本地时钟）：存档笑点、一逗上台、真笑/强撑、冻住几条、中弹几次、预判对了几题——七个数全是两人合计</span></template>
      <template v-if="v">
        <div class="week-card" data-testid="couple-laugh-week-card">
          <p class="row-head">
            <span class="day-chip" data-testid="couple-laugh-week-anchor">{{ shownWeek.week }} 那周</span>
            <span class="left-chip" data-testid="couple-laugh-week-range">{{ shownWeek.fromDay }} ~ {{ shownWeek.toDay }}</span>
            <span v-if="weekView" class="lit-chip" data-testid="couple-laugh-week-lazy">刚从 /week 懒读回来的那份 🔄</span>
          </p>
          <div class="stat-grid">
            <p class="stat" data-testid="couple-laugh-week-moments">笑点存档 {{ shownWeek.moments }} 条</p>
            <p class="stat" data-testid="couple-laugh-week-served">一逗上台 {{ shownWeek.served }} 天</p>
            <p class="stat" data-testid="couple-laugh-week-happy">真笑了 {{ shownWeek.happy }} 场</p>
            <p class="stat" data-testid="couple-laugh-week-fake">强撑 {{ shownWeek.fake }} 场</p>
            <p class="stat" data-testid="couple-laugh-week-frozen">冻住 {{ shownWeek.frozen }} 条</p>
            <p class="stat" data-testid="couple-laugh-week-hits">中弹 {{ shownWeek.hits }} 次</p>
            <p class="stat" data-testid="couple-laugh-week-guesses">预判一致 {{ shownWeek.guesses }} 题</p>
          </div>
          <p class="summary-line" data-testid="couple-laugh-week-summary">{{ shownWeek.summary }}</p>
        </div>
        <div class="chip-row">
          <el-button size="small" type="primary" plain data-testid="couple-laugh-week-load" @click="onWeekLoad">再拉一次本周周报 🔄</el-button>
          <el-button size="small" plain data-testid="couple-laugh-week-back" @click="onWeekBack">回到总览自带的那份 ↩</el-button>
        </div>
        <p class="hint-line" data-testid="couple-laugh-week-tip">聚合里本来就带本周那一份（每个写接口后端都重算一次），这两个按钮只是再读一次 /week 看看有没有变</p>
      </template>
      <p v-else class="empty-line">还没拿到本周的欢乐账……</p>
    </CoupleCollapsible>

    <!-- F399 年度笑榜：按事发日归年的十四项数字 + 称号 + Bank 整句（点按钮才懒读另一年） -->
    <CoupleCollapsible testid="couple-laugh-year" :empty="!v">
      <template #title>🏆 年度笑榜 <span class="sub">「我们的喜剧奖」：最好笑的一条、冷场之王、中弹王、结冰数、抱抱章与满一年转档数、处方已服用数——数字按<b>事发日</b>归年直查原始表，称号与总结全在后端 Bank</span></template>
      <template v-if="v">
        <div class="year-card" data-testid="couple-laugh-year-card">
          <p class="row-head">
            <span class="title-chip" data-testid="couple-laugh-year-num">{{ shownYear.year }} 年</span>
            <span class="kind-chip" data-testid="couple-laugh-year-title">称号「{{ shownYear.title }}」</span>
            <span v-if="yearView" class="lit-chip" data-testid="couple-laugh-year-lazy">刚从 /year 懒读回来的那一年 🔄</span>
          </p>
          <p class="row-quote" data-testid="couple-laugh-year-best">{{ shownYear.bestLine ? `当年最好笑：「${shownYear.bestLine}」` : '暂时选不出最好笑的一条' }}</p>
          <div class="stat-grid">
            <p class="stat" data-testid="couple-laugh-year-moments">笑点存档 {{ shownYear.moments }} 条</p>
            <p class="stat" data-testid="couple-laugh-year-laughs">补了证词 {{ shownYear.laughs }} 份</p>
            <p class="stat" data-testid="couple-laugh-year-daily">一逗上台 {{ shownYear.dailyDone }} 天</p>
            <p class="stat" data-testid="couple-laugh-year-happy">真笑了 {{ shownYear.happy }} 场</p>
            <p class="stat" data-testid="couple-laugh-year-frozen">结冰 {{ shownYear.frozen }} 条</p>
            <p class="stat" data-testid="couple-laugh-year-king">冷场之王 {{ shownYear.kingOfCold }}</p>
            <p class="stat" data-testid="couple-laugh-year-cringe">社死 {{ shownYear.cringe }} 条</p>
            <p class="stat" data-testid="couple-laugh-year-healed">盖了抱抱 {{ shownYear.cringeHealed }} 条</p>
            <p class="stat" data-testid="couple-laugh-year-turns">满一年转档 {{ shownYear.turns }} 条</p>
            <p class="stat" data-testid="couple-laugh-year-attacks">突袭 {{ shownYear.attacks }} 次</p>
            <p class="stat" data-testid="couple-laugh-year-hits">中弹 {{ shownYear.hits }} 次</p>
            <p class="stat" data-testid="couple-laugh-year-guess">预判一致 {{ shownYear.guessTwin }} 题</p>
            <p class="stat" data-testid="couple-laugh-year-rx">已服处方 {{ shownYear.rxTaken }} 张</p>
          </div>
          <p class="summary-line" data-testid="couple-laugh-year-summary">{{ shownYear.summary }}</p>
        </div>
        <div class="inline-form">
          <el-input v-model="yearInput" :maxlength="YEAR_LEN" placeholder="查哪一年（yyyy，空=服务端当年）" data-testid="couple-laugh-year-input" />
          <el-button size="small" type="primary" plain data-testid="couple-laugh-year-load" @click="onYearLoad">查这一年的笑榜 🏆</el-button>
          <el-button size="small" plain data-testid="couple-laugh-year-back" @click="onYearBack">回到当年那份 ↩</el-button>
        </div>
      </template>
      <p v-else class="empty-line">还没拿到年度笑榜……</p>
    </CoupleCollapsible>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { laughApi } from '@/api/couple'
import type {
  CoupleLaughAttackKind,
  CoupleLaughStyleCode,
  CoupleLaughTargetKind,
  CoupleLaughVerdict,
  CoupleLaughVO,
  CoupleLaughWeekVO,
  CoupleLaughYearVO,
} from '@/types'
import { useAuthStore } from '@/stores/auth'
import { useCoupleStore } from '@/stores/couple'
import CoupleCollapsible from './CoupleCollapsible.vue'

/**
 * 限长与上限一律抄自后端 CoupleLaughService 与 CoupleLaugh* 实体常量（只用于输入框限长与前端闸门文案；
 * 归属判定、幂等、每日一次、周轮换与转档一律留在后端，400/404 中文直透）：
 * CoupleLaughMoment.TITLE_MAX=30 SCENE_MAX=100 CULPRIT_MAX=20 WITNESS_MAX=100
 *   LEVEL_MIN=1 LEVEL_MAX=5 PER_DAY_MAX=3 /
 * CoupleLaughDaily.CONTENT_MAX=100、VERDICTS=HAPPY|FLAT|FAKE /
 * CoupleLaughJoke.CONTENT_MAX=80 PER_USER_DAY_MAX=3 /
 * CoupleLaughCringe.CONTENT_MAX=100 HEAL_AFTER_DAYS=365 /
 * CoupleLaughAttack.CONTENT_MAX=100、KINDS=PRAISE|MEME|MEMORY /
 * CoupleLaughRx.NOTE_MAX=60、TARGET_KINDS=MOMENT|CRINGE|ATTACK /
 * CoupleLaughStyle.NOTE_MAX=60、STYLES=PUN|COLD|SELF|ACTION|MIME /
 * 总览列表钳制（后端 build() 里的 LIST_*）：momentMapper 20、joke 20、cringe 14、attack 14、rx 10，
 * styles 不钳制。⚠️ 这些上限只影响「看得见几条」，年度榜与周报都是直查原始表。
 */
const MOMENT_TITLE_MAX = 30
const MOMENT_CULPRIT_MAX = 20
const MOMENT_SCENE_MAX = 100
const MOMENT_WITNESS_MAX = 100
const MOMENT_PER_DAY_MAX = 3
const MOMENT_LIST_MAX = 20
const DAILY_CONTENT_MAX = 100
const JOKE_CONTENT_MAX = 80
const JOKE_PER_DAY_MAX = 3
const JOKE_LIST_MAX = 20
const CRINGE_CONTENT_MAX = 100
const CRINGE_HEAL_DAYS = 365
const CRINGE_LIST_MAX = 14
const ATTACK_CONTENT_MAX = 100
const ATTACK_LIST_MAX = 14
const RX_NOTE_MAX = 60
const RX_LIST_MAX = 10
const STYLE_NOTE_MAX = 60
const DAY_LEN = 10
const YEAR_LEN = 4
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/
const YEAR_RE = /^\d{4}$/

/** 好笑度档位（后端 LEVEL_MIN/LEVEL_MAX，⚠️ 传 null 后端静默兜 3、越界钳 1-5 不报错，所以前端要求必须先点一个） */
const LEVELS = [1, 2, 3, 4, 5]
/** 判分三种（后端 CoupleLaughDaily.VERDICTS，顺序即口径顺序；中文标签展示吃下发的 verdictLabel） */
const VERDICT_OPTIONS: { code: CoupleLaughVerdict; label: string }[] = [
  { code: 'HAPPY', label: '真笑了 😆' },
  { code: 'FLAT', label: '没笑 😐' },
  { code: 'FAKE', label: '强撑的笑 🙂' },
]
/** 突袭三种（后端 CoupleLaughAttack.KINDS；⚠️ 请求里传空串后端兜成 PRAISE，前端要求先点一种） */
const ATTACK_OPTIONS: { code: CoupleLaughAttackKind; label: string }[] = [
  { code: 'PRAISE', label: '一串夸奖' },
  { code: 'MEME', label: '一个梗' },
  { code: 'MEMORY', label: '一段回忆杀' },
]
/** 处方指向三种（后端 CoupleLaughRx.TARGET_KINDS；⚠️ 空串没有兜底，直接 400） */
const RX_TARGET_OPTIONS: { code: CoupleLaughTargetKind; label: string }[] = [
  { code: 'MOMENT', label: '翻一条笑点' },
  { code: 'CRINGE', label: '翻一段社死' },
  { code: 'ATTACK', label: '翻一次突袭' },
]
/** 幽默类型五种（后端 CoupleLaughStyle.STYLES；展示一律优先吃下发的 styleLabel，这份池子只用于输入口） */
const STYLE_OPTIONS: { code: CoupleLaughStyleCode; label: string }[] = [
  { code: 'PUN', label: '谐音梗' },
  { code: 'COLD', label: '冷幽默' },
  { code: 'SELF', label: '自嘲派' },
  { code: 'ACTION', label: '动作派' },
  { code: 'MIME', label: '模仿派' },
]

const auth = useAuthStore()
const couple = useCoupleStore()

/** 欢笑银行总览：GET /bank 与 14 个 POST 写接口都返回整份 LaughVO，整体替换即十卡刷新 */
const v = ref<CoupleLaughVO | null>(null)
/** F398/F399 两个懒读结果：null=看聚合里服务端自带的本周/当年那一份，永不被写接口覆盖 */
const weekView = ref<CoupleLaughWeekVO | null>(null)
const yearView = ref<CoupleLaughYearVO | null>(null)
const yearInput = ref('')

// ---- 草稿（全是「本人这一侧」的输入口） ----
const momentDay = ref('')
const momentTitle = ref('')
const momentCulprit = ref('')
const momentScene = ref('')
const funLevel = ref(0)
const witnessDraft = ref<Record<string, string>>({})
const dailyContent = ref('')
const jokeContent = ref('')
const cringeDay = ref('')
const cringeContent = ref('')
const attackKind = ref<CoupleLaughAttackKind | ''>('')
const attackContent = ref('')
const rxKind = ref<CoupleLaughTargetKind>('MOMENT')
const rxTargetId = ref('')
const rxNote = ref('')
const styleAbout = ref<'me' | 'partner'>('me')
const styleCode = ref<CoupleLaughStyleCode | ''>('')
const styleNote = ref('')

// ---- 派生（一律吃服务端下发的位与列表，不留本地「我今天按过没」的假象） ----
const myMomentCount = computed(() => (v.value ? v.value.moments.filter((m) => m.mine).length : 0))
const partnerMomentCount = computed(() => (v.value ? v.value.moments.filter((m) => !m.mine).length : 0))
/** 我今天在这个「事发日」存了几条（闸门用；⚠️ 后端数的就是这个 day，不是今天） */
const momentDayCount = computed(() => {
  const data = v.value
  if (!data) return 0
  const day = effectiveDay(momentDay.value)
  return data.moments.filter((m) => m.mine && m.day === day).length
})
const myJokeTodayCount = computed(() => {
  const data = v.value
  if (!data) return 0
  return data.jokes.filter((j) => j.mine && j.day === data.day).length
})
const attackedToday = computed(() => {
  const data = v.value
  if (!data) return false
  return data.attacks.some((a) => a.mine && a.day === data.day)
})
const attackedByPartnerToday = computed(() => {
  const data = v.value
  if (!data) return false
  return data.attacks.some((a) => !a.mine && a.day === data.day)
})
const rxTodayMine = computed(() => {
  const data = v.value
  if (!data) return false
  return data.rxList.some((r) => r.mine && r.day === data.day)
})
/**
 * F395 预判表：后端 guessVos 是「拿 jokes（≤20 条）逐条 map 出来的」，所以 jokeId 一定回查得到；
 * 冷笑话的 canGuess=「还没判冰」（后端已改口径：原先等于「不是我的那条」，一条梗最多收一票，
 * 而 F395 要的是两人各自预判、双判一致才算默契，那样永远凑不出第二票）。
 */
const guessRows = computed(() => {
  const data = v.value
  if (!data) return []
  return data.guesses.map((g) => ({ g, joke: data.jokes.find((j) => j.id === g.jokeId) ?? null }))
})
const twinCount = computed(() => (v.value ? v.value.guesses.filter((g) => g.twin).length : 0))
/**
 * F396 处方候选：三类各自的「本空间里能翻的条目」。
 * 后端 safeTargetTitle 对 MOMENT 取 title、对 CRINGE/ATTACK 取 content，这里照抄同一口径展示。
 */
const rxTargets = computed(() => {
  const data = v.value
  if (!data) return [] as { id: string; day: string; title: string; mine: boolean }[]
  if (rxKind.value === 'MOMENT') {
    return data.moments.map((m) => ({ id: m.id, day: m.day, title: m.title, mine: m.mine }))
  }
  if (rxKind.value === 'CRINGE') {
    return data.cringes.map((c) => ({ id: c.id, day: c.day, title: c.content, mine: c.mine }))
  }
  return data.attacks.map((a) => ({ id: a.id, day: a.day, title: a.content, mine: a.mine }))
})
const myName = computed(() => auth.username ?? '')
/**
 * F397 互评要提交 aboutUser 这个「用户名字符串」，而 ⚠️ LaughVO 里没有任何对方用户名字段
 * （已作为缺字段上报：today 为 null 时连 ownerUser 都拿不到）。
 * 这里只为拿那一个字符串：先读全局已经加载好的空间头部（与头部/其他卡同源，不新增 store 状态、不接 WS），
 * 兜底再从服务端 styles/today 出现过的用户名里认出一个不是我的；一个都认不出就 warning 不发请求，
 * 绝不把「评 TA」偷偷兜成自评（后端 aboutUser 传空串就是评自己）。
 */
const partnerName = computed(() => {
  const fromSpace = couple.space?.partner?.username ?? ''
  if (fromSpace && fromSpace !== myName.value) return fromSpace
  const data = v.value
  if (data) {
    const seen = new Set<string>()
    for (const s of data.styles) {
      seen.add(s.aboutUser)
      seen.add(s.rater)
    }
    if (data.today) seen.add(data.today.ownerUser)
    seen.delete('')
    seen.delete(myName.value)
    const others = [...seen]
    if (others.length === 1) return others[0]
  }
  return ''
})
const myStyleCount = computed(() => (v.value ? v.value.styles.filter((s) => s.mine).length : 0))
const partnerStyleCount = computed(() => (v.value ? v.value.styles.filter((s) => !s.mine).length : 0))
const shownWeek = computed<CoupleLaughWeekVO>(() => weekView.value ?? v.value?.weekReport ?? emptyWeek())
const shownYear = computed<CoupleLaughYearVO>(() => yearView.value ?? v.value?.year ?? emptyYear())

/** 未建空间时总览没有 weekReport/year，周报与年度榜那两段落全零空态（不报错、不自造数字） */
function emptyWeek(): CoupleLaughWeekVO {
  return {
    week: '', fromDay: '', toDay: '',
    moments: 0, served: 0, happy: 0, fake: 0, frozen: 0, hits: 0, guesses: 0, summary: '',
  }
}
function emptyYear(): CoupleLaughYearVO {
  return {
    year: 0, moments: 0, laughs: 0, dailyDone: 0, happy: 0, frozen: 0, kingOfCold: '', cringe: 0,
    cringeHealed: 0, turns: 0, attacks: 0, hits: 0, guessTwin: 0, rxTaken: 0, bestLine: '', title: '', summary: '',
  }
}

// ---- 小工具 ----
/** 「空=今天」的两个字段（F390 day、F393 day）一律以服务端 v.day 为今天，不吃本地时钟 */
function effectiveDay(input: string): string {
  const t = input.trim()
  return t || (v.value?.day ?? '')
}

function cut(text: string): string {
  return text.length > 14 ? `${text.slice(0, 14)}…` : text
}

function guessSideText(predicted: boolean, predictsLaugh: boolean): string {
  if (!predicted) return '还没投这一票 🔮'
  return predictsLaugh ? '这一票投的是「会笑」😆' : '这一票投的是「不笑」🧊'
}

function onError(e: unknown, fallback: string) {
  // 后端 400/404 的中文 message 直接透传（例如「今天轮不到你——bob 才是值班喜剧人 🎪」）
  ElMessage.error(e instanceof Error ? e.message : fallback)
}

function noData(): boolean {
  if (!v.value) {
    ElMessage.warning('还没拿到欢笑银行总览，重进一次「🎲 玩趣时间」页签试试')
    return true
  }
  return false
}

/** 各字段限长闸门（后端也钳，先在这儿给一句话，省一次注定 400 的提交） */
function tooLong(text: string, max: number, what: string): boolean {
  if (text.length > max) {
    ElMessage.warning(`${what}最多 ${max} 字，先删几个字 ✂️`)
    return true
  }
  return false
}

/** 「日子」闸门：格式 + 不能是将来（F390 与 F393 同规则，后端两条 400 文案不同，这里只挡共同口径） */
function badDay(input: string, what: string): boolean {
  const d = input.trim()
  if (!d) return false
  if (!DAY_RE.test(d)) {
    ElMessage.warning(`${what}写成 yyyy-MM-dd 📅`)
    return true
  }
  if (d > (v.value?.day ?? '')) {
    ElMessage.warning(`${what}只能是已经发生过的日子，将来的先别占位 📅`)
    return true
  }
  return false
}

/**
 * 写接口统一返回整份 LaughVO：整体替换即十卡刷新。
 * 替换后只回填「本人这一侧」的输入口：今天这格如果是我值班就回填我的节目（判分前可改写）、
 * 对方还没补证词的那几条留一份空草稿；一次性提交的（笑点/冷笑话/社死/突袭/处方）清空重填，
 * 懒读回来的周报与另一年绝不被写接口覆盖。
 */
function refresh(data: CoupleLaughVO | null | undefined) {
  if (!data) return
  v.value = data

  dailyContent.value = data.today && data.today.mineOwner ? data.today.content : ''

  const nextWitness: Record<string, string> = {}
  for (const m of data.moments) {
    if (m.canWitness) nextWitness[m.id] = witnessDraft.value[m.id] ?? ''
  }
  witnessDraft.value = nextWitness

  momentDay.value = ''
  momentTitle.value = ''
  momentCulprit.value = ''
  momentScene.value = ''
  funLevel.value = 0
  jokeContent.value = ''
  cringeDay.value = ''
  cringeContent.value = ''
  attackContent.value = ''
  rxTargetId.value = ''
  rxNote.value = ''
  styleNote.value = ''
}

// ========== F390 笑点存档 ==========
async function onMoment() {
  if (noData()) return
  const title = momentTitle.value.trim()
  if (!title) {
    ElMessage.warning('这条笑点叫什么，先起个名 😂')
    return
  }
  if (tooLong(title, MOMENT_TITLE_MAX, '名字')) return
  if (badDay(momentDay.value, '发生的日子')) return
  const culprit = momentCulprit.value.trim()
  if (tooLong(culprit, MOMENT_CULPRIT_MAX, '谁干的')) return
  const scene = momentScene.value.trim()
  if (tooLong(scene, MOMENT_SCENE_MAX, '现场还原')) return
  if (!funLevel.value) {
    // 后端 funLevel 传 null 会静默兜 3、越界静默钳制，界面不许「没选就按默认分」存进去
    ElMessage.warning('先点一个好笑度（1-5 分）😂')
    return
  }
  const day = effectiveDay(momentDay.value)
  // 同一个「事发日」同人同名：后端按 equalsIgnoreCase 比（与 uk 在 MariaDB *_ci 下的口径一致），这里同一口径先挡
  if (v.value?.moments.some((m) => m.mine && m.day === day && m.title.toLowerCase() === title.toLowerCase())) {
    ElMessage.warning('那个日子这条笑点已经存过了 😂')
    return
  }
  if (momentDayCount.value >= MOMENT_PER_DAY_MAX) {
    ElMessage.warning(`同一个日子最多存 ${MOMENT_PER_DAY_MAX} 条，笑也要节制 😂`)
    return
  }
  try {
    refresh(await laughApi.laughMoment(momentDay.value.trim(), title, culprit, scene, funLevel.value))
    ElMessage.success('笑点已经存进簿子了，等 TA 来补证词 😂')
  } catch (e) {
    onError(e, '这条笑点没存上，再试一次')
  }
}

async function onWitness(id: string) {
  if (noData()) return
  const text = (witnessDraft.value[id] ?? '').trim()
  if (!text) {
    ElMessage.warning('现场证词写一句，哪怕就「我在场」🎤')
    return
  }
  if (tooLong(text, MOMENT_WITNESS_MAX, '证词')) return
  try {
    refresh(await laughApi.laughMomentWitness(id, text))
    ElMessage.success('证词已补录，这条笑点双人认证了 🎤')
  } catch (e) {
    onError(e, '证词没补上，再试一次')
  }
}

// ========== F391 每日一逗 ==========
async function onDailyServe() {
  if (noData()) return
  const content = dailyContent.value.trim()
  if (!content) {
    ElMessage.warning('今天打算用什么逗，先写出来 🎪')
    return
  }
  if (tooLong(content, DAILY_CONTENT_MAX, '节目内容')) return
  // ⚠️ 聚合里没有「今天轮不轮到我」的布尔位（LaughVO 缺 dutyUser/onDutyMine，today 为 null 时只有文案），
  // 抢班这一条闸门交不出诚实的本地判据，只能显示后端那句 rotationHint，让 400 直透。
  try {
    const served = !v.value?.today
    refresh(await laughApi.laughDaily(content))
    ElMessage.success(served ? '节目已上台，接下来等 TA 判分 🎪' : '今天的节目已经改写 🎪')
  } catch (e) {
    onError(e, '节目没交上去，再试一次')
  }
}

async function onDailyJudge(verdict: CoupleLaughVerdict) {
  if (noData()) return
  const today = v.value?.today
  if (!today) {
    ElMessage.warning('今天还没人上台，没得判 🎪')
    return
  }
  try {
    refresh(await laughApi.laughDailyJudge(today.id, verdict))
    ElMessage.success('判完了，两边都看得见这一票 🏅')
  } catch (e) {
    onError(e, '这一票没判出去，再试一次')
  }
}

// ========== F392 冷笑话结冰榜 ==========
async function onJoke() {
  if (noData()) return
  const content = jokeContent.value.trim()
  if (!content) {
    ElMessage.warning('冷笑话总得先有个冷句 🧊')
    return
  }
  if (tooLong(content, JOKE_CONTENT_MAX, '冷笑话')) return
  // 后端按 uk(space,from_user,content) 全历史查重（equalsIgnoreCase），界面同一口径先挡
  if (v.value?.jokes.some((j) => j.mine && j.content.toLowerCase() === content.toLowerCase())) {
    ElMessage.warning('这条已经丢过一次了，冷笑话不许重播 🧊')
    return
  }
  if (myJokeTodayCount.value >= JOKE_PER_DAY_MAX) {
    ElMessage.warning(`今天已经丢了 ${JOKE_PER_DAY_MAX} 条，够冷了 🧊`)
    return
  }
  try {
    refresh(await laughApi.laughJoke(content))
    ElMessage.success('冷笑话已丢过去，等对方判结没结冰 🧊')
  } catch (e) {
    onError(e, '这条冷笑话没丢出去，再试一次')
  }
}

async function onJokeJudge(id: string, frozen: boolean) {
  if (noData()) return
  try {
    refresh(await laughApi.laughJokeJudge(id, frozen))
    ElMessage.success(frozen ? '判了结冰，冷场之王在向你招手 🥶' : '这条没冰，算过关 🔥')
  } catch (e) {
    onError(e, '这一票没判出去，再试一次')
  }
}

// ========== F393 社死往事 ==========
async function onCringe() {
  if (noData()) return
  if (badDay(cringeDay.value, '社死的日子')) return
  const content = cringeContent.value.trim()
  if (!content) {
    ElMessage.warning('当时发生了什么，写下来 😖')
    return
  }
  if (tooLong(content, CRINGE_CONTENT_MAX, '社死现场')) return
  const day = effectiveDay(cringeDay.value)
  if (v.value?.cringes.some((c) => c.mine && c.day === day)) {
    ElMessage.warning('那天已经交过一条了，一天一条 😖')
    return
  }
  try {
    refresh(await laughApi.laughCringe(cringeDay.value.trim(), content))
    ElMessage.success(`已交进回收站——等 TA 盖抱抱章（满 ${CRINGE_HEAL_DAYS} 天它自己会变成好笑的事）😖`)
  } catch (e) {
    onError(e, '这条社死没交上去，再试一次')
  }
}

async function onCringeHeal(id: string) {
  if (noData()) return
  try {
    refresh(await laughApi.laughCringeHeal(id))
    ElMessage.success('抱抱章已盖上，这条尴尬有主了 🫂')
  } catch (e) {
    onError(e, '章没盖上，再试一次')
  }
}

// ========== F394 快乐突袭 ==========
async function onAttack() {
  if (noData()) return
  if (!attackKind.value) {
    // 后端 kind 传空串会静默兜成 PRAISE，界面不许「没选就默认一串夸奖」
    ElMessage.warning('先挑一种突袭：一串夸奖 / 一个梗 / 一段回忆杀 💥')
    return
  }
  const content = attackContent.value.trim()
  if (!content) {
    ElMessage.warning('突袭内容写一句，TA 才知道中了什么弹 💥')
    return
  }
  if (tooLong(content, ATTACK_CONTENT_MAX, '突袭内容')) return
  if (attackedToday.value) {
    ElMessage.warning('今天已经突袭过一次了，明天再来 💥')
    return
  }
  try {
    refresh(await laughApi.laughAttack(attackKind.value, content))
    ElMessage.success('突袭已发出，等 TA 举手认弹 💥')
  } catch (e) {
    onError(e, '这一发没打出去，再试一次')
  }
}

async function onAttackHit(id: string) {
  if (noData()) return
  try {
    refresh(await laughApi.laughAttackHit(id))
    ElMessage.success('已认弹：这波我确实笑了 🎯')
  } catch (e) {
    onError(e, '认弹没认上，再试一次')
  }
}

// ========== F395 笑点预判 ==========
async function onGuess(jokeId: string, predict: boolean) {
  if (noData()) return
  const joke = v.value?.jokes.find((j) => j.id === jokeId)
  if (joke && !joke.canGuess) {
    // 闸门改吃服务端 canGuess：判过冰就有了答案，再投不是盲猜；讲的人也要投自己那一票（F395 要双判一致）
    ElMessage.warning('这条已经判过冰了，答案都摆出来啦，再投就不算盲考了 🧊')
    return
  }
  try {
    refresh(await laughApi.laughGuess(jokeId, predict))
    ElMessage.success(predict ? '已预判：TA 会笑 🔮' : '已预判：TA 不笑 🔮')
  } catch (e) {
    onError(e, '这一票没投出去，再试一次')
  }
}

// ========== F396 大笑处方 ==========
function pickRxKind(kind: CoupleLaughTargetKind) {
  rxKind.value = kind
  // 换类别就换候选池，之前点的那条不属于这一类，必须清掉免得开出一张指向错类的处方
  rxTargetId.value = ''
}

async function onRx() {
  if (noData()) return
  if (!rxTargetId.value) {
    ElMessage.warning('先点一条要翻给 TA 的条目，处方不能开空气 💊')
    return
  }
  const note = rxNote.value.trim()
  if (tooLong(note, RX_NOTE_MAX, '医嘱')) return
  if (rxTodayMine.value) {
    ElMessage.warning('今天的处方已经开过了，明天再复诊 💊')
    return
  }
  try {
    refresh(await laughApi.laughRx(rxKind.value, rxTargetId.value, note))
    ElMessage.success('处方已开出，等 TA 回执「已服用」💊')
  } catch (e) {
    onError(e, '这张处方没开出去，再试一次')
  }
}

async function onRxTaken(id: string) {
  if (noData()) return
  try {
    refresh(await laughApi.laughRxTaken(id))
    ElMessage.success('已回执：药效到了，笑出声 ✅')
  } catch (e) {
    onError(e, '回执没点上，再试一次')
  }
}

// ========== F397 幽默风格图鉴 ==========
async function onStyle() {
  if (noData()) return
  if (!styleCode.value) {
    ElMessage.warning('五种里先点一种：谐音梗 / 冷幽默 / 自嘲派 / 动作派 / 模仿派 🎭')
    return
  }
  const note = styleNote.value.trim()
  if (tooLong(note, STYLE_NOTE_MAX, '补一句')) return
  const aboutUser = styleAbout.value === 'me' ? myName.value : partnerName.value
  if (!aboutUser) {
    // ⚠️ LaughVO 不下发对方用户名（缺字段已上报）；这里绝不偷偷兜成「评自己」，直接说清楚
    ElMessage.warning('还没拿到 TA 的用户名，这一格只能先评自己 🎭')
    return
  }
  try {
    refresh(await laughApi.laughStyle(aboutUser, styleCode.value, note))
    ElMessage.success('风格图鉴又清晰了一点 🎭')
  } catch (e) {
    onError(e, '这一格没记下，再试一次')
  }
}

// ========== F398 欢乐周报（点按钮才懒读，首屏不自动拉） ==========
async function onWeekLoad() {
  if (noData()) return
  try {
    weekView.value = await laughApi.laughWeek()
    ElMessage.success('本周欢乐账又拉了一次 📅')
  } catch (e) {
    onError(e, '周报没查到，再试一次')
  }
}

function onWeekBack() {
  if (!weekView.value) {
    ElMessage.warning('现在看的就是总览自带的本周那份 📅')
    return
  }
  weekView.value = null
}

// ========== F399 年度笑榜（点按钮才懒读另一年，首屏不自动拉） ==========
async function onYearLoad() {
  if (noData()) return
  const year = yearInput.value.trim()
  if (year && !YEAR_RE.test(year)) {
    ElMessage.warning('年份写成 yyyy 🏆')
    return
  }
  try {
    yearView.value = await laughApi.laughYear(year)
    ElMessage.success(year ? `${year} 年的笑榜到了 🏆` : '年度笑榜（服务端当年）到了 🏆')
  } catch (e) {
    onError(e, '年度笑榜没查到，再试一次')
  }
}

function onYearBack() {
  if (!yearView.value) {
    ElMessage.warning('现在看的就是总览自带的当年那份 🏆')
    return
  }
  yearView.value = null
  yearInput.value = ''
}

async function safeLoad<T>(loader: () => Promise<T>, fallback: T): Promise<T> {
  try {
    const data = await loader()
    return (data ?? fallback) as T
  } catch {
    return fallback
  }
}

onMounted(async () => {
  // 未建空间是 404「还没有建立情侣空间」——静默降级成十张空态卡，首屏不弹错误条，
  // 也不自动打 /week 与 /year（那两个是按钮级懒读）
  const bank = await safeLoad(() => laughApi.laughBank(), null as CoupleLaughVO | null)
  if (bank) refresh(bank)
})
</script>

<style scoped>
/* 主色马戏团洋红 #a21caf（这批讲的是「一起大笑过的时刻」：大帐篷的绒布洋红 + 喜剧俱乐部的霓虹，
   跳但不甜。批次三十五开工前 grep src/components/couple/*.vue 的 --collapse-title-color，
   已用掉 #0284c7 #065f46 #0d9488 #16a34a #2c7a7b #303133 #334155 #3f51b5 #409eff #4c1d95 #556b2f
   #9254de #a0522d #be185d #c0392b #d2691e #d93a3a；全局皮肤强调色与气泡渐变端点
   （#ec5f92 #3370ff #8b5cf6 #10b981 #f97316 #06b6d4 #7c3aed）一律不挪作分区主色。
   落选理由：金黄族 #ca8a04/#b8860b/#e6a23c 与庆典鎏金/暖橙同族；#9333ea 太靠皮肤强调色 #8b5cf6、
   #c026d3 太亮压不住正文；#db2777/#ad1457 与回音壁 #be185d、皮肤粉 #ec5f92 同色相。
   #a21caf（洋红）在色相上远离倾听紫 #9254de（蓝紫 268°）与粉红族（337°），
   且在 src/ 全仓（含 style.css 与 utils/settings.ts）grep 零命中。
   本组件不写 .title 规则，折叠卡标题色一律经 --collapse-title-color 级联给 CoupleCollapsible */
.couple-laugh { display: flex; flex-direction: column; gap: 14px; --collapse-title-color: #a21caf; }
.sub { font-size: 12px; color: var(--im-muted, #909399); font-weight: normal; margin-left: 6px; }
.section-head { margin: 10px 0 4px; font-size: 13px; font-weight: bold; color: #a21caf; }
.inline-form { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 8px; }
.inline-form .el-input { flex: 1; min-width: 150px; }
.row-head { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; margin: 0; }
.row-card { margin: 7px 0; padding: 8px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid var(--im-border, #ebeef5); font-size: 13px; }
.row-card.is-partner { border-left-color: rgba(162, 28, 175, 0.35); }
.row-card.is-lit { border-left-color: #a21caf; }
.row-quote { margin: 3px 0 0; color: var(--im-text, #303133); }
.row-meta { margin: 3px 0 0; display: flex; gap: 8px; flex-wrap: wrap; font-size: 12px; color: var(--im-muted, #909399); }
.empty-line { margin: 8px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.hint-line { margin: 6px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.wait-line { margin: 6px 0 0; font-size: 12px; color: #a21caf; }
.quota-line { margin: 6px 0 0; font-size: 12px; color: #a21caf; }
.lit-line { margin: 8px 0 0; padding: 8px 10px; border-radius: 8px; font-size: 13px; color: #a21caf; background: rgba(162, 28, 175, 0.1); }
.summary-line { margin: 8px 0 0; padding: 8px 10px; border-radius: 8px; font-size: 13px; color: var(--im-text, #303133); background: var(--im-bg, #fafafa); }
.week-card, .year-card { margin: 8px 0 0; padding: 8px 10px; border-radius: 8px; background: rgba(162, 28, 175, 0.06); }
.stat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 6px; margin-top: 8px; }
.stat { margin: 0; padding: 7px 10px; border-radius: 8px; font-size: 13px; color: #a21caf; background: rgba(162, 28, 175, 0.1); }
.chip-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; align-items: center; }
.pick-label { font-size: 12px; color: var(--im-muted, #909399); }
.day-pick { font-size: 12px; color: #a21caf; background: rgba(162, 28, 175, 0.08); border: 1px solid rgba(162, 28, 175, 0.2); border-radius: 12px; padding: 2px 10px; cursor: pointer; }
.day-pick.is-picked { background: #a21caf; color: #fff; border-color: #a21caf; }
.day-chip, .kind-chip, .title-chip, .who-chip, .name-chip, .level-chip, .status-chip, .old-chip, .left-chip, .verdict-chip, .clear-chip, .lit-chip { font-size: 11px; color: #a21caf; background: rgba(162, 28, 175, 0.1); padding: 1px 8px; border-radius: 10px; }
.lit-chip, .verdict-chip { background: rgba(162, 28, 175, 0.18); }
.clear-chip { color: #c0392b; background: rgba(192, 57, 43, 0.1); }
.who-chip { font-size: 11px; color: var(--im-muted, #909399); }
</style>

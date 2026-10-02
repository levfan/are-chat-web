<template>
  <div class="couple-echo" data-testid="couple-echo">
    <!-- F350 好事簿：把「TA 为我做的事」一条条存成证据，只有记录人本人能给自己的证据加「这条救过我」 -->
    <CoupleCollapsible testid="couple-echo-deed" :empty="!v">
      <template #title>📒 好事簿 <span class="sub">记「TA 为我做的一个具体动作」：说的话留给夸夸墙，做的事存进这里。低落时这些都是证据</span></template>
      <template v-if="v">
        <p class="section-head">📒 记一件 TA 为我做的事（≤{{ DEED_MAX }} 字 · 日期可空=今天）</p>
        <el-input
          v-model="deedContent"
          type="textarea"
          :rows="2"
          :maxlength="DEED_MAX"
          show-word-limit
          :placeholder="`比如「下雨天绕路来接我」（≤${DEED_MAX} 字，写具体的事）`"
          data-testid="couple-echo-deed-content"
        />
        <div class="inline-form">
          <el-input v-model="deedDay" :maxlength="DAY_LEN" placeholder="哪天（空=今天，yyyy-MM-dd）" data-testid="couple-echo-deed-day" />
          <el-button size="small" type="primary" data-testid="couple-echo-deed-submit" @click="onDeed">记进好事簿 📒</el-button>
          <span class="count-chip" data-testid="couple-echo-deed-count">我记了 {{ v.deeds.length }} 条（卡上展示最近 {{ DEED_PAGE }} 条）</span>
        </div>

        <p class="section-head">🧾 我的证据库（我记下的「TA 为我做的事」）</p>
        <p v-if="!v.deeds.length" class="empty-line" data-testid="couple-echo-deed-empty">还没记过，第一件就从今天那件小事开始 📒</p>
        <div
          v-for="d in v.deeds"
          :key="d.id"
          class="deed-row"
          :class="{ 'is-starred': d.starred }"
          :data-testid="`couple-echo-deed-${d.id}`"
        >
          <p class="row-head">
            <span class="day-chip" :data-testid="`couple-echo-deed-day-text-${d.id}`">{{ d.day }}</span>
            <span v-if="d.starred" class="lit-chip" :data-testid="`couple-echo-deed-starred-${d.id}`">这条救过我 ⭐</span>
          </p>
          <p class="deed-text" :data-testid="`couple-echo-deed-text-${d.id}`">{{ d.content }}</p>
          <el-button
            v-if="d.mine && !d.starred"
            size="small"
            plain
            :data-testid="`couple-echo-deed-star-${d.id}`"
            @click="onDeedStar(d)"
          >
            这条真的救过我 ⭐
          </el-button>
          <p v-else-if="!d.mine" class="wait-line" :data-testid="`couple-echo-deed-star-lock-${d.id}`">这颗星归记下这条的人点，我抢不了 ⭐</p>
        </div>

        <p class="section-head">💕 TA 的证据库（TA 记下的「我为 TA 做的事」）</p>
        <p v-if="!v.partnerDeeds.length" class="empty-line" data-testid="couple-echo-deed-partner-empty">TA 还没记过，好事簿是两人的，也可以提醒 TA 一句 📒</p>
        <div v-for="d in v.partnerDeeds" :key="`p-${d.id}`" class="deed-row is-partner" :data-testid="`couple-echo-deed-partner-${d.id}`">
          <p class="row-head">
            <span class="day-chip" :data-testid="`couple-echo-deed-partner-day-${d.id}`">{{ d.day }}</span>
            <span class="who-chip" :data-testid="`couple-echo-deed-partner-who-${d.id}`">💕 {{ d.fromUser }} 记的</span>
            <span v-if="d.starred" class="lit-chip" :data-testid="`couple-echo-deed-partner-starred-${d.id}`">TA 说这条救过人 ⭐</span>
          </p>
          <p class="deed-text" :data-testid="`couple-echo-deed-partner-text-${d.id}`">{{ d.content }}</p>
        </div>
      </template>
      <p v-else class="empty-line">回音壁还没开门……</p>
    </CoupleCollapsible>

    <!-- F352 鼓励语罐：每人 ≤5 条预存打气话，领补给时随机被抽走 -->
    <CoupleCollapsible testid="couple-echo-juice" :empty="!v">
      <template #title>🫙 鼓励语罐 <span class="sub">趁状态好的时候各存 ≤{{ JUICE_CAP }} 条打气话（≤{{ JUICE_MAX }} 字），TA 低落时由系统随机抽一条出来——人在的时候弹药得先备好</span></template>
      <template v-if="v">
        <p class="section-head">🫙 往我的罐里塞一张</p>
        <div class="inline-form">
          <el-input
            v-model="juiceContent"
            :maxlength="JUICE_MAX"
            show-word-limit
            :placeholder="`写给 TA 的一句打气（≤${JUICE_MAX} 字）`"
            data-testid="couple-echo-juice-content"
          />
          <el-button size="small" type="primary" data-testid="couple-echo-juice-submit" @click="onJuice">塞进罐子 🫙</el-button>
        </div>
        <p class="juice-count" data-testid="couple-echo-juice-count">我的罐子 {{ myJuices.length }}/{{ JUICE_CAP }}</p>
        <p v-if="myJuices.length >= JUICE_CAP" class="paired-line" data-testid="couple-echo-juice-full">罐子满了：抽走一张再塞，别硬塞 🫙</p>

        <p class="section-head">🙋 我的罐（TA 低落时会从这里抽）</p>
        <p v-if="!myJuices.length" class="empty-line" data-testid="couple-echo-juice-empty">罐子还空着，先写一句「我见过的你最厉害的样子」🫙</p>
        <div v-for="j in myJuices" :key="j.id" class="juice-row" :data-testid="`couple-echo-juice-${j.id}`">
          <p class="row-head">
            <span class="kind-chip" :data-testid="`couple-echo-juice-idx-${j.id}`">{{ j.idx }} 号槽</span>
          </p>
          <p class="juice-text" :data-testid="`couple-echo-juice-text-${j.id}`">{{ j.content }}</p>
          <el-button size="small" plain :data-testid="`couple-echo-juice-del-${j.id}`" @click="onJuiceRemove(j)">抽走这张 🗑️</el-button>
        </div>

        <p class="section-head">💕 TA 的罐（写给我的弹药）</p>
        <p v-if="!taJuices.length" class="empty-line" data-testid="couple-echo-juice-partner-empty">TA 还没存，先各自备好，谁都不用现场想词 🫙</p>
        <div v-for="j in taJuices" :key="`p-${j.id}`" class="juice-row is-partner" :data-testid="`couple-echo-juice-partner-${j.id}`">
          <p class="row-head">
            <span class="kind-chip" :data-testid="`couple-echo-juice-partner-idx-${j.id}`">{{ j.idx }} 号槽</span>
            <span class="who-chip" :data-testid="`couple-echo-juice-partner-who-${j.id}`">💕 {{ j.fromUser }} 存的</span>
          </p>
          <p class="juice-text" :data-testid="`couple-echo-juice-partner-text-${j.id}`">{{ j.content }}</p>
          <p class="wait-line" :data-testid="`couple-echo-juice-partner-lock-${j.id}`">这一罐归 TA 整理，我不能替 TA 抽 🫙</p>
        </div>
      </template>
      <p v-else class="empty-line">罐子还没洗出来……</p>
    </CoupleCollapsible>

    <!-- F351 能量补给：一键翻自己的被爱证据 + 双方鼓励语 + 一条高光，每人每天一次 -->
    <CoupleCollapsible testid="couple-echo-refill" :empty="!v">
      <template #title>⚡ 能量补给 <span class="sub">难过的时候不用想起来谁爱你，点一下就行：随机翻 3 条我的证据 + 双方各一张打气话 + 一条高光，每人每天一次</span></template>
      <template v-if="v">
        <div class="inline-form">
          <el-button size="small" type="primary" data-testid="couple-echo-refill-btn" @click="onRefill">
            {{ v.refill.mineToday ? '今天已经领过了 ⚡' : '给我一点能量 ⚡' }}
          </el-button>
          <span v-if="v.refill.mineToday" class="lit-chip" data-testid="couple-echo-refill-mine-today">我今天领过了 ✔</span>
          <span v-else class="count-chip" data-testid="couple-echo-refill-year-count">这一年已经领过 {{ v.yearly.refills }} 次 ⚡</span>
          <span v-if="v.refill.partnerToday" class="who-chip" data-testid="couple-echo-refill-partner-today">💕 TA 今天也充过电</span>
        </div>
        <p class="hint-line" data-testid="couple-echo-refill-shout">
          领补给本身就会推一条消息给 TA（echo-refilled）——这就是「一键喊 TA」，不用另外打字说我不行了 📣
        </p>

        <template v-if="hasPack">
          <p class="refill-line" data-testid="couple-echo-refill-line">{{ v.refill.line }}</p>
          <p class="section-head">🧾 从你的证据库里翻出来 {{ v.refill.deeds.length }} 条</p>
          <div v-for="d in v.refill.deeds" :key="`r-${d.id}`" class="refill-item" :data-testid="`couple-echo-refill-deed-${d.id}`">
            <span class="day-chip">{{ d.day }}</span>
            <span class="refill-text">{{ d.content }}</span>
            <span v-if="d.starred" class="lit-chip" :data-testid="`couple-echo-refill-deed-starred-${d.id}`">救过人 ⭐</span>
          </div>
          <p v-if="!v.refill.deeds.length" class="empty-line" data-testid="couple-echo-refill-deed-none">证据库还空着——先去好事簿记一条，下次补给就有得翻 📒</p>
          <p class="section-head">🫙 抽到的打气话 {{ v.refill.juices.length }} 张</p>
          <div v-for="j in v.refill.juices" :key="`rj-${j.id}`" class="refill-item" :data-testid="`couple-echo-refill-juice-${j.id}`">
            <span class="who-chip">{{ j.mine ? '我存的 🙋' : `💕 ${j.fromUser} 存的` }}</span>
            <span class="refill-text">{{ j.content }}</span>
          </div>
          <p v-if="!v.refill.juices.length" class="empty-line" data-testid="couple-echo-refill-juice-none">两边的罐子都还空着，鼓励语弹药没备上 🫙</p>
          <p class="section-head">✨ 重放一条高光</p>
          <div v-for="h in v.refill.highlights" :key="`rh-${h.id}`" class="refill-item" :data-testid="`couple-echo-refill-highlight-${h.id}`">
            <p class="hl-line">{{ h.moment }}｜{{ h.did }}</p>
            <p class="hl-feel">{{ h.feel }}</p>
          </div>
          <p v-if="!v.refill.highlights.length" class="empty-line" data-testid="couple-echo-refill-highlight-none">还没收藏过高光，去精选夹写三行 ✨</p>
          <p v-if="v.refill.selfLetter" class="refill-self" data-testid="couple-echo-refill-self">
            ✉️ 顺带拆开了你写给低落自己的那封：「{{ v.refill.selfLetter }}」
          </p>
        </template>
        <p v-else-if="v.refill.mineToday" class="wait-line" data-testid="couple-echo-refill-spent">
          今天的补给已经领过了，包也收起来了 ⚡ 明天这时候再来充一次
        </p>
        <p v-else class="empty-line" data-testid="couple-echo-refill-none">还没领今天的能量，撑不住的时候不用硬撑 ⚡</p>
      </template>
      <p v-else class="empty-line">插座还没装上……</p>
    </CoupleCollapsible>

    <!-- F354 感谢慢递：想谢 TA 的话封存 7 天后送达，在途每人 ≤3 封 -->
    <CoupleCollapsible testid="couple-echo-slow" :empty="!v">
      <template #title>✉️ 感谢慢递 <span class="sub">当场说不出口的谢谢，寄出去：{{ SLOW_DELIVER_DAYS }} 天后自动送达（到日由后端读时结算），在途每人 ≤{{ SLOW_IN_FLIGHT_MAX }} 封</span></template>
      <template v-if="v">
        <p class="section-head">✉️ 写一封（≤{{ SLOW_MAX }} 字）</p>
        <el-input
          v-model="slowContent"
          type="textarea"
          :rows="2"
          :maxlength="SLOW_MAX"
          show-word-limit
          :placeholder="`谢谢 TA 的那件小事（≤${SLOW_MAX} 字，{{ SLOW_DELIVER_DAYS }} 天后才到）`"
          data-testid="couple-echo-slow-content"
        />
        <div class="inline-form">
          <el-button size="small" type="primary" data-testid="couple-echo-slow-submit" @click="onSlow">封存寄出 ✉️</el-button>
          <span class="count-chip" data-testid="couple-echo-slow-count">我在路上 {{ mySlowLeft.length }}/{{ SLOW_IN_FLIGHT_MAX }} 封</span>
        </div>

        <p class="section-head">🚚 还在路上</p>
        <p v-if="!v.slowInFlight.length" class="empty-line" data-testid="couple-echo-slow-empty">没有在途的慢递，第一封今天写好，{{ SLOW_DELIVER_DAYS }} 天后到 ✉️</p>
        <div v-for="s in v.slowInFlight" :key="s.id" class="slow-row" :data-testid="`couple-echo-slow-${s.id}`">
          <p class="row-head">
            <span class="who-chip" :data-testid="`couple-echo-slow-who-${s.id}`">{{ s.mine ? `我寄给 ${s.toUser} 的 🙋` : `💕 ${s.fromUser} 寄给我的` }}</span>
            <span class="day-chip" :data-testid="`couple-echo-slow-open-${s.id}`">{{ s.openDay }} 送达</span>
            <span class="status-chip" :data-testid="`couple-echo-slow-left-${s.id}`">{{ slowLeftText(s.openDay) }}</span>
          </p>
          <p v-if="s.mine" class="slow-text" :data-testid="`couple-echo-slow-text-${s.id}`">{{ s.content }}</p>
          <p v-else class="wait-line" :data-testid="`couple-echo-slow-sealed-${s.id}`">这封还没到站，我先不看 ✉️</p>
        </div>

        <p class="section-head">📬 已送达（最近 {{ SLOW_RECENT }} 封）</p>
        <p v-if="!v.slowArrived.length" class="empty-line" data-testid="couple-echo-slow-arrived-empty">还没有慢递到站，到了会自动推你们俩 📬</p>
        <div v-for="s in v.slowArrived" :key="`a-${s.id}`" class="slow-row is-arrived" :data-testid="`couple-echo-slow-arrived-${s.id}`">
          <p class="row-head">
            <span class="who-chip" :data-testid="`couple-echo-slow-arrived-who-${s.id}`">{{ s.mine ? '我寄的，已签收 🙋' : `💕 ${s.fromUser} 寄给我的` }}</span>
            <span class="day-chip" :data-testid="`couple-echo-slow-arrived-day-${s.id}`">{{ s.openDay }} 到站</span>
          </p>
          <p class="slow-text" :data-testid="`couple-echo-slow-arrived-text-${s.id}`">{{ s.content }}</p>
        </div>
      </template>
      <p v-else class="empty-line">邮筒还没立起来……</p>
    </CoupleCollapsible>

    <!-- F355 高光重放：三行收藏我们最好的瞬间，每人 ≤12 条，补给时随机重放 -->
    <CoupleCollapsible testid="couple-echo-highlight" :empty="!v">
      <template #title>✨ 高光重放 <span class="sub">「什么时候 + 我们做了什么 + 我的感觉」三行收藏一条。心动时刻是流水账，这里只放精选，每人 ≤{{ HL_CAP }} 条</span></template>
      <template v-if="v">
        <p class="section-head">✨ 收进精选夹（三行都得写）</p>
        <el-input v-model="hlMoment" :maxlength="HL_MOMENT_MAX" show-word-limit :placeholder="`什么时候（≤${HL_MOMENT_MAX} 字，如「去年冬天加班到十点那晚」）`" data-testid="couple-echo-highlight-moment" />
        <el-input v-model="hlDid" :maxlength="HL_DID_MAX" show-word-limit :placeholder="`我们做了什么（≤${HL_DID_MAX} 字）`" data-testid="couple-echo-highlight-did" />
        <el-input v-model="hlFeel" :maxlength="HL_FEEL_MAX" show-word-limit :placeholder="`我当时什么感觉（≤${HL_FEEL_MAX} 字）`" data-testid="couple-echo-highlight-feel" />
        <div class="inline-form">
          <el-button size="small" type="primary" data-testid="couple-echo-highlight-submit" @click="onHighlight">收进精选夹 ✨</el-button>
          <span class="count-chip" data-testid="couple-echo-highlight-count">我的精选夹 {{ myHighlights.length }}/{{ HL_CAP }}</span>
        </div>

        <p class="section-head">🙋 我的精选</p>
        <p v-if="!myHighlights.length" class="empty-line" data-testid="couple-echo-highlight-empty">精选夹还空着，先想一件「现在想起来还会笑」的事 ✨</p>
        <div v-for="h in myHighlights" :key="h.id" class="hl-row" :data-testid="`couple-echo-highlight-${h.id}`">
          <p class="hl-line" :data-testid="`couple-echo-highlight-moment-${h.id}`">🕐 {{ h.moment }}</p>
          <p class="hl-line" :data-testid="`couple-echo-highlight-did-${h.id}`">🎬 {{ h.did }}</p>
          <p class="hl-feel" :data-testid="`couple-echo-highlight-feel-${h.id}`">💗 {{ h.feel }}</p>
          <el-button size="small" plain :data-testid="`couple-echo-highlight-del-${h.id}`" @click="onHighlightRemove(h)">撤下这条 ✨</el-button>
        </div>

        <p class="section-head">💕 TA 的精选</p>
        <p v-if="!taHighlights.length" class="empty-line" data-testid="couple-echo-highlight-partner-empty">TA 还没收藏，等 TA 那一份 ✨</p>
        <div v-for="h in taHighlights" :key="`p-${h.id}`" class="hl-row is-partner" :data-testid="`couple-echo-highlight-partner-${h.id}`">
          <p class="hl-line" :data-testid="`couple-echo-highlight-partner-moment-${h.id}`">🕐 {{ h.moment }}</p>
          <p class="hl-line" :data-testid="`couple-echo-highlight-partner-did-${h.id}`">🎬 {{ h.did }}</p>
          <p class="hl-feel" :data-testid="`couple-echo-highlight-partner-feel-${h.id}`">💗 {{ h.feel }}</p>
          <p class="wait-line" :data-testid="`couple-echo-highlight-partner-lock-${h.id}`">精选夹只归本人整理，我不动 TA 的 🗂️</p>
        </div>
      </template>
      <p v-else class="empty-line">精选夹还没买……</p>
    </CoupleCollapsible>

    <!-- F356 夸夸回执：对夸夸墙里夸我的句子点「收到」，回执句进能量库 -->
    <CoupleCollapsible testid="couple-echo-receipt" :empty="!hasReceiptStuff">
      <template #title>🧾 夸夸回执 <span class="sub">夸夸墙上那些夸你的句子，点一下「收到」——TA 看见「已送达」，这句也从此进你的能量库</span></template>
      <template v-if="v">
        <p class="section-head">📥 等你签收的夸夸（来自夸夸墙）</p>
        <p v-if="!pendingPraises.length" class="empty-line" data-testid="couple-echo-receipt-quote-none">没有待签收的句子了：要么都签完了，要么 TA 还没开始夸 🌟</p>
        <div v-for="p in pendingPraises" :key="`q-${p.id}`" class="receipt-row" :data-testid="`couple-echo-receipt-quote-${p.id}`">
          <p class="row-head">
            <span class="who-chip" :data-testid="`couple-echo-receipt-quote-who-${p.id}`">💕 {{ p.fromUser }} 夸我的</span>
          </p>
          <p class="receipt-text" :data-testid="`couple-echo-receipt-quote-text-${p.id}`">{{ p.content }}</p>
          <el-button size="small" type="primary" plain :data-testid="`couple-echo-receipt-quote-btn-${p.id}`" @click="onReceipt(p.id)">收到 🧾</el-button>
        </div>

        <p class="section-head">📮 我签过的回执（{{ v.receipts.length }} 张）</p>
        <p v-if="!v.receipts.length" class="empty-line" data-testid="couple-echo-receipt-empty">还没签过回执——被夸的话，认真回一句「我收到了」也很重要 🧾</p>
        <div v-for="r in v.receipts" :key="r.id" class="receipt-row is-done" :data-testid="`couple-echo-receipt-${r.id}`">
          <p class="row-head">
            <span class="status-chip" :data-testid="`couple-echo-receipt-done-${r.id}`">已送达 📢</span>
            <span v-if="r.quoteFrom" class="who-chip" :data-testid="`couple-echo-receipt-from-${r.id}`">夸我的人：{{ r.quoteFrom }}</span>
          </p>
          <p class="receipt-text" :data-testid="`couple-echo-receipt-quote-text-given-${r.id}`">{{ r.quoteContent || '（那句夸夸已经被撤下，回执还在账上）' }}</p>
        </div>
        <p class="hint-line" data-testid="couple-echo-receipt-note">
          这是回音壁的第二层签收：F54 夸夸墙那张「收到啦」是墙上的状态，这里的回执是把那句存进能量库 🧾
        </p>
      </template>
      <p v-else class="empty-line">回执单还没印出来……</p>
    </CoupleCollapsible>

    <!-- F357 电量预报：每天自报社交电量 1-5 格 + 今天想被怎样对待，≤2 格给对方「今晚轻轻的」提示 -->
    <CoupleCollapsible testid="couple-echo-battery" :empty="!v">
      <template #title>🔋 电量预报 <span class="sub">今天还剩几格电、想被怎样对待，先说一句。你不用猜 TA 今晚扛不扛得住，TA 也不用装</span></template>
      <template v-if="v">
        <p class="section-head">🔋 报今天的电量（1-5 格，本人当天可改写）</p>
        <div class="inline-form">
          <el-radio-group v-model="batteryLevel" data-testid="couple-echo-battery-level">
            <el-radio v-for="n in BATTERY_STEPS" :key="n" :value="n" :data-testid="`couple-echo-battery-opt-${n}`">{{ n }} 格</el-radio>
          </el-radio-group>
        </div>
        <div class="inline-form">
          <el-input v-model="batteryWant" :maxlength="WANT_MAX" show-word-limit :placeholder="`今天想被怎样对待（≤${WANT_MAX} 字，可空）`" data-testid="couple-echo-battery-want" />
          <el-button size="small" type="primary" data-testid="couple-echo-battery-submit" @click="onBattery">报上今天的电量 🔋</el-button>
        </div>

        <p class="section-head">📊 今天这两格</p>
        <template v-if="myBattery">
          <div class="battery-row" :class="{ 'is-low': myBattery.level <= BATTERY_LOW }" data-testid="couple-echo-battery-mine">
            <p class="row-head">
              <span class="who-chip">我报的 🙋</span>
              <span class="battery-cells" data-testid="couple-echo-battery-mine-cells">{{ cells(myBattery.level) }} {{ myBattery.level }}/{{ BATTERY_MAX }}</span>
            </p>
            <p class="battery-want" data-testid="couple-echo-battery-mine-want">{{ myBattery.want || '（没写想被怎样对待）' }}</p>
          </div>
        </template>
        <p v-else class="empty-line" data-testid="couple-echo-battery-mine-none">我今天还没报电量 ⏳</p>
        <template v-if="taBattery">
          <div class="battery-row is-partner" :class="{ 'is-low': taBattery.level <= BATTERY_LOW }" data-testid="couple-echo-battery-partner">
            <p class="row-head">
              <span class="who-chip">💕 {{ taBattery.fromUser }} 报的</span>
              <span class="battery-cells" data-testid="couple-echo-battery-partner-cells">{{ cells(taBattery.level) }} {{ taBattery.level }}/{{ BATTERY_MAX }}</span>
            </p>
            <p class="battery-want" data-testid="couple-echo-battery-partner-want">{{ taBattery.want || '（TA 没写想被怎样对待）' }}</p>
            <p v-if="taBattery.hint" class="battery-hint" data-testid="couple-echo-battery-hint">{{ taBattery.hint }}</p>
          </div>
        </template>
        <p v-else class="wait-line" data-testid="couple-echo-battery-partner-none">TA 今天还没报电量——别催，等 TA 自己说 🫱</p>
      </template>
      <p v-else class="empty-line">电量表还没通电……</p>
    </CoupleCollapsible>

    <!-- F358 写给低落的自己：≤300 字，一人同时一封，本人拆读或领补给时才见正文 -->
    <CoupleCollapsible testid="couple-echo-self" :empty="!v">
      <template #title>🖐️ 写给低落的自己 <span class="sub">状态好的时候给「下次 emo 的自己」写一封（≤{{ SELF_MAX }} 字）。这封不给 TA 看，只在本人拆读或领补给时才见正文，读完才能再写</span></template>
      <template v-if="v">
        <template v-if="v.selfLetter && v.selfLetter.status === 'SEALED'">
          <div class="self-sealed" data-testid="couple-echo-self-sealed">
            <p class="row-head">
              <span class="status-chip" data-testid="couple-echo-self-status">封存中 ✉️</span>
              <span class="day-chip" data-testid="couple-echo-self-created">写于 {{ tsDay(v.selfLetter.created) }}</span>
            </p>
            <p class="wait-line" data-testid="couple-echo-self-sealed-tip">正文先不给你看：这封要在你低落的时候才有意义——现在拆读，或者等下次领补给时顺带打开 🖐️</p>
            <el-button size="small" type="primary" data-testid="couple-echo-self-read" @click="onSelfRead">现在就拆读它 ✉️</el-button>
          </div>
        </template>
        <template v-else>
          <p v-if="v.selfLetter" class="self-read" data-testid="couple-echo-self-read-line">
            你拆开过的那一封（{{ tsDay(v.selfLetter.created) }} 写的）：「{{ v.selfLetter.content }}」
          </p>
          <p v-else-if="!v.refill.selfLetter" class="empty-line" data-testid="couple-echo-self-empty">现在没有在途的信，趁着还撑得住写一封吧 🖐️</p>
          <el-input
            v-model="selfContent"
            type="textarea"
            :rows="3"
            :maxlength="SELF_MAX"
            show-word-limit
            :placeholder="`写给下次低落的自己（≤${SELF_MAX} 字，只有你自己能看到）`"
            data-testid="couple-echo-self-content"
          />
          <div class="inline-form">
            <el-button size="small" type="primary" data-testid="couple-echo-self-submit" @click="onSelf">封存起来 ✉️</el-button>
            <span class="hint-line">不推送给对方——这封是给你自己的，不是给 TA 的</span>
          </div>
        </template>
      </template>
      <p v-else class="empty-line">信纸还没裁出来……</p>
    </CoupleCollapsible>

    <!-- F353 被爱日历：按年懒读，只列有动静的日子 -->
    <CoupleCollapsible testid="couple-echo-calendar" :empty="!hasCalendar">
      <template #title>📅 被爱日历 <span class="sub">一天一格：那天有新证据、有人加星、或有人领过补给就点亮。按年翻，只列有动静的日子</span></template>
      <template v-if="v">
        <div class="inline-form">
          <el-input v-model="calYear" :maxlength="YEAR_LEN" placeholder="看哪一年（空=今年，yyyy）" data-testid="couple-echo-calendar-year" />
          <el-button size="small" type="primary" data-testid="couple-echo-calendar-btn" @click="onCalendar">点亮这一年的日历 📅</el-button>
        </div>
        <template v-if="calendar">
          <p class="cal-count" data-testid="couple-echo-calendar-count">{{ calYearShown }} 年一共点亮了 {{ calendar.length }} 天</p>
          <div v-for="m in calendarMonths" :key="m.key" class="cal-month">
            <p class="section-head" :data-testid="`couple-echo-calendar-month-${m.key}`">{{ m.label }}</p>
            <div class="cal-grid">
              <div v-for="d in m.days" :key="d.day" class="cal-cell" :data-testid="`couple-echo-calendar-day-${d.day}`">
                <span class="cal-day">{{ Number(d.day.slice(8, 10)) }} 日</span>
                <span class="count-chip" :data-testid="`couple-echo-calendar-deeds-${d.day}`">证据 {{ d.deeds }} 条</span>
                <span v-if="d.starred" class="lit-chip" :data-testid="`couple-echo-calendar-starred-${d.day}`">救过 {{ d.starred }} 次 ⭐</span>
                <span v-if="d.refilled" class="who-chip" :data-testid="`couple-echo-calendar-refilled-${d.day}`">那天充过电 ⚡</span>
              </div>
            </div>
          </div>
        </template>
        <p v-else class="empty-line" data-testid="couple-echo-calendar-idle">还没点日历，上面输个年份点一下就有 📅</p>
      </template>
      <p v-else class="empty-line">挂历还没钉上墙……</p>
    </CoupleCollapsible>

    <!-- F359 回音壁年报：五项真数字 + Bank 文案 -->
    <CoupleCollapsible testid="couple-echo-year" :empty="!v">
      <template #title>🏆 回音壁年报 <span class="sub">证据数 / 救过几次 / 领补给次数 / 慢递送达数 / 夸夸回执数，五个数全是真表里捞的，最后一句由我们来说</span></template>
      <template v-if="v">
        <div class="inline-form">
          <el-input v-model="reportYear" :maxlength="YEAR_LEN" placeholder="读哪一年（空=今年，yyyy）" data-testid="couple-echo-year-input" />
          <el-button size="small" type="primary" data-testid="couple-echo-year-btn" @click="onYear">读这一年 🏆</el-button>
          <el-button v-if="yearVo" size="small" plain data-testid="couple-echo-year-reset" @click="onYearBack">回到今年 ↩️</el-button>
        </div>
        <template v-if="shownYear">
          <p class="row-head">
            <span class="year-chip" data-testid="couple-echo-year-viewing">{{ shownYear.year }} 年</span>
            <span v-if="shownFromCache" class="count-chip" data-testid="couple-echo-year-current">这份是随总览下发的今年年报</span>
          </p>
          <div class="year-grid">
            <p class="year-stat" data-testid="couple-echo-year-deeds">好事证据 {{ shownYear.deeds }} 条</p>
            <p class="year-stat" data-testid="couple-echo-year-starred">救过人 {{ shownYear.starred }} 次 ⭐</p>
            <p class="year-stat" data-testid="couple-echo-year-refills">能量补给 {{ shownYear.refills }} 次 ⚡</p>
            <p class="year-stat" data-testid="couple-echo-year-slow">慢递送达 {{ shownYear.slowArrived }} 封 ✉️</p>
            <p class="year-stat" data-testid="couple-echo-year-receipts">夸夸回执 {{ shownYear.receipts }} 张 🧾</p>
          </div>
          <p class="year-summary" data-testid="couple-echo-year-summary">{{ shownYear.summary }}</p>
        </template>
        <p v-else class="empty-line" data-testid="couple-echo-year-none">年报机还没吐出这一年的数，点上面读一次 🏆</p>
      </template>
      <p v-else class="empty-line">年度台账还空着……</p>
    </CoupleCollapsible>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { coupleApi, echoApi } from '@/api/couple'
import type {
  CoupleEchoCalendarDayVO,
  CoupleEchoDeedVO,
  CoupleEchoHighlightVO,
  CoupleEchoJuiceVO,
  CoupleEchoVO,
  CoupleEchoYearlyVO,
  CouplePraiseVO,
} from '@/types'
import CoupleCollapsible from './CoupleCollapsible.vue'

/**
 * 限长与上限抄自后端 CoupleEchoService 与实体常量（只用于输入框限长与前端闸门文案；
 * 归属判定、幂等、业务规则一律留在后端，400 中文直透）：
 * CoupleEchoDeed.CONTENT_MAX=80 / CoupleEchoJuice.CONTENT_MAX=60 CAP=5 /
 * CoupleEchoSlow.CONTENT_MAX=100 IN_FLIGHT_MAX=3 DELIVER_AFTER_DAYS=7 /
 * CoupleEchoHighlight.MOMENT_MAX=40 DID_MAX=80 FEEL_MAX=80 CAP=12 /
 * CoupleEchoBattery LEVEL_MIN=1 LEVEL_MAX=5 LOW_LEVEL=2 WANT_MAX=40 /
 * CoupleEchoSelfLetter.CONTENT_MAX=300 / DEED_PAGE=30 / RECENT_ARRIVED=10
 */
const DEED_MAX = 80
const DEED_PAGE = 30
const JUICE_MAX = 60
const JUICE_CAP = 5
const SLOW_MAX = 100
const SLOW_IN_FLIGHT_MAX = 3
const SLOW_DELIVER_DAYS = 7
const SLOW_RECENT = 10
const HL_MOMENT_MAX = 40
const HL_DID_MAX = 80
const HL_FEEL_MAX = 80
const HL_CAP = 12
const BATTERY_STEPS = [1, 2, 3, 4, 5]
const BATTERY_MAX = 5
const BATTERY_LOW = 2
const WANT_MAX = 40
const SELF_MAX = 300
const DAY_LEN = 10
const YEAR_LEN = 4
const DAY_MS = 86_400_000
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/
const YEAR_RE = /^\d{4}$/

/** 整份回音壁总览（GET /vault 与 12 个 POST 写接口都返回它，整体替换即十卡刷新） */
const v = ref<CoupleEchoVO | null>(null)
/** F356 待签收的夸夸句子：EchoVO 不下发候选句，跨模块只读一次既有夸夸墙（GET /api/couple/care/praises） */
const praises = ref<CouplePraiseVO[]>([])
/** F353 被爱日历（按年懒读，独立于总览） */
const calendar = ref<CoupleEchoCalendarDayVO[] | null>(null)
const calYear = ref('')
const calYearShown = ref('')
/** F359 另读一个年份的年报；null=直接吃总览里的今年 yearly */
const yearVo = ref<CoupleEchoYearlyVO | null>(null)
const reportYear = ref('')

// ---- 草稿（全是「本人这一侧」的输入口） ----
const deedContent = ref('')
const deedDay = ref('')
const juiceContent = ref('')
const slowContent = ref('')
const hlMoment = ref('')
const hlDid = ref('')
const hlFeel = ref('')
const batteryLevel = ref(0)
const batteryWant = ref('')
const selfContent = ref('')

// ---- 派生 ----
const myJuices = computed<CoupleEchoJuiceVO[]>(() => v.value?.juices.filter((j) => j.mine) ?? [])
const taJuices = computed<CoupleEchoJuiceVO[]>(() => v.value?.juices.filter((j) => !j.mine) ?? [])
const myHighlights = computed<CoupleEchoHighlightVO[]>(() => v.value?.highlights.filter((h) => h.mine) ?? [])
const taHighlights = computed<CoupleEchoHighlightVO[]>(() => v.value?.highlights.filter((h) => !h.mine) ?? [])
const mySlowLeft = computed(() => v.value?.slowInFlight.filter((s) => s.mine) ?? [])
const myBattery = computed(() => v.value?.battery.find((b) => b.mine) ?? null)
const taBattery = computed(() => v.value?.battery.find((b) => !b.mine) ?? null)
/** 补给包有没有内容（后端只在 POST /refill 那一次返回里装包） */
const hasPack = computed(() => {
  const r = v.value?.refill
  if (!r) return false
  return r.deeds.length > 0 || r.juices.length > 0 || r.highlights.length > 0 || !!r.selfLetter || !!r.line
})
/** 已经签过的回执对应的 quoteId 集合（同一句不重复出签收钮，后端 uk 幂等） */
const receiptedIds = computed(() => new Set((v.value?.receipts ?? []).map((r) => r.quoteId)))
const pendingPraises = computed(() => praises.value.filter((p) => !p.mine && !receiptedIds.value.has(p.id)))
const hasReceiptStuff = computed(() => !!v.value && (v.value.receipts.length > 0 || pendingPraises.value.length > 0))
const hasCalendar = computed(() => !!v.value && (calendar.value?.length ?? 0) > 0)
const shownYear = computed(() => yearVo.value ?? v.value?.yearly ?? null)
const shownFromCache = computed(() => !yearVo.value)

const calendarMonths = computed(() => {
  const groups = new Map<string, CoupleEchoCalendarDayVO[]>()
  ;(calendar.value ?? []).forEach((d) => {
    const key = d.day.length >= 7 ? d.day.slice(0, 7) : d.day
    const bucket = groups.get(key) ?? []
    bucket.push(d)
    groups.set(key, bucket)
  })
  return [...groups.entries()].map(([key, days]) => ({
    key,
    label: `${Number(key.slice(5, 7)) || key} 月`,
    days,
  }))
})

function cells(level: number): string {
  const n = Math.max(0, Math.min(BATTERY_MAX, level))
  return `${'▮'.repeat(n)}${'▯'.repeat(BATTERY_MAX - n)}`
}

/** 送达日倒数：吃服务端下发的 v.day，不用本地时钟（避免两端跨日不一致） */
function slowLeftText(openDay: string): string {
  const left = dayLeft(openDay)
  if (left <= 0) return '今天到站 📬'
  if (left === 1) return '明天到站 📬'
  return `还有 ${left} 天到站 🚚`
}

function dayLeft(day: string): number {
  const today = v.value?.day ?? ''
  if (!DAY_RE.test(day) || !DAY_RE.test(today)) return 0
  const a = Date.parse(`${today}T00:00:00Z`)
  const b = Date.parse(`${day}T00:00:00Z`)
  if (Number.isNaN(a) || Number.isNaN(b)) return 0
  return Math.round((b - a) / DAY_MS)
}

function tsDay(ts: number): string {
  if (!ts) return '（时间未知）'
  const d = new Date(ts)
  const mm = `${d.getMonth() + 1}`.padStart(2, '0')
  const dd = `${d.getDate()}`.padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

function onError(e: unknown, fallback: string) {
  // 后端 400/404 的中文 message 直接透传（例如「只有记下这条的人能加星」「路上还有 3 封」）
  ElMessage.error(e instanceof Error ? e.message : fallback)
}

/**
 * 写接口统一返回整份 EchoVO：整体替换即十卡刷新。
 * 替换后只回填「本人这一侧」的输入口：电量按自己那格回填（当天可改写），
 * 一次性写入的（好事/纸条/慢递/高光/信）清空重填；日历与年报是独立懒读结果，不被总览覆盖。
 */
function refresh(data: CoupleEchoVO | null | undefined) {
  if (!data) return
  v.value = data
  deedContent.value = ''
  deedDay.value = ''
  juiceContent.value = ''
  slowContent.value = ''
  hlMoment.value = ''
  hlDid.value = ''
  hlFeel.value = ''
  selfContent.value = ''
  const mine = data.battery.find((b) => b.mine)
  batteryLevel.value = mine ? mine.level : 0
  batteryWant.value = mine?.want ?? ''
}

// ---- F350 好事簿 ----
async function onDeed() {
  const content = deedContent.value.trim()
  if (!content) {
    ElMessage.warning('好事总得写一句，别空着 📒')
    return
  }
  if (content.length > DEED_MAX) {
    ElMessage.warning(`一件好事最多 ${DEED_MAX} 字，写最具体的那件 📒`)
    return
  }
  const day = deedDay.value.trim()
  if (day && !DAY_RE.test(day)) {
    ElMessage.warning('日期写成 yyyy-MM-dd 📒')
    return
  }
  try {
    refresh(await echoApi.echoDeed(content, day))
    ElMessage.success('记下了，这笔进 TA 的被爱证据库 📒')
  } catch (e) {
    onError(e, '记好事失败')
  }
}

async function onDeedStar(d: CoupleEchoDeedVO) {
  if (!d.id) {
    ElMessage.warning('这条证据还没编号，重读一次总览再点 ⭐')
    return
  }
  if (!d.mine) {
    ElMessage.warning('这颗星归记下这条的人点，我抢不了 ⭐')
    return
  }
  try {
    refresh(await echoApi.echoDeedStar(d.id))
    ElMessage.success('盖上了：低谷时它真的被打开过 ⭐')
  } catch (e) {
    onError(e, '加星失败')
  }
}

// ---- F352 鼓励语罐 ----
async function onJuice() {
  const content = juiceContent.value.trim()
  if (!content) {
    ElMessage.warning('鼓励语总得写一句 🫙')
    return
  }
  if (content.length > JUICE_MAX) {
    ElMessage.warning(`一张纸条最多 ${JUICE_MAX} 字，短一点才记得住 🫙`)
    return
  }
  if (myJuices.value.length >= JUICE_CAP) {
    ElMessage.warning(`罐子装不下了（每人 ${JUICE_CAP} 条），先抽走一张再塞 🫙`)
    return
  }
  try {
    refresh(await echoApi.echoJuice(content))
    ElMessage.success('塞好了，等 TA 低落时被随机抽走 🫙')
  } catch (e) {
    onError(e, '塞鼓励语失败')
  }
}

async function onJuiceRemove(j: CoupleEchoJuiceVO) {
  if (!j.mine) {
    ElMessage.warning('只能清自己罐子里的纸条 🫙')
    return
  }
  try {
    refresh(await echoApi.echoJuiceRemove(j.id))
    ElMessage.success('抽出来了，槽位留给下一句 🫙')
  } catch (e) {
    onError(e, '抽走纸条失败')
  }
}

// ---- F351 能量补给 ----
async function onRefill() {
  if (v.value?.refill.mineToday) {
    // 后端也会 400「今天已经充过电了」，前端先挡下来给一句话，不浪费这次提交
    ElMessage.warning('今天已经充过电了，明天这时候再来领一次 ⚡')
    return
  }
  try {
    refresh(await echoApi.echoRefill())
    ElMessage.success('补给包拆开了，慢慢用 ⚡')
  } catch (e) {
    onError(e, '领补给失败')
  }
}

// ---- F354 感谢慢递 ----
async function onSlow() {
  const content = slowContent.value.trim()
  if (!content) {
    ElMessage.warning('想谢的话总要写一句 ✉️')
    return
  }
  if (content.length > SLOW_MAX) {
    ElMessage.warning(`慢递最多 ${SLOW_MAX} 字，留一句就够 ✉️`)
    return
  }
  if (mySlowLeft.value.length >= SLOW_IN_FLIGHT_MAX) {
    ElMessage.warning(`路上还有 ${SLOW_IN_FLIGHT_MAX} 封，先等它们到站 ✉️`)
    return
  }
  try {
    refresh(await echoApi.echoSlow(content))
    ElMessage.success(`封好了，${SLOW_DELIVER_DAYS} 天后自动送到 TA 手上 ✉️`)
  } catch (e) {
    onError(e, '寄慢递失败')
  }
}

// ---- F355 高光重放 ----
async function onHighlight() {
  const moment = hlMoment.value.trim()
  const did = hlDid.value.trim()
  const feel = hlFeel.value.trim()
  if (!moment) {
    ElMessage.warning('先写「什么时候」，高光得有日期 ✨')
    return
  }
  if (moment.length > HL_MOMENT_MAX) {
    ElMessage.warning(`「什么时候」最多 ${HL_MOMENT_MAX} 字 ✨`)
    return
  }
  if (!did) {
    ElMessage.warning('再写「我们做了什么」，别只留一句感觉 ✨')
    return
  }
  if (did.length > HL_DID_MAX) {
    ElMessage.warning(`「做了什么」最多 ${HL_DID_MAX} 字 ✨`)
    return
  }
  if (!feel) {
    ElMessage.warning('最后一行写「当时什么感觉」✨')
    return
  }
  if (feel.length > HL_FEEL_MAX) {
    ElMessage.warning(`「什么感觉」最多 ${HL_FEEL_MAX} 字 ✨`)
    return
  }
  if (myHighlights.value.length >= HL_CAP) {
    ElMessage.warning(`精选夹满了（每人 ${HL_CAP} 条），先撤一条再收 ✨`)
    return
  }
  try {
    refresh(await echoApi.echoHighlight(moment, did, feel))
    ElMessage.success('收进精选夹了，补给时会随机重放 ✨')
  } catch (e) {
    onError(e, '收藏高光失败')
  }
}

async function onHighlightRemove(h: CoupleEchoHighlightVO) {
  if (!h.mine) {
    ElMessage.warning('只能整理自己的精选夹 ✨')
    return
  }
  try {
    refresh(await echoApi.echoHighlightRemove(h.id))
    ElMessage.success('撤下来了，精选夹留最好的那几条 ✨')
  } catch (e) {
    onError(e, '撤下高光失败')
  }
}

// ---- F356 夸夸回执 ----
async function onReceipt(quoteId: string) {
  if (!quoteId) {
    ElMessage.warning('这句夸夸还没编号，重读一次夸夸墙再签 🧾')
    return
  }
  try {
    refresh(await echoApi.echoReceipt(quoteId))
    ElMessage.success('签收了，这句以后就在你的能量库里 🧾')
  } catch (e) {
    onError(e, '签收失败')
  }
}

// ---- F357 电量预报 ----
async function onBattery() {
  // 后端 level 传 null 会静默按 3 格、越界钳到 1-5；前端要求必须自己点一格，别替 TA 猜电量
  if (!batteryLevel.value) {
    ElMessage.warning('先点一下今天的电量是几格（1-5）🔋')
    return
  }
  if (batteryLevel.value < 1 || batteryLevel.value > BATTERY_MAX) {
    ElMessage.warning(`电量只有 ${1}-${BATTERY_MAX} 格，别填超了 🔋`)
    return
  }
  const want = batteryWant.value.trim()
  if (want.length > WANT_MAX) {
    ElMessage.warning(`「今天想被怎样对待」最多 ${WANT_MAX} 字 🔋`)
    return
  }
  try {
    refresh(await echoApi.echoBattery(batteryLevel.value, want))
    ElMessage.success(`报好了：今天 ${batteryLevel.value} 格 🔋`)
  } catch (e) {
    onError(e, '报电量失败')
  }
}

// ---- F358 写给低落的自己 ----
async function onSelf() {
  const content = selfContent.value.trim()
  if (!content) {
    ElMessage.warning('哪怕一句也行，写给低落的自己 ✉️')
    return
  }
  if (content.length > SELF_MAX) {
    ElMessage.warning(`这封信最多 ${SELF_MAX} 字 ✉️`)
    return
  }
  if (v.value?.selfLetter && v.value.selfLetter.status === 'SEALED') {
    ElMessage.warning('还有一封在等你：先把它拆了，再写下一封 ✉️')
    return
  }
  try {
    refresh(await echoApi.echoSelf(content))
    ElMessage.success('封好了，下次低落的时候它会在 ✉️')
  } catch (e) {
    onError(e, '写信失败')
  }
}

async function onSelfRead() {
  if (!v.value?.selfLetter) {
    ElMessage.warning('现在没有在途的信，先写一封再拆 ✉️')
    return
  }
  try {
    refresh(await echoApi.echoSelfRead())
    ElMessage.success('拆开了，这封是你自己留给你的 ✉️')
  } catch (e) {
    onError(e, '拆信失败')
  }
}

// ---- F353 被爱日历（懒读） ----
async function onCalendar() {
  const year = calYear.value.trim()
  if (year && !YEAR_RE.test(year)) {
    ElMessage.warning('年份写成 yyyy 📅')
    return
  }
  try {
    const days = await echoApi.echoCalendar(year)
    calendar.value = Array.isArray(days) ? days : []
    calYearShown.value = year || v.value?.day.slice(0, 4) || ''
    ElMessage.success(`点亮好了：这一年有 ${calendar.value.length} 天有过动静 📅`)
  } catch (e) {
    onError(e, '读日历失败')
  }
}

// ---- F359 年报（懒读另一年） ----
async function onYear() {
  const year = reportYear.value.trim()
  if (year && !YEAR_RE.test(year)) {
    ElMessage.warning('年份写成 yyyy 🏆')
    return
  }
  try {
    const data = await echoApi.echoYear(year)
    if (data) yearVo.value = data
    else ElMessage.warning('这一年还没有年报数据 🏆')
  } catch (e) {
    onError(e, '读年报失败')
  }
}

function onYearBack() {
  yearVo.value = null
  reportYear.value = ''
  ElMessage.success('回到今年的年报 🏆')
}

/** 首次加载静默降级：未建空间 404 不弹错误条，十卡一律留空态（夸夸墙同理） */
async function safeLoad<T>(loader: () => Promise<T>, fallback: T): Promise<T> {
  try {
    const data = await loader()
    return (data ?? fallback) as T
  } catch {
    return fallback
  }
}

onMounted(async () => {
  const [vault, wall] = await Promise.all([
    safeLoad(() => echoApi.echoVault(), null as CoupleEchoVO | null),
    safeLoad(() => coupleApi.praises(), [] as CouplePraiseVO[]),
  ])
  if (vault) refresh(vault)
  praises.value = Array.isArray(wall) ? wall : []
})
</script>

<style scoped>
/* 主色深玫瑰酒红 #be185d（回音壁讲的是「被爱的证据」，用压得住的深玫瑰，不是主题粉那种甜；
   全仓 grep src/components/couple/*.vue 确认零占用：既有卡标题主色已用掉
   --collapse-title-color 的 #d93a3a 中国红 / #409eff 公司蓝 / #16a34a 身体监护绿 / #c0392b 庆典朱红 /
   #d2691e 工坊橙棕 / #065f46 墨玉绿 / #9254de 倾听紫 / #3f51b5 靛蓝 / #0284c7 修复天蓝 /
   #0d9488 剧幕青绿 / #a0522d 人情茶褐 / #2c7a7b 考据墨青（cozy 那卡走 var(--im-text)），
   组件内另外常见的点缀色 #f56c6c 主题粉 / #b8860b 鎏金 / #e6a23c 暖橙 / #67c23a 绿 也不撞；
   全局六套皮肤强调色与聊天气泡渐变端点（#ec5f92/#3370ff/#8b5cf6/#10b981/#f97316/#06b6d4/#7c3aed）同样没用它。
   本组件不写 .title 规则，折叠卡标题色一律经 --collapse-title-color 级联给 CoupleCollapsible */
.couple-echo { display: flex; flex-direction: column; gap: 14px; --collapse-title-color: #be185d; }
.sub { font-size: 12px; color: var(--im-muted, #909399); font-weight: normal; margin-left: 6px; }
.section-head { margin: 10px 0 4px; font-size: 13px; font-weight: bold; color: #be185d; }
.inline-form { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 8px; }
.inline-form .el-input { flex: 1; min-width: 150px; }
.row-head { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; margin: 0; }
.empty-line { margin: 8px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.hint-line { font-size: 12px; color: var(--im-muted, #909399); }
.wait-line { margin: 6px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.who-chip { font-size: 11px; color: var(--im-muted, #909399); }
.day-chip, .status-chip, .kind-chip, .count-chip, .year-chip { font-size: 11px; color: #be185d; background: rgba(190, 24, 93, 0.1); padding: 1px 8px; border-radius: 10px; }
.lit-chip { font-size: 12px; color: #b8860b; background: rgba(184, 134, 11, 0.12); padding: 2px 8px; border-radius: 6px; }
.paired-line { margin: 6px 0 0; font-size: 12px; color: #be185d; }
/* F350 好事簿 */
.deed-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid var(--im-border, #ebeef5); font-size: 13px; }
.deed-row.is-starred { border-left-color: #be185d; }
.deed-row.is-partner { border-left-color: rgba(190, 24, 93, 0.35); }
.deed-text { margin: 3px 0 6px; color: var(--im-text, #303133); }
/* F352 鼓励语罐 */
.juice-count { margin: 6px 0 0; font-size: 12px; color: #be185d; }
.juice-row { margin: 6px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid var(--im-border, #ebeef5); font-size: 13px; }
.juice-row.is-partner { border-left-color: rgba(190, 24, 93, 0.35); }
.juice-text { margin: 3px 0 6px; color: var(--im-text, #303133); }
/* F351 能量补给 */
.refill-line { margin: 10px 0 0; padding: 8px 10px; border-radius: 8px; font-size: 13px; color: #be185d; background: rgba(190, 24, 93, 0.08); }
.refill-item { margin: 6px 0; padding: 6px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); font-size: 13px; display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; }
.refill-text { color: var(--im-text, #303133); }
.refill-self { margin: 8px 0 0; padding: 8px 10px; border-radius: 8px; font-size: 13px; color: #be185d; background: rgba(190, 24, 93, 0.08); }
/* F354 慢递 */
.slow-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid var(--im-border, #ebeef5); font-size: 13px; }
.slow-row.is-arrived { border-left-color: #be185d; }
.slow-text { margin: 4px 0 0; color: var(--im-text, #303133); }
/* F355 高光 */
.hl-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid var(--im-border, #ebeef5); font-size: 13px; }
.hl-row.is-partner { border-left-color: rgba(190, 24, 93, 0.35); }
.hl-line { margin: 2px 0 0; color: var(--im-text, #303133); }
.hl-feel { margin: 2px 0 6px; color: #be185d; }
/* F356 回执 */
.receipt-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid var(--im-border, #ebeef5); font-size: 13px; }
.receipt-row.is-done { border-left-color: #be185d; }
.receipt-text { margin: 4px 0 6px; color: var(--im-text, #303133); }
/* F357 电量 */
.battery-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid var(--im-border, #ebeef5); font-size: 13px; }
.battery-row.is-low { border-left-color: #be185d; background: rgba(190, 24, 93, 0.06); }
.battery-cells { font-size: 13px; color: #be185d; letter-spacing: 2px; }
.battery-want { margin: 4px 0 0; color: var(--im-text, #303133); }
.battery-hint { margin: 6px 0 0; padding: 6px 10px; border-radius: 8px; font-size: 13px; color: #b8860b; background: rgba(184, 134, 11, 0.12); }
/* F358 给自己的信 */
.self-sealed { padding: 9px 11px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid #be185d; font-size: 13px; }
.self-read { margin: 8px 0 0; padding: 8px 10px; border-radius: 8px; font-size: 13px; color: #be185d; background: rgba(190, 24, 93, 0.08); }
/* F353 日历 */
.cal-count { margin: 8px 0 0; font-size: 13px; color: #be185d; }
.cal-month { margin-top: 4px; }
.cal-grid { display: flex; flex-wrap: wrap; gap: 6px; }
.cal-cell { display: flex; flex-direction: column; gap: 2px; padding: 6px 8px; border-radius: 8px; background: rgba(190, 24, 93, 0.06); font-size: 12px; }
.cal-day { font-weight: bold; color: #be185d; }
/* F359 年报 */
.year-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 6px; margin-top: 8px; }
.year-stat { margin: 0; padding: 7px 10px; border-radius: 8px; font-size: 13px; color: #be185d; background: rgba(190, 24, 93, 0.08); }
.year-summary { margin: 8px 0 0; font-size: 13px; color: var(--im-text, #303133); }
</style>

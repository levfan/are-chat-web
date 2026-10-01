<template>
  <div class="couple-listen" data-testid="couple-listen">
    <!-- F260 想被听时段：约一个「只听我说」的 10 分钟 -->
    <CoupleCollapsible testid="couple-ls-slot">
      <template #title>🎧 倾听时段 <span class="sub">不讲道理，只约一双耳朵——被听见这件事，我们排队来</span></template>
      <template v-if="t">
        <p class="day-chip" data-testid="couple-ls-slot-day">今天 {{ t.day }} · 本周从 {{ t.week }} 起</p>

        <!-- 在途时段：状态流 待确认 → TA 确认开麦 → 聊完 → 1-5 分双评 -->
        <div v-if="inTransit.length" class="slot-list">
          <div v-for="s in inTransit" :key="s.id" class="slot-card" :data-testid="`couple-ls-slot-${s.id}`">
            <p class="slot-head">
              <b class="slot-topic">{{ s.topic }}</b>
              <span class="who-chip">{{ s.mine ? '我说的 🙋' : '💕 TA 说的' }}</span>
              <span class="status-chip" :data-testid="`couple-ls-slot-status-${s.id}`">{{ slotStatusText(s) }}</span>
            </p>
            <p class="slot-line">
              <template v-if="s.status === 'OPEN'">
                <el-button
                  v-if="!s.mine"
                  size="small"
                  type="primary"
                  data-testid="couple-ls-slot-confirm"
                  @click="onConfirmSlot(s)"
                >我确认开麦 🎤</el-button>
                <span v-else class="wait-chip" data-testid="couple-ls-slot-wait">说的人不能自己确认，等 TA 把耳朵递过来 ⏳</span>
              </template>
              <el-button
                v-else-if="s.status === 'CONFIRMED'"
                size="small"
                type="success"
                plain
                data-testid="couple-ls-slot-done"
                @click="onDoneSlot(s)"
              >我们聊完了 ✅</el-button>
              <span v-else class="dim-chip">这一场先收着 🎧</span>
            </p>
          </div>
        </div>

        <!-- 没有在途时段：申请表单（同一时间只许一个在途，后端会挡） -->
        <div v-if="!inTransit.length" class="inline-form">
          <el-input
            v-model="slotTopic"
            maxlength="140"
            placeholder="这次想被听的主题（≤140 字，比如「工作那件憋着的事」）"
            data-testid="couple-ls-slot-topic"
          />
          <el-button size="small" type="primary" data-testid="couple-ls-slot-submit" @click="onRequestSlot">
            约一双耳朵 🎧
          </el-button>
        </div>

        <!-- 互评卡：聊完的时段后端不再下发（在途只含 OPEN/CONFIRMED），故本地留一份用来打 1-5 分 -->
        <div v-if="rateCard" class="rate-card" data-testid="couple-ls-rate-card">
          <p class="section-head">📝 这 10 分钟聊完了，互相打个「被听见分」吧</p>
          <p class="rate-topic">「{{ rateCard.topic }}」<span class="who-chip">{{ rateCard.mine ? '我是说的人 🙋' : '💕 TA 说的，我负责听' }}</span></p>
          <p class="score-row">
            <span class="score-label">{{ rateCard.mine ? '我这段说得怎么样：' : 'TA 有被听见吗：' }}</span>
            <button
              v-for="n in 5"
              :key="n"
              type="button"
              class="score-btn"
              :class="{ 'is-on': myScore === n }"
              :data-testid="`couple-ls-rate-score-${n}`"
              @click="onRateSlot(n)"
            >{{ n }}</button>
          </p>
          <div v-if="rateCard.mine" class="inline-form">
            <el-input v-model="rateNote" maxlength="140" placeholder="补一句：下次我怎么让你更被听见（可不写）" data-testid="couple-ls-rate-note" />
          </div>
          <p class="score-row">
            <span class="mine-chip" data-testid="couple-ls-rate-mine">{{ myScore ? `我已评 ${myScore} 分 ✅` : '我还没打分 ⏳' }}</span>
            <span class="partner-chip" data-testid="couple-ls-rate-partner">{{ otherScore ? `TA 已评 ${otherScore} 分 💕` : '等 TA 打分 ⏳' }}</span>
            <span v-if="myScore && otherScore" class="both-badge" data-testid="couple-ls-rate-both">双评齐了：{{ rateNoteLine }}</span>
          </p>
          <el-button size="small" text type="primary" data-testid="couple-ls-rate-close" @click="rateCard = null">
            这张卡收好 🍃
          </el-button>
        </div>

        <p v-if="!inTransit.length && !rateCard" class="hint-line">约一个 10 分钟：一个人说，一个人只点头不接招，说完再换人 🎧</p>
      </template>
      <p v-else class="empty-line">倾听台还在擦话筒…</p>
    </CoupleCollapsible>

    <!-- F261 替我说 + F267 语气翻译官 -->
    <CoupleCollapsible testid="couple-ls-voice">
      <template #title>💌 发声与语气 <span class="sub">不好意思开口的话，先用我的嘴说一遍；今天什么语气，先给 TA 翻译好</span></template>
      <template v-if="t">
        <div class="block">
          <p class="section-head">🎭 替我说（我写的草稿随时可覆盖，TA 那边出现「照念 / 改写定稿」）</p>
          <el-input
            v-model="proxyText"
            type="textarea"
            :rows="2"
            maxlength="200"
            show-word-limit
            placeholder="用 TA 的口吻，替 TA 写一句你不好意思直接问的话（≤200 字）"
            data-testid="couple-ls-proxy-input"
          />
          <div class="inline-form">
            <el-button size="small" type="primary" data-testid="couple-ls-proxy-submit" @click="onProxy">
              {{ t.proxyDraft ? '覆盖我这版草稿 ✍️' : '写进 TA 的台词本 ✍️' }}
            </el-button>
            <span v-if="t.proxyDraft" class="draft-line" data-testid="couple-ls-proxy-mine">我的在途草稿：「{{ t.proxyDraft.content }}」</span>
            <span v-else class="dim-chip">我这会没有在手草稿</span>
          </div>

          <p v-if="!proxyAdoptable.length && !adoptedList.length" class="empty-line">还没有定稿过台词，先替 TA 写一句试试 🎭</p>
          <!-- TA 用我的口吻写的在途稿：出现「照念 / 改写定稿」（后端总览目前只下发我的草稿与已定稿项，对方在途稿到达时这里自动出按钮） -->
          <div v-for="p in proxyAdoptable" :key="p.id" class="proxy-row" :data-testid="`couple-ls-proxy-item-${p.id}`">
            <span class="who-chip">💕 {{ p.fromUser }} 替我写的</span>
            <b class="proxy-text">「{{ p.content }}」</b>
            <el-button size="small" type="primary" :data-testid="`couple-ls-proxy-adopt-read-${p.id}`" @click="onAdopt(p, false)">照念 ✅</el-button>
            <el-button size="small" plain :data-testid="`couple-ls-proxy-adopt-edit-${p.id}`" @click="pickAdopt(p)">改写定稿 ✍️</el-button>
          </div>
          <div v-if="adoptId" class="inline-form">
            <el-input v-model="adoptText" maxlength="200" placeholder="把这句改成你会说出口的样子（≤200 字）" data-testid="couple-ls-proxy-adopt-input" />
            <el-button size="small" type="primary" data-testid="couple-ls-proxy-adopt-submit" @click="onAdoptConfirm">就这样定稿 📌</el-button>
            <el-button size="small" text @click="adoptId = ''">先不定 🍃</el-button>
          </div>
          <div v-for="p in adoptedList" :key="p.id" class="proxy-row is-final" :data-testid="`couple-ls-proxy-adopted-${p.id}`">
            <span class="final-chip">已定稿 📌</span>
            <b class="proxy-text">「{{ p.finalText || p.content }}」</b>
            <span class="who-chip">{{ p.mine ? '我写的，TA 定稿 💕' : 'TA 写的，我定稿 🙋' }}</span>
          </div>
        </div>

        <div class="block">
          <p class="section-head">🈯 语气翻译官（自报今日状态，TA 那边出翻译条：短句不是冷，是没电）</p>
          <div class="tone-row" data-testid="couple-ls-tone-row">
            <button
              v-for="tone in TONES"
              :key="tone.key"
              type="button"
              class="tone-capsule"
              :class="[`tone-${tone.key.toLowerCase()}`, { 'is-on': tonePick === tone.key }]"
              :data-testid="`couple-ls-tone-${tone.key}`"
              @click="tonePick = tone.key"
            >
              {{ tone.emoji }} {{ tone.label }}
            </button>
          </div>
          <div class="inline-form">
            <el-input v-model="toneNote" maxlength="60" placeholder="补一句（≤60 字，如「下午有个大交付」）" data-testid="couple-ls-tone-note" />
            <el-button size="small" type="primary" data-testid="couple-ls-tone-submit" @click="onTone">
              {{ myTone ? '改一下今天的语气 🔁' : '报给 TA 🈯' }}
            </el-button>
          </div>
          <p class="tone-status" data-testid="couple-ls-tone-mine">
            <span v-if="myTone" class="lit-chip">我今天报了：{{ myTone.emoji }} {{ myTone.label }}</span>
            <span v-else class="dim-chip">我还没报今天的语气</span>
          </p>
          <div v-for="x in partnerTones" :key="x.fromUser" class="tone-line" :data-testid="`couple-ls-tone-line-${x.fromUser}`">
            <span class="who-chip">💕 TA 报了「{{ x.label }}」</span>
            <span class="translate-text">{{ x.line }}</span>
          </div>
          <p v-if="!partnerTones.length" class="empty-line">TA 还没报语气，翻译条空着——问一句今天怎么样 🈯</p>
        </div>
      </template>
      <p v-else class="empty-line">话筒还没通电…</p>
    </CoupleCollapsible>

    <!-- F262 误会倒带 + F263 本周卡壳一问 -->
    <CoupleCollapsible testid="couple-ls-misrewind" :empty="!!t && !t.misrewinds.length && !t.stuck.length">
      <template #title>📼 误会倒带 <span class="sub">同一场争执各写一版画面，并放一次就看懂了</span></template>
      <template v-if="t">
        <div class="inline-form">
          <el-input v-model="misTopic" maxlength="60" placeholder="争执主题（≤60 字，如「昨晚那句『随便你』」）" data-testid="couple-ls-mis-topic" />
        </div>
        <div class="mis-form">
          <el-input
            v-model="misMine"
            type="textarea"
            :rows="2"
            maxlength="200"
            show-word-limit
            placeholder="我当时以为……（≤200 字）"
            data-testid="couple-ls-mis-mine"
          />
          <el-input
            v-model="misGuess"
            type="textarea"
            :rows="2"
            maxlength="200"
            show-word-limit
            placeholder="我猜你其实想……（≤200 字）"
            data-testid="couple-ls-mis-guess"
          />
          <el-button size="small" type="primary" data-testid="couple-ls-mis-submit" @click="onMisrewind">倒带这一场 📼</el-button>
        </div>

        <p class="section-head">🔁 近 30 天的倒带（双栏并排，两份齐了才算对上画面）</p>
        <p v-if="!t.misrewinds.length" class="empty-line">这一个月没有要倒带的误会，那就先记着这份顺利 📼</p>
        <div v-for="(m, i) in t.misrewinds" :key="`${m.day}-${m.topic}`" class="mis-item" :data-testid="`couple-ls-mis-${i}`">
          <p class="mis-head">
            <b class="mis-topic">{{ m.topic }}</b>
            <span class="day-chip">{{ m.day }}</span>
            <span v-if="m.both" class="both-badge" :data-testid="`couple-ls-mis-both-${i}`">两份齐了，画面接上了 📼</span>
            <span v-else class="wait-chip" :data-testid="`couple-ls-mis-wait-${i}`">还差 TA 那一份 ⏳</span>
          </p>
          <div class="mis-cols">
            <div class="mis-col" :data-testid="`couple-ls-mis-mine-${i}`">
              <p class="col-head">🙋 我当时以为</p>
              <p class="col-text">{{ m.mineThought || '这一栏还空着' }}</p>
              <p class="col-head">🙋 我猜你其实想</p>
              <p class="col-text">{{ m.mineGuess || '这一栏还空着' }}</p>
            </div>
            <div class="mis-col is-partner" :data-testid="`couple-ls-mis-partner-${i}`">
              <p class="col-head">💕 TA 当时以为</p>
              <p class="col-text">{{ m.partnerThought || '这一栏还空着' }}</p>
              <p class="col-head">💕 TA 猜我其实想</p>
              <p class="col-text">{{ m.partnerGuess || '这一栏还空着' }}</p>
            </div>
          </div>
        </div>

        <div class="block">
          <p class="section-head">🤔 本周卡壳一问（一周一题：我出的题与 TA 的题各一张，谁也不能答自己的）</p>
          <div class="inline-form">
            <el-input v-model="stuckQuestion" maxlength="140" placeholder="这周把我难住的问题（≤140 字）" data-testid="couple-ls-stuck-question" />
            <el-button size="small" type="primary" data-testid="couple-ls-stuck-submit" @click="onStuck">抛给 TA 🤔</el-button>
          </div>
          <p v-if="!t.stuck.length" class="empty-line">本周还没人被问题难住，谁来第一个 🤔</p>
          <div v-for="q in t.stuck" :key="q.id" class="stuck-card" :data-testid="q.mine ? `couple-ls-stuck-mine-${q.id}` : `couple-ls-stuck-partner-${q.id}`">
            <p class="stuck-head">
              <span class="who-chip">{{ q.mine ? '我出的题 🙋' : '💕 TA 出的题' }}</span>
              <b class="stuck-question">{{ q.question }}</b>
            </p>
            <p v-if="q.answered" class="answer-line" :data-testid="`couple-ls-stuck-answered-${q.id}`">
              答案：{{ q.answer }}
            </p>
            <template v-else-if="!q.mine">
              <div class="inline-form">
                <el-input v-model="stuckAnswers[q.id]" maxlength="200" placeholder="试试答 TA 这题（≤200 字，答不上来就写「我答不上来」）" :data-testid="`couple-ls-stuck-answer-${q.id}`" />
                <el-button size="small" type="primary" :data-testid="`couple-ls-stuck-answer-btn-${q.id}`" @click="onStuckAnswer(q)">交卷 📮</el-button>
              </div>
            </template>
            <p v-else class="wait-chip" :data-testid="`couple-ls-stuck-wait-${q.id}`">等 TA 作答，不许自己交 🙋</p>
          </div>
        </div>
      </template>
      <p v-else class="empty-line">倒带机还在缠带子…</p>
    </CoupleCollapsible>

    <!-- F264 换位信 + F265 早想说队列 -->
    <CoupleCollapsible testid="couple-ls-letter" :empty="!!t && !t.letters.length && !t.holds.length">
      <template #title>📮 换位信与早想说 <span class="sub">用对方的口吻写一封信封存到开放日；早就想说的那句，排队慢慢放</span></template>
      <template v-if="t">
        <div class="block">
          <p class="section-head">🔁 换位信（写成「我就是 TA」的样子，≤500 字，到开放日互相拆）</p>
          <el-input
            v-model="letterContent"
            type="textarea"
            :rows="3"
            maxlength="500"
            show-word-limit
            placeholder="以 TA 的口吻写：我最近其实……（≤500 字）"
            data-testid="couple-ls-letter-content"
          />
          <div class="inline-form">
            <el-date-picker
              v-model="letterOpenDay"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="开放日（空=7 天后）"
              style="width: 160px"
              data-testid="couple-ls-letter-open-day"
            />
            <el-button size="small" type="primary" data-testid="couple-ls-letter-submit" @click="onLetter">封存这封信 📮</el-button>
          </div>

          <p class="sub-head">✍️ 我写的（封存中，底稿我自己能看）</p>
          <p v-if="!myLetters.length" class="empty-line">我还没写过换位信，先站到 TA 的位置上试试 🔁</p>
          <div v-for="l in myLetters" :key="l.id" class="letter-row" :data-testid="`couple-ls-letter-mine-${l.id}`">
            <p class="letter-head">
              <b class="letter-day">{{ l.day }} 写</b>
              <span class="count-chip">{{ l.openDay }} 开放</span>
              <span v-if="l.status === 'OPENED'" class="both-badge" :data-testid="`couple-ls-letter-mine-opened-${l.id}`">TA 已拆 📬</span>
              <span v-else class="wait-chip">还封着 🔒</span>
            </p>
            <p class="letter-text">{{ l.content }}</p>
          </div>

          <p class="sub-head">💕 TA 写给我的（到开放日才许拆）</p>
          <p v-if="!partnerLetters.length" class="empty-line">TA 那边还没有给你的信，等一等或者先催一句 📮</p>
          <div v-for="l in partnerLetters" :key="l.id" class="letter-row is-partner" :data-testid="`couple-ls-letter-partner-${l.id}`">
            <p class="letter-head">
              <b class="letter-day">{{ l.day }} 写</b>
              <span class="count-chip">{{ l.openDay }} 开放</span>
              <el-button
                v-if="l.status === 'SEALED' && l.due"
                size="small"
                type="primary"
                :data-testid="`couple-ls-letter-open-btn-${l.id}`"
                @click="onOpenLetter(l)"
              >今天到日，拆信 ✂️</el-button>
              <span v-else-if="l.status === 'SEALED'" class="wait-chip" :data-testid="`couple-ls-letter-wait-${l.id}`">封存中，{{ l.openDay }} 才可见 🔒</span>
            </p>
            <p v-if="l.status === 'OPENED'" class="letter-text" :data-testid="`couple-ls-letter-read-${l.id}`">{{ l.content }}</p>
            <p v-else class="dim-chip">还没拆，字先替 TA 收着 🎁</p>
          </div>
        </div>

        <div class="block">
          <p class="section-head">🫙 早想说队列（封一句，每 7 天自动放行一句，憋着的话有人替我记着）</p>
          <div class="inline-form">
            <el-input v-model="holdText" maxlength="200" placeholder="那句早就想说的话（≤200 字）" data-testid="couple-ls-hold-input" />
            <el-button size="small" type="primary" data-testid="couple-ls-hold-submit" @click="onHold">封进罐子 🫙</el-button>
          </div>
          <p class="hold-next" data-testid="couple-ls-hold-next">
            {{ t.nextHoldDay ? `下一句放行：${t.nextHoldDay}（还有 ${holdDaysLeft} 天）🫙` : '队列空着，封一句进来吧 🫙' }}
          </p>
          <div v-for="h in heldHolds" :key="h.id" class="hold-row" :data-testid="`couple-ls-hold-${h.id}`">
            <span class="who-chip">{{ h.mine ? '我封的 🙋' : '💕 TA 封的' }}</span>
            <span class="hold-text">{{ h.content }}</span>
            <span class="count-chip">{{ h.openDay }} 可见 🔒</span>
          </div>
          <div v-for="h in sentHolds" :key="h.id" class="hold-row is-sent" :data-testid="`couple-ls-hold-sent-${h.id}`">
            <span class="sent-chip">已放行 🕊️</span>
            <span class="who-chip">{{ h.mine ? '我说出口的 🙋' : '💕 TA 说出口的' }}</span>
            <span class="hold-text">{{ h.content }}</span>
            <span class="dim-chip">{{ tsToDate(h.sentAt) }}</span>
          </div>
          <p v-if="!t.holds.length" class="empty-line">罐子还是空的，把那句「早想说了」先放进来 🫙</p>
        </div>
      </template>
      <p v-else class="empty-line">信纸还在裁…</p>
    </CoupleCollapsible>

    <!-- F266 三行打卡 + F268 休战旗 + F269 称呼日 -->
    <CoupleCollapsible testid="couple-ls-care">
      <template #title>🫧 呵护台 <span class="sub">每天三行、举一次旗、喊一个新称呼，把柔软的力气存起来</span></template>
      <template v-if="t">
        <div class="block">
          <p class="section-head">🧷 今日三行打卡（印象 / 谢 / 夸，连续 {{ t.three.badgeDays ?? 21 }} 天有纪念）</p>
          <div class="three-form">
            <el-input v-model="threeMorning" maxlength="80" placeholder="今天我注意到你……（≤80 字）" data-testid="couple-ls-three-morning" />
            <el-input v-model="threeThanks" maxlength="80" placeholder="想谢你……（≤80 字）" data-testid="couple-ls-three-thanks" />
            <el-input v-model="threePraise" maxlength="80" placeholder="要夸你……（≤80 字）" data-testid="couple-ls-three-praise" />
            <el-button size="small" type="primary" data-testid="couple-ls-three-submit" @click="onThree">今天打卡 🧷</el-button>
          </div>
          <div class="streak-row">
            <p class="streak-line">
              <span class="streak-who">🙋 我连着</span>
              <span class="streak-num" data-testid="couple-ls-three-streak-mine">{{ streakMine }} 天</span>
              <span class="bar"><span class="bar-in bar-mine" data-testid="couple-ls-three-bar-mine" :style="{ width: `${barMine}%` }" /></span>
              <span v-if="streakMine >= badgeDays" class="badge-chip" data-testid="couple-ls-three-badge-mine">21 天达成 🎏</span>
            </p>
            <p class="streak-line">
              <span class="streak-who">💕 TA 连着</span>
              <span class="streak-num" data-testid="couple-ls-three-streak-partner">{{ streakPartner }} 天</span>
              <span class="bar"><span class="bar-in bar-partner" data-testid="couple-ls-three-bar-partner" :style="{ width: `${barPartner}%` }" /></span>
              <span v-if="streakPartner >= badgeDays" class="badge-chip" data-testid="couple-ls-three-badge-partner">21 天达成 🎏</span>
            </p>
          </div>
        </div>

        <div class="block">
          <p class="section-head">🏳️ 休战旗（先冻结几分钟，谁也不许在气头上讲道理）</p>
          <template v-if="!t.truce">
            <div class="inline-form">
              <el-input v-model="truceMinutes" maxlength="3" placeholder="冻结分钟（10-120，空=30）" style="max-width: 180px" data-testid="couple-ls-truce-minutes" />
              <el-button size="small" type="warning" data-testid="couple-ls-truce-raise" @click="onTruce">我举旗 🏳️</el-button>
            </div>
            <p class="hint-line">现在没有在途的旗，吵到一半也可以先举一面 🏳️</p>
          </template>
          <div v-else class="truce-card" data-testid="couple-ls-truce-card">
            <p class="truce-head">
              <span class="who-chip" data-testid="couple-ls-truce-raiser">{{ t.truce.mine ? '我举的旗 🙋' : `💕 ${t.truce.raiser} 举的旗` }}</span>
              <span v-if="!truceExpired" class="count-chip" data-testid="couple-ls-truce-countdown">解冻倒计时 {{ truceLeft }}</span>
              <span v-else class="expired-chip" data-testid="couple-ls-truce-expired">时间到，冷静期结束 ⏰</span>
            </p>
            <p class="truce-decided" data-testid="couple-ls-truce-decided">
              表态进度 {{ decidedCount }}/2 ·
              <span data-testid="couple-ls-truce-decision-a">第一份：{{ decisionText(t.truce.decideA) }}</span>
              <span data-testid="couple-ls-truce-decision-b">第二份：{{ decisionText(t.truce.decideB) }}</span>
              <span v-if="myDecided" class="lit-chip">我表过态了 ✅</span>
            </p>
            <p v-if="truceExpired && !myDecided" class="inline-form">
              <el-button size="small" type="primary" data-testid="couple-ls-truce-goon" @click="onTruceDecide(true)">继续，各退一步 ▶</el-button>
              <el-button size="small" plain data-testid="couple-ls-truce-forget" @click="onTruceDecide(false)">算了，这页翻篇 🍃</el-button>
            </p>
            <p v-else-if="!truceExpired" class="wait-chip">旗还举着，先到点再说 🏳️</p>
          </div>
        </div>

        <div class="block">
          <p class="section-head">🏷️ 称呼日（今日限定称呼，两个人各喊一次才算过）</p>
          <template v-if="t.nameDay">
            <p class="name-big" data-testid="couple-ls-name-text">{{ t.nameDay.name }}</p>
            <p class="name-status">
              <span class="lit-chip" data-testid="couple-ls-name-mine">{{ t.nameDay.usedMine ? '我喊过了 ✅' : '我还没喊' }}</span>
              <span class="partner-chip" data-testid="couple-ls-name-partner">{{ t.nameDay.usedPartner ? 'TA 喊过了 💕' : '等 TA 喊 ⏳' }}</span>
              <span v-if="t.nameDay.done" class="both-badge" data-testid="couple-ls-name-done">今日称呼达成，仪式完成 🏷️</span>
            </p>
            <el-button
              v-if="!t.nameDay.usedMine"
              size="small"
              type="primary"
              data-testid="couple-ls-name-use"
              @click="onNameUse"
            >我今天用过了 ✅</el-button>
            <span v-else class="dim-chip" data-testid="couple-ls-name-used-ok">今天这一声已经喊出去啦 🏷️</span>
          </template>
          <template v-else>
            <p class="empty-line">今天还没给称呼开张，点一下领一个 🏷️</p>
            <el-button size="small" type="primary" data-testid="couple-ls-name-use" @click="onNameUse">喊一声，今日称呼亮相 🏷️</el-button>
          </template>
        </div>
      </template>
      <p v-else class="empty-line">呵护台还在烧水…</p>
    </CoupleCollapsible>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { listenApi } from '@/api/couple'
import type { CoupleLsLetterVO, CoupleLsProxyVO, CoupleLsSlotVO, CoupleLsTodayVO, CoupleLsToneKey } from '@/types'
import CoupleCollapsible from './CoupleCollapsible.vue'

/** 整份今日倾听台（除 today 外全部写接口返回整份，整体替换即五卡刷新） */
const t = ref<CoupleLsTodayVO | null>(null)

/**
 * 互评卡本地留存：后端 slot/recentSlots 只下发在途（OPEN/CONFIRMED），
 * 一旦点「聊完」该时段就离开总览，故本地留一份 1-5 分双评的画布。
 */
const rateCard = ref<CoupleLsSlotVO | null>(null)

// ---- 草稿 ----
const slotTopic = ref('')
const rateNote = ref('')
const proxyText = ref('')
const adoptId = ref('')
const adoptText = ref('')
const tonePick = ref<CoupleLsToneKey | ''>('')
const toneNote = ref('')
const misTopic = ref('')
const misMine = ref('')
const misGuess = ref('')
const stuckQuestion = ref('')
const stuckAnswers = reactive<Record<string, string>>({})
const letterContent = ref('')
const letterOpenDay = ref('')
const holdText = ref('')
const threeMorning = ref('')
const threeThanks = ref('')
const threePraise = ref('')
const truceMinutes = ref('')
const myDecided = ref(false)

/** 休战旗倒计时用的当前时刻（每秒推进，卸载清定时器） */
const nowTs = ref(Date.now())
let timer: ReturnType<typeof setInterval> | null = null

/** F267 四种语气胶囊（key 与后端 CoupleListenBank.TONE_LABEL 一致，其它值后端 400） */
const TONES: { key: CoupleLsToneKey; label: string; emoji: string }[] = [
  { key: 'TIRED', label: '电量红了', emoji: '🔋' },
  { key: 'BUSY', label: '脚不沾地', emoji: '🏃' },
  { key: 'SAD', label: '心里在下雨', emoji: '🌧️' },
  { key: 'OKAY', label: '其实没事', emoji: '🙂' },
]

const inTransit = computed<CoupleLsSlotVO[]>(() => t.value?.recentSlots ?? [])
/** TA 用我的口吻写的在途稿（可照念/改写定稿；后端总览的 adopted 只下发已定稿项，对方在途稿到达时这里出按钮） */
const proxyAdoptable = computed<CoupleLsProxyVO[]>(() =>
  (t.value?.adopted ?? []).filter((p) => !p.mine && p.status !== 'ADOPTED'),
)
const adoptedList = computed<CoupleLsProxyVO[]>(() =>
  (t.value?.adopted ?? []).filter((p) => p.status === 'ADOPTED'),
)
const myTone = computed(() => {
  const x = (t.value?.tones ?? []).find((v) => v.mine)
  if (!x) return null
  const meta = TONES.find((v) => v.key === x.tone)
  return { ...x, emoji: meta?.emoji ?? '🈯' }
})
const partnerTones = computed(() => (t.value?.tones ?? []).filter((x) => !x.mine))
const myLetters = computed(() => (t.value?.letters ?? []).filter((l) => l.mine))
const partnerLetters = computed(() => (t.value?.letters ?? []).filter((l) => !l.mine))
const heldHolds = computed(() => (t.value?.holds ?? []).filter((h) => h.status === 'HELD'))
const sentHolds = computed(() => (t.value?.holds ?? []).filter((h) => h.status === 'SENT'))

const streakMine = computed(() => t.value?.three.streakMine ?? 0)
const streakPartner = computed(() => t.value?.three.streakPartner ?? 0)
const badgeDays = computed(() => t.value?.three.badgeDays ?? 21)
const barMine = computed(() => Math.min(100, Math.round((streakMine.value / badgeDays.value) * 100)))
const barPartner = computed(() => Math.min(100, Math.round((streakPartner.value / badgeDays.value) * 100)))

/** 我在互评里的那一分：说的人填 rateMine，听的人填 ratePartner */
const myScore = computed(() => {
  const s = rateCard.value
  if (!s) return null
  return s.mine ? s.rateMine : s.ratePartner
})
const otherScore = computed(() => {
  const s = rateCard.value
  if (!s) return null
  return s.mine ? s.ratePartner : s.rateMine
})
const rateNoteLine = computed(() => rateCard.value?.note || '这一场我们都被听见了 🎧')

const truceExpired = computed(() => {
  const tr = t.value?.truce
  if (!tr) return false
  return !!tr.expired || (!!tr.untilAt && nowTs.value >= tr.untilAt)
})
const truceLeft = computed(() => {
  const until = t.value?.truce?.untilAt
  if (!until) return '00:00'
  const ms = until - nowTs.value
  if (ms <= 0) return '00:00'
  const min = Math.floor(ms / 60_000)
  const sec = Math.floor((ms % 60_000) / 1000)
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
})
const decidedCount = computed(() => {
  const tr = t.value?.truce
  if (!tr) return 0
  return (tr.decideA !== null ? 1 : 0) + (tr.decideB !== null ? 1 : 0)
})

/** 下一句早想说的倒数天数 */
const holdDaysLeft = computed(() => {
  const data = t.value
  if (!data?.nextHoldDay) return 0
  return dayDiff(data.day, data.nextHoldDay)
})

function dayDiff(from: string, to: string): number {
  const a = new Date(`${from}T00:00:00`).getTime()
  const b = new Date(`${to}T00:00:00`).getTime()
  if (Number.isNaN(a) || Number.isNaN(b)) return 0
  return Math.max(0, Math.round((b - a) / 86_400_000))
}

function tsToDate(ms: number | null): string {
  if (!ms) return '今天'
  const d = new Date(ms)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd} 说出口`
}

function slotStatusText(s: CoupleLsSlotVO): string {
  if (s.status === 'OPEN') return s.mine ? '等 TA 确认开麦 ⏳' : 'TA 想被听，等你确认 🎧'
  if (s.status === 'CONFIRMED') return '已开麦，专心听 🎤'
  return '这一场聊完了 ✅'
}

/** 后端 decideA/decideB 按空间两位成员的位置下发，前端无从判断哪一格是自己，故按「第一份/第二份」中性展示 */
function decisionText(v: number | null): string {
  if (v === 1) return '继续 ▶'
  if (v === 0) return '算了 🍃'
  return '还没说 ⏳'
}

function onError(e: unknown, fallback: string) {
  // 后端 400 的中文 message 直接透传（例如「已有一个时段在途，先聊完这一个」）
  ElMessage.error(e instanceof Error ? e.message : fallback)
}

/** 写接口统一返回整份 TodayVO：整体替换即全卡刷新 */
function refresh(data: CoupleLsTodayVO | undefined | null) {
  if (data) {
    t.value = data
    if (data.truce && data.truce.expired === false) myDecided.value = false
  }
}

// ---- F260 想被听时段 ----
async function onRequestSlot() {
  if (!slotTopic.value.trim()) {
    ElMessage.warning('先写下这次想被听的主题 🎧')
    return
  }
  try {
    refresh(await listenApi.lsRequestSlot(slotTopic.value.trim()))
    slotTopic.value = ''
    ElMessage.success('时段已申请，等 TA 把耳朵递过来 🎧')
  } catch (e) {
    onError(e, '申请时段失败')
  }
}

async function onConfirmSlot(s: CoupleLsSlotVO) {
  try {
    refresh(await listenApi.lsConfirmSlot(s.id))
    ElMessage.success('麦已交给 TA，说吧，我只听 🎤')
  } catch (e) {
    onError(e, '确认失败')
  }
}

async function onDoneSlot(s: CoupleLsSlotVO) {
  try {
    // 聊完该时段就离开在途列表，先本地留一份用于互评
    const snapshot: CoupleLsSlotVO = { ...s, status: 'DONE', confirmed: true }
    refresh(await listenApi.lsDoneSlot(s.id))
    rateCard.value = snapshot
    rateNote.value = ''
    ElMessage.success('这 10 分钟聊完了，互相打个「被听见分」吧 📝')
  } catch (e) {
    onError(e, '收场失败')
  }
}

async function onRateSlot(score: number) {
  const s = rateCard.value
  if (!s) return
  try {
    await listenApi.lsRateSlot(s.id, score, rateNote.value.trim())
    const next: CoupleLsSlotVO = { ...s }
    if (s.mine) {
      next.rateMine = score
      if (rateNote.value.trim()) next.note = rateNote.value.trim()
    } else {
      next.ratePartner = score
    }
    rateCard.value = next
    ElMessage.success(`打好了 ${score} 分 🎧 TA 那一份也在路上`)
  } catch (e) {
    onError(e, '打分失败')
  }
}

// ---- F261 替我说 ----
async function onProxy() {
  if (!proxyText.value.trim()) {
    ElMessage.warning('替 TA 说的话要写出来 🎭')
    return
  }
  try {
    const data = await listenApi.lsProxy(proxyText.value.trim())
    refresh(data)
    proxyText.value = data?.proxyDraft?.content ?? proxyText.value.trim()
    ElMessage.success('已写进 TA 的台词本，等 TA 决定照不照念 💌')
  } catch (e) {
    onError(e, '写台词失败')
  }
}

function pickAdopt(p: CoupleLsProxyVO) {
  adoptId.value = p.id
  adoptText.value = p.content
}

async function onAdopt(p: CoupleLsProxyVO, edit: boolean) {
  if (edit) {
    pickAdopt(p)
    return
  }
  try {
    refresh(await listenApi.lsProxyAdopt(p.id, p.content))
    adoptId.value = ''
    ElMessage.success('这句话被定稿了，念出口吧 📌')
  } catch (e) {
    onError(e, '定稿失败')
  }
}

async function onAdoptConfirm() {
  if (!adoptId.value) {
    ElMessage.warning('先从 TA 的稿子里点「改写定稿」✍️')
    return
  }
  try {
    refresh(await listenApi.lsProxyAdopt(adoptId.value, adoptText.value.trim()))
    adoptId.value = ''
    adoptText.value = ''
    ElMessage.success('改成你的说法定稿了 📌')
  } catch (e) {
    onError(e, '定稿失败')
  }
}

// ---- F267 语气翻译官 ----
async function onTone() {
  if (!tonePick.value) {
    ElMessage.warning('先从四色胶囊里选一个今天的语气 🈯')
    return
  }
  try {
    refresh(await listenApi.lsTone(tonePick.value, toneNote.value.trim()))
    ElMessage.success('语气已上报，TA 那边有翻译条 🈯')
  } catch (e) {
    onError(e, '报语气失败')
  }
}

// ---- F262 误会倒带 ----
async function onMisrewind() {
  if (!misTopic.value.trim()) {
    ElMessage.warning('先写下这场争执的主题 📼')
    return
  }
  if (!misMine.value.trim() && !misGuess.value.trim()) {
    ElMessage.warning('两边至少写一边，倒带才有画面对 📼')
    return
  }
  try {
    refresh(await listenApi.lsMisrewind(misTopic.value.trim(), misMine.value.trim(), misGuess.value.trim()))
    misMine.value = ''
    misGuess.value = ''
    ElMessage.success('倒带好了，等 TA 那一份并排放 📼')
  } catch (e) {
    onError(e, '倒带失败')
  }
}

// ---- F263 本周卡壳一问 ----
async function onStuck() {
  if (!stuckQuestion.value.trim()) {
    ElMessage.warning('这周难住你的问题要写出来 🤔')
    return
  }
  try {
    refresh(await listenApi.lsStuck(stuckQuestion.value.trim()))
    stuckQuestion.value = ''
    ElMessage.success('题已抛出，等 TA 作答 🤔')
  } catch (e) {
    onError(e, '抛题失败')
  }
}

async function onStuckAnswer(q: { id: string; question: string }) {
  const answer = (stuckAnswers[q.id] ?? '').trim()
  if (!answer) {
    ElMessage.warning('答案总要写一点，写「我答不上来」也算 📮')
    return
  }
  try {
    refresh(await listenApi.lsStuckAnswer(q.id, answer))
    stuckAnswers[q.id] = ''
    ElMessage.success(`答完这道题了：「${q.question.slice(0, 12)}…」📮`)
  } catch (e) {
    onError(e, '作答失败')
  }
}

// ---- F264 换位信 ----
async function onLetter() {
  if (!letterContent.value.trim()) {
    ElMessage.warning('信总要写几句，哪怕三行 📮')
    return
  }
  try {
    refresh(await listenApi.lsLetter(letterContent.value.trim(), letterOpenDay.value))
    letterContent.value = ''
    letterOpenDay.value = ''
    ElMessage.success('换位信已封存，到开放日互相拆 📮')
  } catch (e) {
    onError(e, '封存失败')
  }
}

async function onOpenLetter(l: CoupleLsLetterVO) {
  try {
    refresh(await listenApi.lsLetterOpen(l.id))
    ElMessage.success('拆开了——看看 TA 眼里的自己 📬')
  } catch (e) {
    onError(e, '拆信失败')
  }
}

// ---- F265 早想说队列 ----
async function onHold() {
  if (!holdText.value.trim()) {
    ElMessage.warning('把那句早想说的话写出来 🫙')
    return
  }
  try {
    refresh(await listenApi.lsHold(holdText.value.trim()))
    holdText.value = ''
    ElMessage.success('封进罐子了，排到哪天会自动放行 🫙')
  } catch (e) {
    onError(e, '封存失败')
  }
}

// ---- F266 三行打卡 ----
async function onThree() {
  if (!threeMorning.value.trim() && !threeThanks.value.trim() && !threePraise.value.trim()) {
    ElMessage.warning('三行里至少写一行，空白不算打卡 🧷')
    return
  }
  try {
    refresh(await listenApi.lsThree(threeMorning.value.trim(), threeThanks.value.trim(), threePraise.value.trim()))
    ElMessage.success(`三行打卡成功，连着 ${t.value?.three.streakMine ?? 0} 天了 🧷`)
  } catch (e) {
    onError(e, '打卡失败')
  }
}

// ---- F268 休战旗 ----
async function onTruce() {
  const min = Number(truceMinutes.value.trim())
  const minutes = Number.isFinite(min) && min > 0 ? min : undefined
  try {
    refresh(await listenApi.lsTruce(minutes))
    myDecided.value = false
    truceMinutes.value = ''
    ElMessage.success('旗举起来了，这段时间谁都不许讲道理 🏳️')
  } catch (e) {
    onError(e, '举旗失败')
  }
}

async function onTruceDecide(goOn: boolean) {
  try {
    refresh(await listenApi.lsTruceDecide(goOn))
    myDecided.value = true
    ElMessage.success(goOn ? '各退一步，这页我们聊完 ▶' : '这页翻篇了，先抱一下 🍃')
  } catch (e) {
    onError(e, '表态失败')
  }
}

// ---- F269 称呼日 ----
async function onNameUse() {
  try {
    refresh(await listenApi.lsNameUse())
    ElMessage.success('这一声喊出去了 🏷️')
  } catch (e) {
    onError(e, '记录失败')
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
  timer = setInterval(() => {
    nowTs.value = Date.now()
  }, 1000)
  const today = await safeLoad(listenApi.lsToday, null)
  t.value = today
  if (today) {
    proxyText.value = today.proxyDraft?.content ?? ''
    threeMorning.value = today.three.morning
    threeThanks.value = today.three.thanks
    threePraise.value = today.three.praise
    tonePick.value = today.tones.find((x) => x.mine)?.tone ?? ''
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  timer = null
})
</script>

<style scoped>
/* 主色：紫 #9254de（「被听见」的情绪感），折叠卡标题色经 CSS 变量级联给 CoupleCollapsible */
.couple-listen { display: flex; flex-direction: column; gap: 14px; --collapse-title-color: #9254de; }
.card { background: var(--im-panel-bg, #fff); border-radius: 10px; padding: 14px 16px; border: 1px solid var(--im-border, #ebeef5); }
.sub { font-size: 12px; color: var(--im-muted, #909399); font-weight: normal; margin-left: 6px; }
.section-head { margin: 10px 0 4px; font-size: 13px; font-weight: bold; color: #9254de; }
.sub-head { margin: 8px 0 2px; font-size: 12px; color: #9254de; }
.block { margin-top: 10px; padding-top: 8px; border-top: 1px dashed var(--im-border, #ebeef5); }
.inline-form { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 8px; }
.inline-form .el-input { flex: 1; min-width: 160px; }
.empty-line { margin: 8px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.hint-line { margin: 6px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.who-chip { font-size: 11px; color: var(--im-muted, #909399); }
.day-chip, .count-chip { font-size: 11px; color: #9254de; background: rgba(146, 84, 222, 0.12); padding: 1px 8px; border-radius: 10px; }
.lit-chip { font-size: 12px; color: #67c23a; background: rgba(103, 194, 58, 0.1); padding: 2px 8px; border-radius: 6px; }
.dim-chip { font-size: 12px; color: var(--im-muted, #909399); background: var(--im-bg, #fafafa); padding: 2px 8px; border-radius: 6px; }
.wait-chip { font-size: 12px; color: #e6a23c; }
.partner-chip { font-size: 12px; color: #9254de; background: rgba(146, 84, 222, 0.1); padding: 2px 8px; border-radius: 6px; }
.both-badge { font-size: 12px; color: #9254de; font-weight: bold; }
.status-chip { font-size: 11px; color: #9254de; background: rgba(146, 84, 222, 0.12); padding: 1px 8px; border-radius: 10px; }
/* F260 时段卡 */
.slot-list { margin-top: 4px; }
.slot-card { margin: 6px 0; padding: 8px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid #9254de; }
.slot-head { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; margin: 0; font-size: 13px; color: var(--im-text, #303133); }
.slot-topic { color: #9254de; }
.slot-line { margin: 6px 0 0; font-size: 12px; }
.rate-card { margin-top: 8px; padding: 8px 10px; border-radius: 8px; border: 1px dashed rgba(146, 84, 222, 0.45); }
.rate-topic { margin: 0 0 4px; font-size: 13px; color: var(--im-text, #303133); }
.score-row { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; margin: 6px 0 0; font-size: 12px; color: var(--im-text, #303133); }
.score-label { font-size: 12px; color: var(--im-muted, #909399); }
.score-btn { width: 28px; height: 28px; border-radius: 50%; border: 1px solid rgba(146, 84, 222, 0.35); background: transparent; color: #9254de; font-size: 13px; cursor: pointer; }
.score-btn:hover, .score-btn.is-on { background: #9254de; color: #fff; border-color: #9254de; }
.mine-chip { font-size: 12px; color: #9254de; background: rgba(146, 84, 222, 0.1); padding: 2px 8px; border-radius: 6px; }
/* F261 替我说 */
.draft-line { font-size: 12px; color: #9254de; }
.proxy-row { margin: 5px 0; font-size: 13px; color: var(--im-text, #303133); display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.proxy-row.is-final { border-left: 3px solid #9254de; padding-left: 8px; }
.proxy-text { color: var(--im-text, #303133); }
.final-chip { font-size: 11px; color: #67c23a; }
/* F267 语气胶囊：四色 */
.tone-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 4px; }
.tone-capsule { border: 1px solid var(--im-border, #ebeef5); border-radius: 14px; padding: 3px 10px; font-size: 12px; cursor: pointer; background: var(--im-bg, #fafafa); color: var(--im-text, #303133); }
.tone-tired { border-color: rgba(245, 108, 108, 0.5); color: #f56c6c; }
.tone-busy { border-color: rgba(230, 162, 60, 0.5); color: #e6a23c; }
.tone-sad { border-color: rgba(64, 158, 255, 0.5); color: #409eff; }
.tone-okay { border-color: rgba(103, 194, 58, 0.5); color: #67c23a; }
.tone-capsule.is-on { font-weight: bold; box-shadow: 0 0 0 2px rgba(146, 84, 222, 0.35); }
.tone-status { display: flex; gap: 8px; flex-wrap: wrap; margin: 6px 0 0; }
.tone-line { margin: 4px 0; font-size: 12px; color: var(--im-text, #303133); display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; }
.translate-text { background: rgba(146, 84, 222, 0.08); border-radius: 8px; padding: 3px 10px; color: #9254de; }
/* F262 误会倒带 */
.mis-form { display: flex; gap: 8px; flex-wrap: wrap; align-items: flex-start; margin-top: 8px; }
.mis-form .el-input { flex: 1; min-width: 200px; }
.mis-item { margin: 8px 0; padding: 8px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); }
.mis-head { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; margin: 0; font-size: 13px; }
.mis-topic { color: #9254de; }
.mis-cols { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 6px; }
.mis-col { flex: 1; min-width: 200px; font-size: 12px; color: var(--im-text, #303133); }
.mis-col.is-partner { color: #9254de; }
.col-head { margin: 4px 0 0; font-size: 11px; color: var(--im-muted, #909399); }
.col-text { margin: 2px 0 0; white-space: pre-wrap; }
/* F263 卡壳一问 */
.stuck-card { margin: 6px 0; padding: 8px 10px; border-radius: 8px; border: 1px solid var(--im-border, #ebeef5); }
.stuck-head { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; margin: 0; font-size: 13px; }
.stuck-question { color: #9254de; }
.answer-line { margin: 4px 0 0; font-size: 12px; color: var(--im-text, #303133); white-space: pre-wrap; }
/* F264 换位信 */
.letter-row { margin: 6px 0; padding: 8px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); }
.letter-row.is-partner { border-left: 3px solid #9254de; }
.letter-head { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; margin: 0; font-size: 12px; }
.letter-day { color: #9254de; }
.letter-text { margin: 4px 0 0; font-size: 13px; color: var(--im-text, #303133); white-space: pre-wrap; }
/* F265 早想说 */
.hold-next { margin: 6px 0 0; font-size: 12px; color: #9254de; }
.hold-row { margin: 4px 0; font-size: 12px; color: var(--im-text, #303133); display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.hold-row.is-sent { color: #67c23a; }
.hold-text { background: var(--im-bg, #fafafa); border-radius: 8px; padding: 2px 8px; }
.sent-chip { font-size: 11px; color: #67c23a; }
/* F266 三行打卡 */
.three-form { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.three-form .el-input { flex: 1; min-width: 180px; }
.streak-row { margin-top: 8px; }
.streak-line { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin: 4px 0; font-size: 12px; color: var(--im-text, #303133); }
.streak-who { width: 62px; }
.streak-num { color: #9254de; font-weight: bold; }
.bar { flex: 1; min-width: 120px; height: 8px; border-radius: 4px; background: rgba(146, 84, 222, 0.12); overflow: hidden; }
.bar-in { display: block; height: 100%; border-radius: 4px; }
.bar-mine { background: #9254de; }
.bar-partner { background: #b37feb; }
.badge-chip { font-size: 11px; color: #e6a23c; background: rgba(230, 162, 60, 0.12); padding: 1px 8px; border-radius: 10px; }
/* F268 休战旗 */
.truce-card { margin-top: 6px; padding: 8px 10px; border-radius: 8px; border: 1px dashed rgba(146, 84, 222, 0.45); }
.truce-head { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; margin: 0; font-size: 13px; }
.truce-decided { display: flex; gap: 8px; flex-wrap: wrap; margin: 6px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.expired-chip { font-size: 12px; color: #e6a23c; background: rgba(230, 162, 60, 0.12); padding: 2px 8px; border-radius: 10px; }
/* F269 称呼日 */
.name-big { margin: 2px 0 0; font-size: 26px; font-weight: bold; color: #9254de; letter-spacing: 2px; }
.name-status { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin: 6px 0 8px; }
</style>

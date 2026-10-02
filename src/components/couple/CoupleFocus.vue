<template>
  <div class="couple-focus" data-testid="couple-focus">
    <!-- F360 专注打卡：各人报自己那一列（0-180 分钟），两列都非空当夜才点亮 -->
    <CoupleCollapsible testid="couple-focus-night" :empty="!v">
      <template #title>🌙 专注打卡 <span class="sub">今晚放下手机陪了 TA 多少分钟（{{ NIGHT_MIN }}-{{ NIGHT_MAX }}）。两个人都报了，当夜这盏灯才算点亮——F220 熄灯是睡前仪式，这里报的是专注时长</span></template>
      <template v-if="v">
        <p class="section-head">🌙 报今晚的数（本人这一列当天可改写）</p>
        <div class="inline-form">
          <el-input v-model="nightMinutes" :maxlength="4" placeholder="放下了多少分钟（0-180）" data-testid="couple-focus-night-minutes" />
          <el-input
            v-model="nightNote"
            :maxlength="NIGHT_NOTE_MAX"
            show-word-limit
            :placeholder="`附一句话（≤${NIGHT_NOTE_MAX} 字，可空）`"
            data-testid="couple-focus-night-note"
          />
          <el-button size="small" type="primary" data-testid="couple-focus-night-submit" @click="onNight">
            {{ v.night.mineReported ? '改写我今晚的数 🌙' : '报今晚的专注 🌙' }}
          </el-button>
        </div>

        <p class="section-head">🕯️ 今晚这两盏灯</p>
        <div class="night-row" :class="{ 'is-lit': v.night.bothLit }" data-testid="couple-focus-night-mine">
          <p class="row-head">
            <span class="who-chip">我报的 🙋</span>
            <span v-if="v.night.mineReported" class="minutes-chip" data-testid="couple-focus-night-mine-minutes">{{ v.night.mineMinutes }} 分钟</span>
            <span v-else class="wait-line" data-testid="couple-focus-night-mine-none">这一列还空着</span>
          </p>
          <p v-if="v.night.mineNote" class="night-note" data-testid="couple-focus-night-mine-note">「{{ v.night.mineNote }}」</p>
        </div>
        <div class="night-row is-partner" :class="{ 'is-lit': v.night.bothLit }" data-testid="couple-focus-night-partner">
          <p class="row-head">
            <span class="who-chip">💕 TA 报的</span>
            <span v-if="v.night.partnerReported" class="minutes-chip" data-testid="couple-focus-night-partner-minutes">{{ v.night.partnerMinutes }} 分钟</span>
            <span v-else class="wait-line" data-testid="couple-focus-night-partner-none">TA 那一列还空着</span>
          </p>
          <p v-if="v.night.partnerNote" class="night-note" data-testid="couple-focus-night-partner-note">「{{ v.night.partnerNote }}」</p>
        </div>

        <p v-if="v.night.bothLit" class="lit-line" data-testid="couple-focus-night-lit">
          🌙✨ 今晚点亮了：一共 <span data-testid="couple-focus-night-total">{{ v.night.totalMinutes }}</span> 分钟手机是黑的，TA 是亮的
        </p>
        <p v-else-if="v.night.mineReported" class="wait-line" data-testid="couple-focus-night-wait">你报过了，还差 TA 一个 🕯️</p>
        <p v-else-if="v.night.partnerReported" class="wait-line" data-testid="couple-focus-night-wait-me">TA 已经报了，今晚就差你这一个 🕯️</p>
        <p v-else class="empty-line" data-testid="couple-focus-night-none">今晚还没人报，谁先放下手机谁先点亮 🌙</p>
        <p v-if="v.night.hint" class="hint-line" data-testid="couple-focus-night-hint">{{ v.night.hint }}</p>
      </template>
      <p v-else class="empty-line">注意力保护区还没开张……</p>
    </CoupleCollapsible>

    <!-- F361 专属时段：一周一段，提议人不能自己确认 -->
    <CoupleCollapsible testid="couple-focus-slot" :empty="!v">
      <template #title>📅 专属时段 <span class="sub">每周留一段「只属于我们」（写做什么 + 几小时，{{ SLOT_HOURS_MIN }}-{{ SLOT_HOURS_MAX }} 小时），对方点头才生效。F260 想被听是十分钟倾诉，这里是整段共处时光</span></template>
      <template v-if="v">
        <p class="section-head" data-testid="couple-focus-slot-week">📅 本周是 {{ weekRange.from }} ~ {{ weekRange.to }}，时段得落在这七天里</p>
        <el-input
          v-model="slotTitle"
          :maxlength="SLOT_TITLE_MAX"
          show-word-limit
          :placeholder="`这段时间做什么（≤${SLOT_TITLE_MAX} 字）`"
          data-testid="couple-focus-slot-title"
        />
        <div class="inline-form">
          <el-input v-model="slotHours" :maxlength="1" placeholder="几小时（1-6）" data-testid="couple-focus-slot-hours" />
          <el-input v-model="slotDay" :maxlength="DAY_LEN" placeholder="哪天（yyyy-MM-dd）" data-testid="couple-focus-slot-day" />
          <el-button size="small" type="primary" data-testid="couple-focus-slot-submit" @click="onSlotPropose">
            {{ v.slot ? '改写本周这段 📅' : '约下来，等 TA 点头 📅' }}
          </el-button>
        </div>
        <div class="chip-row">
          <button
            v-for="d in weekDays"
            :key="d"
            type="button"
            class="day-pick"
            :class="{ 'is-picked': slotDay === d }"
            :data-testid="`couple-focus-slot-day-pick-${d}`"
            @click="pickSlotDay(d)"
          >
            {{ weekdayLabel(d) }}
          </button>
        </div>

        <p class="section-head">🗓️ 这周那一段</p>
        <div v-if="v.slot" class="slot-card" :class="{ 'is-confirmed': v.slot.confirmed }" :data-testid="`couple-focus-slot-card-${v.slot.id}`">
          <p class="row-head">
            <span class="day-chip" data-testid="couple-focus-slot-day-text">{{ v.slot.day }}</span>
            <span class="hours-chip" data-testid="couple-focus-slot-hours-text">{{ v.slot.hours }} 小时</span>
            <span class="who-chip" data-testid="couple-focus-slot-who">{{ v.slot.mine ? '我约的 🙋' : `💕 ${v.slot.proposedBy} 约的` }}</span>
          </p>
          <p class="slot-title" data-testid="couple-focus-slot-title-text">「{{ v.slot.title }}」</p>
          <p v-if="v.slot.confirmed" class="lit-line" data-testid="couple-focus-slot-ok">✅ 已经生效：那天手机放远点，这段时间只属于我们</p>
          <p v-else-if="v.slot.mine" class="wait-line" data-testid="couple-focus-slot-wait">你约的这段，点头权在 TA 手里——自己确认不算 📅</p>
          <el-button v-else size="small" type="primary" data-testid="couple-focus-slot-confirm" @click="onSlotConfirm">点头确认 ✅</el-button>
        </div>
        <p v-else class="empty-line" data-testid="couple-focus-slot-none">本周还没有人开口约，先写一段只属于你们的 📅</p>
      </template>
      <p v-else class="empty-line">日历格子还没画出来……</p>
    </CoupleCollapsible>

    <!-- F362 攒一句话：TA 在忙的时候把话先放队列里 -->
    <CoupleCollapsible testid="couple-focus-queue" :empty="!v">
      <template #title>🗒️ 攒一句话 <span class="sub">TA 专注/勿扰的时候别催：先把话攒进队列（≤{{ QUEUE_MAX }} 字，在途每人 ≤{{ QUEUE_IN_FLIGHT_MAX }} 句），TA 忙完一键收全部并回执已读</span></template>
      <template v-if="v">
        <p class="section-head">🗒️ 攒一句给 TA</p>
        <el-input
          v-model="queueContent"
          type="textarea"
          :rows="2"
          :maxlength="QUEUE_MAX"
          show-word-limit
          :placeholder="`想说的那句话（≤${QUEUE_MAX} 字，不急，TA 回头看就好）`"
          data-testid="couple-focus-queue-content"
        />
        <div class="inline-form">
          <el-button size="small" type="primary" data-testid="couple-focus-queue-submit" @click="onQueue">攒进队列 🗒️</el-button>
          <el-button size="small" plain data-testid="couple-focus-queue-read-all" @click="onQueueRead">一键收全部 📬</el-button>
          <span class="count-chip" data-testid="couple-focus-queue-count">TA 攒给我 {{ v.queue.length }} 句（待签 {{ v.queueUnread }} 句）</span>
        </div>

        <p class="section-head">📥 排队等我看的话</p>
        <p v-if="!v.queue.length" class="empty-line" data-testid="couple-focus-queue-empty">队列空着：要么 TA 没攒话，要么都看完了 🗒️</p>
        <div v-for="q in v.queue" :key="q.id" class="queue-row" :class="{ 'is-read': q.read }" :data-testid="`couple-focus-queue-${q.id}`">
          <p class="row-head">
            <span class="who-chip" :data-testid="`couple-focus-queue-who-${q.id}`">💕 {{ q.fromUser }} 攒的</span>
            <span v-if="q.read" class="status-chip" :data-testid="`couple-focus-queue-read-${q.id}`">已签收 📬</span>
            <span v-else class="hours-chip" :data-testid="`couple-focus-queue-wait-${q.id}`">还在排队 🗒️</span>
          </p>
          <p class="queue-text" :data-testid="`couple-focus-queue-text-${q.id}`">{{ q.content }}</p>
        </div>
        <p class="hint-line" data-testid="couple-focus-queue-note">
          🗒️ 队列只下发 TA 攒给我的那一份：我攒出去的几句要等 TA 签收，总览不回显；开口说话的人也不止这一处。
        </p>
      </template>
      <p v-else class="empty-line">便签本还没翻开……</p>
    </CoupleCollapsible>

    <!-- F363 饭桌不低头：双点才算同桌成功 -->
    <CoupleCollapsible testid="couple-focus-meal" :empty="!v">
      <template #title>🍚 饭桌不低头 <span class="sub">吃饭这二十分钟手机倒扣，各人点各人那一格；两个人都点了才叫「同桌成功」，连击看的是双点天</span></template>
      <template v-if="v">
        <div class="inline-form">
          <el-button size="small" type="primary" data-testid="couple-focus-meal-btn" @click="onMeal">
            {{ mealMine ? '我已经倒扣了 ✔' : '手机倒扣，按下这一格 🍚' }}
          </el-button>
          <span class="count-chip" data-testid="couple-focus-meal-count">今天按了 {{ v.meals }}/2 格</span>
        </div>
        <p v-if="v.mealBoth" class="lit-line" data-testid="couple-focus-meal-both">🍚 同桌成功：两个人都把手机倒扣了，这顿饭是热的、看着彼此吃的</p>
        <p v-else-if="v.meals >= 1 && mealMine" class="wait-line" data-testid="couple-focus-meal-wait">你这边扣下了，还差 TA 一个 🍚</p>
        <p v-else-if="v.meals >= 1" class="wait-line" data-testid="couple-focus-meal-wait-partner">TA 已经把手机扣了，就差你这一个 🍚</p>
        <p v-else class="empty-line" data-testid="couple-focus-meal-none">今天这顿饭还没人按，坐下来就顺手按一下 🍚</p>
      </template>
      <p v-else class="empty-line">饭碗还没摆上桌……</p>
    </CoupleCollapsible>

    <!-- F364 对视十秒：每天一次，双点点亮 -->
    <CoupleCollapsible testid="couple-focus-gaze" :empty="!v">
      <template #title>👀 对视十秒 <span class="sub">每天一次，两个人各点各的，双点才点亮。F177 同频共振是按手感，这里是眼神仪式</span></template>
      <template v-if="v">
        <div class="inline-form">
          <el-button size="small" type="primary" data-testid="couple-focus-gaze-btn" @click="onGaze">
            {{ gazeMine ? '我们看过十秒了 ✔' : '放下手机，看 TA 十秒 👀' }}
          </el-button>
          <span class="count-chip" data-testid="couple-focus-gaze-count">今天按了 {{ v.gazes }}/2 格</span>
        </div>
        <p v-if="v.gazeBoth" class="lit-line" data-testid="couple-focus-gaze-both">👀 对视十秒达成：刚才那十秒里，世界上只有你们两个人</p>
        <p v-else-if="v.gazes >= 1 && gazeMine" class="wait-line" data-testid="couple-focus-gaze-wait">你这一格点了，还差 TA 一个 👀</p>
        <p v-else-if="v.gazes >= 1" class="wait-line" data-testid="couple-focus-gaze-wait-partner">TA 已经看过十秒了，就差你这一个 👀</p>
        <p v-else class="empty-line" data-testid="couple-focus-gaze-none">今天还没对视，现在就抬头 👀</p>
      </template>
      <p v-else class="empty-line">灯还没调暗……</p>
    </CoupleCollapsible>

    <!-- F365 不插电半小时：睡前 30 分钟共同打卡，周连击后端读时算 -->
    <CoupleCollapsible testid="couple-focus-unplug" :empty="!v">
      <template #title>🔌 不插电半小时 <span class="sub">睡前半小时谁都不碰手机，双点算这晚成了；连击只数连续双点的天，由后端读时算。和 F360 区分：那卡报时长，这卡纯打卡</span></template>
      <template v-if="v">
        <div class="inline-form">
          <el-button size="small" type="primary" data-testid="couple-focus-unplug-btn" @click="onUnplug">
            {{ v.unplugMine ? '今晚我关机了 ✔' : '今晚这半小时，不插电 🔌' }}
          </el-button>
          <span class="count-chip" data-testid="couple-focus-unplug-streak">这周连着 {{ v.unplugStreak }} 晚双点</span>
        </div>
        <p v-if="v.unplugBoth" class="lit-line" data-testid="couple-focus-unplug-both">🔌 不插电半小时达成：睡眠比消息更值得回</p>
        <p v-else-if="v.unplugMine" class="wait-line" data-testid="couple-focus-unplug-wait">你这一格点了，还差 TA 一个 🔌</p>
        <p v-else class="wait-line" data-testid="couple-focus-unplug-wait-me">今晚还没插电，先点自己那一格 🔌</p>
        <p class="hint-line" data-testid="couple-focus-unplug-hint">连击 {{ v.unplugStreak }} 晚——断了也别弃，今晚重新开始也算数 🔌</p>
      </template>
      <p v-else class="empty-line">插座还没拔下来……</p>
    </CoupleCollapsible>

    <!-- F366 走神温柔哨：每人每天 2 张额度，防唠叨限流 -->
    <CoupleCollapsible testid="couple-focus-nudge" :empty="!v">
      <template #title>🐦 走神温柔哨 <span class="sub">TA 走神了，递一张「回来啦」卡：每人每天只有 {{ NUDGE_DAILY_MAX }} 张额度，防的就是唠叨。F276 久坐互拍管健康，这里管注意力</span></template>
      <template v-if="v">
        <p class="section-head">🐦 吹一声哨（≤{{ NUDGE_NOTE_MAX }} 字，不写就用我们的兜底句）</p>
        <div class="inline-form">
          <el-input
            v-model="nudgeNote"
            :maxlength="NUDGE_NOTE_MAX"
            show-word-limit
            :placeholder="`哨子上的话（≤${NUDGE_NOTE_MAX} 字，可空）`"
            data-testid="couple-focus-nudge-note"
          />
          <el-button size="small" type="primary" data-testid="couple-focus-nudge-submit" @click="onNudge">递一张「回来啦」🐦</el-button>
        </div>
        <div class="inline-form">
          <span class="count-chip" data-testid="couple-focus-nudge-left">我今天还剩 {{ v.nudgeQuotaLeft }}/{{ NUDGE_DAILY_MAX }} 张</span>
          <span class="who-chip" data-testid="couple-focus-nudge-today">今天两人一共递了 {{ v.nudgesToday }} 张</span>
        </div>
        <p v-if="v.nudgeQuotaLeft <= 0" class="wait-line" data-testid="couple-focus-nudge-used-up">今天的 {{ NUDGE_DAILY_MAX }} 张哨卡都用完了，再吹就成唠叨了 🐦</p>
        <p v-else class="empty-line" data-testid="couple-focus-nudge-fresh">额度还在：走神没关系，回来就好 🐦</p>
      </template>
      <p v-else class="empty-line">哨子还没挂上……</p>
    </CoupleCollapsible>

    <!-- F367 专注周报：按按钮懒读，不在总览里 -->
    <CoupleCollapsible testid="couple-focus-weekly" :empty="!v">
      <template #title>🗓️ 专注周报 <span class="sub">周一锚的一周账：专注分钟 / 同桌次数 / 对视 / 不插电连击，数字全从真表里捞，最后一句由我们来说。F179 默契周报考默契，这份算注意力</span></template>
      <template v-if="v">
        <div class="inline-form">
          <el-button size="small" type="primary" data-testid="couple-focus-weekly-btn" @click="onWeekly">读这一周的专注周报 🗓️</el-button>
          <span v-if="weekly" class="count-chip" data-testid="couple-focus-weekly-week">{{ weekly.week }} 那周</span>
        </div>
        <template v-if="weekly">
          <p class="range-line" data-testid="couple-focus-weekly-range">{{ weekly.fromDay }} ~ {{ weekly.toDay }}</p>
          <div class="stat-grid">
            <p class="stat" data-testid="couple-focus-weekly-minutes">放下手机 {{ weekly.minutes }} 分钟 🌙</p>
            <p class="stat" data-testid="couple-focus-weekly-lit">点亮 {{ weekly.litNights }} 个夜晚 🕯️</p>
            <p class="stat" data-testid="couple-focus-weekly-meals">同桌 {{ weekly.meals }} 次 🍚</p>
            <p class="stat" data-testid="couple-focus-weekly-gazes">对视 {{ weekly.gazes }} 次 👀</p>
            <p class="stat" data-testid="couple-focus-weekly-unplugs">不插电 {{ weekly.unplugs }} 晚 🔌</p>
            <p class="stat" data-testid="couple-focus-weekly-slots">专属时段 {{ weekly.slots }} 段 📅</p>
            <p class="stat" data-testid="couple-focus-weekly-nudges">温柔哨 {{ weekly.nudges }} 张 🐦</p>
            <p class="stat" data-testid="couple-focus-weekly-streak">连击 {{ weekly.unplugStreak }} 晚 ⏳</p>
          </div>
          <p class="summary-line" data-testid="couple-focus-weekly-summary">{{ weekly.summary }}</p>
        </template>
        <p v-else class="empty-line" data-testid="couple-focus-weekly-idle">周报不自动摊开——点上面按一次就有 🗓️</p>
      </template>
      <p v-else class="empty-line">周账本还没装订……</p>
    </CoupleCollapsible>

    <!-- F368 数字排毒半天：AM/PM 二选一，双报才达成 -->
    <CoupleCollapsible testid="couple-focus-detox" :empty="!v">
      <template #title>🌿 数字排毒半天 <span class="sub">挑半天（上半天 / 下半天）挂一个无手机挑战，对方应战；两个人都报了才收下「清净半天」这枚纪念。F361 是预约，这里是即时对抗</span></template>
      <template v-if="v">
        <p class="section-head">🌿 今天这半天，选一个挂上</p>
        <div class="inline-form">
          <el-radio-group v-model="detoxKind" data-testid="couple-focus-detox-kind">
            <el-radio value="AM" data-testid="couple-focus-detox-opt-AM">上半天 🌅</el-radio>
            <el-radio value="PM" data-testid="couple-focus-detox-opt-PM">下半天 🌇</el-radio>
          </el-radio-group>
          <el-button size="small" type="primary" data-testid="couple-focus-detox-submit" @click="onDetox">
            {{ detoxMine ? '我已经应战了 ✔' : '挂上 / 应战这一半天 🌿' }}
          </el-button>
        </div>
        <p v-if="v.detoxKind" class="range-line" data-testid="couple-focus-detox-kind-text">
          今天挂的是{{ detoxKindLabel(v.detoxKind) }}——先挂的人定这半天，后应战的不改写它 🌿
        </p>
        <p v-if="v.detoxBoth" class="lit-line" data-testid="couple-focus-detox-both">🕊️ 清净半天达成：这半天两个人都没碰手机，这份安静收下了</p>
        <p v-else-if="v.detoxKind && detoxMine" class="wait-line" data-testid="couple-focus-detox-wait">你应战了，还差 TA 一个 🌿</p>
        <p v-else-if="v.detoxKind" class="wait-line" data-testid="couple-focus-detox-wait-me">TA 已经挂了{{ detoxKindLabel(v.detoxKind) }}，就差你一个 🌿</p>
        <p v-else class="empty-line" data-testid="couple-focus-detox-none">今天还没人挂半天，选一个开始 🌿</p>
      </template>
      <p v-else class="empty-line">安静键还没装上……</p>
    </CoupleCollapsible>

    <!-- F369 注意力年报：按按钮懒读 -->
    <CoupleCollapsible testid="couple-focus-year" :empty="!v">
      <template #title>📻 注意力年报 <span class="sub">这一年「为彼此放下的手机小时数」+ 最专注的一天。F85/F99/F346/F359 各报各的域，这份只算注意力</span></template>
      <template v-if="v">
        <div class="inline-form">
          <el-input v-model="reportYear" :maxlength="YEAR_LEN" placeholder="读哪一年（空=今年，yyyy）" data-testid="couple-focus-year-input" />
          <el-button size="small" type="primary" data-testid="couple-focus-year-btn" @click="onYear">读这一年 📻</el-button>
          <el-button v-if="yearVo" size="small" plain data-testid="couple-focus-year-reset" @click="onYearBack">回到今年 ↩️</el-button>
        </div>
        <template v-if="yearVo">
          <p class="row-head">
            <span class="day-chip" data-testid="couple-focus-year-viewing">{{ yearVo.year }} 年</span>
            <span class="hours-chip" data-testid="couple-focus-year-hours">为彼此放下手机 {{ yearVo.hours }} 小时</span>
          </p>
          <div class="stat-grid">
            <p class="stat" data-testid="couple-focus-year-minutes">合计 {{ yearVo.minutes }} 分钟 🌙</p>
            <p class="stat" data-testid="couple-focus-year-lit">点亮 {{ yearVo.litNights }} 个夜晚 🕯️</p>
            <p class="stat" data-testid="couple-focus-year-meals">同桌 {{ yearVo.meals }} 次 🍚</p>
            <p class="stat" data-testid="couple-focus-year-gazes">对视 {{ yearVo.gazes }} 次 👀</p>
            <p class="stat" data-testid="couple-focus-year-unplugs">不插电 {{ yearVo.unplugs }} 晚 🔌</p>
            <p class="stat" data-testid="couple-focus-year-detox">清净半天 {{ yearVo.detox }} 次 🌿</p>
          </div>
          <p class="range-line" data-testid="couple-focus-year-top">
            {{ yearVo.topDay ? `最专注的一天是 ${yearVo.topDay}（合计 ${yearVo.topMinutes} 分钟）` : '还没有最专注的一天，今年还长着呢' }}
          </p>
          <p class="summary-line" data-testid="couple-focus-year-summary">{{ yearVo.summary }}</p>
        </template>
        <p v-else class="empty-line" data-testid="couple-focus-year-idle">年报机还没吐出这一年的数，点上面读一次 📻</p>
      </template>
      <p v-else class="empty-line">年度台账还空着……</p>
    </CoupleCollapsible>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { focusApi } from '@/api/couple'
import type {
  CoupleFocusDetoxKind,
  CoupleFocusTodayVO,
  CoupleFocusWeeklyVO,
  CoupleFocusYearlyVO,
} from '@/types'
import CoupleCollapsible from './CoupleCollapsible.vue'

/**
 * 限长与上限一律抄自后端 CoupleFocusService 与实体常量（只用于输入框限长与前端闸门文案；
 * 归属判定、幂等、双点结算、连击与周期锚一律留在后端，400 中文直透）：
 * CoupleFocusNight.MINUTES_MIN=0 MINUTES_MAX=180 NOTE_MAX=40 /
 * CoupleFocusSlot.TITLE_MAX=60 HOURS_MIN=1 HOURS_MAX=6 HOURS_DEFAULT=2 /
 * CoupleFocusQueue.CONTENT_MAX=80 IN_FLIGHT_MAX=5 /
 * CoupleFocusNudge.DAILY_MAX=2 NOTE_MAX=40 / CoupleFocusDetox.KIND_AM|KIND_PM
 */
const NIGHT_MIN = 0
const NIGHT_MAX = 180
const NIGHT_NOTE_MAX = 40
const SLOT_TITLE_MAX = 60
const SLOT_HOURS_MIN = 1
const SLOT_HOURS_MAX = 6
const SLOT_HOURS_DEFAULT = 2
const QUEUE_MAX = 80
const QUEUE_IN_FLIGHT_MAX = 5
const NUDGE_DAILY_MAX = 2
const NUDGE_NOTE_MAX = 40
const DAY_LEN = 10
const YEAR_LEN = 4
const DAY_MS = 86_400_000
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/
const YEAR_RE = /^\d{4}$/
const WEEKDAY_LABELS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

/** 今日总览（GET /today 与 10 个 POST 写接口都返回它，整体替换即十卡刷新） */
const v = ref<CoupleFocusTodayVO | null>(null)
/** F367 周报 / F369 年报：两个「点按钮才懒读」的独立读接口，不被总览覆盖 */
const weekly = ref<CoupleFocusWeeklyVO | null>(null)
const yearVo = ref<CoupleFocusYearlyVO | null>(null)
const reportYear = ref('')

// ---- 草稿（全是「本人这一侧」的输入口） ----
const nightMinutes = ref('')
const nightNote = ref('')
const slotTitle = ref('')
const slotHours = ref('')
const slotDay = ref('')
const queueContent = ref('')
const nudgeNote = ref('')
const detoxKind = ref<CoupleFocusDetoxKind | ''>('')

// ---- 派生 ----
/** 三张双点卡的「我这一格按过没」一律吃服务端下发的 mealMine/gazeMine/detoxMine，不再本地记位 */
const mealMine = computed(() => !!v.value && v.value.mealMine)
const gazeMine = computed(() => !!v.value && v.value.gazeMine)
const detoxMine = computed(() => !!v.value && v.value.detoxMine)

/** 本周一锚：一律从服务端下发的 v.day 推（slot.week 有就用它），不吃本地时钟，跨日/跨时区不会错位 */
const weekStartDay = computed(() => {
  const fromSlot = v.value?.slot?.week ?? ''
  if (DAY_RE.test(fromSlot)) return fromSlot
  return mondayOf(v.value?.day ?? '') ?? ''
})
const weekDays = computed<string[]>(() => {
  const start = weekStartDay.value
  if (!start) return []
  const base = Date.parse(`${start}T00:00:00Z`)
  return Array.from({ length: 7 }, (_, i) => new Date(base + i * DAY_MS).toISOString().slice(0, 10))
})
const weekRange = computed(() => ({
  from: weekDays.value[0] ?? '（等总览给日子）',
  to: weekDays.value[6] ?? '（等总览给日子）',
}))

function mondayOf(day: string): string | null {
  if (!DAY_RE.test(day)) return null
  const ts = Date.parse(`${day}T00:00:00Z`)
  if (Number.isNaN(ts)) return null
  const dow = new Date(ts).getUTCDay()
  return new Date(ts - ((dow + 6) % 7) * DAY_MS).toISOString().slice(0, 10)
}

function weekdayLabel(day: string): string {
  const ts = Date.parse(`${day}T00:00:00Z`)
  if (Number.isNaN(ts)) return day
  const idx = (new Date(ts).getUTCDay() + 6) % 7
  return `${WEEKDAY_LABELS[idx]} ${day.slice(5, 10).replace('-', '/')}`
}

/** 半天代号的中文说法（对齐后端 CoupleFocusBank.kindLabel，VO 不下发这句，只能前端自己说） */
function detoxKindLabel(kind: string): string {
  return kind === 'PM' ? '下半天' : '上半天'
}

function onError(e: unknown, fallback: string) {
  // 后端 400/404 的中文 message 直接透传（例如「自己写的时段不能自己确认，等 TA 点头」「攒了 5 句了」）
  ElMessage.error(e instanceof Error ? e.message : fallback)
}

/**
 * 写接口统一返回整份 TodayVO：整体替换即十卡刷新。
 * 替换后只回填「本人这一侧」的字段——今晚的分钟数与那句话（当天可改写）；
 * 一次性提交的（时段/攒的话/哨卡）清空重填；周报与年报是独立懒读结果，不被总览覆盖。
 */
function refresh(data: CoupleFocusTodayVO | null | undefined) {
  if (!data) return
  v.value = data
  if (data.night.mineReported) {
    nightMinutes.value = String(data.night.mineMinutes ?? NIGHT_MIN)
    nightNote.value = data.night.mineNote
  } else {
    nightMinutes.value = ''
    nightNote.value = ''
  }
  slotTitle.value = ''
  slotHours.value = ''
  slotDay.value = ''
  queueContent.value = ''
  nudgeNote.value = ''
}

function noData(): boolean {
  if (!v.value) {
    ElMessage.warning('还没拿到今天的总览，重进一次「🌱 养成」页签试试')
    return true
  }
  return false
}

// ---- F360 专注打卡 ----
async function onNight() {
  if (noData()) return
  const raw = nightMinutes.value.trim()
  if (!raw) {
    // 后端 minutes 传 null 会静默按 0 分钟记账：不点不报，别替今晚留下一个 0
    ElMessage.warning(`今晚放下了多少分钟总得报个数（${NIGHT_MIN}-${NIGHT_MAX}）🌙`)
    return
  }
  const minutes = Number(raw)
  if (!Number.isFinite(minutes)) {
    ElMessage.warning('分钟只写数字，别塞话进去 🌙')
    return
  }
  if (minutes < NIGHT_MIN || minutes > NIGHT_MAX) {
    // 后端是静默钳制，前端宁可挡下来问一句，也不让 TA 以为记了 300 分钟
    ElMessage.warning(`分钟只有 ${NIGHT_MIN}-${NIGHT_MAX}，一晚上没有 ${NIGHT_MAX} 分钟那么多 🌙`)
    return
  }
  const note = nightNote.value.trim()
  if (note.length > NIGHT_NOTE_MAX) {
    ElMessage.warning(`那句话最多 ${NIGHT_NOTE_MAX} 字 🌙`)
    return
  }
  try {
    const data = await focusApi.focusNight(Math.round(minutes), note)
    refresh(data)
    if (data?.night.bothLit) ElMessage.success(`今晚点亮了：合计 ${data.night.totalMinutes} 分钟 🌙✨`)
    else ElMessage.success(`记下了 ${Math.round(minutes)} 分钟，还差 TA 一个 🕯️`)
  } catch (e) {
    onError(e, '报专注失败')
  }
}

// ---- F361 专属时段 ----
function pickSlotDay(day: string) {
  slotDay.value = day
  ElMessage.success(`定了 ${weekdayLabel(day)}，别忘了写做什么 📅`)
}

async function onSlotPropose() {
  if (noData()) return
  const title = slotTitle.value.trim()
  if (!title) {
    ElMessage.warning('总得写点什么，这段时间做什么 📅')
    return
  }
  if (title.length > SLOT_TITLE_MAX) {
    ElMessage.warning(`「做什么」最多 ${SLOT_TITLE_MAX} 字 📅`)
    return
  }
  const day = slotDay.value.trim()
  if (!day) {
    ElMessage.warning('先选哪天——落不在这周里后端也不算本周 📅')
    return
  }
  if (!DAY_RE.test(day)) {
    ElMessage.warning('哪天写成 yyyy-MM-dd 📅')
    return
  }
  const days = weekDays.value
  if (days.length && (day < days[0] || day > days[6])) {
    ElMessage.warning(`时段要落在本周（${days[0]} ~ ${days[6]}）📅`)
    return
  }
  const hoursRaw = slotHours.value.trim()
  const hours = hoursRaw ? Number(hoursRaw) : SLOT_HOURS_DEFAULT
  if (!Number.isFinite(hours)) {
    ElMessage.warning(`几小时只写数字（${SLOT_HOURS_MIN}-${SLOT_HOURS_MAX}）📅`)
    return
  }
  if (hours < SLOT_HOURS_MIN || hours > SLOT_HOURS_MAX) {
    // 后端 1-6 静默钳制（null 按 2 小时），前端不替 TA 猜一个 6
    ElMessage.warning(`时段只有 ${SLOT_HOURS_MIN}-${SLOT_HOURS_MAX} 小时，别填超了 📅`)
    return
  }
  try {
    const data = await focusApi.focusSlotPropose(title, Math.round(hours), day)
    refresh(data)
    ElMessage.success('递出去了，等 TA 点头这段才生效 📅')
  } catch (e) {
    onError(e, '预约时段失败')
  }
}

async function onSlotConfirm() {
  if (noData()) return
  const slot = v.value?.slot ?? null
  if (!slot) {
    ElMessage.warning('这周还没有人预约专属时段 📅')
    return
  }
  if (slot.mine) {
    ElMessage.warning('自己写的时段不能自己确认，等 TA 点头 📅')
    return
  }
  if (slot.confirmed) {
    ElMessage.warning('这段已经生效了，不用再点一次 ✅')
    return
  }
  try {
    const data = await focusApi.focusSlotConfirm()
    refresh(data)
    ElMessage.success('点头了：那天手机放远点 ✅')
  } catch (e) {
    onError(e, '确认时段失败')
  }
}

// ---- F362 攒一句话 ----
async function onQueue() {
  if (noData()) return
  const content = queueContent.value.trim()
  if (!content) {
    ElMessage.warning('想说的那句话说一句，别空着 🗒️')
    return
  }
  if (content.length > QUEUE_MAX) {
    ElMessage.warning(`一句话最多 ${QUEUE_MAX} 字 🗒️`)
    return
  }
  // 在途每人 ≤5 句的闸门交后端（总览不下发「我攒出去了几句」，前端算不出自己的那一份）
  try {
    const data = await focusApi.focusQueue(content)
    refresh(data)
    ElMessage.success('攒好了，TA 忙完一口气收 🗒️')
  } catch (e) {
    onError(e, '攒话失败')
  }
}

async function onQueueRead() {
  if (noData()) return
  if ((v.value?.queueUnread ?? 0) <= 0) {
    // 后端 GET /today 读时就把 to_user=我 的留言结算成已读，所以这条按钮多数时候签收 0 条、不推回执
    ElMessage.warning('这会儿没有待签收的句子——打开总览的时候就已经替你看过了 📬')
    return
  }
  try {
    const data = await focusApi.focusQueueRead()
    refresh(data)
    ElMessage.success('签收完了，排队区清空 📬')
  } catch (e) {
    onError(e, '签收失败')
  }
}

// ---- F363 饭桌不低头 ----
async function onMeal() {
  if (noData()) return
  if (v.value?.mealBoth) {
    ElMessage.warning('今天已经同桌成功了，这顿算过了 🍚')
    return
  }
  if (mealMine.value) {
    ElMessage.warning('你这一格今天已经按过了，等 TA 那边 🍚')
    return
  }
  try {
    const data = await focusApi.focusMeal()
    refresh(data)
    ElMessage.success(data?.mealBoth ? '同桌成功：这顿饭是热的 🍚' : '你这边扣下了，还差 TA 一个 🍚')
  } catch (e) {
    onError(e, '饭桌打卡失败')
  }
}

// ---- F364 对视十秒 ----
async function onGaze() {
  if (noData()) return
  if (v.value?.gazeBoth) {
    ElMessage.warning('今天已经对视过了，十秒够了 👀')
    return
  }
  if (gazeMine.value) {
    ElMessage.warning('你这一格今天点过了，还差 TA 一个 👀')
    return
  }
  try {
    const data = await focusApi.focusGaze()
    refresh(data)
    ElMessage.success(data?.gazeBoth ? '对视十秒达成 👀' : '你点了，还差 TA 一个 👀')
  } catch (e) {
    onError(e, '对视打卡失败')
  }
}

// ---- F365 不插电半小时 ----
async function onUnplug() {
  if (noData()) return
  if (v.value?.unplugBoth) {
    ElMessage.warning('今晚两个人都关机了，别再点 🔌')
    return
  }
  // 这张卡的「我点没点」是后端直接给的 unplugMine，不用本地位猜
  if (v.value?.unplugMine) {
    ElMessage.warning('今晚你这一格已经点了，等 TA 那边 🔌')
    return
  }
  try {
    const data = await focusApi.focusUnplug()
    refresh(data)
    ElMessage.success(
      data?.unplugBoth
        ? `不插电半小时达成：这周连着 ${data.unplugStreak} 晚 🔌`
        : '你这一格点了，还差 TA 一个 🔌',
    )
  } catch (e) {
    onError(e, '不插电打卡失败')
  }
}

// ---- F366 走神温柔哨 ----
async function onNudge() {
  if (noData()) return
  const note = nudgeNote.value.trim()
  if (note.length > NUDGE_NOTE_MAX) {
    ElMessage.warning(`哨子上的话最多 ${NUDGE_NOTE_MAX} 字 🐦`)
    return
  }
  if ((v.value?.nudgeQuotaLeft ?? 0) <= 0) {
    // 与后端同一条规则（每天 2 张），先挡下来给一句话，省一次注定 400 的提交
    ElMessage.warning(`今天的 ${NUDGE_DAILY_MAX} 张哨卡都用完了，再吹就唠叨了 🐦`)
    return
  }
  try {
    const data = await focusApi.focusNudge(note)
    refresh(data)
    ElMessage.success('哨声递过去了：回来就好 🐦')
  } catch (e) {
    onError(e, '递哨卡失败')
  }
}

// ---- F368 数字排毒半天 ----
async function onDetox() {
  if (noData()) return
  const kind = detoxKind.value
  if (kind !== 'AM' && kind !== 'PM') {
    // 后端 400「只能选 AM 或 PM」，前端先问一句选哪个
    ElMessage.warning('上半天还是下半天，先选一个 🌿')
    return
  }
  if (v.value?.detoxBoth) {
    ElMessage.warning('今天这半天已经清净成了，别再点 🕊️')
    return
  }
  if (detoxMine.value) {
    ElMessage.warning('你今天已经应战了，等 TA 那边 🌿')
    return
  }
  try {
    const data = await focusApi.focusDetox(kind)
    refresh(data)
    if (data?.detoxBoth) ElMessage.success('清净半天达成：这份安静收下了 🕊️')
    else if (data?.detoxKind && data.detoxKind !== kind) {
      ElMessage.warning(`你应战了，但今天挂的是${detoxKindLabel(data.detoxKind)}——半天照旧 🌿`)
    } else ElMessage.success('挂上了，还差 TA 应战一个 🌿')
  } catch (e) {
    onError(e, '排毒挑战失败')
  }
}

// ---- F367 专注周报（懒读，首次加载不自动拉） ----
async function onWeekly() {
  try {
    const data = await focusApi.focusWeekly()
    if (data) {
      weekly.value = data
      ElMessage.success(`这周的账摊开了：${data.week} 那周 🗓️`)
    } else ElMessage.warning('这周还没有账可摊 🗓️')
  } catch (e) {
    onError(e, '读周报失败')
  }
}

// ---- F369 注意力年报（懒读） ----
async function onYear() {
  const year = reportYear.value.trim()
  if (year && !YEAR_RE.test(year)) {
    ElMessage.warning('年份写成 yyyy 📻')
    return
  }
  try {
    const data = await focusApi.focusYear(year)
    if (data) {
      yearVo.value = data
      ElMessage.success(`这一年放下了 ${data.hours} 小时 📻`)
    } else ElMessage.warning('这一年还没有年报数据 📻')
  } catch (e) {
    onError(e, '读年报失败')
  }
}

function onYearBack() {
  yearVo.value = null
  reportYear.value = ''
  ElMessage.success('回到读今年 ↩️')
}

/** 首次加载静默降级：未建空间 404 不弹错误条，十卡一律留空态；周报/年报按按钮时才懒读 */
async function safeLoad<T>(loader: () => Promise<T>, fallback: T): Promise<T> {
  try {
    const data = await loader()
    return (data ?? fallback) as T
  } catch {
    return fallback
  }
}

onMounted(async () => {
  const today = await safeLoad(() => focusApi.focusToday(), null as CoupleFocusTodayVO | null)
  if (today) refresh(today)
})
</script>

<style scoped>
/* 主色静夜深紫 #4c1d95（这批讲的是「把注意力当礼物」：夜里的灯、放下手机的安静，用压得住的深紫，
   不是主题粉那种甜；全仓 grep src/components/couple/*.vue 的 --collapse-title-color 与十六进制色确认零占用——
   既有卡标题主色已用掉 #0284c7 修复天蓝 / #065f46 墨玉绿 / #0d9488 剧幕青绿 / #16a34a 身体监护绿 /
   #2c7a7b 考据墨青 / #3f51b5 靛蓝 / #409eff 公司蓝 / #9254de 倾听紫 / #a0522d 人情茶褐 /
   #be185d 回音壁深玫瑰 / #c0392b 庆典朱红 / #d2691e 工坊橙棕 / #d93a3a 中国红（cozy 走 var(--im-text)），
   点缀色 #f56c6c 主题粉 / #b8860b 鎏金 / #e6a23c 暖橙 / #67c23a 绿 同样没占用；
   同族候选 #5b21b6/#6d28d9 落选是因为全局六套皮肤强调色里有 #8b5cf6、聊天气泡渐变端点里有 #7c3aed（批次二十六红线），
   紫系靠得太近；#4c1d95 在 src/ 全仓 grep 零命中。
   本组件不写 .title 规则，折叠卡标题色一律经 --collapse-title-color 级联给 CoupleCollapsible */
.couple-focus { display: flex; flex-direction: column; gap: 14px; --collapse-title-color: #4c1d95; }
.sub { font-size: 12px; color: var(--im-muted, #909399); font-weight: normal; margin-left: 6px; }
.section-head { margin: 10px 0 4px; font-size: 13px; font-weight: bold; color: #4c1d95; }
.inline-form { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 8px; }
.inline-form .el-input { flex: 1; min-width: 150px; }
.row-head { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; margin: 0; }
.empty-line { margin: 8px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.hint-line { margin: 6px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.wait-line { margin: 6px 0 0; font-size: 12px; color: #4c1d95; }
.lit-line { margin: 8px 0 0; padding: 8px 10px; border-radius: 8px; font-size: 13px; color: #4c1d95; background: rgba(76, 29, 149, 0.08); }
.summary-line { margin: 8px 0 0; padding: 8px 10px; border-radius: 8px; font-size: 13px; color: var(--im-text, #303133); background: var(--im-bg, #fafafa); }
.range-line { margin: 6px 0 0; font-size: 12px; color: #4c1d95; }
.who-chip { font-size: 11px; color: var(--im-muted, #909399); }
.day-chip, .status-chip, .count-chip, .hours-chip, .minutes-chip { font-size: 11px; color: #4c1d95; background: rgba(76, 29, 149, 0.1); padding: 1px 8px; border-radius: 10px; }
.chip-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.day-pick { font-size: 12px; color: #4c1d95; background: rgba(76, 29, 149, 0.08); border: 1px solid rgba(76, 29, 149, 0.2); border-radius: 12px; padding: 2px 10px; cursor: pointer; }
.day-pick.is-picked { background: #4c1d95; color: #fff; border-color: #4c1d95; }
/* F360 今晚两盏灯 */
.night-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid var(--im-border, #ebeef5); font-size: 13px; }
.night-row.is-lit { border-left-color: #4c1d95; }
.night-row.is-partner { border-left-color: rgba(76, 29, 149, 0.35); }
.night-note { margin: 3px 0 0; color: var(--im-text, #303133); }
/* F361 本周那一段 */
.slot-card { margin: 7px 0; padding: 8px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid var(--im-border, #ebeef5); font-size: 13px; }
.slot-card.is-confirmed { border-left-color: #4c1d95; }
.slot-title { margin: 4px 0 6px; color: var(--im-text, #303133); }
/* F362 队列 */
.queue-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid var(--im-border, #ebeef5); font-size: 13px; }
.queue-row.is-read { border-left-color: rgba(76, 29, 149, 0.35); }
.queue-text { margin: 3px 0 0; color: var(--im-text, #303133); }
/* 周报 / 年报 */
.stat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 6px; margin-top: 8px; }
.stat { margin: 0; padding: 7px 10px; border-radius: 8px; font-size: 13px; color: #4c1d95; background: rgba(76, 29, 149, 0.08); }
</style>

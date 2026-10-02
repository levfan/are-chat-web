<template>
  <div class="couple-catch" data-testid="couple-catch">
    <!-- F380 暗中心愿本：偷偷记 TA 随口说的，兑现登记那一刻才揭晓 -->
    <CoupleCollapsible testid="couple-catch-wish" :empty="!v">
      <template #title>🤫 暗中心愿本 <span class="sub">把 TA 随口一说「这个挺好」的瞬间记下来，对 TA 保密；兑现登记后才揭晓「你哪天说过」。替 TA 记的本子最多 {{ WISH_PER_OWNER_MAX }} 条，勾兑现的人只能是你</span></template>
      <template v-if="v">
        <p class="section-head">🤫 悄悄记一条（这句话只有你看得见）</p>
        <el-input
          v-model="wishContent"
          type="textarea"
          :rows="2"
          :maxlength="WISH_CONTENT_MAX"
          show-word-limit
          :placeholder="`TA 想要什么，写一句（≤${WISH_CONTENT_MAX} 字）`"
          data-testid="couple-catch-wish-content"
        />
        <div class="inline-form">
          <el-input v-model="wishDay" :maxlength="DAY_LEN" placeholder="出处日子（yyyy-MM-dd，空=今天）" data-testid="couple-catch-wish-day" />
          <el-input
            v-model="wishScene"
            :maxlength="WISH_SCENE_MAX"
            show-word-limit
            :placeholder="`当时在什么场合（≤${WISH_SCENE_MAX} 字，可空）`"
            data-testid="couple-catch-wish-scene"
          />
          <el-button size="small" type="primary" data-testid="couple-catch-wish-submit" @click="onWish">悄悄记下 🤫</el-button>
        </div>
        <p class="quota-line" data-testid="couple-catch-wish-quota">TA 的心愿本还能记 {{ v.wishQuotaLeft }} 条（上限 {{ WISH_PER_OWNER_MAX }} 条，已揭晓的也占格子）</p>

        <p class="section-head">📖 我还没说出去的那些（{{ v.myWishes.length }} 条）</p>
        <p v-if="!v.myWishes.length" class="empty-line" data-testid="couple-catch-wish-none">小本本还空着——下次 TA 随口一说就掏出笔 🤫</p>
        <div v-for="w in v.myWishes" :key="w.id" class="row-card" :data-testid="`couple-catch-wish-${w.id}`">
          <p class="row-main" :data-testid="`couple-catch-wish-text-${w.id}`">「{{ w.content }}」</p>
          <p class="row-meta">
            <span class="day-chip" :data-testid="`couple-catch-wish-source-${w.id}`">{{ w.sourceDay }} 说过</span>
            <span v-if="w.scene" class="scene-chip" :data-testid="`couple-catch-wish-scene-text-${w.id}`">在{{ w.scene }}</span>
          </p>
          <el-button size="small" type="primary" plain :data-testid="`couple-catch-wish-fill-${w.id}`" @click="onWishFulfill(w.id)">
            买给 TA 了，勾兑现 🎁
          </el-button>
        </div>

        <p class="section-head">🎁 TA 悄悄替我记的（兑现时才让我看见）</p>
        <p v-if="!v.revealedToMe.length" class="empty-line" data-testid="couple-catch-wish-revealed-none">还没有被揭晓的心愿——有人正在憋着不说 🎁</p>
        <div v-for="w in v.revealedToMe" :key="w.id" class="row-card is-lit" :data-testid="`couple-catch-wish-revealed-${w.id}`">
          <p class="row-main" :data-testid="`couple-catch-wish-revealed-text-${w.id}`">「{{ w.content }}」已经到手了</p>
          <p class="row-meta" :data-testid="`couple-catch-wish-revealed-meta-${w.id}`">原来我 {{ w.sourceDay }} 说过{{ w.scene ? `，当时在${w.scene}` : '' }}——有人一直记着</p>
        </div>
      </template>
      <p v-else class="empty-line">还没拿到聆听者总览……</p>
    </CoupleCollapsible>

    <!-- F381 雷区探测器：先把易吵话题挂出来，对方盖「已知晓」，绕开了记一功 -->
    <CoupleCollapsible testid="couple-catch-mine" :empty="!v">
      <template #title>💣 雷区探测器 <span class="sub">提前挂出「一碰就吵」的话题 + 我的雷点 + 安全说法，对方盖「已知晓」章；真绕过去了就记一次避雷。每人最多挂 {{ MINE_PER_USER_MAX }} 颗</span></template>
      <template v-if="v">
        <p class="section-head">💣 挂一颗我的雷</p>
        <div class="inline-form">
          <el-input
            v-model="mineTopic"
            :maxlength="MINE_TOPIC_MAX"
            show-word-limit
            :placeholder="`哪个话题（≤${MINE_TOPIC_MAX} 字，比如「前男友」）`"
            data-testid="couple-catch-mine-topic"
          />
          <el-input
            v-model="mineTrip"
            :maxlength="MINE_TRIP_MAX"
            show-word-limit
            :placeholder="`我的雷点是什么（≤${MINE_TRIP_MAX} 字，可空）`"
            data-testid="couple-catch-mine-trip"
          />
        </div>
        <div class="inline-form">
          <el-input
            v-model="mineSafe"
            :maxlength="MINE_SAFE_MAX"
            show-word-limit
            :placeholder="`怎么说才安全（≤${MINE_SAFE_MAX} 字，可空）`"
            data-testid="couple-catch-mine-safe"
          />
          <el-button size="small" type="primary" data-testid="couple-catch-mine-submit" @click="onMine">挂上这颗雷 💣</el-button>
        </div>
        <p class="quota-line" data-testid="couple-catch-mine-quota">我挂了 {{ myMineCount }} 颗（上限 {{ MINE_PER_USER_MAX }} 颗），TA 挂了 {{ partnerMineCount }} 颗</p>

        <p class="section-head">🗺️ 雷区地图（新的在前）</p>
        <p v-if="!v.mines.length" class="empty-line" data-testid="couple-catch-mine-none">还没人挂雷——先说清楚哪里不能踩 💣</p>
        <div v-for="m in v.mines" :key="m.id" class="row-card" :class="{ 'is-partner': !m.mine, 'is-lit': m.acked }" :data-testid="`couple-catch-mine-${m.id}`">
          <p class="row-head">
            <span class="topic-chip" :data-testid="`couple-catch-mine-topic-text-${m.id}`">{{ m.topic }}</span>
            <span class="who-chip" :data-testid="`couple-catch-mine-who-${m.id}`">{{ m.mine ? '我挂的 🙋' : '💕 TA 挂的' }}</span>
            <span v-if="m.acked" class="ack-chip" :data-testid="`couple-catch-mine-acked-${m.id}`">已知晓（{{ m.ackBy }}）✅</span>
            <span v-if="m.avoided > 0" class="avoid-chip" :data-testid="`couple-catch-mine-avoided-${m.id}`">绕开 {{ m.avoided }} 次 🛡️</span>
          </p>
          <p v-if="m.trip" class="row-quote" :data-testid="`couple-catch-mine-trip-text-${m.id}`">雷点：{{ m.trip }}</p>
          <p v-if="m.safeWay" class="row-quote" :data-testid="`couple-catch-mine-safe-text-${m.id}`">安全说法：{{ m.safeWay }}</p>
          <el-button v-if="!m.mine && !m.acked" size="small" type="primary" :data-testid="`couple-catch-mine-ack-${m.id}`" @click="onMineAck(m.id)">
            我记住了，盖「已知晓」✅
          </el-button>
          <el-button v-else-if="!m.mine && m.acked" size="small" plain :data-testid="`couple-catch-mine-avoid-${m.id}`" @click="onMineAvoid(m.id)">
            这次绕过去了，记一功 🛡️
          </el-button>
          <p v-else class="wait-line" :data-testid="`couple-catch-mine-wait-${m.id}`">自己挂的雷，知晓章要 TA 来盖 ✅</p>
        </div>
      </template>
      <p v-else class="empty-line">雷区地图还空着……</p>
    </CoupleCollapsible>

    <!-- F382 安全词：先约好一个暂停词，喊出来不丢人，事后还能补一句复盘 -->
    <CoupleCollapsible testid="couple-catch-safeword" :empty="!v">
      <template #title>🛑 安全词 <span class="sub">双方各约一个「暂停」词（{{ WORD_MAX }} 字内）——听到就停，不追问。一天一人只记一次，事后可以补一句复盘。本月两人合计已喊 {{ v ? v.monthUses : 0 }} 次</span></template>
      <template v-if="v">
        <p class="section-head">🛑 约我的那个词</p>
        <div class="inline-form">
          <el-input
            v-model="wordText"
            :maxlength="WORD_MAX"
            show-word-limit
            :placeholder="`暂停词（≤${WORD_MAX} 字，比如「冷静十分钟」）`"
            data-testid="couple-catch-word-text"
          />
          <el-input
            v-model="wordNote"
            :maxlength="WORD_NOTE_MAX"
            show-word-limit
            :placeholder="`用了之后希望怎样（≤${WORD_NOTE_MAX} 字，可空）`"
            data-testid="couple-catch-word-note"
          />
          <el-button size="small" type="primary" data-testid="couple-catch-word-submit" @click="onWord">
            {{ v.myWord ? '改写我的安全词 🛑' : '定下我的安全词 🛑' }}
          </el-button>
        </div>

        <div class="row-card" :class="{ 'is-lit': !!v.myWord }" data-testid="couple-catch-word-mine">
          <p class="row-head">
            <span class="who-chip">我这格 🙋</span>
            <template v-if="v.myWord">
              <span class="word-chip" data-testid="couple-catch-word-mine-text">{{ v.myWord.word }}</span>
              <span class="count-chip" data-testid="couple-catch-word-mine-count">累计喊过 {{ v.myWord.useCount }} 次</span>
            </template>
            <span v-else class="empty-line" data-testid="couple-catch-word-mine-none">还没约词</span>
          </p>
          <p v-if="v.myWord && v.myWord.note" class="row-quote" data-testid="couple-catch-word-mine-note">用了之后希望：{{ v.myWord.note }}</p>
          <el-button size="small" type="danger" plain data-testid="couple-catch-word-use" @click="onWordUse">
            这轮我喊了暂停 🛑
          </el-button>
          <p v-if="usedToday" class="lit-line" data-testid="couple-catch-word-use-today">今天已经记过一次暂停了，一天一次 🛑</p>
        </div>

        <div class="row-card is-partner" :class="{ 'is-lit': !!v.partnerWord }" data-testid="couple-catch-word-partner">
          <p class="row-head">
            <span class="who-chip">💕 TA 那格</span>
            <template v-if="v.partnerWord">
              <span class="word-chip" data-testid="couple-catch-word-partner-text">{{ v.partnerWord.word }}</span>
              <span class="count-chip" data-testid="couple-catch-word-partner-count">TA 累计喊过 {{ v.partnerWord.useCount }} 次</span>
            </template>
            <span v-else class="empty-line" data-testid="couple-catch-word-partner-none">TA 还没约词</span>
          </p>
          <p v-if="v.partnerWord && v.partnerWord.note" class="row-quote" data-testid="couple-catch-word-partner-note">TA 希望：{{ v.partnerWord.note }}</p>
          <p v-if="v.partnerWord" class="wait-line" data-testid="couple-catch-word-partner-wait">听到这个词就停——这是 TA 的机制，不是认输 🛑</p>
        </div>

        <p class="section-head">📝 暂停记录（{{ v.uses.length }} 次，新的在前；复盘只能由喊停的人补）</p>
        <p v-if="!v.uses.length" class="empty-line" data-testid="couple-catch-use-none">还没喊过停——这不是坏事，也别当成比赛 🛑</p>
        <div v-for="u in v.uses" :key="u.id" class="row-card" :class="{ 'is-partner': !u.mine, 'is-lit': !!u.reflect }" :data-testid="`couple-catch-use-${u.id}`">
          <p class="row-head">
            <span class="day-chip" :data-testid="`couple-catch-use-day-${u.id}`">{{ u.day }}</span>
            <span class="who-chip" :data-testid="`couple-catch-use-who-${u.id}`">{{ u.mine ? '我喊的 🙋' : '💕 TA 喊的' }}</span>
            <span v-if="u.word" class="word-chip" :data-testid="`couple-catch-use-word-${u.id}`">{{ u.word }}</span>
            <span v-if="u.reflect" class="ack-chip" :data-testid="`couple-catch-use-reflect-${u.id}`">已补复盘 📝</span>
          </p>
          <div v-if="u.mine" class="inline-form">
            <el-input
              v-model="reflectDraft[u.id]"
              :maxlength="USE_REFLECT_MAX"
              show-word-limit
              :placeholder="`事后补一句：当时卡在哪、后来怎么接着聊的（≤${USE_REFLECT_MAX} 字）`"
              :data-testid="`couple-catch-reflect-input-${u.id}`"
            />
            <el-button size="small" plain :data-testid="`couple-catch-reflect-btn-${u.id}`" @click="onReflect(u.id)">
              {{ u.reflect ? '改写复盘 📝' : '补上复盘 📝' }}
            </el-button>
          </div>
          <p v-else-if="u.reflect" class="row-quote" :data-testid="`couple-catch-use-reflect-text-${u.id}`">「{{ u.reflect }}」</p>
          <p v-else class="wait-line" :data-testid="`couple-catch-use-reflect-wait-${u.id}`">那次是 TA 喊的停，复盘要 TA 自己写 📝</p>
        </div>
      </template>
      <p v-else class="empty-line">安全词还没约上……</p>
    </CoupleCollapsible>

    <!-- F383 敏感日历：替 TA 把难熬的日子提前标出来，前一天系统提醒的是「照做」 -->
    <CoupleCollapsible testid="couple-catch-sensitive" :empty="!v">
      <template #title>📌 敏感日历 <span class="sub">替 TA 提前标出难熬的日子（周期第一天/考核日/忌日纪念日/其它）+ 当天想被怎样对待。只能标今天或将来，主人自己撤不掉——谁标的谁负责</span></template>
      <template v-if="v">
        <p class="section-head">📌 帮 TA 标一天</p>
        <div class="inline-form">
          <el-input v-model="sensDay" :maxlength="DAY_LEN" placeholder="哪一天（yyyy-MM-dd，今天或将来）" data-testid="couple-catch-sens-day" />
          <el-input
            v-model="sensCare"
            :maxlength="SENSITIVE_CARE_MAX"
            show-word-limit
            :placeholder="`当天想被怎样对待（≤${SENSITIVE_CARE_MAX} 字，可空）`"
            data-testid="couple-catch-sens-care"
          />
        </div>
        <div class="chip-row">
          <button
            v-for="k in KIND_OPTIONS"
            :key="k.code"
            type="button"
            class="day-pick"
            :class="{ 'is-picked': sensKind === k.code }"
            :data-testid="`couple-catch-sens-kind-${k.code}`"
            @click="sensKind = k.code"
          >
            {{ k.label }}
          </button>
        </div>
        <el-button size="small" type="primary" data-testid="couple-catch-sens-submit" @click="onSensitive">标进 TA 的日历 📌</el-button>

        <p class="section-head">🗓️ 往后的敏感日（{{ v.sensitives.length }} 个，过去的日子后端已经收走）</p>
        <p v-if="!v.sensitives.length" class="empty-line" data-testid="couple-catch-sens-none">日历上还没有标记——记得住的日子不用写，但写下来的那天才不会被错过 📌</p>
        <div v-for="s in v.sensitives" :key="s.id" class="row-card" :class="{ 'is-lit': s.remindTomorrow }" :data-testid="`couple-catch-sens-${s.id}`">
          <p class="row-head">
            <span class="day-chip" :data-testid="`couple-catch-sens-day-text-${s.id}`">{{ s.day }}</span>
            <span class="kind-chip" :data-testid="`couple-catch-sens-kind-text-${s.id}`">{{ s.kindLabel }}</span>
            <span class="who-chip" :data-testid="`couple-catch-sens-owner-${s.id}`">{{ s.mineAsOwner ? 'TA 替我标的 💕' : '我替 TA 标的 🙋' }}</span>
            <span class="left-chip" :data-testid="`couple-catch-sens-left-${s.id}`">{{ countdownText(s.daysLeft) }}</span>
          </p>
          <p v-if="s.care" class="row-quote" :data-testid="`couple-catch-sens-care-text-${s.id}`">想被：{{ s.care }}</p>
          <p v-if="s.remindTomorrow" class="lit-line" :data-testid="`couple-catch-sens-bell-${s.id}`">🔔 就是明天。别问为什么，照做就行。</p>
          <el-button v-if="!s.mineAsOwner" size="small" plain :data-testid="`couple-catch-sens-del-${s.id}`" @click="onSensitiveRemove(s.id)">
            撤掉这一天 📌
          </el-button>
          <p v-else class="wait-line" :data-testid="`couple-catch-sens-wait-${s.id}`">这是 TA 替你标的，要撤也只能 TA 来撤 📌</p>
        </div>
      </template>
      <p v-else class="empty-line">敏感日历还空着……</p>
    </CoupleCollapsible>

    <!-- F384 说到哪了：被打断的话头先卷上线轴，回头接着说，说完才销档 -->
    <CoupleCollapsible testid="couple-catch-thread" :empty="!v">
      <template #title>🧵 「说到哪了」存档 <span class="sub">话题被打断别硬记——存一句「聊到哪儿」+「说到哪了」，续完再销档。在途每人最多 {{ THREAD_IN_FLIGHT_MAX }} 个，销档只能销自己存的</span></template>
      <template v-if="v">
        <p class="section-head">🧵 卷一个新话头上来</p>
        <div class="inline-form">
          <el-input
            v-model="threadTopic"
            :maxlength="THREAD_TOPIC_MAX"
            show-word-limit
            :placeholder="`话题一句话（≤${THREAD_TOPIC_MAX} 字，比如「装修预算」）`"
            data-testid="couple-catch-thread-topic"
          />
          <el-input
            v-model="threadProgress"
            :maxlength="THREAD_PROGRESS_MAX"
            show-word-limit
            :placeholder="`说到哪了（≤${THREAD_PROGRESS_MAX} 字，可空）`"
            data-testid="couple-catch-thread-progress"
          />
          <el-button size="small" type="primary" data-testid="couple-catch-thread-submit" @click="onThread">存进线轴 🧵</el-button>
        </div>
        <p class="quota-line" data-testid="couple-catch-thread-quota">我这边的线轴：{{ v.myThreads.length }} / {{ THREAD_IN_FLIGHT_MAX }} 个在途（TA 那边 {{ v.partnerThreads.length }} 个）</p>

        <p class="section-head">🧶 我的在途话头</p>
        <p v-if="!v.myThreads.length" class="empty-line" data-testid="couple-catch-thread-none">没有聊到一半被打断的话——今天聊得挺顺 🧵</p>
        <div v-for="t in v.myThreads" :key="t.id" class="row-card" :data-testid="`couple-catch-thread-${t.id}`">
          <p class="row-main" :data-testid="`couple-catch-thread-topic-text-${t.id}`">{{ t.topic }}</p>
          <p v-if="t.progress" class="row-quote" :data-testid="`couple-catch-thread-progress-text-${t.id}`">说到：{{ t.progress }}</p>
          <el-button size="small" type="primary" plain :data-testid="`couple-catch-thread-done-${t.id}`" @click="onThreadDone(t.id)">
            续完了，销档 ✂️
          </el-button>
        </div>

        <p class="section-head">💕 TA 的在途话头（看得见，销不了）</p>
        <p v-if="!v.partnerThreads.length" class="empty-line" data-testid="couple-catch-thread-pnone">TA 手上没有断掉的话头</p>
        <div v-for="t in v.partnerThreads" :key="t.id" class="row-card is-partner" :data-testid="`couple-catch-thread-p-${t.id}`">
          <p class="row-main" :data-testid="`couple-catch-thread-p-topic-${t.id}`">{{ t.topic }}</p>
          <p v-if="t.progress" class="row-quote" :data-testid="`couple-catch-thread-p-progress-${t.id}`">说到：{{ t.progress }}</p>
          <p class="wait-line" :data-testid="`couple-catch-thread-p-wait-${t.id}`">这个话头是 TA 存的，让 TA 自己销档 ✂️</p>
        </div>
      </template>
      <p v-else class="empty-line">线轴还空着……</p>
    </CoupleCollapsible>

    <!-- F385 真话翻译机：我申报「嘴上说的=实际意思」，对方只能看，改不了也删不了 -->
    <CoupleCollapsible testid="couple-catch-say" :empty="!v">
      <template #title>🔤 反话词典 <span class="sub">本人申报口是心非：「嘴上说的是这句，实际意思是那句」。对方这一侧只能看、改不了也删不了，每人最多 {{ SAY_PER_USER_MAX }} 条</span></template>
      <template v-if="v">
        <p class="section-head">🔤 申报一条我的反话</p>
        <div class="inline-form">
          <el-input
            v-model="sayText"
            :maxlength="SAY_MAX"
            show-word-limit
            :placeholder="`嘴上常说的那句（≤${SAY_MAX} 字，比如「随便」）`"
            data-testid="couple-catch-say-input"
          />
          <el-input
            v-model="sayMeans"
            :maxlength="SAY_MEANS_MAX"
            show-word-limit
            :placeholder="`实际意思（≤${SAY_MEANS_MAX} 字，比如「你替我选，但别选错」）`"
            data-testid="couple-catch-say-means"
          />
          <el-button size="small" type="primary" data-testid="couple-catch-say-submit" @click="onSay">交这份对照 🔤</el-button>
        </div>
        <p class="quota-line" data-testid="couple-catch-say-quota">我申报了 {{ v.mySays.length }} / {{ SAY_PER_USER_MAX }} 条（TA 交了 {{ v.partnerSays.length }} 条）</p>

        <p class="section-head">📤 我申报的（只有我能删）</p>
        <p v-if="!v.mySays.length" class="empty-line" data-testid="couple-catch-say-none">还没交过反话对照——下次说「随便」之前先想想 🔤</p>
        <div v-for="s in v.mySays" :key="s.id" class="row-card" :data-testid="`couple-catch-say-${s.id}`">
          <p class="row-main">嘴上：「<span :data-testid="`couple-catch-say-text-${s.id}`">{{ s.say }}</span>」</p>
          <p class="row-quote" :data-testid="`couple-catch-say-means-text-${s.id}`">其实：{{ s.means }}</p>
          <el-button size="small" plain :data-testid="`couple-catch-say-del-${s.id}`" @click="onSayRemove(s.id)">撤掉这条 🔤</el-button>
        </div>

        <p class="section-head">💕 TA 交的对照（看就行，别改）</p>
        <p v-if="!v.partnerSays.length" class="empty-line" data-testid="couple-catch-say-pnone">TA 还没交过——可以先问问 TA 愿不愿意交一份</p>
        <div v-for="s in v.partnerSays" :key="s.id" class="row-card is-partner" :data-testid="`couple-catch-say-p-${s.id}`">
          <p class="row-main">嘴上：「<span :data-testid="`couple-catch-say-p-text-${s.id}`">{{ s.say }}</span>」</p>
          <p class="row-quote" :data-testid="`couple-catch-say-p-means-${s.id}`">其实：{{ s.means }}</p>
        </div>
      </template>
      <p v-else class="empty-line">反话词典还空着……</p>
    </CoupleCollapsible>

    <!-- F386 聆听方式协议：我难过时要的是哪一种，五选一写清楚，两份说明书都交了才不靠猜 -->
    <CoupleCollapsible testid="couple-catch-protocol" :empty="!v">
      <template #title>🎧 聆听协议 <span class="sub">各写一份「我难过时要的是」：讲道理 / 陪骂 / 抱抱不说话 / 递吃的 / 别理我，五选一 + 一句补充。下次安慰先翻这一页再开口</span></template>
      <template v-if="v">
        <p class="section-head">🎧 我这页说明书</p>
        <div class="chip-row">
          <button
            v-for="mode in MODE_OPTIONS"
            :key="mode.code"
            type="button"
            class="day-pick"
            :class="{ 'is-picked': protocolMode === mode.code }"
            :data-testid="`couple-catch-proto-mode-${mode.code}`"
            @click="protocolMode = mode.code"
          >
            {{ mode.label }}
          </button>
        </div>
        <div class="inline-form">
          <el-input
            v-model="protocolNote"
            :maxlength="PROTOCOL_NOTE_MAX"
            show-word-limit
            :placeholder="`补充说明（≤${PROTOCOL_NOTE_MAX} 字，可空：比如「讲道理要等我哭完」）`"
            data-testid="couple-catch-proto-note"
          />
          <el-button size="small" type="primary" data-testid="couple-catch-proto-submit" @click="onProtocol">
            {{ v.myProtocol ? '改写我这页 🎧' : '交我这页 🎧' }}
          </el-button>
        </div>
        <p class="hint-line" data-testid="couple-catch-proto-hint">{{ v.protocolHint }}</p>

        <div class="row-card" :class="{ 'is-lit': !!v.myProtocol }" data-testid="couple-catch-proto-mine">
          <p class="row-head">
            <span class="who-chip">我难过时要的是 🙋</span>
            <template v-if="v.myProtocol">
              <span class="mode-chip" data-testid="couple-catch-proto-mine-text">{{ v.myProtocol.modeLabel }}</span>
            </template>
            <span v-else class="empty-line" data-testid="couple-catch-proto-mine-none">还没写</span>
          </p>
          <p v-if="v.myProtocol && v.myProtocol.note" class="row-quote" data-testid="couple-catch-proto-mine-note">补充：{{ v.myProtocol.note }}</p>
        </div>

        <div class="row-card is-partner" :class="{ 'is-lit': !!v.partnerProtocol }" data-testid="couple-catch-proto-partner">
          <p class="row-head">
            <span class="who-chip">💕 TA 难过时要的是</span>
            <template v-if="v.partnerProtocol">
              <span class="mode-chip" data-testid="couple-catch-proto-partner-text">{{ v.partnerProtocol.modeLabel }}</span>
            </template>
            <span v-else class="empty-line" data-testid="couple-catch-proto-partner-none">TA 还没写</span>
          </p>
          <p v-if="v.partnerProtocol && v.partnerProtocol.note" class="row-quote" data-testid="couple-catch-proto-partner-note">补充：{{ v.partnerProtocol.note }}</p>
        </div>
      </template>
      <p v-else class="empty-line">两份说明书都还没交……</p>
    </CoupleCollapsible>

    <!-- F387 话题许愿池：人出的题，对方接单，一周内聊完并留一句感想 -->
    <CoupleCollapsible testid="couple-catch-topic" :empty="!v">
      <template #title>💭 话题许愿池 <span class="sub">「希望我们多聊某某事」由人出题：对方接单，聊完回来勾上并留一句感想。超过接单后一周算超时（后端落 overdue 章）</span></template>
      <template v-if="v">
        <p class="section-head">💭 许一题想让 TA 多聊的</p>
        <div class="inline-form">
          <el-input
            v-model="topicTitle"
            :maxlength="TOPIC_TITLE_MAX"
            show-word-limit
            :placeholder="`希望我们多聊什么（≤${TOPIC_TITLE_MAX} 字）`"
            data-testid="couple-catch-topic-title"
          />
          <el-button size="small" type="primary" data-testid="couple-catch-topic-submit" @click="onTopic">投进池子 💭</el-button>
        </div>

        <p class="section-head">🫧 池子里的题（{{ v.topics.length }} 题，含聊完的）</p>
        <p v-if="!v.topics.length" class="empty-line" data-testid="couple-catch-topic-none">还没人出题——先说一件你想知道我想法的事 💭</p>
        <div v-for="t in v.topics" :key="t.id" class="row-card" :class="{ 'is-partner': !t.mine, 'is-lit': t.status === 'TALKED' }" :data-testid="`couple-catch-topic-${t.id}`">
          <p class="row-head">
            <span class="topic-chip" :data-testid="`couple-catch-topic-title-text-${t.id}`">{{ t.title }}</span>
            <span class="status-chip" :data-testid="`couple-catch-topic-status-${t.id}`">{{ statusLabel(t.status) }}</span>
            <span class="who-chip" :data-testid="`couple-catch-topic-who-${t.id}`">{{ t.mine ? '我许的 🙋' : '💕 TA 许的' }}</span>
            <span v-if="t.takenBy" class="ack-chip" :data-testid="`couple-catch-topic-taken-${t.id}`">{{ t.takenBy }} 接的单 📥</span>
            <span v-if="t.overdue" class="over-chip" :data-testid="`couple-catch-topic-overdue-${t.id}`">超过一周才聊 🕐</span>
          </p>
          <p v-if="t.status === 'TALKED'" class="row-quote" :data-testid="`couple-catch-topic-talked-${t.id}`">{{ t.talkDay }} 聊完了{{ t.reflect ? `：「${t.reflect}」` : '' }}</p>
          <el-button v-if="t.canTake" size="small" type="primary" :data-testid="`couple-catch-topic-take-${t.id}`" @click="onTopicTake(t.id)">
            这单我接了，这周内聊 📥
          </el-button>
          <div v-else-if="t.canTalk" class="inline-form">
            <el-input
              v-model="talkDraft[t.id]"
              :maxlength="TOPIC_REFLECT_MAX"
              show-word-limit
              :placeholder="`聊完留一句感想（≤${TOPIC_REFLECT_MAX} 字）`"
              :data-testid="`couple-catch-talk-input-${t.id}`"
            />
            <el-button size="small" type="primary" :data-testid="`couple-catch-talk-btn-${t.id}`" @click="onTopicTalk(t.id)">
              聊完了，勾上 ✅
            </el-button>
          </div>
          <p v-else-if="t.status === 'PENDING'" class="wait-line" :data-testid="`couple-catch-topic-wait-${t.id}`">自己许的题自己接不了 📥</p>
          <p v-else-if="t.mine" class="wait-line" :data-testid="`couple-catch-topic-mine-wait-${t.id}`">单是 TA 接的，「聊完了」也要 TA 来说 ✅</p>
        </div>
      </template>
      <p v-else class="empty-line">话题池还是空的……</p>
    </CoupleCollapsible>

    <!-- F388 今日一句话：每天给对方留一句，没留就回看最近那句 -->
    <CoupleCollapsible testid="couple-catch-daily" :empty="!v">
      <template #title>💬 今日一句话 <span class="sub">今天想对 TA 说的那一句（{{ DAILY_CONTENT_MAX }} 字内），当天可以改写；没留的话，这里会摆着上一句和「今天还没说」</span></template>
      <template v-if="v">
        <p class="section-head">💬 我这句</p>
        <div class="inline-form">
          <el-input
            v-model="dailyContent"
            :maxlength="DAILY_CONTENT_MAX"
            show-word-limit
            :placeholder="`今天想说的（≤${DAILY_CONTENT_MAX} 字）`"
            data-testid="couple-catch-daily-input"
          />
          <el-button size="small" type="primary" data-testid="couple-catch-daily-submit" @click="onDaily">
            {{ v.myToday ? '改写今天这句 💬' : '留今天这句 💬' }}
          </el-button>
        </div>

        <div class="row-card" :class="{ 'is-lit': !!v.myToday }" data-testid="couple-catch-daily-mine-card">
          <p class="row-head">
            <span class="who-chip">我今天说的 🙋</span>
            <span v-if="v.myToday" class="day-chip" data-testid="couple-catch-daily-mine-day">{{ v.myToday.day }}</span>
          </p>
          <p v-if="v.myToday" class="row-quote" data-testid="couple-catch-daily-mine">「{{ v.myToday.content }}」</p>
          <p v-else class="wait-line" data-testid="couple-catch-daily-mine-none">今天还没说 💬</p>
        </div>

        <div class="row-card is-partner" :class="{ 'is-lit': !!v.partnerToday }" data-testid="couple-catch-daily-partner-card">
          <p class="row-head">
            <span class="who-chip">💕 TA 今天说的</span>
            <span v-if="v.partnerToday" class="day-chip" data-testid="couple-catch-daily-partner-day">{{ v.partnerToday.day }}</span>
          </p>
          <p v-if="v.partnerToday" class="row-quote" data-testid="couple-catch-daily-partner">「{{ v.partnerToday.content }}」</p>
          <template v-else>
            <p v-if="v.dailyHint" class="hint-line" data-testid="couple-catch-daily-hint">{{ v.dailyHint }}</p>
            <p v-else class="wait-line" data-testid="couple-catch-daily-partner-none">TA 今天还没说，之前也没留过话 💬</p>
          </template>
        </div>

        <p class="section-head">🗂 我留过的（{{ v.myHistory.length }} 句，最近在前）</p>
        <p v-if="!v.myHistory.length" class="empty-line" data-testid="couple-catch-daily-none">还没留过话——一句「今天风很大」也算 💬</p>
        <div v-for="h in v.myHistory" :key="h.day" class="row-card" :data-testid="`couple-catch-daily-hist-${h.day}`">
          <p class="row-head">
            <span class="day-chip" :data-testid="`couple-catch-daily-hist-day-${h.day}`">{{ h.day }}</span>
            <span v-if="h.day === v.day" class="ack-chip" :data-testid="`couple-catch-daily-hist-today-${h.day}`">就是今天 ✍️</span>
          </p>
          <p class="row-quote" :data-testid="`couple-catch-daily-hist-text-${h.day}`">「{{ h.content }}」</p>
        </div>
      </template>
      <p v-else class="empty-line">今天还没开口……</p>
    </CoupleCollapsible>

    <!-- F389 聆听者年报：数字全部后端直查原始表，点按钮才懒读另一年 -->
    <CoupleCollapsible testid="couple-catch-year" :empty="!v">
      <template #title>👂 聆听者年报 <span class="sub">捕捉兑现数、避雷战绩、安全词与复盘、话头续完率、话题池准时率、一句话天数——一年下来，「听你说话」这件事有没有变认真</span></template>
      <template v-if="v">
        <div class="inline-form">
          <el-input v-model="yearInput" :maxlength="YEAR_LEN" placeholder="年份（yyyy，空=服务端当年）" data-testid="couple-catch-year-input" />
          <el-button size="small" type="primary" data-testid="couple-catch-year-load" @click="onYearLoad">查这一年 👂</el-button>
          <el-button v-if="yearView" size="small" plain data-testid="couple-catch-year-back" @click="onYearBack">回到{{ v.year.year }}年</el-button>
          <span v-if="!yearView" class="count-chip" data-testid="couple-catch-year-current">总览自带：{{ v.year.year }} 年</span>
        </div>

        <div class="year-card" data-testid="couple-catch-year-card">
          <p class="row-head">
            <span class="kind-chip" data-testid="couple-catch-year-num">{{ shownYear.year }} 年</span>
            <span class="title-chip" data-testid="couple-catch-year-title">称号「{{ shownYear.title }}」</span>
          </p>
          <div class="stat-grid">
            <p class="stat" data-testid="couple-catch-year-wishes">偷偷记的心愿 {{ shownYear.wishes }} 个</p>
            <p class="stat" data-testid="couple-catch-year-fulfilled">兑现并揭晓 {{ shownYear.fulfilled }} 个</p>
            <p class="stat" data-testid="couple-catch-year-mines">挂出的雷 {{ shownYear.mines }} 颗</p>
            <p class="stat" data-testid="couple-catch-year-acked">对方知晓 {{ shownYear.acked }} 颗</p>
            <p class="stat" data-testid="couple-catch-year-avoids">成功绕开 {{ shownYear.avoids }} 次</p>
            <p class="stat" data-testid="couple-catch-year-uses">安全词喊了 {{ shownYear.uses }} 次</p>
            <p class="stat" data-testid="couple-catch-year-reflected">补了复盘 {{ shownYear.reflected }} 次</p>
            <p class="stat" data-testid="couple-catch-year-sensitives">敏感日标了 {{ shownYear.sensitives }} 个</p>
            <p class="stat" data-testid="couple-catch-year-threads">话头存档 {{ shownYear.threads }} 个</p>
            <p class="stat" data-testid="couple-catch-year-finished">续完销档 {{ shownYear.finished }} 个</p>
            <p class="stat" data-testid="couple-catch-year-says">反话申报 {{ shownYear.says }} 条</p>
            <p class="stat" data-testid="couple-catch-year-talked">话题池聊完 {{ shownYear.talked }} 题</p>
            <p class="stat" data-testid="couple-catch-year-ontime">其中没超时 {{ shownYear.onTime }} 题</p>
            <p class="stat" data-testid="couple-catch-year-dailies">一句话留了 {{ shownYear.dailies }} 句</p>
          </div>
          <p class="summary-line" data-testid="couple-catch-year-summary">{{ shownYear.summary }}</p>
        </div>
      </template>
      <p v-else class="empty-line">年报要先进页签拿到总览才看得见……</p>
    </CoupleCollapsible>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { catchApi } from '@/api/couple'
import type {
  CoupleCatchProtocolMode,
  CoupleCatchSensitiveKind,
  CoupleCatchTopicStatus,
  CoupleCatchVO,
  CoupleCatchYearVO,
} from '@/types'
import CoupleCollapsible from './CoupleCollapsible.vue'

/**
 * 限长与上限一律抄自后端 CoupleCatchService 与 CoupleCatch* 实体常量（只用于输入框限长与前端闸门文案；
 * 归属判定、幂等、每日一次、揭晓与倒数一律留在后端，400/404 中文直透）：
 * CoupleCatchWish.CONTENT_MAX=60 SCENE_MAX=40 PER_OWNER_MAX=12 /
 * CoupleCatchMine.TOPIC_MAX=30 TRIP_MAX=60 SAFE_MAX=60 PER_USER_MAX=6 /
 * CoupleCatchSafeword.WORD_MAX=20 NOTE_MAX=60、CoupleCatchSafewordUse.REFLECT_MAX=60 /
 * CoupleCatchSensitive.KINDS=PERIOD|CHECK|MEMORY|OTHER CARE_MAX=60（DAYS 提前量由后端 daysBetween 算）/
 * CoupleCatchThread.TOPIC_MAX=40 PROGRESS_MAX=60 IN_FLIGHT_MAX=5 /
 * CoupleCatchSay.SAY_MAX=20 MEANS_MAX=60 PER_USER_MAX=10 / CoupleCatchProtocol.MODES 五个 NOTE_MAX=60 /
 * CoupleCatchTopic.TITLE_MAX=30 REFLECT_MAX=60 WEEK_MILLIS=7 天 / CoupleCatchDaily.CONTENT_MAX=40
 */
const WISH_CONTENT_MAX = 60
const WISH_SCENE_MAX = 40
const WISH_PER_OWNER_MAX = 12
const MINE_TOPIC_MAX = 30
const MINE_TRIP_MAX = 60
const MINE_SAFE_MAX = 60
const MINE_PER_USER_MAX = 6
const WORD_MAX = 20
const WORD_NOTE_MAX = 60
const USE_REFLECT_MAX = 60
const SENSITIVE_CARE_MAX = 60
const THREAD_TOPIC_MAX = 40
const THREAD_PROGRESS_MAX = 60
const THREAD_IN_FLIGHT_MAX = 5
const SAY_MAX = 20
const SAY_MEANS_MAX = 60
const SAY_PER_USER_MAX = 10
const PROTOCOL_NOTE_MAX = 60
const TOPIC_TITLE_MAX = 30
const TOPIC_REFLECT_MAX = 60
const DAILY_CONTENT_MAX = 40
const DAY_LEN = 10
const YEAR_LEN = 4
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/
const YEAR_RE = /^\d{4}$/

/** 敏感日类型选项（后端 CoupleCatchSensitive.KINDS；展示一律优先吃下发的 kindLabel，
 *  这份池子只用于「还没提交」的输入口。⚠️ 后端 kind 传空串会兜成 OTHER，前端要求先选一个，只可更严） */
const KIND_OPTIONS: { code: CoupleCatchSensitiveKind; label: string }[] = [
  { code: 'PERIOD', label: '周期第一天' },
  { code: 'CHECK', label: '考核日' },
  { code: 'MEMORY', label: '忌日/纪念日' },
  { code: 'OTHER', label: '其它' },
]
/** 聆听方式五选一（后端 CoupleCatchProtocol.MODES；白名单外含空串一律 400，中文标签由 Bank 下发） */
const MODE_OPTIONS: { code: CoupleCatchProtocolMode; label: string }[] = [
  { code: 'REASON', label: '跟我讲道理' },
  { code: 'RANT', label: '陪我一起骂' },
  { code: 'HUG', label: '抱抱，别说话' },
  { code: 'FOOD', label: '递吃的' },
  { code: 'SPACE', label: '先别理我' },
]
/** ⚠️ TopicVO 不下发 statusLabel（其它 VO 都有 label 字段，唯独这里没有），这份映射只是文案镜像，不参与判定 */
const TOPIC_STATUS_LABELS: Record<CoupleCatchTopicStatus, string> = {
  PENDING: '等人接单',
  TAKEN: '已接单，还没聊',
  TALKED: '聊完了',
}

/** 聆听者总览：GET /board 与 19 个 POST 写接口都返回整份它，整体替换即十卡刷新 */
const v = ref<CoupleCatchVO | null>(null)
/** F389 年报的懒读结果（查另一年用；null=看总览里服务端当年那一份，永不被写接口覆盖） */
const yearView = ref<CoupleCatchYearVO | null>(null)
const yearInput = ref('')

// ---- 草稿（全是「本人这一侧」的输入口） ----
const wishContent = ref('')
const wishDay = ref('')
const wishScene = ref('')
const mineTopic = ref('')
const mineTrip = ref('')
const mineSafe = ref('')
const wordText = ref('')
const wordNote = ref('')
const reflectDraft = ref<Record<string, string>>({})
const sensDay = ref('')
const sensKind = ref<CoupleCatchSensitiveKind | ''>('')
const sensCare = ref('')
const threadTopic = ref('')
const threadProgress = ref('')
const sayText = ref('')
const sayMeans = ref('')
const protocolMode = ref<CoupleCatchProtocolMode | ''>('')
const protocolNote = ref('')
const topicTitle = ref('')
const talkDraft = ref<Record<string, string>>({})
const dailyContent = ref('')

// ---- 派生（全部吃服务端下发的布尔/列表，不留本地「我今天按过没」的位） ----
const myMineCount = computed(() => (v.value ? v.value.mines.filter((m) => m.mine).length : 0))
const partnerMineCount = computed(() => (v.value ? v.value.mines.filter((m) => !m.mine).length : 0))
/**
 * 「我今天已经喊过一次暂停」——⚠️ CatchVO 没有下发 usedTodayMine 这类布尔位（SafewordVO 只有全历史
 * useCount），但后端的 uses 列表是按 day 倒序下发的（CoupleCatchSafewordUseMapper.findBySpace
 * orderByDesc(day)，LIST_USE=20 条），今天的行一定排在最前，所以这里吃**服务端那一行**的
 * mine+day 两位与 v.day 比对，不用本地计数器假装。后端仍按 uk(space,day,user) 判定，
 * 万一这一位判漏，400「今天已经记过一次暂停了…」照样兜住。
 */
const usedToday = computed(() => {
  const data = v.value
  if (!data) return false
  return data.uses.some((u) => u.mine && u.day === data.day)
})
const shownYear = computed<CoupleCatchYearVO>(() => yearView.value ?? v.value?.year ?? emptyYear())

/** 未建空间时总览没有 year，年报那一段落全零空态（不报错、不自造数字） */
function emptyYear(): CoupleCatchYearVO {
  return {
    year: 0, wishes: 0, fulfilled: 0, mines: 0, acked: 0, avoids: 0, uses: 0, reflected: 0,
    sensitives: 0, threads: 0, finished: 0, says: 0, talked: 0, onTime: 0, dailies: 0, title: '', summary: '',
  }
}

// ---- 小工具 ----
/** 倒数一律吃服务端 daysLeft（今天 0、已过为负），绝不自己算本地时钟 */
function countdownText(left: number): string {
  if (left === 0) return '就是今天 ⏰'
  if (left < 0) return `已经过去 ${Math.abs(left)} 天 ⏳`
  return `还有 ${left} 天 ⏳`
}

function statusLabel(status: CoupleCatchTopicStatus): string {
  return TOPIC_STATUS_LABELS[status] ?? status
}

function onError(e: unknown, fallback: string) {
  // 后端 400/404 的中文 message 直接透传（例如「这个话头是 TA 存的，让 TA 自己销档 ✂️」）
  ElMessage.error(e instanceof Error ? e.message : fallback)
}

function noData(): boolean {
  if (!v.value) {
    ElMessage.warning('还没拿到聆听者总览，重进一次「💌 寄给你」页签试试')
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

/**
 * 写接口统一返回整份 CatchVO：整体替换即十卡刷新。
 * 替换后只回填「本人这一侧」的输入口：我的安全词与希望、我这页聆听说明书、今天这一句、
 * 我自己那几次暂停的复盘草稿、我接单的题的感想草稿；
 * 一次性提交的（心愿/雷/敏感日/话头/反话/话题）清空重填；懒读的年报另一年不被覆盖。
 */
function refresh(data: CoupleCatchVO | null | undefined) {
  if (!data) return
  v.value = data

  wordText.value = data.myWord?.word ?? ''
  wordNote.value = data.myWord?.note ?? ''
  protocolMode.value = data.myProtocol?.mode ?? ''
  protocolNote.value = data.myProtocol?.note ?? ''
  dailyContent.value = data.myToday?.content ?? ''

  const nextReflect: Record<string, string> = {}
  for (const u of data.uses) {
    if (u.mine) nextReflect[u.id] = u.reflect
  }
  reflectDraft.value = nextReflect
  // 感想草稿只留「我接单且还在 TAKEN」的那几题；聊完的题离开闸门，草稿跟着清
  const nextTalk: Record<string, string> = {}
  for (const t of data.topics) {
    if (t.canTalk) nextTalk[t.id] = talkDraft.value[t.id] ?? ''
  }
  talkDraft.value = nextTalk

  wishContent.value = ''
  wishDay.value = ''
  wishScene.value = ''
  mineTopic.value = ''
  mineTrip.value = ''
  mineSafe.value = ''
  sensDay.value = ''
  sensKind.value = ''
  sensCare.value = ''
  threadTopic.value = ''
  threadProgress.value = ''
  sayText.value = ''
  sayMeans.value = ''
  topicTitle.value = ''
}

// ========== F380 暗中心愿本 ==========
async function onWish() {
  if (noData()) return
  const content = wishContent.value.trim()
  if (!content) {
    ElMessage.warning('先写一句 TA 想要什么 🤫')
    return
  }
  if (tooLong(content, WISH_CONTENT_MAX, '心愿')) return
  const sourceDay = wishDay.value.trim()
  if (sourceDay && !DAY_RE.test(sourceDay)) {
    ElMessage.warning('出处日子写成 yyyy-MM-dd 🤫')
    return
  }
  if (sourceDay && sourceDay > (v.value?.day ?? '')) {
    // 与后端同一条规则：出处只能是已经发生过的日子
    ElMessage.warning('出处日子不能是将来——TA 还没说过的话先别记 🤫')
    return
  }
  const scene = wishScene.value.trim()
  if (tooLong(scene, WISH_SCENE_MAX, '场合')) return
  // 格子余量吃服务端下发的 wishQuotaLeft（⚠️ 后端的减数含已揭晓那几条，所以「先兑现几条」并不能腾出格子）
  if ((v.value?.wishQuotaLeft ?? 0) <= 0) {
    ElMessage.warning(`TA 的心愿本已经记满 ${WISH_PER_OWNER_MAX} 条了 🤫`)
    return
  }
  if (v.value?.myWishes.some((w) => w.content === content)) {
    ElMessage.warning('这条已经悄悄记过了 🤫')
    return
  }
  try {
    refresh(await catchApi.catchWish(content, sourceDay, scene))
    ElMessage.success('已悄悄记下，这句话只有你看得见 🤫')
  } catch (e) {
    onError(e, '记下的心愿没成功，再试一次')
  }
}

async function onWishFulfill(id: string) {
  if (noData()) return
  try {
    refresh(await catchApi.catchWishFulfill(id))
    ElMessage.success('兑现登记好了，TA 那边已经揭晓 🎁')
  } catch (e) {
    onError(e, '兑现登记没成功，再试一次')
  }
}

// ========== F381 雷区探测器 ==========
async function onMine() {
  if (noData()) return
  const topic = mineTopic.value.trim()
  if (!topic) {
    ElMessage.warning('哪件事一碰就吵，先写个话题 💣')
    return
  }
  if (tooLong(topic, MINE_TOPIC_MAX, '话题')) return
  const trip = mineTrip.value.trim()
  const safeWay = mineSafe.value.trim()
  if (tooLong(trip, MINE_TRIP_MAX, '雷点')) return
  if (tooLong(safeWay, MINE_SAFE_MAX, '安全说法')) return
  if (v.value?.mines.some((m) => m.mine && m.topic === topic)) {
    ElMessage.warning('这颗雷已经挂过了 💣')
    return
  }
  if (myMineCount.value >= MINE_PER_USER_MAX) {
    ElMessage.warning(`一个人最多挂 ${MINE_PER_USER_MAX} 颗雷，别把日子过成扫雷 💣`)
    return
  }
  try {
    refresh(await catchApi.catchMine(topic, trip, safeWay))
    ElMessage.success('雷挂上了，TA 会收到提醒去盖知晓章 💣')
  } catch (e) {
    onError(e, '挂雷没成功，再试一次')
  }
}

async function onMineAck(id: string) {
  if (noData()) return
  try {
    refresh(await catchApi.catchMineAck(id))
    ElMessage.success('知晓章盖好了，踩雷的误会少一个 ✅')
  } catch (e) {
    onError(e, '知晓章没盖上，再试一次')
  }
}

async function onMineAvoid(id: string) {
  if (noData()) return
  const mine = v.value?.mines.find((m) => m.id === id)
  if (mine?.mine) {
    // 与后端同一条规则：避雷的人是对方，按钮本来也不该出现在自己那行
    ElMessage.warning('这颗雷是你自己挂的，绕开也要 TA 来记 🛡️')
    return
  }
  if (mine && !mine.acked) {
    ElMessage.warning('先盖「已知晓」，再记这次绕过去了 🛡️')
    return
  }
  try {
    refresh(await catchApi.catchMineAvoid(id))
    ElMessage.success('记一功，这次绕过去了 🛡️')
  } catch (e) {
    onError(e, '避雷记录没成功，再试一次')
  }
}

// ========== F382 安全词 ==========
async function onWord() {
  if (noData()) return
  const word = wordText.value.trim()
  if (!word) {
    ElMessage.warning('暂停词总得有个词，比如「冷静十分钟」 🛑')
    return
  }
  if (tooLong(word, WORD_MAX, '安全词')) return
  const note = wordNote.value.trim()
  if (tooLong(note, WORD_NOTE_MAX, '用了之后希望')) return
  try {
    refresh(await catchApi.catchSafeword(word, note))
    ElMessage.success('安全词定了，听到这个词就停，不追问 🛑')
  } catch (e) {
    onError(e, '安全词没约上，再试一次')
  }
}

async function onWordUse() {
  if (noData()) return
  // 归属闸门全吃服务端位：myWord 是 null 就是还没约词（后端也会 400「先约一个安全词」）
  if (!v.value?.myWord) {
    ElMessage.warning('先约一个安全词，才喊得出口 🛑')
    return
  }
  if (usedToday.value) {
    ElMessage.warning('今天已经记过一次暂停了，别把安全词用成口头禅 🛑')
    return
  }
  try {
    refresh(await catchApi.catchSafewordUse())
    ElMessage.success('这一轮先停十分钟，不算认输 🛑')
  } catch (e) {
    onError(e, '这次暂停没记上，再试一次')
  }
}

async function onReflect(id: string) {
  if (noData()) return
  const use = v.value?.uses.find((u) => u.id === id)
  if (use && !use.mine) {
    ElMessage.warning('那次是 TA 喊的停，复盘要 TA 自己写 📝')
    return
  }
  const reflect = (reflectDraft.value[id] ?? '').trim()
  if (!reflect) {
    ElMessage.warning('复盘写一句：当时卡在哪、后来怎么接着聊的 📝')
    return
  }
  if (tooLong(reflect, USE_REFLECT_MAX, '复盘')) return
  try {
    refresh(await catchApi.catchSafewordReflect(id, reflect))
    ElMessage.success('复盘补上了，能喊停也能接着聊 📝')
  } catch (e) {
    onError(e, '复盘没补上，再试一次')
  }
}

// ========== F383 敏感日历 ==========
async function onSensitive() {
  if (noData()) return
  const day = sensDay.value.trim()
  if (!day) {
    ElMessage.warning('哪一天要提前标出来，写个日子 📌')
    return
  }
  if (!DAY_RE.test(day)) {
    ElMessage.warning('敏感日写成 yyyy-MM-dd 📌')
    return
  }
  if (day < (v.value?.day ?? '')) {
    ElMessage.warning('敏感日要提前标，过去的日子就让它过去 📌')
    return
  }
  const kind = sensKind.value
  if (!kind) {
    // 后端对空 kind 兜成 OTHER，前端要求先选一个，免得标完才发现类型不对（只可更严）
    ElMessage.warning('先挑一个类型：周期第一天/考核日/忌日纪念日/其它 📌')
    return
  }
  const care = sensCare.value.trim()
  if (tooLong(care, SENSITIVE_CARE_MAX, '当天想被怎样对待')) return
  if (v.value?.sensitives.some((s) => !s.mineAsOwner && s.day === day && s.kind === kind)) {
    ElMessage.warning('这一天的这一类已经标过了 📌')
    return
  }
  try {
    refresh(await catchApi.catchSensitive(day, kind, care))
    ElMessage.success('已替 TA 标好，前一天这里会亮出提醒 📌')
  } catch (e) {
    onError(e, '敏感日没标上，再试一次')
  }
}

async function onSensitiveRemove(id: string) {
  if (noData()) return
  const s = v.value?.sensitives.find((x) => x.id === id)
  if (s?.mineAsOwner) {
    ElMessage.warning('这个敏感日是 TA 替你标的，要撤也让 TA 来撤 📌')
    return
  }
  try {
    refresh(await catchApi.catchSensitiveRemove(id))
    ElMessage.success('这一天从 TA 的日历上撤掉了 📌')
  } catch (e) {
    onError(e, '撤除没成功，再试一次')
  }
}

// ========== F384 说到哪了 ==========
async function onThread() {
  if (noData()) return
  const topic = threadTopic.value.trim()
  if (!topic) {
    ElMessage.warning('聊到哪儿的话题，先写一句 🧵')
    return
  }
  if (tooLong(topic, THREAD_TOPIC_MAX, '话题')) return
  const progress = threadProgress.value.trim()
  if (tooLong(progress, THREAD_PROGRESS_MAX, '说到哪了')) return
  if (v.value?.myThreads.some((t) => t.topic === topic)) {
    ElMessage.warning('这个话题已经在线轴上了 🧵')
    return
  }
  if ((v.value?.myThreads.length ?? 0) >= THREAD_IN_FLIGHT_MAX) {
    ElMessage.warning(`在途的话头最多 ${THREAD_IN_FLIGHT_MAX} 个，先聊完几个再存 🧵`)
    return
  }
  try {
    refresh(await catchApi.catchThread(topic, progress))
    ElMessage.success('话头卷上线轴了，回头接着说 🧵')
  } catch (e) {
    onError(e, '话头没存上，再试一次')
  }
}

async function onThreadDone(id: string) {
  if (noData()) return
  const t = v.value?.myThreads.find((x) => x.id === id)
  if (!t) {
    // partnerThreads 里的行不给销档钮；万一数据刚被整份替换过，这里也别静默
    ElMessage.warning('这个话头是 TA 存的，让 TA 自己销档 ✂️')
    return
  }
  try {
    refresh(await catchApi.catchThreadDone(id))
    ElMessage.success('这个话题说完了，线轴收起来 ✂️')
  } catch (e) {
    onError(e, '销档没成功，再试一次')
  }
}

// ========== F385 反话词典 ==========
async function onSay() {
  if (noData()) return
  const say = sayText.value.trim()
  if (!say) {
    ElMessage.warning('嘴上常说的那句先写下来 🔤')
    return
  }
  if (tooLong(say, SAY_MAX, '嘴上那句')) return
  const means = sayMeans.value.trim()
  if (!means) {
    ElMessage.warning('翻译结果得写，不然对方猜不到 🔤')
    return
  }
  if (tooLong(means, SAY_MEANS_MAX, '实际意思')) return
  if (v.value?.mySays.some((s) => s.say === say)) {
    ElMessage.warning('这条已经申报过了 🔤')
    return
  }
  if ((v.value?.mySays.length ?? 0) >= SAY_PER_USER_MAX) {
    ElMessage.warning(`反话词条最多 ${SAY_PER_USER_MAX} 条，先删几条 🔤`)
    return
  }
  try {
    refresh(await catchApi.catchSay(say, means))
    ElMessage.success('对照交出去了，TA 那一侧只能看 🔤')
  } catch (e) {
    onError(e, '词条没申报成，再试一次')
  }
}

async function onSayRemove(id: string) {
  if (noData()) return
  const s = v.value?.mySays.find((x) => x.id === id)
  if (!s) {
    ElMessage.warning('这份对照是 TA 本人申报的，对方不能改也不能删 🔤')
    return
  }
  try {
    refresh(await catchApi.catchSayRemove(id))
    ElMessage.success('这条反话撤掉了 🔤')
  } catch (e) {
    onError(e, '撤除没成功，再试一次')
  }
}

// ========== F386 聆听协议 ==========
async function onProtocol() {
  if (noData()) return
  const mode = protocolMode.value
  if (!mode) {
    ElMessage.warning('五种里选一个：讲道理/陪骂/抱抱不说话/递吃的/别理我 🎧')
    return
  }
  const note = protocolNote.value.trim()
  if (tooLong(note, PROTOCOL_NOTE_MAX, '补充说明')) return
  try {
    refresh(await catchApi.catchProtocol(mode, note))
    ElMessage.success('我这页说明书交好了，下次安慰照这一页来 🎧')
  } catch (e) {
    onError(e, '说明书没交成，再试一次')
  }
}

// ========== F387 话题许愿池 ==========
async function onTopic() {
  if (noData()) return
  const title = topicTitle.value.trim()
  if (!title) {
    ElMessage.warning('想多聊的话题写一个 💭')
    return
  }
  if (tooLong(title, TOPIC_TITLE_MAX, '话题')) return
  if (v.value?.topics.some((t) => t.mine && t.title === title)) {
    ElMessage.warning('这个话题已经许过了 💭')
    return
  }
  try {
    refresh(await catchApi.catchTopic(title))
    ElMessage.success('题投进池子了，等 TA 接单 💭')
  } catch (e) {
    onError(e, '话题没许成，再试一次')
  }
}

async function onTopicTake(id: string) {
  if (noData()) return
  const t = v.value?.topics.find((x) => x.id === id)
  if (t?.mine) {
    ElMessage.warning('自己许的题不能自己接 📥')
    return
  }
  if (t && !t.canTake) {
    ElMessage.warning('这一题已经不在等人接单的状态了 📥')
    return
  }
  try {
    refresh(await catchApi.catchTopicTake(id))
    ElMessage.success('接单成功，这周内找个时间好好聊 📥')
  } catch (e) {
    onError(e, '接单没成功，再试一次')
  }
}

async function onTopicTalk(id: string) {
  if (noData()) return
  const t = v.value?.topics.find((x) => x.id === id)
  if (t && !t.canTalk) {
    // 后端两条闸门：还没接单 / 单不是自己接的
    ElMessage.warning(t.status === 'PENDING' ? '这一题还没接单，聊不了 ✅' : '单是谁接的，谁来说「聊完了」 ✅')
    return
  }
  const reflect = (talkDraft.value[id] ?? '').trim()
  if (!reflect) {
    ElMessage.warning('聊完了总得留一句感想 ✅')
    return
  }
  if (tooLong(reflect, TOPIC_REFLECT_MAX, '感想')) return
  try {
    refresh(await catchApi.catchTopicTalk(id, reflect))
    ElMessage.success('这一题聊完了，感想也留下了 ✅')
  } catch (e) {
    onError(e, '聊完的记录没保存，再试一次')
  }
}

// ========== F388 今日一句话 ==========
async function onDaily() {
  if (noData()) return
  const content = dailyContent.value.trim()
  if (!content) {
    ElMessage.warning('今天想说的那句写下来 💬')
    return
  }
  if (tooLong(content, DAILY_CONTENT_MAX, '今日一句话')) return
  const mine = v.value?.myToday ?? null
  if (mine && mine.content === content) {
    // 每人每天一行 upsert：原样再交一次后端也只是改 updated_at，这里先挡下并给一句提示
    ElMessage.warning('这句话还没改，换个说法再交 💬')
    return
  }
  try {
    refresh(await catchApi.catchDaily(content))
    ElMessage.success(mine ? '今天这句已经改写 💬' : '今天这句已经留下，TA 已经收到了 💬')
  } catch (e) {
    onError(e, '这句话没发出去，再试一次')
  }
}

// ========== F389 聆听者年报（点按钮才懒读，首屏不自动拉） ==========
async function onYearLoad() {
  if (noData()) return
  const year = yearInput.value.trim()
  if (year && !YEAR_RE.test(year)) {
    ElMessage.warning('年份写成 yyyy 👂')
    return
  }
  try {
    yearView.value = await catchApi.catchYear(year)
    ElMessage.success(year ? `${year} 年的聆听年报到了 👂` : '聆听者年报（服务端当年）到了 👂')
  } catch (e) {
    onError(e, '年报没查到，再试一次')
  }
}

function onYearBack() {
  if (!yearView.value) {
    ElMessage.warning('现在看的就是总览自带的当年那份 👂')
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
  // 未建空间是 404「还没有建立情侣空间」——静默降级成十张空态卡，首屏不弹错误条
  const board = await safeLoad(() => catchApi.catchBoard(), null as CoupleCatchVO | null)
  if (board) refresh(board)
})
</script>

<style scoped>
/* 主色橄榄绿 #556b2f（这批讲的是「随身那本小本本」：布面是橄榄绿、铅笔字是灰的，
   既不甜（避开粉红与 #be185d 回音壁深玫瑰）、也不像报表（避开 #409eff 公司蓝 / #3f51b5 靛蓝 /
   #334155 岩壁青灰），跟同页签的明日邮局靛蓝、以及 care 页签的倾听紫 #9254de 都不同调；
   批次三十四开工前 grep src/components/couple/*.vue 的 --collapse-title-color，
   已用掉 #0284c7 #065f46 #0d9488 #16a34a #2c7a7b #334155 #3f51b5 #409eff #4c1d95 #9254de #a0522d
   #be185d #c0392b #d2691e #d93a3a；全局皮肤强调色与气泡渐变端点
   （#ec5f92 #3370ff #8b5cf6 #10b981 #f97316 #06b6d4 #7c3aed）一律不挪作分区主色；
   同族的 #6b8e23 / #4d5d2a / #0f766e 也一并避开（分别太靠 #d2691e 橙棕族与 #0d9488 剧幕青绿）。
   #556b2f 在 src/ 全仓（含 style.css 与 utils/settings.ts）grep 零命中。
   本组件不写 .title 规则，折叠卡标题色一律经 --collapse-title-color 级联给 CoupleCollapsible */
.couple-catch { display: flex; flex-direction: column; gap: 14px; --collapse-title-color: #556b2f; }
.sub { font-size: 12px; color: var(--im-muted, #909399); font-weight: normal; margin-left: 6px; }
.section-head { margin: 10px 0 4px; font-size: 13px; font-weight: bold; color: #556b2f; }
.inline-form { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 8px; }
.inline-form .el-input { flex: 1; min-width: 150px; }
.row-head { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; margin: 0; }
.row-card { margin: 7px 0; padding: 8px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid var(--im-border, #ebeef5); font-size: 13px; }
.row-card.is-partner { border-left-color: rgba(85, 107, 47, 0.35); }
.row-card.is-lit { border-left-color: #556b2f; }
.row-main { margin: 4px 0 0; color: var(--im-text, #303133); }
.row-quote { margin: 3px 0 0; color: var(--im-text, #303133); }
.row-meta { margin: 3px 0 0; display: flex; gap: 8px; flex-wrap: wrap; font-size: 12px; color: var(--im-muted, #909399); }
.empty-line { margin: 8px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.hint-line { margin: 6px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.wait-line { margin: 6px 0 0; font-size: 12px; color: #556b2f; }
.quota-line { margin: 6px 0 0; font-size: 12px; color: #556b2f; }
.lit-line { margin: 8px 0 0; padding: 8px 10px; border-radius: 8px; font-size: 13px; color: #556b2f; background: rgba(85, 107, 47, 0.1); }
.summary-line { margin: 8px 0 0; padding: 8px 10px; border-radius: 8px; font-size: 13px; color: var(--im-text, #303133); background: var(--im-bg, #fafafa); }
.year-card { margin: 8px 0 0; padding: 8px 10px; border-radius: 8px; background: rgba(85, 107, 47, 0.06); }
.stat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 6px; margin-top: 8px; }
.stat { margin: 0; padding: 7px 10px; border-radius: 8px; font-size: 13px; color: #556b2f; background: rgba(85, 107, 47, 0.1); }
.chip-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.day-pick { font-size: 12px; color: #556b2f; background: rgba(85, 107, 47, 0.08); border: 1px solid rgba(85, 107, 47, 0.2); border-radius: 12px; padding: 2px 10px; cursor: pointer; }
.day-pick.is-picked { background: #556b2f; color: #fff; border-color: #556b2f; }
.day-chip, .kind-chip, .topic-chip, .word-chip, .mode-chip, .status-chip, .count-chip, .left-chip, .ack-chip, .avoid-chip, .over-chip, .scene-chip, .title-chip { font-size: 11px; color: #556b2f; background: rgba(85, 107, 47, 0.1); padding: 1px 8px; border-radius: 10px; }
.ack-chip, .title-chip { background: rgba(85, 107, 47, 0.18); }
.over-chip { color: #c0392b; background: rgba(192, 57, 43, 0.1); }
.who-chip, .scene-chip { font-size: 11px; color: var(--im-muted, #909399); }
</style>

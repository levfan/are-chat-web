<template>
  <div class="couple-post" data-testid="couple-post">
    <!-- F290 五年后的新年卡：今年写，五年后的元旦自动寄出 -->
    <CoupleCollapsible testid="couple-post-oath" :empty="!hasOath">
      <template #title>💌 五年后的新年卡 <span class="sub">趁现在脑子清楚，写一句给五年后的我们——到期那天邮局自己送，不许偷看</span></template>
      <template v-if="box">
        <p class="day-chip" data-testid="couple-post-oath-day">今天 {{ box.day }} · 今年 {{ box.year }} 年那张归我写</p>

        <div class="post-form">
          <el-input
            v-model="oathContent"
            type="textarea"
            :rows="3"
            :maxlength="OATH_MAX"
            show-word-limit
            :disabled="currentSent"
            :placeholder="`给 ${plus5Year} 年的我们写一句（≤${OATH_MAX} 字，别剧透太多）`"
            data-testid="couple-post-oath-content"
          />
          <div class="inline-form">
            <el-button size="small" type="primary" data-testid="couple-post-oath-submit" @click="onOath">
              {{ oathSubmitLabel }}
            </el-button>
            <span v-if="currentOath" class="day-chip" :data-testid="`couple-post-oath-deliver-${currentOath.id}`">
              📮 {{ currentOath.deliverDay }} 寄出
            </span>
          </div>
        </div>

        <p v-if="currentSent" class="sent-line" data-testid="couple-post-oath-sent">
          这张已经寄出去了，收不进笔了 📮 想说的话等下一张卡吧
        </p>
        <p v-else-if="!currentOath" class="empty-line" data-testid="couple-post-oath-none">
          今年的卡还空着，写一句吧——五年后的我们会想知道今天在想什么 💌
        </p>

        <!-- TA 那一封：后端只在她/他也到期寄出后才下发正文 -->
        <div v-if="partnerOathLine" class="oath-card is-partner" data-testid="couple-post-oath-partner">
          <p class="oath-head">💕 TA {{ box.year }} 年写的那封，现在才给我们看</p>
          <p class="oath-text" data-testid="couple-post-oath-partner-text">{{ partnerOathLine }}</p>
        </div>
        <p v-else class="wait-line" data-testid="couple-post-oath-partner-wait">TA 那封还没到期，到期那天一起拆开 📬（提前看到就没意思了）</p>

        <div v-if="pastOaths.length" class="block">
          <p class="section-head">🗄️ 我写过的往年卡（{{ pastOaths.length }} 张）</p>
          <div v-for="o in pastOaths" :key="o.id" class="oath-card" :data-testid="`couple-post-oath-${o.id}`">
            <p class="oath-head">
              <b class="oath-year" :data-testid="`couple-post-oath-year-${o.id}`">{{ o.year }} 年</b>
              <span class="status-chip" :data-testid="`couple-post-oath-status-${o.id}`">
                {{ o.sent ? '已寄出 📮' : `封存中，${o.deliverDay} 见` }}
              </span>
            </p>
            <p class="oath-text" :data-testid="`couple-post-oath-text-${o.id}`">{{ o.content }}</p>
          </div>
        </div>
      </template>
      <p v-else class="empty-line">邮局还没开门…</p>
    </CoupleCollapsible>

    <!-- F291 人生大事 + F292 总得有一天拍卖 -->
    <CoupleCollapsible testid="couple-post-bucket" :empty="!hasBucketStuff">
      <template #title>🗳️ 人生大事与改天拍卖 <span class="sub">大事拆成小步慢慢走；那些「改天一定」挂上架，让 TA 认领成某一天</span></template>
      <template v-if="box">
        <p class="count-badge" data-testid="couple-post-bucket-count">
          🗳️ 在册 {{ box.buckets.length }} 件大事 · 🛒 架上 {{ box.somedays.length }} 单
        </p>

        <div class="inline-form">
          <el-input v-model="bName" :maxlength="BUCKET_NAME_MAX" placeholder="大事名（如「去看一次极光」）" data-testid="couple-post-bucket-name" />
          <el-input v-model="bTarget" maxlength="10" placeholder="目标日 yyyy-MM-dd（可不写）" style="max-width: 220px" data-testid="couple-post-bucket-target" />
          <el-input v-model="bNote" maxlength="200" placeholder="为什么想干这件（可不写）" data-testid="couple-post-bucket-note" />
          <el-button size="small" type="primary" data-testid="couple-post-bucket-submit" @click="onBucketAdd">立进人生清单 🗳️</el-button>
        </div>

        <p v-if="!box.buckets.length" class="empty-line">大事册子空着，先立一件「我们迟早要一起做」的 🗳️</p>
        <div v-for="b in box.buckets" :key="b.id" class="bucket-card" :data-testid="`couple-post-bucket-${b.id}`">
          <p class="bucket-head">
            <b class="bucket-name" :data-testid="`couple-post-bucket-name-text-${b.id}`">{{ b.name }}</b>
            <span class="who-chip" :data-testid="`couple-post-bucket-who-${b.id}`">{{ b.mine ? '我立的 🙋' : '💕 TA 立的' }}</span>
            <span v-if="b.targetDay" class="day-chip" :data-testid="`couple-post-bucket-target-${b.id}`">目标 {{ b.targetDay }}</span>
          </p>
          <p v-if="b.note" class="bucket-note" :data-testid="`couple-post-bucket-note-${b.id}`">{{ b.note }}</p>
          <div class="progress-line">
            <span class="status-chip" :data-testid="`couple-post-bucket-progress-${b.id}`">进度 {{ b.doneSteps }}/{{ b.totalSteps }} 步</span>
            <span class="progress-bar"><i :data-testid="`couple-post-bucket-bar-${b.id}`" :style="{ width: stepRatio(b) }" /></span>
          </div>

          <!-- 步骤明细：后端 BucketVO 目前只下发计数，一旦下发 steps（带 id）就自动出打勾钮 -->
          <div
            v-for="s in b.steps ?? []"
            :key="s.seq"
            class="step-row"
            :class="{ 'is-done': s.done }"
            :data-testid="`couple-post-step-${b.id}-${s.seq}`"
          >
            <span class="step-seq">{{ s.seq }}.</span>
            <span class="step-text" :data-testid="`couple-post-step-text-${b.id}-${s.seq}`">{{ s.text }}</span>
            <span v-if="s.done" class="lit-chip" :data-testid="`couple-post-step-stamped-${b.id}-${s.seq}`">
              走完 ✔ 章是 {{ s.doneBy || 'TA' }} 盖的
            </span>
            <el-button
              v-else-if="s.id"
              size="small"
              plain
              :data-testid="`couple-post-step-done-btn-${b.id}-${s.seq}`"
              @click="onStepDone(s)"
            >{{ b.mine ? '这步我做完了 ✔' : '帮 TA 补个进展章 🪜' }}</el-button>
          </div>

          <div class="inline-form">
            <el-input
              v-model="stepDraft[b.id]"
              :maxlength="STEP_MAX"
              :placeholder="b.totalSteps >= STEP_LIMIT ? `一件大事最多 ${STEP_LIMIT} 步，先走完再说` : '拆一小步（如「查好能看到极光的月份」）'"
              :data-testid="`couple-post-step-input-${b.id}`"
            />
            <el-button
              size="small"
              type="warning"
              plain
              :disabled="b.totalSteps >= STEP_LIMIT"
              :data-testid="`couple-post-step-add-${b.id}`"
              @click="onStepAdd(b)"
            >拆一步 🪜</el-button>
          </div>

          <div class="bucket-actions">
            <!-- 谁立的大事谁才有资格鸽 -->
            <el-button v-if="b.mine" size="small" link type="danger" :data-testid="`couple-post-bucket-giveup-${b.id}`" @click="onBucketAbandon(b)">
              这件先放下了 🍃
            </el-button>
            <span v-else class="lock-chip" :data-testid="`couple-post-bucket-lock-${b.id}`">TA 立的大事，让 TA 自己决定放不放 🔒</span>
          </div>
        </div>

        <!-- F292 改天拍卖 -->
        <div class="block">
          <p class="section-head">🛒 总得有一天（在架 ≤5 件，7 天没人接自动落灰）</p>
          <div class="inline-form">
            <el-input v-model="shelfThing" :maxlength="SOMEDAY_MAX" placeholder="那句「改天一定…」是什么" data-testid="couple-post-shelf-thing" />
            <el-button size="small" type="primary" data-testid="couple-post-shelf-submit" @click="onShelf">挂上货架 🛒</el-button>
          </div>
          <p v-if="!box.somedays.length" class="empty-line">货架空着，那些一拖再拖的事趁现在挂上去 🛒</p>
          <div
            v-for="s in box.somedays"
            :key="s.id"
            class="shelf-row"
            :class="`is-${s.status.toLowerCase()}`"
            :data-testid="`couple-post-shelf-${s.id}`"
          >
            <p class="shelf-head">
              <b class="shelf-thing" :data-testid="`couple-post-shelf-thing-${s.id}`">{{ s.thing }}</b>
              <span class="who-chip" :data-testid="`couple-post-shelf-who-${s.id}`">{{ s.mine ? '我上的架 🙋' : '💕 TA 上的架' }}</span>
              <span class="status-chip" :data-testid="`couple-post-shelf-status-${s.id}`">{{ shelfStatusText(s) }}</span>
            </p>
            <!-- TA 的架我才接得了，接了就得给个具体日子 -->
            <div v-if="s.status === 'SHELF' && !s.mine" class="inline-form">
              <el-input
                v-model="takeDay[s.id]"
                maxlength="10"
                placeholder="排期日 yyyy-MM-dd（要在今天之后）"
                style="max-width: 250px"
                :data-testid="`couple-post-take-day-${s.id}`"
              />
              <el-button size="small" type="success" plain :data-testid="`couple-post-take-btn-${s.id}`" @click="onShelfTake(s)">这单我接了 🙋</el-button>
            </div>
            <p v-else-if="s.status === 'SHELF'" class="wait-line" :data-testid="`couple-post-shelf-wait-${s.id}`">
              {{ s.daysLeft > 0 ? `在架还有 ${s.daysLeft} 天，等 TA 认领（自己的架不能自己接）🕗` : '今天是最后一天，没人接就落灰下架了 🕸️' }}
            </p>
            <div v-if="s.status === 'TAKEN'" class="inline-form">
              <span class="lit-chip" :data-testid="`couple-post-shelf-taken-${s.id}`">
                {{ s.takenBy || 'TA' }} 接了，排到 {{ s.scheduledDay }}（还有 {{ s.daysLeft }} 天）📅
              </span>
              <el-button size="small" type="primary" plain :data-testid="`couple-post-shelf-done-${s.id}`" @click="onShelfDone(s)">今天真做了 ✨</el-button>
            </div>
          </div>
        </div>
      </template>
      <p v-else class="empty-line">货架还在上货…</p>
    </CoupleCollapsible>

    <!-- F293 想象中的家 + F294 退休计划双写 -->
    <CoupleCollapsible testid="couple-post-home">
      <template #title>🏡 想象中的家与退休计划 <span class="sub">每年更新一版「以后住哪儿」，再各写一份 30 / 40 / 50 岁的我们</span></template>
      <template v-if="box">
        <div class="post-form">
          <div class="inline-form">
            <el-input v-model="hYear" maxlength="4" placeholder="版本年 yyyy（空=今年）" style="max-width: 180px" data-testid="couple-post-home-year" />
            <el-input v-model="hRooms" :maxlength="FIELD_MAX" placeholder="几个房间、怎么隔（≤100 字）" data-testid="couple-post-home-rooms" />
            <el-input v-model="hWindow" :maxlength="FIELD_MAX" placeholder="窗外看见什么（≤100 字）" data-testid="couple-post-home-window" />
          </div>
          <div class="inline-form">
            <el-input v-model="hSmell" :maxlength="FIELD_MAX" placeholder="屋里是什么味道（≤100 字）" data-testid="couple-post-home-smell" />
            <el-input v-model="hCorner" :maxlength="FIELD_MAX" placeholder="你最想要的那个角落（≤100 字）" data-testid="couple-post-home-corner" />
            <el-button size="small" type="primary" data-testid="couple-post-home-submit" @click="onHome">
              {{ editingHomeYear ? '更新这版图纸 📐' : '交这一版家 🏡' }}
            </el-button>
            <el-button v-if="editingHomeYear" size="small" link data-testid="couple-post-home-cancel" @click="resetHomeForm">不改了 ✕</el-button>
          </div>
          <p v-if="editingHomeYear" class="hint-line" data-testid="couple-post-home-editing">
            正在改写 {{ editingHomeYear }} 版——同一年保存就是换图纸，TA 那份不动 📐
          </p>
        </div>

        <p v-if="!box.homes.length" class="empty-line" data-testid="couple-post-home-none">图纸还是空的，先画个「有个大窗就够」的版本 🏡</p>
        <div v-for="h in homesSorted" :key="h.year" class="home-card" :data-testid="`couple-post-home-${h.year}`">
          <p class="home-head">
            <b class="home-year" :data-testid="`couple-post-home-year-text-${h.year}`">{{ h.year }} 版</b>
            <span class="who-chip">我画的 🙋</span>
            <span
              class="lit-chip"
              :class="{ 'is-wait': !h.partnerIn }"
              :data-testid="`couple-post-home-partner-${h.year}`"
            >{{ h.partnerIn ? '💕 TA 也交了这版，去对照' : 'TA 还没交这版 ⏳' }}</span>
            <el-button size="small" plain :data-testid="`couple-post-home-edit-${h.year}`" @click="startHomeEdit(h)">改这版 ✍️</el-button>
          </p>
          <p class="home-line" :data-testid="`couple-post-home-rooms-${h.year}`">🛏️ 房间：{{ h.rooms || '（没写）' }}</p>
          <p class="home-line" :data-testid="`couple-post-home-window-${h.year}`">🪟 窗外：{{ h.windowView || '（没写）' }}</p>
          <p class="home-line" :data-testid="`couple-post-home-smell-${h.year}`">🫧 味道：{{ h.smell || '（没写）' }}</p>
          <p class="home-line" :data-testid="`couple-post-home-corner-${h.year}`">🪑 角落：{{ h.corner || '（没写）' }}</p>
        </div>

        <!-- F294 退休计划三档 -->
        <div class="block">
          <p class="section-head">🛫 退休计划三档（各写各的，双写齐了才看分歧）</p>
          <div class="inline-form">
            <el-radio-group v-model="rBand" class="band-group" data-testid="couple-post-retire-band">
              <el-radio v-for="band in RETIRE_BANDS" :key="band" :value="band" :data-testid="`couple-post-retire-opt-${band}`">{{ band }} 岁</el-radio>
            </el-radio-group>
            <el-button size="small" type="primary" data-testid="couple-post-retire-submit" @click="onRetire">写 {{ rBand }} 岁这份 📝</el-button>
          </div>
          <el-input
            v-model="rText"
            type="textarea"
            :rows="2"
            :maxlength="RETIRE_MAX"
            show-word-limit
            placeholder="那时候我们在干嘛、住哪儿、每天几点起（≤200 字）"
            data-testid="couple-post-retire-text"
          />
          <div v-for="band in RETIRE_BANDS" :key="band" class="band-row" :class="{ 'is-both': bandVo(band)?.bothIn }" :data-testid="`couple-post-retire-band-${band}`">
            <p class="band-head">
              <b class="band-title">{{ band }} 岁的我们</b>
              <span v-if="bandVo(band)?.bothIn" class="lit-chip" :data-testid="`couple-post-retire-both-${band}`">双写完成，去对照分歧点 🛫</span>
              <span v-else class="wait-chip" :data-testid="`couple-post-retire-both-${band}`">还差一份没写 ⏳</span>
            </p>
            <p class="band-line is-mine" :data-testid="`couple-post-retire-mine-${band}`">🙋 我的版本：{{ bandVo(band)?.mine || '我还没写' }}</p>
            <p class="band-line is-partner" :data-testid="`couple-post-retire-partner-${band}`">💕 TA 的版本：{{ bandVo(band)?.partner || 'TA 还没写' }}</p>
          </div>
        </div>
      </template>
      <p v-else class="empty-line">图纸架上待用…</p>
    </CoupleCollapsible>

    <!-- F295 许愿井 + F296 胶囊接龙 + F297 解梦局 -->
    <CoupleCollapsible testid="couple-post-well">
      <template #title>🪣 许愿井 · 胶囊 · 解梦局 <span class="sub">每周一条井题各答各的，给未来的 TA 封一笔，梦交给对方一本正经地解</span></template>
      <template v-if="box">
        <p class="section-head">🪣 本周井题（{{ box.well.week }} 那周）</p>
        <p class="well-question" data-testid="couple-post-well-question">{{ box.well.question }}</p>
        <div class="inline-form">
          <el-input v-model="wellAnswer" :maxlength="WELL_ANSWER_MAX" placeholder="你的答案（≤140 字，本周可改写）" data-testid="couple-post-well-answer" />
          <el-button size="small" type="primary" data-testid="couple-post-well-submit" @click="onWell">投井下钱 🪣</el-button>
          <span v-if="box.well.bothIn" class="lit-chip" data-testid="couple-post-well-both">本周双答完成 💫</span>
        </div>
        <div class="well-pair">
          <p class="well-mine" data-testid="couple-post-well-mine">🙋 我的答案：{{ box.well.myAnswer || '还没投' }}</p>
          <p v-if="box.well.partnerAnswer" class="well-partner" data-testid="couple-post-well-partner">💕 TA 的答案：{{ box.well.partnerAnswer }}</p>
          <p v-else class="wait-line" data-testid="couple-post-well-partner-wait">TA 这周还没投井 ⏳ 井底空得很</p>
        </div>
        <div v-if="box.wellYear.length" class="block">
          <p class="section-head">🗄️ 本年井答存档（{{ box.wellYear.length }} 周）</p>
          <div v-for="w in box.wellYear" :key="w.week" class="hist-row" :data-testid="`couple-post-well-hist-${w.week}`">
            <span class="day-chip">{{ w.week }}</span>
            <span class="hist-q" :data-testid="`couple-post-well-hist-q-${w.week}`">{{ w.question }}</span>
            <span class="hist-a" :data-testid="`couple-post-well-hist-a-${w.week}`">🙋 {{ w.myAnswer || '（没答）' }}</span>
            <span class="hist-a is-partner" :data-testid="`couple-post-well-hist-partner-${w.week}`">💕 {{ w.partnerAnswer || '（TA 没答）' }}</span>
          </div>
        </div>

        <!-- F296 胶囊接龙 -->
        <div class="block">
          <p class="section-head">✉️ 胶囊接龙（给未来的 TA 留一笔，1 / 2 / 3 年后到点）</p>
          <el-input
            v-model="relayContent"
            type="textarea"
            :rows="2"
            :maxlength="RELAY_MAX"
            show-word-limit
            placeholder="写给几年后的 TA（≤500 字，到点才归 TA 拆）"
            data-testid="couple-post-relay-content"
          />
          <div class="inline-form">
            <el-radio-group v-model="relayYears" class="band-group" data-testid="couple-post-relay-years">
              <el-radio v-for="y in RELAY_YEARS" :key="y" :value="y" :data-testid="`couple-post-relay-year-${y}`">{{ y }} 年后</el-radio>
            </el-radio-group>
            <el-button
              size="small"
              type="primary"
              :disabled="myInflight >= RELAY_INFLIGHT_MAX"
              data-testid="couple-post-relay-seal"
              @click="onRelaySeal"
            >{{ myInflight >= RELAY_INFLIGHT_MAX ? '在途满了，等 TA 拆 ✉️' : '封存这笔 ✉️' }}</el-button>
            <span class="status-chip" data-testid="couple-post-relay-inflight">我名下在途 {{ myInflight }}/{{ RELAY_INFLIGHT_MAX }}</span>
          </div>
          <p v-if="!box.relays.length" class="empty-line">邮筒空着，还没有谁给未来留过话 ✉️</p>
          <div v-for="r in relaysSorted" :key="r.id" class="relay-row" :class="{ 'is-opened': r.status === 'OPENED' }" :data-testid="`couple-post-relay-${r.id}`">
            <span class="who-chip" :data-testid="`couple-post-relay-who-${r.id}`">{{ r.mine ? '我留的 🙋' : '💕 TA 留给我的' }}</span>
            <span class="day-chip" :data-testid="`couple-post-relay-day-${r.id}`">{{ r.openDay }} 开启</span>
            <span class="status-chip" :data-testid="`couple-post-relay-status-${r.id}`">{{ relayStatusText(r) }}</span>
            <el-button
              v-if="!r.mine && r.due"
              size="small"
              type="success"
              :data-testid="`couple-post-relay-open-${r.id}`"
              @click="onRelayOpen(r)"
            >到点了，拆开 ✉️</el-button>
            <span v-else-if="r.status === 'OPENED'" class="lit-chip" :data-testid="`couple-post-relay-opened-${r.id}`">已经拆开读过 📖</span>
            <span v-else-if="!r.mine" class="wait-chip" :data-testid="`couple-post-relay-wait-${r.id}`">还没到 {{ r.openDay }}，让它自己在邮筒里待着 ⏳</span>
            <span v-else class="lock-chip" :data-testid="`couple-post-relay-mine-${r.id}`">我写的那笔不归我拆，等 TA 先 🔒</span>
          </div>
        </div>

        <!-- F297 解梦局 -->
        <div class="block">
          <p class="section-head">🔮 解梦局（一晚投一案，请对方一本正经地解）</p>
          <div class="inline-form">
            <el-input v-model="dreamText" :maxlength="DREAM_MAX" placeholder="昨晚梦到什么（≤300 字）" data-testid="couple-post-dream-input" />
            <el-button size="small" type="primary" data-testid="couple-post-dream-submit" @click="onDreamAdd">投稿解梦 🔮</el-button>
          </div>
          <p v-if="!box.dreams.length" class="empty-line">还没有案子，今晚的梦记一句明天交上来 🔮</p>
          <div v-for="d in box.dreams" :key="d.id" class="dream-row" :class="dreamClass(d)" :data-testid="`couple-post-dream-${d.id}`">
            <p class="dream-head">
              <span class="day-chip" :data-testid="`couple-post-dream-day-${d.id}`">{{ d.day }}</span>
              <span class="who-chip" :data-testid="`couple-post-dream-who-${d.id}`">{{ d.mine ? '我做的梦 🙋' : '💕 TA 的梦，归我解' }}</span>
              <span class="verdict-chip" :data-testid="`couple-post-dream-verdict-${d.id}`">{{ dreamVerdictText(d) }}</span>
            </p>
            <p class="dream-text" :data-testid="`couple-post-dream-text-${d.id}`">{{ d.dream }}</p>
            <p v-if="d.reading" class="dream-reading" :data-testid="`couple-post-dream-reading-${d.id}`">
              🔮 {{ d.reading }}<span class="dream-by" :data-testid="`couple-post-dream-by-${d.id}`"> —— 解梦官 {{ d.readBy }}</span>
            </p>
            <!-- 解梦官只能审对方的案，且一案只能出一份解读 -->
            <div v-if="!d.mine && !d.readBy" class="inline-form">
              <el-input
                v-model="dreamRead[d.id]"
                :maxlength="DREAM_MAX"
                placeholder="官方解读一句（一本正经就行，≤300 字）"
                :data-testid="`couple-post-dream-read-input-${d.id}`"
              />
              <el-button size="small" type="warning" plain :data-testid="`couple-post-dream-read-btn-${d.id}`" @click="onDreamRead(d)">出这份解读 🔮</el-button>
            </div>
            <!-- 章只能做梦的人盖 -->
            <div v-else-if="d.mine && d.readBy && d.good === null" class="inline-form">
              <el-button size="small" type="success" plain :data-testid="`couple-post-dream-good-${d.id}`" @click="onDreamJudge(d, true)">解得灵 🏅</el-button>
              <el-button size="small" plain :data-testid="`couple-post-dream-bad-${d.id}`" @click="onDreamJudge(d, false)">胡说八道 😝</el-button>
            </div>
          </div>
        </div>
      </template>
      <p v-else class="empty-line">井水还没打上…</p>
    </CoupleCollapsible>

    <!-- F298 周年愿望台账 + F299 未来信用卡 -->
    <CoupleCollapsible testid="couple-post-ledger" :empty="!hasLedgerStuff">
      <template #title>🎋 愿望台账与未来信用卡 <span class="sub">每年立一个周年愿望，往年盖「圆了 / 鸽了」；立的旗按期兑现，额度就是这么攒的 💳</span></template>
      <template v-if="box">
        <div class="credit-card" data-testid="couple-post-credit-card">
          <p class="tier-line" data-testid="couple-post-credit-tier">{{ box.creditLine.tier }}</p>
          <div class="credit-bar"><i data-testid="couple-post-credit-bar" :style="{ width: `${creditRatio}%` }" /></div>
          <p class="credit-stats" data-testid="couple-post-credit-stats">
            我兑现 {{ box.creditLine.kept }} 面 · 逾期 {{ box.creditLine.broken }} 面 · 两人还立着 {{ box.creditLine.open }} 面
          </p>
        </div>

        <p class="section-head">🎋 周年愿望台账（{{ box.wishes.length }} 条）</p>
        <div class="inline-form">
          <el-input v-model="wYear" maxlength="4" placeholder="年份 yyyy（空=今年）" style="max-width: 180px" data-testid="couple-post-wish-year" />
          <el-input v-model="wText" :maxlength="WISH_MAX" placeholder="这一年的周年愿望（≤300 字）" data-testid="couple-post-wish-text" />
          <el-button size="small" type="primary" data-testid="couple-post-wish-submit" @click="onWish">
            {{ editingWishYear ? '改写这一年 🎋' : '立这一年的愿 🎋' }}
          </el-button>
          <el-button v-if="editingWishYear" size="small" link data-testid="couple-post-wish-cancel" @click="resetWishForm">不改了 ✕</el-button>
        </div>
        <p v-if="!box.wishes.length" class="empty-line">台账空白，先给今年立一个，明年的今天来盖章 🎋</p>
        <div v-for="w in wishesSorted" :key="w.id" class="wish-row" :class="wishClass(w)" :data-testid="`couple-post-wish-${w.id}`">
          <p class="wish-head">
            <b class="wish-year" :data-testid="`couple-post-wish-year-text-${w.id}`">{{ w.year }} 年</b>
            <span class="who-chip" :data-testid="`couple-post-wish-who-${w.id}`">{{ w.mine ? '我立的 🙋' : '💕 TA 立的（让 TA 自己盖）' }}</span>
            <span class="verdict-chip" :data-testid="`couple-post-wish-verdict-${w.id}`">{{ wishVerdictText(w) }}</span>
          </p>
          <p class="wish-text" :data-testid="`couple-post-wish-content-${w.id}`">{{ w.wish }}</p>
          <!-- 往年才盖得了章，今年的一律等明年 -->
          <div v-if="canVerdict(w)" class="inline-form">
            <el-button size="small" type="success" plain :data-testid="`couple-post-wish-kept-${w.id}`" @click="onWishVerdict(w, true)">圆上了 ⭕</el-button>
            <el-button size="small" plain :data-testid="`couple-post-wish-pigeon-${w.id}`" @click="onWishVerdict(w, false)">鸽了 🕊️</el-button>
          </div>
          <p v-else-if="w.mine && !w.verdict" class="wait-line" :data-testid="`couple-post-wish-wait-${w.id}`">
            {{ w.year >= box.year ? `${w.year} 年的还没到期，明年再来盖 ⏳` : '等 TA 也来盖 TA 那份 ⏳' }}
          </p>
          <el-button
            v-if="w.mine && !w.verdict && w.year >= box.year"
            size="small"
            link
            :data-testid="`couple-post-wish-edit-${w.id}`"
            @click="startWishEdit(w)"
          >改写这条 ✍️</el-button>
        </div>

        <!-- F299 未来信用卡 -->
        <div class="block">
          <p class="section-head">🏳️ 未来信用卡（现在立着的旗 {{ box.credits.length }} 面）</p>
          <div class="inline-form">
            <el-input v-model="promiseText" :maxlength="PROMISE_MAX" placeholder="承诺一件具体的事（≤80 字）" data-testid="couple-post-promise-text" />
            <el-input v-model="promiseDue" maxlength="10" placeholder="兑现期限 yyyy-MM-dd（须在未来）" style="max-width: 240px" data-testid="couple-post-promise-due" />
            <el-button size="small" type="primary" data-testid="couple-post-promise-submit" @click="onPromise">立这张旗 🏳️</el-button>
          </div>
          <p v-if="!box.credits.length" class="empty-line">一面旗都没立，额度全靠兑现攒出来 💳</p>
          <div v-for="c in creditsSorted" :key="c.id" class="credit-row" :data-testid="`couple-post-credit-${c.id}`">
            <b class="credit-promise" :data-testid="`couple-post-credit-promise-${c.id}`">{{ c.promise }}</b>
            <span class="who-chip" :data-testid="`couple-post-credit-who-${c.id}`">{{ c.mine ? '我立的 🙋' : '💕 TA 立的（等 TA 自己圆）' }}</span>
            <span class="day-chip" :data-testid="`couple-post-credit-due-${c.id}`">{{ c.dueDay }} 前</span>
            <span class="status-chip" :class="{ 'is-urgent': c.daysLeft <= 3 }" :data-testid="`couple-post-credit-days-${c.id}`">
              {{ c.daysLeft > 0 ? `还有 ${c.daysLeft} 天` : '今天就到期' }}
            </span>
            <el-button v-if="c.mine" size="small" type="success" :data-testid="`couple-post-credit-keep-${c.id}`" @click="onPromiseKeep(c)">我圆上了 📈</el-button>
            <span v-else class="wait-chip" :data-testid="`couple-post-credit-wait-${c.id}`">旗是谁立的谁销，等 TA ⏳</span>
          </div>
        </div>
      </template>
      <p v-else class="empty-line">台账还在装订…</p>
    </CoupleCollapsible>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { postApi } from '@/api/couple'
import type {
  CouplePostBucketVO,
  CouplePostCreditVO,
  CouplePostDreamVO,
  CouplePostHomeVO,
  CouplePostRelayVO,
  CouplePostSomedayVO,
  CouplePostStepVO,
  CouplePostVO,
  CouplePostWishVO,
} from '@/types'
import CoupleCollapsible from './CoupleCollapsible.vue'

/** 长度与额度常量抄自后端 CouplePostService / CouplePostBank，只用于输入框限长和「挡一手」的提示，判定仍在后端 */
const OATH_MAX = 500
const BUCKET_NAME_MAX = 40
const STEP_MAX = 80
const STEP_LIMIT = 12
const SOMEDAY_MAX = 80
const FIELD_MAX = 100
const RETIRE_MAX = 200
const WELL_ANSWER_MAX = 140
const RELAY_MAX = 500
const RELAY_INFLIGHT_MAX = 3
const DREAM_MAX = 300
const WISH_MAX = 300
const PROMISE_MAX = 80
const RETIRE_BANDS = ['30', '40', '50']
const RELAY_YEARS = [1, 2, 3]

/** 整份明日邮局总览（除 postBox 外全部写接口返回整份 PostVO，整体替换即五卡刷新） */
const box = ref<CouplePostVO | null>(null)

// ---- 草稿：F290 新年卡 ----
const oathContent = ref('')

// ---- 草稿：F291 大事与步骤 ----
const bName = ref('')
const bTarget = ref('')
const bNote = ref('')
const stepDraft = ref<Record<string, string>>({})

// ---- 草稿：F292 拍卖 ----
const shelfThing = ref('')
const takeDay = ref<Record<string, string>>({})

// ---- 草稿：F293 梦想家 ----
const hYear = ref('')
const hRooms = ref('')
const hWindow = ref('')
const hSmell = ref('')
const hCorner = ref('')
const editingHomeYear = ref('')

// ---- 草稿：F294 退休 ----
const rBand = ref('30')
const rText = ref('')

// ---- 草稿：F295 井 / F296 胶囊 / F297 梦 ----
const wellAnswer = ref('')
const relayContent = ref('')
const relayYears = ref(1)
const dreamText = ref('')
const dreamRead = ref<Record<string, string>>({})

// ---- 草稿：F298 愿望 / F299 旗 ----
const wYear = ref('')
const wText = ref('')
const editingWishYear = ref('')
const promiseText = ref('')
const promiseDue = ref('')

// ---- 派生 ----
/** 今年我那张卡（后端只下发我写的，一年一张） */
const currentOath = computed(() => box.value?.oaths.find((o) => o.year === box.value?.year) ?? null)
/** 已到期寄出的卡改不了笔（textarea 禁用，硬提交由后端 400 直透文案） */
const currentSent = computed(() => !!currentOath.value?.sent)
const oathSubmitLabel = computed(() => {
  if (currentSent.value) return '这张已寄出，试试也白费 📮'
  return currentOath.value ? '改写今年这张 🔁' : '写下今年这张 💌'
})
const plus5Year = computed(() => String(Number(box.value?.year ?? new Date().getFullYear()) + 5))
/** TA 那封的正文（后端只在 TA 那张也 SENT 时才给，空串=还没到） */
const partnerOathLine = computed(() => currentOath.value?.partnerContent ?? '')
const pastOaths = computed(() => (box.value?.oaths ?? []).filter((o) => o.year !== box.value?.year))
const hasOath = computed(() => (box.value?.oaths.length ?? 0) > 0 || !!box.value?.well.myAnswer)
const hasBucketStuff = computed(() => !!box.value && (box.value.buckets.length > 0 || box.value.somedays.length > 0))
const hasLedgerStuff = computed(
  () => !!box.value && (box.value.wishes.length > 0 || box.value.credits.length > 0 || box.value.creditLine.kept > 0 || box.value.creditLine.broken > 0),
)
/** 我名下还在途的胶囊笔数（后端 RELAY_INFLIGHT_MAX=3 封顶，这里只挡一手） */
const myInflight = computed(() => (box.value?.relays ?? []).filter((r) => r.mine && r.status === 'SEALED').length)
const homesSorted = computed(() => [...(box.value?.homes ?? [])].sort((a, b) => b.year.localeCompare(a.year)))
const relaysSorted = computed(() => [...(box.value?.relays ?? [])].sort((a, b) => a.openDay.localeCompare(b.openDay)))
const wishesSorted = computed(() => [...(box.value?.wishes ?? [])].sort((a, b) => b.year.localeCompare(a.year)))
const creditsSorted = computed(() => [...(box.value?.credits ?? [])].sort((a, b) => a.dueDay.localeCompare(b.dueDay)))
/** 额度条：兑现占（兑现+逾期）的比例，一笔都没结过就是 0% */
const creditRatio = computed(() => {
  const line = box.value?.creditLine
  if (!line) return 0
  const settled = line.kept + line.broken
  return settled > 0 ? Math.round((line.kept / settled) * 100) : 0
})

function bandVo(band: string) {
  return (box.value?.retires ?? []).find((r) => r.ageBand === band) ?? null
}

function stepRatio(b: CouplePostBucketVO): string {
  return b.totalSteps > 0 ? `${Math.round((b.doneSteps / b.totalSteps) * 100)}%` : '0%'
}

function shelfStatusText(s: CouplePostSomedayVO): string {
  if (s.status === 'SHELF') {
    return s.daysLeft > 0 ? `在架等认领 · 还剩 ${s.daysLeft} 天` : '在架到期边缘 · 今天没人接就落灰 🕸️'
  }
  if (s.status === 'TAKEN') return '已认领 · 排到某天'
  return s.status
}

function relayStatusText(r: CouplePostRelayVO): string {
  if (r.status === 'OPENED') return '已拆开 📖'
  return r.due ? '到点了，等 TA 拆 ✉️' : `封存中，${r.openDay} 见`
}

function dreamVerdictText(d: CouplePostDreamVO): string {
  if (d.good === 1) return '解得灵 🏅'
  if (d.good === 0) return '被驳回：胡说八道 😝'
  if (!d.readBy) return '等解梦官 🔮'
  return '等做梦的人盖章 ⏳'
}

function dreamClass(d: CouplePostDreamVO): string {
  if (d.good === 1) return 'is-good'
  if (d.good === 0) return 'is-bad'
  return d.readBy ? 'is-read' : 'is-open'
}

function wishVerdictText(w: CouplePostWishVO): string {
  if (w.verdict === 'KEPT') return '圆上了 ⭕'
  if (w.verdict === 'PIGEON') return '鸽了 🕊️ 但说出来也被记住了'
  return '还没盖章 ⏳'
}

function wishClass(w: CouplePostWishVO): string {
  if (w.verdict === 'KEPT') return 'is-kept'
  if (w.verdict === 'PIGEON') return 'is-pigeon'
  return 'is-open'
}

/** 往年才盖得了章（后端比年份，前端照 box.year 只控按钮可见性） */
function canVerdict(w: CouplePostWishVO): boolean {
  return w.mine && !w.verdict && !!box.value && w.year < box.value.year
}

function onError(e: unknown, fallback: string) {
  // 后端 400 的中文 message 直接透传（例如「这张已经寄出去了，收不进笔了」）
  ElMessage.error(e instanceof Error ? e.message : fallback)
}

/** 写接口统一返回整份 PostVO：整体替换即五卡刷新 */
function refresh(data: CouplePostVO | undefined | null) {
  if (data) {
    box.value = data
    oathContent.value = data.oaths.find((o) => o.year === data.year)?.content ?? ''
  }
}

// ---- F290 新年卡 ----
async function onOath() {
  const content = oathContent.value.trim()
  if (!content) {
    ElMessage.warning('给五年后总要留一句，哪怕就写「我们还在一起吗」💌')
    return
  }
  try {
    refresh(await postApi.postOath(content))
    ElMessage.success(`今年的话封进卡里了，${plus5Year.value} 年元旦见 💌`)
  } catch (e) {
    onError(e, '写新年卡失败')
  }
}

// ---- F291 人生大事 ----
async function onBucketAdd() {
  if (!bName.value.trim()) {
    ElMessage.warning('大事叫什么得写，「以后再说」不能当名字 🗳️')
    return
  }
  const name = bName.value.trim()
  try {
    refresh(await postApi.postBucketAdd(name, bTarget.value.trim(), bNote.value.trim()))
    bName.value = ''
    bTarget.value = ''
    bNote.value = ''
    ElMessage.success(`「${name}」进册了，剩下的交给一步一步 🗳️`)
  } catch (e) {
    onError(e, '立大事失败')
  }
}

async function onStepAdd(b: CouplePostBucketVO) {
  const text = (stepDraft.value[b.id] ?? '').trim()
  if (!text) {
    ElMessage.warning(`「${b.name}」这一步得写具体点，光想不动手不行 🪜`)
    return
  }
  try {
    refresh(await postApi.postStepAdd(b.id, text))
    stepDraft.value = { ...stepDraft.value, [b.id]: '' }
    ElMessage.success(`拆好一步，${b.name} 又近了一点 🪜`)
  } catch (e) {
    onError(e, '拆步失败')
  }
}

async function onStepDone(s: CouplePostStepVO) {
  if (!s.id) return
  try {
    refresh(await postApi.postStepDone(s.id))
    ElMessage.success('进展章盖上了，走路的人看得见 🪜')
  } catch (e) {
    onError(e, '打勾失败')
  }
}

async function onBucketAbandon(b: CouplePostBucketVO) {
  try {
    refresh(await postApi.postBucketAbandon(b.id))
    ElMessage.success(`「${b.name}」先放下了，不勉强也是本事 🍃`)
  } catch (e) {
    onError(e, '放弃失败')
  }
}

// ---- F292 改天拍卖 ----
async function onShelf() {
  const thing = shelfThing.value.trim()
  if (!thing) {
    ElMessage.warning('「改天」总得有个内容，空着算改天去发呆 🛒')
    return
  }
  try {
    refresh(await postApi.postShelf(thing))
    shelfThing.value = ''
    ElMessage.success(`「${thing}」挂上架了，7 天内等 TA 认领 🛒`)
  } catch (e) {
    onError(e, '上架失败')
  }
}

async function onShelfTake(s: CouplePostSomedayVO) {
  const day = (takeDay.value[s.id] ?? '').trim()
  if (!day) {
    ElMessage.warning('接了就得给日子，不然又是「改天」📅')
    return
  }
  try {
    refresh(await postApi.postShelfTake(s.id, day))
    takeDay.value = { ...takeDay.value, [s.id]: '' }
    ElMessage.success(`改天变成了 ${day}，说话算数 📅`)
  } catch (e) {
    onError(e, '认领失败')
  }
}

async function onShelfDone(s: CouplePostSomedayVO) {
  try {
    refresh(await postApi.postShelfDone(s.id))
    ElMessage.success(`「${s.thing}」今天真的做了，货架清出一格 ✨`)
  } catch (e) {
    onError(e, '销单失败')
  }
}

// ---- F293 想象中的家 ----
function resetHomeForm() {
  hYear.value = ''
  hRooms.value = ''
  hWindow.value = ''
  hSmell.value = ''
  hCorner.value = ''
  editingHomeYear.value = ''
}

async function onHome() {
  if (!hRooms.value.trim() && !hWindow.value.trim() && !hSmell.value.trim() && !hCorner.value.trim()) {
    ElMessage.warning('四个空至少填一个，图纸不能全白着 🏡')
    return
  }
  const year = hYear.value.trim()
  try {
    refresh(await postApi.postHome(year, hRooms.value.trim(), hWindow.value.trim(), hSmell.value.trim(), hCorner.value.trim()))
    resetHomeForm()
    ElMessage.success('这一版家交上去了，等 TA 那版来对照 🏡')
  } catch (e) {
    onError(e, '交图纸失败')
  }
}

function startHomeEdit(h: CouplePostHomeVO) {
  hYear.value = h.year
  hRooms.value = h.rooms
  hWindow.value = h.windowView
  hSmell.value = h.smell
  hCorner.value = h.corner
  editingHomeYear.value = h.year
}

// ---- F294 退休计划 ----
async function onRetire() {
  const text = rText.value.trim()
  if (!text) {
    ElMessage.warning(`${rBand.value} 岁那天怎么过，总要写一句 🛫`)
    return
  }
  try {
    refresh(await postApi.postRetire(rBand.value, text))
    rText.value = ''
    ElMessage.success(`${rBand.value} 岁那份写好了，等 TA 的那一份 🛫`)
  } catch (e) {
    onError(e, '写退休计划失败')
  }
}

// ---- F295 许愿井 ----
async function onWell() {
  const answer = wellAnswer.value.trim()
  if (!answer) {
    ElMessage.warning('井题不答，井里就只长回声 🪣')
    return
  }
  try {
    refresh(await postApi.postWell(answer))
    ElMessage.success('答案投进井里了，等 TA 的那一块 💫')
  } catch (e) {
    onError(e, '投井失败')
  }
}

// ---- F296 胶囊接龙 ----
async function onRelaySeal() {
  const content = relayContent.value.trim()
  if (!content) {
    ElMessage.warning('给未来的话总要写一句，空白信封寄不出去 ✉️')
    return
  }
  try {
    refresh(await postApi.postRelay(content, relayYears.value))
    relayContent.value = ''
    ElMessage.success(`封好了，${relayYears.value} 年后出现在 TA 的邮筒里 ✉️`)
  } catch (e) {
    onError(e, '封存失败')
  }
}

async function onRelayOpen(r: CouplePostRelayVO) {
  try {
    refresh(await postApi.postRelayOpen(r.id))
    ElMessage.success('到期了，这封 TA 写的未来信拆开了 ✉️')
  } catch (e) {
    onError(e, '拆封失败')
  }
}

// ---- F297 解梦局 ----
async function onDreamAdd() {
  const dream = dreamText.value.trim()
  if (!dream) {
    ElMessage.warning('梦到什么写一句，解梦局才能排期 🔮')
    return
  }
  try {
    refresh(await postApi.postDream(dream))
    dreamText.value = ''
    ElMessage.success('案子递上去了，等官方一本正经解读 🔮')
  } catch (e) {
    onError(e, '投稿失败')
  }
}

async function onDreamRead(d: CouplePostDreamVO) {
  const reading = (dreamRead.value[d.id] ?? '').trim()
  if (!reading) {
    ElMessage.warning('解读要写一句，哪怕严肃胡说也行 🔮')
    return
  }
  try {
    refresh(await postApi.postDreamRead(d.id, reading))
    dreamRead.value = { ...dreamRead.value, [d.id]: '' }
    ElMessage.success('解读交出去了，等 TA 判「灵不灵」🔮')
  } catch (e) {
    onError(e, '出解读失败')
  }
}

async function onDreamJudge(d: CouplePostDreamVO, good: boolean) {
  try {
    refresh(await postApi.postDreamJudge(d.id, good))
    ElMessage.success(good ? '盖章：解得灵，解梦官立功 🏅' : '盖章：胡说八道，重审等下一晚 😝')
  } catch (e) {
    onError(e, '盖章失败')
  }
}

// ---- F298 周年愿望 ----
function resetWishForm() {
  wYear.value = ''
  wText.value = ''
  editingWishYear.value = ''
}

async function onWish() {
  const wish = wText.value.trim()
  if (!wish) {
    ElMessage.warning('愿望要写出来，写不出来那叫随便 🎋')
    return
  }
  const year = wYear.value.trim()
  try {
    refresh(await postApi.postWish(year, wish))
    resetWishForm()
    ElMessage.success(`${year || box.value?.year || '今年'} 的周年愿望立好了，明年此刻来盖章 🎋`)
  } catch (e) {
    onError(e, '立愿望失败')
  }
}

function startWishEdit(w: CouplePostWishVO) {
  wYear.value = w.year
  wText.value = w.wish
  editingWishYear.value = w.year
}

async function onWishVerdict(w: CouplePostWishVO, kept: boolean) {
  try {
    refresh(await postApi.postWishVerdict(w.id, kept))
    ElMessage.success(kept ? `${w.year} 年的愿望圆上了，⭕ 记账！` : `${w.year} 年的愿望鸽了 🕊️ 但说出来也被记住了`)
  } catch (e) {
    onError(e, '盖章失败')
  }
}

// ---- F299 未来信用卡 ----
async function onPromise() {
  const promise = promiseText.value.trim()
  const dueDay = promiseDue.value.trim()
  if (!promise) {
    ElMessage.warning('承诺总要写一句具体的事，「对你更好」太抽象了 🏳️')
    return
  }
  if (!dueDay) {
    ElMessage.warning('期限得写，不然这面旗永远不倒 🏳️')
    return
  }
  try {
    refresh(await postApi.postPromise(promise, dueDay))
    promiseText.value = ''
    promiseDue.value = ''
    ElMessage.success(`旗立好了，${dueDay} 前兑现 🏳️`)
  } catch (e) {
    onError(e, '立旗失败')
  }
}

async function onPromiseKeep(c: CouplePostCreditVO) {
  try {
    refresh(await postApi.postPromiseKeep(c.id))
    ElMessage.success('「' + c.promise + '」圆上了，未来信用卡提额 📈')
  } catch (e) {
    onError(e, '兑现失败')
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
  const data = await safeLoad(postApi.postBox, null)
  box.value = data
  if (data) {
    oathContent.value = data.oaths.find((o) => o.year === data.year)?.content ?? ''
  }
})
</script>

<style scoped>
/* 主色靛蓝 #3f51b5（明日邮局的「寄给未来」色调，区别于粉红主色 / #409eff 公司蓝 / #d2691e 工坊橙棕 /
   #d93a3a 中国红 / #9254de 倾听紫 / #c0392b 庆典金红 / #2c7a7b 考据墨青）
   折叠卡标题色经 --collapse-title-color 级联给 CoupleCollapsible，故本组件不写 .title 规则 */
.couple-post { display: flex; flex-direction: column; gap: 14px; --collapse-title-color: #3f51b5; }
.sub { font-size: 12px; color: var(--im-muted, #909399); font-weight: normal; margin-left: 6px; }
.section-head { margin: 10px 0 4px; font-size: 13px; font-weight: bold; color: #3f51b5; }
.block { margin-top: 12px; padding-top: 8px; border-top: 1px dashed var(--im-border, #ebeef5); }
.inline-form { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 8px; }
.inline-form .el-input { flex: 1; min-width: 150px; }
.post-form { display: flex; flex-direction: column; margin-bottom: 6px; padding: 8px 10px; border-radius: 8px; background: rgba(63, 81, 181, 0.06); }
.empty-line { margin: 8px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.hint-line { margin: 6px 0 0; font-size: 12px; color: #3f51b5; }
.sent-line { margin: 8px 0 0; font-size: 12px; color: #e6a23c; }
.wait-line { margin: 6px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.wait-chip { font-size: 12px; color: #b8860b; }
.who-chip { font-size: 11px; color: var(--im-muted, #909399); }
.lock-chip { font-size: 11px; color: var(--im-muted, #909399); }
.day-chip, .status-chip { font-size: 11px; color: #3f51b5; background: rgba(63, 81, 181, 0.12); padding: 1px 8px; border-radius: 10px; }
.status-chip.is-urgent { color: #c0392b; background: rgba(192, 57, 43, 0.12); }
.lit-chip { font-size: 12px; color: #67c23a; background: rgba(103, 194, 58, 0.1); padding: 2px 8px; border-radius: 6px; }
.lit-chip.is-wait { color: var(--im-muted, #909399); background: var(--im-bg, #fafafa); }
.count-badge { display: inline-block; margin: 0 0 4px; font-size: 13px; font-weight: bold; color: #3f51b5; background: rgba(63, 81, 181, 0.1); padding: 3px 10px; border-radius: 12px; }
/* F290 新年卡 */
.oath-card { margin: 8px 0; padding: 9px 11px; border-radius: 8px; border-left: 3px solid #3f51b5; background: var(--im-bg, #fafafa); }
.oath-card.is-partner { border-left-color: #9254de; }
.oath-head { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; margin: 0; font-size: 13px; }
.oath-year { color: #3f51b5; }
.oath-text { margin: 4px 0 0; font-size: 13px; color: var(--im-text, #303133); white-space: pre-wrap; }
/* F291 大事 */
.bucket-card { margin: 9px 0; padding: 9px 11px; border-radius: 8px; border-left: 3px solid #3f51b5; background: var(--im-bg, #fafafa); }
.bucket-head { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; margin: 0; font-size: 14px; }
.bucket-name { color: #3f51b5; }
.bucket-note { margin: 3px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.progress-line { display: flex; gap: 8px; align-items: center; margin-top: 6px; }
.progress-bar { flex: 1; max-width: 220px; height: 6px; border-radius: 4px; background: rgba(63, 81, 181, 0.15); overflow: hidden; }
.progress-bar i { display: block; height: 100%; background: #3f51b5; }
.step-row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin: 5px 0 0; font-size: 13px; }
.step-row.is-done .step-text { color: var(--im-muted, #909399); text-decoration: line-through; }
.step-seq { color: #3f51b5; }
.step-text { color: var(--im-text, #303133); }
.bucket-actions { display: flex; gap: 8px; align-items: center; margin-top: 6px; }
/* F292 拍卖 */
.shelf-row { margin: 6px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid #3f51b5; font-size: 13px; }
.shelf-row.is-taken { border-left-color: #67c23a; }
.shelf-head { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; margin: 0; }
.shelf-thing { color: var(--im-text, #303133); }
/* F293 梦想家 */
.home-card { margin: 8px 0; padding: 8px 11px; border-radius: 8px; border: 1px solid var(--im-border, #ebeef5); font-size: 13px; }
.home-head { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; margin: 0; }
.home-year { color: #3f51b5; font-size: 14px; }
.home-line { margin: 3px 0 0; font-size: 12px; color: var(--im-text, #303133); }
/* F294 退休三档 */
.band-group { display: flex; gap: 12px; flex-wrap: wrap; }
.band-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); font-size: 12px; }
.band-row.is-both { border-left: 3px solid #3f51b5; }
.band-head { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; margin: 0; }
.band-title { font-size: 13px; color: #3f51b5; }
.band-line { margin: 3px 0 0; color: var(--im-text, #303133); }
.band-line.is-partner { color: var(--im-muted, #909399); }
/* F295 许愿井 */
.well-question { margin: 4px 0; padding: 7px 10px; border-radius: 8px; font-size: 14px; color: #3f51b5; background: rgba(63, 81, 181, 0.08); }
.well-pair { margin-top: 6px; }
.well-mine { margin: 3px 0 0; font-size: 13px; color: var(--im-text, #303133); }
.well-partner { margin: 3px 0 0; font-size: 13px; color: #3f51b5; }
.hist-row { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; margin: 4px 0; font-size: 12px; }
.hist-q { color: var(--im-text, #303133); }
.hist-a { color: var(--im-muted, #909399); }
.hist-a.is-partner { color: #3f51b5; }
/* F296 胶囊 */
.relay-row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin: 5px 0; padding: 6px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); font-size: 12px; }
.relay-row.is-opened { border-left: 3px solid #3f51b5; }
/* F297 解梦局 */
.dream-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid #3f51b5; font-size: 13px; }
.dream-row.is-good { border-left-color: #67c23a; }
.dream-row.is-bad { border-left-color: #e6a23c; opacity: 0.9; }
.dream-head { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; margin: 0; }
.dream-text { margin: 4px 0 0; color: var(--im-text, #303133); white-space: pre-wrap; }
.dream-reading { margin: 4px 0 0; font-size: 12px; color: #3f51b5; }
.dream-by { color: var(--im-muted, #909399); }
.verdict-chip { font-size: 11px; color: var(--im-muted, #909399); background: rgba(63, 81, 181, 0.08); padding: 1px 8px; border-radius: 10px; }
/* F298 愿望台账 */
.wish-row { margin: 6px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid #3f51b5; font-size: 13px; }
.wish-row.is-kept { border-left-color: #67c23a; }
.wish-row.is-pigeon { border-left-color: var(--im-muted, #909399); opacity: 0.85; }
.wish-head { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; margin: 0; }
.wish-year { color: #3f51b5; }
.wish-text { margin: 4px 0 0; color: var(--im-text, #303133); white-space: pre-wrap; }
/* F299 未来信用卡 */
.credit-card { padding: 8px 11px; border-radius: 8px; background: rgba(63, 81, 181, 0.08); }
.tier-line { margin: 0; font-size: 14px; font-weight: bold; color: #3f51b5; }
.credit-bar { margin: 6px 0; height: 8px; border-radius: 5px; background: rgba(63, 81, 181, 0.15); overflow: hidden; }
.credit-bar i { display: block; height: 100%; background: #3f51b5; transition: width 0.3s; }
.credit-stats { margin: 0; font-size: 12px; color: var(--im-muted, #909399); }
.credit-row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin: 5px 0; padding: 6px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); font-size: 13px; }
.credit-promise { color: var(--im-text, #303133); }
</style>

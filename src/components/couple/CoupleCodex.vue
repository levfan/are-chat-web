<template>
  <div class="couple-codex" data-testid="couple-codex">
    <!-- F280 词条书架：两个人共编一部只有彼此看得懂的百科 -->
    <CoupleCollapsible testid="couple-cx-codex">
      <template #title>📚 词条书架 <span class="sub">在一起久了自然长出的词，词典里没有——那就自己收进百科</span></template>
      <template v-if="ov">
        <p class="count-badge" data-testid="couple-cx-entry-count">📚 百科已收录 {{ ov.entryCount }} 条词条</p>

        <div class="codex-form">
          <div class="inline-form">
            <el-input v-model="eTerm" maxlength="40" placeholder="词条名（≤40 字，如「二次晚安」）" data-testid="couple-cx-entry-term" />
            <el-input v-model="eOrigin" maxlength="60" placeholder="出处（可不写，如「2025 年那趟夜班」）" data-testid="couple-cx-entry-origin" />
          </div>
          <el-input
            v-model="eDefinition"
            type="textarea"
            :rows="2"
            maxlength="200"
            show-word-limit
            placeholder="释义：只有你们俩懂的说法（≤200 字）"
            data-testid="couple-cx-entry-definition"
          />
          <div class="inline-form">
            <el-input v-model="eUsage" maxlength="120" placeholder="用法例句（可不写，如「今天累坏了，要二次晚安」）" data-testid="couple-cx-entry-usage" />
            <el-button size="small" type="primary" data-testid="couple-cx-entry-submit" @click="onEntrySave">
              {{ editingEntry ? '修订这条词条 🔁' : '收进百科 📚' }}
            </el-button>
            <el-button v-if="editingEntry" size="small" link data-testid="couple-cx-entry-cancel" @click="resetEntryForm">
              不改了 ✕
            </el-button>
          </div>
          <p v-if="editingEntry" class="hint-line" data-testid="couple-cx-entry-editing">
            正在修订「{{ editingEntry }}」——同名保存就是改写，修订人会记成你 ✍️
          </p>
        </div>

        <p v-if="!ov.entries.length" class="empty-line">书架还空着，先立第一条词吧 📚</p>
        <div v-for="e in ov.entries" :key="e.id" class="entry-card" :data-testid="`couple-cx-entry-${e.id}`">
          <p class="entry-head">
            <b class="entry-term" :data-testid="`couple-cx-entry-term-text-${e.id}`">{{ e.term }}</b>
            <span class="who-chip">{{ e.mine ? '我首建 🙋' : '💕 TA 首建' }}</span>
          </p>
          <p class="entry-def" :data-testid="`couple-cx-entry-def-${e.id}`">{{ e.definition }}</p>
          <p v-if="e.origin" class="entry-note" :data-testid="`couple-cx-entry-origin-${e.id}`">📍 出处：{{ e.origin }}</p>
          <p v-if="e.usageNote" class="entry-note" :data-testid="`couple-cx-entry-usage-${e.id}`">💬 用法：{{ e.usageNote }}</p>
          <p v-if="e.updatedBy" class="entry-note" :data-testid="`couple-cx-entry-by-${e.id}`">✍️ 由 {{ e.updatedBy }} 修订过</p>
          <div class="entry-actions">
            <el-button size="small" plain :data-testid="`couple-cx-entry-edit-${e.id}`" @click="startEntryEdit(e)">修订这条 ✍️</el-button>
            <!-- 只有首建人能撤，TA 首建的不给删除钮 -->
            <el-button
              v-if="e.mine"
              size="small"
              link
              type="danger"
              :data-testid="`couple-cx-entry-del-${e.id}`"
              @click="onEntryRemove(e)"
            >撤掉词条 🗑️</el-button>
            <span v-else class="lock-chip" :data-testid="`couple-cx-entry-lock-${e.id}`">TA 立的词，让 TA 自己撤 🔒</span>
          </div>
        </div>
      </template>
      <p v-else class="empty-line">百科还在进货中…</p>
    </CoupleCollapsible>

    <!-- F281 默契综艺：同一部百科，考一考两个人的记忆是不是同一个版本 -->
    <CoupleCollapsible testid="couple-cx-quiz" :empty="!hasQuiz">
      <template #title>🎪 默契综艺 <span class="sub">词条当题面，各写各的释义，交齐了才对答案</span></template>
      <template v-if="ov">
        <p class="day-chip" data-testid="couple-cx-quiz-day">今日档期 {{ ov.day }} · 词条 {{ ov.entryCount }} 条</p>

        <!-- 还没开场：谁都能开一期，词条不足 5 条时后端不给开场 -->
        <div v-if="!ov.todayQuiz" class="inline-form">
          <el-button
            size="small"
            type="primary"
            data-testid="couple-cx-quiz-start"
            :disabled="ov.entryCount < QUIZ_MIN"
            @click="onQuizStart"
          >开一期默契考 🎪</el-button>
          <span v-if="ov.entryCount < QUIZ_MIN" class="wait-chip" data-testid="couple-cx-quiz-need">
            词条还不到 {{ QUIZ_MIN }} 条，先去楼上攒几条 📚
          </span>
        </div>

        <template v-else>
          <p class="section-head">📝 本期（{{ ov.todayQuiz.day }}）的 {{ ov.todayQuiz.terms.length }} 道填空</p>
          <div
            v-for="(t, i) in ov.todayQuiz.terms"
            :key="`${t}-${i}`"
            class="quiz-row"
            :data-testid="`couple-cx-quiz-row-${i}`"
          >
            <span class="quiz-term" :data-testid="`couple-cx-quiz-term-${i}`">{{ i + 1 }}. 「{{ t }}」</span>
            <el-input
              v-if="!quizAnswered"
              v-model="quizAnswers[i]"
              maxlength="40"
              placeholder="你眼里这个词是什么意思（≤40 字）"
              :data-testid="`couple-cx-quiz-answer-${i}`"
            />
            <template v-else>
              <b class="quiz-mine" :data-testid="`couple-cx-quiz-mine-${i}`">🙋 {{ myAns[i] || '（没写）' }}</b>
              <template v-if="ov.todayQuiz.bothIn">
                <span class="quiz-partner" :data-testid="`couple-cx-quiz-partner-${i}`">💕 {{ partnerAns[i] || '（没写）' }}</span>
                <span
                  class="hit-chip"
                  :class="{ 'is-hit': ansHit(i) }"
                  :data-testid="`couple-cx-quiz-hit-${i}`"
                >{{ ansHit(i) ? '同答 ✅' : '擦肩 💨' }}</span>
              </template>
            </template>
          </div>

          <div v-if="!quizAnswered" class="inline-form">
            <el-button size="small" type="primary" data-testid="couple-cx-quiz-submit" @click="onQuizAnswer">交卷 📤</el-button>
            <span v-if="ov.todayQuiz.partnerAnswer" class="lit-chip" data-testid="couple-cx-quiz-partner-in">TA 已交卷，就差你 ✍️</span>
            <span v-else class="wait-chip" data-testid="couple-cx-quiz-partner-in">TA 还没交，交完也看不到你的 😝</span>
          </div>
          <div v-else class="inline-form">
            <span v-if="ov.todayQuiz.bothIn" class="match-badge" data-testid="couple-cx-quiz-match">默契 {{ ov.todayQuiz.match }}/{{ ov.todayQuiz.terms.length }} 💞</span>
            <span v-else class="wait-chip" data-testid="couple-cx-quiz-wait">你交卷了，等 TA 对答案 ⏳</span>
          </div>
          <p v-if="ov.todayQuiz.bothIn" class="comment-line" data-testid="couple-cx-quiz-comment">{{ ov.todayQuiz.comment }}</p>
        </template>

        <div class="block">
          <p class="section-head">🗄️ 历届（最近 {{ HISTORY_MAX }} 期）</p>
          <p v-if="!ov.history.length" class="empty-line" data-testid="couple-cx-quiz-history">还没有往届，今天这期就是第一期 🎪</p>
          <div v-else class="hist-list">
            <div v-for="(h, i) in ov.history" :key="h.day" class="hist-row" :data-testid="`couple-cx-quiz-hist-${i}`">
              <span class="day-chip" :data-testid="`couple-cx-quiz-hist-day-${i}`">{{ h.day }}</span>
              <span v-if="h.bothIn" class="match-badge" :data-testid="`couple-cx-quiz-hist-score-${i}`">默契 {{ h.match }}/{{ h.terms.length }}</span>
              <span v-else class="wait-chip" :data-testid="`couple-cx-quiz-hist-score-${i}`">没交齐 ⏳</span>
              <span v-if="h.comment" class="hist-comment" :data-testid="`couple-cx-quiz-hist-comment-${i}`">{{ h.comment }}</span>
            </div>
          </div>
        </div>
      </template>
      <p v-else class="empty-line">综艺棚还没搭…</p>
    </CoupleCollapsible>

    <!-- F282 喜好 TOP10 互猜：各排各的榜，再猜 TA 的榜 -->
    <CoupleCollapsible testid="couple-cx-top" :empty="!hasTop">
      <template #title>🎯 TOP10 互猜 <span class="sub">八个类目，榜要自己排，也要猜 TA 怎么排——没猜中的就是「重新认识清单」</span></template>
      <template v-if="ov">
        <div v-for="t in ov.tops" :key="t.category" class="top-row" :data-testid="`couple-cx-top-row-${t.category}`">
          <p class="top-head">
            <b class="top-label" :data-testid="`couple-cx-top-label-${t.category}`">{{ t.label }}</b>
            <span v-if="t.revealed" class="lit-chip" :data-testid="`couple-cx-top-revealed-${t.category}`">已揭榜 🎉</span>
            <span v-else class="wait-chip" :data-testid="`couple-cx-top-wait-${t.category}`">榜 + 猜测都齐了才揭 🎯</span>
          </p>

          <div class="inline-form">
            <el-input
              v-model="topMineDraft[t.category]"
              type="textarea"
              :rows="2"
              maxlength="600"
              placeholder="我的榜（≤10 条，逗号分隔，如「毛肚，番茄鸡蛋，楼下的面」）"
              :data-testid="`couple-cx-top-mine-${t.category}`"
            />
            <el-button size="small" type="primary" :data-testid="`couple-cx-top-mine-btn-${t.category}`" @click="onTopList(t)">
              {{ t.mine.length ? '改我的榜 🔁' : '上榜 📌' }}
            </el-button>
          </div>
          <p v-if="t.mine.length" class="list-line" :data-testid="`couple-cx-top-mine-list-${t.category}`">🙋 我的榜：{{ t.mine.join('、') }}</p>
          <p v-else class="empty-line" :data-testid="`couple-cx-top-mine-list-${t.category}`">我在这类目还没上榜 🙋</p>

          <div class="inline-form">
            <el-input
              v-model="topGuessDraft[t.category]"
              maxlength="600"
              placeholder="我猜 TA 的榜（≤10 条，逗号分隔，能反复改）"
              :data-testid="`couple-cx-top-guess-${t.category}`"
            />
            <el-button size="small" type="warning" plain :data-testid="`couple-cx-top-guess-btn-${t.category}`" @click="onTopGuess(t)">
              {{ t.myGuess.length ? '改我的猜测 ✍️' : '我下注 🎯' }}
            </el-button>
          </div>
          <p v-if="t.myGuess.length" class="list-line" :data-testid="`couple-cx-top-guess-list-${t.category}`">📝 我的猜测：{{ t.myGuess.join('、') }}</p>
          <p v-else class="empty-line" :data-testid="`couple-cx-top-guess-list-${t.category}`">还没猜这一项，猜一把才知道默契不默契 🎯</p>

          <!-- TA 的榜只有揭榜之后才给看 -->
          <p v-if="t.revealed" class="list-line is-partner" :data-testid="`couple-cx-top-partner-${t.category}`">💕 TA 的榜：{{ t.partner.join('、') }}</p>
          <div v-if="t.rematch.length" class="rematch-bar" :data-testid="`couple-cx-top-rematch-${t.category}`">
            <p class="rematch-head">🌱 重新认识清单（{{ t.rematch.length }} 条）</p>
            <p
              v-for="(r, i) in t.rematch"
              :key="`${r}-${i}`"
              class="rematch-line"
              :data-testid="`couple-cx-top-rematch-${t.category}-${i}`"
            >{{ r }}</p>
          </div>
        </div>
      </template>
      <p v-else class="empty-line">榜单还没开印…</p>
    </CoupleCollapsible>

    <!-- F283 外号考据 + F284 友情测验 + F285 足迹 + F287 习惯图鉴 + F288 口味变迁 -->
    <CoupleCollapsible testid="couple-cx-dossier">
      <template #title>📜 考据卷宗 <span class="sub">外号哪来的、走过的地方、口味怎么变的、TA 有啥小习惯——一样样建档</span></template>
      <template v-if="ov">
        <!-- F283 外号小传 -->
        <p class="section-head">🏷️ 外号小传（{{ ov.stories.length }} 条）</p>
        <div class="codex-form">
          <div class="inline-form">
            <el-input v-model="sNick" maxlength="40" placeholder="外号（≤40 字，同名即改写）" data-testid="couple-cx-story-nick" />
            <el-input v-model="sGivenBy" maxlength="30" placeholder="谁起的（可不写）" data-testid="couple-cx-story-given" />
            <el-input v-model="sOccasion" maxlength="60" placeholder="什么场合叫出口的（可不写）" data-testid="couple-cx-story-occasion" />
            <el-date-picker
              v-model="sFirstDay"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="第一次叫那天"
              style="width: 150px"
              data-testid="couple-cx-story-day"
            />
          </div>
          <el-input
            v-model="sStory"
            type="textarea"
            :rows="2"
            maxlength="300"
            show-word-limit
            placeholder="考据故事：这外号是怎么诞生并活到今天的（≤300 字）"
            data-testid="couple-cx-story-text"
          />
          <div class="inline-form">
            <el-button size="small" type="primary" data-testid="couple-cx-story-submit" @click="onStory">
              {{ editingStoryNick ? '补进考据 🔁' : '立个小传 🏷️' }}
            </el-button>
            <el-button v-if="editingStoryNick" size="small" link data-testid="couple-cx-story-cancel" @click="resetStoryForm">不改了 ✕</el-button>
          </div>
        </div>
        <p v-if="!ov.stories.length" class="empty-line">外号还没建档，那些「小猪」「老板」都值得一个小传 🏷️</p>
        <div v-for="s in ov.stories" :key="s.id" class="story-row" :data-testid="`couple-cx-story-${s.id}`">
          <p class="story-head">
            <b class="story-nick" :data-testid="`couple-cx-story-nick-text-${s.id}`">{{ s.nickname }}</b>
            <span class="who-chip">{{ s.mine ? '我考据的 🙋' : '💕 TA 考据的' }}</span>
            <span v-if="s.firstUsedDay" class="day-chip" :data-testid="`couple-cx-story-first-${s.id}`">首日 {{ s.firstUsedDay }}</span>
          </p>
          <p v-if="s.givenBy || s.occasion" class="story-meta" :data-testid="`couple-cx-story-meta-${s.id}`">
            {{ s.givenBy ? `由 ${s.givenBy} 起` : '' }}{{ s.givenBy && s.occasion ? ' · ' : '' }}{{ s.occasion || '' }}
          </p>
          <p class="story-text" :data-testid="`couple-cx-story-text-${s.id}`">{{ s.story }}</p>
          <el-button size="small" plain :data-testid="`couple-cx-story-edit-${s.id}`" @click="startStoryEdit(s)">补一笔 ✍️</el-button>
        </div>

        <!-- F284 友情测验：出题考 TA 记得吗 -->
        <div class="block">
          <p class="section-head">✍️ 你记得吗（{{ ov.exams.length }} 道 · 每人各出各的题）</p>
          <div class="inline-form">
            <el-input v-model="xQuestion" maxlength="140" placeholder="题面（≤140 字，如「我第一句跟你说了什么」）" data-testid="couple-cx-exam-question" />
            <el-input v-model="xAnswer" maxlength="60" placeholder="标准答案（≤60 字，只有你们知道）" style="max-width: 220px" data-testid="couple-cx-exam-key" />
            <el-button size="small" type="primary" data-testid="couple-cx-exam-submit" @click="onExamAsk">考 TA 一题 ✍️</el-button>
          </div>
          <p v-if="!ov.exams.length" class="empty-line">还没有考题，攒几条回忆出来考考 TA ✍️</p>
          <div v-for="x in ov.exams" :key="x.id" class="exam-row" :class="{ 'is-right': x.verdict === 'RIGHT' }" :data-testid="`couple-cx-exam-${x.id}`">
            <p class="exam-head">
              <span class="exam-q" :data-testid="`couple-cx-exam-q-${x.id}`">{{ x.question }}</span>
              <span class="who-chip" :data-testid="`couple-cx-exam-who-${x.id}`">{{ x.mine ? '我出的题，考 TA 🙋' : '💕 TA 考我的题' }}</span>
              <span
                class="verdict-chip"
                :class="{ 'is-right': x.verdict === 'RIGHT', 'is-wrong': x.verdict === 'WRONG' }"
                :data-testid="`couple-cx-exam-verdict-${x.id}`"
              >{{ examVerdictText(x) }}</span>
            </p>
            <!-- 只有被考的人能作答；答对即记档，答错缓 7 天 -->
            <div v-if="x.toMe && x.verdict !== 'RIGHT'" class="inline-form">
              <el-input v-model="examTries[x.id]" maxlength="60" placeholder="你的答案（≤60 字）" :data-testid="`couple-cx-exam-answer-${x.id}`" />
              <el-button
                size="small"
                type="primary"
                :data-testid="`couple-cx-exam-try-${x.id}`"
                :disabled="x.verdict === 'WRONG' && !retryOpen(x)"
                @click="onExamTry(x)"
              >交这题 ✍️</el-button>
              <span v-if="x.verdict === 'WRONG' && !retryOpen(x)" class="wait-chip" :data-testid="`couple-cx-exam-retry-${x.id}`">
                答错缓 7 天，{{ retryDayOf(x) }} 后可补考 ⏳
              </span>
            </div>
            <p v-else-if="x.mine && x.verdict" class="exam-note" :data-testid="`couple-cx-exam-note-${x.id}`">
              {{ x.verdict === 'RIGHT' ? 'TA 答上了，光荣记档 ✅' : `TA 答错了一次（${x.lastTryDay}），给 TA 留点面子 😝` }}
            </p>
          </div>
        </div>

        <!-- F285 足迹与年表 -->
        <div class="block">
          <p class="section-head">📍 去过的地方（{{ ov.places.length }} 处 · 同名即改写）</p>
          <div class="inline-form">
            <el-input v-model="pName" maxlength="60" placeholder="地名（≤60 字，如「第一次看海的那段堤」）" data-testid="couple-cx-place-name" />
            <el-input v-model="pYear" maxlength="4" placeholder="年份 yyyy" style="max-width: 110px" data-testid="couple-cx-place-year" />
            <el-rate v-model="pRating" :max="5" data-testid="couple-cx-place-rate" />
          </div>
          <div class="inline-form">
            <el-input v-model="pHappened" maxlength="140" placeholder="那天发生了什么（可不写，≤140 字）" data-testid="couple-cx-place-happened" />
            <el-button size="small" type="primary" data-testid="couple-cx-place-submit" @click="onPlace">盖个足迹章 📍</el-button>
          </div>
          <p v-if="!ov.places.length" class="empty-line">年表还是空的，先从那次出门记起 📍</p>
          <div v-for="g in placesByYear" :key="g.year" class="year-group" :data-testid="`couple-cx-place-group-${g.key}`">
            <p class="year-head" :data-testid="`couple-cx-place-yearhead-${g.key}`">{{ g.year }} 年 · {{ g.items.length }} 处 📍</p>
            <div v-for="p in g.items" :key="p.id" class="place-row" :data-testid="`couple-cx-place-${p.id}`">
              <b class="place-name" :data-testid="`couple-cx-place-name-text-${p.id}`">{{ p.name }}</b>
              <span class="stars-chip" :data-testid="`couple-cx-place-stars-${p.id}`">{{ starLine(p.rating) }}</span>
              <span class="who-chip">{{ p.mine ? '我记的 🙋' : '💕 TA 记的' }}</span>
              <p v-if="p.happened" class="place-happened" :data-testid="`couple-cx-place-happened-${p.id}`">{{ p.happened }}</p>
            </div>
          </div>
        </div>

        <!-- F288 口味变迁 -->
        <div class="block">
          <p class="section-head">😋 口味变迁（{{ ov.tastes.length }} 笔 · 同人同对象可改写）</p>
          <div class="inline-form">
            <el-input v-model="tThing" maxlength="60" placeholder="对象（≤60 字，如「香菜」）" data-testid="couple-cx-taste-thing" />
            <el-input v-model="tBefore" maxlength="60" placeholder="以前：碰都不碰" style="max-width: 180px" data-testid="couple-cx-taste-before" />
            <el-input v-model="tNow" maxlength="60" placeholder="现在：真香" style="max-width: 180px" data-testid="couple-cx-taste-now" />
            <el-date-picker
              v-model="tShiftedDay"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="转折那天"
              style="width: 150px"
              data-testid="couple-cx-taste-day"
            />
            <el-button size="small" type="primary" data-testid="couple-cx-taste-submit" @click="onTaste">记这笔变迁 😋</el-button>
          </div>
          <p v-if="!ov.tastes.length" class="empty-line">还没记录过「以前不爱现在爱」，其实这种最好笑 😋</p>
          <div v-for="x in ov.tastes" :key="x.id" class="taste-row" :data-testid="`couple-cx-taste-${x.id}`">
            <b class="taste-thing" :data-testid="`couple-cx-taste-thing-${x.id}`">{{ x.thing }}</b>
            <span class="taste-line" :data-testid="`couple-cx-taste-before-${x.id}`">以前：{{ x.beforeText || '（没写）' }}</span>
            <span class="taste-line is-now" :data-testid="`couple-cx-taste-now-${x.id}`">现在：{{ x.nowText || '（没写）' }}</span>
            <span class="day-chip" :data-testid="`couple-cx-taste-day-${x.id}`">{{ x.shiftedDay }}</span>
            <span class="who-chip">{{ x.mine ? '我记的 🙋' : '💕 TA 记的' }}</span>
          </div>
        </div>

        <!-- F287 习惯图鉴 -->
        <div class="block">
          <p class="section-head">🔍 习惯图鉴（{{ ov.habits.length }} 条 · 被记的那位亲自判案）</p>
          <div class="inline-form">
            <el-input v-model="hHabit" maxlength="60" placeholder="TA 的小习惯（≤60 字，如「进门先把鞋摆齐」）" data-testid="couple-cx-habit-input" />
            <el-input v-model="hTag" maxlength="20" placeholder="分类标签（可不写，如「可爱」）" style="max-width: 150px" data-testid="couple-cx-habit-tag" />
            <el-button size="small" type="primary" data-testid="couple-cx-habit-submit" @click="onHabitAdd">记进图鉴 🔍</el-button>
          </div>
          <p v-if="!ov.habits.length" class="empty-line">图鉴空白，说明还没认真观察过对方 🔍</p>
          <div v-for="h in ov.habits" :key="h.id" class="habit-row" :class="`is-${h.verdict.toLowerCase() || 'pending'}`" :data-testid="`couple-cx-habit-${h.id}`">
            <span class="habit-text" :data-testid="`couple-cx-habit-text-${h.id}`">{{ h.habit }}</span>
            <span v-if="h.tag" class="tag-chip" :data-testid="`couple-cx-habit-tag-${h.id}`">#{{ h.tag }}</span>
            <span class="who-chip" :data-testid="`couple-cx-habit-observer-${h.id}`">{{ h.mine ? '我记的 TA 🙋' : `💕 ${h.observerUser} 记的我` }}</span>
            <span class="verdict-chip" :class="{ 'is-right': h.verdict === 'REAL', 'is-wrong': h.verdict === 'WRONG' }" :data-testid="`couple-cx-habit-verdict-${h.id}`">
              {{ habitVerdictText(h) }}
            </span>
            <!-- 判案按钮只出现在「TA 记我」那几条，且判过就收起 -->
            <template v-if="!h.mine && !h.verdict">
              <el-button size="small" type="success" plain :data-testid="`couple-cx-habit-real-${h.id}`" @click="onHabitVerdict(h, 'REAL')">确实 ✅</el-button>
              <el-button size="small" plain :data-testid="`couple-cx-habit-wrong-${h.id}`" @click="onHabitVerdict(h, 'WRONG')">冤枉 ❌</el-button>
            </template>
            <span v-else-if="h.mine && !h.verdict" class="wait-chip" :data-testid="`couple-cx-habit-wait-${h.id}`">等 TA 亲自判 ⏳</span>
          </div>
        </div>
      </template>
      <p v-else class="empty-line">档案室还在整理卷宗…</p>
    </CoupleCollapsible>

    <!-- F286 第一眼对视 + F289 灵魂双盲人格 -->
    <CoupleCollapsible testid="couple-cx-soul">
      <template #title>🙈 灵魂双盲与人格 <span class="sub">第一眼是哪一刻各写各的，八题速测各答各的，齐了才互见</span></template>
      <template v-if="ov">
        <p class="section-head">👀 第一眼对视</p>
        <p class="hint-line" data-testid="couple-cx-first-tries">
          这一题你已交 {{ myTries }}/{{ FIRST_TRIES_MAX }} 份（写满 {{ FIRST_TRIES_MAX }} 次还没对上，两份答案就自动互见）
        </p>
        <div v-if="!ov.firstLook.revealed" class="inline-form">
          <el-input
            v-model="flMoment"
            type="textarea"
            :rows="2"
            maxlength="200"
            show-word-limit
            placeholder="你注意到我（或被我注意到）的那一刻是…（≤200 字，各写各的）"
            data-testid="couple-cx-first-moment"
          />
          <el-button size="small" type="primary" data-testid="couple-cx-first-submit" @click="onFirstLook">交这份答卷 🙈</el-button>
        </div>
        <p v-else class="lit-line" data-testid="couple-cx-first-revealed">两份已经互见啦，这一刻尘埃落定 📽️</p>
        <div v-if="ov.firstLook.mine" class="look-row">
          <span class="look-label">🙋 我的版本</span>
          <b class="look-text" data-testid="couple-cx-first-mine">{{ ov.firstLook.mine }}</b>
        </div>
        <div v-if="ov.firstLook.partner" class="look-row is-partner">
          <span class="look-label">💕 TA 的版本</span>
          <b class="look-text" data-testid="couple-cx-first-partner">{{ ov.firstLook.partner }}</b>
        </div>
        <p v-if="!ov.firstLook.mine" class="empty-line">你还没交第一眼的答卷，先写自己那份 🙈</p>
        <p v-if="ov.firstLook.waiting" class="wait-line" data-testid="couple-cx-first-wait">两份都交了但还没到互见的时候，再各写一份或等 TA 对上你 ⏳</p>

        <div class="block">
          <p class="section-head">🧬 人格双报（八题四维 · 一年一报，重测覆盖当年）</p>
          <div v-for="(q, i) in TYPE_QUESTIONS" :key="q.q" class="type-row" :data-testid="`couple-cx-type-row-${i}`">
            <span class="type-q" :data-testid="`couple-cx-type-q-${i}`">{{ i + 1 }}. {{ q.q }}</span>
            <el-radio-group v-model="typeAnswers[i]" class="type-options" :data-testid="`couple-cx-type-group-${i}`">
              <el-radio :value="1" :data-testid="`couple-cx-type-opt-${i}-1`">{{ q.a }}</el-radio>
              <el-radio :value="2" :data-testid="`couple-cx-type-opt-${i}-2`">{{ q.b }}</el-radio>
            </el-radio-group>
          </div>
          <div class="inline-form">
            <el-button size="small" type="primary" data-testid="couple-cx-type-submit" @click="onType">
              {{ ov.type && ov.type.myKey ? '重答一遍，覆盖今年 🧬' : '交这份人格卷 🧬' }}
            </el-button>
            <span v-if="typeMissing" class="wait-chip" data-testid="couple-cx-type-missing">还差 {{ typeMissing }} 题没选 📝</span>
          </div>
          <div v-if="ov.type" class="type-result" data-testid="couple-cx-type-result">
            <p class="type-year" data-testid="couple-cx-type-year">{{ ov.type.year }} 双人年报</p>
            <p class="type-codes">
              <b class="type-code is-mine" data-testid="couple-cx-type-mine">我的类型：{{ ov.type.myKey || '还没交卷' }}</b>
              <b class="type-code is-partner" data-testid="couple-cx-type-partner">TA 的类型：{{ ov.type.partnerKey || 'TA 还没交卷' }}</b>
            </p>
            <p v-if="ov.type.diffLine" class="diff-line" data-testid="couple-cx-type-diff">{{ ov.type.diffLine }}</p>
          </div>
          <p v-else class="empty-line" data-testid="couple-cx-type-none">今年两人都还没报过人格，各答八题就有对照了 🧬</p>
        </div>
      </template>
      <p v-else class="empty-line">双盲实验室待命中…</p>
    </CoupleCollapsible>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { codexApi } from '@/api/couple'
import type { CoupleCxEntryVO, CoupleCxExamVO, CoupleCxHabitVO, CoupleCxOverviewVO, CoupleCxPlaceVO, CoupleCxStoryVO, CoupleCxTopBoardVO } from '@/types'
import CoupleCollapsible from './CoupleCollapsible.vue'

/** 后端约定常量（与 CoupleCodexService / CoupleCodexBank 对齐，只增不改） */
const QUIZ_MIN = 5
const HISTORY_MAX = 6
const FIRST_TRIES_MAX = 3

/** F289 八题四维卷（题面与两列选项文案抄自后端 CoupleCodexBank.TYPE_QUESTIONS，题序即轴序 E/I S/N T/F J/P 的第一题） */
const TYPE_QUESTIONS = [
  { q: '周末更想怎么过？', a: '组一大局叫上所有人', b: '就俩人窝着各干各的' },
  { q: '聊天更常聊什么？', a: '正在发生的具体事', b: '想法、可能性和未来' },
  { q: '朋友来诉苦，你先？', a: '帮着把问题捋出方案', b: '先共情说一句「太难了」' },
  { q: '旅行计划习惯？', a: '订好每天的行程表', b: '订张机票走到哪算哪' },
  { q: '能量恢复靠？', a: '见人多热闹场合', b: '独处安静回血' },
  { q: '记住的更多是？', a: '细节和事实', b: '整体的感觉和印象' },
  { q: '吵完架更想？', a: '先讲清楚谁对谁错', b: '先和好，道理回头再说' },
  { q: '对待待办清单？', a: '提前做完才安心', b: '压着 deadline 更有灵感' },
]

/** 整份百科总览（除 overview 外全部写接口返回整份，整体替换即五卡刷新） */
const ov = ref<CoupleCxOverviewVO | null>(null)

// ---- 草稿：F280 词条 ----
const eTerm = ref('')
const eDefinition = ref('')
const eOrigin = ref('')
const eUsage = ref('')
const editingEntry = ref('')

// ---- 草稿：F281 默契综艺 ----
const quizAnswers = ref<string[]>([])

// ---- 草稿：F282 TOP10 ----
const topMineDraft = ref<Record<string, string>>({})
const topGuessDraft = ref<Record<string, string>>({})

// ---- 草稿：F283 外号小传 ----
const sNick = ref('')
const sGivenBy = ref('')
const sOccasion = ref('')
const sStory = ref('')
const sFirstDay = ref('')
const editingStoryNick = ref('')

// ---- 草稿：F284 友情测验 ----
const xQuestion = ref('')
const xAnswer = ref('')
const examTries = ref<Record<string, string>>({})

// ---- 草稿：F285 足迹 ----
const pName = ref('')
const pYear = ref('')
const pHappened = ref('')
const pRating = ref(5)

// ---- 草稿：F286 第一眼 ----
const flMoment = ref('')
/** 本次会话内我交了几份第一眼答卷（后端 FirstLookVO 不下发 tries，只能在组件里自己数） */
const myTries = ref(0)

// ---- 草稿：F287 习惯 / F288 口味 ----
const hHabit = ref('')
const hTag = ref('')
const tThing = ref('')
const tBefore = ref('')
const tNow = ref('')
const tShiftedDay = ref('')

// ---- 草稿：F289 人格 ----
const typeAnswers = ref<number[]>(Array.from({ length: TYPE_QUESTIONS.length }, () => 0))

// ---- 派生 ----
/** 本期我是否已交卷（myAnswer 为空串=没交） */
const quizAnswered = computed(() => !!ov.value?.todayQuiz?.myAnswer)
/** 我的五答 / TA 的五答（后端按逗号存，按下标对齐比较） */
const myAns = computed(() => splitCsv(ov.value?.todayQuiz?.myAnswer ?? ''))
const partnerAns = computed(() => splitCsv(ov.value?.todayQuiz?.partnerAnswer ?? ''))
const hasQuiz = computed(() => !!ov.value?.todayQuiz || !!ov.value?.history.length)
const hasTop = computed(() => (ov.value?.tops ?? []).some((t) => t.mine.length || t.partner.length || t.myGuess.length || t.rematch.length))
const typeMissing = computed(() => typeAnswers.value.filter((v) => v !== 1 && v !== 2).length)

/** 足迹年表：按年份倒序分组（未记年的归「未记年」一组，放最后） */
const placesByYear = computed(() => {
  const map = new Map<string, CoupleCxPlaceVO[]>()
  for (const p of ov.value?.places ?? []) {
    const y = p.year || '未记年'
    const arr = map.get(y) ?? []
    arr.push(p)
    map.set(y, arr)
  }
  return [...map.entries()]
    .sort((a, b) => (a[0] === '未记年' ? 1 : b[0] === '未记年' ? -1 : b[0].localeCompare(a[0])))
    .map(([year, items]) => ({ year, key: year === '未记年' ? 'none' : year, items }))
})

function splitCsv(raw: string): string[] {
  return raw ? raw.split(',').map((s) => s.trim()) : []
}

function ansHit(i: number): boolean {
  const mine = (myAns.value[i] ?? '').toLowerCase()
  const theirs = (partnerAns.value[i] ?? '').toLowerCase()
  return !!mine && mine === theirs
}

function starLine(rating: number): string {
  const n = Math.max(0, Math.min(5, rating))
  return `${'★'.repeat(n)}${'☆'.repeat(5 - n)}`
}

function examVerdictText(x: CoupleCxExamVO): string {
  if (x.verdict === 'RIGHT') return '答对了 ✅'
  if (x.verdict === 'WRONG') return '答错了 😝'
  return '还没作答 ⏳'
}

/** 答错的题 7 天后可补考（后端 EXAM_RETRY_DAYS=7，前端只按 lastTryDay 自己算展示） */
function retryDayOf(x: CoupleCxExamVO): string {
  const base = Date.parse(`${x.lastTryDay}T00:00:00`)
  if (!x.lastTryDay || Number.isNaN(base)) return '过几天'
  return new Date(base + 7 * 86_400_000).toISOString().slice(0, 10)
}

function retryOpen(x: CoupleCxExamVO): boolean {
  if (x.verdict !== 'WRONG') return true
  return Date.now() >= Date.parse(`${retryDayOf(x)}T00:00:00`)
}

function habitVerdictText(h: CoupleCxHabitVO): string {
  if (h.verdict === 'REAL') return '确实 ✅'
  if (h.verdict === 'WRONG') return '冤枉 ❌'
  return h.mine ? '待 TA 判案 ⏳' : '等你判案 🔍'
}

function onError(e: unknown, fallback: string) {
  // 后端 400 的中文 message 直接透传（例如「词条还不到 5 条，先去百科里攒词」）
  ElMessage.error(e instanceof Error ? e.message : fallback)
}

/** 写接口统一返回整份 OverviewVO：整体替换即五卡刷新 */
function refresh(data: CoupleCxOverviewVO | undefined | null) {
  if (data) {
    ov.value = data
    hydrateDrafts(data)
  }
}

/** 把后端已有内容回填到输入草稿（榜单/猜测/人格卷），避免刷新后表单变空 */
function hydrateDrafts(data: CoupleCxOverviewVO) {
  const mine: Record<string, string> = {}
  const guess: Record<string, string> = {}
  for (const t of data.tops ?? []) {
    mine[t.category] = t.mine.join('，')
    guess[t.category] = t.myGuess.join('，')
  }
  topMineDraft.value = mine
  topGuessDraft.value = guess
  if (data.todayQuiz && !data.todayQuiz.myAnswer) {
    quizAnswers.value = Array.from({ length: data.todayQuiz.terms.length || QUIZ_MIN }, () => '')
  }
  if (data.type?.answers) {
    typeAnswers.value = data.type.answers.split(',').map((s) => Number(s.trim()) || 0)
  }
  flMoment.value = data.firstLook.revealed ? '' : data.firstLook.mine || flMoment.value
}

// ---- F280 词条共建 ----
function resetEntryForm() {
  eTerm.value = ''
  eDefinition.value = ''
  eOrigin.value = ''
  eUsage.value = ''
  editingEntry.value = ''
}

async function onEntrySave() {
  if (!eTerm.value.trim() || !eDefinition.value.trim()) {
    ElMessage.warning('词条名和释义都要写一句才立得起来 📚')
    return
  }
  try {
    const term = eTerm.value.trim()
    const wasEditing = !!editingEntry.value
    refresh(await codexApi.cxEntrySave(term, eDefinition.value.trim(), eOrigin.value.trim(), eUsage.value.trim()))
    resetEntryForm()
    ElMessage.success(wasEditing ? `「${term}」修订好了，修订人记成你 ✍️` : `「${term}」收进百科了 📚`)
  } catch (e) {
    onError(e, '收录词条失败')
  }
}

function startEntryEdit(e: CoupleCxEntryVO) {
  eTerm.value = e.term
  eDefinition.value = e.definition
  eOrigin.value = e.origin
  eUsage.value = e.usageNote
  editingEntry.value = e.term
}

async function onEntryRemove(e: CoupleCxEntryVO) {
  try {
    refresh(await codexApi.cxEntryRemove(e.id))
    ElMessage.success(`「${e.term}」从百科里撤下来了 🗑️`)
  } catch (e2) {
    onError(e2, '撤词条失败')
  }
}

// ---- F281 默契综艺 ----
async function onQuizStart() {
  try {
    refresh(await codexApi.cxQuizStart())
    ElMessage.success('本期开场，五道填空看你还记不记得 🎪')
  } catch (e) {
    onError(e, '开场失败')
  }
}

async function onQuizAnswer() {
  const list = quizAnswers.value.map((s) => (s ?? '').trim())
  if (list.some((s) => !s)) {
    ElMessage.warning('五题都要写一句才交卷，空着的算弃权哦 ✍️')
    return
  }
  try {
    refresh(await codexApi.cxQuizAnswer(list.join(',')))
    ElMessage.success('交卷成功，等 TA 那份来对答案 📤')
  } catch (e) {
    onError(e, '交卷失败')
  }
}

// ---- F282 TOP10 互猜 ----
async function onTopList(t: CoupleCxTopBoardVO) {
  if (!topMineDraft.value[t.category]?.trim()) {
    ElMessage.warning(`「${t.label}」总要写几条上榜 📌`)
    return
  }
  try {
    refresh(await codexApi.cxTopList(t.category, topMineDraft.value[t.category].trim()))
    ElMessage.success(`${t.label} 已更新，等 TA 来猜 📌`)
  } catch (e) {
    onError(e, '上榜失败')
  }
}

async function onTopGuess(t: CoupleCxTopBoardVO) {
  if (!topGuessDraft.value[t.category]?.trim()) {
    ElMessage.warning(`「${t.label}」不猜一句怎么揭榜 🎯`)
    return
  }
  try {
    refresh(await codexApi.cxTopGuess(t.category, topGuessDraft.value[t.category].trim()))
    ElMessage.success(`猜好 ${t.label} 了，榜齐了就揭帘子 🎯`)
  } catch (e) {
    onError(e, '下注失败')
  }
}

// ---- F283 外号考据 ----
function resetStoryForm() {
  sNick.value = ''
  sGivenBy.value = ''
  sOccasion.value = ''
  sStory.value = ''
  sFirstDay.value = ''
  editingStoryNick.value = ''
}

async function onStory() {
  if (!sNick.value.trim() || !sStory.value.trim()) {
    ElMessage.warning('外号和考据故事总要写一句 🏷️')
    return
  }
  try {
    refresh(await codexApi.cxStory(sNick.value.trim(), sGivenBy.value.trim(), sOccasion.value.trim(), sStory.value.trim(), sFirstDay.value || ''))
    const nick = sNick.value.trim()
    resetStoryForm()
    ElMessage.success(`外号「${nick}」的小传归档了 📜`)
  } catch (e) {
    onError(e, '立小传失败')
  }
}

function startStoryEdit(s: CoupleCxStoryVO) {
  sNick.value = s.nickname
  sGivenBy.value = s.givenBy
  sOccasion.value = s.occasion
  sStory.value = s.story
  sFirstDay.value = s.firstUsedDay
  editingStoryNick.value = s.nickname
}

// ---- F284 友情测验 ----
async function onExamAsk() {
  if (!xQuestion.value.trim() || !xAnswer.value.trim()) {
    ElMessage.warning('题面和标准答案都要写，不然没法判卷 ✍️')
    return
  }
  try {
    refresh(await codexApi.cxExamAsk(xQuestion.value.trim(), xAnswer.value.trim()))
    xQuestion.value = ''
    xAnswer.value = ''
    ElMessage.success('题挂出去了，等 TA 来答 ✍️')
  } catch (e) {
    onError(e, '出题失败')
  }
}

async function onExamTry(x: CoupleCxExamVO) {
  const answer = (examTries.value[x.id] ?? '').trim()
  if (!answer) {
    ElMessage.warning('总得写个答案，写「不记得了」也算 😝')
    return
  }
  try {
    refresh(await codexApi.cxExamTry(x.id, answer))
    examTries.value = { ...examTries.value, [x.id]: '' }
    ElMessage.success('这题交上去了，等判卷 📝')
  } catch (e) {
    onError(e, '作答失败')
  }
}

// ---- F285 足迹登记 ----
async function onPlace() {
  if (!pName.value.trim()) {
    ElMessage.warning('地名要写，不然年表记了个啥 📍')
    return
  }
  try {
    refresh(await codexApi.cxPlace(pName.value.trim(), pYear.value.trim(), pHappened.value.trim(), pRating.value))
    pName.value = ''
    pYear.value = ''
    pHappened.value = ''
    pRating.value = 5
    ElMessage.success('足迹盖好章了，年表又厚一页 📍')
  } catch (e) {
    onError(e, '盖足迹章失败')
  }
}

// ---- F286 第一眼对视 ----
async function onFirstLook() {
  if (!flMoment.value.trim()) {
    ElMessage.warning('那一刻总要写一句，留一点给心跳也别全空着 🙈')
    return
  }
  try {
    refresh(await codexApi.cxFirstLook(flMoment.value.trim()))
    myTries.value += 1
    flMoment.value = ''
    ElMessage.success('答卷交上去了，等 TA 的那一份对上 🙈')
  } catch (e) {
    onError(e, '交答卷失败')
  }
}

// ---- F287 习惯图鉴 ----
async function onHabitAdd() {
  if (!hHabit.value.trim()) {
    ElMessage.warning('习惯要写一句才进得了图鉴 🔍')
    return
  }
  try {
    refresh(await codexApi.cxHabitAdd(hHabit.value.trim(), hTag.value.trim()))
    hHabit.value = ''
    hTag.value = ''
    ElMessage.success('记进图鉴了，等 TA 来标「确实/冤枉」🔍')
  } catch (e) {
    onError(e, '登记习惯失败')
  }
}

async function onHabitVerdict(h: CoupleCxHabitVO, verdict: string) {
  try {
    refresh(await codexApi.cxHabitVerdict(h.id, verdict))
    ElMessage.success(verdict === 'REAL' ? '判为「确实」，TA 观察立功 ✅' : '判为「冤枉」，这条从图鉴里划掉 ❌')
  } catch (e) {
    onError(e, '判案失败')
  }
}

// ---- F288 口味变迁 ----
async function onTaste() {
  if (!tThing.value.trim()) {
    ElMessage.warning('口味对象要写，比如「香菜」这种大戏 😋')
    return
  }
  try {
    refresh(await codexApi.cxTaste(tThing.value.trim(), tBefore.value.trim(), tNow.value.trim(), tShiftedDay.value || ''))
    tThing.value = ''
    tBefore.value = ''
    tNow.value = ''
    tShiftedDay.value = ''
    ElMessage.success('记下了，人的口味会进化，感情也是 😋')
  } catch (e) {
    onError(e, '记录口味失败')
  }
}

// ---- F289 人格双报 ----
async function onType() {
  if (typeMissing.value) {
    ElMessage.warning(`八题都要选完才能交卷，还差 ${typeMissing.value} 题 🧬`)
    return
  }
  try {
    refresh(await codexApi.cxType(typeAnswers.value.join(',')))
    ElMessage.success('人格卷交上去了，等 TA 那份来对照 🧬')
  } catch (e) {
    onError(e, '交人格卷失败')
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
  const data = await safeLoad(codexApi.cxOverview, null)
  ov.value = data
  if (data) {
    myTries.value = data.firstLook.mine ? 1 : 0
    hydrateDrafts(data)
  }
})
</script>

<style scoped>
/* 主色：墨青 #2c7a7b（考据/百科的书卷气，区别于粉红主色、#409eff 公司蓝、#d2691e 工坊橙棕、#d93a3a 中国红、#9254de 倾听紫、#c0392b 庆典金红）
   折叠卡标题色经 --collapse-title-color 级联给 CoupleCollapsible，故本组件不写 .title 规则 */
.couple-codex { display: flex; flex-direction: column; gap: 14px; --collapse-title-color: #2c7a7b; }
.sub { font-size: 12px; color: var(--im-muted, #909399); font-weight: normal; margin-left: 6px; }
.section-head { margin: 10px 0 4px; font-size: 13px; font-weight: bold; color: #2c7a7b; }
.block { margin-top: 12px; padding-top: 8px; border-top: 1px dashed var(--im-border, #ebeef5); }
.inline-form { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 8px; }
.inline-form .el-input { flex: 1; min-width: 150px; }
.codex-form { display: flex; flex-direction: column; gap: 0; margin-bottom: 6px; padding: 8px 10px; border-radius: 8px; background: rgba(44, 122, 123, 0.06); }
.empty-line { margin: 8px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.hint-line { margin: 6px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.wait-chip, .wait-line { font-size: 12px; color: #b8860b; }
.who-chip { font-size: 11px; color: var(--im-muted, #909399); }
.day-chip, .tag-chip { font-size: 11px; color: #2c7a7b; background: rgba(44, 122, 123, 0.12); padding: 1px 8px; border-radius: 10px; }
.lit-chip, .lit-line { font-size: 12px; color: #67c23a; background: rgba(103, 194, 58, 0.1); padding: 2px 8px; border-radius: 6px; }
.lock-chip { font-size: 11px; color: var(--im-muted, #909399); }
.count-badge { display: inline-block; margin: 0 0 4px; font-size: 13px; font-weight: bold; color: #2c7a7b; background: rgba(44, 122, 123, 0.1); padding: 3px 10px; border-radius: 12px; }
/* F280 词条书架 */
.entry-card { margin: 8px 0; padding: 9px 11px; border-radius: 8px; border-left: 3px solid #2c7a7b; background: var(--im-bg, #fafafa); }
.entry-head { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; margin: 0; font-size: 14px; }
.entry-term { color: #2c7a7b; }
.entry-def { margin: 4px 0 0; font-size: 13px; color: var(--im-text, #303133); }
.entry-note { margin: 2px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.entry-actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-top: 6px; }
/* F281 默契综艺 */
.quiz-row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin: 5px 0; font-size: 13px; }
.quiz-term { color: var(--im-text, #303133); min-width: 160px; }
.quiz-row .el-input { flex: 1; min-width: 180px; }
.quiz-mine { color: #2c7a7b; font-size: 13px; }
.quiz-partner { font-size: 13px; color: var(--im-text, #303133); }
.hit-chip { font-size: 11px; color: var(--im-muted, #909399); background: var(--im-bg, #fafafa); padding: 1px 8px; border-radius: 10px; }
.hit-chip.is-hit { color: #67c23a; background: rgba(103, 194, 58, 0.12); }
.match-badge { font-size: 13px; font-weight: bold; color: #2c7a7b; background: rgba(44, 122, 123, 0.12); padding: 2px 10px; border-radius: 10px; }
.comment-line { margin: 6px 0 0; font-size: 13px; color: #2c7a7b; background: rgba(44, 122, 123, 0.08); border-radius: 8px; padding: 5px 10px; }
.hist-list { margin-top: 4px; }
.hist-row { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; margin: 4px 0; font-size: 12px; }
.hist-comment { color: var(--im-muted, #909399); }
/* F282 TOP10 */
.top-row { margin: 10px 0; padding: 8px 10px; border-radius: 8px; border: 1px solid var(--im-border, #ebeef5); }
.top-head { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; margin: 0; }
.top-label { font-size: 14px; color: #2c7a7b; }
.list-line { margin: 4px 0 0; font-size: 12px; color: var(--im-text, #303133); }
.list-line.is-partner { color: #2c7a7b; font-weight: bold; }
.rematch-bar { margin-top: 6px; padding: 6px 10px; border-radius: 8px; background: rgba(44, 122, 123, 0.08); border: 1px dashed rgba(44, 122, 123, 0.4); }
.rematch-head { margin: 0; font-size: 12px; font-weight: bold; color: #2c7a7b; }
.rematch-line { margin: 2px 0 0; font-size: 12px; color: var(--im-text, #303133); }
/* F283 外号小传 */
.story-row { margin: 8px 0; padding: 8px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid #2c7a7b; font-size: 13px; }
.story-head { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; margin: 0; }
.story-nick { color: #2c7a7b; font-size: 14px; }
.story-meta { margin: 2px 0 0; font-size: 11px; color: var(--im-muted, #909399); }
.story-text { margin: 4px 0 8px; font-size: 13px; color: var(--im-text, #303133); white-space: pre-wrap; }
/* F284 友情测验 */
.exam-row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin: 5px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid #2c7a7b; font-size: 13px; }
.exam-row.is-right { border-left-color: #67c23a; opacity: 0.8; }
.exam-q { color: var(--im-text, #303133); font-weight: bold; }
.exam-row .inline-form { width: 100%; }
.exam-note { margin: 2px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.verdict-chip { font-size: 11px; color: var(--im-muted, #909399); background: var(--im-bg, #fafafa); padding: 1px 8px; border-radius: 10px; }
.verdict-chip.is-right { color: #67c23a; background: rgba(103, 194, 58, 0.12); }
.verdict-chip.is-wrong { color: #e6a23c; background: rgba(230, 162, 60, 0.14); }
/* F285 足迹年表 */
.year-group { margin: 8px 0; }
.year-head { margin: 0 0 4px; font-size: 13px; font-weight: bold; color: #2c7a7b; }
.place-row { margin: 4px 0; padding: 6px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); font-size: 13px; }
.place-name { color: var(--im-text, #303133); margin-right: 6px; }
.stars-chip { font-size: 12px; color: #b8860b; margin-right: 6px; }
.place-happened { margin: 3px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
/* F288 口味变迁 */
.taste-row { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; margin: 5px 0; padding: 6px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); font-size: 12px; }
.taste-thing { font-size: 13px; color: #2c7a7b; }
.taste-line { color: var(--im-muted, #909399); }
.taste-line.is-now { color: var(--im-text, #303133); }
/* F287 习惯图鉴 */
.habit-row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin: 5px 0; padding: 6px 10px; border-radius: 8px; border: 1px solid var(--im-border, #ebeef5); font-size: 13px; }
.habit-row.is-real { border-left: 3px solid #67c23a; }
.habit-row.is-wrong { border-left: 3px solid #e6a23c; opacity: 0.8; }
.habit-text { color: var(--im-text, #303133); }
/* F286 第一眼 */
.look-row { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; margin: 4px 0; padding: 6px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); font-size: 13px; }
.look-row.is-partner { border-left: 3px solid #2c7a7b; }
.look-label { font-size: 12px; color: var(--im-muted, #909399); }
.look-text { color: var(--im-text, #303133); }
/* F289 人格双报 */
.type-row { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin: 6px 0; font-size: 13px; }
.type-q { min-width: 200px; color: var(--im-text, #303133); }
.type-options { display: flex; gap: 12px; flex-wrap: wrap; }
.type-result { margin-top: 8px; padding: 8px 10px; border-radius: 8px; background: rgba(44, 122, 123, 0.08); }
.type-year { margin: 0 0 4px; font-size: 12px; color: var(--im-muted, #909399); }
.type-codes { display: flex; gap: 10px; flex-wrap: wrap; margin: 0; }
.type-code { font-size: 15px; letter-spacing: 1px; }
.type-code.is-mine { color: #2c7a7b; }
.type-code.is-partner { color: #b8860b; }
.diff-line { margin: 6px 0 0; font-size: 13px; color: var(--im-text, #303133); }
</style>

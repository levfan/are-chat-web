<template>
  <div class="couple-theater" data-testid="couple-theater">
    <!-- F300 今日身份签 + 日终演技分 -->
    <CoupleCollapsible testid="couple-theater-role">
      <template #title>🎭 今日身份签 <span class="sub">同一天你俩领同一个角色：TA 演今天的那个人设，你也演——片场不喊卡，回家也别急着出戏</span></template>
      <template v-if="t">
        <div class="role-card">
          <p class="role-name" data-testid="couple-theater-role-name">🎭 {{ t.role.roleName }}</p>
          <p class="role-guide" data-testid="couple-theater-role-guide">📋 与这个角色相处指南：{{ t.role.guide }}</p>
          <p class="day-chip" data-testid="couple-theater-role-day">{{ t.role.day }} 全天有效 · 用 TA 的方式对 TA，今天试试</p>
        </div>

        <p class="section-head">🎬 收工了：给今天演我的那个人打演技分（1-5 星，一天只能落一次笔）</p>
        <div class="rate-row">
          <el-button
            v-for="s in 5"
            :key="s"
            size="small"
            plain
            :disabled="t.role.mineRated"
            :data-testid="`couple-theater-rate-${s}`"
            @click="onRate(s)"
          >{{ '★'.repeat(s) }}</el-button>
        </div>
        <p v-if="t.role.mineRated" class="lit-chip" data-testid="couple-theater-rate-mine">
          我这一笔已经落了：{{ t.role.myRate }} 星 🎬（打过就不能改，明天再算一次）
        </p>
        <p v-else class="wait-line" data-testid="couple-theater-rate-wait">你还没打分，睡前补一笔 ⏳</p>
        <p v-if="t.role.partnerRate !== null" class="role-score" data-testid="couple-theater-rate-partner">
          💕 TA 给你今天的演技打了 {{ t.role.partnerRate }} 星
        </p>
        <p v-else class="wait-line" data-testid="couple-theater-rate-partner-wait">TA 还没给你打分，等着呢 ⏳</p>
        <p v-if="t.role.bothRated" class="lit-chip" data-testid="couple-theater-rate-both">
          双方都打完分了——今天的戏份到此为止，片场收工 🎬
        </p>
      </template>
      <p v-else class="empty-line">剧场还没开门…</p>
    </CoupleCollapsible>

    <!-- F301 一日互换日记 + F302 师徒日 -->
    <CoupleCollapsible testid="couple-theater-swap" :empty="!hasSwapStuff">
      <template #title>🔄 互换日记与师徒日 <span class="sub">用 TA 的口气写今天这一页，两页齐了对着读；这周谁当师父谁当徒弟，老天抽签定的</span></template>
      <template v-if="t">
        <p class="section-head">📖 今天这一页：我写「作为 TA 的一天」</p>
        <el-input
          v-model="diaryText"
          type="textarea"
          :rows="3"
          :maxlength="DIARY_MAX"
          show-word-limit
          :placeholder="`第一人称写 TA 的今天：今天我……（≤${DIARY_MAX} 字，别写成果清单）`"
          data-testid="couple-theater-diary-text"
        />
        <div class="inline-form">
          <el-button size="small" type="primary" data-testid="couple-theater-diary-submit" @click="onDiary">
            {{ todayDiary ? '改写我今天那页 🔁' : '写完这一页 📖' }}
          </el-button>
          <span v-if="todayDiary?.bothIn" class="lit-chip" data-testid="couple-theater-diary-both">两页都齐了，可以对着读 📖</span>
          <span v-else class="wait-chip" data-testid="couple-theater-diary-wait">TA 那页还没交，齐了才给你看 TA 眼里的你 ⏳</span>
        </div>
        <p v-if="todayDiary?.mine" class="diary-line is-mine" data-testid="couple-theater-diary-mine">🙋 我写的这页：{{ todayDiary.mine }}</p>
        <p v-if="todayDiary?.partner" class="diary-line is-partner" data-testid="couple-theater-diary-partner">
          💕 TA 用我的口气写的今天：{{ todayDiary.partner }}
        </p>
        <div v-if="pastDiaries.length" class="block">
          <p class="section-head">🗄️ 对着读过的日子（{{ pastDiaries.length }} 天）</p>
          <div v-for="d in pastDiaries" :key="d.day" class="diary-card" :class="{ 'is-both': d.bothIn }" :data-testid="`couple-theater-diary-day-${d.day}`">
            <p class="diary-head">
              <b class="diary-day">{{ d.day }}</b>
              <span class="status-chip" :data-testid="`couple-theater-diary-bothin-${d.day}`">{{ d.bothIn ? '双页齐 📖' : '只有一页 ⏳' }}</span>
            </p>
            <p class="diary-line is-mine" :data-testid="`couple-theater-diary-mine-${d.day}`">🙋 {{ d.mine || '（这页我没写）' }}</p>
            <p v-if="d.partner" class="diary-line is-partner" :data-testid="`couple-theater-diary-partner-${d.day}`">💕 {{ d.partner }}</p>
          </div>
        </div>

        <!-- F302 师徒日 -->
        <div class="block">
          <p class="section-head">🧎 本周师徒日（{{ t.week }} 那一周，主从后端抽签定，一周换一次）</p>
          <p class="master-who" data-testid="couple-theater-master-who">
            师父：{{ t.master.masterUser }} · 徒弟：{{ t.master.apprenticeUser }}
            —— {{ t.master.iAmMaster ? '这周我是师父，等着验收 🫡' : '这周我是徒弟，好好侍奉 🧎' }}
          </p>
          <p class="master-count" data-testid="couple-theater-master-count">
            侍奉打卡 {{ t.master.serveCount }}/{{ t.master.serveTarget }} 次（满 {{ t.master.serveTarget }} 次才谈得上出师）
          </p>
          <div class="progress-bar"><i data-testid="couple-theater-master-bar" :style="{ width: serveRatio }" /></div>

          <!-- 徒弟：只打卡，不给定级 -->
          <div v-if="!t.master.iAmMaster" class="inline-form">
            <el-button
              size="small"
              type="primary"
              :disabled="t.master.servedToday"
              data-testid="couple-theater-master-serve"
              @click="onServe"
            >{{ t.master.servedToday ? '今天这一笔已经记上了 ✔' : '今日侍奉打卡 🧎' }}</el-button>
            <span v-if="t.master.servedToday" class="lit-chip" data-testid="couple-theater-master-served">今天已经侍奉过，一天一次 ✔</span>
          </div>
          <!-- 师父：评语 + 定级（只有出师 / 留级两个章） -->
          <template v-else-if="t.master.canReview">
            <el-input
              v-model="reviewText"
              type="textarea"
              :rows="2"
              :maxlength="REVIEW_MAX"
              show-word-limit
              placeholder="期满评语（≤100 字，可空着只盖章）"
              data-testid="couple-theater-master-review"
            />
            <div class="inline-form">
              <el-button size="small" type="success" data-testid="couple-theater-master-graduate" @click="onReview('GRADUATED')">出师 🎓</el-button>
              <el-button size="small" type="warning" plain data-testid="couple-theater-master-repeat" @click="onReview('REPEAT')">留级 🔁</el-button>
              <span class="wait-chip" data-testid="couple-theater-master-tip">侍奉没满 {{ t.master.serveTarget }} 次就想点头，师父你悠着点 🫡</span>
            </div>
          </template>
          <p v-else class="wait-line" data-testid="couple-theater-master-nomove">
            {{ t.master.grade ? '这周已经定过级了，下周再收一次徒 🎓' : '定级是师父的活儿，徒弟只管等着验收 🫡' }}
          </p>
          <p v-if="t.master.review" class="master-review" data-testid="couple-theater-master-review-text">师父亲笔：{{ t.master.review }}</p>
          <p
            v-if="t.master.grade"
            class="grade-chip"
            :class="t.master.grade === 'GRADUATED' ? 'is-out' : 'is-repeat'"
            data-testid="couple-theater-master-grade"
          >{{ t.master.grade === 'GRADUATED' ? '这一届出师 🎓 往后家务平摊' : '留级 🔁 下周继续侍奉，不许嫌烦' }}</p>
        </div>
      </template>
      <p v-else class="empty-line">本子还没摊开…</p>
    </CoupleCollapsible>

    <!-- F303 时空电话亭 + F304 黑话大全抽查 -->
    <CoupleCollapsible testid="couple-theater-booth" :empty="!hasBoothStuff">
      <template #title>📞 时空电话亭与黑话大全 <span class="sub">给一年后（或一年前）的我们拨一通电话；那些只有你俩懂的梗先存进大全，改天抽查谁先忘</span></template>
      <template v-if="t">
        <p class="section-head">📞 拨一通跨时空电话（≤{{ BOOTH_MAX }} 字，杂音有点大，挑要紧的说）</p>
        <div class="inline-form">
          <el-radio-group v-model="boothKind" class="kind-group" data-testid="couple-theater-booth-kind">
            <el-radio value="FUTURE" data-testid="couple-theater-booth-opt-FUTURE">给一年后的我们（封存）</el-radio>
            <el-radio value="PAST" data-testid="couple-theater-booth-opt-PAST">给一年前的我们（当场接通）</el-radio>
          </el-radio-group>
        </div>
        <el-input
          v-model="boothText"
          type="textarea"
          :rows="2"
          :maxlength="BOOTH_MAX"
          show-word-limit
          placeholder="接通了第一句说什么？"
          data-testid="couple-theater-booth-text"
        />
        <div class="inline-form">
          <el-button size="small" type="primary" data-testid="couple-theater-booth-submit" @click="onBooth">
            {{ boothKind === 'PAST' ? '拨过去，听杂音 📞' : '拨出去，封存等一年 📞' }}
          </el-button>
          <span class="count-badge" data-testid="couple-theater-booth-count">话筒里存着 {{ t.booths.length }} 通</span>
        </div>
        <p v-if="!t.booths.length" class="empty-line">还没人拨过号，电话亭安静得很 📞</p>
        <div
          v-for="b in t.booths"
          :key="b.id"
          class="booth-row"
          :class="b.status === 'SEALED' ? 'is-sealed' : 'is-connected'"
          :data-testid="`couple-theater-booth-${b.id}`"
        >
          <p class="booth-head">
            <span class="kind-chip" :data-testid="`couple-theater-booth-way-${b.id}`">{{ b.kind === 'FUTURE' ? '→ 一年后 ⏩' : '← 一年前 ⏪' }}</span>
            <span class="who-chip" :data-testid="`couple-theater-booth-who-${b.id}`">{{ b.mine ? '我拨的 🙋' : '💕 TA 拨的' }}</span>
            <span class="day-chip" :data-testid="`couple-theater-booth-open-${b.id}`">{{ b.status === 'SEALED' ? `${b.openDay} 接通` : '已接通 📞' }}</span>
          </p>
          <p class="booth-text" :data-testid="`couple-theater-booth-text-${b.id}`">{{ b.text }}</p>
          <p v-if="b.status === 'SEALED'" class="wait-line" :data-testid="`couple-theater-booth-seal-${b.id}`">
            还封着呢，剩 {{ b.daysLeft }} 天到点（到那天自动接通，谁也别想提前听）🔒
          </p>
          <template v-else>
            <p class="booth-connected" :data-testid="`couple-theater-booth-connected-${b.id}`">📞 这通已经接通</p>
            <p class="booth-static" :data-testid="`couple-theater-booth-line-${b.id}`">{{ b.line }}</p>
          </template>
        </div>

        <!-- F304 黑话大全 -->
        <div class="block">
          <p class="section-head">📖 黑话大全（在册 {{ t.refs.length }} 条 · 已被抽查 {{ t.gala.quizzed }} 次）</p>
          <div class="inline-form">
            <el-input v-model="refTerm" :maxlength="TERM_MAX" placeholder="黑话本体（如「二次晚安」，≤40 字）" data-testid="couple-theater-ref-term" />
            <el-input v-model="refMeaning" :maxlength="REF_FIELD_MAX" placeholder="到底是什么意思（≤200 字）" data-testid="couple-theater-ref-meaning" />
            <el-input v-model="refOrigin" :maxlength="REF_FIELD_MAX" placeholder="哪一天开始的（可不写，≤200 字）" data-testid="couple-theater-ref-origin" />
            <el-button size="small" type="primary" data-testid="couple-theater-ref-submit" @click="onRefAdd">收进大全 📖</el-button>
          </div>
          <p v-if="!t.refs.length" class="empty-line">大全空白着，先把那个说了八百遍的梗定义清楚 📖</p>
          <div
            v-for="r in t.refs"
            :key="r.id"
            class="ref-row"
            :class="refClass(r)"
            :data-testid="`couple-theater-ref-${r.id}`"
          >
            <p class="ref-head">
              <b class="ref-term-text" :data-testid="`couple-theater-ref-term-text-${r.id}`">「{{ r.term }}」</b>
              <span class="who-chip" :data-testid="`couple-theater-ref-who-${r.id}`">{{ r.mine ? '我收的 🙋' : '💕 TA 收的' }}</span>
              <span class="verdict-chip" :data-testid="`couple-theater-ref-judged-${r.id}`">{{ refJudgedText(r) }}</span>
            </p>
            <!-- 抽查凭记忆答，判卷前先把释义遮住（自己收的那条当然看得到） -->
            <p v-if="r.mine || !r.canQuiz" class="ref-meaning" :data-testid="`couple-theater-ref-meaning-${r.id}`">意思：{{ r.meaning }}</p>
            <p v-else class="ref-blind" :data-testid="`couple-theater-ref-blind-${r.id}`">🙈 释义先遮住——凭记忆答，等收录人判完卷才公开</p>
            <p v-if="r.origin" class="ref-origin" :data-testid="`couple-theater-ref-origin-text-${r.id}`">出处：{{ r.origin }}</p>
            <p v-if="r.quizAnswer" class="ref-answer" :data-testid="`couple-theater-ref-answer-${r.id}`">
              ✍️ 抽查作答（{{ r.quizBy || 'TA' }}）：{{ r.quizAnswer }}
            </p>
            <!-- 作答：只有 TA 收的、且我还没答过的词条才给作答钮（后端 canQuiz 算好） -->
            <div v-if="r.canQuiz" class="inline-form">
              <el-input
                v-model="quizDraft[r.id]"
                :maxlength="REF_FIELD_MAX"
                placeholder="别翻大全，凭记忆写一句意思（≤200 字）"
                :data-testid="`couple-theater-ref-quiz-input-${r.id}`"
              />
              <el-button size="small" type="primary" plain :data-testid="`couple-theater-ref-quiz-btn-${r.id}`" @click="onRefQuiz(r)">交这份抽查 📝</el-button>
            </div>
            <!-- 判卷：归收录人，且要 TA 先答（后端 canJudge 算好） -->
            <div v-else-if="r.canJudge" class="inline-form">
              <el-button size="small" type="success" plain :data-testid="`couple-theater-ref-right-${r.id}`" @click="onRefJudge(r, true)">记住了 ✔</el-button>
              <el-button size="small" type="warning" plain :data-testid="`couple-theater-ref-wrong-${r.id}`" @click="onRefJudge(r, false)">记岔了 😝</el-button>
            </div>
            <p v-else-if="r.mine && !r.quizBy" class="wait-line" :data-testid="`couple-theater-ref-quizwait-${r.id}`">TA 还没答这条，判什么卷 ⏳</p>
          </div>
        </div>
      </template>
      <p v-else class="empty-line">电话线还没接…</p>
    </CoupleCollapsible>

    <!-- F305 每日奥斯卡 + F306 如果我是你爸妈 -->
    <CoupleCollapsible testid="couple-theater-act" :empty="!hasActStuff">
      <template #title>🏆 每日奥斯卡与家长题 <span class="sub">给 TA 今天那场戏递一张提名，附上证据；再答一道「如果我是你爸妈」，两份答卷齐了才互见</span></template>
      <template v-if="t">
        <p class="section-head">🏆 今日最佳演技提名（一人一天一张，改主意可以重写证据）</p>
        <el-input
          v-model="awardEvidence"
          :maxlength="EVIDENCE_MAX"
          show-word-limit
          placeholder="证据一句：TA 今天哪场戏最到位（≤140 字）"
          data-testid="couple-theater-award-evidence"
        />
        <div class="inline-form">
          <el-button size="small" type="primary" data-testid="couple-theater-award-submit" @click="onAward">
            {{ todayAward ? '改写我这张提名 🔁' : '递出提名 🏆' }}
          </el-button>
          <span v-if="todayAward" class="lit-chip" data-testid="couple-theater-award-mine-today">我今天已经递过一张了，证据还能改 🏆</span>
          <span v-else class="wait-chip" data-testid="couple-theater-award-none">今天还没人提名，评委席空着 🏆</span>
        </div>
        <p v-if="!awardRows.length" class="empty-line">提名册子还空着，别吝啬那句「你今天演得真好」🏆</p>
        <div v-for="a in awardRows" :key="`${a.day}-${a.fromUser}`" class="award-row" :data-testid="`couple-theater-award-${a.day}-${a.fromUser}`">
          <p class="award-head">
            <span class="day-chip" :data-testid="`couple-theater-award-day-${a.day}-${a.fromUser}`">{{ a.day }}</span>
            <span class="who-chip" :data-testid="`couple-theater-award-who-${a.day}-${a.fromUser}`">{{ a.mine ? '我递的提名 🙋' : '💕 TA 递给我的' }}</span>
            <span class="award-about" :data-testid="`couple-theater-award-about-${a.day}-${a.fromUser}`">🏆 被提名：{{ a.aboutUser }}</span>
          </p>
          <p class="award-evidence" :data-testid="`couple-theater-award-evidence-text-${a.day}-${a.fromUser}`">证据：{{ a.evidence }}</p>
          <p class="award-line" :data-testid="`couple-theater-award-line-${a.day}-${a.fromUser}`">🎬 {{ a.line }}</p>
          <el-button
            v-if="a.mine"
            size="small"
            plain
            :data-testid="`couple-theater-award-edit-${a.day}-${a.fromUser}`"
            @click="startAwardEdit(a)"
          >把这张的证据改一句 ✍️</el-button>
        </div>

        <!-- F306 家长题 -->
        <div class="block">
          <p class="section-head">👨‍👩‍👦 今日家长题（{{ t.family.day }} 那道，两份答卷都交齐才互见）</p>
          <p class="family-question" data-testid="couple-theater-family-question">{{ t.family.question }}</p>
          <el-input
            v-model="familyAnswer"
            :maxlength="FAMILY_ANSWER_MAX"
            show-word-limit
            placeholder="被家长问了，总得答一句（≤200 字）"
            data-testid="couple-theater-family-answer"
          />
          <div class="inline-form">
            <el-button size="small" type="primary" data-testid="couple-theater-family-submit" @click="onFamily">
              {{ t.family.myAnswer ? '改写我的答卷 🔁' : '交答卷 👨‍👩‍👦' }}
            </el-button>
            <span v-if="t.family.bothIn" class="lit-chip" data-testid="couple-theater-family-both">两份答卷齐了——原来你俩挡的是同一件事 💫</span>
            <span v-else class="wait-chip" data-testid="couple-theater-family-wait">{{ t.family.myAnswer ? '等 TA 也交一份 ⏳' : '你还没答，答完才看 TA 那份 ⏳' }}</span>
          </div>
          <p class="family-line is-mine" data-testid="couple-theater-family-mine">🙋 我的答案：{{ t.family.myAnswer || '还没落笔' }}</p>
          <p v-if="t.family.partnerAnswer" class="family-line is-partner" data-testid="couple-theater-family-partner">💕 TA 的答案：{{ t.family.partnerAnswer }}</p>
        </div>
      </template>
      <p v-else class="empty-line">评委席还没摆好…</p>
    </CoupleCollapsible>

    <!-- F307 双角色追剧 + F308 今日客服 + F309 冷知识颁奖礼 -->
    <CoupleCollapsible testid="couple-theater-house" :empty="!hasHouseStuff">
      <template #title>🏠 双角色追剧 · 今日客服 · 颁奖礼 <span class="sub">同一部剧你俩各认领一个角色、各写各的角色日记，两条线都剧终才并排看；日常小事走工单，客服就是 TA</span></template>
      <template v-if="t">
        <p class="section-head">🎭 双角色追剧（同部剧各演一个角色，追更不停笔）</p>
        <div class="inline-form">
          <el-input v-model="mWork" :maxlength="WORK_MAX" placeholder="剧目名（≤40 字）" data-testid="couple-theater-movie-work" />
          <el-input
            v-model="mRole"
            :maxlength="ROLE_NAME_MAX"
            placeholder="我演哪个角色（≤20 字）"
            :disabled="!!editingWork && claimedRole !== ''"
            data-testid="couple-theater-movie-role"
          />
          <el-input v-model="mEntry" :maxlength="MOVIE_ENTRY_MAX" placeholder="这个角色今天在想什么（≤200 字，可续写）" data-testid="couple-theater-movie-entry" />
          <el-button size="small" type="primary" data-testid="couple-theater-movie-submit" @click="onMovie">
            {{ editingWork ? `续写《${editingWork}》🎭` : '认领角色并开写 🎭' }}
          </el-button>
          <el-button v-if="editingWork" size="small" link data-testid="couple-theater-movie-cancel" @click="resetMovieForm">换个本子 ✕</el-button>
        </div>
        <p v-if="editingWork" class="hint-line" data-testid="couple-theater-movie-editing">
          正在往《{{ editingWork }}》我那条线后面续写{{ claimedRole ? `（角色「${claimedRole}」已经定了，改不动名）` : '（这次填的角色名就定下来了）' }}🎭
        </p>
        <p v-if="!t.movies.length" class="empty-line">片场还没开机，先挑一部你俩都在追的 🎭</p>
        <div
          v-for="(m, i) in t.movies"
          :key="m.work"
          class="movie-row"
          :class="{ 'is-finished': m.finished }"
          :data-testid="`couple-theater-movie-${i}`"
        >
          <p class="movie-head">
            <b class="movie-work" :data-testid="`couple-theater-movie-work-text-${i}`">《{{ m.work }}》</b>
            <span class="status-chip" :data-testid="`couple-theater-movie-status-${i}`">{{ movieStatusText(m) }}</span>
            <span class="who-chip" :data-testid="`couple-theater-movie-claim-${i}`">{{ m.myRole ? '我已进组 🙋' : '我还没进组 🎬' }}</span>
          </p>
          <p class="movie-line is-mine" :data-testid="`couple-theater-movie-my-${i}`">
            🙋 我演「{{ m.myRole || '（还没认领）' }}」：{{ m.myDiary || '这个角色今天还没开口' }}
          </p>
          <p class="movie-line is-partner" :data-testid="`couple-theater-movie-tarole-${i}`">💕 TA 演「{{ m.partnerRole || '还没认领' }}」</p>
          <p v-if="m.partnerDiary" class="movie-diary" :data-testid="`couple-theater-movie-tadiary-${i}`">📜 双视角剧本合上了，TA 那条线：{{ m.partnerDiary }}</p>
          <p v-else-if="!m.finished" class="wait-line" :data-testid="`couple-theater-movie-wait-${i}`">两条线都剧终了才给看 TA 的角色日记 ⏳</p>
          <div class="inline-form">
            <el-button size="small" plain :data-testid="`couple-theater-movie-write-${i}`" @click="startMovieEdit(m)">
              {{ m.myRole ? '续写我这条线 ✍️' : '认领一个角色 🎭' }}
            </el-button>
            <el-button
              v-if="m.myRole && !m.finished"
              size="small"
              type="warning"
              plain
              :data-testid="`couple-theater-movie-finish-${i}`"
              @click="onMovieFinish(m)"
            >我这一路剧终 🎬</el-button>
          </div>
        </div>

        <!-- F308 今日客服 -->
        <div class="block">
          <p class="section-head">🛎️ 今日客服（30 分钟内响应，评 1-2 星的话客服还有一次申诉机会）</p>
          <div class="inline-form">
            <el-input v-model="orderNote" :maxlength="NOTE_MAX" placeholder="提一件合理的小事（≤80 字，别写「陪我到永远」）" data-testid="couple-theater-order-note" />
            <el-button size="small" type="primary" data-testid="couple-theater-order-submit" @click="onOrder">下这单 🛎️</el-button>
            <span class="count-badge" data-testid="couple-theater-order-count">工单簿 {{ t.tickets.length }} 张 · 准时 {{ t.gala.onTimeOrders }} 张</span>
          </div>
          <p v-if="!t.tickets.length" class="empty-line">今天没单，客服在柜台后面打瞌睡 🛎️</p>
          <div
            v-for="k in t.tickets"
            :key="k.id"
            class="order-row"
            :class="`is-${k.status.toLowerCase()}`"
            :data-testid="`couple-theater-order-${k.id}`"
          >
            <p class="order-head">
              <b class="order-note-text" :data-testid="`couple-theater-order-note-text-${k.id}`">{{ k.note }}</b>
              <span class="who-chip" :data-testid="`couple-theater-order-who-${k.id}`">{{ k.mineCustomer ? '我是顾客 🙋' : '💕 TA 下的单，我是客服' }}</span>
              <span class="status-chip" :data-testid="`couple-theater-order-status-${k.id}`">{{ orderStatusText(k) }}</span>
            </p>
            <p v-if="k.status === 'OPEN'" class="wait-chip" :data-testid="`couple-theater-order-wait-${k.id}`">
              {{ k.mineCustomer ? '已经等了 ' + k.waitMinutes + ' 分钟，自己的单自己接不了，等 TA 上线 🕔' : '这单在等客服上线，已经晾了 ' + k.waitMinutes + ' 分钟 🕔' }}
            </p>
            <p v-else class="lit-chip" :class="{ 'is-late': !k.onTime }" :data-testid="`couple-theater-order-ontime-${k.id}`">
              {{ k.onTime ? '客服 30 分钟内响应 ✅' : '客服响应到了，但超时了 ⏰' }}
            </p>
            <!-- 接单：只有非下单人能接（canAnswer 后端算好） -->
            <el-button
              v-if="k.canAnswer"
              size="small"
              type="primary"
              :data-testid="`couple-theater-order-answer-${k.id}`"
              @click="onOrderAnswer(k)"
            >客服上线，这单我接了 🛎️</el-button>
            <!-- 评分：只有顾客在接单之后能评 -->
            <div v-if="k.canScore" class="rate-row">
              <el-button
                v-for="s in 5"
                :key="s"
                size="small"
                plain
                :data-testid="`couple-theater-order-score-${k.id}-${s}`"
                @click="onOrderScore(k, s)"
              >{{ '★'.repeat(s) }}</el-button>
            </div>
            <p v-if="k.score !== null" class="score-line" :data-testid="`couple-theater-order-score-text-${k.id}`">
              顾客给出 {{ k.score }} 星{{ k.score <= 2 ? '（差评一枚，客服有脸申诉一次 😤）' : '（客服本月绩效稳了 ⭐）' }}
            </p>
            <!-- 申诉：只有客服本人对 1-2 星能递一次 -->
            <div v-if="k.canAppeal" class="inline-form">
              <el-input
                v-model="appealDraft[k.id]"
                :maxlength="NOTE_MAX"
                placeholder="申诉理由一句（≤80 字）"
                :data-testid="`couple-theater-order-appeal-input-${k.id}`"
              />
              <el-button size="small" type="warning" plain :data-testid="`couple-theater-order-appeal-btn-${k.id}`" @click="onOrderAppeal(k)">递这份申诉 🧾</el-button>
            </div>
            <p v-if="k.appeal" class="appeal-line" :data-testid="`couple-theater-order-appeal-${k.id}`">🧾 客服申诉：{{ k.appeal }}</p>
          </div>
        </div>

        <!-- F309 冷知识颁奖礼 -->
        <div class="block">
          <p class="section-head">🎟️ 今日冷知识颁奖礼（{{ t.gala.day }}，奖杯全凭这几天攒出来的数据）</p>
          <div class="gala-card" data-testid="couple-theater-gala">
            <p class="gala-prize" data-testid="couple-theater-gala-prize">🏅 {{ t.gala.prize }}</p>
            <p class="gala-line" data-testid="couple-theater-gala-line">{{ t.gala.line }}</p>
            <p class="gala-stats" data-testid="couple-theater-gala-stats">
              奥斯卡提名 {{ t.gala.nominations }} 张 · 黑话在册 {{ t.gala.terms }} 条 · 被抽查 {{ t.gala.quizzed }} 次 · 记住了 {{ t.gala.rights }} 条 ·
              互换日记双齐 {{ t.gala.diaryDays }} 天 · 工单 {{ t.gala.orders }} 张（其中准时 {{ t.gala.onTimeOrders }} 张）
            </p>
          </div>
        </div>
      </template>
      <p v-else class="empty-line">场记板还没打响…</p>
    </CoupleCollapsible>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { theaterApi } from '@/api/couple'
import type { CoupleTheaterAwardVO, CoupleTheaterDiaryVO, CoupleTheaterMovieVO, CoupleTheaterRefVO, CoupleTheaterTicketVO, CoupleTheaterVO } from '@/types'
import CoupleCollapsible from './CoupleCollapsible.vue'

/** 限长常量抄自后端 CoupleTheaterService（只用于输入框限长与提示文案，业务判定一律留在后端 400 直透） */
const DIARY_MAX = 300
const BOOTH_MAX = 300
const TERM_MAX = 40
const REF_FIELD_MAX = 200
const EVIDENCE_MAX = 140
const FAMILY_ANSWER_MAX = 200
const WORK_MAX = 40
const ROLE_NAME_MAX = 20
const MOVIE_ENTRY_MAX = 200
const NOTE_MAX = 80
const REVIEW_MAX = 100

/** 整份今日剧场总览（除 theaterToday 外 16 个写接口全部返回整份 TheaterVO，整体替换即五卡刷新） */
const t = ref<CoupleTheaterVO | null>(null)

// ---- 草稿 ----
const diaryText = ref('')
const reviewText = ref('')
const boothKind = ref<'FUTURE' | 'PAST'>('FUTURE')
const boothText = ref('')
const refTerm = ref('')
const refMeaning = ref('')
const refOrigin = ref('')
const quizDraft = ref<Record<string, string>>({})
const awardEvidence = ref('')
const familyAnswer = ref('')
const mWork = ref('')
const mRole = ref('')
const mEntry = ref('')
const editingWork = ref('')
const orderNote = ref('')
const appealDraft = ref<Record<string, string>>({})

// ---- 派生 ----
/** 今天那一页互换日记（后端按 day 倒序下发全量历史） */
const todayDiary = computed<CoupleTheaterDiaryVO | null>(() => {
  if (!t.value) return null
  return t.value.diaries.find((d) => d.day === t.value?.day) ?? null
})
const pastDiaries = computed(() => (t.value?.diaries ?? []).filter((d) => d.day !== t.value?.day))
/** 我今天递过的那张提名（一人一天一张，回填进表单可改写） */
const todayAward = computed<CoupleTheaterAwardVO | null>(() => {
  if (!t.value) return null
  return t.value.awards.find((a) => a.mine && a.day === t.value?.day) ?? null
})
/** 陈列行：我今天那张活在表单里，不重复列 */
const awardRows = computed(() => (t.value?.awards ?? []).filter((a) => !(a.mine && a.day === t.value?.day)))
const claimedRole = computed(() => (t.value?.movies ?? []).find((m) => m.work === editingWork.value)?.myRole ?? '')
const serveRatio = computed(() => {
  const m = t.value?.master
  if (!m || m.serveTarget <= 0) return '0%'
  return `${Math.min(100, Math.round((m.serveCount / m.serveTarget) * 100))}%`
})

const hasSwapStuff = computed(
  () => !!t.value && (t.value.diaries.length > 0 || t.value.master.serveCount > 0 || t.value.master.grade !== '' || t.value.master.review !== ''),
)
const hasBoothStuff = computed(() => !!t.value && (t.value.booths.length > 0 || t.value.refs.length > 0))
const hasActStuff = computed(
  () => !!t.value && (t.value.awards.length > 0 || t.value.family.myAnswer !== '' || t.value.family.partnerAnswer !== ''),
)
const hasHouseStuff = computed(
  () => !!t.value && (t.value.movies.length > 0 || t.value.tickets.length > 0 || t.value.gala.nominations > 0 || t.value.gala.orders > 0),
)

function refJudgedText(r: CoupleTheaterRefVO): string {
  if (r.judged === 'RIGHT') return '记住了 ✔ 这梗长进脑子里了'
  if (r.judged === 'WRONG') return '记岔了 😝 下次谁先忘谁请客'
  return r.quizBy ? '等收录人判卷 ✍️' : '还没抽查 ⏳'
}

function refClass(r: CoupleTheaterRefVO): string {
  if (r.judged === 'RIGHT') return 'is-right'
  if (r.judged === 'WRONG') return 'is-wrong'
  return r.quizBy ? 'is-quizzed' : 'is-open'
}

function movieStatusText(m: CoupleTheaterMovieVO): string {
  if (m.finished) return '双视角剧本已合上 📜'
  if (!m.bothClaimed) return '一条线在演，等 TA 进组 🎬'
  return '双人在演，还没剧终 🎭'
}

function orderStatusText(k: CoupleTheaterTicketVO): string {
  if (k.status === 'OPEN') return '待接单 🕔'
  if (k.status === 'ANSWERED') return '客服已接单 🛎️'
  if (k.status === 'RATED') return '顾客已评 ⭐'
  return '客服申诉过 🧾'
}

function onError(e: unknown, fallback: string) {
  // 后端 400 的中文 message 直接透传（例如「侍奉不满 3 次，先留级吧」）
  ElMessage.error(e instanceof Error ? e.message : fallback)
}

/** 写接口统一返回整份 TheaterVO：整体替换 + 回填三个「本人可改写」的输入框 */
function refresh(data: CoupleTheaterVO | null | undefined) {
  if (!data) return
  t.value = data
  const today = data.diaries.find((d) => d.day === data.day)
  diaryText.value = today?.mine ?? ''
  const mine = data.awards.find((a) => a.mine && a.day === data.day)
  awardEvidence.value = mine?.evidence ?? ''
  familyAnswer.value = data.family.myAnswer
}

// ---- F300 日终演技分 ----
async function onRate(score: number) {
  try {
    refresh(await theaterApi.theaterRate(score))
    ElMessage.success(`这一笔落下了：${score} 星 🎬 明天的戏接着演`)
  } catch (e) {
    onError(e, '打演技分失败')
  }
}

// ---- F301 互换日记 ----
async function onDiary() {
  const text = diaryText.value.trim()
  if (!text) {
    ElMessage.warning('这一页总得写点什么，空着不算扮演 📖')
    return
  }
  try {
    refresh(await theaterApi.theaterDiary(text))
    ElMessage.success('这一页写好了，等 TA 那页凑一对 📖')
  } catch (e) {
    onError(e, '写日记失败')
  }
}

// ---- F302 师徒日 ----
async function onServe() {
  try {
    refresh(await theaterApi.theaterServe())
    ElMessage.success('今日侍奉已记账，师父可以验收 🧎')
  } catch (e) {
    onError(e, '打卡失败')
  }
}

async function onReview(grade: 'GRADUATED' | 'REPEAT') {
  const review = reviewText.value.trim()
  try {
    refresh(await theaterApi.theaterReview(review, grade))
    reviewText.value = ''
    ElMessage.success(grade === 'GRADUATED' ? '章盖下去了：这一届出师 🎓' : '留级通知已送达，下周继续 🔁')
  } catch (e) {
    onError(e, '定级失败')
  }
}

// ---- F303 时空电话亭 ----
async function onBooth() {
  const text = boothText.value.trim()
  if (!text) {
    ElMessage.warning('都拨号了，总要说一句 📞')
    return
  }
  try {
    refresh(await theaterApi.theaterBooth(boothKind.value, text))
    boothText.value = ''
    ElMessage.success(boothKind.value === 'PAST' ? '一年前的线接通了，杂音挺像那时候 📞' : '封好了，一年后自动接通 📞')
  } catch (e) {
    onError(e, '打电话失败')
  }
}

// ---- F304 黑话大全 ----
async function onRefAdd() {
  const term = refTerm.value.trim()
  const meaning = refMeaning.value.trim()
  if (!term || !meaning) {
    ElMessage.warning('词条本体和意思都得写，不然明年谁都看不懂 📖')
    return
  }
  try {
    refresh(await theaterApi.theaterRefAdd(term, meaning, refOrigin.value.trim()))
    refTerm.value = ''
    refMeaning.value = ''
    refOrigin.value = ''
    ElMessage.success(`「${term}」进大全了，下次抽查就考这个 📖`)
  } catch (e) {
    onError(e, '收录失败')
  }
}

async function onRefQuiz(r: CoupleTheaterRefVO) {
  const answer = (quizDraft.value[r.id] ?? '').trim()
  if (!answer) {
    ElMessage.warning('凭记忆写一句意思就行，空白卷不认 📝')
    return
  }
  try {
    refresh(await theaterApi.theaterRefQuiz(r.term, answer))
    quizDraft.value = { ...quizDraft.value, [r.id]: '' }
    ElMessage.success('抽查卷交上去了，等收录人判卷 ✍️')
  } catch (e) {
    onError(e, '交抽查卷失败')
  }
}

async function onRefJudge(r: CoupleTheaterRefVO, right: boolean) {
  try {
    refresh(await theaterApi.theaterRefJudge(r.term, right))
    ElMessage.success(right ? `判了：「${r.term}」记住了 ✔` : `判了：「${r.term}」记岔了 😝 释义公开`)
  } catch (e) {
    onError(e, '判卷失败')
  }
}

// ---- F305 每日奥斯卡 ----
async function onAward() {
  const evidence = awardEvidence.value.trim()
  if (!evidence) {
    ElMessage.warning('提名要写一句证据，「演得好」太空了 🏆')
    return
  }
  try {
    refresh(await theaterApi.theaterAward(evidence))
    ElMessage.success('提名递出去了，颁奖礼上见 🏆')
  } catch (e) {
    onError(e, '递提名失败')
  }
}

function startAwardEdit(a: CoupleTheaterAwardVO) {
  awardEvidence.value = a.evidence
}

// ---- F306 家长题 ----
async function onFamily() {
  const answer = familyAnswer.value.trim()
  if (!answer) {
    ElMessage.warning('被家长问了，总得答一句 👨‍👩‍👦')
    return
  }
  try {
    refresh(await theaterApi.theaterFamily(answer))
    ElMessage.success('答卷交上去了，等 TA 那份来对照 👨‍👩‍👦')
  } catch (e) {
    onError(e, '交答卷失败')
  }
}

// ---- F307 双角色追剧 ----
function resetMovieForm() {
  mWork.value = ''
  mRole.value = ''
  mEntry.value = ''
  editingWork.value = ''
}

function startMovieEdit(m: CoupleTheaterMovieVO) {
  mWork.value = m.work
  mRole.value = m.myRole
  mEntry.value = ''
  editingWork.value = m.work
}

async function onMovie() {
  const work = mWork.value.trim()
  const roleName = mRole.value.trim()
  if (!work || !roleName) {
    ElMessage.warning('剧目名和角色名都得写，光报名字不认领可不行 🎭')
    return
  }
  try {
    refresh(await theaterApi.theaterMovie(work, roleName, mEntry.value.trim()))
    resetMovieForm()
    ElMessage.success(`《${work}》里你这条线又往前走了一段 🎭`)
  } catch (e) {
    onError(e, '写角色日记失败')
  }
}

async function onMovieFinish(m: CoupleTheaterMovieVO) {
  try {
    refresh(await theaterApi.theaterMovieFinish(m.work))
    ElMessage.success(`《${m.work}》你这一路剧终了，等 TA 收尾合剧本 🎬`)
  } catch (e) {
    onError(e, '剧终失败')
  }
}

// ---- F308 今日客服 ----
async function onOrder() {
  const note = orderNote.value.trim()
  if (!note) {
    ElMessage.warning('工单要写清要什么，空着客服没法干 🛎️')
    return
  }
  try {
    refresh(await theaterApi.theaterOrder(note))
    orderNote.value = ''
    ElMessage.success('单子发出去了，30 分钟内等 TA 上线 🛎️')
  } catch (e) {
    onError(e, '下单失败')
  }
}

async function onOrderAnswer(k: CoupleTheaterTicketVO) {
  try {
    refresh(await theaterApi.theaterOrderAnswer(k.id))
    ElMessage.success('客服上线接单，态度端正 🛎️')
  } catch (e) {
    onError(e, '接单失败')
  }
}

async function onOrderScore(k: CoupleTheaterTicketVO, score: number) {
  try {
    refresh(await theaterApi.theaterOrderScore(k.id, score))
    ElMessage.success(score <= 2 ? `给了 ${score} 星，客服脸都绿了 😤` : `给了 ${score} 星，客服绩效稳了 ⭐`)
  } catch (e) {
    onError(e, '评分失败')
  }
}

async function onOrderAppeal(k: CoupleTheaterTicketVO) {
  const appeal = (appealDraft.value[k.id] ?? '').trim()
  if (!appeal) {
    ElMessage.warning('申诉要写一句理由，空口申诉不受理 🧾')
    return
  }
  try {
    refresh(await theaterApi.theaterOrderAppeal(k.id, appeal))
    appealDraft.value = { ...appealDraft.value, [k.id]: '' }
    ElMessage.success('申诉递上去了，判词由颁奖礼宣读 🧾')
  } catch (e) {
    onError(e, '申诉失败')
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
  const data = await safeLoad(theaterApi.theaterToday, null)
  t.value = data
  if (data) {
    diaryText.value = data.diaries.find((d) => d.day === data.day)?.mine ?? ''
    awardEvidence.value = data.awards.find((a) => a.mine && a.day === data.day)?.evidence ?? ''
    familyAnswer.value = data.family.myAnswer
  }
})
</script>

<style scoped>
/* 主色剧幕青绿 #0d9488（老剧场的绒布侧幕 + 门口霓虹灯牌，跟扮演剧场的「灯一亮就变成另一个人」最贴；
   区别于粉红 / #409eff 公司蓝 / #d2691e 工坊橙棕 / #d93a3a 中国红 / #9254de 倾听紫 /
   #c0392b 庆典金红 / #2c7a7b 考据墨青（低饱和书卷灰青，与本批高饱和台绿不同屏不同调）/ #3f51b5 靛蓝，
   也避开了 #7c3aed——它是全局聊天气泡渐变色，不能挪作分区主色）
   折叠卡标题色经 --collapse-title-color 级联给 CoupleCollapsible，故本组件不写 .title 规则 */
.couple-theater { display: flex; flex-direction: column; gap: 14px; --collapse-title-color: #0d9488; }
.sub { font-size: 12px; color: var(--im-muted, #909399); font-weight: normal; margin-left: 6px; }
.section-head { margin: 10px 0 4px; font-size: 13px; font-weight: bold; color: #0d9488; }
.block { margin-top: 12px; padding-top: 8px; border-top: 1px dashed var(--im-border, #ebeef5); }
.inline-form { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 8px; }
.inline-form .el-input { flex: 1; min-width: 150px; }
.empty-line { margin: 8px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.hint-line { margin: 6px 0 0; font-size: 12px; color: #0d9488; }
.wait-line { margin: 6px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.wait-chip { font-size: 12px; color: #b8860b; }
.who-chip { font-size: 11px; color: var(--im-muted, #909399); }
.day-chip, .status-chip { font-size: 11px; color: #0d9488; background: rgba(13, 148, 136, 0.12); padding: 1px 8px; border-radius: 10px; }
.lit-chip { font-size: 12px; color: #67c23a; background: rgba(103, 194, 58, 0.1); padding: 2px 8px; border-radius: 6px; }
.lit-chip.is-late { color: #e6a23c; background: rgba(230, 162, 60, 0.12); }
.count-badge { display: inline-block; margin: 0 0 4px; font-size: 13px; font-weight: bold; color: #0d9488; background: rgba(13, 148, 136, 0.1); padding: 3px 10px; border-radius: 12px; }
.verdict-chip { font-size: 11px; color: var(--im-muted, #909399); background: rgba(13, 148, 136, 0.08); padding: 1px 8px; border-radius: 10px; }
.rate-row { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
/* F300 身份签 */
.role-card { padding: 9px 11px; border-radius: 8px; border-left: 3px solid #0d9488; background: rgba(13, 148, 136, 0.06); }
.role-name { margin: 0; font-size: 16px; font-weight: bold; color: #0d9488; }
.role-guide { margin: 4px 0 6px; font-size: 13px; color: var(--im-text, #303133); }
.role-score { margin: 6px 0 0; font-size: 13px; color: #0d9488; }
/* F301 互换日记 */
.diary-line { margin: 4px 0 0; font-size: 13px; color: var(--im-text, #303133); white-space: pre-wrap; }
.diary-line.is-partner { color: #0d9488; }
.diary-card { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid var(--im-border, #ebeef5); font-size: 13px; }
.diary-card.is-both { border-left-color: #0d9488; }
.diary-head { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; margin: 0; }
.diary-day { color: #0d9488; }
/* F302 师徒日 */
.master-who { margin: 4px 0; font-size: 13px; color: var(--im-text, #303133); }
.master-count { margin: 2px 0 4px; font-size: 12px; color: var(--im-muted, #909399); }
.progress-bar { height: 6px; border-radius: 4px; background: rgba(13, 148, 136, 0.15); overflow: hidden; }
.progress-bar i { display: block; height: 100%; background: #0d9488; }
.master-review { margin: 6px 0 0; font-size: 13px; color: var(--im-text, #303133); }
.grade-chip { display: inline-block; margin-top: 6px; font-size: 12px; font-weight: bold; padding: 2px 10px; border-radius: 10px; }
.grade-chip.is-out { color: #67c23a; background: rgba(103, 194, 58, 0.12); }
.grade-chip.is-repeat { color: #e6a23c; background: rgba(230, 162, 60, 0.12); }
/* F303 电话亭 */
.kind-group { display: flex; gap: 12px; flex-wrap: wrap; }
.booth-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid #0d9488; font-size: 13px; }
.booth-row.is-sealed { border-left-color: #b8860b; opacity: 0.92; }
.booth-head { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; margin: 0; }
.kind-chip { font-size: 11px; font-weight: bold; color: #0d9488; }
.booth-text { margin: 4px 0 0; color: var(--im-text, #303133); white-space: pre-wrap; }
.booth-connected { margin: 4px 0 0; font-size: 12px; color: #67c23a; }
.booth-static { margin: 2px 0 0; font-size: 13px; color: #0d9488; font-style: italic; }
/* F304 黑话大全 */
.ref-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid var(--im-border, #ebeef5); font-size: 13px; }
.ref-row.is-right { border-left-color: #67c23a; }
.ref-row.is-wrong { border-left-color: #e6a23c; }
.ref-row.is-quizzed { border-left-color: #0d9488; }
.ref-head { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; margin: 0; }
.ref-term-text { color: #0d9488; font-size: 14px; }
.ref-meaning { margin: 3px 0 0; color: var(--im-text, #303133); }
.ref-blind { margin: 3px 0 0; font-size: 12px; color: #b8860b; }
.ref-origin { margin: 3px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.ref-answer { margin: 3px 0 0; font-size: 12px; color: #0d9488; }
/* F305 奥斯卡 */
.award-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid #b8860b; font-size: 13px; }
.award-head { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; margin: 0; }
.award-about { font-size: 12px; color: #b8860b; font-weight: bold; }
.award-evidence { margin: 4px 0 0; color: var(--im-text, #303133); }
.award-line { margin: 3px 0 0; font-size: 12px; color: #0d9488; }
/* F306 家长题 */
.family-question { margin: 4px 0; padding: 7px 10px; border-radius: 8px; font-size: 14px; color: #0d9488; background: rgba(13, 148, 136, 0.08); }
.family-line { margin: 3px 0 0; font-size: 13px; color: var(--im-text, #303133); }
.family-line.is-partner { color: #0d9488; }
/* F307 双角色追剧 */
.movie-row { margin: 8px 0; padding: 8px 11px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid #0d9488; font-size: 13px; }
.movie-row.is-finished { border-left-color: #b8860b; }
.movie-head { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; margin: 0; }
.movie-work { color: #0d9488; font-size: 14px; }
.movie-line { margin: 3px 0 0; color: var(--im-text, #303133); }
.movie-line.is-partner { color: var(--im-muted, #909399); }
.movie-diary { margin: 4px 0 0; padding: 5px 8px; border-radius: 6px; font-size: 12px; color: #0d9488; background: rgba(13, 148, 136, 0.08); white-space: pre-wrap; }
/* F308 今日客服 */
.order-row { margin: 6px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid #0d9488; font-size: 13px; }
.order-row.is-open { border-left-color: #e6a23c; }
.order-row.is-rated, .order-row.is-appealed { border-left-color: #67c23a; }
.order-head { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; margin: 0; }
.order-note-text { color: var(--im-text, #303133); }
.score-line { margin: 4px 0 0; font-size: 12px; color: #b8860b; }
.appeal-line { margin: 4px 0 0; font-size: 12px; color: #0d9488; }
/* F309 颁奖礼 */
.gala-card { padding: 9px 11px; border-radius: 8px; background: rgba(184, 134, 11, 0.08); border-left: 3px solid #b8860b; }
.gala-prize { margin: 0; font-size: 15px; font-weight: bold; color: #b8860b; }
.gala-line { margin: 4px 0; font-size: 13px; color: var(--im-text, #303133); }
.gala-stats { margin: 0; font-size: 12px; color: var(--im-muted, #909399); }
</style>

<template>
  <div class="couple-repair" data-testid="couple-repair">
    <!-- F320 冷冻解冻规程：挂冷冻 → 三问（挂冷冻的人答）→ 到点双签复温 -->
    <CoupleCollapsible testid="couple-repair-freeze">
      <template #title>🧊 冷冻解冻规程 <span class="sub">吵到要炸先挂一单冷冻，3-24 小时自选——到点前签字也不算数，三问答完、两人都签才算复温</span></template>
      <template v-if="w">
        <!-- 没有在冻的单才给发起表单（全局仅一单在冻，后端挡第二单） -->
        <template v-if="!w.current">
          <p class="section-head">🧊 挂一单冷冻（3-24 小时，全局只挂一单）</p>
          <div class="inline-form">
            <el-input v-model="freezeHours" placeholder="冻几个小时（3-24）" data-testid="couple-repair-freeze-hours" />
            <el-input v-model="freezeReason" :maxlength="REASON_MAX" show-word-limit placeholder="为什么要缓一缓（≤{{ REASON_MAX }} 字，可空）" data-testid="couple-repair-freeze-reason" />
            <el-button size="small" type="primary" data-testid="couple-repair-freeze-start" @click="onFreezeStart">挂上冷冻 🧊</el-button>
          </div>
        </template>
        <!-- 在冻的那单 -->
        <div v-if="w.current" class="freeze-now" :data-testid="`couple-repair-freeze-now-${w.current.id}`">
          <p class="row-head">
            <b class="freeze-title">🧊 在冻：{{ w.current.hours }} 小时</b>
            <span class="who-chip">{{ w.current.mine ? '我挂的 🙋' : '💕 TA 挂的' }}</span>
            <span class="day-chip">{{ w.current.day }}</span>
          </p>
          <p v-if="w.current.reason" class="freeze-reason" :data-testid="`couple-repair-freeze-reason-text-${w.current.id}`">理由：{{ w.current.reason }}</p>
          <p class="freeze-timer" data-testid="couple-repair-freeze-timer">
            {{ w.current.minutesLeft > 0 ? `还剩约 ${w.current.minutesLeft} 分钟` : '到点了，可以复温了 ⏰' }}
          </p>
          <!-- 三问由挂冷冻的人答（后端挡别人答） -->
          <template v-if="w.current.mine && w.current.status === 'FROZEN'">
            <p class="section-head">✍️ 解冻三问（一题一句，答完才好复温）</p>
            <div v-for="q in THAW_QUESTIONS" :key="q.slot" class="inline-form">
              <el-input
                v-model="freezeAnswers[q.slot]"
                :maxlength="ANSWER_MAX"
                show-word-limit
                :placeholder="`${q.hint}（≤${ANSWER_MAX} 字）`"
                :data-testid="`couple-repair-freeze-answer-${q.slot}`"
              />
              <el-button size="small" type="primary" plain :data-testid="`couple-repair-freeze-answer-btn-${q.slot}`" @click="onFreezeAsk(q.slot)">答这题 ✍️</el-button>
            </div>
          </template>
          <p v-else-if="w.current.status === 'FROZEN'" class="wait-line" data-testid="couple-repair-freeze-ask-wait">
            三问由挂冷冻的 TA 来答，你只管到点来签 🫂
          </p>
          <p class="sign-state" data-testid="couple-repair-freeze-sign-state">
            🙋 我{{ w.current.signedMe ? '已签 ✔' : '还没签' }} · 💕 TA{{ w.current.signedPartner ? '已签 ✔' : '还没签' }}
            <template v-if="w.current.questionsDone"> · 三问已答完 ✔</template>
            <template v-else> · 三问还差着 ✍️</template>
          </p>
          <div class="inline-form">
            <!-- 未到点禁签：按钮禁用 + 提示「签了也不算数」（后端同样 400 兜底） -->
            <el-button
              v-if="w.current.canSign"
              size="small"
              type="primary"
              :disabled="w.current.minutesLeft > 0"
              data-testid="couple-repair-freeze-sign"
              @click="onFreezeSign"
            >签解冻 🕊️</el-button>
            <span v-if="w.current.minutesLeft > 0" class="wait-line" data-testid="couple-repair-freeze-wait">
              没到点先别签——签了也不算数，让冷冻把情绪冻硬一点再化 🧊
            </span>
          </div>
        </div>
        <!-- 复温档案 -->
        <p class="section-head">📜 复温档案</p>
        <p v-if="!thawedRows.length" class="empty-line">还没有复温过的单，第一单从今天开始记 🧊</p>
        <div v-for="f in thawedRows" :key="f.id" class="freeze-row" :data-testid="`couple-repair-freeze-row-${f.id}`">
          <p class="row-head">
            <span class="day-chip" :data-testid="`couple-repair-freeze-row-day-${f.id}`">{{ f.day }}</span>
            <span class="who-chip">{{ f.mine ? '我挂的 🙋' : '💕 TA 挂的' }}</span>
            <span class="status-chip" :data-testid="`couple-repair-freeze-row-status-${f.id}`">已复温 🕊️</span>
            <span class="hint-line">冻了 {{ f.hours }} 小时</span>
          </p>
          <p v-if="f.reason" class="freeze-reason">{{ f.reason }}</p>
        </div>
      </template>
      <p v-else class="empty-line">冷冻柜还没通电…</p>
    </CoupleCollapsible>

    <!-- F321 道歉质检与陈列室：六要素自评 → 对方验货 → 通过进陈列室 / 打回重写 -->
    <CoupleCollapsible testid="couple-repair-sorry">
      <template #title>📮 道歉质检与陈列室 <span class="sub">道歉不是「行了我错了」——六要素自评至少 3 项，验货权在对方手里，打回就重写</span></template>
      <template v-if="w">
        <p class="section-head">✍️ 交一封道歉信（六要素自评至少勾 3 项）</p>
        <el-input
          v-model="sorryLetter"
          type="textarea"
          :rows="2"
          :maxlength="LETTER_MAX"
          show-word-limit
          placeholder="道歉信正文（≤{{ LETTER_MAX }} 字，写人话）"
          data-testid="couple-repair-sorry-letter"
        />
        <div class="opt-group">
          <el-checkbox-group v-model="sorryPoints" data-testid="couple-repair-sorry-points">
            <el-checkbox v-for="p in SORRY_POINTS" :key="p.key" :value="p.key" :data-testid="`couple-repair-sorry-pt-${p.key}`">{{ p.label }}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="inline-form">
          <el-button size="small" type="primary" data-testid="couple-repair-sorry-submit" @click="onSorryWrite">交上去验货 📮</el-button>
          <span class="hint-line">六要素：FACT 说清事实 / FEEL 说出感受 / BLAME 不甩锅 / SORRY 认自己那部分 / FIX 给出改法 / ASK 说出你要的</span>
        </div>

        <p class="section-head">🗂️ 信架（验货与陈列）</p>
        <p v-if="!w.sorries.length" class="empty-line">架上还没有信，第一次认真道歉从交一封开始 📮</p>
        <div
          v-for="s in w.sorries"
          :key="s.id"
          class="sorry-row"
          :class="{ 'is-passed': s.status === 'PASSED', 'is-back': s.status === 'BACK' }"
          :data-testid="`couple-repair-sorry-${s.id}`"
        >
          <p class="row-head">
            <span class="who-chip" :data-testid="`couple-repair-sorry-who-${s.id}`">{{ s.mine ? '我写的 🙋' : '💕 TA 写的' }}</span>
            <span class="status-chip" :data-testid="`couple-repair-sorry-status-${s.id}`">{{ sorryStatusText(s) }}</span>
          </p>
          <p class="sorry-letter" :data-testid="`couple-repair-sorry-letter-text-${s.id}`">{{ s.letter }}</p>
          <p v-if="s.points.length" class="hint-line">自评：{{ s.points.map(pointLabel).join(' · ') }}</p>
          <p v-if="s.verdict" class="verdict-line" :data-testid="`couple-repair-sorry-verdict-${s.id}`">批注（{{ s.verifiedBy || 'TA' }}）：{{ s.verdict }}</p>
          <!-- 只有对方交的、还在 VERIFY 的信才给我验货钮（后端挡自己验自己） -->
          <template v-if="s.canVerify">
            <div class="inline-form">
              <el-input
                v-model="verdictDraft[s.id]"
                :maxlength="VERDICT_MAX"
                show-word-limit
                placeholder="批注一句（≤{{ VERDICT_MAX }} 字，打回必填）"
                :data-testid="`couple-repair-sorry-verdict-input-${s.id}`"
              />
            </div>
            <div class="inline-form">
              <el-button size="small" type="primary" plain :data-testid="`couple-repair-sorry-pass-${s.id}`" @click="onSorryVerify(s, true)">验货通过，进陈列室 🏆</el-button>
              <el-button size="small" type="warning" plain :data-testid="`couple-repair-sorry-back-${s.id}`" @click="onSorryVerify(s, false)">打回重写 🙅</el-button>
            </div>
          </template>
          <!-- 我被打回的信：本人重写（重写回 VERIFY 等再验） -->
          <template v-else-if="s.mine && s.status === 'BACK'">
            <div class="inline-form">
              <el-input
                v-model="rewriteLetterDraft[s.id]"
                type="textarea"
                :rows="2"
                :maxlength="LETTER_MAX"
                show-word-limit
                placeholder="重写这封（≤{{ LETTER_MAX }} 字，把差的那几项补上）"
                :data-testid="`couple-repair-sorry-rewrite-letter-${s.id}`"
              />
            </div>
            <div class="opt-group">
              <el-checkbox-group v-model="rewritePointsDraft[s.id]" :data-testid="`couple-repair-sorry-rewrite-points-${s.id}`">
                <el-checkbox v-for="p in SORRY_POINTS" :key="p.key" :value="p.key" :data-testid="`couple-repair-sorry-rewrite-pt-${s.id}-${p.key}`">{{ p.label }}</el-checkbox>
              </el-checkbox-group>
            </div>
            <div class="inline-form">
              <el-button size="small" type="primary" plain :data-testid="`couple-repair-sorry-rewrite-submit-${s.id}`" @click="onSorryRewrite(s)">重写再交 📮</el-button>
            </div>
          </template>
        </div>
      </template>
      <p v-else class="empty-line">验货台还没摆好…</p>
    </CoupleCollapsible>

    <!-- F322 重来卡（每季一张）+ F323 信任重建计划（14/30 天双签） -->
    <CoupleCollapsible testid="couple-repair-rebuild">
      <template #title>🔁 重来卡与信任重建 <span class="sub">一季给一次「刚才那段重来」的机会；信任碎了就立个计划，每天两人各签一格</span></template>
      <template v-if="w">
        <p class="section-head">🔁 {{ w.redo.quarter }} 的重来卡（每季一张）</p>
        <p v-if="w.redo.used" class="redo-used" data-testid="couple-repair-redo-used">
          这季的重来卡用掉了——当时改说的是「{{ w.redo.replayNote }}」
          <template v-if="w.redo.satisfaction != null">，满意度 {{ w.redo.satisfaction }}/5（{{ w.redo.ratedBy }} 打的）</template>
        </p>
        <template v-else>
          <div class="inline-form">
            <el-input v-model="redoScene" :maxlength="SCENE_MAX" placeholder="要重放哪段对话（哪次/在哪/吵什么，≤{{ SCENE_MAX }} 字）" data-testid="couple-repair-redo-scene" />
            <el-button size="small" type="primary" data-testid="couple-repair-redo-apply" @click="onRedoApply">
              {{ w.redo.scene ? '改一下场景 🔁' : '领这季的重来卡 🔁' }}
            </el-button>
          </div>
          <p v-if="w.redo.scene" class="redo-scene" data-testid="couple-repair-redo-scene-text">已领卡：{{ w.redo.scene }}</p>
          <div v-if="w.redo.scene" class="inline-form">
            <el-input v-model="redoNote" :maxlength="REPLAY_MAX" show-word-limit placeholder="重放完了：这次改说了什么（≤{{ REPLAY_MAX }} 字）" data-testid="couple-repair-redo-note" />
            <el-button size="small" type="primary" plain data-testid="couple-repair-redo-play" @click="onRedoPlay">记下这次重放 ✔</el-button>
          </div>
        </template>
        <!-- 满意度全季只打一次（canRate 由后端算好） -->
        <div v-if="w.redo.used && w.redo.canRate" class="inline-form">
          <span class="hint-line">给这次重放打个分（1-5，全季只打一次）：</span>
          <el-radio-group v-model="redoSatisfaction" data-testid="couple-repair-redo-rate">
            <el-radio v-for="n in 5" :key="n" :value="n" :data-testid="`couple-repair-redo-rate-opt-${n}`">{{ n }} 分</el-radio>
          </el-radio-group>
          <el-button size="small" type="primary" plain data-testid="couple-repair-redo-rate-submit" @click="onRedoRate">打分 ⭐</el-button>
        </div>

        <!-- F323 信任重建 -->
        <div class="block">
          <p class="section-head">🏗️ 开一个信任重建计划（14/30 天，任务卡 ≤10 条）</p>
          <div class="inline-form">
            <el-input v-model="planName" :maxlength="PLAN_NAME_MAX" placeholder="计划名（≤{{ PLAN_NAME_MAX }} 字，如「睡前先说晚安」）" data-testid="couple-repair-plan-name" />
            <el-input v-model="planCause" :maxlength="REASON_MAX" placeholder="因为哪件事（≤{{ REASON_MAX }} 字，可空）" data-testid="couple-repair-plan-cause" />
          </div>
          <div class="inline-form">
            <el-input v-model="planTasks" type="textarea" :rows="2" placeholder="每日任务卡，一行一条（≤10 条、每条 ≤{{ TASK_MAX }} 字）" data-testid="couple-repair-plan-tasks" />
          </div>
          <div class="inline-form">
            <el-radio-group v-model="planDays" data-testid="couple-repair-plan-days">
              <el-radio :value="14" data-testid="couple-repair-plan-days-14">14 天</el-radio>
              <el-radio :value="30" data-testid="couple-repair-plan-days-30">30 天</el-radio>
            </el-radio-group>
            <el-button size="small" type="primary" data-testid="couple-repair-plan-submit" @click="onPlanStart">立下计划 🏗️</el-button>
          </div>
        </div>
        <p v-if="!w.rebuilds.length" class="empty-line">还没有重建计划，第一次和好之后可以立一个 🏗️</p>
        <div
          v-for="p in w.rebuilds"
          :key="p.id"
          class="plan-row"
          :class="{ 'is-done': p.status === 'DONE', 'is-givenup': p.status === 'GIVENUP' }"
          :data-testid="`couple-repair-plan-${p.id}`"
        >
          <p class="row-head">
            <b class="plan-name" :data-testid="`couple-repair-plan-name-text-${p.id}`">「{{ p.name }}」</b>
            <span class="who-chip">{{ p.mine ? '我开的 🙋' : '💕 TA 开的' }}</span>
            <span class="status-chip" :data-testid="`couple-repair-plan-status-${p.id}`">{{ planStatusText(p) }}</span>
          </p>
          <p v-if="p.cause" class="hint-line">起因：{{ p.cause }}</p>
          <p class="plan-progress" :data-testid="`couple-repair-plan-progress-${p.id}`">第 {{ p.dayNo }}/{{ p.targetDays }} 天 · 双签 {{ p.signedCount }} 天（单人签不算）</p>
          <div class="progress-bar"><i :data-testid="`couple-repair-plan-bar-${p.id}`" :style="{ width: planRatio(p) }" /></div>
          <p v-if="p.tasks.length" class="hint-line">任务卡：{{ p.tasks.map((t) => `${t.seq}.${t.text}`).join('；') }}</p>
          <p v-if="p.review" class="plan-review" :data-testid="`couple-repair-plan-review-text-${p.id}`">📝 周复盘：{{ p.review }}</p>
          <template v-if="p.status === 'OPEN'">
            <div class="inline-form">
              <el-button size="small" type="primary" plain :data-testid="`couple-repair-plan-sign-${p.id}`" @click="onPlanSign(p)">今天这格我做到了 ✔</el-button>
            </div>
            <div class="inline-form">
              <el-input v-model="planReviewDraft[p.id]" :maxlength="REPLAY_MAX" placeholder="写一句周复盘（≤{{ REPLAY_MAX }} 字，可改写）" :data-testid="`couple-repair-plan-review-${p.id}`" />
              <el-button size="small" type="primary" plain :data-testid="`couple-repair-plan-review-btn-${p.id}`" @click="onPlanReview(p)">交复盘 📝</el-button>
              <el-button v-if="p.mine" size="small" type="warning" plain :data-testid="`couple-repair-plan-giveup-${p.id}`" @click="onPlanGiveup(p)">中止计划 ✋</el-button>
            </div>
            <p v-if="!p.mine" class="wait-line" :data-testid="`couple-repair-plan-giveup-lock-${p.id}`">中止键归开计划的 TA——谁开的谁收尾 ✋</p>
          </template>
        </div>
      </template>
      <p v-else class="empty-line">重来卡打印机缺纸中…</p>
    </CoupleCollapsible>

    <!-- F324 和好倒计时（对方才有暂停权）+ F328 修复礼盒（本人完成才推 both） -->
    <CoupleCollapsible testid="couple-repair-makeup">
      <template #title>⏳ 和好倒计时与修复礼盒 <span class="sub">冷战排个 10-60 分钟的倒计时，到点自动递台阶卡；暂停键在对方手里，和好了礼盒掉出来</span></template>
      <template v-if="w">
        <!-- 今天没开过才给发起表单（一天一轮，后端挡重复） -->
        <template v-if="!w.makeup">
          <p class="section-head">⏳ 冷战开一轮倒计时（10-60 分钟，一天一轮）</p>
          <div class="inline-form">
            <el-input v-model="makeupMinutes" placeholder="冷战几分钟（10-60）" data-testid="couple-repair-makeup-minutes" />
            <el-button size="small" type="danger" plain data-testid="couple-repair-makeup-start" @click="onMakeupStart">开倒计时 ⏳</el-button>
          </div>
        </template>
        <!-- 今天那轮 -->
        <div v-if="w.makeup" class="makeup-now" :data-testid="`couple-repair-makeup-now-${w.makeup.id}`">
          <p class="row-head">
            <b class="makeup-title">⏳ 今天的倒计时：{{ w.makeup.minutes }} 分钟</b>
            <span class="who-chip">{{ w.makeup.mine ? '我开的 🙋' : '💕 TA 开的' }}</span>
            <span class="status-chip" :data-testid="`couple-repair-makeup-status-${w.makeup.id}`">{{ makeupStatusText(w.makeup) }}</span>
          </p>
          <p v-if="w.makeup.status === 'RUNNING' && !w.makeup.paused" class="makeup-timer" :data-testid="`couple-repair-makeup-timer-${w.makeup.id}`">
            还剩 {{ makeupLeftText(w.makeup) }}
          </p>
          <p v-if="w.makeup.paused" class="wait-line" :data-testid="`couple-repair-makeup-paused-${w.makeup.id}`">⏸ 暂停中（{{ w.makeup.pausedBy || 'TA' }} 按的）——谁按的谁负责在准备好时继续</p>
          <p v-if="w.makeup.stepCard" class="step-card" :data-testid="`couple-repair-makeup-step-${w.makeup.id}`">🪜 台阶卡：{{ w.makeup.stepCard }}</p>
          <div class="inline-form">
            <!-- 暂停/继续权只在对方（canToggle 由后端算好：TA 开的且还在计时） -->
            <el-button v-if="w.makeup.canToggle" size="small" plain :data-testid="`couple-repair-makeup-toggle-${w.makeup.id}`" @click="onMakeupToggle(w.makeup)">
              {{ w.makeup.paused ? '帮 TA 继续 ▶️' : '帮 TA 按个暂停 ⏸' }}
            </el-button>
            <el-button v-if="w.makeup.status === 'RUNNING'" size="small" plain :data-testid="`couple-repair-makeup-offer-${w.makeup.id}`" @click="onMakeupOffer(w.makeup)">提前递台阶 🪜</el-button>
            <el-button v-if="w.makeup.canEnd" size="small" type="primary" :data-testid="`couple-repair-makeup-end-${w.makeup.id}`" @click="onMakeupEnd(w.makeup)">宣布和好 🕊️</el-button>
          </div>
          <p v-if="w.makeup.mine && w.makeup.status === 'RUNNING'" class="wait-line">暂停键在 TA 手里——自己开的自己不能按 ⏳</p>
        </div>
        <!-- 过往几轮 -->
        <template v-if="makeupHistory.length">
          <p class="section-head">🕰️ 过往几轮</p>
          <div v-for="m in makeupHistory" :key="m.id" class="makeup-row" :data-testid="`couple-repair-makeup-row-${m.id}`">
            <p class="row-head">
              <span class="day-chip">{{ m.day }}</span>
              <span class="who-chip">{{ m.mine ? '我开的 🙋' : '💕 TA 开的' }}</span>
              <span class="status-chip">{{ makeupStatusText(m) }}</span>
            </p>
            <p v-if="m.stepCard" class="step-card">🪜 台阶卡：{{ m.stepCard }}</p>
          </div>
        </template>

        <!-- F328 修复礼盒 -->
        <div class="block">
          <p class="section-head">🎁 修复礼盒（复温/和好时掉落，任务本人完成才算数）</p>
          <p v-if="!w.boxes.length" class="empty-line">还没掉过礼盒，和好一次就会有一只 🎁</p>
          <div v-for="b in w.boxes" :key="b.id" class="box-row" :class="{ 'is-done': b.status === 'DONE' }" :data-testid="`couple-repair-box-${b.id}`">
            <p class="row-head">
              <span class="day-chip">{{ b.day }} 掉的</span>
              <span class="who-chip">{{ b.mine ? '我的 🙋' : '💕 TA 的' }}</span>
              <span class="status-chip" :data-testid="`couple-repair-box-status-${b.id}`">{{ b.status === 'DONE' ? '已完成 🎉' : '待完成 🎁' }}</span>
            </p>
            <p class="box-task" :data-testid="`couple-repair-box-task-${b.id}`">补偿任务：{{ b.task }}</p>
            <p v-if="b.doneLine" class="box-done" :data-testid="`couple-repair-box-done-line-${b.id}`">{{ b.doneLine }}</p>
            <el-button v-if="b.mine && b.status === 'OPEN'" size="small" type="primary" plain :data-testid="`couple-repair-box-done-${b.id}`" @click="onBoxDone(b)">我做完了这项 🎉</el-button>
            <span v-else-if="!b.mine && b.status === 'OPEN'" class="wait-chip" :data-testid="`couple-repair-box-lock-${b.id}`">任务是 TA 的，你只能等 TA 做完 ⏳</span>
          </div>
        </div>
      </template>
      <p v-else class="empty-line">计时器还在充电…</p>
    </CoupleCollapsible>

    <!-- F326 底线卡 + F327 我错了榜 + F329 和平纪念碑 -->
    <CoupleCollapsible testid="couple-repair-ledger">
      <template #title>🚧 底线卡与我错了榜与纪念碑 <span class="sub">每人三条底线说在明处，踩了线自己来补记录；认错一天一次要具体，最感人的那句由被认错的人标</span></template>
      <template v-if="w">
        <!-- F326 底线卡 -->
        <p class="section-head">🚧 立一条底线（每人 3 格，≤{{ LINE_TEXT_MAX }} 字）</p>
        <div class="inline-form">
          <el-select v-model="bottomSlot" class="slot-select" data-testid="couple-repair-bottom-slot">
            <el-option v-for="n in 3" :key="n" :label="`第 ${n} 条`" :value="n" />
          </el-select>
          <el-input v-model="bottomText" :maxlength="LINE_TEXT_MAX" show-word-limit placeholder="这条底线是什么（≤{{ LINE_TEXT_MAX }} 字）" data-testid="couple-repair-bottom-text" />
          <el-button size="small" type="primary" data-testid="couple-repair-bottom-submit" @click="onBottomSet">立上这条线 🚧</el-button>
        </div>
        <p v-if="!w.bottoms.length" class="empty-line">还没立过底线，有话趁早说清 🚧</p>
        <div v-for="b in w.bottoms" :key="b.id" class="bottom-row" :class="{ 'is-mine': b.mine }" :data-testid="`couple-repair-bottom-${b.id}`">
          <p class="row-head">
            <span class="slot-chip">第 {{ b.slot }} 条</span>
            <span class="who-chip">{{ b.mine ? '我立的 🙋' : '💕 TA 立的' }}</span>
            <span v-if="b.sinceDay" class="day-chip">{{ b.sinceDay }} 起</span>
          </p>
          <p class="bottom-text" :data-testid="`couple-repair-bottom-text-${b.id}`">{{ b.text }}</p>
          <p v-if="b.breachCount > 0" class="breach-line" :data-testid="`couple-repair-bottom-breach-text-${b.id}`">
            🚨 被踩过 {{ b.breachCount }} 次，最近一次：{{ b.breachNote || '（没写说明）' }}
          </p>
          <!-- 踩线记录只能踩线的人补（TA 立的线我才补得了，线主人自己点 400） -->
          <div v-if="b.canBreach" class="inline-form">
            <el-input v-model="breachDraft[b.id]" :maxlength="BREACH_NOTE_MAX" placeholder="踩线了：为什么没刹住（≤{{ BREACH_NOTE_MAX }} 字）" :data-testid="`couple-repair-bottom-breach-note-${b.id}`" />
            <el-button size="small" type="warning" plain :data-testid="`couple-repair-bottom-breach-${b.id}`" @click="onBreach(b)">补一条红线记录 🚨</el-button>
          </div>
        </div>

        <!-- F327 我错了榜 -->
        <div class="block">
          <p class="section-head">🙇 我错了榜（一天一次，认错要具体）</p>
          <div class="inline-form">
            <el-input v-model="admitDetail" :maxlength="DETAIL_MAX" show-word-limit placeholder="今天我错在哪，写具体（≤{{ DETAIL_MAX }} 字）" data-testid="couple-repair-admit-detail" />
            <el-button size="small" type="primary" data-testid="couple-repair-admit-submit" @click="onAdmit">认了 🙇</el-button>
          </div>
          <p v-if="!w.admits.length" class="empty-line">榜上还空着，第一次认真的认错就从今天开始 🙇</p>
          <div v-for="a in w.admits" :key="a.id" class="admit-row" :data-testid="`couple-repair-admit-${a.id}`">
            <p class="row-head">
              <span class="day-chip">{{ a.day }}</span>
              <span class="who-chip">{{ a.mine ? '我认的 🙋' : '💕 TA 向我认的' }}</span>
              <span v-if="a.touched" class="lit-chip" :data-testid="`couple-repair-admit-touched-${a.id}`">🏆 最感人的一次认错</span>
            </p>
            <p class="admit-detail" :data-testid="`couple-repair-admit-detail-${a.id}`">「{{ a.detail }}」</p>
            <!-- 只有被认错的那位能标「最感人」（canTouch 后端算好） -->
            <el-button v-if="a.canTouch" size="small" type="primary" plain :data-testid="`couple-repair-admit-touch-${a.id}`" @click="onAdmitTouch(a)">标为最感人 🏆</el-button>
          </div>
        </div>

        <!-- F329 和平纪念碑 -->
        <div class="block">
          <p class="section-head">🗿 和平纪念碑（一天一句，本人可补「现在回看」）</p>
          <div class="inline-form">
            <el-input v-model="peaceLine" :maxlength="PEACE_MAX" show-word-limit placeholder="这段吵架里最代表性的那句话（≤{{ PEACE_MAX }} 字）" data-testid="couple-repair-peace-line" />
          </div>
          <div class="inline-form">
            <el-input v-model="peaceNote" :maxlength="PEACE_NOTE_MAX" placeholder="现在回看想说什么（≤{{ PEACE_NOTE_MAX }} 字，可空）" data-testid="couple-repair-peace-note" />
            <el-button size="small" type="primary" data-testid="couple-repair-peace-submit" @click="onPeace">刻上去 🗿</el-button>
          </div>
          <p v-if="!w.peace.length" class="empty-line">碑上还没字，第一句等你们和好那天刻 🗿</p>
          <div v-for="p in w.peace" :key="p.id" class="peace-row" :data-testid="`couple-repair-peace-${p.id}`">
            <p class="row-head">
              <span class="day-chip">{{ p.day }}</span>
              <span class="who-chip">{{ p.mine ? '我刻的 🙋' : '💕 TA 刻的' }}</span>
            </p>
            <p class="peace-line-text" :data-testid="`couple-repair-peace-line-text-${p.id}`">「{{ p.line }}」</p>
            <p v-if="p.note" class="peace-note" :data-testid="`couple-repair-peace-note-text-${p.id}`">🪞 现在回看：{{ p.note }}</p>
            <!-- 补注只对今天自己那句开放（后端按 今天+本人 定位那一行，补注不重推） -->
            <div v-else-if="p.mine && p.day === w.day" class="inline-form">
              <el-input v-model="peaceNoteDraft[p.id]" :maxlength="PEACE_NOTE_MAX" placeholder="现在回看想说什么（≤{{ PEACE_NOTE_MAX }} 字）" :data-testid="`couple-repair-peace-note-input-${p.id}`" />
              <el-button size="small" type="primary" plain :data-testid="`couple-repair-peace-note-btn-${p.id}`" @click="onPeaceNote(p)">补一句回看 🪞</el-button>
            </div>
          </div>
        </div>
      </template>
      <p v-else class="empty-line">石碑还在开采中…</p>
    </CoupleCollapsible>

    <!-- F325 冲突类型年报：无表读时聚合，称号与收尾话术后端 Bank 生成 -->
    <CoupleCollapsible testid="couple-repair-report" :empty="!w">
      <template #title>📊 冲突类型年报 <span class="sub">这一年我们怎么吵、怎么修——都替你们记在数里了</span></template>
      <template v-if="w">
        <p class="report-year" data-testid="couple-repair-report-year">{{ w.report.year }} 年度 · 修复车间台账</p>
        <div class="report-grid">
          <p class="report-item" data-testid="couple-repair-report-freezes"><b>{{ w.report.freezes }}</b> 次挂冷冻</p>
          <p class="report-item" data-testid="couple-repair-report-thawed"><b>{{ w.report.thawed }}</b> 次复温成功</p>
          <p class="report-item" data-testid="couple-repair-report-hours"><b>{{ w.report.avgThawHours }}</b> 小时平均冷冻时长</p>
          <p class="report-item" data-testid="couple-repair-report-sorry"><b>{{ w.report.sorryIn }}</b> 封信待验 · <b>{{ w.report.passed }}</b> 封进陈列室 · <b>{{ w.report.backed }}</b> 封被打回</p>
          <p class="report-item" data-testid="couple-repair-report-admit"><b>{{ w.report.admits }}</b> 次认错（<b>{{ w.report.touched }}</b> 次最感人）</p>
          <p class="report-item" data-testid="couple-repair-report-redo"><b>{{ w.report.redos }}</b> 张重来卡用掉</p>
          <p class="report-item" data-testid="couple-repair-report-box"><b>{{ w.report.boxesDone }}</b> 只修复礼盒拆完</p>
          <p class="report-item" data-testid="couple-repair-report-peace"><b>{{ w.report.peaceLines }}</b> 句纪念碑刻字</p>
          <p class="report-item" data-testid="couple-repair-report-reconcile"><b>{{ w.report.reconciles }}</b> 份矛盾复盘（<b>{{ w.report.reconcileAccepted }}</b> 份被接住）</p>
        </div>
        <p class="report-prize" data-testid="couple-repair-report-prize">🏅 年度和解奖：{{ w.report.prize }}</p>
        <p class="report-summary" data-testid="couple-repair-report-summary">{{ w.report.summary }}</p>
      </template>
      <p v-else class="empty-line">年报机还没开张…</p>
    </CoupleCollapsible>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { repairApi } from '@/api/couple'
import type {
  CoupleRepairAdmitVO,
  CoupleRepairBoxVO,
  CoupleRepairBottomVO,
  CoupleRepairMakeupVO,
  CoupleRepairPeaceVO,
  CoupleRepairRebuildVO,
  CoupleRepairSorryPoint,
  CoupleRepairSorryVO,
  CoupleRepairVO,
} from '@/types'
import CoupleCollapsible from './CoupleCollapsible.vue'

/** 限长常量抄自后端 CoupleRepairService（只用于输入框限长与提示文案，业务判定一律留在后端 400 直透） */
const REASON_MAX = 140
const ANSWER_MAX = 140
const LETTER_MAX = 300
const VERDICT_MAX = 80
const SCENE_MAX = 140
const REPLAY_MAX = 200
const PLAN_NAME_MAX = 40
const TASK_MAX = 60
const DETAIL_MAX = 140
const LINE_TEXT_MAX = 60
const BREACH_NOTE_MAX = 80
const PEACE_MAX = 140
const PEACE_NOTE_MAX = 80
/** 后端档位（CoupleRepairService 常量），只用来做前端一次空值提醒，越界仍由后端 400 直透 */
const FREEZE_HOURS_MIN = 3
const FREEZE_HOURS_MAX = 24
const MAKEUP_MINUTES_MIN = 10
const MAKEUP_MINUTES_MAX = 60

/** F320 解冻三问的题干短句：题干全文是后端 Bank 静态文案（不下发），这里按表结构注释给同义短句当 placeholder */
const THAW_QUESTIONS = [
  { slot: 1, hint: '刚才那一刻，我其实怕的是什么？' },
  { slot: 2, hint: '我真正想要的，用一句话说是什么？' },
  { slot: 3, hint: '不等对方先动，我能先做的一件小事是？' },
] as const

/** F321 道歉六要素（后端 CoupleSorryReview.POINTS 六码的中文标签） */
const SORRY_POINTS: { key: CoupleRepairSorryPoint; label: string }[] = [
  { key: 'FACT', label: '说清事实' },
  { key: 'FEEL', label: '说出感受' },
  { key: 'BLAME', label: '不甩锅' },
  { key: 'SORRY', label: '认自己的那部分' },
  { key: 'FIX', label: '给出改法' },
  { key: 'ASK', label: '说出你要的' },
]

function pointLabel(p: string): string {
  return SORRY_POINTS.find((x) => x.key === p)?.label ?? p
}

/** 整份修复车间总览（1 读 + 23 写全部返回整份 WorkshopVO，整体替换即全卡刷新） */
const w = ref<CoupleRepairVO | null>(null)

// ---- 草稿：F320 冷冻 ----
const freezeHours = ref('6')
const freezeReason = ref('')
const freezeAnswers = ref<Record<number, string>>({})
// ---- 草稿：F321 道歉质检 ----
const sorryLetter = ref('')
const sorryPoints = ref<string[]>([])
const verdictDraft = ref<Record<string, string>>({})
const rewriteLetterDraft = ref<Record<string, string>>({})
const rewritePointsDraft = ref<Record<string, string[]>>({})
// ---- 草稿：F322 重来卡 ----
const redoScene = ref('')
const redoNote = ref('')
const redoSatisfaction = ref(5)
// ---- 草稿：F323 信任重建 ----
const planName = ref('')
const planCause = ref('')
const planDays = ref(30)
const planTasks = ref('')
const planReviewDraft = ref<Record<string, string>>({})
// ---- 草稿：F324 倒计时 ----
const makeupMinutes = ref('20')
// ---- 草稿：F326/F327/F329 ----
const bottomSlot = ref(1)
const bottomText = ref('')
const breachDraft = ref<Record<string, string>>({})
const admitDetail = ref('')
const peaceLine = ref('')
const peaceNote = ref('')
const peaceNoteDraft = ref<Record<string, string>>({})

// ---- 派生 ----
/** 复温档案：只列 THAWED 的单（在冻的那单活在上方 current 区，不重复列） */
const thawedRows = computed(() => (w.value?.freezes ?? []).filter((f) => f.status === 'THAWED'))
/** 过往几轮倒计时：今天那轮活在上方 makeup 区，不重复列 */
const makeupHistory = computed(() => (w.value?.makeups ?? []).filter((m) => m.id !== w.value?.makeup?.id))

function sorryStatusText(s: CoupleRepairSorryVO): string {
  if (s.status === 'PASSED') return '陈列室在展 🏆'
  if (s.status === 'BACK') return '被打回，等重写 🙅'
  return s.mine ? '等 TA 验货 ⏳' : '等你验货 📮'
}

function planStatusText(p: CoupleRepairRebuildVO): string {
  if (p.status === 'DONE') return '签满达成 🏆'
  if (p.status === 'GIVENUP') return '已中止 🛑'
  return '进行中 🏗️'
}

function makeupStatusText(m: CoupleRepairMakeupVO): string {
  if (m.status === 'ENDED') return '已和好 🕊️'
  if (m.status === 'OFFERED') return '台阶已递 🪜'
  return m.paused ? '暂停中 ⏸' : '计时中 ⏳'
}

function makeupLeftText(m: CoupleRepairMakeupVO): string {
  const min = Math.floor(m.secondsLeft / 60)
  const sec = m.secondsLeft % 60
  return min > 0 ? `约 ${min} 分 ${sec} 秒` : `${sec} 秒`
}

function planRatio(p: CoupleRepairRebuildVO): string {
  if (p.targetDays <= 0) return '0%'
  return `${Math.min(100, Math.round((p.signedCount / p.targetDays) * 100))}%`
}

function onError(e: unknown, fallback: string) {
  // 后端 400 的中文 message 直接透传（例如「还冻着呢，先解冻再说」「打回要写一句差在哪」）
  ElMessage.error(e instanceof Error ? e.message : fallback)
}

/** 写接口统一返回整份 WorkshopVO：整体替换即全卡刷新 */
function refresh(data: CoupleRepairVO | null | undefined) {
  if (!data) return
  w.value = data
}

// ---- F320 冷冻解冻规程 ----
async function onFreezeStart() {
  const hours = Number(freezeHours.value.trim())
  if (!Number.isFinite(hours) || hours < FREEZE_HOURS_MIN || hours > FREEZE_HOURS_MAX) {
    ElMessage.warning(`冷冻时长 ${FREEZE_HOURS_MIN}-${FREEZE_HOURS_MAX} 小时，别一冻一天 🧊`)
    return
  }
  try {
    refresh(await repairApi.repairFreeze(hours, freezeReason.value.trim()))
    freezeReason.value = ''
    ElMessage.success('挂上了，到点再来复温 🧊')
  } catch (e) {
    onError(e, '挂冷冻失败')
  }
}

async function onFreezeAsk(slot: number) {
  const cur = w.value?.current
  if (!cur) return
  const answer = (freezeAnswers.value[slot] ?? '').trim()
  if (!answer) {
    ElMessage.warning('这一问答一句，别空着 ✍️')
    return
  }
  try {
    refresh(await repairApi.repairFreezeAsk(cur.id, slot, answer))
    freezeAnswers.value = { ...freezeAnswers.value, [slot]: '' }
    ElMessage.success(`第 ${slot} 问答好了，就差复温那一下 ✍️`)
  } catch (e) {
    onError(e, '答三问失败')
  }
}

async function onFreezeSign() {
  const cur = w.value?.current
  if (!cur) return
  try {
    refresh(await repairApi.repairFreezeSign(cur.id))
    ElMessage.success('签好了，等这一单化开 🕊️')
  } catch (e) {
    onError(e, '签解冻失败')
  }
}

// ---- F321 道歉质检 ----
async function onSorryWrite() {
  const letter = sorryLetter.value.trim()
  if (!letter) {
    ElMessage.warning('道歉信至少写一句人话 📮')
    return
  }
  if (sorryPoints.value.length < 3) {
    ElMessage.warning('六要素至少自评 3 项，空口「我错了」不算道歉 📮')
    return
  }
  try {
    refresh(await repairApi.repairSorry(letter, sorryPoints.value.join(',')))
    sorryLetter.value = ''
    sorryPoints.value = []
    ElMessage.success('交上去了，等 TA 验货 📮')
  } catch (e) {
    onError(e, '交道歉信失败')
  }
}

async function onSorryVerify(s: CoupleRepairSorryVO, pass: boolean) {
  const verdict = (verdictDraft.value[s.id] ?? '').trim()
  if (!pass && !verdict) {
    // 与后端同口径的一次前置提醒：打回必填一句差在哪（硬提交仍以 400 直透为准）
    ElMessage.warning('打回要写一句差在哪 🙅')
    return
  }
  try {
    refresh(await repairApi.repairSorryVerify(s.id, pass, verdict))
    verdictDraft.value = { ...verdictDraft.value, [s.id]: '' }
    ElMessage.success(pass ? '验货通过，这封进陈列室了 🏆' : '打回去了，等 TA 重写 🙅')
  } catch (e) {
    onError(e, '验货失败')
  }
}

async function onSorryRewrite(s: CoupleRepairSorryVO) {
  const letter = (rewriteLetterDraft.value[s.id] ?? '').trim()
  if (!letter) {
    ElMessage.warning('重写至少写一句 📮')
    return
  }
  const points = rewritePointsDraft.value[s.id] ?? []
  if (points.length < 3) {
    ElMessage.warning('六要素至少自评 3 项，重写也一样 📮')
    return
  }
  try {
    refresh(await repairApi.repairSorryRewrite(s.id, letter, points.join(',')))
    rewriteLetterDraft.value = { ...rewriteLetterDraft.value, [s.id]: '' }
    rewritePointsDraft.value = { ...rewritePointsDraft.value, [s.id]: [] }
    ElMessage.success('重写好了，再验一次 📮')
  } catch (e) {
    onError(e, '重写失败')
  }
}

// ---- F322 重来卡 ----
async function onRedoApply() {
  const scene = redoScene.value.trim()
  if (!scene) {
    ElMessage.warning('要重放哪段对话得写清 🔁')
    return
  }
  try {
    refresh(await repairApi.repairRedo(scene))
    redoScene.value = ''
    ElMessage.success('这季的重来卡领到了，找个时间重说一遍 🔁')
  } catch (e) {
    onError(e, '领重来卡失败')
  }
}

async function onRedoPlay() {
  const note = redoNote.value.trim()
  if (!note) {
    ElMessage.warning('这次改说了什么，写一句 🔁')
    return
  }
  try {
    refresh(await repairApi.repairRedoPlay(note))
    redoNote.value = ''
    ElMessage.success('记下了，这卡用得值 🔁')
  } catch (e) {
    onError(e, '记重放失败')
  }
}

async function onRedoRate() {
  try {
    refresh(await repairApi.repairRedoRate(redoSatisfaction.value))
    ElMessage.success(`打了 ${redoSatisfaction.value} 分，这季的重放有结论了 ⭐`)
  } catch (e) {
    onError(e, '打满意度失败')
  }
}

// ---- F323 信任重建 ----
async function onPlanStart() {
  const name = planName.value.trim()
  if (!name) {
    ElMessage.warning('计划叫什么，总得起个名 🏗️')
    return
  }
  const tasks = planTasks.value.split(/\n|,|、/).map((t) => t.trim()).filter(Boolean)
  if (!tasks.length) {
    ElMessage.warning('任务卡至少一条，光立计划不干活没用 🏗️')
    return
  }
  try {
    refresh(await repairApi.repairRebuild(name, planCause.value.trim(), planDays.value, tasks.join('\n')))
    planName.value = ''
    planCause.value = ''
    planTasks.value = ''
    ElMessage.success('计划立好了，每天两人各签一次 🏗️')
  } catch (e) {
    onError(e, '立计划失败')
  }
}

async function onPlanSign(p: CoupleRepairRebuildVO) {
  try {
    refresh(await repairApi.repairRebuildSign(p.id, ''))
    ElMessage.success('签上了，等 TA 那个勾 🧱')
  } catch (e) {
    onError(e, '签到失败')
  }
}

async function onPlanReview(p: CoupleRepairRebuildVO) {
  const review = (planReviewDraft.value[p.id] ?? '').trim()
  if (!review) {
    ElMessage.warning('复盘要写一句 📝')
    return
  }
  try {
    refresh(await repairApi.repairRebuildReview(p.id, review))
    planReviewDraft.value = { ...planReviewDraft.value, [p.id]: '' }
    ElMessage.success('复盘交了，TA 会看到 📝')
  } catch (e) {
    onError(e, '交复盘失败')
  }
}

async function onPlanGiveup(p: CoupleRepairRebuildVO) {
  try {
    refresh(await repairApi.repairRebuildGiveup(p.id))
    ElMessage.success('计划中止了，签过的天数不清零 🧱')
  } catch (e) {
    onError(e, '中止失败')
  }
}

// ---- F324 和好倒计时 ----
async function onMakeupStart() {
  const minutes = Number(makeupMinutes.value.trim())
  if (!Number.isFinite(minutes) || minutes < MAKEUP_MINUTES_MIN || minutes > MAKEUP_MINUTES_MAX) {
    ElMessage.warning(`倒计时 ${MAKEUP_MINUTES_MIN}-${MAKEUP_MINUTES_MAX} 分钟，别把冷战排班 ⏳`)
    return
  }
  try {
    refresh(await repairApi.repairMakeup(minutes))
    ElMessage.success('倒计时开始了，到点自动递台阶卡 ⏳')
  } catch (e) {
    onError(e, '开倒计时失败')
  }
}

async function onMakeupToggle(m: CoupleRepairMakeupVO) {
  try {
    refresh(await repairApi.repairMakeupPause(m.id, !m.paused))
    ElMessage.success(m.paused ? '倒计时继续走了 ▶️' : '帮 TA 按了暂停，缓好了再继续 ⏸')
  } catch (e) {
    onError(e, '暂停/继续失败')
  }
}

async function onMakeupOffer(m: CoupleRepairMakeupVO) {
  try {
    refresh(await repairApi.repairMakeupOffer(m.id))
    ElMessage.success('台阶递过去了，剩下的就是谁先开口 🪜')
  } catch (e) {
    onError(e, '递台阶失败')
  }
}

async function onMakeupEnd(m: CoupleRepairMakeupVO) {
  try {
    refresh(await repairApi.repairMakeupEnd(m.id))
    ElMessage.success('宣布和好，礼盒掉出来了 🎁')
  } catch (e) {
    onError(e, '宣布和好失败')
  }
}

// ---- F328 修复礼盒 ----
async function onBoxDone(b: CoupleRepairBoxVO) {
  try {
    refresh(await repairApi.repairBoxDone(b.id))
    ElMessage.success('任务完成，修好的证据又多了一条 🎉')
  } catch (e) {
    onError(e, '完成礼盒任务失败')
  }
}

// ---- F326 底线卡 ----
async function onBottomSet() {
  const text = bottomText.value.trim()
  if (!text) {
    ElMessage.warning('底线要写一句 🚧')
    return
  }
  try {
    refresh(await repairApi.repairBottom(bottomSlot.value, text, ''))
    bottomText.value = ''
    ElMessage.success('这条线立上了，TA 那边同步可见 🚧')
  } catch (e) {
    onError(e, '立底线失败')
  }
}

async function onBreach(b: CoupleRepairBottomVO) {
  const note = (breachDraft.value[b.id] ?? '').trim()
  if (!note) {
    ElMessage.warning('红线记录要写一句为什么没刹住 🚨')
    return
  }
  try {
    refresh(await repairApi.repairBottomBreach(b.id, note))
    breachDraft.value = { ...breachDraft.value, [b.id]: '' }
    ElMessage.success('记上了，下次刹住一点 🚨')
  } catch (e) {
    onError(e, '补红线记录失败')
  }
}

// ---- F327 我错了榜 ----
async function onAdmit() {
  const detail = admitDetail.value.trim()
  if (!detail) {
    ElMessage.warning('错在哪要写具体一句 🙇')
    return
  }
  try {
    refresh(await repairApi.repairAdmit(detail))
    admitDetail.value = ''
    ElMessage.success('认了，一天一次要认真认 🙇')
  } catch (e) {
    onError(e, '认错失败')
  }
}

async function onAdmitTouch(a: CoupleRepairAdmitVO) {
  try {
    refresh(await repairApi.repairAdmitTouch(a.id))
    ElMessage.success('标好了，这句以后可以当模板用 🏆')
  } catch (e) {
    onError(e, '标最感人失败')
  }
}

// ---- F329 和平纪念碑 ----
async function onPeace() {
  const line = peaceLine.value.trim()
  if (!line) {
    ElMessage.warning('最代表性的那句要写出来 🗿')
    return
  }
  try {
    refresh(await repairApi.repairPeace(line, peaceNote.value.trim()))
    peaceLine.value = ''
    peaceNote.value = ''
    ElMessage.success('刻上了，一年后回看会很不一样 🗿')
  } catch (e) {
    onError(e, '立碑失败')
  }
}

async function onPeaceNote(p: CoupleRepairPeaceVO) {
  const note = (peaceNoteDraft.value[p.id] ?? '').trim()
  if (!note) {
    ElMessage.warning('回看注解要写一句 🪞')
    return
  }
  try {
    refresh(await repairApi.repairPeace(p.line, note))
    peaceNoteDraft.value = { ...peaceNoteDraft.value, [p.id]: '' }
    ElMessage.success('补上了，不惊动任何人 🪞')
  } catch (e) {
    onError(e, '补回看注解失败')
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
  const data = await safeLoad(repairApi.repairWorkshop, null)
  if (data) refresh(data)
})
</script>

<style scoped>
/* 主色冷冻冰蓝 #0284c7（冷冻柜/复温计的冷色调，「把情绪冻一冻再化开」正贴合修复车间口径；
   全仓 grep 确认零占用：区别于粉红 #f56c6c / #409eff 公司蓝 / #d2691e 工坊橙棕 / #d93a3a 中国红 /
   #9254de 倾听紫 / #c0392b 庆典金红 / #2c7a7b 考据墨青 / #3f51b5 靛蓝 / #0d9488 剧幕青绿 /
   #16a34a 监护绿 / #e6a23c 安眠暖橙，也与全局六套皮肤强调色（#ec5f92/#3370ff/#8b5cf6/#10b981/
   #f97316/#06b6d4 及各气泡渐变端点，见 src/style.css 与 utils/settings.ts）都不同——尤其避开
   #7c3aed 那条全局气泡渐变与 #06b6d4 皮肤青，照批次二十六/二十七的做法核对过；
   本组件不写 .title 规则，折叠卡标题色一律经 --collapse-title-color 级联给 CoupleCollapsible */
.couple-repair { display: flex; flex-direction: column; gap: 14px; --collapse-title-color: #0284c7; }
.sub { font-size: 12px; color: var(--im-muted, #909399); font-weight: normal; margin-left: 6px; }
.section-head { margin: 10px 0 4px; font-size: 13px; font-weight: bold; color: #0284c7; }
.block { margin-top: 12px; padding-top: 8px; border-top: 1px dashed var(--im-border, #ebeef5); }
.inline-form { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 8px; }
.inline-form .el-input { flex: 1; min-width: 150px; }
.opt-group { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 6px; }
.empty-line { margin: 8px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.hint-line { font-size: 12px; color: var(--im-muted, #909399); }
.wait-line { margin: 6px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.wait-chip { font-size: 12px; color: #b8860b; }
.who-chip { font-size: 11px; color: var(--im-muted, #909399); }
.day-chip, .status-chip { font-size: 11px; color: #0284c7; background: rgba(2, 132, 199, 0.12); padding: 1px 8px; border-radius: 10px; }
.lit-chip { font-size: 12px; color: #0284c7; background: rgba(2, 132, 199, 0.1); padding: 2px 8px; border-radius: 6px; }
.row-head { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; margin: 0; }
.progress-bar { height: 6px; border-radius: 4px; background: rgba(2, 132, 199, 0.15); overflow: hidden; }
.progress-bar i { display: block; height: 100%; background: #0284c7; }
.slot-select { width: 96px; }
/* F320 冷冻 */
.freeze-now { margin-top: 8px; padding: 9px 11px; border-radius: 8px; border-left: 3px solid #0284c7; background: rgba(2, 132, 199, 0.06); }
.freeze-title { color: #0284c7; font-size: 14px; }
.freeze-reason { margin: 4px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.freeze-timer { margin: 4px 0 0; font-size: 13px; color: #0284c7; }
.sign-state { margin: 6px 0 0; font-size: 12px; color: var(--im-text, #303133); }
.freeze-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid var(--im-border, #ebeef5); font-size: 13px; }
/* F321 道歉质检 */
.sorry-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid var(--im-border, #ebeef5); font-size: 13px; }
.sorry-row.is-passed { border-left-color: #0284c7; }
.sorry-row.is-back { border-left-color: #e6a23c; }
.sorry-letter { margin: 3px 0 0; color: var(--im-text, #303133); }
.verdict-line { margin: 4px 0 0; font-size: 12px; color: #b8860b; }
/* F322/F323 重来卡与重建 */
.redo-used, .redo-scene { margin: 4px 0 0; font-size: 13px; color: #0284c7; }
.plan-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid #0284c7; font-size: 13px; }
.plan-row.is-done { border-left-color: #b8860b; }
.plan-row.is-givenup { border-left-color: var(--im-border, #ebeef5); opacity: 0.9; }
.plan-name { color: #0284c7; font-size: 14px; }
.plan-progress { margin: 3px 0 4px; font-size: 12px; color: var(--im-muted, #909399); }
.plan-review { margin: 4px 0 0; font-size: 12px; color: #0284c7; }
/* F324 倒计时与礼盒 */
.makeup-now { margin-top: 8px; padding: 9px 11px; border-radius: 8px; border-left: 3px solid #0284c7; background: rgba(2, 132, 199, 0.06); }
.makeup-title { color: #0284c7; font-size: 14px; }
.makeup-timer { margin: 4px 0 0; font-size: 13px; color: #0284c7; }
.makeup-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid var(--im-border, #ebeef5); font-size: 13px; }
.step-card { margin: 4px 0 0; padding: 5px 8px; border-radius: 6px; font-size: 13px; color: #0284c7; background: rgba(2, 132, 199, 0.08); }
.box-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid #0284c7; font-size: 13px; }
.box-row.is-done { border-left-color: #b8860b; }
.box-task { margin: 3px 0 0; color: var(--im-text, #303133); }
.box-done { margin: 4px 0 0; font-size: 12px; color: #0284c7; }
/* F326/F327/F329 台账三件 */
.bottom-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid var(--im-border, #ebeef5); font-size: 13px; }
.bottom-row.is-mine { border-left-color: #0284c7; }
.bottom-text { margin: 3px 0 0; color: var(--im-text, #303133); }
.breach-line { margin: 4px 0 0; font-size: 12px; color: #d93a3a; }
.admit-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid #0284c7; font-size: 13px; }
.admit-detail { margin: 3px 0 0; color: var(--im-text, #303133); }
.peace-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid var(--im-border, #ebeef5); font-size: 13px; }
.peace-line-text { margin: 3px 0 0; color: var(--im-text, #303133); }
.peace-note { margin: 4px 0 0; font-size: 12px; color: #0284c7; }
/* F325 年报 */
.report-year { margin: 0 0 6px; font-size: 14px; font-weight: bold; color: #0284c7; }
.report-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 6px 14px; margin: 0; }
.report-item { margin: 0; font-size: 13px; color: var(--im-text, #303133); }
.report-item b { color: #0284c7; }
.report-prize { margin: 10px 0 0; padding: 6px 10px; border-radius: 8px; font-size: 13px; color: #0284c7; background: rgba(2, 132, 199, 0.08); }
.report-summary { margin: 6px 0 0; font-size: 13px; color: var(--im-text, #303133); }
</style>

<template>
  <div class="couple-body" data-testid="couple-body">
    <!-- F310 体征互报：报今天的数，超的是自己给自己划的线 -->
    <CoupleCollapsible testid="couple-body-metric">
      <template #title>🌡️ 今日体征互报 <span class="sub">体温/体重/睡眠，报的是自己划的那条线——过了线我就知道要问一句「现在要什么」，不讲道理也不诊断</span></template>
      <template v-if="b">
        <div class="inline-form">
          <el-input v-model="mTemp" :maxlength="METRIC_FIELD_MAX" placeholder="体温（如 36.8）" data-testid="couple-body-metric-temp" />
          <el-input v-model="mWeight" :maxlength="METRIC_FIELD_MAX" placeholder="体重（如 52.5）" data-testid="couple-body-metric-weight" />
          <el-input v-model="mSleep" :maxlength="METRIC_FIELD_MAX" placeholder="睡了几个小时（如 7.5）" data-testid="couple-body-metric-sleep" />
        </div>
        <div class="inline-form">
          <el-input v-model="mTempLimit" :maxlength="METRIC_FIELD_MAX" placeholder="我自己划的体温线（如 37.2）" data-testid="couple-body-metric-temp-limit" />
          <el-input v-model="mSleepLimit" :maxlength="METRIC_FIELD_MAX" placeholder="我自己的睡眠下限（如 6.5）" data-testid="couple-body-metric-sleep-limit" />
        </div>
        <el-input
          v-model="mNote"
          :maxlength="NOTE_MAX"
          show-word-limit
          placeholder="今天的状态一句（≤{{ NOTE_MAX }} 字，想写就写）"
          data-testid="couple-body-metric-note"
        />
        <div class="inline-form">
          <el-button size="small" type="primary" data-testid="couple-body-metric-submit" @click="onMetric">
            {{ todayMetric ? '改写我今天的记录 🔁' : '报上今天 🌡️' }}
          </el-button>
          <span class="hint-line" data-testid="couple-body-metric-tip">三项至少填一项，空报后端不让打卡 📋</span>
        </div>

        <div v-if="todayMetric" class="today-card" data-testid="couple-body-metric-today">
          <p class="today-head">
            <b>🙋 我今天已经报过</b>
            <span class="day-chip">{{ todayMetric.day }}</span>
          </p>
          <p class="metric-values" data-testid="couple-body-metric-today-values">
            体温 {{ todayMetric.temp || '—' }} · 体重 {{ todayMetric.weight || '—' }} · 睡了 {{ todayMetric.sleepHours || '—' }} 小时
            <template v-if="todayMetric.tempLimit || todayMetric.sleepLimit">
              （我的线：{{ todayMetric.tempLimit ? `体温 ${todayMetric.tempLimit}` : '' }}{{ todayMetric.tempLimit && todayMetric.sleepLimit ? ' / ' : '' }}{{ todayMetric.sleepLimit ? `睡眠 ${todayMetric.sleepLimit}` : '' }}）
            </template>
          </p>
          <p v-if="todayMetric.note" class="metric-note" data-testid="couple-body-metric-today-note">状态：{{ todayMetric.note }}</p>
          <p v-if="todayMetric.warn" class="warn-line" data-testid="couple-body-metric-today-warn">
            ⚠️ 过了你自己划的线：{{ todayMetric.warnText }} ——我什么都不问，先问你「现在要什么」🫂
          </p>
          <p v-else class="ok-line" data-testid="couple-body-metric-today-ok">没超线，今天我这边稳着 ✔</p>
        </div>

        <p v-if="!metricRows.length" class="empty-line">近 7 天还没人报过数值，先从今天开始记 🌡️</p>
        <div
          v-for="m in metricRows"
          :key="`${m.day}-${m.mine ? 'mine' : 'partner'}`"
          class="metric-row"
          :class="{ 'is-warn': m.warn }"
          :data-testid="`couple-body-metric-row-${m.day}-${m.mine ? 'mine' : 'partner'}`"
        >
          <p class="row-head">
            <span class="day-chip" :data-testid="`couple-body-metric-day-${m.day}-${m.mine ? 'mine' : 'partner'}`">{{ m.day }}</span>
            <span class="who-chip" :data-testid="`couple-body-metric-who-${m.day}-${m.mine ? 'mine' : 'partner'}`">{{ m.mine ? '我报的 🙋' : '💕 TA 报的' }}</span>
          </p>
          <p class="metric-values" :data-testid="`couple-body-metric-values-${m.day}-${m.mine ? 'mine' : 'partner'}`">
            体温 {{ m.temp || '—' }} · 体重 {{ m.weight || '—' }} · 睡了 {{ m.sleepHours || '—' }} 小时
          </p>
          <p v-if="m.note" class="metric-note" :data-testid="`couple-body-metric-note-${m.day}-${m.mine ? 'mine' : 'partner'}`">状态：{{ m.note }}</p>
          <p v-if="m.warn" class="warn-line" :data-testid="`couple-body-metric-warn-${m.day}-${m.mine ? 'mine' : 'partner'}`">
            ⚠️ {{ m.warnText }}——过了 TA 自己划的线，我去问一句就好 🫂
          </p>
        </div>
      </template>
      <p v-else class="empty-line">体温计还没摆出来…</p>
    </CoupleCollapsible>

    <!-- F311 呼噜档位 + 震感点评 -->
    <CoupleCollapsible testid="couple-body-snore">
      <template #title>😴 今早呼噜自报 <span class="sub">各报各的档位，再给对方补一份「震感报告」——打呼这件事最好笑的地方是有人肯认真记下来</span></template>
      <template v-if="b">
        <p class="section-head">😴 我今早打呼了吗（一天一次，改了也算，{{ b.snore.day }}）</p>
        <div class="inline-form">
          <el-radio-group v-model="snoreLevel" class="opt-group" data-testid="couple-body-snore-level">
            <el-radio v-for="lv in SNORE_LEVELS" :key="lv.key" :value="lv.key" :data-testid="`couple-body-snore-opt-${lv.key}`">{{ lv.label }}</el-radio>
          </el-radio-group>
        </div>
        <div class="inline-form">
          <el-button size="small" type="primary" data-testid="couple-body-snore-submit" @click="onSnore">
            {{ b.snore.myLevel ? '改一下我今早的档位 🔁' : '就这么报 😴' }}
          </el-button>
          <span class="my-level" data-testid="couple-body-snore-my">我报的：{{ levelLabel(b.snore.myLevel) }}</span>
        </div>

        <div class="snore-board">
          <p class="board-head">🌋 昨夜现场</p>
          <p class="board-line" data-testid="couple-body-snore-partner">
            TA 的档位：{{ levelLabel(b.snore.partnerLevel) }}
            <span v-if="b.snore.partnerLevel" class="score-chip" data-testid="couple-body-snore-score">震感 {{ b.snore.partnerScore }}/3 级</span>
          </p>
          <p v-if="b.snore.myShake" class="shake-line is-mine" data-testid="couple-body-snore-my-shake">📝 我给的震感报告：{{ b.snore.myShake }}</p>
          <p v-if="b.snore.partnerShake" class="shake-line is-partner" data-testid="couple-body-snore-partner-shake">💕 TA 给我的震感报告：{{ b.snore.partnerShake }}</p>

          <!-- 只有 TA 报了档位、我还没写的时候才给输入（后端 iCanShake 算好） -->
          <template v-if="b.snore.iCanShake">
            <el-input
              v-model="shakeText"
              :maxlength="SHAKE_MAX"
              show-word-limit
              placeholder="给对方补一句震感点评（≤{{ SHAKE_MAX }} 字，气象播报口吻随意）"
              data-testid="couple-body-snore-shake-input"
            />
            <div class="inline-form">
              <el-button size="small" type="primary" data-testid="couple-body-snore-shake-submit" @click="onShake">出这份震感报告 🌋</el-button>
            </div>
          </template>
          <p v-else-if="!b.snore.partnerLevel" class="wait-line" data-testid="couple-body-snore-shake-wait">TA 还没报档位，没现场就没法出报告 ⏳</p>
          <p v-else-if="!b.snore.myShake" class="wait-line" data-testid="couple-body-snore-shake-done">你写过一份了，今天先留着耳朵 ⏳</p>
        </div>
      </template>
      <p v-else class="empty-line">话筒还没架到枕头边…</p>
    </CoupleCollapsible>

    <!-- F312 周期共览与照顾卡 + F315 身体不适 SOS -->
    <CoupleCollapsible testid="couple-body-care">
      <template #title>🫂 周期共览与不适 SOS <span class="sub">谁那几天谁说一句，剩下的一起记；照顾卡只写「我做什么」，不舒服可以直接喊一声，不用解释原因</span></template>
      <template v-if="b">
        <p class="section-head">🩹 标一下我这一天（近 14 天俩人一起看）</p>
        <div class="inline-form">
          <el-input v-model="cycleDay" placeholder="哪天（空=今天，yyyy-MM-dd）" data-testid="couple-body-cycle-day" />
          <el-input v-model="cycleDiscomfort" :maxlength="DISCOMFORT_MAX" placeholder="哪里不得劲（≤{{ DISCOMFORT_MAX }} 字，可空）" data-testid="couple-body-cycle-discomfort" />
        </div>
        <div class="inline-form">
          <el-radio-group v-model="cyclePhase" class="opt-group" data-testid="couple-body-cycle-phase">
            <el-radio v-for="p in PHASES" :key="p.key" :value="p.key" :data-testid="`couple-body-cycle-opt-${p.key}`">{{ p.label }}</el-radio>
          </el-radio-group>
        </div>
        <div class="inline-form">
          <el-button size="small" type="primary" data-testid="couple-body-cycle-submit" @click="onCycle">标上这一天 🩹</el-button>
          <span class="count-badge" data-testid="couple-body-cycle-count">在册 {{ b.cycles.length }} 天</span>
        </div>
        <p v-if="!b.cycles.length" class="empty-line">这十四天还没人标过，标一次就不用每次开口解释了 🩹</p>
        <div
          v-for="c in b.cycles"
          :key="`${c.day}-${c.mine ? 'mine' : 'partner'}`"
          class="cycle-row"
          :class="{ 'is-partner': !c.mine }"
          :data-testid="`couple-body-cycle-row-${c.day}-${c.mine ? 'mine' : 'partner'}`"
        >
          <p class="row-head">
            <span class="day-chip" :data-testid="`couple-body-cycle-day-text-${c.day}-${c.mine ? 'mine' : 'partner'}`">{{ c.day }}</span>
            <span class="who-chip" :data-testid="`couple-body-cycle-who-${c.day}-${c.mine ? 'mine' : 'partner'}`">{{ c.mine ? '我标的 🙋' : '💕 TA 标的' }}</span>
            <span class="phase-chip" :data-testid="`couple-body-cycle-phase-text-${c.day}-${c.mine ? 'mine' : 'partner'}`">{{ c.phaseLabel }}</span>
          </p>
          <p v-if="c.discomfort" class="cycle-discomfort" :data-testid="`couple-body-cycle-pain-${c.day}-${c.mine ? 'mine' : 'partner'}`">不适：{{ c.discomfort }}</p>
          <p v-if="c.careCard" class="care-line" :data-testid="`couple-body-cycle-card-${c.day}-${c.mine ? 'mine' : 'partner'}`">
            🧣 照顾卡（{{ c.careBy || 'TA' }} 递的）：{{ c.careCard }}
          </p>
          <!-- 只有 TA 标的那天、且还没卡，才给递照顾卡（后端 iCanCare 算好） -->
          <div v-if="c.iCanCare" class="inline-form">
            <el-input
              v-model="careDraft[c.day]"
              :maxlength="CARD_MAX"
              placeholder="写一句我今天能做点什么（≤{{ CARD_MAX }} 字）"
              :data-testid="`couple-body-cycle-care-input-${c.day}`"
            />
            <el-button size="small" type="primary" plain :data-testid="`couple-body-cycle-care-btn-${c.day}`" @click="onCare(c.day)">
              把照顾卡递过去 🧣
            </el-button>
          </div>
          <p v-else-if="!c.mine" class="wait-line" :data-testid="`couple-body-cycle-cared-${c.day}`">这天已经有卡了，先收着 ⏳</p>
        </div>

        <!-- F315 身体不适 SOS -->
        <div class="block">
          <p class="section-head">🆘 不舒服直接喊一声（在途只留一条，接住了才发下一条）</p>
          <div class="inline-form">
            <el-input v-model="sosSymptom" :maxlength="SYMPTOM_MAX" show-word-limit placeholder="哪里不舒服（≤{{ SYMPTOM_MAX }} 字，一个字也算）" data-testid="couple-body-sos-symptom" />
            <el-input v-model="sosSince" placeholder="从什么时候起（可不写）" data-testid="couple-body-sos-since" />
            <el-button size="small" type="danger" data-testid="couple-body-sos-submit" @click="onSos">我不舒服 🆘</el-button>
          </div>
          <p v-if="!b.soss.length" class="empty-line">这条线一直安静着，挺好的 🫶</p>
          <div
            v-for="s in b.soss"
            :key="s.id"
            class="sos-row"
            :class="s.status === 'SENT' ? 'is-open' : 'is-held'"
            :data-testid="`couple-body-sos-${s.id}`"
          >
            <p class="row-head">
              <span class="who-chip" :data-testid="`couple-body-sos-who-${s.id}`">{{ s.mine ? '我喊的 🙋' : '💕 TA 喊的' }}</span>
              <span class="status-chip" :data-testid="`couple-body-sos-status-${s.id}`">{{ s.status === 'SENT' ? '在路上 🕔' : '已接住 🫂' }}</span>
              <span v-if="s.since" class="day-chip" :data-testid="`couple-body-sos-since-${s.id}`">从 {{ s.since }} 起</span>
            </p>
            <p class="sos-symptom" :data-testid="`couple-body-sos-text-${s.id}`">{{ s.symptom }}</p>
            <!-- 我发的、还没被接住的那条：后端只给自己一条等待提示，不给自己选项 -->
            <p v-if="s.mine && s.status === 'SENT'" class="wait-line" :data-testid="`couple-body-sos-wait-${s.id}`">
              已经喊出去了，等 TA 选一句「我能做」回来 ⏳ 不用补充说明，难受不用道歉 🫂
            </p>
            <!-- 选项与接住钮：只有 TA 喊的、还在路上的那条才给（options 由后端话术池下发） -->
            <div v-else-if="s.status === 'SENT'" class="sos-options">
              <p class="opt-head">🫂 选一句我能做，递回给 TA：</p>
              <el-button
                v-for="(opt, i) in s.options"
                :key="opt"
                size="small"
                plain
                :data-testid="`couple-body-sos-hold-${s.id}-${i}`"
                @click="onSosHold(s, opt)"
              >{{ opt }}</el-button>
            </div>
            <p v-if="s.status === 'HELD'" class="sos-held" :data-testid="`couple-body-sos-held-${s.id}`">
              ✔ 接住了（{{ s.holdBy || 'TA' }}）：{{ s.comfort }}
            </p>
          </div>
        </div>
      </template>
      <p v-else class="empty-line">关怀卡还没印好…</p>
    </CoupleCollapsible>

    <!-- F313 互助营 + F314 运动链 -->
    <CoupleCollapsible testid="couple-body-camp">
      <template #title>🤝 戒东西互助营与运动链 <span class="sub">想戒什么就开个体，破戒当天有人送安慰词；运动不用比谁多，半小时内两个人都报上就算接上链</span></template>
      <template v-if="b">
        <p class="section-head">🏕️ 开一个营（营期 7-100 天，后端缺省 21）</p>
        <div class="inline-form">
          <el-input v-model="quitName" :maxlength="QUIT_NAME_MAX" placeholder="戒什么（如「睡前那杯奶茶」，≤{{ QUIT_NAME_MAX }} 字）" data-testid="couple-body-quit-name" />
          <el-input v-model="quitDays" placeholder="营期天数（7-100）" data-testid="couple-body-quit-days" />
          <el-input v-model="quitStartDay" placeholder="哪天开营（空=今天，yyyy-MM-dd）" data-testid="couple-body-quit-day" />
          <el-button size="small" type="primary" data-testid="couple-body-quit-submit" @click="onQuitStart">开营 🏕️</el-button>
        </div>
        <p v-if="!b.quits.length" class="empty-line">营地里还没搭帐篷，先立一个小目标 🏕️</p>
        <div
          v-for="q in b.quits"
          :key="q.id"
          class="quit-row"
          :class="`is-${q.status.toLowerCase()}`"
          :data-testid="`couple-body-quit-${q.id}`"
        >
          <p class="row-head">
            <b class="quit-name" :data-testid="`couple-body-quit-name-text-${q.id}`">「{{ q.name }}」</b>
            <span class="who-chip" :data-testid="`couple-body-quit-who-${q.id}`">{{ q.mine ? '我开的营 🙋' : '🤝 我陪绑' }}</span>
            <span class="status-chip" :data-testid="`couple-body-quit-status-${q.id}`">{{ quitStatusText(q) }}</span>
          </p>
          <p class="quit-meta" :data-testid="`couple-body-quit-meta-${q.id}`">
            开营 {{ q.startDay }} · 营龄 {{ q.campDays }}/{{ q.targetDays }} 天 · 破戒 {{ q.brokeCount }} 次
          </p>
          <div class="progress-bar">
            <i :data-testid="`couple-body-quit-bar-${q.id}`" :style="{ width: campRatio(q) }" />
          </div>
          <p v-if="q.milestone" class="milestone-line" :data-testid="`couple-body-quit-milestone-${q.id}`">🏁 {{ q.milestone }}</p>
          <p v-if="q.cheer" class="cheer-line" :data-testid="`couple-body-quit-cheer-text-${q.id}`">🍬 {{ q.cheerBy || 'TA' }} 说：{{ q.cheer }}</p>
          <!-- 破戒只有本人能记（同日再点后端幂等返回）；结营也归本人 -->
          <div class="inline-form">
            <el-button
              v-if="q.mine && q.status === 'OPEN'"
              size="small"
              type="warning"
              plain
              :data-testid="`couple-body-quit-broke-${q.id}`"
              @click="onQuitBroke(q)"
            >今天破了一次，记上 🍬</el-button>
            <el-button
              v-if="q.mine && q.status === 'OPEN'"
              size="small"
              plain
              :data-testid="`couple-body-quit-close-${q.id}`"
              @click="onQuitClose(q)"
            >宣布结营 🏁</el-button>
            <span v-if="!q.mine && q.status === 'OPEN'" class="wait-chip" :data-testid="`couple-body-quit-mine-lock-${q.id}`">
              破戒与结营归 TA 自己记，陪绑的人只负责说话 🤝
            </span>
          </div>
          <!-- 安慰词只有陪绑方说得出口（后端 quitCheer 挡住自己夸自己） -->
          <div v-if="!q.mine" class="inline-form">
            <el-input
              v-model="cheerDraft[q.id]"
              :maxlength="CHEER_MAX"
              placeholder="陪绑的人说一句（≤{{ CHEER_MAX }} 字，不评判只陪着）"
              :data-testid="`couple-body-quit-cheer-input-${q.id}`"
            />
            <el-button size="small" type="primary" plain :data-testid="`couple-body-quit-cheer-btn-${q.id}`" @click="onQuitCheer(q)">
              把这句送给 TA 🍬
            </el-button>
          </div>
        </div>

        <!-- F314 运动链 -->
        <div class="block">
          <p class="section-head">🔗 今日运动链（俩人 30 分钟内都报上才算接上，计数归计数不排名）</p>
          <div class="inline-form">
            <el-select v-model="fitKind" data-testid="couple-body-fit-kind">
              <el-option v-for="k in FIT_KINDS" :key="k.key" :label="k.label" :value="k.key" />
            </el-select>
            <el-input v-model="fitCount" placeholder="今天做了多少（0-9999）" data-testid="couple-body-fit-count" />
            <el-button size="small" type="primary" data-testid="couple-body-fit-submit" @click="onFit">报今天的数 🔗</el-button>
          </div>
          <p v-if="!b.fits.length" class="empty-line">链子还没开编，先做一组再说 🔗</p>
          <div
            v-for="f in fitRows"
            :key="`${f.day}-${f.kind}`"
            class="fit-row"
            :class="f.linked ? 'is-linked' : 'is-miss'"
            :data-testid="`couple-body-fit-${f.day}-${f.kind}`"
          >
            <p class="row-head">
              <span class="kind-chip" :data-testid="`couple-body-fit-kind-text-${f.day}-${f.kind}`">{{ f.kindLabel }}</span>
              <span class="day-chip" :data-testid="`couple-body-fit-day-${f.day}-${f.kind}`">{{ f.day }}</span>
              <span class="status-chip" :data-testid="`couple-body-fit-state-${f.day}-${f.kind}`">{{ fitStateText(f) }}</span>
            </p>
            <p class="fit-count" :data-testid="`couple-body-fit-count-text-${f.day}-${f.kind}`">
              🙋 我 {{ f.myCount }} · 💕 TA {{ f.partnerCount }}
            </p>
            <p v-if="fitLinkHint(f)" class="fit-hint" :data-testid="`couple-body-fit-hint-${f.day}-${f.kind}`">{{ fitLinkHint(f) }}</p>
          </div>
        </div>
      </template>
      <p v-else class="empty-line">营地还没开门…</p>
    </CoupleCollapsible>

    <!-- F316 忌口红线本 + F317 体检陪同 + F318 情绪药友 + F319 早睡军令状 -->
    <CoupleCollapsible testid="couple-body-ledger">
      <template #title>📒 身体账本四页 <span class="sub">忌口红线本、体检有人陪、这周身体账、本周熄灯线——都记在一个本子上，翻给你看</span></template>
      <template v-if="b">
        <!-- F316 忌口红线本 -->
        <p class="section-head">🚫 忌口红线本（点菜前先翻这本）</p>
        <div class="inline-form">
          <el-input v-model="rlItem" :maxlength="REDLINE_ITEM_MAX" placeholder="忌口/过敏项（如「香菜」「花生」，≤{{ REDLINE_ITEM_MAX }} 字）" data-testid="couple-body-redline-item" />
          <el-input v-model="rlNote" :maxlength="DISCOMFORT_MAX" placeholder="说明一句（≤{{ DISCOMFORT_MAX }} 字，可空）" data-testid="couple-body-redline-note" />
          <el-button size="small" type="primary" data-testid="couple-body-redline-submit" @click="onRedline">划上这条线 🚫</el-button>
        </div>
        <div class="inline-form">
          <el-radio-group v-model="rlKind" class="opt-group" data-testid="couple-body-redline-kind">
            <el-radio value="ALLERGY" data-testid="couple-body-redline-opt-ALLERGY">过敏（碰都不能碰）</el-radio>
            <el-radio value="AVOID" data-testid="couple-body-redline-opt-AVOID">忌口（今天不想吃）</el-radio>
          </el-radio-group>
        </div>
        <!-- 红线撞上今天的饭票：文案整行由后端拼好下发 -->
        <p
          v-for="h in b.redlineHits"
          :key="h.item"
          class="hit-line"
          :data-testid="`couple-body-redline-hit-${h.item}`"
        >🚨 {{ h.line }}</p>
        <p v-if="!b.redlines.length" class="empty-line">本子上还干净，先把那个一吃就难受的东西写上去 🚫</p>
        <div
          v-for="r in b.redlines"
          :key="r.id"
          class="redline-row"
          :class="r.kind === 'ALLERGY' ? 'is-allergy' : 'is-avoid'"
          :data-testid="`couple-body-redline-${r.id}`"
        >
          <p class="row-head">
            <b class="redline-item" :data-testid="`couple-body-redline-item-text-${r.id}`">「{{ r.item }}」</b>
            <span class="kind-chip" :data-testid="`couple-body-redline-kind-text-${r.id}`">{{ r.kind === 'ALLERGY' ? '过敏 🚫' : '忌口 🙅' }}</span>
            <span class="who-chip" :data-testid="`couple-body-redline-who-${r.id}`">{{ r.mine ? '我登记的 🙋' : '💕 TA 登记的' }}</span>
          </p>
          <p v-if="r.note" class="redline-note" :data-testid="`couple-body-redline-note-text-${r.id}`">{{ r.note }}</p>
          <!-- 谁登记的谁才能划掉（后端 redlineRemove 挡别人） -->
          <el-button v-if="r.mine" size="small" plain :data-testid="`couple-body-redline-del-${r.id}`" @click="onRedlineRemove(r)">这条可以划了 ✂️</el-button>
          <span v-else class="wait-chip" :data-testid="`couple-body-redline-lock-${r.id}`">这条归 TA 自己划，我不动 ✋</span>
        </div>

        <!-- F317 体检陪同 -->
        <div class="block">
          <p class="section-head">🩺 体检有人陪（人不到，手一定到）</p>
          <div class="inline-form">
            <el-input v-model="cuDay" placeholder="哪天去（空=今天，yyyy-MM-dd）" data-testid="couple-body-checkup-day" />
            <el-input v-model="cuItem" :maxlength="CHECKUP_ITEM_MAX" placeholder="查什么（≤{{ CHECKUP_ITEM_MAX }} 字，可空）" data-testid="couple-body-checkup-item" />
            <el-button size="small" type="primary" data-testid="couple-body-checkup-submit" @click="onCheckup">约上 🩺</el-button>
          </div>
          <p v-if="!b.checkups.length" class="empty-line">一本没约过，晚点约也行 🩺</p>
          <div
            v-for="c in b.checkups"
            :key="c.id"
            class="checkup-row"
            :class="{ 'is-reported': c.status === 'REPORTED' }"
            :data-testid="`couple-body-checkup-${c.id}`"
          >
            <p class="row-head">
              <span class="day-chip" :data-testid="`couple-body-checkup-day-text-${c.id}`">{{ c.day }}</span>
              <span class="who-chip" :data-testid="`couple-body-checkup-who-${c.id}`">{{ c.mine ? '我约的 🙋' : '💕 TA 约的' }}</span>
              <span class="status-chip" :data-testid="`couple-body-checkup-status-${c.id}`">{{ checkupStatusText(c) }}</span>
            </p>
            <p v-if="c.item" class="checkup-item" :data-testid="`couple-body-checkup-item-text-${c.id}`">查：{{ c.item }}</p>
            <p v-if="c.companionLine" class="company-line" :data-testid="`couple-body-checkup-company-line-${c.id}`">🫂 {{ c.companionLine }}</p>
            <!-- 虚拟陪同到场：只有对方能到（后端 iCanCompany 算好） -->
            <el-button
              v-if="c.iCanCompany"
              size="small"
              type="primary"
              plain
              :data-testid="`couple-body-checkup-company-${c.id}`"
              @click="onCheckupCompany(c)"
            >我陪你到（虚拟）🫂</el-button>
            <p v-if="c.report" class="report-line" :data-testid="`couple-body-checkup-report-${c.id}`">📄 检后一句话：{{ c.report }}</p>
            <div v-else-if="c.mine" class="inline-form">
              <el-input
                v-model="cuReportDraft[c.id]"
                :maxlength="REPORT_MAX"
                placeholder="查完了说一句（≤{{ REPORT_MAX }} 字，我看完还在）"
                :data-testid="`couple-body-checkup-report-input-${c.id}`"
              />
              <el-button size="small" type="primary" plain :data-testid="`couple-body-checkup-report-btn-${c.id}`" @click="onCheckupReport(c)">
                交这一句 📄
              </el-button>
            </div>
          </div>
        </div>

        <!-- F318 情绪药友 -->
        <div class="block">
          <p class="section-head">💊 这周的身体账（自愿记一笔，我按周问一句，不开药方）</p>
          <div class="inline-form">
            <el-radio-group v-model="medHow" class="opt-group" data-testid="couple-body-med-how">
              <el-radio v-for="h in MED_HOWS" :key="h.key" :value="h.key" :data-testid="`couple-body-med-opt-${h.key}`">{{ h.label }}</el-radio>
            </el-radio-group>
          </div>
          <div class="inline-form">
            <el-input v-model="medNote" :maxlength="CHEER_MAX" placeholder="想多说一句就说（≤{{ CHEER_MAX }} 字，可空）" data-testid="couple-body-med-note" />
            <el-button size="small" type="primary" data-testid="couple-body-med-submit" @click="onMed">{{ myWeekMed ? '改写本周这一笔 🔁' : '记下本周 💊' }}</el-button>
          </div>
          <p v-if="!b.meds.length" class="empty-line">周记本空白着，写「还行」两个字也算写过 💊</p>
          <div
            v-for="m in b.meds"
            :key="`${m.week}-${m.mine ? 'mine' : 'partner'}`"
            class="med-row"
            :class="{ 'is-hard': m.how === 'HARD' }"
            :data-testid="`couple-body-med-row-${m.week}-${m.mine ? 'mine' : 'partner'}`"
          >
            <p class="row-head">
              <span class="day-chip" :data-testid="`couple-body-med-week-${m.week}-${m.mine ? 'mine' : 'partner'}`">{{ m.week }} 那一周</span>
              <span class="who-chip" :data-testid="`couple-body-med-who-${m.week}-${m.mine ? 'mine' : 'partner'}`">{{ m.mine ? '我记的 🙋' : '💕 TA 记的' }}</span>
              <span class="how-chip" :data-testid="`couple-body-med-how-text-${m.week}-${m.mine ? 'mine' : 'partner'}`">{{ medHowLabel(m.how) }}</span>
            </p>
            <p v-if="m.note" class="med-note" :data-testid="`couple-body-med-note-text-${m.week}-${m.mine ? 'mine' : 'partner'}`">{{ m.note }}</p>
            <p v-if="m.reply" class="med-reply" :data-testid="`couple-body-med-reply-${m.week}-${m.mine ? 'mine' : 'partner'}`">🫂 {{ m.replyBy || 'TA' }} 回：{{ m.reply }}</p>
            <!-- 回话只能给 TA 记过的那周（后端 iCanReply 算好） -->
            <div v-if="m.iCanReply" class="inline-form">
              <el-input
                v-model="medReplyDraft[m.week]"
                :maxlength="CHEER_MAX"
                placeholder="回一句陪伴的话（≤{{ CHEER_MAX }} 字，不安慰式说教也行）"
                :data-testid="`couple-body-med-reply-input-${m.week}`"
              />
              <el-button size="small" type="primary" plain :data-testid="`couple-body-med-reply-btn-${m.week}`" @click="onMedReply(m)">
                回这一句 🫂
              </el-button>
            </div>
          </div>
        </div>

        <!-- F319 早睡军令状 -->
        <div class="block">
          <p class="section-head">🌙 本周军令状（{{ b.oath.week }} 那一周，两条线都签了才生效）</p>
          <div class="inline-form">
            <el-input v-model="oathLine" placeholder="几点熄灯（HH:mm，如 23:30）" data-testid="couple-body-oath-line" />
            <el-button size="small" type="primary" data-testid="couple-body-oath-submit" @click="onOath">
              {{ b.oath.mineSigned ? '改我这条线 🔁' : '签我这条线 ✍️' }}
            </el-button>
            <span class="oath-progress" data-testid="couple-body-oath-progress">双签 {{ signedCount }}/2</span>
          </div>
          <p class="oath-line is-mine" data-testid="couple-body-oath-mine">🙋 我的线：{{ b.oath.myLine || '还没签' }}</p>
          <p class="oath-line is-partner" data-testid="couple-body-oath-partner">💕 TA 的线：{{ b.oath.partnerLine || '还没签' }}</p>
          <p v-if="!b.oath.bothSigned" class="wait-line" data-testid="couple-body-oath-wait">
            {{ b.oath.mineSigned ? '等 TA 也签一条，军令状才算立起来 ⏳' : '你先签，TA 那条跟着来 ⏳' }}
          </p>
          <template v-else>
            <p class="lit-chip" data-testid="couple-body-oath-both">军令状双签生效：谁破谁念给对方听 🌙</p>
            <div class="breach-grid">
              <div class="breach-col">
                <p class="breach-title">🙋 我 {{ b.oath.myBreach }}/{{ b.oath.myNights }} 夜破线</p>
                <div class="progress-bar"><i class="is-breach" data-testid="couple-body-oath-bar-mine" :style="{ width: breachRatio(b.oath.myBreach, b.oath.myNights) }" /></div>
              </div>
              <div class="breach-col">
                <p class="breach-title">💕 TA {{ b.oath.partnerBreach }}/{{ b.oath.partnerNights }} 夜破线</p>
                <div class="progress-bar"><i class="is-breach" data-testid="couple-body-oath-bar-partner" :style="{ width: breachRatio(b.oath.partnerBreach, b.oath.partnerNights) }" /></div>
              </div>
            </div>
            <p class="oath-stats" data-testid="couple-body-oath-stats">
              本周俩人一共熄灯 {{ b.oath.myNights + b.oath.partnerNights }} 夜，破线 {{ b.oath.myBreach + b.oath.partnerBreach }} 夜
            </p>
            <p v-if="b.oath.line" class="breach-line" data-testid="couple-body-oath-breach">{{ b.oath.line }}</p>
          </template>
        </div>
      </template>
      <p v-else class="empty-line">本子还没订好…</p>
    </CoupleCollapsible>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { bodyApi } from '@/api/couple'
import type {
  CoupleBodyFitKind,
  CoupleBodyFitVO,
  CoupleBodyMedHow,
  CoupleBodyMedVO,
  CoupleBodyPhase,
  CoupleBodyQuitVO,
  CoupleBodyRedlineKind,
  CoupleBodySnoreLevel,
  CoupleBodySosVO,
  CoupleBodyVO,
} from '@/types'
import CoupleCollapsible from './CoupleCollapsible.vue'

/** 限长常量抄自后端 CoupleBodyService（只用于输入框限长与提示文案，业务判定一律留在后端 400 直透） */
const METRIC_FIELD_MAX = 10
const NOTE_MAX = 80
const DISCOMFORT_MAX = 60
const CARD_MAX = 100
const QUIT_NAME_MAX = 40
const CHEER_MAX = 140
const SYMPTOM_MAX = 80
const REDLINE_ITEM_MAX = 30
const CHECKUP_ITEM_MAX = 60
const REPORT_MAX = 140
const SHAKE_MAX = 60
/** 后端运动链接链窗口（CoupleBodyFit.LINK_WINDOW_MS），只用来算文案里的「还剩几分钟」 */
const LINK_WINDOW_MIN = 30

/** 档位/阶段/项目的展示名：后端 VO 只下发枚举码（周期的 phaseLabel、运动的 kindLabel 才给中文），故这几个码在本组件配中文标签 */
const SNORE_LEVELS: { key: CoupleBodySnoreLevel; label: string }[] = [
  { key: 'NONE', label: '没打呼 😇' },
  { key: 'TINY', label: '轻微 🐭' },
  { key: 'MID', label: '有点响 🔊' },
  { key: 'HEAVY', label: '震天 🌋' },
]
const PHASES: { key: CoupleBodyPhase; label: string }[] = [
  { key: 'BEFORE', label: '提前预警 🔔' },
  { key: 'MENSTRUATING', label: '进行中 🩹' },
  { key: 'AFTER', label: '收尾期 🧦' },
  { key: 'OWULARE', label: '排卵期 🌱' },
]
const FIT_KINDS: { key: CoupleBodyFitKind; label: string }[] = [
  { key: 'PUSHUP', label: '俯卧撑 💪' },
  { key: 'SQUAT', label: '深蹲 🦵' },
  { key: 'PLANK', label: '平板支撑 🧱' },
  { key: 'RUN', label: '跑步 🏃' },
  { key: 'STRETCH', label: '拉伸 🧘' },
]
const MED_HOWS: { key: CoupleBodyMedHow; label: string }[] = [
  { key: 'STEADY', label: '这周稳 ✨' },
  { key: 'HARD', label: '这周难 🌧️' },
  { key: 'NONE', label: '这周没记 🫥' },
]

/** 整份身体总览（除 bodyOverview 外 20 个写接口全部返回整份 BodyVO，整体替换即五卡刷新） */
const b = ref<CoupleBodyVO | null>(null)

// ---- 草稿：F310 体征 ----
const mTemp = ref('')
const mWeight = ref('')
const mSleep = ref('')
const mTempLimit = ref('')
const mSleepLimit = ref('')
const mNote = ref('')
// ---- 草稿：F311 呼噜 / F312 周期 / F315 SOS ----
const snoreLevel = ref<CoupleBodySnoreLevel>('NONE')
const shakeText = ref('')
const cycleDay = ref('')
const cyclePhase = ref<CoupleBodyPhase>('BEFORE')
const cycleDiscomfort = ref('')
const careDraft = ref<Record<string, string>>({})
const sosSymptom = ref('')
const sosSince = ref('')
// ---- 草稿：F313 互助营 / F314 运动链 ----
const quitName = ref('')
const quitDays = ref('21')
const quitStartDay = ref('')
const cheerDraft = ref<Record<string, string>>({})
const fitKind = ref<CoupleBodyFitKind>('PUSHUP')
const fitCount = ref('')
// ---- 草稿：F316 红线 / F317 体检 / F318 身体账 / F319 军令状 ----
const rlItem = ref('')
const rlKind = ref<CoupleBodyRedlineKind>('AVOID')
const rlNote = ref('')
const cuDay = ref('')
const cuItem = ref('')
const cuReportDraft = ref<Record<string, string>>({})
const medHow = ref<CoupleBodyMedHow>('STEADY')
const medNote = ref('')
const medReplyDraft = ref<Record<string, string>>({})
const oathLine = ref('')

// ---- 派生 ----
/** 我今天那一行体征（填过就回填表单，本人可改写） */
const todayMetric = computed(() => (b.value?.metrics ?? []).find((m) => m.mine && m.day === b.value?.day) ?? null)
/** 陈列行：我今天那行活在表单里，不重复列 */
const metricRows = computed(() => (b.value?.metrics ?? []).filter((m) => !(m.mine && m.day === b.value?.day)))
/** 最近一次我自己划的线（换天回填，不必每天重抄一遍阈值） */
const lastMyLimits = computed(() => {
  const mine = (b.value?.metrics ?? []).filter((m) => m.mine && (m.tempLimit || m.sleepLimit))
  return mine.length ? mine[mine.length - 1] : null
})
/** 近 7 天的运动行按日期倒序看，今天在最上面 */
const fitRows = computed(() => [...(b.value?.fits ?? [])].reverse())
/** 本周我自己记的那笔身体账（回填三档与随笔，同周可改写） */
const myWeekMed = computed(() => (b.value?.meds ?? []).find((m) => m.mine && m.week === b.value?.week) ?? null)
const signedCount = computed(() => {
  const o = b.value?.oath
  if (!o) return 0
  return (o.mineSigned ? 1 : 0) + (o.partnerSigned ? 1 : 0)
})

function levelLabel(level: CoupleBodySnoreLevel | ''): string {
  return SNORE_LEVELS.find((l) => l.key === level)?.label ?? '还没报 🫤'
}

function medHowLabel(how: CoupleBodyMedHow | ''): string {
  return MED_HOWS.find((h) => h.key === how)?.label ?? '没记 🫥'
}

function quitStatusText(q: CoupleBodyQuitVO): string {
  if (q.status === 'DONE') return '满期收官 🏆'
  if (q.status === 'GONE') return '提前收营 🏕️'
  return q.mine ? '我在营中 🤝' : 'TA 在营中 🤝'
}

function campRatio(q: CoupleBodyQuitVO): string {
  if (q.targetDays <= 0) return '0%'
  return `${Math.min(100, Math.round((q.campDays / q.targetDays) * 100))}%`
}

function fitStateText(f: CoupleBodyFitVO): string {
  if (f.linked) return '链子接上了 🔗'
  if (!f.partnerIn) return 'TA 还没报 ⏳'
  if (f.minutesSincePartner <= LINK_WINDOW_MIN) return '窗口内，等你报 💪'
  return '今天断链 🔗'
}

/** 断链文案：后端 chainMissLine 没进任何 VO 字段，这里只按 linked/partnerIn/minutesSincePartner 三个已下发字段写话 */
function fitLinkHint(f: CoupleBodyFitVO): string {
  if (f.linked) return `你俩 ${f.myCount} ↔ ${f.partnerCount}，这一环扣上了 🔗`
  if (!f.partnerIn) return `${f.kindLabel}你报了 ${f.myCount}，TA 还没上线，链子先挂着 ⏳`
  if (f.minutesSincePartner <= LINK_WINDOW_MIN) {
    return `TA ${LINK_WINDOW_MIN - f.minutesSincePartner} 分钟前报了 ${f.partnerCount}，接上它就算链 💪`
  }
  return `TA 报了 ${f.partnerCount}，可这都过了 ${f.minutesSincePartner} 分钟——半小时内没接上，今天这环断了，明天早点开工 🔗`
}

function checkupStatusText(c: { status: string; daysLeft: number; companioned: boolean }): string {
  if (c.status === 'REPORTED') return '报告交过 📄'
  if (c.daysLeft < 0) return '已经过去了 📅'
  if (c.daysLeft === 0) return '就是今天 🩺'
  return `还有 ${c.daysLeft} 天${c.companioned ? ' · 我陪同过 🫂' : ''}`
}

function breachRatio(breach: number, nights: number): string {
  if (nights <= 0) return '0%'
  return `${Math.min(100, Math.round((breach / nights) * 100))}%`
}

function onError(e: unknown, fallback: string) {
  // 后端 400 的中文 message 直接透传（例如「至少报一项：体温/体重/睡眠，空报不算打卡」）
  ElMessage.error(e instanceof Error ? e.message : fallback)
}

/** 写接口统一返回整份 BodyVO：整体替换 + 回填四个「本人可改写」的输入区 */
function refresh(data: CoupleBodyVO | null | undefined) {
  if (!data) return
  b.value = data
  const today = data.metrics.find((m) => m.mine && m.day === data.day)
  const limits = data.metrics.filter((m) => m.mine && (m.tempLimit || m.sleepLimit)).pop()
  mTemp.value = today?.temp ?? ''
  mWeight.value = today?.weight ?? ''
  mSleep.value = today?.sleepHours ?? ''
  mTempLimit.value = today?.tempLimit || limits?.tempLimit || ''
  mSleepLimit.value = today?.sleepLimit || limits?.sleepLimit || ''
  mNote.value = today?.note ?? ''
  if (data.snore.myLevel) snoreLevel.value = data.snore.myLevel
  const myMed = data.meds.find((m) => m.mine && m.week === data.week)
  if (myMed?.how) medHow.value = myMed.how
  medNote.value = myMed?.note ?? ''
  oathLine.value = data.oath.myLine
}

// ---- F310 体征互报 ----
async function onMetric() {
  if (!mTemp.value.trim() && !mWeight.value.trim() && !mSleep.value.trim()) {
    // 前端只做一次同样的空值提醒，判定口径仍以后端 400 为准（硬提交会把后端文案直透）
    ElMessage.warning('至少报一项：体温/体重/睡眠，空报不算打卡 🌡️')
    return
  }
  try {
    refresh(await bodyApi.bodyMetric(
      mTemp.value.trim(), mWeight.value.trim(), mSleep.value.trim(),
      mTempLimit.value.trim(), mSleepLimit.value.trim(), mNote.value.trim(),
    ))
    ElMessage.success(todayMetric.value ? '今天这一行改好了 🌡️' : '报上去了，TA 那边同步亮 🌡️')
  } catch (e) {
    onError(e, '报体征失败')
  }
}

// ---- F311 呼噜档位与震感点评 ----
async function onSnore() {
  try {
    refresh(await bodyApi.bodySnore(snoreLevel.value))
    ElMessage.success('档位记上了，明早再报一次 😴')
  } catch (e) {
    onError(e, '报档位失败')
  }
}

async function onShake() {
  const text = shakeText.value.trim()
  if (!text) {
    ElMessage.warning('震感报告总得写一句，光给个数字不像话 🌋')
    return
  }
  try {
    refresh(await bodyApi.bodySnoreShake(text))
    shakeText.value = ''
    ElMessage.success('震感报告已出，TA 的档位从此有据可查 🌋')
  } catch (e) {
    onError(e, '出报告失败')
  }
}

// ---- F312 周期标记与照顾卡 ----
async function onCycle() {
  try {
    refresh(await bodyApi.bodyCycle(cycleDay.value.trim(), cyclePhase.value, cycleDiscomfort.value.trim()))
    cycleDiscomfort.value = ''
    ElMessage.success('标上了，这一天不用每次开口解释 🩹')
  } catch (e) {
    onError(e, '标记失败')
  }
}

async function onCare(day: string) {
  const card = (careDraft.value[day] ?? '').trim()
  if (!card) {
    ElMessage.warning('照顾卡要写一句我能做，光写「多喝热水」不行 🧣')
    return
  }
  try {
    refresh(await bodyApi.bodyCycleCare(day, card))
    careDraft.value = { ...careDraft.value, [day]: '' }
    ElMessage.success('照顾卡送到了 🧣')
  } catch (e) {
    onError(e, '递卡失败')
  }
}

// ---- F315 身体不适 SOS ----
async function onSos() {
  const symptom = sosSymptom.value.trim()
  if (!symptom) {
    ElMessage.warning('哪里不舒服写一句，一个字也算 🆘')
    return
  }
  try {
    refresh(await bodyApi.bodySos(symptom, sosSince.value.trim()))
    sosSymptom.value = ''
    sosSince.value = ''
    ElMessage.success('喊出去了，TA 会选一句「我能做」递回来 🫂')
  } catch (e) {
    onError(e, '喊一声失败')
  }
}

async function onSosHold(s: CoupleBodySosVO, comfort: string) {
  try {
    refresh(await bodyApi.bodySosHold(s.id, comfort))
    ElMessage.success('接住了，不舒服不用道歉也不用解释 🫂')
  } catch (e) {
    onError(e, '接住失败')
  }
}

// ---- F313 互助营 ----
async function onQuitStart() {
  const name = quitName.value.trim()
  if (!name) {
    ElMessage.warning('戒什么要写，空着没法开营 🏕️')
    return
  }
  try {
    const days = Number(quitDays.value.trim())
    refresh(await bodyApi.bodyQuitStart(name, Number.isFinite(days) && days > 0 ? days : 21, quitStartDay.value.trim()))
    quitName.value = ''
    quitStartDay.value = ''
    ElMessage.success('开营了，你是这个营里唯一的人 🏕️')
  } catch (e) {
    onError(e, '开营失败')
  }
}

async function onQuitBroke(q: CoupleBodyQuitVO) {
  try {
    refresh(await bodyApi.bodyQuitBroke(q.id, ''))
    ElMessage.success('记上了。破戒不算塌方，营期不注销 🍬')
  } catch (e) {
    onError(e, '记破戒失败')
  }
}

async function onQuitCheer(q: CoupleBodyQuitVO) {
  const cheer = (cheerDraft.value[q.id] ?? '').trim()
  if (!cheer) {
    ElMessage.warning('陪绑的人得说点什么，空白安慰不算 🍬')
    return
  }
  try {
    refresh(await bodyApi.bodyQuitCheer(q.id, cheer))
    cheerDraft.value = { ...cheerDraft.value, [q.id]: '' }
    ElMessage.success('话送到了，营里第二天照样开工 🍬')
  } catch (e) {
    onError(e, '送安慰词失败')
  }
}

async function onQuitClose(q: CoupleBodyQuitVO) {
  try {
    refresh(await bodyApi.bodyQuitClose(q.id))
    ElMessage.success('营收了，天数是你自己攒的 🏁')
  } catch (e) {
    onError(e, '结营失败')
  }
}

// ---- F314 运动链 ----
async function onFit() {
  const raw = fitCount.value.trim()
  const count = raw === '' ? 0 : Number(raw)
  if (Number.isNaN(count)) {
    ElMessage.warning('计数写个数字就行 🔢')
    return
  }
  try {
    refresh(await bodyApi.bodyFit(fitKind.value, count))
    fitCount.value = ''
    ElMessage.success('报上了，30 分钟内等 TA 接这一环 🔗')
  } catch (e) {
    onError(e, '报计数失败')
  }
}

// ---- F316 忌口红线本 ----
async function onRedline() {
  const item = rlItem.value.trim()
  if (!item) {
    ElMessage.warning('忌口项要写，不写名字厨房没法避 🚫')
    return
  }
  try {
    refresh(await bodyApi.bodyRedlineAdd(item, rlKind.value, rlNote.value.trim()))
    rlItem.value = ''
    rlNote.value = ''
    ElMessage.success(`「${item}」上红线本了，点菜前先翻这本 🚫`)
  } catch (e) {
    onError(e, '划红线失败')
  }
}

async function onRedlineRemove(r: { id: string; item: string }) {
  try {
    refresh(await bodyApi.bodyRedlineRemove(r.id))
    ElMessage.success(`「${r.item}」从红线上划下来了 ✂️`)
  } catch (e) {
    onError(e, '划除失败')
  }
}

// ---- F317 体检陪同 ----
async function onCheckup() {
  try {
    refresh(await bodyApi.bodyCheckup(cuDay.value.trim(), cuItem.value.trim()))
    cuItem.value = ''
    ElMessage.success('约上了，那天有人在外面等你 🩺')
  } catch (e) {
    onError(e, '约体检失败')
  }
}

async function onCheckupCompany(c: { id: string; day: string }) {
  try {
    refresh(await bodyApi.bodyCheckupCompany(c.id))
    ElMessage.success('虚拟陪同到场，一步没走 🫂')
  } catch (e) {
    onError(e, '陪同失败')
  }
}

async function onCheckupReport(c: { id: string }) {
  const report = (cuReportDraft.value[c.id] ?? '').trim()
  if (!report) {
    ElMessage.warning('检后一句话总得写，写完我就看完了 📄')
    return
  }
  try {
    refresh(await bodyApi.bodyCheckupReport(c.id, report))
    cuReportDraft.value = { ...cuReportDraft.value, [c.id]: '' }
    ElMessage.success('这一句收到了，看完了我还在 🫂')
  } catch (e) {
    onError(e, '交报告失败')
  }
}

// ---- F318 情绪药友 ----
async function onMed() {
  try {
    refresh(await bodyApi.bodyMed(medHow.value, medNote.value.trim()))
    ElMessage.success('这一笔记上了，下周我再来敲一次门 💊')
  } catch (e) {
    onError(e, '记身体账失败')
  }
}

async function onMedReply(m: CoupleBodyMedVO) {
  const reply = (medReplyDraft.value[m.week] ?? '').trim()
  if (!reply) {
    ElMessage.warning('回一句陪伴的话，不安慰式说教也行 🫂')
    return
  }
  try {
    refresh(await bodyApi.bodyMedReply(m.week, reply))
    medReplyDraft.value = { ...medReplyDraft.value, [m.week]: '' }
    ElMessage.success('话递过去了 💌')
  } catch (e) {
    onError(e, '回话失败')
  }
}

// ---- F319 早睡军令状 ----
async function onOath() {
  const line = oathLine.value.trim()
  if (!line) {
    ElMessage.warning('熄灯线要写时点，HH:mm 比如 23:30 🌙')
    return
  }
  try {
    refresh(await bodyApi.bodyOath(line))
    ElMessage.success('签好了，谁破谁念给对方听 🌙')
  } catch (e) {
    onError(e, '签线失败')
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
  const data = await safeLoad(bodyApi.bodyOverview, null)
  if (data) refresh(data)
})
</script>

<style scoped>
/* 主色心电监护绿 #16a34a（体检单上那条绿色波形/「今天还行」的底色，跟「身体的事有人按周记」最贴；
   全仓 grep 确认零占用：区别于粉红 #f56c6c / #409eff 公司蓝 / #d2691e 工坊橙棕 / #d93a3a 中国红 /
   #9254de 倾听紫 / #c0392b 庆典金红 / #2c7a7b 考据墨青 / #3f51b5 靛蓝 / #0d9488 剧幕青绿，
   也与全局六套皮肤强调色（#ec5f92/#3370ff/#8b5cf6/#10b981/#f97316/#06b6d4 及各气泡渐变端点，见 src/style.css
   与 utils/settings.ts）都不同——尤其避开 #7c3aed 那条全局气泡渐变，照批次二十六的做法核对过；
   本组件不写 .title 规则，折叠卡标题色一律经 --collapse-title-color 级联给 CoupleCollapsible */
.couple-body { display: flex; flex-direction: column; gap: 14px; --collapse-title-color: #16a34a; }
.sub { font-size: 12px; color: var(--im-muted, #909399); font-weight: normal; margin-left: 6px; }
.section-head { margin: 10px 0 4px; font-size: 13px; font-weight: bold; color: #16a34a; }
.block { margin-top: 12px; padding-top: 8px; border-top: 1px dashed var(--im-border, #ebeef5); }
.inline-form { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 8px; }
.inline-form .el-input { flex: 1; min-width: 150px; }
.opt-group { display: flex; gap: 12px; flex-wrap: wrap; }
.empty-line { margin: 8px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.hint-line { font-size: 12px; color: var(--im-muted, #909399); }
.wait-line { margin: 6px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.wait-chip { font-size: 12px; color: #b8860b; }
.who-chip { font-size: 11px; color: var(--im-muted, #909399); }
.day-chip, .status-chip, .kind-chip, .phase-chip, .how-chip { font-size: 11px; color: #16a34a; background: rgba(22, 163, 74, 0.12); padding: 1px 8px; border-radius: 10px; }
.lit-chip { font-size: 12px; color: #16a34a; background: rgba(22, 163, 74, 0.1); padding: 2px 8px; border-radius: 6px; }
.count-badge { display: inline-block; font-size: 13px; font-weight: bold; color: #16a34a; background: rgba(22, 163, 74, 0.1); padding: 3px 10px; border-radius: 12px; }
.row-head { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; margin: 0; }
.progress-bar { height: 6px; border-radius: 4px; background: rgba(22, 163, 74, 0.15); overflow: hidden; }
.progress-bar i { display: block; height: 100%; background: #16a34a; }
.progress-bar i.is-breach { background: #e6a23c; }
/* F310 体征 */
.today-card { margin-top: 8px; padding: 9px 11px; border-radius: 8px; border-left: 3px solid #16a34a; background: rgba(22, 163, 74, 0.06); }
.today-head { display: flex; gap: 8px; align-items: baseline; margin: 0; font-size: 13px; }
.metric-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid var(--im-border, #ebeef5); font-size: 13px; }
.metric-row.is-warn { border-left-color: #e6a23c; }
.metric-values { margin: 3px 0 0; color: var(--im-text, #303133); }
.metric-note { margin: 3px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.warn-line { margin: 4px 0 0; font-size: 12px; color: #e6a23c; }
.ok-line { margin: 4px 0 0; font-size: 12px; color: #16a34a; }
/* F311 呼噜 */
.my-level { font-size: 12px; color: #16a34a; }
.snore-board { margin-top: 10px; padding: 9px 11px; border-radius: 8px; background: rgba(22, 163, 74, 0.06); }
.board-head { margin: 0 0 4px; font-size: 13px; font-weight: bold; color: #16a34a; }
.board-line { margin: 0; font-size: 13px; color: var(--im-text, #303133); }
.score-chip { margin-left: 6px; font-size: 11px; color: #b8860b; }
.shake-line { margin: 4px 0 0; font-size: 13px; color: var(--im-text, #303133); }
.shake-line.is-partner { color: #16a34a; }
/* F312 周期 */
.cycle-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid var(--im-border, #ebeef5); font-size: 13px; }
.cycle-row.is-partner { border-left-color: #16a34a; }
.cycle-discomfort { margin: 3px 0 0; color: var(--im-text, #303133); }
.care-line { margin: 4px 0 0; font-size: 12px; color: #16a34a; }
/* F315 SOS */
.sos-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid #e6a23c; font-size: 13px; }
.sos-row.is-held { border-left-color: #16a34a; }
.sos-symptom { margin: 3px 0 0; color: var(--im-text, #303133); }
.sos-options { margin-top: 6px; display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }
.opt-head { margin: 0; font-size: 12px; color: #16a34a; }
.sos-held { margin: 4px 0 0; font-size: 12px; color: #16a34a; }
/* F313 互助营 */
.quit-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid #16a34a; font-size: 13px; }
.quit-row.is-done { border-left-color: #b8860b; }
.quit-row.is-gone { opacity: 0.9; }
.quit-name { color: #16a34a; font-size: 14px; }
.quit-meta { margin: 3px 0 4px; font-size: 12px; color: var(--im-muted, #909399); }
.milestone-line { margin: 4px 0 0; font-size: 12px; color: #b8860b; }
.cheer-line { margin: 4px 0 0; font-size: 13px; color: #16a34a; }
/* F314 运动链 */
.fit-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid #e6a23c; font-size: 13px; }
.fit-row.is-linked { border-left-color: #16a34a; }
.fit-count { margin: 3px 0 0; color: var(--im-text, #303133); }
.fit-hint { margin: 3px 0 0; font-size: 12px; color: #16a34a; }
/* F316 红线本 */
.hit-line { margin: 6px 0 0; padding: 5px 8px; border-radius: 6px; font-size: 12px; color: #d93a3a; background: rgba(217, 58, 58, 0.08); }
.redline-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid #d93a3a; font-size: 13px; }
.redline-row.is-avoid { border-left-color: #b8860b; }
.redline-item { color: #d93a3a; }
.redline-note { margin: 3px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
/* F317 体检 */
.checkup-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid #16a34a; font-size: 13px; }
.checkup-row.is-reported { border-left-color: #b8860b; }
.checkup-item { margin: 3px 0 0; color: var(--im-text, #303133); }
.company-line { margin: 4px 0 0; font-size: 12px; color: #16a34a; }
.report-line { margin: 4px 0 0; font-size: 13px; color: #b8860b; }
/* F318 身体账 */
.med-row { margin: 7px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid var(--im-border, #ebeef5); font-size: 13px; }
.med-row.is-hard { border-left-color: #e6a23c; }
.med-note { margin: 3px 0 0; color: var(--im-text, #303133); }
.med-reply { margin: 4px 0 0; font-size: 12px; color: #16a34a; }
/* F319 军令状 */
.oath-progress { font-size: 12px; font-weight: bold; color: #16a34a; }
.oath-line { margin: 4px 0 0; font-size: 13px; color: var(--im-text, #303133); }
.oath-line.is-partner { color: var(--im-muted, #909399); }
.breach-grid { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 8px; }
.breach-col { flex: 1; min-width: 180px; }
.breach-title { margin: 0 0 4px; font-size: 12px; color: var(--im-text, #303133); }
.oath-stats { margin: 6px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.breach-line { margin: 4px 0 0; padding: 5px 8px; border-radius: 6px; font-size: 13px; color: #16a34a; background: rgba(22, 163, 74, 0.08); }
</style>

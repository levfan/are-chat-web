<template>
  <div class="couple-quest" data-testid="couple-quest">
    <!-- F370 关卡预告：挂一场 Boss 战（在途每人 ≤3），TA 自动收到准备提醒 -->
    <CoupleCollapsible testid="couple-quest-upcoming" :empty="!v">
      <template #title>⚔️ 关卡预告 <span class="sub">TA 的大日子先挂上来（面试/汇报/答辩/谈判/体检/其它 + 关卡日 + 一句怯场话），在途每人 ≤{{ PREP_IN_FLIGHT_MAX }} 场，系统替你们记着，不靠记性</span></template>
      <template v-if="v">
        <p class="section-head">⚔️ 挂一场要打的关</p>
        <div class="inline-form">
          <el-input v-model="prepDay" :maxlength="DAY_LEN" placeholder="关卡日（yyyy-MM-dd，今天或以后）" data-testid="couple-quest-prep-day" />
          <el-input
            v-model="prepName"
            :maxlength="PREP_NAME_MAX"
            show-word-limit
            :placeholder="`这一关叫什么（≤${PREP_NAME_MAX} 字，比如「述职答辩」）`"
            data-testid="couple-quest-prep-name"
          />
        </div>
        <div class="chip-row">
          <button
            v-for="k in KIND_OPTIONS"
            :key="k.code"
            type="button"
            class="day-pick"
            :class="{ 'is-picked': prepKind === k.code }"
            :data-testid="`couple-quest-prep-kind-${k.code}`"
            @click="prepKind = k.code"
          >
            {{ k.label }}
          </button>
        </div>
        <el-input
          v-model="prepFear"
          :maxlength="PREP_FEAR_MAX"
          show-word-limit
          :placeholder="`一句怯场话（≤${PREP_FEAR_MAX} 字，可空：TA 会照着这句来陪你）`"
          data-testid="couple-quest-prep-fear"
        />
        <div class="inline-form">
          <el-button size="small" type="primary" data-testid="couple-quest-prep-submit" @click="onPrep">挂上这一关 ⚔️</el-button>
          <span class="count-chip" data-testid="couple-quest-prep-count">在途一共 {{ v.battles.length }} 场（我挂的 {{ myPrepCount }} 场）</span>
        </div>

        <p class="section-head">📋 还在打的关（关卡日近的排前面）</p>
        <p v-if="!v.battles.length" class="empty-line" data-testid="couple-quest-prep-none">还没人挂关卡——有大日子就先说一声 ⚔️</p>
        <div v-for="b in v.battles" :key="b.id" class="row-card" :data-testid="`couple-quest-prep-${b.id}`">
          <p class="row-head">
            <span class="day-chip" :data-testid="`couple-quest-prep-day-text-${b.id}`">{{ b.day }}</span>
            <span class="kind-chip" :data-testid="`couple-quest-prep-kind-text-${b.id}`">{{ b.kindLabel }}</span>
            <span class="who-chip" :data-testid="`couple-quest-prep-who-${b.id}`">{{ b.mine ? '我要打的 🙋' : '💕 TA 要打' }}</span>
            <span class="left-chip" :data-testid="`couple-quest-prep-left-${b.id}`">{{ countdownText(b.daysLeft) }}</span>
          </p>
          <p class="row-main" :data-testid="`couple-quest-prep-name-text-${b.id}`">{{ b.name }}</p>
          <p v-if="b.fear" class="row-quote" :data-testid="`couple-quest-prep-fear-${b.id}`">「{{ b.fear }}」</p>
          <el-button v-if="b.mine" size="small" plain :data-testid="`couple-quest-prep-remove-${b.id}`" @click="onPrepRemove(b.id)">
            撤掉这一关 🕊️
          </el-button>
          <p v-else class="wait-line" :data-testid="`couple-quest-prep-wait-${b.id}`">TA 的关卡，撤不了也报不了——等 TA 打完听结果 🗓️</p>
        </div>
      </template>
      <p v-else class="empty-line">关卡册还空着……</p>
    </CoupleCollapsible>

    <!-- F371 出关战报：打的人交 WIN/LOSE/SURVIVE，对方按战果盖章 -->
    <CoupleCollapsible testid="couple-quest-battle" :empty="!v">
      <template #title>📣 出关战报 <span class="sub">打完回来报一句（漂亮通关 / 没扛住 / 活着回来了），另一人按战果盖章：🏆 庆功章、🫂 抱抱章、🍀 幸亏章。一关一份战报</span></template>
      <template v-if="v">
        <p class="section-head">📣 报哪一关的战果</p>
        <p v-if="!myPrepList.length" class="empty-line" data-testid="couple-quest-report-nopick">没有你要打的关在途——先去「⚔️ 关卡预告」挂一场 📣</p>
        <div v-else class="chip-row">
          <button
            v-for="b in myPrepList"
            :key="b.id"
            type="button"
            class="day-pick"
            :class="{ 'is-picked': reportBattleId === b.id }"
            :data-testid="`couple-quest-report-pick-${b.id}`"
            @click="pickBattle(b)"
          >
            {{ b.day }} {{ b.kindLabel }}·{{ b.name }}
          </button>
        </div>
        <p v-if="reportTarget" class="range-line" data-testid="couple-quest-report-target">正在报：{{ reportTarget.day }} 的「{{ reportTarget.name }}」📣</p>
        <div class="chip-row">
          <button
            v-for="r in RESULT_OPTIONS"
            :key="r.code"
            type="button"
            class="day-pick"
            :class="{ 'is-picked': reportResult === r.code }"
            :data-testid="`couple-quest-report-result-${r.code}`"
            @click="reportResult = r.code"
          >
            {{ r.label }}
          </button>
        </div>
        <el-input
          v-model="reportFeeling"
          type="textarea"
          :rows="2"
          :maxlength="REPORT_FEELING_MAX"
          show-word-limit
          :placeholder="`一句感受（≤${REPORT_FEELING_MAX} 字，可空）`"
          data-testid="couple-quest-report-feeling"
        />
        <el-button size="small" type="primary" data-testid="couple-quest-report-submit" @click="onReport">交这一关的战报 📣</el-button>

        <p class="section-head">🎖️ 战报墙（新的在前）</p>
        <p v-if="!v.reports.length" class="empty-line" data-testid="couple-quest-report-none">还没有战报——打完才有的东西，急不来 📣</p>
        <div v-for="r in v.reports" :key="r.id" class="row-card" :class="{ 'is-sealed': r.sealed }" :data-testid="`couple-quest-report-row-${r.id}`">
          <p class="row-head">
            <span class="kind-chip" :data-testid="`couple-quest-report-name-${r.id}`">{{ r.battleName }}</span>
            <span class="result-chip" :data-testid="`couple-quest-report-result-text-${r.id}`">{{ r.resultLabel }}</span>
            <span class="who-chip" :data-testid="`couple-quest-report-who-${r.id}`">{{ r.mine ? '我打的 🙋' : '💕 TA 打的' }}</span>
          </p>
          <p v-if="r.feeling" class="row-quote" :data-testid="`couple-quest-report-feeling-text-${r.id}`">「{{ r.feeling }}」</p>
          <p v-if="r.sealed" class="lit-line" :data-testid="`couple-quest-report-sealed-${r.id}`">{{ r.sealLabel }} 已盖上（{{ r.sealedBy }}）——这一关不是一个人打的 🎖️</p>
          <el-button v-else-if="!r.mine" size="small" type="primary" :data-testid="`couple-quest-report-seal-${r.id}`" @click="onSeal(r.id)">
            给 TA 盖上{{ r.sealLabel }} 🎖️
          </el-button>
          <p v-else class="wait-line" :data-testid="`couple-quest-report-seal-wait-${r.id}`">战报是自己交的，章要 TA 来盖 🎖️</p>
        </div>
      </template>
      <p v-else class="empty-line">战报墙还空着……</p>
    </CoupleCollapsible>

    <!-- F372 加班预报与留灯 -->
    <CoupleCollapsible testid="couple-quest-overtime" :empty="!v">
      <template #title>🌙 加班预报与留灯 <span class="sub">今晚忙到几点先说一声（{{ OvertimeHourMin }}-{{ OvertimeHourMax }} 点，每人每天一行、当天可改写），对方收「别等饭」，再留一张「到家灯给你留着」的卡 💡</span></template>
      <template v-if="v">
        <p class="section-head">🌙 报我今晚的点儿</p>
        <div class="inline-form">
          <el-input v-model="overtimeHour" :maxlength="2" :placeholder="`忙到几点（${OvertimeHourMin}-${OvertimeHourMax}）`" data-testid="couple-quest-overtime-hour" />
          <el-input
            v-model="overtimeNote"
            :maxlength="OVERTIME_NOTE_MAX"
            show-word-limit
            :placeholder="`附一句（≤${OVERTIME_NOTE_MAX} 字，可空）`"
            data-testid="couple-quest-overtime-note"
          />
          <el-button size="small" type="primary" data-testid="couple-quest-overtime-submit" @click="onOvertime">
            {{ v.myOvertime ? '改写我今晚的预报 🌙' : '报今晚的加班 🌙' }}
          </el-button>
        </div>

        <div class="row-card" data-testid="couple-quest-overtime-mine">
          <p class="row-head">
            <span class="who-chip">我报的 🙋</span>
            <template v-if="v.myOvertime">
              <span class="hour-chip" data-testid="couple-quest-overtime-mine-hour">{{ v.myOvertime.untilHour }} 点左右</span>
              <span class="count-chip" data-testid="couple-quest-overtime-mine-note">{{ v.myOvertime.note || '没附话' }}</span>
            </template>
            <span v-else class="wait-line" data-testid="couple-quest-overtime-mine-none">今晚我还没报 🌙</span>
          </p>
          <p v-if="v.myOvertime && v.myOvertime.lamp" class="lit-line" data-testid="couple-quest-overtime-my-lamp">
            💡 {{ v.myOvertime.lampBy }} 给我留的灯：「{{ v.myOvertime.lamp }}」
          </p>
        </div>
        <div class="row-card is-partner" data-testid="couple-quest-overtime-partner">
          <p class="row-head">
            <span class="who-chip">💕 TA 报的</span>
            <template v-if="v.partnerOvertime">
              <span class="hour-chip" data-testid="couple-quest-overtime-partner-hour">{{ v.partnerOvertime.untilHour }} 点左右</span>
              <span class="count-chip" data-testid="couple-quest-overtime-partner-note">{{ v.partnerOvertime.note || '没附话' }}</span>
            </template>
            <span v-else class="wait-line" data-testid="couple-quest-overtime-partner-none">TA 今晚没预报加班，正常回家 🏠</span>
          </p>
          <p v-if="v.partnerOvertime && v.partnerOvertime.lamp" class="lit-line" data-testid="couple-quest-lamp-lit">
            💡 灯已经留过了：「{{ v.partnerOvertime.lamp }}」（{{ v.partnerOvertime.lampBy }}）
          </p>
        </div>

        <template v-if="v.partnerOvertime && (v.canLeaveLamp || lampByMe)">
          <p class="section-head">💡 给 TA 留一张到家灯卡</p>
          <div class="inline-form">
            <el-input
              v-model="lampText"
              :maxlength="LAMP_MAX"
              show-word-limit
              :placeholder="`灯下想留的那句话（≤${LAMP_MAX} 字）`"
              data-testid="couple-quest-lamp-text"
            />
            <el-button size="small" type="primary" data-testid="couple-quest-lamp-submit" @click="onLamp">
              {{ lampByMe ? '改一改我留的灯 💡' : '灯给你留着 💡' }}
            </el-button>
          </div>
        </template>
        <p v-else-if="!v.partnerOvertime" class="hint-line" data-testid="couple-quest-lamp-norow">今晚没灯可留——TA 没预报加班 🌙</p>
        <p v-else class="hint-line" data-testid="couple-quest-lamp-done">TA 那行的灯已经有人留过了，今晚不重留 💡</p>
      </template>
      <p v-else class="empty-line">今晚的预报还空着……</p>
    </CoupleCollapsible>

    <!-- F373 生病陪护单：病人自己开不了单，代记归陪护人，痊愈只能本人宣布 -->
    <CoupleCollapsible testid="couple-quest-nurse" :empty="!v">
      <template #title>🤒 生病陪护单 <span class="sub">TA 不舒服时由你开单：喝水/吃药你代记（一天每种一次）、写一句病中留言；痊愈只能病人自己宣布，关单那天算一场小庆典 🎉</span></template>
      <template v-if="v">
        <p class="section-head">🤒 为 TA 开一张陪护单</p>
        <div class="inline-form">
          <el-input
            v-model="symptom"
            :maxlength="NURSE_SYMPTOM_MAX"
            show-word-limit
            :placeholder="`症状一句话（≤${NURSE_SYMPTOM_MAX} 字，可空）`"
            data-testid="couple-quest-nurse-symptom"
          />
          <el-button size="small" type="primary" data-testid="couple-quest-nurse-submit" @click="onNurse">挂上陪护单 🤒</el-button>
        </div>
        <p v-if="v.partnerNurse" class="wait-line" data-testid="couple-quest-nurse-inflight">TA 的单还在途（{{ v.partnerNurse.openDay }} 开的），一张够了 🤒</p>

        <div v-if="v.partnerNurse" class="row-card is-caring" :data-testid="`couple-quest-nurse-card-${v.partnerNurse.id}`">
          <p class="row-head">
            <span class="who-chip" :data-testid="`couple-quest-nurse-patient-${v.partnerNurse.id}`">💕 {{ v.partnerNurse.patientUser }} 病了，我在陪</span>
            <span class="left-chip" :data-testid="`couple-quest-nurse-days-${v.partnerNurse.id}`">陪了 {{ v.partnerNurse.days }} 天</span>
            <span class="kind-chip" :data-testid="`couple-quest-nurse-symptom-${v.partnerNurse.id}`">{{ v.partnerNurse.symptom || '没写症状' }}</span>
          </p>
          <p class="row-head">
            <span class="hour-chip" :data-testid="`couple-quest-nurse-water-${v.partnerNurse.id}`">喝水 {{ v.partnerNurse.waterCount }} 次</span>
            <span class="hour-chip" :data-testid="`couple-quest-nurse-med-${v.partnerNurse.id}`">吃药 {{ v.partnerNurse.medCount }} 次</span>
          </p>
          <div class="inline-form">
            <el-button
              size="small"
              type="primary"
              :data-testid="`couple-quest-nurse-mark-WATER-${v.partnerNurse.id}`"
              @click="onNurseMark(v.partnerNurse.id, 'WATER')"
            >
              {{ markedToday('WATER') ? '今天喝水记过了 ✔' : '替 TA 记一次喝水 💧' }}
            </el-button>
            <el-button
              size="small"
              type="primary"
              :data-testid="`couple-quest-nurse-mark-MED-${v.partnerNurse.id}`"
              @click="onNurseMark(v.partnerNurse.id, 'MED')"
            >
              {{ markedToday('MED') ? '今天吃药记过了 ✔' : '替 TA 记一次吃药 💊' }}
            </el-button>
          </div>
          <div class="inline-form">
            <el-input
              v-model="nurseMessage"
              :maxlength="NURSE_MESSAGE_MAX"
              show-word-limit
              :placeholder="`病中留言（≤${NURSE_MESSAGE_MAX} 字，陪护人写）`"
              data-testid="couple-quest-nurse-message"
            />
            <el-button size="small" plain data-testid="couple-quest-nurse-message-submit" @click="onNurseMessage">存这句留言 ✍️</el-button>
          </div>
          <p v-if="v.partnerNurse.marks.length" class="mark-line" data-testid="couple-quest-nurse-marks">
            代记流水：<span v-for="(m, i) in v.partnerNurse.marks" :key="i" :data-testid="`couple-quest-nurse-mark-row-${i}`">{{ m.day }} {{ m.kindLabel }}</span>
          </p>
        </div>

        <div v-if="v.myNurse" class="row-card is-patient" :data-testid="`couple-quest-nurse-self-${v.myNurse.id}`">
          <p class="row-head">
            <span class="who-chip" :data-testid="`couple-quest-nurse-self-who-${v.myNurse.id}`">🙋 我在病中，{{ v.myNurse.carerUser }} 在陪</span>
            <span class="left-chip" :data-testid="`couple-quest-nurse-self-days-${v.myNurse.id}`">已经 {{ v.myNurse.days }} 天</span>
            <span class="kind-chip" :data-testid="`couple-quest-nurse-self-symptom-${v.myNurse.id}`">{{ v.myNurse.symptom || '没写症状' }}</span>
          </p>
          <p class="row-head">
            <span class="hour-chip" :data-testid="`couple-quest-nurse-self-water-${v.myNurse.id}`">TA 替我记喝水 {{ v.myNurse.waterCount }} 次</span>
            <span class="hour-chip" :data-testid="`couple-quest-nurse-self-med-${v.myNurse.id}`">吃药 {{ v.myNurse.medCount }} 次</span>
          </p>
          <p v-if="v.myNurse.message" class="row-quote" :data-testid="`couple-quest-nurse-self-message-${v.myNurse.id}`">💌 {{ v.myNurse.message }}</p>
          <p v-else class="wait-line" :data-testid="`couple-quest-nurse-self-nomessage-${v.myNurse.id}`">陪护人还没留言，TA 在数你的喝水吃药 🤒</p>
          <el-button size="small" type="primary" :data-testid="`couple-quest-nurse-close-${v.myNurse.id}`" @click="onNurseClose(v.myNurse.id)">
            我好了，关单 🎉
          </el-button>
        </div>
        <p v-else class="empty-line" data-testid="couple-quest-nurse-self-none">我现在没病着——没人替你开过在途的陪护单 🤒</p>

        <template v-if="closedNurses.length">
          <p class="section-head">🗂️ 陪过的单（关了的留这儿）</p>
          <div v-for="n in closedNurses" :key="n.id" class="row-card is-closed" :data-testid="`couple-quest-nurse-hist-${n.id}`">
            <p class="row-head">
              <span class="who-chip" :data-testid="`couple-quest-nurse-hist-who-${n.id}`">{{ n.patientUser }} 病了 · {{ n.carerUser }} 陪</span>
              <span class="left-chip" :data-testid="`couple-quest-nurse-hist-days-${n.id}`">{{ n.openDay }} → {{ n.closeDay }}，{{ n.days }} 天</span>
              <span class="hour-chip" :data-testid="`couple-quest-nurse-hist-count-${n.id}`">喝水 {{ n.waterCount }} / 吃药 {{ n.medCount }}</span>
            </p>
            <p v-if="n.message" class="row-quote" :data-testid="`couple-quest-nurse-hist-message-${n.id}`">💌 {{ n.message }}</p>
          </div>
        </template>
      </template>
      <p v-else class="empty-line">陪护单还没开过……</p>
    </CoupleCollapsible>

    <!-- F374 考试周静音舱：一人一舱在途，舱外的人一天一张加油卡，出舱后对方补一封长信 -->
    <CoupleCollapsible testid="couple-quest-pod" :empty="!v">
      <template #title>🔇 考试周静音舱 <span class="sub">要闭关就到某一天（出舱日必须晚于今天，一人同时一舱）；这期间外面的人只递加油卡（一天一张，不屏蔽私信），出舱那天再补一封长信 ✉️</span></template>
      <template v-if="v">
        <p class="section-head">🔇 我进舱</p>
        <div class="inline-form">
          <el-input v-model="podUntil" :maxlength="DAY_LEN" placeholder="出舱日（yyyy-MM-dd，要晚于今天）" data-testid="couple-quest-pod-until" />
          <el-button size="small" type="primary" data-testid="couple-quest-pod-submit" @click="onPod">宣布进舱 🔇</el-button>
        </div>

        <div v-if="v.myPod" class="row-card" :class="{ 'is-in': v.myPod.in }" :data-testid="`couple-quest-pod-mine-${v.myPod.id}`">
          <p class="row-head">
            <span class="who-chip" :data-testid="`couple-quest-pod-mine-state-${v.myPod.id}`">{{ v.myPod.in ? '🙋 我在舱里' : '🔔 我已经出舱了' }}</span>
            <span class="day-chip" :data-testid="`couple-quest-pod-mine-days-${v.myPod.id}`">{{ v.myPod.startDay }} → {{ v.myPod.untilDay }}</span>
            <span v-if="v.myPod.in" class="left-chip" :data-testid="`couple-quest-pod-mine-left-${v.myPod.id}`">{{ countdownText(v.myPod.daysLeft) }}</span>
            <span class="hour-chip" :data-testid="`couple-quest-pod-mine-cheer-${v.myPod.id}`">收到 {{ v.myPod.cheerCount }} 张加油卡</span>
          </p>
          <el-button v-if="v.myPod.in" size="small" type="primary" :data-testid="`couple-quest-pod-out-${v.myPod.id}`" @click="onPodOut(v.myPod.id)">
            我出舱了 🔔
          </el-button>
          <p v-if="!v.myPod.in && !v.myPod.letterDone" class="wait-line" :data-testid="`couple-quest-pod-letter-wait-${v.myPod.id}`">
            出舱了——说好的一封长信等 TA 写 ✉️
          </p>
          <p v-if="!v.myPod.in && v.myPod.letterDone" class="lit-line" :data-testid="`couple-quest-pod-letter-ok-${v.myPod.id}`">✉️ 长信已补，静音舱的债清了</p>
        </div>
        <p v-else class="empty-line" data-testid="couple-quest-pod-mine-none">我还没进过舱 🔇</p>

        <div v-if="v.partnerPod" class="row-card is-partner" :class="{ 'is-in': v.partnerPod.in }" :data-testid="`couple-quest-pod-partner-${v.partnerPod.id}`">
          <p class="row-head">
            <span class="who-chip" :data-testid="`couple-quest-pod-partner-state-${v.partnerPod.id}`">{{ v.partnerPod.in ? '💕 TA 在舱里' : '🔔 TA 出舱了' }}</span>
            <span class="day-chip" :data-testid="`couple-quest-pod-partner-days-${v.partnerPod.id}`">{{ v.partnerPod.startDay }} → {{ v.partnerPod.untilDay }}</span>
            <span v-if="v.partnerPod.in" class="left-chip" :data-testid="`couple-quest-pod-partner-left-${v.partnerPod.id}`">{{ countdownText(v.partnerPod.daysLeft) }}</span>
            <span class="hour-chip" :data-testid="`couple-quest-pod-partner-cheer-${v.partnerPod.id}`">TA 收到 {{ v.partnerPod.cheerCount }} 张加油卡</span>
          </p>
          <el-button
            v-if="v.partnerPod.in"
            size="small"
            type="primary"
            :data-testid="`couple-quest-pod-cheer-${v.partnerPod.id}`"
            @click="onPodCheer(v.partnerPod.id)"
          >
            {{ v.partnerPod.cheeredToday ? '今天这张已经递过了 ✔' : '从外面递一张加油卡 💪' }}
          </el-button>
          <p v-else-if="!v.partnerPod.letterDone" class="wait-line" :data-testid="`couple-quest-pod-partner-letter-${v.partnerPod.id}`">
            TA 出舱了，那封长信该我补 ✉️
          </p>
          <el-button v-if="!v.partnerPod.in && !v.partnerPod.letterDone" size="small" plain :data-testid="`couple-quest-pod-letter-${v.partnerPod.id}`" @click="onPodLetter(v.partnerPod.id)">
            长信我补好了 ✉️
          </el-button>
          <p v-if="!v.partnerPod.in && v.partnerPod.letterDone" class="lit-line" :data-testid="`couple-quest-pod-partner-letter-ok-${v.partnerPod.id}`">✉️ 长信已送达，这舱的债清了</p>
        </div>
        <p v-else class="empty-line" data-testid="couple-quest-pod-partner-none">TA 还没进过舱 🔇</p>
        <p class="hint-line" data-testid="couple-quest-pod-hint">🔇 舱不屏蔽私信——它只是个「我在闭关」的告示牌，加油卡走白名单通道。</p>
      </template>
      <p v-else class="empty-line">静音舱还没开过……</p>
    </CoupleCollapsible>

    <!-- F375 搬家互助：八格区块分工认领 + 纸箱计数 -->
    <CoupleCollapsible testid="couple-quest-move" :empty="!v">
      <template #title>📦 搬家区块 <span class="sub">八个格子（第 1-{{ MOVE_SLOT_MAX }} 格）起名分工：谁认领谁数箱、谁认领谁勾完成，合计 {{ v?.moveBoxes ?? 0 }} 箱。多日的活儿拆成格子就不吓人了</span></template>
      <template v-if="v">
        <p class="section-head">📦 八格看板（没开过的格子先起名或直接认领）</p>
        <div v-for="slot in MOVE_SLOTS" :key="slot" class="row-card" :data-testid="`couple-quest-move-row-${slot}`">
          <p class="row-head">
            <span class="kind-chip" :data-testid="`couple-quest-move-slot-${slot}`">第 {{ slot }} 格</span>
            <span v-if="moveOf(slot)" class="who-chip" :data-testid="`couple-quest-move-owner-${slot}`">
              {{ moveOf(slot)?.mine ? '我认领的 🙋' : (moveOf(slot)?.claimed ? `💕 ${moveOf(slot)?.owner} 认领了` : '还没人认领 📦') }}
            </span>
            <span v-else class="who-chip" :data-testid="`couple-quest-move-owner-${slot}`">还没开这一格 📦</span>
            <span v-if="moveOf(slot)?.finished" class="lit-chip" :data-testid="`couple-quest-move-finished-${slot}`">✅ 打包完 {{ moveOf(slot)?.boxes }} 箱</span>
            <span v-else-if="moveOf(slot)" class="hour-chip" :data-testid="`couple-quest-move-boxes-text-${slot}`">已记 {{ moveOf(slot)?.boxes }} 箱</span>
          </p>
          <p v-if="moveOf(slot)?.name" class="row-main" :data-testid="`couple-quest-move-name-text-${slot}`">{{ moveOf(slot)?.name }}</p>
          <div class="inline-form">
            <el-input
              v-model="moveName[slot]"
              :maxlength="MOVE_NAME_MAX"
              :placeholder="`这块装什么（≤${MOVE_NAME_MAX} 字，谁都能补）`"
              :data-testid="`couple-quest-move-name-${slot}`"
            />
            <el-button size="small" plain :data-testid="`couple-quest-move-name-btn-${slot}`" @click="onMoveName(slot)">起名 / 改写 🏷️</el-button>
            <el-button size="small" :data-testid="`couple-quest-move-claim-${slot}`" @click="onMoveClaim(slot)">
              {{ moveOf(slot)?.mine ? '我这格松手 📦' : '认领这一格 🙋' }}
            </el-button>
          </div>
          <div v-if="moveOf(slot)?.mine" class="inline-form">
            <el-input v-model="moveBoxesInput[slot]" :maxlength="2" placeholder="打包了几箱（0-99）" :data-testid="`couple-quest-move-boxes-${slot}`" />
            <el-button size="small" plain :data-testid="`couple-quest-move-boxes-btn-${slot}`" @click="onMoveBoxes(slot)">记这一格的箱数 📦</el-button>
            <el-button size="small" type="primary" :data-testid="`couple-quest-move-done-${slot}`" @click="onMoveDone(slot)">这一格打包完成 ✅</el-button>
          </div>
          <p v-else-if="moveOf(slot)?.claimed" class="wait-line" :data-testid="`couple-quest-move-wait-${slot}`">这格归 {{ moveOf(slot)?.owner }}——数箱和勾完成只能 TA 来 📦</p>
        </div>
        <p class="range-line" data-testid="couple-quest-move-total">两个人加起来记了 <span data-testid="couple-quest-move-total-boxes">{{ v.moveBoxes }}</span> 箱，打包完 <span data-testid="couple-quest-move-done-count">{{ finishedCount }}</span> / {{ MOVE_SLOT_MAX }} 格 📦</p>
      </template>
      <p v-else class="empty-line">纸箱还没摆出来……</p>
    </CoupleCollapsible>

    <!-- 新家第一晚（后端 F375 的收尾打卡，双人才算庆祝；归在 -night 卡） -->
    <CoupleCollapsible testid="couple-quest-night" :empty="!v">
      <template #title>🏠 新家第一晚 <span class="sub">搬家那一晚各人点各人那一格（note ≤{{ NIGHT_NOTE_MAX }} 字由先点的人写），两个人都在才算庆祝——房子是空的，从这一晚开始是家的</span></template>
      <template v-if="v">
        <p class="section-head">🏠 哪一晚是新家第一晚</p>
        <div class="inline-form">
          <el-input v-model="nightDay" :maxlength="DAY_LEN" placeholder="那天（yyyy-MM-dd）" data-testid="couple-quest-night-day" />
          <el-button size="small" type="primary" data-testid="couple-quest-night-submit" @click="onNight">
            {{ nightAlreadyMine ? '我那一晚点过了 ✔' : '点上我这一格 🏠' }}
          </el-button>
        </div>
        <el-input
          v-model="nightNote"
          :maxlength="NIGHT_NOTE_MAX"
          show-word-limit
          :disabled="nightAlreadyMine"
          :placeholder="nightNotePlaceholder"
          data-testid="couple-quest-night-note"
        />

        <div v-if="v.moveNight" class="row-card" :class="{ 'is-lit': v.moveNight.bothTicked }" :data-testid="`couple-quest-night-row-${v.moveNight.id}`">
          <p class="row-head">
            <span class="day-chip" data-testid="couple-quest-night-date">{{ v.moveNight.day }}</span>
            <span class="who-chip" data-testid="couple-quest-night-mine">{{ v.moveNight.mineTicked ? '我这一格点了 ✔' : '我这一格还空着 🙋' }}</span>
            <span class="who-chip" data-testid="couple-quest-night-partner">{{ v.moveNight.partnerTicked ? 'TA 这一格点了 ✔' : 'TA 那一格还空着 💕' }}</span>
          </p>
          <p v-if="v.moveNight.note" class="row-quote" data-testid="couple-quest-night-note-text">「{{ v.moveNight.note }}」</p>
          <p v-if="v.moveNight.bothTicked" class="lit-line" data-testid="couple-quest-night-both">🏠✨ 那一晚两个人都在，这盏灯点亮了</p>
          <p v-else-if="v.moveNight.mineTicked" class="wait-line" data-testid="couple-quest-night-wait">你这一格点了，还差 TA 一个 🏠</p>
          <p v-else-if="v.moveNight.partnerTicked" class="wait-line" data-testid="couple-quest-night-wait-me">TA 已经点上那一晚了，就差你这一个 🏠</p>
          <p v-else class="empty-line" data-testid="couple-quest-night-open">那一晚还没人点，谁先到家谁先点 🏠</p>
        </div>
        <p v-else class="empty-line" data-testid="couple-quest-night-none">还没有「第一晚」——搬完家填个日子，各点一格 🏠</p>
      </template>
      <p v-else class="empty-line">新家的钥匙还没交接……</p>
    </CoupleCollapsible>

    <!-- F376 低谷通行证：本人宣布 7-30 天，对方一天递一张「不说话也行」，回升只能本人说 -->
    <CoupleCollapsible testid="couple-quest-valley" :empty="!v">
      <template #title>🌧️ 低谷通行证 <span class="sub">「最近状态不好」由本人挂（回升日 {{ VALLEY_SPAN_MIN }}-{{ VALLEY_SPAN_MAX }} 天后，在途每人一张）；对方不讲道理，一天递一张「不说话也行」卡；缓过来那天也只由本人宣布 🌤️</span></template>
      <template v-if="v">
        <p class="section-head">🌧️ 我宣布进低谷</p>
        <div class="inline-form">
          <el-input v-model="valleyUntil" :maxlength="DAY_LEN" :placeholder="`回升日（yyyy-MM-dd，${VALLEY_SPAN_MIN}-${VALLEY_SPAN_MAX} 天后）`" data-testid="couple-quest-valley-until" />
          <el-button size="small" type="primary" data-testid="couple-quest-valley-submit" @click="onValley">挂上通行证 🌧️</el-button>
        </div>

        <div v-if="v.myValley" class="row-card is-low" :data-testid="`couple-quest-valley-mine-${v.myValley.id}`">
          <p class="row-head">
            <span class="who-chip" :data-testid="`couple-quest-valley-mine-state-${v.myValley.id}`">{{ v.myValley.low ? '🙋 我的通行证在有效期内' : '🌤️ 我的通行证已经收尾了' }}</span>
            <span class="day-chip" :data-testid="`couple-quest-valley-mine-days-${v.myValley.id}`">{{ v.myValley.openDay }} → {{ v.myValley.untilDay }}（挂 {{ v.myValley.spanDays }} 天）</span>
            <span v-if="v.myValley.low" class="left-chip" :data-testid="`couple-quest-valley-mine-left-${v.myValley.id}`">{{ countdownText(v.myValley.daysLeft) }}</span>
            <span class="hour-chip" :data-testid="`couple-quest-valley-mine-care-${v.myValley.id}`">收到 {{ v.myValley.careCount }} 张卡</span>
          </p>
          <p v-if="v.myValley.reviveDay" class="lit-line" :data-testid="`couple-quest-valley-mine-revive-${v.myValley.id}`">🌤️ {{ v.myValley.reviveDay }} 我自己说了「缓过来了」</p>
          <el-button v-if="v.myValley.low" size="small" type="primary" :data-testid="`couple-quest-valley-rise-${v.myValley.id}`" @click="onValleyRise(v.myValley.id)">
            我缓过来了，收尾 🌤️
          </el-button>
        </div>
        <p v-else class="empty-line" data-testid="couple-quest-valley-mine-none">我没有在途的通行证——撑不住就说一声 🌧️</p>

        <div v-if="v.partnerValley" class="row-card is-partner" :data-testid="`couple-quest-valley-partner-${v.partnerValley.id}`">
          <p class="row-head">
            <span class="who-chip" :data-testid="`couple-quest-valley-partner-state-${v.partnerValley.id}`">{{ v.partnerValley.low ? '💕 TA 在低谷期' : '🌤️ TA 已经回升了' }}</span>
            <span class="day-chip" :data-testid="`couple-quest-valley-partner-days-${v.partnerValley.id}`">{{ v.partnerValley.openDay }} → {{ v.partnerValley.untilDay }}</span>
            <span v-if="v.partnerValley.low" class="left-chip" :data-testid="`couple-quest-valley-partner-left-${v.partnerValley.id}`">{{ countdownText(v.partnerValley.daysLeft) }}</span>
            <span class="hour-chip" :data-testid="`couple-quest-valley-partner-care-${v.partnerValley.id}`">TA 收到 {{ v.partnerValley.careCount }} 张卡</span>
          </p>
          <el-button
            v-if="v.partnerValley.low"
            size="small"
            type="primary"
            :data-testid="`couple-quest-valley-care-${v.partnerValley.id}`"
            @click="onValleyCare(v.partnerValley.id)"
          >
            {{ v.partnerValley.caredToday ? '今天这张卡已经递过了 ✔' : '递一张「不说话也行」🧻' }}
          </el-button>
          <p v-else class="wait-line" :data-testid="`couple-quest-valley-partner-up-${v.partnerValley.id}`">TA 自己说缓过来了，卡改天再递 🌤️</p>
          <p class="hint-line" data-testid="couple-quest-valley-partner-hint">🌧️ 回升日只能 TA 自己宣布——别人替 TA 说「你好了」不算数。</p>
        </div>
        <p v-else class="empty-line" data-testid="couple-quest-valley-partner-none">TA 没挂通行证（也可能已经收尾了）🌧️</p>
      </template>
      <p v-else class="empty-line">通行证还没发……</p>
    </CoupleCollapsible>

    <!-- F377 小胜利账本（每人每天一条，一周一颁）+ F378 关卡成就墙（当年随总览，读另一年按按钮） -->
    <CoupleCollapsible testid="couple-quest-win" :empty="!v">
      <template #title>🏅 小胜利账本与成就墙 <span class="sub">每天记一件做成的小事（≤{{ WIN_CONTENT_MAX }} 字，每人每天一条），另一人一周颁一次「小赢奖」；年底把这年的关卡砌成一面墙 🧗</span></template>
      <template v-if="v">
        <p class="section-head">🏅 今天做成的一件小事</p>
        <div class="inline-form">
          <el-input
            v-model="winContent"
            :maxlength="WIN_CONTENT_MAX"
            show-word-limit
            :placeholder="`做成的一件小事（≤${WIN_CONTENT_MAX} 字，比如「把简历改了」）`"
            data-testid="couple-quest-win-content"
          />
          <el-input v-model="winDay" :maxlength="DAY_LEN" placeholder="哪天（空=今天，yyyy-MM-dd）" data-testid="couple-quest-win-day" />
          <el-button size="small" type="primary" data-testid="couple-quest-win-submit" @click="onWin">
            {{ myTodayWin ? '改写今天这条 🏅' : '记下这件小事 🏅' }}
          </el-button>
        </div>

        <p class="section-head">🏆 小赢奖（一人一周一颁，只能颁对方的）</p>
        <p class="range-line" data-testid="couple-quest-win-week">本周锚：{{ v.weekStart }} 起那一周{{ awardedThisWeek ? '——我这周已经颁过一次了' : '——这周还没颁' }}</p>
        <p v-if="!v.wins.length" class="empty-line" data-testid="couple-quest-win-none">账本还是空的——小事也算事，先记一条 🏅</p>
        <div v-for="w in v.wins" :key="w.id" class="row-card" :class="{ 'is-awarded': w.awarded }" :data-testid="`couple-quest-win-${w.id}`">
          <p class="row-head">
            <span class="day-chip" :data-testid="`couple-quest-win-day-text-${w.id}`">{{ w.day }}</span>
            <span class="who-chip" :data-testid="`couple-quest-win-who-${w.id}`">{{ w.mine ? '我做的 🙋' : '💕 TA 做的' }}</span>
            <span v-if="w.awarded" class="lit-chip" :data-testid="`couple-quest-win-awarded-${w.id}`">🏆 {{ w.awardDay }} 由 {{ w.awardedBy }} 颁</span>
          </p>
          <p class="row-main" :data-testid="`couple-quest-win-text-${w.id}`">{{ w.content }}</p>
          <el-button
            v-if="w.canAward && !w.awarded"
            size="small"
            type="primary"
            :data-testid="`couple-quest-win-award-${w.id}`"
            @click="onWinAward(w.id)"
          >
            这周的小赢奖颁给这条 🏆
          </el-button>
          <p v-else-if="w.awarded" class="lit-line" :data-testid="`couple-quest-win-awarded-line-${w.id}`">🏆 这条已经被颁过了，一周一颁</p>
          <p v-else class="wait-line" :data-testid="`couple-quest-win-award-wait-${w.id}`">这条是我的——小赢奖只颁给 TA 🏆</p>
        </div>

        <p class="section-head">🧗 关卡成就墙（{{ shownWall.year }} 年）</p>
        <div class="inline-form">
          <el-input v-model="wallYear" :maxlength="YEAR_LEN" placeholder="读哪一年（空=今年，yyyy）" data-testid="couple-quest-wall-year" />
          <el-button size="small" type="primary" data-testid="couple-quest-wall-btn" @click="onWall">读这一年的墙 🧗</el-button>
          <el-button v-if="wallView" size="small" plain data-testid="couple-quest-wall-reset" @click="onWallBack">回到今年 ↩️</el-button>
          <span v-if="wallView" class="count-chip" data-testid="couple-quest-wall-lazy">这是另外读的一年</span>
          <span v-else class="count-chip" data-testid="couple-quest-wall-current">今年这份随总览下发</span>
        </div>
        <div class="wall-card" data-testid="couple-quest-win-wall">
          <p class="row-head">
            <span class="kind-chip" data-testid="couple-quest-win-wall-title">{{ shownWall.title }}</span>
            <span class="day-chip" data-testid="couple-quest-win-wall-year">{{ shownWall.year }} 年</span>
          </p>
          <div class="stat-grid">
            <p class="stat" data-testid="couple-quest-win-wall-battles">Boss 战 {{ shownWall.battles }} 场 🧗</p>
            <p class="stat" data-testid="couple-quest-win-wall-reports">战报 {{ shownWall.reports }} 份 📣</p>
            <p class="stat" data-testid="couple-quest-win-wall-rate">通关率 {{ shownWall.winRate }}% 🏆</p>
            <p class="stat" data-testid="couple-quest-win-wall-nurse-days">陪护 {{ shownWall.nurseDays }} 天 🤒</p>
            <p class="stat" data-testid="couple-quest-win-wall-pods">静音舱+打包格 {{ shownWall.pods }} 📦</p>
            <p class="stat" data-testid="couple-quest-win-wall-valley-days">低谷 {{ shownWall.valleyDays }} 天 🌧️</p>
            <p class="stat" data-testid="couple-quest-win-wall-awards">小赢奖+不说话卡 {{ shownWall.awards }} 张 🏅</p>
            <p class="stat" data-testid="couple-quest-win-wall-attends">到场应援 {{ shownWall.attends }} 回 🙋</p>
          </div>
          <p class="summary-line" data-testid="couple-quest-win-wall-summary">{{ shownWall.summary }}</p>
        </div>
      </template>
      <p v-else class="empty-line">小胜利还没记账……</p>
    </CoupleCollapsible>

    <!-- F379 下次关卡预约：未来 60 天的双人时间轴，对方点「我会到场」（卡 testid 按批文沿用 -report） -->
    <CoupleCollapsible testid="couple-quest-report" :empty="!v">
      <template #title>🙋 下次关口预约 <span class="sub">把未来 {{ UPCOMING_WINDOW_DAYS }} 天里已知的关口挂上双人时间轴（关口名 ≤{{ UPCOMING_TITLE_MAX }} 字），对方点「我会到场」。倒数吃服务端给的天数</span></template>
      <template v-if="v">
        <p class="section-head">🙋 挂一个关口</p>
        <div class="inline-form">
          <el-input v-model="nextDay" :maxlength="DAY_LEN" :placeholder="`日子（yyyy-MM-dd，今天起 ${UPCOMING_WINDOW_DAYS} 天内）`" data-testid="couple-quest-next-day" />
          <el-input
            v-model="nextTitle"
            :maxlength="UPCOMING_TITLE_MAX"
            show-word-limit
            :placeholder="`关口叫什么（≤${UPCOMING_TITLE_MAX} 字）`"
            data-testid="couple-quest-next-title"
          />
          <el-button size="small" type="primary" data-testid="couple-quest-next-submit" @click="onUpcoming">挂上时间轴 🙋</el-button>
        </div>

        <p class="section-head">🗓️ 还没到的关口（日子近的排前面）</p>
        <p v-if="!v.upcoming.length" class="empty-line" data-testid="couple-quest-next-none">时间轴上没有待到的关口——先挂一个 🙋</p>
        <div v-for="u in v.upcoming" :key="u.id" class="row-card" :class="{ 'is-attended': u.attended }" :data-testid="`couple-quest-next-${u.id}`">
          <p class="row-head">
            <span class="day-chip" :data-testid="`couple-quest-next-date-${u.id}`">{{ u.day }}</span>
            <span class="left-chip" :data-testid="`couple-quest-next-left-${u.id}`">{{ countdownText(u.daysLeft) }}</span>
            <span class="who-chip" :data-testid="`couple-quest-next-who-${u.id}`">{{ u.mine ? '我挂的 🙋' : '💕 TA 挂的' }}</span>
          </p>
          <p class="row-main" :data-testid="`couple-quest-next-title-text-${u.id}`">{{ u.title }}</p>
          <p v-if="u.attended" class="lit-line" :data-testid="`couple-quest-next-ok-${u.id}`">🙋 {{ u.attendBy }} 说：这一天我会到场</p>
          <el-button v-else-if="!u.mine" size="small" type="primary" :data-testid="`couple-quest-next-attend-${u.id}`" @click="onUpcomingAttend(u.id)">
            我会到场 🙋
          </el-button>
          <p v-else class="wait-line" :data-testid="`couple-quest-next-wait-${u.id}`">自己挂的关口自己应援不算——等到场那句从 TA 嘴里说 🙋</p>
          <el-button v-if="u.mine" size="small" plain :data-testid="`couple-quest-next-remove-${u.id}`" @click="onUpcomingRemove(u.id)">
            撤掉这个关口 🗑️
          </el-button>
        </div>
      </template>
      <p v-else class="empty-line">双人时间轴还空着……</p>
    </CoupleCollapsible>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { questApi } from '@/api/couple'
import type {
  CoupleQuestBattleKind,
  CoupleQuestBattleVO,
  CoupleQuestCareKind,
  CoupleQuestMoveVO,
  CoupleQuestResult,
  CoupleQuestVO,
  CoupleQuestWallVO,
} from '@/types'
import { useAuthStore } from '@/stores/auth'
import CoupleCollapsible from './CoupleCollapsible.vue'

/**
 * 限长与上限一律抄自后端 CoupleQuestService 与 CoupleQuest* 实体常量（只用于输入框限长与前端闸门文案；
 * 归属判定、幂等、每日/每周一颁的结算、倒数与成就墙数字一律留在后端，400 中文直透）：
 * CoupleQuestBattle.NAME_MAX=30 FEAR_MAX=60 IN_FLIGHT_MAX=3 KINDS 六个 /
 * CoupleQuestReport.RESULTS=WIN|LOSE|SURVIVE FEELING_MAX=60 /
 * CoupleQuestOvertime.HOUR_MIN=13 HOUR_MAX=23 HOUR_DEFAULT=20 NOTE_MAX=40 LAMP_MAX=60 /
 * CoupleQuestNurse.SYMPTOM_MAX=60 MESSAGE_MAX=80 IN_FLIGHT_MAX=1、CoupleQuestCareMark.KINDS=WATER|MED /
 * CoupleQuestMove.SLOT_MIN=1 SLOT_MAX=8 NAME_MAX=20 BOX_MAX=99、CoupleQuestMoveNight.NOTE_MAX=60 /
 * CoupleQuestValley.SPAN_MIN=7 SPAN_MAX=30 / CoupleQuestWin.CONTENT_MAX=40 /
 * CoupleQuestUpcoming.TITLE_MAX=30 WINDOW_DAYS=60
 */
const PREP_NAME_MAX = 30
const PREP_FEAR_MAX = 60
const PREP_IN_FLIGHT_MAX = 3
const REPORT_FEELING_MAX = 60
const OvertimeHourMin = 13
const OvertimeHourMax = 23
const OVERTIME_NOTE_MAX = 40
const LAMP_MAX = 60
const NURSE_SYMPTOM_MAX = 60
const NURSE_MESSAGE_MAX = 80
const MOVE_SLOT_MIN = 1
const MOVE_SLOT_MAX = 8
const MOVE_NAME_MAX = 20
const MOVE_BOX_MAX = 99
const NIGHT_NOTE_MAX = 60
const VALLEY_SPAN_MIN = 7
const VALLEY_SPAN_MAX = 30
const WIN_CONTENT_MAX = 40
const UPCOMING_TITLE_MAX = 30
const UPCOMING_WINDOW_DAYS = 60
const DAY_LEN = 10
const YEAR_LEN = 4
const DAY_MS = 86_400_000
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/
const YEAR_RE = /^\d{4}$/
const MOVE_SLOTS = [1, 2, 3, 4, 5, 6, 7, 8]

/** 类型/战果的中文选项（前端表单要用；⚠️ 展示一律优先吃后端下发的 kindLabel/resultLabel，
 *  这份池子只用于「还没提交」的输入口，判定不参与——Bank 那侧才是唯一口径来源） */
const KIND_OPTIONS: { code: CoupleQuestBattleKind; label: string }[] = [
  { code: 'INTERVIEW', label: '面试' },
  { code: 'REPORT', label: '汇报' },
  { code: 'DEFEND', label: '答辩' },
  { code: 'TALK', label: '谈判' },
  { code: 'CHECKUP', label: '体检' },
  { code: 'OTHER', label: '其它' },
]
const RESULT_OPTIONS: { code: CoupleQuestResult; label: string }[] = [
  { code: 'WIN', label: '漂亮通关 🏆' },
  { code: 'LOSE', label: '没扛住 🫂' },
  { code: 'SURVIVE', label: '活着回来了 🍀' },
]

const auth = useAuthStore()

/** 关卡总览：GET /board 与 27 个 POST 写接口都返回整份它，整体替换即十卡刷新 */
const v = ref<CoupleQuestVO | null>(null)
/** F378 成就墙的懒读结果（读另一年用；null=看总览里当年那份，永不被写接口覆盖） */
const wallView = ref<CoupleQuestWallVO | null>(null)
const wallYear = ref('')

// ---- 草稿（全是「本人这一侧」的输入口） ----
const prepDay = ref('')
const prepKind = ref<CoupleQuestBattleKind | ''>('')
const prepName = ref('')
const prepFear = ref('')
const reportBattleId = ref('')
const reportResult = ref<CoupleQuestResult | ''>('')
const reportFeeling = ref('')
const overtimeHour = ref('')
const overtimeNote = ref('')
const lampText = ref('')
const symptom = ref('')
const nurseMessage = ref('')
const podUntil = ref('')
const moveName = ref<Record<number, string>>({})
const moveBoxesInput = ref<Record<number, string>>({})
const nightDay = ref('')
const nightNote = ref('')
const valleyUntil = ref('')
const winContent = ref('')
const winDay = ref('')
const nextDay = ref('')
const nextTitle = ref('')

// ---- 派生（全部吃服务端下发的布尔/计数，不留本地「我按过没」的位） ----
const myPrepList = computed<CoupleQuestBattleVO[]>(() => (v.value ? v.value.battles.filter((b) => b.mine) : []))
const myPrepCount = computed(() => myPrepList.value.length)
const reportTarget = computed(() => v.value?.battles.find((b) => b.id === reportBattleId.value) ?? null)
const lampByMe = computed(() => !!v.value?.partnerOvertime && v.value.partnerOvertime.lampBy === auth.username)
const finishedCount = computed(() => (v.value ? v.value.moves.filter((m) => m.finished).length : 0))
const closedNurses = computed(() => (v.value ? v.value.nurses.filter((n) => !n.open) : []))
const myTodayWin = computed(() => {
  const today = v.value?.day ?? ''
  return v.value?.wins.find((w) => w.mine && w.day === today) ?? null
})
/** 一人一周一颁：总览不下发「我这周颁过没」，但 wins 里有 awardDay/awardedBy 两个服务端字段可比对，
 *  按 weekStart~周末那一周里「颁名人是我」的行判（列表只给最近 21 条，判漏了后端照样 400 兜住） */
const awardedThisWeek = computed(() => {
  if (!v.value) return false
  const from = v.value.weekStart
  const to = addDays(from, 6)
  return v.value.wins.some((w) => w.awardedBy === auth.username && w.awardDay >= from && w.awardDay <= to)
})
/** 新家第一晚：只有当前这一晚且服务端说我这格点过了，才收掉输入口（后端不翻转就不写库） */
const nightAlreadyMine = computed(() => {
  const night = v.value?.moveNight ?? null
  if (!night || !night.mineTicked) return false
  const day = nightDay.value.trim()
  return !day || day === night.day
})
const nightNotePlaceholder = computed(() =>
  nightAlreadyMine.value
    ? '那一晚你已经打过卡了，那句话只有先点的人写得进去'
    : `那一晚的一句话（≤${NIGHT_NOTE_MAX} 字，先点的人写）`,
)
/** 未建空间时总览没有 wall，成就墙那一段落全零空态（不报错、不自造数字） */
function emptyWall(): CoupleQuestWallVO {
  return {
    year: 0, battles: 0, reports: 0, winRate: 0, nurseDays: 0, pods: 0, valleyDays: 0,
    awards: 0, attends: 0, title: '', summary: '',
  }
}
const shownWall = computed<CoupleQuestWallVO>(() => wallView.value ?? v.value?.wall ?? emptyWall())

// ---- 小工具 ----
function addDays(day: string, n: number): string {
  if (!DAY_RE.test(day)) return ''
  const ts = Date.parse(`${day}T00:00:00Z`)
  if (Number.isNaN(ts)) return ''
  return new Date(ts + n * DAY_MS).toISOString().slice(0, 10)
}

function diffDays(from: string, to: string): number | null {
  if (!DAY_RE.test(from) || !DAY_RE.test(to)) return null
  const a = Date.parse(`${from}T00:00:00Z`)
  const b = Date.parse(`${to}T00:00:00Z`)
  if (Number.isNaN(a) || Number.isNaN(b)) return null
  return Math.round((b - a) / DAY_MS)
}

/** 倒数一律吃服务端 daysLeft（今天 0、已过为负），绝不自己算本地时钟 */
function countdownText(left: number): string {
  if (left === 0) return '就是今天 ⏰'
  if (left < 0) return `已经过去 ${Math.abs(left)} 天 ⏳`
  return `还有 ${left} 天 ⏳`
}

function moveOf(slot: number): CoupleQuestMoveVO | undefined {
  return v.value?.moves.find((m) => m.slot === slot)
}

/** 今天这一种代记我是不是已经记过（服务端 marks 里的 day+kind+mine 三位比对） */
function markedToday(kind: CoupleQuestCareKind): boolean {
  const nurse = v.value?.partnerNurse ?? null
  if (!nurse || !v.value) return false
  return nurse.marks.some((m) => m.mine && m.kind === kind && m.day === v.value!.day)
}

function onError(e: unknown, fallback: string) {
  // 后端 400/404 的中文 message 直接透传（例如「这场是 TA 的关卡，只有 TA 自己能撤 ⚔️」）
  ElMessage.error(e instanceof Error ? e.message : fallback)
}

function noData(): boolean {
  if (!v.value) {
    ElMessage.warning('还没拿到关卡总览，重进一次「🤝 约定」页签试试')
    return true
  }
  return false
}

/**
 * 写接口统一返回整份 QuestVO：整体替换即十卡刷新。
 * 替换后只回填「本人这一侧」的输入口：今晚的加班预报与附言、我留过的灯、陪护留言、
 * 八格区块名与我自己那几格的箱数、第一晚的日子与话、今天那条小胜利；
 * 一次性提交的（关卡预告/战报/症状/出舱日/通行证/关口）清空重填；懒读的成就墙另一年不被覆盖。
 */
function refresh(data: CoupleQuestVO | null | undefined) {
  if (!data) return
  v.value = data

  if (data.myOvertime) {
    overtimeHour.value = String(data.myOvertime.untilHour)
    overtimeNote.value = data.myOvertime.note
  } else {
    overtimeHour.value = ''
    overtimeNote.value = ''
  }
  lampText.value = data.partnerOvertime && data.partnerOvertime.lampBy === auth.username ? data.partnerOvertime.lamp : ''
  nurseMessage.value = data.partnerNurse && data.partnerNurse.open ? data.partnerNurse.message : ''

  const names: Record<number, string> = {}
  const boxes: Record<number, string> = {}
  for (const m of data.moves) {
    names[m.slot] = m.name
    if (m.mine) boxes[m.slot] = String(m.boxes)
  }
  moveName.value = names
  moveBoxesInput.value = boxes

  nightDay.value = data.moveNight?.day ?? ''
  nightNote.value = data.moveNight && data.moveNight.mineTicked ? data.moveNight.note : ''
  if (myTodayWin.value) {
    winContent.value = myTodayWin.value.content
    winDay.value = ''
  } else {
    winContent.value = ''
  }

  prepDay.value = ''
  prepKind.value = ''
  prepName.value = ''
  prepFear.value = ''
  reportBattleId.value = ''
  reportResult.value = ''
  reportFeeling.value = ''
  symptom.value = ''
  podUntil.value = ''
  valleyUntil.value = ''
  nextDay.value = ''
  nextTitle.value = ''
}

// ========== F370 关卡预告 ==========
async function onPrep() {
  if (noData()) return
  const day = prepDay.value.trim()
  if (!day) {
    ElMessage.warning('先说哪一天要打这一关 ⚔️')
    return
  }
  if (!DAY_RE.test(day)) {
    ElMessage.warning('关卡日写成 yyyy-MM-dd ⚔️')
    return
  }
  if (day < (v.value?.day ?? '')) {
    // 与后端同一条规则，先给一句话，省一次注定 400 的提交
    ElMessage.warning('关卡日是过去的日子啦，要打就挑今天或以后 ⚔️')
    return
  }
  const kind = prepKind.value
  if (!kind) {
    ElMessage.warning('面试/汇报/答辩/谈判/体检/其它——先挑一个关卡类型 ⚔️')
    return
  }
  const name = prepName.value.trim()
  if (!name) {
    ElMessage.warning('关卡总得有个名字，比如「述职答辩」 ⚔️')
    return
  }
  if (name.length > PREP_NAME_MAX) {
    ElMessage.warning(`关卡名最多 ${PREP_NAME_MAX} 字 ⚔️`)
    return
  }
  const fear = prepFear.value.trim()
  if (fear.length > PREP_FEAR_MAX) {
    ElMessage.warning(`怯场话最多 ${PREP_FEAR_MAX} 字 ⚔️`)
    return
  }
  try {
    const data = await questApi.questBattle(day, kind, name, fear)
    refresh(data)
    ElMessage.success('这一关挂上了，TA 那边收到准备提醒 ⚔️')
  } catch (e) {
    onError(e, '挂关卡失败')
  }
}

async function onPrepRemove(id: string) {
  if (noData()) return
  const battle = v.value?.battles.find((b) => b.id === id)
  if (battle && !battle.mine) {
    ElMessage.warning('这场是 TA 的关卡，只有 TA 自己能撤 ⚔️')
    return
  }
  try {
    const data = await questApi.questBattleRemove(id)
    refresh(data)
    ElMessage.success('撤掉了，可能是改期了吧 🕊️')
  } catch (e) {
    onError(e, '撤关卡失败')
  }
}

// ========== F371 出关战报 ==========
function pickBattle(battle: CoupleQuestBattleVO) {
  reportBattleId.value = battle.id
  ElMessage.success(`定了「${battle.name}」，选战果就交 📣`)
}

async function onReport() {
  if (noData()) return
  const id = reportBattleId.value
  if (!id) {
    ElMessage.warning('先从上面挑一行——哪一关要交战报 📣')
    return
  }
  const battle = v.value?.battles.find((b) => b.id === id) ?? null
  if (battle && !battle.mine) {
    ElMessage.warning('这一关是 TA 打的，战报得 TA 来交 📣')
    return
  }
  const result = reportResult.value
  if (!result) {
    ElMessage.warning('战果只有三种：漂亮通关 / 没扛住 / 活着回来了 📣')
    return
  }
  const feeling = reportFeeling.value.trim()
  if (feeling.length > REPORT_FEELING_MAX) {
    ElMessage.warning(`一句感受最多 ${REPORT_FEELING_MAX} 字 📣`)
    return
  }
  try {
    const data = await questApi.questReport(id, result, feeling)
    refresh(data)
    ElMessage.success('战报交上去了，等 TA 盖个章 📣')
  } catch (e) {
    onError(e, '交战报失败')
  }
}

async function onSeal(id: string) {
  if (noData()) return
  const report = v.value?.reports.find((r) => r.id === id)
  if (report?.sealed) {
    ElMessage.warning('这份战报已经盖过章了，一关一枚 🎖️')
    return
  }
  if (report?.mine) {
    ElMessage.warning('战报是自己交的，章要 TA 来盖 🎖️')
    return
  }
  try {
    const data = await questApi.questReportSeal(id)
    refresh(data)
    ElMessage.success('章盖上了：这一关不是一个人打的 🎖️')
  } catch (e) {
    onError(e, '盖章失败')
  }
}

// ========== F372 加班预报与留灯 ==========
async function onOvertime() {
  if (noData()) return
  const raw = overtimeHour.value.trim()
  if (!raw) {
    // 后端 untilHour 传 null 会静默按 20 点记账：不猜，让 TA 自己说几点
    ElMessage.warning(`今晚忙到几点总得报个数（${OvertimeHourMin}-${OvertimeHourMax} 点）🌙`)
    return
  }
  const hour = Number(raw)
  if (!Number.isFinite(hour)) {
    ElMessage.warning('几点只写数字，别塞话进去 🌙')
    return
  }
  if (hour < OvertimeHourMin || hour > OvertimeHourMax) {
    // 后端是 13-23 静默钳制，前端宁可挡下来问一句，也不让 TA 以为记的是 2 点
    ElMessage.warning(`预报只有 ${OvertimeHourMin}-${OvertimeHourMax} 点，别填超了 🌙`)
    return
  }
  const note = overtimeNote.value.trim()
  if (note.length > OVERTIME_NOTE_MAX) {
    ElMessage.warning(`一句说明最多 ${OVERTIME_NOTE_MAX} 字 🌙`)
    return
  }
  try {
    const data = await questApi.questOvertime(Math.round(hour), note)
    refresh(data)
    ElMessage.success(`报好了：今晚大约 ${data?.myOvertime?.untilHour ?? Math.round(hour)} 点，别等饭 🌙`)
  } catch (e) {
    onError(e, '报加班失败')
  }
}

async function onLamp() {
  if (noData()) return
  const row = v.value?.partnerOvertime ?? null
  if (!row) {
    ElMessage.warning('TA 今晚没预报加班，没灯可留 💡')
    return
  }
  if (!v.value?.canLeaveLamp && !lampByMe.value) {
    ElMessage.warning('那盏灯已经有人留过了，今晚不重留 💡')
    return
  }
  const text = lampText.value.trim()
  if (!text) {
    ElMessage.warning('灯下想留的那句话写一句 💡')
    return
  }
  if (text.length > LAMP_MAX) {
    ElMessage.warning(`灯卡最多 ${LAMP_MAX} 字 💡`)
    return
  }
  try {
    const data = await questApi.questLamp(row.id, text)
    refresh(data)
    ElMessage.success('灯留着了：回来再晚，屋里是亮的 💡')
  } catch (e) {
    onError(e, '留灯失败')
  }
}

// ========== F373 生病陪护单 ==========
async function onNurse() {
  if (noData()) return
  const s = symptom.value.trim()
  if (s.length > NURSE_SYMPTOM_MAX) {
    ElMessage.warning(`症状一句话最多 ${NURSE_SYMPTOM_MAX} 字 🤒`)
    return
  }
  if (v.value?.partnerNurse) {
    // 与后端同一条规则（在途每人 ≤1），先挡下来给一句话
    ElMessage.warning('TA 的陪护单还在途，一张够了 🤒')
    return
  }
  try {
    const data = await questApi.questNurse(s)
    refresh(data)
    ElMessage.success('陪护单挂起来了：喝水吃药你代记 🤒')
  } catch (e) {
    onError(e, '开陪护单失败')
  }
}

async function onNurseMark(nurseId: string, kind: CoupleQuestCareKind) {
  if (noData()) return
  const nurse = v.value?.partnerNurse ?? null
  if (!nurse || nurse.id !== nurseId) {
    ElMessage.warning('这张单不在我的陪护列表里 🤒')
    return
  }
  if (!nurse.open) {
    ElMessage.warning('这张单已经关了，不用继续记了 🤒')
    return
  }
  if (!nurse.mineAsCarer) {
    ElMessage.warning(`陪护单是 ${nurse.carerUser} 在陪，代记轮不到别人 💧`)
    return
  }
  if (markedToday(kind)) {
    ElMessage.warning(`今天的${kind === 'WATER' ? '喝水' : '吃药'}已经记过啦 💧`)
    return
  }
  try {
    const data = await questApi.questNurseMark(nurseId, kind)
    refresh(data)
    ElMessage.success(kind === 'WATER' ? '喝水记上了一笔 💧' : '吃药记上了一笔 💊')
  } catch (e) {
    onError(e, '代记失败')
  }
}

async function onNurseMessage() {
  if (noData()) return
  const nurse = v.value?.partnerNurse ?? null
  if (!nurse) {
    ElMessage.warning('现在没有在途的陪护单可写留言 🤒')
    return
  }
  if (!nurse.open) {
    ElMessage.warning('单已经关了，留言就留在记录里吧 🤒')
    return
  }
  if (!nurse.mineAsCarer) {
    ElMessage.warning('病中留言是陪护人写的 ✍️')
    return
  }
  const text = nurseMessage.value.trim()
  if (!text) {
    ElMessage.warning('留言写一句再存 ✍️')
    return
  }
  if (text.length > NURSE_MESSAGE_MAX) {
    ElMessage.warning(`留言最多 ${NURSE_MESSAGE_MAX} 字 ✍️`)
    return
  }
  try {
    const data = await questApi.questNurseMessage(nurse.id, text)
    refresh(data)
    ElMessage.success('留言存好了，TA 能看到 💌')
  } catch (e) {
    onError(e, '写留言失败')
  }
}

async function onNurseClose(id: string) {
  if (noData()) return
  const nurse = v.value?.myNurse ?? null
  if (!nurse || nurse.id !== id) {
    ElMessage.warning('这张单不是你的——痊愈只能病人自己说 🎉')
    return
  }
  if (!nurse.open) {
    ElMessage.warning('这张单已经关过了，不用再点 🎉')
    return
  }
  try {
    const data = await questApi.questNurseClose(id)
    refresh(data)
    ElMessage.success('关单庆典：病是 TA 生的，账是两个人一起记的 🎉')
  } catch (e) {
    onError(e, '关单失败')
  }
}

// ========== F374 静音舱 ==========
async function onPod() {
  if (noData()) return
  const until = podUntil.value.trim()
  if (!until) {
    ElMessage.warning('出舱日填一下——说到哪天闭关 🔇')
    return
  }
  if (!DAY_RE.test(until)) {
    ElMessage.warning('出舱日写成 yyyy-MM-dd 🔇')
    return
  }
  if (until <= (v.value?.day ?? '')) {
    ElMessage.warning('出舱日要晚于今天，静音舱不能当天开了就关 🔇')
    return
  }
  if (v.value?.myPod?.in) {
    ElMessage.warning('你还在舱里，先出舱再进一次 🔇')
    return
  }
  try {
    const data = await questApi.questPod(until)
    refresh(data)
    ElMessage.success('进舱了：这段时间 TA 只给你递加油卡 🔇')
  } catch (e) {
    onError(e, '进舱失败')
  }
}

async function onPodCheer(id: string) {
  if (noData()) return
  const pod = v.value?.partnerPod ?? null
  if (!pod || pod.id !== id) {
    ElMessage.warning('TA 现在没有这一舱在途 🔇')
    return
  }
  if (!pod.in) {
    ElMessage.warning('TA 已经出舱了，加油卡改成长信吧 🔔')
    return
  }
  if (pod.mine) {
    ElMessage.warning('舱是 TA 进的，加油卡要从外面递进去 💪')
    return
  }
  if (pod.cheeredToday) {
    ElMessage.warning('今天这张加油卡已经递过了，一天一张 💪')
    return
  }
  try {
    const data = await questApi.questPodCheer(id)
    refresh(data)
    ElMessage.success('卡递进去了：你在里面拼命，我在外面撑场 💪')
  } catch (e) {
    onError(e, '递加油卡失败')
  }
}

async function onPodOut(id: string) {
  if (noData()) return
  const pod = v.value?.myPod ?? null
  if (!pod || pod.id !== id) {
    ElMessage.warning('这一舱不是你的——舱里的人才能自己出舱 🔔')
    return
  }
  if (!pod.in) {
    ElMessage.warning('你已经出舱了，不用再点一次 🔔')
    return
  }
  try {
    const data = await questApi.questPodOut(id)
    refresh(data)
    ElMessage.success('出舱了！那封长信在等人写 🔔')
  } catch (e) {
    onError(e, '出舱失败')
  }
}

async function onPodLetter(id: string) {
  if (noData()) return
  const pod = v.value?.partnerPod ?? null
  if (!pod || pod.id !== id) {
    ElMessage.warning('这一舱不是 TA 的 ✉️')
    return
  }
  if (pod.in) {
    ElMessage.warning('TA 还在舱里，长信等出舱再写 ✉️')
    return
  }
  if (pod.mine) {
    ElMessage.warning('长信是对面那个人写的，自己不能替 TA 打勾 ✉️')
    return
  }
  if (pod.letterDone) {
    ElMessage.warning('长信已经标过已补了，不用再点 ✉️')
    return
  }
  try {
    const data = await questApi.questPodLetter(id)
    refresh(data)
    ElMessage.success('长信已送达，这舱的债清了 ✉️')
  } catch (e) {
    onError(e, '标长信失败')
  }
}

// ========== F375 搬家区块 ==========
async function onMoveName(slot: number) {
  if (noData()) return
  const name = (moveName.value[slot] ?? '').trim()
  if (!name) {
    ElMessage.warning(`第 ${slot} 格要装什么，写个名字 🏷️`)
    return
  }
  if (name.length > MOVE_NAME_MAX) {
    ElMessage.warning(`区块名最多 ${MOVE_NAME_MAX} 字 🏷️`)
    return
  }
  if (slot < MOVE_SLOT_MIN || slot > MOVE_SLOT_MAX) {
    ElMessage.warning(`区块位只有 ${MOVE_SLOT_MIN}-${MOVE_SLOT_MAX} 格 📦`)
    return
  }
  try {
    const data = await questApi.questMoveName(slot, name)
    refresh(data)
    ElMessage.success(`第 ${slot} 格定名「${name}」🏷️`)
  } catch (e) {
    onError(e, '起名失败')
  }
}

async function onMoveClaim(slot: number) {
  if (noData()) return
  if (slot < MOVE_SLOT_MIN || slot > MOVE_SLOT_MAX) {
    ElMessage.warning(`区块位只有 ${MOVE_SLOT_MIN}-${MOVE_SLOT_MAX} 格 📦`)
    return
  }
  const row = moveOf(slot)
  if (row?.claimed && !row.mine) {
    ElMessage.warning(`这一格 ${row.owner} 已经认领了，换一格吧 📦`)
    return
  }
  try {
    const data = await questApi.questMoveClaim(slot)
    refresh(data)
    const nowMine = data?.moves.find((m) => m.slot === slot)?.mine ?? false
    ElMessage.success(nowMine ? `第 ${slot} 格归你了 📦` : `第 ${slot} 格松手了，谁来接？🕊️`)
  } catch (e) {
    onError(e, '认领失败')
  }
}

async function onMoveBoxes(slot: number) {
  if (noData()) return
  const row = moveOf(slot)
  if (!row || !row.claimed || !row.mine) {
    ElMessage.warning('这一格还没归你认领，数不了箱 📦')
    return
  }
  const raw = (moveBoxesInput.value[slot] ?? '').trim()
  if (!raw) {
    // 后端 boxes 传 null 静默按 0 记：不猜，先问一句
    ElMessage.warning(`第 ${slot} 格打包了几箱（0-${MOVE_BOX_MAX}）📦`)
    return
  }
  const boxes = Number(raw)
  if (!Number.isFinite(boxes)) {
    ElMessage.warning('箱数只写数字，别塞话进去 📦')
    return
  }
  if (boxes < 0 || boxes > MOVE_BOX_MAX) {
    // 后端 0-99 静默钳制，前端宁可挡下来，也不让 TA 以为记了 999 箱
    ElMessage.warning(`一格的箱数记到 ${MOVE_BOX_MAX} 封顶，别填超了 📦`)
    return
  }
  try {
    const data = await questApi.questMoveBoxes(slot, Math.round(boxes))
    refresh(data)
    ElMessage.success(`第 ${slot} 格记了 ${Math.round(boxes)} 箱，合计 ${data?.moveBoxes ?? 0} 箱 📦`)
  } catch (e) {
    onError(e, '记箱数失败')
  }
}

async function onMoveDone(slot: number) {
  if (noData()) return
  const row = moveOf(slot)
  if (!row || !row.claimed || !row.mine) {
    ElMessage.warning('谁认领的谁来勾完成 📦')
    return
  }
  if (row.finished) {
    ElMessage.warning(`第 ${slot} 格已经打包完了，不用再点 ✅`)
    return
  }
  try {
    const data = await questApi.questMoveDone(slot)
    refresh(data)
    ElMessage.success(`第 ${slot} 格打包完了：搬家这件事又少怕了一点 ✅`)
  } catch (e) {
    onError(e, '勾完成失败')
  }
}

// ========== 新家第一晚（双拍：归因一律吃服务端 mineTicked/partnerTicked） ==========
async function onNight() {
  if (noData()) return
  const day = nightDay.value.trim()
  if (!day) {
    ElMessage.warning('新家第一晚是哪天，先填日子 🏠')
    return
  }
  if (!DAY_RE.test(day)) {
    ElMessage.warning('第一晚写成 yyyy-MM-dd 🏠')
    return
  }
  const note = nightNote.value.trim()
  if (note.length > NIGHT_NOTE_MAX) {
    ElMessage.warning(`那一晚的一句话最多 ${NIGHT_NOTE_MAX} 字 🏠`)
    return
  }
  if (nightAlreadyMine.value) {
    // 后端只在 0→1 真翻转时写库：重复点既不改 note 也不重推，前端不发这次注定没用的提交
    ElMessage.warning('那一晚你已经打过卡了，差的是 TA 那一格 🏠')
    return
  }
  try {
    const data = await questApi.questMoveNight(day, note)
    refresh(data)
    if (data?.moveNight?.bothTicked) ElMessage.success('那一晚两个人都在：房子从这晚开始是家的 🏠✨')
    else ElMessage.success('你这一格点上了，还差 TA 那一格 🏠')
  } catch (e) {
    onError(e, '第一晚打卡失败')
  }
}

// ========== F376 低谷通行证 ==========
async function onValley() {
  if (noData()) return
  const until = valleyUntil.value.trim()
  if (!until) {
    ElMessage.warning('回升日填一下——通行证挂到哪天 🌧️')
    return
  }
  if (!DAY_RE.test(until)) {
    ElMessage.warning('回升日写成 yyyy-MM-dd 🌧️')
    return
  }
  const span = diffDays(v.value?.day ?? '', until)
  if (span === null) {
    ElMessage.warning('回升日写成 yyyy-MM-dd 🌧️')
    return
  }
  if (span < VALLEY_SPAN_MIN || span > VALLEY_SPAN_MAX) {
    ElMessage.warning(`通行证要挂 ${VALLEY_SPAN_MIN}-${VALLEY_SPAN_MAX} 天，太短像赌气，太长像放弃 🌧️`)
    return
  }
  if (v.value?.myValley?.low) {
    ElMessage.warning('你的通行证还在有效期内，不用重复开 🌧️')
    return
  }
  try {
    const data = await questApi.questValley(until)
    refresh(data)
    ElMessage.success('通行证挂上了：不用讲道理，一天递一张「不说话也行」就好 🌧️')
  } catch (e) {
    onError(e, '挂通行证失败')
  }
}

async function onValleyCare(id: string) {
  if (noData()) return
  const valley = v.value?.partnerValley ?? null
  if (!valley || valley.id !== id) {
    ElMessage.warning('TA 现在没有在途的通行证 🌧️')
    return
  }
  if (!valley.low) {
    ElMessage.warning('TA 已经回升了，卡改天再递 🌤️')
    return
  }
  if (valley.mine) {
    ElMessage.warning('通行证是 TA 开的，卡要从外面递进来 🧻')
    return
  }
  if (valley.caredToday) {
    ElMessage.warning('今天的卡已经递过了，一天一张 🧻')
    return
  }
  try {
    const data = await questApi.questValleyCare(id)
    refresh(data)
    ElMessage.success('卡递进去了：不用解释为什么不开心 🧻')
  } catch (e) {
    onError(e, '递卡失败')
  }
}

async function onValleyRise(id: string) {
  if (noData()) return
  const valley = v.value?.myValley ?? null
  if (!valley || valley.id !== id) {
    ElMessage.warning('缓没缓过来只有 TA 自己说了算，别人不能替 TA 宣布 🌤️')
    return
  }
  if (!valley.low) {
    ElMessage.warning('这张通行证已经收尾了，不用再点 🌤️')
    return
  }
  try {
    const data = await questApi.questValleyRise(id)
    refresh(data)
    ElMessage.success('回升了：这天的卡一张都没讲道理，但都在 🌤️')
  } catch (e) {
    onError(e, '宣布回升失败')
  }
}

// ========== F377 小胜利账本 ==========
async function onWin() {
  if (noData()) return
  const content = winContent.value.trim()
  if (!content) {
    ElMessage.warning('做成的一件小事写一句，比如「把简历改了」 🏅')
    return
  }
  if (content.length > WIN_CONTENT_MAX) {
    ElMessage.warning(`一条小事最多 ${WIN_CONTENT_MAX} 字 🏅`)
    return
  }
  const day = winDay.value.trim()
  if (day && !DAY_RE.test(day)) {
    ElMessage.warning('日子写成 yyyy-MM-dd 🏅')
    return
  }
  if (day && day > (v.value?.day ?? '')) {
    ElMessage.warning('小事要今天或以前做成了才算，先别预支 🏅')
    return
  }
  try {
    const data = await questApi.questWin(content, day)
    refresh(data)
    ElMessage.success('记下了：周日记得给 TA 颁小赢奖 🏅')
  } catch (e) {
    onError(e, '记小胜利失败')
  }
}

async function onWinAward(id: string) {
  if (noData()) return
  const win = v.value?.wins.find((w) => w.id === id)
  if (win && !win.canAward) {
    ElMessage.warning('小赢奖是颁给 TA 的，不能自颁 🏆')
    return
  }
  if (awardedThisWeek.value) {
    ElMessage.warning('这周你已经颁过一次小赢奖了，下周再来 🏆')
    return
  }
  try {
    const data = await questApi.questWinAward(id)
    refresh(data)
    ElMessage.success('奖颁出去了：这件事我看见了 🏆')
  } catch (e) {
    onError(e, '颁奖失败')
  }
}

// ========== F378 关卡成就墙（懒读另一年，首屏不自动拉） ==========
async function onWall() {
  const year = wallYear.value.trim()
  if (year && !YEAR_RE.test(year)) {
    ElMessage.warning('年份写成 yyyy 🧗')
    return
  }
  try {
    const data = await questApi.questWall(year)
    if (data) {
      wallView.value = data
      ElMessage.success(`这一年砌好了：${data.title} 🧗`)
    } else ElMessage.warning('这一年还没有墙可砌 🧗')
  } catch (e) {
    onError(e, '读成就墙失败')
  }
}

function onWallBack() {
  wallView.value = null
  wallYear.value = ''
  ElMessage.success('回到今年这面墙 ↩️')
}

// ========== F379 下次关卡预约 ==========
async function onUpcoming() {
  if (noData()) return
  const day = nextDay.value.trim()
  if (!day) {
    ElMessage.warning('先说关口是哪一天 🙋')
    return
  }
  if (!DAY_RE.test(day)) {
    ElMessage.warning('关口日子写成 yyyy-MM-dd 🙋')
    return
  }
  const today = v.value?.day ?? ''
  const left = diffDays(today, day)
  if (left !== null && (left < 0 || left > UPCOMING_WINDOW_DAYS)) {
    ElMessage.warning(`关口只挂今天起 ${UPCOMING_WINDOW_DAYS} 天之内的 🙋`)
    return
  }
  const title = nextTitle.value.trim()
  if (!title) {
    ElMessage.warning('关口叫什么，写一句 🙋')
    return
  }
  if (title.length > UPCOMING_TITLE_MAX) {
    ElMessage.warning(`关口名最多 ${UPCOMING_TITLE_MAX} 字 🙋`)
    return
  }
  try {
    const data = await questApi.questUpcoming(day, title)
    refresh(data)
    ElMessage.success('挂上双人时间轴了，等 TA 说「我会到场」🙋')
  } catch (e) {
    onError(e, '挂关口失败')
  }
}

async function onUpcomingAttend(id: string) {
  if (noData()) return
  const row = v.value?.upcoming.find((u) => u.id === id)
  if (row?.mine) {
    ElMessage.warning('到场要对方来说，自己给自己应援不算 🙋')
    return
  }
  if (row?.attended) {
    ElMessage.warning('这个关口已经有人应过援了，不用再点 🙋')
    return
  }
  try {
    const data = await questApi.questUpcomingAttend(id)
    refresh(data)
    ElMessage.success('应援到位：这一天我会到场 🙋')
  } catch (e) {
    onError(e, '到场应援失败')
  }
}

async function onUpcomingRemove(id: string) {
  if (noData()) return
  const row = v.value?.upcoming.find((u) => u.id === id)
  if (row && !row.mine) {
    ElMessage.warning('这个关口是 TA 挂的，只有 TA 能撤 🗑️')
    return
  }
  try {
    const data = await questApi.questUpcomingRemove(id)
    refresh(data)
    ElMessage.success('撤掉了这个关口预约 🗑️')
  } catch (e) {
    onError(e, '撤关口失败')
  }
}

/** 首次加载静默降级：未建空间 404 不弹错误条，十卡一律留空态收起；成就墙的懒读接口按按钮才拉 */
async function safeLoad<T>(loader: () => Promise<T>, fallback: T): Promise<T> {
  try {
    const data = await loader()
    return (data ?? fallback) as T
  } catch {
    return fallback
  }
}

onMounted(async () => {
  const board = await safeLoad(() => questApi.questBoard(), null as CoupleQuestVO | null)
  if (board) refresh(board)
})
</script>

<style scoped>
/* 主色岩壁青灰 #334155（这批讲的是「人生那道要爬的岩壁」：灰底上钉着的每一个关卡点，
   压得住、不甜、也不像报表那种蓝；批次三十三开工前 grep 全仓 src/ 的 --collapse-title-color 与十六进制色：
   既有卡标题主色已用掉 #0284c7 修复天蓝 / #065f46 墨玉绿 / #0d9488 剧幕青绿 / #16a34a 身体监护绿 /
   #2c7a7b 考据墨青 / #3f51b5 靛蓝 / #409eff 公司蓝 / #4c1d95 静夜深紫 / #9254de 倾听紫 / #a0522d 人情茶褐 /
   #be185d 回音壁深玫瑰 / #c0392b 庆典朱红 / #d2691e 工坊橙棕 / #d93a3a 中国红（cozy 走 var(--im-text)），
   全局六套皮肤强调色与气泡渐变端点（#ec5f92/#3370ff/#8b5cf6/#10b981/#f97316/#06b6d4/#7c3aed）一律不挪作分区主色，
   同族的 #1e40af/#1e3a8a（太靠 #3f51b5）与 #0f766e（太靠 #0d9488/#065f46）也落选；
   #334155 在 src/ 全仓（含 style.css 与 utils/settings.ts）grep 零命中。
   本组件不写 .title 规则，折叠卡标题色一律经 --collapse-title-color 级联给 CoupleCollapsible */
.couple-quest { display: flex; flex-direction: column; gap: 14px; --collapse-title-color: #334155; }
.sub { font-size: 12px; color: var(--im-muted, #909399); font-weight: normal; margin-left: 6px; }
.section-head { margin: 10px 0 4px; font-size: 13px; font-weight: bold; color: #334155; }
.inline-form { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 8px; }
.inline-form .el-input { flex: 1; min-width: 150px; }
.row-head { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; margin: 0; }
.row-card { margin: 7px 0; padding: 8px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid var(--im-border, #ebeef5); font-size: 13px; }
.row-card.is-partner { border-left-color: rgba(51, 65, 85, 0.35); }
.row-card.is-sealed, .row-card.is-lit, .row-card.is-awarded, .row-card.is-attended, .row-card.is-in, .row-card.is-caring { border-left-color: #334155; }
.row-card.is-low { border-left-color: #334155; }
.row-card.is-closed { opacity: 0.8; }
.row-main { margin: 4px 0 0; color: var(--im-text, #303133); }
.row-quote { margin: 3px 0 0; color: var(--im-text, #303133); }
.empty-line { margin: 8px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.hint-line { margin: 6px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.wait-line { margin: 6px 0 0; font-size: 12px; color: #334155; }
.lit-line { margin: 8px 0 0; padding: 8px 10px; border-radius: 8px; font-size: 13px; color: #334155; background: rgba(51, 65, 85, 0.08); }
.summary-line { margin: 8px 0 0; padding: 8px 10px; border-radius: 8px; font-size: 13px; color: var(--im-text, #303133); background: var(--im-bg, #fafafa); }
.range-line { margin: 6px 0 0; font-size: 12px; color: #334155; }
.mark-line { margin: 6px 0 0; font-size: 11px; color: var(--im-muted, #909399); display: flex; gap: 8px; flex-wrap: wrap; }
.who-chip, .status-chip { font-size: 11px; color: var(--im-muted, #909399); }
.day-chip, .kind-chip, .status-chip, .count-chip, .hour-chip, .left-chip, .result-chip, .lit-chip { font-size: 11px; color: #334155; background: rgba(51, 65, 85, 0.1); padding: 1px 8px; border-radius: 10px; }
.lit-chip { background: rgba(51, 65, 85, 0.18); }
.chip-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.day-pick { font-size: 12px; color: #334155; background: rgba(51, 65, 85, 0.08); border: 1px solid rgba(51, 65, 85, 0.2); border-radius: 12px; padding: 2px 10px; cursor: pointer; }
.day-pick.is-picked { background: #334155; color: #fff; border-color: #334155; }
.wall-card { margin: 8px 0 0; padding: 8px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); }
.stat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 6px; margin-top: 8px; }
.stat { margin: 0; padding: 7px 10px; border-radius: 8px; font-size: 13px; color: #334155; background: rgba(51, 65, 85, 0.08); }
</style>

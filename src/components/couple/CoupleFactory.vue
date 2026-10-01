<template>
  <div class="couple-factory" data-testid="couple-factory">
    <!-- F270 家务轮盘：一转定分工，认账双签才算数 -->
    <CoupleCollapsible testid="couple-fy-spin" :empty="!hasSpin">
      <template #title>🎡 家务轮盘 <span class="sub">谁干活不听嗓门大的，听转盘的——一转定分工，认账才算数</span></template>
      <template v-if="b">
        <p class="day-chip" data-testid="couple-fy-spin-day">车间工作日 {{ b.day }} · 本周期从 {{ b.week }} 起</p>
        <p class="open-line" data-testid="couple-fy-spin-line">{{ b.spinLine }}</p>

        <!-- 一转表单：一周一转（转过后端 400），所以只在还没有任务时给表单 -->
        <div v-if="!b.spins.length" class="inline-form">
          <el-input
            v-model="spinItems"
            maxlength="360"
            placeholder="这周的家务，逗号分隔（2-8 件，比如「倒垃圾，拖地，洗碗」）"
            data-testid="couple-fy-spin-items"
          />
          <el-button size="small" type="primary" data-testid="couple-fy-spin-submit" @click="onSpin">
            一转定分工 🎡
          </el-button>
        </div>
        <p v-else class="hint-line" data-testid="couple-fy-spin-closed">本周的盘已经转完了，不服下周再来一赌 🎡</p>

        <p v-if="!b.spins.length" class="empty-line">转盘还空着，先把这周的活儿报上来 🎡</p>
        <div
          v-for="s in b.spins"
          :key="s.id"
          class="spin-row"
          :class="{ 'is-done': s.done }"
          :data-testid="`couple-fy-spin-${s.id}`"
        >
          <span class="spin-item" :data-testid="`couple-fy-spin-item-${s.id}`">{{ s.item }}</span>
          <span class="who-chip" :data-testid="`couple-fy-spin-who-${s.id}`">
            {{ s.mine ? '天选打工人是我 🙋' : `派给 ${s.assignedUser} 💕` }}
          </span>
          <span class="status-chip" :data-testid="`couple-fy-spin-status-${s.id}`">{{ spinStatusText(s) }}</span>
          <!-- 认账按钮只在对方那格出现：自己的活自己认，TA 的活等 TA 认 -->
          <el-button
            v-if="!s.mine && !s.confirmed"
            size="small"
            type="primary"
            plain
            :data-testid="`couple-fy-spin-confirm-${s.id}`"
            @click="onSpinConfirm(s)"
          >我替 TA 认账 ✍️</el-button>
          <!-- 干完按钮只在自己那格且对方已认账时出现 -->
          <el-button
            v-if="s.mine && s.confirmed && !s.done"
            size="small"
            type="success"
            plain
            :data-testid="`couple-fy-spin-done-${s.id}`"
            @click="onSpinDone(s)"
          >这活我干完了 ✅</el-button>
        </div>

        <div class="block">
          <p class="section-head">📌 欠账栏（近三周没干完的，赖不掉）</p>
          <p v-if="!b.owed.length" class="empty-line" data-testid="couple-fy-spin-owed">账上干净，本周的活本周毕 🧹</p>
          <ul v-else class="miss-list" data-testid="couple-fy-spin-owed">
            <li v-for="(o, i) in b.owed" :key="o" class="owed-line" :data-testid="`couple-fy-spin-owed-${i}`">{{ o }}</li>
          </ul>
        </div>
      </template>
      <p v-else class="empty-line">车间还在开门禁…</p>
    </CoupleCollapsible>

    <!-- F271 采买清单 + F272 冰箱库存 -->
    <CoupleCollapsible testid="couple-fy-shop" :empty="!hasShop">
      <template #title>🧺 采买与冰箱 <span class="sub">谁买米谁心里有数：清单挂墙上，冰箱贴便利贴</span></template>
      <template v-if="b">
        <p v-if="b.shopChampion" class="champion" data-testid="couple-fy-shop-champion">🏆 本月榜一：{{ b.shopChampion }}</p>
        <p v-else class="hint-line" data-testid="couple-fy-shop-champion">本月还没有生活委员，买回最多的那位上位 🧺</p>

        <p class="section-head">🛒 超市清单（谁点的谁划，谁顺手谁买回）</p>
        <div class="inline-form">
          <el-input v-model="shopName" maxlength="60" placeholder="要买啥（≤60 字，如「无糖酸奶」）" data-testid="couple-fy-shop-name" />
          <el-input v-model="shopQty" maxlength="30" placeholder="数量（可不写，如「两板」）" style="max-width: 150px" data-testid="couple-fy-shop-qty" />
          <el-button size="small" type="primary" data-testid="couple-fy-shop-submit" @click="onShopAdd">记上 🧾</el-button>
        </div>
        <p v-if="!b.shop.length" class="empty-line">清单空着，说明家里什么都不缺（不太可能）🧺</p>
        <div v-for="x in b.shop" :key="x.id" class="shop-row" :data-testid="`couple-fy-shop-${x.id}`">
          <b class="shop-title" :data-testid="`couple-fy-shop-title-${x.id}`">{{ x.name }}</b>
          <span v-if="x.qty" class="qty-chip" :data-testid="`couple-fy-shop-qty-${x.id}`">{{ x.qty }}</span>
          <span class="who-chip">{{ x.mine ? '我点的 🙋' : `💕 ${x.fromUser} 点的` }}</span>
          <el-button
            size="small"
            type="success"
            plain
            :data-testid="`couple-fy-shop-bought-${x.id}`"
            @click="onShopDone(x)"
          >我买了 🧴</el-button>
          <el-button
            v-if="x.mine"
            size="small"
            link
            type="danger"
            :data-testid="`couple-fy-shop-del-${x.id}`"
            @click="onShopRemove(x)"
          >不买了 🗑️</el-button>
        </div>

        <div class="block">
          <p class="section-head">🧊 冰箱库存（赏味期三天内亮黄灯）</p>
          <div v-if="b.expiring.length" class="warn-bar" data-testid="couple-fy-expiring">
            <p v-for="(line, i) in b.expiring" :key="line" class="warn-line" :data-testid="`couple-fy-expiring-${i}`">⚠️ {{ line }}</p>
          </div>
          <div class="inline-form">
            <el-input v-model="stockItem" maxlength="60" placeholder="食材名（≤60 字，同名即补货）" data-testid="couple-fy-stock-name" />
            <el-input v-model="stockQty" maxlength="30" placeholder="数量（如「一盒」）" style="max-width: 130px" data-testid="couple-fy-stock-qty" />
            <el-date-picker
              v-model="stockExpire"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="赏味期（可空）"
              style="width: 155px"
              data-testid="couple-fy-stock-expire"
            />
            <el-button size="small" type="primary" data-testid="couple-fy-stock-submit" @click="onStockAdd">塞进冰箱 🧊</el-button>
          </div>
          <p v-if="!b.stock.length" class="empty-line">冰箱比脸还干净，去补点货吧 🧊</p>
          <div
            v-for="s in b.stock"
            :key="s.id"
            class="stock-row"
            :class="{ 'is-expiring': s.expiring }"
            :data-testid="`couple-fy-stock-${s.id}`"
          >
            <span class="stock-item" :data-testid="`couple-fy-stock-item-${s.id}`">{{ s.item }}</span>
            <span v-if="s.qty" class="qty-chip">{{ s.qty }}</span>
            <span class="day-chip" :data-testid="`couple-fy-stock-expire-${s.id}`">{{ s.expireDay ? `赏味至 ${s.expireDay}` : '没写赏味期' }}</span>
            <span v-if="s.expiring" class="warn-chip" :data-testid="`couple-fy-stock-warn-${s.id}`">快到期 🕐</span>
            <el-button size="small" plain :data-testid="`couple-fy-stock-out-${s.id}`" @click="onStockOut(s)">用完啦 🍽️</el-button>
          </div>
        </div>
      </template>
      <p v-else class="empty-line">采购员还没上班…</p>
    </CoupleCollapsible>

    <!-- F273 代拿快递 + F274 叫醒服务 -->
    <CoupleCollapsible testid="couple-fy-errand" :empty="!hasErrand">
      <template #title>📦 跑腿与叫醒 <span class="sub">件在驿站排队，人在被窝挣扎——接单侠和叫醒卡都只有一位</span></template>
      <template v-if="b">
        <p class="section-head">🏃 快递流（下单 → 接单 → 送达，接单侠喜提 2 积分感谢章）</p>
        <div class="inline-form">
          <el-input v-model="parcelNote" maxlength="60" placeholder="什么件、几号柜（≤60 字，可不写）" data-testid="couple-fy-parcel-note" />
          <el-button size="small" type="primary" data-testid="couple-fy-parcel-submit" @click="onParcelNew">求代拿 📦</el-button>
        </div>
        <p v-if="!b.parcels.length" class="empty-line">驿站没有等领养的件，今天是个闲人 📦</p>
        <div
          v-for="p in b.parcels"
          :key="p.id"
          class="parcel-row"
          :class="`is-${p.status.toLowerCase()}`"
          :data-testid="`couple-fy-parcel-${p.id}`"
        >
          <b class="parcel-note" :data-testid="`couple-fy-parcel-note-${p.id}`">{{ p.note || `${p.id.slice(0, 6)}号件` }}</b>
          <span class="who-chip">{{ p.mine ? '我下的单 🙋' : `💕 ${p.fromUser} 下的单` }}</span>
          <span class="status-chip" :data-testid="`couple-fy-parcel-status-${p.id}`">{{ parcelStatusText(p) }}</span>
          <el-button
            v-if="p.status === 'SENT' && !p.mine"
            size="small"
            type="primary"
            :data-testid="`couple-fy-parcel-grab-${p.id}`"
            @click="onParcelGrab(p)"
          >顺手接单 🏃</el-button>
          <el-button
            v-if="p.status === 'GRABBED' && !p.mine"
            size="small"
            type="success"
            :data-testid="`couple-fy-parcel-done-${p.id}`"
            @click="onParcelDone(p)"
          >送到啦，销单 🏅</el-button>
        </div>

        <div class="block">
          <p class="section-head">⏰ 叫醒服务（本周各定一句词，明早由对方递卡）</p>
          <div class="wake-row">
            <span class="wake-label">🙋 我定的：</span>
            <b class="wake-text" data-testid="couple-fy-wake-mine">{{ myWake ? myWake.content : '还没定，写一句给 TA 用 ⏰' }}</b>
          </div>
          <div class="wake-row is-partner">
            <span class="wake-label">💕 TA 定的：</span>
            <b class="wake-text" data-testid="couple-fy-wake-partner">{{ partnerWake ? partnerWake.content : 'TA 这周还没给词，等等或催一句 ⏰' }}</b>
            <span v-if="partnerWake && partnerWake.givenToday" class="lit-chip" data-testid="couple-fy-wake-given">今天这张已经递过了 ☀️</span>
          </div>
          <div class="inline-form">
            <el-input v-model="wakeText" maxlength="60" placeholder="本周叫醒词（≤60 字，如「再睡五分钟就亲你」）" data-testid="couple-fy-wake-input" />
            <el-button size="small" type="primary" data-testid="couple-fy-wake-submit" @click="onWakeSet">
              {{ myWake ? '改我这周的词 🔁' : '定我这周的词 ⏰' }}
            </el-button>
            <el-button
              size="small"
              type="warning"
              plain
              data-testid="couple-fy-wake-give"
              :disabled="!partnerWake || partnerWake.givenToday"
              @click="onWakeGive"
            >递叫醒卡 ☀️</el-button>
          </div>
          <p v-if="!partnerWake" class="hint-line">递卡只能递 TA 定的词——TA 没定就先别叫醒人家 🛌</p>
        </div>
      </template>
      <p v-else class="empty-line">跑腿和闹钟都在待命…</p>
    </CoupleCollapsible>

    <!-- F275 服药提醒链 + F276 久坐互拍 -->
    <CoupleCollapsible testid="couple-fy-care">
      <template #title>💊 服药与久坐 <span class="sub">你吃药我记账，你久坐我拍你一下——链条别断在我手里</span></template>
      <template v-if="b">
        <p class="section-head">🔗 服药链（TA 点「提醒了」，本人点「吃了」，连着天数涨链）</p>
        <div class="inline-form">
          <el-input v-model="medName" maxlength="40" placeholder="药名（≤40 字）" data-testid="couple-fy-med-name" />
          <el-input v-model="medTimes" maxlength="60" placeholder="每日时段（如「早饭后」，≤60 字）" data-testid="couple-fy-med-times" />
          <el-button size="small" type="primary" data-testid="couple-fy-med-submit" @click="onMedAdd">登记在服 💊</el-button>
        </div>
        <p v-if="!b.meds.length" class="empty-line">没有在服的药物，这是好消息 🔒</p>
        <div v-for="m in b.meds" :key="m.id" class="med-row" :data-testid="`couple-fy-med-${m.id}`">
          <b class="med-name" :data-testid="`couple-fy-med-title-${m.id}`">{{ m.name }}</b>
          <span class="qty-chip">{{ m.times }}</span>
          <span class="who-chip">{{ m.mine ? '我的药 🙋' : `💕 ${m.fromUser} 的药` }}</span>
          <span class="streak-chip" :data-testid="`couple-fy-med-streak-${m.id}`">🔗 连着 {{ m.streak }} 天</span>
          <span class="flag-chip" :class="{ 'is-on': m.remindedToday }" :data-testid="`couple-fy-med-remind-flag-${m.id}`">
            提醒 {{ m.remindedToday ? '✅' : '⏳' }}
          </span>
          <span class="flag-chip" :class="{ 'is-on': m.takenToday }" :data-testid="`couple-fy-med-take-flag-${m.id}`">
            吃了 {{ m.takenToday ? '✅' : '⏳' }}
          </span>
          <el-button
            v-if="!m.mine"
            size="small"
            type="primary"
            plain
            :data-testid="`couple-fy-med-remind-${m.id}`"
            @click="onMedRemind(m)"
          >我今天提醒了 🔔</el-button>
          <el-button
            v-if="m.mine"
            size="small"
            type="success"
            plain
            :data-testid="`couple-fy-med-take-${m.id}`"
            @click="onMedTaken(m)"
          >我吃过了 💧</el-button>
          <el-button
            v-if="m.mine"
            size="small"
            link
            type="danger"
            :data-testid="`couple-fy-med-stop-${m.id}`"
            @click="onMedStop(m)"
          >疗程结束，停药 🎉</el-button>
        </div>

        <div class="block">
          <p class="section-head">🧍 久坐互拍（一小时内双双站起才算同起，别让椅子记住你们）</p>
          <button
            type="button"
            class="stand-btn"
            :class="{ 'is-lit': b.stand.mineToday }"
            :disabled="b.stand.mineToday"
            data-testid="couple-fy-stand-btn"
            @click="onStandup"
          >
            {{ b.stand.mineToday ? '今天已经拍过啦 🧍' : '站起来，拍一下 🧍' }}
          </button>
          <p class="stand-status">
            <span class="flag-chip" :class="{ 'is-on': b.stand.mineToday }" data-testid="couple-fy-stand-mine">我 {{ b.stand.mineToday ? '✅' : '⏳' }}</span>
            <span class="flag-chip" :class="{ 'is-on': b.stand.partnerToday }" data-testid="couple-fy-stand-partner">TA {{ b.stand.partnerToday ? '✅' : '⏳' }}</span>
            <span class="lit-chip" data-testid="couple-fy-stand-paired">
              {{ b.stand.pairedToday ? '今日同起达成 ☑' : '还没凑成一对同起，喊 TA 跟拍 🧍' }}
            </span>
            <span class="streak-chip" data-testid="couple-fy-stand-week">本周同起 {{ b.stand.weekPairedDays }} 天 🔗</span>
          </p>
        </div>
      </template>
      <p v-else class="empty-line">药盒和拍肩服务待命中…</p>
    </CoupleCollapsible>

    <!-- F277 垫付本 + F278 战利品互猜 + F279 家安月检 -->
    <CoupleCollapsible testid="couple-fy-books" :empty="!hasBooks">
      <template #title>🧾 账本与月检 <span class="sub">垫付不伤感情，靠的是白纸黑字；购物车猜心，靠的是默契</span></template>
      <template v-if="b">
        <p class="section-head">📒 垫付本（谁垫的谁记账，还钱的一方按确认键）</p>
        <div class="inline-form">
          <el-input v-model="advItem" maxlength="60" placeholder="名目（≤60 字，如「打车接你」）" data-testid="couple-fy-adv-item" />
          <el-input v-model="advYuan" maxlength="12" placeholder="金额（元）" style="max-width: 120px" data-testid="couple-fy-adv-yuan" />
          <el-input v-model="advNote" maxlength="140" placeholder="备注（可不写，≤140 字）" data-testid="couple-fy-adv-note" />
          <el-button size="small" type="primary" data-testid="couple-fy-adv-submit" @click="onAdvanceAdd">记一笔 📒</el-button>
        </div>
        <p v-if="!b.advances.length" class="empty-line" data-testid="couple-fy-adv-total">账上无欠款，无债一身轻 🧾</p>
        <p v-else class="total-line">
          未清合计 <b data-testid="couple-fy-adv-total">{{ centsToYuan(b.openTotalCents) }} 元</b> · 挂账 {{ b.advances.length }} 笔 🧾
        </p>
        <div v-for="a in b.advances" :key="a.id" class="adv-row" :data-testid="`couple-fy-adv-${a.id}`">
          <b class="adv-item">{{ a.item }}</b>
          <span class="amount-chip" :data-testid="`couple-fy-adv-amount-${a.id}`">{{ centsToYuan(a.amountCents) }} 元</span>
          <span class="who-chip" :data-testid="`couple-fy-adv-who-${a.id}`">{{ a.mine ? '我垫的，TA 还欠着 🙋' : `💕 ${a.payerUser} 垫的，我欠着` }}</span>
          <span v-if="a.note" class="adv-note" :data-testid="`couple-fy-adv-note-${a.id}`">{{ a.note }}</span>
          <span class="day-chip" :data-testid="`couple-fy-adv-days-${a.id}`">挂了 {{ a.daysOpen }} 天</span>
          <el-button
            v-if="!a.mine"
            size="small"
            type="success"
            :data-testid="`couple-fy-adv-settle-${a.id}`"
            @click="onAdvanceSettle(a)"
          >我还清了，清账 ✅</el-button>
          <span v-else class="wait-chip" :data-testid="`couple-fy-adv-wait-${a.id}`">等 TA 按确认键 ⏳</span>
        </div>

        <div class="block">
          <p class="section-head">🛒 本周战利品互猜（各上一单，TA 猜动机，买家打分 0-5）</p>
          <div class="inline-form">
            <el-input
              v-model="groceryItems"
              type="textarea"
              :rows="2"
              maxlength="300"
              show-word-limit
              placeholder="这周扫回来的战利品（≤300 字，如「草莓、蜡烛、TA 爱吃的布丁」）"
              data-testid="couple-fy-grocery-input"
            />
            <el-button size="small" type="primary" data-testid="couple-fy-grocery-submit" @click="onGrocery">
              {{ myGrocery ? '改我这周的单 🔁' : '上报本周战利品 🛒' }}
            </el-button>
          </div>
          <p v-if="!b.groceries.length" class="empty-line">本周还没人扫货，购物车静悄悄 🛒</p>
          <div
            v-for="g in b.groceries"
            :key="g.id"
            class="grocery-row"
            :data-testid="g.mine ? `couple-fy-grocery-mine-${g.id}` : `couple-fy-grocery-partner-${g.id}`"
          >
            <p class="grocery-head">
              <span class="who-chip">{{ g.mine ? '我扫的货 🙋' : `💕 ${g.fromUser} 扫的货` }}</span>
              <b class="grocery-items">{{ g.items }}</b>
              <span v-if="g.score !== null" class="score-badge" :data-testid="`couple-fy-grocery-score-${g.id}`">默契 {{ g.score }}/5 💞</span>
            </p>
            <p v-if="g.guessBy" class="guess-line" :data-testid="`couple-fy-grocery-guessed-${g.id}`">动机答卷（{{ g.guessBy }}）：{{ g.guess }}</p>
            <div v-if="!g.mine && !g.guessBy" class="inline-form">
              <el-input v-model="groceryGuesses[g.id]" maxlength="300" placeholder="猜猜 TA 为什么买这个（一次机会，落子无悔）" :data-testid="`couple-fy-grocery-guess-${g.id}`" />
              <el-button size="small" type="primary" :data-testid="`couple-fy-grocery-guess-btn-${g.id}`" @click="onGroceryGuess(g)">我猜 🎯</el-button>
            </div>
            <div v-if="g.mine && g.guessBy && g.score === null" class="score-row">
              <span class="score-label">给 TA 的猜测打个默契分：</span>
              <button
                v-for="n in 6"
                :key="n"
                type="button"
                class="score-btn"
                :data-testid="`couple-fy-grocery-rate-${g.id}-${n - 1}`"
                @click="onGroceryRate(g, n - 1)"
              >{{ n - 1 }}</button>
            </div>
            <p v-else-if="!g.mine && g.guessBy" class="wait-chip">交完卷了，等买家打分 📝</p>
          </div>
        </div>

        <div class="block">
          <p class="section-head">✅ 家安月检（{{ b.check.month }} · 六项勾齐才算交卷，双签齐了这家稳稳的）</p>
          <el-checkbox-group v-model="checkPicked" class="check-group" data-testid="couple-fy-check-group">
            <el-checkbox
              v-for="c in CHECK_ITEMS"
              :key="c.code"
              :value="c.code"
              :data-testid="`couple-fy-check-${c.code}`"
            >{{ c.emoji }} {{ c.label }}</el-checkbox>
          </el-checkbox-group>
          <p v-if="!checkedIn" class="check-status" data-testid="couple-fy-check-mine">我本月还没交卷 ⏳</p>
          <p v-else class="check-status" data-testid="couple-fy-check-mine">我本月已交 {{ checkedCount }}/6 项 ✅（想改还能再交一次）</p>
          <p class="check-status">
            <span class="partner-chip" data-testid="couple-fy-check-partner">{{ b.check.partner ? 'TA 本月已交卷 💕' : '等 TA 那份 ⏳' }}</span>
            <span v-if="b.check.bothIn" class="both-badge" data-testid="couple-fy-check-both">本月双签齐了，这个家稳稳的 🏠</span>
          </p>
          <div class="inline-form">
            <el-button size="small" type="primary" data-testid="couple-fy-check-submit" :disabled="checkPicked.length !== 6" @click="onHomeCheck">
              交这份月检 ✅
            </el-button>
            <span v-if="checkPicked.length && checkPicked.length < 6" class="wait-chip">还差 {{ 6 - checkPicked.length }} 项，后端不让偷懒 🧯</span>
          </div>
          <div v-if="b.checkMiss.length" class="miss-bar" data-testid="couple-fy-check-miss">
            <p class="miss-head">🚨 漏检提醒</p>
            <p v-for="(line, i) in b.checkMiss" :key="line" class="miss-line" :data-testid="`couple-fy-check-miss-${i}`">{{ line }}</p>
          </div>
        </div>
      </template>
      <p v-else class="empty-line">账房和巡检员还没到岗…</p>
    </CoupleCollapsible>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { factoryApi } from '@/api/couple'
import type { CoupleFyAdvanceVO, CoupleFyBoardVO, CoupleFyGroceryVO, CoupleFyMedVO, CoupleFyParcelVO, CoupleFyShopVO, CoupleFySpinVO, CoupleFyStockVO } from '@/types'
import CoupleCollapsible from './CoupleCollapsible.vue'

/** 整份本周车间总览（除 board 外全部写接口返回整份，整体替换即五卡刷新） */
const b = ref<CoupleFyBoardVO | null>(null)

/** F279 家安六项（编码与标签与后端 CoupleFactoryBank.CHECK_ORDER 一致，只增不改序） */
const CHECK_ITEMS = [
  { code: 'GAS', label: '燃气阀门', emoji: '🔥' },
  { code: 'WATER', label: '水管漏水', emoji: '🚰' },
  { code: 'ELEC', label: '插座发热', emoji: '🔌' },
  { code: 'WINDOW', label: '门窗密闭', emoji: '🪟' },
  { code: 'LOCK', label: '门锁钥匙', emoji: '🔑' },
  { code: 'FIRSTAID', label: '急救箱齐全', emoji: '🧯' },
]

// ---- 草稿 ----
const spinItems = ref('')
const shopName = ref('')
const shopQty = ref('')
const stockItem = ref('')
const stockQty = ref('')
const stockExpire = ref('')
const parcelNote = ref('')
const wakeText = ref('')
const medName = ref('')
const medTimes = ref('')
const advItem = ref('')
const advYuan = ref('')
const advNote = ref('')
const groceryItems = ref('')
const groceryGuesses = ref<Record<string, string>>({})
const checkPicked = ref<string[]>([])

// ---- 派生：卡内有无内容（决定 CoupleCollapsible 的空态收起） ----
/** 各卡在「什么都有」时展开，空表 + 未加载时收起（care 卡有常驻按钮，不参与收起判断） */
const hasSpin = computed(() => !!b.value?.spins.length || !!b.value?.owed.length)
const hasShop = computed(() => !!b.value?.shop.length || !!b.value?.stock.length)
const hasErrand = computed(() => !!b.value?.parcels.length || !!b.value?.wake.length)
const hasBooks = computed(() =>
  !!b.value?.advances.length
  || !!b.value?.groceries.length
  || !!b.value?.check.mine
  || !!b.value?.check.partner
  || !!b.value?.checkMiss.length,
)

const myWake = computed(() => (b.value?.wake ?? []).find((w) => w.mine) ?? null)
const partnerWake = computed(() => (b.value?.wake ?? []).find((w) => !w.mine) ?? null)
const myGrocery = computed(() => (b.value?.groceries ?? []).find((g) => g.mine) ?? null)
/** 本月我那份家安（items 为逗号分隔的六项编码，空串=没交卷） */
const myCheckCodes = computed(() => (b.value?.check.mine ?? '').split(',').filter(Boolean))
const checkedIn = computed(() => myCheckCodes.value.length > 0)
const checkedCount = computed(() => myCheckCodes.value.length)

// ---- 文案 ----
function spinStatusText(s: CoupleFySpinVO): string {
  if (s.done) return '干完了，划掉 ✅'
  if (s.confirmed) return s.mine ? '双签生效，就差我动手 🙋' : '已认账，就等 TA 动手 💕'
  return '等对方认账 ✍️'
}

function parcelStatusText(p: CoupleFyParcelVO): string {
  if (p.status === 'SENT') return p.mine ? '等 TA 来领养 📦' : '还没人接单，等接单侠 🏃'
  if (p.status === 'GRABBED') return p.mine ? '接单侠已出发 🏃' : '我接的，正在送 🧾'
  return '已送达，销单 🏅'
}

function centsToYuan(cents: number): string {
  return (cents / 100).toFixed(2)
}

function onError(e: unknown, fallback: string) {
  // 后端 400 的中文 message 直接透传（例如「本周已经转过盘了，下周再来一赌」）
  ElMessage.error(e instanceof Error ? e.message : fallback)
}

/** 写接口统一返回整份 BoardVO：整体替换即五卡刷新 */
function refresh(data: CoupleFyBoardVO | undefined | null) {
  if (data) b.value = data
}

// ---- F270 家务轮盘 ----
async function onSpin() {
  if (!spinItems.value.trim()) {
    ElMessage.warning('先把这周的活儿写上来，至少两件 🎡')
    return
  }
  try {
    refresh(await factoryApi.fySpin(spinItems.value.trim()))
    spinItems.value = ''
    ElMessage.success('盘停了，本周分工听天由命 🎡')
  } catch (e) {
    onError(e, '转盘失败')
  }
}

async function onSpinConfirm(s: CoupleFySpinVO) {
  try {
    refresh(await factoryApi.fySpinConfirm(s.id))
    ElMessage.success(`这笔「${s.item}」我认了，TA 干活有人盯着 ✍️`)
  } catch (e) {
    onError(e, '认账失败')
  }
}

async function onSpinDone(s: CoupleFySpinVO) {
  try {
    refresh(await factoryApi.fySpinDone(s.id))
    ElMessage.success(`「${s.item}」干完，今日份靠谱 +1 ✅`)
  } catch (e) {
    onError(e, '打勾失败')
  }
}

// ---- F271 采买清单 ----
async function onShopAdd() {
  if (!shopName.value.trim()) {
    ElMessage.warning('要买什么总要写吧 🧾')
    return
  }
  try {
    refresh(await factoryApi.fyShopAdd(shopName.value.trim(), shopQty.value.trim()))
    shopName.value = ''
    shopQty.value = ''
    ElMessage.success('挂上墙了，出门前看一眼 🧺')
  } catch (e) {
    onError(e, '记清单失败')
  }
}

async function onShopRemove(x: CoupleFyShopVO) {
  try {
    refresh(await factoryApi.fyShopRemove(x.id))
    ElMessage.success('划掉了，省一笔 🗑️')
  } catch (e) {
    onError(e, '划掉失败')
  }
}

async function onShopDone(x: CoupleFyShopVO) {
  try {
    refresh(await factoryApi.fyShopDone(x.id))
    ElMessage.success(`${x.name} 买回来了，登记那位会收到 🧴`)
  } catch (e) {
    onError(e, '打勾失败')
  }
}

// ---- F272 冰箱库存 ----
async function onStockAdd() {
  if (!stockItem.value.trim()) {
    ElMessage.warning('食材名要写，不然冰箱不知道塞了啥 🧊')
    return
  }
  try {
    refresh(await factoryApi.fyStockAdd(stockItem.value.trim(), stockQty.value.trim(), stockExpire.value || ''))
    stockItem.value = ''
    stockQty.value = ''
    stockExpire.value = ''
    ElMessage.success('进冰箱了，同名就当补货 🧊')
  } catch (e) {
    onError(e, '入库失败')
  }
}

async function onStockOut(s: CoupleFyStockVO) {
  try {
    refresh(await factoryApi.fyStockOut(s.id))
    ElMessage.success(`「${s.item}」吃干抹净，记得补货 🍽️`)
  } catch (e) {
    onError(e, '清掉失败')
  }
}

// ---- F273 代拿快递 ----
async function onParcelNew() {
  try {
    refresh(await factoryApi.fyParcelNew(parcelNote.value.trim()))
    parcelNote.value = ''
    ElMessage.success('件挂出去了，等接单侠领养 📦')
  } catch (e) {
    onError(e, '下单失败')
  }
}

async function onParcelGrab(p: CoupleFyParcelVO) {
  try {
    refresh(await factoryApi.fyParcelGrab(p.id))
    ElMessage.success('接单成功，顺路的事换个感谢章 🏃')
  } catch (e) {
    onError(e, '接单失败')
  }
}

async function onParcelDone(p: CoupleFyParcelVO) {
  try {
    refresh(await factoryApi.fyParcelDone(p.id))
    ElMessage.success('件到手了，销单 +2 积分 🏅')
  } catch (e) {
    onError(e, '销单失败')
  }
}

// ---- F274 叫醒服务 ----
async function onWakeSet() {
  if (!wakeText.value.trim()) {
    ElMessage.warning('叫醒词总要有一句 ⏰')
    return
  }
  try {
    refresh(await factoryApi.fyWakeSet(wakeText.value.trim()))
    wakeText.value = ''
    ElMessage.success('本周词定好了，明早生效 ⏰')
  } catch (e) {
    onError(e, '定词失败')
  }
}

async function onWakeGive() {
  try {
    refresh(await factoryApi.fyWakeGive())
    ElMessage.success('叫醒卡送达，TA 睁眼第一眼是你 ☀️')
  } catch (e) {
    onError(e, '递卡失败')
  }
}

// ---- F275 服药提醒链 ----
async function onMedAdd() {
  if (!medName.value.trim() || !medTimes.value.trim()) {
    ElMessage.warning('药名和每日时段都得写一句 💊')
    return
  }
  try {
    refresh(await factoryApi.fyMedAdd(medName.value.trim(), medTimes.value.trim()))
    medName.value = ''
    medTimes.value = ''
    ElMessage.success('登记好了，之后每天互相点一下 💊')
  } catch (e) {
    onError(e, '登记失败')
  }
}

async function onMedRemind(m: CoupleFyMedVO) {
  try {
    refresh(await factoryApi.fyMedRemind(m.id))
    ElMessage.success(`提醒记下了：${m.name} 🔔`)
  } catch (e) {
    onError(e, '提醒失败')
  }
}

async function onMedTaken(m: CoupleFyMedVO) {
  try {
    refresh(await factoryApi.fyMedTaken(m.id))
    ElMessage.success('已服下，链子又长一天 🔗')
  } catch (e) {
    onError(e, '记录失败')
  }
}

async function onMedStop(m: CoupleFyMedVO) {
  try {
    refresh(await factoryApi.fyMedStop(m.id))
    ElMessage.success(`${m.name} 停药，疗程毕业 🎉`)
  } catch (e) {
    onError(e, '停药失败')
  }
}

// ---- F276 久坐互拍 ----
async function onStandup() {
  try {
    refresh(await factoryApi.fyStandup())
    ElMessage.success('拍下去了，一小时内等 TA 跟拍 🧍')
  } catch (e) {
    onError(e, '拍肩失败')
  }
}

// ---- F277 垫付本 ----
async function onAdvanceAdd() {
  if (!advItem.value.trim()) {
    ElMessage.warning('名目要写，不然这本记了个啥 📒')
    return
  }
  const yuan = Number(advYuan.value.trim())
  if (!Number.isFinite(yuan) || yuan <= 0) {
    ElMessage.warning('金额填个正数（元，支持两位小数）📒')
    return
  }
  const amountCents = Math.round(yuan * 100)
  try {
    refresh(await factoryApi.fyAdvanceAdd(advItem.value.trim(), amountCents, advNote.value.trim()))
    advItem.value = ''
    advYuan.value = ''
    advNote.value = ''
    ElMessage.success(`记上了 ${centsToYuan(amountCents)} 元，还钱的一方记得按确认键 🧾`)
  } catch (e) {
    onError(e, '记账失败')
  }
}

async function onAdvanceSettle(a: CoupleFyAdvanceVO) {
  try {
    refresh(await factoryApi.fyAdvanceSettle(a.id))
    ElMessage.success(`${a.item} ${centsToYuan(a.amountCents)} 元已还清，无债一身轻 🧾`)
  } catch (e) {
    onError(e, '清账失败')
  }
}

// ---- F278 战利品互猜 ----
async function onGrocery() {
  if (!groceryItems.value.trim()) {
    ElMessage.warning('买了啥总要写，TA 才好猜 🛒')
    return
  }
  try {
    refresh(await factoryApi.fyGrocery(groceryItems.value.trim()))
    groceryItems.value = ''
    ElMessage.success('上单成功，去猜 TA 那一份 🎯')
  } catch (e) {
    onError(e, '上单失败')
  }
}

async function onGroceryGuess(g: CoupleFyGroceryVO) {
  const guess = (groceryGuesses.value[g.id] ?? '').trim()
  if (!guess) {
    ElMessage.warning('猜测总要写一句，写「你就是馋了」也算 🎯')
    return
  }
  try {
    refresh(await factoryApi.fyGroceryGuess(g.id, guess))
    groceryGuesses.value = { ...groceryGuesses.value, [g.id]: '' }
    ElMessage.success('交卷了，落子无悔，等 TA 打分 📝')
  } catch (e) {
    onError(e, '交卷失败')
  }
}

async function onGroceryRate(g: CoupleFyGroceryVO, score: number) {
  try {
    refresh(await factoryApi.fyGroceryRate(g.id, score))
    ElMessage.success(`本周默契分 ${score}/5 已盖章 💞`)
  } catch (e) {
    onError(e, '打分失败')
  }
}

// ---- F279 家安月检 ----
async function onHomeCheck() {
  if (checkPicked.value.length !== 6) {
    ElMessage.warning('六项都要勾，水电气不等人 🧯')
    return
  }
  try {
    refresh(await factoryApi.fyHomeCheck(CHECK_ITEMS.map((c) => c.code).join(',')))
    ElMessage.success('月检交卷，这个家稳稳的 🏠')
  } catch (e) {
    onError(e, '交卷失败')
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
  const data = await safeLoad(factoryApi.fyBoard, null)
  b.value = data
  if (data) {
    wakeText.value = data.wake.find((w) => w.mine)?.content ?? ''
    groceryItems.value = data.groceries.find((g) => g.mine)?.items ?? ''
    checkPicked.value = data.check.mine.split(',').filter(Boolean)
  }
})
</script>

<style scoped>
/* 主色：橙棕 #d2691e（工坊/车间感，区别于粉红主色、#409eff 公司蓝、#e6a23c 暖橙、#d93a3a 中国红、#9254de 倾听紫）
   折叠卡标题色经 --collapse-title-color 级联给 CoupleCollapsible，故本组件不写 .title 规则 */
.couple-factory { display: flex; flex-direction: column; gap: 14px; --collapse-title-color: #d2691e; }
.sub { font-size: 12px; color: var(--im-muted, #909399); font-weight: normal; margin-left: 6px; }
.section-head { margin: 10px 0 4px; font-size: 13px; font-weight: bold; color: #d2691e; }
.block { margin-top: 12px; padding-top: 8px; border-top: 1px dashed var(--im-border, #ebeef5); }
.inline-form { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 8px; }
.inline-form .el-input { flex: 1; min-width: 150px; }
.empty-line { margin: 8px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.hint-line { margin: 6px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.who-chip { font-size: 11px; color: var(--im-muted, #909399); }
.day-chip, .qty-chip, .status-chip { font-size: 11px; color: #d2691e; background: rgba(210, 105, 30, 0.12); padding: 1px 8px; border-radius: 10px; }
.streak-chip { font-size: 11px; color: #d2691e; background: rgba(210, 105, 30, 0.1); padding: 1px 8px; border-radius: 10px; }
.lit-chip { font-size: 12px; color: #67c23a; background: rgba(103, 194, 58, 0.1); padding: 2px 8px; border-radius: 6px; }
.warn-chip { font-size: 11px; color: #b8860b; background: rgba(184, 134, 11, 0.14); padding: 1px 8px; border-radius: 10px; }
.partner-chip { font-size: 12px; color: #d2691e; background: rgba(210, 105, 30, 0.1); padding: 2px 8px; border-radius: 6px; }
.both-badge { font-size: 12px; color: #d2691e; font-weight: bold; }
/* F270 轮盘 */
.open-line { margin: 6px 0 0; font-size: 13px; color: #d2691e; background: rgba(210, 105, 30, 0.08); border-radius: 8px; padding: 5px 10px; }
.spin-row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin: 5px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid #d2691e; font-size: 13px; }
.spin-row.is-done { border-left-color: #67c23a; opacity: 0.72; }
.spin-item { font-weight: bold; color: var(--im-text, #303133); }
.spin-row.is-done .spin-item { text-decoration: line-through; color: var(--im-muted, #909399); }
.miss-list { margin: 4px 0 0; padding-left: 18px; }
.owed-line { font-size: 12px; color: #b8860b; margin: 2px 0; }
/* F271 采买 */
.champion { margin: 0 0 4px; font-size: 13px; font-weight: bold; color: #b8860b; background: rgba(184, 134, 11, 0.12); border-radius: 8px; padding: 5px 10px; }
.shop-row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin: 4px 0; font-size: 13px; color: var(--im-text, #303133); }
.shop-title { color: #d2691e; }
/* F272 冰箱 */
.warn-bar { margin: 4px 0; padding: 6px 10px; border-radius: 8px; background: rgba(184, 134, 11, 0.1); }
.warn-line { margin: 2px 0; font-size: 12px; color: #b8860b; }
.stock-row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin: 4px 0; padding: 5px 8px; border-radius: 8px; font-size: 13px; color: var(--im-text, #303133); background: var(--im-bg, #fafafa); }
.stock-row.is-expiring { background: rgba(210, 105, 30, 0.1); border: 1px dashed rgba(184, 134, 11, 0.5); }
.stock-item { font-weight: bold; color: #d2691e; }
/* F273 快递 */
.parcel-row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin: 5px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid #d2691e; font-size: 13px; }
.parcel-row.is-grabbed { border-left-color: #b8860b; }
.parcel-row.is-done { border-left-color: #67c23a; opacity: 0.75; }
.parcel-note { color: var(--im-text, #303133); }
/* F274 叫醒 */
.wake-row { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; margin: 4px 0; font-size: 13px; }
.wake-row.is-partner .wake-text { color: #d2691e; }
.wake-label { font-size: 12px; color: var(--im-muted, #909399); }
.wake-text { color: var(--im-text, #303133); }
/* F275 服药 */
.med-row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin: 5px 0; padding: 7px 10px; border-radius: 8px; border: 1px solid var(--im-border, #ebeef5); font-size: 13px; }
.med-name { color: #d2691e; }
.flag-chip { font-size: 11px; color: var(--im-muted, #909399); background: var(--im-bg, #fafafa); padding: 1px 8px; border-radius: 10px; }
.flag-chip.is-on { color: #67c23a; background: rgba(103, 194, 58, 0.12); }
/* F276 久坐 */
.stand-btn { margin-top: 6px; padding: 14px 22px; border-radius: 12px; border: 1px solid rgba(210, 105, 30, 0.45); background: rgba(210, 105, 30, 0.08); color: #d2691e; font-size: 15px; font-weight: bold; cursor: pointer; }
.stand-btn:hover:not(:disabled) { background: #d2691e; color: #fff; }
.stand-btn:disabled { cursor: not-allowed; opacity: 0.55; }
.stand-btn.is-lit { border-color: rgba(103, 194, 58, 0.5); color: #67c23a; background: rgba(103, 194, 58, 0.1); }
.stand-status { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin: 8px 0 0; font-size: 12px; }
/* F277 垫付本 */
.total-line { margin: 6px 0 0; font-size: 13px; color: var(--im-text, #303133); }
.total-line b { color: #d2691e; font-size: 15px; }
.adv-row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin: 5px 0; padding: 7px 10px; border-radius: 8px; background: var(--im-bg, #fafafa); border-left: 3px solid #b8860b; font-size: 13px; }
.adv-item { color: var(--im-text, #303133); }
.adv-note { font-size: 12px; color: var(--im-muted, #909399); }
.amount-chip { font-size: 13px; font-weight: bold; color: #d2691e; background: rgba(210, 105, 30, 0.12); padding: 1px 8px; border-radius: 6px; }
.wait-chip { font-size: 12px; color: #b8860b; }
/* F278 战利品 */
.grocery-row { margin: 6px 0; padding: 8px 10px; border-radius: 8px; border: 1px solid var(--im-border, #ebeef5); }
.grocery-head { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; margin: 0; font-size: 13px; }
.grocery-items { color: #d2691e; }
.guess-line { margin: 4px 0 0; font-size: 12px; color: var(--im-text, #303133); white-space: pre-wrap; }
.score-badge { font-size: 12px; font-weight: bold; color: #b8860b; background: rgba(184, 134, 11, 0.14); padding: 1px 8px; border-radius: 10px; }
.score-row { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; margin: 6px 0 0; font-size: 12px; }
.score-label { color: var(--im-muted, #909399); }
.score-btn { width: 28px; height: 28px; border-radius: 50%; border: 1px solid rgba(210, 105, 30, 0.35); background: transparent; color: #d2691e; font-size: 13px; cursor: pointer; }
.score-btn:hover { background: #d2691e; color: #fff; border-color: #d2691e; }
/* F279 家安月检 */
.check-group { display: flex; gap: 10px 16px; flex-wrap: wrap; margin-top: 6px; }
.check-status { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin: 6px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.miss-bar { margin-top: 8px; padding: 6px 10px; border-radius: 8px; background: rgba(210, 105, 30, 0.1); border: 1px dashed rgba(210, 105, 30, 0.4); }
.miss-head { margin: 0; font-size: 12px; font-weight: bold; color: #d2691e; }
.miss-line { margin: 2px 0 0; font-size: 12px; color: #b8860b; }
</style>

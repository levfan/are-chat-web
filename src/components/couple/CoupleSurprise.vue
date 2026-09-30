<template>
  <div class="surprise" data-testid="couple-surprise">
    <el-collapse v-model="openBlocks" class="surprise-collapse">
      <!-- F50 爱情刮刮乐 -->
      <el-collapse-item name="scratch">
        <template #title>
          <span class="block-title">🎟️ 爱情刮刮乐 <span class="block-sub">每周一张来自 TA 的奖励券</span></span>
        </template>
        <el-empty
          v-if="!couple.scratches.length"
          description="本周的刮刮乐还在路上…"
          :image-size="60"
          data-testid="couple-scratch-empty"
        />
        <div v-else class="scratch-list">
          <div
            v-for="c in couple.scratches"
            :key="c.id"
            class="scratch-card"
            :class="{ done: c.redeemed }"
            :data-testid="`couple-scratch-${c.id}`"
          >
            <template v-if="!c.scratched">
              <div class="scratch-face" data-testid="couple-scratch-unknown">
                <span class="scratch-mask">✨ 🎁 ✨</span>
                <span class="scratch-hint">TA 送了你一张奖励券，刮开看看是什么</span>
              </div>
              <el-button type="primary" size="small" round data-testid="couple-scratch-scratch" @click="onScratch(c.id)">
                🪙 刮开
              </el-button>
            </template>
            <template v-else>
              <div class="scratch-main">
                <p class="scratch-prize" data-testid="couple-scratch-prize">{{ c.prizeText }}</p>
                <span class="scratch-week">{{ c.weekKey }}</span>
              </div>
              <div class="scratch-side">
                <el-tag v-if="c.redeemed" type="success" size="small">已兑现 ✓</el-tag>
                <el-tag v-else-if="c.fromUser === auth.username" type="warning" size="small">等 TA 来用</el-tag>
                <el-button
                  v-else
                  type="success"
                  size="small"
                  round
                  plain
                  data-testid="couple-scratch-use"
                  @click="onUseHint(c)"
                >
                  去兑现
                </el-button>
                <el-button
                  v-if="c.fromUser === auth.username && !c.redeemed"
                  size="small"
                  round
                  data-testid="couple-scratch-redeem"
                  @click="onRedeem(c.id)"
                >
                  确认核销
                </el-button>
              </div>
            </template>
          </div>
        </div>
        <p class="tip">每周你们各有一张对方送的券；刮开后把券面拿给 TA 看，由 TA 点「确认核销」完成兑现。</p>
      </el-collapse-item>

      <!-- F51 恋爱盲盒 -->
      <el-collapse-item name="box">
        <template #title>
          <span class="block-title">🎁 恋爱盲盒 <span class="block-sub">把一句话藏起来，让 TA 明天拆</span></span>
        </template>
        <div class="box-create">
          <el-radio-group v-model="boxKind" data-testid="couple-box-kind">
            <el-radio-button value="whisper">💌 悄悄话</el-radio-button>
            <el-radio-button value="task">📌 小任务</el-radio-button>
          </el-radio-group>
          <el-input
            v-model="boxContent"
            type="textarea"
            :rows="2"
            maxlength="300"
            show-word-limit
            :placeholder="boxKind === 'task' ? '给 TA 布置一个小任务，比如：去阳台看看天空' : '写一句 TA 明天才能看到的话'"
            data-testid="couple-box-content"
          />
          <div class="box-row">
            <el-date-picker
              v-model="boxOpenDay"
              type="date"
              placeholder="开箱日期（最早明天）"
              value-format="YYYY-MM-DD"
              class="box-picker"
              :disabled-date="disableBoxDay"
              data-testid="couple-box-day"
            />
            <el-button v-if="boxKind === 'task'" size="small" round data-testid="couple-box-idea" @click="fillIdea">
              🎲 来个灵感
            </el-button>
            <el-button type="primary" :loading="boxSaving" data-testid="couple-box-seal" @click="onSealBox">
              装进盒子 🎁
            </el-button>
          </div>
        </div>
        <el-empty v-if="!couple.boxes.length" description="还没有盲盒，装第一个吧" :image-size="56" />
        <div v-else class="box-list">
          <div v-for="b in couple.boxes" :key="b.id" class="box-card" :data-testid="`couple-box-${b.id}`">
            <div class="box-main">
              <span class="box-dir">{{ b.fromUser === auth.username ? '✍️ 我装的' : '📬 TA 装的' }}</span>
              <span class="box-kind">{{ b.kind === 'task' ? '📌 小任务' : '💌 悄悄话' }}</span>
              <p v-if="b.content !== null" class="box-content" data-testid="couple-box-body">{{ b.content }}</p>
              <p v-else class="box-locked" data-testid="couple-box-locked">🔒 {{ b.openDay }} 开箱，先猜猜里面是什么～</p>
            </div>
            <el-button
              v-if="b.canOpen"
              type="primary"
              size="small"
              round
              data-testid="couple-box-open"
              @click="onOpenBox(b.id)"
            >
              拆盲盒 ✨
            </el-button>
            <span v-else-if="b.fromUser !== auth.username && !b.opened" class="box-wait">⏳ {{ b.openDay }} 开箱</span>
            <span v-else-if="b.opened" class="box-done">已拆开</span>
          </div>
        </div>
      </el-collapse-item>

      <!-- F52 心动闹钟 -->
      <el-collapse-item name="alarm">
        <template #title>
          <span class="block-title">⏰ 心动闹钟 <span class="block-sub">定时替你说那句话（24 小时内）</span></span>
        </template>
        <div class="alarm-create">
          <el-input
            v-model="alarmMessage"
            maxlength="200"
            show-word-limit
            placeholder="到点想对 TA 说什么？比如：该喝水啦，想你的第 100 分钟"
            data-testid="couple-alarm-message"
          />
          <div class="box-row">
            <el-date-picker
              v-model="alarmFireAt"
              type="datetime"
              placeholder="闹钟时间"
              class="box-picker"
              :disabled-date="disableAlarmDay"
              data-testid="couple-alarm-time"
            />
            <el-button type="primary" :loading="alarmSaving" data-testid="couple-alarm-set" @click="onSetAlarm">
              设定 ⏰
            </el-button>
          </div>
        </div>
        <el-empty v-if="!couple.alarms.length" description="还没设过心动闹钟" :image-size="56" />
        <div v-else class="alarm-list">
          <div v-for="a in couple.alarms" :key="a.id" class="alarm-item" :data-testid="`couple-alarm-${a.id}`">
            <span class="alarm-ico">{{ a.fired ? '🔔' : '⏰' }}</span>
            <div class="alarm-main">
              <p class="alarm-msg" data-testid="couple-alarm-msg">{{ a.message }}</p>
              <span class="alarm-time">
                {{ a.fired ? `已在 ${formatTime(a.firedAt ?? a.fireAt)} 送达` : `将在 ${formatTime(a.fireAt)} 送达` }}
              </span>
            </div>
            <el-button
              v-if="!a.fired"
              link
              type="danger"
              size="small"
              :data-testid="`couple-alarm-cancel-${a.id}`"
              @click="onCancelAlarm(a.id)"
            >
              取消
            </el-button>
          </div>
        </div>
        <p class="tip">到点后由小助手把这句话推给 TA——准时、可靠、绝不害羞。</p>
      </el-collapse-item>

      <!-- F53 思念速递 -->
      <el-collapse-item name="miss">
        <template #title>
          <span class="block-title">📮 思念速递 <span class="block-sub">5~30 分钟后的某个时刻，替你说想你</span></span>
        </template>
        <div class="miss-box" data-testid="couple-miss-box">
          <div class="miss-stats">
            <div class="miss-stat">
              <span class="miss-num" data-testid="couple-miss-mine">{{ couple.missBoard?.myTotal ?? 0 }}</span>
              <span class="miss-label">我寄出的思念</span>
            </div>
            <div class="miss-stat">
              <span class="miss-num" data-testid="couple-miss-partner">{{ couple.missBoard?.partnerTotal ?? 0 }}</span>
              <span class="miss-label">TA 寄出的思念</span>
            </div>
            <div class="miss-stat">
              <span class="miss-num" data-testid="couple-miss-transit">{{ couple.missBoard?.inTransit ?? 0 }}</span>
              <span class="miss-label">在途</span>
            </div>
          </div>
          <el-button
            type="primary"
            round
            :disabled="(couple.missBoard?.inTransit ?? 0) > 0"
            :loading="missSending"
            data-testid="couple-miss-send"
            @click="onSendMiss"
          >
            {{ (couple.missBoard?.inTransit ?? 0) > 0 ? '思念在途…' : '💌 寄出一份「想你了」' }}
          </el-button>
          <p class="tip">点下按钮后，小助手会在 5~30 分钟之间的随机时刻告诉 TA「刚刚，你想 TA 了」——不确定的时刻，确定的惦记。</p>
        </div>
      </el-collapse-item>

      <!-- F58 藏宝图任务 -->
      <el-collapse-item name="treasure">
        <template #title>
          <span class="block-title">🗺️ 藏宝图任务 <span class="block-sub">给 TA 布置小任务，完成后揭晓宝藏</span></span>
        </template>
        <div class="treasure-create">
          <el-input v-model="treasureTask" maxlength="100" placeholder="任务：比如 去冰箱里看看第二层" data-testid="couple-treasure-task" />
          <el-input v-model="treasurePrize" maxlength="100" placeholder="宝藏（完成后才揭晓）：比如 一个大大的拥抱" data-testid="couple-treasure-prize" />
          <el-button type="primary" :loading="treasureSaving" data-testid="couple-treasure-bury" @click="onBuryTreasure">
            埋下宝藏 🏝️
          </el-button>
        </div>
        <el-empty v-if="!couple.treasures.length" description="还没有藏宝图，埋第一个宝藏吧" :image-size="56" />
        <div v-else class="treasure-list">
          <div v-for="t in couple.treasures" :key="t.id" class="treasure-card" :data-testid="`couple-treasure-${t.id}`">
            <div class="treasure-main">
              <span class="treasure-dir">{{ t.fromUser === auth.username ? '🏴 我埋的' : '🗺️ TA 发来的藏宝图' }}</span>
              <p class="treasure-task" data-testid="couple-treasure-task-text">{{ t.taskText }}</p>
              <p v-if="t.status === 'DONE' || t.fromUser === auth.username" class="treasure-prize">
                💎 {{ t.prizeText }}
              </p>
              <p v-else class="treasure-prize locked" data-testid="couple-treasure-locked">💎 宝藏已藏好，完成任务即揭晓</p>
            </div>
            <el-button
              v-if="t.status === 'PENDING' && t.fromUser !== auth.username"
              type="primary"
              size="small"
              round
              data-testid="couple-treasure-dig"
              @click="onDig(t.id)"
            >
              完成挖宝 ⛏️
            </el-button>
            <el-tag v-else-if="t.status === 'DONE'" type="success" size="small">已揭晓</el-tag>
          </div>
        </div>
      </el-collapse-item>

      <!-- F57 告白重现 -->
      <el-collapse-item name="confession">
        <template #title>
          <span class="block-title">💌 告白重现 <span class="block-sub">当年的那句话，每年今天重播一遍</span></span>
        </template>
        <div class="confession-create">
          <el-input
            v-model="confessionContent"
            type="textarea"
            :rows="3"
            maxlength="500"
            show-word-limit
            placeholder="把当年（或想说）的告白一字一句写下来，每年这一天小助手都会替你重读一遍"
            data-testid="couple-confession-content"
          />
          <div class="box-row">
            <el-date-picker
              v-model="confessionDay"
              type="date"
              placeholder="告白发生的那天"
              value-format="YYYY-MM-DD"
              class="box-picker"
              :disabled-date="(d: Date) => d.getTime() > Date.now()"
              data-testid="couple-confession-day"
            />
            <el-button type="primary" :loading="confessionSaving" data-testid="couple-confession-keep" @click="onKeepConfession">
              永久收藏 💘
            </el-button>
          </div>
        </div>
        <el-empty v-if="!couple.confessions.length" description="收藏第一段告白吧" :image-size="56" />
        <div v-else class="confession-list">
          <div v-for="c in couple.confessions" :key="c.id" class="confession-card" :data-testid="`couple-confession-${c.id}`">
            <div class="confession-main">
              <p class="confession-content" data-testid="couple-confession-text">「{{ c.content }}」</p>
              <span class="confession-meta">{{ c.confessDay }} · {{ c.createdBy === auth.username ? '我录入的' : 'TA 录入的' }}</span>
            </div>
            <el-button
              v-if="c.createdBy === auth.username"
              link
              type="danger"
              size="small"
              :data-testid="`couple-confession-del-${c.id}`"
              @click="onDeleteConfession(c.id)"
            >
              删除
            </el-button>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useCoupleStore } from '@/stores/couple'
import type { CoupleScratchVO } from '@/types'

const auth = useAuthStore()
const couple = useCoupleStore()

const openBlocks = ref(['scratch'])

// 刮刮乐
async function onScratch(id: string) {
  try {
    await couple.scratchCard(id)
    ElMessage.success('刮开啦 🎉 快看看抽中了什么！')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '刮开失败')
  }
}

async function onUseHint(c: CoupleScratchVO) {
  try {
    await ElMessageBox.alert(
      `把这张券面展示给 TA：\n「${c.prizeText}」\n等 TA 兑现后点「确认核销」就完成闭环啦～`,
      '兑现指引',
      { confirmButtonText: '好嘞' },
    )
  } catch {
    // 用户关闭
  }
}

async function onRedeem(id: string) {
  try {
    await couple.redeemScratch(id)
    ElMessage.success('已核销，承诺 +1 🎫')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '核销失败')
  }
}

// 盲盒
const boxKind = ref<'whisper' | 'task'>('whisper')
const boxContent = ref('')
const boxOpenDay = ref('')
const boxSaving = ref(false)

function disableBoxDay(d: Date) {
  const min = new Date()
  min.setDate(min.getDate() + 1)
  return d.getTime() < min.setHours(0, 0, 0, 0)
}

function fillIdea() {
  const ideas = [
    '去镜子前对自己笑一下，然后回来告诉我镜子里的你很好看',
    '喝一杯水，然后回来领奖励',
    '出门看一眼天空，回来形容给我听',
    '深呼吸三次，把烦恼呼出去',
    '唱一句你最喜欢的歌给我听',
    '说出我的三个优点，少一个都不行',
    '给自己泡杯热饮，顺便替我也干一杯',
    '伸个懒腰，转三圈，然后原地站好等我夸',
  ]
  boxContent.value = ideas[Math.floor(Math.random() * ideas.length)]
}

async function onSealBox() {
  const text = boxContent.value.trim()
  if (!text) {
    ElMessage.warning('盒子里总要放点什么吧～')
    return
  }
  if (!boxOpenDay.value) {
    ElMessage.warning('选一个开箱日期（最早明天）')
    return
  }
  boxSaving.value = true
  try {
    await couple.createBox(boxKind.value, text, boxOpenDay.value)
    boxContent.value = ''
    boxOpenDay.value = ''
    ElMessage.success('盲盒已装好 🎁 TA 已经收到「有个盒子在等 TA」的消息啦')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '装盒失败')
  } finally {
    boxSaving.value = false
  }
}

async function onOpenBox(id: string) {
  try {
    await couple.openBox(id)
    ElMessage.success('拆开啦 ✨')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '拆盒失败')
  }
}

// 心动闹钟
const alarmMessage = ref('')
const alarmFireAt = ref('')
const alarmSaving = ref(false)

function disableAlarmDay(d: Date) {
  const max = new Date()
  max.setTime(max.getTime() + 24 * 60 * 60 * 1000)
  return d.getTime() > max.getTime()
}

function formatTime(at: number) {
  const d = new Date(at)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getMonth() + 1}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

async function onSetAlarm() {
  const msg = alarmMessage.value.trim()
  if (!msg || !alarmFireAt.value) {
    ElMessage.warning('写好那句话，再定个时间')
    return
  }
  const fireAt = new Date(alarmFireAt.value).getTime()
  if (!fireAt || fireAt <= Date.now()) {
    ElMessage.warning('闹钟时间要定在未来哦')
    return
  }
  alarmSaving.value = true
  try {
    await couple.createAlarm(msg, fireAt)
    alarmMessage.value = ''
    alarmFireAt.value = ''
    ElMessage.success('闹钟已设定 ⏰ 到点小助手替你说')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '设定失败')
  } finally {
    alarmSaving.value = false
  }
}

async function onCancelAlarm(id: string) {
  try {
    await couple.cancelAlarm(id)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '取消失败')
  }
}

// 思念速递
const missSending = ref(false)

async function onSendMiss() {
  missSending.value = true
  try {
    await couple.sendMiss()
    ElMessage.success('思念已寄出 📮 几分钟后的某个时刻抵达')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '寄出失败')
  } finally {
    missSending.value = false
  }
}

// 藏宝图
const treasureTask = ref('')
const treasurePrize = ref('')
const treasureSaving = ref(false)

async function onBuryTreasure() {
  const task = treasureTask.value.trim()
  const prize = treasurePrize.value.trim()
  if (!task || !prize) {
    ElMessage.warning('任务和宝藏都要写清楚哦')
    return
  }
  treasureSaving.value = true
  try {
    await couple.createTreasure(task, prize)
    treasureTask.value = ''
    treasurePrize.value = ''
    ElMessage.success('宝藏已埋好 🏝️ 等 TA 来挖')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '埋藏失败')
  } finally {
    treasureSaving.value = false
  }
}

async function onDig(id: string) {
  try {
    const vo = await couple.completeTreasure(id)
    ElMessage.success(`宝藏揭晓 💎 ${vo.prizeText ?? ''}`)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '挖宝失败')
  }
}

// 告白重现
const confessionContent = ref('')
const confessionDay = ref('')
const confessionSaving = ref(false)

async function onKeepConfession() {
  const text = confessionContent.value.trim()
  if (!text || !confessionDay.value) {
    ElMessage.warning('写下告白，再选个日期')
    return
  }
  confessionSaving.value = true
  try {
    await couple.createConfession(text, confessionDay.value)
    confessionContent.value = ''
    confessionDay.value = ''
    ElMessage.success('告白已永久收藏 💘 每年今天自动重播')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '收藏失败')
  } finally {
    confessionSaving.value = false
  }
}

async function onDeleteConfession(id: string) {
  try {
    await ElMessageBox.confirm('删除这条告白存档吗？删除后不再重播。', '删除告白', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '留下',
    })
    await couple.deleteConfession(id)
  } catch {
    // 用户取消
  }
}

onMounted(() => {
  void couple.loadSurprise()
})
</script>

<style scoped>
.surprise {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.surprise-collapse :deep(.el-collapse-item__header) {
  height: 44px;
}
.block-title {
  font-size: 14px;
  font-weight: 700;
}
.block-sub {
  margin-left: 8px;
  font-size: 12px;
  font-weight: 400;
  color: var(--im-muted, #8f959e);
}
.tip {
  margin: 8px 0 0;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
/* 刮刮乐 */
.scratch-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.scratch-card {
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  padding: 12px 14px;
}
.scratch-card.done {
  opacity: 0.75;
}
.scratch-face {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.scratch-mask {
  font-size: 18px;
  letter-spacing: 6px;
}
.scratch-hint {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.scratch-main {
  flex: 1;
  min-width: 0;
}
.scratch-prize {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}
.scratch-week {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.scratch-side {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
/* 盲盒 */
.box-create,
.alarm-create,
.treasure-create,
.confession-create {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 10px;
}
.box-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.box-picker {
  width: 200px;
}
.box-list,
.alarm-list,
.treasure-list,
.confession-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.box-card,
.alarm-item,
.treasure-card,
.confession-card {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  padding: 10px 14px;
}
.box-main,
.alarm-main,
.treasure-main,
.confession-main {
  flex: 1;
  min-width: 0;
}
.box-dir,
.treasure-dir {
  font-size: 12px;
  font-weight: 700;
  color: var(--el-color-primary, #409eff);
}
.box-kind {
  margin-left: 8px;
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.box-content {
  margin: 4px 0 0;
  font-size: 13px;
  word-break: break-all;
}
.box-locked {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.box-wait,
.box-done {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
  flex-shrink: 0;
}
/* 闹钟 */
.alarm-ico {
  font-size: 16px;
}
.alarm-msg {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  word-break: break-all;
}
.alarm-time {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
/* 思念速递 */
.miss-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  padding: 14px;
}
.miss-stats {
  display: flex;
  gap: 28px;
}
.miss-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.miss-num {
  font-size: 20px;
  font-weight: 700;
  color: var(--el-color-danger, #f56c6c);
}
.miss-label {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
/* 藏宝图 */
.treasure-task {
  margin: 4px 0 0;
  font-size: 13px;
  font-weight: 600;
  word-break: break-all;
}
.treasure-prize {
  margin: 2px 0 0;
  font-size: 12px;
  color: var(--el-color-success, #67c23a);
}
.treasure-prize.locked {
  color: var(--im-muted, #8f959e);
}
/* 告白 */
.confession-content {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
}
.confession-meta {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
</style>

<template>
  <div class="makeup" data-testid="couple-makeup">
    <!-- F61 矛盾复盘 -->
    <div class="review-card" data-testid="couple-peace-review">
      <h4 class="section-title">🕊️ 矛盾复盘 <span class="sub">和好之后各写一份，合成「和好锦囊」</span></h4>
      <div class="review-form">
        <el-input
          v-model="reviewMyPart"
          type="textarea"
          :rows="2"
          maxlength="200"
          show-word-limit
          placeholder="我当时为什么在意 / 我的那部分是什么？"
          data-testid="couple-review-part"
        />
        <el-input
          v-model="reviewNextTime"
          type="textarea"
          :rows="2"
          maxlength="200"
          show-word-limit
          placeholder="下次遇到类似的事，我们可以怎么做？"
          data-testid="couple-review-next"
        />
        <el-button type="primary" :loading="savingReview" data-testid="couple-review-save" @click="onSaveReview">
          存入今天的锦囊 🕊️
        </el-button>
      </div>
      <el-empty
        v-if="!couple.peaceReviews.length"
        description="还没有复盘记录——不是每天都要用，吵架后的那天来写刚刚好"
        :image-size="56"
      />
      <div v-else class="review-list">
        <div
          v-for="d in couple.peaceReviews"
          :key="d.day"
          class="review-day"
          :class="{ done: d.complete }"
          :data-testid="`couple-review-${d.day}`"
        >
          <div class="review-head">
            <span class="review-day-text">{{ d.day }}</span>
            <el-tag v-if="d.complete" type="success" size="small">和好锦囊 ✓</el-tag>
            <el-tag v-else type="info" size="small">等 TA 的一份</el-tag>
          </div>
          <div class="review-body">
            <div v-if="d.mine" class="review-side">
              <span class="side-label">我的复盘</span>
              <p>「{{ d.mine.myPart }}」</p>
              <p class="next">下次：{{ d.mine.nextTime }}</p>
            </div>
            <div v-if="d.partner" class="review-side">
              <span class="side-label">TA 的复盘</span>
              <p>「{{ d.partner.myPart }}」</p>
              <p class="next">下次：{{ d.partner.nextTime }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- F62 道歉券 -->
    <div class="sorry-card" data-testid="couple-sorry">
      <h4 class="section-title">🎫 道歉券 <span class="sub">把「对不起」做成一张能递出去的券</span></h4>
      <div class="sorry-form">
        <el-input
          v-model="sorryNote"
          maxlength="100"
          show-word-limit
          placeholder="附言：比如 刚才语气不好，对不起；这券你随时能用"
          data-testid="couple-sorry-note"
          @keyup.enter="onSendSorry"
        />
        <el-button type="warning" :loading="sendingSorry" data-testid="couple-sorry-send" @click="onSendSorry">
          递一张道歉券 🎫
        </el-button>
      </div>
      <el-empty v-if="!couple.sorryTickets.length" description="还没有道歉券——希望永远用不上，但需要时它就在" :image-size="56" />
      <div v-else class="ticket-list">
        <div
          v-for="t in couple.sorryTickets"
          :key="t.id"
          class="ticket"
          :class="{ mine: t.fromUser === auth.username, used: t.status === 'USED' }"
          :data-testid="`couple-sorry-${t.id}`"
        >
          <div class="ticket-main">
            <span class="ticket-from">{{ t.fromUser === auth.username ? '我递出的' : 'TA 递来的' }}</span>
            <p class="ticket-note" data-testid="couple-sorry-note-text">{{ t.note }}</p>
            <span v-if="t.usedNote" class="ticket-reply">TA 回应：「{{ t.usedNote }}」</span>
          </div>
          <el-tag v-if="t.status === 'USED'" type="success" size="small">已收下</el-tag>
          <el-button
            v-else-if="t.fromUser !== auth.username"
            type="success"
            size="small"
            round
            data-testid="couple-sorry-use"
            @click="onUseSorry(t.id)"
          >
            收下这份心意
          </el-button>
          <span v-else class="ticket-wait">等 TA 收下</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useCoupleStore } from '@/stores/couple'

const auth = useAuthStore()
const couple = useCoupleStore()

const reviewMyPart = ref('')
const reviewNextTime = ref('')
const savingReview = ref(false)
const sorryNote = ref('')
const sendingSorry = ref(false)

async function onSaveReview() {
  const part = reviewMyPart.value.trim()
  const next = reviewNextTime.value.trim()
  if (!part || !next) {
    ElMessage.warning('两栏都要写，锦囊才完整')
    return
  }
  savingReview.value = true
  try {
    await couple.savePeaceReview(part, next)
    reviewMyPart.value = ''
    reviewNextTime.value = ''
    ElMessage.success('已存入今天的锦囊 🕊️')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '保存失败')
  } finally {
    savingReview.value = false
  }
}

async function onSendSorry() {
  const note = sorryNote.value.trim()
  if (!note) {
    ElMessage.warning('写一句附言，把对不起递出去')
    return
  }
  sendingSorry.value = true
  try {
    await couple.sendSorry(note)
    sorryNote.value = ''
    ElMessage.success('道歉券已递出 🎫')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '递券失败')
  } finally {
    sendingSorry.value = false
  }
}

async function onUseSorry(id: string) {
  try {
    await couple.useSorry(id)
    ElMessage.success('已收下 🫶 这个跟头没白摔')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '收券失败')
  }
}

onMounted(() => {
  void couple.loadMakeup()
})
</script>

<style scoped>
.makeup {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.section-title {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 700;
}
.sub {
  margin-left: 6px;
  font-size: 12px;
  font-weight: 400;
  color: var(--im-muted, #8f959e);
}
.review-card,
.sorry-card {
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 12px;
  padding: 14px;
}
.review-form,
.sorry-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}
.review-form .el-button,
.sorry-form .el-button {
  align-self: flex-start;
}
.review-list,
.ticket-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.review-day {
  border: 1px dashed var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  padding: 10px 12px;
}
.review-day.done {
  border-style: solid;
  background: var(--el-fill-color-lighter, #fafafa);
}
.review-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.review-day-text {
  font-size: 12px;
  font-weight: 700;
}
.review-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
@media (max-width: 720px) {
  .review-body {
    grid-template-columns: 1fr;
  }
}
.review-side p {
  margin: 2px 0;
  font-size: 12px;
  word-break: break-all;
}
.side-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--el-color-primary, #409eff);
}
.review-side .next {
  color: var(--im-muted, #8f959e);
}
.ticket {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  padding: 10px 12px;
}
.ticket.mine {
  background: var(--el-fill-color-lighter, #fafafa);
}
.ticket.used {
  opacity: 0.8;
}
.ticket-main {
  flex: 1;
  min-width: 0;
}
.ticket-from {
  font-size: 11px;
  font-weight: 700;
  color: var(--el-color-warning, #e6a23c);
}
.ticket-note {
  margin: 2px 0;
  font-size: 13px;
  word-break: break-all;
}
.ticket-reply {
  font-size: 11px;
  color: var(--el-color-success, #67c23a);
}
.ticket-wait {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
  flex-shrink: 0;
}
</style>

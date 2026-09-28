<template>
  <div class="letters" data-testid="couple-letters">
    <!-- 写信 -->
    <div class="compose-box" data-testid="couple-letter-compose">
      <h4 class="section-title">💌 写给 TA 的悄悄话</h4>
      <el-input
        v-model="content"
        type="textarea"
        :rows="3"
        maxlength="300"
        show-word-limit
        placeholder="有些话想当面说又不好意思？写下来塞进 TA 的信箱吧…"
        data-testid="couple-letter-content"
        @input="lastDrawn = false"
      />
      <div class="compose-row">
        <el-radio-group v-model="deliverChoice" size="small" data-testid="couple-letter-deliver">
          <el-radio-button value="now">立即送达</el-radio-button>
          <el-radio-button value="tomorrow">明天才能拆 🕳️</el-radio-button>
          <el-radio-button value="3d">3 天后</el-radio-button>
          <el-radio-button value="7d">7 天后</el-radio-button>
        </el-radio-group>
        <el-button type="primary" :loading="sending" data-testid="couple-letter-send" @click="onSend">
          塞进 TA 的信箱
        </el-button>
      </div>
      <div class="draw-row">
        <el-button size="small" round :loading="drawing" data-testid="couple-letter-draw" @click="onDraw">
          🎴 抽一句情话填进来
        </el-button>
        <span v-if="lastDrawn" class="draw-hint">已替你填好，不满意可以再抽～</span>
      </div>
      <p class="compose-tip">慢递信到点前 TA 拆不开；TA 拆开后你们都能看到内容。</p>
    </div>

    <!-- 信箱列表 -->
    <el-empty
      v-if="!couple.letters.length"
      description="信箱还是空的，写下第一封悄悄话吧 💕"
      :image-size="80"
      data-testid="couple-letters-empty"
    />
    <div v-else class="letter-list">
      <div
        v-for="letter in couple.letters"
        :key="letter.id"
        class="letter-card"
        :class="{ mine: isMine(letter), sealed: letter.status === 'SEALED' }"
        :data-testid="`couple-letter-${letter.id}`"
      >
        <div class="letter-head">
          <span class="letter-dir">{{ isMine(letter) ? '✍️ 我写给 TA' : '📬 TA 写给我的' }}</span>
          <span class="letter-date">{{ formatTime(letter.created) }}</span>
        </div>

        <!-- 已拆封 / 我自己的信 / 到期未拆：显示内容 -->
        <p v-if="letter.content !== null" class="letter-body" data-testid="couple-letter-body">
          {{ letter.content }}
        </p>
        <!-- 未到点的慢递（收件人视角） -->
        <div v-else class="letter-locked" data-testid="couple-letter-locked">
          <span class="lock-emoji">🔒</span>
          <span>{{ remainText(letter) }}才能拆开，先猜猜里面写了什么～</span>
        </div>

        <div class="letter-foot">
          <span v-if="letter.status === 'OPENED' && letter.openedAt" class="letter-state opened">
            {{ isMine(letter) ? `TA 在 ${formatTime(letter.openedAt)} 拆开了` : `我在 ${formatTime(letter.openedAt)} 拆开了` }}
          </span>
          <span v-else-if="letter.status === 'SEALED' && letter.locked" class="letter-state sealed">
            ⏳ 慢递中
          </span>
          <span v-else-if="isMine(letter)" class="letter-state ready">待 TA 拆开</span>
          <span v-else class="letter-state ready">可以拆开啦</span>

          <span class="letter-actions">
            <el-button
              v-if="!isMine(letter) && letter.status === 'SEALED' && !letter.locked"
              type="primary"
              size="small"
              round
              data-testid="couple-letter-open"
              @click="onOpen(letter)"
            >
              拆信 💌
            </el-button>
            <el-button
              v-if="isMine(letter) && letter.status === 'SEALED'"
              size="small"
              round
              type="danger"
              plain
              data-testid="couple-letter-recall"
              @click="onRecall(letter)"
            >
              撤回
            </el-button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useCoupleStore } from '@/stores/couple'
import type { CoupleLetterVO } from '@/types'

const auth = useAuthStore()
const couple = useCoupleStore()

const content = ref('')
const sending = ref(false)
const drawing = ref(false)
const lastDrawn = ref(false)
/** 送达方式：now 立即 / tomorrow 明天零点 / 3d、7d 之后零点 */
const deliverChoice = ref<'now' | 'tomorrow' | '3d' | '7d'>('now')

/** 抽一句情话填进写信框 */
async function onDraw() {
  drawing.value = true
  try {
    const word = await couple.drawLoveWord()
    content.value = word
    lastDrawn.value = true
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '抽卡失败')
  } finally {
    drawing.value = false
  }
}

function isMine(letter: CoupleLetterVO) {
  return letter.sender === auth.username
}

/** 慢递送达时刻：明天/3 天/7 天后的本地零点 */
function deliverAt(): number | null {
  if (deliverChoice.value === 'now') return null
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + (deliverChoice.value === 'tomorrow' ? 1 : deliverChoice.value === '3d' ? 3 : 7))
  return d.getTime()
}

function remainText(letter: CoupleLetterVO) {
  if (!letter.deliverAt) return '现在'
  const days = Math.ceil((letter.deliverAt - Date.now()) / 86400000)
  return days <= 0 ? '现在' : `${days} 天后`
}

function formatTime(at: number) {
  const d = new Date(at)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getMonth() + 1}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

async function onSend() {
  const text = content.value.trim()
  if (!text) {
    ElMessage.warning('先写下想说的内容')
    return
  }
  sending.value = true
  try {
    await couple.createLetter(text, deliverAt())
    content.value = ''
    ElMessage.success(deliverChoice.value === 'now' ? '悄悄话已送达 TA 的信箱 💌' : '慢递悄悄话已封好 🕳️')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '发送失败')
  } finally {
    sending.value = false
  }
}

async function onOpen(letter: CoupleLetterVO) {
  try {
    await couple.openLetter(letter.id)
    ElMessage.success('信已拆开 💌')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '拆信失败')
  }
}

async function onRecall(letter: CoupleLetterVO) {
  try {
    await ElMessageBox.confirm('TA 还没拆开，确定撤回这封悄悄话吗？', '撤回悄悄话', {
      type: 'warning',
      confirmButtonText: '撤回',
      cancelButtonText: '再想想',
    })
    await couple.deleteLetter(letter.id)
  } catch {
    // 用户取消
  }
}

onMounted(() => {
  void couple.loadLetters()
})
</script>

<style scoped>
.letters {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.section-title {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 700;
}
.compose-box {
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  padding: 14px;
}
.compose-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 10px;
  flex-wrap: wrap;
}
.compose-tip {
  margin: 8px 0 0;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.draw-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}
.draw-hint {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.letter-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.letter-card {
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  padding: 12px 14px;
}
.letter-card.mine {
  background: var(--el-fill-color-lighter, #fafafa);
}
.letter-card.sealed {
  border-style: dashed;
}
.letter-head {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}
.letter-dir {
  font-size: 12px;
  font-weight: 700;
  color: var(--el-color-primary, #409eff);
}
.letter-card.mine .letter-dir {
  color: var(--el-color-success, #67c23a);
}
.letter-date {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.letter-body {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
}
.letter-locked {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 8px;
  background: var(--el-fill-color-lighter, #f5f7fa);
  font-size: 13px;
  color: var(--im-muted, #8f959e);
}
.lock-emoji {
  font-size: 18px;
}
.letter-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 8px;
}
.letter-state {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.letter-state.opened {
  color: var(--el-color-success, #67c23a);
}
.letter-state.ready {
  color: var(--el-color-warning, #e6a23c);
}
.letter-actions {
  display: flex;
  gap: 8px;
}
</style>

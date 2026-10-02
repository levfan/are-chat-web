<template>
  <div class="couple-poem" data-testid="couple-poem">
    <!-- F160 情诗接龙 -->
    <div class="card" data-testid="couple-chain">
      <h4 class="title">🖋️ 情诗接龙 <span class="sub">一天一句，把日子连成一首写不完的诗</span></h4>
      <div v-if="poemChain" class="chain-info">
        <p class="chain-writer" data-testid="couple-chain-writer">
          今天执笔：{{ poemChain.myTurn ? '你' : 'TA' }}
          <el-tag v-if="poemChain.writtenToday" size="small" type="success">我已写下今天的</el-tag>
        </p>
        <div v-if="poemChain.lines.length" class="poem-paper">
          <p v-for="l in poemChain.lines" :key="l.id" class="poem-line" :data-testid="`couple-poem-line-${l.id}`">
            <span class="poem-day">{{ l.day.slice(5) }}</span>
            {{ l.line }}<span class="poem-by">——{{ l.mine ? '我' : 'TA' }}</span>
          </p>
        </div>
        <p v-else class="poem-empty">我们的诗还空着，从第一句开始吧 ✍️</p>
      </div>
      <div class="inline-form">
        <el-input v-model="lineDraft" maxlength="100" placeholder="今天的这一句（你是我窗前的月光）" data-testid="couple-chain-input" />
        <el-button size="small" type="primary" data-testid="couple-chain-add" @click="onAddLine">接上 🖋️</el-button>
      </div>
    </div>

    <!-- F162 醒来第一条 -->
    <div class="card" data-testid="couple-morning-note">
      <h4 class="title">🌙 醒来第一条 <span class="sub">睡前封一条，明早才送达</span></h4>
      <div class="inline-form">
        <el-input v-model="morningDraft" maxlength="300" placeholder="想让 TA 醒来第一眼看到的话" data-testid="couple-morning-input" />
        <el-button size="small" type="primary" data-testid="couple-morning-seal" @click="onSealMorning">封存 🌙</el-button>
      </div>
      <template v-if="morningBox">
        <div v-for="n in morningBox.delivered" :key="n.id" class="note-delivered" :data-testid="`couple-morning-${n.id}`">
          <span class="note-day">{{ n.deliverDay.slice(5) }}</span>
          <span class="note-content">{{ n.content }}</span>
          <el-tag v-if="n.read" size="small" type="success">已读</el-tag>
          <el-button v-else size="small" type="primary" plain :data-testid="`couple-morning-read-${n.id}`" @click="onReadMorning(n.id)">
            标记已读 ☀️
          </el-button>
        </div>
        <p v-if="morningBox.mine.length" class="mine-note" data-testid="couple-morning-mine">
          你封存的 {{ morningBox.mine.length }} 条留言在明天之后的路上 ✉️
        </p>
      </template>
    </div>

    <!-- F163 心情漂流瓶 -->
    <div class="card" data-testid="couple-bottle">
      <h4 class="title">🌊 心情漂流瓶 <span class="sub">把坏情绪交给海，把回应留给爱人</span></h4>
      <div class="inline-form">
        <el-input v-model="bottleMood" maxlength="20" placeholder="心情（委屈）" style="max-width: 120px" data-testid="couple-bottle-mood" />
        <el-input v-model="bottleDraft" maxlength="300" placeholder="瓶中信：今天想扔掉的坏情绪" data-testid="couple-bottle-content" />
        <el-button size="small" type="primary" data-testid="couple-bottle-toss" @click="onTossBottle">扔进海里 🌊</el-button>
      </div>
      <div v-for="b in bottleList" :key="b.id" class="bottle-item" :data-testid="`couple-bottle-${b.id}`">
        <span class="bottle-head">{{ b.mine ? '我扔的' : 'TA 扔的' }}（{{ b.mood }}）</span>
        <span class="bottle-content">{{ b.content }}</span>
        <template v-if="b.status === 'REPLIED'">
          <el-tag size="small" type="success" data-testid="couple-bottle-replied">已回信</el-tag>
          <span class="bottle-reply">「{{ b.reply }}」</span>
        </template>
        <template v-else-if="!b.mine">
          <el-input v-model="bottleReplies[b.id]" size="small" maxlength="300" placeholder="捡到了，回一句" class="bottle-reply-input" />
          <el-button size="small" type="primary" plain :data-testid="`couple-bottle-reply-${b.id}`" @click="onReplyBottle(b.id)">
            寄回 💌
          </el-button>
        </template>
        <el-tag v-else size="small" type="info">漂向 TA 的路上…</el-tag>
      </div>
    </div>

    <!-- F164 数字密码情书 -->
    <div class="card" data-testid="couple-cipher">
      <h4 class="title">🔐 数字密码情书 <span class="sub">只有彼此看得懂的数字，才是最甜的密码</span></h4>
      <div class="cipher-hint">编码表：a=1 b=2 … z=26，空格用 0（如 LOVE → 12-15-22-5）</div>
      <div class="inline-form">
        <el-input v-model="cipherPlain" placeholder="输入要加密的拼音/英文" data-testid="couple-cipher-plain" />
        <el-button size="small" plain data-testid="couple-cipher-encode" @click="encodeCipher">转密码 🔐</el-button>
      </div>
      <div class="inline-form">
        <el-input v-model="cipherDraft" placeholder="数字密码串" data-testid="couple-cipher-text" />
        <el-input v-model="cipherHint" maxlength="100" placeholder="提示（可空）" style="max-width: 140px" data-testid="couple-cipher-hint" />
        <el-button size="small" type="primary" data-testid="couple-cipher-make" @click="onMakeCipher">藏起来 💌</el-button>
      </div>
      <div v-for="c in cipherList" :key="c.id" class="cipher-item" :data-testid="`couple-cipher-${c.id}`">
        <span class="cipher-from">{{ c.mine ? '我加密的' : 'TA 加密的' }}</span>
        <span class="cipher-text">{{ c.cipher }}</span>
        <span v-if="c.hint" class="cipher-hint-text">提示：{{ c.hint }}</span>
        <template v-if="!c.mine && !c.decodedBy">
          <el-button size="small" plain :data-testid="`couple-cipher-decode-${c.id}`" @click="decodeCipher(c)">
            解码 🔓
          </el-button>
        </template>
        <el-tag v-if="c.decodedBy" size="small" type="success">已解开</el-tag>
        <span v-if="c.decodedBy" class="cipher-plain">→ {{ decodedTexts[c.id] ?? '已解出' }}</span>
      </div>
    </div>

    <!-- F165 灵魂提问盲盒 -->
    <div class="card" data-testid="couple-soul">
      <h4 class="title">🎁 灵魂提问盲盒 <span class="sub">今天的问题：{{ soulQ?.question ?? '……' }}</span></h4>
      <div class="inline-form">
        <el-input v-model="soulDraft" maxlength="300" placeholder="认真答一答（双答才互见）" data-testid="couple-soul-input" />
        <el-button size="small" type="primary" data-testid="couple-soul-answer" @click="onAnswerSoul">交卷 🎁</el-button>
      </div>
      <p v-if="soulQ?.mine" class="soul-line" data-testid="couple-soul-mine">我的答案：{{ soulQ.mine.answer }}</p>
      <p v-if="soulQ?.partner" class="soul-line" data-testid="couple-soul-partner">TA 的答案：{{ soulQ.partner.answer }}</p>
      <p v-else-if="soulQ?.mine" class="soul-line soul-wait">TA 已在酝酿，双答后互相揭晓 🤫</p>
    </div>

    <!-- F161 三行情书 -->
    <div class="card" data-testid="couple-poem3">
      <h4 class="title">✍️ 三行情书 <span class="sub">最深的话，用最短的诗说</span></h4>
      <div class="poem3-form">
        <el-input v-model="p3a" maxlength="60" placeholder="第一行" data-testid="couple-poem3-l1" />
        <el-input v-model="p3b" maxlength="60" placeholder="第二行" data-testid="couple-poem3-l2" />
        <el-input v-model="p3c" maxlength="60" placeholder="第三行" data-testid="couple-poem3-l3" />
        <el-button size="small" type="primary" data-testid="couple-poem3-add" @click="onAddPoem3">写好 ✍️</el-button>
      </div>
      <div v-for="p in poems3List" :key="p.id" class="poem3-item" :data-testid="`couple-poem3-${p.id}`">
        <p class="poem3-lines">{{ p.line1 }}<br />{{ p.line2 }}<br />{{ p.line3 }}</p>
        <span class="poem3-by">——{{ p.mine ? '我' : 'TA' }} 的情书</span>
        <el-tag v-if="p.liked" size="small" type="danger" data-testid="couple-poem3-liked">❤️ 被点赞</el-tag>
        <el-button v-else-if="!p.mine" size="small" type="danger" plain :data-testid="`couple-poem3-like-${p.id}`" @click="onLikePoem3(p.id)">
          点赞 ❤️
        </el-button>
      </div>
    </div>

    <!-- F166 贴纸手账 -->
    <div class="card" data-testid="couple-journal">
      <h4 class="title">📔 贴纸手账 <span class="sub">一天一页，把平凡日子贴成册</span></h4>
      <div class="sticker-row" data-testid="couple-stickers">
        <span
          v-for="s in stickers"
          :key="s"
          class="sticker"
          :class="{ active: journalSticker === s }"
          :data-testid="`couple-sticker-${s}`"
          @click="journalSticker = s"
        >
          {{ s }}
        </span>
      </div>
      <div class="inline-form">
        <el-input v-model="journalDraft" maxlength="200" :placeholder="`今天的小事（贴纸：${journalSticker}）`" data-testid="couple-journal-input" />
        <el-button size="small" type="primary" data-testid="couple-journal-save" @click="onSaveJournal">写一页 📔</el-button>
      </div>
      <div class="journal-grid">
        <div v-for="j in journalPages" :key="j.id" class="journal-page" :data-testid="`couple-journal-${j.id}`">
          <span class="journal-sticker">{{ j.sticker }}</span>
          <span class="journal-text">{{ j.text }}</span>
          <span class="journal-by">{{ j.day.slice(5) }} · {{ j.mine ? '我' : 'TA' }}</span>
        </div>
      </div>
    </div>

    <!-- F167 恋爱语录机 + F168 情书模板库 -->
    <div class="card" data-testid="couple-quote">
      <h4 class="title">💗 恋爱语录机 & 情书模板 <span class="sub">没灵感的时候，借一点文字的力量</span></h4>
      <p v-if="loveQuote" class="quote-line" data-testid="couple-quote-text">「{{ loveQuote }}」</p>
      <el-button size="small" plain data-testid="couple-quote-refresh" @click="onReloadQuote">换一句 🎲</el-button>
      <div class="tpl-list">
        <div v-for="t in templates" :key="t.title" class="tpl-item" :data-testid="`couple-tpl-${t.title}`">
          <p class="tpl-title">{{ t.title }}<el-tag size="small" type="info">{{ t.scene }}</el-tag></p>
          <p class="tpl-body">{{ t.body }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useCoupleStore } from '@/stores/couple'
import type { CoupleCipherNoteVO } from '@/types'

const couple = useCoupleStore()

const poemChain = computed(() => couple.poemChain)
const morningBox = computed(() => couple.morningBox)
const bottleList = computed(() => couple.bottleList)
const cipherList = computed(() => couple.cipherNoteList)
const soulQ = computed(() => couple.soulQ)
const poems3List = computed(() => couple.poems3)
const journalPages = computed(() => couple.journalList)
const stickers = computed(() => couple.stickerList)
const templates = computed(() => couple.letterTemplates)
const loveQuote = computed(() => couple.loveQuote)

const lineDraft = ref('')
const morningDraft = ref('')
const bottleMood = ref('')
const bottleDraft = ref('')
const bottleReplies = reactive<Record<string, string>>({})
const cipherPlain = ref('')
const cipherDraft = ref('')
const cipherHint = ref('')
const decodedTexts = reactive<Record<string, string>>({})
const soulDraft = ref('')
const p3a = ref('')
const p3b = ref('')
const p3c = ref('')
const journalSticker = ref('✨')
const journalDraft = ref('')

/** 编码：a=1..z=26，空格=0，分隔符 -（F164 前端编码器） */
function encodeCipher() {
  const text = cipherPlain.value.trim().toLowerCase()
  if (!text) return
  const codes: string[] = []
  for (const ch of text) {
    if (ch === ' ') {
      codes.push('0')
    } else {
      const code = ch.charCodeAt(0) - 96
      if (code >= 1 && code <= 26) codes.push(String(code))
    }
  }
  cipherDraft.value = codes.join('-')
  if (!cipherDraft.value) ElMessage.warning('只支持拼音/英文字母哦')
}

/** 解码：数字串还原为字母（本地解码，成功后上报） */
function decodeText(cipher: string): string {
  const chars = cipher.split(/[-\s]+/).map((n) => {
    const v = Number(n)
    if (v === 0) return ' '
    return v >= 1 && v <= 26 ? String.fromCharCode(96 + v) : '?'
  })
  return chars.join('')
}

async function onAddLine() {
  if (!lineDraft.value.trim()) {
    ElMessage.warning('接龙先写一句 🖋️')
    return
  }
  try {
    await couple.addPoemLine(lineDraft.value)
    lineDraft.value = ''
    ElMessage.success('我们的诗又长了一句 🖋️')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '保存失败')
  }
}

async function onSealMorning() {
  if (!morningDraft.value.trim()) {
    ElMessage.warning('醒来第一条先写一句 ☀️')
    return
  }
  try {
    await couple.sealMorningNote(morningDraft.value)
    morningDraft.value = ''
    ElMessage.success('已封存，明早准时送达 🌙')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '封存失败')
  }
}

async function onReadMorning(id: string) {
  try {
    await couple.readMorningNoteItem(id)
    ElMessage.success('已读 ☀️')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '操作失败')
  }
}

async function onTossBottle() {
  if (!bottleMood.value.trim() || !bottleDraft.value.trim()) {
    ElMessage.warning('心情和瓶中信都要写哦')
    return
  }
  try {
    await couple.tossBottle(bottleMood.value, bottleDraft.value)
    bottleMood.value = ''
    bottleDraft.value = ''
    ElMessage.success('已扔进海里，等 TA 捡起 🌊')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '扔瓶失败')
  }
}

async function onReplyBottle(id: string) {
  const reply = bottleReplies[id]?.trim()
  if (!reply) return
  try {
    await couple.replyBottleItem(id, reply)
    bottleReplies[id] = ''
    ElMessage.success('回信已寄回 💌')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '回信失败')
  }
}

async function onMakeCipher() {
  if (!cipherDraft.value.trim()) {
    ElMessage.warning('密码情书先写正文 🔐')
    return
  }
  try {
    await couple.makeCipherNote(cipherDraft.value, cipherHint.value.trim() || undefined)
    cipherDraft.value = ''
    cipherHint.value = ''
    cipherPlain.value = ''
    ElMessage.success('密码情书已藏好，等 TA 解开 💌')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '保存失败')
  }
}

async function onDecode(c: CoupleCipherNoteVO) {
  decodedTexts[c.id] = decodeText(c.cipher)
  try {
    await couple.crackCipherNoteItem(c.id)
    ElMessage.success('解开了！这串数字只属于你们 🔓')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '上报失败')
  }
}

function decodeCipher(c: CoupleCipherNoteVO) {
  void onDecode(c)
}

async function onAnswerSoul() {
  if (!soulDraft.value.trim()) {
    ElMessage.warning('灵魂提问先写一句 💭')
    return
  }
  try {
    await couple.answerSoul(soulDraft.value)
    soulDraft.value = ''
    ElMessage.success('已交卷 🎁')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '提交失败')
  }
}

async function onAddPoem3() {
  if (!p3a.value.trim() || !p3b.value.trim() || !p3c.value.trim()) {
    ElMessage.warning('三行都要写哦')
    return
  }
  try {
    await couple.addPoem3(p3a.value, p3b.value, p3c.value)
    p3a.value = ''
    p3b.value = ''
    p3c.value = ''
    ElMessage.success('三行情书写好了 ✍️')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '保存失败')
  }
}

async function onLikePoem3(id: string) {
  try {
    await couple.likePoem3Item(id)
    ElMessage.success('已点赞 ❤️')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '点赞失败')
  }
}

async function onSaveJournal() {
  if (!journalDraft.value.trim()) {
    ElMessage.warning('手账先写今天的几句 📔')
    return
  }
  try {
    await couple.saveJournalPage(journalSticker.value, journalDraft.value)
    journalDraft.value = ''
    ElMessage.success('今天的一页写好了 📔')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '保存失败')
  }
}

async function onReloadQuote() {
  try {
    await couple.reloadQuote()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '换一句失败')
  }
}

onMounted(async () => {
  try {
    await couple.loadPoem()
  } catch {
    // 未建立空间等场景：静默
  }
})
</script>

<style scoped>
.couple-poem { display: flex; flex-direction: column; gap: 14px; }
.card { background: var(--im-panel-bg, #fff); border-radius: 10px; padding: 14px 16px; border: 1px solid var(--im-border, #ebeef5); }
.title { margin: 0 0 10px; font-size: 15px; color: var(--im-text, #303133); }
.sub { font-size: 12px; color: var(--im-muted, #909399); font-weight: normal; margin-left: 6px; }
.inline-form { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 8px; }
.inline-form .el-input { flex: 1; min-width: 160px; }
.chain-info { margin-bottom: 4px; }
.chain-writer { margin: 0 0 6px; font-size: 13px; color: var(--im-muted, #909399); display: flex; align-items: center; gap: 8px; }
.poem-paper { background: var(--im-bg, #fafafa); border-radius: 8px; padding: 10px 12px; }
.poem-line { margin: 2px 0; font-size: 14px; color: var(--im-text, #303133); line-height: 1.8; }
.poem-day { color: var(--im-muted, #909399); font-size: 11px; margin-right: 8px; }
.poem-by { color: var(--im-muted, #909399); font-size: 11px; margin-left: 6px; }
.poem-empty { margin: 0; font-size: 13px; color: var(--im-muted, #909399); }
.note-delivered { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 6px 0; border-bottom: 1px dashed var(--im-border, #ebeef5); }
.note-day { font-size: 11px; color: var(--im-muted, #909399); }
.note-content { flex: 1; font-size: 13px; color: var(--im-text, #303133); }
.mine-note { margin: 6px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.bottle-item { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 6px 0; border-bottom: 1px dashed var(--im-border, #ebeef5); }
.bottle-head { font-size: 12px; color: var(--im-muted, #909399); }
.bottle-content { flex: 1; font-size: 13px; color: var(--im-text, #303133); }
.bottle-reply { font-size: 12px; color: #f56c6c; }
.bottle-reply-input { width: 160px; }
.cipher-hint { font-size: 12px; color: var(--im-muted, #909399); margin-bottom: 4px; }
.cipher-item { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 6px 0; border-bottom: 1px dashed var(--im-border, #ebeef5); }
.cipher-from { font-size: 12px; color: var(--im-muted, #909399); }
.cipher-text { font-size: 13px; color: var(--im-text, #303133); font-family: monospace; }
.cipher-hint-text { font-size: 11px; color: var(--im-muted, #909399); }
.cipher-plain { font-size: 12px; color: #f56c6c; }
.soul-line { margin: 4px 0; font-size: 13px; color: var(--im-text, #303133); }
.soul-wait { color: var(--im-muted, #909399); }
.poem3-form { display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; }
.poem3-item { padding: 8px 0; border-bottom: 1px dashed var(--im-border, #ebeef5); }
.poem3-lines { margin: 0; font-size: 14px; color: var(--im-text, #303133); line-height: 1.7; }
.poem3-by { font-size: 11px; color: var(--im-muted, #909399); }
.sticker-row { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
.sticker { font-size: 18px; cursor: pointer; padding: 4px 6px; border-radius: 6px; border: 1px solid transparent; }
.sticker:hover { background: var(--im-bg, #fafafa); }
.sticker.active { border-color: #f56c6c; background: var(--el-color-danger-light-9, #fef0f0); }
.journal-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 8px; margin-top: 8px; }
.journal-page { background: var(--im-bg, #fafafa); border-radius: 8px; padding: 8px 10px; display: flex; flex-direction: column; gap: 4px; }
.journal-sticker { font-size: 18px; }
.journal-text { font-size: 13px; color: var(--im-text, #303133); }
.journal-by { font-size: 11px; color: var(--im-muted, #909399); }
.quote-line { margin: 0 0 8px; font-size: 14px; color: #f56c6c; }
.tpl-list { display: flex; flex-direction: column; gap: 8px; margin-top: 10px; }
.tpl-item { background: var(--im-bg, #fafafa); border-radius: 8px; padding: 8px 10px; }
.tpl-title { margin: 0 0 4px; font-size: 13px; font-weight: bold; color: var(--im-text, #303133); display: flex; align-items: center; gap: 6px; }
.tpl-body { margin: 0; font-size: 12px; color: var(--im-muted, #909399); white-space: pre-line; }
</style>

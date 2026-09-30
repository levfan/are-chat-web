<template>
  <div class="keepsake" data-testid="couple-keepsake">
    <!-- F83 甜蜜语录收藏册 -->
    <div class="card" data-testid="couple-quotes">
      <h4 class="title">📔 甜蜜语录收藏册 <span class="sub">甜话会过期，收藏不会</span></h4>
      <div class="form-row">
        <el-input v-model="quoteDraft" maxlength="300" placeholder="TA 说过的（或你们之间的）那句话" data-testid="couple-quote-content" @keyup.enter="onSaveQuote" />
        <el-input v-model="quoteContext" maxlength="100" placeholder="当时的场景（可选）" style="width: 180px" />
        <el-button type="primary" data-testid="couple-quote-save" @click="onSaveQuote">收藏 📔</el-button>
      </div>
      <el-empty v-if="!couple.quotes.length" description="册子还是空的——TA 说过的甜话值得收藏" :image-size="56" />
      <div v-else class="quote-list">
        <div v-for="q in couple.quotes" :key="q.id" class="quote-item" :data-testid="`couple-quote-${q.id}`">
          <p class="quote-content">「{{ q.content }}」</p>
          <div class="quote-meta">
            <span>{{ q.fromUser === auth.username ? '我收藏' : 'TA 收藏' }}</span>
            <span v-if="q.context"> · {{ q.context }}</span>
            <el-button link size="small" type="danger" :data-testid="`couple-quote-remove-${q.id}`" @click="couple.removeQuote(q.id)">删</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- F88 恋爱电影票根 -->
    <div class="card" data-testid="couple-tickets">
      <h4 class="title">🎫 恋爱电影票根 <span class="sub">散场不散，票根为证</span></h4>
      <div class="form-row">
        <el-input v-model="ticketTitle" maxlength="100" placeholder="片名" style="width: 160px" data-testid="couple-ticket-title" />
        <el-date-picker v-model="ticketDay" type="date" value-format="YYYY-MM-DD" placeholder="观看日期" style="width: 150px" data-testid="couple-ticket-day" />
        <el-rate v-model="ticketRating" :max="5" data-testid="couple-ticket-rating" />
        <el-button type="primary" data-testid="couple-ticket-save" @click="onSaveTicket">存票根 🎫</el-button>
      </div>
      <el-input v-model="ticketComment" maxlength="200" placeholder="一句观影感想（可选）" data-testid="couple-ticket-comment" @keyup.enter="onSaveTicket" />
      <el-empty v-if="!couple.tickets.length" description="票根墙还空着——下一场电影记得回来盖章" :image-size="56" />
      <div v-else class="ticket-list">
        <div v-for="t in couple.tickets" :key="t.id" class="ticket-item" :data-testid="`couple-ticket-${t.id}`">
          <div class="ticket-head">
            <span class="ticket-title">{{ t.title }}</span>
            <span class="ticket-stars">{{ '★'.repeat(t.rating) }}{{ '☆'.repeat(5 - t.rating) }}</span>
          </div>
          <div class="ticket-meta">
            <span>{{ t.watchDay }}</span>
            <span v-if="t.comment"> · {{ t.comment }}</span>
            <el-button link size="small" type="danger" :data-testid="`couple-ticket-remove-${t.id}`" @click="couple.removeTicket(t.id)">撕掉</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- F89 我们的歌单 -->
    <div class="card" data-testid="couple-songs">
      <h4 class="title">🎵 我们的歌单 <span class="sub">每首歌都藏着一段我们的故事</span></h4>
      <div class="form-row">
        <el-input v-model="songTitle" maxlength="100" placeholder="歌名" style="width: 140px" data-testid="couple-song-title" />
        <el-input v-model="songArtist" maxlength="50" placeholder="歌手（可选）" style="width: 130px" />
        <el-input v-model="songReason" maxlength="200" placeholder="为什么是我们的歌（可选）" data-testid="couple-song-reason" @keyup.enter="onSaveSong" />
        <el-button type="primary" data-testid="couple-song-save" @click="onSaveSong">加入歌单 🎵</el-button>
      </div>
      <el-empty v-if="!couple.songs.length" description="歌单还是空的——总有一首属于你们" :image-size="56" />
      <div v-else class="song-list">
        <div v-for="s in couple.songs" :key="s.id" class="song-item" :data-testid="`couple-song-${s.id}`">
          <div class="song-head">
            <span class="song-title">{{ s.title }}<span v-if="s.artist" class="song-artist"> — {{ s.artist }}</span></span>
            <el-button link size="small" type="danger" :data-testid="`couple-song-remove-${s.id}`" @click="couple.removeSong(s.id)">移除</el-button>
          </div>
          <p v-if="s.reason" class="song-reason">{{ s.reason }}</p>
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

const quoteDraft = ref('')
const quoteContext = ref('')
const ticketTitle = ref('')
const ticketDay = ref<string | undefined>(undefined)
const ticketRating = ref(5)
const ticketComment = ref('')
const songTitle = ref('')
const songArtist = ref('')
const songReason = ref('')

async function onSaveQuote() {
  const content = quoteDraft.value.trim()
  if (!content) {
    ElMessage.warning('先写下那句话')
    return
  }
  try {
    await couple.saveQuote(content, quoteContext.value.trim() || undefined)
    quoteDraft.value = ''
    quoteContext.value = ''
    ElMessage.success('已收进语录册 📔')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '收藏失败')
  }
}

async function onSaveTicket() {
  const title = ticketTitle.value.trim()
  if (!title) {
    ElMessage.warning('片名不能为空')
    return
  }
  try {
    await couple.saveTicket(title, ticketDay.value, ticketRating.value, ticketComment.value.trim() || undefined)
    ticketTitle.value = ''
    ticketDay.value = undefined
    ticketComment.value = ''
    ticketRating.value = 5
    ElMessage.success('票根已上墙 🎫')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '存票根失败')
  }
}

async function onSaveSong() {
  const title = songTitle.value.trim()
  if (!title) {
    ElMessage.warning('歌名不能为空')
    return
  }
  try {
    await couple.saveSong(title, songArtist.value.trim() || undefined, songReason.value.trim() || undefined)
    songTitle.value = ''
    songArtist.value = ''
    songReason.value = ''
    ElMessage.success('已加入我们的歌单 🎵')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '加入失败')
  }
}

onMounted(() => {
  void couple.loadKeepsake()
})
</script>

<style scoped>
.keepsake {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.card {
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 12px;
  padding: 14px;
}
.title {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 700;
}
.sub {
  margin-left: 6px;
  font-size: 12px;
  font-weight: 400;
  color: var(--im-muted, #8f959e);
}
.form-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}
.quote-list,
.ticket-list,
.song-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}
.quote-item,
.ticket-item,
.song-item {
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  padding: 10px 12px;
}
.quote-content {
  margin: 0 0 4px;
  font-size: 13px;
  word-break: break-all;
}
.quote-meta,
.ticket-meta {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.ticket-head,
.song-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}
.ticket-title,
.song-title {
  font-size: 14px;
  font-weight: 700;
}
.ticket-stars {
  font-size: 12px;
  color: var(--el-color-warning, #e6a23c);
}
.song-artist {
  font-size: 12px;
  font-weight: 400;
  color: var(--im-muted, #8f959e);
}
.song-reason {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
  word-break: break-all;
}
/* 97 窄屏：表单行纵向排列 */
@media (max-width: 520px) {
  .form-row {
    flex-direction: column;
  }
  .form-row .el-input,
  .form-row .el-date-editor {
    width: 100% !important;
  }
}
</style>

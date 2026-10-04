<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { wishApi } from '@/api/couple'
import { useCoupleStore } from '@/stores/couple'
import { useAuthStore } from '@/stores/auth'
import type { CoupleWishBoardVO } from '@/types'
import CoupleCollapsible from './CoupleCollapsible.vue'

/**
 * 愿望清单（卡根 `couple-wish`）：想什么写下来，对方可以**偷偷标记已准备**。
 *
 * 「偷偷」这件事后端已经做完了一半：许愿人那一份的 status 会回显成 OPEN、preparedAt 置 null，
 * 所以前端只吃 status / preparedFlag / preparableFlag / canFulfillFlag / mineFlag 这些位，
 * 绝不拿 preparedAt 反推，也绝不替许愿人露出任何「对方已经备好」的痕迹。
 * 看板由本卡自持（WS 的 wish-* 事件只进铃铛），写接口返回整份看板直接整体替换。
 */
const couple = useCoupleStore()
const auth = useAuthStore()

const board = ref<CoupleWishBoardVO | null>(null)
const title = ref('')
const note = ref('')
const pickedOwner = ref('')
const sending = ref(false)
const noteId = ref('')
const noteText = ref('')

const myName = computed(() => auth.username)
const partnerUsername = computed(() => couple.space?.partner?.username ?? '')
const partnerLabel = computed(() => {
  const p = couple.space?.partner
  return p?.petName || p?.nickname || p?.username || 'TA'
})
/** 没手动选就是「给我自己许」——后端 ownerUser 留空也是这个口径，这里替它填上 */
const owner = computed({
  get: () => pickedOwner.value || myName.value,
  set: (v: string) => {
    pickedOwner.value = v
  },
})

async function refresh() {
  try {
    board.value = await wishApi.wishBoard()
  } catch {
    // 未建空间 404：整卡静默收起，不打扰
    board.value = null
  }
}

/** 六个写口共用：成功就把后端返回的整份看板换掉，失败直透后端中文 */
async function write(call: () => Promise<CoupleWishBoardVO>, done: string, fallback: string) {
  try {
    board.value = await call()
    ElMessage.success(done)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : fallback)
  }
}

async function onAdd() {
  const v = board.value
  if (!v) {
    return
  }
  const t = title.value.trim()
  if (!t) {
    ElMessage.warning('愿望总得写一句呀 🌟')
    return
  }
  if (t.length > v.titleMax) {
    ElMessage.warning(`一条愿望最多 ${v.titleMax} 字`)
    return
  }
  const n = note.value.trim()
  if (n.length > v.noteMax) {
    ElMessage.warning(`补充说明最多 ${v.noteMax} 字`)
    return
  }
  if (v.openCount >= v.limit) {
    ElMessage.warning(`清单最多同时挂 ${v.limit} 条，先实现几条再加吧 ✨`)
    return
  }
  sending.value = true
  await write(() => wishApi.wishAdd(t, n || null, owner.value), '🌟 记进清单了', '加不上这条愿望')
  title.value = ''
  note.value = ''
  sending.value = false
}

function onPrepare(id: string) {
  void write(() => wishApi.wishPrepare(id), '🤫 悄悄备好了，先不惊动 TA', '标记失败')
}

function onUnprepare(id: string) {
  void write(() => wishApi.wishUnprepare(id), '收回来了，接着准备 🎁', '撤销失败')
}

function onFulfill(id: string) {
  void write(() => wishApi.wishFulfill(id), '🎉 这条实现啦，谢谢你俩', '确认实现失败')
}

function onRemove(id: string) {
  void write(() => wishApi.wishRemove(id), '🧹 从清单上划掉了', '删不掉这条')
}

function startNote(id: string, current: string | null) {
  noteId.value = id
  noteText.value = current ?? ''
}

function onSaveNote() {
  const v = board.value
  if (!v) {
    return
  }
  const n = noteText.value.trim()
  if (n.length > v.noteMax) {
    ElMessage.warning(`补充说明最多 ${v.noteMax} 字`)
    return
  }
  const id = noteId.value
  noteId.value = ''
  void write(() => wishApi.wishNote(id, n || null), '📝 说明改好了', '说明没存上')
}

onMounted(() => {
  if (couple.established) {
    void refresh()
  }
})
</script>

<template>
  <CoupleCollapsible class="wish-card" testid="couple-wish" :empty="!board">
    <template #title>
      🌟 愿望清单 <span class="sub">想要的先记下，对方偷偷备</span>
    </template>

    <p v-if="board" class="counts" data-testid="couple-wish-count">
      还挂着 {{ board.openCount }} 条 · 上限 {{ board.limit }} 条 · 标题 {{ board.titleMax }} 字 · 说明 {{ board.noteMax }} 字
    </p>

    <section v-if="board" class="group">
      <h5 class="line-title">🌈 还挂着的</h5>
      <ul v-if="board.open.length" class="list" data-testid="couple-wish-open">
        <li v-for="w in board.open" :key="w.id" class="wish" :data-testid="`couple-wish-${w.id}`">
          <b class="t" :data-testid="`couple-wish-${w.id}-title`">{{ w.title }}</b>
          <em v-if="w.note" class="n">{{ w.note }}</em>
          <span class="who">
            {{ w.mineFlag ? '我的愿望 🙋' : 'TA 的愿望 🫧' }} · {{ w.creatorUser === myName ? '我记下的' : 'TA 记下的' }}
          </span>
          <span class="ops">
            <el-button v-if="w.preparableFlag" link type="warning" size="small"
                       :data-testid="`couple-wish-prepare-${w.id}`" @click="onPrepare(w.id)">
              偷偷标记已准备 🎁
            </el-button>
            <el-button v-if="w.canFulfillFlag" link type="primary" size="small"
                       :data-testid="`couple-wish-fulfill-${w.id}`" @click="onFulfill(w.id)">
              我收到啦 ✅
            </el-button>
            <el-button v-if="w.creatorUser === myName" link size="small"
                       :data-testid="`couple-wish-note-btn-${w.id}`" @click="startNote(w.id, w.note)">
              改说明
            </el-button>
            <el-button v-if="w.creatorUser === myName" link type="danger" size="small"
                       :data-testid="`couple-wish-remove-${w.id}`" @click="onRemove(w.id)">
              划掉
            </el-button>
          </span>
        </li>
      </ul>
      <p v-else class="empty" data-testid="couple-wish-open-empty">清单空空的，先写一条想要的小事吧 🌱</p>
    </section>

    <section v-if="board?.prepared.length" class="group">
      <h5 class="line-title">🤫 已准备（只有点标记的人看得到）</h5>
      <ul class="list kept" data-testid="couple-wish-prepared">
        <li v-for="w in board.prepared" :key="w.id" class="wish" :data-testid="`couple-wish-${w.id}`">
          <b class="t" :data-testid="`couple-wish-${w.id}-title`">{{ w.title }}</b>
          <span class="chip" :data-testid="`couple-wish-${w.id}-kept`">已准备 · 先憋着别说 🤫</span>
          <span class="ops">
            <el-button link size="small" :data-testid="`couple-wish-unprepare-${w.id}`" @click="onUnprepare(w.id)">
              还没备好，撤回 🙈
            </el-button>
          </span>
        </li>
      </ul>
    </section>

    <section v-if="board?.fulfilled.length" class="group">
      <h5 class="line-title">🎉 已经实现的</h5>
      <ul class="list done" data-testid="couple-wish-fulfilled">
        <li v-for="w in board.fulfilled" :key="w.id" class="wish" :data-testid="`couple-wish-${w.id}`">
          <b class="t">{{ w.title }}</b>
          <span class="chip ok" :data-testid="`couple-wish-${w.id}-fulfilled`">实现过 ✅</span>
        </li>
      </ul>
    </section>

    <div v-if="board" class="form">
      <el-input v-model="title" :maxlength="board.titleMax" placeholder="想要的那件事…"
                data-testid="couple-wish-title-input" @keyup.enter="onAdd" />
      <el-input v-model="note" :maxlength="board.noteMax" placeholder="补一句说明（可不填）"
                data-testid="couple-wish-note-input" @keyup.enter="onAdd" />
      <el-radio-group v-model="owner" data-testid="couple-wish-owner">
        <el-radio :value="myName" data-testid="couple-wish-owner-self">给我自己 🙋</el-radio>
        <el-radio v-if="partnerUsername" :value="partnerUsername" data-testid="couple-wish-owner-partner">
          给 {{ partnerLabel }} 💝
        </el-radio>
      </el-radio-group>
      <el-button type="primary" :loading="sending" data-testid="couple-wish-submit" @click="onAdd">
        记一条 🌟
      </el-button>
    </div>

    <div v-if="noteId" class="form">
      <el-input v-model="noteText" :maxlength="board?.noteMax" placeholder="把这条说清楚一点"
                data-testid="couple-wish-note-edit-input" @keyup.enter="onSaveNote" />
      <el-button data-testid="couple-wish-note-edit-submit" @click="onSaveNote">存好 ✍️</el-button>
    </div>
  </CoupleCollapsible>
</template>

<style scoped>
.wish-card { --collapse-title-color: #4338ca; }
.sub { font-weight: normal; font-size: 12px; color: var(--im-muted, #909399); }
.counts { margin: 0 0 8px; font-size: 12px; color: var(--im-muted, #909399); }
.group { margin-top: 8px; }
.line-title { margin: 0 0 6px; font-size: 13px; font-weight: 600; color: #4338ca; }
.list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.wish { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; font-size: 13px;
        border-bottom: 1px dashed var(--im-border, #eee); padding-bottom: 4px; }
.wish .t { color: #4338ca; }
.wish .n { font-size: 12px; color: var(--im-muted, #909399); }
.wish .who { font-size: 12px; color: var(--im-muted, #909399); }
.wish .ops { display: flex; gap: 4px; margin-left: auto; flex-wrap: wrap; }
.wish .chip { font-size: 12px; color: #e6a23c; }
.wish .chip.ok { color: #4338ca; }
.list.kept .wish { background: rgba(67, 56, 202, 0.05); border-radius: 8px; padding: 6px 8px; border-bottom: none; }
.list.done .wish .t { color: var(--im-muted, #909399); text-decoration: line-through; }
.empty { font-size: 13px; color: var(--im-muted, #909399); }
.form { margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
</style>

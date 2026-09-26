import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { ElNotification } from 'element-plus'
import { coupleApi } from '@/api/couple'
import type {
  CoupleAnniversaryVO,
  CoupleCheckinKind,
  CoupleItemKind,
  CoupleItemVO,
  CoupleOverview,
  CouplePromiseVO,
  CoupleQuestionVO,
} from '@/types'

/** 全局监听只绑一次：处理时动态解析当前活跃 pinia 的 store（多实例/测试场景安全） */
let globalListenerBound = false

function bindGlobalListener() {
  if (globalListenerBound) {
    return
  }
  globalListenerBound = true
  window.addEventListener('arechat:couple', ((event: Event) => {
    useCoupleStore().handleCoupleEvent(event)
  }) as EventListener)
}

/**
 * 情侣空间 store：总览/邀请、双向约定、每日仪式、共享清单与日历。
 * WS 推送（type=couple）由 im store 转发为 arechat:couple 自定义事件，这里统一消费：
 * 弹出可爱提醒并按需刷新对应数据。
 */
export const useCoupleStore = defineStore('couple', () => {
  const overview = ref<CoupleOverview | null>(null)
  const promises = ref<CouplePromiseVO[]>([])
  const question = ref<CoupleQuestionVO | null>(null)
  const items = ref<CoupleItemVO[]>([])
  const anniversaries = ref<CoupleAnniversaryVO[]>([])
  /** 各分页数据是否已加载过：WS 事件只刷新已加载过的，避免无谓请求 */
  const loadedLists = ref({ promises: false, question: false, items: false, anniversaries: false })
  /** 聊天「记入约定」带入的草稿：CoupleView 打开承诺弹窗后清空 */
  const promiseDraft = ref<{ content: string; side: 'me' | 'partner' } | null>(null)

  const space = computed(() => overview.value?.space ?? null)
  const established = computed(() => !!space.value)
  /** 收到的全部待处理邀请（新→旧） */
  const incomingInvites = computed(() => overview.value?.incoming ?? [])
  /** 发出的全部待处理邀请（新→旧） */
  const outgoingInvites = computed(() => overview.value?.outgoing ?? [])
  /** 兼容别名：最新一条 */
  const incomingInvite = computed(() => incomingInvites.value[0] ?? null)
  const outgoingInvite = computed(() => outgoingInvites.value[0] ?? null)
  const checkins = computed(() => overview.value?.checkins ?? null)
  const overdueCount = computed(() => overview.value?.overdueCount ?? 0)

  let loading = false

  async function loadOverview() {
    overview.value = await coupleApi.overview()
  }

  /** 登录后由 MainLayout 调用：绑定 WS 事件 + 拉取总览（含邀请红点） */
  async function init() {
    bindGlobalListener()
    if (loading) {
      return
    }
    loading = true
    try {
      await loadOverview()
    } catch {
      // 静默：未登录/网络异常不阻塞布局
    } finally {
      loading = false
    }
  }

  function reset() {
    overview.value = null
    promises.value = []
    question.value = null
    items.value = []
    anniversaries.value = []
    loadedLists.value = { promises: false, question: false, items: false, anniversaries: false }
    promiseDraft.value = null
  }

  // ---------- 建立流程 ----------

  async function invite(username: string, message?: string) {
    const vo = await coupleApi.invite(username, message)
    await loadOverview()
    return vo
  }

  async function acceptInvite(id: string) {
    const vo = await coupleApi.acceptInvite(id)
    await loadOverview()
    return vo
  }

  async function rejectInvite(id: string) {
    await coupleApi.rejectInvite(id)
    await loadOverview()
  }

  async function cancelInvite(id: string) {
    await coupleApi.cancelInvite(id)
    await loadOverview()
  }

  async function setAnniversary(date: string) {
    const vo = await coupleApi.setAnniversary(date)
    if (overview.value) {
      overview.value.space = vo
    }
    return vo
  }

  async function dissolve() {
    await coupleApi.dissolve()
    reset()
    await loadOverview()
  }

  // ---------- 双向待办 / 约定 ----------

  async function loadPromises() {
    promises.value = (await coupleApi.promises()) ?? []
    loadedLists.value.promises = true
  }

  async function createPromise(side: 'me' | 'partner', content: string, dueAt?: number | null) {
    const vo = await coupleApi.createPromise(side, content, dueAt)
    await Promise.all([loadPromises(), loadOverview()])
    return vo
  }

  async function donePromise(id: string) {
    const vo = await coupleApi.donePromise(id)
    await Promise.all([loadPromises(), loadOverview()])
    return vo
  }

  async function undonePromise(id: string) {
    const vo = await coupleApi.undonePromise(id)
    await Promise.all([loadPromises(), loadOverview()])
    return vo
  }

  async function deletePromise(id: string) {
    await coupleApi.deletePromise(id)
    await Promise.all([loadPromises(), loadOverview()])
  }

  // ---------- 每日小仪式 ----------

  async function checkin(kind: CoupleCheckinKind) {
    const state = await coupleApi.checkin(kind)
    if (overview.value) {
      overview.value.checkins = state
    }
    return state
  }

  async function loadQuestion() {
    question.value = await coupleApi.question()
    loadedLists.value.question = true
  }

  async function answerQuestion(answer: string) {
    const vo = await coupleApi.answerQuestion(answer)
    question.value = vo
    return vo
  }

  // ---------- 共享空间 ----------

  async function loadItems() {
    items.value = (await coupleApi.items()) ?? []
    loadedLists.value.items = true
  }

  async function createItem(body: { kind: CoupleItemKind; title: string; note?: string; dueDate?: string | null }) {
    const vo = await coupleApi.createItem(body)
    await loadItems()
    return vo
  }

  async function updateItem(id: string, body: { title?: string; note?: string; dueDate?: string | null; done?: boolean }) {
    const vo = await coupleApi.updateItem(id, body)
    await loadItems()
    return vo
  }

  async function deleteItem(id: string) {
    await coupleApi.deleteItem(id)
    await loadItems()
  }

  async function loadAnniversaries() {
    anniversaries.value = (await coupleApi.anniversaries()) ?? []
    loadedLists.value.anniversaries = true
  }

  async function createAnniversary(body: { title: string; date: string; yearly: boolean }) {
    const vo = await coupleApi.createAnniversary(body)
    await loadAnniversaries()
    return vo
  }

  async function deleteAnniversary(id: string) {
    await coupleApi.deleteAnniversary(id)
    await loadAnniversaries()
  }

  // ---------- WS 推送消费 ----------

  function notify(title: string, message: string) {
    ElNotification({ title, message, duration: 8000, position: 'top-right' })
  }

  /** 处理一条情侣空间推送：弹提醒 + 按需刷新对应数据 */
  function handleCoupleEvent(event: Event) {
    const msg = (event as CustomEvent<{ event: string; username: string; detail: string }>).detail
    if (!msg?.event) {
      return
    }
    switch (msg.event) {
      case 'invite':
        notify('💕 情侣邀请', msg.detail)
        void loadOverview()
        break
      case 'invite-accepted':
        notify('🎉 情侣空间开启', msg.detail)
        void loadOverview()
        break
      case 'invite-rejected':
        notify('💔 邀请被婉拒', msg.detail)
        void loadOverview()
        break
      case 'dissolved':
        notify('😢 情侣空间解除', msg.detail)
        reset()
        void loadOverview()
        break
      case 'promise-created':
      case 'promise-done':
      case 'promise-undone':
      case 'promise-deleted':
      case 'promise-overdue':
        notify('💕 甜蜜约定', msg.detail)
        if (loadedLists.value.promises) {
          void loadPromises()
        }
        void loadOverview()
        break
      case 'checkin':
        notify('🌅 每日仪式', msg.detail)
        void loadOverview()
        break
      case 'ritual-unlocked':
        notify('🎉 仪式达成', msg.detail)
        void loadOverview()
        break
      case 'question-answered':
        notify('💬 今日一问', msg.detail)
        if (loadedLists.value.question) {
          void loadQuestion()
        }
        break
      case 'items-changed':
        notify('✨ 共享清单', msg.detail)
        if (loadedLists.value.items) {
          void loadItems()
        }
        break
      case 'anniversaries-changed':
      case 'anniversary-updated':
        notify('📅 共同日历', msg.detail)
        if (loadedLists.value.anniversaries) {
          void loadAnniversaries()
        }
        void loadOverview()
        break
      default:
        break
    }
  }

  return {
    overview,
    promises,
    question,
    items,
    anniversaries,
    promiseDraft,
    space,
    established,
    incomingInvites,
    outgoingInvites,
    incomingInvite,
    outgoingInvite,
    checkins,
    overdueCount,
    init,
    reset,
    loadOverview,
    handleCoupleEvent,
    invite,
    acceptInvite,
    rejectInvite,
    cancelInvite,
    setAnniversary,
    dissolve,
    loadPromises,
    createPromise,
    donePromise,
    undonePromise,
    deletePromise,
    checkin,
    loadQuestion,
    answerQuestion,
    loadItems,
    createItem,
    updateItem,
    deleteItem,
    loadAnniversaries,
    createAnniversary,
    deleteAnniversary,
  }
})

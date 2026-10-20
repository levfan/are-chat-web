import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import { coupleApi } from '@/api/couple'
import type { CoupleInviteVO, CoupleOverview } from '@/types'

/**
 * 情侣空间 store（三轮裁剪后只剩地基）。
 *
 * 留在这里的只有总览与邀请那棵树：它要在 MainLayout 初始化、CoupleView 展示、侧栏角标计数，
 * 是真正的跨页状态。亲密日历由组件自持、不进 store——只有一张卡读它，也没有 WS 事件要刷新它，
 * 放进 store 只会多一份没人管的真相。
 * 已下线的域（每日一问 / 连续打卡与解锁 / 愿望清单 / 心动值 / 空间个性化）不再留壳：
 * 后端既没有端点，也没有 WS 生产者，留一个空 ref 只会让人以为还有数据。
 *
 * WS 推送（type=couple）由 im store 转成 `arechat:couple` 自定义事件，这里统一消费。
 */

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

export const useCoupleStore = defineStore('couple', () => {
  const overview = ref<CoupleOverview | null>(null)

  const space = computed(() => overview.value?.space ?? null)
  const established = computed(() => !!space.value)
  const incomingInvites = computed<CoupleInviteVO[]>(() => overview.value?.incoming ?? [])
  const outgoingInvites = computed<CoupleInviteVO[]>(() => overview.value?.outgoing ?? [])

  function notify(title: string, message: string) {
    ElNotification({ title, message, duration: 8000, position: 'top-right' })
  }

  async function loadOverview() {
    overview.value = await coupleApi.overview()
  }

  async function init() {
    bindGlobalListener()
    try {
      await loadOverview()
    } catch {
      overview.value = null
    }
  }

  async function invite(username: string, message?: string) {
    await coupleApi.invite(username, message)
    ElMessage.success('邀请已送出，等 TA 点头 💕')
    await loadOverview()
  }

  async function acceptInvite(id: string) {
    await coupleApi.acceptInvite(id)
    ElMessage.success('从今天起，这里是我们两个人的小天地 🎉')
    await loadOverview()
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
    await coupleApi.setAnniversary(date)
    ElMessage.success('在一起的日子记下了 📅')
    await loadOverview()
  }

  async function dissolve() {
    await coupleApi.dissolve()
    reset()
    await loadOverview()
  }

  /** 处理一条情侣空间推送：弹提醒 + 按需重拉总览 */
  function handleCoupleEvent(event: Event) {
    const msg = (event as CustomEvent<{ event: string; username: string; detail: string }>).detail
    if (!msg?.event) {
      return
    }
    const e = msg.event
    if (e === 'invite' || e === 'invite-accepted' || e === 'invite-rejected' || e === 'anniversary-updated') {
      notify('💕 情侣空间', msg.detail)
      void loadOverview()
      return
    }
    if (e === 'dissolved') {
      notify('😢 情侣空间解除', msg.detail)
      reset()
      void loadOverview()
      return
    }
    // 纪念日倒数由定时任务发，只弹提醒，不动数据
    if (e === 'anniversary-reminder') {
      notify('📅 我们的日子', msg.detail)
      return
    }
    // 其余事件（已下线卡片的老推送）不再认识：不发请求、不弹提醒
  }

  function reset() {
    overview.value = null
  }

  return {
    overview,
    space,
    established,
    incomingInvites,
    outgoingInvites,
    init,
    loadOverview,
    invite,
    acceptInvite,
    rejectInvite,
    cancelInvite,
    setAnniversary,
    dissolve,
    handleCoupleEvent,
    reset,
  }
})

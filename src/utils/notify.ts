/** 45 桌面通知：页面不可见时收到新消息弹系统通知，点击通知聚焦窗口。 */

import { isQuietNow } from './settings'

const NOTIFY_KEY = 'arechat.notify'

export function notificationsSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window
}

/** 是否开启桌面通知（默认关） */
export function notificationEnabled(): boolean {
  try {
    return localStorage.getItem(NOTIFY_KEY) === 'on' && notificationsSupported()
  } catch {
    return false
  }
}

/** 开关桌面通知；首次开启时申请权限，返回最终是否生效 */
export async function setNotificationEnabled(enabled: boolean): Promise<boolean> {
  try {
    localStorage.setItem(NOTIFY_KEY, enabled ? 'on' : 'off')
  } catch {
    // 忽略
  }
  if (!enabled || !notificationsSupported()) {
    return false
  }
  if (Notification.permission === 'granted') {
    return true
  }
  if (Notification.permission === 'denied') {
    return false
  }
  try {
    return (await Notification.requestPermission()) === 'granted'
  } catch {
    return false
  }
}

export interface NotifyPayload {
  title: string
  body: string
  /** 点击通知时希望打开的会话（好友用户名） */
  peer?: string
}

/** 弹出桌面通知；未授权/页面可见/免打扰时段时静默跳过。点击时派发 arechat:open-peer 事件 */
export function showNotification(payload: NotifyPayload): void {
  if (!document.hidden || !notificationEnabled() || Notification.permission !== 'granted') {
    return
  }
  // 91 免打扰时段：系统通知静音
  if (isQuietNow()) {
    return
  }
  try {
    const notification = new Notification(payload.title, {
      body: payload.body,
      tag: `arechat-${payload.peer ?? 'dm'}`,
    })
    notification.onclick = () => {
      window.focus()
      if (payload.peer) {
        window.dispatchEvent(new CustomEvent('arechat:open-peer', { detail: payload.peer }))
      }
      notification.close()
    }
  } catch {
    // 部分环境构造 Notification 会抛错，静默忽略
  }
}

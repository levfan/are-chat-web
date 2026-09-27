import { ref } from 'vue'

/**
 * PWA 安装能力（98）：
 * - beforeinstallprompt 事件由浏览器在「站点可安装」时派发，捕获后可由应用内按钮触发安装；
 * - appinstalled / display-mode 变化用于刷新「已安装」状态；
 * - iOS Safari 不派发 beforeinstallprompt，只能引导用户手动「分享 → 添加到主屏幕」。
 */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let deferredPrompt: BeforeInstallPromptEvent | null = null

/** 浏览器当前是否允许应用内一键安装 */
export const pwaInstallable = ref(false)

/** 是否已以独立窗口（安装后的 App 形态）运行 */
export const pwaStandalone = ref(false)

export function isStandalone(): boolean {
  const nav = navigator as Navigator & { standalone?: boolean }
  if (nav.standalone === true) {
    return true
  }
  return typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)').matches
}

/** iOS Safari / 微信等不支持的客户端：只展示引导，不给一键安装按钮 */
export function isIOS(): boolean {
  const ua = navigator.userAgent
  return /iP(hone|ad|od)/.test(ua) || (/Macintosh/.test(ua) && /Mobile/.test(ua))
}

/** 当前页面是否为安全上下文（HTTPS / localhost）：HTTP 下浏览器禁用 SW 与一键安装能力 */
export function isSecure(): boolean {
  return typeof window !== 'undefined' && window.isSecureContext === true
}

function refreshStandalone() {
  pwaStandalone.value = isStandalone()
  if (pwaStandalone.value) {
    deferredPrompt = null
    pwaInstallable.value = false
  }
}

/** 应用入口调用一次：绑定安装相关事件 */
export function initPwa(): void {
  refreshStandalone()
  window.addEventListener('beforeinstallprompt', (event) => {
    // 阻止浏览器默认的迷你横幅，改为由应用内「添加到桌面」按钮触发
    event.preventDefault()
    deferredPrompt = event as BeforeInstallPromptEvent
    pwaInstallable.value = true
  })
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null
    pwaInstallable.value = false
    refreshStandalone()
  })
  // 用户从独立窗口切换回浏览器标签页等场景
  if (typeof window.matchMedia === 'function') {
    window.matchMedia('(display-mode: standalone)').addEventListener('change', refreshStandalone)
  }
}

/** 触发系统安装框：accepted=已安装，dismissed=用户取消，unavailable=当前不可用 */
export async function promptInstall(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
  if (!deferredPrompt) {
    return 'unavailable'
  }
  try {
    await deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice
    if (choice.outcome === 'accepted') {
      deferredPrompt = null
      pwaInstallable.value = false
    }
    return choice.outcome
  } catch {
    return 'unavailable'
  }
}

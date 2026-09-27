/** favicon 未读角标（42）：canvas 画一个带数字的圆形角标替换站点图标。 */

let defaultHref: string | null = null

function ensureLink(): HTMLLinkElement | null {
  if (typeof document === 'undefined') {
    return null
  }
  let link = document.querySelector<HTMLLinkElement>("link[rel*='icon']")
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }
  return link
}

function drawBadge(count: number, accent: string): string {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return ''
  }
  ctx.fillStyle = accent
  ctx.beginPath()
  ctx.arc(32, 32, 30, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 30px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(count > 99 ? '99+' : String(count), 32, 34)
  return canvas.toDataURL('image/png')
}

export function updateFaviconBadge(count: number, accent = '#ec5f92') {
  const link = ensureLink()
  if (!link) {
    return
  }
  if (defaultHref === null) {
    defaultHref = link.getAttribute('href') ?? ''
  }
  if (count <= 0) {
    link.href = defaultHref
    return
  }
  const data = drawBadge(count, accent)
  if (data) {
    link.href = data
  }
}

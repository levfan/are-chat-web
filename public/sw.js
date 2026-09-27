/* are-chat 离线壳（98）：
 * - 预缓存应用骨架（index.html / manifest / 图标），断网或弱网时仍能打开界面；
 * - 页面导航请求走 network-first，失败回落缓存的 index.html（SPA 前端路由全靠它）；
 * - 同源静态资源 cache-first + 后台静默更新；
 * - 永远不拦截 /api 与 WebSocket（/upstream 由框架代理），聊天数据必须在线。
 */
const CACHE = 'arechat-v1'
const CORE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-180.png',
  '/icons/icon-maskable-512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(CORE))
      .then(() => self.skipWaiting())
      .catch(() => {}),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') {
    return
  }
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) {
    return
  }
  // 聊天接口与 WebSocket 永远直连网络
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/ws')) {
    return
  }
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches
            .open(CACHE)
            .then((cache) => cache.put('/index.html', copy))
            .catch(() => {})
          return response
        })
        .catch(() => caches.match('/index.html')),
    )
    return
  }
  event.respondWith(
    caches.match(request).then((hit) => {
      if (hit) {
        // 后台静默更新，下次生效
        fetch(request)
          .then((response) => {
            if (response && response.ok) {
              caches
                .open(CACHE)
                .then((cache) => cache.put(request, response))
                .catch(() => {})
            }
          })
          .catch(() => {})
        return hit
      }
      return fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone()
            caches
              .open(CACHE)
              .then((cache) => cache.put(request, copy))
              .catch(() => {})
          }
          return response
        })
        .catch(() => hit)
    }),
  )
})

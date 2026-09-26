import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { title: '登录' },
    },
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      redirect: '/chat',
      children: [
        {
          path: 'chat',
          name: 'chat',
          component: () => import('@/views/ChatView.vue'),
          meta: { title: '消息', requiresAuth: true },
        },
        {
          // 好友菜单已下线：旧链接 /friends 统一落到通讯录（添加好友/申请处理都在通讯录）
          path: 'friends',
          redirect: '/contacts',
        },
        {
          path: 'contacts',
          name: 'contacts',
          component: () => import('@/views/ContactsView.vue'),
          meta: { title: '通讯录', requiresAuth: true },
        },
        {
          // 情侣空间：未建立时指引建立；建立后展示约定/小仪式/共享空间
          path: 'couple',
          name: 'couple',
          component: () => import('@/views/CoupleView.vue'),
          meta: { title: '情侣空间', requiresAuth: true },
        },
        {
          path: 'admin',
          name: 'admin',
          component: () => import('@/views/AdminView.vue'),
          meta: { title: '管理后台', requiresAuth: true, requiresAdmin: true },
        },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.name === 'login' && auth.isLoggedIn) {
    return { name: 'chat' }
  }
  // 79 管理后台仅 ADMIN 可入；刷新后角色需要从服务端重新确认
  if (to.meta.requiresAdmin) {
    if (!auth.isAdmin) {
      await auth.verify()
    }
    if (!auth.isAdmin) {
      return { name: 'chat' }
    }
  }
  return true
})

router.afterEach((to) => {
  document.title = `${to.meta.title ?? 'are-chat'} · are-chat`
})

export default router

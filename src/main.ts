import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'element-plus/theme-chalk/dark/css-vars.css'
// 命令式 API（ElMessage / ElMessageBox）在业务代码里是手动 import 的，不会经过
// unplugin 按需样式的 resolver 注入，模板里也没有 <el-message-box> 这类用法，
// 不补这两行的话弹窗与顶部提示会以裸 DOM 渲染（无卡片/无居中，样式错乱）。
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/message-box/style/css'
import 'element-plus/es/components/notification/style/css'
import './style.css'
import { initTheme } from './utils/theme'
import { applyAppearance } from './utils/settings'
import { initPwa } from './utils/pwa'

initTheme()
// 39/40 强调色与字号持久化外观
applyAppearance()
// 全站确认/提示/输入框默认可拖拽（动态加载补丁，ElMessageBox 代码本身已被各视图静态引用，无额外首屏体积）
import('./utils/draggable-message-box')
// 98 PWA 安装事件捕获（应用内「添加到桌面」按钮依赖它）
initPwa()
// 98 离线壳：仅生产环境注册 Service Worker（开发模式热更新不受干扰）
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')

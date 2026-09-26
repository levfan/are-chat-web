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

initTheme()
// 39/40 强调色与字号持久化外观
applyAppearance()

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')

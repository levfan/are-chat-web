import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'element-plus/theme-chalk/dark/css-vars.css'
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

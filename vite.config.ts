import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// 后端地址可用环境变量覆盖（默认本地 8080），方便换端口联调
const apiTarget = process.env.VITE_API_TARGET ?? 'http://localhost:8080'
const wsTarget = process.env.VITE_WS_TARGET ?? apiTarget.replace(/^http/, 'ws')

// 100 版本信息：版本号取自 package.json，构建时间取构建时刻（登录页与个人中心展示，无需手工维护时间）
const pkg = JSON.parse(readFileSync(fileURLToPath(new URL('./package.json', import.meta.url)), 'utf-8')) as {
  version?: string
}
const now = new Date()
const pad = (n: number) => String(n).padStart(2, '0')
const buildTimeText = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version ?? 'dev'),
    __BUILD_TIME__: JSON.stringify(buildTimeText),
  },
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      resolvers: [ElementPlusResolver()],
      dts: 'src/auto-imports.d.ts',
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/components.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // host=true 监听 0.0.0.0：局域网用户可通过 http://<本机IP>:5173 访问（默认仅 localhost）
    host: true,
    port: 5173,
    // 编辑器/工具写文件时会生成 *.tmpdir 临时目录，watcher 监听到它会 EBUSY 崩溃
    watch: {
      ignored: ['**/node_modules/**', '**/.git/**', '**/*.tmpdir/**', '**/.*.tmpdir/**'],
    },
    proxy: {
      '/api': { target: apiTarget, changeOrigin: true },
      '/ws': { target: wsTarget, ws: true },
    },
  },
  // 生产构建本地预览（vite preview）同样开放局域网访问
  preview: {
    host: true,
    port: 4173,
  },
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.spec.ts'],
    setupFiles: ['vitest.setup.ts'],
    // 整页挂载用例（CoupleView 全组件树）成本随批次增长，默认 5s 已不够
    testTimeout: 20000,
    // 让 element-plus 的样式导入走 Vite 转换（否则 Node 原生 ESM 无法加载 .css）
    css: true,
    server: {
      deps: {
        inline: ['element-plus'],
      },
    },
  },
})

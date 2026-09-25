import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// 后端地址可用环境变量覆盖（默认本地 8080），方便换端口联调
const apiTarget = process.env.VITE_API_TARGET ?? 'http://localhost:8080'
const wsTarget = process.env.VITE_WS_TARGET ?? apiTarget.replace(/^http/, 'ws')

export default defineConfig({
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
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.spec.ts'],
    setupFiles: ['vitest.setup.ts'],
    // 让 element-plus 的样式导入走 Vite 转换（否则 Node 原生 ESM 无法加载 .css）
    css: true,
    server: {
      deps: {
        inline: ['element-plus'],
      },
    },
  },
})

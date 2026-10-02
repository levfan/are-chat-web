# 架构总览

> 本页回答：用什么技术栈、怎么启动/构建/测试、目录长什么样、HTTP 封装与 api 分组对象怎么写、数据放 store 还是放组件。

## 技术栈

| 层 | 选型 | 备注 |
|---|---|---|
| 框架 | Vue 3.5，全部组件 `<script setup lang="ts">` | 组件普遍带 `data-testid`（单测/e2e 依赖） |
| 构建 | Vite 8（Rolldown 打包内核，替代 Rollup+esbuild；`vite.config.ts` 同时是 Vitest 配置入口） | `unplugin-auto-import` + `unplugin-vue-components` 自动导入 vue/vue-router/pinia 与 Element Plus，生成 `src/auto-imports.d.ts`、`src/components.d.ts` |
| 状态 | Pinia 4，setup-store 风格（`defineStore('xxx', () => {...})`） | 见 [状态管理](state-management.md) |
| 路由 | Vue Router 5，history 模式 | 见 [页面与路由](pages-routing.md) |
| UI | Element Plus 2.14（主题色 `#f56c6c`，暗色跟随 `var(--im-muted)` 等 CSS 变量） | 图标 `@element-plus/icons-vue` |
| 语言 | TypeScript 6.0，类型集中在 `src/types/index.ts`（按域分节） | `pnpm build` 跑 `vue-tsc --noEmit`。TS 7 不再导出 `typescript/lib/tsc`，vue-tsc 直接 `ERR_PACKAGE_PATH_NOT_EXPORTED`；其官方桥接 `"typescript": "npm:@typescript/typescript6"` 实测只是让它转装 `typescript@^6`（仍解析到 6.0.3），拿不到 TS 7 编译器，故钉 6.0 并直装 typescript 即可。TS 8 尚未发布 |
| 测试 | Vitest 5 + @vue/test-utils + jsdom | 见 [测试](testing.md)；另有 `@playwright/test` 依赖与 `playwright.config.ts`（testDir 指向 `./e2e`，当前仓库无 e2e 用例） |
| 数据获取 | 原生 `fetch` 自封装（`src/api/http.ts`），无 axios | WS 用原生 `WebSocket`（im store 管理） |

## 命令（package.json scripts）

| 命令 | 作用 |
|---|---|
| `pnpm dev` | Vite dev server，端口 5173，`host: true`（局域网可访）；`/api` 代理到 `http://localhost:8080`（可用 `VITE_API_TARGET` 覆盖），`/ws` 走 ws 代理（`VITE_WS_TARGET`） |
| `pnpm build` | `vite build && vue-tsc --noEmit`（类型检查是构建的一部分） |
| `pnpm preview` | 生产构建预览，端口 4173 |
| `pnpm typecheck` | 仅 `vue-tsc --noEmit` |
| `pnpm test` / `pnpm test:watch` | Vitest 单次 / watch |
| `pnpm test:e2e` | Playwright（当前无用例目录） |

版本号经 `define` 注入：`__APP_VERSION__`（读 package.json）与 `__BUILD_TIME__`（构建时刻），供登录页/个人中心展示。

## 目录地图（src/）

| 目录/文件 | 职责 |
|---|---|
| `api/` | 接口层：`http.ts` 封装 + `auth.ts`/`im.ts`/`couple.ts`/`files.ts`/`system.ts` 分组对象 |
| `stores/` | Pinia：`auth.ts`、`im.ts`、`couple.ts` 三个 store |
| `views/` | 5 个页面：Login/Chat/Contacts/Couple/Admin |
| `layouts/MainLayout.vue` | 登录后壳：侧栏导航、WS 状态、调用 `im.init`/`couple.init`，登出时 `reset` |
| `router/index.ts` | 路由表 + 守卫（requiresAuth / requiresAdmin）+ 页签标题 |
| `components/couple/` | 情侣空间 50 个组件（清单见 [页面与路由](pages-routing.md)） |
| `components/im/` | 聊天组件 8 个：`ImAvatar`/`MessageBubble`/`EmojiPicker`/`GlobalSearchPanel`/`ImageLightbox`/`NewMessageToast`/`ProfileDialog`/`PwaInstallGuide` |
| `types/index.ts` | 全部 TS 类型（约 2500 行，情侣 VO 在专属区块） |
| `utils/` | `coupleTheme.ts`（早晚安解锁主题/贴纸）、`effects.ts`（彩蛋指令）、`format.ts`、`sound.ts`、`notify.ts`、`pwa.ts`、`image.ts`、`settings.ts`、`theme.ts`、`favicon.ts`、`draggable-message-box.ts` |
| `constants.ts` / `main.ts` / `style.css` / `App.vue` | 常量（如 `CURRENT_USER_KEY`、`APP_NAME`）与入口全局样式 |
| `tests/unit/` | 7 个 Vitest spec 文件 |

## http.ts 封装

`src/api/http.ts` 导出 `ApiError`（携带 `code`，message 直接用后端中文文案）与 `http` 对象：

- `http.get<T>(url)` / `http.postJson<T>(url, body)` / `http.putJson<T>(url, body)` / `http.delete<T>(url)` / `http.postForm<T>(url, form)`（FormData 上传）
- 统一 `credentials: 'same-origin'`；响应约定 `{ code, message, data }`，`code !== 0` 或 HTTP 非 2xx 即抛 `ApiError`；`code === 401` 时顺带清 `sessionStorage` 登录态；成功只返回 `body.data`
- 业务层错误处理惯例：`ElMessage.error(e instanceof Error ? e.message : '兜底文案')`

## api 分组对象模式

每个域的 api 文件导出一或多个**分组对象**（不是零散函数），方法即箭头属性、带中文注释，URL 硬编码在方法体内：

- `api/auth.ts` → `authApi`（登录/短信/注册申请/登出/me/改密/注销）、`adminApi`（审批/公告/待办数）
- `api/im.ts` → `friendApi`、`messageApi`、`starsApi`、`profileApi`、`presenceApi`
- `api/files.ts` → `filesApi`；`api/system.ts` → `presenceApi`/`systemApi`/`announcementApi`
- `api/couple.ts` → **`coupleApi`**（主体，基址 `/api/couple`）、**`manageApi`**（F180-F189 生活经营，`/api/couple/manage`）、**`museumApi`**（F190-F199 时光博物馆，`/api/couple/museum`）、**`pinApi`**（F207 常用收藏，`/api/couple/pin`）四个并列对象

新接口按批次归属加进对应对象；独立功能批次（如 manage/museum）倾向新开分组对象而非继续膨胀 `coupleApi`。全量方法表见 [API 层](api-layer.md)。

## 数据放哪：store 模式 vs 组件自持模式

| 模式 | 用法 | 适用 | 例子 |
|---|---|---|---|
| **couple store 集中式** | 状态 ref + `loadXxx`/操作函数进 `stores/couple.ts`，登记 `loadedLists` 键，`handleCoupleEvent` 加 case，`reset()` 清理，return 导出 | 需要 **WS 事件驱动提醒/刷新**、跨组件共享（头部心动值、通知红点、`?tab=` 定位等）的数据 | 绝大多数：promises/moods/bond/ritual/growth/secure/play/spark… |
| **组件自持数据** | 组件内 `onMounted` 并发拉取 api，状态留在组件里，不进 store、不接 WS 事件 | 纯拉取展示、无实时联动需求、避免 store 继续膨胀的**新批次** | `CoupleManage.vue`（manageApi）、`CoupleMuseum.vue`（museumApi，未建空间静默降级） |

取舍逻辑：store 已超 3400 行，新批次若没有跨页签/事件联动需求，优先组件自持；一旦需要 `arechat:couple` 刷新或全局提醒，再迁移进 store（走 map skill 的「新功能标准链路」）。

---

下一页：[页面与路由](pages-routing.md)

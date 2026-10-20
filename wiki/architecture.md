# 架构总览

> 本页回答：用什么技术栈、怎么启动/构建/测试、目录长什么样、HTTP 封装与 api 分组对象怎么写、数据放 store 还是放组件。

## 技术栈

| 层 | 选型 | 备注 |
|---|---|---|
| 框架 | Vue 3.5，全部组件 `<script setup lang="ts">` | 组件普遍带 `data-testid`（单测/e2e 依赖） |
| 构建 | Vite 8（Rolldown 打包内核，替代 Rollup+esbuild；`vite.config.ts` 同时是 Vitest 配置入口） | `unplugin-auto-import` + `unplugin-vue-components` 自动导入 vue/vue-router/pinia 与 Element Plus，生成 `src/auto-imports.d.ts`、`src/components.d.ts` |
| 状态 | Pinia 4，setup-store 风格（`defineStore('xxx', () => {...})`） | 见 [状态管理](state-management.md) |
| 路由 | Vue Router 5，history 模式 | 见 [页面与路由](pages-routing.md) |
| UI | Element Plus 2.14（主题色 `#0ea5e9` 电光青，暗色跟随 `var(--im-muted)` 等 CSS 变量） | 图标 `@element-plus/icons-vue`；样式令牌见下节 |
| 语言 | TypeScript 6.0，类型集中在 `src/types/index.ts`（按域分节） | `pnpm build` 跑 `vue-tsc --noEmit`。**6.0 是当前上限**：TS 7 不再导出 `typescript/lib/tsc`，vue-tsc 会 `ERR_PACKAGE_PATH_NOT_EXPORTED`；官方桥接包 `@typescript/typescript6` 也只是转装 `typescript@^6`，同样拿不到 TS 7 编译器。等 vuejs/language-tools 适配后再升 |
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
| `components/couple/` | 情侣空间 3 个组件 = 1 张卡（`CoupleCalendar`，经期/亲密的唯一记录入口）+ `CoupleSetup`（未建空间整页替代）+ `CoupleCollapsible` 卡壳；原 `coupleCards.registry.ts` 卡索引表只剩一张卡、失去对象，随三轮裁剪删除（`?card=` 深链与 e2e-live 巡检的覆盖率核对一起没了；清单见 [页面与路由](pages-routing.md)） |
| `components/im/` | 聊天组件 5 个：`ImAvatar`/`MessageBubble`/`EmojiPicker`/`ImageLightbox`/`ProfileDialog` |
| `types/index.ts` | 全部 TS 类型（1420 行，情侣 VO 在专属区块；三轮裁剪又删掉心动值/打卡看板/每日一问/愿望清单/主题等 10 个作废类型，`CoupleSpaceVO` 去掉 `slogan`/`theme`、`CouplePartnerVO` 去掉 `petName`） |
| `utils/` | `effects.ts`（彩蛋指令）、`format.ts`、`imFormat.ts`、`sound.ts`、`notify.ts`、`image.ts`、`settings.ts`、`theme.ts`、`favicon.ts`、`draggable-message-box.ts`；`coupleVisual.ts`（打卡档位驱动的聊天侧解锁外观）与 `coupleRecordBus.ts`（记录卡 → 日历卡的本页刷新信号）都随三轮裁剪删除——前者没了档位来源，后者合并成一张卡后同组件内部不需要跨卡通知 |
| `constants.ts` / `main.ts` / `style.css` / `App.vue` | 常量（如 `CURRENT_USER_KEY`、`APP_NAME`）与入口全局样式 |
| `tests/unit/` | 9 个 Vitest spec 文件（96 用例基线，见 [测试](testing.md)） |

## http.ts 封装

`src/api/http.ts` 导出 `ApiError`（携带 `code`，message 直接用后端中文文案）与 `http` 对象：

- `http.get<T>(url)` / `http.postJson<T>(url, body)` / `http.putJson<T>(url, body)` / `http.delete<T>(url)` / `http.postForm<T>(url, form)`（FormData 上传）
- 统一 `credentials: 'same-origin'`；响应约定 `{ code, message, data }`，`code !== 0` 或 HTTP 非 2xx 即抛 `ApiError`；`code === 401` 时顺带清 `sessionStorage` 登录态；成功只返回 `body.data`
- 业务层错误处理惯例：`ElMessage.error(e instanceof Error ? e.message : '兜底文案')`

## api 分组对象模式

每个域的 api 文件导出一或多个**分组对象**（不是零散函数），方法即箭头属性、带中文注释，URL 硬编码在方法体内：

- `api/auth.ts` → `authApi`（登录/短信/注册申请/登出/me/改密/注销）、`adminApi`（审批/公告/待办数）
- `api/im.ts` → `friendApi`、`messageApi`、`profileApi`、`presenceApi`
- `api/files.ts` → `filesApi`；`api/system.ts` → `presenceApi`/`systemApi`/`announcementApi`
- `api/couple.ts`（74 行）→ **4 个并列对象**：**`coupleApi`**（8 个方法，空间地基：总览/邀请四连/纪念日/解除 + `relationshipOf` 恋爱徽章）、**`periodApi`**（3，经期写口：记开始日/补结束日/删错记）、**`intimateApi`**（2，亲密写口：记一笔/删一条）、**`calendarApi`**（1，亲密日历的月度读口，也是唯一的记录展示口），合计 14 个方法与后端存活端点一一对应。已下线的 `streakApi`/`questionApi`/`wishApi` 三个分组与 `coupleApi.updateProfile`/`coupleApi.intimacy` 不得再写回来

新接口按批次归属加进对应对象；独立功能域倾向新开分组对象而非继续膨胀 `coupleApi`。全量方法表见 [API 层](api-layer.md)。

## 样式令牌：全站科技冷色，情侣空间单独回暖

`src/style.css` 是唯一的全局样式层，三层结构：

1. `:root` 浅色 + `html.dark` 暗色两套 `--im-*` / `--xx-*` 令牌，基调是冷灰蓝面板、深空蓝侧栏（`--im-rail: #0a1524`）、电光青强调（`--xx-accent: #0ea5e9`，暗色 `#22d3ee`），圆角收到 6px/4px。**Element Plus 的 `--el-bg-color / --el-fill-color-blank / --el-border-color* / --el-text-color-*` 必须同时映射**：EP 的暗色变量表用的选择器就是 `html.dark`，只在 `:root` 里映射会被同权重且先加载的它盖回去（实测 `--el-bg-color` 仍是 `#141414`），所以暗色那份写在 `html.dark {}` 里，靠 `main.ts` 最后导入本文件取胜。
2. `html[data-skin='xxx']` 皮肤层：默认 `quantum`（量子青），`sakura/blue/night/forest/sunset/ocean` 是用户可选项（`utils/settings.ts` 的 `SKINS` 与之一一对应，新增皮肤两处都要加）。
3. `.couple-scope` 作用域：`CoupleView` 根元素挂这个类，把 `--im-*` 与 `--el-*` 整套覆盖回暖色（浅 `#faf6f8/#ec5f92`、暗 `#1d1619/#e0679c`），因此**情侣空间是全站唯一保留情侣观感的地方**，侧栏/聊天/通讯录/后台都走冷色。自定义属性在声明它的那一层就完成替换，所以 EP 那套映射必须在作用域内再写一遍，否则情侣页的卡片会继承 html 上的冷色面板。
4. 情侣页组件里硬编码的 `#d94f70/#8e5cd9` 等暖色一律不动——它们本来就只服务情侣功能。原先那段聊天侧的解锁外观（`--couple-bubble-*` / `--couple-glow-*` 令牌、`.dm-area[data-couple-bubble]`、`.couple-name-glow`）已在 2026-10-20 三轮裁剪里整段删除：档位来源（打卡）没了，聊天气泡/昵称光效/头像挂件/专属贴纸包这条线一起下线，`ImAvatar.vue` 的 `pendant` prop 与 `EmojiPicker.vue` 的专属分组也随之撤掉。
5. 暗色下情侣头部那张卡：`html.dark .couple-scope .header-card` 仍单独把卡内文字令牌按回深色（写法沿用早期「背景由空间主题写死成浅色」时代的规则）；现在 `space.theme` 已随空间个性化下线、不再有浅色渐变，这条规则属于尚未清理的遗留，改情侣页样式时留意它在暗色下的实际效果。

## 数据放哪：store 模式 vs 组件自持模式

| 模式 | 用法 | 适用 | 例子 |
|---|---|---|---|
| **couple store 集中式** | 状态 ref + `loadXxx`/操作函数进 `stores/couple.ts`，`handleCoupleEvent` 加分支，`reset()` 清理，return 导出 | 需要 **WS 事件驱动提醒/刷新**、跨页面共享（MainLayout 登录后就要拉、侧栏角标计数）的数据 | 现役进 store 的只剩总览与邀请那棵树：`overview` + 派生 `space`/`established`/`incomingInvites`/`outgoingInvites`；`CoupleSetup` 与 `CoupleView` 头部读它，没有独立的卡片域了 |
| **组件自持数据** | 组件内 `onMounted` safeLoad，状态留在组件里，写完按当前可见月重拉那一个读口，不进 store、不接 WS 刷新 | 单卡自用、没有别的读者 | `CoupleCalendar`（一个月度读口 `calendarMonth` + 五个不回数据的写口 `periodApi`/`intimateApi`，翻页只换 `month` 参数重取；经期与亲密的记录入口都在它内部）。心动值、打卡看板、每日一问、愿望清单这几个曾经进 store 或自持看板的域，都随三轮裁剪整域删除，没留空壳 |

取舍逻辑：store 现在只有 138 行（三轮裁剪前是 281 行），是刻意压下来的结果（`loaded` 惰性门控已随心情/贴贴/求抱抱三域删除，`intimacy`/`streak`/`question` 三个域与 `tierUnlocked` 派生一起下线，通知中心随后也删除）——新需求若没有被别的页面读、或不需要事件驱动刷新，一律优先组件自持；一旦确实需要 `arechat:couple` 刷新或全局提醒，再迁移进 store（走 map skill 的「新功能标准链路」）。

---

下一页：[页面与路由](pages-routing.md)

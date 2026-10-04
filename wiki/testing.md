# 测试

> 本页回答：Vitest 怎么配的、tests/unit 覆盖了什么、`vi.mock('@/api/couple')` 的全量显式 mock 怎么写、改 types 为什么必须同步 mock。

## Vitest 配置要点

配置不在独立文件，而在 `vite.config.ts` 的 `test` 段（`defineConfig` 从 `vitest/config` 导入）：

| 项 | 值 | 原因 |
|---|---|---|
| `environment` | `jsdom` | 组件挂载需要 DOM |
| `include` | `tests/unit/**/*.spec.ts` | 用例只放 `tests/unit/` |
| `setupFiles` | `vitest.setup.ts`（仓库根） | polyfill jsdom 缺失的 `ResizeObserver` 与 `window.matchMedia`（Element Plus 依赖） |
| `testTimeout` | `20000` | 整页挂载用例（挂载整个 CoupleView 及其组件树）单条常跑到 300-500ms，默认 5s 在慢机上会误报超时 |
| `css` | `true` | 让 element-plus 的样式导入走 Vite 转换，否则 Node 原生 ESM 加载 `.css` 报错 |
| `server.deps.inline` | `['element-plus']` | 同上，element-plus 需内联编译 |

命令：`pnpm test`（单次）/ `pnpm test:watch`。`pnpm test:e2e`（Playwright）配置存在（`playwright.config.ts` testDir `./e2e`）但当前没有 e2e 用例目录。

## tests/unit 文件与覆盖范围

| 文件 | 用例数 | 覆盖 |
|---|---|---|
| `couple.spec.ts` | 24 | 挂载整个 `CoupleView`（`mountView()` + `openTab()` 按文案点页签，因为 el-tabs 导航项没有 data-testid），断言：只剩 3 个页签与 10 张卡根、11 个老页签不再出现、未建空间只出邀请入口且不发多余请求、搜索按中文名切页签、**mock 工厂覆盖 api 全部 57 个方法**（守卫，见下节）、逐卡的「前端更严的闸门不发请求」「写接口参数原样交给后端」「归属闸门（认账/干完/加星/兑现/留灯/复盘）」「后端 400 中文直透」、心动值头部读的是 `intimacy` 接口 |
| `im.spec.ts` | 22 | im store：会话、消息、未读、WS 推送处理等 |
| `contacts.spec.ts` | 7 | ContactsView 通讯录（好友功能合并） |
| `LoginView.spec.ts` | 8 | 登录、注册审批申请流（register/registerStatus） |
| `auth.spec.ts` | 5 | auth store：登录态/verify/logout |
| `http.spec.ts` | 4 | http.ts 封装：code 判错、401 清登录态、ApiError |
| `format.spec.ts` | 4 | utils/format：formatBytes/formatTime |

合计 **74 用例 / 7 个 spec 文件**（`pnpm test` 基线，裁剪后从 242 降下来）。

## 全量显式 mock 模式（couple.spec.ts 开头）

`vi.mock('@/api/couple', () => {...})` 工厂返回**八个对象**，与真实导出同名：`coupleApi`(36) / `pinApi`(2) / `diningApi`(2) / `ceremonyApi`(3) / `factoryApi`(4) / `echoApi`(3) / `questApi`(3) / `catchApi`(4)，共 57 个方法**逐个显式列出**——上一版的 Proxy 兜底已废弃。

- 读接口预置形状正确的空数据（`mockResolvedValue(...)`），写接口多数只 `vi.fn()`，需要断言返回值的在 `beforeEach` 里重新 `mockResolvedValue`。
- 六个聚合 VO 各有一份局部常量（`dineToday`/`fyBoard`/`questBoard`/`catchBoard`/`echoVault`/`cereOverview`），读写两侧共用同一形状，保证「写接口返回整份总览 → 组件整体替换」这条链路真的被渲染过。

**为什么不能用 Proxy 兜底**：Proxy 会把「mock 漏了这个方法」变成静默的 `undefined` 返回值——组件照样跑完，用例照样绿，断言的却是空气。但要说清楚：**光把方法逐个列出来本身也不是守卫**。实测把 `coupleApi.sendAction` 从工厂里删掉，`vitest run tests/unit/couple.spec.ts` 仍 23/23 全绿，`pnpm typecheck`（vue-tsc，tsconfig 的 include 确实覆盖 `tests/**/*.ts`）也照样 TYPECHECK_EXIT=0——因为测试文件里 `coupleApi` 的类型仍是真实模块的类型，`vi.mock` 工厂的返回值不受它约束，所以类型层根本没有能力拦这件事。

**真正的守卫**是同文件里的 `mock 工厂必须覆盖 api/couple.ts 的每个方法，漏一项就红`：它用 `readFileSync(process.cwd() + '/src/api/couple.ts')` 现读源码，抽出 8 个分组下的所有方法名，逐个断言 mock 对象上对应属性是 `function`，并断言总数 57。判据从源码抽、不手数，所以 api 加了方法而 mock 没跟上时，这条一定红。实测：删掉 `comfortCards`（一个 `beforeEach` 都不引用的方法）→ `Tests 2 failed | 22 passed`，失败信息 `mock 工厂缺：coupleApi.comfortCards`。

**怎么用**：

- 新增 api 方法：必须在 mock 工厂补上这一项，否则「mock 工厂必须覆盖 api/couple.ts 的每个方法」这条守卫用例直接红（它现读 `src/api/couple.ts` 抽方法名，不靠手数）。若组件会**渲染**返回值（聚合 VO 类），mock 要给形状正确的空数据而不是 `undefined`。
- 测试里取 mock：`import { catchApi, ceremonyApi, coupleApi, diningApi, echoApi, factoryApi, pinApi, questApi } from '@/api/couple'` 后 `vi.mocked(coupleApi.moods)`。
- 该 spec 还 mock 了 `vue-router`（`useRoute: () => ({ query: routeQuery })`，因为 CoupleView 在 `onMounted` 读 `?tab=`），并 `vi.spyOn(ElMessage, 'warning' | 'error' | 'success')` 来看闸门提示；`beforeEach` 里 `vi.clearAllMocks()` + `setActivePinia(createPinia())` + 把 `auth.username` 设成 `alice`。

## 必须记住的坑

1. **改了 `src/types/index.ts` 的 VO 字段 → 必须同步 couple.spec.ts mock 工厂里的假数据对象**（如给 `CoupleIntimacyVO` 加必填字段而 mock 的 `mockResolvedValue({...})` 没跟上，`pnpm build` 的 `vue-tsc --noEmit` 直接失败——类型检查覆盖测试文件）。
2. **默认页签 `today` 不能改**：`couple.spec.ts` 多数用例依赖挂载后停在「🫶 今天」；测另两个页签（过日子/小惊喜）用 `openTab(wrapper, '过日子')` 按文案点 `.el-tabs__item`——el-tabs 的导航项上没有 data-testid，只有 `#tab-<name>` 与文案，所以只能按文案点，别动 `activeTab` 初值。
3. 新组件核心交互应补用例，选择器依赖 `data-testid`（组件根元素/按钮/输入框都要带）；`el-input` 的 testid 落在 `<input>` 本身，`find('[data-testid=x]')` 就够了，不要再 `find('[data-testid=x] input')`。
4. 涉及逻辑改动 `pnpm test` 全绿才算完成；`pnpm build` 是提交硬门禁（见 [开发指南](dev-guide.md)）。

---

上一页：[WS 事件链路](ws-events.md) ｜ 下一页：[开发指南](dev-guide.md)

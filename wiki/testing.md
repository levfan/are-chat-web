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

命令：`pnpm test`（单次）/ `pnpm test:watch`。`pnpm test:e2e`（Playwright）另有 `e2e/`（本地 mock）与 `e2e-live/`（打真后端的实时巡检，`couple-audit.spec.ts` 用 `COUPLE_CARDS` 注册表核对四张卡全覆盖）。

## tests/unit 文件与覆盖范围（2026-10-05 二轮裁剪后实测）

| 文件 | 用例数 | 覆盖 |
|---|---|---|
| `couple.spec.ts` | 58 | 挂载整个 `CoupleView`（`mountView()` + `openTab()` 按文案点页签，因为 el-tabs 导航项没有 data-testid）：2 常开页签 + 1 隐藏页签与 4 张卡根、老页签（life/gift）不再出现、未建空间只出邀请入口且一个卡片接口都不敲、头部第二格「今天（一问 · 连续）」只读已加载数据不再发请求、爱称走 `PUT /profile` 的 petName（空串=清除）、装扮只交 slogan/theme 且再无贴纸墙、注册表 4 条、**api 契约守卫（mock 工厂覆盖全部 26 方法 + 存活分组清单 + 已下线路径按段判死）**、四张卡主链路、心动值头部、解锁态派生、WS 15 个事件的逐个刷新口径 |
| `couple-v8-cards.spec.ts` | 36 | 四张卡逐个：打卡（补签交 board.day 前一天、canMakeup/missedYesterday 双闸门、进度墙、21 格打卡条）、每日一问（bothAnswered 才互看、answerMax 吃后端下发、回看）、愿望清单（「已准备」对许愿人保密、preparableFlag/canFulfillFlag 双位、闸门全吃后端数字、400 直透）、百日回顾（未解锁一个请求都不发）、四卡同挂接口全挂也不抛 |
| `couple-unlocks.spec.ts` | 18 | 聊天侧视觉解锁：挂件 prop、`coupleVisualOn` 门禁（未建空间/未解锁/对象不是 TA 都不生效）、ChatView 三档联挂、专属贴纸包生成器（确定性、红线=纯 unicode 无图片） |
| `im.spec.ts` | 22 | im store：会话、消息、未读、WS 推送处理等 |
| `LoginView.spec.ts` | 8 | 登录、注册审批申请流（register/registerStatus） |
| `contacts.spec.ts` | 7 | ContactsView 通讯录（好友功能合并，含邀请建情侣空间入口） |
| `auth.spec.ts` | 5 | auth store：登录态/verify/logout |
| `http.spec.ts` | 4 | http.ts 封装：code 判错、401 清登录态、ApiError |
| `format.spec.ts` | 4 | utils/format：formatBytes/formatTime |

合计 **162 用例 / 9 个 spec 文件**（`pnpm test` 基线，2026-10-05 实测 `Test Files 9 passed / Tests 162 passed`）。

## 全量显式 mock 模式（couple.spec.ts 开头）

`vi.mock('@/api/couple', () => {...})` 工厂返回**五个对象**，与真实导出同名：`coupleApi`(13) / `streakApi`(2) / `questionApi`(3) / `wishApi`(7) / `memoryApi`(1)，共 26 个方法**逐个显式列出**——Proxy 兜底已废弃，而且被证明守不住（见下）。

- 读接口预置形状正确的空数据（`mockResolvedValue(...)`），写接口多数只 `vi.fn()`，需要断言返回值的在 `beforeEach` 里重新 `mockResolvedValue`。
- `updateProfile` 的 mock 是**照后端语义回显**的 `mockImplementation`：null/未传=该项不动、空串=清除，返回整份 `SpaceVO`——因为 store 直接拿返回值换掉 `overview.space`，mock 返回 null 会让「保存爱称后界面跟着变」这条断言测的是空气。
- 各聚合 VO（streak board / question today / wish board / memory page）各有一份局部常量，读写两侧共用同一形状，保证「写接口返回整份 VO → 组件整体替换」这条链路真的被渲染过。

**为什么不能用 Proxy 兜底**：Proxy 会把「mock 漏了这个方法」变成静默的 `undefined` 返回值——组件照样跑完，用例照样绿，断言的却是空气。但**光把方法逐个列出来本身也不是守卫**：`vi.mock` 工厂的返回值不受真实模块类型约束，`vue-tsc` 拦不住漏项。

**真正的守卫**是「api 契约守卫」两条：它用 `readFileSync(process.cwd() + '/src/api/couple.ts')` 现读源码——

1. `requestPaths()` 抽出所有带引号的 `/api/couple...` 请求路径，断言**恰好 26 条**且逐条落在存活清单里；
2. 已下线的路径段（`moods/bond/care/dining/factory/quest/ceremony/echo/surprise/pin/anniversaries`）**按 `/` 分段判死**——不能用 `includes('/quest')` 这种子串匹配，`/quest` 会把现役的 `/question/today` 也算成命中，一条会误报的守卫下次就直接被人删掉，比没有守卫更糟。

## 必须记住的坑

1. **改了 `src/types/index.ts` 的 VO 字段 → 必须同步 couple.spec.ts mock 工厂里的假数据对象**（`pnpm build` 的 vue-tsc 覆盖测试文件，字段对不上直接构建失败——这是好事，让契约漂移当场暴露）。
2. **默认页签 `today` 不能改**：`couple.spec.ts` 多数用例依赖挂载后停在「🫶 今天」；测「愿望清单」用 `openTab(wrapper, '愿望清单')` 按文案点 `.el-tabs__item`——el-tabs 的导航项上没有 data-testid，只有 `#tab-<name>` 与文案，所以只能按文案点，别动 `activeTab` 初值。
3. 新组件核心交互应补用例，选择器依赖 `data-testid`（组件根元素/按钮/输入框都要带）；`el-input` 的 testid 落在 `<input>` 本身，`find('[data-testid=x]')` 就够了，不要再 `find('[data-testid=x] input')`。
4. 涉及逻辑改动 `pnpm test` 全绿才算完成；`pnpm build` 是提交硬门禁（见 [开发指南](dev-guide.md)）。

---

上一页：[WS 事件链路](ws-events.md) ｜ 下一页：[开发指南](dev-guide.md)

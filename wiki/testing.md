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

命令：`pnpm test`（单次）/ `pnpm test:watch`。`pnpm test:e2e`（Playwright）另有 `e2e/`（本地 mock）与 `e2e-live/`（打真后端的实时巡检）——`couple-audit.spec.ts` 至今 import 已删除的 `coupleCards.registry.ts` 去核对「六张卡全覆盖」，而 `e2e-live/` 既不在 `tsconfig.json` 的 include 里、也不在 Vitest 的 `include`（`tests/unit/**`）里，所以 `pnpm build` 与 `pnpm test` 都不会因此报错，它坏着也没人踩到。注册表随 2026-10-20 三轮裁剪下线后，这个巡检脚本没有对象了。

## tests/unit 文件与覆盖范围（2026-10-20 三轮裁剪后实测）

| 文件 | 用例数 | 覆盖 |
|---|---|---|
| `couple.spec.ts` | 16 | 挂载整个 `CoupleView`（`mountView()`，页面不再分页签，也就不需要 `openTab()`）：空间骨架 4 条（头部 + 一张日历、`.el-tabs__item` 数量为 0、七个已下线 testid 一个都不在、日历是唯一读口且挂载只敲一次、未建空间只出邀请入口且一个卡片接口都不敲、里程碑横幅只在整百那天出）、纪念日与解除 4 条（没选日期前端挡下、保存交日期后重拉总览、解除先确认再清场重拉、取消确认框一个请求都不发）、**api 契约守卫 2 条（从源码抽分组与方法，断言 mock 工厂覆盖全部 14 个方法 + 恰好 4 个分组 + 14 条存活路径，并把 `question`/`streak`/`wish`/`intimacy`/`profile`/`board`/`pin`/`dining` 八个路径段按 `/` 分段判死，同时断言 api 与 store 源码里搜不到 `streakApi`/`questionApi`/`wishApi`/`loadIntimacy`/`updateProfile`/`tierUnlocked`）**、WS 口径 6 条（`invite-accepted`/`anniversary-updated` 重拉总览、`dissolved` 先清场再重拉、`anniversary-reminder` 只弹提醒、已下线卡片的老推送不发请求不弹提醒、没有空间时 init 不敲卡片接口且 reset 清总览） |
| `couple-calendar.spec.ts` | 27 | 亲密日历卡（`vi.useFakeTimers({toFake:['Date']})` + `vi.setSystemTime` 把今天钉在 2026-10-20，格子数才可比）。展示 13 条：未建空间一个请求都不发也不铺网格、挂载只发一次月度读口且标题是当月、周一开头的 3 个空格 + 31 天、覆盖日/开始日/结束日三个列表照位渲染、亲密标记按类型出图标（同日两种都出、条数只在大于一时当角标）、🌱 只标后端给的那一天且落在经期日上时让位给 🩸、摘要行与周期行照后端数字说不自己估（含「先按 28 天估」「已推迟」「没有记录时给引导而不是数字」）、点一天摊开那天的经期阶段与每条标记（备注与「我记的/TA 记的」）、空白天给引导未来天提醒先记今天。记与删 14 条：三个记录入口（记经期开始 / 记一笔 EDGE 或 SEX / 补今天结束日）交的都是选中的那天且写完重拉当月、这天的开始已记过就前端拦下、未来那天的三个按钮都是禁用态硬点也不发请求、翻月清空选中后提醒「先点一个日子」、备注留空交 null 不把空串塞给后端、删标记与删区间各交自己的 id、已结束的区间不给「今天结束了」按钮、请求在飞时连点不重复提交、翻月只换 `month` 参数重取一次、「本月」在当月禁用翻走再点回到当月并重新选中今天、后端 400 中文直透、月度读口 404 整卡静默收起。**每个用例都得 unmount**（`afterEach` 里 `while (mounted.length) pop().unmount()`）——不卸载会让上一个用例的实例继续数请求 |
| `im.spec.ts` | 21 | im store：会话、消息、未读、WS 推送处理等 |
| `LoginView.spec.ts` | 8 | 登录、注册审批申请流（register/registerStatus） |
| `contacts.spec.ts` | 7 | ContactsView 通讯录（好友功能合并，含邀请建情侣空间入口） |
| `auth.spec.ts` | 5 | auth store：登录态/verify/logout |
| `http.spec.ts` | 4 | http.ts 封装：code 判错、401 清登录态、ApiError |
| `format.spec.ts` | 4 | utils/format：formatBytes/formatTime |

合计 **92 用例 / 8 个 spec 文件**（`pnpm test` 基线，2026-10-20 三轮裁剪后实测 `Test Files 8 passed / Tests 92 passed`）。这一轮删掉的 spec：`couple-v8-cards.spec.ts`（三张老卡逐个）、`couple-unlocks.spec.ts`（聊天侧视觉解锁）、`couple-period.spec.ts` 与 `couple-intimate.spec.ts`（两张独立看板卡，用例并入 `couple-calendar.spec.ts`）。

## 全量显式 mock 模式（couple.spec.ts 开头）

`vi.mock('@/api/couple', () => {...})` 工厂返回**四个对象**，与真实导出同名：`coupleApi`(8) / `periodApi`(3) / `intimateApi`(2) / `calendarApi`(1)，共 14 个方法**逐个显式列出**——Proxy 兜底已废弃，而且被证明守不住（见下）。`couple-calendar.spec.ts` 也带一份同口径的显式工厂。

- 读接口预置形状正确的空数据（`mockResolvedValue(...)`），写接口多数只 `vi.fn()`，需要断言返回值的在 `beforeEach` 里重新 `mockResolvedValue`。日历的空样本 `FIX.emptyCalendar` 放在 `vi.hoisted(() => ({...}))` 里，因为 mock 工厂会被提升到 import 之前执行，直接引用外部常量拿不到。
- `setAnniversary` 的 mock 预置成回显新日子的 `SpaceVO`，但断言锁的不是它——store 保存后走的是「重拉 `overview`」，不是把返回的 `SpaceVO` 就地并回去，所以用例是在点保存前把 `coupleApi.overview` 换成带新日子的返回，再断言 `overview` 被敲第二次、头部 `couple-anniv-line` 跟着变。旧口径里那个照后端语义回显的 `updateProfile` mock（null=不动、空串=清除）已随个性化端点一起删除。
- `couple-calendar.spec.ts` 用 `calendar()`/`period()`/`mark()` 三个局部工厂造 `CoupleCalendarVO` 的样本，读写两侧共用同一形状；五个写口都只回 `undefined`，「写完重拉月度读口」这条链路靠 `calendarMonth` 的调用次数与参数断言。

**为什么不能用 Proxy 兜底**：Proxy 会把「mock 漏了这个方法」变成静默的 `undefined` 返回值——组件照样跑完，用例照样绿，断言的却是空气。但**光把方法逐个列出来本身也不是守卫**：`vi.mock` 工厂的返回值不受真实模块类型约束，`vue-tsc` 拦不住漏项。

**真正的守卫**是「api 契约守卫」两条：它用 `readFileSync(process.cwd() + '/src/api/couple.ts')` 现读源码——

1. `requestPaths()` 抽出所有带引号的 `/api/couple...` 请求路径，断言**恰好 14 条**；另一条按 `export const` 从源码抽出每个分组的方法名，断言**恰好 4 个分组、总数 14**，且每个方法在 mock 工厂里都必须是函数（判据从源码抽，不手数）。
2. 已下线的路径段（`question/streak/wish/intimacy/profile/board/pin/dining`）**按 `/` 分段判死**——不能用 `includes('/quest')` 这种子串匹配，子串会把别的路径也算成命中（`/quest` 当年就会把现役的 `/question/today` 一起判死）；再补一层整串判死：`streakApi`/`questionApi`/`wishApi`/`loadIntimacy`/`updateProfile`/`tierUnlocked` 这几个名字在 `src/api/couple.ts` 与 `src/stores/couple.ts` 里一个字都搜不到。一条会误报的守卫下次就直接被人删掉，比没有守卫更糟。

## 必须记住的坑

1. **改了 `src/types/index.ts` 的 VO 字段 → 必须同步 couple.spec.ts mock 工厂里的假数据对象**（`pnpm build` 的 vue-tsc 覆盖测试文件，字段对不上直接构建失败——这是好事，让契约漂移当场暴露）。
2. **别把页签加回来**：`couple.spec.ts` 断言 `wrapper.findAll('.el-tabs__item')` 长度为 0，并逐个断言 `couple-question`/`couple-streak`/`couple-wish`/`couple-profile`/`couple-intimacy-score`/`couple-pet-edit`/`couple-love-title` 这些老 testid 一个都不在；原先「默认页签 `today` 不能改」「测第二个页签要按文案点 `.el-tabs__item`」的口径随 `?tab=` 深链一起作废。整页挂载的每个用例还得换一个全新 pinia（`beforeEach` 里 `createPinia()` + `setActivePinia()`）——store 的 `overview` 跨用例留存，带着上一个用例的「已建空间」再挂载，未建空间那条就永远测不准。
3. 新组件核心交互应补用例，选择器依赖 `data-testid`（组件根元素/按钮/输入框都要带）；`el-input` 的 testid 落在 `<input>` 本身，`find('[data-testid=x]')` 就够了，不要再 `find('[data-testid=x] input')`。
4. 涉及逻辑改动 `pnpm test` 全绿才算完成；`pnpm build` 是提交硬门禁（见 [开发指南](dev-guide.md)）。

---

上一页：[WS 事件链路](ws-events.md) ｜ 下一页：[开发指南](dev-guide.md)

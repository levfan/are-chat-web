# 测试

> 本页回答：Vitest 怎么配的、tests/unit 覆盖了什么、`vi.mock('@/api/couple')` 的 Proxy 兜底模式怎么用、改 types 为什么必须同步 mock。

## Vitest 配置要点

配置不在独立文件，而在 `vite.config.ts` 的 `test` 段（`defineConfig` 从 `vitest/config` 导入）：

| 项 | 值 | 原因 |
|---|---|---|
| `environment` | `jsdom` | 组件挂载需要 DOM |
| `include` | `tests/unit/**/*.spec.ts` | 用例只放 `tests/unit/` |
| `setupFiles` | `vitest.setup.ts`（仓库根） | polyfill jsdom 缺失的 `ResizeObserver` 与 `window.matchMedia`（Element Plus 依赖） |
| `css` | `true` | 让 element-plus 的样式导入走 Vite 转换，否则 Node 原生 ESM 加载 `.css` 报错 |
| `server.deps.inline` | `['element-plus']` | 同上，element-plus 需内联编译 |

命令：`pnpm test`（单次）/ `pnpm test:watch`。`pnpm test:e2e`（Playwright）配置存在（`playwright.config.ts` testDir `./e2e`）但当前没有 e2e 用例目录。

## tests/unit 文件与覆盖范围

| 文件 | 用例数 | 覆盖 |
|---|---|---|
| `couple.spec.ts`（1235 行） | 39 | **最重**。挂载整个 `CoupleView`（`mountView = () => mount(CoupleView, { global: { plugins: [pinia] } })`，约 405 行），断言：未建空间 CoupleSetup/邀请流程、空间头部、约定分组与逾期条、WS `arechat:couple` 事件触发提醒+刷新、各页签核心交互（刮刮乐/思念/花园浇水/求抱抱/真心话/树洞/情话储蓄罐/挑战/词典/教练/诗歌/同频按键/考古/周年报告/热力日历/沟通增强/异地/确定感/游戏/仪表盘/生活经营 manage/时光博物馆 museum 含未建空间静默降级/F198 问候横幅） |
| `im.spec.ts` | 23 | im store：会话、消息、未读、WS 推送处理等 |
| `contacts.spec.ts` | 7 | ContactsView 通讯录（好友功能合并） |
| `LoginView.spec.ts` | 8 | 登录、注册审批申请流（register/registerStatus） |
| `auth.spec.ts` | 5 | auth store：登录态/verify/logout |
| `http.spec.ts` | 4 | http.ts 封装：code 判错、401 清登录态、ApiError |
| `format.spec.ts` | 4 | utils/format：formatBytes/formatTime |

## Proxy 兜底 mock 模式（couple.spec.ts 开头）

`vi.mock('@/api/couple', () => {...})` 工厂返回**三个对象**，与真实导出同名：`coupleApi`、`manageApi`、`museumApi`。每对象 = `base`（显式列出的 `vi.fn()`，关键查询接口预置 `mockResolvedValue(空数据/形状正确的 VO)`）+ `Proxy` 包一层：

```ts
const wrapped = new Proxy(base, {
  get(target, prop) {
    if (typeof prop !== 'string' || prop in target) return target[prop]
    target[prop] = vi.fn().mockResolvedValue(undefined)   // 兜底
    return target[prop]
  },
})
```

**为什么**：页面挂载时 50 个组件 `onMounted` 并发拉数据；mock 工厂没显式覆盖的新接口方法会返回 undefined 并在 `onMounted` 里炸出未处理 rejection，污染测试输出。Proxy 兜底后新增 api 方法**不会**弄坏既有测试。manage/museum 的 base 已带默认空数据（如 `getAnnualBook: null`、列表类 `[]`），因为组件按返回值渲染。

**怎么用**：

- 新增 api 方法：什么都不用做即可跑通（Proxy 兜底返回 `undefined`）；但若组件会**渲染**返回值，应在 base 补一个形状正确的默认值，再在需要断言的用例里 `vi.mocked(coupleApi.xxx).mockResolvedValue(...)` 覆盖。
- 测试里取 mock：`import { coupleApi, manageApi, museumApi } from '@/api/couple'` 后 `vi.mocked(coupleApi.promises)`。
- 该 spec 还同时 mock 了 `@/api/im`、`@/api/files`、`@/api/auth`、`vue-router`，并 `vi.stubGlobal('WebSocket', FakeWebSocket)`——写新页面级测试可参考此结构。

## 必须记住的坑

1. **改了 `src/types/index.ts` 的 VO 字段 → 必须同步 couple.spec.ts mock 工厂里的假数据对象**（如给 `CoupleIntimacyVO` 加必填字段而 mock 的 `mockResolvedValue({...})` 没跟上，`pnpm build` 的 `vue-tsc --noEmit` 直接失败——类型检查覆盖测试文件）。
2. **默认页签 `promises` 不能改**：`couple.spec.ts` 的多数用例依赖挂载后停在约定页；测其他页签的交互时是在对应组件已渲染的前提下操作或切页签，不要动 `activeTab` 初值。
3. 新组件核心交互应补用例，选择器依赖 `data-testid`（组件根元素/按钮/输入框都要带）。
4. 涉及逻辑改动 `pnpm test` 全绿才算完成；`pnpm build` 是提交硬门禁（见 [开发指南](dev-guide.md)）。

---

上一页：[WS 事件链路](ws-events.md) ｜ 下一页：[开发指南](dev-guide.md)

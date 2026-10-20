# 状态管理（Pinia Stores）

> 本页回答：项目有哪些 store、couple store 的数据模型与刷新机制、WS 事件如何分发、init/reset 生命周期由谁调用。
> **2026-10-20 三轮裁剪后 couple store 只剩 138 行、1 个数据 ref**：总览与邀请那一棵树。心动值、打卡看板、每日一问随功能一起下线。

## Store 清单（`src/stores/`）

| store | 文件 | 行数级 | 职责 |
|---|---|---|---|
| `useAuthStore` | `auth.ts`（88 行） | 小 | 登录态：`username`（初值读 sessionStorage `CURRENT_USER_KEY`）、`role: 'USER'|'ADMIN'`、`loginAt`、`isLoggedIn`/`isAdmin` computed；`login`/`verify`（服务端确认会话，尽力而为）/`logout`/`clearLocal`；`register` 已废弃为直接抛错（注册改审批制，走 `authApi.register` 提交申请） |
| `useImStore` | `im.ts`（937 行） | 中 | IM 全域：好友/申请、会话与消息、**WebSocket 连接管理**（`ws(s)://location.host/ws/chat/{username}`，25s heart 心跳）、草稿 localStorage、未读/置顶/收藏/回复/撤回/表态/戳一戳等；WS push 按 `type` 分发（见 [WS 事件链路](ws-events.md)），其中 `type==='couple'` 转发为 `arechat:couple` 自定义事件 |
| `useCoupleStore` | `couple.ts`（138 行） | 小 | 只留「多页面共用 + 要靠 WS 刷新」的那一棵树：总览与邀请；`arechat:couple` 事件的统一消费者 |

## couple store 核心概念

### overview / space

- `overview = ref<CoupleOverview | null>`：`loadOverview()` 调 `coupleApi.overview()` 拉取，是**页面级锚点数据**（登录后 MainLayout 就拉，建立流程与纪念日类事件处理里也随时重拉）。
- 派生 computed（全部从 overview 读）：
  - `space = overview?.space ?? null`（情侣空间实体），`established = !!space`（CoupleView 据此渲染 CoupleSetup 还是主界面）
  - `incomingInvites` / `outgoingInvites`（待处理邀请列表）——驱动导航红点与头部提示
- 除此之外没有别的状态 ref：心动值、打卡看板、每日一问随功能一起删了，不留空壳。

### 写接口的回显口径

`setAnniversary` / `invite` / `acceptInvite` 等写口完成后一律 `loadOverview()` 重拉，不做本地乐观合并——字段回写容易和后端口径漂移（那是 2026-10-05 之前的行为）。亲密日历的写口（`periodApi` / `intimateApi`）不进 store，由日历卡自己写完重拉当月。

### handleCoupleEvent：WS 事件分发

`function handleCoupleEvent(event: Event)`：

- 入参是 `CustomEvent<{ event, username, detail }>`；`detail` 是后端拼好的中文人话文案。
- 用 `if` 链按事件名分组（不是 switch），**6 个事件名**按族处理，逐组的刷新口径见 [WS 事件链路](ws-events.md)。
- **没有兜底分支**：不认识的事件直接忽略（下线卡片的那三十来个事件后端已不再发，加兜底等于把删掉的功能接回来）。
- `notify()` 内部用 `ElNotification`（top-right，duration 8000）。
- 全局监听只绑一次：模块级 `globalListenerBound` 标志 + `bindGlobalListener()` 里 `window.addEventListener('arechat:couple', e => useCoupleStore().handleCoupleEvent(e))`——回调内动态解析当前活跃 pinia 的实例，多实例/测试场景安全。

### init / reset 生命周期

- **`init()`**：`bindGlobalListener()` → `loadOverview()`。catch 时把 overview 置 null 静默降级（未登录/网络异常不阻塞布局）。
- **`reset()`**：清空 overview（登出/解除关系时彻底归零）。
- **调用方（`layouts/MainLayout.vue`）**：
  - `onMounted`：已登录则 `im.init(username)` + `couple.init()`（+ 在线人数轮询、管理员待办）。
  - `watch(() => auth.username)`：重新登录时重建 `im.init` + `couple.init`；置空时 `couple.reset()`。
  - 登出流程：确认后 `im.reset()` + `couple.reset()` + `auth.logout()` → 跳 `/login`。
  - `views/CoupleView.vue` 的 `onMounted` 也调 `couple.init()` 兜底刷新总览（邀请状态可能已经变了）。

## 组件自持数据模式（不进 store 的卡）

`CoupleCalendar` 在组件内自持状态：`onMounted` 拉一次 `GET /api/couple/calendar/month`，五个写口（记经期开始 / 补结束日 / 删经期 / 记亲密 / 删亲密）都只回成功与否，写完按当前可见月重拉一次；这条链路没有 WS 事件，未建空间（404）整卡静默收起。新需求优先走组件自持，只有需要跨页面共享或事件驱动刷新时才进 store。

---

上一页：[页面与路由](pages-routing.md) ｜ 下一页：[API 层](api-layer.md)

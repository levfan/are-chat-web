# 状态管理（Pinia Stores）

> 本页回答：项目有哪些 store、couple store 的数据模型与惰性刷新机制、WS 事件如何分发、init/reset 生命周期由谁调用。

## Store 清单（`src/stores/`）

| store | 文件 | 行数级 | 职责 |
|---|---|---|---|
| `useAuthStore` | `auth.ts`（88 行） | 小 | 登录态：`username`（初值读 sessionStorage `CURRENT_USER_KEY`）、`role: 'USER'|'ADMIN'`、`loginAt`、`isLoggedIn`/`isAdmin` computed；`login`/`verify`（服务端确认会话，尽力而为）/`logout`/`clearLocal`；`register` 已废弃为直接抛错（注册改审批制，走 `authApi.register` 提交申请） |
| `useImStore` | `im.ts`（937 行） | 中 | IM 全域：好友/申请、会话与消息、**WebSocket 连接管理**（`ws(s)://location.host/ws/chat/{username}`，25s heart 心跳）、草稿 localStorage、未读/置顶/收藏/回复/撤回/表态/戳一戳等；WS push 按 `type` 分发（见 [WS 事件链路](ws-events.md)），其中 `type==='couple'` 转发为 `arechat:couple` 自定义事件 |
| `useCoupleStore` | `couple.ts`（3483 行） | 大 | 情侣空间总览 + 除 manage/museum 自持域外的全部功能域数据与操作；`arechat:couple` 事件的统一消费者 |

## couple store 核心概念

### overview / space

- `overview = ref<CoupleOverview | null>`：`loadOverview()` 调 `coupleApi.overview()` 拉取，是**页面级锚点数据**（登录后 MainLayout 就拉，多个 WS 事件处理里也随时重拉）。
- 派生 computed（全部从 overview 读）：
  - `space = overview?.space ?? null`（情侣空间实体），`established = !!space`（CoupleView 据此渲染 CoupleSetup 还是主界面）
  - `incomingInvites` / `outgoingInvites`（待处理邀请列表，兼容别名 `incomingInvite`/`outgoingInvite` 取最新一条）——驱动导航红点与头部提示
  - `checkins`（今日早晚安打卡状态）、`overdueCount`（逾期约定数，驱动提示条）、`letterUnread`（可拆未拆悄悄话数，驱动 letters 页签 label）
- `promiseDraft`：聊天页「记入约定」带入的草稿，CoupleView 打开承诺弹窗后清空。
- 其余约 190 个 ref 按功能域分组（promises/moods/bond/ritual/care/memory/life/…/coach/poem/spark，源码内有中文分区注释），每个域配套 `loadXxx()` 与操作函数，末尾统一 `return {...}` 导出。

### loadedLists：惰性刷新机制（关键设计）

`loadedLists = ref({ promises, question, items, anniversaries, moods, timeline, intimacy, letters, pacts, funds, cityCard, bond, ritual, care, memory, life, surprise, garden, comfort, makeup, deep, whisper, growth, chronicle, keepsake, comm, distance, secure, play, dailyLife, coach, poem, spark })`（33 个布尔键）。

规则：

1. 每个 `loadXxx()` 成功加载后置对应键为 `true`（如 `loadedLists.value.promises = true`）。
2. **WS 事件只刷新已加载过的域**：`handleCoupleEvent` 各 case 内 `if (loadedLists.value.xxx) void loadXxx()`——用户没打开过的页签不发无谓请求，也避免打开时数据是旧的。
3. `reset()` 把全部键重置回 `false`，同时清空所有数据 ref（登出/解除关系时彻底归零）。

新增数据域时必须同时：加 ref → 加 `loadedLists` 键 → `loadXxx` 置位 → `handleCoupleEvent` 加 case → `reset()` 清理 → return 导出（map skill「新功能标准链路」第 3 步）。

### handleCoupleEvent：WS 事件分发

`function handleCoupleEvent(event: Event)`（约 2209 行起）：

- 入参是 `CustomEvent<{ event, username, detail }>`；`detail` 是后端拼好的中文人话文案。
- `switch (msg.event)` 共约 170 个 case，模式固定：**`notify(标题, 文案)` →（条件刷新）`if (loadedLists...) void loadXxx()` →（涉及总览的）`void loadOverview()`**。
- `notify()` 内部用 `ElNotification`（top-right，duration 8000）。
- 特殊 case：`dissolved` → 先 `reset()` 再 `loadOverview()`；`invite*`/`checkin`/`promise-*` 等都会重拉 overview。
- 全局监听只绑一次：模块级 `globalListenerBound` 标志 + `bindGlobalListener()` 里 `window.addEventListener('arechat:couple', e => useCoupleStore().handleCoupleEvent(e))`——回调内动态解析当前活跃 pinia 的实例，多实例/测试场景安全。
- 事件名全列见 [WS 事件链路](ws-events.md)。

### init / reset 生命周期

- **`init()`**：`bindGlobalListener()` → 并发防抖（模块闭包 `loading` 标志）→ `loadOverview()` → 已建空间时 `void refreshDnd()`（拉 museumApi.getDnd 存 `myDnd`，F197 免打扰窗口内 `notify()` 不弹窗、消息照常）；catch 静默（未登录/网络异常不阻塞布局）。
- **`reset()`**：清空全部 ref + `loadedLists` 归位（约 200 行赋值语句）。
- **调用方（`layouts/MainLayout.vue`）**：
  - `onMounted`：已登录则 `im.init(username)` + `couple.init()`（+ 在线人数轮询、管理员待办）。
  - `watch(() => auth.username)`：重新登录时重建 `im.init` + `couple.init`；置空时 `couple.reset()`。
  - 登出流程：确认后 `im.reset()` + `couple.reset()` + `auth.logout()` → 跳 `/login`。
  - `views/CoupleView.vue` 的 `onMounted` 也调 `couple.init()` 兜底刷新总览，并额外 `couple.loadIntimacy()`。

## 组件自持数据模式（不进 store 的例外）

`CoupleManage.vue`（manageApi）与 `CoupleMuseum.vue`（museumApi）在组件内 `onMounted` 并发拉取、自持状态、不接 WS 事件、`reset` 无关；未建空间时静默降级。新需求若要实时联动需改走 store 模式。

---

上一页：[页面与路由](pages-routing.md) ｜ 下一页：[API 层](api-layer.md)

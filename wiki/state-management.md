# 状态管理（Pinia Stores）

> 本页回答：项目有哪些 store、couple store 的数据模型与刷新机制、WS 事件如何分发、init/reset 生命周期由谁调用。
> **2026-10-05 二轮裁剪后 couple store 收敛到 312 行、6 个数据 ref**：总览与邀请、心动值、打卡看板、每日一问、通知（外加派生出的解锁档位）。

## Store 清单（`src/stores/`）

| store | 文件 | 行数级 | 职责 |
|---|---|---|---|
| `useAuthStore` | `auth.ts`（88 行） | 小 | 登录态：`username`（初值读 sessionStorage `CURRENT_USER_KEY`）、`role: 'USER'|'ADMIN'`、`loginAt`、`isLoggedIn`/`isAdmin` computed；`login`/`verify`（服务端确认会话，尽力而为）/`logout`/`clearLocal`；`register` 已废弃为直接抛错（注册改审批制，走 `authApi.register` 提交申请） |
| `useImStore` | `im.ts`（937 行） | 中 | IM 全域：好友/申请、会话与消息、**WebSocket 连接管理**（`ws(s)://location.host/ws/chat/{username}`，25s heart 心跳）、草稿 localStorage、未读/置顶/收藏/回复/撤回/表态/戳一戳等；WS push 按 `type` 分发（见 [WS 事件链路](ws-events.md)），其中 `type==='couple'` 转发为 `arechat:couple` 自定义事件 |
| `useCoupleStore` | `couple.ts`（312 行） | 小 | 只留「多组件共用 + 要靠 WS 刷新」的域：总览与邀请、心动值、打卡看板、每日一问、通知中心；`arechat:couple` 事件的统一消费者 |

## couple store 核心概念

### overview / space

- `overview = ref<CoupleOverview | null>`：`loadOverview()` 调 `coupleApi.overview()` 拉取，是**页面级锚点数据**（登录后 MainLayout 就拉，建立流程/纪念日/装扮/爱称类事件处理里也随时重拉）。
- 派生 computed（全部从 overview 读）：
  - `space = overview?.space ?? null`（情侣空间实体），`established = !!space`（CoupleView 据此渲染 CoupleSetup 还是主界面）
  - `incomingInvites` / `outgoingInvites`（待处理邀请列表）——驱动导航红点与头部提示
- 其余状态 ref 共 5 个：`intimacy`（心动值）、`streak`（打卡看板，七档解锁态从它的 `tiers` 里筛）、`question`（今日一问）、`notifies` / `notifyUnread`（通知）。末尾统一 `return {...}` 导出。
- `unlockedTierKeys` / `tierUnlocked(key)`：**只认看板 `tiers` 里 `unlocked` 的行**，前端没有第二份解锁标记可兜底——看板没拉到就等于没解锁。

### 写接口的回显与去重（两处实测过的细节）

1. `loadStreak()` / `loadQuestion()` 各自带 **in-flight 合并**：三处同时要点（登录 init、进页兜底、卡片挂载）只发一次请求；但**不缓存**——已落地之后再调用会真发第二次。所以 `CoupleView.onMounted` 补拉今日一问前要先判 `if (!couple.question)`，否则今天页签里卡片已拉过一次、父级再补一次就是白打（回归锁：`couple.spec.ts`「头部第二格……不再问后端要一次」）。
2. `updateProfile` 用后端返回的整份 `SpaceVO` 直接换掉 `overview.space`——不再有本地乐观合并分支（那是 2026-10-05 之前的行为，字段回写容易和后端口径漂移）。

### handleCoupleEvent：WS 事件分发

`function handleCoupleEvent(event: Event)`：

- 入参是 `CustomEvent<{ event, username, detail }>`；`detail` 是后端拼好的中文人话文案。
- 用 `if` 链按事件名分组（不是 switch），**15 个事件名**按族处理，逐组的刷新口径见 [WS 事件链路](ws-events.md)；`wish-*` 的看板由组件自持，store 只弹提醒 + 同步角标。
- **没有兜底分支**：不认识的事件直接忽略（旧卡片的 30 来个事件后端已不再发，加兜底等于把下线功能接回来）。
- `notify()` 内部用 `ElNotification`（top-right，duration 8000）。
- 全局监听只绑一次：模块级 `globalListenerBound` 标志 + `bindGlobalListener()` 里 `window.addEventListener('arechat:couple', e => useCoupleStore().handleCoupleEvent(e))`——回调内动态解析当前活跃 pinia 的实例，多实例/测试场景安全。

### init / reset 生命周期

- **`init()`**：`bindGlobalListener()` → `loadOverview()`；established 时顺带 `loadStreak()`（ChatView 直接读 store 判断气泡/特效，不必再发请求）。catch 时把 overview 置 null 静默降级（未登录/网络异常不阻塞布局）。
- **`reset()`**：清空全部数据 ref（登出/解除关系时彻底归零）。
- **调用方（`layouts/MainLayout.vue`）**：
  - `onMounted`：已登录则 `im.init(username)` + `couple.init()`（+ 在线人数轮询、管理员待办）。
  - `watch(() => auth.username)`：重新登录时重建 `im.init` + `couple.init`；置空时 `couple.reset()`。
  - 登出流程：确认后 `im.reset()` + `couple.reset()` + `auth.logout()` → 跳 `/login`。
  - `views/CoupleView.vue` 的 `onMounted` 也调 `couple.init()` 兜底刷新总览，另补 `loadIntimacy()` 与（数据缺失时的）`loadQuestion()`。

## 组件自持数据模式（不进 store 的卡）

`CoupleWish`（`wishApi` 的看板与六个写方法）在组件内自持状态：写接口返回**整份 `WishBoardVO`**，组件拿返回值整体替换本地状态；WS 只弹提醒不刷数据；未建空间（404）静默降级。`CoupleStreak` / `CoupleQuestion` / `CoupleMemory` 的初始拉取走 store（解锁态要被 ChatView 与头部共用），后续写操作同样整份替换。新需求优先走组件自持，只有需要跨组件共享或事件驱动刷新时才进 store。

---

上一页：[页面与路由](pages-routing.md) ｜ 下一页：[API 层](api-layer.md)

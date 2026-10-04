# 状态管理（Pinia Stores）

> 本页回答：项目有哪些 store、couple store 的数据模型与惰性刷新机制、WS 事件如何分发、init/reset 生命周期由谁调用。**couple store 已从 3453 行重写为 370 行，只留六域**：总览与邀请、心情、心动值、贴贴、求抱抱、通知。

## Store 清单（`src/stores/`）

| store | 文件 | 行数级 | 职责 |
|---|---|---|---|
| `useAuthStore` | `auth.ts`（88 行） | 小 | 登录态：`username`（初值读 sessionStorage `CURRENT_USER_KEY`）、`role: 'USER'|'ADMIN'`、`loginAt`、`isLoggedIn`/`isAdmin` computed；`login`/`verify`（服务端确认会话，尽力而为）/`logout`/`clearLocal`；`register` 已废弃为直接抛错（注册改审批制，走 `authApi.register` 提交申请） |
| `useImStore` | `im.ts`（937 行） | 中 | IM 全域：好友/申请、会话与消息、**WebSocket 连接管理**（`ws(s)://location.host/ws/chat/{username}`，25s heart 心跳）、草稿 localStorage、未读/置顶/收藏/回复/撤回/表态/戳一戳等；WS push 按 `type` 分发（见 [WS 事件链路](ws-events.md)），其中 `type==='couple'` 转发为 `arechat:couple` 自定义事件 |
| `useCoupleStore` | `couple.ts`（370 行） | 小 | 只留「多组件共用 + 要靠 WS 刷新」的六域：总览与邀请、心情日记、心动值、贴贴、求抱抱、通知中心；`arechat:couple` 事件的统一消费者 |

## couple store 核心概念

### overview / space

- `overview = ref<CoupleOverview | null>`：`loadOverview()` 调 `coupleApi.overview()` 拉取，是**页面级锚点数据**（登录后 MainLayout 就拉，建立流程/纪念日/装扮类事件处理里也随时重拉）。
- 派生 computed（全部从 overview 读）：
  - `space = overview?.space ?? null`（情侣空间实体），`established = !!space`（CoupleView 据此渲染 CoupleSetup 还是主界面）
  - `incomingInvites` / `outgoingInvites`（待处理邀请列表）——驱动导航红点与头部提示
- 其余状态 ref 共 10 个，按域分组：`moods` / `moodReaction`（心情）、`intimacy`（心动值）、`bondActions` / `bondStats`（贴贴）、`comfortBoard` / `moodSync`（求抱抱）、`notifies` / `notifyUnread`（通知）。每个域配套 `loadXxx()` 与操作函数，末尾统一 `return {...}` 导出。

### loaded：惰性刷新机制（关键设计）

```ts
const loaded = ref<Record<'moods' | 'bond' | 'comfort', boolean>>({ moods: false, bond: false, comfort: false })
```

只有三个键——因为进 store 的只有这三域。规则没变：

1. 每个 `loadXxx()` 开头把对应键置 `true`（如 `loadBond()` 里 `loaded.value.bond = true`）。
2. **WS 事件只刷新已加载过的域**：`handleCoupleEvent` 各分支内 `if (loaded.value.xxx) void loadXxx()`——用户没打开过的页签不发无谓请求。
3. `reset()` 把三个键复位 `false`，同时清空全部数据 ref（登出/解除关系时彻底归零）。

新增数据域进 store 时必须同时：加 ref → 加 `loaded` 键与字面量初值 → `loadXxx` 置位 → `handleCoupleEvent` 加分支 → `reset()` 清理 → return 导出（map skill「新功能标准链路」第 3 步）。**新需求优先考虑组件自持**，别把 store 再撑回去。

### handleCoupleEvent：WS 事件分发

`function handleCoupleEvent(event: Event)`：

- 入参是 `CustomEvent<{ event, username, detail }>`；`detail` 是后端拼好的中文人话文案。
- 用 `if` 链按事件名分组（不是 switch），37 个事件名分 8 组：**建立流程 3 个** → `notify` + `loadOverview()`；**dissolved** → 先 `reset()` 再 `loadOverview()`；**anniversary-updated / anniversary-reminder / space-themed** → `notify` + `loadOverview()`；**birthday-card / birthday-eve** → `notify` + `loadNotifies()`；**mood-changed / mood-reacted**；**bond-action / bond-milestone / pet-name-changed**（爱称改名不弹通知，只刷数据与心动值）；**comfort-sent / comfort-given / night-care**。
- 末尾一个 `cardEvents` 数组兜住自持卡的 20 个事件（catch/dine/factory/quest/ceremony/echo/scratch/box + anniversaries-changed）：**只 `notify` + `loadIntimacy()` + `loadNotifies()`**，不刷新卡数据——卡数据靠组件自己的写接口返回值。
- `notify()` 内部用 `ElNotification`（top-right，duration 8000）。
- 全局监听只绑一次：模块级 `globalListenerBound` 标志 + `bindGlobalListener()` 里 `window.addEventListener('arechat:couple', e => useCoupleStore().handleCoupleEvent(e))`——回调内动态解析当前活跃 pinia 的实例，多实例/测试场景安全。
- 事件名全列见 [WS 事件链路](ws-events.md)。

### init / reset 生命周期

- **`init()`**：`bindGlobalListener()` → `loadOverview()`；catch 时把 overview 置 null 静默降级（未登录/网络异常不阻塞布局）。心跳与通知铃铛都从这条链起点拿数据。
- **`reset()`**：清空 10 个数据 ref + `notifyUnread` 归零 + `loaded` 三键复位。
- **调用方（`layouts/MainLayout.vue`）**：
  - `onMounted`：已登录则 `im.init(username)` + `couple.init()`（+ 在线人数轮询、管理员待办）。
  - `watch(() => auth.username)`：重新登录时重建 `im.init` + `couple.init`；置空时 `couple.reset()`。
  - 登出流程：确认后 `im.reset()` + `couple.reset()` + `auth.logout()` → 跳 `/login`。
  - `views/CoupleView.vue` 的 `onMounted` 也调 `couple.init()` 兜底刷新总览，并额外 `couple.loadIntimacy()`。

## 组件自持数据模式（不进 store 的七张卡）

`CoupleSurprise`（coupleApi 的刮刮乐/盲盒四个方法）与 `CoupleDining`/`CoupleFactory`/`CoupleQuest`/`CoupleCeremony`/`CoupleCatch`/`CoupleEcho`（各自的 `diningApi`/`factoryApi`/`questApi`/`ceremonyApi`/`catchApi`/`echoApi`）在组件内 `onMounted` safeLoad、自持状态、不接 WS 刷新、与 `reset` 无关；写接口返回**整份聚合 VO**，组件拿返回值整体替换本地状态；未建空间（404）静默降级。新需求优先走这条路，只有需要跨组件共享或事件驱动刷新时才进 store。

---

上一页：[页面与路由](pages-routing.md) ｜ 下一页：[API 层](api-layer.md)

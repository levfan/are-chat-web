# 页面与路由

> 本页回答：有哪些路由、每个 View 干什么、CoupleView 的页签各挂哪些组件（按当前代码实况）。
> **2026-10-05 二轮裁剪后 CoupleView 是 2 个常开页签 + 1 个隐藏页签**：`today` 今天、`wish` 愿望清单、`secret` 隐藏角落（连满 100 天才出现）。

## 路由表（`src/router/index.ts`，history 模式）

| path | name | 组件 | meta | 说明 |
|---|---|---|---|---|
| `/login` | login | `views/LoginView.vue` | title 登录 | 已登录访问会被重定向到 `/chat`；含 F93 节日文案（`login-festival`） |
| `/` | — | `layouts/MainLayout.vue` | — | 登录后壳，redirect `/chat` |
| `/chat` | chat | `views/ChatView.vue` | title 消息，requiresAuth | 私聊主界面 |
| `/friends` | — | redirect `/contacts` | — | 好友菜单已下线，旧链接落通讯录 |
| `/contacts` | contacts | `views/ContactsView.vue` | title 通讯录，requiresAuth | 好友列表/申请/添加（好友功能合并）；好友操作菜单里有「邀请建立情侣空间」入口 |
| `/couple` | couple | `views/CoupleView.vue` | title 情侣空间，requiresAuth | 本项目最大页面 |
| `/admin` | admin | `views/AdminView.vue` | title 管理后台，requiresAuth + requiresAdmin | 注册审批/公告/情侣运营统计（F45 `adminCoupleStats`） |
| `/:pathMatch(.*)*` | — | redirect `/` | — | 兜底 |

**守卫**（`beforeEach`）：未登录访问 requiresAuth → 跳 login 带 `redirect` 查询；requiresAdmin 且本地非 ADMIN 时先 `auth.verify()` 向服务端确认角色，仍非 ADMIN → 踢回 `/chat`。**afterEach** 设置 `document.title = 路由title · APP_NAME`。

## 各 View 职责

| View | 职责一句话 |
|---|---|
| `LoginView.vue` | 登录/短信验证码/注册申请（审批制，注册不产生登录态）+ F93 节日彩蛋文案 |
| `ChatView.vue` | 会话列表 + 消息流 + 输入框；情侣侧的四项视觉解锁（气泡/昵称光效/挂件/专属贴纸）从 couple store 读档位；F90/F91 工具条与彩蛋指令照旧 |
| `ContactsView.vue` | 通讯录：好友、申请处理、资料卡、生日列表 |
| `CoupleView.vue` | 情侣空间全页（下节详列） |
| `AdminView.vue` | 管理员后台：审批注册、发公告、看待办数与情侣空间统计 |

## CoupleView 结构（`src/views/CoupleView.vue`，860 行）

未建空间时整页只渲染 `CoupleSetup.vue`（邀请建立流程）。已建立时自上而下：

1. 头部卡：双人头像（连挂件/光效按档位）+ 在一起天数（`couple-days`）+ **今天（一问 · 连续）**（`couple-header-today-question`，读 store 已加载的 `question.answeredByMe` 与 `streak.currentStreak`，不再发请求；都没拉到给「—」）+ 心动值与恋爱等级（`couple-intimacy-score`，`onMounted` 调 `couple.loadIntimacy()`）+ 通知铃铛（F41 `couple-notify-*`）+ 纪念日弹窗 + 专属爱称弹窗（`couple-pet-*`，走 `PUT /profile` 的 `petName`）+ 解除关系。
   **F206 搜索框与 F207「⭐ 常用」收藏 popover 已随二轮裁剪删除**（后端 `couple_user_pin` 表和端点都没了）。
2. 横幅：F43 里程碑天数（`couple-milestone-banner`）、F47 空间周年庆（`couple-space-birthday`）
3. `CoupleProfile`（我们的宣言 / 空间主题；**贴纸墙已删**——`couple_space.stickers` 列随 ADR-0010 第 6 条下线）
4. F98 新手引导弹窗（`couple-guide-dialog`/`couple-guide-done`，localStorage 键 `arechat_couple_guide_seen`，只出现一次；文案按四张卡重写）
5. `el-tabs v-model="activeTab"`，默认 `activeTab = 'today'`

**页签定位**：`onMounted` 读 `?tab=`，白名单为 `today, wish`（`secret` 由解锁态决定，不在深链白名单里）；白名单外的值忽略；随后调 `couple.init()` 兜底刷新总览、`loadIntimacy()` 拉头部心动值、`question` 缺失时补拉一次今日一问。

## 页签与挂载组件序列（按代码顺序）

| # | name | label | lazy | 挂载组件 | 卡根 data-testid |
|---|---|---|---|---|---|
| 1 | today | 🫶 今天 | **否（默认页签，勿改，测试依赖）** | CoupleQuestion → CoupleStreak | `couple-question` / `couple-streak` |
| 2 | wish | 🌟 愿望清单 | 是 | CoupleWish | `couple-wish` |
| 3 | secret | 🥚 隐藏角落 | 是，`v-if="secretTabOpen"`（最长连续 ≥100 天才出现） | CoupleMemory | `couple-memory` |

数据口径分两类：Question/Streak 走 `stores/couple.ts`（头部与 ChatView 共用、要靠 WS 刷新）；Wish 组件内自持（写接口返回整份 `WishBoardVO` 整体替换），Memory 只读整页拉取。原 `life`/`gift` 两个页签及其六张卡、两级子页签机制、`TabExtras` 的首访提示与收藏 chip 行都随二轮裁剪删除。

**卡索引表**：`src/components/couple/coupleCards.registry.ts` 的 `COUPLE_CARDS` 现在只有 **4 条**（key=卡根 testid、label 中文名、tab 一级页签；`couple-memory` 带 `tier: 'easter-egg'`）。这张表不再服务搜索/收藏（那两个功能没了），只剩两个消费者：`?card=` 深链定位与 `e2e-live/couple-audit.spec.ts` 实时巡检的覆盖率核对。`COUPLE_TAB_LABELS` 三个：`today`/`wish`/`secret`。

组件清单共 7 个 `.vue`（`src/components/couple/`）：上表 4 个卡组件 + `CoupleSetup.vue`（未建空间整页替代）+ `CoupleProfile.vue`（头部区个性化）+ `CoupleCollapsible.vue`（F205 折叠卡壳）。

---

上一页：[架构总览](architecture.md) ｜ 下一页：[状态管理](state-management.md)

# 页面与路由

> 本页回答：有哪些路由、每个 View 干什么、CoupleView 的页签各挂哪些组件（按当前代码实况）。**CoupleView 页签已从 11 个收敛为 3 个**：`today` 今天、`life` 过日子、`gift` 小惊喜，子页签机制已删除。

## 路由表（`src/router/index.ts`，history 模式）

| path | name | 组件 | meta | 说明 |
|---|---|---|---|---|
| `/login` | login | `views/LoginView.vue` | title 登录 | 已登录访问会被重定向到 `/chat`；含 F93 节日文案（`login-festival`） |
| `/` | — | `layouts/MainLayout.vue` | — | 登录后壳，redirect `/chat` |
| `/chat` | chat | `views/ChatView.vue` | title 消息，requiresAuth | 私聊主界面 |
| `/friends` | — | redirect `/contacts` | — | 好友菜单已下线，旧链接落通讯录 |
| `/contacts` | contacts | `views/ContactsView.vue` | title 通讯录，requiresAuth | 好友列表/申请/添加（好友功能合并于此） |
| `/couple` | couple | `views/CoupleView.vue` | title 情侣空间，requiresAuth | 本项目最大页面 |
| `/admin` | admin | `views/AdminView.vue` | title 管理后台，requiresAuth + requiresAdmin | 注册审批/公告/情侣运营统计（F45 `adminCoupleStats`） |
| `/:pathMatch(.*)*` | — | redirect `/` | — | 兜底 |

**守卫**（`beforeEach`）：未登录访问 requiresAuth → 跳 login 带 `redirect` 查询；requiresAdmin 且本地非 ADMIN 时先 `auth.verify()` 向服务端确认角色，仍非 ADMIN → 踢回 `/chat`。**afterEach** 设置 `document.title = 路由title · APP_NAME`。

## 各 View 职责

| View | 职责一句话 |
|---|---|
| `LoginView.vue` | 登录/短信验证码/注册申请（审批制，注册不产生登录态）+ F93 节日彩蛋文案 |
| `ChatView.vue` | 会话列表 + 消息流 + 输入框；F90/F91 工具条贴贴 popover（`sticker-*`，走 `im.sendPoke`）与彩蛋指令（`utils/effects.ts` 的 `detectEggCommand`）；「记入约定」入口已随情侣空间裁剪移除（原跳 `/couple?tab=promises`） |
| `ContactsView.vue` | 通讯录：好友、申请处理、资料卡、生日列表 |
| `CoupleView.vue` | 情侣空间全页（下节详列） |
| `AdminView.vue` | 管理员后台：审批注册、发公告、看待办数与情侣空间统计 |

## CoupleView 结构（`src/views/CoupleView.vue`，924 行）

未建空间时整页只渲染 `CoupleSetup.vue`（邀请建立流程）。已建立时自上而下：

1. 头部卡：双人头像 + 在一起天数 + **今天双方心情**（`couple-header-today-mood`，读 overview 的 todayMine/todayPartner，谁没记留白）+ 心动值与恋爱等级（`couple-intimacy-score`，`onMounted` 调 `couple.loadIntimacy()`）+ F206 搜索框（`couple-search`）+ F207「⭐ 常用」收藏 popover（≤6，`couple-pin-*`）+ 通知铃铛（F41 `couple-notify-*`，F94 分类筛选）+ 纪念日弹窗 + 专属爱称弹窗（`couple-pet-*`）+ 解除关系
2. 横幅：F43 里程碑天数（`couple-milestone-banner`）、F47 空间周年庆（`couple-space-birthday`）
3. `CoupleProfile`（我们的宣言 / 空间主题 / 贴纸墙）
4. F98 新手引导弹窗（`couple-guide-dialog`/`couple-guide-done`，localStorage 键 `arechat_couple_guide_seen`，只出现一次）
5. `el-tabs v-model="activeTab"`，默认 `activeTab = 'today'`

**页签定位**：`onMounted` 读 `?tab=`，白名单为 `today, life, gift`，白名单外的值忽略；随后调 `couple.init()` 兜底刷新总览、调 `couple.loadIntimacy()` 拉头部心动值。

## 3 个页签与挂载组件序列（按代码顺序）

| # | name | label | lazy | 挂载组件（依代码顺序） | 卡根 data-testid |
|---|---|---|---|---|---|
| 1 | today | 🫶 今天 | **否（默认页签，勿改，测试依赖）** | CoupleMood → CoupleBond → CoupleComfort → CoupleCatch | `couple-mood` / `couple-bond` / `couple-comfort` / `couple-catch-safeword` |
| 2 | life | 🍚 过日子 | 是 | CoupleDining → CoupleFactory → CoupleQuest → CoupleCeremony | `couple-dine-today` / `couple-fy-spin` / `couple-quest-overtime` / `couple-cere-coupon` |
| 3 | gift | 🎁 小惊喜 | 是 | CoupleSurprise → CoupleEcho | `couple-surprise` / `couple-echo-deed` |

数据口径分两类：Mood/Bond/Comfort 走 `stores/couple.ts`（头部共用、要靠 WS 刷新）；Dining/Factory/Quest/Ceremony/Catch/Echo/Surprise 组件内自持，`onMounted` safeLoad，写接口用返回的整份聚合 VO 直接整体替换。

**页签附加行**：`TabExtras`（CoupleView 内的局部 render 组件）在每个页签内容顶部渲染 F208 首访提示条（`couple-tab-tip`/`couple-tab-tip-close`，localStorage 键 `arechat_couple_tab_tip_{tab}`）+ F207「我的常用」chip 行（`couple-pins`/`couple-pin-chip-{key}`）。两者都走 `jumpToCard(key)`：切页签 → `nextTick` 后按 `[data-testid]` 找到卡根 → `scrollIntoView` + 1.5s `.couple-card-flash` 高亮。

**搜索与收藏的索引表**：`src/components/couple/coupleCards.registry.ts` 的 `COUPLE_CARDS` 现在只有 **10 条**（key=卡根 testid、label 中文名、tab 一级页签），`COUPLE_TAB_LABELS` 三个。原 shared/care/rituals/letters/timeline 的两级子页签机制随裁剪整体删除，`CoupleView` 不再有 `#tab-<sub>`。

组件清单共 13 个 `.vue`（`src/components/couple/`）：上表 10 个卡组件 + `CoupleSetup.vue`（未建空间整页替代）+ `CoupleProfile.vue`（头部区个性化）+ `CoupleCollapsible.vue`（F205 折叠卡壳，7 张自持卡复用）。

---

上一页：[架构总览](architecture.md) ｜ 下一页：[状态管理](state-management.md)

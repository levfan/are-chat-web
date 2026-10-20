# 页面与路由

> 本页回答：有哪些路由、每个 View 干什么、CoupleView 这一页自上而下挂哪些组件（按当前代码实况）。
> **2026-10-20 三轮裁剪后 CoupleView 不再分页签**：一页两屏——头部卡（在一起天数 + 纪念日 + 解除关系）与一张亲密日历卡，中间只夹一条里程碑天数横幅。

## 路由表（`src/router/index.ts`，history 模式）

| path | name | 组件 | meta | 说明 |
|---|---|---|---|---|
| `/login` | login | `views/LoginView.vue` | title 登录 | 已登录访问会被重定向到 `/chat`；含 F93 节日文案（`login-festival`） |
| `/` | — | `layouts/MainLayout.vue` | — | 登录后壳，redirect `/chat` |
| `/chat` | chat | `views/ChatView.vue` | title 消息，requiresAuth | 私聊主界面 |
| `/friends` | — | redirect `/contacts` | — | 好友菜单已下线，旧链接落通讯录 |
| `/contacts` | contacts | `views/ContactsView.vue` | title 通讯录，requiresAuth | 好友列表/申请/添加（好友功能合并）；好友操作菜单里有「邀请建立情侣空间」入口 |
| `/couple` | couple | `views/CoupleView.vue` | title 情侣空间，requiresAuth | 一页两屏：在一起天数 + 纪念日 + 一张亲密日历（曾是本项目最大页面，三轮裁剪后 ChatView 才是） |
| `/admin` | admin | `views/AdminView.vue` | title 管理后台，requiresAuth + requiresAdmin | 注册审批/用户管理/全站公告 |
| `/:pathMatch(.*)*` | — | redirect `/` | — | 兜底 |

**守卫**（`beforeEach`）：未登录访问 requiresAuth → 跳 login 带 `redirect` 查询；requiresAdmin 且本地非 ADMIN 时先 `auth.verify()` 向服务端确认角色，仍非 ADMIN → 踢回 `/chat`。**afterEach** 设置 `document.title = 路由title · APP_NAME`。

## 各 View 职责

| View | 职责一句话 |
|---|---|
| `LoginView.vue` | 登录/短信验证码/注册申请（审批制，注册不产生登录态）+ F93 节日彩蛋文案 |
| `ChatView.vue` | 会话列表 + 消息流 + 输入框；**情侣侧的视觉解锁（专属气泡/昵称光效/头像挂件/专属贴纸包）已在 2026-10-20 三轮裁剪整段下线**，本页不再 import couple store；F90/F91 工具条与彩蛋指令照旧；**消息收藏/全局搜索/快捷短语/字数统计入口均在 2026-10-20 删除**，**拍一拍发送入口也随后移除**（历史 poke 消息仍展示） |
| `ContactsView.vue` | 通讯录：好友、申请处理、资料卡、生日列表 |
| `CoupleView.vue` | 情侣空间全页（下节详列） |
| `AdminView.vue` | 管理员后台：审批注册、用户管理、发公告 |

## CoupleView 结构（`src/views/CoupleView.vue`，269 行）

未建空间时整页只渲染 `CoupleSetup.vue`（邀请建立流程）。已建立时单栏自上而下，两屏就装完了：

1. 头部卡（`couple-space`）：双人头像（`couple-partner-avatar`，挂件与光效已随解锁外观下线，只剩普通头像）+ 在一起天数（`couple-days`）+ 纪念日行（`couple-anniv-line`，没定时显示「还没定纪念日」）+「纪念日」按钮（`couple-anniv-edit`，弹窗里 `el-date-picker` 只准选今天以前）+「解除关系」（`couple-dissolve`，先过 `ElMessageBox.confirm`）。
   **F206 搜索框与 F207「⭐ 常用」收藏 popover 已随二轮裁剪删除**（后端 `couple_user_pin` 表和端点都没了）；**F41 通知中心与铃铛已在 2026-10-20 删除**（WS 提醒仍以 `ElNotification` 弹出）；心动值格（`couple-intimacy-score`）、爱称弹窗（`couple-pet-*`）、30 天恋爱称号徽章与宣言区（`CoupleProfile`）同批撤掉。
2. 里程碑天数横幅（`couple-milestone-banner`）：只在天数命中 100/200/365/520/666/888/1000/1314/2000 时出现，其余日子不打扰；F47 空间周年庆横幅已删。
3. 亲密日历卡 `CoupleCalendar`（卡根 `couple-calendar`）：这一页唯一的功能卡，经期与亲密记录的唯一入口（记经期开始/补结束日/记一笔边缘或性生活/删错记都在卡内）。

**挂载即拉数**：`onMounted` 只调 `couple.init()` 兜底刷新总览（邀请状态可能变了）；日历卡自己 `onMounted` 敲一次 `calendarApi.calendarMonth`。**`?tab=` 深链已随页签一起取消**，`?card=` 定位与卡索引表也一起没了。**F98 新手引导弹窗已删**（这一页自解释，不再弹一次三步漫游）。

## 页面两屏与挂载组件序列（按代码顺序）

| # | 区块 | 挂载组件 | 卡根 data-testid |
|---|---|---|---|
| 1 | 头部 + 里程碑横幅 | `CoupleView.vue` 内联（`ImAvatar` + 纪念日弹窗 + 解除关系按钮） | `couple-space` / `couple-milestone-banner` |
| 2 | 亲密日历 | `CoupleCalendar.vue`（外面套一层 `CoupleCollapsible` 卡壳） | `couple-calendar` |
| — | 未建空间时的整页替代 | `CoupleSetup.vue` | `couple-setup` |

数据口径分两类：总览与邀请走 `stores/couple.ts`（MainLayout 登录后就拉、侧栏角标也读它）；日历由组件自持——一个月度读口 `calendarMonth` 把经期覆盖日、区间、周期统计与亲密标记一次给齐，五个写口（`periodApi` 三个 + `intimateApi` 两个）都不回数据，写完按当前可见月重拉。日历不接 WS、不写 store。原 `life`/`gift` 两个页签及其六张卡、两级子页签机制、`TabExtras` 的首访提示与收藏 chip 行都随二轮裁剪删除，`secret` 百日回顾页签也随后下线；**F208 每个页签的首访提示条（`couple-tab-tip`）与 el-tabs 本身在 2026-10-20 三轮裁剪一起撤掉**，每日一问 / 连续互动打卡 / 愿望清单三张卡连同姨妈记录、亲密记录两张独立看板卡并入这一张日历卡。

**`?card=` 深链与卡索引表已作废**：`src/components/couple/coupleCards.registry.ts` 只剩一张卡、失去对象，随三轮裁剪删除；`e2e-live/couple-audit.spec.ts` 仍 import 它，而 `e2e-live/` 不在 `tsconfig.json` 的 include 与 Vitest 的 `include` 里，所以 `pnpm build`/`pnpm test` 都不会因此报错。

组件清单共 3 个 `.vue`（`src/components/couple/`）：`CoupleCalendar.vue`（唯一的功能卡）+ `CoupleSetup.vue`（未建空间整页替代）+ `CoupleCollapsible.vue`（F205 折叠卡壳）。

---

上一页：[架构总览](architecture.md) ｜ 下一页：[状态管理](state-management.md)

# 页面与路由

> 本页回答：有哪些路由、每个 View 干什么、CoupleView 的 11 个页签各挂哪些组件（按当前代码实况）。

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
| `ChatView.vue` | 会话列表 + 消息流 + 输入框；F90/F91 工具条贴贴 popover（`sticker-*`，走 `im.sendPoke`）与彩蛋指令（`utils/effects.ts` 的 `detectEggCommand`）；「记入约定」可跳 `/couple?tab=promises` |
| `ContactsView.vue` | 通讯录：好友、申请处理、资料卡、生日列表 |
| `CoupleView.vue` | 情侣空间全页（下节详列） |
| `AdminView.vue` | 管理员后台：审批注册、发公告、看待办数与情侣空间统计 |

## CoupleView 结构（`src/views/CoupleView.vue`）

未建空间时整页只渲染 `CoupleSetup.vue`（邀请建立流程）。已建立时自上而下：

1. 头部区：双人头像 + 在一起天数 + 连续晚安 + 心动值/恋爱等级（`onMounted` 调 `couple.loadIntimacy()`）+ 纪念日弹窗 + 专属爱称弹窗（`couple-pet-*`）+ 通知铃铛弹窗（F41 `couple-notify-*`，`NOTIFY_FILTERS` 分类筛选）+ `CoupleProfile`（宣言/主题/贴纸个性化）
2. 横幅：早晚安解锁主题 banner（`couple-theme-banner`）、里程碑横幅（`couple-milestone-banner`）、空间周年庆（`couple-space-birthday`）
3. `CoupleTodayBoard`（F95 今日看点，`@goto` 直接切页签）
4. 逾期约定提示条（`couple-overdue-*`）
5. `el-tabs v-model="activeTab"`，默认 `activeTab = 'promises'`

**页签定位**：`onMounted` 读 `?tab=` 白名单后设 `activeTab`；白名单为 `bond, promises, rituals, surprise, letters, mood, care, shared, badges, timeline`（注意：当前代码**不含 `growth`**，`?tab=growth` 不生效）。`onMounted` 还调 `couple.init()` 兜底刷新总览。

## 11 个页签与挂载组件序列（按代码顺序）

| # | name | label | lazy | 挂载组件（依代码顺序） | 内容一句话 |
|---|---|---|---|---|---|
| 1 | bond | 🫶 贴贴 | 是 | CoupleBond → CoupleGame | 贴贴动作宫格/里程碑/动作流 + 恋爱加成清单/互动热力图/心情曲线/恋爱红绿灯 |
| 2 | promises | 🤝 约定 | **否（默认页签，勿改，测试依赖）** | CouplePromises → CoupleSecure → CouplePact | 双向约定卡 + 确定感与安全感 F120-F129 + 恋爱条约 |
| 3 | rituals | 🌅 小仪式 | 是 | CoupleRituals → CoupleDaily → CoupleTruth → CoupleFunTalk → CouplePlay | 早晚安/今日一问/晚安故事 + 甜蜜任务/运势/默契考验 + 真心话 F66/心灵感应 F68 + 趣味游戏 F130-F139 |
| 4 | growth | 🌱 养成 | 是 | CoupleChallenge → **CoupleCoach** → CoupleReadWatch → CoupleWishBoard → CoupleDict | 双人挑战赛/恋爱存折/百日之约 + 成长教练 F150-F159（习惯搭子/感恩便签/情绪日记/拖延互助…） + 共读/追剧 + 心愿互换/旅行地图/下次一定 + 恋爱词典/星座配对 |
| 5 | surprise | 🎁 惊喜 | 是 | CoupleSurprise → CoupleGarden | 惊喜 F50-F59（刮刮乐/盲盒/心动闹钟/思念速递/藏宝图/告白重现） + 爱情花园/每日玫瑰/幸运签 |
| 6 | letters | 💌 悄悄话（label 动态：未读数 >0 时追加数字） | 是 | CoupleLetter → CoupleWhisperBox → CoupleCapsule → CoupleKeepsake → CouplePoem | 悄悄话信箱 + 树洞 F67/情话储蓄罐 F69 + 时光胶囊 F84 + 回忆收藏 F83/F88/F89 + 文字浪漫 F160-F169 |
| 7 | mood | 💗 心情 | 是 | CoupleMood → **CoupleMoodRelay** | 心情日记 + 心情回应 + F102 情绪接力棒（relay-*，map skill 页签表未列此组件，代码实况如此） |
| 8 | care | 🌈 关怀 | 是 | CoupleCare → CoupleComfort → CoupleMakeup → CoupleSoft → CoupleSpark | 情绪天气/急救箱/和好卡/夸夸墙/生理期 + 求抱抱 F60/话题卡 F63/同步率 F64 + 矛盾复盘 F61/道歉券 F62 + 柔软表达 + 默契亲密 F170-F179 |
| 9 | shared | 🗓️ 共享空间 | 是 | CoupleCityCard → CoupleDistance → CoupleCountdown → CoupleLife → CoupleShared → **CoupleManage** → CoupleDailyLife → CoupleFund | 异地恋城市 + 异地时空同步 F110-F119 + 倒数日 + 生活共享（记账/家务/约会/习惯/暗号） + 共享清单 + 生活经营 F180-F189（组件自持数据） + 深度陪伴 F140-F149（今日主题曲/梦境手账/美食地图/TA 使用手册/情绪 SOS/每日三问等） + 心愿基金 |
| 10 | badges | 🏅 徽章 | 是 | CoupleBadges → CoupleReport → CoupleAnniversaryReport → CoupleHeatmap | 里程碑徽章/行为成就墙 + 恋爱月报/数据总览 + 周年报告 F85/生日回顾 F86 + 年度热力日历 F96（store 键 `yearHeatmap`） |
| 11 | timeline | 📖 时光轴 | 是 | ⏳ 时光流：CoupleOnThisDay → CoupleFirsts → CoupleHeartMoments → CoupleTimeline → CoupleChronicle；🏛️ 博物馆：CoupleMuseum | 那年今天 + 第一次 F46 + 心动时刻 F36 + 恋爱时光轴 + 回忆资产聚合 F80-F82 + 时光博物馆 F190-F199 |

> 批次十六（F200-F204）起，shared/care/rituals/letters/timeline 五个页签内部拆为两级 el-tabs 子页签（DOM `#tab-<sub>`）：shared=过日子/经营所、care=情绪急救/默契亲密、rituals=每日仪式/playful 时间、letters=寄给你/收藏册、timeline=时光流/博物馆；配套 47 卡注册表 `coupleCards.registry.ts` + 头部搜索（F206）+ 常用收藏 chips（F207）+ 首访气泡（F208）。

注：F149 恋爱仪表盘改版落在 `CoupleTodayBoard.vue` 内（读 store `couple.dashboard`，testid `couple-dashboard*`）；`CoupleSpark.vue` 首卡 F176 默契仪表盘也用了 `data-testid="couple-dashboard"`，两处 testid 同名（现状记录，改测试时留意）。`CoupleDailyLife.vue` 承载 F140-F149 深度陪伴各卡。

组件清单共 50 个（`src/components/couple/`）：上表 48 个挂载组件 + `CoupleSetup.vue`（未建空间整页替代）+ `CoupleProfile.vue`（头部区个性化）。

---

上一页：[架构总览](architecture.md) ｜ 下一页：[状态管理](state-management.md)

---
name: are-chat-web-map
description: are-chat-web 前端项目地图（Vue 3 + Vite + Pinia + Element Plus）。凡在 are-chat-web 中开发新功能、修复缺陷、评审改动，开工前必须先加载本 skill——它提供目录地图、组件/页签映射、状态管理与 API 惯例、测试与构建命令、开发规范硬性流程（第六节交付门禁，含版本号/发版规则）与产品红线。完成功能后若新增组件/页签/接口，须同步更新本文件。
---

# are-chat-web 前端项目地图

> 本文件是给 AI agent 看的项目速查地图。**每次改完代码，若组件/页签/接口有增删，必须同步更新本 skill**（与功能同批提交，commit type 用 `docs`）。

## 一、技术栈与命令

- Vue 3 `<script setup lang="ts">` + Vite 6 + Pinia + Vue Router + Element Plus + TypeScript
- 测试：Vitest（jsdom），在 `tests/unit/`；构建：`pnpm build`（含 vue-tsc 类型检查，**测试 mock 数据类型必须同步**）；测试：`pnpm test`
- 版本号唯一来源 `package.json` 的 version（alpha → rc → stable 阶梯，升级独立 commit，规范见 `.agents/skills/version-release/SKILL.md`）

## 二、目录地图（src/）

| 目录 | 职责 |
|---|---|
| `api/` | 接口层：`http.ts`（get/postJson/putJson/delete 封装）+ 各域 api 文件（couple.ts / im.ts / ...） |
| `stores/` | Pinia：`couple.ts`（情侣空间，含 WS 事件分发）、`im.ts`、`auth.ts` 等 |
| `views/` | 页面：ChatView / ContactsView / CoupleView / AdminView / LoginView |
| `components/couple/` | 情侣空间全部组件（见下） |
| `components/im/` | 聊天相关组件（消息流、输入框、头像等） |
| `types/index.ts` | 全部 TS 类型（按域分节，情侣空间在 `// ============ 情侣空间` 区块） |
| `layouts/` | MainLayout（登录后壳，调用 couple store 的 init 绑定 WS） |
| `router/` | 路由表 |
| `utils/` | coupleTheme.ts（早晚安解锁主题/贴纸）等 |

## 三、情侣空间前端全景

`views/CoupleView.vue` 用 el-tabs 组织 **11 个页签**（name 即路由 `?tab=` 参数值，除默认外均 lazy）。批次十六（F200-F204）把 rituals/letters/care/shared/timeline 5 个臃肿页签拆成嵌套二级子页签（子 pane 均 lazy，子页签 DOM id 形如 `#tab-<sub>`，测试可点）：

| 页签 name | 组件 | 内容 |
|---|---|---|
| bond | CoupleBond + CoupleGame | 贴贴动作宫格/贴贴里程碑/累计统计/动作流 + 恋爱加成清单/互动热力图/心情曲线/恋爱红绿灯 |
| promises（默认） | CouplePromises + CoupleSecure + CouplePact | 双向约定卡 + 确定感与安全感(F120-F129：安全感账户/恋爱体检/十年之约/愿景板/承诺博物馆/信任存折/恋爱年轮/双人契约/守护兽) + 恋爱条约 |
| rituals | 子页签 ceremony「🌙 每日仪式」CoupleRituals+CoupleDaily+CoupleTruth / fun「🎲 玩趣时间」CoupleFunTalk+CouplePlay | 早晚安/今日一问(含 F48 互评表情)/晚安故事 + 甜蜜任务/恋爱运势/默契考验 + 今日真心话(F66 双方同题必答+存档)/心灵感应(F68 每天三轮选题作答自动结算) + 趣味游戏(F130-F139：今日抽签区心动概率/恋爱天气/塔罗、家务骰子纯前端、一百问答一题解锁、出题考TA、世界情话课、周末盲选、情话Battle、抽象画 seed SVG) |
| growth | CoupleChallenge + CoupleReadWatch + CoupleWishBoard + CoupleDict | 共同养成(F70-F79)：双人挑战赛/恋爱存折/百日之约 + 共读计划/追剧清单 + 心愿互换/旅行心愿地图/下次一定清单 + 恋爱词典/星座配对 |
| surprise | CoupleSurprise + CoupleGarden | 惊喜与期待(F50-F59)：刮刮乐/恋爱盲盒/心动闹钟/思念速递/藏宝图/告白重现 + 爱情花园浇水养成/每日玫瑰/幸运签 |
| letters | 子页签 send「💌 寄给你」CoupleLetter+CoupleWhisperBox+CoupleCapsule+CouplePoem / collect「🗃️ 收藏册」CoupleKeepsake | 悄悄话信箱（情话抽卡/情书模板）+ 匿名树洞(F67)/情话储蓄罐(F69 21 点利息送达) + 时光胶囊(F84 远期预设 1/3/5/10 年) + 文字浪漫(F160-F169)：情诗接龙/醒来第一条/心情漂流瓶/数字密码情书(前端 a=1..z=26 编码器)/灵魂一问/三行情书/贴纸手账/恋爱语录机；收藏册=回忆资产收藏系(F83/F88/F89)：甜蜜语录册/电影票根墙/我们的歌单 |
| mood | CoupleMood | 心情日记 + 心情回应（回应按钮在本组件内） |
| care | 子页签 rescue「🚑 情绪急救」CoupleCare+CoupleComfort+CoupleMakeup / intimate「✨ 默契亲密」CoupleSoft+CoupleSpark | 情绪天气/急救箱/和好卡/夸夸墙/生理期关怀 + 求抱抱(F60 感受按钮/话术卡回应)/陪聊话题卡(F63)/情绪同步率(F64) + 矛盾复盘(F61 和好锦囊)/道歉券(F62)；默契亲密(F170-F179)：默契仪表盘(卡 testid `couple-spark-dash`)/同频共振按键(10s 窗口)/爱语测评 12 题+对照卡/「如果」问答/心动闪光/动作暗语/心动日历邮戳/默契周报 |
| shared | 子页签 daily「🧾 过日子」CoupleCityCard+CoupleDistance+CoupleCountdown+CoupleLife+CoupleShared+CoupleDailyLife+CoupleFund / manage「🏪 经营所」CoupleManage | 异地恋(对方时区/见面倒数/隔空牵手/想念计量/作息/见面信/云约会/平安卡/见面日记/能量) + 倒数日/生活共享(记账/家务/约会/习惯/暗号)/共享清单 + 深度陪伴(F140-F149：今日主题曲/接头暗号/夸夸复制/情绪SOS抱抱/每日三问/梦境手账/美食地图/TA使用手册/自定义成就) + 心愿基金；经营所=生活经营(F180-F189：家庭会议/本周主理人/技能交换所/月度互评/家庭应急卡/情侣存档点/家务积分市场/五年计划双轨/纪念日策划案/经营周报) |
| badges | CoupleBadges + CoupleReport + CoupleAnniversaryReport + CoupleHeatmap | 里程碑徽章 + 行为成就墙 + 恋爱月报/数据总览 + 回忆资产报告系(F85-F86)：周年报告/生日回顾 + 年度热力日历(F96，store 键 `yearHeatmap` 避免与游戏化 heatmap 撞名) |
| timeline | 子页签 flow「⏳ 时光流」CoupleOnThisDay+CoupleFirsts+CoupleHeartMoments+CoupleTimeline+CoupleChronicle / museum「🏛️ 博物馆」CoupleMuseum | 那年今天 + 我们的第一次(F46) + 心动时刻(F36) + 恋爱时光轴 + 回忆资产聚合系(F80-F82)：恋爱编年史/记忆考古卡/恋爱问答机；博物馆=时光博物馆(F190-F199) |

头部区：双人头像 + 在一起天数 + 连续晚安 + 心动值 + 纪念日弹窗 + 专属爱称弹窗（`couple-pet-*`）+ 通知铃铛（F41 `couple-notify-*`）+ **F206 找功能搜索框（`couple-search`，回车按 label 包含匹配 → 切一级/子页签 + scrollIntoView + 1.5s `.couple-card-flash` 高亮）+ F207「⭐ 常用」收藏 popover（`couple-pin-open`/`couple-pin-panel`/`couple-pin-opt-*`/`couple-pin-save`，≤6 个，pin 成功后各页签顶部渲染 `couple-pins` chip 行，点 chip 同款跳转）** + 里程碑/周年庆横幅（F43/F43+F47）+ 空间个性化 CoupleProfile（宣言/主题/贴纸）。F208：每个一级页签首次进入在内容顶部显示一行提示条（`couple-tab-tip`/`couple-tab-tip-close`，localStorage 键 `arechat_couple_tab_tip_{tab}`），页签附加行由 CoupleView 内局部组件 `TabExtras`（render 函数）统一渲染。

**新功能标准链路**（照抄任意现成组件）：
1. `types/index.ts` 追加 VO 类型（放情侣空间区块末尾）
2. `api/couple.ts` 追加接口方法（带中文注释）
3. `stores/couple.ts`：新增 ref 状态 → 加入 `loadedLists`（WS 只刷新已加载过的）→ load/操作函数 → `handleCoupleEvent` 加 case（notify + 刷新对应数据）→ reset() 清理 → return 导出
4. 新组件放 `components/couple/`，根元素 `data-testid="couple-xxx"`，按钮/输入框同样补 testid（测试与 e2e 依赖）
5. CoupleView 挂到对应页签（页签加 `lazy`）

WS 事件约定：后端 `ImPushService.pushCoupleEvent(Both)` 推 `{type:'couple', event, detail}`，im store 转发为 `arechat:couple` 自定义事件，couple store `handleCoupleEvent` 按 event 名分发。现有 event 清单见后端各 Service（如 bond-action、task-done、tacit-settled、reconcile-accepted、capsule-sealed、countdown-reminder、scratch-scratched、box-opened、garden-watered、comfort-sent、comfort-given、night-care、peace-review-done、sorry-used、truth-answered、whisper-answered、telepathy-matched、love-bank-interest、challenge-done、passbook-deposit、hundred-done、wish-accepted、travel-visited、nexttime-done、read-finished、watch-finished、dict-added、quote-kept、ticket-added、song-added、capsule-due、birthday-eve 等）。

批次六~十（F100-F149）新增事件（`stores/couple.ts` `handleCoupleEvent` 均有 case）：沟通区 whisper-*→（F36 旧名）/room-*/relay-*/story-*/sorry-*/vocab-*（F100-F109）；异地恋 handhold-*/miss-*/routine-updated/reunion-letter-sealed|opened（注意与悄悄话信箱 letter-opened 已改名区分）/cloud-*/safety-ping/reunion-logged/energy-*（F110-F119）；确定感 security-*/decade-*/vision-*/oath-*/trust-deposit/contract-*/pet-*（F120-F129）；游戏 survey-answered/quiz-*/love-word-kept/blind-*/battle-*/art-added（F130-F139）；陪伴 dream-written/food-added|checkin/fact-added/sos-ping|held/three-saved|both/badge-added|issued（F140-F149）。

撞名备忘（新增类型/方法前先 grep types 与 api）：CoupleLetterVO/CoupleMissVO/CouplePraiseVO/CoupleBadgeVO/CoupleWeatherVO 均已被占用（批次十改用 CoupleReunionLetterVO/CoupleMissDailyVO/CoupleDailyPraiseVO/CoupleCustomBadgeVO/CoupleLoveWeatherVO）；api `openLetter`/`badges` 已占用（拆信用 openReunionLetter、自定义成就用 customBadges）；store `missBoard`/`weather` 已占用（思念计量用 missDaily、恋爱天气用 loveWeather）。F149 恋爱仪表盘改版在 `CoupleTodayBoard.vue`（couple.dashboard + `couple-dashboard-*` testid）。批次十一~十三新增撞名处理：`CoupleQuizQuestionVO` 被 F82 占用（爱语测评卷用 `CoupleSparkQuizVO`）；`CoupleCipherVO` 被暗号小本本占用（密码情书用 `CoupleCipherNoteVO`）；api `habits/badges/openLetter/weather/missBoard` 已占用（coach 用 coachHabits/coachCreateHabit/coachCheckinHabit，store 用 streaks/thanksNotes 等前缀）；store `feelings` 已占用（coach 情绪用 coachFeel*）。

批次十一~十三（F150-F179）新增事件（`stores/couple.ts` `handleCoupleEvent` 均有 case）：成长系 streak-started/streak-checkin/streak-done/thanks-note/feel-logged/week-star-saved|both/read-thought/delay-added|nagged|done/praise-bank-added（F150-F159，growth 页签 CoupleCoach）；文字浪漫 poem-line/poem-made|liked/morning-note-sealed|read/bottle-tossed|replied/cipher-note-made|cracked/soul-answered|both/journal-updated（F160-F169，letters 页签 CouplePoem）；默契亲密 love-lang-done/heart-flash/whatif-answered|both/signal-added/sync-tap-hit（F170-F179，care 页签 CoupleSpark）。store 分区：coach 区（streaks/thanksNotes/coachFeel*/coachWeekStar/coachRead/delayTasks/praiseBankList/coachMorning/coachYearKeyword）、poem 区（poemChain/poems3/morningBox/bottleList/cipherNoteList/soulQ/journalList/loveQuote/letterTemplates/stickerList）、spark 区（loveLang/loveLangPair/flashList/whatIfQ/signalList/tapToday/sparkDash/heartDayList/syncRankList/sparkWeekly）。

批次十四（F180-F189 生活经营）：api 层新增独立分组对象 `manageApi`（`src/api/couple.ts`，与 coupleApi 并列导出）；类型统一 `CoupleManage*VO` 前缀（Meeting/Host/Skill/MonthReview+MonthBoard/EmergencyCard/Snapshot/Reward+PointHistory+PointAccount/FiveYearPlan/AnnivPlan/Weekly）；组件 `CoupleManage.vue` 挂 shared 页签 CoupleShared 之后，**组件内自持数据**（onMounted 并发拉取 manageApi，不进 store、无 WS 事件），testid 前缀 `couple-meeting-*`/`couple-host-*`/`couple-skill-*`/`couple-month-*`/`couple-emergency-*`/`couple-snapshot-*`/`couple-point-*`/`couple-plan-*`/`couple-annivplan-*`/`couple-manage-weekly-*`；测试 mock 需在 `vi.mock('@/api/couple')` 工厂里同时返回 `manageApi`（已带默认空数据 Proxy）。

批次十五（F190-F199 时光博物馆）：api 层新增独立分组对象 `museumApi`（`src/api/couple.ts`，基址 `/api/couple/museum`，写接口均返回最新全量列表）；类型统一 `CoupleMuseum*VO` 前缀（DocScene/Exhibit/Achievement/YearCounter/Mirror/SilverLine/Word/Rule/Dnd/Chapter/Book）；组件 `CoupleMuseum.vue` 挂 timeline 页签 CoupleTimeline 之后，同样**组件内自持数据**（onMounted 并发拉取 museumApi，未建空间时静默降级），testid 前缀 `couple-museum-*`（scenes/exhibits/mirror/silver/words/achievements/rules/dnd/book）；测试 mock 工厂需同时返回 `museumApi`（默认空数据 Proxy）。

批次十六（F200-F208 体验重构）：新增功能卡索引表 `src/components/couple/coupleCards.registry.ts`（`COUPLE_CARDS`：{ key=卡根 data-testid, label 中文名, tab 一级页签, sub 子页签 }，覆盖全部 47 张卡 + `COUPLE_TAB_LABELS`/`findCardByKey`/`searchCoupleCards`），F206 搜索与 F207 收藏、跳转高亮均以 key 为唯一标识；api 层新增 `pinApi`（GET/POST `/api/couple/pin`，`CouplePinVO { mine, partner }`，>6 后端 400、无空间 404 前端静默），数据在 CoupleView 加载（established 时 `pinApi.list()`），**测试 `vi.mock('@/api/couple')` 工厂必须同时返回 `pinApi`**；CoupleView `?tab=` 白名单补齐 growth；CoupleSpark 默契仪表盘卡根 testid 由重复的 `couple-dashboard` 改为 `couple-spark-dash`（`couple-dashboard` 专属 CoupleTodayBoard F149）。

批次五体验项（F90-F99）落点：F90/F91 在 `ChatView.vue`（工具条贴贴 popover `data-testid="sticker-*"` 走 `im.sendPoke`；彩蛋指令 `utils/effects.ts` 的 `detectEggCommand`，onSend 命中即换彩蛋文案+playEffect）；F93 在 `LoginView.vue`（`FESTIVAL_LINES` 按 MM-dd 命中显示 `data-testid="login-festival"`）；F94 通知分类筛选在 CoupleView 通知弹窗（`NOTIFY_FILTERS` + `filteredNotifies`）；F95 `CoupleTodayBoard` 挂 CoupleProfile 之下全局区（`@goto` 切页签）；F98 新手引导 dialog（localStorage `arechat_couple_guide_seen` 只弹一次）。

## 四、惯例与红线

- 交互文案：情侣场景，可爱口语化 + emoji；错误提示直接 `ElMessage.error(e instanceof Error ? e.message : '兜底文案')`（后端 message 已是中文人话）
- 样式：组件内 scoped；间距/圆角参考现有组件；主题色 `#f56c6c`（粉红），跟随暗色变量（`var(--im-muted)` 等）
- 类型红线：`pnpm build` 会做 vue-tsc 检查——改了 types 里的接口（如给 VO 加字段），**必须同步改 tests/unit/couple.spec.ts 的 mock 工厂**，否则构建失败
- 测试：`tests/unit/couple.spec.ts` 依赖默认页签 `promises`（新增页签不要改默认值）；新组件核心交互应补用例
- HTTP 封装在 `api/http.ts`：`http.get<T>(url)`、`http.postJson<T>(url, body)`、`http.putJson`、`http.delete`

## 五、给 agent 的快速上手路径

1. 开工先读本 skill；提交规范见 `.agents/skills/git-commit/SKILL.md`
2. 加一个新功能卡：找一个最像的组件抄结构（如加"XX墙"→ 参考 CoupleCare 里的夸夸墙区块）
3. 涉及后端新事件：在 `stores/couple.ts` 的 `handleCoupleEvent` 加 case
4. 提交前：`pnpm build`；改了逻辑跑 `pnpm test`
5. 对应后端模块地图见 are-chat 仓库的 `are-chat-map` skill

## 六、开发规范硬性流程（交付门禁）

规范全集在专项 skill（git-commit / version-release）里，本节只做流程串联与红线登记，不复述细节：

1. **开工**：必读本 skill；提交拆分/架构师复审清单 → `.agents/skills/git-commit/SKILL.md`；升版/发版判级 → `.agents/skills/version-release/SKILL.md`
2. **编码**：走第三节「新功能标准链路」；新 VO 类型加 Couple+域前缀并先 grep 防撞名（见撞名备忘）；不改默认页签 `promises`
3. **构建**：`pnpm build`（含 vue-tsc）必过；改了 types 同步测试 mock 工厂；涉逻辑改动 `pnpm test` 全绿
4. **提交**：按改动性质分组（依赖/组件页面/样式/文档），一 commit 一性质；信息 `type(scope): 中文描述`
5. **推送**：commit → `git pull --no-rebase` → push；失败保留本地 commit 并报告，不 force push
6. **版本**：`package.json` 为唯一版本源，任何代码/文案/测试禁止写死版本号；agent 按 version-release 判级参考自主升版、独立 commit、不建 tag；用户说「发版/发布版本」= 无条件立即完整发版流程
7. **收尾**：新增/删除组件、页签、接口、WS 事件 → 更新本 skill 对应小节，与功能同批提交

**产品红线（用户长期约束）**：情侣功能注重情绪价值；**不做照片/视频上传类功能**（服务器部署要求高）；文案可爱口语化+emoji（第四节惯例）。

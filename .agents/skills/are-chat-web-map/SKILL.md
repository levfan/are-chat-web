---
name: are-chat-web-map
description: are-chat-web 前端项目地图（Vue 3 + Vite + Pinia + Element Plus）。凡在 are-chat-web 中开发新功能、修复缺陷、评审改动，开工前必须先加载本 skill——它提供目录地图、组件/页签映射、状态管理与 API 惯例、测试与构建命令，避免重新通读项目。完成功能后若新增组件/页签/接口，须同步更新本文件。
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

`views/CoupleView.vue` 用 el-tabs 组织 **11 个页签**（name 即路由 `?tab=` 参数值，除默认外均 lazy）：

| 页签 name | 组件 | 内容 |
|---|---|---|
| bond | CoupleBond + CoupleGame | 贴贴动作宫格/贴贴里程碑/累计统计/动作流 + 恋爱加成清单/互动热力图/心情曲线/恋爱红绿灯 |
| promises（默认） | CouplePromises + CoupleSecure + CouplePact | 双向约定卡 + 确定感与安全感(F120-F129：安全感账户/恋爱体检/十年之约/愿景板/承诺博物馆/信任存折/恋爱年轮/双人契约/守护兽) + 恋爱条约 |
| rituals | CoupleRituals + CoupleDaily + CoupleTruth + CoupleFunTalk + CouplePlay | 早晚安/今日一问(含 F48 互评表情)/晚安故事 + 甜蜜任务/恋爱运势/默契考验 + 今日真心话(F66 双方同题必答+存档)/心灵感应(F68 每天三轮选题作答自动结算) + 趣味游戏(F130-F139：今日抽签区心动概率/恋爱天气/塔罗、家务骰子纯前端、一百问答一题解锁、出题考TA、世界情话课、周末盲选、情话Battle、抽象画 seed SVG) |
| growth | CoupleChallenge + CoupleReadWatch + CoupleWishBoard + CoupleDict | 共同养成(F70-F79)：双人挑战赛/恋爱存折/百日之约 + 共读计划/追剧清单 + 心愿互换/旅行心愿地图/下次一定清单 + 恋爱词典/星座配对 |
| surprise | CoupleSurprise + CoupleGarden | 惊喜与期待(F50-F59)：刮刮乐/恋爱盲盒/心动闹钟/思念速递/藏宝图/告白重现 + 爱情花园浇水养成/每日玫瑰/幸运签 |
| letters | CoupleLetter + CoupleWhisperBox + CoupleCapsule + CoupleKeepsake | 悄悄话信箱（情话抽卡/情书模板）+ 匿名树洞(F67)/情话储蓄罐(F69 21 点利息送达) + 时光胶囊(F84 远期预设 1/3/5/10 年) + 回忆资产收藏系(F83/F88/F89)：甜蜜语录册/电影票根墙/我们的歌单 |
| mood | CoupleMood | 心情日记 + 心情回应（回应按钮在本组件内） |
| care | CoupleCare + CoupleComfort + CoupleMakeup | 情绪天气/急救箱/和好卡/夸夸墙/生理期关怀 + 求抱抱(F60 感受按钮/话术卡回应)/陪聊话题卡(F63)/情绪同步率(F64) + 矛盾复盘(F61 和好锦囊)/道歉券(F62) |
| shared | CoupleCityCard + CoupleDistance + CoupleCountdown + CoupleLife + CoupleShared + CoupleDailyLife + CoupleFund | 异地恋(对方时区/见面倒数/隔空牵手/想念计量/作息/见面信/云约会/平安卡/见面日记/能量) + 倒数日/生活共享(记账/家务/约会/习惯/暗号)/共享清单 + 深度陪伴(F140-F149：今日主题曲/接头暗号/夸夸复制/情绪SOS抱抱/每日三问/梦境手账/美食地图/TA使用手册/自定义成就) + 心愿基金 |
| badges | CoupleBadges + CoupleReport + CoupleAnniversaryReport + CoupleHeatmap | 里程碑徽章 + 行为成就墙 + 恋爱月报/数据总览 + 回忆资产报告系(F85-F86)：周年报告/生日回顾 + 年度热力日历(F96，store 键 `yearHeatmap` 避免与游戏化 heatmap 撞名) |
| timeline | CoupleOnThisDay + CoupleFirsts + CoupleHeartMoments + CoupleTimeline + CoupleChronicle | 那年今天 + 我们的第一次(F46) + 心动时刻(F36) + 恋爱时光轴 + 回忆资产聚合系(F80-F82)：恋爱编年史/记忆考古卡/恋爱问答机 |

头部区：双人头像 + 在一起天数 + 连续晚安 + 心动值 + 纪念日弹窗 + 专属爱称弹窗（`couple-pet-*`）+ 通知铃铛（F41 `couple-notify-*`）+ 里程碑/周年庆横幅（F43/F43+F47）+ 空间个性化 CoupleProfile（宣言/主题/贴纸）。

**新功能标准链路**（照抄任意现成组件）：
1. `types/index.ts` 追加 VO 类型（放情侣空间区块末尾）
2. `api/couple.ts` 追加接口方法（带中文注释）
3. `stores/couple.ts`：新增 ref 状态 → 加入 `loadedLists`（WS 只刷新已加载过的）→ load/操作函数 → `handleCoupleEvent` 加 case（notify + 刷新对应数据）→ reset() 清理 → return 导出
4. 新组件放 `components/couple/`，根元素 `data-testid="couple-xxx"`，按钮/输入框同样补 testid（测试与 e2e 依赖）
5. CoupleView 挂到对应页签（页签加 `lazy`）

WS 事件约定：后端 `ImPushService.pushCoupleEvent(Both)` 推 `{type:'couple', event, detail}`，im store 转发为 `arechat:couple` 自定义事件，couple store `handleCoupleEvent` 按 event 名分发。现有 event 清单见后端各 Service（如 bond-action、task-done、tacit-settled、reconcile-accepted、capsule-sealed、countdown-reminder、scratch-scratched、box-opened、garden-watered、comfort-sent、comfort-given、night-care、peace-review-done、sorry-used、truth-answered、whisper-answered、telepathy-matched、love-bank-interest、challenge-done、passbook-deposit、hundred-done、wish-accepted、travel-visited、nexttime-done、read-finished、watch-finished、dict-added、quote-kept、ticket-added、song-added、capsule-due、birthday-eve 等）。

批次六~十（F100-F149）新增事件（`stores/couple.ts` `handleCoupleEvent` 均有 case）：沟通区 whisper-*→（F36 旧名）/room-*/relay-*/story-*/sorry-*/vocab-*（F100-F109）；异地恋 handhold-*/miss-*/routine-updated/reunion-letter-sealed|opened（注意与悄悄话信箱 letter-opened 已改名区分）/cloud-*/safety-ping/reunion-logged/energy-*（F110-F119）；确定感 security-*/decade-*/vision-*/oath-*/trust-deposit/contract-*/pet-*（F120-F129）；游戏 survey-answered/quiz-*/love-word-kept/blind-*/battle-*/art-added（F130-F139）；陪伴 dream-written/food-added|checkin/fact-added/sos-ping|held/three-saved|both/badge-added|issued（F140-F149）。

撞名备忘（新增类型/方法前先 grep types 与 api）：CoupleLetterVO/CoupleMissVO/CouplePraiseVO/CoupleBadgeVO/CoupleWeatherVO 均已被占用（批次十改用 CoupleReunionLetterVO/CoupleMissDailyVO/CoupleDailyPraiseVO/CoupleCustomBadgeVO/CoupleLoveWeatherVO）；api `openLetter`/`badges` 已占用（拆信用 openReunionLetter、自定义成就用 customBadges）；store `missBoard`/`weather` 已占用（思念计量用 missDaily、恋爱天气用 loveWeather）。F149 恋爱仪表盘改版在 `CoupleTodayBoard.vue`（couple.dashboard + `couple-dashboard-*` testid）。

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

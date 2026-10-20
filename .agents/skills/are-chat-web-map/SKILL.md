---
name: are-chat-web-map
description: are-chat-web 前端项目地图（Vue 3 + Vite + Pinia + Element Plus）。提供目录地图、组件/页签映射、状态管理与 API 惯例、测试与构建命令、交付门禁（第五节，含版本号/发版规则）。凡在 are-chat-web 中开发新功能、修复缺陷、评审改动，开工前必须先加载本 skill，避免重新通读项目。
---

# are-chat-web 前端项目地图

> 本文件是给 AI agent 看的项目速查地图。维护义务见第五节「收尾」。

## 一、技术栈与命令

- Vue 3 `<script setup lang="ts">` + Vite 8（Rolldown 打包内核）+ Pinia 4 + Vue Router 5 + Element Plus + TypeScript 6（`vue-tsc` 尚不吃 TS 7，勿升）
- 测试：Vitest（jsdom），在 `tests/unit/`，命令 `pnpm test`；构建：`pnpm build`（含 vue-tsc 类型检查，何时必跑见第五节）
- 版本号唯一来源 `package.json` 的 version（alpha → rc → stable 阶梯，升级独立 commit，规范见 `.agents/skills/version-release/SKILL.md`）
- 站名唯一来源 `src/constants.ts` 的 `APP_NAME`（天枢，代号 `APP_CODENAME` = DUBHE）；改名只动这一处 + `index.html`/`public/manifest.webmanifest` 三处静态文案
- 视觉基调：**全站科技冷色**（电光青 `#0ea5e9` + 深空蓝侧栏 `#0a1524`，暗色 `#22d3ee` / `#070d18`），**只有情侣空间保留暖色**——`CoupleView` 根元素挂 `.couple-scope`，`style.css` 里那一层把 `--im-*` 与 `--el-*` 整套覆盖回暖色。新组件默认吃令牌，别在 `.vue` 里硬编码颜色
- 规模快照（2026-10-20 三轮裁剪后实测，用户指令「保留在一起天数、纪念日、美柚app上的日历记录，其它功能都不要了」）：5 个主页面 / CoupleView **一页两屏、不分页签**（头部卡「在一起天数 + 纪念日 + 解除」+ 一张亲密日历，中间只夹里程碑横幅）/ 情侣组件 **3 个 `.vue`**（CoupleCalendar + CoupleSetup + CoupleCollapsible 卡壳；卡索引表 `coupleCards.registry.ts` 只剩一张卡、失去对象已删）/ `api/couple.ts` **14 个方法·4 个 api 组·74 行** / `types/index.ts` 1420 行 / `stores/couple.ts` **138 行**（只剩总览与邀请那棵树）/ `utils/coupleVisual.ts`（打卡档位驱动的聊天侧情侣特效）与 `utils/coupleRecordBus.ts`（记录卡→日历卡的本页刷新信号）都已删 / 单测基线 **92 用例·8 个文件**（`couple.spec.ts` 16 条含「api 契约守卫」，断言 4 个分组 / 14 个方法 / 14 条路径；`couple-calendar.spec.ts` 27 条锁日历卡的排版与三个记录入口；`couple-v8-cards.spec.ts`、`couple-unlocks.spec.ts`、`couple-period.spec.ts`、`couple-intimate.spec.ts` 随所测功能删除）；后端配套见 are-chat-map（同一轮裁剪，端点与表数量以后端仓库的地图为准）

## 二、目录地图与关键文件

```
are-chat-web/
├── index.html  vite.config.ts        # dev 5173；proxy：/api→8080、/ws→8080(ws:true)；alias @→src；AutoImport(vue/router/pinia)+unplugin-vue-components(ElementPlus，自动维护 src/components.d.ts)
├── vitest.setup.ts                   # jsdom 缺失的 ResizeObserver/matchMedia polyfill（test 段在 vite.config.ts 里，**没有** vitest.config.ts）
├── package.json                      # ★ 版本号唯一来源（禁止在代码/文案/测试写死版本）
├── .env.*                            # 多环境变量（API 目标等）
├── src/
│   ├── main.ts / App.vue / style.css # 挂载、全局壳、全局样式（暗色变量 --im-* 与 --couple-* 定义处）
│   ├── router/index.ts               # 路由表（/login、/、/chat、/contacts、/couple、/admin）
│   ├── layouts/MainLayout.vue        # 登录后壳：侧栏 + 绑定 couple store init 的 WS 事件
│   ├── views/                        # 5 页：LoginView / ChatView / ContactsView / CoupleView / AdminView
│   ├── components/
│   │   ├── couple/                   # ★ 情侣空间 3 个 .vue（CoupleCalendar 一张卡 + Setup + Collapsible，页面结构见第三节）
│   │   │   ├── CoupleCalendar.vue    # 亲密日历：唯一的功能卡，也是经期/亲密记录的唯一入口（月度读口 + 五个写口）
│   │   │   └── CoupleCollapsible.vue # F205 折叠包装组件（新分区卡必须使用）
│   │   └── im/                       # 聊天组件 5 个（消息流/输入框/头像等；GlobalSearchPanel、NewMessageToast、PwaInstallGuide 已删）
│   ├── api/                          # auth.ts / couple.ts(74 行·4 组·14 法) / im.ts / files.ts / system.ts / http.ts(封装层)
│   ├── stores/                       # auth / im(WS 宿主) / couple(138 行：只剩总览与邀请那棵树)
│   ├── types/index.ts                # 全部 TS 类型按域分节（当前 1420 行；三轮裁剪又删 10 个作废情侣 VO，历史孤儿约 100 个未动）
│   ├── utils/                        # effects.ts(彩蛋指令)、format.ts/imFormat.ts、sound.ts、notify.ts、settings.ts、theme.ts 等（coupleVisual.ts / coupleRecordBus.ts 已删）
│   └── constants.ts                  # 全局常量
├── tests/unit/                       # 8 个文件（当前基线 92 用例；整页挂载用例成本高，vite.config.ts 已把 testTimeout 提到 20s）
├── AGENTS.md / docs/ / wiki/         # 仓库约束与文档（后端配套地图见 are-chat 仓库 are-chat-map skill）
```

- **API 分组对象**（三轮裁剪后 `src/api/couple.ts` 共 4 组）：**`coupleApi`**（8 法：`overview`/邀请四连 `invite`·`acceptInvite`·`rejectInvite`·`cancelInvite`/`setAnniversary`/`dissolve` + 旁支读取 `relationshipOf`）/ **`periodApi`**（经期写口，3 法：`periodAdd`/`periodEnd`/`periodRemove`）/ **`intimateApi`**（亲密写口，2 法：`intimateAdd`/`intimateRemove`）/ **`calendarApi`**（亲密日历，1 法：`calendarMonth`，一个月度读口把经期覆盖日、区间、周期统计与亲密标记一次给齐，也是唯一的记录展示口）。**判据**：这 14 个方法与后端 `@*Mapping` 抽出的 14 个存活情侣端点一一对上，新增方法时照此对齐，别把已下线端点（`streakApi`/`questionApi`/`wishApi` 三组、`coupleApi.updateProfile`/`coupleApi.intimacy`、`periodApi.periodBoard`/`intimateApi.intimateBoard`）再写回来（守卫在 `couple.spec.ts`「api 契约守卫」，现读源码断言分组数、方法总数、路径总数与死路径段）。
- **端口与联调**：前端 dev 5173 → 代理转发后端 8080；登录态走 Cookie(HttpSession)，`http.ts` 统一 `withCredentials`；WS 会话 `/ws/chat/{name}` 由 im store 维护，情侣事件经 `arechat:couple` 自定义事件转发。
- **数据流（情侣空间两条路）**：① store 域——`stores/couple.ts` 只剩**总览与邀请**这一棵树（`overview` + 派生 `space`/`established`/`incomingInvites`/`outgoingInvites`），MainLayout 登录后拉、CoupleView 头部与侧栏角标读它；② 组件自持域——**Calendar**（一个月度读口 `calendarMonth`，翻页只换 `month` 重取；五个写口——`periodApi` 三个 + `intimateApi` 两个——都不回数据，写完按当前可见月重拉这一次读口）在组件内自持，不进 store、不接 WS。心动值、打卡解锁 streak、每日一问 question、愿望清单 wish 这几个域（前两个曾进 store，因为 ChatView 的解锁外观要读 `tierUnlocked(key)`）连同 `loadStreak`/`loadQuestion` 的 in-flight 去重一起随三轮裁剪整域删除，没留空壳——后端既没有端点也没有 WS 生产者，留一个空 ref 只会让人以为还有数据。新卡默认照「组件自持」写，只有需要被别的页面读到的状态才上 store。**日历是个反例的修正**：它需要经期的覆盖日，但让前端自己去拉 `/period/board` 会让同页出现两次请求与两份真相，所以改成后端一份月度读模型（`calendarApi`），而不是把 period 域搬进 store；两张记录卡并进日历卡后，页内刷新信号 `coupleRecordBus.ts` 也一起删了。
- **命令**：开发 `pnpm dev`；测试 `pnpm test`（vitest run）；构建门禁 `pnpm build`（vite build + vue-tsc --noEmit，提交前必过）。

## 三、情侣空间前端全景（2026-10-20 三轮裁剪后的现役口径）

`views/CoupleView.vue`（269 行）**不再分页签**：`el-tabs` 与 `?tab=` 深链一起撤了，单栏自上而下就两屏——头部卡 + 一张亲密日历卡，中间只在命中里程碑时夹一条横幅。

| 区块 | 组件 | 内容 |
|---|---|---|
| 头部卡 | `CoupleView.vue` 内联（根 `couple-space`） | 双人头像（`couple-partner-avatar`，挂件与光效已随解锁外观下线）+ 在一起天数（`couple-days`）+ 纪念日行（`couple-anniv-line`，没定时显示「还没定纪念日」）+「纪念日」按钮（`couple-anniv-edit`，弹窗里 `el-date-picker` 只准选今天以前，保存后重拉总览）+「解除关系」（`couple-dissolve`，先过 `ElMessageBox.confirm`）。**F206 搜索框与 F207 收藏 popover、F41 通知铃铛、F47 周年庆横幅、F208 首访提示条、F98 新手引导弹窗都已删**；心动值格（`couple-intimacy-score`）、恋爱称号徽章（`couple-love-title`）、爱称弹窗（`couple-pet-*`）与可编辑宣言区同批下线 |
| 里程碑横幅 | `CoupleView.vue` 内联 | 只在天数命中 100/200/365/520/666/888/1000/1314/2000 时出现（`couple-milestone-banner`），其余日子不打扰 |
| 亲密日历 | **CoupleCalendar**（外面套 `CoupleCollapsible` 卡壳，根 `couple-calendar`） | 经期与亲密记录的**唯一入口**：月历按周一开头排，经期覆盖日 🩸、性生活 💞、边缘 ✨、预计下次 🌱 四种图标铺在格子上；点某天就在下面记那天的行为（三个记录按钮：记经期开始 / 记一笔边缘 / 记一次性生活，未来那天全部禁用）、看那天的记录与备注（含「我记的/TA 记的」）、删记错的，补结束日只能记「今天」所以挂在区间行上；摘要行与周期行照后端 `averageCycleDays`/`cycleSampleCount`/`predictedNextDay`/`daysUntilNext`/`intimateTotal` 说，前端不判区间也不数天数；翻页只换 `month` 参数重取；数据只有 `GET /calendar/month` 一个读口，五个写口都不回数据；不推 WS |
| 未建空间 | **CoupleSetup** | 整页替代，邀请建立流程（这一屏删不掉：没有空间就没有在一起天数） |

已删文件：`CoupleQuestion.vue`、`CoupleStreak.vue`、`CoupleWish.vue`、`CoupleProfile.vue`、`CouplePeriod.vue`、`CoupleIntimate.vue`，以及卡索引表 `coupleCards.registry.ts`——只剩一张卡，这张表失去对象，`?card=` 深链与 `e2e-live/couple-audit.spec.ts` 的覆盖率核对一起没了对象（该脚本仍 import 它，但 `e2e-live/` 不在 `tsconfig.json` 与 Vitest 的 include 里，`pnpm build`/`pnpm test` 都不会报错）。

WS 事件：`stores/couple.ts` 的 `handleCoupleEvent` 只认 **6 个**——`invite`/`invite-accepted`/`invite-rejected`/`anniversary-updated` 弹提醒并重拉总览、`dissolved` 先 `reset()` 清场再重拉、`anniversary-reminder`（定时任务发的纪念日倒数）只弹提醒不动数据。**其余老推送一律不认识、不发请求、不弹提醒，别加兜底分支**：`streak-*`/`question-*`/`wish-*`/`space-themed`/`pet-name-changed` 对应的功能已经下线，接回来等于把死功能重新接上电。**经期与亲密记录的每个接口都不推事件**（隐私）；日历卡也不接 WS——它自己就是写口，写完直接重拉当月，原先两张记录卡之间的页内信号 `arechat:couple-record-changed` 随 `utils/coupleRecordBus.ts` 一起删除。

聊天页现役口径（2026-10-20 五轮）：**消息收藏/全局搜索（Ctrl+K）/快捷短语/字数统计/好友分组标签/会话筛选条/一键全部已读/会话菜单里的资料与备注入口/聊天背景/聊天字号/拍一拍自定义后缀/拍一拍发送入口/浮动消息卡片/移动端 PWA 安装横幅已删**（历史 poke 消息仍按灰字展示），**情侣侧的解锁外观（专属气泡/昵称光效/头像挂件/专属贴纸包）也在三轮裁剪整段下线，ChatView 不再 import couple store**；保留转发/编辑/撤回/表态/会话内搜索/文件发送/浏览器系统通知；联系人页不再有快捷账号与逐行「发消息」钮（整行可点），置顶/免打扰仍走右键菜单；设置弹窗只剩皮肤、发送键、免打扰时段；后台只保留审批/用户/公告三个页签（审计日志与情侣运营看板已删）。

## 四、惯例与红线


- 交互文案：**情侣空间内**可爱口语化 + emoji；聊天/通讯录/后台/登录这些非情侣页面一律中性口语，不要再撒情话与爱心（2026-10-20 按用户要求把情侣风收进情侣空间）。错误提示直接 `ElMessage.error(e instanceof Error ? e.message : '兜底文案')`（后端 message 已是中文人话）
- 样式：组件内 scoped；间距/圆角参考现有组件；颜色一律走 `style.css` 的令牌（`var(--im-*)` / `var(--xx-accent)`，兜底值写冷色），情侣页专属的暖色留在 `src/components/couple/` 内
- 类型红线：`pnpm build` 会做 vue-tsc 检查——改了 types 里的接口（如给 VO 加字段），**必须同步改 tests/unit/couple.spec.ts 的 mock 工厂**，否则构建失败
- 测试：基线 **92 用例 / 8 个文件**；`tests/unit/couple.spec.ts` 断言这一页没有页签（`.el-tabs__item` 数量为 0）且七个老 testid 都不在，别把页签或已下线的卡加回来；新组件核心交互应补用例；**动了 `src/api/couple.ts` 的方法集必须同步 mock 工厂**，否则「api 契约守卫」那条用例会红（它现读源码断言 4 个分组、14 个方法、14 条路径与死路径段）
- HTTP 封装在 `api/http.ts`：`http.get<T>(url)`、`http.postJson<T>(url, body)`、`http.putJson`、`http.delete`
- **情侣解锁外观整条已下线，别再接回来**：档位来源（连续互动打卡）没了，专属气泡 / 昵称光效 / 头像挂件 / 专属贴纸包这条线随之撤掉——`couple.tierUnlocked(key)` 与 `src/utils/coupleVisual.ts`（门禁函数、挂件取法、贴纸生成）已删除，`style.css` 里那段 `--couple-bubble-*` / `--couple-glow-*` 令牌与 `.dm-area[data-couple-bubble]`、`.couple-name-glow` 规则一并删除，`ImAvatar.vue` 去掉 `pendant` prop、`EmojiPicker.vue` 回到只有通用表情分组、`ChatView.vue` 不再 import couple store。原先「解锁外观一律问 store、不许自己算天数」的口径作废（现在没有任何外观要读档位了）；动效本身仍要在 `prefers-reduced-motion: reduce` 下关闭，且不能只靠动效承载信息。
- **产品红线**：不做照片/视频上传——所以当年 50 天「定制 emoji」也只能是纯 unicode 组合（`buildCoupleStickers` 只取昵称码点、`isStickerText` 拒含 `http(s):`/`www.`/`data:`/`//`/`<`/`>` 或超 12 码点的值）；这两个函数随贴纸包一起删除，但这条红线长期有效。

## 五、交付门禁（硬性流程，给 agent 的快速上手路径）

规范全集在专项 skill（git-commit / version-release）里，本节只做流程串联与红线登记，不复述细节：

1. **开工**：必读本 skill；提交拆分/架构师复审清单 → `.agents/skills/git-commit/SKILL.md`；升版/发版判级 → `.agents/skills/version-release/SKILL.md`；对应后端模块地图见 are-chat 仓库的 `are-chat-map` skill
2. **编码**：走第三节「数据流」；加新卡抄现成结构——自持数据卡照 `CoupleCalendar.vue`（`CoupleCollapsible` 包壳 + `onMounted` safeLoad + 写完按当前可见月重拉那一个读口），只有需要被别的页面读到、或要靠 `arechat:couple` 刷新的状态才进 store（照 `stores/couple.ts` 剩下的总览那棵树）；新 VO 类型加 Couple+域前缀并先 grep 防撞名；后端新事件须在前端 `stores/couple.ts` 的 `handleCoupleEvent` 加分支；CoupleView 已不分页签，别把 `el-tabs` 与 `?tab=` 加回来
3. **构建**：提交前 `pnpm build`（含 vue-tsc）必过，改了逻辑跑 `pnpm test` 全绿；types 改动同步测试 mock 工厂（红线见第四节）
4. **提交**：按改动性质分组（依赖/组件页面/样式/文档），一 commit 一性质；信息 `type(scope): 中文描述`
5. **推送**：commit → `git pull --no-rebase` → push；失败保留本地 commit 并报告，不 force push
6. **版本**：`package.json` 为唯一版本源，任何代码/文案/测试禁止写死版本号；agent 按 version-release 判级参考自主升版、独立 commit、不建 tag；用户说「发版/发布版本」= 无条件立即完整发版流程
7. **收尾**：新增/删除组件、页签、接口、WS 事件 → 更新本 skill 对应小节，与功能同批提交（commit type `docs`）

**产品红线（用户长期约束）**：情侣功能注重情绪价值；**不做照片/视频上传类功能**（服务器部署要求高）。

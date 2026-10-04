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
- 规模快照（2026-10-05 v8 第一批后）：5 个主页面 / CoupleView **3 个常开页签 + 1 个隐藏页签**（today 今天、life 过日子、gift 小惊喜，均已无子页签；`secret` 隐藏角落只在连续贴满 100 天后由 `v-if` 出现）/ 情侣组件 **17 个 `.vue`**（14 张卡 + CoupleSetup + CoupleProfile + CoupleCollapsible 卡壳）+ 注册表 / registry **14 张卡**（`CoupleCardEntry` 新增可选 `tier` 字段：带 tier 的卡只对已解锁的人出现在搜索与收藏里）/ `api/couple.ts` **70 个方法·12 个 api 组·280 行** / `types/index.ts` 2137 行 / `stores/couple.ts` **454 行**（八域）/ `utils/coupleVisual.ts`（解锁门禁与专属贴纸生成，纯函数可单测）/ 单测基线 **143 用例·9 个文件**（`couple.spec.ts` 39 条含「mock 工厂必须覆盖 api 全部 70 方法」守卫；`couple-v8-cards.spec.ts` 36 条覆盖四张新卡；`couple-unlocks.spec.ts` 18 条覆盖四项视觉解锁）；后端配套见 are-chat-map（17 情侣 Controller / 70 情侣映射 / 22 张 couple_* 表 / 266 用例基线）

## 二、目录地图与关键文件

```
are-chat-web/
├── index.html  vite.config.ts        # dev 5173；proxy：/api→8080、/ws→8080(ws:true)；alias @→src；AutoImport(vue/router/pinia)+unplugin-vue-components(ElementPlus，自动维护 src/components.d.ts)
├── vitest.setup.ts                   # jsdom 缺失的 ResizeObserver/matchMedia polyfill（test 段在 vite.config.ts 里，**没有** vitest.config.ts）
├── package.json                      # ★ 版本号唯一来源（禁止在代码/文案/测试写死版本）
├── .env.*                            # 多环境变量（API 目标等）
├── src/
│   ├── main.ts / App.vue / style.css # 挂载、全局壳、全局样式（暗色变量 --im-* 定义处）
│   ├── router/index.ts               # 路由表（/login、/、/chat、/contacts、/couple、/admin）
│   ├── layouts/MainLayout.vue        # 登录后壳：侧栏 + 绑定 couple store init 的 WS 事件
│   ├── views/                        # 5 页：LoginView / ChatView / ContactsView / CoupleView / AdminView
│   ├── components/
│   │   ├── couple/                   # ★ 情侣空间 17 个 .vue + 注册表（14 张卡 + Setup/Profile/Collapsible，页签树见第三节）
│   │   │   ├── CoupleCollapsible.vue # F205 折叠包装组件（新分区卡必须使用）
│   │   │   └── coupleCards.registry.ts # 卡注册表：key=分区卡根 data-testid，F206 搜索/F207 收藏依赖
│   │   └── im/                       # 聊天组件 8 个（消息流/输入框/头像等）
│   ├── api/                          # auth.ts / couple.ts(218 行) / im.ts / files.ts / system.ts / http.ts(封装层)
│   ├── stores/                       # auth / im(WS 宿主) / couple(454 行，八域：总览与邀请·心情·心动值·贴贴·求抱抱·通知·**打卡解锁**·**每日一问**)
│   ├── types/index.ts                # 全部 TS 类型按域分节（当前 1974 行；情侣死类型已删 203 个）
│   ├── utils/                        # effects.ts(彩蛋指令)、format.ts/imFormat.ts、sound.ts、notify.ts、pwa.ts、settings.ts、theme.ts 等（coupleTheme.ts 已随早晚安打卡下线删除，主题只读 space.theme）
│   └── constants.ts                  # 全局常量
├── tests/unit/                       # 9 个文件（当前基线 143 用例；整页挂载用例成本高，vite.config.ts 已把 testTimeout 提到 20s）
├── AGENTS.md / docs/ / wiki/         # 仓库约束与文档（后端配套地图见 are-chat 仓库 are-chat-map skill）
```

- **API 分组对象**（v8 后 `src/api/couple.ts` 共 12 组）：`coupleApi`（地基 + 心情/贴贴/求抱抱/通知 + 刮刮乐盲盒）/ `pinApi`（常用收藏）/ `diningApi`（今晚饭桌）/ `ceremonyApi`（愿望券本）/ `factoryApi`（家务轮盘）/ `echoApi`（好事簿）/ `questApi`（加班预报与留灯）/ `catchApi`（安全词）/ **`streakApi`（连续打卡与七档解锁，2 法）** / **`questionApi`（每日一问，3 法）** / **`wishApi`（愿望清单，7 法）** / **`memoryApi`（百日隐藏回顾，1 法）**。**判据**：这 70 个方法与后端 `@*Mapping` 抽出的 70 个存活情侣端点一一对上，新增方法时照此对齐，别把已下线端点再写回来。
- **端口与联调**：前端 dev 5173 → 代理转发后端 8080；登录态走 Cookie(HttpSession)，`http.ts` 统一 `withCredentials`；WS 会话 `/ws/chat/{name}` 由 im store 维护，情侣事件经 `arechat:couple` 自定义事件转发。
- **数据流（情侣空间两条路）**：① store 域——`stores/couple.ts` 现八域（总览与邀请、心情、心动值、贴贴、求抱抱、通知、**打卡解锁 streak**、**每日一问 question**），头部/铃铛/**ChatView 的解锁外观**读它，WS 只刷新 `loaded` 里已加载过的键；② 组件自持域——其余卡片（Dining/Factory/Quest/Ceremony/Catch/Echo/Surprise/**Wish**）在组件内 onMounted safeLoad，写接口返回整份聚合 VO 直接替换，不进 store。**两个例外有理由**：`streak` 与 `question` 必须进 store，因为 ChatView 的气泡/昵称光效/挂件/贴纸要读解锁态（`tierUnlocked(key)`），卡片自己持有就变成两份真相；`loadStreak`/`loadQuestion` 各带一个 in-flight 去重（实测一次进空间会打 3 次 `/streak/board`：init、页签兜底、卡片挂载），别以为合并请求是可有可无的优化。新卡默认照「组件自持」写，只有需要被别的页面读到的状态才上 store。
- **命令**：开发 `pnpm dev`；测试 `pnpm test`（vitest run）；构建门禁 `pnpm build`（vite build + vue-tsc --noEmit，提交前必过）。

## 三、情侣空间前端全景（2026-10-04 裁剪后的现役口径）

`views/CoupleView.vue` 用 el-tabs 组织 **3 个页签**（`name` 即路由 `?tab=` 参数值，`today` 是默认页签且**不 lazy**，另两个 lazy）。子页签机制（F200-F204 的 5 组嵌套 pane）随卡片一起删除，`subTabs` 状态已不存在。

| 页签 name | 组件（按渲染顺序） | 内容 |
|---|---|---|
| `today` 🫶 今天 | CoupleMood · CoupleBond · **CoupleStreak** · **CoupleQuestion** · CoupleComfort · CoupleCatch | 心情日记（含心情回应钮）／贴贴宫格（动作流+统计+里程碑+爱称）／**连续互动打卡（当前·最长·21 格打卡条·七档解锁墙·补签，没有「点一下打卡」按钮——双方当天都贴贴由后端自动确认）**／**每日一问（今天一题，我答完且 TA 也答完才互看，回看近 14 天）**／求抱抱（感受按钮+话术卡回应+陪聊话题卡+情绪同步率，23:00 有深夜陪伴兜底）／安全词与暂停复盘（约定词·喊停一天一人一次·复盘只归喊停本人） |
| `life` 🍚 过日子 | CoupleDining · CoupleFactory · CoupleQuest · CoupleCeremony | 今晚饭桌（每人一票 + 后端按票池 stableHash 裁决，双方看到同一道）／家务轮盘（一转定分工、对方认账后本人才能打勾）／加班预报与留灯（灯卡只有对方能留）／愿望券本（花 10 分发一张券，对方核销） |
| `gift` 🎁 小惊喜 | CoupleSurprise · **CoupleWish** · CoupleEcho | 刮刮乐（每周自动发券，送券人核销才 +5 分）与恋爱盲盒（到日才可拆、装盒人不能自拆）／**愿望清单（想要的先记下，对方可偷偷标「已准备」——许愿人这一侧永远看不到，分组与文案全吃后端下发的位）**／好事簿（记「TA 为我做的事」，被记的那位 +2 分，加星再 +1） |
| `secret` 🥚 隐藏角落 | **CoupleMemory** | **连续贴满 100 天才出现的页签（`v-if="couple.tierUnlocked('easter-egg')"`）**：一句话总结 + 回顾时间轴。未解锁时组件自己也不发 `memoryPage()` 请求（双重设闸，后端同样会 400） |

头部区（v8 后带解锁外观）：双人头像（**21 天起挂联动挂件 `pendant`，取法与聊天侧共用 `utils/coupleVisual` 的 `couplePendant(theme)`，免得同一个人两处不同款**）+ 在一起天数 + 今天双方心情 + 心动值与恋爱等级（**30 天起称号另挂 `couple-love-title` 徽章，此时那一格回到「心动值」，同一个词不出现两次**）+ 爱称（**14 天起带 `.couple-name-glow`，与聊天页共用 style.css 的同一个类**）+ **7 天起头部有流动背景与角落一棵按解锁档数长高的电子植物（`couple-plant-stage-N`）** + 纪念日弹窗 + 爱称弹窗 + 通知铃铛（F41）+ F206 搜索（`couple-search`）+ F207 收藏（`pinApi`，≤6 个）+ F43/F47 里程碑与周年庆横幅 + F98 新手引导。头部背景底色仍只读 `space.theme`（`CoupleProfile` 里选），按天轮换的 `coupleTheme.ts` 已随早晚安打卡一起删除。

注册表 `coupleCards.registry.ts` 现役 14 条（`COUPLE_CARDS` = { key, label, tab, sub?, **tier?** }），F206/F207 全部以 key 为唯一标识；`COUPLE_TAB_LABELS` 四个页签。**加卡先改这张表，否则搜索与收藏点不到它**；带 `tier` 的卡只对已解锁的人出现在搜索与收藏面板里（`searchCoupleCards(keyword, unlockedTierKeys)` 与 `searchableCards` 都按这个过滤，不然跳过去会撞上一个不存在的页签）。

WS 事件：现役 44 个（后端 Service/Job 源码抽取），`stores/couple.ts` 的 `handleCoupleEvent` 只处理保留卡与地基相关的那些；卡片自持域的事件（dine-*/factory-spin-*/quest-*/ceremony-coupon-*/echo-deed-*/catch-safeword-*/scratch-*/box-*）**只进 notify 铃铛，不做数据刷新**——组件靠写接口返回的整份聚合 VO 更新，跨端推送进来时靠 `loadIntimacy()` + `loadNotifies()` 兜住。v8 新增 7 个：`streak-checkin` / `streak-unlocked` / `streak-makeup`（刷 `loadStreak()`）、`question-daily` / `question-answered`（刷 `loadQuestion()`）、`wish-added` / `wish-fulfilled`（只进铃铛）。**后端刻意没有 `wish-prepared`**：偷偷标记「已准备」不推任何事件，前端也不许自己从 `preparedAt` 反推出来。

## 四、惯例与红线


- 交互文案：情侣场景，可爱口语化 + emoji；错误提示直接 `ElMessage.error(e instanceof Error ? e.message : '兜底文案')`（后端 message 已是中文人话）
- 样式：组件内 scoped；间距/圆角参考现有组件；主题色 `#f56c6c`（粉红），跟随暗色变量（`var(--im-muted)` 等）
- 类型红线：`pnpm build` 会做 vue-tsc 检查——改了 types 里的接口（如给 VO 加字段），**必须同步改 tests/unit/couple.spec.ts 的 mock 工厂**，否则构建失败
- 测试：`tests/unit/couple.spec.ts` 依赖默认页签 `today`（新增页签不要改默认值）；新组件核心交互应补用例；**动了 `src/api/couple.ts` 的方法集必须同步 mock 工厂**，否则「mock 工厂必须覆盖 api/couple.ts 的每个方法」那条守卫用例会红
- HTTP 封装在 `api/http.ts`：`http.get<T>(url)`、`http.postJson<T>(url, body)`、`http.putJson`、`http.delete`
- **解锁外观一律问 store，不许自己算天数**：唯一入口是 `couple.tierUnlocked(key)`（key 是后端 `StreakTier` 的 wire 值：`bubble`/`background`/`nickname-glow`/`pendant`/`title`/`custom-emoji`/`easter-egg`，上线即冻结，改了等于没收已解锁用户的外观）。聊天侧的门禁函数、挂件取法与专属贴纸生成都在 `src/utils/coupleVisual.ts`（纯函数，`couple-unlocks.spec.ts` 逐条测过），CoupleView 与 ChatView 共用同一份，不要各写一份哈希。
- 气泡皮肤走 `.dm-area[data-couple-bubble]` + `style.css` 里的 `--couple-*` 令牌，靠 CSS 自定义属性的元素级优先覆盖用户全局皮肤，**不改 MessageBubble 的 scoped 样式、也不加后端字段**；`prefers-reduced-motion: reduce` 下所有解锁动效必须关闭，且解锁信息不能只靠动效承载。
- **产品红线**：不做照片/视频上传，所以 50 天「定制 emoji」也只能是纯 unicode 组合（`buildCoupleStickers` 只取昵称码点，输入不可能塞进 URL 或标签；`isStickerText` 会拒含 `http(s):`/`www.`/`data:`/`//`/`<`/`>` 或超 12 码点的值）。

## 五、交付门禁（硬性流程，给 agent 的快速上手路径）

规范全集在专项 skill（git-commit / version-release）里，本节只做流程串联与红线登记，不复述细节：

1. **开工**：必读本 skill；提交拆分/架构师复审清单 → `.agents/skills/git-commit/SKILL.md`；升版/发版判级 → `.agents/skills/version-release/SKILL.md`；对应后端模块地图见 are-chat 仓库的 `are-chat-map` skill
2. **编码**：走第三节「新功能标准链路」；加新卡抄现成结构——自持数据卡照 `CoupleEcho.vue`/`CoupleCatch.vue`（`CoupleCollapsible` + `onMounted` safeLoad + 写接口返回整份聚合 VO 整体替换），走 store 的卡照 `CoupleMood.vue`/`CoupleBond.vue`；新 VO 类型加 Couple+域前缀并先 grep 防撞名（见撞名备忘）；后端新事件须在前端 `stores/couple.ts` 的 `handleCoupleEvent` 加分支；不改默认页签 `today`
3. **构建**：提交前 `pnpm build`（含 vue-tsc）必过，改了逻辑跑 `pnpm test` 全绿；types 改动同步测试 mock 工厂（红线见第四节）
4. **提交**：按改动性质分组（依赖/组件页面/样式/文档），一 commit 一性质；信息 `type(scope): 中文描述`
5. **推送**：commit → `git pull --no-rebase` → push；失败保留本地 commit 并报告，不 force push
6. **版本**：`package.json` 为唯一版本源，任何代码/文案/测试禁止写死版本号；agent 按 version-release 判级参考自主升版、独立 commit、不建 tag；用户说「发版/发布版本」= 无条件立即完整发版流程
7. **收尾**：新增/删除组件、页签、接口、WS 事件 → 更新本 skill 对应小节，与功能同批提交（commit type `docs`）

**产品红线（用户长期约束）**：情侣功能注重情绪价值；**不做照片/视频上传类功能**（服务器部署要求高）。

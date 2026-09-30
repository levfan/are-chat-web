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

`views/CoupleView.vue` 用 el-tabs 组织 **10 个页签**（name 即路由 `?tab=` 参数值，均 lazy）：

| 页签 name | 组件 | 内容 |
|---|---|---|
| bond | CoupleBond + CoupleGame | 贴贴动作宫格/贴贴里程碑/累计统计/动作流 + 恋爱加成清单/互动热力图/心情曲线/恋爱红绿灯 |
| promises（默认） | CouplePromises + CouplePact | 双向约定卡 + 恋爱条约 |
| rituals | CoupleRituals + CoupleDaily + CoupleTruth | 早晚安/今日一问(含 F48 互评表情)/晚安故事 + 甜蜜任务/恋爱运势/默契考验 + 今日真心话(F66 双方同题必答+存档)/心灵感应(F68 每天三轮选题作答自动结算) |
| surprise | CoupleSurprise + CoupleGarden | 惊喜与期待(F50-F59)：刮刮乐/恋爱盲盒/心动闹钟/思念速递/藏宝图/告白重现 + 爱情花园浇水养成/每日玫瑰/幸运签 |
| letters | CoupleLetter + CoupleWhisperBox + CoupleCapsule | 悄悄话信箱（情话抽卡/情书模板）+ 匿名树洞(F67)/情话储蓄罐(F69 21 点利息送达) + 时光胶囊 |
| mood | CoupleMood | 心情日记 + 心情回应（回应按钮在本组件内） |
| care | CoupleCare + CoupleComfort + CoupleMakeup | 情绪天气/急救箱/和好卡/夸夸墙/生理期关怀 + 求抱抱(F60 感受按钮/话术卡回应)/陪聊话题卡(F63)/情绪同步率(F64) + 矛盾复盘(F61 和好锦囊)/道歉券(F62) |
| shared | CoupleCityCard + CoupleCountdown + CoupleLife + CoupleShared + CoupleFund | 异地恋(对方时区/见面倒数)/倒数日/生活共享(记账/家务/约会/习惯/暗号)/共享清单/心愿基金 |
| badges | CoupleBadges + CoupleReport | 里程碑徽章 + 行为成就墙 + 恋爱月报/数据总览 |
| timeline | CoupleOnThisDay + CoupleFirsts + CoupleHeartMoments + CoupleTimeline | 那年今天 + 我们的第一次(F46) + 心动时刻(F36) + 恋爱时光轴 |

头部区：双人头像 + 在一起天数 + 连续晚安 + 心动值 + 纪念日弹窗 + 专属爱称弹窗（`couple-pet-*`）+ 通知铃铛（F41 `couple-notify-*`）+ 里程碑/周年庆横幅（F43/F43+F47）+ 空间个性化 CoupleProfile（宣言/主题/贴纸）。

**新功能标准链路**（照抄任意现成组件）：
1. `types/index.ts` 追加 VO 类型（放情侣空间区块末尾）
2. `api/couple.ts` 追加接口方法（带中文注释）
3. `stores/couple.ts`：新增 ref 状态 → 加入 `loadedLists`（WS 只刷新已加载过的）→ load/操作函数 → `handleCoupleEvent` 加 case（notify + 刷新对应数据）→ reset() 清理 → return 导出
4. 新组件放 `components/couple/`，根元素 `data-testid="couple-xxx"`，按钮/输入框同样补 testid（测试与 e2e 依赖）
5. CoupleView 挂到对应页签（页签加 `lazy`）

WS 事件约定：后端 `ImPushService.pushCoupleEvent(Both)` 推 `{type:'couple', event, detail}`，im store 转发为 `arechat:couple` 自定义事件，couple store `handleCoupleEvent` 按 event 名分发。现有 event 清单见后端各 Service（如 bond-action、task-done、tacit-settled、reconcile-accepted、capsule-sealed、countdown-reminder、scratch-scratched、box-opened、garden-watered、comfort-sent、comfort-given、night-care、peace-review-done、sorry-used、truth-answered、whisper-answered、telepathy-matched、love-bank-interest 等）。

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

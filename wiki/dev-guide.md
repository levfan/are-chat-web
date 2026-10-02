# 开发指南

> 本页回答：环境怎么准备、常用命令、交付门禁硬性流程摘要、产品红线。细节不复述——规范全集在 skill 里，本页只做速览与指向。

## 环境

- 包管理：**pnpm**（仓库锁文件 pnpm-lock；本机验证 pnpm 11.x）
- Node：`package.json` 未声明 `engines`；Vite 8 / Vitest 5 / jsdom 30 的 engines 交集要求 **Node 22.22+ / 24.15+ / 26+**（本机 v26.4.0 已全链路验证）
- `@types/node` 与本机 node 次版本线对齐（26.4.x ↔ node 26.4.0），不追更高的 26.6.x：类型包本身无 `engines` 约束，装了高于运行时的声明会放行本机 node 还不存在的 API，构建能过但线上会 `no such method`
- 后端：独立 Spring Boot 仓库 are-chat，默认 `http://localhost:8080`；dev proxy 可用环境变量 `VITE_API_TARGET` / `VITE_WS_TARGET` 覆盖（见 [架构总览](architecture.md)）
- 首次：`pnpm install`（依赖已锁精确版本：vite 8.3.2 / vitest 5.0.3 / element-plus 2.14.7 / vue 3.5.43 / vue-router 5.3.1 / typescript 6.0.3 等；`typescript` 勿升 7、`vue-router` 勿降 4，见 [架构总览](architecture.md) 技术栈表备注）

## 常用命令

| 命令 | 用途 |
|---|---|
| `pnpm dev` | 开发服务器 :5173（host:true 局域网可达；/api 与 /ws 代理到后端） |
| `pnpm build` | **交付门禁**：`vite build` + `vue-tsc --noEmit` 类型检查 |
| `pnpm test` | Vitest 全量单测（改逻辑必跑） |
| `pnpm typecheck` | 仅类型检查 |
| `pnpm preview` | 构建产物预览 :4173 |

## 硬性流程摘要（交付门禁）

完整规则以 `agents.md`（根目录）与两个专项 skill 为准，此处只列骨架：

1. **开工**：必读 `.agents/skills/are-chat-web-map/SKILL.md`（新功能标准链路/惯例/撞名备忘）；本 wiki 提供全景背景（见 [Home](Home.md)）。
2. **编码**：新 VO 加 `Couple`+域前缀并先 grep `types`/`api` 防撞名；**不改默认页签 `promises`**；types 改动同步测试 mock（见 [测试](testing.md)）。
3. **构建门禁**：提交前 `pnpm build` 必过；涉逻辑改动 `pnpm test` 全绿。
4. **提交**：按改动性质分组，一 commit 一性质（依赖/组件页面/样式/文档）；信息格式 `type(scope): 中文描述`；每完成一个功能必须产生 commit。→ 细节见 `.agents/skills/git-commit/SKILL.md`
5. **推送**：commit → `git pull --no-rebase` → push；失败保留本地 commit 并报告，**不 force push**。
6. **版本**：`package.json` version 是**唯一版本源**，任何代码/文案/测试禁止写死版本号；agent 按判级参考自主升版（alpha → rc → stable 阶梯）、独立 commit、不建 tag；**用户说「发版/发布版本」= 无条件立即执行完整发版流程**（判级→改 version→build→独立 commit→pull→push，不反问不拖延）。→ 细节见 `.agents/skills/version-release/SKILL.md`
7. **收尾**：新增/删除组件、页签、接口、WS 事件 → 同步更新 map skill 对应小节，与功能同批提交。

## 产品红线（用户长期约束）

- 情侣功能**情绪价值优先**：一切功能先问"甜不甜、有没有被在乎的感觉"。
- **不做照片/视频上传类功能**（对服务器部署资源要求高，长期禁止）。
- **默认页签 `promises` 不改**（单测依赖，见 [测试](testing.md)）。
- **新 VO 必须加 `Couple` 域前缀防撞名**（历史撞名处理备忘详见 map skill 第三节，如 `CoupleReunionLetterVO`/`CoupleLoveWeatherVO`/`coach*`/`spark*` 前缀的由来）。
- 交互文案：可爱口语化 + emoji；错误提示直接透出后端 `e.message`（后端文案已是中文人话）。

## 延伸阅读

- 根目录 `agents.md` —— git 提交与版本号的硬性规则原文
- `.agents/skills/are-chat-web-map/SKILL.md` —— 项目地图 + 惯例 + 新功能标准链路
- `.agents/skills/git-commit/SKILL.md` / `.agents/skills/version-release/SKILL.md` —— 提交拆分与发版判级全集
- 后端对应模块地图：are-chat 仓库的 `are-chat-map` skill

---

上一页：[测试](testing.md) ｜ 返回：[Home](Home.md)

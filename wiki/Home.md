# are-chat-web Repo Wiki

> 本页回答：这个项目是什么、wiki 有哪些页、新 agent 开工应按什么顺序读。

## 30 秒简介

`are-chat-web` 是一个 **Vue 3 单页前端**，为 IM 聊天应用「小帆船」提供 Web 端：私聊（IM）、通讯录（好友合并）、管理后台，以及体量最大的 **情侣空间**（裁剪后 3 个页签、10 张功能卡、13 个专属组件、57 个 `/api/couple/*` 接口、37 个 WS 事件）。后端是独立的 Spring Boot 仓库（are-chat），前端只做展示与交互，所有数据经 REST + WebSocket 获取。

- 当前版本：`package.json` version（唯一版本源，禁止在代码/文案/测试里写死）
- 测试：Vitest（`tests/unit/`，jsdom）；构建含 `vue-tsc --noEmit` 类型检查
- 无任何现有 `wiki/` 内容之外的文档站；本 wiki 是给 AI agent 的项目全景层

## 目录

| 页面 | 回答什么问题 |
|---|---|
| [架构总览](architecture.md) | 技术栈、命令、目录地图、http.ts 封装、api 分组对象模式、store vs 组件自持数据 |
| [页面与路由](pages-routing.md) | 路由表、每个 View 职责、CoupleView 的 3 个页签与挂载组件序列 |
| [状态管理](state-management.md) | Pinia stores 清单；couple store 的 overview/space、`loaded` 惰性刷新、事件分发、init/reset 生命周期 |
| [API 层](api-layer.md) | `src/api/` 文件与 8 个分组对象（`coupleApi`/`pinApi`/`diningApi`/`ceremonyApi`/`factoryApi`/`echoApi`/`questApi`/`catchApi`）全量 57 方法表、与后端路由对应 |
| [WS 事件链路](ws-events.md) | 后端 push → im store 转发 `arechat:couple` → couple store 分发 → 组件刷新；37 个事件名全列 |
| [测试](testing.md) | Vitest 配置、tests/unit 覆盖范围、`vi.mock` 全量显式 mock 模式、types 与 mock 同步的坑 |
| [开发指南](dev-guide.md) | 环境、常用命令、硬性流程摘要、产品红线 |

## 新 agent 开工顺序

1. **读本 wiki 看全景**：先看本页 → [architecture.md](architecture.md) → 按任务跳读对应页（改页签看 [pages-routing.md](pages-routing.md)，改 store/事件看 [state-management.md](state-management.md) 与 [ws-events.md](ws-events.md)，加接口看 [api-layer.md](api-layer.md)）。
2. **读 skill 看规范速查**：`.agents/skills/are-chat-web-map/SKILL.md`（新功能标准链路、命名/文案/样式惯例、撞名备忘）+ 根目录 `agents.md`（git 提交与版本号硬性规则）。wiki 讲"项目是什么"，skill 讲"代码怎么写、流程怎么走"，二者互补不重复。
3. **动手前**：涉及提交/发版再看 `.agents/skills/git-commit/SKILL.md`、`.agents/skills/version-release/SKILL.md`。
4. **改完后**：新增/删除组件、页签、接口、WS 事件时，按规则同步更新 map skill（本 wiki 可按需一并维护，但不属于硬性门禁）。

> 注意：本 wiki 生成于 2026-10，并于 2026-10-04 情侣空间裁剪（`are-chat/docs/couple-trim-ranking.md`）后与当期代码逐文件重新核对；若与代码冲突，**以代码为准**，并优先相信 map skill（它受硬性同步约束）。

# are-chat-web 项目规则（Vue 3 前端）

本文件只做入口，不复述细则：规则一律以 `.agents/skills/` 下的 SKILL.md 为准，命中场景先读再做，不要靠记忆或通读源码。

| 场景 | 必读 |
|------|------|
| 开发功能、修复缺陷、评审改动（开工前） | [.agents/skills/are-chat-web-map/SKILL.md](.agents/skills/are-chat-web-map/SKILL.md) — 目录地图、组件/页面映射、状态与 API 惯例、交付门禁 |
| 提交与推送（含提交前构建门禁） | [.agents/skills/git-commit/SKILL.md](.agents/skills/git-commit/SKILL.md) — 架构师复审清单、拆分原则、commit 格式、pull 后 push |
| 升版、发版、打预发布版本（用户说「发版」即强制执行） | [.agents/skills/version-release/SKILL.md](.agents/skills/version-release/SKILL.md) — 唯一版本源、alpha→rc→stable 阶梯、判级参考 |

配套后端规则在同级仓库 `../are-chat/AGENTS.md`；长期约束与产品红线在 map skill 末节「产品红线（用户长期约束）」，动情侣功能前先读它。本文件每轮自动进上下文，所以以上场景只要出现，就必须先加载对应 skill。

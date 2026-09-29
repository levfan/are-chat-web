# are-chat-web 项目规则（Vue 3 前端）

## 项目地图（每个任务开工前必读）

- 凡在本项目开发功能、修复缺陷、评审改动：先加载 `.agents/skills/are-chat-web-map/SKILL.md`（目录地图、组件/页签映射、状态管理与 API 惯例、构建命令），不要重新通读源码
- 功能完成后若新增/删除了组件、页签、接口、WS 事件：必须同步更新 `are-chat-web-map` skill 的对应小节，与功能同批提交（docs 不单独成 commit 时随 feat 一起提）

## Git 提交（硬性）

- 每完成一个功能必须产生 commit：按改动性质分组，一类一个 commit（依赖、组件/页面、样式、文档）；整体改动小且不可拆时可并为一个
- 提交信息：`type(scope): 中文描述`（type：feat/fix/refactor/perf/test/docs/chore/build/ci）
- 完整规范：`.agents/skills/git-commit/SKILL.md`
- 提交前 `pnpm build`（涉及逻辑改动跑 `pnpm test`）通过；commit 后先 `git pull --no-rebase` 再 push 到远端（pull/push 失败保留本地 commit 并报告）

## 版本号（硬性）

- 版本号唯一来源是 `package.json` 的 version 字段，前端展示自动注入，禁止在任何代码、文案、测试里写死；升级/发版按 alpha → rc → stable 阶梯执行，升版独立成 commit，不建立 git tag
- 完整规范：`.agents/skills/version-release/SKILL.md`

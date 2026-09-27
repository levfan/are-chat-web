# are-chat-web 项目规则（Vue 3 前端）

## Git 提交（硬性）

- 每完成一个功能必须产生 commit：按改动性质分组，一类一个 commit（依赖、组件/页面、样式、文档）；整体改动小且不可拆时可并为一个
- 提交信息：`type(scope): 中文描述`（type：feat/fix/refactor/perf/test/docs/chore/build/ci）
- 完整规范：`.agents/skills/git-commit/SKILL.md`
- 提交前 `pnpm build`（涉及逻辑改动跑 `pnpm test`）通过；commit 后先 `git pull --no-rebase` 再 push 到远端（pull/push 失败保留本地 commit 并报告）

## 版本号（硬性）

- 版本号唯一来源是 `package.json` 的 version 字段，前端展示自动注入，禁止在任何代码、文案、测试里写死；升级/发版按 alpha → rc → stable 阶梯执行，升版独立成 commit，不建立 git tag
- 完整规范：`.agents/skills/version-release/SKILL.md`

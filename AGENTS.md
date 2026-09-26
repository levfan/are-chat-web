# are-chat-web 项目规则（Vue 3 前端）

## Git 提交（硬性）

- 每完成一个功能必须产生 commit：按改动性质分组，一类一个 commit（依赖、组件/页面、样式、文档）；整体改动小且不可拆时可并为一个
- 提交信息：`type(scope): 中文描述`（type：feat/fix/refactor/perf/test/docs/chore/build/ci）
- 完整规范：`.agents/skills/git-commit/SKILL.md`
- 提交前 `pnpm build`（涉及逻辑改动跑 `pnpm test`）通过；未经用户要求不 push

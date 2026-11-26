---
name: release-assets
description: 前端 are-chat-web 只有 major 版本更新（X.0.0，含 alpha/beta/rc 后缀）才触发的发布纪律：重建静态 dist、压缩为 zip、同步 are-chat-web GitHub Releases 的 assets 并写 SHA-256；minor/patch 不自动发版。后端 are-chat 的 jar 与镜像 tar 由同级仓库的 release-assets skill 负责。
whenToUse: package.json 判到 major 升级且验证提交完成后；用户明确说前端 major 发版、传 assets；version-release 或 git-commit 判到 major 时。
agent_created: true
---

# are-chat-web Release Assets 同步

## 触发条件

- 只有 major（X.0.0，含 `-alpha.n` / `-beta.n` / `-rc.n` 后缀）自动触发；minor/patch 不跑
- 版本唯一来源是 `package.json` 的 `version` 字段；站名与构建版本由 Vite 注入，禁止写死
- 判到 major 且验证全绿、改动已提交后才跑本技能；已跟踪工作区必须干净
- 同版本 Release 已存在时只补差异：资产尺寸与 SHA-256 都一致就跳过
- 版本号没变不跑；`--skip-build` 只用于复用现有 `dist` 排障
- 用户点名要给 minor/patch 发版时才加 `--force`；产物不入库
- 后端资产不在这里发：`are-chat` 仓库有自己的 `release-assets` skill，两端 major 版本对齐后各自发版

## 一条命令

```bash
python .agents/skills/release-assets/scripts/release_assets.py
```

- `--skip-build`：复用当前 `dist`，不重跑 `pnpm build`
- `--allow-dirty`：仅排障用，跳过已跟踪文件洁净检查
- `--no-upload`：只出本地 zip 与 SHA-256，不碰 GitHub
- `--force`：越过 major 闸门，仅用于用户明确要求发 minor/patch

## 脚本动作

- 把旧 `dist` 移到 `.workbuddy/dist-backup-v<版本>-<时间戳>/`，绕开批量删除保护
- 跑 `pnpm build`（含 `vue-tsc --noEmit`），确认 `dist/index.html` 存在
- 压缩 `dist/` 为 `are-chat-web-<版本>-dist.zip`，`testzip()` 校验并算 SHA-256
- 建或找 `v<版本>` Release，写说明，上传 / 替换 / 跳过资产，最后复核清单

## 硬约束

- 脚本开头判 major；非 X.0.0 直接退出，没有 `--force` 不许发
- 令牌只从环境变量或 `git credential fill` 取，禁止写进仓库与日志
- `-alpha.` / `-beta.` / `-rc.` 标 prerelease，正式版不标；与 `version-release` 的阶梯一致
- 资产名固定为 `are-chat-web-<版本>-dist.zip`，不许改名或增删；zip 内保留 `dist/` 顶层目录
- GitHub 偶发 500 由脚本重试；最终失败保留本地 zip 并报 HTTP 码与资产名
- 上传前先确认已跟踪工作区干净，避免把半截改动发出去
- 发版是 major 阶段唯一允许建 tag 的场景：tag 由本技能在远端 Release 上创建，其他阶段仍不建 tag

## 与提交纪律衔接

- 判档仍归 `version-release` 与 `git-commit`；只有判到 major 才接本技能，不再等用户开口
- 汇报必须给 Release URL、资产名、以及 SHA-256 是否一致；后端 Release 由 `are-chat` 的 skill 单独汇报
- 详细流程、API 坑位与排障口径见 `references/release-flow.md`

# are-chat-web 前端 Release assets 同步细节

## 触发判断

- `package.json` 的 `version` 是前端唯一版本源；tag 固定为 `v` + 整段版本（含 `-rc.1` 这样的后缀）。
- 自动触发只认 major：去掉后缀后必须形如 `X.0.0`（如 `2.0.0`、`2.0.0-rc.1`）；`1.8.0` 与 `1.8.1` 不触发。
- 脚本用 `is_major()` 在打包前判闸，非 major 直接退出；用户明确要求给 minor/patch 发版才加 `--force`。
- 同 tag 的 Release 已存在且资产尺寸、发布说明里的 SHA-256 都一致时，脚本只复核不重传。
- 版本带 `-alpha.` / `-beta.` / `-rc.` 时创建为 prerelease；转正去后缀后号不变，Release 也跟着转正式。
- major 是 `version-release`「不建 tag」纪律的唯一例外：tag 由 GitHub Release 承载，不在本地手工建 tag；非 major 的 alpha/beta/rc/minor/patch 仍不建 tag，`X.0.0-rc.n` 属于 major 照常发。

## 执行顺序

1. 用 `git status --porcelain --untracked-files=no` 确认已跟踪文件干净；不干净直接报，不带脏源码出包。
2. 把旧 `dist` 移到 `.workbuddy/dist-backup-v<版本>-<时间戳>/dist`。
3. 跑 `pnpm build`（= `vite build && vue-tsc --noEmit`），确认 `dist/index.html` 存在。
4. 用 `zipfile.ZIP_DEFLATED` 压缩 `dist/`，保留 `dist/` 顶层目录；`testzip()` 校验并算 SHA-256。
5. 找或建 Release，写说明，上传 / 替换 / 跳过资产，最后用 API 复核资产清单。

## 为什么先挪目录

本机安全策略会拦住对一批旧文件做删除；`mv` 到备份目录不触发删除，构建在空路径上重新生成，旧产物同时留底。备份目录不自动清理，也不入库；需要回收时由人确认后再处理。

## GitHub API 坑位

- 完整 body 的首次 `POST /releases` 实测返回过 500；先建最小 body，再 `PATCH` 完整说明。
- `PATCH` 也会偶发 500，脚本按 2/4/6 秒退避重试 4 次；不要看到一次 500 就改发布文案。
- `uploads.github.com` 上传前两次 500、第三次成功是实测过的；上传重试 3 次。
- 令牌顺序：`GITHUB_TOKEN` → `GH_TOKEN` → `git credential fill`；需要 `repo` 权限，令牌绝不落盘。
- 同步判据是发布说明里的 `- \`<zip 名>\`: \`<64 位 sha256>\`` 行，配合资产字节数；两样都同才跳过。
- 资产尺寸或哈希不一致时先 `DELETE` 同名旧资产再上传，避免 Release 里出现两个同名文件。
- 目标仓库固定为 `levfan/are-chat-web`；后端资产发到 `levfan/are-chat`，不要混发。

## 资产命名

| 资产 | 源目录 | 说明 |
| --- | --- | --- |
| `are-chat-web-<版本>-dist.zip` | `dist/` | 可直接部署到 nginx 的静态包，zip 内保留 `dist/` 顶层目录 |

名字不许按平台习惯另改。静态包不含密钥；后端 API 地址由部署环境/nginx 反代决定，凭据由运维单独注入。

## 失败恢复

- 构建失败（Vite 或 vue-tsc 报错）：修完重跑同一条命令；已挪走的旧 `dist` 留在备份里，不会污染新产物。
- 发布说明 PATCH 失败：重跑会重新 PATCH，资产不会因此重传。
- 上传中断：重跑同一条命令；只有尺寸或哈希不一致的资产才会被替换。
- 复核发现资产错：不要手工改 Release 正文，让脚本按本地 zip 重算并覆盖。

## 人工复核

- 脚本末尾 `FINAL OK` 与 Release URL 是必看两行；`ASSET` 行给出远端字节数。
- 本地 SHA-256 由脚本逐项打印，应与 Release 正文逐字一致。
- 打开 Release 页面确认 Assets 区 zip 可见、标题版本与 tag 一致，prerelease 标记与版本阶段一致。

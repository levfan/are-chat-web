# e2e-live 实时巡检（真后端，逐按钮点击）

这不是回归测试，是**验收手段**：连真实后端、真账号、真落库，按 `src/components/couple/coupleCards.registry.ts`
的卡注册表把每个按钮点一遍，把「点了没反应」和「整页 500」变成可记账的命中。

它抓出过单测永远照不出来的 P0：实体 `Integer` 字段配 `isXxx()` 布尔 getter 造成 MyBatis getter 歧义，
`GET /api/couple/world/world` 与 `GET /api/couple/legacy/vault` 每次都 500（mock 单测全绿）。

## 前置：起后端（务必用本地 H2，不要连生产库）

默认数据源是远端 MariaDB，本地巡检必须整体覆盖成 H2 文件库，并把外部推送渠道全部置空，
否则测试期会真的给用户微信推消息。在 `are-chat/` 目录：

```bash
DB_CONNECT_URL='jdbc:h2:file:<绝对路径>/e2edb;MODE=MySQL;DATABASE_TO_LOWER=TRUE;CASE_INSENSITIVE_IDENTIFIERS=TRUE;AUTO_SERVER=TRUE' \
DB_CONNECT_DRIVER=org.h2.Driver DB_CONNECT_USER=sa DB_CONNECT_PASSWORD='' \
ARECHAT_NOTIFY_WXPUSHER_TOKEN='' ARECHAT_NOTIFY_WXPUSHER_UIDS='' \
ARECHAT_NOTIFY_SERVERCHAN_KEY='' ARECHAT_NOTIFY_WECOM_WEBHOOK='' \
mvn -o -q spring-boot:run
```

Flyway 会自己把 V1-V48 打到空库上。再 `pnpm dev` 起前端（5173），巡检账号是本地 fixture（默认 `alice`，口令用 `AUDIT_PASSWORD` 传，不写进仓库）
（`global-login.ts` 登录一次并把 Cookie 存成 `storageState` 供后续复用；它需要该账号已经建好情侣空间）。

## 跑

```bash
npx playwright test --config e2e-live/live.config.ts                 # 全量：11 个情侣页签 + 聊天/通讯录/管理端
npx playwright test --config e2e-live/live.config.ts -g "页签 timeline"   # 只巡一个页签
```

环境变量开关：

| 变量 | 作用 |
|---|---|
| `FILL=1` | 先把卡内空输入框按 placeholder 填样本值再点按钮——真走写入链路，而不是只撞空态守卫 |
| `MAX_CLICKS` | 每张卡最多点几个控件（默认 8，情侣页建议 16），控制整轮时长 |
| `ONLY_TABS` / `ONLY_SUBS` | 逗号分隔，只巡指定页签 / 子页签，如 `ONLY_TABS=timeline ONLY_SUBS=legacy` |
| `AUDIT_OUT` | 产物目录，默认 `<仓库根>/.audit-live`（已 gitignore） |
| `AUDIT_ADMIN` / `AUDIT_ADMIN_PASSWORD` | 系统级巡检 `/admin` 用的管理员账号口令，同样不入库 |
| `AUDIT_ACCOUNT` / `AUDIT_PASSWORD` | 巡检账号与口令。**口令不入库**，必须用环境变量传；账号是建在本机 H2 文件库里的 fixture |

产物：`live-audit.md`（按 error/dead/http 三类汇总，含卡片与按钮名）、`live-audit.jsonl` 与
`live-audit.progress`（**每点一次就追加**，所以整轮超时也不丢已探进度，可从中断处继续）。

## 判定口径

- `error`：HTTP 5xx/404、页面 JS 异常、控制台报错 —— 必修
- `dead`：点下去既没发请求、DOM 没变、没弹窗、没提示 —— 就是「点了没反应」，必修
- `http`：4xx —— 多数是正常校验，只看文案是否可见

## 护栏（别再踩）

- `BLOCKED` 里的破坏性接口在路由层被拦掉，点到也不落库。**曾有 harness 在确认框里点了 `.last()`
  （实际是「确定」），把测试情侣空间解散了**——收尾一律点 `.first()`，且新加破坏性接口就往 `BLOCKED` 里补一条。
- 页签选择器用 `[aria-controls$="pane-x"]`，真实值是 `pane-x`（**没有先导横杠**）；写错会整轮空跑只报「0 卡片」。
- 首屏加载期的接口错误不发生在点击窗口内，`openSpace()` 单开一个收集器兜住，否则「整页 500」会被当成正常空页漏掉。
- 破坏性按钮由 `DANGER`/`DANGER_TESTID` 两个正则跳过，新增功能若带「解散/注销/清空全部」类按钮，先确认它在这两个正则覆盖范围内。

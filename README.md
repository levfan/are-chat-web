# are-chat-web

天枢（DUBHE）的前端：Vue 3 单页应用，数据与推送都来自同级目录 `../are-chat`。

Vue 3 · Vite · TypeScript · Pinia · Element Plus

## 主要功能

登录后五个页面，加上一条常驻的 WebSocket 推送通道：

| 功能 | 里面有什么 | 页面 |
|------|-----------|------|
| 账号与注册审批 | 手机号 + 验证码注册，提交后进「等待审批」，管理员通过才给登录；改密、注销 | `/login` |
| 私聊 | 会话列表 + 消息流：文本/图片/文件消息、撤回、2 分钟内编辑、表情回应、转发、会话内搜索、会话免打扰、清空记录、拉黑 | `/chat` |
| 通讯录 | 按字母分组的好友目录、加好友（输入联想带关系标注）、申请处理、备注、资料卡、生日提醒、邀请建立情侣空间 | `/contacts` |
| 情侣空间 | 未建时是邀请流程；建好后一页两屏——在一起天数 + 纪念日，和一张亲密日历（经期 🩸 / 边缘 ✨ / 性生活 💞 都在这张卡里记） | `/couple` |
| 管理后台 | 注册审批 / 用户管理 / 全站公告 三个页签，仅 ADMIN 可见 | `/admin` |
| 实时推送 | 新消息、已读、撤回编辑、表态、在线状态、好友与情侣事件、公告都从这一条通道下发 | `/ws/chat/{用户名}` |

## 运行

```bash
pnpm install            # Node 版本下限见 package.json 的 engines
pnpm dev                # http://localhost:5173，/api 与 /ws 代理到后端 8080
```

后端要先起来（在 `../are-chat` 里 `mvn spring-boot:run`），否则登录不了。

## 其他命令

```bash
pnpm build              # 构建 + vue-tsc 类型检查，提交前必过
pnpm test               # Vitest 单测（tests/unit）
pnpm test:e2e           # Playwright 端到端
```

## 部署

前端不单独部署：`pnpm build` 出的 `dist/` 复制到后端仓库 `are-chat/deploy/dist/`，跟后端 jar 打进同一个镜像（容器里 nginx 发静态、把 `/api` 与 `/ws` 反代到 8080），入口和端口都由那边定。命令与排障见后端仓库的 `deploy/README.md`。

## 文档

页面与路由 [wiki/pages-routing.md](wiki/pages-routing.md) ｜ 状态管理 [wiki/state-management.md](wiki/state-management.md) ｜ 接口层 [wiki/api-layer.md](wiki/api-layer.md) ｜ WS 事件 [wiki/ws-events.md](wiki/ws-events.md) ｜ 测试 [wiki/testing.md](wiki/testing.md)

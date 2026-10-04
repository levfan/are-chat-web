# WS 事件链路

> 本页回答：一条情侣空间实时提醒从后端到组件是怎么流动的、现在有哪些事件名。

## 链路总览

```
后端 Service 业务动作
  └─ ImPushService.pushCoupleEvent(Both)  →  WS 推送 { type:'couple', event, username, detail }
       └─ 前端 im store（stores/im.ts）socket.onmessage → handlePush case 'couple'
            └─ window.dispatchEvent(new CustomEvent('arechat:couple',
                 { detail: { event, username, detail } }))
                 └─ couple store 全局一次性监听（bindGlobalListener，模块级标志只绑一次）
                      └─ handleCoupleEvent(event)  按事件名分支（现役 37 个情侣 WS 事件）：
                           ① notify(标题, 中文文案)  ← ElNotification top-right 8s
                           ② if (loaded.value.某域) void loadXxx()   ← 只刷已加载的域
                           ③ 涉总览的事件再 void loadOverview()
                                └─ 组件 computed 依赖 store ref → 自动重渲染
```

要点：

- **im store 只做转发不做业务**：`type==='couple'` 的推送原样转成 `arechat:couple` DOM 事件，与页面层解耦（未登录/不在情侣页也能收到，store 未初始化时由全局监听兜底）。
- **事件 `detail` 即文案**：后端已拼好中文人话，前端直接展示，不做模板拼接。
- **惰性刷新**：`loaded` 门控见 [状态管理](state-management.md)；`dissolved` 事件会整体 `reset()`。
- 特殊事件：`invite`/`invite-accepted`/`invite-rejected`/`anniversary-*`/`space-themed`/`dissolved` 动的是总览本身，一律重拉 `loadOverview()`；`birthday-eve`/`birthday-card`/`anniversary-reminder` 由后端定时任务触发。

## 其他 WS 推送类型（im store `handlePush` 的 case）

| type | 处理 |
|---|---|
| `dm` | 消息入会话/未读；转 `arechat:toast` 事件（ChatView/浮动提示消费），声音/桌面通知按设置与静音 |
| `typing` / `recall` / `read` / `reaction`（转 `arechat:reaction`）/ `message-edit` | 会话内状态更新 |
| `presence` | 好友在线状态 |
| `friend-request` / `friend-accepted` / `friend-deleted` | 好友关系变化刷新 |
| `pin` | 置顶更新 |
| `announcement` | 公告 → `arechat:announcement` 事件 |
| `admin-pending` | 管理员待办数 |
| `couple` | 如上，转发 `arechat:couple` |

页面事件全部由 `stores/im.ts` 派发；`stores/couple.ts` 只做消费方（监听 `arechat:couple`）。组件层监听的主要是 `arechat:couple` / `arechat:toast` / `arechat:reaction` / `arechat:announcement` / `arechat:open-peer` / `arechat:heart-changed` / `arechat:appearance` / `arechat:quiet-hours`。

## arechat:couple 事件名全列（裁剪后现役 37 个，按后端源码抽取）

| 归属 | 事件名 |
|---|---|
| anniversaries | anniversaries-changed |
| anniversary | anniversary-reminder, anniversary-updated |
| birthday | birthday-card, birthday-eve |
| bond | bond-action, bond-milestone |
| box | box-opened, box-received |
| catch | catch-safeword, catch-safeword-reflect, catch-safeword-use |
| ceremony | ceremony-coupon, ceremony-coupon-used |
| comfort | comfort-given, comfort-sent |
| dine | dine-hit, dine-ticket |
| dissolved | dissolved |
| echo | echo-deed-added, echo-deed-starred |
| factory | factory-spin-clear, factory-spin-confirm, factory-spin-item-done, factory-spin-open |
| invite | invite, invite-accepted, invite-rejected |
| mood | mood-changed, mood-reacted |
| night | night-care |
| pet | pet-name-changed |
| quest | quest-lamp, quest-overtime |
| scratch | scratch-redeemed, scratch-scratched |
| space | space-themed |

> 卡片自持域的事件（dine-* / factory-spin-* / quest-* / ceremony-coupon-* / echo-deed-* / catch-safeword-* / scratch-* / box-*）
> **只进通知铃铛，不触发数据刷新**——组件靠写接口返回的整份聚合 VO 更新；store 收到这些事件时只做 `loadIntimacy()` + `loadNotifies()`。

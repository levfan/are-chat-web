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
                      └─ handleCoupleEvent(event)  按事件名分支（现役 15 个情侣 WS 事件）：
                           ① notify(标题, 中文文案)  ← ElNotification top-right 8s
                           ② 按事件归属重拉对应数据（loadOverview / loadStreak / loadQuestion / loadNotifies）
                                └─ 组件 computed 依赖 store ref → 自动重渲染
```

要点：

- **im store 只做转发不做业务**：`type==='couple'` 的推送原样转成 `arechat:couple` DOM 事件，与页面层解耦（未登录/不在情侣页也能收到，store 未初始化时由全局监听兜底）。
- **事件 `detail` 即文案**：后端已拼好中文人话，前端直接展示，不做模板拼接。
- **不认识的事件一律忽略**：二轮裁剪删掉的 30 来个旧事件（mood-*、bond-*、comfort-*、dine-*、factory-*、quest-*、ceremony-*、echo-*、scratch-*、box-*、birthday-*、night-care、anniversaries-changed）后端不会再发；store 末尾没有兜底分支，收到也不发请求不弹提醒——**别为了"以防万一"加回兜底**，那会把已下线功能的推送重新接上。

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

页面事件全部由 `stores/im.ts` 派发；`stores/couple.ts` 只做消费方（监听 `arechat:couple`）。组件层监听的主要是 `arechat:couple` / `arechat:toast` / `arechat:reaction` / `arechat:announcement` / `arechat:open-peer` / `arechat:appearance` / `arechat:quiet-hours`。

## arechat:couple 事件名全列（2026-10-05 二轮裁剪后现役 15 个，后端 `pushCoupleEvent*` 抽取）

| 族 | 事件 | store 的处理 |
|---|---|---|
| 建立流程 | `invite` `invite-accepted` `invite-rejected` | notify「💕 情侣空间」+ `loadOverview()` |
| 解散 | `dissolved` | 先 `reset()` 清场再 `loadOverview()` |
| 空间本体 | `anniversary-updated` | notify「📅 我们的日子」+ `loadOverview()` |
| 空间本体 | `space-themed` | notify「✨ 小空间装扮」+ `loadOverview()`（与日子分开弹：改主题不是改日子） |
| 空间本体 | `pet-name-changed` | notify「🏷️ 专属爱称」+ `loadOverview()`（爱称写入口在 `PUT /profile`，推送单独成条，见 ADR-0010 第 12 条） |
| 定时任务 | `anniversary-reminder` | notify「📅 我们的日子」+ `loadNotifies()`（只补角标，总览没变） |
| 连续互动打卡 | `streak-checkin` `streak-unlocked` `streak-makeup` | notify「🔥 连续互动」+ `loadStreak()` + `loadIntimacy()` + `loadNotifies()` |
| 每日一问 | `question-daily` `question-answered` | notify「💬 每日一问」+ `loadQuestion()` + `loadNotifies()` |
| 愿望清单 | `wish-added` `wish-fulfilled` | notify「🌟 愿望清单」+ `loadNotifies()`（看板由组件自持，靠写接口返回值更新） |

> 刻意**不存在**的事件：`wish-prepared` / `wish-unprepared`。「偷偷准备」对许愿人保密是产品规则，
> 后端 `CoupleWishServiceTest.markingPreparedPushesNothingAtAll` 用 `verifyNoInteractions(push)` 锁死——
> 谁顺手补上这个推送，谁就把惊喜删了。

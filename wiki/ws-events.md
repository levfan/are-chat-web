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
                      └─ handleCoupleEvent(event)  switch(msg.event) 约 170 个 case：
                           ① notify(标题, 中文文案)  ← ElNotification top-right 8s；
                           │   F197 免打扰窗口（myDnd，refreshDnd 拉 museumApi.getDnd）内不弹
                           ② if (loadedLists.value.某域) void loadXxx()   ← 只刷已加载的域
                           ③ 涉总览的事件再 void loadOverview()
                                └─ 组件 computed 依赖 store ref → 自动重渲染
```

要点：

- **im store 只做转发不做业务**：`type==='couple'` 的推送原样转成 `arechat:couple` DOM 事件，与页面层解耦（未登录/不在情侣页也能收到，store 未初始化时由全局监听兜底）。
- **事件 `detail` 即文案**：后端已拼好中文人话，前端直接展示，不做模板拼接。
- **惰性刷新**：`loadedLists` 门控见 [状态管理](state-management.md)；`dissolved` 事件会整体 `reset()`。
- 特殊事件：`invite`/`invite-accepted`/`invite-rejected`/`checkin`/`promise-*` 等都会重拉 overview；`anniversary-reminder`/`birthday-card`/`countdown-reminder`/`capsule-due`/`alarm-fired`/`miss-delivered` 等由后端定时任务触发。

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

`stores/couple.ts` 也会派发个别页面事件（如爱心消息相关），组件层监听的主要是 `arechat:couple` / `arechat:toast` / `arechat:reaction` / `arechat:announcement` / `arechat:open-peer`（utils/notify、settings、ChatView 处使用）。

## arechat:couple 事件名全列（按 handleCoupleEvent 源码，按功能域分组）

| 功能域 | 事件名 |
|---|---|
| 建立/解除 | invite, invite-accepted, invite-rejected, dissolved |
| 双向约定 | promise-created, promise-done, promise-undone, promise-deleted, promise-overdue |
| 每日仪式 | checkin, ritual-unlocked, question-answered, task-done |
| 默契考验 | tacit-started, tacit-answered, tacit-settled |
| 共享清单/日历 | items-changed, anniversaries-changed, anniversary-updated, anniversary-reminder |
| 心情 | mood-changed, mood-reacted |
| 悄悄话 | letter-created, letter-opened |
| 条约 | pact-created, pact-accepted, pact-deleted |
| 心愿基金 | fund-created, fund-deposit, fund-deleted, fund-reached |
| 异地城市 | city-changed |
| 贴贴 | bond-action, bond-milestone, pet-name-changed |
| 情绪关怀 | reconcile-sent, reconcile-accepted, praise-posted, praise-received, cycle-updated, first-aid, comfort-sent, comfort-given, night-care |
| 胶囊/倒数日 | capsule-sealed, capsule-opened, capsule-due, countdown-added, countdown-done, countdown-reminder |
| 共同生活 | chore-added, chore-done, date-plan-added, date-plan-done, habit-added, habit-checkin, habit-both-done, cipher-added |
| 个性化/聊天联动 | space-themed, message-hearted, message-unhearted |
| 第一次/互评 | first-added, first-removed, answer-reacted |
| 惊喜 F50-59 | scratch-scratched, scratch-redeemed, box-received, box-opened, alarm-fired, miss-delivered, treasure-sent, treasure-done, confession-kept, confession-replay |
| 花园 F54-56 | garden-watered, garden-stageup, garden-withered, garden-revived, rose-received, slip-received, birthday-card |
| 和好 F61-62 | peace-review-kept, peace-review-done, sorry-received, sorry-used |
| 谈心 F66-69 | truth-answered, telepathy-started, telepathy-answered, telepathy-matched, telepathy-diff, whisper-asked, whisper-answered, love-bank-deposit, love-bank-interest |
| 养成 F70-79 | challenge-checked, challenge-done, passbook-deposit, hundred-started, hundred-checkin, hundred-done, hundred-broken, wish-received, wish-accepted, wish-done, travel-added, travel-visited, nexttime-added, nexttime-nudged, nexttime-done, read-started, read-progress, read-finished, watch-added, watch-updated, watch-finished, dict-added |
| 回忆资产 F80-89 | quote-kept, ticket-added, song-added |
| 沟通 F100-109 | cool-started, cool-soften, cool-healed, relay-tossed, relay-caught, guess-started, guess-clued, guess-wrong, guess-hit, guess-missed, story-line, story-done, apology-sent, apology-accepted, feeling-word |
| 异地 F110-119 | handhold-lit, handhold-both, miss-lit, miss-both, routine-updated, reunion-letter-sealed, reunion-letter-opened（与信箱 letter-opened 已改名区分）, cloud-added, cloud-done, safety-ping, reunion-logged |
| 确定感 F120-129 | security-deposit, security-accepted, decade-written, decade-complete, vision-added, vision-resonate, oath-made, oath-stamped, oath-exhibited, trust-deposit, contract-made, contract-checkin, pet-adopted, pet-cared |
| 游戏 F130-139 | survey-answered, quiz-made, quiz-answered, quiz-judged, love-word-kept, blind-submitted, blind-settled, battle-joined, battle-full, battle-voted, battle-done, art-added |
| 陪伴 F140-149 | dream-written, food-added, food-checkin, fact-added, sos-ping, sos-held, three-saved, three-both, badge-added, badge-issued |
| 成长教练 F150-159 | streak-started, streak-checkin, streak-done, thanks-note, feel-logged, week-star-saved, week-star-both, read-thought, delay-added, delay-nagged, delay-done, praise-bank-added |
| 文字浪漫 F160-169 | poem-line, poem-made, poem-liked, morning-note-sealed, morning-note-read, bottle-tossed, bottle-replied, cipher-note-made, cipher-note-cracked, soul-answered, soul-both, journal-updated |
| 默契亲密 F170-179 | love-lang-done, heart-flash, whatif-answered, whatif-both, signal-added, sync-tap-hit |
| 其它 | notify-ignored（通知忽略） |

**注意**：manageApi（F180-F189）与 museumApi（F190-F199）批次**没有专属 WS 事件**（组件自持数据、进入页签时拉取；museum 的 F197 dnd 经 `refreshDnd` 参与静音判断）。新增事件时三处同步：后端 pushCoupleEvent、`handleCoupleEvent` case、map skill 事件清单。

---

上一页：[API 层](api-layer.md) ｜ 下一页：[测试](testing.md)

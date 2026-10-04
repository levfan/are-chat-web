# API 层

> 本页回答：`src/api/` 有哪些文件与分组对象、每个对象的方法与路径、与后端 `/api/couple/*` 路由的对应关系。
> **2026-10-04 情侣空间裁剪后**：`couple.ts` 从 565 个方法 / 2096 行降到 **57 个方法 / 8 个分组对象 / 218 行**，
> 与后端 57 个存活端点一一对齐（VO 字段由 `.tmp-audit/contract-check.mjs` 逐字段核过）。

## 非 couple 分组（未动）

| 文件 | 导出对象 | base 路径 |
|---|---|---|
| `http.ts` | `http`、`ApiError` | — |
| `auth.ts` | `authApi` / `adminApi` | `/api/auth` / `/api/admin` |
| `im.ts` | `friendApi` / `messageApi` / `starsApi` / `profileApi` | `/api/friends` `/api/messages` `/api/stars` `/api/profile` |
| `files.ts` | `filesApi` | `/api/files` |
| `system.ts` | `presenceApi` / `systemApi` / `announcementApi` | `/api/presence` `/api/system` `/api/announcements` |

## couple 分组对象（8 个 / 57 个方法）

| 导出对象 | base 路径 | 方法数 | 职责 |
|---|---|---:|---|
| `coupleApi` | `/api/couple` | 36 | 空间地基（总览/邀请/纪念日/个性化/心动值/通知/运营看板）+ 心情日记 + 贴贴 + 求抱抱 + 刮刮乐与盲盒 |
| `pinApi` | `/api/couple/pin` | 2 | F207 常用收藏 |
| `diningApi` | `/api/couple/dining` | 2 | 卡 `couple-dine-today` 今晚饭桌 |
| `ceremonyApi` | `/api/couple/ceremony` | 3 | 卡 `couple-cere-coupon` 愿望券本 |
| `factoryApi` | `/api/couple/factory` | 4 | 卡 `couple-fy-spin` 家务轮盘 |
| `echoApi` | `/api/couple/echo` | 3 | 卡 `couple-echo-deed` 好事簿 |
| `questApi` | `/api/couple/quest` | 3 | 卡 `couple-quest-overtime` 加班预报与留灯 |
| `catchApi` | `/api/couple/catch` | 4 | 卡 `couple-catch-safeword` 安全词与暂停复盘 |

### 方法全列（按分组，路径省略各自的组 base 前缀后的完整路径照写）

#### `coupleApi`

| 方法 | HTTP | 路径 | 说明 |
|---|---|---|---|
| `overview` | GET | `/api/couple/overview` | — |
| `invite` | POST | `/api/couple/invites` | 建立流程 |
| `acceptInvite` | POST | `/api/couple/invites/{id}/accept` | — |
| `rejectInvite` | POST | `/api/couple/invites/{id}/reject` | — |
| `cancelInvite` | DELETE | `/api/couple/invites/{id}` | — |
| `setAnniversary` | PUT | `/api/couple/anniversary` | 在一起纪念日（yyyy-MM-dd） |
| `dissolve` | POST | `/api/couple/dissolve` | — |
| `anniversaries` | GET | `/api/couple/anniversaries` | — |
| `createAnniversary` | POST | `/api/couple/anniversaries` | — |
| `deleteAnniversary` | DELETE | `/api/couple/anniversaries/{id}` | — |
| `saveMood` | POST | `/api/couple/moods` | 记录/修改今天的心情（每人每天一条，重复提交视为修改） |
| `moods` | GET | `/api/couple/moods?days={days}` | 双方最近 N 天的心情（1-90，默认 14），按日期新→旧 |
| `intimacy` | GET | `/api/couple/intimacy` | — |
| `sendAction` | POST | `/api/couple/bond/actions` | — |
| `bondActions` | GET | `/api/couple/bond/actions?limit={limit}` | 最近动作流（新→旧，默认 50 条） |
| `bondStats` | GET | `/api/couple/bond/stats` | 贴贴统计 |
| `reactMood` | POST | `/api/couple/bond/mood-reactions` | 回应 TA 某天的心情（默认今天）：抱抱/亲亲/加油/摸摸头 |
| `moodReactions` | GET | `/api/couple/bond/mood-reactions?day={day}` | 某天（默认今天）双方给彼此心情的回应 |
| `setPetName` | PUT | `/api/couple/bond/pet-name` | 给 TA 设置专属爱称（空串清除） |
| `updateProfile` | PUT | `/api/couple/profile` | — |
| `notifyMine` | GET | `/api/couple/notify` | — |
| `notifyReadAll` | POST | `/api/couple/notify/read-all` | F41 全部标记已读 |
| `relationshipOf` | GET | `/api/couple/relationship-of/${encodeURIComponent(username)}` | F44 恋爱中徽章：某人是否在恋爱中 + 天数（仅其好友可查） |
| `adminCoupleStats` | GET | `/api/couple/admin/stats` | F45 管理看板：情侣空间运营统计（仅管理员） |
| `scratches` | GET | `/api/couple/surprise/scratches` | — |
| `scratchCard` | POST | `/api/couple/surprise/scratches/{id}/scratch` | F50 刮开我的券 |
| `redeemScratch` | POST | `/api/couple/surprise/scratches/{id}/redeem` | F50 送券人核销 |
| `boxes` | GET | `/api/couple/surprise/boxes` | F51 盲盒列表 |
| `createBox` | POST | `/api/couple/surprise/boxes` | F51 装一个盲盒（最早明天开箱） |
| `openBox` | POST | `/api/couple/surprise/boxes/{id}/open` | F51 开盲盒 |
| `comfortBoard` | GET | `/api/couple/care/comfort` | — |
| `askComfort` | POST | `/api/couple/care/comfort` | F60 发出求抱抱 |
| `comfortCards` | GET | `/api/couple/care/comfort/cards?feeling={feeling}` | F60 TA 的安慰话术卡（按感受随机 3 张） |
| `handleComfort` | POST | `/api/couple/care/comfort/handle` | F60 回应 TA 的求抱抱 |
| `chatTopics` | GET | `/api/couple/care/chat-topics` | F63 陪聊话题卡（随机 3 张） |
| `moodSync` | GET | `/api/couple/care/mood-sync` | F64 情绪同步率 |

#### `pinApi`

| 方法 | HTTP | 路径 | 说明 |
|---|---|---|---|
| `list` | GET | `/api/couple/pin` | 双方收藏的功能卡 key（mine/partner 各 ≤6 个） |
| `save` | POST | `/api/couple/pin` | 全量覆盖保存我的收藏（超过 6 个后端 400；无空间 404 由调用方静默） |

#### `diningApi`

| 方法 | HTTP | 路径 | 说明 |
|---|---|---|---|
| `dineToday` | GET | `/api/couple/dining/today` | F210 今日饭桌：双方饭票 + 撞菜命中 + 裁决 + 话题打卡状态 |
| `dineCastTicket` | POST | `/api/couple/dining/ticket` | F210 投/改今日饭票（每人每天一票，改票即覆盖），返回最新今日饭桌 |

#### `ceremonyApi`

| 方法 | HTTP | 路径 | 说明 |
|---|---|---|---|
| `cereOverview` | GET | `/api/couple/ceremony/overview` | F230-F239 今日仪式总览：黄历宜忌/小日子/催办/保险柜/续约/愿望券/体感/加冕一次拉齐 |
| `cereIssueCoupon` | POST | `/api/couple/ceremony/coupon` | — |
| `cereUseCoupon` | POST | `/api/couple/ceremony/coupon/use` | F236 核销一张愿望券（OPEN→USED，已核销再核 400），返回整份总览 |

#### `factoryApi`

| 方法 | HTTP | 路径 | 说明 |
|---|---|---|---|
| `fyBoard` | GET | `/api/couple/factory/board` | F270-F279 本周车间总览（十卡一次拉齐；未建空间 404 前端静默降级） |
| `fySpin` | POST | `/api/couple/factory/spin` | F270 一转定分工（逗号/顿号分隔事项，2-8 条、每条 ≤40 字且不可重复；本周已转过后端 400），返回整份总览 |
| `fySpinConfirm` | POST | `/api/couple/factory/spin/confirm` | F270 给天选之人的任务认账（双签生效；自己行点自己后端 400「自己的活自己认」），返回整份总览 |
| `fySpinDone` | POST | `/api/couple/factory/spin/done` | F270 天选之人干完打勾（非本人行/对方还没认账时后端 400），返回整份总览 |

#### `echoApi`

| 方法 | HTTP | 路径 | 说明 |
|---|---|---|---|
| `echoVault` | GET | `/api/couple/echo/vault` | F350-F359 回音壁总览（十板块一次拉齐：deeds/partnerDeeds 各限最近 30 条、juices/highlights 两人合计、 slowInFlight 按寄出日正序、slowArrived 只给最近 10 封、refill 未领取时是空包的今日态、 selfLetter 没在途信时为 null；未建空间 404 前端静默降级） |
| `echoDeed` | POST | `/api/couple/echo/deed` | F350 记一件「TA 为我做的事」（content ≤80 字必填「好事总得写一句」，超 80 字 400；day 空串=今天且须 yyyy-MM-dd 否则 400「日期写成 yyyy-MM-dd」；同日同人同内容重复 400「这条已经记过了」；新增推双方），返回整份总览 |
| `echoDeedStar` | POST | `/api/couple/echo/deed/star` | F350 给证据点「这条救过我」（⚠️ 只有记录人本人能点：id 不在本空间 400「这条不在好事簿里」、 点 TA 记的那条 400「只有记下这条的人能加星」；已加星再点幂等返回不重推），返回整份总览 |

#### `questApi`

| 方法 | HTTP | 路径 | 说明 |
|---|---|---|---|
| `questBoard` | GET | `/api/couple/quest/board` | F370-F379 关卡总览（GET /board：十九个字段一次拉齐，⚠️ wall 恒是「服务端当年」那一份； myOvertime/partnerOvertime/myNurse/partnerNurse/myPod/partnerPod/moveNight/myValley/partnerValley 没数据时为 null，其余字符串后端恒给空串；未建空间 404 前端静默降级） |
| `questOvertime` | POST | `/api/couple/quest/overtime` | — |
| `questLamp` | POST | `/api/couple/quest/overtime/lamp` | F372 给对方留一张到家灯卡（id 是对方今晚那行预报的 id；⚠️ 只有对方能留、自己的行留不算， text 必填 ≤60 字；找不到那行是 404），返回整份总览 |

#### `catchApi`

| 方法 | HTTP | 路径 | 说明 |
|---|---|---|---|
| `catchBoard` | GET | `/api/couple/catch/board` | F380-F389 聆听者总览（GET /board：二十四个字段一次拉齐；⚠️ myWord/partnerWord/myProtocol/ partnerProtocol/myToday/partnerToday 没数据时为 null，其余字符串后端恒给空串；未建空间 404 前端静默降级） |
| `catchSafeword` | POST | `/api/couple/catch/safeword` | — |
| `catchSafewordUse` | POST | `/api/couple/catch/safeword/use` | F382 喊了一次暂停（⚠️ 后端无请求体，传 {}；还没约词 400、一天一人只记一次），返回整份总览 |
| `catchSafewordReflect` | POST | `/api/couple/catch/safeword/reflect` | F382 给某次暂停补事后复盘（⚠️ 只有喊停本人能补；reflect 必填 ≤60 字），返回整份总览 |

## 约定

- 一律走 `http.ts` 的 `get / postJson / putJson / delete / postForm`，`withCredentials` 已内置；后端返回 `ApiResponse{code,message,data}`，解包后只给业务 `data`。
- 后端业务失败是 400/404 + **中文 message**，组件侧一律 `ElMessage.error(e.message)` 直透，不在前端重写文案。
- 写接口返回**整份聚合 VO**的（catch/ceremony/dining/echo/factory/quest），组件拿返回值整体替换本地状态，不再单独拉一次。
- 新增方法前先看后端有没有这个端点：**判据是 `@*Mapping`，不是文档**。

# API 层

> 本页回答：`src/api/` 有哪些文件与分组对象、每个对象的方法与路径、与后端 `/api/couple/*` 路由的对应关系。
> **2026-10-20 四轮裁剪 + 经期记录后**：`couple.ts` 收敛到 **24 个方法 / 5 个分组对象 / 117 行**，与后端 24 个存活端点一一对齐
> （裁剪判据见 `are-chat/docs/adr/0010-couple-trim-to-v8-features.md`；`tests/unit/couple.spec.ts` 的「api 契约守卫」
> 用例逐方法断言 mock 工厂覆盖 + 总数为 24）。

## 非 couple 分组（未动）

| 文件 | 导出对象 | base 路径 |
|---|---|---|
| `http.ts` | `http`、`ApiError` | — |
| `auth.ts` | `authApi` / `adminApi` | `/api/auth` / `/api/admin` |
| `im.ts` | `friendApi` / `messageApi` / `profileApi` | `/api/friends` `/api/messages` `/api/profile` |

> 聊天侧的 `starsApi`（消息收藏）与 `messageApi.searchGlobal`（全局搜索）已在 2026-10-20 随入口一起下线；好友 `tag` 字段（分组）也已删除，`friendApi.update` 只剩 `remark/pinned/muted/blocked`。
| `files.ts` | `filesApi` | `/api/files` |
| `system.ts` | `presenceApi` / `systemApi` / `announcementApi` | `/api/presence` `/api/system` `/api/announcements` |

## couple 分组对象（5 个 / 24 个方法）

| 导出对象 | base 路径 | 方法数 | 职责 |
|---|---|---:|---|
| `coupleApi` | `/api/couple` | 10 | 地基：总览/邀请建立/纪念日/空间个性化/心动值/恋爱徽章 |
| `streakApi` | `/api/couple/streak` | 2 | 卡 `couple-streak` 连续互动打卡 + 六档解锁 |
| `questionApi` | `/api/couple/question` | 2 | 卡 `couple-question` 每日一问（它同时是打卡的触发源） |
| `wishApi` | `/api/couple/wish` | 6 | 卡 `couple-wish` 愿望清单 |
| `periodApi` | `/api/couple/period` | 4 | 卡 `couple-period` 经期记录（双方都能记，无 WS 事件） |

**已随裁剪整体下线、不得再写回**：`pinApi`（F207 常用收藏）、`memoryApi`（百日隐藏回顾页）、`diningApi`（饭桌）、`ceremonyApi`（愿望券本）、
`factoryApi`（家务轮盘）、`echoApi`（好事簿）、`questApi`（加班留灯）、`catchApi`（安全词复盘），
以及 `coupleApi` 里的 `saveMood/moods/bondStats/sendAction/reactMood/moodReactions/setPetName/anniversaries CRUD/scratches/boxes/comfort*/chatTopics/moodSync`
与 `notifyMine/notifyReadAll/adminCoupleStats`（通知中心与 F45 运营看板）。

### 方法全列

#### `coupleApi`（10）

| 方法 | HTTP | 路径 | 说明 |
|---|---|---|---|
| `overview` | GET | `/api/couple/overview` | 未建空间时带待处理邀请（incoming/outgoing）；`OverviewVO` 只有 `space/incoming/outgoing` 三键 |
| `invite` | POST | `/api/couple/invites` | 建立流程第一步：向好友发起邀请 |
| `acceptInvite` | POST | `/api/couple/invites/{id}/accept` | 同意后空间建立，返回 `SpaceVO`；建空间当天自动算第 1 个打卡日 |
| `rejectInvite` | POST | `/api/couple/invites/{id}/reject` | 婉拒发给自己的邀请 |
| `cancelInvite` | DELETE | `/api/couple/invites/{id}` | 撤回自己发出的待处理邀请 |
| `setAnniversary` | PUT | `/api/couple/anniversary` | 在一起纪念日（yyyy-MM-dd），唯一的日子（共同日历已删） |
| `dissolve` | POST | `/api/couple/dissolve` | 解除情侣空间 |
| `updateProfile` | PUT | `/api/couple/profile` | 空间个性化三合一：`{slogan?, theme?, petName?}`，**null=不改该项、空串=清除**；⚠️ 独立的 `PUT /couple/bond/pet-name` 已随贴贴卡下线，爱称只有这一条通道 |
| `intimacy` | GET | `/api/couple/intimacy` | 心动值五项 breakdown：`daysTogether/checkinDays/longestStreak/answerDays/wishFulfilled` |
| `relationshipOf` | GET | `/api/couple/relationship-of/{username}` | F44 恋爱中徽章：某人是否在恋爱中 + 天数（仅其好友可查） |

#### `streakApi`（2）

| 方法 | HTTP | 路径 | 说明 |
|---|---|---|---|
| `streakBoard` | GET | `/api/couple/streak/board` | 打卡看板：14 个字段一次拉齐（tiers 六档 / strip 近 21 格 / `makeupWindowDays`/`makeupLeftThisMonth`/`canMakeup`）；**没有 `makeupCost`/`balance`**——积分台账已删，补签不花钱 |
| `streakMakeup` | POST | `/api/couple/streak/makeup` | 补签某天（body `{day}`），返回整份看板；闸门（7 天窗口、本月 3 次、今天不许补）全由后端 `canMakeup` 位算好 |

#### `questionApi`（2）

| 方法 | HTTP | 路径 | 说明 |
|---|---|---|---|
| `questionToday` | GET | `/api/couple/question/today` | 今天这一问 + 我的作答 + 对方答案（`bothAnswered` 才下发） |
| `questionAnswer` | POST | `/api/couple/question/answer` | 交卷/改写（≤`answerMax` 字后端 400），返回整份 TodayVO；**双方都答完时后端在这里触发打卡** |

#### `wishApi`（6）

| 方法 | HTTP | 路径 | 说明 |
|---|---|---|---|
| `wishBoard` | GET | `/api/couple/wish/board` | 清单看板（open/prepared/fulfilled 三档 + 上限与字数闸门） |
| `wishAdd` | POST | `/api/couple/wish/add` | 许愿：`(title, note, ownerUsername)` |
| `wishPrepare` | POST | `/api/couple/wish/prepare` | 偷偷标「已准备」（只有对方能标，对许愿人保密，不推任何事件） |
| `wishUnprepare` | POST | `/api/couple/wish/unprepare` | 撤回「已准备」 |
| `wishFulfill` | POST | `/api/couple/wish/fulfill` | 兑现（只有被许的那位能点） |
| `wishRemove` | POST | `/api/couple/wish/remove` | 划掉一条 |

#### `periodApi`（4）

| 方法 | HTTP | 路径 | 说明 |
|---|---|---|---|
| `periodBoard` | GET | `/api/couple/period/board` | 记录列表 + 平均周期 / 下次预测 / 距今天数（读时算，没有缓存列） |
| `periodAdd` | POST | `/api/couple/period/add` | 记开始日（body `{startDay}`，yyyy-MM-dd 且不能是未来）；同一天重复记后端 400 |
| `periodEnd` | POST | `/api/couple/period/end` | 给某次记结束日（body `{id}`，结束日固定为今天；已结束或早于开始日后端 400） |
| `periodRemove` | POST | `/api/couple/period/remove` | 删掉一条记录（body `{id}`；不在本空间的 id 后端 404） |

四个写接口都返回整份 `PeriodBoardVO`；周期样本不足 2 段时后端按 28 天估，`daysUntilNext` 为负表示已推迟。**这条链路不推任何 WS 事件**（隐私），前端只在挂载与写操作后刷新。

## 约定

- 一律走 `http.ts` 的 `get / postJson / putJson / delete / postForm`，`withCredentials` 已内置；后端返回 `ApiResponse{code,message,data}`，解包后只给业务 `data`。
- 后端业务失败是 400/404 + **中文 message**，组件侧一律 `ElMessage.error(e.message)` 直透，不在前端重写文案。
- 写接口返回**整份聚合 VO** 的（streak/question/wish/period），组件拿返回值整体替换本地状态，不再单独拉一次。
- 新增方法前先看后端有没有这个端点：**判据是 `@*Mapping`，不是文档**；四张卡之外的功能已被 `docs/adr/0010` 判死，别顺着旧文档把它们加回来。

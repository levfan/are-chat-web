# API 层

> 本页回答：`src/api/` 有哪些文件与分组对象、每个对象的方法与路径、与后端 `/api/couple/*` 路由的对应关系。
> **2026-10-20 三轮裁剪后**（用户指令「保留在一起天数、纪念日、美柚app上的日历记录，其它功能都不要了」）：`couple.ts` 收敛到 **14 个方法 / 4 个分组对象 / 74 行**，与后端 14 个存活端点一一对齐
> （前几轮的裁剪判据见 `are-chat/docs/adr/0010-couple-trim-to-v8-features.md`，本轮把每日一问 / 连续互动打卡 / 愿望清单三张卡连同心动值与空间个性化一起下线；`tests/unit/couple.spec.ts` 的「api 契约守卫」
> 用例逐方法断言 mock 工厂覆盖 + 总数为 14）。

## 非 couple 分组（未动）

| 文件 | 导出对象 | base 路径 |
|---|---|---|
| `http.ts` | `http`、`ApiError` | — |
| `auth.ts` | `authApi` / `adminApi` | `/api/auth` / `/api/admin` |
| `im.ts` | `friendApi` / `messageApi` / `profileApi` | `/api/friends` `/api/messages` `/api/profile` |

> 聊天侧的 `starsApi`（消息收藏）与 `messageApi.searchGlobal`（全局搜索）已在 2026-10-20 随入口一起下线；好友 `tag` 字段（分组）也已删除，`friendApi.update` 只剩 `remark/muted/blocked`（会话置顶入口已从聊天设置中移除）。
| `files.ts` | `filesApi` | `/api/files` |
| `system.ts` | `presenceApi` / `systemApi` / `announcementApi` | `/api/presence` `/api/system` `/api/announcements` |

## couple 分组对象（4 个 / 14 个方法）

| 导出对象 | base 路径 | 方法数 | 职责 |
|---|---|---:|---|
| `coupleApi` | `/api/couple` | 8 | 地基：总览/邀请建立/纪念日/解除 + 恋爱徽章旁支读取 |
| `periodApi` | `/api/couple/period` | 3 | 卡 `couple-calendar` 的经期写口（记开始日/补结束日/删错记，双方都能记，无 WS 事件） |
| `intimateApi` | `/api/couple/intimate` | 2 | 卡 `couple-calendar` 的亲密写口（记一笔/删一条，边缘/性生活同日可多条，无 WS 事件） |
| `calendarApi` | `/api/couple/calendar` | 1 | 卡 `couple-calendar` 亲密日历：一个月度只读口，也是唯一的记录读口——经期覆盖日、周期统计与亲密标记一次给齐 |

**已随裁剪整体下线、不得再写回**：`pinApi`（F207 常用收藏）、`memoryApi`（百日隐藏回顾页）、`diningApi`（饭桌）、`ceremonyApi`（愿望券本）、
`factoryApi`（家务轮盘）、`echoApi`（好事簿）、`questApi`（加班留灯）、`catchApi`（安全词复盘），
以及 `coupleApi` 里的 `saveMood/moods/bondStats/sendAction/reactMood/moodReactions/setPetName/anniversaries CRUD/scratches/boxes/comfort*/chatTopics/moodSync`
与 `notifyMine/notifyReadAll/adminCoupleStats`（通知中心与 F45 运营看板）。
2026-10-20 三轮裁剪再下线：分组 `streakApi`（连续互动打卡与六档解锁）、`questionApi`（每日一问）、`wishApi`（愿望清单），
`coupleApi` 的 `updateProfile`（宣言/主题/爱称三合一）与 `intimacy`（心动值五项），以及 `periodApi.periodBoard`/`intimateApi.intimateBoard` 两张独立看板——展示数据统一由 `calendarApi.calendarMonth` 一个月度读口下发。

### 方法全列

#### `coupleApi`（8）

| 方法 | HTTP | 路径 | 说明 |
|---|---|---|---|
| `overview` | GET | `/api/couple/overview` | 未建空间时带待处理邀请（incoming/outgoing）；`OverviewVO` 只有 `space/incoming/outgoing` 三键 |
| `invite` | POST | `/api/couple/invites` | 建立流程第一步：向好友发起邀请 |
| `acceptInvite` | POST | `/api/couple/invites/{id}/accept` | 同意后空间建立，返回 `SpaceVO` |
| `rejectInvite` | POST | `/api/couple/invites/{id}/reject` | 婉拒发给自己的邀请 |
| `cancelInvite` | DELETE | `/api/couple/invites/{id}` | 撤回自己发出的待处理邀请 |
| `setAnniversary` | PUT | `/api/couple/anniversary` | 在一起纪念日（yyyy-MM-dd），唯一的日子：在一起天数与纪念日倒数提醒共同的起点；`CoupleSpaceVO` 已去掉 `slogan`/`theme`，空间个性化（含独立的 `PUT /couple/profile`）随三轮裁剪整体下线 |
| `dissolve` | POST | `/api/couple/dissolve` | 解除情侣空间 |
| `relationshipOf` | GET | `/api/couple/relationship-of/{username}` | F44 恋爱中徽章：某人是否在恋爱中 + 天数（仅其好友可查） |

#### `periodApi`（3）

| 方法 | HTTP | 路径 | 说明 |
|---|---|---|---|
| `periodAdd` | POST | `/api/couple/period/add` | 记开始日（body `{startDay}`，yyyy-MM-dd 且不能是未来）；同一天重复记后端 400 |
| `periodEnd` | POST | `/api/couple/period/end` | 给某次记结束日（body `{id}`，结束日固定为今天；已结束或早于开始日后端 400） |
| `periodRemove` | POST | `/api/couple/period/remove` | 删掉一条记录（body `{id}`；不在本空间的 id 后端 404） |

三个写接口都只回成功与否（`void`），不回看板——展示数据统一由 `calendarApi.calendarMonth` 下发，写完按当前可见月重拉一次；入口就在日历卡里，`CouplePeriod.vue` 已随三轮裁剪删除。周期样本不足 2 段时后端按 28 天估，`daysUntilNext` 为负表示已推迟，前端只显示「按记录推算」。**这条链路不推任何 WS 事件**（隐私）。

#### `intimateApi`（2）

| 方法 | HTTP | 路径 | 说明 |
|---|---|---|---|
| `intimateAdd` | POST | `/api/couple/intimate/add` | 记一次亲密：body `{day, kind, note}`，`kind` ∈ `EDGE`/`SEX`，`day` 不能是未来，备注 ≤60 字；同一天允许多条 |
| `intimateRemove` | POST | `/api/couple/intimate/remove` | 删一条记录（body `{id}`，双方都能删；不在本空间的 id 后端 404） |

两个写接口都只回成功与否（`void`），原来的 `intimateApi.intimateBoard` 已并入月度读口。**这条链路同样不推任何 WS 事件**、不再有心动值可参与；入口都在日历卡上，`CoupleIntimate.vue` 已随三轮裁剪删除。

#### `calendarApi`（1）

| 方法 | HTTP | 路径 | 说明 |
|---|---|---|---|
| `calendarMonth` | GET | `/api/couple/calendar/month?month=yyyy-MM` | 整月日历：`periodDays`（本月被经期覆盖的天）/`periodStartDays`/`periodEndDays`/`periods`（本月区间，含 id 与 endDay）/`predictedNextDay` + `averageCycleDays`/`cycleSampleCount`/`daysUntilNext` + `intimateTotal` + `intimate`（本月亲密标记，id/day/kind/note/recorderUser，日期正序） |

`month` 缺参或空白 → 400「要看哪个月呀？给我 yyyy-MM 这样的」，格式错 → 400「月份得是 yyyy-MM 这样的」，无空间 → 404（卡片静默收起）。未来的月份正常返回空数组。
**一页只有一份经期真相**：区间判定（含「没记结束日的只到今天」）留在后端 `PeriodRecord.covers`，前端只按下发的天列表铺格子；`CoupleCalendar.vue` 既是视图也是唯一的记录入口，五个写口（`periodApi` 三个 + `intimateApi` 两个）由它自己调，写完按当前可见月重拉这一次读口，格子与摘要一起亮——所以三轮裁剪把两张记录卡并进日历卡后，`utils/coupleRecordBus.ts` 那个页内刷新信号（`arechat:couple-record-changed`）也一起删了：同组件内部不存在需要跨卡通知的第二份状态。整条链路不推 WS 事件。

## 约定

- 一律走 `http.ts` 的 `get / postJson / putJson / delete / postForm`，`withCredentials` 已内置；后端返回 `ApiResponse{code,message,data}`，解包后只给业务 `data`。
- 后端业务失败是 400/404 + **中文 message**，组件侧一律 `ElMessage.error(e.message)` 直透，不在前端重写文案。
- couple 侧五个记录写口（`periodApi` 三个 + `intimateApi` 两个）都**不回数据**，组件写完重拉 `calendarApi.calendarMonth` 那一个读口；早期「写接口返回整份聚合 VO 整体替换」的口径随看板端点一起作废。
- 新增方法前先看后端有没有这个端点：**判据是 `@*Mapping`，不是文档**；亲密日历与在一起天数/纪念日之外的功能已被历轮裁剪判死（`docs/adr/0010` 是第一份，2026-10-20 三轮裁剪又砍掉每日一问 / 连续打卡 / 愿望清单），别顺着旧文档把它们加回来。

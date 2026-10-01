# API 层

> 本页回答：`src/api/` 有哪些文件与分组对象、每个对象的方法与路径、与后端 `/api/couple/*` 路由的对应关系。

## 文件与分组对象总览

| 文件 | 导出对象 | base 路径 | 职责 |
|---|---|---|---|
| `http.ts` | `http`、`ApiError` | — | fetch 封装（见 [架构总览](architecture.md)） |
| `auth.ts` | `authApi` | `/api/auth` | login/smsCode/register（提交审批申请）/registerStatus/logout/me/changePassword/deactivate |
| `auth.ts` | `adminApi` | `/api/admin` | applications/approve/reject/pendingCount/users/setUserStatus/resetPassword/audit/announcements/publishAnnouncement/closeAnnouncement |
| `im.ts` | `friendApi` | `/api/friends` | list/suggest/apply/incoming/outgoing/accept/reject/update/remove |
| `im.ts` | `messageApi` | `/api/messages/{peer}` | history/send/markRead/recall/search/exportConversation/edit/toggleReaction/toggleStar/searchGlobal/pin/unpin/currentPin/clear/attachments/markHeart/heartMoments |
| `im.ts` | `starsApi` | `/api/stars` | list（收藏消息） |
| `im.ts` | `profileApi` | `/api/profile` | me/of/update/friendsBirthdays |
| `files.ts` | `filesApi` | `/api/files` | upload（FormData 走 `http.postForm`） |
| `system.ts` | `presenceApi` | `/api/presence` | online（在线人数） |
| `system.ts` | `systemApi` | `/api/system` | health |
| `system.ts` | `announcementApi` | `/api/announcements` | current/markRead |
| `couple.ts` | **`coupleApi`** | `/api/couple` | 情侣空间主体（下表全列） |
| `couple.ts` | **`manageApi`** | `/api/couple/manage` | F180-F189 生活经营（CoupleManage 自持调用） |
| `couple.ts` | **`museumApi`** | `/api/couple/museum` | F190-F199 时光博物馆（CoupleMuseum 自持调用；写接口返回最新全量列表） |
| `couple.ts` | **`pinApi`** | `/api/couple/pin` | F207 常用收藏：list/save（≤6 键全量覆盖，CoupleView 头部 chips 用） |

## coupleApi 全量方法（按源码分区）

约定：GET 查询、POST 动作、PUT 整体保存、DELETE 删除；路径省略前缀 `/api/couple`；一行内多个方法为同一资源组（列表/创建/操作/删除）。

| 分区 | 方法与路径 | 一句话 |
|---|---|---|
| 总览 | `overview` GET `/overview` | 空间+邀请+打卡+逾期+信箱未读聚合 |
| 建立流程 | `invite` POST `/invites`；`acceptInvite`/`rejectInvite` POST `/invites/{id}/accept|reject`；`cancelInvite` DELETE `/invites/{id}`；`setAnniversary` PUT `/anniversary`；`dissolve` POST `/dissolve` | 邀请→接受建空间/婉拒/撤回；设在一起纪念日；解除关系 |
| 双向约定 | `promises` GET `/promises`；`createPromise` POST（side me/partner+dueAt）；`donePromise`/`undonePromise` POST `/promises/{id}/done|undone`；`deletePromise` DELETE | 我答应 TA / TA 答应我的待办 |
| 每日小仪式 | `checkin` POST `/checkins`（kind 早/晚安）；`question` GET `/question`；`answerQuestion` POST `/question` | 打卡 + 今日一问拉题/作答 |
| 共享空间 | `items` CRUD `/items`；`anniversaries` `createAnniversary`/`deleteAnniversary` `/anniversaries` | 共享清单（kind/title/note/dueDate）；纪念日历 |
| 心情 | `saveMood` POST `/moods`（每人每天一条，重复=改）；`moods(days=14)` GET `/moods?days` | 心情日记与双方近 N 天心情 |
| 时光轴 | `timeline(days=30)` GET `/timeline?days` | 「我们的故事」按天聚合 |
| 心动值 | `intimacy` GET `/intimacy` | 心动值/恋爱等级/升级分解 |
| 悄悄话信箱 | `createLetter` POST `/letters`（deliverAt 空=立即，7 天内=慢递）；`letters` GET；`openLetter` POST `/letters/{id}/open`；`deleteLetter` DELETE | 情书信箱 |
| 一问历史 | `questionHistory(days=30)` GET `/questions/history` | 双方都答过的一问存档 |
| 恋爱条约 | `createPact`/`pacts`/`acceptPact`/`deletePact` `/pacts` | 立约-签字生效 |
| 异地城市 | `setCity` PUT `/cities`（null 清空）；`cityCard` GET `/cities` | 双方城市/时差/距离卡 |
| 心愿基金 | `createFund`/`funds`/`depositFund`（单位分）/`deleteFund` `/funds` | 共同存钱目标 |
| 贴贴 | `sendAction` POST `/bond/actions`；`bondActions(limit)` GET；`bondStats` GET `/bond/stats`；`reactMood` POST `/bond/mood-reactions`；`moodReactions(day)` GET；`setPetName` PUT `/bond/pet-name` | 动作宫格/统计/心情回应/专属爱称 |
| 仪式升级 | `todayTask`/`recentTasks`/`doneTask` `/ritual/task(s)[/done]`；`tacitState`/`startTacit`/`answerTacit`/`tacitHistory` `/ritual/tacit*`；`drawLoveWord` `/ritual/love-word`；`fortune` `/ritual/fortune`；`goodnightStory` `/ritual/goodnight-story` | 甜蜜任务/默契考验/情话/运势/晚安故事 |
| 情绪关怀 | `weather` `/care/weather`；`firstAid` `/care/first-aid`；`sendReconcile`/`reconciles`/`acceptReconcile` `/care/reconciles*`；`postPraise`/`praises`/`receivePraise` `/care/praises*`；`cycleCard` GET / `saveCycle` PUT `/care/cycle` | 情绪天气/急救箱/和好卡/夸夸墙/生理期 |
| 纪念回忆 | `badges` `/memory/badges`；`onThisDay` `/memory/on-this-day`；`sealCapsule`/`capsules`/`openCapsule` `/memory/capsules*`；`addCountdown`/`countdowns`/`doneCountdown`/`deleteCountdown` `/memory/countdowns*` | 徽章墙/那年今天/时光胶囊/倒数日 |
| 共同生活 | `/life/expenses*` `addExpense`/`monthExpenses`/`deleteExpense`；`/life/chores*` `addChore`(SINGLE/ALTERNATE)/`chores`/`doneChore`/`deleteChore`；`/life/date-plans*` `addDatePlan`/`datePlans`/`doneDatePlan`/`deleteDatePlan`；`/life/habits*` `addHabit`/`habits`/`checkinHabit`/`toggleHabit`/`deleteHabit`；`/life/ciphers*` `addCipher`/`ciphers`/`deleteCipher` | 记账（分）/家务/约会计划/共同习惯/暗号小本本 |
| 个性化/月报 | `updateProfile` PUT `/profile`（slogan/theme/stickers）；`monthlyReport` `/memory/monthly-report?month`；`dataOverview` `/memory/data-overview` | 空间个性化 + 月报/数据总览 |
| 游戏化 | `boost`/`heatmap`/`moodCurve`/`trafficLight` `/game/*` | 今日心动加成/12 周热力/心情曲线/恋爱红绿灯 |
| 通知/关系/管理 | `notifyMine` `/notify`；`notifyReadAll` POST `/notify/read-all`；`relationshipOf` `/relationship-of/{username}`；`adminCoupleStats` `/admin/stats` | F41 通知中心 / F44 恋爱中徽章 / F45 管理统计 |
| 第一次/互评 | `listFirsts`/`addFirst`/`removeFirst` `/memory/firsts*`；`reactAnswer` POST `/answers/{day}/react`；`listAnswerReactions` GET | F46 第一次清单 / F48 一问互评表情 |
| 惊喜 F50-59 | `/surprise/scratches*` `scratches`/`scratchCard`/`redeemScratch`；`/surprise/boxes*` `boxes`/`createBox`/`openBox`；`/surprise/alarms*` `alarms`/`createAlarm`/`cancelAlarm`；`/surprise/misses` `missBoard`/`sendMiss`；`/surprise/confessions*` `confessions`/`createConfession`/`deleteConfession`；`/surprise/treasures*` `treasures`/`createTreasure`/`completeTreasure` | 刮刮乐/盲盒/心动闹钟/思念速递/告白重现/藏宝图 |
| 花园 F54-56 | `garden` GET / `waterGarden` POST `/garden[/water]`；`roseBoard`/`sendRose` `/garden/roses`；`slipBoard`/`drawSlip` `/garden/slips` | 浇水养成/每日玫瑰（限 3）/幸运签 |
| 懂我 F60-69 | `/care/comfort*` `comfortBoard`/`askComfort`/`comfortCards`/`handleComfort`；`chatTopics` `/care/chat-topics`；`moodSync` `/care/mood-sync`；`peaceReviews`/`savePeaceReview` `/makeup/reviews`；`sorryTickets`/`sendSorry`/`useSorry` `/makeup/sorry-tickets*`；`truthToday`/`answerTruth`/`truthHistory` `/talk/truth[/history]`；`whispers`/`askWhisper`/`answerWhisper` `/talk/whispers*`；`telepathyBoard`/`startTelepathy`/`answerTelepathy` `/talk/telepathy*`；`loveBank`/`depositLove` `/talk/love-bank` | 求抱抱/话题卡/同步率/矛盾复盘/道歉券/真心话/树洞/心灵感应/情话储蓄罐 |
| 养成 F70-79 | `challenge`/`checkChallenge` `/growth/challenge[/check]`；`passbook`/`depositPassbook` `/growth/passbook`；`hundreds`/`createHundred`/`checkinHundred`/`breakHundred` `/growth/hundreds*`；`zodiacPair` `/growth/zodiac`；`wishes`/`makeWish`/`acceptWish`/`fulfillWish` `/growth/wishes*`；`travels`/`addTravel`/`visitTravel` `/growth/travels*`；`nextTimes`/`addNextTime`/`nudgeNextTime`/`fulfillNextTime` `/growth/next-times*`；`readPlans`/`createReadPlan`/`reportReadProgress` `/growth/read-plans*`；`watchlist`/`addWatch`/`updateWatch` `/growth/watchlist*`；`dictWords`/`addWord`/`removeWord` `/growth/dict*` | 挑战赛/恋爱存折/百日之约/星座/心愿互换/旅行地图/下次一定/共读/追剧/恋爱词典 |
| 回忆资产 F80-89 | `chronicle` `/chronicle`；`archaeology` `/chronicle/archaeology`；`quiz` `/chronicle/quiz`；`anniversaryReport` `/chronicle/anniversary-report`；`birthdayLook` `/chronicle/birthday-look`；`quotes`/`saveQuote`/`removeQuote` `/keepsake/quotes*`；`tickets`/`saveTicket`/`removeTicket` `/keepsake/tickets*`；`songs`/`saveSong`/`removeSong` `/keepsake/songs*` | 编年史/考古卡/问答机/周年报告/生日回顾/语录册/票根墙/歌单 |
| 体验 F90-99 | `todayBoard` `/today`；`yearHeatmap(year)` `/today/heatmap?year` | F95 今日看点 / F96 年度热力日历 |
| 沟通 F100-109 | `translate` `/comm/translate`；`coolDowns`/`startCoolDown`/`softenCool` `/comm/cool-downs*`；`relays`/`tossRelay`/`catchRelay` `/comm/relays*`；`guesses`/`startGuess`/`clueGuess`/`doGuess` `/comm/guesses*`；`stories`/`startStory`/`addStoryLine`/`finishStory` `/comm/stories*`；`dictQuiz` `/comm/dict-quiz`；`synthSweet` `/comm/sweet-synth`；`apologies`/`sendApology`/`acceptApology` `/comm/apologies*`；`feelings`/`saveFeeling` `/comm/feelings`；`goodnightRadio` `/comm/goodnight-radio` | 翻译器/冷静角/情绪接力/比划猜/故事接龙/词典小考/情话合成/道歉三部曲/情绪词汇/晚安电台 |
| 异地 F110-119 | `handhold`/`holdHand` `/distance/handhold`；`miss`/`lightMiss` `/distance/miss`；`routine`/`saveRoutine` `/distance/routine`；`reunionLetters`/`writeLetter`/`openReunionLetter` `/distance/letters*`；`cloudDates`/`addCloudDate`/`doneCloudDate` `/distance/cloud-dates*`；`safeties`/`pingSafety`(GO_OUT/ARRIVE) `/distance/safeties*`；`reunions`/`logReunion` `/distance/reunions*`；`energy` `/distance/energy`；`distanceReport` `/distance/report` | 隔空牵手/想念计量/作息表/见面信/云约会/平安卡/见面日记/能量瓶/异地报告 |
| 确定感 F120-129 | `security`/`depositSecurity`/`acceptSecurity` `/secure/security*`；`checkup` `/secure/checkup`；`decade`/`saveDecade` `/secure/decade`；`visions`/`addVision` `/secure/visions`；`oaths`/`makeOath`/`stampOath` `/secure/oaths*`；`trust`/`depositTrust` `/secure/trust`；`rings` `/secure/rings`；`contracts`/`makeContract`/`checkContract` `/secure/contracts*`；`pet`/`adoptPet`/`carePet` `/secure/pet[/care]` | 安全感账户/恋爱体检/十年之约/愿景板/承诺博物馆/信任存折/年轮/双人契约/守护兽 |
| 游戏 F130-139 | `survey`/`answerSurvey` `/play/survey`；`quizzes`/`makeQuiz`/`answerQuiz`/`judgeQuiz` `/play/quizzes*`；`heartbeat` `/play/heartbeat`；`tarot` `/play/tarot`；`loveWeather` `/play/weather`；`loveLesson` `/play/love-lesson`；`collectLoveWord` `/play/love-words`；`blindPick`/`submitBlindPick` `/play/blind`；`battle`/`joinBattle`/`voteBattle` `/play/battle[/vote]`；`arts`/`createArt` `/play/arts` | 一百问/出题考 TA/心动概率/塔罗/恋爱天气/情话课/周末盲选/情话 Battle/抽象画（seed） |
| 陪伴 F140-149 | `themeSong` `/daily-life/theme-song`；`dreams`/`writeDream` `/daily-life/dreams`；`foods`/`addFood`/`checkinFood` `/daily-life/foods*`；`facts`/`addFact` `/daily-life/facts`；`soses`/`pingSos`/`holdSos` `/daily-life/soses*`；`dailyThree`/`saveDailyThree` `/daily-life/three`；`dailyPraise` `/daily-life/praise`；`customBadges`/`addBadge`/`issueBadge` `/daily-life/badges*`；`dashboard` `/daily-life/dashboard` | 今日主题曲/梦境手账/美食地图/使用手册/情绪 SOS/每日三问/夸夸+暗号/自定义成就/恋爱仪表盘 |
| 成长 F150-159 | `coachHabits`/`coachCreateHabit`/`coachCheckinHabit` `/coach/habits*`；`thanks`/`addThanks` `/coach/thanks`；`feelFamilies` `/coach/feel-families`；`feelToday`/`saveFeel` `/coach/feel`；`weekStar`/`saveWeekStar` `/coach/week-star`；`readMinute`/`saveReadMinute` `/coach/read-minute`；`delays`/`addDelay`/`nagDelay`/`doneDelay` `/coach/delays*`；`morning` `/coach/morning`；`praiseBank`/`addPraiseBank` `/coach/praise-bank`；`yearKeyword(year)` `/coach/year-keyword` | 习惯搭子/感恩便签/情绪词表/本周高光/共读一分钟/拖延互助/早安能量站/优点存折/年度关键词（前缀 coach 防撞名） |
| 文字浪漫 F160-169 | `poemChain`/`addPoemLine` `/poem/chain`；`poems3`/`addPoem3`/`likePoem3` `/poem/3lines*`；`morningNotes`/`sealMorningNote`/`readMorningNote` `/poem/morning-notes*`；`bottles`/`tossBottle`/`replyBottle` `/poem/bottles*`；`cipherNotes`/`makeCipherNote`/`crackCipherNote` `/poem/ciphers*`；`soul`/`answerSoul` `/poem/soul`；`journal`/`saveJournal` `/poem/journal`；`quote` `/poem/quote`；`letterTemplates` `/poem/letter-templates`；`stickers` `/poem/stickers` | 情诗接龙/三行情书/醒来第一条/漂流瓶/密码情书/灵魂一问/贴纸手账/语录机/情书模板/贴纸库 |
| 默契亲密 F170-179 | `sparkQuiz` `/spark/love-lang/quiz`；`submitLoveLang`/`myLoveLang` `/spark/love-lang[/mine]`；`loveLangPair` `/spark/love-lang/pair`；`flashes`/`addFlash` `/spark/flashes`；`whatIf`/`answerWhatIf` `/spark/what-if`；`signals`/`addSignal` `/spark/signals`；`tap`/`tapToday` `/spark/tap[/today]`；`sparkDashboard` `/spark/dashboard`；`heartDays`/`markHeartDay` `/spark/heart-days`；`syncRank` `/spark/sync-rank`；`sparkWeekly` `/spark/weekly` | 爱语测评/对照卡/心动闪光/如果问答/动作暗语/同频按键/仪表盘/心动日历/排行榜/默契周报 |

## manageApi（基址 `/api/couple/manage`，前缀类型 `CoupleManage*VO`）

| 方法 | 路径 | 一句话 |
|---|---|---|
| `meetings`/`createMeeting`/`decideMeeting`/`closeMeeting` | `/meetings*` | F180 家庭会议：议题-结论-关闭 |
| `host`/`saveHostPlan` | `/host[/plan]` | F181 本周主理人轮换 + 小计划 |
| `skills`/`createSkill`/`takeSkill`/`doneSkill` | `/skills*` | F182 技能交换所（教 X 换学 Y） |
| `monthReviews`/`saveMonthReview` | `/month-reviews` | F183 月度互评（stars 1-5 + 建议） |
| `emergencyCards`/`saveEmergencyCard` | `/emergency-card(s)` | F184 家庭应急卡（联系人/钥匙/药品） |
| `snapshots`/`saveSnapshot` | `/snapshots` | F185 情侣存档点（loveTemp 0-100） |
| `points`/`earnPoints`/`redeemPoints` | `/points[/earn|/redeem]` | F186 家务积分账户/流水/兑换 |
| `fiveYearPlans`/`createFiveYearPlan`/`claimFiveYearPlan`/`finishFiveYearPlan` | `/five-year-plans*` | F187 五年计划双轨（MINE/OURS） |
| `annivPlans`/`createAnnivPlan`/`advanceAnnivPlan` | `/anniv-plans*` | F188 纪念日策划案（IDEA→LOCKED→DONE） |
| `weekly` | `/weekly` | F189 经营周报 |

## museumApi（基址 `/api/couple/museum`，写接口返回最新全量列表）

| 方法 | 路径 | 一句话 |
|---|---|---|
| `listScenes`/`createScene` | `/scenes` | F190 三幕恋爱纪录片 |
| `listExhibits`/`createExhibit` | `/exhibits` | F191 博物馆展品（捐物件+故事） |
| `getLastYear` | `/last-year` | F192 去年今日对比镜 |
| `getSilverLine` | `/silver-line` | F193 银发情话机今日一句 |
| `getWords` | `/words` | F194 恋爱高频词 |
| `getAchievements` | `/achievements` | F195 隐藏成就墙（GET 即解锁） |
| `getRules`/`createRule`/`signRule` | `/rules*` | F196 家规宪法（条款/修正案/签字） |
| `getDnd`/`saveDnd` | `/dnd` | F197 免打扰时段（HH:mm，couple store 用它静音） |
| `getAnnualBook` | `/annual-book` | F199 年度记忆书 |
| `getGreeting` | `/greeting` | F197 今日问候条（叠加免打扰状态） |

## 与后端对应关系

- 前端 URL 与后端 `/api/couple/*` Controller 路由一一对应；dev server 将 `/api` 代理到 8080（见 [架构总览](architecture.md)）。
- 响应统一 `{code,message,data}`，`data` 即各方法泛型 VO（类型全在 `src/types/index.ts` 情侣空间区块，命名 `Couple*VO`，新类型必须带 Couple 域前缀防撞名——撞名备忘见 map skill 第三节）。
- 后端模块地图见 are-chat 仓库 `are-chat-map` skill；WS 推送由后端 `ImPushService.pushCoupleEvent(Both)` 发出（见 [WS 事件链路](ws-events.md)）。
- **改 types 里任何 VO 字段必须同步 `tests/unit/couple.spec.ts` 的 mock 工厂**，否则 `pnpm build` 的 vue-tsc 检查失败（详见 [测试](testing.md)）。

---

上一页：[状态管理](state-management.md) ｜ 下一页：[WS 事件链路](ws-events.md)

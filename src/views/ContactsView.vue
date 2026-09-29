<template>
  <div class="contacts-page">
    <el-card shadow="never" class="panel">
      <template #header>
        <div class="head">
          <span class="head-title">
            通讯录（{{ im.friends.length }}）
            <el-badge v-if="im.incoming.length" :value="im.incoming.length" class="head-badge" />
          </span>
          <div class="head-actions">
            <el-input
              v-model="keyword"
              class="search"
              placeholder="搜索联系人"
              clearable
              data-testid="contacts-search"
              :prefix-icon="Search"
            />
            <el-button type="primary" size="small" data-testid="add-friend-open" @click="dialogVisible = true">
              <el-icon class="btn-ico"><Plus /></el-icon>添加好友
            </el-button>
          </div>
        </div>
      </template>

      <!-- F42 好友生日提醒：今天/7 天内过生日的好友 -->
      <div v-if="birthdayFriends.length" class="birthday-banner" data-testid="contacts-birthday-banner">
        <span class="birthday-text">🎂 {{ birthdayText }}</span>
        <el-button
          v-for="b in birthdayFriends.slice(0, 2)"
          :key="b.username"
          size="small"
          round
          type="primary"
          plain
          :data-testid="`contacts-birthday-go-${b.username}`"
          @click="goChat(b.username)"
        >
          去{{ b.today ? '送祝福' : '提前准备' }} →
        </el-button>
      </div>

      <!-- 收到的申请 -->
      <section v-if="im.incoming.length" class="section">
        <h4 class="section-title">收到的申请</h4>
        <div v-for="req in im.incoming" :key="req.id" class="request-item" data-testid="incoming-request">
          <ImAvatar :name="req.fromUser" :size="36" />
          <div class="request-main">
            <span class="request-name">{{ req.fromUser }}</span>
            <span v-if="req.message" class="request-note" data-testid="request-note">“{{ req.message }}”</span>
            <span class="request-time">{{ formatChatTime(req.created) }}</span>
          </div>
          <el-button
            type="success"
            size="small"
            :loading="processingId === req.id"
            :disabled="!!processingId && processingId !== req.id"
            data-testid="accept-btn"
            @click="onAccept(req.id)"
          >
            同意
          </el-button>
          <el-button
            size="small"
            :disabled="!!processingId"
            data-testid="reject-btn"
            @click="onReject(req.id)"
          >
            拒绝
          </el-button>
        </div>
      </section>

      <!-- 发出的申请 -->
      <section v-if="pendingOutgoing.length" class="section">
        <h4 class="section-title">等待对方同意</h4>
        <div v-for="req in pendingOutgoing" :key="req.id" class="request-item pending">
          <ImAvatar :name="req.toUser" :size="36" />
          <div class="request-main">
            <span class="request-name">{{ req.toUser }}</span>
            <span class="request-time">{{ formatChatTime(req.created) }}</span>
          </div>
          <el-tag type="info" effect="plain" size="small">待处理</el-tag>
        </div>
      </section>

      <div v-if="im.friends.length === 0" class="empty" data-testid="contacts-empty">
        <el-empty description="暂无联系人，点击右上角「添加好友」发起申请" />
      </div>

      <template v-for="group in groups" :key="group.letter">
        <div class="letter" data-testid="contacts-letter">{{ group.letter }}</div>
        <div
          v-for="friend in group.items"
          :key="friend.id"
          class="contact-item"
          data-testid="contact-item"
        >
          <ImAvatar
            :name="friend.username"
            :label="displayName(friend)"
            :online="friend.online"
            :size="42"
            :status="friend.status"
            halo
          />
          <div class="contact-main">
            <div class="contact-name">
              {{ displayName(friend) }}
              <span v-if="friend.remark" class="contact-origin">{{ friend.username }}</span>
              <el-tag v-if="friend.tag" size="small" effect="plain" data-testid="friend-tag">{{ friend.tag }}</el-tag>
              <el-tag v-if="friend.pinned" size="small" type="warning" effect="plain">置顶</el-tag>
              <el-tag v-if="friend.muted" size="small" type="info" effect="plain">免打扰</el-tag>
            </div>
            <div v-if="friend.online" class="contact-status online" data-testid="contact-online">
              {{ presenceLabel(friend) }}
            </div>
            <div v-else class="contact-status">
              {{ formatLastSeen(friend.lastSeenAt, false) }}
            </div>
          </div>
          <div class="contact-actions">
            <el-button
              type="primary"
              size="small"
              plain
              :data-testid="`contact-chat-${friend.username}`"
              @click="goChat(friend.username)"
            >
              发消息
            </el-button>
            <el-dropdown trigger="click" @command="(cmd: string) => onCommand(cmd, friend)">
              <el-button size="small" class="more-btn" :data-testid="`contact-more-${friend.username}`">
                <el-icon><MoreFilled /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">
                    <el-icon><User /></el-icon>资料卡
                  </el-dropdown-item>
                  <el-dropdown-item command="remark" data-testid="contact-remark-item">
                    <el-icon><EditPen /></el-icon>设置备注
                  </el-dropdown-item>
                  <el-dropdown-item command="tag">
                    <el-icon><Collection /></el-icon>{{ friend.tag ? '修改分组' : '设置分组' }}
                  </el-dropdown-item>
                  <el-dropdown-item command="mute">
                    <el-icon><MuteNotification v-if="!friend.muted" /><Bell v-else /></el-icon>
                    {{ friend.muted ? '关闭免打扰' : '免打扰' }}
                  </el-dropdown-item>
                  <el-dropdown-item command="pin">{{ friend.pinned ? '取消置顶' : '置顶会话' }}</el-dropdown-item>
                  <el-dropdown-item command="delete" divided data-testid="contact-delete-item">
                    <el-icon><Delete /></el-icon>删除好友
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </template>
    </el-card>

    <!-- 添加好友对话框 -->
    <el-dialog v-model="dialogVisible" title="添加好友" width="400px" draggable>
      <!-- 输入即联想：候选来自 /api/friends/suggest，带好友关系标注 -->
      <el-autocomplete
        v-model="applyName"
        class="apply-input"
        :fetch-suggestions="fetchSuggestions"
        :trigger-on-focus="true"
        :debounce="200"
        clearable
        placeholder="输入用户名，如 alice"
        data-testid="add-friend-input"
        @select="onPickSuggestion"
        @keyup.enter="onApply"
      >
        <template #default="{ item }">
          <div class="suggest-row" :data-testid="`suggest-${item.username}`">
            <ImAvatar :name="item.username" :size="26" />
            <span class="suggest-name">{{ item.username }}</span>
            <span v-if="item.phone" class="suggest-phone">{{ item.phone }}</span>
            <span class="suggest-tag" :class="item.relation">{{ relationLabel(item.relation) }}</span>
          </div>
        </template>
      </el-autocomplete>
      <!-- 候选账号一键填充（输入为空时的快捷入口） -->
      <div v-if="!applyName && suggestAccounts.length > 0" class="account-row" data-testid="account-suggestions">
        <span class="account-label">可添加：</span>
        <button
          v-for="name in suggestAccounts"
          :key="name"
          type="button"
          class="account-chip"
          :data-testid="`account-chip-${name}`"
          @click="applyName = name"
        >
          {{ name }}
        </button>
      </div>
      <el-input
        v-model="applyNote"
        type="textarea"
        :rows="2"
        maxlength="100"
        placeholder="附言（选填，最多 100 字）"
        class="apply-note"
        data-testid="add-friend-note"
      />
      <p class="apply-tip">对方同意后即可开始聊天</p>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" data-testid="add-friend-btn" @click="onApply">发送申请</el-button>
      </template>
    </el-dialog>

    <!-- 资料卡 -->
    <el-dialog v-model="profileVisible" title="资料卡" width="360px" draggable>
      <div v-loading="profileLoading" class="profile-card" data-testid="profile-card">
        <template v-if="viewingProfile">
          <ImAvatar :name="viewingProfile.username" :color="viewingProfile.avatar" :size="72" />
          <div class="card-name">{{ viewingRemark || viewingProfile.nickname }}</div>
          <div v-if="viewingRemark" class="card-nickname">昵称：{{ viewingProfile.nickname }}</div>
          <div class="card-username">@{{ viewingProfile.username }}</div>
          <div class="card-signature">{{ viewingProfile.signature || '暂无签名' }}</div>
          <!-- F44 恋爱中徽章 -->
          <div v-if="relationshipBadge" class="card-relationship" data-testid="profile-relationship">
            💗 恋爱中 · 已在一起 {{ relationshipBadge }} 天
          </div>
          <!-- F42 对方生日 -->
          <div v-if="viewingProfile.birthday" class="card-birthday" data-testid="profile-birthday">
            🎂 生日：{{ viewingProfile.birthday }}
          </div>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Bell,
  Collection,
  Delete,
  EditPen,
  MoreFilled,
  MuteNotification,
  Plus,
  Search,
  User,
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { useImStore } from '@/stores/im'
import { coupleApi } from '@/api/couple'
import { friendApi, profileApi } from '@/api/im'
import { formatChatTime, formatLastSeen } from '@/utils/imFormat'
import ImAvatar from '@/components/im/ImAvatar.vue'
import type { FriendBirthdayVO, FriendRelation, FriendSuggestion, FriendVO, UserProfileVO } from '@/types'

const auth = useAuthStore()
const im = useImStore()
const router = useRouter()

const keyword = ref('')

// ---------- 添加好友 ----------

const dialogVisible = ref(false)
const applyName = ref('')
const applyNote = ref('')
/** 正在处理的申请 id：请求期间禁用按钮，避免连点导致 409 */
const processingId = ref('')
const profileVisible = ref(false)
/** 资料卡：当前查看对象的备注（来自好友表，用于主名展示） */
const viewingRemark = ref('')
const profileLoading = ref(false)
const viewingProfile = ref<UserProfileVO | null>(null)
/** F44 恋爱中徽章：在一起天数（非恋爱对象为 null） */
const relationshipBadge = ref<number | null>(null)

const pendingOutgoing = computed(() => im.outgoing.filter((r) => r.status === 'PENDING'))

/** 兜底账号（后端不可用时提示用）；正常情况下来自 /api/friends/suggest 的真实注册用户 */
const FALLBACK_ACCOUNTS = ['alice', 'bob', 'carol']
const suggestAccounts = computed(() => {
  const fromServer = lastSuggestions.value
    .filter((s) => s.relation === 'available')
    .map((s) => s.username)
  const names = fromServer.length > 0 ? fromServer : FALLBACK_ACCOUNTS
  return names
    .filter(
      (name) =>
        name !== auth.username &&
        !im.friends.some((f) => f.username === name) &&
        !pendingOutgoing.value.some((r) => r.toUser === name),
    )
    .slice(0, 3)
})

// ---------- 输入联想：候选用户名 + 与我的关系 ----------

interface SuggestionItem {
  value: string
  username: string
  phone: string
  relation: FriendRelation
}

/** 最近一次候选结果：用于提交前的快速判断（已是好友/已申请就不用白跑一趟请求） */
const lastSuggestions = ref<FriendSuggestion[]>([])

const RELATION_TEXT: Record<FriendRelation, string> = {
  available: '可添加',
  friend: '已是好友',
  'pending-out': '已申请',
  'pending-in': '待你处理',
}

function relationLabel(relation: FriendRelation): string {
  return RELATION_TEXT[relation] ?? ''
}

/** el-autocomplete 的候选抓取：优先走后端，后端不可用时退回本地体验账号表 */
async function fetchSuggestions(query: string, cb: (items: SuggestionItem[]) => void) {
  const kw = query.trim()
  const toItems = (list: FriendSuggestion[]): SuggestionItem[] =>
    list
      .filter((s) => s.username !== auth.username)
      .map((s) => ({ value: s.username, username: s.username, phone: s.phone ?? '', relation: s.relation }))
  try {
    const list = await friendApi.suggest(kw)
    lastSuggestions.value = list
    cb(toItems(list))
  } catch {
    const fallback: FriendSuggestion[] = FALLBACK_ACCOUNTS.filter(
      (name) => name.includes(kw.toLowerCase()) && name !== auth.username,
    ).map((name) => ({ username: name, phone: '', relation: 'available' as FriendRelation }))
    lastSuggestions.value = fallback
    cb(toItems(fallback))
  }
}

function onPickSuggestion(item: Record<string, any>) {
  applyName.value = String(item.username ?? item.value ?? '')
}

async function onApply() {
  const name = applyName.value.trim()
  if (!name) {
    ElMessage.warning('请输入对方用户名')
    return
  }
  // 已经能确定关系时直接提示，不再白发一次请求
  const known = lastSuggestions.value.find((s) => s.username === name.toLowerCase())
  if (known && known.relation !== 'available') {
    ElMessage.warning(`「${known.username}」${relationLabel(known.relation)}，换个账号试试`)
    return
  }
  try {
    // 62 好友申请可附言
    await im.applyFriend(name, applyNote.value.trim() || undefined)
    ElMessage.success(`已向 ${name} 发送好友申请`)
    applyName.value = ''
    applyNote.value = ''
    dialogVisible.value = false
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '申请失败')
  }
}

// ---------- 申请处理 ----------

async function onAccept(id: string) {
  if (processingId.value) {
    return
  }
  processingId.value = id
  try {
    await im.acceptRequest(id)
    ElMessage.success('已成为好友')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '操作失败')
  } finally {
    processingId.value = ''
  }
}

async function onReject(id: string) {
  if (processingId.value) {
    return
  }
  processingId.value = id
  try {
    await im.rejectRequest(id)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '操作失败')
  } finally {
    processingId.value = ''
  }
}

// ---------- 联系人列表 ----------

/** 展示名：备注 > 昵称 > 用户名 */
function displayName(friend: FriendVO) {
  return friend.remark || friend.nickname || friend.username
}

function presenceLabel(friend: FriendVO) {
  if (friend.status === 'busy') return '忙碌'
  if (friend.status === 'away') return '离开'
  return '在线'
}

// ---------- F42 好友生日提醒 ----------

const birthdays = ref<FriendBirthdayVO[]>([])
/** 今天 + 未来 7 天过生日的好友 */
const birthdayFriends = computed(() => birthdays.value.filter((b) => b.daysUntil <= 7))
const birthdayText = computed(() => {
  const today = birthdayFriends.value.filter((b) => b.today)
  const soon = birthdayFriends.value.filter((b) => !b.today)
  if (today.length) {
    return `今天是 ${today.map((b) => b.nickname).join('、')} 的生日，快去送祝福吧！`
  }
  return `${soon.map((b) => b.nickname).join('、')} 的生日要到了（${soon[0]?.daysUntil ?? 7} 天后）`
})

/** 97 A–Z 分组 + # 兜底（恒在最后），组内按中文拼音排序 */
const groups = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  const matched = im.friends.filter(
    (f) => !q || displayName(f).toLowerCase().includes(q) || f.username.toLowerCase().includes(q),
  )
  const collator = new Intl.Collator('zh-Hans-CN-u-co-pinyin', { numeric: true })
  const sorted = [...matched].sort((a, b) => collator.compare(displayName(a), displayName(b)))
  const map = new Map<string, FriendVO[]>()
  for (const friend of sorted) {
    const first = displayName(friend).charAt(0).toUpperCase()
    const letter = /[A-Z]/.test(first) ? first : '#'
    const bucket = map.get(letter)
    if (bucket) bucket.push(friend)
    else map.set(letter, [friend])
  }
  const keys = [...map.keys()].sort((a, b) => {
    // # 组固定排在字母组之后
    if (a === '#') return 1
    if (b === '#') return -1
    return a.localeCompare(b)
  })
  return keys.map((letter) => ({ letter, items: map.get(letter)! }))
})

function goChat(username: string) {
  void router.push({ path: '/chat', query: { peer: username } })
}

// ---------- 联系人管理操作（原「好友」页迁移） ----------

async function onCommand(command: string, friend: FriendVO) {
  if (command === 'profile') {
    profileVisible.value = true
    profileLoading.value = true
    viewingProfile.value = null
    relationshipBadge.value = null
    // 资料卡主名显示我给 TA 的备注（无备注回落对方昵称）
    viewingRemark.value = friend.remark?.trim() ?? ''
    try {
      viewingProfile.value = await profileApi.of(friend.username)
      // F44 恋爱中徽章（仅好友可查，失败静默）
      relationshipBadge.value = await coupleApi
        .relationshipOf(friend.username)
        .then((vo) => (vo.inRelationship ? vo.days : null))
        .catch(() => null)
    } catch (e) {
      ElMessage.error(e instanceof Error ? e.message : '资料卡加载失败')
      profileVisible.value = false
    } finally {
      profileLoading.value = false
    }
    return
  }
  if (command === 'remark') {
    try {
      const { value } = await ElMessageBox.prompt('设置备注名', '备注', {
        inputValue: friend.remark,
        inputPattern: /^.{0,32}$/,
        inputErrorMessage: '最长 32 个字',
      })
      await im.updateFriend(friend.id, { remark: value?.trim() ?? '' })
      ElMessage.success('备注已保存，全站名称已同步更新')
    } catch {
      // 用户取消
    }
    return
  }
  if (command === 'tag') {
    // 44 分组标签：0-16 字，留空清除
    try {
      const { value } = await ElMessageBox.prompt('设置分组标签（留空清除）', '分组', {
        inputValue: friend.tag,
        inputPattern: /^.{0,16}$/,
        inputErrorMessage: '分组最长 16 个字',
      })
      await im.updateFriend(friend.id, { tag: value?.trim() ?? '' })
      ElMessage.success(value?.trim() ? `已加入「${value.trim()}」分组` : '已清除分组')
    } catch {
      // 用户取消
    }
    return
  }
  if (command === 'mute') {
    try {
      await im.updateFriend(friend.id, { muted: !friend.muted })
      ElMessage.success(friend.muted ? '已关闭免打扰' : '已开启免打扰')
    } catch (e) {
      ElMessage.error(e instanceof Error ? e.message : '操作失败')
    }
    return
  }
  if (command === 'pin') {
    await im.updateFriend(friend.id, { pinned: !friend.pinned })
    return
  }
  if (command === 'delete') {
    try {
      await ElMessageBox.confirm(`删除好友 ${displayName(friend)}？聊天记录仍在，但会话将消失。`, '删除好友', {
        type: 'warning',
      })
      await im.removeFriend(friend.id)
      ElMessage.success('已删除')
    } catch {
      // 用户取消
    }
  }
}

onMounted(() => {
  void im.init(auth.username)
  // F42 好友生日提醒（失败静默，不打扰主流程）
  void profileApi
    .friendsBirthdays()
    .then((list) => {
      birthdays.value = list ?? []
    })
    .catch(() => {})
})
</script>

<style scoped>
.contacts-page {
  padding: 16px 20px 24px;
  max-width: 860px;
  margin: 0 auto;
}
@media (max-width: 768px) {
  .contacts-page {
    padding: 12px 12px 20px;
  }
  .head {
    flex-wrap: wrap;
  }
  .search {
    width: 100%;
  }
}
.panel {
  border-radius: 12px;
}
.head {
  display: flex;
  align-items: center;
  gap: 12px;
}
.head-title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 15px;
}
.head-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
}
.search {
  width: 200px;
}
.btn-ico {
  margin-right: 4px;
}
.section {
  margin-bottom: 18px;
}
.section-title {
  font-size: 13px;
  color: var(--im-muted, #8f959e);
  margin: 0 0 8px;
  font-weight: 500;
}
.request-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 8px;
  border-radius: 10px;
  transition: background 0.12s ease;
}
.request-item:hover {
  background: var(--im-hover, #f2f3f5);
}
.request-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.request-name {
  font-size: 14px;
  font-weight: 500;
}
.request-note {
  font-size: 12px;
  color: var(--im-text-2, #51565f);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 280px;
}
.request-time {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.empty {
  padding: 24px 0;
}
.letter {
  font-size: 12px;
  font-weight: 700;
  color: var(--el-text-color-secondary);
  padding: 10px 4px 4px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}
.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 4px;
  border-bottom: 1px dashed var(--el-border-color-lighter);
  transition: background 0.12s ease;
}
.contact-item:hover {
  background: var(--im-hover, #f7f8fa);
}
.contact-item:last-child {
  border-bottom: none;
}
.contact-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.contact-name {
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: baseline;
  gap: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.contact-origin {
  font-size: 12px;
  font-weight: 400;
  color: var(--el-text-color-secondary);
}
.contact-status {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
.contact-status.online {
  color: var(--el-color-success);
}
.contact-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}
.more-btn {
  padding: 5px 8px;
}
.apply-tip {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
  margin: 8px 0 0;
}
.apply-note {
  margin-top: 10px;
}
/* 体验账号一键填充 */
.account-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
}
/* 联想候选行 */
.suggest-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 0;
}
.suggest-name {
  flex: 1;
  font-size: 13px;
  color: var(--im-text, #1f2329);
}
.suggest-phone {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
  font-variant-numeric: tabular-nums;
}
.suggest-tag {
  font-size: 11px;
  padding: 1px 7px;
  border-radius: 999px;
  border: 1px solid transparent;
}
.suggest-tag.available {
  color: #2a9d59;
  background: rgba(63, 191, 98, 0.12);
}
.suggest-tag.friend {
  color: var(--im-muted, #8f959e);
  background: var(--im-hover, #f2f3f5);
}
.suggest-tag.pending-out,
.suggest-tag.pending-in {
  color: #c07c1d;
  background: rgba(230, 162, 60, 0.14);
}
.apply-input {
  width: 100%;
}
.account-label {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.account-chip {
  border: 1px solid var(--im-border, #e6e8eb);
  background: var(--im-panel, #fff);
  color: var(--im-text-2, #51565f);
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.14s ease;
}
.account-chip:hover {
  border-color: var(--xx-accent, #ec5f92);
  color: var(--xx-accent, #ec5f92);
}
.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 0 4px;
  min-height: 170px;
}
.card-name {
  font-size: 18px;
  font-weight: 600;
}
.card-nickname {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
  margin-top: -4px;
}
.card-username {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.card-signature {
  font-size: 13px;
  color: var(--im-text-2, #51565f);
  text-align: center;
}
/* F44 恋爱中徽章 */
.card-relationship {
  margin-top: 8px;
  padding: 5px 14px;
  border-radius: 999px;
  background: linear-gradient(90deg, #ffe3ec, #fff0f0);
  color: #c45656;
  font-size: 12px;
  font-weight: 600;
}
/* F42 生日 */
.card-birthday {
  margin-top: 6px;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
/* F42 生日提醒横幅 */
.birthday-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding: 10px 14px;
  border-radius: 10px;
  background: linear-gradient(90deg, #fff8e6, #fff0f0);
  border: 1px solid #f8d3a3;
  margin-bottom: 14px;
}
.birthday-text {
  font-size: 13px;
  font-weight: 600;
  color: #c45656;
}
</style>

<template>
  <div class="couple-setup" data-testid="couple-setup">
    <!-- 收到的邀请（可能同时被多人邀请）：放在最前，优先处理 -->
    <el-card v-if="couple.incomingInvites.length" shadow="never" class="panel invite-card">
      <template #header>
        <span class="head-title">💌 你收到了 {{ couple.incomingInvites.length }} 份情侣邀请</span>
      </template>
      <div
        v-for="invite in couple.incomingInvites"
        :key="invite.id"
        class="invite-row"
        data-testid="couple-incoming"
      >
        <ImAvatar :name="invite.fromUser" :size="46" />
        <div class="invite-main">
          <span class="invite-name" data-testid="couple-incoming-from">{{ invite.fromUser }}</span>
          <span v-if="invite.message" class="invite-note">“{{ invite.message }}”</span>
          <span class="invite-time">{{ formatChatTime(invite.created) }}</span>
        </div>
        <div class="invite-actions">
          <el-button
            type="success"
            :loading="processingId === invite.id"
            :disabled="!!processingId && processingId !== invite.id"
            data-testid="couple-accept"
            @click="onAccept(invite)"
          >
            同意，开启 💕
          </el-button>
          <el-button :disabled="!!processingId" data-testid="couple-reject" @click="onReject(invite)">婉拒</el-button>
        </div>
      </div>
    </el-card>

    <!-- 引导：三步建立情侣空间 -->
    <el-card shadow="never" class="panel">
      <template #header>
        <span class="head-title">💕 情侣空间</span>
      </template>
      <el-steps :active="couple.outgoingInvites.length ? 2 : 0" align-center class="steps">
        <el-step title="选择一个好友" description="从通讯录挑一位 TA" />
        <el-step title="发起建立邀请" description="附上一句真心话" />
        <el-step title="对方同意开启" description="共同的小家就建好啦" />
      </el-steps>
      <div class="guide-actions">
        <el-button type="primary" data-testid="couple-invite-open" @click="dialogVisible = true">
          <el-icon class="btn-ico"><MagicStick /></el-icon>邀请好友建立情侣空间
        </el-button>
      </div>
      <div class="feature-intro">
        <div class="feature-item">
          <span class="feature-emoji">🤝</span>
          <div><b>双向待办 / 约定</b><p>口头承诺变成可追踪的甜蜜记录，兑现打卡、逾期可爱提醒</p></div>
        </div>
        <div class="feature-item">
          <span class="feature-emoji">🌅</span>
          <div><b>每日小仪式</b><p>互道早晚安解锁专属背景贴纸，每天一问拼出两个人的答案</p></div>
        </div>
        <div class="feature-item">
          <span class="feature-emoji">🗓️</span>
          <div><b>共享空间</b><p>想看的电影、想吃的餐厅、纪念日约会日，双方一起维护</p></div>
        </div>
      </div>
    </el-card>

    <!-- 发出的邀请：等待对方处理 -->
    <el-card v-if="couple.outgoingInvites.length" shadow="never" class="panel">
      <template #header>
        <span class="head-title">⏳ 等待对方同意（{{ couple.outgoingInvites.length }}）</span>
      </template>
      <div
        v-for="invite in couple.outgoingInvites"
        :key="invite.id"
        class="invite-row pending"
        data-testid="couple-outgoing"
      >
        <ImAvatar :name="invite.toUser" :size="46" />
        <div class="invite-main">
          <span class="invite-name">{{ invite.toUser }}</span>
          <span class="invite-time">发出于 {{ formatChatTime(invite.created) }}</span>
        </div>
        <el-button
          link
          type="danger"
          :loading="processingId === invite.id"
          data-testid="couple-cancel"
          @click="onCancel(invite)"
        >
          撤回邀请
        </el-button>
      </div>
    </el-card>

    <!-- 发起邀请对话框：从好友列表选择 -->
    <el-dialog v-model="dialogVisible" title="邀请好友建立情侣空间" width="400px" data-testid="couple-invite-dialog">
      <el-select
        v-model="targetName"
        class="invite-select"
        placeholder="选择一位好友"
        filterable
        data-testid="couple-invite-select"
      >
        <el-option
          v-for="friend in candidates"
          :key="friend.username"
          :label="displayName(friend)"
          :value="friend.username"
        >
          <div class="option-row">
            <ImAvatar :name="friend.username" :size="24" />
            <span class="option-name">{{ displayName(friend) }}</span>
            <span class="option-username">@{{ friend.username }}</span>
          </div>
        </el-option>
      </el-select>
      <p v-if="candidates.length === 0" class="invite-tip">还没有好友，先去「通讯录」添加好友吧</p>
      <el-input
        v-model="inviteNote"
        type="textarea"
        :rows="2"
        maxlength="100"
        placeholder="附上一句真心话（选填，最多 100 字）"
        class="invite-note-input"
        data-testid="couple-invite-note"
      />
      <p class="invite-tip">对方同意后情侣空间开启，双方都能看到其中的内容</p>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="inviting" data-testid="couple-invite-btn" @click="onInvite">
          发送邀请 💕
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { MagicStick } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useImStore } from '@/stores/im'
import { useCoupleStore } from '@/stores/couple'
import { formatChatTime } from '@/utils/imFormat'
import ImAvatar from '@/components/im/ImAvatar.vue'
import type { CoupleInviteVO, FriendVO } from '@/types'

const im = useImStore()
const couple = useCoupleStore()

const dialogVisible = ref(false)
const targetName = ref('')
const inviteNote = ref('')
const inviting = ref(false)
const processingId = ref('')

/** 候选：全部好友（排除已挂起的邀请对象由后端校验兜底） */
const candidates = computed(() => im.friends)

function displayName(friend: FriendVO) {
  return friend.remark || friend.nickname || friend.username
}

async function onInvite() {
  if (!targetName.value) {
    ElMessage.warning('先选择一位好友')
    return
  }
  inviting.value = true
  try {
    await couple.invite(targetName.value, inviteNote.value.trim() || undefined)
    ElMessage.success(`已向 ${targetName.value} 发出情侣空间邀请 💕`)
    targetName.value = ''
    inviteNote.value = ''
    dialogVisible.value = false
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '邀请失败')
  } finally {
    inviting.value = false
  }
}

async function onAccept(invite: CoupleInviteVO) {
  if (processingId.value) {
    return
  }
  processingId.value = invite.id
  try {
    await couple.acceptInvite(invite.id)
    ElMessage.success('情侣空间开启成功 🎉')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '操作失败')
  } finally {
    processingId.value = ''
  }
}

async function onReject(invite: CoupleInviteVO) {
  if (processingId.value) {
    return
  }
  processingId.value = invite.id
  try {
    await couple.rejectInvite(invite.id)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '操作失败')
  } finally {
    processingId.value = ''
  }
}

async function onCancel(invite: CoupleInviteVO) {
  if (processingId.value) {
    return
  }
  processingId.value = invite.id
  try {
    await couple.cancelInvite(invite.id)
    ElMessage.success('已撤回邀请')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '操作失败')
  } finally {
    processingId.value = ''
  }
}
</script>

<style scoped>
.couple-setup {
  padding: 16px 20px 24px;
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
@media (max-width: 768px) {
  .couple-setup {
    padding: 12px 12px 20px;
  }
}
.panel {
  border-radius: 12px;
}
.head-title {
  font-weight: 600;
  font-size: 15px;
}
.steps {
  margin: 12px 0 4px;
}
.guide-actions {
  display: flex;
  justify-content: center;
  margin: 14px 0 6px;
}
.btn-ico {
  margin-right: 4px;
}
.feature-intro {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 8px;
}
.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: var(--im-bg, #f7f8fa);
  border-radius: 10px;
  padding: 10px 12px;
}
.feature-emoji {
  font-size: 20px;
  line-height: 1.4;
}
.feature-item b {
  font-size: 13px;
}
.feature-item p {
  margin: 2px 0 0;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
  line-height: 1.6;
}
.invite-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 2px;
}
.invite-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.invite-name {
  font-size: 14px;
  font-weight: 600;
}
.invite-note {
  font-size: 12px;
  color: var(--im-text-2, #51565f);
}
.invite-time {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.invite-actions {
  display: flex;
  gap: 8px;
}
.invite-select {
  width: 100%;
}
.invite-note-input {
  margin-top: 10px;
}
.invite-tip {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
  margin: 8px 0 0;
}
.option-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.option-name {
  font-size: 13px;
}
.option-username {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
</style>

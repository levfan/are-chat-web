<template>
  <div class="admin-page">
    <header class="admin-head">
      <h2>管理后台</h2>
      <span class="admin-sub">审批注册申请 · 用户管理 · 全站公告 · 操作审计</span>
    </header>

    <el-tabs v-model="tab" class="admin-tabs">
      <!-- ============ 77 注册审批 ============ -->
      <el-tab-pane name="applications">
        <template #label>
          <el-badge :value="pendingCount || undefined" :max="99">
            <span>注册审批</span>
          </el-badge>
        </template>
        <div class="toolbar">
          <el-radio-group v-model="applicationFilter" size="small" @change="loadApplications">
            <el-radio-button value="PENDING">待审批</el-radio-button>
            <el-radio-button value="APPROVED">已通过</el-radio-button>
            <el-radio-button value="REJECTED">已拒绝</el-radio-button>
            <el-radio-button value="">全部</el-radio-button>
          </el-radio-group>
          <el-button size="small" :loading="loadingApps" @click="loadApplications">刷新</el-button>
        </div>
        <el-table :data="applications" size="small" data-testid="admin-app-table">
          <el-table-column prop="username" label="用户名" min-width="110" />
          <el-table-column label="昵称" min-width="100">
            <template #default="{ row }">
              <span v-if="row.nickname">{{ row.nickname }}</span>
              <span v-else class="muted">—</span>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="手机号" min-width="120" />
          <el-table-column label="申请时间" min-width="150">
            <template #default="{ row }">{{ formatTime(row.created) }}</template>
          </el-table-column>
          <el-table-column label="状态" width="90">
            <template #default="{ row }">
              <el-tag :type="statusTagType(row.status)" size="small">{{ statusLabel(row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="审批信息" min-width="160">
            <template #default="{ row }">
              <span v-if="row.status === 'PENDING'">—</span>
              <span v-else class="muted">
                {{ row.reviewedBy }} · {{ formatTime(row.reviewedAt) }}
                <template v-if="row.rejectReason">（{{ row.rejectReason }}）</template>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="170" fixed="right">
            <template #default="{ row }">
              <template v-if="row.status === 'PENDING'">
                <el-button
                  type="primary"
                  size="small"
                  :data-testid="`approve-${row.username}`"
                  @click="onApprove(row as AdminApplicationVO)"
                >
                  通过
                </el-button>
                <el-button type="danger" plain size="small" @click="onReject(row as AdminApplicationVO)">拒绝</el-button>
              </template>
              <span v-else class="muted">已处理</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- ============ 79 用户管理 ============ -->
      <el-tab-pane label="用户管理" name="users">
        <div class="toolbar">
          <el-input
            v-model="userKeyword"
            size="small"
            class="user-search"
            placeholder="按用户名 / 手机号搜索"
            clearable
            @keyup.enter="loadUsers"
            @clear="loadUsers"
          />
          <el-button size="small" @click="loadUsers">搜索</el-button>
          <el-button size="small" :loading="loadingUsers" @click="loadUsers">刷新</el-button>
        </div>
        <el-table :data="users" size="small" data-testid="admin-user-table">
          <el-table-column prop="username" label="用户名" min-width="110" />
          <el-table-column prop="phone" label="手机号" min-width="120" />
          <el-table-column label="角色" width="80">
            <template #default="{ row }">
              <el-tag v-if="row.role === 'ADMIN'" type="warning" size="small">管理员</el-tag>
              <span v-else>用户</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="90">
            <template #default="{ row }">
              <el-tag :type="userStatusTag(row.status)" size="small">{{ userStatusLabel(row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="最近登录" min-width="150">
            <template #default="{ row }">{{ row.lastLoginAt ? formatTime(row.lastLoginAt) : '从未登录' }}</template>
          </el-table-column>
          <el-table-column label="操作" width="220" fixed="right">
            <template #default="{ row }">
              <el-button
                v-if="row.status === 'ACTIVE'"
                type="warning"
                plain
                size="small"
                @click="onToggleUser(row as AdminUserVO, false)"
              >
                禁用
              </el-button>
              <el-button
                v-else-if="row.status === 'DISABLED'"
                type="success"
                plain
                size="small"
                @click="onToggleUser(row as AdminUserVO, true)"
              >
                启用
              </el-button>
              <span v-else class="muted">已注销</span>
              <el-button size="small" :data-testid="`reset-${row.username}`" @click="onResetPassword(row as AdminUserVO)">
                重置密码
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- ============ 88 公告管理 ============ -->
      <el-tab-pane label="全站公告" name="announcements">
        <div class="announce-editor">
          <el-input
            v-model="announcementDraft"
            type="textarea"
            :rows="3"
            maxlength="500"
            show-word-limit
            placeholder="输入公告内容（发布后所有在线用户实时收到，全站用户登录可见）"
            data-testid="announcement-input"
          />
          <el-button type="primary" :loading="publishing" data-testid="announcement-publish" @click="onPublish">
            发布公告
          </el-button>
        </div>
        <el-table :data="announcements" size="small">
          <el-table-column prop="content" label="内容" min-width="280" show-overflow-tooltip />
          <el-table-column label="状态" width="90">
            <template #default="{ row }">
              <el-tag :type="row.enabled ? 'success' : 'info'" size="small">{{ row.enabled ? '生效中' : '已关闭' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdBy" label="发布人" width="110" />
          <el-table-column label="发布时间" min-width="150">
            <template #default="{ row }">{{ formatTime(row.created) }}</template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
              <el-button v-if="row.enabled" size="small" @click="onCloseAnnouncement(row as AdminAnnouncementVO)">关闭</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- ============ 93 审计日志 ============ -->
      <el-tab-pane label="审计日志" name="audit">
        <el-button size="small" :loading="loadingAudit" @click="loadAudit">刷新</el-button>
        <el-table :data="audits" size="small" data-testid="admin-audit-table">
          <el-table-column prop="actor" label="操作人" width="110" />
          <el-table-column prop="action" label="动作" width="130">
            <template #default="{ row }">{{ auditLabel(row.action) }}</template>
          </el-table-column>
          <el-table-column prop="target" label="对象" width="120" />
          <el-table-column prop="detail" label="详情" min-width="240" show-overflow-tooltip />
          <el-table-column label="时间" min-width="150">
            <template #default="{ row }">{{ formatTime(row.created) }}</template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- ============ F45 情侣空间运营看板 ============ -->
      <el-tab-pane label="情侣看板" name="couple" lazy>
        <div class="couple-stats" data-testid="admin-couple-stats">
          <el-button size="small" :loading="loadingCoupleStats" @click="loadCoupleStats">刷新</el-button>
          <div v-if="coupleStats" class="stats-grid">
            <div class="stat-card">
              <span class="stat-num">{{ coupleStats.activeSpaces }}</span>
              <span class="stat-label">存续中的空间</span>
            </div>
            <div class="stat-card">
              <span class="stat-num">{{ coupleStats.spacesCreatedThisMonth }}</span>
              <span class="stat-label">本月新建立</span>
            </div>
            <div class="stat-card">
              <span class="stat-num">{{ coupleStats.avgDays }}</span>
              <span class="stat-label">平均在一起天数</span>
            </div>
            <div class="stat-card">
              <span class="stat-num">{{ coupleStats.dissolvedSpaces }}</span>
              <span class="stat-label">已解散</span>
            </div>
            <div class="stat-card">
              <span class="stat-num">{{ coupleStats.totalActions }}</span>
              <span class="stat-label">累计贴贴次数</span>
            </div>
            <div class="stat-card">
              <span class="stat-num">{{ coupleStats.totalLetters }}</span>
              <span class="stat-label">累计悄悄话</span>
            </div>
            <div class="stat-card">
              <span class="stat-num">{{ coupleStats.totalPromisesDone }}</span>
              <span class="stat-label">完成的约定</span>
            </div>
            <div class="stat-card">
              <span class="stat-num">{{ coupleStats.totalCapsules }}</span>
              <span class="stat-label">时光胶囊</span>
            </div>
          </div>
          <el-empty v-else description="点击「刷新」加载情侣空间运营数据" :image-size="60" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { adminApi } from '@/api/auth'
import { coupleApi } from '@/api/couple'
import { useImStore } from '@/stores/im'
import type {
  AdminAnnouncementVO,
  AdminApplicationVO,
  AdminAuditVO,
  AdminUserVO,
  CoupleAdminStatsVO,
} from '@/types'

const im = useImStore()
const tab = ref<'applications' | 'users' | 'announcements' | 'audit'>('applications')

const applications = ref<AdminApplicationVO[]>([])
const applicationFilter = ref('PENDING')
const loadingApps = ref(false)
const pendingCount = ref(0)

// ============ F45 情侣空间运营看板 ============
const coupleStats = ref<CoupleAdminStatsVO | null>(null)
const loadingCoupleStats = ref(false)

async function loadCoupleStats() {
  loadingCoupleStats.value = true
  try {
    coupleStats.value = await coupleApi.adminCoupleStats()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '看板加载失败')
  } finally {
    loadingCoupleStats.value = false
  }
}

const users = ref<AdminUserVO[]>([])
const userKeyword = ref('')
const loadingUsers = ref(false)

const announcements = ref<AdminAnnouncementVO[]>([])
const announcementDraft = ref('')
const publishing = ref(false)

const audits = ref<AdminAuditVO[]>([])
const loadingAudit = ref(false)

onMounted(() => {
  void loadApplications()
})

function formatTime(ts?: number | null) {
  if (!ts) {
    return '—'
  }
  return new Date(ts).toLocaleString()
}

function statusLabel(status: string) {
  return status === 'PENDING' ? '待审批' : status === 'APPROVED' ? '已通过' : '已拒绝'
}

function statusTagType(status: string) {
  return status === 'PENDING' ? 'warning' : status === 'APPROVED' ? 'success' : 'danger'
}

function userStatusLabel(status: string) {
  return status === 'ACTIVE' ? '正常' : status === 'DISABLED' ? '已禁用' : '已注销'
}

function userStatusTag(status: string) {
  return status === 'ACTIVE' ? 'success' : status === 'DISABLED' ? 'danger' : 'info'
}

function auditLabel(action: string) {
  const map: Record<string, string> = {
    APPROVE: '通过注册申请',
    REJECT: '拒绝注册申请',
    ENABLE: '启用账号',
    DISABLE: '禁用账号',
    RESET_PASSWORD: '重置密码',
    ANNOUNCE: '发布公告',
    CLOSE_ANNOUNCEMENT: '关闭公告',
  }
  return map[action] ?? action
}

async function loadApplications() {
  loadingApps.value = true
  try {
    applications.value = await adminApi.applications(applicationFilter.value || undefined)
    if (applicationFilter.value === 'PENDING') {
      pendingCount.value = applications.value.length
      im.adminPending = pendingCount.value
    }
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '申请列表加载失败')
  } finally {
    loadingApps.value = false
  }
}

async function loadUsers() {
  loadingUsers.value = true
  try {
    users.value = await adminApi.users(userKeyword.value.trim() || undefined)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '用户列表加载失败')
  } finally {
    loadingUsers.value = false
  }
}

async function loadAnnouncements() {
  try {
    announcements.value = await adminApi.announcements()
  } catch {
    // 静默
  }
}

async function loadAudit() {
  loadingAudit.value = true
  try {
    audits.value = await adminApi.audit()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '审计日志加载失败')
  } finally {
    loadingAudit.value = false
  }
}

async function onApprove(row: AdminApplicationVO) {
  try {
    await ElMessageBox.confirm(
      `确认通过 ${row.username}（${row.phone}）的注册申请？通过后将立即开通账号。`,
      '通过注册申请',
      { confirmButtonText: '通过', cancelButtonText: '取消', type: 'success' },
    )
  } catch {
    return
  }
  try {
    await adminApi.approve(row.id)
    ElMessage.success(`已开通 ${row.username}，对方现在可以登录了`)
    await loadApplications()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '审批失败')
  }
}

async function onReject(row: AdminApplicationVO) {
  let reason = ''
  try {
    const result = await ElMessageBox.prompt('填写拒绝原因（会展示给申请人）', '拒绝注册申请', {
      confirmButtonText: '拒绝',
      cancelButtonText: '取消',
      inputPlaceholder: '例如：信息填写不完整',
      type: 'warning',
    })
    reason = result.value?.trim() ?? ''
  } catch {
    return
  }
  try {
    await adminApi.reject(row.id, reason)
    ElMessage.success(`已拒绝 ${row.username} 的申请`)
    await loadApplications()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '操作失败')
  }
}

async function onToggleUser(row: AdminUserVO, active: boolean) {
  const action = active ? '启用' : '禁用'
  try {
    await ElMessageBox.confirm(`确认${action}账号 ${row.username}？`, `${action}账号`, {
      confirmButtonText: action,
      cancelButtonText: '取消',
      type: 'warning',
    })
  } catch {
    return
  }
  try {
    await adminApi.setUserStatus(row.username, active)
    ElMessage.success(`已${action} ${row.username}`)
    await loadUsers()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '操作失败')
  }
}

async function onResetPassword(row: AdminUserVO) {
  let newPassword = ''
  try {
    const result = await ElMessageBox.prompt(
      `为 ${row.username} 设置新密码：6~64 位、无空格、需同时包含字母和数字。留空则生成随机临时密码。`,
      `重置密码 · ${row.username}`,
      {
        confirmButtonText: '重置',
        cancelButtonText: '取消',
        inputPlaceholder: '输入指定密码，留空则生成随机临时密码',
        inputType: 'text',
        inputValidator: (value: string) => {
          const input = value ?? ''
          if (!input) {
            return true // 留空 = 随机密码，交由后端生成
          }
          if (input.length < 6 || input.length > 64) {
            return '密码长度需为 6~64 位'
          }
          if (/\s/.test(input)) {
            return '密码不能包含空格'
          }
          return /[a-zA-Z]/.test(input) && /\d/.test(input) ? true : '密码需同时包含字母和数字'
        },
        type: 'warning',
      },
    )
    newPassword = result.value ?? ''
  } catch {
    return
  }
  const specified = newPassword.length > 0
  try {
    const result = await adminApi.resetPassword(row.username, specified ? newPassword : undefined)
    await ElMessageBox.alert(
      specified
        ? `已将 ${row.username} 的密码重置为：${result.password}（请线下告知对方使用新密码登录）`
        : `新密码：${result.password}（请复制并线下告知 ${row.username}，该密码仅此一次展示）`,
      '密码已重置',
      { confirmButtonText: '知道了' },
    )
    await loadUsers()
  } catch (e) {
    if (e instanceof Error && e.message !== 'cancel' && e.message !== 'close') {
      ElMessage.error(e.message)
    }
  }
}

async function onPublish() {
  const content = announcementDraft.value.trim()
  if (!content) {
    ElMessage.warning('公告内容不能为空')
    return
  }
  publishing.value = true
  try {
    await adminApi.publishAnnouncement(content)
    announcementDraft.value = ''
    ElMessage.success('公告已发布，在线用户已实时收到')
    await loadAnnouncements()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '发布失败')
  } finally {
    publishing.value = false
  }
}

async function onCloseAnnouncement(row: { id: string }) {
  try {
    await adminApi.closeAnnouncement(row.id)
    ElMessage.success('公告已关闭')
    await loadAnnouncements()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '操作失败')
  }
}

// tab 切换懒加载
watch(tab, (value) => {
  if (value === 'users' && users.value.length === 0) {
    void loadUsers()
  } else if (value === 'announcements' && announcements.value.length === 0) {
    void loadAnnouncements()
  } else if (value === 'audit' && audits.value.length === 0) {
    void loadAudit()
  }
})
</script>

<style scoped>
.admin-page {
  max-width: 1080px;
  margin: 0 auto;
  padding: 20px 24px;
}
@media (max-width: 768px) {
  .admin-page {
    padding: 14px 12px 20px;
  }
}
.admin-head {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 6px;
}
.admin-head h2 {
  margin: 0;
  font-size: 18px;
}
.admin-sub {
  color: var(--im-muted, #8f959e);
  font-size: 13px;
}
.toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.user-search {
  width: 240px;
}
.muted {
  color: var(--im-muted, #8f959e);
  font-size: 12px;
}
.announce-editor {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
  max-width: 640px;
}
.announce-editor .el-button {
  align-self: flex-start;
}
/* F45 情侣空间运营看板 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
  margin-top: 12px;
}
.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 14px 8px;
  border-radius: 10px;
  background: var(--el-fill-color-lighter, #fafafa);
}
.stat-num {
  font-size: 24px;
  font-weight: 700;
  color: #f56c6c;
}
.stat-label {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
</style>

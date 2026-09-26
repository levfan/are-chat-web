<template>
  <div class="couple-page">
    <!-- 未建立：指引建立 -->
    <CoupleSetup v-if="!couple.established" />

    <!-- 已建立：空间主页 -->
    <div v-else class="space-page" data-testid="couple-space">
      <!-- 头部：双方头像 + 在一起天数 + 关系操作 -->
      <el-card shadow="never" class="panel header-card">
        <div class="header-row">
          <div class="pair">
            <ImAvatar :name="auth.username" :size="52" halo online />
            <span class="heart">💖</span>
            <ImAvatar
              :name="couple.space!.partner.username"
              :label="couple.space!.partner.nickname"
              :color="couple.space!.partner.avatar"
              :size="52"
              :online="couple.space!.partner.online"
              halo
              data-testid="couple-partner-avatar"
            />
            <div class="pair-names">
              <span class="pair-name" data-testid="couple-partner-name">{{ couple.space!.partner.nickname }}</span>
              <span class="pair-username">@{{ couple.space!.partner.username }}</span>
            </div>
          </div>
          <div class="stats">
            <div class="stat">
              <span class="stat-num" data-testid="couple-days">{{ couple.space!.days }}</span>
              <span class="stat-label">在一起的天数</span>
            </div>
            <div class="stat">
              <span class="stat-num" data-testid="couple-header-streak">{{ couple.checkins?.streak ?? 0 }}</span>
              <span class="stat-label">连续互道晚安</span>
            </div>
          </div>
          <div class="header-actions">
            <el-button size="small" plain data-testid="couple-anniv-edit" @click="openAnnivEdit">
              <el-icon class="btn-ico"><EditPen /></el-icon>纪念日
            </el-button>
            <el-button size="small" type="danger" plain data-testid="couple-dissolve" @click="onDissolve">
              解除关系
            </el-button>
          </div>
        </div>
      </el-card>

      <!-- 三大功能 -->
      <el-card shadow="never" class="panel">
        <el-tabs v-model="activeTab" class="couple-tabs">
          <el-tab-pane label="🤝 约定" name="promises">
            <CouplePromises />
          </el-tab-pane>
          <el-tab-pane label="🌅 小仪式" name="rituals" lazy>
            <CoupleRituals />
          </el-tab-pane>
          <el-tab-pane label="🗓️ 共享空间" name="shared" lazy>
            <CoupleShared />
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <!-- 修改纪念日弹窗 -->
      <el-dialog v-model="annivEditVisible" title="在一起的纪念日" width="360px" data-testid="couple-anniv-edit-dialog">
        <el-date-picker
          v-model="annivEditDate"
          type="date"
          placeholder="选择你们在一起的日子"
          value-format="YYYY-MM-DD"
          :disabled-date="(d: Date) => d.getTime() > Date.now()"
          class="anniv-picker"
          data-testid="couple-anniv-edit-date"
        />
        <p class="anniv-tip">用于计算「在一起的天数」，双方可见</p>
        <template #footer>
          <el-button @click="annivEditVisible = false">取消</el-button>
          <el-button type="primary" :loading="savingAnniv" data-testid="couple-anniv-edit-save" @click="onSaveAnniv">
            保存
          </el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { EditPen } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useCoupleStore } from '@/stores/couple'
import ImAvatar from '@/components/im/ImAvatar.vue'
import CoupleSetup from '@/components/couple/CoupleSetup.vue'
import CouplePromises from '@/components/couple/CouplePromises.vue'
import CoupleRituals from '@/components/couple/CoupleRituals.vue'
import CoupleShared from '@/components/couple/CoupleShared.vue'

const auth = useAuthStore()
const couple = useCoupleStore()
const route = useRoute()

const activeTab = ref('promises')
const annivEditVisible = ref(false)
const annivEditDate = ref<string | null>(null)
const savingAnniv = ref(false)

function openAnnivEdit() {
  annivEditDate.value = couple.space?.anniversary ?? null
  annivEditVisible.value = true
}

async function onSaveAnniv() {
  if (!annivEditDate.value) {
    ElMessage.warning('选择一个日期')
    return
  }
  savingAnniv.value = true
  try {
    await couple.setAnniversary(annivEditDate.value)
    ElMessage.success('纪念日已更新 📅')
    annivEditVisible.value = false
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '保存失败')
  } finally {
    savingAnniv.value = false
  }
}

async function onDissolve() {
  try {
    await ElMessageBox.confirm(
      '解除后双方都无法再看到空间内容，且各自可以发起新邀请。确定解除情侣空间吗？',
      '解除情侣空间',
      { type: 'warning', confirmButtonText: '确定解除', cancelButtonText: '再想想' },
    )
    await couple.dissolve()
    ElMessage.warning('情侣空间已解除')
  } catch {
    // 用户取消
  }
}

onMounted(() => {
  // 聊天「记入约定」跳转：?tab=promises 直接定位到约定页
  const tab = typeof route.query.tab === 'string' ? route.query.tab : ''
  if (['promises', 'rituals', 'shared'].includes(tab)) {
    activeTab.value = tab
  }
  // MainLayout 已在登录后 init 过：这里兜底刷新总览（邀请状态可能变化）
  void couple.init()
})
</script>

<style scoped>
.couple-page {
  padding: 16px 20px 24px;
  max-width: 860px;
  margin: 0 auto;
}
@media (max-width: 768px) {
  .couple-page {
    padding: 12px 12px 20px;
  }
}
.panel {
  border-radius: 12px;
}
.panel + .panel,
.space-page {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.header-row {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
}
.pair {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 220px;
}
.heart {
  font-size: 20px;
}
.pair-names {
  display: flex;
  flex-direction: column;
  margin-left: 4px;
}
.pair-name {
  font-size: 16px;
  font-weight: 700;
}
.pair-username {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.stats {
  display: flex;
  gap: 22px;
}
.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.stat-num {
  font-size: 22px;
  font-weight: 700;
  color: #f56c6c;
}
.stat-label {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.header-actions {
  display: flex;
  gap: 8px;
  margin-left: auto;
}
.btn-ico {
  margin-right: 2px;
}
.anniv-picker {
  width: 100%;
}
.anniv-tip {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
  margin: 8px 0 0;
}
</style>

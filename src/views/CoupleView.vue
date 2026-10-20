<template>
  <!-- .couple-scope 把这一棵子树的令牌换回暖色：全站已是科技冷色，只有情侣空间保留情侣观感 -->
  <div class="couple-page couple-scope">
    <!-- 未建立：指引建立（没有空间就没有在一起天数，这一步删不掉） -->
    <CoupleSetup v-if="!couple.established" />

    <!-- 已建立：一张头部 + 一张日历，单栏从上到下，不再分页签 -->
    <div v-else class="space-page" data-testid="couple-space">
      <el-card shadow="never" class="panel header-card">
        <div class="pair">
          <ImAvatar :name="auth.username" :size="46" halo online />
          <span class="heart" aria-hidden="true">💖</span>
          <ImAvatar
            :name="couple.space!.partner.username"
            :label="couple.space!.partner.nickname"
            :color="couple.space!.partner.avatar"
            :size="46"
            :online="couple.space!.partner.online"
            halo
            data-testid="couple-partner-avatar"
          />
          <div class="pair-names">
            <span class="pair-name" data-testid="couple-partner-name">{{ couple.space!.partner.nickname }}</span>
            <span class="pair-username">@{{ couple.space!.partner.username }}</span>
          </div>
        </div>

        <div class="days">
          <span class="days-num" data-testid="couple-days">{{ couple.space!.days }}</span>
          <span class="days-label">在一起的天数</span>
          <span class="days-anniv" data-testid="couple-anniv-line">
            {{ couple.space!.anniversary ? `纪念日 ${couple.space!.anniversary}` : '还没定纪念日' }}
          </span>
        </div>

        <div class="header-actions">
          <el-button size="small" plain data-testid="couple-anniv-edit" @click="openAnnivEdit">
            <el-icon class="btn-ico"><EditPen /></el-icon>纪念日
          </el-button>
          <el-button size="small" type="danger" plain data-testid="couple-dissolve" @click="onDissolve">
            解除关系
          </el-button>
        </div>
      </el-card>

      <!-- 整百整千的那一天值得说一句，其余日子不打扰 -->
      <div v-if="milestone" class="milestone-banner" data-testid="couple-milestone-banner">
        🎉 今天是在一起第 <b>{{ milestone }}</b> 天！这个数字值得纪念 💕
      </div>

      <CoupleCalendar />

      <!-- 修改纪念日弹窗：它只决定「第 1 天是哪天」 -->
      <el-dialog v-model="annivEditVisible" title="在一起的纪念日" width="360px" draggable
                 data-testid="couple-anniv-edit-dialog">
        <!-- testid 挂在外层 div 上：el-date-picker 不透传属性到 DOM，挂组件上等于没有 -->
        <div data-testid="couple-anniv-edit-date">
          <el-date-picker
            v-model="annivEditDate"
            type="date"
            placeholder="选择你们在一起的日子"
            value-format="YYYY-MM-DD"
            :disabled-date="(d: Date) => d.getTime() > Date.now()"
            class="anniv-picker"
          />
        </div>
        <p class="anniv-tip">用于计算「在一起的天数」，双方可见；在一起的每一天都从这一天数起</p>
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
import { computed, onMounted, ref } from 'vue'
import { EditPen } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useCoupleStore } from '@/stores/couple'
import ImAvatar from '@/components/im/ImAvatar.vue'
import CoupleSetup from '@/components/couple/CoupleSetup.vue'
import CoupleCalendar from '@/components/couple/CoupleCalendar.vue'

/**
 * 情侣空间主页：2026-10-20 三轮裁剪后只剩「在一起天数 + 纪念日 + 亲密日历」，一屏就装完了。
 * 页签、心动值、宣言、爱称与打卡解锁的外观一并撤掉——前几样失去了数据源，
 * 后几样只是同一件事的第二个入口。
 */
const auth = useAuthStore()
const couple = useCoupleStore()

const annivEditVisible = ref(false)
const annivEditDate = ref<string | null>(null)
const savingAnniv = ref(false)

/** 里程碑天数：命中 100/200/365/520/666/888/1000/1314/2000 时今天值得庆祝 */
const MILESTONE_DAYS = [100, 200, 365, 520, 666, 888, 1000, 1314, 2000]
const milestone = computed(() => {
  const days = couple.space?.days
  return days && MILESTONE_DAYS.includes(days) ? days : null
})

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
  // MainLayout 登录后已 init 过：这里兜底刷新总览（邀请状态可能变了）
  void couple.init()
})
</script>

<style scoped>
.couple-page {
  padding: 16px 20px 24px;
  max-width: 720px;
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
.space-page {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
/* 头部三段：人 → 天数 → 操作；窄屏折行，天数那一格不缩 */
.header-card :deep(.el-card__body) {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
}
.pair {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.heart {
  font-size: 18px;
}
.pair-names {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
  min-width: 0;
}
.pair-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--im-text, #303133);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pair-username {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.days {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.15;
  padding: 0 16px;
  border-left: 1px solid var(--im-border, #dcdfe6);
  border-right: 1px solid var(--im-border, #dcdfe6);
}
.days-num {
  font-size: 30px;
  font-weight: 700;
  color: #d9789f;
}
.days-label {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.days-anniv {
  margin-top: 2px;
  font-size: 11px;
  color: var(--im-text-2, #606266);
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}
.btn-ico {
  margin-right: 4px;
}
.milestone-banner {
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(217, 120, 159, 0.14);
  border: 1px solid rgba(217, 120, 159, 0.3);
  color: #b0577a;
  font-size: 13px;
  text-align: center;
}
.milestone-banner b {
  font-size: 15px;
}
.anniv-picker {
  width: 100%;
}
.anniv-tip {
  margin: 8px 0 0;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
@media (max-width: 560px) {
  .pair {
    flex: 1 1 100%;
  }
  .days {
    flex: 1;
    padding: 0;
    border: none;
  }
  .header-actions {
    flex: 1 1 100%;
    margin-left: 0;
  }
}
</style>

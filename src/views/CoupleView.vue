<template>
  <div class="couple-page">
    <!-- 未建立：指引建立 -->
    <CoupleSetup v-if="!couple.established" />

    <!-- 已建立：空间主页 -->
    <div v-else class="space-page" data-testid="couple-space">
      <!-- 头部：双方头像 + 在一起天数 + 关系操作（互道早安达成 → 当日专属背景自动点亮） -->
      <el-card shadow="never" class="panel header-card" :class="{ themed: morningUnlocked }"
               :style="morningUnlocked ? { background: themeGradient } : undefined">
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
              <span class="pair-name" data-testid="couple-partner-name">
                {{ couple.space!.partner.petName || couple.space!.partner.nickname }}
              </span>
              <span class="pair-username">
                @{{ couple.space!.partner.username }}
                <button
                  type="button"
                  class="pet-edit"
                  title="给 TA 起个专属爱称"
                  data-testid="couple-pet-edit"
                  @click="openPetEdit"
                >
                  🏷️ 爱称
                </button>
              </span>
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
            <div class="stat">
              <span class="stat-num" data-testid="couple-intimacy-score">{{ couple.intimacy?.score ?? 0 }}</span>
              <span class="stat-label">{{ couple.intimacy ? `${couple.intimacy.icon} ${couple.intimacy.title}` : '心动值' }}</span>
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

      <!-- 主题解锁徽标条：早安点亮背景 / 晚安解锁贴纸 -->
      <div v-if="morningUnlocked || nightUnlocked" class="theme-banner" data-testid="couple-theme-banner">
        <span v-if="morningUnlocked">🌅 今日专属背景已点亮（{{ themeLabel }}）</span>
        <span v-if="nightUnlocked">🌙 今日专属贴纸 {{ themeStickers[0] }} {{ themeStickers[1] }} 已解锁</span>
      </div>

      <!-- 逾期可爱提醒：全局常驻（不分页签），一键跳到约定页 -->
      <el-alert
        v-if="couple.overdueCount > 0"
        type="warning"
        :closable="false"
        class="overdue-alert"
        data-testid="couple-overdue-alert"
      >
        <template #title>
          <span class="overdue-line">
            😳 还有 {{ couple.overdueCount }} 件事你没做到哦~
            <el-button link type="primary" size="small" data-testid="couple-overdue-goto" @click="activeTab = 'promises'">
              去看看 →
            </el-button>
          </span>
        </template>
      </el-alert>

      <!-- 三大功能 -->
      <el-card shadow="never" class="panel">
        <el-tabs v-model="activeTab" class="couple-tabs">
          <el-tab-pane label="🫶 贴贴" name="bond" lazy>
            <CoupleBond />
          </el-tab-pane>
          <el-tab-pane label="🤝 约定" name="promises">
            <div class="tab-stack">
              <CouplePromises />
              <CouplePact />
            </div>
          </el-tab-pane>
          <el-tab-pane label="🌅 小仪式" name="rituals" lazy>
            <CoupleRituals />
          </el-tab-pane>
          <el-tab-pane :label="letterTabLabel" name="letters" lazy>
            <CoupleLetter />
          </el-tab-pane>
          <el-tab-pane label="💗 心情" name="mood" lazy>
            <CoupleMood />
          </el-tab-pane>
          <el-tab-pane label="🗓️ 共享空间" name="shared" lazy>
            <div class="tab-stack">
              <CoupleCityCard />
              <CoupleShared />
              <CoupleFund />
            </div>
          </el-tab-pane>
          <el-tab-pane label="📖 时光轴" name="timeline" lazy>
            <CoupleTimeline />
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <!-- 修改纪念日弹窗 -->
      <el-dialog v-model="annivEditVisible" title="在一起的纪念日" width="360px" draggable data-testid="couple-anniv-edit-dialog">
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

      <!-- 专属爱称弹窗 -->
      <el-dialog v-model="petEditVisible" title="给 TA 起个专属爱称" width="360px" draggable data-testid="couple-pet-dialog">
        <el-input
          v-model="petEditName"
          maxlength="30"
          show-word-limit
          :placeholder="`比如：宝宝、猪猪、${couple.space?.partner.nickname || '小可爱'}`"
          data-testid="couple-pet-name"
          @keyup.enter="onSavePet"
        />
        <p class="anniv-tip">只有你们俩能看到，空间里 TA 的名字会变成它；留空保存 = 清除爱称</p>
        <template #footer>
          <el-button @click="petEditVisible = false">取消</el-button>
          <el-button type="primary" :loading="savingPet" data-testid="couple-pet-save" @click="onSavePet">
            保存
          </el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { EditPen } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useCoupleStore } from '@/stores/couple'
import { todayBackground as getTodayBackground, todayStickers as getTodayStickers, todayThemeLabel } from '@/utils/coupleTheme'
import ImAvatar from '@/components/im/ImAvatar.vue'
import CoupleSetup from '@/components/couple/CoupleSetup.vue'
import CoupleBond from '@/components/couple/CoupleBond.vue'
import CouplePromises from '@/components/couple/CouplePromises.vue'
import CoupleRituals from '@/components/couple/CoupleRituals.vue'
import CoupleLetter from '@/components/couple/CoupleLetter.vue'
import CoupleMood from '@/components/couple/CoupleMood.vue'
import CoupleShared from '@/components/couple/CoupleShared.vue'
import CouplePact from '@/components/couple/CouplePact.vue'
import CoupleCityCard from '@/components/couple/CoupleCityCard.vue'
import CoupleFund from '@/components/couple/CoupleFund.vue'
import CoupleTimeline from '@/components/couple/CoupleTimeline.vue'

const auth = useAuthStore()
const couple = useCoupleStore()
const route = useRoute()

const activeTab = ref('promises')
const annivEditVisible = ref(false)
const annivEditDate = ref<string | null>(null)
const savingAnniv = ref(false)
const petEditVisible = ref(false)
const petEditName = ref('')
const savingPet = ref(false)

/** 悄悄话 tab 标题：有可拆未拆的信时带数量红点 */
const letterTabLabel = computed(() =>
  couple.letterUnread > 0 ? `💌 悄悄话 ${couple.letterUnread}` : '💌 悄悄话',
)

/** 今日专属主题：双方互道早安/晚安达成后自动点亮（色板按天轮换，同一天双方同一款） */
const morningUnlocked = computed(() => !!couple.checkins?.me.morning && !!couple.checkins?.partner.morning)
const nightUnlocked = computed(() => !!couple.checkins?.me.night && !!couple.checkins?.partner.night)
const themeGradient = getTodayBackground()
const themeLabel = todayThemeLabel()
const themeStickers = getTodayStickers()

function openAnnivEdit() {
  annivEditDate.value = couple.space?.anniversary ?? null
  annivEditVisible.value = true
}

function openPetEdit() {
  petEditName.value = couple.space?.partner.petName ?? ''
  petEditVisible.value = true
}

async function onSavePet() {
  savingPet.value = true
  try {
    const name = petEditName.value.trim()
    await couple.setPetName(name || null)
    ElMessage.success(name ? `爱称已更新：「${name}」🏷️` : '爱称已清除')
    petEditVisible.value = false
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '保存失败')
  } finally {
    savingPet.value = false
  }
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
  if (['bond', 'promises', 'rituals', 'letters', 'mood', 'shared', 'timeline'].includes(tab)) {
    activeTab.value = tab
  }
  // MainLayout 已在登录后 init 过：这里兜底刷新总览（邀请状态可能变化）
  void couple.init()
  // 头部心动值 & 恋爱等级
  void couple.loadIntimacy()
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
/* 早安达成：当日专属渐变作为头部背景（pastel 色系，内容保持可读） */
.header-card.themed {
  border: none;
}
.theme-banner {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  color: #ad4e00;
  background: linear-gradient(90deg, rgba(255, 236, 210, 0.9), rgba(255, 214, 227, 0.9));
}
/* 一个 tab 里并列多个功能块 */
.tab-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.overdue-alert {
  border-radius: 10px;
}
.overdue-line {
  font-weight: 600;
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
.pet-edit {
  margin-left: 6px;
  border: none;
  background: transparent;
  padding: 0;
  font-size: 11px;
  color: var(--im-muted, #8f959e);
  cursor: pointer;
}
.pet-edit:hover {
  color: var(--el-color-primary, #409eff);
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

<template>
  <div class="couple-page">
    <!-- 未建立：指引建立 -->
    <CoupleSetup v-if="!couple.established" />

    <!-- 已建立：空间主页 -->
    <div v-else class="space-page" data-testid="couple-space">
      <!-- 头部：双方头像 + 在一起天数 + 心动值 + 关系操作（背景取空间主题色，连满 7 天换会长的动态背景） -->
      <el-card shadow="never" class="panel header-card themed"
               :class="{ 'bg-grown': bgStage > 0 }"
               :data-bg-stage="bgStage || undefined"
               :data-testid="bgStage > 0 ? 'couple-header-bg-stage' : undefined"
               :style="headerBackground">
        <!-- 连满 7 天，背景里长出这棵一起养的电子植物：解锁的档位越高，它长得越高 -->
        <span
          v-if="bgStage > 0"
          class="space-plant"
          aria-hidden="true"
          :data-testid="`couple-plant-stage-${bgStage}`"
        >{{ PLANT_STAGES[bgStage - 1] }}</span>
        <div class="header-row">
          <div class="pair">
            <ImAvatar :name="auth.username" :size="52" halo online :pendant="pendantEmoji" />
            <span class="heart">💖</span>
            <ImAvatar
              :name="couple.space!.partner.username"
              :label="couple.space!.partner.nickname"
              :color="couple.space!.partner.avatar"
              :size="52"
              :online="couple.space!.partner.online"
              halo
              :pendant="pendantEmoji"
              data-testid="couple-partner-avatar"
            />
            <div class="pair-names">
              <span
                class="pair-name"
                :class="{ 'couple-name-glow': titleGlowOn }"
                data-testid="couple-partner-name"
              >
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
              <!-- 连满 30 天才把恋爱等级称号挂到空间顶部；称号本身沿用心动值七级，不造第二套 -->
              <span
                v-if="titleBadge"
                class="love-title"
                data-testid="couple-love-title"
              >{{ titleBadge.icon }} {{ titleBadge.title }}</span>
            </div>
          </div>
          <div class="stats">
            <div class="stat">
              <span class="stat-num" data-testid="couple-days">{{ couple.space!.days }}</span>
              <span class="stat-label">在一起的天数</span>
            </div>
            <div class="stat">
              <span class="stat-num" data-testid="couple-intimacy-score">{{ couple.intimacy?.score ?? 0 }}</span>
              <span class="stat-label">{{ intimacyStatLabel }}</span>
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

      <!-- F43 里程碑天数：今天是有意义的日子 -->
      <div v-if="milestone" class="milestone-banner" data-testid="couple-milestone-banner">
        🎉 今天是在一起第 <b>{{ milestone }}</b> 天！这个数字值得纪念 💕
      </div>

      <!-- 空间个性化：我们的宣言 -->
      <CoupleProfile />

      <!-- 六张卡两个页签：今天五张（一问 + 打卡 + 亲密日历 + 经期记录 + 亲密记录）、愿望清单一张 -->
      <el-card shadow="never" class="panel">
        <el-tabs v-model="activeTab" class="couple-tabs">
          <el-tab-pane label="🫶 今天" name="today">
            <div class="tab-stack">
              <CoupleQuestion />
              <CoupleStreak />
              <CoupleCalendar />
              <CouplePeriod />
              <CoupleIntimate />
            </div>
          </el-tab-pane>
          <el-tab-pane label="🌟 愿望清单" name="wish" lazy>
            <div class="tab-stack">
              <CoupleWish />
            </div>
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
import ImAvatar from '@/components/im/ImAvatar.vue'
import CoupleSetup from '@/components/couple/CoupleSetup.vue'
import CoupleProfile from '@/components/couple/CoupleProfile.vue'
import CoupleStreak from '@/components/couple/CoupleStreak.vue'
import CoupleQuestion from '@/components/couple/CoupleQuestion.vue'
import CoupleCalendar from '@/components/couple/CoupleCalendar.vue'
import CouplePeriod from '@/components/couple/CouplePeriod.vue'
import CoupleIntimate from '@/components/couple/CoupleIntimate.vue'
import CoupleWish from '@/components/couple/CoupleWish.vue'
import { couplePendant } from '@/utils/coupleVisual'

const auth = useAuthStore()
const couple = useCoupleStore()
const route = useRoute()

const activeTab = ref('today')
const annivEditVisible = ref(false)
const annivEditDate = ref<string | null>(null)
const savingAnniv = ref(false)
const petEditVisible = ref(false)
const petEditName = ref('')
const savingPet = ref(false)

/** F43 里程碑天数：命中 100/200/365/520/666/888/1000/1314/2000 时今天值得庆祝 */
const MILESTONE_DAYS = [100, 200, 365, 520, 666, 888, 1000, 1314, 2000]
const milestone = computed(() => {
  const days = couple.space?.days
  return days && MILESTONE_DAYS.includes(days) ? days : null
})

/** F27 空间主题：应用双方选定的空间主题渐变，没选过就走今日色板 */
const THEME_GRADIENTS: Record<string, string> = {
  classic: 'linear-gradient(90deg, #fff0f0, #ffe3ec)',
  cherry: 'linear-gradient(90deg, #ffe8f3, #f8e6ff)',
  ocean: 'linear-gradient(90deg, #e6f7ff, #e3efff)',
  forest: 'linear-gradient(90deg, #e8f7ee, #f0f9e2)',
  night: 'linear-gradient(90deg, #313d5c, #4f4372)',
}
const headerBackground = computed(() => {
  const theme = couple.space?.theme ?? 'classic'
  return { background: THEME_GRADIENTS[theme] ?? THEME_GRADIENTS.classic }
})

// ============ 连续互动打卡解锁的外观（判据一律来自后端 tiers，前端不自拼天数） ============

/** 植物四阶段：背景解锁时是种子，之后每多解锁一档往上长一格。 */
const PLANT_STAGES = ['🌱', '🌿', '🪴', '🌳'] as const

/** 已解锁档位数（六档都算进成长）。 */
const unlockedCount = computed(() => couple.unlockedTierKeys.length)

/** 背景只在连满 7 天之后生长，阶段 1-4；没解锁就是 0（不渲染植物）。 */
const bgStage = computed(() => {
  if (!couple.tierUnlocked('background')) return 0
  return Math.min(Math.max(unlockedCount.value - 1, 1), PLANT_STAGES.length)
})

/** 连满 30 天才把称号挂到顶部；称号内容沿用心动值七级，不另造一套。 */
const titleBadge = computed(() => {
  if (!couple.tierUnlocked('title') || !couple.intimacy) return null
  return { icon: couple.intimacy.icon, title: couple.intimacy.title }
})

/** 称号已经单独成徽章时，心动值那一格回到「心动值」，同一个词不在头部出现两次。 */
const intimacyStatLabel = computed(() => {
  if (!couple.intimacy || titleBadge.value) return '心动值'
  return `${couple.intimacy.icon} ${couple.intimacy.title}`
})

/** 连满 14 天，TA 的爱称开始发光（发光样式与聊天侧共用 style.css 的 .couple-name-glow）。 */
const titleGlowOn = computed(() => couple.tierUnlocked('nickname-glow'))

/**
 * 连满 21 天，头像边上挂一对联动小挂件。
 * 取法与聊天侧共用 `utils/coupleVisual` 的 couplePendant（按空间主题定款），
 * 免得同一个人聊天列表挂 🔗、进了空间挂 🫂。
 */
const pendantEmoji = computed(() =>
  couple.tierUnlocked('pendant') ? couplePendant(couple.space?.theme) : undefined,
)

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
    // 爱称只有 PUT /api/couple/profile 这一条通道（独立的 bond/pet-name 随贴贴卡下线）：
    // 空串 = 清除，其余两个字段不传就是不改；改完由 store 重拉总览生效
    await couple.updateProfile({ petName: name || '' })
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

onMounted(async () => {
  // 深链直达：?tab=today|wish 指定首屏页签，白名单外的值忽略
  const tab = typeof route.query.tab === 'string' ? route.query.tab : ''
  if (['today', 'wish'].includes(tab)) {
    activeTab.value = tab
  }
  // MainLayout 已在登录后 init 过：这里兜底刷新总览（邀请状态可能变化）
  await couple.init()
  // 头部心动值 & 恋爱等级
  if (!couple.established) return
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
/* 连满 30 天：恋爱等级称号挂到空间顶部 */
.love-title {
  margin-top: 4px;
  align-self: flex-start;
  padding: 1px 8px;
  border-radius: 999px;
  border: 1px solid rgba(245, 108, 108, 0.35);
  background: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  font-weight: 600;
  color: #d24d5c;
}
/* 连满 7 天：背景开始缓慢流动，角落那棵一起养的植物随档位长高 */
.header-card.bg-grown {
  position: relative;
  overflow: hidden;
}
.header-card.bg-grown::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(115deg, transparent 35%, rgba(255, 255, 255, 0.22) 50%, transparent 65%);
  background-size: 250% 100%;
  animation: couple-bg-drift 14s linear infinite;
}
@keyframes couple-bg-drift {
  from {
    background-position: 120% 0;
  }
  to {
    background-position: -120% 0;
  }
}
.space-plant {
  position: absolute;
  right: 14px;
  bottom: 6px;
  z-index: 1;
  line-height: 1;
  transform-origin: bottom center;
  animation: couple-plant-sway 7s ease-in-out infinite;
}
.header-card[data-bg-stage='1'] .space-plant {
  font-size: 22px;
}
.header-card[data-bg-stage='2'] .space-plant {
  font-size: 30px;
}
.header-card[data-bg-stage='3'] .space-plant {
  font-size: 38px;
}
.header-card[data-bg-stage='4'] .space-plant {
  font-size: 46px;
}
@keyframes couple-plant-sway {
  0%,
  100% {
    transform: rotate(-2deg);
  }
  50% {
    transform: rotate(2deg);
  }
}
/* 动效一律给「减少动态效果」的用户关掉，称号与植物本身不受影响 */
@media (prefers-reduced-motion: reduce) {
  .header-card.bg-grown::after,
  .space-plant {
    animation: none;
  }
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
  align-items: center;
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
/* F43 里程碑天数横幅 */
.milestone-banner {
  padding: 12px 16px;
  border-radius: 10px;
  background: linear-gradient(90deg, #fff0f0, #fff8e6);
  border: 1px solid #f8d3a3;
  font-size: 14px;
  font-weight: 600;
  color: #c45656;
  text-align: center;
}
.milestone-banner b {
  font-size: 18px;
  color: #f56c6c;
}
</style>

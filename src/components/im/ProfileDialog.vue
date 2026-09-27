<template>
  <el-dialog v-model="visible" title="个人中心" width="420px" draggable>
    <!-- 101 分四个页签：资料 / 外观 / 聊天 / 账号，避免单页内容过长 -->
    <el-tabs v-model="activeTab" class="profile-tabs" data-testid="profile-tabs">
      <!-- 资料：身份信息，走底部「保存资料」按钮 -->
      <el-tab-pane label="资料" name="profile">
        <div class="profile-form">
          <div class="avatar-row">
            <ImAvatar :name="auth.username" :color="draftAvatar" :size="64" />
            <div class="avatar-hint">
              <div class="avatar-label">头像颜色</div>
              <div class="avatar-sub">取用户名首字作为头像</div>
            </div>
          </div>
          <div class="color-grid">
            <button
              v-for="(color, index) in AVATAR_COLORS"
              :key="color"
              type="button"
              class="color-option"
              :class="{ picked: draftAvatar === `c${index}` }"
              :style="{ background: color }"
              data-testid="avatar-option"
              @click="draftAvatar = `c${index}`"
            >
              <el-icon v-if="draftAvatar === `c${index}`" color="#fff"><Check /></el-icon>
            </button>
          </div>
          <el-input v-model="draftNickname" placeholder="昵称" maxlength="32" data-testid="nickname-input" />
          <el-input
            v-model="draftSignature"
            type="textarea"
            :rows="2"
            placeholder="个性签名"
            maxlength="100"
            data-testid="signature-input"
          />
        </div>
      </el-tab-pane>

      <!-- 外观：全部即时生效，不占用保存按钮 -->
      <el-tab-pane label="外观" name="appearance">
        <div class="profile-form">
          <div class="setting-title">皮肤主题</div>
          <div class="skin-grid">
            <button
              v-for="skin in SKINS"
              :key="skin.id"
              type="button"
              class="skin-option"
              :class="{ picked: draftSkin === skin.id }"
              :style="{ background: skin.gradient }"
              :title="skin.label"
              data-testid="skin-option"
              @click="pickSkin(skin.id)"
            >
              <span class="skin-label">{{ skin.label }}</span>
              <el-icon v-if="draftSkin === skin.id" color="#fff"><Check /></el-icon>
            </button>
          </div>

          <!-- 99 界面主题：跟随系统/浅色/深色 -->
          <div class="setting-title">界面主题</div>
          <el-radio-group v-model="draftTheme" size="small" data-testid="theme-select" @change="pickTheme">
            <el-radio-button value="auto">跟随系统</el-radio-button>
            <el-radio-button value="light">浅色</el-radio-button>
            <el-radio-button value="dark">深色</el-radio-button>
          </el-radio-group>

          <div class="setting-title">聊天背景</div>
          <div class="bg-grid">
            <button
              v-for="bg in CHAT_BACKGROUNDS"
              :key="bg.id"
              type="button"
              class="bg-option"
              :class="[`bg-preview-${bg.id}`, { picked: draftBg === bg.id }]"
              data-testid="chatbg-option"
              @click="pickBackground(bg.id)"
            >
              <span class="bg-label">{{ bg.label }}</span>
            </button>
          </div>

          <div class="setting-title">聊天字号</div>
          <el-radio-group v-model="draftFont" size="small" data-testid="font-select" @change="(v) => pickFont(String(v))">
            <el-radio-button v-for="font in FONTS" :key="font.id" :value="font.id">{{ font.label }}</el-radio-button>
          </el-radio-group>
        </div>
      </el-tab-pane>

      <!-- 聊天：行为偏好，即时生效 -->
      <el-tab-pane label="聊天" name="chat">
        <div class="profile-form">
          <div class="setting-title">发送快捷键</div>
          <el-radio-group v-model="draftSendKey" size="small" data-testid="sendkey-select">
            <el-radio-button value="enter">Enter 发送</el-radio-button>
            <el-radio-button value="ctrl-enter">Ctrl+Enter 发送</el-radio-button>
          </el-radio-group>

          <div class="setting-title">拍一拍后缀</div>
          <el-input
            v-model="draftPokeSuffix"
            size="small"
            maxlength="100"
            placeholder="例如：的小脑袋（拍一拍时展示）"
            data-testid="poke-suffix-input"
            @change="pickPokeSuffix"
          />

          <!-- 91 免打扰时段 -->
          <div class="setting-title">免打扰时段</div>
          <div class="quiet-row">
            <el-switch v-model="draftQuiet.enabled" data-testid="quiet-switch" @change="saveQuiet" />
            <template v-if="draftQuiet.enabled">
              <el-select v-model="draftQuiet.start" size="small" style="width: 84px" data-testid="quiet-start" @change="saveQuiet">
                <el-option v-for="h in 24" :key="h - 1" :value="h - 1" :label="`${h - 1} 点`" />
              </el-select>
              <span class="quiet-sep">至</span>
              <el-select v-model="draftQuiet.end" size="small" style="width: 84px" data-testid="quiet-end" @change="saveQuiet">
                <el-option v-for="h in 24" :key="h - 1" :value="h - 1" :label="`${h - 1} 点`" />
              </el-select>
            </template>
          </div>
          <p class="quiet-hint">该时段内静音提示音并跳过桌面通知（支持跨零点，如 22 → 8）</p>

          <div class="setting-title">桌面通知</div>
          <div class="notify-row">
            <span class="notify-hint">页面不可见时弹系统通知</span>
            <el-switch v-model="draftNotify" data-testid="notify-switch" @change="onNotifyChange" />
          </div>
          <p v-if="notifyHint" class="notify-hint-text" data-testid="notify-hint">{{ notifyHint }}</p>
        </div>
      </el-tab-pane>

      <!-- 账号：安全与客户端 -->
      <el-tab-pane label="账号" name="account">
        <div class="profile-form">
          <!-- 98 添加到桌面：常驻入口 -->
          <div class="setting-title">添加到桌面</div>
          <div class="pwa-row">
            <template v-if="pwaStandalone">
              <span class="pwa-hint" data-testid="pwa-installed">✅ 已安装为桌面应用</span>
            </template>
            <template v-else-if="pwaInstallable">
              <span class="pwa-hint">安装后像原生 App 一样全屏打开</span>
              <el-button size="small" type="primary" plain data-testid="pwa-install" @click="onInstallClick">
                📲 立即安装
              </el-button>
            </template>
            <template v-else-if="isIos">
              <span class="pwa-hint">iPhone / iPad 需手动添加</span>
              <el-button size="small" data-testid="pwa-guide" @click="pwaGuideVisible = true">📲 添加到桌面</el-button>
            </template>
            <template v-else-if="!pwaSecure">
              <span class="pwa-hint" data-testid="pwa-insecure">HTTP 访问无法一键安装（需 HTTPS），可手动添加</span>
              <el-button size="small" data-testid="pwa-guide" @click="pwaGuideVisible = true">📲 手动添加</el-button>
            </template>
            <template v-else>
              <span class="pwa-hint" data-testid="pwa-unsupported">当前浏览器不支持一键安装（小米/华为等自带浏览器），可手动添加</span>
              <el-button size="small" data-testid="pwa-guide" @click="pwaGuideVisible = true">📲 手动添加</el-button>
            </template>
          </div>

          <el-divider class="divider" />

          <!-- 80 修改密码 -->
          <div class="setting-title">修改密码</div>
          <el-input
            v-model="pwdOld"
            type="password"
            size="small"
            show-password
            placeholder="当前密码"
            data-testid="pwd-old"
          />
          <el-input
            v-model="pwdNew"
            type="password"
            size="small"
            show-password
            placeholder="新密码（6~64 位，含字母和数字）"
            data-testid="pwd-new"
          />
          <el-input
            v-model="pwdConfirm"
            type="password"
            size="small"
            show-password
            placeholder="确认新密码"
            data-testid="pwd-confirm"
          />
          <el-button size="small" type="primary" plain :loading="changingPwd" data-testid="pwd-submit" @click="onChangePassword">
            确认修改
          </el-button>

          <el-divider class="divider" />

          <!-- 89 注销账号 -->
          <div class="setting-title danger-title">危险操作</div>
          <el-button size="small" type="danger" plain data-testid="deactivate-open" @click="deactivateVisible = true">
            注销账号…
          </el-button>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 53 登录会话信息（常驻底部，与页签无关） -->
    <div v-if="auth.loginAt" class="session-info" data-testid="session-info">
      本次登录：{{ formatChatTime(auth.loginAt) }}
    </div>
    <!-- 100 系统版本与构建时间 -->
    <div class="session-info" data-testid="app-version">小帆船 v{{ appVersion }} · 构建于 {{ buildTime }}</div>
    <template #footer>
      <el-button @click="visible = false">{{ activeTab === 'profile' ? '取消' : '关闭' }}</el-button>
      <el-button v-if="activeTab === 'profile'" type="primary" data-testid="profile-save" @click="onSave">
        保存资料
      </el-button>
    </template>

    <!-- 98 iOS 添加到桌面引导（与移动端横幅共用组件） -->
    <PwaInstallGuide v-model="pwaGuideVisible" />

    <!-- 89 注销账号确认弹窗 -->
    <el-dialog v-model="deactivateVisible" title="注销账号" width="380px" draggable append-to-body>
      <el-alert
        type="warning"
        :closable="false"
        show-icon
        title="注销后账号立即无法登录，好友关系将被删除，且不可恢复。"
      />
      <el-input v-model="deactivatePassword" type="password" show-password placeholder="输入当前密码确认" data-testid="deactivate-pwd" />
      <el-input
        v-model="deactivateConfirm"
        :placeholder="`输入用户名确认：${auth.username}`"
        data-testid="deactivate-name"
        style="margin-top: 10px"
      />
      <template #footer>
        <el-button @click="deactivateVisible = false">取消</el-button>
        <el-button type="danger" :loading="deactivating" data-testid="deactivate-confirm" @click="onDeactivate">
          确认注销
        </el-button>
      </template>
    </el-dialog>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Check } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { useImStore } from '@/stores/im'
import { authApi } from '@/api/auth'
import { AVATAR_COLORS, isAvatarColorKey } from '@/utils/imFormat'
import { formatChatTime } from '@/utils/imFormat'
import {
  CHAT_BACKGROUNDS,
  FONTS,
  SKINS,
  currentBackground,
  currentPokeSuffix,
  currentFont,
  currentQuietHours,
  currentSendKey,
  currentSkin,
  saveBackground,
  saveFont,
  savePokeSuffix,
  saveQuietHours,
  saveSendKey,
  saveSkin,
  type QuietHours,
  type SendKeyMode,
} from '@/utils/settings'
import { notificationEnabled, setNotificationEnabled } from '@/utils/notify'
import { getThemeMode, setThemeMode, type ThemeMode } from '@/utils/theme'
import { isIOS, isSecure, pwaInstallable, pwaStandalone, promptInstall } from '@/utils/pwa'
import ImAvatar from './ImAvatar.vue'
import PwaInstallGuide from './PwaInstallGuide.vue'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const auth = useAuthStore()
const im = useImStore()
const router = useRouter()

const visible = ref(props.modelValue)
const draftAvatar = ref('c0')
const draftNickname = ref('')
const draftSignature = ref('')
// 外观/行为设置草稿（即时生效，不占用保存按钮）
const draftSkin = ref(currentSkin())
const draftBg = ref(currentBackground())
const draftFont = ref(currentFont())
const draftSendKey = ref<SendKeyMode>(currentSendKey())
const draftPokeSuffix = ref(currentPokeSuffix())
const draftNotify = ref(notificationEnabled())
const notifyHint = ref('')
// 99 界面主题（跟随系统/浅色/深色）
const draftTheme = ref<ThemeMode>(getThemeMode())

// 101 个人中心分页签：资料 / 外观 / 聊天 / 账号
const activeTab = ref<'profile' | 'appearance' | 'chat' | 'account'>('profile')

// 100 版本信息（vite.config.ts define 注入，随构建自动更新）
const appVersion = __APP_VERSION__
const buildTime = __BUILD_TIME__

// 98 添加到桌面
const isIos = isIOS()
const pwaSecure = isSecure()
const pwaGuideVisible = ref(false)

/** 一键安装（安卓/桌面 Chromium）；iOS 走引导层 */
async function onInstallClick() {
  const outcome = await promptInstall()
  if (outcome === 'accepted') {
    ElMessage.success('已添加到桌面 💕')
  }
}
// 91 免打扰时段
const draftQuiet = reactive<QuietHours>(currentQuietHours())

// 80 修改密码
const pwdOld = ref('')
const pwdNew = ref('')
const pwdConfirm = ref('')
const changingPwd = ref(false)

// 89 注销账号
const deactivateVisible = ref(false)
const deactivatePassword = ref('')
const deactivateConfirm = ref('')
const deactivating = ref(false)

watch(
  () => props.modelValue,
  (value) => {
    visible.value = value
    if (value) {
      // 每次打开都回到「资料」页签
      activeTab.value = 'profile'
    }
    if (value && im.myProfile) {
      // 兼容旧数据：非颜色档位（如历史 emoji）回落到默认档
      draftAvatar.value = isAvatarColorKey(im.myProfile.avatar) ? (im.myProfile.avatar as string) : 'c0'
      draftNickname.value = im.myProfile.nickname
      draftSignature.value = im.myProfile.signature
      draftSkin.value = currentSkin()
      draftBg.value = currentBackground()
      draftFont.value = currentFont()
      draftSendKey.value = currentSendKey()
      draftPokeSuffix.value = currentPokeSuffix()
      draftNotify.value = notificationEnabled()
      draftTheme.value = getThemeMode()
      Object.assign(draftQuiet, currentQuietHours())
    }
  },
)
watch(visible, (value) => emit('update:modelValue', value))

/** 63 切换皮肤（即时生效） */
function pickSkin(id: string) {
  draftSkin.value = id
  saveSkin(id)
}

/** 64 切换聊天背景（即时生效） */
function pickBackground(id: string) {
  draftBg.value = id
  saveBackground(id)
}

/** 67 拍一拍后缀（即时生效） */
function pickPokeSuffix(value: string) {
  savePokeSuffix(value)
}

function pickFont(id: string) {
  saveFont(id)
}

/** 99 切换界面主题（即时生效并持久化） */
function pickTheme(mode: string | number | boolean | undefined) {
  setThemeMode(String(mode) as ThemeMode)
}

async function onNotifyChange(value: boolean | string | number) {
  const granted = await setNotificationEnabled(Boolean(value))
  if (value && !granted) {
    notifyHint.value = '浏览器拒绝了通知权限，可在地址栏权限设置中恢复'
  } else {
    notifyHint.value = ''
  }
}

/** 91 保存免打扰时段（即时生效） */
function saveQuiet() {
  saveQuietHours({ ...draftQuiet })
  ElMessage.success(draftQuiet.enabled ? '免打扰时段已保存' : '已关闭免打扰时段')
}

/** 80 修改密码 */
async function onChangePassword() {
  if (!pwdOld.value || !pwdNew.value) {
    ElMessage.warning('请填写当前密码与新密码')
    return
  }
  if (pwdNew.value !== pwdConfirm.value) {
    ElMessage.warning('两次输入的新密码不一致')
    return
  }
  changingPwd.value = true
  try {
    await authApi.changePassword(pwdOld.value, pwdNew.value)
    ElMessage.success('密码已修改，下次登录请使用新密码')
    pwdOld.value = ''
    pwdNew.value = ''
    pwdConfirm.value = ''
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '修改失败')
  } finally {
    changingPwd.value = false
  }
}

/** 89 注销账号：二次校验后调用后端，成功即退出登录 */
async function onDeactivate() {
  if (!deactivatePassword.value) {
    ElMessage.warning('请输入当前密码')
    return
  }
  if (deactivateConfirm.value !== auth.username) {
    ElMessage.warning(`请输入你的用户名「${auth.username}」确认`)
    return
  }
  try {
    await ElMessageBox.confirm('这是最后一步：账号将立即被注销且不可恢复。', '最终确认', {
      confirmButtonText: '我知道后果，注销',
      cancelButtonText: '再想想',
      type: 'error',
    })
  } catch {
    return
  }
  deactivating.value = true
  try {
    await authApi.deactivate(deactivatePassword.value)
    deactivateVisible.value = false
    visible.value = false
    ElMessage.success('账号已注销，再见👋')
    await auth.logout()
    await router.push('/login')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '注销失败')
  } finally {
    deactivating.value = false
  }
}

async function onSave() {
  try {
    saveSendKey(draftSendKey.value)
    await im.saveProfile({
      nickname: draftNickname.value.trim(),
      signature: draftSignature.value.trim(),
      avatar: draftAvatar.value,
    })
    ElMessage.success('资料已更新')
    visible.value = false
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '保存失败')
  }
}
</script>

<style scoped>
.profile-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.avatar-row {
  display: flex;
  align-items: center;
  gap: 14px;
}
.avatar-label {
  font-size: 14px;
  font-weight: 500;
}
.avatar-sub {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
  margin-top: 2px;
}
.color-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
}
.color-option {
  aspect-ratio: 1;
  border: 2px solid transparent;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.12s ease;
}
.color-option:hover {
  transform: scale(1.08);
}
.color-option.picked {
  border-color: var(--xx-text, #1f2329);
  box-shadow: inset 0 0 0 2px var(--im-panel, #fff);
}
.divider {
  margin: 2px 0;
}
.setting-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.setting-title {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.accent-grid {
  display: flex;
  gap: 10px;
}
.accent-option {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.accent-option.picked {
  border-color: var(--xx-text, #1f2329);
  box-shadow: inset 0 0 0 2px var(--im-panel, #fff);
}

/* ---- 63 皮肤色卡 ---- */
.skin-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.skin-option {
  position: relative;
  height: 44px;
  border: 2px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  padding: 4px 6px;
  overflow: hidden;
}
.skin-option.picked {
  border-color: var(--xx-text, #1f2329);
}
.skin-label {
  font-size: 11px;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
}
.skin-option .el-icon {
  position: absolute;
  top: 5px;
  right: 6px;
}

/* ---- 64 聊天背景缩略 ---- */
.bg-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
}
.bg-option {
  height: 40px;
  border: 2px solid var(--im-border, #e6e8eb);
  border-radius: 8px;
  cursor: pointer;
  padding: 3px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.bg-option.picked {
  border-color: var(--xx-accent, #ec5f92);
}
.bg-label {
  font-size: 10px;
  color: var(--im-text-2, #51565f);
  background: rgba(255, 255, 255, 0.72);
  border-radius: 4px;
  padding: 0 3px;
}
.bg-preview-default {
  background: #f7f8fa;
}
.bg-preview-night {
  background: linear-gradient(160deg, #1b2440, #3d3a63);
}
.bg-preview-sakura {
  background: linear-gradient(160deg, #fff5f9, #ffd9e8);
}
.bg-preview-mint {
  background: linear-gradient(160deg, #f2fbf7, #d8f2ff);
}
.bg-preview-paper {
  background:
    repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.05) 0 1px, transparent 1px 7px),
    #fdfcf7;
}
.notify-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.notify-hint {
  font-size: 13px;
  color: var(--xx-text-2, #51565f);
}
.notify-hint-text {
  font-size: 12px;
  color: var(--el-color-warning, #e6a23c);
  margin: 0;
}
/* ---- 91 免打扰时段 ---- */
.quiet-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.quiet-sep {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.quiet-hint {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
  margin: 0;
}
.danger-title {
  color: var(--el-color-danger, #f56c6c);
}
/* ---- 98 添加到桌面 ---- */
.pwa-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.pwa-hint {
  font-size: 12px;
  color: var(--xx-text-2, #51565f);
}
.session-info {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
/* ---- 101 个人中心分页签 ---- */
.profile-tabs :deep(.el-tabs__content) {
  max-height: 56vh;
  overflow-y: auto;
}
.profile-tabs + .session-info {
  margin-top: 12px;
}
</style>

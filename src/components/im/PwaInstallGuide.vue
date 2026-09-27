<template>
  <!-- 98 添加到桌面引导：iOS 与安卓（小米等自带浏览器）无法一键安装时，教用户走浏览器菜单 -->
  <el-dialog v-model="visible" :title="guideTitle" width="360px" draggable append-to-body>
    <div class="ios-guide">
      <!-- HTTP 场景说明：浏览器安全策略禁用一键安装，但手动方式仍然可用 -->
      <el-alert
        v-if="!secure"
        type="warning"
        :closable="false"
        show-icon
        title="当前通过 HTTP 访问，浏览器会禁用一键安装（需 HTTPS 才能解除）。下面的手动添加方式在 HTTP 下也可用。"
      />
      <template v-if="ios">
        <div class="guide-step">
          <span class="step-no">1</span>
          <div class="step-text">
            <b>点击 Safari 底部的「分享」按钮</b>
            <p>方框加向上箭头的图标 ↓（必须在 Safari 中打开本站）</p>
          </div>
        </div>
        <div class="guide-step">
          <span class="step-no">2</span>
          <div class="step-text">
            <b>在菜单中找到「添加到主屏幕」</b>
            <p>向下滑动列表即可看到</p>
          </div>
        </div>
        <div class="guide-step">
          <span class="step-no">3</span>
          <div class="step-text">
            <b>点击「添加」完成</b>
            <p>桌面出现小帆船图标，点开即全屏运行 ⛵</p>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="guide-step">
          <span class="step-no">1</span>
          <div class="step-text">
            <b>打开浏览器的「菜单」</b>
            <p>小米浏览器在底部 ☰，Chrome 在右上角 ⋮</p>
          </div>
        </div>
        <div class="guide-step">
          <span class="step-no">2</span>
          <div class="step-text">
            <b>找到「添加到桌面 / 添加到主屏幕 / 发送到桌面」</b>
            <p>小米、华为、QQ 等浏览器入口名称略有差异，多在「工具箱 / 收藏」附近</p>
          </div>
        </div>
        <div class="guide-step">
          <span class="step-no">3</span>
          <div class="step-text">
            <b>确认添加完成</b>
            <p>桌面出现小帆船图标 ⛵；部分浏览器以快捷方式打开（非全屏），属正常现象</p>
          </div>
        </div>
      </template>
    </div>
    <template #footer>
      <el-button type="primary" data-testid="ios-guide-ok" @click="visible = false">我知道了</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { isIOS, isSecure } from '@/utils/pwa'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const visible = ref(props.modelValue)
watch(
  () => props.modelValue,
  (value) => {
    visible.value = value
  },
)
watch(visible, (value) => emit('update:modelValue', value))

const ios = isIOS()
const secure = isSecure()
const guideTitle = computed(() =>
  ios ? '添加到桌面（iPhone / iPad）' : '添加到桌面（安卓浏览器）',
)
</script>

<style scoped>
.ios-guide {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.guide-step {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.step-no {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--xx-accent, #ec5f92);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
.step-text b {
  font-size: 13px;
}
.step-text p {
  margin: 2px 0 0;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
</style>

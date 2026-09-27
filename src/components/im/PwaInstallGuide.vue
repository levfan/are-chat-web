<template>
  <!-- 98 iOS 添加到桌面引导：苹果不允许网页一键唤起安装，只能教用户手动操作 -->
  <el-dialog v-model="visible" title="添加到桌面（iPhone / iPad）" width="360px" draggable append-to-body>
    <div class="ios-guide">
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
          <p>桌面出现 are-chat 图标，点开即全屏运行 💕</p>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button type="primary" data-testid="ios-guide-ok" @click="visible = false">我知道了</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

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

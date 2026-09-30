<template>
  <div class="dict" data-testid="couple-dict">
    <!-- F78 恋爱词典 -->
    <div class="card" data-testid="couple-dict-words">
      <h4 class="title">📖 恋爱词典 <span class="sub">只有你们懂的语言</span></h4>
      <div class="form-row">
        <el-input v-model="wordDraft" maxlength="50" placeholder="词汇：外号/梗/暗号" data-testid="couple-dict-word" @keyup.enter="onAddWord" />
        <el-input v-model="meaningDraft" maxlength="200" placeholder="释义：只有我们懂的那层意思" data-testid="couple-dict-meaning" @keyup.enter="onAddWord" />
        <el-button type="primary" data-testid="couple-dict-add" @click="onAddWord">收录 📖</el-button>
      </div>
      <el-empty v-if="!couple.dictWords.length" description="词典还是空的——你们之间一定有只有彼此才懂的话" :image-size="56" />
      <div v-else class="word-list">
        <div v-for="w in couple.dictWords" :key="w.id" class="word-item" :data-testid="`couple-dict-${w.id}`">
          <div class="word-main">
            <span class="word-term" data-testid="couple-dict-term">{{ w.word }}</span>
            <span class="word-from">{{ w.fromUser === auth.username ? '我收录' : `TA 收录` }}</span>
          </div>
          <p class="word-meaning">{{ w.meaning }}</p>
          <el-button link size="small" type="danger" :data-testid="`couple-dict-remove-${w.id}`" @click="onRemoveWord(w.id)">
            删除
          </el-button>
        </div>
      </div>
    </div>

    <!-- F77 星座配对（静态） -->
    <div class="card" data-testid="couple-zodiac">
      <h4 class="title">✨ 星座配对 <span class="sub">玄学时刻：仅供情趣，不当真</span></h4>
      <div class="form-row">
        <el-select v-model="zodiacMine" placeholder="我的星座" style="width: 150px" data-testid="couple-zodiac-mine">
          <el-option v-for="z in zodiacOptions" :key="z.value" :label="z.label" :value="z.value" />
        </el-select>
        <el-select v-model="zodiacPartner" placeholder="TA 的星座" style="width: 150px" data-testid="couple-zodiac-partner">
          <el-option v-for="z in zodiacOptions" :key="z.value" :label="z.label" :value="z.value" />
        </el-select>
        <el-button type="danger" :loading="zodiacLoading" data-testid="couple-zodiac-check" @click="onZodiac">配一配 💘</el-button>
      </div>
      <div v-if="zodiacResult" class="zodiac-result" data-testid="couple-zodiac-result">
        <div class="zodiac-score">
          <span class="score-num">{{ zodiacResult.score }}</span>
          <span class="score-unit">分</span>
        </div>
        <p class="zodiac-line">{{ zodiacResult.mineLabel }} × {{ zodiacResult.partnerLabel }}</p>
        <p class="zodiac-comment">{{ zodiacResult.comment }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { coupleApi } from '@/api/couple'
import type { CoupleZodiacVO } from '@/types'
import { useAuthStore } from '@/stores/auth'
import { useCoupleStore } from '@/stores/couple'

const auth = useAuthStore()
const couple = useCoupleStore()

const wordDraft = ref('')
const meaningDraft = ref('')
const zodiacMine = ref<string | undefined>('aries')
const zodiacPartner = ref<string | undefined>('leo')
const zodiacLoading = ref(false)
const zodiacResult = ref<CoupleZodiacVO | null>(null)

const zodiacOptions = [
  { label: '白羊座 ♈', value: 'aries' },
  { label: '金牛座 ♉', value: 'taurus' },
  { label: '双子座 ♊', value: 'gemini' },
  { label: '巨蟹座 ♋', value: 'cancer' },
  { label: '狮子座 ♌', value: 'leo' },
  { label: '处女座 ♍', value: 'virgo' },
  { label: '天秤座 ♎', value: 'libra' },
  { label: '天蝎座 ♏', value: 'scorpio' },
  { label: '射手座 ♐', value: 'sagittarius' },
  { label: '摩羯座 ♑', value: 'capricorn' },
  { label: '水瓶座 ♒', value: 'aquarius' },
  { label: '双鱼座 ♓', value: 'pisces' },
]

async function onAddWord() {
  const word = wordDraft.value.trim()
  const meaning = meaningDraft.value.trim()
  if (!word || !meaning) {
    ElMessage.warning('词汇和释义都要写')
    return
  }
  try {
    await couple.addWord(word, meaning)
    wordDraft.value = ''
    meaningDraft.value = ''
    ElMessage.success('已收录进词典 📖')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '收录失败')
  }
}

async function onRemoveWord(id: string) {
  try {
    await couple.removeWord(id)
    ElMessage.success('词条已删除')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '删除失败')
  }
}

async function onZodiac() {
  if (!zodiacMine.value || !zodiacPartner.value) {
    ElMessage.warning('选好两个星座再配')
    return
  }
  zodiacLoading.value = true
  try {
    zodiacResult.value = await coupleApi.zodiacPair(zodiacMine.value, zodiacPartner.value)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '配对失败')
  } finally {
    zodiacLoading.value = false
  }
}

onMounted(() => {
  void couple.loadGrowth()
})
</script>

<style scoped>
.dict {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.card {
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 12px;
  padding: 14px;
}
.title {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 700;
}
.sub {
  margin-left: 6px;
  font-size: 12px;
  font-weight: 400;
  color: var(--im-muted, #8f959e);
}
.form-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
.word-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.word-item {
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  padding: 10px 12px;
}
.word-main {
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.word-term {
  font-size: 14px;
  font-weight: 700;
  color: var(--el-color-danger, #f56c6c);
}
.word-from {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.word-meaning {
  margin: 4px 0 6px;
  font-size: 13px;
  word-break: break-all;
}
.zodiac-result {
  border: 1px dashed var(--el-color-danger, #f56c6c);
  border-radius: 10px;
  padding: 14px;
  text-align: center;
}
.zodiac-score {
  margin-bottom: 6px;
}
.score-num {
  font-size: 40px;
  font-weight: 700;
  color: var(--el-color-danger, #f56c6c);
}
.score-unit {
  font-size: 14px;
  color: var(--im-muted, #8f959e);
}
.zodiac-line {
  margin: 0 0 4px;
  font-size: 13px;
  font-weight: 700;
}
.zodiac-comment {
  margin: 0;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
</style>

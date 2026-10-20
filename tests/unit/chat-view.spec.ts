import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

/**
 * ChatView 读源码的样式与空态守卫（整页挂载成本过高，这里只锁「模板与样式必须成对」这件事）。
 * 来历：2026-10-21 用户报「转发消息没有好友时显示异常、且没有任何提示」，查清是转发弹窗的
 * 5 个类名从建库那天起就没有任何 CSS 规则承接，模板也没有空态分支。
 */
const SRC = readFileSync(process.cwd() + '/src/views/ChatView.vue', 'utf8')
const STYLE_AT = SRC.indexOf('<style')
const TEMPLATE = SRC.slice(0, STYLE_AT)
const CSS = SRC.slice(STYLE_AT) + readFileSync(process.cwd() + '/src/style.css', 'utf8')

/** 已知的历史欠账：这些类名同样没有规则，但不在本次修复范围内，逐条记账防止无声扩大 */
const KNOWN_UNSTYLED = ['block-banner', 'context-bar', 'context-text', 'editing', 'jump-btn']

function classesUsed(fragment: string): string[] {
  const names = new Set<string>()
  for (const m of fragment.matchAll(/class="([^"{]*)"/g)) {
    m[1].split(/\s+/).filter(Boolean).forEach((c) => names.add(c))
  }
  for (const m of fragment.matchAll(/:class="\{([^}]*)\}/g)) {
    for (const k of m[1].matchAll(/([A-Za-z][\w-]*)\s*:/g)) names.add(k[1])
  }
  return [...names].sort()
}

const forwardDialog = TEMPLATE.slice(
  TEMPLATE.indexOf('<!-- 转发消息 -->'),
  TEMPLATE.indexOf('</el-dialog>', TEMPLATE.indexOf('<!-- 转发消息 -->')) + 12,
)

describe('ChatView 模板与样式必须成对', () => {
  it('转发弹窗用到的每个类名都有样式规则', () => {
    const used = classesUsed(forwardDialog)
    expect(used.length, '没抓到转发弹窗的类名，守卫本身失效了').toBeGreaterThan(0)
    const bare = used.filter((c) => !CSS.includes('.' + c))
    expect(bare, `这些类名在模板里用了但没有任何规则：${bare.join(', ')}`).toEqual([])
  })

  it('整页模板的无样式类名只剩已记账的欠账', () => {
    const bare = classesUsed(TEMPLATE).filter(
      (c) => !CSS.includes('.' + c) && !KNOWN_UNSTYLED.includes(c),
    )
    expect(bare, `新出现的无样式类名：${bare.join(', ')}`).toEqual([])
  })
})

describe('转发弹窗的空态与发送闸门', () => {
  it('没有可转发好友时给出提示，而不是留一块空白', () => {
    expect(forwardDialog, '模板里没有 forward-empty 空态分支').toContain('data-testid="forward-empty"')
    expect(forwardDialog).toMatch(/v-if="forwardCandidates\.length === 0"/)
    expect(SRC).toContain('const forwardEmptyHint = computed(')
  })

  it('未选中好友时发送按钮保持禁用', () => {
    expect(forwardDialog).toContain(':disabled="!forwardChoice"')
  })
})

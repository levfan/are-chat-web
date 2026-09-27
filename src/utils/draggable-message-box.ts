/**
 * 全站确认/提示/输入框默认可拖拽。
 * ElMessageBox 没有全局配置项，这里在入口处以动态方式统一注入默认参数；
 * 调用方仍可在 options 里传 draggable: false 覆盖。
 * 说明：ElMessageBox 已被各视图静态引用，本模块经 import() 加载时不会产生额外首屏体积。
 */
import { ElMessageBox } from 'element-plus'
import type { ElMessageBoxOptions } from 'element-plus'

type BoxFn = (message: string, title?: string, options?: ElMessageBoxOptions) => Promise<unknown>
const box = ElMessageBox as unknown as Record<'confirm' | 'alert' | 'prompt', BoxFn>

for (const method of ['confirm', 'alert', 'prompt'] as const) {
  const original = box[method].bind(ElMessageBox)
  box[method] = (message, title, options) => original(message, title, { draggable: true, ...options })
}

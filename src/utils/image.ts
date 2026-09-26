/** 90 大图压缩：上传前把过大的图片等比缩放重绘为 JPEG，节省流量与存储。 */

export interface CompressResult {
  blob: Blob
  /** 若发生了压缩则为新文件名（改扩展名为 .jpg），否则与原文件名一致 */
  name: string
  compressed: boolean
}

/** 超过该大小（字节）的图片才尝试压缩 */
export const COMPRESS_THRESHOLD = 1.5 * 1024 * 1024
/** 压缩目标最长边（像素） */
const MAX_EDGE = 1920
/** JPEG 质量 */
const QUALITY = 0.82

/** 可压缩的输入类型（PNG/WEBP 有损转 JPEG；GIF 压缩会丢动画，跳过） */
function compressible(file: File): boolean {
  return /^image\/(png|jpeg|webp|bmp)$/i.test(file.type)
}

/**
 * 大于阈值且可压缩时走 canvas 等比缩放；失败或不需要时原样返回。
 * 测试环境（无 createObjectURL / canvas 2d）安全回退为原始文件。
 */
export async function compressImageIfNeeded(file: File): Promise<CompressResult> {
  if (file.size <= COMPRESS_THRESHOLD || !compressible(file) || typeof document === 'undefined') {
    return { blob: file, name: file.name, compressed: false }
  }
  try {
    const bitmapUrl = URL.createObjectURL(file)
    try {
      const image = await loadImage(bitmapUrl)
      const scale = Math.min(1, MAX_EDGE / Math.max(image.width, image.height))
      if (scale >= 1 && file.type === 'image/jpeg') {
        // 本身就是 JPEG 且尺寸不大：仅重编码收益有限，跳过
        return { blob: file, name: file.name, compressed: false }
      }
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(image.width * scale))
      canvas.height = Math.max(1, Math.round(image.height * scale))
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        return { blob: file, name: file.name, compressed: false }
      }
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((result) => resolve(result), 'image/jpeg', QUALITY),
      )
      if (!blob || blob.size >= file.size) {
        // 压缩反而变大：放弃
        return { blob: file, name: file.name, compressed: false }
      }
      const name = file.name.replace(/\.[^.]+$/, '') + '.jpg'
      return { blob, name, compressed: true }
    } finally {
      URL.revokeObjectURL(bitmapUrl)
    }
  } catch {
    return { blob: file, name: file.name, compressed: false }
  }
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('image load failed'))
    image.src = url
  })
}

import { http } from './http'
import type { UploadedFileInfo } from '@/types'

/** 文件上传/下载：IM 图片消息的存储通道（SHA-256 去重）。 */
export const filesApi = {
  upload: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return http.postForm<UploadedFileInfo>('/api/files', form)
  },
}

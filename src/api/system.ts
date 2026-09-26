import { http } from './http'
import type { AnnouncementVO, HealthVO, OnlineVO } from '@/types'

/** 57 全站在线信息（登录后可用） */
export const presenceApi = {
  online: () => http.get<OnlineVO>('/api/presence/online'),
}

/** 59 系统健康检查（免登录） */
export const systemApi = {
  health: () => http.get<HealthVO>('/api/health'),
}

/** 88 全站公告（登录后可用） */
export const announcementApi = {
  current: () => http.get<AnnouncementVO | null>('/api/announcements/current'),
  markRead: (id: string) => http.postJson<void>(`/api/announcements/${id}/read`, {}),
}

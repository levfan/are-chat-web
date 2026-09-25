import { describe, expect, it } from 'vitest'
import { formatBytes, formatTime } from '@/utils/format'

describe('formatBytes', () => {
  it('按单位换算', () => {
    expect(formatBytes(0)).toBe('0 B')
    expect(formatBytes(512)).toBe('512 B')
    expect(formatBytes(1024)).toBe('1.0 KB')
    expect(formatBytes(1536)).toBe('1.5 KB')
    expect(formatBytes(1024 * 1024)).toBe('1.0 MB')
    expect(formatBytes(5 * 1024 * 1024)).toBe('5.0 MB')
  })

  it('非法输入返回 -', () => {
    expect(formatBytes(-1)).toBe('-')
    expect(formatBytes(Number.NaN)).toBe('-')
  })
})

describe('formatTime', () => {
  it('格式化时间戳', () => {
    const ts = new Date(2024, 0, 2, 9, 5).getTime()
    expect(formatTime(ts)).toBe('2024-01-02 09:05')
  })

  it('空值返回 -', () => {
    expect(formatTime(null)).toBe('-')
    expect(formatTime(undefined)).toBe('-')
  })
})

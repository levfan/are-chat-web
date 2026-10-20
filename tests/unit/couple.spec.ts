import { readFileSync } from 'node:fs'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import CoupleView from '@/views/CoupleView.vue'
import { calendarApi, coupleApi, intimateApi, periodApi } from '@/api/couple'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useCoupleStore } from '@/stores/couple'
import type { CoupleCalendarVO, CoupleOverview, CoupleSpaceVO } from '@/types'

/**
 * 情侣空间整页单测（三轮裁剪后）：这一页只剩「头部（在一起天数 + 纪念日 + 解除）+ 一张亲密日历」。
 *
 * 口径没变：断言锁「真的发了哪个请求、带什么参数、界面按返回的哪一块更新」，
 * 而不是组件里改了一个本地 ref。后端 400 的中文 message 一律直透，用例也按直透断言。
 * 日历内部的排版与闸门在 couple-calendar.spec.ts 里锁，这里只锁页面骨架、api 契约与 WS 口径。
 */

const FIX = vi.hoisted(() => ({
  emptyCalendar: {
    month: '2026-10', periodDays: [], periodStartDays: [], periodEndDays: [], periods: [],
    predictedNextDay: null, averageCycleDays: 28, cycleSampleCount: 0, daysUntilNext: null,
    intimateTotal: 0, intimate: [],
  },
}))

vi.mock('@/api/couple', () => ({
  coupleApi: {
    overview: vi.fn().mockResolvedValue({ space: null, incoming: [], outgoing: [] }),
    invite: vi.fn(), acceptInvite: vi.fn(), rejectInvite: vi.fn(), cancelInvite: vi.fn(),
    setAnniversary: vi.fn(), dissolve: vi.fn(), relationshipOf: vi.fn(),
  },
  periodApi: {
    periodAdd: vi.fn().mockResolvedValue(undefined),
    periodEnd: vi.fn().mockResolvedValue(undefined),
    periodRemove: vi.fn().mockResolvedValue(undefined),
  },
  intimateApi: {
    intimateAdd: vi.fn().mockResolvedValue(undefined),
    intimateRemove: vi.fn().mockResolvedValue(undefined),
  },
  calendarApi: { calendarMonth: vi.fn().mockResolvedValue(FIX.emptyCalendar) },
}))

const space: CoupleSpaceVO = {
  id: 's1',
  partner: { username: 'bob', nickname: '波波', avatar: 'c2', online: true },
  created: Date.now() - 10 * 86_400_000,
  anniversary: null,
  days: 11,
}

function overview(partial: Partial<CoupleOverview> = {}): CoupleOverview {
  return { space, incoming: [], outgoing: [], ...partial }
}

const emptyCalendar = FIX.emptyCalendar as unknown as CoupleCalendarVO

/**
 * 抽出源码里真正发出的 `/api/couple...` 请求路径（单引号与模板字面量都算）。
 * 只按引号取，注释里提到的已下线端点不会被误当成还在调用。
 */
function requestPaths(src: string): string[] {
  return [...src.matchAll(/['`](\/api\/couple[^'`]*)['`]/g)].map((m) => m[1])
}

let pinia = createPinia()

function mountView() {
  return mount(CoupleView, { global: { plugins: [pinia] } })
}

beforeEach(() => {
  vi.clearAllMocks()
  // 每个用例换一个全新 pinia：store 的 overview 会跨用例留存，
  // 带着上一个用例的「已建空间」再挂载，未建空间那条就永远测不准
  pinia = createPinia()
  setActivePinia(pinia)
  vi.spyOn(ElMessage, 'warning')
  vi.spyOn(ElMessage, 'error')
  vi.spyOn(ElMessage, 'success')
  useAuthStore().username = 'alice'
  vi.mocked(coupleApi.overview).mockResolvedValue(overview())
  vi.mocked(coupleApi.setAnniversary).mockResolvedValue({ ...space, anniversary: '2026-06-01', days: 142 })
  vi.mocked(calendarApi.calendarMonth).mockResolvedValue(emptyCalendar)
})

describe('空间骨架', () => {
  it('建了空间就是头部 + 一张日历，没有页签，也没有心动值 / 爱称 / 宣言的入口', async () => {
    const wrapper = mountView()
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-space"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-calendar"]').exists()).toBe(true)
    expect(wrapper.findAll('.el-tabs__item')).toHaveLength(0)
    for (const gone of ['couple-question', 'couple-streak', 'couple-wish', 'couple-profile',
      'couple-intimacy-score', 'couple-pet-edit', 'couple-love-title']) {
      expect(wrapper.find(`[data-testid="${gone}"]`).exists(), `还留着 ${gone}`).toBe(false)
    }
    expect(wrapper.find('[data-testid="couple-days"]').text()).toBe('11')
    expect(wrapper.find('[data-testid="couple-anniv-line"]').text()).toContain('还没定纪念日')
  })

  it('日历是这一页唯一的读口，挂载只敲一次', async () => {
    const wrapper = mountView()
    await flushPromises()
    expect(calendarApi.calendarMonth).toHaveBeenCalledTimes(1)
    expect(calendarApi.calendarMonth).toHaveBeenCalledWith(expect.stringMatching(/^\d{4}-\d{2}$/))
  })

  it('未建立空间时给出邀请入口，而且一个卡片接口都不敲', async () => {
    vi.mocked(coupleApi.overview).mockResolvedValue(overview({ space: null }))
    const wrapper = mountView()
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-setup"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-space"]').exists()).toBe(false)
    expect(calendarApi.calendarMonth).not.toHaveBeenCalled()
  })

  it('整百那一天值得庆祝，平常日子不打扰', async () => {
    vi.mocked(coupleApi.overview).mockResolvedValue(overview({ space: { ...space, days: 100 } }))
    const wrapper = mountView()
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-milestone-banner"]').text()).toContain('100')
  })
})

describe('纪念日与解除', () => {
  it('没选日期就保存：前端挡下，不发这次注定 400 的请求', async () => {
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('[data-testid="couple-anniv-edit"]').trigger('click')
    await wrapper.find('[data-testid="couple-anniv-edit-save"]').trigger('click')
    await flushPromises()
    expect(ElMessage.warning).toHaveBeenCalledWith('选择一个日期')
    expect(coupleApi.setAnniversary).not.toHaveBeenCalled()
  })

  it('保存纪念日交的是日期，回来后头部直接读到新日子', async () => {
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('[data-testid="couple-anniv-edit"]').trigger('click')
    await flushPromises()
    // 直接写 v-model 的那一份状态：el-date-picker 在 jsdom 里不把键入解析成值（它自己那套
    // 输入解析要真实浏览器的事件序列），这里要锁的是「保存把选中的日子交出去」这条线
    // 服务端在总览里回显新日子：store 保存后走的是「重拉 overview」，不是把返回的 SpaceVO 就地并回去
    vi.mocked(coupleApi.overview).mockResolvedValue(
      overview({ space: { ...space, anniversary: '2026-06-01', days: 142 } }))
    const vm = wrapper.vm as unknown as { annivEditDate: string | null }
    expect(vm.annivEditDate).toBeNull()
    vm.annivEditDate = '2026-06-01'
    await flushPromises()
    await wrapper.find('[data-testid="couple-anniv-edit-save"]').trigger('click')
    await flushPromises()
    expect(coupleApi.setAnniversary).toHaveBeenCalledWith('2026-06-01')
    expect(coupleApi.overview).toHaveBeenCalledTimes(2)
    expect(useCoupleStore().space?.anniversary).toBe('2026-06-01')
    expect(wrapper.find('[data-testid="couple-anniv-line"]').text()).toContain('纪念日 2026-06-01')
  })

  it('解除关系要先过确认框，确认后才清场并重拉总览', async () => {
    vi.spyOn(ElMessageBox, 'confirm').mockResolvedValue('confirm' as never)
    const wrapper = mountView()
    await flushPromises()
    // 解除之后服务端就不再返回空间了：不清场的话头部会带着上一个空间继续渲染
    vi.mocked(coupleApi.overview).mockResolvedValue(overview({ space: null }))
    await wrapper.find('[data-testid="couple-dissolve"]').trigger('click')
    await flushPromises()
    expect(coupleApi.dissolve).toHaveBeenCalledTimes(1)
    expect(useCoupleStore().established).toBe(false)
    expect(coupleApi.overview).toHaveBeenCalledTimes(2)
  })

  it('取消确认框时一个请求都不发', async () => {
    vi.spyOn(ElMessageBox, 'confirm').mockRejectedValue(new Error('cancel'))
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('[data-testid="couple-dissolve"]').trigger('click')
    await flushPromises()
    expect(coupleApi.dissolve).not.toHaveBeenCalled()
  })
})

/** mock 工厂必须覆盖 api/couple.ts 的每个方法，漏一项就红 */
describe('api 契约守卫', () => {
  it('mock 工厂覆盖 api/couple.ts 的每个方法，且方法总数与存活端点数对上', () => {
    // 判据从源码抽，不手数：源文件里每个 export const 分组的两空格缩进方法名，都必须在 mock 里是函数。
    const src = readFileSync(process.cwd() + '/src/api/couple.ts', 'utf8').split(/\r?\n/)
    const groups: Record<string, string[]> = {}
    let cur: string | null = null
    let depth = 0
    for (const line of src) {
      const open = line.match(/^export const (\w+)\s*=\s*\{/)
      if (open) { cur = open[1]; groups[cur] = []; depth = 1; continue }
      if (!cur) continue
      for (const ch of line) { if (ch === '{') depth++; else if (ch === '}') depth-- }
      const m = line.match(/^  ([a-zA-Z][\w]*)\s*[:(]/)
      if (m) groups[cur].push(m[1])
      if (depth <= 0) cur = null
    }
    const mocked: Record<string, Record<string, unknown>> = { coupleApi, periodApi, intimateApi, calendarApi }
    const missing: string[] = []
    let total = 0
    for (const [name, methods] of Object.entries(groups)) {
      const obj = mocked[name]
      if (!obj) { missing.push(name + '（整个分组没出现在 mock 工厂里）'); continue }
      for (const fn of methods) {
        total++
        if (typeof obj[fn] !== 'function') missing.push(name + '.' + fn)
      }
    }
    expect(missing, 'mock 工厂缺：' + missing.join(', ')).toEqual([])
    expect(Object.keys(groups).sort()).toEqual(['calendarApi', 'coupleApi', 'intimateApi', 'periodApi'])
    // 14 = coupleApi 8（地基 7 + 旁支读取 1）+ period 3 + intimate 2 + calendar 1
    expect(total).toBe(14)
  })

  it('已下线的端点在 api/couple.ts 与 store 里一个字都搜不到', () => {
    const api = readFileSync(process.cwd() + '/src/api/couple.ts', 'utf8')
    const store = readFileSync(process.cwd() + '/src/stores/couple.ts', 'utf8')
    const paths = requestPaths(api)
    for (const dead of ['question', 'streak', 'wish', 'intimacy', 'profile', 'board', 'pin', 'dining']) {
      expect(paths.filter((p) => p.split('/').includes(dead)), `api/couple.ts 还在打 /${dead}`).toEqual([])
    }
    // 存活的 14 条路径一个多余的都没有
    expect(paths).toHaveLength(14)
    for (const dead of ['streakApi', 'questionApi', 'wishApi', 'loadIntimacy', 'updateProfile', 'tierUnlocked']) {
      expect(store, `stores/couple.ts 里还留着 ${dead}`).not.toContain(dead)
      expect(api, `api/couple.ts 里还留着 ${dead}`).not.toContain(dead)
    }
  })
})

describe('情侣空间 WS 事件的刷新口径', () => {
  function push(event: string) {
    window.dispatchEvent(new CustomEvent('arechat:couple', { detail: { event, username: 'bob', detail: '一句话' } }))
  }

  it('invite-accepted 重拉总览', async () => {
    const couple = useCoupleStore()
    couple.init()
    await flushPromises()
    vi.mocked(coupleApi.overview).mockClear()
    push('invite-accepted')
    await flushPromises()
    expect(coupleApi.overview).toHaveBeenCalledTimes(1)
  })

  it('anniversary-updated 改的是日子，必须重拉总览', async () => {
    const couple = useCoupleStore()
    couple.init()
    await flushPromises()
    vi.mocked(coupleApi.overview).mockClear()
    push('anniversary-updated')
    await flushPromises()
    expect(coupleApi.overview).toHaveBeenCalledTimes(1)
  })

  it('dissolved 先清场再重拉总览', async () => {
    const couple = useCoupleStore()
    couple.init()
    await flushPromises()
    expect(couple.established).toBe(true)
    vi.mocked(coupleApi.overview).mockResolvedValue(overview({ space: null }))
    push('dissolved')
    await flushPromises()
    expect(couple.established).toBe(false)
    expect(coupleApi.overview).toHaveBeenCalledTimes(2)
  })

  it('anniversary-reminder 是定时任务发的倒数，只弹提醒，不动总览', async () => {
    const couple = useCoupleStore()
    couple.init()
    await flushPromises()
    vi.mocked(coupleApi.overview).mockClear()
    push('anniversary-reminder')
    await flushPromises()
    expect(coupleApi.overview).not.toHaveBeenCalled()
  })

  it('已下线卡片的老推送不再认识：不发请求、不弹提醒', async () => {
    const couple = useCoupleStore()
    couple.init()
    await flushPromises()
    vi.mocked(coupleApi.overview).mockClear()
    for (const dead of ['streak-checkin', 'question-answered', 'wish-added', 'pet-name-changed', 'space-themed']) {
      push(dead)
    }
    await flushPromises()
    expect(coupleApi.overview).not.toHaveBeenCalled()
  })

  it('没有空间时 init 不去敲任何卡片接口，reset 也会把总览清掉', async () => {
    vi.mocked(coupleApi.overview).mockResolvedValue(overview({ space: null }))
    const couple = useCoupleStore()
    await couple.init()
    expect(couple.established).toBe(false)
    expect(calendarApi.calendarMonth).not.toHaveBeenCalled()
    couple.reset()
    expect(couple.overview).toBeNull()
  })
})

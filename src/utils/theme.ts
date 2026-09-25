/** 主题：亮 / 暗 / 跟随系统，三态切换并持久化（配合 Element Plus dark css-vars）。 */
export type ThemeMode = 'light' | 'dark' | 'auto'

const THEME_KEY = 'arechat.theme'

export function getThemeMode(): ThemeMode {
  const value = localStorage.getItem(THEME_KEY)
  return value === 'light' || value === 'dark' || value === 'auto' ? value : 'auto'
}

function systemPrefersDark(): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function applyTheme(mode: ThemeMode) {
  const dark = mode === 'dark' || (mode === 'auto' && systemPrefersDark())
  document.documentElement.classList.toggle('dark', dark)
}

export function setThemeMode(mode: ThemeMode) {
  localStorage.setItem(THEME_KEY, mode)
  applyTheme(mode)
}

/** 循环切换：auto → light → dark → auto */
export function cycleTheme(): ThemeMode {
  const order: ThemeMode[] = ['auto', 'light', 'dark']
  const next = order[(order.indexOf(getThemeMode()) + 1) % order.length]
  setThemeMode(next)
  return next
}

export function initTheme() {
  applyTheme(getThemeMode())
  if (typeof window.matchMedia === 'function') {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => applyTheme(getThemeMode()))
  }
}

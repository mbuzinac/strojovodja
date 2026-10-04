/**
 * Svijetla / tamna tema – pamti se u localStorage.
 * Default: light (lakše za učenje).
 */
export function useTheme() {
  const theme = useState('app-theme', () => 'light')

  function apply(next) {
    const t = next === 'dark' ? 'dark' : 'light'
    theme.value = t
    if (!import.meta.client) return
    document.documentElement.setAttribute('data-theme', t)
    localStorage.setItem('strojovodja-theme', t)
  }

  function toggle() {
    apply(theme.value === 'light' ? 'dark' : 'light')
  }

  function init() {
    if (!import.meta.client) return
    const saved = localStorage.getItem('strojovodja-theme')
    apply(saved === 'dark' || saved === 'light' ? saved : 'light')
  }

  return { theme, toggle, setTheme: apply, initTheme: init }
}

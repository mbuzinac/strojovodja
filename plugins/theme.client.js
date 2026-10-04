/** Rano postavi temu da nema flasha bijelo↔tamno. */
export default defineNuxtPlugin(() => {
  const theme = useState('app-theme', () => {
    if (import.meta.client) {
      const saved = localStorage.getItem('strojovodja-theme')
      if (saved === 'dark' || saved === 'light') return saved
    }
    return 'light'
  })

  if (import.meta.client) {
    document.documentElement.setAttribute('data-theme', theme.value)
  }
})

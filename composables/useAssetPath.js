/** Pretvori /signals/foo.jpg u ispravnu putanju s GitHub Pages baseURL prefiksom. */
export function useAssetPath() {
  const base = useRuntimeConfig().app.baseURL || '/'

  return (path) => {
    if (!path) return path
    if (/^https?:\/\//i.test(path)) return path
    const prefix = base.endsWith('/') ? base : `${base}/`
    const clean = path.startsWith('/') ? path.slice(1) : path
    return `${prefix}${clean}`
  }
}

const legacyRoutes = {
  inicio: '/',
  contacto: '/contacto',
  rastreo: '/rastreo',
  login: '/login',
  detalle: '/producto/doble-cheese-burger',
}

export function productSlug(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function normalizeRoute(value = '/') {
  let decoded
  try {
    decoded = decodeURIComponent(String(value).replace(/^#/, ''))
  } catch {
    decoded = '/not-found'
  }
  const route = legacyRoutes[decoded] || decoded
  const withSlash = route.startsWith('/') ? route : `/${route}`
  return withSlash.replace(/\/{2,}/g, '/').replace(/\/$/, '') || '/'
}

export function getHashRoute() {
  return normalizeRoute(window.location.hash || '/')
}

export function navigateTo(route) {
  const nextHash = `#${normalizeRoute(route)}`
  if (window.location.hash !== nextHash) window.location.hash = nextHash
}

const CACHE_NAME = 'jj-cache-v3'
const STATIC_ASSETS = [
  '/',
  '/search',
  '/faq',
  '/knowledge-hub',
  '/og-image.png',
  '/favicon.png',
  '/manifest.json',
]

// Install: cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)).catch(() => {})
  )
  self.skipWaiting()
})

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Fetch: network-first for API/nav, cache-first for static assets
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)
  
  // Skip non-GET, cross-origin, API calls
  if (event.request.method !== 'GET') return
  if (!url.origin.includes(self.location.origin)) return
  if (url.pathname.startsWith('/api/')) return
  if (url.pathname.startsWith('/_next/')) {
    // Cache-first for Next.js static chunks
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request).then(res => {
        const clone = res.clone()
        caches.open(CACHE_NAME).then(c => c.put(event.request, clone))
        return res
      }))
    )
    return
  }

  // Network-first for pages
  event.respondWith(
    fetch(event.request)
      .then(res => {
        if (res.ok) {
          const clone = res.clone()
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone))
        }
        return res
      })
      .catch(() => caches.match(event.request))
  )
})

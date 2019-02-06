workbox.skipWaiting()
workbox.clientsClaim()

// self.addEventListener('install', event => {
//   const asyncInstall = new Promise(resolve => {
//     console.log('Waiting to resolve...')
//     setTimeout(resolve, 5000)
//   })

//   event.waitUntil(asyncInstall)
// })

// self.addEventListener('activate', event => {
//   console.log('activate')
// })

// Cache libraries under cdn-cach name
workbox.routing.registerRoute(
  new RegExp('https:.*min\.(css|js)'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'cdn-cach'
  })
)

// Cache for the service API
workbox.routing.registerRoute(
  new RegExp('http://.*:4567.*\.json'),
  workbox.strategies.networkFirst()
)

// ERROR handling when POST or DELETE fails in an Offline PWA
self.addEventListener('fetch', event => {
  if(event.request.method === "POST" || event.request.method === "DELETE") {
    event.respondWith(
      fetch(event.request).catch(err => {
        return new Response(
          JSON.stringify({ error: "This action disabled while app is offline" }), {
            headers: { 'Content-Type': 'application/json' }
          }
        )
      })
    )
  }
})

workbox.precaching.precacheAndRoute(self.__precacheManifest || [])

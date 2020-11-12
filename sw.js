// const CACHE_NAME = "bola_mania_v1";
// const urlsToCache = [
//   "/",
//   "/nav.html",
//   "/manifest.json",
//   "/icon.png",
//   "/index.html",
//   "/team-detail.html",
//   "/pages/home.html",
//   "/pages/saved-team.html",
//   "/pages/team.html",
//   "/js/api.js",
//   "/js/bootstrap.min.js",
//   "/js/materialize.min.js",
//   "/js/sweetalert.min.js",
//   "/js/nav.js",
//   "/js/db.js",
//   "/js/idb.js",
//   "/css/bootstrap.min.css",
//   "/css/materialize.min.css",
//   "/css/style.css",
//   "img/jumbotron.jpeg",
//   "img/logo.png",
//   "img/stadium_2.jpg",
//   "img/stadium_3.jpg",
//   "img/stadium.jpg",
//   "img/logo_2.png",
// ];

// // menginstall cache biar berkas tersimpan didalam cache storage
// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => {
//       return cache.addAll(urlsToCache);
//     })
//   );
// });

// menggunakan asset dari cache
// self.addEventListener("fetch", (e) => {
//   const base_url = "https://api.football-data.org/v2/";

//   if (e.request.url.indexOf(base_url) > -1) {
//     e.respondWith(
//       caches.open(CACHE_NAME).then((cache) => {
//         return fetch(e.request).then((response) => {
//           cache.put(e.request.url, response.clone());
//           return response;
//         });
//       })
//     );
//   } else {
//     e.respondWith(
//       caches.match(e.request, { ignoreSearch: true }).then(function (response) {
//         return response || fetch(e.request);
//       })
//     );
//   }
// });

// menghapus cache lama agar tidak menumpuk
// self.addEventListener("active", (e) => {
//   e.waitUntil(
//     caches.keys().then((cacheNames) => {
//       return Promise.all(
//         cacheNames.map((cacheName) => {
//           if (cacheName != CACHE_NAME) {
//             console.log("ServiceWorker: cache " + cacheName + " dihapus");
//             return caches.delete(cacheName);
//           }
//         })
//       );
//     })
//   );
// });

// push notification
self.addEventListener("push", (e) => {
  let body;
  if (e.data) {
    body = e.data.text();
  } else {
    body = "Push message no payload";
  }
  const options = {
    body: body,
    icon: "img/logo.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };
  e.waitUntil(self.registration.showNotification("Push Notification", options));
});

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js"
);

if (workbox) console.log(`Workbox berhasil dimuat`);
else console.log(`Workbox gagal dimuat`);

// Prechaching App Shell
workbox.precaching.precacheAndRoute([
  { url: "./sw.js", revision: "1" },
  { url: "/index.html", revision: "1" },
  { url: "/nav.html", revision: "1" },
  { url: "/css/materialize.min.css", revision: "1" },
  { url: "/js/materialize.min.js", revision: "1" },
  { url: "/manifest.json", revision: "1" },
  { url: "/icon.png", revision: "1" },
  { url: "/team-detail.html", revision: "1" },
  { url: "/pages/home.html", revision: "1" },
  { url: "/pages/saved-team.html", revision: "1" },
  { url: "/pages/team.html", revision: "1" },
  { url: "/js/api.js", revision: "1" },
  { url: "/js/bootstrap.min.js", revision: "1" },
  { url: "/js/sweetalert.min.js", revision: "1" },
  { url: "/js/nav.js", revision: "1" },
  { url: "/js/db.js", revision: "1" },
  { url: "/js/idb.js", revision: "1" },
  { url: "/css/bootstrap.min.css", revision: "1" },
  { url: "/css/style.css", revision: "1" },
  { url: "/img/jumbotron.jpeg", revision: "1" },
  { url: "/img/logo.png", revision: "1" },
  { url: "/img/stadium_2.jpg", revision: "1" },
  { url: "/img/stadium_2.jpg", revision: "1" },
  { url: "/img/stadium.jpg", revision: "1" },
  { url: "/img/logo_2.png", revision: "1" },
  { url: "/push.js", revision: "1" },
  {
    url:
      "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js",
    revision: "1",
  },
  {
    url: "https://code.jquery.com/jquery-3.2.1.slim.min.js",
    revision: "1",
  },
  {
    url: "https://unpkg.com/snarkdown@1.0.2/dist/snarkdown.umd.js",
    revision: "1",
  },
]);

// Caching Halaman
workbox.routing.registerRoute(
  new RegExp("/pages/"),
  workbox.strategies.staleWhileRevalidate({
    cacheName: "pages",
  })
);

workbox.routing.registerRoute(
  new RegExp("https://api.football-data.org/v2/"),
  workbox.strategies.staleWhileRevalidate({
    cacheName: "football-api",
  })
);

workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.cacheFirst({
    cacheName: "images",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
      }),
    ],
  })
);

workbox.routing.registerRoute(
  /.*(?:googleapis|gstatic)\.com/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: "google-fonts-stylesheets",
  })
);

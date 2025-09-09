const CACHE_NAME = "resep-cache-v1";
const urlsToCache = [
  "/Tes-1-AMBW-C14220188-Charissa-Engrasia-C/",
  "/Tes-1-AMBW-C14220188-Charissa-Engrasia-C/index.html",
  "/Tes-1-AMBW-C14220188-Charissa-Engrasia-C/style.css",
  "/Tes-1-AMBW-C14220188-Charissa-Engrasia-C/app.js",
  "/Tes-1-AMBW-C14220188-Charissa-Engrasia-C/images/resep.jpg",
  "/Tes-1-AMBW-C14220188-Charissa-Engrasia-C/icons/icon-192x192.png",
  "/Tes-1-AMBW-C14220188-Charissa-Engrasia-C/icons/icon-512x512.png",
];

// Event 'install' untuk membuat cache.
self.addEventListener("install", (event) => {
  console.log("Service Worker: Menginstal...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Pre-caching app shell.");
      return cache.addAll(urlsToCache);
    })
  );
});

// Event 'activate' untuk Membersihkan cache lama.
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Aktif.");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Service Worker: Menghapus cache lama:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Event 'fetch' untuk mengintersep permintaan jaringan.
self.addEventListener("fetch", (event) => {
  console.log("Service Worker: Mengambil resource:", event.request.url);

  //Cache First
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // 2. Cache ditemukan maka kembalikan respons dari cache.
        if (response) {
          console.log("Menyajikan dari cache:", event.request.url);
          return response;
        }

        // 3. Cache tidak ditemukan maka lanjutkan ke jaringan.
        console.log("Mengambil dari jaringan:", event.request.url);
        return fetch(event.request).then((networkResponse) => {
          // Simpan hasil fetch ke cache biar bisa dipakai offline nanti
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
      .catch((error) => {
        // 4. Jika offline
        console.log("Gagal mengambil dari jaringan.");
      })
  );
});

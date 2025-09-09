// Cek apakah browser mendukung Service Worker
if ('serviceWorker' in navigator) {
  // Daftarkan Service Worker saat window selesai dimuat
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js")
    .then((registration) => {
        console.log(
          "Service Worker berhasil didaftarkan dengan scope:",
          registration.scope
        );
      })
      .catch((error) => {
        console.log("Pendaftaran Service Worker gagal:", error);
      });
  });
}
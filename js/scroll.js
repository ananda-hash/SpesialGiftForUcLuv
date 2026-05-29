/**
 * ==============================================================================
 * SMOOTH SCROLL ENGINE (SCROLL.JS)
 * Menangani kalkulasi pergerakan vertikal yang halus (Smooth Easing).
 * Proyek: Ultimate Romantic Gift - Riski Ananda
 * ==============================================================================
 */

/**
 * Fungsi utama untuk melakukan scroll vertikal secara halus.
 * @param {Element|Number} destination - Elemen tujuan atau posisi pixel.
 * @param {Number} duration - Durasi animasi dalam milidetik.
 * @param {String} easing - Tipe kurva kecepatan (linear, easeIn, easeOut, dll).
 * @param {Function} callback - Fungsi yang dijalankan setelah scroll selesai.
 */
function verticalScroll(
  destination,
  duration = 500,
  easing = "easeInOutCubic",
  callback,
) {
  // 1. Daftar Kurva Kecepatan (Easings)
  // Membuat pergerakan terasa alami (lambat di awal/akhir).
  const easings = {
    linear(t) {
      return t;
    },
    easeInQuad(t) {
      return t * t;
    },
    easeOutQuad(t) {
      return t * (2 - t);
    },
    easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    easeInCubic(t) {
      return t * t * t;
    },
    easeOutCubic(t) {
      return --t * t * t + 1;
    },
    easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
  };

  const start = window.pageYOffset;
  const startTime =
    "now" in window.performance ? performance.now() : new Date().getTime();

  // 2. Kalkulasi Tinggi Dokumen & Window
  const documentHeight = Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight,
  );
  const windowHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.getElementsByTagName("body")[0].clientHeight;

  // Tentukan posisi tujuan dalam pixel
  const destinationOffset =
    typeof destination === "number" ? destination : destination.offsetTop;
  const destinationOffsetToScroll = Math.round(
    documentHeight - destinationOffset < windowHeight
      ? documentHeight - windowHeight
      : destinationOffset,
  );

  // 3. Fallback jika browser tidak mendukung RequestAnimationFrame
  if ("requestAnimationFrame" in window === false) {
    window.scroll(0, destinationOffsetToScroll);
    if (callback) callback();
    return;
  }

  // 4. Loop Animasi
  function scroll() {
    const now =
      "now" in window.performance ? performance.now() : new Date().getTime();
    const time = Math.min(1, (now - startTime) / duration);
    const timeFunction = easings[easing](time);

    window.scroll(
      0,
      Math.ceil(timeFunction * (destinationOffsetToScroll - start) + start),
    );

    // Jika sudah sampai tujuan
    if (window.pageYOffset === destinationOffsetToScroll) {
      if (callback) callback();
      return;
    }

    requestAnimationFrame(scroll);
  }

  scroll();
}

/**
 * Melakukan scroll ke elemen berdasarkan ID secara halus.
 * Digunakan untuk link navigasi internal.
 */
function scrollToId(id) {
  const element = document.querySelector(id);
  if (element) {
    verticalScroll(element, 800, "easeInOutCubic");
  }
}

/**
 * ==============================================================================
 * DOC READY UTILITY (READY.JS)
 * Memastikan seluruh struktur HTML & CSS termuat 100% sebelum menjalankan logika.
 * Proyek: Ultimate Romantic Gift - Riski Ananda
 * ==============================================================================
 */

(function (funcName, baseObj) {
  // Nama fungsi publik default adalah docReady
  funcName = funcName || "docReady";
  baseObj = baseObj || window;

  var readyList = [];
  var readyFired = false;
  var readyEventHandlersInstalled = false;

  // Fungsi utama yang akan dipanggil saat dokumen siap
  function ready() {
    if (!readyFired) {
      readyFired = true;
      for (var i = 0; i < readyList.length; i++) {
        // Eksekusi antrian callback yang terdaftar
        readyList[i].fn.call(window, readyList[i].ctx);
      }
      readyList = [];
    }
  }

  function readyStateChange() {
    if (document.readyState === "complete") {
      ready();
    }
  }

  // Fungsi publik untuk mendaftarkan callback
  baseObj[funcName] = function (callback, context) {
    if (typeof callback !== "function") {
      throw new TypeError("Callback untuk docReady(fn) harus berupa fungsi.");
    }

    // Jika dokumen sudah siap, jalankan callback segera
    if (readyFired) {
      setTimeout(function () {
        callback(context);
      }, 1);
      return;
    } else {
      // Jika belum, masukkan ke dalam antrian
      readyList.push({
        fn: callback,
        ctx: context,
      });
    }

    // Pasang event listener jika belum terpasang
    if (document.readyState === "complete") {
      setTimeout(ready, 1);
    } else if (!readyEventHandlersInstalled) {
      if (document.addEventListener) {
        // Standar browser modern
        document.addEventListener("DOMContentLoaded", ready, false);
        window.addEventListener("load", ready, false);
      } else {
        // Kompatibilitas IE lawas
        document.attachEvent("onreadystatechange", readyStateChange);
        window.attachEvent("onload", ready);
      }
      readyEventHandlersInstalled = true;
    }
  };
})("docReady", window);

/**
 * Penggunaan di scripts.js nantinya:
 * docReady(function() {
 * // Logika inisialisasi web romantis Anda di sini
 * });
 */

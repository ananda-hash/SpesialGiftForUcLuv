/**
 * ==============================================================================
 * SCROLLPAGE.JS - THE ULTIMATE TRANSFORM ENGINE (ANTI-STUCK)
 * Proyek: Hadiah Spesial Riski Ananda
 * ==============================================================================
 */

class ScrollPage {
  constructor(selector, options = {}) {
    this.container = document.querySelector(selector);
    this.sections = this.container.querySelectorAll("section");
    this.totalSections = this.sections.length;
    this.index = 0;
    this.isScrolling = false;
    this.menuItems = document.querySelectorAll(options.menu + " li");
    this.duration = options.animationDuration || 800;

    // Setup CSS Transisi untuk Container
    this.container.style.transition = `transform ${this.duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`;

    // Paksa body agar tidak bisa discroll manual
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    this.initEvents();
  }

  initEvents() {
    const _this = this;

    // 1. Mouse Wheel
    window.addEventListener(
      "wheel",
      (e) => {
        if (!window.envOpened || _this.isScrolling) return;
        e.preventDefault(); // Cegah scroll bawaan browser

        if (e.deltaY > 0) _this.next();
        else _this.prev();
      },
      { passive: false },
    );

    // 2. Keyboard
    window.addEventListener("keydown", (e) => {
      if (!window.envOpened || _this.isScrolling) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") _this.next();
      if (e.key === "ArrowUp" || e.key === "PageUp") _this.prev();
    });

    // 3. Touch Gestures (Untuk HP)
    let touchStartY = 0;
    window.addEventListener(
      "touchstart",
      (e) => {
        touchStartY = e.touches[0].clientY;
      },
      { passive: true },
    );

    window.addEventListener(
      "touchend",
      (e) => {
        if (!window.envOpened || _this.isScrolling) return;
        let touchEndY = e.changedTouches[0].clientY;
        let diff = touchStartY - touchEndY;

        if (Math.abs(diff) > 50) {
          // Jika gesekan lebih dari 50px
          if (diff > 0) _this.next();
          else _this.prev();
        }
      },
      { passive: true },
    );

    // 4. Klik Menu
    if (_this.menuItems.length > 0) {
      _this.menuItems.forEach((item, idx) => {
        item.addEventListener("click", (e) => {
          e.preventDefault();
          if (window.envOpened) _this.moveTo(idx);
        });
      });
    }
  }

  next() {
    if (this.index < this.totalSections - 1) this.moveTo(this.index + 1);
  }

  prev() {
    if (this.index > 0) this.moveTo(this.index - 1);
  }

  moveTo(newIndex) {
    if (this.isScrolling || newIndex === this.index) return;

    this.isScrolling = true;
    const prevIndex = this.index;
    this.index = newIndex;

    // KUNCI ANTI-STUCK: Pindahkan kontainer secara fisik ke atas (Minus height)
    this.container.style.transform = `translate3d(0, -${this.index * 100}vh, 0)`;

    // Panggil event onScroll untuk animasi elemen di scripts.js
    if (this.onScrollCallback) {
      this.onScrollCallback({
        prevIndex: prevIndex,
        nextIndex: this.index,
        nextPageName: this.sections[this.index].id,
      });
    }

    // Sinkronisasi Menu Aktif
    this.updateMenu();

    // Lepaskan kunci setelah animasi CSS selesai
    setTimeout(() => {
      this.isScrolling = false;
    }, this.duration);
  }

  updateMenu() {
    this.sections.forEach((s) => s.classList.remove("active"));
    this.sections[this.index].classList.add("active");

    if (this.menuItems.length > 0) {
      this.menuItems.forEach((m) => m.classList.remove("active"));
      if (this.menuItems[this.index]) {
        this.menuItems[this.index].classList.add("active");
      }
    }
  }

  onScroll(callback) {
    this.onScrollCallback = callback;
  }
}

/**
 * ==============================================================================
 * THE ULTIMATE ROMANTIC JAVASCRIPT (FINAL - MASTERPIECE VERSION)
 * Arsitektur: Event-Driven, Particle System, Sequential Typewriter, & Heart Burst
 * Proyek: Hadiah Spesial Riski Ananda
 * ==============================================================================
 */

// Global State
window.envOpened = false;
let isMusicPlaying = false;

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. INISIALISASI SCROLLPAGE ---
  const scrollContainer = document.querySelector("#full-page");
  if (!scrollContainer) return;

  const scrollPage = new ScrollPage("#full-page", {
    menu: "#menu",
    animationDuration: 800,
  });

  scrollPage.onScroll((e) => {
    if (!e || !e.nextPageName) return;
    const pageElement = document.querySelector("#" + e.nextPageName);
    if (!pageElement) return;

    const bgAnim = pageElement.querySelector(".bg-animasi");
    if (bgAnim) bgAnim.style.display = "block";

    setTimeout(() => {
      initTypingAnimation("#" + e.nextPageName + " [animasi-tulisan]", 40);
    }, 400);
  });

  // --- 2. LOGIKA INTERAKTIF AMPLOP (OPENING SCREEN) ---
  const envelopeWrapper = document.getElementById("envelope-wrapper");
  const envelope = document.getElementById("love-envelope");
  const bgm = document.getElementById("bgm");
  const musicBtn = document.getElementById("playMusic");

  window.openEnvelope = function () {
    if (window.envOpened) return;

    window.envOpened = true;

    if (envelope) envelope.classList.add("open");

    if (bgm) {
      bgm
        .play()
        .then(() => {
          isMusicPlaying = true;
          if (musicBtn) {
            musicBtn.classList.add("pulse-glow");
            musicBtn.setAttribute("data-state", "playing");
          }
        })
        .catch((err) => console.log("Menunggu interaksi user untuk musik."));
    }

    setTimeout(() => {
      if (envelopeWrapper) envelopeWrapper.style.opacity = "0";
      setTimeout(() => {
        if (envelopeWrapper) envelopeWrapper.style.display = "none";

        window.dispatchEvent(new Event("resize"));

        typeHeroTitle();
        initTypingAnimation("#page1 [animasi-tulisan]", 40);
      }, 1000);
    }, 1800);
  };

  if (envelopeWrapper) {
    envelopeWrapper.addEventListener("click", window.openEnvelope);
  }

  // --- 3. LOGIKA PEMUTAR MUSIK ---
  window.toggleMusic = function () {
    if (!bgm || !musicBtn) return;
    if (isMusicPlaying) {
      bgm.pause();
      musicBtn.classList.remove("pulse-glow");
      musicBtn.setAttribute("data-state", "paused");
    } else {
      bgm.play();
      musicBtn.classList.add("pulse-glow");
      musicBtn.setAttribute("data-state", "playing");
    }
    isMusicPlaying = !isMusicPlaying;
  };

  if (musicBtn) {
    musicBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      window.toggleMusic();
    });
  }

  // --- 4. CANVAS PARTICLE SYSTEM (HUJAN BUNGA) ---
  const canvas = document.getElementById("magicCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let particlesArray = [];
    const colors = ["#ffb6c1", "#ffc0cb", "#ff69b4", "#fff0f5", "#ff9db0"];

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    class Particle {
      constructor() {
        this.init();
      }
      init() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.size = Math.random() * 4 + 2;
        this.speedY = Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.angle = Math.random() * 360;
        this.spin = Math.random() * 0.05 - 0.025;
        this.opacity = Math.random() * 0.5 + 0.3;
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.angle += this.spin;
        if (this.y > canvas.height) {
          this.init();
          this.y = -10;
        }
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    function initParticles() {
      particlesArray = [];
      let density = (canvas.width * canvas.height) / 15000;
      for (let i = 0; i < density; i++) particlesArray.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesArray.forEach((p) => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    }

    window.addEventListener("resize", () => {
      resizeCanvas();
      initParticles();
    });

    resizeCanvas();
    initParticles();
    animate();
  }

  // --- 5. LOGIKA TAB FOLDER (GALLERY) ---
  const folderItems = document.querySelectorAll(".folder-item");
  const contentPanes = document.querySelectorAll(".gallery-content-pane");

  folderItems.forEach((item) => {
    item.addEventListener("click", function () {
      const target = this.getAttribute("data-target");
      if (!target) return;

      folderItems.forEach((i) => i.classList.remove("selected"));
      this.classList.add("selected");

      contentPanes.forEach((pane) => pane.classList.remove("active"));
      const targetPane = document.querySelector(target);
      if (targetPane) targetPane.classList.add("active");
    });
  });

  // --- 6. MODAL LIGHTBOX (ZOOM FOTO) ---
  const modal = document.getElementById("imageModal");
  const expandedImg = document.getElementById("expandedImg");
  const imageCaption = document.getElementById("imageCaption");
  const closeBtn = document.querySelector(".lightbox-close-btn");

  document.querySelectorAll(".gallery-img").forEach((img) => {
    img.addEventListener("click", function () {
      if (modal && expandedImg) {
        modal.style.display = "block";
        expandedImg.src = this.src;
        if (imageCaption)
          imageCaption.innerHTML = this.getAttribute("data-caption") || "";
      }
    });
  });

  if (closeBtn) closeBtn.onclick = () => (modal.style.display = "none");
  window.addEventListener("click", (e) => {
    if (e.target == modal) modal.style.display = "none";
  });

  // --- 7. MOUSE TRAIL (JEJAK KURSOR) ---
  document.addEventListener("mousemove", (e) => {
    if (!window.envOpened || Math.random() > 0.15) return;

    const trail = document.createElement("div");
    trail.innerHTML = ["❤️", "🌸", "✨", "💖"][Math.floor(Math.random() * 4)];
    trail.style.position = "fixed";
    trail.style.left = e.clientX + "px";
    trail.style.top = e.clientY + "px";
    trail.style.pointerEvents = "none";
    trail.style.zIndex = "1000";
    trail.style.fontSize = Math.random() * 10 + 10 + "px";
    trail.style.transition = "all 1s ease-out";
    document.body.appendChild(trail);

    setTimeout(() => {
      trail.style.transform = `translateY(-40px) scale(0) rotate(${Math.random() * 360}deg)`;
      trail.style.opacity = "0";
      setTimeout(() => trail.remove(), 1000);
    }, 10);
  });

  // --- 8. MAGIC CLICK ANIMATION (EFEK LEDAKAN ROMANTIS) ---
  document.addEventListener("click", (e) => {
    // Abaikan jika yang diklik adalah tombol penting
    if (
      !window.envOpened ||
      e.target.closest("#playMusic") ||
      e.target.closest("#envelope-wrapper") ||
      e.target.closest(".lightbox-modal") ||
      e.target.closest(".folder-item") ||
      e.target.closest("a")
    )
      return;

    const clickX = e.clientX;
    const clickY = e.clientY;

    // 8a. Efek Ripple (Gelombang Lingkaran)
    const ripple = document.createElement("div");
    ripple.style.position = "fixed";
    ripple.style.left = clickX + "px";
    ripple.style.top = clickY + "px";
    ripple.style.width = "10px";
    ripple.style.height = "10px";
    ripple.style.border = "2px solid #ff8fb3";
    ripple.style.borderRadius = "50%";
    ripple.style.transform = "translate(-50%, -50%) scale(1)";
    ripple.style.opacity = "0.8";
    ripple.style.pointerEvents = "none";
    ripple.style.zIndex = "9998";
    ripple.style.transition = "all 0.6s ease-out";
    document.body.appendChild(ripple);

    setTimeout(() => {
      ripple.style.transform = "translate(-50%, -50%) scale(8)";
      ripple.style.opacity = "0";
      setTimeout(() => ripple.remove(), 600);
    }, 10);

    // 8b. Efek Ledakan Hati (Heart Burst)
    const symbols = ["❤️", "💖", "✨", "🌸", "💕", "🥰"];
    const particleCount = 6; // Jumlah partikel per klik

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
      particle.style.position = "fixed";
      particle.style.left = clickX + "px";
      particle.style.top = clickY + "px";
      particle.style.pointerEvents = "none";
      particle.style.zIndex = "9999";
      particle.style.fontSize = Math.random() * 15 + 15 + "px";
      particle.style.transition = "all 0.8s cubic-bezier(0.25, 1, 0.5, 1)";
      document.body.appendChild(particle);

      // Kalkulasi trigonometri untuk melontarkan ikon melingkar
      const angle = i * (360 / particleCount) + (Math.random() * 30 - 15);
      const radian = angle * (Math.PI / 180);
      const distance = Math.random() * 60 + 40; // Terlontar sejauh 40px - 100px
      const tx = Math.cos(radian) * distance;
      const ty = Math.sin(radian) * distance - 20;

      setTimeout(() => {
        particle.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0) rotate(${Math.random() * 180 - 90}deg)`;
        particle.style.opacity = "0";
        setTimeout(() => particle.remove(), 800);
      }, 10);
    }
  });
});

/**
 * ==============================================================================
 * UTILITY FUNCTIONS
 * ==============================================================================
 */

// Efek Ketik Manual untuk Judul Hero Pertama
function typeHeroTitle() {
  const text = "Selamat Ulang Tahun, Semestaku";
  const target = document.getElementById("typing-hero");
  if (!target) return;

  target.innerHTML = "";
  let charIndex = 0;

  function type() {
    if (charIndex < text.length) {
      target.innerHTML += text.charAt(charIndex);
      charIndex++;
      setTimeout(type, 120);
    }
  }
  type();
}

// Efek Ketik Elegan, Rapi, & Berurutan (Sequential Typewriter)
function initTypingAnimation(selector, speed = 40) {
  const elements = document.querySelectorAll(selector);
  if (elements.length === 0) return;

  let currentElementIndex = 0;

  function typeNextElement() {
    if (currentElementIndex >= elements.length) return;

    const el = elements[currentElementIndex];

    if (el.classList.contains("animated-done")) {
      currentElementIndex++;
      typeNextElement();
      return;
    }

    const originalText = el.getAttribute("animasi-tulisan");
    if (!originalText) {
      currentElementIndex++;
      typeNextElement();
      return;
    }

    el.innerHTML = "";
    el.classList.add("is-typing");

    let charIndex = 0;

    function typeChar() {
      if (charIndex < originalText.length) {
        el.innerHTML += originalText.charAt(charIndex);
        charIndex++;
        setTimeout(typeChar, speed);
      } else {
        el.classList.remove("is-typing");
        el.classList.add("animated-done");

        currentElementIndex++;
        // Jeda 600ms sebelum lanjut ke baris berikutnya
        setTimeout(typeNextElement, 600);
      }
    }

    typeChar();
  }

  // Picu pengetikan baris pertama
  typeNextElement();
}

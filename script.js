const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");

function setHeaderState() {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  header.classList.toggle("is-open", !isOpen);
  nav.classList.toggle("is-open", !isOpen);
});

nav.addEventListener("click", (event) => {
  if (event.target.tagName !== "A") {
    return;
  }

  menuToggle.setAttribute("aria-expanded", "false");
  header.classList.remove("is-open");
  nav.classList.remove("is-open");
});

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

/* ── Stats count-up ── */
(function () {
  const statEls = document.querySelectorAll(".difference-stats strong");
  if (!statEls.length || !("IntersectionObserver" in window)) return;

  function countUp(el) {
    const raw = el.textContent.trim();
    const match = raw.match(/^(\d+)(.*)/);
    if (!match) return; // non-numeric like "1:6" — leave as-is
    const target = parseInt(match[1], 10);
    const suffix = match[2];
    const duration = 1100;
    const start = performance.now();
    (function step(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      el.textContent = Math.round(eased * target) + suffix;
      if (t < 1) requestAnimationFrame(step);
    }(start));
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      // Only count up when the parent stat cell becomes visible
      countUp(entry.target);
      statsObserver.unobserve(entry.target);
    });
  }, { threshold: 0.6 });

  statEls.forEach((el) => statsObserver.observe(el));
}());

/* ── Prevent duplicate form submissions ── */
(function () {
  const form = document.querySelector("form[data-netlify]");
  if (!form) return;
  form.addEventListener("submit", function () {
    const btn = form.querySelector("[type=submit]");
    if (!btn) return;
    btn.disabled = true;
    btn.textContent = "Sending…";
  });
}());

/* ── Force autoplay on hero videos (handles browsers that need an explicit play() call) ── */
(function () {
  function tryPlay(video) {
    if (!video || !video.paused) return;
    const p = video.play();
    if (p && typeof p.catch === "function") p.catch(function () {});
  }
  document.querySelectorAll("video[autoplay]").forEach(function (v) {
    if (v.readyState >= 2) { tryPlay(v); return; }
    v.addEventListener("canplay", function () { tryPlay(v); }, { once: true });
  });
}());

/* Customer portal chat mock: plays once when it scrolls into view. */
document.querySelectorAll("[data-portal-chat]").forEach((phone) => {
  const msgs = Array.from(phone.querySelectorAll("[data-msg]"));
  const typing = phone.querySelector("[data-typing]");
  const draft = phone.querySelector("[data-draft]");
  const caret = phone.querySelector("[data-caret]");
  const send = phone.querySelector(".portal-phone-compose b");
  const placeholder = draft.textContent;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced || !("IntersectionObserver" in window)) {
    phone.classList.add("is-static");
    msgs[msgs.length - 1].classList.add("is-seen");
    return;
  }

  const timers = [];
  const at = (ms, fn) => timers.push(window.setTimeout(fn, ms));
  const show = (i) => msgs[i].classList.add("is-in");

  const play = () => {
    at(300, () => show(0));
    at(1400, () => show(1));
    at(2300, () => typing.classList.add("is-in"));
    at(3900, () => { typing.classList.remove("is-in"); show(2); });
    // The owner types the last reply into the composer, then sends it.
    const last = msgs[msgs.length - 1];
    const reply = last.querySelector("p").textContent;
    let t = 5000;
    at(t - 100, () => { draft.textContent = ""; draft.classList.add("is-typing"); caret.classList.add("is-on"); });
    for (let i = 1; i <= reply.length; i += 1) {
      const text = reply.slice(0, i);
      at(t, () => { draft.textContent = text; });
      t += 45;
    }
    at(t + 500, () => {
      send.classList.add("is-live");
      draft.textContent = placeholder;
      draft.classList.remove("is-typing");
      caret.classList.remove("is-on");
      show(msgs.length - 1);
    });
    at(t + 800, () => send.classList.remove("is-live"));
    at(t + 2000, () => last.classList.add("is-seen"));
  };

  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      io.disconnect();
      play();
    }
  }, { threshold: 0.4 });
  io.observe(phone);
});

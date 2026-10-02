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

/* Portal device: tappable tabs, copy that follows the tab, and a slow
   auto-cycle until someone picks a screen themselves. */
document.querySelectorAll("[data-showcase]").forEach((box) => {
  const device = box.querySelector("[data-device]");
  const tabs = Array.from(device.querySelectorAll("[data-tab]"));
  const panes = Array.from(device.querySelectorAll("[data-pane]"));
  const copies = Array.from(box.querySelectorAll("[data-copy]"));
  const pills = Array.from(box.querySelectorAll("[data-pick]"));
  const order = pills.length ? pills.map((p) => p.dataset.pick) : tabs.map((t) => t.dataset.tab);
  const lock = device.querySelector('[data-pane="alerts"]');
  let seen = false;
  const replay = () => {
    if (!lock || current !== "alerts" || !seen) return;
    lock.classList.remove("play");
    void lock.offsetWidth;
    lock.classList.add("play");
  };
  let current = device.dataset.start || order[0];
  let picked = false;
  let timer = null;

  const show = (key) => {
    current = key;
    tabs.forEach((t) => t.classList.toggle("is-on", t.dataset.tab === key));
    panes.forEach((p) => p.classList.toggle("is-on", p.dataset.pane === key));
    copies.forEach((c) => c.classList.toggle("is-on", c.dataset.copy === key));
    pills.forEach((p) => p.classList.toggle("is-on", p.dataset.pick === key));
    device.classList.toggle("is-lock", key === "alerts");
    replay();
  };

  const pick = (key) => {
    picked = true;
    if (timer) { window.clearTimeout(timer); timer = null; }
    show(key);
  };

  tabs.forEach((t) => t.addEventListener("click", () => pick(t.dataset.tab)));
  pills.forEach((p) => p.addEventListener("click", () => pick(p.dataset.pick)));
  show(current);

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || !("IntersectionObserver" in window)) return;

  // The chat thread needs time to play before the cycle moves on.
  const schedule = () => {
    timer = window.setTimeout(() => {
      show(order[(order.indexOf(current) + 1) % order.length]);
      schedule();
    }, current === "chat" ? 12000 : current === "alerts" ? 10500 : 4500);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        if (!seen) { seen = true; replay(); }
        if (!timer && !picked) schedule();
      } else if (timer) {
        window.clearTimeout(timer);
        timer = null;
      }
    });
  }, { threshold: 0.35 });
  io.observe(device);
});

/* FAQ accordions: opening one question closes the others in the same list. */
document.querySelectorAll(".faq-list").forEach((list) => {
  list.addEventListener("toggle", (event) => {
    const item = event.target;
    if (!(item instanceof HTMLDetailsElement) || !item.open) return;
    list.querySelectorAll("details[open]").forEach((other) => { if (other !== item) other.open = false; });
  }, true);
});

// Cookie choice, enquiry tracking and where each enquiry came from.
const ADS_ID = "AW-16909987992";
const ADS_LABELS = { enquiry: "2rexCP-h_cYaEJjhp_8-", phone: "Y2m7COLvto0dEJjhp_8-", whatsapp: "kQLMCLm_uY0dEJjhp_8-" };
const SOURCE_KEYS = ["gclid", "gbraid", "wbraid", "fbclid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
const cookieNotice = document.querySelector("[data-cookie-notice]");

function readStore(store, key) {
  try { return window[store].getItem(key); } catch (error) { return null; }
}

function writeStore(store, key, value) {
  try { window[store].setItem(key, value); } catch (error) { /* storage blocked */ }
}

function cookiesAccepted() {
  return readStore("localStorage", "ddc-consent") === "granted";
}

function rememberSource() {
  if (readStore("sessionStorage", "ddc-source")) return;
  const params = new URLSearchParams(window.location.search);
  const source = { landing_page: window.location.pathname, referrer: document.referrer };
  SOURCE_KEYS.forEach((key) => {
    if (params.get(key)) source[key] = params.get(key);
  });
  writeStore("sessionStorage", "ddc-source", JSON.stringify(source));
}

function setCookieChoice(choice) {
  writeStore("localStorage", "ddc-consent", choice);
  const state = choice === "granted" ? "granted" : "denied";
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", { ad_storage: state, analytics_storage: state, ad_user_data: state, ad_personalization: state });
  }
  if (choice === "granted") rememberSource();
  if (cookieNotice) cookieNotice.hidden = true;
}

if (cookieNotice && !readStore("localStorage", "ddc-consent")) cookieNotice.hidden = false;
document.querySelectorAll("[data-consent]").forEach((button) => {
  button.addEventListener("click", () => setCookieChoice(button.dataset.consent));
});
document.querySelectorAll("[data-cookie-settings]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    if (cookieNotice) cookieNotice.hidden = false;
  });
});
if (cookiesAccepted()) rememberSource();

function sendConversion(kind) {
  if (typeof window.gtag !== "function") return;
  window.gtag("event", "conversion", { send_to: `${ADS_ID}/${ADS_LABELS[kind]}` });
}

document.addEventListener("click", (event) => {
  const link = event.target.closest('a[href^="tel:"], a[href*="wa.me/"]');
  if (!link) return;
  const kind = link.getAttribute("href").startsWith("tel:") ? "phone" : "whatsapp";
  sendConversion(kind);
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: `${kind}_tap` });
});

function ukPhone(value) {
  const digits = (value || "").replace(/[^\d+]/g, "");
  if (!digits) return "";
  if (digits.startsWith("+")) return digits;
  return digits.startsWith("0") ? `+44${digits.slice(1)}` : `+44${digits}`;
}

const enquiryForm = document.querySelector('form[name="enquiry"]');
if (enquiryForm) {
  let source = {};
  try { source = JSON.parse(readStore("sessionStorage", "ddc-source") || "{}"); } catch (error) { source = {}; }
  const params = new URLSearchParams(window.location.search);
  SOURCE_KEYS.forEach((key) => {
    if (!source[key] && params.get(key)) source[key] = params.get(key);
  });
  if (!source.landing_page) source.landing_page = window.location.pathname;
  if (!source.referrer) source.referrer = document.referrer;
  Object.entries(source).forEach(([key, value]) => {
    const field = enquiryForm.querySelector(`input[name="${key}"]`);
    if (field && value) field.value = value;
  });
  enquiryForm.addEventListener("submit", () => {
    if (!cookiesAccepted()) return;
    writeStore("sessionStorage", "ddc-enquiry", JSON.stringify({
      email: enquiryForm.email.value.trim().toLowerCase(),
      phone_number: ukPhone(enquiryForm.phone.value),
    }));
  });
}

if (document.body.classList.contains("page-thank-you")) {
  let details = null;
  try { details = JSON.parse(readStore("sessionStorage", "ddc-enquiry") || "null"); } catch (error) { details = null; }
  if (details && cookiesAccepted() && typeof window.gtag === "function") {
    window.gtag("set", "user_data", details);
    sendConversion("enquiry");
  }
  try { window.sessionStorage.removeItem("ddc-enquiry"); } catch (error) { /* storage blocked */ }
}

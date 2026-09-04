const CONFIG = {
  name: "Shrek Symbol",
  symbol: "$SHREK",
  chain: "Robinhood Chain",
  contractAddress: "",
  supply: "1B",
  buyTax: "0%",
  sellTax: "0%",
  lpBadge: "Burned",
  ownershipBadge: "Renounced",
  launchPlatform: "Pons",
  links: {
    dex: "https://ponsfamily.com",
    cex: "https://www.coinbase.com/",
    chart: "#chart",
    etherscan: "#",
    holders: "#",
    launchPlatform: "https://ponsfamily.com",
    x: "https://x.com/ShrekRhChain",
    tg: "https://t.me/shrekrh",
  },
  tokenSplit: {
    liquidity: 80,
    community: 15,
    marketing: 5,
  },
};

function $(sel) {
  return document.querySelector(sel);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setHref(id, value) {
  const el = document.getElementById(id);
  if (el) el.href = value;
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }
}

let toastTimer = null;
function toast(msg) {
  const el = $("#toast");
  const text = $("#toast-text");
  if (!el || !text) return;
  text.textContent = msg;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.hidden = true;
  }, 1700);
}

function initCopyButtons() {
  const ids = [
    "copy-ca-btn",
    "copy-ca-btn-mobile",
    "copy-ca-btn-hero",
    "copy-ca-inline",
    "copy-ca-tokenomics",
  ];

  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el) continue;
    el.addEventListener("click", async () => {
      const ca = CONFIG.contractAddress?.trim();
      if (!ca) {
        toast("CA coming soon");
        return;
      }
      const ok = await copyText(ca);
      toast(ok ? "Copied contract address" : "Copy failed");
    });
  }
}

function initBurger() {
  const burger = $("#burger");
  const mobile = $("#mobile");
  if (!burger || !mobile) return;

  function close() {
    burger.setAttribute("aria-expanded", "false");
    mobile.hidden = true;
  }
  function open() {
    burger.setAttribute("aria-expanded", "true");
    mobile.hidden = false;
  }

  burger.addEventListener("click", () => {
    const expanded = burger.getAttribute("aria-expanded") === "true";
    expanded ? close() : open();
  });

  mobile.addEventListener("click", (e) => {
    const target = e.target;
    if (target && target.matches && target.matches("a[href^='#']")) close();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

function initSmoothScroll() {
  document.documentElement.style.scrollBehavior = "smooth";

  document.body.addEventListener("click", (e) => {
    const a = e.target.closest?.("a[href^='#']");
    if (!a) return;
    const href = a.getAttribute("href");
    if (!href || href === "#") return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.pushState(null, "", href);
  });
}

function initScrollTop() {
  const btn = $("#scroll-top");
  if (!btn) return;
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initScrollFx() {
  const bar = document.getElementById("scrollbar");
  let ticking = false;

  function update() {
    ticking = false;
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    const p = Math.min(1, Math.max(0, window.scrollY / max));
    doc.style.setProperty("--scroll", String(p));
    if (bar) bar.style.width = `${p * 100}%`;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", update, { passive: true });
}

function initBackgroundSwitch() {
  const isMobile = window.matchMedia?.("(max-width: 980px)")?.matches;
  if (isMobile) return;
  const fx = document.querySelector(".fx");
  const washA = document.getElementById("washA");
  const washB = document.getElementById("washB");
  if (!fx || !washA || !washB) return;

  const palettes = [
    `radial-gradient(900px 650px at 15% 10%, rgba(204,255,0,.16), transparent 60%),
     radial-gradient(900px 650px at 85% 20%, rgba(255,255,255,.06), transparent 62%),
     radial-gradient(1000px 800px at 55% 95%, rgba(204,255,0,.08), transparent 65%)`,
    `radial-gradient(900px 650px at 20% 25%, rgba(255,255,255,.07), transparent 62%),
     radial-gradient(900px 650px at 85% 15%, rgba(204,255,0,.14), transparent 60%),
     radial-gradient(1100px 800px at 60% 95%, rgba(204,255,0,.06), transparent 66%)`,
    `radial-gradient(900px 650px at 20% 10%, rgba(204,255,0,.12), transparent 62%),
     radial-gradient(900px 650px at 85% 30%, rgba(255,255,255,.05), transparent 60%),
     radial-gradient(1100px 800px at 60% 95%, rgba(204,255,0,.10), transparent 66%)`,
  ];

  let activeLayer = "a";
  let activePalette = -1;

  function setLayer(layer) {
    fx.setAttribute("data-wash", layer);
    activeLayer = layer;
  }

  function applyPalette(paletteIndex) {
    if (paletteIndex === activePalette) return;
    activePalette = paletteIndex;

    const nextLayer = activeLayer === "a" ? "b" : "a";
    const el = nextLayer === "a" ? washA : washB;
    el.style.background = palettes[paletteIndex % palettes.length];
    setLayer(nextLayer);
  }

  function computeSectionIndex() {
    const sections = Array.from(document.querySelectorAll("main > section[id]"));
    if (!sections.length) return 0;
    const mid = window.scrollY + window.innerHeight * 0.45;
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < sections.length; i++) {
      const s = sections[i];
      const top = s.offsetTop;
      const center = top + s.offsetHeight * 0.5;
      const d = Math.abs(center - mid);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    }
    return best;
  }

  let raf = 0;
  function onScroll() {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const idx = computeSectionIndex();
      applyPalette(idx);
    });
  }

  // seed both layers so the first fade is smooth
  washA.style.background = palettes[0];
  washB.style.background = palettes[1];
  fx.setAttribute("data-wash", "a");
  activePalette = 0;

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();
}

function initSectionTransitions() {
  const isMobile = window.matchMedia?.("(max-width: 980px)")?.matches;
  if (isMobile) return;
  const sections = Array.from(document.querySelectorAll("main > section"));
  if (!sections.length || !("IntersectionObserver" in window)) return;

  let active = null;
  const io = new IntersectionObserver(
    (entries) => {
      // pick the most visible intersecting section
      let best = null;
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        if (!best || e.intersectionRatio > best.intersectionRatio) best = e;
      }
      if (!best) return;

      const next = best.target;
      if (active === next) return;
      if (active) active.classList.remove("is-active");
      next.classList.add("is-active");
      active = next;
    },
    { threshold: [0.18, 0.28, 0.38, 0.5, 0.62] }
  );

  for (const s of sections) io.observe(s);
  sections[0]?.classList.add("is-active");
}

function initRevealOnScroll() {
  const els = document.querySelectorAll("[data-reveal]");
  if (!els.length || !("IntersectionObserver" in window)) {
    for (const el of els) el.classList.add("is-in");
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    },
    { threshold: 0.14 }
  );

  for (const el of els) io.observe(el);
}

function initTilt() {
  const tiltEls = document.querySelectorAll("[data-tilt]");
  if (!tiltEls.length) return;

  const max = 10;
  const damp = 14;

  function onMove(e) {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (py - 0.5) * -max;
    const ry = (px - 0.5) * max;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    el.style.transition = "transform 0.06s linear";
  }

  function onLeave(e) {
    const el = e.currentTarget;
    el.style.transition = `transform ${damp / 100}s ease`;
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)";
  }

  for (const el of tiltEls) {
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("touchstart", () => {}, { passive: true });
  }
}

function initStars() {
  const canvas = document.getElementById("stars");
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let w = 0;
  let h = 0;
  let dpr = 1;
  let raf = 0;

  const stars = [];
  const STAR_COUNT = 120;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.floor(window.innerWidth);
    h = Math.floor(window.innerHeight);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function seed() {
    stars.length = 0;
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.2,
        s: Math.random() * 0.7 + 0.15,
        a: Math.random() * 0.6 + 0.2,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter";

    for (const st of stars) {
      st.y += st.s;
      st.x += Math.sin(st.y * 0.003) * 0.08;
      if (st.y > h + 10) {
        st.y = -10;
        st.x = Math.random() * w;
      }

      const grad = ctx.createRadialGradient(st.x, st.y, 0, st.x, st.y, st.r * 6);
      grad.addColorStop(0, `rgba(204,255,0,${st.a})`);
      grad.addColorStop(0.35, `rgba(255,255,255,${st.a * 0.35})`);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.r * 6, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = "source-over";
    raf = requestAnimationFrame(draw);
  }

  function start() {
    resize();
    seed();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(draw);
  }

  const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  if (mq?.matches) return;

  window.addEventListener("resize", () => start(), { passive: true });
  start();
}

function initLightbox() {
  const lb = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");
  const cap = document.getElementById("lightbox-cap");
  const closeA = document.getElementById("lightbox-close");
  const closeB = document.getElementById("lightbox-x");

  if (!lb || !(img instanceof HTMLImageElement) || !cap || !closeA || !closeB) return;

  function open(src, caption) {
    img.src = src;
    img.alt = caption || "Gallery image";
    cap.textContent = caption || "";
    lb.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function close() {
    lb.hidden = true;
    img.src = "";
    cap.textContent = "";
    document.body.style.overflow = "";
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest?.("[data-lightbox]");
    if (!btn) return;
    const src = btn.getAttribute("data-lightbox");
    if (!src) return;
    const caption = btn.getAttribute("data-caption") || "";
    open(src, caption);
  });

  closeA.addEventListener("click", close);
  closeB.addEventListener("click", close);

  window.addEventListener("keydown", (e) => {
    if (!lb.hidden && e.key === "Escape") close();
  });
}

function renderConfig() {
  setText("tok-supply", CONFIG.supply);
  setText("tok-tax", `${CONFIG.buyTax.replace("%","")}/${CONFIG.sellTax.replace("%","")}`);
  setText("tok-lp", CONFIG.lpBadge);
  setText("tok-own", CONFIG.ownershipBadge);
  setText("tok-name", `Shrek ${CONFIG.symbol}`);
  setText("tok-ilp-stat", CONFIG.launchPlatform);
  setHref("tok-ilp-link", CONFIG.links.launchPlatform);

  const caEl = document.getElementById("tok-ca");
  if (caEl) {
    const ca = CONFIG.contractAddress?.trim();
    caEl.textContent = ca || "Coming soon";
    caEl.title = ca || "";
  }

  setHref("header-x-link", CONFIG.links.x);
  setHref("header-tg-link", CONFIG.links.tg);
  setHref("mobile-x-link", CONFIG.links.x);
  setHref("mobile-tg-link", CONFIG.links.tg);
  setHref("hero-buy-link", CONFIG.links.dex);
  // Footer/links section removed; header buttons remain wired above.

  const split = CONFIG.tokenSplit;
  for (const [k, v] of Object.entries(split)) {
    const el = document.querySelector(`[data-split="${k}"]`);
    if (el) el.textContent = `${v}%`;
  }
}

function initConfigTip() {
  const btn = $("#open-config-tip");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    const ok = await copyText(
      "Edit CONFIG in script.js (contractAddress + links)."
    );
    toast(ok ? "Tip copied: edit CONFIG in script.js" : "Edit CONFIG in script.js");
  });
}

function initPaidToHolders() {
  const POINTS = [0.12, 0.31, 0.52, 0.74, 0.91, 1.0];

  function scramble(el, digits, decimals) {
    const tick = () => {
      let out = "";
      for (let i = 0; i < digits; i++) out += Math.floor(Math.random() * 10);
      if (digits > 3) out = out.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      if (decimals > 0) {
        let frac = "";
        for (let i = 0; i < decimals; i++) frac += Math.floor(Math.random() * 10);
        out += "." + frac;
      }
      el.textContent = out;
    };
    tick();
    return setInterval(tick, 70);
  }

  function drawSparkline(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth  || 320;
    const H = canvas.offsetHeight || 100;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    const pad = { t: 14, r: 24, b: 14, l: 8 };
    const w = W - pad.l - pad.r;
    const h = H - pad.t - pad.b;
    const n = POINTS.length;

    const pts = POINTS.map((v, i) => ({
      x: pad.l + (i / (n - 1)) * w,
      y: pad.t + (1 - v) * h,
    }));

    const grad = ctx.createLinearGradient(0, pad.t, 0, pad.t + h);
    grad.addColorStop(0,   "rgba(204,255,0,.22)");
    grad.addColorStop(1,   "rgba(204,255,0,.00)");

    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      const cp1x = (pts[i-1].x + pts[i].x) / 2;
      ctx.bezierCurveTo(cp1x, pts[i-1].y, cp1x, pts[i].y, pts[i].x, pts[i].y);
    }
    ctx.lineTo(pts[n-1].x, pad.t + h);
    ctx.lineTo(pts[0].x,   pad.t + h);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      const cp1x = (pts[i-1].x + pts[i].x) / 2;
      ctx.bezierCurveTo(cp1x, pts[i-1].y, cp1x, pts[i].y, pts[i].x, pts[i].y);
    }
    ctx.strokeStyle = "#CCFF00";
    ctx.lineWidth   = 2;
    ctx.setLineDash([6, 6]);
    ctx.stroke();
    ctx.setLineDash([]);

    pts.forEach((p, i) => {
      if (i === 0) return;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(204,255,0,.45)";
      ctx.fill();
    });
  }

  const card = document.querySelector(".pth");
  if (!card) return;
  const usdEl  = document.getElementById("pth-usd");
  const tokEl  = document.getElementById("pth-token");
  const canvas = document.getElementById("pth-chart");
  if (!usdEl || !tokEl || !canvas) return;

  let fired = false;
  const observer = new IntersectionObserver((entries) => {
    if (fired || !entries[0].isIntersecting) return;
    fired = true;
    observer.disconnect();
    scramble(usdEl, 5, 0);
    scramble(tokEl, 4, 4);
    drawSparkline(canvas);
  }, { threshold: 0.25 });
  observer.observe(card);
}

renderConfig();
initCopyButtons();
initBurger();
initSmoothScroll();
initScrollTop();
initConfigTip();
initScrollFx();
initBackgroundSwitch();
initSectionTransitions();
initRevealOnScroll();
initTilt();
initPaidToHolders();
initStars();
initLightbox();


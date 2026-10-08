const clamp = (value: number) => Math.min(1, Math.max(0, value));

function initHero() {
  const hero = document.querySelector<HTMLElement>(".hero");
  const scene = hero?.querySelector<HTMLElement>(".hero-scene");
  if (!hero || !scene) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const compact = matchMedia("(max-width: 359px), (max-height: 639px), (max-width: 1023px) and (max-height: 739px)");
  let start = 0;
  let travel = 0;
  let pending = false;
  let lastProgress = -1;

  const fallback = () => {
    delete hero.dataset.motionReady;
    delete hero.dataset.contentVisible;
    hero.style.removeProperty("--opening");
    hero.style.removeProperty("--reveal");
    lastProgress = -1;
  };

  const update = () => {
    pending = false;
    try {
      if (reduced.matches || compact.matches || travel <= 0) {
        fallback();
        return;
      }
      const progress = clamp((window.scrollY - start) / travel);
      if (Math.abs(progress - lastProgress) < 0.0001) return;
      lastProgress = progress;
      hero.style.setProperty(
        "--opening",
        String(clamp((progress - 0.1) / 0.65)),
      );
      const reveal = clamp((progress - 0.45) / 0.4);
      hero.style.setProperty("--reveal", String(reveal));
      hero.toggleAttribute("data-content-visible", reveal >= 0.98);
      hero.dataset.motionReady = "";
    } catch {
      fallback();
    }
  };
  const schedule = () => {
    if (!pending) {
      pending = true;
      requestAnimationFrame(update);
    }
  };
  const measure = () => {
    start = hero.getBoundingClientRect().top + window.scrollY;
    travel = Math.max(0, hero.offsetHeight - scene.offsetHeight);
    lastProgress = -1;
    update();
  };
  // Native scrolling remains untouched. No wheel/touch/key interception.
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", measure, { passive: true });
  window.addEventListener("pageshow", measure);
  reduced.addEventListener("change", measure);
  compact.addEventListener("change", measure);
  // ResizeObserver supplies the initial read after layout, before paint.
  // This avoids synchronously forcing the first layout from the module.
  if ("ResizeObserver" in window) {
    new ResizeObserver(measure).observe(scene);
  } else {
    requestAnimationFrame(measure);
  }
}

function initReveals() {
  if (!("IntersectionObserver" in window)) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  if (reduced.matches) return;
  const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target as HTMLElement;
        element.dataset.revealed = "";
        element.removeAttribute("data-reveal-pending");
        observer.unobserve(element);
      }
    },
    { threshold: 0.08 },
  );
  for (const element of elements) {
    // Register first. Content stays visible if observer creation/registration fails.
    observer.observe(element);
    element.dataset.revealPending = "";
    element.addEventListener(
      "focusin",
      () => {
        element.removeAttribute("data-reveal-pending");
        observer.unobserve(element);
      },
      { once: true },
    );
  }
  reduced.addEventListener("change", () => {
    if (!reduced.matches) return;
    observer.disconnect();
    elements.forEach((element) =>
      element.removeAttribute("data-reveal-pending"),
    );
  });
}

function initMenu() {
  const menu = document.querySelector<HTMLDetailsElement>(".mobile-menu");
  if (!menu) return;
  menu.querySelectorAll<HTMLAnchorElement>("a").forEach((link) =>
    link.addEventListener("click", () => {
      menu.open = false;
    }),
  );
  menu.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !menu.open) return;
    menu.open = false;
    menu.querySelector("summary")?.focus();
  });
}

export function initLanding() {
  // Independent enhancements: a failure in one cannot disable the others.
  try {
    initHero();
  } catch {
    document.querySelector(".hero")?.removeAttribute("data-motion-ready");
  }
  try {
    initReveals();
  } catch {
    document
      .querySelectorAll("[data-reveal-pending]")
      .forEach((element) => element.removeAttribute("data-reveal-pending"));
  }
  try {
    initMenu();
  } catch {
    /* The native details element remains usable. */
  }
}

(() => {
  const runtimeKey = "__rajThemeRuntime";
  const storageKey = "raj-theme";
  const legacyStorageKey = "theme";

  const existingRuntime = window[runtimeKey];
  if (existingRuntime) {
    existingRuntime.refresh();
    return;
  }

  const themePreference = window.matchMedia("(prefers-color-scheme: dark)");

  document.documentElement.classList.add("js");

  function isTheme(value) {
    return value === "dark" || value === "light";
  }

  function getCookieTheme() {
    const match = document.cookie.match(
      /(?:^|; )raj-theme=(light|dark)(?:;|$)/,
    );
    return match?.[1] ?? null;
  }

  function getStoredTheme() {
    const cookieTheme = getCookieTheme();
    if (isTheme(cookieTheme)) {
      return cookieTheme;
    }

    try {
      const storedTheme =
        window.localStorage.getItem(storageKey) ??
        window.localStorage.getItem(legacyStorageKey);
      return isTheme(storedTheme) ? storedTheme : null;
    } catch {
      return null;
    }
  }

  let selectedTheme = getStoredTheme();

  function getActiveTheme() {
    return selectedTheme ?? (themePreference.matches ? "dark" : "light");
  }

  function updateThemeColor(theme) {
    const lightMeta = document.querySelector("[data-theme-color='light']");
    const darkMeta = document.querySelector("[data-theme-color='dark']");

    if (lightMeta instanceof HTMLMetaElement) {
      lightMeta.media = theme === "light" ? "all" : "not all";
    }
    if (darkMeta instanceof HTMLMetaElement) {
      darkMeta.media = theme === "dark" ? "all" : "not all";
    }
  }

  function updateToggles(theme) {
    const nextTheme = theme === "dark" ? "light" : "dark";
    for (const toggle of document.querySelectorAll("[data-theme-toggle]")) {
      if (!(toggle instanceof HTMLButtonElement)) {
        continue;
      }

      toggle.setAttribute("aria-checked", String(theme === "dark"));
      toggle.setAttribute("aria-label", "Dark mode");
      toggle.title = `Switch to ${nextTheme} mode`;
    }
  }

  function persistTheme(theme) {
    try {
      window.localStorage.setItem(storageKey, theme);
    } catch {
      // The shared cookie still preserves the selection when storage is unavailable.
    }

    const attributes = ["Path=/", "Max-Age=31536000", "SameSite=Lax"];
    if (
      window.location.hostname === "rajjoshi.me" ||
      window.location.hostname.endsWith(".rajjoshi.me")
    ) {
      attributes.push("Domain=.rajjoshi.me");
    }

    document.cookie = `${storageKey}=${theme}; ${attributes.join("; ")}`;
  }

  function applyTheme(theme, persist = false) {
    const root = document.documentElement;
    root.classList.add("js");
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    updateThemeColor(theme);
    updateToggles(theme);

    if (persist) {
      persistTheme(theme);
    }
  }

  function refreshTheme() {
    selectedTheme = getStoredTheme();
    applyTheme(getActiveTheme());
  }

  window[runtimeKey] = { refresh: refreshTheme };

  applyTheme(getActiveTheme());

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", refreshTheme, { once: true });
  } else {
    refreshTheme();
  }

  document.addEventListener("click", (event) => {
    const target =
      event.target instanceof Element
        ? event.target.closest("[data-theme-toggle]")
        : null;
    if (!(target instanceof HTMLButtonElement)) {
      return;
    }

    selectedTheme = getActiveTheme() === "dark" ? "light" : "dark";
    applyTheme(selectedTheme, true);
  });

  document.addEventListener("astro:after-swap", refreshTheme);

  themePreference.addEventListener("change", (event) => {
    if (!selectedTheme) {
      applyTheme(event.matches ? "dark" : "light");
    }
  });
})();

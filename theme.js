(() => {
  const themeColors = {
    dark: "#28221c",
    light: "#fff9eb",
  };
  const storageKey = "raj-theme";
  const legacyStorageKey = "theme";
  const themePreference = window.matchMedia("(prefers-color-scheme: dark)");
  const root = document.documentElement;

  root.classList.add("js");

  function isTheme(value) {
    return value === "dark" || value === "light";
  }

  function getCookieTheme() {
    const match = document.cookie.match(/(?:^|; )raj-theme=(light|dark)(?:;|$)/);
    return match?.[1] ?? null;
  }

  function getStoredTheme() {
    const cookieTheme = getCookieTheme();
    if (isTheme(cookieTheme)) {
      return cookieTheme;
    }

    try {
      const storedTheme =
        window.localStorage.getItem(storageKey) ?? window.localStorage.getItem(legacyStorageKey);
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
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    updateThemeColor(theme);
    updateToggles(theme);

    if (persist) {
      persistTheme(theme);
    }
  }

  applyTheme(getActiveTheme());

  document.addEventListener("DOMContentLoaded", () => {
    updateToggles(getActiveTheme());

    for (const toggle of document.querySelectorAll("[data-theme-toggle]")) {
      if (!(toggle instanceof HTMLButtonElement)) {
        continue;
      }

      toggle.addEventListener("click", () => {
        selectedTheme = getActiveTheme() === "dark" ? "light" : "dark";
        applyTheme(selectedTheme, true);
      });
    }

    themePreference.addEventListener("change", (event) => {
      if (!selectedTheme) {
        applyTheme(event.matches ? "dark" : "light");
      }
    });
  });
})();

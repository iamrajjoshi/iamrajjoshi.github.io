(() => {
  const themeColors = {
    dark: "#28221c",
    light: "#fff9eb",
  };
  const themePreference = window.matchMedia("(prefers-color-scheme: dark)");
  const root = document.documentElement;

  let selectedTheme = null;
  try {
    const storedTheme = window.localStorage.getItem("theme");
    if (storedTheme === "dark" || storedTheme === "light") {
      selectedTheme = storedTheme;
      root.dataset.theme = storedTheme;
    }
  } catch {
    // Keep following the system preference when storage is unavailable.
  }

  function getActiveTheme() {
    return selectedTheme ?? (themePreference.matches ? "dark" : "light");
  }

  function updateThemeColor() {
    if (!selectedTheme) {
      return;
    }

    for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
      meta.content = themeColors[selectedTheme];
    }
  }

  updateThemeColor();

  document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector("[data-theme-toggle]");
    if (!(toggle instanceof HTMLButtonElement)) {
      return;
    }

    function updateToggle() {
      const activeTheme = getActiveTheme();
      const nextTheme = activeTheme === "dark" ? "light" : "dark";
      const label = `Switch to ${nextTheme} mode`;

      toggle.setAttribute("aria-label", label);
      toggle.title = label;
    }

    toggle.addEventListener("click", () => {
      selectedTheme = getActiveTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = selectedTheme;

      try {
        window.localStorage.setItem("theme", selectedTheme);
      } catch {
        // Keep the selection for this page when storage is unavailable.
      }

      updateThemeColor();
      updateToggle();
    });

    themePreference.addEventListener("change", () => {
      if (!selectedTheme) {
        updateToggle();
      }
    });

    updateToggle();
  });
})();

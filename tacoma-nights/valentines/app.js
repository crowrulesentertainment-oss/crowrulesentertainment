(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const menu = $("#menuToggle");
  const nav = $("#navLinks");
  if (menu && nav) {
    menu.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menu.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("open");
      menu.setAttribute("aria-expanded", "false");
    }));
  }

  // February 14, 2027 at midnight in Tacoma (Pacific Standard Time).
  const target = new Date("2027-02-14T00:00:00-08:00").getTime();
  const units = { days: $("#days"), hours: $("#hours"), minutes: $("#minutes"), seconds: $("#seconds") };
  const updateCountdown = () => {
    const remaining = Math.max(0, target - Date.now());
    const values = {
      days: Math.floor(remaining / 86400000),
      hours: Math.floor((remaining % 86400000) / 3600000),
      minutes: Math.floor((remaining % 3600000) / 60000),
      seconds: Math.floor((remaining % 60000) / 1000)
    };
    Object.entries(units).forEach(([key, node]) => {
      if (node) node.textContent = String(values[key]).padStart(key === "days" ? 3 : 2, "0");
    });
    if (remaining === 0) {
      const label = document.querySelector(".countdown-inner .eyebrow");
      if (label) label.textContent = "HAPPY VALENTINE'S DAY, TACOMA";
    }
  };
  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  const field = $(".petal-field");
  if (field && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    for (let i = 0; i < 18; i++) {
      const petal = document.createElement("span");
      petal.className = "petal";
      petal.style.left = (Math.random() * 100) + "%";
      petal.style.animationDuration = (12 + Math.random() * 16) + "s";
      petal.style.animationDelay = (-Math.random() * 24) + "s";
      petal.style.opacity = String(.18 + Math.random() * .38);
      petal.style.transform = "scale(" + (.55 + Math.random() * .8) + ")";
      field.appendChild(petal);
    }
  }
})();
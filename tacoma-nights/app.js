
/* TACOMA NIGHTS — website configuration */

const CONFIG = {
  playlistId: "PLYK7RQq4_mhw",

  // Add the real YouTube livestream video ID when available.
  liveVideoId: "",

  // Add the official CrowRules Entertainment URL.
  entertainmentUrl: "",

  // Add the official CrowRules Podcasting website URL.
  podcastingUrl: ""
};

const intro = document.getElementById("intro");
const enterButton = document.getElementById("enterShow");
const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");

/* Opening animation */
function enterTacomaNights() {
  if (!intro) return;

  intro.classList.add("leaving");
  document.body.classList.remove("intro-active");

  try {
    sessionStorage.setItem("tacomaNightsIntroSeen", "true");
  } catch (_) {}

  window.setTimeout(() => {
    intro.hidden = true;
  }, 850);
}

let introSeen = false;

try {
  introSeen = sessionStorage.getItem("tacomaNightsIntroSeen") === "true";
} catch (_) {}

if (
  introSeen ||
  window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  intro.hidden = true;
} else {
  document.body.classList.add("intro-active");
  window.setTimeout(enterTacomaNights, 5200);
}

enterButton?.addEventListener("click", enterTacomaNights);

/* Mobile navigation */
menuToggle?.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Toggle navigation"
  );
});

navigation?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

/* Footer year */
document.getElementById("year").textContent =
  new Date().getFullYear();

/* Official CrowRules links */
if (CONFIG.entertainmentUrl) {
  const link = document.getElementById("entertainmentLink");
  link.href = CONFIG.entertainmentUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.querySelector("small")?.remove();
}

if (CONFIG.podcastingUrl) {
  const podcastLink = document.querySelector(
    ".network-card:not(.entertainment-card)"
  );

  podcastLink.href = CONFIG.podcastingUrl;
  podcastLink.target = "_blank";
  podcastLink.rel = "noopener noreferrer";
}

/* Optional YouTube Live Chat */
if (CONFIG.liveVideoId) {
  const chatContainer = document.getElementById("liveChatEmbed");
  const chatPlaceholder = document.getElementById("chatPlaceholder");
  const chatStatus = document.getElementById("chatStatus");
  const liveLink = document.getElementById("liveLink");

  const iframe = document.createElement("iframe");

  iframe.title = "Tacoma Nights YouTube Live Chat";
  iframe.loading = "lazy";
  iframe.referrerPolicy = "strict-origin-when-cross-origin";

  iframe.src =
    "https://www.youtube.com/live_chat?v=" +
    encodeURIComponent(CONFIG.liveVideoId) +
    "&embed_domain=" +
    encodeURIComponent(window.location.hostname);

  chatContainer.appendChild(iframe);
  chatContainer.hidden = false;
  chatPlaceholder.hidden = true;

  chatStatus.textContent =
    "Live chat configured — availability depends on YouTube.";

  liveLink.href =
    "https://www.youtube.com/watch?v=" +
    encodeURIComponent(CONFIG.liveVideoId);
}

/* Scroll reveal animations */
const revealTargets = document.querySelectorAll(
  ".section-heading, .featured-grid, .archive-banner, " +
  ".playlist-section, .lounge-grid, .about-art, " +
  ".about-copy, .network-grid"
);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach(element => {
    element.classList.add("reveal");
    observer.observe(element);
  });
} else {
  revealTargets.forEach(element => element.classList.add("visible"));
}

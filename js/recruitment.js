(() => {
  "use strict";

  const SUPABASE_URL = "https://cevylpnoexugwgygvtgu.supabase.co";
  // Publishable browser key only. Never put a service-role/secret key in public code.
  const SUPABASE_KEY = "sb_publishable_AdfM5y6RqvF3tbvEVzDZSg_JuGTQLD-";
  const form = document.getElementById("recruitmentForm");
  const status = document.getElementById("formStatus");
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  const roleNames = Object.freeze({
    "technical-lead-web-developer": "Founding Technical Lead & Web Developer",
    "ui-ux-designer": "Founding UI/UX & Digital Experience Designer",
    "backend-platform-engineer": "Founding Backend & Platform Engineer",
    "creative-production": "Creative Production",
    "marketing-community": "Marketing & Community",
    "other": "Other / Future Opportunity"
  });
  const allowedLocations = new Set([
    "Tacoma / Pierce County",
    "Greater Seattle / Puget Sound",
    "Remote",
    "Flexible / to discuss"
  ]);

  let supabaseClient = null;
  function getSupabaseClient() {
    if (!window.supabase || typeof window.supabase.createClient !== "function") {
      throw new Error("The Supabase client library did not load.");
    }
    if (!supabaseClient) {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      });
    }
    return supabaseClient;
  }

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    }));
  }

  document.querySelectorAll(".filter").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(item => item.classList.toggle("active", item === button));
    document.querySelectorAll(".role-card").forEach(card => {
      card.hidden = button.dataset.filter !== "all" && card.dataset.category !== button.dataset.filter;
    });
  }));

  document.querySelectorAll(".division").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll(".division").forEach(item => item.classList.toggle("active", item === button));
    const title = document.getElementById("divisionTitle");
    const copy = document.getElementById("divisionCopy");
    if (title) title.textContent = button.dataset.title || "";
    if (copy) copy.textContent = button.dataset.copy || "";
  }));

  function setStatus(message, type = "") {
    if (!status) return;
    status.textContent = message;
    status.className = "form-status" + (type ? " " + type : "");
  }

  const roleSelect = document.getElementById("roleSelect");
  const requestedRole = new URLSearchParams(window.location.search).get("role");
  if (requestedRole && roleSelect && [...roleSelect.options].some(option => option.value === requestedRole)) {
    roleSelect.value = requestedRole;
  }

  if (form) {
    form.addEventListener("submit", async event => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const submitButton = form.querySelector('button[type="submit"]');
      if (!submitButton || submitButton.disabled) return;

      const data = new FormData(form);
      // Basic bot honeypot. Do not store submissions that fill the hidden field.
      if (String(data.get("website") || "").trim()) {
        form.reset();
        setStatus("Thank you. If appropriate, CrowRules may follow up about your interest.");
        return;
      }

      const roleSlug = String(data.get("role_slug") || "");
      if (!Object.prototype.hasOwnProperty.call(roleNames, roleSlug)) {
        setStatus("Please choose a valid role of interest.", "error");
        return;
      }

      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim().toLowerCase();
      const skills = String(data.get("skills") || "").trim();
      const rawPortfolio = String(data.get("portfolio_url") || "").trim();
      const locationValue = String(data.get("location") || "Tacoma / Pierce County");
      const message = String(data.get("message") || "").trim();
      const consent = form.querySelector('input[name="consent"]');

      if (name.length < 2 || name.length > 120 || email.length < 5 || email.length > 254 ||
          skills.length < 2 || skills.length > 2500 || message.length > 2500) {
        setStatus("Please review the form fields and their length limits.", "error");
        return;
      }
      if (!consent || !consent.checked) {
        setStatus("Please confirm the recruitment-interest consent before submitting.", "error");
        return;
      }
      if (!allowedLocations.has(locationValue)) {
        setStatus("Please choose one of the listed location options.", "error");
        return;
      }

      let portfolioUrl = null;
      if (rawPortfolio) {
        try {
          const parsed = new URL(rawPortfolio);
          if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Unsupported URL scheme");
          portfolioUrl = parsed.href;
        } catch (_) {
          setStatus("Please enter a valid portfolio link beginning with https:// or http://.", "error");
          return;
        }
      }

      submitButton.disabled = true;
      const originalButtonText = submitButton.textContent;
      submitButton.textContent = "Submitting…";
      setStatus("Sending your interest securely…");

      const payload = {
        name,
        email,
        role_slug: roleSlug,
        role_title: roleNames[roleSlug],
        skills,
        portfolio_url: portfolioUrl,
        location: locationValue,
        message: message || null,
        consent_at: new Date().toISOString(),
        status: "new"
      };

      try {
        const client = getSupabaseClient();
        const { error } = await client.from("recruitment_applications").insert([payload]);
        if (error) {
          // Do not expose raw database errors to visitors; they may contain implementation details.
          console.error("Recruitment submission failed:", error.code || error.message || "Unknown Supabase error");
          throw new Error("submission_failed");
        }
        form.reset();
        setStatus("Thank you — your interest was submitted successfully. This is an unpaid recruitment-interest list, not a job offer; future paid work is not guaranteed.");
      } catch (error) {
        console.error("Recruitment form could not complete submission:", error.message || "Unknown error");
        setStatus("We couldn't submit your interest just now. Your form entries are still here; please try again later. If the issue continues, contact CrowRules through an official contact channel.", "error");
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText || "Submit Interest ↗";
      }
    });
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
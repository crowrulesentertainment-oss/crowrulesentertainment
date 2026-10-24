(() => {
  "use strict";
  const SUPABASE_URL = "https://cevylpnoexugwgygvtgu.supabase.co";
  const SUPABASE_KEY = "sb_publishable_AdfM5y6RqvF3tbvEVzDZSg_JuGTQLD-";
  const form = document.getElementById("recruitmentForm");
  const status = document.getElementById("formStatus");
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  const roleNames = {
    "technical-lead-web-developer": "Founding Technical Lead & Web Developer",
    "ui-ux-designer": "Founding UI/UX & Digital Experience Designer",
    "backend-platform-engineer": "Founding Backend & Platform Engineer",
    "creative-production": "Creative Production",
    "marketing-community": "Marketing & Community",
    "other": "Other / Future Opportunity"
  };
  if (menuButton && nav) menuButton.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });
  if (nav) nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));
  document.querySelectorAll(".filter").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.toggle("active", b === button));
    document.querySelectorAll(".role-card").forEach(card => card.hidden = button.dataset.filter !== "all" && card.dataset.category !== button.dataset.filter);
  }));
  document.querySelectorAll(".division").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll(".division").forEach(b => b.classList.toggle("active", b === button));
    document.getElementById("divisionTitle").textContent = button.dataset.title;
    document.getElementById("divisionCopy").textContent = button.dataset.copy;
  }));
  const setStatus = (message, type = "") => {
    status.textContent = message;
    status.className = "form-status " + type;
  };
  const requestedRole = new URLSearchParams(window.location.search).get("role");
  const roleSelect = document.getElementById("roleSelect");
  if (requestedRole && roleSelect && [...roleSelect.options].some(option => option.value === requestedRole)) {
    roleSelect.value = requestedRole;
  }
  if (form) form.addEventListener("submit", async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (!window.supabase || !window.supabase.createClient) {
      setStatus("The application service is unavailable. Please try again later.", "error");
      return;
    }
    const submit = form.querySelector('button[type="submit"]');
    submit.disabled = true;
    submit.textContent = "Submitting…";
    setStatus("");
    const data = new FormData(form);
    const role = String(data.get("role_slug") || "");
    const payload = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      role_slug: role,
      role_title: roleNames[role] || "Other / Future Opportunity",
      skills: String(data.get("skills") || "").trim(),
      portfolio_url: String(data.get("portfolio_url") || "").trim() || null,
      location: String(data.get("location") || "Tacoma / Pierce County"),
      message: String(data.get("message") || "").trim() || null,
      consent_at: new Date().toISOString(),
      status: "new"
    };
    try {
      const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
      });
      const { error } = await client.from("recruitment_applications").insert(payload);
      if (error) throw error;
      form.reset();
      setStatus("Thank you — your interest was submitted successfully. CrowRules may contact you about this recruitment interest. This is not a job offer.");
    } catch (error) {
      console.error("Recruitment submission failed:", error);
      setStatus("We couldn't submit your interest just now. Please try again later. No need to submit repeatedly.", "error");
    } finally {
      submit.disabled = false;
      submit.textContent = "Submit Interest ↗";
    }
  });
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
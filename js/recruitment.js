(() => {
  "use strict";
  const SUPABASE_URL = "https://cevylpnoexugwgygvtgu.supabase.co";
  // Public browser key only. Never place a service-role or secret key in client code.
  const SUPABASE_KEY = "sb_publishable_AdfM5y6RqvF3tbvEVzDZSg_JuGTQLD-";
  const form = document.getElementById("recruitmentForm");
  const status = document.getElementById("formStatus");
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  const roleNames = Object.freeze({
    "executive-show-producer":"Executive / Show Producer",
    "production-coordinator":"Production Coordinator / Assistant",
    "videographer-camera-operator":"Videographer / Camera Operator",
    "live-stream-broadcast-crew":"Live Stream & Broadcast Crew",
    "audio-engineer":"Audio Engineer / Sound Technician",
    "video-editor":"Video Editor / Post-production",
    "tacoma-nights-remote-host":"Tacoma Nights Remote Segment Host",
    "show-host-presenter":"Show Host / Presenter / Correspondent",
    "podcast-host-guest-booker":"Podcast Host / Co-host / Guest Booker",
    "writer-scriptwriter":"Writer / Scriptwriter / Story Developer",
    "researcher-fact-checker":"Researcher / Fact-checker",
    "graphic-motion-designer":"Graphic / Motion Designer",
    "photographer":"Photographer / Visual Storyteller",
    "web-developer":"Web Developer / Front-end Engineer",
    "backend-database-security":"Backend / Database / Security Engineer",
    "ui-ux-accessibility":"UI/UX Designer / Accessibility Tester",
    "website-qa-support":"Website QA / Technical Support",
    "marketing-social-publicity":"Marketing / Social Media / Publicity",
    "community-outreach-partnerships":"Community Outreach / Partnerships",
    "business-development-sponsorship":"Business Development / Sponsorship",
    "administrative-operations":"Administrative / Operations Support",
    "events-programming":"Events / Community Programming Coordinator",
    "community-moderation":"Community Moderation / Member Support",
    "other":"Other / Future Opportunity"
  });
  const allowedLocations = new Set(["Tacoma / Pierce County","Greater Seattle / Puget Sound","Remote","Flexible / to discuss"]);
  let supabaseClient = null;
  function getSupabaseClient() {
    if (!window.supabase || typeof window.supabase.createClient !== "function") throw new Error("Supabase client library unavailable");
    if (!supabaseClient) supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}
    });
    return supabaseClient;
  }
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("open"); menuButton.setAttribute("aria-expanded","false");
    }));
  }
  document.querySelectorAll(".filter").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(item => item.classList.toggle("active",item===button));
    document.querySelectorAll(".role-card").forEach(card => {
      card.hidden = button.dataset.filter !== "all" && card.dataset.category !== button.dataset.filter;
    });
  }));
  document.querySelectorAll(".division").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll(".division").forEach(item => item.classList.toggle("active",item===button));
    const title=document.getElementById("divisionTitle"), copy=document.getElementById("divisionCopy");
    if(title) title.textContent=button.dataset.title||"";
    if(copy) copy.textContent=button.dataset.copy||"";
  }));
  function setStatus(message,type="") {
    if(!status)return;
    status.textContent=message;
    status.className="form-status"+(type?" "+type:"");
  }
  const roleSelect=document.getElementById("roleSelect");
  const requestedRole=new URLSearchParams(window.location.search).get("role");
  if(requestedRole&&roleSelect&&[...roleSelect.options].some(option=>option.value===requestedRole)) roleSelect.value=requestedRole;

  if(form) form.addEventListener("submit",async event=>{
    event.preventDefault();
    if(!form.reportValidity())return;
    const submitButton=form.querySelector('button[type="submit"]');
    if(!submitButton||submitButton.disabled)return;
    const data=new FormData(form);
    if(String(data.get("website")||"").trim()) {
      form.reset(); setStatus("Thank you. If appropriate, CrowRules may follow up about your interest."); return;
    }
    const roleSlug=String(data.get("role_slug")||"");
    if(!Object.prototype.hasOwnProperty.call(roleNames,roleSlug)) {setStatus("Please choose a valid area of interest.","error");return;}
    const name=String(data.get("name")||"").trim();
    const email=String(data.get("email")||"").trim().toLowerCase();
    const skills=String(data.get("skills")||"").trim();
    const rawPortfolio=String(data.get("portfolio_url")||"").trim();
    const locationValue=String(data.get("location")||"Flexible / to discuss");
    const message=String(data.get("message")||"").trim();
    const consent=form.querySelector('input[name="consent"]');
    if(name.length<2||name.length>120||email.length<5||email.length>254||skills.length<2||skills.length>2500||message.length>2500) {
      setStatus("Please review the form fields and their length limits.","error");return;
    }
    if(!consent||!consent.checked){setStatus("Please confirm the recruitment-interest consent before submitting.","error");return;}
    if(!allowedLocations.has(locationValue)){setStatus("Please choose one of the listed location options.","error");return;}
    let portfolioUrl=null;
    if(rawPortfolio) {
      try {const parsed=new URL(rawPortfolio);if(!["http:","https:"].includes(parsed.protocol))throw new Error("Unsupported URL");portfolioUrl=parsed.href;}
      catch(_){setStatus("Please enter a valid portfolio link beginning with https:// or http://.","error");return;}
    }
    submitButton.disabled=true;
    const originalButtonText=submitButton.textContent;
    submitButton.textContent="Submitting…";
    setStatus("Sending your interest securely…");
    // Keep the existing recruitment_applications table contract. New optional fields
    // are folded into message so this update does not assume new database columns.
    const otherInterests=String(data.get("other_interests")||"").trim();
    const availability=String(data.get("availability")||"Flexible / to discuss");
    const division=String(data.get("division")||"");
    const details=[message,otherInterests?"Other interests: "+otherInterests:"", "Availability: "+availability, division?"Project interest: "+division:""].filter(Boolean).join("\n\n");
    const payload={
      name,email,role_slug:roleSlug,role_title:roleNames[roleSlug],skills,
      portfolio_url:portfolioUrl,location:locationValue,message:details||null,
      consent_at:new Date().toISOString(),status:"new"
    };
    try {
      const {error}=await getSupabaseClient().from("recruitment_applications").insert([payload]);
      if(error){console.error("Recruitment submission failed:",error.code||error.message||"Unknown Supabase error");throw new Error("submission_failed");}
      form.reset();
      setStatus("Thank you — your interest was submitted successfully. This is an expression of interest only; it is not a job offer or an assignment to work, and future paid positions are not guaranteed.");
    } catch(error) {
      console.error("Recruitment form could not complete submission:",error.message||"Unknown error");
      setStatus("We couldn't submit your interest just now. Your entries are still here; please try again later. If the issue continues, contact CrowRules through an official contact channel.","error");
    } finally {
      submitButton.disabled=false;submitButton.textContent=originalButtonText||"Submit Interest ↗";
    }
  });
  const year=document.getElementById("year");
  if(year)year.textContent=new Date().getFullYear();
})();
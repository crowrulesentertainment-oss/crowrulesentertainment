(() => {
  "use strict";

  const initReferralCTA = () => {
    const button = document.getElementById("refer-friend-btn");
    const feedback = document.getElementById("referral-feedback");
    if (!button || !feedback || button.dataset.referralReady === "true") return;
    button.dataset.referralReady = "true";

    const referralUrl = new URL(window.location.href);
    referralUrl.searchParams.set("utm_source", "friend-referral");
    referralUrl.searchParams.set("utm_medium", "share");
    referralUrl.searchParams.set("utm_campaign", "crowrules_podcasting");

    const shareData = {
      title: "CrowRules Podcasting",
      text: "Discover independent voices, original conversations, video podcasts and stories worth sharing on CrowRules Podcasting.",
      url: referralUrl.toString()
    };

    const copyLink = async () => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(shareData.url);
          feedback.textContent = "Referral link copied! Send it to a friend.";
          return true;
        }
      } catch (error) {
        // Continue to the manual-copy fallback.
      }
      window.prompt("Copy your CrowRules Podcasting referral link:", shareData.url);
      feedback.textContent = "Your referral link is ready to copy and share.";
      return false;
    };

    button.addEventListener("click", async () => {
      feedback.textContent = "";
      if (navigator.share) {
        try {
          await navigator.share(shareData);
          feedback.textContent = "Thanks for spreading the word about CrowRules Podcasting!";
          return;
        } catch (error) {
          if (error && error.name === "AbortError") return;
          // If native sharing is unavailable or fails, offer a copyable link.
        }
      }
      await copyLink();
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initReferralCTA, { once: true });
  } else {
    initReferralCTA();
  }
})();
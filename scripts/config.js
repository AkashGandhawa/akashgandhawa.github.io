/* ============================================================
   AKASH GANDHAWA — PORTFOLIO
   scripts/config.js  —  Site-wide configuration

   BEFORE SHARING:
     Set SHOW_DRAFTS = false to hide all draft projects and blog posts.
     Set SHOW_DRAFTS = true  during development to see everything.

   Items marked as drafts: add data-draft="true" to any HTML element.
   ============================================================ */

const PORTFOLIO_CONFIG = {
  SHOW_DRAFTS: false,
};

// Apply immediately before rest of scripts run
if (!PORTFOLIO_CONFIG.SHOW_DRAFTS) {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-draft="true"]').forEach(el => el.remove());
  });
}
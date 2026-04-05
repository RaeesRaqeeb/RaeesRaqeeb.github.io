/* Language colour map (subset of GitHub's colours) */
const LANG_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Dockerfile: "#384d54",
  Jupyter: "#DA5B0B",
};

const GITHUB_USER = "RaeesRaqeeb";
const GITHUB_ORG = "GB-AI-Tutor";
const USER_API_URL = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`;
const ORG_API_URL = `https://api.github.com/orgs/${GITHUB_ORG}/repos?per_page=100`;
const MAX_REPOS = 12;

let allRepos = [];
let currentSort = "updated";

/* ── Fetch repos ───────────────────────────────────────────────── */
async function fetchRepos() {
  const grid = document.getElementById("repo-list");
  const errEl = document.getElementById("projects-error");

  try {
    // Fetch both personal and organization repos in parallel
    const [userRes, orgRes] = await Promise.all([
      fetch(USER_API_URL, {
        headers: { Accept: "application/vnd.github+json" },
      }),
      fetch(ORG_API_URL, {
        headers: { Accept: "application/vnd.github+json" },
      }),
    ]);

    if (!userRes.ok) {
      throw new Error(`GitHub API returned ${userRes.status} for user repos`);
    }
    if (!orgRes.ok) {
      throw new Error(`GitHub API returned ${orgRes.status} for org repos`);
    }

    const [userRepos, orgRepos] = await Promise.all([
      userRes.json(),
      orgRes.json(),
    ]);

    // Mark org repos with a badge
    const markedOrgRepos = orgRepos.map((r) => ({ ...r, isOrgRepo: true }));

    // Combine both arrays
    const combinedRepos = [...userRepos, ...markedOrgRepos];

    /* exclude forks and the profile/pages repo itself */
    allRepos = combinedRepos.filter(
      (r) => !r.fork && r.name !== `${GITHUB_USER}.github.io`
    );

    renderRepos(currentSort);
  } catch (err) {
    grid.innerHTML = "";
    errEl.hidden = false;
    errEl.textContent = `Could not load projects: ${err.message}. Please visit github.com/${GITHUB_USER} directly.`;
  }
}

/* ── Render repos ─────────────────────────────────────────────── */
function renderRepos(sortBy) {
  const grid = document.getElementById("repo-list");

  // Custom sort: Organization repos first, then by update date
  const sorted = [...allRepos].sort((a, b) => {
    // Organization repos always come first
    if (a.isOrgRepo && !b.isOrgRepo) return -1;
    if (!a.isOrgRepo && b.isOrgRepo) return 1;
    
    // Within same category, sort by criteria
    if (sortBy === "stars") {
      return b.stargazers_count - a.stargazers_count;
    }
    return new Date(b.updated_at) - new Date(a.updated_at);
  });

  const top = sorted.slice(0, MAX_REPOS);

  grid.innerHTML = top
    .map((repo) => buildCard(repo))
    .join("");
}

/* ── Build card HTML ──────────────────────────────────────────── */
function buildCard(repo) {
  const desc = repo.description
    ? escapeHtml(repo.description)
    : "<em>No description provided.</em>";

  const langColor = LANG_COLORS[repo.language] || "#8b949e";
  const langBadge = repo.language
    ? `<span class="project-lang">
        <span class="lang-dot" style="background:${langColor}"></span>
        ${escapeHtml(repo.language)}
       </span>`
    : "";

  // Add organization badge if it's an org repo
  const orgBadge = repo.isOrgRepo
    ? `<span class="org-badge" title="Organization project">🏢 GB-AI-Tutor</span>`
    : "";

  const stars =
    `<span class="project-stars" title="Stars">⭐ ${repo.stargazers_count}</span>`;
  const forks =
    `<span class="project-forks" title="Forks">🍴 ${repo.forks_count}</span>`;

  const updated = new Date(repo.updated_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });

  // Add live link for organization repos
  const liveLink = repo.isOrgRepo && repo.name.includes("gb-career-pilot")
    ? `<a class="project-live-link" href="https://raqeebs.app" target="_blank" rel="noopener noreferrer">
         🚀 Visit Live Site
       </a>`
    : "";

  return `
<article class="project-card">
  <div class="project-header">
    <h3 class="project-name">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--text-muted)" aria-hidden="true">
        <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75
          0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356
          0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25
          0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/>
      </svg>
      ${escapeHtml(repo.name)}
    </h3>
    ${orgBadge}
  </div>
  <p class="project-desc">${desc}</p>
  <div class="project-meta">
    ${langBadge}
    ${stars}
    ${forks}
    <span title="Last updated">🕒 ${updated}</span>
  </div>
  <div class="project-links">
    ${liveLink}
    <a class="project-link" href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
      View on GitHub →
    </a>
  </div>
</article>`;
}

/* ── Escape HTML to prevent XSS from API data ─────────────────── */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* ── Theme toggle ─────────────────────────────────────────────── */
function initTheme() {
  const root = document.documentElement;
  const btn = document.getElementById("theme-toggle");

  const saved = localStorage.getItem("theme") || "dark";
  root.setAttribute("data-theme", saved);

  btn.addEventListener("click", () => {
    const current = root.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
}

/* ── Sort buttons ─────────────────────────────────────────────── */
function initSortButtons() {
  document.querySelectorAll(".sort-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".sort-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentSort = btn.dataset.sort;
      renderRepos(currentSort);
    });
  });
}

/* ── Footer year ─────────────────────────────────────────────── */
function initYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

/* ── Smooth active nav highlight on scroll ───────────────────── */
function initScrollSpy() {
  const sections = document.querySelectorAll("section[id], header[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.style.color =
              link.getAttribute("href") === `#${entry.target.id}`
                ? "var(--text)"
                : "";
          });
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach((s) => observer.observe(s));
}

/* ── Init ────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initSortButtons();
  initYear();
  initScrollSpy();
  fetchRepos();
});

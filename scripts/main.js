/* ============================================================
   AKASH GANDHAWA — PORTFOLIO
   main.js  —  Terminal · Projects · GitHub · UI
   ============================================================ */

// ── INTERACTIVE TERMINAL ──
(function () {
  const termBody  = document.getElementById('terminal-body');
  const termInput = document.getElementById('terminal-input');
  if (!termBody || !termInput) return;

  let cmdHistory = [], histIdx = -1;

  // Commands are defined in terminal-commands.js
  const COMMANDS = TERMINAL_COMMANDS;

  function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || '';
  }

  function typeOutput(el, html, speed = 14) {
    return new Promise(resolve => {
      const plain = stripHtml(html);
      const span  = el.querySelector('.terminal__output');
      if (!span || !plain) { if (span) span.innerHTML = html; resolve(); return; }
      let i = 0;
      span.textContent = '';
      function next() {
        if (i < plain.length) {
          span.textContent += plain[i++];
          termBody.scrollTop = termBody.scrollHeight;
          setTimeout(next, speed);
        } else {
          span.innerHTML = html;
          termBody.scrollTop = termBody.scrollHeight;
          resolve();
        }
      }
      next();
    });
  }

  function printLine({ t, c }, instant = false) {
    const el = document.createElement('div');
    el.classList.add('terminal__line');
    if (t === 'cmd') {
      el.innerHTML = `<span class="terminal__prompt">❯</span><span class="terminal__cmd">&nbsp;${c}</span>`;
      termBody.appendChild(el);
      termBody.scrollTop = termBody.scrollHeight;
      return Promise.resolve();
    } else {
      el.innerHTML = `<span class="terminal__output"></span>`;
      termBody.appendChild(el);
      if (instant || !c) {
        el.querySelector('.terminal__output').innerHTML = c;
        termBody.scrollTop = termBody.scrollHeight;
        return Promise.resolve();
      }
      return typeOutput(el, c, 14);
    }
  }

  let typing = false;

  async function printLines(lines, instant = false) {
    typing = true;
    termInput.disabled = true;
    for (const line of lines) await printLine(line, instant);
    typing = false;
    termInput.disabled = false;
    termInput.focus();
  }

  async function runCommand(raw) {
    if (typing) return;
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    cmdHistory.unshift(raw); histIdx = -1;
    printLine({ t:'cmd', c: raw });
    if (cmd === 'clear') { termBody.innerHTML = ''; return; }
    const fn = COMMANDS[cmd];
    const lines = fn
      ? [...fn(), { t:'output', c:'' }]
      : [
          { t:'output', c:`<span style="color:#FF5F57">command not found:</span> ${cmd} — try <span class="tag">help</span>` },
          { t:'output', c:'' }
        ];
    await printLines(lines);
  }

  const bootLines = [
    { t:'output', c:'<span class="hi">Akash Gandhawa</span> · portfolio <span class="tag">v1.0.0</span>' },
    { t:'output', c:'Type <span class="tag">help</span> to see available commands.' },
    { t:'output', c:'' },
  ];
  printLines(bootLines);

  termInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      runCommand(termInput.value);
      termInput.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (histIdx < cmdHistory.length - 1) histIdx++;
      termInput.value = cmdHistory[histIdx] || '';
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx > 0) histIdx--;
      else { histIdx = -1; termInput.value = ''; return; }
      termInput.value = cmdHistory[histIdx] || '';
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const partial = termInput.value.toLowerCase();
      const match = Object.keys(COMMANDS).find(k => k.startsWith(partial));
      if (match) termInput.value = match;
    }
  });

  termBody.addEventListener('click', () => termInput.focus());
  document.querySelector('.terminal')?.addEventListener('click', () => termInput.focus());
})();


// ── SEASONAL NAV + THORANA CARD ──
(function () {
  const month = new Date().getMonth();
  const isVesakSeason = month >= 3 && month <= 5;

  const navSlot = document.getElementById('nav-vesak-slot');
  if (navSlot && isVesakSeason) {
    navSlot.innerHTML = '<a href="https://akashgandhawa.github.io/thorana" target="_blank" rel="noopener" class="nav__link--seasonal">🪷 Vesak Thorana</a>';
  }

  const STAR_ICON = `<svg viewBox="0 0 16 16" fill="currentColor" style="width:13px;height:13px"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.873 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/></svg>`;
  const FORK_ICON = `<svg viewBox="0 0 16 16" fill="currentColor" style="width:13px;height:13px"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/></svg>`;
  const CODE_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`;

  const thoranaCard = `
    <div class="project-card" data-repo="thorana">
      <div class="project-card__visual" data-lightbox-src="assets/vesak-thorana-screenshot.jpeg" data-lightbox-type="img">
        <img src="assets/vesak-thorana-screenshot.jpeg" alt="Thorana — Digital Vesak Pandal" style="width:100%;height:140px;object-fit:cover;display:block;" />
      </div>
      <div class="project-card__body">
        <div class="project-card__meta">
          <span class="project-card__meta-left">
            <span class="project-card__type">Creative Web</span>
            <span class="status-badge status-badge--released">Released</span>
          </span>
          <a href="https://github.com/AkashGandhawa/thorana" target="_blank" rel="noopener" class="project-card__arrow" title="Open repo in new tab">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        </div>
        <div class="project-card__name">Thorana</div>
        <div class="project-card__desc">A digital Pandal celebrating the Vesak Festival — a creative front-end piece merging cultural heritage with modern web design.</div>
        <a href="https://akashgandhawa.github.io/thorana" target="_blank" rel="noopener" class="project-card__live">Live site</a>
        <div class="project-card__stats">
          <span class="project-card__stat">${STAR_ICON}<span class="js-star-count">1</span> stars</span>
          <span class="project-card__stat">${FORK_ICON}<span class="js-fork-count">0</span> forks</span>
        </div>
        <div class="project-card__tags">
          <span class="lang-tag">${CODE_ICON}HTML</span>
          <span class="lang-tag">${CODE_ICON}CSS</span>
          <span class="tag--solo">Solo project</span>
        </div>
      </div>
    </div>`;

  const placeholder = document.getElementById('seasonal-card');
  if (placeholder) placeholder.outerHTML = thoranaCard;

  initLightbox();
  loadLiveProjectStats();
})();


// ── LIVE PROJECT CARD STATS ──
function loadLiveProjectStats() {
  document.querySelectorAll('.project-card[data-repo]').forEach(async card => {
    const repo     = card.dataset.repo;
    const statsRow = card.querySelector('.project-card__stats');
    const starEl   = card.querySelector('.js-star-count');
    const forkEl   = card.querySelector('.js-fork-count');
    if (!statsRow) return;
    try {
      const res = await fetch(`https://api.github.com/repos/AkashGandhawa/${repo}`);
      if (!res.ok) throw new Error('unavailable');
      const data = await res.json();
      if (starEl) starEl.textContent = data.stargazers_count;
      if (forkEl) forkEl.textContent = data.forks_count;
    } catch (e) {
      statsRow.style.display = 'none';
    }
  });
}


// ── LIGHTBOX ──
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lightbox-img');
  const lbClose  = document.getElementById('lightbox-close');
  if (!lightbox) return;

  document.querySelectorAll('.project-card__visual').forEach(el => {
    if (el.dataset.lightboxInited) return;
    el.dataset.lightboxInited = '1';
    const type = el.dataset.lightboxType;
    if (!type) return;
    el.addEventListener('click', e => {
      e.preventDefault();
      if (type === 'img') {
        const src = el.dataset.lightboxSrc || el.querySelector('img')?.src;
        if (!src) return;
        lbImg.src = src;
        lbImg.alt = el.querySelector('img')?.alt || 'Project screenshot';
      } else {
        const svg = el.querySelector('svg');
        if (!svg) return;
        const clone = svg.cloneNode(true);
        clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        lbImg.src = URL.createObjectURL(new Blob([clone.outerHTML], { type:'image/svg+xml' }));
        lbImg.alt = 'Project illustration';
      }
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lbImg.src = '';
  }
  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox || e.target === lbImg) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeLightbox(); closeBlogModal(); } });
}
initLightbox();


// ── GITHUB LIVE STATS ──
(async function () {
  const LANG_COLORS = {
    'C':'#555599','C++':'#f34b7d','TypeScript':'#3178c6','JavaScript':'#f1e05a',
    'Python':'#3572A5','HTML':'#e34c26','CSS':'#563d7c','Java':'#b07219',
    'Rust':'#dea584','Go':'#00ADD8','Shell':'#89e051'
  };

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch('https://api.github.com/users/AkashGandhawa'),
      fetch('https://api.github.com/users/AkashGandhawa/repos?per_page=100&sort=updated')
    ]);
    if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API error');
    const user  = await userRes.json();
    const repos = await reposRes.json();

    // Sidebar stats
    const repoEl = document.getElementById('gh-repos');
    if (repoEl) repoEl.textContent = user.public_repos;
    const lastRepo = repos[0];
    const updEl   = document.getElementById('gh-updated');
    const updRepo = document.getElementById('gh-updated-repo');
    if (updEl && lastRepo) {
      updEl.textContent   = new Date(lastRepo.pushed_at).toLocaleDateString('en-GB', { day:'numeric', month:'short' });
      updRepo.textContent = lastRepo.name;
    }

    // Stats panel — just repos count and top languages
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('gs-repos', user.public_repos);

    // Top languages across repos (sorted by frequency)
    const langCount = {};
    repos.forEach(r => { if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1; });
    const langs = Object.entries(langCount).sort((a,b) => b[1]-a[1]);
    const langEl = document.getElementById('gs-lang');
    if (langEl && langs.length) {
      langEl.className = 'gh-stats__card-val gh-stats__card-val--langs';
      langEl.innerHTML = langs.slice(0, 3).map(([lang]) => {
        const color = LANG_COLORS[lang] || 'var(--teal)';
        return `<span style="display:inline-flex;align-items:center;gap:4px;white-space:nowrap">
          <span style="width:8px;height:8px;border-radius:50%;background:${color};flex-shrink:0;display:inline-block"></span>${lang}
        </span>`;
      }).join('');
    }

    // Recent repos — primary language only (no extra API calls)
    const recent = repos.filter(r => r.name !== 'AkashGandhawa').slice(0, 6);
    const list = document.getElementById('gs-recent-repos');
    if (list) list.innerHTML = recent.map(r => {
      const color = r.language ? (LANG_COLORS[r.language] || 'var(--teal)') : null;
      const langChip = r.language && color
        ? `<span class="gh-repo-row__lang" style="display:inline-flex;align-items:center;gap:4px">
            <span style="width:8px;height:8px;border-radius:50%;background:${color};display:inline-block;flex-shrink:0"></span>${r.language}
          </span>`
        : '';
      return `
      <a href="${r.html_url}" target="_blank" rel="noopener" class="gh-repo-row">
        <span class="gh-repo-row__name">${r.name}</span>
        <span class="gh-repo-row__meta">
          ${langChip}
          <span class="gh-repo-row__stars">
            <svg viewBox="0 0 16 16" fill="currentColor" width="11" height="11"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.873 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/></svg>
            ${r.stargazers_count}
          </span>
          <span class="gh-repo-row__forks">
            <svg viewBox="0 0 16 16" fill="currentColor" width="11" height="11"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/></svg>
            ${r.forks_count}
          </span>
          <span class="gh-repo-row__updated">${new Date(r.pushed_at).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</span>
          <span class="gh-repo-row__ext-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="12" height="12"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </span>
        </span>
      </a>`;
    }).join('');
  } catch (e) {
    console.warn('GitHub stats unavailable:', e);
    const repoEl = document.getElementById('gs-repos');
    if (repoEl) repoEl.textContent = '—';
    const langEl2 = document.getElementById('gs-lang');
    if (langEl2) langEl2.textContent = '—';
    const list = document.getElementById('gs-recent-repos');
    if (list) list.innerHTML = '<span style="color:var(--muted);font-size:0.8rem;padding:1rem 0;display:block">Could not load repos.</span>';
  }
})();


// ── MOBILE NAV HAMBURGER ──
(function () {
  const btn   = document.getElementById('nav-hamburger');
  const links = document.getElementById('nav-links');
  if (!btn || !links) return;
  btn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
})();


// ── SCROLLSPY — full page progress bar + nav active highlight ──
(function () {
  const progressBar = document.getElementById('scroll-progress');
  const allSections = ['about','projects','blog','contact']
    .map(id => document.getElementById(id)).filter(Boolean);
  const navLinks = document.querySelectorAll('.nav__links a[data-section]');

  function update() {
    // Full-page progress bar
    if (progressBar) {
      const scrolled = window.scrollY;
      const total    = document.body.scrollHeight - window.innerHeight;
      progressBar.style.width   = total > 0 ? (scrolled / total * 100) + '%' : '0%';
      progressBar.style.opacity = scrolled > 80 ? '1' : '0';
    }

    // Nav active highlight
    const scrollMid = window.scrollY + window.innerHeight * 0.35;
    let active = null;
    allSections.forEach(sec => { if (sec.offsetTop <= scrollMid) active = sec.id; });
    navLinks.forEach(a => a.classList.toggle('active', a.dataset.section === active));
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();


// ── BACK TO TOP ──
(function () {
  const btt = document.getElementById('back-to-top');
  if (!btt) return;
  window.addEventListener('scroll', () => {
    btt.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btt.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
})();


// ── SCROLL REVEAL ──
(function () {
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  reveals.forEach(el => obs.observe(el));
})();

// ── DYNAMIC YEAR ──
document.getElementById('footer-year').textContent = new Date().getFullYear();
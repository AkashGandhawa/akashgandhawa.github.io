/* ============================================================
   AKASH GANDHAWA — PORTFOLIO
   main.js
   ============================================================ */

// ── INTERACTIVE TERMINAL ──
(function () {
  const termBody  = document.getElementById('terminal-body');
  const termInput = document.getElementById('terminal-input');
  if (!termBody || !termInput) return;

  let cmdHistory = [], histIdx = -1;

  const COMMANDS = {
    help: () => [
      { t:'output', c:'Available commands:' },
      { t:'output', c:'  <span class="tag">whoami</span>     — who is Akash?' },
      { t:'output', c:'  <span class="tag">skills</span>     — languages &amp; tools' },
      { t:'output', c:'  <span class="tag">projects</span>   — selected work' },
      { t:'output', c:'  <span class="tag">contact</span>    — get in touch' },
      { t:'output', c:'  <span class="tag">status</span>     — availability' },
      { t:'output', c:'  <span class="tag">version</span>    — portfolio version' },
      { t:'output', c:'  <span class="tag">clear</span>      — clear terminal' },
    ],
    whoami: () => [
      { t:'output', c:'<span class="hi">Akash Gandhawa</span> (W. A. G. Rodrigo)' },
      { t:'output', c:'BSc (Hons) Artificial Intelligence — University of Moratuwa, Sri Lanka' },
      { t:'output', c:'Based in Sri Lanka 🇱🇰 · Builder of useful things' },
    ],
    skills: () => [
      { t:'output', c:'<span class="tag">Languages:</span>  C · C++ · TypeScript · HTML/CSS' },
      { t:'output', c:'<span class="tag">Frameworks:</span> Next.js · Node.js · Prisma ORM' },
      { t:'output', c:'<span class="tag">Domains:</span>    AI/ML · Robotics · Embedded Systems' },
      { t:'output', c:'<span class="tag">Tools:</span>      Git · Data Structures · Algorithms' },
    ],
    projects: () => [
      { t:'output', c:'<span class="tag">StairDoc</span>         — stair-climbing delivery robot [C++]' },
      { t:'output', c:'<span class="tag">IT Ticketing</span>     — university help-desk platform [TS]' },
      { t:'output', c:'<span class="tag">TextileERP</span>       — manufacturing ERP system [C]' },
      { t:'output', c:'<span class="tag">Thorana</span>          — digital Vesak pandal [HTML/CSS]' },
      { t:'output', c:'→ <a href="#projects" style="color:var(--teal-text);text-decoration:underline;text-underline-offset:3px;">scroll down to see cards with previews</a>' },
    ],
    contact: () => [
      { t:'output', c:'<span class="tag">Email:</span>    wagandhawarodrigo@gmail.com' },
      { t:'output', c:'<span class="tag">GitHub:</span>   github.com/AkashGandhawa' },
      { t:'output', c:'<span class="tag">LinkedIn:</span> linkedin.com/in/akash-gandhawa' },
      { t:'output', c:'→ <a href="#contact" style="color:var(--teal)">jump to contact section</a>' },
    ],
    status: () => [
      { t:'output', c:'<span class="tag">$STATUS</span> = <span class="hi">Open to opportunities</span> 🟢' },
      { t:'output', c:'Seeking internships, collaborations, interesting problems.' },
    ],
    version: () => [
      { t:'output', c:'<span class="tag">portfolio</span> v1.0.0' },
      { t:'output', c:'First edition · Built with HTML, CSS &amp; vanilla JS' },
      { t:'output', c:'Hosted on GitHub Pages · © 2026 Akash Gandhawa' },
    ],
    clear: () => '__clear__',
  };

  // Strip HTML tags to get plain text for typing, then swap in real HTML
  function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || '';
  }

  // Type out plain text char-by-char, then replace with full HTML
  function typeOutput(el, html, speed = 18) {
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
          // Snap to full HTML once typing completes
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

  // Disable input while output is typing
  let typing = false;

  async function printLines(lines, instant = false) {
    typing = true;
    termInput.disabled = true;
    for (const line of lines) {
      await printLine(line, instant);
    }
    typing = false;
    termInput.disabled = false;
    termInput.focus();
  }

  async function runCommand(raw) {
    if (typing) return;
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    cmdHistory.unshift(raw); histIdx = -1;
    printLine({ t: 'cmd', c: raw });
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

  // Boot sequence with typing
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


// ── SEASONAL PROJECT CARD ──
(function () {
  const month = new Date().getMonth(); // 0=Jan…11=Dec
  const isVesakSeason = month >= 3 && month <= 5;

  // Seasonal nav link
  const navSlot = document.getElementById('nav-vesak-slot');
  if (navSlot && isVesakSeason) {
    navSlot.innerHTML = '<a href="https://akashgandhawa.github.io/thorana" target="_blank" rel="noopener" class="nav__link--seasonal">🪷 Vesak Thorana</a>';
  }

  const thoranaStatsRow = `
    <div class="project-card__stats">
      <span class="project-card__stat">
        <svg viewBox="0 0 16 16" fill="currentColor" style="width:13px;height:13px"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.873 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/></svg>
        <span class="js-star-count">1</span> star
      </span>
      <span class="project-card__stat">
        <svg viewBox="0 0 16 16" fill="currentColor" style="width:13px;height:13px"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/></svg>
        <span class="js-fork-count">0</span> forks
      </span>
    </div>`;

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
          <a href="https://github.com/AkashGandhawa/thorana" target="_blank" rel="noopener" class="project-card__arrow">↗</a>
        </div>
        <div class="project-card__name">Thorana</div>
        <div class="project-card__desc">A digital Pandal celebrating the Vesak Festival — a creative front-end piece merging cultural heritage with modern web design.</div>
        <a href="https://akashgandhawa.github.io/thorana" target="_blank" rel="noopener" class="project-card__live">Live site</a>
        ${thoranaStatsRow}
        <div class="project-card__tags">
          <span class="lang-tag"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>HTML</span>
          <span class="lang-tag"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>CSS</span>
          <span class="tag--solo">Solo project</span>
        </div>
      </div>
    </div>`;

  // Always show Thorana — seasonal card slot is now permanent
  const placeholder = document.getElementById('seasonal-card');
  if (placeholder) placeholder.outerHTML = thoranaCard;

  // Re-init lightbox for the injected card
  initLightbox();

  // Fetch live stars/forks for any card with a known public repo
  loadLiveProjectStats();
})();


// ── LIVE PROJECT CARD STATS (stars/forks only) ──
// If live data can't be fetched, hide the stats row entirely rather than show stale numbers.
function loadLiveProjectStats() {
  document.querySelectorAll('.project-card[data-repo]').forEach(async card => {
    const repo = card.dataset.repo;
    const statsRow = card.querySelector('.project-card__stats');
    const starEl   = card.querySelector('.js-star-count');
    const forkEl   = card.querySelector('.js-fork-count');
    if (!statsRow) return;

    try {
      const res = await fetch(`https://api.github.com/repos/AkashGandhawa/${repo}`);
      if (!res.ok) throw new Error('repo not found or private');
      const data = await res.json();
      if (starEl) starEl.textContent = data.stargazers_count;
      if (forkEl) forkEl.textContent = data.forks_count;
    } catch (e) {
      // Hide the stats row rather than show numbers that may be stale or wrong
      statsRow.style.display = 'none';
      console.warn(`Live stats unavailable for ${repo} — stats row hidden.`, e);
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
        lbImg.src = URL.createObjectURL(new Blob([clone.outerHTML], { type: 'image/svg+xml' }));
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
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch('https://api.github.com/users/AkashGandhawa'),
      fetch('https://api.github.com/users/AkashGandhawa/repos?per_page=100&sort=updated')
    ]);
    if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API error');
    const user  = await userRes.json();
    const repos = await reposRes.json();

    // sidebar
    const repoEl = document.getElementById('gh-repos');
    if (repoEl) repoEl.textContent = user.public_repos;
    const lastRepo = repos[0];
    const updEl   = document.getElementById('gh-updated');
    const updRepo = document.getElementById('gh-updated-repo');
    if (updEl && lastRepo) {
      updEl.textContent  = new Date(lastRepo.pushed_at).toLocaleDateString('en-GB', { day:'numeric', month:'short' });
      updRepo.textContent = lastRepo.name;
    }

    // stats panel
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('gs-repos',     user.public_repos);
    set('gs-followers', user.followers);
    set('gs-since',     new Date(user.created_at).getFullYear());

    const langCount = {};
    repos.forEach(r => { if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1; });
    const topLang = Object.entries(langCount).sort((a,b) => b[1]-a[1])[0];
    set('gs-lang', topLang ? topLang[0] : '—');

    const recent = repos.filter(r => r.name !== 'AkashGandhawa').slice(0, 5);
    const list   = document.getElementById('gs-recent-repos');
    if (list) list.innerHTML = recent.map(r => `
      <a href="${r.html_url}" target="_blank" rel="noopener" class="gh-repo-row">
        <span class="gh-repo-row__name">${r.name}</span>
        <span class="gh-repo-row__meta">
          ${r.language ? `<span class="gh-repo-row__lang">${r.language}</span>` : ''}
          <span class="gh-repo-row__stars">
            <svg viewBox="0 0 16 16" fill="currentColor" width="11" height="11"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.873 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/></svg>
            ${r.stargazers_count}
          </span>
          <span class="gh-repo-row__updated">${new Date(r.pushed_at).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</span>
        </span>
      </a>`).join('');
  } catch (e) {
    console.warn('GitHub stats unavailable:', e);
    ['gs-repos','gs-followers','gs-lang','gs-since'].forEach(id => {
      const el = document.getElementById(id); if (el) el.textContent = '—';
    });
    const list = document.getElementById('gs-recent-repos');
    if (list) list.innerHTML = '<span style="color:var(--muted);font-size:0.8rem;padding:1rem 0;display:block">Could not load repos.</span>';
  }
})();


// ── BLOG MODAL ──
const POSTS = [
  {
    slug: 'how-stairdoc-works',
    category: 'Robotics',
    date: 'June 2026',
    read: '5 min read',
    title: 'How StairDoc Climbs Stairs',
    excerpt: 'The mechanical and software challenges behind building a robot that navigates staircases autonomously.',
    body: `
      <p>StairDoc started as a straightforward idea: automate document delivery inside a multi-floor building. The twist — it needed to handle stairs.</p>
      <h3>The mechanical problem</h3>
      <p>Standard wheeled robots fail on stairs because wheels lose contact with the surface. We solved this with a rocker-bogie-inspired chassis that keeps all wheels grounded even on uneven surfaces. The key insight was distributing weight dynamically as the incline changes.</p>
      <h3>Motor control in C++</h3>
      <p>Each wheel pair is driven by a separate motor controller. The stair-climbing sequence is triggered by an ultrasonic sensor detecting a step edge. The firmware then executes a choreographed sequence: <code>RAISE_FRONT → ADVANCE → LOWER_FRONT → RAISE_REAR → ADVANCE → LOWER_REAR</code>.</p>
      <h3>What I learned</h3>
      <p>Real hardware is unforgiving. Simulation told us the design would work; the first physical prototype disagreed loudly. Iteration speed — how fast you can test, break, and fix — matters more than getting the design perfect on paper.</p>
    `
  },
  {
    slug: 'dsa-in-the-real-world',
    category: 'Engineering',
    date: 'May 2026',
    read: '4 min read',
    title: 'DSA in the Real World: Lessons from TextileERP',
    excerpt: 'What building a manufacturing ERP in C taught me about data structures beyond the classroom.',
    body: `
      <p>Most DSA courses teach you to solve competitive programming problems. TextileERP forced me to apply those concepts to messy, real-world constraints.</p>
      <h3>Linked lists for order queues</h3>
      <p>Orders in a textile factory arrive continuously and need to be processed in FIFO order — but with priority overrides for rush orders. A doubly linked list with a priority pointer turned out to be far more practical than a heap here, because insertion at arbitrary positions is O(1) once you hold a pointer.</p>
      <h3>Hash maps for inventory lookup</h3>
      <p>Inventory queries need to be fast. Scanning an array for a SKU every time an order is placed doesn't scale. Replacing the array with a hash map dropped lookup from O(n) to O(1) average case — and the difference was immediately visible at even modest data sizes.</p>
      <h3>The lesson</h3>
      <p>The right data structure isn't always the theoretically optimal one. It's the one that fits your access patterns, your team's mental model, and your maintenance budget. Choosing <code>struct</code> layouts thoughtfully in C made this concrete in a way that higher-level languages abstract away.</p>
    `
  },
  {
    slug: 'building-with-nextjs-prisma',
    category: 'Web Dev',
    date: 'April 2026',
    read: '6 min read',
    title: 'What I Learned Building a Full-Stack App Solo',
    excerpt: 'Reflections on shipping the university IT ticketing system — from schema design to deployment.',
    body: `
      <p>The university IT ticketing system was my first solo full-stack project that real users would depend on. Here's what surprised me.</p>
      <h3>Schema design is the hardest part</h3>
      <p>I rewrote the Prisma schema three times before settling on the final structure. The relationship between <code>User</code>, <code>Ticket</code>, and <code>Department</code> seems obvious in hindsight, but the first two attempts created circular dependency issues that made role-based queries painful.</p>
      <h3>Next.js App Router vs Pages Router</h3>
      <p>I chose the App Router because it was the future — and paid the price in documentation gaps and community answers that still assumed Pages Router. If I were starting today I'd still choose App Router, but I'd budget extra time for the learning curve.</p>
      <h3>The deployment gap</h3>
      <p>There's a significant gap between "it works on localhost" and "it works reliably for 50 concurrent users". Connection pooling in Prisma, environment variable management, and error boundaries all became critical only after the first real-world load test.</p>
      <h3>What I'd do differently</h3>
      <p>Write tests earlier. Not because bugs weren't caught — they were, eventually — but because tests force you to design APIs that are actually usable rather than just functional.</p>
    `
  }
];

function openBlogModal(slug) {
  const post = POSTS.find(p => p.slug === slug);
  if (!post) return;
  const modal = document.getElementById('blog-modal');
  document.getElementById('bm-category').textContent = post.category;
  document.getElementById('bm-title').textContent    = post.title;
  document.getElementById('bm-meta').textContent     = `${post.date} · ${post.read}`;
  document.getElementById('bm-body').innerHTML       = post.body;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeBlogModal() {
  const modal = document.getElementById('blog-modal');
  if (modal) { modal.classList.remove('active'); document.body.style.overflow = ''; }
}

document.getElementById('blog-modal-close')?.addEventListener('click', closeBlogModal);
document.getElementById('blog-modal')?.addEventListener('click', e => { if (e.target.id === 'blog-modal') closeBlogModal(); });


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

  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
})();

// ── SCROLLSPY + PROGRESS BAR ──
(function () {
  const progressBar = document.getElementById('scroll-progress');
  const sections    = ['about', 'projects', 'blog', 'contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const navLinks    = document.querySelectorAll('.nav__links a[data-section]');

  function onScroll() {
    // Progress bar
    if (progressBar) {
      const scrolled = window.scrollY;
      const total    = document.body.scrollHeight - window.innerHeight;
      progressBar.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0%';
    }

    // Active section highlight
    const scrollMid = window.scrollY + window.innerHeight * 0.35;
    let active = null;
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollMid) active = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.dataset.section === active);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();

// ── BACK TO TOP ──
(function () {
  const btt = document.getElementById('back-to-top');
  if (!btt) return;
  window.addEventListener('scroll', () => {
    btt.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();


// ── SCROLL REVEAL ──
(function () {
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  reveals.forEach(el => obs.observe(el));
})();
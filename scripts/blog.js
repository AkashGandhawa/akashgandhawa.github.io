/* ============================================================
   AKASH GANDHAWA — PORTFOLIO
   blog.js  —  Markdown blog engine

   Posts live in content/blog/*.md with YAML-style frontmatter.
   To add a post:
     1. Create content/blog/your-slug.md with frontmatter
     2. Add the slug to BLOG_SLUGS below
     3. No other changes needed — cards and modal update automatically
   ============================================================ */

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/AkashGandhawa/AkashGandhawa.github.io/main/content/blog';

// Add new slugs here to register new posts
const BLOG_SLUGS = [
  'how-stairdoc-works',
  'dsa-in-the-real-world',
  'building-with-nextjs-prisma',
  'zero-direct-access-recruitment',
];

// In-memory cache: slug → { meta, body }
const POST_CACHE = {};

/* ── FRONTMATTER PARSER ── */
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta = {};
  match[1].split('\n').forEach(line => {
    const colon = line.indexOf(':');
    if (colon === -1) return;
    meta[line.slice(0, colon).trim()] = line.slice(colon + 1).trim();
  });
  return { meta, body: match[2] };
}

/* ── FETCH + PARSE ── */
async function loadPost(slug) {
  if (POST_CACHE[slug]) return POST_CACHE[slug];
  const res = await fetch(`${GITHUB_RAW_BASE}/${slug}.md`);
  if (!res.ok) throw new Error(`Post not found: ${slug}`);
  const post = parseFrontmatter(await res.text());
  post.slug = slug;
  POST_CACHE[slug] = post;
  return post;
}

/* ── RENDER MARKDOWN ── */
function renderMarkdown(md) {
  return typeof marked !== 'undefined'
    ? marked.parse(md)
    : `<pre style="white-space:pre-wrap;color:var(--muted);font-size:0.82rem">${md}</pre>`;
}

/* ── POPULATE BLOG CARDS FROM FRONTMATTER ──
   Finds each .blog-card[data-slug] and fills in title, category,
   excerpt and date from the markdown frontmatter.
   Falls back gracefully — existing static content stays if fetch fails. */
async function populateBlogCards() {
  const cards = document.querySelectorAll('.blog-card[data-slug]');
  if (!cards.length) return;

  await Promise.allSettled(Array.from(cards).map(async card => {
    const slug = card.dataset.slug;
    try {
      const post = await loadPost(slug);
      const { meta } = post;

      const kicker  = card.querySelector('.blog-card__kicker');
      const title   = card.querySelector('.blog-card__title');
      const excerpt = card.querySelector('.blog-card__excerpt');
      const date    = card.querySelector('.blog-card__date');
      const read    = card.querySelector('.blog-card__read');

      if (kicker  && meta.category) kicker.textContent  = meta.category;
      if (title   && meta.title)    title.textContent    = meta.title;
      if (excerpt && meta.excerpt)  excerpt.textContent  = meta.excerpt;
      if (date    && meta.date)     date.textContent     = meta.date;
      if (read    && meta.read)     read.textContent     = meta.read + ' →';

      // Remove skeleton shimmer once loaded
      card.classList.remove('blog-card--loading');
      card.classList.add('blog-card--loaded');
    } catch (e) {
      // Leave static fallback content in place, mark as failed
      card.classList.remove('blog-card--loading');
      card.classList.add('blog-card--error');
      console.warn(`Could not load card for: ${slug}`, e);
    }
  }));
}

/* ── OPEN MODAL ── */
async function openBlogModal(slug) {
  const modal = document.getElementById('blog-modal');
  const bBody = document.getElementById('bm-body');

  document.getElementById('bm-category').textContent = '';
  document.getElementById('bm-title').textContent    = '';
  document.getElementById('bm-meta').textContent     = '';
  bBody.innerHTML = `
    <div class="blog-modal__loading">
      <div class="blog-modal__spinner"></div>
      <span>Loading…</span>
    </div>`;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  try {
    const { meta, body } = await loadPost(slug);
    document.getElementById('bm-category').textContent = meta.category || '';
    document.getElementById('bm-title').textContent    = meta.title    || slug;
    document.getElementById('bm-meta').textContent     = [meta.date, meta.read].filter(Boolean).join(' · ');
    bBody.innerHTML = renderMarkdown(body);
  } catch (e) {
    bBody.innerHTML = '<p style="color:var(--muted)">Could not load post.</p>';
    console.error(e);
  }
}

/* ── CLOSE MODAL ── */
function closeBlogModal() {
  const modal = document.getElementById('blog-modal');
  if (modal) { modal.classList.remove('active'); document.body.style.overflow = ''; }
}

document.getElementById('blog-modal-close')?.addEventListener('click', closeBlogModal);
document.getElementById('blog-modal')?.addEventListener('click', e => {
  if (e.target.id === 'blog-modal') closeBlogModal();
});

// Populate cards lazily after page load — doesn't block anything
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', populateBlogCards);
} else {
  populateBlogCards();
}
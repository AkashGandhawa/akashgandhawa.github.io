/* ============================================================
   AKASH GANDHAWA — PORTFOLIO
   blog.js  —  Markdown blog engine

   Posts live in content/blog/*.md with YAML-style frontmatter.
   To add a post:
     1. Create content/blog/your-slug.md
     2. Add a blog card in index.html with onclick="openBlogModal('your-slug')"
   No other changes needed.
   ============================================================ */

// Slugs to load — matches filenames in content/blog/
const BLOG_SLUGS = [
  'how-stairdoc-works',
  'dsa-in-the-real-world',
  'building-with-nextjs-prisma',
];

// In-memory post cache: slug → { meta, body (raw md) }
const POST_CACHE = {};

/* ── FRONTMATTER PARSER ──
   Strips the --- block and returns { meta: {}, body: string }  */
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };

  const meta = {};
  match[1].split('\n').forEach(line => {
    const colon = line.indexOf(':');
    if (colon === -1) return;
    const key = line.slice(0, colon).trim();
    const val = line.slice(colon + 1).trim();
    meta[key] = val;
  });

  return { meta, body: match[2] };
}

/* ── FETCH + PARSE a single post ── */
async function loadPost(slug) {
  if (POST_CACHE[slug]) return POST_CACHE[slug];

  const res = await fetch(`content/blog/${slug}.md`);
  if (!res.ok) throw new Error(`Post not found: ${slug}`);
  const raw = await res.text();
  const post = parseFrontmatter(raw);
  post.slug = slug;
  POST_CACHE[slug] = post;
  return post;
}

/* ── OPEN MODAL ── */
async function openBlogModal(slug) {
  const modal = document.getElementById('blog-modal');
  const bBody = document.getElementById('bm-body');

  // Show modal immediately with loading state
  document.getElementById('bm-category').textContent = '';
  document.getElementById('bm-title').textContent    = '';
  document.getElementById('bm-meta').textContent     = '';
  bBody.innerHTML = '<p style="color:var(--muted);font-size:0.85rem">Loading…</p>';
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  try {
    const post = await loadPost(slug);
    const { meta, body } = post;

    document.getElementById('bm-category').textContent = meta.category || '';
    document.getElementById('bm-title').textContent    = meta.title    || slug;
    document.getElementById('bm-meta').textContent     = [meta.date, meta.read].filter(Boolean).join(' · ');

    // marked.js converts markdown → HTML
    bBody.innerHTML = typeof marked !== 'undefined'
      ? marked.parse(body)
      : `<pre style="white-space:pre-wrap;color:var(--muted);font-size:0.82rem">${body}</pre>`;
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
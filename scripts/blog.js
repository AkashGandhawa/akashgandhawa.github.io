/* ============================================================
   AKASH GANDHAWA — PORTFOLIO
   blog.js  —  Blog post content + modal logic
   ============================================================ */

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
      <p>The university IT ticketing system was my first full-stack project that real users would depend on. Here's what surprised me.</p>
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
document.getElementById('blog-modal')?.addEventListener('click', e => {
  if (e.target.id === 'blog-modal') closeBlogModal();
});
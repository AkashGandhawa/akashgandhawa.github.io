#!/usr/bin/env node
/* ============================================================
   readtime.js  —  Calculate read time for blog posts
   ============================================================ */

const fs   = require('fs');
const path = require('path');

const BLOG_DIR   = path.join('..', 'content', 'blog');
const WPM        = 200;

const arg        = process.argv[2];
const FIX_MODE   = arg === '--fix';
const SLUG_FILTER = !FIX_MODE && arg ? arg.toLowerCase() : null;

function stripFrontmatter(raw) {
  const match = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n([\s\S]*)$/);
  return match ? match[1] : raw;
}

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function readTime(words) {
  const mins = Math.ceil(words / WPM);
  return `${mins} min read`;
}

function parseMeta(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const meta = {};
  match[1].split('\n').forEach(line => {
    const colon = line.indexOf(':');
    if (colon === -1) return;
    meta[line.slice(0, colon).trim()] = line.slice(colon + 1).trim();
  });
  return meta;
}

// ── AUTO-FIX MODE ──
if (FIX_MODE) {
  const allFiles = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));
  let fixed = 0;
  allFiles.forEach(file => {
    const filePath = path.join(BLOG_DIR, file);
    const raw      = fs.readFileSync(filePath, 'utf8');
    const body     = stripFrontmatter(raw);
    const calc     = readTime(wordCount(body));
    const updated  = raw.replace(/^(read:\s*).*$/m, `$1${calc}`);
    if (updated !== raw) {
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log(`  ✅  Updated: ${file}  →  ${calc}`);
      fixed++;
    }
  });
  console.log(fixed ? `\n  ${fixed} file(s) updated.\n` : '\n  All files already up to date.\n');
  process.exit(0);
}

// ── NORMAL MODE ──
const files = fs.readdirSync(BLOG_DIR)
  .filter(f => f.endsWith('.md'))
  .filter(f => !SLUG_FILTER || f.includes(SLUG_FILTER));

if (!files.length) {
  console.log(`No posts found${SLUG_FILTER ? ` matching "${SLUG_FILTER}"` : ''}.`);
  process.exit(0);
}

console.log('\n📖  Blog Read Time Calculator\n');
console.log(`${'Post'.padEnd(50)} ${'Words'.padStart(6)}  ${'Calculated'.padStart(12)}  ${'Frontmatter'.padStart(12)}`);
console.log('─'.repeat(86));

let needsUpdate = false;

files.forEach(file => {
  const raw      = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
  const meta     = parseMeta(raw);
  const body     = stripFrontmatter(raw);
  const words    = wordCount(body);
  const calc     = readTime(words);
  const current  = meta.read || '—';
  const mismatch = current !== calc && current !== '—';

  const flag = mismatch ? ' ⚠️' : '';
  if (mismatch) needsUpdate = true;

  const name = (meta.title || file.replace('.md', '')).slice(0, 48);
  console.log(`${name.padEnd(50)} ${String(words).padStart(6)}  ${calc.padStart(12)}  ${current.padStart(12)}${flag}`);
});

console.log('─'.repeat(86));
console.log(`\n  WPM assumed: ${WPM}  ·  ⚠️  = frontmatter read time differs from calculated`);

if (needsUpdate) {
  console.log('\n  To update frontmatter, run:');
  console.log('    node readtime.js --fix\n');
}

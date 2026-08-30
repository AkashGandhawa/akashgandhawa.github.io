/* ============================================================
   AKASH GANDHAWA — PORTFOLIO
   terminal-commands.js  —  All terminal command definitions

   Each command returns an array of line objects:
     { t: 'output', c: '<html string>' }
   Or the special string '__clear__' for the clear command.

   To add a new command: add a key here and it is automatically
   available in the terminal — no changes to main.js needed.
   ============================================================ */

const TERMINAL_COMMANDS = {

  help: () => [
    { t:'output', c:'Available commands:' },
    { t:'output', c:'  <span class="tag">whoami</span>    — who is Akash?' },
    { t:'output', c:'  <span class="tag">skills</span>    — languages &amp; tools' },
    { t:'output', c:'  <span class="tag">projects</span>  — selected work' },
    { t:'output', c:'  <span class="tag">contact</span>   — get in touch' },
    { t:'output', c:'  <span class="tag">status</span>    — availability' },
    { t:'output', c:'  <span class="tag">version</span>   — portfolio version' },
    { t:'output', c:'  <span class="tag">clear</span>     — clear terminal' },
  ],

  whoami: () => [
    { t:'output', c:'<span class="tag">name</span>       <span class="hi">Akash Gandhawa</span> (W. A. G. Rodrigo)' },
    { t:'output', c:'<span class="tag">degree</span>     BSc (Hons) Artificial Intelligence (Undergraduate)' },
    { t:'output', c:'<span class="tag">university</span> University of Moratuwa, Sri Lanka' },
    { t:'output', c:'<span class="tag">location</span>   Sri Lanka 🇱🇰' },
  ],

  skills: () => [
    { t:'output', c:'<span class="tag">languages</span>  C · C++ · TypeScript · HTML/CSS' },
    { t:'output', c:'<span class="tag">frameworks</span> Next.js · Node.js · Prisma ORM' },
    { t:'output', c:'<span class="tag">domains</span>    AI/ML · Robotics · Embedded Systems' },
    { t:'output', c:'<span class="tag">tools</span>      Git · Data Structures · Algorithms' },
  ],

  projects: () => [
    { t:'output', c:'<span class="tag">Volunteer System</span> MoraSpirit recruitment platform [TS/Next.js]' },
    { t:'output', c:'<span class="tag">Maze-Cypher</span>   autonomous micromouse robot [C/C++]' },
    { t:'output', c:'<span class="tag">Textile-ERP</span>    manufacturing ERP system [C]' },
    { t:'output', c:'<span class="tag">Thorana</span>       digital Vesak pandal [HTML/CSS]' },
    { t:'output', c:'→ visit the <a href="#projects">Projects section</a> to explore cards, screenshots &amp; live demos' },
  ],

  contact: () => [
    { t:'output', c:'<span class="tag">email</span>     wagandhawarodrigo@gmail.com' },
    { t:'output', c:'<span class="tag">github</span>    github.com/AkashGandhawa' },
    { t:'output', c:'<span class="tag">linkedin</span>  linkedin.com/in/akash-gandhawa' },
    { t:'output', c:'→ <a href="#contact">jump to contact section</a>' },
  ],

  status: () => [
    { t:'output', c:'<span class="tag">status</span>    <span class="hi">Open to opportunities</span> 🟢' },
    { t:'output', c:'<span class="tag">seeking</span>   internships · collaborations · interesting problems' },
  ],

  version: () => [
    { t:'output', c:'<span class="tag">portfolio</span>  v1.0.0' },
    { t:'output', c:'<span class="tag">stack</span>      HTML · CSS · vanilla JS' },
    { t:'output', c:'<span class="tag">host</span>       GitHub Pages' },
    { t:'output', c:'<span class="tag">author</span>    © 2026 Akash Gandhawa' },
  ],

  clear: () => '__clear__',

};
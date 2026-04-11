const VIDEO_LINKS = {
  'savings-api': { es: '#', en: '#' },
  'fittrack':    { es: '#', en: '#' },
  'juegorphg':   { es: '#', en: '#' }
};

let currentLang = 'en';
let currentSection = 0;
const totalSections = 4;

// ─── DOTS ──────────────────────────────────────────────────────
const sectionsEl = document.getElementById('sections');
const dots = document.querySelectorAll('.dot');

function updateDots() {
  const index = Math.round(sectionsEl.scrollTop / sectionsEl.clientHeight);
  if (index === currentSection) return;
  currentSection = index;
  dots.forEach((d, i) => d.classList.toggle('active', i === index));
}

function goTo(index) {
  sectionsEl.scrollTo({ top: index * sectionsEl.clientHeight, behavior: 'smooth' });
}

sectionsEl.addEventListener('scroll', updateDots, { passive: true });

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown' && currentSection < totalSections - 1) goTo(currentSection + 1);
  if (e.key === 'ArrowUp' && currentSection > 0) goTo(currentSection - 1);
});

// ─── IDIOMA ────────────────────────────────────────────────────
function setLang(lang) {
  currentLang = lang;
  document.querySelectorAll('.lang-en').forEach(el => el.classList.toggle('hidden', lang !== 'en'));
  document.querySelectorAll('.lang-es').forEach(el => el.classList.toggle('hidden', lang !== 'es'));
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`.lang-btn[onclick="setLang('${lang}')"]`).classList.add('active');
  document.getElementById('hi-text').textContent = lang === 'es' ? '// Hola, soy Nelson' : "// Hi, I'm Nelson";
  document.documentElement.lang = lang;
  updateVideoLinks(lang);
}

// ─── VIDEO LINKS ───────────────────────────────────────────────
function updateVideoLinks(lang) {
  document.querySelectorAll('.project[data-project]').forEach(project => {
    const key = project.getAttribute('data-project');
    if (!VIDEO_LINKS[key]) return;
    const videoEN = project.querySelector('.pbtn-video.lang-en');
    const videoES = project.querySelector('.pbtn-video.lang-es');
    if (videoEN) videoEN.href = VIDEO_LINKS[key].en;
    if (videoES) videoES.href = VIDEO_LINKS[key].es;
  });
}

// ─── COPY EMAIL ────────────────────────────────────────────────
function copyEmail() {
  const email = 'nelson@nelsonffkarlsson.com';
  const labels = [
    document.getElementById('copy-label'),
    document.getElementById('cta-copy-label')
  ];

  function showCopied() {
    labels.forEach(label => {
      if (!label) return;
      label.textContent = currentLang === 'es' ? 'copiado ✓' : 'copied ✓';
      label.classList.add('copied');
      setTimeout(() => {
        label.textContent = 'copy ↗';
        label.classList.remove('copied');
      }, 2000);
    });
  }

  // Funciona en HTTPS (VPS) y en local
  const el = document.createElement('textarea');
  el.value = email;
  el.setAttribute('readonly', '');
  el.style.cssText = 'position:fixed;top:-9999px;left:-9999px;';
  document.body.appendChild(el);
  el.select();
  el.setSelectionRange(0, 99999);
  try { document.execCommand('copy'); } catch(e) {}
  document.body.removeChild(el);
  showCopied();
}

// Init
updateVideoLinks('en');
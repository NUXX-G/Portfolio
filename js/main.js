const VIDEO_LINKS = {};

let currentLang = 'en';
let currentSection = 0;
const totalSections = 4;

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

document.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowDown' && currentSection < totalSections - 1) goTo(currentSection + 1);
  if (e.key === 'ArrowUp' && currentSection > 0) goTo(currentSection - 1);
});

document.getElementById('lang-switch').addEventListener('click', function(e) {
  var btn = e.target.closest('.lang-btn');
  if (!btn) return;
  setLang(btn.getAttribute('data-lang'));
});

function setLang(lang) {
  currentLang = lang;
  document.querySelectorAll('.lang-en').forEach(function(el) { el.classList.toggle('hidden', lang !== 'en'); });
  document.querySelectorAll('.lang-es').forEach(function(el) { el.classList.toggle('hidden', lang !== 'es'); });
  document.querySelectorAll('.lang-btn').forEach(function(btn) { btn.classList.toggle('active', btn.getAttribute('data-lang') === lang); });
  document.getElementById('hi-text').textContent = lang === 'es' ? '// Hola, soy Nelson' : "// Hi, I'm Nelson";
  document.documentElement.lang = lang;
  updateVideoLinks(lang);
}

function updateVideoLinks(lang) {
  document.querySelectorAll('.project[data-project]').forEach(function(project) {
    var key = project.getAttribute('data-project');
    if (!VIDEO_LINKS[key]) return;
    var videoEN = project.querySelector('.pbtn-video.lang-en');
    var videoES = project.querySelector('.pbtn-video.lang-es');
    if (videoEN) videoEN.href = VIDEO_LINKS[key].en;
    if (videoES) videoES.href = VIDEO_LINKS[key].es;
  });
}

function copyEmail() {
  var email = 'nelson@nelsonffkarlsson.com';
  var labels = [
    document.getElementById('copy-label'),
    document.getElementById('cta-copy-label')
  ];

  function showCopied() {
    labels.forEach(function(label) {
      if (!label) return;
      label.textContent = currentLang === 'es' ? 'copiado' : 'copied';
      label.classList.add('copied');
      setTimeout(function() {
        label.textContent = 'copy';
        label.classList.remove('copied');
      }, 2000);
    });
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(email).then(showCopied).catch(function() {
      fallbackCopy(email);
      showCopied();
    });
  } else {
    fallbackCopy(email);
    showCopied();
  }
}

function fallbackCopy(text) {
  var el = document.createElement('textarea');
  el.value = text;
  el.setAttribute('readonly', '');
  el.style.cssText = 'position:fixed;top:-9999px;left:-9999px;';
  document.body.appendChild(el);
  el.select();
  el.setSelectionRange(0, 99999);
  try { document.execCommand('copy'); } catch(e) {}
  document.body.removeChild(el);
}

updateVideoLinks('en');

// ─── VIDEO LINKS ───────────────────────────────────────────────
// Rellena estos links cuando tengas los vídeos listos
const VIDEO_LINKS = {
  'savings-api': {
    es: '#',   // <- pon aquí el link del vídeo en español de savings-api
    en: '#'    // <- pon aquí el link del vídeo en inglés de savings-api
  },
  'fittrack': {
    es: '#',   // <- pon aquí el link del vídeo en español de FitTrack
    en: '#'    // <- pon aquí el link del vídeo en inglés de FitTrack
  }
};
// ──────────────────────────────────────────────────────────────

let currentLang = 'es';

function setLang(lang) {
  currentLang = lang;

  // Mostrar/ocultar bloques de idioma
  document.querySelectorAll('.lang-en').forEach(el => el.classList.toggle('hidden', lang !== 'en'));
  document.querySelectorAll('.lang-es').forEach(el => el.classList.toggle('hidden', lang !== 'es'));

  // Botones de idioma activo
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`.lang-btn[onclick="setLang('${lang}')"]`).classList.add('active');

  // Texto hero
  document.getElementById('hi-text').textContent = lang === 'es' ? '// Hola, soy Nelson' : "// Hi, I'm Nelson";

  // Actualizar hrefs de los botones de vídeo
  updateVideoLinks(lang);
}

function updateVideoLinks(lang) {
  // savings-api videos
  const savingsVideoES = document.querySelector('.project:nth-child(1) .pbtn-video.lang-es');
  const savingsVideoEN = document.querySelector('.project:nth-child(1) .pbtn-video.lang-en');
  if (savingsVideoES) savingsVideoES.href = VIDEO_LINKS['savings-api'].es;
  if (savingsVideoEN) savingsVideoEN.href = VIDEO_LINKS['savings-api'].en;

  // fittrack videos
  const fittrackVideoES = document.querySelector('.project:nth-child(2) .pbtn-video.lang-es');
  const fittrackVideoEN = document.querySelector('.project:nth-child(2) .pbtn-video.lang-en');
  if (fittrackVideoES) fittrackVideoES.href = VIDEO_LINKS['fittrack'].es;
  if (fittrackVideoEN) fittrackVideoEN.href = VIDEO_LINKS['fittrack'].en;
}

// Init
updateVideoLinks('es');
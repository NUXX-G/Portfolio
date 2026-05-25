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

(function() {
  var messagesEN = document.getElementById('chat-messages-en');
  var messagesES = document.getElementById('chat-messages-es');
  var inputEN = document.getElementById('chat-input-en');
  var inputES = document.getElementById('chat-input-es');
  var sendEN = document.getElementById('chat-send-en');
  var sendES = document.getElementById('chat-send-es');

  if (!messagesEN && !messagesES) return;

  var INITIAL_EN = '> ask me anything about Nelson';
  var INITIAL_ES = '> pregúntame lo que quieras sobre Nelson';
  var THINKING_EN = '// thinking...';
  var THINKING_ES = '// pensando...';
  var ERROR_EN = '// connection error — try again';
  var ERROR_ES = '// error de conexión — inténtalo de nuevo';

  function getMessagesEl() {
    return currentLang === 'es' ? messagesES : messagesEN;
  }

  function getInputEl() {
    return currentLang === 'es' ? inputES : inputEN;
  }

  function getSendEl() {
    return currentLang === 'es' ? sendES : sendEN;
  }

  function getInitial() {
    return currentLang === 'es' ? INITIAL_ES : INITIAL_EN;
  }

  function getThinking() {
    return currentLang === 'es' ? THINKING_ES : THINKING_EN;
  }

  function getError() {
    return currentLang === 'es' ? ERROR_ES : ERROR_EN;
  }

  function setInitialMessages() {
    [messagesEN, messagesES].forEach(function(el) {
      if (el) el.innerHTML = '';
    });
    var msgEl = getMessagesEl();
    if (msgEl) {
      var div = document.createElement('div');
      div.className = 'chat-msg-user';
      div.innerHTML = getInitial() + '<span class="blink">_</span>';
      msgEl.appendChild(div);
    }
  }

  function scrollToBottom(el) {
    if (el) el.scrollTop = el.scrollHeight;
  }

  function addUserMessage(text) {
    var el = getMessagesEl();
    if (!el) return;
    var div = document.createElement('div');
    div.className = 'chat-msg-user';
    div.textContent = '> ' + text;
    el.appendChild(div);
    scrollToBottom(el);
  }

  function addLoading() {
    var el = getMessagesEl();
    if (!el) return;
    var div = document.createElement('div');
    div.className = 'chat-msg-loading';
    div.textContent = getThinking();
    el.appendChild(div);
    scrollToBottom(el);
    return div;
  }

  function replaceLoading(loadingEl, text, isError) {
    if (!loadingEl) return;
    loadingEl.className = isError ? 'chat-msg-error' : 'chat-msg-ai';
    loadingEl.textContent = text;
    var el = getMessagesEl();
    scrollToBottom(el);
  }

  function sendMessage() {
    var input = getInputEl();
    var sendBtn = getSendEl();
    if (!input) return;
    var text = input.value.trim();
    if (!text) return;

    input.value = '';
    input.disabled = true;
    if (sendBtn) sendBtn.disabled = true;

    addUserMessage(text);
    var loadingEl = addLoading();

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    })
      .then(function(res) { return res.json(); })
      .then(function(data) {
        replaceLoading(loadingEl, '// ' + (data.reply || ''), false);
      })
      .catch(function() {
        replaceLoading(loadingEl, getError(), true);
      })
      .finally(function() {
        input.disabled = false;
        if (sendBtn) sendBtn.disabled = false;
        input.focus();
      });
  }

  // Event listeners
  [inputEN, inputES].forEach(function(input) {
    if (!input) return;
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') sendMessage();
    });
  });

  [sendEN, sendES].forEach(function(btn) {
    if (!btn) return;
    btn.addEventListener('click', sendMessage);
  });

  setInitialMessages();

  // Reset messages on language switch
  var origSetLang = setLang;
  window.setLang = function(lang) {
    origSetLang(lang);
    setInitialMessages();
  };
})();

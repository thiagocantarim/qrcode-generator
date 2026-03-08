/**
 * ui.js — Controladores de interface do usuário
 *
 * Funções ligadas diretamente a eventos do HTML (onclick, oninput, onchange).
 * Atualiza o estado em S e reflete mudanças no DOM.
 *
 * Dependências: state.js
 */

// ── Tipo de conteúdo ──────────────────────────────────────────────────────────

function switchType(t) {
  S.type = t;
  document.querySelectorAll('.tab-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.type === t)
  );
  ['url', 'text', 'contact', 'wifi'].forEach(f =>
    document.getElementById('form-' + f).classList.toggle('hidden', f !== t)
  );
}

// ── Sliders (exibe valor ao lado) ─────────────────────────────────────────────

/** Atualiza o label de um slider em tempo real */
function rv(inputId, labelId, unit) {
  document.getElementById(labelId).textContent =
    document.getElementById(inputId).value + unit;
}

// ── Cores do QR ──────────────────────────────────────────────────────────────

/** Sincroniza o input de texto hex a partir do color picker */
function syncColor(which) {
  document.getElementById('color-' + which + '-hex').value =
    document.getElementById('color-' + which).value;
}

/** Sincroniza o color picker a partir do input de texto hex */
function syncColorHex(which) {
  const v = document.getElementById('color-' + which + '-hex').value;
  if (/^#[0-9a-fA-F]{6}$/.test(v))
    document.getElementById('color-' + which).value = v;
}

// ── Correção de erro ──────────────────────────────────────────────────────────

function setEC(level) {
  S.ec = level;
  ['L', 'M', 'Q', 'H'].forEach(x =>
    document.getElementById('ec-' + x).classList.toggle('active', x === level)
  );
}

// ── Logo ──────────────────────────────────────────────────────────────────────

function toggleLogo() {
  S.logoOn = !S.logoOn;
  document.getElementById('logo-switch').classList.toggle('on', S.logoOn);
  document.getElementById('logo-controls').classList.toggle('hidden', !S.logoOn);
}

function loadLogoFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    S.logoSrc = ev.target.result;
    const preview = document.getElementById('upload-preview');
    preview.src = ev.target.result;
    preview.classList.remove('hidden');
    document.querySelector('#upload-zone .upload-text').textContent = file.name;
  };
  reader.readAsDataURL(file);
}

function setLogoBorder(type) {
  S.logoBorder = type;
  ['square', 'rounded', 'circle'].forEach(x =>
    document.getElementById('lb-' + x).classList.toggle('active', x === type)
  );
}

// ── Legenda (caption) ─────────────────────────────────────────────────────────

function toggleCaption() {
  S.capOn = !S.capOn;
  document.getElementById('caption-switch').classList.toggle('on', S.capOn);
  document.getElementById('caption-controls').classList.toggle('hidden', !S.capOn);
  renderCaption();
}

function setCaptionWeight(w) {
  S.capW = w;
  ['300', '400', '600', '700'].forEach(x =>
    document.getElementById('fw-' + x).classList.toggle('active', x === w)
  );
  renderCaption();
}

function setCaptionStyle(s) {
  S.capSt = s;
  ['normal', 'italic'].forEach(x =>
    document.getElementById('fs-' + x).classList.toggle('active', x === s)
  );
  renderCaption();
}

function setCaptionAlign(a) {
  S.capAl = a;
  ['left', 'center', 'right'].forEach(x =>
    document.getElementById('fa-' + x).classList.toggle('active', x === a)
  );
  renderCaption();
}

/** Atualiza o elemento de legenda no preview e a barra de pré-visualização */
function renderCaption() {
  const cap  = document.getElementById('qr-caption');
  const prev = document.getElementById('caption-preview');
  if (!S.capOn) { cap.innerHTML = ''; return; }

  const txt = document.getElementById('caption-text').value;
  const sz  = document.getElementById('caption-size').value;
  const col = document.getElementById('caption-color').value;
  const fnt = document.getElementById('caption-font').value;
  const sp  = document.getElementById('caption-spacing').value;

  const liveStyle = `font-family:${fnt};font-size:${sz}px;color:${col};` +
    `font-weight:${S.capW};font-style:${S.capSt};text-align:${S.capAl};` +
    `letter-spacing:${sp}px;line-height:1.5;width:100%;margin-top:10px;`;

  cap.style.cssText  = liveStyle;
  cap.textContent    = txt;

  prev.style.cssText = `font-family:${fnt};font-size:${sz}px;color:${col};` +
    `font-weight:${S.capW};font-style:${S.capSt};letter-spacing:${sp}px;`;
  prev.textContent   = txt || 'Texto de exemplo';
}

// ── Cor da legenda ────────────────────────────────────────────────────────────

function syncCaptionColor() {
  document.getElementById('caption-color-hex').value =
    document.getElementById('caption-color').value;
  renderCaption();
}

function syncCaptionColorHex() {
  const v = document.getElementById('caption-color-hex').value;
  if (/^#[0-9a-fA-F]{6}$/.test(v))
    document.getElementById('caption-color').value = v;
  renderCaption();
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 2700);
}

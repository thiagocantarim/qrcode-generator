/**
 * generator.js — Geração do QR Code no DOM
 *
 * Usa a biblioteca QRCode.js para renderizar o QR no canvas,
 * aplica o overlay da logo e atualiza o estado visual da página.
 *
 * Dependências: state.js, data-builder.js, ui.js (renderCaption, showToast)
 */

const EC_MAP = {
  L: QRCode.CorrectLevel.L,
  M: QRCode.CorrectLevel.M,
  Q: QRCode.CorrectLevel.Q,
  H: QRCode.CorrectLevel.H,
};

function generateQR() {
  const data = buildData();
  if (!data) {
    showToast('⚠ Preencha os campos obrigatórios');
    return;
  }

  const size   = parseInt(document.getElementById('qr-size').value);
  const margin = parseInt(document.getElementById('qr-margin').value);
  const dk     = document.getElementById('color-dark').value;
  const lt     = document.getElementById('color-light').value;

  // Limpa e renderiza o novo QR
  const out = document.getElementById('qr-output');
  out.innerHTML = '';
  new QRCode(out, {
    text:         data,
    width:        size,
    height:       size,
    colorDark:    dk,
    colorLight:   lt,
    correctLevel: EC_MAP[S.ec],
    quietZone:    margin * 10,
    quietZoneColor: lt,
  });

  // Atualiza overlay da logo
  _updateLogoOverlay(size);

  // Exibe o resultado
  document.getElementById('empty-state').classList.add('hidden');
  const result = document.getElementById('qr-result');
  result.classList.remove('hidden');
  result.style.display = 'flex';
  document.getElementById('dl-buttons').style.display = 'grid';

  renderCaption();
  showToast('✓ QR Code gerado com sucesso!');
}

/** Atualiza o overlay de logo no preview (não no export) */
function _updateLogoOverlay(size) {
  const overlay = document.getElementById('logo-overlay');
  if (S.logoOn && S.logoSrc) {
    const pct = parseInt(document.getElementById('logo-size').value) / 100;
    const pad = parseInt(document.getElementById('logo-pad').value);
    const lsz = Math.round(size * pct);
    const borderMap = { square: '8px', rounded: '18px', circle: '50%' };

    overlay.classList.remove('hidden');
    overlay.style.cssText =
      `width:${lsz + pad * 2}px;height:${lsz + pad * 2}px;` +
      `padding:${pad}px;border-radius:${borderMap[S.logoBorder]};`;

    const img = document.getElementById('logo-img');
    img.src = S.logoSrc;
    img.style.cssText = `width:${lsz}px;height:${lsz}px;`;
  } else {
    overlay.classList.add('hidden');
  }
}

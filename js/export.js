/**
 * export.js — Exportação do QR Code (PNG, SVG, Impressão)
 *
 * Toda exportação passa por buildCompositeCanvas(), que monta
 * um canvas completo com: margem branca + QR + logo + legenda.
 * Isso garante que a borda branca do preview seja idêntica nos exports.
 *
 * Dependências: state.js, ui.js (showToast, renderCaption via S)
 */

/** Margem branca ao redor do QR — igual ao padding:12px do preview */
const QR_PAD = 12;

// ── Canvas composto (base de todos os exports) ────────────────────────────────

/**
 * Monta o canvas final com QR + bordas brancas + logo + legenda.
 * Chama callback(canvas, totalWidth, totalHeight) ao concluir.
 */
function buildCompositeCanvas(callback) {
  const qrCanvas = document.querySelector('#qr-output canvas');
  if (!qrCanvas) { showToast('⚠ Gere o QR primeiro'); return; }

  const size   = parseInt(document.getElementById('qr-size').value);
  const capTxt = S.capOn ? document.getElementById('caption-text').value : '';
  const capSz  = parseInt(document.getElementById('caption-size').value || 16);
  const extraH = capTxt ? capSz * 2 + 24 : 0;

  const totalW = size + QR_PAD * 2;
  const totalH = size + QR_PAD * 2 + extraH;

  const co  = document.createElement('canvas');
  co.width  = totalW;
  co.height = totalH;
  const ctx = co.getContext('2d');

  // Fundo branco total
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, totalW, totalH);

  // Aplica moldura ao QR via clip path
  const qrBorderRadius = { square: 0, rounded: 18, circle: size / 2 };
  const qrR = qrBorderRadius[S.qrBorder] || 0;
  if (qrR > 0) {
    ctx.save();
    _roundedRect(ctx, QR_PAD, QR_PAD, size, size, Math.min(qrR, size / 2));
    ctx.clip();
    ctx.drawImage(qrCanvas, QR_PAD, QR_PAD, size, size);
    ctx.restore();
  } else {
    ctx.drawImage(qrCanvas, QR_PAD, QR_PAD, size, size);
  }

  function finish() {
    if (capTxt) _drawCaption(ctx, capTxt, totalW, size + QR_PAD * 2, capSz);
    callback(co, totalW, totalH);
  }

  if (S.logoOn && S.logoSrc) {
    const img = new Image();
    img.onload = () => {
      const pct = parseInt(document.getElementById('logo-size').value) / 100;
      const pad = parseInt(document.getElementById('logo-pad').value);
      const lsz = Math.round(size * pct);
      const bw  = lsz + pad * 2;
      // Centro da logo considerando a margem branca do QR
      const cx  = QR_PAD + (size - bw) / 2;
      const cy  = QR_PAD + (size - bw) / 2;
      const borderRadius = { square: 0, rounded: 14, circle: bw / 2 };

      ctx.fillStyle = '#ffffff';
      _roundedRect(ctx, cx, cy, bw, bw, borderRadius[S.logoBorder]);
      ctx.fill();
      ctx.drawImage(img, cx + pad, cy + pad, lsz, lsz);
      finish();
    };
    img.src = S.logoSrc;
  } else {
    finish();
  }
}

// ── Helpers de canvas ─────────────────────────────────────────────────────────

/** Renderiza a legenda no canvas de export */
function _drawCaption(ctx, text, canvasW, yStart, fontSize) {
  const font    = document.getElementById('caption-font').value.replace(/'/g, '');
  const color   = document.getElementById('caption-color').value;
  const spacing = parseFloat(document.getElementById('caption-spacing').value || 0);
  const align   = S.capAl;

  ctx.font      = `${S.capSt} ${S.capW} ${fontSize}px ${font.split(',')[0].trim()}`;
  ctx.fillStyle = color;
  ctx.textAlign = align === 'left' ? 'left' : align === 'right' ? 'right' : 'center';

  const x = align === 'left' ? 16 : align === 'right' ? canvasW - 16 : canvasW / 2;
  const y = yStart + fontSize + 14;

  if (spacing) {
    // Renderiza caractere por caractere para espaçamento manual
    let cx = align === 'center' ? x - ctx.measureText(text).width / 2 : x;
    for (const ch of text) {
      ctx.fillText(ch, cx, y);
      cx += ctx.measureText(ch).width + spacing;
    }
  } else {
    ctx.fillText(text, x, y);
  }
}

/** Desenha um retângulo com bordas arredondadas no contexto */
function _roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function _triggerDownload(canvas, filename) {
  const a = document.createElement('a');
  a.download = filename;
  a.href     = canvas.toDataURL('image/png');
  a.click();
  showToast('⬇ Download iniciado!');
}

// ── Exportações públicas ──────────────────────────────────────────────────────

function downloadPNG() {
  setTimeout(() => {
    buildCompositeCanvas((co) => _triggerDownload(co, 'qrcode.png'));
  }, 150);
}

function downloadSVG() {
  setTimeout(() => {
    buildCompositeCanvas((co, w, h) => {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ` +
        `width="${w}" height="${h}">` +
        `<image href="${co.toDataURL('image/png')}" width="${w}" height="${h}"/>` +
        `</svg>`;
      const a = document.createElement('a');
      a.href     = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
      a.download = 'qrcode.svg';
      a.click();
      showToast('⬇ SVG exportado!');
    });
  }, 150);
}

function printQR() {
  setTimeout(() => {
    buildCompositeCanvas((co, w, h) => {
      const dataUrl = co.toDataURL('image/png');
      const win = window.open('', '_blank', 'width=600,height=700');
      win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">
        <title>QR Code — Impressão</title>
        <style>
          *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
          html, body { width:100%; height:100%; background:#fff; }
          body { display:flex; flex-direction:column; align-items:center;
                 justify-content:center; min-height:100vh; padding:40px; }
          img  { display:block; max-width:100%; height:auto; }
          @media print {
            body { padding:0; justify-content:flex-start; padding-top:32px; }
            @page { size:auto; margin:16mm; }
          }
        </style>
      </head><body>
        <img src="${dataUrl}" width="${w}" height="${h}" />
        <script>window.onload = function(){ setTimeout(() => window.print(), 400); }<\/script>
      </body></html>`);
      win.document.close();
      showToast('🖨 Enviando para impressora!');
    });
  }, 150);
}

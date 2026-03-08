/**
 * main.js — Inicialização da aplicação
 *
 * Ponto de entrada carregado por último no index.html.
 * Vincula eventos que precisam aguardar o DOM estar pronto
 * e inicializa os valores dos sliders.
 *
 * Dependências: todos os demais módulos JS.
 */

// ── Auto-prefixo de https:// no campo URL ─────────────────────────────────────
document.getElementById('url-input').addEventListener('blur', function () {
  const v = this.value.trim();
  if (v && !/^https?:\/\//i.test(v)) this.value = 'https://' + v;
});

// ── Inicializa os labels dos sliders com seus valores padrão ─────────────────
rv('qr-size',        'qr-size-val',        'px');
rv('qr-margin',      'qr-margin-val',      '');
rv('logo-size',      'logo-size-val',      '%');
rv('logo-pad',       'logo-pad-val',       'px');
rv('caption-size',   'caption-size-val',   'px');
rv('caption-spacing','caption-spacing-val','px');

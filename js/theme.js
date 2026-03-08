/**
 * theme.js — Troca de tema (claro / escuro / sistema)
 *
 * Persiste a preferência em localStorage e atualiza
 * os botões do switcher no header.
 */

function setTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('qrs-theme', t);
  ['light', 'dark', 'system'].forEach(x =>
    document.getElementById('tbtn-' + x).classList.toggle('active', x === t)
  );
}

// Aplica o tema salvo (ou 'system' como fallback) ao carregar a página
(function initTheme() {
  setTheme(localStorage.getItem('qrs-theme') || 'system');
})();

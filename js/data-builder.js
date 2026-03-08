/**
 * data-builder.js — Monta o payload de dados do QR Code
 *
 * Cada tipo de QR tem sua própria função de serialização.
 * buildData() despacha para a função correta com base em S.type.
 *
 * Dependências: state.js
 */

/** Retorna a string a ser codificada no QR, ou null se inválida */
function buildData() {
  switch (S.type) {
    case 'url':     return buildURL();
    case 'text':    return buildText();
    case 'contact': return buildContact();
    case 'wifi':    return buildWifi();
    default:        return null;
  }
}

function buildURL() {
  let u = document.getElementById('url-input').value.trim();
  if (u && !/^https?:\/\//i.test(u)) u = 'https://' + u;
  return u || null;
}

function buildText() {
  return document.getElementById('text-input').value.trim() || null;
}

function buildContact() {
  const name = document.getElementById('c-name').value.trim();
  if (!name) return null;

  const last  = document.getElementById('c-last').value.trim();
  const phone = document.getElementById('c-phone').value.trim();
  const email = document.getElementById('c-email').value.trim();
  const org   = document.getElementById('c-org').value.trim();
  const title = document.getElementById('c-title').value.trim();
  const url   = document.getElementById('c-url').value.trim();

  let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:${last};${name};;;\nFN:${name}${last ? ' ' + last : ''}\n`;
  if (phone) vcard += `TEL;TYPE=CELL:${phone}\n`;
  if (email) vcard += `EMAIL:${email}\n`;
  if (org)   vcard += `ORG:${org}\n`;
  if (title) vcard += `TITLE:${title}\n`;
  if (url)   vcard += `URL:${url}\n`;
  return vcard + 'END:VCARD';
}

function buildWifi() {
  const ssid = document.getElementById('w-ssid').value.trim();
  if (!ssid) return null;

  const pass    = document.getElementById('w-pass').value;
  const enc     = document.getElementById('w-enc').value;
  const hidden  = document.getElementById('w-hidden').value;

  // Escapa caracteres especiais do protocolo Wi-Fi
  const esc = str => str.replace(/([\\";,:])/g, '\\$1');
  return `WIFI:T:${enc};S:${esc(ssid)};P:${esc(pass)};H:${hidden};;`;
}

/**
 * state.js — Estado global da aplicação
 *
 * Único objeto mutável partilhado entre todos os módulos.
 * Nunca leia diretamente do DOM para obter estado — use S.
 */

const S = {
  type:       'url',     // 'url' | 'text' | 'contact' | 'wifi'
  ec:         'Q',       // 'L' | 'M' | 'Q' | 'H'
  qrBorder:   'square',  // 'square' | 'rounded' | 'circle'
  logoOn:     false,
  logoSrc:    null,      // base64 da imagem carregada
  logoBorder: 'square',  // 'square' | 'rounded' | 'circle'
  capOn:      false,
  capW:       '400',     // font-weight da legenda
  capSt:      'normal',  // font-style da legenda
  capAl:      'center',  // text-align da legenda
};

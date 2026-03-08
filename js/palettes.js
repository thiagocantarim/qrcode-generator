/**
 * palettes.js — Paletas de cor predefinidas
 *
 * Define as paletas disponíveis e renderiza os swatches
 * dinamicamente no grid #palette-grid.
 */

const PALETTES = [
  { d: '#000000', l: '#ffffff', n: 'Clássico'  },
  { d: '#1a1a2e', l: '#e8e0ff', n: 'Noite'     },
  { d: '#5548e8', l: '#f0eeff', n: 'Índigo'    },
  { d: '#0d7377', l: '#e6fafa', n: 'Teal'      },
  { d: '#c0392b', l: '#fff5f5', n: 'Vermelho'  },
  { d: '#b8860b', l: '#fffbee', n: 'Ouro'      },
  { d: '#2d3436', l: '#f1f3f4', n: 'Grafite'   },
  { d: '#6c3483', l: '#f5eef8', n: 'Violeta'   },
];

/** Aplica uma paleta nos inputs de cor escuro/claro */
function applyPalette(d, l) {
  document.getElementById('color-dark').value       = d;
  document.getElementById('color-dark-hex').value   = d;
  document.getElementById('color-light').value      = l;
  document.getElementById('color-light-hex').value  = l;
}

/** Renderiza os swatches de paleta no DOM */
(function initPalettes() {
  const grid = document.getElementById('palette-grid');
  PALETTES.forEach((p, i) => {
    const el = document.createElement('div');
    el.className = 'pal-sw' + (i === 0 ? ' sel' : '');
    el.title = p.n;
    el.innerHTML = `<div class="ps-d" style="background:${p.d}"></div>
                    <div class="ps-l" style="background:${p.l}"></div>`;
    el.onclick = () => {
      applyPalette(p.d, p.l);
      document.querySelectorAll('.pal-sw').forEach(s => s.classList.remove('sel'));
      el.classList.add('sel');
    };
    grid.appendChild(el);
  });
})();

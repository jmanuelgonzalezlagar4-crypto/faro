// Dibuja la palanca de metacrilato (SVG) en cualquier giro, con la bola donde esté. Medidas en mm, como en palanca.js.
const PY = 67.5;
const T = [-134.3, 186.3], S = [70, 27.8];
const ALETA = [[-104, 168], [-100.9, 158.5], [-94, 130.7], [-82.8, 108.4], [-66.2, 86.2], [-43.9, 66.7], [-21.7, 54.2], [-2.2, 50], [8.9, 61.2], [8.9, 75.2], [-104, 162.8]];
const RAIL = [[-163.5, 53.7], [40.9, 25]];
const rot = (p, g) => { const t = g * Math.PI / 180, dx = p[0], dy = p[1] - PY; return [dx * Math.cos(t) - dy * Math.sin(t), PY + dx * Math.sin(t) + dy * Math.cos(t)]; };
// win = [x0, x1, y0, y1] en mm; W = ancho en px. giro en grados desde arriba (0 = como en la foto).
function dibuja(win, W, giro, bolas, o) {
  o = o || {}; const cz = o.cazo || [60, 37.5], rb = o.rb || 12.5;
  const [x0, x1, y0, y1] = win, k = W / (x1 - x0), H = Math.round((y1 - y0) * k), X = x => ((x - x0) * k).toFixed(1), Y = y => ((y1 - y) * k).toFixed(1);
  const pts = a => a.map(p => `${X(p[0])},${Y(p[1])}`).join(' '), R = p => rot(p, giro);
  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs><radialGradient id="vid" cx="35%" cy="30%" r="70%"><stop offset="0" stop-color="#ffffff"/><stop offset="0.35" stop-color="#b9d3d8"/><stop offset="1" stop-color="#3f6b73"/></radialGradient></defs>
  <rect width="${W}" height="${H}" fill="${o.fondo || '#f6f5f1'}"/>`;
  // mesa
  s += `<rect x="0" y="${Y(0)}" width="${W}" height="${(H - +Y(0)).toFixed(1)}" fill="#c9b49a"/><line x1="0" y1="${Y(0)}" x2="${W}" y2="${Y(0)}" stroke="#9c8466" stroke-width="2"/>`;
  const acr = 'fill="rgba(160,196,214,0.35)" stroke="#6f97ab" stroke-width="1.6"';
  // base, tope de la izquierda, raíles y pilar del eje (fijos)
  s += `<rect x="${X(-178)}" y="${Y(4)}" width="${(232 * k).toFixed(1)}" height="${(4 * k).toFixed(1)}" ${acr}/>`;
  s += `<rect x="${X(-176)}" y="${Y(69.5)}" width="${(8 * k).toFixed(1)}" height="${(65.5 * k).toFixed(1)}" ${acr}/>`;
  s += `<polygon points="${pts([RAIL[0], RAIL[1], [RAIL[1][0], RAIL[1][1] - 4], [RAIL[0][0], RAIL[0][1] - 4]])}" ${acr}/>`;
  s += `<polygon points="${pts([[-6, 4], [6, 4], [3, PY], [-3, PY]])}" ${acr}/>`;
  // la palanca: aleta (la curva), brazo, cazoleta y contrapeso
  s += `<polygon points="${pts(ALETA.map(R))}" fill="rgba(160,196,214,0.30)" stroke="#5f8aa0" stroke-width="1.6"/>`;
  s += `<polyline points="${pts(ALETA.slice(0, 6).map(R))}" fill="none" stroke="${o.curva || '#2a78d6'}" stroke-width="3" stroke-linecap="round"/>`;
  const n = [-(S[1] - T[1]), S[0] - T[0]], nl = Math.hypot(...n), nu = [n[0] / nl * 3, n[1] / nl * 3];
  s += `<polygon points="${pts([[T[0] + nu[0], T[1] + nu[1]], [S[0] + nu[0], S[1] + nu[1]], [S[0] - nu[0], S[1] - nu[1]], [T[0] - nu[0], T[1] - nu[1]]].map(R))}" fill="rgba(140,180,200,0.55)" stroke="#5f8aa0" stroke-width="1.4"/>`;
  const f = cz[1] - rb - 1.6;
  s += `<polyline points="${pts([[cz[0] - rb - 1.6, f + 6], [cz[0] - rb - 1.6, f], [cz[0] + rb + 1.6, f], [cz[0] + rb + 1.6, cz[1] + 2]].map(R))}" fill="none" stroke="#5f8aa0" stroke-width="2.4" stroke-linejoin="round"/>`;
  const cw = R([64.5, 16.7]); s += `<circle cx="${X(cw[0])}" cy="${Y(cw[1])}" r="${(9 * k).toFixed(1)}" fill="#f4f1ea" stroke="#9a968c" stroke-width="1.5"/>`;
  s += `<circle cx="${X(0)}" cy="${Y(PY)}" r="${(3.2 * k).toFixed(1)}" fill="#d9dde1" stroke="#555" stroke-width="1.2"/>`;
  // bolas de vidrio
  (bolas || []).forEach(b => { s += `<circle cx="${X(b[0])}" cy="${Y(b[1])}" r="${(rb * k).toFixed(1)}" fill="url(#vid)" stroke="#2f4f55" stroke-width="1.2"/>`; });
  return { svg: s + (o.extra ? o.extra({ X, Y, k }) : '') + '</svg>', W, H, X, Y, k };
}
module.exports = { dibuja, rot, ALETA, RAIL, T, S, PY };

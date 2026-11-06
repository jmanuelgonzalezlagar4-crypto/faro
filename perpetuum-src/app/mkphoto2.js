// foto "realista" sintética: fondo con vetas, luz desigual, rueda de aro con radios, tuercas colgando, ruido y desenfoque
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage();
  const out = await pg.evaluate(() => {
    const W = 1600, H = 1200, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#d9cfc0'); g.addColorStop(1, '#8f8576'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    for (let i = 0; i < 140; i++) { x.strokeStyle = 'rgba(90,70,50,' + (0.03 + rnd() * 0.06) + ')'; x.lineWidth = 1 + rnd() * 3; x.beginPath(); const y0 = rnd() * H; x.moveTo(0, y0); x.bezierCurveTo(W / 3, y0 + rnd() * 40 - 20, 2 * W / 3, y0 + rnd() * 40 - 20, W, y0 + rnd() * 30 - 15); x.stroke(); }
    // mesa abajo
    x.fillStyle = '#6b5440'; x.fillRect(0, H * 0.9, W, H * 0.1);
    // soporte
    x.fillStyle = '#7a5c3c'; x.fillRect(780, 560, 40, 520); x.fillRect(600, 1060, 400, 30);
    const cx = 800, cy = 560, R = 330;
    // sombra
    x.strokeStyle = 'rgba(0,0,0,0.18)'; x.lineWidth = 26; x.beginPath(); x.arc(cx + 14, cy + 16, R, 0, 7); x.stroke();
    x.strokeStyle = '#a87b4f'; x.lineWidth = 24; x.beginPath(); x.arc(cx, cy, R, 0, 7); x.stroke();
    x.strokeStyle = '#5e4128'; x.lineWidth = 2; x.beginPath(); x.arc(cx, cy, R + 12, 0, 7); x.stroke(); x.beginPath(); x.arc(cx, cy, R - 12, 0, 7); x.stroke();
    x.strokeStyle = '#9a6f45'; x.lineWidth = 10;
    for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3 + 0.2; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + (R - 10) * Math.cos(a), cy + (R - 10) * Math.sin(a)); x.stroke(); }
    x.fillStyle = '#444'; x.beginPath(); x.arc(cx, cy, 22, 0, 7); x.fill();
    // 8 brazos con tuerca: en un lado abiertos, en el otro colgando
    const n = 8, L = 150, truth = [];
    for (let k = 0; k < n; k++) {
      const th = -Math.PI / 2 + k * 2 * Math.PI / n; const hx = cx + R * Math.cos(th), hy = cy + R * Math.sin(th);
      const open = Math.cos(th) > 0.1; const a = open ? th : Math.PI / 2 + 0.25 * Math.cos(th);
      const ex = hx + L * Math.cos(a), ey = hy + L * Math.sin(a); truth.push([Math.round(ex), Math.round(ey)]);
      x.strokeStyle = '#c9c9c9'; x.lineWidth = 7; x.beginPath(); x.moveTo(hx, hy); x.lineTo(ex, ey); x.stroke();
      x.fillStyle = '#222'; x.beginPath(); x.arc(hx, hy, 7, 0, 7); x.fill();
      // tuerca hexagonal con agujero y brillo
      x.fillStyle = 'rgba(0,0,0,0.25)'; x.beginPath(); for (let i = 0; i < 6; i++) { const q = i * Math.PI / 3 + 0.3; x.lineTo(ex + 8 + 42 * Math.cos(q), ey + 10 + 42 * Math.sin(q)); } x.fill();
      const gg = x.createRadialGradient(ex - 12, ey - 12, 4, ex, ey, 44); gg.addColorStop(0, '#e8e8e8'); gg.addColorStop(1, '#6d6d6d');
      x.fillStyle = gg; x.beginPath(); for (let i = 0; i < 6; i++) { const q = i * Math.PI / 3 + 0.3; x.lineTo(ex + 40 * Math.cos(q), ey + 40 * Math.sin(q)); } x.closePath(); x.fill();
      x.fillStyle = '#3a3a3a'; x.beginPath(); x.arc(ex, ey, 14, 0, 7); x.fill();
    }
    // objetos sueltos en el fondo
    x.fillStyle = '#4a6b8a'; x.fillRect(120, 820, 160, 220); x.fillStyle = '#c0392b'; x.beginPath(); x.arc(1400, 980, 60, 0, 7); x.fill();
    // ruido
    const id = x.getImageData(0, 0, W, H), d = id.data;
    for (let i = 0; i < d.length; i += 4) { const nn = (rnd() - 0.5) * 34; d[i] += nn; d[i + 1] += nn; d[i + 2] += nn; }
    x.putImageData(id, 0, 0);
    const c2 = document.createElement('canvas'); c2.width = W; c2.height = H; const y = c2.getContext('2d'); y.filter = 'blur(1.2px)'; y.drawImage(c, 0, 0);
    return { url: c2.toDataURL('image/jpeg', 0.82), truth };
  });
  fs.writeFileSync('maqueta-prueba2.jpg', Buffer.from(out.url.split(',')[1], 'base64'));
  console.log(JSON.stringify(out.truth));
  await b.close();
})();

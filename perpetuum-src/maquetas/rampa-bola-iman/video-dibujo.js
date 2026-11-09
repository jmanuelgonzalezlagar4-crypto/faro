// Configuración del vídeo de la rampa como la dibujó el usuario. Uso: CONFIG=video-dibujo.js node video.js
const fs = require('fs'), path = require('path'), { BASE } = require('./dibujo-usuario.js');
const R = fs.readFileSync(path.join(__dirname, 'barrido-dibujo.jsonl'), 'utf8').trim().split('\n').map(JSON.parse), mejor = R.find(r => r.n === 655).o;
module.exports = {
  salida: 'rampa-dibujo.mp4', titulo: 'La rampa de su dibujo, en el banco',
  casos: [
    { o: Object.assign({}, BASE, { v0: 0, x0: 0.2, ideal: false }), et: 'Su dibujo, sin empujón', pie: 'Como en su dibujo' },
    { o: Object.assign({}, BASE, { v0: 1.2, x0: 0.05, ideal: false }), et: 'Su dibujo, con un empujón de 1,2 m/s', pie: 'Como en su dibujo' },
    { o: mejor, et: 'La mejor de 2.000 variantes de su dibujo (con roce)', pie: 'Variante nº 655' }],
  tramos: [
    { dur: 6, t: f => 0, tx: 'Su dibujo: una C grande a la izquierda que acaba encima del principio de la rampa, y una rampa de vuelta empinada que empieza más allá del final, debajo del imán. Lo alto de la C va justo por encima del principio de la rampa: en el dibujo iba unos 8 cm más arriba, más alto que donde cae la bola.' },
    { dur: 11, t: f => 2.2 * f, vel: 'cámara lenta ×5', tx: 'Arriba a la izquierda: sin empujón, el imán, a 15 cm del final, no tira lo bastante y la bola se vuelve. Arriba a la derecha: con un empujón de 1,2 m/s cae por el final, baja por la vuelta y sube por la C, pero le faltan 45 mm para pasarla. Abajo: la mejor de 2.000 variantes sí vuelve a la rampa, pero sin fuerza.' },
    { dur: 5, t: f => 2.2 + 4.8 * f, vel: 'velocidad normal', tx: 'La de abajo llega justo al principio de la rampa, se vuelve y se queda yendo y viniendo por abajo. Ninguna vuelve a llegar al final.' },
    { dur: 8, t: f => 7, tx: 'En 2.000 variantes de su dibujo, 8 bolas vuelven a la rampa una vez, todas con empujones de 0,8 a 1,4 m/s, y ninguna cae otra vez. Sin empujón, ninguna llega a la C. Para pasar por lo alto de la C la bola va boca abajo y necesita velocidad, y eso cuesta más de lo que gana al caer.' }]
};

const E = require('./engine.js'); global.PerpetuumEngine = E;
const Bd = require('./build.js');
function run(d, secs) { const w = Bd.build(d).world; for (let i = 0; i < 480 * secs; i++) w.step(); const b = w.balance(); return `gridIn=${b.gridIn.toFixed(2)} gridOut=${b.gridOut.toFixed(2)} bat=${b.battery.toFixed(2)} bus=${b.bus.toFixed(3)} heat=${b.heat.toFixed(2)} err=${b.error.toFixed(4)} meter=${JSON.stringify(w.meter, (k, v) => typeof v === 'number' ? +v.toFixed(2) : v)}`; }
let d = Bd.EXAMPLES.electro.make(); d.parts.find(p => p.shape === 'electro').esrc = 'grid'; console.log('electro red:', run(d, 10));
d = Bd.EXAMPLES.bucle.make(); const w0 = d.parts[0]; w0.msrc = 'grid'; w0.gdest = 'grid'; console.log('bucle red:', run(d, 10));
d = Bd.EXAMPLES.bucle.make(); d.parts[0].motor = false; d.parts[0].gdest = 'grid'; d.parts[0].bearing = 'bolas'; d.air = false; console.log('volante → red:', run(d, 30));

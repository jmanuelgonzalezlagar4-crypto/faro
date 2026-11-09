# La figura de la leva eficiente y el volante (leva-volante.png): la forma de las dos levas, las vueltas de las levas
# del barrido y lo que hace el volante. Uso: python3 figura-leva.py (lee leva-*.jsonl, volante-*.json y leva.csv)
import json, glob, math, matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

SURF, INK, INK2, GRID = '#fcfcfb', '#0b0b0b', '#52514e', '#e4e3df'
BLUE, ORANGE, AQUA, GRAY, LIGHT = '#2a78d6', '#eb6834', '#1baf7a', '#9a9893', '#c9c7c0'
plt.rcParams.update({'font.size': 10.5, 'axes.edgecolor': GRID, 'axes.labelcolor': INK2, 'xtick.color': INK2, 'ytick.color': INK2,
                     'axes.spines.top': False, 'axes.spines.right': False, 'font.family': 'DejaVu Sans'})
R = [json.loads(l) for f in sorted(glob.glob('leva-*.jsonl')) for l in open(f) if l.strip()]
vale = lambda r: r['solapes'] == 0 and r['suelto'] < (0.1 if r['leva']['prof'] == 'rampa' else 0.01)
def busca(**k): return [r for r in R if all(r['leva'].get(a) == b for a, b in k.items())]
def mejor(rs): rs = [r for r in rs if vale(r)]; return max(rs, key=lambda r: r['vueltas'])
app = busca(prof='rampa', lift=0.0165, thDrop=0, rr=0.002, pre=0.15)[0]
fil = [
    ('La de la app: rampa de 16,5 mm,\nrodillos de 4 mm', app, LIGHT),
    ('La mejor rampa\n(rodillos 608)', mejor([r for r in R if r['leva']['prof'] == 'rampa']), GRAY),
    ('Una leva redonda (no sube),\nrodillos 608', mejor(busca(lift=0, rr=0.011)), GRAY),
    ('Lisa de 12 mm con rodillos de 4 mm', mejor(busca(prof='lisa', lift=0.012, rr=0.002)), GRAY),
    ('La elegida: lisa de 12 mm,\nrodillos 608, muelles de 1 N', busca(prof='lisa', lift=0.012, thPeak=20, rr=0.011, pre=0.1)[0], ORANGE),
]
V = [json.load(open(f'volante-{i}.json')) for i in range(6)]

fig = plt.figure(figsize=(13, 10.5), facecolor=SURF)
gs = fig.add_gridspec(2, 2, width_ratios=[1, 1.35], height_ratios=[1, 1], hspace=0.42, wspace=0.62)
gb = gs[1, :].subgridspec(1, 2, wspace=0.06)

# 1. las dos levas vistas de frente, con la línea de salida (φ = 0) y el sentido de giro
ax = fig.add_subplot(gs[0, 0]); ax.set_facecolor(SURF); ax.set_aspect('equal'); ax.axis('off')
def rampa(phi, lift=16.5, rmax=47.5, caida=4, dr=0.065):
    v = (math.radians(phi - caida) + 2 * math.pi * (1 - dr)) % (2 * math.pi); P1 = 2 * math.pi * (1 - dr)
    s = v / P1 if v <= P1 else (1 + math.cos((v - P1) / (2 * dr))) / 2
    return rmax - lift + lift * s
el = [tuple(map(float, l.split(','))) for l in open('leva.csv').read().split('\n')[1:] if l]
th = [math.radians(a) for a, _ in el]
ax.add_patch(plt.Circle((0, 0), 50, fc='none', ec=LIGHT, lw=1, ls=(0, (3, 3))))
ax.plot([rampa(math.degrees(t)) * math.cos(t) for t in th] + [rampa(0)], [rampa(math.degrees(t)) * math.sin(t) for t in th] + [0], color=GRAY, lw=2, label='La de la app (rampa)')
ax.plot([r * math.cos(t) for t, (_, r) in zip(th, el)] + [el[0][1]], [r * math.sin(t) for t, (_, r) in zip(th, el)] + [0], color=ORANGE, lw=2.4, label='La elegida (lisa, 12 mm)')
ax.plot([0, 56], [0, 0], color=INK2, lw=1); ax.text(57, -1, 'línea (0°)', va='center', fontsize=9, color=INK2)
a20 = math.radians(20); ax.plot([0, 52 * math.cos(a20)], [0, 52 * math.sin(a20)], color=ORANGE, lw=0.8, ls=(0, (2, 2)))
ax.text(53 * math.cos(a20), 53 * math.sin(a20) + 2, 'lo más alto (20°)', fontsize=9, color=INK2)
ax.annotate('', xy=(-50, -14), xytext=(-40, -36), arrowprops=dict(arrowstyle='->', color=INK2, lw=1.2, connectionstyle='arc3,rad=-0.25'))   # agujas del reloj
ax.text(-62, -52, 'gira como las agujas\ndel reloj, mirando\nla cara de la ranura', fontsize=9, color=INK2)
ax.set_xlim(-62, 85); ax.set_ylim(-62, 62)
ax.legend(frameon=False, loc='upper center', fontsize=9.5, labelcolor=INK, bbox_to_anchor=(0.5, -0.0), ncol=2)
ax.set_title('Las dos levas, vistas desde la cara de la ranura\n(el círculo de puntos es el rodillo, Ø100 mm)', loc='left', color=INK, fontsize=11)

# 2. vueltas con el empujón de 300 rpm, sin volante
ax = fig.add_subplot(gs[0, 1]); ax.set_facecolor(SURF)
y = list(range(len(fil)))[::-1]
v = [f[1]['vueltas'] for f in fil]
ax.barh(y, v, color=[f[2] for f in fil], height=0.62)
for yi, vi in zip(y, v): ax.text(vi + 0.08, yi, f'{vi:.2f}'.replace('.', ','), va='center', color=INK, fontsize=10)
ax.set_yticks(y); ax.set_yticklabels([f[0] for f in fil], color=INK, fontsize=9.5); ax.set_xlim(0, max(v) * 1.15)
ax.grid(axis='x', color=GRID, lw=0.8); ax.set_axisbelow(True)
ax.set_title(f'Vueltas con un empujón de 300 rpm, sin volante ({len(R)} levas probadas)\nel rodillo de PLA (unos 400 g) con la flecha única', loc='left', color=INK, fontsize=11)

# 3. el volante: vueltas y lo que gasta en cada vuelta
for k, (clave, titulo, fmt) in enumerate([
        (lambda r: r['real']['vueltas'], 'Vueltas hasta pararse', '{:.1f}'),
        (lambda r: r['real']['gastado_mJ'] / r['real']['vueltas'], 'Energía que gasta en cada vuelta (mJ)', '{:.0f}')]):
    ax = fig.add_subplot(gb[0, k]); ax.set_facecolor(SURF)
    nombres = ['Leva de la app,\nsin volante', 'Leva de la app,\ncon volante', 'Leva elegida,\nsin volante', 'Leva elegida,\ncon volante',
               'Leva elegida, con volante,\nla misma energía', 'Sin imanes, leva elegida,\ncon volante']
    cols = [LIGHT, GRAY, ORANGE, BLUE, AQUA, '#e4e3df']
    v = [clave(r) for r in V]; y = list(range(len(V)))[::-1]
    ax.barh(y, v, color=cols, height=0.62, edgecolor=[INK2 if c == '#e4e3df' else c for c in cols], lw=0.6)
    for yi, vi in zip(y, v): ax.text(vi + max(v) * 0.015, yi, fmt.format(vi).replace('.', ','), va='center', color=INK, fontsize=10)
    ax.set_xlim(0, max(v) * 1.18)
    ax.set_yticks(y)
    if k == 0: ax.set_yticklabels(nombres, color=INK, fontsize=9.5)
    else: ax.tick_params(axis='y', left=False, labelleft=False)
    ax.grid(axis='x', color=GRID, lw=0.8); ax.set_axisbelow(True)
    ax.set_title(titulo + (', empujón de 300 rpm\n(«la misma energía»: 154 rpm con volante = 300 sin él)' if k == 0 else '\n(menos es mejor)'), loc='left', color=INK, fontsize=11)
fig.text(0.01, 0.005, 'Banco Taller Perpetuum · flecha única de 19 pares que acaba justo en la línea donde empieza · bloques N35 de 10 × 6 × 3 mm · '
         'volante Ø170 mm con 16 tuercas M12 (1,6 g·m²)', color=INK2, fontsize=9)
fig.savefig('leva-volante.png', dpi=110, facecolor=SURF, bbox_inches='tight')
print('leva-volante.png')

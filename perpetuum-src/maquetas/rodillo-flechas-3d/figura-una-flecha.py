# La figura de «una sola flecha que acaba y empieza en el mismo punto» (una-flecha.png).
# Uso: python3 figura-una-flecha.py (lee una-flecha-0.json ... una-flecha-4.json)
import json, matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

R = [json.load(open(f'una-flecha-{i}.json')) for i in range(5)]
SURF, INK, INK2, GRID = '#fcfcfb', '#0b0b0b', '#52514e', '#e4e3df'
COL = ['#2a78d6', '#eb6834', '#1baf7a', '#9a9893', '#c9c7c0']
CORTO = ['Dos flechas de 9 pares\n(el que se imprime)', 'Una flecha de 19 pares\nque acaba y empieza en el mismo punto',
         'Una flecha de 18 pares\nsin cerrar', 'Sin imanes,\nleva de una punta', 'Sin imanes,\nleva de dos puntas']
plt.rcParams.update({'font.size': 11, 'axes.edgecolor': GRID, 'axes.labelcolor': INK2, 'xtick.color': INK2, 'ytick.color': INK2,
                     'axes.spines.top': False, 'axes.spines.right': False, 'font.family': 'DejaVu Sans'})
fig = plt.figure(figsize=(12, 9.2), facecolor=SURF)
gs = fig.add_gridspec(2, 2, height_ratios=[1.1, 1.1], hspace=0.62, wspace=0.08)

ax = fig.add_subplot(gs[0, :]); ax.set_facecolor(SURF)
for i in range(3):
    U = R[i]['perfil']['U']
    ax.plot([p[0] for p in U], [p[1] for p in U], color=COL[i], lw=2, label=CORTO[i].replace('\n', ' '))
ax.set_xlim(0, 360); ax.set_xticks(range(0, 361, 30)); ax.set_ylim(bottom=0)
ax.set_xlabel('Giro del cilindro en una vuelta entera (grados)')
ax.set_ylabel('Energía de los imanes (mJ)')
ax.grid(axis='y', color=GRID, lw=0.8); ax.set_axisbelow(True)
ax.legend(frameon=False, loc='lower left', bbox_to_anchor=(0, 1.0), ncol=3, labelcolor=INK, fontsize=10, handlelength=1.6, columnspacing=1.4)
ax.set_title('Lo que notan los imanes del cilindro en una vuelta, con los palos quietos lo más cerca\n'
             'Donde la curva sube, el cilindro tiene que empujar; donde baja, los imanes le empujan. Todas acaban donde empezaron.',
             loc='left', color=INK, fontsize=12, pad=30)

prim = None
for k, (clave, titulo, fmt) in enumerate([
        (lambda r: r['real']['vueltas'], 'Vueltas con un empujón de 300 rpm\n(más es mejor)', '{:.2f}'),
        (lambda r: r['minimo_rpm'], 'Empujón mínimo para dar una vuelta, en rpm\n(menos es mejor)', '{:.0f}')]):
    ax = fig.add_subplot(gs[1, k], sharey=prim); ax.set_facecolor(SURF)
    if prim is None: prim = ax
    v = [clave(r) for r in R]; y = [5.4, 4.2, 3.0, 1.6, 0.4]
    ax.barh(y, v, color=COL, height=0.8)
    for yi, vi in zip(y, v): ax.text(vi + max(v) * 0.015, yi, fmt.format(vi).replace('.', ','), va='center', color=INK, fontsize=10)
    ax.set_xlim(0, max(v) * 1.18)
    if k == 0: ax.set_yticks(y); ax.set_yticklabels(CORTO, color=INK, fontsize=10)
    else: ax.tick_params(axis='y', left=False, labelleft=False)
    ax.grid(axis='x', color=GRID, lw=0.8); ax.set_axisbelow(True)
    ax.set_title(titulo, loc='left', color=INK, fontsize=11)
fig.text(0.01, 0.005, 'Banco Taller Perpetuum · rodillo de flechas de la app (latón Ø100 × 130 mm, palos con imán de ferrita, una punta de leva por flecha, '
         'muelles) con bloques N35 de 10 × 6 × 3 mm a ras', color=INK2, fontsize=9)
fig.savefig('una-flecha.png', dpi=110, facecolor=SURF, bbox_inches='tight')
print('una-flecha.png')

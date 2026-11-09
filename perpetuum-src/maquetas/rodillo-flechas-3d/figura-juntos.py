# La figura de «¿mejor con los imanes más juntos?»: la cuesta de los imanes en media vuelta, las vueltas con roce y el
# empujón mínimo, con los bloques de 10 × 6 × 3 mm. Uso: python3 figura-juntos.py
import json, matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

perf = json.load(open('perfil-bloques.json'))
din = json.load(open('juntos-bloques.json'))
SURF, INK, INK2, GRID = '#fcfcfb', '#0b0b0b', '#52514e', '#e4e3df'
SER = ['#2a78d6', '#eb6834', '#1baf7a', '#6250d6']
GRAY = '#9a9893'
plt.rcParams.update({'font.size': 11, 'axes.edgecolor': GRID, 'axes.labelcolor': INK2, 'xtick.color': INK2, 'ytick.color': INK2,
                     'axes.spines.top': False, 'axes.spines.right': False, 'font.family': 'DejaVu Sans'})
fig = plt.figure(figsize=(12, 8.4), facecolor=SURF)
gs = fig.add_gridspec(2, 2, height_ratios=[1.15, 1], hspace=0.62, wspace=0.08)

def nombre(o):
    if o.get('sin'): return 'Sin imanes en el cilindro'
    giro = ' (girados)' if o['bloque']['w'] < 0.008 else ''
    return f"{o['pasos']} pares por flecha{giro}"

# 1. la cuesta en media vuelta (una flecha); se repite igual en la otra mitad
ax = fig.add_subplot(gs[0, :]); ax.set_facecolor(SURF)
for i, r in enumerate(perf):
    U = [p for p in r['U'] if p[0] <= 180]
    ax.plot([p[0] for p in U], [p[1] for p in U], color=SER[i], lw=2, label=nombre(r['o']) + (' · como lo imprimes' if i == 0 else ''))
ax.set_xlim(0, 180); ax.set_xticks(range(0, 181, 20))
ax.set_xlabel('Giro del cilindro (grados): una flecha entera; en la otra mitad se repite igual')
ax.set_ylabel('Energía de los imanes (mJ)')
ax.grid(axis='y', color=GRID, lw=0.8); ax.set_axisbelow(True)
ax.set_ylim(0, 10.5)
ax.legend(frameon=False, loc='lower left', bbox_to_anchor=(0, 1.0), ncol=4, labelcolor=INK, fontsize=10, handlelength=1.6, columnspacing=1.4)
ax.set_title('Lo que notan los imanes del cilindro al girar, con los palos quietos lo más cerca\n'
             'Donde la curva sube, el cilindro tiene que empujar; donde baja, los imanes le empujan. Acaba donde empezó.',
             loc='left', color=INK, fontsize=12, pad=30)

# 2 y 3. con el roce de la app: vueltas con 300 rpm y empujón mínimo para dar una vuelta
casos = [nombre(r['o']) for r in din]
prim = None
cols = [SER[i] if i < 4 else GRAY for i in range(len(din))]
for k, (clave, titulo, fmt) in enumerate([
        (lambda r: r['real']['vueltas'], 'Vueltas con un empujón de 300 rpm\n(más es mejor)', '{:.2f}'),
        (lambda r: r['minimo_rpm'], 'Empujón mínimo para dar una vuelta, en rpm\n(menos es mejor)', '{:.0f}')]):
    ax = fig.add_subplot(gs[1, k], sharey=prim if k else None); ax.set_facecolor(SURF)
    if not k: prim = ax
    v = [clave(r) for r in din]; y = list(range(len(din)))[::-1]
    ax.barh(y, v, color=cols, height=0.62)
    for yi, vi in zip(y, v): ax.text(vi + max(v) * 0.015, yi, fmt.format(vi).replace('.', ','), va='center', color=INK, fontsize=10)
    ax.set_xlim(0, max(v) * 1.18)
    if not k: ax.set_yticks(y); ax.set_yticklabels(casos, color=INK)
    else: ax.tick_params(axis='y', left=False, labelleft=False)
    ax.grid(axis='x', color=GRID, lw=0.8); ax.set_axisbelow(True)
    ax.set_title(titulo, loc='left', color=INK, fontsize=11)
fig.text(0.01, 0.005, 'Banco Taller Perpetuum · rodillo de flechas de la app (latón Ø100 × 130 mm, palos con imán de ferrita, levas y muelles) '
         'con bloques de neodimio N35 de 10 × 6 × 3 mm metidos a ras', color=INK2, fontsize=9)
fig.savefig('juntos.png', dpi=110, facecolor=SURF, bbox_inches='tight')
print('juntos.png')

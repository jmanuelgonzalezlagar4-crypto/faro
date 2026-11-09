# La vuelta del rodillo desenrollada, a escala, con los huecos numerados (vista.png). La vista 3D la hace vista3d.js.
# Uso: python3 vista.py rodillo-flechas [mm a lo largo de la vuelta] [mm a lo largo del eje]  (bloques de 10 x 6 mm si no se dice)
import sys, csv, numpy as np, trimesh, matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
nombre = sys.argv[1] if len(sys.argv) > 1 else 'rodillo-flechas'
tm = trimesh.load(nombre + '.stl', process=False)
H = [r for r in csv.DictReader(open(nombre + '-huecos.csv'))]
LV = float(sys.argv[2]) if len(sys.argv) > 2 else 10.0
LE = float(sys.argv[3]) if len(sys.argv) > 3 else 6.0
fig = plt.figure(figsize=(12, 5.4), dpi=130)
R = float(abs(tm.vertices[:, 0]).max())
import numpy as _np
L = float(tm.vertices[:, 2].max())
ax2 = fig.add_subplot(1, 1, 1)
for r in H:
    th, z, fl, par = float(r['angulo_grados']) % 360, float(r['posicion_mm_desde_el_centro']), int(r['flecha']), int(r['par'])
    gv = LV * 360 / (2 * np.pi * R)   # el largo a lo largo de la vuelta, en grados
    ax2.add_patch(plt.Rectangle((th - gv / 2, z - LE / 2), gv, LE, color='#2a78d6' if fl == 1 else '#eb6834', alpha=0.9))
    if z > 0: ax2.text(th, z + 8, str(par), ha='center', fontsize=8, color='#52514e')
nfl0 = max(int(r['flecha']) for r in H)
for k in range(nfl0 + 1):   # la línea donde empieza (y acaba) cada flecha
    ax2.axvline(k * 360 / nfl0, color='#9a9893', lw=0.9, ls=(0, (4, 3)))
ax2.set_xlim(-15, 375); ax2.set_ylim(-L / 2, L / 2); ax2.set_aspect(360 / (2 * np.pi * R))   # 1 mm a lo largo del eje = 1 mm a lo largo de la vuelta
ax2.axhline(0, color='#c9c7c0', lw=0.8)
ax2.set_xlabel('ángulo alrededor del eje (°); 0° = la ranura de la cara de arriba', fontsize=10)
ax2.set_ylabel('posición a lo largo del eje (mm, 0 = el centro)', fontsize=10)
nfl, npar = max(int(r['flecha']) for r in H), max(int(r['par']) for r in H)
quien = 'Flecha 1 en azul, flecha 2 en naranja' if nfl == 2 else ('Una sola flecha' if nfl == 1 else f'{nfl} flechas')
ax2.set_title(f'La vuelta desenrollada, a escala. {quien}, pares 1 a {npar}. Imanes de {LV:g} x {LE:g} mm', fontsize=12)
plt.tight_layout(); plt.savefig('vista.png' if nombre == 'rodillo-flechas' else nombre + '-vista.png')

# Vista previa del rodillo (vista.png): la pieza en perspectiva y la vuelta desenrollada con los huecos numerados.
# Uso: python3 vista.py rodillo-flechas
import sys, csv, numpy as np, trimesh, matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d.art3d import Poly3DCollection
nombre = sys.argv[1] if len(sys.argv) > 1 else 'rodillo-flechas'
tm = trimesh.load(nombre + '.stl', process=False)
H = [r for r in csv.DictReader(open(nombre + '-huecos.csv'))]
fig = plt.figure(figsize=(14, 6.2), dpi=120)
ax = fig.add_subplot(1, 2, 1, projection='3d')
v, f = tm.vertices, tm.faces
tri = v[f]
n = np.cross(tri[:, 1] - tri[:, 0], tri[:, 2] - tri[:, 0]); n /= np.linalg.norm(n, axis=1)[:, None] + 1e-12
luz = np.array([0.4, -0.6, 0.7]); luz /= np.linalg.norm(luz)
sh = 0.35 + 0.65 * np.clip(n @ luz, 0, 1)
col = np.c_[0.42 * sh, 0.62 * sh, 0.78 * sh, np.ones_like(sh)]
pc = Poly3DCollection(tri, facecolors=col, edgecolors='none'); ax.add_collection3d(pc)
R = np.abs(v[:, 0]).max(); L = v[:, 2].max()
ax.set_xlim(-R, R); ax.set_ylim(-R, R); ax.set_zlim(L / 2 - R, L / 2 + R); ax.set_box_aspect((1, 1, 1))
ax.view_init(elev=18, azim=-60); ax.set_axis_off()
ax.set_title('Rodillo de flechas para imprimir (de pie)', fontsize=13)
ax2 = fig.add_subplot(1, 2, 2)
for r in H:
    th, z, fl, par = float(r['angulo_grados']), float(r['posicion_mm_desde_el_centro']), int(r['flecha']), int(r['par'])
    ax2.add_patch(plt.Circle((th, z), 5.5 * 360 / (2 * np.pi * R), color='#2a78d6' if fl == 1 else '#eb6834', alpha=0.85))
    if z > 0: ax2.text(th, z + 8, str(par), ha='center', fontsize=8, color='#52514e')
ax2.set_xlim(-15, 360); ax2.set_ylim(-L / 2, L / 2); ax2.set_aspect(360 / (2 * np.pi * R))
ax2.axhline(0, color='#c9c7c0', lw=0.8)
ax2.set_xlabel('ángulo alrededor del eje (°); 0° = la ranura de la cara de arriba', fontsize=10)
ax2.set_ylabel('posición a lo largo del eje (mm, 0 = el centro)', fontsize=10)
ax2.set_title('La vuelta desenrollada: flecha 1 (azul) y flecha 2 (naranja), pares 1 a 9', fontsize=12)
plt.tight_layout(); plt.savefig('vista.png' if nombre == 'rodillo-flechas' else nombre + '-vista.png')

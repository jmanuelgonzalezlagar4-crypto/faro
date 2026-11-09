# La leva del rodillo de flechas para imprimir en 3D. Se atornilla a una cara del rodillo (rodillo.py --tornillos) con
# 3 tornillos M3; los agujeros no son simétricos, así que solo encaja de una manera. La misma pieza sirve para las dos
# caras: se imprimen dos. Su forma es la del banco (leva.js): radio en cada ángulo φ del rodillo (φ = 0 en la ranura de
# la cara de arriba, el mismo ángulo que rodillo-*-huecos.csv).
#  - lisa: sube y baja poco a poco; lo más alto en φ = --punta;
#  - rampa: sube poco a poco toda la vuelta y cae en --ancho-caida grados a partir de φ = --caida.
# Uso: python3 leva.py --prof lisa --subida 8 --punta 0 [--salida leva]
import argparse, math, numpy as np, manifold3d as m3, trimesh, sys

p = argparse.ArgumentParser()
p.add_argument('--prof', choices=['lisa', 'rampa'], default='lisa')
p.add_argument('--subida', type=float, default=8.0, help='lo que sube el rodillo del palo, de lo más bajo a lo más alto (mm)')
p.add_argument('--radio', type=float, default=47.5, help='radio en lo más alto (mm); el de la app es 47,5')
p.add_argument('--punta', type=float, default=0.0, help='lisa: ángulo de lo más alto (grados)')
p.add_argument('--caida', type=float, default=4.0, help='rampa: ángulo donde empieza a caer (grados)')
p.add_argument('--ancho-caida', type=float, default=23.4, help='rampa: lo que dura la caída (grados)')
p.add_argument('--flechas', type=int, default=1, help='una punta por flecha')
p.add_argument('--grueso', type=float, default=8.0, help='mm; el rodillo del palo (un rodamiento 608 mide 7) corre por su canto')
p.add_argument('--eje', type=float, default=8.3, help='agujero del eje (mm)')
p.add_argument('--salida', default='leva')
a = p.parse_args()
TORNILLOS, TORN_R = (30.0, 140.0, 250.0), 30.0   # los mismos que rodillo.py --tornillos

def forma(phi):
    """De 0 (lo más bajo) a 1 (lo más alto), como camShape del banco."""
    L = a.flechas
    if a.prof == 'lisa':
        return (1 + math.cos(L * math.radians(phi - a.punta))) / 2
    dr = a.ancho_caida * L / 360.0
    v = (L * math.radians(phi - a.caida) + 2 * math.pi * (1 - dr)) % (2 * math.pi)
    P1 = 2 * math.pi * (1 - dr)
    return v / P1 if v <= P1 else (1 + math.cos((v - P1) / (2 * dr))) / 2

N = 1440
radio = [a.radio - a.subida + a.subida * forma(i * 360.0 / N) for i in range(N)]
pts = [(r * math.cos(math.radians(i * 360.0 / N)), r * math.sin(math.radians(i * 360.0 / N))) for i, r in enumerate(radio)]
leva = m3.Manifold.extrude(m3.CrossSection([pts]), a.grueso)
cortes = [m3.Manifold.cylinder(a.grueso + 2, a.eje / 2, a.eje / 2, 64).translate((0, 0, -1))]
for ang in TORNILLOS:
    x, y = TORN_R * math.cos(math.radians(ang)), TORN_R * math.sin(math.radians(ang))
    cortes.append(m3.Manifold.cylinder(a.grueso + 2, 1.7, 1.7, 32).translate((x, y, -1)))   # paso del M3
# la marca de φ = 0 (se pone frente a la ranura del rodillo): una raya en las dos caras
rmin = min(radio)
for z0 in (-0.5, a.grueso - 0.6):
    cortes.append(m3.Manifold.cube((rmin - 6.0 - 8.0, 1.2, 1.1)).translate((8.0, -0.6, z0)))
pieza = leva - m3.Manifold.batch_boolean(cortes, m3.OpType.Add)
mesh = pieza.to_mesh()
tm = trimesh.Trimesh(vertices=np.asarray(mesh.vert_properties)[:, :3], faces=np.asarray(mesh.tri_verts), process=False)
if not tm.is_watertight: print('NO CERRADA'); sys.exit(1)
tm.export(a.salida + '.stl'); tm.export(a.salida + '.3mf')
with open(a.salida + '.csv', 'w') as fh:
    fh.write('angulo_grados,radio_mm\n')
    for i in range(0, N, 4): fh.write(f'{i * 360.0 / N:g},{radio[i]:.3f}\n')
print(f'{a.salida}: leva {a.prof}, sube {a.subida:g} mm (radio {min(radio):.1f} a {max(radio):.1f} mm), {a.grueso:g} mm de grueso, '
      f'{tm.volume / 1000:.1f} cm³ (unos {tm.volume / 1000 * 1.24:.0f} g de PLA macizo)')

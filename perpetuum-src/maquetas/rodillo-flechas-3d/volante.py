# Volante de inercia para el rodillo de flechas, para imprimir en 3D: un disco con huecos para tuercas de acero cerca del
# borde (lo que pesa lejos del eje es lo que cuenta). Se atornilla por fuera de una de las levas con los mismos 3 tornillos
# M3 (más largos), que pasan por el volante y la leva y se roscan en el rodillo. Tiene 6 agujeros (los 3 y los mismos
# vistos del revés), así que vale para cualquiera de las dos caras; en cada cara solo se usan los 3 que coinciden. Un cubo de --separacion mm lo aparta de la
# leva para que quepa el brazo que sujeta el rodillo del palo.
# Por defecto: Ø170 mm (cabe en todas las Bambu), 16 tuercas M12 (DIN 934: 19 mm entre caras, 10 mm de alto, unos 16 g).
# Sale en la postura de imprimir: la cara de las tuercas abajo, en la cama, y el cubo arriba; sin soportes.
# Uso: python3 volante.py [--diametro 170] [--tuercas 16] [--entrecaras 19] [--alto-tuerca 10] [--cerrado] [--salida volante]
import argparse, math, numpy as np, manifold3d as m3, trimesh, sys

p = argparse.ArgumentParser()
p.add_argument('--diametro', type=float, default=170.0)
p.add_argument('--grueso', type=float, default=14.0, help='grueso del disco (mm)')
p.add_argument('--separacion', type=float, default=10.0, help='alto del cubo que lo aparta de la leva (mm)')
p.add_argument('--tuercas', type=int, default=16)
p.add_argument('--entrecaras', type=float, default=19.0, help='de la tuerca (mm): M12 DIN 934 = 19, M12 ISO = 18, M10 DIN = 17')
p.add_argument('--alto-tuerca', type=float, default=10.0)
p.add_argument('--masa-tuerca', type=float, default=16.3, help='g, solo para las cuentas')
p.add_argument('--holgura', type=float, default=0.25)
p.add_argument('--cerrado', action='store_true', help='huecos cerrados por arriba: la impresora para en la capa donde se cierran y se meten las tuercas')
p.add_argument('--eje', type=float, default=8.3)
p.add_argument('--salida', default='volante')
a = p.parse_args()
TORNILLOS, TORN_R = (30.0, 140.0, 250.0), 30.0   # los mismos que rodillo.py --tornillos y leva.py
R, G, S = a.diametro / 2, a.grueso, a.separacion
ec = a.entrecaras + a.holgura
r_hex = ec / math.sqrt(3)                     # del centro de la tuerca a una esquina
r_t = R - r_hex - 6.0                         # las tuercas, con 6 mm de pared hasta el borde
paso = 2 * math.pi * r_t / a.tuercas
if paso < 2 * r_hex + 2.0: print(f'No caben {a.tuercas} tuercas: hay {paso:.1f} mm entre centros'); sys.exit(1)
# el disco (z de S a S + G) y el cubo (z de 0 a S), que apoya en la leva
disco = m3.Manifold.cylinder(G, R, R, 256).translate((0, 0, S)) + m3.Manifold.cylinder(S + 0.01, 36.0, 36.0, 128)
cortes = [m3.Manifold.cylinder(S + G + 2, a.eje / 2, a.eje / 2, 64).translate((0, 0, -1))]
# los 3 agujeros y los mismos vistos del revés: así el volante va en cualquiera de las dos caras
for ang in sorted(set(TORNILLOS) | {(360.0 - t) % 360.0 for t in TORNILLOS}):
    x, y = TORN_R * math.cos(math.radians(ang)), TORN_R * math.sin(math.radians(ang))
    cortes.append(m3.Manifold.cylinder(S + G + 2, 1.7, 1.7, 32).translate((x, y, -1)))
    # rebaje para la cabeza: quedan 6 mm de plástico bajo ella
    cortes.append(m3.Manifold.cylinder(S + G, 3.2, 3.2, 32).translate((x, y, 6.0)))
hh = a.alto_tuerca + 0.3
z_hex = S + G - hh if not a.cerrado else S + G - hh - 1.2   # abiertos por fuera, o con 1,2 mm de techo
hexa = m3.Manifold.extrude(m3.CrossSection.circle(r_hex, 6), hh if not a.cerrado else hh)
for k in range(a.tuercas):
    th = 2 * math.pi * k / a.tuercas
    cortes.append(hexa.rotate((0, 0, math.degrees(th))).translate((r_t * math.cos(th), r_t * math.sin(th), z_hex)))
pieza = disco - m3.Manifold.batch_boolean(cortes, m3.OpType.Add)
# se guarda ya en la postura de imprimir: la cara de las tuercas en la cama y el cubo arriba (así no cuelga nada).
# Es media vuelta alrededor de x; los 6 agujeros siguen en su sitio (son los mismos del derecho y del revés).
pieza = pieza.transform([[1, 0, 0, 0], [0, -1, 0, 0], [0, 0, -1, S + G]])
mesh = pieza.to_mesh()
tm = trimesh.Trimesh(vertices=np.asarray(mesh.vert_properties)[:, :3], faces=np.asarray(mesh.tri_verts), process=False)
if not tm.is_watertight: print('NO CERRADA'); sys.exit(1)
tm.export(a.salida + '.stl'); tm.export(a.salida + '.3mf')
# cuentas: las tuercas como puntos; el plástico con un 30 % de relleno efectivo (paredes y relleno), como disco
m_t = a.tuercas * a.masa_tuerca / 1000
I_t = m_t * (r_t / 1000) ** 2
m_p = tm.volume / 1e9 * 1240 * 0.30
I_p = 0.5 * m_p * (R / 1000) ** 2
print(f'{a.salida}: Ø{a.diametro:g} mm, {a.tuercas} tuercas de {a.entrecaras:g} mm entre caras a {r_t:.1f} mm del centro'
      f'{" (huecos cerrados: parar en la capa de " + format(z_hex + hh, ".1f") + " mm)" if a.cerrado else ""}')
print(f'   pesa unos {1000 * (m_t + m_p):.0f} g ({1000 * m_t:.0f} g de tuercas); inercia unos {1e3 * (I_t + I_p):.2f} g·m² '
      f'(las tuercas {1e3 * I_t:.2f}); el rodillo de PLA con sus imanes, unos 0,5 g·m²')

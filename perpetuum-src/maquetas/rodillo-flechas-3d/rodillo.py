# Rodillo de flechas para imprimir en 3D (Bambu Lab): el cilindro de la maqueta del usuario con los huecos de los
# imanes hechos, para meterlos a mano. Misma colocación que el ejemplo «Rodillo de flechas» de la app:
#  - 2 flechas por vuelta, 9 pares en cada una, uno cada 20°: las 18 posiciones de la vuelta;
#  - en cada par, dos imanes a ±«abre» del centro a lo largo del eje; abre va de 6 mm (par cerrado) a 50 mm (abierto);
#    donde acaba abierta una flecha empieza cerrada la otra.
# Se imprime de pie (el eje en vertical). Los huecos son horizontales y llevan un chaflán en la boca para que el imán
# entre fácil. Los imanes pueden ser bloques (10 x 6 x 3 mm, polos en las caras grandes) o discos; los huecos de disco
# llevan un pico de 45° arriba para que salgan redondos sin soportes.
# Uso: python3 rodillo.py [--forma bloque --iman-largo 10 --iman-ancho 6 --iman-h 3] [--holgura 0.2] [--eje 8] [--rodamiento]
#      python3 rodillo.py --probeta   (la pieza de prueba de los huecos)
import argparse, math, numpy as np, manifold3d as m3, trimesh

p = argparse.ArgumentParser()
p.add_argument('--diametro', type=float, default=100.0, help='diámetro del cilindro (mm)')
p.add_argument('--largo', type=float, default=130.0, help='largo del cilindro (mm)')
p.add_argument('--forma', choices=['bloque', 'disco'], default='bloque', help='imán en bloque (rectangular) o en disco')
p.add_argument('--iman-largo', type=float, default=10.0, help='bloque: lado largo (mm)')
p.add_argument('--iman-ancho', type=float, default=6.0, help='bloque: lado corto (mm)')
p.add_argument('--largo-en', choices=['vuelta', 'eje'], default='vuelta', help='bloque: el lado largo a lo largo de la vuelta o del eje')
p.add_argument('--iman-d', type=float, default=11.0, help='disco: diámetro (mm)')
p.add_argument('--iman-h', type=float, default=3.0, help='grueso del imán, entre sus dos polos (mm)')
p.add_argument('--holgura', type=float, default=0.2, help='lo que el hueco es más ancho que el imán (mm, en el diámetro)')
p.add_argument('--fondo-extra', type=float, default=0.2, help='lo que el hueco es más hondo que el imán (mm)')
p.add_argument('--min', type=float, default=6.0, help='separación del par cerrado: del centro a cada imán (mm)')
p.add_argument('--max', type=float, default=50.0, help='separación del par abierto: del centro a cada imán (mm)')
p.add_argument('--flechas', type=int, default=2)
p.add_argument('--pares', type=int, default=9)
p.add_argument('--eje', type=float, default=8.0, help='diámetro de la varilla del eje (mm); 0 = sin agujero')
p.add_argument('--holgura-eje', type=float, default=0.3)
p.add_argument('--rodamiento', action='store_true', help='asientos para rodamientos 608 (22 x 7 mm) en las dos caras')
p.add_argument('--sin-pico', action='store_true', help='huecos redondos del todo (sin el pico de 45°)')
p.add_argument('--segmentos', type=int, default=256)
p.add_argument('--salida', default='rodillo-flechas')
p.add_argument('--probeta', action='store_true', help='solo la pieza de prueba: un taco con 3 huecos de holgura 0,1, 0,2 y 0,3 mm')
a = p.parse_args()

R, L = a.diametro / 2, a.largo
dh = a.iman_h + a.fondo_extra                                            # fondo del hueco

def a_trimesh(man):
    mesh = man.to_mesh()
    return trimesh.Trimesh(vertices=np.asarray(mesh.vert_properties)[:, :3], faces=np.asarray(mesh.tri_verts), process=False)

seg = a.segmentos
cuerpo = m3.Manifold.cylinder(L, R, R, seg)                              # de z = 0 a z = L

def orienta(man, th, base_r, z):
    """Lleva una pieza hecha a lo largo de +Z local (con +Y local hacia arriba) a la posición radial th, empezando en
    el radio base_r y a la altura z."""
    c, s = math.cos(th), math.sin(th)
    ex, ey, ez = (-s, c, 0.0), (0.0, 0.0, 1.0), (c, s, 0.0)
    t = (base_r * c, base_r * s, z)
    M = [[ex[0], ey[0], ez[0], t[0]], [ex[1], ey[1], ez[1], t[1]], [ex[2], ey[2], ez[2], t[2]]]
    return man.transform(M)

def hacer_hueco(hol):
    """El hueco de un imán, a lo largo de +Z local desde el fondo (z = 0) hasta fuera, con +Y local hacia arriba
    (a lo largo del eje del rodillo) y +X local a lo largo de la vuelta. Lleva un chaflán en la boca."""
    if a.forma == 'disco':
        r = (a.iman_d + hol) / 2
        sec = m3.CrossSection.circle(r, 96)
        if not a.sin_pico: sec = sec + m3.CrossSection.square((r, r)).rotate(45.0)   # pico de 45° hacia arriba
        h = m3.Manifold.extrude(sec, dh + 3.0)
        return h + m3.Manifold.cylinder(1.6, r, r + 1.6, 96).translate((0, 0, dh - 0.3))
    lx, ly = (a.iman_largo, a.iman_ancho) if a.largo_en == 'vuelta' else (a.iman_ancho, a.iman_largo)
    lx, ly = lx + hol, ly + hol
    h = m3.Manifold.cube((lx, ly, dh + 3.0)).translate((-lx / 2, -ly / 2, 0))
    ch = m3.Manifold.extrude(m3.CrossSection.square((lx, ly)).translate((-lx / 2, -ly / 2)), 1.6, 1, 0.0, ((lx + 3.2) / lx, (ly + 3.2) / ly))
    return h + ch.translate((0, 0, dh - 0.3))
hueco = hacer_hueco(a.holgura)
tam_hueco = (f'{a.iman_d + a.holgura:.2f} mm de diámetro' if a.forma == 'disco' else
             f'{(a.iman_largo if a.largo_en == "vuelta" else a.iman_ancho) + a.holgura:.2f} mm a lo largo de la vuelta x '
             f'{(a.iman_ancho if a.largo_en == "vuelta" else a.iman_largo) + a.holgura:.2f} mm a lo largo del eje')

if a.probeta:
    # taco de pie, como el rodillo: tres huecos en la cara de delante, con holgura 0,1, 0,2 y 0,3 mm, en la misma
    # postura que en el rodillo; encima de cada uno, 1, 2 o 3 marcas para saber cuál es
    import sys
    ancho, fondo, alto = 66.0, dh + 6.0, 24.0
    taco = m3.Manifold.cube((ancho, fondo, alto))
    cortes = []
    for i, hol in enumerate((0.1, 0.2, 0.3)):
        x = 11.0 + 22.0 * i
        # hueco hacia -Y (la cara de delante, y = 0): Z local → -Y, Y local → +Z, X local → -X
        cortes.append(hacer_hueco(hol).transform([[-1, 0, 0, x], [0, 0, -1, dh], [0, 1, 0, alto / 2 - 1.5]]))
        for j in range(i + 1): cortes.append(m3.Manifold.cube((1.2, 1.2, 1.0)).translate((x - 2.4 * i / 2 + 2.4 * j - 0.6, fondo / 2 - 0.6, alto - 0.8)))
    t = a_trimesh(taco - m3.Manifold.batch_boolean(cortes, m3.OpType.Add))
    if not t.is_watertight: print('NO CERRADA'); sys.exit(1)
    t.export('probeta-huecos.stl'); t.export('probeta-huecos.3mf')
    print(f'probeta-huecos: tres huecos como el del rodillo ({tam_hueco} con holgura 0,2), con holgura 0,1, 0,2 y 0,3 mm '
          f'(1, 2 y 3 marcas), {dh:.2f} mm de fondo')
    sys.exit(0)

huecos, lista = [], []
paso = 360.0 / a.flechas / a.pares
for f in range(a.flechas):
    for k in range(a.pares):
        th_deg = f * 360.0 / a.flechas + k * paso
        abre = a.min + (a.max - a.min) * k / (a.pares - 1)
        for sz in (-1, 1):
            z = L / 2 + sz * abre
            huecos.append(orienta(hueco, math.radians(th_deg), R - dh, z))
            lista.append((f + 1, k + 1, th_deg, round(sz * abre, 2)))
cortes = m3.Manifold.batch_boolean(huecos, m3.OpType.Add)

if a.eje > 0:
    re = (a.eje + a.holgura_eje) / 2
    cortes = cortes + m3.Manifold.cylinder(L + 2, re, re, 96).translate((0, 0, -1))
if a.rodamiento:
    for z0 in (-1.0, L - 7.0):
        cortes = cortes + m3.Manifold.cylinder(8.0, 11.05, 11.05, 128).translate((0, 0, z0))
# marca en la cara de arriba: una ranura donde empieza cerrada la primera flecha (0°)
marca = m3.Manifold.cube((8.0, 1.6, 1.6)).translate((R - 12.0, -0.8, L - 0.8))
cortes = cortes + marca

pieza = cuerpo - cortes
# (trimesh sin procesar: si junta vértices muy cercanos, la pieza deja de estar cerrada)
tm = a_trimesh(pieza)
import sys
if not tm.is_watertight: print('NO CERRADA'); sys.exit(1)
tm.export(a.salida + '.stl')
tm.export(a.salida + '.3mf')
vol = tm.volume / 1000.0
print(f'{a.salida}: {len(lista)} huecos de {tam_hueco}, {dh:.2f} mm de fondo; cilindro {a.diametro:g} x {a.largo:g} mm; '
      f'volumen {vol:.0f} cm³ (macizo, unos {vol * 1.24:.0f} g de PLA; con relleno, bastante menos)')
with open(a.salida + '-huecos.csv', 'w') as fh:
    fh.write('flecha,par,angulo_grados,posicion_mm_desde_el_centro\n')
    for r in lista: fh.write(f'{r[0]},{r[1]},{r[2]:g},{r[3]:g}\n')

# Rodillo de flechas para imprimir en 3D

El cilindro de la maqueta del usuario, con los huecos de los imanes ya hechos para meterlos a mano. Los archivos son
`.3mf` (en milímetros) y `.stl`, y Bambu Studio abre cualquiera de los dos.

## Archivos

| Archivo | Qué es |
|---|---|
| `rodillo-flechas.3mf`, `.stl` | El rodillo, para imanes de 10 x 6 x 3 mm |
| `probeta-huecos.3mf`, `.stl` | La pieza de prueba: tres huecos iguales a los del rodillo, con holgura 0,1, 0,2 y 0,3 mm |
| `rodillo-flechas-huecos.csv` | Dónde va cada imán: flecha, par, ángulo y posición desde el centro |
| `vista3d.png`, `vista.png`, `probeta-3d.png` | El rodillo en 3D, la vuelta desenrollada a escala y la pieza de prueba |
| `rodillo.py`, `vista.py`, `vista3d.js` | Para generarlo todo con otras medidas |

## Qué es

Es la misma colocación que el ejemplo «Rodillo de flechas» de la app:

- **El cilindro:** 100 mm de diámetro y 130 mm de largo.
- **Las flechas:** 2 por vuelta, con 9 pares de imanes cada una, uno cada 20°. Ocupan las 18 posiciones de la vuelta.
- **Los pares:** en cada par, los dos imanes van a ±«abre» del centro, a lo largo del eje. «Abre» va de 6 mm (par
  cerrado) a 50 mm (abierto). Donde acaba abierta una flecha empieza cerrada la otra. En total, 36 imanes.
- **Los imanes:** son bloques de 10 x 6 x 3 mm, con los polos en las caras grandes (de 10 x 6). Cada imán va tumbado,
  con el lado de 10 mm a lo largo de la vuelta y el de 6 mm a lo largo del eje.
  - En el par cerrado, los dos imanes quedan a 6 mm uno del otro.
  - Entre un par y el siguiente quedan unos 7 mm de plástico.
- **Los huecos:**
  - miden 10,2 x 6,2 mm (0,2 mm de holgura) y 3,2 mm de fondo, así que el imán queda 0,2 mm por debajo de la
    superficie;
  - van hacia fuera, hacia el eje;
  - llevan un chaflán en la boca para que el imán entre fácil.
- **El agujero del eje:** de 8,3 mm, para una varilla de 8 mm, atraviesa el cilindro de punta a punta. Si se pide,
  lleva también asientos para rodamientos 608 en las dos caras.
- **La marca:** una ranura en la cara de arriba, a 0°, donde empieza cerrada la primera flecha. Sirve para poner las
  levas a punto. Visto desde la cara de la ranura, las flechas se abren en el sentido contrario a las agujas del reloj.

## Cómo imprimirlo

- **De pie**, tal como sale: el eje en vertical.
  - Los huecos quedan de lado, y su techo es un puente corto de 10 mm, que la Bambu hace sin soportes.
  - No hacen falta soportes ni borde.
- **Material y ajustes:** PLA, capas de 0,2 mm, 3 paredes y relleno del 15 al 20 % (giroide).
- **Peso:** macizo pesaría 1,25 kg de PLA. Con ese relleno pesa bastante menos, y dura varias horas.
- **Antes, la pieza de prueba**, igual, de pie (unos pocos gramos).
  - Tiene 1, 2 y 3 marcas encima de los huecos de holgura 0,1, 0,2 y 0,3 mm.
  - Se elige la holgura en que el imán entra con la mano y no se cae.
  - Si no es la de 0,2 mm, se vuelve a generar el rodillo con `--holgura`.

## Los imanes

- **Todos con el mismo polo hacia fuera**, como en la app: el norte (en la imagen de la tienda, la cara roja).
  - Antes de meterlos, se comprueba con una brújula o con un imán ya marcado.
  - Si se pone uno al revés, ese par empuja en vez de atraer.
- **Se empujan hasta el fondo.** Si alguno queda flojo, una gota de pegamento.

## Generarlo con otras medidas (`rodillo.py`)

Necesita Python con `manifold3d` y `trimesh` (`pip install manifold3d trimesh lxml networkx`).

```bash
python3 rodillo.py                                          # imanes de 10 x 6 x 3, holgura 0,2, varilla de 8 mm
python3 rodillo.py --holgura 0.3                            # si la pieza de prueba pide más holgura
python3 rodillo.py --probeta                                # la pieza de prueba
python3 rodillo.py --largo-en eje                           # el lado de 10 mm a lo largo del eje
python3 rodillo.py --eje 8 --rodamiento                     # con asientos para rodamientos 608
python3 rodillo.py --iman-largo 12 --iman-ancho 6 --iman-h 2   # otros bloques
python3 rodillo.py --forma disco --iman-d 10 --iman-h 3     # imanes de disco
python3 vista.py rodillo-flechas && node vista3d.js rodillo-flechas vista3d.png   # las vistas
```

Todo se puede cambiar: el diámetro y el largo del cilindro, la separación de los pares (`--min` y `--max`), el número
de flechas y de pares, y el fondo extra del hueco.

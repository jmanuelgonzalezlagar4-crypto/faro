# Rodillo de flechas para imprimir en 3D

El cilindro de la maqueta del usuario, con los huecos de los imanes ya hechos para meterlos a mano. Sale en `.3mf` y
`.stl`, que Bambu Studio abre directamente.

## Qué es

Es la misma colocación que el ejemplo «Rodillo de flechas» de la app:

- **El cilindro:** 100 mm de diámetro y 130 mm de largo.
- **Las flechas:** 2 por vuelta, con 9 pares de imanes cada una, uno cada 20°. Ocupan las 18 posiciones de la vuelta.
- **Los pares:** en cada par, los dos imanes van a ±«abre» del centro, a lo largo del eje. «Abre» va de 6 mm (par
  cerrado) a 50 mm (abierto). Donde acaba abierta una flecha empieza cerrada la otra. En total, 36 imanes.
- **Los huecos:** van hacia fuera, hacia el eje. El imán queda 0,2 mm por debajo de la superficie, en el centro del
  hueco.
- **El agujero del eje:** atraviesa el cilindro de punta a punta. Si se pide, lleva también asientos para rodamientos
  608 en las dos caras.
- **La marca:** una ranura en la cara de arriba, a 0°, donde empieza cerrada la primera flecha. Sirve para poner las
  levas a punto.

`huecos.csv` (sale con cada pieza) dice dónde va cada imán: flecha, par, ángulo y posición desde el centro.

## Cómo imprimirlo

- **De pie**, tal como sale: el eje en vertical.
  - Los huecos quedan de lado. Llevan un pico de 45° arriba para que salgan redondos sin soportes, y un chaflán en la
    boca para que el imán entre fácil.
  - No hacen falta soportes ni borde.
- **Material y ajustes:** PLA, capas de 0,2 mm, 3 paredes y relleno del 15 al 20 % (giroide).
- **Peso:** macizo pesaría 1,2 kg de PLA. Con ese relleno pesa bastante menos, y dura varias horas.
- **Antes, la pieza de prueba** (`--probeta`): un taco con tres huecos de holgura 0,1, 0,2 y 0,3 mm (con 1, 2 y 3
  marcas encima). Se imprime igual, de pie, y se elige la holgura en que el imán entra con la mano y no se cae.

## Los imanes

- **Todos con el mismo polo hacia fuera**, como en la app: el norte. Antes de meterlos, se marca el norte de todos con
  una brújula o con un imán ya marcado.
- **Se empujan hasta el fondo.** Si alguno queda flojo, una gota de pegamento.

## Generarlo con otras medidas (`rodillo.py`)

Necesita Python con `manifold3d` y `trimesh` (`pip install manifold3d trimesh lxml networkx`).

```bash
python3 rodillo.py --iman-d 10 --iman-h 3 --holgura 0.2 --eje 8            # el rodillo
python3 rodillo.py --iman-d 10 --iman-h 3 --probeta                        # la pieza de prueba
python3 rodillo.py --iman-d 10 --iman-h 3 --eje 8 --rodamiento             # con asientos para rodamientos 608
python3 vista.py rodillo-flechas && node vista3d.js rodillo-flechas        # las vistas (vista.png y vista3d.png)
```

Todo se puede cambiar:

- el diámetro y el largo del cilindro;
- la separación de los pares (`--min`, `--max`);
- el número de flechas y de pares;
- el fondo extra del hueco;
- los huecos sin pico (`--sin-pico`).

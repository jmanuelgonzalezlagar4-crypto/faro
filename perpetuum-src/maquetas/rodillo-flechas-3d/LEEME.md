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
| `una-flecha-vista.png` | La vuelta desenrollada con una sola flecha que acaba y empieza en el mismo punto (la que se probó) |
| `rodillo-una-flecha.3mf`, `.stl` | **El rodillo de una sola flecha**: 19 pares; el último acaba justo en la línea donde empieza el primero. Lleva 3 agujeros para tornillos M3 en cada cara |
| `rodillo-una-flecha-huecos.csv`, `rodillo-una-flecha-vista.png` | Dónde va cada imán, y la vuelta desenrollada |
| `leva.3mf`, `.stl`, `leva.csv` | **La leva más eficiente** (se imprimen dos, una por cara), y su radio en cada ángulo |
| `volante.3mf`, `.stl` | **El volante de inercia**: Ø170 mm, con huecos para 16 tuercas M12. Sale ya en la postura de imprimir |
| `montaje.png`, `leva-3d.png`, `volante-3d.png` | El conjunto y las dos piezas nuevas en 3D |
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
python3 rodillo.py --flechas 1 --pares 19 --borde --tornillos --salida rodillo-una-flecha   # la flecha única, con tornillos para las levas
python3 leva.py --prof lisa --subida 12 --punta 20          # la leva más eficiente
python3 volante.py                                          # el volante (Ø170, 16 tuercas M12); --cerrado: tuercas dentro
python3 vista.py rodillo-flechas && node vista3d.js rodillo-flechas vista3d.png   # las vistas
```

Todo se puede cambiar: el diámetro y el largo del cilindro, la separación de los pares (`--min` y `--max`), el número
de flechas y de pares, y el fondo extra del hueco. Con `--cierra`, cada flecha acaba en el mismo ángulo en que empieza
la siguiente (con una sola flecha, el par más abierto va en el mismo ángulo que el cerrado). Con `--borde`, el primer imán
empieza justo en la línea y el último acaba justo en ella, sin pasarla.

## ¿Mejor con los imanes más juntos? (`juntos.js`, `perfil.js`, `quietos.js`, `figura-juntos.py`, `juntos.png`)

El usuario preguntó si es mejor poner los imanes más juntos. Se probó en el banco con el rodillo de flechas de la app:
el mismo cilindro, los mismos palos con su imán de ferrita, las mismas levas y muelles, y el mismo empujón de 300 rpm.
Solo cambia cuántos pares lleva cada flecha. Los imanes son los del usuario: bloques de 10 × 6 × 3 mm de neodimio N35,
metidos a ras.

| Imanes por flecha | Separación | Vueltas con 300 rpm | Empujón mínimo para dar una vuelta | Baches entre imanes | Cuesta de la flecha |
|---|---|---|---|---|---|
| 9 pares (el que se imprime) | 20° | 4,13 | 140 rpm | 7,9 mJ | 2,2 mJ |
| 12 pares | 15° | 4,10 | 142 rpm | 1,4 mJ | 2,8 mJ |
| 14 pares (lo más junto que cabe con el lado de 10 mm en la vuelta) | 12,9° | 4,07 | 142 rpm | 1,5 mJ | 3,3 mJ |
| 20 pares (bloques girados: el lado de 6 mm en la vuelta) | 9° | 3,88 | 148 rpm | 1,2 mJ | 4,5 mJ |
| Sin imanes en el cilindro | | 4,18 | 138 rpm | | |

- **Los baches se suavizan.** Con los imanes más juntos, el palo nota menos el hueco entre un imán y el siguiente: los
  baches bajan de 7,9 mJ a 1,4 mJ.
- **La cuesta de la flecha crece.** Con más imanes, la flecha empuja más mientras se abre, pero el salto a la flecha
  siguiente cobra lo mismo. En una vuelta entera, la cuenta da cero: la curva de `juntos.png` acaba donde empezó.
- **Con los palos quietos y sin roce** (`quietos.js`), en todas las colocaciones el cilindro pasa cada vuelta por el
  mismo sitio a la misma velocidad: 100 rpm, ±0,1 %. Con roce da 65,1 vueltas con imanes y 65,2 sin imanes.
- **Lo que de verdad frena es la leva.** Sube y baja los palos y gasta unos 900 mJ en golpes cada vez que se lanza el
  rodillo. Los imanes mueven unos pocos mJ, así que juntarlos casi no cambia nada, y si cambia es a peor: con más
  imanes, más cuesta.
- **Con los discos de 11 mm de la app pasa lo mismo, más marcado:** con 9, 12, 15 y 18 pares el rodillo da 3,73, 3,65,
  3,47 y 3,47 vueltas, y necesita 145, 152, 174 y 183 rpm para dar una vuelta. Sin imanes da 4,16 vueltas.

**Una cosa del banco.** Los bloques se montan en trozos de 3 mm a lo largo del eje. Si cada bloque fuera un imán largo,
el banco contaría su choque con el imán del palo (también largo, de 130 mm) partiendo el palo en 8 trozos de 16 mm.
A 4 mm de distancia eso es poco, y la cuenta de la energía se desviaba 30 mJ dentro de cada vuelta. Con trozos cortos
contra el palo largo, la cuenta es exacta: el error baja a 0,03 mJ. En los ejemplos de la app no pasa, porque los imanes
del cilindro son discos.

```bash
node juntos.js juntos.json             # discos de la app: 9, 12, 15 y 18 pares (unos 4 minutos)
node juntos.js bloques juntos-bloques.json   # bloques de 10 × 6 × 3 mm (unos 40 minutos)
node perfil.js perfil.json && node perfil.js bloques perfil-bloques.json
node quietos.js quietos.json           # los palos quietos (unos 15 minutos)
python3 figura-juntos.py               # juntos.png
```

## Una sola flecha que acaba y empieza en el mismo punto (`una-flecha.js`, `flechas-n.js`, `figura-una-flecha.py`, `una-flecha.png`)

El usuario pidió probarlo con una sola flecha por vuelta que acabe y empiece en el mismo punto.

- **Los imanes:** 19 pares, uno cada 20°, que se abren de 6 a 50 mm a lo largo de toda la vuelta. El par 19, el más
  abierto, va en el mismo ángulo que el par 1, el cerrado (a 0°), uno al lado del otro a lo largo del eje.
- **La leva:** con una flecha, la leva lleva una sola punta. Sube los palos poco a poco durante toda la vuelta y los
  deja caer justo después de ese punto, una vez por vuelta en vez de dos. La caída ocupa el mismo ángulo que en la app.
- **El montaje:** `flechas-n.js` es el rodillo de la app con el número de flechas como opción. Con 2 flechas sale
  idéntico al de la app.

| | Vueltas con 300 rpm | Empujón mínimo para dar una vuelta | Cuesta más alta |
|---|---|---|---|
| Dos flechas de 9 pares (el que se imprime) | 4,13 | 140 rpm | 9,6 mJ |
| Una flecha de 19 pares que acaba y empieza en el mismo punto | 5,30 | 128 rpm | 22,0 mJ |
| Una flecha de 18 pares, sin cerrar (acaba 20° antes) | 5,31 | 127 rpm | 8,6 mJ |
| Sin imanes, leva de una punta | 5,49 | 126 rpm | |
| Sin imanes, leva de dos puntas | 4,18 | 138 rpm | |

- **Da más vueltas, pero por la leva.** Con una sola punta, los palos caen una vez por vuelta en vez de dos. Sin imanes,
  la leva de una punta ya da 5,49 vueltas, frente a 4,18 la de dos. Con la flecha única, los imanes le quitan un poco:
  5,30 vueltas.
- **Cerrarla en el mismo punto crea un bache más grande.** Donde coinciden el par cerrado y el abierto hay el doble de
  imán, y cada palo nota allí una cuesta de 22 mJ en vez de 8. En la figura son los dos picos, uno por palo. Lo que
  cuesta subirla se devuelve al bajarla: las vueltas casi no cambian (5,30 frente a 5,31).
- **Sin roce y con los palos quietos**, el cilindro pasa cada vuelta por el mismo sitio a la misma velocidad: 100 rpm,
  ±0,03 %. Las cuentas cuadran con 0,02 mJ de error. Con roce da 64,2 vueltas, frente a 65,2 sin imanes.
- **La flecha casi no se nota.** El imán del palo es tan largo como el cilindro, así que a un imán del cilindro le da casi
  igual estar a 6 o a 50 mm del centro. Solo cambia algo cerca de las puntas del palo. Lo que se nota es cuánto imán hay
  en cada ángulo.

```bash
for i in 0 1 2 3 4; do node una-flecha.js $i & done; wait   # unos 25 minutos el más lento
node una-flecha.js tabla && python3 figura-una-flecha.py
```

## La flecha que acaba justo en la línea, la leva más eficiente y un volante de inercia (`leva.js`, `volante.js`, `leva.py`, `volante.py`, `figura-leva.py`, `leva-volante.png`)

El usuario pidió tres cosas:

- que la flecha acabe justo donde empieza, sin pasar de la línea;
- la leva más eficiente;
- un volante de inercia.

Todo se probó con el rodillo que se va a imprimir: de PLA, unos 400 g con los imanes, no el de latón de 1,5 kg de la app.

### La flecha

19 pares, de 6 a 50 mm.

- **El primero** empieza justo en la línea (a 0°), con su borde en ella.
- **El último** acaba justo en la línea, con su borde al otro lado.
- **Los demás**, repartidos por igual entre los dos: uno cada 19,36°. Cada imán ocupa 11,48° en la cara del rodillo.

### La leva más eficiente (`leva.js`: 279 levas)

**Qué se probó:**

- **Forma:** lisa, o en rampa con caída.
- **Cuánto sube:** de 0 a 16,5 mm.
- **Dónde está lo más alto, o dónde cae:** varios ángulos.
- **Los rodillos de los palos:** de 4, 16 y 22 mm de diámetro. Los de 22 mm son rodamientos 608.
- **Los muelles:** varias fuerzas.

**Cómo se midió:** las vueltas que da con un empujón de 300 rpm. Además, en cada leva se comprueba que los rodillos no se
despeguen de ella. Con muelles flojos los imanes empujan los palos hacia fuera, los rodillos se despegan y el palo ya no
lo lleva la leva. Esas levas dan algo más de vueltas, pero no valen: de 279, valen 176.

**La elegida** (`leva.py --prof lisa --subida 12 --punta 20`):

- es lisa;
- sube 12 mm, con lo más alto 20° después de la línea; es casi un círculo descentrado 6 mm;
- los rodillos son rodamientos 608;
- los muelles tiran 1 N entre los dos lados (unos 50 g cada uno).

Da 5,72 vueltas, frente a 1,53 con la leva de la app. Pierde 51 mJ por vuelta, en vez de 179.

| Leva (sin volante, 300 rpm) | Vueltas |
|---|---|
| La de la app: rampa de 16,5 mm, rodillos de 4 mm | 1,53 |
| Lisa de 12 mm con rodillos de 4 mm | 1,98 |
| Una leva redonda (no sube nada), rodillos 608 | 5,19 |
| La mejor en rampa, rodillos 608 | 5,30 |
| **La elegida: lisa de 12 mm, rodillos 608, muelles de 1 N** | **5,72** |
| La mejor del barrido: lisa de 16,5 mm (golpea más: 6,6 mJ frente a 1,3) | 5,75 |

- **Lo que más importa son los rodillos.** Los de 4 mm dan 23 vueltas por cada vuelta del rodillo, y su eje se lleva más
  de 100 mJ en cada vuelta. Los de 22 mm dan 4.
- **Después, la forma.** La rampa deja caer el palo de golpe, y cada caída es un golpe que gasta. La lisa lo baja poco a
  poco y le devuelve a la leva lo que costó subirlo.
- **Subir algo ayuda un poco.** Con el palo lejos de los imanes, el rodillo aprieta menos: la elegida da 5,72 vueltas
  frente a 5,19 de una leva redonda.

### El volante (`volante.js`, `volante.py`)

Es un disco de Ø170 mm (cabe en todas las Bambu) con 16 tuercas M12 a 68 mm del centro. Pesa unos 373 g y tiene
1,6 g·m² de inercia, tres veces la del rodillo de PLA.

| Con el empujón de 300 rpm | Vueltas | Gasta por vuelta | Empujón mínimo para dar una vuelta |
|---|---|---|---|
| Leva de la app, sin volante | 1,5 | 179 mJ | 234 rpm |
| Leva de la app, con volante | 5,9 | 177 mJ | 121 rpm |
| Leva elegida, sin volante | 5,7 | 51 mJ | 126 rpm |
| **Leva elegida, con volante** | **21,4** | **52 mJ** | **64 rpm** |
| Leva elegida, con volante y la misma energía (154 rpm) | 5,8 | 51 mJ | 64 rpm |
| Sin imanes, leva elegida, con volante | 21,8 | 50 mJ | 64 rpm |

- **El volante no gasta menos.** Pierde lo mismo en cada vuelta: 52 mJ con volante y 51 sin él.
- **Guarda más del mismo empujón.** A 300 rpm, el volante tiene cuatro veces más energía, y por eso da cuatro veces más
  vueltas. Con la misma energía (154 rpm con volante, igual que 300 sin él), da las mismas: 5,8 frente a 5,7.
- **Pasa los baches con menos empujón.** Basta con 64 rpm para dar una vuelta, en vez de 126.
- **Ningún montaje gana energía.** Sin rozamiento, ninguno pasa en ningún momento de la energía con que se lanzó. Sin
  imanes, el rodillo da algo más de vueltas que con ellos (21,8 frente a 21,4).

**Una cosa del banco.** Una rueda lisa del banco choca siempre en el plano de delante, aunque se le ponga otro, y el
primer volante rozaba con los palos. En el banco, el volante es una bola con la misma inercia en un plano en el que no
hay nada.

### Cómo montarlo

**Para imprimir (PLA):**

- `rodillo-una-flecha.3mf`, de pie;
- `leva.3mf`, dos veces;
- `volante.3mf`, tal como sale: la cara de las tuercas en la cama y el cubo arriba.

**Para comprar:**

- 38 imanes de 10 × 6 × 3 mm;
- una varilla de 8 mm;
- 4 rodamientos 608: 2 para el eje, en el bastidor, y 2 de rodillos en los palos;
- 16 tuercas M12 (DIN 934, de 19 mm entre caras);
- tornillos M3: 3 de 20 mm para la leva sin volante y 3 de 25 mm para la del volante.

**Para montarlo:**

1. **Los imanes**, como siempre: todos con el norte hacia fuera.
2. **Las levas.** Una en cada cara, atornilladas con 3 tornillos M3. Los agujeros no son simétricos, así que la leva solo
   entra de una manera. La raya de la leva queda frente a la ranura del rodillo.
3. **El volante**, por fuera de una de las levas, con los mismos 3 agujeros y tornillos más largos. Tiene 6 agujeros
   para poder ir en cualquiera de las dos caras. Su cubo lo separa 10 mm de la leva, para que quepa el brazo del rodillo
   del palo.
4. **Las tuercas.** Entran a presión, con una gota de pegamento. Con `volante.py --cerrado` quedan dentro: la impresora
   para en una capa, se meten y sigue.
5. **El sentido de giro.** El rodillo tiene que girar como las agujas del reloj mirando la cara de la ranura, para que
   bajo el palo pasen los pares del 1 al 19.
6. **Los rodillos de los palos.** Cada uno va justo debajo del centro del imán de su palo, apoyado en la leva.
7. **Los muelles,** blandos y largos, que tiren unos 50 g cada uno.

El bastidor, los palos y sus guías no están dibujados.

```bash
for i in 0 1 2 3; do node leva.js barrido $i 4 & done; wait   # las 279 levas (una hora larga con 4 núcleos)
node leva.js mejores
for i in 0 1 2 3 4 5; do node volante.js $i & done; wait      # el volante (unos 6 minutos)
node volante.js tabla && python3 figura-leva.py
node vista3d.js "rodillo-una-flecha,leva@e0a040@130,leva@e0a040@-8,volante@8a8780@-32" montaje.png
```

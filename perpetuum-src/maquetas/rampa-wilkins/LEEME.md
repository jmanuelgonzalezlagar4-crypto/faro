# La rampa de John Wilkins

El usuario mandó una captura del vídeo «John Wilkins Ramp, Perpetual Motion Machine». La idea es de 1648, del obispo
John Wilkins:

1. Un imán en lo alto de un pilar atrae una bola de acero rampa arriba.
2. Antes de llegar al imán, la bola cae por un agujero.
3. Baja por una rampa curva, por debajo de la recta, y un gancho la deja otra vez al pie de la rampa.

## El modelo (`wilkins-foto.js`)

Las medidas salen de la captura. Con una bola de 5 cm, el grueso de las rampas del banco (24 mm) coincide con el de
la foto.

- **Pilar:** 0,39 m de ancho y 0,54 m de alto.
- **Imán:** rojo, de 0,29 m, encima del pilar.
- **Rampa recta:** sube unos 30°, con el agujero arriba, junto al pilar.
- **Rampa de vuelta:** curva, con un gancho al final.
- **Bola:** de acero.

`prueba.js` dice qué hace la bola: si no llega al agujero, si cae y no vuelve, si se pega al imán o si da la vuelta.
Comprueba que las cuentas de energía cuadren y usa un paso de cálculo de 1/1.920 s.

Cuando la bola sale con un empujón, como si viniera del gancho, ese empujón cuenta como energía que tiene al empezar.
Y sale rodando, no resbalando.

## Corregido con el dibujo del usuario

En la primera versión, la rampa recta llegaba hasta dentro del gancho, y la bola chocaba con ella por debajo. El
usuario lo dibujó como debe ser:

- **La rampa recta** acaba antes del gancho.
- **La curva** pasa por debajo de la rampa recta.
- **El gancho** queda más allá del pie de la rampa recta. Sube, se curva hacia la izquierda y deja la bola justo encima
  del pie (la punta del gancho está una bola por encima de él).

Los resultados de abajo son con esta forma.

## Resultados

**Como en la foto** (imán de ferrita, bola soltada donde está en la captura): el imán está demasiado lejos para subir
una bola de acero de medio kilo por esa cuesta. La bola rueda cuesta abajo, cae por el pie de la rampa y se queda en el
fondo de la curva.

**Con un empujón de 2 m/s al pie:** llega arriba, pero el imán la atrae y se queda pegada debajo de él.

**2.000 variantes** (`barrido.js`, `barrido.jsonl`). Se cambia todo:

- **El imán:** ferrita, N35 o N52; de 8 a 45 cm; su sitio y hacia dónde mira.
- **El agujero:** en otro sitio de la rampa.
- **La bola:** de 1,6 a 6 cm.
- **La salida:** donde está en la foto, o al pie con un empujón de hasta 3 m/s.
- **El rozamiento:** con y sin rozamiento.

Se apartan 299 porque las cuentas no cuadran: bolas pegadas a imanes enormes o encajadas en un rincón. De las 1.701 que
quedan:

| Qué pasa | Variantes |
|---|---|
| No llega al agujero | 1.514 |
| Cae por el agujero, baja y se queda en el fondo de la curva | 99 |
| Se pega al imán, o cae y el imán la atrae y se queda pegada debajo | 87 |
| Vuelve al pie de la rampa una vez y ahí se queda | 1 |
| Sube la rampa una segunda vez | 0 |

La que vuelve al pie es una bola de 1,7 cm, sin rozamiento y con un empujón de 2,1 m/s.

Por qué no funciona:

- **Al subir y al bajar:** si el imán es tan fuerte que sube la bola desde abajo, más cerca la atrae todavía más y no la
  deja caer. Si la deja caer, al bajar le quita lo que le dio al subir.
- **Al dar la vuelta:** la bola vuelve al mismo sitio, así que ni el imán ni el peso le han dado nada. Cada golpe y
  cada roce se llevan un poco.

`video.js` hace `wilkins.mp4`, con tres casos lado a lado, primero a cámara lenta:

- como en la foto;
- con un empujón;
- con el agujero más abajo, un imán mayor y sin rozamiento.

`foto.js` dibuja fotogramas sueltos para comprobar la forma.

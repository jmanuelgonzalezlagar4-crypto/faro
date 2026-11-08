# La bola que atrae un imán, con la mejor eficiencia posible

El usuario pidió diseñar la versión más eficiente del aparato en que un imán atrae una bola de acero. Podía ser una
rampa tipo trampolín, un disco horizontal con un canal o cualquier otra forma.

## La regla

Un imán que no se mueve actúa como una cuesta invisible:

- **Al acercarse**, la bola gana velocidad.
- **Al alejarse**, la pierde.
- **En una vuelta completa**, el imán le da exactamente cero.

Por eso el diseño más eficiente no es el que más ayuda saca del imán, sino el que menos energía pierde por vuelta.

## El disco horizontal (`disco.js`)

Se ve desde arriba, así que la gravedad no actúa en el dibujo.

- **El roce del fondo:** la bola rueda por el fondo del canal con un roce de rodadura de acero sobre acero (0,0015).
  Ese roce se añade a mano y se apunta en las cuentas.
- **La inercia de rodar:** como rueda, tiene 1,4 veces la inercia de una bola que resbala.
- **Los imanes:** están fijos alrededor del anillo.
- **La salida:** la bola sale a 1 m/s.
- **Lo que se mide:** las vueltas hasta que se para, comparadas siempre con el mismo disco sin imanes.

Hay dos guías:

- **`canal`:** paredes hechas de 120 tramos rectos. La bola choca y roza con la pared de fuera, que la empuja hacia
  dentro en cada vuelta.
- **`brazo`:** un brazo sin peso sujeto en el centro lleva la bola por un círculo exacto. Es el canal perfecto: solo
  quedan el roce del fondo y el aire.

## Resultados (`busca.js`)

**Con el canal de tramos** (`busca-disco.jsonl`, 800 diseños):

- **Las pérdidas:** casi todas vienen de los golpes y el roce contra la pared.
- **Los imanes como guía:** en 51 diseños los imanes dan más vueltas que sin ellos. No es que den energía: aprietan la
  bola contra la pared de fuera y así no rebota entre las dos paredes.
- **El mejor:** guarda el 77 % de su energía por vuelta.

**Con el canal perfecto** (`busca-brazo.jsonl`, 800 diseños):

- **Ninguna vuelta de más:** ninguno da ni una vuelta más con imanes que sin ellos. La mayor diferencia es de 0,02
  vueltas, que es redondeo.
- **Vueltas de menos:** en 16 diseños los imanes hacen perder entre 1 y 6 vueltas.
- **El que más vueltas da:** 65 vueltas en 64 s. Es el anillo más pequeño (6 cm), y da exactamente las mismas vueltas
  con imanes que sin ellos.
- **Con imanes fuertes** (3 imanes de neodimio de 5 cm, anillo de 18 cm): 23,1 vueltas, frente a 24,4 sin imanes. Al
  final la bola se queda atrapada junto a un imán, yendo y viniendo, y tarda más en pararse (97 s frente a 69 s).

`video.js` hace `disco.mp4`: el disco con los 3 imanes al lado del mismo disco sin imanes, hasta que se paran los dos,
con la velocidad de las dos bolas en una gráfica.

## La rampa vertical y el trampolín

La rampa de Wilkins está en `../rampa-wilkins/`. De 1.701 variantes válidas, ninguna sube la rampa dos veces, tampoco
sin rozamiento.

Un trampolín perfecto, con un muelle que no pierde nada, devuelve como mucho lo que recibe. Hace lo mismo que la curva
con gancho sin rozamiento, que ya se probó y tampoco dio la vuelta. No se ha montado aparte.

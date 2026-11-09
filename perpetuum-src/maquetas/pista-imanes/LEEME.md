# Pista de aceleración con imanes

El usuario pidió probar una pista de aceleración con imanes, como las de los vídeos: algo que da vueltas a una pista y
que unos imanes fijos van empujando.

## El modelo (`pista.js`)

- **La pista.** Es un anillo visto desde arriba, así que la gravedad no actúa en el dibujo.
- **Lo que da vueltas.** Puede ser:
  - una bola de acero, que los imanes atraen;
  - un imán en un carrito, que mira siempre igual respecto de la pista: con el polo hacia fuera, hacia delante,
    hacia dentro, hacia atrás o torcido.
- **La guía.** Va soldado a un brazo sin peso que gira en un eje en el centro. Es una guía perfecta: no roza ni
  choca. Sin rozamiento conserva la energía al 99,9998 % por vuelta.
  - Al principio la bola iba unida al brazo con un eje propio, y el banco perdía un 3 % por vuelta al sujetarla.
- **Los imanes fijos.** Van junto a la pista, de tres maneras:
  - **rampa:** una fila que se va acercando a la pista, así que el campo crece en el sentido de la marcha;
  - **V:** dos filas, una por dentro y otra por fuera, que se van cerrando;
  - **escalera:** imanes a la misma distancia, torcidos uno tras otro.
- **El roce.** Es el de rodar sobre el fondo (0,0015), y se apunta en las cuentas. Como la bola rueda, se mueve con
  1,4 veces su masa.
- **Los imanes para la bola.** El banco suaviza la atracción del acero a menos de 2 cm más el radio de la bola, así
  que con imanes pequeños la bola casi no los nota. Por eso, con bola, los imanes son de 3 a 6 cm. El imán del
  carrito sí nota los pequeños: con imanes en V llega a ir de 0,13 a 2,08 m/s en una vuelta.

## 2.000 pruebas al azar (`barrido.js`, `todo.sh`, `barrido.jsonl`)

- **Lo que se sortea:** de 3 a 16 imanes, en 30° a 300° de pista, de 0,3 a 2 m/s, y distancias, tamaños, ángulos y
  pesos al azar. Las semillas de los cuatro trozos repitieron algunas pistas, así que hay 1.597 distintas, y cada una
  se cuenta una vez.
- **Cómo se prueba cada una:**
  - **Sin rozamiento, 30 s.** Se mide lo más que llega a sobrar: la energía que tiene, comparada con la del
    principio. Si los imanes dieran energía, crecería vuelta a vuelta.
  - **Con el roce, hasta que se para** (como mucho 300 s). Se cuentan las vueltas, comparadas con la misma pista sin
    imanes.

## Resultados (`comprueba.js`, `comprobadas.jsonl`, `figuras.js`, `barrido.png`)

- **Sin rozamiento:** 8 pistas parecían sobrar más del 0,5 % (como mucho, el 1,26 %). Casi todas tienen el imán
  atrapado, yendo y viniendo entre los imanes. Con un paso 8 y 32 veces más fino sobra entre el 0,01 % y el 0,02 %:
  es redondeo.
- **Con roce, 106 pistas dan más vueltas que sin imanes** (como mucho 0,7 vueltas de más: la nº 1868, con 20,8 vueltas
  frente a 20,1).
  - Todas caben en lo que baja la energía de los imanes desde el principio hasta el final. Por ejemplo, la pista
    empieza ya dentro de su campo, o la bola se queda al final junto a un imán.
  - Esa bajada se paga una sola vez: (imanes al empezar − imanes al final) / (roce · largo de la vuelta) vueltas.
  - La que más se acerca da el 100,6 % de eso. Son 4 milésimas de vuelta, unos 3 mm, del tamaño del error al medir
    dónde se para; en energía cuadra con 0,003 mJ de diferencia.
- **1.203 pistas dan menos vueltas que sin imanes**, y 249 de ellas se quedan atrapadas entre los imanes antes de dar
  una vuelta.

**La regla.** Un imán fijo es como una cuesta: lo que da al entrar lo quita al salir, y en una vuelta completa da
cero. Ninguna pista saca energía de los imanes.

## Vídeo (`video.js`, `elegidas.json`, `dibujo.js`, `pista.mp4`)

1. **Sin rozamiento:**
   - el imán en carrito con imanes en V (nº 1597);
   - la bola de acero con imanes en rampa (nº 1848).
   Al lado, la velocidad en cada sitio de la vuelta: acelera al entrar en los imanes y frena al salir, y las curvas
   de todas las vueltas caen unas encima de otras.
2. **Con roce:** la nº 1868, con imanes y sin imanes, lado a lado.
   - Con imanes da 0,7 vueltas más, pero los últimos 40 s se queda balanceándose junto a un imán: los imanes bajan
     2,7 mJ una sola vez.
3. **La gráfica de las 1.597 pistas.**

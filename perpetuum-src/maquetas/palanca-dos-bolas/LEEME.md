# La palanca de metacrilato con dos bolas

El usuario mandó una captura de un vídeo con un aparato de metacrilato. El subtítulo dice: «...yet also simultaneously
return the platform back to origin whilst progressing underneath the curve as the other sphere falls gently on a tier
perfectly timed ready for the next cycle». Busqué el vídeo por ese texto y no aparece en la red. Así que todo sale de
un solo fotograma.

## Cómo lo entiendo (`como-lo-entiendo.png`)

- **Medidas.** Están tomadas de la foto, suponiendo que la canica mide 25 mm (90 px, es decir, 0,278 mm por px).
- **La palanca:**
  - un brazo largo recto de metacrilato;
  - debajo, una aleta curva: «la curva»;
  - un eje a 67,5 mm de la mesa;
  - en el extremo corto, una cazoleta y el contrapeso blanco.
- **La base:**
  - un tope a la izquierda;
  - unos raíles que bajan 8° hacia la derecha y pasan por debajo de la curva.
- **Arriba** (como en la foto) la cazoleta está al final de los raíles. **Abajo** la palanca gira 35,8° y la curva queda
  apoyada en los raíles. Es lo que sale de la foto: al girar ese ángulo, la curva toca justo los raíles.
- **La vuelta, tal como la entiendo:**
  1. Con la bola en la cazoleta, el brazo largo baja y la cazoleta sube la bola 41 mm.
  2. La bola vuelve por encima del brazo hasta la punta (baja 13 mm) y cae junto al tope.
  3. Al bajar por los raíles (28 mm), pasa por debajo de la curva y la empuja hacia arriba. Así devuelve la palanca a
     su sitio y acaba otra vez en la cazoleta.
  4. La otra bola espera en la bandeja de arriba su turno. Solo la guarda; no sube ni baja nada, así que no cambia las
     cuentas.

En 2D el banco no puede poner una pieza al lado de otra. Por eso el brazo, el pie de la curva junto al eje y el
contrapeso van en otro plano: la bola pasa por su lado, como en el aparato.

## Las dos mitades por separado (`palanca.js`, `geo.js`, `prueba.js`)

- **A) La palanca sube la bola.** La palanca está arriba con la bola en la cazoleta. ¿Llega abajo?
- **B) La bola devuelve la palanca.** La palanca está abajo. La bola llega por los raíles con toda la velocidad que
  ganaría bajando desde donde la dejó la cazoleta, sin perder nada por el camino. ¿Vuelve la palanca arriba?

Para que la vuelta se repita tienen que salir las dos con el mismo aparato. Con las medidas de la foto (canica de
vidrio de 20,5 g, brazo de 35 g, curva de 18 g):

| Contrapeso | A: la palanca sube la bola | B: la bola devuelve la palanca |
|---|---|---|
| 8 g | Sí: al bajar, la palanca vacía suelta 10,5 mJ, y subir la bola cuesta 8,2 mJ | No: la levanta de 35,8° a 34,1° y se atasca debajo de la curva |
| 30 g | No: pesa más el lado del contrapeso con la bola | Sí, pero solo porque la palanca vacía ya casi sube sola (necesita 0,5 mJ) |

## 2.000 variantes (`barrido.js`, `todo.sh`, `barrido.jsonl`, `barrido.png`)

Cada variante cambia:

- el contrapeso;
- el peso del brazo (20 a 50 g) y el de la curva (10 a 30 g);
- el sitio de la cazoleta;
- la bola: de 20 a 29 mm, de vidrio o de acero;
- el rozamiento: la mitad de las variantes van sin rozamiento.

El contrapeso se reparte para que lo que necesita la palanca vacía para volver arriba vaya de −1 mJ a 1,3 veces lo que
cuesta subir la bola.

| | Salen bien | Dónde |
|---|---|---|
| A: la palanca sube la bola | 163 | Solo si la palanca necesita para volver arriba el 107 % o más de lo que cuesta subir la bola |
| B: la bola devuelve la palanca | 292 | Solo si necesita el 14 % o menos (sin rozamiento, también el 14 %) |
| Las dos | **0** | |

- **Por qué no puede salir nunca.** Aunque la bola le diera a la palanca toda su energía, como mucho le devolvería el
  100 % de lo que costó subirla, y la palanca necesita al menos el 107 %.
- **Lo que se lleva el resto.** En el banco, la bola devuelve como mucho el 14 %. El resto se va en el golpe contra la
  curva, en los roces y en la velocidad con la que la bola llega a la cazoleta.
- **Las cuentas cuadran.** En las 2.000 variantes las cuentas de energía cuadran con menos de 0,5 mJ de error.

## Vídeo (`video.js`, `palanca.mp4`)

1. Cómo lo entiendo.
2. Las dos mitades con el contrapeso de 8 g y con el de 30 g, en cámara lenta.
3. La gráfica de las 2.000 variantes.

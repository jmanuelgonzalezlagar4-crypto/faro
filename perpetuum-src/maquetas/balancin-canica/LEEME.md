# Balancín de la canica

Estudio del vídeo «The infinite oscillations, movimiento perpetuo» (canal @veproject1), a partir de dos
capturas. Un palo de aluminio gira en un poste. A la izquierda cuelga un contrapeso de arandelas, y por el brazo
derecho rueda una canica entre dos topes. Debajo hay unas almohadillas negras donde se apoya el palo. Un
comentario del vídeo dice que, a cámara lenta, cuando la bola llega al lado derecho el palo sigue arriba.

## El modelo (`modelo.js`)

| Pieza | Medidas |
|---|---|
| Palo | de 68 cm, 120 g, eje en un rodamiento a 22 cm del suelo |
| Contrapeso | 56 g a la izquierda |
| Canica | de acero, 2 cm y 20 g; rueda entre un tope junto al eje y otro en la punta |
| Topes del palo | de goma a cada lado |

Con la canica junto al eje pesa más la izquierda, y con la canica en la punta pesa más la derecha. El cambio está
a 22 cm.

## Sin ayuda (`corre.js`)

| Arranque | Se para a los | Cómo queda |
|---|---|---|
| Canica junto al eje | 2,1 s | baja la izquierda (8,8°), la canica junto al eje |
| Canica en el punto de equilibrio | 2,8 s | baja la derecha (8,5°), la canica en la punta |
| Canica junto al eje y un empujón al palo | 3,1 a 4,1 s, tras 4 a 6 vaivenes | una de las dos posturas |
| Lo mismo sin roces | 3,1 a 4,4 s | igual |

El balancín tiene dos posturas de reposo:

- **Baja la izquierda:** el palo sube hacia la derecha y la canica rueda hasta el eje, donde se queda.
- **Baja la derecha:** la canica rueda hasta la punta y se queda allí.

Para pasar de una a otra la canica tiene que rodar cuesta arriba. Cada golpe contra un tope se lleva energía:
incluso sin roces, se para en unos segundos.

## Con un empujón escondido (`sujeta.js`)

Un sensor mira dónde está la canica, y un empujón pequeño en el eje (0,08 N·m) baja el lado que hace falta. Lo
sujeta hasta que la canica pasa el punto de equilibrio. Así funcionan estos juguetes, con una bobina, un
transistor y una pila en la base. El banco apunta como gastado de la pila cada julio del empujón.

- En 5 minutos la canica hace 93 viajes, unos 19 por minuto, y no se para.
- Cada viaje pide unos 45 mJ, que acaban en los golpes contra los topes y en el roce de la canica.
- `con-empujon-escondido.png`, a los 20,8 s: la canica ya está en la punta y el palo sigue casi horizontal,
  porque el empujón lo sujeta. Es lo que se ve a cámara lenta en el vídeo, según el comentario.
- Son 14 mW de movimiento. Con una bobina que aproveche el 10 o el 20 %, dos pilas AA durarían unos días; con un
  cable USB, siempre.
- Con un empujón más débil (0,035 o 0,05 N·m), o si solo da un toque corto, la canica no llega a hacer el viaje:
  el palo vuelve antes de que pase el punto de equilibrio.

## Como un trampolín (`trampolin.js`, `corre-trampolin.js`)

La explicación del usuario: el palo hace de trampolín.

1. El lado de la bola pesa más y baja.
2. Debajo hay un escalón; el palo se apoya en él y la bola rueda hacia delante, hasta una bisagra.
3. La rampa que cuelga de la bisagra se dobla hasta el suelo.
4. Como la bola ya no carga sobre la punta del palo, el lado de la bobina vuelve a pesar más y levanta la rampa.

El modelo: el mismo palo, con un escalón de goma debajo y una rampa de 18 cm colgada de una bisagra en la punta.
La bisagra deja doblar la rampa hacia abajo, pero no subir de la recta, y la rampa tiene un tope al final. El
muelle del trampolín la sujeta recta hasta que llega la bola.

| Versión | Se para a los | Cómo queda |
|---|---|---|
| Con muelle (`trampolin-muelle.png`) | 2,7 s | la bola en la punta de la rampa doblada, casi en el suelo; el palo sigue abajo |
| Sin muelle, la rampa llega al suelo (`trampolin.png`) | 8,9 s | el palo se levanta; la bola sale rodando por la mesa |
| Sin muelle, la rampa se dobla 40° o 60° | 2,8 a 3 s | la bola en la punta de la rampa doblada; el palo sigue abajo |
| Contrapeso un poco mayor (50 g) | 2,4 a 2,8 s | la bola no llega a salir: vuelve junto al eje |
| Sin roces | 2,7 a 3 s | igual |

- **Lo que sí pasa:** la primera mitad de la idea. La bola baja, rueda hasta la bisagra, la rampa se dobla y, sin
  muelle, la bobina levanta el palo.
- **Lo que no pasa:** la bola se queda abajo. Para volver a empezar tiene que subir otra vez unos 19 cm hasta lo
  alto del palo, que son 37 mJ con una bola de 20 g. Nada se los da: al subir, el palo se lleva la rampa vacía,
  no la bola.
- **Con muelle, el palo ni siquiera se levanta:** el muelle que sujeta la rampa también tira del palo hacia abajo.

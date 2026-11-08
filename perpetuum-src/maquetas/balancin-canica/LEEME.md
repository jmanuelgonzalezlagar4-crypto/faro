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

### Con el escalón al final de la rampa

Corrección del usuario: el escalón no está debajo del palo, sino al final de la rampa. El ciclo sería:

1. **La bola empieza al final de la rampa:** su lado pesa más y baja.
2. **El final de la rampa llega al escalón:** la rampa se dobla hacia arriba formando una V, y la bola rueda
   hacia delante, hasta la bisagra.
3. **La bisagra baja hasta el suelo:** la bola en la bisagra está más cerca del centro, la bobina pesa más y
   levanta el palo.
4. **Al subir, la rampa cuelga un poco:** la bola vuelve rodando hasta el final.

En el modelo, la bisagra deja colgar la rampa (de 10° a 35°) y doblarla hacia arriba (hasta 40°). El contrapeso
está entre lo que pesa la bola en la bisagra y lo que pesa en el final (58 a 68 g). Hay un escalón al final de
la rampa, a varias alturas, y una base debajo de la bisagra.

| Escalón | Pruebas | Se para a los | Vaivenes |
|---|---|---|---|
| Alto (18 cm) | 9 (3 contrapesos × 3 caídas de la rampa) | 1,7 a 2,4 s | 0 |
| Más bajo (8 a 14 cm) | 6, más una con muelle y una sin roces | 1,9 a 2,7 s | 0 o 1 |

`escalon-final.png`:

- **Dónde se queda la bola:** al final de la rampa, apoyada en el escalón.
- **Por qué no vuelve:** en cuanto el final de la rampa toca el escalón, el escalón aguanta el peso de la bola,
  así que el palo ya no lo nota y deja de bajar, entre los 2° y los 10°. Para formar la V, la bisagra tendría que seguir
  bajando, y eso solo pasa si el palo pesa más del lado de la bola; pero esa bola está en el escalón.
- **Lo que pide la vuelta:** para que la bola vuelva a la bisagra y luego otra vez al final, el palo tendría que
  pesar más de un lado y del otro a la vez, en la misma postura.

### Con la V del dibujo del usuario (`uve.js`, `corre-uve.js`)

El usuario dibujó la forma sobre las fotos:

- **El palo:** sale plano del eje y baja en V hasta el suelo.
- **La rampa:** en el fondo de la V hay una bisagra con una rampa recta que sube hasta la punta, con un tope.
- **La bola:** empieza en la punta.

El ciclo:

1. **Baja el lado de la bola:** la punta de la rampa se apoya en el escalón.
2. **La bola baja a la V:** la rampa queda cuesta abajo hacia la V y la bola rueda hasta el fondo, más cerca del
   eje.
3. **La bobina sube el palo:** ahora pesa más y lo levanta; la rampa cuelga y la bola vuelve a la punta.

El modelo:

- la V va de (0,23; 0,22) a (0,32; 0,045);
- la rampa mide 25 cm;
- la bisagra deja colgar la rampa de 10° a 30°;
- el escalón está bajo la punta y el suelo bajo la V.

El barrido (`uve-barrido.jsonl`) prueba 168 combinaciones de:

- cuánto cuelga la rampa;
- la altura del escalón;
- la altura del suelo;
- el contrapeso, de 50 a 110 g (con la bola en la V la bobina tiene que pesar más, y con la bola en la punta
  menos: eso pasa entre unos 90 y 110 g).

Resultados:

- **Ninguna vuelta completa:** en ninguno de los 168 casos la bola va de la punta a la V y vuelve a la punta. Todos
  se paran antes de 3,7 s, y el palo baja una vez como mucho.
- **En 147 casos la bola se queda en la punta:** la punta de la rampa se apoya en el escalón, el escalón aguanta la
  bola y el palo no la nota.
- **En 21 casos la bola llega al fondo de la V** (`uve.png`): la bobina pesa más, pero el palo solo sube de 0,3° a
  1,5°, porque la punta de la rampa sigue apoyada en el escalón y la bisagra ya no se dobla más. Si el contrapeso
  es ligero, ni eso: el palo se queda abajo con la bola en la V.

Para cerrar el ciclo, la bola tendría que volver del fondo de la V a la punta, que está más alta. Esa subida cuesta
lo mismo que dio al bajar, y en cada golpe y cada roce se pierde algo.

### Tal como lo pintó el usuario (`dibujo.js`, `corre-dibujo.js`)

El tercer dibujo del usuario:

- **El palo:** recto desde la bobina hasta el eje.
- **El brazo derecho:** baja recto desde el eje hasta el fondo de la V.
- **La rampa:** desde el fondo de la V sube suave hasta la punta, que acaba en un gancho.
- **La bobina:** cuelga de la punta izquierda y llega casi a la mesa; cuando ese lado baja, se apoya en la mesa.

En el modelo, la bobina cuelga de una varilla con bisagra. La rampa va con bisagra en el fondo de la V, con un
escalón bajo la punta y un suelo bajo la V. La bola empieza junto al gancho.

El barrido (`dibujo-barrido.jsonl`) prueba 64 casos:

- bobina de 50 a 110 g;
- la rampa colgando 10° o 25°;
- la bobina a 1 o 4 cm de la mesa;
- dos alturas de escalón;
- dos alturas de suelo.

Resultados:

- **Ninguna vuelta completa:** en ninguno de los 64 casos la bola vuelve de la V a la punta. Todos se paran antes
  de 7,7 s, y el palo baja una vez como mucho.
- **Dónde se queda la bola:** en 28 casos en el fondo de la V, y en 36 en la punta, sobre el escalón.
- **El caso que más dura** (`dibujo.png`, 6,9 s):
  1. El lado de la bola baja y la punta llega al escalón.
  2. La bobina sube el palo y la bola rueda hasta la V.
  3. La bobina se apoya en la mesa, y la bola se balancea en la V hasta quedarse quieta.
- **La bobina apoyada hace de tope:** el palo ya no se mueve, y nada sube la bola otra vez hasta la punta.

### Cuarto dibujo: la bobina en la punta del palo (`dibujo2.js`, `corre-dibujo2.js`)

En este dibujo cambian tres cosas:

- **La bobina:** va pegada a la punta izquierda del palo, no colgando hasta la mesa.
- **El fondo de la V:** con el palo abajo, se apoya en la almohadilla de abajo.
- **La rampa:** sube empinada desde la V hasta un poste, y después sigue un tramo plano por encima del escalón. La
  bola empieza junto al poste.

El barrido (`dibujo2-barrido.jsonl`) prueba 48 casos con una bobina de 40 a 90 g, la rampa colgando de 15° a 45°,
dos alturas de escalón y dos de suelo. Todos se paran entre 3 y 10 s, y el palo no vuelve a bajar nunca después de
la primera vez.

| Bobina | Qué pasa |
|---|---|
| 40 g (`dibujo2.png`) | la bola baja a la V y ese lado baja hasta apoyar la V abajo, como en el dibujo; la bobina no puede levantar el palo con la bola en la V |
| 55 a 90 g | la bobina sube el palo; la bola se queda en la V, o junto al poste si el escalón aguanta la rampa, y el palo no vuelve a bajar |

En 8 casos la bola sube un poco por la rampa al balancearse dentro de la V, pero no vuelve al poste con el palo
abajo.

La cuenta es la de siempre:

- **Los dos lados no pueden ganar a la vez:** si la bobina pesa menos que la bola en la V, no puede levantar el
  palo; si pesa más, el palo se queda arriba.
- **Volver al poste cuesta energía:** de la V al poste la bola tiene que subir, y eso cuesta lo mismo que dio al
  bajar.

### El ciclo completo, explicado por el usuario (`ciclo.js`, `corre-ciclo.js`)

1. **Bola en la punta:** pesa más su lado y baja. La punta de la rampa se apoya en el escalón y se forma la V.
2. **La bola rueda al fondo de la V:** está más cerca del eje, la bobina vuelve a pesar más y levanta el palo.
3. **Al levantarse, la V se pone recta:** el brazo y la rampa quedan en línea cuesta abajo, y la bola rueda otra
   vez hasta la punta y el escalón.

El modelo:

- **El brazo derecho:** baja recto desde el eje.
- **La rampa:** cuelga de una bisagra al final del brazo. Puede quedar recta, en línea con el brazo, pero no colgar
  más, y se puede doblar hacia arriba formando la V.
- **El escalón y el suelo:** el escalón está bajo la punta y el suelo de la V bajo la bisagra.

El barrido (`ciclo-barrido.jsonl`) prueba 96 casos:

- el brazo inclinado de 8° a 30°;
- la bobina de 40 a 70 g;
- distintos huecos hasta el escalón;
- distintas alturas del suelo de la V y del tope de la bobina.

Además prueba bobinas de 15 y 25 g. **Ninguno hace ni un ciclo:** todos se paran antes de 2,7 s, con la bola en la
punta sobre el escalón (`ciclo.png`).

La cuenta, con estas medidas:

- **Para que se forme la V:** la punta tiene que estar apoyada en el escalón, y el escalón aguanta la bola. Así que
  el palo tiene que pesar más de la derecha sin contar la bola, y eso solo pasa si la bobina pesa menos de unos
  22 g.
- **Para que la bobina levante el palo después:** la bola en el fondo de la V suma su peso a la derecha en cuanto la
  V se despega del suelo. Para levantar todo eso, la bobina tiene que pesar más de unos 48 g.
- **No puede ser las dos cosas:** menos de 22 g y más de 48 g a la vez. Quedaría que el golpe de bajada doblara la
  V, pero ese golpe sale de la energía de la bola, y cada vez queda menos.

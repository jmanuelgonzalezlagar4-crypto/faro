# Rampa con imán y bola imantada

El usuario pidió una pista en la que un imán atraiga una bola imantada. La rampa va un poco inclinada y, cuando la bola
está llegando al imán, cae y vuelve a rodar hacia él.

## El modelo (`rampa.js`)

- **De lado, con gravedad.** La rampa sube un poco (de 1° a 12°) hacia el imán fijo.
- **El hueco.** Antes de llegar al imán, la rampa tiene un hueco. Después del hueco queda un último tramo junto al imán,
  o no queda nada y la rampa se acaba.
- **La vuelta.** La bola cae por el hueco a una rampa de vuelta, que baja por debajo hacia el principio. Puede caer de
  dos formas:
  - **recta:** cae sobre la rampa de vuelta, que tiene un tope al final para que la bola no se salga;
  - **curva:** una recogida en cuarto de círculo bajo el hueco la recoge por su lado de dentro y la manda hacia el
    gancho sin golpe.
- **El gancho.** Sube la bola por dentro, pasa por encima del principio de la rampa y la deja otra vez sobre ella,
  para que vuelva a rodar hacia el imán. Está hecho de 60 tramos rectos, para que no la frenen los picos entre tramos.
- **Las rampas** son tiras fijas de 4 mm de grueso.
- **La bola es un imán.** Es un dipolo que gira con ella al rodar, con sus polos dibujados en rojo y azul. Para chocar
  es como el acero, pero el banco no la cuenta además como acero que se imanta.

### El gancho, corregido

El usuario vio que la primera versión estaba mal: la bola no cabía entre la curva y la rampa siguiente.

- **El fallo.** Lo alto del gancho, por dentro, quedaba a la misma altura que el principio de la rampa. La bola, que va
  por dentro del gancho, salía por debajo del borde de la rampa en vez de por encima. Así no podía volver, tuviera la
  energía que tuviera.
- **Cómo es ahora:**
  - lo alto del gancho, por dentro, queda una bola y unos milímetros (de 5 a 15) por encima del principio de la rampa;
  - el gancho sigue un poco más allá de lo alto, ya encima de la rampa, y deja allí la bola;
  - el gancho es mayor, para que la bola quepa también por debajo, entre la rampa y la rampa de vuelta.
- **Comprobado en cada rampa:** la bola cabe por arriba y por abajo, y la rampa de vuelta baja hacia el gancho. Si
  no, se sortea otra vez.
- **La prueba del gancho:** con un imán que casi no tira, la recogida curva y un empujón, la bola llega a 16 mm de
  pasar el gancho.

### Lo que se mide

- **Una vuelta** cuenta solo si la bola cae por el hueco, va por la rampa de vuelta y el gancho, y vuelve a la rampa.
- **Lo que le falta** es cuánto le queda para pasar por lo alto del gancho. Solo se mide en las que llegan a él.

## 3.000 rampas al azar (`barrido.js`, `todo.sh`, `barrido.jsonl`)

- **Lo que se sortea:**
  - inclinación y largo de la rampa;
  - bola de 8 a 25 mm;
  - imán de 1 a 6 cm: de ferrita, N35 o N52, en barra o en disco, girado y colocado al azar;
  - hueco, último tramo, caída, recogida recta o curva y gancho;
  - sitio de salida y empujón;
  - la mitad, sin rozamiento.
- **Cuentas bien:** 2.808 de las 3.000.

## Resultados (`figuras.js`, `barrido.png`)

| Qué le pasa a la bola | Rampas |
|---|---|
| No llega al hueco (se queda o vuelve rodando abajo) | 1.949 |
| Salta el hueco y se pega al imán | 262 |
| Cae por el hueco y no llega al gancho | 176 |
| Cae por el hueco y el imán la atrae hasta pegarse | 152 |
| Llega al gancho, pero no lo pasa | 264 |
| Vuelve a la rampa una vez (todas con empujón) | 5 |
| **Vuelve a caer por el hueco una segunda vez** | **0** |

- **Las que vuelven a la rampa.** Las 5 llevan la recogida curva y un empujón al empezar. Llegan sin fuerza: suben unos
  centímetros y se vuelven.
  - La mejor con roce es la nº 2492, con un empujón de 0,83 m/s: vuelve a la rampa, sube 5 cm y se vuelve. Después se
    queda yendo y viniendo por abajo.
  - Con un paso 4 veces más fino sale lo mismo.
- **Sin empujón**, 6 bolas llegan al gancho, y la que más se acerca (la nº 1364) se queda a 36 mm de pasarlo.
- **Energía:** ninguna rampa la gana; como mucho, el 100,006 %.

**Por qué no puede salir.**

- **Al caer.** La bola sube hacia el imán girando hacia un lado, y para volver por abajo tiene que girar al revés. Ese
  cambio se hace resbalando y con golpes. En la prueba del gancho sin imán, la bola perdió ahí un 36 % de su energía.
- **Al alejarse.** El imán le quita, mientras se aleja por abajo, lo que le dio al acercarse. En una vuelta completa
  no da nada.

## Vídeo (`video.js`, `dibujo.js`, `rampa.mp4`)

Tres rampas, en cámara lenta y a velocidad normal:

- la nº 2492, la mejor;
- la nº 1364, sin empujón;
- la nº 723, en la que la bola salta el hueco y se pega al imán.

## La rampa del dibujo del usuario

Archivos: `dibujo-usuario.js`, `barrido-dibujo.js`, `todo-dibujo.sh`, `barrido-dibujo.jsonl`, `barrido-dibujo.png`,
`video-dibujo.js` y `rampa-dibujo.mp4`.

El usuario dibujó encima del vídeo, sobre la rampa nº 2492, cómo la quería.

### Cómo es

Medido sobre el dibujo, a 1,34 mm por píxel:

- **Una C grande a la izquierda.** Sube desde la mesa y acaba encima del principio de la rampa.
- **Una rampa de vuelta recta y empinada.** Empieza 12 cm más allá del final de la rampa, 37 mm por debajo, debajo del
  imán, y baja unos 10° hasta el fondo de la C.
- **La rampa de arriba.** Mide 23 cm, sube 3,5° y se acaba sin más, sin hueco.
- **El imán.** Está 15 cm más allá del final y 2 cm más alto.
- **Lo que se cambió.** En el dibujo, lo alto de la C queda unos 8 cm por encima del principio de la rampa. Eso es más
  alto que donde cae la bola, así que no podría llegar nunca. Por eso lo alto de la C se pone justo una bola y 6 mm por
  encima del principio de la rampa, lo más bajo que puede ir.

### Tal como está dibujada

- **Sin empujón**, el imán está demasiado lejos para subir la bola por la rampa, y la bola se vuelve.
- **Con empujones de hasta 1,2 m/s**, cae por el final y sube por la C, pero le faltan de 41 a 57 mm para pasarla.

### 2.000 variantes

Se cambian la inclinación, el largo, la caída, cuánto sigue la rampa de vuelta, el tamaño de la C, el imán, la bola y el
empujón. Las cuentas cuadran en 1.877.

| Qué le pasa a la bola | Variantes |
|---|---|
| No llega al final (se queda o vuelve rodando abajo) | 1.062 |
| Vuela hasta el imán y se pega | 111 |
| Cae por el final y no llega a la C | 291 |
| Cae por el final y el imán la atrae hasta pegarse | 248 |
| Llega a la C, pero no la pasa | 157 |
| Vuelve a la rampa una vez | 8 |
| **Vuelve a caer por el final una segunda vez** | **0** |

- **Las 8 que vuelven** lo hacen todas con empujones de 0,8 a 1,4 m/s. Después solo suben de 8 a 36 mm por la rampa y
  se vuelven.
- **Sin empujón**, ninguna llega a la C.
- **Energía:** ninguna la gana; como mucho, el 100,113 %.
- **Por qué no pasa la C.** Para pasar por lo alto de la C, la bola va boca abajo y necesita velocidad. Eso cuesta más
  de lo que gana al caer.

### Lo que se comprobó en las que vuelven

En las 13 que vuelven a la rampa (5 de la versión con hueco y 8 de la del dibujo), la bola sube por ella entre 8 y 57 mm,
de los 28 a 44 cm que tiene la rampa.

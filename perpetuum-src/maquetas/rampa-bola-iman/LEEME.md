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

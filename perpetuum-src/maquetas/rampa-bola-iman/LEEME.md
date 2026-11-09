# Rampa con imán y bola imantada

El usuario pidió una pista en la que un imán atraiga una bola imantada. La rampa va un poco inclinada y, cuando la bola
está llegando al imán, cae y vuelve a rodar hacia él.

## El modelo (`rampa.js`)

- **De lado, con gravedad.** La rampa sube un poco (de 1° a 12°) hacia el imán fijo.
- **El hueco.** Antes de llegar al imán, la rampa tiene un hueco. Después del hueco queda un último tramo junto al imán,
  o no queda nada y la rampa simplemente se acaba.
- **La vuelta.** La bola cae por el hueco a una rampa de vuelta, que baja por debajo hacia el principio. Allí, un gancho
  en media vuelta tendría que subirla otra vez al pie de la rampa, para que vuelva a rodar hacia el imán.
- **Las rampas** son tiras fijas de 4 mm de grueso, para que la vuelta quepa por debajo. Por cómo está hecha, la rampa
  de vuelta siempre baja hacia el gancho.
- **La bola es un imán.** Es un dipolo que gira con ella al rodar, con sus polos dibujados en rojo y azul. Para chocar
  es como el acero, pero el banco no la cuenta además como acero que se imanta.
- **Una vuelta** cuenta solo si la bola cae por el hueco, va por la rampa de vuelta y el gancho, y vuelve a subir a la
  rampa.
- **Lo que le falta a la bola** es cuánto le queda para llegar a lo alto del gancho. Solo se mide en las que llegan a él.
- **Lo que se corrigió por el camino:**
  - Al principio, contaba como vuelta lo que hacían dos bolas que rodaban hacia atrás al empezar, caían al gancho e iban
    por abajo hasta el imán.
  - Había muestras con la rampa de vuelta bajando hacia el imán en vez de hacia el gancho.
  - Las semillas repetían la mitad de las rampas.
  Todo eso ya está corregido.

## 3.000 rampas al azar (`barrido.js`, `todo.sh`, `barrido.jsonl`)

- **Lo que se sortea:**
  - inclinación y largo de la rampa;
  - bola de 8 a 25 mm;
  - imán de 1 a 6 cm: de ferrita, N35 o N52, en barra o en disco, girado y colocado al azar;
  - hueco, último tramo, caída hasta la rampa de vuelta y gancho;
  - sitio de salida y empujón;
  - la mitad, sin rozamiento.
- **Cuentas bien:** 2.791 de las 3.000. Las otras 209 tienen la bola pegada contra el imán, donde el banco no lleva bien
  las cuentas.

## Resultados (`figuras.js`, `barrido.png`)

| Qué le pasa a la bola | Rampas |
|---|---|
| No llega al hueco (se queda o vuelve rodando abajo) | 2.017 |
| Salta el hueco y se pega al imán | 167 |
| Cae por el hueco y no llega al gancho | 243 |
| Cae por el hueco y el imán la atrae hasta pegarse | 223 |
| Llega al gancho, pero no sube hasta la rampa | 141 |
| Vuelve a la rampa por el gancho | **0** |

- **Las que llegan al gancho.** De las 141, solo una lo hace sin empujón: la nº 1453, sin rozamiento, y le faltan 67 mm.
  La que más se acerca, con un empujón de 0,93 m/s y con roce, es la nº 1289: le faltan 11 mm.
- **Energía:** ninguna rampa la gana; como mucho, el 100,012 %.

**Por qué no puede salir.** La bola cae desde un poco más arriba de donde empieza la rampa, pero pierde energía al caer
y al rodar. Además, mientras se aleja por abajo, el imán tira de ella hacia atrás. Lo que el imán le da al acercarse se
lo quita al alejarse, así que en una vuelta completa no da nada.

## Vídeo (`video.js`, `dibujo.js`, `rampa.mp4`)

Las rampas nº 1453 (sin empujón), nº 1289 (la que más se acerca) y nº 2594 (la bola salta el hueco y se pega al imán),
en cámara lenta y a velocidad normal.

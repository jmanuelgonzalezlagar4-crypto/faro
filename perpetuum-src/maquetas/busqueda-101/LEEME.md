# Búsqueda del 101 %: todo tipo de aparatos

El usuario pidió probar cualquier tipo de aparato hasta encontrar un rendimiento mínimo del 101 %, es decir, que
salga al menos un 1 % más de energía de la que entra.

## Qué se mide (`corre.js`)

En cada momento se calcula la energía que tiene la máquina, más la que ha entregado al acumulador o a la red, menos
la que ha recibido de la pila, de la mano o de la red. Eso se compara con la energía del principio.

- **Rendimiento** = 100 % + lo que sobra / la energía que mueve la máquina.
- **No se usan las cuentas de pérdidas** (golpes, roces). En una primera prueba, unas ruedas de gravedad y de agua
  daban del 102,8 % al 103,6 % porque el banco apuntaba en los golpes más pérdida de la que había. No era energía de
  más.
- Todo va **sin rozamiento ni aire**, que es lo más favorable para que sobre energía.
- **Se apartan los aparatos imposibles de construir**: piezas metidas una dentro de otra al empezar, o que se quedan
  metidas más de 4 mm durante más de un segundo.

## Las familias (`familias.js`)

| Familia | Qué lleva |
|---|---|
| `ruedaImanes` | Rueda con imanes, imanes fijos, a veces un electroimán con interruptor, generador y motor que se alimentan del acumulador |
| `palancasImanes` | Rueda con imanes y una o dos palancas con topes, imán en la punta, pesa y muelle |
| `gravedad` | Ruedas con brazos con bisagra y pesa, o con bolas sueltas en cajones |
| `balancin` | Palo con topes, canicas, rampa con bisagra, escalones, contrapeso colgado o fijo, muelle |
| `pendulos` | De 1 a 3 péndulos con imanes en la punta, imanes fijos cerca y muelles entre ellos |
| `agua` | Rueda con flotadores, más ligeros o más pesados que el agua, a medio meter en un tanque, o bolas sueltas |
| `ejemplos` | Los 18 ejemplos del banco con sus medidas cambiadas al azar (hasta un ±30 %) |

`todo.sh` prueba 2.000 aparatos de cada familia y 200 ejemplos cambiados, 10 s cada uno: 12.200 en total.

## Resultados (`resultados.jsonl`, `resumen.js`)

| Familia | Probados | Apartados | Lo más alto que parecía | Pasan del 101 % |
|---|---|---|---|---|
| Ruedas con imanes, electroimán, generador y motor | 2.000 | 0 | 100,032 % | 0 |
| Palancas con imanes junto a una rueda | 1.991 | 9 | 100,088 % | 0 |
| Ruedas de gravedad | 1.999 | 1 | 100,000 % | 0 |
| Balancines | 1.996 | 4 | 101,339 % | 1 |
| Péndulos con imanes y muelles | 1.722 | 278 | 735,6 % | 20 |
| Agua | 2.000 | 0 | 100,002 % | 0 |
| Ejemplos del banco cambiados | 177 | 23 | 104,858 % | 1 |
| **Total** | **11.885** | **315** | | **22** |

## Comprobación de los 22 (`comprueba.js`, `empujon.js`, `imanes.js`, `choque.js`)

Ninguno es energía de verdad:

- **El ejemplo del hámster (104,9 %)** es redondeo. Con un paso de cálculo 4 veces más fino da el 100,000 %.
- **Los 20 péndulos** se apoyan unos contra otros en el mismo plano, y uno queda apretado entre su bisagra y el
  otro péndulo. Se meten uno en otro hasta 9 mm, cuando el banco deja como mucho 2 mm. Al separarlos, el banco les
  mete energía sin apuntarla. A la vez quita otra sin apuntarla, así que las cuentas pueden cuadrar igual, y la alarma
  solo salta en 6 de ellos.
  - Con un paso más fino no cambia: no es redondeo.
  - Con cada péndulo en su propio plano, uno detrás de otro sin poder chocar (`empujones.jsonl`), dan del 100,005 %
    al 100,5 %. Queda una excepción: el nº 1759, con un 117 %.
  - Ese resto es redondeo. Se probaron con un paso 8 veces más fino los cuatro que quedaban por encima del 100,1 %
    (1759, 1369, 746 y 135), y todos bajan a entre el 100,002 % y el 100,04 % (`imanes.js`).
  - En el nº 1759, dos imanes de 2 a 4 cm se cruzan a menos de medio milímetro, cosa imposible en un aparato de
    verdad.
- **El balancín (101,3 %)** empieza con la rampa apoyada 2 mm dentro de un escalón, justo por debajo de la alarma de
  piezas solapadas (3 mm). Al separarla, el banco le mete 0,77 mJ en los primeros 0,04 s. Con los escalones 4 mm más
  abajo da el 100,000 % (`separa.js`).
  - Los otros balancines que pasan del 100,1 % (hasta el 100,8 %) tienen un empujón parecido, de 0,02 a 0,4 mJ.
    Aparece en los primeros segundos, mientras una pieza está apoyada apretada contra otra.
  - En los que se miraron durante un minuto (1975, 284 y 156), con el paso normal y con uno 8 veces más fino, no
    crece. Luego la máquina pierde de 14 a 106 mJ y se para. Un 101 % de verdad tendría que repetirse en cada vuelta.

**Ningún aparato da más del 100 %.**

## Dos fallos del banco que ha sacado esta búsqueda

- **Piezas metidas entre 2 y 3 mm al empezar:** la alarma de piezas solapadas no las ve, y al separarlas el banco
  mete energía.
- **Piezas apretadas entre bisagras:** cuando una pieza queda apretada y se mete en otra más de 2 mm, el banco la
  separa metiendo energía sin apuntarla, y a veces quitando otra sin apuntarla. Por eso las cuentas pueden cuadrar
  aunque se haya creado energía: la alarma solo saltó en 6 de los 20 péndulos.

Con ninguno de los dos se saca energía de verdad: son errores de cálculo del banco, no algo que pase en un aparato.

## Segunda tanda: aparatos mixtos (`familias2.js`, `todo2.sh`, `resultados2.jsonl`)

12.000 aparatos más, mezclando de todo y sin aire ni rozamiento:

| Familia | Qué lleva | Probados | Apartados | Lo más alto que parecía |
|---|---|---|---|---|
| `rampaMagnetica` | Rampa con imanes que suben bolas de acero, hueco y rampa de vuelta | 2.000 | 0 | 100,157 % |
| `circuito` | Rampas en lazo, bolas de acero, imanes y un electroimán que enciende la rueda de paletas que mueve la bola | 744 | 1.256 | 100,416 % |
| `levaIman` | Rueda con leva que levanta una palanca con imán, imanes fijos, muelle, generador y motor con acumulador | 922 | 1.078 | 147,4 % |
| `aguaImanes` | Rueda con flotadores imantados en un tanque, imanes fijos junto al agua | 2.000 | 0 | 100,021 % |
| `mezcla` | De 2 a 5 módulos al azar: rueda, palanca, péndulo, rampa con bolas, imanes, electroimán, muelle y agua | 3.403 | 597 | 110,0 % |

- **El filtro de piezas metidas es más estricto:** ahora también aparta las piezas que se meten más de 1 cm alguna
  vez, o más de 4 mm durante 0,25 s en total. Una rampa magnética parecía dar un 500 %, y era una rueda metida 2 cm
  en una rampa que daba saltos de un sitio a otro, así que el solape aparecía y desaparecía.
- **30 pasaban del 101 %.** El clasificador (`clasifica.js`, `clasificados2.jsonl`) da 20 de piezas apretadas, 4 de
  redondeo, 3 de piezas metidas al empezar y 6 sin explicar.
- **Los 6 sin explicar, mirados a mano** (`mira2.js`):
  - **Las levas:** la rueda y la leva van soldadas y cada una tiene su propio eje. En el primer paso el banco las
    encaja de golpe: la rueda gira 19° y sube 2 mm, lo que mete de una vez entre 7 y 35 mJ. Luego todo cuadra.
  - **Medida desde los 0,1 s:** un aparato de más del 100 % tiene que seguir ganando después del arranque, así que
    se mide lo que sobra contando solo desde los 0,1 s, con el paso normal y con uno 8 veces más fino
    (`despues.js`, `despues2.jsonl`). De los 33 que pasaban del 100,5 %, quedan 2.
  - **La mezcla nº 508 (103 %):** una bola de plomo colgada de un muelle que toca una rueda. El muelle la aprieta
    contra la rueda, y el banco la separa en cada paso estirando el muelle sin apuntarlo. Con la bola sin tocar la
    rueda sobran 0,01 mJ, y sin muelle, 0.
  - **La leva nº 787 (100,85 %):** 0,6 mJ, por debajo del 101 %.
- Con la misma medida desde los 0,1 s y paso fino, los 26 de la primera tanda que pasaban del 100,5 % se quedan
  todos en el 100,0 % (`despues1.jsonl`).

## Tercera tanda: ideas clásicas (`familias3.js`, `todo3.sh`, `resultados3.jsonl`)

| Familia | Qué lleva | Probados | Apartados | Lo más alto |
|---|---|---|---|---|
| `bhaskara` | Rueda con tubos curvos y bolas que ruedan hacia fuera en un lado | 1.500 | 0 | 100,000 % |
| `espiral` | Rueda con imanes y un estátor de imanes en espiral | 1.500 | 0 | 100,009 % |
| `penduloElectro` | Péndulo de acero con imanes fijos y un electroimán que enciende el propio péndulo | 1.500 | 0 | 100,037 % |
| `cadenaAgua` | Cadena de flotadores ligeros y pesados alrededor de dos ruedas, medio dentro de un tanque | 717 | 783 | 100,000 % |

Ninguno pasa ni del 100,1 %.

## En total

30.200 aparatos de 16 tipos; quitando los imposibles de construir, quedan 26.171. 52 pasaban del 101 %, y ninguno
era energía de verdad: todos eran fallos del banco (redondeo, piezas metidas al empezar, piezas apretadas, o piezas
que el banco encaja de golpe en el primer paso). `busqueda-101.png` tiene la tabla de las tres tandas.

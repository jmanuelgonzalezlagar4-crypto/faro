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
  otro péndulo. Ahí el banco les mete energía y la apunta como un golpe negativo, así que la alarma de las cuentas solo
  salta en 6 de ellos.
  - Con un paso más fino no cambia: no es redondeo.
  - Con cada péndulo en su propio plano, uno detrás de otro sin poder chocar (`empujones.jsonl`), dan del 100,005 %
    al 100,5 %. Queda una excepción: el nº 1759, con un 117 %.
  - Ese resto es redondeo: con un paso 8 veces más fino, todos bajan al 100,00 % (`imanes.js`).
  - En el nº 1759, dos imanes de 2 a 4 cm se cruzan a menos de medio milímetro, cosa imposible en un aparato de
    verdad.
- **El balancín (101,3 %)** empieza con la rampa 2 mm metida en un escalón, justo por debajo de la alarma de piezas
  solapadas (3 mm). Al sacarla, el banco le mete 0,77 mJ en los primeros 0,04 s.
  - Los otros balancines que pasan del 100,1 % (hasta el 100,8 %) tienen lo mismo: entre 0,02 y 0,4 mJ en el primer
    décimo de segundo.

**Ningún aparato da más del 100 %.**

## Dos fallos del banco que ha sacado esta búsqueda

- **Piezas metidas entre 2 y 3 mm al empezar:** la alarma de piezas solapadas no las ve, y al separarlas el banco
  mete energía.
- **Piezas apretadas entre bisagras:** el cálculo de los choques puede meter energía y la apunta como un golpe
  negativo. Por eso las cuentas pueden cuadrar aunque se haya creado energía.

Los dos solo dan energía que no existe, nunca la quitan de donde sí la hay.

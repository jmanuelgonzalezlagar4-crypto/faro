# Rodillo de flechas

Maqueta de un usuario, dibujada a partir de su descripción:

- Cilindro de latón con **dos filas de imanes en forma de flecha**: 2 flechas por vuelta y en cada una 9 pares que se abren
  de menos a más (a lo largo del eje). Donde acaba abierta, empieza cerrada la siguiente.
- **Arriba**, un palo con un imán de todo el largo del cilindro (norte hacia abajo); **abajo**, otro igual (norte hacia arriba).
- Los palos suben y bajan **por igual de los dos lados**, en guías, empujados por una **leva en cada lado** del cilindro.
- La leva **sube poco a poco** durante toda la flecha y **cae de golpe** justo después de lo más alto, cuando el primer par
  cerrado ya ha pasado por debajo del imán.
- Un muelle en cada punta une los dos palos y los aprieta contra las levas.

`rodillo-flechas.png` es el dibujo; `escena.html` lo genera (three.js + SVG).

En la app está como ejemplo **«Rodillo de flechas»** (`exampleArrows` en `app/build.js`), y al lado
**«Rodillo de flechas mejorado»** (`exampleArrowsBetter`), con las mejoras propuestas: leva lisa, 8 mm de subida,
rodillos grandes y muelles suaves.

## Flotando en imanes

- **«Rodillo de flechas flotante»** (`exampleArrowsFloating`): el mejorado, con el cilindro en dos cojinetes magnéticos
  en vez de rodamientos de bolas. Da unas 15 vueltas en vez de 13: lo que gasta es la leva (rodillos, guías, golpecitos).
- **«Volante flotante»** (`exampleFloating`), la propuesta de Claude: el mismo cilindro sin imanes que tiren de él ni leva,
  flotando en los cojinetes y sujeto a lo largo por una punta de aguja. Con el mismo empujón de 300 rpm se para a los
  29,6 minutos (3.285 vueltas); sin aire, a los 52 minutos (7.854 vueltas). Con generador devuelve el 84 % como electricidad.

Cada cojinete: 12 discos de 12 mm pegados al eje (a 13 mm del centro) dentro de 18 discos fijos de 14 mm (a 31 mm),
todos de neodimio N52 imantados a lo largo del eje con el norte hacia el mismo lado. Rigidez en el plano unos 9.000 N/m:
con 1,6 kg el eje baja 1,16 mm. A lo largo del eje no se sostiene solo (teorema de Earnshaw): ahí va la punta de aguja.

## Por lo menos el 99 %: «Volante de vacío»

`exampleVacuum`: disco de acero de 20 cm y 12,3 kg en una cámara de vacío, en dos cojinetes magnéticos más fuertes
(en cada punta, 16 discos de 20 mm en el eje dentro de 24 de 25 mm fijos; rigidez unos 52.000 N/m, baja 2,3 mm) y una
punta de aguja, empujado a 3.000 rpm (3.035 J). Conserva el 99,988 % al minuto, el 99,876 % a los 10 minutos y el 99,3 %
a la hora; baja del 99 % hacia los 81 minutos y tardaría unos 11 días en pararse. Lo único que pierde es la aguja.
Los imanes de los cojinetes no tienen forma de choque: a 3.000 rpm el motor preveía choques que no pasan (giran en círculo).

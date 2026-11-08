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

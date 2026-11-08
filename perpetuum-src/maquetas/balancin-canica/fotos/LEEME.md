# El balancín de las fotos del aparato

El usuario mandó dos fotos del aparato del vídeo: una con el palo recto y la canica en la punta, y otra con la V
formada. Esta carpeta lo monta tal como sale en ellas. Las fotos no se guardan aquí porque son del vídeo.

## Lo que se ve en las fotos (`real.js`)

Las medidas salen de la foto de frente, con la canica de 16 mm como regla:

- **El palo:** recto, de aluminio, de 30 cm, con el eje en medio, a unos 68 mm sobre la bandeja.
- **El contrapeso (la «bobina»):** colgado de un gancho a 13,7 cm a la izquierda del eje. Se puede columpiar y,
  abajo, apoyarse en la tabla.
- **La rueda de goma:** bajo la punta derecha del palo. Es el tope de abajo y cae sobre una tira de goma de la
  bandeja.
- **La rampa:** una bisagra al final del palo y una rampa de 10 cm que cuelga unos 11°, con un tope donde se para
  la canica.
- **El escalón:** el bloque alto del final de la bandeja, con goma encima, bajo la punta de la rampa.

El banco empieza como en la foto del palo recto, con la canica en la punta, y se suelta.

## Como en la foto

- **Contrapeso de 20 a 50 g:** el palo baja 4°, la punta de la rampa se apoya en el escalón y ahí se queda; a los
  2 s está quieto. El escalón aguanta la canica en la punta, así que la V de la otra foto no llega a formarse.
- **Contrapeso de 60 g:** el palo ni siquiera baja.

## 3.200 variantes (`azar.js`, `afina.js`, `todo.sh`)

Una foto no da medidas exactas, así que se varía mucho todo lo que no se ve bien:

- **El contrapeso:** de 10 a 90 g, y lo cerca que cuelga de la tabla.
- **El escalón:** de 0 a 45 mm de alto.
- **La rampa:** de 7 a 14 cm, colgando de 0° a 25°, y su peso.
- **La canica:** de 3 a 30 g.
- **El palo:** su peso y la altura del eje.
- **Dónde va colgado el contrapeso y dónde va la rueda.**
- **Dónde se suelta:** desde la postura de la foto hasta 20° más arriba por el lado de la canica, como si se
  soltara a mano.

Son 2.000 diseños al azar y 4 rondas que prueban 10 variaciones de los 30 mejores. Quedaron fuera 181 en los que la
canica se cae y 1 con piezas metidas una dentro de otra. Ninguno se descartó por sumar energía; el error de las
cuentas es como mucho de 1,2 mJ.

### Resultados

- **Ninguno sigue moviéndose a los 30 s.** El que más dura se para a los 11,5 s.
- **Soltados en la postura de la foto (±2°):** 360 diseños. En 47 el palo baja hasta la V, pero en ninguno vuelve a
  subir.
- **Para que el palo vuelva a subir una vez hay que soltarlo a mano por lo menos 6° más arriba que en la foto.**

| Se suelta a | Diseños | Bajan hasta la V | Vuelven a subir |
|---|---|---|---|
| Menos de 5° | 619 | 71 | 0 |
| De 5° a 10° | 456 | 80 | 11 |
| De 10° a 15° | 540 | 203 | 71 |
| 15° o más | 1.403 | 1.061 | 648 |

- **El mejor** (`mejor.json`): contrapeso de 78 g, escalón de 35 mm, rampa de 7 cm sin caída y canica de 27 g.
  Soltado a mano desde 17°, baja y sube dos veces y se para a los 3,8 s, a −12°.
  - Se gastan 16,4 mJ: 8,7 en golpes y 7,9 en roces.
  - Funciona como un balancín con una canica que rueda de un lado a otro. La V apenas se forma.

En unas 1.100 pruebas el banco reparte mal la energía entre golpes y roces y salen golpes negativos. La suma sí
cuadra, así que no cambia nada de lo de arriba.

`fotos-en-el-banco.png` tiene el banco igual que en la foto, el ángulo del palo y el mejor diseño paso a paso.
`resumen.jsonl` tiene todas las pruebas y `mejores-300.jsonl` las 300 mejores con todos sus datos.

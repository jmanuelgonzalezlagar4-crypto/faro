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

## Segunda versión, medida otra vez (`real2.js`, `corre2.js`, `escena2.js`, `imagen2.js`)

El usuario dijo que ninguna imagen se parecía al aparato del vídeo, y tenía razón. Al ampliar las fotos con una
rejilla salieron varios errores:

- **La canica es grande:** mide lo mismo que la rueda negra, unos 22 mm, no 16 mm. Eso cambia la escala de todo.
- **La rueda negra está en la cara del palo**, centrada en la pletina, no colgando por debajo.
- **El palo son dos pletinas de 21 mm de alto**, con un taco negro entre ellas en la punta izquierda.
- **El contrapeso es un taco de arandelas** colgado de una anilla, muy cerca de la punta izquierda.
- **El escalón es un bloque más alto y más corto**, al final de la bandeja.
- **En la foto de la V** el palo baja unos 24° hasta que la rueda toca la tira negra, y la rampa sube unos 15°
  hasta el bloque.

El contrapeso cuelga en la foto 7,3 cm por debajo del palo. Aquí cuelga 5,8 cm para que la tabla no quede por
debajo de la bandeja. Eso no cambia lo que pesa en el palo.

Ahora el banco se puede poner exactamente como en cada una de las dos fotos y soltarlo desde ahí
(`medido-otra-vez.png`, con 50 g de contrapeso y una canica de 14 g):

- **Desde la foto de la V hace lo que explica el usuario:**
  - El contrapeso gana y sube el palo.
  - La V se pone recta y la canica corre hasta la punta; a los 0,3 s el palo está casi como en la foto recta.
  - Luego la canica en la punta hace bajar el palo. La punta de la rampa cae en el bloque, y a los 3 s está quieto
    a −5°.
- **Desde la foto del palo recto:** baja hasta −5°, la punta de la rampa cae en el bloque y se queda ahí. La V no se
  forma.
- **Las dos fotos acaban en la misma postura**, a medio camino. De la V a la foto recta va solo; de la foto recta a
  la V, no.

**1.000 variantes** (`azar2.js`, `resultados2.jsonl`): contrapeso de 0 a 150 g, taco negro de 0 a 40 g, canica de 5 a
30 g, escalón de 22 a 40 mm, rampa colgando de 4° a 14°, pesos del palo y de la rampa, y altura del eje de 62 a
74 mm. Cada una se suelta desde las dos fotos. Se descartan 10 en las que la canica se cae; ninguna por sumar
energía, y el error de las cuentas es como mucho de 1,5 mJ.

| Contrapeso | De la foto recta llegan a la V | De la V vuelven a la foto recta |
|---|---|---|
| 0 a 10 g | 8 de 72 | 2 de 72 |
| 10 a 20 g | 0 de 73 | 14 de 73 |
| 20 a 30 g | 0 de 76 | 24 de 76 |
| 30 a 50 g | 0 de 127 | 84 de 127 |
| 50 a 80 g | 0 de 214 | 209 de 214 |
| 80 a 150 g | 0 de 428 | 428 de 428 |

- **Ninguna hace las dos mitades**, ni siquiera por separado.
- Solo llegan a la V las que casi no tienen contrapeso (menos de 8 g), y esas no vuelven a subir.
- Ninguna sigue moviéndose a los 20 s; la que más dura se para a los 5,9 s.

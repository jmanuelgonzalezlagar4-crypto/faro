# Búsqueda: el balancín con la bola de otro peso y todo reajustado

El usuario pidió cambiar el peso de la bola, reajustar todo y probarlo de verdad. Esta carpeta busca la mejor
combinación entre miles de diseños del balancín tal como él lo explica:

1. **Bola en la punta:** pesa más su lado y baja.
2. **Se forma la V:** la punta de la rampa se apoya en el único escalón, a la derecha, y la bola rueda al fondo.
3. **La bobina sube el palo:** la V se pone recta y la bola vuelve a la punta.

## El modelo (`ciclo3.js`)

Todo se puede cambiar:

- **La bola:** de 3 a 300 g.
- **La bobina:** su peso.
- **El palo:** el largo de cada brazo y su peso.
- **El brazo derecho:** cuánto se inclina y cuánto mide.
- **La rampa:** su largo y su peso.
- **La bisagra:** cuánto se puede doblar.
- **El escalón:** su altura.
- **El arranque:** cuánto se inclina la línea al empezar.

El eje tiene topes, como en el aparato. Desde donde empieza, el palo puede bajar como mucho 50° por el lado de la
bola y subir 3° más.

## Cómo se busca

- **`azar.js`:** hace 1.500 diseños al azar.
- **`afina.js` y `rondas.sh`:** 6 rondas. En cada una cogen los 30 mejores de todo lo probado y prueban 10
  variaciones pequeñas de cada uno.
- **`todo.sh`:** hace las dos cosas.

`prueba3.js` mide cada diseño:

- **La recuperación:** después de que la bola llega al fondo de la V, cuánto vuelve a subir el palo desde lo más
  bajo. El 100 % sería volver a la altura del principio, y así poder empezar otra vuelta.
- **Las vueltas de la bola:** cuántas veces va de la punta a la V y vuelve a la punta.
- **Las vueltas del palo:** cuántas veces baja y vuelve arriba del todo.

Descarta los diseños en los que el banco suma energía que no existe.

Al hacer la búsqueda salieron tres errores, que se corrigieron antes de dar los resultados:

- **Un péndulo contado como vuelta:** el palo se columpiaba con la bola quieta en la punta. Ahora una vuelta exige
  que la bola vaya a la V y vuelva.
- **Medir antes de bajar:** la recuperación se medía antes de que el palo bajara del todo. Ahora se mide desde lo
  más bajo hasta donde sube después.
- **Palos que daban la vuelta entera:** el palo giraba entero alrededor del eje, y eso en el aparato no puede pasar.
  Ahora el eje tiene topes.

## Resultados (3.300 diseños; 2 descartados por sumar energía)

- **Ninguna vuelta completa:** en ningún diseño el palo vuelve arriba después de que la bola haya ido a la V.
- **La bola llega a la V:** en 1.567 diseños.
- **Recuperación:** la mejor es el 66,8 %, y sin roces el 67,7 %. Ningún diseño pasa del 70 %.
- **Los 300 mejores** (`mejores-300.jsonl`) hacen el viaje de la bola una sola vez (punta, V y punta) y ninguno lo
  repite.
- **Las 15 veces que el palo vuelve arriba:** son vaivenes de péndulo en los que la bola no llega a la V.

| Bola | Mejor recuperación | Con bobina de |
|---|---|---|
| 3 a 10 g | 66,8 % | 19 g |
| 10 a 20 g | 66,2 % | 6 g |
| 20 a 50 g | 62,0 % | 27 g |
| 50 a 100 g | 61,9 % | 153 g |
| 100 a 300 g | 45,6 % | 81 g |

Cuanto más pesada la bola, peor.

**El mejor diseño** (`mejor.json`, `busqueda.png`): bola de 7 g y bobina de 19 g.

1. El palo baja de 30° a −11°, se forma la V y la bola rueda al fondo.
2. La bobina sube el palo, la V se pone recta y la bola vuelve a la punta.
3. Pero el palo solo llega a 17°, no a 30°, y se queda quieto a 15° con la punta apoyada en el escalón.

Sin roces pasa casi lo mismo (67,7 %). Lo que se pierde está en los golpes:

- la bola contra el tope y contra el fondo de la V;
- la punta de la rampa contra el escalón;
- la bisagra al doblarse y al ponerse recta.

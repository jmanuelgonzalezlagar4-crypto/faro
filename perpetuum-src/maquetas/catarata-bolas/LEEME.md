# Catarata de bolas

Otra idea del mismo usuario de la noria de bolas. Fuera del tanque, una fila de bolas en un tubo baja hasta
un codo y empuja de lado la de abajo, que tapa el hueco del fondo. Las bolas de dentro suben flotando, salen
por arriba y caen como una catarata encima de la fila. El golpe tendría que meter en el tanque la bola del
hueco, y así una y otra vez.

En la app es el ejemplo «Catarata de bolas». `catarata-en-la-app.jpg` es una foto de la prueba.

## Lo que pasa en el banco

Son bolas de acero huecas de 10 cm y 247 g, en una columna de agua de 1 m. Fuera hay una fila de 5 bolas más
la del codo.

- Caen 3 bolas, con golpes de 0,84, 0,61 y 0,47 J.
- La fila tiene la bola del hueco metida 6 mm de sus 100 mm. Los golpes la empujan medio milímetro más.
- Se para a los 7,5 s. De los 5,61 J que tenía, se gastan:
  - 66 % en golpes;
  - 27 % en roces;
  - 7 % en el agua.

### El mejor caso: el golpe entero a la bola del hueco

`golpe.js` quita las bolas del tanque y le da a la bola del hueco toda la energía del golpe de una vez. Es
como si la fila la transmitiera entera, sin perder nada.

| Golpe | Cuánto entra | Qué pasa |
|---|---|---|
| 0,47 J | 20 mm de 100 | el agua la echa |
| 0,84 J (la mayor caída) | 27 mm de 100 | el agua la echa |
| 1,5 J | 37 mm de 100 | el agua la echa |
| **6,0 J** | entera | **entra** |

Empujando despacio bastarían 4,9 J. Hace falta más de un golpe porque el agua frena mucho una bola rápida.

## Las cuentas

El hueco está a 0,95 m de hondo, donde el agua aprieta con 9.320 Pa.

- **Lo que cuesta meter una bola:** apartar 0,52 L de agua a esa presión, 4,9 J.
- **Lo que empuja el agua sobre el hueco:** con la bola a medio meter, 73 N.
- **Lo que puede dar cada bola en una vuelta:**
  - al subir, el empuje menos su peso: (5,14 − 2,42 N) × 0,95 m = 2,6 J;
  - al caer por fuera, su peso: 2,42 N × 0,95 m = 2,3 J;
  - en total, 4,9 J: justo lo que cuesta meterla. No sobra nada, y el agua y los golpes se comen una parte.

### Por qué la fila no puede vencer al agua ni quieta

Imagina una fila tan alta como el agua sobre el hueco, hecha con las bolas más pesadas que todavía flotan,
que pesan lo mismo que el agua que apartan.

- Esa fila empuja con ρ·g·h·(2/3)·π·r².
- El agua empuja con ρ·g·h·π·r².

La fila empuja como mucho dos tercios de lo que empuja el agua. Una esfera es dos tercios del cilindro en el
que cabe, y una bola que flota pesa menos que su volumen de agua. Aquí serían 49 N contra 73 N.

## Bolas más pesadas, el agua hasta arriba y la caída que haga falta

`barrido.js` prueba la catarata cambiando cuatro cosas:

- **Peso de las bolas:** 247, 350, 450 y 500 g. Todas flotan; una de 10 cm deja de flotar a partir de 524 g.
- **Alto del agua:** 1, 2 y 3 m. Cuanto más alta, más alta es la caída.
- **Agua hasta arriba:** la salida justo al nivel del agua, o 15 cm por encima.
- **La fila de fuera:** 5 bolas, o ninguna para que la caída sea la máxima.

Son 48 casos. **En ninguno entra la bola de abajo.**

`umbral.js` busca el golpe mínimo, entero a la bola del hueco, que hace falta para meterla.

En cada casilla está el golpe más fuerte que se consiguió y, detrás, el que hace falta:

| Bola (cuánto asoma al flotar) | 1 m de agua | 2 m | 3 m |
|---|---|---|---|
| 247 g (53 %) | 2,2 J / 6,1 J | 4,4 / 12,4 | 6,7 / 18,6 |
| 350 g (33 %) | 2,3 / 5,7 | 6,5 / 11,6 | 9,5 / 17,5 |
| 450 g (14 %) | no sale ninguna / 5,5 | 7,7 / 11,3 | 12,6 / 16,9 |
| 500 g (5 %) | no sale ninguna / 5,5 | no sale ninguna / 11,1 | 13,4 / 16,7 (sale una sola) |

`450g-3m.png` muestra el caso de 450 g y 3 m. Las bolas salen de una en una y caen 3 m. A los 36 s hay 15
bolas en la fila, 12 atascadas arriba del tanque, y la del hueco no ha entrado.

Por qué no hay manera:

- **Bola más pesada:** golpea más fuerte, pero el agua la sube con menos fuerza. Asoma menos, y las de debajo
  apenas pueden sacarla del agua.
- **Agua más alta:** la caída es mayor, pero el hueco queda más hondo y meter la bola cuesta más. Las dos
  cosas crecen igual.
- **El límite:** la caída da como mucho el peso de la bola por el alto del agua. Meterla cuesta el peso del
  agua que aparta por esa misma altura. Para flotar, la bola tiene que pesar menos que esa agua, así que el
  golpe siempre se queda corto.

En cinco casos, todos con la fila de 5 bolas y muchas más apiladas encima, el banco se equivocó a favor de la
máquina: sumó entre 2 y 67 J que no existen. Aun así no entró ninguna bola.

## Otro líquido: agua de mar, salmuera, uno el doble de pesado

`barrido.js` y `umbral.js` aceptan también la densidad del líquido (`rho`). Las bolas cambian de peso con el
líquido para que asomen lo mismo: el 53 % (como las de 247 g en agua dulce) o el 14 % (como las de 450 g).

Golpe más fuerte que se consiguió / golpe que hace falta, con bolas que asoman el 14 % y 3 m de líquido:

| Líquido | Densidad | Golpe / necesario | Proporción |
|---|---|---|---|
| Agua dulce | 1.000 kg/m³ | 12,0 / 16,9 J | 71 % |
| Agua de mar | 1.025 | 12,3 / 17,4 J | 71 % |
| Salmuera (agua con toda la sal que admite) | 1.200 | 14,4 / 20,3 J | 71 % |
| Un líquido el doble de pesado que el agua | 2.000 | 24,2 / 33,9 J | 71 % |

En los 16 casos no entra ninguna bola. Un líquido más pesado empuja más las bolas hacia arriba, pero también
aprieta más en el fondo. Las dos cosas crecen igual, así que la proporción no cambia.

## Perder agua a cambio de que la bola entre: la esclusa

`esclusa.js` pone en el hueco del fondo de la noria de bolas una esclusa perfecta: una cámara con dos puertas,
sin roce. La bola entra sin empujar nada, pero cada vez se escapa por abajo el agua que ocupa: medio litro a
la presión del fondo. Esa agua se apunta como energía que entra, porque hay que reponerla para que el tanque no
se vacíe.

| En 2 minutos | Agua dulce | Agua de mar | Salmuera |
|---|---|---|---|
| Bolas que entran | 161 | 161 | 160 |
| Vueltas de la noria | 64 | 66 | 71 |
| Agua que se escapa | 84 L (760 J) | 84 L (779 J) | 84 L (913 J) |
| Electricidad | 20 J | 21 J | 24 J |
| Lo que saca del agua que se escapa | 2,6 % | 2,7 % | 2,6 % |

Con la esclusa la noria no se para nunca, pero es un molino de agua, y muy malo:

- Cada bola gasta medio litro, que lleva 4,7 J; la noria saca 0,12 J.
- Con esa misma agua, una turbina normal (70 %) sacaría unos 530 J, 26 veces más.
- Para que no se acabe el agua hay que volver a subirla: subir 84 L a 1 m con una bomba normal (70 %) cuesta
  1.100 J, para sacar 20.
- Si el agua viene sola de más arriba, de un río o de la lluvia, entonces sí da energía: la del agua que baja.
  Pero una turbina la aprovecha mucho mejor que las bolas.

## En una cámara de vacío, con un acumulador y una descarga

`descarga.js` monta la noria de bolas en una cámara de vacío, sin aire.

- El generador de la noria carga un acumulador, que empieza con 100 J.
- Cuando una bola se queda quieta delante del hueco, una descarga le da un empujón (un solenoide que convierte
  en movimiento el 80 % de la electricidad).
- Dentro hay una trampilla que solo se abre hacia dentro. Sin ella, las bolas empujadas fuerte rebotan contra
  la pared del fondo y vuelven a salir.

| Descarga | Descargas | Bolas que entran | Gasta del acumulador | Produce la noria | Acumulador al final |
|---|---|---|---|---|---|
| 0,5 J (en 1 min) | 119 | 0 | 74 J | 1,0 J | 27 J |
| 2 J | 11 | 0 | 28 J | 1,0 J | 73 J |
| 5 J | 16 | 0 | 100 J | 1,0 J | 1 J |
| 6,5 J | 12 | 12 | 98 J | 2,7 J | 5 J |
| 8 J | 10 | 10 | 100 J | 2,4 J | 2 J |
| 8 J, con aire | 10 | 10 | 100 J | 2,9 J | 3 J |

- **Descarga pequeña:** no mete ninguna bola, y el acumulador se gasta igual.
- **Descarga que sí las mete:** cada bola cuesta 8 J del acumulador, y la noria le devuelve unos 0,2 J. A los
  15 s el acumulador ya no puede dar otra descarga y la máquina se para.
- **El vacío casi no cambia nada:** el aire solo se llevaba 0,3 J de 100. Lo que frena es el agua (32 J), y las
  bolas siguen moviéndose dentro del agua. Además, en el vacío el agua hierve a 20 °C: la cámara se llenaría de
  vapor.
- **Ni con todo perfecto:** meter la bola cuesta como mínimo 4,9 J, y a la vuelta da como mucho esos 4,9 J.
  Con un generador del 85 % y un solenoide del 80 %, cada bola deja al acumulador 1,9 J más vacío.

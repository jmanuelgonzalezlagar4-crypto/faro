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

## Una fila que casi equilibre el agua, y el peso de la que cae para rematar

La idea: que la fila pese casi lo que empuja el agua, para que con la bola que cae encima la del hueco entre
sobrada. Hay tres preguntas.

**1. ¿Qué fila mete la bola sola?** `fila-perfecta.js` cambia la fila por un empuje fijo igual a su peso, como
si la fila y la curva fueran perfectas, sin roces. Primero lo probé con una fila de verdad y una curva redonda,
pero el banco no consigue pasar bien tanto peso por la curva.

- **Fila que cae de golpe:** con 60,5 N la bola entra sola. Son 25 bolas de 247 g, una fila de 2,5 m.
- **Fila que empuja despacio:** hacen falta 73 N, lo que aprieta el agua con la bola a medio meter. Son 30
  bolas, 3 m.

**2. ¿Hasta dónde suben las bolas solas?** La columna del tanque empuja hacia arriba las bolas que salen del
agua, pero solo hasta cierta altura. Con las bolas de debajo sumergidas:

- en teoría, hasta 2,0 m sobre el hueco: 20 bolas, 48,5 N;
- en el banco, salen por arriba hasta 1,5 m, y a 1,7 m ya no sale ninguna (`barrido.js` con `sobre`).

Pase lo que pase, la fila más alta que las bolas pueden alcanzar solas empuja dos tercios de lo que hace falta.

**3. ¿Llega el golpe para lo que falta?** `fila-y-caida.js` empieza con la fila más alta posible, de 20 bolas.
Luego la acorta para que la bola de arriba caiga desde más alto. Es el mejor caso: fila perfecta y golpe entero.

| Fila | Caída | Golpe que trae | Golpe que hace falta |
|---|---|---|---|
| 20 bolas (48,5 N) | 0 m | 0 J | 1,14 J |
| 18 | 0,2 m | 0,48 J | 1,49 J |
| 16 | 0,4 m | 0,97 J | 1,88 J |
| 14 | 0,6 m | 1,45 J | 2,31 J |
| 12 | 0,8 m | 1,94 J | 2,77 J |
| 10 | 1,0 m | 2,42 J | 3,24 J |

Siempre falta alrededor de 1 J.

- **Fila más corta:** cada bola que se le quita deja caer la de arriba 10 cm más. La caída gana justo lo que la
  fila pierde, 0,24 J, pero como golpe se aprovecha peor.
- **Fila de 30 bolas:** metería la bola sola, y sobrarían 2,4 J (7,3 J que da la fila contra 4,9 J que cuesta
  entrar). Pero para mantenerla tan alta hay que subir cada bola nueva 1 m por encima de donde llega sola, y eso
  cuesta justo 2,4 J.

### Con el tanque lleno hasta la boca

Las bolas salen por el borde, al nivel del agua, a 1 m sobre el hueco. Ya no hay columna por encima del agua que
las suba más, así que la fila de fuera puede tener como mucho 1 m: 10 bolas. `tanque-lleno.js` lo prueba con la
fila perfecta y el golpe entero:

| Bola | Fila | Caída | Golpe que trae | Golpe que hace falta |
|---|---|---|---|---|
| 247 g | 10 (24 N) | 0 m | 0 J | 3,24 J |
| 247 g | 6 | 0,4 m | 0,97 J | 4,29 J |
| 247 g | 0 | 1 m | 2,42 J | 6,17 J |
| 350 g | 10 (34 N) | 0 m | 0 J | 2,18 J |
| 350 g | 6 | 0,4 m | 1,37 J | 3,44 J |
| 350 g | 0 | 1 m | 3,43 J | 5,85 J |

Sale peor que con la columna por encima del agua: falta de 2,2 a 3,7 J. Lo que el agua empuja a cada bola al
subir (2,7 J con 247 g) ya no sirve para subirla más arriba: se gasta en frenarla y en la superficie.

- **Bolas más pesadas:** empujan más en la fila, pero apenas asoman; con 450 g ya no sale ninguna por el borde.
- **El agua que se pierde:** con el tanque a rebosar, cada bola que entra echa fuera medio litro de agua por
  arriba.

## Bolas imantadas y un imán que tire de ellas hacia dentro

`imanes.js` pone un disco de neodimio N52 de 2 cm dentro de cada bola de la noria y un imán fijo dentro del
tanque, al fondo, enfrente del hueco, para que tire de las bolas hacia dentro. También lo prueba debajo del
suelo, cerca del hueco.

| Imán fijo | Bolas que entran | Bolas pegadas abajo | Vueltas de la noria | Electricidad |
|---|---|---|---|---|
| Ninguno | 0 | 0 | 4,0 | 0,95 J |
| 4 a 10 cm, en la pared | 0 | 0 o 1 | 3,6 a 4,3 | 0,9 a 1,1 J |
| 6 a 14 cm, bajo el suelo | 0 | 0 o 1 | 2,8 a 3,6 | 0,5 a 0,9 J |
| 12 a 20 cm, en la pared (paso fino) | 0 | 2 | 0,8 a 1,4 | 0,15 a 0,3 J |

- **El imán no sabe de qué bola tirar:** tira más fuerte de las que ya están dentro, porque las tiene más cerca,
  y las sujeta abajo. La columna se queda sin las bolas que tenían que empujar, y la noria gira menos.
- **Aunque tirara de la bola del hueco:** una vez dentro la tendría pegada. Para soltarla hay que vencer la
  misma fuerza que la metió, y el agua solo la empuja hacia arriba con 2,7 N.
- **Las bolas imantadas se pegan entre sí:** en la fila y en el montón de abajo.
- **Imanes de más de 12 cm:** con el paso de cálculo normal, el banco suma hasta 2.800 J que no existen; la app lo
  avisaría. Con un paso de 4 a 8 veces más fino las cuentas cuadran, y son las filas de la tabla.

## Un condensador que se cargue con la caída y use la descarga

Un condensador es un acumulador que se descarga muy deprisa: no cambia la energía. Ya está probado con el
acumulador (`descarga.js`): cada bola que entra le cuesta 8 J, y la noria devuelve unos 0,2 J.

Con todo perfecto, una bola de 247 g que cae 1 m dentro de una bobina:

- da como mucho 2,4 J;
- con un generador del 85 % quedan 2,1 J en el condensador;
- con una bobina que empuje con el 80 %, el golpe es de 1,6 J.

Hacen falta 6 J de golpe, o 4,9 J empujando despacio. Aun sumando lo que da la bola al subir, todo perfecto
(2,6 + 2,3 J) × 85 % × 80 % = 3,3 J, sigue sin llegar a 4,9 J.

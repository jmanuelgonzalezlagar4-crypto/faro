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

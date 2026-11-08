# Noria de bolas flotantes

Idea de un usuario: bolas de acero huecas que suben solas por un tanque de agua, salen por arriba, mueven una
noria con generador y vuelven a entrar por el fondo. Ciclo cerrado.

## Cuentas de una bola (10 cm, 247 g, tanque de 1 m)

| | |
|---|---|
| Al subir, empuje (5,14 N) menos peso (2,42 N), en 1 m | +2,72 J |
| Al bajar por fuera, su peso | +2,42 J |
| **Lo más que puede dar** | **5,14 J** |
| Meterla por el fondo contra la presión (9.810 Pa × 0,52 L) | −5,14 J |

Siempre igual: el empuje sale de la presión del agua, y es esa misma presión la que hay que vencer para entrar.
Con aire en vez de bolas: comprimir medio litro a la presión del fondo cuesta 5,38 J y devuelve 5,38 J.
Si suben sueltas, a 1,2 m/s el agua se come 2,5 de los 2,7 J del empuje.

## En el simulador

El banco tiene agua (pieza «Tanque de agua»): la energía del agua apartada por cada bola (ρ·g·∫profundidad·dV,
integrada exacta por rebanadas) da el empuje y la presión que se opone a entrar; el agua frena (arrastre
cuadrático y olas en la superficie) y eso va a «Frenado en el agua».

- **«Noria de bolas flotantes»**: suben, salen, la noria gira casi 2 vueltas (0,43 J de electricidad) y se para:
  en el hueco del fondo hacen falta hasta 72 N para meter una bola y la fila del canal empuja con unos 5 N.
- **«Rueda de flotadores»**: la energía de la rueda en una vuelta entera cambia 0,0000 J (sube y baja ±1,2 J);
  empujes como empujes, avanza un poco y se queda en equilibrio.

`estudio.png` / `estudio.html`: el dibujo del estudio.

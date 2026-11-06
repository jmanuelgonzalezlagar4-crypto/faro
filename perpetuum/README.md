# Taller Perpetuum

Banco de pruebas para diseñar máquinas de movimiento perpetuo y comprobarlas con física real antes de fabricarlas.
Funciona sin conexión y se instala como app (PWA). Para publicarla en Google Play, sigue [PUBLICAR.md](PUBLICAR.md).

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | La página de la app: estructura y estilos |
| `js/engine.js` | Motor de física 2D con contabilidad de energía (velocity Verlet con restricciones, choques, rozamiento, imanes como dipolos, motores, generadores y batería) |
| `js/build.js` | Convierte un diseño (lista de piezas) en un mundo simulable, y contiene los ejemplos |
| `js/gl3d.js` | Vista en perspectiva con three.js |
| `js/app.js` | Editor, paneles, cuentas, retos, «Mis diseños», asistente de maquetas y ajustes |
| `js/vision.js` | Busca en una foto la rueda y las pesas (transformada de Hough, en el propio dispositivo) |
| `js/i18n.js` | Traducción al inglés y elección del idioma (generado desde `perpetuum-src/i18n/`) |
| `lib/three.min.js` | three.js r128 (licencia MIT) |
| `fonts/` | Barlow, Barlow Condensed e IBM Plex Mono (licencia OFL) |
| `sw.js` | Service worker: guarda la app para que funcione sin conexión |
| `manifest.webmanifest` | Nombre, iconos y colores de la app instalada |
| `privacidad.html`, `privacy.html` | Política de privacidad (español e inglés) |
| `temporada.json` | Patrocinadores y concurso de la temporada (se edita sin publicar otra versión) |
| `bases-concurso.html` | Borrador de las bases del concurso |
| `tienda/` | Icono, gráfico destacado, capturas y textos para Play Store (`tienda/en/`: en inglés) |

## Cambiar la app

El código fuente está en `../perpetuum-src/`: se edita allí y se genera esta carpeta con `python3 assemble.py pwa` (ver `perpetuum-src/LEEME.md`). Así se regenera también la traducción y el nombre de la caché de `sw.js`.

## Idiomas

Español e inglés. La app usa el idioma del móvil (español si está en español, catalán, gallego o euskera; inglés en cualquier otro caso) y se puede cambiar en **Más → Idioma · Language**.

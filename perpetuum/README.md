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
| `js/app.js` | Editor, paneles, cuentas, retos, «Mis diseños» y ajustes |
| `lib/three.min.js` | three.js r128 (licencia MIT) |
| `fonts/` | Barlow, Barlow Condensed e IBM Plex Mono (licencia OFL) |
| `sw.js` | Service worker: guarda la app para que funcione sin conexión |
| `manifest.webmanifest` | Nombre, iconos y colores de la app instalada |
| `privacidad.html` | Política de privacidad |
| `temporada.json` | Patrocinadores y concurso de la temporada (se edita sin publicar otra versión) |
| `bases-concurso.html` | Borrador de las bases del concurso |
| `tienda/` | Icono, gráfico destacado, capturas y textos para Play Store |

## Cambiar la app

Edita los archivos y cambia el nombre de la caché en `sw.js` (`const CACHE = …`) para que los móviles descarguen la versión nueva. Si cambias el número de versión, cámbialo también en `APP_VERSION` (`js/app.js`) y en los `?v=` de `index.html` y `sw.js`.

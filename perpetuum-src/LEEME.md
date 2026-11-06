# Taller Perpetuum — código fuente

Aquí está todo lo que hace falta para generar la carpeta `perpetuum/` que sirve GitHub Pages. No se edita `perpetuum/` a mano: se edita aquí y se genera.

## Preparar (una vez)

Hace falta Python 3 y Node.js.

```bash
cd perpetuum-src
bash tools/vendor.sh        # descarga three.js r128, las fuentes y acorn
```

## Generar la app

```bash
cd perpetuum-src/app
python3 assemble.py pwa     # crea app/dist/perpetuum con la versión instalable
rm -rf ../../perpetuum/js ../../perpetuum/lib ../../perpetuum/fonts
cp -r dist/perpetuum/. ../../perpetuum/
```

`assemble.py` también regenera la traducción (`i18n.js`) y el nombre de la caché del service worker. Sin `pwa` crea `taller-perpetuum.html`, la versión de una sola página; con `debug`, `debug.html` para las pruebas.

## Archivos

| Archivo | Qué es |
|---|---|
| `app/template.html` | Estructura y estilos de la página |
| `app/engine.js` | Motor de física 2D con cuentas de energía |
| `app/build.js` | De un diseño (lista de piezas) al mundo simulable; ejemplos |
| `app/gl3d.js` | Vista 3D con three.js |
| `app/vision.js` | Busca en una foto la rueda y las pesas (Hough guiada por el gradiente) y coloca las bisagras |
| `app/app.js` | Interfaz: editor, cuentas, retos, concurso, tienda, asistente de maquetas, ajustes |
| `app/i18n-runtime.js` | Elección del idioma y función `T()` |
| `app/pwa-src/` | Manifiesto, iconos, políticas de privacidad, `temporada.json`, bases del concurso |
| `app/sw-template.js` | Plantilla del service worker |
| `i18n/tr*.tsv` | Traducciones al inglés: `id<TAB>texto en inglés` |
| `tools/` | Extracción de textos (`keys.js`), generador de `i18n.js` (`mkdict.js`) |

## Traducción

Los textos se escriben en español dentro de `T('…')`. Cada texto tiene un `id` (los 7 primeros caracteres de su SHA-1).
Al generar, `tools/mkdict.js` dice cuántos textos faltan por traducir y lista cada uno con su `id`: se añaden a `i18n/tr*.tsv` (`id`, tabulador, traducción).
Las variables entre llaves (`{n}`) y las etiquetas HTML tienen que coincidir; si no, también avisa.

## Pruebas

```bash
cd perpetuum-src/app
node test.js && node guard.js && node t9.js      # física sin interfaz
python3 assemble.py debug && node v7.js && node en1.js   # interfaz (Playwright): maqueta en español y repaso en inglés
```

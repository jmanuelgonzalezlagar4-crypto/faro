# Publicar Taller Perpetuum en Google Play

La app es una web instalable (PWA), como FARO. Google Play la recibe envuelta en una «actividad web de confianza» (TWA): un paquete Android que abre la web a pantalla completa. Cuando actualizas la web, la app del móvil se actualiza sola, sin volver a subir nada.

## 1. Publicar la web

1. Fusiona en `main` la rama con la carpeta `perpetuum/`.
2. GitHub Pages la sirve en **https://jmanuelgonzalezlagar4-crypto.github.io/faro/perpetuum/**.
3. Ábrela en el móvil con Chrome y comprueba que carga, que funciona sin conexión (modo avión tras la primera visita) y que se puede instalar («Añadir a la pantalla de inicio»).

## 2. Crear el paquete Android con PWABuilder

1. Entra en https://www.pwabuilder.com, pega la dirección de arriba y pulsa **Start**.
2. **Package For Stores → Android → Generate Package**, con estas opciones:

| Opción | Valor |
|---|---|
| Package ID | `io.github.jmanuelgonzalezlagar4_crypto.perpetuum` |
| App name | Taller Perpetuum |
| Launcher name | Perpetuum |
| Version code | 1 |
| Version name | 1.0.0 |
| Host | `jmanuelgonzalezlagar4-crypto.github.io` |
| Start URL | `/faro/perpetuum/` |
| Theme color / Background color | `#E2EADB` |
| Display mode | Standalone |
| Signing key | **Create new** (o *Use mine* si quieres usar la misma llave que FARO) |

3. Descarga el zip. Dentro vienen el `.aab` que subirás a Play, la llave de firma (`signing.keystore`), sus contraseñas (`signing-key-info.txt`) y un `assetlinks.json`.
4. **Guarda la llave y las contraseñas en un sitio seguro.** Sin ellas no podrás publicar actualizaciones del paquete.

## 3. Verificar el dominio (para que no salga la barra del navegador)

Android solo lee el archivo de verificación en la **raíz del dominio**:
`https://jmanuelgonzalezlagar4-crypto.github.io/.well-known/assetlinks.json`, que está en el repositorio `jmanuelgonzalezlagar4-crypto.github.io`.

Ahora mismo ese archivo solo contiene PresuVolt. Añade una entrada para Perpetuum con dos huellas SHA-256:

- la de `signing-key-info.txt` (llave de subida de PWABuilder);
- la de Play Console → **Integridad de la aplicación → Firma de apps → Certificado de clave de firma de la aplicación** (Google vuelve a firmar la app con su propia llave).

```json
[
  { "relation": ["delegate_permission/common.handle_all_urls"],
    "target": { "namespace": "android_app", "package_name": "io.github.jmanuelgonzalezlagar4_crypto.presuvolt",
      "sha256_cert_fingerprints": ["(las dos huellas que ya hay, sin cambiar)"] } },
  { "relation": ["delegate_permission/common.handle_all_urls"],
    "target": { "namespace": "android_app", "package_name": "io.github.jmanuelgonzalezlagar4_crypto.perpetuum",
      "sha256_cert_fingerprints": ["HUELLA_DE_PWABUILDER", "HUELLA_DE_PLAY_CONSOLE"] } }
]
```

> **Ojo con FARO:** su archivo está en `faro/.well-known/assetlinks.json`, que Android no consulta porque no está en la raíz del dominio. Si en la app de FARO ves la barra con la dirección arriba, la solución es añadir también su entrada (con su huella y la de Play Console) a este mismo archivo raíz.

## 4. Play Console

1. **Crear aplicación** → nombre «Taller Perpetuum», idioma predeterminado Español (España), Aplicación, Gratis.
2. **Ficha de Play Store:** copia los textos y sube las imágenes de `perpetuum/tienda/` (lo tienes todo en `FICHA-PLAY-STORE.md`).
3. **Contenido de la aplicación:** política de privacidad, seguridad de los datos, clasificación, público objetivo y anuncios, con las respuestas de la ficha.
4. **Pruebas:** sube el `.aab` a una prueba interna o cerrada. Si tu cuenta de desarrollador es personal, Google puede exigir una prueba cerrada con varios testers durante un tiempo antes de producción; Play Console te dice el requisito exacto de tu cuenta.
5. Cuando se cumpla, **Producción → Crear versión** con el mismo `.aab`.

## 5. Actualizar la app más adelante

- **Cambios en la app** (piezas, textos, física): actualiza los archivos de `perpetuum/` y cambia el nombre de la caché en `sw.js` (la línea `const CACHE = …`). Los móviles reciben la nueva versión al abrir la app; no hace falta subir nada a Play.
- **Cambios en el paquete** (nombre, icono del lanzador, colores de la barra): genera un `.aab` nuevo en PWABuilder con la misma llave, sube el *Version code* en 1 y publícalo en Play Console.

## 6. Patrocinadores y concurso

Todo se controla con el archivo **`temporada.json`**, sin publicar una versión nueva de la app: los móviles lo descargan al abrirla con conexión.

- **Patrocinadores** (`patrocinadores`): cada uno con `nombre`, `texto`, `enlace` (una web `https://` o un `mailto:`), `boton` y, si quieres, `imagen` (un archivo `.png`/`.jpg` subido a esta carpeta o una dirección `https://`). Se muestra uno al día, en «Cuentas» y en la pestaña «Concurso». No hay redes publicitarias ni rastreo.
- **Concurso** (`concurso`): pon `"activo": true`, las fechas `desde` y `hasta` (formato `AAAA-MM-DD`), los textos de los tres `premios`, el `correo` donde recibirás las participaciones y la página de `bases`.
- **Bases:** `bases-concurso.html` es un **borrador**. Completa los datos marcados y revísalo con un gestor o un abogado antes de activar el concurso. Publica cuantías concretas antes de empezar cada temporada: «el 25 % de los anuncios» sin cifra es difícil de comprobar para los participantes.
- **Participar:** cada persona prueba su máquina hasta que se para, va a «Ejemplos y retos → Concurso» y pulsa «Enviar al concurso». La app prepara un archivo y lo comparte; la persona lo envía a tu correo.
- **Elegir ganadores:** en la app, «Más → Verificar participaciones», abre todos los archivos recibidos. Cada máquina se vuelve a probar desde su diseño, sin empujones y durante 10 minutos como máximo. La clasificación usa la eficiencia verificada, nunca la declarada, y descarta las pruebas con error de cálculo. En caso de empate, gana quien envió antes.
- **Impuestos:** en España, los premios de más de 300 € llevan retención de IRPF que practica el organizador. Confírmalo con tu gestor.
- **Play Console:** con patrocinadores, marca «Contiene anuncios» en *Contenido de la aplicación*.

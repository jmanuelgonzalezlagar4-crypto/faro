import sys, subprocess
subprocess.run(['node', '../tools/mkdict.js', '.', '../i18n'], check=True)
t=open('template.html').read()
app=open('app.js').read()
if len(sys.argv)>1 and sys.argv[1]=='debug': app=app.replace("  var S = {","  var S = window.__T = {",1)
for k,f in [('/*I18N*/','i18n.js'),('/*ENGINE*/','engine.js'),('/*BUILD*/','build.js'),('/*GL*/','gl3d.js'),('/*VISION*/','vision.js')]:
    t=t.replace(k,open(f).read())
t=t.replace('/*APP*/',app)
if len(sys.argv)>1 and sys.argv[1]=='debug':
    open('debug.html','w').write('<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style></head><body>'+t+'</body></html>')
else:
    open('taller-perpetuum.html','w').write(t)
    open('preview.html','w').write('<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style></head><body>'+t+'</body></html>')


# ---------- versión instalable (PWA para Play Store) ----------
def build_pwa(out='dist/perpetuum', version='1.1.0'):
    import os, shutil, re, hashlib
    os.makedirs(out + '/js', exist_ok=True); os.makedirs(out + '/lib', exist_ok=True); os.makedirs(out + '/fonts', exist_ok=True)
    t = open('template.html').read()
    # sin dependencias externas: fuentes y three.js locales
    t = re.sub(r'<link rel="preconnect"[^>]*>\n', '', t)
    t = re.sub(r'<link rel="stylesheet" href="https://fonts.googleapis.com[^>]*>\n', '', t)
    t = t.replace('<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>', '<script src="lib/three.min.js"></script>')
    fonts = [('Barlow Condensed', 500, 'barlow-condensed-latin-500-normal'), ('Barlow Condensed', 600, 'barlow-condensed-latin-600-normal'), ('Barlow Condensed', 700, 'barlow-condensed-latin-700-normal'),
             ('Barlow', 400, 'barlow-latin-400-normal'), ('Barlow', 500, 'barlow-latin-500-normal'), ('Barlow', 600, 'barlow-latin-600-normal'),
             ('IBM Plex Mono', 400, 'ibm-plex-mono-latin-400-normal'), ('IBM Plex Mono', 500, 'ibm-plex-mono-latin-500-normal')]
    ff = ''
    for fam, w, f in fonts:
        pkg = {'Barlow Condensed': 'fontsource-barlow-condensed-5.1.0', 'Barlow': 'fontsource-barlow-5.1.0', 'IBM Plex Mono': 'fontsource-ibm-plex-mono-5.1.0'}[fam]
        shutil.copy('../fonts/%s/package/files/%s.woff2' % (pkg, f), out + '/fonts/' + f + '.woff2')
        ff += '@font-face { font-family: "%s"; font-style: normal; font-weight: %d; font-display: swap; src: url("fonts/%s.woff2") format("woff2"); }\n' % (fam, w, f)
    for pkg in ['fontsource-barlow-5.1.0', 'fontsource-ibm-plex-mono-5.1.0']:
        shutil.copy('../fonts/%s/package/LICENSE' % pkg, out + '/fonts/LICENCIA-' + pkg.split('-')[1] + ('-' + pkg.split('-')[2] if 'plex' in pkg else '') + '.txt')
    shutil.copy('../lib3/package/build/three.min.js', out + '/lib/three.min.js')
    shutil.copy('../lib3/package/LICENSE', out + '/lib/LICENCIA-three.txt')
    # la cabecera de la plantilla (<title> y la meta del visor) va dentro del <head>
    head_end = t.index('<style>')
    t_head, t_rest = t[:head_end], t[head_end:]
    t_head = t_head.replace('<meta name="claude:viewport-fit-sides" content="cover">\n', '')
    style_end = t_rest.index('</style>')
    css, body = t_rest[len('<style>'):style_end], t_rest[style_end + len('</style>'):]
    css = ff + css + """
/* app instalada: el sistema no añade márgenes, los pone la propia app */
html, body { margin: 0; }
.app { padding-top: max(8px, env(safe-area-inset-top, 0px)); padding-bottom: max(8px, env(safe-area-inset-bottom, 0px)); }
[hidden] { display: none !important; }
"""
    # los scripts propios van como archivos aparte
    body = body.replace('<script>\n/*I18N*/\n</script>', '<script src="js/i18n.js?v=%s"></script>' % version)
    body = body.replace('<script>\n/*ENGINE*/\n</script>', '<script src="js/engine.js?v=%s"></script>' % version)
    body = body.replace('<script>\n/*BUILD*/\n</script>', '<script src="js/build.js?v=%s"></script>' % version)
    body = body.replace('<script>\n/*GL*/\n</script>', '<script src="js/gl3d.js?v=%s"></script>' % version)
    body = body.replace('<script>\n/*VISION*/\n</script>', '<script src="js/vision.js?v=%s"></script>' % version)
    body = body.replace('<script>\n/*APP*/\n</script>', '<script src="js/app.js?v=%s"></script>\n<script>\nif (\'serviceWorker\' in navigator) { window.addEventListener(\'load\', function () { navigator.serviceWorker.register(\'sw.js\').catch(function () { /* sin servicio, la app funciona igual */ }); }); }\n</script>' % version)
    html = ('<!DOCTYPE html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
            '<meta name="description" content="Diseña máquinas de movimiento perpetuo y ponlas a prueba con física real en 3D. El banco apunta de dónde sale y a dónde va cada julio.">\n'
            '<meta name="theme-color" content="#e2eadb">\n'
            '<link rel="manifest" href="manifest.webmanifest">\n'
            '<link rel="icon" type="image/png" sizes="192x192" href="icon-192.png">\n'
            '<link rel="apple-touch-icon" href="apple-touch-icon.png">\n'
            + t_head + '<style>' + css + '</style>\n</head>\n<body>\n' + body + '\n</body>\n</html>\n')
    open(out + '/index.html', 'w').write(html)
    for f in ['i18n.js', 'engine.js', 'build.js', 'gl3d.js', 'vision.js', 'app.js']:
        shutil.copy(f, out + '/js/' + f)
    for f in ['manifest.webmanifest', 'privacidad.html', 'privacy.html', 'temporada.json', 'bases-concurso.html', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png']:
        shutil.copy('pwa-src/' + f, out + '/' + f)
    files = ['./', './index.html', './manifest.webmanifest', './privacidad.html', './privacy.html', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png',
             './lib/three.min.js'] + ['./js/%s?v=%s' % (f, version) for f in ['i18n.js', 'engine.js', 'build.js', 'gl3d.js', 'vision.js', 'app.js']] + ['./fonts/%s.woff2' % f[2] for f in fonts]
    hh = hashlib.sha1()
    for p in files:
        if p != './': hh.update(open(out + '/' + p[2:].split('?')[0], 'rb').read())
    h = hh.hexdigest()[:8]
    sw = open('sw-template.js').read().replace('__CACHE__', 'perpetuum-%s-%s' % (version, h)).replace('__ASSETS__', ',\n  '.join("'%s'" % p for p in files))
    open(out + '/sw.js', 'w').write(sw)
    print('PWA en', out, 'caché', h)

if len(sys.argv) > 1 and sys.argv[1] == 'pwa':
    build_pwa()

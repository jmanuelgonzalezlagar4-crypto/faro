# Baterías de larga duración y sistemas "cargar despacio y soltar de golpe" para aparatos pequeños

Nota de método (para quien redacte el informe): en esta sesión WebFetch no pudo abrir ninguna página (fallaron en.wikipedia.org, hackaday.com, ti.com, analog.com, livescience.com, imagesco.com y applied-ee.github.io: "host fuera de la red permitida"). Todo lo citado viene de los resúmenes/fragmentos de WebSearch, con la URL que el buscador asoció a cada dato. Los cálculos propios se marcan como "Inferencias" y se pueden comprobar con las fórmulas que se dan. Fecha de referencia: noviembre de 2026.

Fórmulas útiles (física básica, no necesitan fuente):
- Energía para levantar una masa: E = m·g·h. 100 g a 1 cm = 0,1 kg × 9,81 m/s² × 0,01 m = **0,0098 J (9,8 mJ)**.
- Energía en un condensador: E = ½·C·V². 1 F a 2,7 V = **3,6 J**.
- Tiempo para acumular: t = E / P. 1 J con 10 µW = 100 000 s ≈ 28 h.
- 1 Wh = 3600 J. 1 µW durante un año ≈ 31,6 J.

---

## 1. Baterías de radioisótopos (betavoltaicas): tritio, níquel-63, prometio-147, carbono-14

### Takeaway
Son reales y funcionan durante décadas, pero dan **nanovatios o, como mucho, unos 100 µW** por pieza del tamaño de una moneda; la energía sale de la desintegración de un átomo radiactivo (no de la nada), la potencia baja con el tiempo al ritmo de la semivida del isótopo, y un particular no puede fabricarlas en casa (material radiactivo con licencia). Las cifras "de miles de años" son semividas, no potencia útil.

### Cited Findings
**De dónde sale la energía:** los electrones (radiación beta) que emite el isótopo al desintegrarse chocan con un semiconductor (diamante, carburo de silicio, silicio) que los convierte en una corriente eléctrica pequeña, como una célula solar pero con "luz" de electrones — [Bristol (vía búsqueda)](https://bristol.ac.uk/news/2024/december/diamond-battery-media-release.html); [Inspenet](https://inspenet.com/en/news/china-unveils-long-life-carbon-14-nuclear-battery/)

**Betavolt BV100 (China, níquel-63, anunciada enero 2024):**
- 100 µW a 3 V, tamaño 15 × 15 × 5 mm — [Tom's Hardware](https://www.tomshardware.com/pc-components/power-supplies/chinese-developed-nuclear-battery-has-a-50-year-lifespan); [CNX Software](https://www.cnx-software.com/2024/01/15/betavolt-bv100-3v-nuclear-battery-50-years/)
- Lámina de Ni-63 de 2 µm entre dos convertidores de diamante de 10 µm; semivida del Ni-63 "unos 100 años" — [Hackaday](https://hackaday.com/2024/01/16/betavoltaic-battery-rated-to-provide-power-for-50-years); [New Atlas](https://newatlas.com/energy/betavolt-diamond-nuclear-battery)
- Vida anunciada: 50 años sin recarga; rango de −60 °C a +120 °C — [m3.se](https://www.m3.se/article/2201270/vill-du-ha-karnkraft-i-dina-prylar.html); [Live Science](https://www.livescience.com/technology/engineering/betavolt-bv100-radioactive-battery-can-last-50-years-coming-in-2025)
- Densidad de energía anunciada por la empresa: 3300 mWh/g, "10 veces la de una batería de litio ternaria"; algunos medios confunden la unidad — [BEST Magazine](https://www.bestmag.co.uk/china-firms-breakthrough-in-race-to-commercialise-nuclear-batteries/); [InsideEVs ("We Have Questions")](https://insideevs.com/news/704871/china-betavolt-atomic-energy-battery/)
- Estado comercial dudoso: un medio dice "fase piloto", otro dice "producción en masa desde 2024"; versión de 1 W prometida para 2025 sin confirmación encontrada — [Hackster](https://hackster.io/news/betavolt-wants-to-put-a-nuclear-generator-in-your-gadgets-with-its-50-year-3v-bv100-battery-7dbe2b5e83ab); [digiteye](https://digiteye.in/?p=12951); [TechSpot](https://www.techspot.com/community/topics/coin-sized-nuclear-3v-battery-with-50-year-lifespan-enters-mass-production.291553)
- Un experto citado por Live Science: "probablemente no alimentará tu móvil pronto" — [Live Science](https://www.livescience.com/technology/engineering/betavolt-bv100-radioactive-battery-can-last-50-years-coming-in-2025)
- Casi todas las cifras proceden de la propia Betavolt (2024); no se encontró hoja de datos independiente — [BEST Magazine](https://www.bestmag.co.uk/china-firms-breakthrough-in-race-to-commercialise-nuclear-batteries/)

**City Labs NanoTritium (EE. UU., tritio):**
- Modelo P100a (2012, primer betavoltaico comercial): tensión en vacío ~0,8 V, 1,6 V o 2,4 V; corriente de cortocircuito ~60 nA (presentación DOE 2015) — [energy.gov, Cabauy 2015](https://www.energy.gov/sites/prod/files/2015/08/f26/Cabauy%20Tritium%20Focus%20Group%20Presentation.pdf)
- "Potencia continua de nanovatios durante 20 años o más" — [EE World](https://www.eeworldonline.com/betavoltaic-power-source-provides-source-of-continuous-nanowatt-power-for-20-years/); [Phys.org 2012](https://phys.org/news/2012-08-nanotritium-battery-good-twenty-years.pdf)
- La empresa se describe hoy como fabricante de baterías "de nanovatios a microvatios" con más de 20 años de vida — [City Labs](https://citylabs.net/nanotritium-batteries/industrial-iot-robotics-power-solutions/)
- En 2012 se anunciaban "decenas de microvatios" en desarrollo — [New Atlas](https://newatlas.com/city-labs-nanotritium-betavoltaic-battery/23720)
- Licencia: City Labs obtuvo una **Licencia General de la NRC** (EE. UU.) que permite vender las baterías de tritio a compradores **sin licencia de radiación propia**; va unida a un registro de fuente sellada del Departamento de Salud de Florida — [City Labs (licencia)](https://citylabs.net/city-labs-achieves-industrys-first-product-regulatory-license-for-a-betavoltaic-battery/); [City Labs regulatory](https://citylabs.net/regulatory/)
- Mayo 2026: DARPA concede ~1,5 M$ a City Labs; la empresa afirma ser la única de EE. UU. con licencia general de la NRC para baterías betavoltaicas de tritio — [Exchange Monitor](https://www.exchangemonitor.com/darpa-awards-1-5-million-to-city-labs-for-nuclear-battery-technology/)
- Precio: la presentación DOE 2015 menciona un precio (40 % menos que los prototipos de 2008) pero el texto extraído no da la cifra — [energy.gov](https://www.energy.gov/sites/prod/files/2015/08/f26/Cabauy%20Tritium%20Focus%20Group%20Presentation.pdf)

**Prometio-147 (histórico, años 70 — Betacel para marcapasos):**
- ~400 µW de salida, densidad de potencia ~0,025 mW/cm³; la mayor parte del volumen era blindaje contra los rayos gamma de una impureza (Pm-146); la potencia caía a la mitad cada 2,62 años (semivida del Pm-147) — [Betacel (Wikipedia, vía búsqueda)](https://en.wikipedia.org/wiki/Betacel)

**Tritio como isótopo:** semivida 12,3 años; coste del orden de ~3,50 $/curie (dato de la revisión Olsen et al., Physics Today 2012) — [Physics Today](https://physicstoday.aip.org/features/betavoltaic-power-sources); [City Labs, revisión histórica](https://citylabs.net/betavoltaic-batteries-a-historical-review/)
- Physics Today repasó células de BetaBatt, City Labs, Qynergy y Widetronix — [Physics Today](https://physicstoday.aip.org/features/betavoltaic-power-sources)
- La NRC dio en 2008 una licencia **específica** (no general) a la célula QynCell KRT-2000 de Qynergy — [Physics Today / búsqueda](https://physicstoday.aip.org/features/betavoltaic-power-sources)
- "La densidad de potencia de las betavoltaicas actuales es tan baja que no pueden alimentar un móvil ni un portátil" — [CAS](https://www.cas.org/resources/cas-insights/nuclear-power-your-pocket-50-year-battery-innovation)

**Carbono-14:**
- Reino Unido (UKAEA + Universidad de Bristol, 4 dic. 2024): primera batería de diamante con C-14; "potencia continua de nivel microvatio"; semivida ~5700–5730 años; el C-14 se saca de bloques de grafito de reactores nucleares — [Bristol](https://bristol.ac.uk/news/2024/december/diamond-battery-media-release.html); [World Nuclear News](https://world-nuclear-news.org/articles/carbon-14-diamond-battery-is-world-first-say-uk-scientists)
- Cifra muy repetida (proyección, no medida del prototipo): **1 g de C-14 daría unos 15 J al día**; una pila AA alcalina (~20 g) almacena ~700 J/g (≈ 13–14 kJ) — [Live Science](https://www.livescience.com/technology/engineering/worlds-1st-nuclear-diamond-battery-of-its-kind-could-power-devices-for-1000s-of-years); [Eureka Magazine](https://www.eurekamagazine.co.uk/content/news/nuclear-waste-encapsulated-in-diamond-produces-batteries-that-could-last-thousands-of-years)
- China (Universidad Normal del Noroeste + Gansu Zhulong; prototipo "Zhulong-1" y sucesor 2025): 129 mCi de C-14, 0,713 µA, 2,06 V, **potencia máxima 1,13 µW**, volumen 16,8 cm³; algunos medios hablan de "100 años" y "10 veces la densidad del litio", cifras no respaldadas por esos datos técnicos — [Inspenet](https://inspenet.com/en/news/china-unveils-long-life-carbon-14-nuclear-battery/); [Ecosistema Startup](https://ecosistemastartup.com/bateria-china-de-carbono-14-dura-5-730-anos-sin-recarga/); [futurezone.at ("ziemlich unrealistisch" para un móvil)](https://futurezone.at/science/china-nuklear-batterie-100-jahre-radionuklidbatterie-c-14-elektrische-energie/403022467)

**NDB (California, "nano diamond battery"):** solo pruebas de concepto; prensa escéptica porque estas baterías dan microvatios — [WNN / búsqueda](https://world-nuclear-news.org/Articles/Nuclear-battery-Chinese-firm-aiming-for-mass-mark); [Diamond battery (Wikipedia, vía búsqueda)](https://Www.Wikipedia.org/wiki/Diamond_battery)

### Inferences
- BV100: 100 µW en 1,125 cm³ ≈ **89 µW/cm³**. Si diera 100 µW constantes 50 años, entregaría ≈ 158 kJ ≈ 44 Wh. Pero el Ni-63 pierde potencia: tras 50 años queda ≈ 71 % de la inicial (semivida ~101 años) (cálculo propio).
- Tritio: tras 20 años queda ≈ 32 % de la potencia inicial (semivida 12,3 años). Pm-147: tras 5 años queda ≈ 27 % (cálculo propio).
- P100a de City Labs: con ~60 nA y ≤2,4 V, la potencia útil máxima ronda como mucho **~0,1 µW (100 nW)** (cálculo propio; el punto de máxima potencia está por debajo de Voc × Isc).
- C-14 británico: 15 J/día ≈ **174 µW por gramo de C-14** si se lograra; el prototipo chino real da 1,13 µW en 16,8 cm³ ≈ **0,07 µW/cm³**, unas 1000 veces menos densidad de potencia que lo anunciado por Betavolt. Hay una distancia enorme entre anuncios y aparatos medidos (cálculo propio).
- Para un empujón mecánico (9,8 mJ = levantar 100 g 1 cm): una BV100 a 100 µW lo junta en ~100 s; una P100a (~0,1 µW) en ~27 horas; el prototipo chino de C-14 (1,13 µW) en ~2,4 horas (todo ideal, sin pérdidas).
- ¿Real o mito? **Real** como fuente de micro/nanovatios durante décadas. **Mito/exageración**: "batería eterna para el móvil", "5730 años de energía" (la semivida no es vida útil práctica y la potencia es mínima), "más densidad que el litio" (puede ser cierto en energía total a lo largo de décadas, nunca en potencia).
- ¿Lo puede hacer un aficionado? No fabricar: requiere isótopos con licencia. Algo parecido y legal en muchos países: comprar un producto con licencia general (p. ej., City Labs en EE. UU.). En España/UE la situación para particulares no se verificó (ver huecos). Nunca abrir ni modificar fuentes radiactivas.

### Gaps
- No se encontró hoja de datos del City Labs **P200** (potencia, precio actual 2026); el texto del DOE no extrajo la tabla del P200.
- **Widetronix** (SiC, prometio/tritio) y **"Kronos"**: no se encontraron especificaciones; la búsqueda no devolvió nada sobre "Kronos betavoltaic" (posible confusión de nombre). "BV100 con C-14" no existe en lo encontrado: BV100 es de Ni-63; el C-14 es de otros grupos (Reino Unido, China, Corea).
- Estado legal para particulares en **España/UE** (CSN, exención de llaveros de tritio, etc.): no investigado con fuentes.
- No se confirmó que la versión de 1 W de Betavolt (prometida para 2025) exista, ni precio de venta de la BV100.
- No se encontró la potencia medida del prototipo británico de C-14 (solo "nivel microvatio" y la proyección de 15 J/día/g).

---

## 2. Pilas secas (pilas de Zamboni) y la Campana Eléctrica de Oxford

### Takeaway
La campana de Oxford es real y suena casi sin parar desde 1840 (~10 000 millones de toques), pero **no es movimiento perpetuo**: la energía es química (el cinc de miles de discos se va oxidando), la pila da kilovoltios pero solo nanoamperios, y se parará cuando se agote. Funciona tanto porque gasta casi nada en cada toque.

### Cited Findings
- Fabricada por Watkins y Hill (posiblemente 1825); llevada a Oxford por el reverendo Robert Walker en 1840; ha sonado de forma continua desde 1840 salvo pausas cortas por **humedad alta**; ~10 000 millones de toques; récord Guinness — [Smithsonian](https://www.smithsonianmag.com/smart-news/mystery-continuously-functioning-battery-1840-180954028/); [Wikipedia (vía búsqueda)](https://Www.Wikipedia.org/wiki/Oxford_Electric_Bell)
- Dos pilas secas en serie bajo dos campanas de latón; el badajo es una **bolita metálica de ~4 mm** que oscila entre ellas por **fuerzas electrostáticas** (se carga, es repelida, toca la otra campana, se descarga...) — [Wikipedia (vía búsqueda)](https://Www.Wikipedia.org/wiki/Oxford_Electric_Bell)
- Composición exacta desconocida (abrirla acabaría el experimento); se cree que son pilas de Zamboni — [Hackaday 2018](https://hackaday.com/2018/10/07/the-bells-the-bells-one-battery-since-1840); [Smithsonian](https://www.smithsonianmag.com/smart-news/mystery-continuously-functioning-battery-1840-180954028/)
- Tensión: estimación (no medida) de ScienceABC ≈ 16 × 120 V ≈ **~2 kV**; el badajo consume del orden de **1 nA** — [ScienceABC](https://www.scienceabc.com/eyeopeners/clarendon-laboratory-bell-oxford-university-work)
- Algunas fuentes dicen que hoy apenas se oye (sonido muy débil, tapado por campanas de cristal) — [Maketecheasier](https://maketecheasier.com/a-bell-in-an-oxford-university-physics-lab-has-been-ringing-almost-nonstop-since-1840-on-the-same-pair-of-dry-pile-batteries-about-10-billion-rings-so-far-and-nobody-is-quite-sure-what-is-i/)
- **Pila de Zamboni** (Giuseppe Zamboni, 1812): pila seca "electrostática"; da tensiones del orden de **kilovoltios** pero corrientes de **nanoamperios**; sirve para relojes y campanas, no para circuitos; "no es un motor perpetuo: toda acción se detiene cuando el cinc se oxida del todo o se agota el manganeso" (discos de papel con cinc y dióxido de manganeso) — [Zamboni pile (Wikipedia, vía búsqueda)](https://en.wikipedia.org/wiki/Zamboni_pile); [Museo de Ciencias de Bérgamo](https://www.museoscienzebergamo.it/fisicaalmuseo/en/strumenti-en/zamboni-piles/)
- Las pilas acabarán secándose y las campanas callarán — [Hackaday 2018](https://hackaday.com/2018/10/07/the-bells-the-bells-one-battery-since-1840)
- **Pila de Karpen** (Vasile Karpen, Rumanía): funcionando sin interrupción desde los años 50; un periódico rumano midió **1 V**, el mismo valor que en 1950 (artículo de 2010, sin mediciones recientes de corriente) — [Gizmodo](https://gizmodo.com/5724818/this-battery-has-been-working-for-60-years)

### Inferences
- ~10 000 millones de toques en ~186 años ≈ **1,7 toques por segundo** (cálculo propio).
- Orden de magnitud de potencia (cálculo propio, muy aproximado): si la carga por toque es ~0,5 nC y la tensión ~2 kV, cada toque gasta ~1 µJ y la campana consume **del orden de 1 µW o menos**. Con ese consumo, unos pocos julios-kilojulios de energía química duran siglos.
- Mensaje para el usuario: es el ejemplo perfecto de "aparato que parece perpetuo pero no lo es": una pila enorme (miles de discos) con un consumo diminuto. La humedad la frena (fugas de carga).
- La **pila de Karpen** se ha presentado a veces como "pila que no se gasta"/que toma energía del calor ambiente; esa interpretación no está respaldada por las fuentes encontradas — tratarla como afirmación no verificada.
- ¿Lo puede hacer un aficionado? Sí, una pila de Zamboni casera (discos de papel con cinc y dióxido de manganeso apilados) es un proyecto clásico; con cientos de discos da cientos de voltios a nanoamperios. Riesgo bajo por la corriente mínima, pero puede dar descargas molestas; no tocar los extremos con varios kV.
- El **reloj de Beverley** es otra cosa (se mueve con cambios de presión/temperatura del aire), se trata en otra parte.

### Gaps
- No se pudo abrir la página del Departamento de Física de Oxford ni Wikipedia; no hay medición publicada encontrada de tensión ni corriente actuales de la campana (las cifras de 2 kV y 1 nA son estimaciones de divulgación).
- Sin datos verificados de cuántos discos tiene la pila de Oxford ni de la energía química total.

---

## 3. Pilas primarias de muy larga vida (litio–cloruro de tionilo, Li-SOCl₂)

### Takeaway
Las pilas de litio-cloruro de tionilo tipo "bobina" (Tadiran, Saft) son **la forma más práctica y barata** de alimentar un consumo de microvatios durante 20–40 años: pierden solo ~0,7–1 % al año guardadas, y hay contadores de agua funcionando más de 20 años con la pila original. La energía es química y se acaba.

### Cited Findings
- Tadiran: células de bobina Li-SOCl₂ que funcionan "hasta 40 años" con autodescarga anual de solo **0,7 %/año** (cifra de marketing de Tadiran y distribuidores) — [IoT Handbook / Tadiran](https://issuu.com/wtwhmedia/docs/iot_hb_04-19/s/124860); [Control Global](https://controlglobal.com/33018743)
- Otros documentos de Tadiran: **<1 %/año** en ciertas células, lo que permite hasta 40 años; una célula Li-SOCl₂ de bobina de peor calidad puede autodescargarse **hasta 3 %/año** — [Thomasnet / Tadiran](https://news.thomasnet.com/fullstory/long-life-lithium-batteries-provide-end-of-life-indication-523864)
- Contadores (agua, gas, electricidad): Tadiran dice que sus pilas duran tanto como el contador, diseñado para **20–30 años** — [Tadiran AMR/AMI](https://tadiranbat.com/?p=1033)
- Ejemplo real: sistemas de lectura de contadores Hexagram funcionando **23 años con sus pilas Tadiran originales** (artículo de 2007); autodescarga ~1 %/año; la vida real depende del fabricante — [WaterWorld](https://www.waterworld.com/water-utility-management/asset-management/article/16197335/23-years-later-hexagram-meter-reading-systems-still-running-on-their-original-tadiran-lithium-batteries)
- Ejemplo de capacidad: Tadiran XOL ½ AA (TL-4902) = **1200 mAh a 3,6 V** — [Battery Junction](https://www.batteryjunction.com/products/tadiran-tl-4902)
- Comparación: litio-ion típico 100–265 Wh/kg (360–950 kJ/kg) — [CR4 / GlobalSpec](https://cr4.globalspec.com/thread/109474/Amazing-New-Kind-of-Battery)

### Inferences
- ½ AA de 1200 mAh × 3,6 V ≈ **4,3 Wh ≈ 15,6 kJ**. Con un consumo de 10 µW (≈ 0,088 Wh/año) y una pérdida de ~1 %/año por autodescarga, se agotaría en **~34 años**; sin autodescarga serían ~49 años (cálculo propio). Es decir, **una pila de unos 10 € da más energía en 30 años que cualquier betavoltaica actual**.
- Para comparar con lo nuclear: la BV100 (100 µW × 50 años ≈ 44 Wh) equivale a unas 10 pilas ½ AA de este tipo, sin radiactividad (cálculo propio).
- ¿Lo puede usar un aficionado? Sí, se compran sueltas. Seguridad: no recargar, no cortocircuitar, no calentar ni abrir (el cloruro de tionilo es corrosivo y tóxico); no apta para picos altos de corriente (por eso se combinan con un supercondensador o "HLC" para ráfagas).
- ¿Real o mito? Real; "40 años" es el máximo teórico con consumos muy bajos; la evidencia de campo publicada llega a ~20–25 años y la aporta sobre todo el fabricante.

### Gaps
- No se encontraron datos independientes (no del fabricante) que confirmen 40 años; ni hojas de datos de Saft (LS14500, etc.) por fallo de acceso web.
- No se verificó la capacidad de la AA completa (TL-5903) con fuente.

---

## 4. Almacenes para la ráfaga: supercondensadores, condensadores, muelles y pesas elevadas

### Takeaway
Para "juntar y soltar de golpe" lo habitual es un condensador o supercondensador, pero **pierden carga** (fuga): un supercondensador de 1 F puede perder del orden de 1–10 µA, que a 2,7 V son 3–27 µW, **comparable o mayor que una fuente de 10 µW**. Muelles y pesas no tienen fugas eléctricas pero almacenan muy poca energía por gramo (una pesa de 1 kg subida 1 m guarda solo 9,8 J).

### Cited Findings
- Supercondensador Eaton HV0810-2R7105-R (**1 F, 2,7 V**): corriente de fuga **10 µA** (sin indicar tiempo de medida en la página) — [Eaton](https://www.eaton.com.cn/cn/zh-cn/skuPage.HV0810-2R7105-R.html)
- Nichicon 1 F 2,7 V (JUMT1105MPD): fuga indicada **0,5 mA** en la ficha del distribuidor — [RS Online](https://nz.rs-online.com/web/p/supercapacitors/7153502)
- La fuga realista se mide tras **72 horas** cargado a tensión nominal (guía de Eaton; Abracon especifica fuga a 72 h) — [Eaton guía de aplicaciones](https://www.eaton.com/ch/de-de/products/electronic-components/topics/supercapacitor-applications-guide.html)
- Prueba de aficionado: supercondensador AVX de 10 F y 2,7 V con máximo de hoja de datos de 30 µA; medido **<1 µA** tras 72 h (una sola prueba, no controlada) — [Hackaday.io](https://hackaday.io/project/160470/log/159260)
- Densidad de energía: los supercondensadores comerciales almacenan ~**1/20** de lo que una batería por kilo; prototipos de laboratorio de grafeno hasta 73 Wh/kg — [Electronics Online](https://electronicsonline.net.au/content/components/news/increased-energy-density-for-supercapacitors-808188533); [Renewable Energy Magazine](https://renewableenergymagazine.com/energy_saving/british-universities-make-significant-progress-in-supercapacitor-20180227)
- Litio-ion: 100–265 Wh/kg — [CR4 / GlobalSpec](https://cr4.globalspec.com/thread/109474/Amazing-New-Kind-of-Battery)
- Muelles: "pueden entregar la energía en un golpe rápido e intenso o despacio"; muelles de nanotubos de carbono estimados en >1000 veces la energía por peso del acero — [Universidad de Michigan, tech brief](https://cad2e.eecs.umich.edu/techbriefs/tb12.pdf)

### Inferences
- **Muelle de acero** (cálculo propio, máximo teórico σ²/(2Eρ) con σ = 1,5 GPa, E = 200 GPa, ρ = 7850 kg/m³): **~700 J/kg, es decir ~0,7 J por gramo de acero, y solo en el límite teórico**; un muelle real (espiral, helicoidal) guarda bastante menos (tensión no uniforme). Del orden de 1000 veces menos que el litio-ion.
- **Pesa elevada**: 9,81 J por kg y por metro = **0,0098 J por gramo y metro**. Levantar 100 g a 1 cm = 9,8 mJ. Ventaja: no tiene fugas (si el trinquete no se suelta). Desventaja: muy poca energía por gramo.
- **Condensador electrolítico de 4700 µF** cargado a 5 V: ½·0,0047·25 ≈ 59 mJ; suficiente para el "empujón" de 9,8 mJ con margen para pérdidas del motor (cálculo propio).
- Supercondensador 1 F a 2,7 V: 3,6 J. Con fuga de 10 µA equivale a una "resistencia de fuga" de 270 kΩ; con fuga de 1 µA, 2,7 MΩ (cálculo propio; ver ejemplo resuelto en la sección 7).
- Mensaje clave para el usuario: **el almacén ideal es el más pequeño que baste** para la ráfaga, porque un almacén grande pierde más en fugas que lo que entra con microvatios.

### Gaps
- No se encontró una hoja de datos de supercondensador "de baja fuga" específica para captación de energía (p. ej., series de Seiko/Kyocera/Cap-XX de pocos nA) con cifras verificadas.
- Sin fuente directa para la energía por gramo de muelles reales de reloj (resortes reales); solo cálculo teórico.
- Sin datos de autodescarga de electrolíticos de aluminio (fuga típica en µA).

---

## 5. Chips de gestión de energía de captación (acumulan microvatios y entregan ráfagas)

### Takeaway
Existen chips comerciales hechos justo para esto: reciben microvatios de una célula solar, un termopar o un piezo, los suben de tensión, cargan un supercondensador o batería, y avisan/encienden la carga cuando hay suficiente. Arrancan desde vacío con **~3 µW (AEM10941) o ~15 µW (BQ25570)**, o con solo **20 mV (LTC3108)** si se usa un transformador; su rendimiento ronda 80–93 %. No crean energía: solo la recogen y la ordenan.

### Cited Findings
**TI BQ25570:**
- Arranque en frío (cold start) con VIN ≥ **600 mV** según la hoja de datos actual (antes figuraba 330 mV) — [TI datasheet](https://www.ti.com/document-viewer/BQ25570/datasheet/overview-slusbh28936)
- Potencia de arranque en frío ~**15 µW** — [TI E2E foro](https://e2e.ti.com/support/power-management-group/power-management/f/power-management-forum/889007/bq25570evm-206-bq25570-q-a)
- Rendimiento hasta **93 %** (80–93 % según tensión y corriente) — [TI producto](https://www.ti.com/product/BQ25570)

**e-peas AEM10941 (solar):**
- Arranque desde almacén vacío con ~**380 mV y 3 µW** (típico) — [Mouser](https://www.mouser.co.za/e-peas-aem10941-solar-energy-harvesting-ic); [Würth Elektronik](https://www.we-online.com/en/components/icref/e-peas-semiconductors/AEM10941-Other)
- Entrada de 50 mV a 4,5 V, hasta 110 mA; MPPT configurable; paneles de hasta 7 celdas; equilibrado de supercondensador de doble celda; opción de pila primaria de respaldo — [e-peas](https://e-peas.com/?p=5234); [Cirkit Designer](https://docs.cirkitdesigner.com/component/888c02b4-3dcc-47f8-a829-b080d31d1bc2/aem10941-evaluation-board)
- Encapsulado QFN28, −40 °C a +125 °C — [Electronics-Lab](https://www.electronics-lab.com/news/e-peas-aem10941-solar-energy-harvesting-ic/)
- Una guía de terceros indica rendimiento de conversión 85–95 % (no verificado en hoja de datos) — [applied-ee guía (vía búsqueda)](https://applied-ee.github.io/embedded/docs/power-battery/energy-harvesting/harvesting-ics-and-mppt/)

**Analog Devices (Linear) LTC3108 (termoeléctrico):**
- Arranca con tensiones de entrada de solo **20 mV** típico (máximo 50 mV) usando un transformador 1:100 — [dtsheet LTC3108](https://dtsheet.com/model/2324713); [elecfans LTC3108-1](https://pdf.elecfans.com/LINER/LTC3108-1.html)

**Analog Devices LTC3588-1 (piezoeléctrico):**
- Corriente de reposo de entrada **450 nA** en bloqueo por subtensión (mientras acumula) y **950 nA** con salida regulada sin carga — [Radiolocman, datasheet LTC3588-1](https://www.radiolocman.com/datasheet/pdf.html?di=124195); [Cornell ECE4760](https://people.ece.cornell.edu/land/courses/ece4760/FinalProjects/s2012/ads264_mws228/Final%20Report/Final%20Report/LTC3588%20Piezoelectric%20Energy%20Harvesting%20Power%20Supply.pdf)
- Variante LTC3588-2 (mínimo 14 V de entrada): 1500 nA en regulación — [dtsheet](https://dtsheet.com/model/2325476)

### Inferences
- Estos chips implementan exactamente "cargar despacio y soltar de golpe": acumulan en un condensador mientras el consumo propio es de cientos de nanoamperios y solo dan salida (o activan una señal de "listo") al alcanzar un umbral (cálculo/interpretación propia del funcionamiento descrito).
- Su consumo propio (≈ 0,45–1 µA × ~2–3 V ≈ **1–3 µW**) se come una parte importante de una fuente de 10 µW (cálculo propio).
- Si la fuente es de menos de ~3 µW, ni el AEM10941 arranca desde vacío; con una betavoltaica de nanovatios haría falta un circuito más simple (condensador + comparador de nanopotencia) (inferencia).
- ¿Lo puede montar un aficionado? Sí, con placas de evaluación comerciales (EVK10941, BQ25570EVM, módulos LTC3588 tipo "breakout"); sin riesgos especiales a estas tensiones.

### Gaps
- No se pudo verificar en la hoja de datos oficial: tensión mínima de funcionamiento continuo del BQ25570 (se suele citar ~100 mV), corriente de reposo del BQ25570 (~nA), rendimiento exacto del AEM10941, potencia mínima útil del LTC3108 con un termopar real.
- Precios actuales (2026) no consultados.

---

## 6. Circuitos "solar engine" de la robótica BEAM

### Takeaway
El "motor solar" BEAM (Mark Tilden, años 90) es el ejemplo clásico de aficionado de "cargar y soltar": una célula solar carga un condensador (típicamente miles de µF) y, cuando llega a ~2–3 V, un detector de tensión (p. ej., el chip 1381) conecta un motorcito que lo descarga de golpe. Con sol directo dispara cada pocos segundos; con poca luz, mucho menos. Cada disparo lleva **unos 10–30 mJ**.

### Cited Findings
- Con luz solar directa fuerte, el motor da un pulso **aproximadamente cada 3 segundos**; el sufijo "L" del 1381 indica detección a ~3 V; con un diodo de desplazamiento el circuito trabaja entre **~3,7 V y ~0,6 V** — [jeff-z.com / Solarbotics](https://jeff-z.com/timberkits/solarbotics/solarbotics.html)
- En el kit de Images SI, cuando el condensador principal sube a **~2 V**, el pulso del 1381 activa el transistor Q1 y descarga sobre el motor — [Images SI, Solar Engine](https://imagesco.com/articles/solarEngine/SolarEngine01.html); [Images SI PDF](https://www.imagesco.com/solar/solarengine.pdf)
- Manual Solarbotics: el 1381 tiene tensión de encendido y tiempo de descarga configurables — [Solarbotics K-MSE-U manual](https://manuals.online/solarbotics/robotics/k-mse-u/user-manual/1ldts)
- Experiencia de aficionados: una célula solar que solo da ~0,6 V bajo una lámpara no dispara; hace falta al menos 2,0–2,5 V para disparar un 1381C — [RobotShop foro](https://community.robotshop.com/forum/t/help-recalcitrant-jiggle-bot/2391)
- Otra referencia histórica del circuito: [archivo SOLARENG.txt](https://pic.hallikainen.org/techref/com/amory/ftp/BOTS/SOLARENG.txt)

### Inferences
- Energía por pulso con un condensador de 4700 µF (cálculo propio con E = ½C(V₁² − V₂²)):
  - de 2,7 V a 1,5 V → **≈ 12 mJ**;
  - de 3,7 V a 0,6 V → **≈ 31 mJ**.
- Un pulso cada 3 s con 12–31 mJ significa que la célula entrega en sol directo unos **4–10 mW** de media: mil veces más que una fuente de 10 µW (cálculo propio).
- Con una fuente de **10 µW**, juntar 12 mJ tardaría ≈ **20 minutos** por pulso (ideal, sin fugas) (cálculo propio).
- Energía real de dónde sale: la luz (sol o lámpara). Sin luz, se para.
- ¿Lo puede hacer un aficionado? Sí, es un proyecto clásico y barato (célula solar pequeña, condensador, 1381 o un par de transistores, motor de buscapersonas). Sin riesgos especiales.
- ¿Real o mito? Real y muy útil como modelo de "empujón periódico" para un mecanismo; no es perpetuo.

### Gaps
- No se pudieron abrir los PDF de Images SI ni los manuales de Solarbotics para obtener el tamaño exacto de célula solar (mW) y el número de pulsos por minuto según la luz (interior vs. exterior).
- Sin fuente directa sobre la frecuencia de disparo en luz de interior.

---

## 7. Ejemplo resuelto: fuente de 10 µW cargando un supercondensador de 1 F

### Takeaway
Para levantar 100 g a 1 cm hacen falta solo 9,8 mJ: con 10 µW se juntan en **~16 minutos** (ideal) o **~1–3 horas** contando pérdidas del motor. Hacer girar un motorcito 1 segundo pide 0,05–0,5 J: **~1,5–17 horas**. Pero un supercondensador de 1 F es demasiado grande: llenarlo a 2,7 V tardaría **>4 días** y, si su fuga es la máxima de la hoja de datos (10 µA), **nunca pasaría de ~1,6 V**, porque perdería tanto como recibe. Mejor un condensador más pequeño.

### Cited Findings
- Fuga de un supercondensador real de 1 F / 2,7 V: 10 µA (Eaton HV0810) — [Eaton](https://www.eaton.com.cn/cn/zh-cn/skuPage.HV0810-2R7105-R.html); fugas reales tras 72 h pueden ser mucho menores que el máximo (caso de aficionado: <1 µA en 10 F) — [Hackaday.io](https://hackaday.io/project/160470/log/159260)
- Rendimientos de los chips de captación: 80–93 % — [TI](https://www.ti.com/product/BQ25570)
- Consumo propio de un chip de captación: 450–950 nA — [Radiolocman LTC3588-1](https://www.radiolocman.com/datasheet/pdf.html?di=124195)

### Inferences (todos son cálculos propios; fórmulas al principio de las notas)
**a) Levantar 100 g a 1 cm**
- Energía mecánica: 0,1 × 9,81 × 0,01 = **9,8 mJ**.
- Tiempo ideal a 10 µW: 9,8 mJ / 10 µW = **981 s ≈ 16 min**.
- Con pérdidas (rendimiento total cadena chip + motor + engranaje): 50 % → 33 min; 20 % → 1,4 h; 10 % → 2,7 h.

**b) Hacer girar un motor pequeño 1 segundo**
- Motor tipo buscapersonas/BEAM a 0,05 W → 0,05 J → 1,4 h ideal, 1,7 h con 80 % de rendimiento.
- Motor de 0,2 W → 0,2 J → 5,6 h ideal, 6,9 h con 80 %.
- Motor de juguete de 0,5 W → 0,5 J → 13,9 h ideal, 17,4 h con 80 %.

**c) Qué pasa con el supercondensador de 1 F**
- Lleno a 2,7 V guarda ½·1·2,7² = **3,6 J**; a 10 µW tardaría 364 500 s ≈ **4,2 días** sin fugas.
- Energía útil entre 2,7 V y 1,0 V: ≈ 3,1 J (para eso basta: 3,1 J levantan 100 g a 1 cm unas 300 veces en teoría).
- Con la fuga máxima de hoja de datos (10 µA a 2,7 V ≈ 270 kΩ): la tensión se queda en **~1,64 V** (equilibrio, ≈ 1,3 J almacenados); llegar a 1,0 V tarda ~17 h y a 1,5 V ~67 h. A 2,7 V la fuga se llevaría 27 µW, más que los 10 µW que entran.
- Con una fuga realista de 1 µA (≈ 2,7 MΩ): sí llega a 2,7 V, en ~118 h ≈ **4,9 días**.
- Alternativa mejor: un condensador de 4700 µF a 5 V (~59 mJ) o un supercondensador pequeño de baja fuga (0,01–0,1 F). Ejemplo: 0,047 F a 2,7 V ≈ 0,17 J, suficiente para el empujón con pérdidas; a 10 µW tarda ≈ 4,7 h y su fuga es proporcionalmente menor.

**d) Comparación de escalas (para el usuario)**
- 10 µW durante un día = 0,86 J; durante un año ≈ 315 J (≈ 0,09 Wh), lo que guarda **una pila AA alcalina en ~0,5 g** o una pesa de 32 kg subida 1 m.
- Por eso las ráfagas tienen que ser **raras y pequeñas**: un empujón de 10 mJ cada 20–30 minutos es realista con 10 µW; un motor girando continuamente, no.

### Gaps
- Las potencias de motores pequeños (0,05–0,5 W) son rangos típicos asumidos, no datos de hoja de datos consultada.
- No se modelaron la fuga del propio chip de gestión ni las pérdidas del convertidor a tensiones muy bajas (por debajo de ~0,5 V el rendimiento cae mucho, sin fuente verificada).

# Aparatos que funcionan durante años con los cambios diarios de temperatura, presión del aire y humedad

Notas para el informe final (en español). Fecha de la investigación: noviembre de 2026.
Idea central para el lector: **ninguno de estos aparatos es movimiento perpetuo**. Todos son "motores ambientales": sacan una cantidad diminuta de energía de un cambio externo (el aire se calienta y se enfría, la presión sube y baja, el agua se evapora). Si el entorno deja de cambiar, se paran. La potencia típica es de **microvatios (µW, millonésimas de vatio)**; una bombilla LED de 5 W gasta lo mismo que unos 20 millones de relojes Atmos.

Referencias de escala usadas en todo el documento:
- Un reloj electrónico de cuarzo gasta del orden de **1 µW** ([Seiko, artículo sobre micro-módulos termoeléctricos, J-STAGE](https://www.jstage.jst.go.jp/article/micromechatronics/48/1/48_KJ00001061035/_article/-char/en)); un Casio F-91W se ha estimado en unos **5 µW** ([Slashdot, cita sobre la PowerWatch, 2017](https://mobile.slashdot.org/story/17/11/11/0518233/crowdfunded-powerwatch-runs-on-body-heat-never-needs-charging)).
- 1 µW durante un día entero = 0,0864 J (menos energía que la que hace falta para levantar una manzana de 100 g unos 9 cm).

Nota de método: varias páginas primarias (Wikipedia, nature.com, plus9time, clockguy, electronicdesign) estaban bloqueadas por la red de esta sesión; los datos de esas páginas proceden de los extractos de búsqueda y se marcan como tales cuando hace falta.

## 1. El reloj Atmos (Jaeger-LeCoultre): cápsula de cloruro de etilo, grados necesarios, potencia, duración

### Takeaway
El Atmos se da cuerda solo con una cápsula hermética (fuelle) llena de cloruro de etilo (gas + líquido) que se hincha y se encoge con la temperatura (y algo con la presión). **Un cambio de 1 °C (entre 15 y 30 °C) daba unos 2 días de marcha en el prototipo y unos 4,3 días en el modelo Atmos 540**. Gasta del orden de **0,25 µW** (deducido de la afirmación "60 millones de Atmos = una bombilla de 15 W"). Es real, se fabrica desde hace casi un siglo y funciona años sin tocarlo, pero no se puede construir en casa de forma práctica.

### Cited Findings
- Mecanismo: una cápsula sellada contiene cloruro de etilo, mezcla de gas y líquido, que se expande y contrae con la temperatura y la presión del aire; ese movimiento tensa el muelle real, así que no hay que darle cuerda — [Banco de España, colección, reloj Atmos](https://coleccion.bde.es/wca/en/secciones/coleccion/obras/reloj-de-sobremesa-atmos-r_88.html); [Gigazine, 2016](https://wbgsv0b.gigazine.net/gsc_news/en/20161006-atmos)
- "Con solo 1 grado de cambio de temperatura almacena energía para 48 horas" — [Gigazine, 2016](https://wbgsv0b.gigazine.net/gsc_news/en/20161006-atmos)
- Dato más preciso (extracto de Wikipedia vía búsqueda): una variación de **1 °C en el rango 15–30 °C, o una variación de presión de 3 mmHg (≈4 hPa)**, se calculó que daba energía para **2 días** en un prototipo temprano; para el **Atmos 540 son unos 4,3 días por °C** — [Wikipedia, Atmos clock](https://en.wikipedia.org/wiki/Atmos_clock); [espejo Kiwix de Wikipedia](https://kiwix.lema.org/wikipedia_en_all_mini_2024-02/A/Atmos_clock)
- Péndulo de torsión: una oscilación completa dura **1 minuto** (30 s en cada sentido), es decir unas **60 veces menos oscilaciones** que un péndulo normal; por eso gasta muy poca energía — [Wikipedia, Atmos clock](https://en.wikipedia.org/wiki/Atmos_clock); [Laings, "The spirit of invention"](https://www.laingsuk.com/blog/post/the-spirit-of-invention-the-jaeger-lecoultre-atmos-clock)
- Comparación de consumo muy citada: **"60 millones de relojes Atmos juntos consumen lo mismo que una bombilla de 15 W"** (afirmación que apareció en los resultados de búsqueda sobre el Atmos; página exacta no verificada, probablemente material divulgativo de Jaeger-LeCoultre) — [Vivir, "The Ghost in the Machine"](https://vivir.com/article/jaeger-lecoultre-atmos); [Revolution, "A quiet revolution"](https://revolutionwatch.com/a-quiet-revolution)
- Como la energía es tan pequeña, todas las piezas deben trabajar con rozamiento casi nulo — [Gigazine, 2016](https://wbgsv0b.gigazine.net/gsc_news/en/20161006-atmos)
- Hay Atmos antiguos vendidos en subastas con el nombre de su inventor, Reutter, lo que confirma el origen pre-Jaeger-LeCoultre del diseño — [Antiquorum, lote Reutter](https://catalog.antiquorum.swiss/en/lots/reutter-lot-286-198); [Uhren-Muser, subastas de Atmos](https://uhren-muser.de/en/archives/103/52243)

### Inferences
- **Potencia por reloj**: 15 W / 60.000.000 = **0,25 µW**. En un día: 0,25 µW × 86.400 s ≈ **0,022 J/día** (22 milijulios). Es unas 4 veces menos que un reloj de cuarzo (~1 µW).
- **Energía que guarda la cápsula por cada °C** (si el consumo es 0,25 µW): prototipo 2 días/°C → ≈ **0,043 J por °C**; Atmos 540 4,3 días/°C → ≈ **0,09 J por °C**. Con una casa que oscila 2–3 °C al día sobra energía (el reloj solo necesita ~1/4–1/2 °C al día de media).
- **Por qué cloruro de etilo y no aire**: un líquido que hierve cerca de la temperatura ambiente cambia mucho su presión de vapor con la temperatura. Cálculo propio aproximado (Clausius-Clapeyron, valores de manual: ebullición ≈ 12 °C, calor de vaporización ≈ 25 kJ/mol): ≈ **4.700 Pa por °C**, frente a ≈ **350 Pa por °C** del aire encerrado a volumen constante → unas **13 veces más fuerza por grado** que una caja de aire como la del reloj Beverly. Esto explica por qué el Atmos es pequeño y el Beverly necesita una caja de 28 litros.
- **¿Se puede hacer en casa?** No de forma realista: hace falta un fuelle metálico hermético con un fluido volátil (el cloruro de etilo es inflamable) y un mecanismo de rozamiento casi nulo. Lo realista es comprar un Atmos usado. Una versión casera "de demostración" (fuelle que levanta un peso) sí es posible, pero mover un reloj mecánico casero con <1 µW es muy difícil.
- **¿Real o mito?** Real. No es movimiento perpetuo: es un motor térmico que usa los cambios de temperatura del salón.

### Gaps
- No encontré una cifra oficial de Jaeger-LeCoultre en µW; el 0,25 µW es deducido de una comparación publicitaria.
- No pude verificar con fuente primaria las fechas (patente de Jean-Léon Reutter hacia 1928; producción de Jaeger-LeCoultre desde los años 30), el número total fabricado, ni el intervalo de revisión recomendado (se suele decir que funcionan muchos años sin servicio y que el fallo típico es la fuga del fuelle, pero no lo confirmé en fuente accesible).

## 2. Reloj Beverly (Universidad de Otago, desde 1864) y reloj de Cox (James Cox, años 1760, barómetro de mercurio)

### Takeaway
**Beverly**: una caja hermética de ~28 litros de aire empuja un diafragma cuando la temperatura (y, menos, la presión) cambia; con una oscilación diaria de **3,3 °C** obtiene aproximadamente la energía de **levantar 0,45 kg una pulgada (≈0,11 J/día ≈ 1,3 µW de media)**. Lleva funcionando sin cuerda manual desde 1864 (más de 160 años), con algunas paradas. **Cox**: un barómetro con unos **68 kg (150 libras) de mercurio** que sube y baja con la presión atmosférica y da cuerda al reloj mediante un trinquete; hoy está en el V&A de Londres pero **desactivado**. Ambos son reales y no son movimiento perpetuo.

### Cited Findings
**Reloj Beverly**
- Construido en 1864 por Arthur Beverly; está en el Departamento de Física de la Universidad de Otago (Dunedin, Nueva Zelanda), en el vestíbulo de ascensores de la 3.ª planta; nunca se le ha dado cuerda a mano — [Wikipedia, Beverly Clock](https://en.wikipedia.org/wiki/Beverly_Clock); [Otago Physics blog](https://blogs.otago.ac.nz/physicsnews/?p=67)
- Mecanismo: las variaciones diarias de temperatura y, en menor medida, de presión atmosférica hacen que el aire de una **caja hermética de 1 pie cúbico (28 litros)** se expanda o contraiga y empuje un **diafragma** — [Wikipedia, Beverly Clock](https://en.wikipedia.org/wiki/Beverly_Clock); [Atlas Obscura](https://atlasobscura.com/places/beverly-clock)
- "Una variación de temperatura de **6 °F (3,3 °C)** a lo largo del día crea aproximadamente presión suficiente para **elevar un peso de una libra una pulgada**, lo que mueve el reloj" — [Wikipedia, Beverly Clock](https://en.wikipedia.org/wiki/Beverly_Clock)
- Se ha parado varias veces: por averías, por limpieza, al mudarse el departamento y algunas veces cuando la temperatura y la presión se mantuvieron estables mucho tiempo; vuelve a arrancar solo cuando las condiciones cambian — [Atlas Obscura](https://atlasobscura.com/places/beverly-clock); [Uncle John's Bathroom Reader, reproducido en Goodreads](https://www.goodreads.com/author_blog_posts/15327172-still-going?tab=author)
- El reloj es anterior a la fundación de la Universidad de Otago (1869) — [Otago Physics blog](https://blogs.otago.ac.nz/physicsnews/?p=67)
- Reportaje de 2023 sobre el "reloj de 160 años que podría funcionar para siempre" (confirma que seguía en marcha en 2023) — [1News NZ, 28-03-2023](https://www.1news.co.nz/2023/03/28/the-unusual-160-year-old-clock-which-could-run-forever)
- Biografía de Arthur Beverly (relojero; la crisis de 1864 le sacó del negocio) — [Te Ara, Enciclopedia de Nueva Zelanda](https://teara.govt.nz/biographies/1b20/beverly-arthur). Conflicto: una fuente dice que lo construyó para la Exposición de Nueva Zelanda de 1865 — [Goodreads/Uncle John's](https://www.goodreads.com/author_blog_posts/15327172-still-going?tab=author)

**Reloj de Cox (Cox's timepiece)**
- Desarrollado en los años 1760 por James Cox; lo mueve un **barómetro de mercurio** (tipo Fortin): las diferencias de presión atmosférica mueven el mercurio entre **dos grandes frascos de vidrio**, y ese movimiento se transmite a la esfera mediante ruedas; no necesita cuerda — [V&A, ficha O297335](https://collections.vam.ac.uk/item/O297335/longcase-clock-cox-james); [Wikipedia, Cox's timepiece](https://en.wikipedia.org/wiki/Cox%27s_timepiece)
- Necesitaba al menos **150 libras (≈68 kg) de mercurio** (≈5 litros) — [V&A](https://collections.vam.ac.uk/item/O297335/longcase-clock-cox-james); [Wikipedia](https://en.wikipedia.org/wiki/Cox%27s_timepiece)
- Un trinquete convierte el subir y bajar del barómetro en cuerda para el reloj — [Wikipedia](https://en.wikipedia.org/wiki/Cox%27s_timepiece)
- Cox afirmó que era un verdadero movimiento perpetuo, pero como se alimenta de los cambios de presión atmosférica, **no lo es** — [Wikipedia](https://en.wikipedia.org/wiki/Cox%27s_timepiece)
- El V&A lo describe como "el primer intento con éxito de producir un reloj de movimiento perpetuo en Inglaterra"; lo compró en 1961 a Blairman and Sons — [V&A API](https://api.vam.ac.uk/v2/object/O297335)
- **Existe pero fue desactivado** al trasladarlo al V&A — [Wikipedia](https://en.wikipedia.org/wiki/Cox%27s_timepiece)
- Historia confusa: según el V&A estuvo en el museo de Cox hasta 1837; según Princeton estuvo "perdido" hasta 1898, cuando se expuso en el Clerkenwell Institute — [Princeton Rare Books blog, 2008](https://blogs.princeton.edu/rarebooks/2008/05/mr-coxs-perpetual-motion-a-mec/); [V&A](https://collections.vam.ac.uk/item/O297335/longcase-clock-cox-james)
- Precedente: el aparato de Cornelis Drebbel (~1610) también usaba cambios ambientales — [Wikipedia](https://en.wikipedia.org/wiki/Cox%27s_timepiece)

### Inferences
- **Potencia del Beverly**: 0,4536 kg × 9,81 m/s² × 0,0254 m ≈ **0,113 J por día** → 0,113 / 86.400 ≈ **1,3 µW de media**. Comprobación propia con la física del aire encerrado (trabajo ≈ ½·P·V·(ΔT/T)²): para 28 L y 3,3 °C sale ≈ 0,18 J/día ≈ 2 µW. Ambos cálculos coinciden en el orden: **1–2 µW**.
- **Potencia del Cox (orden de magnitud, cálculo propio con supuestos)**: la presión cambia unos pocos mmHg al día (supuesto: 3 mmHg ≈ 400 Pa). Si el tubo del barómetro tuviera ~6–7 cm de diámetro, el mercurio desplazado sería ~10 cm³ y el trabajo ≈ ΔP·ΔV ≈ 400 Pa × 1×10⁻⁵ m³ ≈ **4 mJ por oscilación** → del orden de **0,05 µW de media**. Muy incierto; sirve solo para ver que es igual de pequeño o menor que el Beverly. Por eso hacían falta 68 kg de mercurio.
- **¿Se puede hacer en casa?** Beverly: el principio (garrafa/caja hermética + membrana + trinquete que sube un peso) es casero y seguro, pero solo da ~1 µW por cada 28 L con 3 °C de oscilación; mover un reloj mecánico con eso exige una relojería finísima. Cox: **no** (68 kg de mercurio son tóxicos y peligrosos).
- **¿Real o mito?** Ambos reales. El Beverly es el ejemplo más largo documentado (1864–2023 al menos) de aparato que funciona solo con el clima.

### Gaps
- No encontré documento oficial de Otago con la lista exacta de paradas ni la fecha del último mantenimiento; no confirmé si seguía funcionando en 2026 (la última fuente es de 2023).
- No hay fuente sobre cuántos años funcionó realmente el reloj de Cox seguidos.

## 3. El pájaro bebedor (motor térmico por evaporación)

### Takeaway
El pájaro bebedor es un motor térmico real: la evaporación del agua en la cabeza la enfría unos pocos grados respecto al cuerpo. Absorbe del aire un flujo de calor de **~500 mW** pero solo da **~0,05 mW (50 µW) de movimiento** (rendimiento ≈ 0,01 %). Con generador eléctrico acoplado se han medido **~3 µW** (electromagnético) y **~40 µW pico** (triboeléctrico, a 25 °C y 20 % de humedad). **Con aire muy húmedo se para**. Funciona mientras haya agua en el vaso (días), no años.

### Cited Findings
- Es un motor térmico que convierte una diferencia de temperatura en trabajo mecánico; un análisis dio **~500 mW de flujo de calor por evaporación** y **~0,05 mW de potencia mecánica** → rendimiento ≈ **0,01 %** — [Wikipedia, Drinking bird (espejo IPFS)](https://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq.ipfs.4everland.io/wiki/Drinking_bird.html)
- Pájaro con generador triboeléctrico en cámara de humedad: a **25 °C y ~20 % de humedad relativa** dio **~40 µW pico**, 13 veces más que un montaje anterior con generador electromagnético (**0,04 V y ~3 µW pico**) — [Electronic Design, "Drinking bird becomes an evaporation-driven triboelectricity energy harvester"](https://www.electronicdesign.com/technologies/power/article/55019901/electronic-design-drinking-bird-becomes-an-evaporation-driven-triboelectricity-energy-harvester) (página bloqueada en esta sesión; datos del extracto de búsqueda)
- Tesis de 1969 (Universidad de Missouri) que modela un motor oscilante tipo "pájaro bebedor" para generar energía, con viento hasta 10 mph y diferencias de temperatura hasta 30 °F, y lo compara con la potencia medida por Murrow (RAND) — [MOspace, Shergill 1969](https://mospace.umsystem.edu/items/0c7f92d3-9760-4237-9461-7676a5dd1d90)
- Humedad: un estudio de laboratorio encontró que **con humedad muy alta el juguete ni siquiera funciona** — [Experiments with the drinking bird, Universidad de Coimbra](https://baes.uc.pt/bitstream/10316/12328/1/Experiments%20with%20the%20drinking%20bird.pdf); "tienen verdaderos problemas para funcionar en climas húmedos" — [Wikipedia, Drinking bird](https://en.wikipedia.org/wiki/Drinking_bird)
- La diferencia de temperatura cabeza-cuerpo depende de la humedad relativa; se puede calcular el trabajo máximo a partir de la diferencia entre termómetro seco y húmedo — [Europhysics News, 2015](https://www.europhysicsnews.org/articles/epn/pdf/2015/05/epn2015465-6p41.pdf)
- Un aficionado midió solo **~2 °F (~1 °C)** de diferencia entre la bola de arriba y la de abajo — [resultados de búsqueda; probablemente Wayne's This and That](https://www.waynesthisandthat.com/birds.html)
- Si se moja el cuerpo además de la cabeza, no hay diferencia de temperatura suficiente y se para — [CosmoQuest forum](https://forum.cosmoquest.org/forum/science-and-space/science-and-technology/136953-)

### Inferences
- **Agua que consume** (cálculo propio): 500 mW de evaporación ÷ 2,45 MJ/kg ≈ **~18 g de agua al día**. Si esa cifra de 500 mW es correcta para un pájaro pequeño, un vaso de 200 ml duraría ~10 días. En la práctica la cifra depende mucho de la humedad y la corriente de aire.
- **Energía al día**: 50 µW mecánicos × 86.400 s ≈ **4 J/día** — es de lejos el más "potente" de los aparatos de este informe para su tamaño, pero porque gasta agua (la verdadera fuente es el aire seco: la diferencia entre aire seco y aire saturado de vapor).
- **¿Cuánto dura?** Mientras se rellene el vaso y el aire no esté saturado; los fallos típicos son el fieltro sucio/seco o el aire húmedo. No se encontró un récord de años.
- **¿En casa?** Sí: se compra hecho por pocos euros. Construir uno desde cero exige vidrio soplado sellado con diclorometano: no recomendable.
- **¿Real o mito?** Real. Parece movimiento perpetuo, pero se para en cuanto el aire se satura o se acaba el agua.

### Gaps
- No encontré el umbral exacto de humedad relativa (o de diferencia entre termómetro seco y húmedo) en que se para.
- No pude acceder al artículo de Ralph Lorenz (American Journal of Physics, 2006) con mediciones instrumentadas.
- No encontré el año ni la revista exactos del estudio triboeléctrico (solo el resumen de Electronic Design).

## 4. Motores de humedad y evaporación: esporas (Sahin/Columbia, 2015), higromorfos (piñas, aristas de trigo) y "hidrovoltaicos" (Air-gen, UMass 2020/2023)

### Takeaway
- **Esporas (Columbia, 2015)**: cintas cubiertas de esporas bacterianas se doblan con la humedad y mueven un pistón y un "molino de humedad"; una superficie de agua de **8 × 8 cm daba ~2 µW de media (picos de 60 µW)**, es decir **~0,03 µW/cm²**.
- **Piñas y aristas de trigo**: tejido muerto que se dobla con el ciclo de humedad día/noche; son "motores" naturales reales pero sin uso energético práctico.
- **Air-gen (UMass, Nature 2020)**: película de nanohilos de proteína de *Geobacter* de 7 µm; **~0,5 V y ~17 µA/cm²** solo con la humedad del aire → potencia útil del orden de **~2,5 µW/cm²**. En 2023 se vio que funciona con cualquier material con poros de menos de **100 nm**. En 2023–2025 los mejores "hidrovoltaicos" con agua líquida declaran **140–360 µW/cm²** (sin verificar en algunos casos). Todo esto sigue en laboratorio en 2026.

### Cited Findings
**Esporas – Columbia University (Sahin), 2015**
- Artículo: Chen, Goodnight, Gao, Cavusoglu, Sabharwal, DeLay, Driks, Sahin, "Scaling up nanoscale water-driven energy conversion into evaporation-driven engines and generators", *Nature Communications* 6 (2015), DOI 10.1038/ncomms8346 — [MIT Technology Review, 16-06-2015](https://www.technologyreview.com/2015/06/16/167624/scientists-capture-the-energy-of-evaporation-to-drive-tiny-engines/)
- Las esporas responden mecánicamente con fuerza a los cambios de humedad; pegadas a una cinta de plástico, la cinta se dobla y mueve un motor de pistón y un "Moisture Mill" (molino rotatorio) — [PBS NewsHour](https://www.pbs.org/newshour/science/bacteria-evaporation-energy); [Discover Magazine](https://www.discovermagazine.com/technology/bacterial-spores-power-small-engine)
- Una superficie de agua de **8 cm × 8 cm** produce **~2 µW de media** y puede llegar a **60 µW en picos**; encendieron un LED y movieron un coche en miniatura de **0,1 kg**, a menos de **4 pulgadas (~10 cm) por minuto** — [New Atlas](https://newatlas.com/tiny-car-evaporating-water/38061/?amp=true); [MIT Technology Review](https://www.technologyreview.com/2015/06/16/167624/scientists-capture-the-energy-of-evaporation-to-drive-tiny-engines/)
- Sahin: "El doble de área, el doble de potencia, aproximadamente"; otras fuentes advierten que el uso a gran escala está lejos, si llega — [Ceramic Tech Today](https://ceramics.org/ceramic-tech-today/free-energy-bacterial-spores-help-capture-invisible-power-from-water-evaporation/)

**Higromorfos naturales (piñas, aristas de trigo)**
- Las aristas de trigo son **tejido muerto** pero funcionan como músculos: se alargan cuando están húmedas y se encogen al secarse, lo que entierra la semilla — [Max Planck, pure.mpg.de](https://pure.mpg.de/pubman/item/item_2357787_3/component/file_2357810/2357787.pdf)
- Las aristas tienen dos capas (una se hincha con la humedad, otra no) y se doblan; "suele ser más seco de día y más húmedo de noche: ese ciclo periódico permite a las semillas enterrarse"; **un ciclo de doblarse y desdoblarse puede durar un día entero** (grupo de Ho-Young Kim, Universidad Nacional de Seúl) — [ScienceDaily, 22-11-2015](https://sciencedaily.com/releases/2015/11/151122133139.htm)
- Las escamas de la piña se doblan pasivamente con la humedad (se cierran con humedad, se abren en seco); el movimiento es **ultra-lento** — [PMC, Pine cone actuation, 2022](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9284161/); [Phys.org, 2022](https://phys.org/news/2022-11-reveal-secret-ultra-slow-motion-cones.html)

**Hidrovoltaicos / Air-gen**
- Liu et al., "Power generation from ambient humidity using protein nanowires", *Nature* 578, 550 (17-02-2020): película de nanohilos de proteína de *Geobacter sulfurreducens*; **~0,5 V sostenidos** en una película de **7 µm**, densidad de corriente **~17 µA/cm²** — [NASA ADS, resumen](https://ui.adsabs.harvard.edu/abs/2020Natur.578..550L); [Sci.News](https://www.sci.news/othersciences/energy/air-gen-08137.html)
- Potencia volumétrica estimada **>3,5 kW/m³** (según resumen del artículo) — [Sci.News](https://www.sci.news/othersciences/energy/air-gen-08137.html); otra fuente habla de ">1 kW/m³" en la práctica — [Electronic Design, 2020](https://www.electronicdesign.com/technologies/power/article/21128163/truly-weird-science-energy-harvesting-from-ambient-humidity-and-wires)
- El mecanismo es un gradiente de humedad que se forma solo dentro de la película porosa; se necesitan muchos dispositivos conectados para alimentar pequeños aparatos — [Sci.News](https://www.sci.news/othersciences/energy/air-gen-08137.html); [PopSci](https://www.popsci.com/story/science/air-gen-bacteria-moisture-electricity-renewable/)
- Afirmación secundaria: da energía fiable **hasta ~20 horas** antes de "recargarse" sola (no verificado en el artículo) — [ScienceAlert](https://www.sciencealert.com/scientists-generate-electricity-out-of-thin-air-with-device-that-runs-on-humidity)
- 2023, "Generic Air-gen effect" (Liu, Gao, Sun, Yao, *Advanced Materials*, DOI 10.1002/adma.202300748): funciona con cualquier material (celulosa, proteína de seda, óxido de grafeno) si tiene **poros de menos de 100 nm** (el recorrido libre medio de las moléculas de agua en el aire es ~100 nm); la promesa de "kilovatios" es una proyección — [UMass Amherst, 2023](https://www.umass.edu/news/article/engineers-umass-amherst-harvest-abundant-clean-energy-thin-air-247); [ScienceDaily, 24-05-2023](https://sciencedaily.com/releases/2023/05/230524181948.htm)
- Récord con agua líquida + aire (evaporación, 2023): **142,72 µW/cm²** — [Advanced Science 2023, PMC10602524](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10602524/)
- 2025, IIT Kharagpur: película de gelatina con disulfuro de estaño, **358,6 µW/cm²** (dato de revista divulgativa, artículo primario no verificado) — [Shaastra, IIT Madras](https://shaastramag.iitm.ac.in/special-feature/power-water)
- 2025, *Nature Communications*: generador de humedad con capa fotocatalítica, corriente continua **>600 horas** y +500 % de potencia — [registro DOAJ](https://library.kab.ac.ug/Record/doaj-art-7960325ca08141c4847a20dd94e3128f/Description)
- Diciembre de 2025, *Energy & Environmental Science*: **~0,7 V** y **20 mW/m² (= 2 µW/cm²)** de noche — [RSC, EES 2026](https://pubs.rsc.org/en/content/articlehtml/2026/ee/d5ee05530j)

### Inferences
- **Air-gen por cm²** (cálculo propio): 3,5 kW/m³ × 7 µm de espesor = 0,0245 W/m² ≈ **2,5 µW/cm²**. (El producto 0,5 V × 17 µA/cm² = 8,5 µW/cm² es un máximo teórico; la potencia útil real es menor.) Un Air-gen del tamaño de un sello (~4 cm²) daría ~10 µW: suficiente para un reloj de cuarzo, en teoría.
- **Esporas por cm²**: 2 µW / 64 cm² ≈ **0,03 µW/cm²** de media (≈1 µW/cm² en picos). Necesita agua para evaporar.
- **Diferencia clave**: los hidrovoltaicos de 100+ µW/cm² usan **agua líquida que se evapora** (hay que reponerla); los que funcionan solo con la humedad del aire (Air-gen) están en **~1–3 µW/cm²**.
- **¿En casa?** Air-gen y esporas: no (laboratorio, nanomateriales). Piña: sí, como demostración visible (se abre y cierra con la humedad), pero la fuerza/energía es mínima.
- **¿Real o mito?** Reales, pero en 2026 siguen siendo de laboratorio; ninguno tiene historial de años funcionando como aparato.

### Gaps
- No pude abrir los artículos primarios de *Nature*/*Nature Communications* (bloqueados); el rango de humedad del Air-gen y su duración documentada (días/meses) no están verificados.
- No hay cifra de energía de piñas/aristas de trigo (julios por ciclo).
- La búsqueda de la estimación de Sahin de 2017 sobre potencial energético de la evaporación de lagos falló (error de la herramienta).

## 5. Motores de baja diferencia de temperatura: Stirling de baja ΔT, termoacústicos, bimetálicos y de aleación con memoria de forma (Nitinol)

### Takeaway
- **Stirling de baja ΔT** (los que giran sobre una taza de café o la palma de la mano): reales y comprables; un MM-7 dio **4,5 mW con 40 °C** de diferencia; con la ΔT de una mano (~10 °C) se espera **~0,3–1 mW**. No funcionan con los 2–3 °C diarios de una casa sin una fuente caliente/fría.
- **Termoacústicos**: necesitan **≥20 K para arrancar** y **100–200 K para funcionar estable**; no sirven para cambios diarios.
- **Nitinol**: la rueda de Ridgway Banks (1975) dio **0,23 W a 69 rpm** con baños de agua caliente y fría; rendimiento ~1,6 %. Necesita agua caliente vs. fría (decenas de grados), no los cambios diarios.

### Cited Findings
- Los Stirling de baja diferencia funcionan con la diferencia entre la palma de la mano y el aire, o entre el aire y un cubito de hielo (sin cifra de potencia) — [Colorado State University, demo de física](https://www.physics.colostate.edu/physics-demos/stirling-engine/)
- Motor **MM-7**: **4,455 mW (321 mW/m²) con ΔT = 40 °C** — [Korea Science, 2017](https://koreascience.or.kr/article/JAKO201717234703183.pdf)
- Motor Stirling de baja ΔT sin presurizar de tamaño de vatios: **3,7 W eléctricos con ΔT = 100 °C**; potencia casi **proporcional** a la ΔT — [registro bibliográfico, "compact simple unpressurized Watt-level LTD Stirling engine"](https://bvbvf1.bib-bvb.de/vufind/PrimoRecord/cdi_proquest_journals_2451120897)
- Con ΔT bajas el flujo de calor es muy lento y la potencia muy pequeña (anecdótico, foro de ingenieros) — [Eng-Tips](https://eng-tips.com/threads/heat-energy-conversion.307095)
- Termoacústicos: un motor de onda viajera en bucle puede empezar a oscilar con **ΔT ≈ 20 K**, pero necesita **100–200 K** para régimen estable; un diseño teórico con cambio de fase trabajaría con **<50 K** con >40 % del rendimiento de Carnot (Yang, Meir, Ramon, *Applied Energy* 2020) — [Technion, Yang et al. 2020](https://wetlab.net.technion.ac.il/files/2020/02/Yang-etal_APEN_2020.pdf)
- Optimizar pilas ("stacks") para baja temperatura de arranque es un tema de investigación (Yu y Jaworski, 2010) — [University of Huddersfield](https://pure.hud.ac.uk/en/publications/optimization-of-thermoacoustic-stacks-for-low-onset-temperature-e/); motores de malla con arranque más bajo en **140 °C** — [Universitas Muhammadiyah Jakarta](https://jurnal.umj.ac.id/index.php/jurtek/article/download/14873/10051)
- Nitinol: el primer motor térmico de Nitinol conocido es la patente US 3.913.326 (1975) de Ridgway M. Banks — [Google Patents, US4691518 (cita la anterior)](https://patents.google.com/patent/US4691518)
- Rueda de Banks: lazos de alambre que entran alternativamente en baños de agua caliente y fría; tras funcionar mucho tiempo llegó a **69 rpm y 0,23 W** — [Banks, *Die Naturwissenschaften* 1975](https://springerlink.bibliotecabuap.elogim.com/content/pdf/10.1007/BF00608890.pdf)
- Diseño de baja temperatura (Iowa State, 1980): rendimiento **1,6 %** frente a un Carnot de **13,9 %** con fluido caliente a **115 °F (46 °C)** (la cifra de 0,44 kW de ese documento parece dudosa) — [Wyant, Iowa State University 1980](https://behost.lib.iastate.edu/DR/Wyant_ISU-1980-W97.pdf)
- La potencia de los motores de Nitinol escala casi proporcionalmente al número de elementos — [Google Patents, US4691518](https://patents.google.com/patent/US4691518)

### Inferences
- **Stirling a ΔT de una mano (~10 °C)** (cálculo propio): si la potencia es lineal con ΔT → 4,455 × 10/40 ≈ **1,1 mW**; si es cuadrática (lo habitual en motores térmicos, porque tanto el calor que entra como el rendimiento de Carnot crecen con ΔT) → ≈ **0,28 mW**. Con los **2–3 °C diarios** de una casa y sin fuente separada caliente/fría, prácticamente nada: el Stirling necesita **las dos temperaturas a la vez** (arriba y abajo), mientras que el Atmos/Beverly aprovechan que la temperatura **cambia en el tiempo**.
- **Nitinol**: del Carnot de 13,9 % con 46 °C se deduce un lado frío de ~2 °C → ΔT ≈ 44 °C. Las aleaciones con memoria de forma tienen además una histéresis de transformación de decenas de grados (conocimiento general, no verificado aquí), por eso no responden a cambios de 2–3 °C.
- **Bimetal**: no encontré dispositivos documentados que funcionen años con cambios diarios; un bimetal da movimiento pero con fuerza y energía muy bajas.
- **¿En casa?** Stirling de baja ΔT: **sí**, se venden kits y montados; funcionan sobre una taza de café caliente o un bloque de hielo (pero se paran cuando la taza se enfría: no son "para años"). Rueda de Nitinol: posible con alambre de Nitinol y dos recipientes de agua. Termoacústico: difícil y necesita llama o mucha temperatura.
- **¿Real o mito?** Reales. Ninguno funciona solo durante años con los cambios naturales del día.

### Gaps
- No encontré una medida publicada de potencia de un Stirling sobre una taza de café o una mano (en mW).
- No encontré datos de motores bimetálicos ni de motores de Nitinol funcionando con cambios ambientales diarios.

## 6. Generadores termoeléctricos con pocas décimas/grados de diferencia: relojes de calor corporal (Seiko Thermic, Citizen Eco-Drive Thermo, Matrix PowerWatch)

### Takeaway
Real y comercial. El **Seiko Thermic (diciembre de 1998, 500 unidades)** genera de media **~12 µW** en uso real con el calor de la muñeca (el reloj necesita ~1 µW) y con carga completa marcha **~10 meses**. La **Matrix PowerWatch (2016–2017)** está diseñada para mantener **≥1 °C** entre piel y caja con un rendimiento de conversión de **~1 %**. Pero estos relojes viven del **calor del cuerpo** (≈ 37 °C vs. aire), no de los cambios diarios del ambiente.

### Cited Findings
- Seiko Thermic: elementos termoeléctricos que generan electricidad con la diferencia de temperatura entre cuerpo y aire, y la guardan en una batería secundaria; **carga completa ≈ 10 meses de marcha** — [Seiko Museum](https://museum.seiko.co.jp/en/collections/watch_latestage/collect041/)
- Lanzado en **diciembre de 1998**, edición limitada de **500 unidades**, calibre **6C12**, solo para Japón; Citizen sacó después el Eco-Drive Thermo con el mismo principio — [Plus9Time, 2020](https://www.plus9time.com/blog/2020/5/30/body-heat-powered-watches-seiko-thermic); [actualización 2021](https://www.plus9time.com/blog/2021/5/23/update-body-heat-powered-watches-seiko-thermic-amp-citizen-eco-drive-thermo)
- Chip generador del Thermic: **378 pares de termopares de BiTe** en **6,1 × 2,7 × 2 mm**; en pruebas de uso, generación media **≈12 µW**, suficiente para el reloj (conferencia JSME IIP, 2000) — [J-STAGE, 2000](https://www.jstage.jst.go.jp/article/jsmeiip/2000/0/2000_103/_article/-char/en)
- Micro-módulo posterior: **2 × 2 × 1,3 mm** con más de 50 pares; los relojes eléctricos habían bajado a **~1 µW** de consumo, así que unos pocos µW eran objetivo realista — [J-STAGE, Micromechatronics](https://www.jstage.jst.go.jp/article/micromechatronics/48/1/48_KJ00001061035/_article/-char/en); [Scilit, Kishi et al.](https://scilit.com/publications/931667c443efd62b02ebdab4775e9d5a)
- Cifra no confirmada (texto corrupto): "µW con solo **1,5 K** de caída de temperatura, tensión en vacío **300 mV**" — [Scribd, revisión sobre TEG pequeños](https://www.scribd.com/document/551877310/small-teg)
- Matrix PowerWatch: diseñada para que la diferencia entre la superficie del reloj y la piel sea **≥1 °C**; conversión **~1 %** según su CEO Akram Boukai (suponiendo ~100 W de calor corporal); un convertidor elevador genérico pierde **~70 %** de la energía, por eso hicieron un ASIC propio — [EE Times Japan, 12-04-2018](https://eetimes.itmedia.co.jp/ee/articles/1804/12/news066.html)
- PowerWatch: 46 mm de diámetro, 12,5 mm de grosor; empezó a enviarse en noviembre de 2017 — [EEPower](https://eepower.com/news/thermoelectric-powered-smart-watch/); [TechCrunch, 05-11-2017](https://techcrunch.com/2017/11/05/powerwatch-the-body-heat-powered-smartwatch-starts-shipping/?ncid=rss)
- En un día frío los materiales termoeléctricos actuales pueden dar "unos pocos milivatios" del calor corporal (afirmación divulgativa, sin superficie indicada) — [Gizmodo](https://gizmodo.com/the-cool-promise-of-machines-that-run-on-body-heat-1561923261)

### Inferences
- **Relación útil**: el Thermic genera ~12 µW con la muñeca (diferencia piel-aire de unos pocos °C, pero en el módulo cae solo ~1–2 K) para un reloj que gasta ~1 µW → margen ×10.
- **Con cambios diarios de una habitación (sin cuerpo)**: un termoeléctrico necesita una diferencia de temperatura **simultánea** entre dos caras. Un cambio lento de la temperatura del aire crea solo una diferencia minúscula entre una masa térmica y el aire (décimas de grado), y la potencia termoeléctrica crece con el **cuadrado** de la ΔT → del orden de nanovatios a pocos µW con módulos grandes y una masa térmica (cálculo cualitativo; sin fuente cuantitativa).
- **¿En casa?** Sí, como demostración: un módulo Peltier entre la mano (o una taza) y un disipador da milivatios y puede encender un LED con un convertidor de baja tensión. Para "años sin tocar", solo funciona si siempre hay una fuente caliente (cuerpo, tubería, suelo).
- **¿Real o mito?** Real (comercial desde 1998).

### Gaps
- No encontré fuente sobre si los Thermic/Eco-Drive Thermo siguen funcionando hoy ni sobre el fallo de sus baterías secundarias (plus9time estaba bloqueado).
- No encontré la potencia de la PowerWatch en µW por °C, ni el año exacto del Citizen Eco-Drive Thermo en fuente accesible.

## 7. Captación piroeléctrica de cambios lentos de temperatura

### Takeaway
Los piroeléctricos generan corriente cuando su temperatura **cambia** (no necesitan dos temperaturas a la vez, igual que el Atmos), pero la corriente es proporcional a la **velocidad** del cambio. Con los ciclos lentos del día dan prácticamente nada: los mejores resultados de laboratorio con ciclos rápidos son **0,03–0,7 µW/cm²**; con un cambio de 3 °C en 12 horas se esperan **picovatios a nanovatios por cm²**.

### Cited Findings
- Revisión de 2026: la naturaleza lenta e intermitente de las fluctuaciones térmicas ambientales limita la corriente y la densidad de energía; una celda auto-cargable solo llegó a **0,65 mV tras cuatro ciclos 20–30–20 °C**; un dispositivo alcanzó **7,4 mW/m² (≈0,74 µW/cm²)** — [arXiv 2609.20157](https://arxiv.org/pdf/2609.20157)
- Generador piroeléctrico con ciclos entre **310 y 340 K** (37–67 °C): **0,034 µW/cm²** (*Applied Energy* 2018) — [EconPapers](https://econpapers.repec.org/RePEc:eee:appene:v:221:y:2018:i:c:p:299-307)
- Simulación en carreteras (calentamiento solar diario del asfalto): pico de **0,23 µW/cm²** — [SPIE, Journal of Photonics for Energy](https://spiedigitallibrary.org/journals/Journal-of-Photonics-for-Energy/volume-1/issue-1/014001/Simulation-of-energy-harvesting-from-roads-via-pyroelectricity/10.1117/1.3656395.pdf)
- Dispositivo con tubo de calor oscilante (fuente 55 °C, sumidero 25 °C): rango **nW a mW** — [Cardiff University](https://orca.cardiff.ac.uk/id/eprint/128664/)

### Inferences
- **Estimación propia (orden de magnitud)** con valores típicos de cerámica PZT (coeficiente piroeléctrico ≈ 3×10⁻⁴ C/m²K, permitividad relativa ≈ 1000; valores de manual, no verificados en esta investigación): placa de 1 cm² × 1 mm, cambio de 3 °C en 12 h → corriente ≈ **2 pA**; energía ideal por ciclo ≈ **5 µJ** → media ≈ **0,05 nW**. Las fugas del material durante horas se comerían buena parte. Es entre 10.000 y 100.000 veces menos que el Atmos por unidad de tamaño útil.
- **¿En casa?** No tiene sentido práctico para cambios diarios.
- **¿Real o mito?** Real como fenómeno; inútil para cambios lentos.

### Gaps
- No encontré ninguna medida publicada de energía piroeléctrica con el ciclo natural día/noche en interiores.

## 8. Aparatos reales que han funcionado años y energía disponible al día de los cambios típicos de temperatura y presión en interiores

### Takeaway
Solo dos tipos tienen historial real de **años o décadas**: el **reloj Beverly (desde 1864)** y los **relojes Atmos (desde ~1930, cada uno funcionando años sin cuerda)**; el de **Cox** funcionó en el siglo XVIII pero hoy está parado. Todos trabajan con **≈0,1–2 µW**. Regla práctica (cálculo propio): **un litro de aire encerrado da ~0,6 mJ por día con 1 °C de oscilación y ~5 mJ con 3 °C (≈0,06 µW)**; un litro de aire con 2 hPa de cambio de presión, ~0,2 mJ. Un fluido que hierve a temperatura ambiente (como en el Atmos) da ~10 veces más por grado.

### Cited Findings
- Beverly: **1864 → al menos 2023**, con paradas puntuales; ~0,11 J/día con 3,3 °C diarios en 28 L — [Wikipedia, Beverly Clock](https://en.wikipedia.org/wiki/Beverly_Clock); [1News NZ 2023](https://www.1news.co.nz/2023/03/28/the-unusual-160-year-old-clock-which-could-run-forever)
- Atmos: 1 °C (o 3 mmHg) → 2 días (prototipo), 4,3 días (Atmos 540) — [Wikipedia, Atmos clock](https://en.wikipedia.org/wiki/Atmos_clock)
- Cox: 68 kg de mercurio; hoy desactivado en el V&A — [V&A](https://collections.vam.ac.uk/item/O297335/longcase-clock-cox-james); [Wikipedia](https://en.wikipedia.org/wiki/Cox%27s_timepiece)
- Seiko Thermic: 1998; ~12 µW con calor corporal; 10 meses de reserva — [J-STAGE 2000](https://www.jstage.jst.go.jp/article/jsmeiip/2000/0/2000_103/_article/-char/en); [Seiko Museum](https://museum.seiko.co.jp/en/collections/watch_latestage/collect041/)
- Generador de humedad con >600 h de corriente continua (2025) — [registro DOAJ](https://library.kab.ac.ug/Record/doaj-art-7960325ca08141c4847a20dd94e3128f/Description)

### Inferences
Tabla resumen (cifras redondeadas; "calc." = cálculo propio a partir de las fuentes de arriba):

| Aparato | Fuente real de energía | Potencia | Tiempo funcionando | ¿Casero? | ¿Real? |
|---|---|---|---|---|---|
| Reloj Atmos | Cambios de temperatura (y presión) sobre cápsula de cloruro de etilo | ~0,25 µW (calc.); 1 °C = 2–4,3 días | Años por unidad; modelo desde ~1930 | No (comprar) | Sí |
| Reloj Beverly | Temperatura (y presión) sobre 28 L de aire | ~1–2 µW (calc.) | Desde 1864 (≥159 años) | Principio sí; reloj difícil | Sí |
| Reloj de Cox | Presión atmosférica sobre 68 kg de mercurio | ~0,05 µW (calc., muy incierto) | Siglo XVIII; hoy parado | No (mercurio) | Sí |
| Pájaro bebedor | Evaporación (aire seco) | ~50 µW mecánicos; 3–40 µW eléctricos | Días/semanas (rellenar agua) | Sí (comprado) | Sí |
| Motor de esporas (2015) | Evaporación | ~0,03 µW/cm² media | Laboratorio | No | Sí |
| Air-gen (2020/2023) | Humedad del aire | ~2,5 µW/cm² (calc.) | Laboratorio (horas–semanas) | No | Sí |
| Hidrovoltaicos con agua (2023–25) | Evaporación de agua líquida | 140–360 µW/cm² (récords, parcialmente sin verificar) | Laboratorio (hasta >600 h) | No | Sí |
| Stirling baja ΔT | Diferencia simultánea (taza/mano vs aire) | 4,5 mW a 40 °C; ~0,3–1 mW a 10 °C (calc.) | Mientras dure la fuente caliente | Sí (kit) | Sí |
| Rueda de Nitinol | Agua caliente vs fría (~40 °C de diferencia) | 0,23 W (1975) | Laboratorio | Posible | Sí |
| Termoacústico | ΔT ≥ 20 K (arranque), 100–200 K estable | — | — | Difícil | Sí, no aplica |
| Reloj termoeléctrico | Calor corporal | ~12 µW | Reloj comercial (1998–) | Demostración con Peltier | Sí |
| Piroeléctrico | Velocidad de cambio de temperatura | ~0,05 nW/cm² con ciclo diario (calc.) | — | No útil | Sí, pero inútil aquí |

Cálculos de energía disponible al día en interiores (cálculo propio; **supuestos**: aire a ~20 °C y 1 atm; oscilación diaria de temperatura en interiores de 1–3 °C — el reloj Beverly cita 3,3 °C —; oscilación de presión de 1–4 hPa en un día, no verificada con fuente):
- **Aire encerrado, por temperatura** (trabajo máximo ≈ ½·P·V·(ΔT/T)²):
  - 1 litro, 1 °C → **0,6 mJ/día** (≈0,007 µW)
  - 1 litro, 3 °C → **5 mJ/día** (≈0,06 µW)
  - 28 litros (caja Beverly), 3,3 °C → **0,18 J/día** (≈2 µW) — coincide con el ~0,11 J citado
  - 1 litro, 10 °C (exterior, garaje) → **59 mJ/día** (≈0,7 µW)
  - Crece con el **cuadrado** de la oscilación: el doble de grados da 4 veces más energía.
- **Aire encerrado, por presión** (≈ ½·V·ΔP²/P): 1 litro con 1 hPa → 0,05 mJ; con 2 hPa → **0,2 mJ**; con 4 hPa (≈3 mmHg) → 0,8 mJ; con 10 hPa (cambio de tiempo en varios días) → 5 mJ. Es decir, **un cambio de 3 mmHg ≈ un cambio de 1 °C** en energía para aire — lo mismo que dice el dato del Atmos.
- **Fluido que hierve a temperatura ambiente** (Atmos): ~4.700 Pa/°C frente a ~350 Pa/°C del aire → **~13 veces más fuerza por grado**; por eso una cápsula pequeña basta.
- **Comparación final**: un reloj de cuarzo necesita ~1 µW ≈ 0,086 J/día. Para conseguirlo solo con la temperatura de una casa (3 °C/día) hacen falta ~16 litros de aire encerrado con un sistema perfecto, o una cápsula tipo Atmos. **Con los cambios de temperatura, presión y humedad de una habitación se pueden mover relojes, no motores**: la energía disponible es de milijulios a décimas de julio al día.
- **Mensaje para quien prueba ideas de movimiento perpetuo**: todos estos aparatos funcionan "solos" porque tienen una fuente externa que cambia (sol que calienta la casa por el día, noches frescas, frentes de presión, aire seco). Si se encierran en una caja a temperatura, presión y humedad constantes, todos se paran — el reloj Beverly se ha parado precisamente en días de tiempo muy estable.

### Gaps
- No encontré fuentes cuantitativas sobre la oscilación diaria típica de temperatura y presión en interiores; los valores de 1–3 °C y 1–4 hPa son supuestos razonables, no datos citados.
- No hay datos públicos de cuántos Atmos llevan décadas funcionando sin servicio ni de su vida media.

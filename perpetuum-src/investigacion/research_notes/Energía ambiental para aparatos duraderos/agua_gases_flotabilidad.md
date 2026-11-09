# Agua, gases y flotabilidad: qué puede (y qué no puede) mover un aparato durante meses o años

> Nota de método: en esta sesión la herramienta para abrir páginas completas estaba bloqueada (en.wikipedia.org y physicstoday.aip.org no estaban permitidos en la red). Todos los datos citados vienen de los resúmenes de los buscadores, no de la lectura completa de cada página. Las cifras con varias fuentes que coinciden son fiables. Las que salen de una sola fuente van marcadas. Las cuentas propias (ejemplos con números) van siempre en «Inferencias», no en «Hallazgos citados».

## 1. La idea del usuario: bolas con gas que se encogen o se hinchan con el agua (ley de Boyle, ludión). ¿Da energía neta en un ciclo cerrado?

### Takeaway
No. En una columna de agua quieta y a la misma temperatura, el gas de la bola se comprime al bajar y se expande al subir, pero la energía que «ganas» al subir es exactamente la que gastas al bajarla (o al hincharla abajo). En un ciclo completo el balance es cero y, con rozamiento, negativo. El ludión (buzo de Descartes) es un juguete muy bueno para *ver* la ley de Boyle, no una fuente de energía.

### Cited Findings
- Ley de Boyle: a temperatura constante, el volumen de una cantidad fija de gas es inversamente proporcional a la presión (p·V = constante). — [Science Notes, Cartesian diver](https://sciencenotes.org/dive-into-science-the-cartesian-diver-experiment/); [Stony Brook Physics Lab Demo](https://www.stonybrook.edu/commcms/physics-lab-demo/f.-fluid-mechanics/f2.-buoyancy/cartesian-diver.php)
- El ludión funciona así: al apretar la botella sube la presión, el aire de dentro se comprime, el «buzo» desplaza menos agua, su empuje baja y se hunde. Al soltar, el aire se expande y vuelve a flotar. — [Stony Brook Physics Lab Demo](https://www.stonybrook.edu/commcms/physics-lab-demo/f.-fluid-mechanics/f2.-buoyancy/cartesian-diver.php); [Science Notes](https://sciencenotes.org/dive-into-science-the-cartesian-diver-experiment/)
- Formulación cuantitativa del ludión: p·V = (p + Δp)(V + ΔV); el cambio de empuje es ρ·g·ΔV (ρ = densidad del agua, g = gravedad). — [UMK Toruń, «Cartesian diver»](https://dydaktyka.fizyka.umk.pl/zabawki1/files/termo/nurek_big-en.html) (el resumen del buscador lo atribuye a una página universitaria; fuente secundaria)
- En el agua, la presión aumenta aproximadamente 1 atmósfera por cada 10 m de profundidad. A 10 m la presión absoluta es de unas 2 atm y el aire atrapado se reduce a la mitad de su volumen. — [Wisconsin Shipwrecks, «Boyle's Law and Diving» (PDF)](https://education.wisconsinshipwrecks.org/activities/physics/Boyle's%20Law%20and%20Diving.pdf)
- El empuje funciona como la energía potencial gravitatoria: para devolver el sistema a su estado inicial hace falta, como mínimo, la misma energía que se sacó (como subir otra vez una piedra que se dejó rodar cuesta abajo). En el caso del empuje, el «peso» que se mueve es el agua desplazada. — [Physics Forums, «Why doesn't the buoyant wheel and belt perpetual motion machine work?»](https://www.physicsforums.com/threads/why-doesnt-the-buoyant-wheel-and-belt-perpetual-motion-machine-work.284786/)
- El empuje no es energía gratis y «no tiene nada de mágico». — [R. Hakim, «Buoyancy and Perpetual Motion» (2016)](https://rhakim42.github.io/posts/2016/12/buoyancy-perpetual-motion)

### Inferences
Ejemplo con números (cálculo propio: gas ideal, temperatura constante, agua dulce ρ = 1000 kg/m³, g = 9,81 m/s², presión en la superficie p₀ = 101 325 Pa; no se cuenta el peso de la bola).

**a) Bola rígida de 1 L, ciclo de 1 m (sube y baja):**
- Empuje = ρ·g·V = 1000 × 9,81 × 0,001 = **9,81 N** (como sostener 1 kg).
- Energía al subir 1 m: **9,81 J**. Energía necesaria para volver a bajarla 1 m contra ese empuje: **9,81 J**. Balance del ciclo: **0 J**, y negativo en cuanto hay rozamiento o arrastre del agua.

**b) Bola blanda de 1 L de aire que se encoge con la presión (ley de Boyle):**
- A 1 m de profundidad la presión pasa de 101 325 Pa a 111 135 Pa (**+9,7 %**). El volumen baja de 1,000 L a **0,912 L** (−8,8 %).
- Al bajar, la bola empuja menos hacia arriba, así que cuesta menos hundirla: el trabajo para bajarla es ∫ρ·g·V(z)·dz = p₀·V₀·ln(p₁/p₀) = **9,36 J** (en lugar de 9,81 J).
- Al subir, el aire se vuelve a expandir siguiendo el mismo camino y devuelve exactamente **9,36 J**. Balance: **0 J**. Que la bola se encoja reduce lo que cuesta bajarla, pero reduce en la misma medida lo que da al subir.
- A 10 m: el volumen baja a 0,51 L; trabajo para bajarla 68,6 J (frente a 98,1 J si fuera rígida); devuelve 68,6 J al subir. Balance: 0 J.

**c) El «truco» del usuario: hinchar la bola abajo para que suba con más fuerza y deshincharla arriba para que baje con facilidad:**
- Ejemplo: abajo (a 1 m) la bola pasa de 1,0 L a 1,1 L; sube con 1,1 L; arriba vuelve a 1,0 L; baja con 1,0 L.
- Ganancia extra de empuje al subir: ρ·g·ΔV·h = 1000 × 9,81 × 0,0001 × 1 = **0,98 J**.
- Coste extra: para hinchar 0,1 L abajo hay que empujar el agua contra una presión mayor que en la superficie. El exceso de presión es ρ·g·h = 9 810 Pa, y el trabajo extra es 9 810 × 0,0001 = **0,98 J**.
- Balance: **0,98 − 0,98 = 0 J**. Es una identidad: la presión del agua a profundidad h es exactamente ρ·g·h por encima de la de la superficie, así que cualquier volumen ganado abajo cuesta lo mismo que da en empuje al subir. No depende de la forma, del tamaño, del gas ni del mecanismo.
- Si la bola se hincha «sola» al tocar el agua, la energía sale de otro sitio: una reacción química que se agota (pastilla efervescente), una diferencia de temperatura o el secado por evaporación (ver apartados 2 y 3). En un tanque cerrado a temperatura uniforme ese «otro sitio» no existe.

**Escala:** aunque la energía fuera gratis, una bola de 1 L que sube 1 m da como mucho ~10 J. Una bola cada 2 segundos serían ~5 W teóricos, y eso sin descontar las pérdidas. Sirve para comparar con lo que se ve en los vídeos.

**Ciclo real:** con aire, la compresión y la expansión nunca son perfectamente reversibles (calentamiento del gas, rozamiento, turbulencia, juntas). Por eso el balance real siempre es **negativo**: la rueda se para.

### Gaps
- No he encontrado un apunte universitario que haga exactamente el ejemplo de «1 L de aire cíclico en 1 m de agua». El cálculo es propio, con física estándar (Boyle y Arquímedes).

## 2. ¿Y si hay una diferencia de temperatura real (agua caliente arriba, fría abajo)? Planeadores y boyas térmicas (SOLO-TREC, Slocum Thermal, Seatrec)

### Takeaway
Aquí sí hay energía real: la diferencia de temperatura del océano entre la superficie (~20–25 °C en zonas tropicales) y la profundidad (500 m o más) mueve un pequeño motor térmico. Una cera que se funde con el calor y se solidifica con el frío cambia de volumen y empuja aceite que genera electricidad. Da unos 1,6–1,7 Wh (~6 kJ) por inmersión, es decir, del orden de 0,1 W de media. Hay ejemplos reales que han funcionado más de un año en el mar. La fuente es el Sol, que calienta la superficie del mar, no la flotabilidad.

### Cited Findings
**SOLO-TREC (JPL/NASA + Scripps, boya perfiladora, Hawái):**
- Primer vehículo submarino autónomo alimentado por la energía térmica del océano (demostración anunciada por la NASA en 2010). — [NASA JPL, «NASA demonstrates novel ocean-powered underwater vehicle»](https://www.jpl.nasa.gov/news/nasa-demonstrates-novel-ocean-powered-underwater-vehicle/); [Scripps](https://scripps.ucsd.edu/news/thermal-energy-ocean-powers-new-autonomous-vehicle)
- Energía por inmersión: **~1,7 Wh (≈6 100 J)**, suficiente para alimentar los instrumentos científicos, el GPS y las comunicaciones. — [Wikipedia, SOLO-TREC](https://en.wikipedia.org/wiki/SOLO-TREC); [ENN](https://enn.com/articles/41188); [Engadget](https://www.engadget.com/tag/SOLO-TREC)
- Cifra alternativa de una presentación de Scripps/JPL de 2010–2011: **~1,6 Wh (más de 7 000 J, según el resumen) por inmersión**, liberados para mover un motor hidráulico que genera electricidad y recarga baterías. Ojo: 1,6 Wh son 5 760 J, así que «más de 7 000 J» no cuadra; puede ser un error del resumen o una cifra de energía bruta. — [Slideshare, «Profiling Floats and Gliders/AUVs Powered by Ocean Temperature Differential»](https://www.slideshare.net/slideshow/profiling-floats-and-glidersauvs-powered-by-ocean-temperature-differential/59442722); [Slashdot (1,6 Wh)](https://hardware.slashdot.org/story/10/04/10/1440243/underwater-robot-powered-by-oceans-thermal-energy?sdsrc=next)
- Error frecuente en la prensa: algunos medios dijeron «1,7 vatios»; es **1,7 vatios-hora** (energía), no vatios (potencia). — [Slashdot (corrección en los comentarios)](https://hardware.slashdot.org/story/10/04/10/1440243/underwater-robot-powered-by-oceans-thermal-energy?sdsrc=next)
- Mecanismo: un material de cambio de fase parecido a la cera se expande cuando se calienta por encima de ~10 °C y se contrae al enfriarse; al expandirse presuriza aceite, que mueve un motor hidráulico que carga las baterías. — [Wikipedia, SOLO-TREC](https://en.wikipedia.org/wiki/SOLO-TREC); [Slideshare Scripps/JPL](https://www.slideshare.net/slideshow/profiling-floats-and-glidersauvs-powered-by-ocean-temperature-differential/59442722)
- Funcionamiento demostrado: **más de 1 000 inmersiones entre la superficie y 500 m hasta junio de 2011**. — [Seatrec/Chao, AGU Ocean Sciences 2016 (PDF)](https://agu.confex.com/agu/os16/mediafile/Handout/Paper91914/AGU-OS2016-Chao-Seatrec.compressed.pdf); Wikipedia da una cifra anterior de «más de 450 inmersiones» ([Wikipedia](https://en.wikipedia.org/wiki/SOLO-TREC)). Las dos cifras corresponden a fechas distintas.

**Slocum Thermal Glider (Webb Research / WHOI):**
- El concepto original: «SLOCUM: An underwater glider propelled by environmental energy» (Webb, Simonetti y Jones, IEEE J. Oceanic Eng., 2001). — [ResearchGate](https://www.researchgate.net/publication/3231233_SLOCUM_An_underwater_glider_propelled_by_environmental_energy)
- Prototipo lanzado en diciembre de 2007 frente a St. Thomas (Caribe) y recuperado en abril de 2008 por D. Fratantoni (WHOI) y R. Watlington (Univ. Islas Vírgenes). — [WHOI Oceanus, «'Green' Energy Powers Undersea Glider»](https://www.whoi.edu/oceanus/feature/green-energy-powers-undersea-glider/)
- Vuelo largo iniciado el 12 de diciembre de 2008 por WHOI y Webb. — [Hydro International, «Slocum Gliders Make Historic Voyages»](https://www.hydro-international.com/article/slocum-gliders-make-historic-voyages&gsessionid=PHFDNamSk4cTeTz2MKh1KJSlAIA2E6ZRX96qOd-dz8XOohpTMxjIAg)
- Un artículo de 2016 atribuye al motor de Webb de 2008 **160 días en el mar y ~3 000 km en 2009**. El rendimiento del ciclo térmico de los primeros motores era de **~3 %**. — [ScienceDirect, «A thermal engine for underwater glider driven by ocean thermal energy» (2016, resumen)](https://www.sciencedirect.com/science/article/abs/pii/S1359431116000934). Es una fuente secundaria; no he encontrado el informe técnico original de Webb/WHOI con estas cifras.
- Aunque la propulsión del planeador es 100 % térmica, sigue necesitando baterías para el GPS, el teléfono Iridium, los motores y los sensores. — [Design News](https://www.designnews.com/wrc-glider-uses-thermal-engine-travel-through-water)
- Otro prototipo (no de Webb, artículo de ScienceDirect de 2016) con un motor de cambio de fase optimizado: **potencia media de salida del motor de 124 W** y **677 km en 27 días** en pruebas en el mar. Los 124 W son probablemente potencia durante la descarga del motor, no una media diaria; no lo he podido verificar. — [ScienceDirect (resumen)](https://www.sciencedirect.com/science/article/abs/pii/S1359431116000934)

**Seatrec (empresa derivada, 2016–hoy):**
- Fundada en 2016 por Yi Chao (ex-JPL), con tecnología licenciada de Caltech/JPL. Su módulo **SL1** usa una cera que se solidifica en el agua fría profunda y se licúa cerca de la superficie. El cambio de volumen mueve un motor que recarga la batería de la boya. — [RESET.org (2021)](https://en.reset.org/seatrac-harnessing-green-energy-depths-sea-03162021/); [World Economic Forum (2021)](https://www.weforum.org/stories/2021/05/sustainable-energy-ocean-floats/)
- El fundador dice que las boyas pueden «durar indefinidamente» y medir más a menudo. Es un mensaje comercial, no un dato independiente. Algunos comentaristas dudan de que la energía alcance para todos los sensores. — [TechSpot (2024)](https://www.techspot.com/news/103473-nasa-spin-off-new-robot-can-explore-oceans.html)
- Plan declarado: después de las boyas, llevar la energía de cambio de fase a los planeadores, y luego sistemas «líquido-gas» de mayor potencia. — [Freethink](https://www.freethink.com/technology/underwater-gliders); [Interesting Engineering](https://interestingengineering.com/innovation/seatrec-self-charging-underwater-robots)

### Inferences
- **Potencia media de SOLO-TREC (cálculo propio):** 1 000 inmersiones en ~18,5 meses (finales de 2009 a junio de 2011) son ~1,8 inmersiones al día. A ~1,7 Wh cada una salen ~3 Wh/día, es decir, **~0,13 W de media**. Es poco, pero basta para sensores y un módem satelital que se usan de vez en cuando.
- **Límite de Carnot (cálculo propio):** con 25 °C arriba y 5–8 °C abajo, el máximo teórico de cualquier motor térmico es del **6–7 %**. Los motores reales se quedaban en torno al 3 %. Por eso hace falta mucho calor para sacar poca electricidad.
- **Por qué funciona y la rueda de bolas no:** el motor no saca energía del empuje. La saca del calor que fluye de la superficie caliente al fondo frío a través de la cera. La flotabilidad solo sirve para moverse entre las dos capas. Si se quita la diferencia de temperatura (un tanque en casa a temperatura uniforme), el motor se para.
- **¿Se puede hacer una versión casera?** Solo como demostración. En un acuario, el agua se mezcla y no hay capas a distinta temperatura. Habría que calentar arriba (Sol o una lámpara) y enfriar abajo (hielo), y la energía real sería la de ese calor y ese hielo. Con 100 g de cera se obtienen como mucho decenas o cientos de julios por ciclo (ver apartado 3).

### Gaps
- No he podido confirmar la fecha exacta de lanzamiento (se cita «finales de 2009, Hawái») ni la duración total de SOLO-TREC más allá de junio de 2011.
- No he encontrado datos verificados de energía por inmersión del SL1 de Seatrec ni resultados de 2024–2026 de planeadores térmicos comerciales.
- La presión de trabajo del aceite en SOLO-TREC (a veces se cita ~3 000 psi) no está verificada.

## 3. Materiales que cambian de volumen: cera de parafina, gases que se dilatan con la temperatura, hidrogeles y esponjas, gas químico o efervescente

### Takeaway
Todos estos materiales son «transformadores»: convierten una fuente externa en movimiento. La cera y el gas aprovechan el calor (cambios de temperatura). Los hidrogeles aprovechan la humedad y el secado (en último término, el Sol y el aire seco). Las pastillas efervescentes consumen un reactivo químico. Ninguno saca energía del agua quieta ni del empuje. El ejemplo comercial más duradero es el reloj Atmos, que funciona solo con los cambios de temperatura de la habitación y consume ~0,25 µW.

### Cited Findings
**Cera de parafina:**
- La parafina se expande **~15 %** al fundirse; la literatura da un **10–15 %** según el tipo. — [Imperial College (PDF, estudio de modelado)](https://imperial.ac.uk/media/imperial-college/faculty-of-engineering/electrical-and-electronic-engineering/public/optical-and-semiconductor-devices/pubs/21205696.PDF); [MDPI Actuators 7(4):81 (2018)](https://www.mdpi.com/2076-0825/7/4/81)
- Calor latente de fusión de una parafina concreta: **266 J/g** (266 000 J/kg). Dato de una sola fuente y de una cera concreta. — [Imperial College (PDF)](https://imperial.ac.uk/media/imperial-college/faculty-of-engineering/electrical-and-electronic-engineering/public/optical-and-semiconductor-devices/pubs/21205696.PDF)
- Punto de fusión según el tipo: por ejemplo 58–62 °C o 64 °C en actuadores de laboratorio. — [MDPI Actuators (2018)](https://www.mdpi.com/2076-0825/7/4/81)
- Los actuadores de parafina aprovechan ese cambio de volumen de sólido a líquido para dar a la vez mucho recorrido y mucha fuerza. — [MDPI Actuators (2018)](https://www.mdpi.com/2076-0825/7/4/81)

**Gas que se dilata o contrae con la temperatura (y la presión): reloj Atmos (Jaeger-LeCoultre):**
- El reloj Atmos funciona con los cambios de temperatura (o de presión) del aire. Una variación de **1 °C (entre 15 y 30 °C)** o de **3 mmHg** de presión basta para que funcione **2 días**. — [Watch Collecting Lifestyle](https://www.watchcollectinglifestyle.com/home/insider-jaeger-lecoultre-atmos-classique-the-clock-powered-by-ambient-temperature-variations); [Wikipedia, Atmos clock](https://en.wikipedia.org/wiki/Atmos_clock)
- Esa cifra de 2 días/°C es de un prototipo antiguo. Para el **Atmos 540** se ha calculado **4,3 días por °C**. — [Wikipedia, Atmos clock](https://en.wikipedia.org/wiki/Atmos_clock)
- Comparación clásica: **60 millones de relojes Atmos juntos consumirían lo mismo que una bombilla de 15 W**. — [Wikipedia, Atmos clock](https://en.wikipedia.org/wiki/Atmos_clock) (según el resumen del buscador)

**Hidrogeles, esponjas, efervescentes:** no he encontrado fuentes fiables con cifras (ver Gaps).

### Inferences
- **Cera, cálculo propio:** 100 g de parafina (~111 cm³) se expanden ~15 % al fundirse, es decir, ~17 cm³. Para fundirla hacen falta ~27 kJ de calor (100 g × 266 J/g). Si empuja contra una presión alta, por ejemplo 10 MPa (100 bar), el trabajo es p·ΔV ≈ **170 J por ciclo**. Rendimiento: **~0,6 %**. Como fuente de energía es poco eficiente, pero es muy robusta y no necesita electricidad.
- **Gas y temperatura, cálculo propio:** a presión constante, ΔV/V = ΔT/T. Una bola de 1 L de aire que cambia 10 °C entre el día y la noche varía ~34 cm³ (3,4 %). Eso son ~0,33 N de empuje, ~0,33 J si sube 1 m, una vez al día: **~4 µW de media**. Es el mismo orden que el Atmos (cálculo propio: 15 W / 60 millones ≈ **0,25 µW**). Bajo el agua la oscilación de temperatura es mucho menor que en el aire, porque el agua tiene mucha inercia térmica, así que en un tanque la cifra real sería aún menor.
- **Efervescente, cálculo propio:** 1 g de bicarbonato sódico da ~0,012 mol de CO₂, ~0,29 L a 25 °C. Esa burbuja, al subir 1 m, da como mucho **~2,9 J**. Después se ha gastado y hay que reponer la pastilla. No es movimiento perpetuo: es una «pila química» muy mala.
- **Hidrogeles y esponjas (razonamiento físico, sin cifras citadas):** se hinchan porque absorben agua (fuerza osmótica). Para que vuelvan a encoger hay que secarlos (Sol o aire seco), o cambiar la sal o la temperatura del agua. En un tanque sumergido siempre en la misma agua se hinchan una vez y se quedan así. La energía real viene de la evaporación.
- **Para el usuario:** la bola que «se hincha al tocar el agua» solo puede funcionar si algo externo la vuelve a deshinchar (calor, secado o reactivo nuevo), y ese algo es la fuente de energía.

### Gaps
- No he encontrado fuentes con cifras de energía o potencia para actuadores de hidrogel o esponja, ni para motores de evaporación (por ejemplo, el trabajo de Sahin y colaboradores de 2015 con esporas bacterianas, que conozco pero no he verificado en esta sesión).
- La sustancia exacta del fuelle del reloj Atmos (cloruro de etilo, según descripciones habituales) no aparece en los resúmenes obtenidos.
- No he encontrado un dato citado de microvatios para el Atmos; los 0,25 µW salen de dividir 15 W entre 60 millones.

## 4. Energía del gradiente salino u osmótica (PRO y electrodiálisis inversa)

### Takeaway
Mezclar agua dulce con agua de mar libera energía real: unos 0,8 kWh por m³ de agua dulce, unos 2,9 kJ por litro, como si ese litro cayera desde casi 300 m de altura. Pero las membranas dan poco: de 0,3 a 3 W por m² en plantas reales, y hacen falta ~5 W/m² para que salga rentable. La planta piloto de Statkraft en Tofte (Noruega, 2009–2014) dio 2–4 kW con ~2 000 m² de membrana y se cerró por el coste. La energía viene en último término del Sol, que evapora el mar y hace llover agua dulce. Aquí no hay un «movimiento perpetuo»: se gastan continuamente agua dulce y agua salada.

### Cited Findings
- Energía libre de mezclar agua de mar con agua de río: **0,81 kWh/m³**. Máximo extraíble con ósmosis por presión retardada (PRO) a presión constante: **0,75 kWh/m³** (un 91,1 % del máximo termodinámico). — Yip y Elimelech, Environ. Sci. Technol. 2012, según el resumen del buscador; ver también [phys.org (2012)](https://phys.org/news/2012-04-rivers-sea-vast-potential-electricity.amp). No he podido abrir el artículo original.
- Según esos autores, centrales PRO que usaran solo una décima parte del agua de los ríos que llega al mar cubrirían la electricidad de **520 millones de personas**. — [phys.org (2012)](https://phys.org/news/2012-04-rivers-sea-vast-potential-electricity.amp)
- Revisión de referencia: Logan y Elimelech, «Membrane-based processes for sustainable power generation using water», *Nature* 488 (7411): 313–319 (2012). — [OUCI](https://ouci.dntb.gov.ua/works/4KOvNpJ4)
- Potencial teórico mundial del gradiente salino en las desembocaduras: **1,4–2,6 TW**; otras fuentes dicen **~1 TW**. — [ScienceDirect, revisión RED 2022](https://www.sciencedirect.com/science/article/abs/pii/S1385894722049610); [phys.org](https://phys.org/news/2012-04-rivers-sea-vast-potential-electricity.amp)

**Statkraft, Tofte/Hurum (Noruega), PRO:**
- Producción de prueba desde el **24 de noviembre de 2009**, a orillas del fiordo de Oslo; producía **2–4 kW**. — [Wikipedia, Statkraft osmotic power prototype](https://en.wikipedia.org/wiki/Statkraft_osmotic_power_prototype_in_Hurum); [POWER Magazine (2009)](https://www.powermag.com/norway-inaugurates-osmotic-power-plant/)
- Unos **2 000 m² de membrana**. — [Wikipedia](https://en.wikipedia.org/wiki/Statkraft_osmotic_power_prototype_in_Hurum)
- Densidad de potencia: **~1 W/m²** al principio. Statkraft pasó de menos de 0,1 W/m² a **casi 3 W/m²** en su desarrollo de membranas. Para ser rentable hacían falta **5 W/m²**. Otra fuente habla de 10 kW de capacidad. — [Renewable Energy World](https://www.renewableenergyworld.com/hydro-power/by-the-power-of-oz-osmotic-generation-technology-51587/); [Wikipedia, Pressure-retarded osmosis](https://en.wikipedia.org/wiki/Pressure-retarded_osmosis); [desalination.com (2014)](https://www.desalination.com/articles/membranes-not-pro-s-stairway-to-heaven)
- Cierre: Statkraft anunció que abandonaba la energía osmótica (a finales de 2012 o en 2013, según la fuente) y cerró el piloto **en enero de 2014** por viabilidad económica: las membranas eran caras y poco eficientes. La planta piloto de 1–2 MW prevista no se construyó. — [POWER Magazine, «Statkraft shelves osmotic power project»](https://www.powermag.com/statkraft-shelves-osmotic-power-project/); [ForwardOsmosisTech](https://forwardosmosistech.com/?p=183); [Wikipedia](https://en.wikipedia.org/wiki/Statkraft_osmotic_power_prototype_in_Hurum)

**Electrodiálisis inversa (RED):**
- Piloto de Afsluitdijk (Países Bajos, REDstack): con agua natural durante 1 mes, densidad de potencia bruta de **0,3–0,4 W/m²**. — [ResearchGate, «Reverse Electrodialysis for energy production from natural River Water and Seawater»](https://www.researchgate.net/publication/327696113_Reverse_Electrodialysis_for_energy_production_from_natural_River_Water_and_Seawater)
- En sistemas RED a gran escala la densidad de potencia se queda en **0,38–2,7 W/m² por par de celdas**. Los cuellos de botella son el rendimiento y la conversión. — [ScienceDirect, revisión 2022](https://www.sciencedirect.com/science/article/abs/pii/S1385894722049610)
- Máximos de laboratorio citados: ~2,2 W/m² netos con un 35 % de rendimiento energético; otros ensayos optimizados, 0,446 W/m². — [ScienceDirect, revisión 2022](https://www.sciencedirect.com/science/article/abs/pii/S1385894722049610); [PMC8075804](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8075804/)

**Sweetch Energy (Francia), estado 2024–2026:**
- Demostrador **OsmoRhône / OPUS-1** en el delta del Ródano con CNR: objetivo de **~50 kW** (o «unas decenas de kW»), con pruebas desde **finales de 2024**. — [DirectIndustry e-Magazine (dic. 2024)](https://emag.directindustry.com/2024/12/04/sweetch-energy-partners-with-rockwell-automation-to-advance-osmotic-power-innovation/); [Earth.org](https://earth.org/osmotic-power-the-next-wave-of-renewable-energy/); [Footprint Coalition](https://www.footprintcoalition.com/post/sweetch-energy-is-opening-the-floodgates-for-energy-made-with-salt-and-water-and-others-are-joining)
- Objetivo a largo plazo: 500 MW (es una proyección). En mayo de 2025 anunció una fábrica de generadores osmóticos en Rennes (La Janais). — [Sweetch Energy, nota de prensa (mayo 2025, PDF)](https://www.sweetch.energy/wp-content/uploads/2025/05/280525-cp-sweetch-ernergy-la-janais-eng.pdf)

### Inferences
- **Cálculo propio:** 0,81 kWh/m³ son **2,9 kJ por litro** de agua dulce, la misma energía que soltar ese litro desde **~300 m**. Es mucho más que los ~10 J que da la bola de 1 L que sube 1 m, pero solo si se repone el agua dulce y la salada continuamente.
- **Escala casera:** con 1 m² de membrana RED a 0,3–1 W/m² se obtendría, en el mejor caso, **0,3–1 W** mientras haya caudal de agua dulce y salada. Si se usan dos recipientes cerrados (uno de sal y otro sin sal), las concentraciones se igualan y el aparato se para; durará tanto como el «depósito» de sal.
- **Real, no mito.** Pero es caro: Tofte no llegó a los 5 W/m² y cerró. A fecha de 2026, el demostrador de Sweetch es el más avanzado, sin cifras de producción medida publicadas que haya encontrado.

### Gaps
- No he encontrado datos medidos de producción de OsmoRhône/OPUS-1 en 2025–2026.
- No he verificado en esta sesión los resultados de nanoporos o nanotubos de nitruro de boro con miles de W/m² (Siria et al., *Nature* 2013); son de un solo poro y no se pueden extrapolar a una membrana real.
- No he encontrado demostraciones caseras documentadas (kits educativos de «pila salina» con datos fiables).

## 5. Mareas, nivel del agua y lluvia a pequeña escala

### Takeaway
La lluvia y las mareas son energía real (del Sol y de la Luna), pero a escala de casa dan muy poco: del orden de milivatios para la lluvia sobre 1 m² y de ~1 W como máximo teórico para un estanque de mareas de 1 m² con 2 m de carrera. El generador de gotas de *Nature* (2020) da picos de 50 W/m², pero son destellos de microsegundos, no una media.

### Cited Findings
- Generador de electricidad por gotas (Xu et al., *Nature* 578: 392–396, 5 de febrero de 2020, City University of Hong Kong): **densidad de potencia instantánea máxima de 50,1 W/m²**, unas mil veces más que los dispositivos anteriores de gota sobre sólido, que daban menos de 1 W/m². — [Nature (PDF)](https://www.nature.com/articles/s41586-020-1985-6.pdf); [ADS](https://ui.adsabs.harvard.edu/abs/2020Natur.578..392X); [Asia Research News / CityU](https://www.asiaresearchnews.com/node/16073)
- Con agua de lluvia, el pico es algo menor que con agua del grifo. Solo **~2,2 % de la energía cinética** de cada gota se convierte en electricidad. La carga superficial puede degradarse con el tiempo. — [CityU, recortes de prensa](https://www.cityu.edu.hk/media/in-the-news/202002/97126)
- Estructura: capa de PTFE (teflón), electrodo de aluminio y capa de ITO. Al extenderse, la gota une los electrodos y cierra el circuito. — [Silicon Republic](https://siliconrepublic.com/machines/convert-rain-water-into-electricity)

### Inferences
- **Lluvia, cálculo propio:** una gota de 4 mm (~33 mg) cae a ~9 m/s y tiene ~1,4 mJ. Una lluvia fuerte de 10 mm/h sobre 1 m² aporta ~0,11 W/m² de energía cinética. Con un 2,2 % de conversión quedan **~2,5 mW/m²**, y solo mientras llueve.
- **Agua de un tejado, cálculo propio:** 1 m² de tejado con 1 000 mm de lluvia al año recoge 1 m³ (1 000 kg). Si cae 3 m, da ~29 kJ/año, una media de **~0,9 mW**. Es suficiente para un sensor que se despierta de vez en cuando, no para mover una rueda.
- **Mareas, cálculo propio (máximo teórico):** un estanque de 1 m² con 2 m de carrera de marea, aprovechando el llenado y el vaciado (4 veces al día), da ~78 kJ/día, **~0,9 W de media**. La energía crece con el cuadrado de la carrera: con 0,3 m (mareas pequeñas, como en buena parte del Mediterráneo) baja a **~0,02 W**. La fuente es la Luna (y el Sol) frenando la rotación de la Tierra: es real e inagotable a escala humana.
- La lluvia y las mareas son reales, no mitos, pero su potencia por m² es pequeña. Un aparato casero que funcione años con ellas necesita almacenamiento (batería o depósito elevado) y un consumo de microvatios a milivatios.

### Gaps
- No he encontrado (no lo busqué en profundidad por límite de búsquedas) ejemplos documentados de relojes o aparatos de mareas a pequeña escala con años de funcionamiento, ni cifras citadas de carrera de marea por costa española.

## 6. Mitos de movimiento perpetuo con flotabilidad (ruedas de flotadores, cadenas de burbujas, máquinas «hidro-gravitatorias») y por qué fallan

### Takeaway
Todos fallan por la misma razón: la energía que da el empuje al subir es igual (o menor) que la que cuesta meter el flotador en el fondo, hundirlo o inyectar el aire abajo. Esto es la conservación de la energía y no tiene excepciones. Los diseños se repiten desde hace siglos. Hacerlos más grandes o con más flotadores solo aumenta por igual las fuerzas que se oponen.

### Cited Findings
- Rueda o cinta de flotadores: el fallo central es la conservación de la energía. El empuje se comporta como la energía potencial gravitatoria, y devolver el sistema al inicio cuesta lo que se ganó. — [Physics Forums](https://www.physicsforums.com/threads/why-doesnt-the-buoyant-wheel-and-belt-perpetual-motion-machine-work.284786/)
- En un diseño con tanques comunicados, la diferencia de presión en las aberturas anula la diferencia de empuje de los objetos que suben o bajan, y no queda fuerza neta para girar. — [Physics Forums](https://www.physicsforums.com/threads/why-doesnt-the-buoyant-wheel-and-belt-perpetual-motion-machine-work.284786/)
- Carta en *Scientific American* (1 de octubre de 1910): el aparente desequilibrio de un aparato así no produce movimiento, ni siquiera con un número infinito de recipientes. — [Scientific American, Correspondence 1910](https://www.scientificamerican.com/article/correspondence-1910-10-01/)
- Históricamente, el fracaso de estas máquinas se achacaba al rozamiento, «el viejo enemigo invencible de los buscadores del movimiento perpetuo», aunque la causa de fondo es la conservación de la energía. — [Today in Science, *Mechanical Appliances*](https://todayinsci.com/Books/MechApp/chap23/page44.htm)
- Muchos errores vienen de no entender el empuje: no es energía gratis. — [R. Hakim (2016)](https://rhakim42.github.io/posts/2016/12/buoyancy-perpetual-motion)
- Un diseño que necesita un combustible que se gasta o una fuente externa no es movimiento perpetuo. — [Physics Forums](https://www.physicsforums.com/threads/perpetual-motion-explain-why-its-impossible.567572)

### Inferences
Fallos de cada mito en una o dos frases (razonamiento físico basado en lo anterior y en el apartado 1):
- **Rueda o cadena de flotadores que entran por el fondo del tanque:** para meter un flotador de volumen V por abajo hay que empujar contra la presión del agua a esa profundidad. Eso cuesta ρ·g·h·V más que en la superficie, exactamente lo que el flotador da al subir h. Y las juntas pierden agua o rozan.
- **Rueda de flotadores medio sumergida (flotadores que suben por un lado y bajan por fuera):** el lado que baja por fuera del agua pesa, y el que sube dentro del agua empuja. Pero para entrar en el agua el flotador tiene que hundirse contra su propio empuje en el punto más bajo, y en la vuelta completa todo se compensa. La rueda se queda en equilibrio.
- **Cadena de burbujas (cazos que se llenan de aire abajo):** la bomba que mete el aire abajo tiene que vencer la presión ρ·g·h, y eso cuesta como mínimo lo que el aire devuelve al subir. Además se pierde calor al comprimir. Es un sistema con pérdidas, no un generador.
- **Bolas que se encogen al bajar y se hinchan al subir (la idea del usuario):** ver el apartado 1c. La ganancia de empuje (ρ·g·ΔV·h) es exactamente igual al trabajo extra para hincharlas abajo (ρ·g·h·ΔV).
- **«Centrales de flotabilidad» o «hidro-gravitatorias» que dicen generar kW con aire comprimido y flotadores:** a lo sumo son almacenamiento de energía con pérdidas (se gasta más en el compresor que lo que se recupera). Si dicen funcionar solas, es un error o un fraude.
- **Señal de alarma práctica:** si una máquina de agua «funciona sola» pero nadie la ha medido funcionando cerrada (sin enchufe, sin batería oculta, sin rellenar) durante días, no está demostrada.

### Gaps
- No he podido confirmar casos concretos de fraude con «centrales de flotabilidad» (por ejemplo, el caso alemán Rosch AG «KPP», que conozco de forma imprecisa). La búsqueda no devolvió fuentes relevantes, así que no se debe citar sin verificar.
- No he buscado específicamente fuentes sobre «hydro-gravity» o vídeos virales concretos.

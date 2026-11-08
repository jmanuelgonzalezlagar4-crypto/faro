# Luz, oscuridad y radiación: energía para aparatos pequeños y duraderos

Notas de investigación (noviembre de 2026). Conversión de unidades usada en todo el documento:
**1 W/m² = 100 µW/cm²**; 1 mW/m² = 0,1 µW/cm². Sol pleno en superficie ≈ 1000 W/m² = 100 mW/cm².
Luz interior: 1000 lux ≈ 300 µW/cm² (3 W/m²) de potencia luminosa; 200 lux ≈ 60 µW/cm².
Nota de acceso: arxiv.org, math.ucr.edu y tarifasgasluz.com no eran accesibles desde esta sesión (red restringida); los datos de esas páginas proceden de resúmenes de búsqueda y se marcan como tales.

## 1. ¿Puede una célula usar "luz por una cara y oscuridad por la otra"? Qué necesita realmente la fotovoltaica y qué puede aportar la cara oscura

### Takeaway
Una célula fotovoltaica solo produce electricidad con fotones que le llegan (luz con energía suficiente); la "oscuridad" no aporta fotones, así que tal como se plantea es un mito. Lo que sí existe es un "primo" real: mirar a un cielo nocturno frío permite a un objeto tibio **perder** calor por radiación, y ese flujo de calor (Tierra/aire tibio → espacio frío a ~3 K) puede convertirse en electricidad mediante diodos termorradiativos o generadores termoeléctricos, pero con potencias de miles a millones de veces menores que una placa solar de día.

### Cited Findings
- El efecto de "iluminación negativa" permite obtener electricidad cuando el calor **sale** de una superficie en forma de radiación, en lugar de cuando entra luz como en una célula solar normal — [AIP Publishing (nota de prensa, 2019)](https://publishing.aip.org/publications/latest-content/experimental-device-generates-electricity-from-the-coldness-of-the-universe/); [ScienceDaily](https://sciencedaily.com/releases/2019/05/190506163646.htm)
- La "célula termorradiativa" apuntada al cielo nocturno emite infrarrojo porque está más caliente que el espacio exterior; Munday (UC Davis) la describe como "una célula solar funcionando al revés" — [UC Davis (2020)](https://www.ucdavis.edu/news/anti-solar-cells-photovoltaic-cell-works-night); [EurekAlert](https://www.eurekalert.org/news-releases/496759)
- La energía no viene de la oscuridad en sí: en el generador de Raman, Li y Fan la cara fría mira al cielo nocturno y la cara caliente la calienta el aire del entorno; es una máquina térmica que aprovecha la diferencia de temperatura — [ScienceDaily (2019)](https://www.sciencedaily.com/releases/2019/09/190912111015.htm); [TechXplore](https://techxplore.com/news/2019-09-device-cold-night-sky.html)
- En el motor Stirling nocturno de UC Davis, "el suelo actúa como lado caliente y la antena canaliza el frío del espacio"; la placa superior mira al cielo y se enfría, y la inferior queda más caliente porque la superior le tapa la vista del cielo — [Physics World (2025)](https://physicsworld.com/a/heat-engine-captures-energy-as-earth-cools-at-night/); [EurekAlert (2025)](https://www.eurekalert.org/news-releases/1105781)
- El límite teórico de la conversión termorradiativa Tierra (300 K) → espacio (3 K) es de unos 48,4 W/m² (Giteau, Picardi, Papadakis, 2025) — [arXiv 2507.19864](https://arxiv.org/pdf/2507.19864); [ResearchGate](https://www.researchgate.net/publication/396645263_Fundamental_Limitations_of_Thermoradiative_Energy_Conversion). Otro trabajo de 2025 (J. Appl. Phys.) da que el límite 300 K→3 K no puede superar 55,0 W/m² ni con infinitos diodos apilados — [OSTI](https://www.osti.gov/pages/servlets/purl/3023531); [JAP 137, 225001](https://pubs.aip.org/aip/jap/article/137/22/225001/3349227/Fundamental-advantages-of-multijunction)
- Deppe y Munday (ACS Photonics, enero 2020, artículo conceptual) estimaron hasta ~50 W/m² en condiciones ideales de noche, "aproximadamente una cuarta parte" de lo que da una placa solar de día — [UC Davis](https://www.ucdavis.edu/news/anti-solar-cells-photovoltaic-cell-works-night); [Renewable Energy World](https://www.renewableenergyworld.com/solar/anti-solar-cells-a-pv-cell-that-works-at-night/)
- Ejemplo real: Assawaworrarit et al. (2022) usaron una **célula fotovoltaica como emisor radiativo** de noche (enfriándose hacia el cielo) y obtuvieron 50 mW/m² con un termoeléctrico; es decir, la misma placa sirve de "ventana al frío" por la noche, pero la electricidad la produce el termoeléctrico, no el efecto fotovoltaico — [iScience 2022 (Omair et al.)](https://www.sciencedirect.com/science/article/pii/S2589004222011300); [PDF Stanford](https://web.stanford.edu/~llfan/projects/1-s2.0-S2589004222011300-main.pdf)

### Inferences
- Una célula fotovoltaica normal en la oscuridad se comporta como un diodo apagado: no da energía. Para que un dispositivo genere con "la cara oscura", esa cara debe estar **más caliente** que lo que ve (el cielo frío) y debe haber un camino para reponer ese calor (aire, suelo, sol del día anterior). Por eso no es perpetuo: si se nubla, hay humedad o el dispositivo se enfría hasta igualar, la potencia cae a cero.
- La oscuridad no es una fuente de energía; el "frío del cielo" es un **sumidero**. La energía real es calor ambiental (en último término, energía solar almacenada en el suelo y el aire durante el día).
- La cara oscura sí puede ayudar indirectamente a una célula iluminada: enfriarla mejora su rendimiento (las células de silicio pierden en torno a 0,3–0,5 % de rendimiento por cada °C de más; dato de conocimiento general, no verificado en esta búsqueda).
- Escala práctica: límite teórico nocturno ~50 W/m² (= 5 mW/cm²) frente a lo medido en laboratorio con diodos termorradiativos (2,26 mW/m² = 0,23 µW/cm²): unas 20.000 veces por debajo del límite.

### Gaps
- No se encontró una medición independiente de cuánto mejora el rendimiento de una célula iluminada al enfriarla radiativamente por la cara trasera en un aparato pequeño.
- No se pudo leer el artículo original de Deppe y Munday 2020 para ver las hipótesis exactas del límite de 50 W/m² (solo prensa).

## 2. Células termorradiativas / diodos de "iluminación negativa" que generan de noche radiando calor al cielo frío

### Takeaway
Son reales pero diminutas: el récord medido citado es 2,26 mW/m² (UNSW, 2022, diodo de HgCdTe) frente a límites teóricos de ~4 W/m² (para el montaje de Stanford) a ~50 W/m² (ideal). Siguen siendo experimentos de laboratorio en 2026, sin producto comercial ni versión casera viable.

### Cited Findings
- **Stanford 2019 (resultado antiguo):** Ono, Santhanam, Li, Zhao y Fan, "Experimental demonstration of energy harvesting from the sky using the negative illumination effect of a semiconductor photodiode", Applied Physics Letters, 23 abril 2019, DOI 10.1063/1.5089783 — [AIP Publishing](https://publishing.aip.org/publications/latest-content/experimental-device-generates-electricity-from-the-coldness-of-the-universe/)
  - Potencia medida ≈ **64 nW/m²** (= 6,4 billonésimas de vatio por cm²; prueba de concepto). Cifra tomada de un informe secundario, no verificada en el artículo — [EEPower](https://eepower.com/news/device-generates-electricity-from-the-coldness-of-space/)
  - Límite teórico calculado para ese caso: 3,99 W/m² con el diodo a 293 K ("casi 4 W/m²"), unas un millón de veces más que lo medido; como comparación citan placas solares de 100–200 W/m² — [AIP Publishing](https://publishing.aip.org/publications/latest-content/experimental-device-generates-electricity-from-the-coldness-of-the-universe/); [ScienceDaily](https://sciencedaily.com/releases/2019/05/190506163646.htm)
- **UNSW 2022 (Ekins-Daukes):** Nielsen et al., "Thermoradiative Power Conversion from HgCdTe Photodiodes and Their Current–Voltage Characteristics", ACS Photonics (2022). Diodo de telururo de mercurio y cadmio (MCT, material de detectores infrarrojos) que emite cerca de 4,7 µm; densidad de potencia máxima **2,26 mW/m²** con una diferencia de temperatura de solo **12,5 °C**, eficiencia radiativa estimada 1,8 % — [Compound Semiconductor](https://compoundsemiconductor.net/article/114842/Australian_team_generates_electricity_from_HgCdTe_photodiodes); [New Atlas](https://newatlas.com/energy/unsw-night-time-solar-thermoradiative); [TaiyangNews](https://taiyangnews.info/technology/unsw-produces-night-time-solar-power)
  - Ekins-Daukes: "Ahora mismo, la demostración que tenemos con el diodo termorradiativo es de potencia relativamente muy baja" — [New Atlas](https://newatlas.com/energy/unsw-night-time-solar-thermoradiative)
  - La prensa recoge que el potencial teórico sería ~1/10 de una célula solar (proyección, no medida) — [ScienceAlert](https://www.sciencealert.com/engineers-measure-the-potential-of-a-new-kind-of-solar-cell-fueled-by-the-night)
  - Discrepancia: ScienceAlert describe el 2,26 mW/m² como de un detector MCT "calentado a ~20 °C"; la fuente técnica y el trabajo de conferencia de UNSW lo enmarcan como medida termorradiativa — [ScienceAlert](https://www.sciencealert.com/engineers-measure-the-potential-of-a-new-kind-of-solar-cell-fueled-by-the-night); [APVI, Sazzad (UNSW, 2023)](https://apvi.org.au/solar-research-conference/wp-content/uploads/2023/12/Sazzad-M-Power-extraction-from-a-thermoradiative-operation-and-its-possible-applications.pdf)
- **Límites teóricos (2025):** 300 K→3 K ≈ 48,4 W/m² (Giteau et al., PRX Energy) — [arXiv 2507.19864](https://arxiv.org/pdf/2507.19864); ≤55,0 W/m² incluso con infinitos diodos (J. Appl. Phys. 2025); para un emisor a 500 K frente a receptor a 300 K, apilar uniones sube de 234 a 258 W/m² — [JAP](https://pubs.aip.org/aip/jap/article/137/22/225001/3349227/Fundamental-advantages-of-multijunction); [OSTI](https://www.osti.gov/pages/servlets/purl/3023531)
- **Estado 2025–2026:** la literatura reciente es casi toda teoría y simulación (p. ej., una simulación de 2026 de pila de combustible de carbonatos fundidos + convertidor termorradiativo de campo cercano a 923 K: 0,310 W/cm², 41,7 % — calor industrial, no cielo nocturno). No se encontró un nuevo récord **medido** para cielo nocturno después de 2022 — [Renewable & Sustainable Energy Reviews 2026 (revisión)](https://www.sciencedirect.com/science/article/abs/pii/S1364032126001851); [Academia.edu (resumen)](https://www.academia.edu/128993802/Semiconductor_thermoradiative_power_conversion)
- Hay interés para aplicaciones espaciales (recuperación de calor residual) — [1-ACT, Thermo-Radiative Cell (2023)](https://www.1-act.com/wp-content/uploads/2023/05/Thermo-Radiative-Cell-A-New-Waste-Heat-Recovery-Technology-for-Space-Power-Applications.pdf)

### Inferences
- En unidades del usuario: 2,26 mW/m² = **0,23 µW/cm²**; una célula de 10 cm² daría ~2,3 µW en el mejor caso de laboratorio, y eso con un diodo infrarrojo caro de HgCdTe. 64 nW/m² = 6,4 pW/cm².
- **¿Casero?** No. Requiere fotodiodos infrarrojos de HgCdTe (material tóxico y de laboratorio), medidas muy finas y control térmico. **¿Real o mito?** Real (física confirmada y medida), pero hoy sin utilidad práctica.
- Duración: el principio funcionaría mientras haya diferencia de temperatura con el cielo (noches despejadas y secas); no hay datos de ningún dispositivo funcionando durante años.

### Gaps
- No se encontró ningún resultado experimental de 2023–2026 que supere los 2,26 mW/m² con cielo nocturno; puede existir sin haber aparecido en las búsquedas.
- La cifra de 64 nW/m² de Stanford solo aparece en una fuente secundaria.

## 3. Enfriamiento radiativo al cielo + generador termoeléctrico (y motor Stirling)

### Takeaway
Es la forma más madura de "sacar electricidad de la noche": de 25 mW/m² (Joule 2019, encendió un LED) a 50 mW/m² (2022), >100 mW/m² (2022) y un récord de **350 mW/m²** sostenidos (preprint 2024, Stanford). Un motor Stirling nocturno de UC Davis (Science Advances, nov. 2025) dio ≥400 mW/m² de potencia mecánica durante un año de pruebas. Todo depende de cielos despejados y secos; se puede hacer una versión casera rudimentaria con un módulo Peltier, pero da miliwatios por cada palmo cuadrado.

### Cited Findings
- **Raman, Li, Fan, "Generating Light from Darkness", Joule 3(11):2679–2686 (2019), DOI 10.1016/j.joule.2019.08.009 (resultado antiguo):**
  - Emisor: disco de aluminio de 200 mm pintado con pintura negra comercial, acoplado a la cara fría de un módulo termoeléctrico; la cara caliente la calienta el aire — [Sci.News](https://www.sci.news/technologies/thermoelectric-device-light-darkness-space-07591.html); [ScienceDaily](https://www.sciencedaily.com/releases/2019/09/190912111015.htm)
  - ~**0,8 mW** en el punto de máxima potencia = **25 mW/m²** normalizado al área del emisor; encendió directamente un LED, estimado al ~10 % de su brillo máximo — [ScienceDaily](https://www.sciencedaily.com/releases/2019/09/190912111015.htm); [TechXplore](https://techxplore.com/news/2019-09-device-cold-night-sky.html)
  - Probado en una azotea de Stanford con cielo invernal despejado; medido durante unas 6 horas; componentes baratos y comerciales — [TechXplore](https://techxplore.com/news/2019-09-device-cold-night-sky.html)
- **Assawaworrarit et al. (2022), APL:** 50 mW/m² usando una célula fotovoltaica como emisor radiativo nocturno — citado en [iScience 2022](https://www.sciencedirect.com/science/article/pii/S2589004222011300)
- **Omair, Assawaworrarit, L. Fan, Jin, S. Fan, iScience (2022):** >100 mW/m² de noche, ">2 veces" lo anterior, optimizando la relación entre el área del emisor y la resistencia térmica del termoeléctrico — [iScience/ScienceDirect](https://www.sciencedirect.com/science/article/pii/S2589004222011300); [PubMed](https://ncbi.nlm.nih.gov/pubmed/35996585); [PDF Stanford](https://web.stanford.edu/~llfan/projects/1-s2.0-S2589004222011300-main.pdf)
- **Récord: Assawaworrarit, Zhou, L. Fan, S. Fan, "Record nighttime electric power generation at a density of 350 mW/m² via radiative cooling", arXiv:2407.17751 (25 julio 2024):** **350 mW/m² sostenidos** a partir de la radiación térmica del calor ambiental hacia el universo frío, mediante ajuste del espectro, menos fugas de calor parásitas y conversión calor-electricidad eficiente; ~**1000 mW/m²** si se añade una fuente de calor o almacenamiento térmico por encima de la temperatura ambiente — [SSRN](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4897855); [arXiv](https://arxiv.org/abs/2407.17751). No se pudo confirmar publicación en revista revisada por pares (solo preprint encontrado).
- **Otro sistema (2026, Solar Energy):** generador termoeléctrico "todo el día" con modulación radiativa adaptativa: máximo nocturno de **61,07 mW/m²** (septiembre). Muestra que en sistemas reales sin la optimización de Stanford las cifras son de decenas de mW/m² — [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0038092X26001994)
- **Motor Stirling nocturno: Deppe y Munday (UC Davis), "Mechanical power generation using Earth's ambient radiation", Science Advances 11(46), 12 nov. 2025, DOI 10.1126/sciadv.adw6833:**
  - Motor Stirling de pistón sobre un panel-antena que radia al cielo; tras **un año de pruebas nocturnas** produjo **al menos 400 mW/m² de potencia mecánica**; movió un ventilador directamente y un pequeño motor eléctrico para generar corriente — [EurekAlert](https://www.eurekalert.org/news-releases/1105781); [Physics World](https://physicsworld.com/a/heat-engine-captures-energy-as-earth-cools-at-night/); [Interesting Engineering](https://interestingengineering.com/innovation/stirling-engine-space-cooling-night-power)
  - La diferencia de temperatura se mantuvo **por encima de 10 °C la mayoría de los meses**; el rendimiento bajó con humedad alta y nubes; mejor en zonas secas de cielos despejados; los autores lo presentan como complemento de la solar; UC Davis presentó una patente provisional — [Interesting Engineering](https://interestingengineering.com/innovation/stirling-engine-space-cooling-night-power); [Physics World](https://physicsworld.com/a/heat-engine-captures-energy-as-earth-cools-at-night/)
  - Fecha: algunas fuentes lo sitúan en febrero de 2026 por la nota de ScienceDaily (27 feb 2026), pero la cita (vol. 11, n.º 46) corresponde a noviembre de 2025 — [ScienceDaily](https://sciencedaily.com/releases/2026/02/260226042456.htm)

### Inferences
- En µW/cm²: 25 mW/m² = 2,5 µW/cm²; 100 mW/m² = 10 µW/cm²; 350 mW/m² = **35 µW/cm²**; Stirling 400 mW/m² = 40 µW/cm² (mecánicos, antes de pasar a electricidad). Curiosamente, el récord nocturno por unidad de área es del mismo orden que una célula de silicio amorfo con luz de oficina (8 µW/cm² a 200 lux; ver sección 4), pero solo funciona de noche, con cielo despejado y seco, y con un montaje voluminoso (aislamiento, disco emisor, disipador).
- **¿Casero?** Sí, de forma rudimentaria: módulo Peltier/termoeléctrico barato + placa de aluminio pintada mirando al cielo + aislamiento + lado caliente en contacto con el aire o el suelo, copiando el montaje de Raman (0,8 mW con un disco de 20 cm). El voltaje es muy bajo (milivoltios a cientos de milivoltios) y suele necesitarse un convertidor elevador de arranque a baja tensión (conocimiento general, no verificado aquí). Esperable en casa: décimas de mW a ~1 mW por cada 0,03 m², solo en noches claras.
- **¿Real o mito?** Real, medido y repetido por varios grupos. **Duración:** el Stirling de UC Davis funcionó un año de noches; no hay ejemplos de aparatos alimentados así durante años.
- La energía no es "de la oscuridad": es calor del aire/suelo que fluye hacia el cielo frío. Si el día anterior fue soleado el suelo está más caliente y hay más diferencia.

### Gaps
- No se confirmó si el récord de 350 mW/m² está ya publicado en revista ni las condiciones exactas (lugar, humedad, temperatura del cielo) porque arxiv.org no era accesible.
- No hay datos de rendimiento para versiones de pocos cm² (las fugas de calor laterales probablemente dominan a escala pequeña).

## 4. Fotovoltaica interior y de baja luz (silicio amorfo, sensibilizada por colorante, perovskita): µW/cm² a 200–1000 lux y aparatos que funcionan años

### Takeaway
La luz interior es una fuente pequeña pero real y probada: una célula comercial de silicio amorfo da ~8 µW/cm² a 200 lux; las perovskitas de laboratorio alcanzan 36–42 % de eficiencia a 1000 lux (~112 µW/cm²). Con microvatios bastan para calculadoras (desde ~60 µW o menos) y relojes Citizen Eco-Drive (desde 1976; hoy hasta 365–540 días de reserva). Es la opción más fiable y fácil de hacer en casa.

### Cited Findings
- **Potencia luminosa de referencia:** condiciones interiores estándar 1000 lux ≈ 300 µW/cm² — [revisión de materiales sin plomo (SciLTP)](https://media.sciltp.com/articles/2601002787/2601002787.pdf); [ACS Energy Letters 2025](https://pubs.acs.org/aelccp/article/10/7/3415/3757581/Surpassing-the-10-Efficiency-Threshold-in) (la cifra aparece en una revisión de materiales sin plomo; atribución exacta entre estas dos no verificada)
- **Panasonic Amorton (silicio amorfo, comercial):** AMG-1401C y AMG-1701C, sobre vidrio, 1,1 mm de grosor, ~**8 µW/cm² a 200 lux** — [eeNews Europe](https://www.eenewseurope.com/en/panasonic-boosts-efficiency-of-indoor-solar-cells/); [Electronics For You](https://www.electronicsforu.com/news/efficient-indoor-solar-cells-with-mirror-like-black-surface)
  - AMG-1401C (41,4 × 26,1 mm): máximo **77,8 µW a 200 lux**, tensión 2,2 V — [eeNews Europe](https://www.eenewseurope.com/en/panasonic-boosts-efficiency-of-indoor-solar-cells/)
  - Listado de distribuidor: AMG-1701C "22,6 µA, 48,3 × 26,1 mm" — [element14](https://my.element14.com/panasonic/amg-1701c/solar-cell-22-6ua-48-3-x-26-1/dp/4531801)
  - Nueva serie con electrodos más finos y ~20 % de eficiencia en interior — [eeNews Europe](https://cdn.eenewseurope.com/en/thinner-electrodes-and-20-efficiency-for-amorton-indoor-solar-cells/); [Panasonic Industry (línea interior)](https://na.industrial.panasonic.com/products/sensors/amorphous-silicon-solar-cells/lineup/indoor-solar-cells/series/138331)
- **Perovskita interior (laboratorio, 2025):**
  - National Science Review 2025: **42,01 %** a 1000 lux (LED 3000 K), Voc 1,07 V, FF 84,22 %; **33,87 %** en dispositivo de 1 cm² — [NSR](https://academic.oup.com/nsr/article/12/8/nwaf242/8161003); [EurekAlert](https://www.eurekalert.org/news-releases/1094508)
  - UCL (Advanced Functional Materials, 2025): **37,6 %** a 1000 lux, récord para perovskita de banda ancha 1,75 eV, enfocado en estabilidad — [TechXplore (ago. 2025)](https://techxplore.com/news/2025-08-generation-solar-cells-harvest-indoor.html); [PMC (comentario sobre estabilidad)](https://pmc.ncbi.nlm.nih.gov/articles/PMC12586989/)
  - Penn State / North Carolina Central: **36,2 %** a 1000 lux, **112,2 µW/cm²** de potencia máxima, área 0,093 cm² — [Perovskite-Info](https://www.perovskite-info.com/higher-efficiency-indoor-perovskite-photovoltaics-bandgap-solvent-and-passivation-engineering); [SpaceDaily](https://spacedaily.com/new-perovskite-solar-cells-achieve-record-indoor-light-efficiency-999/)
  - Una revisión afirma que las perovskitas de haluro de plomo han superado el 44 % a 1000 lux (no verificado con fuente primaria) — [RSC, Progress in perovskite indoor photovoltaics](https://pubs.rsc.org/el/article/2/3/537/1232450/Progress-in-perovskite-indoor-photovoltaics)
  - Las eficiencias dependen del tipo de luz (LED vs fluorescente), temperatura de color y área; los récords son en áreas muy pequeñas.
- **Exeger Powerfoyle (célula sensibilizada por colorante, comercial):** usada en auriculares (Urbanista Los Angeles) y un casco inteligente; la empresa habla de autonomía "infinita"/"prolongada o incluso ilimitada"; su CPO dijo que en pruebas diarias el producto "nunca se quedó sin batería" (anécdota, no medida); anunció +20 % de eficiencia en una nueva hoja de datos (sin cifras absolutas en las fuentes) — [Exeger](https://exeger.com/press-release/exeger-unveils-20-increase-in-efficiency-for-powerfoyle-indoor-solar-cell); [New Electronics](https://newelectronics.co.uk/content/features/eternal-battery-life); [Silicon Canals](https://siliconcanals.com/news/startups/swedish-startup-bags-e31-2m/); apoyo público sueco en dic. 2025 — [pv magazine](https://www.pv-magazine.com/2025/12/03/sweden-backs-indoor-solar-cell-technology/)
- **Calculadoras solares:** una patente describe una calculadora cuyo consumo puede bajar a **~60 µW** con LCD y CMOS de bajo consumo, funcionando a ~**150 lux** de luz fluorescente con una pequeña célula de selenio — [USPTO, patente 4264962](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/4264962). Otra fuente da consumos de "solo unos pocos microvatios" — [EngineerFix](https://engineerfix.com/do-calculators-actually-have-solar-panels/). Usan silicio amorfo de ~6–7 % de eficiencia, elegido por su buen comportamiento con poca luz; muchas llevan pila de respaldo no recargable; un blog comercial estima 5–15 años de vida útil (dato comercial, no medido) — [SolarSquare](https://www.solarsquare.in/blog/what-is-a-solar-calculator/); [Dercuano](https://dercuano.github.io/notes/solar-computer.html)
- **Citizen Eco-Drive:** el Citizen Quartz Crystron Solar Cell (1976) fue el primer reloj analógico alimentado por luz (prototipo en 1974 según una fuente) — [Citizen Europa](https://citizenwatch.eu/en/eco-drive-technology/); [Coronet](https://www.coronet.org/new-1minute-reads/powered-by-light-citizens-eco-drive-history)
  - 1986: reserva de 8 días; 1995: se añadió una celda secundaria de iones de litio → **6 meses o más** de marcha con carga completa — [Coronet](https://www.coronet.org/new-1minute-reads/powered-by-light-citizens-eco-drive-history); [Citizen soporte](https://support.citizenwatch.com/hc/en-us/articles/360007744914-What-is-Eco-Drive)
  - Calibre E365: **365 días** de reserva; un Promaster de 2017 con 540 días (fuente patrocinada) — [aBlogtoWatch (patrocinado)](https://www.ablogtowatch.com/citizen-achieves-greater-sustainability-with-its-most-advanced-eco-drive-watch-yet/)
  - Hay discrepancia sobre cuándo nació el nombre "Eco-Drive" (1986 según Citizen; años 90 según Coronet).

### Inferences
- Eficiencia implícita del Amorton a 200 lux: 8 µW/cm² ÷ ~60 µW/cm² de luz ≈ 13 % (estimación propia).
- Corriente estimada AMG-1401C a 200 lux: 77,8 µW ÷ 2,2 V ≈ 35 µA (cálculo propio).
- **¿Casero?** Sí, es lo más fácil: una célula de calculadora o de lámpara de jardín + supercondensador o batería + circuito de muy bajo consumo (reloj, sensor). **¿Real o mito?** Totalmente real y comercial desde los años 70.
- **Duración demostrada:** relojes Eco-Drive y calculadoras solares funcionan años; la limitación suele ser el envejecimiento de la batería/condensador y del LCD, no de la célula.

### Gaps
- No se encontraron cifras de µW/cm² absolutas para Exeger Powerfoyle ni mediciones independientes de "nunca cargar".
- No se encontró fuente fiable que documente calculadoras o Eco-Drive concretos funcionando "décadas" (es plausible, pero no verificado); tampoco el consumo exacto de un movimiento Eco-Drive (del orden de microvatios según conocimiento general).
- No hay datos de estabilidad a varios años para perovskitas interiores en uso real.

## 5. El radiómetro de Crookes: qué lo hace girar, cuánta potencia y por qué no es perpetuo

### Takeaway
Gira por efectos térmicos del poco gas que queda dentro (transpiración térmica/"thermal creep", fuerzas en los bordes de las aspas), no por la presión de la luz; si fuera la presión de la luz giraría al revés. Su energía es la luz absorbida convertida en calor; se para al quitar la luz y gira al revés si se enfría. La potencia útil es despreciable (no se encontró una cifra).

### Cited Findings
- Crookes atribuyó al principio el giro a la presión de radiación; Lebedev (1901) mostró que solo funciona con gas a baja presión dentro de la bombilla y que en vacío alto las aspas no se mueven — [Physics FAQ (Baez)](https://math.ucr.edu/home/baez/physics/General/LightMill/light-mill.html) (vía resumen de búsqueda; la página no fue accesible desde esta sesión); [Swarthmore Physics Demos](https://demos.swarthmore.edu/physics/tag/radiometer/)
- Si fuera la presión de la luz, la cara brillante (que refleja y recibe el doble de empuje) haría girar el molinete en sentido contrario al observado — [Physics FAQ (Baez)](https://math.ucr.edu/home/baez/physics/General/LightMill/light-mill.html); [UT Austin, "Light Mills"](https://classes.golem.ph.utexas.edu/category/2008/07/light_mills.html)
- Reynolds (1879) introdujo la **transpiración térmica**: flujo de gas a través de placas porosas causado por la diferencia de temperatura entre sus caras; también llamada "thermal creep" — [Physics FAQ (Baez)](https://math.ucr.edu/home/baez/physics/General/LightMill/light-mill.html); [revisión KIT](https://publikationen.bibliothek.kit.edu/1000033923/2579250)
- Explicación del "efecto borde": las moléculas más rápidas del lado caliente golpean oblicuamente los bordes de las aspas con más fuerza que las del lado frío — [Physics FAQ (Baez)](https://math.ucr.edu/home/baez/physics/General/LightMill/light-mill.html)
- Si se enfría (p. ej., con hielo), gira al revés (observación de un usuario en la discusión de Wikipedia; fuente débil) — [Wikipedia, Talk:Crookes radiometer](https://en.wikipedia.com/wiki/Talk:Crookes_radiometer)
- Los detalles (fuerza en bordes vs caras, sentido de la fuerza tangencial del "thermal creep") siguen discutidos en la literatura — [revisión KIT](https://publikationen.bibliothek.kit.edu/1000033923/2579250)

### Inferences
- Fuente real de energía: la luz (sobre todo infrarroja y visible) absorbida por la cara negra, que se calienta; es una pequeña máquina térmica. No es perpetuo: sin luz/diferencia de temperatura se para; el rozamiento consume la energía.
- **¿Casero?** Se compra como juguete; fabricarlo requiere vacío parcial. No sirve para alimentar nada: su par es minúsculo y cualquier carga lo detiene.
- **¿Real o mito?** El giro es real; la explicación popular ("lo mueve la presión de la luz") es un mito.

### Gaps
- No se encontró ninguna medida publicada de la potencia mecánica de un radiómetro de Crookes ni de la presión interna óptima (en la literatura se suele citar del orden de pascales, no verificado aquí).

## 6. Presión de la luz (velas solares) y materiales fototérmicos/fotomecánicos (actuadores poliméricos movidos por luz) a pequeña escala

### Takeaway
La presión de la luz es real pero ínfima: ~9 µN/m² con sol pleno y vela perfectamente reflectante (≈0,9 nN por cm²); útil solo en el vacío del espacio (IKAROS, 2010: 1,12 mN sobre 196 m²). Los polímeros de cristal líquido con azobenceno y los elastómeros pueden oscilar solos bajo luz constante (incluso luz solar), pero son de laboratorio y no se encontraron cifras de potencia ni eficiencia.

### Cited Findings
- Presión de radiación a 1 UA (Tierra): **9,08 µN/m²** para superficie perfectamente reflectante; **4,54 µN/m²** si la absorbe por completo; basada en ~1361 W/m² de luz solar — [Simple Wikipedia, Solar sail](https://simple.wikipedia.com/wiki/Solar_sail)
- IKAROS (JAXA): empuje medido por presión de radiación de **1,12 mN** sobre una vela de **196 m²** (9 julio 2010), deducido por seguimiento Doppler — [NBC News (2010)](https://www.nbcnews.com/news/amp/wbna38222268); [Wikiwand, IKAROS](https://www.wikiwand.com/en/articles/IKAROS)
- **Kumar et al., Nature Communications 7:11975 (2016):** película de polímero de cristal líquido dopada con azobenceno fluorado que oscila de forma caótica y autosostenida bajo luz solar ambiental (sin lente); necesita iluminación simultánea azul y verde; trabajos anteriores requerían enfocar la luz con lente — [PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4932179/); [TU Eindhoven](https://research.tue.nl/en/publications/a-chaotic-self-oscillating-sunlight-driven-polymer-actuator/)
- **Oscilador de muelle de elastómero de cristal líquido (2022):** autooscilación continua bajo iluminación constante gracias a recubrimientos autosombreantes; depende de la intensidad de luz y de la constante del muelle (estudio teórico/modelo) — [PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9028186/)
- **Cintas de Möbius de elastómero (Nature Communications, 2021):** se mueven de forma continua bajo actuación fototérmica mientras están iluminadas — [DOAJ](https://doaj.org/article/e3ad6bc2ea21420280ce56875eec543c)

### Inferences
- Cálculo propio: sobre 1 cm² a pleno sol, 9,08 µN/m² × 10⁻⁴ m² ≈ **0,9 nN** (menos que el peso de una mota de polvo grande). Si esa aspa se moviera a 1 cm/s, la potencia sería ~10⁻¹¹ W. En una casa, con aire, las corrientes de convección y el calentamiento superan millones de veces a la presión de la luz.
- La "energía" de estos actuadores es luz convertida en calor o en cambios de forma molecular; dejan de moverse sin luz. No son perpetuos.
- **¿Casero?** Presión de la luz: no medible sin vacío y balanzas de torsión. Polímeros fotomecánicos: materiales de laboratorio; una alternativa casera "visible" serían tiras bimetálicas o de plástico que se curvan al calentarse al sol (conocimiento general).
- **¿Real o mito?** Ambos reales; ninguno es una fuente útil de electricidad para un aparato pequeño en la Tierra.

### Gaps
- No se encontraron cifras de eficiencia de conversión ni potencias (µW) de actuadores fotomecánicos.

## 7. Ciclo día/noche: qué potencia continua puede mantener un aparato con unos cm² de célula y almacenamiento

### Takeaway
Con almacenamiento (batería o supercondensador), una célula de ~5 cm² puede sostener de forma continua unos **10–30 µW en interior** (silicio amorfo, luz de oficina/casa) y del orden de **10 mW al aire libre** como media anual en España (orientada al sol, sin sombras), con mucha menos energía en invierno o días nublados. Las fuentes "nocturnas" (cielo frío) dan hoy entre 0,2 y 35 µW/cm² solo de noche despejada, por lo que como mucho complementan.

### Cited Findings
- 1 "hora solar pico" equivale a 1 kWh/m² de energía diaria — [Endesa](https://www.endesa.com/en/blogs/endesa-s-blog/light/peak-sun-hour-what-it-is-how-it-is-calculated)
- España recibe de media unas **5,3 horas solares pico** y una irradiación anual de ~**1700 kWh/m²** (≈4,6 kWh/m²/día), variando por provincia y estación; otra fuente da 4,1–5,7 kWh/m²/día de radiación directa (hasta 6,0 en Cádiz y Canarias) — fuentes secundarias en la búsqueda: [tarifasgasluz.com](https://tarifasgasluz.com/autoconsumo/energia-solar/horas-sol); [IFEMA](https://www.ifema.es/global-mobility-call/noticias-sector/el-potencial-de-la-energia-solar-en-espana); [aenert](https://aenert.com/es/paises/europa/espana/) (atribución exacta de cada cifra a cada página no verificada; tarifasgasluz no era accesible)
- Silicio amorfo comercial: ~8 µW/cm² a 200 lux — [eeNews Europe](https://www.eenewseurope.com/en/panasonic-boosts-efficiency-of-indoor-solar-cells/)
- Perovskita de laboratorio: 112,2 µW/cm² a 1000 lux — [Perovskite-Info](https://www.perovskite-info.com/higher-efficiency-indoor-perovskite-photovoltaics-bandgap-solvent-and-passivation-engineering)
- Nocturno con cielo frío: 2,26 mW/m² (termorradiativo, 2022); 25 mW/m² (TEG, 2019); 350 mW/m² (TEG, récord 2024 preprint); ≥400 mW/m² mecánicos (Stirling, 2025) — ver secciones 2 y 3: [Compound Semiconductor](https://compoundsemiconductor.net/article/114842/Australian_team_generates_electricity_from_HgCdTe_photodiodes); [ScienceDaily](https://www.sciencedaily.com/releases/2019/09/190912111015.htm); [SSRN](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4897855); [Physics World](https://physicsworld.com/a/heat-engine-captures-energy-as-earth-cools-at-night/)
- Consumos de referencia: calculadora ~60 µW o menos — [USPTO 4264962](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/4264962); reloj Eco-Drive: 6 meses a 1 año de reserva con carga completa — [Coronet](https://www.coronet.org/new-1minute-reads/powered-by-light-citizens-eco-drive-history); [aBlogtoWatch](https://www.ablogtowatch.com/citizen-achieves-greater-sustainability-with-its-most-advanced-eco-drive-watch-yet/); LED encendido al ~10 % con 0,8 mW — [TechXplore](https://techxplore.com/news/2019-09-device-cold-night-sky.html)

### Inferences
Cálculos propios (suponiendo 75 % de eficiencia de carga/descarga del almacenamiento y luz interior 10 h/día):

| Escenario (célula de 5 cm²) | Potencia mientras hay luz | Media continua 24 h (aprox.) |
|---|---|---|
| Interior, silicio amorfo, 200 lux (casa) | 5 × 8 = 40 µW | 40 × 10/24 × 0,75 ≈ **12 µW** |
| Interior, silicio amorfo, ~500 lux (oficina; escalado lineal) | ~100 µW | ≈ **30 µW** |
| Interior, perovskita de laboratorio, 1000 lux | 5 × 112 = 560 µW | ≈ **175 µW** (sin estabilidad probada a años) |
| Exterior, España media anual 4,6 kWh/m²/día = 192 W/m² de media = 19,2 mW/cm²; célula de 15 % | pico ~75 mW a pleno sol | 19,2 × 0,15 × 5 × 0,75 ≈ **11 mW** |
| Noche despejada, TEG récord 350 mW/m² (35 µW/cm²) | ~175 µW solo de noche | ~70 µW si fuera 50 % del tiempo y siempre despejado (optimista; difícil a escala de cm²) |
| Noche, termorradiativo 2,26 mW/m² | ~1,1 µW | <0,5 µW |

- Qué se puede alimentar de forma continua: ~1–10 µW → reloj de cuarzo, calculadora LCD, sensor que despierta de vez en cuando; ~100 µW–1 mW → microcontrolador durmiendo con mediciones/radio ocasionales, LED indicador con destellos; ~10 mW → un LED pequeño encendido tenue de forma continua (exterior, media anual; en invierno puede caer a la mitad o menos y en días seguidos nublados hay que tirar de reserva).
- La regla para "aparato que dura años": dimensionar la célula para el peor mes (diciembre) y el almacenamiento para varios días sin luz; la vida útil la limita normalmente la batería (ciclos, envejecimiento), no la célula.
- Comparación clave para el usuario: la luz (incluso la de una bombilla) da de 10 a 1000 veces más por cm² que el "frío del cielo" con la tecnología medida hasta 2026, salvo el récord de laboratorio de 350 mW/m², que solo iguala a la luz tenue interior y únicamente de noche despejada.

### Gaps
- No se encontraron datos de la irradiación de diciembre por ciudad en España ni de la NREL; las cifras de España son de fuentes secundarias.
- La escala lineal de lux a potencia es aproximada (depende del espectro de la lámpara); las horas de luz interior (10 h/día) y la eficiencia del almacenamiento (75 %) son supuestos, no datos citados.

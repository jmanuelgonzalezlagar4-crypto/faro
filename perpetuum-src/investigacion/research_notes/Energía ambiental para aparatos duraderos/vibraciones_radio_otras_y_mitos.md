# Vibraciones, movimiento, radio y otras energías del entorno para aparatos pequeños, y mitos de la «energía libre»

> Notas de investigación (noviembre de 2026). Muchas cifras de referencia son antiguas (Roundy 2002–2005, Perpetuum 2011, encuesta de Londres 2013); se marcan como tales. Desde esta sesión no se pudo abrir en.wikipedia.org (el dominio no está permitido en la red); lo que se cita de Wikipedia viene de fragmentos de búsqueda, no de la página leída entera.
> Unidades: 1 mW = 1 000 µW; 1 µW = 1 000 nW. 1 µJ = energía de 1 µW durante 1 segundo. Una pila de botón CR2032 guarda del orden de 2 000–2 500 J (≈225 mAh × 3 V; cifra aproximada de conocimiento general, no verificada aquí).

## 1. Vibraciones y movimiento (piezoeléctricos y electromagnéticos): densidades de potencia y productos reales (EnOcean, Perpetuum, relojes Kinetic y automáticos)

### Takeaway
La vibración de máquinas da del orden de 100–375 µW por cm³ de recolector (cifra clásica de 2002–2005) y, en el mejor caso comercial (Perpetuum en vagones de tren), unos 10 mW de media; el movimiento de la muñeca solo da 0,5–5 µW, y pulsar un interruptor EnOcean da 120–210 µJ por pulsación, lo justo para enviar 3 mensajes de radio. Todo es real, pero la energía siempre viene de algo que ya se mueve (un motor, un tren, tu dedo, tu brazo).

### Cited Findings
**Densidades de potencia (laboratorio y revisiones)**
- Roundy y colegas (2002) calcularon que de fuentes de vibración comunes deberían poder sacarse «del orden de 100 µW/cm³». [Roundy et al., IMECE 2002](https://iss.mech.utah.edu/wp-content/uploads/sites/103/2012/10/vibration_electricity_IMECE_2002.pdf)
- En la misma tabla de 2002, como comparación: sol exterior directo ≈15 000 µW/cm² (15 mW/cm²), día nublado ≈150 µW/cm², escritorio de oficina con luz interior ≈6 µW/cm²; ruido acústico ≈0,003 µW/cm³ a 75 dB y ≈0,96 µW/cm³ a 100 dB. [Roundy et al., IMECE 2002](https://iss.mech.utah.edu/wp-content/uploads/sites/103/2012/10/vibration_electricity_IMECE_2002.pdf)
- Una tesis que reproduce la tabla de Roundy et al. (2002) da 200 µW/cm³ para vibraciones; la tabla de Roundy de 2005 (Pervasive Computing) da 375 µW/cm³ para vibraciones y 40 µW/cm³ para una diferencia de temperatura de 5 °C (otra tabla da 15 µW/cm³ con gradiente de 10 °C: las tablas no coinciden). [Tesis en Scribd](https://www.scribd.com/doc/63515629/Shad-Thesis); [Roundy, Pervasive Computing 2005](https://iss.mech.utah.edu/wp-content/uploads/sites/103/2012/10/PervasiveComputing-Roundy-2005.pdf); [Roundy, Computer Communications 2003](https://iss.mech.utah.edu/wp-content/uploads/sites/103/2012/10/ComputerCommunications-Roundy-2003.pdf)
- Una revisión de recolectores piezoeléctricos, electromagnéticos e híbridos (International Journal of Energy Research, 2020) dice que los electromagnéticos pueden llegar hasta 778,01 µW/cm³ y los híbridos dan entre 35,43 y 4 900 µW; según esa revisión, los híbridos son los de mayor densidad. [Revisión, Int. J. Energy Research (doi 10.1002/er.5643)](https://zendy.io/title/10.1002/er.5643); [HBKU](https://elmi.hbku.edu.qa/en/publications/vibration-based-piezoelectric-electromagnetic-and-hybrid-energy-h/)
- Otra revisión para IoT resume que estos dispositivos producen «de unas decenas de µW a cientos de µW». [Griffith (repositorio)](https://research-repository.griffith.edu.au/server/api/core/bitstreams/c42e02c3-70b1-4045-bf4a-d09fbb795792/content)

**EnOcean (interruptores sin pilas que se alimentan con la propia pulsación)**
- PTM 215: un generador «electrodinámico» (imán y bobina) se acciona con un arco/balancín; al pulsar se recoge energía y se envía un telegrama de radio con el ID del módulo; recorrido 1,8 mm y fuerza típica 9 N. [DigiKey, PTM 215U](https://www.digikey.com/en/product-highlight/e/enocean/ptm-215u-pushbutton-transmitter-module); [Mouser, PTM215](https://www.mouser.ca/enocean-ptm215-ptm215b-modules)
- Convertidor ECO 200 (el «generador de pulsación» de EnOcean): salida de 120–210 µJ a 2 V por accionamiento; cada accionamiento basta para enviar 3 subtelegramas de radio; más de 300 000 ciclos a 25 °C. Está en fin de vida; su sucesor es el ECO 260. [Hoja de datos ECO 200 (Farnell, 2021)](https://www.farnell.com/datasheets/3775943.pdf); [RS](https://docs.rs-online.com/80d0/0900766b8123eb69.pdf)
- El white paper de EnOcean confirma: con 120 µWs (= µJ) se pueden transmitir tres telegramas por accionamiento. [EnOcean White Paper v3.0](https://www.enocean.com/wp-content/uploads/redaktion/pdf/white_paper/WhitePaper_EnOcean_Product_Integration_v3.0.pdf)
- Curiosidad: la revista de clientes de EnOcean se llama «perpetuum». [perpetuum 01/2016](https://perpetuum.enocean.com/wp-content/uploads/2020/03/perpetuum_01_2016_EN.pdf)

**Perpetuum (vibración de trenes; datos de 2011, material comercial)**
- En pruebas, la vibración de las ruedas del tren bastó para que el recolector diera «decenas de mW», suficiente para sensores del estado de los rodamientos. [SensorTips](https://www.sensortips.com/featured/vibration-energy-harvester-powers-train-sensors/); [Fierce Electronics](https://www.fierceelectronics.com/components/train-wheel-bearing-monitoring-from-perpetuum)
- Presentación de Perpetuum (2011): potencia media de 10 mW durante una hora en un vagón; el punto de montaje cambia mucho la potencia. [Perpetuum, EH Network 2011](https://eh-network.org/events/dissemination2011/pitches/Perpetuum.pdf)
- La serie PMG Rail está optimizada para vibraciones de 30–60 Hz y da una tensión de salida ajustada en fábrica de 3–10 V. [Mass Transit](https://www.masstransitmag.com/rail/press-release/10452921/perpetuum-perpetuum-pmg-rail-vibration-energy-harvesters-for-rail-vehicles-are-the-enabling-technology-for-a-new-generation-of-train-monitoring)
- Comparación académica: una tesis de Exeter (2024) logra 7,3 mW de media con señales reales de vibración ferroviaria (pico de 568 mW) y dice que los piezoeléctricos ferroviarios previos daban «cientos de µW». [Exeter, tesis 2024](https://ore.exeter.ac.uk/repository/handle/10871/136156)
- Politecnico di Torino: recolector en vagón de mercancías, 2,5 V y 50 mA a 80 km/h ≈100 mW. [POLITO](https://iris.polito.it/handle/11583/2498018)

**Relojes Kinetic (Seiko) y automáticos**
- Seiko Kinetic: una masa oscilante mueve un tren de engranajes (~1:100) que hace girar un microrotor de samario-cobalto del generador hasta ~60 000 rpm (algunas fuentes secundarias dicen 100 000 rpm); la electricidad se rectifica y se guarda. [Uhrzeit.org](https://watches.uhrzeit.org/watches/seiko/kinetic-watches); [Bulsuk (2026)](https://www.bulsuk.com/2026/07/will-watch-winder-charge-seiko-kinetic.html)
- Medida real: un Kinetic llevado 8 horas dio una potencia mediana de 0,5 µW entre los voluntarios; la estimación de media diaria es de ≈5 µW. [Xue et al., IEEE/ASME Trans. Mechatronics (Univ. de Utah)](https://iss.mech.utah.edu/wp-content/uploads/sites/103/2018/12/Xue-IEEETransMech-08434343-small.pdf)
- La salida depende de cambios bruscos de dirección (no del número de vueltas): por eso una enrolladora de relojes con giro suave carga mal un Kinetic y la muñeca carga bien. [Bulsuk (2026)](https://www.bulsuk.com/2026/07/will-watch-winder-charge-seiko-kinetic.html)

### Inferences
- **Eficiencia del pulsador EnOcean (cálculo aproximado):** trabajo mecánico de una pulsación ≈ 9 N × 1,8 mm ≈ 16 mJ; energía eléctrica 0,12–0,21 mJ → ≈1 % de conversión. Caveat: la fuerza y el recorrido son del PTM 215 y la energía es del ECO 200 (dispositivos parecidos pero no idénticos). Cada telegrama de radio cuesta unos 40 µJ (120 µJ ÷ 3).
- **Vida útil:** estos recolectores no se «gastan» como una pila; duran lo que dura la mecánica (EnOcean: >300 000 pulsaciones). Pero dejan de dar energía en cuanto la fuente se para: el Kinetic se para si no lo llevas puesto (cuando se agota lo que tiene guardado), el Perpetuum si el tren se para y el EnOcean si nadie pulsa.
- **Escala:** Perpetuum (10 mW) ≈ 2 000 veces un reloj Kinetic (5 µW). Un Kinetic, a 5 µW, produce ≈160 J al año (5 µW × 31,5 millones de s), es decir, haría falta más de una década para juntar la energía de una pila de botón CR2032 (≈2 000–2 500 J, aproximado). Aun así basta para un reloj, porque un reloj de cuarzo gasta muy poco (≈1 µW; orden de magnitud de conocimiento general, no verificado aquí).
- **Reloj automático (mecánico):** la masa oscilante tensa un muelle real; la energía viene del brazo. Su reserva de marcha típica es de unos 40–80 horas (conocimiento general, no verificado en esta sesión): si no te lo pones, se para en 2–3 días. Es el mejor ejemplo «honesto» de lo que los usuarios intentan con muelles: el muelle solo almacena, no crea energía.
- **Para un aficionado:** un recolector electromagnético casero (imán que oscila dentro de una bobina, tipo «linterna de agitar») es fácil de construir y da del orden de µW–mW mientras lo mueves; los piezoeléctricos (discos de zumbador baratos) dan µJ por golpe. Comprar un módulo EnOcean o una placa recolectora (p. ej., un circuito de gestión de energía + supercondensador) es más práctico que fabricar el transductor.
- **Pisadas (tráfico, suelos que generan):** no encontré cifras fiables en esta sesión; ver Gaps.

### Gaps
- No encontré una hoja de datos de Perpetuum con potencia por velocidad del tren; las cifras de Perpetuum son de material comercial de 2011. No verifiqué la situación actual (2026) de la empresa.
- No obtuve cifras de suelos que generan con las pisadas (Pavegen u otros) ni de recolectores en carreteras; quedan sin cuantificar.
- No obtuve la reserva de marcha ni la potencia oficial de Seiko para Kinetic; la cifra de 0,5–5 µW es de un estudio académico.
- No conseguí la energía por pulsación específica del PTM 215 (solo la del convertidor ECO 200).

## 2. Nanogeneradores triboeléctricos (TENG): ¿cuánta potencia real dan?

### Takeaway
Los triboeléctricos (electricidad estática por frotamiento o contacto de plásticos) son reales, pero las cifras de los titulares suelen ser picos instantáneos medidos en condiciones de laboratorio a medida; la potencia media útil es mucho menor y la propia comunidad científica reconoce que los datos son difíciles de comparar.

### Cited Findings
- La potencia media de un TENG depende mucho de la resistencia de carga y de la frecuencia; un cálculo simple con capacidad constante difiere del cálculo correcto (series de Fourier). [Power computation for the TENG, arXiv 1810.06466](https://arxiv.org/pdf/1810.06466)
- Trabajo de Surrey/Loughborough: se introducen «gráficas de impedancia» para encontrar el punto de máxima potencia de cada diseño (el resultado cambia con las condiciones de prueba). [Loughborough](https://repository.lboro.ac.uk/articles/journal_contribution/Nature_of_power_generation_and_output_optimization_criteria_for_triboelectric_nanogenerators/24514099/1); [Surrey](https://openresearch.surrey.ac.uk/esploro/outputs/journalArticle/Nature-of-Power-Generation-and-Output/99771752102346)
- Se ha propuesto como estándar de comparación la «densidad de potencia media por volumen y por hercio» (W m⁻³ Hz⁻¹), precisamente porque las cifras publicadas no se pueden comparar entre sí. [RSC, material suplementario (Energy & Environmental Science)](https://www.rsc.org/suppdata/d1/ee/d1ee03961j/d1ee03961j4.pdf)
- Un artículo de divulgación de 2025 sostiene que las pruebas inconsistentes socavan los datos de los triboeléctricos e impiden compararlos (solo leí el resumen). [StatNano](https://statnano.com/amp/world-news/109029/Why-triboelectric-nanogenerator-data-can-)
- Ejemplo documentado de cifra inflada (en un nanogenerador piezoeléctrico de nanohilos de ZnO en tejido, no un TENG, Nature 2008): los autores corrigieron la potencia de 20–80 mW/m² a 4–16 mW/m² (≈0,4–1,6 µW/cm²). [Nature 451, 809–813 (2008) y su corrección](https://www.nature.com/articles/nature07628)
- Comentario informal (fuente débil): un titular de «ganancia de 140 veces en densidad de potencia» se calificó de «técnicamente cierto, pero terriblemente engañoso para el público». [Tildes (foro)](https://tildes.net/~science/1ig5/new_nanogenerators_achieve_140_fold_power_density_gain_could_rival_solar_cells)

### Inferences
- Lo útil para la persona usuaria: si ve un vídeo que dice «un TENG enciende 100 LED», casi siempre es un destello de microsegundos con alta tensión y corriente minúscula, no energía continua. Para un aparato que dure años, lo que importa es la potencia media (µW), y esa es pequeña.
- **Para un aficionado:** es fácil hacer uno (dos láminas de plástico distinto, por ejemplo teflón y nailon o papel de aluminio, que se tocan y se separan), y medirá cientos de voltios en vacío pero muy poca energía; sirve como demostración, no como fuente de alimentación duradera.
- La energía, de nuevo, viene de quien mueve las láminas (mano, viento, vibración).

### Gaps
- No encontré una revisión con potencia media realista (µW/cm²) de los TENG en uso real ni un producto comercial alimentado solo por triboelectricidad; queda como hueco. Las cifras récord publicadas (a veces de cientos de W/m² de pico) no las verifiqué en esta sesión.

## 3. Energía de radio del ambiente (Wi-Fi, TV, telefonía móvil) y productos reales (Powercast)

### Takeaway
En la calle de una gran ciudad, la radio del ambiente aporta de media unos 0,01–0,02 µW/cm² (máximo ≈0,5 µW/cm² muy cerca de antenas), cientos de veces menos de lo que necesitan los recolectores comerciales; Powercast funciona, pero con un transmisor dedicado a pocos metros (−12 dBm ≈ 63 µW mínimos a la entrada). La «energía gratis del aire» es real como física pero minúscula en la práctica.

### Cited Findings
- Encuesta de radio en la calle frente a las 270 estaciones del metro de Londres (Imperial College, 2013): media/máximo de densidad de potencia por banda: GSM 900 ≈0,014 / 0,54 µW/cm²; GSM 1800 ≈0,01 / 0,49 µW/cm²; 3G ≈0,02 / 0,13 µW/cm²; Wi-Fi 2,4 GHz ≈0,009 / 0,02 µW/cm². Más de 50 estaciones tenían niveles aptos para recolección por banda. [Piñuela, Mitcheson y Lucyszyn, IEEE TMTT 2013](https://t4awstest.cc.ic.ac.uk/media/imperial-college/faculty-of-engineering/electrical-and-electronic-engineering/public/optical-and-semiconductor-devices/pubs/2013_07_TMTT.pdf); [Spiral (Imperial)](https://spiral.imperial.ac.uk/handle/10044/1/10270)
- El mismo trabajo: el Wi-Fi depende mucho del tráfico, así que es una fuente intermitente. [IEEE TMTT 2013](https://t4awstest.cc.ic.ac.uk/media/imperial-college/faculty-of-engineering/electrical-and-electronic-engineering/public/optical-and-semiconductor-devices/pubs/2013_07_TMTT.pdf)
- Estudio GSM/WLAN (TNO; dato antiguo): a 25–100 m de una antena GSM, 0,1–3,0 mW/m² (= 0,01–0,3 µW/cm²); el WLAN, aún menos. Conclusión de los autores: es poco probable que GSM y WLAN den suficiente energía para alimentar sensores en miniatura. [Ambient RF Energy Scavenging: GSM and WLAN Power Density Measurements](https://typeset.io/papers/ambient-rf-energy-scavenging-gsm-and-wlan-power-density-q9ac8jplzb)
- Powercast P2110B (receptor de 902–928 MHz): potencia de entrada RF mínima −12 dBm y máxima +10 dBm; el P2110 original funcionaba desde −11,5 dBm. [Hoja de datos P2110B](https://www.powercastco.com/hubfs/WP%20PDFs/New-P2110B-Datasheet.pdf?hsLang=en); [Mouser P2110B](https://www.mouser.com/datasheet/2/329/P2110B_Datasheet_Rev_3-3159474.pdf); [P2110 Rev B](https://static6.arrow.com/aropdfconversion/b53d461a64fb0882ccbae907f4390ea5a4885bec/p2110-datasheet-rev-b.pdf)
- La guía de selección de Powercast da un alcance de ≈40 pies (≈12 m) para el P2110 estándar y ≈10 pies (≈3 m) para la variante de alta potencia; no dice la potencia del transmisor supuesta. [Powercast, guía de selección](https://es.slideshare.net/Powercast/powerharvester-selection-guide-12897246)

### Inferences
- **Conversión de unidades:** −12 dBm = 63 µW; −11,5 dBm ≈ 71 µW.
- **Cálculo ilustrativo (supuestos explícitos):** una antena dipolo de 2,4 GHz capta un área efectiva de ≈20 cm² (G·λ²/4π con G = 1,64 y λ = 12,5 cm). Con la media de Wi-Fi de Londres (≈0,01 µW/cm²) entran ≈0,2 µW (≈ −37 dBm), unas 300 veces menos que el mínimo del Powercast, y además el rectificador a esos niveles tiene rendimiento bajo. En GSM 900 (λ ≈ 33 cm, área ≈145 cm²) la media daría ≈2 µW (−27 dBm); solo en los puntos máximos (0,54 µW/cm²) se llegaría a ≈78 µW, justo en el umbral, y eso al pie de una antena.
- **Un router a 1 metro:** con 100 mW radiados (límite típico europeo de Wi-Fi a 2,4 GHz, conocimiento general), la densidad a 1 m es 0,1 W ÷ (4π·1 m²) ≈ 0,8 µW/cm²; a 3 m, ≈0,09 µW/cm²; a 10 m, ≈0,008 µW/cm² (cae con el cuadrado de la distancia). Y el router no emite todo el tiempo.
- **De dónde viene la energía:** de la antena que emite (que está enchufada a la red eléctrica). Recolectar radio no es «gratis»: es recoger una fracción minúscula de lo que otro aparato emite.
- **Por qué las afirmaciones de «energía del aire» son exageradas:** se presentan picos cerca de un transmisor potente o un transmisor dedicado (como Powercast) como si fuese energía ambiente; en cualquier casa o calle normal la media está en el rango de 0,01 µW/cm².
- **Para un aficionado:** el clásico «radio de galena» o un detector con diodo y antena larga puede sacar µW de una emisora de AM potente cercana; con Wi-Fi ambiente, en la práctica no basta para nada útil salvo cargar muy lentamente un condensador para un parpadeo muy de vez en cuando. Comprar un kit Powercast con su transmisor funciona, pero la energía la pone el transmisor enchufado.

### Gaps
- No encontré mediciones actuales (2024–2026) de radio ambiente con 5G o Wi-Fi 6/7; la encuesta de Londres es de 2013.
- No obtuve la potencia del transmisor (p. ej., 3 W EIRP) en la que Powercast basa su alcance de 12 m, ni curvas de potencia de salida frente a distancia.

## 4. Pequeño viento, corriente de agua y lluvia de sobremesa; campo magnético terrestre y electricidad atmosférica (campanas de Franklin, ~100 V/m)

### Takeaway
Las microturbinas de 2–4 cm dan de decenas de µW a decenas de mW, pero solo con viento de 3–8 m/s (no en una habitación, donde el aire está casi quieto); la lluvia da de nJ a decenas de µJ por gota y, en lluvia real, una viga piezoeléctrica dio ≈0,1 µW de media; la electricidad atmosférica de buen tiempo es enorme en voltios (~100 V/m) pero diminuta en corriente (~2 pA/m²), y un campo magnético quieto (el de la Tierra) no puede dar energía a algo que no se mueve.

### Cited Findings
**Viento a pequeña escala**
- Microturbina carenada con rotor de 2 cm (Howey et al., Imperial, 2011): de ≈80 µW a ≈2,5 mW entre ≈3 y 7 m/s; arranca hacia 3 m/s; pensada para sensores en tuberías y conductos. [Howey et al., Design and performance of a centimetre-scale shrouded wind turbine](https://t4awstest.cc.ic.ac.uk/media/imperial-college/faculty-of-engineering/electrical-and-electronic-engineering/public/optical-and-semiconductor-devices/pubs/Design-and-performance.pdf)
- La misma revisión cita un rotor de plástico de 7,6 cm que da 13,5 mW a 4 m/s; recolectores no rotativos (viga que aletea) dan como mucho 29,8 µW y uno piezoeléctrico 0,1–0,86 µW. [Howey et al.](https://t4awstest.cc.ic.ac.uk/media/imperial-college/faculty-of-engineering/electrical-and-electronic-engineering/public/optical-and-semiconductor-devices/pubs/Design-and-performance.pdf)
- Turbina biomimética tipo «sámara» de 44 mm probada de 1,2 a 8 m/s: 41 µW a 81,7 mW, con rendimiento máximo ≈17,8 % a 4 m/s. [AGRIS/FAO](https://agris.fao.org/search/en/records/65dfb54a0f3e94b9e5db8daa); [HAL, Innovative blade shape for micro wind turbines](https://hal-emse.ccsd.cnrs.fr/SYMME/hal-03779695v1)
- Turbina vertical «mariposa» de 80 mm (Hara et al., 2016): 30,5 mW de potencia en el eje a 6 m/s (≈15 mW eléctricos estimados con un generador del 50 %). [Hara, Fundación Sumitomo](https://www.sumitomo.or.jp/pdf/kankyo/15_kankyo_seika/Hara_Yutaka_Seika_153406.pdf)

**Lluvia**
- CEA (Francia, 2008): entre 1 nJ y 25 µJ por gota según su tamaño; potencia continua de 1 µW (gotas pequeñas) hasta 12 mW (gotas grandes de chaparrón). [Phys.org 2008](https://phys.org/news/2008-01-power-harvesting-energy-sky.html)
- Tesis de Nottingham: energía disponible por gota de 2 µJ a 1 mJ según su tamaño; potencia instantánea máxima modelada de 3,75 mW. [Nottingham ePrints](https://eprints.nottingham.ac.uk/44707)
- Un estudio con viga piezoeléctrica en voladizo midió 0,3 µJ por gota. [Univ. de Palermo, Applied Sciences 8:955](https://iris.unipa.it/retrieve/e3ad891d-42bc-da0e-e053-3705fe0a2b96/applsci-08-00955.pdf)
- Lluvia real: una viga de 0,0018 m² (18 cm²) produjo 2 076 µJ en 301 minutos; los autores dicen que por la irregularidad hace falta almacenar energía. (Atribución exacta tomada de un resultado de búsqueda; probablemente Energy 124 (2017) 364–371.) [EconPapers, Energy 2017](https://econpapers.repec.org/RePEc:eee:energy:v:124:y:2017:i:c:p:364-371)

**Electricidad atmosférica**
- Con buen tiempo hay un campo eléctrico de ≈100 V/m hacia abajo cerca del suelo y una corriente de solo ≈2 pA/m² (picoamperios por metro cuadrado); el circuito global lleva ≈1 000 A en total. [FMI, Fair-weather atmospheric electricity](https://space.fmi.fi/~makelaa/fairw.html)
- Crowley (2011) modela la atmósfera como fuente: la disipación global es de ≈100 GW, pero casi toda se consume en las propias tormentas; lo que puede recoger un colector local está limitado por la densidad de corriente local y por su sección eficaz. [Crowley, ESA 2011](https://electrostatics.org/wp-content/uploads/2023/08/2011_A2.pdf); revisión de fondo: [Harrison, Fair weather atmospheric electricity](https://centaur.reading.ac.uk/20913)
- La «campana eléctrica de Oxford» (Clarendon Laboratory, montada en 1840 o quizá en 1825) suena casi sin parar con dos «pilas secas» (baterías electrostáticas de alta tensión), ≈10 000 millones de toques; cada oscilación consume ≈1 nA. No es energía atmosférica ni perpetua: es una pila química muy lenta cuyo contenido se desconoce. [Vice](https://www.vice.com/en/article/this-battery-has-lasted-175-years-and-no-one-knows-how); [MakeTechEasier](https://maketecheasier.com/a-bell-in-an-oxford-university-physics-lab-has-been-ringing-almost-nonstop-since-1840-on-the-same-pair-of-dry-pile-batteries-about-10-billion-rings-so-far-and-nobody-is-quite-sure-what-is-i/)

### Inferences
- **Viento en interior (física básica):** la potencia del viento es ½·ρ·v³ por m² (ρ ≈ 1,2 kg/m³). A 4 m/s: ≈38 W/m² ≈ 3,8 mW/cm² de área barrida (y como mucho un 59 % es extraíble, el límite de Betz). En una habitación (≈0,1–0,3 m/s) la potencia es ≈2 000–60 000 veces menor (va con el cubo de la velocidad) y las microturbinas ni siquiera arrancan (la de 2 cm necesita ≈3 m/s). Turbina de mesa en interior: no sirve; en exterior o en un conducto de ventilación, sí puede dar µW–mW.
- **Agua que corre (física básica, sin fuente medida):** el agua es ≈800 veces más densa que el aire; a 0,5 m/s, ½·1000·0,5³ ≈ 62 W/m² ≈ 6 mW/cm². Un arroyo o un grifo abierto pueden mover una microturbina con mW, pero la energía viene de la presión de la red o de la gravedad (del agua que cae), y si el grifo está abierto se gasta agua. En una maqueta de sobremesa con agua que recircula, una bomba gasta más de lo que la turbina devuelve (es el mismo error que las norias de bolas o flotadores).
- **Lluvia real promedio:** 2 076 µJ en 301 min (18 060 s) ≈ 0,115 µW con 18 cm² de viga ≈ 0,006 µW/cm², y solo mientras llueve. Es realista como curiosidad, no como fuente.
- **Atmósfera (cálculo de orden de magnitud):** un colector de 1 m² recoge ≈2 pA; aunque se aproveche una diferencia de potencial de 100 V (colector a 1 m de altura), la potencia es ≈2×10⁻¹⁰ W = 0,2 nW por m². Las campanas de Franklin solo suenan bien en tormenta, cuando el campo sube muchísimo (no hay cifra verificada en esta sesión) y la energía viene de la tormenta; con buen tiempo, prácticamente nada. Además, colectores altos son peligrosos con rayos.
- **Campo magnético de la Tierra (física básica, sin fuente medida):** ≈25–65 µT (conocimiento general). Un campo que no cambia no hace trabajo sobre una bobina quieta: tensión = 0. Si giras una bobina de 100 vueltas y 10 cm de diámetro a 10 vueltas por segundo en 50 µT, la tensión pico es N·B·A·ω ≈ 100 × 50×10⁻⁶ × 0,0079 m² × 63 ≈ 2,5 mV, y la energía la pone quien la hace girar. Igual que con los imanes de un «motor magnético»: un imán quieto no da energía continua.
- **Para un aficionado:** una microturbina de 4–8 cm (motor de juguete usado como generador) al viento exterior o en la salida de un ventilador de extracción, o una rueda en un desagüe, son proyectos viables con mW; la lluvia y la atmósfera, solo como experimento.

### Gaps
- No encontré datos medidos de microturbinas de agua de sobremesa o de grifo (potencia frente a caudal); las cifras de agua son cálculo físico.
- No encontré una cifra verificada de potencia extraíble con colectores atmosféricos reales ni del campo durante tormentas; tampoco la tensión ni la energía por toque de la campana de Oxford.
- No verifiqué con fuente el valor del campo magnético terrestre (25–65 µT) en esta sesión.

## 5. Fuentes biológicas: pilas de combustible microbianas en tierra o barro, pilas con plantas y sensores «alimentados por plantas»

### Takeaway
Las pilas microbianas de suelo y de plantas son reales: bacterias del suelo «comen» materia orgánica (y, en las de plantas, los azúcares que sueltan las raíces) y liberan electrones; dan del orden de 20–30 mW/m² en el campo (≈2–3 µW/cm²) y hasta >240 mW/m² en el mejor laboratorio; un dispositivo práctico da desde decenas de µW hasta unos pocos mW, suficiente para sensores que transmiten de vez en cuando, durante meses o años si el suelo se mantiene húmedo.

### Cited Findings
- Pila microbiana flotante con plantas de arroz para alimentar sensores ambientales remotos: pico de ≈3–3,5 mW (22–28 mW/m² de cátodo) tras 20–30 días de arranque; rendimiento a largo plazo asegurado con plantas de arroz densas. (Atribuida en la búsqueda a Journal of Power Sources, 2017; enlace de repositorio de la Univ. de Milán, verificación parcial.) [AIR Unimi](https://air.unimi.it/handle/2434/489554)
- Pila de plantas tubular a escala piloto en humedal artificial (de Jager, Groen y Strik, Wageningen): fuente autónoma adecuada para electrónica de bajo consumo (mW); señalan que faltan estudios largos en exterior real. [WUR eDepot](https://edepot.wur.nl/642202)
- Revisión (IEEE Transactions on AgriFood Electronics, 2026): la densidad de potencia de las pilas de plantas ha subido hasta más de 240 mW/m²; el uso a largo plazo exige mantener la planta viva, energía estable y evitar que los electrodos se deterioren. [Sensor-Based Assessment of Plant–Microbe Energy Interactions](https://www.iris.unicampus.it/retrieve/a2004c86-971e-4db9-aa36-1e31e3063c59/Sensor-Based_Assessment_of_PlantMicrobe_Energy_Interactions.pdf)
- Advertencia: un estudio de 2025 con electrodos de cobre y cinc da 0,477 mW (0,304 mW/cm²), pero parte de esa energía viene del efecto galvánico (una pila química de cobre-cinc), no de los microbios. [MDPI Energies 18(18):4989](https://www.mdpi.com/1996-1073/18/18/4989/xml)
- Northwestern (enero de 2024; Bill Yen, George Wells y Josiah Hester): una pila microbiana de suelo, del tamaño de un libro, con diseño perpendicular, dio de media 68 veces la potencia necesaria para hacer funcionar sus sensores (humedad del suelo y detección de contacto con transmisión de radio); aguantó desde suelo bastante seco (41 % de agua en volumen) hasta completamente inundado. Su potencia duró ≈120 % más que tecnologías parecidas (la redacción difiere entre fuentes). [Northwestern Now](https://news.northwestern.edu/stories/2024/01/dirt-powered-fuel-cell-runs-forever); [EurekAlert](https://www.eurekalert.org/news-releases/1031344); [Interesting Engineering](https://interestingengineering.com/innovation/new-fuel-cell-taps-energy-from-dirt-dwelling-microbes-to-power-sensors)
- Guía técnica del mismo grupo («Soil-powered computing: The engineer's guide to practical soil microbial fuel cell design»): evaluaron el rendimiento en campo y demostraron un sensor inalámbrico de humedad alimentado por la pila de suelo. [NSF PAR](https://par.nsf.gov/servlets/purl/10561528)

### Inferences
- **Conversión:** 22–28 mW/m² = 2,2–2,8 µW/cm²; 240 mW/m² = 24 µW/cm². Una maceta de 15 cm de diámetro (≈177 cm²) con buen rendimiento de campo daría del orden de cientos de µW como techo teórico; en la práctica, las pilas caseras suelen dar mucho menos (no verificado con fuente en esta sesión).
- **De dónde viene la energía:** del sol, en última instancia (la planta fotosintetiza y suelta azúcares por la raíz) o de la materia orgánica del barro. No es energía «de la nada»: si el suelo se seca o se agota la materia orgánica, la potencia cae.
- **Vida útil:** meses a años mientras haya humedad y materia orgánica y no se corroan los electrodos; la tensión de una sola celda es baja (del orden de 0,3–0,7 V, conocimiento general), así que hace falta un convertidor elevador o varias celdas en serie y un condensador que acumule.
- **Para un aficionado:** es uno de los proyectos más realistas y bonitos: electrodos de fieltro o tela de carbono (ánodo enterrado en barro, cátodo en la superficie con aire), barro de estanque o jardín, y un circuito recolector («joule thief» o un chip gestor de energía) que cargue un condensador y haga parpadear un LED cada pocos segundos o minutos. Ojo: si se usan electrodos de cobre y cinc, gran parte de la energía es una pila química normal, que se gasta.

### Gaps
- No obtuve la potencia absoluta (µW) de la pila de suelo de Northwestern, solo el «68 veces lo necesario».
- Faltan series largas (varios años) de campo con datos de potencia medidos; la propia literatura lo reconoce.
- No encontré productos comerciales actuales (2026) de sensores «alimentados por plantas» con hoja de datos (p. ej., kits de Plant-e u otros).

## 6. Famosas máquinas de «energía libre» y movimiento perpetuo, y por qué fallan

### Takeaway
Todas las afirmaciones de este grupo han fallado ante pruebas independientes, han terminado en condenas o sentencias por fraude (Perendev, Stanley Meyer), en un jurado científico negativo (Steorn), o nunca se han dejado comprobar (Bessler, Hendershot, Testatika); ninguna ha mostrado más energía de salida que de entrada, que es lo que prohíben la conservación de la energía y la termodinámica.

### Cited Findings
- **Motores magnéticos / Perendev:** desde 2006, Mike Brady y Perendev-Group vendieron un «motor magnético»; en 2010 fue acusado de fraude grave y condenado a 5 años y 9 meses de cárcel. Según Psiram, el juicio fue en Múnich (septiembre de 2010; sentencia en noviembre de 2010) por fraude en 36 casos y tentativa de fraude en 19; no se entregó ningún motor que funcionara; salió en 2014 y en 2018 habría creado otra empresa en Sudáfrica (este último dato solo lo da Psiram). [Wikipedia, Magnet motor (fragmento de búsqueda)](https://en.wikipedia.org/wiki/Magnet_motor); [Psiram, Perendev-Group](https://www.psiram.com/de/index.php/Perendev-Group); [Psiram, Magnetmotor](https://www.psiram.com/de/index.php/Magnetmotor)
- **Steorn Orbo (Irlanda):** en junio de 2009, un jurado de 22 expertos elegido por la propia Steorn y presidido por Ian McDonald (Universidad de Alberta) concluyó por unanimidad que no se había demostrado producción de energía, y dejó de trabajar. La demostración en Dublín (diciembre de 2009–febrero de 2010) era un motor alimentado por pilas sin prueba de energía extra. La empresa entró en liquidación en 2016. Su producto posterior, el «O-Cube», decía cargar un móvil o una tableta al día; una filtración mostró una sustancia química entre dos metales distintos (una pila), no imanes. [Irish Times](https://www.irishtimes.com/news/irish-energy-for-nothing-gizmo-fails-jury-vetting-1.790415); [Boing Boing 2009](https://boingboing.net/2009/06/23/jury-reports-that-st.html); [Fora.ie 2016](https://fora.ie/steorn-shaun-mccarthy-liquidated-3097083-Nov2016/); [NZ Skeptics 2024](https://articles.skeptics.nz/2024/08/05/the-calm-after-the-steorn); [Silicon Republic](https://www.siliconrepublic.com/?p=459296)
- **Electrólisis «sobreunitaria» / «coche de agua» (Stanley Meyer):** un tribunal de Ohio (condado de Fayette, 3 de septiembre de 1996) le encontró culpable de «fraude grave y flagrante» y le ordenó devolver 25 000 dólares a dos inversores; tres peritos dijeron que la «célula de combustible de agua» era electrólisis normal. Murió de un aneurisma cerebral, no «asesinado» como dicen los rumores (según la verificación; el año de su muerte no se comprobó en esta sesión). [Wikipedia, Water fuel cell (fragmento)](https://en.wikipedia.org/wiki/Water_fuel_cell); [Lead Stories, fact check 2021](https://leadstories.com/hoax-alert/2021/06/fact-check-water-car-inventor-stanley-meyer-was-not-killed-by-pentagon-cause-of-death-a-brain-aneurysm.html)
- **Generador de Hendershot (1928–1960):** se presentó como generador sin combustible que tomaba energía del campo magnético terrestre; en los años 30 un experto (Dr. Hochstetter) declaró que era falso y que funcionaba gracias a pilas pequeñas escondidas. Fuente: el relato de la familia (parcial). [Svensons, Lester Hendershot](https://www.svensons.com/other/Energy/hendershot.html); [Fuel-efficient-vehicles](https://fuel-efficient-vehicles.org/energy-news/?page_id=1166)
- **Testatika (comunidad Methernitha, Suiza):** descrita por sus promotores como máquina que recoge energía de partículas de aire cargadas con dos discos electrostáticos que giran en sentidos opuestos; nunca se ha sometido a evaluación independiente (la fuente es un documento promocional). [Vesperman, adjunto a documento BLM](https://downloads.regulations.gov/BLM-2012-0001-2686/attachment_1.pdf)
- **Motor de Bedini:** el programa MythBusters lo probó; en el foro de sus seguidores se discute si la réplica fue exacta, y algunos admiten que «el motor funciona, pero no hace nada útil» (fuente parcial; no verifiqué el episodio). [Overunity.com](https://overunity.com/4779/bedini-motor-debunked-by-mythbusters/)
- **Rueda de Bessler (Orffyreus, siglo XVIII):** Johann Bessler afirmó haber probado 300 modelos de movimiento perpetuo; la termodinámica moderna muestra que son imposibles. [Wikipedia, History of perpetual motion machines (fragmento de búsqueda)](https://en.wikipedia.org/wiki/History_of_perpetual_motion_machines)
- **Panorama general de modelos de negocio de «energía libre»** (crítico): [Psiram, Freie-Energie-Geschäftsmodelle](https://www.psiram.com/de/index.php/Freie-Energie-Gesch%C3%A4ftsmodelle)

### Inferences
- **Una o dos frases por mito, para el informe (síntesis):**
  - *Motores magnéticos (Perendev):* los imanes atraen y repelen, pero en una vuelta completa el trabajo total del campo de un imán fijo es cero (es un campo conservativo); siempre hay un «punto pegajoso» donde se pierde lo ganado. Perendev acabó con una condena por fraude.
  - *Motor de Bedini:* es un motor de pulsos con batería que funciona, pero gasta más energía de la que devuelve; las «baterías que se recargan solas» se explican por la recuperación química de la batería tras descansar (explicación de conocimiento general, no verificada aquí).
  - *Generador de Hendershot:* demostraciones sin medición independiente; la acusación contemporánea fue de pilas escondidas.
  - *Testatika:* la comunidad nunca permitió pruebas independientes; las máquinas electrostáticas (tipo Wimshurst) necesitan que alguien las haga girar.
  - *Rueda de Bessler:* nunca se dejó examinar por dentro; las ruedas con pesos que se desplazan (como las que prueba la persona usuaria) siempre llegan a un equilibrio porque el par de los pesos, sumado en la vuelta, es cero.
  - *Electrólisis sobreunitaria:* separar el agua en hidrógeno y oxígeno cuesta al menos la misma energía que se obtiene al quemarlos; nunca puede «alimentar su propia electrólisis» y sobrar.
  - *«Energía radiante» de Tesla:* Tesla patentó en 1901 un aparato que carga un condensador con la luz o la radiación que llega a una placa (patente US 685,957, «Apparatus for the Utilization of Radiant Energy»; dato de conocimiento general, no verificado en esta sesión); es en esencia un efecto fotoeléctrico o una antena que recoge energía muy pequeña, no energía libre ilimitada; los vendedores modernos de «energía radiante» no tienen pruebas independientes.
  - *Steorn Orbo:* su propio jurado científico dijo que no había energía extra; la empresa quebró.
- **Patrón común útil para la persona usuaria:** (1) se demuestra en vídeo, no en pruebas independientes con medición de entrada y salida; (2) se pide dinero por adelantado (licencias, distribuidoras); (3) la fuente oculta suele ser una pila, la red eléctrica o la inercia de un volante empujado al principio.

### Gaps
- No pude leer Wikipedia entera (dominio bloqueado en esta sesión); los datos de Bessler y del motor magnético vienen de fragmentos de búsqueda.
- No encontré fuentes escépticas de calidad (Skeptical Inquirer, departamentos de física) específicas sobre Hendershot, Testatika o Bedini; las fuentes son de promotores o foros.
- No verifiqué documentos judiciales originales (Perendev: Múnich 2010; Meyer: Ohio 1996); las fuentes son Psiram, Wikipedia (vía Sunday Times de 1996) y un fact-check.
- No verifiqué directamente la patente de Tesla de «energía radiante».

## 7. Tabla comparativa de todo el campo: potencia típica por fuente y qué puede alimentar

### Takeaway
Fuera de la luz solar directa (≈15 mW/cm²), casi todas las fuentes del entorno dan microvatios por cm² o por aparato; eso basta para un reloj (≈1 µW), un sensor que transmite una vez por minuto (pocos µW de media) o un LED que parpadea de vez en cuando, pero para un pulso de motor hay que acumular energía durante minutos u horas en un condensador o batería. Ninguna máquina de «energía libre» ha dado una cantidad comprobable mayor que cero.

### Cited Findings
| Fuente | Potencia o energía típica (con fuente) | Ejemplo real | ¿Real o mito? |
|---|---|---|---|
| Sol exterior directo (referencia) | ≈15 000 µW/cm² (15 mW/cm²); nublado ≈150 µW/cm² [Roundy 2002](https://iss.mech.utah.edu/wp-content/uploads/sites/103/2012/10/vibration_electricity_IMECE_2002.pdf) | Calculadoras, sensores solares | Real |
| Luz interior de oficina | ≈6 µW/cm² [Roundy 2002](https://iss.mech.utah.edu/wp-content/uploads/sites/103/2012/10/vibration_electricity_IMECE_2002.pdf) | Calculadoras de interior | Real |
| Vibración de máquinas | ≈100–375 µW/cm³ [Roundy 2002](https://iss.mech.utah.edu/wp-content/uploads/sites/103/2012/10/vibration_electricity_IMECE_2002.pdf), [Roundy 2005](https://iss.mech.utah.edu/wp-content/uploads/sites/103/2012/10/PervasiveComputing-Roundy-2005.pdf); hasta 778 µW/cm³ (EM) [revisión 2020](https://zendy.io/title/10.1002/er.5643) | Perpetuum en vagón: ≈10 mW de media [Perpetuum 2011](https://eh-network.org/events/dissemination2011/pitches/Perpetuum.pdf) | Real (si la máquina vibra) |
| Movimiento de la muñeca | 0,5 µW (mediana 8 h) – ≈5 µW (media diaria) [Xue et al.](https://iss.mech.utah.edu/wp-content/uploads/sites/103/2018/12/Xue-IEEETransMech-08434343-small.pdf) | Seiko Kinetic | Real |
| Pulsación de un botón | 120–210 µJ por pulsación → 3 telegramas de radio [ECO 200](https://www.farnell.com/datasheets/3775943.pdf) | Interruptores EnOcean | Real |
| Diferencia de temperatura | ≈15 µW/cm³ (10 °C) o 40 µW/cm³ (5 °C), tablas discrepantes [Roundy 2005](https://iss.mech.utah.edu/wp-content/uploads/sites/103/2012/10/PervasiveComputing-Roundy-2005.pdf) | Termogeneradores | Real |
| Ruido acústico | 0,003 µW/cm³ a 75 dB; 0,96 a 100 dB [Roundy 2002](https://iss.mech.utah.edu/wp-content/uploads/sites/103/2012/10/vibration_electricity_IMECE_2002.pdf) | — | Real pero inútil |
| Radio ambiente en ciudad | media 0,009–0,02 µW/cm²; máx. ≈0,5 µW/cm² [Londres 2013](https://t4awstest.cc.ic.ac.uk/media/imperial-college/faculty-of-engineering/electrical-and-electronic-engineering/public/optical-and-semiconductor-devices/pubs/2013_07_TMTT.pdf) | — | Real pero minúscula; «energía del aire» exagerada |
| Radio con transmisor dedicado | mínimo de entrada −12 dBm ≈ 63 µW; alcance ≈12 m [Powercast](https://www.powercastco.com/hubfs/WP%20PDFs/New-P2110B-Datasheet.pdf?hsLang=en), [guía](https://es.slideshare.net/Powercast/powerharvester-selection-guide-12897246) | Powercast P2110B | Real (la energía la pone el transmisor) |
| Microviento (2–4 cm) | 80 µW–2,5 mW a 3–7 m/s [Howey 2011](https://t4awstest.cc.ic.ac.uk/media/imperial-college/faculty-of-engineering/electrical-and-electronic-engineering/public/optical-and-semiconductor-devices/pubs/Design-and-performance.pdf); 41 µW–81,7 mW a 1,2–8 m/s [sámara 44 mm](https://agris.fao.org/search/en/records/65dfb54a0f3e94b9e5db8daa) | Sensores en conductos | Real solo con viento (no en interior) |
| Lluvia | 1 nJ–25 µJ por gota [CEA](https://phys.org/news/2008-01-power-harvesting-energy-sky.html); 2 076 µJ en 301 min con 18 cm² [Energy 2017](https://econpapers.repec.org/RePEc:eee:energy:v:124:y:2017:i:c:p:364-371) | Prototipos | Real pero mínima |
| Pila microbiana con plantas | 22–28 mW/m² (≈2–3 µW/cm²) en campo; dispositivo 3–3,5 mW [Unimi](https://air.unimi.it/handle/2434/489554); >240 mW/m² mejor caso [revisión 2026](https://www.iris.unicampus.it/retrieve/a2004c86-971e-4db9-aa36-1e31e3063c59/Sensor-Based_Assessment_of_PlantMicrobe_Energy_Interactions.pdf) | Sensores en arrozales y humedales | Real |
| Pila microbiana de suelo | 68 veces lo que piden sus sensores [Northwestern 2024](https://news.northwestern.edu/stories/2024/01/dirt-powered-fuel-cell-runs-forever) | Sensor de humedad con radio | Real |
| Electricidad atmosférica (buen tiempo) | ≈100 V/m pero solo ≈2 pA/m² [FMI](https://space.fmi.fi/~makelaa/fairw.html) | Campanas de Franklin (en tormenta) | Real pero casi nula |
| Pila seca de Oxford | ≈1 nA por oscilación desde ~1840 [Vice](https://www.vice.com/en/article/this-battery-has-lasted-175-years-and-no-one-knows-how) | Campana eléctrica de Oxford | Real, pero es una pila (se agota) |
| Motores magnéticos, Bedini, Hendershot, Testatika, Bessler, Orbo, electrólisis «sobreunitaria» | 0 comprobado [Steorn](https://www.irishtimes.com/news/irish-energy-for-nothing-gizmo-fails-jury-vetting-1.790415), [Perendev](https://www.psiram.com/de/index.php/Perendev-Group), [Meyer](https://leadstories.com/hoax-alert/2021/06/fact-check-water-car-inventor-stanley-meyer-was-not-killed-by-pentagon-cause-of-death-a-brain-aneurysm.html) | — | Mito |

### Inferences
**Qué consume cada carga (estimaciones con supuestos explícitos; no son cifras de una fuente):**
- **Reloj de cuarzo:** ≈1 µW (conocimiento general). Coherente con que un Kinetic funcione con 0,5–5 µW de media. → Basta con la muñeca, la luz interior de unos pocos cm², una pila de plantas o una pila de suelo.
- **Sensor que informa una vez por minuto:** un telegrama de radio EnOcean cuesta ≈40 µJ (120 µJ ÷ 3). Si cada medida y envío cuesta 40–100 µJ, una vez por minuto son ≈0,7–1,7 µW de media, más el consumo en reposo del microcontrolador (≈1 µW, supuesto) → ≈2–3 µW en total. → Posible con luz interior (≈6 µW/cm²), vibración de máquina, pila de suelo o de plantas; no con radio ambiente ni con atmósfera.
- **Parpadeo de LED:** un LED a 2 mA y 2 V durante 10 ms = 40 µJ. Un parpadeo cada 10 s ≈ 4 µW de media; cada minuto ≈ 0,7 µW. → Viable con pila de plantas o de barro (proyecto clásico de aficionado) o con una pulsación tipo EnOcean (≈3–5 parpadeos por pulsación).
- **Pulso de un motor pequeño:** 3 V × 50 mA × 0,1 s = 15 mJ por pulso. Con 5 µW hacen falta ≈50 minutos para juntarlo; con 10 mW (Perpetuum), 1,5 s. Para guardar 15 mJ a 3 V hace falta un supercondensador de ≈3,3 mF (E = ½·C·V²). → Posible de vez en cuando, nunca de forma continua con fuentes de µW.
- **Comparación final para la persona usuaria:** un «motor magnético» o una rueda de pesos que de verdad diera aunque fueran 5 µW sin fuente externa rompería la conservación de la energía; las fuentes reales de esta tabla sí dan esos µW porque toman energía de algo que se mueve, se calienta, brilla o vive. La pregunta útil es siempre «¿de dónde sale la energía?».
- **Duración en años:** la clave no es el generador sino (a) que la fuente siga existiendo (la máquina vibra, el suelo sigue húmedo, hay luz) y (b) que el almacenamiento aguante (los supercondensadores y las baterías recargables envejecen; los electrodos de las pilas microbianas se degradan). EnOcean garantiza >300 000 pulsaciones; la pila de Oxford lleva unos 185 años con nA.

### Gaps
- Las cifras de consumo de las cargas (reloj, microcontrolador en reposo, LED, motor) son supuestos de conocimiento general, no medidas tomadas de una fuente en esta sesión.
- Faltan cifras de pisadas y suelos que generan, de turbinas de agua de grifo y de potencia media realista de los triboeléctricos.
- La mayoría de los datos de referencia son de 2002–2017; no encontré una revisión de 2025–2026 con una tabla actualizada que los sustituya.

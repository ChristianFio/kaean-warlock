// Long texts for Kaean: guide, story and background. Plain HTML and markdown, edited by hand.
window.SheetTexts = {
  carriage: `Carrozza nera laccata, sedili di velluto, finestrini scuri e uno scomparto segreto sotto il posto del cocchiere (dentro c'è il secondo registro). La traina Notturna, che non va mai portata in battaglia.`,
  story: `<h2>Kaean <small>registrato come Kaeraldo</small></h2>
<p>Tiefling nato ad Aurena, città di teatri della Congregazione dell'Ispirazione di Simpoh, in una famiglia di comparse. Da bambino impara a nascondere i suoi occhi da serpente dietro lenti scure, e scopre di saper convincere chiunque. La sorella maggiore <b>Elena</b> è una cantante di talento: lui la adora e la invidia.</p>
<p>Fallisce l'audizione all'Accademia, ma <b>Morgana Voss</b> lo nota e lo porta all'<b>Ufficio delle Adesioni</b>, che convince le comunità indipendenti ad aderire a Simpoh. A diciotto anni firma con lei l'<b>Accordo Privato</b>: il <b>Creditore</b>, un diavolo dei contratti, gli presta potere in cambio di firme. Il segno è una lettera in corsivo sul polso sinistro, che cambia senza preavviso.</p>
<p>Morgana affama gli indipendenti per costringerli a firmare. Kaean finge di eseguire gli ordini, ma li sabota in segreto e aiuta le vittime, usando proprio il potere del Creditore: il suo debito cresce ogni anno. A Pietrafonda conosce <b>Lucerys</b> e stringe con lui l'Accordo, l'unico contratto senza inchiostro della sua vita.</p>
<p>A Valdoro vede il mugnaio colpito dalla <b>Collera</b> e la figlia <b>Mirta</b>. Scopre che le copie dei suoi registri vanno a qualcuno con un sigillo sconosciuto (non quello del Creditore). Morgana minaccia Elena. Kaean parte per una "missione prolungata", perde un registro in una locanda e si stabilisce a <b>Ivacuus</b>, dove vive da quasi undici mesi tra piante, la cavalla <b>Notturna</b>, <b>Nonna Pruna</b> e Lucerys.</p>
<dl class="kv">
  <dt>Tratto</dt><dd>Parla a voce bassa e con ironia; finge di essere peggio di quello che è.</dd>
  <dt>Ideale</dt><dd>Libertà: ognuno ha diritto di scegliere, e di ricevere aiuto senza firmare niente.</dd>
  <dt>Legame</dt><dd>Elena deve restare lontana dall'Accordo Privato, a qualunque costo.</dd>
  <dt>Legame</dt><dd>Mirta e il registro perduto: c'è una risposta che deve.</dd>
  <dt>Difetto</dt><dd>Crede di poter gestire ogni rischio da solo, con una buona bugia e senza spiegazioni.</dd>
  <dt>Paura</dt><dd>Le campane: tre colpi lunghi e due brevi erano la sua convocazione ad Aurena.</dd>
</dl>
<h3>Al tavolo</h3>
<ul class="muted"><li>Non si toglie mai gli occhiali scuri in pubblico, e tiene i polsini abbottonati.</li><li>Minaccia le piante ad alta voce, poi le cura con pazienza.</li><li>Aiuta di nascosto e nega tutto: "Si è riparato da solo".</li><li>Ha sempre una mela in tasca per Notturna.</li><li>Quando suonano le campane cerca con lo sguardo l'uscita.</li><li>Ogni tanto controlla il polso e annota la lettera nel suo registro.</li></ul>`,
  guide: [
    {title: `Guida al combattimento`, wide: true, html: `<p>Kaean combatte <b>a distanza</b> e con la <b>parola</b>. Ha 24 PF e CA 14, ma con <b>Vigore Immondo</b> entra in ogni scontro con 12 PF temporanei: <b>36 PF effettivi</b>. In più ha <b>2 punti fortuna</b> al giorno per i tiri che contano. Ha solo <b>2 slot</b>, sempre di 2° livello, e li recupera con ogni <b>riposo breve</b>: usali senza paura e chiedi una pausa al gruppo quando sono finiti.</p>`},
    {title: `Cosa hai in ogni turno`, wide: false, html: `<dl class="kv">
  <dt>Azione</dt><dd>Deflagrazione Occulta, un incantesimo, oppure Vigore Immondo per rifarti i 12 PF temporanei</dd>
  <dt>Azione bonus</dt><dd>Maleficio (o spostarlo), Armatura di Agathys, Passo Velato, bere una pozione</dd>
  <dt>Movimento</dt><dd>9 m: allontanati dai nemici e cerca copertura</dd>
  <dt>Reazione</dt><dd>Rimprovero Infernale quando un nemico ti ferisce (1 volta gratis per riposo lungo)</dd>
</dl>
<h3>Tre regole da non dimenticare</h3>
<p><b>Un solo slot per turno.</b> Nello stesso turno non puoi lanciare due incantesimi che usano uno slot: per esempio Maleficio e Comando. I trucchetti e Vigore Immondo non contano.</p>
<p><b>Una sola concentrazione.</b> Maleficio, Blocca Persone, Suggestione e Guida richiedono concentrazione: se ne lanci un altro, il primo finisce. Quando subisci danni fai un TS di Costituzione (+2) con CD 10 o metà dei danni: la scheda te lo ricorda.</p>
<p><b>I PF temporanei non si sommano.</b> Vigore Immondo ne dà 12, Agathys 10, la Benedizione dell'Oscuro 7: tieni sempre il valore più alto.</p>`},
    {title: `Le tue armi`, wide: false, html: `<dl class="kv">
  <dt>Deflagrazione Occulta</dt><dd>+6 a colpire, 36 m, 1d10+4 forza. Con Maleficio +1d6 necrotici. Il tuo attacco di ogni turno.</dd>
  <dt>Comando</dt><dd>Due bersagli di qualsiasi tipo (TS Sag CD 14): "Fermo", "A terra", "Lascia", "Fuggi". Nessuna concentrazione.</dd>
  <dt>Blocca Persone</dt><dd>Paralizza un umanoide (TS Sag CD 14). I colpi in mischia contro di lui sono critici automatici.</dd>
  <dt>Armatura di Agathys</dt><dd>Azione bonus. Per 1 ora, chi ti colpisce in mischia subisce 10 danni da freddo.</dd>
  <dt>Raggio Rovente</dt><dd>3 raggi da 2d6 fuoco, ognuno con il suo tiro per colpire. Con Maleficio attivo, +1d6 a raggio.</dd>
  <dt>Mani Brucianti</dt><dd>Cono di 4,5 m, 4d6 fuoco (TS Des). Per i gruppi vicini, ma ti espone.</dd>
  <dt>Scheggia Mentale</dt><dd>1d6 psichici (TS Int) e −1d4 al prossimo tiro salvezza del bersaglio.</dd>
</dl>`},
    {title: `Le combinazioni forti`, wide: true, html: `<h3>1. La riserva di vigore</h3>
<p>Fuori dal combattimento lancia <b>Vigore Immondo</b> ogni volta che i PF temporanei scendono sotto 12: è gratis e a volontà. Ogni scontro comincia con 36 PF invece di 24.</p>
<h3>2. Brina e fiamme</h3>
<p><b>Armatura di Agathys</b> (azione bonus) e <b>Deflagrazione</b> nello stesso turno. Chi ti colpisce in mischia subisce 10 danni da freddo, e con la reazione aggiungi il <b>Rimprovero Infernale</b> (2d10 fuoco gratis, 3d10 con uno slot). Per le regole 2024 la brina dura finché hai PF temporanei: rifalli con Vigore Immondo (azione) o con la Benedizione dell'Oscuro. <span class="muted">È una lettura discussa: chiedi conferma alla master.</span></p>
<h3>3. Il Maleficio che non scade</h3>
<p>Con uno slot di 2° dura 4 ore. Se a fine scontro è ancora attivo, mantieni la concentrazione durante il riposo breve: riparti con <b>2 slot pieni e il Maleficio già lanciato</b>.</p>
<h3>4. Comando doppio</h3>
<p>Non richiede concentrazione, quindi lo usi con Maleficio attivo. Due nemici perdono il turno ("Fermo") oppure cadono proni davanti ai compagni in mischia ("A terra").</p>
<h3>5. Scheggia e blocco</h3>
<p><b>Scheggia Mentale</b> su un bersaglio, e nel turno dopo <b>Blocca Persone</b> o <b>Comando</b>: il suo tiro salvezza ha −1d4. Funziona anche per preparare un incantesimo del bardo.</p>
<h3>6. La fortuna al momento giusto</h3>
<p>Hai <b>2 punti fortuna</b> per riposo lungo. Con uno hai vantaggio su un tuo d20, oppure dai svantaggio a chi ti attacca. Tienili per i tiri che decidono lo scontro: il tiro salvezza contro un effetto che ti toglierebbe il turno, la concentrazione su Blocca Persone, la prova di Persuasione o Inganno che conta davvero.</p>`},
    {title: `La sequenza da fare quasi sempre`, wide: true, html: `<h3>Prima dello scontro</h3>
<ul><li><b>Vigore Immondo</b>: 12 PF temporanei, sempre.</li><li>Controlla se il <b>Maleficio</b> dello scontro precedente è ancora attivo.</li></ul>
<h3>Turno 1</h3>
<ul><li><b>Azione bonus: Maleficio</b> sul nemico più resistente, poi <b>Deflagrazione Occulta</b> sullo stesso bersaglio.</li><li>Se i nemici ti arrivano addosso, invece: <b>Armatura di Agathys</b> come azione bonus, poi Deflagrazione.</li><li>Contro un umanoide pericoloso: <b>Blocca Persone</b>, e lascia che i compagni in mischia lo finiscano.</li></ul>
<h3>Dal turno 2 in poi</h3>
<ul><li><b>Azione: Deflagrazione Occulta</b> ogni turno (1d10+4, più 1d6 con Maleficio).</li><li><b>Azione bonus:</b> se il bersaglio di Maleficio è caduto, sposta la maledizione.</li><li>Il secondo slot è per il momento giusto: <b>Comando</b> su due nemici, <b>Passo Velato</b> per uscire dalla mischia, o il Rimprovero Infernale potenziato.</li></ul>
<h3>Dopo lo scontro</h3>
<ul><li><b>Vigore Immondo</b> di nuovo.</li><li>Chiedi un <b>riposo breve</b> (1 ora): ritornano tutti gli slot, e puoi riscrivere trucchetti e rituali del Libro delle Ombre.</li><li>Se non c'è tempo: <b>Astuzia Magica</b> (1 minuto, una volta per riposo lungo) ti ridà 1 slot.</li></ul>`},
    {title: `Fuori dal combattimento`, wide: true, html: `<dl class="kv">
  <dt>Convincere qualcuno</dt><dd>Persuasione +6 o Inganno +6, con Guida (+1d4) prima della prova e un punto fortuna se è quella decisiva. Se non basta: Suggestione.</dd>
  <dt>Passare inosservato</dt><dd>Illusione Minore per distrarre, il costume del Ciarlatano per i travestimenti, Passo Velato per superare un ostacolo.</dd>
  <dt>Testi e lingue</dt><dd>Comprendere Linguaggi come rituale dal Libro delle Ombre (10 minuti in più, nessuno slot).</dd>
  <dt>Magia e sigilli</dt><dd>Individuazione del Magico come rituale: utile su contratti, registri e sigilli.</dd>
  <dt>Documenti falsi</dt><dd>Strumenti da falsario: un vecchio talento dell'Ufficio delle Adesioni.</dd>
  <dt>Occhi aperti</dt><dd>Percezione +2, passiva 12: imboscate, porte nascoste, dettagli fuori posto.</dd>
</dl>`},
    {title: `Errori da evitare`, wide: true, html: `<ul><li><b>Stare in prima linea:</b> la brina punisce chi ti colpisce, ma con 24 PF e CA 14 non sei un tank.</li><li><b>Sparare con un nemico adiacente:</b> la Deflagrazione ha svantaggio. Usa Passo Velato o allontanati.</li><li><b>Due slot nello stesso turno:</b> non si può. Azione bonus con slot e azione con slot vanno in turni diversi.</li><li><b>Lanciare un'altra concentrazione</b> mentre hai Maleficio o Blocca Persone attivi: perdi il primo.</li><li><b>Risparmiare gli slot:</b> tornano con il riposo breve, usali.</li><li><b>Dimenticare Vigore Immondo</b> dopo uno scontro: sono 12 PF regalati.</li><li><b>Tenersi i punti fortuna:</b> tornano a ogni riposo lungo, non servono a niente se restano lì.</li></ul>`},
    {title: `Piano di crescita`, wide: true, html: `<dl class="kv">
  <dt>4° livello</dt><dd><b>+2 al Carisma</b>: arriva a 20, con CD 15 e +7 a colpire. È la scelta più forte. In alternativa <b>Incantatore da Guerra</b> (War Caster): +1 al Carisma, vantaggio ai TS di concentrazione e Deflagrazione al posto dell'attacco di opportunità. In più: un trucchetto e un incantesimo preparato.</dd>
  <dt>5° livello</dt><dd>Slot di 3° livello, Deflagrazione con 2 raggi, Palla di Fuoco dal patrono e Oscurità dal retaggio. Due suppliche nuove: <b>Deflagrazione Respingente</b> (ogni raggio spinge il bersaglio di 3 m) e una tra Mente Occulta, Vista del Diavolo e Lezioni dei Primi (talento Robusto: +2 PF per livello). I punti fortuna diventano 3.</dd>
  <dt>7°-9° livello</dt><dd>Sostituisci Vigore Immondo: 12 PF temporanei a quel punto pesano poco.</dd>
</dl>`},
  ],
  background: `# Kaean

*All'anagrafe risulta come Kaeraldo. È un funzionario della Congregazione dell'Ispirazione di Simpoh e, sulla carta, è ancora in missione.*

Kaean è un tiefling di trent'anni, alto e magro, con la pelle color ambra, i capelli rossi e due corna corte e scure, piegate all'indietro. In pubblico porta sempre occhiali dalle lenti scure. Chi riesce a guardarci dietro vede occhi gialli con la pupilla verticale, come quelli di un serpente.

Veste sempre di nero, con abiti eleganti e stivali lucidi. Si muove in modo morbido e sinuoso, quasi da serpente, e quando si siede sembra sciogliersi sulla sedia. Parla a voce bassa e con molta ironia, tanto che spesso chi lo ascolta non capisce se è stato appena insultato.

Ci tiene ad avere una cattiva reputazione, ma i piccoli dettagli lo tradiscono. Sotto le unghie curate ha spesso un po' di terra, che nasconde in fretta. In tasca ha sempre una mela per la sua cavalla, e giura che ci è finita per caso. Tiene sempre i polsini abbottonati, anche d'estate, per nascondere quello che ha sul polso sinistro: una lettera d'inchiostro scuro, in un corsivo elegantissimo, che nessun sapone è mai riuscito a togliere. E che non è sempre la stessa. La sua coda sottile, che dice di controllare alla perfezione, batte nervosa sul pavimento ogni volta che un amico è in ritardo per cena.

## I. Il bambino con gli occhi sbagliati

Aurena è la città della Congregazione dell'Ispirazione, quella del drago Simpoh. È una città costruita per lo spettacolo: piena di teatri uno sopra l'altro, piazze fatte apposta perché le voci si sentano bene, balconi pensati per essere guardati. Lì tutti devono avere un talento, e chi non ce l'ha viene gentilmente invitato a trovarsene uno.

Kaean nacque in una famiglia di comparse, cioè di attori secondari. Suo padre da trent'anni recitava la parte del "secondo soldato", sua madre quella della "dama che sviene al terzo atto". Erano devoti a Simpoh, orgogliosi del loro lavoro e felici di restare sullo sfondo. Il figlio, invece, aveva occhi da serpente, gialli e impossibili da ignorare. Quando il pubblico li notava, smetteva di guardare il protagonista, e ad Aurena questa era quasi una colpa.

Per il suo sesto compleanno, la madre gli regalò un paio di occhiali con le lenti scure. «Così non distrai nessuno», gli disse con dolcezza. Voleva proteggerlo, ma Kaean capì un'altra cosa: per essere accettato doveva nascondersi. ==Da quel giorno non si è più tolto gli occhiali in pubblico.==

==In compenso scoprì di saper convincere la gente.== A otto anni convinse il figlio del fornaio a dargli una settimana di dolci in cambio di una pietra "portafortuna", e il bambino lo ringraziò per mesi. A dieci anni un'intera classe saltò le prove per andare a vedere i draghi di carta al porto. L'idea non era stata sua, ma davanti al maestro Kaean se ne prese tutta la colpa, inventandosi perfino di aver corrotto qualcuno. Preferiva essere considerato una cattiva influenza piuttosto che essere compatito per i suoi occhi.

L'unica creatura che non riusciva a convincere era un geranio sul davanzale, comprato al mercato per pochi soldi e dimenticato da tutti. Kaean lo minacciava di buttarlo nel canale al primo petalo storto, ma poi controllava la terra, gli cambiava il vaso e lo spostava al sole. Il geranio fioriva splendidamente, e Kaean diceva che era merito delle minacce. ==Era l'unica cosa che sapesse far crescere senza chiedere niente in cambio==, e per molto tempo lo sarebbe rimasta.

## II. La sorella che brillava

**Elena**, la sorella maggiore, aveva tutto quello che Aurena apprezzava. Era una tiefling come lui, ma se Kaean sembrava fatto per l'ombra, lei sembrava fatta per la luce. Aveva lunghi capelli rossi e ondulati, legati con nastri dorati, corna sottili decorate con anellini d'argento e occhi color ambra, del tutto normali, cosa che i genitori consideravano una fortuna. Era alta, stava sempre dritta come una cantante, rideva di cuore e parlava gesticolando. A dodici anni cantava già nei cori della Congregazione, e la sua voce commuoveva perfino gli insegnanti.

Kaean la adorava e la invidiava allo stesso tempo. Lei invece era convinta che il fratello fosse il più intelligente della famiglia, e ogni volta che qualcuno la lodava, trovava il modo di parlare bene di lui. Per il suo primo coro, Kaean le regalò un ciondolo d'argento a forma di nota musicale, comprato con mesi di risparmi. **Elena** non se l'è mai più tolto. Lui non le ha mai perdonato del tutto di essere così buona, ma non ha mai smesso di esserle grato.

Quando arrivò il momento della sua audizione per l'Accademia di Simpoh, Kaean salì sul palco e si bloccò. Dietro le quinte sapeva mettere a suo agio chiunque, ma sotto le luci riusciva solo a pensare che tutti stessero cercando di vedere i suoi occhi dietro le lenti. L'esibizione fu breve e mediocre. Almeno la commissione recuperò un po' di tempo.

Prima di salire sul palco, però, aveva chiacchierato con tre candidati molto agitati. Dopo averci parlato, tutti e tre avevano deciso di ritirarsi: uno voleva fare il cartografo, uno sposarsi, uno tornare dalla nonna. Se ne andarono sollevati. Tra gli esaminatori, una giovane funzionaria aveva visto tutto e si annotò il suo nome. Si chiamava **Morgana Voss**: voce gentile, calligrafia perfetta e una memoria che non dimenticava nulla. ==Accanto al nome di Kaean scrisse una sola parola, che lui avrebbe scoperto solo anni dopo: *idoneo*.==

## III. L'Accordo Privato

**Morgana** lo fece entrare nell'Ufficio delle Adesioni. È il ramo della Congregazione che si occupa di convincere le comunità indipendenti ad aderire a Simpoh. Kaean rispondeva a lei, lei rispondeva ai suoi superiori, e in cima alla catena c'erano il secondo in carica e infine il drago. All'inizio il lavoro sembrava innocuo: visitava i villaggi indipendenti, spiegava i vantaggi della protezione di Simpoh e compilava censimenti con nomi, mestieri, bisogni e motivi per accettare o rifiutare.

Poco dopo il suo diciottesimo compleanno, **Morgana** lo convocò dopo l'orario di lavoro, in una stanza che non compariva sulle mappe dell'edificio. Gli spiegò che i funzionari più promettenti potevano ottenere un **Accordo Privato**: un privilegio per pochi, che lo avrebbe reso più convincente e gli avrebbe fatto fare carriera molto in fretta. Kaean sapeva che **Morgana** aveva fatto carriera in metà del tempo di chiunque altro. Non chiese come.

Nella stanza c'era una terza persona. Era seduta dietro una scrivania di legno nero, con guanti grigi, una penna d'oro e un registro enorme, così spesso da sembrare contenere tutte le promesse mai fatte ad Aurena. Il suo volto era sfocato: Kaean non riusciva a ricordarlo nemmeno mentre lo guardava. La voce invece era impossibile da dimenticare: cortese, paziente, come quella di un notaio che legge un contratto. Si presentò come **il Creditore**, e precisò che era un titolo, non un nome.

Il contratto era scritto con un inchiostro che si muoveva leggermente sulla pagina. Il Creditore gli offriva una parte del suo potere: parole più convincenti, illusioni, piccoli aiuti nei momenti giusti. ==In cambio voleva una sola cosa, la stessa che voleva l'Ufficio: **firme**.== Ogni nuova adesione ottenuta da Kaean sarebbe stata segnata anche nel suo registro. Il potere ricevuto era un anticipo, da ripagare con il lavoro. «È solo una questione di saldo», disse il Creditore. «Non si preoccupi. Io sono molto paziente, e gli interessi sono bassi».

Kaean aveva diciotto anni, una famiglia di comparse e due occhi che nessuno voleva guardare. Per la prima volta qualcuno gli offriva un posto in prima fila. Firmò. ==L'inchiostro risalì dalla pagina fino al suo polso, come un insetto, e si fermò lì, sotto forma di una lettera in corsivo, elegante come la firma di un notaio.== Non era la sua iniziale. **Morgana** gli strinse la mano: «Adesso sei uno dei nostri».

Gli ci vollero anni per capire davvero che cosa aveva firmato.

## IV. L'Ufficio delle Adesioni

Un giorno il rappresentante di un villaggio venne a protestare: gli uomini di **Morgana** stavano bloccando un carico di farina, e nel suo villaggio i bambini mangiavano una volta al giorno. **Morgana** gli fece ripetere quel dettaglio, come se le piacesse sentirlo. Poi gli mise davanti un modulo di adesione: «Allora sarebbe da irresponsabili farli aspettare per una questione di principio». Kaean propose di liberare il carico e riparlarne dopo, ma lei non spostò il modulo di un centimetro. Più tardi gli disse: «==Non devono stare meglio, Kaeraldo. Devono avere bisogno di noi==».

Quella sera Kaean fece arrivare al villaggio un altro carico di farina, pagandolo di nascosto tramite un mercante che non faceva domande. A **Morgana** raccontò invece che la popolazione era "messa alle strette come previsto". Quella notte, per la prima volta, sognò la scrivania nera. Il Creditore sfogliava il registro senza alzare gli occhi: «Nessuna firma, oggi. Ne prendo nota». Non sembrava arrabbiato. Era peggio: sembrava interessato.

Da lì in poi gli ordini diventarono chiari. Doveva bloccare i rifornimenti, rovinare gli accordi commerciali, colpire le famiglie che resistevano. **Morgana** voleva persone affamate e spaventate, abbastanza disperate da firmare. Dava gli ordini solo a voce e voleva rapporti senza dettagli compromettenti. In pubblico parlava di armonia e di protezione, e Kaean non sapeva se il drago fosse al corrente di tutto questo, né se qualcuno sopra di lei conoscesse l'Accordo Privato. Sapeva bene, però, che cosa voleva lei.

Così inventò il suo metodo, che in ufficio chiamavano "Metodo Kaeraldo". Davanti a **Morgana** sorrideva, accettava gli ordini e lasciava intendere di avere idee ancora peggiori. Ma una volta sul posto non danneggiava nessuno: cercava invece le cose che erano già andate storte da sole, e nei rapporti se ne prendeva il merito. Una festa rovinata dalla pioggia diventava "un'azione mirata per abbattere il morale". Un ponte crollato da mesi diventava "un problema di collegamenti opportunamente aggravato". Due consiglieri che litigavano da vent'anni diventavano "discordia seminata con effetti duraturi". Non aveva fatto niente di tutto questo. Sapeva solo scrivere molto bene.

Il potere del Creditore però lo usava, ed era questa la cosa che lo tormentava di più. Una parola più convincente per far credere a una guardia di **Morgana** di aver già controllato un magazzino. Un'illusione per far sembrare vuoto un granaio pieno. Un volto falso per passare inosservato in un villaggio che avrebbe dovuto rovinare. ==Ogni incantesimo che usava per aiutare qualcuno veniva dalla stessa fonte che voleva quelle persone in ginocchio.== Kaean si diceva che era come rubare dalla cassa del nemico. Il Creditore, nei sogni, la chiamava "un prestito", e segnava tutto.

Quando i villaggi stavano troppo bene per i suoi rapporti, Kaean scriveva che c'era "una crisi in preparazione" e chiedeva più tempo. Intanto faceva arrivare i rifornimenti per un'altra strada, aiutava a riparare i ponti e avvisava le famiglie in pericolo. Nei rapporti descriveva con cura come stavano le cose al suo arrivo, e non diceva nulla di quello che aveva sistemato. **Morgana** voleva risultati veloci e pochi dettagli, quindi il trucco funzionava. Ma sarebbe bastata una sola ispezione per scoprirlo. Per questo Kaean chiedeva a tutti di stare zitti: «Se qualcuno chiede chi ha riparato il ponte, si è riparato da solo. Se insiste, dite che sono una persona orribile. E non ringraziatemi per strada, mi rovinate il lavoro». Scherzava solo in parte.

Per tenere buono il Creditore, ogni tanto doveva portare a casa qualche firma vera. Le sceglieva con attenzione: solo villaggi che volevano davvero aderire, famiglie che avevano bisogno della protezione di Simpoh e la chiedevano senza ricatti. Erano firme oneste, eppure finivano anche nel registro nero, e Kaean non ha mai saputo che cosa il Creditore ne facesse. ==In ogni caso il suo debito restava in rosso, e ogni anno cresceva.==

Col tempo smise di scrivere dettagli sulle famiglie e riempì i rapporti di problemi inventati. Ma i primi censimenti, quelli scritti quando non sapeva ancora per chi lavorava, contenevano nomi e indirizzi veri. Quelle copie erano già state consegnate e non poteva più riprenderle. **Morgana** le conservava e continuava a chiedere notizie su chi aveva rifiutato l'adesione. Quando lei diventò Maestra del Protocollo, il suo potere crebbe, e con lui la paura di Kaean di essere convocato.

Ad Aurena le convocazioni arrivavano dal **Campanile del Protocollo**, una torre stretta che si alzava sopra gli uffici della Congregazione. Ogni funzionario aveva una sua sequenza di rintocchi, e quando suonava la tua dovevi presentarti subito, qualunque cosa stessi facendo. ==Quella di Kaean era: tre colpi lunghi e due brevi.== Per anni la sentì nei sogni, subito prima di ritrovarsi davanti alla scrivania nera.

In quel periodo cominciò a farsi chiamare Kaean. "Kaeraldo" gli sembrava il nome di un modulo da compilare in tre copie. L'anagrafe rifiutò il cambio di nome, e per questo il nome nuovo gli piacque ancora di più. Il Creditore, ovviamente, continuò a chiamarlo Kaeraldo.

Con il primo stipendio decente pagò l'anticipo per una carrozza nera laccata, indebitandosi per diversi stipendi futuri. Aveva già un debito molto più grande, e almeno questo aveva le ruote. A trainarla c'era **Notturna**, una cavalla nera, velocissima e con un pessimo carattere. La carrozza aveva sedili di velluto, finestrini scuri e uno scomparto segreto sotto il posto del cocchiere. Kaean imparò a riconoscere ogni suo scricchiolio, e **Notturna** imparò quali locande avevano le mele migliori. Nessuno dei due pensava di essere stato addestrato dall'altro. Se qualcuno gli diceva di andare più piano, Kaean rispondeva che alla cavalla non sarebbe piaciuto. La cavalla, saggiamente, non commentava.

## V. L'Accordo

La sua prima missione importante fu a Pietrafonda, un villaggio di confine sulla strada del nord. Doveva convincere il consiglio del villaggio ad aderire a Simpoh. Il primo giorno **Notturna** si spaventò per un cane, ruppe le cinghie e scappò attraverso il mercato. Kaean la inseguì per mezzo paese, perdendo il cappello e buona parte della sua dignità. La ritrovò ferma vicino alla bancarella di due venditori del nord: un halfling di nome **Ferron** e un giovane aasimar con gli occhi d'argento, che le accarezzava il collo mentre lei, incredibilmente, gli mangiava una mela dalla mano. Si chiamava **Lucerys**. Era un giovane membro della Congregazione dell'Adattabilità di Rovin, alla sua prima missione importante: convincere Pietrafonda che la protezione di Rovin avrebbe tenuto lontane le bestie e le malattie.

**Lucerys** era tutto quello che Kaean non era: paziente, prudente, onesto anche quando non conveniva, e orgoglioso in un modo silenzioso che Kaean trovò subito irritante. Fu anche la prima persona, dopo molti anni, su cui Kaean non volle usare il potere del Creditore. Ci pensò una volta sola, per abitudine, e la firma sul polso gli sembrò improvvisamente sporca. Di giorno si facevano concorrenza davanti al consiglio. La sera **Lucerys** aiutava i pastori con le greggi, e Kaean distribuiva di nascosto il fieno che aveva appena comprato. Intanto **Notturna** aveva deciso di obbedire solo a uno dei due, e non a quello che le dava da mangiare.

Una sera di pioggia si ritrovarono sotto la stessa tettoia. **Lucerys** confessò di aver regalato a una famiglia di profughi un giovane cane da caccia che la sua Congregazione gli aveva affidato da addestrare. La famiglia doveva attraversare le terre dei lupi. «Con lui avranno una possibilità. Io me la caverò», disse. Kaean rise fino alle lacrime, poi gli offrì da bere e gli pagò la cena. Quando **Lucerys** ammise di non sapere come spiegarlo ai suoi superiori, Kaean gli scrisse il rapporto: "animale affidato in addestramento sul campo presso una famiglia del luogo". **Lucerys** lo rilesse tre volte cercando la bugia, e non la trovò. Lo firmò con la faccia di chi ha appena mangiato qualcosa di andato a male.

==Quella notte nacque il loro Accordo: l'unico contratto della vita di Kaean scritto senza inchiostro.== **Lucerys** non avrebbe mai mentito, e Kaean non glielo chiese mai. Scriveva lui i rapporti di entrambi, usando frasi vere ma ingannevoli, e **Lucerys** accettava di non correggerle. Nei villaggi che non volevano aderire a nessuno, i rapporti di Kaean dicevano che un inviato di Rovin aveva ostacolato il lavoro di Simpoh. Quelli di **Lucerys** dicevano che c'erano problemi locali che Simpoh non era riuscito a sfruttare. Nessuno veniva costretto ad aderire, nessuno soffriva, e intanto il nome di **Lucerys** cominciava a essere rispettato nella sua Congregazione. Lui ne era felice, e se ne vergognava esattamente nella stessa misura.

Negli anni si rividero ogni volta che le missioni lo permettevano. Tra un incontro e l'altro si scrivevano lettere che sembravano parlare di strade, ma in realtà parlavano delle locande dove avrebbero cenato insieme. **Lucerys** era convinto che Kaean fosse una brava persona. «Ritira subito quello che hai detto», rispondeva Kaean, «ho una reputazione da difendere». Quando **Lucerys** dimenticava di mangiare per vegliare un animale ferito, gli compariva accanto un piatto caldo. Kaean diceva di aver sbagliato ordinazione, e lo diceva così spesso che la scusa non reggeva più.

==Del Creditore non gli parlò mai.== Una volta **Lucerys** vide la lettera sul suo polso, mentre Kaean si tirava su le maniche per aiutarlo con un puledro, e gli chiese che cosa fosse. «Un notaio troppo zelante», rispose lui, riabbottonando il polsino. **Lucerys** non insistette. Ma da allora lo guarda come guarda gli animali feriti che non si lasciano avvicinare: con pazienza, aspettando che siano loro a fare il primo passo.

«Se ti cacciano», gli disse una volta Kaean, «dovrò trovarmi un altro avversario, e magari quello vorrà lavorare sul serio. E poi **Notturna** non me lo perdonerebbe mai».

## VI. La Collera

Poi arrivò un problema che nessuno dei due poteva risolvere con un rapporto ben scritto.

Kaean tornò a Valdoro, un villaggio che aveva visitato qualche mese prima. **Il mugnaio**, un uomo gentile che aveva rifiutato l'adesione offrendogli del pane caldo, era stato chiuso in una stalla e legato, perché non ferisse nessuno. Era stato colpito dalla Collera e si dibatteva in una rabbia senza fine. Sua figlia **Mirta** era una bambina umana di circa dieci anni, magra e piena di lentiggini, con una treccia castana sempre spettinata e le mani e il grembiule sempre bianchi di farina. Portava lo scialle del padre, troppo grande per lei, e gli passava l'acqua tra le sbarre con una tazza di legno scheggiata. Gli parlava piano anche quando lui non la riconosceva. Con gli adulti era seria come un piccolo notaio, ma quando era sola canticchiava le canzoni che le aveva insegnato il padre.

Kaean lasciò dei soldi alla famiglia e trovò qualcuno che mandasse avanti il mulino. A **Mirta** disse che lo faceva solo per proteggere un suo credito, anche se il mugnaio non gli doveva niente. Quella notte, per la prima volta, fu lui a cercare la scrivania nera. Chiese al Creditore se poteva aiutare il mugnaio, a qualunque prezzo. Il Creditore sfogliò il registro con calma, poi lo chiuse: «==La malattia non è un contratto, Kaeraldo. Non tratto merce che non so a chi appartenga==». Kaean non ha mai capito se fosse una risposta sincera o un modo elegante per non rispondere. Quando **Mirta** gli chiese se sarebbe tornato, lui le promise che ci avrebbe provato. Poi rimase sulla porta molto più del necessario.

Quella stessa notte riaprì i suoi vecchi rapporti. Tra le comunità colpite dalla Collera di cui aveva notizia, ne riconobbe alcune che avevano rifiutato l'adesione. Non era una prova di niente: la Collera era contagiosa, nessuno sapeva da dove venisse, e già si sapeva che colpiva soprattutto le comunità indipendenti. Lui poi aveva solo elenchi incompleti e voci di seconda mano. Forse aveva notato quei nomi solo perché li conosceva.

Tornato ad Aurena, scoprì che alcune copie dei suoi registri non restavano nell'archivio. Venivano mandate più in alto, chiuse con un sigillo che non aveva mai visto. ==La prima cosa che fece fu confrontarlo con la firma sul suo polso: non si somigliavano per niente.== Non era il segno del Creditore. Poteva essere una normale procedura, un ordine dei superiori di Simpoh o qualcuno che Kaean non conosceva affatto. Volle saperlo comunque. Quando chiese a **Morgana** chi ricevesse quei documenti, lei gli versò del vino e gli chiese con chi altro ne avesse parlato. Poi aggiunse che **Elena** aveva una voce splendida, e che sarebbe stato un peccato rovinarle la carriera per colpa di un parente imprudente. ==E con la stessa dolcezza disse che una ragazza così talentuosa sarebbe stata perfetta per l'Accordo Privato.==

Kaean conosceva abbastanza bene la gentilezza di **Morgana** da capire che era una minaccia. Posò il bicchiere senza bere e riuscì perfino a ringraziarla per l'interessamento. Gli tremava una mano, per fortuna sotto il tavolo. Sotto il polsino, la firma era diventata tiepida, come se qualcuno l'avesse appena ripassata con la penna.

Della crudeltà di **Morgana** aveva le prove. Su chi leggesse quei registri, e su un loro possibile legame con la Collera, aveva solo domande. Ma i nomi raccolti all'inizio, quando ancora non sapeva per chi lavorava, ormai erano in mani che non poteva raggiungere, e nessun rapporto falso li avrebbe riportati indietro. Per proteggere quelle persone non bastava più cambiare l'ultimo paragrafo di un rapporto. E per proteggere **Elena** non bastava più restare.

## VII. La fuga, se così si può chiamare

Non sfidò **Morgana**, non diede fuoco agli archivi e non fece discorsi. Per allontanarsi da lei e scoprire cosa gli stessero nascondendo, compilò una richiesta di "missione prolungata di osservazione sul campo" e partì prima che qualcuno la leggesse. Non aveva mai giurato fedeltà a Simpoh: aveva solo firmato dei moduli, che purtroppo sono quasi altrettanto difficili da cancellare. Quanto all'altro contratto, sapeva bene che nessuna missione sarebbe stata abbastanza lunga da sfuggirgli.

La prima notte di viaggio, in una locanda qualunque, sognò di nuovo la scrivania nera. Il Creditore non lo rimproverò. Gli mostrò solo una pagina del registro, con una colonna di numeri che scendeva fino in fondo al foglio, e sotto una parola sottolineata due volte: *saldo*. «==Il nostro accordo vale ovunque, Kaeraldo==», disse. «Vada pure dove vuole. Io aspetterò. Sono molto paziente». Kaean si svegliò con il polso ancora caldo, e la lettera era cambiata, e con la certezza che prima o poi qualcuno sarebbe venuto a riscuotere.

Si era portato via due registri. ==Uno lo perse in una locanda lungo la strada, dopo una notte passata a bere per dimenticare Valdoro==: il tipo di soluzione che rende il mattino dopo molto peggiore. Quel registro conteneva nomi, percorsi, date e appunti su chi aveva rifiutato l'adesione, mescolati alle sue false imprese. Kaean non sa se gliel'abbiano rubato, se qualcuno l'abbia scambiato per un libro dei conti o se sia finito sotto un letto. Sa solo che deve ritrovarlo. L'altro registro lo nascose nello scomparto segreto della carrozza, e da allora non ha avuto il coraggio di rileggerlo. Ha paura per le persone che ci sono scritte e, in secondo luogo, per la qualità di alcune sue metafore.

Prima di lasciare Aurena era passato sotto le finestre di **Elena**, che stava provando una canzone nuova. Rimase ad ascoltare fino all'ultima nota, poi se ne andò senza bussare. Le scrisse solo durante il viaggio: stava bene, aveva bisogno di allontanarsi, avrebbe trovato un modo per ricevere le sue lettere. In fondo aggiunse una frase che lei non avrebbe capito: «==Se qualcuno ti offre un privilegio riservato a pochi, rifiuta. Fidati di me, almeno su questo==».

Ai genitori non scrisse niente del suo lavoro né dei suoi sospetti. Erano rimasti persone affettuose e devote a Simpoh, convinte che con una spiegazione sincera si risolva qualsiasi malinteso. Kaean non sapeva come dirgli che era proprio quella loro fiducia a spaventarlo. Né come spiegargli che il figlio con gli occhi sbagliati aveva venduto un pezzo di sé pur di smettere di sentirsi una comparsa.

Durante il viaggio scrisse invece a **Lucerys**: «Vado a Ivacuus. Non chiedere». Aggiunse però il nome di una locanda, rovinando del tutto il senso del messaggio. In un poscritto, scritto con finta distrazione, faceva notare che a Ivacuus giravano più notizie sulla Collera che in qualunque archivio, nel caso al nord interessasse.

Il suono delle campane delle convocazioni gli era sempre stato fastidioso, o almeno così diceva. Durante il viaggio scoprì che bastavano le campane di un villaggio sconosciuto, appena il ritmo ricordava i suoi tre colpi lunghi e due brevi, per fargli cercare con lo sguardo l'uscita. Era paura. E averlo capito non la rendeva più sopportabile.

## VIII. I tre giorni di Ivacuus

Arrivò a Ivacuus con l'idea di restarci tre giorni. Nessun drago comandava sulla città, che accoglieva ogni tipo di creatura, e per una volta il suo aspetto non sembrava richiedere spiegazioni. Lì un ordine di **Morgana** non aveva lo stesso peso che ad Aurena. Questo non voleva dire essere introvabile, ma poter chiudere la porta di casa senza sentirsi già in ritardo per qualcosa. Per il Creditore, purtroppo, le porte non sono mai state un ostacolo.

**Lucerys**, ovviamente, chiese. Qualche mese dopo arrivò in città al posto di suo padre adottivo **Jeris**, ufficialmente per scambiare informazioni sulla Collera. Kaean non gli ha mai chiesto quanto avesse insistito per partire, e **Lucerys** non gliel'ha mai detto.

**Lucerys** si sistemò vicino alle stalle pubbliche, e in poche settimane mezza città gli portava cavalli impossibili, muli testardi e cani che nessuno riusciva a tenere. Kaean giurò che non avrebbe mai messo piede in una stalla. Poi una notte un temporale spaventò un intero recinto di cavalli, e lui era lì: ne aveva già legati metà e aveva coperto il fieno con il telo della sua carrozza. «È per la muffa», spiegò. «Non ho intenzione di sentirti parlare di muffa per i prossimi vent'anni». **Lucerys** non disse niente su quei "vent'anni". Da allora **Notturna** passa più tempo nel recinto di **Lucerys** che nel cortile di Kaean. Lui sostiene che sia colpa delle mele, ma le mele escono dalle sue tasche.

Kaean raccontò a **Lucerys** della stalla di Valdoro, dei registri e del sigillo. Non gli parlò della scrivania nera. **Lucerys** non aveva risposte, ma portava notizie dal nord, dove la Collera arrivava ancora raramente, e gliele diede senza chiedere niente in cambio. Era la prima volta, dopo tanti anni, che qualcuno gli dava qualcosa senza segnarlo da nessuna parte. «Non fare quella faccia», gli disse Kaean. «Non ti ho appena confessato di essere diventato più buono. Ti ho confessato che non so più chi stia leggendo i miei rapporti». **Lucerys** gli versò da bere senza commentare nessuna delle due cose.

Fu **Lucerys** a organizzare il passaggio della posta, insieme alle sue lettere per **Jeris** e per la sciamana **Veria**, senza dare alla famiglia di Kaean l'indirizzo di casa sua. **Elena** scrive ogni mese. Nelle prime lettere raccontava i successi del coro e chiedeva quando sarebbe tornato. Le lettere più recenti sono ancora chiuse in un cassetto. Ogni tanto Kaean risponde a quelle che ha letto, con poche righe, giusto per farle sapere che è vivo. Dalle lettere aperte ha anche notizie dei genitori. Le conserva tutte, anche quelle che non ha ancora il coraggio di aprire. Ha paura di trovarci scritto che qualcuno le ha offerto un privilegio.

Nel frattempo, una vicina di casa, l'anziana halfling che tutti chiamano **Nonna Pruna**, gli aveva lasciato davanti alla porta un basilico quasi morto, con un biglietto: «Mi hanno detto che hai il pollice verde». Kaean non conosceva ancora nessuno in città, quindi nessuno poteva averglielo detto. Minacciò il basilico, lo rinvasò e lo salvò. Poi arrivarono altri vasi, una rosa, un limone e così tanti problemi di giardinaggio che diventò difficile continuare a dire di essere solo di passaggio.

Oggi tutto il quartiere gli porta le piante morenti. Lui protesta, controlla le radici e trova posto per tutte. ==È l'unica cosa che fa senza usare il potere del Creditore==, e ci tiene più di quanto ammetterebbe mai: ogni pianta che rinasce sul suo davanzale è merito suo, e di nessun altro. Nessun registro ne terrà mai conto. **Nonna Pruna** dice a tutti che è un uomo buono, e lo dice ad alta voce, preferibilmente davanti alle stalle. «Abbassa la voce, Nonna», la prega lui, «ho una reputazione». «Lo so, caro», risponde lei, «ci sto lavorando». Vicino al recinto, **Lucerys** le dà ragione senza smettere di spazzolare **Notturna**. Ogni settimana Kaean porta a **Nonna Pruna** i pomodori migliori, scelti uno per uno, e giura che sono quelli di scarto.

Sono passati quasi undici mesi. Kaean ha trent'anni, e dodici li ha passati con quella lettera sul polso. Ci sono piante su tutte le finestre, una carrozza lucidata con amore, una cavalla che ormai obbedisce a qualcun altro e una panca vicino al recinto dove nessuno osa sedersi. La tranquillità di Ivacuus rende i pomeriggi più lunghi e gli fa perdere il conto delle settimane. Il mondo è fatto di vino decente, pane caldo e di una persona capace di parlare per un'ora del carattere di un cavallo. Kaean trova assurdo che qualcuno voglia renderlo migliore dandogli ordini, e vorrebbe restare. Ma ogni tanto ripensa a **Mirta**, e alla risposta che le deve.

E ogni tanto, la mattina, trova sul tavolo della cucina un foglio piegato in due, scritto con un inchiostro che si muove ancora un po'. Non c'è nessuna minaccia. ==C'è solo un numero, ogni volta un po' più alto del precedente.==

Poi c'è la lettera sul polso. Da quando ne ha memoria è stata una C. Quattro anni fa ha cominciato a cambiare: R, I, C, L il primo anno; H, C, S, R il secondo; A, C, T, N, C il terzo; e quest'anno, finora, N, Z, R, C. Le lettere si sono succedute proprio in quest'ordine, in momenti qualsiasi della giornata e a intervalli irregolari. Il cambio non fa male, quindi Kaean se ne accorge solo quando la guarda. ==Ne tiene un registro: data, ora, lettera e che cosa stava succedendo in quel momento.== È il suo modo di trattare il patto come una pratica da sbrigare. Finora non ha trovato nessuno schema, e questo lo irrita più di qualsiasi minaccia.

Vuole ritrovare il registro perduto, capire che fine abbiano fatto i nomi che ha consegnato e impedire a **Morgana** di ricattare le persone. Lui la chiama "una divergenza di opinioni professionali". Vuole tenere **Elena** lontana dall'Accordo Privato, a qualunque costo. E prima o poi dovrà trovare un modo per chiudere il conto con il Creditore, senza pagarlo con qualcosa, o qualcuno, a cui non è disposto a rinunciare. Per farlo dovrà ripartire, cercare informazioni e accettare dei compagni di viaggio. Dirà che gli servono come copertura, come braccia in più e come persone a cui lasciare i lavori peggiori. Intanto terrà per loro un posto in carrozza, imparerà come ognuno preferisce il vino e si accorgerà subito se qualcuno manca. Correrà i loro rischi chiamandoli "imprevisti personali". Ma accetterà molto meno volentieri che gli altri facciano lo stesso per lui.

A chi glielo chiede, dice di essere in congedo. Per la Congregazione, a quanto ne sa, è ancora in missione. Questa differenza lo preoccupa soprattutto quando suonano le campane.

---

## Risposte alle domande

**1. Per quale abilità particolare è conosciuto a Ivacuus?**
Sa salvare piante che tutti considerano morte. Il quartiere gli porta vasi malandati, ortaggi appassiti e alberelli malati. Kaean li minaccia ad alta voce, poi li cura con pazienza e competenza, e dice sempre che il merito è delle minacce. La sua fama è nata dall'aiuto dato ai vicini, a cominciare dal basilico di **Nonna Pruna**. Non c'è niente di magico, ed è proprio per questo che ci tiene tanto: è l'unico talento che non deve a nessuno.

**2. Qual è il suo obiettivo a lungo termine?**
Ritrovare il registro perduto, scoprire chi riceveva le copie dei suoi rapporti e proteggere le persone schedate nei primi censimenti. Vuole impedire a **Morgana** di ricattare le comunità, capire fin dove arrivano i suoi contatti e tenere **Elena** lontana dall'Accordo Privato. Gli ordini crudeli non li ha mai eseguiti: li ha coperti con rapporti falsi e aiuti segreti. Il legame tra i registri e la Collera resta solo un sospetto, senza prove. Vuole anche aiutare Valdoro e **Mirta**, e prima o poi chiudere il suo debito con il Creditore senza sacrificare nessuno a cui vuole bene.

**3. Ha mantenuto i contatti con qualcuno di prima della partenza? Con chi?**
Sì, con **Lucerys**, membro della Congregazione dell'Adattabilità di Rovin, conosciuto durante le missioni. Kaean lo ha avvisato prima di arrivare a Ivacuus, e **Lucerys** lo ha raggiunto per raccogliere notizie sulla Collera. È lui a fargli arrivare le lettere di **Elena**, che scrive ogni mese. Kaean risponde ogni tanto, senza raccontarle i suoi sospetti e senza darle il suo indirizzo. Dalle lettere aperte ha notizie anche dei genitori, mentre le più recenti sono ancora chiuse. Il Creditore, purtroppo, non ha bisogno di un indirizzo per farsi sentire.

**4. Che rapporto ha con la famiglia?**
Vuole bene ai genitori, ma la loro devozione alla Congregazione e la difficoltà di parlarsi li hanno allontanati. Non pensa che siano cattivi, ma si porta ancora dietro la sensazione di essere stato accettato solo quando nascondeva gli occhi. Adora **Elena**, con un misto di affetto, invidia e gratitudine. La tiene lontana perché ha paura di metterla in pericolo, e perché si vergogna. Sa però che anche il suo silenzio la può ferire. Nessuno in famiglia sa del patto.

**5. Che cosa lo spaventa?**
Ha paura che i nomi veri dei primi censimenti mettano in pericolo persone innocenti, e che **Morgana** scopra gli ordini disobbediti e gli aiuti segreti. Ha paura per la sua famiglia, per **Lucerys** e per chiunque si fidi di lui. Sa che **Morgana** è disposta a colpire le persone care per ottenere obbedienza: ha già minacciato la carriera di **Elena** e le ha fatto intravedere l'Accordo Privato. Teme il giorno in cui il Creditore verrà a riscuotere, e soprattutto teme di scoprire che cosa accetterà come pagamento. Il suono delle campane, soprattutto se ricorda i suoi tre colpi lunghi e due brevi, lo mette in allarme in modo esagerato, anche quando sa benissimo che nessuno lo sta chiamando.

**6. Com'è la sua città natale?**
Aurena è una città di teatri, cori e cerimonie, legata alla Congregazione dell'Ispirazione di Simpoh. Chi ha talento sul palco ottiene prestigio, mentre chi lavora dietro le quinte permette allo spettacolo di andare avanti. Sopra gli uffici della Congregazione si alza il Campanile del Protocollo, che convoca i funzionari con i loro rintocchi personali. Kaean ricorda la bellezza della città, ma anche il peso delle aspettative e l'abitudine di giudicare tutti dal ruolo che sanno recitare. Sa anche che, in alcune stanze che non compaiono sulle mappe, si firmano contratti di cui nessuno parla.

**7. Che cosa lo spinge a viaggiare con altri avventurieri?**
Per ritrovare il registro e verificare i suoi sospetti deve lasciare Ivacuus, raccogliere informazioni e andare in posti dove preferirebbe non essere riconosciuto. Al gruppo offre la conoscenza delle strade, la capacità di trattare con chiunque, una carrozza, una magia di cui preferisce non spiegare l'origine e molta più attenzione per gli altri di quanta ammetta. Aiuta i compagni nei loro obiettivi perché si affeziona alle persone e non riesce a lasciarle nei guai. Presenta il gruppo come un accordo conveniente per tutti: ammettere di avere bisogno di qualcuno gli costa molto più che mentire a un superiore.

**8. A cosa dà valore? Qual è il suo codice morale?**
Dà valore alla libertà di scelta, agli affetti e ai piccoli piaceri di tutti i giorni. Rispetta chi pensa con la propria testa e chi aiuta senza chiedere devozione, né firme. Davanti a **Morgana** fingeva di essere un esecutore soddisfatto, mentre di nascosto impediva i danni, aiutava le vittime e si prendeva il merito di disastri mai causati. Protegge chi si fida di lui e prende sul serio le promesse personali, forse perché sa fin troppo bene quanto può costare una firma. Usa il potere del Creditore contro tutto ciò che il Creditore rappresenta, e non è mai sicuro di stare vincendo. Il suo difetto è credere di poter affrontare ogni rischio da solo, con una buona bugia e senza dare spiegazioni.

**9. Che cosa pensa delle Congregazioni e di chi resta indipendente?**
Ufficialmente appartiene ancora alla Congregazione di Simpoh, tramite l'Ufficio delle Adesioni. Non ha mai lasciato ufficialmente il suo incarico, quindi forse risulta ancora in missione. Il suo potere però non è mai venuto da Simpoh, ma da un contratto firmato in una stanza segreta dell'Ufficio. Sa per esperienza che **Morgana** è crudele e usa il suo ruolo per ricattare gli indipendenti, ma non sa quanto Simpoh conosca dell'Accordo Privato, né se lo approvi o lo tolleri. Non crede che il drago sia malvagio e non condanna tutti i membri della Congregazione. Pensa che gli indipendenti abbiano il diritto di restare liberi e di ricevere aiuto senza firmare niente: una libertà che lui ha perso a diciotto anni. L'affetto per la sua famiglia e l'amicizia con **Lucerys** gli impediscono di confondere le persone con le istituzioni.`
};

// Kaean: tiefling warlock of the Fiend, level 3 (D&D 2024).
// Everything specific to this character lives here; the engine does the rest.
(() => {
const T = window.SheetTexts || {};

const INIT_ITEMS = [
  {n:'Armatura di cuoio borchiato', q:1, t:'CA 12 + Des = 14. Comprata: 45 mo.'},
  {n:'Pugnale', q:2, t:'1d4 perforanti, accurato, leggero, da lancio (6/18 m). Comprati: 2 mo l\'uno.'},
  {n:'Falcetto', q:1, t:'1d4 taglienti, leggero. Lo usa per potare, non per combattere. Comprato: 1 mo.'},
  {n:'Libro delle Ombre', q:1, t:'Il registro nero del Patto del Tomo. È anche il focus da incantatore.'},
  {n:'Pozione di guarigione', q:2, t:'Azione bonus: cura 2d4+2. Una comprata (50 mo), una come oggetto magico comune del 3° livello.'},
  {n:'Zaino', q:1, t:'Comprato: 2 mo.'},
  {n:'Giaciglio', q:1, t:'Comprato: 1 mo.'},
  {n:'Razioni', q:5, t:'Comprate: 5 ma l\'una.'},
  {n:'Otre', q:1, t:'Comprato: 2 ma.'},
  {n:'Strumenti da falsario', q:1, t:'Dal Ciarlatano. Inchiostri, penne, sigilli di cera, carta di vari tipi.'},
  {n:'Costume', q:1, t:'Dal Ciarlatano.'},
  {n:'Abiti pregiati', q:1, t:'Dal Ciarlatano. Neri: farsetto elegante, stivali lucidi, polsini abbottonati.'},
  {n:'Occhiali dalle lenti scure', q:1, t:'Oggetto personale, senza valore di gioco.'},
  {n:'Registro dell\'Ufficio', q:1, t:'Oggetto personale. Il secondo registro, nascosto nella carrozza. Mai riletto.'},
  {n:'Lettere di Elena', q:1, t:'Oggetto personale. Molte ancora chiuse.'}
];
const OLD_ITEMS = ['Armatura di cuoio', 'Focus arcano (sfera)', 'Libro (sapere occulto)', 'Dotazione da studioso', 'Abiti pregiati neri', 'Mele', 'Cesoie e attrezzi da giardino'];

Sheet.start({
  id:'kaean-warlock',
  storageKey:'kaean-warlock-v1',
  firebase:'https://kaean-scheda-default-rtdb.europe-west1.firebasedatabase.app/kaean-warlock.json',
  serviceWorker:'sw.js',
  version:5,
  title:'Kaean Warlock',
  name:'Kaean',
  subtitle:'Tiefling di Aurena, warlock dell\'Immondo, 3° livello',
  level:3, hitDie:8, hp:24, speed:'9 m',
  abilities:{for:10, des:14, cos:14, int:14, sag:11, car:18},
  saves:['sag', 'car'],
  skills:{'Arcano':1, 'Inganno':1, 'Percezione':1, 'Persuasione':1},
  spellcasting:{ability:'car', pact:{slots:2, level:2}, title:'Magia del patto'},

  build(c){
    const {M, fmt, dc:DC} = c;
    const VIGOR = 12, BLESS = Math.max(1, M.car + c.level), AOA = 5 * c.slotLevel;
    return {
      ac:12 + M.des,
      inspiration:'dm1d6',
      tipLabel:'Per Kaean',
      monogram:'mark',
      trackTab:'Patto',
      notesPlaceholder:'PNG, indizi, luoghi, firme, debiti...',
      senses:'Scurovisione 18 m',
      proficiencies:[['Armature', 'Leggere (indossa cuoio borchiato)'], ['Armi', 'Semplici'], ['Strumenti', 'Strumenti da falsario'], ['Lingue', 'Comune, Infernale, Elfico'], ['Resistenze', 'Fuoco'], ['Taglia', 'Media, 9 m di velocità']],
      scoresNote:'Tirati con 4d6: 17, 14, 13, 13, 11, 10. Il background dà +1 a Carisma, Intelligenza e Costituzione.',
      skillSource:{'Arcano':'Warlock', 'Inganno':'Warlock', 'Percezione':'background', 'Persuasione':'background'},
      skillInfo:{
        'Persuasione':'Convincere con onestà e buone maniere. Il suo talento naturale.',
        'Percezione':'Accorgersi di imboscate, porte nascoste e dettagli fuori posto. È la prova più richiesta al tavolo.',
        'Inganno':'Mentire in modo credibile, travestirsi, sviare. Il Metodo Kaeraldo.',
        'Intimidire':'Minacciare. Con le piante funziona benissimo.',
        'Intuizione':'Capire se qualcuno mente o cosa vuole davvero. Utile con Morgana.',
        'Natura':'Piante, animali, clima. Il suo pollice verde.',
        'Arcano':'Magia, patti, simboli, sigilli. Utile per studiare il sigillo sconosciuto.',
        'Rapidità di Mano':'Borseggiare, nascondere un oggetto, scambiare un documento.'
      },

      attacks:[
        {id:'eb', n:'Deflagrazione Occulta', range:'36 m', type:'forza', hit:'spell', dmg:c => `1d10+${c.M.car}`, info:'sp:eb'},
        {id:'fb', n:'Dardo di Fuoco', range:'36 m', type:'fuoco', hit:'spell', dmg:'1d10', info:'sp:fb'},
        {id:'dag', n:'Pugnale', range:'mischia o lancio 6/18 m', type:'perforanti', hit:'des', dmg:c => `1d4${fmt(c.M.des)}`},
        {id:'sick', n:'Falcetto', range:'mischia', type:'taglienti', hit:'for', dmg:c => '1d4' + (c.M.for ? fmt(c.M.for) : '')}
      ],

      effects:[
        {id:'hex', n:'Maleficio sul bersaglio', sub:'+1d6 necrotici a ogni colpo. Si accende da solo quando lo lanci', rider:'1d6', riderType:'necrotici', applies:['eb', 'dag', 'sick', 'ray'], conc:true, concName:'Maleficio', tag:'Maleficio', info:'sp:hex'},
        {id:'aoa', n:'Armatura di Agathys', sub:`${AOA} freddo a chi ti colpisce in mischia`, info:'sp:aoa', endsWithTemp:true, endsOn:'short',
          endMsg:'la brina svanisce', keepMsg:'la brina di Agathys resta attiva', tag:'Agathys', tagCls:'frost',
          retaliate:() => `Agathys: ${AOA} freddo all'attaccante, se era un colpo in mischia`}
      ],

      tempHp:[
        {id:'vigor', n:'Vigore Immondo', short:'Vigore Immondo', sub:'Azione, a volontà', info:'feat:vigor', amount:() => VIGOR, detail:'PF temporanei'},
        {id:'bless', n:'Benedizione dell\'Oscuro', short:'Benedizione', sub:'Quando un nemico va a 0 PF', info:'feat:bless', amount:() => BLESS, detail:'PF temporanei'}
      ],

      resources:[
        {id:'cunning', n:'Astuzia Magica', max:1, reset:'long', panel:'slots', info:'feat:cunning', usedLabel:'usata',
          sub:(c, S, x) => x.left <= 0 ? 'Torna con un riposo lungo' : x.slotsSpent ? '1 minuto, recupera 1 slot' : 'Si accende quando hai speso uno slot',
          uses:[{kind:'recover', slots:1, label:'Usa', msg:'1 slot recuperato'}]},
        {id:'rebuke', n:'Rimprovero Infernale', max:1, reset:'long', panel:'slots', info:'sp:rebuke', usedLabel:'usato',
          sub:'Reazione, gratis una volta per riposo lungo',
          uses:[{kind:'spell', spell:'rebuke', label:'Lancia 2d10', tag:'gratis'}]},
        {id:'luck', n:'Punti fortuna', title:'Fortuna', max:c => c.pb, reset:'long', style:'pips', pipCls:'luck', info:'feat:lucky',
          token:'punto fortuna', tokenLabel:'Punto fortuna', sub:'Tornano con un riposo lungo',
          uses:[{kind:'adv', label:'Vantaggio al prossimo d20', armed:'Pronto: vantaggio al prossimo d20'},
                {kind:'msg', label:'Svantaggio a chi ti attacca', title:'Fortunato', msg:(c, left) => `svantaggio al tiro per colpire contro di te • punti rimasti: ${left}`}]}
      ],

      potions:{'Pozione di guarigione':'2d4+2'},
      concAdvantage:false,
      shortRestText:'Tornano gli slot del patto. Puoi spendere dadi vita e riscrivere trucchetti e rituali del Libro delle Ombre. Il Maleficio resta, se mantieni la concentrazione.',
      shortRestDone:'slot recuperati • puoi cambiare trucchetti e rituali del Libro • rilancia Vigore Immondo',
      longRestText:'Tornano PF, slot, dadi vita, punti fortuna, Astuzia Magica e il Rimprovero gratuito. Finiscono concentrazione e PF temporanei.',
      longRestDone:'PF, slot, dadi vita, punti fortuna e risorse recuperati',

      spellSources:{w:'Warlock', f:'Patrono', t:'Libro delle Ombre', r:'Retaggio infernale', m:'Supplica'},
      spellGroups:[
        {title:'Trucchetti', note:'a volontà', f:s => s.l === 0},
        {title:'Con slot', note:'4 preparati, 4 del patrono', f:s => s.l > 0 && !s.free},
        {title:'Senza slot', note:'Vigore Immondo e rituali', f:s => s.free}
      ],
      spells:[
        {id:'eb', n:'Deflagrazione Occulta', l:0, src:'w', t:'Azione • 36 m', atk:1, dmg:() => `1d10+${M.car}`, dt:'forza',
          s:'Invocazione', ct:'Azione', rg:'36 m', cp:'V, S', du:'Istantanea',
          full:['Un raggio di energia crepitante colpisce una creatura entro gittata: tiro per colpire con incantesimo a distanza.', `Se colpisce, il bersaglio subisce 1d10 danni da forza. Con Deflagrazione Agonizzante aggiungi il Carisma (${fmt(M.car)}).`, 'Al 5° livello spari 2 raggi, all\'11° 3 raggi, al 17° 4 raggi, anche su bersagli diversi.'],
          tip:'Il tuo attacco di ogni turno. Con Maleficio sul bersaglio aggiungi 1d6 necrotici a ogni raggio che colpisce. Se hai un nemico adiacente tiri con svantaggio: allontanati o usa Passo Velato prima di sparare.'},
        {id:'fb', n:'Dardo di Fuoco', l:0, src:'r', t:'Azione • 36 m', atk:1, dmg:() => '1d10', dt:'fuoco',
          s:'Invocazione', ct:'Azione', rg:'36 m', cp:'V, S', du:'Istantanea',
          full:['Scagli un dardo di fuoco: tiro per colpire con incantesimo a distanza.', 'Se colpisce: 1d10 danni da fuoco. Un oggetto infiammabile non indossato o trasportato prende fuoco.'],
          tip:'Dal Retaggio Infernale. Fa meno danni della Deflagrazione: usalo solo contro chi resiste alla forza o per accendere qualcosa.'},
        {id:'mi', n:'Illusione Minore', l:0, src:'w', t:'Azione • 9 m • 1 minuto',
          s:'Illusione', ct:'Azione', rg:'9 m', cp:'S, M (un po\' di vello)', du:'1 minuto',
          full:['Crei un suono oppure l\'immagine di un oggetto (non più grande di un cubo di 1,5 m).', 'L\'immagine non emette luce, suono o odore; toccandola si capisce che è falsa.', `Una creatura che studia l'illusione con un'azione fa una prova di Intelligenza (Indagare) contro CD ${DC}: se riesce, capisce che è un'illusione.`],
          tip:'Una cassa per nascondersi, passi in un corridoio, una voce che chiama le guardie altrove. Ottima per i sabotaggi alla Kaean.'},
        {id:'tau', n:'Taumaturgia', l:0, src:'r', t:'Azione • 9 m • 1 minuto',
          s:'Trasmutazione', ct:'Azione', rg:'9 m', cp:'V', du:'Fino a 1 minuto',
          full:['Un piccolo prodigio: voce tre volte più forte, fiamme che tremolano, piccoli tremori, un suono improvviso, porte che sbattono, occhi che cambiano aspetto.', 'Fino a tre effetti attivi alla volta.'],
          tip:'Da Presenza Ultraterrena del tiefling. Per un tocco teatrale: gli occhi da serpente che brillano dietro le lenti.'},
        {id:'msg', n:'Messaggio', l:0, src:'t', t:'Azione • 36 m',
          s:'Trasmutazione', ct:'Azione', rg:'36 m', cp:'S, M (un filo di rame)', du:'1 round',
          full:['Sussurri un messaggio a una creatura entro gittata; solo lei lo sente e può rispondere con un sussurro.', 'Puoi lanciarlo attraverso gli oggetti se conosci il bersaglio e sai che è dall\'altra parte.'],
          tip:'Dal Libro delle Ombre. Perfetto per coordinarsi con Lucerys senza farsi sentire.'},
        {id:'sliver', n:'Scheggia Mentale', l:0, src:'t', t:'Azione • 18 m', save:'Int', dmg:() => '1d6', dt:'psichici',
          s:'Ammaliamento', ct:'Azione', rg:'18 m', cp:'V', du:'1 round',
          full:[`Una scheggia di energia psichica colpisce la mente di una creatura che vedi: TS di Intelligenza CD ${DC}.`, 'Se fallisce subisce 1d6 danni psichici e sottrae 1d4 al prossimo tiro salvezza che fa prima della fine del tuo prossimo turno.'],
          tip:'Dal Libro delle Ombre. Usala il turno prima di Blocca Persone o Comando, o prima di un incantesimo importante del bardo: il bersaglio ha in media 2,5 in meno al tiro salvezza. Quasi tutti i mostri hanno Intelligenza bassa.'},
        {id:'gui', n:'Guida', l:0, src:'t', t:'Azione • contatto • conc. 1 minuto', c:1,
          s:'Divinazione', ct:'Azione', rg:'Contatto', cp:'V, S', du:'Concentrazione, fino a 1 minuto',
          full:['Tocchi una creatura consenziente e scegli un\'abilità.', 'Finché dura, aggiunge 1d4 alle prove di caratteristica con quell\'abilità.'],
          tip:'Dal Libro delle Ombre. Lancialo su di te o su un compagno prima di una prova importante: +1d4 è come avere due punti e mezzo in più.'},

        {id:'hex', n:'Maleficio', l:1, src:'w', t:'Azione bonus • 27 m • conc. 4 ore', c:1, fx:'hex', quick:'Azione bonus, concentrazione: +1d6 a ogni colpo',
          s:'Ammaliamento', ct:'Azione bonus', rg:'27 m', cp:'V, S, M (l\'occhio pietrificato di un tritone)', du:'Concentrazione, fino a 4 ore (slot di 2°)',
          full:['Maledici una creatura che vedi. Quando la colpisci con un attacco, le infliggi 1d6 danni necrotici in più.', 'Scegli una caratteristica: il bersaglio ha svantaggio alle prove con quella caratteristica.', 'Se il bersaglio scende a 0 PF prima della fine, nei turni successivi puoi spostare la maledizione su un\'altra creatura con un\'azione bonus.'],
          tip:'Il compagno perfetto della Deflagrazione. Con uno slot di 2° dura 4 ore: se a fine scontro è ancora attivo, mantieni la concentrazione durante il riposo breve e riparti con 2 slot pieni e il Maleficio già lanciato.'},
        {id:'aoa', n:'Armatura di Agathys', l:1, src:'w', t:'Azione bonus • personale • 1 ora', fx:'aoa', temp:L => 5 * L, quick:`Azione bonus: ${AOA} PF temporanei e ${AOA} freddo a chi ti colpisce`,
          castMsg:L => `brina attiva per 1 ora: ${5 * L} freddo a chi ti colpisce in mischia`,
          s:'Abiurazione', ct:'Azione bonus', rg:'Personale', cp:'V, S, M (una scheggia di vetro blu)', du:'1 ora',
          full:[`Una brina magica ti ricopre: ottieni 5 PF temporanei per livello dello slot, quindi ${AOA} con uno slot di 2°.`, `Se una creatura ti colpisce con un attacco in mischia prima che l'incantesimo finisca, subisce ${AOA} danni da freddo (5 per livello dello slot).`, 'Dura 1 ora e finisce prima solo se resti senza PF temporanei. Nessuna concentrazione.'],
          tip:'È un\'azione bonus: la lanci e nello stesso turno usi la Deflagrazione. Per le regole 2024 la brina resta finché hai PF temporanei, anche se li rifai con Vigore Immondo o con la Benedizione dell\'Oscuro: chi ti colpisce in mischia continua a subire 10 danni da freddo. È una lettura discussa: chiedi conferma alla master.'},
        {id:'cmd', n:'Comando', l:1, src:'f', t:'Azione • 18 m',
          s:'Ammaliamento', ct:'Azione', rg:'18 m', cp:'V', du:'Istantanea',
          full:[`Pronunci un ordine di una parola a una creatura che vedi: TS di Saggezza CD ${DC}, se fallisce obbedisce nel suo turno successivo.`, 'Avvicinati, Lascia (l\'oggetto che tiene), Fuggi, A terra (cade prona), Fermo (non si muove e non agisce).', 'Funziona su qualsiasi creatura. Con uno slot di 2° bersagli 2 creature.'],
          tip:'Sempre preparato (patrono). Non richiede concentrazione, quindi lo usi con Maleficio attivo. "Fermo" fa perdere il turno, "A terra" dà vantaggio ai compagni in mischia, "Lascia" disarma, "Fuggi" allontana un nemico da te.'},
        {id:'burn', n:'Mani Brucianti', l:1, src:'f', t:'Azione • cono 4,5 m', save:'Des', dmg:L => `${L + 2}d6`, dt:'fuoco', half:1,
          s:'Invocazione', ct:'Azione', rg:'Cono di 4,5 m', cp:'V, S', du:'Istantanea',
          full:[`Un ventaglio di fiamme: ogni creatura nel cono fa un TS di Destrezza (CD ${DC}).`, 'Se fallisce subisce 3d6 danni da fuoco, metà se riesce. Con uno slot di 2°: 4d6.', 'Gli oggetti infiammabili non trasportati prendono fuoco.'],
          tip:'Sempre preparato (patrono). Contro gruppi vicini, ma ti porta in mischia: usalo e poi allontanati.'},
        {id:'rebuke', n:'Rimprovero Infernale', l:1, src:'r', t:'Reazione • 18 m', save:'Des', dmg:L => `${L + 1}d10`, dt:'fuoco', half:1, instant:1, freeWith:'rebuke',
          s:'Invocazione', ct:'Reazione, quando una creatura entro 18 m ti infligge danni', rg:'18 m', cp:'V, S', du:'Istantanea',
          full:[`La creatura che ti ha ferito è avvolta dalle fiamme: TS di Destrezza CD ${DC}.`, 'Se fallisce subisce 2d10 danni da fuoco, metà se riesce. Con uno slot di 2°: 3d10.', 'Retaggio Infernale: una volta per riposo lungo lo lanci gratis (al 1° livello); poi anche con uno slot.'],
          tip:'Danno ottimo per una reazione. Usa prima la versione gratuita.'},
        {id:'misty', n:'Passo Velato', l:2, src:'w', t:'Azione bonus • 9 m', quick:'Azione bonus: teletrasporto di 9 m',
          s:'Evocazione', ct:'Azione bonus', rg:'Personale', cp:'V', du:'Istantanea',
          full:['Avvolto per un istante da una nebbia argentea, ti teletrasporti fino a 9 m in uno spazio libero che vedi.'],
          tip:'La tua via di fuga: esci da una mischia o da una presa senza subire attacchi di opportunità, e nello stesso turno usi la Deflagrazione senza svantaggio. Non richiede concentrazione, quindi Maleficio resta attivo.'},
        {id:'hold', n:'Blocca Persone', l:2, src:'w', t:'Azione • 18 m • conc. 1 minuto', c:1,
          s:'Ammaliamento', ct:'Azione', rg:'18 m', cp:'V, S, M (un pezzetto di ferro dritto)', du:'Concentrazione, fino a 1 minuto',
          castMsg:() => `TS Saggezza CD ${DC} per il bersaglio`,
          full:[`Un umanoide che vedi fa un TS di Saggezza (CD ${DC}): se fallisce è Paralizzato.`, 'Alla fine di ogni suo turno ripete il TS: se riesce, l\'incantesimo finisce.', 'Contro un Paralizzato gli attacchi hanno vantaggio, e i colpi entro 1,5 m sono critici automatici.'],
          tip:'Il tuo incantesimo più forte contro un umanoide pericoloso. Avvisa i compagni in mischia: ogni loro colpo è un critico.'},
        {id:'ray', n:'Raggio Rovente', l:2, src:'f', t:'Azione • 36 m', atk:1, dmg:() => '2d6', dt:'fuoco', rays:3,
          s:'Invocazione', ct:'Azione', rg:'36 m', cp:'V, S', du:'Istantanea',
          full:['Crei tre raggi di fuoco e li scagli su uno o più bersagli entro gittata.', 'Fai un tiro per colpire con incantesimo a distanza per ogni raggio. Ogni raggio che colpisce infligge 2d6 danni da fuoco.'],
          tip:'Sempre preparato (patrono). Fino a 6d6 su un bersaglio. Con Maleficio già attivo, ogni raggio che colpisce il bersaglio maledetto fa +1d6 necrotici: è il tuo colpo più forte su un nemico solo.'},
        {id:'sugg', n:'Suggestione', l:2, src:'f', t:'Azione • 9 m • conc. 8 ore', c:1,
          s:'Ammaliamento', ct:'Azione', rg:'9 m', cp:'V, M (una goccia di miele)', du:'Concentrazione, fino a 8 ore',
          castMsg:() => `TS Saggezza CD ${DC} per il bersaglio`,
          full:[`Suggerisci una linea d'azione (massimo 25 parole) a una creatura che vedi e ti sente: TS di Saggezza CD ${DC}.`, 'Se fallisce è Affascinata e segue il suggerimento al meglio delle sue possibilità.', 'Il suggerimento deve sembrare ragionevole e non può spingerla a farsi del male in modo evidente. Finisce se tu o i tuoi alleati la danneggiate.'],
          tip:'Sempre preparato (patrono). L\'arma perfetta di un ex funzionario: "Sarebbe meglio controllare il magazzino a nord, no?"'},
        {id:'vigor', n:'Vita Falsata', l:1, src:'m', t:'Azione • personale', free:1, tempHp:'vigor',
          s:'Necromanzia', ct:'Azione', rg:'Personale', cp:'V, S, M (una goccia d\'alcol)', du:'Istantanea',
          full:[`Con Vigore Immondo la lanci su te stesso a volontà, senza slot, e ottieni sempre il massimo: ${VIGOR} PF temporanei.`, 'I PF temporanei non si sommano ad altri: tieni il valore più alto. Restano finché non li perdi o fino al prossimo riposo lungo.'],
          tip:`Lanciala dopo ogni scontro e ogni volta che scendi sotto i ${VIGOR} PF temporanei: entri in ogni combattimento con ${c.hp + VIGOR} PF effettivi invece di ${c.hp}.`},
        {id:'comp', n:'Comprendere Linguaggi', l:1, src:'t', t:'Rituale • 1 ora', ritual:1, free:1,
          s:'Divinazione', ct:'Azione o rituale (10 minuti in più)', rg:'Personale', cp:'V, S, M (un pizzico di fuliggine e sale)', du:'1 ora',
          full:['Capisci il significato letterale di qualunque lingua parlata che senti, e di qualunque testo scritto che tocchi (1 minuto per pagina).', 'Non decifra codici segreti né messaggi in simboli magici.'],
          tip:'Dal Libro delle Ombre, come rituale: nessuno slot. Utile con i documenti e i registri.'},
        {id:'det', n:'Individuazione del Magico', l:1, src:'t', t:'Rituale • conc. 10 minuti', c:1, ritual:1, free:1,
          s:'Divinazione', ct:'Azione o rituale (10 minuti in più)', rg:'Personale', cp:'V, S', du:'Concentrazione, fino a 10 minuti',
          full:['Percepisci la presenza di effetti magici entro 9 m.', 'Con un\'azione vedi un\'aura attorno a creature e oggetti magici visibili e ne capisci la scuola di magia.'],
          tip:'Dal Libro delle Ombre, come rituale: nessuno slot. Utile per capire se un sigillo o un contratto è magico.'}
      ],

      features:[
        {id:'pact', n:'Magia del Patto', g:'Warlock 1', full:['Hai 2 slot incantesimo, e sono sempre di 2° livello: ogni incantesimo che lanci con uno slot è potenziato al 2°.', 'Recuperi tutti gli slot con un riposo breve o lungo.', `Caratteristica da incantatore: Carisma. CD ${DC}, attacco ${fmt(c.spellAtk)}. Focus: il Libro delle Ombre.`]},
        {id:'invoc', n:'Suppliche Occulte', g:'Warlock 1', full:['Ne conosci 3: Deflagrazione Agonizzante, Vigore Immondo e Patto del Tomo.', 'Ogni volta che sali di livello da warlock puoi sostituirne una. Al 5° livello ne ottieni altre due.']},
        {id:'cunning', n:'Astuzia Magica', g:'Warlock 2', full:['Con un rito di 1 minuto recuperi slot del patto spesi fino a metà del massimo (arrotondato per eccesso): con 2 slot, ne recuperi 1.', 'Una volta per riposo lungo.']},
        {id:'tome', n:'Patto del Tomo', g:'Supplica', full:['Il tuo Libro delle Ombre: un registro nero dalla copertina sobria, che a volte sembra scritto con lo stesso inchiostro della firma sul polso.', 'Contiene 3 trucchetti presi da qualsiasi classe (Guida, Messaggio, Scheggia Mentale) e 2 rituali di 1° livello (Comprendere Linguaggi, Individuazione del Magico), sempre preparati.', 'Il libro riappare alla fine di ogni riposo breve o lungo, e ogni volta puoi scegliere trucchetti e rituali diversi: per esempio Mano Magica, Beffa Crudele, Allarme o Servitore Inosservato.', 'Puoi usarlo come focus da incantatore.']},
        {id:'agon', n:'Deflagrazione Agonizzante', g:'Supplica', full:[`Aggiungi il Carisma (${fmt(M.car)}) ai danni di Deflagrazione Occulta.`]},
        {id:'vigor', n:'Vigore Immondo', g:'Supplica', full:[`Lanci Vita Falsata su te stesso a volontà, senza slot, e ottieni sempre il massimo: ${VIGOR} PF temporanei.`, 'Usalo dopo ogni scontro: è la tua riserva di PF, e tiene viva la brina dell\'Armatura di Agathys.', 'Ai livelli alti dà pochi PF in proporzione: verso il 7°-9° livello conviene sostituirlo.']},
        {id:'bless', n:'Benedizione dell\'Oscuro', g:'Immondo 3', full:[`Quando riduci un nemico a 0 PF, ottieni ${BLESS} PF temporanei (Carisma + livello da warlock).`, 'Li ottieni anche se qualcun altro riduce a 0 PF un nemico entro 3 m da te.']},
        {id:'fiendspells', n:'Incantesimi dell\'Immondo', g:'Immondo 3', full:['Sempre preparati, non contano nel limite: Mani Brucianti, Comando, Raggio Rovente, Suggestione.']},
        {id:'dark', n:'Scurovisione', g:'Tiefling', full:['Vedi nella penombra entro 18 m come in luce intensa, e al buio come in penombra (solo in bianco e nero).']},
        {id:'legacy', n:'Retaggio Infernale', g:'Tiefling', full:['Resistenza ai danni da fuoco.', 'Conosci Dardo di Fuoco. Dal 3° livello Rimprovero Infernale, dal 5° Oscurità: ognuno una volta per riposo lungo senza slot, oppure con gli slot.', 'Usano il Carisma.']},
        {id:'presence', n:'Presenza Ultraterrena', g:'Tiefling', full:['Conosci il trucchetto Taumaturgia, con il Carisma.']},
        {id:'lucky', n:'Fortunato', g:'Talento d\'origine', full:[`Hai ${c.pb} punti fortuna, pari al bonus di competenza. Tornano tutti con un riposo lungo.`, 'Vantaggio: quando tiri un d20 per una prova, un attacco o un tiro salvezza, spendi 1 punto per avere vantaggio.', 'Svantaggio: quando una creatura tira per colpirti, spendi 1 punto per darle svantaggio.', 'Si decide al momento del tiro, non dopo aver visto il risultato.', 'Tienili per i tiri che contano: un tiro salvezza che ti toglierebbe il turno, la concentrazione su Blocca Persone, la prova sociale decisiva.']},
        {id:'scores', n:'Punteggi', g:'Background', full:['Tirati con 4d6 scartando il dado più basso: 17, 14, 13, 13, 11, 10 (totale 78).', 'Background: +1 a Carisma, Intelligenza e Costituzione (17→18, 13→14, 13→14). Il Carisma resta a 18.', 'L\'Intelligenza a 14 si addice all\'ex impiegato dell\'Ufficio delle Adesioni: sigilli, contratti e registri.', 'Al 4° livello: +2 al Carisma (20), oppure Incantatore da Guerra con +1 al Carisma.']},
        {id:'charl', n:'Ciarlatano (personalizzato)', g:'Background', full:['Costruito con le regole della Guida del Dungeon Master 2024: tre caratteristiche, un talento d\'origine, due abilità, uno strumento ed equipaggiamento per 50 mo.', 'Caratteristiche: Intelligenza, Costituzione, Carisma. Talento: Fortunato. Abilità: Persuasione e Percezione. Strumento: Strumenti da falsario.', 'È il Ciarlatano del manuale con Fortunato al posto di Abile: serve il sì della master.', 'Se preferisce i background del manuale, il Mercante dà Fortunato e le stesse caratteristiche (Costituzione, Intelligenza, Carisma), con Persuasione e Addestrare Animali.', 'Il background dell\'Ufficio delle Adesioni: documenti, firme e moduli non hanno segreti per lui.']}
      ],

      journals:[{id:'mark', n:'Il segno sul polso', field:'Nuova lettera', submit:'Annota il cambio', listTitle:'Registro delle lettere', doneLabel:'Il segno cambia',
        help:'Una lettera in corsivo elegante. A volte resta uguale per giorni, a volte cambia tre volte nella stessa giornata.',
        empty:'Ancora vuoto. Ogni volta che la lettera cambia, annotala con la data e cosa stava succedendo: magari prima o poi salta fuori uno schema.'}],
      counters:[{id:'debt', n:'Il debito col Creditore', sub:'La cifra sull\'ultimo foglio trovato in cucina', steps:[-1, 1, 10],
        note:'Non ha effetti di regole: segnalo quando la master te lo chiede, o quando usi il potere in modo vistoso.'}],

      items:INIT_ITEMS,
      coins:{ma:3, mo:9},
      invNote:T.carriage ? {title:'La carrozza', text:T.carriage} : null,
      guide:T.guide,
      story:T.story,
      background:T.background,
      backgroundTitle:'Chi è'
    };
  },

  // Saves written by older versions of this page
  migrate(s, from, c, D){
    if (from < 2) s.hp = {cur:24, temp:0};
    if (from < 3){
      const names = INIT_ITEMS.map(i => i.n), list = Array.isArray(s.items) ? s.items : [];
      const mine = list.filter(i => i && !names.includes(i.n) && !OLD_ITEMS.includes(i.n));
      delete s.mage; s.aoa = false; s.items = INIT_ITEMS.map(i => ({...i})).concat(mine); s.coins = {mr:0, ma:3, me:0, mo:9, mp:0};
    }
    if (from < 4){
      s.luck = 0;
      const arm = (Array.isArray(s.items) ? s.items : []).find(i => i && i.n === INIT_ITEMS[0].n);
      if (arm && /^CA 12 \+ Des = \d+\./.test(arm.t || '')) arm.t = INIT_ITEMS[0].t;
    }
    if (from < 5){
      s.slots = {l2:typeof s.slots === 'number' ? s.slots : 0};
      s.res = {luck:s.luck || 0, cunning:s.cunning ? 1 : 0, rebuke:s.rebuke ? 1 : 0};
      s.fx = {hex:!!s.hexOn, aoa:!!s.aoa};
      s.hdUsed = 3 - (typeof s.hd === 'number' ? s.hd : 3);
      s.counters = {debt:s.debt || 0};
      s.journals = {mark:Array.isArray(s.mark) ? s.mark : s.mark && typeof s.mark === 'object' ? Object.values(s.mark) : []};
      ['luck', 'cunning', 'rebuke', 'hexOn', 'aoa', 'hd', 'debt', 'mark'].forEach(k => delete s[k]);
    }
  }
});
})();

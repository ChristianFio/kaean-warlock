// Template for a new sheet. Copy this folder, rename it, fill in the fields and point index.html at it.
// Only id, storageKey, name, level, hp, abilities and build() are required; every other field is optional.
Sheet.start({
  id:'nuovo-pg',                      // used for backup files
  storageKey:'nuovo-pg-v1',           // unique per character on the same device
  firebase:null,                      // e.g. 'https://<db>.firebasedatabase.app/nuovo-pg.json' to sync between devices
  version:1,                          // raise it when you rename state fields, and handle it in migrate()
  name:'Nome', subtitle:'Umano guerriero, 1° livello',
  level:1, hitDie:10, hp:12, speed:'9 m',
  abilities:{for:16, des:12, cos:14, int:10, sag:12, car:8},
  saves:['for', 'cos'],
  skills:{'Atletica':1, 'Percezione':1}, // 1 = proficient, 2 = expertise
  spellcasting:null,                   // e.g. {ability:'sag', slots:{1:2}} or a warlock pact: {ability:'car', pact:{slots:2, level:2}}

  // c = {level, pb, M (ability modifiers), fmt, dc, spellAtk, slotLevel, hp}
  build(c){
    return {
      ac:16,
      inspiration:'heroic',            // 'heroic' (advantage) or 'dm1d6' (advantage + 1d6)
      senses:'',
      proficiencies:[['Armature', 'Tutte, scudi'], ['Armi', 'Semplici e da guerra']],
      attacks:[
        {id:'ls', n:'Spada lunga', range:'mischia', type:'taglienti', hit:'for', dmg:c => `1d8${c.fmt(c.M.for)}`}
      ],
      // Limited uses. reset: 'short' | 'long' | 'shortOne'. panel: 'own' | 'defense' | 'slots'.
      // uses kinds: 'adv' (advantage on the next d20), 'heal' (expr), 'roll' (expr), 'spell' (free cast), 'recover' (slots), 'msg'
      resources:[
        {id:'sw', n:'Recuperare Energie', max:1, reset:'short', panel:'defense', sub:'Azione bonus',
          uses:[{kind:'heal', label:'Cura 1d10+1', expr:c => `1d10+${c.level}`}]}
      ],
      // Toggles. rider adds dice to the listed attacks; conc ties it to concentration; endsWithTemp ends it at 0 temp HP
      effects:[],
      tempHp:[],                       // {id, n, amount:c => number}
      spells:[],                       // see characters/kaean-warlock/character.js for the full spell format
      features:[{id:'style', n:'Stile di combattimento', g:'Guerriero 1', full:['Difesa: +1 alla CA con l\'armatura.']}],
      journals:[],                     // dated logs, e.g. a mark that changes
      counters:[],                     // free counters, e.g. a debt
      items:[{n:'Spada lunga', q:1, t:'1d8 taglienti'}],
      coins:{mo:10},
      potions:{'Pozione di guarigione':'2d4+2'},
      guide:null, story:'', background:''  // background accepts simple markdown: ## chapters, **bold**, ==key sentence==
    };
  },

  migrate(state, fromVersion){}        // convert saves made with older versions
});

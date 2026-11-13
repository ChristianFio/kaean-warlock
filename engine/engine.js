/* Character sheet engine: rules, state, sync and UI shared by every sheet.
   A sheet calls Sheet.start(definition); see characters/_template/character.js. */
(() => {
'use strict';

// Utilities
const fmt = n => (n >= 0 ? '+' : '−') + Math.abs(n);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid = () => Math.random().toString(36).slice(2, 9);
const num = (v, d = 0) => { const n = typeof v === 'string' && v.trim() !== '' ? Number(v) : v; return typeof n === 'number' && isFinite(n) ? n : d; };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rnd = n => { const a = new Uint32Array(1); crypto.getRandomValues(a); return (a[0] % n) + 1; };
const mod = s => Math.floor((s - 10) / 2);
const sid = v => String(v ?? '').replace(/[^\w-]/g, '').slice(0, 24) || uid();
const isObj = o => o && typeof o === 'object' && !Array.isArray(o);
const stable = v => Array.isArray(v) ? '[' + v.map(stable).join(',') + ']' : isObj(v) ? '{' + Object.keys(v).sort().map(k => JSON.stringify(k) + ':' + stable(v[k])).join(',') + '}' : JSON.stringify(v);

function rollExpr(expr, crit){
  const clean = String(expr).replace(/[−–]/g, '-').replace(/\s+/g, '').toLowerCase();
  if (!clean || clean.length > 60 || !/^[+-]?(\d{0,3}d\d{1,3}|\d{1,4})([+-](\d{0,3}d\d{1,3}|\d{1,4}))*$/.test(clean)) return null;
  let total = 0; const parts = []; let bad = false;
  clean.replace(/([+-]?)(\d*)d(\d+)|([+-]?)(\d+)/g, (m, s1, cnt, sides, s2, n) => {
    if (sides){
      let c = parseInt(cnt || '1', 10), f = parseInt(sides, 10);
      if (!c || f < 2){ bad = true; return m; }
      if (crit) c *= 2;
      c = Math.min(c, 100);
      const sign = s1 === '-' ? -1 : 1, rolls = [];
      for (let i = 0; i < c; i++) rolls.push(rnd(f));
      total += sign * rolls.reduce((a, b) => a + b, 0);
      parts.push(`${sign < 0 ? '−' : ''}${c}d${f}[${rolls.join(',')}]`);
    } else { const v = parseInt(n, 10) * (s2 === '-' ? -1 : 1); total += v; parts.push(fmt(v)); }
    return m;
  });
  return bad ? null : {total, text:parts.join(' ')};
}

// Small markdown: ## headings, ### subheadings, paragraphs, lists, **bold**, *italic*, ==key sentences==, ---
function md(text){
  const inline = s => esc(s).replace(/==(.+?)==/g, '<mark>$1</mark>').replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<em>$1</em>');
  const out = []; let list = null, para = [];
  const flushP = () => { if (para.length){ out.push('<p>' + inline(para.join(' ')) + '</p>'); para = []; } };
  const flushL = () => { if (list){ out.push('<ul>' + list.map(i => '<li>' + inline(i) + '</li>').join('') + '</ul>'); list = null; } };
  for (const raw of String(text).split('\n')){
    const l = raw.trim();
    if (!l){ flushP(); flushL(); continue; }
    if (/^---+$/.test(l)){ flushP(); flushL(); continue; }
    let m;
    if ((m = l.match(/^(#{2,3})\s+(.*)$/))){ flushP(); flushL(); out.push(`<h${m[1].length === 2 ? 2 : 3}>${inline(m[2])}</h${m[1].length === 2 ? 2 : 3}>`); continue; }
    if ((m = l.match(/^[-*•]\s+(.*)$/))){ flushP(); (list = list || []).push(m[1]); continue; }
    if ((m = l.match(/^\*\*(\d+\.\s[^*]+)\*\*$/))){ flushP(); flushL(); out.push(`<h3>${inline(m[1])}</h3>`); continue; }
    flushL(); para.push(l);
  }
  flushP(); flushL();
  return out.join('\n');
}
function chapters(text){
  const parts = String(text).split(/^## /m), res = [];
  const intro = parts[0].replace(/^# .*$/m, '').trim();
  if (intro) res.push({title:null, html:md(intro)});
  for (const p of parts.slice(1)){ const i = p.indexOf('\n'); res.push({title:p.slice(0, i < 0 ? undefined : i).trim(), html:md(i < 0 ? '' : p.slice(i + 1))}); }
  return res;
}

const ABBR = {for:'For', des:'Des', cos:'Cos', int:'Int', sag:'Sag', car:'Car'};
const ABN = {for:'Forza', des:'Destrezza', cos:'Costituzione', int:'Intelligenza', sag:'Saggezza', car:'Carisma'};
const SKILL_LIST = [['Acrobazia','des'],['Addestrare Animali','sag'],['Arcano','int'],['Atletica','for'],['Furtività','des'],['Indagare','int'],['Inganno','car'],['Intimidire','car'],['Intrattenere','car'],['Intuizione','sag'],['Medicina','sag'],['Natura','int'],['Percezione','sag'],['Persuasione','car'],['Rapidità di Mano','des'],['Religione','int'],['Sopravvivenza','sag'],['Storia','int']];
const CONDS = ['Accecato','Affascinato','Afferrato','Assordato','Avvelenato','Incapacitato','Invisibile','Paralizzato','Pietrificato','Prono','Spaventato','Stordito','Svenuto','Trattenuto'];
const MONTHS = ['gen','feb','mar','apr','mag','giu','lug','ago','set','ott','nov','dic'];
const ICON = {
  combat:'<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  spells:'<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
  dice:'<path d="M12 2.5l8.2 4.75v9.5L12 21.5l-8.2-4.75v-9.5z"/><path d="M12 7.5l4.3 7.2H7.7z"/><path d="M12 2.5v5M16.3 14.7l3.9 2M7.7 14.7l-3.9 2"/>',
  sheet:'<path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/><path d="M15 8h-5M15 12h-5"/>',
  diary:'<path d="M20.2 12.2a6 6 0 0 0-8.5-8.5L5 10.5V19h8.5z"/><path d="M16 8 2 22"/><path d="M17.5 15H9"/>',
  moon:'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>',
  fsOn:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  fsOff:'<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>'
};
const svg = (k, cls = '') => `<svg${cls ? ` class="${cls}"` : ''} viewBox="0 0 24 24" aria-hidden="true">${ICON[k]}</svg>`;

function start(DEF){
  // Derived numbers and character data
  const LVL = DEF.level, PB = DEF.proficiency || (2 + Math.floor((LVL - 1) / 4));
  const M = Object.fromEntries(Object.entries(DEF.abilities).map(([k, s]) => [k, mod(s)]));
  const SC = DEF.spellcasting || null;
  const SA = SC ? M[SC.ability] : 0, DC = 8 + PB + SA, SATK = PB + SA;
  const SLOTS = SC ? (SC.pact ? {[SC.pact.level]: SC.pact.slots} : {...SC.slots}) : {};
  const SLOT_LVLS = Object.keys(SLOTS).map(Number).sort((a, b) => a - b);
  const MAXL = SLOT_LVLS.length ? SLOT_LVLS[SLOT_LVLS.length - 1] : 0;
  const c = {level:LVL, pb:PB, M, mod, fmt, esc, dc:DC, spellAtk:SATK, slotLevel:MAXL, hp:DEF.hp};
  const D = DEF.build(c);
  const PROF = DEF.skills || {}, SAVES = new Set(DEF.saves || []);
  const SKILLS = SKILL_LIST.map(([n, ab]) => [n, ab, num(PROF[n])]);
  const skillMod = (ab, p) => M[ab] + p * PB;
  const PASSIVE = 10 + skillMod('sag', num(PROF['Percezione']));
  const AC = typeof D.ac === 'function' ? D.ac(c) : D.ac;
  const HD = DEF.hitDie || 8, HD_MAX = LVL, BASE_HP = DEF.hp, VER = DEF.version || 1;
  const SPELLS = D.spells || [], ATTACKS = D.attacks || [], RES = D.resources || [], FX = D.effects || [], TEMP = D.tempHp || [];
  const FEATS = D.features || [], JOURNALS = D.journals || [], COUNTERS = D.counters || [];
  const POTIONS = D.potions || {}, INSP = D.inspiration || 'heroic';
  const resMax = r => typeof r.max === 'function' ? r.max(c) : r.max;
  const spellBy = id => SPELLS.find(s => s.id === id);
  const fxBy = id => FX.find(f => f.id === id);
  const resBy = id => RES.find(r => r.id === id);
  const tempBy = id => TEMP.find(t => t.id === id);

  // State
  const fresh = () => ({
    ver:VER, hp:{cur:BASE_HP, temp:0}, hdUsed:0, slots:Object.fromEntries(SLOT_LVLS.map(l => ['l' + l, 0])),
    res:Object.fromEntries(RES.map(r => [r.id, 0])), fx:Object.fromEntries(FX.map(f => [f.id, false])),
    conc:null, concDc:0, death:{s:0, f:0}, conds:[], exh:0, insp:0,
    counters:Object.fromEntries(COUNTERS.map(k => [k.id, 0])), journals:Object.fromEntries(JOURNALS.map(j => [j.id, []])),
    items:(D.items || []).map(i => ({id:uid(), ...i})), coins:{mr:0, ma:0, me:0, mo:0, mp:0, ...(D.coins || {})},
    notes:'', noteList:[], log:[], updatedAt:0
  });
  // Fill missing fields and repair wrong types, so a damaged save never crashes the page
  function sanitize(o){
    const f = fresh(), s = isObj(o) ? o : {};
    const objOf = (v, def, fn) => { const r = {...def}; if (isObj(v)) for (const k of Object.keys(def)) if (k in v) r[k] = fn(v[k], def[k]); return r; };
    const arr = v => Array.isArray(v) ? v.filter(x => x != null) : isObj(v) ? Object.values(v).filter(x => x != null) : [];
    const out = {
      ver:num(s.ver, 0), updatedAt:num(s.updatedAt, 0),
      hp:{cur:clamp(Math.round(num(s.hp && s.hp.cur, BASE_HP)), 0, 999), temp:clamp(Math.round(num(s.hp && s.hp.temp, 0)), 0, 999)},
      hdUsed:clamp(num(s.hdUsed, 0), 0, HD_MAX),
      slots:objOf(s.slots, f.slots, (v, d) => clamp(num(v, d), 0, 9)),
      res:objOf(s.res, f.res, (v, d) => clamp(num(v, d), 0, 99)),
      fx:objOf(s.fx, f.fx, v => v === true),
      conc:typeof s.conc === 'string' && s.conc ? s.conc : null, concDc:num(s.concDc, 0),
      death:{s:clamp(num(s.death && s.death.s, 0), 0, 3), f:clamp(num(s.death && s.death.f, 0), 0, 3)},
      conds:arr(s.conds).filter(x => CONDS.includes(x)), exh:clamp(num(s.exh, 0), 0, 6), insp:clamp(num(s.insp, 0), 0, 99),
      counters:objOf(s.counters, f.counters, (v, d) => num(v, d)),
      journals:objOf(s.journals, f.journals, v => arr(v).filter(e => isObj(e) && e.l != null).map(e => ({id:sid(e.id), l:String(e.l).slice(0, 2), t:num(e.t, Date.now()), n:String(e.n || '')}))),
      items:('items' in s ? arr(s.items) : f.items).filter(isObj).map(i => ({id:sid(i.id), n:String(i.n ?? 'Oggetto'), q:clamp(Math.round(num(i.q, 1)), 0, 9999), t:String(i.t || '')})),
      coins:objOf(s.coins, f.coins, (v, d) => clamp(Math.round(num(v, d)), 0, 9999999)),
      notes:typeof s.notes === 'string' ? s.notes : '',
      noteList:arr(s.noteList).filter(isObj).map(n => ({id:sid(n.id), x:String(n.x ?? ''), t:num(n.t, 0)})).filter(n => n.x.trim()),
      log:arr(s.log).filter(isObj).slice(0, 40).map(e => ({t:num(e.t, 0), label:String(e.label ?? ''), total:e.total ?? '', detail:String(e.detail ?? ''), kind:String(e.kind || '')}))
    };
    if (!('items' in s) && s.ver) out.items = [];
    // Free-text notes from older versions become a list of points (ids are fixed so every device converts them the same way)
    if (!('noteList' in s) && out.notes.trim()){
      const t = out.notes.replace(/\r/g, '').trim(), parts = /\n\s*\n/.test(t) ? t.split(/\n\s*\n/) : t.split('\n');
      out.noteList = parts.map(x => x.trim()).filter(Boolean).map((x, i) => ({id:'old' + i, x, t:0}));
      out.notes = '';
    }
    return out;
  }
  // Older saves: the character converts its own legacy fields first
  function upgrade(o){
    const s = isObj(o) ? JSON.parse(JSON.stringify(o)) : {};
    const from = num(s.ver, 1);
    if (from < VER && DEF.migrate) DEF.migrate(s, from, c, D);
    const out = sanitize(s);
    const changed = out.ver !== VER;
    out.ver = VER;
    return {state:out, changed};
  }
  const store = {
    ok:true,
    get(k){ try { return localStorage.getItem(k); } catch (e) { this.ok = false; return null; } },
    set(k, v){ try { localStorage.setItem(k, v); this.ok = true; } catch (e) { this.ok = false; } }
  };
  const KEY = DEF.storageKey, BASE_KEY = KEY + ':base';
  function load(){
    const raw = store.get(KEY);
    if (raw){ try { return upgrade(JSON.parse(raw)).state; } catch (e) { store.set(KEY + ':broken', raw); } }
    return sanitize({...fresh(), ver:VER});
  }
  let S = load();

  // Undo
  const UNDO = [];
  let lastJson = JSON.stringify(S);

  // UI state
  const TRACK = JOURNALS.length || COUNTERS.length;
  const TABS = {combat:['combat'], spells:['spells'], sheet:['sheet', 'feat', 'inv'], diary:['notes', ...(TRACK ? ['track'] : []), ...(D.guide ? ['guide'] : []), 'story']};
  const SUB_LBL = {sheet:'Prove', feat:'Privilegi', inv:'Zaino', notes:'Note', track:D.trackTab || 'Registro', guide:'Guida', story:'Storia'};
  let tab = 'combat'; const sub = {sheet:'sheet', diary:'notes'};
  const cur = () => TABS[tab].length > 1 ? sub[tab] : TABS[tab][0];
  let rollMode = 'norm', useInsp = false, armed = null, openSpell = null, lastCrit = false;
  let sheet = null, hpBuf = '', exprVal = '', lastD20 = null, lastFollow = [], resultOpen = false, flash = false, confirmKey = null, confirmTimer = null;

  // Sync: Firebase REST + EventSource. Top-level fields edited here win over the
  // remote copy only when they changed since the last synced version ("base").
  let base = null; try { base = JSON.parse(store.get(BASE_KEY) || 'null'); } catch (e) {}
  // Until the first remote snapshot arrives nothing is written: a stale or empty device must never overwrite the shared copy.
  // Without a stored base, the reference is the state this page loaded with, so only what was edited here can win.
  let es = null, syncState = DEF.firebase ? 'saving' : 'local', saving = false, saveAgain = false, saveTimer = null, retryTimer = null, retryMs = 4000, ready = false, ref = JSON.parse(JSON.stringify(S)), tooOld = false;
  const BK_KEY = KEY + ':backups';
  function backup(){
    let list = []; try { list = JSON.parse(store.get(BK_KEY) || '[]'); } catch (e) {}
    list.unshift({t:Date.now(), state:S}); store.set(BK_KEY, JSON.stringify(list.slice(0, 5)));
  }
  const norm = o => stable(sanitize(o));
  function setBase(o){ base = JSON.parse(JSON.stringify(o)); store.set(BASE_KEY, JSON.stringify(base)); }
  function persist(){ store.set(KEY, JSON.stringify(S)); }
  function commit(opts = {}){
    S.updatedAt = Date.now();
    const json = JSON.stringify(S);
    if (opts.undo !== false && json !== lastJson){ UNDO.push(lastJson); if (UNDO.length > 30) UNDO.shift(); }
    lastJson = JSON.stringify(S);
    persist();
    if (opts.render !== false) render();
    queueSave();
  }
  function queueSave(){ if (!DEF.firebase) return; clearTimeout(saveTimer); saveTimer = setTimeout(flush, 600); }
  async function flush(keepalive){
    if (!DEF.firebase || syncState === 'readonly' || !ready || tooOld) return;
    if (saving){ saveAgain = true; return; }
    if (base && norm(base) === norm(S)){ syncState = 'synced'; renderSync(); return; }
    saving = true; syncState = 'saving'; renderSync();
    const body = JSON.parse(JSON.stringify(S));
    try {
      const r = await fetch(DEF.firebase, {method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body), keepalive:!!keepalive});
      if (r.status === 401 || r.status === 403){ syncState = 'readonly'; }
      else if (!r.ok) throw new Error(r.status);
      else { setBase(body); syncState = 'synced'; retryMs = 4000; }
    } catch (e) {
      syncState = 'error';
      clearTimeout(retryTimer); retryTimer = setTimeout(() => flush(), retryMs); retryMs = Math.min(retryMs * 2, 60000);
    }
    saving = false; renderSync();
    if (saveAgain){ saveAgain = false; flush(); }
  }
  function onRemote(remote){
    ready = true;
    if (remote == null){ flush(); return; }
    if (isObj(remote) && num(remote.ver) > VER){ tooOld = true; syncState = 'error'; renderSync(); toast('La scheda è stata aggiornata su un altro dispositivo: ricarica la pagina.'); return; }
    const up = upgrade(remote), R = up.state;
    if (base && norm(base) === norm(R) && !up.changed){ if (norm(S) !== norm(base)) flush(); else { syncState = 'synced'; renderSync(); } return; }
    const local = S, b = sanitize(base || ref), merged = JSON.parse(JSON.stringify(R));
    let keptLocal = false;
    for (const k of Object.keys(local)){
      if (k === 'updatedAt' || k === 'ver') continue;
      const mine = stable(local[k]);
      if (mine !== stable(b[k]) && mine !== stable(R[k])){ merged[k] = local[k]; keptLocal = true; }
    }
    setBase(remote);
    if (stable(merged) !== stable(S)){ backup(); S = merged; ref = JSON.parse(JSON.stringify(S)); lastJson = JSON.stringify(S); persist(); render(); }
    if (keptLocal || up.changed) flush(); else { syncState = 'synced'; renderSync(); }
  }
  function connect(){
    if (!DEF.firebase || !window.EventSource) { syncState = 'local'; renderSync(); return; }
    try { if (es) es.close(); } catch (e) {}
    es = new EventSource(DEF.firebase);
    const refetch = () => fetch(DEF.firebase).then(r => r.json()).then(onRemote).catch(() => {});
    es.addEventListener('put', e => { try { const m = JSON.parse(e.data); if (m.path === '/') onRemote(m.data); else refetch(); } catch (x) {} });
    es.addEventListener('patch', refetch);
    es.addEventListener('cancel', () => { syncState = 'readonly'; renderSync(); });
    es.onerror = () => { if (es.readyState === 2){ syncState = 'error'; renderSync(); setTimeout(connect, 5000); } };
  }
  window.addEventListener('online', () => { connect(); flush(); });
  const saveNow = () => { flushNotes(); if (base && norm(base) !== norm(S)) flush(true); };
  window.addEventListener('pagehide', saveNow);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') saveNow(); });

  // Dice
  function show(label, total, detail, kind, follow, replace){
    const entry = {t:Date.now(), label, total, detail, kind:kind || ''};
    if (replace && S.log.length) S.log[0] = entry; else S.log.unshift(entry);
    S.log = S.log.slice(0, 40);
    lastFollow = follow || []; resultOpen = true; flash = true; lastCrit = false;
  }
  const advRes = RES.filter(r => (r.uses || []).some(u => u.kind === 'adv'));
  function d20(label, m, opts = {}){
    let adv = rollMode === 'adv' || !!opts.adv, dis = rollMode === 'dis' || !!opts.dis, bonus = 0, extra = '', plain = !adv && !dis;
    if (useInsp && S.insp > 0){ S.insp -= 1; adv = true; plain = false; if (INSP === 'dm1d6'){ bonus = rnd(6); extra += ` • ispirazione +1d6[${bonus}]`; } else extra += ' • ispirazione'; }
    if (armed){ const r = resBy(armed); if (r && S.res[r.id] < resMax(r)){ if (adv && !dis) extra += ` • ${r.token || 'risorsa'} non speso: avevi già vantaggio`; else { S.res[r.id] += 1; adv = true; plain = false; extra += ` • ${r.token || 'risorsa'}`; } } }
    useInsp = false; armed = null; rollMode = 'norm';
    if (adv && dis){ adv = dis = false; }
    const a = rnd(20), b = rnd(20);
    lastD20 = plain ? {label, m, a, opts} : null;
    return paint(label, m, a, b, adv ? 'adv' : dis ? 'dis' : 'norm', bonus, extra, opts, false);
  }
  function paint(label, m, a, b, mode, bonus, extra, opts, replace){
    const k = mode === 'adv' ? Math.max(a, b) : mode === 'dis' ? Math.min(a, b) : a;
    const exh = -2 * S.exh;
    const kind = k === 20 ? 'crit' : k === 1 ? 'fumble' : '';
    const crit = !!opts.attack && k === 20;
    const dTxt = mode === 'norm' ? `d20[${k}]` : `d20[${a},${b}] ${mode === 'adv' ? 'vant.' : 'svant.'}`;
    const follow = [];
    if (opts.follow) follow.push({...opts.follow, t:opts.follow.t + (crit ? ', dadi doppi' : ''), p:1});
    if (lastD20) follow.push({t:'Vantaggio', a:'reroll', m:'adv'}, {t:'Svantaggio', a:'reroll', m:'dis'});
    show(label + (crit ? ' • CRITICO' : ''), k + m + bonus + exh, `${dTxt} ${fmt(m)}${extra}${exh ? ` • ${fmt(exh)} indebolimento` : ''}`, kind, follow, replace);
    lastCrit = crit; commit();
    return {k, total:k + m + bonus + exh};
  }
  // Damage dice double only when rolled from the result bar right after a natural 20
  function rollDmg(label, expr, suffix, crit){
    const r = rollExpr(expr, crit);
    if (!r) return null;
    show(label + (crit ? ' (critico)' : ''), r.total, r.text + (suffix ? ' • ' + suffix : ''));
    commit();
    return r;
  }

  // Effects that add damage dice to some attacks or spells
  const riderFor = id => FX.filter(f => S.fx[f.id] && f.rider && (f.applies || []).includes(id));
  const withRiders = (id, expr) => expr + riderFor(id).map(f => '+' + f.rider).join('');
  const riderTxt = id => riderFor(id).map(f => ' + ' + (f.riderType || 'extra')).join('');
  const atkBonus = a => a.hit === 'spell' ? SATK : PB + M[a.hit] + num(a.bonus);
  const atkDmg = a => withRiders(a.id, typeof a.dmg === 'function' ? a.dmg(c) : a.dmg);
  const spDmg = (sp, L) => withRiders(sp.id, sp.dmg(L ?? (sp.l === 0 ? 0 : MAXL), c));

  // HP
  const maxHp = () => BASE_HP;
  function damage(n){
    if (!(n > 0)) return;
    let rest = n;
    const t = Math.min(S.hp.temp, rest); S.hp.temp -= t; rest -= t;
    const wasUp = S.hp.cur > 0, before = S.hp.cur, follow = [];
    S.hp.cur = Math.max(0, S.hp.cur - rest);
    let msg = `${n} danni${t ? `, ${t} sui temporanei` : ''} • PF ${S.hp.cur}/${maxHp()}`;
    if (S.hp.cur === 0 && wasUp){ if (rest - before >= maxHp()){ S.death.f = 3; msg += ' • il danno in eccesso supera i PF massimi: morte istantanea'; } else msg += ' • a terra: tiri contro la morte'; if (S.conc) endConc(); }
    else if (S.hp.cur === 0 && rest > 0){ S.death.f = Math.min(3, S.death.f + (n >= maxHp() ? 3 : 1)); msg += n >= maxHp() ? ' • morte istantanea' : ' • un fallimento contro la morte'; }
    else if (S.conc){ S.concDc = clamp(Math.floor(n / 2), 10, 30); msg += ` • TS Cos CD ${S.concDc} per ${S.conc}`; follow.push({t:`TS concentrazione ${fmt(M.cos + (SAVES.has('cos') ? PB : 0))}`, a:'concsave', p:1}); }
    for (const f of FX.filter(f => S.fx[f.id])){
      if (f.retaliate) msg += ' • ' + f.retaliate(c);
      if (f.endsWithTemp && S.hp.temp === 0){ S.fx[f.id] = false; msg += ` • ${f.endMsg || f.n + ' termina'}`; }
    }
    show('Danni subiti', n, msg, 'fumble', follow); commit();
  }
  function wake(){ if (S.hp.cur === 0){ S.death = {s:0, f:0}; S.conds = S.conds.filter(x => x !== 'Svenuto'); } }
  function heal(n, label = 'Cure ricevute', detail = ''){
    if (!(n > 0)) return;
    wake(); S.hp.cur = Math.min(maxHp(), S.hp.cur + n);
    show(label, n, (detail ? detail + ' • ' : '') + `PF ${S.hp.cur}/${maxHp()}`); commit();
  }
  function tempHp(n, label, detail){
    const before = S.hp.temp; S.hp.temp = Math.max(S.hp.temp, n);
    const keep = FX.filter(f => S.fx[f.id] && f.endsWithTemp && f.keepMsg).map(f => ' • ' + f.keepMsg).join('');
    show(label, n, (detail || '') + (before >= n ? ` • ne avevi già ${before}: resta il valore più alto` : ' • non si sommano: resta il valore più alto') + keep); commit();
  }
  function endConc(){ S.conc = null; S.concDc = 0; FX.filter(f => f.conc).forEach(f => S.fx[f.id] = false); }
  function setConc(name, fxId){
    const prev = S.conc; endConc(); S.conc = name; if (fxId) S.fx[fxId] = true;
    return prev && prev !== name ? ` • ${prev} termina` : '';
  }

  // Render helpers
  const info = key => `<button class="info" data-info="${key}" aria-label="Dettagli"></button>`;
  const sw = (a, id, on, label) => `<button class="sw" role="switch" aria-checked="${on ? 'true' : 'false'}" data-a="${a}" data-id="${id}" aria-label="${esc(label)}"><i></i></button>`;
  const pips = (n, used, act, id, cls = '') => Array.from({length:n}, (_, i) => `<button class="pip ${cls} ${i < n - used ? 'on' : ''}" data-a="${act}" data-id="${id}" data-i="${i}" aria-label="${i < n - used ? 'Disponibile' : 'Speso'}"></button>`).join('');
  const slotLeft = L => SLOTS[L] - S.slots['l' + L];
  const slotsAny = () => SLOT_LVLS.some(L => slotLeft(L) > 0);
  const slotsSpent = () => SLOT_LVLS.some(L => S.slots['l' + L] > 0);
  const seals = L => Array.from({length:SLOTS[L]}, (_, i) => { const on = i < slotLeft(L); return `<button class="slot${on ? ' on' : ''}" data-a="slot" data-l="${L}" data-i="${i}" aria-label="Slot di ${L}° livello ${i + 1}: ${on ? 'disponibile' : 'speso'}"></button>`; }).join('');
  const when = t => { const d = new Date(t); return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
  const span = ms => { const m = Math.round(Math.abs(ms) / 60000), h = Math.round(m / 60), d = Math.round(h / 24); return m < 60 ? `${m} min` : h < 48 ? `${h} ${h === 1 ? 'ora' : 'ore'}` : `${d} giorni`; };
  const localNow = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 16); };
  const SYNC_TXT = {local:'Salvata solo su questo dispositivo', saving:'Sincronizzazione in corso', synced:'Sincronizzata con gli altri dispositivi', error:'Offline: salvata qui, riprovo da sola', readonly:'Sincronizzazione non autorizzata: salvata solo qui'};
  const slotSummary = () => SLOT_LVLS.map(L => slotLeft(L)).join('·');

  function renderSync(){
    document.body.dataset.sync = syncState;
    const d = document.getElementById('syncdot'); if (d) d.className = 'syncdot ' + syncState;
    const el = document.getElementById('syncst'); if (el) el.textContent = SYNC_TXT[syncState] + (store.ok ? '' : '. Attenzione: il browser non permette di salvare su questo dispositivo.');
  }
  function renderBrand(){
    const j = D.monogram && JOURNALS.find(x => x.id === D.monogram);
    const m = j && [...S.journals[j.id]].sort((a, b) => b.t - a.t)[0];
    const el = document.getElementById('mono');
    if (el){ el.hidden = !j; if (j){ el.textContent = m ? m.l : '?'; el.setAttribute('aria-label', `${j.n}: ${m ? m.l : 'nessuna'}. Apri il registro`); } }
  }
  function renderHeader(){
    const mh = maxHp(), tot = Math.max(mh, S.hp.cur + S.hp.temp), w1 = Math.round(100 * S.hp.cur / tot), w2 = Math.round(100 * S.hp.temp / tot), tags = [];
    if (S.hp.cur === 0) tags.push('<span class="tag">A terra</span>');
    else if (S.hp.cur <= mh / 2) tags.push('<span class="tag">Sanguinante</span>');
    if (S.conc) tags.push(`<span class="tag gold">Concentrazione: ${esc(S.conc)}</span>`);
    FX.filter(f => S.fx[f.id] && f.tag && !(f.conc && S.conc === f.concName)).forEach(f => tags.push(`<span class="tag ${f.tagCls || 'ivy'}">${esc(f.tag)}</span>`));
    if (S.exh) tags.push(`<span class="tag st">Indebolimento ${S.exh}</span>`);
    S.conds.forEach(x => tags.push(`<span class="tag st">${esc(x)}</span>`));
    const sl = SLOT_LVLS.length === 1
      ? `<span class="minis">${Array.from({length:SLOTS[MAXL]}, (_, i) => `<i class="mini${i < slotLeft(MAXL) ? ' on' : ''}"></i>`).join('')}</span>`
      : `<b>${slotSummary()}</b>`;
    document.getElementById('vbar').innerHTML = `
      <button class="hp${S.hp.cur === 0 ? ' down' : ''}" id="hpbtn" data-a="hpopen" aria-label="Punti ferita ${S.hp.cur} su ${mh}${S.hp.temp ? ', più ' + S.hp.temp + ' temporanei' : ''}. Apri per segnare danni e cure">
        <span class="hpn"><b>${S.hp.cur}</b><i>/${mh}</i>${S.hp.temp ? `<em>+${S.hp.temp}</em>` : ''}<span class="hpl">PF ±</span></span>
        <span class="hpbar"><i style="width:${w1}%"></i>${S.hp.temp ? `<i class="temp" style="left:${w1}%;width:${w2}%"></i>` : ''}</span>
      </button>
      <div class="stat"><b>${AC}</b><span>CA</span></div>
      ${SC ? `<div class="stat"><b>${DC}</b><span>CD</span></div>` : ''}
      <button class="stat wide" data-a="init"><b>${fmt(M.des)}</b><span>Iniziativa</span></button>
      ${SC ? `<div class="stat wide"><b>${fmt(SATK)}</b><span>Attacco</span></div>` : ''}
      <div class="stat wide"><b>${PASSIVE}</b><span>Perc. passiva</span></div>
      ${SC ? `<button class="stat" data-a="goslots" aria-label="Slot rimasti: ${SLOT_LVLS.map(L => `${slotLeft(L)} di ${L}°`).join(', ')}">${sl}<span>Slot</span></button>` : ''}
      <button class="stat" data-a="restopen" aria-label="Riposo, backup e sincronizzazione">${svg('moon')}<span>Riposo</span><i class="syncdot" id="syncdot"></i></button>
      ${tags.length ? `<div class="tags" id="tags">${tags.join('')}</div>` : ''}`;
    renderSync(); renderBrand();
  }
  function renderNav(){
    document.querySelectorAll('#tabs [data-tab]').forEach(b => b.setAttribute('aria-selected', b.dataset.tab === tab ? 'true' : 'false'));
    const subs = TABS[tab], st = document.getElementById('subtabs');
    st.hidden = subs.length < 2;
    st.innerHTML = subs.length < 2 ? '' : subs.map(x => `<button data-sub="${x}" aria-pressed="${cur() === x ? 'true' : 'false'}">${SUB_LBL[x]}</button>`).join('');
    document.querySelectorAll('main > section').forEach(x => x.hidden = x.id !== 'tab-' + cur());
    const bd = document.getElementById('dbadge'), a = armed ? '✦' : useInsp ? 'I' : rollMode === 'adv' ? 'V' : rollMode === 'dis' ? 'S' : '';
    bd.hidden = !a; bd.textContent = a;
  }
  // Turn economy: what is still available this turn. Kept on this device only.
  const TURN_KEY = KEY + ':turn', ECON = [['action', 'Azione'], ['bonus', 'Azione bonus'], ['move', 'Movimento'], ['reaction', 'Reazione']];
  const freshTurn = () => ({action:'', bonus:'', move:'', reaction:'', slot:''});
  let turn = (() => { try { return {...freshTurn(), ...JSON.parse(localStorage.getItem(TURN_KEY) || '{}')}; } catch (e) { return freshTurn(); } })();
  const saveTurn = () => store.set(TURN_KEY, JSON.stringify(turn));
  const econOf = sp => !sp || !sp.ct ? null : /^azione bonus/i.test(sp.ct) ? 'bonus' : /^reazione/i.test(sp.ct) ? 'reaction' : /^azione/i.test(sp.ct) ? 'action' : null;
  function costOf(a, t){
    const id = t.dataset.id, sp = id && spellBy(id);
    switch (a){
      case 'atk': { const k = ATTACKS.find(x => x.id === t.dataset.k); return k && {k:t.dataset.econ || 'action', label:k.n}; }
      case 'spatk': case 'concset': return sp && {k:econOf(sp), label:sp.n};
      case 'spdmg': return sp && sp.l === 0 && !sp.atk ? {k:econOf(sp), label:sp.n} : null;
      case 'cast': case 'spslot': return sp && {k:econOf(sp), label:sp.n, slot:true};
      case 'spfree': return sp && {k:econOf(sp), label:sp.n};
      case 'temphp': { const tp = tempBy(id); return tp && tp.econ && {k:tp.econ, label:tp.n}; }
      case 'potion': return {k:'bonus', label:'Pozione'};
      case 'resuse': { const r = resBy(id), u = r && r.uses[+t.dataset.u]; if (!u || u.kind !== 'spell') return u && u.econ ? {k:u.econ, label:r.n} : null; const s2 = spellBy(u.spell); return {k:econOf(s2), label:s2.n}; }
    }
    return null;
  }
  // Using the action or bonus action again means a new turn has started
  function markTurn(c){
    if (!c || !c.k) return;
    // Repeating the same thing within a minute (the rays of one spell) stays in the same turn
    const now = Date.now(), same = turn[c.k] === c.label && now - (turn.at || 0) < 60000;
    if ((c.k === 'action' || c.k === 'bonus') && turn[c.k] && !same) turn = freshTurn();
    turn[c.k] = c.label || 'usata'; turn.at = now;
    if (c.slot && !turn.slot) turn.slot = c.label;
    saveTurn();
  }
  const turnLeft = () => ECON.filter(([k]) => k !== 'move' && !turn[k]);
  const turnStarted = () => !!(turn.action || turn.bonus || turn.reaction);
  function turnSummary(){
    const left = turnLeft().map(([, n]) => n.toLowerCase());
    const slot = SC && turn.slot ? ' Niente altri incantesimi con slot in questo turno.' : '';
    return (left.length ? `Ti resta: ${left.join(', ')} e il movimento.` : 'Ti resta solo il movimento.') + slot;
  }
  function turnPanel(){
    return `<div class="panel span2 turnbox">
      <h2>Questo turno <button class="btn sm" data-a="turnnew">Nuovo turno</button></h2>
      <div class="econ">${ECON.filter(([k]) => k !== 'move').map(([k, n]) => `<div class="pill${turn[k] ? ' used' : ''}"><b>${n}</b><span>${turn[k] ? esc(turn[k]) : 'libera'}</span></div>`).join('')}</div>
      <p class="muted turnline">${turnSummary()} Si aggiorna da solo a ogni attacco o incantesimo, e riparte quando usi di nuovo l'azione o l'azione bonus.</p>
    </div>`;
  }
  function resLine(r){
    const max = resMax(r), used = S.res[r.id], left = max - used, uses = r.uses || [];
    const btn = u => {
      const dis = left <= 0 || (u.kind === 'recover' && !slotsSpent());
      if (u.kind === 'adv') return `<button class="btn sm${armed === r.id ? ' gold' : ''}" data-a="resuse" data-id="${r.id}" data-u="${uses.indexOf(u)}"${dis ? ' disabled' : ''}>${armed === r.id ? (u.armed || 'Pronto') : u.label}</button>`;
      return `<button class="btn sm${u.cls ? ' ' + u.cls : ''}" data-a="resuse" data-id="${r.id}" data-u="${uses.indexOf(u)}"${dis ? ' disabled' : ''}>${u.label}</button>`;
    };
    const sub = typeof r.sub === 'function' ? r.sub(c, S, {left, used, max, slotsSpent:slotsSpent()}) : r.sub;
    const right = r.style === 'pips' ? `<div class="pips">${pips(max, used, 'respip', r.id, r.pipCls || '')}</div>` : left <= 0 ? `<span class="muted">${r.usedLabel || 'usato'}</span>` : uses.length === 1 ? btn(uses[0]) : '';
    const rest = r.style === 'pips' || uses.length > 1 ? `<div class="btns fullrow">${uses.map(btn).join('')}</div>` : '';
    return `<div class="resline"><div class="rl"><div class="rt"><b>${esc(r.n)}</b>${r.info ? info(r.info) : ''}</div><div class="muted">${sub || ''}</div></div>${right}${r.style === 'pips' ? rest : rest && left > 0 ? rest : ''}</div>`;
  }
  function renderCombat(){
    const down = S.hp.cur === 0;
    const pots = S.items.filter(i => POTIONS[i.n] && i.q > 0);
    const potNames = Object.keys(POTIONS);
    const riders = FX.filter(f => f.rider), defs = FX.filter(f => !f.rider);
    const inPanel = p => RES.filter(r => (r.panel || 'own') === p);
    const quick = SPELLS.filter(sp => sp.quick);
    const cg = D.combatGuide;
    document.getElementById('tab-combat').innerHTML = `
    ${turnPanel()}
    ${cg ? `<details class="panel fold span2 turnguide" id="turnguide"${guideOpen ? ' open' : ''}><summary><h2>${esc(cg.title || 'Il tuo turno')}</h2></summary><dl class="kv">${cg.steps.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl></details>` : ''}
    ${down ? `<div class="panel">
      <h2>A terra <small>0 punti ferita</small></h2>
      <p>A inizio turno tiri contro la morte: 10 o più è un successo, 20 ti rialza con 1 PF, 1 vale due fallimenti.</p>
      <div class="resline"><div class="rl"><b>Successi</b></div><div class="pips">${[0, 1, 2].map(i => `<button class="pip ok ${i < S.death.s ? 'on' : ''}" data-a="ds" data-i="${i}" aria-label="Successo ${i + 1}"></button>`).join('')}</div></div>
      <div class="resline"><div class="rl"><b>Fallimenti</b></div><div class="pips">${[0, 1, 2].map(i => `<button class="pip ${i < S.death.f ? 'on' : ''}" data-a="df" data-i="${i}" aria-label="Fallimento ${i + 1}"></button>`).join('')}</div></div>
      ${S.death.s >= 3 ? '<p><b>Stabile.</b> Resti a 0 PF ma non tiri più.</p>' : S.death.f >= 3 ? '<p><b>Morto.</b> Serve una magia di resurrezione.</p>' : '<div class="resline"><button class="btn primary fullrow" data-a="deathroll">Tira contro la morte</button></div>'}
    </div>` : ''}
    <div class="panel">
      <h2>Attacchi <button class="btn sm" data-a="init">Iniziativa ${fmt(M.des)}</button></h2>
      ${S.conc ? `<div class="alert"><span>Concentrazione su <b>${esc(S.conc)}</b>${S.concDc ? `, TS da fare: CD ${S.concDc}` : ''}</span><div class="btns"><button class="btn sm${S.concDc ? ' primary' : ''}" data-a="concsave">TS Cos ${fmt(M.cos + (SAVES.has('cos') ? PB : 0))}</button><button class="btn sm" data-a="concend">Termina</button></div></div>` : ''}
      ${riders.map(f => `<div class="resline"><div class="rl"><div class="rt"><b>${esc(f.n)}</b>${f.info ? info(f.info) : ''}</div><div class="muted">${esc(f.sub || '')}</div></div>${sw('fxtoggle', f.id, S.fx[f.id], f.n)}</div>`).join('')}
      ${ATTACKS.map(a => `<div class="atk">
        <div class="atk-h"><b>${esc(a.n)}</b>${a.info ? info(a.info) : ''}<span class="muted">${esc(a.range)}, ${esc(a.type)}</span></div>
        <div class="atk-b"><button class="btn primary" data-a="atk" data-k="${a.id}">Colpire ${fmt(atkBonus(a))}</button><button class="btn" data-a="dmgroll" data-k="${a.id}">Danni ${atkDmg(a)}</button></div>
      </div>`).join('')}
      <p class="muted">Dopo un 20 naturale i dadi dei danni raddoppiano da soli.</p>
    </div>
    ${quick.length ? `<div class="panel">
      <h2>Lanci rapidi <small>${slotLeft(MAXL) || 0} slot</small></h2>
      ${quick.map(sp => `<div class="resline"><div class="rl"><div class="rt"><b>${esc(sp.n)}</b>${info('sp:' + sp.id)}</div><div class="muted">${esc(sp.quick === true ? sp.t.replace(/ • /g, ', ') : sp.quick)}</div></div><button class="btn sm${S.conc === sp.n || (sp.fx && S.fx[sp.fx]) ? ' gold' : ''}" data-a="cast" data-id="${sp.id}"${slotsAny() ? '' : ' disabled'}>${S.conc === sp.n || (sp.fx && S.fx[sp.fx]) ? 'Attivo, rilancia' : 'Lancia'}</button></div>`).join('')}
    </div>` : ''}
    ${SC ? `<div class="panel" id="slotpanel">
      <h2>${esc(SC.title || 'Slot incantesimo')} <small>${SC.pact ? `${MAXL}° livello` : 'uno per turno'}</small></h2>
      ${SLOT_LVLS.map(L => `<div class="sealrow"><div class="seals">${seals(L)}</div><div><b>${slotLeft(L)} su ${SLOTS[L]}${SLOT_LVLS.length > 1 ? ` di ${L}°` : ''}</b><div class="muted">${SC.pact ? 'Tornano con un riposo breve' : 'Tornano con un riposo lungo'}</div></div></div>`).join('')}
      ${inPanel('slots').map(resLine).join('')}
    </div>` : ''}
    <div class="panel">
      <h2>Difese e cure</h2>
      ${TEMP.map(t => `<div class="resline"><div class="rl"><div class="rt"><b>${esc(t.n)}</b>${t.info ? info(t.info) : ''}</div><div class="muted">${esc(t.sub || '')}</div></div><button class="btn sm gold" data-a="temphp" data-id="${t.id}">${t.amount(c)} PF temp.</button></div>`).join('')}
      ${defs.map(f => `<div class="resline"><div class="rl"><div class="rt"><b>${esc(f.n)}</b>${f.info ? info(f.info) : ''}</div><div class="muted">${esc(typeof f.sub === 'function' ? f.sub(c) : f.sub || '')}</div></div>${sw('fxtoggle', f.id, S.fx[f.id], f.n + ' attiva')}</div>`).join('')}
      ${inPanel('defense').map(resLine).join('')}
      ${pots.length ? pots.map(i => `<div class="resline"><div class="rl"><div class="rt"><b>${esc(i.n)}</b></div><div class="muted">Azione bonus, ne hai ${i.q}</div></div><button class="btn sm heal" data-a="potion" data-id="${i.id}">Bevi ${POTIONS[i.n]}</button></div>`).join('')
        : potNames.length ? `<div class="resline"><div class="rl"><div class="rt"><b>${esc(potNames[0])}</b></div><div class="muted">Finite</div></div><button class="btn sm heal" data-a="potion" disabled>Bevi ${POTIONS[potNames[0]]}</button></div>` : ''}
      <div class="resline"><div class="rl"><div class="rt"><b>Dadi vita</b></div><div class="muted">${HD_MAX - S.hdUsed} su ${HD_MAX}, durante un riposo breve</div></div><button class="btn sm" data-a="hd"${S.hdUsed < HD_MAX && !down && S.hp.cur < maxHp() ? '' : ' disabled'}>Spendi 1d${HD}${M.cos ? fmt(M.cos) : ''}</button></div>
    </div>
    ${inPanel('own').map(r => `<div class="panel"><h2>${esc(r.title || r.n)} <small>${resMax(r) - S.res[r.id]} su ${resMax(r)}</small></h2>${resLine(r)}</div>`).join('')}
    <div class="panel">
      <h2>Condizioni</h2>
      <div class="conds">${CONDS.map(x => `<button class="cond ${S.conds.includes(x) ? 'on' : ''}" data-a="cond" data-c="${x}" aria-pressed="${S.conds.includes(x) ? 'true' : 'false'}">${x}</button>`).join('')}</div>
      <div class="resline" style="margin-top:10px"><div class="rl"><b>Indebolimento</b><div class="muted">−2 a ogni d20 per livello</div></div><div class="stepper"><button class="btn sm" data-a="exh" data-d="-1" aria-label="Riduci l'indebolimento">−</button><b id="exh-c">${S.exh}</b><button class="btn sm" data-a="exh" data-d="1" aria-label="Aumenta l'indebolimento">+</button></div></div>
    </div>`;
  }
  function renderSheet(){
    document.getElementById('tab-sheet').innerHTML = `
    <div class="panel">
      <h2>Caratteristiche <small>tocca per tirare</small></h2>
      <div class="abil">${Object.keys(ABN).map(k => `<div class="ab"><button class="ab-c" data-a="check" data-k="${k}"><span class="lbl">${ABN[k]}</span><span class="mod">${fmt(M[k])}</span><span class="score">${DEF.abilities[k]}</span></button><button class="ab-s${SAVES.has(k) ? ' on' : ''}" data-a="save" data-k="${k}">Salvezza ${fmt(M[k] + (SAVES.has(k) ? PB : 0))}</button></div>`).join('')}</div>
      <div class="facts">
        <button class="fact" data-a="init"><b>${fmt(M.des)}</b><span>Iniziativa</span></button>
        <div class="fact"><b>${esc(DEF.speed)}</b><span>Velocità</span></div>
        <div class="fact"><b>${fmt(PB)}</b><span>Competenza</span></div>
        <div class="fact"><b>${PASSIVE}</b><span>Percezione passiva</span></div>
        ${SC ? `<div class="fact"><b>${fmt(SATK)}</b><span>Attacco incantesimi</span></div><div class="fact"><b>${DC}</b><span>CD incantesimi</span></div>` : `<div class="fact"><b>${AC}</b><span>Classe Armatura</span></div><div class="fact"><b>${LVL}</b><span>Livello</span></div>`}
      </div>
      <p class="muted" style="margin:10px 0 0">In rosso i tiri salvezza con competenza.</p>
    </div>
    <div class="panel">
      <h2>Abilità <small>● competente</small></h2>
      <div class="rows cols2">${SKILLS.map(([n, ab, p]) => `<div class="rowwrap"><button class="row${p ? ' on' : ''}" data-a="skill" data-n="${n}"><span class="dot ${p ? 'on' : ''}${p > 1 ? ' exp' : ''}"></span><span>${n} <span class="muted">${ABBR[ab]}</span></span><span class="val">${fmt(skillMod(ab, p))}</span></button>${D.skillInfo && D.skillInfo[n] ? info('skill:' + n) : '<span class="nofo"></span>'}</div>`).join('')}
      ${(D.tools || []).map((t, i) => `<div class="rowwrap"><button class="row on" data-a="tool" data-i="${i}"><span class="dot on"></span><span>${esc(t.n)} <span class="muted">${ABBR[t.ab]}</span></span><span class="val">${fmt(skillMod(t.ab, t.prof ?? 1))}</span></button><span class="nofo"></span></div>`).join('')}</div>
    </div>
    <div class="panel">
      <h2>Competenze e sensi</h2>
      <dl class="kv">${(D.proficiencies || []).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(typeof v === 'function' ? v(c) : v)}</dd>`).join('')}<dt>Sensi</dt><dd>${esc(D.senses || '')}${D.senses ? ', ' : ''}Percezione passiva ${PASSIVE}</dd></dl>
      ${D.scoresNote ? `<p class="muted">${esc(D.scoresNote)}</p>` : ''}
    </div>`;
  }
  function spellRow(sp){
    const open = openSpell === sp.id, L = sp.l === 0 ? 0 : MAXL;
    const lvl = sp.l === 0 ? 'Trucchetto' : sp.free ? (sp.ritual ? 'Rituale' : 'A volontà') : `${sp.l}° livello`;
    let body = '';
    if (open){
      const b = [], fr = sp.freeWith && resBy(sp.freeWith);
      if (sp.l > 0 && !sp.free && !sp.instant) b.push(`<button class="btn sm primary" data-a="cast" data-id="${sp.id}"${slotsAny() ? '' : ' disabled'}>Lancia con uno slot</button>`);
      if (sp.atk) b.push(`<button class="btn sm${sp.l === 0 ? ' primary' : ''}" data-a="spatk" data-id="${sp.id}">Colpire ${fmt(SATK)}</button>`);
      if (sp.dmg && !sp.instant) b.push(`<button class="btn sm" data-a="spdmg" data-id="${sp.id}">Danni ${spDmg(sp)}</button>`);
      if (sp.instant){
        if (fr) b.push(`<button class="btn sm" data-a="spfree" data-id="${sp.id}"${S.res[fr.id] >= resMax(fr) ? ' disabled' : ''}>Gratis ${sp.dmg(sp.l, c)}</button>`);
        b.push(`<button class="btn sm primary" data-a="spslot" data-id="${sp.id}"${slotsAny() ? '' : ' disabled'}>Con slot ${sp.dmg(MAXL, c)}</button>`);
      }
      if (sp.tempHp){ const t = tempBy(sp.tempHp); b.push(`<button class="btn sm gold" data-a="temphp" data-id="${t.id}">Lancia: ${t.amount(c)} PF temporanei</button>`); }
      if (sp.c && (sp.l === 0 || sp.free)) b.push(`<button class="btn sm" data-a="concset" data-id="${sp.id}">Inizia la concentrazione</button>`);
      b.push(`<button class="btn sm" data-info="sp:${sp.id}">Regole complete</button>`);
      body = `<div class="body"><div>${esc(sp.full[0])}</div><div class="btns">${b.join('')}</div></div>`;
    }
    return `<div class="spell${open ? ' is-open' : ''}"><button class="open" data-a="spopen" data-id="${sp.id}" aria-expanded="${open ? 'true' : 'false'}">
      <span class="nm">${esc(sp.n)}${sp.c ? '<span class="cbadge" title="Concentrazione" aria-label="Concentrazione">C</span>' : ''}${sp.ritual ? '<span class="rbadge" title="Rituale: senza slot" aria-label="Rituale">R</span>' : ''}</span>
      <span class="side"><b>${lvl}</b><span class="src-${sp.src}">${esc((D.spellSources || {})[sp.src] || '')}</span></span>
      <span class="meta">${esc(sp.t.replace(/ • /g, ', '))}</span></button>${body}</div>`;
  }
  function renderSpells(){
    const el = document.getElementById('tab-spells');
    if (!SC){ el.innerHTML = '<div class="panel span2"><p class="muted">Nessun incantesimo.</p></div>'; return; }
    const groups = D.spellGroups || [{title:'Trucchetti', note:'a volontà', f:s => s.l === 0}, {title:'Con slot', note:'', f:s => s.l > 0 && !s.free}, {title:'Senza slot', note:'', f:s => s.free}];
    el.innerHTML = `
    <div class="panel span2">
      <h2>${esc(SC.title || 'Incantesimi')} <small>CD ${DC}, attacco ${fmt(SATK)}</small></h2>
      ${SLOT_LVLS.map(L => `<div class="sealrow" style="border:0;padding-bottom:4px"><div class="seals">${seals(L)}</div><div><b>${slotLeft(L)} slot su ${SLOTS[L]}</b><div class="muted">${SC.pact ? `Sempre di ${L}° livello, tornano con un riposo breve` : `${L}° livello`}</div></div></div>`).join('')}
      <p class="muted" style="margin:6px 0 0">Tocca un incantesimo per lanciarlo o tirare i dadi. Il cerchio con la C indica la concentrazione, il riquadro con la R un rituale, che lanci senza slot impiegando 10 minuti in più.</p>
    </div>
    ${groups.map(g => { const list = SPELLS.filter(g.f); return list.length ? `<div class="panel"><h2>${esc(g.title)} <small>${esc(g.note || '')}</small></h2>${list.map(spellRow).join('')}</div>` : ''; }).join('')}`;
  }
  function renderFeat(){
    const groups = [...new Set(FEATS.map(f => f.g))];
    document.getElementById('tab-feat').innerHTML = groups.map(g => `<div class="panel"><h2>${esc(g)}</h2>${FEATS.filter(f => f.g === g).map(f => `<button class="frow" data-info="feat:${f.id}"><span><b>${esc(f.n)}</b><span class="muted">${esc(f.full[0])}</span></span><span class="chev" aria-hidden="true">›</span></button>`).join('')}</div>`).join('');
  }
  function renderInv(){
    const n = S.items.length;
    document.getElementById('invcount').textContent = n === 1 ? '1 oggetto' : `${n} oggetti`;
    document.getElementById('invlist').innerHTML = S.items.map(i => `<div class="item"><span class="nm">${esc(i.n)}</span>
      <div class="stepper"><button class="btn sm${confirmKey === 'iq:' + i.id ? ' gold' : ''}" data-a="iq" data-id="${i.id}" data-d="-1" aria-label="${i.q === 1 ? 'Togli dallo zaino' : 'Togli uno'}">${confirmKey === 'iq:' + i.id ? 'Togli?' : '−'}</button><b>${i.q}</b><button class="btn sm" data-a="iq" data-id="${i.id}" data-d="1" aria-label="Aggiungi uno">+</button></div>
      ${i.t ? `<span class="nt">${esc(i.t)}</span>` : ''}</div>`).join('') || '<p class="muted">Lo zaino è vuoto: aggiungi un oggetto qui sotto.</p>';
    const el = document.getElementById('coins');
    if (!el.dataset.ok){ el.innerHTML = [['mr', 'Rame'], ['ma', 'Argento'], ['me', 'Electrum'], ['mo', 'Oro'], ['mp', 'Platino']].map(([k, nm]) => `<label>${nm}<input type="number" inputmode="numeric" min="0" data-coin="${k}"></label>`).join(''); el.dataset.ok = 1; }
    el.querySelectorAll('input').forEach(inp => { if (document.activeElement !== inp) inp.value = S.coins[inp.dataset.coin] || 0; });
  }
  function renderNotes(){
    const el = document.getElementById('notelist'); if (!el) return;
    const L = S.noteList, n = L.length;
    document.getElementById('notecount').textContent = n ? (n === 1 ? '1 nota' : `${n} note`) : '';
    el.innerHTML = L.map((x, i) => editNote === x.id ? `<li class="note editing"><textarea id="noteedit" aria-label="Modifica la nota">${esc(editDraft ?? x.x)}</textarea>
        <div class="btns"><button class="btn sm primary" data-a="nsave" data-id="${x.id}">Salva</button><button class="btn sm" data-a="ncancel">Annulla</button></div></li>`
      : `<li class="note"><div class="nx">${esc(x.x)}</div>
        <div class="nbar"><button class="btn sm" data-a="nmove" data-id="${x.id}" data-d="-1" aria-label="Sposta su"${i ? '' : ' disabled'}>↑</button><button class="btn sm" data-a="nmove" data-id="${x.id}" data-d="1" aria-label="Sposta giù"${i < n - 1 ? '' : ' disabled'}>↓</button>
        <button class="btn sm" data-a="nedit" data-id="${x.id}">Modifica</button><button class="btn sm${confirmKey === 'nd:' + x.id ? ' gold' : ''}" data-a="ndel" data-id="${x.id}" aria-label="Elimina la nota">${confirmKey === 'nd:' + x.id ? 'Elimina?' : '×'}</button></div></li>`).join('')
      || '<li class="muted noempty">Nessuna nota. Scrivi qui sopra e tocca Aggiungi: poi potrai spostarle con le frecce.</li>';
    const ed = document.getElementById('noteedit');
    if (ed && editFocus){ editFocus = false; ed.focus(); ed.setSelectionRange(ed.value.length, ed.value.length); }
  }
  function renderTrack(){
    const el = document.getElementById('tab-track'); if (!el) return;
    const keepForm = {};
    el.querySelectorAll('form[data-j]').forEach(f => { const ti = f.querySelector('[name=t]'); keepForm[f.dataset.j] = {l:f.querySelector('[name=l]').value, t:ti.value !== ti.dataset.pre ? ti.value : '', n:f.querySelector('[name=n]').value}; });
    el.innerHTML = JOURNALS.map(j => {
      const ms = [...S.journals[j.id]].sort((a, b) => b.t - a.t), cu = ms[0], kf = keepForm[j.id] || {};
      return `<div class="panel">
        <h2>${esc(j.n)}</h2>
        <div class="markcur"><span class="markl">${cu ? esc(cu.l) : '?'}</span><div><b>${cu ? 'Dal ' + when(cu.t) : 'Nessuna annotazione'}</b><div class="muted">${cu ? 'da ' + span(Date.now() - cu.t) : 'Annota la prima qui sotto'}</div></div></div>
        ${j.help ? `<p class="muted">${esc(j.help)}</p>` : ''}
        <form class="markform" data-j="${j.id}">
          <label>${esc(j.field || 'Nuovo valore')}<input name="l" maxlength="1" autocomplete="off" autocapitalize="characters" spellcheck="false" required value="${esc(kf.l || '')}"></label>
          <label>Quando<input name="t" type="datetime-local" data-pre="${localNow()}" value="${esc(kf.t || localNow())}"></label>
          <label class="full">Cosa stava succedendo<input name="n" placeholder="Facoltativo" autocomplete="off" value="${esc(kf.n || '')}"></label>
          <button class="btn primary full" type="submit">${esc(j.submit || 'Annota')}</button>
        </form>
      </div>
      <div class="panel"><h2>${esc(j.listTitle || 'Registro')} <small>${ms.length ? `${ms.length} ${ms.length === 1 ? 'voce' : 'voci'}` : ''}</small></h2>
        ${ms.map((m, i) => `<div class="mrow"><span class="markl sm">${esc(m.l)}</span><div class="rl"><b>${when(m.t)}</b><div class="muted">${i < ms.length - 1 ? `dopo ${span(m.t - ms[i + 1].t)}` : 'prima annotazione'}${m.n ? ', ' + esc(m.n) : ''}</div></div><button class="btn sm${confirmKey === 'jd:' + m.id ? ' gold' : ''}" data-a="jdel" data-j="${j.id}" data-id="${m.id}" aria-label="Elimina questa annotazione">${confirmKey === 'jd:' + m.id ? 'Elimina?' : '×'}</button></div>`).join('') || `<p class="muted">${esc(j.empty || 'Ancora vuoto.')}</p>`}
      </div>`;
    }).join('') + COUNTERS.map(k => `<div class="panel"><h2>${esc(k.n)}</h2>
      <div class="resline"><div class="rl"><span class="debt" id="cnt-${k.id}">${S.counters[k.id]}</span><div class="muted">${esc(k.sub || '')}</div></div>
      <div class="stepper">${(k.steps || [-1, 1]).map(d => `<button class="btn sm" data-a="cnt" data-id="${k.id}" data-d="${d}" aria-label="${d > 0 ? 'Aggiungi' : 'Togli'} ${Math.abs(d)}">${d === -1 ? '−' : d === 1 ? '+' : fmt(d)}</button>`).join('')}</div></div>
      ${k.note ? `<p class="muted">${esc(k.note)}</p>` : ''}</div>`).join('');
  }
  function renderResult(){
    const r = document.getElementById('result'), l = S.log[0], vis = resultOpen && !!l && !sheet;
    r.hidden = !vis; document.body.classList.toggle('has-result', vis);
    if (!vis) return;
    const t = document.getElementById('r-total');
    t.textContent = l.total; t.className = 'sealn' + (l.kind ? ' ' + l.kind : '') + (String(l.total).length > 2 ? ' long' : '');
    document.getElementById('r-lab').textContent = l.label;
    document.getElementById('r-det').textContent = l.detail;
    const rt = document.getElementById('r-turn'); if (rt){ rt.hidden = !turnStarted(); rt.textContent = turnStarted() ? turnSummary() : ''; }
    document.getElementById('r-fol').innerHTML = lastFollow.map(f => `<button class="btn sm${f.p ? ' primary' : ''}" data-a="${f.a}"${f.k ? ` data-k="${f.k}"` : ''}${f.id ? ` data-id="${f.id}"` : ''}${f.m ? ` data-m="${f.m}"` : ''}>${esc(f.t)}</button>`).join('') + (UNDO.length ? '<button class="btn sm undo" data-a="undo">Annulla</button>' : '');
    if (flash){ r.classList.remove('flash'); void r.offsetWidth; r.classList.add('flash'); flash = false; }
  }

  // Bottom sheets
  function infoHtml(key){
    const [kind, ...rest] = key.split(':'), id = rest.join(':');
    if (kind === 'sp'){
      const sp = spellBy(id); if (!sp) return '';
      return `<h2>${esc(sp.n)}</h2><div class="meta"><div><b>Livello</b>${sp.l === 0 ? 'Trucchetto' : sp.l + '°'}</div><div><b>Scuola</b>${esc(sp.s)}</div><div><b>Lancio</b>${esc(sp.ct)}</div><div><b>Gittata</b>${esc(sp.rg)}</div><div><b>Componenti</b>${esc(sp.cp)}</div><div><b>Durata</b>${esc(sp.du)}</div><div><b>Fonte</b>${esc((D.spellSources || {})[sp.src] || '')}</div></div>
        ${sp.full.map(p => `<p>${esc(p)}</p>`).join('')}${sp.tip ? `<div class="tip"><b>${esc(D.tipLabel || 'Consiglio')}:</b> ${esc(sp.tip)}</div>` : ''}`;
    }
    if (kind === 'feat'){ const f = FEATS.find(x => x.id === id); return f ? `<h2>${esc(f.n)}</h2><p class="muted">${esc(f.g)}</p>${f.full.map(p => `<p>${esc(p)}</p>`).join('')}` : ''; }
    if (kind === 'skill'){ const sk = SKILLS.find(x => x[0] === id); return sk ? `<h2>${esc(id)}</h2><p class="muted">${ABBR[sk[1]]} ${fmt(skillMod(sk[1], sk[2]))}${D.skillSource && D.skillSource[id] ? ', competenza: ' + esc(D.skillSource[id]) : ''}</p><p>${esc(D.skillInfo[id])}</p><div class="btns" style="margin-top:12px"><button class="btn primary" data-a="skill" data-n="${esc(id)}">Tira ${fmt(skillMod(sk[1], sk[2]))}</button></div>` : ''; }
    return '';
  }
  const SHEETS = {
    info:k => infoHtml(k),
    hp:() => `<h2>Punti ferita</h2>
      <div class="hpbig"><b>${S.hp.cur}</b>su ${maxHp()}${S.hp.temp ? `<em>+${S.hp.temp} temporanei</em>` : ''}</div>
      <output class="kdisp" id="kdisp" aria-live="polite">${hpBuf || '0'}</output>
      <div class="keys">${['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'back'].map(k => `<button data-key="${k}"${k === 'clear' ? ' aria-label="Cancella tutto"' : k === 'back' ? ' aria-label="Cancella una cifra"' : ''}>${k === 'clear' ? 'C' : k === 'back' ? '⌫' : k}</button>`).join('')}</div>
      <div class="kact"><button class="btn primary" data-a="dmg">Danni</button><button class="btn heal" data-a="heal">Cura</button><button class="btn gold" data-a="temp">Temporanei</button></div>
      <div class="chips">${TEMP.map(t => `<button class="btn sm" data-a="temphp" data-id="${t.id}">${esc(t.short || t.n)} ${t.amount(c)}</button>`).join('')}${S.hp.temp ? '<button class="btn sm" data-a="cleartemp">Azzera i temporanei</button>' : ''}</div>
      <p class="muted" style="margin:12px 0 0">I PF temporanei non si sommano: resta il valore più alto. Sul computer puoi scrivere il numero con la tastiera.</p>`,
    rest:() => { const avail = HD_MAX - S.hdUsed; return `<h2>Riposo</h2>
      <div class="restopt"><div><b>Riposo breve, 1 ora</b><p class="muted">${esc(D.shortRestText || 'Puoi spendere dadi vita.')} Dadi vita: ${avail} su ${HD_MAX} (1d${HD}${M.cos ? fmt(M.cos) : ''} l'uno).</p></div>
        <div class="srrow"><div class="stepper"><button class="btn" data-a="sr" data-d="-1" aria-label="Un dado in meno"${srCount <= 0 ? ' disabled' : ''}>−</button><b id="sr-n">${srCount}</b><button class="btn" data-a="sr" data-d="1" aria-label="Un dado in più"${srCount >= avail ? ' disabled' : ''}>+</button></div><span class="muted">${srCount ? `Dadi vita da tirare: ${srCount}` : 'Nessun dado vita'}</span></div>
        <button class="btn primary" data-a="short">Fai un riposo breve</button></div>
      <div class="restopt"><div><b>Riposo lungo, 8 ore</b><p class="muted">${esc(D.longRestText || 'Tornano PF, slot, dadi vita e risorse. Finiscono concentrazione e PF temporanei.')}</p></div>
        <button class="btn${confirmKey === 'long' ? ' gold' : ''}" data-a="long">${confirmKey === 'long' ? 'Tocca ancora per confermare' : 'Fai un riposo lungo'}</button></div>
      <h3>Salvataggi</h3>
      <p class="muted" id="syncst">${SYNC_TXT[syncState]}</p>
      <div class="btns"><button class="btn sm" data-a="undo"${UNDO.length ? '' : ' disabled'}>Annulla l'ultima azione</button><button class="btn sm" data-a="export">Scarica una copia</button><label class="btn sm filebtn">Ripristina una copia<input type="file" accept="application/json,.json" id="importfile"></label></div>
      ${confirmKey === 'import' ? '<p class="alert">Il file sostituirà tutti i dati della scheda. Tocca di nuovo "Ripristina una copia" per scegliere il file.</p>' : ''}`; },
    dice:() => { const l = S.log[0]; return `<h2>Dadi</h2>
      ${l ? `<div class="last"><span class="sealn${l.kind ? ' ' + l.kind : ''}${String(l.total).length > 2 ? ' long' : ''}" id="d-total">${esc(l.total)}</span><div><b id="d-lab">${esc(l.label)}</b><div class="muted" id="d-det">${esc(l.detail)}</div></div></div>` : ''}
      <h3>Il prossimo d20</h3>
      <div class="seg" id="mode" role="group" aria-label="Come tiri il prossimo d20">${[['dis', 'Svantaggio'], ['norm', 'Normale'], ['adv', 'Vantaggio']].map(([m, n]) => `<button data-mode="${m}" aria-pressed="${rollMode === m ? 'true' : 'false'}">${n}</button>`).join('')}</div>
      <div class="arm">
        ${advRes.map(r => `<button class="tog luck" id="adv-${r.id}" data-a="arm" data-id="${r.id}" aria-pressed="${armed === r.id ? 'true' : 'false'}"${S.res[r.id] < resMax(r) ? '' : ' disabled'}>${esc(r.tokenLabel || r.n)} <b>${resMax(r) - S.res[r.id]}</b></button>`).join('')}
        <button class="tog insp" id="insp" data-a="inspuse" aria-pressed="${useInsp ? 'true' : 'false'}"${S.insp > 0 ? '' : ' disabled'}>Ispirazione <b id="insp-n">${S.insp}</b></button>
        <button class="btn sm" data-a="insp" data-d="-1" aria-label="Togli un'ispirazione">−</button><button class="btn sm" id="inspadd" data-a="insp" data-d="1" aria-label="Aggiungi un'ispirazione">+</button>
      </div>
      <p class="muted" style="margin:8px 0 0">Vale per un solo tiro, poi torna normale.${INSP === 'dm1d6' ? ' L\'ispirazione dà vantaggio e +1d6.' : ' L\'ispirazione dà vantaggio.'}</p>
      <h3>Dadi liberi</h3>
      <div class="dice">${[4, 6, 8, 10, 12, 20, 100].map(n => `<button class="die" data-die="${n}">d${n}</button>`).join('')}</div>
      <form class="expr" id="exprform"><input id="expr" value="${esc(exprVal)}" placeholder="es. 2d4+2" aria-label="Formula dei dadi" autocomplete="off" autocapitalize="off" spellcheck="false"><button class="btn primary" type="submit">Tira</button></form>
      <h3>Storico</h3>
      ${S.log.length ? `<ol class="log" id="logl">${S.log.map(e => `<li><b>${esc(e.total)}</b><span>${esc(e.label)}<br><span class="muted">${esc(e.detail)}</span></span><time>${new Date(e.t).toLocaleTimeString('it-IT', {hour:'2-digit', minute:'2-digit'})}</time></li>`).join('')}</ol>` : '<p class="muted">Ancora nessun tiro.</p>'}`; }
  };
  let srCount = 0, guideOpen = (() => { try { return localStorage.getItem(KEY + ':turnguide') === '1'; } catch (e) { return false; } })();
  function openSheet(kind, arg){ sheet = {kind, arg}; if (kind === 'hp') hpBuf = ''; if (kind === 'rest'){ const miss = maxHp() - S.hp.cur; srCount = Math.min(HD_MAX - S.hdUsed, Math.max(0, Math.ceil(miss / (HD / 2 + 0.5 + M.cos)))); } renderSheetUI(true); renderResult(); }
  function closeSheet(){ sheet = null; }
  function renderSheetUI(isNew){
    const sc = document.getElementById('scrim'), el = document.getElementById('sheet');
    sc.hidden = !sheet; document.documentElement.classList.toggle('lock', !!sheet);
    if (!sheet) return;
    const keep = el.scrollTop;
    el.setAttribute('aria-label', {info:'Dettagli', hp:'Punti ferita', rest:'Riposo', dice:'Dadi'}[sheet.kind]);
    el.innerHTML = '<div class="grab"></div><button class="x" data-a="close" aria-label="Chiudi">×</button>' + SHEETS[sheet.kind](sheet.arg);
    el.scrollTop = isNew ? 0 : keep;
    if (isNew){ el.style.animation = 'none'; void el.offsetWidth; el.style.animation = ''; el.focus({preventScroll:true}); }
  }
  // Re-rendering replaces the markup, so keyboard focus is put back on the equivalent control
  function render(){
    const ae = document.activeElement, key = ae && ae.dataset && (ae.dataset.a || ae.dataset.sub || ae.dataset.tab) ? ['a', 'id', 'k', 'l', 'i', 'c', 'n', 'sub', 'tab', 'd', 'u'].map(x => ae.dataset[x] ?? '').join('|') : null, inSheet = ae && ae.closest && ae.closest('#sheet');
    renderHeader(); renderNav();
    renderCombat(); renderSheet(); renderSpells(); renderFeat(); renderInv(); renderNotes(); renderTrack();
    renderSheetUI(false); renderResult();
    if (key && !document.activeElement.closest('body > *')) {
      const el = [...document.querySelectorAll('[data-a],[data-sub],[data-tab]')].find(b => ['a', 'id', 'k', 'l', 'i', 'c', 'n', 'sub', 'tab', 'd', 'u'].map(x => b.dataset[x] ?? '').join('|') === key && (!inSheet || b.closest('#sheet')));
      if (el && !el.disabled) el.focus({preventScroll:true});
    }
  }

  // Static page: chrome, sections, guide and story
  function buildPage(){
    const root = document.getElementById('app');
    const guide = D.guide ? D.guide.map((g, i) => `<details class="panel fold${g.wide ? ' span2' : ''}" open><summary><h2>${esc(g.title)}</h2></summary>${g.html}</details>`).join('\n') : '';
    const bg = D.background ? chapters(D.background).map(ch => `<div class="panel bgch span2">${ch.title ? `<h2>${esc(ch.title)}</h2>` : `<h2>${esc(D.backgroundTitle || 'Chi è')}</h2>`}${ch.title ? ch.html.replace(/^<p>(<b>)?([A-Za-zÀ-ÿ])/, (m, b, ch1) => `<p>${b || ''}<span class="dc">${ch1}</span>`) : ch.html}</div>`).join('\n') : '';
    root.innerHTML = `
    <div class="chrome">
      <header class="brand">
        ${DEF.avatar ? `<img class="avatar" src="${esc(DEF.avatar)}" alt="Ritratto di ${esc(DEF.name)}" width="62" height="62">` : ''}
        <div class="who"><h1>${esc(DEF.name)}</h1><p>${esc(DEF.subtitle)}</p></div>
        <button class="mono" id="mono" data-a="gotrack" hidden></button>
        <button class="fsbtn" id="fsbtn" data-a="fullscreen" aria-label="Schermo intero" aria-pressed="false" hidden>${svg('fsOn', 'on')}${svg('fsOff', 'off')}</button>
      </header>
      <nav class="tabs" id="tabs" aria-label="Sezioni della scheda">
        <button data-tab="combat">${svg('combat')}<span>Scontro</span></button>
        <button data-tab="spells">${svg('spells')}<span>Magia</span></button>
        <button class="dicebtn" data-a="dice" aria-label="Dadi"><span class="dseal">${svg('dice')}</span><span>Dadi</span><i class="dbadge" id="dbadge" hidden></i></button>
        <button data-tab="sheet">${svg('sheet')}<span>Scheda</span></button>
        <button data-tab="diary">${svg('diary')}<span>Diario</span></button>
      </nav>
      <div class="vbar" id="vbar"></div>
    </div>
    <main>
      <div class="subtabs" id="subtabs" hidden></div>
      <section id="tab-combat" class="grid"></section>
      <section id="tab-spells" class="grid" hidden></section>
      <section id="tab-sheet" class="grid" hidden></section>
      <section id="tab-feat" class="grid" hidden></section>
      <section id="tab-inv" class="grid" hidden>
        <div class="panel inv"><h2>Equipaggiamento <small id="invcount"></small></h2><div id="invlist"></div></div>
        <div class="panel">
          <h2>Monete</h2>
          <div class="coins" id="coins"></div>
          <h3>Aggiungi un oggetto</h3>
          <form class="addform" id="addform">
            <input id="add-name" placeholder="Nome" required class="full" aria-label="Nome dell'oggetto" maxlength="80">
            <input id="add-note" placeholder="Nota (facoltativa)" aria-label="Nota" maxlength="300">
            <input id="add-qty" type="number" inputmode="numeric" min="1" value="1" aria-label="Quantità">
            <button class="btn primary full" type="submit">Aggiungi allo zaino</button>
          </form>
          ${D.invNote ? `<h3>${esc(D.invNote.title)}</h3><p class="muted">${esc(D.invNote.text)}</p>` : ''}
        </div>
      </section>
      <section id="tab-notes" class="grid" hidden>
        <div class="panel span2"><h2>Note di sessione <small id="notecount"></small></h2>
          <form class="noteform" id="noteform"><textarea id="notenew" rows="2" placeholder="${esc(D.notesPlaceholder || 'PNG, indizi, luoghi...')}" aria-label="Nuova nota"></textarea><button class="btn primary" type="submit">Aggiungi</button></form>
          <ol class="notes" id="notelist"></ol></div>
      </section>
      ${TRACK ? '<section id="tab-track" class="grid" hidden></section>' : ''}
      ${D.guide ? `<section id="tab-guide" class="grid" hidden>${guide}</section>` : ''}
      <section id="tab-story" class="grid" hidden>${D.story ? `<div class="panel story span2">${D.story}</div>` : ''}${bg}</section>
    </main>
    <div class="result" id="result" hidden>
      <button class="sealn" id="r-total" data-a="dice" aria-label="Apri i dadi e lo storico"></button>
      <div class="txt" aria-live="polite"><div class="lab" id="r-lab"></div><div class="det" id="r-det"></div><div class="rturn" id="r-turn" hidden></div></div>
      <button class="x" data-a="rclose" aria-label="Chiudi il risultato">×</button>
      <div class="fol" id="r-fol"></div>
    </div>
    <div class="scrim" id="scrim" hidden><div class="sheet" id="sheet" role="dialog" aria-modal="true" tabindex="-1"></div></div>`;
    document.title = DEF.title || DEF.name;
  }

  // Fullscreen
  const fsRoot = document.documentElement;
  const fsOn = () => !!(document.fullscreenElement || document.webkitFullscreenElement);
  const fsApp = window.matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches || navigator.standalone === true;
  function renderFs(){
    const b = document.getElementById('fsbtn'), can = !!(document.fullscreenEnabled || document.webkitFullscreenEnabled) && !fsApp;
    b.hidden = !can; fsRoot.classList.toggle('fs-ok', can);
    b.setAttribute('aria-pressed', fsOn() ? 'true' : 'false');
    b.setAttribute('aria-label', fsOn() ? 'Esci dallo schermo intero' : 'Schermo intero');
  }
  function toggleFs(){
    try {
      if (fsOn()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      else { const r = (fsRoot.requestFullscreen || fsRoot.webkitRequestFullscreen).call(fsRoot, {navigationUI:'hide'}); if (r && r.catch) r.catch(() => {}); }
    } catch (e) {}
  }

  // Actions
  function castSpell(sp, L = MAXL){
    if (!slotsAny()) return;
    const lv = SLOT_LVLS.find(x => x >= L && slotLeft(x) > 0) ?? SLOT_LVLS.find(x => slotLeft(x) > 0);
    S.slots['l' + lv] += 1;
    let msg = `slot di ${lv}° speso`;
    const follow = [];
    if (sp.temp){ const n = sp.temp(lv, c); S.hp.temp = Math.max(S.hp.temp, n); }
    if (sp.c) msg += setConc(sp.n, sp.fx);
    else if (sp.fx) S.fx[sp.fx] = true;
    if (sp.castMsg) msg += ' • ' + sp.castMsg(lv, c);
    if (sp.atk) follow.push({t:`Colpire ${fmt(SATK)}`, a:'spatk', id:sp.id, p:1});
    else if (sp.dmg) follow.push({t:`Danni ${spDmg(sp, lv)}`, a:'spdmg', id:sp.id, p:1});
    show(sp.n, '✦', msg, '', follow); commit();
  }
  function useRes(r, u){
    const max = resMax(r);
    if (S.res[r.id] >= max) return;
    if (u.kind === 'adv'){ armed = armed === r.id ? null : r.id; render(); return; }
    if (u.kind === 'recover'){
      if (!slotsSpent()) return;
      S.res[r.id] += 1;
      let n = u.slots;
      for (const L of [...SLOT_LVLS].reverse()) while (n > 0 && S.slots['l' + L] > 0){ S.slots['l' + L] -= 1; n -= 1; }
      show(r.n, '✦', u.msg || 'slot recuperato'); commit(); return;
    }
    S.res[r.id] += 1;
    if (u.kind === 'spell'){ const sp = spellBy(u.spell), x = rollExpr(sp.dmg(sp.l, c)); show(`${sp.n} (${u.tag || 'gratis'})`, x.total, `${x.text} ${sp.dt}${sp.save ? ` • TS ${sp.save} CD ${DC}${sp.half ? ', metà se riesce' : ''}` : ''}`); commit(); return; }
    if (u.kind === 'heal'){ const x = rollExpr(typeof u.expr === 'function' ? u.expr(c) : u.expr); heal(Math.max(1, x.total), u.title || r.n, x.text); return; }
    if (u.kind === 'roll'){ const x = rollExpr(typeof u.expr === 'function' ? u.expr(c) : u.expr); show(u.title || r.n, x.total, x.text + (u.suffix ? ' • ' + u.suffix : '')); commit(); return; }
    show(u.title || r.n, '✦', (typeof u.msg === 'function' ? u.msg(c, max - S.res[r.id]) : u.msg || '') ); commit();
  }
  function ask(key){
    if (confirmKey === key){ confirmKey = null; clearTimeout(confirmTimer); return true; }
    confirmKey = key; clearTimeout(confirmTimer); confirmTimer = setTimeout(() => { confirmKey = null; render(); }, 3000); render(); return false;
  }
  function key(k){
    if (k === 'clear') hpBuf = ''; else if (k === 'back') hpBuf = hpBuf.slice(0, -1); else if (hpBuf.length < 3) hpBuf = (hpBuf + k).replace(/^0+(?=\d)/, '');
    const d = document.getElementById('kdisp'); if (d) d.textContent = hpBuf || '0';
  }
  function undo(){
    const prev = UNDO.pop(); if (!prev) return;
    const was = S.log[0];
    S = sanitize(JSON.parse(prev)); S.ver = VER; lastJson = JSON.stringify(S);
    closeSheet(); resultOpen = false; lastFollow = [];
    S.updatedAt = Date.now(); lastJson = JSON.stringify(S); persist(); render(); queueSave();
    toast(`Annullato${was ? ': ' + was.label : ''}`);
  }
  function toast(msg){
    let el = document.getElementById('toast');
    if (!el){ el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = msg; el.classList.add('on'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('on'), 2400);
  }
  function exportData(){
    const blob = new Blob([JSON.stringify({sheet:DEF.id, exportedAt:new Date().toISOString(), state:S}, null, 2)], {type:'application/json'});
    const a = document.createElement('a'), d = new Date();
    a.href = URL.createObjectURL(blob); a.download = `${DEF.id}-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}.json`;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }
  function importData(file){
    const fr = new FileReader();
    fr.onload = () => {
      try {
        const o = JSON.parse(fr.result), st = o && o.state ? o.state : o;
        if (o && o.sheet && o.sheet !== DEF.id) throw new Error('altra scheda');
        if (!isObj(st) || !st.hp) throw new Error('formato');
        UNDO.push(JSON.stringify(S));
        S = upgrade(st).state; commit({undo:false}); closeSheet(); render(); toast('Copia ripristinata. Puoi annullare dal pannello Riposo.');
      } catch (e) { toast(e.message === 'altra scheda' ? 'Questo file è di un\'altra scheda.' : 'File non valido: niente è stato cambiato.'); }
    };
    fr.readAsText(file);
  }

  // Notes: drafts stay on this device until they are added or saved
  let editNote = null, editDraft = null, editFocus = false;
  const DRAFT_KEY = KEY + ':notedraft';
  function flushNotes(){
    if (editNote && editDraft != null){ const x = S.noteList.find(n => n.id === editNote); if (x && editDraft.trim() && x.x !== editDraft.trim()){ x.x = editDraft.trim(); commit({render:false}); } }
  }

  function bind(){
    document.addEventListener('click', e => {
      const t = e.target.closest('[data-a],[data-info],[data-tab],[data-sub],[data-mode],[data-die],[data-key]');
      if (!t){ if (e.target.id === 'scrim'){ closeSheet(); render(); } return; }
      if (t.disabled) return;
      if (t.dataset.tab){ if (tab !== t.dataset.tab) resultOpen = false; tab = t.dataset.tab; flushNotes(); render(); window.scrollTo(0, 0); return; }
      if (t.dataset.sub){ sub[tab] = t.dataset.sub; flushNotes(); render(); window.scrollTo(0, 0); return; }
      if (t.dataset.mode){ rollMode = t.dataset.mode; render(); return; }
      if (t.dataset.die){ const r = rollExpr('1d' + t.dataset.die); show('d' + t.dataset.die, r.total, r.text); commit(); return; }
      if (t.dataset.key){ key(t.dataset.key); return; }
      if (t.dataset.info && !t.dataset.a){ openSheet('info', t.dataset.info); return; }
      const a = t.dataset.a, id = t.dataset.id, val = () => parseInt(hpBuf, 10), fromBar = !!t.closest('#r-fol');
      markTurn(costOf(a, t));
      switch (a){
        case 'turnnew': turn = freshTurn(); saveTurn(); render(); break;
        case 'fullscreen': toggleFs(); break;
        case 'close': closeSheet(); render(); break;
        case 'rclose': resultOpen = false; renderResult(); break;
        case 'dice': openSheet('dice'); break;
        case 'hpopen': openSheet('hp'); break;
        case 'restopen': openSheet('rest'); break;
        case 'gotrack': if (TRACK){ if (tab !== 'diary') resultOpen = false; tab = 'diary'; sub.diary = 'track'; render(); window.scrollTo(0, 0); } break;
        case 'goslots': if (tab !== 'combat') resultOpen = false; tab = 'combat'; render(); { const p = document.getElementById('slotpanel'); if (p) p.scrollIntoView({block:'center'}); } break;
        case 'undo': undo(); break;
        case 'export': exportData(); break;
        case 'init': turn = freshTurn(); saveTurn(); d20('Iniziativa', M.des); break;
        case 'check': d20('Prova di ' + ABN[t.dataset.k], M[t.dataset.k]); break;
        case 'save': { const k = t.dataset.k; d20('TS ' + ABN[k], M[k] + (SAVES.has(k) ? PB : 0)); break; }
        case 'skill': { const sk = SKILLS.find(s => s[0] === t.dataset.n); if (sheet) closeSheet(); d20(sk[0], skillMod(sk[1], sk[2])); break; }
        case 'tool': { const tl = D.tools[+t.dataset.i]; d20(tl.n, skillMod(tl.ab, tl.prof ?? 1)); break; }
        case 'reroll': if (lastD20){ const L = lastD20; lastD20 = null; paint(L.label, L.m, L.a, rnd(20), t.dataset.m, 0, '', L.opts, true); } break;
        case 'dmg': { const n = val(); if (n > 0){ closeSheet(); damage(n); } break; }
        case 'heal': { const n = val(); if (n > 0){ closeSheet(); heal(n); } break; }
        case 'temp': { const n = val(); if (n > 0){ closeSheet(); tempHp(n, 'PF temporanei', ''); } break; }
        case 'temphp': { const tp = tempBy(id); closeSheet(); tempHp(tp.amount(c), tp.n, tp.detail || 'PF temporanei'); break; }
        case 'cleartemp': S.hp.temp = 0; FX.filter(f => f.endsWithTemp).forEach(f => S.fx[f.id] = false); commit(); break;
        case 'potion': { const it = S.items.find(i => i.id === id && i.q > 0) || S.items.find(i => POTIONS[i.n] && i.q > 0); if (it){ const expr = POTIONS[it.n]; it.q -= 1; if (it.q <= 0) S.items = S.items.filter(i => i !== it); const r = rollExpr(expr); heal(r.total, it.n, `${r.text} • azione bonus`); } break; }
        case 'fxtoggle': S.fx[id] = !S.fx[id]; if (!S.fx[id] && fxBy(id).conc && S.conc === fxBy(id).concName) endConc(); commit(); break;
        case 'respip': { const r = resBy(id), max = resMax(r), on = +t.dataset.i < max - S.res[id]; S.res[id] = clamp(S.res[id] + (on ? 1 : -1), 0, max); if (armed === id && S.res[id] >= max) armed = null; commit(); break; }
        case 'resuse': { const r = resBy(id); useRes(r, r.uses[+t.dataset.u]); break; }
        case 'arm': { const r = resBy(id); if (S.res[id] < resMax(r)){ armed = armed === id ? null : id; render(); } break; }
        case 'inspuse': if (S.insp > 0){ useInsp = !useInsp; render(); } break;
        case 'insp': S.insp = Math.max(0, S.insp + +t.dataset.d); if (!S.insp) useInsp = false; commit(); break;
        case 'exh': S.exh = clamp(S.exh + +t.dataset.d, 0, 6); commit(); break;
        case 'ds': S.death.s = +t.dataset.i < S.death.s ? +t.dataset.i : +t.dataset.i + 1; commit(); break;
        case 'df': S.death.f = +t.dataset.i < S.death.f ? +t.dataset.i : +t.dataset.i + 1; commit(); break;
        case 'deathroll': {
          let k = rnd(20), msg, lt = '';
          if (armed){ const r = resBy(armed); if (r && S.res[r.id] < resMax(r)){ S.res[r.id] += 1; const k2 = rnd(20); lt = ` • ${r.token || 'risorsa'} d20[${k},${k2}]`; k = Math.max(k, k2); } armed = null; }
          if (k === 20){ S.hp.cur = 1; S.death = {s:0, f:0}; S.conds = S.conds.filter(x => x !== 'Svenuto'); msg = 'ti rialzi con 1 PF'; }
          else if (k === 1){ S.death.f = Math.min(3, S.death.f + 2); msg = S.death.f >= 3 ? 'morto' : 'due fallimenti'; }
          else if (k >= 10){ S.death.s = Math.min(3, S.death.s + 1); msg = S.death.s >= 3 ? 'stabile' : 'successo'; }
          else { S.death.f = Math.min(3, S.death.f + 1); msg = S.death.f >= 3 ? 'morto' : 'fallimento'; }
          show('Tiro contro la morte', k, msg + lt, k >= 10 ? (k === 20 ? 'crit' : '') : 'fumble'); commit(); break;
        }
        case 'concsave': { const dc = S.concDc, r = d20('TS concentrazione' + (dc ? ` CD ${dc}` : ''), M.cos + (SAVES.has('cos') ? PB : 0), {adv:!!D.concAdvantage}); if (dc){ S.concDc = 0; if (r.total < dc){ const n = S.conc; endConc(); show(`Concentrazione persa (CD ${dc})`, r.total, `${n} termina`, 'fumble'); } commit(); } break; }
        case 'concend': endConc(); commit(); break;
        case 'concset': { const sp = spellBy(id); show(sp.n, '✦', 'concentrazione' + setConc(sp.n, sp.fx)); commit(); break; }
        case 'slot': { const L = +t.dataset.l, on = +t.dataset.i < slotLeft(L); S.slots['l' + L] = clamp(S.slots['l' + L] + (on ? 1 : -1), 0, SLOTS[L]); commit(); break; }
        case 'atk': { const k = ATTACKS.find(x => x.id === t.dataset.k); d20(k.n, atkBonus(k), {attack:1, follow:{t:`Danni ${atkDmg(k)}`, a:'dmgroll', k:k.id}}); break; }
        case 'dmgroll': { const k = ATTACKS.find(x => x.id === t.dataset.k); rollDmg(k.n, atkDmg(k), k.type + riderTxt(k.id), fromBar && lastCrit); break; }
        case 'spopen': openSpell = openSpell === id ? null : id; render(); break;
        case 'spatk': { const sp = spellBy(id); d20(sp.n + (sp.rays ? ' (un raggio)' : ''), SATK, {attack:1, follow:{t:`Danni ${spDmg(sp)}`, a:'spdmg', id:sp.id}}); break; }
        case 'spdmg': { const sp = spellBy(id); rollDmg(sp.n, spDmg(sp), sp.dt + riderTxt(sp.id) + (sp.save ? ` • TS ${sp.save} CD ${DC}${sp.half ? ', metà se riesce' : ''}` : ''), fromBar && lastCrit); break; }
        case 'spfree': { const sp = spellBy(id), r = resBy(sp.freeWith); useRes(r, {kind:'spell', spell:sp.id}); break; }
        case 'spslot': { const sp = spellBy(id); if (!slotsAny()) break; const lv = SLOT_LVLS.find(x => slotLeft(x) > 0); S.slots['l' + lv] += 1; const x = rollExpr(sp.dmg(lv, c)); show(`${sp.n} (slot)`, x.total, `${x.text} ${sp.dt}${sp.save ? ` • TS ${sp.save} CD ${DC}${sp.half ? ', metà se riesce' : ''}` : ''}`); commit(); break; }
        case 'cast': castSpell(spellBy(id)); break;
        case 'cond': { const x = t.dataset.c; S.conds = S.conds.includes(x) ? S.conds.filter(y => y !== x) : [...S.conds, x]; commit(); break; }
        case 'iq': { const it = S.items.find(i => i.id === id); if (!it) break; const d = +t.dataset.d; if (d < 0 && it.q <= 1 && !ask('iq:' + id)) break; it.q += d; if (it.q <= 0) S.items = S.items.filter(i => i !== it); commit(); break; }
        case 'nmove': { const L = S.noteList, i = L.findIndex(x => x.id === id), j = i + +t.dataset.d; if (i < 0 || j < 0 || j >= L.length) break; [L[i], L[j]] = [L[j], L[i]]; S.noteList = [...L]; commit(); const b = document.querySelector(`[data-a="nmove"][data-id="${id}"][data-d="${t.dataset.d}"]`); if (b && !b.disabled) b.focus({preventScroll:true}); break; }
        case 'nedit': flushNotes(); editNote = id; editDraft = null; editFocus = true; renderNotes(); break;
        case 'ncancel': editNote = null; editDraft = null; renderNotes(); break;
        case 'nsave': { const x = S.noteList.find(n => n.id === id), v = (editDraft ?? (x && x.x) ?? '').trim(); editNote = null; editDraft = null; if (x && v) x.x = v; commit(); break; }
        case 'ndel': { if (!ask('nd:' + id)) break; S.noteList = S.noteList.filter(x => x.id !== id); if (editNote === id) editNote = null; commit(); toast('Nota eliminata: puoi annullare dal pannello Riposo'); break; }
        case 'cnt': S.counters[id] = Math.max(0, S.counters[id] + +t.dataset.d); commit(); break;
        case 'jdel': { if (!ask('jd:' + id)) break; S.journals[t.dataset.j] = S.journals[t.dataset.j].filter(m => m.id !== id); commit(); break; }
        case 'hd': if (S.hdUsed < HD_MAX && S.hp.cur > 0){ S.hdUsed += 1; const r = rollExpr('1d' + HD + (M.cos ? fmt(M.cos) : '')); heal(Math.max(1, r.total), 'Dado vita', r.text); } break;
        case 'sr': srCount = clamp(srCount + +t.dataset.d, 0, HD_MAX - S.hdUsed); renderSheetUI(false); break;
        case 'short': {
          const rolls = []; let tot = 0;
          for (let i = 0; i < srCount; i++){ const r = rnd(HD); rolls.push(r); tot += Math.max(1, r + M.cos); }
          const before = S.hp.cur;
          if (srCount){ S.hdUsed += srCount; wake(); S.hp.cur = Math.min(maxHp(), S.hp.cur + tot); }
          if (SC && SC.pact) SLOT_LVLS.forEach(L => S.slots['l' + L] = 0);
          RES.forEach(r => { if (r.reset === 'short') S.res[r.id] = 0; else if (r.reset === 'shortOne') S.res[r.id] = Math.max(0, S.res[r.id] - 1); });
          FX.forEach(f => { if (f.endsOn === 'short') S.fx[f.id] = false; });
          closeSheet();
          show('Riposo breve', srCount ? `+${S.hp.cur - before}` : '✦', (srCount ? `${srCount} dadi vita: d${HD}[${rolls.join(',')}] ${fmt(M.cos)} l'uno • ` : '') + (D.shortRestDone || 'risorse recuperate')); commit(); srCount = 0; break;
        }
        case 'long':
          if (!ask('long')) break;
          S.hp = {cur:maxHp(), temp:0}; S.hdUsed = 0; S.death = {s:0, f:0}; endConc();
          SLOT_LVLS.forEach(L => S.slots['l' + L] = 0); RES.forEach(r => S.res[r.id] = 0); FX.forEach(f => S.fx[f.id] = false);
          S.exh = Math.max(0, S.exh - 1); armed = null;
          S.conds = S.conds.filter(x => x !== 'Svenuto'); closeSheet(); show('Riposo lungo', '✦', D.longRestDone || 'PF, slot, dadi vita e risorse recuperati'); commit(); break;
      }
    });
    document.addEventListener('toggle', e => { if (e.target.id === 'turnguide'){ guideOpen = e.target.open; store.set(KEY + ':turnguide', guideOpen ? '1' : '0'); } }, true);
    document.addEventListener('change', e => {
      if (e.target.id === 'importfile' && e.target.files && e.target.files[0]) importData(e.target.files[0]);
    });
    document.addEventListener('submit', e => {
      e.preventDefault();
      const f = e.target;
      if (f.id === 'exprform'){ const v = exprVal.trim(), r = rollExpr(v); if (r){ show(v, r.total, r.text); commit(); } else toast('Formula non valida: usa per esempio 2d6+3'); return; }
      if (f.id === 'noteform'){
        const ta = document.getElementById('notenew'), x = ta.value.trim(); if (!x) return;
        S.noteList = [...S.noteList, {id:uid(), x, t:Date.now()}];
        ta.value = ''; store.set(DRAFT_KEY, ''); commit(); toast('Nota aggiunta'); return;
      }
      if (f.id === 'addform'){
        const n = document.getElementById('add-name').value.trim(); if (!n) return;
        S.items.push({id:uid(), n, q:clamp(parseInt(document.getElementById('add-qty').value, 10) || 1, 1, 9999), t:document.getElementById('add-note').value.trim()});
        f.reset(); commit(); toast(`${n} aggiunto allo zaino`); return;
      }
      if (f.dataset.j){
        const j = JOURNALS.find(x => x.id === f.dataset.j), l = f.querySelector('[name=l]').value.trim(); if (!l) return;
        const ti = f.querySelector('[name=t]'), tv = ti.value, tt = tv && tv !== ti.dataset.pre ? new Date(tv).getTime() : Date.now();
        S.journals[j.id] = [...S.journals[j.id], {id:uid(), l:l.toUpperCase(), t:isNaN(tt) ? Date.now() : tt, n:f.querySelector('[name=n]').value.trim()}];
        f.querySelector('[name=l]').value = ''; f.querySelector('[name=n]').value = ''; ti.value = ti.dataset.pre = localNow();
        show(j.doneLabel || j.n, l.toUpperCase(), 'annotato nel registro'); commit();
      }
    });
    document.addEventListener('input', e => {
      const el = e.target;
      if (el.id === 'expr') exprVal = el.value;
      else if (el.id === 'notenew') store.set(DRAFT_KEY, el.value);
      else if (el.id === 'noteedit') editDraft = el.value;
      else if (el.dataset.coin){ S.coins[el.dataset.coin] = clamp(parseInt(el.value, 10) || 0, 0, 9999999); commit({render:false}); }
    });
    document.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter'){ if (e.target.id === 'notenew'){ e.preventDefault(); document.getElementById('noteform').requestSubmit(); } else if (e.target.id === 'noteedit'){ e.preventDefault(); document.querySelector('[data-a="nsave"]').click(); } } });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape'){ if (sheet){ closeSheet(); render(); } else if (resultOpen){ resultOpen = false; renderResult(); } return; }
      if (sheet && sheet.kind === 'hp' && !e.ctrlKey && !e.metaKey){ if (/^\d$/.test(e.key)) key(e.key); else if (e.key === 'Backspace') key('back'); else if (e.key === 'Enter'){ const n = parseInt(hpBuf, 10); if (n > 0){ closeSheet(); damage(n); } } }
    });
    document.addEventListener('fullscreenchange', renderFs);
    document.addEventListener('webkitfullscreenchange', renderFs);
  }

  buildPage();
  bind();
  if (window.matchMedia('(max-width:899px)').matches) document.querySelectorAll('#tab-guide details').forEach((d, i) => { d.open = i === 0; });
  { const d = store.get(DRAFT_KEY); const ta = document.getElementById('notenew'); if (d && ta) ta.value = d; }
  try { render(); }
  catch (e) {
    console.error(e); store.set(KEY + ':broken', JSON.stringify(S));
    S = sanitize({...fresh(), ver:VER}); ref = JSON.parse(JSON.stringify(S)); render();
    toast('I dati salvati su questo dispositivo erano danneggiati: recupero la copia sincronizzata.');
  }
  renderFs();
  if (!store.ok) toast('Il browser non permette di salvare: i dati restano solo finché la pagina è aperta.');
  connect();
  if ('serviceWorker' in navigator && location.protocol === 'https:' && DEF.serviceWorker) navigator.serviceWorker.register(DEF.serviceWorker).catch(() => {});
  window.SheetDebug = {get state(){ return S; }, flush, version:VER};
}

window.Sheet = {start, md, rollExpr};
})();

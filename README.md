# kaean-warlock

Scheda interattiva di Kaean, tiefling warlock 3 (patrono Immondo), campagna di Dorekhan (D&D 2024).

Link: https://christianfio.github.io/kaean-warlock/

## Struttura

```
index.html                         pagina: carica il motore e il personaggio
engine/engine.js                   regole, salvataggio, sincronizzazione, interfaccia (uguale per tutte le schede)
engine/engine.css                  impaginazione per telefono, tablet e computer
characters/kaean-warlock/
  character.js                     dati di Kaean: caratteristiche, attacchi, incantesimi, risorse, privilegi
  texts.js                         guida, storia e background (HTML e markdown)
  theme.css                        stile del personaggio (colori, caratteri, decorazioni)
characters/_template/character.js  modello commentato per una nuova scheda
sw.js                              copia offline
```

## Aggiungere un altro personaggio

1. Copia `characters/_template` in `characters/<nome>` e compila `character.js`. Per incantesimi, effetti e risorse più complessi usa come esempio `characters/kaean-warlock/character.js`.
2. Scegli un `storageKey` nuovo e, se vuoi la sincronizzazione, un percorso Firebase nuovo (`.../<nome>.json`).
3. Facoltativo: un `theme.css` che ridefinisce le variabili in `:root` (`--cloth`, `--paper`, `--ink`, `--wax`, `--gilt`, i caratteri e le immagini `--img-*`).
4. Copia `index.html` e cambia i tre percorsi sotto `characters/`. Se usi `sw.js`, aggiorna anche l'elenco `CORE`.

## Dati

- Salvati sul dispositivo e sincronizzati su Firebase Realtime Database. Il motore unisce le modifiche campo per campo e non scrive nulla finché non ha ricevuto la copia remota, così un dispositivo vecchio o vuoto non cancella i dati degli altri.
- Dal pannello Riposo: annulla l'ultima azione, scarica una copia, ripristina una copia.
- Prima di sovrascrivere i dati locali con quelli remoti, il motore tiene le ultime 5 versioni (`<storageKey>:backups`).

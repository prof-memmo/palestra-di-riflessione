const fs = require('fs');
const path = require('path');

const exercisesData = {
    riflessione: {
        grammaticale: {},
        analisiLogica: {},
        analisiPeriodo: {}
    }
};

// --- GRAMMATICA (1-13) ---
const g = exercisesData.riflessione.grammaticale;

g.uda1 = {
    scopri: [
        {
            id: 101, title: "I 4 PILASTRI DELLA LINGUA", instruction: "Leggi la teoria e rispondi alla sfida.",
            theory: "La **GRAMMATICA** è l'insieme delle regole che permettono a una lingua di funzionare correttamente. Si divide in 4 settori fondamentali:<br>1. **FONOLOGIA**: studia i suoni.<br>2. **ORTOGRAFIA**: insegna a scrivere correttamente.<br>3. **MORFOLOGIA**: analizza la forma delle parole.<br>4. **SINTASSI**: spiega come unire le parole in frasi.",
            schema: [{ label: "Suoni", value: "Fonologia" }, { label: "Scrittura", value: "Ortografia" }, { label: "Parole", value: "Morfologia" }, { label: "Frasi", value: "Sintassi" }],
            examples: ["'CANE' (Morfologia).", "'Il cane corre' (Sintassi)."],
            text: "Studio della scrittura corretta:", options: ["Ortografia", "Sintassi"], answer: "Ortografia",
            feedback: { success: "Esatto!", map: "Ortografia = Scrivere bene." }
        }
    ],
    allenati: [{ id: 111, type: "multiple-choice", text: "Studio dei suoni:", options: ["Fonologia", "Sintassi"], answer: "Fonologia", feedback: { map: "Fonologia studia i fonemi." } }],
    verifica: [{ id: 121, type: "multiple-choice", text: "La morfologia studia:", options: ["Le parole", "Le frasi"], answer: "Le parole", feedback: { map: "Morfologia = studio della forma." } }],
    recupera: { title: "Recupero", content: "Ripassa i 4 pilastri.", exercises: [{ id: 131, text: "Suono = ___", answer: "fonologia" }] }
};

g.uda2 = {
    scopri: [
        {
            id: 201, title: "FONOLOGIA E ALFABETO", instruction: "Scopri i suoni della lingua.",
            theory: "L'alfabeto italiano ha **21 lettere**, più 5 straniere (J, K, W, X, Y). I suoni si dividono in vocali e consonanti.",
            schema: [{ label: "Vocali", value: "A, E, I, O, U (7 suoni)" }, { label: "Straniere", value: "J, K, W, X, Y" }],
            text: "Quante sono le lettere straniere?", options: ["5", "21"], answer: "5",
            feedback: { success: "Corretto!", map: "J, K, W, X, Y." }
        }
    ],
    allenati: [{ id: 211, type: "multiple-choice", text: "La J è chiamata:", options: ["I lunga", "Iks"], answer: "I lunga", feedback: { map: "J = I lunga." } }],
    verifica: [{ id: 221, type: "multiple-choice", text: "In 'paura' c'è uno iato?", options: ["Sì", "No"], answer: "Sì", feedback: { map: "A-U sono separate." } }],
    recupera: { title: "Recupero", content: "Dittongo vs Iato.", exercises: [{ id: 231, text: "Unione vocali = ___", answer: "dittongo" }] }
};

g.uda3 = {
    scopri: [
        {
            id: 301, title: "L'ARTICOLO", theory: "L'articolo precede il nome. DETERMINATIVO (il, lo, la...), INDETERMINATIVO (un, uno, una...), PARTITIVO (del, dello...).",
            text: "Articolo per 'zaino':", options: ["Il", "Lo"], answer: "Lo", feedback: { map: "LO davanti a Z." }
        }
    ],
    allenati: [{ id: 311, type: "multiple-choice", text: "Un'amica vuole l'apostrofo?", options: ["Sì", "No"], answer: "Sì", feedback: { map: "Femminile + vocale." } }],
    verifica: [{ id: 321, type: "multiple-choice", text: "Plurale di LO:", options: ["I", "Gli"], answer: "Gli", feedback: { map: "LO -> GLI." } }],
    recupera: { title: "Recupero", content: "Uso di LO e UN'.", exercises: [{ id: 331, text: "Articolo per gnomo: ___", answer: "lo" }] }
};

g.uda4 = {
    scopri: [
        {
            id: 401, title: "IL NOME", theory: "Classificazione: Comune/Proprio, Concreto/Astratto, Individuale/Collettivo. Struttura: Primitivo, Derivato, Alterato, Composto.",
            text: "Nome collettivo di navi:", options: ["Flotta", "Mandra"], answer: "Flotta", feedback: { map: "Flotta = insieme di navi." }
        }
    ],
    allenati: [{ id: 411, type: "multiple-choice", text: "'Casetta' è un nome:", options: ["Alterato", "Derivato"], answer: "Alterato", feedback: { map: "Indica piccolezza." } }],
    verifica: [{ id: 421, type: "multiple-choice", text: "'Bellezza' è un nome:", options: ["Astratto", "Concreto"], answer: "Astratto", feedback: { map: "È un'idea." } }],
    recupera: { title: "Recupero", content: "Tipi di nomi.", exercises: [{ id: 431, text: "Insieme di api: ___", answer: "sciame" }] }
};

g.uda5 = {
    scopri: [
        {
            id: 501, title: "L'AGGETTIVO QUALIFICATIVO", theory: "Indica una qualità. Gradi: Positivo (bello), Comparativo (più bello), Superlativo (bellissimo).",
            text: "Grado di 'altissimo':", options: ["Superlativo assoluto", "Comparativo"], answer: "Superlativo assoluto", feedback: { map: "-issimo = Superlativo assoluto." }
        }
    ],
    allenati: [{ id: 511, type: "multiple-choice", text: "Comparativo di maggioranza:", options: ["Più grande", "Il più grande"], answer: "Più grande", feedback: { map: "Più + aggettivo." } }],
    verifica: [{ id: 521, type: "multiple-choice", text: "'Basso' è grado:", options: ["Positivo", "Relativo"], answer: "Positivo", feedback: { map: "Qualità base." } }],
    recupera: { title: "Recupero", content: "I gradi dell'aggettivo.", exercises: [{ id: 531, text: "Molto buono = ___", answer: "buonissimo" }] }
};

g.uda6 = {
    scopri: [
        {
            id: 601, title: "AGGETTIVI DETERMINATIVI", theory: "Possessivi (mio), Dimostrativi (questo), Indefiniti (alcuni), Numerali (due, primo).",
            text: "In 'Questo libro', 'questo' è:", options: ["Dimostrativo", "Possessivo"], answer: "Dimostrativo", feedback: { map: "Indica posizione." }
        }
    ],
    allenati: [{ id: 611, type: "multiple-choice", text: "Aggettivo numerale ordinale:", options: ["Terzo", "Tre"], answer: "Terzo", feedback: { map: "Indica l'ordine." } }],
    verifica: [{ id: 621, type: "multiple-choice", text: "'Tuo' è un aggettivo:", options: ["Possessivo", "Indefinito"], answer: "Possessivo", feedback: { map: "Indica possesso." } }],
    recupera: { title: "Recupero", content: "Possessivi e Dimostrativi.", exercises: [{ id: 631, text: "Vicino a chi parla: ___", answer: "questo" }] }
};

g.uda7 = {
    scopri: [
        {
            id: 701, title: "IL PRONOME", theory: "Sostituisce il nome. Personali (io, tu, me, lo...), Relativi (che, cui, il quale...), Possessivi (il mio).",
            text: "In 'Mario corre; egli è stanco', 'egli' è:", options: ["Pronome", "Nome"], answer: "Pronome", feedback: { map: "Sostituisce Mario." }
        }
    ],
    allenati: [{ id: 711, type: "multiple-choice", text: "Pronome relativo più usato:", options: ["Che", "Chi"], answer: "Che", feedback: { map: "Invariabile, per persone e cose." } }],
    verifica: [{ id: 721, type: "multiple-choice", text: "Sostituisci 'a lui' con un pronome:", options: ["Gli", "Lo"], answer: "Gli", feedback: { map: "Gli = a lui." } }],
    recupera: { title: "Recupero", content: "Pronomi personali.", exercises: [{ id: 731, text: "Sostituisce 'a lei': ___", answer: "le" }] }
};

g.uda8 = {
    scopri: [
        {
            id: 801, title: "IL VERBO: STRUTTURA", theory: "Parte variabile. Radice (fissa) + Desinenza (variabile: tempo, modo, persona). 3 coniugazioni: -are, -ere, -ire.",
            text: "Coniugazione di 'leggere':", options: ["2^ (-ere)", "1^ (-are)"], answer: "2^ (-ere)", feedback: { map: "Legg-ere." }
        }
    ],
    allenati: [{ id: 811, type: "multiple-choice", text: "Verbo ausiliare:", options: ["Essere", "Mangiare"], answer: "Essere", feedback: { map: "Essere e Avere sono ausiliari." } }],
    verifica: [{ id: 821, type: "multiple-choice", text: "La persona 'noi' è:", options: ["1^ plurale", "2^ plurale"], answer: "1^ plurale", feedback: { map: "Io, tu, lui, noi..." } }],
    recupera: { title: "Recupero", content: "Le coniugazioni.", exercises: [{ id: 831, text: "Mangiare è della ___ coniugazione", answer: "prima" }] }
};

g.uda9 = {
    scopri: [
        {
            id: 901, title: "IL VERBO: MODO INDICATIVO", theory: "Esprime realtà e certezza. 8 tempi (4 semplici, 4 composti).",
            text: "Tempo di 'io mangiai':", options: ["Passato remoto", "Imperfetto"], answer: "Passato remoto", feedback: { map: "Azione conclusa nel passato." }
        }
    ],
    allenati: [{ id: 911, type: "multiple-choice", text: "Tempo di 'avevo visto':", options: ["Trapassato prossimo", "Passato prossimo"], answer: "Trapassato prossimo", feedback: { map: "Imperfetto ausiliare + part. passato." } }],
    verifica: [{ id: 921, type: "multiple-choice", text: "Tempo di 'canterò':", options: ["Futuro semplice", "Presente"], answer: "Futuro semplice", feedback: { map: "Azione futura." } }],
    recupera: { title: "Recupero", content: "Tempi dell'indicativo.", exercises: [{ id: 931, text: "Io sono stato è passato ___", answer: "prossimo" }] }
};

g.uda10 = {
    scopri: [
        {
            id: 1001, title: "IL VERBO: CONGIUNTIVO E CONDIZIONALE", theory: "Congiuntivo (dubbio, desiderio, spero che...). Condizionale (possibilità legata a condizione, se... allora...).",
            text: "Modo di 'Spero che tu venga':", options: ["Congiuntivo", "Indicativo"], answer: "Congiuntivo", feedback: { map: "Esprime speranza." }
        }
    ],
    allenati: [{ id: 1011, type: "multiple-choice", text: "Modo di 'Verrei se potessi':", options: ["Condizionale", "Congiuntivo"], answer: "Condizionale", feedback: { map: "Verrei = Condizionale." } }],
    verifica: [{ id: 1021, type: "multiple-choice", text: "Tempo di 'che io fossi':", options: ["Imperfetto congiuntivo", "Presente congiuntivo"], answer: "Imperfetto congiuntivo", feedback: { map: "Fossi = Imperfetto." } }],
    recupera: { title: "Recupero", content: "Uso del congiuntivo.", exercises: [{ id: 1031, text: "Spero che lui ___ (essere) felice", answer: "sia" }] }
};

g.uda11 = {
    scopri: [
        {
            id: 1101, title: "MODI INDEFINITI E IMPERATIVO", theory: "Imperativo (ordine). Infiniti (mangiare), Participio (mangiato), Gerundio (mangiando).",
            text: "Modo di 'Prendi!':", options: ["Imperativo", "Infinito"], answer: "Imperativo", feedback: { map: "È un comando." }
        }
    ],
    allenati: [{ id: 1111, type: "multiple-choice", text: "'Cantando' è un:", options: ["Gerundio", "Participio"], answer: "Gerundio", feedback: { map: "-ando/-endo = Gerundio." } }],
    verifica: [{ id: 1121, type: "multiple-choice", text: "Participio passato di 'vedere':", options: ["Visto", "Veduto"], answer: "Visto", feedback: { map: "Visto è la forma comune." } }],
    recupera: { title: "Recupero", content: "Gerundio e Participio.", exercises: [{ id: 1131, text: "Mangiato è ___ passato", answer: "participio" }] }
};

g.uda12 = {
    scopri: [
        {
            id: 1201, title: "AVVERBIO E PREPOSIZIONE", theory: "Avverbio: invariabile, modifica il verbo (bene, male, oggi...). Preposizione: collega parole (di, a, da...).",
            text: "In 'Corre velocemente', 'velocemente' è:", options: ["Avverbio", "Aggettivo"], answer: "Avverbio", feedback: { map: "Modifica il verbo." }
        }
    ],
    allenati: [{ id: 1211, type: "multiple-choice", text: "Preposizione semplice:", options: ["Fra", "Sulla"], answer: "Fra", feedback: { map: "Di, a, da, in, con, su, per, tra, fra." } }],
    verifica: [{ id: 1221, type: "multiple-choice", text: "In + il =", options: ["Nel", "Sul"], answer: "Nel", feedback: { map: "Preposizione articolata." } }],
    recupera: { title: "Recupero", content: "Avverbi e Preposizioni.", exercises: [{ id: 1231, text: "Avverbio di tempo: ___", answer: "oggi" }] }
};

g.uda13 = {
    scopri: [
        {
            id: 1301, title: "CONGIUNZIONE E INTERIEZIONE", theory: "Congiunzione: unisce frasi (e, ma, perché...). Interiezione: esprime emozione (Ahi!, Oh!, Bravo!).",
            text: "In 'Pane e burro', 'e' è:", options: ["Congiunzione", "Preposizione"], answer: "Congiunzione", feedback: { map: "Unisce due parole." }
        }
    ],
    allenati: [{ id: 1311, type: "multiple-choice", text: "'Ahimè!' è una:", options: ["Interiezione", "Congiunzione"], answer: "Interiezione", feedback: { map: "Esprime dolore." } }],
    verifica: [{ id: 1321, type: "multiple-choice", text: "Congiunzione coordinante:", options: ["Ma", "Perché"], answer: "Ma", feedback: { map: "Mette sullo stesso piano." } }],
    recupera: { title: "Recupero", content: "Interiezioni e Congiunzioni.", exercises: [{ id: 1331, text: "Unisce due frasi: ___", answer: "congiunzione" }] }
};

// --- ANALISI LOGICA (1-13) ---
const l = exercisesData.riflessione.analisiLogica;

l.udaLogica1 = {
    scopri: [
        {
            id: 2101, title: "LA FRASE MINIMA", theory: "Composta da SOGGETTO (chi fa l'azione) + PREDICATO (l'azione).",
            text: "In 'Il cane abbaia', il soggetto è:", options: ["Il cane", "Abbaia"], answer: "Il cane", feedback: { map: "Chi compie l'azione." }
        }
    ],
    allenati: [{ id: 2111, type: "multiple-choice", text: "Predicato di 'Marco ride':", options: ["Ride", "Marco"], answer: "Ride" }],
    verifica: [{ id: 2121, type: "multiple-choice", text: "Frase minima:", options: ["Il gatto dorme", "Il gatto nero dorme"], answer: "Il gatto dorme" }],
    recupera: { title: "Recupero", content: "Soggetto e Predicato.", exercises: [{ id: 2131, text: "Chi fa l'azione = ___", answer: "soggetto" }] }
};

l.udaLogica2 = {
    scopri: [
        {
            id: 2201, title: "ATTRIBUTO E APPOSIZIONE", theory: "Attributo: aggettivo (il bravo alunno). Apposizione: nome che ne spiega un altro (il fiume Po).",
            text: "In 'Il fiume Po', 'fiume' è:", options: ["Apposizione", "Attributo"], answer: "Apposizione", feedback: { map: "È un nome." }
        }
    ],
    allenati: [{ id: 2211, type: "multiple-choice", text: "In 'Un bel quadro', 'bel' è:", options: ["Attributo", "Apposizione"], answer: "Attributo" }],
    verifica: [{ id: 2221, type: "multiple-choice", text: "Apposizione in 'Lo scrittore Manzoni':", options: ["Scrittore", "Manzoni"], answer: "Scrittore" }],
    recupera: { title: "Recupero", content: "Aggettivo vs Nome.", exercises: [{ id: 2231, text: "Aggettivo in logica = ___", answer: "attributo" }] }
};

l.udaLogica3 = {
    scopri: [
        {
            id: 2301, title: "IL SOGGETTO", theory: "Può essere espresso, sottinteso (vado = io) o partitivo (entrano dei ragazzi).",
            text: "Soggetto di 'Corriamo':", options: ["Noi", "Senza soggetto"], answer: "Noi", feedback: { map: "Soggetto sottinteso." }
        }
    ],
    allenati: [{ id: 2311, type: "multiple-choice", text: "In 'Escono dei fiori', il soggetto è:", options: ["Dei fiori", "Sottinteso"], answer: "Dei fiori", feedback: { map: "Soggetto partitivo." } }],
    verifica: [{ id: 2321, type: "multiple-choice", text: "Chi fa l'azione in 'Ti piace il gelato?':", options: ["Il gelato", "Ti"], answer: "Il gelato" }],
    recupera: { title: "Recupero", content: "Soggetto partitivo.", exercises: [{ id: 2331, text: "Soggetto non scritto = ___", answer: "sottinteso" }] }
};

l.udaLogica4 = {
    scopri: [
        {
            id: 2401, title: "PREDICATO VERBALE E NOMINALE", theory: "Verbale: azione (corre). Nominale: essere + nome/agg (è bello).",
            text: "In 'Luca è un medico', il predicato è:", options: ["Nominale", "Verbale"], answer: "Nominale", feedback: { map: "Essere + nome." }
        }
    ],
    allenati: [{ id: 2411, type: "multiple-choice", text: "In 'Il sole splende', il predicato è:", options: ["Verbale", "Nominale"], answer: "Verbale" }],
    verifica: [{ id: 2421, type: "multiple-choice", text: "Predicato nominale:", options: ["La mela è rossa", "Mangio la mela"], answer: "La mela è rossa" }],
    recupera: { title: "Recupero", content: "PV vs PN.", exercises: [{ id: 2431, text: "Verbo essere + agg = ___", answer: "nominale" }] }
};

l.udaLogica5 = {
    scopri: [
        {
            id: 2501, title: "COMPLEMENTO OGGETTO", theory: "Risponde a: Chi? Che cosa? (diretto, senza preposizioni).",
            text: "In 'Mangio la pizza', l'oggetto è:", options: ["La pizza", "Mangio"], answer: "La pizza", feedback: { map: "Che cosa mangio?" }
        }
    ],
    allenati: [{ id: 2511, type: "multiple-choice", text: "C'è l'oggetto in 'Vado a casa'?", options: ["No", "Sì"], answer: "No", feedback: { map: "A casa è luogo." } }],
    verifica: [{ id: 2521, type: "multiple-choice", text: "Oggetto in 'Ti vedo':", options: ["Ti", "Vedo"], answer: "Ti", feedback: { map: "Vedo chi? Te (Ti)." } }],
    recupera: { title: "Recupero", content: "Chi? Cosa?", exercises: [{ id: 2531, text: "Bersaglio dell'azione = ___", answer: "oggetto" }] }
};

l.udaLogica6 = {
    scopri: [
        {
            id: 2601, title: "COMPLEMENTI DI LUOGO", theory: "Stato in luogo (dove?), Moto a luogo (verso dove?), Moto da luogo (da dove?), Moto per luogo (attraverso dove?).",
            text: "In 'Vado a Roma', 'a Roma' è:", options: ["Moto a luogo", "Stato in luogo"], answer: "Moto a luogo", feedback: { map: "Direzione verso un posto." }
        }
    ],
    allenati: [{ id: 2611, type: "multiple-choice", text: "In 'Resto a casa', è:", options: ["Stato in luogo", "Moto da luogo"], answer: "Stato in luogo" }],
    verifica: [{ id: 2621, type: "multiple-choice", text: "In 'Passo per i campi', è:", options: ["Moto per luogo", "Moto a luogo"], answer: "Moto per luogo" }],
    recupera: { title: "Recupero", content: "I 4 luoghi.", exercises: [{ id: 2631, text: "Dove mi trovo = ___ in luogo", answer: "stato" }] }
};

l.udaLogica7 = {
    scopri: [
        {
            id: 2701, title: "COMPLEMENTI DI TEMPO", theory: "Determinato (quando?), Continuato (per quanto tempo?).",
            text: "In 'Vengo alle 8', 'alle 8' è:", options: ["Tempo determinato", "Tempo continuato"], answer: "Tempo determinato", feedback: { map: "Un momento preciso." }
        }
    ],
    allenati: [{ id: 2711, type: "multiple-choice", text: "In 'Ho studiato per tre ore', è:", options: ["Tempo continuato", "Tempo determinato"], answer: "Tempo continuato" }],
    verifica: [{ id: 2721, type: "multiple-choice", text: "Domanda del tempo determinato:", options: ["Quando?", "Per quanto?"], answer: "Quando?" }],
    recupera: { title: "Recupero", content: "Quando? Per quanto?", exercises: [{ id: 2731, text: "Tempo che continua = ___", answer: "continuato" }] }
};

l.udaLogica8 = {
    scopri: [
        {
            id: 2801, title: "COMPLEMENTO DI SPECIFICAZIONE", theory: "Di chi? Di cosa? (precisa il significato di un nome).",
            text: "In 'Il libro di Mario', 'di Mario' è:", options: ["Specificazione", "Termine"], answer: "Specificazione", feedback: { map: "Di chi?" }
        }
    ],
    allenati: [{ id: 2811, type: "multiple-choice", text: "Specificazione di 'La borsa di pelle':", options: ["Di pelle", "La borsa"], answer: "Di pelle" }],
    verifica: [{ id: 2821, type: "multiple-choice", text: "Preposizione tipica:", options: ["Di", "A"], answer: "Di" }],
    recupera: { title: "Recupero", content: "Specificare il nome.", exercises: [{ id: 2831, text: "Di chi? = ___", answer: "specificazione" }] }
};

l.udaLogica9 = {
    scopri: [
        {
            id: 2901, title: "COMPLEMENTO DI TERMINE", theory: "A chi? A cosa? (destinatario dell'azione).",
            text: "In 'Ho parlato a Luca', 'a Luca' è:", options: ["Termine", "Specificazione"], answer: "Termine", feedback: { map: "A chi?" }
        }
    ],
    allenati: [{ id: 2911, type: "multiple-choice", text: "In 'Ti ho dato un libro', 'Ti' è:", options: ["Termine", "Oggetto"], answer: "Termine", feedback: { map: "A te (Ti)." } }],
    verifica: [{ id: 2921, type: "multiple-choice", text: "Preposizione tipica:", options: ["A", "Di"], answer: "A" }],
    recupera: { title: "Recupero", content: "Il destinatario.", exercises: [{ id: 2931, text: "A chi? = ___", answer: "termine" }] }
};

l.udaLogica10 = {
    scopri: [
        {
            id: 2001, title: "AGENTE E CAUSA EFFICIENTE", theory: "Da chi? (agente, persona), Da che cosa? (causa efficiente, cosa) nelle frasi passive.",
            text: "In 'Il topo è mangiato dal gatto', 'dal gatto' è:", options: ["Agente", "Causa efficiente"], answer: "Agente", feedback: { map: "È un essere vivente." }
        }
    ],
    allenati: [{ id: 2011, type: "multiple-choice", text: "In 'La casa fu distrutta dal vento', 'dal vento' è:", options: ["Causa efficiente", "Agente"], answer: "Causa efficiente" }],
    verifica: [{ id: 2021, type: "multiple-choice", text: "Domanda per l'agente:", options: ["Da chi?", "A chi?"], answer: "Da chi?" }],
    recupera: { title: "Recupero", content: "Persona vs Cosa.", exercises: [{ id: 2031, text: "Da chi (persona) = ___", answer: "agente" }] }
};

l.udaLogica11 = {
    scopri: [
        {
            id: 2111, title: "MODO E MEZZO", theory: "Modo: come? (con gioia). Mezzo: con che cosa? (con la penna).",
            text: "In 'Scrivo con la penna', 'con la penna' è:", options: ["Mezzo", "Modo"], answer: "Mezzo", feedback: { map: "Strumento per fare l'azione." }
        }
    ],
    allenati: [{ id: 2112, type: "multiple-choice", text: "In 'Cammino con calma', 'con calma' è:", options: ["Modo", "Mezzo"], answer: "Modo" }],
    verifica: [{ id: 2122, type: "multiple-choice", text: "In 'Vado in treno', 'in treno' è:", options: ["Mezzo", "Luogo"], answer: "Mezzo", feedback: { map: "Strumento di viaggio." } }],
    recupera: { title: "Recupero", content: "Come? Con cosa?", exercises: [{ id: 2132, text: "Strumento = ___", answer: "mezzo" }] }
};

l.udaLogica12 = {
    scopri: [
        {
            id: 2211, title: "CAUSA E FINE", theory: "Causa: per quale motivo passato? (tremo per il freddo). Fine: per quale scopo futuro? (studio per il diploma).",
            text: "In 'Studio per la promozione', 'per la promozione' è:", options: ["Fine", "Causa"], answer: "Fine", feedback: { map: "Obiettivo futuro." }
        }
    ],
    allenati: [{ id: 2212, type: "multiple-choice", text: "In 'Piango per il dolore', è:", options: ["Causa", "Fine"], answer: "Causa" }],
    verifica: [{ id: 2222, type: "multiple-choice", text: "Domanda del fine:", options: ["Per quale scopo?", "Per quale motivo?"], answer: "Per quale scopo?" }],
    recupera: { title: "Recupero", content: "Motivo vs Scopo.", exercises: [{ id: 2232, text: "Obiettivo = ___", answer: "fine" }] }
};

l.udaLogica13 = {
    scopri: [
        {
            id: 2311, title: "COMPAGNIA E UNIONE", theory: "Compagnia: con chi? (persona). Unione: con che cosa? (cosa).",
            text: "In 'Esco con Mario', 'con Mario' è:", options: ["Compagnia", "Unione"], answer: "Compagnia", feedback: { map: "Con una persona." }
        }
    ],
    allenati: [{ id: 2312, type: "multiple-choice", text: "In 'Pasta con il tonno', è:", options: ["Unione", "Compagnia"], answer: "Unione" }],
    verifica: [{ id: 2322, type: "multiple-choice", text: "Domanda di unione:", options: ["Con che cosa?", "Con chi?"], answer: "Con che cosa?" }],
    recupera: { title: "Recupero", content: "Insieme a...", exercises: [{ id: 2332, text: "Con una persona = ___", answer: "compagnia" }] }
};

// --- ANALISI DEL PERIODO (1-12) ---
const p = exercisesData.riflessione.analisiPeriodo;

p.udaPeriodo1 = {
    scopri: [
        {
            id: 3101, title: "STRUTTURA DEL PERIODO", theory: "Un periodo ha tanti verbi quante frasi. PRINCIPALE (senza legami), COORDINATA (stesso piano), SUBORDINATA (dipendente).",
            text: "In 'Esco perché piove', 'Esco' è:", options: ["Principale", "Subordinata"], answer: "Principale", feedback: { map: "Ha senso da sola." }
        }
    ],
    allenati: [{ id: 3111, type: "multiple-choice", text: "In 'Studio e imparo', 'e imparo' è:", options: ["Coordinata", "Subordinata"], answer: "Coordinata" }],
    verifica: [{ id: 3121, type: "multiple-choice", text: "In 'Spero che tu stia bene', 'che tu stia bene' è:", options: ["Subordinata", "Principale"], answer: "Subordinata" }],
    recupera: { title: "Recupero", content: "Le 3 frasi.", exercises: [{ id: 3131, text: "Frase autonoma = ___", answer: "principale" }] }
};

p.udaPeriodo2 = {
    scopri: [
        {
            id: 3201, title: "LA PRINCIPALE", theory: "L'unica frase che sta in piedi da sola. Può essere dichiarativa, interrogativa, esclamativa, imperativa.",
            text: "Qual è la principale in 'Se mangi, ingrassi'?", options: ["Ingrassi", "Se mangi"], answer: "Ingrassi", feedback: { map: "È quella che non ha il 'se'." }
        }
    ],
    allenati: [{ id: 3211, type: "multiple-choice", text: "Principale in 'Quando arrivo, chiamo':", options: ["Chiamo", "Quando arrivo"], answer: "Chiamo" }],
    verifica: [{ id: 3221, type: "multiple-choice", text: "Una principale può essere interrogativa?", options: ["Sì", "No"], answer: "Sì" }],
    recupera: { title: "Recupero", content: "Cerca il cuore del periodo.", exercises: [{ id: 3231, text: "La frase più importante = ___", answer: "principale" }] }
};

p.udaPeriodo3 = {
    scopri: [
        {
            id: 3301, title: "LA COORDINAZIONE", theory: "Due frasi sullo stesso piano. Copulativa (e, anche), Avversativa (ma, però), Disgiuntiva (o, oppure).",
            text: "In 'Piove ma esco', che coordinata è?", options: ["Avversativa", "Copulativa"], answer: "Avversativa", feedback: { map: "C'è un contrasto (ma)." }
        }
    ],
    allenati: [{ id: 3311, type: "multiple-choice", text: "In 'Vieni o resti?', è:", options: ["Disgiuntiva", "Copulativa"], answer: "Disgiuntiva" }],
    verifica: [{ id: 3321, type: "multiple-choice", text: "'E' è una congiunzione:", options: ["Copulativa", "Avversativa"], answer: "Copulativa" }],
    recupera: { title: "Recupero", content: "Tipi di coordinate.", exercises: [{ id: 3331, text: "O, oppure = ___", answer: "disgiuntiva" }] }
};

p.udaPeriodo4 = {
    scopri: [
        {
            id: 3401,
            title: "La Proposizione Incidentale",
            theory: "La proposizione incidentale è una proposizione che si inserisce nel periodo <span style='color: #e74c3c; font-weight: bold;'>SENZA ALCUN LEGAME SINTATTICO</span> con le altre frasi.<br><br>Essa ha per lo più la funzione di <span style='color: #2980b9; font-weight: bold;'>completare il senso</span>, precisare o chiarire un concetto (è come un inciso o un commento del narratore).<br><br>Data la sua funzione accessoria, può essere <span style='color: #27ae60; font-weight: bold;'>ELIMINATA</span> dal testo senza che esso perda il suo senso logico.<br>La proposizione incidentale è racchiusa tra due <span style='color: #8e44ad; font-weight: bold;'>VIRGOLE</span>, due <span style='color: #8e44ad; font-weight: bold;'>LINEETTE</span>, oppure è collocata tra <span style='color: #8e44ad; font-weight: bold;'>PARENTESI</span>.<br><br><em>Esempio:</em> Marco, <span style='color: #d35400; font-weight: bold;'>come dicono tutti</span>, è un ottimo atleta.<br><em>Prova di eliminazione:</em> Marco è un ottimo atleta. (La frase ha senso!)",
            text: "Se elimino una proposizione incidentale dal periodo:",
            options: [
                "Il periodo perde di senso",
                "Il periodo mantiene il suo senso logico"
            ],
            answer: "Il periodo mantiene il suo senso logico"
        }
    ],
    allenati: [
        {
            id: 3411,
            type: "completion",
            text: "Nei seguenti periodi individua la proposizione incidentale e scrivi nel riquadro ESATTAMENTE la PRIMA PAROLA dell'incidentale (in minuscolo):<br><br>1. La nuova automobile, mi hanno detto, è molto silenziosa e veloce. ___<br>2. Luca non è arrivato in tempo per la riunione – si era addormentato – quindi il capo si è arrabbiato. ___<br>3. Domani, se non piove, faremo una bella scampagnata in montagna. ___<br>4. Questo ristorante (sebbene sia costoso) offre piatti di altissima qualità. ___",
            answer: "mi|si|se|sebbene"
        }
    ],
    verifica: [],
    recupera: []
};

p.udaPeriodo5 = {
    scopri: [
        {
            id: 3501, title: "SOGGETTIVE E OGGETTIVE", theory: "Soggettiva: fa da soggetto a un verbo impersonale (È bene CHE TU STUDI). Oggettiva: fa da oggetto (Dico CHE TU STUDI).",
            text: "In 'Sembra che piova', 'che piova' è:", options: ["Soggettiva", "Oggettiva"], answer: "Soggettiva", feedback: { map: "Il verbo sembra è impersonale." }
        }
    ],
    allenati: [{ id: 3511, type: "multiple-choice", text: "In 'Spero di vincere', 'di vincere' è:", options: ["Oggettiva", "Soggettive"], answer: "Oggettiva", feedback: { map: "Io spero (cosa?) di vincere." } }],
    verifica: [{ id: 3521, type: "multiple-choice", text: "Le soggettive dipendono da:", options: ["Verbi impersonali", "Verbi transitivi"], answer: "Verbi impersonali" }],
    recupera: { title: "Recupero", content: "Soggetto vs Oggetto.", exercises: [{ id: 3531, text: "Fa da oggetto = ___", answer: "oggettiva" }] }
};

p.udaPeriodo6 = {
    scopri: [
        {
            id: 3601, title: "DICHIARATIVE E INTERROGATIVE INDIRETTE", theory: "Dichiarativa: spiega un nome (L'idea CHE TU ESCA). Interrogativa indiretta: esprime un dubbio/domanda (Mi chiedo CHI SIA).",
            text: "In 'Mi chiedo dove tu vada', che subordinata è?", options: ["Interrogativa indiretta", "Dichiarativa"], answer: "Interrogativa indiretta", feedback: { map: "C'è una domanda nascosta." }
        }
    ],
    allenati: [{ id: 3611, type: "multiple-choice", text: "In 'Ho la certezza che vincerai', è:", options: ["Dichiarativa", "Oggettiva"], answer: "Dichiarativa", feedback: { map: "Spiega il nome 'certezza'." } }],
    verifica: [{ id: 3621, type: "multiple-choice", text: "Domanda nascosta =", options: ["Interrogativa indiretta", "Soggettiva"], answer: "Interrogativa indiretta" }],
    recupera: { title: "Recupero", content: "Spiegare vs Chiedere.", exercises: [{ id: 3631, text: "Spiega un nome = ___", answer: "dichiarativa" }] }
};

p.udaPeriodo7 = {
    scopri: [
        {
            id: 3701, title: "SUBORDINATE RELATIVE", theory: "Introdotte da un pronome relativo (che, cui, il quale). Proprie (completano il nome), Improprie (valore di causa, fine, ecc.).",
            text: "In 'Vedo il cane che corre', 'che corre' è:", options: ["Relativa", "Oggettiva"], answer: "Relativa", feedback: { map: "Riferito al nome cane." }
        }
    ],
    allenati: [{ id: 3711, type: "multiple-choice", text: "In 'Cerco uno che mi aiuti', è:", options: ["Relativa", "Soggettiva"], answer: "Relativa" }],
    verifica: [{ id: 3721, type: "multiple-choice", text: "Introduzione tipica:", options: ["Pronome relativo", "Congiunzione"], answer: "Pronome relativo" }],
    recupera: { title: "Recupero", content: "Il legame del relativo.", exercises: [{ id: 3731, text: "Usa il pronome 'che' = ___", answer: "relativa" }] }
};

p.udaPeriodo8 = {
    scopri: [
        {
            id: 3801, title: "CAUSALI E FINALI", theory: "Causale: il motivo (perché piove). Finale: lo scopo (affinché tu studi).",
            text: "In 'Esco perché sono stanco', è:", options: ["Causale", "Finale"], answer: "Causale", feedback: { map: "Indica il motivo." }
        }
    ],
    allenati: [{ id: 3811, type: "multiple-choice", text: "In 'Ti scrivo per avvisarti', è:", options: ["Finale", "Causale"], answer: "Finale", feedback: { map: "Indica lo scopo." } }],
    verifica: [{ id: 3821, type: "multiple-choice", text: "'Affinché' introduce una:", options: ["Finale", "Causale"], answer: "Finale" }],
    recupera: { title: "Recupero", content: "Perché vs Per cosa.", exercises: [{ id: 3831, text: "Indica lo scopo = ___", answer: "finale" }] }
};

p.udaPeriodo9 = {
    scopri: [
        {
            id: 3901, title: "TEMPORALI", theory: "Indicano quando avviene l'azione (mentre mangio, dopo che sono uscito).",
            text: "In 'Mentre dormivo, sognavo', 'mentre dormivo' è:", options: ["Temporale", "Causale"], answer: "Temporale", feedback: { map: "Indica il tempo." }
        }
    ],
    allenati: [{ id: 3911, type: "multiple-choice", text: "In 'Dopo aver mangiato, uscii', è:", options: ["Temporale", "Finale"], answer: "Temporale" }],
    verifica: [{ id: 3921, type: "multiple-choice", text: "Congiunzione tipica:", options: ["Quando", "Perché"], answer: "Quando" }],
    recupera: { title: "Recupero", content: "Il tempo nel periodo.", exercises: [{ id: 3931, text: "Indica quando = ___", answer: "temporale" }] }
};

p.udaPeriodo10 = {
    scopri: [
        {
            id: 3001, title: "CONCESSIVE E AVVERSATIVE", theory: "Concessiva: nonostante qualcosa (Sebbene piova, esco). Avversativa: invece di qualcosa (Invece di studiare, gioca).",
            text: "In 'Sebbene fossi stanco, lavorai', è:", options: ["Concessiva", "Temporale"], answer: "Concessiva", feedback: { map: "Indica un ostacolo superato." }
        }
    ],
    allenati: [{ id: 3011, type: "multiple-choice", text: "In 'Mentre tu ridi, io piango' (contrasto), è:", options: ["Avversativa", "Temporale"], answer: "Avversativa" }],
    verifica: [{ id: 3021, type: "multiple-choice", text: "'Nonostante' introduce una:", options: ["Concessiva", "Finale"], answer: "Concessiva" }],
    recupera: { title: "Recupero", content: "Contrasti e ostacoli.", exercises: [{ id: 3031, text: "Nonostante... = ___", answer: "concessiva" }] }
};

p.udaPeriodo11 = {
    scopri: [
        {
            id: 3111, title: "CONDIZIONALI E PERIODO IPOTETICO", theory: "Esprime l'ipotesi (Se studi, sarai promosso). Unione di Protasi (se...) e Apodosi (conseguenza).",
            text: "In 'Se piove, resto a casa', 'Se piove' è:", options: ["Condizionale (Protasi)", "Apodosi"], answer: "Condizionale (Protasi)", feedback: { map: "È l'ipotesi." }
        }
    ],
    allenati: [{ id: 3112, type: "multiple-choice", text: "Il periodo ipotetico della realtà:", options: ["Se studi, passi", "Se studiassi, passeresti"], answer: "Se studi, passi" }],
    verifica: [{ id: 3122, type: "multiple-choice", text: "La conseguenza si chiama:", options: ["Apodosi", "Protasi"], answer: "Apodosi" }],
    recupera: { title: "Recupero", content: "Se... allora.", exercises: [{ id: 3132, text: "L'ipotesi è la ___", answer: "protasi" }] }
};

p.udaPeriodo12 = {
    scopri: [
        {
            id: 3211, title: "MODALI, STRUMENTALI E COMPARATIVE", theory: "Modale: come (Come se nulla fosse). Strumentale: con che mezzo (Studiando s'impara). Comparativa: confronto (Più di quanto credessi).",
            text: "In 'Studiando s'impara', 'Studiando' è:", options: ["Strumentale", "Modale"], answer: "Strumentale", feedback: { map: "Mezzo per imparare." }
        }
    ],
    allenati: [{ id: 3212, type: "multiple-choice", text: "In 'Si comporta come se fosse re', è:", options: ["Modale", "Comparativa"], answer: "Modale" }],
    verifica: [{ id: 3222, type: "multiple-choice", text: "In 'È più alto di quanto pensassi', è:", options: ["Comparativa", "Modale"], answer: "Comparativa" }],
    recupera: { title: "Recupero", content: "Ultime subordinate.", exercises: [{ id: 3232, text: "Indica il modo = ___", answer: "modale" }] }
};


// ... more units will be added here ...

// Final output
const outputPath = path.join(__dirname, 'js', 'exercises.js');
const fileContent = `const exercisesData = ${JSON.stringify(exercisesData, null, 4)};\n\nif (typeof module !== 'undefined') module.exports = exercisesData;`;

fs.writeFileSync(outputPath, fileContent);
console.log('File exercises.js generated successfully at ' + outputPath);

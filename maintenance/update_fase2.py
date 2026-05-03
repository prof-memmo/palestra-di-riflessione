import json

with open('js/exercises.js', 'r', encoding='utf-8') as f:
    text = f.read()

prefix = 'window.exercisesData = '
json_str = text[len(prefix):].strip()
if json_str.endswith(';'):
    json_str = json_str[:-1]

data = json.loads(json_str)

# --- REGOLATIVO B1 ---
testo_regolativo = """<span style='color: #2c3e50; font-weight: bold;'>Manuale di Sopravvivenza e Orientamento in Alta Montagna</span> 🏔️

Le escursioni in alta montagna offrono paesaggi mozzafiato e un profondo contatto con la natura, ma nascondono anche insidie imprevedibili. Le condizioni meteorologiche possono cambiare drasticamente in pochi minuti e l'orientamento può diventare difficoltoso. Questo manuale fornisce direttive dettagliate e rigorose per affrontare in sicurezza le esplorazioni oltre i 2000 metri di altitudine.

<span style='color: #2980b9; font-weight: bold;'>1. Preparazione dello Zaino e Equipaggiamento Base</span> 🎒
Lo zaino non deve mai superare il 15% del vostro peso corporeo per non compromettere l'equilibrio. Sul fondo dello zaino vanno posizionati gli oggetti leggeri e voluminosi (sacco a pelo o indumenti di ricambio). Gli oggetti più pesanti, come le scorte d'acqua, vanno collocati al centro, il più vicino possibile alla schiena, per mantenere il baricentro stabile.
È **tassativo** avere con sé:
- Una giacca a vento impermeabile (guscio in Gore-Tex o materiale equivalente).
- Un kit di primo soccorso contenente bende, disinfettante, cerotti per vesciche e una coperta termica di emergenza 🚑.
- Una scorta idrica di almeno 2 litri e cibo ad alto contenuto calorico (frutta secca, cioccolato fondente, barrette energetiche).
- Una torcia frontale con batterie di riserva, indispensabile in caso di ritardi imprevisti.

<span style='color: #e74c3c; font-weight: bold;'>2. Orientamento Classico: Mappa Topografica e Bussola</span> 🧭
Sebbene i dispositivi GPS e gli smartphone siano utili, in alta montagna le batterie si scaricano rapidamente a causa del freddo e il segnale satellitare può essere assente. Saper leggere una mappa topografica cartacea è un requisito fondamentale.
- Sulla mappa, le linee di livello (o isoipse) indicano l'altitudine. Se le linee sono molto ravvicinate, significa che il pendio è ripido; se sono distanziate, il terreno è pianeggiante o dolcemente inclinato.
- Per orientare la mappa, estraete la bussola e ruotatela finché l'ago magnetico (la parte rossa) non si allinea con la lettera "N" (Nord). Fatto ciò, posizionate la mappa in modo che il Nord disegnato su di essa corrisponda al Nord indicato dalla bussola.

<span style='color: #8e44ad; font-weight: bold;'>3. Gestione delle Emergenze: Temporali Improvvisi</span> ⛈️
Se avvistate nuvole nere a sviluppo verticale (cumulonembi) o sentite un abbassamento improvviso della temperatura associato a raffiche di vento, un temporale è imminente. La montagna è un luogo estremamente esposto ai fulmini.
In caso di tempesta:
- Abbandonate immediatamente le creste, le vette e i pendii aperti. Scendete di quota il più velocemente possibile verso una valle protetta.
- Evitate assolutamente di ripararvi sotto alberi isolati, pali o strutture metalliche (come croci di vetta o tralicci).
- Liberatevi momentaneamente dell'equipaggiamento metallico (piccozze, bastoncini telescopici, moschettoni), posizionandolo ad almeno venti metri di distanza da voi.
- Assumete la "posizione di sicurezza": accovacciatevi su uno zaino asciutto o su una pietra isolata, tenendo i piedi uniti e abbracciando le ginocchia. Non sdraiatevi mai a terra, poiché l'umidità del suolo è un ottimo conduttore elettrico ⚡.

<span style='color: #27ae60; font-weight: bold;'>4. Affrontare la Nebbia Fitta (Whiteout)</span> 🌫️
Se venite avvolti da una nebbia fitta che azzera la visibilità (fenomeno noto come "whiteout"), la prima regola è **fermarsi**. Continuare a camminare senza punti di riferimento visivi vi farà procedere in cerchio o, peggio, vi porterà verso burroni invisibili.
Se non disponete di un GPS funzionante, indossate abiti caldi, riparatevi dietro un grande masso o in un avvallamento e attendete che le condizioni atmosferiche migliorino. Usate un fischietto di emergenza per segnalare la vostra posizione: il segnale internazionale di soccorso alpino prevede sei fischi in un minuto (uno ogni dieci secondi), seguiti da un minuto di pausa.

Seguendo scrupolosamente queste direttive, le vostre escursioni in alta montagna saranno sicure e memorabili. La prudenza e la prevenzione sono le migliori compagne di viaggio di ogni esploratore."""

data['lettura']['generi']['regolativo']['difficile'] = [{
    "id": 9005,
    "title": "Manuale di Sopravvivenza in Alta Montagna",
    "text": testo_regolativo,
    "questions": [
        {
            "question": "Dove vanno posizionati gli oggetti più pesanti all'interno dello zaino?",
            "options": ["Sul fondo dello zaino", "In alto, per renderli facilmente accessibili", "Al centro, il più vicino possibile alla schiena"],
            "answer": "Al centro, il più vicino possibile alla schiena"
        },
        {
            "question": "Cosa indicano le linee di livello (isoipse) su una mappa topografica cartacea?",
            "options": ["L'altitudine e la pendenza del terreno", "I corsi d'acqua e i laghi sotterranei", "I sentieri più brevi e le strade asfaltate"],
            "answer": "L'altitudine e la pendenza del terreno"
        },
        {
            "question": "Cosa non bisogna assolutamente fare durante un temporale improvviso in montagna?",
            "options": ["Scendere di quota verso una valle protetta", "Ripararsi sotto un grande albero isolato", "Assumere la posizione di sicurezza"],
            "answer": "Ripararsi sotto un grande albero isolato"
        },
        {
            "question": "Perché non bisogna mai sdraiarsi a terra durante un temporale?",
            "options": ["Perché si rischia di perdere l'equipaggiamento", "Perché l'umidità del suolo è un ottimo conduttore elettrico", "Perché gli insetti potrebbero attaccare"],
            "answer": "Perché l'umidità del suolo è un ottimo conduttore elettrico"
        },
        {
            "question": "Qual è il segnale internazionale di soccorso alpino da emettere con il fischietto?",
            "options": ["Tre fischi brevi e tre fischi lunghi", "Un fischio continuo fino all'esaurimento del fiato", "Sei fischi in un minuto, seguiti da un minuto di pausa"],
            "answer": "Sei fischi in un minuto, seguiti da un minuto di pausa"
        }
    ]
}]

# --- ESPOSITIVO B1 ---
testo_espositivo = """<span style='color: #2980b9; font-weight: bold;'>L'Intelligenza Artificiale e il Futuro del Lavoro</span> 🤖

L'Intelligenza Artificiale (spesso abbreviata con la sigla IA o, in inglese, AI) è senza dubbio una delle tecnologie più rivoluzionarie e discusse del ventunesimo secolo. Essa rappresenta la capacità di un sistema informatico di emulare alcune funzioni cognitive umane, come l'apprendimento, la risoluzione di problemi complessi, il riconoscimento del linguaggio naturale e persino la creatività. 

Per comprendere a fondo questo fenomeno, è essenziale distinguere tra due grandi categorie: l'<span style='color: #e74c3c; font-weight: bold;'>Intelligenza Artificiale Ristretta (Narrow AI)</span> e l'<span style='color: #8e44ad; font-weight: bold;'>Intelligenza Artificiale Generale (General AI)</span>.
Attualmente, tutte le tecnologie che utilizziamo rientrano nella "Narrow AI". Questi sistemi sono progettati per eccellere in un compito molto specifico e limitato. Ne sono un esempio gli algoritmi che suggeriscono quali film guardare sulle piattaforme di streaming, gli assistenti vocali dei nostri smartphone o i programmi capaci di battere i campioni mondiali di scacchi ♟️. L'Intelligenza Artificiale Generale, invece, è ancora un concetto puramente teorico, tipico dei film di fantascienza: si tratterebbe di una macchina dotata di una coscienza e di una flessibilità cognitiva pari (o superiore) a quella del cervello umano, capace di imparare a svolgere qualsiasi compito intellettuale senza essere stata specificamente programmata per farlo.

Il nucleo pulsante dell'IA moderna è il <span style='color: #27ae60; font-weight: bold;'>Machine Learning</span> (apprendimento automatico) 🧠. A differenza dei software tradizionali, in cui un programmatore scrive manualmente ogni singola istruzione, un sistema di Machine Learning viene "addestrato" fornendogli enormi quantità di dati. Analizzando milioni di esempi, l'algoritmo individua schemi ricorrenti (chiamati *pattern*) e impara autonomamente a fare previsioni o prendere decisioni con un margine di errore sempre più ridotto.

L'impatto dell'IA sul mondo del lavoro è il tema centrale di un acceso dibattito globale 💼. Da una parte ci sono i timori, legittimi, legati all'automazione. Si prevede che nei prossimi decenni molte professioni ripetitive e basate su procedure standardizzate potrebbero essere sostituite dalle macchine. Lavori nel settore manifatturiero, nella contabilità di base, nei call center e persino nei trasporti (con l'avvento dei veicoli a guida autonoma 🚗) subiranno una forte contrazione.

Dall'altra parte, gli ottimisti sottolineano che l'innovazione tecnologica ha storicamente sempre creato più posti di lavoro di quanti ne abbia distrutti. L'IA darà vita a nuove professioni che oggi facciamo persino fatica a immaginare. Si svilupperà un'enorme domanda per ingegneri dei dati, analisti predittivi, specialisti in etica dell'Intelligenza Artificiale e manutentori di reti neurali. Inoltre, l'automazione delle mansioni noiose e ripetitive permetterà agli esseri umani di concentrarsi sui lavori in cui la macchina non può competere: quelli che richiedono <span style='color: #f39c12; font-weight: bold;'>empatia, creatività, pensiero critico e intelligenza emotiva</span> 💡.

Un altro aspetto fondamentale riguarda le sfide etiche e sociali. I sistemi di IA, imparando dai dati forniti dagli esseri umani, possono ereditare i nostri pregiudizi sociali (fenomeno noto come *bias cognitivo*). Ad esempio, un software per la selezione del personale addestrato su dati storici potrebbe penalizzare ingiustamente candidati di determinate minoranze etniche o di genere. È quindi indispensabile che lo sviluppo tecnologico sia affiancato da normative rigorose, trasparenza degli algoritmi e supervisione umana costante ⚖️.

In conclusione, l'Intelligenza Artificiale non deve essere vista come una forza aliena e inarrestabile, ma come uno strumento potentissimo plasmato dalle nostre scelte. Prepararsi al futuro significa non solo investire in nuove competenze tecnologiche, ma anche rafforzare le qualità squisitamente umane, costruendo un mondo in cui le macchine siano al servizio del benessere collettivo e non della sostituzione dell'individuo."""

data['lettura']['generi']['espositivo']['difficile'] = [{
    "id": 9006,
    "title": "L'Intelligenza Artificiale e il Futuro del Lavoro",
    "text": testo_espositivo,
    "questions": [
        {
            "question": "Qual è la differenza tra Narrow AI (IA Ristretta) e General AI (IA Generale)?",
            "options": ["La Narrow AI fa parte della fantascienza, la General AI è quella dei nostri smartphone.", "La Narrow AI eccelle in compiti specifici, la General AI avrebbe un'intelligenza flessibile e autonoma pari a quella umana.", "Non c'è differenza, sono solo due nomi diversi per indicare la stessa tecnologia."],
            "answer": "La Narrow AI eccelle in compiti specifici, la General AI avrebbe un'intelligenza flessibile e autonoma pari a quella umana."
        },
        {
            "question": "Come funziona un sistema di Machine Learning (apprendimento automatico)?",
            "options": ["Un programmatore inserisce manualmente tutte le istruzioni riga per riga.", "Il sistema viene addestrato analizzando enormi quantità di dati per individuare schemi ricorrenti (pattern).", "Il sistema si collega ad altre macchine rubando le loro informazioni."],
            "answer": "Il sistema viene addestrato analizzando enormi quantità di dati per individuare schemi ricorrenti (pattern)."
        },
        {
            "question": "Secondo il testo, quali tipi di lavori sono maggiormente a rischio a causa dell'automazione?",
            "options": ["I lavori che richiedono forte empatia e creatività", "I lavori politici e artistici", "Le professioni ripetitive e basate su procedure standardizzate"],
            "answer": "Le professioni ripetitive e basate su procedure standardizzate"
        },
        {
            "question": "Cosa si intende per 'bias cognitivo' nei sistemi di IA?",
            "options": ["Un virus informatico che distrugge la memoria della macchina.", "Il rischio che la macchina erediti i pregiudizi sociali presenti nei dati forniti dagli esseri umani.", "La capacità della macchina di spegnersi automaticamente in caso di errore."],
            "answer": "Il rischio che la macchina erediti i pregiudizi sociali presenti nei dati forniti dagli esseri umani."
        },
        {
            "question": "Quali qualità umane dovranno essere rafforzate in futuro per non essere sostituiti dalle macchine?",
            "options": ["La capacità di fare calcoli matematici velocemente", "Empatia, creatività, pensiero critico e intelligenza emotiva", "La forza fisica e la resistenza alla fatica"],
            "answer": "Empatia, creatività, pensiero critico e intelligenza emotiva"
        }
    ]
}]

# --- DESCRIZIONE B1 ---
testo_descrizione = """<span style='color: #e67e22; font-weight: bold;'>Il Mercato delle Spezie di Marrakech</span> 🐪

Addentrarsi nel cuore della Medina di Marrakech, dirigendosi verso lo storico Mercato delle Spezie (conosciuto localmente come Rahba Kedima), significa intraprendere un viaggio sensoriale stordente, dove il tempo sembra essersi cristallizzato in un’epoca antica. L’ingresso al mercato è quasi nascosto, inghiottito dal caos dei vicoli stretti e tortuosi della città vecchia 🇲🇦.

Visivamente, la piazza è un'esplosione cromatica che satura lo sguardo 🎨. La luce abbagliante del sole nordafricano filtra a fatica attraverso i tetti di canne intrecciate, proiettando intricate geometrie di luci e ombre sul lastricato di pietra consunta. Sotto queste tettoie di fortuna si accalcano decine di banchi in legno grezzo. Ognuno di essi è dominato da piramidi perfette di spezie, modellate con una cura quasi maniacale dai mercanti. Si erge il <span style='color: #e74c3c; font-weight: bold;'>rosso acceso</span> della paprika dolce, affiancato al bordeaux vellutato del sommacco. Accanto, spicca il <span style='color: #f1c40f; font-weight: bold;'>giallo abbagliante</span> della curcuma e dello zafferano pregiato, mentre le tonalità calde della cannella e del cumino si confondono con il <span style='color: #27ae60; font-weight: bold;'>verde scuro</span> delle foglie di menta essiccata e del cardamomo. 

Ma è l'olfatto il senso maggiormente sollecitato in questo luogo 👃. L'aria è densa, quasi palpabile, carica di effluvi contrastanti che stordiscono i polmoni. C'è il profumo pungente e terroso del cumino, l'aroma dolce e avvolgente della noce moscata e dei chiodi di garofano, interrotto periodicamente dalla scia balsamica dell'eucalipto e dalla delicatezza floreale dell'acqua di rose. È un profumo che penetra nei vestiti, che impregna i capelli e che ti accompagna per ore anche dopo aver lasciato la piazza.

Il tappeto sonoro del mercato è altrettanto caotico e affascinante 🎶. È un frastuono costante in cui si mescolano lingue e dialetti diversi. Il richiamo cantilenante dei venditori, che invitano i passanti a "guardare, solo guardare, senza impegno", si intreccia al suono ritmico dei mortai di bronzo in cui vengono pestate le bacche di pepe e le radici dure. Si sente il brusio incessante delle contrattazioni infinite, vere e proprie opere teatrali in cui il mercante e l'acquirente recitano le loro parti alzando e abbassando i toni della voce, gesticolando animatamente fino a raggiungere l'accordo finale con un sorriso e una stretta di mano 🤝. In lontananza, si distingue il richiamo alla preghiera del Muezzin, che scende dai minareti per avvolgere la piazza, imponendo un istante di pace in mezzo al fervore commerciale.

Toccando la merce, si percepiscono infinite consistenze: la polvere finissima dello zenzero che scivola via tra le dita come sabbia impalpabile, la ruvidità legnosa dei bastoncini di cannella, l'untuosità dei saponi neri all'olio d'oliva e la freschezza dei blocchi di allume di rocca.

E se ci si ferma presso uno dei minuscoli tavolini in ottone sbalzato che circondano la piazza, si può coinvolgere anche il senso del gusto ☕. Un mercante dall'aria saggia versa, con gesti lenti e precisi, il tradizionale tè alla menta maghrebino. La teiera d'argento viene sollevata in alto per creare una spessa schiuma in cima al bicchiere di vetro decorato. Il liquido dorato è ustionante al tatto, ma il primo sorso rivela un contrasto perfetto: un sapore fortissimo e pungente di tè verde, addolcito all'inverosimile da grossi zollette di zucchero di canna, con l'aroma pungente delle foglie di menta fresca appena stropicciate 🌿.

Il Mercato delle Spezie di Marrakech non è un semplice luogo dove fare acquisti; è un organismo vivo, pulsante ed eterno. È un affresco vivido della cultura marocchina, capace di sovraccaricare la mente e inebriare l'anima di chiunque decida di perdersi tra i suoi colori e i suoi profumi indimenticabili."""

data['lettura']['generi']['descrizione_gen']['difficile'] = [{
    "id": 9007,
    "title": "Il Mercato delle Spezie di Marrakech",
    "text": testo_descrizione,
    "questions": [
        {
            "question": "Come vengono esposte le spezie sui banchi del mercato?",
            "options": ["Dentro sacchi di juta chiusi ermeticamente", "Modellate a forma di piramidi perfette", "In grandi barattoli di vetro trasparente"],
            "answer": "Modellate a forma di piramidi perfette"
        },
        {
            "question": "Quale elemento naturale crea 'intricate geometrie di luci e ombre' sulla piazza?",
            "options": ["I fari colorati installati dal comune", "Il sole che filtra attraverso i tetti di canne intrecciate", "I fuochi accesi dai mercanti per riscaldarsi"],
            "answer": "Il sole che filtra attraverso i tetti di canne intrecciate"
        },
        {
            "question": "Come vengono descritte le contrattazioni sui prezzi nel mercato?",
            "options": ["Rapide e silenziose, senza possibilità di discutere", "Lente e noiose, condotte tramite bigliettini scritti", "Vere e proprie opere teatrali con gesti animati e toni di voce variabili"],
            "answer": "Vere e proprie opere teatrali con gesti animati e toni di voce variabili"
        },
        {
            "question": "Che sapore ha il tradizionale tè maghrebino servito al mercato?",
            "options": ["Un sapore amaro, freddo e leggermente salato", "Un contrasto perfetto tra il tè verde forte, molto zucchero e menta fresca", "Un sapore delicato e completamente privo di zuccheri"],
            "answer": "Un contrasto perfetto tra il tè verde forte, molto zucchero e menta fresca"
        },
        {
            "question": "A quale senso viene dedicata una particolare attenzione nel testo descrittivo?",
            "options": ["Esclusivamente alla vista, per i colori", "L'olfatto, per la grande varietà e intensità dei profumi descritti", "Esclusivamente al tatto, per la consistenza delle rocce"],
            "answer": "L'olfatto, per la grande varietà e intensità dei profumi descritti"
        }
    ]
}]

# --- POESIA B1 ---
testo_poesia = """<span style='color: #8e44ad; font-weight: bold;'>Ode al Vento d'Autunno</span> 🍂
<br>
Soffia invisibile, signore del freddo,<br>
scuotendo i rami del bosco dormiente.<br>
Un manto d’oro si posa silente,<br>
mentre l’estate cede il suo eredo.<br>
Le foglie danzano in vortici gialli,<br>
seguendo il ritmo dei tuoi aspri balli.<br>
<br>
Scompigli i capelli del viandante stanco,<br>
porti profumi di terra bagnata.<br>
Sopra la collina, di nebbia velata,<br>
dipingi di grigio l'orizzonte bianco.<br>
Sei il respiro cupo della stagione,<br>
che spoglia la quercia senza ragione.<br>
<br>
Nei camini si accende il fuoco vivace,<br>
quando tu ululi dietro il cancello.<br>
Strappi dal ramo l'ultimo orpello,<br>
cercando, inquieto, una fredda pace.<br>
E mentre la natura chiude il suo occhio,<br>
tu pieghi l’orgoglio del vecchio ginocchio.<br>
<br>
Passa, o vento, prepara l'inverno,<br>
porta la neve sul picco lontano.<br>
Non c'è paura nel cuore sovrano,<br>
che osserva placido il muto eterno.<br>
Sappiamo che al termine del tuo rigore,<br>
la terra risveglierà il suo colore.<br>
<br>
<hr>
<br>
<span style='color: #2980b9; font-weight: bold;'>Commento Critico e Analisi del Testo</span> 📖<br>
Questa poesia, strutturata in quattro strofe composte da sei versi (sestine), rappresenta una profonda riflessione allegorica sul passare del tempo e sul ciclo immutabile della natura 🍁. L'autore sceglie il *vento autunnale* come vero protagonista e soggetto attivo della composizione. Il vento viene personificato sin dai primi versi: è chiamato "signore del freddo" e "respiro cupo", entità invisibile ma capace di modellare il paesaggio a suo piacimento.

Il testo si avvale di immagini fortemente evocative (i "vortici gialli" delle foglie, la "nebbia velata", il "fuoco vivace" nei camini) per attivare tutti i sensi del lettore. È presente una forte dicotomia tra l'inquietudine violenta dell'elemento naturale all'esterno (il vento che "ulula dietro il cancello" e "spoglia la quercia") e la ricerca di intimità e rassicurazione all'interno ("nei camini si accende il fuoco"). 

L'autunno non viene visto solo come portatore di morte e spoliazione, ma come una fase necessaria e ineluttabile di preparazione. L'ultima strofa introduce una nota di speranza e accettazione filosofica: l'essere umano, definito come "cuore sovrano", osserva lo scorrere delle stagioni senza timore, consapevole che il gelido rigore dell'inverno è solo il passaggio obbligato prima che la terra "risveglierà il suo colore" con la primavera 🌸."""

data['lettura']['generi']['poesia']['difficile'] = [{
    "id": 9008,
    "title": "Ode al Vento d'Autunno e Commento Critico",
    "text": testo_poesia,
    "questions": [
        {
            "question": "Come viene definito il vento nella prima strofa della poesia?",
            "options": ["Un amico invisibile", "Il signore del freddo", "Un pittore autunnale"],
            "answer": "Il signore del freddo"
        },
        {
            "question": "Quale immagine sensoriale utilizza il poeta per descrivere le foglie autunnali?",
            "options": ["Foglie che danzano in vortici gialli", "Foglie che diventano rigide come il ghiaccio", "Foglie che coprono i fiumi in silenzio"],
            "answer": "Foglie che danzano in vortici gialli"
        },
        {
            "question": "Secondo il commento critico, cosa simboleggia l'autunno in questo componimento?",
            "options": ["La fine assoluta e definitiva di ogni forma di vita", "Una fase necessaria di preparazione prima della rinascita primaverile", "Un periodo di grande gioia e calore interiore"],
            "answer": "Una fase necessaria di preparazione prima della rinascita primaverile"
        },
        {
            "question": "Che tipo di reazione ha il 'cuore sovrano' (l'essere umano) di fronte al vento autunnale nell'ultima strofa?",
            "options": ["Tenta di fermare il vento con la forza", "Prova terrore e cerca rifugio", "Lo osserva con speranza e accettazione filosofica"],
            "answer": "Lo osserva con speranza e accettazione filosofica"
        },
        {
            "question": "Quale contrasto viene evidenziato dal commento critico?",
            "options": ["Tra i colori caldi dell'estate e quelli freddi dell'autunno", "Tra l'inquietudine violenta dell'esterno e l'intimità rassicurante dell'interno (il camino)", "Tra il silenzio degli animali e il rumore degli esseri umani"],
            "answer": "Tra l'inquietudine violenta dell'esterno e l'intimità rassicurante dell'interno (il camino)"
        }
    ]
}]

new_json_str = json.dumps(data, indent=4, ensure_ascii=False)
final_text = prefix + new_json_str + ';\n'

with open('js/exercises.js', 'w', encoding='utf-8') as f:
    f.write(final_text)

print("Updated Fase 2: Regolativo, Espositivo, Descrizione, Poesia B1 texts added.")

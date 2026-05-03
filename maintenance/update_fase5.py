import json

with open('js/exercises.js', 'r', encoding='utf-8') as f:
    text = f.read()

prefix = 'window.exercisesData = '
json_str = text[len(prefix):].strip()
if json_str.endswith(';'):
    json_str = json_str[:-1]

data = json.loads(json_str)

# --- FORMAZIONE B1 ---
testo_formazione = """<span style='color: #27ae60; font-weight: bold;'>Il Primo Giorno di Lavoro di Leonardo</span> 🍳

La sveglia suonò alle cinque in punto. Fuori era ancora buio pesto e la città di Milano dormiva avvolta nella sua consueta coperta di nebbia. Leonardo, diciannove anni appena compiuti, balzò giù dal letto con lo stomaco chiuso in una morsa d'ansia. Quella mattina non doveva andare a scuola. Quella mattina iniziava il suo primo vero lavoro: aiuto cuoco al *Bistrot d'Or*, uno dei ristoranti più rinomati del centro 🍽️.

Per Leonardo, cucinare non era mai stato solo un passatempo. Era cresciuto osservando sua nonna impastare le tagliatelle la domenica mattina, imparando che il cibo era il modo migliore per dire "ti voglio bene" senza usare le parole. Ma cucinare per la propria famiglia era una cosa; entrare in una brigata professionale era tutt'altro.

Arrivato al ristorante, entrò dal retrobottega. L'aria era già satura dell'odore acre delle cipolle soffritte e del brodo in ebollizione. La cucina sembrava una trincea militare: acciaio inossidabile ovunque, fuochi ruggenti e un rumore assordante di pentole sbatacchiate. A capo di quel caos organizzato c'era lo <span style='color: #c0392b; font-weight: bold;'>Chef Vivaldi</span>, un uomo imponente con una voce che faceva tremare i vetri.

"Tu sei il nuovo ragazzo?" abbaiò lo Chef, senza nemmeno guardarlo negli occhi, mentre sfilettava un salmone con la precisione di un chirurgo. "Mettiti il grembiule. Hai cinquanta chili di patate da pelare e tagliare a cubetti perfettamente identici. Muoviti!" 🥔

Leonardo annuì nervosamente, afferrò un pelapatate e iniziò. La prima ora fu un disastro. Le sue mani tremavano, il coltello gli scivolava e i cubetti di patata sembravano tutto tranne che identici. Lo Chef Vivaldi passò dietro di lui, prese una manciata di patate tagliate male e le gettò nel cestino dell'umido con disprezzo.
"In questa cucina non si serve spazzatura. Se non sai fare un cubo, come pretendi di cucinare un piatto intero? Ricomincia."

Le lacrime pungevano gli occhi di Leonardo. La stanchezza e la frustrazione lo stavano sopraffacendo. Pensò di togliersi il grembiule e scappare via. *Forse non sono fatto per questo lavoro,* si disse. *Forse ho sognato troppo in grande.*

Ma poi ricordò i sacrifici dei suoi genitori per pagargli la scuola alberghiera e le ore passate in cucina con sua nonna. Non poteva arrendersi al primo ostacolo. Fece un respiro profondo, pulì il tagliere, affilò il coltello e ricominciò. Questa volta, si concentrò solo sul movimento della lama. Dimenticò il rumore, dimenticò lo Chef, dimenticò la paura. Tagliò la prima patata: perfetta. Poi la seconda. Poi la terza 🔪.

A metà servizio, il ristorante si riempì. Le comande iniziarono a uscire dalla stampante come un fiume in piena. La brigata lavorava a ritmi forsennati. Improvvisamente, uno dei cuochi addetti agli antipasti si tagliò un dito e fu costretto a fermarsi. La linea andò in tilt.
Lo Chef Vivaldi, pallido dalla tensione, si voltò verso Leonardo. "Ragazzo! Hai finito le patate?"
"Sì, Chef."
"Bene. Prendi la sua postazione. Impiatta le capesante scottate. E non osare rovinarle!"

Leonardo non ebbe il tempo di farsi prendere dal panico. Prese le pinze, scottò le capesante nel burro sfrigolante, dispose la crema di zucca sul piatto e appoggiò i molluschi con delicatezza, guarnendo con polvere di caffè, esattamente come aveva visto fare la settimana prima durante la sua prova.
Il piatto arrivò al pass. Lo Chef lo esaminò con occhio critico, in cerca di un difetto. Non ne trovò. "Servizio," grugnì, passando il piatto al cameriere 🛎️.

Alla fine della serata, Leonardo era distrutto. Le mani gli dolevano, la divisa era sporca e i piedi sembravano di piombo. Mentre si cambiava nello spogliatoio, lo Chef Vivaldi si affacciò alla porta.
"I tuoi cubetti di patata fanno ancora schifo," disse lo Chef. Poi, per la prima volta in dodici ore, fece un mezzo sorriso. "Ma sulle capesante te la sei cavata bene. Ci vediamo domani alle cinque in punto. Non fare tardi."

Leonardo uscì nella notte milanese. Era esausto, ma per la prima volta nella sua vita si sentì un adulto. Aveva affrontato la paura, aveva resistito alla tentazione di mollare e aveva dimostrato a se stesso di cosa era capace. Il suo viaggio era appena iniziato 🌟."""

data['lettura']['generi']['formazione']['difficile'] = [{
    "id": 9016,
    "title": "Il Primo Giorno di Lavoro di Leonardo",
    "text": testo_formazione,
    "questions": [
        {
            "question": "Qual è l'atteggiamento iniziale dello Chef Vivaldi verso Leonardo?",
            "options": ["Severo, burbero e molto esigente", "Molto accogliente, gentile e paterno", "Totalmente indifferente e disinteressato"],
            "answer": "Severo, burbero e molto esigente"
        },
        {
            "question": "Cosa fa lo Chef quando vede i primi cubetti di patata tagliati da Leonardo?",
            "options": ["Lo aiuta a tagliare le patate correttamente", "Lo licenzia immediatamente urlandogli contro", "Li getta nel cestino dell'umido con disprezzo chiedendogli di ricominciare"],
            "answer": "Li getta nel cestino dell'umido con disprezzo chiedendogli di ricominciare"
        },
        {
            "question": "Cosa spinge Leonardo a non arrendersi quando pensa di fuggire via?",
            "options": ["La minaccia dello Chef Vivaldi di non pagarlo", "Il ricordo dei sacrifici dei suoi genitori e le ore passate in cucina con la nonna", "Il desiderio di diventare subito famoso e ricco"],
            "answer": "Il ricordo dei sacrifici dei suoi genitori e le ore passate in cucina con la nonna"
        },
        {
            "question": "In quale occasione improvvisa Leonardo deve dimostrare il suo valore?",
            "options": ["Quando deve preparare una torta di mele per un cliente speciale", "Quando deve sostituire un cuoco che si taglia un dito impiattando le capesante", "Quando il ristorante prende fuoco a causa di una padella"],
            "answer": "Quando deve sostituire un cuoco che si taglia un dito impiattando le capesante"
        },
        {
            "question": "Quale sensazione prova Leonardo alla fine della sua prima faticosa giornata?",
            "options": ["Un profondo disgusto per il mondo della cucina", "Disperazione totale perché è stato licenziato", "Grande stanchezza ma anche la consapevolezza di essere diventato un adulto capace di resistere alle difficoltà"],
            "answer": "Grande stanchezza ma anche la consapevolezza di essere diventato un adulto capace di resistere alle difficoltà"
        }
    ]
}]

# --- PSICOLOGICO B1 ---
testo_psicologico = """<span style='color: #8e44ad; font-weight: bold;'>Il Labirinto degli Specchi</span> 🪞

Il corridoio del Conservatorio era lungo, freddo e illuminato da luci al neon che sfarfallavano leggermente, emettendo un ronzio fastidioso. Seduta su una sedia di plastica rigida, <span style='color: #2980b9; font-weight: bold;'>Marta</span> stringeva la custodia del suo violino così forte che le nocche le erano diventate bianche. Mancavano esattamente quindici minuti alla sua audizione per l'Orchestra Sinfonica Nazionale, il momento per il quale si era preparata per dieci anni 🎻.

Eppure, invece della concentrazione, la sua mente era intrappolata in un labirinto oscuro. Era un fenomeno che gli psicologi chiamano <span style='color: #e74c3c; font-weight: bold;'>Sindrome dell'Impostore</span>. Nonostante i voti eccellenti, le lodi dei maestri e le innumerevoli ore di studio, una voce perfida le sussurrava costantemente all'orecchio: *"Non sei abbastanza brava. È stato solo un caso fino ad ora. Oggi se ne accorgeranno tutti. Scopriranno che sei una truffatrice."* 🧠

Marta chiuse gli occhi. Nella sua mente, il corridoio si trasformò in un luna park abbandonato, un labirinto di specchi deformanti. Ogni volta che si guardava in uno di essi, vedeva una versione distorta di sé stessa. In uno specchio vedeva una bambina spaventata che non sapeva tenere in mano l'archetto; in un altro, vedeva i volti dei giurati che ridevano di lei, sottolineando ogni minima sbavatura nel suo modo di suonare.

Il respiro si fece corto. Il cuore batteva all'impazzata contro le costole, come un uccello intrappolato in una gabbia. Stava per avere un attacco di panico 😰. L'impulso di alzarsi, prendere il violino e fuggire via dalla porta principale era travolgente. Nessuno l'avrebbe giudicata se fosse scappata. Avrebbe potuto dire che stava male. Avrebbe evitato il fallimento.

*Ma avrei evitato anche la possibilità di farcela,* pensò all'improvviso, aggrappandosi a un frammento di razionalità.

Iniziò a praticare una tecnica di radicamento che il suo terapeuta le aveva insegnato. Trovò cinque oggetti che poteva vedere: la sedia, la custodia nera, la scarpa del ragazzo seduto di fronte a lei, un granello di polvere, l'interruttore della luce. Poi trovò quattro cose che poteva toccare: la cerniera fredda della custodia, il tessuto ruvido dei suoi pantaloni, il legno della sedia, il calore del suo stesso palmo. Tre cose che poteva sentire: il ronzio del neon, il respiro del ragazzo di fronte, il rumore del traffico lontano 🧘‍♀️.

Il labirinto di specchi nella sua mente iniziò a sgretolarsi. La voce perfida dell'impostore era ancora lì, ma ora era solo un sussurro in sottofondo, non più un urlo assordante. Marta si rese conto che i suoi dubbi non erano prove del suo fallimento, ma testimoni della sua passione. Aveva paura perché ci teneva immensamente.

"Il prossimo candidato, Marta Rossi," disse una segretaria aprendo la pesante porta di quercia dell'auditorium.

Marta si alzò. Le gambe le tremavano ancora leggermente, ma la morsa allo stomaco si era allentata. Non aveva sconfitto del tutto la Sindrome dell'Impostore – forse non sarebbe mai scomparsa del tutto – ma aveva deciso che non le avrebbe permesso di rubarle il palco. Prese un respiro profondo, varcò la soglia e aprì la custodia del suo violino. Non c'era più nessun labirinto. C'era solo la musica 🎶."""

data['lettura']['generi']['psicologico']['difficile'] = [{
    "id": 9017,
    "title": "Il Labirinto degli Specchi",
    "text": testo_psicologico,
    "questions": [
        {
            "question": "Cos'è la 'Sindrome dell'Impostore' di cui soffre Marta?",
            "options": ["Una malattia infettiva che provoca allucinazioni visive", "La convinzione di non meritare i propri successi e la paura costante di essere scoperti come 'truffatori'", "Un disturbo fisico che impedisce di muovere correttamente le dita sul violino"],
            "answer": "La convinzione di non meritare i propri successi e la paura costante di essere scoperti come 'truffatori'"
        },
        {
            "question": "Quale immagine mentale utilizza il testo per descrivere i dubbi e le paure di Marta?",
            "options": ["Un deserto senza fine in cui si muore di sete", "Una prigione sotterranea buia e fredda", "Un luna park abbandonato con un labirinto di specchi deformanti"],
            "answer": "Un luna park abbandonato con un labirinto di specchi deformanti"
        },
        {
            "question": "Quale forte impulso prova Marta mentre aspetta fuori dalla porta?",
            "options": ["L'impulso di alzarsi, prendere il violino e fuggire via per evitare il giudizio", "L'impulso di rompere il suo violino dalla rabbia", "L'impulso di entrare prepotentemente e interrompere l'audizione precedente"],
            "answer": "L'impulso di alzarsi, prendere il violino e fuggire via per evitare il giudizio"
        },
        {
            "question": "Come riesce Marta a calmare il suo attacco di panico?",
            "options": ["Prendendo delle medicine forti", "Chiamando sua madre al telefono", "Praticando una tecnica di radicamento sensoriale insegnatale dal terapeuta"],
            "answer": "Praticando una tecnica di radicamento sensoriale insegnatale dal terapeuta"
        },
        {
            "question": "Alla fine, Marta sconfigge completamente e per sempre i suoi dubbi?",
            "options": ["Sì, la sua ansia scompare magicamente", "No, la voce dell'impostore rimane come sussurro, ma lei decide di affrontarla e non arrendersi", "No, l'ansia aumenta e lei si rifiuta di suonare"],
            "answer": "No, la voce dell'impostore rimane come sussurro, ma lei decide di affrontarla e non arrendersi"
        }
    ]
}]

# --- SOCIALE B1 ---
testo_sociale = """<span style='color: #e67e22; font-weight: bold;'>Il Muro del Quartiere San Lorenzo</span> 🏘️

Il rione San Lorenzo era da sempre considerato l'anima ruvida e autentica della città. Le sue strade strette erano un mosaico di storie: operai, studenti universitari, anziani nati e cresciuti tra quei palazzi di mattoni rossi. Al centro della piazza principale c'era l'antico forno di Sor Mario, un'istituzione che da sessant'anni sfornava la pizza bianca più croccante di Roma 🍕. Ma negli ultimi due anni, San Lorenzo stava cambiando volto a una velocità allarmante a causa di un fenomeno silenzioso ma implacabile: la <span style='color: #2980b9; font-weight: bold;'>gentrificazione</span>.

Le vecchie botteghe di artigiani venivano soppiantate da costosi "concept store" o locali notturni di tendenza. Gli affitti erano triplicati nel giro di pochi mesi, costringendo molte famiglie storiche a fare i bagagli e trasferirsi in periferie lontane, sradicate dalla loro comunità 📦. 

Il punto di rottura arrivò in una fredda mattina di novembre. Una grossa azienda immobiliare aveva acquistato l'intero isolato che comprendeva il forno di Sor Mario, con l'intenzione di demolirlo per costruire un lussuoso "Eco-Supermercato Gourmet" con annessa palestra privata 🏗️. A Sor Mario fu intimato lo sfratto entro trenta giorni.

La notizia si diffuse nel quartiere come un incendio. <span style='color: #27ae60; font-weight: bold;'>Chiara</span>, una studentessa di sociologia che viveva nel palazzo di fronte al forno, decise che non potevano restare a guardare mentre la loro identità veniva cancellata dai capitali speculativi. Insieme a un gruppo di residenti, formò il "Comitato Difesa San Lorenzo".

Inizialmente, la protesta si limitò a una raccolta firme e a lenzuoli bianchi appesi ai balconi con la scritta: <span style='color: #e74c3c; font-weight: bold;'>LA NOSTRA STORIA NON SI COMPRA</span> 📢. Ma l'azienda immobiliare ignorò completamente le richieste, forti dei loro permessi legali e dei loro avvocati milionari.

Fu allora che Chiara ebbe un'idea più radicale. "Non possiamo combatterli solo con i fogli di carta," disse durante l'assemblea cittadina, tenutasi proprio dentro il forno. "Dobbiamo fargli capire che demolire questo posto significa distruggere una comunità viva."

Il giorno previsto per l'inizio dei lavori, all'alba, i bulldozer dell'azienda trovarono la strada bloccata. Ma non da barricate violente o cassonetti in fiamme. La piazza era piena di persone. Centinaia di residenti, dai bambini delle scuole elementari agli anziani con il bastone, si erano seduti a terra formando un "muro umano" pacifico attorno all'isolato 🧱.

Al centro della piazza, Sor Mario continuava a sfornare pizza bianca, offrendola gratuitamente a tutti i presenti e persino agli operai dei bulldozer, visibilmente imbarazzati dalla situazione. La scena era così potente e surreale che nel giro di un'ora arrivarono le telecamere dei telegiornali nazionali 🎥.

L'immagine del muro umano pacifico a difesa dell'antico fornaio fece il giro del Paese. La pressione mediatica divenne insostenibile per l'azienda immobiliare, che rischiava un gravissimo danno d'immagine. Tre giorni dopo, l'amministratore delegato dell'azienda annunciò pubblicamente di aver trovato un accordo con l'amministrazione comunale: l'Eco-Supermercato sarebbe stato costruito in una zona industriale dismessa fuori città, e il forno di Sor Mario, insieme ai palazzi storici circostanti, sarebbe stato vincolato come "patrimonio culturale di quartiere" 🏛️.

La vittoria di San Lorenzo non fermò la gentrificazione ovunque, ma dimostrò una verità fondamentale: una comunità unita, consapevole dei propri diritti e disposta a lottare pacificamente per i propri spazi, è un argine formidabile contro l'avidità speculativa. Quella sera, la piazza festeggiò fino all'alba, mangiando pizza e brindando al quartiere."""

data['lettura']['generi']['sociale']['difficile'] = [{
    "id": 9018,
    "title": "Il Muro del Quartiere San Lorenzo",
    "text": testo_sociale,
    "questions": [
        {
            "question": "Cosa si intende per 'gentrificazione' nel contesto della storia?",
            "options": ["L'aumento della criminalità nelle zone periferiche della città", "Il processo in cui i vecchi abitanti vengono spinti via a causa dell'aumento degli affitti per far posto a locali e attività di lusso", "La costruzione di nuovi parchi pubblici e scuole nel quartiere"],
            "answer": "Il processo in cui i vecchi abitanti vengono spinti via a causa dell'aumento degli affitti per far posto a locali e attività di lusso"
        },
        {
            "question": "Quale evento rappresenta il 'punto di rottura' per gli abitanti di San Lorenzo?",
            "options": ["La decisione di demolire il forno storico di Sor Mario per costruire un lussuoso supermercato", "L'aumento del biglietto dell'autobus", "La chiusura dell'università locale"],
            "answer": "La decisione di demolire il forno storico di Sor Mario per costruire un lussuoso supermercato"
        },
        {
            "question": "Come si oppongono gli abitanti del quartiere all'arrivo dei bulldozer?",
            "options": ["Dando fuoco ai cassonetti e costruendo barricate violente", "Pagando gli operai per non lavorare", "Formando un grande e pacifico 'muro umano' sedendosi attorno all'isolato"],
            "answer": "Formando un grande e pacifico 'muro umano' sedendosi attorno all'isolato"
        },
        {
            "question": "Cosa fa Sor Mario durante la pacifica manifestazione in piazza?",
            "options": ["Scappa dal quartiere per la paura", "Continua a sfornare pizza bianca offrendola gratuitamente a tutti i presenti", "Firma l'accordo con l'azienda immobiliare di nascosto"],
            "answer": "Continua a sfornare pizza bianca offrendola gratuitamente a tutti i presenti"
        },
        {
            "question": "Qual è il messaggio finale o la morale del racconto sociale?",
            "options": ["Che le grandi aziende sono sempre cattive e vanno distrutte fisicamente", "Che una comunità unita e pacifica può arginare la speculazione e difendere i propri spazi storici", "Che alla fine la gentrificazione non può essere fermata in nessun modo"],
            "answer": "Che una comunità unita e pacifica può arginare la speculazione e difendere i propri spazi storici"
        }
    ]
}]

new_json_str = json.dumps(data, indent=4, ensure_ascii=False)
final_text = prefix + new_json_str + ';\n'

with open('js/exercises.js', 'w', encoding='utf-8') as f:
    f.write(final_text)

print("Updated Fase 5: Formazione, Psicologico, Sociale B1 texts added.")

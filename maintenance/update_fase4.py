import json

with open('js/exercises.js', 'r', encoding='utf-8') as f:
    text = f.read()

prefix = 'window.exercisesData = '
json_str = text[len(prefix):].strip()
if json_str.endswith(';'):
    json_str = json_str[:-1]

data = json.loads(json_str)

# --- DIARIO B1 ---
testo_diario = """<span style='color: #2980b9; font-weight: bold;'>Diario di un Mese Senza Internet</span> 📓

*15 Maggio*
Caro Diario,
oggi è ufficialmente iniziato il mio personalissimo esperimento: trenta giorni di totale <span style='color: #e74c3c; font-weight: bold;'>Digital Detox</span> 📵. Niente smartphone, niente social network, niente video in streaming. Solo un vecchio telefono a conchiglia degli anni Duemila per le emergenze. La prima giornata è stata un incubo. Mi sono svegliato e, per istinto, ho allungato la mano verso il comodino per controllare le notifiche. Ho afferrato solo l'aria. Durante il tragitto in autobus verso scuola, non sapendo cosa fare, ho fissato fuori dal finestrino per venti minuti. È incredibile quanto le persone sembrino isolate quando indossano le cuffiette e fissano uno schermo luminoso. Mi sono sentito... strano. E anche molto annoiato.

*22 Maggio*
È passata una settimana. I primi giorni ho sofferto di quella che gli esperti chiamano "FOMO" (*Fear Of Missing Out*), la paura terribile di perdermi qualcosa di importante 😰. Ero convinto che i miei amici stessero organizzando feste epiche a mia insaputa. Invece, scoprirlo alla vecchia maniera (parlandoci a ricreazione) mi ha fatto capire che non mi stavo perdendo assolutamente nulla di speciale. Ho ripreso in mano un libro che avevo comprato mesi fa e lasciato a prendere polvere sulla mensola. Si intitola *Fahrenheit 451*. L'ho divorato in tre giorni. Senza le continue distrazioni delle notifiche, la mia soglia di concentrazione è raddoppiata 📖.

*28 Maggio*
Ieri pomeriggio pioveva e non potevo uscire. Di solito, avrei passato ore su TikTok scorrendo video senza senso fino a farmi venire il mal di testa. Ieri, invece, sono andato in cucina. Mia madre stava preparando una torta di mele. Mi sono offerto di aiutarla a sbucciare le mele. Abbiamo parlato per quasi due ore 🍏. Mi ha raccontato storie di quando aveva la mia età, aneddoti che non avevo mai sentito. Mi sono reso conto che, vivendo sotto lo stesso tetto, spesso ci comportiamo come perfetti sconosciuti. È stato il pomeriggio più bello di questo mese.

*5 Giugno*
L'esperimento sta diventando sorprendentemente normale. Non ho più l'impulso compulsivo di fotografare il mio pranzo prima di mangiarlo 📸. Mangio, assaporo e basta. Quando esco con i miei amici, io sono l'unico che non ha il telefono sul tavolo. Li osservo: a volte cala il silenzio e tutti e quattro abbassano contemporaneamente la testa sui loro schermi. Quando succede, inizio a fare domande assurde ad alta voce ("Ma secondo voi, i pinguini hanno le ginocchia?") solo per farli staccare. Funziona. Ridiamo di più. Mi sento più presente, più connesso alla realtà.

*14 Giugno*
Domani scade il trentesimo giorno. L'esperimento è finito. Potrò riaccendere il mio smartphone e rituffarmi nel mare di Internet 🌐. La verità? Ne ho un po' paura. Mi è mancata la comodità di usare le mappe per non perdermi in città, o la velocità di cercare informazioni per i compiti scolastici. Internet è uno strumento straordinario, sarebbe sciocco negarlo. Ma ho capito una cosa fondamentale: <span style='color: #27ae60; font-weight: bold;'>i social network non sono la vita vera</span>. Sono solo una vetrina. 

Da domani riprenderò a usare lo smartphone, ma ho deciso di impormi delle regole rigide. Nessun telefono a tavola, niente schermi un'ora prima di dormire e disattivazione di tutte le notifiche non essenziali. Voglio essere io a usare la tecnologia, non voglio più che sia la tecnologia a usare me 💡."""

data['lettura']['generi']['diario']['difficile'] = [{
    "id": 9013,
    "title": "Diario di un Mese Senza Internet",
    "text": testo_diario,
    "questions": [
        {
            "question": "Cos'è la 'FOMO' di cui parla il protagonista?",
            "options": ["La sindrome da stanchezza visiva causata dagli schermi", "La paura terribile di perdersi qualcosa di importante che accade online", "Un virus informatico che cancella i dati dal telefono"],
            "answer": "La paura terribile di perdersi qualcosa di importante che accade online"
        },
        {
            "question": "Come trascorre il pomeriggio piovoso del 28 Maggio?",
            "options": ["Leggendo un libro di fantascienza per tutto il tempo", "Aiutando la madre a sbucciare le mele e ascoltando le sue storie", "Chiamando gli amici dal vecchio telefono a conchiglia"],
            "answer": "Aiutando la madre a sbucciare le mele e ascoltando le sue storie"
        },
        {
            "question": "Cosa fa il protagonista quando i suoi amici guardano il telefono mentre sono insieme?",
            "options": ["Si arrabbia e se ne va via indignato", "Scrive le sue osservazioni sul diario", "Fa domande assurde ad alta voce per farli staccare dagli schermi"],
            "answer": "Fa domande assurde ad alta voce per farli staccare dagli schermi"
        },
        {
            "question": "Cosa è mancato maggiormente al protagonista di Internet durante il mese?",
            "options": ["I video divertenti su TikTok", "La possibilità di fotografare i suoi pranzi", "La comodità delle mappe e la ricerca di informazioni per la scuola"],
            "answer": "La comodità delle mappe e la ricerca di informazioni per la scuola"
        },
        {
            "question": "Quale regola decide di imporsi alla fine dell'esperimento?",
            "options": ["Usare il telefono solo nel fine settimana", "Nessun telefono a tavola e niente schermi prima di dormire", "Disinstallare per sempre tutti i social network"],
            "answer": "Nessun telefono a tavola e niente schermi prima di dormire"
        }
    ]
}]

# --- LETTERA B1 ---
testo_lettera = """<span style='color: #8e44ad; font-weight: bold;'>Lettera Aperta al Sindaco sulla Sostenibilità Urbana</span> ✉️

Oggetto: Richiesta di un piano d'azione urgente per la mobilità e gli spazi verdi.

Egregio Signor Sindaco,

Le scriviamo a nome del "Comitato Giovani per una Città Sostenibile", un'associazione che raccoglie oltre duemila studenti e giovani lavoratori del nostro comune. Ci rivolgiamo a Lei non con spirito polemico, ma con la forte determinazione di chi desidera partecipare attivamente al miglioramento della propria comunità 🏙️.

Siamo profondamente preoccupati per l'attuale gestione degli spazi urbani e per la scarsa qualità dell'aria che respiriamo quotidianamente. Negli ultimi cinque anni, la nostra città ha visto un aumento sproporzionato del traffico veicolare privato. Le strade del centro sono perennemente congestionate, e il rumore assordante dei clacson è diventato la colonna sonora delle nostre giornate 🚗. Ma il problema più grave è invisibile: i livelli di <span style='color: #e74c3c; font-weight: bold;'>inquinamento da polveri sottili (PM10)</span> hanno superato i limiti di sicurezza stabiliti dall'Organizzazione Mondiale della Sanità per oltre 40 giorni consecutivi durante l'ultimo inverno.

Questo ha un impatto diretto sulla nostra salute, con un aumento preoccupante di malattie respiratorie e allergie, soprattutto tra i bambini e gli anziani. Non possiamo continuare a considerare il diritto alla salute come secondario rispetto alla comodità degli spostamenti in auto.

Inoltre, notiamo con rammarico la continua cementificazione del territorio 🏗️. I pochi parchi storici rimasti sono mal curati, e i nuovi quartieri residenziali vengono progettati senza includere adeguati spazi di aggregazione all'aperto. Una città senza alberi è una città che soffoca.

Per questi motivi, Le proponiamo formalmente le seguenti soluzioni concrete e realizzabili a breve e medio termine:

<span style='color: #27ae60; font-weight: bold;'>1. Potenziamento del Trasporto Pubblico Locale</span> 🚌: Richiediamo l'acquisto di nuovi autobus elettrici e un aumento della frequenza delle corse, specialmente nelle fasce orarie dedicate a pendolari e studenti. Inoltre, proponiamo di rendere i mezzi pubblici gratuiti per gli under 25, per incentivare l'abbandono del mezzo privato.

<span style='color: #f39c12; font-weight: bold;'>2. Implementazione della Rete Ciclabile</span> 🚲: L'attuale rete di piste ciclabili è frammentata e insicura. È necessario creare "corridoi sicuri" che colleghino in modo ininterrotto le periferie al centro città, separando fisicamente le piste dalle carreggiate destinate alle automobili.

<span style='color: #2980b9; font-weight: bold;'>3. Creazione di Nuove Aree Verdi e Pedonalizzazione</span> 🌳: Chiediamo che il centro storico diventi gradualmente un'area totalmente pedonale (ZTL rigorosa). Proponiamo inoltre un piano di forestazione urbana: piantare almeno mille nuovi alberi all'anno nelle zone industriali dimesse per mitigare le isole di calore estive.

Signor Sindaco, sappiamo bene che queste transizioni richiedono tempo e fondi, e che alcune scelte potrebbero risultare impopolari tra i commercianti e gli automobilisti più intransigenti. Tuttavia, una politica lungimirante deve guardare al futuro delle prossime generazioni, non al consenso immediato.

Siamo pronti a fare la nostra parte, offrendo volontariato per la pulizia dei parchi e per campagne di sensibilizzazione nelle scuole. Ci aspettiamo, però, che l'Amministrazione Comunale dia un segnale forte e immediato.

Restiamo in attesa di un Suo riscontro e Le chiediamo un incontro pubblico per discutere approfonditamente queste proposte. 

Cordiali saluti,
*Il Comitato Giovani per una Città Sostenibile*"""

data['lettura']['generi']['lettera']['difficile'] = [{
    "id": 9014,
    "title": "Lettera Aperta sulla Sostenibilità Urbana",
    "text": testo_lettera,
    "questions": [
        {
            "question": "Qual è il motivo principale che spinge il Comitato a scrivere la lettera?",
            "options": ["Chiedere nuovi parcheggi per le automobili in centro", "Denunciare i problemi di traffico, inquinamento e scarsità di spazi verdi", "Protestare contro le tasse comunali troppo alte"],
            "answer": "Denunciare i problemi di traffico, inquinamento e scarsità di spazi verdi"
        },
        {
            "question": "Quale dato preoccupante viene citato riguardo all'inquinamento?",
            "options": ["L'acqua del fiume è diventata nera", "Il PM10 ha superato i limiti di sicurezza per oltre 40 giorni consecutivi", "Le industrie locali bruciano troppa plastica"],
            "answer": "Il PM10 ha superato i limiti di sicurezza per oltre 40 giorni consecutivi"
        },
        {
            "question": "Cosa propone il Comitato riguardo al trasporto pubblico per gli studenti?",
            "options": ["Sostituire tutti gli autobus con dei taxi", "Rendere i mezzi pubblici gratuiti per gli under 25", "Permettere agli studenti di guidare a 16 anni"],
            "answer": "Rendere i mezzi pubblici gratuiti per gli under 25"
        },
        {
            "question": "Qual è la richiesta del Comitato in merito al centro storico della città?",
            "options": ["Trasformarlo in un'area gradualmente pedonale (ZTL rigorosa)", "Costruirci un grande centro commerciale", "Riaprirlo al traffico pesante per favorire i negozianti"],
            "answer": "Trasformarlo in un'area gradualmente pedonale (ZTL rigorosa)"
        },
        {
            "question": "Cosa offrono in cambio i giovani del Comitato all'Amministrazione?",
            "options": ["Soldi ricavati da raccolte fondi", "Volontariato per pulire i parchi e sensibilizzare le scuole", "Il loro voto alle prossime elezioni politiche"],
            "answer": "Volontariato per pulire i parchi e sensibilizzare le scuole"
        }
    ]
}]

# --- ARGOMENTATIVO B1 ---
testo_argomentativo = """<span style='color: #2c3e50; font-weight: bold;'>I Compiti a Casa: Strumento Utile o Fonte di Stress?</span> 📚

Il dibattito sull'utilità dei compiti a casa è vecchio quanto la scuola stessa. Da una parte troviamo docenti e pedagogisti convinti che l'impegno pomeridiano sia fondamentale per consolidare le conoscenze; dall'altra, psicologi e associazioni di genitori sostengono che un carico di lavoro eccessivo finisca per schiacciare i ragazzi, privandoli del tempo necessario per lo svago e la crescita personale. È dunque necessario analizzare entrambe le posizioni per comprendere quale sia l'approccio più corretto ed equilibrato.

Iniziamo con le <span style='color: #27ae60; font-weight: bold;'>argomentazioni a favore</span> dei compiti a casa ✍️. Il primo elemento da considerare è la memorizzazione. La mente umana necessita di ripetizione per trasformare una nozione appresa a breve termine in un ricordo a lungo termine. Ripassare una regola di matematica o una lezione di storia nel pomeriggio permette al cervello di "fissare" il concetto. Inoltre, lo studio autonomo insegna la <span style='color: #f1c40f; font-weight: bold;'>gestione del tempo</span> e la responsabilità. Uno studente che impara a pianificare i propri pomeriggi, dividendo lo sforzo tra le varie materie, sta acquisendo un'abilità organizzativa (le cosiddette *soft skills*) che gli sarà indispensabile nel mondo del lavoro o all'università.

Tuttavia, le <span style='color: #e74c3c; font-weight: bold;'>argomentazioni contrarie</span> sono altrettanto solide e supportate da studi recenti 📉. I detrattori del lavoro pomeridiano sottolineano che l'Italia è uno dei Paesi europei con il carico di compiti più elevato, ma questo non si traduce automaticamente in risultati migliori nei test internazionali (come le prove INVALSI o PISA). Al contrario, il "sovraccarico" genera ansia, disturbi del sonno e demotivazione. 

Un secondo aspetto critico riguarda le <span style='color: #8e44ad; font-weight: bold;'>disuguaglianze sociali</span>. I compiti a casa amplificano le differenze tra gli studenti: chi ha genitori istruiti e presenti, capaci di aiutare nello studio o di pagare ripetizioni private, è ampiamente avvantaggiato. Chi proviene da contesti difficili, magari in case rumorose o senza connessione a internet, viene penalizzato doppiamente, trasformando la scuola in un sistema non equo. Infine, lo sport, le passioni artistiche e il semplice "tempo libero" sono essenziali per lo sviluppo psicofisico dei giovani; rubare queste ore con eccessivi esercizi di grammatica significa ostacolare la loro creatività 🎨.

Qual è, dunque, la sintesi di questo dibattito? L'eliminazione totale dei compiti a casa appare una soluzione estrema che priverebbe gli studenti dell'opportunità di imparare a lavorare in autonomia. D'altro canto, il sistema attuale, basato su montagne di esercizi spesso mnemonici o punitivi, è obsoleto e dannoso.

La soluzione più ragionevole risiede nella <span style='color: #2980b9; font-weight: bold;'>qualità piuttosto che nella quantità</span>. I compiti non dovrebbero essere una mera prosecuzione della lezione in classe, ma attività mirate, stimolanti e personalizzate. Una ricerca su un argomento di attualità, la lettura di un capitolo di un romanzo, o la risoluzione di un problema logico-pratico sono molto più formativi di quaranta operazioni matematiche tutte uguali.

La vera sfida per la scuola del futuro non è abolire lo studio pomeridiano, ma trasformarlo. I compiti devono smettere di essere un dovere opprimente che toglie il sonno ai ragazzi e la pace alle famiglie, per diventare un momento sereno di curiosità intellettuale e consolidamento personale."""

data['lettura']['generi']['argomentativo']['difficile'] = [{
    "id": 9015,
    "title": "I Compiti a Casa: Utili o Dannosi?",
    "text": testo_argomentativo,
    "questions": [
        {
            "question": "Qual è una delle principali argomentazioni a favore dei compiti a casa citata nel testo?",
            "options": ["Aiutano le famiglie a risparmiare sui libri di testo", "Insegnano la gestione del tempo e la responsabilità autonoma", "Garantiscono agli studenti di ottenere il massimo dei voti nei test"],
            "answer": "Insegnano la gestione del tempo e la responsabilità autonoma"
        },
        {
            "question": "Secondo i detrattori, cosa genera l'eccesso di compiti a casa negli studenti italiani?",
            "options": ["Eccellenti risultati a livello europeo", "Competizione malsana tra i compagni di classe", "Ansia, disturbi del sonno e forte demotivazione"],
            "answer": "Ansia, disturbi del sonno e forte demotivazione"
        },
        {
            "question": "Perché i compiti a casa rischiano di amplificare le disuguaglianze sociali?",
            "options": ["Perché costano molto ai genitori", "Perché gli studenti senza un ambiente familiare adeguato o senza aiuti sono penalizzati", "Perché alcune scuole non assegnano i compiti"],
            "answer": "Perché gli studenti senza un ambiente familiare adeguato o senza aiuti sono penalizzati"
        },
        {
            "question": "Qual è la sintesi proposta dall'autore alla fine del testo?",
            "options": ["Abolire completamente i compiti a casa per legge", "Puntare sulla qualità dei compiti, rendendoli stimolanti invece che ripetitivi", "Aumentare le punizioni per chi non fa i compiti"],
            "answer": "Puntare sulla qualità dei compiti, rendendoli stimolanti invece che ripetitivi"
        },
        {
            "question": "Cosa ritiene l'autore riguardo al 'tempo libero' e allo sport dei giovani?",
            "options": ["Sono perdite di tempo che andrebbero eliminate a favore dello studio", "Sono essenziali per lo sviluppo psicofisico e non vanno ostacolati dai troppi compiti", "Possono essere praticati solo durante il fine settimana"],
            "answer": "Sono essenziali per lo sviluppo psicofisico e non vanno ostacolati dai troppi compiti"
        }
    ]
}]

new_json_str = json.dumps(data, indent=4, ensure_ascii=False)
final_text = prefix + new_json_str + ';\n'

with open('js/exercises.js', 'w', encoding='utf-8') as f:
    f.write(final_text)

print("Updated Fase 4: Diario, Lettera, Argomentativo B1 texts added.")

import json

with open('js/exercises.js', 'r', encoding='utf-8') as f:
    text = f.read()

prefix = 'window.exercisesData = '
json_str = text[len(prefix):].strip()
if json_str.endswith(';'):
    json_str = json_str[:-1]

data = json.loads(json_str)

# --- MISTERO B1 ---
testo_mistero = """<span style='color: #8e44ad; font-weight: bold;'>Il Segreto dell'Orologio ad Acqua</span> 🕰️

La bottega dell'antiquario <span style='color: #2980b9; font-weight: bold;'>Elias Thorne</span> era un dedalo di oggetti impolverati, mobili di epoca vittoriana e curiosità provenienti da ogni angolo del mondo. Elias era un uomo solitario, noto per la sua abilità nel riparare qualsiasi meccanismo, per quanto antico o complesso fosse. Un piovoso giovedì pomeriggio, una donna dal volto coperto da un velo nero entrò nel suo negozio, portando con sé una pesante cassa di legno.

Senza dire una parola, la donna posò la cassa sul bancone, lasciò una busta gonfia di banconote e uscì rapidamente, scomparendo nella nebbia londinese 🌫️. Elias, incuriosito, aprì la cassa. Al suo interno c'era uno strano oggetto: un antico <span style='color: #e67e22; font-weight: bold;'>orologio ad acqua</span> (chiamato clessidra ad acqua o clepsidra), realizzato in ottone massiccio e vetro di Murano.

Non era un orologio comune. Invece dei classici numeri romani, il quadrante era inciso con strani simboli zodiacali e rune celtiche. Ma la cosa più inquietante era il suo funzionamento. Pur essendo completamente vuoto e scollegato da qualsiasi fonte d'acqua, l'orologio emetteva un ticchettio regolare e, allo scoccare di quella che sembrava essere la mezzanotte, i suoi ingranaggi si muovevano producendo un suono cupo, simile a un lamento 🎶.

Elias decise di smontarlo per capirne il segreto. Lavorò per tre notti consecutive alla luce di una lampada a petrolio. Scoprì che l'orologio non funzionava ad acqua, ma tramite un ingegnoso sistema di calamite nascoste e pesi microscopici che sfruttavano le variazioni della pressione atmosferica. Tuttavia, c'era qualcosa di più. Il ticchettio irregolare che aveva notato la prima notte non era un difetto meccanico, ma un codice.

Armato di un taccuino, Elias iniziò a trascrivere i suoni: *tic-tic-pausa-tic...* Era <span style='color: #c0392b; font-weight: bold;'>Codice Morse</span>. Il messaggio, ripetuto in loop, diceva: "SOTTO LA LUNA NUOVA, IL LEONE GUARDA LA TORRE".

Elias consultò vecchie mappe della città. Capì che "il leone" si riferiva a una statua di bronzo situata nel parco centrale, mentre "la torre" era la vecchia torre campanaria abbandonata. Ma cosa significava "sotto la luna nuova"? Guardò il calendario: la luna nuova sarebbe stata quella stessa notte 🌑.

Indossato un impermeabile scuro, l'antiquario si recò al parco. La città era immersa in un silenzio irreale. Seguendo lo sguardo della statua del leone di bronzo, Elias si incamminò verso la vecchia torre. Alla base dell'edificio, coperta da edera rampicante, notò una pietra leggermente sporgente. Facendo leva con un cacciavite, riuscì a rimuoverla.

All'interno di una piccola cavità c'era una scatola di metallo arrugginito. La aprì con le mani tremanti. Conteneva un diario rilegato in pelle e una spilla d'oro a forma di clessidra ⏳. Il diario apparteneva a un famoso inventore del Diciottesimo secolo, scomparso misteriosamente. Sfogliando le pagine, Elias scoprì progetti per macchinari rivoluzionari capaci di generare energia pulita dal moto perpetuo, progetti che le potenti compagnie del carbone dell'epoca avevano cercato di insabbiare.

L'orologio non era solo un bizzarro pezzo d'antiquariato, ma la chiave per ritrovare un'eredità perduta che avrebbe potuto cambiare le sorti della rivoluzione industriale. Mentre Elias stringeva il diario, sentì dei passi avvicinarsi nell'oscurità. 

"Vedo che hai risolto il mio enigma, signor Thorne," disse una voce femminile, la stessa donna velata che era entrata nel suo negozio. "Ora, se non le dispiace, quell'orologio e i segreti del mio bisnonno devono tornare alla nostra famiglia."

Il mistero dell'orologio ad acqua era stato svelato, ma per Elias, l'avventura era appena cominciata."""

data['lettura']['generi']['mistero']['difficile'] = [{
    "id": 9009,
    "title": "Il Segreto dell'Orologio ad Acqua",
    "text": testo_mistero,
    "questions": [
        {
            "question": "Cosa consegna la donna misteriosa all'antiquario Elias Thorne?",
            "options": ["Un diario rilegato in pelle", "Una pesante cassa di legno contenente un antico orologio ad acqua", "Una spilla d'oro a forma di clessidra"],
            "answer": "Una pesante cassa di legno contenente un antico orologio ad acqua"
        },
        {
            "question": "Qual è la caratteristica più strana e inquietante dell'orologio?",
            "options": ["Emette un ticchettio e si muove pur essendo completamente vuoto e senza acqua", "Le lancette girano in senso antiorario", "È fatto di un metallo radioattivo che brilla al buio"],
            "answer": "Emette un ticchettio e si muove pur essendo completamente vuoto e senza acqua"
        },
        {
            "question": "In che modo Elias scopre il messaggio nascosto nell'orologio?",
            "options": ["Smontando un doppiofondo segreto nel legno", "Trascrivendo il ticchettio irregolare che si rivela essere Codice Morse", "Leggendo le antiche rune celtiche incise sul vetro"],
            "answer": "Trascrivendo il ticchettio irregolare che si rivela essere Codice Morse"
        },
        {
            "question": "Cosa trova Elias nascosto alla base della vecchia torre campanaria?",
            "options": ["Il tesoro perduto della corona inglese", "Un diario contenente progetti rivoluzionari di un inventore del Diciottesimo secolo", "Una mappa del tesoro disegnata con inchiostro simpatico"],
            "answer": "Un diario contenente progetti rivoluzionari di un inventore del Diciottesimo secolo"
        },
        {
            "question": "Chi si nasconde dietro la figura della donna velata?",
            "options": ["Una ladra internazionale di opere d'arte", "Un fantasma che infesta la bottega", "La pronipote dell'inventore scomparso"],
            "answer": "La pronipote dell'inventore scomparso"
        }
    ]
}]

# --- HORROR B1 ---
testo_horror = """<span style='color: #c0392b; font-weight: bold;'>La Locanda dei Sussurri</span> 🏚️

La tempesta si abbatté sui Monti Carpazi con una furia inaudita. La neve cadeva così fitta da formare un muro bianco invalicabile, e il vento ululava tra le gole rocciose come un lupo affamato 🐺. All'interno della loro carrozza ormai bloccata in un cumulo di neve, tre viaggiatori - un medico, una giovane istitutrice e un mercante - capirono di non poter proseguire. 

Attraverso la nebbia fitta, intravidero una debole luce tremolante. Si fecero strada a fatica nella neve alta fino alle ginocchia, giungendo davanti a un edificio di pietra grigia: <span style='color: #7f8c8d; font-weight: bold;'>La Locanda del Corvo Nero</span>. L'insegna di legno cigolava sinistramente sospinta dalle raffiche di vento.

Il proprietario, un uomo anziano e curvo con un occhio velato di cataratta, aprì la pesante porta di rovere senza dire una parola, facendoli accomodare nella sala comune dove ardeva un grande camino. L'atmosfera era pesante, viziata dall'odore di legna bruciata e carne stantia. 

"Siete fortunati ad aver trovato questo posto," gracchiò il vecchio oste, servendo loro uno stufato dall'aspetto discutibile. "Nessuno viaggia su questa strada dopo il tramonto. Il bosco... <span style='color: #e74c3c; font-weight: bold;'>trattiene</span> chi si attarda."

Non avendo alternative, i tre viaggiatori accettarono le stanze per la notte. La stanza della giovane istitutrice, Clara, si trovava in fondo al corridoio del secondo piano. Appena si distese sul letto dal materasso umido, un brivido le corse lungo la schiena 🥶. La stanza era glaciale, ma il camino era acceso. 

Nel cuore della notte, Clara fu svegliata da un suono lieve, quasi impercettibile. Non proveniva da fuori, ma *dall'interno* delle pareti. Erano <span style='color: #2c3e50; font-weight: bold;'>sussurri</span>. Voci raschianti e sovrapposte che mormoravano in una lingua sconosciuta. Cercò di convincersi che fosse solo il vento nelle tubature, ma i sussurri diventarono sempre più chiari. 

*"...lasciaci uscire... abbiamo così freddo..."*

Clara si alzò di scatto e accese una candela 🕯️. La fiammella tremolante illuminò la carta da parati sbiadita, che sembrava... muoversi. Sotto il motivo a fiori scoloriti, la carta si gonfiava e si sgonfiava al ritmo di un respiro affannoso. Terrorizzata, Clara corse verso la porta per uscire, ma la maniglia non girava. Era bloccata dall'esterno.

Iniziò a battere i pugni sul legno urlando, sperando che il medico o il mercante la sentissero. Improvvisamente, i sussurri si trasformarono in lamenti di dolore puro. Dalle fessure del pavimento di legno scuro iniziò a filtrare una densa nebbia nera che puzzava di terra smossa e decomposizione. 

Clara indietreggiò fino a inciampare sul tappeto, cadendo pesantemente. Mentre era a terra, notò qualcosa sotto il letto. Non era polvere. Era un'incisione nel legno del pavimento: <span style='color: #e74c3c; font-weight: bold;'>una lapide</span>. 

Con orrore, capì la verità. La locanda non era stata costruita su un normale terreno, ma sopra un antico cimitero appestato del XVII secolo. I morti non erano mai stati benedetti, e l'edificio li teneva prigionieri sotto le sue fondamenta. L'oste non offriva riparo ai viaggiatori: offriva sacrifici per placare la rabbia degli spiriti.

La nebbia nera iniziò a prendere forma. Dapprima furono solo mani scheletriche che sbucavano dal pavimento cercando un appiglio, poi volti emaciati con orbite vuote che la fissavano dal soffitto 👻. La candela si spense all'improvviso.

Nel buio totale, Clara sentì il freddo glaciale di dita invisibili che le afferravano le caviglie, trascinandola inesorabilmente verso le assi di legno, che ora si aprivano in una voragine senza fondo. Il suo urlo fu inghiottito dal rumore assordante della tempesta di neve. 

La mattina seguente, il vento si placò e il cielo tornò sereno. Il medico e il mercante, scesi nella sala comune, chiesero all'oste dove fosse l'istitutrice. L'uomo, mescolando un nuovo calderone di stufato, sorrise mostrando i denti marci. "È partita molto presto," rispose. "Ha detto che aveva troppa fretta." 

Nessuno la cercò. E i sussurri nelle pareti, per quella notte, si placarono."""

data['lettura']['generi']['horror']['difficile'] = [{
    "id": 9010,
    "title": "La Locanda dei Sussurri",
    "text": testo_horror,
    "questions": [
        {
            "question": "Perché i tre viaggiatori sono costretti a fermarsi alla locanda?",
            "options": ["La loro carrozza è bloccata da una tempesta di neve", "Uno di loro è gravemente malato e ha bisogno di cure", "Hanno perso la mappa e non sanno più dove andare"],
            "answer": "La loro carrozza è bloccata da una tempesta di neve"
        },
        {
            "question": "Cosa sente Clara nel cuore della notte all'interno della sua stanza?",
            "options": ["Il rumore di passi pesanti sul tetto", "Dei sussurri e voci raschianti provenienti dalle pareti", "Il pianto disperato di un bambino proveniente dal corridoio"],
            "answer": "Dei sussurri e voci raschianti provenienti dalle pareti"
        },
        {
            "question": "Quale terrificante scoperta fa Clara sotto il letto?",
            "options": ["Trova uno scheletro umano nascosto in un baule", "Trova un'incisione nel pavimento che si rivela essere una lapide", "Trova un libro di incantesimi usato dallo stregone"],
            "answer": "Trova un'incisione nel pavimento che si rivela essere una lapide"
        },
        {
            "question": "Qual è il terribile segreto della Locanda del Corvo Nero?",
            "options": ["L'oste avvelena il cibo degli ospiti per derubarli", "È stata costruita sopra un antico cimitero di appestati le cui anime sono intrappolate", "È un covo segreto di vampiri che attaccano di notte"],
            "answer": "È stata costruita sopra un antico cimitero di appestati le cui anime sono intrappolate"
        },
        {
            "question": "Cosa succede a Clara alla fine del racconto?",
            "options": ["Riesce a scappare saltando dalla finestra", "Viene trascinata sotto il pavimento dagli spiriti, mentre l'oste mente agli altri viaggiatori", "Viene salvata all'ultimo momento dal medico e dal mercante"],
            "answer": "Viene trascinata sotto il pavimento dagli spiriti, mentre l'oste mente agli altri viaggiatori"
        }
    ]
}]

# --- GIALLO B1 ---
testo_giallo = """<span style='color: #2980b9; font-weight: bold;'>Il Furto del Diamante Blu</span> 🔍

L'<span style='color: #f1c40f; font-weight: bold;'>Ispettore Lamberti</span> si accese un fiammifero, lo fece spegnere con un rapido movimento del polso e lo gettò nel posacenere. Non fumava da anni, ma quel gesto lo aiutava a concentrarsi. Davanti a lui, nel lussuoso salone di Villa Farnese, regnava il caos assoluto. L'evento mondano dell'anno si era trasformato nella scena del crimine del secolo: la cassaforte a muro era aperta, vuota. Il leggendario "Occhio di Zaffiro", un diamante blu dal valore inestimabile 💎, era sparito.

L'aspetto sconcertante della vicenda non era *cosa* fosse stato rubato, ma *come*. La cassaforte si trovava nello studio privato del conte Farnese, una stanza accessibile solo tramite una porta di rovere massiccio blindata. Durante il ricevimento, la porta era stata chiusa a chiave dall'interno e la finestra, situata al terzo piano, non mostrava segni di effrazione ed era sbarrata da pesanti inferriate antiche 🚪.

Era il classico, apparentemente insolubile, <span style='color: #e74c3c; font-weight: bold;'>mistero della camera chiusa</span>.

Lamberti interrogò i principali sospettati. C'era il *maggiordomo*, un uomo dall'aria austera ma con evidenti debiti di gioco; la *nipote del conte*, una giovane ereditiera diseredata di recente a causa del suo stile di vita sregolato; e infine, l'*esperto d'arte*, il professor Malaspina, l'unico ad avere le competenze per piazzare la pietra sul mercato nero senza destare sospetti.

Il conte giurava che nessuno, oltre a lui, conosceva la combinazione. "L'ho controllato alle dieci in punto," spiegò, asciugandosi il sudore dalla fronte. "Poi sono uscito dallo studio, ho chiuso a chiave e ho tenuto la chiave nel taschino del gilet per tutto il tempo."

L'ispettore esaminò minuziosamente lo studio. Sulla scrivania in noce antico, c'era un bicchiere di cristallo contenente un sottile strato d'acqua. Un vassoio d'argento vicino alla cassaforte mostrava una strana pozza d'acqua asimmetrica. Lamberti alzò lo sguardo. Sopra la cassaforte, c'era un condotto dell'aria condizionata, stretto e protetto da una griglia metallica. 

"Impossibile passare di lì," commentò l'agente scelto Rizzi, intuendo i pensieri dell'ispettore. "Nemmeno un bambino di cinque anni ci passerebbe, e la grata è avvitata dall'interno."

"Esatto, Rizzi. Nessun essere umano è passato da quel condotto," rispose Lamberti, sfiorando la pozzanghera sul vassoio d'argento. "Ma qualcosa ci è passato. Qualcosa di... temporaneo."

Lamberti radunò tutti i sospettati nel salone. La tensione era palpabile.
"Signori," esordì l'ispettore, "abbiamo un ladro molto ingegnoso. Ha rubato il diamante senza mai entrare fisicamente nello studio e senza conoscere la combinazione."

Un mormorio di incredulità attraversò la sala.

"Tutti voi sapevate che il conte soffre di una leggera amnesia e ha l'abitudine di lasciare la cassaforte semiaperta quando è nello studio da solo," continuò Lamberti. "Il ladro ha sfruttato questo dettaglio. Ma come ha estratto la pietra da una stanza chiusa a chiave?"

L'ispettore indicò il professor Malaspina 🕵️‍♂️. "Siete stato voi, professore. E l'arma del delitto è stata la fisica elementare."
Il professore impallidì ma mantenne un sorriso arrogante. "E come avrei fatto, sentiamo?"

"Avete utilizzato il condotto dell'aria condizionata che collega la stanza degli ospiti al tetto, passando esattamente sopra la scrivania del conte. Sapevate che il conte beve sempre acqua ghiacciata. Avete creato una sorta di 'amo' utilizzando un pezzo di spago robusto e... <span style='color: #3498db; font-weight: bold;'>un grosso blocco di ghiaccio</span> 🧊."

Lamberti spiegò l'ingegnoso meccanismo: "Avete calato il blocco di ghiaccio attraverso la grata fino a farlo appoggiare all'interno della cassaforte semiaperta, facendolo aderire perfettamente al diamante. Con l'aria calda del riscaldamento acceso, il ghiaccio si è fuso parzialmente inglobando la pietra preziosa. Poi, avete semplicemente tirato lo spago, sollevando il blocco di ghiaccio con il diamante incastrato dentro, facendolo passare attraverso le larghe sbarre del condotto. Il ghiaccio si è sciolto completamente nel vostro secchiello per lo champagne, lasciandovi solo il diamante, e sullo stipite dello studio... solo una pozza d'acqua inspiegabile."

Malaspina fece un passo indietro, sconvolto. Nelle tasche del suo cappotto, gli agenti trovarono l'Occhio di Zaffiro, freddo e brillante come il ghiaccio che lo aveva rapito. Il caso era chiuso."""

data['lettura']['generi']['giallo']['difficile'] = [{
    "id": 9011,
    "title": "Il Furto del Diamante Blu",
    "text": testo_giallo,
    "questions": [
        {
            "question": "Qual è il principale problema che rende questo furto un mistero apparentemente insolubile?",
            "options": ["La cassaforte è scomparsa nel nulla assieme al diamante", "Il diamante è stato rubato da una stanza chiusa a chiave dall'interno e senza segni di effrazione", "Il diamante rubato era in realtà un falso di vetro"],
            "answer": "Il diamante è stato rubato da una stanza chiusa a chiave dall'interno e senza segni di effrazione"
        },
        {
            "question": "Quale debolezza o abitudine del conte ha sfruttato il ladro per rubare il diamante?",
            "options": ["L'abitudine di lasciare la cassaforte semiaperta quando è solo nello studio", "Il fatto che scrivesse la combinazione su un post-it attaccato al computer", "L'abitudine di bere un bicchiere di latte caldo prima di dormire"],
            "answer": "L'abitudine di lasciare la cassaforte semiaperta quando è solo nello studio"
        },
        {
            "question": "Quale indizio fondamentale permette all'Ispettore Lamberti di risolvere il caso?",
            "options": ["Una ciocca di capelli biondi incastrata nella serratura", "Una strana pozza d'acqua asimmetrica trovata sul vassoio d'argento", "Un frammento di spago trovato sul davanzale della finestra"],
            "answer": "Una strana pozza d'acqua asimmetrica trovata sul vassoio d'argento"
        },
        {
            "question": "Come ha fatto il ladro a sollevare il diamante dalla cassaforte attraverso il condotto dell'aria?",
            "options": ["Calando un magnete potentissimo legato a una fune", "Usando un braccio meccanico radiocomandato", "Calando un blocco di ghiaccio che, sciogliendosi e ricongelandosi in parte, ha inglobato la pietra"],
            "answer": "Calando un blocco di ghiaccio che, sciogliendosi e ricongelandosi in parte, ha inglobato la pietra"
        },
        {
            "question": "Chi è il colpevole smascherato dall'Ispettore?",
            "options": ["Il maggiordomo con problemi di gioco d'azzardo", "La nipote ereditiera", "Il professor Malaspina, l'esperto d'arte"],
            "answer": "Il professor Malaspina, l'esperto d'arte"
        }
    ]
}]

# --- COMICO B1 ---
testo_comico = """<span style='color: #f39c12; font-weight: bold;'>Il Giorno in cui la Nonna Ha Imparato a Usare lo Smartphone</span> 😂

Tutto è iniziato un tranquillo sabato pomeriggio, quando la mia famiglia, in preda a un delirio di ottimismo tecnologico, ha deciso di regalare a nonna <span style='color: #e74c3c; font-weight: bold;'>Erminia</span> (78 anni, specialista in lasagne e lavorazione a maglia) un fiammante smartphone di ultima generazione 📱. Fino a quel giorno, la nonna considerava "tecnologia avanzata" il telecomando della televisione, che gestiva rigorosamente premendo i tasti con forza sovrumana usando l'indice irrigidito, convinta che maggiore fosse la pressione, migliore sarebbe stata la qualità dell'immagine.

L'installazione e la spiegazione di base furono affidate a me. "Guarda nonna, questo è WhatsApp. Serve per mandare messaggi gratuiti a tutti," le spiegai con pazienza zen. Lei annuì, afferrando il telefono a due mani, tenendolo a mezzo metro dal viso e socchiudendo gli occhi come se l'apparecchio stesse per esplodere.

Il primo disastro avvenne due giorni dopo. Ero a lezione all'università, nell'aula magna silenziosa, quando il mio telefono squillò a tutto volume con una suoneria tremenda. Sul display c'era scritto: <span style='color: #27ae60; font-weight: bold;'>Videochiamata in arrivo da NONNA</span> 📹. Preso dal panico (pensando a un'emergenza medica), rifiutai la chiamata, nascondendomi sotto il banco. Ma lei richiamò. E ancora. E ancora. Finché il professore non interruppe la spiegazione di Diritto Privato per dirmi: "Se la signora ci tiene così tanto, risponda pure, magari vuole partecipare al dibattito".

In preda all'imbarazzo, accettai la videochiamata. Sullo schermo apparve non il volto sorridente di mia nonna, ma un primissimo piano mozzafiato del suo *naso*, seguito da una rapida e vertiginosa inquadratura del lampadario della cucina.
"Pronto? Pronto?! Roberto, sei intrappolato dentro questo coso piatto?!" urlò la nonna, con una voce che rimbombò in tutta l'aula. "Non riesco a girare il tegame del sugo! Perché sei buio? Hai pagato la bolletta della luce?"
Tutta l'aula scoppiò in una risata fragorosa 🤣. Impiegai dieci minuti per spiegarle come spegnere la chiamata.

Ma il capolavoro assoluto avvenne la settimana successiva, durante un tentativo di modernizzazione culinaria. Nonna Erminia aveva sentito dire al mercato che su "quel faccialibro di internet" (così chiamava i social in generale) si trovavano ricette eccezionali. Ignorando completamente i concetti di privacy e selezione dell'app, aprì <span style='color: #8e44ad; font-weight: bold;'>TikTok</span> invece di Google, e premette involontariamente il pulsante "Registra" invece della barra di ricerca 🎥.

Iniziò così una diretta involontaria in cui la nonna, credendo di parlare con un'entità digitale chiamata "Siri-Alexa", iniziò a imprecare in dialetto stretto contro la besciamella che stava facendo i grumi. "Maledetta farina moderna! Ai miei tempi l'acqua era diversa! Come si fa a togliere questi pallini, eh, signor telefono?!" gridava, sventolando un mestolo di legno coperto di salsa bianca verso l'obiettivo del telefono, sfoggiando un grembiule fiorato abbinato a delle pantofole a forma di orso 🐻.

Senza saperlo, aveva attivato un filtro che le aggiungeva delle orecchie da gatto rosa e dei brillantini arcobaleno intorno alla testa. La scena di una nonna infuriata con la besciamella, con orecchie da gatto scintillanti, era troppo perfetta per passare inosservata. In meno di tre ore, il video divenne virale 📈. Centinaia di migliaia di visualizzazioni. Migliaia di commenti di adolescenti che la elessero a loro "spirito guida per affrontare i problemi della vita".

Quando la domenica andai a pranzo da lei, trovai mio cugino seduto sul divano che le leggeva i commenti entusiasti. "Nonna, sei un'influencer! Hai più follower del sindaco!" le disse emozionato.

Nonna Erminia lo guardò sistemandosi gli occhiali. "Influ-che? Speriamo non sia contagioso. Piuttosto, prendimi quel telefono piatto. Ho schiacciato un pulsante rosso e adesso c'è un uomo pelato che mi parla in inglese di come investire in criptovalute. Io volevo solo sapere quanta noce moscata serve per le lasagne!" 🤷‍♀️

Da quel giorno, abbiamo imparato una lezione preziosa: la tecnologia non ha età, ma la besciamella della nonna rimane l'unica cosa veramente imbattibile."""

data['lettura']['generi']['comico']['difficile'] = [{
    "id": 9012,
    "title": "Il Giorno in cui la Nonna Ha Imparato a Usare lo Smartphone",
    "text": testo_comico,
    "questions": [
        {
            "question": "Come considerava la nonna Erminia la tecnologia prima di ricevere lo smartphone?",
            "options": ["Era già esperta perché usava spesso il computer", "Considerava 'tecnologia avanzata' il telecomando della TV, che premeva fortissimo", "Odiava i dispositivi elettronici e si rifiutava di toccarli"],
            "answer": "Considerava 'tecnologia avanzata' il telecomando della TV, che premeva fortissimo"
        },
        {
            "question": "Quale imbarazzante episodio avviene mentre il protagonista è a lezione all'università?",
            "options": ["La nonna gli invia centinaia di messaggi vocali vuoti", "La nonna avvia una lunga videochiamata inquadrando solo il suo naso e il lampadario", "Lo smartphone della nonna fa partire una canzone a tutto volume durante la notte"],
            "answer": "La nonna avvia una lunga videochiamata inquadrando solo il suo naso e il lampadario"
        },
        {
            "question": "Quale errore commette la nonna mentre cerca una ricetta su internet?",
            "options": ["Cancella per sbaglio tutte le foto di famiglia", "Ordina per errore 100 kg di farina online", "Apre TikTok e avvia una registrazione video involontaria invece di usare Google"],
            "answer": "Apre TikTok e avvia una registrazione video involontaria invece di usare Google"
        },
        {
            "question": "Perché il video della nonna diventa incredibilmente virale sui social?",
            "options": ["Perché la ricetta della besciamella era geniale e innovativa", "Perché inveisce in dialetto contro la besciamella con un esilarante filtro con orecchie da gatto rosa", "Perché cantava una canzone famosa mentre cucinava"],
            "answer": "Perché inveisce in dialetto contro la besciamella con un esilarante filtro con orecchie da gatto rosa"
        },
        {
            "question": "Qual è la preoccupazione principale della nonna alla fine della storia?",
            "options": ["Capire quanta noce moscata inserire nelle lasagne, ignorando il successo sui social", "Diventare ricca diventando un'influencer professionista", "Comprare un nuovo telefono ancora più costoso"],
            "answer": "Capire quanta noce moscata inserire nelle lasagne, ignorando il successo sui social"
        }
    ]
}]

new_json_str = json.dumps(data, indent=4, ensure_ascii=False)
final_text = prefix + new_json_str + ';\n'

with open('js/exercises.js', 'w', encoding='utf-8') as f:
    f.write(final_text)

print("Updated Fase 3: Mistero, Horror, Giallo, Comico B1 texts added.")

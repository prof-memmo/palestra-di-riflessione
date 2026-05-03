import json
import os

with open('js/exercises.js', 'r', encoding='utf-8') as f:
    text = f.read()

prefix = 'window.exercisesData = '
json_str = text[len(prefix):].strip()
if json_str.endswith(';'):
    json_str = json_str[:-1]

data = json.loads(json_str)

# --- FAVOLA B1 ---
testo_favola = """In un'antica foresta rigogliosa, dove la luce del sole filtrava a fatica tra le chiome degli alberi secolari, sorgeva la radura conosciuta come il <span style='color: #27ae60; font-weight: bold;'>Consiglio degli Animali</span> 🌳. Qui, da generazioni, le creature del bosco si riunivano per discutere dei problemi comuni e prendere decisioni importanti per la sopravvivenza di tutti. Tuttavia, negli ultimi tempi, un'ombra di preoccupazione si era allungata sulla valle: una terribile <span style='color: #e74c3c; font-weight: bold;'>siccità</span> aveva prosciugato gran parte del torrente principale, mettendo a rischio la vita di piante e animali ☀️.

Un giorno, il saggio gufo <span style='color: #8e44ad; font-weight: bold;'>Archimede</span> 🦉 convocò un'assemblea straordinaria. Archimede era rispettato da tutti per la sua infinita saggezza e per la sua capacità di mantenere la calma anche nelle situazioni più disperate. Appollaiato sul ramo più alto di una vecchia quercia, osservò la folla radunata sotto di lui. C'erano cervi, cinghiali, lepri, volpi e persino piccoli insetti, tutti con lo sguardo rivolto verso l'alto, in cerca di una soluzione.

"Amici miei," esordì Archimede con la sua voce profonda e pacata, "la situazione è grave. Se non troviamo un modo per portare l'acqua nella nostra valle, molti di noi non sopravvivranno all'estate. Dobbiamo unire le nostre forze e trovare una soluzione comune."

La volpe <span style='color: #d35400; font-weight: bold;'>Ruggine</span> 🦊, nota per la sua astuzia ma anche per il suo egoismo, prese subito la parola. "Io propongo di organizzare una spedizione verso le fattorie degli umani," disse con un sorriso furbo. "Lì ci sono pozzi e cisterne piene d'acqua. Potremmo prenderla di notte, quando tutti dormono."

Un mormorio di disapprovazione si levò dalla folla. Gli umani erano pericolosi, e rubare la loro acqua avrebbe sicuramente scatenato ritorsioni.

"È un'idea folle!" ruggì l'orso <span style='color: #2c3e50; font-weight: bold;'>Bernardo</span> 🐻, facendosi avanti con passo pesante. "Io sono il più forte qui. Scaverò una buca così profonda al centro della radura che troverò una falda acquifera sotterranea. L'acqua sgorgherà come una fontana, e tutti mi ringrazierete."

Bernardo, senza aspettare il parere degli altri, iniziò a scavare furiosamente con le sue possenti zampe. Terra e sassi volavano in ogni direzione. Scavò per ore, fino a scomparire quasi del tutto nella buca, ma dell'acqua non c'era traccia. Alla fine, esausto e coperto di polvere, fu costretto ad arrendersi.

Fu allora che si fece avanti un piccolo scoiattolo di nome <span style='color: #f39c12; font-weight: bold;'>Nocciola</span> 🐿️. Nocciola non era né forte come Bernardo né astuto come Ruggine, ma era un grande osservatore.

"Scusate se intervengo," disse Nocciola con voce tremante ma decisa, "ma scavare non servirà a nulla, e rubare agli umani è troppo pericoloso. Tuttavia, ho notato che sulle montagne, molto al di sopra della nostra valle, c'è un antico lago glaciale che non si è mai prosciugato 🏔️. L'acqua è bloccata da una diga naturale di rocce."

"E come pensi di far arrivare quell'acqua fin qui, piccolo scoiattolo?" domandò Ruggine con tono di scherno.

"Con il lavoro di squadra!" rispose Nocciola con entusiasmo. "Se i castori costruiranno una rete di canali in legno, se i tassi e le marmotte scaveranno dei piccoli tunnel per far passare l'acqua, e se gli uccelli ci guideranno dall'alto, potremo creare un <span style='color: #2980b9; font-weight: bold;'>sistema di irrigazione</span> che porterà l'acqua direttamente nella nostra valle!"

L'idea lasciò tutti a bocca aperta. Archimede annuì solennemente. "È un piano ambizioso, ma è l'unico che può funzionare. La forza di Bernardo non è bastata, e l'astuzia egoista di Ruggine ci avrebbe messo in pericolo. Solo collaborando potremo salvarci."

Così, sotto la guida attenta di Nocciola e Archimede, gli animali iniziarono a lavorare insieme 🤝. I castori, instancabili, costruirono solide condutture in legno 🪵. I tassi scavarono percorsi sotterranei per aggirare gli ostacoli rocciosi, mentre gli uccelli, volando ad alta quota, indicavano la via più breve e sicura per far defluire l'acqua. Persino Bernardo mise la sua forza a disposizione per spostare i massi più pesanti, e Ruggine usò la sua intelligenza per risolvere i problemi ingegneristici più complessi.

Dopo giorni di duro e incessante lavoro, un grido di gioia si levò dalla folla. L'acqua, fresca e cristallina, iniziò a scorrere attraverso i canali artificiali, riempiendo nuovamente il letto del torrente e ridando vita alla foresta 💧. Le piante si raddrizzarono, i fiori sbocciarono di nuovo e gli animali poterono finalmente dissetarsi.

La <span style='color: #e74c3c; font-weight: bold;'>morale</span> di questa storia è che non importa quanto si sia grandi o forti: le sfide più ardue possono essere superate solo attraverso l'unità, la collaborazione e il rispetto delle capacità di ognuno. Il piccolo Nocciola aveva dimostrato che l'intelligenza condivisa è l'arma più potente di tutte."""

data['lettura']['generi']['favola']['difficile'] = [{
    "id": 9001,
    "title": "L'Alleanza della Valle Verde",
    "text": testo_favola,
    "questions": [
        {
            "question": "Quale grave problema affligge il Consiglio degli Animali?",
            "options": ["Una malattia contagiosa", "Una terribile siccità", "L'attacco dei cacciatori"],
            "answer": "Una terribile siccità"
        },
        {
            "question": "Quale soluzione propone inizialmente l'orso Bernardo?",
            "options": ["Scavare una buca profonda per trovare una falda acquifera", "Andare a rubare l'acqua agli umani", "Costruire un canale dalle montagne"],
            "answer": "Scavare una buca profonda per trovare una falda acquifera"
        },
        {
            "question": "Chi ha l'idea di sfruttare il lago glaciale sulle montagne?",
            "options": ["Il gufo Archimede", "La volpe Ruggine", "Lo scoiattolo Nocciola"],
            "answer": "Lo scoiattolo Nocciola"
        },
        {
            "question": "Quale compito specifico svolgono i castori nel piano finale?",
            "options": ["Spostano i massi più pesanti", "Costruiscono solide condutture in legno", "Volano ad alta quota per indicare la via"],
            "answer": "Costruiscono solide condutture in legno"
        },
        {
            "question": "Qual è l'insegnamento principale di questa favola?",
            "options": ["L'intelligenza del singolo è più utile della forza", "Le sfide si superano solo con la collaborazione e l'unità", "Non bisogna mai fidarsi degli umani"],
            "answer": "Le sfide si superano solo con la collaborazione e l'unità"
        }
    ]
}]

# --- FIABA B1 ---
testo_fiaba = """C'era una volta, in un'epoca in cui la magia era ancora presente nel mondo, il magnifico <span style='color: #2980b9; font-weight: bold;'>Regno di Cristallo</span> 🏰. Questo luogo era famoso in tutte le terre conosciute per i suoi palazzi scintillanti, costruiti con un ghiaccio magico che non si scioglieva mai, e per la serenità dei suoi abitanti. Tuttavia, la pace del regno fu improvvisamente spezzata dall'arrivo dell'<span style='color: #34495e; font-weight: bold;'>Ombra Fredda</span>, una maledizione scagliata da un malvagio stregone esiliato molti secoli prima ❄️.

L'Ombra Fredda non era una semplice tempesta: era una nebbia oscura che avanzava inesorabile, congelando non solo l'acqua e la terra, ma persino i cuori delle persone. Chiunque venisse avvolto da questa nebbia cadeva in un sonno profondo e senza sogni, da cui sembrava impossibile svegliarsi. In pochi giorni, gran parte del regno fu avvolta dal gelo eterno, e anche il Re e la Regina caddero vittime del crudele incantesimo 👑.

L'unica speranza risiedeva nel giovane principe <span style='color: #f1c40f; font-weight: bold;'>Aurelio</span> 🤴. Egli sapeva, leggendo antichi tomi nella biblioteca reale, che l'unico modo per sconfiggere l'Ombra Fredda era recuperare il leggendario <span style='color: #e74c3c; font-weight: bold;'>Tizzone della Vita</span> 🔥, una gemma fiammeggiante custodita nel cratere del Vulcano del Sole, una montagna impervia situata oltre il Deserto delle Illusioni.

Aurelio non partì da solo. Al suo fianco c'era <span style='color: #27ae60; font-weight: bold;'>Elara</span> 👧, una giovane intagliatrice di cristalli. Elara era di umili origini, ma possedeva un dono raro: riusciva a percepire le vibrazioni magiche all'interno delle pietre. La sua sensibilità sarebbe stata fondamentale per superare le insidie del viaggio.

Il viaggio fu irto di pericoli fin dall'inizio. Per raggiungere il deserto, dovettero attraversare la Foresta dei Sussurri, un bosco stregato dove gli alberi imitavano le voci dei loro cari per farli perdere 🌲. Aurelio, sentendo la voce della madre, fece per deviare dal sentiero, ma Elara gli strinse la mano. "Non ascoltarli, mio principe. Sono solo illusioni create per confonderci," disse con voce ferma. Grazie alla sua bussola di cristallo, riuscirono a ritrovare la strada.

Giunti al <span style='color: #e67e22; font-weight: bold;'>Deserto delle Illusioni</span> 🐪, affrontarono la seconda prova. Il caldo era soffocante e il paesaggio mutava continuamente, creando miraggi di oasi fresche e sorgenti d'acqua. Aurelio era stremato dalla sete, ma Elara utilizzò le sue conoscenze per trovare le radici di una pianta del deserto in grado di dissetarli.

Finalmente, giunsero alle pendici del Vulcano del Sole 🌋. L'aria era rovente e il terreno tremava sotto i loro piedi. La scalata fu faticosa e pericolosa: dovevano evitare geyser di lava bollente e rocce taglienti come rasoi. Giunti sull'orlo del cratere, si trovarono di fronte a una gigantesca porta di pietra sorvegliata da un possente golem di ossidiana 🗿.

"Nessuno può prendere il Tizzone della Vita se non possiede un cuore puro," rimbombò la voce del golem. "Dovete sacrificare ciò che vi è di più caro."

Aurelio esitò, pensando alla sua corona e al suo regno. Ma Elara, senza pensarci due volte, prese la sua collana di cristallo, l'unico ricordo di sua madre, e la pose ai piedi del guardiano. Il golem, sorpreso da tale gesto di disinteresse, si fece da parte, permettendo loro di prendere il <span style='color: #e74c3c; font-weight: bold;'>Tizzone della Vita</span>.

Con la gemma fiammeggiante tra le mani, i due eroi fecero ritorno al Regno di Cristallo. Non appena il Tizzone fu sollevato al cielo, emanò un calore così intenso e puro che l'Ombra Fredda si dissolse istantaneamente ✨. I cuori delle persone tornarono a battere, i fiori sbocciarono di nuovo sotto il ghiaccio e il Re e la Regina si risvegliarono dal loro sonno.

Aurelio capì che il coraggio e la nobiltà d'animo non appartengono solo ai reali, ma a chiunque sia disposto a sacrificarsi per il bene degli altri. Chiese a Elara di diventare la sua consigliera reale, e insieme governarono il regno con saggezza e compassione, assicurandosi che l'oscurità non facesse mai più ritorno."""

data['lettura']['generi']['fiaba']['difficile'] = [{
    "id": 9002,
    "title": "Il Regno di Cristallo e l'Ombra Fredda",
    "text": testo_fiaba,
    "questions": [
        {
            "question": "Cosa provoca l'Ombra Fredda a chi ne viene avvolto?",
            "options": ["Trasforma le persone in statue di ghiaccio", "Fa cadere in un sonno profondo e senza sogni", "Ruba i ricordi delle persone"],
            "answer": "Fa cadere in un sonno profondo e senza sogni"
        },
        {
            "question": "Qual è il dono speciale che possiede la giovane Elara?",
            "options": ["Saper percepire le vibrazioni magiche nelle pietre", "Conoscere tutti i sentieri del bosco a memoria", "Saper parlare il linguaggio degli animali"],
            "answer": "Saper percepire le vibrazioni magiche nelle pietre"
        },
        {
            "question": "Quale pericolo affrontano i protagonisti nella Foresta dei Sussurri?",
            "options": ["Creature mostruose che attaccano nell'ombra", "Alberi che imitano le voci dei cari per farli perdere", "Nebbie tossiche che tolgono il respiro"],
            "answer": "Alberi che imitano le voci dei cari per farli perdere"
        },
        {
            "question": "Cosa sacrifica Elara per superare il guardiano di ossidiana?",
            "options": ["La sua bussola magica", "La sua collana di cristallo, ricordo della madre", "La sua stessa vista"],
            "answer": "La sua collana di cristallo, ricordo della madre"
        },
        {
            "question": "Cosa impara il principe Aurelio alla fine dell'avventura?",
            "options": ["Che la magia oscura è sempre più forte di quella benefica", "Che il coraggio e la nobiltà d'animo non appartengono solo ai reali", "Che bisogna sempre viaggiare da soli"],
            "answer": "Che il coraggio e la nobiltà d'animo non appartengono solo ai reali"
        }
    ]
}]

# --- FANTASY B1 ---
testo_fantasy = """Nelle profondità inesplorate del continente di <span style='color: #8e44ad; font-weight: bold;'>Aethelgard</span>, dove le montagne sfioravano le stelle e i fiumi cantavano antiche melodie, sorgeva la Torre d'Avorio 🏰. Qui, i membri dell'Ordine dei Custodi dedicavano le loro vite allo studio della magia elementale. Tra i novizi c'era un giovane di nome <span style='color: #2980b9; font-weight: bold;'>Kaelen</span> 🧙‍♂️, un ragazzo dall'animo inquieto che passava più tempo a esplorare i sotterranei della torre che a studiare i noiosi tomi accademici.

Un giorno, mentre si addentrava in un'ala abbandonata e polverosa della biblioteca, Kaelen scoprì una porta nascosta dietro un arazzo logoro. Il passaggio conduceva a una cripta segreta illuminata da funghi bioluminescenti. Al centro della stanza, su un altare di pietra nera, riposava un oggetto straordinario: un <span style='color: #f1c40f; font-weight: bold;'>Uovo di Drago d'Argento</span> 🐉. L'uovo, grande quanto un macigno, emanava un calore rassicurante e pulsava di una luce interna, come se un cuore antico battesse ancora al suo interno.

Kaelen sapeva che i draghi d'argento erano considerati estinti da millenni, annientati durante la Guerra delle Ombre. Ma quell'uovo era vivo. Prima che potesse informare i suoi maestri, la torre fu attaccata. La <span style='color: #e74c3c; font-weight: bold;'>Confraternita del Caos</span> 👿, un gruppo di stregoni oscuri guidati dal perfido Malakar, aveva fatto irruzione, distruggendo le difese magiche della torre. Cercavano l'uovo, per sfruttarne l'immenso potere e soggiogare Aethelgard.

Agendo d'istinto, Kaelen utilizzò un incantesimo di occultamento per nascondere l'uovo in uno zaino incantato, in grado di alterare lo spazio interno. Con il cuore in gola, fuggì attraverso un passaggio segreto che conduceva alla Valle delle Nebbie 🌫️, giurando a se stesso di proteggere l'uovo a costo della vita.

Il suo viaggio lo portò ad attraversare lande desolate e foreste incantate. Lungo il cammino, si unirono a lui due improbabili alleati: <span style='color: #27ae60; font-weight: bold;'>Lyra</span> 🧝‍♀️, una guerriera elfa abilissima con l'arco e conoscitrice dei segreti della natura, e <span style='color: #d35400; font-weight: bold;'>Gromm</span> 🪓, un nano burbero ma leale, armato di un'ascia forgiata nelle profondità della terra.

Insieme, dovettero affrontare innumerevoli sfide. Sfuggirono alle imboscate dei predoni oscuri di Malakar, decifrarono enigmi millenari scolpiti su monoliti di pietra per trovare la strada, e sconfissero una chimera che bloccava il Passo dei Sospiri. Lyra insegnò a Kaelen a sintonizzarsi con l'energia della natura per potenziare i suoi incantesimi, mentre Gromm gli spiegò l'importanza della disciplina e del coraggio in battaglia.

Finalmente, giunsero al <span style='color: #c0392b; font-weight: bold;'>Picco dell'Aurora</span> ⛰️, il luogo leggendario dove i draghi d'argento nascevano sotto la luce del sole nascente. Ma Malakar li aveva preceduti. Lo stregone oscuro li attendeva sulla cima, circondato dai suoi seguaci.

"Consegnami l'uovo, ragazzino, e vi lascerò vivere," intimò Malakar, evocando sfere di fuoco oscuro dalle mani.

"Non permetterò che tu corrompa questa creatura!" rispose Kaelen, sfoderando il suo bastone magico.

La battaglia fu epica. Kaelen, Lyra e Gromm combatterono con tutte le loro forze, combinando magia, agilità e forza bruta. Quando la situazione sembrava volgere al peggio, con Malakar pronto a scagliare il colpo letale, l'uovo nello zaino di Kaelen si schiuse con un boato assordante ✨.

Un maestoso <span style='color: #bdc3c7; font-weight: bold;'>Drago d'Argento</span> spiegò le sue ali scintillanti. Non era un cucciolo indifeso, ma una creatura ricolma di un'energia primordiale. Il drago emise un soffio di luce purificatrice che spazzò via la magia oscura di Malakar e mise in fuga i suoi seguaci. Il perfido stregone, sconfitto e privato dei suoi poteri, scomparve in una nuvola di fumo nero.

Il drago, riconoscendo in Kaelen il suo protettore, chinò la testa in segno di rispetto. Aethelgard era salva, e una nuova era di alleanza tra umani, elfi, nani e draghi era appena cominciata. Kaelen, un tempo novizio inquieto, era diventato una leggenda, il primo Cavaliere dei Draghi dopo millenni."""

data['lettura']['generi']['fantasy']['difficile'] = [{
    "id": 9003,
    "title": "Il Risveglio del Drago d'Argento",
    "text": testo_fantasy,
    "questions": [
        {
            "question": "Cosa scopre Kaelen nei sotterranei della Torre d'Avorio?",
            "options": ["Un libro magico proibito", "Un Uovo di Drago d'Argento", "Un portale verso un altro mondo"],
            "answer": "Un Uovo di Drago d'Argento"
        },
        {
            "question": "Perché Kaelen deve fuggire dalla torre?",
            "options": ["Perché ha rubato un artefatto ai suoi maestri", "Perché la torre viene attaccata dalla Confraternita del Caos", "Perché un drago adulto lo sta inseguendo"],
            "answer": "Perché la torre viene attaccata dalla Confraternita del Caos"
        },
        {
            "question": "Chi sono gli alleati che si uniscono a Kaelen nel suo viaggio?",
            "options": ["Un cavaliere oscuro e una strega", "Un re e un principe", "Un'elfa guerriera (Lyra) e un nano (Gromm)"],
            "answer": "Un'elfa guerriera (Lyra) e un nano (Gromm)"
        },
        {
            "question": "Cosa accade quando Malakar sta per sconfiggere i protagonisti?",
            "options": ["Arrivano i maestri della torre in loro soccorso", "L'uovo si schiude e il drago sprigiona una luce purificatrice", "Lyra lancia un incantesimo di teletrasporto per fuggire"],
            "answer": "L'uovo si schiude e il drago sprigiona una luce purificatrice"
        },
        {
            "question": "Qual è il nuovo titolo o ruolo che assume Kaelen alla fine della storia?",
            "options": ["Primo Cavaliere dei Draghi", "Gran Maestro della Confraternita", "Re di Aethelgard"],
            "answer": "Primo Cavaliere dei Draghi"
        }
    ]
}]

# --- AVVENTURA B1 ---
testo_avventura = """L'aria nella <span style='color: #27ae60; font-weight: bold;'>Foresta Amazzonica</span> era densa, umida e carica di suoni primordiali 🌴. Il professor <span style='color: #2980b9; font-weight: bold;'>Julian Vance</span> 🧭, archeologo di fama internazionale, si asciugò il sudore dalla fronte mentre si faceva strada tra liane intricate e radici sporgenti. Era alla guida di una spedizione audace, finanziata per ritrovare la leggendaria "Città d'Oro di Paititi", un insediamento Inca perduto da secoli. Con lui c'erano <span style='color: #e67e22; font-weight: bold;'>Elena</span> 🗺️, un'esperta cartografa, e <span style='color: #c0392b; font-weight: bold;'>Miguel</span> 🪓, una guida locale la cui conoscenza della giungla era fondamentale per la sopravvivenza del gruppo.

Erano in marcia da tre settimane. Le zanzare non davano tregua e le piogge improvvise trasformavano i sentieri in torrenti di fango scivoloso. Tuttavia, Julian sentiva di essere vicino: la mappa incisa su una tavoletta di pietra recuperata in Perù mesi prima indicava che la città si trovava alla confluenza di due fiumi sotterranei.

Una mattina, mentre il gruppo attraversava una zona particolarmente fitta di vegetazione, Miguel alzò bruscamente una mano, segnalando di fermarsi. Il silenzio calò improvvisamente sulla foresta. Dagli alberi non proveniva alcun canto di uccelli, nessun fruscio di scimmie. "Siamo seguiti," sussurrò Miguel, stringendo forte il suo machete.

Tra le ombre della boscaglia, due occhi gialli e penetranti li fissavano. Era un <span style='color: #f39c12; font-weight: bold;'>giaguaro</span> 🐆, il predatore più letale dell'Amazzonia, enorme e muscoloso. Julian trattenne il respiro. Sapeva che un movimento improvviso avrebbe potuto scatenare l'attacco. Lentamente, Elena estrasse un razzo di segnalazione dallo zaino. Con un gesto rapido, lo accese e lo lanciò in aria. Il sibilo acuto e la luce rossa brillante sorpresero l'animale, che con un ringhio infastidito si ritirò nell'oscurità della giungla.

Scampato il pericolo, la spedizione riprese il cammino con maggiore cautela. Nel tardo pomeriggio, udirono un rombo sordo e continuo. Pochi chilometri dopo, si trovarono di fronte a una <span style='color: #3498db; font-weight: bold;'>cascata colossale</span> 🌊, le cui acque precipitavano in un canyon profondo e nebbioso. Dietro il velo d'acqua, Julian scorse qualcosa di innaturale: un'apertura geometrica scolpita nella roccia.

"È lì!" gridò Julian, coprendo il rumore della cascata. "L'ingresso di Paititi!"

Per raggiungere la grotta, dovettero attraversare un vecchio ponte di corda traballante sospeso sul baratro. Il ponte scricchiolava paurosamente sotto i loro passi. Proprio mentre Elena era a metà strada, una delle corde principali si spezzò con uno schiocco secco. La ragazza scivolò, rimanendo appesa nel vuoto, sostenuta solo dalle forti braccia di Miguel che si era lanciato in avanti per afferrarla. Con uno sforzo sovrumano, Julian e Miguel riuscirono a tirarla su, raggiungendo sani e salvi l'ingresso della caverna.

All'interno, l'ambiente era asciutto e fresco. Utilizzando le loro torce potenti, esplorarono i tunnel tortuosi fino a giungere a una camera immensa. Davanti ai loro occhi si ergeva un tempio maestoso, non fatto d'oro massiccio come narravano le leggende, ma ricoperto di <span style='color: #f1c40f; font-weight: bold;'>lastre di un minerale luminescente</span> ✨ che brillava di luce propria.

Al centro del tempio, su un altare di pietra, riposava un <span style='color: #8e44ad; font-weight: bold;'>codice antico</span> inciso su lamine d'oro: non un tesoro di ricchezze materiali, ma un inestimabile patrimonio di conoscenze sull'astronomia, la medicina e la storia del popolo Inca. Julian sfiorò le lamine con riverenza. "Questo è il vero tesoro di Paititi," mormorò emozionato. "La conoscenza sopravvissuta al tempo."

La spedizione era stata estenuante e pericolosa, ma aveva portato alla luce una scoperta che avrebbe riscritto i libri di storia. Con grande attenzione, documentarono ogni dettaglio, scattarono fotografie e fecero calchi delle iscrizioni, pronti a fare ritorno nel mondo civile per condividere la loro straordinaria scoperta con l'intera umanità."""

data['lettura']['generi']['avventura']['difficile'] = [{
    "id": 9004,
    "title": "Spedizione nel Cuore dell'Amazzonia",
    "text": testo_avventura,
    "questions": [
        {
            "question": "Qual è l'obiettivo della spedizione guidata dal professor Julian Vance?",
            "options": ["Trovare un minerale sconosciuto", "Ritrovare la Città d'Oro di Paititi", "Catturare un raro giaguaro dell'Amazzonia"],
            "answer": "Ritrovare la Città d'Oro di Paititi"
        },
        {
            "question": "Come riescono i protagonisti ad allontanare il giaguaro?",
            "options": ["Sparando in aria con un fucile", "Accendendo un razzo di segnalazione", "Offrendogli del cibo"],
            "answer": "Accendendo un razzo di segnalazione"
        },
        {
            "question": "Cosa trovano dietro la cascata colossale?",
            "options": ["Un ingresso scolpito nella roccia", "Un fiume sotterraneo invalicabile", "Una grotta piena di pipistrelli"],
            "answer": "Un ingresso scolpito nella roccia"
        },
        {
            "question": "Quale grave pericolo affronta Elena durante il percorso?",
            "options": ["Viene morsa da un serpente", "Rischia di cadere perché il ponte di corda si spezza", "Rimane bloccata in una trappola antica"],
            "answer": "Rischia di cadere perché il ponte di corda si spezza"
        },
        {
            "question": "Qual è il vero 'tesoro' che trovano all'interno del tempio?",
            "options": ["Montagne di monete d'oro e gioielli", "Un codice antico contenente importanti conoscenze", "Armi magiche appartenute ai guerrieri Inca"],
            "answer": "Un codice antico contenente importanti conoscenze"
        }
    ]
}]

new_json_str = json.dumps(data, indent=4, ensure_ascii=False)
final_text = prefix + new_json_str + ';\n'

with open('js/exercises.js', 'w', encoding='utf-8') as f:
    f.write(final_text)

print("Updated Fase 1: Favola, Fiaba, Fantasy, Avventura B1 texts added.")

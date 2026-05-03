import re
import json

with open('js/exercises.js', 'r', encoding='utf-8') as f:
    content = f.read()

additions = {
    8008: " Inoltre, è bello ricordare che in alcune parti del mondo le stagioni sono diverse o addirittura invertite rispetto alle nostre! Scoprire i ritmi della natura ci fa sentire parte di un grande e perfetto meccanismo cosmico.",
    8009: " Anche oggi, chi visita il faro di notte dice di sentire il rumore lontano delle onde e una voce calma che sussurra antiche canzoni marinaresche nel vento freddo. Nessuno ha più paura del vecchio guardiano, diventato una leggenda amichevole per tutti gli abitanti del luogo.",
    8010: " Da quel giorno Davide trattò ogni suo piccolo amico con immenso rispetto e cura, ricordandosi sempre la notte in cui i giocattoli gli insegnarono la lezione più importante di tutte.",
}

# 8011: Il mistero della collana scomparsa (Giallo, Facile) - current 360 parole -> needs 250
additions[8011] = " \\n\\nLe indagini della giovane detective, però, non si fermarono lì. Sofia decise di esaminare la stanza con la sua speciale lente d'ingrandimento, regalatale dal nonno per il suo compleanno. Scoprì dei piccoli graffi vicino alla serratura della porta e una strana polvere bianca sul tappeto. Capì subito che non si trattava di un semplice furto, ma di un piano molto ben architettato. 'Chiunque sia stato, conosceva bene gli orari di mia madre', pensò Sofia, appuntando tutto sul suo prezioso taccuino nero.\\n\\nIl giorno seguente, Sofia interrogò il giardiniere, il signor Rossi, che aveva un alibi di ferro, e poi la cuoca, la signora Maria, che sembrava molto nervosa. Ma il vero colpo di scena avvenne quando Sofia trovò un piccolo bottone d'oro sotto il divano del salotto. Era un bottone identico a quelli della giacca del cugino Edoardo!\\n\\nSofia affrontò Edoardo con coraggio. Messo alle strette dalle prove schiaccianti, il cugino confessò tutto: aveva preso la collana solo per farla pulire in gran segreto e fare una sorpresa alla zia per il suo anniversario, ma poi l'aveva nascosta così bene da non riuscire più a recuperarla dal doppio fondo del suo armadio!\\n\\nAlla fine, il caso fu chiuso brillantemente. La collana tornò al collo della madre di Sofia, e la giovane investigatrice capì che in ogni mistero, spesso la verità è molto meno spaventosa di quello che sembra. Sofia ricevette anche un premio simbolico: un nuovo taccuino per i suoi futuri, emozionanti casi da risolvere!"

# 8012: La disastrosa cucina di zio Carlo (Umoristico, Facile) - current 360 parole -> needs 250
additions[8012] = " \\n\\nLa situazione divenne ancora più assurda quando lo zio decise di preparare anche il dessert. 'Nessun problema, faccio una torta al cioccolato in padella!', esclamò, tirando fuori dal frigo uova, farina e una quantità imprecisata di cacao amaro. Iniziò a mescolare gli ingredienti con così tanta energia che la farina creò una nuvola bianca in tutta la cucina, posandosi sui suoi capelli, sulle mensole e persino sul naso del cane Briciola, che iniziò a starnutire all'impazzata!\\n\\nQuando la 'torta in padella' fu pronta, aveva l'aspetto di un disco da hockey nero e carbonizzato. Lo zio Carlo cercò di tagliarla con un coltello, ma la crosta era così dura che il coltello rimbalzò via, facendo cadere la torta direttamente sul pavimento con un forte tonfo. Briciola si avvicinò per annusarla, ma scappò via piagnucolando.\\n\\nIo e mio fratello non riuscivamo più a smettere di ridere. Ci rotolavamo per terra tenendoci la pancia. Anche lo zio Carlo, dopo essersi guardato allo specchio tutto coperto di farina e sugo al pomodoro, scoppiò in una risata contagiosa. 'Forse', ammise infine, 'è meglio se per questa sera ordiniamo due belle pizze a domicilio'.\\n\\nAlla fine, la cena fu a base di pizza Margherita, mangiata direttamente nei cartoni, seduti sul pavimento del salotto. Anche se non avevamo mangiato i famosi spaghetti gourmet, quella fu senza dubbio una delle serate più divertenti della mia vita. Lo zio Carlo aveva dimostrato che, anche quando tutto va storto in cucina, l'importante è sapersi fare una bella risata in compagnia!"

# 8013: Caro Diario: Il mio primo giorno di scuola media (Diario, Facile) - current 291 parole -> needs 320
additions[8013] = " \\n\\nDurante l'intervallo, le cose sono andate ancora meglio. Ho tirato fuori la mia merenda (un panino col salame fantastico che mi aveva preparato la mamma) e l'ho divisa a metà con un ragazzo di nome Matteo, che si era dimenticato la sua a casa. Lui è molto simpatico, ama i videogiochi proprio come me e ha detto che domani mi farà vedere le sue carte da collezione. Credo di aver trovato il mio primo vero amico qui alle medie!\\n\\nDopo l'intervallo, abbiamo avuto due ore di Scienze con la professoressa Verdi. È entrata in classe con un vero telescopio e ci ha spiegato come funzionano le lenti per osservare le stelle. È stato incredibile! Ci ha anche detto che la prossima settimana andremo tutti nel laboratorio di scienze per fare degli esperimenti con i liquidi colorati. Non vedo l'ora, mi sento già un piccolo scienziato.\\n\\nQuando la campanella finale è suonata, mi sono sentito quasi dispiaciuto di dover tornare a casa. Mentre camminavo verso il cancello, ho visto la mamma che mi aspettava sorridente. Appena mi ha visto, mi ha chiesto come fosse andata e io le ho risposto con un enorme 'Benissimo!'.\\n\\nOra sono qui in camera mia, seduto alla scrivania. Guardo lo zaino preparato per domani e non ho più quel nodo allo stomaco che avevo ieri sera. So che ci saranno tante cose difficili da studiare, tanti compiti da fare e magari qualche interrogazione che mi farà paura, ma so anche che sarà un'avventura stupenda.\\n\\nCaro Diario, credo proprio che questa nuova scuola mi piacerà un sacco. A domani per nuove scoperte! Buonanotte!"

# 8014: Una lettera per il mio amico Luca (Lettera, Facile) - current 265 parole -> needs 350
additions[8014] = " \\n\\nA proposito, ti ricordi di quel vecchio campetto di basket dove andavamo sempre a giocare dopo la scuola? Hanno finalmente sistemato i canestri! Ieri ci sono andato con mio fratello maggiore e abbiamo fatto una partita bellissima. Ho anche imparato a tirare da tre punti, anche se metà delle volte la palla non tocca nemmeno il ferro. Devi assolutamente tornare presto così ti faccio vedere i miei miglioramenti. Sono sicuro che questa volta riuscirò a batterti!\\n\\nQui in città le cose sono un po' noiose senza di te. La scuola è ricominciata e la professoressa di matematica ci ha già dato una montagna di compiti. Meno male che c'è il nostro gruppo di amici che mi tiene compagnia. Ieri siamo andati in gelateria e abbiamo mangiato una coppa enorme. Ho preso il gusto al pistacchio che piace tanto a te e mi sono sentito un po' malinconico.\\n\\nSpero che i tuoi nuovi compagni di classe siano simpatici e che i professori non siano troppo severi. Hai già esplorato bene il tuo nuovo quartiere? C'è un parco grande dove andare in bicicletta? Mi raccomando, tieni gli occhi aperti e cerca dei posti segreti da mostrarmi quando verrò a trovarti. Magari possiamo organizzare una tendata in giardino la prossima estate, proprio come facevamo l'anno scorso! Sarebbe fantastico.\\n\\nNon dimenticare di mandarmi qualche foto della tua nuova camera e magari del tuo nuovo gattino. Mi avevi detto che forse i tuoi genitori ti avrebbero preso un cucciolo, spero sia vero! Aspetto con ansia la tua risposta. Scrivimi presto e raccontami ogni minimo dettaglio della tua nuova vita.\\n\\nTi mando un abbraccio forte forte!\\n\\nIl tuo migliore amico,\\nMarco"

def expand_texts():
    global content
    for id_val, addition in additions.items():
        # find the exact text field
        pattern = r'("id": ' + str(id_val) + r',.*?"text": ")(.*?)(")'
        match = re.search(pattern, content, re.DOTALL)
        if match:
            old_text = match.group(2)
            new_text = old_text + addition
            # we need to be careful with escaping quotes or backslashes if there were any, 
            # but regex replacement might misinterpret \n.
            # Using str.replace is safer for exactly replacing the match.
            full_old = match.group(0)
            full_new = match.group(1) + new_text + match.group(3)
            content = content.replace(full_old, full_new)
        else:
            print(f"Could not find ID {id_val}")
            
expand_texts()

with open('js/exercises.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated texts successfully.")

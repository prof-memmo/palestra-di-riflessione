import json
import re

def main():
    path = "js/exercises.js"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    start_str = "window.exercisesData = "
    start_idx = content.find(start_str)
    if start_idx == -1:
        print("Could not find window.exercisesData")
        return
        
    start_idx += len(start_str)
    end_idx = content.rfind("};") + 1
    
    json_str = content[start_idx:end_idx]
    
    try:
        data = json.loads(json_str)
    except Exception as e:
        print("JSON parse error:", e)
        return
        
    acc_array = data.get("accoglienza", [])
    
    for ex in acc_array:
        if ex["id"] == 10007:
            ex["type"] = "personality-test"
            ex["instruction"] = "Rispondi sinceramente a queste domande per scoprire il tuo rapporto con il tempo libero."
            ex["questions"] = [
                {"question": "Come preferisci trascorrere il tuo tempo libero?", "options": ["Praticando sport o attività all'aperto", "Leggendo, guardando film o giocando ai videogiochi", "Uscendo con gli amici"]},
                {"question": "Quando hai un momento libero inaspettato, qual è la tua prima reazione?", "options": ["Cerco subito qualcosa di attivo da fare", "Ne approfitto per rilassarmi e non fare nulla", "Chiamo qualcuno per chiacchierare"]},
                {"question": "Quale tra queste attività ti dà più soddisfazione?", "options": ["Vincere una competizione o superare un limite fisico", "Imparare qualcosa di nuovo da un libro o documentario", "Organizzare una festa o un'uscita di gruppo"]}
            ]
            ex["profiles"] = {
                "A": "Sei una persona DINAMICA! Il tuo tempo libero è sempre in movimento. Questo ti dà grande energia, cerca di portarla anche nello studio!",
                "B": "Sei una persona RIFLESSIVA! Ami nutrire la tua mente anche quando ti rilassi. Hai un'ottima predisposizione per le materie di studio teoriche.",
                "C": "Sei una persona SOCIEVOLE! Per te il tempo libero significa stare insieme agli altri. Il lavoro di gruppo sarà il tuo punto forte a scuola."
            }
            if "answer" in ex: del ex["answer"]
            
        elif ex["id"] == 10008:
            ex["type"] = "personality-test"
            ex["instruction"] = "Non ci sono risposte giuste o sbagliate, scegli l'opzione che ti descrive meglio!"
            ex["questions"] = [
                {"question": "Di fronte a un ostacolo imprevisto, come reagisci solitamente?", "options": ["Mi scoraggio facilmente e cerco aiuto", "Provo ad affrontarlo subito con determinazione", "Mi prendo del tempo per analizzare la situazione"]},
                {"question": "Quale ritieni sia il tuo pregio principale in ambito scolastico?", "options": ["L'impegno e la costanza", "La creatività e le idee originali", "La capacità di ascoltare e collaborare"]},
                {"question": "E quale invece consideri il tuo difetto più grande?", "options": ["Essere troppo testardo/a", "Essere spesso disordinato/a o distratto/a", "Essere troppo timido/a o insicuro/a"]}
            ]
            ex["profiles"] = {
                "A": "Sei un tipo TENACE ma a volte un po' insicuro. La costanza è la tua arma segreta: credi di più in te stesso/a!",
                "B": "Sei uno spirito CREATIVO! L'energia non ti manca, ma cerca di organizzare meglio il tuo disordine per dare il massimo.",
                "C": "Sei una persona PACATA e RIFLESSIVA. Collabori bene con gli altri, ricorda solo di far sentire anche la tua voce!"
            }
            if "answer" in ex: del ex["answer"]

        elif ex["id"] == 10009:
            ex["type"] = "personality-test"
            ex["instruction"] = "Rifletti sulle tue esperienze passate alla scuola primaria."
            ex["questions"] = [
                {"question": "Qual è il ricordo più bello che porti dalla scuola primaria?", "options": ["Le ricreazioni e le gite con i compagni", "I momenti in cui ho preso un bel voto in una materia difficile", "L'affetto per i miei vecchi maestri"]},
                {"question": "Rispetto agli anni passati, come ti senti ora in questa nuova scuola?", "options": ["Molto più grande e responsabile", "Un po' nostalgico/a ma curioso/a", "Un po' spaventato/a dalle novità"]},
                {"question": "Quale abitudine della scuola primaria vorresti mantenere?", "options": ["Il gioco e il divertimento durante le pause", "L'ordine e la precisione nel fare i compiti", "L'aiuto reciproco tra compagni di classe"]}
            ]
            ex["profiles"] = {
                "A": "Sei legato/a all'aspetto SOCIALE della scuola. I ricordi con i compagni ti danno forza per affrontare le nuove sfide con entusiasmo!",
                "B": "Sei orientato/a all'IMPEGNO personale. Ti piace crescere e affrontare cose nuove, mantenendo un forte senso di responsabilità.",
                "C": "Hai un cuore NOSTALGICO ma sei pronto/a ad aprirti. Continua a coltivare l'empatia che hai imparato negli anni passati."
            }
            if "answer" in ex: del ex["answer"]

        elif ex["id"] == 10010:
            ex["type"] = "personality-test"
            ex["instruction"] = "Valuta come hai affrontato i momenti difficili e quelli felici."
            ex["questions"] = [
                {"question": "Quando in passato non sei riuscito/a in un compito, cosa hai fatto?", "options": ["Mi sono arreso/a pensando di non essere capace", "Ho chiesto aiuto per capire i miei errori", "Ho provato e riprovato da solo/a finché non ce l'ho fatta"]},
                {"question": "Come celebri di solito un successo scolastico?", "options": ["Lo racconto subito a tutti con entusiasmo", "Ne sono felice ma lo tengo per me o per la mia famiglia", "Inizio subito a pensare al prossimo obiettivo"]},
                {"question": "Quale materia in passato ti ha messo più in difficoltà?", "options": ["Le materie logico-matematiche", "Le materie umanistiche e di scrittura", "Le attività pratiche o motorie"]}
            ]
            ex["profiles"] = {
                "A": "Il tuo profilo: EMOTIVO. Vivi successi e difficoltà in modo intenso. Impara a non arrenderti e a chiedere aiuto quando serve!",
                "B": "Il tuo profilo: EQUILIBRATO. Sai gioire dei successi ma rimani con i piedi per terra. Continua ad analizzare i tuoi errori per migliorare.",
                "C": "Il tuo profilo: INDIPENDENTE. Hai una forte motivazione interna. Sei tenace e determinato/a, un'ottima base per il futuro."
            }
            if "answer" in ex: del ex["answer"]

        elif ex["id"] == 10011:
            ex["type"] = "personality-test"
            ex["instruction"] = "Identifica le emozioni che provi di fronte a questo nuovo inizio."
            ex["questions"] = [
                {"question": "Come ti senti pensando all'inizio di questo nuovo anno scolastico?", "options": ["Molto emozionato/a e non vedo l'ora di iniziare", "Abbastanza tranquillo/a, prenderò le cose come vengono", "Un po' in ansia per il carico di studio e i professori nuovi"]},
                {"question": "Cosa ti preoccupa di più della nuova scuola?", "options": ["Non riuscire a fare amicizia", "Prendere brutti voti o non capire le spiegazioni", "Le regole più severe e l'organizzazione"]},
                {"question": "Cosa ti aspetti dai tuoi nuovi compagni di classe?", "options": ["Di trovare amici con cui divertirmi", "Di trovare persone con cui collaborare nello studio", "Spero solo che siano simpatici e tranquilli"]}
            ]
            ex["profiles"] = {
                "A": "Il tuo approccio è ENTUSIASTA! Questa tua energia positiva ti aiuterà moltissimo a fare nuove amicizie e superare i primi ostacoli.",
                "B": "Il tuo approccio è PRAGMATICO. Prendi le cose con calma e punti alla collaborazione: un'ottima strategia per non stressarsi troppo.",
                "C": "Il tuo approccio è CAUTO. È normale avere un po' di ansia per le novità, ma non preoccuparti: col tempo tutto diventerà familiare!"
            }
            if "answer" in ex: del ex["answer"]

        elif ex["id"] == 10013:
            ex["type"] = "personality-test"
            ex["instruction"] = "Scopri che tipo di studente sei e cosa ti aspetti dal tuo metodo di studio."
            ex["questions"] = [
                {"question": "Come organizzi di solito il tuo studio pomeridiano?", "options": ["Faccio tutto all'ultimo minuto", "Seguo una scaletta precisa e cerco di portarmi avanti", "Studio un po', poi faccio pause frequenti"]},
                {"question": "Quale strumento trovi più utile per memorizzare?", "options": ["Ripetere ad alta voce", "Fare schemi, mappe e riassunti scritti", "Ascoltare le spiegazioni o studiare con qualcuno"]},
                {"question": "Cosa speri di migliorare in futuro nel tuo metodo?", "options": ["Voglio diventare più veloce a leggere e studiare", "Voglio imparare a concentrarmi senza distrazioni", "Voglio capire come prendere appunti in modo efficace"]}
            ]
            ex["profiles"] = {
                "A": "Il tuo metodo è ISTINTIVO e uditivo. Cerca di non ridurti sempre all'ultimo minuto e sfrutta la tua capacità di memorizzare ripetendo!",
                "B": "Il tuo metodo è VISIVO E ORGANIZZATO. Gli schemi sono i tuoi migliori alleati. Continua così e otterrai ottimi risultati.",
                "C": "Il tuo metodo è COLLABORATIVO. Impari meglio con gli altri. Impara a gestire le pause per non perdere la concentrazione."
            }
            if "answer" in ex: del ex["answer"]

        elif ex["id"] == 10014:
            ex["type"] = "personality-test"
            ex["instruction"] = "Definisci il profilo del tuo 'insegnante ideale'."
            ex["questions"] = [
                {"question": "Qual è la qualità più importante per un professore?", "options": ["Essere simpatico e fare battute", "Spiegare in modo chiaro e comprensibile", "Essere giusto e non fare favoritismi"]},
                {"question": "Come preferisci che il professore reagisca se sbagli una risposta?", "options": ["Che mi incoraggi e mi aiuti a correggermi dolcemente", "Che mi spieghi subito l'errore in modo diretto", "Che passi la domanda a qualcun altro per non mettermi in imbarazzo"]},
                {"question": "Cosa apprezzi di più in una lezione?", "options": ["I lavori di gruppo e i giochi didattici", "Gli esempi pratici e collegati alla realtà", "Il silenzio e l'ordine per poter prendere appunti bene"]}
            ]
            ex["profiles"] = {
                "A": "Cerchi un prof EMPATICO. Per te l'ambiente sereno e il rapporto umano sono fondamentali per imparare bene.",
                "B": "Cerchi un prof CHIARO E PRAGMATICO. Vuoi capire bene le cose e apprezzi la logica e gli esempi concreti.",
                "C": "Cerchi un prof AUTOREVOLE E GIUSTO. L'ordine e l'imparzialità ti danno sicurezza per poter dare il meglio."
            }
            if "answer" in ex: del ex["answer"]

        elif ex["id"] == 10015:
            ex["type"] = "personality-test"
            ex["instruction"] = "Che tipo di lettore sei?"
            ex["questions"] = [
                {"question": "Se devi scegliere un libro da leggere, cosa guardi per prima cosa?", "options": ["La copertina e il titolo", "La trama scritta sul retro", "Se è un genere che conosco (es. fantasy, avventura)"]},
                {"question": "Dove preferisci leggere?", "options": ["A letto, prima di dormire", "Sul divano o all'aperto durante il giorno", "A scuola o sui mezzi di trasporto"]},
                {"question": "Cosa fai se un libro non ti piace dopo le prime pagine?", "options": ["Lo abbandono e ne cerco un altro", "Mi sforzo di arrivare almeno a metà per dargli un'opportunità", "Lo leggo comunque fino alla fine perché non mi piace lasciare le cose a metà"]}
            ]
            ex["profiles"] = {
                "A": "Sei un lettore ISTINTIVO. Ti lasci catturare dalle emozioni e dalle atmosfere. Se un libro ti prende, lo divori in poche ore!",
                "B": "Sei un lettore RIFLESSIVO E COSTANTE. Dai sempre una possibilità alle storie e ti piace analizzare le trame in profondità.",
                "C": "Sei un lettore METODICO. Preferisci andare sul sicuro con i tuoi generi preferiti e porti sempre a termine ciò che inizi."
            }
            if "answer" in ex: del ex["answer"]

    # Make sure to remove individual answer keys from questions array if present
    for ex in acc_array:
        if ex.get("type") == "personality-test":
            for q in ex.get("questions", []):
                if "answer" in q:
                    del q["answer"]

    updated_json_str = json.dumps(data, indent=4, ensure_ascii=False)
    
    new_content = content[:start_idx] + updated_json_str + content[end_idx:]
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(new_content)
    
    print("exercises.js updated successfully.")

if __name__ == "__main__":
    main()

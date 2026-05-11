import json

with open('js/exercises.js', 'r', encoding='utf-8') as f:
    content = f.read()

prefix = "window.exercisesData = "
if content.startswith(prefix):
    json_str = content[len(prefix):]
    
    # Remove the module.exports part if it exists
    end_marker = "if (typeof module !== 'undefined')"
    idx = json_str.rfind(end_marker)
    if idx != -1:
        suffix = json_str[idx:]
        json_str = json_str[:idx]
    else:
        suffix = ""
        
    json_str = json_str.strip()
    if json_str.endswith(";"):
        json_str = json_str[:-1]
    
    try:
        data = json.loads(json_str)
        
        # ESPOSIZIONE
        esposizione = [
            {
                "id": 8301,
                "title": "CONSIGLI PER UNA CORRETTA ESPOSIZIONE ORALE 🗣️",
                "type": "multiple-choice",
                "instruction": "LEGGI i consigli e rispondi alle domande sulle regole di base dell'esposizione.",
                "text": "USARE FRASI BREVI: INIZIARE LA FRASE CON IL <span style='color: #2980b9; font-weight: bold;'>SOGGETTO</span>, PROSEGUIRE CON IL <span style='color: #e74c3c; font-weight: bold;'>VERBO</span> E, SUCCESSIVAMENTE, CON I <span style='color: #27ae60; font-weight: bold;'>COMPLEMENTI</span>.<br><br>EVITARE INIZIARE FRASI O DI PROPORRE AL LORO INTERNO CONGIUNZIONI, ESCLAMAZIONI E TERMINI COLLOQUIALI COME <span style='color: #8e44ad; font-weight: bold;'>\"ALLORA, INSOMMA, EHM, BEH, AH, EH, DICIAMO\"</span>.",
                "questions": [
                    {
                        "question": "1. Con quale elemento è consigliabile iniziare una frase breve?",
                        "options": ["CON IL COMPLEMENTO", "CON IL SOGGETTO"],
                        "answer": "CON IL SOGGETTO"
                    },
                    {
                        "question": "2. Dopo il soggetto, quale elemento dovrebbe seguire?",
                        "options": ["IL VERBO", "UNA CONGIUNZIONE"],
                        "answer": "IL VERBO"
                    },
                    {
                        "question": "3. Quali termini colloquiali è bene evitare durante l'esposizione?",
                        "options": ["ALLORA, INSOMMA, EHM", "TUTTAVIA, PERTANTO"],
                        "answer": "ALLORA, INSOMMA, EHM"
                    }
                ]
            },
            {
                "id": 8302,
                "title": "SOSTITUIRE I TERMINI GENERICI 🔄",
                "type": "multiple-choice",
                "instruction": "SOSTITUISCI i nomi e i verbi generici con termini più appropriati.",
                "text": "EVITARE L'USO DI TERMINI GENERICI COME <span style='color: #d35400; font-weight: bold;'>\"COSA\"</span> O <span style='color: #d35400; font-weight: bold;'>\"ROBA\"</span> MA CERCARE IL VOCABOLO GIUSTO PER SPECIFICARE MEGLIO L'OGGETTO DEL DISCORSO.<br><br>EVITARE RIPETIZIONI E SOSTITUIRLE CON <span style='color: #16a085; font-weight: bold;'>SINONIMI</span>. NON AVERE FRETTA NEL PARLARE.",
                "questions": [
                    {
                        "question": "1. Sostituisci il termine 'roba' nella frase: 'Non toccare la mia roba sulla scrivania'.",
                        "options": ["IL MIO MATERIALE", "LA MIA COSA"],
                        "answer": "IL MIO MATERIALE"
                    },
                    {
                        "question": "2. Quale termine specifico sostituisce 'roba' in 'Questa roba costa troppo' (riferito a un capo d'abbigliamento)?",
                        "options": ["QUESTO INDUMENTO", "QUESTO COMPLEMENTO"],
                        "answer": "QUESTO INDUMENTO"
                    },
                    {
                        "question": "3. Come potresti evitare la ripetizione del verbo 'dire' in un discorso?",
                        "options": ["USANDO SINONIMI COME AFFERMARE, SOSTENERE, RIPETERE", "PARLANDO PIÙ VELOCEMENTE"],
                        "answer": "USANDO SINONIMI COME AFFERMARE, SOSTENERE, RIPETERE"
                    },
                    {
                        "question": "4. Sostituisci il verbo generico 'fare' nella frase 'Devo fare un tema'.",
                        "options": ["DEVO SVOLGERE UN TEMA", "DEVO DIRE UN TEMA"],
                        "answer": "DEVO SVOLGERE UN TEMA"
                    }
                ]
            },
            {
                "id": 8303,
                "title": "ERRORI COMUNI E TERMINI DA EVITARE 🚫",
                "type": "multiple-choice",
                "instruction": "RISPONDI alle domande sugli errori comuni di esposizione da evitare.",
                "text": "EVITARE DI ESPORRE USANDO IL <span style='color: #e67e22; font-weight: bold;'>\"TU GENERICO\"</span>. È POSSIBILE USARE LA COSTRUZIONE IMPERSONALE CON IL <span style='color: #2980b9; font-weight: bold;'>\"SI\"</span> (ESEMPIO \"SI VA\", \"SI SCENDE\" AL POSTO DI \"SE TU VAI\").<br>EVITARE DI USARE IL PLURALE MAIESTATICO. SI PUÒ SOSTITUIRE <span style='color: #e74c3c; font-weight: bold;'>\"DICIAMO\"</span> CON <span style='color: #27ae60; font-weight: bold;'>\"SI DICE\"</span>.<br><br>LA PAROLA <span style='color: #8e44ad; font-weight: bold;'>\"TIPO\"</span> SIGNIFICA \"TIPOLOGIA, CAMPIONE, PROTOTIPO\" E NON \"PER ESEMPIO\". LA PAROLA <span style='color: #c0392b; font-weight: bold;'>\"CIOÈ\"</span> SI PUÒ SOSTITUIRE CON \"OSSIA\".",
                "questions": [
                    {
                        "question": "1. Invece di dire 'Se tu scendi le scale in fretta cadi', è meglio usare:",
                        "options": ["SE SI SCENDONO LE SCALE IN FRETTA SI CADE", "SE NOI SCENDIAMO LE SCALE CADREMO"],
                        "answer": "SE SI SCENDONO LE SCALE IN FRETTA SI CADE"
                    },
                    {
                        "question": "2. Il termine 'tipo' dovrebbe essere usato per indicare:",
                        "options": ["UNA TIPOLOGIA O MODELLO", "UN ESEMPIO (TIPO COSÌ...)"],
                        "answer": "UNA TIPOLOGIA O MODELLO"
                    },
                    {
                        "question": "3. Con quale parola possiamo sostituire 'cioè' per non ripeterla troppo?",
                        "options": ["OSSIA", "DICIAMO"],
                        "answer": "OSSIA"
                    },
                    {
                        "question": "4. Invece di usare il 'tu generico', si consiglia la costruzione impersonale con il:",
                        "options": ["PRONOME 'SI'", "PRONOME 'NOI'"],
                        "answer": "PRONOME 'SI'"
                    }
                ]
            },
            {
                "id": 8304,
                "title": "FORNIRE LE INFORMAZIONI INDISPENSABILI E GAME TIME ⏳",
                "type": "multiple-choice",
                "instruction": "COMPLETA il modulo applicando le nozioni chiave dell'esposizione.",
                "text": "FORNIRE TUTTE LE <span style='color: #2980b9; font-weight: bold;'>INFORMAZIONI INDISPENSABILI</span>: CHI? CHE COSA? DOVE? QUANDO? PERCHÉ?<br><br>I TERMINI <span style='color: #8e44ad; font-weight: bold;'>\"TEORICAMENTE\", \"PRATICAMENTE\" E \"SOSTANZIALMENTE\"</span> SIGNIFICANO IN TEORIA, IN PRATICA E NELLA SOSTANZA; BISOGNA STUDIARE IL CONTESTO. SE NE SCONSIGLIA L'USO SE NON DOPO ATTENTA VALUTAZIONE.<br><br><span style='color: #e74c3c; font-weight: bold;'>LABORATORIO 🎤:</span> PARLA CON I TUOI COETANEI E CON GLI ADULTI CERCANDO DI SEGUIRE QUESTI CONSIGLI. QUANDO SEI INDECISO O NON HAI CAPITO, NON ESITARE A CHIEDERE SPIEGAZIONI CON GARBO.<br><br><span style='color: #f39c12; font-weight: bold;'>GAME TIME 🎲:</span> RISPONDI ALLE DOMANDE MA NON PUOI DIRE NO, SÌ E NON SO.",
                "questions": [
                    {
                        "question": "1. Le 'informazioni indispensabili' in una esposizione o in un articolo corrispondono:",
                        "options": ["ALLA REGOLA DELLE 5 W (CHI, COSA, QUANDO, DOVE, PERCHÉ)", "ALL'USO DEI SINONIMI"],
                        "answer": "ALLA REGOLA DELLE 5 W (CHI, COSA, QUANDO, DOVE, PERCHÉ)"
                    },
                    {
                        "question": "2. I termini come 'praticamente' e 'sostanzialmente':",
                        "options": ["SONO SPESSO INTERCALARI IMPROPRI E VANNO USATI CON ATTENZIONE", "SONO SEMPRE LA SCELTA MIGLIORE PER INIZIARE"],
                        "answer": "SONO SPESSO INTERCALARI IMPROPRI E VANNO USATI CON ATTENZIONE"
                    },
                    {
                        "question": "3. Se durante un'esposizione o un dialogo non hai capito un passaggio, dovresti:",
                        "options": ["CHIEDERE SPIEGAZIONI CON GARBO", "FARE FINTA DI AVERE CAPITO"],
                        "answer": "CHIEDERE SPIEGAZIONI CON GARBO"
                    }
                ]
            }
        ]

        # DIZIONARIO
        dizionario = [
            {
                "id": 8401,
                "title": "USO DEL DIZIONARIO: ABBREVIAZIONI E OMONIMI 📖",
                "type": "multiple-choice",
                "instruction": "RISPONDI sulle regole principali per la consultazione del vocabolario.",
                "text": "USARE IL <span style='color: #2980b9; font-weight: bold;'>VOCABOLARIO</span> PER AUMENTARE IL LESSICO. Nel dizionario, le parole sono disposte secondo l'<span style='color: #27ae60; font-weight: bold;'>ORDINE ALFABETICO</span>.<br><br>La voce contiene spesso numerose <span style='color: #d35400; font-weight: bold;'>ABBREVIAZIONI</span>. Per facilitare la consultazione, nelle pagine introduttive si trova un elenco (es. <i>s.m. = sostantivo maschile</i>, <i>fig. = figurato</i>).<br><br>Fare attenzione agli <span style='color: #8e44ad; font-weight: bold;'>OMONIMI</span> (parole con forma identica ma significato completamente diverso). Il dizionario le distingue con dei numeri (es. fiera¹, fiera²).",
                "questions": [
                    {
                        "question": "1. In che ordine si trovano le parole in un dizionario?",
                        "options": ["IN ORDINE ALFABETICO", "IN ORDINE DI LUNGHEZZA"],
                        "answer": "IN ORDINE ALFABETICO"
                    },
                    {
                        "question": "2. Cosa significa solitamente l'abbreviazione 's.m.' nel dizionario?",
                        "options": ["SOSTANTIVO MASCHILE", "SENSO METAforico"],
                        "answer": "SOSTANTIVO MASCHILE"
                    },
                    {
                        "question": "3. Due parole che si scrivono allo stesso modo ma hanno significati diversi sono dette:",
                        "options": ["OMONIMI", "SINONIMI"],
                        "answer": "OMONIMI"
                    },
                    {
                        "question": "4. Come fa il dizionario a distinguere tra due omonimi (es. fiera animale e fiera mercato)?",
                        "options": ["USA DEI NUMERETTI IN APICE (ES. 1, 2)", "METTE LA SECONDA IN CORSIVO"],
                        "answer": "USA DEI NUMERETTI IN APICE (ES. 1, 2)"
                    }
                ]
            },
            {
                "id": 8402,
                "title": "FUNZIONI GRAMMATICALI NEL VOCABOLARIO 🔍",
                "type": "multiple-choice",
                "instruction": "COMPRENDI la struttura di una voce del vocabolario.",
                "text": "Il dizionario indica sempre la <span style='color: #e74c3c; font-weight: bold;'>FUNZIONE GRAMMATICALE</span> di una parola (articolo, nome, verbo, ecc.).<br><br>Se una parola svolge PIÙ di una funzione grammaticale, il dizionario le riporta tutte distinguendole con un <span style='color: #16a085; font-weight: bold;'>NUMERO ROMANO</span> (I., II., III.). Ad esempio, la parola 'potere' può essere:<br><b>I.</b> s.m. (sostantivo maschile, es. 'avere il potere')<br><b>II.</b> v.intr. (verbo intransitivo, es. 'potere fare qualcosa').",
                "questions": [
                    {
                        "question": "1. Cosa indicano i numeri romani (I, II) all'interno della stessa voce del dizionario?",
                        "options": ["DIVERSE FUNZIONI GRAMMATICALI DELLA STESSA PAROLA", "DIVERSE LINGUE DI ORIGINE DELLA PAROLA"],
                        "answer": "DIVERSE FUNZIONI GRAMMATICALI DELLA STESSA PAROLA"
                    },
                    {
                        "question": "2. Se leggi 'v.tr.', la parola ha funzione di:",
                        "options": ["VERBO TRANSITIVO", "VOCABOLO TRADOTTO"],
                        "answer": "VERBO TRANSITIVO"
                    },
                    {
                        "question": "3. Leggendo 'agg.', si intende che la parola funziona come:",
                        "options": ["AGGETTIVO", "AVVERBIO"],
                        "answer": "AGGETTIVO"
                    },
                    {
                        "question": "4. Se il dizionario scrive 'prep.', si tratta di una:",
                        "options": ["PREPOSIZIONE", "PRONUNCIA"],
                        "answer": "PREPOSIZIONE"
                    }
                ]
            }
        ]
        
        if 'produzione' not in data:
            data['produzione'] = {}
        data['produzione']['esposizione'] = esposizione
        data['produzione']['dizionario'] = dizionario
        
        new_json_str = json.dumps(data, indent=4)
        new_content = prefix + new_json_str + ";\n\n" + suffix
        
        with open('js/exercises.js', 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Success")
    except Exception as e:
        print("Error:", str(e))
else:
    print("Prefix not found")

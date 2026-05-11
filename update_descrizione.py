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
        descrizione = {
            "persona": [
                {
                    "id": 8201,
                    "title": "IL TESTO DESCRITTIVO E LA PERSONA 👤",
                    "type": "multiple-choice",
                    "instruction": "LEGGI la teoria e rispondi alle domande sulla descrizione.",
                    "text": "La <span style='color: #2980b9; font-weight: bold;'>DESCRIZIONE</span> è un testo che traduce in parole una realtà percepita attraverso i <span style='color: #d35400; font-weight: bold;'>SENSI</span> (vista, udito, olfatto, tatto e gusto). Può essere <span style='color: #27ae60; font-weight: bold;'>OGGETTIVA</span> (descrive senza giudicare) oppure <span style='color: #e84393; font-weight: bold;'>SOGGETTIVA</span> (filtrata da impressioni e stati d'animo).<br><br>Per descrivere una <span style='color: #8e44ad; font-weight: bold;'>PERSONA</span> oggettivamente, indichiamo: età, aspetto fisico, abbigliamento. Soggettivamente, indichiamo le impressioni che suscita.",
                    "questions": [
                        {
                            "question": "1. Cosa usa la descrizione per percepire la realtà?",
                            "options": ["I SENSI", "LA FANTASIA"],
                            "answer": "I SENSI"
                        },
                        {
                            "question": "2. Una descrizione oggettiva:",
                            "options": ["NON GIUDICA", "ESPRIME OPINIONI"],
                            "answer": "NON GIUDICA"
                        },
                        {
                            "question": "3. L'abbigliamento fa parte della descrizione:",
                            "options": ["OGGETTIVA", "SOGGETTIVA"],
                            "answer": "OGGETTIVA"
                        },
                        {
                            "question": "4. Le impressioni personali fanno parte della descrizione:",
                            "options": ["SOGGETTIVA", "OGGETTIVA"],
                            "answer": "SOGGETTIVA"
                        }
                    ]
                },
                {
                    "id": 8202,
                    "title": "I DETTAGLI DEL CORPO E DEL COMPORTAMENTO 👁️",
                    "type": "multiple-choice",
                    "instruction": "SCEGLI la caratteristica corretta per ogni domanda in base a come descriveresti una persona.",
                    "text": "Quando descriviamo una persona, dobbiamo chiederci:<br>- <b>Come parla?</b> (sottovoce, concitato, balbettando)<br>- <b>Come si muove?</b> (lento, goffo, scattante)<br>- <b>Qual è il suo umore?</b> (allegro, nervoso, felice).",
                    "questions": [
                        {
                            "question": "1. Se una persona parla 'sottovoce', stiamo descrivendo:",
                            "options": ["LA SUA VOCE", "IL SUO UMORE"],
                            "answer": "LA SUA VOCE"
                        },
                        {
                            "question": "2. 'Scattante e veloce' descrive:",
                            "options": ["COME SI MUOVE", "IL SUO CARATTERE"],
                            "answer": "COME SI MUOVE"
                        },
                        {
                            "question": "3. 'Nervoso e triste' indicano:",
                            "options": ["L'UMORE", "L'ASPETTO FISICO"],
                            "answer": "L'UMORE"
                        },
                        {
                            "question": "4. Il 'volto scavato' fa parte di:",
                            "options": ["ASPETTO FISICO", "ABITUDINI"],
                            "answer": "ASPETTO FISICO"
                        }
                    ]
                },
                {
                    "id": 8203,
                    "title": "FIGURE RETORICHE: SIMILITUDINE E METAFORA 🔗",
                    "type": "multiple-choice",
                    "instruction": "INDICA se la frase contiene una SIMILITUDINE o una METAFORA.",
                    "text": "La <span style='color: #2980b9; font-weight: bold;'>SIMILITUDINE</span> paragona due cose usando parole come 'COME', 'SEMBRA', 'PARE' (es. <i>Lucio è astuto come una volpe</i>).<br>La <span style='color: #d35400; font-weight: bold;'>METAFORA</span> è una similitudine abbreviata, senza il 'come' (es. <i>Il mare è un giardino fiorito</i>, <i>Lucio è un leone</i>).",
                    "questions": [
                        {
                            "question": "1. 'Carla è così veloce che sembra una gazzella'. È una:",
                            "options": ["SIMILITUDINE", "METAFORA"],
                            "answer": "SIMILITUDINE"
                        },
                        {
                            "question": "2. 'Quell'uomo è un orso'. È una:",
                            "options": ["METAFORA", "SIMILITUDINE"],
                            "answer": "METAFORA"
                        },
                        {
                            "question": "3. 'I suoi capelli sono d'oro'. È una:",
                            "options": ["METAFORA", "SIMILITUDINE"],
                            "answer": "METAFORA"
                        },
                        {
                            "question": "4. 'Canta come un usignolo'. È una:",
                            "options": ["SIMILITUDINE", "METAFORA"],
                            "answer": "SIMILITUDINE"
                        }
                    ]
                },
                {
                    "id": 8204,
                    "title": "LABORATORIO DI SCRITTURA: DRACULA E LA SIRENA 🧛‍♂️🧜‍♀️",
                    "type": "multiple-choice",
                    "instruction": "OSSERVA l'immagine e rispondi alle domande per preparare la tua descrizione.",
                    "text": "<img src='assets/dracula_sirena.png' style='width: 100%; max-width: 500px; display: block; margin: 0 auto; border-radius: 15px; margin-bottom: 1.5rem;'><br><span style='color: #e74c3c; font-weight: bold;'>A CASA:</span> descrivere in 100-150 parole UNO dei due personaggi, inventando il carattere, il comportamento, le abitudini, le relazioni e i gesti tipici.",
                    "questions": [
                        {
                            "question": "1. Quale aspetto fisico è tipico di Dracula?",
                            "options": ["PALLIDO CON CANINI APPUNTITI", "SCAGLIE E PINNA COLORATA"],
                            "answer": "PALLIDO CON CANINI APPUNTITI"
                        },
                        {
                            "question": "2. L'ambiente naturale della sirena è:",
                            "options": ["SOTTOMARINO", "UN CASTELLO OSCURO"],
                            "answer": "SOTTOMARINO"
                        },
                        {
                            "question": "3. Il mantello nero di Dracula fa parte di:",
                            "options": ["ABBIGLIAMENTO", "COMPORTAMENTO"],
                            "answer": "ABBIGLIAMENTO"
                        },
                        {
                            "question": "4. Un tipico 'gesto' di un vampiro potrebbe essere:",
                            "options": ["NASCONDERSI DALLA LUCE DEL SOLE", "NUOTARE CON I DELFINI"],
                            "answer": "NASCONDERSI DALLA LUCE DEL SOLE"
                        }
                    ]
                }
            ],
            "animale": [
                {
                    "id": 8211,
                    "title": "LA DESCRIZIONE DI UN ANIMALE 🐾",
                    "type": "multiple-choice",
                    "instruction": "COMPLETA le frasi scegliendo l'opzione corretta sulla descrizione degli animali.",
                    "text": "Nella descrizione <span style='color: #27ae60; font-weight: bold;'>OGGETTIVA</span> di un animale indichiamo: la SPECIE, l'AMBIENTE, l'ASPETTO fisico, il VERSO, le ABITUDINI e il COMPORTAMENTO.<br>Nella descrizione <span style='color: #e84393; font-weight: bold;'>SOGGETTIVA</span> aggiungiamo le IMPRESSIONI che suscita in noi e le opinioni.",
                    "questions": [
                        {
                            "question": "1. Indicare la 'specie' (es. mammifero, rettile) è un'informazione:",
                            "options": ["OGGETTIVA", "SOGGETTIVA"],
                            "answer": "OGGETTIVA"
                        },
                        {
                            "question": "2. 'Secondo me il gatto è molto affettuoso' è una descrizione:",
                            "options": ["SOGGETTIVA", "OGGETTIVA"],
                            "answer": "SOGGETTIVA"
                        },
                        {
                            "question": "3. Il 'verso' (es. abbaiare, miagolare) fa parte del:",
                            "options": ["COMPORTAMENTO / OGGETTIVO", "IMPRESSIONE / SOGGETTIVA"],
                            "answer": "COMPORTAMENTO / OGGETTIVO"
                        },
                        {
                            "question": "4. L'habitat o 'ambiente' in cui vive è:",
                            "options": ["UN DATO OGGETTIVO", "UNA OPINIONE"],
                            "answer": "UN DATO OGGETTIVO"
                        }
                    ]
                },
                {
                    "id": 8212,
                    "title": "CARATTERISTICHE DEGLI ANIMALI 🐘",
                    "type": "multiple-choice",
                    "instruction": "ASSOCIA le caratteristiche agli animali corretti.",
                    "text": "Ogni animale ha <span style='color: #2980b9; font-weight: bold;'>PARTI DEL CORPO</span> specifiche (zoccoli, proboscide, criniera) e un <span style='color: #d35400; font-weight: bold;'>VERSO</span> caratteristico (ruggito, cinguettio).",
                    "questions": [
                        {
                            "question": "1. L'elefante si riconosce per la sua grande:",
                            "options": ["PROBOSCIDE E ZANNE", "CRINIERA E ZOCCOLI"],
                            "answer": "PROBOSCIDE E ZANNE"
                        },
                        {
                            "question": "2. Quale di questi animali emette un 'ruggito'?",
                            "options": ["IL LEONE", "IL CAVALLO"],
                            "answer": "IL LEONE"
                        },
                        {
                            "question": "3. Gli uccelli hanno il corpo ricoperto da:",
                            "options": ["PIUME E PENNE", "SCAGLIE"],
                            "answer": "PIUME E PENNE"
                        },
                        {
                            "question": "4. Un animale che va in letargo d'inverno ha questa:",
                            "options": ["ABITUDINE COMPORTAMENTALE", "CARATTERISTICA FISICA"],
                            "answer": "ABITUDINE COMPORTAMENTALE"
                        }
                    ]
                },
                {
                    "id": 8213,
                    "title": "LABORATORIO: L'ANIMALE MISTERIOSO 🔍",
                    "type": "multiple-choice",
                    "instruction": "LEGGI il testo e rispondi alle domande per individuare i dettagli.",
                    "text": "<span style='color: #e74c3c; font-weight: bold;'>A CASA:</span> Cercare in un'enciclopedia un animale a scelta e leggere la descrizione oggettiva. Descrivere in 100-150 parole l'animale in modo SOGGETTIVO usando il vocabolario per cercare almeno dieci termini nuovi da inserire nel testo.",
                    "questions": [
                        {
                            "question": "1. Dove puoi cercare informazioni oggettive su un animale?",
                            "options": ["IN UN'ENCICLOPEDIA", "IN UN ROMANZO FANTASY"],
                            "answer": "IN UN'ENCICLOPEDIA"
                        },
                        {
                            "question": "2. Se descrivi l'animale in modo 'soggettivo', cosa aggiungi?",
                            "options": ["LE TUE OPINIONI E IMPRESSIONI", "SOLO I DATI SCIENTIFICI"],
                            "answer": "LE TUE OPINIONI E IMPRESSIONI"
                        },
                        {
                            "question": "3. Usare il vocabolario serve per:",
                            "options": ["TROVARE TERMINI NUOVI E ARRICCHIRE IL TESTO", "COPIARE LE FRASI DEGLI ALTRI"],
                            "answer": "TROVARE TERMINI NUOVI E ARRICCHIRE IL TESTO"
                        }
                    ]
                }
            ],
            "oggetto": [
                {
                    "id": 8221,
                    "title": "LA DESCRIZIONE DI UN OGGETTO 📦",
                    "type": "multiple-choice",
                    "instruction": "RISPONDI alle domande sulle caratteristiche degli oggetti.",
                    "text": "Nella descrizione <span style='color: #27ae60; font-weight: bold;'>OGGETTIVA</span> di un oggetto indichiamo: COS'È, DOVE SI TROVA, la FORMA, la CONSISTENZA, il PESO, il COLORE, le SENSAZIONI AL TATTO, L'ODORE, IL GUSTO, il SUONO CHE EMETTE e la MATERIA di cui è fatto.<br>SOGGETTIVA: le <span style='color: #e84393; font-weight: bold;'>IMPRESSIONI</span> che suscita.",
                    "questions": [
                        {
                            "question": "1. 'È un oggetto di legno a forma di cubo' è una descrizione:",
                            "options": ["OGGETTIVA", "SOGGETTIVA"],
                            "answer": "OGGETTIVA"
                        },
                        {
                            "question": "2. 'Al tatto risulta liscio e freddo', stiamo indicando:",
                            "options": ["SENSAZIONI TATTILI", "SUONO CHE EMETTE"],
                            "answer": "SENSAZIONI TATTILI"
                        },
                        {
                            "question": "3. La 'materia di cui è fatto' potrebbe essere:",
                            "options": ["VETRO O METALLO", "TRISTE O FELICE"],
                            "answer": "VETRO O METALLO"
                        },
                        {
                            "question": "4. 'Mi ricorda l'infanzia ed è il mio preferito', questa è un'impressione:",
                            "options": ["SOGGETTIVA", "OGGETTIVA"],
                            "answer": "SOGGETTIVA"
                        }
                    ]
                },
                {
                    "id": 8222,
                    "title": "LABORATORIO: LA SCATOLA MISTERIOSA 🎁",
                    "type": "multiple-choice",
                    "instruction": "COMPLETA l'esercizio preparatorio.",
                    "text": "<div style='font-size: 3rem; text-align: center; margin-bottom: 1rem;'>📦 🎁 🧳</div><br><span style='color: #e74c3c; font-weight: bold;'>LABORATORIO DI SCRITTURA:</span> Immagina che nella tua scatola ci siano TRE OGGETTI. Descrivili in dettaglio.",
                    "questions": [
                        {
                            "question": "1. Se devi descrivere la forma di una scatola, puoi usare:",
                            "options": ["CUBICA, RETTANGOLARE", "AZZURRA, ROSSA"],
                            "answer": "CUBICA, RETTANGOLARE"
                        },
                        {
                            "question": "2. Per descriverne la consistenza dirai che è:",
                            "options": ["RIGIDA E RESISTENTE", "ALTA O BASSA"],
                            "answer": "RIGIDA E RESISTENTE"
                        },
                        {
                            "question": "3. Se descrivi il materiale dell'oggetto all'interno, potresti dire:",
                            "options": ["È FATTO DI STOFFA MORBIDA", "È ALLEGRO E SIMPATICO"],
                            "answer": "È FATTO DI STOFFA MORBIDA"
                        }
                    ]
                }
            ],
            "luogo": [
                {
                    "id": 8231,
                    "title": "LA DESCRIZIONE DI UN LUOGO 🏞️",
                    "type": "multiple-choice",
                    "instruction": "RISPONDI sulle tecniche per descrivere un ambiente.",
                    "text": "Per descrivere un LUOGO occorre: adottare un <span style='color: #2980b9; font-weight: bold;'>PUNTO DI OSSERVAZIONE</span> (fisso o variabile), scegliere un <span style='color: #d35400; font-weight: bold;'>ORDINE LOGICO</span> (lineare: dall'alto in basso, o non lineare), indicare COS'È e DOVE SI TROVA e definirne le CARATTERISTICHE FISICHE.",
                    "questions": [
                        {
                            "question": "1. Un ordine spaziale 'dall'alto in basso' si chiama:",
                            "options": ["ORDINE LINEARE", "ORDINE CAOTICO"],
                            "answer": "ORDINE LINEARE"
                        },
                        {
                            "question": "2. Il 'punto di osservazione' fisso significa che:",
                            "options": ["CHI DESCRIVE STA FERMO IN UN PUNTO", "IL PAESAGGIO SI MUOVE"],
                            "answer": "CHI DESCRIVE STA FERMO IN UN PUNTO"
                        },
                        {
                            "question": "3. Per definire le caratteristiche di un bosco, quali elementi usi?",
                            "options": ["ALBERI, SENTIERI, LUCE", "TETTO, FINESTRE, MOBILI"],
                            "answer": "ALBERI, SENTIERI, LUCE"
                        },
                        {
                            "question": "4. Una descrizione soggettiva del luogo include:",
                            "options": ["LE EMOZIONI CHE IL LUOGO SUSCITA", "L'ALTEZZA DELLE MONTAGNE IN METRI"],
                            "answer": "LE EMOZIONI CHE IL LUOGO SUSCITA"
                        }
                    ]
                },
                {
                    "id": 8232,
                    "title": "MOMENTO VIDEO 🎥",
                    "type": "multiple-choice",
                    "instruction": "CONCLUDI IL PERCORSO.",
                    "text": "<div style='font-size: 3rem; text-align: center; margin-bottom: 1rem;'>🎬🍿</div><br>In classe visionerai un cortometraggio. Presta molta attenzione ai luoghi in cui si svolge l'azione e prova a descriverli mentalmente usando l'ordine lineare.",
                    "questions": [
                        {
                            "question": "1. Descrivere da 'sinistra a destra' è un tipo di ordine:",
                            "options": ["LINEARE", "NON LINEARE"],
                            "answer": "LINEARE"
                        },
                        {
                            "question": "2. Osservare i colori, la luce e le ombre serve a:",
                            "options": ["RENDERE LA DESCRIZIONE PIÙ VIVIDA", "DIMINUIRE I DETTAGLI"],
                            "answer": "RENDERE LA DESCRIZIONE PIÙ VIVIDA"
                        }
                    ]
                }
            ]
        }
        
        if 'produzione' not in data:
            data['produzione'] = {}
        data['produzione']['descrizione'] = descrizione
        
        new_json_str = json.dumps(data, indent=4)
        new_content = prefix + new_json_str + ";\n\n" + suffix
        
        with open('js/exercises.js', 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Success")
    except Exception as e:
        print("Error:", str(e))
else:
    print("Prefix not found")

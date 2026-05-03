import json

with open('js/exercises.js', 'r', encoding='utf-8') as f:
    text = f.read()

prefix = 'window.exercisesData = '
json_str = text[len(prefix):].strip()
if json_str.endswith(';'):
    json_str = json_str[:-1]

data = json.loads(json_str)

data['riflessione']['analisiPeriodo']['udaPeriodo7'] = {
    "scopri": [
        {
            "id": 4101,
            "title": "La Proposizione Subordinata",
            "theory": "La proposizione <span style='color: #e74c3c; font-weight: bold;'>SUBORDINATA</span> si aggiunge a un'altra proposizione (che le fa da reggente) in quanto non ha in sé un significato autonomo.<br><br>Essa ha cioè bisogno di <span style='color: #2980b9; font-weight: bold;'>poggiare</span> su una principale o su un'altra subordinata, altrimenti la frase rimane in sospeso e non ha un senso compiuto.<br><br><em>Esempio:</em> Il cane abbaia (principale) <span style='color: #e74c3c; font-weight: bold;'>perché ha visto un gatto</span> (subordinata).",
            "text": "La proposizione subordinata:",
            "options": [
                "Ha sempre un significato autonomo",
                "Non ha un significato autonomo"
            ],
            "answer": "Non ha un significato autonomo"
        },
        {
            "id": 4201,
            "title": "Forma Esplicita o Implicita",
            "theory": "UNA PROPOSIZIONE SUBORDINATA PUÒ ESSERE:<br><br>• <span style='color: #27ae60; font-weight: bold;'>ESPLICITA</span>: QUANDO HA IL VERBO DI <span style='color: #2980b9; font-weight: bold;'>MODO FINITO</span> (INDICATIVO, CONGIUNTIVO, CONDIZIONALE, IMPERATIVO).<br><br>• <span style='color: #8e44ad; font-weight: bold;'>IMPLICITA</span>: QUANDO HA IL VERBO DI <span style='color: #d35400; font-weight: bold;'>MODO INDEFINITO</span> (INFINITO, GERUNDIO, PARTICIPIO).",
            "text": "Se il verbo è al GERUNDIO, la subordinata è:",
            "options": [
                "Esplicita",
                "Implicita"
            ],
            "answer": "Implicita"
        },
        {
            "id": 4301,
            "title": "Come si collegano alla reggente?",
            "theory": "Le proposizioni subordinate si collegano alla loro reggente in modo diverso a seconda che siano esplicite o implicite:<br><br>• Le subordinate <span style='color: #27ae60; font-weight: bold;'>ESPLICITE</span> sono introdotte da:<br>- Congiunzioni subordinanti (perché, quando, se, affinché, sebbene...)<br>- Pronomi o avverbi relativi (che, il quale, cui, dove...)<br>- Aggettivi, pronomi o avverbi interrogativi.<br><br>• Le subordinate <span style='color: #8e44ad; font-weight: bold;'>IMPLICITE</span> sono introdotte da:<br>- Preposizioni (a, di, da, per, con...)<br>- Oppure si legano direttamente, senza alcuna preposizione (es. <em><span style='color: #e74c3c; font-weight: bold;'>Essendo</span> stanco, andò a letto</em>).",
            "text": "La parola 'perché' introduce di solito una subordinata:",
            "options": [
                "Esplicita",
                "Implicita"
            ],
            "answer": "Esplicita"
        }
    ],
    "allenati": [
        {
            "id": 4511,
            "type": "classification-grid",
            "title": "Principale o Subordinata?",
            "instruction": "Leggi le frasi evidenziate in ROSSO e classificale: si tratta della frase PRINCIPALE o di una frase NON PRINCIPALE (subordinata)?",
            "words": [
                "Sono tornato a casa contento <span style='color: red; font-weight: bold;'>dopo aver fatto una lunga passeggiata</span>.",
                "<span style='color: red; font-weight: bold;'>Porto dal veterinario il mio cane</span>, dal momento che ha gli occhi arrossati.",
                "<span style='color: red; font-weight: bold;'>Non posso uscire</span> perché fuori piove.",
                "Ho comprato delle uova <span style='color: red; font-weight: bold;'>affinché tu possa cucinare una frittata</span>."
            ],
            "categories": [
                "Principale",
                "Non Principale"
            ],
            "answers": {
                "Sono tornato a casa contento <span style='color: red; font-weight: bold;'>dopo aver fatto una lunga passeggiata</span>.": "Non Principale",
                "<span style='color: red; font-weight: bold;'>Porto dal veterinario il mio cane</span>, dal momento che ha gli occhi arrossati.": "Principale",
                "<span style='color: red; font-weight: bold;'>Non posso uscire</span> perché fuori piove.": "Principale",
                "Ho comprato delle uova <span style='color: red; font-weight: bold;'>affinché tu possa cucinare una frittata</span>.": "Non Principale"
            }
        },
        {
            "id": 4512,
            "type": "classification-grid",
            "title": "Esplicita o Implicita?",
            "instruction": "Classifica le proposizioni subordinate in base alla forma del loro verbo (Esplicita se ha un modo finito come l'indicativo, Implicita se ha un modo indefinito come l'infinito o il gerundio).",
            "words": [
                "Pensavamo che tu fossi già arrivato.",
                "Credo di avere dimenticato le chiavi di casa.",
                "Uscendo dal negozio, ho incontrato un vecchio amico.",
                "Mi chiedo chi abbia lasciato la finestra aperta.",
                "Pur avendo studiato molto, non ho superato l'esame.",
                "Il nonno mi ha regalato un libro affinché io lo legga."
            ],
            "categories": [
                "Esplicita",
                "Implicita"
            ],
            "answers": {
                "Pensavamo che tu fossi già arrivato.": "Esplicita",
                "Credo di avere dimenticato le chiavi di casa.": "Implicita",
                "Uscendo dal negozio, ho incontrato un vecchio amico.": "Implicita",
                "Mi chiedo chi abbia lasciato la finestra aperta.": "Esplicita",
                "Pur avendo studiato molto, non ho superato l'esame.": "Implicita",
                "Il nonno mi ha regalato un libro affinché io lo legga.": "Esplicita"
            }
        },
        {
            "id": 4513,
            "type": "classification-grid",
            "title": "Gradi della Subordinazione",
            "instruction": "Individua se la proposizione sottolineata è una subordinata di 1° GRADO (dipende direttamente dalla principale) o di 2° GRADO (dipende a sua volta da una subordinata).",
            "words": [
                "Ti ho chiamato / perché volevo sapere / <u>come stavi</u>.",
                "Ho deciso / <u>di andare al mare</u>.",
                "Non riesco a capire / se hai fame / o <u>se hai sete</u>.",
                "Voglio credere / che la situazione migliorerà / <u>se tutti faremo la nostra parte</u>."
            ],
            "categories": [
                "1° Grado",
                "2° Grado"
            ],
            "answers": {
                "Ti ho chiamato / perché volevo sapere / <u>come stavi</u>.": "2° Grado",
                "Ho deciso / <u>di andare al mare</u>.": "1° Grado",
                "Non riesco a capire / se hai fame / o <u>se hai sete</u>.": "1° Grado",
                "Voglio credere / che la situazione migliorerà / <u>se tutti faremo la nostra parte</u>.": "2° Grado"
            }
        }
    ],
    "verifica": [],
    "recupera": []
}

new_json_str = json.dumps(data, indent=4, ensure_ascii=False)
final_text = prefix + new_json_str + ';\n'

with open('js/exercises.js', 'w', encoding='utf-8') as f:
    f.write(final_text)

print("Updated udaPeriodo7")

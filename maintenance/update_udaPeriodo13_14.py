import json

with open('js/exercises.js', 'r', encoding='utf-8') as f:
    text = f.read()

prefix = 'window.exercisesData = '
json_str = text[len(prefix):].strip()
if json_str.endswith(';'):
    json_str = json_str[:-1]

data = json.loads(json_str)

# --- UDA PERIODO 13: FINALE ---
data['riflessione']['analisiPeriodo']['udaPeriodo13'] = {
    "scopri": [
        {
            "id": 1301,
            "title": "La Proposizione Finale",
            "theory": "La <span style='color: #27ae60; font-weight: bold;'>proposizione finale</span> è una subordinata che indica lo scopo o il <span style='color: #2980b9; font-weight: bold;'>fine</span> per cui viene compiuta l'azione espressa nella reggente.<br><br>Risponde alla domanda: <span style='color: #e74c3c; font-weight: bold;'>\"Per quale fine? Con quale scopo?\"</span><br><br>Spesso è introdotta da:<br>• <span style='color: #8e44ad; font-weight: bold;'>affinché, perché</span> (nella forma esplicita, di solito con il congiuntivo)<br>• <span style='color: #d35400; font-weight: bold;'>per, a, di, al fine di, allo scopo di</span> + infinito (nella forma implicita).",
            "text": "La proposizione finale risponde alla domanda:",
            "options": [
                "Per quale motivo / A causa di cosa?",
                "Per quale scopo / A quale fine?"
            ],
            "answer": "Per quale scopo / A quale fine?"
        }
    ],
    "allenati": [
        {
            "id": 1311,
            "type": "completion",
            "text": "Associa ad ogni proposizione principale la sua corretta proposizione finale. Scrivi nel riquadro la lettera minuscola corrispondente (a, b, c, d, e, f):<br><br><b>Principali:</b><br>1. Ho impostato tre sveglie ___<br>2. L'attore indossò occhiali scuri ___<br>3. Mi sono iscritto a un corso serale ___<br>4. I pompieri sono intervenuti rapidamente ___<br>5. Domani chiamerò un tecnico specializzato ___<br>6. Abbiamo prenotato un tavolo al ristorante ___<br><br><b>Finali:</b><br>a. affinché ripari il guasto del computer.<br>b. per non essere riconosciuto dai giornalisti.<br>c. per non rischiare di arrivare in ritardo al lavoro.<br>d. allo scopo di festeggiare il compleanno di Alice.<br>e. per domare l'incendio scoppiato in collina.<br>f. al fine di migliorare il mio francese.",
            "answer": "c|b|f|e|a|d"
        },
        {
            "id": 1312,
            "type": "multiple-choice",
            "text": "Trasforma il complemento di fine in una proposizione subordinata finale! Scegli la trasformazione corretta:<br><br>Frase di partenza: <b>Studio molto per il superamento dell'esame.</b>",
            "options": [
                "Studio molto affinché io superi l'esame.",
                "Studio molto perché l'esame è difficile."
            ],
            "answer": "Studio molto affinché io superi l'esame."
        },
        {
            "id": 1313,
            "type": "classification-grid",
            "title": "Causale o Finale?",
            "instruction": "Leggi le seguenti frasi subordinate e classificale: indicano la CAUSA dell'azione (perché è successo?) o il FINE dell'azione (a quale scopo?)",
            "words": [
                "Mi sono coperto bene per non prendere freddo.",
                "Siccome faceva molto freddo, ho indossato il cappotto.",
                "Hanno lavorato tutta la notte per finire il progetto in tempo.",
                "Essendo in forte ritardo, l'avvocato ha dovuto prendere un taxi.",
                "Ho nascosto il regalo affinché Luca non lo veda.",
                "Non sono uscito perché pioveva a dirotto."
            ],
            "categories": [
                "Causale",
                "Finale"
            ],
            "answers": {
                "Mi sono coperto bene per non prendere freddo.": "Finale",
                "Siccome faceva molto freddo, ho indossato il cappotto.": "Causale",
                "Hanno lavorato tutta la notte per finire il progetto in tempo.": "Finale",
                "Essendo in forte ritardo, l'avvocato ha dovuto prendere un taxi.": "Causale",
                "Ho nascosto il regalo affinché Luca non lo veda.": "Finale",
                "Non sono uscito perché pioveva a dirotto.": "Causale"
            }
        }
    ],
    "verifica": [],
    "recupera": []
}

# --- UDA PERIODO 14: TEMPORALE ---
data['riflessione']['analisiPeriodo']['udaPeriodo14'] = {
    "scopri": [
        {
            "id": 1401,
            "title": "La Proposizione Temporale",
            "theory": "La <span style='color: #27ae60; font-weight: bold;'>proposizione temporale</span> indica <span style='color: #2980b9; font-weight: bold;'>QUANDO</span> avviene l'azione espressa nella proposizione reggente.<br><br><em>Esempio:</em> <span style='color: #e74c3c; font-weight: bold;'>Quando è primavera</span>, fioriscono moltissime rose.<br><br>Le congiunzioni o locuzioni temporali più usate per introdurla sono:<br>• QUANDO<br>• MENTRE<br>• NEL MOMENTO IN CUI<br>• PRIMA (DI o CHE)<br>• DOPO (DI o CHE)<br>• OGNI VOLTA CHE",
            "text": "La proposizione temporale risponde alla domanda:",
            "options": [
                "Dove?",
                "Quando?"
            ],
            "answer": "Quando?"
        }
    ],
    "allenati": [
        {
            "id": 1411,
            "type": "multiple-choice",
            "text": "Riordina! Qual è l'ordine logico corretto per formare un periodo con una frase principale e una temporale?<br>Elementi: [il cielo] [quando] [è sereno] [le stelle] [splendono]",
            "options": [
                "Quando il cielo è sereno, le stelle splendono.",
                "Quando le stelle è sereno, il cielo splendono.",
                "Il cielo è sereno quando le stelle splendono sereno."
            ],
            "answer": "Quando il cielo è sereno, le stelle splendono."
        },
        {
            "id": 1412,
            "type": "multiple-choice",
            "text": "Trasforma il complemento di tempo in una proposizione subordinata temporale! Scegli la frase corretta:<br><br>Frase di partenza: <b>Al tramonto, rientriamo in albergo.</b>",
            "options": [
                "Quando tramonta il sole, rientriamo in albergo.",
                "Per vedere il sole, rientriamo in albergo."
            ],
            "answer": "Quando tramonta il sole, rientriamo in albergo."
        },
        {
            "id": 1413,
            "type": "completion",
            "text": "Fai l'analisi del periodo: dividi le seguenti frasi in proposizioni inserendo una barretta verticale `|` in ogni spazio vuoto.<br><br>1. Ieri pomeriggio sono andato al parco con gli amici ___ e abbiamo giocato a pallone ___ finché non è calato il sole.<br><br>2. Mentre passeggiavo nel bosco ___ ho trovato un cucciolo ___ che si era perso.",
            "answer": "|||||"
        }
    ],
    "verifica": [],
    "recupera": []
}

new_json_str = json.dumps(data, indent=4, ensure_ascii=False)
final_text = prefix + new_json_str + ';\n'

with open('js/exercises.js', 'w', encoding='utf-8') as f:
    f.write(final_text)

print("Updated udaPeriodo13 and udaPeriodo14")

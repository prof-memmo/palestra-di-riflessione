import json

with open('js/exercises.js', 'r', encoding='utf-8') as f:
    text = f.read()

prefix = 'window.exercisesData = '
json_str = text[len(prefix):].strip()
if json_str.endswith(';'):
    json_str = json_str[:-1]

data = json.loads(json_str)

# Update udaPeriodo1
data['riflessione']['analisiPeriodo']['udaPeriodo1'] = {
    "scopri": [
        {
            "id": 3101,
            "title": "Cos'è il Periodo o Frase Complessa",
            "theory": "IL <span style='color: #27ae60; font-weight: bold;'>PERIODO</span> O FRASE COMPLESSA È UN PENSIERO DI SENSO COMPIUTO COSTITUITO DA UNA O PIÙ FRASI O PROPOSIZIONI, COLLEGATE TRA LORO IN MODO LOGICO. ESSO È SEPARATO DAL RESTO DEL DISCORSO DA UN SEGNO DI <span style='color: #2980b9; font-weight: bold;'>PUNTEGGIATURA FORTE</span> (PUNTO FERMO, PUNTO INTERROGATIVO, PUNTO ESCLAMATIVO).<br><br><span style='color: #e74c3c; font-weight: bold;'>ESEMPIO:</span> NELLA PRIMA PARTE DEL VENTESIMO SECOLO L'ANIMALE È STATO RITROVATO QUASI INTATTO, È STATA SCOPERTA LA CARCASSA SEPOLTA IN UN TERRENO DI GHIAIA E FANGO, DEL MAMMUT DI BERESOVKA.",
            "text": "UN PERIODO TERMINA SEMPRE CON UN SEGNO DI:",
            "options": [
                "PUNTEGGIATURA DEBOLE",
                "PUNTEGGIATURA FORTE"
            ],
            "answer": "PUNTEGGIATURA FORTE"
        }
    ],
    "allenati": [
        {
            "id": 3105,
            "type": "classification-grid",
            "title": "Laboratorio: Frase Semplice o Complessa?",
            "instruction": "Leggi le seguenti frasi e trascinale nella colonna corretta, indicando se si tratta di una FRASE SEMPLICE (un solo verbo) o di un PERIODO / FRASE COMPLESSA (due o più verbi).",
            "words": [
                "Ieri pomeriggio sono andato al cinema con i miei amici.",
                "Quando tornerai a casa, troverai una bella sorpresa.",
                "Il gatto dorme profondamente sul divano del salotto.",
                "Non sapevo che Marco fosse partito per le vacanze.",
                "Mentre studiavo la lezione di storia, il telefono ha squillato all'improvviso.",
                "La torta al cioccolato della nonna è sempre buonissima."
            ],
            "categories": [
                "Frase Semplice",
                "Periodo (Complessa)"
            ],
            "answers": {
                "Ieri pomeriggio sono andato al cinema con i miei amici.": "Frase Semplice",
                "Quando tornerai a casa, troverai una bella sorpresa.": "Periodo (Complessa)",
                "Il gatto dorme profondamente sul divano del salotto.": "Frase Semplice",
                "Non sapevo che Marco fosse partito per le vacanze.": "Periodo (Complessa)",
                "Mentre studiavo la lezione di storia, il telefono ha squillato all'improvviso.": "Periodo (Complessa)",
                "La torta al cioccolato della nonna è sempre buonissima.": "Frase Semplice"
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

print("Updated udaPeriodo1")

import json

with open('js/exercises.js', 'r', encoding='utf-8') as f:
    text = f.read()

prefix = 'window.exercisesData = '
json_str = text[len(prefix):].strip()
if json_str.endswith(';'):
    json_str = json_str[:-1]

data = json.loads(json_str)

data['riflessione']['analisiPeriodo']['udaPeriodo6'] = {
    "scopri": [
        {
            "id": 3601,
            "title": "La Proposizione Coordinata",
            "theory": "Si ha una <span style='color: #27ae60; font-weight: bold;'>proposizione coordinata</span> quando due o più proposizioni si collegano tra loro ponendosi sullo <span style='color: #2980b9; font-weight: bold;'>stesso piano logico e sintattico</span>.<br><br>Esse sono tra loro <span style='color: #e74c3c; font-weight: bold;'>INDIPENDENTI</span>: si aggiungono alla principale o a un'altra coordinata senza dipendere da esse. C'è un rapporto di totale parità!<br><br>La coordinazione può avvenire in due modi:<br>• <span style='color: #8e44ad; font-weight: bold;'>TRAMITE CONGIUNZIONE</span>: e, ma, però, dunque, oppure...<br>• <span style='color: #d35400; font-weight: bold;'>PER ASINDETO (o giustapposizione)</span>: usando segni di punteggiatura debole come la virgola, il punto e virgola o i due punti.",
            "text": "Le proposizioni coordinate sono tra loro:",
            "options": [
                "Dipendenti",
                "Indipendenti"
            ],
            "answer": "Indipendenti"
        },
        {
            "id": 3602,
            "title": "Tipi di Coordinate",
            "theory": "A seconda del tipo di congiunzione che le introduce, le proposizioni coordinate assumono nomi diversi:<br><br>• <span style='color: #2980b9; font-weight: bold;'>Copulativa</span>: aggiunge un'informazione (e, anche, inoltre, né, neanche).<br>• <span style='color: #e74c3c; font-weight: bold;'>Disgiuntiva</span>: offre un'alternativa (o, oppure, ovvero).<br>• <span style='color: #27ae60; font-weight: bold;'>Avversativa</span>: esprime un contrasto (ma, tuttavia, però, eppure).<br>• <span style='color: #8e44ad; font-weight: bold;'>Esplicativa</span>: spiega o chiarisce (cioè, ossia, infatti, vale a dire).<br>• <span style='color: #d35400; font-weight: bold;'>Conclusiva</span>: indica una conseguenza (perciò, dunque, quindi, pertanto).<br>• <span style='color: #f39c12; font-weight: bold;'>Correlativa</span>: si usano in coppia (e... e, o... o, né... né, sia... sia).",
            "text": "La congiunzione 'però' introduce una coordinata:",
            "options": [
                "Copulativa",
                "Avversativa"
            ],
            "answer": "Avversativa"
        }
    ],
    "allenati": [
        {
            "id": 3611,
            "type": "classification-grid",
            "title": "Congiunzione o Asindeto?",
            "instruction": "Classifica i seguenti periodi indicando se la coordinazione avviene tramite una CONGIUNZIONE o per ASINDETO (cioè tramite punteggiatura).",
            "words": [
                "Ho fatto la spesa e poi ho cucinato la cena.",
                "Il sole splendeva alto nel cielo, gli uccellini cantavano gioiosi.",
                "Vorrei uscire a fare una passeggiata, ma sta piovendo a dirotto.",
                "Entrò nella stanza in silenzio, si sedette sul divano, accese la televisione.",
                "Devi sbrigarti oppure perderemo l'autobus per il centro.",
                "La porta si aprì all'improvviso: un forte vento invase la stanza."
            ],
            "categories": [
                "Per Congiunzione",
                "Per Asindeto"
            ],
            "answers": {
                "Ho fatto la spesa e poi ho cucinato la cena.": "Per Congiunzione",
                "Il sole splendeva alto nel cielo, gli uccellini cantavano gioiosi.": "Per Asindeto",
                "Vorrei uscire a fare una passeggiata, ma sta piovendo a dirotto.": "Per Congiunzione",
                "Entrò nella stanza in silenzio, si sedette sul divano, accese la televisione.": "Per Asindeto",
                "Devi sbrigarti oppure perderemo l'autobus per il centro.": "Per Congiunzione",
                "La porta si aprì all'improvviso: un forte vento invase la stanza.": "Per Asindeto"
            }
        },
        {
            "id": 3612,
            "type": "classification-grid",
            "title": "Coordinata alla Principale o alla Subordinata?",
            "instruction": "Leggi le proposizioni in ROSSO e classificale: sono coordinate alla frase PRINCIPALE o sono coordinate a un'altra SUBORDINATA?",
            "words": [
                "Ho risposto male al professore, <span style='color: red; font-weight: bold;'>perciò adesso sono in punizione</span>.",
                "Non so se guardare un film <span style='color: red; font-weight: bold;'>oppure leggere un bel libro</span>.",
                "Ha detto che arriverà in ritardo <span style='color: red; font-weight: bold;'>e che non cenerà con noi</span>.",
                "Ieri sono andato in piscina, <span style='color: red; font-weight: bold;'>tuttavia l'acqua era freddissima</span>.",
                "Credeva di avere ragione, <span style='color: red; font-weight: bold;'>invece si sbagliava di grosso</span>.",
                "Quando tornerai a casa <span style='color: red; font-weight: bold;'>e ti toglierai le scarpe</span>, potrai riposarti."
            ],
            "categories": [
                "Coordinata alla Principale",
                "Coordinata alla Subordinata"
            ],
            "answers": {
                "Ho risposto male al professore, <span style='color: red; font-weight: bold;'>perciò adesso sono in punizione</span>.": "Coordinata alla Principale",
                "Non so se guardare un film <span style='color: red; font-weight: bold;'>oppure leggere un bel libro</span>.": "Coordinata alla Subordinata",
                "Ha detto che arriverà in ritardo <span style='color: red; font-weight: bold;'>e che non cenerà con noi</span>.": "Coordinata alla Subordinata",
                "Ieri sono andato in piscina, <span style='color: red; font-weight: bold;'>tuttavia l'acqua era freddissima</span>.": "Coordinata alla Principale",
                "Credeva di avere ragione, <span style='color: red; font-weight: bold;'>invece si sbagliava di grosso</span>.": "Coordinata alla Principale",
                "Quando tornerai a casa <span style='color: red; font-weight: bold;'>e ti toglierai le scarpe</span>, potrai riposarti.": "Coordinata alla Subordinata"
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

print("Updated udaPeriodo6")

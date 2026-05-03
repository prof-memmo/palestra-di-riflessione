import json

with open('js/exercises.js', 'r', encoding='utf-8') as f:
    text = f.read()

prefix = 'window.exercisesData = '
json_str = text[len(prefix):].strip()
if json_str.endswith(';'):
    json_str = json_str[:-1]

data = json.loads(json_str)

# Update udaPeriodo3
data['riflessione']['analisiPeriodo']['udaPeriodo3'] = {
    "scopri": [
        {
            "id": 3301,
            "title": "La Proposizione Interrogativa",
            "theory": "La proposizione interrogativa esprime una <span style='color: #2980b9; font-weight: bold;'>DOMANDA</span> in forma diretta e si conclude sempre con il <span style='color: #e74c3c; font-weight: bold;'>PUNTO INTERROGATIVO (?)</span>.<br><br>Può essere di vari tipi:<br>• <span style='color: #27ae60; font-weight: bold;'>SEMPLICE</span>: una domanda diretta e secca (es. <em>Hai fame?</em>)<br>• <span style='color: #8e44ad; font-weight: bold;'>DISGIUNTIVA</span>: offre una scelta o un'alternativa (es. <em>Vuoi la mela o preferisci la pera?</em>)<br>• <span style='color: #d35400; font-weight: bold;'>REALE</span>: è una vera e propria richiesta di informazioni, poiché chi fa la domanda non sa la risposta (es. <em>Dove si trova la stazione?</em>)<br>• <span style='color: #16a085; font-weight: bold;'>RETORICA</span>: chi fa la domanda conosce già la risposta, e la usa solo per dare enfasi (es. <em>Chi non vorrebbe vivere sempre in vacanza?</em> -> Si sa già che tutti lo vorrebbero!).",
            "text": "La proposizione 'Vuoi andare al mare o in montagna?' è:",
            "options": [
                "Semplice",
                "Disgiuntiva"
            ],
            "answer": "Disgiuntiva"
        }
    ],
    "allenati": [
        {
            "id": 3311,
            "type": "classification-grid",
            "title": "Analizza le Interrogative",
            "instruction": "Classifica le seguenti frasi interrogative trascinandole nella categoria corretta, in base alla combinazione delle loro caratteristiche.",
            "words": [
                "Chi ha scoperto l'America?",
                "Hai finito di fare i compiti oppure devi ancora iniziare?",
                "Forse che il sole non sorge ogni mattina?",
                "Ti ho forse offeso o ti ho detto solo la verità?"
            ],
            "categories": [
                "Semplice e Reale",
                "Disgiuntiva e Reale",
                "Semplice e Retorica",
                "Disgiuntiva e Retorica"
            ],
            "answers": {
                "Chi ha scoperto l'America?": "Semplice e Reale",
                "Hai finito di fare i compiti oppure devi ancora iniziare?": "Disgiuntiva e Reale",
                "Forse che il sole non sorge ogni mattina?": "Semplice e Retorica",
                "Ti ho forse offeso o ti ho detto solo la verità?": "Disgiuntiva e Retorica"
            }
        }
    ],
    "verifica": [],
    "recupera": []
}

# Update udaPeriodo4
data['riflessione']['analisiPeriodo']['udaPeriodo4'] = {
    "scopri": [
        {
            "id": 3401,
            "title": "La Proposizione Incidentale",
            "theory": "La proposizione incidentale è una proposizione che si inserisce nel periodo <span style='color: #e74c3c; font-weight: bold;'>SENZA ALCUN LEGAME SINTATTICO</span> con le altre frasi.<br><br>Essa ha per lo più la funzione di <span style='color: #2980b9; font-weight: bold;'>completare il senso</span>, precisare o chiarire un concetto (è come un inciso o un commento del narratore).<br><br>Data la sua funzione accessoria, può essere <span style='color: #27ae60; font-weight: bold;'>ELIMINATA</span> dal testo senza che esso perda il suo senso logico.<br>La proposizione incidentale è racchiusa tra due <span style='color: #8e44ad; font-weight: bold;'>VIRGOLE</span>, due <span style='color: #8e44ad; font-weight: bold;'>LINEETTE</span>, oppure è collocata tra <span style='color: #8e44ad; font-weight: bold;'>PARENTESI</span>.<br><br><em>Esempio:</em> Marco, <span style='color: #d35400; font-weight: bold;'>come dicono tutti</span>, è un ottimo atleta.<br><em>Prova di eliminazione:</em> Marco è un ottimo atleta. (La frase ha senso!)",
            "text": "Se elimino una proposizione incidentale dal periodo:",
            "options": [
                "Il periodo perde di senso",
                "Il periodo mantiene il suo senso logico"
            ],
            "answer": "Il periodo mantiene il suo senso logico"
        }
    ],
    "allenati": [
        {
            "id": 3411,
            "type": "completion",
            "text": "Nei seguenti periodi individua la proposizione incidentale e scrivi nel riquadro ESATTAMENTE la PRIMA PAROLA dell'incidentale (in minuscolo):<br><br>1. La nuova automobile, mi hanno detto, è molto silenziosa e veloce. ___<br>2. Luca non è arrivato in tempo per la riunione – si era addormentato – quindi il capo si è arrabbiato. ___<br>3. Domani, se non piove, faremo una bella scampagnata in montagna. ___<br>4. Questo ristorante (sebbene sia costoso) offre piatti di altissima qualità. ___",
            "answer": "mi|si|se|sebbene"
        }
    ],
    "verifica": [],
    "recupera": []
}

new_json_str = json.dumps(data, indent=4, ensure_ascii=False)
final_text = prefix + new_json_str + ';\n'

with open('js/exercises.js', 'w', encoding='utf-8') as f:
    f.write(final_text)

print("Updated udaPeriodo3 and udaPeriodo4")

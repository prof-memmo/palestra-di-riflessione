import json

with open('js/exercises.js', 'r', encoding='utf-8') as f:
    text = f.read()

prefix = 'window.exercisesData = '
if not text.startswith(prefix):
    raise Exception("File format changed")

json_str = text[len(prefix):].strip()
if json_str.endswith(';'):
    json_str = json_str[:-1]

data = json.loads(json_str)

new_udaPeriodo1 = {
    "scopri": [
        {
            "id": 3101,
            "title": "Cos'è il Periodo o Frase Complessa",
            "theory": "Il <span style='color: #27ae60; font-weight: bold;'>PERIODO</span> (o FRASE COMPLESSA) è un pensiero di senso compiuto formato da <span style='color: #e74c3c; font-weight: bold;'>DUE O PIÙ PROPOSIZIONI</span> (cioè due o più verbi) collegate tra loro in modo logico.<br><br>Il periodo:<br>• termina sempre con un segno di <span style='color: #2980b9; font-weight: bold;'>PUNTEGGIATURA FORTE</span> (punto fermo, punto interrogativo o esclamativo);<br>• esprime un <span style='color: #8e44ad; font-weight: bold;'>CONCETTO COMPLETO</span>.<br><br><em>Esempio</em>: Quando scende la sera, gli uccellini tornano al nido. -> 2 verbi = PERIODO.",
            "text": "Un periodo contiene sempre:",
            "options": [
                "Un solo verbo",
                "Due o più verbi"
            ],
            "answer": "Due o più verbi"
        },
        {
            "id": 3102,
            "title": "La Proposizione Principale",
            "theory": "In ogni periodo esiste sempre una <span style='color: #e74c3c; font-weight: bold;'>PROPOSIZIONE PRINCIPALE</span>, che è la frase più importante.<br><br>La proposizione principale è <span style='color: #27ae60; font-weight: bold;'>SINTATTICAMENTE INDIPENDENTE</span>: ha un senso compiuto e può stare da sola anche senza il resto del periodo.<br><br><em>Esempio</em>: Poiché faceva freddo, <span style='color: #2980b9; font-weight: bold;'>GIULIO HA ACCESO IL CAMINO</span> per riscaldarsi.<br>In rosso troviamo la frase principale, perché ha senso anche da sola!",
            "text": "La proposizione principale può stare da sola?",
            "options": [
                "Sì, ha senso compiuto",
                "No, ha bisogno di altre frasi"
            ],
            "answer": "Sì, ha senso compiuto"
        },
        {
            "id": 3103,
            "title": "Coordinazione e Subordinazione",
            "theory": "Le altre proposizioni di un periodo si collegano alla principale in due modi:<br><br>• Per <span style='color: #e67e22; font-weight: bold;'>COORDINAZIONE</span>: si legano alla principale tramite congiunzioni coordinanti (e, ma, o, perciò) o segni di punteggiatura debole (virgola). Sono frasi indipendenti.<br><em>Esempio</em>: Il cane abbaia (principale) <span style='color: #e67e22; font-weight: bold;'>E scodinzola</span> (coordinata).<br><br>• Per <span style='color: #8e44ad; font-weight: bold;'>SUBORDINAZIONE</span>: si legano alla principale tramite congiunzioni subordinanti (perché, quando, sebbene). Sono frasi <span style='color: #c0392b; font-weight: bold;'>DIPENDENTI</span> e non autonome.<br><em>Esempio</em>: Il cane abbaia (principale) <span style='color: #8e44ad; font-weight: bold;'>QUANDO vede un gatto</span> (subordinata).",
            "text": "Le proposizioni subordinate sono autonome?",
            "options": [
                "Sì, sono autonome",
                "No, dipendono da un'altra frase"
            ],
            "answer": "No, dipendono da un'altra frase"
        },
        {
            "id": 3104,
            "title": "Tipi di Proposizione Principale",
            "theory": "La proposizione principale può assumere diverse sfumature di significato:<br><br>• <span style='color: #2980b9; font-weight: bold;'>INFORMATIVA</span>: dà un'informazione (Es. Il treno parte alle nove).<br>• <span style='color: #e74c3c; font-weight: bold;'>INTERROGATIVA</span>: esprime una domanda diretta (Es. Che ore sono?).<br>• <span style='color: #27ae60; font-weight: bold;'>ESCLAMATIVA</span>: esprime stupore, rabbia o gioia (Es. Che bella sorpresa!).<br>• <span style='color: #d35400; font-weight: bold;'>VOLITIVA</span>: esprime un ordine, un divieto o un invito (Es. Studia di più! / Non toccare!).<br>• <span style='color: #8e44ad; font-weight: bold;'>DESIDERATIVA</span>: esprime un augurio o un desiderio (Es. Magari nevicasse!).",
            "text": "Che tipo di principale è: 'Apri subito quella porta!'?",
            "options": [
                "Informativa",
                "Volitiva"
            ],
            "answer": "Volitiva"
        }
    ],
    "allenati": [
        {
            "id": 3111,
            "type": "completion",
            "text": "Nei seguenti periodi, scrivi nel riquadro la PRIMA PAROLA della proposizione principale di ogni frase (scrivi in minuscolo):<br><br>1. Andate dritti al parco, e poi sedetevi sulla panchina. ___<br>2. Anche se c'era molto traffico, Anna è arrivata puntuale. ___<br>3. Siccome sono molto stanco, stasera vado a letto presto. ___<br>4. Il nonno sta leggendo il giornale che ha comprato in edicola. ___",
            "answer": "andate|anna|stasera|il"
        },
        {
            "id": 3112,
            "type": "completion",
            "text": "Per ciascun periodo, scrivi nel riquadro <span style='color: #2980b9; font-weight: bold;'>c</span> se la proposizione evidenziata è coordinata, o <span style='color: #e74c3c; font-weight: bold;'>s</span> se è subordinata (usa lettere minuscole):<br><br>1. Mio fratello suona la chitarra <span style='color: #e74c3c; font-weight: bold;'>perché ama la musica</span>. ___<br>2. Abbiamo studiato molto, <span style='color: #e74c3c; font-weight: bold;'>perciò adesso ci riposiamo</span>. ___<br>3. Vorrei uscire <span style='color: #e74c3c; font-weight: bold;'>ma fuori sta piovendo forte</span>. ___<br>4. <span style='color: #e74c3c; font-weight: bold;'>Mentre guardava la televisione</span>, il gatto si è addormentato sul divano. ___",
            "answer": "s|c|c|s"
        },
        {
            "id": 3113,
            "type": "completion",
            "text": "Indica il tipo di proposizione principale per ogni periodo, scrivendo nel riquadro il numero corrispondente (1=Informativa, 2=Interrogativa, 3=Esclamativa, 4=Volitiva, 5=Desiderativa):<br><br>A. Che fortuna che hai avuto! ___<br>B. Non correre così veloce nel corridoio! ___<br>C. Quanti anni compie tuo cugino? ___<br>D. Domani andremo a visitare il museo di storia naturale. ___<br>E. Oh, se potessi vincere alla lotteria! ___",
            "answer": "3|4|2|1|5"
        }
    ],
    "verifica": [],
    "recupera": []
}

data['riflessione']['analisiPeriodo']['udaPeriodo1'] = new_udaPeriodo1

new_json_str = json.dumps(data, indent=4, ensure_ascii=False)
final_text = prefix + new_json_str + ';\n'

with open('js/exercises.js', 'w', encoding='utf-8') as f:
    f.write(final_text)

print("Successfully replaced udaPeriodo1")

import json

with open('js/exercises.js', 'r', encoding='utf-8') as f:
    text = f.read()

prefix = 'window.exercisesData = '
json_str = text[len(prefix):].strip()
if json_str.endswith(';'):
    json_str = json_str[:-1]

data = json.loads(json_str)

# --- UDA PERIODO 12: CAUSALE ---
data['riflessione']['analisiPeriodo']['udaPeriodo12'] = {
    "scopri": [
        {
            "id": 1201,
            "title": "La Proposizione Causale",
            "theory": "La proposizione <span style='color: #e74c3c; font-weight: bold;'>CAUSALE</span> indica il motivo, la causa per cui si compie o si verifica l'azione espressa nella reggente.<br><br>Risponde alla domanda: <span style='color: #2980b9; font-weight: bold;'>\"Per quale motivo? Per quale causa?\"</span><br><br><em>Esempio:</em> Giulia piangeva disperatamente <span style='color: #27ae60; font-weight: bold;'>perché aveva perso il suo orsacchiotto</span>.<br><br>Le congiunzioni più usate sono: <span style='color: #8e44ad; font-weight: bold;'>PERCHÉ, POICHÉ, SICCOME, DAL MOMENTO CHE...</span>",
            "text": "La proposizione causale indica:",
            "options": [
                "Lo scopo di un'azione",
                "Il motivo di un'azione"
            ],
            "answer": "Il motivo di un'azione"
        }
    ],
    "allenati": [
        {
            "id": 1211,
            "type": "completion",
            "text": "Nei seguenti periodi, individua la proposizione causale e trascrivi nel riquadro la sua PRIMA PAROLA (in minuscolo):<br><br>1. Non sono uscito in giardino siccome pioveva a dirotto. ___<br>2. Dal momento che sei stanco, faresti meglio a riposarti. ___<br>3. Ho mangiato troppo, perciò ora ho mal di pancia. ___<br>4. Poiché il treno era in ritardo, abbiamo perso la coincidenza. ___",
            "answer": "siccome|dal|perciò|poiché"
        },
        {
            "id": 1212,
            "type": "multiple-choice",
            "text": "Trasforma il complemento di causa in una proposizione subordinata causale! Scegli la frase corretta:<br><br>Frase di partenza: <b>La partita è stata sospesa per la pioggia.</b>",
            "options": [
                "La partita è stata sospesa poiché pioveva.",
                "La partita è stata sospesa per giocare sotto la pioggia."
            ],
            "answer": "La partita è stata sospesa poiché pioveva."
        },
        {
            "id": 1213,
            "type": "multiple-choice",
            "text": "Trasforma la proposizione causale IMPLICITA in ESPLICITA. Scegli la frase corretta:<br><br>Frase di partenza: <b>Essendo malato, non sono andato a scuola.</b>",
            "options": [
                "Siccome sono malato, non sono andato a scuola.",
                "Per non essere malato, non sono andato a scuola."
            ],
            "answer": "Siccome sono malato, non sono andato a scuola."
        }
    ],
    "verifica": [],
    "recupera": []
}

# --- UDA GUIDATE ---
data['riflessione']['analisiPeriodo']['udaPeriodoGuidata1'] = {
    "scopri": [],
    "allenati": [
        {
            "id": 1501,
            "type": "sentence-analysis",
            "title": "Analisi del Periodo Guidata 1",
            "instruction": "Clicca tra le parole per inserire una barretta (/), poi clicca ETICHETTA per indicare il nome della proposizione.",
            "sentence": "Tutti sanno che Alessandro è un vero asso nel nuoto."
        },
        {
            "id": 1502,
            "type": "sentence-analysis",
            "title": "Analisi del Periodo Guidata 1",
            "instruction": "Clicca tra le parole per inserire una barretta (/), poi clicca ETICHETTA per indicare il nome della proposizione.",
            "sentence": "Si spera che finiscano presto i lavori stradali."
        }
    ],
    "verifica": [],
    "recupera": []
}

data['riflessione']['analisiPeriodo']['udaPeriodoGuidata2'] = {
    "scopri": [],
    "allenati": [
        {
            "id": 1601,
            "type": "sentence-analysis",
            "title": "Analisi del Periodo Guidata 2",
            "instruction": "Clicca tra le parole per inserire una barretta (/), poi clicca ETICHETTA per indicare il nome della proposizione.",
            "sentence": "Dopo tanto tempo ci guardavamo in silenzio senza trovare parole, ma ogni tanto sorridevamo l'uno all'altro."
        },
        {
            "id": 1602,
            "type": "sentence-analysis",
            "title": "Analisi del Periodo Guidata 2",
            "instruction": "Clicca tra le parole per inserire una barretta (/), poi clicca ETICHETTA per indicare il nome della proposizione.",
            "sentence": "Occorre proprio che porti il cane dal veterinario per fargli fare un controllo generale."
        }
    ],
    "verifica": [],
    "recupera": []
}

data['riflessione']['analisiPeriodo']['udaPeriodoGuidataFinale'] = {
    "scopri": [],
    "allenati": [
        {
            "id": 1701,
            "type": "sentence-analysis",
            "title": "Analisi del Periodo Finale",
            "instruction": "Esercizio di riepilogo: clicca tra le parole per separare le proposizioni, poi assegna ad ognuna la sua etichetta corretta.",
            "sentence": "La professoressa ci ha spiegato che, se studiamo con attenzione, supereremo l'esame senza alcuna difficoltà."
        },
        {
            "id": 1702,
            "type": "sentence-analysis",
            "title": "Analisi del Periodo Finale",
            "instruction": "Esercizio di riepilogo: clicca tra le parole per separare le proposizioni, poi assegna ad ognuna la sua etichetta corretta.",
            "sentence": "Mentre tornavo a casa, ho incontrato Marco che mi ha detto di avere trovato un nuovo lavoro in centro."
        }
    ],
    "verifica": [],
    "recupera": []
}

new_json_str = json.dumps(data, indent=4, ensure_ascii=False)
final_text = prefix + new_json_str + ';\n'

with open('js/exercises.js', 'w', encoding='utf-8') as f:
    f.write(final_text)

print("Updated udaPeriodo12 and udaPeriodoGuidata1, 2, Finale")

import json

new_allenati = [
    {
        "id": 7101,
        "type": "completion",
        "title": "Esercizio 5 – Volgi al plurale",
        "instruction": "Volgi al plurale le seguenti espressioni contenenti aggettivi qualificativi.",
        "text": "1. un prato verde -> ___<br><br>2. una giacca nuova -> ___<br><br>3. un viso sorridente -> ___<br><br>4. un amico sincero -> ___<br><br>5. un compito difficile -> ___<br><br>6. una borsa pesante -> ___",
        "answer": "dei prati verdi|delle giacche nuove|dei visi sorridenti|degli amici sinceri|dei compiti difficili|delle borse pesanti"
    },
    {
        "id": 7102,
        "type": "completion",
        "title": "Esercizio 6 – Premetti BELLO",
        "instruction": "Premetti ai seguenti nomi l'aggettivo qualificativo BELLO, concordato nel genere e nel numero.",
        "text": "1. ___ tramonto<br><br>2. ___ attore<br><br>3. ___ zaino<br><br>4. ___ avventura<br><br>5. ___ favola<br><br>6. ___ ragazzi<br><br>7. ___ alberi<br><br>8. ___ psicologi<br><br>9. ___ amiche",
        "answer": "bel|bell'|bello|bell'|bella|bei|begli|begli|belle"
    },
    {
        "id": 7103,
        "type": "completion",
        "title": "Esercizio 7 – Premetti BUONO",
        "instruction": "Premetti ai seguenti nomi l'aggettivo qualificativo BUONO, concordato nel genere e nel numero.",
        "text": "1. ___ affare<br><br>2. ___ sapore<br><br>3. ___ idea<br><br>4. ___ psicologo<br><br>5. ___ zia<br><br>6. ___ amici<br><br>7. ___ vacanze",
        "answer": "buon|buon|buon'|buono|buona|buoni|buone"
    },
    {
        "id": 7104,
        "type": "completion",
        "title": "Esercizio 8 – Premetti GRANDE",
        "instruction": "Premetti ai seguenti nomi l'aggettivo qualificativo GRANDE, concordato nel genere e nel numero.",
        "text": "1. ___ successo<br><br>2. ___ scienziato<br><br>3. ___ amica<br><br>4. ___ maestro<br><br>5. ___ progetti<br><br>6. ___ scoperte",
        "answer": "grande|grande|grand'|gran|grandi|grandi"
    },
    {
        "id": 7105,
        "type": "completion",
        "title": "Esercizio 9 – Premetti SANTO",
        "instruction": "Premetti ai seguenti nomi l'aggettivo qualificativo SANTO, concordato nel genere e nel numero.",
        "text": "1. ___ Pietro<br><br>2. ___ Antonio<br><br>3. ___ Rita<br><br>4. ___ Stefano<br><br>5. ___ Agnese",
        "answer": "San|Sant'|Santa|Santo|Sant'"
    },
    {
        "id": 7106,
        "type": "multiple-choice",
        "title": "INVALSI",
        "text": "10. In quale dei seguenti gruppi un aggettivo qualificativo NON è volto al plurale in modo esatto?",
        "options": [
            "sedie comode - tavoli rotondi - cieli azzurri",
            "facce simpatiche - amici leale - gatti neri",
            "storie antiche - poteri magici - ragazzi pigri",
            "forze oscure - mari profondi - grandi autori"
        ],
        "answer": "facce simpatiche - amici leale - gatti neri"
    },
    {
        "id": 7107,
        "type": "multiple-choice",
        "text": "11. In quale delle seguenti frasi sono presenti SOLO aggettivi qualificativi invariabili?",
        "options": [
            "Ho indossato un maglione rosa e una sciarpa blu.",
            "Abbiamo mangiato una torta buonissima.",
            "Mio fratello ha comprato una camicia azzurra e un pantalone nero.",
            "Il cane marrone abbaia sempre al postino."
        ],
        "answer": "Ho indossato un maglione rosa e una sciarpa blu."
    }
]

with open('js/exercises.js', 'r') as f:
    curr_data = f.read()

prefix = curr_data[:curr_data.find('{')]
suffix = curr_data[curr_data.rfind('}')+1:]
curr_json = json.loads(curr_data[curr_data.find('{'):curr_data.rfind('}')+1])

# Update the allenati array for uda7
curr_json['riflessione']['grammaticale']['uda7']['allenati'] = new_allenati

# Let's also insert a sentence about "Aggettivi Invariabili" in the theory of uda7, so the student can answer Ex 11.
# We will append it to the first theory item.
scopri = curr_json['riflessione']['grammaticale']['uda7']['scopri']
scopri[0]['theory'] += "<br><br>⚠️ <span style='color: #e74c3c; font-weight: bold;'>AGGETTIVI INVARIABILI</span>: Alcuni aggettivi non cambiano forma né per genere né per numero (rimangono identici). Tra questi troviamo alcuni colori (<em>rosa, blu, viola</em>), parole straniere (<em>snob, pop</em>) e altre parole particolari (<em>pari, dispari, arrosto</em>)."

with open('js/exercises.js', 'w') as f:
    f.write(prefix + json.dumps(curr_json, indent=4) + suffix)


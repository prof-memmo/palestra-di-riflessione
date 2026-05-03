import json

with open('js/exercises.js', 'r', encoding='utf-8') as f:
    text = f.read()

prefix = 'window.exercisesData = '
json_str = text[len(prefix):].strip()
if json_str.endswith(';'):
    json_str = json_str[:-1]

data = json.loads(json_str)

# --- UDA PERIODO 10: DICHIARATIVA E CONFRONTI ---
data['riflessione']['analisiPeriodo']['udaPeriodo10'] = {
    "scopri": [
        {
            "id": 1001,
            "title": "La Proposizione Dichiarativa",
            "theory": "La proposizione <span style='color: #27ae60; font-weight: bold;'>DICHIARATIVA</span> spiega e precisa un elemento (un pronome o un nome) presente nella proposizione reggente.<br><br>Risponde alla domanda: <span style='color: #2980b9; font-weight: bold;'>\"Cioè? Di che cosa?\"</span><br><br><em>Esempio:</em> Mi tormenta <span style='color: #e74c3c; font-weight: bold;'>questo pensiero:</span> (cioè?) <span style='color: #27ae60; font-weight: bold;'>che tu non sia felice</span>.<br><br>È introdotta da \"che\" (nella forma esplicita) o da \"di\" (nella forma implicita).",
            "text": "La proposizione dichiarativa serve a:",
            "options": [
                "Spiegare e precisare un termine della reggente",
                "Fare da soggetto alla reggente"
            ],
            "answer": "Spiegare e precisare un termine della reggente"
        },
        {
            "id": 1002,
            "title": "Come distinguerle? 1/2",
            "theory": "COME DISTINGUERE SOGGETTIVA, OGGETTIVA E DICHIARATIVA:<br><br><span style='color: #27ae60; font-weight: bold;'>TUTTI PENSANO</span> (PRINCIPALE) / <span style='color: #2980b9; font-weight: bold;'>CHE IL CANTANTE COMPARIÀ SUL PALCO IN RITARDO</span> (SECONDARIA).<br><br>SE LA PRINCIPALE HA IL SOGGETTO (Tutti), LA SECONDARIA NON PUÒ ESSERE UNA SOGGETTIVA!<br>MA PUÒ ESSERE UN'OGGETTIVA O UNA DICHIARATIVA.",
            "text": "Se la principale ha già il soggetto, la secondaria può essere una Soggettiva?",
            "options": [
                "Sì",
                "No"
            ],
            "answer": "No"
        },
        {
            "id": 1003,
            "title": "Come distinguerle? 2/2",
            "theory": "TUTTI PENSANO? (SOGGETTO E VERBO) -> <span style='color: #e74c3c; font-weight: bold;'>CHE COSA PENSANO?</span> -> CHE IL CANTANTE COMPARIÀ SUL PALCO.<br>SE NELLA PRINCIPALE MANCA IL COMPLEMENTO OGGETTO, LA PROPOSIZIONE CHE SEGUE SARÀ <span style='color: #2980b9; font-weight: bold;'>OGGETTIVA</span>!<br><br>INVECE...<br>TUTTI PENSANO QUESTO (SOGGETTO, VERBO, COMPL. OGGETTO) -> <span style='color: #e74c3c; font-weight: bold;'>QUESTO COSA?</span> -> CHE IL CANTANTE COMPARIÀ SUL PALCO.<br>SE NELLA PRINCIPALE C'È GIÀ IL COMPLEMENTO OGGETTO E IL SOGGETTO, LA PROPOSIZIONE CHE SEGUE SARÀ <span style='color: #27ae60; font-weight: bold;'>DICHIARATIVA</span> PERCHÉ SPECIFICA IL COMPLEMENTO.",
            "text": "Se nella principale c'è già sia il soggetto che il complemento oggetto, la subordinata introdotta da 'che' sarà:",
            "options": [
                "Oggettiva",
                "Dichiarativa"
            ],
            "answer": "Dichiarativa"
        }
    ],
    "allenati": [
        {
            "id": 1011,
            "type": "classification-grid",
            "title": "Soggettiva, Oggettiva, Dichiarativa o Interrogativa Indiretta?",
            "instruction": "Leggi le seguenti proposizioni subordinate (evidenziate in rosso) e classificale correttamente.",
            "words": [
                "È chiaro a tutti <span style='color: red; font-weight: bold;'>che il progetto sarà un successo</span>.",
                "Il professore ci ha spiegato <span style='color: red; font-weight: bold;'>che l'esame sarà difficile</span>.",
                "Ho questo dubbio: <span style='color: red; font-weight: bold;'>che Marco non venga alla festa</span>.",
                "Vorrei sapere <span style='color: red; font-weight: bold;'>perché hai pianto ieri sera</span>.",
                "Si spera <span style='color: red; font-weight: bold;'>di arrivare in tempo per l'inizio dello spettacolo</span>.",
                "Mi ha promesso <span style='color: red; font-weight: bold;'>di comportarsi bene</span>.",
                "Ho la sensazione <span style='color: red; font-weight: bold;'>che pioverà a breve</span>.",
                "Mi chiedo <span style='color: red; font-weight: bold;'>chi abbia rotto il vaso in salotto</span>."
            ],
            "categories": [
                "Soggettiva",
                "Oggettiva",
                "Dichiarativa",
                "Interrogativa Indiretta"
            ],
            "answers": {
                "È chiaro a tutti <span style='color: red; font-weight: bold;'>che il progetto sarà un successo</span>.": "Soggettiva",
                "Il professore ci ha spiegato <span style='color: red; font-weight: bold;'>che l'esame sarà difficile</span>.": "Oggettiva",
                "Ho questo dubbio: <span style='color: red; font-weight: bold;'>che Marco non venga alla festa</span>.": "Dichiarativa",
                "Vorrei sapere <span style='color: red; font-weight: bold;'>perché hai pianto ieri sera</span>.": "Interrogativa Indiretta",
                "Si spera <span style='color: red; font-weight: bold;'>di arrivare in tempo per l'inizio dello spettacolo</span>.": "Soggettiva",
                "Mi ha promesso <span style='color: red; font-weight: bold;'>di comportarsi bene</span>.": "Oggettiva",
                "Ho la sensazione <span style='color: red; font-weight: bold;'>che pioverà a breve</span>.": "Dichiarativa",
                "Mi chiedo <span style='color: red; font-weight: bold;'>chi abbia rotto il vaso in salotto</span>.": "Interrogativa Indiretta"
            }
        }
    ],
    "verifica": [],
    "recupera": []
}

# --- UDA PERIODO 11: RELATIVA ---
data['riflessione']['analisiPeriodo']['udaPeriodo11'] = {
    "scopri": [
        {
            "id": 1101,
            "title": "La Proposizione Relativa",
            "theory": "La proposizione <span style='color: #e74c3c; font-weight: bold;'>RELATIVA</span> completa il significato della reggente espandendo il significato di un nome o di un pronome, chiamato <span style='color: #2980b9; font-weight: bold;'>antecedente</span>.<br><br><em>Esempio:</em> Ho incontrato un amico <span style='color: #27ae60; font-weight: bold;'>che</span> si chiama Riccardo.<br>(\"un amico\" è l'antecedente, la frase con il \"che\" è la proposizione relativa).<br><br>Le relative sono introdotte da pronomi e aggettivi relativi come: <span style='color: #8e44ad; font-weight: bold;'>CHE, IL QUALE, CUI, CHI, DOVE...</span>",
            "text": "Il nome o pronome a cui si riferisce la proposizione relativa si chiama:",
            "options": [
                "Antecedente",
                "Conseguente"
            ],
            "answer": "Antecedente"
        }
    ],
    "allenati": [
        {
            "id": 1111,
            "type": "completion",
            "text": "Nei seguenti periodi, individua la proposizione relativa e trascrivi nel riquadro la sua PRIMA PAROLA (in minuscolo):<br><br>1. La torta che ha preparato la nonna è davvero squisita. ___<br>2. I ragazzi ai quali ho prestato il libro non me lo hanno ancora restituito. ___<br>3. Il paese dove sono nato si trova in collina. ___<br>4. Non c'è nessuno a cui io voglia più bene di te. ___",
            "answer": "che|ai|dove|a"
        },
        {
            "id": 1112,
            "type": "multiple-choice",
            "text": "Trasforma le frasi semplici in un periodo inserendo una proposizione subordinata relativa! Scegli la trasformazione corretta:<br><br>Frasi semplici: <b>Il professore spiega la lezione. Il professore è molto severo.</b>",
            "options": [
                "Il professore che spiega la lezione è molto severo.",
                "Poiché il professore spiega la lezione, è molto severo.",
                "Il professore spiega la lezione e lui è molto severo."
            ],
            "answer": "Il professore che spiega la lezione è molto severo."
        },
        {
            "id": 1113,
            "type": "classification-grid",
            "title": "Relative Esplicite o Implicite?",
            "instruction": "Classifica le seguenti proposizioni relative (in rosso) in ESPLICITE (verbo finito) o IMPLICITE (verbo indefinito come l'infinito o il participio).",
            "words": [
                "Ho visto un film <span style='color: red; font-weight: bold;'>che mi ha fatto piangere</span>.",
                "Cerco un libro <span style='color: red; font-weight: bold;'>da leggere sotto l'ombrellone</span>.",
                "L'albero <span style='color: red; font-weight: bold;'>colpito da un fulmine</span> è caduto sulla strada.",
                "Il ragazzo <span style='color: red; font-weight: bold;'>con cui ho parlato ieri</span> è mio cugino.",
                "Ho bisogno di qualcuno <span style='color: red; font-weight: bold;'>di cui fidarmi ciecamente</span>.",
                "La ragazza <span style='color: red; font-weight: bold;'>che canta nel coro</span> ha una voce stupenda."
            ],
            "categories": [
                "Esplicita",
                "Implicita"
            ],
            "answers": {
                "Ho visto un film <span style='color: red; font-weight: bold;'>che mi ha fatto piangere</span>.": "Esplicita",
                "Cerco un libro <span style='color: red; font-weight: bold;'>da leggere sotto l'ombrellone</span>.": "Implicita",
                "L'albero <span style='color: red; font-weight: bold;'>colpito da un fulmine</span> è caduto sulla strada.": "Implicita",
                "Il ragazzo <span style='color: red; font-weight: bold;'>con cui ho parlato ieri</span> è mio cugino.": "Esplicita",
                "Ho bisogno di qualcuno <span style='color: red; font-weight: bold;'>di cui fidarmi ciecamente</span>.": "Implicita",
                "La ragazza <span style='color: red; font-weight: bold;'>che canta nel coro</span> ha una voce stupenda.": "Esplicita"
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

print("Updated udaPeriodo10 and udaPeriodo11")

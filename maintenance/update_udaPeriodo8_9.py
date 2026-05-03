import json

with open('js/exercises.js', 'r', encoding='utf-8') as f:
    text = f.read()

prefix = 'window.exercisesData = '
json_str = text[len(prefix):].strip()
if json_str.endswith(';'):
    json_str = json_str[:-1]

data = json.loads(json_str)

# --- UDA PERIODO 8: SOGGETTIVA ---
data['riflessione']['analisiPeriodo']['udaPeriodo8'] = {
    "scopri": [
        {
            "id": 801,
            "title": "La Proposizione Soggettiva",
            "theory": "La proposizione <span style='color: #e74c3c; font-weight: bold;'>SOGGETTIVA</span> è una frase che fa da SOGGETTO al verbo della proposizione reggente.<br><br>Essa dipende da verbi o espressioni usati in modo <span style='color: #2980b9; font-weight: bold;'>impersonale</span> (senza soggetto proprio), come:<br>• <em>accade, capita, sembra, bisogna, si dice, si racconta, è necessario, è ora, è giusto, è bello...</em><br><br><em>Esempio:</em> <span style='color: #27ae60; font-weight: bold;'>È giusto</span> (principale) <span style='color: #e74c3c; font-weight: bold;'>che tu chieda scusa</span> (soggettiva).",
            "text": "La proposizione soggettiva dipende da verbi usati in modo:",
            "options": [
                "Personale",
                "Impersonale"
            ],
            "answer": "Impersonale"
        },
        {
            "id": 802,
            "title": "Confronto: Soggettiva vs Oggettiva",
            "theory": "SI DICE / <span style='color: #e74c3c; font-weight: bold;'>CHE LA TERZA C NON PARTIRÀ IN GITA //</span><br>PROPOSIZIONE PRINCIPALE REGGENTE <span style='color: #2980b9; font-weight: bold;'>(IMPERSONALE)</span> + PROPOSIZIONE SUBORDINATA <span style='color: #e74c3c; font-weight: bold;'>SOGGETTIVA</span> ESPLICITA DI I GRADO ALLA REGGENTE.<br><br><br>IL PROF CATTIVO DICE / <span style='color: #27ae60; font-weight: bold;'>CHE LA TERZA C NON PARTIRÀ IN GITA //</span><br>PROPOSIZIONE PRINCIPALE REGGENTE <span style='color: #8e44ad; font-weight: bold;'>(IL SOGGETTO È \"IL PROF CATTIVO\")</span> + PROPOSIZIONE SUBORDINATA <span style='color: #27ae60; font-weight: bold;'>OGGETTIVA</span> ESPLICITA DI I GRADO ALLA REGGENTE.",
            "text": "Se la principale HA GIÀ il soggetto, la subordinata che segue è quasi certamente:",
            "options": [
                "Soggettiva",
                "Oggettiva"
            ],
            "answer": "Oggettiva"
        }
    ],
    "allenati": [
        {
            "id": 811,
            "type": "multiple-choice",
            "text": "Laboratorio di ripasso: Cosa sono le proposizioni?",
            "options": [
                "Sono le singole parole che compongono una frase.",
                "Sono le frasi (ognuna con il proprio verbo) che compongono un periodo."
            ],
            "answer": "Sono le frasi (ognuna con il proprio verbo) che compongono un periodo."
        },
        {
            "id": 812,
            "type": "classification-grid",
            "title": "Soggettiva o Oggettiva?",
            "instruction": "Leggi le seguenti frasi e trascinandole, classificale in base al tipo di proposizione subordinata (evidenziata in ROSSO). Ricorda: guarda il verbo della frase principale!",
            "words": [
                "È necessario <span style='color: red; font-weight: bold;'>che voi partiate subito</span>.",
                "Il professore ha annunciato <span style='color: red; font-weight: bold;'>che non ci sarà lezione</span>.",
                "Si mormora <span style='color: red; font-weight: bold;'>che il tesoro sia nascosto sull'isola</span>.",
                "Spero tanto <span style='color: red; font-weight: bold;'>di arrivare in tempo per l'inizio del film</span>.",
                "Non mi sembra <span style='color: red; font-weight: bold;'>che tu abbia capito bene le istruzioni</span>.",
                "Ricordati <span style='color: red; font-weight: bold;'>di comprare il latte al supermercato</span>."
            ],
            "categories": [
                "Subordinata Soggettiva",
                "Subordinata Oggettiva"
            ],
            "answers": {
                "È necessario <span style='color: red; font-weight: bold;'>che voi partiate subito</span>.": "Subordinata Soggettiva",
                "Il professore ha annunciato <span style='color: red; font-weight: bold;'>che non ci sarà lezione</span>.": "Subordinata Oggettiva",
                "Si mormora <span style='color: red; font-weight: bold;'>che il tesoro sia nascosto sull'isola</span>.": "Subordinata Soggettiva",
                "Spero tanto <span style='color: red; font-weight: bold;'>di arrivare in tempo per l'inizio del film</span>.": "Subordinata Oggettiva",
                "Non mi sembra <span style='color: red; font-weight: bold;'>che tu abbia capito bene le istruzioni</span>.": "Subordinata Soggettiva",
                "Ricordati <span style='color: red; font-weight: bold;'>di comprare il latte al supermercato</span>.": "Subordinata Oggettiva"
            }
        }
    ],
    "verifica": [],
    "recupera": []
}

# --- UDA PERIODO 9: OGGETTIVA ---
data['riflessione']['analisiPeriodo']['udaPeriodo9'] = {
    "scopri": [
        {
            "id": 901,
            "title": "La Proposizione Oggettiva",
            "theory": "La proposizione <span style='color: #27ae60; font-weight: bold;'>OGGETTIVA</span> è una frase che fa da COMPLEMENTO OGGETTO al verbo della proposizione reggente.<br><br>Essa dipende da verbi che esprimono un'affermazione, una percezione, un'opinione o una volontà (e che <span style='color: #2980b9; font-weight: bold;'>hanno già un loro soggetto</span>, espresso o sottinteso!), come:<br>• <em>dire, affermare, promettere, sentire, credere, volere, aspettare, desiderare...</em><br><br><em>Esempio:</em> <span style='color: #e74c3c; font-weight: bold;'>Il cuoco assicura</span> (principale col soggetto \"il cuoco\") <span style='color: #27ae60; font-weight: bold;'>che la torta è pronta</span> (oggettiva).",
            "text": "La proposizione oggettiva svolge la funzione di:",
            "options": [
                "Soggetto",
                "Complemento Oggetto"
            ],
            "answer": "Complemento Oggetto"
        }
    ],
    "allenati": [
        {
            "id": 911,
            "type": "classification-grid",
            "title": "Soggettive Esplicite e Implicite",
            "instruction": "Leggi le seguenti proposizioni SOGGETTIVE (in rosso) e classificale in ESPLICITE (verbo di modo finito) o IMPLICITE (verbo all'infinito).",
            "words": [
                "Pare <span style='color: red; font-weight: bold;'>che domani nevicherà in montagna</span>.",
                "È bello <span style='color: red; font-weight: bold;'>passeggiare nel bosco in autunno</span>.",
                "Bisognerebbe <span style='color: red; font-weight: bold;'>studiare di più per l'esame</span>.",
                "È noto a tutti <span style='color: red; font-weight: bold;'>che Roma è la capitale d'Italia</span>."
            ],
            "categories": [
                "Esplicita",
                "Implicita"
            ],
            "answers": {
                "Pare <span style='color: red; font-weight: bold;'>che domani nevicherà in montagna</span>.": "Esplicita",
                "È bello <span style='color: red; font-weight: bold;'>passeggiare nel bosco in autunno</span>.": "Implicita",
                "Bisognerebbe <span style='color: red; font-weight: bold;'>studiare di più per l'esame</span>.": "Implicita",
                "È noto a tutti <span style='color: red; font-weight: bold;'>che Roma è la capitale d'Italia</span>.": "Esplicita"
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

print("Updated udaPeriodo8 and udaPeriodo9")

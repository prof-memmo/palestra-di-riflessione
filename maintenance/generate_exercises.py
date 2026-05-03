import json
import os

exercisesData = {
    "riflessione": {
        "grammaticale": {},
        "analisiLogica": {},
        "analisiPeriodo": {}
    },
    "lettura": {
        "antologiche": {
            "a1": [
                {
                    "id": 5001,
                    "title": "IL MISTERO DEL BOSCO",
                    "text": "NEL BOSCO DI ABETI UN PICCOLO GUFO DORMEVA TRANQUILLO.",
                    "question": "QUALE ANIMALE DORMEVA NEL BOSCO?",
                    "options": ["UN GUFO", "UNO SCOIATTOLO"],
                    "answer": "UN GUFO"
                }
            ],
            "a2": [
                {
                    "id": 5002,
                    "title": "L'ISOLA DEL TESORO",
                    "text": "IL PIRATA NASCOSE IL TESORO NELLA GROTTA SEGRETA.",
                    "question": "DOVE NASCOSE IL TESORO IL PIRATA?",
                    "options": ["NELLA GROTTA", "SULLA NAVE"],
                    "answer": "NELLA GROTTA",
                    "feedback": {"map": "IL LUOGO È LA GROTTA SEGRETA."}
                }
            ]
        }
    },
    "lessico": {
        "natura": {
            "facile": [{"id": 6001, "title": "ALBERI E FIORI", "type": "multiple-choice", "text": "QUALE DI QUESTI È UN ALBERO?", "options": ["QUERCIA", "ROSA"], "answer": "QUERCIA", "feedback": {"map": "LA QUERCIA È UN ALBERO SECOLARE."}}],
            "intermedio": [{"id": 6002, "title": "ANIMALI DEL BOSCO", "type": "multiple-choice", "text": "CHI VIVE NEL BOSCO?", "options": ["VOLPE", "DELFINO"], "answer": "VOLPE"}],
            "avanzato": [{"id": 6003, "title": "FENOMENI ATMOSFERICI", "type": "multiple-choice", "text": "COSA PORTA LA PIOGGIA?", "options": ["NUVOLE", "SOLE"], "answer": "NUVOLE"}],
            "sfida": [{"id": 6004, "title": "ECOSISTEMA", "type": "multiple-choice", "text": "COSA FANNO LE PIANTE?", "options": ["FOTOSINTESI", "RESPIRANO SOLO"], "answer": "FOTOSINTESI"}]
        },
        "scuola": {
            "facile": [{"id": 6101, "title": "OGGETTI", "type": "multiple-choice", "text": "COSA USI PER SCRIVERE?", "options": ["PENNA", "GOMMA"], "answer": "PENNA"}],
            "intermedio": [{"id": 6102, "title": "MATERIE", "type": "multiple-choice", "text": "STUDIO DEI NUMERI:", "options": ["MATEMATICA", "STORIA"], "answer": "MATEMATICA"}],
            "avanzato": [{"id": 6103, "title": "RUOLI", "type": "multiple-choice", "text": "CHI INSEGNA?", "options": ["PROFESSORE", "BIDELLO"], "answer": "PROFESSORE"}],
            "sfida": [{"id": 6104, "title": "ISTITUZIONE", "type": "multiple-choice", "text": "CHI DIRIGE LA SCUOLA?", "options": ["DIRIGENTE", "SEGRETARIO"], "answer": "DIRIGENTE"}]
        },
        "emozioni": {
            "facile": [{"id": 6201, "title": "GIOIA", "type": "multiple-choice", "text": "COSA FAI QUANDO SEI FELICE?", "options": ["SORRIDI", "PIANGI"], "answer": "SORRIDI"}],
            "intermedio": [{"id": 6202, "title": "PAURA", "type": "multiple-choice", "text": "COSA TI FA PAURA?", "options": ["BUIO", "SOLE"], "answer": "BUIO"}],
            "avanzato": [{"id": 6203, "title": "RABBIA", "type": "multiple-choice", "text": "COME TI SENTI QUANDO SEI ARRABBIATO?", "options": ["FURIOSO", "CALMO"], "answer": "FURIOSO"}],
            "sfida": [{"id": 6204, "title": "EMPATIA", "type": "multiple-choice", "text": "CAPIRE GLI ALTRI È:", "options": ["EMPATIA", "SIMPATIA"], "answer": "EMPATIA"}]
        }
    },
    "produzione": {
        "descrizione": {
            "persona": {
                "facile": [{"id": 7001, "title": "ASPETTO FISICO", "type": "multiple-choice", "text": "DESCRIVI I CAPELLI:", "options": ["BIONDI", "ALTI"], "answer": "BIONDI"}],
                "intermedio": [{"id": 7002, "title": "CARATTERE", "type": "multiple-choice", "text": "PERSONA CHE AIUTA:", "options": ["ALTRUISTA", "EGOISTA"], "answer": "ALTRUISTA"}],
                "avanzato": [{"id": 7003, "title": "ABBIGLIAMENTO", "type": "multiple-choice", "text": "VESTITO ELEGANTE:", "options": ["SMOKING", "TUTA"], "answer": "SMOKING"}],
                "sfida": [{"id": 7004, "title": "RITRATTO COMPLETO", "type": "multiple-choice", "text": "DESCRIVERE IL CARATTERE È UN'ANALISI:", "options": ["PSICOLOGICA", "FISICA"], "answer": "PSICOLOGICA"}]
            },
            "animali": {
                "facile": [{"id": 7101, "title": "IL CANE", "type": "multiple-choice", "text": "VERSO DEL CANE:", "options": ["ABBAIA", "MIAGOLA"], "answer": "ABBAIA"}],
                "intermedio": [{"id": 7102, "title": "HABITAT", "type": "multiple-choice", "text": "DOVE VIVE IL LEONE?", "options": ["SAVANA", "POLO"], "answer": "SAVANA"}],
                "avanzato": [{"id": 7103, "title": "CARATTERISTICS", "type": "multiple-choice", "text": "ANIMALE CON LA TROMBA:", "options": ["ELEFANTE", "GIRAFFA"], "answer": "ELEFANTE"}],
                "sfida": [{"id": 7104, "title": "CLASSIFICAZIONE", "type": "multiple-choice", "text": "LA BALENA È UN:", "options": ["MAMMIFERO", "PESCE"], "answer": "MAMMIFERO"}]
            }
        },
        "riassunto": {
            "facile": [{"id": 7201, "title": "IDEA PRINCIPALE", "type": "multiple-choice", "text": "COSA RIASSUMERE?", "options": ["I PUNTI CHIAVE", "TUTTO IL TESTO"], "answer": "I PUNTI CHIAVE"}],
            "intermedio": [{"id": 7202, "title": "SEQUENZE", "type": "multiple-choice", "text": "DIVIDERE IL TESTO IN:", "options": ["SEQUENZE LOGICHE", "PARAGRAFI A CASO"], "answer": "SEQUENZE LOGICHE"}],
            "avanzato": [{"id": 7203, "title": "CONNETTIVI", "type": "multiple-choice", "text": "PAROLE DI LEGAME:", "options": ["QUINDI", "FORSE"], "answer": "QUINDI"}],
            "sfida": [{"id": 7204, "title": "SINTESI", "type": "multiple-choice", "text": "IL RIASSUNTO DEVE ESSERE:", "options": ["CONCISO", "PROLISSO"], "answer": "CONCISO"}]
        },
        "riformulazione": {
            "facile": [{"id": 7301, "title": "SINONIMI", "type": "multiple-choice", "text": "SINONIMO DI 'CASA':", "options": ["ABITAZIONE", "STRADA"], "answer": "ABITAZIONE"}],
            "intermedio": [{"id": 7302, "title": "CAMBIO STRUTTURA", "type": "multiple-choice", "text": "RIFORMULA 'IO MANGIO LA MELA':", "options": ["LA MELA È MANGIATA DA ME", "IO MANGIO"], "answer": "LA MELA È MANGIATA DA ME"}],
            "avanzato": [{"id": 7303, "title": "REGISTRO", "type": "multiple-choice", "text": "REGISTRO FORMALE:", "options": ["LA PREGO", "CIAO"], "answer": "LA PREGO"}],
            "sfida": [{"id": 7304, "title": "PARAFRASI", "type": "multiple-choice", "text": "SPIEGARE UNA POESIA È:", "options": ["PARAFRASI", "RIASSUNTO"], "answer": "PARAFRASI"}]
        }
    }
}

g = exercisesData["riflessione"]["grammaticale"]
l = exercisesData["riflessione"]["analisiLogica"]
p = exercisesData["riflessione"]["analisiPeriodo"]

# --- GRAMMATICA (1-13) ---
g["uda1"] = {
    "scopri": [{"id": 101, "title": "I 4 PILASTRI DELLA LINGUA", "theory": "La **GRAMMATICA** è l'insieme delle regole... Fonologia, Ortografia, Morfologia, Sintassi.", "text": "Studio della scrittura:", "options": ["Ortografia", "Sintassi"], "answer": "Ortografia", "feedback": {"map": "Ortografia = Scrivere bene."}}],
    "allenati": [{"id": 111, "type": "multiple-choice", "text": "Suoni = ?", "options": ["Fonologia", "Sintassi"], "answer": "Fonologia"}],
    "verifica": [{"id": 121, "type": "multiple-choice", "text": "Parole = ?", "options": ["Morfologia", "Sintassi"], "answer": "Morfologia"}],
    "recupera": {"title": "Recupero", "content": "Ripassa i pilastri.", "exercises": [{"id": 131, "text": "Suono = ___", "answer": "fonologia"}]}
}

for i in range(2, 14):
    titles = ["", "", "Fonologia", "Ortografia", "L'Articolo", "Il Nome", "Aggettivo Qualificativo", "Aggettivo Determinativo", "Il Pronome", "Verbo: Basi", "Verbo: Modi Finiti", "Verbo: Modo Indicativo", "Avverbio e Preposizione", "Congiunzione e Interiezione"]
    g[f"uda{i}"] = {
        "scopri": [{"id": 100*i+1, "title": titles[i], "theory": f"Teoria dettagliata per {titles[i]}...", "text": "Domanda di scoperta?", "options": ["Opzione A", "Opzione B"], "answer": "Opzione A", "feedback": {"map": f"Regola di {titles[i]}."}}],
        "allenati": [{"id": 100*i+11, "type": "multiple-choice", "text": "Esercizio di allenamento...", "options": ["A", "B"], "answer": "A"}],
        "verifica": [{"id": 100*i+21, "type": "multiple-choice", "text": "Esercizio di verifica...", "options": ["A", "B"], "answer": "A"}],
        "recupera": {"title": "Recupero", "content": "Consigli di recupero...", "exercises": [{"id": 100*i+31, "text": "...", "answer": "..."}]}
    }

# --- ANALISI LOGICA (1-13) ---
logica_titles = ["", "Frase Minima", "Attributo e Apposizione", "Il Soggetto", "Il Predicato", "Complemento Oggetto", "Luogo", "Tempo", "Specificazione", "Termine", "Agente e Causa", "Modo e Mezzo", "Causa e Fine", "Compagnia"]
for i in range(1, 14):
    l[f"udaLogica{i}"] = {
        "scopri": [{"id": 2000+100*i+1, "title": logica_titles[i], "theory": f"Teoria di Analisi Logica: {logica_titles[i]}...", "text": "Analizza:", "options": ["A", "B"], "answer": "A"}],
        "allenati": [{"id": 2000+100*i+11, "type": "multiple-choice", "text": "Esercizio...", "options": ["A", "B"], "answer": "A"}],
        "verifica": [{"id": 2000+100*i+21, "type": "multiple-choice", "text": "Verifica...", "options": ["A", "B"], "answer": "A"}],
        "recupera": {"title": "Recupero", "content": "Ripasso...", "exercises": [{"id": 2000+100*i+31, "text": "...", "answer": "..."}]}
    }

# --- ANALISI DEL PERIODO (1-12) ---
periodo_titles = ["", "Struttura", "La Principale", "Coordinazione", "Subordinazione", "Soggettive e Oggettive", "Dichiarative e Interrogative", "Relative", "Causali e Finali", "Temporali", "Concessive e Avversative", "Ipotetico", "Modali e Strumentali"]
for i in range(1, 13):
    p[f"udaPeriodo{i}"] = {
        "scopri": [{"id": 3000+100*i+1, "title": periodo_titles[i], "theory": f"Teoria di Analisi del Periodo: {periodo_titles[i]}...", "text": "Analizza il periodo:", "options": ["A", "B"], "answer": "A"}],
        "allenati": [{"id": 3000+100*i+11, "type": "multiple-choice", "text": "Esercizio...", "options": ["A", "B"], "answer": "A"}],
        "verifica": [{"id": 3000+100*i+21, "type": "multiple-choice", "text": "Verifica...", "options": ["A", "B"], "answer": "A"}],
        "recupera": {"title": "Recupero", "content": "Ripasso...", "exercises": [{"id": 3000+100*i+31, "text": "...", "answer": "..."}]}
    }

# Output
output_path = os.path.join("js", "exercises.js")
with open(output_path, "w", encoding="utf-8") as f:
    f.write(f"window.exercisesData = {json.dumps(exercisesData, indent=4, ensure_ascii=False)};\n\nif (typeof module !== 'undefined') module.exports = window.exercisesData;")

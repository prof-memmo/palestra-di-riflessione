import re

with open('js/main.js', 'r', encoding='utf-8') as f:
    text = f.read()

taxonomy_code = """
window.SA_TAXONOMY = {
    "analisiPeriodo": {
        "Principale": null,
        "Incidentale": null,
        "Coordinata": {
            "Tipo": ["Copulativa", "Avversativa", "Disgiuntiva", "Conclusiva", "Dichiarativa o Esplicativa", "Correlativa"]
        },
        "Subordinata": {
            "Grado": ["1° grado", "2° grado", "3° grado", "4° grado"],
            "Forma": ["Esplicita", "Implicita"],
            "Tipo": ["Soggettiva", "Oggettiva", "Dichiarativa", "Interrogativa Indiretta", "Relativa", "Causale", "Finale", "Temporale", "Locale", "Modale", "Strumentale", "Concessiva", "Condizionale", "Consecutiva", "Comparativa", "Avversativa", "Esclusiva", "Eccettuativa", "Limitativa"]
        }
    },
    "analisiLogica": {
        "Soggetto": null,
        "Predicato": {
            "Tipo": ["Verbale", "Nominale"]
        },
        "Attributo": null,
        "Apposizione": null,
        "Complemento Diretto": {
            "Tipo": ["Oggetto", "Dell'oggetto interno", "Predicativo del soggetto", "Predicativo dell'oggetto"]
        },
        "Complemento Indiretto": {
            "Tipo": ["Specificazione", "Termine", "Stato in luogo", "Moto a luogo", "Moto da luogo", "Moto per luogo", "Tempo determinato", "Tempo continuato", "Causa", "Fine o Scopo", "Modo", "Mezzo o Strumento", "Compagnia", "Unione", "D'agente", "Causa efficiente", "Denominazione", "Partitivo", "Origine o Provenienza", "Allontanamento o Separazione", "Materia", "Argomento", "Limitazione", "Paragone", "Età", "Pena", "Colpa", "Abbondanza", "Privazione", "Qualità", "Vantaggio", "Svantaggio", "Concessivo", "Esclusione", "Sostituzione o Scambio"]
        }
    },
    "grammaticale": {
        "Articolo": {
            "Tipo": ["Determinativo", "Indeterminativo", "Partitivo"],
            "Genere": ["Maschile", "Femminile"],
            "Numero": ["Singolare", "Plurale"]
        },
        "Nome": {
            "Tipo": ["Comune", "Proprio"],
            "Genere": ["Maschile", "Femminile", "Promiscuo", "Indipendente"],
            "Numero": ["Singolare", "Plurale", "Invariabile", "Difettivo", "Sovrabbondante"],
            "Struttura": ["Primitivo", "Derivato", "Alterato", "Composto"],
            "Significato": ["Concreto", "Astratto", "Individuale", "Collettivo"]
        },
        "Aggettivo": {
            "Categoria": ["Qualificativo", "Possessivo", "Dimostrativo", "Indefinito", "Interrogativo", "Esclamativo", "Numerale"],
            "Genere": ["Maschile", "Femminile", "Invariabile"],
            "Numero": ["Singolare", "Plurale", "Invariabile"],
            "Grado (solo Qualif.)": ["Positivo", "Comparativo di maggioranza", "Comparativo di minoranza", "Comparativo di uguaglianza", "Superlativo assoluto", "Superlativo relativo", "N/A"]
        },
        "Pronome": {
            "Categoria": ["Personale", "Possessivo", "Dimostrativo", "Indefinito", "Interrogativo", "Esclamativo", "Relativo", "Numerale"]
        },
        "Verbo": {
            "Coniugazione": ["Prima", "Seconda", "Terza", "Propria (essere/avere)"],
            "Modo": ["Indicativo", "Congiuntivo", "Condizionale", "Imperativo", "Infinito", "Participio", "Gerundio"],
            "Tempo": ["Presente", "Imperfetto", "Passato remoto", "Futuro semplice", "Passato prossimo", "Trapassato prossimo", "Trapassato remoto", "Futuro anteriore"],
            "Persona": ["1a singolare", "2a singolare", "3a singolare", "1a plurale", "2a plurale", "3a plurale", "N/A"]
        },
        "Preposizione": {
            "Tipo": ["Semplice", "Articolata", "Impropria"]
        },
        "Congiunzione": {
            "Tipo": ["Coordinante", "Subordinante"]
        },
        "Avverbio": {
            "Tipo": ["Di modo", "Di tempo", "Di luogo", "Di quantità", "Di affermazione", "Di negazione", "Di dubbio", "Interrogativo", "Esclamativo"]
        },
        "Interiezione": {
            "Tipo": ["Propria", "Impropria", "Locuzione esclamativa"]
        }
    }
};

window.renderSaCascading = (container, seg, existingValue) => {
    const path = window.currentPath || [];
    let context = 'grammaticale';
    if (path.includes('analisiLogica')) context = 'analisiLogica';
    if (path.includes('analisiPeriodo')) context = 'analisiPeriodo';

    const taxonomy = window.SA_TAXONOMY[context];
    const existingParts = existingValue ? existingValue.split(' - ') : [];
    
    let mainSelectHtml = `<select class="sa-select-main" style="padding:8px; border-radius:8px; border:1px solid #dfe6e9; background:#f8f9fa;">`;
    mainSelectHtml += `<option value="">Scegli...</option>`;
    for (const key in taxonomy) {
        const isSelected = existingParts[0] === key ? 'selected' : '';
        mainSelectHtml += `<option value="${key}" ${isSelected}>${key}</option>`;
    }
    mainSelectHtml += `</select>`;
    
    let subSelectsHtml = `<div class="sa-select-subs" style="display:flex; flex-wrap:wrap; gap:8px; margin-top:8px;">`;
    if (existingParts[0] && taxonomy[existingParts[0]]) {
        const subTax = taxonomy[existingParts[0]];
        let i = 1;
        for (const subKey in subTax) {
            const options = subTax[subKey];
            const selVal = existingParts[i] || '';
            subSelectsHtml += `<select class="sa-select-sub" data-subkey="${subKey}" style="padding:6px; border-radius:8px; border:1px solid #dfe6e9; background:#f8f9fa;">`;
            subSelectsHtml += `<option value="">${subKey}...</option>`;
            options.forEach(opt => {
                const isSel = selVal === opt ? 'selected' : '';
                subSelectsHtml += `<option value="${opt}" ${isSel}>${opt}</option>`;
            });
            subSelectsHtml += `</select>`;
            i++;
        }
    }
    subSelectsHtml += `</div>`;
    
    container.innerHTML = mainSelectHtml + subSelectsHtml;
    
    const mainSelect = container.querySelector('.sa-select-main');
    mainSelect.addEventListener('change', (e) => {
        window.renderSaCascading(container, seg, e.target.value);
    });
};
"""

buildSaLabels_old = """window.buildSaLabels = () => {
    const container = document.getElementById('sa-sentence');
    if (!container) return;
    const words = [...container.querySelectorAll('.sa-word')].map(s => s.textContent);
    const gaps = [...container.querySelectorAll('.sa-gap')];
    // Build segments by splitting at active gaps
    let segments = [];
    let current = [words[0]];
    gaps.forEach((g, i) => {
        if (g.classList.contains('active')) {
            segments.push(current.join(' '));
            current = [words[i + 1]];
        } else {
            current.push(words[i + 1]);
        }
    });
    segments.push(current.join(' '));

    const labelsDiv = document.getElementById('sa-labels');
    if (!labelsDiv) return;
    // Preserve existing input values
    const existing = {};
    labelsDiv.querySelectorAll('.sa-label-input').forEach(inp => {
        existing[inp.dataset.seg] = inp.value;
    });
    labelsDiv.innerHTML = segments.map((seg, i) => `
        <div class="sa-label-row">
            <span class="sa-label-num">${i + 1}.</span>
            <span class="sa-label-segment">${seg}</span>
            <input class="sa-label-input" data-seg="${seg}" placeholder="Funzione / parte del discorso..." value="${existing[seg] || ''}">
        </div>
    `).join('');
};"""

buildSaLabels_new = """window.buildSaLabels = () => {
    const container = document.getElementById('sa-sentence');
    if (!container) return;
    const words = [...container.querySelectorAll('.sa-word')].map(s => s.textContent);
    const gaps = [...container.querySelectorAll('.sa-gap')];
    
    let segments = [];
    let current = [words[0]];
    gaps.forEach((g, i) => {
        if (g.classList.contains('active')) {
            segments.push(current.join(' '));
            current = [words[i + 1]];
        } else {
            current.push(words[i + 1]);
        }
    });
    segments.push(current.join(' '));

    const labelsDiv = document.getElementById('sa-labels');
    if (!labelsDiv) return;
    
    const existing = {};
    labelsDiv.querySelectorAll('.sa-cascading-container').forEach(c => {
        const seg = c.dataset.seg;
        const selects = [...c.querySelectorAll('select')];
        const values = selects.map(s => s.value).filter(v => v !== '');
        existing[seg] = values.join(' - ');
    });

    labelsDiv.innerHTML = segments.map((seg, i) => `
        <div class="sa-label-row" style="background:#fff;padding:12px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.05); border-left: 4px solid var(--primary-color); margin-bottom: 12px; display: flex; flex-direction: column;">
            <div style="font-weight:700;font-size:1.1rem;color:#2c3e50;margin-bottom:8px;">${i + 1}. ${seg}</div>
            <div class="sa-cascading-container" data-seg="${seg}"></div>
        </div>
    `).join('');

    labelsDiv.querySelectorAll('.sa-cascading-container').forEach(c => {
        window.renderSaCascading(c, c.dataset.seg, existing[c.dataset.seg] || '');
    });
};"""


checkSa_old = """    const userLabels = [...document.querySelectorAll('.sa-label-input')].map(i => i.value.trim());"""
checkSa_new = """    const userLabels = [...document.querySelectorAll('.sa-cascading-container')].map(container => {
        const selects = [...container.querySelectorAll('select')];
        const values = selects.map(s => s.value).filter(v => v !== '');
        return values.join(' - ');
    });"""


text = text.replace('// ─── sentence-analysis helpers ────────────────────────────────────', '// ─── sentence-analysis helpers ────────────────────────────────────\n' + taxonomy_code)
text = text.replace(buildSaLabels_old, buildSaLabels_new)
text = text.replace(checkSa_old, checkSa_new)

with open('js/main.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Patched main.js")

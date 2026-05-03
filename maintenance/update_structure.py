import json
import re

# Update js/main.js
with open('js/main.js', 'r', encoding='utf-8') as f:
    main_js = f.read()

# Replace menu items
menu_pattern = r"'analisiPeriodo': \{ title: 'Analisi del Periodo', parent: 'riflessione', type: 'submenu', items: \[\n.*?\]\},"
new_menu = """'analisiPeriodo': { title: 'Analisi del Periodo', parent: 'riflessione', type: 'submenu', items: [
        { id: 'udaPeriodo1', title: 'Il periodo', icon: '⏳', type: 'uda' },
        { id: 'udaPeriodo2', title: 'La proposizione principale', icon: '🏠', type: 'uda' },
        { id: 'udaPeriodo3', title: 'La proposizione interrogativa', icon: '❓', type: 'uda' },
        { id: 'udaPeriodo4', title: 'La proposizione incidentale', icon: '💬', type: 'uda' },
        { id: 'udaPeriodo5', title: 'La proposizione coordinata', icon: '🔗', type: 'uda' },
        { id: 'udaPeriodo6', title: 'La proposizione subordinata', icon: '🪜', type: 'uda' },
        { id: 'udaPeriodo7', title: 'La proposizione soggettiva', icon: '👤', type: 'uda' },
        { id: 'udaPeriodo8', title: 'La proposizione oggettiva', icon: '🎯', type: 'uda' },
        { id: 'udaPeriodo9', title: 'La proposizione dichiarativa', icon: '📣', type: 'uda' },
        { id: 'udaPeriodo10', title: 'La proposizione relativa', icon: '📎', type: 'uda' },
        { id: 'udaPeriodo11', title: 'La proposizione causale', icon: '💡', type: 'uda' },
        { id: 'udaPeriodo12', title: 'La proposizione finale', icon: '🏁', type: 'uda' },
        { id: 'udaPeriodo13', title: 'La proposizione temporale', icon: '🕒', type: 'uda' }
    ]},"""

main_js = re.sub(menu_pattern, new_menu, main_js, flags=re.DOTALL)

# Replace paths
paths_pattern = r"    'udaPeriodo1': \{ type: 'uda', parent: 'analisiPeriodo' \},.*?    'uda_per_guidata3': \{ type: 'uda', parent: 'analisiPeriodo' \},"
new_paths = "\n".join([f"    'udaPeriodo{i}': {{ type: 'uda', parent: 'analisiPeriodo' }}," for i in range(1, 14)])
main_js = re.sub(paths_pattern, new_paths, main_js, flags=re.DOTALL)

with open('js/main.js', 'w', encoding='utf-8') as f:
    f.write(main_js)


# Update js/exercises.js
with open('js/exercises.js', 'r', encoding='utf-8') as f:
    text = f.read()

prefix = 'window.exercisesData = '
json_str = text[len(prefix):].strip()
if json_str.endswith(';'):
    json_str = json_str[:-1]

data = json.loads(json_str)

# Extract existing data from udaPeriodo1
existing_uda = data['riflessione']['analisiPeriodo'].get('udaPeriodo1', {})
scopri_items = existing_uda.get('scopri', [])
allenati_items = existing_uda.get('allenati', [])

# Create empty structure for 1 to 13
new_analisiPeriodo = {}

# udaPeriodo1: Il periodo
new_analisiPeriodo['udaPeriodo1'] = {
    "scopri": [ s for s in scopri_items if s['id'] == 3101 ],
    "allenati": [],
    "verifica": [],
    "recupera": []
}

# udaPeriodo2: La proposizione principale
new_analisiPeriodo['udaPeriodo2'] = {
    "scopri": [ s for s in scopri_items if s['id'] in [3102, 3104] ],
    "allenati": [ a for a in allenati_items if a['id'] in [3111, 3113] ],
    "verifica": [],
    "recupera": []
}

# udaPeriodo5: La proposizione coordinata (I'll put the coordination stuff here)
new_analisiPeriodo['udaPeriodo5'] = {
    "scopri": [ s for s in scopri_items if s['id'] == 3103 ],
    "allenati": [ a for a in allenati_items if a['id'] == 3112 ],
    "verifica": [],
    "recupera": []
}

titles = {
    3: "La proposizione interrogativa",
    4: "La proposizione incidentale",
    6: "La proposizione subordinata",
    7: "La proposizione soggettiva",
    8: "La proposizione oggettiva",
    9: "La proposizione dichiarativa",
    10: "La proposizione relativa",
    11: "La proposizione causale",
    12: "La proposizione finale",
    13: "La proposizione temporale"
}

for i in range(3, 14):
    if i == 5:
        continue
    new_analisiPeriodo[f'udaPeriodo{i}'] = {
        "scopri": [
            {
                "id": int(f"3{i:02d}1"),
                "title": titles[i],
                "theory": "Lezione in arrivo...",
                "text": "Sei pronto?",
                "options": ["Sì", "No"],
                "answer": "Sì"
            }
        ],
        "allenati": [],
        "verifica": [],
        "recupera": []
    }

data['riflessione']['analisiPeriodo'] = new_analisiPeriodo

new_json_str = json.dumps(data, indent=4, ensure_ascii=False)
final_text = prefix + new_json_str + ';\n'

with open('js/exercises.js', 'w', encoding='utf-8') as f:
    f.write(final_text)

print("Updated main.js and exercises.js")

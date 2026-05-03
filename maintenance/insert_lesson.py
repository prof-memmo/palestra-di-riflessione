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
        { id: 'udaPeriodo5', title: 'I rapporti di coordinazione e subordinazione', icon: '🤝', type: 'uda' },
        { id: 'udaPeriodo6', title: 'La proposizione coordinata', icon: '🔗', type: 'uda' },
        { id: 'udaPeriodo7', title: 'La proposizione subordinata', icon: '🪜', type: 'uda' },
        { id: 'udaPeriodo8', title: 'La proposizione soggettiva', icon: '👤', type: 'uda' },
        { id: 'udaPeriodo9', title: 'La proposizione oggettiva', icon: '🎯', type: 'uda' },
        { id: 'udaPeriodo10', title: 'La proposizione dichiarativa', icon: '📣', type: 'uda' },
        { id: 'udaPeriodo11', title: 'La proposizione relativa', icon: '📎', type: 'uda' },
        { id: 'udaPeriodo12', title: 'La proposizione causale', icon: '💡', type: 'uda' },
        { id: 'udaPeriodo13', title: 'La proposizione finale', icon: '🏁', type: 'uda' },
        { id: 'udaPeriodo14', title: 'La proposizione temporale', icon: '🕒', type: 'uda' }
    ]},"""

main_js = re.sub(menu_pattern, new_menu, main_js, flags=re.DOTALL)

# Add udaPeriodo14 to the paths
if "'udaPeriodo14':" not in main_js:
    # Find the last udaPeriodo path and insert after it
    paths_pattern = r"(    'udaPeriodo13': \{ type: 'uda', parent: 'analisiPeriodo' \},)"
    main_js = re.sub(paths_pattern, r"\1\n    'udaPeriodo14': { type: 'uda', parent: 'analisiPeriodo' },", main_js)

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

analisi = data['riflessione']['analisiPeriodo']

titles = {
    6: "La proposizione coordinata",
    7: "La proposizione subordinata",
    8: "La proposizione soggettiva",
    9: "La proposizione oggettiva",
    10: "La proposizione dichiarativa",
    11: "La proposizione relativa",
    12: "La proposizione causale",
    13: "La proposizione finale",
    14: "La proposizione temporale"
}

# The content of udaPeriodo5 is already the "Coordinazione e Subordinazione" theory and exercises.
# We just need to recreate 6 to 14.
for i in range(6, 15):
    analisi[f'udaPeriodo{i}'] = {
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

new_json_str = json.dumps(data, indent=4, ensure_ascii=False)
final_text = prefix + new_json_str + ';\n'

with open('js/exercises.js', 'w', encoding='utf-8') as f:
    f.write(final_text)

print("Updated main.js and exercises.js for new lesson 5")

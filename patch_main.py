with open('js/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the 'produzione' definition in MATERIE_HIERARCHY
start_idx = content.find("'produzione': {")
if start_idx != -1:
    end_items = content.find("],", start_idx)
    if end_items != -1:
        # Check if 'esposizione' already exists
        if "'esposizione'" not in content[start_idx:end_items]:
            new_items = ",\n            { id: 'esposizione', title: 'Esposizione Orale', icon: '🗣️', type: 'exercises' },\n            { id: 'dizionario', title: 'Il Dizionario', icon: '📖', type: 'exercises' }"
            content = content[:end_items] + new_items + content[end_items:]

# Add leaf definitions
leaf_idx = content.find("'riassunto': { type: 'submenu', parent: 'produzione' },")
if leaf_idx != -1:
    if "'esposizione': {" not in content:
        new_leafs = "    'esposizione': { type: 'exercises', parent: 'produzione' },\n    'dizionario': { type: 'exercises', parent: 'produzione' },\n"
        content = content[:leaf_idx] + new_leafs + content[leaf_idx:]

with open('js/main.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("main.js updated")

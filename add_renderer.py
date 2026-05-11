with open('js/ui.js', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Find renderLessico
start_idx = content.find("renderLessico: (exercise, isUda, path, total) => {")
end_idx = content.find("    renderLogica: ", start_idx)

if start_idx != -1 and end_idx != -1:
    lessico_func = content[start_idx:end_idx]
    
    desc_func = lessico_func.replace("renderLessico", "renderDescrizione")
    desc_func = desc_func.replace("📚 LESSICO E SIGNIFICATI", "🖼️ DESCRIZIONE E TESTO")
    desc_func = desc_func.replace("'lessico'", "'descrizione'")
    
    new_content = content[:start_idx] + desc_func + lessico_func + content[end_idx:]
    with open('js/ui.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Success")
else:
    print("Not found")

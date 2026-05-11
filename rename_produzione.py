with open('js/ui.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('renderDescrizione:', 'renderProduzione:')
content = content.replace('<span>🖼️ DESCRIZIONE E TESTO</span>', '<span>📝 LABORATORIO DI PRODUZIONE</span>')

with open('js/ui.js', 'w', encoding='utf-8') as f:
    f.write(content)

with open('js/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('window.UI.renderDescrizione(exercise', 'window.UI.renderProduzione(exercise')

with open('js/main.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Renamed to renderProduzione")

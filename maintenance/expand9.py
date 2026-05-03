import re

with open('js/exercises.js', 'r', encoding='utf-8') as f:
    content = f.read()

additions = {
    8035: " A volte le cose più strane e apparentemente inspiegabili hanno le soluzioni più buffe e inaspettate di tutte.",
    8036: " La famiglia Rossi capì che l'eccessiva dipendenza dalla tecnologia moderna può nascondere insidie totalmente invisibili e imprevedibili.",
    8037: " Il viaggio in solitaria è un'esperienza che auguro davvero a chiunque desideri conoscersi a fondo.",
    8038: " Spero di ricevere una tua risposta, anche piccolissima, per me significherebbe il mondo intero.",
    8039: " Affrontare questa tematica complessa e ricca di sfumature con intelligenza critica è il nostro dovere assoluto per il futuro e per il bene psicologico dei giovani."
}

def expand_texts():
    global content
    for id_val, addition in additions.items():
        pattern = r'("id": ' + str(id_val) + r',.*?"text": ")(.*?)(")'
        match = re.search(pattern, content, re.DOTALL)
        if match:
            old_text = match.group(2)
            new_text = old_text + addition
            full_old = match.group(0)
            full_new = match.group(1) + new_text + match.group(3)
            content = content.replace(full_old, full_new)
        else:
            print(f"Could not find ID {id_val}")
            
expand_texts()

with open('js/exercises.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated texts successfully.")

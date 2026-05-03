import re

with open('js/exercises.js', 'r', encoding='utf-8') as f:
    content = f.read()

additions = {
    8020: " Esplorare l'universo infinito significa spingersi oltre i propri limiti, affrontare con grande coraggio l'ignoto siderale e abbracciare ogni nuova scoperta come un passo fondamentale verso il futuro radioso dell'umanità.",
    8021: " Quel magico orologio da taschino divenne il suo segreto più prezioso, ricordandole ogni singolo giorno che, con un pizzico di fantasia e tanto coraggio nel cuore, niente è davvero impossibile.",
    8022: " Non dobbiamo mai dimenticare il prezioso bambino interiore che continua a vivere e a giocare felice dentro di noi, perché è proprio lui a darci la vera forza di sognare in grande.",
    8023: " Il suo straordinario esempio di vita e di lavoro ci sprona ad affrontare lo studio dell'universo infinito non con timore, ma con immensa meraviglia, gioia genuina e grande umiltà di spirito.",
    8024: " Quel momento storico inciso per sempre sulla Luna ci ricorda costantemente che, unendo le nostre forze intellettuali e morali, possiamo davvero superare qualsiasi confine e toccare letteralmente il cielo con un dito.",
    
    8035: " Da quel giorno, il piccolo Tommaso divenne l'aiutante ufficiale della pasticceria, imparando a preparare dolci deliziosi.",
    8036: " La pace domestica fu ristabilita e i robot tornarono a essere solo dei semplici aiutanti silenziosi e ubbidienti.",
    8038: " Spero un giorno di poterti abbracciare in prima fila durante un tuo concerto indimenticabile e spettacolare.",
    8039: " Sta a noi utilizzare questi mezzi con grande intelligenza, traendo il massimo beneficio per la nostra mente.",
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

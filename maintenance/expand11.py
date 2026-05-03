import re

with open('js/exercises.js', 'r', encoding='utf-8') as f:
    content = f.read()

additions = {
    8020: " Ogni nuovo pianeta, ogni stella cadente e ogni nebulosa colorata rappresentano una lezione preziosissima da custodire. La 'Stella Cadente' continuerà per sempre la sua coraggiosa e lunghissima missione di esplorazione spaziale, portando ovunque pace e luce.",
    8021: " Così, la coraggiosissima bambina imparò che anche il sogno più strano e zuccheroso può diventare una realtà tangibile e indimenticabile, purché si abbia la forza di crederci fino in fondo senza esitare.",
    8022: " E proprio in questo spirito, ogni sera racconto volentieri quelle vecchie storie meravigliose e divertenti, sperando che non vengano mai dimenticate dalle nuove generazioni.",
    8023: " Ricorderemo per sempre il suo sorriso sincero, i suoi occhi brillanti, il suo profondo amore per gli animali e la sua sconfinata curiosità intellettuale che ha illuminato l'Italia intera e tutto il vasto mondo accademico globale.",
    8024: " Questa straordinaria ed epica avventura ci insegna definitivamente che nessun ostacolo, per quanto immenso o lontano, è davvero insuperabile per chi è guidato dal sincero amore per la scienza e dalla forte volontà di esplorare l'infinito cosmo.",
    8035: " I due nuovi amici passarono l'intero pomeriggio tra nuvole di farina bianca e profumo inebriante di vaniglia zuccherata, ridendo a crepapelle ogni volta che il pappagallo provava a rubare un'altra piccola e gustosa briciola dal tavolo di legno.",
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

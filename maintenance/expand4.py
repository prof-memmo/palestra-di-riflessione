import re

with open('js/exercises.js', 'r', encoding='utf-8') as f:
    content = f.read()

additions = {
    8015: " Dopotutto, la vera felicità si trova anche nel benessere del nostro corpo in movimento.",
}

additions[8020] = " \\n\\nIl primo pianeta che visitarono dopo aver ricevuto la mappa fu un mondo completamente coperto da oceani di liquido fosforescente. Lì, incontrarono strane creature marine simili a delfini volanti che parlavano attraverso bolle colorate. Kira e Z-99 riuscirono a farsi capire usando un traduttore universale e scoprirono che il pianeta nascondeva un antico tempio sommerso pieno di cristalli di energia pura. Questi cristalli potevano alimentare una città intera per mille anni! Fu un'avventura entusiasmante che arricchì le loro conoscenze scientifiche e li preparò alla sfida finale: trovare la galassia di puro cristallo e scoprire i suoi segreti."

additions[8021] = " \\n\\nMa le sorprese non erano finite. Prima che Sofia tornasse a casa, il re organizzò un grande banchetto in suo onore, con tavoli fatti di cioccolato e sedie di marzapane morbido. Tutti gli abitanti del paese magico, compresi gli scoiattoli a pois e i draghi gentili, parteciparono alla festa ballando fino a tarda notte al suono di strumenti musicali fatti di caramelle. Sofia si addormentò felice e si svegliò nel suo letto, stringendo forte il piccolo orologio da taschino che ticchettava dolcemente, pronta per sognare ancora."

additions[8022] = " \\n\\nOggi, quando guardo i bambini giocare nei parchi con i loro smartphone e i tablet, provo un po' di nostalgia per quell'epoca in cui ci bastava un pezzo di gesso per disegnare la campana sull'asfalto e saltare per ore. Spero davvero di poter trasmettere ai miei figli la stessa gioia delle piccole cose, insegnando loro ad apprezzare la bellezza di un pomeriggio all'aria aperta, sporcandosi le mani di terra e sbucciandosi le ginocchia per inseguire una farfalla."

additions[8023] = " \\n\\nAncora oggi, l'eredità di Margherita Hack continua a ispirare migliaia di giovani studenti, in particolare le ragazze, a intraprendere con coraggio la strada della ricerca scientifica. La sua stella, proprio come quelle che ha studiato per tutta la vita, continuerà a brillare per sempre nel firmamento della storia e nei nostri cuori, ricordandoci di essere sempre curiosi e affamati di nuova conoscenza."

additions[8024] = " \\n\\nAncora oggi, quelle famose parole pronunciate da Neil Armstrong ('Un piccolo passo per un uomo, ma un grande balzo per l'umanità') risuonano come un inno alla speranza e al progresso scientifico. L'allunaggio ha ispirato generazioni di scienziati, ingegneri e sognatori, aprendo la strada a nuove missioni spaziali sempre più ambiziose, come i futuri viaggi verso Marte e oltre."

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

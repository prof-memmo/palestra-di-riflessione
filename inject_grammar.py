import json
import re

import solutions_grammar
import solutions_logica
import solutions_periodo

# Merge all solutions into a single dictionary
all_solutions = {}
all_solutions.update(solutions_grammar.solutions)
all_solutions.update(solutions_logica.solutions)
all_solutions.update(solutions_periodo.solutions)

with open("js/exercises.js", "r") as f:
    content = f.read()

start = content.find('{')
end = content.rfind('}') + 1
json_str = content[start:end]

try:
    data = json.loads(json_str)
    
    injected_count = 0
    
    for category in ["riflessione", "analisiLogica", "analisiPeriodo"]:
        if category in data:
            if category == "riflessione":
                # handle "grammaticale" subsection
                sub_cats = data[category].values()
            else:
                sub_cats = [data[category]]
                
            for cat_data in sub_cats:
                for uda_key, uda_val in cat_data.items():
                    if "allenati" in uda_val:
                        for ex in uda_val["allenati"]:
                            if ex.get("type") in ["sentence-analysis", "period-analysis", "logical-analysis"]:
                                ex_id = ex.get("id")
                                if ex_id in all_solutions:
                                    if "answer" not in ex:
                                        ex["answer"] = all_solutions[ex_id]
                                        injected_count += 1

    # Convert the updated data back to string
    new_json_str = json.dumps(data, indent=4, ensure_ascii=False)
    
    # We need to preserve the `window.exercisesData = ` part
    new_content = content[:start] + new_json_str + content[end:]
    
    with open("js/exercises.js", "w") as out:
        out.write(new_content)
        
    print(f"Successfully injected answers for {injected_count} sentences.")

except Exception as e:
    print("Error parsing JSON:", e)

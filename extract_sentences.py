import json
import re

with open("js/exercises.js", "r") as f:
    content = f.read()

# We need to extract the JSON part.
# The structure is window.exercisesData = { "riflessione": ... };
start = content.find('{')
end = content.rfind('}') + 1
json_str = content[start:end]

try:
    data = json.loads(json_str)
    
    missing_answers = []
    
    # Actually, the structure is data["riflessione"]["grammaticale"]
    riflessione = data.get("riflessione", {})
    
    for category_name, category_data in riflessione.items():
        for uda_key, uda_val in category_data.items():
            if "allenati" in uda_val:
                for ex in uda_val["allenati"]:
                    if ex.get("type") in ["sentence-analysis", "period-analysis", "logical-analysis"]:
                        if "answer" not in ex:
                            missing_answers.append({
                                "category": category_name,
                                "uda": uda_key,
                                "id": ex.get("id"),
                                "sentence": ex.get("sentence"),
                                "type": ex.get("type")
                            })

    with open("missing_answers.json", "w") as out:
        json.dump(missing_answers, out, indent=2, ensure_ascii=False)
    print(f"Found {len(missing_answers)} sentences missing answers.")

except Exception as e:
    print("Error parsing JSON:", e)

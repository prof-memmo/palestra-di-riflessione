import json

with open('js/exercises.js', 'r', encoding='utf-8') as f:
    text = f.read()

prefix = 'window.exercisesData = '
json_str = text[len(prefix):].strip()
if json_str.endswith(';'): json_str = json_str[:-1]

data = json.loads(json_str)

def inject_answer(obj):
    if isinstance(obj, dict):
        if obj.get('id') == 1602:
            obj['answer'] = [
                {"segment": "La", "label": "articolo determinativo"},
                {"segment": "mamma", "label": "nome"},
                {"segment": "ha preparato", "label": "verbo"},
                {"segment": "una", "label": "articolo indeterminativo"},
                {"segment": "torta", "label": "nome"},
                {"segment": "deliziosa.", "label": "aggettivo"}
            ]
        for v in obj.values():
            inject_answer(v)
    elif isinstance(obj, list):
        for item in obj:
            inject_answer(item)

inject_answer(data)

new_json_str = json.dumps(data, indent=4, ensure_ascii=False)
final_text = prefix + new_json_str + ';\n'

with open('js/exercises.js', 'w', encoding='utf-8') as f:
    f.write(final_text)

print("Patched exercise 1602 with a test answer")

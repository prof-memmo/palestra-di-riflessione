import json
import re

with open("js/exercises.js", "r") as f:
    content = f.read()

start = content.find('{')
end = content.rfind('}') + 1
json_str = content[start:end]

try:
    data = json.loads(json_str)
    
    fixed_count = 0
    
    # Recursive function to find and fix the text
    def fix_exercises(node):
        global fixed_count
        if isinstance(node, dict):
            if "text" in node and isinstance(node["text"], str) and "(___)" in node["text"]:
                # Look for <span style="color:#...;font-weight:bold"> or similar and strip the color
                original = node["text"]
                # Regex to match color in style
                pattern = r'<span style="color:#[0-9a-fA-F]{3,6};font-weight:bold">'
                replaced = re.sub(pattern, '<span style="font-weight:bold">', original)
                if replaced != original:
                    node["text"] = replaced
                    fixed_count += 1
            for k, v in node.items():
                fix_exercises(v)
        elif isinstance(node, list):
            for item in node:
                fix_exercises(item)

    fix_exercises(data)
    
    if fixed_count > 0:
        new_json_str = json.dumps(data, indent=4, ensure_ascii=False)
        new_content = content[:start] + new_json_str + content[end:]
        with open("js/exercises.js", "w") as out:
            out.write(new_content)
        print(f"Fixed {fixed_count} exercises.")
    else:
        print("No exercises needed fixing.")

except Exception as e:
    print("Error:", e)

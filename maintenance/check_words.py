import re

with open('js/exercises.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the generi section
start_idx = content.find('"generi":')
if start_idx == -1:
    print("Could not find generi section.")
    exit(1)

# we just care about "text": "..." inside the file after "generi"
generi_content = content[start_idx:]

# Find all occurrences of "text": "..."
# Note: some texts might have escaped quotes, but our texts mostly use simple quotes or don't escape "
matches = re.finditer(r'"id": (\d+),.*?"title": "(.*?)",.*?"text": "(.*?)"', generi_content, re.DOTALL)

count = 0
for match in matches:
    id_val = match.group(1)
    title = match.group(2)
    text = match.group(3)
    
    # Remove HTML tags for counting
    clean_text = re.sub(r'<[^>]+>', '', text)
    words = clean_text.split()
    word_count = len(words)
    
    if word_count < 600:
        print(f"SHORT: id {id_val} - {title} - {word_count} parole")
        count += 1
    else:
        print(f"OK: id {id_val} - {title} - {word_count} parole")

print(f"\nTotal short texts: {count}")

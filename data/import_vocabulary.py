import json
import re
from pathlib import Path
from pypdf import PdfReader

root = Path(__file__).parent
entries = []
for page in PdfReader(root / 'listening-spellings.pdf').pages:
    text = page.extract_text(extraction_mode='layout')
    for line in text.splitlines():
        if not re.match(r'^\s*\d+\s+[A-Za-z]', line) or 'George Street' in line:
            continue
        for match in re.finditer(r'(?:^|\s)(\d+)\s+([^\d]+?)(?=\s+\d+\s|$)', line):
            number, word = match.groups()
            word = re.sub(r'\s+', ' ', word).strip().lower()
            if word:
                entries.append({'number': int(number), 'word': word})
assert len(entries) > 1000, f'Unexpected extraction count: {len(entries)}'
words = []
for entry in entries:
    word = entry['word']
    variants = {'origin(s)': ['origin', 'origins'], 'dealing(with)': ['dealing with']}.get(word, [word])
    for variant in variants:
        if variant not in words:
            words.append(variant)
(root / 'listening-words.json').write_text(json.dumps(words, indent=2) + '\n')
(root / 'listening-source.json').write_text(json.dumps({'source': 'Language Academy listening blanks spelling list, May edition', 'entries': entries, 'uniqueWords': len(words)}, indent=2) + '\n')
print(json.dumps({'entries': len(entries), 'uniqueWords': len(words), 'lastEntry': entries[-1]}))

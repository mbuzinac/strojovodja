#!/usr/bin/env python3
"""Generira data/database.js isključivo iz MD datoteka u docs/."""
import json
import os
import random
import re
import shutil

random.seed(42)

BASE = os.path.join(os.path.dirname(__file__), '..')
THEORY_MD = os.path.join(BASE, 'docs', 'Prometni_i_signalni_propisi.md')
EXAM_MD = os.path.join(BASE, 'docs', 'Ispitna_pitanja_periodicni_ispiti.md')
IMAGES_SRC = os.path.join(BASE, 'docs', 'images')
IMAGES_DST = os.path.join(BASE, 'public', 'signals')
OUT_PATH = os.path.join(BASE, 'data', 'database.js')

GENERIC_WRONG = [
    'Nije propisano u signalnom pravilniku',
    'Vrijedi samo za teretne vlakove',
    'Primjenjuje se isključivo noću',
    'Odnosi se samo na jednokolosiječne pruge',
]

CAT_KEYWORDS = {
    'osnovni-pojmovi': [
        'kolodvor', 'kolosijek', 'pruga', 'pružn', 'stajalište', 'rasputnica',
        'zaustavni put', 'dozvol', 'strojovođ', 'izvršn', 'agencij', 'prometnik',
        'vlakovođ', 'skretničar', 'desnostran', 'obostrani', 'vodeće vozilo',
        'službeno mjesto', 'brzina', 'vlak', 'infrastruktur', 'ranžir', 'skretnic',
        'APB', 'manevarsk', 'kvačenje', 'ovlašten',
    ],
    'glavni-signali': [
        'glavni signal', 'predsignal', 'ponavljač', 'pokazivač brzine',
        'granični kolosiječni', 'svjetlosn', 'likovn', 'oprezno', 'ograničen',
        'objavnic', 'predsignalna', 'zaštitni signal', 'ulazni', 'izlazni',
        'prostorni', 'očekuj stoj', 'očekuj slobodno', 'stoj', 'slobodno',
    ],
    'manevriranje': [
        'manevr', 'iskliznic', 'okretnic', 'granica manevriranja', 'međnik',
        'krnji kolosijek', 'ručn', 'zastavic', 'lopar', 'zvižd', 'naprijed',
        'natrag', 'odbačaj', 'kolodvorskog osoblja', 'polazak', 'prolazak',
        'skretnic', 'jezičak',
    ],
    'zcp': [
        'prijelaz', 'željezničko-cestovn', 'žcp', 'kontrolni svjetlosn',
        'uključna točka', 'zaustavnog puta ispred', 'cestovn',
    ],
    'elektrovuca': [
        'elektrovuč', 'oduzimač', 'prekidač', 'kontaktni vod', 'napajan',
        '3 kv', '25 kv', 'istosmjern', 'izmjeničn', 'električn', 'glavni prekidač',
        'DM', 'EMV', 'garnitur',
    ],
    'kocnice-i-isprave': [
        'kočn', 'isprav', 'odron', 'lagana vožn', 'prob', 'zakoči', 'otkoči',
        'signal osoblja pruge', 'mjesto zaustavljanja', 'približavanje stajalištu',
        'sirena', 'pazi', 'signalna oznaka', 'opozivni', 'lopar', 'PKM', 'SKM',
    ],
}

PARA_RANGES = {}  # not used with MD lessons

CATEGORIES_META = [
    {'id': 'osnovni-pojmovi', 'title': 'Osnovni pojmovi', 'description': 'Infrastruktura, kolodvori, brzine i uloge željezničkog osoblja.', 'icon': '📚'},
    {'id': 'glavni-signali', 'title': 'Glavni signali', 'description': 'Svjetlosni i likovni signali, predsignali i pokazivači brzine.', 'icon': '🚦'},
    {'id': 'manevriranje', 'title': 'Manevriranje', 'description': 'Manevarski signali, ručna signalizacija i skretnice.', 'icon': '🔄'},
    {'id': 'zcp', 'title': 'ŽCP', 'description': 'Željezničko-cestovni prijelazi i postupci kod kvarova.', 'icon': '🚧'},
    {'id': 'elektrovuca', 'title': 'Elektrovuča', 'description': 'Oduzimači struje, prekidači i signalizacija napajanja.', 'icon': '⚡'},
    {'id': 'kocnice-i-isprave', 'title': 'Kočnice i isprave', 'description': 'Kočnice, sirene, oznake na pruzi i upozorenja.', 'icon': '🛑'},
]


def sync_images():
    os.makedirs(IMAGES_DST, exist_ok=True)
    if not os.path.isdir(IMAGES_SRC):
        print(f'Upozorenje: nema mape {IMAGES_SRC}')
        return 0
    count = 0
    for name in os.listdir(IMAGES_SRC):
        if name.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
            shutil.copy2(os.path.join(IMAGES_SRC, name), os.path.join(IMAGES_DST, name))
            count += 1
    return count


def read_md(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()


def clean_md(text):
    text = re.sub(r'```\{=html\}[\s\S]*?```', ' ', text)
    text = re.sub(r'```[\s\S]*?```', ' ', text)
    text = re.sub(r'<!--[\s\S]*?-->', ' ', text)
    text = re.sub(r'<[^>]+>', ' ', text)
    text = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)
    text = re.sub(r'\*+', '', text)
    text = re.sub(r'!\[[^\]]*\]\([^)]+\)', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def extract_badges(desc):
    d = desc.lower()
    badges = []
    if 'trepću' in d or 'trepuc' in d:
        badges.append('Trepćuća')
    elif 'mirn' in d:
        badges.append('Mirna')
    if not badges and 'svjetlost' in d:
        badges.append('Svjetlosni')
    if 'dnevni' in d:
        badges.append('Dnevni')
    if 'noćni' in d or 'noćn' in d:
        badges.append('Noćni')
    return badges[:3]


def parse_sound_visual(name, desc):
    d = desc.lower()
    if not any(w in d for w in ['zvuk', 'zvižd', 'zviždak', 'sirena', 'zvonovn']):
        return None
    if 'pet kratkih' in d or '•••••' in desc:
        return {'type': 'sound', 'pattern': 'short5', 'label': '5× kratko', 'tones': ['short'] * 5}
    if 'dva kratka' in d or ('dugačak' in d and 'kratk' in d):
        return {'type': 'sound', 'pattern': 'long-short2', 'label': '1× dugačak + 2× kratko', 'tones': ['long', 'short', 'short']}
    if 'dugačak' in d:
        return {'type': 'sound', 'pattern': 'long', 'label': '1× dugačak', 'tones': ['long']}
    return {'type': 'sound', 'pattern': 'horn', 'label': 'Zvučni signal', 'tones': ['long']}


def parse_signal_visual(name, desc, image=None):
    sound = parse_sound_visual(name, desc)
    if sound:
        badges = ['Zvučni'] + [b for b in extract_badges(desc) if b != 'Zvučni']
        return {**sound, 'image': None, 'badges': badges[:3]}

    d = desc.lower()
    badges = extract_badges(desc)
    base = {'type': 'image' if image else 'light', 'image': image, 'badges': badges}

    if image and 'kosi križ' in d:
        return {**base, 'type': 'cross', 'image': None}

    if image:
        return base

    # CSS fallback kad nema slike
    if 'dvije crvene mirne vodoravne' in d:
        return {**base, 'type': 'light', 'lights': [{'color': 'red', 'blink': False}, {'color': 'red', 'blink': False}], 'layout': 'horizontal'}
    if 'crvena mirna' in d and 'žuta' not in d and 'zelena' not in d:
        return {**base, 'type': 'light', 'lights': [{'color': 'red', 'blink': False}]}
    if 'zelena trepću' in d:
        return {**base, 'type': 'light', 'lights': [{'color': 'green', 'blink': True}]}
    if 'zelena mirna' in d:
        return {**base, 'type': 'light', 'lights': [{'color': 'green', 'blink': False}]}
    if 'žuta trepću' in d and 'žuta mirna' in d:
        return {**base, 'type': 'light', 'lights': [{'color': 'yellow', 'blink': True}, {'color': 'yellow', 'blink': False}]}
    if 'žuta trepću' in d and 'zelena mirna' in d:
        return {**base, 'type': 'light', 'lights': [{'color': 'yellow', 'blink': True}, {'color': 'green', 'blink': False}]}
    if 'žuta trepću' in d and 'zelena trepću' in d:
        return {**base, 'type': 'light', 'lights': [{'color': 'yellow', 'blink': True}, {'color': 'green', 'blink': True}]}
    if 'žuta trepću' in d:
        return {**base, 'type': 'light', 'lights': [{'color': 'yellow', 'blink': True}]}
    if 'žuta mirna' in d:
        return {**base, 'type': 'light', 'lights': [{'color': 'yellow', 'blink': False}]}
    if 'vodoravno desno' in d or 'položena vodoravno' in d:
        return {**base, 'type': 'semaphore', 'arm': 'horizontal', 'nightLight': 'red'}
    if 'uzdignuta koso' in d:
        return {**base, 'type': 'semaphore', 'arm': 'raised', 'nightLight': 'green'}
    if '45 stupnjeva' in d or 'zakrenuta za 45' in d:
        return {**base, 'type': 'electric', 'symbol': 'U'}
    if 'plavo' in d and 'bijel' in d:
        return {**base, 'type': 'marker', 'pattern': 'blue-white-stripe'}
    if image is None and 'pravokutn' in d and ('slovo' in d or '„z"' in d or '»z«' in d.lower() or ' z ' in d):
        return {**base, 'type': 'plate', 'text': 'Z', 'bg': 'black'}
    if image is None and 'kosi križ' in d:
        return {**base, 'type': 'cross', 'image': None}
    return {**base, 'type': 'light', 'lights': [{'color': 'white', 'blink': False}]}


def find_image_after(lines, start_idx, max_look=12):
    for j in range(start_idx, min(start_idx + max_look, len(lines))):
        m = re.search(r'!\[[^\]]*\]\((images/(image\d+\.(?:jpg|jpeg|png|webp)))\)', lines[j], re.I)
        if m:
            return '/signals/' + os.path.basename(m.group(1))
    return None


def build_slika_image_map(text):
    """Mapira 'Slika N' na sliku neposredno iznad natpisa u MD-u."""
    lines = text.split('\n')
    slika_map = {}
    for i, line in enumerate(lines):
        stripped = line.strip().lstrip('> ')
        sm = re.match(r'^Slika\s+(\d+)', stripped, re.I)
        if not sm:
            continue
        n = int(sm.group(1))
        for j in range(i - 1, max(i - 12, -1), -1):
            prev = lines[j].strip().lstrip('> ')
            if not prev or prev.startswith('```'):
                continue
            m = re.search(r'!\[[^\]]*\]\((images/(image\d+\.\w+))\)', prev, re.I)
            if m:
                slika_map[n] = '/signals/' + os.path.basename(m.group(1))
                break
            if re.match(r'^\d+\.\s+\*\*', prev) or prev.startswith('#'):
                break
    return slika_map


def resolve_slika_image(text, slika_map=None):
    """Pronađi sliku iz reference (slika N) prema mapiranju u MD-u."""
    m = re.search(r'\(slika\s+(\d+)\)', text, re.I)
    if not m:
        sm = re.match(r'^Slika\s+(\d+)', text.strip(), re.I)
        if not sm:
            return None
        n = int(sm.group(1))
    else:
        n = int(m.group(1))

    if slika_map and n in slika_map:
        fname = slika_map[n].replace('/signals/', '')
        if os.path.isfile(os.path.join(IMAGES_SRC, fname)):
            return slika_map[n]

    # Datoteka imageN samo ako nije već mapirana na drugi broj slike u skripti
    file_to_slika = {}
    if slika_map:
        for snum, path in slika_map.items():
            file_to_slika[path.replace('/signals/', '')] = snum

    for ext in ('jpg', 'jpeg', 'png', 'webp'):
        fname = f'image{n}.{ext}'
        if not os.path.isfile(os.path.join(IMAGES_SRC, fname)):
            continue
        mapped = file_to_slika.get(fname)
        if mapped is not None and mapped != n:
            return None
        return '/signals/' + fname
    return None


def find_image_for_signal(lines, start_idx, desc, slika_map):
    image = find_image_after(lines, start_idx + 1)
    if image:
        return image
    image = resolve_slika_image(desc, slika_map)
    if image:
        return image
    for j in range(start_idx + 1, min(start_idx + 15, len(lines))):
        sm = re.match(r'^Slika\s+(\d+)', lines[j].strip(), re.I)
        if sm:
            image = resolve_slika_image(f'(slika {sm.group(1)})', slika_map)
            if image:
                return image
    return None


def extract_signals_from_theory(text, slika_map=None):
    if slika_map is None:
        slika_map = build_slika_image_map(text)
    lines = text.split('\n')
    signals = []
    seen = set()

    for i, line in enumerate(lines):
        if 'signalni znak' not in line.lower() and 'signalna oznaka' not in line.lower():
            continue
        if '--' not in line and '—' not in line and ' – ' not in line:
            continue

        name_m = re.search(r'[»""]([^»«""]+)[«""]', line)
        if not name_m:
            continue

        name = clean_md(name_m.group(1))
        if len(name) < 2:
            continue

        parts = re.split(r'\s*[-–—]{1,2}\s*', line, maxsplit=1)
        desc = clean_md(parts[1]) if len(parts) > 1 else ''
        if len(desc) < 5:
            continue

        # Nastavak opisa u sljedećim redcima (prije slike)
        for j in range(i + 1, min(i + 6, len(lines))):
            s = lines[j].strip()
            if s.startswith('![') or re.match(r'^Slika\s+\d', s, re.I):
                break
            if re.match(r'^[-•]\s+.*signalni znak', s, re.I):
                break
            if re.match(r'^\d+\.\s+\*\*', s):
                break
            if s.startswith('>') or s.startswith('**Signalizira'):
                break
            if s and not s.startswith('#'):
                lead = len(lines[j]) - len(lines[j].lstrip(' \t'))
                if lead >= 2:
                    desc += ' ' + clean_md(s)
                    continue
            break

        if 'dnevni znak' in line.lower() and 'dnevni' not in name.lower():
            name = f'{name} (dnevni)'
        elif 'noćni znak' in line.lower() and 'noćni' not in name.lower():
            name = f'{name} (noćni)'

        image = find_image_for_signal(lines, i, desc + ' ' + line, slika_map)

        # Objašnjenje iz sljedećih redaka (bold tekst)
        explanation_parts = []
        for j in range(i + 1, min(i + 8, len(lines))):
            s = lines[j].strip()
            if re.match(r'^[-•]\s+.*signalni znak', s, re.I):
                break
            if re.match(r'^\d+\.\s+\*\*', s):
                break
            if s.startswith('!['):
                continue
            if re.match(r'^Slika\s+\d', s, re.I):
                continue
            if s.startswith('>') or s.startswith('**'):
                explanation_parts.append(clean_md(s.lstrip('> ')))
        if explanation_parts:
            desc = desc + ' ' + ' '.join(explanation_parts[:2])

        key = name.lower()
        if key in seen:
            continue
        seen.add(key)

        signals.append({
            'name': name,
            'description': desc[:500],
            'shortDesc': desc[:130] + ('…' if len(desc) > 130 else ''),
            'visual': parse_signal_visual(name, desc, image),
        })

    return signals


def lesson_title_from_body(body, num=None):
    body = clean_md(body)
    m = re.search(r'[»""]([^»«""]+)[«""]', body)
    if m:
        t = clean_md(m.group(1))
        return f'{num}. {t}' if num else t
    m = re.match(r'^(.+?)(?:\s*[-–—]{1,2}\s|\s*:\s*$)', body)
    if m:
        t = clean_md(m.group(1))
        if len(t) >= 5:
            return f'{num}. {t}' if num else t
    if len(body) > 90:
        t = body[:90].rsplit(' ', 1)[0] + '…'
    else:
        t = body
    return f'{num}. {t}' if num else t


def normalize_blocks(raw_blocks):
    out = []
    li_buf = []
    for b in raw_blocks:
        if b['type'] == 'li':
            li_buf.append(b['text'])
        elif b['type'] == 'break':
            if li_buf:
                out.append({'type': 'ul', 'items': li_buf})
                li_buf = []
        elif b['type'] == 'image':
            if li_buf:
                out.append({'type': 'ul', 'items': li_buf})
                li_buf = []
            out.append({'type': 'image', 'src': b['src']})
        else:
            if li_buf:
                out.append({'type': 'ul', 'items': li_buf})
                li_buf = []
            out.append(b)
    if li_buf:
        out.append({'type': 'ul', 'items': li_buf})
    return out


def enrich_blocks_with_images(blocks):
    """Spoji tekst stavke s slikom koja slijedi odmah iza nje."""
    out = []
    for b in blocks:
        if b['type'] == 'ul':
            for item in b['items']:
                out.append({'type': 'item', 'text': item, 'image': None})
        elif b['type'] == 'image':
            if out and out[-1]['type'] == 'item' and not out[-1]['image']:
                out[-1]['image'] = b['src']
            else:
                out.append({'type': 'image', 'src': b['src']})
        else:
            out.append(b)
    return out


def dedupe_blocks(blocks):
    """Ukloni uzastopne duplikate slika (ista datoteka dva puta zaredom)."""
    out = []
    for b in blocks:
        if b['type'] == 'image':
            src = b.get('src')
            if out and out[-1]['type'] == 'image' and out[-1].get('src') == src:
                continue
            if out and out[-1]['type'] == 'item' and out[-1].get('image') == src:
                continue
        out.append(b)
    return out


def blocks_to_content(blocks):
    parts = []
    for b in blocks:
        if b['type'] == 'ul':
            parts.extend(b['items'])
        elif b['type'] == 'item':
            parts.append(b['text'])
        elif b['type'] in ('p', 'note'):
            parts.append(b['text'])
    return ' '.join(parts)


def extract_lessons_from_theory(text, slika_map=None):
    """Jedna lekcija po numeriranom odlomku — s blokovima za pregledan prikaz."""
    if slika_map is None:
        slika_map = build_slika_image_map(text)
    lines = text.split('\n')
    lessons = []
    current = None

    def flush():
        nonlocal current
        if not current:
            return
        blocks = normalize_blocks(current['blocks'])
        blocks = enrich_blocks_with_images(blocks)
        blocks = dedupe_blocks(blocks)
        blocks = [
            b for b in blocks
            if b['type'] == 'image'
            or (b['type'] == 'item' and b.get('text', '').strip())
            or (b['type'] == 'ul' and b.get('items'))
            or (b['type'] in ('p', 'note') and b.get('text', '').strip()
                and not re.match(r'^Slika\s+\d', b['text'].strip(), re.I))
        ]
        if not blocks:
            current = None
            return
        content = blocks_to_content(blocks)
        if len(content) < 15:
            current = None
            return
        lessons.append({
            'num': current.get('num'),
            'title': current['title'],
            'blocks': blocks,
            'content': content[:4000],
            'image': current.get('image'),
        })
        current = None

    for line in lines:
        stripped = line.strip()
        if not stripped:
            if current:
                current['blocks'].append({'type': 'break'})
            continue

        img_line = stripped.lstrip('> ').strip()
        if img_line.startswith('![') or stripped.startswith('!['):
            src_line = img_line if img_line.startswith('![') else stripped
            img = re.search(r'images/(image\d+\.\w+)', src_line, re.I)
            if img and current:
                path = '/signals/' + os.path.basename(img.group(1))
                current['blocks'].append({'type': 'image', 'src': path})
                if not current.get('image'):
                    current['image'] = path
            continue
        if re.match(r'^Slika\s+(\d+)', stripped, re.I):
            if current:
                path = resolve_slika_image(stripped, slika_map)
                if path:
                    current['blocks'].append({'type': 'image', 'src': path})
                    if not current.get('image'):
                        current['image'] = path
            continue
        if stripped.startswith('```'):
            continue

        sec = re.match(r'^(\d+)\.\s+\*\*([^*]+)\*\*', stripped)
        if sec:
            flush()
            num = int(sec.group(1))
            title = clean_md(sec.group(2))
            current = {
                'num': num,
                'title': f'{num}. {title}',
                'blocks': [],
                'image': None,
            }
            rest = stripped[sec.end():].strip()
            if rest:
                current['blocks'].append({'type': 'p', 'text': clean_md(rest)})
            continue

        num_m = re.match(r'^(\d+)\.\s+(.+)', stripped)
        if num_m:
            flush()
            num = int(num_m.group(1))
            body = num_m.group(2)
            current = {
                'num': num,
                'title': lesson_title_from_body(body, num),
                'blocks': [{'type': 'p', 'text': clean_md(body)}],
                'image': None,
            }
            continue

        if not current:
            if len(stripped) > 40 and not stripped.startswith('#'):
                current = {
                    'num': 0,
                    'title': 'Uvod',
                    'blocks': [{'type': 'p', 'text': clean_md(stripped)}],
                    'image': None,
                }
            continue

        if stripped.startswith('- ') or stripped.startswith('•'):
            current['blocks'].append({'type': 'li', 'text': clean_md(stripped.lstrip('-• '))})
            continue

        if stripped.startswith('>'):
            inner = clean_md(stripped.lstrip('> '))
            if not inner or re.match(r'^Slika\s+\d', inner, re.I) or inner.startswith('!['):
                continue
            current['blocks'].append({'type': 'note', 'text': inner})
            continue

        lead = len(line) - len(line.lstrip(' \t'))
        cont = clean_md(stripped)
        if lead >= 4 and current['blocks']:
            last = current['blocks'][-1]
            if last['type'] in ('p', 'note', 'li'):
                last['text'] += ' ' + cont
            else:
                current['blocks'].append({'type': 'p', 'text': cont})
        elif stripped.startswith('**') and not stripped.startswith('**Signalizira'):
            current['blocks'].append({'type': 'note', 'text': cont})
        elif 'Signalizira' in stripped and stripped.startswith('**'):
            current['blocks'].append({'type': 'note', 'text': cont})
        else:
            current['blocks'].append({'type': 'p', 'text': cont})

    flush()
    return lessons if lessons else [{'title': 'Prometni i signalni propisi', 'content': clean_md(text[:8000]), 'blocks': [{'type': 'p', 'text': clean_md(text[:8000])}]}]


def extract_exam_questions(text):
    lines = text.split('\n')
    questions = []
    current = None
    bullet_counter = 9000

    def leading(raw):
        return len(raw) - len(raw.lstrip(' \t'))

    def is_numbered_question(stripped):
        return bool(re.match(r'^\d{1,3}\.\s*\S', stripped))

    def is_bullet_question(raw, stripped):
        return bool(re.match(r'^\s*[\u2022\uf0b7\u00b7•]\s+\S', raw))

    def start_question(num, rest):
        nonlocal current, bullet_counter
        save()
        if num is None:
            bullet_counter += 1
            num = bullet_counter
        current = {
            'num': num,
            'question': rest.strip(),
            'answer_lines': [],
            'options': [],
            'state': 'question',
        }

    def save():
        nonlocal current
        if not current:
            return
        q = clean_md(current.get('question', ''))
        if not q or len(q) < 3:
            current = None
            return
        if q.lower().startswith('skripta') or 'pripremu redovne' in q.lower():
            current = None
            return
        if q.lower().startswith('općenito o ') and '?' not in q:
            current = None
            return

        if current.get('options'):
            questions.append({
                'num': current['num'],
                'question': q if q.endswith('?') else q + '?',
                'answer': current['options'][0],
                'options': current['options'][:4],
            })
        elif current.get('answer_lines'):
            ans = clean_md(' '.join(current['answer_lines']))
            if len(ans) > 0:
                questions.append({
                    'num': current['num'],
                    'question': q if q.endswith('?') else (q + '?' if '?' not in q else q),
                    'answer': ans,
                    'options': None,
                })
        current = None

    def append_dash_answer(raw, stripped):
        m = re.match(r'^\s*[-–—\uf02d]\s*(.+)$', raw)
        if m:
            current['answer_lines'].append(clean_md(m.group(1)))
            current['state'] = 'answer'
            return True
        if re.match(r'^-\S', stripped):
            current['answer_lines'].append(clean_md(stripped[1:].strip()))
            current['state'] = 'answer'
            return True
        return False

    for line in lines:
        raw = line.rstrip('\n\r')
        stripped = raw.strip()
        if not stripped:
            continue
        if stripped.startswith('#'):
            save()
            continue

        qm = re.match(r'^(\d{1,3})\.\s*(.*)$', stripped)
        if qm:
            start_question(int(qm.group(1)), qm.group(2))
            continue

        bq = re.match(r'^\s*[\u2022\uf0b7\u00b7•]\s*(.+)', raw)
        if bq:
            start_question(None, bq.group(1))
            continue

        if not current:
            continue

        opt = re.match(r'^\s+([a-d])[.)]\s*(.+)', raw, re.I)
        if opt:
            current['options'].append(clean_md(opt.group(2)))
            current['state'] = 'options'
            continue

        if append_dash_answer(raw, stripped):
            continue

        bullet = re.match(r'^\s+-+\s*(.+)', raw)
        if bullet and leading(raw) >= 5:
            current['answer_lines'].append(clean_md(bullet.group(1)))
            current['state'] = 'answer'
            continue

        indent = leading(raw)
        content = stripped

        if indent >= 7:
            current['answer_lines'].append(content)
            current['state'] = 'answer'
            continue

        if indent >= 4:
            if current['state'] == 'question':
                current['question'] += ' ' + content
            elif current['state'] == 'options' and current['options']:
                current['options'][-1] += ' ' + content
            else:
                current['answer_lines'].append(content)
            continue

        if current['state'] == 'options' and current['options']:
            current['options'][-1] += ' ' + content
            continue

        if current['state'] == 'question' and not is_numbered_question(stripped) and not is_bullet_question(raw, stripped):
            current['answer_lines'].append(content)
            current['state'] = 'answer'
            continue

        if current['state'] == 'answer':
            current['answer_lines'].append(content)

    save()
    return questions


def categorize(text, qnum=None):
    t = text.lower()
    scores = {k: sum(2 if kw in t else 0 for kw in v) for k, v in CAT_KEYWORDS.items()}
    best = max(scores, key=scores.get)
    if scores[best] > 0:
        return best
    if qnum is not None:
        if qnum <= 50:
            return 'osnovni-pojmovi'
        if qnum <= 150:
            return 'glavni-signali'
        if qnum <= 220:
            return 'manevriranje'
        if qnum <= 280:
            return 'zcp'
        if qnum <= 350:
            return 'elektrovuca'
    return 'kocnice-i-isprave'


def clean_answer(text):
    text = re.sub(r'\s+', ' ', text).strip()
    if len(text) > 180:
        parts = re.split(r'(?<=[.!?])\s+', text)
        if parts and len(parts[0]) > 12:
            text = parts[0]
    return text


def pick_distractors(correct, pool, count=3):
    correct_n = correct.strip().lower()
    candidates = []
    for a in pool:
        a = clean_answer(a)
        if len(a) < 8 or a.lower() == correct_n or a in candidates or a.endswith('?'):
            continue
        candidates.append(a)
    random.shuffle(candidates)
    distractors = candidates[:count]
    while len(distractors) < count:
        for g in GENERIC_WRONG:
            if g not in distractors:
                distractors.append(g)
                break
        else:
            distractors.append('Drugačije od propisanog')
    return distractors[:count]


def make_exam_question(q, answer_pool):
    if q.get('options') and len(q['options']) >= 2:
        opts = [clean_answer(o) for o in q['options'][:4]]
        while len(opts) < 4:
            opts.append(random.choice(GENERIC_WRONG))
        correct = clean_answer(q['answer'])
        if correct not in opts:
            opts[0] = correct
        random.shuffle(opts)
        return {
            'question': q['question'],
            'options': opts,
            'correctIndex': opts.index(correct) if correct in opts else 0,
            'explanation': correct,
            'type': 'exam',
        }

    correct = clean_answer(q['answer'])
    if len(correct) < 3:
        return None
    distractors = pick_distractors(correct, answer_pool, 3)
    opts = [correct] + distractors
    random.shuffle(opts)
    return {
        'question': q['question'],
        'options': opts,
        'correctIndex': opts.index(correct),
        'explanation': correct,
        'type': 'exam',
    }


def make_signal_questions(signals, all_signals):
    questions = []
    if len(signals) < 1:
        return questions

    desc_pool = [s['shortDesc'] for s in all_signals if s.get('shortDesc')]
    name_pool = [s['name'] for s in all_signals]

    for sig in signals:
        name = sig['name']
        correct_desc = sig['shortDesc']
        img_q = None
        if sig['visual'].get('image'):
            img_q = {
                'question': f'Prepoznaj signal na slici – kako se zove?',
                'options': None,
                'answer': name,
                'type': 'signal-image',
                'image': sig['visual']['image'],
            }

        wrong_desc = pick_distractors(correct_desc, desc_pool, 3)
        opts = [correct_desc] + wrong_desc
        random.shuffle(opts)
        questions.append({
            'question': f'Što signalizira «{name}»?',
            'options': opts,
            'correctIndex': opts.index(correct_desc),
            'explanation': sig['description'][:400],
            'type': 'signal',
            'image': sig['visual'].get('image'),
        })

        wrong_names = pick_distractors(name, name_pool, 3)
        opts2 = [name] + wrong_names
        random.shuffle(opts2)
        hint = correct_desc[:100] + ('…' if len(correct_desc) > 100 else '')
        questions.append({
            'question': f'Koji signal odgovara: «{hint}»?',
            'options': opts2,
            'correctIndex': opts2.index(name),
            'explanation': f'«{name}»: {correct_desc}',
            'type': 'signal',
            'image': sig['visual'].get('image'),
        })

        if img_q:
            wn = pick_distractors(name, name_pool, 3)
            opts3 = [name] + wn
            random.shuffle(opts3)
            questions.append({
                'question': img_q['question'],
                'options': opts3,
                'correctIndex': opts3.index(name),
                'explanation': sig['description'][:400],
                'type': 'signal',
                'image': img_q['image'],
            })

    return questions


def make_theory_questions(lessons, answer_pool):
    questions = []
    for lesson in lessons[:30]:
        for sent in re.split(r'(?<=[.!?])\s+', lesson['content']):
            m = re.match(r'^(.{8,65}?)\s+je\s+(.{12,180})\.?$', sent.strip(), re.I)
            if not m:
                continue
            term, defn = clean_md(m.group(1)), clean_md(m.group(2))
            if 'signalni znak' in term.lower():
                continue
            distractors = pick_distractors(defn, answer_pool, 3)
            opts = [defn] + distractors
            random.shuffle(opts)
            questions.append({
                'question': f'Što je «{term[:55]}»?',
                'options': opts,
                'correctIndex': opts.index(defn),
                'explanation': f'{term} je {defn}',
                'type': 'theory',
            })
    return questions[:40]


def js_str(s):
    return json.dumps(s, ensure_ascii=False)


def write_database(railway_data, exam_bank, out_path):
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    lines = ['export const railwayData = [']
    for cat in railway_data:
        lines.append('  {')
        for key in ['id', 'title', 'description', 'icon']:
            lines.append(f'    {key}: {js_str(cat[key])},')
        lines.append('    lessons: [')
        for lesson in cat['lessons']:
            extra = ''
            if lesson.get('blocks'):
                extra += f', blocks: {json.dumps(lesson["blocks"], ensure_ascii=False)}'
            if lesson.get('image'):
                extra += f', image: {js_str(lesson["image"])}'
            lines.append(
                f'      {{ title: {js_str(lesson["title"])}, content: {js_str(lesson.get("content", ""))}{extra} }},'
            )
        lines.append('    ],')
        lines.append('    signals: [')
        for sig in cat['signals']:
            lines.append(
                f'      {{ name: {js_str(sig["name"])}, description: {js_str(sig["description"])}, '
                f'visual: {json.dumps(sig["visual"], ensure_ascii=False)} }},'
            )
        lines.append('    ],')
        lines.append('    quiz: [')
        for q in cat['quiz']:
            extra = ''
            if q.get('image'):
                extra = f', image: {js_str(q["image"])}'
            lines.append(
                f'      {{ question: {js_str(q["question"])}, options: {json.dumps(q["options"], ensure_ascii=False)}, '
                f'correctIndex: {q["correctIndex"]}, explanation: {js_str(q["explanation"])}, '
                f'type: {js_str(q.get("type", "exam"))}{extra} }},'
            )
        lines.append('    ],')
        lines.append('  },')
    lines.append('];')
    lines.append('')
    lines.append('export const examBank = [')
    for item in exam_bank:
        lines.append(
            f'  {{ num: {item["num"]}, question: {js_str(item["question"])}, '
            f'answer: {js_str(item["answer"])}, categoryId: {js_str(item["categoryId"])}, '
            f'categoryTitle: {js_str(item["categoryTitle"])} }},'
        )
    lines.append('];')
    lines.append('')
    lines.append('export function getCategoryById(id) { return railwayData.find(c => c.id === id); }')
    lines.append('')
    lines.append('export function getAllSignals() {')
    lines.append('  return railwayData.flatMap(c => c.signals.map(s => ({ ...s, categoryId: c.id, categoryTitle: c.title, categoryIcon: c.icon })));')
    lines.append('}')
    lines.append('')
    lines.append('export function normalizeSearch(text) {')
    lines.append('  return (text || "").toLowerCase().normalize("NFD").replace(/\\p{M}/gu, "");')
    lines.append('}')
    lines.append('')
    lines.append('export function searchExamQuestions(query, categoryId = null) {')
    lines.append('  const terms = normalizeSearch(query).split(/\\s+/).filter(t => t.length >= 2);')
    lines.append('  if (!terms.length) return [];')
    lines.append('  return examBank.filter(item => {')
    lines.append('    if (categoryId && item.categoryId !== categoryId) return false;')
    lines.append('    const hay = normalizeSearch(`${item.num} ${item.question} ${item.answer}`);')
    lines.append('    return terms.every(term => hay.includes(term));')
    lines.append('  });')
    lines.append('}')
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))


def main():
    img_count = sync_images()
    print(f'Sinkronizirano {img_count} slika → public/signals/')

    theory = read_md(THEORY_MD)
    exam = read_md(EXAM_MD)

    slika_map = build_slika_image_map(theory)
    all_signals = extract_signals_from_theory(theory, slika_map)
    all_lessons = extract_lessons_from_theory(theory, slika_map)
    exam_raw = extract_exam_questions(exam)
    print(f'MD: {len(all_lessons)} lekcija, {len(all_signals)} signala ({sum(1 for s in all_signals if s["visual"].get("image"))} sa slikom), {len(exam_raw)} ispitnih pitanja')

    answer_pool = [clean_answer(q['answer']) for q in exam_raw if len(q.get('answer', '')) > 8]

    railway_data = []
    total_quiz = 0

    for cat in CATEGORIES_META:
        cid = cat['id']

        cat_signals = [s for s in all_signals if categorize(s['name'] + ' ' + s['description']) == cid]
        cat_lessons = [l for l in all_lessons if categorize(l['title'] + ' ' + l['content'][:500]) == cid]
        if not cat_lessons:
            idx = CATEGORIES_META.index(cat)
            cat_lessons = [l for l in all_lessons if categorize(l['title'] + ' ' + l.get('content', '')[:500]) == cid]
        if not cat_lessons:
            idx = CATEGORIES_META.index(cat)
            chunk = max(1, len(all_lessons) // 6)
            start = idx * chunk
            cat_lessons = all_lessons[start:start + chunk] or all_lessons[:5]

        cat_exam = [q for q in exam_raw if categorize(q['question'] + ' ' + q.get('answer', ''), q['num']) == cid]

        quiz = []
        for q in cat_exam:
            item = make_exam_question(q, answer_pool)
            if item:
                quiz.append(item)
        quiz.extend(make_signal_questions(cat_signals, all_signals))
        quiz.extend(make_theory_questions(cat_lessons, answer_pool))

        seen = set()
        unique = []
        for q in quiz:
            k = q['question'][:90].lower()
            if k not in seen:
                seen.add(k)
                unique.append(q)
        random.shuffle(unique)

        railway_data.append({**cat, 'lessons': cat_lessons, 'signals': cat_signals, 'quiz': unique})
        total_quiz += len(unique)
        imgs = sum(1 for s in cat_signals if s['visual'].get('image'))
        print(f'{cid}: {len(cat_lessons)} lekcija, {len(cat_signals)} signala ({imgs} slika), {len(unique)} pitanja')

    cat_titles = {c['id']: c['title'] for c in CATEGORIES_META}
    exam_bank = []
    for q in exam_raw:
        ans = clean_answer(q.get('answer', ''))
        if len(ans) < 1:
            continue
        cid = categorize(q['question'] + ' ' + ans, q.get('num'))
        exam_bank.append({
            'num': q.get('num', 0),
            'question': q['question'],
            'answer': ans,
            'categoryId': cid,
            'categoryTitle': cat_titles.get(cid, ''),
        })
    exam_bank.sort(key=lambda x: (x['num'], x['question']))

    write_database(railway_data, exam_bank, OUT_PATH)
    print(f'Ukupno {total_quiz} kviz pitanja, {len(exam_bank)} ispitnih Q&A → {OUT_PATH}')


if __name__ == '__main__':
    main()

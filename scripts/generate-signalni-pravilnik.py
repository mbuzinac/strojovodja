#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Parsira docs/signalni_pravilnik.md u strukturirani data/signalni-pravilnik.js
i kopira slike iz docs/slike-signalni_pravilnik u public/pravilnik.

Izlaz:
  - pravilnikCategories : [{ id, title, icon, count, items: [...] }]
  - pravilnikItems      : ravna lista svih stavki (za pretragu)
  - normalizePravilnik(text)
  - searchPravilnik(query, categoryId)

Tipovi stavki:
  - signal      { type, name, description, group, images: [{label, image, desc}] }
  - definition  { type, term, text, group }
  - qa          { type, question, answer, group }
  - note        { type, text, group }
"""

import json
import os
import re
import shutil
import unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MD_PATH = os.path.join(ROOT, "docs", "signalni_pravilnik.md")
IMG_SRC_DIR = os.path.join(ROOT, "docs", "slike-signalni_pravilnik")
IMG_DST_DIR = os.path.join(ROOT, "public", "pravilnik")
OUT_PATH = os.path.join(ROOT, "data", "signalni-pravilnik.js")

# heading (## TEXT) -> (category_id, category_title, icon, group_label, mode)
#   mode: 'signals' | 'definitions' | 'qa'
CATEGORY_MAP = {
    "OSNOVNI POJMOVI":
        ("osnovni-pojmovi", "Osnovni pojmovi", "📖", "Definicije", "definitions"),
    "SIGNALI, SIGNALNE OZNAKE I SIGNALNI ZNAKOVI":
        ("osnovni-pojmovi", "Osnovni pojmovi", "📖", "Vrste signala", "definitions"),

    "SIGNALNI ZNAKOVI GLAVNIH SIGNALA":
        ("glavni-signali", "Glavni signali", "🚦", "", "signals"),

    "SIGNALNI ZNAKOVI PREDSIGNALA":
        ("predsignali", "Predsignali i ponavljači", "🔆", "Predsignal", "signals"),
    "SIGNALNI ZNAKOVI PONAVLJAČA PREDSIGNALIZIRANJA":
        ("predsignali", "Predsignali i ponavljači", "🔆", "Ponavljač predsignaliziranja", "signals"),

    "GRANIČNI KOLOSIJEČNI SIGNALI":
        ("kolosijecni-manevarski", "Kolosiječni i manevarski", "🔀", "Granični kolosiječni", "signals"),
    "MANEVARSKI SIGNALI":
        ("kolosijecni-manevarski", "Kolosiječni i manevarski", "🔀", "Manevarski", "signals"),
    "SKRETNIČKI SIGNALI":
        ("kolosijecni-manevarski", "Kolosiječni i manevarski", "🔀", "Skretnički", "signals"),

    "SIGNALI ZA OGRANIČENJE BRZINE":
        ("ogranicenje-brzine", "Ograničenje brzine", "🐢", "", "signals"),

    "SIGNALI AUTOMATSKIH UREĐAJA NA ŽCP-U":
        ("zcp", "Željezničko-cestovni prijelaz", "🚧", "Automatski uređaji na ŽCP-u", "signals"),
    "OPOMENICA ŽELJEZNIČKO – CESTOVNOG PRIJELAZA":
        ("zcp", "Željezničko-cestovni prijelaz", "🚧", "Opomenica ŽCP-a", "signals"),

    "SIGNALI ZA ELEKTROVUČU":
        ("elektrovuca", "Elektrovuča", "⚡", "", "signals"),

    "SIGNALI NA ČELU I KRAJU VLAKA":
        ("celo-kraj-vlaka", "Čelo i kraj vlaka", "🚂", "", "signals"),

    "SIGNALNI ZNAKOVI KOD PRIJEMA I OTPREME VLAKA":
        ("rukovanje-vlakom", "Prijem, otprema i manevriranje", "🧑‍✈️", "Prijem i otprema vlaka", "signals"),
    "SIGNALNI ZNAKOVI KOD MANEVRIRANJA":
        ("rukovanje-vlakom", "Prijem, otprema i manevriranje", "🧑‍✈️", "Manevriranje", "signals"),
    "SIGNALNI ZNAKOVI KOD PROVJERE ISPRAVNOSTI KOČNICA":
        ("rukovanje-vlakom", "Prijem, otprema i manevriranje", "🧑‍✈️", "Proba kočnica", "signals"),

    "SIGNALNI ZNAKOVI OSOBLJA PRUGE":
        ("osoblje", "Signalni znakovi osoblja", "👷", "Osoblje pruge", "signals"),
    "SIGNALNI ZNAKOVI OSOBLJA VUČNOG VOZILA":
        ("osoblje", "Signalni znakovi osoblja", "👷", "Osoblje vučnog vozila", "signals"),

    "SIGNALNE OZNAKE":
        ("signalne-oznake", "Signalne oznake", "🪧", "Signalne oznake", "signals"),
    "OBJAVNICE GLAVNIH SIGNALA I PREDSIGNALA":
        ("signalne-oznake", "Signalne oznake", "🪧", "Objavnice", "signals"),
    "OPOMENICA PRUŽNIH RADOVA":
        ("signalne-oznake", "Signalne oznake", "🪧", "Opomenica pružnih radova", "signals"),
    "OZNAKA NAGIBA PRUGE":
        ("signalne-oznake", "Signalne oznake", "🪧", "Nagib pruge", "signals"),
    "KILOMETARSKA I HEKTOMETARSKA OZNAKA":
        ("signalne-oznake", "Signalne oznake", "🪧", "Kilometarska/hektometarska", "signals"),
    "SIGNAL NE VRIJEDI":
        ("signalne-oznake", "Signalne oznake", "🪧", "Signal ne vrijedi", "signals"),

    "SIGNALNE OZNAKE KOJE SE VIŠE NE SMIJU UGRAĐIVATI":
        ("stari-signali", "Stari signali (ne ugrađuju se)", "🗄️", "", "signals"),
}

# kategorija za sekcije s pitanjima (heading je samo pitanje)
QA_CATEGORY = ("pitanja", "Pitanja za ponavljanje", "❓", "", "qa")

CATEGORY_ORDER = [
    "osnovni-pojmovi",
    "glavni-signali",
    "predsignali",
    "kolosijecni-manevarski",
    "ogranicenje-brzine",
    "zcp",
    "elektrovuca",
    "celo-kraj-vlaka",
    "rukovanje-vlakom",
    "osoblje",
    "signalne-oznake",
    "stari-signali",
    "pitanja",
]

IMG_RE = re.compile(r"!\[([^\]]*)\]\(\s*(?:slike/)?([^)\s]+)\s*\)")


def norm_heading(text):
    return re.sub(r"\s+", " ", text).strip().upper()


def strip_md(text):
    text = IMG_RE.sub("", text)
    text = text.replace("**", "")
    return text.strip()


def clean_quotes(text):
    return text.strip().strip("„""\"'»«").strip()


def prettify_label(text):
    """SVJETLOSNI GLAVNI SIGNALI -> Svjetlosni glavni signali"""
    t = text.strip()
    if len(t) > 3 and t == t.upper():
        return t[0] + t[1:].lower()
    return t


def map_image(raw):
    """slike/slika1.png -> /pravilnik/slika1.png"""
    name = os.path.basename(raw)
    return f"/pravilnik/{name}"


def cell_image(cell):
    m = IMG_RE.search(cell)
    if m:
        return map_image(m.group(2)), m.group(1).strip()
    return None, None


def split_name_desc(line):
    """'**„Stoj"** — crveno mirno' -> ('Stoj', 'crveno mirno')"""
    raw = IMG_RE.sub("", line).strip()
    m = re.match(r"\*\*(.+?)\*\*\s*(.*)$", raw, re.DOTALL)
    if m:
        name = clean_quotes(m.group(1))
        rest = m.group(2).strip()
        rest = re.sub(r"^[\s—–\-:]+", "", rest)
        return name, rest.strip()
    return None, raw.strip()


class Parser:
    def __init__(self):
        self.items = []          # flat list with category meta
        self.cat = None          # current category tuple
        self.mode = "signals"
        self.heading_group = ""
        self.sub_label = ""
        self.pend_img = None     # (image, alt)
        self.pend_name = None
        self.pend_desc = ""
        self.last_item = None
        self.qa_question = None
        self.qa_lines = []

    # ---- grupiranje ----
    def group(self):
        parts = [p for p in (self.heading_group, self.sub_label) if p]
        return " · ".join(parts)

    # ---- emit ----
    def emit(self, item):
        cid, ctitle, icon, _g, _m = self.cat
        item["categoryId"] = cid
        item["categoryTitle"] = ctitle
        item["categoryIcon"] = icon
        self.items.append(item)
        self.last_item = item
        return item

    def flush_pending(self):
        if self.pend_img is not None:
            image, alt = self.pend_img
            name = self.pend_name or clean_quotes(alt) or ""
            self.emit({
                "type": "signal",
                "name": name,
                "description": self.pend_desc,
                "group": self.group(),
                "images": [{"label": "", "image": image, "desc": ""}],
            })
        elif self.pend_name is not None:
            self.emit({
                "type": "signal",
                "name": self.pend_name,
                "description": self.pend_desc,
                "group": self.group(),
                "images": [],
            })
        self.pend_img = None
        self.pend_name = None
        self.pend_desc = ""

    def flush_qa(self):
        if self.qa_question is not None:
            answer = "\n".join(self.qa_lines).strip()
            self.emit({
                "type": "qa",
                "question": self.qa_question,
                "answer": answer,
                "group": "",
            })
        self.qa_question = None
        self.qa_lines = []

    def finish_section(self):
        if self.mode == "qa":
            self.flush_qa()
        else:
            self.flush_pending()
        self.last_item = None

    # ---- tablice ----
    def handle_table(self, rows):
        header = rows[0]
        data = rows[2:]  # rows[1] = separator
        if not data:
            return
        hlow = [h.lower() for h in header]
        is_signal_opis = (len(header) == 2 and "signal" in hlow[0] and "opis" in hlow[1])

        if is_signal_opis:
            self.flush_pending()
            for row in data:
                if len(row) < 2:
                    continue
                image, alt = cell_image(row[0])
                name, desc = split_name_desc(row[1])
                if not name:
                    name = clean_quotes(alt) if alt else ""
                images = [{"label": "", "image": image, "desc": ""}] if image else []
                self.emit({
                    "type": "signal",
                    "name": name,
                    "description": desc,
                    "group": self.group(),
                    "images": images,
                })
            return

        # multi-view tablica (dnevni/noćni, uz/niz jezičak, a/b/c ...)
        img_row = None
        label_row = None
        for row in data:
            if any(cell_image(c)[0] for c in row):
                img_row = row
            elif img_row is not None and label_row is None:
                label_row = row
        if img_row is None:
            return
        images = []
        for i, cell in enumerate(img_row):
            image, alt = cell_image(cell)
            if not image:
                continue
            label = clean_quotes(re.sub(r"^[a-z]\)\s*", "", header[i].strip())) if i < len(header) else ""
            desc = strip_md(label_row[i]) if label_row and i < len(label_row) else ""
            images.append({"label": label, "image": image, "desc": desc})
        name = self.pend_name or self.sub_label or ""
        self.emit({
            "type": "signal",
            "name": name,
            "description": self.pend_desc,
            "group": self.group(),
            "images": images,
        })
        self.pend_name = None
        self.pend_desc = ""

    # ---- definicije ----
    def handle_definition(self, line):
        self.flush_pending()
        m = re.match(r"^\d+\.\s*(.*)$", line)
        body = m.group(1) if m else line
        name, desc = split_name_desc(body)
        if name is None:
            name = ""
            desc = strip_md(body)
        self.emit({
            "type": "definition",
            "term": name,
            "text": desc,
            "group": self.group(),
        })

    # ---- glavna petlja ----
    def parse(self, text):
        lines = text.split("\n")
        i = 0
        n = len(lines)
        while i < n:
            raw = lines[i]
            line = raw.strip()

            # heading ##
            if line.startswith("## "):
                self.finish_section()
                htext = line[3:].strip()
                key = norm_heading(htext)
                if key in CATEGORY_MAP:
                    cid, ctitle, icon, group, mode = CATEGORY_MAP[key]
                    self.cat = (cid, ctitle, icon, group, mode)
                    self.heading_group = group
                    self.mode = mode
                    self.sub_label = ""
                    if mode == "qa":
                        self.qa_question = strip_md(htext)
                        self.qa_lines = []
                else:
                    # nepoznata sekcija -> tretiraj kao pitanje
                    cid, ctitle, icon, group, mode = QA_CATEGORY
                    self.cat = (cid, ctitle, icon, group, mode)
                    self.heading_group = ""
                    self.mode = "qa"
                    self.sub_label = ""
                    self.qa_question = strip_md(htext)
                    self.qa_lines = []
                i += 1
                continue

            # preskoči glavni naslov i horizontalne crte
            if line.startswith("# ") or line == "---" or line == "":
                i += 1
                continue

            if self.cat is None:
                i += 1
                continue

            # QA način rada
            if self.mode == "qa":
                cleaned = strip_md(line)
                cleaned = re.sub(r"^\d+\.\s*", "", cleaned)
                cleaned = re.sub(r"^[-•]\s*", "", cleaned)
                if cleaned:
                    self.qa_lines.append("• " + cleaned)
                i += 1
                continue

            # heading ###
            if line.startswith("### "):
                self.flush_pending()
                self.last_item = None
                t = line[4:].strip()
                if "„" in t or '"' in t:
                    self.pend_name = clean_quotes(strip_md(t))
                    self.sub_label = ""
                else:
                    self.sub_label = prettify_label(clean_quotes(strip_md(t)))
                i += 1
                continue

            # tablica
            if line.startswith("|"):
                block = []
                while i < n and lines[i].strip().startswith("|"):
                    cells = [c.strip() for c in lines[i].strip().strip("|").split("|")]
                    block.append(cells)
                    i += 1
                if len(block) >= 2:
                    self.handle_table(block)
                continue

            # definicije (numerirano)
            if self.mode == "definitions" and re.match(r"^\d+\.", line):
                self.handle_definition(line)
                i += 1
                continue

            # samostalna slika
            img_only = IMG_RE.fullmatch(line)
            if img_only:
                image = map_image(img_only.group(2))
                alt = img_only.group(1).strip()
                if self.pend_img is not None:
                    self.flush_pending()
                # ako postoji pend_name, slika mu pripada (ime ide ispred slike)
                self.pend_img = (image, alt)
                i += 1
                continue

            # bold linija (naziv ± opis)
            if line.startswith("**"):
                name, desc = split_name_desc(line)
                if self.pend_img is not None and self.pend_name is None:
                    image, alt = self.pend_img
                    self.emit({
                        "type": "signal",
                        "name": name or clean_quotes(alt),
                        "description": desc,
                        "group": self.group(),
                        "images": [{"label": "", "image": image, "desc": ""}],
                    })
                    self.pend_img = None
                else:
                    self.flush_pending()
                    self.pend_name = name
                    self.pend_desc = desc
                i += 1
                continue

            # bullet
            if re.match(r"^[-•]\s+", line):
                txt = strip_md(re.sub(r"^[-•]\s+", "", line))
                if not txt:
                    i += 1
                    continue
                if self.pend_img is not None or self.pend_name is not None:
                    self.pend_desc = (self.pend_desc + "\n• " + txt).strip()
                elif self.last_item is not None:
                    self._append_desc(self.last_item, "• " + txt)
                else:
                    self.emit({"type": "note", "text": txt, "group": self.group()})
                i += 1
                continue

            # obični tekst
            txt = strip_md(line)
            if not txt:
                i += 1
                continue
            if self.pend_img is not None or self.pend_name is not None:
                self.pend_desc = (self.pend_desc + ("\n" if self.pend_desc else "") + txt).strip()
            elif self.last_item is not None and self.last_item["type"] == "signal":
                self._append_desc(self.last_item, txt)
            else:
                self.emit({"type": "note", "text": txt, "group": self.group()})
            i += 1

        self.finish_section()

    def _append_desc(self, item, txt):
        cur = item.get("description", "")
        item["description"] = (cur + ("\n" if cur else "") + txt).strip()


def build_search(item):
    parts = [
        item.get("name", ""),
        item.get("description", ""),
        item.get("term", ""),
        item.get("text", ""),
        item.get("question", ""),
        item.get("answer", ""),
        item.get("group", ""),
        item.get("categoryTitle", ""),
    ]
    for img in item.get("images", []):
        parts.append(img.get("label", ""))
        parts.append(img.get("desc", ""))
    return " ".join(p for p in parts if p)


def main():
    with open(MD_PATH, encoding="utf-8") as f:
        text = f.read()

    parser = Parser()
    parser.parse(text)
    items = parser.items

    # ukloni potpuno prazne stavke
    cleaned = []
    for it in items:
        has_content = (
            it.get("name") or it.get("description") or it.get("term")
            or it.get("text") or it.get("question") or it.get("images")
        )
        if has_content:
            it["search"] = build_search(it)
            cleaned.append(it)
    items = cleaned

    # grupiraj u kategorije
    cats = {}
    for it in items:
        cid = it["categoryId"]
        if cid not in cats:
            cats[cid] = {
                "id": cid,
                "title": it["categoryTitle"],
                "icon": it["categoryIcon"],
                "items": [],
            }
        # u kategoriji ne dupliramo category meta po stavci
        slim = {k: v for k, v in it.items()
                if k not in ("categoryId", "categoryTitle", "categoryIcon")}
        cats[cid]["items"].append(slim)

    ordered = []
    for cid in CATEGORY_ORDER:
        if cid in cats:
            c = cats[cid]
            c["count"] = len(c["items"])
            ordered.append(c)
    for cid, c in cats.items():
        if cid not in CATEGORY_ORDER:
            c["count"] = len(c["items"])
            ordered.append(c)

    # kopiraj slike
    os.makedirs(IMG_DST_DIR, exist_ok=True)
    copied = 0
    if os.path.isdir(IMG_SRC_DIR):
        for fn in os.listdir(IMG_SRC_DIR):
            if fn.lower().endswith((".png", ".jpg", ".jpeg", ".webp", ".gif")):
                shutil.copy2(os.path.join(IMG_SRC_DIR, fn), os.path.join(IMG_DST_DIR, fn))
                copied += 1

    # zapiši JS
    cats_json = json.dumps(ordered, ensure_ascii=False, indent=2)
    items_json = json.dumps(items, ensure_ascii=False, indent=2)

    js = f"""// AUTO-GENERIRANO iz docs/signalni_pravilnik.md
// Ne uređuj ručno - pokreni: python3 scripts/generate-signalni-pravilnik.py

export const pravilnikCategories = {cats_json};

export const pravilnikItems = {items_json};

export function normalizePravilnik(text) {{
  return (text || "").toLowerCase().normalize("NFD").replace(/\\p{{M}}/gu, "");
}}

export function searchPravilnik(query, categoryId = null) {{
  const terms = normalizePravilnik(query).split(/\\s+/).filter(t => t.length >= 2);
  let list = pravilnikItems;
  if (categoryId) list = list.filter(it => it.categoryId === categoryId);
  if (!terms.length) return list;
  return list.filter(it => {{
    const hay = normalizePravilnik(it.search);
    return terms.every(t => hay.includes(t));
  }});
}}
"""

    with open(OUT_PATH, "w", encoding="utf-8") as f:
        f.write(js)

    # statistika
    by_type = {}
    for it in items:
        by_type[it["type"]] = by_type.get(it["type"], 0) + 1
    print(f"✓ {len(items)} stavki, {len(ordered)} kategorija, {copied} slika kopirano")
    print(f"  tipovi: {by_type}")
    for c in ordered:
        print(f"  {c['icon']} {c['title']:<34} {c['count']:>3} stavki")


if __name__ == "__main__":
    main()

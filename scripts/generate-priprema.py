#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Parsira docs/Priprema_za_ispit.md u data/priprema-ispit.js i kopira slike
iz "docs/slike 2" (signalX.png) u public/priprema.

- DIO 1: otvorena pitanja s odgovorima i slikama (iz dokumenta).
- DIO 2: višestruki izbor (a-d). Točan odgovor nije označen u izvoru,
         pa se dodaje iz kuriranih odgovora (CURATED_MC).
- DIO 3: pitanja bez odgovora -> odgovori izvučeni iz ostatka gradiva
         aplikacije (CURATED_QA / CURATED_MC).

Tipovi stavki:
  qa  { dio, num, question, answer, image, source }
  mc  { dio, num, question, options[], correctIndex, explanation, source }
"""

import json
import os
import re
import shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MD_PATH = os.path.join(ROOT, "docs", "Priprema_za_ispit.md")
IMG_SRC_DIR = os.path.join(ROOT, "docs", "slike 2")
IMG_DST_DIR = os.path.join(ROOT, "public", "priprema")
OUT_PATH = os.path.join(ROOT, "data", "priprema-ispit.js")

IMG_RE = re.compile(r"!\[([^\]]*)\]\(\s*(?:slike/)?([^)\s]+)\s*\)")

SECTIONS = [
    {"id": "signali", "title": "Dio 1 · Signali", "icon": "🚦"},
    {"id": "prometna-pravila", "title": "Dio 2 · Prometna pravila", "icon": "📋"},
    {"id": "vucna-vozila", "title": "Dio 3 · Vučna vozila i kočenje", "icon": "🚂"},
]
DIO_TO_SECTION = {1: "signali", 2: "prometna-pravila", 3: "vucna-vozila"}

# Točni odgovori za višestruki izbor (0-bazirani indeks) + obrazloženje.
# Izvučeno iz gradiva aplikacije / signalnog pravilnika.
CURATED_MC = {
    "2.19": (1, "Prolazak vlaka kroz kolodvor u kojem po voznom redu ima predviđeno redovito zaustavljanje (bavljenje)."),
    "2.20": (0, "Kada nastupe izvanredne okolnosti koje ugrožavaju sigurnost prometa (prepreka na pruzi, kvar ili opasnost uočena na vlaku i sl.)."),
    "2.21": (1, "Od mehaničkog dijela (okvir, sanduk, osovinski sklopovi, ovjes), kočnog sustava, vučnih i odbojnih uređaja te pogonskih postrojenja kod vučnih vozila."),
    "2.22": (2, "Samo kada taj signalni znak vrijedi za njegov manevarski sastav i nakon što je dobio odobrenje za manevarsku vožnju."),
    "2.23": (2, "Nazivaju se vučna vozila, a mogu biti vozna (vodeća), zaprežna, međulokomotive i potiskivalice."),
    "2.24": (0, "Skretnica se mora pregledati, dijelovi provjeriti, ručno postaviti u ispravan položaj te mehanički osigurati klinom i ambulantnom bravom."),
    "2.25": (1, "APB je sustav koji automatski regulira (osigurava) razmak između vlakova na otvorenoj pruzi."),
    "3.17": (1, "Kada je uređaj za osiguranje ŽCP-a u kvaru ili kada kontrolni signal / pisani oprezni nalog to izričito nalažu."),
    "3.18": (0, "Kao vožnja u obostranom prometu (organizirano, s APB-om) ili kao vožnja u međukolodvorskom prostornom razmaku (kod kvara ili nedostatka signalizacije)."),
}

# Slike za pitanja DIO 3 (nisu kao ![]() u dokumentu).
CURATED_IMG = {
    "3.3": "/priprema/vagon-cisterna.png",
}

# Rekonstrukcija pitanja iz DIO 1 koja su na fotografiji bila odsječena/nejasna.
CURATED_DIO1 = {
    29: {
        "question": "Objasniti signalni znak VOZITI OGRANIČENOM BRZINOM (pokazivač brzine).",
        "answer": "Svjetleća brojka na crnoj četverokutnoj ploči pokazuje desetinu vrijednosti brzine u km/h kojom se od tog signala smije voziti dalje – znamenku treba pomnožiti s 10 da se dobije dopuštena brzina (npr. „6\" znači 60 km/h).\n(Rekonstruirano – izvorni tekst bio je odsječen na fotografiji.)",
    },
    30: {
        "question": "Gdje se ugrađuju pokazivači brzine?",
        "answer": "Ugrađuju se uz glavne signale (ulazne, izlazne i prostorne) na kojima treba signalizirati brzinu kojom se smije voziti dalje, na propisanoj udaljenosti ispred mjesta na koje se ograničenje odnosi.\n(Rekonstruirano – izvorni tekst bio je odsječen na fotografiji.)",
    },
}

# Odgovori za otvorena pitanja DIO 3 (izvučeno iz gradiva aplikacije).
CURATED_QA = {
    "3.1": "Primjer UIC oznake 92 78 2062 001-5:\n"
           "• 1. broj (9) – oznaka da je riječ o vučnom vozilu\n"
           "• 3. i 4. broj (78) – oznaka željezničke uprave / vlasnika (HŽ = 78)\n"
           "• 7. broj – broj pogonskih osovina (kod lokomotiva)\n"
           "• 12. broj – kontrolna znamenka (odvojena crticom)",
    "3.2": "Bo'Bo' označava raspored osovina: dva dvoosovinska okretna postolja kod kojih je svaka osovina zasebno (pojedinačno) pogonjena – ukupno 4 pogonske osovine.",
    "3.3": "Vagon na slici je serije Za.\n"
           "Na crtežu je teretni vagon-cisterna s okretnim postoljima (četveroosovinski vagon – dva postolja s po dvije osovine).\n"
           "Po UIC klasifikaciji teretnih vagona cisterne spadaju pod seriju Z (prijevoz tekućina, plinova i praškastih tvari), a malo slovo „a\" označava četveroosovinske vagone – dakle serija Za (uz dodatne podserijske oznake ovisno o opremi).",
    "3.4": "Stupnjevito i naglo (brzo) kočenje te stupnjevito i potpuno otkočivanje – djelovanjem preko glavnog (zračnog) voda.",
    "3.5": "Vlak mora biti dostatno kočen – stvarna kočna masa (SKM) mora biti veća ili jednaka potrebnoj kočnoj masi (PKM), automatskom zračnom kočnicom.",
    "3.6": "Po vrsti djelovanja: zračna, elektrodinamička (hidro-dinamička) i magnetna; po načinu upravljanja direktna i indirektna kočnica.",
    "3.7": "Može.",
    "3.8": "Npr. hidro-dinamska, elektro-dinamska i magnetna (tračnička) kočnica.",
    "3.9": "Postupak kojim se ustanovljuje ispravnost kočnica i njihova spremnost za djelovanje.",
    "3.10": "Može – ako se njezina kočnica isključi (zatvori) i vagon propisno obilježi.",
    "3.11": "25 kV, 50 Hz (izmjenični sustav).",
    "3.12": "Osnovni pregled obuhvaća vizualni pregled vozila, razinu pogonskih tekućina, stanje kočnica i hodnog dijela te ispravnost sigurnosnih uređaja prije vožnje. Za detalje specifične za seriju 2062 provjeriti uputu proizvođača/izvor.",
    "3.13": "Rasporednik određuje pritisak u kočnim cilindrima ovisno o tlaku u glavnom (zračnom) vodu – pušta i ispušta zrak u kočne cilindre. Dijeli se po režimu rada (npr. putnički/teretni te prazno/natovareno).",
    "3.14": "Stlačeni (komprimirani) zrak koristi se za kočenje i za pneumatske uređaje na vozilu; mora biti čist i suh, propisanog tlaka u glavnom spremniku.",
    "3.15": "Kočnikom strojovođa obavlja punjenje glavnog voda (položaj vožnje), stupnjevito kočenje i otkočivanje te brzo (naglo) kočenje.",
    "3.16": "Protuklizna zaštita sprječava proklizavanje (klizanje) osovina – blokiranje kotača pri kočenju, odnosno klizanje pri vuči.",
}


def strip_md(text):
    text = IMG_RE.sub("", text)
    text = text.replace("**", "")
    text = re.sub(r"\*\(([^)]*)\)\*", r"(\1)", text)  # *(...)* -> (...)
    return text.strip()


def map_image(raw):
    return f"/priprema/{os.path.basename(raw)}"


class Parser:
    def __init__(self):
        self.items = []
        self.dio = None

    def emit(self, item):
        self.items.append(item)

    def parse(self, text):
        lines = text.split("\n")
        i, n = 0, len(lines)
        while i < n:
            raw = lines[i]
            line = raw.strip()

            m = re.match(r"^##\s+DIO\s+(\d+)", line, re.I)
            if m:
                self.dio = int(m.group(1))
                i += 1
                continue

            if self.dio in (1, 2) and line.startswith("### "):
                i = self.parse_heading_question(lines, i)
                continue

            if self.dio == 3:
                qm = re.match(r"^(\d+)\.\s+(.*)$", line)
                if qm:
                    i = self.parse_dio3_item(lines, i)
                    continue

            i += 1

    # --- DIO 1 i 2: ### N. Pitanje ---
    def parse_heading_question(self, lines, i):
        n = len(lines)
        head = lines[i].strip()[4:].strip()
        hm = re.match(r"^(\d+)\.\s*(.*)$", head)
        num = int(hm.group(1)) if hm else 0
        question = strip_md(hm.group(2) if hm else head)

        image = None
        options = []
        answer_parts = []
        i += 1
        while i < n:
            cur = lines[i].strip()
            if cur.startswith("### ") or cur.startswith("## "):
                break
            if cur.startswith(">") or cur == "---":
                i += 1
                continue
            img = IMG_RE.fullmatch(cur)
            if img:
                image = map_image(img.group(2))
                i += 1
                continue
            opt = re.match(r"^([a-d])\)\s*(.*)$", cur)
            if opt:
                options.append(strip_md(opt.group(2)))
                i += 1
                continue
            if cur.startswith("- "):
                answer_parts.append("• " + strip_md(cur[2:]))
                i += 1
                continue
            if cur:
                answer_parts.append(strip_md(cur))
            i += 1

        if options:
            key = f"{self.dio}.{num}"
            correct, expl = CURATED_MC.get(key, (-1, ""))
            self.emit({
                "type": "mc", "dio": self.dio, "num": num, "question": question,
                "options": options, "correctIndex": correct,
                "explanation": expl, "source": "aplikacija" if key in CURATED_MC else "",
            })
        else:
            answer = "\n".join(answer_parts).strip()
            if self.dio == 1 and num in CURATED_DIO1:
                ov = CURATED_DIO1[num]
                question = ov.get("question", question)
                answer = ov.get("answer", answer)
                image = ov.get("image", image)
            self.emit({
                "type": "qa", "dio": self.dio, "num": num, "question": question,
                "answer": answer, "image": image, "source": "",
            })
        return i

    # --- DIO 3: numerirani popis ---
    def parse_dio3_item(self, lines, i):
        n = len(lines)
        qm = re.match(r"^(\d+)\.\s+(.*)$", lines[i].strip())
        num = int(qm.group(1))
        q_lines = [strip_md(qm.group(2))]
        options = []
        i += 1
        while i < n:
            cur = lines[i].strip()
            if re.match(r"^\d+\.\s+", cur) or cur.startswith("## "):
                break
            if cur.startswith(">"):
                i += 1
                continue
            opt = re.match(r"^([a-d])\)\s*(.*)$", cur)
            if opt:
                options.append(strip_md(opt.group(2)))
                i += 1
                continue
            if cur.startswith("- "):
                q_lines.append("• " + strip_md(cur[2:]))
                i += 1
                continue
            if cur:
                q_lines.append(strip_md(cur))
            i += 1

        question = "\n".join(q_lines).strip()
        key = f"3.{num}"
        if options:
            correct, expl = CURATED_MC.get(key, (-1, ""))
            self.emit({
                "type": "mc", "dio": 3, "num": num, "question": question,
                "options": options, "correctIndex": correct,
                "explanation": expl, "source": "aplikacija" if key in CURATED_MC else "",
            })
        else:
            self.emit({
                "type": "qa", "dio": 3, "num": num, "question": question,
                "answer": CURATED_QA.get(key, ""), "image": CURATED_IMG.get(key),
                "source": "aplikacija" if key in CURATED_QA else "",
            })
        return i


def build_search(it):
    parts = [it.get("question", ""), it.get("answer", ""), it.get("explanation", "")]
    parts += it.get("options", [])
    return " ".join(p for p in parts if p)


def main():
    with open(MD_PATH, encoding="utf-8") as f:
        text = f.read()

    parser = Parser()
    parser.parse(text)
    items = parser.items
    for it in items:
        it["sectionId"] = DIO_TO_SECTION[it["dio"]]
        it["search"] = build_search(it)

    # sekcije
    sections = []
    for s in SECTIONS:
        sect_items = [it for it in items if it["sectionId"] == s["id"]]
        sections.append({**s, "count": len(sect_items), "items": sect_items})

    # kopiraj samo signal* slike koje koristi dokument
    os.makedirs(IMG_DST_DIR, exist_ok=True)
    copied = 0
    used = {os.path.basename(it["image"]) for it in items if it.get("image")}
    if os.path.isdir(IMG_SRC_DIR):
        for fn in os.listdir(IMG_SRC_DIR):
            if fn in used:
                shutil.copy2(os.path.join(IMG_SRC_DIR, fn), os.path.join(IMG_DST_DIR, fn))
                copied += 1

    sections_json = json.dumps(sections, ensure_ascii=False, indent=2)
    items_json = json.dumps(items, ensure_ascii=False, indent=2)

    js = f"""// AUTO-GENERIRANO iz docs/Priprema_za_ispit.md
// Ne uređuj ručno - pokreni: python3 scripts/generate-priprema.py

export const pripremaSections = {sections_json};

export const pripremaItems = {items_json};

export function normalizePriprema(text) {{
  return (text || "").toLowerCase().normalize("NFD").replace(/\\p{{M}}/gu, "");
}}

export function searchPriprema(query, sectionId = null) {{
  const terms = normalizePriprema(query).split(/\\s+/).filter(t => t.length >= 2);
  let list = pripremaItems;
  if (sectionId) list = list.filter(it => it.sectionId === sectionId);
  if (!terms.length) return list;
  return list.filter(it => {{
    const hay = normalizePriprema(it.search);
    return terms.every(t => hay.includes(t));
  }});
}}
"""
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        f.write(js)

    by_type = {}
    for it in items:
        by_type[it["type"]] = by_type.get(it["type"], 0) + 1
    missing = [f'{it["dio"]}.{it["num"]}' for it in items
               if (it["type"] == "qa" and not it["answer"]) or (it["type"] == "mc" and it["correctIndex"] < 0)]
    print(f"✓ {len(items)} pitanja, {copied} slika kopirano, tipovi: {by_type}")
    for s in sections:
        print(f"  {s['icon']} {s['title']:<34} {s['count']:>3}")
    if missing:
        print(f"  ⚠ bez odgovora: {missing}")
    else:
        print("  ✓ sva pitanja imaju odgovor")


if __name__ == "__main__":
    main()

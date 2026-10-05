/**
 * Brzi tab – ono što gotovo svi pitaju:
 * SE nalozi · probe kočenja · prometni pravilnik (ključno)
 */

function q(partial) {
  return {
    cat: 'brzo',
    kind: 'qa',
    ...partial,
  }
}

export const brzoQuestions = [
  // ─── SE NALOZI ─────────────────────────────────────────
  q({
    id: 'br-se-lista',
    group: 'SE nalozi',
    question: 'Nabroji popratne isprave vlaka (SE-1 do SE-5).',
    answer: `💡 Što znači:
Popratne isprave = SE evidencije koje prate vlak.

🚂 Što radiš / zapamti:
• SE-1 – Nalog za vožnju (A4)
• SE-2 – Izvješće o sastavu i kočenju (A4) – PRVO se ispunjava
• SE-3 – Pisani nalog (A5)
• SE-4 – Izvješće o primopredaji vlaka (A4)
• SE-5 – Raspored manevriranja (A5)

✅ Usmeno reci:
„SE-1 do SE-5: nalog, sastav i kočenje, pisani nalog, primopredaja, raspored manevriranja. Prvo se ispunjava SE-2.“`,
  }),
  q({
    id: 'br-se1',
    group: 'SE nalozi',
    question: 'Što je SE-1 i što sadrži?',
    answer: `💡 Što znači:
SE-1 = Nalog za vožnju – osnovna dozvola/uputa za vožnju vlaka.

🚂 Što radiš / zapamti:
Sadrži: broj i voznu relaciju, posebne obavijesti o sastavu, zapovijedi i obavijesti, priloge naloga.

✅ Usmeno reci:
„SE-1 je nalog za vožnju – broj/relacija, obavijesti o sastavu, zapovijedi i prilozi.“`,
  }),
  q({
    id: 'br-se2',
    group: 'SE nalozi',
    question: 'Što je SE-2 i što sadrži? Zašto se prvo ispunjava?',
    answer: `💡 Što znači:
SE-2 = Izvješće o sastavu i kočenju vlaka. Prvo se ispunjava – iz njega ide sastav i kočenje.

🚂 Što radiš / zapamti:
Sadrži: broj i relaciju, ukupnu masu, duljinu, broj osovina, potreban P (% kočenja), stvarnu i potrebnu kočnu masu, podatke o probi kočenja.
SKM mora biti ≥ PKM.

✅ Usmeno reci:
„SE-2 je sastav i kočenje – masa, duljina, osovine, P, kočne mase i proba. Prvo se ispunjava.“`,
  }),
  q({
    id: 'br-se3',
    group: 'SE nalozi',
    question: 'Što je SE-3 i kad ga dobiješ?',
    answer: `💡 Što znači:
SE-3 = Pisani nalog – posebnosti koje nisu (mogle biti) u SE-1.

🚂 Što radiš:
Dobiješ ga kad npr.:
• moraš stati ispred ŽCP-a
• voziš nepravilnim kolosijekom
• smiješ proći uz STOJ / zabranjenu vožnju
• na pruzi ima radova
Potpišeš tek kad si razumio usmeno + pisano.

✅ Usmeno reci:
„SE-3 je pisani nalog za posebne situacije – ŽCP, nepravilni, prolazak uz STOJ, radovi. Potpišem kad razumijem.“`,
  }),
  q({
    id: 'br-se4',
    group: 'SE nalozi',
    question: 'Što je SE-4?',
    answer: `💡 Što znači:
SE-4 = Izvješće o primopredaji vlaka.

🚂 Što radiš / zapamti:
Osoblje vlaka njime potvrđuje prometniku da je vlak spreman za otpremu (polazni kolodvor ili mjesto promjene sastava/kočenja).

✅ Usmeno reci:
„SE-4 je primopredaja – potvrda da je vlak spreman za otpremu.“`,
  }),
  q({
    id: 'br-se5',
    group: 'SE nalozi',
    question: 'Što je SE-5?',
    answer: `💡 Što znači:
SE-5 = Raspored manevriranja.

🚂 Što radiš / zapamti:
Plan/raspored manevarske vožnje – koristi se kad se manevrira po rasporedu.

✅ Usmeno reci:
„SE-5 je raspored manevriranja.“`,
  }),
  q({
    id: 'br-se3-potpis',
    group: 'SE nalozi',
    question: 'Kad potpisuješ SE-3? Može li ga uručiti drugi radnik?',
    answer: `💡 Što znači:
Potpis = potvrda da si razumio.

🚂 Što radiš:
Potpišeš kad je jasno usmeno priopćenje i pisani sadržaj.
Može uručiti i drugi izvršni radnik ako je to u poslovnom redu kolodvora – mora i pročitati sadržaj.

✅ Usmeno reci:
„Potpišem SE-3 kad razumijem usmeno i pisano. Može uručiti i drugi radnik, uz čitanje sadržaja.“`,
  }),

  // ─── PROBE KOČENJA ─────────────────────────────────────
  q({
    id: 'br-proba-sto',
    group: 'Probe kočenja',
    question: 'Što je proba kočnica? Koliko vrsta? Nabroji.',
    answer: `💡 Što znači:
Proba kočnica = postupak kojim se utvrđuje ispravnost kočnica i spremnost za djelovanje.

🚂 Što radiš / zapamti:
Četiri vrste: A, B, C, D.
• A = potpuna
• B, C, D = skraćene
Radi se i na pružnim vozilima i manevarskim sastavima.

✅ Usmeno reci:
„Proba kočnica provjerava ispravnost. Vrste A, B, C, D – A je potpuna, ostale skraćene.“`,
  }),
  q({
    id: 'br-proba-a',
    group: 'Probe kočenja',
    question: 'Što je proba A i kad se vrši?',
    answer: `💡 Što znači:
Proba A = potpuna proba kočnica (cijeli vlak).

🚂 Što radiš – kad se vrši:
• jednom u 24 h
• nakon ponovnog uključivanja isključnih slavina rasporednika
• ako posumnjaš u ispravnost kočnica
• nakon zadržavanja u službenom mjestu > 1 h i temperaturi nižoj od −15 °C

✅ Usmeno reci:
„A je potpuna. Radim je jednom u 24 h, nakon uključivanja slavina, ako sumnjam, ili nakon stajanja >1 h ispod −15 °C.“`,
  }),
  q({
    id: 'br-proba-skracene',
    group: 'Probe kočenja',
    question: 'Koje su skraćene probe? Je li postupak isti kao kod potpune?',
    answer: `💡 Što znači:
Skraćene probe = B, C i D.

🚂 Što radiš / zapamti:
Postupak je isti kao kod potpune – samo se pregledava dio vlaka / pojedinačni vagoni (ne cijeli sastav).

✅ Usmeno reci:
„Skraćene su B, C i D. Postupak je isti, samo se gleda dio vlaka.“`,
  }),
  q({
    id: 'br-proba-zabrt',
    group: 'Probe kočenja',
    question: 'Granične vrijednosti zabrtvljenosti glavnog voda u 1 minuti?',
    answer: `💡 Što znači:
Koliko smije pasti tlak u GV u minuti pri provjeri zabrtvljenosti.

🚂 Što radiš / zapamti:
• Putnički: 0,3 bara
• Teretni: 0,4 bara

✅ Usmeno reci:
„Zabrtvljenost: putnički 0,3 bar, teretni 0,4 bar u jednoj minuti.“`,
  }),
  q({
    id: 'br-proba-znakovi',
    group: 'Probe kočenja',
    question: 'Znakovi pri probi: Poziv, Zakoči, Otkoči, Završena – što radiš?',
    answer: `💡 Što znači:
Ručni/zvučni znakovi za vođenje probe.

🚂 Što radiš:
• Poziv – 3 kratka + 1 dugačak (ponavljati) → spremi se
• Zakoči – sklapati ruke iznad glave → zakoči
• Otkoči – polukrug rukom → otkoči; zatim ručica u brzo kočenje (brzači + tromi rasporednici)
• Proba završena – ruka / bijela svjetiljka uvis → proba gotova

✅ Usmeno reci:
„Poziv, zakoči, otkoči, završena – reagiramo kočnikom; nakon otkoči brzo kočenje da pokrenem brzače.“`,
  }),
  q({
    id: 'br-proba-skm',
    group: 'Probe kočenja',
    question: 'Kako vlak mora biti kočen? Što uspoređuješ u SE-2?',
    answer: `💡 Što znači:
Vlak mora biti dostatno kočen automatskom zračnom kočnicom.

🚂 Što radiš:
U SE-2: stvarna kočna masa (SKM) ≥ potrebna kočna masa (PKM). Gledaš i P (postotak kočenja).

✅ Usmeno reci:
„Automatskom zračnom – SKM mora biti veća ili jednaka PKM, to piše u SE-2.“`,
  }),
  q({
    id: 'br-proba-brzo',
    group: 'Probe kočenja',
    question: 'Kad se primjenjuje brzo (naglo) kočenje?',
    answer: `💡 Što znači:
Brzo kočenje = najkraći put kočenja u nepredviđenoj situaciji.

🚂 Što radiš:
Kad moraš stati zbog opasnosti. Može i slavinom/ručicom za slučaj opasnosti na vagonima.

✅ Usmeno reci:
„Brzo kočenje kad moram stati na najkraćem putu zbog nepredviđene situacije.“`,
  }),

  // ─── PROMETNI PRAVILNIK (ključno) ──────────────────────
  q({
    id: 'br-otprema',
    group: 'Prometni',
    question: 'Što je otprema vlaka i tko je daje?',
    answer: `💡 Što znači:
Otprema = zapovijed prometnika za polazak / prolazak / izniman prolazak – ulazak u prvi sljedeći prostorni odsjek.

🚂 Što radiš:
Ne krećeš dok nemaš otpremu (signal Polazak / prolazak / usmeno / pisano / izlazni – prema propisu).

✅ Usmeno reci:
„Otprema je zapovijed prometnika za polazak ili prolazak – tek tad smijem ići.“`,
  }),
  q({
    id: 'br-polazak-usmeno',
    group: 'Prometni',
    question: 'Može li prometnik dati polazak usmeno? Smiješ li sam krenuti s putnicima?',
    answer: `💡 Što znači:
Polazak može biti i usmen – ali samo kad je propisan.

🚂 Što radiš:
Ne smiješ samovoljno krenuti s putnicima nakon stajanja – čekaj signalni znak nakon ulaska/izlaska putnika.

✅ Usmeno reci:
„Polazak može biti usmeno. S putnicima ne krećem dok ne dobijem znak.“`,
  }),
  q({
    id: 'br-nepravilni',
    group: 'Prometni',
    question: 'Vožnja nepravilnim kolosijekom – što je i kako te obavještavaju?',
    answer: `💡 Što znači:
Nepravilni kolosijek = na dvokolosiječnoj pruzi voziš suprotno od određenog smjera.
Može biti: predviđena, nepredviđena, iznimna.

🚂 Što radiš:
Obavještavaju te pisanim nalogom (SE-3). Tipična ograničenja: kolodvor ~30 km/h, skretnice max 50 km/h, max često 100 km/h (prema nalogu).

✅ Usmeno reci:
„Nepravilni = suprotan smjer. Dobijem SE-3; pazi brzine u kolodvoru i na skretnicama.“`,
  }),
  q({
    id: 'br-prolazak-stoj',
    group: 'Prometni',
    question: 'Kad smiješ proći signal koji pokazuje STOJ / zabranjenu vožnju?',
    answer: `💡 Što znači:
Inače ne smiješ – STOJ = zabranjena vožnja.

🚂 Što radiš:
Samo uz dozvolu: pisani nalog (SE-3) i/ili usmena obavijest + znak „naprijed“ / RDU – prema propisu. Bez toga – stani.

✅ Usmeno reci:
„Uz STOJ ne prolazim bez dozvole – SE-3 ili propisana usmena + znak naprijed.“`,
  }),
  q({
    id: 'br-pazi',
    group: 'Prometni',
    question: 'Kad daješ znak PAZI (jedan dugačak)?',
    answer: `💡 Što znači:
PAZI = jedan dugačak zvuk – upozorenje.

🚂 Što radiš – daj PAZI:
• stajalište nepravilnim kolosijekom
• neosiguran / neispravan ŽCP
• loša vidljivost prema ŽCP
• tunel, most, usjek
• ispred Prilaznog signala
• ispred Mjesta rada na pruzi
(+ mimoilaženje…)

✅ Usmeno reci:
„PAZI jedan dugačak – radovi, ŽCP, tunel/most, nepravilni na stajalište, prilazni…“`,
  }),
  q({
    id: 'br-stani-pruga',
    group: 'Prometni',
    question: 'Kad staneš na otvorenoj pruzi – kome i kad se javljaš?',
    answer: `💡 Što znači:
Stajanje na otvorenoj pruzi mora biti prijavljeno.

🚂 Što radiš:
Javi prometniku / TK što prije (gdje si, što je). Ako kvar ne možeš riješiti – isto. Na otvorenoj pruzi javi se i nakon 15 min.

✅ Usmeno reci:
„Javim prometniku/TK-u odmah; na otvorenoj pruzi i nakon 15 minuta.“`,
  }),
  q({
    id: 'br-iznimni',
    group: 'Prometni',
    question: 'Što je iznimni prolazak kroz kolodvor?',
    answer: `💡 Što znači:
Vlak prolazi kolodvor bez stajanja iako po voznom redu ima zaustavljanje.

🚂 Što radiš:
Prometnik daje znak „Prolazak slobodan“ (ponavlja od ulazne skretnice). Ti nastavljaš pažljivo kroz kolodvor.

✅ Usmeno reci:
„Iznimni prolazak – prolazak slobodan od prometnika, iako inače stajem.“`,
  }),
  q({
    id: 'br-granica-man',
    group: 'Prometni',
    question: 'Do kud smiješ manevrirati? Preko granice manevriranja?',
    answer: `💡 Što znači:
Granica manevarskih vožnji = do kuda smiješ manevrirati u kolodvoru.

🚂 Što radiš:
Do signala granice. Preko – samo uz prethodno (pisano) odobrenje prometnika.

✅ Usmeno reci:
„Manevriram do granice; preko samo uz odobrenje prometnika.“`,
  }),
  q({
    id: 'br-presjecanje',
    group: 'Prometni',
    question: 'Presjecanje skretnice – što je, brzina, uz jezičak?',
    answer: `💡 Što znači:
Presjecanje = nasilno prebacivanje skretnice vožnjom niz jezičak.

🚂 Što radiš:
Max 20 km/h. Za uz jezičak: pregledaj → ručno postavi → zaključaj (klin + ambulantna brava).

✅ Usmeno reci:
„Presjecanje niz jezičak, max 20. Uz jezičak tek nakon pregleda i bravice.“`,
  }),
  q({
    id: 'br-maneura-brz',
    group: 'Prometni',
    question: 'Brzine pri manevriranju?',
    answer: `💡 Što znači:
Maneura ima stroža ograničenja brzine.

🚂 Što radiš:
• max 30 km/h preko skretnica
• 20 km/h ako je radnik/manevrista na boku vozila

✅ Usmeno reci:
„Maneura: 30 preko skretnica, 20 ako je netko na boku.“`,
  }),
]

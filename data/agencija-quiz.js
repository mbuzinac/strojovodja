/**
 * Milijunaš kviz – kratki točni odgovor + 3 mamca.
 * Full explanation ostaje u item.answer.
 * Kod signala/likovnog ABCD ide na „što radiš“, ne samo naziv.
 */

import { signalQuizShort } from './agencija-signali-enrich.js'

/** Ručno napisani kvizovi – kratko kao usmeni odgovor. */
export const QUIZ_BANK = {
  u1: {
    short: 'SE-3: posebna uputa (ŽCP, nepravilni kolosijek, prolazak uz STOJ, radovi) – potpišeš kad razumiješ',
    options: [
      'SE-3: posebna uputa (ŽCP, nepravilni kolosijek, prolazak uz STOJ, radovi) – potpišeš kad razumiješ',
      'Uvijek prije svake vožnje umjesto naloga SE-1',
      'Samo kad mijenjaš lokomotivu ili strojovođu',
      'Samo noću ili pri lošoj vidljivosti',
    ],
  },
  u2: {
    short: 'SE-1…SE-5; SE-2 = sastav i kočenje (prvo se ispunjava)',
    options: [
      'SE-1…SE-5; SE-2 = sastav i kočenje (prvo se ispunjava)',
      'Samo SE-1 (nalog) i SE-3 (pisani nalog)',
      'SE-2 je dozvola strojovođe koju izdaje ASZ',
      'SE-2 je raspored manevriranja',
    ],
  },
  u3: {
    short: 'Što prije javi prometniku/TK: gdje si + što je; na otvorenoj pruzi javi se i nakon 15 min',
    options: [
      'Što prije javi prometniku/TK: gdje si + što je; na otvorenoj pruzi javi se i nakon 15 min',
      'Samo ASZ-u, u roku od 24 sata',
      'Nikome – čekaš dok ne popraviš sam',
      'Samo ECM-u za održavanje',
    ],
  },
  u4: {
    short: 'ASZ: nadzor sigurnosti, obuka/ispitivači, dozvola, nadzor SMS-a',
    options: [
      'ASZ: nadzor sigurnosti, obuka/ispitivači, dozvola, nadzor SMS-a',
      'Upravlja voznim redom i dodjeljuje kolosijeke',
      'To je SMS – sustav u poduzeću za sigurnost',
      'Održava lokomotive i vagone (ECM)',
    ],
  },
  u5: {
    short: 'Dozvola: tko si + zdravlje/škola/stručnost + kategorije; 10 godina (+ potvrda)',
    options: [
      'Dozvola: tko si + zdravlje/škola/stručnost + kategorije; 10 godina (+ potvrda)',
      'Samo ime i prezime; vrijedi 2 godine',
      'Samo kategorije vozila; vrijedi doživotno',
      'Izdaje je UI i vrijedi 5 godina',
    ],
  },
  u6: {
    short: 'Presjecanje = nasilno prebacivanje skretnice niz jezičak; max 20 km/h',
    options: [
      'Presjecanje = nasilno prebacivanje skretnice niz jezičak; max 20 km/h',
      'Planirano prebacivanje skretnice uz jezičak; max 40 km/h',
      'Kad skretnica nije zaključana ambulantnom bravom',
      'Vožnja preko skretnice u pravac bez ograničenja',
    ],
  },
  u7: {
    short: 'Pregledaj → ručno postavi → zaključaj (klin + ambulantna brava) → tek onda uz jezičak',
    options: [
      'Pregledaj → ručno postavi → zaključaj (klin + ambulantna brava) → tek onda uz jezičak',
      'Samo usmena dozvola prometnika',
      'Ništa – smiješ odmah uz jezičak do 20 km/h',
      'Samo SE-3, bez bravice',
    ],
  },
  u8: {
    short: 'APB = automatski pružni blok – SS sustav drži razmak vlakova',
    options: [
      'APB = automatski pružni blok – SS sustav drži razmak vlakova',
      'Agencija za pružni blok (dio ASZ-a)',
      'Uređaj budnosti na lokomotivi',
      'Sustav upravljanja sigurnošću u poduzeću (SMS)',
    ],
  },
  u9: {
    short: 'Probe kočenja: A (potpuna), B, C, D (skraćene)',
    options: [
      'Probe kočenja: A (potpuna), B, C, D (skraćene)',
      'Samo A i B',
      'P, R i G režimi',
      'Samo potpuna proba prije svake vožnje',
    ],
  },
  u10: {
    short: 'UIC serije: E F G H I K/L O R/S T U Z',
    options: [
      'UIC serije: E F G H I K/L O R/S T U Z',
      'Samo G (zatvoreni) i Z (cisterne)',
      'A B C D E F (kao probe kočenja)',
      'SE-1 do SE-5',
    ],
  },
  u11: {
    short: 'Rasporednik = „mozak“ zračne kočnice – gleda GV i puni/ispušta cilindre',
    options: [
      'Rasporednik = „mozak“ zračne kočnice – gleda GV i puni/ispušta cilindre',
      'Ručica kojom strojovođa koči (kočnik)',
      'Kompresor koji puni spremnike',
      'Uređaj budnosti (budnik)',
    ],
  },
  u12: {
    short: 'Vlačni uređaj spaja i vuče; sprega = kuka + vijak (+ automatsko)',
    options: [
      'Vlačni uređaj spaja i vuče; sprega = kuka + vijak (+ automatsko)',
      'Samo odbojnici koji ublažuju udarce',
      'Osovinski sklop s kotačima',
      'Kabeli za upravljanje višestrukim sastavom',
    ],
  },
  u13: {
    short: 'Osovinski sklop: osovina, kotači, ležajevi…; slobodni ili pogonski',
    options: [
      'Osovinski sklop: osovina, kotači, ležajevi…; slobodni ili pogonski',
      'Samo kotači bez osovine',
      'Samo pogonski – slobodnih nema',
      'Dio pantografa na krovu',
    ],
  },
  u14: {
    short: 'Dopunske kočnice uz zračnu: hidrodinamička, elektrodinamička, magnetna',
    options: [
      'Dopunske kočnice uz zračnu: hidrodinamička, elektrodinamička, magnetna',
      'Samo ručna kočnica na vagonu',
      'Samo proba kočenja A',
      'Kočnice samo na lokomotivi',
    ],
  },
  u15: {
    short: 'PAZI = 1 dugačak: radovi, neispravan ŽCP, tunel/most, mimoilaženje, nepravilni kolosijek…',
    options: [
      'PAZI = 1 dugačak: radovi, neispravan ŽCP, tunel/most, mimoilaženje, nepravilni kolosijek…',
      'Pet kratkih = PAZI; jedan dugačak = STOJ',
      'Samo ispred stajališta',
      'Samo noću',
    ],
  },
  u16: {
    short: 'Požar na VV: stani sigurno → gasi → evakuiraj → javi UI / pomoć',
    options: [
      'Požar na VV: stani sigurno → gasi → evakuiraj → javi UI / pomoć',
      'Nastavi do sljedećeg kolodvora pa javi',
      'Samo ugasi motor i čekaj bez javljanja',
      'Prvo zovi ASZ, pa stani',
    ],
  },
  u17: {
    short: 'Ambulantna brava: da za uz jezičak na presječenoj; ne za niz',
    options: [
      'Ambulantna brava: da za uz jezičak na presječenoj; ne za niz',
      'Uvijek da, i uz i niz',
      'Nikad nije potrebna',
      'Samo na otvorenoj pruzi, nikad u kolodvoru',
    ],
  },
  u18: {
    short: 'Požar na DM: hitno zaustavi motor → gasi → javi UI (regularna/ubrzana/hitna)',
    options: [
      'Požar na DM: hitno zaustavi motor → gasi → javi UI (regularna/ubrzana/hitna)',
      'Samo regularno zaustavljanje pa vozi dalje',
      'Isto kao požar na električnoj lokomotivi bez razlike',
      'Ne gasi DM – samo javi ASZ',
    ],
  },
  u19: {
    short: 'Kvačenje: ručno/mehaničko (vijčano), automatsko; na nekim VV i izbor',
    options: [
      'Kvačenje: ručno/mehaničko (vijčano), automatsko; na nekim VV i izbor',
      'Samo automatsko Scharfenberg',
      'Samo vijčano – automatskog nema',
      'Kvačenje = samo električni spojevi',
    ],
  },
  u20: {
    short: 'Podsustavi: strukturni (INF, struja, CCS, vozila) + funkcionalni (promet, održavanje, telematika)',
    options: [
      'Podsustavi: strukturni (INF, struja, CCS, vozila) + funkcionalni (promet, održavanje, telematika)',
      'Samo lokomotive i vagone',
      'Samo ASZ i SMS',
      'Samo SE isprave',
    ],
  },
  u21: {
    short: 'Nejednakomjerni smjenski rad: smjene ne počinju/završavaju uvijek isto',
    options: [
      'Nejednakomjerni smjenski rad: smjene ne počinju/završavaju uvijek isto',
      'Rad samo noću',
      'Fiksni 8–16 sati svaki dan',
      'Rad bez pauze dulje od 12 h',
    ],
  },
  u22: {
    short: 'SMS = sustav sigurnosti u firmi; UI, prijevoznici, ECM, strojovođa; ASZ nadzire',
    options: [
      'SMS = sustav sigurnosti u firmi; UI, prijevoznici, ECM, strojovođa; ASZ nadzire',
      'SMS = druga agencija umjesto ASZ',
      'Samo strojovođa – ostali ne sudjeluju',
      'Samo automatski pružni blok (APB)',
    ],
  },
  u23: {
    short: 'Nesreća = neželjeni iznenadni događaj sa štetom (sudar, iskliznuće, ŽCP, požar…)',
    options: [
      'Nesreća = neželjeni iznenadni događaj sa štetom (sudar, iskliznuće, ŽCP, požar…)',
      'Svaki kvar na lokomotivi',
      'Samo događaji s poginulima',
      'Planirani radovi na pruzi',
    ],
  },
  u24: {
    short: 'Budnik: provjera budnosti; bez reakcije → upozorenje pa EVB; uklj. ~6 km/h',
    options: [
      'Budnik: provjera budnosti; bez reakcije → upozorenje pa EVB; uklj. ~6 km/h',
      'Uređaj za probu kočenja A',
      'Sirena za znak PAZI',
      'Rasporednik na vagonu',
    ],
  },
  u25: {
    short: 'Kočnik = ručica zračne kočnice: puni GV, stupnjevito/naglo koči i otkoči',
    options: [
      'Kočnik = ručica zračne kočnice: puni GV, stupnjevito/naglo koči i otkoči',
      'Rasporednik na svakom vagonu',
      'Budnik za budnost',
      'Ambulantna brava na skretnici',
    ],
  },
  u26: {
    short: 'Vozilo: mehanički dio + kočni sustav + vučni/odbojni + pogonska postrojenja',
    options: [
      'Vozilo: mehanički dio + kočni sustav + vučni/odbojni + pogonska postrojenja',
      'Samo sanduk i kotači',
      'Samo ASZ i SMS moduli',
      'Samo pantograf i transformator',
    ],
  },

  // Ručni znakovi – što TI radiš
  'ur-namjesta': {
    short: 'Na mjesta → ja: spreman sam, čekam pripremu/polazak (još ne krećem)',
    options: [
      'Na mjesta → ja: spreman sam, čekam pripremu/polazak (još ne krećem)',
      'Polazak → krećem odmah',
      'Stoj → odmah stajem',
      'Prolazak slobodan → kroz kolodvor bez stajanja',
    ],
  },
  'ur-priprema': {
    short: 'Priprema → ja: spremim se (kočnice/pažnja), JOŠ NE krećem',
    options: [
      'Priprema → ja: spremim se (kočnice/pažnja), JOŠ NE krećem',
      'Polazak → krećem odmah',
      'Stoj manevre → stajem',
      'Odbačaj vagona',
    ],
  },
  'ur-polazak': {
    short: 'Polazak → ja: smijem krenuti (ako su signal/nalog/vrata OK)',
    options: [
      'Polazak → ja: smijem krenuti (ako su signal/nalog/vrata OK)',
      'Na mjesta → samo čekam',
      'Prolazak zabranjen',
      'Samo priprema – još ne krećem',
    ],
  },
  'ur-prolazak': {
    short: 'Prolazak slobodan → ja: nastavljam kroz kolodvor bez stajanja',
    options: [
      'Prolazak slobodan → ja: nastavljam kroz kolodvor bez stajanja',
      'Polazak s kolodvora',
      'Stoj ispred signala',
      'Malo naprijed u manevri',
    ],
  },
  'ur-lagano': {
    short: 'Lagano → ja: odmah smanjim brzinu manevre',
    options: [
      'Lagano → ja: odmah smanjim brzinu manevre',
      'Stoj → odmah stajem',
      'Naprijed punom brzinom',
      'Odbačaj',
    ],
  },
  'ur-stoj-man': {
    short: 'Stoj (manevra) → ja: ODMAH stajem (krug + ≥5 kratkih)',
    options: [
      'Stoj (manevra) → ja: ODMAH stajem (krug + ≥5 kratkih)',
      'Lagano → samo usporim',
      'Naprijed',
      'Otkoči kod probe',
    ],
  },
  'ur-naprijed': {
    short: 'Naprijed → ja: krećem naprijed (dulji potezi + 1 dugačak)',
    options: [
      'Naprijed → ja: krećem naprijed (dulji potezi + 1 dugačak)',
      'Natrag – lijevo/desno',
      'Stoj – u krug',
      'Otkoči – polukrug',
    ],
  },
  'ur-natrag': {
    short: 'Natrag → ja: krećem natrag (lijevo/desno + 2 dugačka)',
    options: [
      'Natrag → ja: krećem natrag (lijevo/desno + 2 dugačka)',
      'Naprijed – gore/dolje',
      'Lagano – zastavica koso dolje',
      'Polazak – loparić iznad glave',
    ],
  },
  'ur-odbacaj': {
    short: 'Odbačaj → ja: odbačaj vagona (samo ako je dopušten)',
    options: [
      'Odbačaj → ja: odbačaj vagona (samo ako je dopušten)',
      'Naprijed',
      'Zakoči kod probe',
      'Na mjesta',
    ],
  },
  'ur-zakoci': {
    short: 'Zakoči → ja: zakočim za probu (sklapati ruke iznad glave)',
    options: [
      'Zakoči → ja: zakočim za probu (sklapati ruke iznad glave)',
      'Otkoči – polukrug rukom',
      'Stoj manevre – u krug',
      'Polazak',
    ],
  },
  'ur-otkoci': {
    short: 'Otkoči → ja: otkočim / napunim GV (polukrug rukom)',
    options: [
      'Otkoči → ja: otkočim / napunim GV (polukrug rukom)',
      'Zakoči – sklapati ruke',
      'Naprijed',
      'Lagano',
    ],
  },

  // SE · Probe · Prometni (brzi tab)
  'br-se-lista': {
    short: 'SE-1…SE-5; prvo SE-2 (sastav i kočenje)',
    options: [
      'SE-1…SE-5; prvo SE-2 (sastav i kočenje)',
      'Samo SE-1 i SE-3',
      'SE-2 je dozvola ASZ',
      'SE-5 se prvo ispunjava',
    ],
  },
  'br-se1': {
    short: 'SE-1 = nalog za vožnju (broj/relacija, obavijesti, zapovijedi, prilozi)',
    options: [
      'SE-1 = nalog za vožnju (broj/relacija, obavijesti, zapovijedi, prilozi)',
      'SE-1 = pisani nalog za ŽCP',
      'SE-1 = raspored manevriranja',
      'SE-1 = proba kočenja',
    ],
  },
  'br-se2': {
    short: 'SE-2 = sastav i kočenje (masa, duljina, P, SKM/PKM, proba) – prvo se ispunjava',
    options: [
      'SE-2 = sastav i kočenje (masa, duljina, P, SKM/PKM, proba) – prvo se ispunjava',
      'SE-2 = nalog za vožnju',
      'SE-2 = samo potpis strojovođe',
      'SE-2 = raspored manevriranja',
    ],
  },
  'br-se3': {
    short: 'SE-3 = pisani nalog (ŽCP, nepravilni, prolazak uz STOJ, radovi) – potpišeš kad razumiješ',
    options: [
      'SE-3 = pisani nalog (ŽCP, nepravilni, prolazak uz STOJ, radovi) – potpišeš kad razumiješ',
      'SE-3 = uvijek umjesto SE-1',
      'SE-3 = samo proba kočenja',
      'SE-3 se ne potpisuje',
    ],
  },
  'br-se4': {
    short: 'SE-4 = primopredaja – potvrda da je vlak spreman za otpremu',
    options: [
      'SE-4 = primopredaja – potvrda da je vlak spreman za otpremu',
      'SE-4 = pisani nalog za STOJ',
      'SE-4 = nalog za vožnju',
      'SE-4 = raspored manevriranja',
    ],
  },
  'br-se5': {
    short: 'SE-5 = raspored manevriranja',
    options: [
      'SE-5 = raspored manevriranja',
      'SE-5 = sastav i kočenje',
      'SE-5 = nalog za vožnju',
      'SE-5 = primopredaja',
    ],
  },
  'br-se3-potpis': {
    short: 'Potpišeš SE-3 kad razumiješ usmeno + pisano; može uručiti i drugi radnik uz čitanje',
    options: [
      'Potpišeš SE-3 kad razumiješ usmeno + pisano; može uručiti i drugi radnik uz čitanje',
      'Potpišeš uvijek prije čitanja',
      'Samo ASZ smije uručiti SE-3',
      'SE-3 se ne potpisuje',
    ],
  },
  'br-proba-sto': {
    short: 'Proba = ispravnost kočnica; A potpuna, B/C/D skraćene',
    options: [
      'Proba = ispravnost kočnica; A potpuna, B/C/D skraćene',
      'Samo proba A postoji',
      'Probe su P, R i G',
      'Proba se ne radi na manevri',
    ],
  },
  'br-proba-a': {
    short: 'Proba A (potpuna): 1×/24h, nakon slavina, ako sumnjaš, stajanje >1h ispod −15°C',
    options: [
      'Proba A (potpuna): 1×/24h, nakon slavina, ako sumnjaš, stajanje >1h ispod −15°C',
      'Proba A samo jednom godišnje',
      'Proba A = skraćena proba',
      'Proba A samo noću',
    ],
  },
  'br-proba-skracene': {
    short: 'Skraćene B, C, D – postupak isti, pregledava se dio vlaka',
    options: [
      'Skraćene B, C, D – postupak isti, pregledava se dio vlaka',
      'Skraćene su samo A i B',
      'Skraćene imaju potpuno drugi postupak',
      'Skraćene se ne bilježe u SE-2',
    ],
  },
  'br-proba-zabrt': {
    short: 'Zabrtvljenost GV/1 min: putnički 0,3 bar, teretni 0,4 bar',
    options: [
      'Zabrtvljenost GV/1 min: putnički 0,3 bar, teretni 0,4 bar',
      'Putnički 0,4 – teretni 0,3',
      'Oboje 1 bar',
      'Nema granice',
    ],
  },
  'br-proba-znakovi': {
    short: 'Poziv → Zakoči → Otkoči (+ brzo) → Završena',
    options: [
      'Poziv → Zakoči → Otkoči (+ brzo) → Završena',
      'Samo sirena PAZI',
      'Samo SE-3',
      'Bez reakcije kočnikom',
    ],
  },
  'br-proba-skm': {
    short: 'Automatska zračna; SKM ≥ PKM (u SE-2)',
    options: [
      'Automatska zračna; SKM ≥ PKM (u SE-2)',
      'Samo ručna kočnica',
      'SKM smije biti manja od PKM',
      'Kočenje se ne bilježi',
    ],
  },
  'br-proba-brzo': {
    short: 'Brzo kočenje: stati na najkraćem putu zbog nepredviđene situacije',
    options: [
      'Brzo kočenje: stati na najkraćem putu zbog nepredviđene situacije',
      'Samo u kolodvoru',
      'Umjesto probe A',
      'Samo noću',
    ],
  },
  'br-otprema': {
    short: 'Otprema = zapovijed prometnika za polazak/prolazak – tek tad krećeš',
    options: [
      'Otprema = zapovijed prometnika za polazak/prolazak – tek tad krećeš',
      'Otprema = SE-2',
      'Otprema = proba kočenja',
      'Krećeš bez otpreme ako kasniš',
    ],
  },
  'br-polazak-usmeno': {
    short: 'Polazak može usmeno; s putnicima ne krećeš bez znaka',
    options: [
      'Polazak može usmeno; s putnicima ne krećeš bez znaka',
      'Uvijek krećeš sam',
      'Usmeni polazak je zabranjen',
      'S putnicima krećeš čim staneš',
    ],
  },
  'br-nepravilni': {
    short: 'Nepravilni = suprotan smjer; SE-3 + ograničenja brzine',
    options: [
      'Nepravilni = suprotan smjer; SE-3 + ograničenja brzine',
      'Nepravilni = jednokolosje',
      'Bez SE-3, punom brzinom',
      'Samo noću',
    ],
  },
  'br-prolazak-stoj': {
    short: 'Uz STOJ samo uz dozvolu (SE-3 / usmeno + naprijed) – inače stani',
    options: [
      'Uz STOJ samo uz dozvolu (SE-3 / usmeno + naprijed) – inače stani',
      'Uvijek smiješ proći crveno',
      'Samo zviždi i idi',
      'Samo noću smiješ',
    ],
  },
  'br-pazi': {
    short: 'PAZI = 1 dugačak: radovi, ŽCP, tunel/most, nepravilni, prilazni…',
    options: [
      'PAZI = 1 dugačak: radovi, ŽCP, tunel/most, nepravilni, prilazni…',
      'PAZI = 5 kratkih',
      'Samo u kolodvoru',
      'Samo za probu kočenja',
    ],
  },
  'br-stani-pruga': {
    short: 'Javi prometniku/TK odmah; na otvorenoj pruzi i nakon 15 min',
    options: [
      'Javi prometniku/TK odmah; na otvorenoj pruzi i nakon 15 min',
      'Samo ASZ nakon 24 h',
      'Ne javljaj se',
      'Samo ECM',
    ],
  },
  'br-iznimni': {
    short: 'Iznimni prolazak = „Prolazak slobodan“ iako po redu staješ',
    options: [
      'Iznimni prolazak = „Prolazak slobodan“ iako po redu staješ',
      'Iznimni = uvijek stani',
      'Isto što i SE-5',
      'Bez znaka prometnika',
    ],
  },
  'br-granica-man': {
    short: 'Maneura do granice; preko samo uz odobrenje prometnika',
    options: [
      'Maneura do granice; preko samo uz odobrenje prometnika',
      'Slobodno na otvorenu prugu',
      'Granica ne postoji',
      'Samo noću preko granice',
    ],
  },
  'br-presjecanje': {
    short: 'Presjecanje niz jezičak, max 20; uz jezičak tek nakon bravice',
    options: [
      'Presjecanje niz jezičak, max 20; uz jezičak tek nakon bravice',
      'Max 80 bez bravice',
      'Samo uz jezičak bez pregleda',
      'Nije bitno',
    ],
  },
  'br-maneura-brz': {
    short: 'Maneura: 30 km/h preko skretnica; 20 ako je netko na boku',
    options: [
      'Maneura: 30 km/h preko skretnica; 20 ako je netko na boku',
      'Puna brzina',
      'Max 5 km/h uvijek',
      '100 km/h preko skretnica',
    ],
  },
}

function hashSeed(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function seededShuffle(arr, seed) {
  const a = arr.slice()
  let s = seed | 0
  for (let i = a.length - 1; i > 0; i--) {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    const j = Math.floor((((t ^ (t >>> 14)) >>> 0) / 4294967296) * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function shortFromAnswer(answer = '', name = '') {
  if (name && /signal|likovni/i.test(String(name))) {
    // keep for signals below
  }
  const lines = String(answer || '')
    .split('\n')
    .map(l => l.replace(/^[📛👁💡🚂⚠️✅•·\-\d.)\s]+/, '').trim())
    .filter(Boolean)
  const first = lines[0] || name || 'Točan odgovor'
  return first.length > 140 ? `${first.slice(0, 137)}…` : first
}

function shortFromItem(item) {
  if (item.kind === 'signal' || item.kind === 'likovni') {
    return signalQuizShort(item.name || 'Signal', item.answer)
  }
  // Prefer „Što radiš“ ako postoji i u usmenim / pripremi
  const action = String(item.answer || '').match(/Što radiš:\s*\n?([^\n]+)/i)?.[1]?.trim()
    || String(item.answer || '').match(/🚂\s*Ti:\s*([^\n]+)/i)?.[1]?.trim()
  if (action) {
    const label = item.name ? `${item.name}: ` : ''
    const a = action.length > 110 ? `${action.slice(0, 107)}…` : action
    return `${label}${a}`
  }
  return shortFromAnswer(item.answer, item.name)
}

/**
 * Vrati { options[4], correctIndex, short } ili null ako nema smisla.
 * Isti seed → isti redoslijed opcija (stabilno za učenje).
 */
export function buildQuizForItem(item, pool = []) {
  if (!item?.id) return null

  const bank = QUIZ_BANK[item.id]
  if (bank?.options?.length >= 2) {
    const correct = bank.short || bank.options[0]
    const others = bank.options.filter(o => o !== correct)
    const picks = seededShuffle(others, hashSeed(item.id)).slice(0, 3)
    while (picks.length < 3) picks.push(`Netočna varijanta ${picks.length + 1}`)
    const options = seededShuffle([correct, ...picks.slice(0, 3)], hashSeed(`${item.id}-o`))
    return {
      options,
      correctIndex: options.indexOf(correct),
      short: correct,
    }
  }

  const correct = shortFromItem(item)
  if (!correct || correct.length < 8) return null

  const distractors = []
  const seen = new Set([correct])

  for (const other of pool) {
    if (!other || other.id === item.id) continue
    const s = shortFromItem(other)
    if (!s || seen.has(s) || s.length < 8) continue
    // prefer same group/cat
    const sameGroup = other.group && other.group === item.group
    const sameCat = other.cat === item.cat
    if (sameGroup || sameCat) {
      seen.add(s)
      distractors.push({ s, w: sameGroup ? 2 : 1 })
    }
  }

  distractors.sort((a, b) => b.w - a.w)
  let picks = distractors.map(d => d.s)

  if (picks.length < 3) {
    for (const other of pool) {
      if (picks.length >= 8) break
      if (!other || other.id === item.id) continue
      const s = shortFromItem(other)
      if (s && !seen.has(s)) {
        seen.add(s)
        picks.push(s)
      }
    }
  }

  picks = seededShuffle(picks, hashSeed(item.id)).slice(0, 3)
  if (picks.length < 3) return null

  const options = seededShuffle([correct, ...picks], hashSeed(`${item.id}-auto`))
  return {
    options,
    correctIndex: options.indexOf(correct),
    short: correct,
  }
}

export function canQuizItem(item, pool = []) {
  return !!buildQuizForItem(item, pool)
}

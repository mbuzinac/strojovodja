/**
 * Usmeno – ključna pitanja za ASZ + znakovi koje daje osoblje na kolodvoru.
 */

function q(partial) {
  return {
    cat: 'usmeno',
    kind: partial.images?.length ? 'signal' : 'qa',
    bigImages: !!partial.images?.length,
    ...partial,
  }
}

/** 26 ključnih usmenih pitanja (jednostavni odgovori) */
const teorija = [
  q({
    id: 'u1',
    group: 'Isprave',
    question: '1. Kad strojovođa od prometnika dobije pisani nalog?',
    answer: `💡 Što znači:
SE-3 = pisani nalog – posebna uputa koja nije (mogla biti) u običnom nalogu SE-1.

🚂 Što radiš:
Dobiješ ga kad npr. moraš stati ispred ŽCP-a, voziš nepravilnim kolosijekom, smiješ proći uz STOJ, ili ima radova. Potpišeš tek kad si razumio što piše i što ti je usmeno rečeno.

✅ Usmeno reci:
„Pisani nalog je SE-3. Dobijem ga za posebne situacije – ŽCP, nepravilni kolosijek, prolazak uz STOJ, radovi. Potpišem kad sam razumio.“`,
  }),
  q({
    id: 'u2',
    group: 'Isprave',
    question: '2. Koje su popratne isprave vlaka i što je SE-2?',
    answer: `💡 Što znači:
Popratne isprave: SE-1 nalog, SE-2 sastav i kočenje, SE-3 pisani nalog, SE-4 primopredaja, SE-5 raspored manevriranja.

🚂 Što radiš:
SE-2 se prvo ispunjava – u njemu masa, duljina, osovine, P (postotak kočenja), kočna masa, je li proba napravljena. Bez SE-2 ne krećeš.

✅ Usmeno reci:
„Isprave su SE-1 do SE-5. SE-2 je izvješće o sastavu i kočenju i prvo se ispunjava.“`,
  }),
  q({
    id: 'u3',
    group: 'Postupci',
    question: '3. Kad i kome se javljaš s pruge ako ne možeš popraviti kvar na VV?',
    answer: `💡 Što znači:
Kvar na VV koji ne možeš sam riješiti moraš prijaviti UI-u.

🚂 Što radiš:
1. Što prije javi prometniku / TK
2. Reci gdje si i što se dogodilo – potvrdi da su razumjeli
3. Na otvorenoj pruzi javi se i nakon 15 min

✅ Usmeno reci:
„Javim se što prije prometniku ili TK-u, kažem mjesto i kvar. Ako stojim na otvorenoj pruzi, javim se i nakon 15 minuta.“`,
  }),
  q({
    id: 'u4',
    group: 'Agencija',
    question: '4. Što radi ASZ?',
    answer: `💡 Što znači:
ASZ = Agencija za sigurnost željezničkog prometa – državni nadzor sigurnosti.

🚂 Što radiš / zapamti:
• nadzire i uređuje sigurnost
• odobrava centre za obuku i ispitivače
• izdaje dozvolu strojovođi
• nadzire i odobrava SMS kod UI i prijevoznika

✅ Usmeno reci:
„ASZ nadzire sigurnost, odobrava obuku i ispitivače, izdaje dozvolu i nadzire SMS.“`,
  }),
  q({
    id: 'u5',
    group: 'Agencija',
    question: '5. Što piše u dozvoli i koliko vrijedi?',
    answer: `💡 Što znači:
Dozvola potvrđuje tko si, zdravlje, školu, stručnost i kategorije vozila.

🚂 Što radiš:
Za vožnju trebaš dozvolu + potvrdu. Vrijedi 10 godina – prati rok.

✅ Usmeno reci:
„U dozvoli je tko sam, zdravlje/škola/stručnost i kategorije. Vrijedi 10 godina, uz potvrdu.“`,
  }),
  q({
    id: 'u6',
    group: 'Skretnice',
    question: '6. Što je presjecanje skretnice?',
    answer: `💡 Što znači:
Presjecanje = vlak nasilno prebaci skretnicu vožnjom niz jezičak.

🚂 Što radiš:
Preko takve skretnice max 20 km/h. Za uz jezičak treba dodatni postupak (pregled, bravica).

✅ Usmeno reci:
„Presjecanje je nasilno prebacivanje skretnice niz jezičak. Max 20 km/h.“`,
  }),
  q({
    id: 'u7',
    group: 'Skretnice',
    question: '7. Što treba učiniti da se smije ići preko presječene skretnice uz jezičak?',
    answer: `💡 Što znači:
Uz jezičak na presječenoj skretnici smiješ tek kad je skretnica osigurana.

🚂 Što radiš:
1. Pregledaj skretnicu
2. Ručno je postavi kako treba
3. Zaključaj (klin + ambulantna brava)
4. Tek onda vozi uz jezičak

✅ Usmeno reci:
„Pregledam, ručno postavim i zaključam klinom i ambulantnom bravom – tek onda smijem uz jezičak.“`,
  }),
  q({
    id: 'u8',
    group: 'SS sustavi',
    question: '8. Što je APB?',
    answer: `APB (automatski pružni blok) je SS (signalno-sigurnosni) sustav na pruzi.

Vlakovi mogu ići jedan za drugim, ali ne mogu se sudariti jer sustav drži razmak i ne pušta istodobnu vožnju iz suprotnog smjera.`,
  }),
  q({
    id: 'u9',
    group: 'Kočnice',
    question: '9. Koje su vrste proba kočenja?',
    answer: `Četiri: A, B, C, D.

• A = potpuna proba (najdetaljnija)
• B, C, D = skraćene probe

Cilj: provjeriti da kočnice rade i da su spremne.`,
  }),
  q({
    id: 'u10',
    group: 'Vozila',
    question: '10. Serije teretnih vagona (UIC)?',
    answer: `UIC označava tip vagona slovom:

• E – otvoreni s visokim stranicama
• F – posebni otvoreni
• G – zatvoreni
• H – posebni zatvoreni
• I – rashladni
• K / L – ravni (obični / posebni, osovinski)
• O – otvoreni „višenamjenski“
• R / S – ravni s okretnim postoljima
• T – s otvorenim krovom
• U – specijalni
• Z – cisterne

Mala slova (npr. a u Za) = dodatni podaci (osovine, oprema…).`,
  }),
  q({
    id: 'u11',
    group: 'Kočnice',
    question: '11. Što je rasporednik?',
    answer: `„Mozak“ zračne kočnice na vagonu.

Gleda tlak u GV (glavnom vodu) i prema tome pušta ili ispušta zrak u kočne cilindre.

Ima režime (putnički/teretni, prazno/natovareno). Isključuješ ga isključnom slavinom.`,
  }),
  q({
    id: 'u12',
    group: 'Vozila',
    question: '12. Što je vlačni uređaj i od čega je vlačna sprega?',
    answer: `Vlačni uređaj spaja vozila i prenosi sile vuče/guranja (uz odbojnike koji ublažuju udarce).

Klasična vlačna sprega: vučna kuka + vijak (vijčano kvačilo) + spojni dijelovi.
Može biti i automatsko kvačilo (npr. Scharfenberg).`,
  }),
  q({
    id: 'u13',
    group: 'Vozila',
    question: '13. Što je osovinski sklop i kakav može biti?',
    answer: `Dio kojim vozilo stoji i vozi po tračnicama: osovina, kotači, ležajevi, dijelovi kočnice, a kod pogonskih i pogon.

Vrste:
• slobodni (samo „kotrlja“)
• pogonski (i vuče / gura)`,
  }),
  q({
    id: 'u14',
    group: 'Kočnice',
    question: '14. Što su dopunske kočnice?',
    answer: `Dodatne kočnice uz običnu zračnu, npr.:
• hidrodinamička
• elektrodinamička
• magnetna (tračnička)`,
  }),
  q({
    id: 'u15',
    group: 'Znakovi',
    question: '15. Pet situacija kad daješ „PAZI“?',
    answer: `💡 Što znači:
PAZI = jedan dugačak zvuk (upozorenje).

🚂 Što radiš:
Daj PAZI barem:
1. ispred radova na pruzi
2. ispred neispravnog / nezaposjednutog ŽCP-a
3. prije tunela, mosta ili usjeka
4. kod mimoilaženja vlakova
5. na stajalište nepravilnim kolosijekom
(+ prilazni signal, loša vidljivost, potiskivanje…)

✅ Usmeno reci:
„PAZI je jedan dugačak – radovi, neispravan ŽCP, tunel/most, mimoilaženje, nepravilni kolosijek…“`,
  }),
  q({
    id: 'u16',
    group: 'Postupci',
    question: '16. Što radiš ako izbije požar na VV?',
    answer: `💡 Što znači:
Požar na vučnom vozilu = hitan postupak, prioritet ljudi i sigurnost.

🚂 Što radiš:
1. Zaustavi na što sigurnijem mjestu
2. Gasi (aparati / ugrađeni sustav)
3. Evakuiraj ljude
4. Javi UI i zovi pomoć
5. Ne riskiraj – slijedi uputu za tu seriju

✅ Usmeno reci:
„Stanem na sigurno, gasim, evakuiram, javim UI i zovem pomoć.“`,
  }),
  q({
    id: 'u17',
    group: 'Skretnice',
    question: '17. Treba li ambulantna brava za vožnju uz jezičak?',
    answer: `💡 Što znači:
Ambulantna brava osigurava skretnicu za vožnju uz jezičak na presječenoj.

🚂 Što radiš:
• Uz jezičak na presječenoj → DA, treba brava
• Niz jezičak → NE (osim posebnih iznimaka po obavijesti)

✅ Usmeno reci:
„Za uz jezičak na presječenoj – da; za niz – ne.“`,
  }),
  q({
    id: 'u18',
    group: 'Postupci',
    question: '18. Što radiš kod požara na DM?',
    answer: `💡 Što znači:
DM = dizelski motor. Požar na DM = hitno zaustavljanje motora.

🚂 Što radiš:
Hitno zaustavi DM → gasi → javi UI.
Tri načina zaustavljanja: regularna (sve OK), ubrzana (zaštita), hitna (požar na DM).

✅ Usmeno reci:
„Kod požara na DM hitno zaustavim motor, gasim i javim UI.“`,
  }),
  q({
    id: 'u19',
    group: 'Vozila',
    question: '19. Kakvo može biti kvačenje?',
    answer: `Način spajanja vozila:
• ručno / mehaničko (vijčano)
• automatsko
• na nekim VV možeš birati električki ili mehanički način`,
  }),
  q({
    id: 'u20',
    group: 'Sustavi',
    question: '20. Na što se dijele željeznički podsustavi?',
    answer: `Strukturni (fizički):
• građevinski / INF — pruga, mostovi…
• elektroenergetski — struja za vuču
• pružni CCS (upravljanje, zapovijedanje i signalizacija)
• CCS u vozilu
• željeznička vozila

Funkcionalni (kako sustav radi):
• vođenje / upravljanje prometom
• održavanje
• telematika (putnici/teret)`,
  }),
  q({
    id: 'u21',
    group: 'Osoblje',
    question: '21. Što je nejednakomjerni smjenski rad?',
    answer: `Kad ti smjene nisu „uvijek u isto vrijeme“ — kontinuirano počinješ ili završavaš posao u različito doba dana ili noći.`,
  }),
  q({
    id: 'u22',
    group: 'Agencija',
    question: '22. SMS — tko sudjeluje?',
    answer: `SMS (Safety Management System) nije agencija. To je sustav pravila i postupaka u poduzeću da se radi sigurno.

Tko sudjeluje:
• UI (upravitelj infrastrukture)
• prijevoznici
• ECM (subjekt zadužen za održavanje) i drugi koji utječu na sigurnost
• strojovođa — u praksi ga provodi (radi po pravilima, javlja kvarove i događaje)

ASZ taj sustav nadzire i odobrava.`,
  }),
  q({
    id: 'u23',
    group: 'Sigurnost',
    question: '23. Što je nesreća?',
    answer: `Neželjeni, nenamjerni iznenadni događaj (ili niz događaja) koji nanese štetu.

Primjeri: sudar, iskliznuće, nesreća na ŽCP-u, ozljede/žrtve uz vozilo u pokretu, požar…`,
  }),
  q({
    id: 'u24',
    group: 'Sigurnost',
    question: '24. Što je budnik?',
    answer: `Uređaj koji „provjerava jesi li budan“.

Ako ne reagiraš na vrijeme: upozorenje (svjetlo/sirena) pa EVB (ekstra brzo / naglo kočenje) — vlak se naglo zaustavi.

Uključuje se oko 6 km/h.`,
  }),
  q({
    id: 'u25',
    group: 'Kočnice',
    question: '25. Što je kočnik?',
    answer: `Ručica kojom upravljaš zračnom kočnicom:
• puniš GV (glavni vod)
• stupnjevito kočiš i otkočiš
• radiš naglo kočenje

Put zraka: kompresor → spremnici → kočnik → GV (~5 bar) → rasporednik → kočni cilindri.`,
  }),
  q({
    id: 'u26',
    group: 'Vozila',
    question: '26. Od kojih podsklopova se sastoji željezničko vozilo?',
    answer: `Četiri glavna dijela:
1. mehanički dio (sanduk, okvir, osovinski sklopovi…)
2. kočni sustav
3. vučni i odbojni uređaji (spajanje vozila)
4. pogonska postrojenja (kod VV)`,
  }),
]

/** Znakovi koje daje osoblje na kolodvoru / kod manevre (slika + što radiš) */
const rucni = [
  q({
    id: 'ur-uvod',
    group: 'Ručni znakovi',
    question: 'Koje ručne znakove ti daje osoblje na kolodvoru? (pregled)',
    answer: `Tri skupine koje moraš prepoznati:

1. PRIJEM / OTPREMA – Na mjesta → Priprema za polazak → Polazak → Prolazak slobodan
2. MANEVRIRANJE – Lagano, Stoj, Naprijed, Natrag, Odbačaj (+ malo naprijed/natrag)
3. PROBA KOČNICA – Poziv, Zakoči, Otkoči, Proba završena

Danju: loparić / crvena zastavica. Noću: signalna svjetiljka (zelena kod otpreme, bijela kod manevre).`,
  }),

  // Prijem i otprema
  q({
    id: 'ur-namjesta',
    group: 'Prijem / otprema',
    name: 'Na mjesta',
    question: 'Ručni znak „Na mjesta“ – što vidiš i što radiš?',
    images: ['/pravilnik/slika62.png', '/pravilnik/slika63.png'],
    imageLabels: ['Loparić', 'Svjetiljka'],
    answer: `📛 „NA MJESTA“

👁:
• loparić pod pazuhom, širokom površinom prema čelu i kraju vlaka
• noću: zelena svjetiljka okrenuta prema kraju vlaka

💡 Što znači:
Osoblje je na mjestima; vlak se prima / priprema.

🚂 Što radiš:
Budi spreman, prati daljnje znakove (priprema / polazak) — još ne krećeš.

✅ Usmeno reci:
„Na mjesta – osoblje je na mjestima. Ja sam spreman i čekam pripremu ili polazak.“`,
  }),
  q({
    id: 'ur-priprema',
    group: 'Prijem / otprema',
    name: 'Priprema za polazak',
    question: 'Ručni znak „Priprema za polazak“ – što vidiš i što radiš?',
    images: ['/pravilnik/slika64.png', '/pravilnik/slika65.png'],
    imageLabels: ['Loparić', 'Svjetiljka'],
    answer: `📛 „PRIPREMA ZA POLAZAK“

👁:
• loparić koso nadolje prema vlaku
• noću: svjetiljka u visini grudi, zelena prema kraju (naizmjenično kraj/čelo)
• + usna zviždaljka: jedan dugi zvižduk

🚂 Što radiš:
pripremi se za polazak (kočnice, vrata, pažnja) — još NE krećeš dok ne dođe „Polazak“.`,
  }),
  q({
    id: 'ur-polazak',
    group: 'Prijem / otprema',
    name: 'Polazak',
    question: 'Ručni znak „Polazak“ – što vidiš i što radiš?',
    images: ['/pravilnik/slika66.png', '/pravilnik/slika67.png', '/pravilnik/slika68.png'],
    imageLabels: ['Loparić', 'Svjetiljka', 'Svjetlosni'],
    answer: `📛 „POLAZAK“

👁:
• loparić okomito iznad glave, prema čelu vlaka
• noću: zelena svjetiljka iznad glave prema čelu
• ili: kružnica svjetlećih žarulja na izlaznom signalu

🚂 Što radiš:
smiješ krenuti (ako su i drugi uvjeti OK – signal, nalog, vrata…).`,
  }),
  q({
    id: 'ur-prolazak',
    group: 'Prijem / otprema',
    name: 'Prolazak slobodan',
    question: 'Ručni znak „Prolazak slobodan“ – što vidiš i što radiš?',
    images: ['/pravilnik/slika69.png', '/pravilnik/slika70.png'],
    imageLabels: ['Loparić', 'Svjetiljka'],
    answer: `📛 „PROLAZAK SLOBODAN“

👁: iznad glave u jednakim razmacima diže i spušta loparić (ili zelenu svjetiljku) prema nadolazećem vlaku.

🚂 Što radiš:
prolazak kroz kolodvor je slobodan — nastavi vožnju pažljivo.`,
  }),

  // Manevriranje
  q({
    id: 'ur-lagano',
    group: 'Manevriranje',
    name: 'Lagano',
    question: 'Ručni znak „Lagano“ (manevra) – dan/noć?',
    images: ['/pravilnik/slika71.png', '/pravilnik/slika72.png'],
    imageLabels: ['Dan', 'Noć'],
    answer: `📛 „LAGANO“

👁:
• DAN: crvena zastavica koso naniže + produženi zvižduk (visok↔dubok)
• NOĆ: bijela svjetiljka u visini grudi + isti zvižduk

🚂 Što radiš:
vozi lagano / smanji brzinu manevre.`,
  }),
  q({
    id: 'ur-stoj-man',
    group: 'Manevriranje',
    name: 'Stoj (manevra)',
    question: 'Ručni znak „Stoj“ kod manevriranja – dan/noć?',
    images: ['/pravilnik/slika73.png', '/pravilnik/slika74.png'],
    imageLabels: ['Dan', 'Noć'],
    answer: `📛 „STOJ“ (manevra)

👁:
• DAN: mahanje u KRUG crvenom zastavicom + ≥5 kratkih zvižduka
• NOĆ: isto u krug bijelom svjetiljkom + ≥5 kratkih zvižduka

🚂 Što radiš:
ODMAH stani.`,
  }),
  q({
    id: 'ur-naprijed',
    group: 'Manevriranje',
    name: 'Naprijed',
    question: 'Ručni znak „Naprijed“ – dan/noć?',
    images: ['/pravilnik/slika75.png', '/pravilnik/slika76.png'],
    imageLabels: ['Dan', 'Noć'],
    answer: `📛 „NAPRIJED“

👁:
• DAN: zastavica gore–dolje u DULJIM potezima + 1 dugačak zvižduk
• NOĆ: isto svjetiljkom + 1 dugačak zvižduk

„Malo naprijed“ = isto, ali KRAĆI potezi + 1 kratak zvižduk.

🚂 Što radiš:
kreni / vozi naprijed (malo = samo malo).`,
  }),
  q({
    id: 'ur-natrag',
    group: 'Manevriranje',
    name: 'Natrag',
    question: 'Ručni znak „Natrag“ – dan/noć?',
    images: ['/pravilnik/slika77.png', '/pravilnik/slika78.png'],
    imageLabels: ['Dan', 'Noć'],
    answer: `📛 „NATRAG“

👁:
• DAN: zastavica lijevo–desno u DULJIM potezima + 2 dugačka zvižduka
• NOĆ: isto svjetiljkom + 2 dugačka zvižduka

„Malo natrag“ = KRAĆI potezi + 2 kratka zvižduka.

🚂 Što radiš:
vozi natrag (malo = samo malo).`,
  }),
  q({
    id: 'ur-odbacaj',
    group: 'Manevriranje',
    name: 'Odbačaj',
    question: 'Ručni znak „Odbačaj“ – dan/noć?',
    images: ['/pravilnik/slika79.png', '/pravilnik/slika80.png'],
    imageLabels: ['Dan', 'Noć'],
    answer: `📛 „ODBAČAJ“

👁:
• DAN: zastavica + slobodna ruka koso prema gore + 1 kratki i 1 dugačak zvižduk
• NOĆ: bijela svjetiljka koso prema gore + isti zvižduk

🚂 Što radiš:
odbačaj (odvoji / gurni vagone prema uputi).`,
  }),

  // Proba kočnica
  q({
    id: 'ur-poziv',
    group: 'Proba kočnica',
    name: 'Poziv na probu',
    question: '„Poziv na probu kočenja“ – kako zvuči?',
    answer: `📛 „POZIV NA PROBU KOČENJA“

• tri kratka i jedan dugačak zvižduk, ponavljati više puta

🚂 Što radiš:
spremi se na znakove Zakoči / Otkoči.`,
  }),
  q({
    id: 'ur-zakoci',
    group: 'Proba kočnica',
    name: 'Zakoči',
    question: 'Ručni znak „Zakoči“ – dan/noć?',
    images: ['/pravilnik/slika81.png', '/pravilnik/slika82.png'],
    imageLabels: ['Dan', 'Noć'],
    answer: `📛 „ZAKOČI“

👁:
• DAN: sklapati više puta ruke iznad glave, lice prema strojovođi
• NOĆ: bijelu svjetiljku podizati više puta u obliku slova D

🚂 Što radiš:
zakoči (proba) – spusti tlak u GV prema proceduri.`,
  }),
  q({
    id: 'ur-otkoci',
    group: 'Proba kočnica',
    name: 'Otkoči',
    question: 'Ručni znak „Otkoči“ – dan/noć?',
    images: ['/pravilnik/slika83.png', '/pravilnik/slika84.png'],
    imageLabels: ['Dan', 'Noć'],
    answer: `📛 „OTKOČI“

👁:
• DAN: mahati u polukrugu rukom iznad glave, lice prema tebi
• NOĆ: isto polukrug bijelom svjetiljkom

🚂 Što radiš:
otkoči – napuni GV, otpusti kočnice.`,
  }),
  q({
    id: 'ur-zavrsena',
    group: 'Proba kočnica',
    name: 'Proba završena',
    question: '„Proba kočenja završena“ – kako izgleda?',
    answer: `📛 „PROBA KOČENJA ZAVRŠENA“

👁:
• DAN: ruku podići uvis, lice prema strojovođi
• NOĆ: uvis podići bijelu svjetiljku prema tebi

🚂 Što radiš:
proba je gotova — možeš nastaviti s pripremom / polaskom.`,
  }),

  q({
    id: 'ur-zapamti',
    group: 'Ručni znakovi',
    question: 'Brzi memorijski trik – manevra (gore/dolje vs lijevo/desno)?',
    answer: `• Gore–dolje = NAPRIJED (dulji potezi + 1 dugački; kraći = malo)
• Lijevo–desno = NATRAG (dulji + 2 dugačka; kraći = malo + 2 kratka)
• U krug + 5 kratkih = STOJ
• Zastavica koso dolje = LAGANO
• Zastavica + ruka koso gore = ODBAČAJ

Otprema: pod pazuhom = na mjesta; koso dolje = priprema; iznad glave = polazak.`,
  }),
]

export const usmenoQuestions = [...teorija, ...rucni]

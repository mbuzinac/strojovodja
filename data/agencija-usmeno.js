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
    answer: `Pisani nalog je SE-3 (Signalna evidencija – pisani nalog). Papir kojim ti prometnik kaže nešto posebno što nije (ili nije moglo biti) u običnom nalogu za vožnju.

Dobiješ ga kad, npr.:
• moraš stati ispred ŽCP-a
• voziš nepravilnim kolosijekom
• smiješ proći pokraj signala koji kaže STOJ
• na pruzi ima radova

Potpišeš kad si razumio što piše i što ti je usmeno rečeno.`,
  }),
  q({
    id: 'u2',
    group: 'Isprave',
    question: '2. Koje su popratne isprave vlaka i što je SE-2?',
    answer: `Papiri koji „prate“ vlak:

• SE-1 – Nalog za vožnju (osnovna dozvola/uputa)
• SE-2 – Izvješće o sastavu i kočenju (masa, duljina, kako koči)
• SE-3 – Pisani nalog (posebne upute)
• SE-4 – Primopredaja vlaka
• SE-5 – Raspored manevriranja

SE-2 se prvo ispunjava. U njemu: broj i relacija vlaka, masa, duljina, broj osovina, koliko kočenja treba (P = postotak kočenja), koliko kočne mase stvarno imaš, je li proba kočenja napravljena.`,
  }),
  q({
    id: 'u3',
    group: 'Postupci',
    question: '3. Kad i kome se javljaš s pruge ako ne možeš popraviti kvar na VV?',
    answer: `Ako kvar na VV (vučnom vozilu) ne možeš sam riješiti: što prije javi upravitelju infrastrukture — u praksi prometniku / TK.

Reci gdje si i što se dogodilo, i provjeri da su te razumjeli.

Ako stojiš na otvorenoj pruzi, javi se prometnicima nakon 15 min.`,
  }),
  q({
    id: 'u4',
    group: 'Agencija',
    question: '4. Što radi ASZ?',
    answer: `ASZ (Agencija za sigurnost željezničkog prometa) je „državni čuvar“ željezničke sigurnosti.

• nadzire i uređuje sigurnost
• odobrava centre za obuku i ispitivače
• izdaje dozvolu strojovođi
• nadzire i odobrava SMS kod UI i prijevoznika`,
  }),
  q({
    id: 'u5',
    group: 'Agencija',
    question: '5. Što piše u dozvoli i koliko vrijedi?',
    answer: `Dozvola potvrđuje tko si, da zadovoljavaš zdravlje, školu i stručnost, te za koje kategorije smiješ voziti.

Vrijedi 10 godina. Za vožnju trebaš dozvolu + potvrdu.`,
  }),
  q({
    id: 'u6',
    group: 'Skretnice',
    question: '6. Što je presjecanje skretnice?',
    answer: `Kad vlak nasilno „prebaci“ skretnicu vožnjom niz jezičak (skretnica se ne prebaci uredno, nego je „presiječeš“).

Preko takve skretnice max 20 km/h.`,
  }),
  q({
    id: 'u7',
    group: 'Skretnice',
    question: '7. Što treba učiniti da se smije ići preko presječene skretnice uz jezičak?',
    answer: `Skretnicu pregledati, ručno staviti kako treba, pa je zaključati (klin + ambulantna brava). Tek onda vožnja uz jezičak.`,
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
    answer: `Znak PAZI = jedan dugačak zvuk. Barem:

1. ispred mjesta rada na pruzi
2. ispred neispravnog / nezaposjednutog ŽCP-a
3. prije tunela, mosta ili usjeka
4. kod mimoilaženja vlakova
5. kad dolaziš na stajalište nepravilnim kolosijekom

(Još: prilazni signal, loša vidljivost, potiskivanje…)`,
  }),
  q({
    id: 'u16',
    group: 'Postupci',
    question: '16. Što radiš ako izbije požar na VV?',
    answer: `1. Zaustavi vlak na što sigurnijem mjestu
2. Pokušaj gasiti (aparati / ugrađeni sustav)
3. Evakuiraj ljude na sigurno
4. Što prije javi UI i zovi pomoć
5. Ne riskiraj — slijedi uputu za tu seriju vozila`,
  }),
  q({
    id: 'u17',
    group: 'Skretnice',
    question: '17. Treba li ambulantna brava za vožnju uz jezičak?',
    answer: `Da — za vožnju uz jezičak na presječenoj skretnici.
Za vožnju niz jezičak — ne (osim posebnih iznimaka na otvorenoj pruzi po obavijesti).

Jednostavno: uz = brava da; niz = brava ne.`,
  }),
  q({
    id: 'u18',
    group: 'Postupci',
    question: '18. Što radiš kod požara na DM?',
    answer: `DM = dizelski motor.
HITNA procedura gašenja/zaustavljanja motora, pa gašenje i obavijest UI.

Tri načina zaustavljanja DM-a:
• regularna — sve OK
• ubrzana — zadjelovala zaštita
• hitna — upravo kod požara na DM`,
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

💡 Osoblje je na mjestima; vlak se prima / priprema.

🚂 Ti: budi spreman, prati daljnje znakove (priprema / polazak).`,
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

🚂 Ti: pripremi se za polazak (kočnice, vrata, pažnja) — još NE krećeš dok ne dođe „Polazak“.`,
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

🚂 Ti: smiješ krenuti (ako su i drugi uvjeti OK – signal, nalog, vrata…).`,
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

🚂 Ti: prolazak kroz kolodvor je slobodan — nastavi vožnju pažljivo.`,
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

🚂 Ti: vozi lagano / smanji brzinu manevre.`,
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

🚂 Ti: ODMAH stani.`,
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

🚂 Ti: kreni / vozi naprijed (malo = samo malo).`,
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

🚂 Ti: vozi natrag (malo = samo malo).`,
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

🚂 Ti: odbačaj (odvoji / gurni vagone prema uputi).`,
  }),

  // Proba kočnica
  q({
    id: 'ur-poziv',
    group: 'Proba kočnica',
    name: 'Poziv na probu',
    question: '„Poziv na probu kočenja“ – kako zvuči?',
    answer: `📛 „POZIV NA PROBU KOČENJA“

• tri kratka i jedan dugačak zvižduk, ponavljati više puta

🚂 Ti: spremi se na znakove Zakoči / Otkoči.`,
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

🚂 Ti: zakoči (proba) – spusti tlak u GV prema proceduri.`,
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

🚂 Ti: otkoči – napuni GV, otpusti kočnice.`,
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

🚂 Ti: proba je gotova — možeš nastaviti s pripremom / polaskom.`,
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

/**
 * Likovni signali – za usmeni ispit (pokazati sliku + izgovoriti).
 * Format odgovora: što kažeš dok pokazuješ dan/noć.
 */

function card(partial) {
  return {
    cat: 'likovni',
    kind: 'likovni',
    bigImages: true,
    ...partial,
  }
}

export const likovniQuestions = [
  // ─── OSNOVE (prvo teorija, pa znakovi) ───
  card({
    id: 'lik-0',
    group: 'Osnove',
    name: null,
    question: 'Što su likovni signali? (definicija za ispit)',
    images: [],
    imageLabels: [],
    answer: `Likovni signali signaliziraju znakove:
• danju – položajem ili obojenim likom (ručica / ploča)
• noću – obojenom mirnom svjetlošću pokraj dnevnog znaka (ili samo dnevnim znakom)

Važno: likovni signali su JEDNOZNAČNI (nemaju „očekuj…“ na glavnom).`,
  }),

  card({
    id: 'lik-1',
    group: 'Osnove',
    name: null,
    question: 'Jesu li likovni signali glavni? Jesu li dvoznačni?',
    images: [],
    imageLabels: [],
    answer: `• Jesu – likovni su vrsta GLAVNIH signala (mogu biti i predsignali, ali „likovni glavni“ = glavni).
• Nisu dvoznačni – likovni su JEDNOZNAČNI.

Na ispitu reci: „Likovni su glavni signali i signaliziraju jednoznačne znakove.“`,
  }),

  card({
    id: 'lik-2',
    group: 'Osnove',
    name: null,
    question: 'Koji se signalni znakovi signaliziraju likovnim glavnim signalima?',
    images: [],
    imageLabels: [],
    answer: `Tri znaka:
1. STOJ
2. SLOBODNO
3. OGRANIČENA BRZINA (ograničenje brzine)

Zapamti redoslijed: zabranjeno → slobodno → ograničeno.`,
  }),

  card({
    id: 'lik-3',
    group: 'Osnove',
    name: null,
    question: 'Kako se „pokazuje“ likovni glavni znak? (ručice – za usmeno)',
    images: [],
    imageLabels: [],
    answer: `Znakovi se daju BROJEM i POLOŽAJEM signalnih ručica (desno u odnosu na smjer vožnje):

• STOJ → 1 ručica VODORAVNO
• SLOBODNO → 1 ručica KOSO NAVIŠE
• OGRANIČENJE → 2 ručice KOSO NAVIŠE

Noću uz dnevni znak stoji mirna svjetlost: crvena / zelena / zelena+žuta.`,
  }),

  // ─── LIKOVNI GLAVNI ───
  card({
    id: 'lik-g-stoj',
    group: 'Likovni glavni',
    name: 'Stoj',
    question: 'LIKOVNI GLAVNI – STOJ\nPokaži sliku i objasni dan + noć + što radiš.',
    images: ['/pravilnik/slika12.png', '/pravilnik/slika13.png'],
    imageLabels: ['Dan', 'Noć'],
    answer: `📛 „STOJ“ – likovni glavni signal

👁 Kako izgleda:
• DAN: jedna signalna ručica položena VODORAVNO desno u odnosu na smjer vožnje
• NOĆ: uz dnevni znak – jedna CRVENA mirna svjetlost

💡 Što znači:
Vožnja od ovog signala je ZABRANJENA.

🚂 Što radiš:
Zaustavi vlak ispred signala. Ne prolazi bez dozvole (usmena obavijest + „naprijed“, ili pisani nalog / RDU prema propisu).

Usmeno: „Vodoravna ručica = stoj, kao crveno mirno na svjetlosnom.“`,
  }),

  card({
    id: 'lik-g-slobodno',
    group: 'Likovni glavni',
    name: 'Slobodno',
    question: 'LIKOVNI GLAVNI – SLOBODNO\nPokaži sliku i objasni dan + noć + što radiš.',
    images: ['/pravilnik/slika14.png', '/pravilnik/slika15.png'],
    imageLabels: ['Dan', 'Noć'],
    answer: `📛 „SLOBODNO“ – likovni glavni signal

👁 Kako izgleda:
• DAN: signalna ručica uzdignuta KOSO NAVIŠE desno u odnosu na smjer vožnje
• NOĆ: uz dnevni znak – jedna ZELENA mirna svjetlost

💡 Što znači:
Vožnja od ovog signala je SLOBODNA (jednoznačno – nema „očekuj“).

🚂 Što radiš:
Nastavi vožnju najvećom dopuštenom brzinom; i dalje gledaj prugu i sljedeće signale.

Usmeno: „Ručica koso gore = slobodno, kao zeleno mirno.“`,
  }),

  card({
    id: 'lik-g-ogr',
    group: 'Likovni glavni',
    name: 'Ograničenje brzine',
    question: 'LIKOVNI GLAVNI – OGRANIČENJE BRZINE\nPokaži sliku i objasni dan + noć + što radiš.',
    images: ['/pravilnik/slika16.png', '/pravilnik/slika17.png'],
    imageLabels: ['Dan', 'Noć'],
    answer: `📛 „OGRANIČENJE BRZINE“ – likovni glavni signal

👁 Kako izgleda:
• DAN: DVIJE signalne ručice uzdignute KOSO NAVIŠE (desno u odnosu na smjer vožnje)
• NOĆ: uz dnevni znak – jedna ZELENA mirna i ispod nje jedna ŽUTA mirna svjetlost

💡 Što znači:
Vožnja je dopuštena, ali OGRANIČENOM brzinom (obično preko skretničkog područja).

🚂 Što radiš:
Smanji brzinu na propisanu ograničenu i drži je preko skretnica / do kraja ograničenja.

Usmeno: „Dvije ručice koso = ograničenje; noću zeleno + žuto ispod.“`,
  }),

  card({
    id: 'lik-g-usporedi',
    group: 'Likovni glavni',
    name: null,
    question: 'Usporedi sva 3 likovna glavna znaka (dan/noć) – kao na ploči.',
    images: [
      '/pravilnik/slika12.png',
      '/pravilnik/slika14.png',
      '/pravilnik/slika16.png',
    ],
    imageLabels: ['Stoj', 'Slobodno', 'Ograničenje'],
    answer: `DAN (ručice desno od stupa, u smjeru vožnje):
1. STOJ – 1× vodoravno
2. SLOBODNO – 1× koso naviše
3. OGRANIČENJE – 2× koso naviše

NOĆ (svjetlost uz dnevni znak):
1. STOJ – crveno mirno
2. SLOBODNO – zeleno mirno
3. OGRANIČENJE – zeleno mirno + žuto mirno ispod

Reci naglas: „Jedna vodoravno – stoj. Jedna koso – slobodno. Dvije koso – ograničenje.“`,
  }),

  // ─── LIKOVNI PREDSIGNALI ───
  card({
    id: 'lik-p-uvod',
    group: 'Likovni predsignal',
    name: null,
    question: 'Što signalizira likovni predsignal? Kako izgleda ploča i stup?',
    images: [],
    imageLabels: [],
    answer: `Likovni predsignal signalizira SAMO dva znaka:
• OČEKUJ STOJ
• OČEKUJ SLOBODNO
(nema likovnog „očekuj ograničenje“ – to je samo svjetlosni predsignal)

Izgled:
• Četverokutna signalna ploča – naizmjenične uspravne bijele i žute linije, crno-bijeli rub
• Stup s prednje strane – naizmjenično bijela i crna polja

Znak se daje POLOŽAJEM ploče; noću mirna svjetlost pokraj dnevnog znaka.`,
  }),

  card({
    id: 'lik-p-stoj',
    group: 'Likovni predsignal',
    name: 'Očekuj Stoj',
    question: 'LIKOVNI PREDSIGNAL – OČEKUJ STOJ\nPokaži i objasni dan + noć + što radiš.',
    images: ['/pravilnik/slika21.png', '/pravilnik/slika22.png'],
    imageLabels: ['Dan', 'Noć'],
    answer: `📛 „OČEKUJ STOJ“ – likovni predsignal

👁 Kako izgleda:
• DAN: signalna ploča u USPRAVNOM položaju
• NOĆ: uz dnevni znak – jedna mirna ŽUTA svjetlost

💡 Što znači:
Na glavnom signalu ispred tebe očekuj STOJ.

🚂 Što radiš:
Odmah pripremi kočenje da se možeš zaustaviti ispred glavnog signala.
Kod kvara predsignala – postupaš isto kao da je Očekuj Stoj.

Usmeno: „Uspravna ploča = očekuj stoj (žuto).“`,
  }),

  card({
    id: 'lik-p-slobodno',
    group: 'Likovni predsignal',
    name: 'Očekuj Slobodno',
    question: 'LIKOVNI PREDSIGNAL – OČEKUJ SLOBODNO\nPokaži i objasni dan + noć + što radiš.',
    images: ['/pravilnik/slika23.png', '/pravilnik/slika24.png'],
    imageLabels: ['Dan', 'Noć'],
    answer: `📛 „OČEKUJ SLOBODNO“ – likovni predsignal

👁 Kako izgleda:
• DAN: signalna ploča u VODORAVNOM položaju, s crnim rubom okrenutim prema vlaku
• NOĆ: uz dnevni znak – jedna ZELENA mirna svjetlost

💡 Što znači:
Na glavnom signalu ispred tebe očekuj SLOBODNO.

🚂 Što radiš:
Možeš očekivati slobodnu vožnju, ali potvrdi glavni signal kad ga vidiš.

Usmeno: „Vodoravna ploča (crni rub prema meni) = očekuj slobodno (zeleno).“`,
  }),

  card({
    id: 'lik-p-usporedi',
    group: 'Likovni predsignal',
    name: null,
    question: 'Usporedi likovne predsignale – uspravno vs vodoravno.',
    images: ['/pravilnik/slika21.png', '/pravilnik/slika23.png'],
    imageLabels: ['Očekuj Stoj', 'Očekuj Slobodno'],
    answer: `Zapamti kao „vrata“:
• USPRAVNO (zatvoreno) → OČEKUJ STOJ → noću ŽUTO
• VODORAVNO (otvoreno, crni rub prema vlaku) → OČEKUJ SLOBODNO → noću ZELENO

Nema trećeg likovnog predsignala (ograničenje je samo svjetlosno: zeleno trepćuće).`,
  }),

  // ─── ŠTITNI (stari likovni ulazni) ───
  card({
    id: 'lik-st-uvod',
    group: 'Štitni signal',
    name: null,
    question: 'Što je štitni signal? Gdje se ugrađuje?',
    images: [],
    imageLabels: [],
    answer: `Štitni signal = stari tip LIKOVNOG ULAZNOG glavnog signala (više se ne ugrađuje novo, ali moraš znati).

Danju: okrugla signalna ploča na piramidi bijelo-crnih polja.
Noću: obojena mirna svjetlost pokraj dnevnog znaka.

Ugradnja: na udaljenosti zaustavnog puta ILI najmanje 500 m ispred prve ulazne skretnice.
Redovno pokazuje STOJ.

Ako je neispravan / neosvijetljen → postupaš kao STOJ; ispred se stavlja crveni lopar.`,
  }),

  card({
    id: 'lik-st-stoj',
    group: 'Štitni signal',
    name: 'Stoj (štitni)',
    question: 'ŠTITNI SIGNAL – STOJ\nPokaži dan + noć.',
    images: ['/pravilnik/slika103.png', '/pravilnik/slika104.png'],
    imageLabels: ['Dan', 'Noć'],
    answer: `📛 Štitni „STOJ“

👁:
• DAN: okrugla CRVENA signalna ploča (okrenuta prema vlaku)
• NOĆ: jedna CRVENA svjetlost pokraj dnevnog znaka

💡 / 🚂: Vožnja zabranjena – stani ispred štitnog. Isto pravilo kao kod STOJ.`,
  }),

  card({
    id: 'lik-st-slobodno',
    group: 'Štitni signal',
    name: 'Slobodno (štitni)',
    question: 'ŠTITNI SIGNAL – SLOBODNO\nPokaži dan + noć.',
    images: ['/pravilnik/slika105.png', '/pravilnik/slika106.png'],
    imageLabels: ['Dan', 'Noć'],
    answer: `📛 Štitni „SLOBODNO“

👁:
• DAN: okrugla signalna ploča USPOREDNA s kolosijekom (okrenuta „u stranu“ – ne gleda te u lice)
• NOĆ: jedna ZELENA svjetlost pokraj dnevnog znaka

💡 / 🚂: Ulaz dopušten – nastavi prema kolodvoru, i dalje pazi na skretnice i ostale signale.

Usmeno: „Crvena ploča u lice = stoj; ploča usporedo s kolosijekom = slobodno.“`,
  }),

  // ─── ISPITNI TRIKOVI ───
  card({
    id: 'lik-ispit-stoj-nacini',
    group: 'Ispit',
    name: null,
    question: 'Na koje se načine daje „Stoj“? (spomeni i likovnu ručicu)',
    images: ['/pravilnik/slika12.png'],
    imageLabels: ['Likovni Stoj'],
    answer: `Najčešće na ispitu:
1. crveno mirno na glavnom (svjetlosni)
2. VODORAVNA signalna ručica na likovnom glavnom ← ovo moraš pokazati
3. mahanje u krug crvenom zastavicom + ≥5 kratkih zvižduka
4. mahanje u krug bijelom svjetiljkom + ≥5 kratkih zvižduka
5. crveni lopar
6. sirena „Opasnost, koči“ (≥5 kratkih)
7. „Stoj, odron na pruzi“`,
  }),

  card({
    id: 'lik-ispit-kviz',
    group: 'Ispit',
    name: null,
    question: 'Brzi ispit: likovni vs svjetlosni – što moraš znati u 20 sekundi?',
    images: [],
    imageLabels: [],
    answer: `• Likovni = danju lik/položaj, noću svjetlo uz dnevni znak
• Likovni glavni = jednoznačni: STOJ / SLOBODNO / OGRANIČENJE
• Ručice: vodoravno / koso / dvije koso
• Likovni predsignal = samo Očekuj Stoj (uspravno/žuto) i Očekuj Slobodno (vodoravno/zeleno)
• Štitni = stari ulazni s okruglom pločom (crvena = stoj; usporedo = slobodno)`,
  }),
]

/**
 * Banka pitanja za usmeni agencijski ispit (ASZ / dozvola).
 * Prioritet: 1) signali sa slikom + potpuni odgovor  2) priprema  3) teorija
 */

import { pravilnikCategories } from './signalni-pravilnik.js'
import { pripremaItems } from './priprema-ispit.js'
import { enrichSignal } from './agencija-signali-enrich.js'

export const agencijaCats = [
  { id: 'signali-img', title: 'Signali · slika + značenje', icon: '🚦' },
  { id: 'priprema-signali', title: 'Priprema · signali', icon: '📕' },
  { id: 'priprema', title: 'Priprema · ostalo', icon: '📝' },
  { id: 'signali', title: 'Teorija signala', icon: '💡' },
  { id: 'postupci', title: 'Postupci u vožnji', icon: '🚂' },
  { id: 'kocnice', title: 'Kočnice', icon: '🛑' },
  { id: 'skretnice', title: 'Skretnice i manevra', icon: '🔀' },
  { id: 'isprave', title: 'Isprave i nalozi', icon: '📋' },
  { id: 'agencija', title: 'Agencija / dozvola / SMS', icon: '🏛️' },
  { id: 'brojke', title: 'Brojke (brzine, vremena)', icon: '🔢' },
  { id: 'vozila', title: 'Vozila i podsklopovi', icon: '⚙️' },
  { id: 'zvuk', title: 'Znakovi sirene / PAZI', icon: '📢' },
  { id: 'zcp', title: 'ŽCP i prijelazi', icon: '🚧' },
  { id: 'elektro', title: 'Elektrovuča', icon: '⚡' },
  { id: 'osoblje', title: 'Osoblje i dužnosti', icon: '👷' },
  { id: 'oznake', title: 'Signalne oznake', icon: '📍' },
]

const SKIP_SIGNAL_NAMES = /^(postupak|u slučaju kvara|namijenjen)/i

/** Jedna kartica po signalu: SLIKA → potpuni odgovor (značenje + što radiš) */
function buildSignalImageQuestions() {
  const out = []
  let n = 0

  for (const cat of pravilnikCategories) {
    for (const it of cat.items) {
      if (it.type !== 'signal') continue
      if (SKIP_SIGNAL_NAMES.test(it.name || '')) continue

      const images = (it.images || []).map(img => img.image).filter(Boolean)
      if (!images.length) continue

      n++
      const imgNotes = (it.images || [])
        .map((img) => {
          const bits = [img.label, img.desc].filter(Boolean)
          return bits.length ? `• ${bits.join(' — ')}` : null
        })
        .filter(Boolean)

      const group = it.group || cat.title
      const desc = (it.description || '').trim()

      out.push({
        id: `sig-${n}`,
        cat: 'signali-img',
        question: 'Što znači ovaj signal? Objasni izgled, značenje i što radiš.',
        answer: enrichSignal(it.name, desc, imgNotes),
        images,
        group,
        name: it.name,
        kind: 'signal',
      })
    }
  }

  return out
}

/** Sva pitanja iz Priprema za ispit (signali odvojeno – imaju dobre odgovore + slike) */
function buildPripremaQuestions() {
  const signali = []
  const ostalo = []
  let n = 0

  for (const it of pripremaItems) {
    n++
    const images = it.image ? [it.image] : []
    let answer = it.answer || ''

    if (it.type === 'mc' && Array.isArray(it.options)) {
      const correct = it.options[it.correctIndex]
      const letter = String.fromCharCode(97 + (it.correctIndex ?? 0))
      answer = `Točno: ${letter}) ${correct}`
      if (it.explanation) answer += `\n\n${it.explanation}`
    }

    if (!answer?.trim()) continue

    const card = {
      id: `prep-${it.sectionId || 'x'}-${it.num || n}`,
      question: it.question,
      answer: answer.trim(),
      images,
      group: it.sectionId === 'signali' ? 'Priprema · Dio 1 Signali' : (it.sectionId || 'Priprema'),
      kind: images.length ? 'signal' : 'qa',
      name: null,
    }

    if (it.sectionId === 'signali') {
      signali.push({ ...card, cat: 'priprema-signali' })
    } else {
      ostalo.push({ ...card, cat: 'priprema' })
    }
  }

  return { signali, ostalo }
}

const signalImageQuestions = buildSignalImageQuestions()
const { signali: pripremaSignaliQuestions, ostalo: pripremaOstaloQuestions } = buildPripremaQuestions()

export const agencijaManualQuestions = [
  // ─── SIGNALI ───────────────────────────────────────────
  {
    id: 's1', cat: 'signali',
    question: 'Što je signal, a što signalni znak?',
    answer: 'Signal je sredstvo kojim se signalizira signalni znak (stalni, prijenosni ili ručni).\n\nSignalni znak je zapovijed ili upozorenje – može biti jednoznačan ili dvoznačan.',
  },
  {
    id: 's2', cat: 'signali',
    question: 'Kakvi mogu biti glavni signali? Objasni svaki.',
    answer: '• Ulazni – zabranjuje ili dopušta ulazak vlaka u kolodvor (najmanje 100 m ispred prve ulazne skretnice)\n• Izlazni – zabranjuje ili dopušta izlazak iz kolodvora (kolosiječni ili skupni)\n• Prostorni – zabranjuje ili dopušta ulazak u prostorni odsjek\n• Zaštitni – štiti skretnice / rasputnicu; može biti u kolodvoru i na otvorenoj pruzi',
  },
  {
    id: 's3', cat: 'signali',
    question: 'Što signalizira jedna crvena mirna svjetlost?',
    answer: 'STOJ – vožnja od tog signala je zabranjena.',
  },
  {
    id: 's4', cat: 'signali',
    question: 'Što znači jedna zelena mirna svjetlost na jednoznačnom signalu?',
    answer: 'SLOBODNO – vožnja od signala je slobodna.',
  },
  {
    id: 's5', cat: 'signali',
    question: 'Što znači jedna zelena mirna svjetlost na dvoznačnom signalu?',
    answer: 'SLOBODNO, OČEKUJ SLOBODNO ili OPREZNO – vožnja je slobodna i do sljedećeg glavnog signala se brzina ne mora smanjivati.',
  },
  {
    id: 's6', cat: 'signali',
    question: 'Što znači jedna žuta mirna svjetlost na dvoznačnom signalu?',
    answer: 'OPREZNO, OČEKUJ STOJ – sljedeći glavni signal pokazuje STOJ; vlak se mora zaustaviti ispred njega.',
  },
  {
    id: 's7', cat: 'signali',
    question: 'Što znači jedna zelena trepćuća svjetlost?',
    answer: 'SLOBODNO, OČEKUJ OGRANIČENJE BRZINE.',
  },
  {
    id: 's8', cat: 'signali',
    question: 'Što znači žuto trepćuće + žuto mirno?',
    answer: 'OGRANIČENA BRZINA, OČEKUJ STOJ.',
  },
  {
    id: 's9', cat: 'signali',
    question: 'Što znači žuto trepćuće + zeleno mirno?',
    answer: 'OGRANIČENA BRZINA, OČEKUJ SLOBODNO ili OPREZNO.',
  },
  {
    id: 's10', cat: 'signali',
    question: 'Što znači žuto trepćuće + zeleno trepćuće?',
    answer: 'OGRANIČENA BRZINA, OČEKUJ OGRANIČENJE BRZINE.',
  },
  {
    id: 's11', cat: 'signali',
    question: 'Što znači crveno mirno + žuto trepćuće?',
    answer: 'OPREZNA VOŽNJA BRZINOM DO 20 km/h.',
  },
  {
    id: 's12', cat: 'signali',
    question: 'Što je predsignal i gdje se ugrađuje?',
    answer: 'Predsignal se ugrađuje ispred glavnog signala na udaljenosti zaustavnog puta (700 / 1000 / 1500 m).\nUdaljenost ne smije biti veća od 1,5 zaustavnog puta.',
  },
  {
    id: 's13', cat: 'signali',
    question: 'Kakav je postupak kod kvara predsignala?',
    answer: 'Strojovođa postupa kao da predsignal signalizira „Očekuj STOJ“.',
  },
  {
    id: 's14', cat: 'signali',
    question: 'Što je ponavljač predsignaliziranja i kakav je postupak kod kvara?',
    answer: 'Svjetlosni signal ispred glavnog gdje nema propisane daljine vidljivosti. Uvijek ima i bijelo svjetlo.\n\nKod kvara: postupaš kao da glavni signalizira STOJ. Ne moraš stati kod samog ponavljača.',
  },
  {
    id: 's15', cat: 'signali',
    question: 'Što znače signali graničnog kolosiječnog signala?',
    answer: '• Dvije crvene mirne vodoravne → Vožnja zabranjena\n• Dvije bijele mirne kose → Vožnja dopuštena\n\nKod neispravnosti: postupaš kao da je zabranjena.',
  },
  {
    id: 's16', cat: 'signali',
    question: 'Kakav je postupak ako su dvije nezakvačene lokomotive ispred graničnog kolosiječnog signala?',
    answer: '„Vožnja dopuštena“ vrijedi samo za prvo vučno vozilo. Drugo čeka da se pojavi „zabranjena“, pa tek onda novo „dopuštena“.',
  },
  {
    id: 's17', cat: 'signali',
    question: 'Nabroji manevarske signale.',
    answer: '• Signal za zaštitu voznog puta\n• Signal iskliznice\n• Signal okretnice\n• Signal granica manevriranja',
  },
  {
    id: 's18', cat: 'signali',
    question: 'Kad smiješ proći „Manevriranje slobodno“?',
    answer: 'Samo kada glavni signal signalizira STOJ.\nKod kvara manevarskog: postupaš kao da je „Manevriranje zabranjeno“.',
  },
  {
    id: 's19', cat: 'signali',
    question: 'Što je signal „granica manevarskih vožnji“ i kako se prelazi?',
    answer: 'Plavo-bijeli stup između ulazne skretnice i ulaznog signala.\nNa otvorenu prugu smiješ samo uz pisani nalog prometnika.',
  },
  {
    id: 's20', cat: 'signali',
    question: 'Jesu li likovni signali glavni? Jesu li jednoznačni ili dvoznačni?',
    answer: 'Jesu glavni signali. Likovni su jednoznačni (nemaju „očekuj…“).',
  },
  {
    id: 's21', cat: 'signali',
    question: 'Opiši likovni znak STOJ i SLOBODNO (dan/noć).',
    answer: 'STOJ: ručica vodoravno desno; noću crvena mirna pokraj znaka.\nSLOBODNO: ručica koso naviše desno; noću zelena mirna.\nOGRANIČENJE: dvije ručice koso naviše; noću zelena + žuta ispod.',
  },
  {
    id: 's22', cat: 'signali',
    question: 'Što radiš ako je signalni znak nejasan, nepropisan ili dvostruk?',
    answer: 'Uvijek postupaj prema značenju koje odgovara većem stupnju sigurnosti (strože). Odmah javi prometniku / TK dispečeru.',
  },
  {
    id: 's23', cat: 'signali',
    question: 'Što je signalna oznaka?',
    answer: 'Ugrađeno signalno sredstvo kojim se označava ili upozorava posebno važno mjesto na pruzi ili u službenom mjestu (nije zapovijed za vožnju kao glavni signal).',
  },
  {
    id: 's24', cat: 'signali',
    question: 'Što je pokazivač brzine?',
    answer: 'Dopunski signal glavnog signala. Svjetleća bijela brojka na crnoj ploči = „voziti ograničenom brzinom od … km/h“.',
  },
  {
    id: 's25', cat: 'signali',
    question: 'Što signaliziraju skretnički signali?',
    answer: 'U kojem se položaju nalazi skretnica:\n• bijeli uspravni pravokutnik → vožnja u pravac\n• bijela strelica → vožnja u skretanje uz jezičak\n• bijeli vodoravni pravokutnik → vožnja u skretanje niz jezičak',
  },

  // ─── POSTUPCI ──────────────────────────────────────────
  {
    id: 'p1', cat: 'postupci',
    question: 'Smije li strojovođa proći pokraj ulaznog/zaštitnog koji pokazuje zabranjenu vožnju?',
    answer: 'Smije samo uz usmenu obavijest izvršnog kolodvorskog radnika i signalni znak „naprijed“.\n\nBrzina: 20 km/h ako te obavijeste kod samog signala; 50 km/h ako nalogom / RDU / telefonom.',
  },
  {
    id: 'p2', cat: 'postupci',
    question: 'Kolika je brzina ako je prostorni signal neispravan, a sporazumijevanje nemoguće?',
    answer: 'Najviše 30 km/h.',
  },
  {
    id: 'p3', cat: 'postupci',
    question: 'Vrijede li prostorni i ulazni signali pravilnog kolosijeka kad voziš nepravilnim?',
    answer: 'Ne vrijede.\nUlazak u kolodvor nepravilnim kolosijekom samo pod uvjetima iz pisanog naloga.\nMax brzina po nepravilnom: 100 km/h.',
  },
  {
    id: 'p4', cat: 'postupci',
    question: 'Kad i kome se javljaš ako vlak stane na otvorenoj pruzi?',
    answer: 'Nakon 15 minuta moraš obavijestiti prometnike.',
  },
  {
    id: 'p5', cat: 'postupci',
    question: 'Kad i kome se javljaš s pruge kad ne možeš otkloniti kvar na vučnom vozilu?',
    answer: 'Što prije upravitelju infrastrukture (u praksi: prometnik / TK) – mjesto i narav nepravilnosti. Uvjeri se da je obavijest shvaćena. Ocijeni može li vožnja nastaviti i pod kojim uvjetima.',
  },
  {
    id: 'p6', cat: 'postupci',
    question: 'Tko prima i daje priopćenja preko RDU s vlaka?',
    answer: 'Isključivo strojovođa.',
  },
  {
    id: 'p7', cat: 'postupci',
    question: 'Smije li strojovođa samovoljno pokrenuti putnički vlak nakon zaustavljanja?',
    answer: 'Ne – dok mu prometnik ne da signalni znak za polazak, nakon ulaska i izlaska putnika.',
  },
  {
    id: 'p8', cat: 'postupci',
    question: 'Može li se putničkom vlaku dati indirektan polazak?',
    answer: 'Ne može.',
  },
  {
    id: 'p9', cat: 'postupci',
    question: 'Kako prometnik daje direktan polazak?',
    answer: 'Propisanim signalnim znakom za polazak, usmeno i sredstvima sporazumijevanja.',
  },
  {
    id: 'p10', cat: 'postupci',
    question: 'Gdje zaustavljaš putnički vlak ako te nitko ne dočeka?',
    answer: 'Na kraju perona ili uređene površine za ulaz/izlaz putnika (ako nema oznake mjesta zaustavljanja).',
  },
  {
    id: 'p11', cat: 'postupci',
    question: 'Kakav je postupak kod kvara lokomotivske sirene?',
    answer: 'Najvećom brzinom 20 km/h do sljedećeg kolodvora.',
  },
  {
    id: 'p12', cat: 'postupci',
    question: 'Što ako noću nisu ispravna sva čeona svjetla?',
    answer: 'Do sljedećeg kolodvora max 20 km/h.\n(Danju neispravna sva / noću jedno neispravno → do krajnjeg max 100 km/h.)',
  },
  {
    id: 'p13', cat: 'postupci',
    question: 'Smije li se nastaviti vožnja ako kvar brzinomjera nastane na otvorenoj pruzi?',
    answer: 'Smije, oprezno do sljedećeg kolodvora.',
  },
  {
    id: 'p14', cat: 'postupci',
    question: 'Je li dozvoljena vožnja u nezaposjednutoj upravljačnici?',
    answer: 'Ne, nije dozvoljena.',
  },
  {
    id: 'p15', cat: 'postupci',
    question: 'Kako se označava kraj vlaka?',
    answer: 'Dvije završne signalne pločice.\nU depo bez pripadajuće završne pločice lokomotive – ne smiješ.',
  },
  {
    id: 'p16', cat: 'postupci',
    question: 'Što je lagana vožnja i koliko može trajati?',
    answer: 'Vožnja smanjenom brzinom (nižom od dopuštene/ograničene) zbog stanja pruge ili radova.\nNajduže 6 mjeseci.',
  },
  {
    id: 'p17', cat: 'postupci',
    question: 'Postupak ako nisi obaviješten o laganoj vožnji, a vidiš znak „lagano“?',
    answer: 'Odmah poduzmi mjere da se možeš pravodobno zaustaviti na „STOJ“ ili prilagoditi brzinu označenom na ugroženom području.',
  },
  {
    id: 'p18', cat: 'postupci',
    question: 'Na koji način se vlak može potiskivati?',
    answer: 'Zakvačenom i nezakvačenom potiskivalicom.\nZakvačena mora biti uključena u glavni zračni vod (automatska kočnica spojena).',
  },
  {
    id: 'p19', cat: 'postupci',
    question: 'Postupak u slučaju požara na vučnom vozilu.',
    answer: '1. Zaustavi vlak na što sigurnijem mjestu\n2. Hitna procedura (kod požara DM – hitno zaustavljanje motora)\n3. Evakuacija putnika\n4. Gašenje aparatima / ugrađenim sustavom\n5. Što prije obavijesti UI (prometnik/TK) i zovi pomoć\n6. Ne rizikuj; slijedi uputu za tu seriju',
  },
  {
    id: 'p20', cat: 'postupci',
    question: 'Tri načina zaustavljanja dizelskog motora?',
    answer: '• Regularna – sve u redu\n• Ubrzana – zadjelovala zaštita\n• Hitna – kod detekcije požara na DM',
  },
  {
    id: 'p21', cat: 'postupci',
    question: 'Moguće li sporazumijevanje mobitelom (izvan željezničkog sustava)?',
    answer: 'Moguće je ako imaš svjedoka izvršnog radnika.',
  },
  {
    id: 'p22', cat: 'postupci',
    question: 'Što je APB?',
    answer: 'Automatski pružni blok – SS uređaj koji omogućava uzastopne vožnje između kolodvora i onemogućava istodobnu vožnju iz suprotnog smjera. Automatski drži razmak vlakova.',
  },

  // ─── KOČNICE ───────────────────────────────────────────
  {
    id: 'k1', cat: 'kocnice',
    question: 'Kako vlak mora biti kočen?',
    answer: 'Automatskom zračnom kočnicom.',
  },
  {
    id: 'k2', cat: 'kocnice',
    question: 'Kakve kočnice po vrsti djelovanja?',
    answer: 'Kočenje sporog i brzog djelovanja (teretni / putnički režim).',
  },
  {
    id: 'k3', cat: 'kocnice',
    question: 'Nabroji dopunske (dodatne) kočnice.',
    answer: 'Hidrodinamička, elektrodinamička, magnetna (magnetna tračnička)…',
  },
  {
    id: 'k4', cat: 'kocnice',
    question: 'Što je proba kočnica i koje vrste postoje?',
    answer: 'Postupak kojim se ustanovljuje ispravnost kočnica i spremnost za djelovanje.\nČetiri vrste: A (potpuna), B, C, D (skraćene).\nRadi se i na pružnim vozilima i manevarskim sastavima.',
  },
  {
    id: 'k5', cat: 'kocnice',
    question: 'Je li postupak potpune i skraćene probe isti?',
    answer: 'Da – postupak je isti, samo se pregledava dio vlaka / pojedinačni vagoni.',
  },
  {
    id: 'k6', cat: 'kocnice',
    question: 'Granične vrijednosti zabrtvljenosti glavnog voda u 1 minuti?',
    answer: 'Putnički: 0,3 bara.\nTeretni: 0,4 bara.',
  },
  {
    id: 'k7', cat: 'kocnice',
    question: 'Zašto ručicu kočnika stavljaš u brzo kočenje nakon znaka „otkoči“?',
    answer: 'Da pokreneš brzače pražnjenja glavnog zračnog voda i trome rasporednike.',
  },
  {
    id: 'k8', cat: 'kocnice',
    question: 'Što je rasporednik?',
    answer: 'Uređaj koji pušta/ispušta zrak u kočne cilindre ovisno o tlaku u glavnom vodu.\nRežimi: putnički/teretni, prazno/natovareno. Isključuje se isključnom slavinom.',
  },
  {
    id: 'k9', cat: 'kocnice',
    question: 'Što radiš ručicom kočnika?',
    answer: 'Punjenje glavnog voda (~5 bar), stupnjevito kočenje i otkočivanje, brzo (naglo) kočenje.\n\nTok: kompresor → spremnici → kočnik → GV → rasporednik → cilindri.',
  },
  {
    id: 'k10', cat: 'kocnice',
    question: 'Što je budnik i kako radi?',
    answer: 'Uređaj za kontrolu budnosti strojovođe. Uključuje se oko 6 km/h.\nNeposluživanje: svjetlo → sirena → EVB / naglo kočenje.\nNakon djelovanja treba reset (često uz gas na 0).',
  },
  {
    id: 'k11', cat: 'kocnice',
    question: 'Kad se primjenjuje brzo kočenje?',
    answer: 'Kad se vlak mora zaustaviti zbog nepredviđenih situacija na najkraćem mogućem putu kočenja.\nMože se aktivirati i slavinom/ručicom za slučaj opasnosti na vagonima.',
  },
  {
    id: 'k12', cat: 'kocnice',
    question: 'Je li obilježeno mjesto na pruzi gdje trebaš početi kočiti?',
    answer: 'Ne – strojovođa sam odlučuje kad će zavesti kočenje, ovisno o okolnostima.',
  },
  {
    id: 'k13', cat: 'kocnice',
    question: 'Koja se kočnica koristi za reguliranje brzine vlaka?',
    answer: 'U prvom redu dinamička, a može i direktna kočnica.',
  },
  {
    id: 'k14', cat: 'kocnice',
    question: 'Mora li se strojovođa osobno uvjeriti da je VV zakvačeno i priključeno?',
    answer: 'Da – osobno se mora uvjeriti da je vučno vozilo ispravno zakvačeno i priključeno za prvi vagon.',
  },
  {
    id: 'k15', cat: 'kocnice',
    question: 'Može li vagon s neispravnom kočnicom ostati u sastavu vlaka?',
    answer: 'Može (uz uvjete propisa – ostale kočnice moraju pokriti potrebnu kočnu masu).',
  },

  // ─── SKRETNICE / MANEVRA ───────────────────────────────
  {
    id: 'sk1', cat: 'skretnice',
    question: 'Koje položaje razlikujemo kod skretnica?',
    answer: 'Redovan i pravilan.',
  },
  {
    id: 'sk2', cat: 'skretnice',
    question: 'Što je presijecanje skretnice?',
    answer: 'Nasilno mijenjanje njezina položaja vožnjom niz jezičak.\nNajveća brzina preko presječene: 20 km/h.',
  },
  {
    id: 'sk3', cat: 'skretnice',
    question: 'Što treba učiniti za vožnju preko presječene skretnice uz jezičak?',
    answer: 'Pregledati, ručno postaviti u ispravan položaj i mehanički osigurati (klin + ambulantna brava).',
  },
  {
    id: 'sk4', cat: 'skretnice',
    question: 'Treba li ambulantna brava za vožnju niz jezičak?',
    answer: 'Ne.\nIznimka: na skretnici na otvorenoj pruzi brava se iznimno ne skida, ali se skretnica prethodno pregleda po obavijesti TK/prometnika.',
  },
  {
    id: 'sk5', cat: 'skretnice',
    question: 'Što podrazumijeva manevarsko kretanje?',
    answer: 'Kretanje pojedinačnih ili zakvačenih vozila ako nije vožnja vlaka.\nManevarska vožnja = vuča ili guranje vozila vučnim vozilom.',
  },
  {
    id: 'sk6', cat: 'skretnice',
    question: 'Brzine pri manevriranju preko skretnica?',
    answer: 'Max 30 km/h preko skretnica.\nAko je na boku vozila radnik/manevrista: 20 km/h.',
  },
  {
    id: 'sk7', cat: 'skretnice',
    question: 'Do kud je u kolodvoru dozvoljeno manevriranje?',
    answer: 'Do signala „granica manevriranja“.\nPreko njega – samo uz prethodno odobrenje prometnika, pod određenim uvjetima.',
  },
  {
    id: 'sk8', cat: 'skretnice',
    question: 'Tko je odgovoran za pravilan položaj skretnica na manevarskom putu?',
    answer: 'Radnik koji njima rukuje.',
  },
  {
    id: 'sk9', cat: 'skretnice',
    question: 'Mogu li se odbacivati ili spuštati vagoni s putnicima?',
    answer: 'Ne.',
  },
  {
    id: 'sk10', cat: 'skretnice',
    question: 'Što podrazumijeva pojam kvačenja vozila?',
    answer: 'Kvačenje i otkvačivanje željezničkih vozila bez obzira na vrstu kvačila.\nMože biti: ručno/mehaničko (vijčano), automatsko (npr. Scharfenberg), na nekim VV električki ili mehanički odabir.',
  },
  {
    id: 'sk11', cat: 'skretnice',
    question: 'Kad se skretnica smatra neosiguranom?',
    answer: 'Kada je nije moguće osigurati u voznome putu na siguran način.',
  },
  {
    id: 'sk12', cat: 'skretnice',
    question: 'Kolika je max brzina preko skretnica u službenom mjestu bez ulaznog signala?',
    answer: '100 km/h.',
  },

  // ─── ISPRAVE ───────────────────────────────────────────
  {
    id: 'i1', cat: 'isprave',
    question: 'Nabroji popratne isprave vlaka (SE).',
    answer: 'SE-1 – Nalog za vožnju\nSE-2 – Izvješće o sastavu i kočenju vlaka\nSE-3 – Pisani nalog\nSE-4 – Izvješće o primopredaji vlaka\nSE-5 – Raspored manevriranja',
  },
  {
    id: 'i2', cat: 'isprave',
    question: 'Objasni SE-2.',
    answer: 'Izvješće o sastavu i kočenju vlaka – prvo se ispunjava.\nSadrži: broj i relaciju, masu, duljinu, broj osovina, potreban % kočenja (P), stvarnu i potrebnu kočnu masu, podatke o probi kočenja.',
  },
  {
    id: 'i3', cat: 'isprave',
    question: 'Kad strojovođa dobiva pisani nalog (SE-3)?',
    answer: 'Za posebnosti koje nalogom za vožnju nisu (ili nisu mogle biti) priopćene, npr.:\n• zaustavljanje ispred ŽCP-a\n• vožnja nepravilnim kolosijekom\n• prolazak pokraj STOJ / zabranjene vožnje\n• pružni radovi\n• brzina koja nije u voznom redu\n\nPotpišeš kad si razumio usmeno i pisano.',
  },
  {
    id: 'i4', cat: 'isprave',
    question: 'Može li drugi izvršni radnik uručiti pisani nalog? Treba li pročitati sadržaj?',
    answer: 'Može, ako je to propisano poslovnim redom kolodvora.\nDa – uručitelj mora i pročitati sadržaj.',
  },
  {
    id: 'i5', cat: 'isprave',
    question: 'Kako se obavještava strojovođa za brzinu ako nije propisana voznim redom?',
    answer: 'Pismenim nalogom.',
  },

  // ─── AGENCIJA / DOZVOLA / SMS ──────────────────────────
  {
    id: 'a1', cat: 'agencija',
    question: 'Koja je uloga Agencije za sigurnost željezničkog prometa (ASZ)?',
    answer: 'Tijelo nadležno za sigurnost u smislu željezničkog zakonodavstva EU – reguliranje i nadzor.\nOvlašćuje centre za osposobljavanje i ispitivače; izdaje dozvolu; nadzire osposobljenost i valjanost dozvole/potvrde; nadzire i odobrava SMS.',
  },
  {
    id: 'a2', cat: 'agencija',
    question: 'Kako se dokazuje ovlaštenje strojovođe?',
    answer: 'Dozvolom i potvrdom.',
  },
  {
    id: 'a3', cat: 'agencija',
    question: 'Što se utvrđuje dozvolom i koliko vrijedi?',
    answer: 'Identitet; da ispunjava minimalne zdravstvene, obrazovne i stručne uvjete; ovlašćuje za jednu ili više kategorija.\nVrijedi 10 godina. Izdaje Agencija.',
  },
  {
    id: 'a4', cat: 'agencija',
    question: 'Tko provodi osposobljavanje, a tko ovlašćuje centre i ispitivače?',
    answer: 'Osposobljavanje: centri za osposobljavanje.\nOvlašćuje centre i ispitivače: Agencija (ASZ).',
  },
  {
    id: 'a5', cat: 'agencija',
    question: 'Što je SMS i tko sudjeluje?',
    answer: 'SMS (Safety Management System) = sustav upravljanja sigurnošću – sustav PODUZEĆA, nije agencija.\n\nSudjeluju: upravitelj infrastrukture, prijevoznici, ECM i drugi s utjecajem na sigurnost; strojovođa ga PROVODI u vožnji.\nASZ taj sustav NADZIRE i ODOBRAVA.',
  },
  {
    id: 'a6', cat: 'agencija',
    question: 'Koji su to „izvršni radnici“ i koji su preduvjeti?',
    answer: 'Radnici koji obavljaju poslove vezane za sigurnost i neposredno sudjeluju u prometu.\nPreduvjeti: stručno osposobljen i zdravstveno sposoban.',
  },
  {
    id: 'a7', cat: 'agencija',
    question: 'Koliko najduže traje radno vrijeme / neprekidna vožnja?',
    answer: 'Radno vrijeme izvršnog radnika: najduže 12 sati u smjeni.\nNeprekidna vožnja: max 6 sati (5 sati ako upravlja putničkim vlakom).',
  },
  {
    id: 'a8', cat: 'agencija',
    question: 'Što je nejednakomjerni smjenski rad?',
    answer: 'Rad kod kojeg izvršni radnik kontinuirano započinje ili završava poslove u različito doba dana ili noći.',
  },
  {
    id: 'a9', cat: 'agencija',
    question: 'Što je nesreća?',
    answer: 'Neželjeni ili nenamjerni iznenadni događaj (ili slijed) sa štetnim posljedicama – npr. sudar, iskliznuće, nesreća na ŽCP-u, žrtve uz vozilo u pokretu, požar…',
  },
  {
    id: 'a10', cat: 'agencija',
    question: 'Kako se razvrstavaju željezničke pruge?',
    answer: 'Na pruge za međunarodni, regionalni i lokalni promet.',
  },
  {
    id: 'a11', cat: 'agencija',
    question: 'Na što se primjenjuje zakon o interoperabilnosti?',
    answer: 'Na željeznički sustav u cjelini: infrastrukturu, upravitelje infrastrukture i željezničke prijevoznike.',
  },
  {
    id: 'a12', cat: 'agencija',
    question: 'Što čini kolodvorsko područje?',
    answer: 'Prostor između ulaznog signala s jedne i ulaznog signala s druge strane.\nAko nema ulaznih signala: između prvih ulaznih skretnica s obiju strana.',
  },
  {
    id: 'a13', cat: 'agencija',
    question: 'Koja su službena mjesta na pruzi?',
    answer: 'Kolodvori, otpremništva, odjavnice, rasputnice i stajališta.',
  },
  {
    id: 'a14', cat: 'agencija',
    question: 'Što je strojovođa?',
    answer: 'Radnik koji upravlja vučnim vozilom kod vožnje vlaka i manevriranja.',
  },
  {
    id: 'a15', cat: 'agencija',
    question: 'Uloga prometnika vlakova?',
    answer: 'Regulira sigurno kretanje željezničkih vozila u kolodvoru i na međukolodvorskim odsjecima.',
  },

  // ─── BROJKE ────────────────────────────────────────────
  {
    id: 'b1', cat: 'brojke',
    question: 'Kolike mogu biti duljine zaustavnog puta?',
    answer: '700 m, 1000 m ili 1500 m – određuje upravitelj infrastrukture i objavljuje u Izvješću o mreži.',
  },
  {
    id: 'b2', cat: 'brojke',
    question: 'Navedi ključne brzine: STOJ prolazak, prostorni kvar, nepravilan, presječena, manevra.',
    answer: '• STOJ – obavijest kod signala: 20 km/h\n• STOJ – nalog/RDU/telefon: 50 km/h\n• Prostorni neispravan, nema veze: 30 km/h\n• Nepravilan kolosijek: 100 km/h\n• Presječena skretnica: 20 km/h\n• Manevra preko skretnica: 30 km/h (radnik na boku 20)\n• Čuvar na prijelazu: 20 km/h\n• Sirena / noću sva svjetla: 20 km/h do sljedećeg',
  },
  {
    id: 'b3', cat: 'brojke',
    question: 'Koliko minuta prije polaska se daje zvonovni signal?',
    answer: '3 minute. Daje ga prometnik vlakova.',
  },
  {
    id: 'b4', cat: 'brojke',
    question: 'Koliko se može produžiti vozno vrijeme od uključne točke do ŽCP-a da bi se smatrao ispravnim?',
    answer: 'Do 4 minute. Kasniš → prijelaz se smatra neosiguranim.',
  },
  {
    id: 'b5', cat: 'brojke',
    question: 'Ulazni signal – minimalna udaljenost ispred prve ulazne skretnice?',
    answer: 'Najmanje 100 m.',
  },
  {
    id: 'b6', cat: 'brojke',
    question: 'S koliko najviše znamenki može biti označen vlak u RH?',
    answer: 'Najviše 5 znamenki (arapskim brojevima).',
  },

  // ─── VOZILA ────────────────────────────────────────────
  {
    id: 'v1', cat: 'vozila',
    question: 'Od kojih podsklopova se sastoji željezničko vozilo?',
    answer: '• Mehanički dio (okvir, sanduk, osovinski sklopovi, ovjes)\n• Kočni sustav\n• Vučni i odbojni uređaji\n• Pogonska postrojenja (kod vučnih vozila)',
  },
  {
    id: 'v2', cat: 'vozila',
    question: 'Što je osovinski sklop i kakvi mogu biti?',
    answer: 'Dio vozila koji omogućava kretanje po tračnicama: osovina, kotači, ležajevi, dijelovi kočnice, po potrebi pogon.\nVrste: slobodni i pogonski.',
  },
  {
    id: 'v3', cat: 'vozila',
    question: 'Što je vlačni uređaj / vlačna sprega?',
    answer: 'Vlačni uređaj prenosi vučne i tlačne sile između vozila (+ odbojnici).\nKlasična vlačna sprega: vučna kuka + vijčano kvačilo + spojni elementi.\nAlternativa: automatsko kvačilo (npr. Scharfenberg).',
  },
  {
    id: 'v4', cat: 'vozila',
    question: 'Serije teretnih vagona (UIC) – nabroji glavne.',
    answer: 'E – otvoreni visoki · F – posebni otvoreni · G – zatvoreni · H – posebni zatvoreni · I – rashladni · K/L – ravni osovinski · O – otvoreni višenamjenski · R/S – ravni s postoljima · T – otvoreni krov · U – specijalni · Z – cisterne\n(Mala slova = oprema/osovine, npr. Za.)',
  },
  {
    id: 'v5', cat: 'vozila',
    question: 'Koji teretni vagoni se ne smiju uvrstiti u putničke vlakove?',
    answer: 'Vagoni tovareni opasnim tvarima.',
  },
  {
    id: 'v6', cat: 'vozila',
    question: 'Može li radna lokomotiva biti u sredini vlaka?',
    answer: 'Da, kao međulokomotiva.',
  },
  {
    id: 'v7', cat: 'vozila',
    question: 'Željeznički podsustavi – kako se dijele?',
    answer: 'Strukturni: građevinski (INF), elektroenergetski, pružni CCS, CCS u vozilu, vozila.\nFunkcionalni: odvijanje prometa, održavanje, telematika.',
  },
  {
    id: 'v8', cat: 'vozila',
    question: 'Što je glavni prolazni kolosijek?',
    answer: 'Kolosijek koji čini izravno produljenje prolaznog (pružnog) kolosijeka.',
  },
  {
    id: 'v9', cat: 'vozila',
    question: 'Kakav može biti vlak po redovnosti? U koju skupinu spada pokusni?',
    answer: 'Redovan i izvanredan.\nPokusni spada u vlakove za posebne namjene.',
  },
  {
    id: 'v10', cat: 'vozila',
    question: 'Što podrazumijeva „službeni vlak“?',
    answer: 'Vlak za prijevoz prazne putničke garniture, lokomotivski i materijalni.',
  },

  // ─── ZVUK / PAZI ───────────────────────────────────────
  {
    id: 'z1', cat: 'zvuk',
    question: 'Pet (ili više) slučajeva kad se daje znak PAZI.',
    answer: 'PAZI = jedan dugačak zvuk:\n1. ispred mjesta rada na pruzi\n2. ispred neispravnog / nezaposjednutog ŽCP-a\n3. prije tunela / mosta / usjeka\n4. kod mimoilaženja vlakova\n5. nailazak na stajalište nepravilnim kolosijekom\n(+ prilazni signal, smanjena vidljivost, potiskivanje…)',
  },
  {
    id: 'z2', cat: 'zvuk',
    question: 'Kako se daje zvonovni signal „vožnja vlaka prema kraju pruge“?',
    answer: 'Tri puta po dva kratka zvonjenja. Daje prometnik, 3 minute prije polaska.',
  },
  {
    id: 'z3', cat: 'zvuk',
    question: 'Koje signalne znakove daje drugi izvršni radnik kad dočekuje vlak?',
    answer: '„Malo naprijed“, „lagano“ i „STOJ“.',
  },

  // ─── ŽCP ───────────────────────────────────────────────
  {
    id: 'zc1', cat: 'zcp',
    question: 'Što je kontrolni svjetlosni signal na ŽCP-u?',
    answer: 'Obavještava strojovođu je li uređaj na ŽCP-u ispravan ili neispravan.\n• Bijelo trepćuće + žuto mirno → ispravan\n• Samo žuto mirno → neispravan',
  },
  {
    id: 'zc2', cat: 'zcp',
    question: 'Što je uključna točka?',
    answer: 'Crna ploča s četiri bijela romba – „Uključna točka, očekuj kontrolni signal“.\nKad prođeš, obrati pozornost na kontrolni signal.',
  },
  {
    id: 'zc3', cat: 'zcp',
    question: 'Što ako si pisanim nalogom obaviješten da je ŽCP neispravan?',
    answer: 'Kod uključne točke / odgovarajućeg znaka počinješ kočiti da se na vrijeme zaustaviš ispred ŽCP-a.',
  },
  {
    id: 'zc4', cat: 'zcp',
    question: 'Max brzina preko prijelaza zaposjednutog čuvarom?',
    answer: '20 km/h.',
  },
  {
    id: 'zc5', cat: 'zcp',
    question: 'Smije li se nastaviti vožnja ako je putni prijelaz neispravan?',
    answer: 'Da, pod određenim uvjetima (prema propisu / nalogu – oprezno, često uz zaustavljanje ili smanjenje brzine).',
  },

  // ═══════════════════════════════════════════════════════
  // DOPUNA – veliki paket
  // ═══════════════════════════════════════════════════════

  // ─── JOŠ SIGNALA ───────────────────────────────────────
  {
    id: 's26', cat: 'signali',
    question: 'Kakvih glavnih signala ima po načinu signaliziranja (jednoznačni/dvoznačni, svjetlosni/likovni)?',
    answer: 'Glavni signali mogu biti:\n• jednoznačni ili dvoznačni\n• svjetlosni ili likovni\n\nLikovni su jednoznačni.',
  },
  {
    id: 's27', cat: 'signali',
    question: 'Kako mogu biti obojani stupovi glavnih signala?',
    answer: 'Crveno-bijelo, crno-bijelo ili crveno-crno-bijelo.',
  },
  {
    id: 's28', cat: 'signali',
    question: 'Koje vrste izlaznih signala imamo?',
    answer: 'Skupni izlazni signal i kolosiječni izlazni signal.',
  },
  {
    id: 's29', cat: 'signali',
    question: 'Mogu li se zaštitni signali ugrađivati na otvorenoj pruzi?',
    answer: 'Mogu.',
  },
  {
    id: 's30', cat: 'signali',
    question: 'Što je jednoznačni znak „ograničena brzina“ (svjetla)?',
    answer: 'Jedno žuto mirno i jedno zeleno mirno svjetlo.',
  },
  {
    id: 's31', cat: 'signali',
    question: '„Glavni signal signalizira slobodno“ na ponavljaču – kako izgleda?',
    answer: 'Jedna zelena mirna i ispod nje jedna mliječno bijela svjetlost.',
  },
  {
    id: 's32', cat: 'signali',
    question: '„Glavni signal signalizira STOJ“ na ponavljaču – kako izgleda?',
    answer: 'Žuto mirno + bijelo mirno.',
  },
  {
    id: 's33', cat: 'signali',
    question: '„Glavni signal signalizira ograničenje brzine“ na ponavljaču?',
    answer: 'Zeleno trepćuće + bijelo mirno.',
  },
  {
    id: 's34', cat: 'signali',
    question: 'Predsignal – znakovi „Očekuj STOJ / Slobodno / ograničenje“?',
    answer: '• Očekuj STOJ – žuto mirno\n• Očekuj Slobodno – zeleno mirno\n• Očekuj ograničenje brzine – zeleno trepćuće',
  },
  {
    id: 's35', cat: 'signali',
    question: 'Likovni predsignal – Očekuj STOJ i Očekuj Slobodno?',
    answer: 'Očekuj STOJ: ploča uspravno; noću žuta mirna pokraj znaka.\nOčekuj Slobodno: ploča vodoravno s crnim rubom prema vlaku; noću zelena mirna.',
  },
  {
    id: 's36', cat: 'signali',
    question: 'Što signaliziraju likovni glavni signali (koja tri znaka)?',
    answer: '„STOJ“, „Slobodno“ i „Ograničena brzina“.\nOd ta tri, „ograničena brzina“ je u ovisnosti sa skretnicama.',
  },
  {
    id: 's37', cat: 'signali',
    question: 'Što signalizira likovni predsignal?',
    answer: '„Očekuj STOJ“ i „Očekuj Slobodno“.',
  },
  {
    id: 's38', cat: 'signali',
    question: 'Signalni znak „manevriranje zabranjeno“ (zaštita voznog puta)?',
    answer: 'Jedna crvena mirna svjetlost.',
  },
  {
    id: 's39', cat: 'signali',
    question: 'Signalni znak „manevriranje slobodno“ (zaštita voznog puta)?',
    answer: 'Jedna bijela mirna svjetlost.',
  },
  {
    id: 's40', cat: 'signali',
    question: 'Kako izgleda signal iskliznice „manevriranje zabranjeno“?',
    answer: 'Plavi romb s bijelim rubom.',
  },
  {
    id: 's41', cat: 'signali',
    question: 'Signali na okretnici – koji znakovi?',
    answer: 'Manevriranje zabranjeno (plavi romb) i manevriranje slobodno (uspravni bijeli pravokutnik).',
  },
  {
    id: 's42', cat: 'signali',
    question: 'Što je međnik?',
    answer: 'Označava mjesto između dva kolosijeka koji se spajaju – do kojeg se smiju nalaziti vozila da ne ugrožavaju vožnju po susjednom kolosijeku.',
  },
  {
    id: 's43', cat: 'signali',
    question: 'Što je „granica odsjeka“?',
    answer: 'Mjesto koje vozila moraju zauzeti ili osloboditi kako bi se omogućilo rukovanje skretnicama i signalima.',
  },
  {
    id: 's44', cat: 'signali',
    question: 'Signal „kraj krnjeg kolosijeka“ – kako izgleda?',
    answer: 'Crna kvadratna ploča s dva bijela polukruga (reflektirajuća).',
  },
  {
    id: 's45', cat: 'signali',
    question: '„Vožnja u pravac“ na skretničkom signalu?',
    answer: 'Bijeli uspravni pravokutnik na crnoj podlozi (u oba smjera vožnje).',
  },
  {
    id: 's46', cat: 'signali',
    question: '„Vožnja u skretanje uz jezičak“ vs „niz jezičak“?',
    answer: 'Uz jezičak: bijela strelica s vrhom u smjeru skretanja.\nNiz jezičak: bijeli vodoravni pravokutnik na crnoj podlozi.',
  },
  {
    id: 's47', cat: 'signali',
    question: '„Vožnja za sporedni pravac u oba smjera“ – kako izgleda?',
    answer: 'Bijeli kosi križ na crnoj podlozi u oba smjera vožnje.',
  },
  {
    id: 's48', cat: 'signali',
    question: 'Kakvih skretnica imamo (po tipu)?',
    answer: 'Jednostrukih i križnih.',
  },
  {
    id: 's49', cat: 'signali',
    question: 'Signal „početak ograničene brzine“ i „kraj“ – kako izgledaju?',
    answer: 'Početak: bijela kvadratna ploča s tri kose crne crte naviše s lijeva nadesno.\nKraj: bijela kvadratna ploča s dvije uspravne crne pruge.',
  },
  {
    id: 's50', cat: 'signali',
    question: 'Gdje se ugrađuje „Očekuj ograničenje brzine“ (udaljenosti)?',
    answer: '• 500 m ispred početka – za zaustavni put 700 m\n• 700 m – za zaustavni put 1000 m\n• 1000 m – za zaustavni put 1500 m',
  },
  {
    id: 's51', cat: 'signali',
    question: 'Na predsignalnoj ploči ograničenja brzine – što znači donji broj od dva?',
    answer: 'Ograničenu brzinu za vlakove s nagibnom tehnikom.',
  },
  {
    id: 's52', cat: 'signali',
    question: 'Signalni znak „STOJ, odron na pruzi“?',
    answer: 'Jedna crvena treptajuća svjetlost.',
  },
  {
    id: 's53', cat: 'signali',
    question: 'Signalni znak „manevarska lokomotiva“?',
    answer: 'Na prednjoj i stražnjoj strani po jedna bijela svjetlost.',
  },
  {
    id: 's54', cat: 'signali',
    question: 'Kako se označava čelo vlaka?',
    answer: 'Tri bijele svjetlosti u jednakokračnom trokutu.',
  },
  {
    id: 's55', cat: 'signali',
    question: 'Kako se označava kraj teretnog / putničkog vlaka?',
    answer: 'Teretni: dva crvena trokuta okrenuta vrhom jedan prema drugom na bijeloj ploči.\nPutnički: dvije crvene svjetlosti u istoj razini iznad odbojnika.\n(Općenito se govori i o dvije završne pločice.)',
  },
  {
    id: 's56', cat: 'signali',
    question: 'Do kada se smiju rabiti signali koji se više ne smiju ugrađivati?',
    answer: 'Do njihove zamjene ili rekonstrukcije.',
  },
  {
    id: 's57', cat: 'signali',
    question: 'Signalna oznaka „signal ne vrijedi“ – kako izgleda?',
    answer: 'Bijeli kosi križ s crnim rubom.',
  },

  // ─── JOŠ POSTUPAKA ─────────────────────────────────────
  {
    id: 'p23', cat: 'postupci',
    question: 'Smije li strojovođa pokrenuti vlak ako nije siguran da je prometnik dao polazak?',
    answer: 'Ne, ne smije.',
  },
  {
    id: 'p24', cat: 'postupci',
    question: 'Mora li prometnik ponoviti „polazak“ ako se vlak zaustavio na kolodvorskom području nakon polaska?',
    answer: 'Mora ponoviti signalni znak „polazak“.',
  },
  {
    id: 'p25', cat: 'postupci',
    question: 'Kako prometnik opoziva signalni znak „polazak“?',
    answer: 'Signalnim znakom „STOJ“.',
  },
  {
    id: 'p26', cat: 'postupci',
    question: 'Tko smije otpremiti vlak loparom / zelenom svjetiljkom?',
    answer: 'Službujući prometnik vlakova.',
  },
  {
    id: 'p27', cat: 'postupci',
    question: 'Kako izgleda svjetlosni signal „polazak“?',
    answer: 'Kružnica svjetlećih zelenih žarulja na izlaznom signalu.',
  },
  {
    id: 'p28', cat: 'postupci',
    question: 'Kako prometnik dočekuje vlak koji prolazi kolodvor danju?',
    answer: 'Stojeći mirno bez signalnog loparića.',
  },
  {
    id: 'p29', cat: 'postupci',
    question: 'Kako prometnik daje „prolazak slobodan“ kod iznimnog prolaska?',
    answer: 'Od ulazne skretnice pa sve do visine prometnog ureda (podizanje/spuštanje loparića ili zelene svjetiljke iznad glave).',
  },
  {
    id: 'p30', cat: 'postupci',
    question: 'Može li netko drugi osim prometnika dočekati vlak?',
    answer: 'Može – drugi izvršni radnik (daje „malo naprijed“, „lagano“, „STOJ“).',
  },
  {
    id: 'p31', cat: 'postupci',
    question: 'Što strojovođa provjerava prije izlaska na graničnik (sigurnosni uređaji)?',
    answer: 'Budnik, autostop (AS), čeona rasvjeta, sirena, kočnica lokomotive.',
  },
  {
    id: 'p32', cat: 'postupci',
    question: 'Koja je oprema lokomotive (osnovno)?',
    answer: 'Prva pomoć, zaštitni prsluk i kaciga, knjiga primopredaje, zaustavne papuče, rezervno crijevo i ključ, pribor za čišćenje, ključevi lokomotive.',
  },
  {
    id: 'p33', cat: 'postupci',
    question: 'Treba li provjeriti rok valjanosti vatrogasnih aparata?',
    answer: 'Da – obavezno rok valjanosti i ispravnost aparata.',
  },
  {
    id: 'p34', cat: 'postupci',
    question: 'Hoće li strojovođa izaći na graničnik ako je registrirajući uređaj neispravan?',
    answer: 'Ne – tražit će popravak lokomotive.',
  },
  {
    id: 'p35', cat: 'postupci',
    question: 'Trebaju li pjeskare biti namirene prije izlaska na graničnik?',
    answer: 'Da – pjeskare trebaju biti pune i ispravne.',
  },
  {
    id: 'p36', cat: 'postupci',
    question: 'Kad strojovođa potpisuje knjigu zapovjedi?',
    answer: 'Prije svake službe, kod prijema.',
  },
  {
    id: 'p37', cat: 'postupci',
    question: 'Koju evidenciju popunjava kod primopredaje vučnog vozila?',
    answer: 'Evidenciju EV-42 o primopredaji vučnog vozila.',
  },
  {
    id: 'p38', cat: 'postupci',
    question: 'Što je graničnik?',
    answer: 'Mjesto na kolosijeku gdje se obavlja primopredaja vučnog vozila između operatera (prijevoznika) i infrastrukture.',
  },
  {
    id: 'p39', cat: 'postupci',
    question: 'Treba li strojovođa biti upoznat s poslovnim redom vuče (ložionice)?',
    answer: 'Da.',
  },
  {
    id: 'p40', cat: 'postupci',
    question: 'Može li se signalni znak „STOJ“ dati bilo kakvim sredstvom?',
    answer: 'Da – kod opasnosti.',
  },
  {
    id: 'p41', cat: 'postupci',
    question: 'Kad se koristi više lokomotiva za vuču jednog vlaka?',
    answer: 'Kad je vučna snaga jedne lokomotive nedostatna i za čišćenje snježnih nanosa.',
  },
  {
    id: 'p42', cat: 'postupci',
    question: 'Što je „dopuštena brzina“ vs „ograničena brzina“?',
    answer: 'Dopuštena: najveća brzina na pruzi/dionici upisana u registar infrastrukture (tehničko stanje pruge).\nOgraničena: brzina niža od dopuštene zbog stanja pruge ili konstrukcije/osiguranja skretnica; propisana voznim redom i signalizirana.',
  },
  {
    id: 'p43', cat: 'postupci',
    question: 'Što je zaustavni put?',
    answer: 'Propisani najveći dopušteni put potpunog kočenja za vlak koji vozi najvećom dopuštenom brzinom. Duljina: 700, 1000 ili 1500 m. Određuje UI i objavljuje u Izvješću o mreži.',
  },
  {
    id: 'p44', cat: 'postupci',
    question: 'Što je jednokolosiječna / dvokolosiječna pruga?',
    answer: 'Jednokolosiječna: jedan kolosijek na otvorenoj pruzi – vožnja u jednom ili oba smjera.\nDvokolosiječna: dva kolosijeka – pravilan (određen smjer) i nepravilan (suprotno od određenog).',
  },
  {
    id: 'p45', cat: 'postupci',
    question: 'Što je desnostrani promet / obostrani promet?',
    answer: 'Desnostrani: vožnja po desnom kolosijeku u smjeru kretanja.\nObostrani: na dvokolosiječnoj pruzi s SS uređajima – vožnja istog smjera po oba kolosijeka (redovan / susjedni).',
  },
  {
    id: 'p46', cat: 'postupci',
    question: 'Gdje počinje ograničena brzina u kolodvoru (sa veće na manju, oznaka u voznom redu)?',
    answer: 'Nailaskom čela vlaka na zadnju izlaznu skretnicu brzina treba biti manja (prema oznaci u voznom redu).',
  },
  {
    id: 'p47', cat: 'postupci',
    question: 'Kako se strojovođe sporazumijevaju pri potiskivanju?',
    answer: 'Propisanim signalnim znakovima osoblja vučnog vozila ili drugim sredstvima sporazumijevanja.',
  },
  {
    id: 'p48', cat: 'postupci',
    question: 'Treba li automatska kočnica zakvačene potiskivalice biti spojena s kočnicom vlaka?',
    answer: 'Da. I dvije potiskivalice međusobno zakvačene trebaju biti uključene u glavni zračni vod.',
  },

  // ─── JOŠ KOČNICA ───────────────────────────────────────
  {
    id: 'k16', cat: 'kocnice',
    question: 'Signalni znak „poziv na probu kočenja“?',
    answer: 'Tri kratka i jedan dugačak zvižduk usnom zviždaljkom.',
  },
  {
    id: 'k17', cat: 'kocnice',
    question: '„Proba kočenja završena“ – dnevni/noćni znak?',
    answer: 'Danju: ruku podići uvis, licem prema strojovođi.\nNoću: uvis podići signalnu svjetiljku s bijelom svjetlošću prema strojovođi.',
  },
  {
    id: 'k18', cat: 'kocnice',
    question: 'Tko provjerava jesu li plombirane ručice kočnika u slučaju opasnosti na vagonima?',
    answer: 'Kondukter u polaznim kolodvorima.',
  },
  {
    id: 'k19', cat: 'kocnice',
    question: 'Za što se rabe ručne zaustavne papuče?',
    answer: 'Za zaustavljanje vagona pri manevriranju i osiguranje od samopokretanja.',
  },
  {
    id: 'k20', cat: 'kocnice',
    question: 'Što je AS (autostop) uređaj?',
    answer: 'Sigurnosni uređaj koji prisilno koči vlak ako strojovođa ne poštuje signal (npr. prolazak pokraj STOJ / ne reagira na prednajavu). Strojovođa ga provjerava prije izlaska na graničnik.',
  },
  {
    id: 'k21', cat: 'kocnice',
    question: 'Može li se budnik provjeriti na mjestu?',
    answer: 'Da – probnim tipkalom (tasterom) na lokomotivi.',
  },
  {
    id: 'k22', cat: 'kocnice',
    question: 'Što je izravna (direktna) vs neizravna (automatska) kočnica?',
    answer: 'Neizravna/automatska: radi preko glavnog voda i rasporednika – koči cijeli vlak; ako pukne vod, koči.\nIzravna/direktna: djeluje izravno na kočne cilindre vučnog vozila (za manevaru / dopunu).',
  },
  {
    id: 'k23', cat: 'kocnice',
    question: 'Što je kočna masa i zašto je važna?',
    answer: 'Mjera učinka kočenja vlaka. U SE-2 uspoređuješ potrebnu i stvarnu kočnu masu (i postotak kočenja P). Ako stvarna nije dovoljna – postupak prema propisu (smanjenje brzine / izmjene…).',
  },
  {
    id: 'k24', cat: 'kocnice',
    question: 'Što je probojno vrijeme / zaustavni put u kontekstu kočenja?',
    answer: 'Vezano uz fiziku kočenja: vrijeme i put od početka kočenja do zaustavljanja. Zaustavni put na pruzi je propisan (700/1000/1500 m) za max dopuštenu brzinu.',
  },
  {
    id: 'k25', cat: 'kocnice',
    question: 'Radi li se proba kočnica na pružnim vozilima i manevarskim sastavima?',
    answer: 'Da.',
  },

  // ─── JOŠ SKRETNICA / MANEVRE ───────────────────────────
  {
    id: 'sk13', cat: 'skretnice',
    question: 'Što čini manevarski sastav?',
    answer: 'Vučno vozilo s međusobno zakvačenim vozilima ili bez njih.',
  },
  {
    id: 'sk14', cat: 'skretnice',
    question: 'Čime se daju signali kolodvorskog osoblja pri manevriranju?',
    answer: 'Crvenom signalnom zastavicom, signalnim loparićem, usnom zviždaljkom i signalnom svjetiljkom.',
  },
  {
    id: 'sk15', cat: 'skretnice',
    question: 'Signalni znak „lagano“ pri manevriranju (dan/noć)?',
    answer: 'Danju: crvena zastavica koso naniže + produženi zvižduk naizmjenično visok/dubok.\nNoću: bijela svjetiljka u visini grudi + isti zvižduk.',
  },
  {
    id: 'sk16', cat: 'skretnice',
    question: 'Signalni znak „STOJ“ pri manevriranju?',
    answer: 'Mahanje u krug crvenom zastavicom (noću bijelom svjetiljkom) + najmanje pet kratkih zvižduka.',
  },
  {
    id: 'sk17', cat: 'skretnice',
    question: 'Signalni znak „naprijed“ / „malo naprijed“ (osnovno)?',
    answer: 'Naprijed: mahanje zastavicom/svjetiljkom gore-dolje u duljim potezima + jedan dugačak zvižduk.\nMalo naprijed: kraći potezi + jedan kratak zvižduk.',
  },
  {
    id: 'sk18', cat: 'skretnice',
    question: 'Signalni znak „natrag“ / „malo natrag“?',
    answer: 'Natrag: mahanje lijevo-desno u duljim potezima + dva dugačka zvižduka.\nMalo natrag: kratki potezi + dva kratka zvižduka.',
  },
  {
    id: 'sk19', cat: 'skretnice',
    question: 'Signalni znak „odbačaj“?',
    answer: 'Danju: mahnuti razvijenom zastavicom i slobodnom rukom koso prema gore + jedan kratki i jedan dugački zvižduk.\nNoću: isto sa bijelom svjetiljkom.',
  },
  {
    id: 'sk20', cat: 'skretnice',
    question: 'Što radi rukovatelj manevre / skretničar / vlakovođa?',
    answer: 'Rukovatelj manevre: rukovodi radom jednog manevarskog odreda.\nSkretničar: rukuje skretnicama (izravno ili sa središnjeg mjesta) radi voznih puteva.\nVlakovođa: sudjeluje u radu vlaka na otvorenoj pruzi, u službenom mjestu i industrijskom kolosijeku.',
  },
  {
    id: 'sk21', cat: 'skretnice',
    question: 'Što radi kondukter?',
    answer: 'Obavlja prometne i prijevozne poslove kod vlaka za prijevoz putnika.',
  },

  // ─── JOŠ ISPRAVA ───────────────────────────────────────
  {
    id: 'i6', cat: 'isprave',
    question: 'Što znači SE-1?',
    answer: 'Nalog za vožnju vlaka.',
  },
  {
    id: 'i7', cat: 'isprave',
    question: 'Što je SE-4 i SE-5?',
    answer: 'SE-4 – Izvješće o primopredaji vlaka.\nSE-5 – Raspored manevriranja.',
  },
  {
    id: 'i8', cat: 'isprave',
    question: 'Što je knjižica voznog reda / grafikon?',
    answer: 'Vozni red: službena i javna uporaba – određuje vremena, stajanja, brzine.\nGrafikon voznog reda: grafički prikaz kretanja vlakova.\nMaterijali: prijelazna zapovijed, prometno-transportne upute, knjižica vlakopratnje…',
  },
  {
    id: 'i9', cat: 'isprave',
    question: 'Što je putni list / teretnica (općenito)?',
    answer: 'Popratne isprave vezane uz prijevoz: putni list prati putnički promet / sastav; teretnica prati teret. Uz njih idu SE isprave (sastav, kočenje, nalozi).',
  },

  // ─── JOŠ AGENCIJA / PROPIS ─────────────────────────────
  {
    id: 'a16', cat: 'agencija',
    question: 'Što je „Željeznička uprava“?',
    answer: 'Upravitelj infrastrukture koji je mjerodavan na željezničkoj mreži određene države.',
  },
  {
    id: 'a17', cat: 'agencija',
    question: 'Tko vrši nadzor osposobljenosti strojovođe i valjanost dozvole/potvrde?',
    answer: 'Agencija (ASZ).',
  },
  {
    id: 'a18', cat: 'agencija',
    question: 'Što ovlašćuje strojovođu dobivanjem dozvole?',
    answer: 'Za vožnju jedne ili više kategorija.',
  },
  {
    id: 'a19', cat: 'agencija',
    question: 'Razlika dozvola vs potvrda?',
    answer: 'Dozvolu izdaje ASZ (opća stručna osposobljenost, 10 godina).\nPotvrdu izdaje prijevoznik/UI – za konkretna vozila i infrastrukturu.\nOvlaštenje = dozvola + potvrda.',
  },
  {
    id: 'a20', cat: 'agencija',
    question: 'Što je „prigradski vlak“?',
    answer: 'Vlak za prijevoz putnika.',
  },
  {
    id: 'a21', cat: 'agencija',
    question: 'Što je osoblje vlaka / vlakopratno / osoblje vučnog vozila?',
    answer: 'Osoblje vlaka = vlakopratno + osoblje vučnog vozila.\nVlakopratno: vlakovođa, manevristi na vlaku, kondukteri.\nOsoblje vučnog vozila: strojovođa i pomoćnik strojovođe.',
  },
  {
    id: 'a22', cat: 'agencija',
    question: 'Što je osoblje pruge?',
    answer: 'Odjavničar i čuvar ŽCP-a / pješačkog prijelaza.',
  },
  {
    id: 'a23', cat: 'agencija',
    question: 'Što je vodeće vozilo?',
    answer: 'Prvo vozilo u smjeru kretanja vlaka iz kojeg se upravlja vožnjom i kočenjem vlaka.',
  },
  {
    id: 'a24', cat: 'agencija',
    question: 'Što je TK-dispečer?',
    answer: 'Radnik koji daljinski upravlja i regulira promet na pruzi opremljenoj odgovarajućim uređajima (daljinsko upravljanje).',
  },
  {
    id: 'a25', cat: 'agencija',
    question: 'Koji su preduvjeti za rad izvršnog radnika (ponovi jasno)?',
    answer: 'Stručno osposobljen i zdravstveno sposoban.',
  },

  // ─── JOŠ BROJKI ────────────────────────────────────────
  {
    id: 'b7', cat: 'brojke',
    question: 'Zabrtvljenost GV – putnički i teretni (ponovi)?',
    answer: 'Putnički: 0,3 bara / min.\nTeretni: 0,4 bara / min.',
  },
  {
    id: 'b8', cat: 'brojke',
    question: 'Budnik se uključuje pri kojoj brzini?',
    answer: 'Oko 6 km/h.',
  },
  {
    id: 'b9', cat: 'brojke',
    question: 'Dozvola – koliko godina? Smjena? Vožnja?',
    answer: 'Dozvola: 10 godina.\nSmjena: max 12 h.\nNeprekidna vožnja: 6 h (5 h putnički).',
  },
  {
    id: 'b10', cat: 'brojke',
    question: 'Stajanje na pruzi – nakon koliko minuta javljaš?',
    answer: '15 minuta.',
  },
  {
    id: 'b11', cat: 'brojke',
    question: 'ŽCP – vremenski prozor od uključne točke?',
    answer: '4 minute.',
  },
  {
    id: 'b12', cat: 'brojke',
    question: 'Lagana vožnja – max trajanje?',
    answer: '6 mjeseci.',
  },
  {
    id: 'b13', cat: 'brojke',
    question: 'Ulazni signal – min udaljenost ispred skretnice?',
    answer: 'Najmanje 100 m.',
  },
  {
    id: 'b14', cat: 'brojke',
    question: 'Zvonovni signal – koliko minuta prije polaska?',
    answer: '3 minute.',
  },
  {
    id: 'b15', cat: 'brojke',
    question: 'Napon kontaktnog voda u RH (izmjenični)?',
    answer: '25 kV, 50 Hz.',
  },
  {
    id: 'b16', cat: 'brojke',
    question: 'Istosmjerni sustav – koji napon (oznaka)?',
    answer: '3 kV – bijeli broj 3 na plavoj ploči.',
  },

  // ─── JOŠ VOZILA ────────────────────────────────────────
  {
    id: 'v11', cat: 'vozila',
    question: 'Što je radna / neradna lokomotiva; potiskivalica; međulokomotiva?',
    answer: 'Radna: vuče / gura u službi.\nNeradna: u sastavu ali ne vuče.\nPotiskivalica: potiskuje vlak (zakvačena ili nezakvačena).\nMeđulokomotiva: radna lokomotiva u sredini vlaka.',
  },
  {
    id: 'v12', cat: 'vozila',
    question: 'Mogu li se u putničke vlakove uvrštavati teretni vagoni?',
    answer: 'Mogu – osim vagona tovarenih opasnim tvarima.',
  },
  {
    id: 'v13', cat: 'vozila',
    question: 'Što je masa i duljina vlaka (osnovno)?',
    answer: 'Ukupna masa: zbroj masa vozila i tereta/putnika.\nDuljina: zbroj duljina vozila; uspoređuje se s korisnom duljinom kolosijeka.\nPodaci idu u SE-2.',
  },
  {
    id: 'v14', cat: 'vozila',
    question: 'Što je RIV / RIC / RID (ukratko)?',
    answer: 'Međunarodni propisi: RIV – teretni vagoni u međunarodnom prometu; RIC – putnički; RID – prijevoz opasnih tvari željeznicom.',
  },
  {
    id: 'v15', cat: 'vozila',
    question: 'Što je slobodni profil / profil vozila?',
    answer: 'Slobodni profil: prostor koji mora ostati slobodan uz / iznad kolosijeka.\nProfil vozila: gabarit vozila – mora stati u slobodni profil.',
  },
  {
    id: 'v16', cat: 'vozila',
    question: 'Gornji i donji ustroj pruge – što je?',
    answer: 'Gornji ustroj: tračnice, pragovi, pričvršćenje, zastor…\nDonji ustroj: nasip, usjeci, mostovi, propusti, odvodnja – „podloga“ pruge.',
  },
  {
    id: 'v17', cat: 'vozila',
    question: 'Što je okretnica / prijenosnica (ukratko)?',
    answer: 'Okretnica: uređaj za okretanje vozila / usmjeravanje na drugi kolosijek.\nPrijenosnica: premješta vozilo bočno s jednog kolosijeka na drugi.',
  },
  {
    id: 'v18', cat: 'vozila',
    question: 'Kako se označavaju vlakovi u RH?',
    answer: 'Arapskim brojevima, najviše 5 znamenki.',
  },

  // ─── JOŠ ZVUKA ─────────────────────────────────────────
  {
    id: 'z4', cat: 'zvuk',
    question: 'Signalni znak „opasnost koči“ (sirena)?',
    answer: 'Najmanje pet kratkih zvukova jedan za drugim.',
  },
  {
    id: 'z5', cat: 'zvuk',
    question: 'Čime se daju signalni znakovi osoblja vučnog vozila?',
    answer: 'Lokomotivskom sirenom.',
  },
  {
    id: 'z6', cat: 'zvuk',
    question: 'Tko daje zvonovne signalne znakove?',
    answer: 'Prometnik vlakova.',
  },
  {
    id: 'z7', cat: 'zvuk',
    question: 'Signalni znak „početak lagane vožnje“ – kako izgleda?',
    answer: 'Bijela brojka na crnoj četverokutnoj ploči (reflektirajuća).',
  },
  {
    id: 'z8', cat: 'zvuk',
    question: 'Još slučajevi za PAZI (proširi listu)?',
    answer: 'Uz osnovnih 5: ispred „Prilazni signal“, „Pazi ŽCP“, „Početak/završetak potiskivanja“, mimoilaženje u kolodvorima/stajalištima/blizini prijelaza, smanjena vidljivost (više puta)…',
  },

  // ─── JOŠ ŽCP ───────────────────────────────────────────
  {
    id: 'zc6', cat: 'zcp',
    question: 'Kako se kontrolira ispravnost automatskih uređaja na prijelazima?',
    answer: 'Kontrolnim svjetlosnim signalima i kontrolnim uređajima s daljinskom kontrolom.',
  },
  {
    id: 'zc7', cat: 'zcp',
    question: 'Signal „početak zaustavnog puta ispred ŽCP-a“ – kako izgleda i kad kočiš?',
    answer: 'Stup ili bijela ploča s crvenim vrhom.\nAko si pisanim nalogom obaviješten da je uređaj neispravan – tu počinješ kočiti da staneš ispred ŽCP-a.',
  },
  {
    id: 'zc8', cat: 'zcp',
    question: '„Uključna točka s daljinskom kontrolom“ – kako izgleda?',
    answer: 'Bijela ploča s jednim ili više crvenih rombova.\nBroj rombova = za koliko je prijelaza uključna točka zajednička.\nRok: 4 minute do prijelaza.',
  },
  {
    id: 'zc9', cat: 'zcp',
    question: 'Kad se strojovođa mora obavezno zaustaviti ispred ŽCP-a?',
    answer: 'Kad je uređaj u kvaru / neispravan ili kad kontrolni signal / pisani nalog to izričito nalaže.',
  },
  {
    id: 'zc10', cat: 'zcp',
    question: 'Signalni znak „uređaj na ŽCP-u ispravan“ – točan opis svjetala?',
    answer: 'Jedna bijela trepćuća (ili bijela mirna) i ispod nje jedna žuta mirna svjetlost.',
  },

  // ─── ELEKTROVUČA ───────────────────────────────────────
  {
    id: 'e1', cat: 'elektro',
    question: 'Gdje se rabe signali za elektrovuču?',
    answer: 'Na elektrificiranim prugama i u kolodvorima opremljenim stacioniranim uređajima za električno napajanje.',
  },
  {
    id: 'e2', cat: 'elektro',
    question: 'Što znači bijeli broj 3 na plavoj ploči / 25 kV oznaka?',
    answer: '3 = istosmjerni sustav 3 kV.\n25 kV, 50 Hz = izmjenični sustav (oznaka na plavoj ploči).',
  },
  {
    id: 'e3', cat: 'elektro',
    question: 'Signal „podigni oduzimač struje“?',
    answer: 'Bijela uspravna pruga preko sredine plave ploče.',
  },
  {
    id: 'e4', cat: 'elektro',
    question: 'Signal „uključi glavni prekidač"?',
    answer: 'Bijeli lik u obliku slova „U“ na plavoj ploči.',
  },
  {
    id: 'e5', cat: 'elektro',
    question: 'Signal „električni napon uključen“ – kako i gdje?',
    answer: 'Izlomljena bijela vodoravna strelica na plavoj ploči.\nPostavlja se u visini odbojnika na oba kraja vozila ili skupine vozila.',
  },
  {
    id: 'e6', cat: 'elektro',
    question: 'Nabroji grupe signala za elektrovuču.',
    answer: '• Priopćavanje (sustav napona)\n• Rukovanje oduzimačima struje (pripremi/spusti/podigni…)\n• Rukovanje glavnim prekidačima (pripremi/isključi/uključi)\n• Zaštita (STOJ za vozila s podignutim oduzimačem)\n• Upozorenje (napon uključen)',
  },
  {
    id: 'e7', cat: 'elektro',
    question: 'Što znače oznake izoliranog preklopa?',
    answer: 'Označavaju granicu kontaktne mreže u službenom mjestu i na otvorenoj pruzi.',
  },
  {
    id: 'e8', cat: 'elektro',
    question: 'Kako znaš gdje je najbliži telefon na elektrificiranoj pruzi?',
    answer: 'Na stupovima kontaktne mreže crnim strelicama označen je smjer prema najbližem telefonu.',
  },
  {
    id: 'e9', cat: 'elektro',
    question: 'Treba li u depou provjeriti ispravnost električnog grijanja?',
    answer: 'Da – obavezno prije izlaska na graničnik.',
  },
  {
    id: 'e10', cat: 'elektro',
    question: 'Primarni strujni krug elektrovuče (osnovno)?',
    answer: 'Elektrovučna podstanica → kontaktni vod → pantograf (oduzimač) → glavni prekidač → primar transformatora → četkica za uzemljenje → tračnica.',
  },
  {
    id: 'e11', cat: 'elektro',
    question: 'Signal „spusti oduzimač struje“ / „pripremi se za spuštanje" – načelo?',
    answer: 'Plave ploče s bijelim simbolima – naređuju pripremu i spuštanje pantografa prije kritičnog mjesta (npr. sekcija, radovi, preklop).',
  },
  {
    id: 'e12', cat: 'elektro',
    question: '„STOJ za vozila s podignutim oduzimačem struje" – što znači?',
    answer: 'Zabrana prolaska vozila koja imaju podignut pantograf (opasnost / nema mreže / zaštita).',
  },

  // ─── OSOBLJE ───────────────────────────────────────────
  {
    id: 'o1', cat: 'osoblje',
    question: 'Što radi prometnik vlakova?',
    answer: 'Regulira sigurno kretanje željezničkih vozila u kolodvoru i na međukolodvorskim odsjecima.',
  },
  {
    id: 'o2', cat: 'osoblje',
    question: 'Što radi odjavničar / čuvar prijelaza?',
    answer: 'Odjavničar: sudjeluje u reguliranju slijeđenja uzastopnih vlakova u odjavnom razmaku.\nČuvar prijelaza: sudjeluje u osiguranju prometa preko ŽCP-a / pješačkog prijelaza.',
  },
  {
    id: 'o3', cat: 'osoblje',
    question: 'Dužnosti osoblja vlaka vs osoblja pruge (općenito)?',
    answer: 'Osoblje vlaka: sigurna vožnja, kočenje, sporazumijevanje, prijevoz putnika/tereta, postupci kod kvara/nesreće.\nOsoblje pruge: regulacija razmaka, osiguranje prijelaza, obavješćivanje…',
  },
  {
    id: 'o4', cat: 'osoblje',
    question: 'Što strojovođa mora napraviti kad uoči neispravnost signala ili nepravilnost?',
    answer: 'Odmah obavijestiti prometnika vlakova u prvom kolodvoru odnosno TK dispečera.',
  },
  {
    id: 'o5', cat: 'osoblje',
    question: 'Što je sastajanje vlakova: križanje, pretjecanje, mimoilaženje, sustizanje?',
    answer: 'Križanje: susret na jednokolosiječnoj (razilaženje u kolodvoru).\nPretjecanje: brži prolazi sporijeg.\nMimoilaženje: prolazak jedan pored drugog.\nSustizanje: jedan stiže drugog (slijeđenje).',
  },
  {
    id: 'o6', cat: 'osoblje',
    question: 'Što je slijeđenje vlakova / prethodni i uzastopni?',
    answer: 'Slijeđenje: vožnja jednog vlaka za drugim u istom smjeru.\nPrethodni = onaj ispred; uzastopni = onaj koji slijedi.\nRazmak: kolodvorski, odjavni ili blokovni (APB).',
  },
  {
    id: 'o7', cat: 'osoblje',
    question: 'Čime se daju signali kod prijema i otpreme („na mjesta“, „priprema“, „polazak“)?',
    answer: 'Loparićem, ručnom signalnom svjetiljkom (zelena), usnom zviždaljkom; polazak i svjetlosnim signalom (kružnica zelenih žarulja).',
  },
  {
    id: 'o8', cat: 'osoblje',
    question: '„Na mjesta“ – kako izgleda?',
    answer: 'Danju: loparić pod pazuhom širom površinom prema čelu i kraju vlaka.\nNoću: zelena svjetiljka okrenuta prema kraju vlaka.',
  },
  {
    id: 'o9', cat: 'osoblje',
    question: '„Priprema za polazak" – kako?',
    answer: 'Loparić koso nadolje prema vlaku; noću zelena svjetiljka u visini grudi (+ jedan dugi zvižduk).',
  },
  {
    id: 'o10', cat: 'osoblje',
    question: '„Polazak" – kako?',
    answer: 'Loparić okomito iznad glave prema čelu; noću zelena svjetiljka iznad glave; ili kružnica zelenih žarulja na izlaznom signalu.',
  },

  // ─── SIGNALNE OZNAKE ───────────────────────────────────
  {
    id: 'oz1', cat: 'oznake',
    question: 'Što označava „mjesto zaustavljanja" (S)?',
    answer: 'Mjesto zaustavljanja čela putničkog vlaka; i mjesto graničnika gdje se zaustavlja VV pri ulasku/izlasku u depo.',
  },
  {
    id: 'oz2', cat: 'oznake',
    question: 'Što znači broj ispod slova „S" na oznaci mjesta zaustavljanja?',
    answer: 'Duljinu vlaka u metrima – ako je vlak kraći/ispod te duljine, zaustavlja se kod tog „S“-a.',
  },
  {
    id: 'oz3', cat: 'oznake',
    question: 'Što je predsignalna opomenica?',
    answer: 'Upozorava osoblje vučnog vozila na predsignal.\nBijeli trokut obrubljen crno = predsignal je na udaljenosti 5 % manjoj od zaustavnog puta.',
  },
  {
    id: 'oz4', cat: 'oznake',
    question: 'Signalna oznaka „zaštitni signal" – kako i čemu?',
    answer: 'Crna pravokutna ploča s bijelim slovom „Z".\nUpozorava na prostorni signal odjavnice koji je istodobno i zaštitni signal.',
  },
  {
    id: 'oz5', cat: 'oznake',
    question: 'Što označava oznaka nagiba pruge?',
    answer: 'Veličinu nagiba u promilima i duljinu u metrima.',
  },
  {
    id: 'oz6', cat: 'oznake',
    question: '„Očekuj glavni signal" / „Očekuj predsignal" – kako izgledaju?',
    answer: 'Očekuj glavni: bijele ploče s 3, 2 ili 1 crnom vodoravnom crtom (razmak 100 m; jedna crta na duljini zaustavnog puta).\nOčekuj predsignal: bijele ploče s 3/2/1 crnom kosom crtom; na 100, 200 i 300 m ispred predsignala.',
  },
  {
    id: 'oz7', cat: 'oznake',
    question: 'Označavanje mjesta predsignala – kako?',
    answer: 'Bijela pravokutna ploča s dva trokuta okrenuta vrhom jedan prema drugome.\nUgrađuje se na predsignal ili ispred njega (ne dalje od 2 m); i na glavni koji predsignalizira ulazni/zaštitni.',
  },
  {
    id: 'oz8', cat: 'oznake',
    question: 'Kad se osvjetljavaju signali noću?',
    answer: 'Prema kalendaru osvjetljavanja. Ako tehničko rješenje omogućuje – mogu se osvjetljavati cijeli dan.',
  },
  {
    id: 'oz9', cat: 'oznake',
    question: '„Uključna točka, očekuj kontrolni signal" – izgled?',
    answer: 'Crna ploča s četiri bijela romba.',
  },
  {
    id: 'oz10', cat: 'oznake',
    question: 'Desna/lijeva strana pruge vs kolosijeka?',
    answer: 'Strana pruge: desno/lijevo gledajući od početka prema kraju pruge.\nStrana kolosijeka: desno/lijevo gledajući u smjeru vožnje.',
  },
]

export const agencijaQuestions = [
  ...signalImageQuestions,
  ...pripremaSignaliQuestions,
  ...pripremaOstaloQuestions,
  ...agencijaManualQuestions,
]

export function getAgencijaByCat(catId) {
  if (!catId) return agencijaQuestions
  return agencijaQuestions.filter(q => q.cat === catId)
}

export function shuffleAgencija(items, seed = Date.now()) {
  const arr = items.slice()
  let a = seed | 0
  for (let i = arr.length - 1; i > 0; i--) {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    const j = Math.floor((((t ^ (t >>> 14)) >>> 0) / 4294967296) * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

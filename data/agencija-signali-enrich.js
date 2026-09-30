/**
 * Obogaćeni odgovori za signale iz signalnog pravilnika.
 * Ključ = točan naziv ili početak naziva (case-insensitive match).
 */
export const SIGNAL_MEANINGS = {
  'Stoj': {
    meaning: 'Vožnja od ovog signala je ZABRANJENA.',
    action: 'Zaustavi vlak ispred signala. Ne prolazi bez dozvole (usmena obavijest + znak „naprijed“, ili pisani nalog / RDU prema propisu).',
  },
  'Slobodno': {
    meaning: 'Vožnja od ovog signala je SLOBODNA (jednoznačni znak).',
    action: 'Nastavi vožnju najvećom dopuštenom brzinom (ako signal štiti skretnice u ovisnosti – najvećom dopuštenom; inače slobodno). Gledaj i sljedeće signale / prugu.',
  },
  'Slobodno, očekuj Slobodno ili Oprezno': {
    meaning: 'Dvoznačni znak: vožnja od signala je slobodna I sljedeći glavni signal pokazuje Slobodno ili Oprezno, očekuj Stoj – brzinu do sljedećeg glavnog ne moraš smanjivati.',
    action: 'Vozi slobodno, ali budi spreman na sljedeći signal. Ako prelaziš na prugu bez APB-a, izlazni/zaštitni možda ne predsignalizira sljedeći.',
  },
  'Oprezno, očekuj Stoj': {
    meaning: 'Vožnja od ovog signala je još slobodna, ali sljedeći glavni signal pokazuje STOJ.',
    action: 'Smanji brzinu na vrijeme i zaustavi se ispred sljedećeg glavnog signala.',
  },
  'Slobodno, očekuj ograničenje brzine': {
    meaning: 'Vožnja od signala je slobodna; sljedeći glavni signal očekuje ograničenje brzine.',
    action: 'Pripremi se za smanjenje brzine na sljedećem glavnom signalu / skretničkom području.',
  },
  'Ograničena brzina, očekuj Stoj': {
    meaning: 'Vozi ograničenom brzinom; sljedeći glavni signal pokazuje STOJ.',
    action: 'Prilagodi brzinu ograničenju odmah i zaustavi se ispred sljedećeg glavnog signala.',
  },
  'Ograničena brzina, očekuj Slobodno ili Oprezno': {
    meaning: 'Vozi ograničenom brzinom; sljedeći glavni je Slobodno ili Oprezno.',
    action: 'Drži ograničenu brzinu do kraja ograničenja / sljedećeg signala, pa postupaj prema njemu.',
  },
  'Ograničena brzina, očekuj ograničenje brzine': {
    meaning: 'Vozi ograničenom brzinom; i sljedeći glavni očekuje (daljnje) ograničenje brzine.',
    action: 'Drži ograničenje i pripremi se na nastavak / novo ograničenje na sljedećem signalu.',
  },
  'Oprezna vožnja brzinom do 20 km/h': {
    meaning: 'Smiješ nastaviti, ali samo opreznom vožnjom do 20 km/h.',
    action: 'Smanji na max 20 km/h, vozi s posebnom pozornošću dok ne dobiješ jasan slobodan signal / uvjet.',
  },
  'Ograničena brzina': {
    meaning: 'Vožnja od signala je dopuštena samo ograničenom brzinom (preko skretnica / prema konstrukciji).',
    action: 'Prilagodi brzinu ograničenju (gledaj i pokazivač brzine ako ga ima).',
  },
  'Ograničenje brzine': {
    meaning: 'Likovni znak: vožnja ograničenom brzinom (u ovisnosti sa skretnicama).',
    action: 'Vozi ograničenom brzinom preko skretničkog područja.',
  },
  'Očekuj Stoj': {
    meaning: 'Predsignal: na glavnom signalu ispred tebe očekuj STOJ.',
    action: 'Odmah pripremi kočenje da se možeš zaustaviti ispred glavnog signala. Kod kvara predsignala – postupaš isto kao Očekuj Stoj.',
  },
  'Očekuj Slobodno': {
    meaning: 'Predsignal: na glavnom signalu ispred tebe očekuj Slobodno.',
    action: 'Možeš očekivati slobodnu vožnju, ali ipak potvrdi glavni signal kad ga vidiš.',
  },
  'Očekuj ograničenje brzine': {
    meaning: 'Predsignal / ploča: očekuj ograničenje brzine na glavnom ili na početku ograničenja.',
    action: 'Pripremi smanjenje brzine. Ako je ploča s brojevima – gornji/donji broj označavaju brzine (donji često za nagibnu tehniku).',
  },
  'Glavni signal signalizira Stoj': {
    meaning: 'Ponavljač predsignaliziranja: glavni signal ispred pokazuje STOJ.',
    action: 'Pripremi zaustavljanje ispred glavnog. Kod kvara ponavljača – postupaš kao da glavni pokazuje STOJ (ne moraš stati kod samog ponavljača).',
  },
  'Glavni signal signalizira Slobodno': {
    meaning: 'Ponavljač: glavni signal ispred pokazuje Slobodno.',
    action: 'Očekuj slobodno na glavnom, potvrdi kad ga vidiš.',
  },
  'Glavni signal signalizira ograničenje brzine': {
    meaning: 'Ponavljač: glavni signal ispred pokazuje ograničenje brzine.',
    action: 'Pripremi smanjenje brzine do glavnog signala.',
  },
  'Vožnja zabranjena': {
    meaning: 'Granični kolosiječni: vožnja dalje je zabranjena.',
    action: 'Stani. Kod neispravnosti graničnog – postupaš kao da je zabranjena.',
  },
  'Vožnja dopuštena': {
    meaning: 'Granični kolosiječni: vožnja dalje je dopuštena.',
    action: 'Smiješ krenuti / nastaviti. Ako su dvije nezakvačene lokomotive – vrijedi samo za prvu; druga čeka novi ciklus.',
  },
  'Manevriranje zabranjeno': {
    meaning: 'Manevarska vožnja od ovog signala je zabranjena.',
    action: 'Ne nastavljaj manevru. Kod kvara – smatraj zabranjenim.',
  },
  'Manevriranje slobodno': {
    meaning: 'Manevarska vožnja od ovog signala je dopuštena.',
    action: 'Smiješ manevrirati, ALI samo ako glavni signal pokazuje STOJ (inače bi ušao u vozni put vlaka).',
  },
  'Granica manevarskih vožnji': {
    meaning: 'Granica do koje smiješ manevrirati u kolodvoru.',
    action: 'Ne idi na otvorenu prugu bez pisanog naloga prometnika.',
  },
  'Vožnja u pravac uz jezičak ili niz jezičak': {
    meaning: 'Skretnica je postavljena za vožnju u pravac.',
    action: 'Vozi u pravac; prilagodi brzinu propisu za skretnicu.',
  },
  'Vožnja u skretanje': {
    meaning: 'Skretnica je postavljena za vožnju u skretanje (uz ili niz jezičak – ovisno o znaku).',
    action: 'Vozi u skretanje; uz jezičak = strelica, niz jezičak = vodoravni pravokutnik. Pazi na brzinu.',
  },
  'Početak ograničene brzine': {
    meaning: 'Od ovog mjesta vrijedi ograničena brzina.',
    action: 'Do čela vlaka na ovom znaku moraš već imati propisanu ograničenu brzinu.',
  },
  'Kraj ograničene brzine': {
    meaning: 'Kraj područja ograničene brzine.',
    action: 'Tek kad cijeli vlak prođe ovaj znak smiješ ubrzati (ako drugi uvjeti dopuštaju).',
  },
  'Uređaj na željezničko-cestovnom prijelazu ispravan': {
    meaning: 'Automatski uređaj na ŽCP-u radi ispravno.',
    action: 'Možeš nastaviti (uz uobičajenu pozornost na prijelazu).',
  },
  'Uređaj na željezničko-cestovnom prijelazu neispravan': {
    meaning: 'Uređaj na ŽCP-u NIJE ispravan.',
    action: 'Postupaj oprezno / prema nalogu: često kočiš da staneš ispred prijelaza, osiguraj prijelaz očima, javi ako treba.',
  },
  'Uključna točka, očekuj kontrolni signal': {
    meaning: 'Odavde gledaš kontrolni signal ŽCP-a.',
    action: 'Obrati pozornost na kontrolni svjetlosni signal (ispravan / neispravan).',
  },
  'Uključna točka s daljinskom kontrolom': {
    meaning: 'Uključna točka za jedan ili više prijelaza (broj rombova = broj prijelaza).',
    action: 'Od prolaska točke do prijelaza imaš 4 minute; kasniš → prijelaz se smatra neosiguranim.',
  },
  'Početak zaustavnog puta ispred željezničko-cestovnog prijelaza': {
    meaning: 'Početak zaustavnog puta ispred ŽCP-a.',
    action: 'Ako si pisanim nalogom obaviješten da je uređaj neispravan – ovdje počinješ kočiti da staneš ispred ŽCP-a.',
  },
  'Pazi, željezničko – cestovni prijelaz': {
    meaning: 'Opomenica: približavaš se (neosiguranom) ŽCP-u.',
    answerExtra: 'Ugrađuje se ispred neosiguranih ŽCP-a, na polovici zaustavnog puta.',
    action: 'Daj znak PAZI (jedan dugačak) i vozi s povećanom pozornošću.',
  },
  'Istosmjerni sustav 3 kV': {
    meaning: 'Kontaktna mreža: istosmjerni napon 3 kV.',
    action: 'Provjeri da je tvoje VV pogodno / postavke odgovaraju sustavu.',
  },
  'Izmjenični sustav 25 kV, 50 Hz': {
    meaning: 'Kontaktna mreža: izmjenični napon 25 kV, 50 Hz (standard u RH).',
    action: 'Provjeri da je tvoje VV pogodno za 25 kV / 50 Hz.',
  },
  'Pripremi se za spuštanje oduzimača struje': {
    meaning: 'Uskoro trebaš spustiti pantograf (oduzimač).',
    action: 'Pripremi se: slijedi signal „Spusti oduzimač“.',
  },
  'Spusti oduzimač struje': {
    meaning: 'Moraš spustiti oduzimač struje.',
    action: 'Spusti pantograf prije kritičnog mjesta (sekcija, radovi, preklop…).',
  },
  'Dopuštena vožnja s jednim podignutim oduzimačem struje': {
    meaning: 'Smiješ voziti samo s jednim podignutim pantografom.',
    action: 'Ostavi samo jedan oduzimač gore.',
  },
  'Podigni oduzimač struje': {
    meaning: 'Smiješ / trebaš ponovno podići oduzimač.',
    action: 'Podigni pantograf kad je sigurno (iza problematičnog mjesta).',
  },
  'Pripremi se za isključenje glavnog prekidača': {
    meaning: 'Uskoro isključi glavni prekidač.',
    action: 'Pripremi isključenje GP.',
  },
  'Isključi glavni prekidač': {
    meaning: 'Isključi glavni prekidač.',
    action: 'Isključi GP prema postupku za tu seriju / mjesto.',
  },
  'Uključi glavni prekidač': {
    meaning: 'Uključi glavni prekidač.',
    action: 'Uključi GP kad je dopušteno.',
  },
  'Stoj za vozila s podignutim oduzimačem struje': {
    meaning: 'Zabrana za vozila koja imaju podignut pantograf.',
    action: 'Stani (ili spusti oduzimač prije) – ne ulazi s pantografom gore.',
  },
  'Stoj za vozila s podignutim oduzimačem struje za vožnju u pravac': {
    meaning: 'STOJ za vozila s podignutim oduzimačem – za vožnju u pravac.',
    action: 'Ne nastavljaj u pravac s pantografom gore.',
  },
  'Stoj za vozila s podignutim oduzimačem struje za vožnju u desno ili u lijevo': {
    meaning: 'STOJ za vozila s podignutim oduzimačem – za skretanje lijevo/desno.',
    action: 'Ne skreći s pantografom gore u zabranjenom smjeru.',
  },
  'Električni napon uključen': {
    meaning: 'Upozorenje: na vozilu / skupini je uključen električni napon.',
    action: 'Pazi na sigurnost oko vozila; postavlja se u visini odbojnika na krajevima.',
  },
  'Signal za čelo vlaka': {
    meaning: 'Propisno označeno čelo vlaka (tri bijele svjetlosti u trokutu).',
    action: 'Čelo mora biti propisno označeno. Kod kvara – brzina prema propisu (npr. noću sva ugašena → 20 km/h do sljedećeg).',
  },
  'Signalni znak za kraj teretnog vlaka': {
    meaning: 'Označava kraj teretnog vlaka.',
    action: 'Provjeri da su završni znakovi / pločice na mjestu.',
  },
  'Signalni znak za kraj putničkog vlaka': {
    meaning: 'Označava kraj putničkog vlaka (dvije crvene svjetlosti).',
    action: 'Provjeri da je kraj propisno označen.',
  },
  'Na mjesta': {
    meaning: 'Poziv osoblju: na mjesta (prije polaska).',
    action: 'Osoblje zauzima mjesta; ti čekaš daljnje znakove (priprema / polazak).',
  },
  'Priprema za polazak': {
    meaning: 'Priprema za polazak vlaka.',
    action: 'Budi spreman; čekaj znak „Polazak“. Uz znak ide i dugi zvižduk.',
  },
  'Polazak': {
    meaning: 'Nalog za polazak vlaka.',
    action: 'Tek sada smiješ krenuti (putnički – nakon ulaska/izlaska putnika). Ako nisi siguran – NE kreći.',
  },
  'Prolazak slobodan': {
    meaning: 'Vlak smije proći kolodvor bez stajanja (iznimni prolazak).',
    action: 'Nastavi vožnju kroz kolodvor prema znaku prometnika.',
  },
  'Lagano': {
    meaning: 'Smanji brzinu / vozi lagano (maneura ili pruga).',
    action: 'Odmah smanji brzinu. Kod pruge: znak „početak lagane vožnje“ = bijeli broj na crnoj ploči.',
  },
  'Naprijed': {
    meaning: 'Maneura / dozvola: naprijed.',
    action: 'Kreni naprijed pažljivo (dulji potezi + dugačak zvižduk = naprijed; kraći = malo naprijed).',
  },
  'Natrag': {
    meaning: 'Maneura: natrag.',
    action: 'Kreni natrag pažljivo (dva dugačka = natrag; dva kratka = malo natrag).',
  },
  'Odbačaj': {
    meaning: 'Nalog za odbačaj vagona pri manevriranju.',
    action: 'Izvedi odbačaj samo ako je dopušten (ne s putnicima!).',
  },
  'Zakoči': {
    meaning: 'Znak za probu kočenja: zakoči.',
    action: 'Zavedi kočenje za probu (prema postupku probe).',
  },
  'Otkoči': {
    meaning: 'Znak za probu kočenja: otkoči.',
    action: 'Otkoči; često zatim ručica u brzo kočenje da pokreneš brzače / trome rasporednike.',
  },
  'Početak lagane vožnje': {
    meaning: 'Početak područja lagane (smanjene) vožnje; broj = brzina.',
    action: 'Do ovog znaka smanji na označenu brzinu; traje do kraja / opoziva (max 6 mjeseci).',
  },
  'Opozivni signal': {
    meaning: 'Opoziv prethodnog naloga / znaka (zeleni lopar).',
    action: 'Prethodni znak (npr. lagana vožnja / STOJ osoblja) više ne vrijedi – nastavi prema novim uvjetima.',
  },
  'Stoj, odron na pruzi': {
    meaning: 'HITNO STOJ – odron / opasnost na pruzi (crveno trepćuće).',
    action: 'Odmah zaustavi vlak. Javi prometniku / TK.',
  },
  'Mjesto zaustavljanja': {
    meaning: 'Mjesto gdje se zaustavlja čelo putničkog vlaka (slovo S); i graničnik za depo.',
    action: 'Zaustavi čelo kod „S“. Broj ispod S = duljina vlaka u m – kraći vlak staje kod tog S.',
  },
  'Približavanje stajalištu': {
    meaning: 'Upozorenje: približavaš se stajalištu / mjestu zaustavljanja.',
    action: 'Pripremi kočenje; ugrađuje se na duljini zaustavnog puta ispred mjesta zaustavljanja.',
  },
  'Označavanje mjesta predsignala': {
    meaning: 'Označava mjesto predsignala.',
    action: 'Očekuj predsignal; ako vidiš bijeli trokut crno obrubljen – predsignal je 5 % bliže od zaustavnog puta.',
  },
  'Očekuj glavni signal': {
    meaning: 'Objavnica: bližiš se glavnom signalu (bez predsignala).',
    action: 'Pripremi se na glavni; ploče s 3/2/1 crtom na razmaku 100 m; jedna crta = na duljini zaustavnog puta.',
  },
  'Očekuj predsignal': {
    meaning: 'Objavnica: bližiš se predsignalu.',
    action: 'Očekuj predsignal (100 / 200 / 300 m).',
  },
  'Zaštitni signal': {
    meaning: 'Oznaka „Z“: prostor ni signal odjavnice je ujedno i zaštitni.',
    action: 'Obrati pozornost – taj prostorni vrijedi i kao zaštitni.',
  },
  'Mjesto rada na pruzi': {
    meaning: 'Ispred su radovi na pruzi.',
    action: 'Daj PAZI; vozi oprezno. Postavlja se najmanje 500 m ispred početka radova.',
  },
  'Nagib pruge': {
    meaning: 'Pokazuje uspon / pad / horizontalu.',
    action: 'Prilagodi vuču/kočenje: crveni broj = promili, crni = duljina u m.',
  },
  'Kilometarska i hektometarska oznaka': {
    meaning: 'Označava položaj na pruzi (km / hm).',
    action: 'Koristi za orijentaciju i javljanje mjesta. Parni s desne, neparni s lijeve strane pruge.',
  },
  'Signal ne vrijedi': {
    meaning: 'Ovaj signal NIJE u uporabi (bijeli kosi križ).',
    action: 'Ignoriraj taj signal; vozi prema važećim signalima / nalogu.',
  },
  'Pomoćni kontrolni signal': {
    meaning: 'Stariji / pomoćni kontrolni signal ŽCP-a (više se ne ugrađuje novo).',
    action: 'Ako ga još vidiš – tumači prema lokalnom propisu / kao kontrolu ŽCP-a; znaj da je stari tip.',
  },
  'Prilazni signal': {
    meaning: 'Upozorava da se približavaš kolodvoru bez ulaznog/zaštitnog signala.',
    action: 'Daj PAZI; pripremi se na ulazak / stajanje prema mjesnim prilikama.',
  },
}

export function enrichSignal(name, description = '', imgNotes = []) {
  const lower = (name || '').toLowerCase()
  const key = Object.keys(SIGNAL_MEANINGS)
    .filter((k) => lower === k.toLowerCase() || lower.startsWith(k.toLowerCase()))
    .sort((a, b) => b.length - a.length)[0]
  const info = key ? SIGNAL_MEANINGS[key] : null

  const lookParts = []
  if (description?.trim()) lookParts.push(description.trim())
  if (imgNotes?.length) lookParts.push(imgNotes.join('\n'))

  const lines = [
    `📛 Naziv: „${name}"`,
    '',
    lookParts.length ? `👁 Kako izgleda:\n${lookParts.join('\n')}` : null,
    info?.meaning ? `\n💡 Što znači:\n${info.meaning}` : `\n💡 Što znači:\nSignalni znak „${name}" – zapamti naziv i izgled; postupaš prema tom nalogu / upozorenju.`,
    info?.answerExtra ? `\n${info.answerExtra}` : null,
    info?.action ? `\n🚂 Što radiš:\n${info.action}` : `\n🚂 Što radiš:\nPročitaj znak, primijeni ga odmah, a ako je nejasan – uzmi strože značenje i javi prometniku / TK.`,
  ].filter(Boolean)

  return lines.join('\n').replace(/\n{3,}/g, '\n\n')
}

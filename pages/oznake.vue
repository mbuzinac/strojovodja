<script setup>
useHead({ title: 'Oznake vučnih vozila – Strojovođa' })

const positions = [
  { pos: '1.', meaning: 'broj 9 – oznaka da je riječ o vučnom vozilu' },
  { pos: '2.', meaning: 'kontrolna znamenka – izračunava se iz preostalih 11 znamenaka' },
  { pos: '3.–4.', meaning: 'oznaka željezničke uprave (vlasnika) – svaka članica UIC-a ima svoj broj (HŽ = 78)' },
  { pos: '5.', meaning: 'vrsta vučnog vozila' },
  { pos: '6.', meaning: 'detaljnija podjela unutar vrste' },
  { pos: '7.', meaning: 'za lokomotive: broj pogonskih osovina; za motorne vlakove: vrsta vuče' },
  { pos: '8.', meaning: 'redni broj serije' },
  { pos: '9.–11.', meaning: 'individualni broj vozila u seriji' },
  { pos: '12.', meaning: 'kontrolna znamenka – izračunava se iz znamenki od 5. do 11. mjesta, odvojena crticom' },
]

const vehicleTypes = [
  { d: '0', t: 'parna' },
  { d: '1', t: 'električna' },
  { d: '2', t: 'diesel' },
  { d: '3', t: 'rezervirano' },
  { d: '4, 5', t: 'prikolica motornog vlaka' },
  { d: '6', t: 'elektromotorni vlak' },
  { d: '7', t: 'dieselmotorni vlak' },
  { d: '8', t: 'rezervirano' },
  { d: '9', t: 'vozilo za željezničke svrhe' },
]

const electricSub = [
  { d: '0', t: 'istosmjerna struja' },
  { d: '1', t: 'jednofazna struja' },
  { d: '2', t: 'višesustavno vučno vozilo' },
]

const dieselSub = [
  { d: '0', t: 'električni prijenos' },
  { d: '1', t: 'hidraulični prijenos' },
  { d: '2', t: 'mehanički prijenos' },
]

const example = [
  { digits: '9', meaning: 'vučno vozilo', color: 'cyan' },
  { digits: '8', meaning: 'kontrolna znamenka', color: 'slate' },
  { digits: '78', meaning: 'HŽ – vlasnik', color: 'emerald' },
  { digits: '2', meaning: 'diesel – vrsta vuče', color: 'amber' },
  { digits: '0', meaning: 'električni prijenos', color: 'violet' },
  { digits: '6', meaning: 'šest pogonskih osovina', color: 'sky' },
  { digits: '1', meaning: 'prva serija', color: 'rose' },
  { digits: '008', meaning: 'osma lokomotiva u seriji', color: 'teal' },
  { digits: '5', meaning: 'kontrolna znamenka', color: 'slate' },
]

const colorMap = {
  cyan: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40',
  emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
  amber: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
  violet: 'bg-violet-500/15 text-violet-300 border-violet-500/40',
  sky: 'bg-sky-500/15 text-sky-300 border-sky-500/40',
  rose: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
  teal: 'bg-teal-500/15 text-teal-300 border-teal-500/40',
  slate: 'bg-slate-700/40 text-slate-300 border-slate-600',
}
</script>

<template>
  <div class="min-h-screen bg-neutral-950 pb-20">
    <header class="sticky top-0 z-30 bg-neutral-950/95 backdrop-blur-md border-b border-slate-800">
      <div class="max-w-3xl mx-auto px-4 py-4">
        <div class="flex items-center gap-3">
          <NuxtLink
            to="/"
            class="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Natrag"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </NuxtLink>
          <div class="min-w-0">
            <h1 class="text-lg font-bold text-white flex items-center gap-2">
              <span>🔢</span> Oznake vučnih vozila
            </h1>
            <p class="text-xs text-slate-500">12-znamenkasta UIC oznaka</p>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-3xl mx-auto px-4 py-6 space-y-8">
      <p class="text-sm text-slate-300 leading-relaxed">
        Svaka znamenka 12-znamenkaste UIC oznake vučnog vozila ima točno određeno značenje na svom mjestu.
      </p>

      <!-- INTERAKTIVNI PRIMJER -->
      <section class="card-dark p-5">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Primjer</h2>
        <p class="font-mono text-xl font-bold text-white tracking-wider mb-4">98 78 2 061 008-5</p>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="(seg, i) in example"
            :key="i"
            class="flex flex-col items-center rounded-lg border px-2.5 py-1.5 min-w-[2.5rem]"
            :class="colorMap[seg.color]"
          >
            <span class="font-mono text-lg font-bold leading-none">{{ seg.digits }}</span>
            <span class="text-[9px] leading-tight text-center mt-1 opacity-90 max-w-[88px]">{{ seg.meaning }}</span>
          </div>
        </div>
      </section>

      <!-- RASPORED ZNAMENKI -->
      <section>
        <h2 class="text-base font-bold text-white mb-3">Raspored znamenki</h2>
        <div class="card-dark divide-y divide-slate-800">
          <div
            v-for="(p, i) in positions"
            :key="i"
            class="flex gap-3 px-4 py-3"
          >
            <span class="font-mono text-sm font-bold text-cyan-400 shrink-0 w-12">{{ p.pos }}</span>
            <span class="text-sm text-slate-300 leading-relaxed">{{ p.meaning }}</span>
          </div>
        </div>
      </section>

      <!-- 5. MJESTO -->
      <section>
        <h2 class="text-base font-bold text-white mb-1">5. mjesto – vrsta vučnog vozila</h2>
        <div class="card-dark p-2 mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1">
          <div
            v-for="(v, i) in vehicleTypes"
            :key="i"
            class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/40"
          >
            <span class="font-mono text-sm font-bold text-cyan-400 shrink-0 w-10">{{ v.d }}</span>
            <span class="text-sm text-slate-300">{{ v.t }}</span>
          </div>
        </div>
      </section>

      <!-- 6. MJESTO -->
      <section>
        <h2 class="text-base font-bold text-white mb-3">6. mjesto – detaljnija podjela</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="card-dark p-4">
            <h3 class="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3">
              Električna vozila <span class="text-slate-500 normal-case font-normal">(vrsta napajanja)</span>
            </h3>
            <div class="space-y-1">
              <div v-for="(e, i) in electricSub" :key="i" class="flex items-center gap-3 px-1 py-1.5">
                <span class="font-mono text-sm font-bold text-cyan-400 shrink-0 w-6">{{ e.d }}</span>
                <span class="text-sm text-slate-300">{{ e.t }}</span>
              </div>
            </div>
          </div>
          <div class="card-dark p-4">
            <h3 class="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
              Dieselska vozila <span class="text-slate-500 normal-case font-normal">(vrsta prijenosa)</span>
            </h3>
            <div class="space-y-1">
              <div v-for="(d, i) in dieselSub" :key="i" class="flex items-center gap-3 px-1 py-1.5">
                <span class="font-mono text-sm font-bold text-cyan-400 shrink-0 w-6">{{ d.d }}</span>
                <span class="text-sm text-slate-300">{{ d.t }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- KONTROLNA ZNAMENKA -->
      <section>
        <h2 class="text-base font-bold text-white mb-3">Izračun kontrolne znamenke</h2>
        <div class="rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-4">
          <p class="text-sm text-cyan-100/90 leading-relaxed">
            Znamenke se ispišu u jednom redu, a ispod njih se naizmjenično ispisuju brojevi
            <span class="font-mono font-bold">2</span> i <span class="font-mono font-bold">1</span>
            (svaka znamenka × 2 ili × 1, alternirajuće). Umnošci se zbroje, zbroj se usporedi s
            prvom većom deseticom, a razlika je kontrolna znamenka.
          </p>
        </div>
      </section>
    </main>
  </div>
</template>

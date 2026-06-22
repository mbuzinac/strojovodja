<script setup>
import {
  pripremaSections,
  pripremaItems,
  searchPriprema,
  normalizePriprema,
} from '~/data/priprema-ispit.js'

useHead({ title: 'Priprema za ispit – Strojovođa' })

const query = ref('')
const activeSection = ref('')
const revealAll = ref(false)
const shuffleSeed = ref(0)

const isSearching = computed(() => normalizePriprema(query.value.trim()).length >= 2)
const results = computed(() => searchPriprema(query.value, activeSection.value || null))

function mulberry32(a) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffled(items, salt) {
  const rng = mulberry32(shuffleSeed.value + salt)
  const arr = items.slice()
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function maybeShuffle(items, salt) {
  return shuffleSeed.value ? shuffled(items, salt) : items
}

const visibleSections = computed(() => {
  if (isSearching.value) {
    const map = new Map()
    for (const it of results.value) {
      if (!map.has(it.sectionId)) {
        const meta = pripremaSections.find(s => s.id === it.sectionId)
        map.set(it.sectionId, { ...meta, items: [] })
      }
      map.get(it.sectionId).items.push(it)
    }
    return [...map.values()]
  }
  const base = activeSection.value
    ? pripremaSections.filter(s => s.id === activeSection.value)
    : pripremaSections
  return base.map((s, idx) => ({ ...s, items: maybeShuffle(s.items, idx + 1) }))
})

function reshuffle() {
  shuffleSeed.value = Math.floor(Math.random() * 1e9) + 1
  if (process.client) window.scrollTo({ top: 0, behavior: 'smooth' })
}

function resetOrder() {
  shuffleSeed.value = 0
}

function selectSection(id) {
  activeSection.value = id
  if (process.client) window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="min-h-screen bg-neutral-950 pb-20">
    <header class="sticky top-0 z-30 bg-neutral-950/95 backdrop-blur-md border-b border-slate-800">
      <div class="max-w-3xl mx-auto px-4 py-4">
        <div class="flex items-center gap-3 mb-4">
          <NuxtLink
            to="/"
            class="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Natrag"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </NuxtLink>
          <div class="min-w-0 flex-1">
            <h1 class="text-lg font-bold text-white flex items-center gap-2">
              <span>📝</span> Priprema za ispit
            </h1>
            <p class="text-xs text-slate-500">{{ pripremaItems.length }} pitanja s odgovorima</p>
          </div>
          <div class="shrink-0 flex items-center gap-2">
            <button
              type="button"
              class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
              :class="shuffleSeed
                ? 'bg-violet-500/15 text-violet-300 border-violet-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'"
              :title="shuffleSeed ? 'Ponovno izmiksaj' : 'Izmiksaj redoslijed'"
              @click="reshuffle"
            >
              🔀 Izmiksaj
            </button>
            <button
              v-if="shuffleSeed"
              type="button"
              class="px-3 py-1.5 rounded-lg text-xs font-medium border bg-slate-900 text-slate-400 border-slate-700 hover:text-white transition-colors"
              @click="resetOrder"
            >
              Po redu
            </button>
            <button
              type="button"
              class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
              :class="revealAll
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'"
              @click="revealAll = !revealAll"
            >
              {{ revealAll ? 'Sakrij odgovore' : 'Prikaži sve' }}
            </button>
          </div>
        </div>

        <div class="relative mb-3">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="query"
            type="search"
            placeholder="Pretraži pitanje ili odgovor…"
            class="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none text-sm"
          />
        </div>

        <div class="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
          <button
            class="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
            :class="activeSection === ''
              ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40'
              : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'"
            @click="selectSection('')"
          >
            Sve
          </button>
          <button
            v-for="s in pripremaSections"
            :key="s.id"
            class="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-1.5"
            :class="activeSection === s.id
              ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40'
              : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'"
            @click="selectSection(s.id)"
          >
            <span>{{ s.icon }}</span>
            <span>{{ s.title }}</span>
            <span class="text-[10px] opacity-60">{{ s.count }}</span>
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-3xl mx-auto px-4 py-6">
      <p v-if="isSearching" class="text-xs text-slate-500 mb-5">{{ results.length }} rezultata za „{{ query.trim() }}"</p>

      <div v-if="isSearching && !results.length" class="text-center text-slate-500 py-16">
        Nema rezultata. Pokušaj s drugim pojmom.
      </div>

      <section v-for="sec in visibleSections" :key="sec.id" class="mb-9">
        <div class="flex items-center gap-2.5 mb-4">
          <span class="text-2xl">{{ sec.icon }}</span>
          <div>
            <h2 class="text-base font-bold text-white">{{ sec.title }}</h2>
            <p class="text-[11px] text-slate-500">{{ sec.items.length }} pitanja</p>
          </div>
        </div>
        <div class="space-y-3">
          <PripremaItem
            v-for="(item, i) in sec.items"
            :key="`${item.dio}-${item.num}-${i}`"
            :item="item"
            :reveal-all="revealAll"
          />
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.scrollbar-none {
  scrollbar-width: none;
}
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
</style>

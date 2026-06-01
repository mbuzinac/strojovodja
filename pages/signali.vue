<script setup>
import { getAllSignals, normalizeSearch, railwayData } from '~/data/database.js'

useHead({ title: 'Svi signali – Strojovođa' })

const query = ref('')
const categoryFilter = ref('')

const allSignals = getAllSignals()

const categories = computed(() => [
  { id: '', title: 'Sve kategorije' },
  ...railwayData.map(c => ({ id: c.id, title: c.title, icon: c.icon })),
])

const filtered = computed(() => {
  let list = allSignals
  if (categoryFilter.value) {
    list = list.filter(s => s.categoryId === categoryFilter.value)
  }
  const q = normalizeSearch(query.value.trim())
  if (q.length >= 2) {
    list = list.filter(s => normalizeSearch(`${s.name} ${s.description}`).includes(q))
  }
  return list
})
</script>

<template>
  <div class="min-h-screen bg-neutral-950 pb-20">
    <header class="sticky top-0 z-30 bg-neutral-950/95 backdrop-blur-md border-b border-slate-800">
      <div class="max-w-4xl mx-auto px-4 py-4">
        <div class="flex items-center gap-3 mb-4">
          <NuxtLink to="/" class="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors" aria-label="Natrag">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </NuxtLink>
          <div>
            <h1 class="text-lg font-bold text-white">Svi signali</h1>
            <p class="text-xs text-slate-500">{{ allSignals.length }} signala iz cijele skripte</p>
          </div>
        </div>

        <div class="space-y-3">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="query"
              type="search"
              placeholder="Pretraži signal po nazivu ili opisu…"
              class="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none text-sm"
            />
          </div>
          <select
            v-model="categoryFilter"
            class="w-full sm:w-auto px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-300 focus:border-cyan-500/50 focus:outline-none"
          >
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.icon ? `${cat.icon} ` : '' }}{{ cat.title }}
            </option>
          </select>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 py-6">
      <p class="text-xs text-slate-500 mb-4">{{ filtered.length }} signala</p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <article
          v-for="(signal, i) in filtered"
          :key="`${signal.categoryId}-${signal.name}-${i}`"
          class="card-dark overflow-hidden"
        >
          <div class="bg-slate-950 border-b border-slate-800">
            <SignalVisual :visual="signal.visual" :alt="signal.name" />
          </div>
          <div class="p-4">
            <div class="flex items-start justify-between gap-2 mb-2">
              <h3 class="text-sm font-semibold text-cyan-300 leading-snug">{{ signal.name }}</h3>
              <span class="text-[10px] text-slate-600 shrink-0">{{ signal.categoryIcon }}</span>
            </div>
            <p class="text-[10px] text-slate-600 mb-2">{{ signal.categoryTitle }}</p>
            <p class="text-xs text-slate-400 leading-relaxed">{{ signal.description }}</p>
          </div>
        </article>
      </div>

      <p v-if="!filtered.length" class="text-center text-slate-500 py-16">
        Nema signala za ovaj filter.
      </p>
    </main>
  </div>
</template>

<script setup>
import { examBank, railwayData, searchExamQuestions } from '~/data/database.js'

useHead({ title: 'Pretraga pitanja – Strojovođa' })

const query = ref('')
const categoryFilter = ref('')

const categories = computed(() => [
  { id: '', title: 'Sve kategorije' },
  ...railwayData.map(c => ({ id: c.id, title: c.title })),
])

const results = computed(() => {
  const q = query.value.trim()
  if (q.length < 2) return examBank.slice(0, 50)
  return searchExamQuestions(q, categoryFilter.value || null)
})

const resultCount = computed(() => results.value.length)
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
            <h1 class="text-lg font-bold text-white">Pretraga pitanja</h1>
            <p class="text-xs text-slate-500">{{ examBank.length }} ispitnih pitanja · odgovor odmah vidljiv</p>
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
              placeholder="Pretraži pitanje ili odgovor…"
              class="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none text-sm"
            />
          </div>
          <select
            v-model="categoryFilter"
            class="w-full sm:w-auto px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-300 focus:border-cyan-500/50 focus:outline-none"
          >
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.title }}
            </option>
          </select>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 py-6 space-y-3">
      <p class="text-xs text-slate-500">
        <template v-if="query.trim().length < 2">
          Prvih 50 pitanja — upiši najmanje 2 znaka za pretragu
        </template>
        <template v-else>
          {{ resultCount }} rezultata za „{{ query.trim() }}“
        </template>
      </p>

      <article
        v-for="(item, i) in results"
        :key="`${item.num}-${i}`"
        class="card-dark p-4 space-y-3"
      >
        <div class="flex flex-wrap items-center gap-2">
          <span v-if="item.num" class="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
            #{{ String(item.num).padStart(2, '0') }}
          </span>
          <span class="text-[10px] text-slate-500">{{ item.categoryTitle }}</span>
        </div>

        <p class="text-sm font-medium text-white leading-relaxed">
          {{ item.question }}
        </p>

        <div class="rounded-lg border border-emerald-500/30 bg-emerald-950/30 px-4 py-3">
          <p class="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">Odgovor</p>
          <p class="text-sm text-emerald-100/90 leading-relaxed whitespace-pre-wrap">{{ item.answer }}</p>
        </div>
      </article>

      <p v-if="!results.length" class="text-center text-slate-500 py-16">
        Nema rezultata. Pokušaj s drugim pojmom.
      </p>
    </main>
  </div>
</template>

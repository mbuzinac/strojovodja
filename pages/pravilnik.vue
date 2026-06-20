<script setup>
import {
  pravilnikCategories,
  pravilnikItems,
  searchPravilnik,
  normalizePravilnik,
} from '~/data/signalni-pravilnik.js'

useHead({ title: 'Signalni pravilnik – Strojovođa' })

const query = ref('')
const activeCat = ref('')

const isSearching = computed(() => normalizePravilnik(query.value.trim()).length >= 2)

const results = computed(() => searchPravilnik(query.value, activeCat.value || null))

const fullWidth = (t) => t === 'qa' || t === 'note'

function groupItems(items) {
  const map = new Map()
  for (const it of items) {
    const g = it.group || ''
    if (!map.has(g)) map.set(g, [])
    map.get(g).push(it)
  }
  return [...map.entries()].map(([group, list]) => ({ group, items: list }))
}

const browseCategories = computed(() =>
  activeCat.value
    ? pravilnikCategories.filter(c => c.id === activeCat.value)
    : pravilnikCategories,
)

const searchGroups = computed(() => {
  const map = new Map()
  for (const it of results.value) {
    if (!map.has(it.categoryId)) {
      map.set(it.categoryId, {
        id: it.categoryId,
        title: it.categoryTitle,
        icon: it.categoryIcon,
        items: [],
      })
    }
    map.get(it.categoryId).items.push(it)
  }
  return [...map.values()]
})

function selectCat(id) {
  activeCat.value = id
  if (process.client) window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="min-h-screen bg-neutral-950 pb-20">
    <header class="sticky top-0 z-30 bg-neutral-950/95 backdrop-blur-md border-b border-slate-800">
      <div class="max-w-5xl mx-auto px-4 py-4">
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
          <div class="min-w-0">
            <h1 class="text-lg font-bold text-white flex items-center gap-2">
              <span>📕</span> Signalni pravilnik
            </h1>
            <p class="text-xs text-slate-500">{{ pravilnikItems.length }} signala, oznaka i pojmova</p>
          </div>
        </div>

        <div class="relative mb-3">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="query"
            type="search"
            placeholder="Pretraži signal, oznaku ili pojam…"
            class="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none text-sm"
          />
        </div>

        <div class="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
          <button
            class="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
            :class="activeCat === ''
              ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40'
              : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'"
            @click="selectCat('')"
          >
            Sve
          </button>
          <button
            v-for="cat in pravilnikCategories"
            :key="cat.id"
            class="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-1.5"
            :class="activeCat === cat.id
              ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40'
              : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'"
            @click="selectCat(cat.id)"
          >
            <span>{{ cat.icon }}</span>
            <span>{{ cat.title }}</span>
            <span class="text-[10px] opacity-60">{{ cat.count }}</span>
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-4 py-6">
      <!-- REZULTATI PRETRAGE -->
      <template v-if="isSearching">
        <p class="text-xs text-slate-500 mb-5">{{ results.length }} rezultata za „{{ query.trim() }}"</p>

        <div v-if="!results.length" class="text-center text-slate-500 py-16">
          Nema rezultata. Pokušaj s drugim pojmom.
        </div>

        <section v-for="grp in searchGroups" :key="grp.id" class="mb-8">
          <h2 class="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
            <span class="text-base">{{ grp.icon }}</span>{{ grp.title }}
            <span class="text-xs text-slate-600 font-normal">({{ grp.items.length }})</span>
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              v-for="(item, i) in grp.items"
              :key="i"
              :class="fullWidth(item.type) ? 'sm:col-span-2' : ''"
            >
              <PravilnikItem :item="item" />
            </div>
          </div>
        </section>
      </template>

      <!-- PREGLED PO KATEGORIJAMA -->
      <template v-else>
        <section v-for="cat in browseCategories" :key="cat.id" class="mb-10">
          <div class="flex items-center gap-2.5 mb-4">
            <span class="text-2xl">{{ cat.icon }}</span>
            <div>
              <h2 class="text-base font-bold text-white">{{ cat.title }}</h2>
              <p class="text-[11px] text-slate-500">{{ cat.count }} stavki</p>
            </div>
          </div>

          <div
            v-for="grp in groupItems(cat.items)"
            :key="grp.group"
            class="mb-6"
          >
            <h3
              v-if="grp.group"
              class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 pl-0.5"
            >
              {{ grp.group }}
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                v-for="(item, i) in grp.items"
                :key="i"
                :class="fullWidth(item.type) ? 'sm:col-span-2' : ''"
              >
                <PravilnikItem :item="item" />
              </div>
            </div>
          </div>
        </section>
      </template>
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

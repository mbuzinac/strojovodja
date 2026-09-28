<script setup>
import {
  agencijaCats,
  agencijaQuestions,
  getAgencijaByCat,
  shuffleAgencija,
} from '~/data/agencija-test.js'

useHead({ title: 'Agencijski test – Strojovođa' })

const mode = ref('kartica') // 'kartica' | 'lista'
const activeCat = ref('pravilnik')
const seed = ref(0)
const index = ref(0)
const revealed = ref(false)
const known = ref({}) // id -> true/false
const revealAll = ref(false)

const assetPath = useAssetPath()

function onImgError(e) {
  if (e?.target) e.target.style.visibility = 'hidden'
}

const STORAGE = 'agencija-test-progress'

onMounted(() => {
  try {
    const raw = localStorage.getItem(STORAGE)
    if (raw) known.value = JSON.parse(raw)
  } catch { /* ignore */ }
})

watch(known, (v) => {
  if (import.meta.client) localStorage.setItem(STORAGE, JSON.stringify(v))
}, { deep: true })

const pool = computed(() => {
  const base = getAgencijaByCat(activeCat.value || null)
  return seed.value ? shuffleAgencija(base, seed.value) : base
})

const current = computed(() => pool.value[index.value] || null)
const total = computed(() => pool.value.length)
const knownCount = computed(() => pool.value.filter(q => known.value[q.id] === true).length)
const weakCount = computed(() => pool.value.filter(q => known.value[q.id] === false).length)

const catMeta = computed(() => {
  const m = Object.fromEntries(agencijaCats.map(c => [c.id, c]))
  return m
})

function selectCat(id) {
  activeCat.value = id
  index.value = 0
  revealed.value = false
}

function reshuffle() {
  seed.value = Math.floor(Math.random() * 1e9) + 1
  index.value = 0
  revealed.value = false
}

function resetOrder() {
  seed.value = 0
  index.value = 0
  revealed.value = false
}

function next() {
  if (index.value < total.value - 1) {
    index.value++
    revealed.value = false
  }
}

function prev() {
  if (index.value > 0) {
    index.value--
    revealed.value = false
  }
}

function mark(ok) {
  if (!current.value) return
  known.value[current.value.id] = ok
  next()
}

function clearProgress() {
  known.value = {}
}

function jumpToWeak() {
  const weak = pool.value.findIndex(q => known.value[q.id] === false)
  if (weak >= 0) {
    index.value = weak
    revealed.value = false
    mode.value = 'kartica'
  }
}
</script>

<template>
  <div class="min-h-screen bg-neutral-950 pb-24">
    <header class="sticky top-0 z-30 bg-neutral-950/95 backdrop-blur-md border-b border-slate-800">
      <div class="max-w-3xl mx-auto px-4 py-4">
        <div class="flex items-center gap-3 mb-3">
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
              <span>🎓</span> Agencijski test
            </h1>
            <p class="text-xs text-slate-500">
              {{ agencijaQuestions.length }} pitanja · usmeni stil · gumb za odgovor
            </p>
          </div>
          <div class="flex gap-1.5 shrink-0">
            <button
              type="button"
              class="px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors"
              :class="mode === 'kartica'
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-700'"
              @click="mode = 'kartica'"
            >
              Kartica
            </button>
            <button
              type="button"
              class="px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors"
              :class="mode === 'lista'
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-700'"
              @click="mode = 'lista'"
            >
              Lista
            </button>
          </div>
        </div>

        <div class="flex flex-wrap gap-2 mb-3">
          <button
            type="button"
            class="px-3 py-1.5 rounded-lg text-xs font-medium border"
            :class="seed ? 'bg-violet-500/15 text-violet-300 border-violet-500/40' : 'bg-slate-900 text-slate-400 border-slate-700'"
            @click="reshuffle"
          >
            🔀 Izmiksaj
          </button>
          <button
            v-if="seed"
            type="button"
            class="px-3 py-1.5 rounded-lg text-xs font-medium border bg-slate-900 text-slate-400 border-slate-700"
            @click="resetOrder"
          >
            Po redu
          </button>
          <button
            v-if="mode === 'lista'"
            type="button"
            class="px-3 py-1.5 rounded-lg text-xs font-medium border"
            :class="revealAll ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40' : 'bg-slate-900 text-slate-400 border-slate-700'"
            @click="revealAll = !revealAll"
          >
            {{ revealAll ? 'Sakrij sve' : 'Prikaži sve' }}
          </button>
          <button
            v-if="weakCount"
            type="button"
            class="px-3 py-1.5 rounded-lg text-xs font-medium border bg-rose-500/10 text-rose-300 border-rose-500/30"
            @click="jumpToWeak"
          >
            Slabi ({{ weakCount }})
          </button>
          <button
            v-if="knownCount || weakCount"
            type="button"
            class="px-3 py-1.5 rounded-lg text-xs font-medium border bg-slate-900 text-slate-500 border-slate-800"
            @click="clearProgress"
          >
            Reset napretka
          </button>
        </div>

        <div class="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
          <button
            class="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
            :class="activeCat === ''
              ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40'
              : 'bg-slate-900 text-slate-400 border-slate-700'"
            @click="selectCat('')"
          >
            Sve · {{ agencijaQuestions.length }}
          </button>
          <button
            v-for="c in agencijaCats"
            :key="c.id"
            class="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-1.5"
            :class="activeCat === c.id
              ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40'
              : 'bg-slate-900 text-slate-400 border-slate-700'"
            @click="selectCat(c.id)"
          >
            <span>{{ c.icon }}</span>
            <span>{{ c.title }}</span>
            <span class="text-[10px] opacity-60">{{ getAgencijaByCat(c.id).length }}</span>
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-3xl mx-auto px-4 py-6">
      <!-- progress -->
      <div class="mb-5 flex items-center gap-3 text-xs text-slate-500">
        <span>Znam: <strong class="text-emerald-400">{{ knownCount }}</strong></span>
        <span>Ponovi: <strong class="text-rose-400">{{ weakCount }}</strong></span>
        <span class="ml-auto">{{ total }} u setu</span>
      </div>

      <!-- KARTICA MODE -->
      <div v-if="mode === 'kartica' && current" class="space-y-4">
        <div class="rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-900 to-neutral-950 overflow-hidden">
          <div class="px-4 py-3 border-b border-slate-800 flex items-center gap-2">
            <span class="text-lg">{{ catMeta[current.cat]?.icon }}</span>
            <span class="text-xs text-slate-400">{{ catMeta[current.cat]?.title }}</span>
            <span class="ml-auto text-xs font-mono text-slate-500">{{ index + 1 }} / {{ total }}</span>
          </div>

          <div class="p-5 sm:p-7">
            <p class="text-[10px] font-bold uppercase tracking-wider text-amber-500/80 mb-2">
              Pitanje · zamisli usmeni odgovor
            </p>
            <h2 class="text-lg sm:text-xl font-semibold text-white leading-snug whitespace-pre-line">
              {{ current.question }}
            </h2>

            <div
              v-if="current.images?.length"
              class="mt-5 flex flex-wrap justify-center gap-4 rounded-xl border border-slate-700 bg-slate-950 px-4 py-5"
            >
              <img
                v-for="(src, i) in current.images"
                :key="i"
                :src="assetPath(src)"
                :alt="current.question"
                class="max-h-40 max-w-[180px] object-contain rounded-md bg-white/5 p-1.5"
                @error="onImgError"
              />
            </div>

            <div class="mt-6">
              <button
                v-if="!revealed"
                type="button"
                class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 font-semibold text-sm hover:bg-cyan-500/25 transition-colors"
                @click="revealed = true"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Prikaži odgovor
              </button>

              <div
                v-else
                class="rounded-xl border border-emerald-500/25 bg-emerald-500/5 px-4 py-4"
              >
                <p class="text-[10px] font-bold uppercase tracking-wider text-emerald-400/80 mb-2">Odgovor</p>
                <p class="text-sm text-emerald-50/95 leading-relaxed whitespace-pre-line">{{ current.answer }}</p>
              </div>
            </div>
          </div>

          <div v-if="revealed" class="px-4 py-3 border-t border-slate-800 flex flex-wrap gap-2">
            <button
              type="button"
              class="flex-1 min-w-[120px] px-4 py-2.5 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 text-sm font-semibold"
              @click="mark(true)"
            >
              ✓ Znam
            </button>
            <button
              type="button"
              class="flex-1 min-w-[120px] px-4 py-2.5 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/30 text-sm font-semibold"
              @click="mark(false)"
            >
              ✗ Ponovi
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between gap-3">
          <button
            type="button"
            class="px-4 py-2 rounded-xl text-sm border border-slate-700 text-slate-300 disabled:opacity-30"
            :disabled="index === 0"
            @click="prev"
          >
            ← Prethodno
          </button>
          <div class="h-1.5 flex-1 max-w-xs bg-slate-800 rounded-full overflow-hidden">
            <div
              class="h-full bg-cyan-500/70 transition-all"
              :style="{ width: `${((index + 1) / total) * 100}%` }"
            />
          </div>
          <button
            type="button"
            class="px-4 py-2 rounded-xl text-sm border border-slate-700 text-slate-300 disabled:opacity-30"
            :disabled="index >= total - 1"
            @click="next"
          >
            Sljedeće →
          </button>
        </div>

        <p class="text-center text-[11px] text-slate-600">
          Tip: prvo reci naglas, pa tek onda otkrij odgovor.
        </p>
      </div>

      <!-- LISTA MODE -->
      <div v-else class="space-y-3">
        <AgencijaItem
          v-for="(q, i) in pool"
          :key="q.id"
          :item="q"
          :num="i + 1"
          :cat="catMeta[q.cat]"
          :reveal-all="revealAll"
          :status="known[q.id]"
        />
      </div>
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

<script setup>
import {
  agencijaCats,
  agencijaQuestions,
  getAgencijaByCat,
  shuffleAgencija,
} from '~/data/agencija-test.js'

useHead({ title: 'Agencijski test – Strojovođa' })

const mode = ref('kartica') // 'kartica' | 'lista'
const activeCat = ref('usmeno')
const filterMode = ref('all') // 'all' | 'new' | 'weak' | 'known'
const seed = ref(0)
const index = ref(0)
const revealed = ref(false)
const known = ref({}) // id -> true/false
const revealAll = ref(false)
const celebrating = ref(false)

const lightbox = ref({ src: '', label: '' })

const assetPath = useAssetPath()

function onImgError(e) {
  if (e?.target) e.target.style.visibility = 'hidden'
}

function openLightbox(src, label = '') {
  lightbox.value = { src: assetPath(src), label }
}

function closeLightbox() {
  lightbox.value = { src: '', label: '' }
}

const STORAGE = 'agencija-test-progress-v5'
const SESSION = 'agencija-test-session-v5'

onMounted(() => {
  try {
    const raw = localStorage.getItem(STORAGE)
    if (raw) known.value = JSON.parse(raw)
  } catch { /* ignore */ }

  try {
    const sess = JSON.parse(localStorage.getItem(SESSION) || 'null')
    if (sess?.cat) activeCat.value = sess.cat
    if (sess?.mode) mode.value = sess.mode
    if (typeof sess?.index === 'number') index.value = sess.index
    if (sess?.seed) seed.value = sess.seed
    if (sess?.filter) filterMode.value = sess.filter
  } catch { /* ignore */ }

  window.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
})

watch(known, (v) => {
  if (import.meta.client) localStorage.setItem(STORAGE, JSON.stringify(v))
}, { deep: true })

watch([activeCat, mode, index, seed, filterMode], () => {
  if (!import.meta.client) return
  localStorage.setItem(SESSION, JSON.stringify({
    cat: activeCat.value,
    mode: mode.value,
    index: index.value,
    seed: seed.value,
    filter: filterMode.value,
  }))
})

const basePool = computed(() => {
  const base = getAgencijaByCat(activeCat.value || null)
  return seed.value ? shuffleAgencija(base, seed.value) : base
})

const pool = computed(() => {
  const items = basePool.value
  if (filterMode.value === 'new') {
    return items.filter(q => known.value[q.id] == null)
  }
  if (filterMode.value === 'weak') {
    return items.filter(q => known.value[q.id] === false)
  }
  if (filterMode.value === 'known') {
    return items.filter(q => known.value[q.id] === true)
  }
  return items
})

const current = computed(() => pool.value[index.value] || null)
const total = computed(() => pool.value.length)
const knownCount = computed(() => basePool.value.filter(q => known.value[q.id] === true).length)
const weakCount = computed(() => basePool.value.filter(q => known.value[q.id] === false).length)
const newCount = computed(() => basePool.value.filter(q => known.value[q.id] == null).length)
const doneCount = computed(() => knownCount.value + weakCount.value)
const progressPct = computed(() => {
  const t = basePool.value.length
  if (!t) return 0
  return Math.round((knownCount.value / t) * 100)
})

const catMeta = computed(() => Object.fromEntries(agencijaCats.map(c => [c.id, c])))

const kindLabel = computed(() => {
  const k = current.value?.kind
  if (k === 'likovni') return 'Likovni · pokaži sliku i izgovori'
  if (k === 'signal') return 'Signal · reci što vidiš i što radiš'
  return 'Pitanje · usmeni odgovor'
})

watch(pool, (p) => {
  if (!p.length) {
    index.value = 0
    return
  }
  if (index.value >= p.length) index.value = p.length - 1
})

function selectCat(id) {
  activeCat.value = id
  index.value = 0
  revealed.value = false
  filterMode.value = 'all'
}

function setFilter(f) {
  filterMode.value = f
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

function toggleReveal() {
  revealed.value = !revealed.value
}

function mark(ok) {
  if (!current.value) return
  known.value[current.value.id] = ok
  if (ok) {
    celebrating.value = true
    setTimeout(() => { celebrating.value = false }, 420)
  }
  if (index.value < total.value - 1) {
    next()
  } else {
    revealed.value = false
  }
}

function clearProgress() {
  if (!confirm('Resetirati napredak za sve pitanja?')) return
  known.value = {}
  index.value = 0
  revealed.value = false
}

function jumpToWeak() {
  setFilter('weak')
  mode.value = 'kartica'
}

function onKey(e) {
  if (lightbox.value.src) {
    if (e.key === 'Escape') closeLightbox()
    return
  }
  const tag = (e.target?.tagName || '').toLowerCase()
  if (tag === 'input' || tag === 'textarea' || e.target?.isContentEditable) return
  if (mode.value !== 'kartica') return

  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault()
    toggleReveal()
  } else if (e.key === 'ArrowRight' || e.key === 'j') {
    e.preventDefault()
    next()
  } else if (e.key === 'ArrowLeft' || e.key === 'k') {
    e.preventDefault()
    prev()
  } else if (e.key === '1' || e.key === 'y') {
    e.preventDefault()
    if (revealed.value) mark(true)
  } else if (e.key === '2' || e.key === 'n') {
    e.preventDefault()
    if (revealed.value) mark(false)
  } else if (e.key === 'Escape' && revealed.value) {
    revealed.value = false
  }
}

// Swipe
const touchX = ref(null)
function onTouchStart(e) {
  touchX.value = e.changedTouches?.[0]?.clientX ?? null
}
function onTouchEnd(e) {
  if (touchX.value == null) return
  const x = e.changedTouches?.[0]?.clientX
  if (x == null) return
  const dx = x - touchX.value
  touchX.value = null
  if (Math.abs(dx) < 60) return
  if (dx < 0) next()
  else prev()
}
</script>

<template>
  <div class="min-h-screen bg-neutral-950 pb-28">
    <header class="sticky top-0 z-30 border-b border-slate-800/80 bg-neutral-950/90 backdrop-blur-xl">
      <div class="mx-auto max-w-3xl px-4 py-3">
        <div class="mb-3 flex items-center gap-3">
          <NuxtLink
            to="/"
            class="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            aria-label="Natrag"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </NuxtLink>
          <div class="min-w-0 flex-1">
            <h1 class="flex items-center gap-2 text-lg font-bold text-white">
              <span>🎓</span> Agencijski test
            </h1>
            <p class="text-xs text-slate-500">
              {{ knownCount }}/{{ basePool.length || agencijaQuestions.length }} znaš · Space = odgovor
            </p>
          </div>
          <div class="flex shrink-0 gap-1.5">
            <button
              type="button"
              class="rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors"
              :class="mode === 'kartica'
                ? 'border-amber-500/40 bg-amber-500/15 text-amber-300'
                : 'border-slate-700 bg-slate-900 text-slate-400'"
              @click="mode = 'kartica'"
            >
              Kartica
            </button>
            <button
              type="button"
              class="rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors"
              :class="mode === 'lista'
                ? 'border-amber-500/40 bg-amber-500/15 text-amber-300'
                : 'border-slate-700 bg-slate-900 text-slate-400'"
              @click="mode = 'lista'"
            >
              Lista
            </button>
          </div>
        </div>

        <!-- Progress strip -->
        <div class="mb-3">
          <div class="mb-1.5 flex items-center justify-between text-[11px] text-slate-500">
            <span>
              <strong class="text-emerald-400">{{ knownCount }}</strong> znam ·
              <strong class="text-rose-400">{{ weakCount }}</strong> ponovi ·
              <strong class="text-slate-400">{{ newCount }}</strong> novo
            </span>
            <span class="font-mono text-cyan-400/80">{{ progressPct }}%</span>
          </div>
          <div class="flex h-2 overflow-hidden rounded-full bg-slate-800/80">
            <div
              class="bg-emerald-500/80 transition-all duration-500"
              :style="{ width: `${basePool.length ? (knownCount / basePool.length) * 100 : 0}%` }"
            />
            <div
              class="bg-rose-500/60 transition-all duration-500"
              :style="{ width: `${basePool.length ? (weakCount / basePool.length) * 100 : 0}%` }"
            />
          </div>
        </div>

        <!-- Tabs -->
        <div class="scrollbar-none -mx-1 mb-2.5 flex gap-2 overflow-x-auto px-1 pb-1">
          <button
            v-for="c in agencijaCats"
            :key="c.id"
            type="button"
            class="flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all"
            :class="activeCat === c.id
              ? 'border-cyan-400/50 bg-cyan-500/20 text-cyan-200 shadow-[0_0_20px_-8px_rgba(34,211,238,0.5)]'
              : 'border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600'"
            @click="selectCat(c.id)"
          >
            <span>{{ c.icon }}</span>
            <span>{{ c.title }}</span>
            <span class="text-[10px] opacity-60">{{ getAgencijaByCat(c.id).length }}</span>
          </button>
        </div>

        <!-- Filters + actions -->
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="f in [
              { id: 'all', label: 'Sve', n: basePool.length },
              { id: 'new', label: 'Novo', n: newCount },
              { id: 'weak', label: 'Ponovi', n: weakCount },
              { id: 'known', label: 'Znam', n: knownCount },
            ]"
            :key="f.id"
            type="button"
            class="rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-colors"
            :class="filterMode === f.id
              ? 'border-violet-400/40 bg-violet-500/15 text-violet-200'
              : 'border-slate-800 bg-slate-900/60 text-slate-500'"
            @click="setFilter(f.id)"
          >
            {{ f.label }} <span class="opacity-70">{{ f.n }}</span>
          </button>

          <span class="mx-0.5 w-px self-stretch bg-slate-800" />

          <button
            type="button"
            class="rounded-lg border px-2.5 py-1 text-[11px] font-medium"
            :class="seed ? 'border-violet-500/40 bg-violet-500/15 text-violet-300' : 'border-slate-800 bg-slate-900/60 text-slate-500'"
            @click="reshuffle"
          >
            🔀 Miksaj
          </button>
          <button
            v-if="seed"
            type="button"
            class="rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-[11px] text-slate-500"
            @click="resetOrder"
          >
            Po redu
          </button>
          <button
            v-if="mode === 'lista'"
            type="button"
            class="rounded-lg border px-2.5 py-1 text-[11px] font-medium"
            :class="revealAll ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300' : 'border-slate-800 bg-slate-900/60 text-slate-500'"
            @click="revealAll = !revealAll"
          >
            {{ revealAll ? 'Sakrij' : 'Otkrij sve' }}
          </button>
          <button
            v-if="doneCount"
            type="button"
            class="rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-[11px] text-slate-600 hover:text-slate-400"
            @click="clearProgress"
          >
            Reset
          </button>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-3xl px-4 py-5">
      <!-- Empty filter -->
      <div
        v-if="!total"
        class="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-16 text-center"
      >
        <p class="text-base font-semibold text-slate-300">Nema pitanja u ovom filtru</p>
        <p class="mt-1 text-sm text-slate-500">Promijeni filter ili tab.</p>
        <button
          type="button"
          class="mt-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300"
          @click="setFilter('all')"
        >
          Prikaži sve
        </button>
      </div>

      <!-- KARTICA -->
      <div
        v-else-if="mode === 'kartica' && current"
        class="space-y-4"
        @touchstart.passive="onTouchStart"
        @touchend.passive="onTouchEnd"
      >
        <div
          class="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-gradient-to-br from-slate-900 via-neutral-950 to-slate-950 shadow-2xl shadow-cyan-950/20 transition-transform"
          :class="celebrating ? 'scale-[1.01] ring-2 ring-emerald-400/40' : ''"
        >
          <div class="flex items-center gap-2 border-b border-slate-800/80 px-4 py-3">
            <span class="text-lg">{{ catMeta[current.cat]?.icon || '🎓' }}</span>
            <span class="text-xs text-slate-400">{{ catMeta[current.cat]?.title || 'Sve' }}</span>
            <span
              v-if="known[current.id] === true"
              class="rounded-md border border-emerald-500/30 bg-emerald-500/15 px-1.5 py-0.5 text-[10px] text-emerald-400"
            >znam</span>
            <span
              v-else-if="known[current.id] === false"
              class="rounded-md border border-rose-500/30 bg-rose-500/15 px-1.5 py-0.5 text-[10px] text-rose-400"
            >ponovi</span>
            <span class="ml-auto font-mono text-xs text-slate-500">{{ index + 1 }} / {{ total }}</span>
          </div>

          <div class="p-5 sm:p-7">
            <p class="mb-1 text-[10px] font-bold uppercase tracking-wider text-amber-500/80">
              {{ kindLabel }}
            </p>
            <p v-if="current.name" class="mb-1 text-sm text-cyan-400/90">„{{ current.name }}"</p>
            <p v-if="current.group" class="mb-2 text-[11px] text-slate-500">{{ current.group }}</p>
            <h2 class="whitespace-pre-line text-lg font-semibold leading-snug text-white sm:text-xl">
              {{ current.question }}
            </h2>

            <div
              v-if="current.images?.length"
              class="mt-5 flex flex-wrap justify-center gap-5 rounded-xl border border-cyan-500/20 bg-slate-950/90 px-4 py-6"
            >
              <figure
                v-for="(src, i) in current.images"
                :key="i"
                class="group flex cursor-zoom-in flex-col items-center gap-2"
                @click="openLightbox(src, current.imageLabels?.[i] || current.name || '')"
              >
                <figcaption
                  v-if="current.imageLabels?.[i]"
                  class="text-xs font-bold uppercase tracking-wider text-amber-400"
                >
                  {{ current.imageLabels[i] }}
                </figcaption>
                <img
                  :src="assetPath(src)"
                  :alt="current.imageLabels?.[i] || current.name || current.question"
                  class="rounded-md bg-white/5 object-contain p-2 transition group-hover:ring-2 group-hover:ring-cyan-400/40"
                  :class="current.bigImages
                    ? 'max-h-64 max-w-[260px] sm:max-h-72 sm:max-w-[280px]'
                    : 'max-h-52 max-w-[220px]'"
                  @error="onImgError"
                />
                <span class="text-[10px] text-slate-600 opacity-0 transition group-hover:opacity-100">uvećaj</span>
              </figure>
            </div>

            <div class="mt-6">
              <button
                v-if="!revealed"
                type="button"
                class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/15 px-5 py-3.5 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/25 sm:w-auto"
                @click="revealed = true"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Prikaži odgovor
                <kbd class="ml-1 hidden rounded border border-cyan-500/30 bg-cyan-950/50 px-1.5 py-0.5 text-[10px] font-normal text-cyan-400/80 sm:inline">Space</kbd>
              </button>

              <div
                v-else
                class="animate-in fade-in rounded-xl border border-emerald-500/25 bg-emerald-500/5 px-4 py-4"
              >
                <p class="mb-3 text-[10px] font-bold uppercase tracking-wider text-emerald-400/80">Odgovor</p>
                <AgencijaAnswer :text="current.answer" />
              </div>
            </div>
          </div>

          <div
            v-if="revealed"
            class="flex flex-wrap gap-2 border-t border-slate-800 px-4 py-3"
          >
            <button
              type="button"
              class="min-w-[120px] flex-1 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/25"
              @click="mark(true)"
            >
              ✓ Znam <kbd class="ml-1 hidden text-[10px] opacity-60 sm:inline">1</kbd>
            </button>
            <button
              type="button"
              class="min-w-[120px] flex-1 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/20"
              @click="mark(false)"
            >
              ✗ Ponovi <kbd class="ml-1 hidden text-[10px] opacity-60 sm:inline">2</kbd>
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between gap-3">
          <button
            type="button"
            class="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 disabled:opacity-30"
            :disabled="index === 0"
            @click="prev"
          >
            ← Prethodno
          </button>
          <div class="h-1.5 max-w-xs flex-1 overflow-hidden rounded-full bg-slate-800">
            <div
              class="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
              :style="{ width: `${((index + 1) / total) * 100}%` }"
            />
          </div>
          <button
            type="button"
            class="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 disabled:opacity-30"
            :disabled="index >= total - 1"
            @click="next"
          >
            Sljedeće →
          </button>
        </div>

        <p class="text-center text-[11px] text-slate-600">
          Reci naglas → Space · swipe ←→ · 1 znam · 2 ponovi
        </p>

        <!-- Done celebration -->
        <div
          v-if="knownCount === basePool.length && basePool.length"
          class="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-6 text-center"
        >
          <p class="text-2xl">🎉</p>
          <p class="mt-2 text-base font-semibold text-emerald-200">Sve znaš u ovom tabu!</p>
          <p class="mt-1 text-sm text-emerald-400/70">Idi na sljedeći tab ili vježbaj „Ponovi“.</p>
          <button
            v-if="weakCount"
            type="button"
            class="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm text-rose-300"
            @click="jumpToWeak"
          >
            Ponovi slabe ({{ weakCount }})
          </button>
        </div>
      </div>

      <!-- LISTA -->
      <div v-else-if="mode === 'lista'" class="space-y-3">
        <AgencijaItem
          v-for="(q, i) in pool"
          :key="q.id"
          :item="q"
          :num="i + 1"
          :cat="catMeta[q.cat]"
          :reveal-all="revealAll"
          :status="known[q.id]"
          @zoom="openLightbox"
          @mark="(ok) => { known[q.id] = ok }"
        />
      </div>
    </main>

    <AgencijaLightbox
      :src="lightbox.src"
      :label="lightbox.label"
      @close="closeLightbox"
    />
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

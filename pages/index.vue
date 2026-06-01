<script setup>
import { railwayData, examBank } from '~/data/database.js'

const { categoryPercent } = useProgress()

useHead({ title: 'Strojovođa – Učenje signalnih propisa' })

const totalQuizQuestions = computed(() => railwayData.reduce((s, c) => s + (c.quiz?.length || 0), 0))
const totalSignals = computed(() => railwayData.reduce((s, c) => s + (c.signals?.length || 0), 0))
</script>

<template>
  <div class="min-h-screen bg-neutral-950">
    <header class="relative overflow-hidden border-b border-slate-800">
      <div class="absolute inset-0 bg-gradient-to-br from-cyan-950/40 via-neutral-950 to-emerald-950/30" />
      <div class="relative max-w-4xl mx-auto px-4 py-10 sm:py-12">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-4xl">🚂</span>
          <span class="px-3 py-1 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            PWA · Offline
          </span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight">
          Prometni i signalni
          <span class="neon-text">propisi</span>
        </h1>
        <p class="text-slate-400 text-base max-w-xl leading-relaxed mb-6">
          Uči teoriju, vježbaj signale karticama i testiraj znanje u kvizu – pripremi se za periodični ispit.
        </p>
        <div class="flex flex-wrap gap-3 text-xs">
          <span class="px-3 py-1.5 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700">
            {{ examBank.length }} ispitnih pitanja
          </span>
          <span class="px-3 py-1.5 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700">
            {{ totalQuizQuestions }} kviz pitanja
          </span>
          <span class="px-3 py-1.5 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700">
            {{ totalSignals }} signala
          </span>
          <span class="px-3 py-1.5 rounded-lg bg-slate-800/80 text-emerald-400 border border-emerald-800/50">
            🃏 Flash kartice
          </span>
          <span class="px-3 py-1.5 rounded-lg bg-slate-800/80 text-amber-400 border border-amber-800/50">
            🔥 Nizovi točnih
          </span>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 py-8 pb-16">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        <NuxtLink
          to="/pitanja"
          class="card-dark p-4 hover:border-emerald-500/40 transition-all group flex items-center gap-4"
        >
          <span class="text-3xl group-hover:scale-110 transition-transform">🔍</span>
          <div>
            <p class="font-semibold text-white group-hover:text-emerald-300">Pretraga pitanja</p>
            <p class="text-xs text-slate-500">{{ examBank.length }} pitanja i odgovora iz skripte</p>
          </div>
        </NuxtLink>
        <NuxtLink
          to="/signali"
          class="card-dark p-4 hover:border-cyan-500/40 transition-all group flex items-center gap-4"
        >
          <span class="text-3xl group-hover:scale-110 transition-transform">🚦</span>
          <div>
            <p class="font-semibold text-white group-hover:text-cyan-300">Svi signali</p>
            <p class="text-xs text-slate-500">{{ totalSignals }} signala na jednom mjestu</p>
          </div>
        </NuxtLink>
      </div>

      <h2 class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-5">
        Kategorije učenja
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NuxtLink
          v-for="category in railwayData"
          :key="category.id"
          :to="`/category/${category.id}`"
          class="group card-dark p-5 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/5 transition-all"
        >
          <div class="flex items-start gap-4">
            <span class="text-3xl shrink-0 group-hover:scale-110 transition-transform">{{ category.icon }}</span>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-2 mb-1">
                <h3 class="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
                  {{ category.title }}
                </h3>
                <span class="text-xs font-bold text-cyan-400 shrink-0">{{ categoryPercent(category) }}%</span>
              </div>
              <div class="h-1 bg-slate-800 rounded-full overflow-hidden mb-2">
                <div
                  class="h-full bg-cyan-500/60 transition-all"
                  :style="{ width: `${categoryPercent(category)}%` }"
                />
              </div>
              <p class="text-sm text-slate-400 line-clamp-2 mb-3">{{ category.description }}</p>
              <div class="flex flex-wrap gap-1.5 text-[10px]">
                <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-400">{{ category.lessons.length }} lekcija</span>
                <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-400">{{ category.signals.length }} signala</span>
                <span class="px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-400">{{ category.quiz.length }} kviz</span>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>

      <p class="text-center text-xs text-slate-600 mt-10">
        Izvor: Skripta Strojovođe13253 · Ispitna pitanja za periodične ispite
      </p>
    </main>
  </div>
</template>

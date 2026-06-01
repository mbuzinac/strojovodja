<script setup>
const props = defineProps({
  visual: {
    type: Object,
    required: true,
  },
  alt: {
    type: String,
    default: 'Željeznički signal',
  },
  showBadges: {
    type: Boolean,
    default: true,
  },
})

const colorMap = {
  red: { on: 'bg-red-500 shadow-[0_0_16px_rgba(239,68,68,0.9)]', off: 'bg-red-950/40 border-red-900' },
  green: { on: 'bg-green-500 shadow-[0_0_16px_rgba(34,197,94,0.9)]', off: 'bg-green-950/40 border-green-900' },
  yellow: { on: 'bg-yellow-400 shadow-[0_0_16px_rgba(234,179,8,0.9)]', off: 'bg-yellow-950/40 border-yellow-900' },
  white: { on: 'bg-slate-100 shadow-[0_0_12px_rgba(248,250,252,0.7)]', off: 'bg-slate-800 border-slate-600' },
}

function lightClass(light) {
  const c = colorMap[light.color] || colorMap.white
  const active = light.blink !== false
  return [
    'w-11 h-11 rounded-full border-2 transition-all duration-300',
    active ? c.on : c.off,
    light.blink ? 'animate-signal-blink' : '',
  ]
}

const badgeClass = (b) => {
  if (b.includes('Zvuč')) return 'bg-violet-500/20 text-violet-300 border-violet-500/40'
  if (b.includes('Trep')) return 'bg-amber-500/20 text-amber-300 border-amber-500/40'
  if (b.includes('Mirn')) return 'bg-slate-500/20 text-slate-200 border-slate-500/40'
  if (b.includes('Noć')) return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
  if (b.includes('Dnev')) return 'bg-orange-500/20 text-orange-300 border-orange-500/40'
  return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
}
</script>

<template>
  <div class="flex flex-col items-center justify-center p-4 min-h-[160px]">
    <!-- Zvučni signal (sirena / zviždaljka) -->
    <div v-if="visual.type === 'sound'" class="flex flex-col items-center gap-3 w-full max-w-[220px]">
      <div class="text-4xl" aria-hidden="true">📯</div>
      <div class="flex items-end justify-center gap-1.5 min-h-[2.5rem]">
        <span
          v-for="(tone, i) in (visual.tones || ['long'])"
          :key="i"
          class="rounded-full bg-amber-400/90"
          :class="tone === 'long' ? 'w-10 h-3' : 'w-3 h-3'"
        />
      </div>
      <p class="text-sm font-semibold text-amber-200 text-center">{{ visual.label }}</p>
      <div v-if="showBadges && visual.badges?.length" class="flex flex-wrap gap-1.5 justify-center">
        <span
          v-for="(badge, i) in visual.badges"
          :key="i"
          class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border"
          :class="badgeClass(badge)"
        >
          {{ badge }}
        </span>
      </div>
    </div>

    <!-- Stvarna slika iz skripte -->
    <div v-else-if="visual.image" class="w-full max-w-[220px]">
      <div class="relative rounded-xl overflow-hidden bg-black/60 border border-slate-700/80 shadow-lg">
        <img
          :src="visual.image"
          :alt="alt"
          class="w-full h-auto object-contain max-h-52 mx-auto"
          loading="lazy"
        />
      </div>
      <div v-if="showBadges && visual.badges?.length" class="flex flex-wrap gap-1.5 justify-center mt-3">
        <span
          v-for="(badge, i) in visual.badges"
          :key="i"
          class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border"
          :class="badgeClass(badge)"
        >
          {{ badge }}
        </span>
      </div>
    </div>

    <!-- CSS fallback (nema slike) -->
    <template v-else>
      <div
        v-if="visual.type === 'light'"
        class="flex flex-col items-center gap-2.5 p-4 bg-neutral-900 rounded-xl border-2 border-neutral-700 shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]"
      >
        <div
          v-for="(light, i) in visual.lights"
          :key="i"
          :class="lightClass(light)"
        />
        <p v-if="visual.lights?.some(l => l.blink)" class="text-[10px] text-amber-400/80 mt-1">
          ● trepćuće &nbsp; ○ mirno (neaktivno)
        </p>
      </div>

      <div v-else-if="visual.type === 'semaphore'" class="relative flex flex-col items-center">
        <div class="w-3 h-24 bg-slate-800 rounded-sm" />
        <div
          class="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-2 rounded-full origin-left"
          :class="{
            'bg-red-500 rotate-0': visual.arm === 'horizontal',
            'bg-green-500 -rotate-[45deg]': visual.arm === 'raised',
            'bg-gradient-to-r from-green-500 to-yellow-400 -rotate-[45deg] h-3': visual.arm === 'double',
          }"
        />
      </div>

      <div
        v-else-if="visual.type === 'electric'"
        class="w-20 h-20 bg-blue-600 border-2 border-white rotate-45 flex items-center justify-center"
      >
        <span class="-rotate-45 text-white font-bold text-lg">{{ visual.symbol || 'U' }}</span>
      </div>

      <div
        v-else-if="visual.type === 'marker'"
        class="w-6 h-28 rounded-sm border border-slate-600 bg-gradient-to-b from-blue-600 via-white to-blue-600 bg-[length:100%_16px]"
      />

      <div
        v-else-if="visual.type === 'cross'"
        class="relative w-14 h-14 bg-white border-[3px] border-black rounded-sm overflow-hidden"
      >
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="absolute w-[130%] h-0.5 bg-black rotate-45" />
          <div class="absolute w-[130%] h-0.5 bg-black -rotate-45" />
        </div>
      </div>

      <div
        v-else-if="visual.type === 'plate'"
        class="w-20 h-14 bg-black border-2 border-slate-500 flex items-center justify-center rounded-sm"
      >
        <span class="text-white font-bold text-2xl">{{ visual.text || 'Z' }}</span>
      </div>

      <div v-else class="w-12 h-12 rounded-full bg-slate-700 border-2 border-slate-600" />
    </template>
  </div>
</template>

<style scoped>
@keyframes signal-blink {
  0%, 45% { opacity: 1; filter: brightness(1.2); }
  50%, 95% { opacity: 0.15; filter: brightness(0.4); }
  100% { opacity: 1; filter: brightness(1.2); }
}
.animate-signal-blink {
  animation: signal-blink 1.1s ease-in-out infinite;
}
</style>

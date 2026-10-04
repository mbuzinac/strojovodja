<script setup>
const props = defineProps({
  item: { type: Object, required: true },
  num: { type: Number, required: true },
  cat: { type: Object, default: null },
  revealAll: { type: Boolean, default: false },
  status: { default: null },
})

const emit = defineEmits(['zoom', 'mark'])

const { theme } = useTheme()
const light = computed(() => theme.value === 'light')
const assetPath = useAssetPath()
const open = ref(false)
const show = computed(() => open.value || props.revealAll)

function onImgError(e) {
  if (e?.target) e.target.style.visibility = 'hidden'
}
</script>

<template>
  <article
    class="overflow-hidden rounded-xl border transition"
    :class="light
      ? (status === true
        ? 'border-emerald-600 bg-white shadow-sm'
        : status === false
          ? 'border-rose-600 bg-white shadow-sm'
          : 'border-slate-300 bg-white shadow-sm')
      : (status === true
        ? 'border-emerald-500/25 bg-slate-900/50'
        : status === false
          ? 'border-rose-500/25 bg-slate-900/50'
          : 'border-slate-800 bg-slate-900/50')"
  >
    <div class="p-4">
      <div class="mb-2 flex items-start gap-2.5">
        <span
          class="mt-0.5 inline-flex h-7 min-w-[1.75rem] shrink-0 items-center justify-center rounded-lg px-1.5 text-xs font-bold"
          :class="status === true
            ? (light ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-500/15 text-emerald-300')
            : status === false
              ? (light ? 'bg-rose-100 text-rose-800' : 'bg-rose-500/15 text-rose-300')
              : (light ? 'bg-cyan-100 text-cyan-900' : 'bg-slate-800 text-cyan-300')"
        >
          {{ num }}
        </span>
        <div class="min-w-0 flex-1">
          <div class="mb-1 flex flex-wrap items-center gap-2">
            <span v-if="cat" class="text-[10px]" :class="light ? 'text-slate-600' : 'text-slate-500'">
              {{ cat.icon }} {{ cat.title }}
            </span>
            <span v-if="item.group" class="text-[10px]" :class="light ? 'text-slate-500' : 'text-slate-600'">
              · {{ item.group }}
            </span>
            <span
              v-if="status === true"
              class="rounded border px-1.5 py-0.5 text-[10px]"
              :class="light ? 'border-emerald-600 bg-emerald-100 text-emerald-800' : 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400'"
            >znam</span>
            <span
              v-else-if="status === false"
              class="rounded border px-1.5 py-0.5 text-[10px]"
              :class="light ? 'border-rose-600 bg-rose-100 text-rose-800' : 'border-rose-500/30 bg-rose-500/15 text-rose-400'"
            >ponovi</span>
          </div>
          <h3
            class="whitespace-pre-line text-sm font-semibold leading-snug"
            :class="light ? 'text-slate-900' : 'text-white'"
          >
            {{ item.question }}
          </h3>
          <p
            v-if="item.name"
            class="mt-1 text-[11px]"
            :class="light ? 'text-cyan-800' : 'text-cyan-400/80'"
          >„{{ item.name }}"</p>
        </div>
      </div>

      <div
        v-if="item.images?.length"
        class="mt-3 flex flex-wrap justify-center gap-4 rounded-lg border px-3 py-4"
        :class="light ? 'border-cyan-600 bg-slate-50' : 'border-cyan-500/15 bg-slate-950/80'"
      >
        <figure
          v-for="(src, i) in item.images"
          :key="i"
          class="flex cursor-zoom-in flex-col items-center gap-1.5"
          @click="emit('zoom', src, item.imageLabels?.[i] || item.name || '')"
        >
          <figcaption
            v-if="item.imageLabels?.[i]"
            class="text-[10px] font-bold uppercase tracking-wider"
            :class="light ? 'text-amber-800' : 'text-amber-400/90'"
          >
            {{ item.imageLabels[i] }}
          </figcaption>
          <img
            :src="assetPath(src)"
            :alt="item.imageLabels?.[i] || item.name || item.question"
            loading="lazy"
            class="rounded-md object-contain p-2"
            :class="[
              light ? 'border border-slate-200 bg-white' : 'bg-white/5',
              item.bigImages
                ? 'max-h-52 max-w-[200px] sm:max-h-64 sm:max-w-[240px]'
                : 'max-h-36 max-w-[160px]',
            ]"
            @error="onImgError"
          />
        </figure>
      </div>

      <button
        v-if="!show"
        type="button"
        class="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold"
        :class="light ? 'text-cyan-800 hover:text-cyan-950' : 'text-cyan-400 hover:text-cyan-300'"
        @click="open = true"
      >
        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        Prikaži odgovor
      </button>

      <div
        v-else
        class="mt-3 rounded-lg border px-3 py-2.5"
        :class="light ? 'border-emerald-600 bg-emerald-50' : 'border-emerald-500/20 bg-emerald-500/5'"
      >
        <p
          class="mb-2 text-[10px] font-bold uppercase tracking-wider"
          :class="light ? 'text-emerald-800' : 'text-emerald-400/70'"
        >Odgovor</p>
        <AgencijaAnswer :text="item.answer" compact />
        <div class="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="rounded-lg border px-2.5 py-1 text-[11px] font-semibold"
            :class="light ? 'border-emerald-700 bg-emerald-100 text-emerald-950' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'"
            @click="emit('mark', true)"
          >
            ✓ Znam
          </button>
          <button
            type="button"
            class="rounded-lg border px-2.5 py-1 text-[11px] font-semibold"
            :class="light ? 'border-rose-700 bg-rose-100 text-rose-950' : 'border-rose-500/30 bg-rose-500/10 text-rose-300'"
            @click="emit('mark', false)"
          >
            ✗ Ponovi
          </button>
          <button
            v-if="!revealAll"
            type="button"
            class="ml-auto text-[11px]"
            :class="light ? 'text-slate-600 hover:text-slate-900' : 'text-slate-500 hover:text-slate-300'"
            @click="open = false"
          >
            Sakrij
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

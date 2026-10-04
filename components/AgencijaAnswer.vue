<script setup>
const props = defineProps({
  text: { type: String, default: '' },
  compact: { type: Boolean, default: false },
})

const { theme } = useTheme()
const light = computed(() => theme.value === 'light')

const SECTION_ICONS = ['📛', '👁', '💡', '🚂', '🔊', '⚠️', '✅']

const ACCENTS = computed(() => light.value
  ? {
      '📛': 'text-cyan-900',
      '👁': 'text-sky-900',
      '💡': 'text-amber-900',
      '🚂': 'text-emerald-900',
      '⚠️': 'text-rose-900',
      '✅': 'text-emerald-900',
    }
  : {
      '📛': 'text-cyan-300',
      '👁': 'text-sky-300',
      '💡': 'text-amber-300',
      '🚂': 'text-emerald-300',
      '⚠️': 'text-rose-300',
      '✅': 'text-emerald-300',
    })

const blocks = computed(() => {
  const lines = (props.text || '').split('\n')
  const out = []
  let list = null

  const flush = () => {
    if (list) {
      out.push(list)
      list = null
    }
  }

  for (const raw of lines) {
    const line = raw.trimEnd()

    if (!line.trim()) {
      flush()
      continue
    }

    const bullet = line.match(/^\s*[•·-]\s+(.*)$/)
    if (bullet) {
      if (list?.type !== 'ul') {
        flush()
        list = { type: 'ul', items: [] }
      }
      list.items.push(bullet[1])
      continue
    }

    const numbered = line.match(/^\s*(\d+)[.)]\s+(.*)$/)
    if (numbered) {
      if (list?.type !== 'ol') {
        flush()
        list = { type: 'ol', items: [] }
      }
      list.items.push(numbered[2])
      continue
    }

    flush()

    const icon = SECTION_ICONS.find(i => line.startsWith(i))
    if (icon) {
      out.push({ type: 'head', icon, text: line.slice(icon.length).trim() })
      continue
    }

    if (/^Točno:/i.test(line)) {
      out.push({ type: 'correct', text: line.replace(/^Točno:\s*/i, '') })
      continue
    }

    out.push({ type: 'p', text: line })
  }

  flush()
  return out
})

const sizeText = computed(() => (props.compact ? 'text-xs' : 'text-sm'))
</script>

<template>
  <div
    :class="[
      'space-y-2.5 leading-relaxed',
      sizeText,
      light ? 'text-slate-900' : 'text-slate-100',
    ]"
  >
    <template v-for="(b, i) in blocks" :key="i">
      <p
        v-if="b.type === 'head'"
        class="flex items-baseline gap-2 font-semibold"
        :class="ACCENTS[b.icon] || (light ? 'text-slate-900' : 'text-slate-200')"
      >
        <span class="shrink-0">{{ b.icon }}</span>
        <span>{{ b.text }}</span>
      </p>

      <p
        v-else-if="b.type === 'correct'"
        class="inline-flex items-start gap-2 rounded-lg border px-2.5 py-1.5 font-semibold"
        :class="light
          ? 'border-emerald-700 bg-emerald-100 text-emerald-950'
          : 'border-emerald-500/30 bg-emerald-500/15 text-emerald-200'"
      >
        <span>✓</span>
        <span>{{ b.text }}</span>
      </p>

      <ul v-else-if="b.type === 'ul'" class="space-y-1.5 pl-1">
        <li
          v-for="(it, j) in b.items"
          :key="j"
          class="flex gap-2"
          :class="light ? 'text-slate-900' : 'text-slate-100'"
        >
          <span
            class="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
            :class="light ? 'bg-cyan-700' : 'bg-cyan-400/80'"
          />
          <span>{{ it }}</span>
        </li>
      </ul>

      <ol v-else-if="b.type === 'ol'" class="space-y-1.5">
        <li
          v-for="(it, j) in b.items"
          :key="j"
          class="flex gap-2.5"
          :class="light ? 'text-slate-900' : 'text-slate-100'"
        >
          <span
            class="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[11px] font-bold"
            :class="light ? 'bg-cyan-100 text-cyan-900' : 'bg-cyan-500/15 text-cyan-300'"
          >{{ j + 1 }}</span>
          <span>{{ it }}</span>
        </li>
      </ol>

      <p v-else :class="light ? 'text-slate-900' : 'text-slate-100'">{{ b.text }}</p>
    </template>
  </div>
</template>

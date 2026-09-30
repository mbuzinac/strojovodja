<script setup>
const props = defineProps({
  text: { type: String, default: '' },
  compact: { type: Boolean, default: false },
})

const SECTION_ICONS = ['📛', '👁', '💡', '🚂', '🔊', '⚠️', '✅']

const ACCENTS = {
  '📛': 'text-cyan-300',
  '👁': 'text-sky-300',
  '💡': 'text-amber-300',
  '🚂': 'text-emerald-300',
  '⚠️': 'text-rose-300',
  '✅': 'text-emerald-300',
}

/** Odgovori su običan tekst – pretvara ih u čitljive blokove. */
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
  <div :class="['space-y-2.5 leading-relaxed', sizeText]">
    <template v-for="(b, i) in blocks" :key="i">
      <p
        v-if="b.type === 'head'"
        class="flex items-baseline gap-2 font-semibold"
        :class="ACCENTS[b.icon] || 'text-slate-200'"
      >
        <span class="shrink-0">{{ b.icon }}</span>
        <span>{{ b.text }}</span>
      </p>

      <p
        v-else-if="b.type === 'correct'"
        class="inline-flex items-start gap-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1.5 font-semibold text-emerald-200"
      >
        <span>✓</span>
        <span>{{ b.text }}</span>
      </p>

      <ul v-else-if="b.type === 'ul'" class="space-y-1.5 pl-1">
        <li v-for="(it, j) in b.items" :key="j" class="flex gap-2 text-slate-100">
          <span class="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400/80" />
          <span>{{ it }}</span>
        </li>
      </ul>

      <ol v-else-if="b.type === 'ol'" class="space-y-1.5">
        <li v-for="(it, j) in b.items" :key="j" class="flex gap-2.5 text-slate-100">
          <span
            class="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-cyan-500/15 text-[11px] font-bold text-cyan-300"
          >{{ j + 1 }}</span>
          <span>{{ it }}</span>
        </li>
      </ol>

      <p v-else class="text-slate-100">{{ b.text }}</p>
    </template>
  </div>
</template>

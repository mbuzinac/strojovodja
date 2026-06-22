<script setup>
const props = defineProps({
  height: { type: Number, default: 240 },
})

const canvas = ref(null)
let ctx = null
let dpr = 1
let ro = null

const colors = [
  { name: 'Crvena', value: '#ef4444' },
  { name: 'Zelena', value: '#22c55e' },
  { name: 'Žuta', value: '#eab308' },
  { name: 'Bijela', value: '#f8fafc' },
  { name: 'Crna', value: '#0f172a' },
]
const tools = [
  { id: 'pen', name: 'Olovka' },
  { id: 'line', name: 'Linija' },
  { id: 'rect', name: 'Pravokutnik' },
  { id: 'circle', name: 'Krug' },
]
const color = ref(colors[0].value)
const widthPx = ref(6)
const tool = ref('pen')

const strokes = ref([])
let active = null
let drawing = false

function resize() {
  const el = canvas.value
  if (!el) return
  const cssW = el.clientWidth
  const cssH = props.height
  dpr = window.devicePixelRatio || 1
  el.width = Math.round(cssW * dpr)
  el.height = Math.round(cssH * dpr)
  ctx = el.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  redraw()
}

function redraw() {
  if (!ctx || !canvas.value) return
  ctx.clearRect(0, 0, canvas.value.clientWidth, canvas.value.clientHeight)
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  for (const s of strokes.value) drawShape(s)
  if (active) drawShape(active)
}

function drawShape(s) {
  ctx.strokeStyle = s.color
  ctx.lineWidth = s.width
  ctx.beginPath()
  if (s.tool === 'pen') {
    const p = s.points
    if (!p.length) return
    ctx.moveTo(p[0].x, p[0].y)
    for (let i = 1; i < p.length; i++) ctx.lineTo(p[i].x, p[i].y)
    if (p.length === 1) ctx.lineTo(p[0].x + 0.1, p[0].y + 0.1)
  } else if (s.tool === 'line') {
    ctx.moveTo(s.x0, s.y0)
    ctx.lineTo(s.x1, s.y1)
  } else if (s.tool === 'rect') {
    ctx.rect(Math.min(s.x0, s.x1), Math.min(s.y0, s.y1), Math.abs(s.x1 - s.x0), Math.abs(s.y1 - s.y0))
  } else if (s.tool === 'circle') {
    const cx = (s.x0 + s.x1) / 2
    const cy = (s.y0 + s.y1) / 2
    const rx = Math.abs(s.x1 - s.x0) / 2
    const ry = Math.abs(s.y1 - s.y0) / 2
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
  }
  ctx.stroke()
}

function pos(e) {
  const r = canvas.value.getBoundingClientRect()
  return { x: e.clientX - r.left, y: e.clientY - r.top }
}

function start(e) {
  e.preventDefault()
  drawing = true
  canvas.value.setPointerCapture?.(e.pointerId)
  const p = pos(e)
  if (tool.value === 'pen') {
    active = { tool: 'pen', color: color.value, width: widthPx.value, points: [p] }
  } else {
    active = { tool: tool.value, color: color.value, width: widthPx.value, x0: p.x, y0: p.y, x1: p.x, y1: p.y }
  }
  redraw()
}

function move(e) {
  if (!drawing || !active) return
  e.preventDefault()
  const p = pos(e)
  if (active.tool === 'pen') active.points.push(p)
  else { active.x1 = p.x; active.y1 = p.y }
  redraw()
}

function end(e) {
  if (!drawing) return
  drawing = false
  if (active) strokes.value.push(active)
  active = null
  canvas.value?.releasePointerCapture?.(e.pointerId)
  redraw()
}

function undo() {
  strokes.value.pop()
  redraw()
}

function clear() {
  strokes.value = []
  redraw()
}

onMounted(() => {
  resize()
  ro = new ResizeObserver(() => resize())
  ro.observe(canvas.value)
})
onBeforeUnmount(() => ro?.disconnect())
</script>

<template>
  <div class="w-full max-w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-950/60 p-2">
    <div class="flex items-center gap-2 flex-wrap mb-2">
      <!-- alati -->
      <div class="flex items-center gap-1">
        <button
          v-for="t in tools"
          :key="t.id"
          type="button"
          :title="t.name"
          class="px-2 py-1 rounded-lg border text-xs font-medium transition-colors"
          :class="tool === t.id
            ? 'border-cyan-400 bg-cyan-500/15 text-cyan-200'
            : 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white'"
          @click="tool = t.id"
        >
          <span v-if="t.id === 'pen'">✏️</span>
          <span v-else-if="t.id === 'line'">╱</span>
          <span v-else-if="t.id === 'rect'">▭</span>
          <span v-else>◯</span>
        </button>
      </div>
      <span class="w-px h-5 bg-slate-700" />
      <!-- boje -->
      <div class="flex items-center gap-1.5">
        <button
          v-for="c in colors"
          :key="c.value"
          type="button"
          :title="c.name"
          class="w-6 h-6 rounded-full border-2 transition-transform"
          :class="color === c.value ? 'border-cyan-400 scale-110' : 'border-slate-600'"
          :style="{ backgroundColor: c.value }"
          @click="color = c.value"
        />
      </div>
      <span class="w-px h-5 bg-slate-700" />
      <input
        v-model.number="widthPx"
        type="range"
        min="2"
        max="20"
        class="w-16 accent-cyan-500"
        title="Debljina"
      />
      <span class="w-px h-5 bg-slate-700" />
      <button
        type="button"
        class="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
        @click="undo"
      >
        ↶ Poništi
      </button>
      <button
        type="button"
        class="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-rose-300 hover:text-rose-200 border border-slate-700"
        @click="clear"
      >
        Obriši sve
      </button>
    </div>
    <canvas
      ref="canvas"
      :style="{ height: height + 'px' }"
      class="block w-full max-w-full rounded-lg bg-white touch-none cursor-crosshair"
      @pointerdown="start"
      @pointermove="move"
      @pointerup="end"
      @pointerleave="end"
      @pointercancel="end"
    />
  </div>
</template>

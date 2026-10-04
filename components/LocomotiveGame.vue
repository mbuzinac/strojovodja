<script setup>
import { signalColor } from '~/composables/useLocomotiveGame.js'

const game = useLocomotiveGame()
const assetPath = useAssetPath()

const {
  phase, throttle, brake, speed, distance, score, violations, streak, horn,
  route, activeQuiz, quizStep, currentSegment, progress,
  upcomingEvent, distToEvent, upcomingSignal, distToSignal,
  upcomingStructure, distToStructure,
  messages, startGame, pauseGame, resumeGame, emergencyBrake,
  blowHorn, setThrottle, setBrake, answerQuiz, skipQuiz,
} = game

function playHorn() {
  blowHorn()
  try {
    const a = new Audio(assetPath('/sounds/locomotive-horn.mp3'))
    a.volume = 0.5
    a.play().catch(() => {})
  } catch {}
}

/* ── Canvas scene ───────────────────────────────────── */
const SIGNAL_VIEW_M = 300
const sceneEl = ref(null)
let rafId = null
let trackPhase = 0
let lastTs = 0
let ro = null
let dpr = 1

function resizeCanvas() {
  const el = sceneEl.value
  if (!el) return
  dpr = window.devicePixelRatio || 1
  const w = el.offsetWidth
  const h = el.offsetHeight
  if (!w || !h) return
  el.width = Math.round(w * dpr)
  el.height = Math.round(h * dpr)
}

onMounted(() => {
  ro = new ResizeObserver(() => resizeCanvas())
  if (sceneEl.value) ro.observe(sceneEl.value)
  rafId = requestAnimationFrame(tick)
  window.addEventListener('keydown', onKeyDown)
})

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
  ro?.disconnect()
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('pointermove', onDrag)
  window.removeEventListener('pointerup', endDrag)
  window.removeEventListener('pointercancel', endDrag)
})

function tick(ts) {
  rafId = requestAnimationFrame(tick)
  const el = sceneEl.value
  if (!el) return
  if (!el.width || !el.height) { resizeCanvas(); return }
  const dt = Math.min((ts - lastTs) / 1000, 0.1)
  lastTs = ts
  // Freeze scenery while paused / quiz; gentle idle scroll on menu
  const spd = phase.value === 'playing' ? speed.value : (phase.value === 'menu' ? 18 : 0)
  if (spd > 0) trackPhase = (trackPhase + (spd / 3.6) * dt * 0.032) % 1
  const ctx = el.getContext('2d')
  const W = el.width / dpr
  const H = el.height / dpr
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  drawScene(ctx, W, H)
}

/* ── Perspective helpers ───────────────────────────── */
function scaleAt(y, VPY, H) {
  return Math.max(0, Math.min(1, (y - VPY) / (H - VPY)))
}

function depthY(raw, VPY, H) {
  return VPY + (H - VPY) * (1 - Math.pow(1 - raw, 1.75))
}

function laneShift(y, VPY, H, W) {
  return W * 0.28 * scaleAt(y, VPY, H)
}

function gaugeAt(y, VPY, H, W) {
  return W * 0.034 * scaleAt(y, VPY, H) + 0.5
}

function bedHalfAt(y, VPY, H, W) {
  return gaugeAt(y, VPY, H, W) * 2.8 + W * 0.018 * scaleAt(y, VPY, H)
}

/* ── Main scene ────────────────────────────────────── */
function drawScene(ctx, W, H) {
  const seg = currentSegment.value
  const VPX = W / 2
  const VPY = H * 0.38
  const isDouble = (seg?.tracks || 1) >= 2
  const electrified = !!seg?.electrified

  ctx.clearRect(0, 0, W, H)

  drawSky(ctx, W, H, VPY, seg)
  drawGround(ctx, W, H, VPY, seg)
  drawDistantHills(ctx, W, H, VPY, seg)

  if (isDouble) {
    drawTrackLane(ctx, W, H, VPX, VPY, laneShift(H, VPY, H, W), trackPhase, 0.72, electrified, false)
    drawCenterDivider(ctx, W, H, VPX, VPY)
  }

  drawTrackLane(ctx, W, H, VPX, VPY, 0, trackPhase, 1, electrified, true)

  if (seg?.type !== 'station' && seg?.type !== 'switch') {
    drawScenery(ctx, W, H, VPX, VPY, isDouble)
  }

  if (seg?.type === 'station') drawStation(ctx, W, H, VPX, VPY, isDouble)
  if (seg?.type === 'zcp') drawZcp(ctx, W, H, VPX, VPY)

  if (upcomingSignal.value && distToSignal.value !== null && distToSignal.value <= SIGNAL_VIEW_M) {
    drawSignalPost(ctx, W, H, VPX, VPY, distToSignal.value, upcomingSignal.value.side, signalColor(upcomingSignal.value.signal.name))
  }
  if (upcomingStructure.value && distToStructure.value !== null && distToStructure.value <= SIGNAL_VIEW_M) {
    drawStructureMarker(ctx, W, H, VPX, VPY, distToStructure.value, upcomingStructure.value.kind)
  }

  drawCabInterior(ctx, W, H)
}

function drawSky(ctx, W, H, VPY, seg) {
  const sky = ctx.createLinearGradient(0, 0, 0, VPY)
  if (seg?.type === 'station') {
    sky.addColorStop(0, '#1a2744')
    sky.addColorStop(0.5, '#3d4f72')
    sky.addColorStop(1, '#8a9bb8')
  } else {
    // Clear daytime sky – easier to read signals against
    sky.addColorStop(0, '#4a7ab5')
    sky.addColorStop(0.4, '#6ea0d4')
    sky.addColorStop(0.75, '#a8c8e8')
    sky.addColorStop(1, '#d4e6f5')
  }
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, W, VPY)

  // Soft sun
  if (seg?.type !== 'station') {
    const sx = W * 0.78
    const sy = VPY * 0.28
    const glow = ctx.createRadialGradient(sx, sy, 2, sx, sy, 40)
    glow.addColorStop(0, 'rgba(255,240,180,0.95)')
    glow.addColorStop(0.35, 'rgba(255,220,120,0.35)')
    glow.addColorStop(1, 'rgba(255,220,120,0)')
    ctx.fillStyle = glow
    ctx.beginPath()
    ctx.arc(sx, sy, 40, 0, Math.PI * 2)
    ctx.fill()
  }

  // Parallax clouds
  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  for (let i = 0; i < 5; i++) {
    const drift = ((trackPhase * 18 + i * 40) % (W + 80)) - 40
    const cy = VPY * (0.18 + (i % 3) * 0.12)
    const cw = 28 + (i % 3) * 16
    drawCloud(ctx, drift + i * 55, cy, cw)
  }

  const haze = ctx.createLinearGradient(0, VPY - H * 0.16, 0, VPY)
  haze.addColorStop(0, 'rgba(180,200,140,0)')
  haze.addColorStop(1, 'rgba(160,190,120,0.35)')
  ctx.fillStyle = haze
  ctx.fillRect(0, VPY - H * 0.16, W, H * 0.16)
}

function drawCloud(ctx, x, y, w) {
  ctx.beginPath()
  ctx.ellipse(x, y, w * 0.55, w * 0.22, 0, 0, Math.PI * 2)
  ctx.ellipse(x + w * 0.28, y - w * 0.08, w * 0.35, w * 0.18, 0, 0, Math.PI * 2)
  ctx.ellipse(x - w * 0.25, y - w * 0.04, w * 0.3, w * 0.15, 0, 0, Math.PI * 2)
  ctx.fill()
}

function drawGround(ctx, W, H, VPY, seg) {
  const gnd = ctx.createLinearGradient(0, VPY, 0, H)
  if (seg?.type === 'station') {
    gnd.addColorStop(0, '#5a4a30')
    gnd.addColorStop(1, '#2a2010')
  } else if (seg?.slope === 'up') {
    gnd.addColorStop(0, '#5a9a48')
    gnd.addColorStop(0.5, '#3d7032')
    gnd.addColorStop(1, '#254820')
  } else {
    gnd.addColorStop(0, '#6aaf55')
    gnd.addColorStop(0.45, '#4a8a3a')
    gnd.addColorStop(1, '#2d5a28')
  }
  ctx.fillStyle = gnd
  ctx.fillRect(0, VPY, W, H - VPY)
}

function drawDistantHills(ctx, W, H, VPY, seg) {
  if (seg?.type === 'station') return
  const shift = (trackPhase * W * 0.15) % W
  // Far layer
  ctx.fillStyle = 'rgba(70,110,80,0.45)'
  ctx.beginPath()
  ctx.moveTo(0, VPY + 10)
  for (let x = -W; x <= W * 2; x += W / 10) {
    const h = 18 + Math.sin((x + shift * 0.4) * 0.012) * 22 + Math.cos((x + shift) * 0.007) * 12
    ctx.lineTo(x, VPY + 8 - h)
  }
  ctx.lineTo(W * 2, VPY + 22)
  ctx.lineTo(-W, VPY + 22)
  ctx.closePath()
  ctx.fill()
  // Near layer
  ctx.fillStyle = 'rgba(45,85,50,0.55)'
  ctx.beginPath()
  ctx.moveTo(0, VPY + 12)
  for (let x = -W; x <= W * 2; x += W / 12) {
    const h = 10 + Math.sin((x - shift * 0.8) * 0.02) * 14 + Math.cos((x - shift) * 0.011) * 8
    ctx.lineTo(x, VPY + 10 - h)
  }
  ctx.lineTo(W * 2, VPY + 24)
  ctx.lineTo(-W, VPY + 24)
  ctx.closePath()
  ctx.fill()
}

function drawTrackLane(ctx, W, H, VPX, VPY, xOff, phase, alpha, electrified, isPlayer) {
  ctx.save()
  ctx.globalAlpha = alpha

  const bedGrad = ctx.createLinearGradient(0, VPY, 0, H)
  bedGrad.addColorStop(0, isPlayer ? '#3a3020' : '#2e2818')
  bedGrad.addColorStop(0.4, '#2a2214')
  bedGrad.addColorStop(1, '#181208')

  ctx.beginPath()
  ctx.moveTo(VPX - bedHalfAt(H, VPY, H, W) + xOff, H)
  ctx.lineTo(VPX + xOff, VPY)
  ctx.lineTo(VPX + bedHalfAt(H, VPY, H, W) + xOff, H)
  ctx.closePath()
  ctx.fillStyle = bedGrad
  ctx.fill()

  // Ballast gravel speckles (fewer = smoother FPS)
  for (let i = 0; i < 28; i++) {
    const raw = (i / 28 + phase * 0.4) % 1
    const y = depthY(raw, VPY, H)
    const s = scaleAt(y, VPY, H)
    if (s < 0.12) continue
    const cx = VPX + xOff + (Math.sin(i * 7.3) * bedHalfAt(y, VPY, H, W) * 0.65)
    ctx.fillStyle = `rgba(${90 + (i % 5) * 8},${78 + (i % 4) * 6},${52 + (i % 3) * 5},${0.18 + s * 0.35})`
    ctx.fillRect(cx, y, 1 + s * 2.5, 1 + s * 1.2)
  }

  // Sleepers
  const N = 24
  for (let i = 0; i < N; i++) {
    const raw = (i / N + phase) % 1
    const y = depthY(raw, VPY, H)
    const s = scaleAt(y, VPY, H)
    const g = gaugeAt(y, VPY, H, W)
    const hw = g * 2.6 + W * 0.012 * s
    const cx = VPX + xOff
    const sh = Math.max(2, 5 * s)
    const sw = hw * 2 + g * 0.5

    ctx.fillStyle = `rgba(${55 + (i % 3) * 8},${42 + (i % 4) * 5},${28 + (i % 2) * 6},${0.4 + s * 0.55})`
    ctx.fillRect(cx - sw / 2, y - sh / 2, sw, sh)

    ctx.strokeStyle = `rgba(30,22,12,${0.2 + s * 0.3})`
    ctx.lineWidth = 0.5
    ctx.strokeRect(cx - sw / 2, y - sh / 2, sw, sh)
  }

  // Rails (two per lane)
  for (const side of [-1, 1]) {
    drawRail(ctx, VPX + xOff, VPY, H, W, side, phase, s => VPX + xOff + side * gaugeAt(s, VPY, H, W))
  }

  if (electrified) drawCatenary(ctx, VPX + xOff, VPY, H, W, phase)

  ctx.restore()
}

function drawRail(ctx, centerX, VPY, H, W, side, phase, railXFn) {
  const pts = []
  for (let i = 0; i <= 20; i++) {
    const raw = i / 20
    const y = depthY(raw, VPY, H)
    pts.push({ x: railXFn(y), y })
  }

  // Rail base (dark)
  ctx.strokeStyle = '#3a3530'
  ctx.lineWidth = Math.max(2.5, 6 * scaleAt(H, VPY, H))
  ctx.lineCap = 'round'
  ctx.beginPath()
  pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)))
  ctx.stroke()

  // Rail body (steel)
  const rg = ctx.createLinearGradient(0, VPY, 0, H)
  rg.addColorStop(0, '#6a7078')
  rg.addColorStop(0.5, '#9098a0')
  rg.addColorStop(1, '#b0b8c0')
  ctx.strokeStyle = rg
  ctx.lineWidth = Math.max(1.8, 4.5 * scaleAt(H, VPY, H))
  ctx.beginPath()
  pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y - 0.5) : ctx.lineTo(p.x, p.y - 0.5)))
  ctx.stroke()

  // Shine highlight
  ctx.strokeStyle = 'rgba(220,230,240,0.45)'
  ctx.lineWidth = Math.max(0.8, 1.2 * scaleAt(H, VPY, H))
  ctx.beginPath()
  pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x + side * 0.4, p.y - 1.2) : ctx.lineTo(p.x + side * 0.4, p.y - 1.2)))
  ctx.stroke()
}

function drawCenterDivider(ctx, W, H, VPX, VPY) {
  ctx.beginPath()
  ctx.moveTo(VPX - W * 0.02, H)
  ctx.lineTo(VPX, VPY + 2)
  ctx.lineTo(VPX + W * 0.02, H)
  ctx.closePath()
  const dg = ctx.createLinearGradient(0, VPY, 0, H)
  dg.addColorStop(0, '#4a4030')
  dg.addColorStop(1, '#2a2418')
  ctx.fillStyle = dg
  ctx.fill()
}

function drawCatenary(ctx, cx, VPY, H, W, phase) {
  const masts = 5
  for (let i = 0; i < masts; i++) {
    const raw = (i / masts + phase * 1.4) % 1
    if (raw < 0.04) continue
    const y = depthY(raw, VPY, H)
    const s = scaleAt(y, VPY, H)
    const mx = cx + W * 0.06 * s
    const mH = s * 55 + 10
    ctx.fillStyle = `rgba(55,58,62,${0.45 + s * 0.5})`
    ctx.fillRect(mx - s * 1.2, y - mH, s * 2.4, mH)
    ctx.fillRect(mx - s * 8, y - mH, s * 16, s * 2.5)

    ctx.strokeStyle = `rgba(160,165,175,${0.2 + s * 0.35})`
    ctx.lineWidth = Math.max(0.6, s * 1.2)
    ctx.beginPath()
    ctx.moveTo(mx, y - mH)
    ctx.quadraticCurveTo(mx + s * 20, y - mH - s * 8, mx + s * 35, VPY + 4)
    ctx.stroke()
  }

  ctx.strokeStyle = 'rgba(180,185,195,0.35)'
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.moveTo(cx - W * 0.08, VPY + 6)
  ctx.quadraticCurveTo(cx, VPY - 4, cx + W * 0.08, VPY + 6)
  ctx.stroke()
}

function drawScenery(ctx, W, H, VPX, VPY, isDouble) {
  const TC = 10
  for (let i = 0; i < TC; i++) {
    const raw = (i / TC + trackPhase * 2.1) % 1
    if (raw < 0.03) continue
    const y = depthY(raw, VPY, H)
    const s = scaleAt(y, VPY, H)
    const spread = isDouble ? 0.58 : 0.52
    const tH = s * 90 + 10
    const tW = s * 32 + 5
    drawTree(ctx, VPX - W * spread * s - tW * 0.5, y, tW, tH)
    drawTree(ctx, VPX + W * (spread + (isDouble ? 0.12 : 0)) * s + tW * 0.5, y, tW, tH)
  }

  const PC = 7
  for (let i = 0; i < PC; i++) {
    const raw = (i / PC + trackPhase * 1.6) % 1
    if (raw < 0.04) continue
    const y = depthY(raw, VPY, H)
    const s = scaleAt(y, VPY, H)
    const px = VPX + W * 0.22 * s + (isDouble ? W * 0.14 * s : 0)
    const pH = s * 65 + 10
    ctx.fillStyle = `rgba(62,62,68,${s * 0.8})`
    ctx.fillRect(px, y - pH, Math.max(1.5, s * 4), pH)
    ctx.fillStyle = `rgba(48,48,52,${s * 0.85})`
    ctx.fillRect(px - s * 14, y - pH, s * 32, Math.max(1.2, s * 3))
  }
}

function drawStation(ctx, W, H, VPX, VPY, isDouble) {
  const platH = (H - VPY) * 0.28
  const platY = H - platH - H * 0.18

  ctx.fillStyle = '#524030'
  ctx.fillRect(0, platY, W * 0.42, H)
  ctx.fillStyle = '#8a7050'
  ctx.fillRect(0, platY, W * 0.42, 6)
  ctx.fillStyle = '#706050'
  for (let t = 0; t < 8; t++) {
    ctx.fillRect(W * 0.38, platY + 8 + t * ((H - platY) / 9), 4, 3)
  }

  const bY = VPY + (H - VPY) * 0.04
  const bH = (H - VPY) * 0.52
  const bW = W * 0.26
  const bX = W * 0.04
  ctx.fillStyle = '#3a2c1c'
  ctx.fillRect(bX, bY, bW, bH)
  ctx.fillStyle = '#7a1818'
  ctx.beginPath()
  ctx.moveTo(bX - 6, bY)
  ctx.lineTo(bX + bW / 2, VPY - 4)
  ctx.lineTo(bX + bW + 6, bY)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = 'rgba(240,200,80,0.9)'
  const wW = (bW - 24) / 3 * 0.6
  for (let wi = 0; wi < 3; wi++) {
    ctx.fillRect(bX + 10 + wi * (bW - 24) / 3, bY + bH * 0.2, wW, bH * 0.2)
  }

  ctx.fillStyle = 'rgba(200,200,210,0.35)'
  ctx.font = `bold ${Math.round(W * 0.045)}px sans-serif`
  ctx.textAlign = 'center'
  ctx.fillText('ZAGREB GK', bX + bW / 2, bY + bH * 0.72)

  if (isDouble) {
    ctx.fillStyle = '#3a3530'
    ctx.fillRect(W * 0.44, platY + platH * 0.3, W * 0.12, 4)
  }
}

function drawZcp(ctx, W, H, VPX, VPY) {
  const y = depthY(0.55, VPY, H)
  const s = scaleAt(y, VPY, H)
  const armLen = W * 0.3 * s
  const segW = armLen / 7
  for (let s2 = 0; s2 < 7; s2++) {
    ctx.fillStyle = s2 % 2 === 0 ? '#cc2020' : '#e8e8e8'
    ctx.fillRect(VPX - armLen + s2 * segW, y - 4 * s, segW, 8 * s)
  }
  const flash = Math.floor(Date.now() / 500) % 2
  ctx.fillStyle = flash ? '#ff2020' : '#550000'
  ctx.beginPath()
  ctx.arc(VPX - armLen - 12 * s, y, 8 * s, 0, Math.PI * 2)
  ctx.fill()
}

function drawSignalPost(ctx, W, H, VPX, VPY, distM, side, colorHex) {
  const raw = 1 - Math.max(0, Math.min(SIGNAL_VIEW_M, distM)) / SIGNAL_VIEW_M
  const y = depthY(raw, VPY, H)
  const s = scaleAt(y, VPY, H)
  const g = gaugeAt(y, VPY, H, W)
  const dir = side === 'right' ? 1 : -1
  const px = VPX + dir * (g * 2.8 + s * 16)
  const postH = 10 + s * 78

  ctx.fillStyle = `rgba(70,70,75,${0.5 + s * 0.5})`
  ctx.fillRect(px - Math.max(0.8, s * 1.6), y - postH, Math.max(1.4, s * 3.2), postH)

  ctx.fillStyle = `rgba(20,20,25,${0.65 + s * 0.35})`
  const headW = 6 + s * 10
  const headH = 10 + s * 16
  ctx.fillRect(px - headW / 2, y - postH - headH, headW, headH)

  const lampCy = y - postH - headH * 0.45
  const lampR = 2.5 + s * 5
  ctx.save()
  ctx.shadowColor = colorHex
  ctx.shadowBlur = 6 + s * 22
  ctx.fillStyle = colorHex
  ctx.beginPath()
  ctx.arc(px, lampCy, lampR, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function drawStructureMarker(ctx, W, H, VPX, VPY, distM, kind) {
  const raw = 1 - Math.max(0, Math.min(SIGNAL_VIEW_M, distM)) / SIGNAL_VIEW_M
  const y = depthY(raw, VPY, H)
  const s = scaleAt(y, VPY, H)
  if (kind === 'switch') {
    const g = gaugeAt(y, VPY, H, W)
    ctx.strokeStyle = `rgba(180,160,80,${0.35 + s * 0.55})`
    ctx.lineWidth = Math.max(1.5, 3 * s)
    ctx.beginPath()
    ctx.moveTo(VPX - g, y)
    ctx.lineTo(VPX + g * 2.5, y - s * 12)
    ctx.stroke()
  } else {
    ctx.save()
    ctx.globalAlpha = 0.4 + s * 0.6
    ctx.font = `bold ${Math.round(8 + s * 18)}px sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText('🚧', VPX + s * 28, y - s * 4)
    ctx.restore()
  }
}

function drawTree(ctx, x, y, w, h) {
  const s = Math.min(1, h / 80)
  ctx.fillStyle = `rgba(70,52,28,${0.55 + s * 0.4})`
  ctx.fillRect(x - w * 0.1, y - h * 0.28, w * 0.2, h * 0.28)
  // Layered canopy for depth
  const layers = [
    [1.0, 0.55, 34, 92, 42],
    [0.72, 0.42, 48, 118, 55],
    [0.48, 0.3, 62, 138, 68],
  ]
  for (const [dy, sc, r, g, b] of layers) {
    ctx.fillStyle = `rgba(${r},${g},${b},${0.55 + s * 0.4})`
    ctx.beginPath()
    ctx.moveTo(x, y - h * dy)
    ctx.lineTo(x - w * sc, y - h * (dy - 0.28))
    ctx.lineTo(x + w * sc, y - h * (dy - 0.28))
    ctx.closePath()
    ctx.fill()
  }
}

/* ── Cab interior (drawn on canvas) ─────────────────── */
function drawCabInterior(ctx, W, H) {
  const dashTop = H * 0.78

  // Windshield glass reflection
  const refl = ctx.createLinearGradient(0, 0, W * 0.6, H * 0.5)
  refl.addColorStop(0, 'rgba(180,210,240,0.04)')
  refl.addColorStop(0.5, 'rgba(255,255,255,0.02)')
  refl.addColorStop(1, 'rgba(180,210,240,0)')
  ctx.fillStyle = refl
  ctx.fillRect(W * 0.08, 0, W * 0.84, dashTop)

  // Left A-pillar
  ctx.fillStyle = '#0c0c10'
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(W * 0.11, 0)
  ctx.lineTo(W * 0.17, dashTop)
  ctx.lineTo(0, H)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.04)'
  ctx.fillRect(W * 0.105, 0, 3, dashTop)

  // Right A-pillar
  ctx.fillStyle = '#0c0c10'
  ctx.beginPath()
  ctx.moveTo(W, 0)
  ctx.lineTo(W * 0.89, 0)
  ctx.lineTo(W * 0.83, dashTop)
  ctx.lineTo(W, H)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.04)'
  ctx.fillRect(W * 0.892, 0, 3, dashTop)

  // Top windshield frame
  ctx.fillStyle = '#141418'
  ctx.fillRect(W * 0.11, 0, W * 0.78, H * 0.035)
  ctx.fillStyle = 'rgba(255,255,255,0.06)'
  ctx.fillRect(W * 0.11, H * 0.034, W * 0.78, 1)

  // Rear-view mirror
  const mx = W * 0.5
  ctx.fillStyle = '#1a1a20'
  ctx.fillRect(mx - 22, H * 0.04, 44, 14)
  ctx.fillStyle = 'rgba(100,120,140,0.35)'
  ctx.fillRect(mx - 18, H * 0.045, 36, 8)

  // Sun visors
  ctx.fillStyle = '#18181c'
  ctx.beginPath()
  ctx.moveTo(W * 0.12, H * 0.035)
  ctx.lineTo(W * 0.38, H * 0.035)
  ctx.lineTo(W * 0.34, H * 0.12)
  ctx.lineTo(W * 0.12, H * 0.1)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(W * 0.62, H * 0.035)
  ctx.lineTo(W * 0.88, H * 0.035)
  ctx.lineTo(W * 0.88, H * 0.1)
  ctx.lineTo(W * 0.66, H * 0.12)
  ctx.closePath()
  ctx.fill()

  // Dashboard body
  const dash = ctx.createLinearGradient(0, dashTop, 0, H)
  dash.addColorStop(0, '#1e1e28')
  dash.addColorStop(0.3, '#12121a')
  dash.addColorStop(1, '#080810')
  ctx.fillStyle = dash
  ctx.beginPath()
  ctx.moveTo(W * 0.14, dashTop)
  ctx.quadraticCurveTo(W * 0.5, dashTop - H * 0.04, W * 0.86, dashTop)
  ctx.lineTo(W, H)
  ctx.lineTo(0, H)
  ctx.closePath()
  ctx.fill()

  // Dashboard top edge highlight
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(W * 0.14, dashTop)
  ctx.quadraticCurveTo(W * 0.5, dashTop - H * 0.04, W * 0.86, dashTop)
  ctx.stroke()

  // Instrument cluster recess (visual hint above HTML controls)
  ctx.fillStyle = '#0a0a0e'
  ctx.beginPath()
  ctx.ellipse(W * 0.5, dashTop + H * 0.06, W * 0.14, H * 0.045, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'
  ctx.lineWidth = 1
  ctx.stroke()

  // Side console hints
  for (const sx of [W * 0.2, W * 0.8]) {
    ctx.fillStyle = '#16161e'
    ctx.fillRect(sx - 18, dashTop + 4, 36, H * 0.08)
    ctx.fillStyle = 'rgba(255,255,255,0.05)'
    for (let r = 0; r < 3; r++) {
      ctx.beginPath()
      ctx.arc(sx - 8 + r * 8, dashTop + 14, 2, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // Windshield wiper hint (subtle)
  ctx.strokeStyle = 'rgba(255,255,255,0.03)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(W * 0.35, dashTop - 2)
  ctx.quadraticCurveTo(W * 0.42, dashTop - H * 0.18, W * 0.48, dashTop - H * 0.28)
  ctx.stroke()
}

/* ── Close-up signal photo ──────────────────────────── */
const SIGNAL_PHOTO_DIST = 130

const sigScale = computed(() => {
  const d = distToSignal.value
  if (d === null || d > SIGNAL_PHOTO_DIST) return 0
  return Math.pow(1 - d / SIGNAL_PHOTO_DIST, 1.6)
})

const sigSignalObj = computed(() => upcomingSignal.value?.signal || null)

const sigStyle = computed(() => {
  const s = sigScale.value
  if (s <= 0) return { display: 'none' }
  const sz = Math.round(s * 100 + 16)
  const side = upcomingSignal.value?.side === 'left' ? 28 : 58
  return {
    display: 'block',
    position: 'absolute',
    top: `${Math.round(26 - s * 8)}%`,
    left: `calc(${side}% - ${sz / 2}px)`,
    width: `${sz}px`,
    opacity: Math.min(1, s * 2.6),
    pointerEvents: 'none',
    filter: `drop-shadow(0 0 ${Math.round(s * 10)}px rgba(255,200,50,0.5))`,
    zIndex: 5,
  }
})

/* ── Keyboard controls ─────────────────────────────── */
function onKeyDown(e) {
  if (e.code === 'KeyP') {
    e.preventDefault()
    if (phase.value === 'playing') pauseGame()
    else if (phase.value === 'paused' && !activeQuiz.value) resumeGame()
    return
  }
  if (phase.value !== 'playing') return
  if (['ArrowUp', 'KeyW'].includes(e.code)) {
    e.preventDefault()
    setThrottle(throttle.value + 6)
  } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
    e.preventDefault()
    setBrake(brake.value + 8)
  } else if (e.code === 'Space') {
    e.preventDefault()
    playHorn()
  } else if (e.code === 'KeyB') {
    e.preventDefault()
    emergencyBrake()
  }
}

/* ── Drag controls ─────────────────────────────────── */
let dragType = null
let dragStartY = 0
let dragStartVal = 0

function startDrag(type, e) {
  e.preventDefault()
  dragType = type
  dragStartY = e.clientY
  dragStartVal = type === 'throttle' ? throttle.value : brake.value
  window.addEventListener('pointermove', onDrag, { passive: false })
  window.addEventListener('pointerup', endDrag)
  window.addEventListener('pointercancel', endDrag)
}

function onDrag(e) {
  e.preventDefault()
  const delta = ((dragStartY - e.clientY) / 110) * 100
  const val = Math.round(Math.max(0, Math.min(100, dragStartVal + delta)))
  if (dragType === 'throttle') setThrottle(val)
  else setBrake(val)
}

function endDrag() {
  dragType = null
  window.removeEventListener('pointermove', onDrag)
  window.removeEventListener('pointerup', endDrag)
  window.removeEventListener('pointercancel', endDrag)
}

const speedColor = computed(() => {
  const limit = currentSegment.value?.speedLimit || 80
  if (speed.value > limit + 5) return '#f87171'
  if (speed.value > limit * 0.85) return '#fbbf24'
  return '#34d399'
})
</script>

<template>
  <div class="game">
    <div class="cab">
      <canvas ref="sceneEl" class="cab__canvas" />

      <div :style="sigStyle">
        <SignalVisual v-if="sigSignalObj" :visual="sigSignalObj.visual" :alt="sigSignalObj.name" :show-badges="false" />
      </div>

      <!-- Start -->
      <div v-if="phase === 'menu'" class="overlay">
        <p class="overlay__emoji">🚂</p>
        <h2 class="overlay__title">Vožnja lokomotive</h2>
        <p class="overlay__text">Pazi na signale i brzinu. Točni odgovori daju bodove.</p>
        <button type="button" class="overlay__btn" @click="startGame">Kreni</button>
      </div>

      <!-- End -->
      <div v-else-if="phase === 'finished'" class="overlay">
        <p class="overlay__emoji">🏁</p>
        <h2 class="overlay__title">Gotovo</h2>
        <p class="overlay__score">{{ score }} bodova</p>
        <p class="overlay__text">{{ Math.round(distance) }} m · {{ violations }} prekršaja</p>
        <button type="button" class="overlay__btn" @click="startGame">Ponovi</button>
      </div>

      <!-- Pause -->
      <div v-else-if="phase === 'paused' && !activeQuiz" class="overlay overlay--soft">
        <h2 class="overlay__title">Pauza</h2>
        <button type="button" class="overlay__btn" @click="resumeGame">Nastavi</button>
      </div>

      <!-- Minimal HUD -->
      <template v-if="phase === 'playing' || phase === 'paused'">
        <div class="progress"><i :style="{ width: `${progress}%` }" /></div>

        <div class="chip chip--left">
          <strong>{{ currentSegment?.speedLimit || 80 }}</strong>
          <span>km/h max</span>
        </div>

        <div class="chip chip--right">
          <strong>{{ score }}</strong>
          <span>bod</span>
          <button
            v-if="phase === 'playing'"
            type="button"
            class="chip__btn"
            aria-label="Pauza"
            @click="pauseGame"
          >⏸</button>
          <button
            v-else
            type="button"
            class="chip__btn"
            aria-label="Nastavi"
            @click="resumeGame"
          >▶</button>
        </div>

        <div v-if="distToSignal !== null && distToSignal < 280" class="toast">
          Signal {{ Math.round(distToSignal) }} m
          <template v-if="upcomingSignal?.signal?.name"> · {{ upcomingSignal.signal.name }}</template>
        </div>
        <div v-else-if="distToEvent !== null && distToEvent < 200" class="toast toast--warn">
          Događaj {{ Math.round(distToEvent) }} m
        </div>

        <div v-if="messages.length" class="msgs">
          <p
            v-for="msg in messages.slice(0, 1)"
            :key="msg.id"
            class="msgs__item"
            :data-type="msg.type"
          >{{ msg.text }}</p>
        </div>
      </template>
    </div>

    <!-- Simple controls -->
    <div v-if="phase === 'playing' || phase === 'paused'" class="dash">
      <div class="dash__row">
        <!-- Gas -->
        <div class="ctrl">
          <button type="button" class="step step--gas" @click="setThrottle(throttle + 15)">+</button>
          <div class="bar" @pointerdown="startDrag('throttle', $event)">
            <div class="bar__fill bar__fill--gas" :style="{ height: `${throttle}%` }" />
          </div>
          <button type="button" class="step step--gas" @click="setThrottle(throttle - 15)">−</button>
          <span class="ctrl__label">Gas {{ throttle }}%</span>
        </div>

        <!-- Speed -->
        <div class="speed">
          <p class="speed__num" :style="{ color: speedColor }">{{ Math.round(speed) }}</p>
          <p class="speed__unit">km/h</p>
          <p class="speed__limit">limit {{ currentSegment?.speedLimit || 80 }}</p>
          <div class="speed__actions">
            <button type="button" class="act" :class="{ 'act--on': horn }" @click="playHorn">Sirena</button>
            <button type="button" class="act act--stop" @click="emergencyBrake">Stop</button>
          </div>
        </div>

        <!-- Brake -->
        <div class="ctrl">
          <button type="button" class="step step--brake" @click="setBrake(brake + 20)">+</button>
          <div class="bar" @pointerdown="startDrag('brake', $event)">
            <div class="bar__fill bar__fill--brake" :style="{ height: `${brake}%` }" />
          </div>
          <button type="button" class="step step--brake" @click="setBrake(brake - 20)">−</button>
          <span class="ctrl__label">Koč {{ brake }}%</span>
        </div>
      </div>

      <div class="dash__meta">
        <span>{{ Math.round(distance) }} / {{ route?.totalM || 0 }} m</span>
        <span>Prekršaji {{ violations }}</span>
        <span v-if="streak >= 2">Niz {{ streak }}</span>
      </div>
    </div>

    <GameQuizPopup :quiz="activeQuiz" :step="quizStep" @answer="answerQuiz" @skip="skipQuiz" />
  </div>
</template>

<style scoped>
/* Locked dark cab UI — ignores site light-theme remaps */
.game {
  --g-bg: #111318;
  --g-panel: #1a1d24;
  --g-line: #2a2f3a;
  --g-text: #f1f5f9;
  --g-muted: #94a3b8;
  --g-gas: #22c55e;
  --g-brake: #ef4444;
  --g-accent: #0d9488;
  width: 100%;
  user-select: none;
  -webkit-user-select: none;
}

.cab {
  position: relative;
  height: min(460px, 58vw);
  min-height: 280px;
  border-radius: 16px 16px 0 0;
  overflow: hidden;
  background: #6ea0d4;
  border: 1px solid var(--g-line);
  border-bottom: 0;
}

.cab__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.progress {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(0, 0, 0, 0.25);
  z-index: 5;
  pointer-events: none;
}
.progress i {
  display: block;
  height: 100%;
  background: var(--g-accent);
  transition: width 0.4s ease;
}

.overlay {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px;
  text-align: center;
  background: rgba(10, 12, 16, 0.78);
  color: var(--g-text);
}
.overlay--soft { background: rgba(10, 12, 16, 0.6); }
.overlay__emoji { font-size: 48px; line-height: 1; margin: 0; }
.overlay__title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
}
.overlay__text {
  margin: 0;
  max-width: 280px;
  font-size: 0.9rem;
  line-height: 1.4;
  color: #cbd5e1;
}
.overlay__score {
  margin: 0;
  font-size: 2.25rem;
  font-weight: 800;
  color: #fbbf24;
}
.overlay__btn {
  margin-top: 8px;
  min-width: 160px;
  padding: 14px 28px;
  border: 0;
  border-radius: 12px;
  background: var(--g-accent);
  color: #fff;
  font-size: 1.05rem;
  font-weight: 700;
}
.overlay__btn:active { transform: scale(0.97); }

.chip {
  position: absolute;
  top: 10px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: 12px;
}
.chip--left { left: 10px; }
.chip--right { right: 10px; }
.chip strong { font-size: 15px; font-variant-numeric: tabular-nums; }
.chip span { color: #cbd5e1; }
.chip__btn {
  width: 28px;
  height: 28px;
  margin-left: 2px;
  border: 0;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  font-size: 12px;
  line-height: 1;
}

.toast {
  position: absolute;
  top: 48px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  max-width: 90%;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.6);
  color: #e2e8f0;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
}
.toast--warn { color: #fde68a; }

.msgs {
  position: absolute;
  left: 10px;
  bottom: 12px;
  z-index: 10;
  max-width: 70%;
  pointer-events: none;
}
.msgs__item {
  margin: 0;
  padding: 8px 10px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.6);
  color: #e2e8f0;
  font-size: 12px;
  font-weight: 600;
}
.msgs__item[data-type='ok'] { color: #86efac; }
.msgs__item[data-type='bad'],
.msgs__item[data-type='warn'] { color: #fca5a5; }
.msgs__item[data-type='quiz'] { color: #fde68a; }

.dash {
  background: var(--g-bg);
  border: 1px solid var(--g-line);
  border-top: 0;
  border-radius: 0 0 16px 16px;
  color: var(--g-text);
}

.dash__row {
  display: grid;
  grid-template-columns: 1fr 1.35fr 1fr;
  gap: 8px;
  padding: 14px 12px 10px;
}

.ctrl {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.ctrl__label {
  font-size: 11px;
  color: var(--g-muted);
  font-variant-numeric: tabular-nums;
}

.step {
  width: 48px;
  height: 40px;
  border: 1px solid var(--g-line);
  border-radius: 10px;
  background: var(--g-panel);
  color: var(--g-text);
  font-size: 22px;
  font-weight: 700;
  line-height: 1;
}
.step:active { transform: scale(0.96); }
.step--gas { color: var(--g-gas); border-color: rgba(34, 197, 94, 0.35); }
.step--brake { color: var(--g-brake); border-color: rgba(239, 68, 68, 0.35); }

.bar {
  position: relative;
  width: 28px;
  height: 88px;
  border-radius: 14px;
  background: #0a0c10;
  border: 1px solid var(--g-line);
  overflow: hidden;
  touch-action: none;
  cursor: ns-resize;
}
.bar__fill {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  transition: height 50ms linear;
}
.bar__fill--gas { background: var(--g-gas); }
.bar__fill--brake { background: var(--g-brake); }

.speed {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 4px 0;
}
.speed__num {
  margin: 0;
  font-size: clamp(2.4rem, 9vw, 3.2rem);
  font-weight: 800;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
.speed__unit {
  margin: 0;
  font-size: 12px;
  color: var(--g-muted);
}
.speed__limit {
  margin: 0 0 8px;
  font-size: 12px;
  color: #64748b;
}
.speed__actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  width: 100%;
  max-width: 180px;
}
.act {
  padding: 10px 8px;
  border: 1px solid var(--g-line);
  border-radius: 10px;
  background: var(--g-panel);
  color: var(--g-text);
  font-size: 13px;
  font-weight: 700;
}
.act:active { transform: scale(0.96); }
.act--on { background: #422006; border-color: #b45309; color: #fbbf24; }
.act--stop { background: #3f1212; border-color: #991b1b; color: #fca5a5; }

.dash__meta {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 14px 12px;
  font-size: 12px;
  color: var(--g-muted);
  font-variant-numeric: tabular-nums;
  border-top: 1px solid var(--g-line);
}
</style>

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

const trackLabel = computed(() => {
  const t = currentSegment.value?.tracks || 1
  return t >= 2 ? 'Dvokolosje' : 'Jednokolosje'
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

/* ── Speedometer ───────────────────────────────────── */
const needleRot = computed(() => -90 + (Math.min(speed.value, 120) / 120) * 180)
const arcDash = computed(() => `${(Math.min(speed.value, 120) / 120) * 173} 173`)

const speedColor = computed(() => {
  const limit = currentSegment.value?.speedLimit || 80
  if (speed.value > limit + 5) return '#f87171'
  if (speed.value > limit * 0.85) return '#fbbf24'
  return '#34d399'
})
</script>

<template>
  <div class="w-full select-none">
    <!-- Cab viewport -->
    <div class="cab-viewport relative rounded-2xl overflow-hidden border border-slate-600/60 shadow-2xl shadow-black/50">
      <canvas ref="sceneEl" class="cab-canvas absolute inset-0 w-full h-full" />

      <!-- Signal close-up (above cab frame) -->
      <div :style="sigStyle">
        <SignalVisual v-if="sigSignalObj" :visual="sigSignalObj.visual" :alt="sigSignalObj.name" :show-badges="false" />
      </div>

      <!-- MENU -->
      <div
        v-if="phase === 'menu'"
        class="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 gap-5 bg-black/50 backdrop-blur-[2px]"
      >
        <div class="text-6xl drop-shadow-lg" style="animation: bounce 1.2s infinite alternate">🚂</div>
        <div>
          <h2 class="text-2xl font-bold text-white mb-1 drop-shadow">Vožnja lokomotive</h2>
          <p class="text-slate-200/90 text-sm leading-relaxed max-w-sm">
            Vozi iz kabine: pazi na signale, brzinu i ŽCP. Točni odgovori na kvizu daju bodove!
          </p>
        </div>
        <div class="flex flex-wrap justify-center gap-2 text-xs">
          <span class="px-2.5 py-1 rounded-lg bg-black/45 text-slate-200 border border-white/15">🛤 Dvokolosje</span>
          <span class="px-2.5 py-1 rounded-lg bg-black/45 text-slate-200 border border-white/15">🚦 Signali</span>
          <span class="px-2.5 py-1 rounded-lg bg-black/45 text-slate-200 border border-white/15">🏭 Kolodvor</span>
          <span class="px-2.5 py-1 rounded-lg bg-black/45 text-slate-200 border border-white/15">⚡ Elektrifikacija</span>
        </div>
        <p class="text-[11px] text-slate-300/80">↑↓ gas/kočnica · Space sirena · P pauza · B hitna kočnica</p>
        <button type="button" class="btn-primary text-base px-8 shadow-xl" @click="startGame">
          🎮 Kreni vožnju
        </button>
      </div>

      <!-- FINISHED -->
      <div
        v-else-if="phase === 'finished'"
        class="absolute inset-0 z-20 flex flex-col items-center justify-center text-center gap-4 bg-black/75 backdrop-blur-sm"
      >
        <div class="text-5xl">🏁</div>
        <h2 class="text-2xl font-bold text-white">Vožnja završena!</h2>
        <p class="text-4xl font-bold neon-text">{{ score }} bodova</p>
        <p class="text-slate-400 text-sm">{{ Math.round(distance) }} m · {{ violations }} prekršaja</p>
        <button type="button" class="btn-primary px-8 mt-2" @click="startGame">🔄 Još jednom</button>
      </div>

      <!-- PAUSE overlay -->
      <div
        v-if="phase === 'paused' && !activeQuiz"
        class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-black/55 backdrop-blur-[2px]"
      >
        <p class="text-2xl font-bold text-white">⏸ Pauza</p>
        <button type="button" class="btn-primary px-8" @click="resumeGame">Nastavi</button>
      </div>

      <!-- HUD -->
      <template v-if="phase === 'playing' || phase === 'paused'">
        <div class="absolute top-0 inset-x-0 h-1.5 z-10 pointer-events-none overflow-hidden bg-black/30">
          <div class="h-full bg-gradient-to-r from-sky-400 via-emerald-400 to-amber-400 transition-all duration-500" :style="{ width: `${progress}%` }" />
        </div>

        <div class="absolute top-3 left-3 z-10 flex flex-col gap-1.5 max-w-[48%]">
          <div v-if="currentSegment" class="bg-black/55 backdrop-blur-md rounded-xl px-3 py-2 border border-white/10 pointer-events-none">
            <p class="text-white text-xs font-semibold leading-tight">{{ currentSegment.label }}</p>
            <p class="text-slate-300/80 text-[11px]">
              max {{ currentSegment.speedLimit }} km/h · {{ trackLabel }}
              <span v-if="currentSegment.slope === 'up'"> · ⬆</span>
              <span v-if="currentSegment.slope === 'down'"> · ⬇</span>
              <span v-if="currentSegment.electrified"> · ⚡</span>
            </p>
          </div>
          <!-- Messages: side stack, not covering tracks -->
          <div class="space-y-1 pointer-events-none">
            <p
              v-for="msg in messages.slice(0, 2)"
              :key="msg.id"
              class="text-[11px] px-2.5 py-1.5 rounded-lg backdrop-blur-md font-medium shadow-lg"
              :class="{
                'bg-emerald-900/80 text-emerald-200 border border-emerald-500/30': msg.type === 'ok',
                'bg-rose-900/80 text-rose-200 border border-rose-500/30': msg.type === 'bad' || msg.type === 'warn',
                'bg-amber-900/80 text-amber-100 border border-amber-500/30': msg.type === 'quiz',
                'bg-slate-900/75 text-slate-200 border border-white/10': msg.type === 'info',
              }"
            >{{ msg.text }}</p>
          </div>
        </div>

        <div class="absolute top-3 right-3 z-10 flex flex-col items-end gap-1.5">
          <div class="bg-black/55 backdrop-blur-md rounded-xl px-3 py-2 text-right border border-white/10 pointer-events-none">
            <p class="text-[10px] text-slate-400 leading-none">Bodovi</p>
            <p class="text-xl font-bold text-amber-300 leading-tight tabular-nums">{{ score }}</p>
          </div>
          <div v-if="streak >= 2" class="bg-amber-950/70 backdrop-blur-sm rounded-lg px-2.5 py-1 border border-amber-500/25 pointer-events-none">
            <p class="text-sm font-bold text-amber-300">🔥{{ streak }}</p>
          </div>
          <div class="flex gap-1.5 pointer-events-auto">
            <button
              v-if="phase === 'playing'"
              type="button"
              class="hud-action"
              title="Pauza (P)"
              @click="pauseGame"
            >⏸</button>
            <button
              v-else-if="phase === 'paused' && !activeQuiz"
              type="button"
              class="hud-action"
              title="Nastavi (P)"
              @click="resumeGame"
            >▶</button>
            <button
              type="button"
              class="hud-action hud-action--danger"
              title="Hitna kočnica (B)"
              @click="emergencyBrake"
            >🛑</button>
          </div>
        </div>

        <div
          v-if="distToSignal !== null && distToSignal < 280"
          class="absolute top-14 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
        >
          <div class="bg-sky-950/80 backdrop-blur-md border border-sky-400/35 rounded-full px-3.5 py-1 shadow-lg">
            <p class="text-sky-200 font-semibold text-[11px] whitespace-nowrap">
              🚦 Signal · {{ Math.round(distToSignal) }} m
              <span v-if="upcomingSignal?.signal?.name" class="opacity-80"> · {{ upcomingSignal.signal.name }}</span>
            </p>
          </div>
        </div>
        <div
          v-else-if="distToEvent !== null && distToEvent < 200"
          class="absolute top-14 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
        >
          <div class="bg-amber-950/80 backdrop-blur-md border border-amber-500/40 rounded-full px-3.5 py-1 animate-pulse">
            <p class="text-amber-200 font-semibold text-[11px]">⚠️ Događaj · {{ Math.round(distToEvent) }} m</p>
          </div>
        </div>
      </template>
    </div>

    <!-- Driver console (continues cab visually) -->
    <div
      v-if="phase === 'playing' || phase === 'paused'"
      class="driver-console relative -mt-1 rounded-b-2xl border border-t-0 border-slate-600/50 overflow-hidden"
    >
      <div class="console-grid grid grid-cols-3 divide-x divide-slate-700/60">

        <!-- Throttle -->
        <div class="console-panel flex flex-col items-center gap-2 px-3 py-4">
          <p class="console-label text-emerald-400">GAS</p>
          <p class="text-[10px] text-emerald-500/70 tabular-nums">{{ throttle }}%</p>
          <div class="lever-well relative cursor-row-resize touch-none" @pointerdown="startDrag('throttle', $event)">
            <div class="lever-track" />
            <div class="lever-fill lever-fill--gas" :style="{ height: `${throttle}%` }" />
            <div class="lever-knob lever-knob--gas" :style="{ bottom: `calc(${throttle}% - 14px)` }">
              <span /><span /><span />
            </div>
          </div>
          <div class="flex gap-1">
            <button type="button" class="console-btn console-btn--gas" @click="setThrottle(throttle - 10)">−</button>
            <button type="button" class="console-btn console-btn--neutral" @click="setThrottle(0)">0</button>
            <button type="button" class="console-btn console-btn--gas" @click="setThrottle(throttle + 10)">+</button>
          </div>
        </div>

        <!-- Speedometer -->
        <div class="console-panel flex flex-col items-center justify-center gap-2 px-3 py-3">
          <div class="gauge-bezel w-full max-w-[168px] p-2 rounded-2xl">
            <svg viewBox="0 0 120 75" class="w-full">
              <defs>
                <linearGradient id="spGrd" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#34d399" />
                  <stop offset="55%" stop-color="#fbbf24" />
                  <stop offset="100%" stop-color="#f87171" />
                </linearGradient>
              </defs>
              <path d="M 7 68 A 53 53 0 0 0 113 68" fill="none" stroke="#0a0c14" stroke-width="12" stroke-linecap="round" />
              <path d="M 7 68 A 53 53 0 0 0 113 68" fill="none" stroke="#1a2035" stroke-width="10" stroke-linecap="round" />
              <path d="M 7 68 A 53 53 0 0 0 113 68" fill="none" stroke="url(#spGrd)" stroke-width="8" stroke-linecap="round" :stroke-dasharray="arcDash" />
              <g v-for="(n, i) in [0, 1, 2, 3, 4]" :key="i">
                <line
                  :x1="60 + 47 * Math.cos(Math.PI + (i / 4) * Math.PI)"
                  :y1="68 - 47 * Math.sin((i / 4) * Math.PI)"
                  :x2="60 + 39 * Math.cos(Math.PI + (i / 4) * Math.PI)"
                  :y2="68 - 39 * Math.sin((i / 4) * Math.PI)"
                  stroke="#475569" stroke-width="1.5"
                />
              </g>
              <g :transform="`rotate(${needleRot}, 60, 68)`">
                <line x1="60" y1="68" x2="60" y2="20" :stroke="speedColor" stroke-width="2.5" stroke-linecap="round" />
              </g>
              <circle cx="60" cy="68" r="6" fill="#0a0c10" stroke="#64748b" stroke-width="1.5" />
            </svg>
            <div class="text-center -mt-1">
              <span class="text-2xl font-bold tabular-nums" :style="{ color: speedColor }">{{ Math.round(speed) }}</span>
              <span class="text-xs text-slate-500 ml-1">km/h</span>
            </div>
            <p class="text-center text-[10px] text-slate-600">limit {{ currentSegment?.speedLimit || 80 }}</p>
          </div>
          <div class="flex w-full gap-1.5">
            <button
              type="button"
              class="horn-btn flex-1 py-2 rounded-xl border font-bold text-lg transition-all active:scale-95"
              :class="horn ? 'horn-btn--active' : ''"
              title="Sirena (Space)"
              @click="playHorn"
            >📯</button>
            <button
              type="button"
              class="eb-btn flex-1 py-2 rounded-xl border font-bold text-xs transition-all active:scale-95"
              title="Hitna kočnica (B)"
              @click="emergencyBrake"
            >🛑 EB</button>
          </div>
        </div>

        <!-- Brake -->
        <div class="console-panel flex flex-col items-center gap-2 px-3 py-4">
          <p class="console-label text-rose-400">KOČNICA</p>
          <p class="text-[10px] text-rose-500/70 tabular-nums">{{ brake }}%</p>
          <div class="lever-well relative cursor-row-resize touch-none" @pointerdown="startDrag('brake', $event)">
            <div class="lever-track" />
            <div class="lever-fill lever-fill--brake" :style="{ height: `${brake}%` }" />
            <div class="lever-knob lever-knob--brake" :style="{ bottom: `calc(${brake}% - 14px)` }">
              <span /><span /><span />
            </div>
          </div>
          <div class="flex gap-1">
            <button type="button" class="console-btn console-btn--brake" @click="setBrake(brake - 15)">−</button>
            <button type="button" class="console-btn console-btn--neutral" @click="setBrake(0)">0</button>
            <button type="button" class="console-btn console-btn--brake" @click="setBrake(brake + 15)">+</button>
          </div>
        </div>
      </div>

      <div class="console-status px-3 py-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[11px] text-slate-500 border-t border-slate-700/40">
        <span>Prekršaji: <span class="text-rose-400 font-semibold">{{ violations }}</span></span>
        <span class="hidden sm:inline text-slate-600">↑↓ gas/koč · Space sirena · P pauza · B EB</span>
        <span class="tabular-nums">{{ Math.round(distance) }} / {{ route?.totalM || 0 }} m</span>
        <span>Niz: <span class="text-amber-500 font-semibold">{{ streak }}</span></span>
      </div>
    </div>

    <GameQuizPopup :quiz="activeQuiz" :step="quizStep" @answer="answerQuiz" @skip="skipQuiz" />
  </div>
</template>

<style scoped>
.cab-viewport {
  height: min(480px, 62vw);
  min-height: 320px;
  background: #6ea0d4;
}

.hud-action {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  font-size: 14px;
  line-height: 1;
  display: grid;
  place-items: center;
  transition: background 0.15s, transform 0.1s;
}
.hud-action:active { transform: scale(0.94); }
.hud-action:hover { background: rgba(0, 0, 0, 0.75); }
.hud-action--danger {
  border-color: rgba(248, 113, 113, 0.45);
}

.eb-btn {
  background: linear-gradient(180deg, #3f1212, #1a0808);
  border-color: #7f1d1d;
  color: #fca5a5;
}
.eb-btn:hover { border-color: #f87171; }

.cab-canvas {
  display: block;
}

@keyframes bounce {
  from { transform: translateY(0); }
  to { transform: translateY(-12px); }
}

.driver-console {
  background: linear-gradient(180deg, #14141e 0%, #0a0a12 40%, #060608 100%);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 24px rgba(0,0,0,0.5);
}

.console-panel {
  background: linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%);
}

.console-label {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.lever-well {
  height: 112px;
  width: 44px;
}

.lever-track {
  position: absolute;
  top: 8px;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  border-radius: 999px;
  background: #0a0a10;
  box-shadow: inset 0 2px 6px rgba(0,0,0,0.8), inset 0 -1px 0 rgba(255,255,255,0.04);
}

.lever-fill {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  border-radius: 999px;
  transition: height 50ms linear;
}

.lever-fill--gas {
  background: linear-gradient(to top, #059669, #34d399);
  box-shadow: 0 0 8px rgba(52,211,153,0.3);
}

.lever-fill--brake {
  background: linear-gradient(to top, #b91c1c, #f87171);
  box-shadow: 0 0 8px rgba(248,113,113,0.3);
}

.lever-knob {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 36px;
  height: 28px;
  border-radius: 8px;
  transition: bottom 50ms linear;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1);
}

.lever-knob span {
  display: block;
  width: 14px;
  height: 2px;
  border-radius: 1px;
  opacity: 0.5;
}

.lever-knob--gas {
  background: linear-gradient(145deg, #064e3b, #065f46);
  border: 2px solid rgba(52,211,153,0.5);
}
.lever-knob--gas span { background: rgba(52,211,153,0.6); }

.lever-knob--brake {
  background: linear-gradient(145deg, #450a0a, #7f1d1d);
  border: 2px solid rgba(248,113,113,0.5);
}
.lever-knob--brake span { background: rgba(248,113,113,0.6); }

.gauge-bezel {
  background: radial-gradient(ellipse at 50% 80%, #1a1a24 0%, #0a0a10 70%);
  border: 2px solid #2a2a38;
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.7), 0 2px 0 rgba(255,255,255,0.04);
}

.horn-btn {
  background: linear-gradient(180deg, #1a1408 0%, #0f0c06 100%);
  border-color: rgba(180,130,40,0.25);
  color: #b8860b;
}
.horn-btn--active {
  background: rgba(245,158,11,0.25);
  border-color: rgba(245,158,11,0.6);
  transform: scale(1.03);
}

.console-btn {
  padding: 4px 8px;
  font-size: 11px;
  border-radius: 8px;
  border: 1px solid;
  transition: transform 0.1s;
}
.console-btn:active { transform: scale(0.95); }
.console-btn--gas {
  background: rgba(6,78,59,0.35);
  border-color: rgba(16,185,129,0.25);
  color: #34d399;
}
.console-btn--brake {
  background: rgba(69,10,10,0.35);
  border-color: rgba(220,38,38,0.25);
  color: #f87171;
}
.console-btn--neutral {
  background: #1e293b;
  border-color: #334155;
  color: #94a3b8;
}

.console-status {
  background: rgba(0,0,0,0.35);
}
</style>

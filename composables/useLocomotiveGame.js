import { getAllSignals } from '~/data/database.js'

const TICK_MS = 50
const MAX_SPEED = 120

// km/h per second at 100% throttle / brake — tuned so a heavy train
// accelerates and brakes gradually, giving the player time to react
// and fine-tune speed instead of instantly pinning to max/zero.
const ACCEL_FULL = 5.2
const BRAKE_FULL = 10
const IDLE_FRICTION = 0.35

const GAME_SIGNALS = [
  'Stoj',
  'Slobodno',
  'Oprezno, očekuj Stoj',
  'Ograničena brzina, očekuj Stoj',
  'Očekuj Stoj',
  'Očekuj Slobodno',
  'Ograničena brzina',
  'Manevriranje slobodno',
  'Voziti ograničenom brzinom \\.... km/h',
]

const ACTION_MAP = {
  'Stoj': { label: 'Zaustaviti se ispred signala', maxSpeed: 0, mustStop: true },
  'Slobodno': { label: 'Nastaviti vožnju dopuštenom brzinom', maxSpeed: 80, mustStop: false },
  'Oprezno, očekuj Stoj': { label: 'Voziti oprezno, spreman zaustaviti se', maxSpeed: 40, mustStop: false },
  'Ograničena brzina, očekuj Stoj': { label: 'Smanjiti brzinu, očekivati STOJ', maxSpeed: 40, mustStop: false },
  'Očekuj Stoj': { label: 'Pripremiti se za zaustavljanje na glavnom signalu', maxSpeed: 60, mustStop: false },
  'Očekuj Slobodno': { label: 'Nastaviti vožnju, glavni signal će biti slobodan', maxSpeed: 80, mustStop: false },
  'Ograničena brzina': { label: 'Voziti ograničenom brzinom', maxSpeed: 60, mustStop: false },
  'Manevriranje slobodno': { label: 'Manevrirati oprezno u kolodvoru', maxSpeed: 25, mustStop: false },
  'Voziti ograničenom brzinom \\.... km/h': { label: 'Voziti brzinom prikazanom na pokazivaču', maxSpeed: 60, mustStop: false },
}

export function signalColor(name) {
  if (!name) return '#f8fafc'
  if (name === 'Stoj') return '#ef4444'
  if (name.startsWith('Slobodno') || name.startsWith('Manevriranje slobodno')) return '#22c55e'
  return '#eab308'
}

function mulberry32(a) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle(arr, rng) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildRoute(seed = Date.now()) {
  const rng = mulberry32(seed)
  const allSignals = getAllSignals()
  const pool = GAME_SIGNALS
    .map(name => allSignals.find(s => s.name === name))
    .filter(Boolean)

  const segments = []
  let pos = 0

  const add = (seg) => {
    segments.push({ ...seg, startM: pos, endM: pos + seg.lengthM })
    pos += seg.lengthM
  }

  add({ type: 'open', lengthM: 400, label: 'Dvokolosječka pruga', speedLimit: 80, tracks: 2, electrified: true })
  add({ type: 'open', lengthM: 300, label: 'Dvokolosječka pruga', speedLimit: 80, mainSignal: pool[1], tracks: 2, electrified: true })
  add({ type: 'open', lengthM: 250, label: 'Uspon · jednokolosje', speedLimit: 60, slope: 'up', tracks: 1 })
  add({ type: 'open', lengthM: 350, label: 'Dvokolosječka pruga', speedLimit: 80, mainSignal: pool[3], distantSignal: pool[2], tracks: 2, electrified: true })
  add({ type: 'station', lengthM: 500, label: 'Kolodvor Zagreb GK', speedLimit: 40, maneuverSignal: pool[7], tracks: 2, electrified: true })
  add({ type: 'switch', lengthM: 150, label: 'Skretnica · jednokolosje', speedLimit: 30, tracks: 1 })
  add({ type: 'open', lengthM: 400, label: 'Dvokolosječka pruga', speedLimit: 80, mainSignal: pool[0], tracks: 2, electrified: true })
  add({ type: 'open', lengthM: 300, label: 'Pad · jednokolosje', speedLimit: 70, slope: 'down', tracks: 1 })
  add({ type: 'open', lengthM: 350, label: 'Dvokolosječka pruga', speedLimit: 80, mainSignal: pool[5], tracks: 2, electrified: true })
  add({ type: 'zcp', lengthM: 200, label: 'Željezničko-cestovni prijelaz', speedLimit: 50, tracks: 1 })
  add({ type: 'open', lengthM: 300, label: 'Dvokolosječka pruga', speedLimit: 80, mainSignal: pool[6], tracks: 2, electrified: true })
  add({ type: 'open', lengthM: 400, label: 'Dvokolosječka pruga', speedLimit: 80, mainSignal: pool[4], tracks: 2, electrified: true })
  add({ type: 'open', lengthM: 250, label: 'Cilj – kraj vožnje', speedLimit: 40, tracks: 1 })

  const events = []
  for (const seg of segments) {
    if (seg.mainSignal) {
      events.push({
        id: `main-${seg.startM}`,
        kind: 'signal',
        variant: 'main',
        atM: seg.endM - 80,
        signal: seg.mainSignal,
        side: 'right',
        segment: seg,
      })
    }
    if (seg.distantSignal) {
      events.push({
        id: `dist-${seg.startM}`,
        kind: 'signal',
        variant: 'distant',
        atM: seg.startM + seg.lengthM * 0.35,
        signal: seg.distantSignal,
        side: 'left',
        segment: seg,
      })
    }
    if (seg.maneuverSignal) {
      events.push({
        id: `man-${seg.startM}`,
        kind: 'signal',
        variant: 'maneuver',
        atM: seg.startM + seg.lengthM * 0.6,
        signal: seg.maneuverSignal,
        side: 'right',
        segment: seg,
      })
    }
    if (seg.type === 'switch') {
      events.push({ id: `sw-${seg.startM}`, kind: 'switch', atM: seg.startM + 60, segment: seg })
    }
    if (seg.type === 'zcp') {
      events.push({ id: `zcp-${seg.startM}`, kind: 'zcp', atM: seg.startM + 80, segment: seg })
    }
    if (seg.type === 'station') {
      events.push({
        id: `info-${seg.startM}`,
        kind: 'info',
        atM: seg.startM + 30,
        text: `🏭 Ulazak u kolodvor „${seg.label}" – smanji na ${seg.speedLimit} km/h`,
      })
    }
  }

  events.sort((a, b) => a.atM - b.atM)

  return { segments, events, totalM: pos, seed, pool, rng }
}

function buildQuiz(signal, pool, rng) {
  const others = pool.filter(s => s.name !== signal.name)
  const wrong = shuffle(others, rng).slice(0, 3).map(s => s.name)
  const options = shuffle([signal.name, ...wrong], rng)
  const correctIndex = options.indexOf(signal.name)

  const action = ACTION_MAP[signal.name] || { label: 'Postupiti prema pravilniku', maxSpeed: 60, mustStop: false }
  const wrongActions = [
    'Nastaviti punom brzinom bez obzira na signal',
    'Zaustaviti se bez razloga na otvorenoj pruzi',
    'Manevrirati bez odobrenja prometnika',
    'Proći signal bez usklađivanja brzine',
  ].filter(a => a !== action.label)
  const actionOptions = shuffle([action.label, ...shuffle(wrongActions, rng).slice(0, 3)], rng)
  const actionCorrectIndex = actionOptions.indexOf(action.label)

  return {
    signal,
    question: 'Što znači ovaj signal?',
    options,
    correctIndex,
    actionQuestion: 'Što morate učiniti kao strojovođa?',
    actionOptions,
    actionCorrectIndex,
    action,
  }
}

export function useLocomotiveGame() {
  const phase = ref('menu') // menu | playing | paused | finished
  const throttle = ref(0)
  const brake = ref(0)
  const speed = ref(0)
  const distance = ref(0)
  const score = ref(0)
  const violations = ref(0)
  const streak = ref(0)
  const horn = ref(false)

  const route = ref(null)
  const activeEvent = ref(null)
  const activeQuiz = ref(null)
  const quizStep = ref(0) // 0 = name quiz, 1 = action quiz
  const passedEvents = ref(new Set())
  const messages = ref([])
  let lastViolationAt = 0

  let tickId = null
  let hornTimeout = null

  const currentSegment = computed(() => {
    if (!route.value) return null
    return route.value.segments.find(s => distance.value >= s.startM && distance.value < s.endM) || null
  })

  const progress = computed(() => {
    if (!route.value?.totalM) return 0
    return Math.min(100, (distance.value / route.value.totalM) * 100)
  })

  // Next event overall (any kind) — used for the generic approach warning banner.
  const upcomingEvent = computed(() => {
    if (!route.value) return null
    return route.value.events.find(e => !passedEvents.value.has(e.id) && e.atM > distance.value - 5) || null
  })

  const distToEvent = computed(() => {
    if (!upcomingEvent.value) return null
    return Math.max(0, upcomingEvent.value.atM - distance.value)
  })

  // Next *signal* specifically — used to draw the glowing post + reveal the close-up photo.
  const upcomingSignal = computed(() => {
    if (!route.value) return null
    return route.value.events.find(e => e.kind === 'signal' && !passedEvents.value.has(e.id) && e.atM > distance.value - 5) || null
  })

  const distToSignal = computed(() => {
    if (!upcomingSignal.value) return null
    return Math.max(0, upcomingSignal.value.atM - distance.value)
  })

  // Next switch/ŽCP marker — drawn as a small growing icon on approach.
  const upcomingStructure = computed(() => {
    if (!route.value) return null
    return route.value.events.find(e => (e.kind === 'switch' || e.kind === 'zcp') && !passedEvents.value.has(e.id) && e.atM > distance.value - 5) || null
  })

  const distToStructure = computed(() => {
    if (!upcomingStructure.value) return null
    return Math.max(0, upcomingStructure.value.atM - distance.value)
  })

  const messageTimers = new Map()

  function addMessage(text, type = 'info', ttlMs = 4500) {
    const id = Date.now() + Math.random()
    messages.value = [{ text, type, id }, ...messages.value].slice(0, 3)
    if (messageTimers.has(id)) clearTimeout(messageTimers.get(id))
    if (ttlMs > 0) {
      messageTimers.set(id, setTimeout(() => {
        messages.value = messages.value.filter(m => m.id !== id)
        messageTimers.delete(id)
      }, ttlMs))
    }
  }

  function startGame() {
    route.value = buildRoute()
    phase.value = 'playing'
    throttle.value = 0
    brake.value = 0
    speed.value = 0
    distance.value = 0
    score.value = 0
    violations.value = 0
    streak.value = 0
    passedEvents.value = new Set()
    activeEvent.value = null
    activeQuiz.value = null
    quizStep.value = 0
    messages.value = []
    lastViolationAt = 0
    addMessage('Kreni polako – pazi na signale!', 'info', 3500)
    startTick()
  }

  function pauseGame() {
    if (phase.value !== 'playing') return
    phase.value = 'paused'
    stopTick()
    addMessage('⏸ Pauza', 'info', 2000)
  }

  function resumeGame() {
    if (phase.value !== 'paused' || activeQuiz.value) return
    phase.value = 'playing'
    startTick()
  }

  function emergencyBrake() {
    if (phase.value !== 'playing' && phase.value !== 'paused') return
    if (activeQuiz.value) return
    setBrake(100)
    setThrottle(0)
    if (phase.value === 'paused') {
      phase.value = 'playing'
      startTick()
    }
    addMessage('🛑 Hitna kočnica!', 'warn', 2500)
  }

  function stopTick() {
    if (tickId) {
      clearInterval(tickId)
      tickId = null
    }
  }

  function startTick() {
    stopTick()
    tickId = setInterval(tick, TICK_MS)
  }

  function tick() {
    if (phase.value !== 'playing') return

    const seg = currentSegment.value
    const limit = seg?.speedLimit || 80
    const slope = seg?.slope
    const dtSec = TICK_MS / 1000

    let accelPerSec = (throttle.value / 100) * ACCEL_FULL
    const decelPerSec = (brake.value / 100) * BRAKE_FULL + IDLE_FRICTION

    if (slope === 'up') accelPerSec *= 0.55
    if (slope === 'down') accelPerSec *= 1.25

    speed.value = Math.max(0, Math.min(MAX_SPEED, speed.value + (accelPerSec - decelPerSec) * dtSec))

    if (speed.value > limit + 5) {
      const now = Date.now()
      if (now - lastViolationAt > 2000) {
        violations.value++
        lastViolationAt = now
        addMessage(`⚠️ Prekoračenje brzine! Max ${limit} km/h`, 'warn')
      }
    }

    distance.value += (speed.value / 3.6) * dtSec

    if (route.value && distance.value >= route.value.totalM) {
      finishGame()
      return
    }

    checkEvents()
  }

  function checkEvents() {
    if (!route.value) return

    for (const ev of route.value.events) {
      if (passedEvents.value.has(ev.id)) continue
      if (distance.value < ev.atM) continue
      if (activeQuiz.value) break

      triggerEvent(ev)
      if (phase.value === 'paused') break
    }
  }

  function triggerEvent(ev) {
    passedEvents.value.add(ev.id)

    if (ev.kind === 'info') {
      addMessage(ev.text, 'info')
      return
    }

    activeEvent.value = ev
    phase.value = 'paused'
    stopTick()

    if (ev.kind === 'signal') {
      activeQuiz.value = buildQuiz(ev.signal, route.value.pool, route.value.rng)
      quizStep.value = 0
      const label = ev.variant === 'distant' ? 'Predsignal ispred' : ev.variant === 'maneuver' ? 'Manevarski signal ispred' : 'Signal ispred'
      addMessage(`${label} – što znači?`, 'quiz')
    } else if (ev.kind === 'switch') {
      activeQuiz.value = {
        signal: null,
        question: 'Što je skretnica i kako se postupa kod presječene skretnice?',
        options: [
          'Uređaj za usmjeravanje vlaka; presječenu skretnicu treba ručno postaviti i osigurati',
          'Signal za zaustavljanje vlaka na kolodvoru',
          'Oznaka početka kolodvora',
          'Uređaj za kočenje vlaka',
        ],
        correctIndex: 0,
        actionQuestion: 'Koja je max brzina na skretnici u kolodvoru?',
        actionOptions: ['Do 25 km/h', 'Do 80 km/h', 'Puna brzina', 'Mora stati'],
        actionCorrectIndex: 0,
        action: { label: 'Voziti do 25 km/h', maxSpeed: 25, mustStop: false },
      }
      quizStep.value = 0
      addMessage('↔️ Skretnica ispred', 'quiz')
    } else if (ev.kind === 'zcp') {
      activeQuiz.value = {
        signal: null,
        question: 'Kada se strojovođa mora zaustaviti ispred ŽCP-a?',
        options: [
          'Kad je uređaj u kvaru ili signalizira nejasno',
          'Uvijek, bez iznimke',
          'Samo noću',
          'Nikad na otvorenoj pruzi',
        ],
        correctIndex: 0,
        actionQuestion: 'Što učiniti pri neispravnom ŽCP-u?',
        actionOptions: ['Zaustaviti se i postupiti po pravilniku', 'Proći brzo', 'Zviždati i nastaviti', 'Manevrirati'],
        actionCorrectIndex: 0,
        action: { label: 'Zaustaviti se', maxSpeed: 0, mustStop: true },
      }
      quizStep.value = 0
      addMessage('🚧 Željeznicko-cestovni prijelaz ispred', 'quiz')
    }
  }

  function answerQuiz(selectedIndex) {
    if (!activeQuiz.value) return false

    const q = activeQuiz.value
    const correct = quizStep.value === 0
      ? selectedIndex === q.correctIndex
      : selectedIndex === q.actionCorrectIndex

    if (correct) {
      score.value += 10
      streak.value++
      addMessage('✅ Točno! +10 bodova', 'ok')
    } else {
      streak.value = 0
      violations.value++
      addMessage('❌ Netočno – ponovi pravilnik!', 'bad')
    }

    if (quizStep.value === 0 && q.actionQuestion) {
      quizStep.value = 1
      return null
    }

    const ev = activeEvent.value
    if (ev?.kind === 'signal') {
      const action = q.action
      if (action?.mustStop && speed.value > 2) {
        violations.value++
        addMessage('⚠️ Nisi stao na signal STOJ!', 'warn')
      }
    }

    activeQuiz.value = null
    activeEvent.value = null
    quizStep.value = 0
    phase.value = 'playing'
    startTick()
    return correct
  }

  function skipQuiz() {
    violations.value++
    streak.value = 0
    activeQuiz.value = null
    activeEvent.value = null
    quizStep.value = 0
    phase.value = 'playing'
    startTick()
  }

  function finishGame() {
    stopTick()
    phase.value = 'finished'
    const bonus = Math.max(0, 50 - violations.value * 5)
    score.value += bonus
  }

  function blowHorn() {
    horn.value = true
    if (hornTimeout) clearTimeout(hornTimeout)
    hornTimeout = setTimeout(() => { horn.value = false }, 600)
  }

  function setThrottle(v) {
    throttle.value = Math.max(0, Math.min(100, Math.round(v)))
    if (throttle.value > 0) brake.value = Math.max(0, brake.value - 20)
  }

  function setBrake(v) {
    brake.value = Math.max(0, Math.min(100, Math.round(v)))
    if (brake.value > 0) throttle.value = Math.max(0, throttle.value - 20)
  }

  onBeforeUnmount(() => {
    stopTick()
    if (hornTimeout) clearTimeout(hornTimeout)
    for (const t of messageTimers.values()) clearTimeout(t)
    messageTimers.clear()
  })

  return {
    phase,
    throttle,
    brake,
    speed,
    distance,
    score,
    violations,
    streak,
    horn,
    route,
    activeEvent,
    activeQuiz,
    quizStep,
    currentSegment,
    progress,
    upcomingEvent,
    distToEvent,
    upcomingSignal,
    distToSignal,
    upcomingStructure,
    distToStructure,
    messages,
    startGame,
    pauseGame,
    resumeGame,
    emergencyBrake,
    blowHorn,
    setThrottle,
    setBrake,
    answerQuiz,
    skipQuiz,
  }
}

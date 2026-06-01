const STORAGE_KEY = 'strojovodja-progress'

export function useProgress() {
  const progress = useState('learning-progress', () => ({}))

  if (import.meta.client && Object.keys(progress.value).length === 0) {
    try {
      progress.value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    } catch {
      progress.value = {}
    }
  }

  function save() {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress.value))
    }
  }

  function getCategory(id) {
    if (!progress.value[id]) {
      progress.value[id] = {
        lessonsRead: [],
        signalsSeen: [],
        quizBest: 0,
        quizAttempts: 0,
        streak: 0,
        lastStudy: null,
      }
    }
    return progress.value[id]
  }

  function markLessonRead(categoryId, index) {
    const cat = getCategory(categoryId)
    if (!cat.lessonsRead.includes(index)) {
      cat.lessonsRead.push(index)
      cat.lastStudy = Date.now()
      save()
    }
  }

  function markSignalSeen(categoryId, index) {
    const cat = getCategory(categoryId)
    if (!cat.signalsSeen.includes(index)) {
      cat.signalsSeen.push(index)
      cat.lastStudy = Date.now()
      save()
    }
  }

  function recordQuiz(categoryId, score, total) {
    const cat = getCategory(categoryId)
    const pct = total ? Math.round((score / total) * 100) : 0
    cat.quizAttempts++
    if (pct > cat.quizBest) cat.quizBest = pct
    if (pct >= 80) cat.streak = (cat.streak || 0) + 1
    else cat.streak = 0
    cat.lastStudy = Date.now()
    save()
    return pct
  }

  function categoryPercent(category) {
    if (!category) return 0
    const cat = getCategory(category.id)
    const lessonPart = category.lessons?.length
      ? (cat.lessonsRead.length / category.lessons.length) * 40
      : 0
    const signalPart = category.signals?.length
      ? (cat.signalsSeen.length / category.signals.length) * 30
      : 0
    const quizPart = (cat.quizBest / 100) * 30
    return Math.min(100, Math.round(lessonPart + signalPart + quizPart))
  }

  return {
    progress,
    getCategory,
    markLessonRead,
    markSignalSeen,
    recordQuiz,
    categoryPercent,
  }
}

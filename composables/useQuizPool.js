/** Priprema i miješa pitanja za kviz iz kategorije. */
export function useQuizPool() {
  function shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5)
  }

  function pickQuestions(category, mode = 'mixed', count = 15) {
    if (!category?.quiz?.length) return []

    let pool = [...category.quiz]

    if (mode === 'exam') {
      pool = pool.filter(q => q.type === 'exam' || !q.type)
    } else if (mode === 'signal') {
      pool = pool.filter(q => q.type === 'signal')
    } else if (mode === 'theory') {
      pool = pool.filter(q => q.type === 'theory' || q.type === 'exam' || !q.type)
    }

    if (!pool.length) pool = [...category.quiz]

    const shuffled = shuffle(pool)
    const n = Math.min(count, shuffled.length)
    return shuffled.slice(0, n)
  }

  const modeLabels = {
    mixed: { title: 'Mješoviti kviz', desc: 'Ispitna pitanja + signali + teorija', icon: '🎯', count: 15 },
    exam: { title: 'Ispitni mod', desc: 'Pitanja iz službenog popisa', icon: '📋', count: 20 },
    signal: { title: 'Signali', desc: 'Prepoznaj značenje signala', icon: '🚦', count: 12 },
    sprint: { title: 'Brzi sprint', desc: '5 pitanja – idealno za pauzu', icon: '⚡', count: 5 },
    marathon: { title: 'Maraton', desc: 'Sva pitanja kategorije', icon: '🏁', count: 999 },
  }

  return { pickQuestions, modeLabels, shuffle }
}

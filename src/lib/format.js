export function effortLabel(effort) {
  return { 1: 'Poca faena', 2: 'Normal', 3: 'Me apetece cocinar' }[effort] ?? 'Normal'
}

export function ratingLabel(rating) {
  return { 1: 'Floja', 2: 'Regulera', 3: 'Bien', 4: 'Buena', 5: 'De repetir' }[rating] ?? ''
}

export function fmtClock(totalSeconds) {
  const safe = Math.max(0, Math.round(totalSeconds))
  const mins = Math.floor(safe / 60)
  const secs = safe % 60
  return `${mins}:${String(secs).padStart(2, '0')}`
}

export function daysSince(iso) {
  if (!iso) return null
  const then = new Date(iso)
  if (Number.isNaN(then.getTime())) return null
  const start = new Date(then.getFullYear(), then.getMonth(), then.getDate())
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((today - start) / 86400000)
}

export function relativeDay(iso) {
  const days = daysSince(iso)
  if (days === null) return ''
  if (days <= 0) return 'hoy'
  if (days === 1) return 'ayer'
  return `hace ${days} días`
}

export function fmtDate(iso) {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long' }).format(date)
}

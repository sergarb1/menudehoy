import { daysSince } from './format'

const EFFORT_MAX = { poca: 1, normal: 2, mucha: 3 }

export function effortFits(dish, effort) {
  return dish.effort <= (EFFORT_MAX[effort] ?? 3)
}

export function pool(dishes, prefs) {
  return dishes.filter(
    (dish) =>
      dish.mins <= prefs.maxMins && effortFits(dish, prefs.effort) && (!prefs.veggie || dish.veg),
  )
}

function weightOf(dish, state, hour) {
  let weight = 1

  const rating = state.ratings[dish.id] ?? 0
  if (rating === 5) weight *= 3.2
  else if (rating === 4) weight *= 2.4
  else if (rating === 3) weight *= 1.2
  else if (rating === 2) weight *= 0.45
  else if (rating === 1) weight *= 0.1

  if (state.favorites.includes(dish.id)) weight *= 1.7

  const cooked = state.cooked[dish.id]
  if (!cooked) {
    weight *= 1.5
  } else {
    const days = daysSince(cooked)
    if (days !== null) {
      if (days <= 2) weight *= 0.2
      else if (days <= 4) weight *= 0.6
      else if (days <= 7) weight *= 0.85
      else if (days >= 14) weight *= 1.35
    }
  }

  if (state.prefs.effort === 'mucha' && dish.effort === 3) weight *= 1.8
  if (hour >= 21 && dish.mins <= 25) weight *= 1.6
  if (hour >= 22 && dish.mins >= 35) weight *= 0.4

  // Un poco de azar para que dos días iguales no den la misma comida.
  weight *= 0.85 + Math.random() * 0.3
  return Math.max(weight, 0.02)
}

export function explain(dish, state, hour = new Date().getHours()) {
  const reasons = []
  const rating = state.ratings[dish.id] ?? 0
  if (rating >= 4) reasons.push(`Le pusiste un ${rating}.`)
  if (state.favorites.includes(dish.id)) reasons.push('Está en tus favoritas.')

  const cooked = state.cooked[dish.id]
  if (!cooked) {
    reasons.push('Todavía no la has comido.')
  } else {
    const days = daysSince(cooked)
    if (days !== null && days >= 7) reasons.push(`Hace ${days} días que no la comes.`)
  }

  if (state.prefs.veggie && dish.veg) reasons.push('Vegetariana, como pediste.')
  if (hour >= 21 && dish.mins <= 25) reasons.push('Es tarde, mejor algo corto.')
  if (dish.mins <= 20) reasons.push(`Lista en ${dish.mins} minutos.`)
  else if (dish.effort === 1) reasons.push('Poca faena.')

  if (reasons.length < 2) {
    reasons.push(`${dish.mins} minutos y ${dish.steps.length} pasos.`)
  }
  return reasons.slice(0, 3)
}

export function pickDinner(dishes, state, excludeId = null) {
  const hour = new Date().getHours()
  let candidates = pool(dishes, state.prefs)
  if (candidates.length > 1 && excludeId) {
    candidates = candidates.filter((dish) => dish.id !== excludeId)
  }
  if (!candidates.length) return null

  const weights = candidates.map((dish) => weightOf(dish, state, hour))
  const total = weights.reduce((sum, value) => sum + value, 0)
  let ticket = Math.random() * total
  let chosen = candidates[candidates.length - 1]
  for (let index = 0; index < candidates.length; index += 1) {
    ticket -= weights[index]
    if (ticket <= 0) {
      chosen = candidates[index]
      break
    }
  }

  return { dish: chosen, reasons: explain(chosen, state, hour) }
}

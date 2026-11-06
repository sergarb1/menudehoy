import { daysSince } from './format'
import { pantryStatus } from './pantry'

const EFFORT_MAX = { poca: 1, normal: 2, mucha: 3 }

export function effortFits(dish, effort) {
  return dish.effort <= (EFFORT_MAX[effort] ?? 3)
}

export function pool(dishes, prefs, favorites = []) {
  return dishes.filter((dish) => {
    if (dish.mins > prefs.maxMins) return false
    if (!effortFits(dish, prefs.effort)) return false
    if (prefs.veggie && !dish.veg) return false
    if (prefs.favOnly && !favorites.includes(dish.id)) return false
    return true
  })
}

function baseWeight(dish, state, hour) {
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

  // Lo que hay en la despensa pesa de verdad, pero no bloquea una receta.
  const pantry = pantryStatus(dish, state.pantry)
  if (pantry.total) {
    if (pantry.ready) weight *= 2.4
    else weight *= 0.8 + pantry.ratio
  }

  return Math.max(weight, 0.02)
}

function weightOf(dish, state, hour) {
  // Un poco de azar para que dos días iguales no den la misma comida.
  return baseWeight(dish, state, hour) * (0.85 + Math.random() * 0.3)
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

  const pantry = pantryStatus(dish, state.pantry)
  if (pantry.ready) {
    reasons.push('Tienes todo lo que pide.')
  } else if (pantry.have.length && pantry.total) {
    const first = pantry.missing[0]?.label?.toLowerCase()
    reasons.push(
      first
        ? `Tienes ${pantry.have.length} de ${pantry.total}; te falta ${first}.`
        : `Tienes ${pantry.have.length} de ${pantry.total}.`,
    )
  }

  if (state.prefs.veggie && dish.veg) reasons.push('Vegetariana, como pediste.')
  if (hour >= 21 && dish.mins <= 25) reasons.push('Es tarde, mejor algo corto.')
  if (dish.mins <= 20) reasons.push(`Lista en ${dish.mins} minutos.`)
  else if (dish.effort === 1) reasons.push('Poca faena.')

  if (reasons.length < 2) {
    reasons.push(`${dish.mins} minutos y ${dish.steps.length} pasos.`)
  }
  return [...new Set(reasons)].slice(0, 3)
}

export function pickDinner(dishes, state, excludeId = null) {
  const hour = new Date().getHours()
  let candidates = pool(dishes, state.prefs, state.favorites)
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

// Sugerencias estables (sin azar) para la sección "para ti".
export function suggestions(dishes, state, limit = 3, favoritesOnly = false) {
  const hour = new Date().getHours()
  const source = favoritesOnly
    ? dishes.filter((dish) => state.favorites.includes(dish.id))
    : dishes
  return source
    .map((dish) => ({
      dish,
      weight: baseWeight(dish, state, hour),
      reason: explain(dish, state, hour)[0],
    }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, limit)
}

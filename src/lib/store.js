import { reactive, watch } from 'vue'
import { defaultPantry } from './pantry'
import { WEEK_DAYS, emptyPlan } from './week'

const KEY = 'sarten:v1'

function savedPlan(value) {
  const base = emptyPlan()
  if (!value || typeof value !== 'object') return base
  for (const day of WEEK_DAYS) {
    const entry = value[day.id]
    if (!entry || typeof entry !== 'object') continue
    for (const slot of ['comida', 'cena']) {
      base[day.id][slot] = typeof entry[slot] === 'string' ? entry[slot] : null
    }
  }
  return base
}

function defaults() {
  return {
    favorites: [],
    ratings: {},
    cooked: {},
    progress: {},
    pantry: defaultPantry(),
    imported: [],
    servings: 2,
    plan: emptyPlan(),
    prefs: { maxMins: 40, effort: 'normal', veggie: false, favOnly: false },
    lastPick: null,
  }
}

function read() {
  const base = defaults()
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return base
    const saved = JSON.parse(raw)
    if (!saved || typeof saved !== 'object') return base
    return {
      ...base,
      ...saved,
      favorites: Array.isArray(saved.favorites) ? saved.favorites : [],
      ratings: saved.ratings && typeof saved.ratings === 'object' ? saved.ratings : {},
      cooked: saved.cooked && typeof saved.cooked === 'object' ? saved.cooked : {},
      progress: saved.progress && typeof saved.progress === 'object' ? saved.progress : {},
      pantry: Array.isArray(saved.pantry) ? saved.pantry : defaultPantry(),
      imported: Array.isArray(saved.imported)
        ? saved.imported.filter((recipe) => recipe && recipe.id && recipe.name)
        : [],
      servings: Math.min(6, Math.max(1, Number(saved.servings) || 2)),
      plan: savedPlan(saved.plan),
      prefs: { ...base.prefs, ...(saved.prefs ?? {}) },
    }
  } catch {
    return base
  }
}

export const state = reactive(read())

watch(
  state,
  (value) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(value))
    } catch {
      // Sin espacio o sin permiso: la app sigue funcionando en memoria.
    }
  },
  { deep: true },
)

export function isFavorite(id) {
  return state.favorites.includes(id)
}

export function toggleFavorite(id) {
  state.favorites = isFavorite(id)
    ? state.favorites.filter((item) => item !== id)
    : [...state.favorites, id]
}

export function ratingOf(id) {
  return state.ratings[id] ?? 0
}

export function rate(id, value) {
  if (value > 0) {
    state.ratings[id] = value
    state.cooked[id] = new Date().toISOString()
  } else {
    delete state.ratings[id]
    delete state.cooked[id]
  }
}

export function markCooked(id) {
  state.cooked[id] = new Date().toISOString()
}

export function cookedAt(id) {
  return state.cooked[id] ?? null
}

function ensureProgress(id) {
  if (!state.progress[id]) {
    state.progress[id] = { ingredients: [], steps: [] }
  }
  return state.progress[id]
}

export function progressOf(id) {
  return state.progress[id] ?? { ingredients: [], steps: [] }
}

function toggled(list, index) {
  return list.includes(index) ? list.filter((item) => item !== index) : [...list, index]
}

export function isInPantry(id) {
  return state.pantry.includes(id)
}

export function togglePantry(id) {
  state.pantry = isInPantry(id)
    ? state.pantry.filter((item) => item !== id)
    : [...state.pantry, id]
}

export function setPantry(ids) {
  state.pantry = [...new Set(ids)]
}

export function clearPantry() {
  state.pantry = []
}

export function setServings(value) {
  state.servings = Math.min(6, Math.max(1, Number(value) || 2))
}

export function setPlanSlot(day, slot, id) {
  if (!state.plan[day]) state.plan[day] = { comida: null, cena: null }
  state.plan[day][slot] = id || null
}

export function clearPlan() {
  state.plan = emptyPlan()
}

export function addImported(recipe) {
  if (!recipe || state.imported.some((item) => item.id === recipe.id)) return false
  state.imported = [...state.imported, recipe]
  return true
}

export function removeImported(id) {
  state.imported = state.imported.filter((recipe) => recipe.id !== id)
}

export function toggleIngredient(id, index) {
  const progress = ensureProgress(id)
  progress.ingredients = toggled(progress.ingredients, index)
}

export function toggleStep(id, index) {
  const progress = ensureProgress(id)
  progress.steps = toggled(progress.steps, index)
}

export function resetAll() {
  Object.assign(state, defaults())
}

export function settingsSaved() {
  return Boolean(localStorage.getItem(KEY))
}

import { reactive, watch } from 'vue'

const KEY = 'sarten:v1'

function defaults() {
  return {
    favorites: [],
    ratings: {},
    cooked: {},
    progress: {},
    prefs: { maxMins: 40, effort: 'normal', veggie: false },
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

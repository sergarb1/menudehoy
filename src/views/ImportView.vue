<script setup>
import { computed, onMounted, ref } from 'vue'
import { addImported, removeImported, state } from '../lib/store'

const searchTerm = ref('pasta')
const results = ref([])
const loading = ref(false)
const error = ref('')
const message = ref('')

const presets = [
  { query: 'pasta', label: 'Pasta' },
  { query: 'chicken', label: 'Pollo' },
  { query: 'soup', label: 'Sopa' },
  { query: 'salad', label: 'Ensalada' },
  { query: 'fish', label: 'Pescado' },
  { query: 'rice', label: 'Arroz' },
  { query: 'curry', label: 'Curry' },
]

const importedIds = computed(() => new Set(state.imported.map((recipe) => recipe.id)))

function toRecipe(meal) {
  const ingredients = []
  for (let index = 1; index <= 20; index += 1) {
    const name = meal[`strIngredient${index}`]?.trim()
    const measure = meal[`strMeasure${index}`]?.trim()
    if (name) ingredients.push({ q: measure || '', n: name })
  }

  let steps = (meal.strInstructions || '')
    .split(/\r?\n+/)
    .map((line) => line.replace(/^\d+[.)]\s*/, '').trim())
    .filter((line) => line.length > 2)
    .map((text) => ({ text }))
  if (!steps.length) {
    steps = [{ text: 'Consulta las instrucciones completas en la receta original.' }]
  }

  const tags = [meal.strCategory, meal.strArea, 'importada']
    .filter(Boolean)
    .map((tag) => tag.toLowerCase())

  return {
    id: `api-${meal.idMeal}`,
    name: meal.strMeal,
    blurb: `${meal.strCategory ?? 'Receta'} de ${meal.strArea ?? 'TheMealDB'}, importada tal cual.`,
    mins: 30,
    effort: 2,
    veg: false,
    tags,
    ingredients,
    steps,
    tip: 'Receta externa: comprueba tiempos y cantidades en el original antes de cocinar.',
    image: meal.strMealThumb,
    sourceUrl: meal.strSource || `https://www.themealdb.com/meal/${meal.idMeal}`,
    sourceName: 'TheMealDB',
    external: true,
    language: 'en',
  }
}

async function search() {
  const query = searchTerm.value.trim()
  if (!query || loading.value) return
  loading.value = true
  error.value = ''
  message.value = ''
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`,
    )
    if (!response.ok) throw new Error(`Error ${response.status}`)
    const data = await response.json()
    results.value = Array.isArray(data.meals) ? data.meals : []
    if (!results.value.length) message.value = 'No hay resultados para esa búsqueda.'
  } catch {
    results.value = []
    error.value =
      'No se ha podido conectar con TheMealDB. Tus recetas locales siguen funcionando sin problema.'
  } finally {
    loading.value = false
  }
}

function choosePreset(query) {
  searchTerm.value = query
  search()
}

function importMeal(meal) {
  const recipe = toRecipe(meal)
  if (addImported(recipe)) {
    message.value = `«${recipe.name}» se ha añadido a tus recetas.`
  } else {
    message.value = 'Esa receta ya está importada.'
  }
}

function remove(id) {
  removeImported(id)
  message.value = 'Receta importada eliminada.'
}

onMounted(search)
</script>

<template>
  <section class="view">
    <RouterLink class="back" :to="{ name: 'recetas' }">Todas las recetas</RouterLink>

    <header class="page-head">
      <h1>Importar recetas</h1>
      <p class="lead">
        Busca en TheMealDB y añade solo las que te interesen. La app sigue usando tus recetas
        locales; estas se guardan aparte, en este navegador.
      </p>
    </header>

    <p class="small muted">
      TheMealDB es una base pública y gratuita, sin clave. Devuelve las recetas en inglés y con
      medidas que pueden no coincidir con las de casa. Revísalas antes de cocinar.
    </p>

    <form class="import-search" @submit.prevent="search">
      <label class="field">
        <span class="field__label">Buscar por nombre</span>
        <input
          v-model="searchTerm"
          type="search"
          placeholder="pasta, chicken, soup"
          autocomplete="off"
        />
      </label>
      <button class="btn btn--primary btn--small" type="submit" :disabled="loading">
        {{ loading ? 'Buscando' : 'Buscar' }}
      </button>
    </form>

    <div class="chips">
      <button
        v-for="preset in presets"
        :key="preset.query"
        class="chip"
        type="button"
        @click="choosePreset(preset.query)"
      >
        {{ preset.label }}
      </button>
    </div>

    <p v-if="error" class="empty" role="status">{{ error }}</p>
    <p v-else-if="message" class="small" role="status">{{ message }}</p>

    <div v-if="results.length" class="import-results">
      <article v-for="meal in results" :key="meal.idMeal" class="import-card">
        <img
          v-if="meal.strMealThumb"
          class="import-card__img"
          :src="meal.strMealThumb"
          alt=""
          loading="lazy"
          referrerpolicy="no-referrer"
        />
        <div class="import-card__body">
          <h2 class="import-card__name">{{ meal.strMeal }}</h2>
          <p class="small muted">
            {{ [meal.strCategory, meal.strArea].filter(Boolean).join(', ') }}
          </p>
          <button
            class="btn btn--quiet btn--small"
            type="button"
            :disabled="importedIds.has(`api-${meal.idMeal}`)"
            @click="importMeal(meal)"
          >
            {{ importedIds.has(`api-${meal.idMeal}`) ? 'Ya importada' : 'Importar' }}
          </button>
        </div>
      </article>
    </div>

    <p v-else-if="!loading && !error && !message" class="empty">
      Busca un ingrediente o un plato para ver recetas.
    </p>

    <section v-if="state.imported.length" aria-labelledby="imported-title">
      <div class="section-head">
        <h2 id="imported-title">Importadas</h2>
        <p class="small muted">{{ state.imported.length }}</p>
      </div>
      <ul class="list">
        <li v-for="recipe in state.imported" :key="recipe.id" class="imported-row">
          <RouterLink class="imported-row__link" :to="{ name: 'receta', params: { id: recipe.id } }">
            {{ recipe.name }}
          </RouterLink>
          <button class="link-btn" type="button" @click="remove(recipe.id)">Quitar</button>
        </li>
      </ul>
    </section>
  </section>
</template>

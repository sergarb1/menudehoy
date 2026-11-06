<script setup>
import { computed, onMounted, ref } from 'vue'
import { dishes, dishById } from '../data/dishes'
import { explain, pickDinner, pool, suggestions } from '../lib/decide'
import { isFavorite, state, toggleFavorite } from '../lib/store'
import DealCard from '../components/DealCard.vue'
import DishRow from '../components/DishRow.vue'

const result = ref(null)
const reasons = ref([])
const dealing = ref(false)
const failed = ref(false)
let timer = null

const timeOptions = [
  { value: 20, label: '20 min' },
  { value: 40, label: '40 min' },
  { value: 60, label: 'Sin prisa' },
]
const effortOptions = [
  { value: 'poca', label: 'Poca faena' },
  { value: 'normal', label: 'Normal' },
  { value: 'mucha', label: 'Me apetece' },
]

const poolCount = computed(() => pool(dishes, state.prefs, state.favorites).length)
const favoritesCount = computed(() => state.favorites.length)
const pantryCount = computed(() => state.pantry.length)

const ideas = computed(() =>
  suggestions(dishes, state, 4, state.prefs.favOnly)
    .filter((idea) => idea.dish.id !== result.value?.id)
    .slice(0, 3),
)

onMounted(() => {
  if (state.lastPick) {
    const dish = dishById(state.lastPick)
    if (dish) {
      result.value = dish
      reasons.value = explain(dish, state)
      state.lastPick = dish.id
    }
  }
})

function draw() {
  if (dealing.value) return
  dealing.value = true
  failed.value = false
  window.clearTimeout(timer)
  timer = window.setTimeout(() => {
    const picked = pickDinner(dishes, state, result.value?.id ?? null)
    dealing.value = false
    if (!picked) {
      failed.value = true
      result.value = null
      reasons.value = []
      return
    }
    result.value = picked.dish
    reasons.value = picked.reasons
    state.lastPick = picked.dish.id
  }, 280)
}

function clearFilters() {
  state.prefs.maxMins = 40
  state.prefs.effort = 'normal'
  state.prefs.veggie = false
  state.prefs.favOnly = false
  failed.value = false
}
</script>

<template>
  <section class="view">
    <header class="page-head">
      <h1>¿Qué comemos?</h1>
      <p class="lead">Dime cómo va el día y te saco una comida.</p>
    </header>

    <RouterLink class="pantry-callout" to="/despensa">
      <span class="pantry-callout__title">Tu despensa: {{ pantryCount }} ingredientes</span>
      <span class="small muted">Marca lo que tienes y las recomendaciones lo tienen en cuenta.</span>
    </RouterLink>

    <div class="filters">
      <div class="filter-row" role="group" aria-label="Tiempo disponible">
        <p class="filter-label">Tiempo</p>
        <div class="chips">
          <button
            v-for="option in timeOptions"
            :key="option.value"
            class="chip"
            type="button"
            :aria-pressed="state.prefs.maxMins === option.value"
            @click="state.prefs.maxMins = option.value"
          >
            {{ option.label }}
          </button>
        </div>
      </div>

      <div class="filter-row" role="group" aria-label="Ganas de cocinar">
        <p class="filter-label">Ganas</p>
        <div class="chips">
          <button
            v-for="option in effortOptions"
            :key="option.value"
            class="chip"
            type="button"
            :aria-pressed="state.prefs.effort === option.value"
            @click="state.prefs.effort = option.value"
          >
            {{ option.label }}
          </button>
        </div>
      </div>

      <div class="filter-row" role="group" aria-label="Entre qué recetas elegir">
        <p class="filter-label">Entre</p>
        <div class="chips">
          <button
            class="chip"
            type="button"
            :aria-pressed="!state.prefs.favOnly"
            @click="state.prefs.favOnly = false"
          >
            Todas
          </button>
          <button
            class="chip"
            type="button"
            :aria-pressed="state.prefs.favOnly"
            @click="state.prefs.favOnly = true"
          >
            Solo favoritas ({{ favoritesCount }})
          </button>
          <button
            class="chip"
            type="button"
            :aria-pressed="state.prefs.veggie"
            @click="state.prefs.veggie = !state.prefs.veggie"
          >
            Solo vegetariano
          </button>
        </div>
      </div>
    </div>

    <div class="deck" :class="{ 'deck--dealing': dealing }">
      <div class="deck__back deck__back--b" aria-hidden="true"></div>
      <div class="deck__back deck__back--a" aria-hidden="true"></div>

      <Transition name="deal" mode="out-in">
        <DealCard
          v-if="result"
          :key="result.id"
          :dish="result"
          :reasons="reasons"
          :favorite="isFavorite(result.id)"
          @toggle="toggleFavorite(result.id)"
        />
        <article v-else key="empty" class="sheet sheet--empty">
          <h2 class="deal-name">Todavía nada.</h2>
          <p class="deal-blurb">
            {{
              state.prefs.favOnly
                ? 'Pulsa el botón y sale una de tus favoritas, con lo que tienes en la despensa.'
                : 'Pulsa el botón y sale una receta de casa, con tus notas y lo que has comido esta semana.'
            }}
          </p>
          <p class="deck-note">
            {{
              poolCount === 0
                ? state.prefs.favOnly
                  ? 'No hay favoritas con estos filtros. Prueba con todas o cambia el tiempo.'
                  : 'Ahora mismo no encaja ninguna.'
                : `${poolCount} comidas encajan con estos filtros.`
            }}
          </p>
        </article>
      </Transition>
    </div>

    <p v-if="failed" class="empty" role="status">
      {{
        state.prefs.favOnly
          ? 'No queda ninguna favorita con esos filtros. Marca corazones o amplía el tiempo.'
          : 'Con esos filtros no queda ninguna comida.'
      }}
      <button class="link-btn" type="button" @click="clearFilters">Quitar los filtros</button>
    </p>

    <div class="actions" :class="{ 'actions--row': result }">
      <RouterLink
        v-if="result"
        class="btn btn--primary"
        :to="{ name: 'receta', params: { id: result.id } }"
      >
        Empezar a cocinar
      </RouterLink>
      <button
        v-else
        class="btn btn--primary"
        type="button"
        :aria-busy="dealing"
        :disabled="dealing"
        @click="draw"
      >
        {{ dealing ? 'Barajando' : 'Sácame una comida' }}
      </button>

      <button
        v-if="result"
        class="btn"
        type="button"
        :aria-busy="dealing"
        :disabled="dealing"
        @click="draw"
      >
        {{ dealing ? 'Barajando' : 'Otra idea' }}
      </button>
    </div>

    <p class="small muted">
      {{
        state.prefs.favOnly
          ? 'Solo entran las que has guardado con el corazón.'
          : 'Entran todas las recetas; tus notas, el historial y la despensa deciden cuál sale.'
      }}
    </p>

    <section v-if="ideas.length" aria-labelledby="ideas-title">
      <div class="section-head">
        <h2 id="ideas-title">Según tu historial</h2>
        <p class="small muted">{{ state.prefs.favOnly ? 'Solo favoritas' : 'En general' }}</p>
      </div>
      <ul class="list">
        <li v-for="idea in ideas" :key="idea.dish.id">
          <DishRow :dish="idea.dish" />
          <p class="idea-reason">{{ idea.reason }}</p>
        </li>
      </ul>
    </section>

    <section v-else-if="state.prefs.favOnly" class="empty">
      Todavía no hay favoritas que recomendar. Toca el corazón de una receta y aparecerá aquí.
      <RouterLink class="link-btn" :to="{ name: 'recetas' }">Ver recetas</RouterLink>
    </section>

    <p class="small muted">Todo se guarda en este navegador.</p>
  </section>
</template>

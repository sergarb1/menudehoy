<script setup>
import { computed, ref } from 'vue'
import { dishes, dishById } from '../data/dishes'
import { ratingOf, resetAll, state } from '../lib/store'
import { fmtDate, ratingLabel } from '../lib/format'
import DishRow from '../components/DishRow.vue'

const confirming = ref(false)

const cookedCount = computed(() => Object.keys(state.cooked).length)
const ratings = computed(() => Object.values(state.ratings))
const average = computed(() => {
  if (!ratings.value.length) return null
  const total = ratings.value.reduce((sum, value) => sum + value, 0)
  return (total / ratings.value.length).toFixed(1).replace('.', ',')
})

const favorites = computed(() =>
  state.favorites.map((id) => dishById(id)).filter(Boolean),
)

const rated = computed(() =>
  dishes
    .filter((dish) => ratingOf(dish.id) > 0)
    .sort((a, b) => ratingOf(b.id) - ratingOf(a.id) || a.name.localeCompare(b.name, 'es')),
)

const lastCooked = computed(() => {
  const entries = Object.entries(state.cooked)
    .filter(([, date]) => date)
    .sort((a, b) => new Date(b[1]) - new Date(a[1]))
  if (!entries.length) return null
  const dish = dishById(entries[0][0])
  return dish ? { dish, date: entries[0][1] } : null
})

function confirmReset() {
  resetAll()
  confirming.value = false
}
</script>

<template>
  <section class="view">
    <header class="page-head">
      <h1>Mis comidas</h1>
      <p class="lead">Lo que has cocinado, lo que repetirías y lo que te falta por probar.</p>
    </header>

    <dl class="stats">
      <div class="stat">
        <dt class="stat__label">Comidas hechas</dt>
        <dd class="stat__value">{{ cookedCount }}</dd>
      </div>
      <div class="stat">
        <dt class="stat__label">Con nota</dt>
        <dd class="stat__value">{{ ratings.length }}</dd>
      </div>
      <div class="stat">
        <dt class="stat__label">Favoritas</dt>
        <dd class="stat__value">{{ favorites.length }}</dd>
      </div>
    </dl>

    <p v-if="average" class="small muted">Tu media de notas: {{ average }} de 5.</p>

    <p v-if="lastCooked" class="small muted">
      La última fue {{ lastCooked.dish.name }}, el {{ fmtDate(lastCooked.date) }}.
    </p>

    <section aria-labelledby="fav-title">
      <div class="section-head">
        <h2 id="fav-title">Favoritas</h2>
        <p class="small muted">{{ favorites.length }}</p>
      </div>
      <ul v-if="favorites.length" class="list">
        <li v-for="dish in favorites" :key="dish.id">
          <DishRow :dish="dish" />
        </li>
      </ul>
      <p v-else class="empty">
        Todavía no has guardado ninguna. El corazón de cada receta la trae aquí.
        <RouterLink class="link-btn" :to="{ name: 'recetas' }">Ver recetas</RouterLink>
      </p>
    </section>

    <section aria-labelledby="rated-title">
      <div class="section-head">
        <h2 id="rated-title">Con nota</h2>
        <p class="small muted">{{ rated.length }}</p>
      </div>
      <ul v-if="rated.length" class="list">
        <li v-for="dish in rated" :key="dish.id">
          <DishRow :dish="dish" />
          <p class="row-note-line">
            {{ ratingOf(dish.id) }} de 5, {{ ratingLabel(ratingOf(dish.id)).toLowerCase() }}.
            <template v-if="state.cooked[dish.id]">La última vez, {{ fmtDate(state.cooked[dish.id]) }}.</template>
          </p>
        </li>
      </ul>
      <p v-else class="empty">
        Cuando cocines algo, ponle nota al final de la receta. Con eso decido mejor la próxima
        comida.
      </p>
    </section>

    <div class="danger-zone">
      <button v-if="!confirming" class="btn btn--quiet btn--small" type="button" @click="confirming = true">
        Borrar mis datos
      </button>
      <template v-else>
        <p class="small">
          Se borran notas, favoritas y pasos marcados de este navegador. No se puede deshacer.
        </p>
        <div class="actions--row">
          <button class="btn btn--small" type="button" @click="confirmReset">Sí, borrar</button>
          <button class="btn btn--quiet btn--small" type="button" @click="confirming = false">
            Cancelar
          </button>
        </div>
      </template>
    </div>
  </section>
</template>

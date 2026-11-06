<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { dishes } from '../data/dishes'
import { ratingOf, state } from '../lib/store'
import DishRow from '../components/DishRow.vue'

const route = useRoute()
const router = useRouter()

const filters = [
  { value: 'todas', label: 'Todas' },
  { value: 'cuchara', label: 'De cuchara' },
  { value: 'favoritas', label: 'Favoritas' },
  { value: 'nuevas', label: 'Sin probar' },
  { value: 'vegetarianas', label: 'Vegetarianas' },
]

function patch(patchObject) {
  router.replace({ query: { ...route.query, ...patchObject } })
}

const search = computed({
  get: () => route.query.q ?? '',
  set: (value) => patch({ q: value || undefined }),
})

const active = computed(() => route.query.f ?? 'todas')

const sort = computed({
  get: () => route.query.o ?? 'notas',
  set: (value) => patch({ o: value === 'notas' ? undefined : value }),
})

const list = computed(() => {
  const needle = search.value.trim().toLowerCase()
  let rows = dishes.filter((dish) => {
    if (active.value === 'favoritas' && !state.favorites.includes(dish.id)) return false
    if (active.value === 'nuevas' && state.cooked[dish.id]) return false
    if (active.value === 'vegetarianas' && !dish.veg) return false
    if (
      active.value === 'cuchara' &&
      !dish.tags.some((tag) => ['sopa', 'crema', 'puré'].includes(tag))
    )
      return false
    if (!needle) return true
    return `${dish.name} ${dish.blurb} ${dish.tags.join(' ')}`.toLowerCase().includes(needle)
  })

  if (sort.value === 'rapidas') rows.sort((a, b) => a.mins - b.mins)
  else if (sort.value === 'az') rows.sort((a, b) => a.name.localeCompare(b.name, 'es'))
  else rows.sort((a, b) => ratingOf(b.id) - ratingOf(a.id) || a.mins - b.mins)

  return rows
})

function clearAll() {
  router.replace({ query: {} })
}
</script>

<template>
  <section class="view">
    <header class="page-head">
      <h1>Recetas</h1>
      <p class="lead">Las {{ dishes.length }} comidas de casa, con lo que les has puesto tú.</p>
    </header>

    <div class="toolbar">
      <label class="field">
        <span class="field__label">Buscar</span>
        <input
          v-model="search"
          type="search"
          placeholder="Pasta, curry, horno"
          autocomplete="off"
        />
      </label>

      <div class="chips">
        <button
          v-for="item in filters"
          :key="item.value"
          class="chip"
          type="button"
          :aria-pressed="active === item.value"
          @click="patch({ f: item.value === 'todas' ? undefined : item.value })"
        >
          {{ item.label }}
        </button>
      </div>

      <div class="sort-row">
        <label class="filter-label" for="sort">Orden</label>
        <select id="sort" v-model="sort" class="select">
          <option value="notas">Tus notas</option>
          <option value="rapidas">Más rápidas</option>
          <option value="az">De la A a la Z</option>
        </select>
      </div>
    </div>

    <p class="small muted" role="status" aria-live="polite">
      {{ list.length }} de {{ dishes.length }} comidas
    </p>

    <ul v-if="list.length" class="list">
      <li v-for="dish in list" :key="dish.id">
        <DishRow :dish="dish" />
      </li>
    </ul>

    <p v-else class="empty" role="status">
      Ninguna comida encaja con esa búsqueda.
      <button class="link-btn" type="button" @click="clearAll">Ver todas</button>
    </p>
  </section>
</template>

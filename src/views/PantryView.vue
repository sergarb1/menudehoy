<script setup>
import { computed, ref } from 'vue'
import { dishes } from '../data/dishes'
import { BASIC_PANTRY, pantryGroups, pantryItems, pantryStatus } from '../lib/pantry'
import { clearPantry, ratingOf, setPantry, state, togglePantry } from '../lib/store'
import DishRow from '../components/DishRow.vue'

const search = ref('')

function fold(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

const groups = computed(() => {
  const needle = fold(search.value.trim())
  return pantryGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !needle || fold(item.label).includes(needle)),
    }))
    .filter((group) => group.items.length)
})

const picked = computed(() => pantryItems.filter((item) => state.pantry.includes(item.id)).length)

const rated = computed(() => ({
  ready: dishes
    .map((dish) => ({ dish, status: pantryStatus(dish, state.pantry) }))
    .filter((entry) => entry.status.ready)
    .sort((a, b) => ratingOf(b.dish.id) - ratingOf(a.dish.id) || a.dish.mins - b.dish.mins),
  almost: dishes
    .map((dish) => ({ dish, status: pantryStatus(dish, state.pantry) }))
    .filter((entry) => !entry.status.ready && entry.status.missing.length <= 2)
    .sort(
      (a, b) =>
        a.status.missing.length - b.status.missing.length ||
        ratingOf(b.dish.id) - ratingOf(a.dish.id) ||
        a.dish.mins - b.dish.mins,
    )
    .slice(0, 6),
}))

function addBasics() {
  setPantry([...new Set([...state.pantry, ...BASIC_PANTRY])])
}

function emptyPantry() {
  clearPantry()
}
</script>

<template>
  <section class="view">
    <header class="page-head">
      <h1>Despensa</h1>
      <p class="lead">Marca lo que tienes y te digo qué puedes cocinar sin bajar a comprar.</p>
    </header>

    <div class="pantry-summary">
      <p class="pantry-summary__count">{{ picked }} ingredientes en casa</p>
      <p class="small muted">
        Lo básico viene marcado. Quita lo que no tengas o añade lo que compres esta semana.
      </p>
      <div class="actions--row">
        <button class="btn btn--quiet btn--small" type="button" @click="addBasics">
          Poner lo básico
        </button>
        <button class="btn btn--quiet btn--small" type="button" @click="emptyPantry">Vaciar</button>
      </div>
    </div>

    <label class="field">
      <span class="field__label">Buscar en la despensa</span>
      <input v-model="search" type="search" placeholder="Tomate, arroz, queso" autocomplete="off" />
    </label>

    <div v-if="groups.length" class="pantry-groups">
      <section v-for="group in groups" :key="group.id" class="pantry-group" :aria-labelledby="`pantry-${group.id}`">
        <div class="section-head">
          <h2 :id="`pantry-${group.id}`">{{ group.label }}</h2>
          <p class="small muted">
            {{ group.items.filter((item) => state.pantry.includes(item.id)).length }} de
            {{ group.items.length }}
          </p>
        </div>
        <div class="chips">
          <button
            v-for="item in group.items"
            :key="item.id"
            class="chip chip--pantry"
            type="button"
            :aria-pressed="state.pantry.includes(item.id)"
            @click="togglePantry(item.id)"
          >
            {{ item.label }}
            <span v-if="item.basic" class="chip__tag">básico</span>
          </button>
        </div>
      </section>
    </div>

    <p v-else class="empty" role="status">
      No hay ingredientes con ese nombre.
      <button class="link-btn" type="button" @click="search = ''">Ver todos</button>
    </p>

    <section aria-labelledby="ready-title">
      <div class="section-head">
        <h2 id="ready-title">Puedes cocinar ya</h2>
        <p class="small muted">{{ rated.ready.length }}</p>
      </div>
      <ul v-if="rated.ready.length" class="list">
        <li v-for="entry in rated.ready" :key="entry.dish.id">
          <DishRow :dish="entry.dish" />
          <p class="pantry-missing pantry-missing--ok">No te falta nada.</p>
        </li>
      </ul>
      <p v-else class="empty">
        Con lo marcado todavía no sale ninguna receta completa. Añade algún ingrediente más o mira
        las que están a punto.
      </p>
    </section>

    <section aria-labelledby="almost-title">
      <div class="section-head">
        <h2 id="almost-title">Te falta poco</h2>
        <p class="small muted">{{ rated.almost.length }}</p>
      </div>
      <ul v-if="rated.almost.length" class="list">
        <li v-for="entry in rated.almost" :key="entry.dish.id">
          <DishRow :dish="entry.dish" />
          <p class="pantry-missing">
            Te falta: {{ entry.status.missing.map((item) => item.label.toLowerCase()).join(', ') }}.
          </p>
        </li>
      </ul>
      <p v-else class="empty">Marca más ingredientes para ver recetas a un paso.</p>
    </section>
  </section>
</template>

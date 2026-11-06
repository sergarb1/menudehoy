<script setup>
import { computed, ref } from 'vue'
import { dishes } from '../data/dishes'
import { pickDinner } from '../lib/decide'
import { setServings, setPlanSlot, clearPlan, state } from '../lib/store'
import { WEEK_DAYS, WEEK_SLOTS, plannedRecipes, shoppingList, shoppingListText } from '../lib/week'
import ServingsStepper from '../components/ServingsStepper.vue'

const includePantry = ref(false)
const copied = ref(false)
const copyFailed = ref(false)
let copyTimer = null

const servings = computed({
  get: () => state.servings,
  set: (value) => setServings(value),
})

const sortedDishes = computed(() =>
  [...dishes].sort((a, b) => a.name.localeCompare(b.name, 'es')),
)

const planned = computed(() => plannedRecipes(state.plan, dishes))
const plannedCount = computed(() => {
  let count = 0
  for (const day of WEEK_DAYS) {
    for (const slot of WEEK_SLOTS) {
      if (state.plan[day.id]?.[slot.id]) count += 1
    }
  }
  return count
})

const list = computed(() =>
  shoppingList(state.plan, dishes, state.servings, state.pantry, includePantry.value),
)
const listCount = computed(() => list.value.reduce((sum, group) => sum + group.items.length, 0))

function setSlot(day, slot, event) {
  setPlanSlot(day, slot, event.target.value || null)
}

function fillWeek() {
  const used = new Set(
    WEEK_DAYS.flatMap((day) => WEEK_SLOTS.map((slot) => state.plan[day.id]?.[slot.id])).filter(
      Boolean,
    ),
  )
  const planningState = {
    ...state,
    prefs: { ...state.prefs, maxMins: 60, effort: 'mucha', veggie: false, favOnly: false },
  }
  for (const day of WEEK_DAYS) {
    for (const slot of WEEK_SLOTS) {
      if (state.plan[day.id]?.[slot.id]) continue
      const available = dishes.filter((dish) => !used.has(dish.id))
      const picked = pickDinner(available.length ? available : dishes, planningState)
      if (!picked) continue
      setPlanSlot(day.id, slot.id, picked.dish.id)
      used.add(picked.dish.id)
    }
  }
}

function emptyWeek() {
  clearPlan()
}

async function copyList() {
  try {
    await navigator.clipboard.writeText(shoppingListText(list.value, state.servings))
    copied.value = true
    copyFailed.value = false
    window.clearTimeout(copyTimer)
    copyTimer = window.setTimeout(() => {
      copied.value = false
    }, 2500)
  } catch {
    copied.value = false
    copyFailed.value = true
  }
}
</script>

<template>
  <section class="view">
    <header class="page-head">
      <h1>La semana</h1>
      <p class="lead">
        Elige comidas y cenas. La lista de la compra se calcula con lo que hay en tu despensa.
      </p>
    </header>

    <div class="plan-top">
      <ServingsStepper v-model="servings" />
      <p class="small muted">
        {{ plannedCount }} de 14 huecos decididos. Quedan {{ planned.length }} recetas distintas.
      </p>
      <div class="actions--row">
        <button class="btn btn--quiet btn--small" type="button" @click="fillWeek">
          Rellenar huecos
        </button>
        <button class="btn btn--quiet btn--small" type="button" @click="emptyWeek">
          Vaciar semana
        </button>
        <RouterLink class="btn btn--quiet btn--small" :to="{ name: 'despensa' }">
          Revisar despensa
        </RouterLink>
      </div>
    </div>

    <div class="week">
      <article v-for="day in WEEK_DAYS" :key="day.id" class="week__day">
        <div class="week__day-head">
          <h2 class="week__day-name">{{ day.label }}</h2>
          <p class="small muted">
            {{
              [state.plan[day.id]?.comida, state.plan[day.id]?.cena].filter(Boolean).length
            }}
            de 2
          </p>
        </div>
        <div class="week__slots">
          <label v-for="slot in WEEK_SLOTS" :key="slot.id" class="week__slot">
            <span class="week__label">{{ slot.label }}</span>
            <select
              class="select week__select"
              :value="state.plan[day.id]?.[slot.id] ?? ''"
              @change="setSlot(day.id, slot.id, $event)"
            >
              <option value="">Sin decidir</option>
              <option v-for="dish in sortedDishes" :key="dish.id" :value="dish.id">
                {{ dish.name }}{{ dish.external ? ' (importada)' : '' }}
              </option>
            </select>
          </label>
        </div>
      </article>
    </div>

    <section class="shopping" aria-labelledby="shopping-title">
      <div class="section-head">
        <h2 id="shopping-title">Lista de la compra</h2>
        <p class="small muted">{{ listCount }} ingredientes</p>
      </div>

      <label class="check-inline">
        <input v-model="includePantry" type="checkbox" />
        Incluir lo que ya tengo en la despensa
      </label>

      <div v-if="list.length" class="shopping__groups">
        <section v-for="group in list" :key="group.id" class="shopping__group" :aria-labelledby="`shop-${group.id}`">
          <h3 :id="`shop-${group.id}`">{{ group.label }}</h3>
          <ul class="shopping__items">
            <li v-for="item in group.items" :key="item.key" class="shopping__item">
              <span>
                {{ item.label }}
                <span v-if="item.inPantry" class="shopping__have">ya lo tienes</span>
              </span>
              <span class="shopping__qty">
                {{ item.quantity || 'al gusto' }}
                <span class="visually-hidden">para {{ item.recipes }} recetas</span>
              </span>
            </li>
          </ul>
        </section>
      </div>
      <p v-else class="empty">
        Todavía no hay comidas en la semana. Elige alguna o pulsa «Rellenar huecos» y la lista
        aparecerá aquí.
      </p>

      <div v-if="list.length" class="actions--row">
        <button class="btn btn--small" type="button" @click="copyList">
          {{ copied ? 'Lista copiada' : 'Copiar lista' }}
        </button>
      </div>
      <p v-if="copyFailed" class="small" role="status">
        El navegador no ha dejado copiar. Selecciona el texto de la lista y cópialo a mano.
      </p>
    </section>
  </section>
</template>

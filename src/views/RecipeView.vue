<script setup>
import { computed } from 'vue'
import { dishById } from '../data/dishes'
import {
  cookedAt,
  isFavorite,
  progressOf,
  rate,
  ratingOf,
  setServings,
  state,
  toggleFavorite,
  toggleIngredient,
  toggleStep,
} from '../lib/store'
import { pantryStatus } from '../lib/pantry'
import { scaleQuantity } from '../lib/quantity'
import { effortLabel, fmtDate, ratingLabel } from '../lib/format'
import DishArt from '../components/DishArt.vue'
import ServingsStepper from '../components/ServingsStepper.vue'
import DoubtsSheet from '../components/DoubtsSheet.vue'
import HeartIcon from '../components/HeartIcon.vue'
import RatingControl from '../components/RatingControl.vue'
import StepTimer from '../components/StepTimer.vue'

const props = defineProps({
  id: { type: String, required: true },
})

const dish = computed(() => dishById(props.id))
const progress = computed(() => progressOf(props.id))
const checkedIngredients = computed(() => progress.value.ingredients)
const doneSteps = computed(() => progress.value.steps)
const currentStep = computed(() => {
  if (!dish.value) return null
  const index = dish.value.steps.findIndex((_, position) => !doneSteps.value.includes(position))
  return index === -1 ? null : index
})

const pantry = computed(() =>
  dish.value ? pantryStatus(dish.value, state.pantry) : { have: [], missing: [], total: 0 },
)

const servings = computed({
  get: () => state.servings,
  set: (value) => setServings(value),
})

const scaledIngredients = computed(() =>
  dish.value
    ? dish.value.ingredients.map((ingredient) => ({
        ...ingredient,
        q: scaleQuantity(ingredient.q, servings.value / 2),
      }))
    : [],
)

const myRating = computed({
  get: () => ratingOf(props.id),
  set: (value) => rate(props.id, value),
})

const lastCooked = computed(() => cookedAt(props.id))

// Une cantidad y nombre con "de" cuando la receta lo pide: 300 g de tomate, 1 diente de ajo.
function needsDe(quantity) {
  return /(kg|g|mg|ml|l|cucharaditas?|cucharadas?|dientes?|hojas?|latas?|rebanadas?|lomos?|pizcas?)$/i.test(
    quantity.trim(),
  )
}
</script>

<template>
  <section v-if="dish" class="view">
    <RouterLink class="back" :to="{ name: 'recetas' }">Todas las recetas</RouterLink>

    <img
      v-if="dish.image"
      class="recipe-art"
      :src="dish.image"
      :alt="dish.name"
      fetchpriority="high"
      referrerpolicy="no-referrer"
    />
    <DishArt v-else class="recipe-art" :dish="dish" variant="hero" />

    <header class="page-head">
      <h1>{{ dish.name }}</h1>
      <p class="lead">{{ dish.blurb }}</p>
      <p v-if="dish.sourceUrl" class="small muted">
        Receta importada de {{ dish.sourceName || 'TheMealDB' }}.
        <a :href="dish.sourceUrl" target="_blank" rel="noopener noreferrer">Ver la original</a>.
      </p>
    </header>

    <dl class="meta">
      <div class="meta__item">
        <dt>Tiempo</dt>
        <dd>{{ dish.mins }} min</dd>
      </div>
      <div class="meta__item">
        <dt>Faena</dt>
        <dd>{{ effortLabel(dish.effort) }}</dd>
      </div>
      <div class="meta__item">
        <dt>Pasos</dt>
        <dd>{{ dish.steps.length }}</dd>
      </div>
    </dl>

    <div class="tools">
      <button
        class="btn btn--quiet btn--small"
        type="button"
        :aria-pressed="isFavorite(dish.id)"
        @click="toggleFavorite(dish.id)"
      >
        <HeartIcon :size="18" :filled="isFavorite(dish.id)" />
        {{ isFavorite(dish.id) ? 'En favoritas' : 'Guardar' }}
      </button>
      <DoubtsSheet :dish="dish" :steps="dish.steps" :step-index="currentStep" />
    </div>

    <section aria-labelledby="ingredients-title">
      <div class="section-head">
        <h2 id="ingredients-title">Ingredientes</h2>
        <p class="small muted">{{ checkedIngredients.length }} de {{ dish.ingredients.length }}</p>
      </div>

      <ServingsStepper v-model="servings" />
      <p class="small muted ingredients-note">Cantidades para {{ servings }} personas.</p>

      <div class="pantry-inline" :class="{ 'pantry-inline--ready': pantry.missing.length === 0 }">
        <p class="small">
          <strong>{{ pantry.have.length }} de {{ pantry.total }}</strong> en tu despensa.
        </p>
        <p v-if="pantry.missing.length" class="small muted">
          Te falta: {{ pantry.missing.map((item) => item.label.toLowerCase()).join(', ') }}.
        </p>
        <p v-else class="small">No te falta nada para esta receta.</p>
        <RouterLink class="link-btn" :to="{ name: 'despensa' }">Cambiar mi despensa</RouterLink>
      </div>

      <ul class="checklist">
        <li v-for="(ingredient, index) in scaledIngredients" :key="`${ingredient.n}-${index}`">
          <label class="check">
            <input
              type="checkbox"
              :checked="checkedIngredients.includes(index)"
              @change="toggleIngredient(dish.id, index)"
            />
            <span class="check__box" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 10.5 8 14.5 16 5.5" />
              </svg>
            </span>
            <span class="check__text">
              <span v-if="ingredient.q" class="check__q">{{ ingredient.q }}</span>
              {{ ingredient.q && needsDe(ingredient.q) ? 'de ' : '' }}{{ ingredient.n }}
            </span>
          </label>
        </li>
      </ul>
    </section>

    <section aria-labelledby="steps-title">
      <div class="section-head">
        <h2 id="steps-title">Paso a paso</h2>
        <p class="small muted">{{ doneSteps.length }} de {{ dish.steps.length }} hechos</p>
      </div>

      <progress
        class="progress"
        :value="doneSteps.length"
        :max="dish.steps.length"
        aria-label="Pasos completados"
      ></progress>

      <ol class="steps">
        <li
          v-for="(step, index) in dish.steps"
          :key="`${dish.id}-${index}`"
          class="step"
          :class="{
            'step--done': doneSteps.includes(index),
            'step--current': index === currentStep,
          }"
        >
          <button
            class="step__toggle"
            type="button"
            :aria-pressed="doneSteps.includes(index)"
            :aria-label="`Paso ${index + 1}${doneSteps.includes(index) ? ', hecho' : ''}`"
            @click="toggleStep(dish.id, index)"
          >
            <svg
              v-if="doneSteps.includes(index)"
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              stroke-width="2.4"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M4 10.5 8 14.5 16 5.5" />
            </svg>
            <span v-else>{{ index + 1 }}</span>
          </button>

          <div class="step__body">
            <p v-if="index === currentStep" class="step__now">Ahora</p>
            <p class="step__text">{{ step.text }}</p>
            <StepTimer v-if="step.mins" :seconds="step.mins * 60" />
          </div>
        </li>
      </ol>
    </section>

    <aside class="tip">
      <p class="tip__label">Truco</p>
      <p>{{ dish.tip }}</p>
    </aside>

    <section class="rate-block" aria-labelledby="rate-title">
      <h2 id="rate-title">¿Cómo ha salido?</h2>
      <RatingControl v-model="myRating" :dish-name="dish.name" />
      <p v-if="myRating" class="small muted">
        Guardada como {{ ratingLabel(myRating).toLowerCase() }}. La última vez fue
        {{ lastCooked ? fmtDate(lastCooked) : 'hoy' }}.
      </p>
      <p v-else class="small muted">
        La nota se queda en este navegador y la próxima comida la tiene en cuenta. Toca la misma nota
        otra vez para quitarla.
      </p>
    </section>
  </section>

  <section v-else class="view">
    <header class="page-head">
      <h1>Esa receta no existe</h1>
      <p class="lead">Puede que el enlace esté mal o que la comida ya no esté en la lista.</p>
    </header>
    <RouterLink class="btn btn--primary" :to="{ name: 'recetas' }">Ver todas las recetas</RouterLink>
  </section>
</template>

<script setup>
import { effortLabel } from '../lib/format'
import HeartIcon from './HeartIcon.vue'

defineProps({
  dish: { type: Object, required: true },
  reasons: { type: Array, default: () => [] },
  favorite: { type: Boolean, default: false },
})
defineEmits(['toggle'])
</script>

<template>
  <article class="sheet sheet--deal">
    <div class="deal-head">
      <h2 class="deal-name">{{ dish.name }}</h2>
      <button
        class="icon-btn"
        type="button"
        :aria-pressed="favorite"
        :aria-label="favorite ? `Quitar ${dish.name} de favoritas` : `Guardar ${dish.name} en favoritas`"
        @click="$emit('toggle')"
      >
        <HeartIcon :filled="favorite" />
      </button>
    </div>
    <p class="deal-blurb">{{ dish.blurb }}</p>

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

    <div v-if="reasons.length" class="reasons">
      <p class="reasons__label">Por qué esta</p>
      <ul>
        <li v-for="reason in reasons" :key="reason">{{ reason }}</li>
      </ul>
    </div>
  </article>
</template>

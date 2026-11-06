<script setup>
import { computed } from 'vue'
import { ratingLabel } from '../lib/format'

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  dishName: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue'])

const message = computed(() =>
  props.modelValue
    ? `Tu nota: ${props.modelValue} de 5, ${ratingLabel(props.modelValue).toLowerCase()}`
    : 'Sin nota todavía',
)
</script>

<template>
  <div class="rate-wrap">
    <div class="rate" role="group" :aria-label="`Puntuar ${dishName}`">
      <button
        v-for="value in 5"
        :key="value"
        class="rate__btn"
        type="button"
        :aria-pressed="modelValue === value"
        :aria-label="`Puntuar con ${value} de 5`"
        @click="emit('update:modelValue', modelValue === value ? 0 : value)"
      >
        {{ value }}
      </button>
    </div>
    <p class="rate__label" aria-live="polite">{{ message }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Number, default: 2 },
})
const emit = defineEmits(['update:modelValue'])

function step(delta) {
  emit('update:modelValue', Math.min(6, Math.max(1, props.modelValue + delta)))
}
</script>

<template>
  <div class="servings" role="group" aria-label="Número de personas">
    <span class="servings__label">Personas</span>
    <button
      class="servings__btn"
      type="button"
      :disabled="modelValue <= 1"
      aria-label="Una persona menos"
      @click="step(-1)"
    >
      −
    </button>
    <span class="servings__value" aria-live="polite">
      {{ modelValue }}
      <span class="visually-hidden">personas</span>
    </span>
    <button
      class="servings__btn"
      type="button"
      :disabled="modelValue >= 6"
      aria-label="Una persona más"
      @click="step(1)"
    >
      +
    </button>
    <span class="small muted">de 1 a 6</span>
  </div>
</template>

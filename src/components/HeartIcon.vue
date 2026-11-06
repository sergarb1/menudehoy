<script setup>
defineProps({
  size: { type: Number, default: 20 },
  filled: { type: Boolean, default: false },
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path
      d="M12 20.2S4.6 15.6 4.6 10.6a4.1 4.1 0 0 1 7.4-2.5 4.1 4.1 0 0 1 7.4 2.5c0 5-7.4 9.6-7.4 9.6Z"
      :fill="filled ? 'currentColor' : 'none'"
    />
  </svg>
</template>

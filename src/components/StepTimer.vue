<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { fmtClock } from '../lib/format'
import { chime, initAudio } from '../lib/chime'

const props = defineProps({
  seconds: { type: Number, required: true },
})

const remaining = ref(props.seconds)
const mode = ref('idle')
let ticker = null
let endAt = 0

const clock = computed(() => fmtClock(remaining.value))
const canDecrease = computed(() => remaining.value > 60)

function stopTicker() {
  if (ticker) {
    clearInterval(ticker)
    ticker = null
  }
}

function tick() {
  const left = (endAt - Date.now()) / 1000
  if (left <= 0) {
    stopTicker()
    remaining.value = 0
    mode.value = 'done'
    chime()
    return
  }
  remaining.value = Math.ceil(left)
}

function start() {
  initAudio()
  if (remaining.value <= 0) remaining.value = props.seconds
  endAt = Date.now() + remaining.value * 1000
  mode.value = 'running'
  stopTicker()
  ticker = setInterval(tick, 250)
}

function pause() {
  if (mode.value !== 'running') return
  stopTicker()
  remaining.value = Math.max(0, Math.ceil((endAt - Date.now()) / 1000))
  mode.value = 'paused'
}

function reset() {
  stopTicker()
  mode.value = 'idle'
  remaining.value = props.seconds
}

// Cambiar el tiempo también mientras corre: el reloj se reajusta sin pararse.
function adjust(minutes) {
  const delta = minutes * 60
  if (mode.value === 'running') {
    const next = Math.max(60, Math.ceil((endAt - Date.now()) / 1000) + delta)
    remaining.value = next
    endAt = Date.now() + next * 1000
    return
  }
  if (mode.value === 'done') mode.value = 'idle'
  remaining.value = Math.min(3600, Math.max(60, remaining.value + delta))
}

onBeforeUnmount(stopTicker)
</script>

<template>
  <div class="timer" :class="{ 'timer--done': mode === 'done' }">
    <span class="timer__clock" aria-hidden="true">{{ clock }}</span>
    <span class="visually-hidden">
      {{
        mode === 'running'
          ? `Temporizador en marcha, ${clock}`
          : mode === 'paused'
            ? `Temporizador en pausa, ${clock}`
            : mode === 'done'
              ? 'Tiempo cumplido'
              : `Temporizador a ${clock}`
      }}
    </span>

    <div class="timer__actions">
      <button
        class="timer__btn timer__btn--adjust"
        type="button"
        :disabled="!canDecrease"
        aria-label="Quitar un minuto"
        @click="adjust(-1)"
      >
        −1
      </button>
      <button
        class="timer__btn timer__btn--adjust"
        type="button"
        aria-label="Añadir un minuto"
        @click="adjust(1)"
      >
        +1
      </button>

      <button v-if="mode === 'idle'" class="timer__btn timer__btn--go" type="button" @click="start">
        Empezar
      </button>
      <template v-else-if="mode === 'running'">
        <button class="timer__btn" type="button" @click="pause">Pausar</button>
        <button class="timer__btn" type="button" @click="reset">Reiniciar</button>
      </template>
      <template v-else-if="mode === 'paused'">
        <button class="timer__btn timer__btn--go" type="button" @click="start">Seguir</button>
        <button class="timer__btn" type="button" @click="reset">Reiniciar</button>
      </template>
      <template v-else>
        <button class="timer__btn timer__btn--go" type="button" @click="start">Otra vez</button>
        <button class="timer__btn" type="button" @click="reset">Reiniciar</button>
      </template>
    </div>

    <p v-if="mode === 'done'" class="timer__status" role="status">Tiempo cumplido</p>
  </div>
</template>

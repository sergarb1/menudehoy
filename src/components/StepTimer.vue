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
const startLabel = computed(() => `Empezar ${fmtClock(props.seconds)}`)

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

onBeforeUnmount(stopTicker)
</script>

<template>
  <div class="timer" :class="{ 'timer--done': mode === 'done' }">
    <template v-if="mode === 'idle'">
      <button class="timer__btn timer__btn--go" type="button" @click="start">
        {{ startLabel }}
      </button>
    </template>

    <template v-else-if="mode === 'running'">
      <span class="timer__clock" aria-hidden="true">{{ clock }}</span>
      <span class="visually-hidden">Temporizador en marcha, {{ clock }}</span>
      <button class="timer__btn" type="button" @click="pause">Pausar</button>
    </template>

    <template v-else-if="mode === 'paused'">
      <span class="timer__clock" aria-hidden="true">{{ clock }}</span>
      <span class="visually-hidden">Temporizador en pausa, {{ clock }}</span>
      <button class="timer__btn timer__btn--go" type="button" @click="start">Seguir</button>
      <button class="timer__btn" type="button" @click="reset">Reiniciar</button>
    </template>

    <template v-else>
      <span class="timer__status" role="status">Tiempo cumplido</span>
      <button class="timer__btn" type="button" @click="reset">Otra vez</button>
    </template>
  </div>
</template>

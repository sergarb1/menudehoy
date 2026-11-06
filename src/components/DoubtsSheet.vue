<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  dish: { type: Object, required: true },
  steps: { type: Array, default: () => [] },
  stepIndex: { type: Number, default: null },
})

const sheet = ref(null)
const doubt = ref('')
const copied = ref(false)
const copyFailed = ref(false)

const step = computed(() =>
  props.stepIndex === null ? null : (props.steps[props.stepIndex] ?? null),
)

const prompt = computed(() => {
  const lines = [`Estoy cocinando ${props.dish.name.toLowerCase()} y tengo una duda.`]
  if (step.value) {
    lines.push(`Estoy en el paso ${props.stepIndex + 1}: "${step.value.text}"`)
  }
  lines.push('¿Me das una mano?')
  if (doubt.value.trim()) lines.push(`Mi duda: ${doubt.value.trim()}`)
  return lines.join('\n')
})

const chatgptUrl = computed(() => `https://chatgpt.com/?q=${encodeURIComponent(prompt.value)}`)
const geminiUrl = 'https://gemini.google.com/app'

function open() {
  copied.value = false
  copyFailed.value = false
  sheet.value?.showModal()
}

function close() {
  sheet.value?.close()
}

async function writeClipboard() {
  try {
    await navigator.clipboard.writeText(prompt.value)
    copied.value = true
    copyFailed.value = false
  } catch {
    copyFailed.value = true
  }
}

async function copyThenOpen() {
  await writeClipboard()
}

function closeOnBackdrop(event) {
  if (event.target === sheet.value) close()
}
</script>

<template>
  <button class="btn btn--quiet btn--small" type="button" @click="open">Tengo una duda</button>

  <dialog
    ref="sheet"
    class="dialog"
    aria-labelledby="doubts-title"
    @click="closeOnBackdrop"
  >
    <div class="dialog__body">
      <div class="dialog__head">
        <h2 id="doubts-title" class="dialog__title">Preguntar a una IA</h2>
        <button class="btn btn--quiet btn--small" type="button" @click="close">Cerrar</button>
      </div>

      <p class="small muted">
        Menú de hoy no está conectado a ningún asistente. La pregunta se prepara aquí y se abre en tu
        cuenta de ChatGPT o Gemini.
      </p>

      <label class="field">
        <span class="field__label">Tu duda, si quieres concretarla</span>
        <textarea
          v-model="doubt"
          rows="3"
          placeholder="Se me ha quedado seca, ¿qué le añado?"
        ></textarea>
      </label>

      <div class="doubt-actions">
        <a class="btn" :href="chatgptUrl" target="_blank" rel="noopener noreferrer">
          Abrir en ChatGPT
        </a>
        <a
          class="btn"
          :href="geminiUrl"
          target="_blank"
          rel="noopener noreferrer"
          @click="copyThenOpen"
        >
          Abrir en Gemini y copiar
        </a>
        <button class="btn btn--quiet" type="button" @click="writeClipboard">
          {{ copied ? 'Pregunta copiada' : 'Copiar la pregunta' }}
        </button>
      </div>

      <p v-if="copyFailed" class="small" role="status">
        El navegador no ha dejado copiar. Abre ChatGPT y pega la pregunta desde el cuadro de abajo.
      </p>
      <p v-else class="small muted">
        Gemini no acepta la pregunta dentro del enlace: al pulsar se copia y solo tienes que
        pegarla.
      </p>

      <details class="small">
        <summary>Ver la pregunta</summary>
        <p class="small prompt-preview">{{ prompt }}</p>
      </details>
    </div>
  </dialog>
</template>

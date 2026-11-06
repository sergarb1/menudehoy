<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const tabs = [
  { to: '/', label: 'Decidir', name: 'decidir' },
  { to: '/recetas', label: 'Recetas', name: 'recetas' },
  { to: '/mias', label: 'Mis comidas', name: 'mias' },
]

function isOn(tab) {
  return route.name === tab.name || (tab.name === 'recetas' && route.name === 'receta')
}

const weekday = computed(() =>
  new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(new Date()),
)
</script>

<template>
  <div class="shell">
    <header class="topbar">
      <div class="topbar__inner">
        <RouterLink class="wordmark" to="/" aria-label="Menú de hoy, ir a decidir la comida">
          <span>menú de hoy</span>
        </RouterLink>
        <p class="topbar__day">{{ weekday }}</p>
      </div>
    </header>

    <main>
      <RouterView v-slot="{ Component }">
        <Transition name="view" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <nav class="tabbar" aria-label="Secciones">
      <div class="tabbar__inner">
        <RouterLink
          v-for="tab in tabs"
          :key="tab.name"
          :to="tab.to"
          class="tab"
          :class="{ 'tab--on': isOn(tab) }"
        >
          {{ tab.label }}
        </RouterLink>
      </div>
    </nav>
  </div>
</template>

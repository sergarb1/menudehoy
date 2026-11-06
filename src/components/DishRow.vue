<script setup>
import { effortLabel } from '../lib/format'
import { isFavorite, ratingOf, toggleFavorite } from '../lib/store'
import DishArt from './DishArt.vue'
import HeartIcon from './HeartIcon.vue'

defineProps({
  dish: { type: Object, required: true },
})
</script>

<template>
  <article class="row">
    <RouterLink class="row__link" :to="{ name: 'receta', params: { id: dish.id } }">
      <img
        v-if="dish.image"
        class="row__art"
        :src="dish.image"
        alt=""
        loading="lazy"
        referrerpolicy="no-referrer"
      />
      <DishArt v-else class="row__art" :dish="dish" variant="thumb" />
      <span class="row__text">
        <span class="row__name">{{ dish.name }}</span>
        <span class="row__meta">{{ dish.mins }} min, {{ effortLabel(dish.effort).toLowerCase() }}</span>
      </span>
    </RouterLink>
    <div class="row__side">
      <span v-if="ratingOf(dish.id)" class="row__note">
        {{ ratingOf(dish.id) }}<span class="row__note-total">/5</span>
        <span class="visually-hidden">, tu nota</span>
      </span>
      <button
        class="icon-btn icon-btn--row"
        type="button"
        :aria-pressed="isFavorite(dish.id)"
        :aria-label="
          isFavorite(dish.id)
            ? `Quitar ${dish.name} de favoritas`
            : `Guardar ${dish.name} en favoritas`
        "
        @click="toggleFavorite(dish.id)"
      >
        <HeartIcon :size="18" :filled="isFavorite(dish.id)" />
      </button>
    </div>
  </article>
</template>

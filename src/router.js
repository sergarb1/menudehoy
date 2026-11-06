import { createRouter, createWebHashHistory } from 'vue-router'
import DecideView from './views/DecideView.vue'
import RecipesView from './views/RecipesView.vue'
import RecipeView from './views/RecipeView.vue'
import MineView from './views/MineView.vue'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'decidir', component: DecideView },
    { path: '/recetas', name: 'recetas', component: RecipesView },
    { path: '/recetas/:id', name: 'receta', component: RecipeView, props: true },
    { path: '/mias', name: 'mias', component: MineView },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    return { top: 0 }
  },
})

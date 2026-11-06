import { createRouter, createWebHashHistory } from 'vue-router'
import DecideView from './views/DecideView.vue'
import RecipesView from './views/RecipesView.vue'
import RecipeView from './views/RecipeView.vue'
import PantryView from './views/PantryView.vue'
import PlannerView from './views/PlannerView.vue'
import ImportView from './views/ImportView.vue'
import MineView from './views/MineView.vue'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'decidir', component: DecideView },
    { path: '/recetas', name: 'recetas', component: RecipesView },
    { path: '/recetas/:id', name: 'receta', component: RecipeView, props: true },
    { path: '/semana', name: 'semana', component: PlannerView },
    { path: '/despensa', name: 'despensa', component: PantryView },
    { path: '/importar', name: 'importar', component: ImportView },
    { path: '/mias', name: 'mias', component: MineView },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    return { top: 0 }
  },
})

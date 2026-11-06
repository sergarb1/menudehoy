import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/app.css'

// Marca que hay script, para que los estados ocultos de las transiciones no escondan
// contenido si el navegador no ejecuta JavaScript.
document.documentElement.classList.add('js')

createApp(App).use(router).mount('#app')

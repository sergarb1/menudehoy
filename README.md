# Menú de hoy

Una app para dejar de discutir qué se come. Te saca una receta de las que ya tienes, tiene en
cuenta tus notas y lo que has comido estos días, y luego te lleva paso a paso con temporizadores.

Hecha con **Vue 3 + Vite**, sin backend: todo se guarda en tu navegador. Es una **PWA
instalable** que funciona sin conexión después de la primera visita.

Publicada en **https://sergarb1.github.io/menudehoy/**.

## Qué hace

- **Decide la comida.** Eliges tiempo y ganas (y si quieres solo vegetariano) y la app baraja una
  receta. Los pesos: tus notas altas suman, lo que has comido hace poco resta, lo que nunca has
  probado sube, y si es tarde prioriza comidas cortas.
- **27 recetas de casa** con cantidades para dos, pasos y un truco cada una: sopas, cremas, purés,
  pastas y platos de pollo, pavo o pescado.
- **Paso a paso.** Ingredientes con casillas, pasos que se marcan y temporizador por paso con
  aviso sonoro y vibración. El progreso se guarda aunque cierres la app.
- **Puntúa y guarda favoritas.** La nota alimenta la siguiente recomendación. Toca la misma nota
  para quitarla.
- **Dudas.** «Tengo una duda» prepara una pregunta con la receta y el paso en el que estás, y la
  abre en ChatGPT, o la copia para Gemini. No hay claves ni cuentas: la pregunta sale de tu
  navegador a tu asistente.
- **Tus datos.** Notas, favoritas, historial y progreso viven en `localStorage` bajo `sarten:v1`
  (la clave se mantiene para no perder lo guardado en versiones anteriores). Hay un botón para
  borrarlo todo en «Mis comidas».

## Arrancar en local

```bash
npm install
npm run dev
```

Compilar y probar el build con service worker:

```bash
npm run build
npm run preview
```

## Instalar en el móvil

Abre la URL publicada y usa «Añadir a la pantalla de inicio»:

- iPhone (Safari): Compartir, Añadir a pantalla de inicio.
- Android (Chrome): menú de tres puntos, Instalar app.

Una vez instalada abre a pantalla completa y carga sin red.

## Publicar en GitHub Pages

1. Crea un repositorio llamado `menudehoy` y sube este proyecto a la rama `main`.
2. En el repo: **Settings, Pages, Build and deployment, Source: GitHub Actions**.
3. El workflow `.github/workflows/deploy.yml` compila y publica en cada push a `main`.
4. La app queda en `https://TU-USUARIO.github.io/menudehoy/`.

El build usa rutas relativas (`base: './'`) y navegación por hash, así que funciona igual en
GitHub Pages, Netlify, Vercel o una subcarpeta cualquiera sin tocar nada.

## Añadir o cambiar recetas

Todo está en `src/data/dishes.js`:

```js
{
  id: 'mi-comida',
  name: 'Mi comida',
  blurb: 'Una frase que la venda.',
  mins: 25,
  effort: 1,            // 1 poca faena, 2 normal, 3 me apetece cocinar
  veg: true,
  tags: ['pasta', 'vegetariano'],
  ingredients: [{ q: '200 g', n: 'pasta' }],
  steps: [{ text: 'Cuece la pasta.', mins: 8 }],  // mins opcional: añade temporizador
  tip: 'Un truco real.',
}
```

Los `mins` de cada paso son minutos de temporizador. Si un paso no lleva, se omite y no aparece
reloj.

## Diseño y desarrollo con IA

- El diseño sigue la skill [Hallmark](https://github.com/nutlope/hallmark) (tema Hum, ámbito de
  app). Los tokens están en `src/styles/tokens.css`, la base en `base.css` y el sello de la
  decisión en la primera línea de `src/styles/app.css`. El README de Hallmark explica las reglas:
  nada de degradados morados, etiquetas en mayúsculas, emojis como iconos ni métricas inventadas.
- El proyecto está indexado con [CodeGraph](https://github.com/colbymchenry/codegraph) para que
  cualquier agente entienda el código sin recorrer archivos. El índice está en `.codegraph/`
  (ignorado por git) y se sincroniza solo. Para conectar CodeGraph a tu agente:
  `codegraph install`; para reconstruir el índice: `npm run graph`.
- Hay notas para agentes en `AGENTS.md`.

## Stack

Vue 3, Vue Router, Vite, vite-plugin-pwa y Chillax (Fontshare). Sin estado en servidor, sin
analítica y sin dependencias de tracking.

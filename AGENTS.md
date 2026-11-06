# Menú de hoy: notas para agentes

App Vue 3 + Vite, sin backend. Decide la comida o la cena, planifica la semana, calcula la lista de
la compra y guía la receta paso a paso. Todo se guarda en `localStorage` (`sarten:v1`).

Licencia: **AGPL-3.0-only**. Si publicas una versión modificada que se use por red, la licencia
obliga a ofrecer el código fuente. No cambies la licencia sin decisión expresa del autor.

## Comandos

```bash
npm run dev      # servidor local
npm run build    # build de producción + service worker (dist/)
npm run preview  # sirve el build
npm run graph    # crea o refresca el índice de CodeGraph (npx, sin instalar global)
```

Lint de diseño (debe quedar en 0 FAIL; los WARN conocidos pueden quedar):

```bash
node .agents/skills/hallmark/scripts/sloplint.mjs src index.html --genre playful --scope app
```

## CodeGraph

El proyecto está indexado con [CodeGraph](https://github.com/colbymchenry/codegraph) en
`.codegraph/` (ignorado por git). Se sincroniza solo al guardar archivos.

- Si el agente tiene el MCP de CodeGraph, usa `codegraph_explore` antes de leer archivos a mano.
- Para conectar el MCP a tu agente una sola vez: `codegraph install`.
- Si el grafo no existe todavía: `npm run graph` (o `codegraph init`).
- El índice se genera en local y está en `.gitignore`: no se sube al repositorio.

## Dónde está cada cosa

- `src/data/dishes.js`: 40 recetas locales y cantidades para dos. También sincroniza las recetas
  importadas que viven en `state.imported`.
- `src/lib/decide.js`: pesos de recomendación (notas, favoritas, días sin repetir, hora, despensa).
  `suggestions()` devuelve las recomendaciones estables; `pool()` filtra por tiempo, ganas, veggie
  y modo solo favoritas.
- `src/lib/pantry.js`: catálogo de ingredientes, alias y comparación con cada receta.
- `src/lib/week.js`: días, plan semanal y lista de la compra.
- `src/lib/quantity.js`: escala cantidades para 1 a 6 personas y las suma.
- `src/lib/store.js`: estado reactivo y persistencia. Clave `sarten:v1`.
- `src/views/`: Decidir, Recetas, Receta, Semana, Despensa, Importar y Mis comidas.
- `src/components/DishArt.vue`: ilustraciones SVG por tipo de plato.
- `src/components/StepTimer.vue`: temporizador por paso, con ajuste, pausa, reinicio y aviso.
- `src/styles/tokens.css` y `base.css`: los genera Hallmark. No editar a mano.
- `src/styles/app.css`: estilos de la app. La primera línea es el sello de Hallmark.
- `public/logo.svg`: logo dibujado a mano. `brand/logo.excalidraw`: fuente editable.
- `HANDSOFF.md`: estado del proyecto y limitaciones conocidas.

## Estado y persistencia

`state` incluye favoritas, notas, fechas cocinadas, progreso, despensa, prefs, plan semanal,
raciones, última elección y recetas importadas. Cualquier campo nuevo debe:

1. añadirse en `defaults()`;
2. validarse en `read()` para no romper datos antiguos;
3. sobrevivir a `resetAll()`.

No cambies la clave `sarten:v1` sin migración: hay datos de usuarios reales.

## Reglas de diseño

La app usa la skill Hallmark con el tema Hum y ámbito `app`. Al tocar estilos:

- Colores y tipografías solo con tokens de `:root`. Nada de literales nuevos.
- Nada de `transition: all`, ni animar `width`, `height`, `top` o `left`.
- Nada de etiquetas en mayúsculas ni con tracking, ni "eyebrows" sobre los títulos.
- Contraste, `:focus-visible` y `prefers-reduced-motion` ya están resueltos en `base.css`: no los
  quites.
- El copy va en español, sin rayas largas y sin promesas inventadas.

## Recetas importadas

`ImportView.vue` consulta TheMealDB (pública, sin clave, CORS abierto). Las recetas se guardan en
`state.imported`, se marcan con `external: true` y se muestran en inglés tal cual. No hay
traducción automática: no la simules. La app debe seguir funcionando sin red y sin la API.

## Verificación mínima antes de publicar

```bash
npm run build
node .agents/skills/hallmark/scripts/sloplint.mjs src index.html --genre playful --scope app
```

Comprueba además que `dist/` contiene `sw.js`, `manifest.webmanifest` y los iconos, y que las rutas
publicadas responden 200.

# Menú de hoy: notas para agentes

App Vue 3 + Vite, sin backend. Decide la comida o la cena, guarda notas y favoritas en `localStorage`
(`sarten:v1`) y guía la receta con temporizadores.

## Comandos

```bash
npm run dev      # servidor local
npm run build    # build de producción + service worker (dist/)
npm run preview  # sirve el build
npm run graph    # crea o refresca el índice de CodeGraph (npx, sin instalar global)
```

## CodeGraph

El proyecto está indexado con [CodeGraph](https://github.com/colbymchenry/codegraph) en
`.codegraph/` (ignorado por git). Se sincroniza solo al guardar archivos.

- Si el agente tiene el MCP de CodeGraph, usa `codegraph_explore` antes de leer archivos a mano.
- Para conectar el MCP a tu agente una sola vez: `codegraph install`.
- Si el grafo no existe todavía: `npm run graph` (o `codegraph init`).
- El índice se genera en local y está en `.gitignore`: no se sube al repositorio.

## Dónde está cada cosa

- `src/data/dishes.js`: recetas y cantidades. Es la única fuente de datos de comidas.
- `src/lib/decide.js`: pesos de recomendación (notas, favoritas, días sin repetir, hora).
- `src/lib/store.js`: estado reactivo y persistencia en `localStorage`.
- `src/views/`: Decidir, Recetas, Receta (pasos y temporizadores) y Mis comidas.
- `src/styles/tokens.css` y `base.css`: los genera Hallmark. No editar a mano.
- `src/styles/app.css`: estilos de la app. La primera línea es el sello de Hallmark.

## Reglas de diseño

La app usa la skill Hallmark con el tema Hum y ámbito `app`. Al tocar estilos:

- Colores y tipografías solo con tokens de `:root`. Nada de literales nuevos.
- Nada de `transition: all`, ni animar `width`, `height`, `top` o `left`.
- Nada de etiquetas en mayúsculas ni con tracking, ni "eyebrows" sobre los títulos.
- Contraste, `:focus-visible` y `prefers-reduced-motion` ya están resueltos en `base.css`: no los quites.
- Verifica con `node .agents/skills/hallmark/scripts/sloplint.mjs src --genre playful --scope app`.

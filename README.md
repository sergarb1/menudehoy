# Menú de hoy

Una app para dejar de discutir qué se come. Te saca una receta de las que ya tienes, tiene en
cuenta tus notas, lo que has comido estos días y lo que hay en tu despensa, y luego te lleva paso a
paso con temporizadores. También planifica la semana y calcula la lista de la compra.

Hecha con **Vue 3 + Vite**, sin backend: todo se guarda en tu navegador. Es una **PWA instalable**
que funciona sin conexión después de la primera visita.

Publicada en **https://sergarb1.github.io/menudehoy/**.

Licencia: **AGPL-3.0-only**. Ver [LICENSE](LICENSE).

## Qué hace

- **Decide la comida.** Eliges tiempo, ganas y si quieres solo vegetariano. Puedes elegir entre
  todas las recetas o **solo entre tus favoritas**. Los pesos usan tus notas, las favoritas, los días
  sin repetir, la hora y la despensa.
- **Recomendaciones con motivo.** La sección «Según tu historial» propone tres recetas y explica por
  qué: una nota alta, días sin comerla, ingredientes que ya tienes o lo rápido que sale.
- **40 recetas de casa** con cantidades para dos, pasos y un truco cada una. Incluye sopas, cremas,
  pastas, pollo, pescado y 13 recetas sencillas de supermercado.
- **Paso a paso.** Ingredientes con casillas, paso actual resaltado y temporizador por paso. El reloj
  se puede empezar, pausar, ajustar de minuto en minuto, reiniciar y avisa con sonido y vibración al
  terminar. El progreso se guarda aunque cierres la app.
- **Raciones de 1 a 6.** Las cantidades se recalculan desde la base de dos personas, con redondeo
  según la unidad.
- **Despensa.** Marca los ingredientes que tienes. La app te dice qué recetas puedes cocinar ya, a
  cuáles les falta poco y lo tiene en cuenta al recomendarte.
- **Semana y compra.** Planifica comida y cena de lunes a domingo, rellena los huecos
  automáticamente y obtén una lista de la compra agregada. Puedes excluir lo que ya está en la
  despensa y copiar la lista.
- **Importar recetas.** De forma opcional, busca en TheMealDB (API pública, sin clave) y añade las
  que quieras. Las recetas locales siguen siendo la base; las importadas se guardan aparte, en tu
  navegador, y se marcan como externas.
- **Puntúa y guarda favoritas.** La nota alimenta la siguiente recomendación. Toca la misma nota
  para quitarla.
- **Dudas.** «Tengo una duda» prepara una pregunta con la receta y el paso en el que estás, y la
  abre en ChatGPT, o la copia para Gemini. No hay claves ni cuentas: la pregunta sale de tu
  navegador a tu asistente.
- **Tus datos.** Notas, favoritas, historial, plan, despensa y progreso viven en `localStorage` bajo
  `sarten:v1` (la clave se mantiene para no perder lo guardado en versiones anteriores). Hay un botón
  para borrarlo todo en «Mis comidas».

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

## La API opcional

La pantalla «Recetas, Importar de TheMealDB» consulta
`https://www.themealdb.com/api/json/v1/1/search.php?s=...` directamente desde el navegador. No hay
clave ni proxy. Las recetas llegan en inglés y con medidas que pueden no coincidir con las de casa;
se guardan tal cual y se avisa antes de importar. Si la API falla o no hay red, las recetas locales
siguen funcionando.

## Añadir o cambiar recetas

Las recetas locales están en `src/data/dishes.js`:

```js
{
  id: 'mi-comida',
  name: 'Mi comida',
  blurb: 'Una frase que la venda.',
  mins: 25,
  effort: 1,            // 1 poca faena, 2 normal, 3 me apetece cocinar
  veg: true,
  art: 'pasta',         // opcional: pasta, bowl, salad, rice, egg, fish, pan,
                        // oven, toast, burger, croquetas, wrap
  tags: ['pasta', 'vegetariano'],
  ingredients: [{ q: '200 g', n: 'pasta' }],
  steps: [{ text: 'Cuece la pasta.', mins: 8 }],  // mins opcional: añade temporizador
  tip: 'Un truco real.',
}
```

Los `mins` de cada paso son minutos de temporizador. Si un paso no lleva, se omite y no aparece
reloj. Las cantidades se escriben para dos personas.

Los ingredientes se comparan con el catálogo de `src/lib/pantry.js`. Si añades uno nuevo, añade
también su entrada y alias para que la despensa y la lista de la compra lo reconozcan.

## Publicar en GitHub Pages

1. Crea un repositorio llamado `menudehoy` y sube este proyecto a la rama `main`.
2. En el repo: **Settings, Pages, Build and deployment, Source: GitHub Actions**.
3. El workflow `.github/workflows/deploy.yml` compila y publica en cada push a `main`.
4. La app queda en `https://TU-USUARIO.github.io/menudehoy/`.

El build usa rutas relativas (`base: './'`) y navegación por hash, así que funciona igual en
GitHub Pages, Netlify, Vercel o una subcarpeta cualquiera sin tocar nada.

## Diseño y desarrollo con IA

- El diseño sigue la skill [Hallmark](https://github.com/nutlope/hallmark) (tema Hum, ámbito de
  app). Los tokens están en `src/styles/tokens.css`, la base en `base.css` y el sello de la
  decisión en la primera línea de `src/styles/app.css`.
- El logo es un SVG dibujado a mano; la escena editable de Excalidraw está en
  `brand/logo.excalidraw`.
- El proyecto está indexado con [CodeGraph](https://github.com/colbymchenry/codegraph) para que
  cualquier agente entienda el código sin recorrer archivos. El índice está en `.codegraph/`
  (ignorado por git) y se sincroniza solo. Para conectar CodeGraph a tu agente:
  `codegraph install`; para reconstruir el índice: `npm run graph`.
- Hay notas para agentes en `AGENTS.md` y un traspaso en `HANDSOFF.md`.

## Stack

Vue 3, Vue Router, Vite, vite-plugin-pwa y Chillax (Fontshare). Sin estado en servidor, sin
analítica y sin dependencias de tracking.

## Licencia

Copyright (C) 2026 sergarb1.

Este programa es software libre: puedes redistribuirlo y/o modificarlo bajo los términos de la
Licencia Pública General Affero de GNU, versión 3, publicada por la Free Software Foundation.
Se distribuye sin ninguna garantía. Consulta [LICENSE](LICENSE) para el texto completo.

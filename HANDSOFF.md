# Menú de hoy: traspaso

Fecha: 6 de noviembre de 2026. Estado: publicado y funcionando.

- App: https://sergarb1.github.io/menudehoy/
- Repo: https://github.com/sergarb1/menudehoy (público)
- Licencia: AGPL-3.0-only (ver `LICENSE`)

## Qué es

Una PWA en Vue 3 + Vite para decidir qué comer y cenar, cocinar paso a paso y organizar la semana.
No hay backend, cuentas, analítica ni cookies. Todo se guarda en `localStorage` bajo `sarten:v1`.
La app local funciona sin conexión después de la primera visita; las recetas importadas y sus fotos
necesitan red la primera vez.

## Qué hace ahora

- **Decidir**: baraja una receta con filtros de tiempo, ganas y vegetariano. Se puede limitar a
  **solo favoritas**. Los pesos usan notas, favoritas, días desde la última vez, hora y despensa.
- **Recomendaciones visibles**: sección «Según tu historial» con tres ideas y el motivo. Cambia
  entre todas y solo favoritas con el mismo selector.
- **40 recetas locales** para dos personas, con pasos, trucos y temporizador por paso. Incluye 13
  recetas sencillas de supermercado (wrap, César, arroz tres delicias, pizza, hamburguesa...).
- **Paso a paso**: cada paso con minutos tiene reloj. Se puede empezar, pausar, ajustar ±1 minuto,
  reiniciar y suena al terminar (Web Audio + vibración). El paso actual se resalta.
- **Raciones de 1 a 6**: las cantidades se escalan desde la base de dos personas. Se redondean
  según la unidad.
- **Despensa**: catálogo de ingredientes de supermercado. Marca lo que tienes; la app muestra qué
  recetas puedes cocinar ya, cuáles están a falta de uno o dos ingredientes y lo tiene en cuenta al
  recomendar.
- **Semana**: plan de comida y cena para siete días, con relleno automático de huecos, selección
  manual, lista de la compra agregada y botón de copiar. La lista excluye por defecto lo que ya está
  en la despensa y se puede incluir.
- **Importar recetas**: búsqueda opcional en TheMealDB (pública, sin clave). Las recetas elegidas se
  guardan aparte en el navegador, marcadas como importadas; las locales siguen siendo la base.
- **PWA**: instalable, service worker con precache, iconos y manifest.
- **Historial**: favoritas, notas, media, última comida y borrado de datos.

## Cómo arrancar

```bash
npm install
npm run dev
```

Build y comprobación:

```bash
npm run build
npm run preview
node .agents/skills/hallmark/scripts/sloplint.mjs src index.html --genre playful --scope app
```

## Despliegue

GitHub Pages con GitHub Actions (`.github/workflows/deploy.yml`). Cada push a `main` compila con
Node 22 y publica `dist/`. `vite.config.js` usa `base: './'` y el router es de hash, así que funciona
en el subdirectorio del repo.

Si Pages se desactiva:

```bash
gh api -X POST repos/sergarb1/menudehoy/pages -f build_type=workflow
gh workflow run deploy.yml -R sergarb1/menudehoy --ref main
gh run watch <id> -R sergarb1/menudehoy --exit-status
```

## Mapa del código

| Archivo | Responsabilidad |
| --- | --- |
| `src/data/dishes.js` | 40 recetas locales; sincroniza `state.imported` en la lista reactiva |
| `src/lib/store.js` | Estado, persistencia y acciones; clave `sarten:v1` |
| `src/lib/decide.js` | Pesos, filtros, explicaciones y sugerencias |
| `src/lib/pantry.js` | Catálogo, alias y estado de ingredientes por receta |
| `src/lib/week.js` | Días, plan y lista de la compra |
| `src/lib/quantity.js` | Escalado y suma de cantidades |
| `src/views/DecideView.vue` | Baraja, favoritas, despensa e historial |
| `src/views/RecipeView.vue` | Raciones, ingredientes, pasos y temporizadores |
| `src/views/PlannerView.vue` | Semana y lista de la compra |
| `src/views/PantryView.vue` | Marcado de despensa y recomendaciones |
| `src/views/ImportView.vue` | Importación desde TheMealDB |
| `src/components/DishArt.vue` | Ilustraciones SVG por tipo de plato |
| `public/logo.svg` | Logo hand-drawn; `brand/logo.excalidraw` es la fuente editable |

## Modelo de datos

```js
{
  favorites: [],
  ratings: {},        // id -> 1..5
  cooked: {},         // id -> ISO date
  progress: {},       // id -> { ingredients: [], steps: [] }
  pantry: [],         // ids de src/lib/pantry.js
  imported: [],       // recetas externas completas
  servings: 2,        // 1..6
  plan: { lun: { comida: null, cena: null }, ... },
  prefs: { maxMins, effort, veggie, favOnly },
  lastPick: null,
}
```

Al añadir campos: actualiza `defaults()` y `read()` en `store.js`. No cambies la clave sin migración.

## Limitaciones conocidas

- TheMealDB devuelve recetas en inglés, con medidas y nombres que no siempre encajan con la despensa.
  Se guardan tal cual y se avisa en la pantalla de importación. Las fotos son remotas.
- La lista de la compra agrega cantidades cuando la unidad coincide; si no, las muestra separadas. No
  convierte unidades imperiales de recetas importadas.
- El escalado redondea: para 1 persona puede mostrar medias unidades o mínimo una unidad en huevos,
  latas, etc.
- El temporizador vive en el componente: si sales de la receta, se pierde la cuenta. No hay
  notificaciones push ni alarmas en segundo plano.
- La despensa usa un catálogo cerrado; los ingredientes que no están en él se muestran como
  «otros» y no se pueden marcar.
- No hay backend, login ni sincronización entre dispositivos.
- El plan semanal no genera eventos de calendario.

## Siguientes pasos razonables

1. Persistir temporizadores activos en el estado para sobrevivir a la navegación.
2. Traducir o adaptar recetas importadas con revisión humana.
3. Añadir edición manual de recetas propias y exportación/importación JSON.
4. Convertir la lista de la compra en una lista con casillas persistidas por semana.

## Verificación hecha

Build de Vite, linter de Hallmark y comprobación de la URL publicada (200, título, manifest, service
worker e iconos). Ver el historial de commits para el detalle de cada cambio.

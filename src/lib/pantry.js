// Despensa: una lista corta de ingredientes de supermercado. Cada receta se compara
// con lo marcado para saber qué tienes y qué te falta, sin inventar disponibilidad.

const CATALOG = [
  // Verduras y fruta
  { id: 'aguacate', label: 'Aguacate', group: 'verduras', aliases: ['aguacate'] },
  { id: 'ajo', label: 'Ajo', group: 'verduras', aliases: ['ajo', 'diente de ajo'] },
  { id: 'albahaca', label: 'Albahaca', group: 'verduras', aliases: ['albahaca'] },
  { id: 'berenjena', label: 'Berenjena', group: 'verduras', aliases: ['berenjena'] },
  { id: 'calabacin', label: 'Calabacín', group: 'verduras', aliases: ['calabacin'] },
  { id: 'calabaza', label: 'Calabaza', group: 'verduras', aliases: ['calabaza'] },
  { id: 'cebolla', label: 'Cebolla', group: 'verduras', aliases: ['cebolla'] },
  { id: 'cebolleta', label: 'Cebolleta', group: 'verduras', aliases: ['cebolleta'] },
  { id: 'cilantro', label: 'Cilantro', group: 'verduras', aliases: ['cilantro'] },
  { id: 'espinacas', label: 'Espinacas', group: 'verduras', aliases: ['espinaca'] },
  { id: 'guisantes', label: 'Guisantes', group: 'verduras', aliases: ['guisante'] },
  { id: 'jengibre', label: 'Jengibre', group: 'verduras', aliases: ['jengibre'] },
  { id: 'lechuga', label: 'Lechuga', group: 'verduras', aliases: ['lechuga'] },
  { id: 'limon', label: 'Limón', group: 'verduras', aliases: ['limon'] },
  { id: 'maiz', label: 'Maíz', group: 'verduras', aliases: ['maiz'] },
  { id: 'menta', label: 'Menta', group: 'verduras', aliases: ['menta'] },
  { id: 'patata', label: 'Patata', group: 'verduras', aliases: ['patata'] },
  { id: 'pepino', label: 'Pepino', group: 'verduras', aliases: ['pepino'] },
  { id: 'perejil', label: 'Perejil', group: 'verduras', aliases: ['perejil'] },
  { id: 'pimiento-rojo', label: 'Pimiento rojo', group: 'verduras', aliases: ['pimiento rojo'] },
  {
    id: 'pimiento-verde',
    label: 'Pimiento verde',
    group: 'verduras',
    aliases: ['pimiento verde'],
  },
  { id: 'puerro', label: 'Puerro', group: 'verduras', aliases: ['puerro'] },
  { id: 'setas', label: 'Setas', group: 'verduras', aliases: ['seta'] },
  { id: 'tomate', label: 'Tomate', group: 'verduras', aliases: ['tomate'] },
  { id: 'zanahoria', label: 'Zanahoria', group: 'verduras', aliases: ['zanahoria'] },

  // Despensa
  { id: 'aceite', label: 'Aceite de oliva', group: 'despensa', aliases: ['aceite'], basic: true },
  { id: 'sal', label: 'Sal', group: 'despensa', aliases: ['sal'], basic: true },
  { id: 'pimienta', label: 'Pimienta', group: 'despensa', aliases: ['pimienta'], basic: true },
  { id: 'azucar', label: 'Azúcar', group: 'despensa', aliases: ['azucar'], basic: true },
  { id: 'harina', label: 'Harina', group: 'despensa', aliases: ['harina'], basic: true },
  { id: 'vinagre', label: 'Vinagre', group: 'despensa', aliases: ['vinagre'], basic: true },
  { id: 'agua', label: 'Agua', group: 'despensa', aliases: ['agua'], basic: true },
  { id: 'arroz', label: 'Arroz', group: 'despensa', aliases: ['arroz'] },
  { id: 'pasta', label: 'Pasta', group: 'despensa', aliases: ['pasta', 'macarron'] },
  { id: 'fideos', label: 'Fideos', group: 'despensa', aliases: ['fideo'] },
  { id: 'pan', label: 'Pan', group: 'despensa', aliases: ['pan'] },
  {
    id: 'pan-hamburguesa',
    label: 'Panes de hamburguesa',
    group: 'despensa',
    aliases: ['pan de hamburguesa', 'panes de hamburguesa', 'bollo de hamburguesa'],
  },
  {
    id: 'tortillas',
    label: 'Tortillas de trigo',
    group: 'despensa',
    aliases: ['tortilla de trigo', 'tortillas de trigo'],
  },
  { id: 'caldo', label: 'Caldo', group: 'despensa', aliases: ['caldo'] },
  { id: 'leche-coco', label: 'Leche de coco', group: 'despensa', aliases: ['leche de coco'] },
  { id: 'miso', label: 'Miso', group: 'despensa', aliases: ['miso'] },
  { id: 'soja', label: 'Salsa de soja', group: 'despensa', aliases: ['salsa de soja', 'soja'] },
  { id: 'tahini', label: 'Tahini', group: 'despensa', aliases: ['tahini'] },
  { id: 'vino', label: 'Vino blanco', group: 'despensa', aliases: ['vino blanco'] },
  { id: 'guindilla', label: 'Guindilla', group: 'despensa', aliases: ['guindilla'] },
  {
    id: 'especias-fajitas',
    label: 'Especias para fajitas',
    group: 'despensa',
    aliases: ['especias para fajitas'],
  },
  { id: 'curry', label: 'Curry', group: 'despensa', aliases: ['curry'] },
  { id: 'pimenton', label: 'Pimentón', group: 'despensa', aliases: ['pimenton'] },
  { id: 'oregano', label: 'Orégano', group: 'despensa', aliases: ['oregano'] },
  { id: 'tomillo', label: 'Tomillo', group: 'despensa', aliases: ['tomillo'] },
  { id: 'laurel', label: 'Laurel', group: 'despensa', aliases: ['laurel'] },
  { id: 'nuez-moscada', label: 'Nuez moscada', group: 'despensa', aliases: ['nuez moscada'] },
  { id: 'salvia', label: 'Salvia', group: 'despensa', aliases: ['salvia'] },
  { id: 'eneldo', label: 'Eneldo', group: 'despensa', aliases: ['eneldo'] },
  { id: 'pipas', label: 'Pipas de calabaza', group: 'despensa', aliases: ['pipa'] },
  { id: 'alga', label: 'Alga nori o wakame', group: 'despensa', aliases: ['alga'] },
  { id: 'quinoa', label: 'Quinoa', group: 'despensa', aliases: ['quinoa'] },
  { id: 'lentejas', label: 'Lentejas cocidas', group: 'despensa', aliases: ['lenteja'] },
  { id: 'garbanzos', label: 'Garbanzos cocidos', group: 'despensa', aliases: ['garbanzo'] },
  { id: 'alubias', label: 'Alubias cocidas', group: 'despensa', aliases: ['alubia'] },
  { id: 'frijoles', label: 'Frijoles negros cocidos', group: 'despensa', aliases: ['frijol'] },
  { id: 'atun', label: 'Atún en lata', group: 'despensa', aliases: ['atun'] },
  { id: 'pesto', label: 'Pesto', group: 'despensa', aliases: ['pesto'] },
  { id: 'hummus', label: 'Hummus', group: 'despensa', aliases: ['hummus'] },
  { id: 'mayonesa', label: 'Mayonesa', group: 'despensa', aliases: ['mayonesa'] },
  { id: 'salsa-picante', label: 'Salsa picante', group: 'despensa', aliases: ['salsa picante'] },
  { id: 'guacamole', label: 'Guacamole', group: 'despensa', aliases: ['guacamole'] },
  { id: 'base-pizza', label: 'Base de pizza', group: 'despensa', aliases: ['base de pizza'] },
  { id: 'croquetas', label: 'Croquetas', group: 'despensa', aliases: ['croqueta'] },

  // Nevera
  { id: 'huevos', label: 'Huevos', group: 'nevera', aliases: ['huevo'] },
  { id: 'leche', label: 'Leche', group: 'nevera', aliases: ['leche'] },
  { id: 'mantequilla', label: 'Mantequilla', group: 'nevera', aliases: ['mantequilla'] },
  { id: 'nata', label: 'Nata o leche evaporada', group: 'nevera', aliases: ['nata', 'leche evaporada'] },
  { id: 'queso', label: 'Queso', group: 'nevera', aliases: ['queso', 'parmesano'] },
  { id: 'feta', label: 'Queso feta', group: 'nevera', aliases: ['queso feta', 'feta'] },
  { id: 'burrata', label: 'Burrata', group: 'nevera', aliases: ['burrata'] },
  { id: 'yogur', label: 'Yogur', group: 'nevera', aliases: ['yogur'] },
  { id: 'tofu', label: 'Tofu', group: 'nevera', aliases: ['tofu'] },

  // Carne y pescado
  { id: 'pollo', label: 'Pollo', group: 'carne', aliases: ['pollo'] },
  { id: 'pavo', label: 'Pavo', group: 'carne', aliases: ['pavo'] },
  { id: 'carne-picada', label: 'Carne picada', group: 'carne', aliases: ['carne picada'] },
  { id: 'salmon', label: 'Salmón', group: 'carne', aliases: ['salmon'] },
  {
    id: 'pescado-blanco',
    label: 'Pescado blanco',
    group: 'carne',
    aliases: ['pescado blanco', 'merluza'],
  },
  { id: 'gambas', label: 'Gambas', group: 'carne', aliases: ['gamba'] },
  { id: 'chorizo', label: 'Chorizo', group: 'carne', aliases: ['chorizo'] },
  { id: 'jamon', label: 'Jamón', group: 'carne', aliases: ['jamon'] },
]

const GROUPS = [
  { id: 'verduras', label: 'Verduras y fruta' },
  { id: 'despensa', label: 'Despensa' },
  { id: 'nevera', label: 'Nevera' },
  { id: 'carne', label: 'Carne y pescado' },
]

export const BASIC_PANTRY = ['aceite', 'sal', 'pimienta', 'azucar', 'harina', 'vinagre', 'agua']

export const pantryGroups = GROUPS.map((group) => ({
  ...group,
  items: CATALOG.filter((item) => item.group === group.id),
}))

export const pantryItems = CATALOG

export function defaultPantry() {
  return [...BASIC_PANTRY]
}

function normalize(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

const MATCHERS = CATALOG.flatMap((item) =>
  item.aliases.map((alias) => ({ item, alias: normalize(alias) })),
).sort((a, b) => b.alias.length - a.alias.length)

function matchItem(part) {
  const clean = normalize(part)
  for (const matcher of MATCHERS) {
    const escaped = matcher.alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const pattern = new RegExp(`(^|[^a-z0-9])${escaped}(es|s)?($|[^a-z0-9])`)
    if (pattern.test(clean)) return matcher.item
  }
  return null
}

export function splitIngredient(name) {
  return name
    .replace(/\([^)]*\)/g, ' ')
    .split(/,|\s+y\s+|\s+o\s+|\//)
    .map((part) => part.trim())
    .filter(Boolean)
}

export function ingredientMatches(name) {
  return splitIngredient(name).map((part) => ({ part, catalog: matchItem(part) }))
}

function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

// Devuelve los ingredientes reales de una receta, ya unificados con la despensa.
export function dishItems(dish) {
  const items = new Map()
  for (const ingredient of dish.ingredients) {
    for (const part of splitIngredient(ingredient.n)) {
      const catalog = matchItem(part)
      const key = catalog ? catalog.id : `otro:${normalize(part)}`
      if (!items.has(key)) {
        items.set(key, {
          key,
          label: catalog ? catalog.label : titleCase(part),
          catalog,
        })
      }
    }
  }
  return [...items.values()]
}

export function pantryStatus(dish, pantryIds = []) {
  const selected = new Set(pantryIds)
  const items = dishItems(dish)
  const have = items.filter((item) => item.catalog && selected.has(item.catalog.id))
  const missing = items.filter((item) => !item.catalog || !selected.has(item.catalog.id))
  return {
    items,
    have,
    missing,
    total: items.length,
    ratio: items.length ? have.length / items.length : 1,
    ready: items.length > 0 && missing.length === 0,
  }
}

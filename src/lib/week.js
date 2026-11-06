import { ingredientMatches, pantryItems } from './pantry'
import { mergeQuantities, scaleQuantity } from './quantity'

export const WEEK_DAYS = [
  { id: 'lun', label: 'Lunes' },
  { id: 'mar', label: 'Martes' },
  { id: 'mie', label: 'Miércoles' },
  { id: 'jue', label: 'Jueves' },
  { id: 'vie', label: 'Viernes' },
  { id: 'sab', label: 'Sábado' },
  { id: 'dom', label: 'Domingo' },
]

export const WEEK_SLOTS = [
  { id: 'comida', label: 'Comida' },
  { id: 'cena', label: 'Cena' },
]

const GROUP_ORDER = ['verduras', 'despensa', 'nevera', 'carne', 'otros']
const GROUP_LABEL = {
  verduras: 'Verduras y fruta',
  despensa: 'Despensa',
  nevera: 'Nevera',
  carne: 'Carne y pescado',
  otros: 'Otros',
}

export function emptyPlan() {
  return Object.fromEntries(
    WEEK_DAYS.map((day) => [
      day.id,
      { comida: null, cena: null },
    ]),
  )
}

const CATALOG = new Map(pantryItems.map((item) => [item.id, item]))

export function plannedRecipes(plan, dishes) {
  const seen = new Set()
  for (const day of WEEK_DAYS) {
    for (const slot of WEEK_SLOTS) {
      const id = plan?.[day.id]?.[slot.id]
      if (id) seen.add(id)
    }
  }
  return [...seen]
    .map((id) => dishes.find((dish) => dish.id === id))
    .filter(Boolean)
}

export function shoppingList(plan, dishes, servings, pantryIds = [], includePantry = false) {
  const factor = Math.max(1, Math.min(6, servings)) / 2
  const selected = new Set(pantryIds)
  const items = new Map()

  for (const dish of plannedRecipes(plan, dishes)) {
    for (const ingredient of dish.ingredients) {
      const scaled = scaleQuantity(ingredient.q, factor)
      const matches = ingredientMatches(ingredient.n)
      for (const match of matches) {
        const catalog = match.catalog
        const key = catalog ? catalog.id : `otro:${match.part.toLowerCase()}`
        if (!items.has(key)) {
          items.set(key, {
            key,
            label: catalog ? catalog.label : match.part.charAt(0).toUpperCase() + match.part.slice(1),
            group: catalog?.group ?? 'otros',
            quantities: [],
            dishes: new Set(),
            inPantry: Boolean(catalog && selected.has(catalog.id)),
          })
        }
        const entry = items.get(key)
        if (matches.length === 1) entry.quantities.push(scaled)
        entry.dishes.add(dish.id)
      }
    }
  }

  const groups = new Map(GROUP_ORDER.map((id) => [id, { id, label: GROUP_LABEL[id], items: [] }]))
  for (const entry of items.values()) {
    if (!includePantry && entry.inPantry) continue
    groups.get(entry.group).items.push({
      key: entry.key,
      label: entry.label,
      quantity: mergeQuantities(entry.quantities),
      recipes: entry.dishes.size,
      inPantry: entry.inPantry,
    })
  }

  return [...groups.values()]
    .filter((group) => group.items.length)
    .map((group) => ({
      ...group,
      items: group.items.sort((a, b) => a.label.localeCompare(b.label, 'es')),
    }))
}

export function shoppingListText(groups, servings) {
  const lines = [`Lista de la compra para ${servings} ${servings === 1 ? 'persona' : 'personas'}`, '']
  for (const group of groups) {
    lines.push(group.label)
    for (const item of group.items) {
      const amount = item.quantity ? `: ${item.quantity}` : ''
      lines.push(`- ${item.label}${amount}`)
    }
    lines.push('')
  }
  return lines.join('\n').trim()
}

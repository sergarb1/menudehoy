// Las recetas están escritas para dos personas. Estas funciones escalan las cantidades
// sin inventar precisión: redondean según la unidad y respetan las medidas de cuchara.

const COUNT_UNITS = new Set([
  'diente',
  'hoja',
  'lata',
  'loncha',
  'lomo',
  'rebanada',
  'pizca',
  'rama',
  'bote',
  'paquete',
  'manojo',
  'chorro',
])

export function parseQuantity(value) {
  if (!value) return null
  const match = String(value)
    .trim()
    .match(/^(\d+(?:[.,]\d+)?)\s*(.*)$/)
  if (!match) return null
  return {
    value: Number.parseFloat(match[1].replace(',', '.')),
    unit: match[2].trim(),
  }
}

export function formatNumber(value) {
  const rounded = Math.round(value * 10) / 10
  if (Number.isInteger(rounded)) return String(rounded)
  return rounded.toFixed(1).replace('.', ',')
}

function baseUnit(unit) {
  const clean = unit.trim().toLowerCase()
  if (!clean || clean === 'ud' || clean === 'uds' || clean === 'unidad' || clean === 'unidades') {
    return ''
  }
  if (clean.endsWith('es') && COUNT_UNITS.has(clean.slice(0, -2))) return clean.slice(0, -2)
  if (clean.endsWith('s') && COUNT_UNITS.has(clean.slice(0, -1))) return clean.slice(0, -1)
  if (clean === 'cucharadas') return 'cucharada'
  if (clean === 'cucharaditas') return 'cucharadita'
  return clean
}

function withUnit(value, unit) {
  const base = baseUnit(unit)
  if (!base) return formatNumber(value)
  const plural = value !== 1 && (COUNT_UNITS.has(base) || base.startsWith('cucharad'))
  return `${formatNumber(value)} ${base}${plural ? 's' : ''}`
}

export function scaleQuantity(quantity, factor = 1) {
  const parsed = parseQuantity(quantity)
  if (!parsed) return quantity
  const base = baseUnit(parsed.unit)
  let value = parsed.value * factor

  if (base === 'g') value = Math.max(10, Math.round(value / 10) * 10)
  else if (base === 'ml') value = Math.max(25, Math.round(value / 25) * 25)
  else if (base === 'kg') {
    const grams = parsed.value * factor * 1000
    return grams >= 1000 ? `${formatNumber(grams / 1000)} kg` : `${formatNumber(Math.round(grams / 10) * 10)} g`
  } else if (base === 'l') {
    const millilitres = parsed.value * factor * 1000
    return millilitres >= 1000
      ? `${formatNumber(millilitres / 1000)} l`
      : `${formatNumber(Math.round(millilitres / 25) * 25)} ml`
  } else if (base.startsWith('cucharad')) value = Math.max(0.5, Math.round(value * 2) / 2)
  else if (COUNT_UNITS.has(base)) value = Math.max(1, Math.round(value * 2) / 2)
  else value = Math.round(value * 10) / 10

  return withUnit(value, base)
}

function mergeKey(unit) {
  const base = baseUnit(unit)
  if (base === 'kg') return { unit: 'g', factor: 1000 }
  if (base === 'l') return { unit: 'ml', factor: 1000 }
  return { unit: base, factor: 1 }
}

// Junta varias cantidades del mismo ingrediente cuando comparten unidad.
export function mergeQuantities(quantities) {
  const totals = new Map()
  for (const quantity of quantities) {
    const parsed = parseQuantity(quantity)
    if (!parsed) continue
    const { unit, factor } = mergeKey(parsed.unit)
    totals.set(unit, (totals.get(unit) ?? 0) + parsed.value * factor)
  }
  if (!totals.size) return ''

  const parts = [...totals.entries()].map(([unit, value]) => {
    if (unit === 'g' && value >= 1000) return `${formatNumber(value / 1000)} kg`
    if (unit === 'ml' && value >= 1000) return `${formatNumber(value / 1000)} l`
    return withUnit(value, unit)
  })
  return parts.join(' + ')
}

<script setup>
import { computed } from 'vue'

const props = defineProps({
  dish: { type: Object, required: true },
  variant: { type: String, default: 'thumb' },
})

const art = computed(() => {
  if (props.dish.art) return props.dish.art
  const tags = props.dish.tags ?? []
  if (props.dish.id.includes('tostada')) return 'toast'
  if (props.dish.id.includes('hamburguesa')) return 'burger'
  if (props.dish.id.includes('croqueta')) return 'croquetas'
  if (tags.includes('pasta')) return 'pasta'
  if (tags.includes('sopa') || tags.includes('crema') || tags.includes('puré')) return 'bowl'
  if (tags.includes('ensalada')) return 'salad'
  if (tags.includes('arroz')) return 'rice'
  if (tags.includes('huevos')) return 'egg'
  if (tags.includes('pescado') || tags.includes('marisco')) return 'fish'
  if (tags.includes('horno') || tags.includes('pizza')) return 'oven'
  if (tags.includes('legumbres')) return 'bowl'
  if (tags.includes('pollo') || tags.includes('carne') || tags.includes('pavo')) return 'pan'
  return 'plate'
})
</script>

<template>
  <svg
    class="art"
    :class="`art--${variant}`"
    viewBox="0 0 320 180"
    aria-hidden="true"
    preserveAspectRatio="xMidYMid slice"
  >
    <rect width="320" height="180" fill="var(--color-paper-2)" />
    <path
      d="M0 128c34-18 66-16 97-2 34 16 68 16 103 1 37-16 76-15 120 3v50H0Z"
      fill="var(--color-hill-1)"
    />
    <path
      d="M0 148c42-14 79-11 112 1 35 13 67 11 101-2 37-14 72-11 107 2v31H0Z"
      fill="var(--color-hill-2)"
    />
    <ellipse cx="160" cy="154" rx="112" ry="12" fill="var(--color-ink)" opacity="0.12" />

    <!-- Plato y cubiertos: la base común de todas las ilustraciones. -->
    <ellipse
      cx="160"
      cy="108"
      rx="78"
      ry="47"
      fill="var(--color-card)"
      stroke="var(--color-edge)"
      stroke-width="2.5"
    />
    <ellipse
      cx="160"
      cy="108"
      rx="61"
      ry="34"
      fill="var(--color-paper)"
      stroke="var(--color-rule)"
      stroke-width="1.5"
    />

    <g stroke="var(--color-ink)" stroke-width="2.4" stroke-linecap="round" fill="none">
      <path d="M58 64v30c0 4 2 7 6 7s6-3 6-7V64M64 64v75M64 101v38" opacity="0.8" />
      <path d="M262 64c-6 4-8 11-8 18 0 4 3 7 7 7h5v46" opacity="0.8" />
    </g>

    <g v-if="art === 'pasta'">
      <path
        d="M104 112c16-17 31 11 45-3 14-15 27 10 42-2 14-12 27 8 39-3"
        stroke="var(--color-accent-deep)"
        stroke-width="7"
        stroke-linecap="round"
        fill="none"
      />
      <path
        d="M109 123c14-13 27 8 40-3 14-12 28 9 42-1 13-10 24 7 35-2"
        stroke="var(--color-sand)"
        stroke-width="6"
        stroke-linecap="round"
        fill="none"
      />
      <circle cx="127" cy="98" r="8" fill="var(--color-accent-3)" />
      <circle cx="191" cy="119" r="7" fill="var(--color-accent-3)" />
      <path d="M170 93c6-7 14-5 17 2-7 4-13 3-17-2Z" fill="var(--color-leaf)" />
    </g>

    <g v-else-if="art === 'bowl'">
      <path d="M96 102h128c-4 30-25 45-64 45s-60-15-64-45Z" fill="var(--color-card)" stroke="var(--color-edge)" stroke-width="2.4" />
      <ellipse cx="160" cy="102" rx="64" ry="14" fill="var(--color-accent)" />
      <ellipse cx="160" cy="100" rx="54" ry="9" fill="var(--color-accent-deep)" opacity="0.55" />
      <path d="M133 94c8-7 15-4 18 4-7 5-14 4-18-4Z" fill="var(--color-leaf)" />
      <circle cx="181" cy="98" r="5" fill="var(--color-accent-3)" />
      <g stroke="var(--color-kraft)" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.8">
        <path d="M140 78c-5-8 6-11 1-19" />
        <path d="M162 74c-5-8 6-11 1-19" />
        <path d="M184 79c-5-8 6-11 1-17" />
      </g>
    </g>

    <g v-else-if="art === 'salad'">
      <path d="M116 116c-8-16 7-30 21-23-2-16 21-21 27-6 11-12 29-3 25 11 15-2 21 16 9 24Z" fill="var(--color-leaf)" />
      <path d="M129 112c8-10 17-14 28-17M172 111c7-10 13-13 22-16" stroke="var(--color-hill-2)" stroke-width="2.5" fill="none" stroke-linecap="round" />
      <circle cx="142" cy="108" r="7" fill="var(--color-accent-3)" />
      <circle cx="181" cy="102" r="6" fill="var(--color-accent-3)" />
      <rect x="162" y="114" width="11" height="9" rx="1.5" fill="var(--color-card)" stroke="var(--color-edge)" />
      <circle cx="124" cy="101" r="4" fill="var(--color-accent)" />
    </g>

    <g v-else-if="art === 'rice'">
      <ellipse cx="160" cy="111" rx="55" ry="25" fill="var(--color-card)" />
      <g fill="var(--color-sand)">
        <ellipse v-for="n in 26" :key="n" :cx="112 + ((n * 37) % 94)" :cy="96 + ((n * 13) % 28)" rx="4" ry="2.4" :transform="`rotate(${n * 23} ${112 + ((n * 37) % 94)} ${96 + ((n * 13) % 28)})`" />
      </g>
      <circle cx="138" cy="106" r="4" fill="var(--color-leaf)" />
      <circle cx="177" cy="112" r="3.6" fill="var(--color-leaf)" />
      <circle cx="157" cy="98" r="3.4" fill="var(--color-leaf)" />
      <path d="M145 116h26" stroke="var(--color-accent)" stroke-width="4" stroke-linecap="round" />
    </g>

    <g v-else-if="art === 'egg'">
      <path d="M112 104c0-19 18-29 31-17 7-18 36-18 43 1 17-7 30 9 26 24-4 14-18 20-34 17-10-2-17-1-27 2-18 5-39-6-39-27Z" fill="var(--color-card)" stroke="var(--color-edge)" stroke-width="2" />
      <circle cx="164" cy="103" r="15" fill="var(--color-accent)" />
      <circle cx="159" cy="98" r="5" fill="var(--color-accent-deep)" opacity="0.55" />
      <path d="M120 88c8 3 13 9 15 16" stroke="var(--color-rule)" stroke-width="2" fill="none" />
    </g>

    <g v-else-if="art === 'fish'">
      <path d="M117 110c20-23 52-27 76-8 8 6 14 8 20 6-2 8-8 13-16 14-24 16-56 12-80-12Z" fill="var(--color-sugar)" stroke="var(--color-edge)" stroke-width="2" />
      <circle cx="137" cy="103" r="3" fill="var(--color-ink)" />
      <path d="M116 110c-9-7-12-3-14 2 5 1 8 3 11 6" fill="var(--color-sugar)" stroke="var(--color-edge)" stroke-width="2" />
      <circle cx="191" cy="108" r="13" fill="var(--color-accent)" />
      <path d="M178 108h26M191 95c-4 7-4 18 0 26M181 99c6 5 14 5 20 0" stroke="var(--color-card)" stroke-width="2" fill="none" />
      <path d="M121 121c7 6 16 8 25 7" stroke="var(--color-leaf)" stroke-width="3" fill="none" stroke-linecap="round" />
    </g>

    <g v-else-if="art === 'pan'">
      <ellipse cx="160" cy="108" rx="61" ry="35" fill="var(--color-ink)" opacity="0.14" />
      <path d="M101 103h112c0 25-19 37-56 37s-56-12-56-37Z" fill="var(--color-ink-2)" />
      <ellipse cx="157" cy="103" rx="56" ry="17" fill="var(--color-kraft)" />
      <path d="M248 94h-36" stroke="var(--color-ink-2)" stroke-width="7" stroke-linecap="round" />
      <rect x="126" y="91" width="25" height="17" rx="7" fill="var(--color-accent-3)" transform="rotate(-12 138 99)" />
      <rect x="157" y="90" width="26" height="18" rx="7" fill="var(--color-sand)" transform="rotate(9 170 99)" />
      <path d="M137 106c9 5 18 5 27 1" stroke="var(--color-leaf)" stroke-width="3.4" fill="none" stroke-linecap="round" />
      <path d="M184 107c6-4 12-4 18-1" stroke="var(--color-accent)" stroke-width="3.4" fill="none" stroke-linecap="round" />
    </g>

    <g v-else-if="art === 'oven'">
      <rect x="101" y="84" width="118" height="47" rx="9" fill="var(--color-ink-2)" />
      <rect x="108" y="91" width="104" height="33" rx="5" fill="var(--color-paper-2)" />
      <path d="M109 116c13-11 23 6 35-2 12-8 21 5 33-3 9-6 18 2 26-3" stroke="var(--color-accent)" stroke-width="5" fill="none" stroke-linecap="round" />
      <circle cx="124" cy="103" r="6" fill="var(--color-accent-3)" />
      <circle cx="194" cy="101" r="6" fill="var(--color-leaf)" />
      <path d="M164 100h18" stroke="var(--color-sand)" stroke-width="6" stroke-linecap="round" />
    </g>

    <g v-else-if="art === 'toast'">
      <path d="M124 86h68c9 0 15 7 13 16-1 5-4 8-4 13v21h-86v-21c0-5-3-8-4-13-2-9 4-16 13-16Z" fill="var(--color-sand)" stroke="var(--color-edge)" stroke-width="2.4" />
      <path d="M139 96c13-3 25-3 38 0 8 2 11 10 6 16-6 7-14 9-23 7-12-2-22-3-27-10-4-6 0-11 6-13Z" fill="var(--color-leaf)" />
      <circle cx="166" cy="105" r="9" fill="var(--color-accent)" />
      <circle cx="163" cy="102" r="3" fill="var(--color-accent-deep)" opacity="0.55" />
    </g>

    <g v-else-if="art === 'burger'">
      <path d="M113 93c2-18 20-27 47-27s45 9 47 27Z" fill="var(--color-sand)" stroke="var(--color-edge)" stroke-width="2.2" />
      <path d="M111 98h98" stroke="var(--color-leaf)" stroke-width="9" stroke-linecap="round" />
      <path d="M115 108h90" stroke="var(--color-accent-3)" stroke-width="10" stroke-linecap="round" />
      <path d="M113 119h94" stroke="var(--color-accent)" stroke-width="6" stroke-linecap="round" />
      <path d="M116 126h88c-3 13-19 17-44 17s-41-4-44-17Z" fill="var(--color-sand)" stroke="var(--color-edge)" stroke-width="2.2" />
      <circle cx="143" cy="87" r="2" fill="var(--color-card)" />
      <circle cx="164" cy="82" r="2" fill="var(--color-card)" />
      <circle cx="185" cy="88" r="2" fill="var(--color-card)" />
    </g>

    <g v-else-if="art === 'croquetas'">
      <rect x="121" y="99" width="31" height="16" rx="8" fill="var(--color-sand)" stroke="var(--color-edge)" stroke-width="2" transform="rotate(-10 136 107)" />
      <rect x="148" y="104" width="34" height="16" rx="8" fill="var(--color-accent-deep)" stroke="var(--color-edge)" stroke-width="2" transform="rotate(7 165 112)" />
      <rect x="176" y="96" width="29" height="15" rx="7.5" fill="var(--color-sand)" stroke="var(--color-edge)" stroke-width="2" transform="rotate(-6 190 103)" />
      <path d="M124 119c9-7 18-4 24 4-8 5-17 4-24-4Z" fill="var(--color-leaf)" />
      <circle cx="187" cy="119" r="6" fill="var(--color-accent-3)" />
    </g>

    <g v-else>
      <ellipse cx="160" cy="108" rx="54" ry="30" fill="var(--color-accent)" />
      <circle cx="139" cy="102" r="11" fill="var(--color-accent-3)" />
      <circle cx="179" cy="111" r="9" fill="var(--color-ink)" opacity="0.8" />
      <circle cx="163" cy="91" r="9" fill="var(--color-accent-3)" />
      <path d="M119 118c8 5 15 6 23 6" stroke="var(--color-mint)" stroke-width="4" fill="none" stroke-linecap="round" />
    </g>
  </svg>
</template>

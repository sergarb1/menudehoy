let context = null

// El navegador solo deja crear audio tras un gesto: se prepara al arrancar el temporizador.
export function initAudio() {
  try {
    const Ctor = window.AudioContext || window.webkitAudioContext
    if (!Ctor) return
    context ??= new Ctor()
    if (context.state === 'suspended') context.resume()
  } catch {
    context = null
  }
}

export function chime() {
  try {
    if (context) {
      if (context.state === 'suspended') context.resume()
      const start = context.currentTime
      ;[0, 0.3].forEach((offset, index) => {
        const oscillator = context.createOscillator()
        const gain = context.createGain()
        oscillator.type = 'sine'
        oscillator.frequency.value = index === 0 ? 660 : 880
        gain.gain.setValueAtTime(0.0001, start + offset)
        gain.gain.exponentialRampToValueAtTime(0.18, start + offset + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.0001, start + offset + 0.24)
        oscillator.connect(gain).connect(context.destination)
        oscillator.start(start + offset)
        oscillator.stop(start + offset + 0.26)
      })
    }
  } catch {
    // Sin sonido, el aviso visual y la vibración siguen.
  }
  try {
    navigator.vibrate?.([180, 90, 180])
  } catch {
    // Algunos navegadores no permiten vibrar.
  }
}

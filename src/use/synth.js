import { PolySynth, MonoSynth, start, now, Midi, Transport, Reverb, Frequency, AutoPanner } from 'tone'
import { midi } from './midi'
import { useStorage } from '@vueuse/core'

export const synth = {}



export const synthOptions = reactive({
  midi: useStorage('midi-synth', false),
  bpm: useClamp(useStorage("tempo-bpm", 100), 10, 500),
  quantize: '@16n',
  octave: useClamp(useStorage("synth-transpose", 0), -2, 2),
  transpose: computed(() => synthOptions.octave * 12),
  initiated: false,
  params: {
    oscillator: {
      type: 'sawtooth8'
    },
    volume: -12,
    envelope: {
      attack: 0.005,
      decay: 0.3,
      sustain: 0.4,
      release: 0.8,
    },
    filterEnvelope: {
      attack: 0.001,
      decay: 0.7,
      sustain: 0.5,
      release: 1,
      baseFrequency: 60,
      octaves: 5
    }
  }
})

export function useSynth() {
  if (!synthOptions.initiated) {
    Transport.bpm.set(synthOptions.bpm);
    Transport.start();

    watch(() => synthOptions.params, params => {
      if (synth.poly) {
        synth.poly.set(params)
      }
    }, { deep: true })


    watch(() => midi.note, note => {
      if (!synthOptions.midi) return
      if (note.velocity > 0) {
        synthAttack(Midi(note.number).toFrequency(), note.velocity / 127)
      } else {
        synthRelease(Midi(note.number).toFrequency())
      }
    })

    watch(() => midi.playing, play => {
      if (!play) synthReleaseAll()
    })
  }
  return { init, synth, synthOptions, synthOnce, synthAttack, synthRelease, synthReleaseAll }
}

export function init() {
  start()
  if (synth?.poly) return
  synth.pan = new AutoPanner('4n').toDestination()
  synth.reverb = new Reverb(2.5).connect(synth.pan)
  synth.poly = new PolySynth(MonoSynth, synthOptions.params).connect(synth.pan)

  synth.reverb.wet.set(0.7)
  synth.poly.connect(synth.reverb)
  synth.poly.connect(synth.pan)
  synth.pan.start()


  synthOptions.initiated = true
}

export function synthOnce(note = 'A4', duration = '8n', time) {
  if (!synth.poly || synthOptions.mute) return init()
  synth.poly.triggerAttackRelease(note, duration)
  synth.poly.releaseAll(synthOptions.quantize)
}

export function synthAttack(note, velocity) {
  if (!synth.poly || synthOptions.mute) return init()
  synth.poly.triggerAttack(Frequency(note).transpose(synthOptions.transpose), synthOptions.quantize, velocity)
}

export function synthRelease(note) {
  if (!synth.poly || synthOptions.mute) return init()
  synth.poly.triggerRelease(Frequency(note).transpose(synthOptions.transpose), synthOptions.quantize)
}

export function synthReleaseAll() {
  if (!synth.poly || synthOptions.mute) return init()
  synth.poly.releaseAll(synthOptions.quantize)
}



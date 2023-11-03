import { WebMidi, Note } from "webmidi";
import { useStorage, useRafFn, onKeyDown, onKeyUp } from "@vueuse/core";
import { synthOptions } from "./synth";


export const midi = reactive({
  enabled: false,
  initiated: false,
  keyboardInitiated: false,
  offset: -1,
  out: true,
  inputs: {},
  outputs: {},
  forwards: {},
  playing: false,
  channels: {},
  channel: useStorage("global-midi-channel", 1),
  note: null,
  time: 0,
  duration: 0,
  maxDuration: 3000,
  message: null,
  log: [],
  cc: {},
  clock: 0,
  filter: useStorage("global-midi-filter", {}),
  available: computed(() => Object.entries(midi.outputs).length > 0),
  total: {
    hits: 0,
    dur: 0,
    duration: computed(() => midi.total.dur + midi.duration),
    notes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    durations: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    durs: computed(() => midi.total.durations.map((d, p) => ({ pitch: p, dur: d })).filter(el => el.dur > 0)),
    reset() {
      midi.total.hits = 0;
      midi.total.dur = 0
      midi.total.notes = new Array(12).fill(0)
      midi.total.durations = new Array(12).fill(0)
    }
  }
});

const noteKeys = {
  KeyA: { note: 'C', offset: 0 },
  KeyW: { note: 'C#', offset: 0 },
  KeyS: { note: 'D', offset: 0 },
  KeyE: { note: 'D#', offset: 0 },
  KeyD: { note: 'E', offset: 0 },
  KeyF: { note: 'F', offset: 0 },
  KeyT: { note: 'F#', offset: 0 },
  KeyG: { note: 'G', offset: 0 },
  KeyY: { note: 'G#', offset: 0 },
  KeyH: { note: 'A', offset: 0 },
  KeyU: { note: 'A#', offset: 0 },
  KeyJ: { note: 'B', offset: 0 },
  KeyK: { note: 'C', offset: 1 },
  KeyO: { note: 'C#', offset: 1 },
  KeyL: { note: 'D', offset: 1 },
  KeyP: { note: 'D#', offset: 1 },
  Semicolon: { note: 'E', offset: 1 },
  Quote: { note: 'F', offset: 1 },
  BracketRight: { note: 'F#', offset: 1 },
}


export function useKeyboard() {

  if (midi.keyboardInitiated) return

  document.addEventListener('keydown', e => {
    if (e.code == 'KeyZ') midi.offset--
    if (e.code == 'KeyX') midi.offset++
    if (e.repeat || !noteKeys[e.code]) return
    if (e.ctrlKey || e.altKey || e.metaKey) return
    if (e.code == 'Slash' || e.code == 'Quote') e.preventDefault()
    playMidi(noteKeys[e.code].note, noteKeys[e.code].offset)
  })

  document.addEventListener('keyup', e => {
    if (!noteKeys[e.code]) return
    playMidi(noteKeys[e.code].note, noteKeys[e.code].offset, true)
  })


  onKeyDown('Enter', () => midi.total.reset())

  midi.keyboardInitiated = true
}

function playMidi(name, offset, off) {
  let title = name + (4 + offset + midi.offset)
  const note = new Note(title, { attack: off ? 0 : 1 })
  const ev = {
    type: off ? 'noteoff' : 'noteon',
    note,
    port: { id: 'PC Keyboard' },
    timestamp: midi.time,
    target: { number: 0 },
  }
  noteInOn(ev)
}



const { pause, resume } = useRafFn(() => {
  midi.time = WebMidi.time
  if (midi?.note?.velocity > 0) {
    midi.duration = WebMidi.time - midi?.note?.timestamp
  } else {
    midi.total.dur += midi.duration
    midi.total.durations[midi?.note?.pitch || 0] += midi.duration
    midi.duration = 0
  }
})

watch(() => midi.duration, dur => {
  if (dur > midi.maxDuration) {
    midi.total.reset()
  }
})


export function useMidi() {
  onMounted(() => {
    if (WebMidi.supported) {
      setupMidi();
    }
  });

  watchEffect(() => {
    if (!midi.out) return;
    let outs = Object.values(WebMidi.outputs);
    if (midi.playing) {
      outs.forEach((output) => {
        output.sendContinue();
      });
    } else {
      outs.forEach((output) => {
        output.sendStop();
      });
    }
  });

  return {
    midi,
    midiAttack,
    midiRelease,
    midiOnce,
    setCC,
    WebMidi,
  };
}

function setupMidi() {
  if (midi.initiated) return;
  WebMidi.enable();
  WebMidi.addListener("enabled", (e) => {
    midi.enabled = true;
    initMidi();
  });

  // let interval = setInterval(() => {
  //   initMidi();
  // }, 3000);

  WebMidi.addListener("connected", (e) => {
    initMidi();
  });

  WebMidi.addListener("disconnected", (e) => {
    delete midi[e.port.type + "s"][e.port.id];
  });
  midi.initiated = true;
}


function initMidi() {
  midi.inputs = reactive({});

  WebMidi.inputs.forEach((input) => {
    midi.enabled = true;
    midi.inputs[input.id] = {
      name: input.name,
      manufacturer: input.manufacturer,
      forwarder: input.addForwarder(),
      event: null,
      note: null,
      cc: null
    };
    input.removeListener();
    input.addListener("start", () => {
      midi.playing = true;
    });
    input.addListener("stop", () => {
      midi.playing = false;
      midi.channels = {};
    });
    input.addListener('midimessage', ev => {
      if (ev?.message?.type == 'clock') return
      midi.inputs[input.id].event = ev
      midi.message = ev.message
      midi.log.unshift(ev)
      if (midi.log.length > 100) midi.log.pop()
    })
    input.addListener("noteon", (ev) => {
      midi.inputs[input.id].note = noteInOn(ev)

    }, {
      channels: "all",
    });
    input.addListener("noteoff", (ev) => {
      midi.inputs[input.id].note = noteInOn(ev)
    }, { channels: "all" });

    input.addListener("controlchange", (ev) => {
      const cc = ccIn(ev)
      if (!cc) return
      midi.inputs[input.id].cc = cc
      midi.cc = cc
    }, {
      channels: "all",
    });

    input.addListener("clock", (ev) => {
      midi.clock = ev.timestamp;
      //bpm = 60000 / ((ev.timestamp - prevTimestamp) * PPQ)  ppq=24
    });
  });

  midi.outputs = reactive({});
  WebMidi.outputs.forEach((output) => {
    midi.outputs[output.id] = {
      name: output.name,
      manufacturer: output.manufacturer,
    };
  });
}

function noteInOn(ev) {
  let note = ev.note;
  note.port = ev.port.id;
  note.type = ev.type;
  note.timestamp = midi.time;
  note.channel = ev.target.number;
  if (ev.type == "noteoff") {
    note.velocity = 0;
  } else {
    note.velocity = 100;
    midi.total.hits++
    let pitch = (ev.note.number + 3) % 12;
    midi.total.notes[pitch] = midi.total.notes[pitch] + 1
  }
  note.pitch = (note.number + 3) % 12;
  note.octA = Math.floor((note.number + 3) / 12) - 1;
  if (midi.filter[note.channel]) return;
  createChannel(note.channel);
  midi.channels[note.channel].notes[note.number] = note;
  midi.note = note;
  return note
}

function ccIn(ev) {
  if (midi.filter[ev.target.number]) return;
  let cc = {
    channel: ev.target.number,
    timestamp: ev.timestamp,
    number: ev.controller.number,
    value: ev.value,
    raw: ev.rawValue,
    port: ev.port.id,
  };
  createChannel(cc.channel);
  midi.channels[cc.channel].cc[cc.number] = cc;
  return cc
}

function createChannel(ch) {
  if (!midi.channels[ch]) {
    midi.channels[ch] = { num: ch, activeNotes: {}, notes: {}, cc: {} };
  }
}

function setVelocity(channel, note, velocity) {
  if (midi.channels?.[channel]?.notes?.[note]) {
    midi.channels[channel].notes[note].velocity = velocity;
  }
}

export function midiAttack(note, options) {
  if (!midi.out) return;
  let channel = note?.channel || midi.channel;
  setVelocity(channel, note?.number, 100);
  WebMidi.outputs.forEach((output) => {
    output.playNote(note.number, {
      channels: channel,
      ...options,
    });
  });
}

export function midiPlay(note, options) {
  if (!midi.out) return;
  WebMidi.outputs.forEach((output) => {
    output.playNote(note, {
      channels: midi.channel,
      ...options,
    });
  });
}

export function midiStop(note, options) {
  if (!midi.out) return;
  if (note) {
    WebMidi.outputs.forEach((output) => {
      output.stopNote(note, { channels: midi.channel, ...options });
    });
  } else {
    WebMidi.outputs.forEach((output) => {
      output.sendAllNotesOff();
      output.sendAllSoundOff({ time: "+1" });
    });
  }
}

export function midiRelease(note) {
  if (!midi.out) return;
  if (note) {
    let channel = note?.channel || midi.channel;
    setVelocity(channel, note?.number, 0);
    WebMidi.outputs.forEach((output) => {
      output.stopNote(note.number, { channels: channel });
    });
  } else {
    WebMidi.outputs.forEach((output) => {
      output.sendAllNotesOff();
      output.sendAllSoundOff({ time: "+1" });
    });
  }
}

export function midiOnce(note, options) {
  if (!midi.out || midi.filter[midi.channel]) return;
  midiPlay(note, options);
  setTimeout(() => {
    midiStop(note, options);
  }, 300);
}

export function setCC(cc, value) {
  if (!midi.out) return;
  WebMidi.outputs.forEach((output) => {
    output.sendControlChange(Number(cc.number), value, cc.channel);
  });
}

export function stopAll() {
  if (!midi.out) return;
  midi.channels = {};
  midi.playing = false;
  WebMidi.outputs.forEach((output) => {
    output.sendAllNotesOff();
    output.sendAllSoundOff({ time: "+1" });
    output.sendReset();
  });
}


export function forwardMidi(iid, oid) {
  const output = WebMidi.outputs.find((out) => out.id == oid);
  const destinations = midi.inputs[iid].forwarder.destinations;
  const index = destinations.indexOf(output);

  if (index == -1) {
    destinations.push(output);
    midi.forwards[iid] = midi.forwards[iid] || {};
    midi.forwards[iid][oid] = true;
  } else {
    destinations.splice(index, 1);
    delete midi.forwards?.[iid]?.[oid];
  }
}


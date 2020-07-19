import WebAudioFontPlayer from 'webaudiofont';
import { Note } from 'types/notes';
import { _tone_0253_Acoustic_Guitar_sf2_file } from 'assets/0253_Acoustic_Guitar_sf2_file';

const AudioContextFunc = window.AudioContext || (window as any).webkitAudioContext;
const audioContext = new AudioContextFunc();
const player = new WebAudioFontPlayer();

export enum Instrument {
  AcousticGuitar1 = 'AcousticGuitar1',
  ElectricGuitar1 = 'ElectricGuitar1',
}

player.adjustPreset(audioContext, _tone_0253_Acoustic_Guitar_sf2_file);
// eslint-disable-next-line @typescript-eslint/camelcase
let currentInstrument = _tone_0253_Acoustic_Guitar_sf2_file;

export const NOTES_TO_NUMBER = {
  C: 0,
  'C#': 1,
  D: 2,
  'D#': 3,
  E: 4,
  F: 5,
  'F#': 6,
  G: 7,
  'G#': 8,
  A: 9,
  'A#': 10,
  B: 11,
  O: 12, // not sure
};

export const NUMBER_TO_NOTE = {
  0: 'C',
  1: 'C#',
  2: 'D',
  3: 'D#',
  4: 'E',
  5: 'F',
  6: 'F#',
  7: 'G',
  8: 'G#',
  9: 'A',
  10: 'A#',
  11: 'B',
};

// 4*12+0 <div class="c4">

export type NotePlayerData = {
  note: Note;
  octave: number;
};

const getPitch = ({ note, octave }: NotePlayerData): number => {
  return (octave + 1) * 12 + NOTES_TO_NUMBER[note];
};

function pitches(frets: NotePlayerData[]): number[] {
  return frets.map((noteData) => getPitch(noteData));
}

function play(soundData: NotePlayerData): boolean {
  player.queueWaveTable(
    audioContext,
    audioContext.destination,
    currentInstrument,
    0,
    getPitch(soundData),
    1.5
  );
  return false;
}

function playChord(soundData: NotePlayerData[]): boolean {
  player.queueChord(
    audioContext,
    audioContext.destination,
    currentInstrument,
    0,
    pitches(soundData),
    1.5
  );
  return false;
}

async function changeInstrument(instrument: Instrument): Promise<void> {
  /* eslint-disable @typescript-eslint/camelcase */
  if (instrument === Instrument.ElectricGuitar1) {
    const { _tone_0272_Stratocaster_sf2_file } = await import('assets/0272_Stratocaster_sf2_file');
    player.adjustPreset(audioContext, _tone_0272_Stratocaster_sf2_file);

    currentInstrument = _tone_0272_Stratocaster_sf2_file;
  } else if (instrument === Instrument.AcousticGuitar1) {
    currentInstrument = _tone_0253_Acoustic_Guitar_sf2_file;
  }
  /* eslint-disable @typescript-eslint/camelcase */
}

export { play, playChord, changeInstrument };

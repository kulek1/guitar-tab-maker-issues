import WebAudioFontPlayer from 'webaudiofont';
import { Note } from 'types/notes';
import { _tone_0253_Acoustic_Guitar_sf2_file } from 'assets/0253_Acoustic_Guitar_sf2_file';

const AudioContextFunc = window.AudioContext || (window as any).webkitAudioContext;
const audioContext = new AudioContextFunc();
const player = new WebAudioFontPlayer();

player.adjustPreset(audioContext, _tone_0253_Acoustic_Guitar_sf2_file);

const NOTES = {
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

// 4*12+0 <div class="c4">

export type NotePlayerData = {
  note: Note;
  octave: number;
};

const getPitch = ({ note, octave }: NotePlayerData): number => {
  return (octave + 1) * 12 + NOTES[note];
};

function play(soundData: NotePlayerData) {
  player.queueWaveTable(
    audioContext,
    audioContext.destination,
    _tone_0253_Acoustic_Guitar_sf2_file,
    0,
    getPitch(soundData),
    1.5
  );
  return false;
}

export { play };

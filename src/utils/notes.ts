import { Note, NoteInfo } from '~/types/notes';
import { NOTES_PROGRESSION, NOTES_TO_NUMBERS } from '~/constants/notes';

// F#3 -> F# and 3
export const convertToOpenNote = (note: Note): NoteInfo => ({
  note: note.slice(0, note.length - 1) as Note,
  octave: parseInt(note.slice(note.length - 1), 10),
});

export const getNoteWithoutOctave = (note: string): Note => note.slice(0, note.length - 1) as Note;

export const generateOctave = (note: Note): Note[] =>
  NOTES_PROGRESSION.slice(NOTES_TO_NUMBERS[note] - 1);

export const generateOctaveWithNumbers = (note: Note, octave: number): string[] =>
  NOTES_PROGRESSION.slice(NOTES_TO_NUMBERS[note] - 1).map((note) => `${note}${octave}`);

export const getNextNote = (note: Note): Note => {
  const idx = NOTES_PROGRESSION.indexOf(note);

  return idx + 1 < 12 ? NOTES_PROGRESSION[idx + 1] : NOTES_PROGRESSION[0];
};

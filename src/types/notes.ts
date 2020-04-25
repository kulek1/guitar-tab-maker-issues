export type Note = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

export type NoteInfo = {
  note: Note;
  octave: number;
};

export type TabNote = {
  noteNumber: number;
  guitarString: number;
};

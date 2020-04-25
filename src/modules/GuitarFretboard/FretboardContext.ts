import { createContext } from 'react';
import { NoteInfo, Note } from 'types/notes';

export type FretboardCtxValue = {
  openNotes: {
    1: NoteInfo;
    2: NoteInfo;
    3: NoteInfo;
    4: NoteInfo;
    5: NoteInfo;
    6: NoteInfo;
  };
  setOpenNotes: (note: Note, guitarString: number) => void;
};

export const contextInitialValue: FretboardCtxValue = {
  openNotes: {
    1: {
      note: 'E',
      octave: 4,
    },
    2: {
      note: 'B',
      octave: 3,
    },
    3: {
      note: 'G',
      octave: 3,
    },
    4: {
      note: 'D',
      octave: 3,
    },
    5: {
      note: 'A',
      octave: 2,
    },
    6: {
      note: 'E',
      octave: 2,
    },
  },
  setOpenNotes: () => {},
};

const FretboardContext = createContext<FretboardCtxValue>(contextInitialValue);

export default FretboardContext;

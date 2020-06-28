import React from 'react';
import { TabNote, NoteInfo, Note } from 'types/notes';

export type OpenNotes = {
  1: NoteInfo;
  2: NoteInfo;
  3: NoteInfo;
  4: NoteInfo;
  5: NoteInfo;
  6: NoteInfo;
};

type AppCtx = {
  editorState: null;
  openNotes: OpenNotes;
  isMultipleNotes: boolean;
  setIsMultipleNotes: (flag: boolean) => void;
  setEditorState: (state: null) => void;
  addNote: (note: TabNote) => void;
  setOpenNotes: (note: Note, guitarString: number) => void;
  clearEditorState: () => void;
};

export const openNotesInitialValue: OpenNotes = {
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
};

const AppContext = React.createContext<AppCtx>({
  editorState: null,
  openNotes: openNotesInitialValue,
  isMultipleNotes: false,
  setEditorState: () => {},
  setIsMultipleNotes: () => {},
  clearEditorState: () => {},
  addNote: () => {},
  setOpenNotes: () => {},
});

export default AppContext;

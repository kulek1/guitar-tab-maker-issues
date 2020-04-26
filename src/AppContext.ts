import React from 'react';
import { EditorState } from 'draft-js';
import { TabNote, NoteInfo, Note } from 'types/notes';

type OpenNotes = {
  1: NoteInfo;
  2: NoteInfo;
  3: NoteInfo;
  4: NoteInfo;
  5: NoteInfo;
  6: NoteInfo;
};

type AppCtx = {
  editorState: EditorState;
  openNotes: OpenNotes;
  setEditorState: (state: EditorState) => void;
  addNote: (note: TabNote) => void;
  setOpenNotes: (note: Note, guitarString: number) => void;
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
  editorState: EditorState.createEmpty(),
  openNotes: openNotesInitialValue,
  setEditorState: () => {},
  addNote: () => {},
  setOpenNotes: () => {},
});

export default AppContext;

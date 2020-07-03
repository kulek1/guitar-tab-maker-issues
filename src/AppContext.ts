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

export type EditorState = {
  [key: number]: {
    notes: Array<(number | null)[]>;
  };
};

type AppCtx = {
  editorState: EditorState;
  openNotes: OpenNotes;
  currentTabColumn: string;
  currentTabIndex: string;
  isMultipleNotes: boolean;
  setCurrentTabColumn: (column: string) => void;
  setIsMultipleNotes: (flag: boolean) => void;
  setEditorState: (state: EditorState) => void;
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

export const initialEditorState: EditorState = {
  0: {
    notes: [[null, null, null, null, null, null]],
  },
};

const emptyFnc = () => {};

const AppContext = React.createContext<AppCtx>({
  editorState: initialEditorState,
  openNotes: openNotesInitialValue,
  isMultipleNotes: false,
  currentTabColumn: '0',
  currentTabIndex: '0',
  setCurrentTabColumn: emptyFnc,
  setEditorState: emptyFnc,
  setIsMultipleNotes: emptyFnc,
  clearEditorState: emptyFnc,
  addNote: emptyFnc,
  setOpenNotes: emptyFnc,
});

export default AppContext;

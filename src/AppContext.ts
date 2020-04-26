import React from 'react';
import { EditorState } from 'draft-js';
import { TabNote } from 'types/notes';

type AppCtx = {
  editorState: EditorState;
  setEditorState: (state: EditorState) => void;
  addNote: (note: TabNote) => void;
};

const AppContext = React.createContext<AppCtx>({
  editorState: EditorState.createEmpty(),
  setEditorState: () => {},
  addNote: () => {},
});

export default AppContext;

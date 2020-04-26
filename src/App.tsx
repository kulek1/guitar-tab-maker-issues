import React, { useState } from 'react';
import './styles/main.scss';
import TabEditor from 'modules/TabEditor';
import AppContext, { openNotesInitialValue } from 'AppContext';
import { TabNote, Note } from 'types/notes';
import { EditorState } from 'draft-js';
import { getEmptyTablature, insertNote } from 'modules/TabEditor/service';
import { convertToOpenNote } from 'utils/notes';
import GuitarFretboard from './modules/GuitarFretboard';

function App() {
  const [editorState, setEditorState] = useState<EditorState>(getEmptyTablature());
  const [openNotes, setOpenNotes] = useState(openNotesInitialValue);

  function addNote(note: TabNote): void {
    const state = insertNote(editorState, note);
    setEditorState(state);
  }

  function setOpenNote(note: Note, guitarString: number): void {
    setOpenNotes((currentOpenNotes) => ({
      ...currentOpenNotes,
      [guitarString]: convertToOpenNote(note),
    }));
  }

  return (
    <div className="container">
      <header className="header">Guitar</header>
      <AppContext.Provider
        value={{
          editorState,
          setEditorState,
          addNote,
          openNotes,
          setOpenNotes: setOpenNote,
        }}
      >
        <GuitarFretboard />
        <TabEditor />
      </AppContext.Provider>
    </div>
  );
}

export default App;

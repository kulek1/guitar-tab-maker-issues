import React, { useState } from 'react';
import './styles/main.scss';
import TabEditor from 'modules/TabEditor';
import AppContext from 'AppContext';
import { TabNote } from 'types/notes';
import { EditorState } from 'draft-js';
import { getEmptyTablature, insertNote } from 'modules/TabEditor/service';
import GuitarFretboard from './modules/GuitarFretboard';

function App() {
  const [editorState, setEditorState] = useState<EditorState>(getEmptyTablature());

  function addNote(note: TabNote): void {
    const state = insertNote(editorState, note);
    setEditorState(state);
  }

  return (
    <div className="container">
      <header className="header">Guitar</header>
      <AppContext.Provider
        value={{
          editorState,
          setEditorState,
          addNote,
        }}
      >
        <GuitarFretboard />
        <TabEditor />
      </AppContext.Provider>
    </div>
  );
}

export default App;

import React, { useState, useEffect, useRef } from 'react';
import './styles/main.scss';
import TabEditor from 'modules/TabEditor';
import AppContext, { openNotesInitialValue, initialEditorState } from 'AppContext';
import { TabNote, Note } from 'types/notes';
import { convertToOpenNote } from 'utils/notes';
import { insertNoteToState } from 'modules/TabEditor/service';
import GuitarFretboard from './modules/GuitarFretboard';

function App() {
  const isInit = useRef(true);
  const [currentTabColumn, setCurrentTabColumn] = useState('0');
  const [currentTabIndex, setCurrentTabIndex] = useState('0');
  const [openNotes, setOpenNotes] = useState(openNotesInitialValue);
  const [editorState, setEditorState] = useState(initialEditorState);
  const [isMultipleNotes, setIsMultipleNotes] = useState(false);

  function addNote(note: TabNote): void {
    const newState = insertNoteToState({
      editorState,
      tablatureIndex: currentTabIndex,
      tablatureColumn: currentTabColumn,
      note,
    });
    setEditorState(newState);
    const columnsCounter = editorState[currentTabIndex].notes.length;
    const currentTabColumnNumber = parseInt(currentTabColumn, 10);

    console.log(columnsCounter, currentTabColumnNumber);
    if (columnsCounter <= currentTabColumnNumber + 1) {
      const nextColumn = (currentTabColumnNumber + 1).toString();
      console.warn('XD', nextColumn);
      setCurrentTabColumn(nextColumn);
    }
    // const state = isMultipleNotes
    //   ? insertMultipleNote(editorState, note)
    //   : insertNote(editorState, note);
    // setEditorState(state);
  }

  function setOpenNote(note: Note, guitarString: number): void {
    setOpenNotes((currentOpenNotes) => ({
      ...currentOpenNotes,
      [guitarString]: convertToOpenNote(note),
    }));
  }

  function clearEditorState() {}

  useEffect(() => {
    if (isInit.current) {
      isInit.current = false;
    } else {
      // clearEditorState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openNotes]);

  return (
    <div className="container">
      <header className="header">Guitar</header>
      <AppContext.Provider
        value={{
          editorState,
          isMultipleNotes,
          currentTabColumn,
          currentTabIndex,
          setCurrentTabColumn,
          setIsMultipleNotes,
          setEditorState,
          addNote,
          openNotes,
          setOpenNotes: setOpenNote,
          clearEditorState,
        }}
      >
        <TabEditor />
        <GuitarFretboard />
      </AppContext.Provider>
    </div>
  );
}

export default App;

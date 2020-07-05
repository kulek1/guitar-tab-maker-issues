import React, { useState, useEffect, useRef } from 'react';
import './styles/main.scss';
import AppContext, { openNotesInitialValue, initialEditorState, EditorState } from 'AppContext';
import { TabNote, Note } from 'types/notes';
import { convertToOpenNote } from 'utils/notes';
import { insertNoteToState, isSelectionAtEnd } from 'modules/TabEditor/service';
import MainLayout from 'layout/MainLayout';
import { playNotes } from 'modules/TabEditor/player';

function App() {
  const isInit = useRef(true);
  const [currentTabColumn, setCurrentTabColumn] = useState('0');
  const [currentTabIndex, setCurrentTabIndex] = useState('0');
  const [openNotes, setOpenNotes] = useState(openNotesInitialValue);
  const [editorState, setEditorState] = useState<EditorState>(initialEditorState);
  const [isMultipleNotes, setIsMultipleNotes] = useState(false);

  // player
  const playerStop = useRef<{ cancel: () => void }>({ cancel: () => {} });
  const [isPlaying, setIsPlaing] = useState(false);

  function addNote(note: TabNote): void {
    const newState = insertNoteToState({
      editorState,
      tablatureIndex: currentTabIndex,
      tablatureColumn: currentTabColumn,
      note,
    });
    setEditorState(newState);

    if (isSelectionAtEnd(editorState, currentTabIndex, currentTabColumn)) {
      const currentTabColumnNumber = parseInt(currentTabColumn, 10);
      const nextColumn = (currentTabColumnNumber + 1).toString();
      setCurrentTabColumn(nextColumn);
    }
  }

  function setOpenNote(note: Note, guitarString: number): void {
    setOpenNotes((currentOpenNotes) => ({
      ...currentOpenNotes,
      [guitarString]: convertToOpenNote(note),
    }));
  }

  function clearEditorState() {}

  async function handlePlayNotes(): Promise<void> {
    if (isPlaying) {
      setIsPlaing(false);
      playerStop.current.cancel();
    } else {
      setIsPlaing(true);

      await playNotes(editorState, currentTabIndex, openNotes, playerStop.current);
      setIsPlaing(false);
    }
  }

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
          onPlayClick: handlePlayNotes,
          isPlaying,
        }}
      >
        <MainLayout />
      </AppContext.Provider>
    </div>
  );
}

export default App;

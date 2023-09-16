import React, { useState, useEffect, useRef } from 'react';
import './styles/main.scss';
import AppContext, {
  openNotesInitialValue,
  initialEditorState,
  EditorState,
  EditorStateEntry,
} from '~/AppContext';
import { TabNote, Note } from '~/types/notes';
import { convertToOpenNote } from '~/utils/notes';
import { insertNoteToState, isSelectionAtEnd } from '~/modules/TabEditor/service';
import MainLayout from '~/layout/MainLayout';
import { playNotes } from '~/modules/TabEditor/player';
import {
  saveToHistory,
  getHistory,
  removeLastElementFromHistory,
  getEditorState,
  saveEditorState,
} from '~/utils/localStorage';
import TabPreview from '~/components/TabPreview';
import { useToast } from '~/hooks/useToasts';

const App: React.FC = () => {
  const [currentTabColumn, setCurrentTabColumn] = useState('0');
  const [currentTabIndex, setCurrentTabIndex] = useState('0');
  const [openNotes, setOpenNotes] = useState(openNotesInitialValue);
  const [editorState, setEditorState] = useState<EditorState>(initialEditorState);
  const [isMultipleNotes, setIsMultipleNotes] = useState(false);
  const { displayError } = useToast();

  // player
  const playerStop = useRef<{ cancel: () => void }>({ cancel: () => {} });
  const [isPlaying, setIsPlaing] = useState(false);

  function handleEditorState(newEditorState: EditorState): void {
    setEditorState(newEditorState);
    saveEditorState(newEditorState);
  }

  function addNote(note: TabNote): void {
    try {
      const newState = insertNoteToState({
        editorState,
        tablatureIndex: currentTabIndex,
        tablatureColumn: currentTabColumn,
        note,
      });
      const currentTablature: EditorStateEntry = editorState[currentTabIndex];
      if (currentTablature) {
        // Get previous note so we can restore e.g. note change from 4->6
        const previousNote = currentTablature.notes[currentTabColumn][note.guitarString - 1] as
          | string
          | null;

        saveToHistory(previousNote, note, currentTabIndex, currentTabColumn, editorState);
      }
      handleEditorState(newState);

      if (isSelectionAtEnd(editorState, currentTabIndex, currentTabColumn)) {
        const currentTabColumnNumber = parseInt(currentTabColumn, 10);
        const nextColumn = (currentTabColumnNumber + 1).toString();
        setCurrentTabColumn(nextColumn);
      }
    } catch (err) {
      if (err instanceof Error) {
        displayError(err.message);
      }
    }
  }

  function setOpenNote(note: Note, guitarString: number): void {
    setOpenNotes((currentOpenNotes) => ({
      ...currentOpenNotes,
      [guitarString]: convertToOpenNote(note),
    }));
  }

  function clearEditorState(): void {}

  function goBack(): boolean {
    const history = getHistory();
    if (!history) {
      return false;
    }
    const latestEntry = history[history.length - 1];

    const newState = insertNoteToState({
      editorState,
      tablatureIndex: latestEntry.tablatureIndex,
      tablatureColumn: latestEntry.tablatureColumn,
      note: {
        guitarString: latestEntry.guitarString,
        noteNumber: latestEntry.previousNote,
      },
    });
    removeLastElementFromHistory();

    handleEditorState(newState);
    return true;
  }

  async function handlePlayNotes(): Promise<void> {
    if (isPlaying) {
      setIsPlaing(false);
      playerStop.current.cancel();
    } else {
      setIsPlaing(true);

      try {
        await playNotes(editorState, currentTabIndex, openNotes, playerStop.current);
      } catch (err) {
        if (err instanceof Error) {
          displayError(err.message);
        }
      }
      setIsPlaing(false);
    }
  }

  useEffect(() => {
    const cachedEditorState = getEditorState();
    if (cachedEditorState) {
      setEditorState(cachedEditorState);
    }
  }, []);

  return (
    <div className="container">
      <AppContext.Provider
        value={{
          editorState,
          isMultipleNotes,
          currentTabColumn,
          currentTabIndex,
          setCurrentTabColumn,
          setCurrentTabIndex,
          setIsMultipleNotes,
          setEditorState: handleEditorState,
          addNote,
          openNotes,
          setOpenNotes: setOpenNote,
          clearEditorState,
          onPlayClick: handlePlayNotes,
          isPlaying,
          goBack,
        }}
      >
        <MainLayout />
        <TabPreview />
      </AppContext.Provider>
    </div>
  );
};

export default App;

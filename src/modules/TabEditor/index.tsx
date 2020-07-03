import React, { useRef, useContext, useState, useEffect } from 'react';
import cn from 'classnames';
import AppContext from 'AppContext';
import { generateEmptyTablature, isSelectionAtEnd } from './service';
import TabColumns from './TabColumns';

type Props = {};

const TabEditor: React.FC<Props> = () => {
  const playerStop = useRef<{ cancel: () => void }>({ cancel: () => {} });
  const [isPlaying, setIsPlaing] = useState(false);
  const {
    editorState,
    setEditorState,
    currentTabIndex,
    openNotes,
    setCurrentTabColumn,
    currentTabColumn,
    setIsMultipleNotes,
    isMultipleNotes,
  } = useContext(AppContext);

  function addTabBreak(): void {
    // const newState = addNewTablature(editorState, openNotes);
    // setEditorState(EditorState.moveSelectionToEnd(newState));
  }

  async function handlePlayNotes(): Promise<void> {
    if (isPlaying) {
      setIsPlaing(false);
      playerStop.current.cancel();
    } else {
      setIsPlaing(true);

      // await playNotes(editorState, openNotes, playerStop.current);
      setIsPlaing(false);
    }
  }

  function handleDisablingMultipleNotes(): void {
    setIsMultipleNotes(!isMultipleNotes);
    // setEditorState(EditorState.moveFocusToEnd(editorState));
  }

  function nextColumn(): void {
    const currentColumn = parseInt(currentTabColumn, 10);
    if (!isSelectionAtEnd(editorState, currentTabIndex, currentTabColumn)) {
      setCurrentTabColumn((currentColumn + 1).toString());
    }
  }
  function previousColumn(): void {
    const currentColumn = parseInt(currentTabColumn, 10);
    if (currentColumn > 0) {
      setCurrentTabColumn((currentColumn - 1).toString());
    }
  }

  useEffect(() => {
    generateEmptyTablature(openNotes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="tab-editor__container">
      <button type="button">Get RAW</button>
      <button type="button" onClick={addTabBreak}>
        Tab break
      </button>
      <button type="button">Get selection</button>
      <button type="button" onClick={handlePlayNotes}>
        {isPlaying ? 'Stop' : 'Play'}
      </button>
      <button
        type="button"
        onClick={() =>
          isMultipleNotes ? handleDisablingMultipleNotes() : setIsMultipleNotes(!isMultipleNotes)
        }
        className={cn({
          active: isMultipleNotes,
        })}
      >
        Multiple (chord) mode
      </button>
      <button type="button" onClick={previousColumn}>
        {'<'}
      </button>
      <button type="button" onClick={nextColumn}>
        {'>'}
      </button>
      <div>
        <TabColumns />
      </div>
    </div>
  );
};

export default TabEditor;

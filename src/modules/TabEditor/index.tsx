import React, { useRef, useContext, useState, useEffect } from 'react';
import cn from 'classnames';
import AppContext from 'AppContext';
import { EditorRef } from './types';
import { generateEmptyTablature } from './service';
import TabColumns from './TabColumns';

type Props = {};

const TabEditor: React.FC<Props> = () => {
  const playerStop = useRef<{ cancel: () => void }>({ cancel: () => {} });
  const [isPlaying, setIsPlaing] = useState(false);
  const {
    editorState,
    setEditorState,
    openNotes,
    setIsMultipleNotes,
    isMultipleNotes,
  } = useContext(AppContext);

  function addTabBreak(): void {
    // const newState = addNewTablature(editorState, openNotes);
    // setEditorState(EditorState.moveSelectionToEnd(newState));
  }

  // function handlePastedText(
  //   text: string,
  //   html: string | undefined,
  //   editorStateInstance: EditorState
  // ): DraftHandleValue {
  //   const contentBlocksWithPastedText = convertPlainTextToTabBlocks(text);
  //   const contentState = editorState.getCurrentContent();

  //   const selectionState = editorState.getSelection();
  //   const key = selectionState.getAnchorKey();
  //   const blocksBefore = contentState
  //     .getBlockMap()
  //     .takeUntil((_, k) => k === key)
  //     .toArray();
  //   const blocksAfter = contentState
  //     .getBlockMap()
  //     .skipUntil((_, k) => k === key)
  //     .skip(1)
  //     .toArray();

  //   const newBlocks = blocksBefore
  //     .concat([contentState.getBlockForKey(key)])
  //     .concat(contentBlocksWithPastedText)
  //     .concat(blocksAfter);

  //   const newContentState = ContentState.createFromBlockArray(
  //     newBlocks,
  //     contentState.getEntityMap()
  //   );

  //   setEditorState(EditorState.push(editorState, newContentState, 'insert-fragment'));
  //   return 'handled';
  // }

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
      <div>
        <TabColumns />
      </div>
    </div>
  );
};

export default TabEditor;

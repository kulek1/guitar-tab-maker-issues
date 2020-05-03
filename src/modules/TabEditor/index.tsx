import React, { useRef, useContext, useState } from 'react';
import { Editor, EditorState, DraftHandleValue, AtomicBlockUtils } from 'draft-js';
import AppContext from 'AppContext';
import { getRaw, addNewTablature, convertPlainTextToTabBlocks } from './service';
import CursorPointer from './CursorPointer';
import { EditorRef } from './types';
import { playNotes } from './player';

type Props = {};

const TabEditor: React.FC<Props> = () => {
  const playerStop = useRef<{ cancel: () => void }>({ cancel: () => {} });
  const [isPlaying, setIsPlaing] = useState(false);
  const editorRef = useRef<EditorRef>(null);
  const { editorState, setEditorState, openNotes } = useContext(AppContext);

  function focusEditor(): void {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }

  function addTabBreak(): void {
    const newState = addNewTablature(editorState, openNotes);
    setEditorState(EditorState.moveSelectionToEnd(newState));
  }

  function handlePastedText(
    text: string,
    html: string | undefined,
    editorStateInstance: EditorState
  ): DraftHandleValue {
    const contentStateWithPastedText = convertPlainTextToTabBlocks(text);
    const contentState = editorState.getCurrentContent();

    // const entityKey = contentState.getLastCreatedEntityKey();
    // setEditorState(newEditorStateWithBlock);
    setEditorState(EditorState.push(editorState, contentStateWithPastedText, 'insert-fragment'));
    return 'handled';
  }

  async function handlePlayNotes(): Promise<void> {
    if (isPlaying) {
      setIsPlaing(false);
      playerStop.current.cancel();
    } else {
      setIsPlaing(true);

      await playNotes(editorState, openNotes, playerStop.current);
      setIsPlaing(false);
    }
  }

  return (
    <div className="tab-editor__container">
      <button type="button" onClick={() => getRaw(editorState)}>
        Get RAW
      </button>
      <button type="button" onClick={addTabBreak}>
        Tab break
      </button>
      <button type="button" onClick={() => console.log(editorState.getSelection())}>
        Get selection
      </button>
      <button type="button" onClick={handlePlayNotes}>
        {isPlaying ? 'Stop' : 'Play'}
      </button>
      <div className="tab-editor__code" onClick={focusEditor}>
        <Editor
          ref={editorRef}
          editorState={editorState}
          onChange={setEditorState}
          handlePastedText={handlePastedText}
        />
        <CursorPointer editorState={editorState} setEditorChange={setEditorState} />
      </div>
    </div>
  );
};

export default TabEditor;

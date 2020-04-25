import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import { Editor, EditorState, convertFromHTML, ContentState, SelectionState } from 'draft-js';
import AppContext from 'AppContext';
import { getEmptyTablature, insertNote, getRaw } from './service';
import CursorPointer from './CursorPointer';
import { CursorPosition, EditorRef } from './types';

type Props = {};

const TabEditor: React.FC<Props> = () => {
  const editorRef = useRef<EditorRef>(null);
  const [editorState, setEditorState] = useState<EditorState>(getEmptyTablature());
  const editorStateCopyRef = useRef<EditorState>(editorState);
  const { notes } = useContext(AppContext);

  editorStateCopyRef.current = editorState; // useEffect caches useState vars so we need useRef

  function getCursorPosition(selection: SelectionState) {
    return {
      focusKey: selection.getFocusKey(),
      focusOffset: selection.getFocusOffset(),
    };
  }

  // const handleMouseUp = (): void => {
  //   setTimeout(() => {
  //     const selection = editorStateCopyRef.current.getSelection();
  //     setCursorPosition(getCursorPosition(selection));
  //   }, 0);
  // };

  // useEffect(
  //   function getMousePosition() {
  //     editorRef?.current?.editor.addEventListener('mouseup', handleMouseUp);
  //     return (): void => {
  //       editorRef?.current?.editor.removeEventListener('mouseup', handleMouseUp);
  //     };
  //   },
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   []
  // );

  function focusEditor(): void {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }

  useEffect(() => {
    if (notes.length) {
      const state = insertNote(editorState, notes[notes.length - 1]);
      setEditorState(state);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notes]);

  return (
    <div className="tab-editor__container">
      <button type="button" onClick={() => getRaw(editorState)}>
        Get RAW
      </button>
      {/* <button type="button" onClick={insertBlocksFromHtml}>
        Insert new block from HTML
      </button> */}
      <button type="button" onClick={() => console.log(editorState.getSelection())}>
        Get selection
      </button>
      <div className="tab-editor__code" onClick={focusEditor}>
        <Editor ref={editorRef} editorState={editorState} onChange={setEditorState} />
        <CursorPointer editorState={editorState} setEditorChange={setEditorState} />
      </div>
    </div>
  );
};

export default TabEditor;

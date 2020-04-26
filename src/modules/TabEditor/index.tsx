import React, { useRef, useContext } from 'react';
import { Editor, EditorState } from 'draft-js';
import AppContext from 'AppContext';
import { getRaw, addNewTablature } from './service';
import CursorPointer from './CursorPointer';
import { EditorRef } from './types';
import { playNotes } from './player';

type Props = {};

const TabEditor: React.FC<Props> = () => {
  const editorRef = useRef<EditorRef>(null);
  const { editorState, setEditorState } = useContext(AppContext);

  function focusEditor(): void {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }

  function addTabBreak() {
    const newState = addNewTablature(editorState);
    setEditorState(EditorState.moveSelectionToEnd(newState));
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
      <button type="button" onClick={() => playNotes(editorState)}>
        Play
      </button>
      <div className="tab-editor__code" onClick={focusEditor}>
        <Editor ref={editorRef} editorState={editorState} onChange={setEditorState} />
        <CursorPointer editorState={editorState} setEditorChange={setEditorState} />
      </div>
    </div>
  );
};

export default TabEditor;

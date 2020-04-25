import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  Editor,
  EditorState,
  convertFromHTML,
  convertFromRaw,
  convertToRaw,
  ContentState,
  Modifier,
} from 'draft-js';
import AppContext from 'AppContext';
import { getEmptyTablature, insertNote, getRaw, getSelection } from './service';

type Props = {};

const TabEditor: React.FC<Props> = () => {
  const editor = useRef<Editor>(null);
  const { notes } = useContext(AppContext);

  const [editorState, setEditorState] = useState(getEmptyTablature());

  function focusEditor(): void {
    if (editor.current) {
      editor.current.focus();
    }
  }

  // function appendToCurrentPosition({ noteNumber, guitarString }: TabNote): void {
  //   const selection = editorState.getSelection();
  //   const contentState = editorState.getCurrentContent();
  //   let nextEditorState = EditorState.createEmpty();
  //   if (selection.isCollapsed()) {
  //     const nextContentState = Modifier.insertText(contentState, selection, noteNumber.toString());
  //     nextEditorState = EditorState.push(editorState, nextContentState, 'insert-characters');
  //   } else {
  //     const nextContentState = Modifier.replaceText(contentState, selection, noteNumber.toString());
  //     nextEditorState = EditorState.push(editorState, nextContentState, 'insert-characters');
  //   }
  //   setEditorState(nextEditorState);
  // }

  function insertBlocksFromHtml(htmlString) {
    const newBlockMap = convertFromHTML('xd');
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const key = selectionState.getAnchorKey();
    const blocksAfter = contentState
      .getBlockMap()
      .skipUntil(function (_, k) {
        return k === key;
      })
      .skip(1)
      .toArray();
    const blocksBefore = contentState
      .getBlockMap()
      .takeUntil(function (_, k) {
        return k === key;
      })
      .toArray();

    newBlockMap.contentBlocks = blocksBefore
      .concat([contentState.getBlockForKey(key)])
      .concat(newBlockMap.contentBlocks)
      .concat(blocksAfter);

    const newContentState = ContentState.createFromBlockArray(
      newBlockMap as any,
      newBlockMap.entityMap
    );
    const newEditorState = EditorState.createWithContent(newContentState);
    setEditorState(newEditorState);
  }
  // console.warn(editorState.getCurrentContent().getPlainText());

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
      <button type="button" onClick={insertBlocksFromHtml}>
        Insert new block from HTML
      </button>
      <button type="button" onClick={() => getSelection(editorState)}>
        Get selection
      </button>
      <div className="tab-editor__code" onClick={focusEditor}>
        <Editor ref={editor} editorState={editorState} onChange={setEditorState} />
      </div>
    </div>
  );
};

export default TabEditor;

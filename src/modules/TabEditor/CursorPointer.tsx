import React, { useEffect, useCallback, useRef, CSSProperties, useState } from 'react';
import PropTypes from 'prop-types';
import { EditorState } from 'draft-js';
import { CursorPosition, EditorRef } from './types';
import { getEditorStateWithFocus } from './service';

// https://stackoverflow.com/questions/42646339/monospace-font-with-exactly-15px-height-and-7px-width
// Font size:
// 16px
//
// Width (1 character): 9.609375
// Height (1 character): 18
const OFFSET = 3;
const FONT_WIDTH_PX = 9.609375;

type Props = {
  // editorRef: React.RefObject<EditorRef>;
  editorState: EditorState;
  setEditorChange: (state: EditorState) => void;
};

type Position = {
  left: number;
  top: number;
};

const spaceChars = ['-', ''];

const previousOffset: number | null = null;
const previousKey: number | null = null;

const CursorPointer: React.FC<Props> = ({ editorState, setEditorChange }) => {
  const [position, setPosition] = useState<Position>({ left: 0, top: 0 });

  const updatePointerPosition = useCallback(() => {
    const { focusOffset = 0, focusKey } = editorState.getSelection().toObject();
    if (
      typeof focusOffset !== 'number' ||
      previousKey === focusKey ||
      previousOffset === focusOffset
    ) {
      // it prevents from infinite loop
      return;
    }
    const block = editorState.getCurrentContent().getBlockForKey(focusKey);
    const blockText = block.getText();

    const focusChar = blockText[focusOffset];
    const focusNextChar = blockText[focusOffset];

    let left = 0;
    let newFocusOffset = focusOffset;

    if (focusChar === '-' || !focusChar) {
      left = focusOffset * FONT_WIDTH_PX - OFFSET;
    } else {
      console.log('BIGGER', spaceChars.includes(focusChar), spaceChars.includes(focusNextChar));
      left = (focusOffset - 1) * FONT_WIDTH_PX - OFFSET;
      newFocusOffset -= 1;

      setEditorChange(getEditorStateWithFocus(editorState, focusKey, newFocusOffset));
    }
    setPosition({
      left,
      top: 25,
    });
  }, [editorState, setEditorChange]);

  useEffect(() => {
    updatePointerPosition();
  }, [editorState, updatePointerPosition]);

  return (
    <div
      className="cursor-pointer"
      style={{
        left: position.left,
        top: position.top,
      }}
    >
      <div className="cursor-pointer__tail" />
    </div>
  );
};

CursorPointer.propTypes = {};

export default CursorPointer;

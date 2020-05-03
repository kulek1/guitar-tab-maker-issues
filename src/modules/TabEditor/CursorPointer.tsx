import React, { useEffect, useCallback, useState } from 'react';
import { EditorState, ContentBlock } from 'draft-js';
import {
  getEditorStateWithFocus,
  checkIfHasTwoNumberNoteInColumn,
  hasTablatureSyntax,
  findGuitarStringsInBlock,
} from './service';

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

const previousOffset: number | null = null;
const previousKey: number | null = null;

const CursorPointer: React.FC<Props> = ({ editorState, setEditorChange }) => {
  const [position, setPosition] = useState<Position>({ left: 0, top: 0 });
  const [isVisible, setIsVisible] = useState(false);

  const updatePointerPosition = useCallback(
    (selectionObject, block: ContentBlock) => {
      const { focusOffset = 0, focusKey } = selectionObject;
      if (
        typeof focusOffset !== 'number' ||
        previousKey === focusKey ||
        previousOffset === focusOffset
      ) {
        // it prevents from infinite loop
        return;
      }
      let left = 0;
      let newFocusOffset = focusOffset;

      const { tabBlocks, firstStringIndex } = findGuitarStringsInBlock(
        editorState.getCurrentContent(),
        block
      );
      const firstBlock = tabBlocks[firstStringIndex];

      if (!firstBlock) {
        setIsVisible(false);
        return;
      }

      const firstBlockKey = firstBlock.getKey();

      if (checkIfHasTwoNumberNoteInColumn(focusOffset, tabBlocks)) {
        left = (focusOffset - 1) * FONT_WIDTH_PX - OFFSET;
        newFocusOffset -= 1;

        setEditorChange(getEditorStateWithFocus(editorState, focusKey, newFocusOffset));
      } else {
        left = focusOffset * FONT_WIDTH_PX - OFFSET;
      }

      const firstBlockEl = document.querySelector(
        `div[data-offset-key^="${firstBlockKey}"]`
      ) as HTMLDivElement;

      setPosition({
        left,
        top: firstBlockEl.offsetTop,
      });
    },
    [editorState, setEditorChange]
  );

  useEffect(() => {
    const selectionObject = editorState.getSelection().toObject();
    const selectedBlock = editorState.getCurrentContent().getBlockForKey(selectionObject.focusKey);

    if (hasTablatureSyntax(selectedBlock.getText())) {
      updatePointerPosition(selectionObject, selectedBlock);
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [editorState, updatePointerPosition]);

  return (
    <div
      className={`cursor-pointer ${isVisible ? 'cursor-pointer--visible' : ''}`}
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

import {
  genKey,
  ContentState,
  EditorState,
  Modifier,
  convertToRaw,
  ContentBlock,
  SelectionState,
  RichUtils,
} from 'draft-js';
import { TabNote } from 'types/notes';
import { Map } from 'immutable';
import { id } from 'utils/id';
import { NOTES_PROGRESSION } from 'constants/notes';
import { OpenNotes } from 'AppContext';

const TAB_BLOCK_TYPE = 'TabLine';

const TAB_NOTATIONS = ['/', '\\', 'h', 'p', 's', 'b', 'x', '~'];
export const hasNoteOrTabNotation = (char: string): boolean =>
  !!Number(char) || TAB_NOTATIONS.includes(char);

export const hasTablatureSyntax = (text: string) =>
  NOTES_PROGRESSION.some((note) => text.toUpperCase().startsWith(`${note}|`));

export const getOpenNotesArray = (openNotes: OpenNotes): string[] =>
  Object.values(openNotes).map((openNote) => openNote.note);

export const getEmptyTablature = (openNotes: OpenNotes): EditorState => {
  const newId = id();
  const blocks = getOpenNotesArray(openNotes).map((word, idx) => {
    return new ContentBlock({
      key: genKey(),
      type: 'TabLine',
      text: `${word}|--`,
      data: Map({
        guitarString: idx + 1,
        id: newId,
      }),
    });
  });
  const contentState = ContentState.createFromBlockArray(blocks as any);
  const initialState = EditorState.createWithContent(contentState);
  return EditorState.moveSelectionToEnd(initialState);
};

export const addNewTablature = (editorState: EditorState, openNotes: OpenNotes): EditorState => {
  const currentBlocks = editorState.getCurrentContent().getBlocksAsArray();

  const keyForEmptyBlock = genKey();

  const newId = id();
  const blocks = getOpenNotesArray(openNotes).map((word, idx) => {
    return new ContentBlock({
      key: genKey(),
      type: 'TabLine',
      text: `${word}|--`,
      data: Map({
        guitarString: idx + 1,
        id: newId,
      }),
    });
  });

  const contentState = ContentState.createFromBlockArray([
    ...currentBlocks,
    new ContentBlock({ key: keyForEmptyBlock }),
    ...blocks,
  ] as any);

  return EditorState.push(editorState, contentState, 'insert-fragment');
};

export const convertPlainTextToTabBlocks = (text: string): ContentBlock[] => {
  const textBlocks = text.split(/[\r\n]+/);
  const textBlocksLength = textBlocks.length;
  const contentBlocks: ContentBlock[] = [];

  let tabId = id();
  let newTabGuitarStringCounter = 0;
  let previousIndex = 0;
  for (let i = 0; i < textBlocksLength; i++) {
    if (newTabGuitarStringCounter > 6) {
      newTabGuitarStringCounter = 0;
      tabId = id();
    }
    if (hasTablatureSyntax(textBlocks[i])) {
      contentBlocks.push(
        new ContentBlock({
          key: genKey(),
          type: 'TabLine',
          text: textBlocks[i],
          data: Map({
            guitarString: newTabGuitarStringCounter + 1,
            id: tabId,
          }),
        })
      );
      newTabGuitarStringCounter += 1;
    } else if (previousIndex > 0 && previousIndex + 1 !== i) {
      alert("You're tablature seems to be broken. Please, fix it to be able to paste it.");
    } else {
      contentBlocks.push(
        new ContentBlock({
          key: genKey(),
          text: textBlocks[i],
        })
      );
    }
    previousIndex = i;
  }
  return contentBlocks;
};

export const getRaw = (editorState: EditorState): void => {
  const { blocks } = convertToRaw(editorState.getCurrentContent());
  console.warn(blocks);
};

export const findGuitarStringsInBlock = (
  contentState: ContentState,
  block: ContentBlock
): { tabBlocks: ContentBlock[]; firstStringIndex: number } => {
  const blockData = block.getData();
  const blockKey = block.getKey();
  const tabId = blockData.get('id');

  const tabBlocks: ContentBlock[] = [];
  let counter = 0; // max 6 strings
  let currentKey = blockKey;

  // Scan only next 5 blocks and 5 previous blocks because tab lines should be together
  // and there's no point of scanning all of them

  tabBlocks.push(block);

  // goes up
  while (counter < 6) {
    counter += 1;
    const newBlock = contentState.getBlockAfter(currentKey);
    if (newBlock && newBlock.getData().get('id') === tabId) {
      tabBlocks.push(newBlock);
      currentKey = newBlock.getKey();
    } else {
      break;
    }
  }
  currentKey = blockKey;
  // goes down
  while (counter < 6) {
    counter += 1;
    const newBlock = contentState.getBlockBefore(currentKey);
    if (newBlock && newBlock.getData().get('id') === tabId) {
      tabBlocks.push(newBlock);
      currentKey = newBlock.getKey();
    } else {
      break;
    }
  }

  const firstStringIndex = blockData.get('guitarString') === 1 ? 0 : 5;
  return { tabBlocks, firstStringIndex };
};

export const checkIfHasTwoNumberNoteInColumn = (
  focusOffset: number,
  blocks: ContentBlock[]
): boolean => {
  const match = blocks.find((lineBlock: ContentBlock) => {
    const text = lineBlock.getText();
    if (hasNoteOrTabNotation(text[focusOffset - 1]) && hasNoteOrTabNotation(text[focusOffset])) {
      return true;
    }
    return false;
  });
  return !!match;
};

export const checkIfHasTwoNumberNoteInColumnByBlock = (
  contentState: ContentState,
  focusOffset: number,
  block: ContentBlock
): boolean => {
  const { tabBlocks } = findGuitarStringsInBlock(contentState, block);

  return checkIfHasTwoNumberNoteInColumn(focusOffset, tabBlocks);
};

export const getTabBlockBasedOnSelection = (
  selection: SelectionState,
  contentState: ContentState
): ContentBlock => {
  const blockKey = selection.get('anchorKey');
  const block = contentState.getBlockForKey(blockKey);

  if (block.getType() !== TAB_BLOCK_TYPE) {
    throw new Error('This selection is not on Tab block');
  }
  if (!hasTablatureSyntax(block.getText())) {
    throw new Error('This selection does not have tablature syntax');
  }
  return block;
};

export const getEditorStateWithFocus = (
  editorState: EditorState,
  blockKey: string,
  offset: number
): EditorState => {
  const newSelectionState = SelectionState.createEmpty(blockKey).merge({
    focusOffset: offset,
    anchorOffset: offset,
  });
  return EditorState.forceSelection(editorState, newSelectionState as SelectionState);
};

export const insertMultipleNote = (
  editorState: EditorState,
  { noteNumber, guitarString }: TabNote
) => {
  try {
    const selection = editorState.getSelection();
    const focusOffset = selection.getFocusOffset();
    const anchorOffset = selection.getAnchorOffset();
    const contentState = editorState.getCurrentContent();

    const block = getTabBlockBasedOnSelection(selection, contentState);
    const { tabBlocks } = findGuitarStringsInBlock(contentState, block);

    let nextEditorState = EditorState.createEmpty();
    let nextContentState = contentState;

    const isFirstNoteInColumn = tabBlocks.some((tabBlock) => {
      return !tabBlock.getText()[focusOffset];
    });
    const noteAsString = noteNumber.toString();
    const spaceToAdd = noteAsString.length === 2 ? '---' : '--';

    if (isFirstNoteInColumn) {
      tabBlocks.forEach((tabBlock) => {
        const selectionState = SelectionState.createEmpty(tabBlock.getKey());
        const currentGuitarString = tabBlock.getData().get('guitarString');
        const selectionWithOffset = selectionState.merge({
          focusOffset,
          anchorOffset,
        });
        nextContentState = Modifier.insertText(
          nextContentState,
          selectionWithOffset as SelectionState,
          currentGuitarString === guitarString ? `${noteAsString}-` : spaceToAdd
        );
        nextEditorState = EditorState.push(nextEditorState, nextContentState, 'insert-characters');
      });
    } else {
      const blockToBeReplaced = tabBlocks.find((tabBlock) => {
        const currentGuitarString = tabBlock.getData().get('guitarString');
        return guitarString === currentGuitarString;
      });

      if (!blockToBeReplaced) {
        throw new Error("Couldn't find a block (multiple notes mode)");
      }
      const selectionState = SelectionState.createEmpty(blockToBeReplaced.getKey());
      const selectionWithOffset = selectionState.merge({
        focusOffset: focusOffset + 1,
        anchorOffset,
      });
      nextContentState = Modifier.replaceText(
        nextContentState,
        selectionWithOffset as SelectionState,
        noteNumber.toString()
      );
      nextEditorState = EditorState.push(nextEditorState, nextContentState, 'insert-characters');
    }

    return getEditorStateWithFocus(nextEditorState, block.getKey(), focusOffset);
  } catch (err) {
    console.error(err);
    console.log('Should create a new tab instead');
    return editorState;
  }
};

export const insertNote = (
  editorState: EditorState,
  { noteNumber, guitarString }: TabNote
): EditorState => {
  try {
    const selection = editorState.getSelection();
    const focusOffset = selection.getFocusOffset();
    const anchorOffset = selection.getAnchorOffset();
    const contentState = editorState.getCurrentContent();

    const block = getTabBlockBasedOnSelection(selection, contentState);
    const { tabBlocks } = findGuitarStringsInBlock(contentState, block);

    let nextEditorState = EditorState.createEmpty();
    let nextContentState = contentState;

    const noteAsString = noteNumber.toString();
    const spaceToAdd = noteAsString.length === 2 ? '---' : '--';

    tabBlocks.forEach((tabBlock) => {
      const selectionState = SelectionState.createEmpty(tabBlock.getKey());
      const currentGuitarString = tabBlock.getData().get('guitarString');
      const selectionWithOffset = selectionState.merge({
        focusOffset,
        anchorOffset,
      });
      nextContentState = Modifier.insertText(
        nextContentState,
        selectionWithOffset as SelectionState,
        currentGuitarString === guitarString ? `${noteAsString}-` : spaceToAdd
      );
      nextEditorState = EditorState.push(nextEditorState, nextContentState, 'insert-characters');
    });

    return getEditorStateWithFocus(
      nextEditorState,
      block.getKey(),
      focusOffset + spaceToAdd.length
    );
  } catch (err) {
    console.error(err);
    console.log('Should create a new tab instead');
    return editorState;
  }
};

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

// function insertBlocksFromHtml(htmlString) {
//   const newBlockMap = convertFromHTML('xd');
//   const contentState = editorState.getCurrentContent();
//   const selectionState = editorState.getSelection();
//   const key = selectionState.getAnchorKey();
//   const blocksAfter = contentState
//     .getBlockMap()
//     .skipUntil(function (_, k) {
//       return k === key;
//     })
//     .skip(1)
//     .toArray();
//   const blocksBefore = contentState
//     .getBlockMap()
//     .takeUntil(function (_, k) {
//       return k === key;
//     })
//     .toArray();

//   newBlockMap.contentBlocks = blocksBefore
//     .concat([contentState.getBlockForKey(key)])
//     .concat(newBlockMap.contentBlocks)
//     .concat(blocksAfter);

//   const newContentState = ContentState.createFromBlockArray(
//     newBlockMap as any,
//     newBlockMap.entityMap
//   );
//   const newEditorState = EditorState.createWithContent(newContentState);
//   setEditorState(newEditorState);
// }

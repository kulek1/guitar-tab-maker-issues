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

const EMPTY_TABLATURE = ['E', 'B', 'G', 'D', 'A', 'E'];

const TAB_BLOCK_TYPE = 'TabLine';

const TAB_NOTATIONS = ['/', '\\', 'h', 'p', 's', 'b', 'x', '~'];
export const hasNoteOrTabNotation = (char: string): boolean =>
  !!Number(char) || TAB_NOTATIONS.includes(char);

export const hasTablatureSyntax = (text: string) =>
  EMPTY_TABLATURE.some((note) => text.startsWith(`${note}|`));

export const getEmptyTablature = (): EditorState => {
  const newId = id();
  const blocks = EMPTY_TABLATURE.map((word, idx) => {
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

export const addNewTablature = (editorState: EditorState): EditorState => {
  const currentBlocks = RichUtils.insertSoftNewline(EditorState.moveSelectionToEnd(editorState))
    .getCurrentContent()
    .getBlocksAsArray();

  const newId = id();
  const blocks = EMPTY_TABLATURE.map((word, idx) => {
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
  const contentState = ContentState.createFromBlockArray([...currentBlocks, ...blocks] as any);

  return EditorState.push(editorState, contentState, 'insert-fragment');
};

export const getRaw = (editorState: EditorState): void => {
  const { blocks } = convertToRaw(editorState.getCurrentContent());
  // console.warn(blocks);
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
  console.warn();

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
      // const blockLength = tabBlock.getLength();
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
      getRaw(nextEditorState);
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

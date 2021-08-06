import { NOTES_PROGRESSION } from 'constants/notes';
import { OpenNotes, EditorState } from 'AppContext';
import { saveToHistory } from 'utils/localStorage';

const EMPTY_NOTES_COUNTER = 20;

const TAB_NOTATIONS = ['/', '\\', 'h', 'p', 's', 'b', 'x', '~'];
export const hasNoteOrTabNotation = (char: string): boolean =>
  !!Number(char) || TAB_NOTATIONS.includes(char);

export const hasTablatureSyntax = (text: string): boolean =>
  NOTES_PROGRESSION.some((note) => text.toUpperCase().startsWith(`${note}|`));

export const getOpenNotesArray = (openNotes: OpenNotes): string[] =>
  Object.values(openNotes).map((openNote) => openNote.note);

type TablatureColumn = (number | string | null)[];

type Tablature = {
  [key in number]: {
    notes: TablatureColumn[];
  };
};

export const generateEmptyTablature = (openNotes: OpenNotes): Tablature => {
  const generatedNotes: null[][] = [];

  for (let i = 0; i < EMPTY_NOTES_COUNTER; i += 1) {
    generatedNotes.push([null, null, null, null, null, null]);
  }
  return {
    // @ts-ignore
    notes: generatedNotes,
  };
};

export const isSelectionAtEnd = (
  editorState: EditorState,
  currentTabIndex: string,
  currentTabColumn: string
): boolean => {
  const columnsCounter = editorState[currentTabIndex].notes.length;
  const currentTabColumnNumber = parseInt(currentTabColumn, 10);

  return columnsCounter <= currentTabColumnNumber + 1;
};

// for history (goBack())
type TabNoteWithString = {
  guitarString: number;
  noteNumber: string | number;
};

export const insertNoteToState = ({
  editorState,
  tablatureIndex,
  tablatureColumn,
  note,
}: {
  editorState: EditorState;
  tablatureIndex: string;
  tablatureColumn: string;
  note: TabNoteWithString;
}): EditorState => {
  const newEditorState = JSON.parse(JSON.stringify(editorState));

  const { notes } = newEditorState[tablatureIndex] || {};

  if (!notes) {
    throw new Error('Selected tablature does not exist');
  }

  if (notes[tablatureColumn]) {
    notes[tablatureColumn][note.guitarString - 1] = note.noteNumber;

    // add next column if it is not added
    const nextIndex = parseInt(tablatureColumn, 10) + 1;
    if (!notes[nextIndex]) {
      notes[nextIndex] = [null, null, null, null, null, null];
    }
  } else {
    let currentColumn = notes[tablatureColumn];
    if (!currentColumn) {
      currentColumn = [null, null, null, null, null, null];
    }
    currentColumn[note.guitarString - 1] = note.noteNumber;
  }
  return newEditorState;
};

export const clearColumn = (
  editorState: EditorState,
  tablatureIndex: string,
  tablatureColumn: string
): EditorState => {
  const newEditorState = JSON.parse(JSON.stringify(editorState));
  newEditorState[tablatureIndex].notes[tablatureColumn] = [null, null, null, null, null, null];
  return newEditorState;
};

export const removeTablature = (editorState: EditorState, tablatureIndex: string): EditorState => {
  const { [parseInt(tablatureIndex, 10)]: excludedTab, ...stateWithoutTablature } = editorState;
  const newEditorState = JSON.parse(JSON.stringify(stateWithoutTablature));
  return newEditorState;
};

export const addTablature = (editorState: EditorState): { state: EditorState; newKey: number } => {
  const newEditorState = JSON.parse(JSON.stringify(editorState));
  const tabKeys = Object.keys(newEditorState);

  let largestKey = 0;

  for (let i = 0; i <= largestKey; i += 1) {
    const key = parseInt(tabKeys[i], 10);
    if (key > largestKey) {
      largestKey = key;
    }
  }

  newEditorState[largestKey + 1] = {
    notes: [[null, null, null, null, null, null]],
  };
  return { state: newEditorState, newKey: largestKey + 1 };
};

export const insertNotesInOneColumn = (
  editorState: EditorState,
  tablatureIndex: string,
  tablatureColumn: string,
  noteToAdd: string | null
): EditorState => {
  const newEditorState = JSON.parse(JSON.stringify(editorState));
  const { notes } = newEditorState[tablatureIndex];
  notes.splice(tablatureColumn, 0, [
    noteToAdd,
    noteToAdd,
    noteToAdd,
    noteToAdd,
    noteToAdd,
    noteToAdd,
  ]);
  return newEditorState;
};

export const insertSpace = (
  editorState: EditorState,
  tablatureIndex: string,
  tablatureColumn: string
): EditorState => insertNotesInOneColumn(editorState, tablatureIndex, tablatureColumn, null);
export const insertX = (
  editorState: EditorState,
  tablatureIndex: string,
  tablatureColumn: string
): EditorState => insertNotesInOneColumn(editorState, tablatureIndex, tablatureColumn, 'x');

export const insertNotesBasedOnPreviousColumn = (
  editorState: EditorState,
  tablatureIndex: string,
  tablatureColumn: string,
  noteToAdd: string
): EditorState => {
  const newEditorState = JSON.parse(JSON.stringify(editorState));
  const { notes } = newEditorState[tablatureIndex];
  const previousColumn = notes[parseInt(tablatureColumn, 10) - 1];
  const hasAtLeastOneNote = previousColumn.some((el) => typeof el === 'number');

  if (previousColumn && hasAtLeastOneNote) {
    notes[tablatureColumn] = previousColumn.map((note) => {
      if (typeof note === 'number') {
        return noteToAdd;
      }
      return null;
    });

    // add next column if it is not added
    const nextIndex = parseInt(tablatureColumn, 10) + 1;

    if (!notes[nextIndex]) {
      notes[nextIndex] = [null, null, null, null, null, null];
    }

    // ADD TO HISTORY
    notes[tablatureColumn].forEach((element, idx) => {
      if (!element) {
        return;
      }
      const previousNote = editorState[tablatureIndex].notes[tablatureColumn][idx + 1];
      saveToHistory(
        previousNote,
        {
          // @ts-ignore
          noteNumber: noteToAdd,
          guitarString: idx + 1,
        },
        tablatureIndex,
        tablatureColumn,
        editorState
      );
    });
  } else {
    throw new Error('Previous column does not have any notes');
  }
  // console.warn(previousColumn);
  // console.warn(notes[tablatureColumn]);
  return newEditorState;
};

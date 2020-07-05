import { TabNote } from 'types/notes';
import { NOTES_PROGRESSION } from 'constants/notes';
import { OpenNotes, EditorState } from 'AppContext';

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

export const insertNoteToState = ({
  editorState,
  tablatureIndex,
  tablatureColumn,
  note,
}: {
  editorState: EditorState;
  tablatureIndex: string;
  tablatureColumn: string;
  note: TabNote;
}): EditorState => {
  const newEditorState = JSON.parse(JSON.stringify(editorState));

  const { notes } = newEditorState[tablatureIndex];

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
  const newEditorState = JSON.parse(JSON.stringify(editorState));
  newEditorState[tablatureIndex] = {
    notes: [[null, null, null, null, null, null]],
  };
  return newEditorState;
};

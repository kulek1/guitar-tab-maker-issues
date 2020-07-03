import { TabNote } from 'types/notes';
import { Map } from 'immutable';
import { id } from 'utils/id';
import { NOTES_PROGRESSION } from 'constants/notes';
import { OpenNotes, EditorState } from 'AppContext';

const EMPTY_NOTES_COUNTER = 20;

const TAB_NOTATIONS = ['/', '\\', 'h', 'p', 's', 'b', 'x', '~'];
export const hasNoteOrTabNotation = (char: string): boolean =>
  !!Number(char) || TAB_NOTATIONS.includes(char);

export const hasTablatureSyntax = (text: string) =>
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

// {noteNumber: 10, guitarString: 2}

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
    // console.log('xd', tablatureColumn);
    let currentColumn = notes[tablatureColumn];
    console.log(currentColumn);
    if (!currentColumn) {
      currentColumn = [null, null, null, null, null, null];
    }
    currentColumn[note.guitarString - 1] = note.noteNumber;
  }
  // console.warn(newEditorState);
  // newEditorState[tablatureIndex].notes[tablatureColumn][note.guitarString - 1] = note.noteNumber;
  return newEditorState;
};

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

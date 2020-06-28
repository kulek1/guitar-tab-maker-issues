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

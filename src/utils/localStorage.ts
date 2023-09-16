import { TabNote } from '~/types/notes';
import { EditorState } from '~/AppContext';

const MAX_SIZE = 30;

type HistoryEntry = {
  previousNote: string | null;
  note: number;
  guitarString: number;
  tablatureColumn: string;
  tablatureIndex: string;
};

type Storage = {
  history: HistoryEntry[];
};

export const saveEditorState = (editorState: EditorState): void => {
  localStorage.setItem('editorState', JSON.stringify(editorState));
};

export const getEditorState = (): EditorState => {
  const state = localStorage.getItem('editorState');
  return JSON.parse(state || 'null') as EditorState;
};

export const saveToHistory = (
  previousNote: string | null,
  note: TabNote,
  tablatureIndex: string,
  tablatureColumn: string,
  editorState: EditorState,
): void => {
  const currentState = localStorage.getItem('history');
  const parsedState: Storage['history'] = JSON.parse(currentState || '[]');

  if (parsedState.length > MAX_SIZE) {
    parsedState.shift();
  }
  parsedState.push({
    previousNote,
    note: note.noteNumber,
    guitarString: note.guitarString,
    tablatureColumn,
    tablatureIndex,
  });

  localStorage.setItem('history', JSON.stringify(parsedState));
  saveEditorState(editorState);
};

export const getHistory = (): Storage['history'] | null => {
  try {
    const history = localStorage.getItem('history') || '[]';
    return JSON.parse(history);
  } catch (err) {
    console.error('Error while getting history', err);
  }
  return null;
};

export const removeLastElementFromHistory = (): void => {
  const history = getHistory();
  if (history) {
    history.pop();
  }
  localStorage.setItem('history', JSON.stringify(history));
};

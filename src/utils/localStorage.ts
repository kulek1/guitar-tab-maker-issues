import { TabNote } from 'types/notes';

const MAX_SIZE = 30;

type HistoryEntry = {
  previousNote: string;
  note: number;
  guitarString: number;
  tablatureColumn: string;
  tablatureIndex: string;
};

type Storage = {
  history: HistoryEntry[];
};

export const saveToHistory = (
  previousNote: string,
  note: TabNote,
  tablatureIndex: string,
  tablatureColumn: string
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

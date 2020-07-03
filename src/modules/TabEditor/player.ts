import { play, NOTES_TO_NUMBER, NUMBER_TO_NOTE, NotePlayerData } from 'utils/webAudioPlayer';
import { OpenNotes, EditorState } from 'AppContext';

function getNotesToPlay(
  editorState: EditorState,
  currentTabIndex: string,
  openNotes: OpenNotes
): NotePlayerData[] {
  let idx = 0;
  const maxTabLength = editorState[currentTabIndex].notes.length;
  const notesToPlay: NotePlayerData[] = [];

  // Go column by column to grab notes and convert it into NotePlayerData
  while (idx < maxTabLength) {
    for (let guitarStringIdx = 0; guitarStringIdx < 6; guitarStringIdx += 1) {
      const currentNote = editorState[currentTabIndex].notes[idx][guitarStringIdx];
      // Get NotePlayerData from current position in tablature
      if (Number.isInteger(currentNote)) {
        const charAsNumber = currentNote;

        const openNoteOctave = openNotes[guitarStringIdx + 1].octave;
        const openNoteAsNumberInScale = NOTES_TO_NUMBER[openNotes[guitarStringIdx + 1].note];
        const octaveOffset = (openNoteAsNumberInScale + charAsNumber) / 12;

        const note = NUMBER_TO_NOTE[(openNoteAsNumberInScale + charAsNumber) % 12];
        const octave = Math.floor(openNoteOctave + octaveOffset);

        notesToPlay.push({
          note,
          octave,
        });
      }
    }
    idx += 1;
  }
  return notesToPlay;
}

export const playNotes = async (
  editorState: EditorState,
  currentTabIndex: string,
  openNotes: OpenNotes,
  emptyObject: { cancel?: () => void }
): Promise<void> => {
  let isPromiseCancelled = false;
  // eslint-disable-next-line no-param-reassign
  emptyObject.cancel = (): void => {
    isPromiseCancelled = true;
  };
  const notesToPlay: NotePlayerData[] = getNotesToPlay(editorState, currentTabIndex, openNotes);

  let playIndex = 0;
  const playLength = notesToPlay.length;

  if (!playLength) {
    return;
  }

  await new Promise((resolve) => {
    const playInterval = setInterval(() => {
      if (playIndex + 1 >= playLength || isPromiseCancelled) {
        clearInterval(playInterval);
        resolve();
      }
      const note = notesToPlay[playIndex];
      play({
        note: note.note,
        octave: note.octave,
      });
      playIndex += 1;
    }, 500);
  });
};

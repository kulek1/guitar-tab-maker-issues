import { EditorState, ContentBlock } from 'draft-js';
import { play, NOTES_TO_NUMBER, NUMBER_TO_NOTE, NotePlayerData } from 'utils/webAudioPlayer';
import { OpenNotes } from 'AppContext';

function getNotesToPlay(tabBlocks: ContentBlock[], openNotes: OpenNotes): NotePlayerData[] {
  let idx = 2;
  const maxTabLength = tabBlocks[0].getText().length;
  const notesToPlay: NotePlayerData[] = [];

  // Go column by column to grab notes and convert it into NotePlayerData
  while (idx < maxTabLength) {
    for (let guitarStringIdx = 0; guitarStringIdx < 6; guitarStringIdx += 1) {
      const block = tabBlocks[guitarStringIdx];
      const textBlock = block.getText();
      const char = textBlock[idx];

      // Get NotePlayerData from current position in tablature
      const firstNumber = Number(char);
      if (Number.isInteger(firstNumber)) {
        let charAsNumber = firstNumber;
        if (textBlock[idx + 1]) {
          charAsNumber = parseInt(`${firstNumber}${textBlock[idx + 1]}`, 10);
          idx += 1;
        }

        const guitarString: number = block.getData().get('guitarString');
        const openNoteOctave = openNotes[guitarString].octave;
        const openNoteAsNumberInScale = NOTES_TO_NUMBER[openNotes[guitarString].note];
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

// export const playNotes = async (
//   editorState: EditorState,
//   openNotes: OpenNotes,
//   emptyObject: { cancel?: () => void }
// ): Promise<void> => {
//   let isPromiseCancelled = false;
//   // eslint-disable-next-line no-param-reassign
//   emptyObject.cancel = (): void => {
//     isPromiseCancelled = true;
//   };

//   const focusKey = editorState.getSelection().getFocusKey();
//   const content = editorState.getCurrentContent();
//   const selectedBlock = content.getBlockForKey(focusKey);

//   const { tabBlocks } = findGuitarStringsInBlock(content, selectedBlock);

//   const notesToPlay: NotePlayerData[] = getNotesToPlay(tabBlocks, openNotes);

//   let playIndex = 0;
//   const playLength = notesToPlay.length;

//   if (!playLength) {
//     return;
//   }

//   await new Promise((resolve) => {
//     const playInterval = setInterval(() => {
//       if (playIndex + 1 >= playLength || isPromiseCancelled) {
//         clearInterval(playInterval);
//         resolve();
//       }
//       const note = notesToPlay[playIndex];
//       play({
//         note: note.note,
//         octave: note.octave,
//       });
//       playIndex += 1;
//     }, 500);
//   });
// };

import { EditorState } from 'draft-js';
import { play, NUMBER_TO_NOTE } from 'utils/webAudioPlayer';
import { findGuitarStringsInBlock } from './service';

export const playNotes = (editorState: EditorState) => {
  console.log('play');
  const focusKey = editorState.getSelection().getFocusKey();
  const content = editorState.getCurrentContent();
  const block = content.getBlockForKey(focusKey);

  const { tabBlocks, firstStringIndex } = findGuitarStringsInBlock(content, block);

  let idx = 2;

  while (idx < 30) {
    for (let guitarString = 0; guitarString < 6; guitarString += 1) {
      const char = tabBlocks[guitarString].getText()[idx];

      const charAsNumber = Number(char);
      if (charAsNumber) {
        play({
          note: NUMBER_TO_NOTE[charAsNumber],
          octave: 1,
        });
      }
    }
    idx += 1;
  }
};

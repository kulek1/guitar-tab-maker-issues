import React, { useContext } from 'react';
import { Note } from '~/types/notes';
import { MORE_NOTES } from '~/constants/notes';
import { generateOctaveWithNumbers, convertToOpenNote, getNoteWithoutOctave } from '~/utils/notes';
import { play } from '~/utils/webAudioPlayer';
import AppContext from '~/AppContext';

type Props = {
  frets: number;
  onNoteClick: (note: number, guitarString: number) => void;
};

const mainGuitarStrings = Object.keys(MORE_NOTES) as Array<keyof typeof MORE_NOTES>;

const generateOctavesWithNumbers = (note: Note, octaveNumber: number, frets: number): string[] => {
  let currentNote = note;
  let counter = 0;
  const generatedNotes: string[] = [];

  while (generatedNotes.length < frets) {
    const newOctaves = generateOctaveWithNumbers(currentNote, octaveNumber + counter);
    generatedNotes.push(...newOctaves.slice(0, frets - generatedNotes.length));
    counter += 1;
    currentNote = 'C';
  }
  return generatedNotes;
};

const FretNotes: React.FC<Props> = ({ onNoteClick, frets }) => {
  const { openNotes } = useContext(AppContext);

  const onNoteClickCallback = (note: string, noteNumber: number, guitarString: string): void => {
    play({
      note: getNoteWithoutOctave(note),
      octave: convertToOpenNote(note as Note).octave,
    });
    onNoteClick(noteNumber, parseInt(guitarString, 10));
  };

  return (
    <>
      {mainGuitarStrings.map((mainGuitarString) => {
        const openNote = openNotes[mainGuitarString];
        return (
          <div className="mask" key={mainGuitarString}>
            <ul>
              {generateOctavesWithNumbers(openNote.note, openNote.octave, frets + 1).map(
                (note, idx) => (
                  <button
                    type="button"
                    key={note}
                    onClick={() => onNoteClickCallback(note, idx, mainGuitarString)}
                  >
                    {note}
                  </button>
                ),
              )}
            </ul>
          </div>
        );
      })}
    </>
  );
};

export default FretNotes;

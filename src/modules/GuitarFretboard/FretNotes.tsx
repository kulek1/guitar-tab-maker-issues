import React, { useContext } from 'react';
import { Note, OpenNote } from 'types/notes';
import { MORE_NOTES } from 'constants/notes';
import {
  generateOctave,
  generateOctaveWithNumbers,
  getNextNote,
  convertToOpenNote,
  getNoteWithoutOctave,
} from 'utils/notes';
import { NotePlayerData } from 'utils/webAudioPlayer';
import FretboardContext from './FretboardContext';

type Props = {
  frets: number;
  onNoteClick: (note: NotePlayerData) => void;
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

const FretNotes: React.FC<Props> = ({ onNoteClick, frets = 12 }) => {
  const { openNotes } = useContext(FretboardContext);

  const onNoteClickCallback = (note: string): void =>
    onNoteClick({
      note: getNoteWithoutOctave(note),
      octave: convertToOpenNote(note as Note).octave,
    });

  return (
    <>
      {mainGuitarStrings.map((mainGuitarString) => {
        const openNote = openNotes[mainGuitarString];
        return (
          <div className="mask" key={mainGuitarString}>
            <ul>
              {generateOctavesWithNumbers(openNote.note, openNote.octave, frets).map((note) => (
                <button type="button" key={note} onClick={() => onNoteClickCallback(note)}>
                  {note}
                </button>
              ))}
            </ul>
          </div>
        );
      })}
    </>
  );
};

export default FretNotes;

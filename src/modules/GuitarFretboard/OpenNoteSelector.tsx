import React, { useContext, ChangeEvent } from 'react';
import { NoteInfo, Note } from 'types/notes';
import { NOTES_PROGRESSION } from 'constants/notes';
import AppContext from 'AppContext';

type Props = {
  defaultNote: NoteInfo;
  guitarString: number;
};

const OCTAVES_COUNT = 7;

const OpenNoteSelector: React.FC<Props> = ({ defaultNote, guitarString }) => {
  const defaultValueJoined = defaultNote.note + defaultNote.octave;
  const { setOpenNotes } = useContext(AppContext);

  function onSelectChange({ target }: ChangeEvent<HTMLSelectElement>) {
    setOpenNotes(target.value as Note, guitarString);
  }

  return (
    <select defaultValue={defaultValueJoined} onChange={onSelectChange}>
      {[...Array(OCTAVES_COUNT).keys()].map((idx) =>
        NOTES_PROGRESSION.map((note) => (
          <option key={`${note}-${idx}`}>
            {note}
            {idx}
          </option>
        ))
      )}
    </select>
  );
};

export default OpenNoteSelector;

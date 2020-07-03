import React, { useContext, MouseEvent } from 'react';
import AppContext from 'AppContext';
import * as S from './styles';
import { getOpenNotesArray } from './service';

// const tablatures = {
//   1: {
//     notes: [
//       //
//       [2, 0, null, null, null, null],
//       [null, null, null, null, null, null],
//       [1, null, null, null, 3, null],
//     ],
//   },
//   2: {
//     notes: [
//       //
//       [9, 0, null, null, null, null],
//       [null, 'h', null, null, null, null],
//       [null, 3, null, null, null, null],
//       [null, null, null, null, null, null],
//       [null, null, null, null, null, 1],
//       [null, null, null, null, null, null],
//       [null, null, null, 22, null, null],
//     ],
//   },
//   3: {
//     notes: [
//       //
//       [9, 0, null, null, null, null],
//       [null, 'h', null, null, null, null],
//       [null, 3, null, null, null, null],
//       [null, null, null, null, null, null],
//       [null, null, null, null, null, 1],
//       [null, null, null, null, null, null],
//       [null, null, null, 22, null, null],
//     ],
//   },
//   4: {
//     notes: [
//       //
//       [9, 0, null, null, null, null],
//       [null, 'h', null, null, null, null],
//       [null, 3, null, null, null, null],
//       [null, null, null, null, null, null],
//       [null, null, null, null, null, 1],
//       [null, null, null, null, null, null],
//       [null, null, null, 22, null, null],
//     ],
//   },
// };

type Props = {};

const TabColumns: React.FC<Props> = () => {
  const { openNotes, addNote, editorState } = useContext(AppContext);

  function onTablatureClick(event: MouseEvent<HTMLDivElement>, key: string) {
    console.log('tablature click', key, ' event', event.target);
  }

  return (
    <>
      {Object.keys(editorState).map((key: string) => (
        <S.TabColumns onClick={(e: MouseEvent<HTMLDivElement>) => onTablatureClick(e, key)}>
          <S.Column>
            {getOpenNotesArray(openNotes).map((note) => (
              <span>{note}</span>
            ))}
          </S.Column>
          <S.Column>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
          </S.Column>
          <S.Column>
            <span>-</span>
            <span>-</span>
            <span>-</span>
            <span>-</span>
            <span>-</span>
            <span>-</span>
          </S.Column>
          <S.Column />
          {editorState[key].notes.map((notes, columnIdx) => (
            <S.Column>
              {notes.map((note, guitarString) => (
                <div>
                  <span
                    className={note > 9 ? 'big' : ''}
                    data-column={columnIdx}
                    data-string={guitarString}
                  >
                    {note === null ? '-' : note}
                  </span>
                </div>
              ))}
            </S.Column>
          ))}
        </S.TabColumns>
      ))}
    </>
  );
};

TabColumns.propTypes = {};

export default TabColumns;

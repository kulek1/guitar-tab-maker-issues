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
  const {
    openNotes,
    addNote,
    editorState,
    currentTabColumn,
    currentTabIndex,
    setCurrentTabColumn,
    setCurrentTabIndex,
  } = useContext(AppContext);

  function onTablatureClick(event: MouseEvent<HTMLDivElement>, key): void {
    const { target } = event;

    if (target) {
      const column = (target as HTMLDivElement).getAttribute('data-column');
      const tab = (target as HTMLDivElement).getAttribute('data-tab');

      if (column && typeof tab === 'string') {
        console.log(currentTabColumn);
        setCurrentTabColumn(column);
        // console.log(target, column, tab, parseInt(tab, 10).toString());
        setCurrentTabIndex(parseInt(tab, 10).toString());
        console.log(currentTabColumn);
      }
    }
  }

  return (
    <>
      {Object.keys(editorState).map(
        (key: string) =>
          editorState[key] && (
            <S.TabColumns onClick={(e: MouseEvent<HTMLDivElement>) => onTablatureClick(e, key)}>
              <S.Column className="static">
                {getOpenNotesArray(openNotes).map((note, idx) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <span key={idx}>{note}</span>
                ))}
              </S.Column>
              <S.Column className="static">
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
              </S.Column>
              <S.Column className="static">
                <span>-</span>
                <span>-</span>
                <span>-</span>
                <span>-</span>
                <span>-</span>
                <span>-</span>
              </S.Column>
              <S.Column />
              {editorState[key]?.notes.map((notes, columnIdx: number) => (
                <S.Column
                  active={columnIdx.toString() === currentTabColumn && key === currentTabIndex}
                >
                  {notes.map((note, guitarString) => (
                    <>
                      <span
                        className={note > 9 ? 'big' : ''}
                        data-column={columnIdx}
                        data-string={guitarString}
                        data-tab={key}
                      >
                        {note === null ? '-' : note}
                      </span>
                    </>
                  ))}
                </S.Column>
              ))}
            </S.TabColumns>
          )
      )}
    </>
  );
};

TabColumns.propTypes = {};

export default TabColumns;

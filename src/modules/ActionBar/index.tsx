import React, { useContext, useState, useEffect, useRef } from 'react';
import { ReactComponent as AddIcon } from 'assets/icons/add-outline.svg';
import { ReactComponent as BinIcon } from 'assets/icons/bin.svg';
import { ReactComponent as RefreshIcon } from 'assets/icons/refresh.svg';
import { ReactComponent as PlayIcon } from 'assets/icons/play-outline.svg';
import { ReactComponent as CloseIcon } from 'assets/icons/close-outline.svg';
import { ReactComponent as PageIcon } from 'assets/icons/page.svg';
import { ReactComponent as DownloadIcon } from 'assets/icons/download.svg';
import { ReactComponent as ArrowIcon } from 'assets/icons/arrow-forward-outline.svg';

import AppContext from 'AppContext';
import { isSelectionAtEnd, clearColumn, removeTablature } from 'modules/TabEditor/service';
import { useToast } from 'hooks/useToasts';
import * as S from './styles';
import HiddenMenu from './HiddenMenu';

const ActionBar: React.FC<{}> = () => {
  const { displayError } = useToast();
  const [isMenu, setIsMenu] = useState(false);
  const {
    isPlaying,
    onPlayClick,
    currentTabColumn,
    currentTabIndex,
    setCurrentTabColumn,
    setCurrentTabIndex,
    editorState,
    setEditorState,
    goBack,
  } = useContext(AppContext);
  const currentTabColumnRef = useRef(currentTabColumn);
  const currentTabIndexRef = useRef(currentTabIndex);
  const editorStateRef = useRef(editorState);
  currentTabColumnRef.current = currentTabColumn;
  currentTabIndexRef.current = currentTabIndex;
  editorStateRef.current = editorState;

  function nextColumn(): void {
    const tabColumn = currentTabColumnRef.current;
    const currentColumn = parseInt(tabColumn, 10);
    if (!isSelectionAtEnd(editorStateRef.current, currentTabIndexRef.current, tabColumn)) {
      setCurrentTabColumn((currentColumn + 1).toString());
    }
  }
  function previousColumn(): void {
    const tabColumn = currentTabColumnRef.current;
    const currentColumn = parseInt(tabColumn, 10);
    if (currentColumn > 0) {
      setCurrentTabColumn((currentColumn - 1).toString());
    }
  }

  function handleClearColumnClick(): void {
    try {
      setEditorState(clearColumn(editorState, currentTabIndex, currentTabColumn));
    } catch (err) {
      displayError('Selected tablature does not exist. Try to select some tablature');
    }
  }

  function handleRemovingTablature(): void {
    setCurrentTabColumn('0');
    setCurrentTabIndex((parseInt(currentTabIndex, 10) - 1).toString());
    setEditorState(removeTablature(editorState, currentTabIndex));
  }

  useEffect(() => {
    function handler({ key }): void {
      if (key === 'ArrowRight') {
        nextColumn();
      } else if (key === 'ArrowLeft') {
        previousColumn();
      }
    }
    document.addEventListener('keydown', handler);
    return (): void => {
      document.removeEventListener('keydown', handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <S.Sticky>
      <S.HiddenMenu opened={isMenu}>
        <HiddenMenu />
      </S.HiddenMenu>
      <S.Wrapper>
        <S.Btn type="button" title="remove selected tablature" onClick={handleRemovingTablature}>
          <BinIcon />
        </S.Btn>
        <S.Btn type="button" title="clear selected column" onClick={handleClearColumnClick}>
          <CloseIcon />
        </S.Btn>
        <S.Btn type="button" title="restore last change" onClick={goBack}>
          <RefreshIcon />
        </S.Btn>
        <S.MainBtn type="button" title="see more options" onClick={() => setIsMenu(!isMenu)}>
          <AddIcon />
        </S.MainBtn>
        <S.Btn
          type="button"
          title="play selected tablature"
          onClick={onPlayClick}
          active={isPlaying}
        >
          {isPlaying ? <S.Pause /> : <PlayIcon />}
        </S.Btn>
        <S.Btn
          type="button"
          title="Move selection to left (Left arrow)"
          rotate
          onClick={previousColumn}
        >
          <ArrowIcon />
        </S.Btn>
        <S.Btn type="button" title="Move selection to right (Right arrow)" onClick={nextColumn}>
          <ArrowIcon />
        </S.Btn>
      </S.Wrapper>
    </S.Sticky>
  );
};

export default ActionBar;

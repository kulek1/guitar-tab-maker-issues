import React, { useContext, useState } from 'react';
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
import * as S from './styles';
import HiddenMenu from './HiddenMenu';

const ActionBar: React.FC<{}> = () => {
  const [isMenu, setIsMenu] = useState(false);
  const {
    isPlaying,
    onPlayClick,
    currentTabColumn,
    currentTabIndex,
    setCurrentTabColumn,
    editorState,
    setEditorState,
    goBack,
  } = useContext(AppContext);

  function nextColumn(): void {
    const currentColumn = parseInt(currentTabColumn, 10);
    if (!isSelectionAtEnd(editorState, currentTabIndex, currentTabColumn)) {
      setCurrentTabColumn((currentColumn + 1).toString());
    }
  }
  function previousColumn(): void {
    const currentColumn = parseInt(currentTabColumn, 10);
    if (currentColumn > 0) {
      setCurrentTabColumn((currentColumn - 1).toString());
    }
  }

  function handleClearColumnClick(): void {
    setEditorState(clearColumn(editorState, currentTabIndex, currentTabColumn));
  }

  function handleClearTablature(): void {
    setEditorState(removeTablature(editorState, currentTabIndex));
    setCurrentTabColumn('0');
  }

  return (
    <S.Sticky>
      <S.HiddenMenu opened={isMenu}>
        <HiddenMenu />
      </S.HiddenMenu>
      <S.Wrapper>
        <S.Btn type="button" title="remove selected tablature" onClick={handleClearTablature}>
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
        <S.Btn type="button" title="move selection to left" rotate onClick={previousColumn}>
          <ArrowIcon />
        </S.Btn>
        <S.Btn type="button" title="move selection to right" onClick={nextColumn}>
          <ArrowIcon />
        </S.Btn>
      </S.Wrapper>
    </S.Sticky>
  );
};

export default ActionBar;

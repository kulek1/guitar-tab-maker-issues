import React, { useContext } from 'react';
import { ReactComponent as AddIcon } from 'assets/icons/add-outline.svg';
import { ReactComponent as TabIcon } from 'assets/icons/tab-outline.svg';
import { ReactComponent as PageIcon } from 'assets/icons/page.svg';
import { ReactComponent as DownloadIcon } from 'assets/icons/download.svg';
import html2canvas from 'html2canvas';
import { saveToPdf } from 'utils/preview';
import AppContext from 'AppContext';
import { addTablature, insertSpace } from 'modules/TabEditor/service';
import * as S from './styles';
import IconButton from './IconButton';

(window as any).html2canvas = html2canvas;
const HiddenMenu = () => {
  const {
    editorState,
    setEditorState,
    setCurrentTabIndex,
    currentTabColumn,
    currentTabIndex,
  } = useContext(AppContext);
  const onDownloadClick = () => {
    const containerEl = document.getElementById('tab-preview');
    if (containerEl) {
      saveToPdf(containerEl, editorState);
    }
  };

  function handleAddTablature(): void {
    const newEditorState = addTablature(editorState);
    setEditorState(newEditorState);
    const tabsCounter = Object.keys(editorState).length;
    setCurrentTabIndex(tabsCounter.toString());
  }

  function handleInsertSpace(): void {
    setEditorState(insertSpace(editorState, currentTabIndex, currentTabColumn));
  }

  return (
    <S.Wrapper>
      <S.SectionWrapper>
        <IconButton icon={<AddIcon />} label="add tablature" onClick={handleAddTablature} />
        <IconButton icon={<TabIcon />} label="insert space" onClick={handleInsertSpace} />
        <IconButton
          icon={<PageIcon />}
          label="show preview"
          onClick={() => alert('this function is not yet implemented')}
        />
        <IconButton icon={<DownloadIcon />} label="export as" onClick={onDownloadClick} />
      </S.SectionWrapper>
      <hr />
      <S.SmallSectionWrapper>
        <IconButton icon="x" secondary />
        <IconButton icon="h" secondary />
        <IconButton icon="p" secondary />
        <IconButton icon="b" secondary />
        <IconButton icon="/" secondary />
        <IconButton icon="\" secondary />
      </S.SmallSectionWrapper>
    </S.Wrapper>
  );
};

HiddenMenu.propTypes = {};

export default HiddenMenu;

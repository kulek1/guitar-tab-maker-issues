import React, { useContext } from 'react';
import { ReactComponent as AddIcon } from 'assets/icons/add-outline.svg';
import { ReactComponent as TabIcon } from 'assets/icons/tab-outline.svg';
import { ReactComponent as PageIcon } from 'assets/icons/page.svg';
import { ReactComponent as DownloadIcon } from 'assets/icons/download.svg';
import html2canvas from 'html2canvas';
import { saveToPdf } from 'utils/preview';
import AppContext from 'AppContext';
import {
  addTablature,
  insertSpace,
  insertX,
  insertNotesBasedOnPreviousColumn,
} from 'modules/TabEditor/service';
import { useToast } from 'hooks/useToasts';
import * as S from './styles';
import IconButton from './IconButton';

(window as any).html2canvas = html2canvas;
const HiddenMenu: React.FC<{}> = () => {
  const { displayWarning, displayError } = useToast();
  const {
    editorState,
    setEditorState,
    setCurrentTabIndex,
    currentTabColumn,
    currentTabIndex,
  } = useContext(AppContext);
  const onDownloadClick = (): void => {
    const containerEl = document.getElementById('tab-preview');
    if (containerEl) {
      try {
        saveToPdf(containerEl, editorState);
      } catch (err) {
        displayError('Your tablature is not valid. Please, correct it and try again');
      }
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

  function handleXNote(): void {
    setEditorState(insertX(editorState, currentTabIndex, currentTabColumn));
  }

  function handleCustomNotes(note: string): void {
    try {
      setEditorState(
        insertNotesBasedOnPreviousColumn(editorState, currentTabIndex, currentTabColumn, note)
      );
    } catch (err) {
      displayWarning('Previous column does not have any notes');
    }
  }

  return (
    <S.Wrapper>
      <S.SectionWrapper>
        <IconButton icon={<AddIcon />} label="add tablature" onClick={handleAddTablature} />
        <IconButton icon={<TabIcon />} label="insert space" onClick={handleInsertSpace} />
        <IconButton
          icon={<PageIcon />}
          label="show preview"
          onClick={(): void => alert('this function is not yet implemented')}
        />
        <IconButton icon={<DownloadIcon />} label="export as" onClick={onDownloadClick} />
      </S.SectionWrapper>
      <hr />
      <S.SmallSectionWrapper>
        <IconButton icon="x" secondary onClick={handleXNote} />
        <IconButton icon="h" secondary onClick={(): void => handleCustomNotes('h')} />
        <IconButton icon="p" secondary onClick={(): void => handleCustomNotes('p')} />
        <IconButton icon="b" secondary onClick={(): void => handleCustomNotes('b')} />
        <IconButton icon="/" secondary onClick={(): void => handleCustomNotes('/')} />
        <IconButton icon="\" secondary onClick={(): void => handleCustomNotes('\\')} />
      </S.SmallSectionWrapper>
    </S.Wrapper>
  );
};

HiddenMenu.propTypes = {};

export default HiddenMenu;

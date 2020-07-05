import React from 'react';
import { ReactComponent as AddIcon } from 'assets/icons/add-outline.svg';
import { ReactComponent as TabIcon } from 'assets/icons/tab-outline.svg';
import { ReactComponent as PageIcon } from 'assets/icons/page.svg';
import { ReactComponent as DownloadIcon } from 'assets/icons/download.svg';
import * as S from './styles';
import IconButton from './IconButton';

const HiddenMenu = () => {
  return (
    <S.Wrapper>
      <S.SectionWrapper>
        <IconButton icon={<AddIcon />} label="add tablature" />
        <IconButton icon={<TabIcon />} label="insert space" />
        <IconButton icon={<PageIcon />} label="show preview" />
        <IconButton icon={<DownloadIcon />} label="export as" />
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

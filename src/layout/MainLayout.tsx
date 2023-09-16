import React from 'react';
import Header from '~/modules/Header';
import TabEditor from '~/modules/TabEditor';
import GuitarFretboard from '~/modules/GuitarFretboard';
import ActionBar from '~/modules/ActionBar';
import * as S from './styles';

const MainLayout: React.FC = () => {
  return (
    <>
      <Header />
      <TabEditor />
      <S.CardBackground>
        <GuitarFretboard />
      </S.CardBackground>
      <ActionBar />
    </>
  );
};

MainLayout.propTypes = {};

export default MainLayout;

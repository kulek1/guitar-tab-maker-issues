import React from 'react';
import { ReactComponent as SettingsIcon } from 'assets/icons/settings.svg';
import * as S from './styles';

const Header: React.FC<{}> = () => {
  return (
    <S.Header>
      <S.LogoWrapper>TabMaker</S.LogoWrapper>
      <SettingsIcon />
    </S.Header>
  );
};

export default Header;

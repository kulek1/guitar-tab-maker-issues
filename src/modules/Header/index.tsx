import React, { useState } from 'react';
import Settings from 'modules/Settings';
import * as S from './styles';

const Header: React.FC<{}> = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <S.Header>
      <S.LogoWrapper>TabMaker</S.LogoWrapper>
      <S.SettingsIconBtn onClick={() => setIsOpen(!isOpen)} />
      <Settings isOpen={isOpen} onCloseModal={() => setIsOpen(false)} />
    </S.Header>
  );
};

export default Header;

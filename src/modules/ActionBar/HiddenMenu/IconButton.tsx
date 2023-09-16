import React, { ReactNode } from 'react';
import * as S from './styles';

type Props = {
  icon: ReactNode;
  label?: string;
  secondary?: boolean;
  onClick?: () => void;
};

const IconButton: React.FC<Props> = ({ icon, label, secondary, onClick }) => {
  return (
    <S.IconButton $secondary={secondary} onClick={onClick}>
      <div>{icon}</div>
      {label && <p>{label}</p>}
    </S.IconButton>
  );
};

IconButton.propTypes = {};

export default IconButton;

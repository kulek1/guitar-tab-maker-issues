import React, { ReactNode } from 'react';
import * as S from './styles';

type Props = {
  icon: ReactNode;
  label?: string;
  secondary?: boolean;
};

const IconButton: React.FC<Props> = ({ icon, label, secondary }) => {
  return (
    <S.IconButton secondary={secondary}>
      <div>{icon}</div>
      {label && <p>{label}</p>}
    </S.IconButton>
  );
};

IconButton.propTypes = {};

export default IconButton;

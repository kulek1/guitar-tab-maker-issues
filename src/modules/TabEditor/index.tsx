import React, { useContext, useEffect } from 'react';
import AppContext from 'AppContext';
import { generateEmptyTablature } from './service';
import TabColumns from './TabColumns';
import * as S from './styles';

type Props = {};

const TabEditor: React.FC<Props> = () => {
  const { openNotes } = useContext(AppContext);

  useEffect(() => {
    generateEmptyTablature(openNotes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="tab-editor__container">
      <S.TabColumnsWrapper>
        <TabColumns />
      </S.TabColumnsWrapper>
    </div>
  );
};

export default TabEditor;

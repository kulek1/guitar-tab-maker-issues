import React, { useState } from 'react';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import Select from 'components/Select';
import { changeInstrument, Instrument } from 'utils/webAudioPlayer';
import * as S from './styles';

type Props = {
  isOpen: boolean;
  onCloseModal: () => void;
};

const SELECT_OPTIONS = [
  {
    text: 'Acoustic guitar',
    value: Instrument.AcousticGuitar1,
  },
  {
    text: 'Electric guitar',
    value: Instrument.ElectricGuitar1,
  },
];

const Settings: React.FC<Props> = ({ isOpen, onCloseModal }) => {
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument>(
    Instrument.AcousticGuitar1
  );

  function onInstrumentChange({ target }: React.ChangeEvent<HTMLSelectElement>): void {
    changeInstrument(target.value as Instrument);
    setSelectedInstrument(target.value as Instrument);
  }

  return (
    <>
      <Modal open={isOpen} onClose={onCloseModal} center>
        <S.ModalContainer>
          <h2>Settings</h2>
          <Select
            options={SELECT_OPTIONS}
            label="Select playback instrument"
            id="select-playback"
            defaultValue={selectedInstrument}
            onChange={onInstrumentChange}
          />
        </S.ModalContainer>
      </Modal>
    </>
  );
};

export default Settings;

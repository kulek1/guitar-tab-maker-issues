import React, { useState } from 'react';
import './styles/main.scss';
import TabEditor from 'modules/TabEditor';
import AppContext from 'AppContext';
import { TabNote } from 'types/notes';
import GuitarFretboard from './modules/GuitarFretboard';

function App() {
  const [notes, setNotes] = useState<TabNote[]>([]);

  return (
    <div className="container">
      <header className="header">Guitar</header>
      <AppContext.Provider
        value={{
          notes,
          addNote: (tabNote: TabNote): void => {
            setNotes((currNotes) => [...currNotes, tabNote]);
          },
        }}
      >
        <GuitarFretboard />
        <TabEditor />
      </AppContext.Provider>
    </div>
  );
}

export default App;

import React from 'react';
import { TabNote } from 'types/notes';

type AppCtx = {
  notes: TabNote[];
  addNote: (TabNote) => void;
};

const AppContext = React.createContext<AppCtx>({
  notes: [],
  addNote: () => {},
});

export default AppContext;

import React from 'react';
import Routes from './client/Router';

import { ClientContext } from './client/contexts/ClientContext';
import { socket } from './client/contexts/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const App = () => {
  return (
    <div className="App">
      <ClientContext.Provider value={socket}>
        <Routes />
      </ClientContext.Provider>
    </div>
  );
};

export default App;

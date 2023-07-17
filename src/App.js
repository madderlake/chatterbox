import React from 'react';
import Routes from './components/Router';

import {SocketContext, socket} from './contexts/socket';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const App = () => {
  return (
    <div className="App">
      <SocketContext.Provider value={socket}>
        <Routes />
      </SocketContext.Provider>
    </div>
  );
};

export default App;

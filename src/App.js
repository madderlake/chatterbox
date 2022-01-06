import React from 'react';
// import Chat from './components/Chat';
// import Join from './components/Join';
import Routes from './components/Router';

import {GlobalProvider} from './context/GlobalState';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';

const App = () => {
  return (
    <div className="App">
      {/* <GlobalProvider> */}
      <Routes />
      {/* </GlobalProvider> */}
    </div>
  );
};

export default App;

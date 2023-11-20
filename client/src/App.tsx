import React from 'react';
import Routes from './components/Router';

import { ClientContext } from './contexts/ClientContext';
import { socket } from './contexts/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { persistStore } from 'redux-persist';
import store from './redux/store';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const persistor = persistStore(store);
const App = () => {
  return (
    <div className="App">
      <ClientContext.Provider value={socket}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Routes />
          </PersistGate>
        </Provider>
      </ClientContext.Provider>
    </div>
  );
};

export default App;

import React from 'react';
import {Route, Switch, BrowserRouter as Router} from 'react-router-dom';
import {GlobalProvider} from '../context/GlobalState';
//import Chat from './Chat';
import Join from './Join';
import ChatContainer from './ChatContainer';

const Routes = () => {
  return (
    <Router>
      <GlobalProvider>
        <Switch>
          <Route exact path="/" component={Join} />
          <Route path="/:room/:username/:id" component={ChatContainer} />
        </Switch>
      </GlobalProvider>
    </Router>
  );
};

export default Routes;

import React from 'react';
import {Route, Switch, BrowserRouter as Router} from 'react-router-dom';
import Join from './Join';
import ChatContainer from './ChatContainer';

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Join} />
        <Route path="/:room/:username/:id" component={ChatContainer} />
      </Switch>
    </Router>
  );
};

export default Routes;

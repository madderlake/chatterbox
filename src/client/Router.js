import React from 'react';
import {
  Route,
  Switch,
  // Redirect,
  BrowserRouter as Router,
} from 'react-router-dom';
import { Join } from './components/Join';
import { ChatContainer } from './components/ChatContainer';

// const ProtectedChat = ({component: Component, ...rest}) => (
//   <Route
//     {...rest}
//     render={(props) =>
//       props.location.state ? (
//         <Component {...props} />
//       ) : (
//         <Redirect to={{pathname: '/'}} />
//       )
//     }
//   />
// );
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

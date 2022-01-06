import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Route, Link, BrowserRouter as Router} from 'react-router-dom';
// import Chat from './components/Chat-class';
// import Join from './components/Join';
// import {GlobalProvider} from './context/GlobalState';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.scss';
// import * as serviceWorker from './serviceWorker';

// const Routes = (
//   <Router>
//     <GlobalProvider>
//       <Route exact path="/" component={Join} />
//       <Route path="/chat/:username" component={Chat} />
//     </GlobalProvider>
//   </Router>
// );
ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();

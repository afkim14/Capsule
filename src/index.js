import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import TemplatesHome from './components/TemplatesHome';
import ViewerHome from './components/ViewerHome';
import NotFoundPage from './components/NotFoundPage';
import { Route, Switch, Link, BrowserRouter as Router } from 'react-router-dom'
import * as serviceWorker from './serviceWorker';

const routing = (
  <Router>
    <div>
      <Switch>
        <Route exact path="/" component={TemplatesHome} />
        <Route path="/editor" component={App} />
        <Route path="/cards" component={ViewerHome} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  </Router>
)

ReactDOM.render(routing, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

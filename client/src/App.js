import React from 'react';

import {BrowserRouter as Router, Route,Switch} from 'react-router-dom';
import { PrivateRoute } from './Auth/PrivateRoute';

import Dashboard from './Pages/Dashboard';
function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route path="/" exact><Dashboard /></Route>
          <Route path="/:name/:state"><Dashboard /></Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;

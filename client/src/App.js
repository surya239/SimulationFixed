import React from 'react';
import Signup from './Pages/Signup'
import Login from './Pages/Login';
import {BrowserRouter as Router, Route,Switch} from 'react-router-dom';
import { PrivateRoute } from './Auth/PrivateRoute';
import Profile from './Pages/ProfileUpdation'
import UpdateStudent from './Pages/Studentupdate'
import StudentDashboard from './Pages/StudentDashboard';
import Alumini from './Pages/Alumini';
import Loding from './Pages/Loding'
import PostJob from './Pages/PostJob';
import EditProfile from './Pages/EditProfile';
import ViewApplication from './Pages/ViewApplicants';
import Dashboard from './Pages/Dashboard';
function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route path="/" exact><Dashboard /></Route>
          
        </Switch>
      </Router>
    </>
  );
}

export default App;

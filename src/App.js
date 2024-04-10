import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './Dashboard';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import './App.css';
import Profile from './Profile';
import UserOrDriver from './UserOrDriver'; // Make sure to create this component
import AdminScreen from './AdminScreen'; 

function App() {
    return (
        <Router>
            <div className="App">
                <Switch>
                <Route path="/userOrDriver" component={UserOrDriver} />
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                    <ProtectedRoute path="/profile" component={Profile} />
                    <ProtectedRoute path="/" exact component={Dashboard} />
                    <Route path="/admin" component={AdminScreen} />
                   {/* <Route path="/userOrDriver" component={UserOrDriver} />  Make sure this is the last Route */}
                </Switch>
            </div>
        </Router>
    );
}

export default App;

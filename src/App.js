import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './Dashboard';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute'; // Import ProtectedRoute
import './App.css';
import Profile from './Profile'; 

function App() {
    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                    <ProtectedRoute path="/profile" component={Profile} />
                    <ProtectedRoute path="/" component={Dashboard} /> {/* Use ProtectedRoute here */}
                </Switch>
            </div>
        </Router>
    );
}

export default App;

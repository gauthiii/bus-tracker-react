import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './AuthForm.css';
import SetDetails from './SetDetails'; // This is the new component you need to create

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [userId, setUserId] = useState(''); // For storing the user ID if additional details are needed
    const [showSetDetails, setShowSetDetails] = useState(false); // For toggling the SetDetails component
  
    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://localhost:5000/api/login', { email, password });
  
        if (response.status === 202) {
          // Server responded with a request for additional details
          setUserId(response.data.userId); // Save the user ID for use in SetDetails
          setShowSetDetails(true); // Show the SetDetails component to collect additional information
        } else {
          // Handle successful login with JWT token here
          localStorage.setItem('token', response.data.token);
          // Navigate to the dashboard or home page after successful login
          // navigate('/dashboard'); // Uncomment this if using react-router-dom for navigation
          window.location = '/';
        }
      } catch (error) {
        alert('Login failed. Please try again.');
        console.error(error);
      }
    };
  
    const handleDetailsSet = () => {
      // Logic to handle what happens after the details are set. Perhaps a re-login is required.
      setShowSetDetails(false);
      // Optionally, you can trigger a re-login or token refresh here
    };
  
    if (showSetDetails) {
      return <SetDetails userId={userId} onDetailsSet={handleDetailsSet} />;
    }

    return (
        <div className="form-container">
            <form className="form-card" onSubmit={handleLogin}>
                <h2 className="form-title">Login</h2>
                <input type="email" className="form-input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <input type="password" className="form-input" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
               <div style={{textAlign:"center"}}><button type="submit" className="form-button">Login</button></div> 
                <p className="form-footer">
                   Don't have an account?<Link to="/register">Register here</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;

import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import { Link, useLocation, useHistory  } from 'react-router-dom'; // Import Link from react-router-dom
import './AuthForm.css';
import SetDetails from './SetDetails'; // This is the new component you need to create
import { API_URL } from './App'; 

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [userId, setUserId] = useState(''); // For storing the user ID if additional details are needed
    const [showSetDetails, setShowSetDetails] = useState(false); // For toggling the SetDetails component

    const location = useLocation(); // Use location to access query params

    const history = useHistory(); // Use useHistory for redirection

    // Redirect if no userType query param is present
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const userType = params.get('userType');
        if (!userType) {
            history.push('/userOrDriver');
        }
    }, [location, history]);

    // Function to parse the query parameters and return userType
    const getUserTypeFromSearch = () => {
        return new URLSearchParams(location.search).get('userType');
    };
  
    const handleLogin = async (e) => {
      e.preventDefault();
      const userType = new URLSearchParams(location.search).get('userType');
    try {
        const response = await axios.post(`${API_URL}/api/login`, { email, password, userType });
  
        if (response.status === 202) {
          // Server responded with a request for additional details
          setUserId(response.data.userId); // Save the user ID for use in SetDetails
          setShowSetDetails(true); // Show the SetDetails component to collect additional information
        } else {
          // Handle successful login with JWT token here
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userEmail', email); // Storing email to check for admin

          // Navigate to the dashboard or home page after successful login
          // navigate('/dashboard'); // Uncomment this if using react-router-dom for navigation

          if (email === "admin@admin.com") {
            window.location = '/admin';
        } else{

          if(getUserTypeFromSearch()==="driver"){

            

            window.location = '/driverDash';

          }
          else{
          window.location = '/?userType='+getUserTypeFromSearch();
          }
        }
        }
      } catch (error) {
        alert('Login failed. Please try again.'+error.response.data);
        console.error(error);
      }
    };
  
    const handleDetailsSet = () => {
      // Logic to handle what happens after the details are set. Perhaps a re-login is required.
      setShowSetDetails(false);
      // Optionally, you can trigger a re-login or token refresh here
      alert('Login Again!!!');
      window.location = '/?userType=user';
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
                {getUserTypeFromSearch() === 'user' && (
                    <p className="form-footer">
                        Don't have an account?<Link to="/register?userType=user">Register here</Link>
                    </p>
                )}
            </form>
        </div>
    );
}

export default Login;

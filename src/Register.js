import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link,  useLocation, useHistory  } from 'react-router-dom'; // Import Link from react-router-dom
import './AuthForm.css';
import { API_URL } from './App'; 

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/register`, { email, password });
            alert('Registration successful');
            window.location = '/login?userType=user';
        } catch (error) {
            console.error(error);
            alert('Registration failed');
        }
    };

    return (
        <div className="form-container">
            <form className="form-card" onSubmit={handleSubmit}>
                <h2 className="form-title">Register</h2>
                <input type="email" className="form-input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <input type="password" className="form-input" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="submit" className="form-button">Register</button>
                <p className="form-footer">
                    Already have an account? <Link to="/login?userType=user">Login here</Link>
                </p>
            </form>
        </div>
    );
}

export default Register;

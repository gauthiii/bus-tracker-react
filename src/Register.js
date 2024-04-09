import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './AuthForm.css';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/register', { email, password });
            alert('Registration successful');
            window.location = '/login';
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
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </form>
        </div>
    );
}

export default Register;

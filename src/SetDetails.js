// SetDetails.js
import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button } from '@mui/material';
import { API_URL } from './App'; 

function SetDetails({ userId, onDetailsSet }) {
  const [name, setName] = useState('');
  const [passcode, setPasscode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/set-details`, { userId, name, passcode });
      alert(response.data.message);
      onDetailsSet(); // Callback to trigger a re-login or update state
    } catch (error) {
      alert('Failed to set details. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="set-details-form">
        <div style={{height:"20vh"}}></div>
      <h2>Set Your Details</h2> <br></br>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        /> <br></br><br></br>
        <TextField
          label="6-Digit Passcode"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          inputProps={{ maxLength: 6 }}
          required
        /> <br></br><br></br>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
    </div>
  );
}

export default SetDetails;

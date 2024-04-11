import React,{useState, useEffect } from 'react';
import { Button, TextField,  Container, Grid, Paper, Typography  } from '@mui/material';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

function DriverDash() {
   
    const [busName, setBusName] = useState('');
    const [passcode, setPasscode] = useState('');
    

      const history = useHistory();

      useEffect(() => {
        // Check if the user's email is not admin@admin.com
        const userEmail = localStorage.getItem('userEmail');
       
    }, [history]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Assuming you have a way to get the driver's email, perhaps stored in local storage or context
        const email = localStorage.getItem('userEmail');
    
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
    
            try {
                const response = await axios.post('http://localhost:5000/api/driver/check-in', {
                    email,
                    passcode,
                    busName,
                    lat: latitude,
                    lon: longitude,
                },);
    
                alert('Bus location updated successfully.\nYOU ARE LIVE!!');
                
            } catch (error) {
                console.error('Error during driver check-in:', error.response.data);
                alert(error.response.data);
            }
        }, (err) => {
            console.error('Error obtaining location:', err.message);
            alert('Failed to get current location. Please ensure location services are enabled.');
        });
    };
    
    const handleSignOut = () => {
        localStorage.removeItem('token'); // Remove token from localStorage
        localStorage.removeItem('userEmail'); // Consider removing the email as well
        window.location = '/userOrDriver'; // Redirect to login page
      };

    return (
        <Container component="main" maxWidth="xs">
            <div style={{height:'25vh'}}></div>
            <Grid item xs={12}>
            <Paper elevation={3} style={{ padding: '20px', backgroundColor:'rgba(0, 0, 0, 0.85)' }}>
              <Typography variant="h6" style={{ marginBottom: '20px' }}>Driver Check-In</Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  {/* Form fields */}
                   {/* Form fields */}
      
       <Grid item xs={12}>
       <TextField fullWidth label="Enter Bus Name" variant="outlined" value={busName} onChange={(e) => setBusName(e.target.value)}  required />
       </Grid>
       <Grid item xs={12}>
         <TextField fullWidth label="6-Digit Passcode" variant="outlined" value={passcode} onChange={(e) => setPasscode(e.target.value)}  required />
       </Grid>
       <Grid item xs={12}>
         <Button type="submit" variant="contained" color="primary" fullWidth>Submit</Button>
       </Grid>
                  {/* ... */}
                </Grid>
              </form>
            </Paper>
          </Grid>
          <Button onClick={handleSignOut} variant="contained" color="primary" style={{ marginTop: '20px' }}>Sign Out</Button>
        </Container>
    );
}

export default DriverDash;

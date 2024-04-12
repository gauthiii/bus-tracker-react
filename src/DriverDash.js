import React, { useState, useEffect } from 'react';
import { Button, TextField, Container, Grid, Paper, Typography, Card, CardContent } from '@mui/material';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

function DriverDash() {
    const [busName, setBusName] = useState('');
    const [passcode, setPasscode] = useState('');
    const [isLive, setIsLive] = useState(false);
    const [storedBusName,setBus] = useState(null)
   

    const history = useHistory();

    useEffect(() => {
        const userEmail = localStorage.getItem('userEmail');
         setBus(localStorage.getItem('driverBus'));
        // If additional logic is needed, add here
    }, [history]);

    const handleGoLive = async () => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const email = localStorage.getItem('userEmail');

            try {
                await axios.post('http://localhost:5000/api/driver/check-in', {
                    email,
                    passcode,
                    busName,
                    lat: latitude,
                    lon: longitude,
                });

                
                setIsLive(true);
                localStorage.setItem('driverBus', busName); 
                setBus(busName);
            } catch (error) {
                console.error('Error during driver check-in:', error.response.data);
                alert(error.response.data);
                
            }
        }, (err) => {
            console.error('Error obtaining location:', err.message);
            alert('Failed to get current location. Please ensure location services are enabled.');
          
        });
    };

    const handleTurnOffLive = () => {
        setIsLive(false);
        localStorage.removeItem('busName');
        setBus()
    };

    const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('busName');
        history.push('/userOrDriver');
    };

    return (
        <Container component="main" maxWidth="xs">
            <div style={{ height: '25vh' }}></div>
         
            {isLive || storedBusName   ? (

              <Grid item xs={12}>
                    <Paper elevation={3} style={{ padding: '20px', backgroundColor: 'rgba(0, 0, 0, 0.85)' }}>
                        <Typography variant="h6" style={{ marginBottom: '20px' }}>YOU ARE LIVE!!!</Typography>
                        <form onSubmit={(e) => { e.preventDefault(); handleTurnOffLive();}}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                <Typography variant="h6" style={{ textAlign:'center'}}>You are driving Bus: {storedBusName}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button type="submit" variant="contained" color="primary" fullWidth>Turn Off Live</Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Grid>
                // <Card style={{ margin: '20px', padding: '20px', backgroundColor: '#c8e6c9' }}>
                //     <CardContent>
                //         <Typography variant="h4" style={{ color: '#2e7d32' }}>You Are Live!</Typography>
                //         <Button variant="contained" color="secondary" onClick={handleTurnOffLive} style={{ marginTop: '20px' }}>Turn Off Live</Button>
                //     </CardContent>
                // </Card>
            ) :(
              <Grid item xs={12}>
                  <Paper elevation={3} style={{ padding: '20px', backgroundColor: 'rgba(0, 0, 0, 0.85)' }}>
                      <Typography variant="h6" style={{ marginBottom: '20px' }}>Driver Check-In</Typography>
                      <form onSubmit={(e) => { e.preventDefault(); handleGoLive();  }}>
                          <Grid container spacing={2}>
                              <Grid item xs={12}>
                                  <TextField fullWidth label="Enter Bus Name" variant="outlined" value={busName} onChange={(e) => setBusName(e.target.value)} required />
                              </Grid>
                              <Grid item xs={12}>
                                  <TextField fullWidth label="6-Digit Passcode" variant="outlined" value={passcode} onChange={(e) => setPasscode(e.target.value)} required />
                              </Grid>
                              <Grid item xs={12}>
                                  <Button type="submit" variant="contained" color="primary" fullWidth>Go Live</Button>
                              </Grid>
                          </Grid>
                      </form>
                  </Paper>
              </Grid>
          ) }
            <Button onClick={handleSignOut} variant="contained" color="primary" style={{ marginTop: '20px' }}>Sign Out</Button>
        </Container>
    );
}

export default DriverDash;

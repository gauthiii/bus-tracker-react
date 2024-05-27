import React, { useState, useEffect } from 'react';
import { Button, TextField, Container, Grid, Paper, Typography, Card, CardContent } from '@mui/material';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from './App'; 

const reverseGeocodeNominatim = async (latitude, longitude) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

  try {
      const response = await axios.get(url, {
          headers: {
              'User-Agent': 'MyAppName/1.0 (your-email@example.com)'  // Replace with your app name and your contact email
          }
      });
      if (response.data) {
          return response.data.display_name;  // This returns the full address
      } else {
          throw new Error('No results found');
      }
  } catch (error) {
      console.error('Error during the reverse geocoding process:', error);
      return null;
  }
};

function DriverDash() {
    const [busName, setBusName] = useState('');
    const [passcode, setPasscode] = useState('');
    const [stops, setStops] = useState('');
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

            var address = await reverseGeocodeNominatim(latitude, longitude);

            address=address.split(",");
            address=address[[address.length-1-4]]


            //13.004202
            //80.201471

            console.log("address: ", address);

            try {
                await axios.post(`${API_URL}/api/driver/check-in`, {
                    email,
                    passcode,
                    busName,
                    lat: latitude,
                    lon: longitude,
                    address,
                    active:true,
                    stops
                });

                
                setIsLive(true);
                localStorage.setItem('driverBus', busName);
                localStorage.setItem('driverEmail', email); 
                localStorage.setItem('driverPasscode', passcode); 
                localStorage.setItem('driverLat', latitude); 
                localStorage.setItem('driverLon', longitude);
                localStorage.setItem('stops', stops);    
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

    const handleTurnOffLive = async () => {
        setIsLive(false);
        
        setBus()
       const email = localStorage.getItem('driverEmail');
       const passcode = localStorage.getItem('driverPasscode');
       const busName = localStorage.getItem ('driverBus');
       const latitude = localStorage.getItem('driverLat');
       const longitude = localStorage.getItem('driverLon');
       const stops = localStorage.getItem('stops');

        try {
          await axios.post(`${API_URL}/api/driver/check-in`, {
              email,
              passcode,
              busName,
              lat: latitude,
              lon: longitude,
              address:"Driver not Assigned",
              active:false,
              stops
          });

          localStorage.removeItem('busName');
        localStorage.removeItem('driverEmail');
        localStorage.removeItem('driverPasscode');
        localStorage.removeItem('driverLat');
        localStorage.removeItem('driverLon');
        localStorage.removeItem('stops');
          
      } catch (error) {
          console.error('Error during driver live off', error.response.data);
          alert(error.response.data);
          
      }
      
    };

    const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('busName');
        localStorage.removeItem('driverEmail');
        localStorage.removeItem('driverPasscode');
        localStorage.removeItem('driverLat');
        localStorage.removeItem('driverLon');
        localStorage.removeItem('stops');
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
                                  <TextField fullWidth label="Stops Completed" variant="outlined" value={stops} onChange={(e) => setStops(e.target.value)} required />
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

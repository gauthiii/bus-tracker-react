import React, { useState, useEffect } from 'react';
import { Button, TextField, Container, Grid, Paper, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { API_URL } from './App'; 

const reverseGeocodeNominatim = async (latitude, longitude) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'MyAppName/1.0 (your-email@example.com)'  // Replace with your app name and your contact email
      }
    });
    return response.data ? response.data.display_name : null;  // This returns the full address
  } catch (error) {
    console.error('Error during the reverse geocoding process:', error);
    return null;
  }
};

function DriverDash() {
  const [busName, setBusName] = useState('');
  const [final, setFinal] = useState('');
  const [total, setTotal] = useState('');
  const [buses, setBuses] = useState([]);
  const [passcode, setPasscode] = useState('');
  const [stops, setStops] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [storedBusName, setBus] = useState(null);
  const history = useHistory();

  useEffect(() => {
    fetchBuses();
    setBus(localStorage.getItem('driverBus'));
  }, [history]);

  const fetchBuses = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/bus-locations`);
      setBuses(response.data);
    } catch (error) {
      console.error('Error fetching buses:', error);
    }
  };
  

  const handleBusChange = (event) => {
    const name = event.target.value;
    setBusName(event.target.value);

     // Find the bus object from the buses array
     const selectedBus = buses.find(bus => bus.name === name);

     if (selectedBus) {
         // Set the final destination to the route of the selected bus
         setFinal(selectedBus.route);

         setTotal(selectedBus.routes.length);
 

     }
   
  };

  const handleGoLive = async () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const email = localStorage.getItem('userEmail');
      var address = await reverseGeocodeNominatim(latitude, longitude);
      address = address.split(",")[address.length-1-4];

      try {
        await axios.post(`${API_URL}/api/driver/check-in`, {
          email,
          passcode,
          busName,
          lat: latitude,
          lon: longitude,
          address,
          active: true,
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
    setBus(null); // Resetting the stored bus name if necessary

    const email = localStorage.getItem('driverEmail');
    const passcode = localStorage.getItem('driverPasscode');
    const busName = localStorage.getItem('driverBus');
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
            address: "Driver not Assigned",
            active: false,
            stops
        });

        // Clearing local storage items related to the live state
        localStorage.removeItem('driverBus');
        localStorage.removeItem('driverEmail');
        localStorage.removeItem('driverPasscode');
        localStorage.removeItem('driverLat');
        localStorage.removeItem('driverLon');
        localStorage.removeItem('stops');

        alert("Went off live");
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
      {isLive || storedBusName ? (
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '20px', backgroundColor: 'rgba(0, 0, 0, 0.85)' }}>
            <Typography variant="h6" style={{ marginBottom: '20px' }}>YOU ARE LIVE!!!</Typography>
            <form onSubmit={(e) => { e.preventDefault(); handleTurnOffLive(); }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" style={{ textAlign: 'center' }}>You are driving Bus: {storedBusName}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary" fullWidth>Turn Off Live</Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      ) : (
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '20px', backgroundColor: 'rgba(0, 0, 0, 0.85)' }}>
            <Typography variant="h6" style={{ marginBottom: '20px' }}>Driver Check-In</Typography>
            <form onSubmit={(e) => { e.preventDefault(); handleGoLive(); }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="bus-name-label">Bus Name</InputLabel>
                    <Select
                      labelId="bus-name-label"
                      value={busName}
                      onChange={handleBusChange}
                      required
                    >
                      {buses.map((bus) => (
                        <MenuItem key={bus.id} value={bus.name}>{bus.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField fullWidth label="Final Destination" variant="outlined" value={final}  required />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Total Stops" variant="outlined" value={total}  required />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Stops Completed" variant="outlined" value={stops} onChange={(e) => setStops(e.target.value)} required />
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
      )}
      <Button onClick={handleSignOut} variant="contained" color="primary" style={{ marginTop: '20px' }}>Sign Out</Button>
    </Container>
  );
}

export default DriverDash;

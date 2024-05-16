import React,{useState, useEffect } from 'react';
import { Button, TextField, FormControl, InputLabel, Select, MenuItem, Container, Grid, Paper, Typography, Box  } from '@mui/material';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from './App'; 

function AddBus() {
   

    const [newBus, setNewBus] = useState({
        lat: '',
        lon: '',
        name: '',
        route: '',
        routes: '', // New field for the list of stops
        status: ''
      });

      const history = useHistory();



      useEffect(() => {
        // Check if the user's email is not admin@admin.com
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail !== "admin@admin.com") {
            history.push('/'); // Redirect to the root route if the user is not an admin
        }

          // Get current location coordinates
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          setNewBus({
            ...newBus,
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            status: "Driver not Assigned"
          });
        });
      } else {
       // alert("Geolocation is not supported by your browser");

        const myLat = 13.004202; 
        const myLon = 80.201471;

        setNewBus({
          ...newBus,
          lat: myLat,
          lon: myLon,
          status: "Driver not Assigned"
        });
      }

    }, [history]);

    useEffect(() => {
      // Get current location coordinates
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          setNewBus({
            ...newBus,
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            status: "Driver not Assigned"
          });
        });
      } else {
       // alert("Geolocation is not supported by your browser");

        const myLat = 13.004202; 
        const myLon = 80.201471;

        setNewBus({
          ...newBus,
          lat: myLat,
          lon: myLon,
          status: "Driver not Assigned"
        });
      }
    }, []); 

    const validateBusName = (name) => {
      const regex = /^\d{2}[A-Za-z]$/;
      return regex.test(name);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateBusName(newBus.name)) {
          alert("Invalid Bus Name.\nIt should be in the format '<digit><digit><letter>' where the first two characters are digits and the last is a letter.\nValid Bus Names:\n21G\n45C\n65P\n98K");
          return;
        }

        // Split the stops into an array before sending to the backend
        const busData = {
          ...newBus,
          routes: newBus.routes.split(',').map(route => route.trim())  // Split and trim stops
      };

        try {
          await axios.post(`${API_URL}/api/bus-locations`, busData);
          alert('Bus added successfully');
          setNewBus({ lat: '', lon: '', name: '', route: '', routes: '', status: '' }); // Reset form
        //  fetchBuses(); // Re-fetch buses to update the list
        } catch (error) {
          console.error('Error adding bus:', error);
          alert('Failed to add bus');
        }
      };

    return (
        <Container component="main" maxWidth="xs">
            <div style={{height:'25vh'}}></div>
            <Grid item xs={12}>
            <Paper elevation={3} style={{ padding: '20px', backgroundColor:'rgba(0, 0, 0, 0.85)' }}>
              <Typography variant="h6" style={{ marginBottom: '20px' }}>Add New Bus</Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  {/* Form fields */}
                   {/* Form fields */}
       <Grid item xs={12} sm={6}>
         <TextField fullWidth label="Latitude" variant="outlined" value={newBus.lat} onChange={(e) => setNewBus({ ...newBus, lat: e.target.value })} required />
       </Grid>
       <Grid item xs={12} sm={6}>
         <TextField fullWidth label="Longitude" variant="outlined" value={newBus.lon} onChange={(e) => setNewBus({ ...newBus, lon: e.target.value })} required />
       </Grid>
       <Grid item xs={12} sm={6}>
         <TextField fullWidth label="Bus Name" variant="outlined" value={newBus.name} onChange={(e) => setNewBus({ ...newBus, name: e.target.value })} required />
       </Grid>
       <Grid item xs={12} sm={6}>
       <TextField fullWidth label="Route" variant="outlined" value={newBus.route} onChange={(e) => setNewBus({ ...newBus, route: e.target.value })} required />
       </Grid>
       <Grid item xs={12}>
            <TextField fullWidth label="Stops (comma-separated)" variant="outlined" value={newBus.routes} onChange={(e) => setNewBus({ ...newBus, routes: e.target.value })} required />
       </Grid>
       <Grid item xs={12}>
         <TextField fullWidth label="Status" variant="outlined" value={newBus.status} onChange={(e) => setNewBus({ ...newBus, status: e.target.value })} required />
       </Grid>
       <Grid item xs={12}>
         <Button type="submit" variant="contained" color="primary" fullWidth>Add Bus</Button>
       </Grid>
                  {/* ... */}
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Container>
    );
}

export default AddBus;

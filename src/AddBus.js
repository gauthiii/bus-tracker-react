import React,{useState, useEffect } from 'react';
import { Button, TextField, FormControl,IconButton, InputLabel, Select, MenuItem, Container, Grid, Paper, Typography, Box  } from '@mui/material';
import { useHistory } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

import axios from 'axios';
import { API_URL } from './App'; 

function AddBus() {
   

    const [newBus, setNewBus] = useState({
        lat: '',
        lon: '',
        name: '',
        route: '',
        routes: [''], // Change to an array to hold multiple routes
        status: '',
        pass:'',
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

    const isValidPasscode = passcode => /^[0-9]{6}$/.test(passcode);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validateBusName(newBus.name)) {
          alert("Invalid Bus Name. It should be in the format '<digit><digit><letter>'.\nValid examples: 21G, 45C, 65P, 98K");
          return;
      }

      if (!isValidPasscode(newBus.pass)) {
          alert("Passcode must be exactly 6 digits.");
          return;
      }

      // Convert routes array into a string to store it
      const busData = {
          ...newBus,
          routes: newBus.routes
      };

      try {
          await axios.post(`${API_URL}/api/bus-locations`, busData);
          alert('Bus added successfully');
          setNewBus({ lat: '', lon: '', name: '', route: '', routes: [], status: '', pass: '' }); // Reset form
      } catch (error) {
          console.error('Error adding bus:', error);
          alert('Failed to add bus');
      }
  };

  const handleAddRoute = () => {
    // Append an empty string to the routes array
    setNewBus({ ...newBus, routes: [...newBus.routes, ''] });
};

const handleRouteChange = (index, value) => {
    // Update specific route by index
    const updatedRoutes = newBus.routes.map((route, i) => {
        if (i === index) return value;
        return route;
    });

    setNewBus({ ...newBus, routes: updatedRoutes });
};

const handleRemoveRoute = (index) => {
  // Check if there's more than one route in the list before allowing removal
  if (newBus.routes.length > 1) {
    const filteredRoutes = newBus.routes.filter((_, i) => i !== index);
    setNewBus({ ...newBus, routes: filteredRoutes });
  } else {
    alert("At least one bus stop must be present.");
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
                      <Grid item xs={12} sm={6}>
                          <TextField fullWidth label="Latitude" variant="outlined" value={newBus.lat} onChange={(e) => setNewBus({ ...newBus, lat: e.target.value })} required />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                          <TextField fullWidth label="Longitude" variant="outlined" value={newBus.lon} onChange={(e) => setNewBus({ ...newBus, lon: e.target.value })} required />
                      </Grid>
                      <Grid item xs={12}>
                          <TextField fullWidth label="Bus Name" variant="outlined" value={newBus.name} onChange={(e) => setNewBus({ ...newBus, name: e.target.value })} required />
                      </Grid>
                      <Grid item xs={12}>
                          <TextField fullWidth label="Final Destination" variant="outlined" value={newBus.route} onChange={(e) => setNewBus({ ...newBus, route: e.target.value })} required />
                      </Grid>
                      {newBus.routes.map((route, index) => (
    <Grid item xs={12} key={index} container spacing={1}>
        <Grid item xs={10}>
            <TextField
                fullWidth
                label={`Bus Stop ${index + 1}`}
                variant="outlined"
                value={route}
                onChange={(e) => handleRouteChange(index, e.target.value)}
                required
            />
        </Grid>
        <Grid item xs={2}>
            <IconButton onClick={() => handleRemoveRoute(index)} color="error">
                <RemoveCircleOutlineIcon />
            </IconButton>
        </Grid>
    </Grid>
))}

                      <Grid item xs={12}>
                          <IconButton onClick={handleAddRoute}>
                              <AddCircleOutlineIcon />
                          </IconButton>
                      </Grid>
                      <Grid item xs={12}>
                          <TextField fullWidth label="Status" variant="outlined" value={newBus.status} onChange={(e) => setNewBus({ ...newBus, status: e.target.value })} required />
                      </Grid>
                      <Grid item xs={12}>
                          <TextField fullWidth label="Passcode" variant="outlined" value={newBus.pass} onChange={(e) => setNewBus({ ...newBus, pass: e.target.value })} required />
                      </Grid>
                      <Grid item xs={12}>
                          <Button type="submit" variant="contained" color="primary" fullWidth>Add Bus</Button>
                      </Grid>
                  </Grid>
              </form>
          </Paper>
      </Grid>
      <div style={{height:'10vh'}}></div>
  </Container>
);
}

export default AddBus;

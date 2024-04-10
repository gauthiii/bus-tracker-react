import React,{useState, useEffect } from 'react';
import { Button, TextField, FormControl, InputLabel, Select, MenuItem, Container, Grid, Paper, Typography, Box  } from '@mui/material';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

function AddBus() {
   

    const [newBus, setNewBus] = useState({
        lat: '',
        lon: '',
        name: '',
        route: '',
        status: ''
      });

      const history = useHistory();

      useEffect(() => {
        // Check if the user's email is not admin@admin.com
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail !== "admin@admin.com") {
            history.push('/'); // Redirect to the root route if the user is not an admin
        }
    }, [history]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          await axios.post('http://localhost:5000/api/bus-locations', newBus);
          alert('Bus added successfully');
          setNewBus({ lat: '', lon: '', name: '', route: '', status: '' }); // Reset form
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
              <Typography variant="h6" style={{ marginBottom: '20px' }}>Add New Bus Location</Typography>
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
         <FormControl fullWidth variant="outlined">
           <InputLabel>Route</InputLabel>
           <Select value={newBus.route} onChange={(e) => setNewBus({ ...newBus, route: e.target.value })} label="Route" required>
             {['Tambaram', 'Chrompet', 'Pallavaram', 'Tirusulam', 'Nanganallur', 'Meenambakkam', 'Alandur', 'Guindy', 'Ashok Nagar', 'Valasaravakkam', 'Vadapalani', 'Koyambedu'].map(route => (
               <MenuItem key={route} value={route}>{route}</MenuItem>
             ))}
           </Select>
         </FormControl>
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

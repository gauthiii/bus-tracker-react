import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, FormControl, InputLabel, Select, MenuItem, Container, Grid, Paper, Typography, Box  } from '@mui/material';
import BusList from './BusList';
import BusTracker from './BusTracker';
import { API_URL } from './App'; 

function Dashboard() {
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [newBus, setNewBus] = useState({
    lat: '',
    lon: '',
    name: '',
    route: '',
    status: ''
  });
  const [userDetails, setUserDetails] = useState({});

  // Assuming you're storing the user's email in local storage upon login
  const userEmail = localStorage.getItem('userEmail'); // Adjust according to your storage key

  useEffect(() => {
    fetchBuses();
    fetchUserDetails();
  }, []);

  const fetchBuses = async () => {
    console.log(userEmail)
    try {
      const response = await axios.get(`${API_URL}/api/bus-locations`);
      setBuses(response.data);
    } catch (error) {
      console.error('Error fetching buses:', error);
    }
  };

  const fetchUserDetails = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/users/details`, { params: { email: userEmail } });
        setUserDetails(response.data);
    } catch (error) {
        console.error('Error fetching user details:', error);
    }
};

  const handleSignOut = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    localStorage.removeItem('userEmail'); // Consider removing the email as well
    window.location = '/userOrDriver'; // Redirect to login page
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/bus-locations`, newBus);
      alert('Bus added successfully');
      setNewBus({ lat: '', lon: '', name: '', route: '', status: '' }); // Reset form
      fetchBuses(); // Re-fetch buses to update the list
    } catch (error) {
      console.error('Error adding bus:', error);
      alert('Failed to add bus');
    }
  };

  return (
    <div >
      <Box className="dashbback"></Box>
       {/* Navigation Bar */}
       <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper style={{ padding: '10px' , backgroundColor:'',borderRadius:'0px'}}>
             <Button> Hello {userDetails.role==="driver" && userDetails.email==="admin@admin.com"?"admin":userDetails.role} </Button>
              <Button variant="text" color="inherit" href="/">Home</Button>
              <Button variant="text" color="inherit" href="/profile">Profile</Button>
              <Button variant="text" color="inherit" href="/settings">Settings</Button>
              {userEmail==="admin@admin.com" && <Button variant="text" color="inherit" href="/admin">Admin Panel</Button>}
              <Button onClick={handleSignOut} variant="text" color="inherit">Sign Out</Button>
            </Paper>
          </Grid>
        </Grid>
        {/* Dashboard Content */}
    <Container style={{padding:"40px"}} maxWidth="2g">
      <Grid container spacing={3}>
        <Grid item xs={12} container>
          <Grid item xs={12} md={4}>
            <BusList buses={buses} onBusSelect={setSelectedBus} />
          </Grid>
          <Grid item xs={12} md={8} style={{paddingLeft:"50px"}}>
            <BusTracker selectedBus={selectedBus} buses={buses} />
          </Grid>
        </Grid>

        {/* Show this part only if the user is admin */}
        {1===2  && (
          <Grid item xs={12}>
            <Paper elevation={3} style={{ padding: '20px' }}>
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
        )}
      </Grid>
      {/* {userEmail==="admin@admin.com" && (<><Button onClick={() => {window.location='./admin'}} variant="contained" color='warning'  style={{ marginTop: '20px', width:"200px" }}>Go to my Admin Panel</Button><br></br></>)} */}
      {/* {userEmail==="admin@admin.com" && (<><Button onClick={() => {window.location='./profile'}} variant="contained" color="success"  style={{ marginTop: '20px', width:"200px" }}>My Profile</Button><br></br></>)} */}
      {/* <Button onClick={handleSignOut} variant="contained" color="primary" style={{ marginTop: '20px', width:"200px" }}>Sign Out</Button> */}
    </Container>
    </div>
  );
}

export default Dashboard;







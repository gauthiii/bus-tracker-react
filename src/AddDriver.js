import React,{useState, useEffect } from 'react';
import { Button, TextField, FormControl, InputLabel, Select, MenuItem, Container, Grid, Paper, Typography, Box  } from '@mui/material';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from './App'; 

function AddDriver() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [passcode, setPasscode] = useState('');
   

   

      const history = useHistory();

      useEffect(() => {
        // Check if the user's email is not admin@admin.com
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail !== "admin@admin.com") {
            history.push('/'); // Redirect to the root route if the user is not an admin
        }

      
          
    }, [history]);

    const isValidEmail = email => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      };
      
      const isValidName = name => name.trim() !== '';
      
      const isValidPasscode = passcode => /^[0-9]{6}$/.test(passcode);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValidEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }
        if (!isValidName(name)) {
            alert("Name cannot be blank.");
            return;
        }
        if (!isValidPasscode(passcode)) {
            alert("Passcode must be exactly 6 digits.");
            return;
        }

        const driverDetails = { email, password, name, passcode };

        try {

            const response = await axios.post(`${API_URL}/api/register1`, driverDetails);
            alert('Driver added successfully');
            // Reset form fields
            setEmail('');
            setPassword('');
            setName('');
            setPasscode('');
          
        } catch (error) {
          console.error('Error adding driver:', error);
          alert('Failed to add driver');
        }
      };

    return (
        <Container component="main" maxWidth="xs">
            <div style={{height:'25vh'}}></div>
            <Grid item xs={12}>
            <Paper elevation={3} style={{ padding: '20px', backgroundColor:'rgba(0, 0, 0, 0.85)' }}>
              <Typography variant="h6" style={{ marginBottom: '20px' }}>Add New Driver</Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  {/* Form fields */}
                   {/* Form fields */}
     
       
       <Grid item xs={12}>
         <TextField fullWidth label="Email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)}  required />
       </Grid>
       <Grid item xs={12}>
         <TextField fullWidth label="Password" variant="outlined"  type="password"  value={password} onChange={(e) => setPassword(e.target.value)}  required />
       </Grid>
       <Grid item xs={12}>
         <TextField fullWidth label="Driver Name" variant="outlined" value={name} onChange={(e) => setName(e.target.value)}  required />
       </Grid>
       <Grid item xs={12}>
         <TextField fullWidth label="6-Digit Passcode" variant="outlined" value={passcode} onChange={(e) => setPasscode(e.target.value)}  required />
       </Grid>
       <Grid item xs={12}>
         <Button type="submit" variant="contained" color="primary" fullWidth>Register Driver</Button>
       </Grid>
                  {/* ... */}
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Container>
    );
}

export default AddDriver;

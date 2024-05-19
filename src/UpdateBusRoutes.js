import React, { useState, useEffect } from 'react';
import { Button, TextField, Container, Grid, Paper, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import { API_URL } from './App';
import { useHistory } from 'react-router-dom';

function UpdateBusRoutes() {

    const [buses, setBuses] = useState([]);
    const [selectedBus, setSelectedBus] = useState(null);
    const [newRoutes, setNewRoutes] = useState('');
    const history = useHistory();

    // Fetch buses from the API
    useEffect(() => {

          // Check if the user's email is not admin@admin.com
          const userEmail = localStorage.getItem('userEmail');
          if (userEmail !== "admin@admin.com") {
              history.push('/'); // Redirect to the root route if the user is not an admin
          }

        axios.get(`${API_URL}/api/bus-locations`)
            .then(response => {
                setBuses(response.data);
            })
            .catch(error => console.error('Error fetching buses:', error));
    }, [history]);
 
    const handleBusSelect = (bus) => {
        setSelectedBus(bus);
        setNewRoutes(bus.routes.join(', ')); // Assuming 'routes' is an array of stops
    };

    const handleRoutesChange = (event) => {
        setNewRoutes(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedRoutes = newRoutes.split(',').map(route => route.trim());
        
        try {
            await axios.put(`${API_URL}/api/bus-locations/${selectedBus.id}`, {
                ...selectedBus,
                routes: updatedRoutes
            });
            alert('Bus routes updated successfully');
            // Refresh the list or handle updates locally
        } catch (error) {
            console.error('Error updating bus routes:', error);
            alert('Failed to update bus routes');
        }
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h6" sx={{ margin: 2 }}>
                Update Bus Routes
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3}>
                        <List>
                            {buses.map(bus => (
                                <ListItem key={bus.id} button onClick={() => handleBusSelect(bus)}>
                                    <ListItemText primary={bus.name} secondary={`Route: ${bus.route}`} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    {selectedBus && (
                        <Paper elevation={3} style={{ padding: '20px' }}>
                            <Typography variant="h6">Update Routes for {selectedBus.name}</Typography>
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    fullWidth
                                    label="Routes (comma-separated)"
                                    variant="outlined"
                                    value={newRoutes}
                                    onChange={handleRoutesChange}
                                    required
                                    margin="normal"
                                />
                                <Button type="submit" variant="contained" color="primary" fullWidth>
                                    Update Routes
                                </Button>
                            </form>
                        </Paper>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
}

export default UpdateBusRoutes;

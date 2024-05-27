import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField,List,ListItem,ListItemText, FormControl, InputLabel, Select, MenuItem, Container, Grid, Paper, Typography, Box  } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { API_URL } from './App';

function UpdateBusRoutes() {
    const [buses, setBuses] = useState([]);
    const [selectedBus, setSelectedBus] = useState(null);
    const [newRoutes, setNewRoutes] = useState('');
    const [stops, setStops] = useState('');
    const history = useHistory();

    useEffect(() => {
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail !== "admin@admin.com") {
            history.push('/'); // Redirect if not admin
        }

        axios.get(`${API_URL}/api/bus-locations`)
            .then(response => setBuses(response.data))
            .catch(error => console.error('Error fetching buses:', error));
    }, [history]);

    const handleBusSelect = (bus) => {
        setSelectedBus(bus);
        setNewRoutes(bus.routes.join(', '));
        setStops(bus.stopsCompleted);
    };

    const handleRoutesChange = (event) => {
        setNewRoutes(event.target.value);
    };

    const handleStopsChange = (event) => {
        setStops(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedRoutes = newRoutes.split(',').map(route => route.trim());
        
        try {
            await axios.put(`${API_URL}/api/bus-locations/${selectedBus.id}`, {
                routes: updatedRoutes,
                stopsCompleted: parseInt(stops)  // Ensure that stopsCompleted is sent as an integer
            });
            alert('Bus routes updated successfully');

            axios.get(`${API_URL}/api/bus-locations`)
            .then(response => setBuses(response.data))
            .catch(error => console.error('Error fetching buses:', error));
            
        } catch (error) {
            console.error('Error updating bus routes:', error);
            alert('Failed to update bus routes');
        }
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h6" sx={{ margin: 2 }}>Update Bus Routes</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3}>
                        <List>
                            {buses.map(bus => (
                                <ListItem button key={bus.id} onClick={() => handleBusSelect(bus)}>
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
                            <Typography variant="h8" color="secondary">Final Destination: {selectedBus.route}</Typography>
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
                                <TextField
                                    fullWidth
                                    label="Stops Completed"
                                    type="number"
                                    variant="outlined"
                                    value={stops}
                                    onChange={handleStopsChange}
                                    required
                                    margin="normal"
                                />
                                <Button type="submit" variant="contained" color="primary" fullWidth>Update Routes</Button>
                            </form>
                        </Paper>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
}

export default UpdateBusRoutes;

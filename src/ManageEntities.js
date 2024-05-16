import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, List, ListItem, ListItemText, ListItemSecondaryAction, Typography } from '@mui/material';
import axios from 'axios';
import { API_URL } from './App'; 

function ManageEntities() {
    const [users, setUsers] = useState([]);
    const [buses, setBuses] = useState([]);

    useEffect(() => {
        fetchUsers();
        fetchBuses();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/users`);
            // Filter the users to include only those whose role is 'driver' and email is not 'admin@admin.com'
            const drivers = response.data.filter(user => user.role === 'driver' && user.email !== 'admin@admin.com');
            setUsers(drivers);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            // Handle errors as appropriate for your application
        }
    };
    

    const fetchBuses = async () => {
        const response = await axios.get(`${API_URL}/api/bus-locations`);
        setBuses(response.data);
    };

    const deleteUser = async (userId) => {
        await axios.delete(`${API_URL}/api/users/${userId}`);
        fetchUsers();
        alert("User Deleted!!");
    };

    const deleteBus = async (busId) => {

        try {
            const response = await axios.delete(`${API_URL}/api/bus-locations/${busId}`);
            console.log(response.data);
            fetchBuses();
            alert("Bus Deleted!!");
        } catch (error) {
            console.error('Error deleting the bus:', error);
        }

    
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <Card style={{ width: '80vw', background: '#333', color: 'white' }}>
                <CardContent>
                    <Typography variant="h4" component="h2" gutterBottom style={{ textAlign: 'center', color: '#fff' }}>
                        Manage Drivers and Buses
                    </Typography>
                    <Typography variant="h6" style={{ marginTop: '20px' }}>Drivers</Typography>
                    <List>
                        {users.map(user => (
                            <ListItem key={user._id} style={{ background: '#000000', marginBottom: '10px', borderRadius:"10px" }}>
                                <ListItemText primary={user.name} secondary={user.email} />
                                <ListItemSecondaryAction>
                                    <Button color="primary" variant="contained" onClick={() => deleteUser(user._id)}>Delete</Button>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                    <Typography variant="h6" style={{ marginTop: '20px' }}>Buses</Typography>
                    <List>
                        {buses.map(bus => (
                            <ListItem key={bus.id} style={{ background: '#000000', marginBottom: '10px', borderRadius:"10px" }}>
                                <ListItemText primary={bus.name} secondary={`Route: ${bus.route}`} />
                                <ListItemSecondaryAction>
                                    <Button color="warning" variant="contained" onClick={() => deleteBus(bus.id)}>Delete</Button>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            </Card>
        </div>
    );
}

export default ManageEntities;

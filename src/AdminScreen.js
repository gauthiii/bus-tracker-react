import React from 'react';
import { Button, Container } from '@mui/material';
import { useHistory } from 'react-router-dom';

function AdminScreen() {
    const history = useHistory();

    const navigateToAddDriver = () => history.push('/add-driver'); // Adjust the route as needed
    const navigateToAddBus = () => history.push('/add-bus'); // Adjust the route as needed
    const navigateToDashboard = () => history.push('/?userType=admin'); // Adjust the route as needed

    return (
        <Container component="main" maxWidth="xs">
            <h1>Admin Panel</h1>
            <Button variant="contained" color="primary" fullWidth onClick={navigateToAddDriver} style={{ marginBottom: '10px' }}>
                Add Driver
            </Button>
            <Button variant="contained" color="secondary" fullWidth onClick={navigateToAddBus} style={{ marginBottom: '10px' }}>
                Add Bus
            </Button>
            <Button variant="contained" color="success" fullWidth onClick={navigateToDashboard}>
                View Dashboard
            </Button>
        </Container>
    );
}

export default AdminScreen;

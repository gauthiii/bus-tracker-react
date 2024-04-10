import React from 'react';
import { Button, Container } from '@mui/material';
import { useHistory } from 'react-router-dom';

function AdminScreen() {
    const history = useHistory();

    const navigateToAddDriver = () => history.push('/add-driver'); // Adjust the route as needed
    const navigateToAddBus = () => history.push('/add-bus'); // Adjust the route as needed
    const navigateToDashboard = () => history.push('/?userType=admin'); // Adjust the route as needed

    return (
        <div style={{backgroundColor:'rgba(0, 0, 0, 0.75)',width:'100%',height:'100vh'}}>
        <Container component="main" maxWidth="xs">
            <div style={{height:'20vh'}}></div>
            <h1 style={{textAlign:'center',marginBottom: '50px', fontFamily:"IBM Plex Serif"}}>Admin Panel</h1>
            <Button variant="contained" color="primary" fullWidth onClick={navigateToAddDriver} style={{ marginBottom: '20px' }}>
                Add Driver
            </Button>
            <Button variant="contained" color="secondary" fullWidth onClick={navigateToAddBus} style={{ marginBottom: '20px' }}>
                Add Bus
            </Button>
            <Button variant="contained" color="success" fullWidth onClick={navigateToDashboard}>
                View Dashboard
            </Button>
        </Container>
        </div>
    );
}

export default AdminScreen;

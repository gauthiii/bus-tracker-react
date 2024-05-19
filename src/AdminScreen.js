import React, {useEffect} from 'react';
import { Button, Container } from '@mui/material';
import { useHistory } from 'react-router-dom';

function AdminScreen() {
    const history = useHistory();

    const navigateToAddDriver = () => history.push('/add-driver'); // Adjust the route as needed
    const navigateToAddBus = () => history.push('/add-bus'); // Adjust the route as needed
    const navigateToUpdateBus = () => history.push('/update-bus'); // Adjust the route as needed
    const navigateToDashboard = () => history.push('/?userType=admin'); // Adjust the route as needed
    const navigateToManage = () => history.push('/manage-entities?userType=admin'); 

    

      useEffect(() => {
        // Check if the user's email is not admin@admin.com
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail !== "admin@admin.com") {
            history.push('/'); // Redirect to the root route if the user is not an admin
        }
    }, [history]);

    const handleSignOut = () => {
        localStorage.removeItem('token'); // Remove token from localStorage
        localStorage.removeItem('userEmail'); // Consider removing the email as well
        window.location = '/userOrDriver'; // Redirect to login page
      };

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
            <Button variant="contained" color="success" fullWidth onClick={navigateToUpdateBus} style={{ marginBottom: '20px' }}>
                Update Bus
            </Button>
            <Button variant="contained" color="secondary" fullWidth onClick={navigateToDashboard} style={{ marginBottom: '20px' }}>
                View Dashboard
            </Button>
            <Button variant="contained" color="warning" fullWidth onClick={navigateToManage} style={{ marginBottom: '20px' }}>
                Manage Entities
            </Button>
            <Button onClick={handleSignOut} variant="contained" color="primary" style={{ marginTop: '20px' }}>Sign Out</Button>
        </Container>
        </div>
    );
}

export default AdminScreen;

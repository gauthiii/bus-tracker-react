import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Container } from '@mui/material';

function UserOrDriver() {
    let history = useHistory();

    const navigateToLogin = (userType) => {
        history.push(`/login?userType=${userType}`);
    };

    return (
        <Container component="main" maxWidth="xs" style={{ marginTop: '40vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Button variant="contained" color="primary" onClick={() => navigateToLogin('user')} style={{ marginBottom: 50,width:200 }}>
                I'm a User
            </Button>
            <Button variant="contained" color="secondary" onClick={() => navigateToLogin('driver')} style={{ marginBottom: 20,width:200 }}>
                I'm a Driver
            </Button>
        </Container>
    );
}

export default UserOrDriver;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, Box, Card, CardContent, CardActions, Divider } from '@mui/material';
import { API_URL } from './App'; 

function Profile() {
    const [profile, setProfile] = useState({});
    const userEmail = localStorage.getItem('userEmail');

    const  id = "id" + Math.random().toString(16).slice(2)

    const fetchUserDetails = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/users/details`, { params: { email: userEmail } });
            setProfile(response.data);
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    

    useEffect(() => {
        fetchUserDetails();
    }, []); 

    const handleSubmit = async (e) => {

        window.location = '/'

        e.preventDefault();
        // try {
        //     await axios.post(`${API_URL}/api/set-details`, profile, {
        //         headers: {
        //             Authorization: `Bearer ${localStorage.getItem('token')}`,
        //         },
        //     });
        //     alert('Profile updated successfully!');
        // } catch (error) {
        //     console.error('Error updating profile:', error);
        //     alert('Failed to update profile.');
        // }
    };

    return (
        <Container component="main" maxWidth="xs">
            
            <Card sx={{
                marginTop: 8,
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                color: "white",
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}>
                <Typography component="h1" variant="h5" gutterBottom>
                    Profile
                </Typography>
                <Divider style={{ backgroundColor: 'gray' }} />
                <CardContent>
                    <Typography variant="subtitle1"><strong>User ID:</strong> {id}</Typography>
                    <Typography variant="subtitle1"><strong>Email:</strong> {profile.email}</Typography>
                    <Typography variant="subtitle1"><strong>Name:</strong> {profile.name}</Typography>
                    <Typography variant="subtitle1"><strong>Role:</strong> {profile.role}</Typography>
                    {/* <Typography variant="subtitle1"><strong>Passcode:</strong> {profile.passcode}</Typography> */}
                </CardContent>
                <Divider style={{ backgroundColor: 'gray' }} />
                <CardActions>
                    <Button onClick={handleSubmit} fullWidth variant="contained" sx={{ mt: 1, mb: 2 }}>
                        Go back to Dashboard
                    </Button>
                </CardActions>
            </Card>
        </Container>
    );
}

export default Profile;

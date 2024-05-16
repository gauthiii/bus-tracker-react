import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Box, Typography } from '@mui/material';
import { API_URL } from './App'; 

function Profile() {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        passcode: '',
    });

    const fetchProfile = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/profile`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/set-details`, profile, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile.');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box

            className="profileBox"
                sx={{
                    marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: 'black',
        backgroundSize: 'cover', // Cover the entire Box area
        backgroundPosition: 'center', // Center the background image
        backgroundRepeat: 'no-repeat', // Do not repeat the image
        width: '100%', // Ensure the Box occupies the intended width, adjust as needed
        padding: '20px', // Add some padding inside the Box
        borderRadius: '8px', // Optional: round the corners of the Box
                }}
            >
                <Typography component="h1" variant="h5">
                    Profile
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Name"
                        name="name"
                        autoComplete="name"
                        autoFocus
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="passcode"
                        label="Passcode"
                        // type="password"
                        id="passcode"
                        autoComplete="current-passcode"
                        value={profile.passcode}
                        onChange={(e) => setProfile({ ...profile, passcode: e.target.value })}
                        inputProps={{ maxLength: 6 }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Update Profile
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default Profile;

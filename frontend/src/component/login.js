import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import Navbar from './Navbar';
import axios from 'axios'; // Import axios for making API requests

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            // const response = await axios.post('http://localhost:9000/api/signin', {
            //     email,
            //     password,
            // });

            const config = {
                method: "post",
                url: `http://localhost:9000/api/signin`,
                headers: {
                  "Content-Type": "application/json",
                },
                data: {
                  email: email,
                  password: password,
                },
              };

            // const { user, token } = response.data;
            const apiResponse = await axios.request(config);
            const responseData = apiResponse.data;
            const token = responseData.token;
            const role = responseData.user.role;
            //console.log(apiResponse);
            // Store the token and user role in localStorage or state management
            localStorage.setItem('token', token);
            localStorage.setItem('userRole', role);
            //console.log("role", role);

            // Redirect to an authorized page
            window.location.href = '/home';
            // You can use React Router for navigation
            // history.push('/dashboard');
        } catch (error) {
            // Handle authentication error
            console.error('Authentication failed:', error);
        }
    };

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#500001' }}>
                <Typography variant="h4" style={{ marginBottom: '50px', color: 'white', fontFamily: 'Crimson Pro' }}>
                    Aggies In Tech
                </Typography>
                <div style={{ width: '530px', height: '203px', backgroundColor: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px', borderRadius: '5px' }}>
                    <TextField
                        style={{ width: '390px', height: '50px', marginBottom: '20px' }}
                        placeholder="Email Address"
                        name="email"
                        label="Email Address"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        style={{ width: '390px', height: '50px', marginBottom: '20px' }}
                        placeholder="Password"
                        name="password"
                        label="Password"
                        variant="outlined"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button variant="contained" style={{ width: '400px', height: '60px', backgroundColor:'#500001', color: 'white', borderRadius: '5px' }} onClick={handleLogin}>
                        Login
                    </Button>
                </div>
            </div>
        </>
    );
};

export default Login;

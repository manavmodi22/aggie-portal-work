import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import { useLocation } from 'react-router-dom';


const CodeVerification = () => {
    const [code, setCode] = useState('');
    const location = useLocation();
    const [email, setEmail] = useState(location.state?.userEmail || '');
    //const [email, setEmail] = useState(''); // Store the email of the user for which we are verifying the code
    const [message, setMessage] = useState('');

    const handleVerify = async () => {
        try {
            const config = {
                method: "post",
                url: `http://localhost:9000/api/verify-code`, // Assuming you've created this endpoint in your backend
                headers: {
                  "Content-Type": "application/json",
                },
                data: {
                  email: email,
                  code: code,
                },
            };

            const apiResponse = await axios.request(config);
            setMessage(apiResponse.data.message);
        } catch (error) {
            setMessage(error.response.data.message || 'Verification failed.');
            console.error('Verification failed:', error);
        }
    };

    return (
        <div style={{ /*... similar styles to your signup and verify pages...*/ }}>
            <Typography variant="h4" style={{ marginBottom: '50px', color: 'white', fontFamily: 'Crimson Pro' }}>
                Aggies In Tech - Code Verification
            </Typography>
            <TextField
                style={{ /*... some styles ...*/ }}
                placeholder="Enter Verification Code"
                name="code"
                label="Verification Code"
                variant="outlined"
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />
            <Button variant="contained" style={{ /*... some styles ...*/ }} onClick={handleVerify}>
                Verify Code
            </Button>
            <Typography variant="h6" style={{ marginTop: '20px' }}>
                {message}
            </Typography>
        </div>
    );
};

export default CodeVerification;

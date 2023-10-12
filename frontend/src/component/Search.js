import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Card, CardContent, Typography } from '@mui/material';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [message, setMessage] = useState('No search done yet');
    const userRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('token');

    const handleSearch = async () => {
        // Scenario 2: Check if the search field is empty
        if (!query.trim()) {
            setMessage('Nothing was searched');
            setResults([]);
            return;
        }

        try {
            let apiResponse;

            if (userRole === '1') {
                const config = {
                    method: "get",
                    url: `http://localhost:9000/api/employees/company/${query}`,
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  };
                apiResponse = await axios.request(config);
            } 
            else if (userRole === '2') {
                const config = {
                    method: "get",
                    url: `http://localhost:9000/api/students?skills=${query}`,
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                  };
                apiResponse = await axios.request(config);
            }

            const dataList = userRole === '1' ? apiResponse.data.employees : apiResponse.data.students;

            // Scenario 1: If there are no results
            if (!dataList || dataList.length === 0) {
                setMessage('No Results Found');
                setResults([]);
            } else {
                // Scenario 4: On a successful search
                console.log(dataList);
                setResults(dataList);
                setMessage(''); // reset the message
            }
        } catch (error) {
            console.error('Search failed:', error);
            setMessage('Something went wrong');
            setResults([]);
        }
    };

    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', fontFamily: 'Crimson Pro' }}>
            
            <TextField
                name='query'
                variant="outlined"
                placeholder={userRole === '2' ? "Search for skills like python, leadership, PowerBI, etc." : "Search for companies like Apple, Disney"}
                value={query}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        handleSearch();
                    }
                }}
                onChange={(e) => setQuery(e.target.value)}
                style={{ marginBottom: '10px', width: '590px', height: '60px', backgroundColor: 'white', color: 'black', borderRadius: '5px'}}
                //InputProps={{ style: { color: 'black' } }}
            />
            
            <Button variant="contained" color="primary" onClick={handleSearch} style={{ marginBottom: '20px', backgroundColor: 'white', color: 'black', borderRadius: '5px' }}>
                Search
            </Button>
            
            <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 250px)', width: '100%' }}>
                {results.length === 0 && <Typography>{message}</Typography>}
                {results.length > 0 && results.map((result, index) => (
                    <Card key={index} style={{ marginBottom: '10px', backgroundColor: 'white', color: '#50001', width: '510px', height: '160px', borderRadius: '10px' }}>
                        <CardContent>
                            {userRole === '1' && (
                                <div>
                                    <Typography>Name: {result.employeeName}</Typography>
                                    <Typography>Email: {result.email}</Typography>
                                    <Typography>Phone: {result.phone}</Typography>
                                </div>
                            )}
                            {userRole === '2' && (
                                <div>
                                    <Typography>Name: {result.studentName}</Typography>
                                    <Typography>Email: {result.email}</Typography>
                                    <Typography>Phone: {result.phone}</Typography>
                                    <Typography>Major: {result.major}</Typography>
                                    <Typography>Degree: {result.degree}</Typography>
                                    <Typography>Skills: {result.skills.join(', ')}</Typography>
                                    <ul>
                                        {result.skills.map((skill, sIndex) => (
                                            <li key={sIndex}>{skill}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
    
};

export default Search;

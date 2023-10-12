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
        try {
            if (userRole === '1') {
                const config = {
                    method: "get",
                    url: `http://localhost:9000/api/employees/company/${query}`,
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  };

                const apiResponse = await axios.request(config);
                const employees = apiResponse.data.employees;
                console.log(employees);
                setResults(employees);
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

                const apiResponse = await axios.request(config);
                const students = apiResponse.data.students;
                console.log(apiResponse.data.students);
                setResults(students);
            }
        } catch (error) {
            console.error('Search failed:', error);
            setMessage('Something went wrong');
        }
    };

    return (
        <div>
            <TextField
                name='query'
                label="Search"
                variant="outlined"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <Button variant="contained" onClick={handleSearch}>Search</Button>

            <div>
                {results.length === 0 && <Typography>{message}</Typography>}

                {results.length > 0 && (
                    results.map((result, index) => (
                        <Card key={index} style={{ marginBottom: '10px' }}>
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
                                        <Typography>Skills:</Typography>
                                        <ul>
                                            {result.skills.map((skill, index) => (
                                                <li key={index}>{skill}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default Search;

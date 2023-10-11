import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, FormControl, InputLabel, MenuItem, Select, Typography, Container, Grid, Paper } from '@material-ui/core';

function RoleSelector() {
  const [selectedRole, setSelectedRole] = useState('');
  const history = useHistory();

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleLogin = () => {
    if (selectedRole === 'maysFaculty') {
      history.push('/faculty-login');
    } else if (selectedRole === 'employer') {
      history.push('/employer-login');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Select Your Role
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                id="role-select"
                value={selectedRole}
                onChange={handleRoleChange}
              >
                <MenuItem value="">Select Role</MenuItem>
                <MenuItem value="maysFaculty">Mays Faculty</MenuItem>
                <MenuItem value="employer">Employer</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
              Login
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default RoleSelector;

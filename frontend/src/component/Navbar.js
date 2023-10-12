import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios';

function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
    const token = localStorage.getItem('token');

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    window.location.href = '/profile';
  };

  const handleLogoutClick = async () => {
    // Handle the API call for logout.
    const config = {
        method: "get",
        url: `http://localhost:9000/api/logout`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

    const apiResponse = await axios.request(config);
    if (apiResponse.data.success == true){
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        window.location.href = '/';
    }
    // Clear the token and user role from localStorage or state management
    
  };

  return (
    <AppBar position="fixed" style={{ backgroundColor: '#782424', zIndex: 1000 }}>
        <Toolbar>
            <Typography variant="h6" style={{ fontFamily: 'Crimson Pro', flexGrow: 1 }}>
                Aggies In Tech
            </Typography>
            {token ? (
                <>
                    <IconButton onClick={handleMenuClick} color="inherit">
                        <AccountCircleIcon style={{
                            color: 'white',
                            marginRight: '10px',
                        }} />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleProfileClick}>View Profile</MenuItem>
                        <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
                    </Menu>
                </>
            ) : null}
        </Toolbar>
    </AppBar>
);
}

export default Navbar;

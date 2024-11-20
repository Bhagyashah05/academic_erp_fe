import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Avatar, Menu, MenuItem, IconButton } from '@mui/material';

const NavBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Guest', photo: '' };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); 
    window.location.reload(); 
  };

  return (
    <AppBar position="sticky" style={{ backgroundColor: 'black' }}>
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Welcome, {user.name.toUpperCase() || 'Guest'}!
        </Typography>

        <IconButton onClick={handleMenuOpen} style={{ padding: 4 ,width:"100px",backgroundColor:"black"}}>
          <Avatar
            alt={user.name}
            // src={user.photo || 'https://via.placeholder.com/150'}
            style={{ cursor: 'pointer' }}
          />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;

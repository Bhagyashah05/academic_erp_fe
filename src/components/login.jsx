import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../UserContext';
import iiitbImage from '../images/iiitb.jpeg';
import { login } from '../utils/api';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import '../App.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const loginData = {
      email: email,
      password: password,
    };

    try {
      const response = await login(loginData)
      console.log(response.data);
      setUser(response.data);
      navigate('/domain'); 
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
  sx={{
    minHeight: '100vh',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  }}
>
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: `url(${iiitbImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      filter: 'blur(5px)',
      zIndex: -1, 
    }}
  />
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          borderRadius: 2,
          maxWidth: 400,
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Admin Login
        </Typography>
        <form onSubmit={handleLogin}>
          <Box mb={2}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />
          </Box>
          {error && (
            <Box mb={2}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ marginBottom: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;

import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Outlet, redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';
import Navbar from './routes/Navbar';

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        light: '#32aaff',
        main: '#008cff',
        dark: '#0a79eb',
        contrastText: '#fff',
      },
      secondary: {
        light: '#fecd2b',
        main: '#ffb607',
        dark: '#ff7300',
        contrastText: '#000',
      },
      warning: {
        light: '#ee6e72',
        main: '#de1724',
        dark: '#d10924',
        contrastText: '#fff',
      },
    },
  });

  redirect('/');

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeProvider theme={theme}>
          <Navbar />
          <div className='App'>
            <Outlet />
            <ToastContainer />
          </div>
        </ThemeProvider>
      </LocalizationProvider>
    </>
  );
}

export default App;

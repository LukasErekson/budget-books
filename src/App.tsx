import React from 'react';
import './App.css';
import Navbar from './routes/Navbar';
import { Route, Routes } from 'react-router-dom';
import CategorizeTransactionsPage from './routes/CategorizeTransactionPage';
import BalanceSheetPage from './routes/BalanceSheetPage';
import ExpenseReportPage from './routes/ExpenseReportPage';
import AccountSettingsPage from './routes/AccountSettingsPage';
import { ToastContainer } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ThemeProvider, createTheme } from '@mui/material';

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

  return (
    <>
      <React.StrictMode>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ThemeProvider theme={theme}>
            <Navbar />
            <div className='App'>
              <Routes>
                <Route path='/' element={<CategorizeTransactionsPage />} />
                <Route
                  path='/categorize-transactions'
                  element={<CategorizeTransactionsPage />}
                />
                <Route path='/balance-sheet' element={<BalanceSheetPage />} />
                <Route path='/expense-report' element={<ExpenseReportPage />} />
                <Route
                  path='/account/settings'
                  element={<AccountSettingsPage />}
                />
              </Routes>
              <ToastContainer />
            </div>
          </ThemeProvider>
        </LocalizationProvider>
      </React.StrictMode>
    </>
  );
}

export default App;

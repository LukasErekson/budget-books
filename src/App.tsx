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

function App() {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
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
            <Route path='/account/settings' element={<AccountSettingsPage />} />
          </Routes>
          <ToastContainer />
        </div>
      </LocalizationProvider>
    </>
  );
}

export default App;

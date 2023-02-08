import React from 'react';
import './App.css';
import Navbar from './routes/Navbar';
import { Route, Routes } from 'react-router-dom';
import CategorizeTransactionsPage from './routes/CategorizeTransactionPage';
import BalanceSheetPage from './routes/BalanceSheetPage';
import ExpenseReportPage from './routes/ExpenseReportPage';
import AccountSettingsPage from './routes/AccountSettingsPage';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div className='App'>
      <Navbar />
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
  );
}

export default App;

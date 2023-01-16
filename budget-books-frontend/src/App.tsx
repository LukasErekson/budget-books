import React from 'react';
import './App.css';
import Navbar from './Routes/Navbar';
import { Route, Routes } from 'react-router-dom';
import CategorizeTransactionsPage from './Routes/CategorizeTransactionPage';
import BalanceSheetPage from './Routes/BalanceSheetPage';
import ExpenseReportPage from './Routes/ExpenseReportPage';
import AccountSettingsPage from './Routes/AccountSettingsPage';

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
    </div>
  );
}

export default App;

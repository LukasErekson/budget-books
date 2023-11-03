import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { setupStore } from './stores/store';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import './index.css';
import AccountSettingsPage from './routes/AccountSettingsPage';
import BalanceSheetPage from './routes/BalanceSheetPage';
import CategorizeTransactionsPage from './routes/CategorizeTransactionPage';
import ExpenseReportPage from './routes/ExpenseReportPage';

const rootElement = document.getElementById('root');

if (!rootElement) throw new Error('Failed to find the root element');
const root = createRoot(rootElement);

const AppContainer: React.FunctionComponent = () => (
  <Provider store={setupStore()}>
    <App />
  </Provider>
);
const router = createBrowserRouter([
  {
    path: '/',
    element: <AppContainer />,
    children: [
      {
        path: '/',
        element: <CategorizeTransactionsPage />,
      },
      {
        path: '/categorize-transactions',
        element: <CategorizeTransactionsPage />,
      },
      {
        path: '/balance-sheet',
        element: <BalanceSheetPage />,
      },
      {
        path: '/expense-report',
        element: <ExpenseReportPage />,
      },
      {
        path: '/account',
        children: [
          {
            path: '/account/settings',
            element: <AccountSettingsPage />,
          },
        ],
      },
    ],
  },
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

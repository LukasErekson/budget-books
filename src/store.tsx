import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './Components/AccountComponents/accountSlice';
import accountTypeReducer from './Components/AccountTypeComponents/accountTypeSlice';
import pageSliceReducer from './Components/PageComponents/PageSlice';
import transactionReducer from './Components/TransactionComponents/transactionSlice';

const store = configureStore({
  reducer: {
    accounts: accountReducer,
    accountTypes: accountTypeReducer,
    pageSlice: pageSliceReducer,
    transactions: transactionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
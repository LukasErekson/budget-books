import { configureStore } from '@reduxjs/toolkit';
import accountReducer from '../features/Accounts/stores/accountSlice';
import accountTypeReducer from '../features/AccountTypes/stores/accountTypeSlice';
import pageSliceReducer from './PageSlice';
import transactionReducer from '../features/Transactions/stores/transactionSlice';

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

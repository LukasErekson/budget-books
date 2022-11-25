import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './Components/AccountComponents/accountSlice';
import accountTypeReducer from './Components/AccountTypeComponents/accountTypeSlice';

const store = configureStore({
  reducer: {
    accounts: accountReducer,
    accountTypes: accountTypeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;

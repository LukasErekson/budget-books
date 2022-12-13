import { createSlice } from '@reduxjs/toolkit';
import Account from './accountTSTypes';

const initialAccounts: Account[] = [];

export const accountSlice = createSlice({
  name: 'accounts',
  initialState: {
    accounts: initialAccounts,
  },
  reducers: {
    loadAccounts: (state, action) => {
      const accounts: Account[] = action.payload;

      return {
        state,
        accounts: accounts,
      };
    },
  },
});

export const { loadAccounts } = accountSlice.actions;

export default accountSlice.reducer;

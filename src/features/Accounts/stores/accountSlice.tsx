import { createSlice } from '@reduxjs/toolkit';
import Account from '../types/types';

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

    updateAccountBalances: (state, action) => {
      const accountIDToBalances: { [id: number]: number } = action.payload;

      return {
        state,
        accounts: state.accounts.map((account: Account) => {
          if (account.id in accountIDToBalances) {
            return { ...account, balance: accountIDToBalances[account.id] };
          }
          return account;
        }),
      };
    },
  },
});

export const { loadAccounts, updateAccountBalances } = accountSlice.actions;

export default accountSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';

const initialAccounts: any[] = [];

export const accountSlice: any = createSlice({
  name: 'accounts',
  initialState: {
    accounts: initialAccounts,
  },
  reducers: {
    loadAccounts: (state, action) => {
      const accounts = action.payload;

      return {
        state,
        accounts: accounts,
      };
    },
  },
});

export const { loadAccounts } = accountSlice.actions;

export default accountSlice.reducer;

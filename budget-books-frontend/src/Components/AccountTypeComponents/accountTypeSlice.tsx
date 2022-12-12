import { createSlice } from '@reduxjs/toolkit';

const initialAccountTypes: any[] = [];
const initialAccountGroups: string[] = [];

export const accountTypeSlice = createSlice({
  name: 'accountTypes',
  initialState: {
    accountTypes: initialAccountTypes,
    accountGroups: initialAccountGroups,
  },
  reducers: {
    setAccountTypes: (state, action) => {
      const accountTypes: any[] = action.payload.accountTypes;
      const accountGroups: string[] = action.payload.accountGroups;

      return {
        state,
        accountTypes: accountTypes,
        accountGroups: accountGroups,
      };
    },
  },
});

export const { setAccountTypes } = accountTypeSlice.actions;

export default accountTypeSlice.reducer;

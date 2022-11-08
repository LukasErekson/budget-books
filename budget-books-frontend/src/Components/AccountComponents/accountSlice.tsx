import { createSlice } from '@reduxjs/toolkit';

export const accountSlice: any = createSlice({
    name: 'accounts',
    initialState: {
        accounts: [],
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

import { createSlice } from '@reduxjs/toolkit';
import Account from '../AccountComponents/accountTSTypes';

const initialActiveAccount: Account | any = {};

/**
 * Redux slice for general page state management that doesn't fit
 * logically into the other slices. e.g - Active Account for the
 * Categorize Transactions page.
 */
export const pageSlice = createSlice({
  name: 'pageSlice',
  initialState: {
    categorizationPage: {
      activeAccount: initialActiveAccount,
    },
  },
  reducers: {
    changeActiveAccount: (state, action) => {
      const newActiveAccount: Account = action.payload;
      return {
        ...state,
        categorizationPage: {
          ...state.categorizationPage,
          activeAccount: newActiveAccount,
        },
      };
    },
  },
});

export const { changeActiveAccount } = pageSlice.actions;

export default pageSlice.reducer;

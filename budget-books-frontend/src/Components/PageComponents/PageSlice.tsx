import { createSlice } from '@reduxjs/toolkit';
import Account from '../AccountComponents/accountTSTypes';

const homePage: string = 'Categorize Transactions';
const initialActiveAccount: Account | any = {};

export const pageSlice = createSlice({
  name: 'pageSlice',
  initialState: {
    activePage: homePage,
    activeAccount: initialActiveAccount,
  },
  reducers: {
    changeActivePage: (state, action) => {
      const newPage: string = action.payload.activePage;

      return { ...state, activePage: newPage };
    },
    changeActiveAccount: (state, action) => {
      const newActiveAccount: Account = action.payload;
      return { ...state, activeAccount: newActiveAccount };
    },
  },
});

export const { changeActivePage, changeActiveAccount } = pageSlice.actions;

export default pageSlice.reducer;
